import React from 'react';
import type { AlgorithmMeta } from '../types/sort';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { BookOpen, Clock, HardDrive, ShieldCheck, ShieldAlert } from 'lucide-react';

interface AlgorithmInfoCardProps {
    algorithm: AlgorithmMeta | null;
}

export const AlgorithmInfoCard: React.FC<AlgorithmInfoCardProps> = ({ algorithm }) => {
    if (!algorithm) return null;

    return (
        <Card className="w-full border-slate-200/90 shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-6 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-[#f3f0ff] border border-[#ddd6fe] flex items-center justify-center text-[#5b42e6]">
                            <BookOpen className="h-4 w-4" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">
                                {algorithm.name}
                            </CardTitle>
                            <p className="text-xs text-slate-400 capitalize">
                                {algorithm.category} algorithm
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="accent" className="capitalize text-xs font-medium">
                            {algorithm.category}
                        </Badge>
                        {algorithm.stable ? (
                            <Badge variant="success" className="flex items-center gap-1 text-xs font-medium">
                                <ShieldCheck className="h-3 w-3" />
                                Stable
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="flex items-center gap-1 text-xs font-medium text-slate-600">
                                <ShieldAlert className="h-3 w-3 text-slate-400" />
                                Unstable
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <Separator />

            <CardContent className="p-6 flex flex-col lg:flex-row gap-6">
                {/* Method Description */}
                <div className="flex-1 flex flex-col justify-start">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Overview & Behavior
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                        {algorithm.description}
                    </p>
                </div>

                {/* Complexities Grid */}
                <div className="lg:w-[480px] grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
                    {/* Time Complexity Card */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 flex flex-col justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2">
                            <Clock className="h-3.5 w-3.5 text-[#5b42e6]" />
                            <span>Time Complexity</span>
                        </div>
                        <div className="space-y-1.5 text-xs text-slate-600">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Best:</span>
                                <code className="font-mono font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-[#4f36db]">
                                    {algorithm.best_time}
                                </code>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Average:</span>
                                <code className="font-mono font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-[#4f36db]">
                                    {algorithm.average_time}
                                </code>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Worst:</span>
                                <code className="font-mono font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-[#4f36db]">
                                    {algorithm.worst_time}
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* Space Complexity Card */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 flex flex-col justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2">
                            <HardDrive className="h-3.5 w-3.5 text-[#5b42e6]" />
                            <span>Space Complexity</span>
                        </div>
                        <div className="flex flex-col justify-center h-full gap-2 text-xs text-slate-600 pt-1">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Auxiliary Space:</span>
                                <code className="font-mono font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-[#4f36db]">
                                    {algorithm.space_complexity}
                                </code>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-tight">
                                Memory required beyond the input array storage.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
