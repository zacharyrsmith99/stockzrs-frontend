import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { MetricsData } from '../types/instrumentTypes';
import ErrorMessage from './ErrorMessage';
import { DateTime } from 'luxon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InstrumentChartProps {
  symbol: string;
  assetType: string;
  onError: (error: string) => void;
}

type IntervalType = '5min' | '15min' | '1hour' | '1day';
type TimeRangeType = '1h' | '12h' | '24h' | '3d' | 'today' | '7d' | '30d';

const intervalLabels: Record<IntervalType, string> = {
  '5min': '5 Minutes',
  '15min': '15 Minutes',
  '1hour': '1 Hour',
  '1day': '1 Day'
};

const timeRangeLabels: Record<TimeRangeType, string> = {
  '1h': 'Last Hour',
  '12h': 'Last 12 Hours',
  '24h': 'Last 24 Hours',
  '3d': 'Last 3 Days',
  'today': 'Today',
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days'
};

const InstrumentChart: React.FC<InstrumentChartProps> = ({ symbol, assetType, onError }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [interval, setInterval] = useState<IntervalType>('1hour');
  const [timeRange, setTimeRange] = useState<TimeRangeType>('24h');

  const getTimeRange = (range: TimeRangeType): { start: DateTime; end: DateTime } => {
    const end = DateTime.now();
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
      case 'today':
        start = end.startOf('day');
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

  const fetchChartData = async () => {
    setIsLoading(true);
    try {
      const metricsServiceUrl = import.meta.env.VITE_METRICS_SERVICE_URL || "stockzrs-metrics-service.stockzrs.com";
      if (!metricsServiceUrl) {
        throw new Error('Metrics service URL is not configured');
      }
      const http = import.meta.env.VITE_ENVIRONMENT === 'local' ? 'http' : 'https';

      const { start, end } = getTimeRange(timeRange);

      let adjustedStart = start;
      let adjustedEnd = end;

      if (assetType.toLowerCase() === 'stock') {
        adjustedStart = getLastBusinessDay(start);
        adjustedEnd = getLastBusinessDay(end);
        adjustedStart = adjustedStart.set({ hour: 9, minute: 30 });
        adjustedEnd = adjustedEnd.set({ hour: 16, minute: 30 });
      }

      const url = new URL(`${http}://${metricsServiceUrl}/chart/price_data`);
      url.searchParams.append('symbol', symbol);
      url.searchParams.append('asset_type', assetType);
      url.searchParams.append('interval', interval);
      url.searchParams.append('start_time', adjustedStart.toISO()!);
      url.searchParams.append('end_time', adjustedEnd.toISO()!);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.data || data.data.length === 0) {
        throw new Error('No data available for the specified parameters');
      }
      const formattedData = data.data.map((item: MetricsData) => ({
        x: new Date(item.timestamp).getTime(),
        y: [item.open_price, item.high_price, item.low_price, item.close_price]
      }));
      setChartData(formattedData);
    } catch (err) {
      if (err instanceof Error) {
        onError(`Failed to fetch chart data: ${err.message}`);
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
  }, [symbol, assetType, interval, timeRange]);

  const getLastBusinessDay = (date: DateTime): DateTime => {
    let businessDay = date;
    while (businessDay.weekday > 5) {
      businessDay = businessDay.minus({ days: 1 });
    }
    return businessDay;
  };

  const options: ApexOptions = {
    chart: {
      type: 'candlestick',
      height: 350,
      background: '#424242',
    },
    title: {
      text: `${symbol} Chart`,
      align: 'left',
      style: {
        color: '#E0E0E0',
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#E0E0E0'
        }
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      },
      labels: {
        style: {
          colors: '#E0E0E0'
        }
      }
    },
    tooltip: {
      theme: 'dark',
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
      mode: 'dark',
    }
  };

  const series = [{
    data: chartData
  }];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={interval} onValueChange={(value: IntervalType) => setInterval(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select interval" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(intervalLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={timeRange} onValueChange={(value: TimeRangeType) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(timeRangeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : chartData.length > 0 ? (
        <div className="bg-gray-800 p-4 rounded-lg">
          <ReactApexChart options={options} series={series} type="candlestick" height={350} />
        </div>
      ) : (
        <ErrorMessage message="No data available for the selected parameters" />
      )}
    </div>
  );
};

export default InstrumentChart;