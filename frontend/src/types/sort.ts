/**
 * Operation classification matching Go backend StepType constants.
 */
export type StepType = 'compare' | 'swap' | 'overwrite' | 'pivot' | 'mark_sorted';

/**
 * An individual trace event recording the action, involved indices, and pedagogical explanation.
 */
export interface Step {
    type: StepType;
    indices: number[];
    description: string;
    value?: number;
}

/**
 * Algorithmic metadata, asymptotic complexity, and categorization.
 */
export interface AlgorithmMeta {
    id: string;
    name: string;
    category: string;
    best_time: string;
    average_time: string;
    worst_time: string;
    space_complexity: string;
    stable: boolean;
    description: string;
}

/**
 * Full execution trace emitted by a sorter run.
 */
export interface Trace {
    algorithm: string;
    initial_array: number[];
    final_array: number[];
    steps: Step[];
    total_steps: number;
    comparisons: number;
    swaps: number;
    execution_time_us: number;
}

/**
 * Animation speed multiplier level definition.
 */
export interface SpeedLevel {
    multiplier: string;
    delay: number;
    batch: number;
}

export const SPEED_LEVELS: readonly SpeedLevel[] = [
    { multiplier: '1x', delay: 200, batch: 1 },
    { multiplier: '2x', delay: 100, batch: 1 },
    { multiplier: '4x', delay: 50, batch: 1 },
    { multiplier: '8x', delay: 25, batch: 1 },
    { multiplier: '16x', delay: 12, batch: 1 },
    { multiplier: '32x', delay: 16, batch: 2 },
    { multiplier: '64x', delay: 16, batch: 4 },
    { multiplier: '128x', delay: 16, batch: 8 },
    { multiplier: '256x', delay: 16, batch: 16 },
    { multiplier: '512x', delay: 16, batch: 32 },
    { multiplier: '1024x', delay: 16, batch: 64 },
    { multiplier: '2048x', delay: 16, batch: 128 },
    { multiplier: '4096x', delay: 16, batch: 256 },
] as const;
