import React from 'react';
import { AreaBreakdown } from '../types';

interface AreaTableProps {
  areas: AreaBreakdown;
}

const formatNum = (num: number) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(num);

export const AreaTable: React.FC<AreaTableProps> = ({ areas }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
        <h3 className="font-semibold text-slate-700">Chi tiết Diện tích Quy đổi</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 font-medium">Hạng mục</th>
              <th className="px-4 py-3 font-medium text-right">Diện tích (m²)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3">Diện tích Đất (Rộng x Dài)</td>
              <td className="px-4 py-3 text-right font-medium">{formatNum(areas.landArea)} m²</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Móng (Theo %)</td>
              <td className="px-4 py-3 text-right">{formatNum(areas.foundationArea)} m²</td>
            </tr>
            {areas.basementArea > 0 && (
              <tr>
                <td className="px-4 py-3">Tầng Hầm (Theo %)</td>
                <td className="px-4 py-3 text-right">{formatNum(areas.basementArea)} m²</td>
              </tr>
            )}
            <tr>
              <td className="px-4 py-3">Thân (Trệt + Lầu)</td>
              <td className="px-4 py-3 text-right">{formatNum(areas.mainFloorArea)} m²</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Mái & Tum</td>
              <td className="px-4 py-3 text-right">{formatNum(areas.roofTumArea)} m²</td>
            </tr>
            <tr className="bg-slate-50">
              <td className="px-4 py-3 font-bold text-slate-800">TỔNG DIỆN TÍCH QUY ĐỔI</td>
              <td className="px-4 py-3 text-right font-bold text-slate-800 text-base">
                {formatNum(areas.totalConvertedArea)} m²
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};