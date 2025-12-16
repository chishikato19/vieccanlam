
import React from 'react';
import { Coins, Settings, Cloud, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserData } from '../types';
import { FRAMES } from '../data';

const Header = ({ 
  user, 
  onOpenSettings,
  onAddMoney,
  saveStatus 
}: { 
  user: UserData, 
  onOpenSettings: () => void,
  onAddMoney: () => void,
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
}) => {
  const frameClass = FRAMES[user.activeFrame] || FRAMES['default'];
  
  // Render icon trạng thái lưu
  const renderSaveStatus = () => {
    if (!user.googleScriptUrl) return null; // Chưa cấu hình thì không hiện

    switch (saveStatus) {
      case 'saving':
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'saved':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Cloud className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-2xl border-2 shadow-inner overflow-hidden ${frameClass}`}>
          {user.activeAvatar}
        </div>
        <div>
          <div className="flex items-center gap-2">
             <h1 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Xin chào</h1>
             {renderSaveStatus()}
          </div>
          <p className="text-lg font-black text-slate-800 leading-none">{user.name}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div 
          onClick={() => user.isTestingMode && onAddMoney()}
          className={`cursor-pointer flex items-center gap-2 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full shadow-lg transform active:scale-95 transition-transform hover:bg-yellow-300 ${!user.isTestingMode ? 'pointer-events-none' : ''}`}
          title={user.isTestingMode ? "Nhấn để nhận xu test!" : "Xu tích lũy"}
        >
          <Coins className="w-4 h-4 fill-current animate-float" />
          <span className="text-lg font-black">{user.balance}</span>
        </div>
        <button 
          onClick={onOpenSettings}
          className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Header;
