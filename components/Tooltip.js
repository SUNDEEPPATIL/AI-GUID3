import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Tooltip = ({ children, text }) => {
    return (_jsxs("div", { className: "relative group flex items-center", children: [children, _jsxs("div", { className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-900 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 border border-gray-700 shadow-lg", children: [text, _jsx("div", { className: "absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-gray-700 transform rotate-45" })] })] }));
};
export default Tooltip;
