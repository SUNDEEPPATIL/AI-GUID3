
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ChartData {
  name: string;
  score: number;
  fill: string;
}

interface ScoreChartProps {
  data: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700 text-white p-2 rounded-md border border-gray-600">
        <p className="font-bold">{label}</p>
        <p className="text-cyan-300">{`Score: ${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }

  return null;
};


const ScoreChart: React.FC<ScoreChartProps> = ({ data }) => {
  // Use a log scale for Y-axis if scores are vastly different, e.g., Antutu vs DXO
  const scoreValues = data.map(d => d.score);
  const maxScore = Math.max(...scoreValues);
  const minScore = Math.min(...scoreValues);
  const useLogScale = maxScore / minScore > 100; // Heuristic for log scale

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
        <XAxis dataKey="name" stroke="#a0aec0" fontSize={12} />
        <YAxis 
          scale={useLogScale ? "log" : "auto"} 
          domain={useLogScale ? ['dataMin', 'dataMax'] : [0, 'dataMax']}
          allowDataOverflow={true}
          stroke="#a0aec0" 
          fontSize={10} 
          tickFormatter={(tick) => tick.toLocaleString()}
        />
        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(107, 114, 128, 0.2)'}} />
        <Bar dataKey="score" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ScoreChart;
