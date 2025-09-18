import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { CATEGORY_GROUPS, AI_MODELS_INFO } from '../constants';
import CategorySelector from './CategorySelector';
import { search } from '../services/geminiService';
import { useToast } from '../ToastContext';
import SearchIcon from './icons/SearchIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';
import AiSummary from './AiSummary';
import Sources from './Sources';
import Tooltip from './Tooltip';
import BrainIcon from './icons/BrainIcon';
const SearchHome = ({ onCategorySelect }) => {
    const [query, setQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAi, setSelectedAi] = useState('gemini');
    const [isListening, setIsListening] = useState(false);
    const { addToast } = useToast();
    const recognitionRef = useRef(null);
    const searchInputRef = useRef(null);
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
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            handleSearch(transcript);
        };
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'no-speech' || event.error === 'audio-capture') {
                addToast('No speech detected or microphone error. Please try again.', 'error');
            }
            else {
                addToast(`Voice search error: ${event.error}`, 'error');
            }
        };
        recognition.onend = () => {
            setIsListening(false);
        };
        recognitionRef.current = recognition;
    }, [addToast]);
    const handleSearch = async (searchQuery) => {
        if (!searchQuery.trim())
            return;
        setIsLoading(true);
        setSearchResult(null);
        try {
            const result = await search(searchQuery, selectedAi);
            setSearchResult(result);
        }
        catch (err) {
            addToast(err.message, 'error');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch(query);
        }
    };
    const handleVoiceSearch = () => {
        if (isListening || !recognitionRef.current)
            return;
        setIsListening(true);
        try {
            recognitionRef.current.start();
        }
        catch (error) {
            console.error("Could not start voice recognition: ", error);
            addToast("Could not start voice recognition. Please ensure microphone permissions are enabled.", "error");
            setIsListening(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("section", { className: "flex flex-col items-center justify-center pt-10 md:pt-12 text-center", children: [_jsx("h2", { className: "text-4xl md:text-5xl font-extrabold text-white tracking-tight", children: "Gadget Questions?" }), _jsx("p", { className: "mt-4 text-lg text-gray-400 max-w-xl mx-auto", children: "Ask our AI anything about gadgets. Get instant, synthesized answers from across the web." }), _jsxs("div", { className: "mt-8 w-full max-w-2xl", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(SearchIcon, { className: "w-5 h-5 text-gray-400" }) }), _jsx("input", { ref: searchInputRef, type: "search", value: query, onChange: (e) => setQuery(e.target.value), onKeyDown: handleKeyDown, placeholder: "e.g., Best gaming phone under \u20B930,000?", className: "w-full pl-12 pr-24 py-4 bg-gray-800 border border-gray-700/50 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow" }), _jsx("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center gap-2", children: _jsx(Tooltip, { text: "Search with voice", children: _jsx("button", { onClick: handleVoiceSearch, disabled: !recognitionRef.current, className: `p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/50 text-white animate-pulse' : 'hover:bg-gray-700 text-gray-400'}`, children: _jsx(MicrophoneIcon, { className: "w-5 h-5" }) }) }) })] }), _jsxs("div", { className: "flex items-center justify-center gap-2 mt-6", children: [_jsx("span", { className: "text-sm text-gray-400 font-medium", children: "Answer with:" }), Object.keys(AI_MODELS_INFO).map((key) => {
                                        const model = AI_MODELS_INFO[key];
                                        return (_jsx(Tooltip, { text: model.description, children: _jsxs("button", { onClick: () => setSelectedAi(key), className: `flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400 ${selectedAi === key ? 'bg-cyan-500 text-white shadow-md' : 'text-gray-300 bg-gray-800 hover:bg-gray-700'}`, children: [_jsx(model.icon, { className: `w-4 h-4 ${selectedAi === key ? 'text-white' : model.color}` }), model.name] }) }, key));
                                    })] })] })] }), _jsxs("div", { className: "my-10 w-full max-w-3xl mx-auto", children: [isLoading && (_jsx("div", { className: "text-center p-8 bg-gray-800/50 rounded-lg", children: _jsxs("div", { className: "animate-pulse flex flex-col items-center", children: [_jsx(BrainIcon, { className: "w-10 h-10 text-cyan-400 mb-4" }), _jsx("p", { className: "text-lg font-semibold text-white", children: "AI is thinking..." }), _jsx("p", { className: "text-gray-400", children: "Synthesizing information for you." })] }) })), !isLoading && searchResult && (searchResult.summary || (searchResult.sources && searchResult.sources.length > 0)) && (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsx(AiSummary, { summary: searchResult.summary, sourceAi: searchResult.sourceAi }), _jsx(Sources, { sources: searchResult.sources })] }))] }), _jsx("div", { className: "mt-12 border-t border-gray-700/50", children: _jsx(CategorySelector, { categoryGroups: CATEGORY_GROUPS, onSelect: onCategorySelect }) })] }));
};
export default SearchHome;
