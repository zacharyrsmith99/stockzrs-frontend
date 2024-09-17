import React, { useState } from 'react';
import { SelectedInstrumentProvider, useSelectedInstrument } from '../contexts/SelectedInstrumentContext';
import InstrumentCardsContainer from './InstrumentCardsContainer';
import InstrumentChart from './InstrumentChart';
import AssetInfoBox from './AssetInfoBox';
import ErrorMessage from './ErrorMessage';

const MemoizedInstrumentChart = React.memo(InstrumentChart);

const ChartContainer: React.FC = () => {
  const { displayedInstrument } = useSelectedInstrument();
  const [chartError, setChartError] = useState<string | null>(null);

  if (!displayedInstrument) {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
        <p className="text-gray-600">Select an instrument to display the chart.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800">
            {displayedInstrument.name} ({displayedInstrument.symbol})
          </h2>
        </div>
        <div className="p-6">
          {chartError ? (
            <ErrorMessage message={chartError} />
          ) : (
            <MemoizedInstrumentChart 
              symbol={displayedInstrument.symbol} 
              assetType={displayedInstrument.type}
              onError={(error) => setChartError(error)}
            />
          )}
        </div>
      </div>
      <AssetInfoBox instrument={displayedInstrument} />
    </div>
  );
};

const TopInstruments: React.FC = () => {
  return (
    <SelectedInstrumentProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <ChartContainer />
          </div>
          <div className="lg:w-1/3">
            <InstrumentCardsContainer />
          </div>
        </div>
      </div>
    </SelectedInstrumentProvider>
  );
};

export default TopInstruments;