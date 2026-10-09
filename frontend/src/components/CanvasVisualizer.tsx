import React, { useEffect, useRef, useCallback } from 'react';

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
    const widthRef = useRef<number>(800);

    const renderBars = useCallback((w: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Synchronize internal bitmap dimensions with layout width
        if (canvas.width !== w) {
            canvas.width = w;
        }
        if (canvas.height !== height) {
            canvas.height = height;
        }

        ctx.clearRect(0, 0, w, height);

        if (array.length === 0) return;

        const n = array.length;
        const maxVal = Math.max(...array, 1);

        const spacing = (w * 0.15) / (n + 1);
        const barWidth = (w * 0.85) / n;

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
    }, [array, barStates, height]);

    // Redraw whenever sorting array data, active bar states, or height change
    useEffect(() => {
        const animationFrameId = requestAnimationFrame(() => {
            renderBars(widthRef.current);
        });
        return () => cancelAnimationFrame(animationFrameId);
    }, [renderBars]);

    // Responsive container width tracking without triggering component re-render loops
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let rAFId: number;

        const handleResize = (newWidth: number) => {
            const roundedWidth = Math.floor(newWidth);
            if (roundedWidth > 0 && Math.abs(roundedWidth - widthRef.current) >= 1) {
                widthRef.current = roundedWidth;
                cancelAnimationFrame(rAFId);
                rAFId = requestAnimationFrame(() => {
                    renderBars(roundedWidth);
                });
            }
        };

        // Measure initial container bounds
        const initialRect = container.getBoundingClientRect();
        if (initialRect.width > 0) {
            handleResize(initialRect.width);
        }

        let resizeObserver: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver((entries) => {
                const entry = entries[0];
                if (entry && entry.contentRect.width > 0) {
                    handleResize(entry.contentRect.width);
                }
            });
            resizeObserver.observe(container);
        }

        const onWindowResize = () => {
            if (containerRef.current) {
                handleResize(containerRef.current.getBoundingClientRect().width);
            }
        };
        window.addEventListener('resize', onWindowResize);

        return () => {
            cancelAnimationFrame(rAFId);
            window.removeEventListener('resize', onWindowResize);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, [renderBars]);

    return (
        <div ref={containerRef} className="canvas-wrapper" role="region" aria-label="Sorting Bar Visualizer">
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: `${height}px` }}
                className="sort-canvas"
                aria-label={`Visual representation of ${array.length} numbers undergoing sort`}
            />
        </div>
    );
};
