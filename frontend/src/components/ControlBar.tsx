import React from 'react';
import type { AlgorithmMeta } from '../types/sort';

interface ControlBarProps {
    algorithms: AlgorithmMeta[];
    selectedAlgorithm: string;
    onAlgorithmChange: (id: string) => void;
    arraySize: number;
    onArraySizeChange: (size: number) => void;
    onGenerateArray: (type: 'random' | 'reverse' | 'nearly_sorted') => void;
    isPlaying: boolean;
    onTogglePlay: () => void;
    speed: number;
    onSpeedChange: (speed: number) => void;
    currentStepIndex: number;
    totalSteps: number;
    onScrub: (step: number) => void;
    onStepBackward: () => void;
    onStepForward: () => void;
    isMuted: boolean;
    onToggleMute: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
    algorithms,
    selectedAlgorithm,
    onAlgorithmChange,
    arraySize,
    onArraySizeChange,
    onGenerateArray,
    isPlaying,
    onTogglePlay,
    speed,
    onSpeedChange,
    currentStepIndex,
    totalSteps,
    onScrub,
    onStepBackward,
    onStepForward,
    isMuted,
    onToggleMute,
}) => {
    return (
        <section aria-label="Sorting Controls" className="control-bar">
            <div className="control-bar-row">
                <div className="control-group">
                    <label htmlFor="algorithm-select">Algorithm:</label>
                    <select
                        id="algorithm-select"
                        className="control-select"
                        value={selectedAlgorithm}
                        onChange={(e) => onAlgorithmChange(e.target.value)}
                        aria-label="Select sorting algorithm"
                    >
                        <option value="" disabled>Select Algorithm</option>
                        {algorithms.map((algo) => (
                            <option key={algo.id} value={algo.id}>
                                {algo.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="control-group">
                    <label htmlFor="array-size">Size ({arraySize}):</label>
                    <input
                        id="array-size"
                        type="range"
                        min="10"
                        max="150"
                        value={arraySize}
                        onChange={(e) => onArraySizeChange(Number(e.target.value))}
                        disabled={isPlaying}
                        aria-label="Array size"
                        aria-valuemin={10}
                        aria-valuemax={150}
                        aria-valuenow={arraySize}
                    />
                </div>

                <div className="control-group" role="group" aria-label="Array generators">
                    <button
                        type="button"
                        className="btn"
                        onClick={() => onGenerateArray('random')}
                        disabled={isPlaying}
                        aria-label="Generate random array"
                    >
                        Random
                    </button>
                    <button
                        type="button"
                        className="btn"
                        onClick={() => onGenerateArray('reverse')}
                        disabled={isPlaying}
                        aria-label="Generate reverse sorted array"
                    >
                        Reverse
                    </button>
                    <button
                        type="button"
                        className="btn"
                        onClick={() => onGenerateArray('nearly_sorted')}
                        disabled={isPlaying}
                        aria-label="Generate nearly sorted array"
                    >
                        Nearly Sorted
                    </button>
                </div>

                <div className="control-group">
                    <button
                        type="button"
                        className={`btn btn-primary`}
                        onClick={onTogglePlay}
                        aria-label={isPlaying ? 'Pause animation' : 'Start sorting'}
                        style={{ minWidth: '95px' }}
                    >
                        {isPlaying ? '⏸ Pause' : '▶ Play'}
                    </button>
                </div>

                <div className="control-group">
                    <label htmlFor="speed">Speed ({speed}ms):</label>
                    <input
                        id="speed"
                        type="range"
                        min="1"
                        max="200"
                        value={speed}
                        onChange={(e) => onSpeedChange(Number(e.target.value))}
                        style={{ direction: 'rtl' }}
                        aria-label="Animation step delay in milliseconds"
                        aria-valuemin={1}
                        aria-valuemax={200}
                        aria-valuenow={speed}
                    />
                </div>

                <div className="control-group">
                    <button
                        type="button"
                        className="btn"
                        onClick={onToggleMute}
                        aria-label={isMuted ? 'Unmute audio synthesized feedback' : 'Mute audio synthesized feedback'}
                        style={{ minWidth: '85px' }}
                    >
                        {isMuted ? '🔇 Unmute' : '🔊 Mute'}
                    </button>
                </div>
            </div>

            {/* Timeline Scrubber */}
            <div className="scrubber-container" role="region" aria-label="Timeline navigation">
                <button
                    type="button"
                    className="btn"
                    onClick={onStepBackward}
                    disabled={isPlaying || currentStepIndex <= 0}
                    aria-label="Step backward by one frame"
                >
                    ⏮ Step Back
                </button>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <input
                        type="range"
                        className="scrubber-slider"
                        min="0"
                        max={totalSteps > 0 ? totalSteps : 0}
                        value={currentStepIndex}
                        onChange={(e) => onScrub(Number(e.target.value))}
                        disabled={totalSteps === 0}
                        aria-label="Timeline step scrubber"
                        aria-valuemin={0}
                        aria-valuemax={totalSteps}
                        aria-valuenow={currentStepIndex}
                    />
                </div>
                <button
                    type="button"
                    className="btn"
                    onClick={onStepForward}
                    disabled={isPlaying || currentStepIndex >= totalSteps || totalSteps === 0}
                    aria-label="Step forward by one frame"
                >
                    Step Fwd ⏭
                </button>
            </div>
        </section>
    );
};
