import React from 'react';
import { GroundingChunk } from '../types';
import LinkIcon from './icons/LinkIcon';
import Tooltip from './Tooltip';

type Props = {
  sources?: GroundingChunk[] | null;
};

export default function Sources({ sources }: Props) {
  // Accept both web.uri and web.url depending on data shape
  const validSources = sources?.filter(
    (s) => !!(s?.web && (s.web.uri || (s.web as any).url) && s.web.title)
  );

  if (!validSources || validSources.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <LinkIcon className="w-5 h-5 text-cyan-400" />
        Sources
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {validSources.map((source, index) => {
          const url = source?.web?.uri ?? (source?.web as any)?.url;
          const title = source?.web?.title ?? url;
          return (
            <Tooltip key={source.id ?? index} text="Opens source in a new tab">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-700/80 transition-colors"
              >
                <p className="text-sm font-medium text-cyan-400 truncate">{title}</p>
                <p className="text-xs text-gray-500 truncate">{url}</p>
              </a>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}