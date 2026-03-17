const axios = require('axios');

const BASE_URL = 'https://data.elexon.co.uk/bmrs/api/v1/datasets';

const fetchActualGeneration = async (from, to) => {
    try {
        const response = await axios.get(`${BASE_URL}/FUELHH/stream`, {
            params: {
                publishDateTimeFrom: from,
                publishDateTimeTo: to,
                format: 'json'
            }
        });
        
        return response.data
            .filter(item => item.fuelType === 'WIND')
            .map(item => ({
                startTime: item.startTime,
                generation: item.generation
            }));
    } catch (error) {
        console.error('Error fetching actual generation:', error.message);
        throw error;
    }
};

const fetchWindForecast = async (from, to) => {
    try {
        const response = await axios.get(`${BASE_URL}/WINDFOR/stream`, {
            params: {
                publishDateTimeFrom: from,
                publishDateTimeTo: to,
                format: 'json'
            }
        });

        return response.data.map(item => ({
            startTime: item.startTime,
            publishTime: item.publishTime,
            generation: item.generation
        }));
    } catch (error) {
        console.error('Error fetching wind forecast:', error.message);
        throw error;
    }
};

const processData = (actualData, forecastData, horizons) => {
    const horizonMaps = horizons.map(horizon => {
        const horizonMs = horizon * 60 * 60 * 1000;
        const latestForecasts = new Map();

        forecastData.forEach(f => {
            const startTimeTs = new Date(f.startTime).getTime();
            const publishTimeTs = new Date(f.publishTime).getTime();
            const targetLimit = startTimeTs - horizonMs;

            if (publishTimeTs <= targetLimit) {
                const existing = latestForecasts.get(f.startTime);
                if (!existing || new Date(f.publishTime) > new Date(existing.publishTime)) {
                    latestForecasts.set(f.startTime, f);
                }
            }
        });
        return { horizon, map: latestForecasts };
    });

    return actualData.map(a => {
        const result = {
            time: a.startTime,
            actual: a.generation,
            forecasts: {}
        };

        let hasAnyForecast = false;
        horizonMaps.forEach(({ horizon, map }) => {
            const forecast = map.get(a.startTime);
            if (forecast) {
                result.forecasts[horizon] = {
                    value: forecast.generation,
                    publishTime: forecast.publishTime,
                    error: Math.abs(a.generation - forecast.generation)
                };
                hasAnyForecast = true;
            }
        });

        return hasAnyForecast ? result : null;
    }).filter(item => item !== null);
};

module.exports = { fetchActualGeneration, fetchWindForecast, processData };
