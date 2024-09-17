export interface FinancialData {
  symbol: string;
  price: number;
  timestamp: number;
  type: string;
  bid?: number;
  ask?: number;
  currency_base?: string;
  currency_quote?: string;
}

export interface Instrument extends FinancialData {
  change: number;
  changePercent: number;
  name: string;
}

export interface ExtendedInstrument extends Instrument {
  comparisonPrice: number;
  comparisonTimestamp: number;
  recentTimestamp: number;
  error?: string;
}

export const initialInstruments: Instrument[] = [
  { symbol: 'BTC/USD', name: 'Bitcoin', price: 0, change: 0, changePercent: 0, timestamp: 0, type: 'CRYPTOCURRENCY' },
  { symbol: 'EUR/USD', name: 'Euro/US Dollar', price: 0, change: 0, changePercent: 0, timestamp: 0, type: 'CURRENCY' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 0, change: 0, changePercent: 0, timestamp: 0, type: 'STOCK' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', price: 0, change: 0, changePercent: 0, timestamp: 0, type: 'ETF' },
  { symbol: 'IXIC', name: 'NASDAQ Composite', price: 0, change: 0, changePercent: 0, timestamp: 0, type: 'MARKET_INDEX' },
];


export interface MetricsData {
  symbol: string;
  timestamp: string;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
}
