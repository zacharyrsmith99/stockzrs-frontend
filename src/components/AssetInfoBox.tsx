import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, BarChart2, Clock, Info, Sun, Moon, Sunrise } from 'lucide-react';
import { useSelectedInstrument } from '../contexts/SelectedInstrumentContext';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DateTime } from 'luxon';
import { useTimezone } from '../contexts/TimezoneContext';

const AssetInfoBox: React.FC = () => {
  const { displayedInstrument } = useSelectedInstrument();
  const { timezone } = useTimezone();

  if (!displayedInstrument) {
    return null;
  }

  const getMarketHours = (timestamp: number) => {
    const dt = DateTime.fromSeconds(timestamp).setZone(timezone);
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
    if (['STOCK', 'ETF', 'MARKET_INDEX'].includes(displayedInstrument.type)) {
      const marketHours = getMarketHours(displayedInstrument.recentTimestamp);
      let Icon;
      let color;
      switch (marketHours) {
        case 'Pre-Market':
          Icon = Sunrise;
          color = "text-orange-500";
          break;
        case 'Regular':
          Icon = Sun;
          color = "text-yellow-500";
          break;
        case 'After-Market':
          Icon = Moon;
          color = "text-blue-500";
          break;
      }
      return (
        <HoverCard>
          <HoverCardTrigger>
            <Icon className={`w-6 h-6 ${color}`} />
          </HoverCardTrigger>
          <HoverCardContent>
            <p>{marketHours} Hours</p>
          </HoverCardContent>
        </HoverCard>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-50 border-t border-gray-200">
      <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center">
          <DollarSign className="w-6 h-6 text-blue-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Current Price</p>
            <p className="text-lg font-semibold">${displayedInstrument.price.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <BarChart2 className="w-6 h-6 text-green-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Change</p>
            <p className={`text-lg font-semibold flex items-center ${displayedInstrument.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {displayedInstrument.change >= 0 ? <ArrowUpCircle size={16} className="mr-1" /> : <ArrowDownCircle size={16} className="mr-1" />}
              {displayedInstrument.change.toFixed(2)} ({displayedInstrument.changePercent.toFixed(2)}%)
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <Clock className="w-6 h-6 text-purple-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="text-lg font-semibold">{DateTime.fromSeconds(displayedInstrument.recentTimestamp).setZone(timezone).toLocaleString(DateTime.DATETIME_SHORT)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Info className="w-6 h-6 text-blue-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Previous Close</p>
            <p className="text-lg font-semibold">${displayedInstrument.comparisonPrice.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <BarChart2 className="w-6 h-6 text-gray-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Volume</p>
            <p className="text-lg font-semibold">N/A</p>
          </div>
        </div>
        <div className="flex items-center">
          <Info className="w-6 h-6 text-indigo-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Type</p>
            <p className="text-lg font-semibold">{displayedInstrument.type}</p>
          </div>
        </div>
      </div>
      {renderMarketIcon()}
    </div>
  );
};

export default AssetInfoBox;