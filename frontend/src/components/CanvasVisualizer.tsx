import React, { useEffect, useRef, useState } from 'react';

export type BarState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot';

interface CanvasVisualizerProps {
    array: number[];
    barStates: BarState[];
    height?: number;
}

const STATE_COLORS: Record<BarState, string> = {
    default: '#3b82f6',    // vibrant blue
    comparing: '#f59e0b',  // amber yellow
    swapping: '#ef4444',   // rose red
    sorted: '#10b981',     // emerald green
    pivot: '#8b5cf6',      // violet purple
};

export const CanvasVisualizer: React.FC<CanvasVisualizerProps> = ({
    array,
    barStates,
    height = 360,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasWidth, setCanvasWidth] = useState<number>(800);

    // Responsive container width tracking via ResizeObserver
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                const width = containerRef.current.clientWidth;
                if (width > 0) {
                    setCanvasWidth(width);
                }
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);

        let resizeObserver: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
            resizeObserver = new ResizeObserver(() => {
                updateWidth();
            });
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            window.removeEventListener('resize', updateWidth);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvasWidth, height);

            if (array.length === 0) return;

            const n = array.length;
            const maxVal = Math.max(...array, 1);

            const spacing = (canvasWidth * 0.15) / (n + 1);
            const barWidth = (canvasWidth * 0.85) / n;

            for (let i = 0; i < n; i++) {
                const val = array[i];
                const state = barStates[i] || 'default';
                const color = STATE_COLORS[state];

                const barHeight = (val / maxVal) * (height * 0.88);
                const x = spacing + i * (barWidth + spacing);
                const y = height - barHeight;

                // Draw bar
                ctx.fillStyle = color;
                ctx.beginPath();
                // Draw rounded top corners if bar is wide enough
                if (barWidth > 6) {
                    const radius = Math.min(4, barWidth / 2);
                    ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0]);
                    ctx.fill();
                } else {
                    ctx.fillRect(x, y, barWidth, barHeight);
                }

                // Add subtle stroke for definition on wider bars
                if (barWidth > 4) {
                    ctx.strokeStyle = 'rgba(15, 23, 42, 0.15)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x, y, barWidth, barHeight);
                }
            }
        };

        animationFrameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationFrameId);
    }, [array, barStates, canvasWidth, height]);

    return (
        <div ref={containerRef} className="canvas-wrapper" role="region" aria-label="Sorting Bar Visualizer">
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={height}
                style={{ width: '100%', height: `${height}px` }}
                className="sort-canvas"
                aria-label={`Visual representation of ${array.length} numbers undergoing sort`}
            />
        </div>
    );
};
