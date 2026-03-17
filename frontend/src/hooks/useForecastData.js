import { useState, useEffect, useCallback } from 'react';
import { getForecastComparison } from '../services/api';

export const useForecastData = (startDate, endDate, selectedHorizons) => {
  const [data, setData] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (start, end, horizons) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getForecastComparison(
        `${start}T00:00:00Z`,
        `${end}T23:59:59Z`,
        horizons
      );
      setData(result.data);
      setSummaries(result.summaries);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData(startDate, endDate, selectedHorizons);
    }, 400); // 400ms debounce

    return () => clearTimeout(handler);
  }, [startDate, endDate, selectedHorizons, fetchData]);

  return { data, summaries, loading, error, refetch: () => fetchData(startDate, endDate, selectedHorizons) };
};
