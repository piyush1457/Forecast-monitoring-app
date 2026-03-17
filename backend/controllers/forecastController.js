const elexonService = require('../services/elexonService');

const getForecastComparison = async (req, res) => {
    try {
        const { startDate, endDate, horizon = 4 } = req.query;
        const from = startDate || '2025-01-01T00:00:00Z';
        const to = endDate || new Date().toISOString();

        const actualData = await elexonService.fetchActualGeneration(from, to);
        const forecastData = await elexonService.fetchWindForecast(from, to);
        
        const horizons = (req.query.horizons || '4').split(',').map(h => parseInt(h));
        const processed = elexonService.processData(actualData, forecastData, horizons);

        const summaries = {};
        horizons.forEach(h => {
            const horizonData = processed
                .filter(p => p.forecasts[h])
                .map(p => p.forecasts[h].error)
                .sort((a, b) => a - b);

            if (horizonData.length > 0) {
                const totalError = horizonData.reduce((acc, curr) => acc + curr, 0);
                const mid = Math.floor(horizonData.length / 2);
                const p95Idx = Math.floor(horizonData.length * 0.95);

                summaries[h] = {
                    avgError: (totalError / horizonData.length).toFixed(2),
                    maxError: Math.max(...horizonData).toFixed(2),
                    medianError: (horizonData.length % 2 !== 0 ? horizonData[mid] : (horizonData[mid - 1] + horizonData[mid]) / 2).toFixed(2),
                    p95Error: horizonData[p95Idx].toFixed(2),
                    count: horizonData.length
                };
            } else {
                summaries[h] = { avgError: 0, maxError: 0, medianError: 0, p95Error: 0, count: 0 };
            }
        });

        res.json({
            summaries,
            data: processed
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getForecastComparison };
