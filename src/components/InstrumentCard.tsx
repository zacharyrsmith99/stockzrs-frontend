import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Sun, Moon, Sunrise, DollarSign, TrendingUp, Clock, Info } from "lucide-react";
import { Instrument } from '../types/instrumentTypes';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DateTime } from 'luxon';

interface InstrumentCardProps {
  instrument: Partial<Instrument>;
  comparisonPrice: number;
  comparisonTimestamp: number;
  recentTimestamp: number;
  onClick: () => void;
  isSelected: boolean;
  error?: string;
  isMainAsset: boolean;
  timezone: string;
}

const InstrumentCard: React.FC<InstrumentCardProps> = ({
  instrument,
  comparisonPrice,
  recentTimestamp,
  onClick,
  isSelected,
  error,
  isMainAsset
}) => {
  const getBackgroundColor = (changePercent: number | undefined) => {
    if (error) return 'bg-gray-200';
    if (!isMainAsset) return 'bg-gray-100';
    if (changePercent === undefined) return 'bg-blue-100';
    if (changePercent > 0) return 'bg-green-100';
    if (changePercent < 0) return 'bg-red-100';
    return 'bg-blue-100';
  };

  const formatDate = (timestamp: number) => {
    return DateTime.fromSeconds(timestamp).setZone('America/New_York').toLocaleString(DateTime.DATETIME_SHORT);
  };

  const getMarketHours = (timestamp: number) => {
    const dt = DateTime.fromSeconds(timestamp).setZone('America/New_York');
    const timeValue = dt.hour * 60 + dt.minute;
    
    if (timeValue < 9 * 60 + 30) {
      return 'Pre-Market';
    } else if (timeValue >= 16 * 60) {
      return 'After-Market';
    } else {
      return 'Regular';
    }
  };

  const renderMarketIcon = () => {
    if ((instrument.type === 'STOCK' || instrument.type === 'ETF' || instrument.type === 'MARKET_INDEX') && recentTimestamp) {
      const marketHours = getMarketHours(recentTimestamp);
      switch (marketHours) {
        case 'Pre-Market':
          return <Sunrise className="w-5 h-5 text-orange-500" aria-label="Pre-market" />;
        case 'Regular':
          return <Sun className="w-5 h-5 text-yellow-500" aria-label="Regular market hours" />;
        case 'After-Market':
          return <Moon className="w-5 h-5 text-blue-500" aria-label="After-market" />;
      }
    }
    return null;
  };

  const renderCardContent = () => {
    if (error) {
      return (
        <div className="text-sm text-gray-500">Error loading data</div>
      );
    }

    return (
      <>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">{instrument.symbol}</span>
            {renderMarketIcon()}
          </div>
          {instrument.price !== undefined && (
            <span className="text-lg font-semibold">${instrument.price.toFixed(2)}</span>
          )}
        </div>
        <div className="text-sm text-gray-600 mb-1">{instrument.name}</div>
        {instrument.change !== undefined && instrument.changePercent !== undefined && (
          <div className={`text-sm flex items-center justify-end ${instrument.change >= 0 ? 'text-green-700' : 'text-red-700'} font-medium`}>
            {instrument.change >= 0 ? <ArrowUpCircle size={16} className="mr-1" /> : <ArrowDownCircle size={16} className="mr-1" />}
            <span>
              {instrument.change.toFixed(2)} ({instrument.changePercent.toFixed(2)}%)
            </span>
          </div>
        )}
      </>
    );
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div 
          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${getBackgroundColor(instrument.changePercent)} ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'}`}
          onClick={onClick}
        >
          {renderCardContent()}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 rounded-lg shadow-xl border border-blue-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-xl font-bold text-blue-800">{instrument.name}</h4>
            <p className="text-sm text-gray-600">{instrument.symbol} - {instrument.type}</p>
          </div>
          {renderMarketIcon()}
        </div>
        {error ? (
          <p className="text-sm text-red-600 bg-red-100 p-2 rounded border border-red-200">{error}</p>
        ) : isMainAsset ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white p-2 rounded shadow">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                <span className="text-sm font-medium">Current Price</span>
              </div>
              <span className="font-semibold">${instrument.price?.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between bg-white p-2 rounded shadow">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                <span className="text-sm font-medium">Change</span>
              </div>
              <span className={`font-semibold ${instrument.change && instrument.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {instrument.change?.toFixed(2)} ({instrument.changePercent?.toFixed(2)}%)
              </span>
            </div>
            <div className="flex items-center justify-between bg-white p-2 rounded shadow">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-purple-600" />
                <span className="text-sm font-medium">Last Updated</span>
              </div>
              <span className="text-sm">{formatDate(recentTimestamp)}</span>
            </div>
            <div className="flex items-center justify-between bg-white p-2 rounded shadow">
              <div className="flex items-center">
                <Info className="w-5 h-5 mr-2 text-indigo-600" />
                <span className="text-sm font-medium">Previous Close</span>
              </div>
              <span className="font-semibold">${comparisonPrice.toFixed(2)}</span>
            </div>
            {(instrument.type === 'STOCK' || instrument.type === 'ETF' || instrument.type === 'MARKET_INDEX') && (
              <div className="flex items-center justify-between bg-white p-2 rounded shadow">
                <div className="flex items-center">
                  <Sun className="w-5 h-5 mr-2 text-orange-500" />
                  <span className="text-sm font-medium">Market Hours</span>
                </div>
                <span className="text-sm font-semibold">{getMarketHours(recentTimestamp)}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm bg-white p-2 rounded shadow">Placeholder instrument</p>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default InstrumentCard;