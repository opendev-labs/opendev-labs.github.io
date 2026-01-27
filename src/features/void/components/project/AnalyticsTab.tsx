import React, { useMemo, useState, useEffect } from 'react';
import type { AnalyticsData, WebVitals } from '../../types';
import { AnimatedLoaderIcon } from '../common/AnimatedLoaderIcon';

const StatCard: React.FC<{ title: string; value: string; unit?: string; }> = ({ title, value, unit }) => (
    <div className="bg-void-line/50 p-4 rounded-lg border border-void-line">
        <p className="text-sm text-zinc-400">{title}</p>
        <p className="text-2xl font-bold text-white tracking-tight">
            {value}
            {unit && <span className="text-base font-medium text-zinc-400 ml-1">{unit}</span>}
        </p>
    </div>
);

// FIX: Define a type alias for web vital ratings to ensure type safety.
type WebVitalRating = 'good' | 'needs-improvement' | 'poor';

const WebVitalIndicator: React.FC<{ metric: string; value: number; unit: string; rating: WebVitalRating }> = ({ metric, value, unit, rating }) => {
    const colorClasses = {
        good: 'text-green-400',
        'needs-improvement': 'text-yellow-400',
        poor: 'text-red-400',
    };
    return (
        <div>
            <p className="text-sm text-zinc-400">{metric}</p>
            <p className={`text-xl font-bold ${colorClasses[rating]}`}>
                {value}<span className="text-sm font-medium">{unit}</span>
            </p>
        </div>
    );
}

const AnalyticsSkeleton: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-[76px] bg-void-line/50 rounded-lg border border-void-line"></div>
            <div className="h-[76px] bg-void-line/50 rounded-lg border border-void-line"></div>
            <div className="h-[76px] bg-void-line/50 rounded-lg border border-void-line"></div>
        </div>
        <div className="bg-void-card border border-void-line rounded-lg p-6 relative h-64 flex items-center justify-center">
             <AnimatedLoaderIcon size={40} />
        </div>
        <div className="bg-void-card border border-void-line rounded-lg p-6 h-28"></div>
    </div>
);

// FIX: Add a return type to getWebVitalsRatings to ensure TypeScript infers the correct literal types instead of 'string'.
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
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Visitors (7 days)" value={data.dailyVisitors.reduce((sum, day) => sum + day.visitors, 0).toLocaleString()} />
                <StatCard title="Total Page Views" value={data.totalPageViews.toLocaleString()} />
                <StatCard title="Avg. Load Time" value={data.avgLoadTime.toString()} unit="ms" />
            </div>
            <div className="bg-void-card border border-void-line rounded-lg p-6">
                <h3 className="font-semibold text-white mb-4">Visitors (Last 7 Days)</h3>
                <div className="flex justify-between items-end h-48 space-x-2">
                    {data.dailyVisitors.map((dayData, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center justify-end group">
                            <div 
                                className="w-full bg-void-accent/50 rounded-t-sm hover:bg-void-accent transition-colors"
                                style={{ height: `${(dayData.visitors / maxVisitors) * 100}%` }}
                            ></div>
                            <span className="text-xs text-zinc-500 mt-2">{dayData.day}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-void-card border border-void-line rounded-lg p-6">
                 <h3 className="font-semibold text-white mb-4">Core Web Vitals</h3>
                 <div className="grid grid-cols-3 gap-4 text-center">
                    <WebVitalIndicator metric="LCP" value={data.webVitals.lcp} unit="s" rating={ratings.lcp} />
                    <WebVitalIndicator metric="FID" value={data.webVitals.fid} unit="ms" rating={ratings.fid} />
                    <WebVitalIndicator metric="CLS" value={data.webVitals.cls} unit="" rating={ratings.cls} />
                 </div>
            </div>
        </div>
    );
};