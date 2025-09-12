
import React from 'react';
import { PriceRange } from '../types';
import Tooltip from './Tooltip';

interface PriceTabsProps {
  priceRanges: PriceRange[];
  selectedKey: string | undefined;
  onSelect: (priceRange: PriceRange) => void;
  controlsId: string;
}

const PriceTabs: React.FC<PriceTabsProps> = ({ priceRanges, selectedKey, onSelect, controlsId }) => {
  return (
    <div role="tablist" aria-label="Price range filters" className="flex flex-wrap gap-2">
      {priceRanges.map((range) => (
        <Tooltip key={range.key} text={`Filter by price: ${range.label}`}>
          <button
            role="tab"
            aria-selected={selectedKey === range.key}
            aria-controls={controlsId}
            onClick={() => onSelect(range)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400
              ${selectedKey === range.key 
                ? 'bg-cyan-500 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`
            }
          >
            {range.label}
          </button>
        </Tooltip>
      ))}
    </div>
  );
};

export default PriceTabs;