import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { CanvasVisualizer } from './CanvasVisualizer';
import type { BarState } from './CanvasVisualizer';
import type { Trace } from '../types/sort';
import {
    SkipBack,
    SkipForward,
    BarChart3,
    GitCommit,
    CheckCircle2,
    ArrowLeftRight,
    Play,
    Pause,
} from 'lucide-react';

interface VisualizerPanelProps {
    array: number[];
    barStates: BarState[];
    trace: Trace | null;
    currentStepIndex: number;
    currentComparisons: number;
    currentSwaps: number;
    isPlaying: boolean;
    onScrub: (step: number) => void;
    onStepBackward: () => void;
    onStepForward: () => void;
    onTogglePlay?: () => void;
}

export const VisualizerPanel: React.FC<VisualizerPanelProps> = ({
    array,
    barStates,
    trace,
    currentStepIndex,
    currentComparisons,
    currentSwaps,
    isPlaying,
    onScrub,
    onStepBackward,
    onStepForward,
    onTogglePlay,
}) => {
    const [canvasHeight, setCanvasHeight] = useState(340);

    useEffect(() => {
        const updateHeight = () => {
            setCanvasHeight(window.innerWidth < 640 ? 240 : 340);
        };
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    const totalSteps = trace ? trace.steps.length : 0;
    const isFinished = totalSteps > 0 && currentStepIndex >= totalSteps;
    const writesOrSwaps =
        trace && trace.swaps === 0 && trace.steps.some((s) => s.type === 'overwrite')
            ? 'Writes'
            : 'Swaps';

    return (
        <Card className="w-full h-full flex flex-col border-slate-200/90 shadow-sm bg-white overflow-hidden">
            {/* Header with Title, Mobile Quick Action, and Legend */}
            <CardHeader className="p-4 sm:p-5 pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-[#5b42e6]" />
                        <CardTitle className="text-sm sm:text-base font-semibold text-slate-900">
                            Array Visualization
                        </CardTitle>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {onTogglePlay && (
                            <Button
                                type="button"
                                variant={isPlaying ? 'secondary' : 'default'}
                                size="sm"
                                onClick={onTogglePlay}
                                className="lg:hidden h-7 sm:h-8 px-2.5 text-xs font-semibold gap-1 shadow-xs"
                                aria-label={isPlaying ? 'Pause animation' : 'Start sorting'}
                            >
                                {isPlaying ? (
                                    <>
                                        <Pause className="h-3 w-3 fill-current" />
                                        <span>Pause</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-3 w-3 fill-current" />
                                        <span>Play</span>
                                    </>
                                )}
                            </Button>
                        )}

                        {/* Color Legend */}
                        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-medium text-slate-500">
                            <span className="flex items-center gap-1">
                                <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#5b42e6] inline-block" />
                                <span className="hidden sm:inline">Default</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-amber-500 inline-block" />
                                <span className="hidden sm:inline">Compare</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-rose-500 inline-block" />
                                <span className="hidden sm:inline">Swap</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-500 inline-block" />
                                <span className="hidden sm:inline">Sorted</span>
                            </span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <Separator />

            {/* Canvas Area */}
            <CardContent className="p-3 sm:p-5 flex-1 flex flex-col justify-between gap-3 sm:gap-4">
                <div className="w-full flex-1 min-h-[240px] sm:min-h-[340px] flex items-center justify-center bg-slate-50/50 rounded-xl border border-slate-100 p-1 sm:p-2">
                    <CanvasVisualizer
                        array={array}
                        barStates={barStates}
                        height={canvasHeight}
                    />
                </div>

                {/* Timeline Scrubber Controls */}
                <div className="flex flex-col gap-2.5 sm:gap-3 bg-slate-50/80 border border-slate-100 rounded-xl p-2.5 sm:p-3.5">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onStepBackward}
                            disabled={isPlaying || currentStepIndex <= 0}
                            className="h-7 sm:h-8 px-2 sm:px-2.5 text-xs text-slate-700 hover:text-[#5b42e6] hover:border-[#ddd6fe]"
                            aria-label="Step backward by one frame"
                        >
                            <SkipBack className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-0.5 sm:mr-1" />
                            <span className="hidden xs:inline">Back</span>
                        </Button>

                        <div className="flex-1 px-1">
                            <Slider
                                min={0}
                                max={totalSteps > 0 ? totalSteps : 1}
                                step={1}
                                value={[currentStepIndex]}
                                onValueChange={(val) => onScrub(val[0])}
                                disabled={totalSteps === 0}
                                aria-label="Timeline step scrubber"
                            />
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onStepForward}
                            disabled={isPlaying || currentStepIndex >= totalSteps || totalSteps === 0}
                            className="h-7 sm:h-8 px-2 sm:px-2.5 text-xs text-slate-700 hover:text-[#5b42e6] hover:border-[#ddd6fe]"
                            aria-label="Step forward by one frame"
                        >
                            <span className="hidden xs:inline">Forward</span>
                            <SkipForward className="h-3 w-3 sm:h-3.5 sm:w-3.5 ml-0.5 sm:ml-1" />
                        </Button>
                    </div>

                    {/* Embedded Live Metrics Bar */}
                    <div className="grid grid-cols-3 gap-1 sm:gap-2 pt-1 border-t border-slate-200/60 text-center" aria-label="Sorting Metrics">
                        <div className="flex flex-col items-center justify-center py-1">
                            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <GitCommit className="h-3 w-3 text-[#5b42e6]" />
                                Step
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-800 mt-0.5">
                                {trace ? `${currentStepIndex} / ${totalSteps}` : '0 / 0'}
                            </span>
                        </div>

                        <div className="flex flex-col items-center justify-center py-1 border-x border-slate-200/60">
                            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <ArrowLeftRight className="h-3 w-3 text-amber-500" />
                                Comparisons
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-800 mt-0.5">
                                {trace ? currentComparisons : 0}
                            </span>
                        </div>

                        <div className="flex flex-col items-center justify-center py-1">
                            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle2 className={`h-3 w-3 ${isFinished ? 'text-emerald-500' : 'text-rose-500'}`} />
                                {writesOrSwaps}
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-800 mt-0.5">
                                {trace ? currentSwaps : 0}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
