

import React from 'react';
import { GroundingChunk } from '../types';
import LinkIcon from './icons/LinkIcon';
import Tooltip from './Tooltip';

interface SourcesProps {
  sources: GroundingChunk[];
}

const Sources: React.FC<SourcesProps> = ({ sources }) => {
  // FIX: Filter out sources without a URI or title, as they are not useful to display.
  const validSources = sources?.filter(source => source.web?.uri && source.web?.title);

  if (!validSources || validSources.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <LinkIcon className="w-5 h-5 text-cyan-400" />
        Sources
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {validSources.map((source, index) => (
          <Tooltip key={index} text="Opens source in a new tab">
            <a
              href={source.web?.uri || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-700/80 transition-colors"
            >
              <p className="text-sm font-medium text-cyan-400 truncate">{source.web?.title || 'Unknown Source'}</p>
              <p className="text-xs text-gray-500 truncate">{source.web?.uri || ''}</p>
            </a>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default Sources;