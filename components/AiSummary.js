import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AI_MODELS_INFO } from '../constants';
const AiSummary = ({ summary, sourceAi }) => {
    if (!summary)
        return null;
    const { name, icon: Icon, color } = AI_MODELS_INFO[sourceAi] || AI_MODELS_INFO.gemini;
    return (_jsxs("div", { children: [_jsxs("h3", { className: `text-lg font-semibold text-white mb-3 flex items-center gap-2`, children: [_jsx(Icon, { className: `w-6 h-6 ${color}` }), name, "-Generated Answer"] }), _jsx("div", { className: "prose prose-invert prose-p:my-2 max-w-none text-gray-300 bg-gray-800/50 p-4 rounded-lg border border-gray-700/50", children: _jsx("p", { children: summary }) })] }));
};
export default AiSummary;
