
import React, { useState } from 'react';

const IconPicker = ({ icons, selected, onSelect }: { icons: string[], selected: string, onSelect: (icon: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-xl border-2 border-slate-200 flex items-center justify-center text-2xl bg-white hover:border-blue-300"
      >
        {selected}
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-14 left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-20 grid grid-cols-5 gap-2 animate-pop">
            {icons.map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => { onSelect(icon); setIsOpen(false); }}
                className={`w-10 h-10 flex items-center justify-center text-xl rounded hover:bg-slate-100 ${selected === icon ? 'bg-blue-100' : ''}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default IconPicker;
