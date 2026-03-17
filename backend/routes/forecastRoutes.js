const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');
router.get('/comparison', forecastController.getForecastComparison);
module.exports = router;
