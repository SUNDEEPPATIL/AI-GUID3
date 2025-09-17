import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import { fetchProductAnalysis } from '../services/geminiService';
import { useToast } from '../ToastContext';
import { createPurchaseLink } from '../utils';
import { useAccessibilityModal } from '../hooks/useAccessibilityModal';
import Tooltip from './Tooltip';
import StarRating from './StarRating';
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
const RetailerIcon = ({ retailerName, className }) => {
    const name = retailerName.toLowerCase();
    if (name.includes('amazon'))
        return _jsx(AmazonIcon, { className: className });
    if (name.includes('flipkart'))
        return _jsx(FlipkartIcon, { className: className });
    if (name.includes('croma'))
        return _jsx(CromaIcon, { className: className });
    return _jsx(StoreIcon, { className: className });
};
const ProductModal = ({ product, category, onClose, isWishlisted, onToggleWishlist, onShare }) => {
    const [analysis, setAnalysis] = useState(null);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);
    const { addToast } = useToast();
    const modalRef = useRef(null);
    useAccessibilityModal(onClose, modalRef);
    useEffect(() => {
        const getAnalysis = async () => {
            setIsLoadingAnalysis(true);
            setAnalysis(null);
            try {
                const result = await fetchProductAnalysis(product);
                setAnalysis(result);
            }
            catch (error) {
                addToast(error.message, 'error');
            }
            finally {
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
    const renderInfoItem = (Icon, label, value) => {
        if (!value)
            return null;
        return (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-300", children: [_jsx(Icon, { className: "w-4 h-4 text-cyan-400" }), _jsxs("span", { children: [label, ": ", _jsx("span", { className: "font-semibold text-white", children: value.toLocaleString() })] })] }));
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
        const value = product[spec.key];
        const hasValue = value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0);
        if (!hasValue) {
            return false;
        }
        return spec.categories.includes(categoryKey);
    });
    return (_jsx("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in", onClick: onClose, children: _jsxs("div", { ref: modalRef, role: "dialog", "aria-modal": "true", "aria-labelledby": "product-modal-title", className: "bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-700/50 shadow-2xl shadow-cyan-500/10", onClick: (e) => e.stopPropagation(), children: [_jsxs("header", { className: "sticky top-0 bg-gray-800/80 backdrop-blur-sm z-10 p-4 border-b border-gray-700 flex justify-between items-start gap-4", children: [_jsxs("div", { children: [_jsxs("h2", { id: "product-modal-title", className: "text-xl font-bold text-white", children: [product.brand, " ", product.modelName] }), _jsxs("div", { className: "flex items-center gap-3 mt-1", children: [_jsx(StarRating, { rating: product.reviewStars }), product.totalReviews && _jsxs("span", { className: "text-xs text-gray-400", children: ["(", product.totalReviews.toLocaleString(), " reviews)"] })] })] }), _jsx(Tooltip, { text: "Close details", children: _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors text-3xl leading-none flex-shrink-0 -mt-1", "aria-label": "Close modal", children: "\u00D7" }) })] }), _jsx("main", { className: "p-6 overflow-y-auto space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("section", { className: cardClasses, "aria-labelledby": keyInfoId, children: [_jsx("h4", { id: keyInfoId, className: titleClasses, children: "Key Information" }), _jsxs("div", { className: "space-y-2", children: [renderInfoItem(RupeeIcon, product.priceInINR ? 'Price' : 'Expected Price', price), renderInfoItem(CalendarIcon, product.launchYear ? 'Launched' : 'Expected Launch', launchInfo), _jsx("p", { className: "text-sm text-gray-400 pt-2", children: product.summary })] })] }), (visualSpecs.length > 0 || (product.keySpecs && product.keySpecs.length > 0)) && (_jsxs("section", { className: cardClasses, "aria-labelledby": keySpecsId, children: [_jsxs("h4", { id: keySpecsId, className: titleClasses, children: [_jsx(KeyIcon, { className: "w-5 h-5 text-cyan-400" }), " Key Specifications"] }), visualSpecs.length > 0 && (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3 text-center", children: visualSpecs.map(({ key, label, icon: Icon }) => {
                                                    const value = product[key];
                                                    return (_jsxs("div", { className: "flex flex-col items-center p-2 bg-gray-800/60 rounded-lg", children: [_jsx(Icon, { className: "w-4 h-4 text-cyan-400 mb-2" }), _jsx("p", { className: "text-sm font-semibold text-white truncate w-full", children: Array.isArray(value) ? value.join(', ') : value?.toLocaleString() }), _jsx("p", { className: "text-xs text-gray-400", children: label })] }, key));
                                                }) })), product.keySpecs && product.keySpecs.length > 0 && (_jsx("div", { className: `space-y-2 ${visualSpecs.length > 0 ? 'pt-4 mt-4 border-t border-gray-700/50' : ''}`, children: product.keySpecs.map((spec, index) => (_jsxs("div", { className: "flex items-start gap-2.5 text-sm", children: [_jsx(StarIcon, { className: "w-4 h-4 text-cyan-400/80 flex-shrink-0 mt-0.5" }), _jsx("span", { className: "text-gray-300", children: spec })] }, index))) }))] })), product.retailerPrices && product.retailerPrices.length > 0 && (_jsxs("section", { className: cardClasses, "aria-labelledby": whereToBuyId, children: [_jsxs("h4", { id: whereToBuyId, className: titleClasses, children: [_jsx(TagIcon, { className: "w-5 h-5 text-cyan-400" }), " Where to Buy"] }), _jsx("div", { className: "space-y-2", children: product.retailerPrices.map((retailer) => (_jsxs("a", { href: createPurchaseLink(retailer, product), target: "_blank", rel: "noopener noreferrer", className: "flex items-center justify-between p-2 bg-gray-800/60 rounded-md hover:bg-gray-700/60 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(RetailerIcon, { retailerName: retailer.retailerName, className: "w-5 h-5" }), _jsx("span", { className: "text-sm text-gray-300", children: retailer.retailerName })] }), _jsx("span", { className: "text-sm font-bold text-green-400", children: retailer.price })] }, retailer.retailerName))) })] }))] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("section", { className: cardClasses, "aria-labelledby": aiAnalysisId, children: [_jsxs("h4", { id: aiAnalysisId, className: titleClasses, children: [_jsx(BrainIcon, { className: "w-5 h-5 text-cyan-400" }), " AI Analysis & Suggestion"] }), isLoadingAnalysis ? (_jsxs("div", { className: "flex flex-col items-center justify-center text-center py-4", children: [_jsx(BrainIcon, { className: "w-8 h-8 text-cyan-400 animate-pulse mb-3" }), _jsx("p", { className: "text-sm font-semibold text-gray-300", children: "Generating AI analysis..." }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "This may take a moment." })] })) : analysis ? (_jsxs("div", { children: [_jsx("h5", { className: "font-semibold text-gray-300 text-sm mb-1", children: "AI Review Analysis" }), _jsx("p", { className: "text-sm text-gray-400 mb-4", children: analysis.reviewAnalysis }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-start gap-2", children: [_jsx(CheckCircleIcon, { className: "w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("h6", { className: "font-semibold text-sm text-green-400", children: "Who is it for?" }), _jsx("p", { className: "text-sm text-gray-400", children: analysis.geminiSuggestion.whoIsItFor })] })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(XCircleIcon, { className: "w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("h6", { className: "font-semibold text-sm text-red-400", children: "Who should avoid it?" }), _jsx("p", { className: "text-sm text-gray-400", children: analysis.geminiSuggestion.whoShouldAvoidIt })] })] }), analysis.geminiSuggestion.keyAlternative && (_jsxs("div", { className: "flex items-start gap-2", children: [_jsx(LightbulbIcon, { className: "w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("h6", { className: "font-semibold text-sm text-amber-400", children: "Key Alternative" }), _jsx("p", { className: "text-sm text-gray-400", children: analysis.geminiSuggestion.keyAlternative })] })] }))] })] })) : (_jsx("p", { className: "text-sm text-gray-500", children: "Could not load AI analysis for this product." }))] }), product.userReviews && product.userReviews.length > 0 && (_jsxs("section", { className: cardClasses, "aria-labelledby": userReviewsId, children: [_jsxs("h4", { id: userReviewsId, className: titleClasses, children: [_jsx(UsersIcon, { className: "w-5 h-5 text-cyan-400" }), " User Reviews"] }), _jsx("div", { className: "space-y-3", children: product.userReviews.map((review, i) => (_jsxs("div", { className: "p-2 bg-gray-800/60 rounded-md", children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(UserIcon, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { className: "text-sm font-semibold text-gray-300", children: review.username })] }), _jsx(StarRating, { rating: review.rating })] }), _jsxs("p", { className: "text-sm text-gray-400 italic", children: ["\"", review.comment, "\""] })] }, i))) })] }))] })] }) }), _jsxs("footer", { className: "p-4 bg-gray-800/50 border-t border-gray-700/50 mt-auto flex items-center justify-end gap-3", children: [_jsx(Tooltip, { text: "Share this product", children: _jsxs("button", { onClick: () => onShare(product), className: "flex items-center gap-2 px-4 py-2 bg-gray-700/80 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors", "aria-label": "Share product", children: [_jsx(ShareIcon, { className: "w-5 h-5" }), _jsx("span", { className: "text-sm font-semibold hidden sm:inline", children: "Share" })] }) }), _jsx(Tooltip, { text: isWishlisted ? "Remove from wishlist" : "Add to wishlist", children: _jsxs("button", { onClick: () => onToggleWishlist(product), className: `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold ${isWishlisted
                                    ? 'bg-pink-500/20 text-pink-300'
                                    : 'bg-gray-700/80 hover:bg-gray-700 text-white'}`, "aria-label": isWishlisted ? "Remove from wishlist" : "Add to wishlist", children: [_jsx(HeartIcon, { className: "w-5 h-5", filled: isWishlisted }), _jsx("span", { className: "text-sm hidden sm:inline", children: isWishlisted ? "Wishlisted" : "Add to Wishlist" })] }) })] })] }) }));
};
export default ProductModal;
