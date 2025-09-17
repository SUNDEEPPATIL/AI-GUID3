import React, { useMemo } from 'react';
import { Product } from '../types';
import StarRating from './StarRating';
import RupeeIcon from './icons/RupeeIcon';
import CalendarIcon from './icons/CalendarIcon';
import ScaleIcon from './icons/ScaleIcon';
import MedalIcon from './icons/MedalIcon';
import HeartIcon from './icons/HeartIcon';
import ShareIcon from './icons/ShareIcon';
import Tooltip from './Tooltip';
import { findBestRetailerPrice, createPurchaseLink } from '../utils';
import ShoppingBagIcon from './icons/ShoppingBagIcon';
import StarIcon from './icons/StarIcon';
import RocketIcon from './icons/RocketIcon';

interface ProductCardProps {
  product: Product;
  onViewDetails: () => void;
  onToggleCompare: (product: Product) => void;
  isInCompare: boolean;
  compareDisabled: boolean;
  isBestValue: boolean;
  isBestPerformance: boolean;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onShare: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onToggleCompare, isInCompare, compareDisabled, isBestValue, isBestPerformance, onToggleWishlist, isWishlisted, onShare }) => {
  // Defensive coalescing for optional numeric fields
  const price = (product as any).priceInINR || (product as any).expectedPriceInINR || 0;
  const priceLabel = (product as any).priceInINR ? 'Price' : 'Expected Price';
  const ariaLabelId = `product-card-title-${((product as any).modelName || (product as any).id || 'product').toString().replace(/\s+/g, '-')}`;
  
  const borderClass = isBestValue
    ? 'border-amber-400 shadow-2xl shadow-amber-500/10'
    : isBestPerformance
    ? 'border-purple-500 shadow-2xl shadow-purple-500/10'
    : isInCompare
    ? 'border-cyan-500/80 shadow-2xl shadow-cyan-500/10'
    : 'border-gray-700/50 hover:border-cyan-500/50';

  const bestPriceInfo = useMemo(() => findBestRetailerPrice((product as any).retailerPrices || []), [(product as any).retailerPrices]);

  return (
    <article aria-labelledby={ariaLabelId} className={`relative bg-gray-800 rounded-xl border overflow-hidden flex flex-col transition-all duration-300 ${borderClass}`}>  
       {isBestPerformance && (
         <Tooltip text="AI's Best Performance Pick: Top-tier specs and features.">
            <div 
              className="absolute top-0 left-0 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg rounded-tl-xl flex items-center gap-1 z-10"
            >
              <RocketIcon className="w-4 h-4" />
              Best Performance
            </div>
         </Tooltip>
      )}  
       {isBestValue && (
         <Tooltip text="AI's Best Value Pick: A top combination of high ratings and low price.">
            <div 
              className="absolute top-0 right-0 bg-amber-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl flex items-center gap-1 z-10"
            >
              <MedalIcon className="w-4 h-4" />
              Best Value
            </div>
         </Tooltip>
      )}

      <div className="p-5 flex-grow pt-10">
        <h3 className="text-lg font-bold text-white truncate">{(product as any).brand}</h3>
        <h4 id={ariaLabelId} className="text-md text-gray-300 mb-2 truncate">{(product as any).modelName}</h4>
        
        <div className="flex items-center gap-2 mb-3">
            <StarRating rating={(product as any).reviewStars} />
            {(product as any).totalReviews && (
              <span className="text-xs text-gray-400 mt-0.5">({(product as any).totalReviews.toLocaleString?.() || (product as any).totalReviews} reviews)</span>
            )}
        </div>

        <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-[40px]">{(product as any).summary}</p>
        
        <div className="space-y-2 text-sm">
          {price && (
             <div className="flex items-center gap-2 text-gray-300">
               <RupeeIcon className="w-4 h-4 text-cyan-400" />
               <span>{priceLabel}: <span className="font-semibold text-white">{price}</span></span>
             </div>
           )}
          
           {(product as any).launchYear && (
             <div className="flex items-center gap-2 text-gray-300">
               <CalendarIcon className="w-4 h-4 text-cyan-400" />
               <span>Launched: <span className="font-semibold text-white">{(product as any).launchYear}</span></span>
             </div>
           )}

          {(product as any).expectedLaunch && !(product as any).launchYear && (
             <div className="flex items-center gap-2 text-gray-300">
               <CalendarIcon className="w-4 h-4 text-cyan-400" />
               <span>Launch: <span className="font-semibold text-white">{(product as any).expectedLaunch}</span></span>
             </div>
           )}

          {(product as any).keySpecs && (product as any).keySpecs.length > 0 && (
            <div className="pt-3 mt-3 border-t border-gray-700/50 space-y-1">
              {(product as any).keySpecs.slice(0, 3).map((spec: string, index: number) => (
                <div key={index} className="flex items-start gap-1.5 truncate">
                  <StarIcon className="w-4 h-4 text-cyan-400/80 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-300">{spec}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <footer className="p-4 bg-gray-800/50 border-t border-gray-700/50 mt-auto flex items-center gap-2">
        <Tooltip text="See more details about this product">
          <button 
            onClick={onViewDetails}
            className="flex-1 bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-cyan-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-400"
          >
            View Details
          </button>
        </Tooltip>
        {bestPriceInfo && (
          <Tooltip text={`Shop on ${bestPriceInfo.retailerName} (best price listed: ${bestPriceInfo.price})`}> 
            <a
              href={createPurchaseLink(bestPriceInfo, product)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 bg-green-600 hover:bg-green-500 focus:ring-green-400"
              aria-label={`Search for product on ${bestPriceInfo.retailerName}`}
            >
              <ShoppingBagIcon className="w-6 h-6" />
            </a>
          </Tooltip>
        )}
        <Tooltip text="Share this product">
          <button
            onClick={() => onShare(product)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-400"
            aria-label="Share product"
          >
            <ShareIcon className="w-6 h-6" />
          </button>
        </Tooltip>
        <Tooltip text={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}>
          <button
            onClick={() => onToggleWishlist(product)}
            className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-400 ${
              isWishlisted 
                ? 'bg-pink-500/20 text-pink-300' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <HeartIcon className="w-6 h-6" filled={isWishlisted} />
          </button>
        </Tooltip>
        <Tooltip text={compareDisabled ? "Compare list is full (max 3)" : (isInCompare ? "Remove from compare" : "Add to compare")}> 
          <button
            onClick={() => onToggleCompare(product)}
            disabled={compareDisabled}
            className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-400 ${
              isInCompare 
                ? 'bg-cyan-500/20 text-cyan-300' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            } ${compareDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={isInCompare ? "Remove from compare" : "Add to compare"}
          >
            <ScaleIcon className="w-6 h-6" />
          </button>
        </Tooltip>
      </footer>
    </article>
  );
};

export default ProductCard;