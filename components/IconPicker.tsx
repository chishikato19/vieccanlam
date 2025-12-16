
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Smile } from 'lucide-react';

const IconPicker = ({ icons, selected, onSelect }: { icons: string[], selected: string, onSelect: (icon: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="relative flex items-center gap-1" ref={wrapperRef}>
      {/* Input Field: Allows typing or pasting directly */}
      <div className="relative group">
          <input 
            type="text"
            value={selected}
            onChange={(e) => onSelect(e.target.value)}
            className="w-12 h-12 rounded-xl border border-slate-200 text-center text-2xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white shadow-sm"
            placeholder="?"
            title="Nhập hoặc dán biểu tượng vào đây"
          />
      </div>

      {/* Button to toggle list */}
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-8 h-12 flex items-center justify-center rounded-xl border border-transparent hover:bg-slate-100 text-slate-400 transition-all active:scale-95 ${isOpen ? 'bg-slate-100 text-blue-500' : ''}`}
        title="Chọn từ danh sách"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
      
      {isOpen && (
        <div className="absolute top-14 left-0 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-pop">
           <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 text-slate-500 text-xs font-bold">
              <Smile className="w-3 h-3" />
              <span>Gợi ý biểu tượng</span>
           </div>
          <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
            {icons.map((icon, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { onSelect(icon); setIsOpen(false); }}
                className={`w-9 h-9 flex items-center justify-center text-xl rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 ${selected === icon ? 'bg-blue-50 border-blue-200' : ''}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconPicker;
