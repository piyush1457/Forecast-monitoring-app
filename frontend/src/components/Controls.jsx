import React from 'react';
import { Calendar, Layers, Activity } from 'lucide-react';

const Controls = ({ 
  startDate, endDate, horizons, setStartDate, setEndDate, setHorizons, 
  showErrorLine, setShowErrorLine, focalHorizon, setFocalHorizon,
  isSmoothed, setIsSmoothed, smoothingWindow, setSmoothingWindow
}) => {
  const horizonOptions = [2, 4, 8, 12, 24, 48];

  const toggleHorizon = (h) => {
    if (horizons.includes(h)) {
      if (horizons.length > 1) {
        const next = horizons.filter(x => x !== h);
        setHorizons(next);
        if (focalHorizon === h) setFocalHorizon(next[0]);
      }
    } else {
      setHorizons([...horizons, h].sort((a, b) => a - b));
    }
  };

  return (
    <div className="card grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      <div className="xl:col-span-3 space-y-4">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-primary" />
          Time Period
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
      </div>

      <div className="xl:col-span-4 space-y-4">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-emerald-500" />
          Forecast Horizons (h)
        </label>
        <div className="flex flex-wrap gap-2">
          {horizonOptions.map(h => (
            <button
              key={h}
              onClick={() => toggleHorizon(h)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                horizons.includes(h)
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-emerald-500/50'
              }`}
            >
              {h}h
            </button>
          ))}
        </div>
      </div>

      <div className="xl:col-span-3 space-y-4">
        <div className="flex items-center justify-between">
           <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-purple-500" />
            Data Smoothing
          </label>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button 
               onClick={() => setIsSmoothed(false)}
               className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${!isSmoothed ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >RAW</button>
            <button 
               onClick={() => setIsSmoothed(true)}
               className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${isSmoothed ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >SMOOTH</button>
          </div>
        </div>
        
        {isSmoothed ? (
          <div className="space-y-4 pt-1">
             <div className="flex justify-between text-[10px] font-bold text-slate-400">
               <span>Rolling window</span>
               <span>{smoothingWindow} points</span>
             </div>
             <input 
               type="range" min="3" max="15" step="2"
               value={smoothingWindow}
               onChange={(e) => setSmoothingWindow(parseInt(e.target.value))}
               className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
             />
          </div>
        ) : (
           <div className="h-10 flex items-center text-xs text-slate-400 italic">Showing granular 30-min actuals.</div>
        )}
      </div>

      <div className="xl:col-span-2 flex xl:flex-col items-center xl:items-start justify-center gap-4 xl:gap-2 h-full xl:pt-4">
        <button 
          onClick={() => setFocalHorizon(horizons[0])} // Just a placeholder for interaction
          className="lg:hidden"
        ></button>
        <label className="relative inline-flex items-center cursor-pointer group">
          <input type="checkbox" checked={showErrorLine} onChange={(e) => setShowErrorLine(e.target.checked)} className="sr-only peer" />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
          <span className="ml-3 text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider group-hover:text-rose-500 transition-colors">Error Line</span>
        </label>
      </div>
    </div>
  );
};

export default Controls;
