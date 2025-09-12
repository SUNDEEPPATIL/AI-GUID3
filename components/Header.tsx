import React from 'react';
import MobileSignalIcon from './icons/MobileSignalIcon';
import HeartIcon from './icons/HeartIcon';
import Tooltip from './Tooltip';
import DownloadIcon from './icons/DownloadIcon';

interface HeaderProps {
  onHomeClick: () => void;
  wishlistCount: number;
  onWishlistClick: () => void;
  showInstallButton: boolean;
  onInstallClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, wishlistCount, onWishlistClick, showInstallButton, onInstallClick }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 max-w-4xl">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={onHomeClick}
          >
            <MobileSignalIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">Gadget Guide AI</h1>
          </div>
          <div className="flex items-center gap-3">
            {showInstallButton && (
              <Tooltip text="Install app for offline access">
                <button 
                  onClick={onInstallClick}
                  className="flex items-center gap-2 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Install app"
                >
                  <DownloadIcon className="w-5 h-5 text-white" />
                  <span className="hidden sm:block text-sm font-semibold text-white">Install</span>
                </button>
              </Tooltip>
            )}
            <Tooltip text="View your wishlist">
              <button 
                onClick={onWishlistClick}
                className="relative flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label={`View wishlist with ${wishlistCount} items`}
              >
                <HeartIcon className="w-5 h-5 text-pink-400" />
                <span className="hidden sm:block text-sm font-semibold text-white">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-pink-500 text-white text-xs font-bold rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
