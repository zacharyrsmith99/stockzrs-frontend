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
}

export interface MetricsData {
  symbol: string;
  timestamp: string;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
}

export const initialInstruments: Instrument[] = [
  { symbol: 'BTC/USD', price: 0, change: 0, changePercent: 0, timestamp: 0, type: 'CRYPTOCURRENCY' },
  { symbol: 'EUR/USD', price: 0, change: 0, changePercent: 0, timestamp: 0, type: 'CURRENCY' },
  { symbol: 'AAPL', price: 0, change: 0, changePercent: 0, timestamp: 0, type: 'STOCK' },
  { symbol: 'QQQ', price: 0, change: 0, changePercent: 0, timestamp: 0, type: 'ETF' },
  { symbol: 'IXIC', price: 0, change: 0, changePercent: 0, timestamp: 0, type: 'MARKET_INDEX' },
];