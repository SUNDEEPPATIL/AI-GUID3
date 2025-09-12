

import React, { useEffect, useState, useRef } from 'react';
import { Product, GeminiSuggestion, RetailerPrice, Category } from '../types';
import { fetchProductAnalysis } from '../services/geminiService';
import { useToast } from '../ToastContext';
import { createPurchaseLink } from '../utils';
import { useAccessibilityModal } from '../hooks/useAccessibilityModal';

import Tooltip from './Tooltip';
import StarRating from './StarRating';

import CloseIcon from './icons/CloseIcon';
import HeartIcon from './icons/HeartIcon';
import ShareIcon from './icons/ShareIcon';
import RupeeIcon from './icons/RupeeIcon';
import CalendarIcon from './icons/CalendarIcon';
import BrainIcon from './icons/BrainIcon';
import UsersIcon from './icons/UsersIcon';
import UserIcon from './icons/UserIcon';
import TagIcon from './icons/TagIcon';
import AmazonIcon from './icons/AmazonIcon';
import FlipkartIcon from './icons/FlipkartIcon';
import CromaIcon from './icons/CromaIcon';
import StoreIcon from './icons/StoreIcon';
import AntutuIcon from './icons/AntutuIcon';
import CameraIcon from './icons/CameraIcon';
import RocketIcon from './icons/RocketIcon';
import BatteryIcon from './icons/BatteryIcon';
import ConnectivityIcon from './icons/ConnectivityIcon';
import EnergyIcon from './icons/EnergyIcon';
import CapacityIcon from './icons/CapacityIcon';
import DisplayIcon from './icons/DisplayIcon';
import WarrantyIcon from './icons/WarrantyIcon';
import InstallationIcon from './icons/InstallationIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import KeyIcon from './icons/KeyIcon';
import StarIcon from './icons/StarIcon';

interface ProductModalProps {
  product: Product;
  category: Category;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onShare: (product: Product) => void;
}

const RetailerIcon: React.FC<{ retailerName: string, className?: string }> = ({ retailerName, className }) => {
  const name = retailerName.toLowerCase();
  if (name.includes('amazon')) return <AmazonIcon className={className} />;
  if (name.includes('flipkart')) return <FlipkartIcon className={className} />;
  if (name.includes('croma')) return <CromaIcon className={className} />;
  return <StoreIcon className={className} />;
};

