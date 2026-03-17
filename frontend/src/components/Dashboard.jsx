import React, { useState } from 'react';
import WindChart from './WindChart';
import Controls from './Controls';
import SummaryCard from './SummaryCard';
import KeyInsights from './KeyInsights';
import ErrorDistribution from './ErrorDistribution';
import { CardSkeleton, ChartSkeleton, InsightSkeleton } from './LoadingSkeleton';
import { useForecastData } from '../hooks/useForecastData';
import { useSmoothedData } from '../hooks/useSmoothedData';
import { Activity, AlertTriangle, TrendingUp, Info } from 'lucide-react';

const Dashboard = () => {
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedHorizons, setSelectedHorizons] = useState([2, 4, 8]);
  const [focalHorizon, setFocalHorizon] = useState(4);
  const [showErrorLine, setShowErrorLine] = useState(false);
  
  // Smoothing state
  const [isSmoothed, setIsSmoothed] = useState(false);
  const [smoothingWindow, setSmoothingWindow] = useState(5);

  const { data: rawData, summaries, loading, error } = useForecastData(startDate, endDate, selectedHorizons);
  const displayData = useSmoothedData(rawData, isSmoothed, smoothingWindow);

  const focalSummary = summaries[focalHorizon] || { avgError: 0, maxError: 0, medianError: 0, p95Error: 0, count: 0 };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800 p-8 rounded-2xl">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-rose-900 dark:text-rose-100 mb-2">Failed to load data</h2>
          <p className="text-rose-600 dark:text-rose-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8 space-y-2">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <Activity className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Operational Monitor</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Wind Forecast Analytics</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
          Deep-dive into UK wind generation forecast accuracy. Select horizons to compare and analyze error distributions.
        </p>
      </header>
      
      <Controls 
        startDate={startDate} 
        endDate={endDate} 
        horizons={selectedHorizons} 
        setStartDate={setStartDate} 
        setEndDate={setEndDate} 
        setHorizons={setSelectedHorizons}
        showErrorLine={showErrorLine} 
        setShowErrorLine={setShowErrorLine}
        focalHorizon={focalHorizon}
        setFocalHorizon={setFocalHorizon}
        isSmoothed={isSmoothed}
        setIsSmoothed={setIsSmoothed}
        smoothingWindow={smoothingWindow}
        setSmoothingWindow={setSmoothingWindow}
      />

      <div className="mt-8 mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>Performance Overview</span>
          <span className="text-sm font-normal text-slate-500">({focalHorizon}h Horizon)</span>
        </h2>
        {loading && <div className="text-primary animate-pulse font-medium">Refining data...</div>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {loading ? (
          <>
            <CardSkeleton /> <CardSkeleton /> <CardSkeleton /> <CardSkeleton />
          </>
        ) : (
          <>
            <SummaryCard title="Average Error" value={focalSummary.avgError} unit="MW" icon={TrendingUp} colorClass="bg-blue-500" />
            <SummaryCard title="Median Error" value={focalSummary.medianError} unit="MW" icon={Activity} colorClass="bg-purple-500" />
            <SummaryCard title="P95 Error" value={focalSummary.p95Error} unit="MW" icon={AlertTriangle} colorClass="bg-amber-500" />
            <SummaryCard title="Maximum Error" value={focalSummary.maxError} unit="MW" icon={AlertTriangle} colorClass="bg-rose-500" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="card shadow-2xl shadow-slate-200 dark:shadow-none relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold">Generation Comparison</h3>
              <p className="text-sm text-slate-500">Actual vs Multi-horizon Forecasts</p>
            </div>
            <div className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
               <Info className="w-4 h-4 text-blue-500" />
               <span>Forecast logic: publishTime &le; (targetTime - {focalHorizon}h)</span>
            </div>
          </div>
          
          {loading ? (
            <ChartSkeleton />
          ) : displayData.length > 0 ? (
            <WindChart 
              data={displayData} 
              horizons={selectedHorizons} 
              focalHorizon={focalHorizon} 
              showErrorLine={showErrorLine}
              isSmoothed={isSmoothed}
            />
          ) : (
            <div className="h-[450px] flex items-center justify-center text-slate-500 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              No data available for the selected range.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? <ChartSkeleton /> : <ErrorDistribution data={displayData} focalHorizon={focalHorizon} focalSummary={focalSummary} />}
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              <InsightSkeleton /> <InsightSkeleton />
            </div>
          ) : (
            <KeyInsights data={displayData} summaries={summaries} selectedHorizons={selectedHorizons} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
