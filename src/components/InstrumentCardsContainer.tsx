import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Instrument, FinancialData, initialInstruments, ExtendedInstrument } from '../types/instrumentTypes';
import InstrumentCard from './InstrumentCard';
import { useSelectedInstrument } from '../contexts/SelectedInstrumentContext';

interface InstrumentCardPrice {
  current: PriceData;
  previous: PriceData;
}

interface PriceData {
  symbol: string;
  timestamp: string;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
}

const InstrumentCardsContainer: React.FC = () => {
  const [instruments, setInstruments] = useState<ExtendedInstrument[]>(
    initialInstruments.map(inst => ({ 
      ...inst, 
      comparisonPrice: 0, 
      comparisonTimestamp: 0, 
      recentTimestamp: 0 
    }))
  );
  const [isLoading, setIsLoading] = useState(true);
  const [wsError, setWsError] = useState<string | null>(null);
  
  const comparisonPricesRef = useRef<{ [key: string]: number }>({});
  const wsDataRef = useRef<{ [key: string]: FinancialData }>({});
  const { selectedInstrument, setSelectedInstrument } = useSelectedInstrument();

  const fetchPriceData = useCallback(async (instrument: Instrument) => {
    const metricsServiceUrl = import.meta.env.VITE_METRICS_SERVICE_URL || "stockzrs-metrics-service.stockzrs.com";
    if (!metricsServiceUrl) {
      throw new Error('Unable to retrieve market data. Please try again later.');
    }
    const http = import.meta.env.VITE_ENVIRONMENT === 'local' ? 'http' : 'https';

    const url = new URL(`${http}://${metricsServiceUrl}/carousel/instrument_card_comparison`);
    url.searchParams.append('symbol', instrument.symbol);
    url.searchParams.append('asset_type', instrument.type);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Failed to fetch market data.');
    }
    return await response.json() as InstrumentCardPrice;
  }, []);

  const initializeData = useCallback(async () => {
    setIsLoading(true);
    const updatedInstruments = await Promise.all(initialInstruments.map(async (instrument): Promise<ExtendedInstrument> => {
      try {
        const priceData = await fetchPriceData(instrument);
        const { current, previous } = priceData;
        const change = current.close_price - previous.close_price;
        const changePercent = (change / previous.close_price) * 100;

        comparisonPricesRef.current[instrument.symbol] = previous.close_price;

        return {
          ...instrument,
          price: current.close_price,
          change,
          changePercent,
          timestamp: new Date(current.timestamp).getTime() / 1000,
          comparisonPrice: previous.close_price,
          comparisonTimestamp: new Date(previous.timestamp).getTime() / 1000,
          recentTimestamp: new Date(current.timestamp).getTime() / 1000,
        };
      } catch (err) {
        console.error(`Error fetching data for ${instrument.symbol}:`, err);
        return {
          ...instrument,
          price: 0,
          change: 0,
          changePercent: 0,
          timestamp: 0,
          comparisonPrice: 0,
          comparisonTimestamp: 0,
          recentTimestamp: 0,
          error: 'Failed to load data',
        };
      }
    }));

    setInstruments(updatedInstruments);
    setIsLoading(false);

    const firstValidInstrument = updatedInstruments.find(inst => !inst.error);
    if (firstValidInstrument) {
      setSelectedInstrument(firstValidInstrument);
    }
  }, [fetchPriceData, setSelectedInstrument]);

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
          wsDataRef.current[parsedData.symbol] = parsedData;

          setInstruments(prevInstruments =>
            prevInstruments.map(instrument => {
              if (instrument.symbol === parsedData.symbol) {
                const comparisonPrice = comparisonPricesRef.current[parsedData.symbol];

                if (instrument.price !== parsedData.price) {
                  const change = parsedData.price - comparisonPrice;
                  const changePercent = (change / comparisonPrice) * 100;

                  return {
                    ...instrument,
                    price: parsedData.price,
                    change,
                    changePercent,
                    recentTimestamp: parsedData.timestamp,
                    error: undefined,
                  };
                }
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
    if (!isLoading) {
      const ws = connectWebSocket();
      return () => {
        ws.close();
      };
    }
  }, [connectWebSocket, isLoading]);

  const handleInstrumentClick = (instrument: ExtendedInstrument) => {
    if (selectedInstrument?.symbol !== instrument.symbol) {
      setSelectedInstrument(instrument);
    }
  };

  return (
    <>
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
              error={instrument.error}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default InstrumentCardsContainer;