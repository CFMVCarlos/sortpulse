import React from 'react';
import type { AlgorithmMeta } from '../types/sort';
import { SPEED_LEVELS } from '../types/sort';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    SlidersHorizontal,
    Sparkles,
    Gauge,
    Shuffle,
    ArrowDownUp,
    ListOrdered,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

interface ControlBarProps {
    algorithms: AlgorithmMeta[];
    selectedAlgorithm: string;
    onAlgorithmChange: (id: string) => void;
    arraySize: number;
    onArraySizeChange: (size: number) => void;
    onGenerateArray: (type: 'random' | 'reverse' | 'nearly_sorted') => void;
    selectedArrayType?: 'random' | 'reverse' | 'nearly_sorted';
    isPlaying: boolean;
    onTogglePlay: () => void;
    speedLevel: number;
    onSpeedLevelChange: (level: number) => void;
    isMuted: boolean;
    onToggleMute: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
    comparison: 'Comparison Based',
    distribution: 'Distribution / Non-Comparison',
    hybrid: 'Hybrid Algorithms',
};

const CATEGORY_ORDER = ['comparison', 'distribution', 'hybrid'];

export const ControlBar: React.FC<ControlBarProps> = ({
    algorithms,
    selectedAlgorithm,
    onAlgorithmChange,
    arraySize,
    onArraySizeChange,
    onGenerateArray,
    selectedArrayType,
    isPlaying,
    onTogglePlay,
    speedLevel,
    onSpeedLevelChange,
    isMuted,
    onToggleMute,
}) => {
    const [isMobileExpanded, setIsMobileExpanded] = React.useState(true);
    const currentSpeed = SPEED_LEVELS[speedLevel] || SPEED_LEVELS[3];

    const groupedAlgorithms = React.useMemo(() => {
        const groups: Record<string, AlgorithmMeta[]> = {};
        for (const algo of algorithms) {
            const cat = algo.category || 'other';
            if (!groups[cat]) {
                groups[cat] = [];
            }
            groups[cat].push(algo);
        }
        return groups;
    }, [algorithms]);

    const sortedCategories = React.useMemo(() => {
        const presentCategories = Object.keys(groupedAlgorithms);
        return presentCategories.sort((a, b) => {
            const idxA = CATEGORY_ORDER.indexOf(a);
            const idxB = CATEGORY_ORDER.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [groupedAlgorithms]);

    return (
        <Card className="w-full h-full flex flex-col border-slate-200/90 shadow-sm bg-white">
            <CardHeader className="p-4 sm:p-5 pb-3 sm:pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-[#5b42e6] flex items-center justify-center text-white shadow-xs">
                            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </div>
                        <div>
                            <CardTitle className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                                SortPulse
                            </CardTitle>
                            <p className="text-[11px] sm:text-xs text-slate-400 font-medium">Controls & Settings</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
                            className="lg:hidden text-xs text-slate-500 hover:text-[#5b42e6] hover:bg-[#f3f0ff] h-8 px-2 flex items-center gap-1 font-medium"
                            aria-label={isMobileExpanded ? 'Collapse controls' : 'Expand controls'}
                        >
                            <span>{isMobileExpanded ? 'Hide' : 'Options'}</span>
                            {isMobileExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={onToggleMute}
                            aria-label={isMuted ? 'Unmute audio feedback' : 'Mute audio feedback'}
                            className="text-slate-500 hover:text-[#5b42e6] hover:bg-[#f3f0ff]"
                            title={isMuted ? 'Unmute audio' : 'Mute audio'}
                        >
                            {isMuted ? <VolumeX className="h-4 w-4 text-slate-400" /> : <Volume2 className="h-4 w-4 text-[#5b42e6]" />}
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <Separator />

            <CardContent className={`p-4 sm:p-5 flex-col gap-4 sm:gap-5 flex-1 ${isMobileExpanded ? 'flex' : 'hidden lg:flex'}`}>
                {/* Algorithm Selection */}
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="algorithm-select"
                        className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"
                    >
                        <SlidersHorizontal className="h-3.5 w-3.5 text-[#5b42e6]" />
                        Algorithm
                    </label>
                    <Select
                        value={selectedAlgorithm}
                        onValueChange={onAlgorithmChange}
                    >
                        <SelectTrigger id="algorithm-select" className="w-full">
                            <SelectValue placeholder="Choose an algorithm" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortedCategories.map((cat) => (
                                <SelectGroup key={cat}>
                                    <SelectLabel>
                                        {CATEGORY_LABELS[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1))}
                                    </SelectLabel>
                                    {groupedAlgorithms[cat].map((algo) => (
                                        <SelectItem key={algo.id} value={algo.id}>
                                            {algo.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Primary Action Button */}
                <Button
                    type="button"
                    variant={isPlaying ? 'secondary' : 'default'}
                    size="lg"
                    onClick={onTogglePlay}
                    className="w-full font-semibold shadow-xs transition-all duration-200"
                    aria-label={isPlaying ? 'Pause animation' : 'Start sorting'}
                >
                    {isPlaying ? (
                        <>
                            <Pause className="h-4 w-4 fill-current text-slate-800" />
                            <span>Pause</span>
                        </>
                    ) : (
                        <>
                            <Play className="h-4 w-4 fill-current text-white" />
                            <span>Run Algorithm</span>
                        </>
                    )}
                </Button>

                <Separator />

                {/* Array Size Configuration */}
                <div className={`flex flex-col gap-2.5 transition-opacity duration-200 ${isPlaying ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-500 uppercase tracking-wider">
                            Array Size
                        </span>
                        <span
                            className={`font-mono font-bold px-2 py-0.5 rounded text-xs border transition-colors ${
                                isPlaying
                                    ? 'text-slate-400 bg-slate-100 border-slate-200'
                                    : 'text-[#4f36db] bg-[#f3f0ff] border-[#ddd6fe]'
                            }`}
                        >
                            {arraySize} elements
                        </span>
                    </div>
                    <Slider
                        min={25}
                        max={500}
                        step={25}
                        value={[arraySize]}
                        onValueChange={(val) => onArraySizeChange(val[0])}
                        disabled={isPlaying}
                        aria-label="Array size"
                    />
                </div>

                {/* Array Distribution Preset */}
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Initial Order
                    </span>
                    <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Array order options">
                        <Button
                            type="button"
                            variant={selectedArrayType === 'random' ? 'accent' : 'outline'}
                            size="sm"
                            onClick={() => onGenerateArray('random')}
                            disabled={isPlaying}
                            className="text-xs h-8 px-2 flex items-center justify-center gap-1"
                        >
                            <Shuffle className="h-3 w-3" />
                            Random
                        </Button>
                        <Button
                            type="button"
                            variant={selectedArrayType === 'reverse' ? 'accent' : 'outline'}
                            size="sm"
                            onClick={() => onGenerateArray('reverse')}
                            disabled={isPlaying}
                            className="text-xs h-8 px-2 flex items-center justify-center gap-1"
                        >
                            <ArrowDownUp className="h-3 w-3" />
                            Reverse
                        </Button>
                        <Button
                            type="button"
                            variant={selectedArrayType === 'nearly_sorted' ? 'accent' : 'outline'}
                            size="sm"
                            onClick={() => onGenerateArray('nearly_sorted')}
                            disabled={isPlaying}
                            className="text-xs h-8 px-2 flex items-center justify-center gap-1"
                        >
                            <ListOrdered className="h-3 w-3" />
                            Nearly
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Speed Multiplier */}
                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <Gauge className="h-3.5 w-3.5 text-[#5b42e6]" />
                            Speed
                        </span>
                        <span className="font-mono font-bold text-[#4f36db] bg-[#f3f0ff] px-2 py-0.5 rounded text-xs border border-[#ddd6fe]">
                            {currentSpeed.multiplier}
                        </span>
                    </div>
                    <Slider
                        min={0}
                        max={SPEED_LEVELS.length - 1}
                        step={1}
                        value={[speedLevel]}
                        onValueChange={(val) => onSpeedLevelChange(val[0])}
                        aria-label="Animation speed multiplier"
                    />
                </div>
            </CardContent>
        </Card>
    );
};
