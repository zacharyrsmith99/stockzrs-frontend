import React from 'react';
import { ExtendedInstrument } from '../types/instrumentTypes';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, BarChart2, Clock, Info } from 'lucide-react';

interface AssetInfoBoxProps {
  instrument: ExtendedInstrument;
}

const AssetInfoBox: React.FC<AssetInfoBoxProps> = ({ instrument }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-6">
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Asset Information</h2>
      </div>
      <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center">
          <DollarSign className="w-6 h-6 text-blue-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Current Price</p>
            <p className="text-lg font-semibold">${instrument.price.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <BarChart2 className="w-6 h-6 text-green-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Change</p>
            <p className={`text-lg font-semibold flex items-center ${instrument.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {instrument.change >= 0 ? <ArrowUpCircle size={16} className="mr-1" /> : <ArrowDownCircle size={16} className="mr-1" />}
              {instrument.change.toFixed(2)} ({instrument.changePercent.toFixed(2)}%)
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <Clock className="w-6 h-6 text-purple-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="text-lg font-semibold"></p>
          </div>
        </div>
        <div className="flex items-center">
          <DollarSign className="w-6 h-6 text-blue-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Previous Close</p>
            <p className="text-lg font-semibold">${instrument.comparisonPrice.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <BarChart2 className="w-6 h-6 text-green-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Volume</p>
            <p className="text-lg font-semibold">N/A</p>
          </div>
        </div>
        <div className="flex items-center">
          <Info className="w-6 h-6 text-yellow-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Type</p>
            <p className="text-lg font-semibold">{instrument.type}</p>
          </div>
        </div>
      </div>
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-700">
          This is a placeholder description for {instrument.name} ({instrument.symbol}). 
        </p>
      </div>
    </div>
  );
};

export default AssetInfoBox;