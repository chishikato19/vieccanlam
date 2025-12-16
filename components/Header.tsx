
import React from 'react';
import { Coins, Settings } from 'lucide-react';
import { UserData } from '../types';
import { FRAMES } from '../data';

const Header = ({ 
  user, 
  onOpenSettings,
  onAddMoney 
}: { 
  user: UserData, 
  onOpenSettings: () => void,
  onAddMoney: () => void 
}) => {
  const frameClass = FRAMES[user.activeFrame] || FRAMES['default'];
  
  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-2xl border-2 shadow-inner overflow-hidden ${frameClass}`}>
          {user.activeAvatar}
        </div>
        <div>
          <h1 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Xin chào</h1>
          <p className="text-lg font-black text-slate-800 leading-none">{user.name}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div 
          onClick={onAddMoney}
          className="cursor-pointer flex items-center gap-2 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full shadow-lg transform active:scale-95 transition-transform hover:bg-yellow-300"
          title="Nhấn để nhận xu test!"
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
