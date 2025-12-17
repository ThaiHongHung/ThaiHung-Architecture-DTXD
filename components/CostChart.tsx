import React from 'react';
import { AreaBreakdown } from '../types';

interface CostChartProps {
  areas: AreaBreakdown;
}

export const CostChart: React.FC<CostChartProps> = ({ areas }) => {
  const { foundationArea, basementArea, mainFloorArea, roofTumArea, totalConvertedArea } = areas;

  // Grouping areas for the chart
  const foundationTotal = foundationArea + basementArea;
  const floorsTotal = mainFloorArea;
  const roofTotal = roofTumArea;

  const segments = [
    { label: 'Sàn các tầng', value: floorsTotal, color: '#10b981', textColor: 'text-emerald-600' },
    { label: 'Móng', value: foundationTotal, color: '#3b82f6', textColor: 'text-blue-600' },
    { label: 'Mái', value: roofTotal, color: '#f59e0b', textColor: 'text-amber-600' },
  ];

  // Calculate percentages and angles
  let cumulativePercent = 0;
  const chartData = segments.map(s => {
    const percent = (s.value / totalConvertedArea) * 100;
    const startPercent = cumulativePercent;
    cumulativePercent += percent;
    return { ...s, percent, startPercent };
  });

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
      <h3 className="font-semibold text-slate-700 mb-6 self-start">Phân bổ tỷ trọng diện tích</h3>
      
      <div className="relative w-48 h-48 md:w-56 md:h-56">
        <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">
          {chartData.map((slice, i) => {
            const [startX, startY] = getCoordinatesForPercent(slice.startPercent / 100);
            const [endX, endY] = getCoordinatesForPercent((slice.startPercent + slice.percent) / 100);
            const largeArcFlag = slice.percent > 50 ? 1 : 0;
            const pathData = [
              `M ${startX} ${startY}`,
              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `L 0 0`,
            ].join(' ');

            return (
              <path
                key={i}
                d={pathData}
                fill={slice.color}
                className="transition-all duration-500 hover:opacity-80 cursor-default"
              />
            );
          })}
          {/* Inner Circle to make it a donut */}
          <circle cx="0" cy="0" r="0.65" fill="white" />
          
          {/* Center text */}
          <text 
            x="0" 
            y="0" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            className="font-bold text-[0.2px] fill-slate-800 rotate-90"
            style={{ fontSize: '0.22px' }}
          >
            100%
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full">
        {chartData.map((slice, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: slice.color }}></div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{slice.label}</span>
            </div>
            <span className={`text-lg font-bold ${slice.textColor}`}>
              {slice.percent.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};