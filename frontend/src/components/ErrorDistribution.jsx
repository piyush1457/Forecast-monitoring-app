import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

const ErrorDistribution = ({ data, focalHorizon, focalSummary }) => {
  const histogramData = useMemo(() => {
    if (!data.length) return [];

    const errors = data
      .map(p => p.forecasts[focalHorizon]?.error)
      .filter(e => e !== undefined)
      .sort((a, b) => a - b);

    if (errors.length === 0) return [];

    const min = 0;
    const max = Math.ceil(Math.max(...errors) / 100) * 100;
    const binCount = 15;
    const binSize = (max - min) / binCount;

    const bins = Array.from({ length: binCount }, (_, i) => ({
      binStart: min + i * binSize,
      binEnd: min + (i + 1) * binSize,
      count: 0,
      label: `${Math.round(min + i * binSize)} - ${Math.round(min + (i + 1) * binSize)}`
    }));

    errors.forEach(e => {
      const binIdx = Math.min(Math.floor((e - min) / binSize), binCount - 1);
      if (binIdx >= 0) bins[binIdx].count++;
    });

    return bins;
  }, [data, focalHorizon]);

  if (histogramData.length === 0) return null;

  return (
    <div className="card shadow-xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-900/50">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Error Distribution</h3>
          <p className="text-sm text-slate-500">Frequency of absolute forecast errors (MW)</p>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 10 }} 
              stroke="#94a3b8" 
              interval={1}
            />
            <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
            <Tooltip 
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl text-xs">
                      <p className="font-bold mb-1 text-slate-900 dark:text-white">Range: {payload[0].payload.label} MW</p>
                      <p className="text-blue-500 font-semibold">Frequency: {payload[0].value} intervals</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]} 
              className="fill-blue-500 hover:fill-blue-600 transition-colors"
            />
            
            {/* Markers for Mean and P95 */}
            <ReferenceLine 
              x={histogramData.find(b => focalSummary.avgError >= b.binStart && focalSummary.avgError < b.binEnd)?.label} 
              stroke="#10b981" 
              strokeWidth={2}
              strokeDasharray="5 5"
            >
              <Label value="Mean" position="top" fill="#10b981" fontSize={10} fontWeight="bold" />
            </ReferenceLine>
            
            <ReferenceLine 
              x={histogramData.find(b => focalSummary.p95Error >= b.binStart && focalSummary.p95Error < b.binEnd)?.label} 
              stroke="#f43f5e" 
              strokeWidth={2}
              strokeDasharray="5 5"
            >
              <Label value="P95" position="top" fill="#f43f5e" fontSize={10} fontWeight="bold" />
            </ReferenceLine>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ErrorDistribution;
