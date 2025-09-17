import React, { useMemo, useRef } from 'react';
import { Product } from '../types';
import StarRating from './StarRating';
import { findBestValueProduct, findBestRetailerPrice } from '../utils';
import Tooltip from './Tooltip';
import InfoIcon from './icons/InfoIcon';
import BrainIcon from './icons/BrainIcon';
import { useAccessibilityModal } from '../hooks/useAccessibilityModal';

interface CompareModalProps {
  products: Product[];
  onClose: () => void;
  comparisonResult: string;
}

const CompareModal: React.FC<CompareModalProps> = ({ products, onClose, comparisonResult }) => {
  const bestValueProduct = useMemo(() => findBestValueProduct(products), [products]);
  const modalRef = useRef<HTMLDivElement>(null);
  useAccessibilityModal(onClose, modalRef);
  const aiHeadingId = 'ai-comparison-heading';

  const features = useMemo(() => {
    const featureMap = new Map<string, { label: string, key: string }>();

    // Always add base features
    featureMap.set('reviewStars', { label: 'Rating', key: 'reviewStars' });
    featureMap.set('bestPrice', { label: 'Best Price', key: 'bestPrice' });

    // Conditionally add features based on all products in the list
    products.forEach(p => {
      if ((p as any)?.antutuScore) featureMap.set('antutuScore', { label: 'AnTuTu Score', key: 'antutuScore' });
      if ((p as any)?.dxoMarkCamera) featureMap.set('dxoMarkCamera', { label: 'DXOMARK Score', key: 'dxoMarkCamera' });
      if ((p as any)?.capacity) featureMap.set('capacity', { label: 'Capacity', key: 'capacity' });
      if ((p as any)?.energyRating) featureMap.set('energyRating', { label: 'Energy Rating', key: 'energyRating' });
      if ((p as any)?.displayRating) featureMap.set('displayRating', { label: 'Display Score', key: 'displayRating' });
    });

    // Always add trailing features
    featureMap.set('keySpecs', { label: 'Key Specs', key: 'keySpecs' });

    return Array.from(featureMap.values());
  }, [products]);

  const getFeatureValue = (product: Product, key: string) => {
    switch (key) {
      case 'reviewStars':
        return <StarRating rating={(product as any).reviewStars} />;
      case 'bestPrice': {
        const bestPrice = findBestRetailerPrice((product as any).retailerPrices || []);
        if (bestPrice) {
          return (
            <div>
              <p className="font-bold text-green-400">{bestPrice.price}</p>
              <p className="text-xs text-gray-400">on {bestPrice.retailerName}</p>
            </div>
          );
        }
        return (product as any).priceInINR || 'N/A';
      }
      case 'antutuScore':
        return ((product as any).antutuScore?.toLocaleString && (product as any).antutuScore.toLocaleString()) || 'N/A';
      case 'dxoMarkCamera':
        return (product as any).dxoMarkCamera || 'N/A';
      case 'capacity':
        return (product as any).capacity || 'N/A';
      case 'energyRating':
        return (product as any).energyRating || 'N/A';
      case 'displayRating':
        return (product as any).displayRating || 'N/A';
      case 'keySpecs':
        if (!(product as any).keySpecs || (product as any).keySpecs.length === 0) return 'N/A';
        return (
          <ul className="list-none space-y-1 text-xs">
            {(product as any).keySpecs.map((spec: string, i: number) => <li key={i}>{spec}</li>)}
          </ul>
        );
      default:
        return 'N/A';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-modal-title"
        className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-700/50 shadow-2xl shadow-cyan-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-800/80 backdrop-blur-sm z-10 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 id="compare-modal-title" className="text-xl font-bold text-white">Compare Products</h2>
          <Tooltip text="Close comparison">
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl leading-none" aria-label="Close modal">&times;</button>
          </Tooltip>
        </div>

        <div className="p-4 overflow-y-auto">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-3 text-left text-sm font-semibold text-gray-400 w-1/4">Feature</th>
                    {products.map(product => (
                      <th key={(product as any).modelName || (product as any).id} className={`p-3 text-left text-sm font-semibold text-white relative ${((product as any).modelName === (bestValueProduct as any)?.modelName) ? 'bg-amber-900/30' : ''}`}> 
                        {((product as any).modelName === (bestValueProduct as any)?.modelName) && (
                          <div className="absolute top-1 right-1 bg-amber-400 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span>Best Value</span>
                            <Tooltip text="AI's pick for the best combination of high star ratings and affordable price.">
                              <InfoIcon className="w-3 h-3 cursor-help" />
                            </Tooltip>
                          </div>
                        )}
                        {(product as any).brand} <br />
                        <span className="text-gray-300 font-normal">{(product as any).modelName}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map(feature => (
                    <tr key={feature.key} className="border-b border-gray-700/50">
                      <td className="p-3 font-semibold text-gray-300 align-top w-1/4">{feature.label}</td>
                      {products.map(product => (
                        <td key={(product as any).modelName || (product as any).id} className={`p-3 text-gray-300 align-top ${((product as any).modelName === (bestValueProduct as any)?.modelName) ? 'bg-amber-900/20' : ''}`}> 
                          {getFeatureValue(product, feature.key)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <section className="mt-6" aria-labelledby={aiHeadingId}>
             <h4 id={aiHeadingId} className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <BrainIcon className="w-5 h-5 text-cyan-400"/>
              AI Comparison Analysis
            </h4>
            <div 
              aria-live="polite" 
              aria-atomic="true" 
              className="text-gray-300 text-sm bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 prose prose-invert prose-p:my-2"
            >
                {comparisonResult ? <p>{comparisonResult}</p> : <div className="animate-pulse"><div className="h-4 bg-gray-700 rounded w-full mb-2" /><div className="h-4 bg-gray-700 rounded w-5/6" /></div>}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default CompareModal;