
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { ListTodo, Heart, ShoppingBag, Lock, RotateCcw, Award } from 'lucide-react';

import { Task, Reward, PetSpecies, UserData, FoodItem, PetState, Badge } from './types';
import { INITIAL_TASKS, INITIAL_REWARDS, INITIAL_PET_SPECIES, INITIAL_BADGES } from './data';
import { triggerConfetti, generateId, calculateMaxXp } from './utils';

import Header from './components/Header';
import TaskCard from './components/TaskCard';
import RewardCard from './components/RewardCard';
import PetHome from './components/PetHome';
import ParentDashboard from './components/ParentDashboard';

const App = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'shop' | 'pet'>('tasks');
  const [tasks, setTasks] = useState<Task[]>(() => {
    return INITIAL_TASKS.map(t => ({ ...t, streak: 0, totalCompletions: 0, totalSkips: 0 }));
  });
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [speciesLibrary, setSpeciesLibrary] = useState<Record<string, PetSpecies>>(INITIAL_PET_SPECIES);
  
  const [user, setUser] = useState<UserData>({
    name: 'Bé Yêu',
    balance: 0,
    activeAvatar: '🐯',
    activeFrame: 'default',
    inventory: ['default'],
    pets: [],
    activePetId: '',
    pin: '0000',
    isTestingMode: false,
    badges: [],
    badgeHistory: {}
  });

  const [showParentGate, setShowParentGate] = useState(false);
  const [isParentMode, setIsParentMode] = useState(false);
  const [shopFilter, setShopFilter] = useState<'all' | 'items' | 'cosmetics'>('items');
  const [inputPin, setInputPin] = useState('');
  const isFirstLoad = useRef(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('kiddo_user_v6');
      const savedTasks = localStorage.getItem('kiddo_tasks_v6');
      const savedRewards = localStorage.getItem('kiddo_rewards_v6');
      const savedBadges = localStorage.getItem('kiddo_badges_v6');
      const savedSpecies = localStorage.getItem('kiddo_species_v6');
      
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } else {
        const initialPetId = generateId();
        setUser(prev => ({
          ...prev,
          pets: [{ id: initialPetId, speciesId: 'dragon', level: 1, xp: 0, maxXp: 100, mood: 100, hunger: 100 }],
          activePetId: initialPetId
        }));
      }

      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedRewards) setRewards(JSON.parse(savedRewards));
      if (savedBadges) setBadges(JSON.parse(savedBadges));
      if (savedSpecies) setSpeciesLibrary(JSON.parse(savedSpecies));

    } catch (e) {
      console.error("Lỗi khi tải dữ liệu:", e);
    } finally {
      setTimeout(() => { isFirstLoad.current = false; }, 500);
    }
  }, []);

  useEffect(() => {
    if (isFirstLoad.current) return;
    localStorage.setItem('kiddo_user_v6', JSON.stringify(user));
    localStorage.setItem('kiddo_tasks_v6', JSON.stringify(tasks));
    localStorage.setItem('kiddo_rewards_v6', JSON.stringify(rewards));
    localStorage.setItem('kiddo_badges_v6', JSON.stringify(badges));
    localStorage.setItem('kiddo_species_v6', JSON.stringify(speciesLibrary));
  }, [user, tasks, rewards, badges, speciesLibrary]);

  const handleCompleteTask = (taskId: string, points: number) => {
    triggerConfetti();
    
    // 1. Cập nhật Task Stats
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { 
          ...t, 
          status: 'done', 
          streak: t.streak + 1, 
          totalCompletions: t.totalCompletions + 1 
        };
      }
      return t;
    }));

    // 2. Cập nhật User Balance và Badge Progress
    setUser(prev => {
      const newBadgeHistory = { ...prev.badgeHistory };
      const awardedBadges = [...prev.badges];

      // Tìm các danh hiệu gắn với task này
      badges.forEach(badge => {
        if (badge.targetTaskId === taskId) {
          const stats = newBadgeHistory[badge.id] || { completions: 0, skips: 0 };
          const newCompletions = stats.completions + 1;
          newBadgeHistory[badge.id] = { ...stats, completions: newCompletions, skips: 0 }; // Reset skips khi hoàn thành

          // Cấp danh hiệu nếu đủ điều kiện và chưa có
          if (newCompletions >= badge.requiredCompletions && !awardedBadges.includes(badge.id)) {
            awardedBadges.push(badge.id);
            alert(`🎉 Chúc mừng! Bé đã nhận được danh hiệu: ${badge.name} ${badge.icon}`);
          }
        }
      });

      return { 
        ...prev, 
        balance: prev.balance + points,
        badges: awardedBadges,
        badgeHistory: newBadgeHistory
      };
    });
  };

  const handleRefreshDailyTasks = () => {
    if (confirm("Làm mới tất cả nhiệm vụ hàng ngày? Các nhiệm vụ chưa làm sẽ bị mất chuỗi nhé!")) {
      const newBadgeHistory = { ...user.badgeHistory };
      const currentBadges = [...user.badges];
      let hasRevocation = false;

      const updatedTasks = tasks.map(t => {
        if (t.isDaily) {
          if (t.status !== 'done') {
            // Nhiệm vụ bị bỏ lỡ -> Skip++
            const taskSkips = t.totalSkips + 1;
            
            // Kiểm tra thu hồi danh hiệu
            badges.forEach(badge => {
              if (badge.targetTaskId === t.id && currentBadges.includes(badge.id)) {
                const stats = newBadgeHistory[badge.id] || { completions: 0, skips: 0 };
                const newSkips = stats.skips + 1;
                newBadgeHistory[badge.id] = { ...stats, skips: newSkips };

                if (newSkips >= badge.revocationThreshold) {
                  const idx = currentBadges.indexOf(badge.id);
                  if (idx > -1) {
                    currentBadges.splice(idx, 1);
                    newBadgeHistory[badge.id].completions = 0; // Reset cả số lần hoàn thành để bé làm lại từ đầu
                    hasRevocation = true;
                  }
                }
              }
            });

            return { ...t, status: 'todo' as const, streak: 0, totalSkips: taskSkips };
          }
          return { ...t, status: 'todo' as const };
        }
        return t;
      });

      if (hasRevocation) {
        alert("⚠️ Ôi không! Vì bé bỏ lỡ nhiệm vụ quá nhiều lần, một số danh hiệu đã bị tạm thu hồi. Bé hãy cố gắng làm đều đặn để lấy lại nhé!");
      }

      setTasks(updatedTasks);
      setUser(prev => ({ ...prev, badges: currentBadges, badgeHistory: newBadgeHistory }));
      triggerConfetti();
    }
  };

  const handleBuyItem = (reward: Reward) => {
    if (user.balance < reward.cost) return;
    if (confirm(`Đổi ${reward.cost} xu lấy "${reward.title}" nhé?`)) {
      triggerConfetti();
      setUser(prev => ({
        ...prev,
        balance: prev.balance - reward.cost,
        inventory: [...prev.inventory, reward.id]
      }));
    }
  };

  const handleEquip = (type: 'avatar' | 'frame', value: string) => {
    setUser(prev => ({
      ...prev,
      activeAvatar: type === 'avatar' ? value : prev.activeAvatar,
      activeFrame: type === 'frame' ? value : prev.activeFrame,
    }));
  };

  const handleRemoveFromInventory = (itemId: string) => {
     setUser(prev => ({
        ...prev,
        inventory: prev.inventory.filter(id => id !== itemId)
     }));
  };

  const handleFeedPet = (food: FoodItem) => {
    if (user.balance < food.cost) return;
    setUser(prev => {
       const updatedPets = prev.pets.map(p => {
          if (p.id !== prev.activePetId) return p;
          let newPet = { ...p };
          newPet.xp += food.xp;
          newPet.hunger = Math.min(100, newPet.hunger + food.hungerDetails);
          if (newPet.xp >= newPet.maxXp) {
            newPet.level += 1;
            newPet.xp -= newPet.maxXp;
            newPet.maxXp = calculateMaxXp(newPet.level);
            triggerConfetti(); 
          }
          return newPet;
       });
       return { ...prev, balance: prev.balance - food.cost, pets: updatedPets };
    });
  };

  const checkPin = () => {
     if (inputPin === user.pin) { setIsParentMode(true); setShowParentGate(false); setInputPin(''); } 
     else { alert("Mật khẩu không đúng!"); setInputPin(''); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 max-w-md mx-auto relative shadow-2xl overflow-hidden font-nunito flex flex-col">
      <Header 
        user={user} 
        onOpenSettings={() => setShowParentGate(true)} 
        onAddMoney={() => setUser(p => ({...p, balance: p.balance + 1000}))} 
        saveStatus="idle" 
      />

      {isParentMode && (
        <ParentDashboard 
          user={user} tasks={tasks} rewards={rewards} speciesLibrary={speciesLibrary} badges={badges}
          setTasks={setTasks} setRewards={setRewards} setSpeciesLibrary={setSpeciesLibrary} setBadges={setBadges}
          onUpdateUser={setUser} onSyncData={setUser}
          onDeletePet={(id: string) => {}} 
          onRemoveFromInventory={handleRemoveFromInventory}
          onClose={() => setIsParentMode(false)}
        />
      )}
      
      {showParentGate && !isParentMode && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 text-center shadow-2xl max-w-xs w-full animate-pop">
               <Lock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
               <h3 className="font-bold text-lg mb-2">Khu vực Phụ huynh</h3>
               <p className="text-slate-500 mb-6 text-sm">Nhập mật khẩu để tiếp tục.</p>
               <input type="password" maxLength={4} className="w-full text-center text-2xl tracking-[0.5em] p-3 border border-slate-200 rounded-xl mb-4 font-bold outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••" autoFocus value={inputPin} onChange={(e) => setInputPin(e.target.value)} />
               <div className="flex gap-3">
                 <button onClick={() => { setShowParentGate(false); setInputPin(''); }} className="flex-1 py-2 rounded-xl bg-slate-100 font-bold text-slate-600">Hủy</button>
                 <button onClick={checkPin} className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-bold">Mở khóa</button>
               </div>
            </div>
         </div>
      )}

      <main className="flex-1 overflow-y-auto hide-scrollbar animate-fade-in relative">
        {activeTab === 'tasks' && (
          <div className="p-4 space-y-6">
            {/* Badges Section for Kids */}
            {user.badges.length > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-500" /> Danh hiệu của bé
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                  {user.badges.map(bid => {
                    const b = badges.find(x => x.id === bid);
                    if (!b) return null;
                    return (
                      <div key={bid} className="flex flex-col items-center gap-1 shrink-0 bg-yellow-50 p-2 rounded-xl border border-yellow-100 min-w-[80px]">
                        <span className="text-2xl">{b.icon}</span>
                        <span className="text-[9px] font-black text-yellow-800 text-center leading-tight">{b.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <h2 className="font-bold text-slate-700 text-lg flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-blue-500" /> Nhiệm vụ hôm nay
              </h2>
              <button onClick={handleRefreshDailyTasks} className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-blue-100 border border-blue-100 active:scale-90 transition-all">
                <RotateCcw className="w-3 h-3" /> Làm mới
              </button>
            </div>
            <div className="grid gap-3">
              {tasks.map(task => <TaskCard key={task.id} task={task} onComplete={handleCompleteTask} />)}
            </div>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="p-4 space-y-4">
             <div className="flex gap-2 mb-4">
                <button onClick={() => setShopFilter('items')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${shopFilter === 'items' ? 'bg-yellow-400 border-yellow-500 text-yellow-900' : 'bg-white border-slate-200 text-slate-500'}`}>🎁 Đổi quà</button>
                <button onClick={() => setShopFilter('cosmetics')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${shopFilter === 'cosmetics' ? 'bg-purple-400 border-purple-500 text-white' : 'bg-white border-slate-200 text-slate-500'}`}>✨ Làm đẹp</button>
             </div>
             <div className="grid grid-cols-2 gap-4">
                {rewards.filter(r => shopFilter === 'items' ? (r.type === 'toy' || r.type === 'activity') : (r.type === 'avatar' || r.type === 'frame')).map(reward => <RewardCard key={reward.id} reward={reward} user={user} onAction={handleBuyItem} />)}
             </div>
          </div>
        )}

        {activeTab === 'pet' && user.pets.length > 0 && (
           <PetHome user={user} speciesLibrary={speciesLibrary} rewards={rewards} onFeed={handleFeedPet} onEquip={handleEquip} onRemoveItem={handleRemoveFromInventory} onAddXp={() => {}} onSwitchPet={(id) => setUser({...user, activePetId: id})} onAdopt={(sid) => {}} />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center max-w-md mx-auto pb-6 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-20">
        <NavButton active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} icon={<ListTodo />} label="Nhiệm vụ" color="blue" />
        <NavButton active={activeTab === 'pet'} onClick={() => setActiveTab('pet')} icon={<Heart />} label="Thú cưng" color="purple" />
        <NavButton active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} icon={<ShoppingBag />} label="Cửa hàng" color="yellow" />
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label, color }: any) => {
  const colorClass = { blue: 'text-blue-600 bg-blue-50', yellow: 'text-yellow-600 bg-yellow-50', purple: 'text-purple-600 bg-purple-50' }[color as string] || 'text-slate-600';
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all duration-300 px-4 py-2 rounded-xl ${active ? `${colorClass} -translate-y-2 shadow-sm` : 'text-slate-400 hover:bg-slate-50'}`}>
      {React.cloneElement(icon, { size: 24 })}
      <span className={`text-[10px] font-bold ${active ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{label}</span>
    </button>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
