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
