const express = require('express');
const cors = require('cors');
require('dotenv').config();
const forecastRoutes = require('./routes/forecastRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/forecast', forecastRoutes);
app.get('/health', (req, res) => res.json({ status: 'OK' }));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
