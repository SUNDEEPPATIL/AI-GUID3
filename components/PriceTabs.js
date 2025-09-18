import { jsx as _jsx } from "react/jsx-runtime";
import Tooltip from './Tooltip';
const PriceTabs = ({ priceRanges, selectedKey, onSelect, controlsId }) => {
    return (_jsx("div", { role: "tablist", "aria-label": "Price range filters", className: "flex flex-wrap gap-2", children: priceRanges.map((range) => (_jsx(Tooltip, { text: `Filter by price: ${range.label}`, children: _jsx("button", { role: "tab", "aria-selected": selectedKey === range.key, "aria-controls": controlsId, onClick: () => onSelect(range), className: `px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400
              ${selectedKey === range.key
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`, children: range.label }) }, range.key))) }));
};
export default PriceTabs;
