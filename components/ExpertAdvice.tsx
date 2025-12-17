import React, { useState } from 'react';
import { Sparkles, X, Loader2, Send, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { InputData, AreaBreakdown } from '../types';

interface ExpertAdviceProps {
  data: InputData;
  areas: AreaBreakdown;
}

export const ExpertAdvice: React.FC<ExpertAdviceProps> = ({ data, areas }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const generateAdvice = async () => {
    setIsLoading(true);
    setIsOpen(true);
    setAdvice(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Bạn là một Kỹ sư xây dựng và chuyên gia QS (Quantity Surveyor) dày dặn kinh nghiệm tại Việt Nam. 
        Hãy phân tích thông số công trình sau và đưa ra lời khuyên chuyên gia:
        - Kích thước: ${data.width}m x ${data.length}m (Diện tích đất: ${areas.landArea}m2)
        - Quy mô: ${data.floors} tầng lầu + ${data.hasTum ? '1 Tum' : 'Không tum'}
        - Kết cấu: ${data.foundation}, ${data.basement}, ${data.roof}
        - Vị trí: ${data.facades}, đường rộng ${data.road}, ${data.neighbors}
        - Tiện ích: ${data.hasElevator ? `Thang máy (${data.elevatorStops} điểm dừng)` : 'Không thang máy'}, ${data.hasPool ? `Hồ bơi (${data.poolArea}m2)` : 'Không hồ bơi'}

        Yêu cầu câu trả lời:
        1. Ngôn ngữ: Tiếng Việt, chuyên nghiệp nhưng dễ hiểu.
        2. Cấu trúc: 
           - Nhận xét nhanh về quy mô.
           - 3 mẹo cụ thể để tiết kiệm chi phí cho cấu trúc này.
           - 2 lưu ý kỹ thuật quan trọng (đặc biệt là phần móng và mái đã chọn).
           - 1 lời khuyên về tối ưu không gian dựa trên chiều rộng ${data.width}m.
        3. Định dạng: Sử dụng Markdown (bullet points, bold text).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAdvice(response.text || "Xin lỗi, AI đang bận. Vui lòng thử lại sau.");
    } catch (error) {
      console.error("AI Error:", error);
      setAdvice("Đã có lỗi xảy ra khi kết nối với AI. Vui lòng kiểm tra lại kết nối mạng.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Banner Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-lg text-white mb-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <Sparkles size={80} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-4 items-start">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Send className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                Lời khuyên từ AI Chuyên Gia
              </h3>
              <p className="text-blue-100 text-sm mt-1 max-w-md">
                Nhấn "Nhận lời khuyên" để AI phân tích cấu trúc nhà của bạn và đưa ra các mẹo tiết kiệm chi phí & lưu ý kỹ thuật.
              </p>
            </div>
          </div>
          
          <button 
            onClick={generateAdvice}
            disabled={isLoading}
            className="bg-white text-blue-700 px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-70 whitespace-nowrap"
          >
            {isLoading ? 'Đang phân tích...' : 'Nhận lời khuyên'}
          </button>
        </div>
      </div>

      {/* Modal Result */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles size={20} />
                <h3 className="font-bold">Tư vấn từ Kỹ sư AI</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="text-blue-600 animate-spin" size={48} />
                  <div className="text-center">
                    <p className="font-medium text-slate-700">AI đang phân tích cấu trúc nhà của bạn...</p>
                    <p className="text-sm text-slate-500">Quá trình này có thể mất vài giây</p>
                  </div>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none prose-headings:text-blue-700 prose-strong:text-slate-900 prose-p:text-slate-600">
                  <div className="space-y-4">
                    {/* Render basic markdown-like blocks manually for better UI */}
                    {advice?.split('\n').map((line, i) => {
                      if (line.startsWith('#')) return <h4 key={i} className="text-lg font-bold text-blue-700 mt-4 mb-2">{line.replace(/#/g, '').trim()}</h4>;
                      if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
                        return (
                          <div key={i} className="flex gap-3 items-start ml-2 py-1">
                            <CheckCircle size={16} className="text-green-500 mt-1 shrink-0" />
                            <p className="text-slate-700 text-sm m-0">{line.replace(/^[-*]\s*/, '').trim()}</p>
                          </div>
                        );
                      }
                      if (line.trim() === '') return <div key={i} className="h-2" />;
                      return <p key={i} className="text-slate-600 text-sm leading-relaxed">{line}</p>;
                    })}
                  </div>
                  
                  <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="flex gap-3">
                      <Info className="text-blue-600 shrink-0" size={18} />
                      <p className="text-xs text-blue-800 italic">
                        Lời khuyên này được tạo bởi AI dựa trên các tiêu chuẩn xây dựng phổ biến. 
                        Bạn nên tham khảo thêm ý kiến từ kiến trúc sư trực tiếp thiết kế cho hồ sơ của mình.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};