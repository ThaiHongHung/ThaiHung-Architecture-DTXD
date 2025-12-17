import React from 'react';
import { CostBreakdown } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface PriceCardProps {
  data: CostBreakdown;
}

const formatCurrency = (val: number) => {
  if (val >= 1000000000) {
    return (val / 1000000000).toFixed(2).replace('.', ',') + ' Tỷ';
  }
  return (val / 1000000).toFixed(0).replace('.', ',') + ' Triệu';
};

const formatCurrencyFull = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

export const PriceCard: React.FC<PriceCardProps> = ({ data }) => {
  const isRec = data.isRecommended;

  // Dynamic styles based on theme
  const styles = {
    gray: {
      border: 'border-slate-200',
      bg: 'bg-white',
      header: 'bg-slate-100 text-slate-700',
      text: 'text-slate-600',
      total: 'text-slate-700',
      ring: 'hover:ring-slate-300'
    },
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-50/30',
      header: 'bg-blue-600 text-white',
      text: 'text-blue-900',
      total: 'text-blue-700',
      ring: 'ring-2 ring-blue-500 shadow-xl scale-[1.02]' // Slight pop for recommended
    },
    amber: {
      border: 'border-yellow-500',
      bg: 'bg-yellow-50/30',
      header: 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white',
      text: 'text-amber-900',
      total: 'text-amber-700',
      ring: 'hover:ring-yellow-300'
    }
  };

  const theme = data.colorTheme as 'gray' | 'blue' | 'amber';
  const s = styles[theme];

  return (
    <div className={`
      relative rounded-2xl border ${s.border} ${s.bg} 
      flex flex-col overflow-hidden transition-all duration-300 
      ${isRec ? s.ring : 'hover:shadow-lg hover:-translate-y-1'}
    `}>
      {isRec && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg shadow-sm z-10">
          KHUYÊN DÙNG
        </div>
      )}

      <div className={`p-4 text-center ${s.header}`}>
        <h3 className="text-lg font-bold uppercase tracking-wider">{data.packageName}</h3>
        <p className="text-sm opacity-90 font-medium">
          Đơn giá: {formatCurrencyFull(data.finalUnitPrice)}/m²
        </p>
      </div>

      <div className="p-6 flex-grow flex flex-col justify-center items-center gap-2">
        <span className={`text-sm font-semibold uppercase ${s.text} opacity-70`}>Tổng chi phí ước tính</span>
        <div className={`text-3xl md:text-4xl font-extrabold tracking-tight ${s.total}`}>
          {formatCurrency(data.totalCost)}
        </div>
        <p className="text-xs text-slate-400 italic">
          ({formatCurrencyFull(data.totalCost)})
        </p>
      </div>

      <div className="px-6 pb-6 pt-0 space-y-2">
        <div className="h-px bg-current opacity-10 mb-4"></div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500">Phần xây dựng</span>
          <span className="font-medium">{formatCurrency(data.constructionCost)}</span>
        </div>
        {data.elevatorCost > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Thang máy</span>
            <span className="font-medium text-slate-700">+ {formatCurrency(data.elevatorCost)}</span>
          </div>
        )}
        {data.poolCost > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Hồ bơi</span>
            <span className="font-medium text-slate-700">+ {formatCurrency(data.poolCost)}</span>
          </div>
        )}
      </div>
      
      {isRec && (
         <div className="bg-blue-500/10 p-2 flex justify-center items-center gap-2 text-xs font-semibold text-blue-700">
           <CheckCircle2 size={14} /> Phù hợp đại đa số nhu cầu
         </div>
      )}
    </div>
  );
};