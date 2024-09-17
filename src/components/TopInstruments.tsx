import React, { useState, useEffect } from 'react';
import { SelectedInstrumentProvider, useSelectedInstrument } from '../contexts/SelectedInstrumentContext';
import InstrumentCardsContainer from './InstrumentCardsContainer';
import InstrumentChart from './InstrumentChart';
import AssetInfoBox from './AssetInfoBox';
import ErrorMessage from './ErrorMessage';
import { ExtendedInstrument } from '../types/instrumentTypes';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useTimezone } from '../contexts/TimezoneContext';

const MemoizedInstrumentChart = React.memo(InstrumentChart);

const ChartContainer: React.FC = () => {
  const { displayedInstrument, updateDisplayedInstrument } = useSelectedInstrument();
  const [chartError, setChartError] = useState<string | null>(null);
  const [interval, setInterval] = useState('1hour');
  const [timeRange, setTimeRange] = useState('24h');
  const { ws } = useWebSocket();
  const { timezone } = useTimezone();

  const intervalOptions = [
    { value: '5min', label: '5 Min' },
    { value: '15min', label: '15 Min' },
    { value: '1hour', label: '1 Hour' },
  ];

  const timeRangeOptions = [
    { value: '1h', label: '1H' },
    { value: '12h', label: '12H' },
    { value: '24h', label: '24H' },
    { value: '3d', label: '3D' },
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
  ];

  useEffect(() => {
    if (ws) {
      const handleMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (displayedInstrument && data.symbol === displayedInstrument.symbol) {
          const updatedInstrument: ExtendedInstrument = {
            ...displayedInstrument,
            price: data.price,
            change: data.price - displayedInstrument.comparisonPrice,
            changePercent: ((data.price - displayedInstrument.comparisonPrice) / displayedInstrument.comparisonPrice) * 100,
            recentTimestamp: data.timestamp,
          };
          updateDisplayedInstrument(updatedInstrument);
        }
      };

      ws.addEventListener('message', handleMessage);

      return () => {
        ws.removeEventListener('message', handleMessage);
      };
    }
  }, [ws, displayedInstrument, updateDisplayedInstrument]);

  if (!displayedInstrument) {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
        <p className="text-gray-600">Select an instrument to display the chart.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-500 p-4 text-white">
        <h2 className="text-2xl font-semibold">
          {displayedInstrument.name} ({displayedInstrument.symbol})
        </h2>
      </div>
      <div className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <div className="space-x-2">
            {intervalOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setInterval(option.value)}
                className={`px-3 py-1 text-sm rounded-full ${
                  interval === option.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors duration-200`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="space-x-2">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={`px-3 py-1 text-sm rounded-full ${
                  timeRange === option.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors duration-200`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        {chartError ? (
          <ErrorMessage message={chartError} />
        ) : (
          <MemoizedInstrumentChart 
            symbol={displayedInstrument.symbol} 
            assetType={displayedInstrument.type}
            onError={(error) => setChartError(error)}
            interval={interval}
            timeRange={timeRange}
            timezone={timezone}
          />
        )}
      </div>
      <AssetInfoBox />
    </div>
  );
};

const TopInstruments: React.FC = () => {
  return (
    <SelectedInstrumentProvider>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ChartContainer />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <InstrumentCardsContainer />
          </div>
        </div>
      </div>
    </SelectedInstrumentProvider>
  );
};

export default TopInstruments;