export type StepType = 'compare' | 'swap' | 'overwrite' | 'pivot' | 'mark_sorted';

export interface Step {
    type: StepType;
    indices: number[];
    description: string;
    value?: number;
}

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
