import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MetricsData } from '../types/instrumentTypes';
import ErrorMessage from './ErrorMessage';
import { DateTime } from 'luxon';

interface InstrumentChartProps {
  symbol: string;
  assetType: string;
}

const InstrumentChart: React.FC<InstrumentChartProps> = ({ symbol, assetType }) => {
  const [chartData, setChartData] = useState<MetricsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // const metricsServiceUrl = import.meta.env.VITE_METRICS_SERVICE_URL;
        const metricsServiceUrl = "stockzrs-metrics-service.stockzrs.com"
        if (!metricsServiceUrl) {
          throw new Error('Metrics service URL is not configured');
        }
        const response = await fetch(`http://${metricsServiceUrl}/chart/last_24_hours?symbol=${symbol}&asset_type=${assetType}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.data || data.data.length === 0) {
          throw new Error('No data available for the specified symbol');
        }
        const localData = data.data.map((item: MetricsData) => ({
          ...item,
          timestamp: DateTime.fromISO(item.timestamp, { zone: 'utc' }).toLocal().toISO(),
        }));
        setChartData(localData);
      } catch (err) {
        if (err instanceof Error) {
          setError(`Failed to fetch chart data: ${err.message}`);
        } else {
          setError('An unexpected error occurred while fetching chart data');
        }
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [symbol, assetType]);

  const formatXAxis = (tickItem: string) => {
    return DateTime.fromISO(tickItem).toLocaleString(DateTime.TIME_SIMPLE);
  };

  const formatTooltipLabel = (label: string) => {
    return DateTime.fromISO(label).toLocaleString(DateTime.DATETIME_SHORT);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="bg-white">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatXAxis}
            stroke="#666"
          />
          <YAxis 
            domain={['auto', 'auto']} 
            stroke="#666"
          />
          <Tooltip
            labelFormatter={formatTooltipLabel}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="close_price" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={false} 
            activeDot={{ r: 8 }}
            name="Close Price"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InstrumentChart;