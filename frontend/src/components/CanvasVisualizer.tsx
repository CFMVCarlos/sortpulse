import React, { useEffect, useRef, useCallback } from 'react';

export type BarState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot';

interface CanvasVisualizerProps {
    array: number[];
    barStates: BarState[];
    height?: number;
}

const STATE_COLORS: Record<BarState, string> = {
    default: '#5b42e6',    // slightly more purple (subtle purpleish-blue)
    comparing: '#f59e0b',  // warm amber for comparison
    swapping: '#f43f5e',   // rose red for swap/overwrite
    sorted: '#10b981',     // vibrant emerald for sorted confirmation
    pivot: '#8b5cf6',      // violet for pivot
};

export const CanvasVisualizer: React.FC<CanvasVisualizerProps> = ({
    array,
    barStates,
    height = 380,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const widthRef = useRef<number>(800);

    const renderBars = useCallback((w: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        if (canvas.width !== w * dpr || canvas.height !== height * dpr) {
            canvas.width = w * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        }

        ctx.clearRect(0, 0, w, height);

        if (array.length === 0) return;

        const n = array.length;
        const maxVal = Math.max(...array, 1);

        const spacing = (w * 0.12) / (n + 1);
        const barWidth = (w * 0.88) / n;

        for (let i = 0; i < n; i++) {
            const val = array[i];
            const state = barStates[i] || 'default';
            const color = STATE_COLORS[state];

            const barHeight = (val / maxVal) * (height * 0.9);
            const x = spacing + i * (barWidth + spacing);
            const y = height - barHeight;

            // Draw rounded bar
            ctx.fillStyle = color;
            ctx.beginPath();
            if (barWidth > 4) {
                const radius = Math.min(4, barWidth / 2);
                ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0]);
                ctx.fill();
            } else {
                ctx.fillRect(x, y, barWidth, barHeight);
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

    // Responsive container width tracking
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
        <div ref={containerRef} className="w-full relative overflow-hidden flex items-end justify-center" role="region" aria-label="Sorting Bar Visualizer">
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: `${height}px` }}
                className="block w-full"
                aria-label={`Visual representation of ${array.length} numbers undergoing sort`}
            />
        </div>
    );
};
