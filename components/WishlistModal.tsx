
import React, { useRef } from 'react';
import { Product } from '../types';
import HeartIcon from './icons/HeartIcon';
import ScaleIcon from './icons/ScaleIcon';
import RupeeIcon from './icons/RupeeIcon';
import Tooltip from './Tooltip';
import { useAccessibilityModal } from '../hooks/useAccessibilityModal';

interface WishlistModalProps {
  items: Product[];
  onClose: () => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  compareList: Product[];
  compareDisabled: boolean;
}

const WishlistModal: React.FC<WishlistModalProps> = ({ items, onClose, onToggleWishlist, onToggleCompare, compareList, compareDisabled }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useAccessibilityModal(onClose, modalRef);

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wishlist-modal-title"
        className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-700/50 shadow-2xl shadow-pink-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 bg-gray-800/80 backdrop-blur-sm z-10 p-4 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <HeartIcon className="w-7 h-7 text-pink-400" />
            <h2 id="wishlist-modal-title" className="text-xl font-bold text-white">My Wishlist</h2>
          </div>
          <Tooltip text="Close wishlist">
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl leading-none" aria-label="Close modal">&times;</button>
          </Tooltip>
        </header>

        <div className="p-6 overflow-y-auto">
          {items.length > 0 ? (
            <ul className="space-y-4">
              {items.map(product => {
                const isInCompare = compareList.some(p => p.modelName === product.modelName);
                const isCompareDisabled = compareDisabled && !isInCompare;
                const price = product.priceInINR || product.expectedPriceInINR;
                
                return (
                  <li key={product.modelName} className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                    <div>
                      <h3 className="font-bold text-white">{product.brand} {product.modelName}</h3>
                      {price && (
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <RupeeIcon className="w-4 h-4" />
                          <span>{price}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                       <Tooltip text={isCompareDisabled ? "Compare list is full" : (isInCompare ? "Remove from compare" : "Add to compare")}>
                         <button
                            onClick={() => onToggleCompare(product)}
                            disabled={isCompareDisabled}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              isInCompare 
                                ? 'bg-cyan-500/20 text-cyan-300' 
                                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            } ${isCompareDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            aria-label={isInCompare ? "Remove from compare" : "Add to compare"}
                          >
                            <ScaleIcon className="w-5 h-5" />
                          </button>
                       </Tooltip>
                       <Tooltip text="Remove from wishlist">
                         <button
                            onClick={() => onToggleWishlist(product)}
                            className="p-2 rounded-lg bg-gray-700 hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-colors duration-200"
                            aria-label="Remove from wishlist"
                          >
                            <HeartIcon className="w-5 h-5" filled={true} />
                          </button>
                       </Tooltip>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-16">
              <HeartIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white">Your Wishlist is Empty</h3>
              <p className="text-gray-400 mt-2">
                Click the heart icon on any product to save it here for later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistModal;