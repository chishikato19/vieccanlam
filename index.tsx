
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { ListTodo, Heart, ShoppingBag } from 'lucide-react';

import { Task, Reward, PetSpecies, UserData, FoodItem } from './types';
import { INITIAL_TASKS, INITIAL_REWARDS, INITIAL_PET_SPECIES } from './data';
import { triggerConfetti, generateId, calculateMaxXp } from './utils';
import { saveToCloud } from './cloud';

import Header from './components/Header';
import TaskCard from './components/TaskCard';
import RewardCard from './components/RewardCard';
import PetHome from './components/PetHome';
import ParentDashboard from './components/ParentDashboard';

const App = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'shop' | 'pet'>('tasks');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);
  const [speciesLibrary, setSpeciesLibrary] = useState<Record<string, PetSpecies>>(INITIAL_PET_SPECIES);
  
  const [user, setUser] = useState<UserData>({
    name: 'Bé Yêu',
    balance: 0,
    activeAvatar: '🐯',
    activeFrame: 'default',
    inventory: ['default'],
    activeDecors: [],
    pets: [],
    activePetId: '',
    pin: '0000',
    isTestingMode: false
  });

  const [showParentGate, setShowParentGate] = useState(false);
  const [isParentMode, setIsParentMode] = useState(false);
  const [shopFilter, setShopFilter] = useState<'all' | 'items' | 'cosmetics' | 'decor'>('items');
  const [inputPin, setInputPin] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const isFirstLoad = useRef(true);

  // LOGIC MERGE DỮ LIỆU CŨ VÀ MỚI
  useEffect(() => {
    const savedUser = localStorage.getItem('kiddo_user_v7');
    const savedTasks = localStorage.getItem('kiddo_tasks_v7');
    const savedRewards = localStorage.getItem('kiddo_rewards_v7');
    const savedSpecies = localStorage.getItem('kiddo_species_v7');
    
    // 1. Load User
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (!parsed.activeDecors) parsed.activeDecors = [];
      setUser(parsed);
    } else {
      const id = generateId();
      setUser(prev => ({
        ...prev,
        pets: [{ id, speciesId: 'dragon', level: 1, xp: 0, maxXp: 100, mood: 100, hunger: 100 }],
        activePetId: id
      }));
    }

    // 2. MERGE Tasks: Giữ nhiệm vụ người dùng đã chỉnh sửa, thêm nhiệm vụ mới từ code
    if (savedTasks) {
      const localTasks = JSON.parse(savedTasks) as Task[];
      const localIds = new Set(localTasks.map(t => t.id));
      const newFromCode = INITIAL_TASKS.filter(t => !localIds.has(t.id));
      setTasks([...localTasks, ...newFromCode]);
    }

    // 3. MERGE Rewards: Đảm bảo Avatar/Khung hình mới xuất hiện trong shop
    if (savedRewards) {
      const localRewards = JSON.parse(savedRewards) as Reward[];
      const localIds = new Set(localRewards.map(r => r.id));
      const newFromCode = INITIAL_REWARDS.filter(r => !localIds.has(r.id));
      setRewards([...localRewards, ...newFromCode]);
    }

    // 4. MERGE Species
    if (savedSpecies) {
      const localLib = JSON.parse(savedSpecies);
      setSpeciesLibrary({ ...localLib, ...INITIAL_PET_SPECIES });
    }

    setTimeout(() => { isFirstLoad.current = false; }, 1000);
  }, []);

  useEffect(() => {
    if (isFirstLoad.current) return;
    localStorage.setItem('kiddo_user_v7', JSON.stringify(user));
    localStorage.setItem('kiddo_tasks_v7', JSON.stringify(tasks));
    localStorage.setItem('kiddo_rewards_v7', JSON.stringify(rewards));
    localStorage.setItem('kiddo_species_v7', JSON.stringify(speciesLibrary));
  }, [user, tasks, rewards, speciesLibrary]);

  const handleBuyItem = (reward: Reward) => {
    if (user.balance < reward.cost) return;

    if (reward.type === 'mystery_box') {
      triggerConfetti();
      const prizes = ['xu', 'food', 'nothing'];
      const win = prizes[Math.floor(Math.random() * prizes.length)];
      let msg = "";
      let newBalance = user.balance - reward.cost;
      if (win === 'xu') { newBalance += 100; msg = `Oa! Bé mở được hũ vàng +100 xu!`; }
      else if (win === 'food') { msg = `Bé nhận được một chiếc Bánh Kem! (+100 XP)`; handleFeedPet({ id: 'bonus', name: 'Bánh Mystery', cost: 0, xp: 100, hungerDetails: 50, icon: '🎂' }); }
      else { msg = "Hộp rỗng rồi, chúc bé may mắn lần sau nhé!"; }
      alert(msg);
      setUser({ ...user, balance: newBalance });
      return;
    }

    if (confirm(`Đổi ${reward.cost} xu lấy "${reward.title}"?`)) {
      triggerConfetti();
      setUser(prev => ({
        ...prev,
        balance: prev.balance - reward.cost,
        inventory: [...prev.inventory, reward.id]
      }));
    }
  };

  const handleToggleDecor = (decorId: string) => {
    setUser(prev => ({
      ...prev,
      activeDecors: prev.activeDecors.includes(decorId)
        ? prev.activeDecors.filter(id => id !== decorId)
        : [...prev.activeDecors, decorId]
    }));
  };

  const handleFeedPet = (food: FoodItem) => {
    if (user.balance < food.cost && food.id !== 'bonus') return;
    setUser(prev => {
      const updatedPets = prev.pets.map(p => {
        if (p.id !== prev.activePetId) return p;
        let newP = { ...p, xp: p.xp + food.xp, hunger: Math.min(100, p.hunger + food.hungerDetails) };
        if (newP.xp >= newP.maxXp) {
          newP.level++;
          newP.xp -= newP.maxXp;
          newP.maxXp = calculateMaxXp(newP.level);
          triggerConfetti();
        }
        return newP;
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
      <Header user={user} onOpenSettings={() => setShowParentGate(true)} onAddMoney={() => setUser({...user, balance: user.balance + 100})} saveStatus={saveStatus} />

      {isParentMode && (
        <ParentDashboard 
          user={user} tasks={tasks} rewards={rewards} speciesLibrary={speciesLibrary}
          onUpdateUser={setUser} setTasks={setTasks} setRewards={setRewards} setSpeciesLibrary={setSpeciesLibrary}
          onClose={() => setIsParentMode(false)}
        />
      )}

      {showParentGate && !isParentMode && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 text-center shadow-2xl max-w-xs w-full animate-pop">
               <h3 className="font-bold text-lg mb-4">Khu vực Phụ huynh</h3>
               <input type="password" maxLength={4} className="w-full text-center text-2xl tracking-[0.5em] p-3 border border-slate-200 rounded-xl mb-4 font-bold" placeholder="••••" autoFocus value={inputPin} onChange={(e) => setInputPin(e.target.value)} />
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
            <h2 className="font-bold text-slate-700 text-lg flex items-center gap-2"><ListTodo className="w-5 h-5 text-blue-500" /> Nhiệm vụ</h2>
            <div className="grid gap-3">
              {tasks.map(t => <TaskCard key={t.id} task={t} onComplete={(id, pts) => { triggerConfetti(); setTasks(tasks.map(x => x.id === id ? {...x, status: 'done'} : x)); setUser({...user, balance: user.balance + pts}); }} />)}
            </div>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="p-4 space-y-4">
             <div className="flex gap-1 mb-4 overflow-x-auto hide-scrollbar">
                {['items', 'cosmetics', 'decor'].map(f => (
                  <button key={f} onClick={() => setShopFilter(f as any)} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border ${shopFilter === f ? 'bg-blue-500 text-white' : 'bg-white text-slate-500'}`}>
                    {f === 'items' ? '🎁 Quà' : f === 'cosmetics' ? '✨ Đẹp' : '🏠 Nội thất'}
                  </button>
                ))}
             </div>
             <div className="grid grid-cols-2 gap-4">
                {rewards.filter(r => {
                  if (shopFilter === 'items') return r.type === 'toy' || r.type === 'activity' || r.type === 'mystery_box';
                  if (shopFilter === 'cosmetics') return r.type === 'avatar' || r.type === 'frame';
                  return r.type === 'decor';
                }).map(r => <RewardCard key={r.id} reward={r} user={user} onAction={handleBuyItem} />)}
             </div>
          </div>
        )}

        {activeTab === 'pet' && user.pets.length > 0 && (
           <PetHome 
            user={user} speciesLibrary={speciesLibrary} rewards={rewards} 
            onFeed={handleFeedPet} onEquip={(type, val) => setUser({...user, [type === 'avatar' ? 'activeAvatar' : 'activeFrame']: val})} 
            onRemoveItem={(id) => setUser({...user, inventory: user.inventory.filter(x => x !== id)})} 
            onAddXp={() => {}} onSwitchPet={(id) => setUser({...user, activePetId: id})} onAdopt={() => {}} onToggleDecor={handleToggleDecor}
           />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center max-w-md mx-auto pb-6 z-20">
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
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all duration-300 px-4 py-2 rounded-xl ${active ? `${colorClass} -translate-y-2 shadow-sm` : 'text-slate-400'}`}>
      {React.cloneElement(icon, { size: 24 })}
      <span className={`text-[10px] font-bold ${active ? '' : 'hidden'}`}>{label}</span>
    </button>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
