import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CATEGORY_GROUPS, AI_MODELS_INFO } from '../constants';
import { Category, SearchResult, AiModel } from '../types';
import CategorySelector from './CategorySelector';
import { search } from '../services/geminiService';
import { useToast } from '../ToastContext';
import SearchIcon from './icons/SearchIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';
import AiSummary from './AiSummary';
import Sources from './Sources';
import Tooltip from './Tooltip';
import BrainIcon from './icons/BrainIcon';

interface SearchHomeProps {
  onCategorySelect: (category: Category) => void;
  initialQuery?: string;
}

// Speech Recognition API interface
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}
// FIX: Augment the global Window interface to include Speech Recognition APIs,
// resolving TypeScript errors about properties not existing on 'window'.
declare global {
  interface Window {
    SpeechRecognition: {
      prototype: SpeechRecognition;
      new(): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      prototype: SpeechRecognition;
      new(): SpeechRecognition;
    };
  }
}

const SearchHome: React.FC<SearchHomeProps> = ({ onCategorySelect, initialQuery }) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAi, setSelectedAi] = useState<AiModel>('gemini');
  const [isListening, setIsListening] = useState(false);
  const { addToast } = useToast();

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setSearchResult(null);
    try {
      const result = await search(searchQuery, selectedAi);
      setSearchResult(result);
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [selectedAi, addToast]);


  useEffect(() => {
    if (initialQuery) {
        setQuery(initialQuery);
        handleSearch(initialQuery);
    }
  }, [initialQuery, handleSearch]);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleSearch(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        addToast('No speech detected or microphone error. Please try again.', 'error');
      } else {
        addToast(`Voice search error: ${event.error}`, 'error');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [addToast, handleSearch]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch(query);
    }
  };

  const handleVoiceSearch = () => {
    if (isListening || !recognitionRef.current) return;
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch (error) {
        console.error("Could not start voice recognition: ", error);
        addToast("Could not start voice recognition. Please ensure microphone permissions are enabled.", "error");
        setIsListening(false);
    }
  };

  return (
    <>
      <section className="flex flex-col items-center justify-center pt-10 md:pt-12 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Gadget Questions?</h2>
        <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
            Ask our AI anything about gadgets. Get instant, synthesized answers from across the web.
        </p>

        <div className="mt-8 w-full max-w-2xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Best gaming phone under ₹30,000?"
              className="w-full pl-12 pr-24 py-4 bg-gray-800 border border-gray-700/50 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                <Tooltip text="Search with voice">
                  <button onClick={handleVoiceSearch} disabled={!recognitionRef.current} className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/50 text-white animate-pulse' : 'hover:bg-gray-700 text-gray-400'}`}>
                      <MicrophoneIcon className="w-5 h-5" />
                  </button>
                </Tooltip>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="text-sm text-gray-400 font-medium">Answer with:</span>
            {(Object.keys(AI_MODELS_INFO) as AiModel[]).map((key) => {
              const model = AI_MODELS_INFO[key];
              return (
                <Tooltip key={key} text={model.description}>
                  <button
                    onClick={() => setSelectedAi(key)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400 ${
                      selectedAi === key ? 'bg-cyan-500 text-white shadow-md' : 'text-gray-300 bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <model.icon className={`w-4 h-4 ${selectedAi === key ? 'text-white' : model.color}`} />
                    {model.name}
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </section>

      <div className="my-10 w-full max-w-3xl mx-auto">
        {isLoading && (
            <div className="text-center p-8 bg-gray-800/50 rounded-lg">
              <div className="animate-pulse flex flex-col items-center">
                <BrainIcon className="w-10 h-10 text-cyan-400 mb-4" />
                <p className="text-lg font-semibold text-white">AI is thinking...</p>
                <p className="text-gray-400">Synthesizing information for you.</p>
              </div>
            </div>
        )}
        {!isLoading && searchResult && (searchResult.summary || (searchResult.sources && searchResult.sources.length > 0)) && (
          <div className="space-y-6 animate-fade-in">
            <AiSummary summary={searchResult.summary} sourceAi={searchResult.sourceAi} />
            <Sources sources={searchResult.sources} />
          </div>
        )}
      </div>

      <div className="mt-12 border-t border-gray-700/50">
        <CategorySelector 
          categoryGroups={CATEGORY_GROUPS} 
          onSelect={onCategorySelect} 
        />
      </div>
    </>
  );
};

export default SearchHome;