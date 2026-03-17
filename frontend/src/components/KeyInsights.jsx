import React, { useMemo } from 'react';
import { Lightbulb, TrendingDown, Clock, Zap } from 'lucide-react';

const KeyInsights = ({ data, summaries, selectedHorizons }) => {
  const insights = useMemo(() => {
    if (!data.length || !Object.keys(summaries).length) return [];
    
    const results = [];

    // Insight 1: Horizon Sensitivity
    const sortedHorizons = [...selectedHorizons].sort((a, b) => a - b);
    if (sortedHorizons.length >= 2) {
      const hMin = sortedHorizons[0];
      const hMax = sortedHorizons[sortedHorizons.length - 1];
      const errMin = parseFloat(summaries[hMin]?.avgError || 0);
      const errMax = parseFloat(summaries[hMax]?.avgError || 0);
      
      if (errMax > errMin * 1.2) {
        results.push({
          title: "Horizon Sensitivity",
          description: `Forecast error increases significantly with longer horizons. The ${hMax}h horizon has ${((errMax/errMin - 1) * 100).toFixed(0)}% more error than the ${hMin}h horizon.`,
          icon: Clock,
          color: "text-amber-500",
          bgColor: "bg-amber-500/10"
        });
      }
    }

    // Insight 2: Peak Error Periods
    const hourErrors = new Array(24).fill(0).map(() => ({ total: 0, count: 0 }));
    data.forEach(d => {
      const hour = new Date(d.time).getHours();
      const error = Object.values(d.forecasts)[0]?.error || 0;
      hourErrors[hour].total += error;
      hourErrors[hour].count += 1;
    });

    const avgHourErrors = hourErrors.map((h, i) => ({ hour: i, avg: h.count ? h.total / h.count : 0 }));
    const peakHour = [...avgHourErrors].sort((a, b) => b.avg - a.avg)[0];

    if (peakHour && peakHour.avg > 0) {
      const period = peakHour.hour >= 12 ? (peakHour.hour === 12 ? '12 PM' : `${peakHour.hour - 12} PM`) : (peakHour.hour === 0 ? '12 AM' : `${peakHour.hour} AM`);
      results.push({
        title: "Diurnal Variability",
        description: `Highest forecast errors are typically observed around ${period}. Consider additional balancing reserves during this window.`,
        icon: Zap,
        color: "text-rose-500",
        bgColor: "bg-rose-500/10"
      });
    }

    // Insight 3: Stability Check
    const volatilePoints = data.filter(d => {
        const errors = Object.values(d.forecasts).map(f => f.error);
        return Math.max(...errors) > 1000;
    }).length;

    if (volatilePoints > data.length * 0.1) {
        results.push({
            title: "High Volatility detected",
            description: `Approximately ${((volatilePoints/data.length)*100).toFixed(0)}% of data points show errors exceeding 1000 MW. Generation variability is currently high.`,
            icon: TrendingDown,
            color: "text-indigo-500",
            bgColor: "bg-indigo-500/10"
        });
    } else {
        results.push({
            title: "Stable Forecast Period",
            description: "Wind generation and forecasts are showing high correlation with low intermittent spikes in the current date range.",
            icon: Lightbulb,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10"
        });
    }

    return results;
  }, [data, summaries, selectedHorizons]);

  return (
    <div className="card shadow-xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-900/50">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Key Insights</h3>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full ${insight.bgColor} blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="relative flex flex-col h-full">
              <div className={`${insight.bgColor} ${insight.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                <insight.icon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">{insight.title}</h4>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed flex-grow">
                {insight.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyInsights;
