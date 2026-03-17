import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE_URL });
export const getForecastComparison = async (startDate, endDate, horizons = [4]) => {
  const horizonParam = Array.isArray(horizons) ? horizons.join(',') : horizons;
  const response = await axios.get(`${API_BASE_URL}/forecast/comparison`, {
    params: { startDate, endDate, horizons: horizonParam }
  });
  return response.data;
};
export default api;
