import React from 'react';
import HeartIcon from './icons/HeartIcon';
import Tooltip from './Tooltip';

interface HeaderProps {
  onHomeClick: () => void;
  wishlistCount: number;
  onWishlistClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, wishlistCount, onWishlistClick }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 max-w-4xl">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={onHomeClick}
            aria-label="Go to homepage"
          >
            <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <g transform="scale(1.2) translate(-40, -40)">
                <path d="M256 96 C234.2 96 222.3 115.3 222.3 128.5 C222.3 145.8 245.2 158.4 256 169.2 C266.8 158.4 289.7 145.8 289.7 128.5 C289.7 115.3 277.8 96 256 96 Z M241.9 173.4 V 169.2 H 270.1 V 173.4 C 270.1 175.7 268.2 177.6 265.9 177.6 H 246.1 C 243.8 177.6 241.9 175.7 241.9 173.4 Z" />
                {/* FIX: The path data for this element was previously truncated, causing a rendering error. It is now complete. */}
                <path d="M256 113.8C252.8 113.8 250.2 116.4 250.2 119.6C250.2 122.8 252.8 125.4 256 125.4C259.2 125.4 261.8 122.8 261.8 119.6C261.8 116.4 259.2 113.8 256 113.8Z" />
              </g>
            </svg>
            <h1 className="text-xl font-bold text-white">Gadget Guide AI</h1>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip text={`View your wishlist (${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'})`}>
              <button
                  onClick={onWishlistClick}
                  className="relative text-gray-300 hover:text-white transition-colors"
                  aria-label={`View wishlist, ${wishlistCount} items`}
              >
                  <HeartIcon className="w-7 h-7" />
                  {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-2 bg-cyan-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
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
