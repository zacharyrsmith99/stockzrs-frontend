import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Instrument } from '../types/instrumentTypes';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface InstrumentCardProps {
  instrument: Partial<Instrument>;
  comparisonPrice: number;
  comparisonTimestamp: number;
  recentTimestamp: number;
  onClick: () => void;
  isSelected: boolean;
  error?: string;
  isMainAsset: boolean;
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
    return new Date(timestamp * 1000).toLocaleString();
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
          <div>
            <span className="font-semibold">{instrument.symbol}</span>
            <div className="text-xs text-gray-500">{instrument.name}</div>
          </div>
          {instrument.price !== undefined && (
            <span className="text-sm">${instrument.price.toFixed(2)}</span>
          )}
        </div>
        {instrument.change !== undefined && instrument.changePercent !== undefined && (
          <div className={`text-xs flex items-center justify-end ${instrument.change >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {instrument.change >= 0 ? <ArrowUpCircle size={12} className="mr-1" /> : <ArrowDownCircle size={12} className="mr-1" />}
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
          className={`p-2 rounded cursor-pointer transition-all duration-200 ${getBackgroundColor(instrument.changePercent)} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          onClick={onClick}
        >
          {renderCardContent()}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 p-4 bg-white rounded-lg shadow-xl">
        <h4 className="text-lg font-semibold mb-2">{instrument.name}</h4>
        <p className="text-sm text-gray-600 mb-2">{instrument.symbol} - {instrument.type}</p>
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : isMainAsset ? (
          <>
            <p className="text-sm"><strong>Current Price:</strong> ${instrument.price?.toFixed(2)}</p>
            <p className="text-sm"><strong>Change:</strong> {instrument.change?.toFixed(2)} ({instrument.changePercent?.toFixed(2)}%)</p>
            <p className="text-sm"><strong>Previous Close:</strong> ${comparisonPrice.toFixed(2)}</p>
            <p className="text-sm"><strong>Last Updated:</strong> {formatDate(recentTimestamp)}</p>
          </>
        ) : (
          <p className="text-sm">Placeholder instrument</p>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default InstrumentCard;