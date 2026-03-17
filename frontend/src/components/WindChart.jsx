import React, { useState, useMemo } from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush, ReferenceArea } from 'recharts';
import { format } from 'date-fns';

const WindChart = ({ data, horizons, focalHorizon, showErrorLine, isSmoothed }) => {
  const [disabledSeries, setDisabledSeries] = useState([]);
  const [hoveredSeries, setHoveredSeries] = useState(null);

  const formatXAxis = (tickItem) => format(new Date(tickItem), 'MMM dd, HH:mm');
  
  // Horizon colors
  const colors = {
    2: '#10b981', // Emerald
    4: '#3b82f6', // Blue
    8: '#8b5cf6', // Violet
    12: '#f59e0b', // Amber
    24: '#ec4899', // Pink
    48: '#64748b'  // Slate
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const actual = payload.find(p => p.dataKey === 'actual')?.value || 0;
      const targetTime = new Date(label);
      
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl min-w-[280px]">
          <div className="flex justify-between items-start mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                {format(targetTime, 'EEEE, MMM dd')}
              </p>
              <p className="text-xs text-slate-500">{format(targetTime, 'HH:mm')}</p>
            </div>
            {isSmoothed && (
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold rounded-md">
                SMOOTHED
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
              <span className="text-xs font-bold text-slate-500 uppercase">Actual</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{actual.toFixed(2)} MW</span>
            </div>
            
            {horizons.map(h => {
              if (disabledSeries.includes(h)) return null;
              const forecastObj = payload[0].payload.forecasts[h];
              if (!forecastObj) return null;
              
              const isFocal = h === focalHorizon;
              const cutoffTime = new Date(targetTime.getTime() - h * 3600000);
              const isDimmed = hoveredSeries !== null && hoveredSeries !== h && hoveredSeries !== 'actual';

              return (
                <div key={h} className={`p-2 rounded-lg border transition-all ${isFocal ? 'border-blue-500/30 bg-blue-500/5' : 'border-slate-100 dark:border-slate-800 shadow-sm'} ${isDimmed ? 'opacity-40' : 'opacity-100'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold flex items-center gap-1" style={{ color: colors[h] || '#94a3b8' }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[h] || '#94a3b8' }}></div>
                      {h}h Forecast
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{forecastObj.value.toFixed(2)} MW</span>
                  </div>
                  <div className="grid grid-cols-2 text-[9px] text-slate-400 leading-tight gap-y-1">
                    <span className="font-medium text-rose-500/80">Err: {forecastObj.error.toFixed(1)} MW</span>
                    <span className="text-right">Pub: {format(new Date(forecastObj.publishTime), 'HH:mm')}</span>
                    <span className="col-span-2 text-[8px] text-slate-500 italic mt-0.5 pt-0.5 border-t border-slate-100 dark:border-slate-800/50">
                      Cutoff: {format(cutoffTime, 'MMM dd, HH:mm')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-3 pt-2 text-[8px] text-slate-400 border-t border-slate-100 dark:border-slate-800 leading-normal">
             * Selection logic: Latest forecast published on or before the cutoff time.
          </div>
        </div>
      );
    }
    return null;
  };

  // Find areas of high error for focal horizon
  const highErrorAreas = useMemo(() => {
    const ERROR_THRESHOLD = 800;
    const areas = [];
    let currentArea = null;

    data.forEach((d) => {
      const error = d.forecasts[focalHorizon]?.error || 0;
      if (error > ERROR_THRESHOLD) {
        if (!currentArea) currentArea = { x1: d.time };
      } else if (currentArea) {
        currentArea.x2 = d.time;
        areas.push(currentArea);
        currentArea = null;
      }
    });
    if (currentArea) {
      currentArea.x2 = data[data.length - 1].time;
      areas.push(currentArea);
    }
    return areas;
  }, [data, focalHorizon]);

  const handleLegendClick = (o) => {
    const { value } = o;
    if (!value) return;
    const h = parseInt(value.match(/\d+/)?.join(''));
    if (isNaN(h)) return;

    setDisabledSeries(prev => 
      prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]
    );
  };

  return (
    <div className="h-[550px] w-full mt-2 select-none">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800/50" />
          
          <XAxis 
            dataKey="time" 
            tickFormatter={formatXAxis} 
            minTickGap={80} 
            stroke="#94a3b8" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            dy={10}
          />
          
          <YAxis 
            stroke="#94a3b8" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            dx={-10}
            label={{ value: 'Generation (MW)', angle: -90, position: 'insideLeft', offset: -5, fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
          />

          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '5 5' }}
            animationDuration={200}
          />

          <Legend 
            verticalAlign="top" 
            align="right" 
            height={40} 
            iconType="circle" 
            onClick={handleLegendClick}
            wrapperStyle={{ paddingBottom: '20px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
             formatter={(value) => {
                const label = typeof value === 'string' ? value : '';
                const h = parseInt(label.match(/\d+/)?.join(''));
                const isDisabled = !isNaN(h) && disabledSeries.includes(h);
                return <span className={`transition-opacity ${isDisabled ? 'opacity-30' : 'opacity-100'}`}>{value}</span>;
             }}
          />
          
          {highErrorAreas.map((area, idx) => (
            <ReferenceArea 
              key={idx} 
              x1={area.x1} 
              x2={area.x2} 
              fill="#f43f5e" 
              fillOpacity={0.02} 
              stroke="none"
              label={{ position: 'top', value: 'High Variability', fill: '#f43f5e', fontSize: 9, fontWeight: 'bold', offset: 10 }}
            />
          ))}

          <Area 
            type={isSmoothed ? "basis" : "monotone"} 
            dataKey="actual" 
            stroke="none"
            fill="url(#colorActual)"
            baseLine={0}
            connectNulls
          />

          <Line 
            type={isSmoothed ? "basis" : "monotone"} 
            dataKey="actual" 
            stroke="#0f172a" 
            className="dark:stroke-white transition-all" 
            name="Actual Gen." 
            strokeWidth={hoveredSeries === 'actual' ? 5 : 3} 
            dot={false} 
            activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }} 
            onMouseEnter={() => setHoveredSeries('actual')}
            onMouseLeave={() => setHoveredSeries(null)}
            strokeOpacity={hoveredSeries === null || hoveredSeries === 'actual' ? 1 : 0.3}
          />

          {horizons.map(h => (
            <Line
              key={h}
              type={isSmoothed ? "basis" : "monotone"}
              dataKey={(d) => d.forecasts[h]?.value}
              stroke={colors[h] || '#94a3b8'}
              name={`${h}h Forecast`}
              strokeWidth={h === focalHorizon ? (hoveredSeries === h ? 4 : 3) : (hoveredSeries === h ? 3 : 1.5)}
              strokeDasharray={h === focalHorizon ? "0" : "4 4"}
              dot={false}
              activeDot={{ r: 5, stroke: 'white', strokeWidth: 2 }}
              connectNulls
              animationDuration={500}
              hide={disabledSeries.includes(h)}
              strokeOpacity={hoveredSeries === null || hoveredSeries === h ? (h === focalHorizon ? 1 : 0.7) : 0.15}
              onMouseEnter={() => setHoveredSeries(h)}
              onMouseLeave={() => setHoveredSeries(null)}
            />
          ))}

          {showErrorLine && (
            <Line 
              type="monotone" 
              dataKey={(d) => d.forecasts[focalHorizon]?.error} 
              stroke="#f43f5e" 
              name={`Abs. Error (${focalHorizon}h)`} 
              strokeWidth={2} 
              strokeDasharray="2 2" 
              dot={false} 
              animationDuration={500}
              strokeOpacity={hoveredSeries === null ? 0.8 : 0.2}
            />
          )}

          <Brush 
            dataKey="time" 
            height={30} 
            stroke="#94a3b8" 
            fill="transparent"
            tickFormatter={formatXAxis}
            travellerWidth={10}
            className="dark:opacity-30"
          >
            <ComposedChart>
              <Area dataKey="actual" fill="#3b82f6" fillOpacity={0.1} stroke="none" />
            </ComposedChart>
          </Brush>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WindChart;
