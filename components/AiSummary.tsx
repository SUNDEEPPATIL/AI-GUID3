import React from 'react';
import { AiModel } from '../types';
import { AI_MODELS_INFO } from '../constants';

interface AiSummaryProps {
  summary: string;
  sourceAi: AiModel;
}

const AiSummary: React.FC<AiSummaryProps> = ({ summary, sourceAi }) => {
  if (!summary) return null;

  const { name, icon: Icon, color } = AI_MODELS_INFO[sourceAi] || AI_MODELS_INFO.gemini;
  
  return (
    <div>
      <h3 className={`text-lg font-semibold text-white mb-3 flex items-center gap-2`}>
        <Icon className={`w-6 h-6 ${color}`} />
        {name}-Generated Answer
      </h3>
      <div className="prose prose-invert prose-p:my-2 max-w-none text-gray-300 bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
        <p>{summary}</p>
      </div>
    </div>
  );
};

export default AiSummary;