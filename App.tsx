

import React, { useState, useEffect, useCallback } from 'react';
import { PRICE_RANGES } from './constants';
import { Category, Product } from './types';
import Header from './components/Header';
import ProductView from './components/ProductView';
import CompareTray from './components/CompareTray';
import CompareModal from './components/CompareModal';
import { compareProducts } from './services/geminiService';
import WishlistModal from './components/WishlistModal';
import SearchHome from './components/SearchHome';
import { useToast } from './ToastContext';
import ToastContainer from './components/ToastContainer';
import ProductModal from './components/ProductModal';
import InstallPromptBanner from './components/InstallPromptBanner';

// TypeScript definitions for the PWA install prompt event
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// The period to wait before showing the install banner again after dismissal.
const INSTALL_BANNER_DISMISSAL_PERIOD = 7 * 24 * 60 * 60 * 1000; // 7 days

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'products'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [comparisonResult, setComparisonResult] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const savedWishlist = localStorage.getItem('gadget-guide-wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error('Could not parse wishlist from localStorage', error);
      return [];
    }
  });
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryForModal, setCategoryForModal] = useState<Category | null>(null);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('gadget-guide-wishlist', JSON.stringify(wishlist));
    } catch (error)      {
      console.error('Could not save wishlist to localStorage', error);
    }
  }, [wishlist]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setInstallPrompt(e);
      
      const dismissedTimestamp = localStorage.getItem('gadget-guide-install-dismissed-timestamp');
      if (dismissedTimestamp) {
        const timeSinceDismissal = Date.now() - parseInt(dismissedTimestamp, 10);
        if (timeSinceDismissal < INSTALL_BANNER_DISMISSAL_PERIOD) {
          // It hasn't been long enough, so don't show the banner.
          return;
        }
      }
      
      // Show the banner if it was never dismissed, or if the dismissal period has passed.
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setShowInstallBanner(false);
      // Clear the dismissal timestamp once the app is installed.
      try {
        localStorage.removeItem('gadget-guide-install-dismissed-timestamp');
      } catch (error) {
        console.error('Could not remove install dismissal timestamp from localStorage', error);
      }
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      // Cleanup: Remove PWA event listeners to prevent memory leaks
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);
  
  useEffect(() => {
    // Handle app shortcut to open wishlist
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('view') === 'wishlist') {
      setIsWishlistModalOpen(true);
    }
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        addToast('App installed successfully!', 'info');
      }
      setShowInstallBanner(false);
      setInstallPrompt(null);
    });
  };
  
  const handleDismissInstallBanner = () => {
    setShowInstallBanner(false);
    try {
      // Store a timestamp to temporarily dismiss the banner, making it less intrusive.
      localStorage.setItem('gadget-guide-install-dismissed-timestamp', Date.now().toString());
    } catch (error) {
      console.error('Could not save install prompt dismissal to localStorage', error);
    }
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setCurrentView('products');
  };
  
  const handleHomeClick = () => {
    setSelectedCategory(null);
    setCurrentView('home');
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setCategoryForModal(selectedCategory);
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
    setCategoryForModal(null);
  };

  const handleShare = useCallback(async (product: Product) => {
    const productUrl = `${window.location.origin}${window.location.pathname}?product=${encodeURIComponent(product.modelName)}`;
    
    const shareData = {
      title: `Check out the ${product.brand} ${product.modelName}`,
      text: `I found this on Gadget Guide AI: ${product.summary}`,
      url: productUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if ((error as DOMException).name !== 'AbortError') {
          console.error('Error sharing product:', error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(productUrl);
        addToast('Link copied to clipboard!', 'info');
      } catch (err) {
        console.error('Failed to copy link:', err);
        addToast('Sharing is not supported on your browser.', 'error');
      }
    }
  }, [addToast]);

  const handleToggleCompare = useCallback((product: Product) => {
    setCompareList(prev => {
      const isInList = prev.some(p => p.modelName === product.modelName);
      if (isInList) {
        return prev.filter(p => p.modelName !== product.modelName);
      } else {
        if (prev.length < 3) {
          return [...prev, product];
        }
      }
      return prev;
    });
  }, []);

  const handleStartCompare = async () => {
    if (compareList.length < 2) return;
    setIsComparing(true);
    setComparisonResult('');
    setIsCompareModalOpen(true);
    try {
      const result = await compareProducts(compareList);
      setComparisonResult(result);
    } catch (error: any) {
      addToast(error.message, 'error');
      setComparisonResult('Sorry, there was an error generating the comparison. Please try again.');
    } finally {
      setIsComparing(false);
    }
  };
  
  const handleClearCompare = () => {
    setCompareList([]);
  };

  const handleCloseCompareModal = () => {
    setIsCompareModalOpen(false);
    setComparisonResult('');
  };

  const handleToggleWishlist = useCallback((product: Product) => {
    setWishlist(prev => {
      const isInList = prev.some(p => p.modelName === product.modelName);
      if (isInList) {
        return prev.filter(p => p.modelName !== product.modelName);
      } else {
        return [...prev, product];
      }
    });
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 font-sans">
      <Header 
        onHomeClick={handleHomeClick}
        wishlistCount={wishlist.length}
        onWishlistClick={() => setIsWishlistModalOpen(true)}
      />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {currentView === 'home' && (
          <SearchHome 
            onCategorySelect={handleSelectCategory}
          />
        )}
        {currentView === 'products' && selectedCategory && (
          <ProductView
            category={selectedCategory}
            priceRanges={PRICE_RANGES[selectedCategory.key]}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            compareDisabled={compareList.length >= 3}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onViewDetails={handleViewDetails}
            onShare={handleShare}
          />
        )}
      </main>

      {showInstallBanner && (
        <InstallPromptBanner
          onInstall={handleInstallClick}
          onDismiss={handleDismissInstallBanner}
        />
      )}

      {compareList.length > 0 && (
        <CompareTray
          items={compareList}
          onCompare={handleStartCompare}
          onRemove={handleToggleCompare}
          onClear={handleClearCompare}
        />
      )}

      {isCompareModalOpen && (
        <CompareModal 
          products={compareList}
          onClose={handleCloseCompareModal}
          comparisonResult={comparisonResult}
        />
      )}
      
      {isWishlistModalOpen && (
        <WishlistModal
          items={wishlist}
          onClose={() => setIsWishlistModalOpen(false)}
          onToggleWishlist={handleToggleWishlist}
          onToggleCompare={handleToggleCompare}
          compareList={compareList}
          compareDisabled={compareList.length >= 3}
        />
      )}
      {selectedProduct && categoryForModal && (
        <ProductModal 
            product={selectedProduct} 
            category={categoryForModal}
            onClose={handleCloseProductModal} 
            isWishlisted={wishlist.some(p => p.modelName === selectedProduct.modelName)}
            onToggleWishlist={handleToggleWishlist}
            onShare={handleShare}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default App;