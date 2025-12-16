
import React, { useState } from 'react';
import { Settings, X, Wand2, Plus, CheckCircle2, Eye, RefreshCcw, Save, KeyRound } from 'lucide-react';
import TaskCard from './TaskCard';
import RewardCard from './RewardCard';
import IconPicker from './IconPicker';
import { Task, Reward, PetSpecies, RewardType, PetState } from '../types';
import { COMMON_ICONS, COMMON_REWARD_ICONS, AI_SUGGESTIONS } from '../data';
import { generateId, calculateMaxXp } from '../utils';

const ParentDashboard = ({ 
  user,
  tasks, 
  rewards,
  speciesLibrary,
  onAddTask, 
  onDeleteTask, 
  onAddReward, 
  onDeleteReward,
  onUpdatePet,
  onAddSpecies,
  onUpdatePin,
  onClose 
}: any) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'rewards' | 'pet' | 'security'>('tasks');
  const activePet = user.pets.find((p: any) => p.id === user.activePetId) || user.pets[0];

  // Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState(10);
  const [newTaskIcon, setNewTaskIcon] = useState('⭐');
  const [isDaily, setIsDaily] = useState(true);

  // Reward Form State
  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardCost, setNewRewardCost] = useState(100);
  const [newRewardIcon, setNewRewardIcon] = useState('🎁');
  const [rewardType, setRewardType] = useState<RewardType>('toy');

  // Pet Creation State
  const [isCreatingSpecies, setIsCreatingSpecies] = useState(false);
  const [newSpeciesName, setNewSpeciesName] = useState('');
  const [newSpeciesImages, setNewSpeciesImages] = useState(['🥚', '🐥', '🐓', '🦅']);

  // Security State
  const [newPin, setNewPin] = useState('');

  const handleSuggestTask = () => {
    const random = AI_SUGGESTIONS[Math.floor(Math.random() * AI_SUGGESTIONS.length)];
    setNewTaskTitle(random.title);
    setNewTaskPoints(random.points);
    setNewTaskIcon(random.icon);
  };

  const submitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    onAddTask({
      id: generateId(),
      title: newTaskTitle,
      points: newTaskPoints,
      icon: newTaskIcon,
      status: 'todo',
      isDaily
    });
    setNewTaskTitle('');
    setNewTaskIcon('⭐');
  };

  const submitReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRewardTitle) return;
    onAddReward({
      id: generateId(),
      title: newRewardTitle,
      cost: newRewardCost,
      image: newRewardIcon,
      type: rewardType
    });
    setNewRewardTitle('');
    setNewRewardIcon('🎁');
  };

  const submitSpecies = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpeciesName) return;
    const speciesId = 'custom_' + generateId();
    const newSpecies: PetSpecies = {
      id: speciesId,
      name: newSpeciesName,
      isCustom: true,
      cost: 500, // Default cost for custom
      stages: [
        { minLevel: 1, image: newSpeciesImages[0], name: 'Bé con', dialogue: ['Chào mừng!', 'Thế giới rộng lớn quá!'] },
        { minLevel: 5, image: newSpeciesImages[1], name: 'Tập đi', dialogue: ['Chơi với tớ đi!', 'Đói quá!'] },
        { minLevel: 15, image: newSpeciesImages[2], name: 'Trưởng thành', dialogue: ['Sức mạnh!', 'Bảo vệ bạn!'] },
        { minLevel: 30, image: newSpeciesImages[3], name: 'Huyền thoại', dialogue: ['Ta là vô địch!', 'Cảm ơn đã nuôi nấng!'] }
      ]
    };
    onAddSpecies(newSpecies);
    setIsCreatingSpecies(false);
    setNewSpeciesName('');
    alert('Đã thêm loài vật mới thành công!');
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-fade-in">
      <div className="sticky top-0 bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-20">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Khu vực Phụ huynh
        </h2>
        <button onClick={onClose} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 max-w-md mx-auto">
        <div className="flex gap-1 mb-6 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {['tasks', 'rewards', 'pet', 'security'].map(tab => (
             <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 min-w-[80px] py-2 rounded-lg text-xs font-bold transition-all uppercase ${activeTab === tab ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
            >
              {{
                tasks: 'Nhiệm vụ',
                rewards: 'Quà tặng',
                pet: 'Thú cưng',
                security: 'Bảo mật'
              }[tab]}
            </button>
          ))}
        </div>

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <form onSubmit={submitTask} className="bg-blue-50 p-4 rounded-2xl border border-blue-100 space-y-3">
              <h3 className="font-bold text-blue-800">Thêm nhiệm vụ mới</h3>
              <div className="flex gap-2">
                 <input 
                    type="text" 
                    placeholder="Tên nhiệm vụ" 
                    className="flex-1 p-3 rounded-xl border border-blue-200 outline-none focus:ring-2 focus:ring-blue-400"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                 />
                 <button 
                    type="button" 
                    onClick={handleSuggestTask}
                    className="p-3 bg-indigo-100 text-indigo-600 rounded-xl border border-indigo-200 hover:bg-indigo-200"
                    title="AI Gợi ý"
                 >
                   <Wand2 className="w-5 h-5" />
                 </button>
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Điểm" 
                  className="w-20 p-3 rounded-xl border border-blue-200 outline-none text-center"
                  value={newTaskPoints}
                  onChange={(e) => setNewTaskPoints(Number(e.target.value))}
                />
                <IconPicker 
                  icons={COMMON_ICONS} 
                  selected={newTaskIcon} 
                  onSelect={setNewTaskIcon} 
                />
                <div className="flex-1 flex items-center gap-2 bg-white px-3 rounded-xl border border-blue-200 cursor-pointer" onClick={() => setIsDaily(!isDaily)}>
                   <div className={`w-5 h-5 rounded border flex items-center justify-center ${isDaily ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
                      {isDaily && <CheckCircle2 className="w-4 h-4 text-white" />}
                   </div>
                   <span className="text-sm text-slate-600">Hàng ngày</span>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Thêm nhiệm vụ
              </button>
            </form>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-700">Danh sách hiện tại</h3>
              {tasks.map((t: Task) => (
                <TaskCard 
                  key={t.id} 
                  task={t} 
                  onComplete={() => {}} 
                  onDelete={onDeleteTask} 
                  isParentMode={true} 
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <form onSubmit={submitReward} className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 space-y-3">
              <h3 className="font-bold text-yellow-800">Thêm phần thưởng mới</h3>
              <input 
                  type="text" 
                  placeholder="Tên phần thưởng" 
                  className="w-full p-3 rounded-xl border border-yellow-200 outline-none focus:ring-2 focus:ring-yellow-400"
                  value={newRewardTitle}
                  onChange={(e) => setNewRewardTitle(e.target.value)}
               />
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Giá xu" 
                  className="w-24 p-3 rounded-xl border border-yellow-200 outline-none text-center"
                  value={newRewardCost}
                  onChange={(e) => setNewRewardCost(Number(e.target.value))}
                />
                <IconPicker 
                  icons={COMMON_REWARD_ICONS} 
                  selected={newRewardIcon} 
                  onSelect={setNewRewardIcon} 
                />
                <select 
                  className="flex-1 p-3 rounded-xl border border-yellow-200 outline-none bg-white"
                  value={rewardType}
                  onChange={(e) => setRewardType(e.target.value as RewardType)}
                >
                  <option value="toy">Đồ chơi</option>
                  <option value="activity">Hoạt động</option>
                  <option value="avatar">Avatar</option>
                  <option value="frame">Khung</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-600 flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Thêm phần thưởng
              </button>
            </form>

            <div className="grid grid-cols-2 gap-3">
              {rewards.map((r: Reward) => (
                <RewardCard 
                  key={r.id} 
                  reward={r} 
                  user={user}
                  onAction={() => {}} 
                  onDelete={onDeleteReward} 
                  isParentMode={true} 
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pet' && (
          <div className="space-y-6">
            {!isCreatingSpecies ? (
              <>
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-purple-900 flex items-center gap-2">
                      <Eye className="w-5 h-5" /> Loài vật trong game
                    </h3>
                    <button 
                      onClick={() => setIsCreatingSpecies(true)}
                      className="text-xs bg-purple-200 text-purple-800 px-3 py-1.5 rounded-lg font-bold hover:bg-purple-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Tạo loài mới
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                      {Object.values(speciesLibrary).map((species: any) => (
                        <div 
                          key={species.id} 
                          className={`border-2 rounded-xl p-3 bg-white relative overflow-hidden flex gap-3 border-slate-100 opacity-80`}
                        >
                          {species.isCustom && (
                             <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[9px] font-bold px-1.5 py-0.5 rounded-bl">Tự tạo</div>
                          )}
                          <div className="flex-1">
                              <span className="font-bold text-slate-800 block mb-1">{species.name}</span>
                              <div className="flex gap-2">
                                  {species.stages.map((stage: any) => (
                                    <div key={stage.minLevel} className="text-center">
                                        <span className="text-xl">{stage.image}</span>
                                    </div>
                                  ))}
                              </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h3 className="font-bold text-slate-700 mb-2">Chỉnh sửa bé thú cưng đang chọn ({activePet.name || 'Không tên'})</h3>
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border mb-2">
                      <span>Level: <strong>{activePet.level}</strong></span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onUpdatePet({ ...activePet, level: Math.max(1, activePet.level - 1), xp: 0, maxXp: calculateMaxXp(Math.max(1, activePet.level - 1)) })}
                          className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold"
                        >-</button>
                        <button 
                          onClick={() => onUpdatePet({ ...activePet, level: activePet.level + 1, xp: 0, maxXp: calculateMaxXp(activePet.level + 1) })}
                          className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold"
                        >+</button>
                      </div>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border mb-2">
                      <span>Độ no: <strong>{Math.floor(activePet.hunger)}%</strong></span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onUpdatePet({ ...activePet, hunger: 100 })}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold"
                        >Đầy bụng</button>
                      </div>
                  </div>
                  <button 
                    onClick={() => {
                        if(confirm("Bố mẹ có chắc muốn reset thú cưng này về trứng level 1 không?")) {
                          onUpdatePet({ ...activePet, level: 1, xp: 0, maxXp: 100, hunger: 100 });
                        }
                    }}
                    className="w-full py-3 bg-red-100 text-red-600 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-200"
                  >
                    <RefreshCcw className="w-4 h-4" /> Reset về Level 1
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white p-4 rounded-2xl border border-slate-200 animate-fade-in">
                 <div className="flex justify-between items-center mb-4 border-b pb-2">
                   <h3 className="font-bold text-lg">Tạo loài vật mới</h3>
                   <button onClick={() => setIsCreatingSpecies(false)} className="text-slate-400 font-bold text-sm">Hủy</button>
                 </div>
                 
                 <form onSubmit={submitSpecies} className="space-y-4">
                    <div>
                       <label className="block text-xs font-bold text-slate-500 mb-1">Tên loài vật</label>
                       <input 
                         type="text" 
                         required
                         className="w-full p-3 rounded-xl border border-slate-200"
                         placeholder="Ví dụ: Siêu Mèo"
                         value={newSpeciesName}
                         onChange={e => setNewSpeciesName(e.target.value)}
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                       {[0, 1, 2, 3].map((idx) => (
                          <div key={idx} className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
                             <span className="text-[10px] text-slate-400 block mb-1">
                                {idx === 0 ? 'Trứng (Lv1)' : idx === 1 ? 'Bé con (Lv5)' : idx === 2 ? 'Lớn (Lv15)' : 'Thần (Lv30)'}
                             </span>
                             <div className="flex justify-center">
                                <input 
                                  type="text"
                                  className="w-12 h-12 text-center text-2xl border-2 border-slate-200 rounded-lg focus:border-blue-400 outline-none"
                                  value={newSpeciesImages[idx]}
                                  onChange={e => {
                                     const newImgs = [...newSpeciesImages];
                                     newImgs[idx] = e.target.value;
                                     setNewSpeciesImages(newImgs);
                                  }}
                                />
                             </div>
                          </div>
                       ))}
                    </div>
                    <p className="text-xs text-slate-400 italic">Mẹo: Sử dụng bàn phím Emoji trên điện thoại để nhập hình ảnh.</p>
                    
                    <button type="submit" className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                       <Save className="w-5 h-5" /> Lưu loài vật
                    </button>
                 </form>
              </div>
            )}
          </div>
        )}

        {activeTab === 'security' && (
           <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                 <KeyRound className="w-5 h-5" /> Đổi mật khẩu
              </h3>
              <p className="text-sm text-slate-500">Mã PIN hiện tại dùng để truy cập vào khu vực này.</p>
              
              <div className="flex gap-2">
                 <input 
                    type="text" 
                    maxLength={4}
                    placeholder="Nhập PIN mới (4 số)"
                    className="flex-1 p-3 rounded-xl border border-slate-200 text-center tracking-widest font-bold"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                 />
                 <button 
                   onClick={() => {
                      if (newPin.length === 4) {
                         onUpdatePin(newPin);
                         setNewPin('');
                         alert('Đổi PIN thành công!');
                      } else {
                         alert('Vui lòng nhập đủ 4 số.');
                      }
                   }}
                   className="bg-slate-800 text-white px-4 rounded-xl font-bold"
                 >
                    Lưu
                 </button>
              </div>
              <p className="text-xs text-slate-400 text-center mt-2">Mã mặc định ban đầu là: 0000</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
