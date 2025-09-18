import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (_jsxs("div", { className: "bg-gray-700 text-white p-2 rounded-md border border-gray-600", children: [_jsx("p", { className: "font-bold", children: label }), _jsx("p", { className: "text-cyan-300", children: `Score: ${payload[0].value.toLocaleString()}` })] }));
    }
    return null;
};
const ScoreChart = ({ data }) => {
    // Use a log scale for Y-axis if scores are vastly different, e.g., Antutu vs DXO
    const scoreValues = data.map(d => d.score);
    const maxScore = Math.max(...scoreValues);
    const minScore = Math.min(...scoreValues);
    const useLogScale = maxScore / minScore > 100; // Heuristic for log scale
    return (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: data, margin: { top: 5, right: 20, left: 20, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#4a5568" }), _jsx(XAxis, { dataKey: "name", stroke: "#a0aec0", fontSize: 12 }), _jsx(YAxis, { scale: useLogScale ? "log" : "auto", domain: useLogScale ? ['dataMin', 'dataMax'] : [0, 'dataMax'], allowDataOverflow: true, stroke: "#a0aec0", fontSize: 10, tickFormatter: (tick) => tick.toLocaleString() }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}), cursor: { fill: 'rgba(107, 114, 128, 0.2)' } }), _jsx(Bar, { dataKey: "score", radius: [4, 4, 0, 0] })] }) }));
};
export default ScoreChart;
