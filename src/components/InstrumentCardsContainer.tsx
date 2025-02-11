import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Instrument, FinancialData, initialInstruments, ExtendedInstrument } from '../types/instrumentTypes';
import InstrumentCard from './InstrumentCard';
import { useSelectedInstrument } from '../contexts/SelectedInstrumentContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWebSocket } from '../contexts/WebSocketContext';
import { useTimezone } from '../contexts/TimezoneContext';

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


const placeholderInstruments: Record<string, Partial<ExtendedInstrument>[]> = {
  CRYPTOCURRENCY: [
    { symbol: 'ETH', name: 'Ethereum', type: 'CRYPTOCURRENCY' },
    { symbol: 'XRP', name: 'Ripple', type: 'CRYPTOCURRENCY' },
    { symbol: 'LTC', name: 'Litecoin', type: 'CRYPTOCURRENCY' },
  ],
  CURRENCY: [
    { symbol: 'GBP/USD', name: 'British Pound/US Dollar', type: 'CURRENCY' },
    { symbol: 'JPY/USD', name: 'Japanese Yen/US Dollar', type: 'CURRENCY' },
    { symbol: 'AUD/USD', name: 'Australian Dollar/US Dollar', type: 'CURRENCY' },
  ],
  STOCK: [
    { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'STOCK' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'STOCK' },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.', type: 'STOCK' },
  ],
  ETF: [
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'ETF' },
    { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'ETF' },
    { symbol: 'IWM', name: 'iShares Russell 2000 ETF', type: 'ETF' },
  ],
  MARKET_INDEX: [
    { symbol: 'DJI', name: 'Dow Jones Industrial Average', type: 'MARKET_INDEX' },
    { symbol: 'SPX', name: 'S&P 500 Index', type: 'MARKET_INDEX' },
    { symbol: 'RUT', name: 'Russell 2000 Index', type: 'MARKET_INDEX' },
  ],
};

const InstrumentCardsContainer: React.FC = () => {
  const [instruments, setInstruments] = useState<(ExtendedInstrument | Partial<ExtendedInstrument>)[]>([]);
  const [selectedAssetType, setSelectedAssetType] = useState('CRYPTOCURRENCY');
  const [wsError, setWsError] = useState<string | null>(null);
  
  const comparisonPricesRef = useRef<{ [key: string]: number }>({});
  const wsDataRef = useRef<{ [key: string]: FinancialData }>({});
  const { selectedInstrument, setSelectedInstrument, setDisplayedInstrument } = useSelectedInstrument();
  const { ws, isConnected } = useWebSocket();
  const { timezone } = useTimezone();
  const isInitialMount = useRef(true);

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
    const mainInstrument = initialInstruments.find(instrument => instrument.type === selectedAssetType);
    if (!mainInstrument) {
      return;
    }

    try {
      const priceData = await fetchPriceData(mainInstrument);
      const { current, previous } = priceData;
      const change = current.close_price - previous.close_price;
      const changePercent = (change / previous.close_price) * 100;

      comparisonPricesRef.current[mainInstrument.symbol] = previous.close_price;

      const updatedMainInstrument: ExtendedInstrument = {
        ...mainInstrument,
        price: current.close_price,
        change,
        changePercent,
        timestamp: new Date(current.timestamp).getTime() / 1000,
        comparisonPrice: previous.close_price,
        comparisonTimestamp: new Date(previous.timestamp).getTime() / 1000,
        recentTimestamp: new Date(current.timestamp).getTime() / 1000,
      };

      const placeholders = placeholderInstruments[selectedAssetType] || [];
      const updatedInstruments = [updatedMainInstrument, ...placeholders];

      setInstruments(updatedInstruments);

      if (isInitialMount.current) {
        setSelectedInstrument(updatedMainInstrument);
        setDisplayedInstrument(updatedMainInstrument);
        isInitialMount.current = false;
      } else if (!updatedInstruments.some(inst => inst.symbol === selectedInstrument?.symbol)) {
        setSelectedInstrument(updatedMainInstrument);
      }
    } catch (err) {
      console.error(`Error fetching data for ${mainInstrument.symbol}:`, err);
    }
  }, [fetchPriceData, selectedAssetType, selectedInstrument, setSelectedInstrument, setDisplayedInstrument]);

  useEffect(() => {
    initializeData();
  }, [initializeData, selectedAssetType]);

  useEffect(() => {
    if (ws && isConnected) {
      const handleMessage = (event: MessageEvent) => {
        try {
          const parsedData: FinancialData = JSON.parse(event.data);
          if (parsedData) {
            wsDataRef.current[parsedData.symbol] = parsedData;

            setInstruments(prevInstruments =>
              prevInstruments.map(instrument => {
                if (instrument.symbol === parsedData.symbol && 'price' in instrument) {
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

      ws.addEventListener('message', handleMessage);

      return () => {
        ws.removeEventListener('message', handleMessage);
      };
    }
  }, [ws, isConnected]);

  useEffect(() => {
    if (!isConnected) {
      setWsError('WebSocket disconnected. Real-time updates may be unavailable.');
    } else {
      setWsError(null);
    }
  }, [isConnected]);

  const handleInstrumentClick = (instrument: ExtendedInstrument | Partial<ExtendedInstrument>) => {
    if ('price' in instrument) {
      setSelectedInstrument(instrument as ExtendedInstrument);
      setDisplayedInstrument(instrument as ExtendedInstrument);
    }
  };

  const handleAssetTypeChange = (newAssetType: string) => {
    setSelectedAssetType(newAssetType);
  };

  const assetTypes = ['CRYPTOCURRENCY', 'CURRENCY', 'STOCK', 'ETF', 'MARKET_INDEX'];

  const toTitleCase = (str: string) => {
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-500 p-4 text-white">
        <h2 className="text-2xl font-semibold">Market Overview</h2>
      </div>
      <div className="p-4">
        {wsError && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 mb-4 rounded-r text-sm" role="alert">
            <p className="font-bold">Warning</p>
            <p>{wsError}</p>
          </div>
        )}
        <div className="mb-4">
          <Select value={selectedAssetType} onValueChange={handleAssetTypeChange}>
            <SelectTrigger className="w-full p-3 text-left bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out">
              <SelectValue placeholder="Select Asset Type" className="text-gray-700 font-medium" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-blue-200 rounded-lg shadow-lg">
              {assetTypes.map((type) => (
                <SelectItem 
                  key={type} 
                  value={type} 
                  className="p-3 hover:bg-blue-50 transition duration-200 ease-in-out cursor-pointer"
                >
                  {toTitleCase(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          {instruments.map((instrument, index) => (
            <InstrumentCard
              key={instrument.symbol}
              instrument={instrument}
              comparisonPrice={'comparisonPrice' in instrument && typeof instrument.comparisonPrice === 'number' ? instrument.comparisonPrice : 0}
              comparisonTimestamp={'comparisonTimestamp' in instrument && typeof instrument.comparisonTimestamp === 'number' ? instrument.comparisonTimestamp : 0}
              recentTimestamp={'recentTimestamp' in instrument && typeof instrument.recentTimestamp === 'number' ? instrument.recentTimestamp : 0}
              onClick={() => handleInstrumentClick(instrument)}
              isSelected={selectedInstrument?.symbol === instrument.symbol}
              error={'error' in instrument ? instrument.error : undefined}
              isMainAsset={index === 0}
              timezone={timezone}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstrumentCardsContainer;