import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useMemo } from 'react';
import { fetchProducts } from '../services/geminiService';
import PriceTabs from './PriceTabs';
import ProductCard from './ProductCard';
import SkeletonLoader from './SkeletonLoader';
import { findBestValueProduct, findBestPerformanceProduct } from '../utils';
import { useToast } from '../ToastContext';
const ProductView = ({ category, priceRanges, compareList, onToggleCompare, compareDisabled, wishlist, onToggleWishlist, onViewDetails, onShare }) => {
    const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [announcement, setAnnouncement] = useState('');
    const { addToast } = useToast();
    const productGridId = 'product-grid';
    const headingId = `product-view-heading-${category.key}`;
    useEffect(() => {
        const getProducts = async () => {
            if (!category)
                return;
            setIsLoading(true);
            setProducts([]);
            const priceLabel = selectedPriceRange ? ` in the ${selectedPriceRange.label} range` : '';
            setAnnouncement(`Loading products for ${category.name}${priceLabel}.`);
            try {
                const fetchedProducts = await fetchProducts(category, selectedPriceRange);
                setProducts(fetchedProducts);
                setAnnouncement(`${fetchedProducts.length} products found for ${category.name}${priceLabel}. Results are now showing.`);
            }
            catch (err) {
                addToast(err.message, 'error');
                setAnnouncement(`Error loading products. ${err.message}`);
            }
            finally {
                setIsLoading(false);
            }
        };
        getProducts();
    }, [category, selectedPriceRange, addToast]);
    const bestValueProduct = useMemo(() => findBestValueProduct(products), [products]);
    const bestPerformanceProduct = useMemo(() => findBestPerformanceProduct(products), [products]);
    return (_jsxs("section", { "aria-labelledby": headingId, children: [_jsx("div", { className: "sr-only", "aria-live": "polite", "aria-atomic": "true", children: announcement }), _jsxs("div", { className: "mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h2", { id: headingId, className: "text-3xl font-bold text-white", children: category.name }), _jsx("p", { className: "text-gray-400 mt-1", children: category.description })] }), category.hasPriceRanges && (_jsx(PriceTabs, { priceRanges: priceRanges, selectedKey: selectedPriceRange?.key, onSelect: setSelectedPriceRange, controlsId: productGridId }))] }), isLoading && (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: Array.from({ length: 6 }).map((_, i) => _jsx(SkeletonLoader, {}, i)) })), !isLoading && products.length > 0 && (_jsx("div", { id: productGridId, className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: products.map((product) => (_jsx(ProductCard, { product: product, onViewDetails: () => onViewDetails(product), onToggleCompare: onToggleCompare, isInCompare: compareList.some(p => p.modelName === product.modelName), compareDisabled: compareDisabled && !compareList.some(p => p.modelName === product.modelName), isBestValue: product.modelName === bestValueProduct?.modelName, isBestPerformance: product.modelName === bestPerformanceProduct?.modelName, isWishlisted: wishlist.some(p => p.modelName === product.modelName), onToggleWishlist: onToggleWishlist, onShare: onShare }, product.modelName))) })), !isLoading && products.length === 0 && (_jsx("div", { className: "text-center py-10 bg-gray-800/50 rounded-lg", children: _jsx("p", { className: "text-gray-400", children: "No products found for this selection." }) }))] }));
};
export default ProductView;
