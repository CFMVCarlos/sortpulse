import React from 'react';
import type { AlgorithmMeta } from '../types/sort';
import { SPEED_LEVELS } from '../types/sort';

interface ControlBarProps {
    algorithms: AlgorithmMeta[];
    selectedAlgorithm: string;
    onAlgorithmChange: (id: string) => void;
    arraySize: number;
    onArraySizeChange: (size: number) => void;
    onGenerateArray: (type: 'random' | 'reverse' | 'nearly_sorted') => void;
    selectedArrayType?: 'random' | 'reverse' | 'nearly_sorted';
    isPlaying: boolean;
    onTogglePlay: () => void;
    speedLevel: number;
    onSpeedLevelChange: (level: number) => void;
    currentStepIndex: number;
    totalSteps: number;
    onScrub: (step: number) => void;
    onStepBackward: () => void;
    onStepForward: () => void;
    isMuted: boolean;
    onToggleMute: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
    comparison: 'Comparison Based',
    distribution: 'Distribution / Non-Comparison',
    hybrid: 'Hybrid Algorithms',
};

const CATEGORY_ORDER = ['comparison', 'distribution', 'hybrid'];

export const ControlBar: React.FC<ControlBarProps> = ({
    algorithms,
    selectedAlgorithm,
    onAlgorithmChange,
    arraySize,
    onArraySizeChange,
    onGenerateArray,
    selectedArrayType,
    isPlaying,
    onTogglePlay,
    speedLevel,
    onSpeedLevelChange,
    currentStepIndex,
    totalSteps,
    onScrub,
    onStepBackward,
    onStepForward,
    isMuted,
    onToggleMute,
}) => {
    const currentSpeed = SPEED_LEVELS[speedLevel] || SPEED_LEVELS[3];

    const groupedAlgorithms = React.useMemo(() => {
        const groups: Record<string, AlgorithmMeta[]> = {};
        for (const algo of algorithms) {
            const cat = algo.category || 'other';
            if (!groups[cat]) {
                groups[cat] = [];
            }
            groups[cat].push(algo);
        }
        return groups;
    }, [algorithms]);

    const sortedCategories = React.useMemo(() => {
        const presentCategories = Object.keys(groupedAlgorithms);
        return presentCategories.sort((a, b) => {
            const idxA = CATEGORY_ORDER.indexOf(a);
            const idxB = CATEGORY_ORDER.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [groupedAlgorithms]);

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
                        {sortedCategories.map((cat) => (
                            <optgroup
                                key={cat}
                                label={CATEGORY_LABELS[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1))}
                            >
                                {groupedAlgorithms[cat].map((algo) => (
                                    <option key={algo.id} value={algo.id}>
                                        {algo.name}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>

                <div className="control-group">
                    <label htmlFor="array-size">Size ({arraySize}):</label>
                    <input
                        id="array-size"
                        type="range"
                        min="25"
                        max="500"
                        step="25"
                        value={arraySize}
                        onChange={(e) => onArraySizeChange(Number(e.target.value))}
                        disabled={isPlaying}
                        aria-label="Array size"
                        aria-valuemin={25}
                        aria-valuemax={500}
                        aria-valuenow={arraySize}
                    />
                </div>

                <div className="control-group" role="group" aria-label="Array generators">
                    <button
                        type="button"
                        className={`btn ${selectedArrayType === 'random' ? 'btn-active' : ''}`}
                        onClick={() => onGenerateArray('random')}
                        disabled={isPlaying}
                        aria-label="Generate random array"
                    >
                        Random
                    </button>
                    <button
                        type="button"
                        className={`btn ${selectedArrayType === 'reverse' ? 'btn-active' : ''}`}
                        onClick={() => onGenerateArray('reverse')}
                        disabled={isPlaying}
                        aria-label="Generate reverse sorted array"
                    >
                        Reverse
                    </button>
                    <button
                        type="button"
                        className={`btn ${selectedArrayType === 'nearly_sorted' ? 'btn-active' : ''}`}
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
                    <label htmlFor="speed">Speed ({currentSpeed.multiplier}):</label>
                    <input
                        id="speed"
                        type="range"
                        min="0"
                        max={SPEED_LEVELS.length - 1}
                        step="1"
                        value={speedLevel}
                        onChange={(e) => onSpeedLevelChange(Number(e.target.value))}
                        aria-label="Animation speed multiplier"
                        aria-valuemin={0}
                        aria-valuemax={SPEED_LEVELS.length - 1}
                        aria-valuenow={speedLevel}
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
