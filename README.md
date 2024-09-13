# stockzrs-frontend

## Overview

stockzrs-frontend is the React-based user interface for the stockzrs project, a comprehensive financial data visualization platform. This frontend application provides real-time display of financial data, including stock prices, cryptocurrencies, and other financial instruments.

## Features

- Real-time financial data display
- Interactive charts for visualizing trends
- Responsive design for desktop and mobile viewing
- Integration with stockzrs backend services

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Installation

To install stockzrs-frontend, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/zacharyrsmith99/stockzrs-frontend.git
   ```

2. Navigate to the project directory:
   ```
   cd stockzrs-frontend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables:
   ```
   VITE_STOCKZRS_METRICS_SERVICE_URL=<Your API URL>
   VITE_STOCKZRS_RELAY_SERVICE_WS_URL=<Your WebSocket URL>
   ```
   Replace `<Your API URL>` and `<Your WebSocket URL>` with the appropriate endpoints for your backend services.

## Running the Application

To run stockzrs-frontend locally:

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`
