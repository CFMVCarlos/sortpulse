import React from 'react';
import type { AlgorithmMeta } from '../types/sort';

interface AlgorithmInfoCardProps {
    algorithm: AlgorithmMeta | null;
}

export const AlgorithmInfoCard: React.FC<AlgorithmInfoCardProps> = ({ algorithm }) => {
    if (!algorithm) return null;

    return (
        <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            margin: '1rem auto',
            maxWidth: '800px',
            textAlign: 'left',
            fontFamily: 'sans-serif'
        }}>
            <h2 style={{ marginTop: 0, color: '#2c3e50' }}>{algorithm.name}</h2>
            <p style={{ color: '#7f8c8d' }}><strong>Category:</strong> {algorithm.category} | <strong>Stable:</strong> {algorithm.stable ? 'Yes' : 'No'}</p>
            <p>{algorithm.description}</p>

            <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', backgroundColor: '#ecf0f1', padding: '1rem', borderRadius: '4px' }}>
                <div>
                    <strong>Time Complexity</strong>
                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem', color: '#34495e' }}>
                        <li>Best: {algorithm.best_time}</li>
                        <li>Average: {algorithm.average_time}</li>
                        <li>Worst: {algorithm.worst_time}</li>
                    </ul>
                </div>
                <div>
                    <strong>Space Complexity</strong>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#34495e' }}>{algorithm.space_complexity}</p>
                </div>
            </div>
        </div>
    );
};