const ProductModal: React.FC<ProductModalProps> = ({ product, category, onClose, isWishlisted, onToggleWishlist, onShare }) => {
  const [analysis, setAnalysis] = useState<{
    reviewAnalysis: string;
    geminiSuggestion: GeminiSuggestion;
  } | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);
  const { addToast } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);
  useAccessibilityModal(onClose, modalRef);

  useEffect(() => {
    const getAnalysis = async () => {
      setIsLoadingAnalysis(true);
      setAnalysis(null);
      try {
        const result = await fetchProductAnalysis(product);
        setAnalysis(result);
      } catch (error: any) {
        addToast(error.message, 'error');
      } finally {
        setIsLoadingAnalysis(false);
      }
    };
    getAnalysis();
  }, [product, addToast]);

  const price = product.priceInINR || product.expectedPriceInINR;
  const launchInfo = product.launchYear || product.expectedLaunch;

  const cardClasses = "bg-gray-900/50 p-4 rounded-lg border border-gray-700/50";
  const titleClasses = "text-md font-bold text-white mb-3 flex items-center gap-2";
  
  const uniqueId = product.modelName.replace(/\s+/g, '-');
  const keyInfoId = `key-info-${uniqueId}`;
  const keySpecsId = `key-specs-${uniqueId}`;
  const whereToBuyId = `where-to-buy-${uniqueId}`;
  const aiAnalysisId = `ai-analysis-${uniqueId}`;
  const userReviewsId = `user-reviews-${uniqueId}`;

  const renderInfoItem = (Icon: React.FC<any>, label: string, value?: string | number) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-2 text-sm text-gray-300">
        <Icon className="w-4 h-4 text-cyan-400" />
        <span>{label}: <span className="font-semibold text-white">{value.toLocaleString()}</span></span>
      </div>
    );
  };
  
  const { key: categoryKey } = category;

  const allSpecs = [
    { key: 'performanceScore', label: 'Perf. Score', icon: RocketIcon, categories: ['mobiles', 'watches', 'tvs', 'refrigerators', 'washing_machines', 'acs'] },
    { key: 'antutuScore', label: 'AnTuTu', icon: AntutuIcon, categories: ['mobiles'] },
    { key: 'dxoMarkCamera', label: 'DXOMARK', icon: CameraIcon, categories: ['mobiles'] },
    { key: 'batteryLife', label: 'Battery', icon: BatteryIcon, categories: ['mobiles', 'watches'] },
    { key: 'connectivity', label: 'Connectivity', icon: ConnectivityIcon, categories: ['mobiles', 'watches'] },
    { key: 'energyRating', label: 'Energy Rating', icon: EnergyIcon, categories: ['tvs', 'refrigerators', 'washing_machines', 'acs'] },
    { key: 'displayRating', label: 'Display Score', icon: DisplayIcon, categories: ['tvs'] },
    { key: 'capacity', label: 'Capacity', icon: CapacityIcon, categories: ['refrigerators', 'washing_machines', 'acs'] },
    { key: 'warranty', label: 'Warranty', icon: WarrantyIcon, categories: ['tvs', 'refrigerators', 'washing_machines', 'acs'] },
    { key: 'installationServices', label: 'Installation', icon: InstallationIcon, categories: ['tvs', 'refrigerators', 'washing_machines', 'acs'] },
  ];

  const visualSpecs = allSpecs.filter(spec => {
    const value = product[spec.key as keyof Product];
    const hasValue = value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0);

    if (!hasValue) {
        return false;
    }

    return spec.categories.includes(categoryKey);
  });
  
  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" 
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-700/50 shadow-2xl shadow-cyan-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="sticky top-0 bg-gray-800/80 backdrop-blur-sm z-10 p-4 border-b border-gray-700 flex justify-between items-start gap-4">
          <div>
            <h2 id="product-modal-title" className="text-xl font-bold text-white">{product.brand} {product.modelName}</h2>
            <div className="flex items-center gap-3 mt-1">
              <StarRating rating={product.reviewStars} />
              {product.totalReviews && <span className="text-xs text-gray-400">({product.totalReviews.toLocaleString()} reviews)</span>}
            </div>
          </div>
          <Tooltip text="Close details">
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl leading-none flex-shrink-0 -mt-1" aria-label="Close modal">&times;</button>
          </Tooltip>
        </header>

        {/* Body */}
        <main className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <section className={cardClasses} aria-labelledby={keyInfoId}>
                <h4 id={keyInfoId} className={titleClasses}>Key Information</h4>
                <div className="space-y-2">
                  {renderInfoItem(RupeeIcon, product.priceInINR ? 'Price' : 'Expected Price', price)}
                  {renderInfoItem(CalendarIcon, product.launchYear ? 'Launched' : 'Expected Launch', launchInfo)}
                   <p className="text-sm text-gray-400 pt-2">{product.summary}</p>
                </div>
              </section>
              
              {(visualSpecs.length > 0 || (product.keySpecs && product.keySpecs.length > 0)) && (
                <section className={cardClasses} aria-labelledby={keySpecsId}>
                  <h4 id={keySpecsId} className={titleClasses}><KeyIcon className="w-5 h-5 text-cyan-400" /> Key Specifications</h4>
                  
                  {visualSpecs.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                      {visualSpecs.map(({ key, label, icon: Icon }) => {
                        const value = product[key as keyof Product];
                        return (
                          <div key={key} className="flex flex-col items-center p-2 bg-gray-800/60 rounded-lg">
                            <Icon className="w-4 h-4 text-cyan-400 mb-2" />
                            <p className="text-sm font-semibold text-white truncate w-full">{Array.isArray(value) ? value.join(', ') : value?.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">{label}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {product.keySpecs && product.keySpecs.length > 0 && (
                    <div className={`space-y-2 ${visualSpecs.length > 0 ? 'pt-4 mt-4 border-t border-gray-700/50' : ''}`}>
                      {product.keySpecs.map((spec, index) => (
                        <div key={index} className="flex items-start gap-2.5 text-sm">
                           <StarIcon className="w-4 h-4 text-cyan-400/80 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{spec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {product.retailerPrices && product.retailerPrices.length > 0 && (
                <section className={cardClasses} aria-labelledby={whereToBuyId}>
                  <h4 id={whereToBuyId} className={titleClasses}><TagIcon className="w-5 h-5 text-cyan-400" /> Where to Buy</h4>
                  <div className="space-y-2">
                    {product.retailerPrices.map((retailer: RetailerPrice) => (
                      <a href={createPurchaseLink(retailer, product)} target="_blank" rel="noopener noreferrer" key={retailer.retailerName} className="flex items-center justify-between p-2 bg-gray-800/60 rounded-md hover:bg-gray-700/60 transition-colors">
                        <div className="flex items-center gap-2">
                          <RetailerIcon retailerName={retailer.retailerName} className="w-5 h-5" />
                          <span className="text-sm text-gray-300">{retailer.retailerName}</span>
                        </div>
                        <span className="text-sm font-bold text-green-400">{retailer.price}</span>
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <section className={cardClasses} aria-labelledby={aiAnalysisId}>
                  <h4 id={aiAnalysisId} className={titleClasses}><BrainIcon className="w-5 h-5 text-cyan-400" /> AI Analysis & Suggestion</h4>
                  {isLoadingAnalysis ? (
                      <div className="flex flex-col items-center justify-center text-center py-4">
                        <BrainIcon className="w-8 h-8 text-cyan-400 animate-pulse mb-3" />
                        <p className="text-sm font-semibold text-gray-300">Generating AI analysis...</p>
                        <p className="text-xs text-gray-500 mt-1">This may take a moment.</p>
                      </div>
                  ) : analysis ? (
                      <div>
                          <h5 className="font-semibold text-gray-300 text-sm mb-1">AI Review Analysis</h5>
                          <p className="text-sm text-gray-400 mb-4">{analysis.reviewAnalysis}</p>
                          <div className="space-y-3">
                            <div className="flex items-start gap-2">
                              <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <h6 className="font-semibold text-sm text-green-400">Who is it for?</h6>
                                <p className="text-sm text-gray-400">{analysis.geminiSuggestion.whoIsItFor}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <XCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <h6 className="font-semibold text-sm text-red-400">Who should avoid it?</h6>
                                <p className="text-sm text-gray-400">{analysis.geminiSuggestion.whoShouldAvoidIt}</p>
                              </div>
                            </div>
                             {analysis.geminiSuggestion.keyAlternative && (
                                <div className="flex items-start gap-2">
                                <LightbulbIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h6 className="font-semibold text-sm text-amber-400">Key Alternative</h6>
                                    <p className="text-sm text-gray-400">{analysis.geminiSuggestion.keyAlternative}</p>
                                </div>
                                </div>
                            )}
                          </div>
                      </div>
                  ) : (
                      <p className="text-sm text-gray-500">Could not load AI analysis for this product.</p>
                  )}
              </section>
               {product.userReviews && product.userReviews.length > 0 && (
                <section className={cardClasses} aria-labelledby={userReviewsId}>
                  <h4 id={userReviewsId} className={titleClasses}><UsersIcon className="w-5 h-5 text-cyan-400" /> User Reviews</h4>
                  <div className="space-y-3">
                    {product.userReviews.map((review, i) => (
                       <div key={i} className="p-2 bg-gray-800/60 rounded-md">
                         <div className="flex justify-between items-center mb-1">
                           <div className="flex items-center gap-1.5">
                             <UserIcon className="w-4 h-4 text-gray-500" />
                             <span className="text-sm font-semibold text-gray-300">{review.username}</span>
                           </div>
                           <StarRating rating={review.rating} />
                         </div>
                         <p className="text-sm text-gray-400 italic">"{review.comment}"</p>
                       </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-4 bg-gray-800/50 border-t border-gray-700/50 mt-auto flex items-center justify-end gap-3">
            <Tooltip text="Share this product">
              <button
                onClick={() => onShare(product)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/80 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors"
                aria-label="Share product"
              >
                <ShareIcon className="w-5 h-5" />
                <span className="text-sm font-semibold hidden sm:inline">Share</span>
              </button>
            </Tooltip>
            <Tooltip text={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}>
              <button
                onClick={() => onToggleWishlist(product)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold ${
                  isWishlisted 
                    ? 'bg-pink-500/20 text-pink-300' 
                    : 'bg-gray-700/80 hover:bg-gray-700 text-white'
                }`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <HeartIcon className="w-5 h-5" filled={isWishlisted} />
                <span className="text-sm hidden sm:inline">{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
              </button>
            </Tooltip>
        </footer>
      </div>
    </div>
  );
};

export default ProductModal;