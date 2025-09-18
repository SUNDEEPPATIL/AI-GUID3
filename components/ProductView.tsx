

import React, { useState, useEffect, useMemo } from 'react';
import { Category, PriceRange, Product } from '../types';
import { fetchProducts } from '../services/geminiService';
import PriceTabs from './PriceTabs';
import ProductCard from './ProductCard';
import SkeletonLoader from './SkeletonLoader';
import { findBestValueProduct, findBestPerformanceProduct } from '../utils';
import { useToast } from '../ToastContext';

interface ProductViewProps {
  category: Category;
  priceRanges: PriceRange[];
  compareList: Product[];
  onToggleCompare: (product: Product) => void;
  compareDisabled: boolean;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onShare: (product: Product) => void;
}

const ProductView: React.FC<ProductViewProps> = ({ category, priceRanges, compareList, onToggleCompare, compareDisabled, wishlist, onToggleWishlist, onViewDetails, onShare }) => {
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | undefined>(priceRanges[0]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const { addToast } = useToast();
  const productGridId = 'product-grid';
  const headingId = `product-view-heading-${category.key}`;

  useEffect(() => {
    const getProducts = async () => {
      if (!category) return;

      setIsLoading(true);
      setProducts([]);
      const priceLabel = selectedPriceRange ? ` in the ${selectedPriceRange.label} range` : '';
      setAnnouncement(`Loading products for ${category.name}${priceLabel}.`);

      // Cancellation guard to prevent state updates after unmount or dependency change
      let cancelled = false;

      try {
        const fetchedProducts = await fetchProducts(category, selectedPriceRange);
        
        // Only update state if component hasn't been unmounted or dependencies changed
        if (!cancelled) {
          setProducts(fetchedProducts);
          setAnnouncement(`${fetchedProducts.length} products found for ${category.name}${priceLabel}. Results are now showing.`);
        }
      } catch (err: any) {
        // Only update state if component hasn't been unmounted or dependencies changed
        if (!cancelled) {
          addToast(err.message, 'error');
          setAnnouncement(`Error loading products. ${err.message}`);
        }
      } finally {
        // Only update loading state if component hasn't been unmounted or dependencies changed
        if (!cancelled) {
          setIsLoading(false);
        }
      }
      
      // Cleanup function to mark request as cancelled
      return () => {
        cancelled = true;
      };
    };

    const cleanup = getProducts();
    return cleanup;
  }, [category, selectedPriceRange, addToast]);

  const bestValueProduct = useMemo(() => findBestValueProduct(products), [products]);
  const bestPerformanceProduct = useMemo(() => findBestPerformanceProduct(products), [products]);
  
  return (
    <section aria-labelledby={headingId}>
      <div className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</div>
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
            <h2 id={headingId} className="text-3xl font-bold text-white">{category.name}</h2>
            <p className="text-gray-400 mt-1">{category.description}</p>
        </div>
        {category.hasPriceRanges && (
          <PriceTabs
            priceRanges={priceRanges}
            selectedKey={selectedPriceRange?.key}
            onSelect={setSelectedPriceRange}
            controlsId={productGridId}
          />
        )}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonLoader key={i} />)}
        </div>
      )}

      {!isLoading && products.length > 0 && (
        <div id={productGridId} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.modelName}
              product={product}
              onViewDetails={() => onViewDetails(product)}
              onToggleCompare={onToggleCompare}
              isInCompare={compareList.some(p => p.modelName === product.modelName)}
              compareDisabled={compareDisabled && !compareList.some(p => p.modelName === product.modelName)}
              isBestValue={product.modelName === bestValueProduct?.modelName}
              isBestPerformance={product.modelName === bestPerformanceProduct?.modelName}
              isWishlisted={wishlist.some(p => p.modelName === product.modelName)}
              onToggleWishlist={onToggleWishlist}
              onShare={onShare}
            />
          ))}
        </div>
      )}
      
      {!isLoading && products.length === 0 && (
         <div className="text-center py-10 bg-gray-800/50 rounded-lg">
          <p className="text-gray-400">No products found for this selection.</p>
        </div>
      )}
    </section>
  );
};

export default ProductView;