import React from 'react';
import { AiModel } from '../types';
import GeminiIcon from './icons/GeminiIcon';
import PerplexityIcon from './icons/PerplexityIcon';
import ChatGptIcon from './icons/ChatGptIcon';

interface AiSummaryProps {
  summary: string;
  sourceAi: AiModel;
}

const AI_MODELS_INFO = {
  gemini: {
    name: 'Gemini AI',
    icon: GeminiIcon,
    color: 'text-cyan-400',
  },
  perplexity: {
    name: 'Perplexity AI',
    icon: PerplexityIcon,
    color: 'text-blue-400',
  },
  chatgpt: {
    name: 'ChatGPT',
    icon: ChatGptIcon,
    color: 'text-teal-400',
  }
};

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
