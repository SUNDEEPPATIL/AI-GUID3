import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import LinkIcon from './icons/LinkIcon';
import Tooltip from './Tooltip';
const Sources = ({ sources }) => {
    // FIX: Filter out sources without a URI or title, as they are not useful to display.
    const validSources = sources?.filter(source => source.web?.uri && source.web?.title);
    if (!validSources || validSources.length === 0) {
        return null;
    }
    return (_jsxs("div", { className: "mt-6", children: [_jsxs("h3", { className: "text-lg font-semibold text-white mb-3 flex items-center gap-2", children: [_jsx(LinkIcon, { className: "w-5 h-5 text-cyan-400" }), "Sources"] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: validSources.map((source, index) => (_jsx(Tooltip, { text: "Opens source in a new tab", children: _jsxs("a", { href: source.web.uri, target: "_blank", rel: "noopener noreferrer", className: "block p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-700/80 transition-colors", children: [_jsx("p", { className: "text-sm font-medium text-cyan-400 truncate", children: source.web.title }), _jsx("p", { className: "text-xs text-gray-500 truncate", children: source.web.uri })] }) }, index))) })] }));
};
export default Sources;
