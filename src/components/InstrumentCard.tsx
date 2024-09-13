import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, CalendarDays, TrendingUp, DollarSign } from "lucide-react";
import { Instrument } from '../types/instrumentTypes';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface InstrumentCardProps {
    instrument: Instrument;
    comparisonPrice: number;
    comparisonTimestamp: number;
    recentTimestamp: number;
    onClick: () => void;
    isSelected: boolean;
  }

  const InstrumentCard: React.FC<InstrumentCardProps> = ({
    instrument,
    comparisonPrice,
    comparisonTimestamp,
    recentTimestamp,
    onClick,
    isSelected
  }) => {
    const getBackgroundGradient = (changePercent: number) => {
      if (changePercent > 0) return 'bg-gradient-to-br from-green-400 to-blue-500';
      if (changePercent < 0) return 'bg-gradient-to-br from-red-400 to-pink-500';
      return 'bg-gradient-to-br from-gray-300 to-blue-300';
    };
  
    const formatDate = (timestamp: number) => {
      return new Date(timestamp * 1000).toLocaleString();
    };
  
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <div 
            className={`w-full h-40 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${getBackgroundGradient(instrument.changePercent)} ${isSelected ? 'ring-4 ring-blue-500' : ''}`}
            onClick={onClick}
          >
            <div className="p-4 h-full flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">{instrument.symbol}</h3>
                <span className="text-xs font-semibold text-white bg-black bg-opacity-20 px-2 py-1 rounded-full">
                  {instrument.type}
                </span>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-2">
                  ${instrument.price.toFixed(2)}
                </p>
                <div className={`flex items-center justify-center text-sm font-bold ${instrument.change >= 0 ? 'text-green-100' : 'text-red-100'}`}>
                  {instrument.change >= 0 ? <ArrowUpCircle size={20} className="mr-1" /> : <ArrowDownCircle size={20} className="mr-1" />}
                  <span className="text-shadow">
                    {instrument.change >= 0 ? '+' : ''}{instrument.change.toFixed(2)} ({instrument.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 p-0 bg-white rounded-lg shadow-xl">
        <div className="p-5 bg-gray-100 rounded-t-lg">
          <h4 className="text-xl font-semibold text-gray-800 mb-2">{instrument.symbol} Details</h4>
          <p className="text-sm text-gray-600">
            {instrument.type}
          </p>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center">
            <DollarSign className="w-6 h-6 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">Comparison Price</p>
              <p className="text-xl font-semibold text-gray-900">${comparisonPrice.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <TrendingUp className="w-6 h-6 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">Recent Price</p>
              <p className="text-xl font-semibold text-gray-900">${instrument.price.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CalendarDays className="w-5 h-5 mr-3 opacity-70" />
            <span>Comparison: {formatDate(comparisonTimestamp)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CalendarDays className="w-5 h-5 mr-3 opacity-70" />
            <span>Recent: {formatDate(recentTimestamp)}</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default InstrumentCard;