import React from 'react';

export const CardSkeleton = () => (
  <div className="card animate-pulse bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
    <div className="flex items-center gap-5">
      <div className="p-4 rounded-2xl bg-slate-200 dark:bg-slate-800 w-16 h-16"></div>
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
      </div>
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="card animate-pulse bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 h-[500px] flex flex-col gap-6">
    <div className="flex justify-between items-center">
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/6"></div>
    </div>
    <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl relative">
        <div className="absolute inset-x-8 bottom-8 h-px bg-slate-200 dark:bg-slate-700"></div>
        <div className="absolute inset-y-8 left-8 w-px bg-slate-200 dark:bg-slate-700"></div>
    </div>
  </div>
);

export const InsightSkeleton = () => (
  <div className="card animate-pulse bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 h-40">
    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
  </div>
);
