# Wind Forecast Monitoring Dashboard

A production-quality full-stack web application for monitoring wind power forecast accuracy in the UK using real-world APIs from Elexon BMRS.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Charts**: Recharts
- **Backend**: Node.js, Express
- **Data Fetching**: Axios
- **Icons**: Lucide React
- **Date Utilities**: Date-fns

## Key Features

- **Interactive Line Chart**: Visual comparison of actual vs forecasted generation (30-min intervals).
- **Forecast Horizon Slider**: Dynamic filtering of forecasts based on their publish time relative to the target time (0-48h).
- **Summary Cards**: Real-time calculation of Average Error and Maximum Error.
- **Date Range Filter**: Focus on specific time periods from January 2025 onwards.
- **Error Line Toggle**: Optional visibility for absolute error tracking.
- **Responsive Design**: Optimized for both mobile and desktop viewing.

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- npm

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   The backend will run on [http://localhost:5000](http://localhost:5000).

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on [http://localhost:5173](http://localhost:5173).

## Data Integration

- **Actual Generation**: Fetched from Elexon BMRS `FUELHH` dataset (WIND category).
- **Forecast Generation**: Fetched from Elexon BMRS `WINDFOR` dataset.
- **Horizon Logic**: For each target time, the dashboard selects the latest forecast published at least `X` hours before the target time, where `X` is the selected horizon.

## AI Disclosure

This project was built with the assistance of **Anti-gravity (AI)** to ensure high-quality code structure, modularity, and premium UI/UX design.

---
*Created as part of a technical assignment for wind power monitoring.*
