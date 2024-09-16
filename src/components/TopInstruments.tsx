import React, { useState } from 'react';
import { SelectedInstrumentProvider, useSelectedInstrument } from '../contexts/SelectedInstrumentContext';
import InstrumentCardsContainer from './InstrumentCardsContainer';
import InstrumentChart from './InstrumentChart';
import ErrorMessage from './ErrorMessage';

const MemoizedInstrumentChart = React.memo(InstrumentChart);

const ChartContainer: React.FC = () => {
  const { selectedInstrument } = useSelectedInstrument();
  const [chartError, setChartError] = useState<string | null>(null);

  if (!selectedInstrument) {
    return null;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-12">
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800">{selectedInstrument.symbol} Chart</h2>
      </div>
      <div className="p-6">
        {chartError ? (
          <ErrorMessage message={chartError} />
        ) : (
          <MemoizedInstrumentChart 
            symbol={selectedInstrument.symbol} 
            assetType={selectedInstrument.type}
            onError={(error) => setChartError(error)}
          />
        )}
      </div>
    </div>
  );
};

const TopInstruments: React.FC = () => {
  return (
    <SelectedInstrumentProvider>
      <div className="container mx-auto px-4">
        <InstrumentCardsContainer />
        <ChartContainer />
      </div>
    </SelectedInstrumentProvider>
  );
};

export default TopInstruments;