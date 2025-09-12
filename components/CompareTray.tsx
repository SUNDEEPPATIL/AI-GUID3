import React from 'react';
import { Product } from '../types';
import Tooltip from './Tooltip';

interface CompareTrayProps {
  items: Product[];
  onCompare: () => void;
  onRemove: (item: Product) => void;
  onClear: () => void;
}

const CompareTray: React.FC<CompareTrayProps> = ({ items, onCompare, onRemove, onClear }) => {
  const canCompare = items.length >= 2;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl z-20">
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <span className="font-bold text-white text-sm mr-2">Comparing:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {items.map(item => (
              <div key={item.modelName} className="bg-gray-700 text-xs text-white px-2 py-1 rounded-full flex items-center gap-1.5">
                <span>{item.modelName}</span>
                <Tooltip text={`Remove ${item.modelName}`}>
                  <button onClick={() => onRemove(item)} className="text-gray-400 hover:text-white leading-none" aria-label={`Remove ${item.modelName} from compare`}>&times;</button>
                </Tooltip>
              </div>
            ))}
             {items.length < 3 && Array.from({ length: 3 - items.length }).map((_, i) => (
                <div key={i} className="hidden sm:block w-20 h-6 bg-gray-700/50 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip text="Clear all items">
            <button 
              onClick={onClear} 
              className="text-gray-400 hover:text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
              >
                Clear
            </button>
          </Tooltip>
          <Tooltip text={canCompare ? 'Compare selected items' : 'Add at least 2 items to compare'}>
            <button 
              onClick={onCompare} 
              disabled={!canCompare}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
                canCompare 
                ? 'bg-cyan-500 text-white shadow-lg hover:bg-cyan-400' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Compare ({items.length})
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default CompareTray;