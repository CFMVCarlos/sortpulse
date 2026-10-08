import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import type { AlgorithmMeta, Trace } from './types/sort';
import { fetchAlgorithms, fetchSortTrace } from './api/client';
import { ControlBar } from './components/ControlBar';
import { CanvasVisualizer } from './components/CanvasVisualizer';
import { AlgorithmInfoCard } from './components/AlgorithmInfoCard';
import type { BarState } from './components/CanvasVisualizer';
import { audioEngine } from './utils/audio';

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

  // Audio state
  const [isMuted, setIsMuted] = useState<boolean>(audioEngine.getMuted());

  // Ref for timer to clear it
  const timerRef = useRef<number | null>(null);
  const maxValRef = useRef<number>(100);

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

    maxValRef.current = Math.max(...newArr);

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

  const toggleMute = () => {
    setIsMuted(audioEngine.toggleMute());
  };

  const playStepAudio = useCallback((stepIndex: number, tempArray: number[]) => {
      if (!trace || stepIndex < 0 || stepIndex >= trace.steps.length) return;
      const s = trace.steps[stepIndex];
      if (s.type === 'compare' || s.type === 'swap') {
          const val = tempArray[s.indices[0]]; // play tone for first index involved
          audioEngine.playTone(val, maxValRef.current);
      } else if (s.type === 'overwrite' && s.value !== undefined) {
          audioEngine.playTone(s.value, maxValRef.current);
      }
  }, [trace]);

  // State machine for step execution
  useEffect(() => {
    if (!trace) return;

    if (currentStepIndex >= trace.steps.length && isPlaying) {
      setIsPlaying(false);
      setBarStates(new Array(currentArray.length).fill('sorted'));
      return;
    }

    const rebuildState = () => {
      let tempArray = [...trace.initial_array];
      let tempStates = new Array<BarState>(tempArray.length).fill('default');

      // Keep track of elements explicitly marked sorted
      const sortedIndices = new Set<number>();

      // Rebuild up to current step
      for (let i = 0; i <= currentStepIndex; i++) {
        if (i >= trace.steps.length) break;
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

    if (isPlaying) {
       playStepAudio(currentStepIndex, tempArray);
       timerRef.current = window.setTimeout(() => {
         setCurrentStepIndex(prev => prev + 1);
       }, speed);
    }

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, trace, speed, currentArray.length, playStepAudio]);

  const handleScrub = (step: number) => {
    setIsPlaying(false);
    if (trace) {
      setCurrentStepIndex(Math.min(Math.max(step, 0), trace.steps.length));
    }
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (trace && currentStepIndex < trace.steps.length) {
        // play tone for step if we advance
        let tempArray = [...trace.initial_array];
        for (let i = 0; i <= currentStepIndex + 1 && i < trace.steps.length; i++) {
             const s = trace.steps[i];
             if (s.type === 'swap') {
                 const [idx1, idx2] = s.indices;
                 [tempArray[idx1], tempArray[idx2]] = [tempArray[idx2], tempArray[idx1]];
             } else if (s.type === 'overwrite' && s.value !== undefined) {
                 const idx = s.indices[0];
                 tempArray[idx] = s.value;
             }
        }
        playStepAudio(currentStepIndex + 1, tempArray);
        setCurrentStepIndex(prev => prev + 1);
    }
  };

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
        currentStepIndex={currentStepIndex}
        totalSteps={trace ? trace.steps.length : 0}
        onScrub={handleScrub}
        onStepBackward={handleStepBackward}
        onStepForward={handleStepForward}
        isMuted={isMuted}
        onToggleMute={toggleMute}
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
