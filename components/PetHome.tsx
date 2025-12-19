
import React, { useState, useEffect } from 'react';
import { Zap, Utensils, X, Coins, Heart, Plus, Trash2, Home } from 'lucide-react';
import { UserData, PetSpecies, FoodItem, Reward } from '../types';
import { FOOD_ITEMS, FRAMES } from '../data';

const PetHome = ({ 
  user, 
  speciesLibrary,
  rewards,
  onFeed,
  onEquip,
  onRemoveItem,
  onAddXp,
  onSwitchPet,
  onAdopt,
  onToggleDecor // Thêm prop để bật tắt nội thất
}: { 
  user: UserData,
  speciesLibrary: Record<string, PetSpecies>,
  rewards: Reward[],
  onFeed: (food: FoodItem) => void,
  onEquip: (type: 'avatar' | 'frame', value: string) => void,
  onRemoveItem: (id: string) => void,
  onAddXp: () => void,
  onSwitchPet: (id: string) => void,
  onAdopt: (speciesId: string) => void,
  onToggleDecor: (decorId: string) => void
}) => {
  const [view, setView] = useState<'pet' | 'room'>('pet');
  const [showFoodMenu, setShowFoodMenu] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [dialogue, setDialogue] = useState<string>('');
  
  const activePet = user.pets.find(p => p.id === user.activePetId) || user.pets[0];
  const species = speciesLibrary[activePet.speciesId] || speciesLibrary['dragon'];
  const currentStage = [...species.stages].reverse().find(s => activePet.level >= s.minLevel) || species.stages[0];

  useEffect(() => {
    const msgs = currentStage.dialogue;
    setDialogue(msgs[Math.floor(Math.random() * msgs.length)]);
    const interval = setInterval(() => {
      setDialogue(msgs[Math.floor(Math.random() * msgs.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, [currentStage]);

  const activeDecorItems = rewards.filter(r => user.activeDecors.includes(r.id));

  return (
    <div className="flex flex-col h-full relative">
      {/* TABS PET/ROOM */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
         <button onClick={() => setView('pet')} className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${view === 'pet' ? 'bg-white border-blue-500 shadow-md text-blue-600' : 'bg-white/50 border-white text-slate-500'}`}>🐾 Thú cưng</button>
         <button onClick={() => setView('room')} className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${view === 'room' ? 'bg-white border-purple-500 shadow-md text-purple-600' : 'bg-white/50 border-white text-slate-500'}`}>🏠 Phòng bé</button>
      </div>

      <div className="flex-1 bg-gradient-to-b from-blue-200 to-green-100 rounded-b-[3rem] relative overflow-hidden shadow-inner flex flex-col items-center justify-center pb-24 min-h-[400px]">
         {/* Background Decor */}
         <div className="absolute inset-0 pointer-events-none opacity-40">
            {activeDecorItems.map(d => (
                <div key={d.id} className="absolute text-5xl animate-float" style={{ 
                    top: d.id === 'dec3' ? '10%' : d.id === 'dec4' ? '5%' : 'auto',
                    bottom: d.id === 'dec1' ? '10%' : d.id === 'dec2' ? '5%' : 'auto',
                    left: d.id === 'dec3' ? '10%' : d.id === 'dec5' ? '15%' : 'auto',
                    right: d.id === 'dec4' ? '10%' : 'auto',
                }}>
                    {d.image}
                </div>
            ))}
         </div>

         <div className="absolute top-24 z-10 bg-white px-4 py-2 rounded-2xl rounded-bl-none shadow-lg animate-pop">
            <p className="text-sm font-bold text-slate-700">{dialogue}</p>
         </div>

         <div className="text-[8rem] filter drop-shadow-2xl transition-all duration-500 animate-float relative">
            {currentStage.image}
         </div>

         <div className="bg-white/60 backdrop-blur rounded-2xl p-3 w-full max-w-xs mt-6 border border-white shadow-sm">
            <div className="flex justify-between items-end mb-1">
               <span className="font-bold text-slate-700">{currentStage.name}</span>
               <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Lv {activePet.level}</span>
            </div>
            <div className="relative w-full h-4 bg-slate-200 rounded-full overflow-hidden mb-2">
               <div className="absolute top-0 left-0 h-full bg-green-500 transition-all" style={{ width: `${(activePet.xp / activePet.maxXp) * 100}%` }} />
            </div>
            <div className="flex items-center gap-2">
               <div className="relative flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-orange-400 transition-all" style={{ width: `${activePet.hunger}%` }} />
               </div>
               <span className="text-[9px] font-bold text-slate-500">{Math.floor(activePet.hunger)}%</span>
            </div>
         </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3 -mt-6 z-10">
         <button onClick={() => setShowFoodMenu(true)} className="bg-white p-3 rounded-2xl shadow-lg border-2 border-orange-100 flex items-center gap-2 hover:bg-orange-50 transition-all">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">🍖</div>
            <div className="text-left">
               <p className="font-bold text-slate-700 text-sm">Cho ăn</p>
               <p className="text-[10px] text-slate-400">Tăng XP</p>
            </div>
         </button>

         <button onClick={() => setShowInventory(true)} className="bg-white p-3 rounded-2xl shadow-lg border-2 border-purple-100 flex items-center gap-2 hover:bg-purple-50 transition-all">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl">🎒</div>
            <div className="text-left">
               <p className="font-bold text-slate-700 text-sm">Tủ đồ</p>
               <p className="text-[10px] text-slate-400">Trang trí</p>
            </div>
         </button>
      </div>

      {showFoodMenu && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-30 flex items-end" onClick={() => setShowFoodMenu(false)}>
           <div className="bg-white w-full rounded-t-3xl p-5 animate-pop shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="font-bold text-lg mb-4">Cửa hàng đồ ăn</h3>
              <div className="grid grid-cols-4 gap-2">
                 {FOOD_ITEMS.map(f => (
                    <button key={f.id} onClick={() => onFeed(f)} className="flex flex-col items-center p-2 rounded-xl border border-slate-100 bg-slate-50">
                       <div className="text-3xl mb-1">{f.icon}</div>
                       <div className="text-[10px] font-bold">{f.cost} xu</div>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {showInventory && (
        <div className="absolute inset-0 bg-white z-40 animate-fade-in flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-purple-50">
               <h3 className="font-bold text-lg text-purple-900">Tủ đồ của bé</h3>
               <button onClick={() => setShowInventory(false)} className="bg-white p-2 rounded-full shadow-sm"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-4 space-y-6 overflow-y-auto">
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase mb-3">Đồ trang trí phòng</p>
                   <div className="grid grid-cols-4 gap-3">
                      {rewards.filter(r => r.type === 'decor' && user.inventory.includes(r.id)).map(r => (
                        <button key={r.id} onClick={() => onToggleDecor(r.id)} className={`aspect-square rounded-2xl flex items-center justify-center text-3xl border-2 transition-all ${user.activeDecors.includes(r.id) ? 'bg-purple-100 border-purple-500 shadow-md' : 'bg-slate-50 border-slate-200'}`}>
                           {r.image}
                        </button>
                      ))}
                      {rewards.filter(r => r.type === 'decor' && user.inventory.includes(r.id)).length === 0 && <p className="col-span-4 text-center text-xs text-slate-400 py-4">Bé chưa mua đồ nội thất nào.</p>}
                   </div>
                </div>

                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase mb-3">Avatar</p>
                   <div className="grid grid-cols-4 gap-3">
                      {['🐯', '🐻', '🐰', ...rewards.filter(r => r.type === 'avatar' && user.inventory.includes(r.id)).map(r => r.image)].map((img, i) => (
                        <button key={i} onClick={() => onEquip('avatar', img)} className={`aspect-square rounded-2xl flex items-center justify-center text-3xl border-2 transition-all ${user.activeAvatar === img ? 'bg-blue-100 border-blue-500 shadow-md' : 'bg-slate-50 border-slate-200'}`}>
                           {img}
                        </button>
                      ))}
                   </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PetHome;
