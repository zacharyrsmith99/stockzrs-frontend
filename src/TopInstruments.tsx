import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface FinancialData {
  symbol: string;
  price: number;
  timestamp: number;
  type: string;
  bid?: number;
  ask?: number;
  currency_base?: string;
  currency_quote?: string;
}

interface Instrument extends FinancialData {
  change: number;
  changePercent: number;
}

const initialInstruments: Instrument[] = [
  { symbol: 'BTC/USD', price: 0, change: 0, changePercent: 0, timestamp: 0, type: '' },
  { symbol: 'EUR/USD', price: 0, change: 0, changePercent: 0, timestamp: 0, type: '' },
  { symbol: 'AAPL', price: 0, change: 0, changePercent: 0, timestamp: 0, type: '' },
  { symbol: 'QQQ', price: 0, change: 0, changePercent: 0, timestamp: 0, type: '' },
];

const TopInstruments: React.FC = () => {
  const [instruments, setInstruments] = useState<Instrument[]>(initialInstruments);
  const initialPricesRef = useRef<{ [key: string]: number }>({});

  const connectWebSocket = useCallback(() => {
    const wsUrl = process.env.STOCKZRS_RELAY_SERVICE_WS_URL!;
    console.log(wsUrl);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      try {
        const parsedData: FinancialData = JSON.parse(event.data);
        if (parsedData) {
          setInstruments(prevInstruments => 
            prevInstruments.map(instrument => {
              if (instrument.symbol === parsedData.symbol) {
                if (!(parsedData.symbol in initialPricesRef.current)) {
                  initialPricesRef.current[parsedData.symbol] = parsedData.price;
                }
                const initialPrice = initialPricesRef.current[parsedData.symbol];
                const change = parsedData.price - initialPrice;
                const changePercent = (change / initialPrice) * 100;
                return { ...parsedData, change, changePercent };
              }
              return instrument;
            })
          );
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.reason);
      setTimeout(connectWebSocket, 5000);
    };

    return ws;
  }, []);

  useEffect(() => {
    const ws = connectWebSocket();
    return () => {
      ws.close();
    };
  }, [connectWebSocket]);

  const getBackgroundColor = (changePercent: number) => {
    if (changePercent > 0) return `rgba(52, 211, 153, ${Math.min(Math.abs(changePercent) / 10, 0.3)})`;
    if (changePercent < 0) return `rgba(248, 113, 113, ${Math.min(Math.abs(changePercent) / 10, 0.3)})`;
    return 'transparent';
  };
  
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px', flexWrap: 'wrap' }}>
      {instruments.map(instrument => (
        <div key={instrument.symbol} style={{
          width: '220px',
          margin: '10px',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          background: 'white',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          textAlign: 'center',
        }}>
          <div 
            onClick={() => alert(`Clicked on ${instrument.symbol}`)} 
            style={{
              padding: '12px',
              backgroundColor: '#3B82F6', // Bright blue
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
          >
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
            }}>{instrument.symbol}</h3>
          </div>
          <div style={{
            padding: '16px',
            background: `linear-gradient(135deg, ${getBackgroundColor(instrument.changePercent)}, white)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <p style={{ 
              fontSize: '28px', 
              fontWeight: 'bold',
              color: '#1a1a1a',
              textShadow: '1px 1px 1px rgba(255, 255, 255, 0.5)',
              margin: '0 0 8px 0'
            }}>${instrument.price.toFixed(2)}</p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: instrument.change >= 0 ? '#059669' : '#DC2626',
              fontWeight: 'bold',
              fontSize: '16px',
              width: '100%',
              padding: '8px 0',
              backgroundColor: instrument.change >= 0 ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)',
              borderRadius: '8px',
              marginBottom: '8px',
            }}>
              {instrument.change >= 0 ? <ArrowUpCircle size={20} style={{ marginRight: '8px' }} /> : <ArrowDownCircle size={20} style={{ marginRight: '8px' }} />}
              <span>
                {instrument.change >= 0 ? '+' : ''}{instrument.change.toFixed(2)} ({instrument.changePercent.toFixed(2)}%)
              </span>
            </div>
            <div style={{
              fontSize: '12px',
              color: '#4B5563',
              marginTop: '8px',
              textAlign: 'center',
            }}>
              {new Date(instrument.timestamp * 1000).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopInstruments;