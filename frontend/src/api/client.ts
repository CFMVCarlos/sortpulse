import type { AlgorithmMeta, Trace } from '../types/sort';

const API_BASE = import.meta.env.DEV ? 'http://localhost:8080/api' : '/api';

/**
 * Retrieves the catalog of registered sorting algorithms and asymptotic metadata from the backend.
 * @returns Array of AlgorithmMeta objects.
 */
export async function fetchAlgorithms(): Promise<AlgorithmMeta[]> {
    const response = await fetch(`${API_BASE}/algorithms`);
    if (!response.ok) {
        throw new Error(`Failed to fetch algorithms: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Dispatches an array and algorithm ID to the server to compute and record the step-by-step trace.
 * @param algorithmId Identifier of the sorting algorithm (e.g. 'bubble', 'quick').
 * @param array Array of integers to sort.
 * @returns Fully deterministic Trace object with steps and statistics.
 */
export async function fetchSortTrace(algorithmId: string, array: number[]): Promise<Trace> {
    const response = await fetch(`${API_BASE}/sort`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ algorithm: algorithmId, array }),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch sort trace: ${response.statusText}`);
    }

    return response.json();
}
