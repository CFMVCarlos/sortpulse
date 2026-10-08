import type { AlgorithmMeta, Trace } from '../types/sort';

const API_BASE = import.meta.env.DEV ? 'http://localhost:8080/api' : '/api';

export async function fetchAlgorithms(): Promise<AlgorithmMeta[]> {
    const response = await fetch(`${API_BASE}/algorithms`);
    if (!response.ok) {
        throw new Error(`Failed to fetch algorithms: ${response.statusText}`);
    }
    return response.json();
}

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
