import { useMemo } from 'react';

export const useSmoothedData = (data, isEnabled, windowSize = 5) => {
  return useMemo(() => {
    if (!isEnabled || !data.length || windowSize <= 1) return data;

    return data.map((point, index) => {
      const start = Math.max(0, index - Math.floor(windowSize / 2));
      const end = Math.min(data.length, start + windowSize);
      const window = data.slice(start, end);

      const smoothedPoint = { ...point };
      
      // Smooth actual
      const actualSum = window.reduce((acc, p) => acc + p.actual, 0);
      smoothedPoint.actual = actualSum / window.length;

      // Smooth forecasts
      smoothedPoint.forecasts = { ...point.forecasts };
      Object.keys(point.forecasts).forEach(h => {
        const forecastSum = window.reduce((acc, p) => acc + (p.forecasts[h]?.value || 0), 0);
        const forecastCount = window.filter(p => p.forecasts[h]).length;
        
        if (forecastCount > 0) {
          smoothedPoint.forecasts[h] = {
            ...point.forecasts[h],
            value: forecastSum / forecastCount,
            // We don't smooth error directly, we keep the original error metadata 
            // or recompute it? Recomputing might be better for "Smoothed Error" view.
            smoothedError: Math.abs(smoothedPoint.actual - (forecastSum / forecastCount))
          };
        }
      });

      return smoothedPoint;
    });
  }, [data, isEnabled, windowSize]);
};
