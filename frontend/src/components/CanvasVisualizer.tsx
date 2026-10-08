import React, { useEffect, useRef } from 'react';

export type BarState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot';

interface CanvasVisualizerProps {
    array: number[];
    barStates: BarState[];
    width?: number;
    height?: number;
}

const STATE_COLORS: Record<BarState, string> = {
    default: '#3498db',    // blue
    comparing: '#f1c40f',  // yellow
    swapping: '#e74c3c',   // red
    sorted: '#2ecc71',     // green
    pivot: '#9b59b6',      // purple
};

export const CanvasVisualizer: React.FC<CanvasVisualizerProps> = ({
    array,
    barStates,
    width = 800,
    height = 400,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            if (array.length === 0) return;

            const n = array.length;
            const maxVal = Math.max(...array, 1); // Avoid division by zero

            // Calculate dimensions
            // Let's use 80% of width for bars, 20% for spacing total
            const spacing = (width * 0.2) / (n + 1);
            const barWidth = (width * 0.8) / n;

            for (let i = 0; i < n; i++) {
                const val = array[i];
                const state = barStates[i] || 'default';
                const color = STATE_COLORS[state];

                const barHeight = (val / maxVal) * (height * 0.9); // Leave 10% padding at top
                const x = spacing + i * (barWidth + spacing);
                const y = height - barHeight;

                // Draw bar
                ctx.fillStyle = color;
                ctx.fillRect(x, y, barWidth, barHeight);

                // Optional: draw border for clarity if bars are wide enough
                if (barWidth > 3) {
                    ctx.strokeStyle = '#2c3e50';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x, y, barWidth, barHeight);
                }
            }
        };

        // Use requestAnimationFrame for smooth rendering
        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [array, barStates, width, height]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{
                    backgroundColor: '#ecf0f1',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
            />
        </div>
    );
};
