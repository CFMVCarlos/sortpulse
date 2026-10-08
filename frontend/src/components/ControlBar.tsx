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
        <div className="control-bar" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', backgroundColor: '#f0f0f0' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="control-group">
                    <label htmlFor="algorithm-select">Algorithm: </label>
                    <select
                        id="algorithm-select"
                        value={selectedAlgorithm}
                        onChange={(e) => onAlgorithmChange(e.target.value)}
                    >
                        <option value="" disabled>Select Algorithm</option>
                        {algorithms.map((algo) => (
                            <option key={algo.id} value={algo.id}>
                                {algo.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="control-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label htmlFor="array-size">Size ({arraySize}): </label>
                    <input
                        id="array-size"
                        type="range"
                        min="10"
                        max="150"
                        value={arraySize}
                        onChange={(e) => onArraySizeChange(Number(e.target.value))}
                        disabled={isPlaying}
                    />
                </div>

                <div className="control-group" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => onGenerateArray('random')} disabled={isPlaying}>Random</button>
                    <button onClick={() => onGenerateArray('reverse')} disabled={isPlaying}>Reverse</button>
                    <button onClick={() => onGenerateArray('nearly_sorted')} disabled={isPlaying}>Nearly Sorted</button>
                </div>

                <div className="control-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={onTogglePlay} style={{ minWidth: '80px', fontWeight: 'bold' }}>
                        {isPlaying ? 'Pause' : 'Play / Sort'}
                    </button>
                </div>

                <div className="control-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label htmlFor="speed">Speed ({speed}ms): </label>
                    <input
                        id="speed"
                        type="range"
                        min="1"
                        max="200"
                        value={speed}
                        onChange={(e) => onSpeedChange(Number(e.target.value))}
                        /* Reverse the slider visually so right is faster (lower delay) */
                        style={{ direction: 'rtl' }}
                    />
                </div>

                <div className="control-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={onToggleMute} style={{ minWidth: '80px' }}>
                        {isMuted ? 'Unmute' : 'Mute'}
                    </button>
                </div>
            </div>

            {/* Timeline Scrubber */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                <button onClick={onStepBackward} disabled={isPlaying || currentStepIndex <= 0}>Step Back</button>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                        type="range"
                        min="0"
                        max={totalSteps > 0 ? totalSteps : 0}
                        value={currentStepIndex}
                        onChange={(e) => onScrub(Number(e.target.value))}
                        style={{ width: '100%' }}
                        disabled={totalSteps === 0}
                    />
                </div>
                <button onClick={onStepForward} disabled={isPlaying || currentStepIndex >= totalSteps || totalSteps === 0}>Step Fwd</button>
            </div>
        </div>
    );
};
