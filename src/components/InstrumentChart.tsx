import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { MetricsData } from '../types/instrumentTypes';
import ErrorMessage from './ErrorMessage';
import { DateTime } from 'luxon';
import { formatDollarAmount } from '../utils/formatter';

interface InstrumentChartProps {
  symbol: string;
  assetType: string;
  onError: (error: string) => void;
  interval: string;
  timeRange: string;
  timezone: string;
}

const InstrumentChart: React.FC<InstrumentChartProps> = ({ symbol, assetType, onError, interval, timeRange, timezone }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTimeRange = (range: string): { start: DateTime; end: DateTime } => {
    const end = DateTime.now().setZone(timezone);
    let start: DateTime;

    switch (range) {
      case '1h':
        start = end.minus({ hours: 1 });
        break;
      case '12h':
        start = end.minus({ hours: 12 });
        break;
      case '24h':
        start = end.minus({ hours: 24 });
        break;
      case '3d':
        start = end.minus({ days: 3 });
        break;
      case '7d':
        start = end.minus({ days: 7 });
        break;
      case '30d':
        start = end.minus({ days: 30 });
        break;
      default:
        start = end.minus({ hours: 24 });
    }

    return { start, end };
  };

  const adjustForBusinessHours = (start: DateTime, end: DateTime): { start: DateTime; end: DateTime } => {
    if (assetType.toLowerCase() !== 'cryptocurrency') {
      start = start.set({ hour: 9, minute: 30 });
      end = end.set({ hour: 16, minute: 0 });

      while (start.weekday > 5) {
        start = start.minus({ days: 1 });
      }
      while (end.weekday > 5) {
        end = end.minus({ days: 1 });
      }
    }

    return { start, end };
  };

  const fetchChartData = async () => {
    setIsLoading(true);
    try {
      const metricsServiceUrl = import.meta.env.VITE_METRICS_SERVICE_URL || "stockzrs-metrics-service.stockzrs.com";
      if (!metricsServiceUrl) {
        throw new Error('Metrics service URL is not configured');
      }
      const http = import.meta.env.VITE_ENVIRONMENT === 'local' ? 'http' : 'https';

      let { start, end } = getTimeRange(timeRange);
      ({ start, end } = adjustForBusinessHours(start, end));

      const url = new URL(`${http}://${metricsServiceUrl}/chart/price_data`);
      url.searchParams.append('symbol', symbol);
      url.searchParams.append('asset_type', assetType);
      url.searchParams.append('interval', interval);
      url.searchParams.append('start_time', start.toUTC().toISO()!);
      url.searchParams.append('end_time', end.toUTC().toISO()!);

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Failed to load chart data, please reconnect or try again later.`);
      }
      const data = await response.json();
      
      if (!data.data || data.data.length === 0) {
        throw new Error('No data available for the specified parameters');
      }
      
      const formattedData = data.data.map((item: MetricsData) => ({
        x: DateTime.fromISO(item.timestamp, { zone: 'UTC' }).setZone(timezone).toString(),
        y: [item.open_price, item.high_price, item.low_price, item.close_price]
      }));
      
      setChartData(formattedData);
    } catch (err) {
      if (err instanceof Error) {
        onError(`Failed to fetch chart data. Please reconnect or try again later.`);
      } else {
        onError('An unexpected error occurred while fetching chart data');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [symbol, assetType, interval, timeRange, timezone]);

  const options: ApexOptions = {
    chart: {
      type: 'candlestick',
      background: '#ffffff',
    },
    title: {
      text: `${symbol} Chart`,
      align: 'left',
      style: {
        color: '#333333',
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#333333'
        },
        datetimeUTC: false,
        datetimeFormatter: {
          year: 'yyyy',
          month: "MMM 'yy",
          day: 'dd MMM',
          hour: 'HH:mm'
        }
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      },
      labels: {
        style: {
          colors: '#333333'
        },
        formatter: (value) => formatDollarAmount(value)
      }
    },
    tooltip: {
      theme: 'light',
      x: {
        formatter: function(val) {
          return DateTime.fromMillis(val).setZone(timezone).toFormat('yyyy-MM-dd HH:mm ZZZZ');
        }
      },
      y: {
        formatter: function(val) {
          return formatDollarAmount(val);
        }
      }
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#26A69A',
          downward: '#EF5350'
        }
      }
    },
    theme: {
      mode: 'light',
    }
  };

  const series = [{
    data: chartData
  }];

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : chartData.length > 0 ? (
        <div className="bg-white p-4 rounded-lg">
          <ReactApexChart options={options} series={series} type="candlestick" height={500} />
        </div>
      ) : (
        <ErrorMessage message="No data available for the selected parameters" />
      )}
    </div>
  );
};

export default InstrumentChart;