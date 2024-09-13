import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Instrument, FinancialData, initialInstruments } from '../types/instrumentTypes';
import InstrumentCard from './InstrumentCard';
import ErrorMessage from './ErrorMessage';
import InstrumentChart from './InstrumentChart';

interface PriceData {
  symbol: string;
  close_price: number;
  open_price: number;
  low_price: number;
  high_price: number;
  timestamp: string;
}

interface ExtendedInstrument extends Instrument {
  comparisonPrice: number;
  comparisonTimestamp: number;
  recentTimestamp: number;
}

const TopInstruments: React.FC = () => {
  const [instruments, setInstruments] = useState<ExtendedInstrument[]>(
    initialInstruments.map(inst => ({ ...inst, comparisonPrice: 0, comparisonTimestamp: 0, recentTimestamp: 0 }))
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsError, setWsError] = useState<string | null>(null);
  const comparisonPricesRef = useRef<{ [key: string]: number }>({});
  const [selectedInstrument, setSelectedInstrument] = useState<ExtendedInstrument | null>(null);

  const fetchPriceData = useCallback(async (endpoint: string) => {
    // const metricsServiceUrl = import.meta.env.VITE_METRICS_SERVICE_URL;
    const metricsServiceUrl = "stockzrs-metrics-service.stockzrs.com"
    if (!metricsServiceUrl) {
      throw new Error('Unable to retrieve market data. Please try again later.');
    }

    const fetchPromises = initialInstruments.map(async (instrument) => {
      const url = new URL(`https://${metricsServiceUrl}/carousel/${endpoint}`);
      url.searchParams.append('symbol', instrument.symbol);
      url.searchParams.append('asset_type', instrument.type);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch market data. Please try again later.');
      }
      const data: PriceData = await response.json();
      return {
        symbol: data.symbol,
        price: data.close_price,
        timestamp: new Date(data.timestamp).getTime() / 1000,
      };
    });

    return Promise.all(fetchPromises);
  }, []);

  const initializeData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [comparisonPrices, recentPrices] = await Promise.all([
        fetchPriceData('comparison_price'),
        fetchPriceData('most_recent_price')
      ]);

      const updatedInstruments = initialInstruments.map(instrument => {
        const comparisonPrice = comparisonPrices.find(p => p.symbol === instrument.symbol)?.price || 0;
        const recentPrice = recentPrices.find(p => p.symbol === instrument.symbol);
        
        if (recentPrice) {
          const change = recentPrice.price - comparisonPrice;
          const changePercent = (change / comparisonPrice) * 100;

          comparisonPricesRef.current[instrument.symbol] = comparisonPrice;

          return {
            ...instrument,
            price: recentPrice.price,
            change,
            changePercent,
            timestamp: recentPrice.timestamp,
            comparisonPrice,
            comparisonTimestamp: comparisonPrices.find(p => p.symbol === instrument.symbol)?.timestamp || 0,
            recentTimestamp: recentPrice.timestamp,
          };
        }
        return {
          ...instrument,
          comparisonPrice: 0,
          comparisonTimestamp: 0,
          recentTimestamp: 0,
        };
      });

      setInstruments(updatedInstruments);
    } catch (err) {
      setError('Unable to load market data. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchPriceData]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const connectWebSocket = useCallback(() => {
    const wsUrl = import.meta.env.VITE_STOCKZRS_RELAY_SERVICE_WS_URL || "wss://stockzrs-relay-service.stockzrs.com";
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setWsError(null);
    };

    ws.onmessage = (event) => {
      try {
        const parsedData: FinancialData = JSON.parse(event.data);
        if (parsedData) {
          setInstruments(prevInstruments => 
            prevInstruments.map(instrument => {
              if (instrument.symbol === parsedData.symbol) {
                const comparisonPrice = comparisonPricesRef.current[parsedData.symbol];
                const change = parsedData.price - comparisonPrice;
                const changePercent = (change / comparisonPrice) * 100;
                return { 
                  ...instrument,
                  ...parsedData, 
                  change, 
                  changePercent,
                  recentTimestamp: parsedData.timestamp,
                };
              }
              return instrument;
            })
          );
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = () => {
      setWsError('WebSocket connection error. Real-time updates may be unavailable.');
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setWsError('WebSocket connection closed. Attempting to reconnect...');
      setTimeout(connectWebSocket, 5000);
    };

    return ws;
  }, []);

  useEffect(() => {
    if (!isLoading && !error) {
      const ws = connectWebSocket();
      return () => {
        ws.close();
      };
    }
  }, [connectWebSocket, isLoading, error]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    if (!isLoading && instruments.length > 0 && !selectedInstrument) {
      setSelectedInstrument(instruments[0]);
    }
  }, [isLoading, instruments, selectedInstrument]);

  useEffect(() => {
    if (!isLoading && !error) {
      const ws = connectWebSocket();
      return () => {
        ws.close();
      };
    }
  }, [connectWebSocket, isLoading, error]);

  const handleInstrumentClick = (instrument: ExtendedInstrument) => {
    setSelectedInstrument(instrument);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  return (
    <div className="container mx-auto px-4">
      {wsError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-r" role="alert">
          <p className="font-bold">Warning</p>
          <p>{wsError}</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-12">
        {instruments.map((instrument) => (
          <div key={instrument.symbol} className="flex justify-center">
            <InstrumentCard
              instrument={instrument}
              comparisonPrice={instrument.comparisonPrice}
              comparisonTimestamp={instrument.comparisonTimestamp}
              recentTimestamp={instrument.recentTimestamp}
              onClick={() => handleInstrumentClick(instrument)}
              isSelected={selectedInstrument?.symbol === instrument.symbol}
            />
          </div>
        ))}
      </div>
      {selectedInstrument && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-12">
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800">{selectedInstrument.symbol} Chart</h2>
          </div>
          <div className="p-6">
            <InstrumentChart symbol={selectedInstrument.symbol} assetType={selectedInstrument.type} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TopInstruments;