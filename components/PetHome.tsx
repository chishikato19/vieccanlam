
import React, { useState, useEffect } from 'react';
import { Zap, Utensils, X, Coins, Heart, Plus } from 'lucide-react';
import { UserData, PetSpecies, FoodItem } from '../types';
import { FOOD_ITEMS, FRAMES, INITIAL_REWARDS } from '../data';

const PetHome = ({ 
  user, 
  speciesLibrary,
  onFeed,
  onEquip,
  onAddXp,
  onSwitchPet,
  onAdopt
}: { 
  user: UserData,
  speciesLibrary: Record<string, PetSpecies>,
  onFeed: (food: FoodItem) => void,
  onEquip: (type: 'avatar' | 'frame', value: string) => void,
  onAddXp: () => void,
  onSwitchPet: (id: string) => void,
  onAdopt: (speciesId: string) => void
}) => {
  const [showFoodMenu, setShowFoodMenu] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showAdoptMenu, setShowAdoptMenu] = useState(false);
  const [dialogue, setDialogue] = useState<string>('');
  
  const activePet = user.pets.find(p => p.id === user.activePetId) || user.pets[0];
  const species = speciesLibrary[activePet.speciesId] || speciesLibrary['dragon'];
  
  // Logic tìm giai đoạn hiện tại
  const currentStage = [...species.stages].reverse().find(s => activePet.level >= s.minLevel) || species.stages[0];
  const nextStage = species.stages.find(s => s.minLevel > activePet.level);

  // Hiệu ứng "Chat"
  useEffect(() => {
    // Nếu thú cưng đói
    if (activePet.hunger < 20) {
       setDialogue("Đói quá... bụng kêu rột rột...");
       return;
    }

    const randomMsg = currentStage.dialogue[Math.floor(Math.random() * currentStage.dialogue.length)];
    setDialogue(randomMsg);
    
    const interval = setInterval(() => {
      const msg = currentStage.dialogue[Math.floor(Math.random() * currentStage.dialogue.length)];
      setDialogue(msg);
    }, 8000);

    return () => clearInterval(interval);
  }, [currentStage, activePet.level, activePet.hunger]);

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 bg-gradient-to-b from-blue-200 to-green-100 rounded-b-[3rem] relative overflow-hidden shadow-inner p-4 flex flex-col items-center justify-center pb-24">
         <div className="absolute top-10 left-10 text-white/40 text-6xl animate-float">☁️</div>
         <div className="absolute top-20 right-10 text-white/40 text-4xl animate-float" style={{animationDelay: '1s'}}>☁️</div>

         {/* Dialogue Bubble */}
         <div className="absolute top-12 z-10 bg-white px-4 py-2 rounded-2xl rounded-bl-none shadow-lg animate-pop max-w-[200px] text-center">
            <p className="text-sm font-bold text-slate-700">{dialogue}</p>
         </div>

         {/* PET IMAGE */}
         <div 
           className="text-[8rem] filter drop-shadow-2xl transition-all duration-500 cursor-pointer hover:scale-110 active:scale-95 animate-float relative"
           onClick={() => setDialogue("Ôm cái nào! ❤️")}
         >
            {currentStage.image}
            {activePet.hunger < 20 && (
               <div className="absolute -top-2 -right-2 text-3xl animate-bounce">🆘</div>
            )}
         </div>

         {/* STATS + CHEAT XP BUTTON */}
         <div className="bg-white/60 backdrop-blur rounded-2xl p-3 w-full max-w-xs mt-6 border border-white shadow-sm relative">
            {user.isTestingMode && (
               <button 
                  onClick={onAddXp}
                  className="absolute -right-2 -top-2 bg-blue-500 text-white p-1 rounded-full shadow-lg z-10 active:scale-90 transition-transform"
                  title="Hack: Tăng 100 XP"
               >
                  <Zap className="w-4 h-4" />
               </button>
            )}

            <div className="flex justify-between items-end mb-1">
               <span className="font-bold text-slate-700">{currentStage.name}</span>
               <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Lv {activePet.level}</span>
            </div>
            
            {/* XP BAR */}
            <div className="relative w-full h-4 bg-slate-200 rounded-full overflow-hidden mb-2">
               <div 
                 className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                 style={{ width: `${Math.min((activePet.xp / activePet.maxXp) * 100, 100)}%` }}
               />
               <p className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-600">
                  XP: {activePet.xp}/{activePet.maxXp}
               </p>
            </div>

            {/* HUNGER BAR */}
            <div className="flex items-center gap-2">
               <div className="w-5 h-5 flex items-center justify-center bg-orange-100 rounded-full text-xs">🍗</div>
               <div className="relative flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full transition-all duration-500 ${activePet.hunger < 30 ? 'bg-red-500 animate-pulse' : 'bg-orange-400'}`}
                    style={{ width: `${activePet.hunger}%` }}
                  />
               </div>
               <span className="text-[9px] font-bold text-slate-500 w-6 text-right">{Math.floor(activePet.hunger)}%</span>
            </div>

            {nextStage && (
              <p className="text-[10px] text-slate-500 mt-2 text-center italic">
                 Lv {nextStage.minLevel} ➜ <span className="font-bold">???</span>
              </p>
            )}
         </div>

         {/* PET COLLECTION LIST (BOTTOM OF PET AREA) */}
         <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="bg-white/40 backdrop-blur-md rounded-2xl p-2 flex gap-2 overflow-x-auto hide-scrollbar snap-x">
               {/* List owned pets */}
               {user.pets.map(p => {
                  const s = speciesLibrary[p.speciesId];
                  const stage = [...s.stages].reverse().find(st => p.level >= st.minLevel) || s.stages[0];
                  const isActive = p.id === activePet.id;
                  return (
                     <button
                        key={p.id}
                        onClick={() => onSwitchPet(p.id)}
                        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 transition-all relative snap-center
                           ${isActive ? 'bg-white border-blue-500 shadow-lg scale-110 z-10' : 'bg-white/60 border-transparent opacity-70 hover:opacity-100'}`}
                     >
                        {stage.image}
                        {p.hunger < 20 && <span className="absolute -top-1 -right-1 flex h-2 w-2 bg-red-500 rounded-full"></span>}
                     </button>
                  )
               })}
               
               {/* Add Pet Button */}
               <button 
                  onClick={() => setShowAdoptMenu(true)}
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-300 bg-white/40 hover:bg-white transition-all snap-center"
               >
                  <Plus className="w-5 h-5" />
               </button>
            </div>
         </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3 -mt-6 z-10">
         <button 
           onClick={() => setShowFoodMenu(true)}
           className="bg-white p-3 rounded-2xl shadow-lg border-2 border-orange-100 flex items-center justify-center gap-2 hover:bg-orange-50 active:scale-95 transition-all"
         >
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">🍖</div>
            <div className="text-left">
               <p className="font-bold text-slate-700">Cho ăn</p>
               <p className="text-[10px] text-slate-400">Tăng XP & No</p>
            </div>
         </button>

         <button 
           onClick={() => setShowInventory(true)}
           className="bg-white p-3 rounded-2xl shadow-lg border-2 border-purple-100 flex items-center justify-center gap-2 hover:bg-purple-50 active:scale-95 transition-all"
         >
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl">🎒</div>
            <div className="text-left">
               <p className="font-bold text-slate-700">Tủ đồ</p>
               <p className="text-[10px] text-slate-400">Đổi Avatar</p>
            </div>
         </button>
      </div>

      {showFoodMenu && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-20 flex items-end">
           <div className="bg-white w-full rounded-t-3xl p-5 animate-pop shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-lg flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-orange-500" />
                    Cửa hàng thức ăn
                 </h3>
                 <button onClick={() => setShowFoodMenu(false)} className="bg-slate-100 p-2 rounded-full"><X className="w-4 h-4"/></button>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                 {FOOD_ITEMS.map(food => {
                    const canAfford = user.balance >= food.cost;
                    return (
                      <button 
                        key={food.id}
                        disabled={!canAfford}
                        onClick={() => { onFeed(food); }}
                        className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all relative overflow-hidden
                           ${canAfford ? 'border-slate-100 bg-slate-50 hover:border-orange-200' : 'opacity-50 border-transparent'}`}
                      >
                         <div className="text-3xl mb-1">{food.icon}</div>
                         <div className="text-[10px] font-bold text-slate-600 mb-1">{food.name}</div>
                         <div className="bg-yellow-100 px-2 py-0.5 rounded text-[10px] font-bold text-yellow-800 flex items-center gap-1">
                            <Coins className="w-3 h-3" /> {food.cost}
                         </div>
                         <div className="absolute top-1 right-1 text-[8px] bg-green-100 text-green-700 px-1 rounded">+{food.hungerDetails}% No</div>
                      </button>
                    )
                 })}
              </div>
           </div>
        </div>
      )}

      {showAdoptMenu && (
        <div className="absolute inset-0 bg-white z-30 animate-fade-in flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-purple-50">
               <h3 className="font-bold text-lg text-purple-900 flex items-center gap-2"><Heart className="w-5 h-5"/> Nhận nuôi thú cưng</h3>
               <button onClick={() => setShowAdoptMenu(false)} className="bg-white p-2 rounded-full shadow-sm"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-4 grid gap-4 overflow-y-auto">
               <div className="bg-blue-50 p-3 rounded-xl text-xs text-blue-700 mb-2">
                  <p>Bé có <strong>{user.balance} xu</strong>. Hãy chọn một "Quả trứng bí ẩn" nhé!</p>
               </div>

               {Object.values(speciesLibrary).map(s => {
                  const ownedCount = user.pets.filter(p => p.speciesId === s.id).length;
                  const canAfford = user.balance >= (s.cost || 0);
                  
                  return (
                     <div key={s.id} className="bg-white border-2 border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                           {/* UPDATE: Show Egg and Generic Name */}
                           <div className="text-4xl">{s.stages[0].image}</div>
                           <div>
                              <h4 className="font-bold text-slate-800">Trứng Bí Ẩn</h4>
                              <p className="text-xs text-slate-500 italic">Sẽ nở ra con gì nhỉ?</p>
                           </div>
                        </div>
                        <button 
                           onClick={() => {
                              if (!canAfford) return;
                              if (confirm(`Bé có muốn nhận nuôi Trứng Bí Ẩn với giá ${s.cost || 0} xu không?`)) {
                                 onAdopt(s.id);
                                 setShowAdoptMenu(false);
                              }
                           }}
                           disabled={!canAfford}
                           className={`px-4 py-2 rounded-xl text-xs font-bold transition-all
                              ${canAfford ? 'bg-yellow-400 text-yellow-900 shadow-md active:scale-95' : 'bg-slate-100 text-slate-400'}`}
                        >
                           {s.cost === 0 ? 'Miễn phí' : `${s.cost} xu`}
                        </button>
                     </div>
                  )
               })}
            </div>
        </div>
      )}

      {showInventory && (
        <div className="absolute inset-0 bg-white z-30 animate-fade-in flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-purple-50">
               <h3 className="font-bold text-lg text-purple-900">Tủ đồ của bé</h3>
               <button onClick={() => setShowInventory(false)} className="bg-white p-2 rounded-full shadow-sm"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-4 space-y-6 overflow-y-auto">
                <div>
                   <p className="text-sm font-bold text-slate-500 uppercase mb-3">Avatar</p>
                   <div className="flex gap-4 flex-wrap">
                      {['🐯', '🐻', '🐰', ...user.inventory.filter(id => id.startsWith('av')).map(id => {
                         const r = INITIAL_REWARDS.find(x => x.id === id);
                         return r ? r.image : '?';
                      })].map((av, idx) => (
                         <button 
                           key={idx}
                           onClick={() => onEquip('avatar', av)}
                           className={`w-16 h-16 rounded-2xl text-3xl flex items-center justify-center border-2 transition-all
                             ${user.activeAvatar === av ? 'bg-blue-100 border-blue-500 shadow-md ring-2 ring-blue-200' : 'bg-slate-50 border-slate-200'}`}
                         >
                            {av}
                         </button>
                      ))}
                   </div>
                </div>

                <div>
                   <p className="text-sm font-bold text-slate-500 uppercase mb-3">Khung hình</p>
                   <div className="flex gap-4 flex-wrap">
                      {['default', ...user.inventory.filter(id => id.startsWith('fr')).map(id => {
                         if(id.includes('fr1')) return 'gold';
                         if(id.includes('fr2')) return 'rainbow';
                         return 'default';
                      })].map((styleKey, idx) => (
                         <button 
                           key={idx}
                           onClick={() => onEquip('frame', styleKey)}
                           className={`w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border-2 transition-all relative
                             ${user.activeFrame === styleKey ? 'border-purple-500 shadow-md' : 'border-slate-200'}`}
                         >
                            <div className={`w-10 h-10 rounded-full border-2 bg-white ${FRAMES[styleKey]}`}></div>
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
