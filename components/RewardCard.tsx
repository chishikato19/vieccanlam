
import React from 'react';
import { Coins, Trash2, Pencil } from 'lucide-react';
import { Reward, UserData } from '../types';

const RewardCard: React.FC<{ 
  reward: Reward; 
  user: UserData; 
  onAction: (r: Reward) => void;
  isParentMode?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (r: Reward) => void;
}> = ({ reward, user, onAction, isParentMode, onDelete, onEdit }) => {
  const isOwned = user?.inventory?.includes(reward.id) || false;
  const canAfford = (user?.balance || 0) >= reward.cost;
  
  let buttonText = "Đổi quà";
  let buttonClass = "";
  let isDisabled = false;

  if (isParentMode) {
    buttonText = "Chỉnh sửa";
    isDisabled = true;
  } else {
    if (reward.type === 'avatar' || reward.type === 'frame') {
       if (isOwned) {
         buttonText = "Đã sở hữu";
         isDisabled = true;
         buttonClass = "bg-green-100 text-green-600";
       } else if (canAfford) {
         buttonText = "Mua ngay";
         buttonClass = "bg-yellow-400 text-yellow-900 shadow-yellow-200 shadow-lg hover:bg-yellow-300";
       } else {
         buttonText = "Thiếu xu";
         isDisabled = true;
         buttonClass = "bg-slate-100 text-slate-400";
       }
    } else {
       if (canAfford) {
         buttonText = "Đổi quà";
         buttonClass = "bg-yellow-400 text-yellow-900 shadow-yellow-200 shadow-lg hover:bg-yellow-300";
       } else {
         buttonText = "Thiếu xu";
         isDisabled = true;
         buttonClass = "bg-slate-100 text-slate-400";
       }
    }
  }

  return (
    <div className="bg-white rounded-2xl p-3 border-2 border-slate-100 shadow-md flex flex-col items-center text-center relative overflow-hidden group">
      {isParentMode && (
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          {onEdit && (
             <button 
              onClick={() => onEdit(reward)}
              className="p-1.5 bg-blue-100 text-blue-500 rounded-full hover:bg-blue-200"
            >
              <Pencil className="w-3 h-3" />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(reward.id)}
              className="p-1.5 bg-red-100 text-red-500 rounded-full hover:bg-red-200"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      <div className="w-full aspect-square bg-gradient-to-br from-indigo-50 to-pink-50 rounded-xl mb-3 flex items-center justify-center text-5xl relative">
        <div className="transform group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
           {reward.image}
        </div>
        {(reward.type === 'avatar' || reward.type === 'frame') && (
          <div className="absolute top-1 left-1 bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
            {reward.type === 'avatar' ? 'Avatar' : 'Khung'}
          </div>
        )}
      </div>
      
      <h3 className="font-bold text-slate-700 text-sm mb-1 leading-tight min-h-[2.5rem] flex items-center justify-center">
        {reward.title}
      </h3>
      
      {!isParentMode && !isOwned && (
         <div className="text-xs font-bold text-yellow-600 mb-2 flex items-center gap-1">
            <Coins className="w-3 h-3" /> {reward.cost}
         </div>
      )}

      {!isParentMode && (
        <button
          onClick={() => onAction(reward)}
          disabled={isDisabled}
          className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95 ${buttonClass}`}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default RewardCard;
