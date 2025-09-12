import React from 'react';
import MobileSignalIcon from './icons/MobileSignalIcon';
import DownloadIcon from './icons/DownloadIcon';

interface InstallPromptBannerProps {
  onInstall: () => void;
  onDismiss: () => void;
}

const InstallPromptBanner: React.FC<InstallPromptBannerProps> = ({ onInstall, onDismiss }) => {
  return (
    <div 
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl z-30 animate-fade-in"
      role="dialog"
      aria-labelledby="install-banner-title"
      aria-describedby="install-banner-description"
    >
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-gray-900 p-2 rounded-lg">
            <MobileSignalIcon className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h2 id="install-banner-title" className="font-bold text-white">Install Gadget Guide AI</h2>
            <p id="install-banner-description" className="text-sm text-gray-300 mt-1">
              Add to your home screen for faster access and offline capabilities.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={onDismiss}
            className="px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Not now
          </button>
          <button
            onClick={onInstall}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <DownloadIcon className="w-5 h-5" />
            Install
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPromptBanner;
