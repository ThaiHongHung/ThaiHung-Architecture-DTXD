
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, Ruler, Warehouse, Hammer, ArrowUpFromLine, 
  MapPin, CheckSquare, Settings2, Calculator, Upload, Coins,
  ChevronUp, ChevronDown
} from 'lucide-react';

import { BasementType, FacadeCount, FoundationType, InputData, NeighborType, RoadWidth, RoofType, PriceConfig } from './types';
import { calculateAreas, calculateCosts } from './utils/calculator';
import { AreaTable } from './components/AreaTable';
import { PriceCard } from './components/PriceCard';
import { ExpertAdvice } from './components/ExpertAdvice';
import { CostChart } from './components/CostChart';
import { BASE_PRICE } from './constants';

function App() {
  // State initialization
  const [data, setData] = useState<InputData>({
    width: 5,
    length: 20,
    floors: 2,
    basement: BasementType.NONE,
    foundation: FoundationType.PILE,
    hasTum: false,
    tumArea: 20,
    roof: RoofType.CONCRETE,
    facades: FacadeCount.ONE,
    road: RoadWidth.MEDIUM,
    neighbors: NeighborType.FULL,
    hasElevator: false,
    elevatorStops: 3,
    hasPool: false,
    poolArea: 25
  });

  const [prices, setPrices] = useState<PriceConfig>(BASE_PRICE);

  // Initialize customLogo from localStorage if available
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('thaihung_app_logo');
    } catch (e) {
      console.warn('Cannot access localStorage', e);
      return null;
    }
  });

  // Derived state calculations
  const areas = useMemo(() => calculateAreas(data), [data]);
  const packages = useMemo(() => calculateCosts(data, areas, prices), [data, areas, prices]);

  const handleChange = (field: keyof InputData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (field: keyof PriceConfig, value: number) => {
    setPrices(prev => ({ ...prev, [field]: Math.max(0, value) }));
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: keyof PriceConfig) => {
    const step = 100000; // Bước nhảy 100k
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handlePriceChange(field, prices[field] + step);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handlePriceChange(field, prices[field] - step);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Basic size check (approx 2MB limit for safety in localStorage)
      if (file.size > 2 * 1024 * 1024) {
        alert("File ảnh quá lớn để lưu trữ (Giới hạn < 2MB). Vui lòng chọn ảnh nhỏ hơn.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        try {
          localStorage.setItem('thaihung_app_logo', base64String);
          setCustomLogo(base64String);
        } catch (e) {
          console.error("Error saving to localStorage", e);
          alert("Không thể lưu logo vào bộ nhớ trình duyệt.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper for formatting inputs
  const formatPriceInput = (val: number) => new Intl.NumberFormat('vi-VN').format(val);
  const parsePriceInput = (val: string) => Number(val.replace(/\D/g, ''));

  // Price Stepper Component to avoid code duplication
  const PriceInputWithStepper = ({ 
    label, 
    value, 
    onValueChange, 
    onKeyDown,
    field 
  }: { 
    label: string, 
    value: number, 
    onValueChange: (v: number) => void,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    field: keyof PriceConfig
  }) => {
    const step = 100000;
    return (
      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-500">{label}</label>
        <div className="relative group">
          <input 
            type="text" 
            value={formatPriceInput(value)} 
            onChange={(e) => onValueChange(parsePriceInput(e.target.value))}
            onKeyDown={onKeyDown}
            className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white font-mono font-medium"
          />
          <div className="absolute right-0 inset-y-0 flex flex-col border-l border-slate-200 overflow-hidden rounded-r-lg">
            <button 
              type="button"
              onClick={() => onValueChange(value + step)}
              className="flex-1 px-2 hover:bg-slate-100 flex items-center justify-center transition-colors border-b border-slate-100"
              title="Tăng 100.000đ"
            >
              <ChevronUp size={14} className="text-slate-500 group-hover:text-blue-600" />
            </button>
            <button 
              type="button"
              onClick={() => onValueChange(value - step)}
              className="flex-1 px-2 hover:bg-slate-100 flex items-center justify-center transition-colors"
              title="Giảm 100.000đ"
            >
              <ChevronDown size={14} className="text-slate-500 group-hover:text-red-600" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <input 
                type="file" 
                id="logo-upload" 
                className="hidden" 
                accept="image/*"
                onChange={handleLogoUpload}
              />
              <label 
                htmlFor="logo-upload" 
                className="block h-10 w-10 relative flex-shrink-0 cursor-pointer rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all"
                title="Nhấn để thay đổi logo (Tự động lưu)"
              >
                {customLogo ? (
                  <img src={customLogo} alt="Custom Logo" className="w-full h-full object-contain" />
                ) : (
                  <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 45 L50 10 L90 45" stroke="#4b5563" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M28 25 V85" stroke="#4b5563" strokeWidth="8" strokeLinecap="round"/>
                    <path d="M72 25 V85" stroke="#4b5563" strokeWidth="8" strokeLinecap="round"/>
                    <circle cx="50" cy="55" r="16" fill="#ef4444" />
                    <path d="M35 92 H65" stroke="#4b5563" strokeWidth="8" strokeLinecap="round"/>
                  </svg>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="text-white w-4 h-4" />
                </div>
              </label>
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">ThaiHung Architecture AI</h1>
              <p className="text-xs text-slate-500">Tính Dự Toán Xây Dựng _ SĐT: 0969431010</p>
            </div>
          </div>
          <a 
            href="#" 
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-full transition-colors hidden sm:block"
          >
            Liên hệ tư vấn
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Kích thước & Quy mô */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                <Ruler size={18} className="text-blue-600" />
                <h2 className="font-semibold text-slate-700">Thông số & Quy mô</h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Rộng (m)</label>
                    <input 
                      type="number" 
                      value={data.width} 
                      onChange={(e) => handleChange('width', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Dài (m)</label>
                    <input 
                      type="number" 
                      value={data.length} 
                      onChange={(e) => handleChange('length', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Số tầng lầu (Không tính trệt/hầm/tum)</label>
                  <input 
                    type="number" 
                    min={1}
                    value={data.floors} 
                    onChange={(e) => handleChange('floors', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 2. Kết cấu (Móng, Hầm) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                <Warehouse size={18} className="text-blue-600" />
                <h2 className="font-semibold text-slate-700">Kết cấu ngầm</h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Loại Móng</label>
                  <select 
                    value={data.foundation}
                    onChange={(e) => handleChange('foundation', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {Object.values(FoundationType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Tầng Hầm</label>
                  <select 
                    value={data.basement}
                    onChange={(e) => handleChange('basement', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {Object.values(BasementType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Mái & Tum */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                <ArrowUpFromLine size={18} className="text-blue-600" />
                <h2 className="font-semibold text-slate-700">Mái & Tum che thang</h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-sm font-medium">Có Tum không?</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={data.hasTum} onChange={(e) => handleChange('hasTum', e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {data.hasTum && (
                   <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Diện tích Tum (m²)</label>
                    <input 
                      type="number" 
                      value={data.tumArea} 
                      onChange={(e) => handleChange('tumArea', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Kết cấu Mái</label>
                  <select 
                    value={data.roof}
                    onChange={(e) => handleChange('roof', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {Object.values(RoofType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Vị trí & Tiện ích */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                <MapPin size={18} className="text-blue-600" />
                <h2 className="font-semibold text-slate-700">Vị trí & Tiện ích</h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                   <select 
                    value={data.facades}
                    onChange={(e) => handleChange('facades', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    {Object.values(FacadeCount).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                   <select 
                    value={data.road}
                    onChange={(e) => handleChange('road', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    {Object.values(RoadWidth).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                   <select 
                    value={data.neighbors}
                    onChange={(e) => handleChange('neighbors', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    {Object.values(NeighborType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="h-px bg-slate-100 my-4"></div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="elevator"
                      checked={data.hasElevator} 
                      onChange={(e) => handleChange('hasElevator', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="elevator" className="text-sm font-medium text-slate-700">Thang máy</label>
                  </div>
                  {data.hasElevator && (
                     <div className="ml-7 animate-in fade-in slide-in-from-top-1">
                      <label className="block text-xs text-slate-500 mb-1">Số điểm dừng (Stop)</label>
                      <input 
                        type="number" 
                        min={1}
                        value={data.elevatorStops} 
                        onChange={(e) => handleChange('elevatorStops', Number(e.target.value))}
                        className="w-24 px-2 py-1 border border-slate-300 rounded text-sm bg-white"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="pool"
                      checked={data.hasPool} 
                      onChange={(e) => handleChange('hasPool', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="pool" className="text-sm font-medium text-slate-700">Hồ bơi</label>
                  </div>
                  {data.hasPool && (
                     <div className="ml-7 animate-in fade-in slide-in-from-top-1">
                      <label className="block text-xs text-slate-500 mb-1">Diện tích hồ (m²)</label>
                      <input 
                        type="number" 
                        value={data.poolArea} 
                        onChange={(e) => handleChange('poolArea', Number(e.target.value))}
                        className="w-24 px-2 py-1 border border-slate-300 rounded text-sm bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 5. Cấu hình Đơn giá với Phím điều chỉnh */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                <Coins size={18} className="text-blue-600" />
                <h2 className="font-semibold text-slate-700">Cấu hình Đơn giá cơ sở</h2>
              </div>
              <div className="p-4 space-y-4">
                <PriceInputWithStepper 
                  label="Gói Tiết Kiệm (VNĐ/m²)"
                  value={prices.ECO}
                  onValueChange={(v) => handlePriceChange('ECO', v)}
                  onKeyDown={(e) => handlePriceKeyDown(e, 'ECO')}
                  field="ECO"
                />
                <PriceInputWithStepper 
                  label="Gói Phổ Thông (VNĐ/m²)"
                  value={prices.STD}
                  onValueChange={(v) => handlePriceChange('STD', v)}
                  onKeyDown={(e) => handlePriceKeyDown(e, 'STD')}
                  field="STD"
                />
                <PriceInputWithStepper 
                  label="Gói Cao Cấp (VNĐ/m²)"
                  value={prices.LUX}
                  onValueChange={(v) => handlePriceChange('LUX', v)}
                  onKeyDown={(e) => handlePriceKeyDown(e, 'LUX')}
                  field="LUX"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Comparison */}
          <div className="lg:col-span-7 mt-8 lg:mt-0 flex flex-col h-full">
            <div className="bg-blue-900 text-white p-4 rounded-xl shadow-lg mb-6 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Kết quả Dự toán</h3>
                <p className="text-blue-200 text-sm">Cập nhật theo thời gian thực</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-blue-300 block uppercase tracking-wider">Hệ số điều chỉnh (K)</span>
                <span className="font-mono font-bold text-xl">{packages[0].kFactor.toFixed(3)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-stretch">
              {packages.map((pkg) => (
                <PriceCard key={pkg.packageType} data={pkg} />
              ))}
            </div>

            <ExpertAdvice data={data} areas={areas} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <CostChart areas={areas} />
              <AreaTable areas={areas} />
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-800">
              <div className="flex items-start gap-3">
                <Hammer className="shrink-0 mt-0.5" size={16} />
                <p>
                  <strong>Lưu ý:</strong> Bảng báo giá trên chỉ mang tính chất tham khảo dựa trên thuật toán ước lượng.
                  Chi phí thực tế có thể thay đổi tùy thuộc vào điều kiện thi công cụ thể, chủng loại vật tư chi tiết và thời điểm khởi công.
                  Vui lòng liên hệ để có bảng dự toán BOQ chính xác nhất.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
