import React, { useMemo, useState, useEffect } from 'react';
import type { AnalyticsData, WebVitals } from '../../types';
import { AnimatedLoaderIcon } from '../common/AnimatedLoaderIcon';

const StatCard: React.FC<{ title: string; value: string; unit?: string; }> = ({ title, value, unit }) => (
    <div className="border border-zinc-900 bg-black p-8">
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">{title}</p>
        <p className="text-3xl font-bold text-white tracking-tighter">
            {value}
            {unit && <span className="text-xs font-bold text-zinc-700 ml-2 uppercase tracking-widest">{unit}</span>}
        </p>
    </div>
);

type WebVitalRating = 'good' | 'needs-improvement' | 'poor';

const WebVitalIndicator: React.FC<{ metric: string; value: number; unit: string; rating: WebVitalRating }> = ({ metric, value, unit, rating }) => {
    const colorClasses = {
        good: 'text-white',
        'needs-improvement': 'text-zinc-500',
        poor: 'text-zinc-700',
    };
    return (
        <div className="space-y-2">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{metric}</p>
            <p className={`text-2xl font-bold tracking-tighter ${colorClasses[rating]}`}>
                {value}<span className="text-[10px] uppercase font-bold ml-1">{unit}</span>
            </p>
        </div>
    );
}

const AnalyticsSkeleton: React.FC = () => (
    <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-t border-zinc-900">
            <div className="h-32 border-r border-b border-zinc-900 bg-black"></div>
            <div className="h-32 border-r border-b border-zinc-900 bg-black"></div>
            <div className="h-32 border-r border-b border-zinc-900 bg-black"></div>
        </div>
        <div className="border border-zinc-900 bg-black p-8 relative h-64 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full animate-ping"></div>
        </div>
    </div>
);

const getWebVitalsRatings = (vitals: WebVitals): { lcp: WebVitalRating; fid: WebVitalRating; cls: WebVitalRating } => ({
    lcp: vitals.lcp <= 2.5 ? 'good' : vitals.lcp <= 4 ? 'needs-improvement' : 'poor',
    fid: vitals.fid <= 100 ? 'good' : vitals.fid <= 300 ? 'needs-improvement' : 'poor',
    cls: vitals.cls <= 0.1 ? 'good' : vitals.cls <= 0.25 ? 'needs-improvement' : 'poor',
});

export const AnalyticsTab: React.FC<{ data: AnalyticsData }> = ({ data }) => {
    const [isLoading, setIsLoading] = useState(true);
    const maxVisitors = useMemo(() => Math.max(...data.dailyVisitors.map(d => d.visitors)), [data.dailyVisitors]);
    const ratings = getWebVitalsRatings(data.webVitals);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <AnalyticsSkeleton />;
    }

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-t border-zinc-900">
                <div className="border-r border-b border-zinc-900">
                    <StatCard title="Total Requests [7d]" value={data.dailyVisitors.reduce((sum, day) => sum + day.visitors, 0).toLocaleString()} />
                </div>
                <div className="border-r border-b border-zinc-900">
                    <StatCard title="Logic Invocations" value={data.totalPageViews.toLocaleString()} />
                </div>
                <div className="border-r border-b border-zinc-900">
                    <StatCard title="Avg Latency" value={data.avgLoadTime.toString()} unit="ms" />
                </div>
            </div>

            <div className="border border-zinc-900 bg-black overflow-hidden">
                <div className="px-8 py-5 border-b border-zinc-900 bg-zinc-950/50">
                    <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Traffic Distribution</h3>
                </div>
                <div className="p-12">
                    <div className="flex justify-between items-end h-48 gap-4">
                        {data.dailyVisitors.map((dayData, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center justify-end group">
                                <div
                                    className="w-full bg-zinc-900 border border-zinc-800 hover:bg-white hover:border-white transition-all duration-500"
                                    style={{ height: `${(dayData.visitors / maxVisitors) * 100}%` }}
                                ></div>
                                <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest mt-4 opacity-0 group-hover:opacity-100 transition-opacity">{dayData.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border border-zinc-900 bg-black overflow-hidden">
                <div className="px-8 py-5 border-b border-zinc-900 bg-zinc-950/50">
                    <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Node Efficiency</h3>
                </div>
                <div className="p-12">
                    <div className="grid grid-cols-3 gap-12 text-center md:text-left">
                        <WebVitalIndicator metric="Nexus LCP" value={data.webVitals.lcp} unit="s" rating={ratings.lcp} />
                        <WebVitalIndicator metric="Nexus FID" value={data.webVitals.fid} unit="ms" rating={ratings.fid} />
                        <WebVitalIndicator metric="Nexus CLS" value={data.webVitals.cls} unit="%" rating={ratings.cls} />
                    </div>
                </div>
            </div>
        </div>
    );
};