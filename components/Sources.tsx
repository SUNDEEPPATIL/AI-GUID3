import React from 'react';

type Source = {
  id?: string;
  web?: {
    url?: string;
    title?: string;
  };
};

type Props = {
  sources: Source[];
};

export default function Sources({ sources }: Props) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="sources">
      <ul>
        {sources.map((source, idx) => {
          // Use optional chaining and safe defaults
          const url = source.web?.url ?? '#';
          const title = source.web?.title ?? url;
          return (
            <li key={source.id ?? idx}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
