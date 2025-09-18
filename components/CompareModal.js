import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo, useRef } from 'react';
import StarRating from './StarRating';
import { findBestValueProduct, findBestRetailerPrice } from '../utils';
import Tooltip from './Tooltip';
import InfoIcon from './icons/InfoIcon';
import BrainIcon from './icons/BrainIcon';
import { useAccessibilityModal } from '../hooks/useAccessibilityModal';
const CompareModal = ({ products, onClose, comparisonResult }) => {
    const bestValueProduct = useMemo(() => findBestValueProduct(products), [products]);
    const modalRef = useRef(null);
    useAccessibilityModal(onClose, modalRef);
    const aiHeadingId = 'ai-comparison-heading';
    const features = useMemo(() => {
        const featureMap = new Map();
        // Always add base features
        featureMap.set('reviewStars', { label: 'Rating', key: 'reviewStars' });
        featureMap.set('bestPrice', { label: 'Best Price', key: 'bestPrice' });
        // Conditionally add features based on all products in the list
        products.forEach(p => {
            if (p.antutuScore)
                featureMap.set('antutuScore', { label: 'AnTuTu Score', key: 'antutuScore' });
            if (p.dxoMarkCamera)
                featureMap.set('dxoMarkCamera', { label: 'DXOMARK Score', key: 'dxoMarkCamera' });
            if (p.capacity)
                featureMap.set('capacity', { label: 'Capacity', key: 'capacity' });
            if (p.energyRating)
                featureMap.set('energyRating', { label: 'Energy Rating', key: 'energyRating' });
            if (p.displayRating)
                featureMap.set('displayRating', { label: 'Display Score', key: 'displayRating' });
        });
        // Always add trailing features
        featureMap.set('keySpecs', { label: 'Key Specs', key: 'keySpecs' });
        return Array.from(featureMap.values());
    }, [products]);
    const getFeatureValue = (product, key) => {
        switch (key) {
            case 'reviewStars':
                return _jsx(StarRating, { rating: product.reviewStars });
            case 'bestPrice': {
                const bestPrice = findBestRetailerPrice(product.retailerPrices || []);
                if (bestPrice) {
                    return (_jsxs("div", { children: [_jsx("p", { className: "font-bold text-green-400", children: bestPrice.price }), _jsxs("p", { className: "text-xs text-gray-400", children: ["on ", bestPrice.retailerName] })] }));
                }
                return product.priceInINR || 'N/A';
            }
            case 'antutuScore':
                return product.antutuScore?.toLocaleString() || 'N/A';
            case 'dxoMarkCamera':
                return product.dxoMarkCamera || 'N/A';
            case 'capacity':
                return product.capacity || 'N/A';
            case 'energyRating':
                return product.energyRating || 'N/A';
            case 'displayRating':
                return product.displayRating || 'N/A';
            case 'keySpecs':
                if (!product.keySpecs || product.keySpecs.length === 0)
                    return 'N/A';
                return (_jsx("ul", { className: "list-none space-y-1 text-xs", children: product.keySpecs.map((spec, i) => _jsx("li", { children: spec }, i)) }));
            default:
                return 'N/A';
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4", onClick: onClose, children: _jsxs("div", { ref: modalRef, role: "dialog", "aria-modal": "true", "aria-labelledby": "compare-modal-title", className: "bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-700/50 shadow-2xl shadow-cyan-500/10", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "sticky top-0 bg-gray-800/80 backdrop-blur-sm z-10 p-4 border-b border-gray-700 flex justify-between items-center", children: [_jsx("h2", { id: "compare-modal-title", className: "text-xl font-bold text-white", children: "Compare Products" }), _jsx(Tooltip, { text: "Close comparison", children: _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors text-3xl leading-none", "aria-label": "Close modal", children: "\u00D7" }) })] }), _jsxs("div", { className: "p-4 overflow-y-auto", children: [_jsx("div", { className: "overflow-x-auto", children: _jsx("div", { className: "inline-block min-w-full", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-700", children: [_jsx("th", { className: "p-3 text-left text-sm font-semibold text-gray-400 w-1/4", children: "Feature" }), products.map(product => (_jsxs("th", { className: `p-3 text-left text-sm font-semibold text-white relative ${product.modelName === bestValueProduct?.modelName ? 'bg-amber-900/30' : ''}`, children: [product.modelName === bestValueProduct?.modelName && (_jsxs("div", { className: "absolute top-1 right-1 bg-amber-400 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1", children: [_jsx("span", { children: "Best Value" }), _jsx(Tooltip, { text: "AI's pick for the best combination of high star ratings and affordable price.", children: _jsx(InfoIcon, { className: "w-3 h-3 cursor-help" }) })] })), product.brand, " ", _jsx("br", {}), _jsx("span", { className: "text-gray-300 font-normal", children: product.modelName })] }, product.modelName)))] }) }), _jsx("tbody", { children: features.map(feature => (_jsxs("tr", { className: "border-b border-gray-700/50", children: [_jsx("td", { className: "p-3 font-semibold text-gray-300 align-top w-1/4", children: feature.label }), products.map(product => (_jsx("td", { className: `p-3 text-gray-300 align-top ${product.modelName === bestValueProduct?.modelName ? 'bg-amber-900/20' : ''}`, children: getFeatureValue(product, feature.key) }, product.modelName)))] }, feature.key))) })] }) }) }), _jsxs("section", { className: "mt-6", "aria-labelledby": aiHeadingId, children: [_jsxs("h4", { id: aiHeadingId, className: "text-lg font-semibold text-white mb-3 flex items-center gap-2", children: [_jsx(BrainIcon, { className: "w-5 h-5 text-cyan-400" }), "AI Comparison Analysis"] }), _jsx("div", { "aria-live": "polite", "aria-atomic": "true", className: "text-gray-300 text-sm bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 prose prose-invert prose-p:my-2", children: comparisonResult ? _jsx("p", { children: comparisonResult }) : _jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-4 bg-gray-700 rounded w-full mb-2" }), _jsx("div", { className: "h-4 bg-gray-700 rounded w-5/6" })] }) })] })] })] }) }));
};
export default CompareModal;
