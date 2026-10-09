import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import type { AlgorithmMeta, Trace } from './types/sort';
import { SPEED_LEVELS } from './types/sort';
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
  const [speedLevel, setSpeedLevel] = useState<number>(3); // Level 3 corresponds to 8x speed

  // Audio state
  const [isMuted, setIsMuted] = useState<boolean>(audioEngine.getMuted());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Ref for timer to clear it
  const timerRef = useRef<number | null>(null);
  const maxValRef = useRef<number>(100);
  const cachedStateRef = useRef<{
    trace: Trace | null;
    stepIndex: number;
    array: number[];
    sortedIndices: Set<number>;
  }>({
    trace: null,
    stepIndex: -1,
    array: [],
    sortedIndices: new Set<number>(),
  });

  const loadAlgorithms = async () => {
    try {
      setErrorMessage(null);
      const algos = await fetchAlgorithms();
      setAlgorithms(algos);
      if (algos.length > 0) {
        setSelectedAlgorithm(algos[0].id);
      }
    } catch (error) {
      console.error("Failed to load algorithms:", error);
      setErrorMessage("Could not connect to the backend server. Ensure the server is running on :8080.");
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
    cachedStateRef.current = {
      trace: null,
      stepIndex: -1,
      array: [],
      sortedIndices: new Set<number>(),
    };
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
      setErrorMessage(null);
      const newTrace = await fetchSortTrace(selectedAlgorithm, currentArray);
      setTrace(newTrace);
      setCurrentStepIndex(0);
      cachedStateRef.current = {
        trace: null,
        stepIndex: -1,
        array: [],
        sortedIndices: new Set<number>(),
      };
      setIsPlaying(true);
    } catch (error) {
      console.error("Failed to fetch sort trace:", error);
      setErrorMessage("Failed to calculate sorting steps. Please try again.");
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
      } else if (s.type === 'mark_sorted' && s.indices.length > 0) {
          const val = tempArray[s.indices[0]];
          audioEngine.playTone(val, maxValRef.current);
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
      let tempArray: number[];
      const sortedIndices = new Set<number>();
      let startStep = 0;

      const cache = cachedStateRef.current;
      if (
        cache.trace === trace &&
        cache.stepIndex >= 0 &&
        cache.stepIndex <= currentStepIndex
      ) {
        tempArray = [...cache.array];
        cache.sortedIndices.forEach((idx) => sortedIndices.add(idx));
        startStep = cache.stepIndex + 1;
      } else {
        tempArray = [...trace.initial_array];
        startStep = 0;
      }

      let tempStates = new Array<BarState>(tempArray.length).fill('default');

      // Rebuild from startStep up to currentStepIndex
      for (let i = startStep; i <= currentStepIndex; i++) {
        if (i >= trace.steps.length) break;
        const s = trace.steps[i];

        if (s.type === 'compare') {
          if (i === currentStepIndex) {
            s.indices.forEach((idx) => (tempStates[idx] = 'comparing'));
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
            tempStates[idx] = 'swapping';
          }
        } else if (s.type === 'mark_sorted') {
          s.indices.forEach((idx) => {
            sortedIndices.add(idx);
            if (i === currentStepIndex) {
              tempStates[idx] = 'sorted';
            }
          });
        } else if (s.type === 'pivot') {
          if (i === currentStepIndex) {
            s.indices.forEach((idx) => (tempStates[idx] = 'pivot'));
          }
        }
      }

      // Ensure all previously marked sorted remain green
      sortedIndices.forEach((idx) => {
        if (tempStates[idx] === 'default') {
          tempStates[idx] = 'sorted';
        }
      });

      // Update cache for next tick
      cachedStateRef.current = {
        trace,
        stepIndex: currentStepIndex,
        array: [...tempArray],
        sortedIndices: new Set(sortedIndices),
      };

      return { tempArray, tempStates };
    };

    const { tempArray, tempStates } = rebuildState();

    setCurrentArray(tempArray);
    setBarStates(tempStates);

    if (isPlaying) {
       playStepAudio(currentStepIndex, tempArray);
       const config = SPEED_LEVELS[speedLevel] || SPEED_LEVELS[3];
       timerRef.current = window.setTimeout(() => {
         setCurrentStepIndex(prev => Math.min(prev + config.batch, trace.steps.length));
       }, config.delay);
    }

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, trace, speedLevel, currentArray.length, playStepAudio]);

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
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SortPulse</h1>
      </header>

      {errorMessage && (
        <div role="alert" style={{
          backgroundColor: '#fee2e2',
          borderBottom: '1px solid #f87171',
          color: '#991b1b',
          padding: '0.75rem 1rem',
          textAlign: 'center',
          fontWeight: 500,
          fontSize: '0.9rem'
        }}>
          {errorMessage}
        </div>
      )}

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
          cachedStateRef.current = {
            trace: null,
            stepIndex: -1,
            array: [],
            sortedIndices: new Set<number>(),
          };
        }}
        arraySize={arraySize}
        onArraySizeChange={handleArraySizeChange}
        onGenerateArray={(type) => generateArray(type, arraySize)}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        speedLevel={speedLevel}
        onSpeedLevelChange={setSpeedLevel}
        currentStepIndex={currentStepIndex}
        totalSteps={trace ? trace.steps.length : 0}
        onScrub={handleScrub}
        onStepBackward={handleStepBackward}
        onStepForward={handleStepForward}
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />

      <main className="app-main">
        <section className="visualizer-section">
          <CanvasVisualizer
            array={currentArray}
            barStates={barStates}
            height={360}
          />
          <div className="metrics-panel" aria-label="Sorting Metrics">
            <span className="metric-item">Step: <span className="metric-value">{trace ? `${currentStepIndex} / ${trace.steps.length}` : '0 / 0'}</span></span>
            <span className="metric-item">Comparisons: <span className="metric-value">{trace ? trace.comparisons : 0}</span></span>
            <span className="metric-item">Swaps: <span className="metric-value">{trace ? trace.swaps : 0}</span></span>
          </div>
        </section>

        <aside className="sidebar-section">
          <AlgorithmInfoCard algorithm={algorithms.find(a => a.id === selectedAlgorithm) || null} />
        </aside>
      </main>
    </div>
  );
}

export default App;
