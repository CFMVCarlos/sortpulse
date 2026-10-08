import { useState, useEffect, useRef } from 'react';
import './App.css';
import type { AlgorithmMeta, Trace } from './types/sort';
import { fetchAlgorithms, fetchSortTrace } from './api/client';
import { ControlBar } from './components/ControlBar';
import { CanvasVisualizer } from './components/CanvasVisualizer';
import { AlgorithmInfoCard } from './components/AlgorithmInfoCard';
import type { BarState } from './components/CanvasVisualizer';

function App() {
  const [algorithms, setAlgorithms] = useState<AlgorithmMeta[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('');

  // Array state
  const [arraySize, setArraySize] = useState<number>(50);
  const [currentArray, setCurrentArray] = useState<number[]>([]);
  const [barStates, setBarStates] = useState<BarState[]>([]);

  // Playback state
  const [trace, setTrace] = useState<Trace | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(50); // delay in ms

  // Ref for timer to clear it
  const timerRef = useRef<number | null>(null);

  const loadAlgorithms = async () => {
    try {
      const algos = await fetchAlgorithms();
      setAlgorithms(algos);
      if (algos.length > 0) {
        setSelectedAlgorithm(algos[0].id);
      }
    } catch (error) {
      console.error("Failed to load algorithms:", error);
    }
  };

  const generateArray = (type: 'random' | 'reverse' | 'nearly_sorted', size: number) => {
    let newArr: number[] = [];
    if (type === 'random') {
      for (let i = 0; i < size; i++) {
        newArr.push(Math.floor(Math.random() * 100) + 1);
      }
    } else if (type === 'reverse') {
      for (let i = size; i > 0; i--) {
        newArr.push(i);
      }
    } else if (type === 'nearly_sorted') {
      for (let i = 1; i <= size; i++) {
        newArr.push(i);
      }
      // Swap a few elements
      const swaps = Math.max(1, Math.floor(size * 0.1));
      for (let i = 0; i < swaps; i++) {
        const idx1 = Math.floor(Math.random() * size);
        const idx2 = Math.floor(Math.random() * size);
        [newArr[idx1], newArr[idx2]] = [newArr[idx2], newArr[idx1]];
      }
    }

    setCurrentArray(newArr);
    setBarStates(new Array(size).fill('default'));
    setTrace(null);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Initial load
  useEffect(() => {
    loadAlgorithms();
    generateArray('random', 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleArraySizeChange = (size: number) => {
    setArraySize(size);
    generateArray('random', size);
  };

  const startSorting = async () => {
    if (!selectedAlgorithm) return;

    try {
      const newTrace = await fetchSortTrace(selectedAlgorithm, currentArray);
      setTrace(newTrace);
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } catch (error) {
      console.error("Failed to fetch sort trace:", error);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      // If we finished playing or haven't started, fetch/reset
      if (!trace || currentStepIndex >= trace.steps.length) {
        startSorting();
      } else {
        setIsPlaying(true);
      }
    }
  };

  // State machine for step execution
  useEffect(() => {
    if (!isPlaying || !trace) return;

    if (currentStepIndex >= trace.steps.length) {
      setIsPlaying(false);
      // Mark all as sorted at the end
      setBarStates(new Array(currentArray.length).fill('sorted'));
      return;
    }

    // Keep previously sorted elements sorted (if we had a way to track them reliably here without full state rebuild)
    // A simple approach is to rely on step descriptions or just highlight the active ones.
    // For a more robust approach, we need to rebuild the full array state from step 0 to currentStepIndex.
    // For now, we will do a simple incremental update.

    // If we want accurate state rebuilding, we should rebuild `nextArray` from `trace.initial_array`
    // applying all steps up to `currentStepIndex`.

    const rebuildState = () => {
      let tempArray = [...trace.initial_array];
      let tempStates = new Array<BarState>(tempArray.length).fill('default');

      // Keep track of elements explicitly marked sorted
      const sortedIndices = new Set<number>();

      for (let i = 0; i <= currentStepIndex; i++) {
        const s = trace.steps[i];

        // Reset temporary states for this step
        if (i === currentStepIndex) {
          tempStates = tempStates.map((_, idx) => sortedIndices.has(idx) ? 'sorted' : 'default');
        }

        if (s.type === 'compare') {
          if (i === currentStepIndex) {
            s.indices.forEach(idx => tempStates[idx] = 'comparing');
          }
        } else if (s.type === 'swap') {
          const [idx1, idx2] = s.indices;
          [tempArray[idx1], tempArray[idx2]] = [tempArray[idx2], tempArray[idx1]];
          if (i === currentStepIndex) {
            tempStates[idx1] = 'swapping';
            tempStates[idx2] = 'swapping';
          }
        } else if (s.type === 'overwrite') {
          const idx = s.indices[0];
          if (s.value !== undefined) {
             tempArray[idx] = s.value;
          }
          if (i === currentStepIndex) {
            tempStates[idx] = 'swapping'; // Use swapping color for overwrites to highlight them
          }
        } else if (s.type === 'mark_sorted') {
          s.indices.forEach(idx => {
            sortedIndices.add(idx);
            if (i === currentStepIndex) {
               tempStates[idx] = 'sorted';
            }
          });
        } else if (s.type === 'pivot') {
          if (i === currentStepIndex) {
            s.indices.forEach(idx => tempStates[idx] = 'pivot');
          }
        }
      }

      // Ensure all previously marked sorted remain green
      sortedIndices.forEach(idx => {
         if (tempStates[idx] === 'default') {
             tempStates[idx] = 'sorted';
         }
      });

      return { tempArray, tempStates };
    };

    const { tempArray, tempStates } = rebuildState();

    setCurrentArray(tempArray);
    setBarStates(tempStates);

    timerRef.current = window.setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
    }, speed);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, trace, speed, currentArray.length]);


  return (
    <div className="App" style={{ fontFamily: 'sans-serif' }}>
      <header style={{ backgroundColor: '#2c3e50', color: 'white', padding: '1rem', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>SortPulse</h1>
      </header>

      <ControlBar
        algorithms={algorithms}
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmChange={(id) => {
          setSelectedAlgorithm(id);
          setTrace(null);
          setCurrentStepIndex(0);
          setIsPlaying(false);
          // Restore to initial state if a trace exists
          if (trace) {
              setCurrentArray([...trace.initial_array]);
              setBarStates(new Array(trace.initial_array.length).fill('default'));
          }
        }}
        arraySize={arraySize}
        onArraySizeChange={handleArraySizeChange}
        onGenerateArray={(type) => generateArray(type, arraySize)}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <CanvasVisualizer
        array={currentArray}
        barStates={barStates}
      />

      <AlgorithmInfoCard algorithm={algorithms.find(a => a.id === selectedAlgorithm) || null} />

      <div style={{ padding: '1rem', textAlign: 'center' }}>
        {trace && (
           <p>
             Step: {currentStepIndex} / {trace.steps.length} |
             Comparisons: {trace.comparisons} |
             Swaps: {trace.swaps}
           </p>
        )}
      </div>
    </div>
  );
}

export default App;
