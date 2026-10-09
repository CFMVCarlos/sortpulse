import React from 'react';
import type { AlgorithmMeta } from '../types/sort';

interface AlgorithmInfoCardProps {
    algorithm: AlgorithmMeta | null;
}

const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
        case 'comparison':
            return { backgroundColor: '#e0f2fe', color: '#0369a1' };
        case 'distribution':
            return { backgroundColor: '#f3e8ff', color: '#6b21a8' };
        case 'hybrid':
            return { backgroundColor: '#dcfce7', color: '#15803d' };
        default:
            return { backgroundColor: '#f1f5f9', color: '#475569' };
    }
};

export const AlgorithmInfoCard: React.FC<AlgorithmInfoCardProps> = ({ algorithm }) => {
    if (!algorithm) return null;

    return (
        <article className="algo-card" aria-labelledby="algo-title">
            <header className="algo-card-header">
                <h2 id="algo-title" className="algo-card-title">{algorithm.name}</h2>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span
                        className="badge"
                        style={{ ...getCategoryBadgeStyle(algorithm.category), textTransform: 'capitalize' }}
                    >
                        {algorithm.category}
                    </span>
                    <span className={`badge ${algorithm.stable ? 'badge-stable' : 'badge-unstable'}`}>
                        {algorithm.stable ? 'Stable' : 'Unstable'}
                    </span>
                </div>
            </header>

            <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {algorithm.description}
            </p>

            <div className="algo-complexities" aria-label="Algorithmic Complexities">
                <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Time Complexity
                    </strong>
                    <ul style={{ margin: '0.4rem 0 0', paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <li>Best: <code>{algorithm.best_time}</code></li>
                        <li>Average: <code>{algorithm.average_time}</code></li>
                        <li>Worst: <code>{algorithm.worst_time}</code></li>
                    </ul>
                </div>
                <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Space Complexity
                    </strong>
                    <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Auxiliary Space: <code>{algorithm.space_complexity}</code>
                    </p>
                </div>
            </div>
        </article>
    );
};
