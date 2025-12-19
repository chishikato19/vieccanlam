
import React, { useState } from 'react';
import { Settings, X, Wand2, Plus, CheckCircle2, Eye, RefreshCcw, Save, KeyRound, User, ToggleLeft, ToggleRight, Cloud, Download, Upload, Pencil } from 'lucide-react';
import TaskCard from './TaskCard';
import RewardCard from './RewardCard';
import IconPicker from './IconPicker';
import { Task, Reward, PetSpecies, RewardType, PetState, UserData } from '../types';
import { COMMON_ICONS, COMMON_REWARD_ICONS, AI_SUGGESTIONS } from '../data';
import { generateId, calculateMaxXp } from '../utils';
import { saveToCloud, loadFromCloud } from '../cloud';

const ParentDashboard = ({ 
  user,
  tasks, 
  rewards,
  speciesLibrary,
  onAddTask,
  onUpdateTask, 
  onDeleteTask, 
  onAddReward, 
  onUpdateReward,
  onDeleteReward,
  onUpdatePet,
  onAddSpecies,
  onUpdateSpecies,
  onUpdatePin,
  onUpdateUser,
  onSyncData, // Callback khi tải dữ liệu từ cloud về
  onClose 
}: any) => {
  const [activeTab, setActiveTab] = useState<'general' | 'tasks' | 'rewards' | 'pet' | 'cloud'>('general');
  const activePet = user.pets.find((p: any) => p.id === user.activePetId) || user.pets[0];

  // General Settings State
  const [editName, setEditName] = useState(user.name);

  // Cloud State
  const [scriptUrl, setScriptUrl] = useState(user.googleScriptUrl || '');
  const [isSyncing, setIsSyncing] = useState(false);

  // Task Form State
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState(10);
  const [newTaskIcon, setNewTaskIcon] = useState('⭐');
  const [isDaily, setIsDaily] = useState(true);

  // Reward Form State
  const [editingRewardId, setEditingRewardId] = useState<string | null>(null);
  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardCost, setNewRewardCost] = useState(100);
  const [newRewardIcon, setNewRewardIcon] = useState('🎁');
  const [rewardType, setRewardType] = useState<RewardType>('toy');

  // Pet Creation State
  const [isCreatingSpecies, setIsCreatingSpecies] = useState(false);
  const [editingSpeciesId, setEditingSpeciesId] = useState<string | null>(null);
  const [newSpeciesName, setNewSpeciesName] = useState('');
  const [newSpeciesImages, setNewSpeciesImages] = useState(['🥚', '🐥', '🐓', '🦅']);
  const [newSpeciesLevels, setNewSpeciesLevels] = useState([1, 5, 15, 30]);

  // Security State
  const [newPin, setNewPin] = useState('');

  const handleSuggestTask = () => {
    const random = AI_SUGGESTIONS[Math.floor(Math.random() * AI_SUGGESTIONS.length)];
    setNewTaskTitle(random.title);
    setNewTaskPoints(random.points);
    setNewTaskIcon(random.icon);
  };

  // --- TASK HANDLERS ---
  const handleStartEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setNewTaskTitle(task.title);
    setNewTaskPoints(task.points);
    setNewTaskIcon(task.icon);
    setIsDaily(task.isDaily);
    const formElement = document.getElementById('task-form');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEditTask = () => {
    setEditingTaskId(null);
    setNewTaskTitle('');
    setNewTaskPoints(10);
    setNewTaskIcon('⭐');
    setIsDaily(true);
  };

  const submitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    if (editingTaskId) {
      const originalTask = tasks.find((t: Task) => t.id === editingTaskId);
      onUpdateTask({
        ...originalTask,
        title: newTaskTitle,
        points: newTaskPoints,
        icon: newTaskIcon,
        isDaily: isDaily
      });
      alert('Đã cập nhật nhiệm vụ!');
      handleCancelEditTask();
    } else {
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
    }
  };

  // --- REWARD HANDLERS ---
  const handleStartEditReward = (reward: Reward) => {
    setEditingRewardId(reward.id);
    setNewRewardTitle(reward.title);
    setNewRewardCost(reward.cost);
    setNewRewardIcon(reward.image);
    setRewardType(reward.type);
    const formElement = document.getElementById('reward-form');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEditReward = () => {
    setEditingRewardId(null);
    setNewRewardTitle('');
    setNewRewardCost(100);
    setNewRewardIcon('🎁');
    setRewardType('toy');
  };

  const submitReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRewardTitle) return;

    if (editingRewardId) {
       onUpdateReward({
         id: editingRewardId,
         title: newRewardTitle,
         cost: newRewardCost,
         image: newRewardIcon,
         type: rewardType
       });
       alert('Đã cập nhật phần thưởng!');
       handleCancelEditReward();
    } else {
       onAddReward({
         id: generateId(),
         title: newRewardTitle,
         cost: newRewardCost,
         image: newRewardIcon,
         type: rewardType
       });
       setNewRewardTitle('');
       setNewRewardIcon('🎁');
    }
  };

  // --- SPECIES HANDLERS ---
  const handleStartEditSpecies = (species: PetSpecies) => {
     setEditingSpeciesId(species.id);
     setNewSpeciesName(species.name);
     const images = species.stages.map(s => s.image);
     const levels = species.stages.map(s => s.minLevel);
     
     while(images.length < 4) images.push('?');
     while(levels.length < 4) levels.push(levels[levels.length-1] + 10 || 40);
     
     setNewSpeciesImages(images);
     setNewSpeciesLevels(levels);
     setIsCreatingSpecies(true);
  };

  const handleCancelEditSpecies = () => {
     setIsCreatingSpecies(false);
     setEditingSpeciesId(null);
     setNewSpeciesName('');
     setNewSpeciesImages(['🥚', '🐥', '🐓', '🦅']);
     setNewSpeciesLevels([1, 5, 15, 30]);
  };

  const submitSpecies = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpeciesName) return;

    let speciesToSave: PetSpecies;

    const stages = [
      { minLevel: newSpeciesLevels[0], image: newSpeciesImages[0], name: 'Trứng Bí Ẩn', dialogue: ['Chào mừng!', 'Thế giới rộng lớn quá!'] },
      { minLevel: newSpeciesLevels[1], image: newSpeciesImages[1], name: 'Tập đi', dialogue: ['Chơi với tớ đi!', 'Đói quá!'] },
      { minLevel: newSpeciesLevels[2], image: newSpeciesImages[2], name: 'Trưởng thành', dialogue: ['Sức mạnh!', 'Bảo vệ bạn!'] },
      { minLevel: newSpeciesLevels[3], image: newSpeciesImages[3], name: 'Huyền thoại', dialogue: ['Ta là vô địch!', 'Cảm ơn đã nuôi nấng!'] }
    ];

    if (editingSpeciesId) {
        speciesToSave = {
            ...speciesLibrary[editingSpeciesId],
            name: newSpeciesName,
            stages: stages
        };
        onUpdateSpecies(speciesToSave);
        alert(`Đã cập nhật loài ${newSpeciesName}!`);
    } else {
        const speciesId = 'custom_' + generateId();
        speciesToSave = {
          id: speciesId,
          name: newSpeciesName,
          isCustom: true,
          cost: 500,
          stages: stages
        };
        onAddSpecies(speciesToSave);
        alert('Đã thêm loài vật mới thành công!');
    }
    
    handleCancelEditSpecies();
  };

  // --- CLOUD HANDLERS ---
  const handleSaveToCloud = async () => {
    const cleanUrl = scriptUrl.trim();
    if (!cleanUrl) {
      alert("Vui lòng nhập URL Google Script!");
      return;
    }
    onUpdateUser({ ...user, googleScriptUrl: cleanUrl });
    setIsSyncing(true);
    try {
      const backupData = {
        user: { ...user, googleScriptUrl: cleanUrl },
        tasks,
        rewards,
        speciesLibrary
      };
      await saveToCloud(cleanUrl, backupData);
      alert("Đã gửi yêu cầu lưu dữ liệu lên đám mây thành công!");
    } catch (e) {
      alert("Lỗi khi lưu: " + e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLoadFromCloud = async () => {
    const cleanUrl = scriptUrl.trim();
    if (!cleanUrl) {
      alert("Vui lòng nhập URL Google Script!");
      return;
    }
    onUpdateUser({ ...user, googleScriptUrl: cleanUrl });
    setIsSyncing(true);
    try {
      const data = await loadFromCloud(cleanUrl);
      if (data && Object.keys(data).length > 0) {
        if (confirm("Tìm thấy dữ liệu cũ trên mây. Bạn có chắc muốn tải về và ghi đè dữ liệu hiện tại không?")) {
           onSyncData(data);
           alert("Đã tải dữ liệu thành công!");
        }
      } else {
        alert("Kết nối thành công nhưng chưa có dữ liệu nào trên đám mây.");
      }
    } catch (e) {
      alert("Lỗi khi tải: " + e);
    } finally {
      setIsSyncing(false);
    }
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
        <div className="flex gap-1 mb-6 p-1 bg-slate-100 rounded-xl overflow-x-auto hide-scrollbar">
          {['general', 'tasks', 'rewards', 'pet', 'cloud'].map(tab => (
             <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 min-w-[80px] py-2 rounded-lg text-xs font-bold transition-all uppercase whitespace-nowrap px-2 ${activeTab === tab ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
            >
              {{
                general: 'Cài đặt',
                tasks: 'Nhiệm vụ',
                rewards: 'Quà',
                pet: 'Thú cưng',
                cloud: 'Đám mây'
              }[tab]}
            </button>
          ))}
        </div>

        {activeTab === 'general' && (
          <div className="space-y-6 animate-fade-in">
            {/* NAME SETTINGS */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
               <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><User className="w-5 h-5"/> Thông tin bé</h3>
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={editName}
                   onChange={(e) => setEditName(e.target.value)}
                   className="flex-1 p-3 rounded-xl border border-slate-200"
                   placeholder="Nhập tên bé..."
                 />
                 <button 
                    onClick={() => {
                       onUpdateUser({ ...user, name: editName });
                       alert('Đã lưu tên bé!');
                    }}
                    className="bg-blue-600 text-white px-4 rounded-xl font-bold"
                 >Lưu</button>
               </div>
            </div>

            {/* TESTING MODE */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
               <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-700 flex items-center gap-2"><Wand2 className="w-5 h-5"/> Chế độ kiểm thử</h3>
                    <p className="text-xs text-slate-500 mt-1">Hiện các nút hack Xu và XP để test app.</p>
                  </div>
                  <button 
                    onClick={() => onUpdateUser({ ...user, isTestingMode: !user.isTestingMode })}
                    className={`text-3xl transition-colors ${user.isTestingMode ? 'text-green-500' : 'text-slate-300'}`}
                  >
                     {user.isTestingMode ? <ToggleRight className="w-10 h-10 fill-current" /> : <ToggleLeft className="w-10 h-10" />}
                  </button>
               </div>
            </div>

            {/* PIN SETTINGS */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                 <KeyRound className="w-5 h-5" /> Đổi mật khẩu
              </h3>
              <p className="text-sm text-slate-500">Mã PIN dùng để vào khu vực này (Mặc định: 0000).</p>
              
              <div className="flex gap-2">
                 <input 
                    type="text" 
                    maxLength={4}
                    placeholder="PIN mới (4 số)"
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
           </div>
          </div>
        )}

        {activeTab === 'cloud' && (
          <div className="space-y-6 animate-fade-in">
             <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
               <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                 <Cloud className="w-5 h-5" /> Đồng bộ dữ liệu
               </h3>
               <p className="text-sm text-blue-700 mb-4">
                 Lưu trữ quá trình chơi lên Google Sheets để không bị mất khi đổi máy.
               </p>

               <div className="mb-4">
                 <label className="text-xs font-bold text-blue-600 block mb-1">URL Google Apps Script</label>
                 <input 
                   type="text"
                   className="w-full p-2 text-xs border border-blue-200 rounded-lg mb-1"
                   placeholder="https://script.google.com/macros/s/..."
                   value={scriptUrl}
                   onChange={(e) => setScriptUrl(e.target.value)}
                 />
                 <p className="text-[10px] text-blue-400">Dán link ứng dụng web bạn đã triển khai từ Google Apps Script.</p>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleSaveToCloud}
                    disabled={isSyncing}
                    className="flex flex-col items-center justify-center p-4 bg-white border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-6 h-6 text-blue-500 mb-2" />
                    <span className="text-xs font-bold text-blue-700">Lưu lên Mây</span>
                  </button>

                  <button 
                    onClick={handleLoadFromCloud}
                    disabled={isSyncing}
                    className="flex flex-col items-center justify-center p-4 bg-white border-2 border-green-200 rounded-xl hover:bg-green-50 transition-colors disabled:opacity-50"
                  >
                    <Download className="w-6 h-6 text-green-500 mb-2" />
                    <span className="text-xs font-bold text-green-700">Tải về Máy</span>
                  </button>
               </div>
               
               {isSyncing && <p className="text-center text-xs font-bold text-blue-500 mt-2 animate-pulse">Đang đồng bộ...</p>}
             </div>
             
             <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200">
                <p className="text-xs text-orange-800">
                   <strong>Lưu ý:</strong> Dữ liệu trên mây sẽ ghi đè dữ liệu trên máy khi bạn bấm "Tải về". Hãy chắc chắn rằng bạn đã lưu dữ liệu mới nhất trước khi chuyển thiết bị.
                </p>
             </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <form id="task-form" onSubmit={submitTask} className={`p-4 rounded-2xl border space-y-3 transition-colors ${editingTaskId ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-100'}`}>
              <div className="flex justify-between items-center">
                 <h3 className={`font-bold ${editingTaskId ? 'text-orange-800' : 'text-blue-800'}`}>
                   {editingTaskId ? 'Chỉnh sửa nhiệm vụ' : 'Thêm nhiệm vụ mới'}
                 </h3>
                 {editingTaskId && (
                    <button type="button" onClick={handleCancelEditTask} className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-lg">
                       Hủy
                    </button>
                 )}
              </div>

              <div className="flex gap-2">
                 <input 
                    type="text" 
                    placeholder="Tên nhiệm vụ" 
                    className={`flex-1 p-3 rounded-xl border outline-none focus:ring-2 ${editingTaskId ? 'border-orange-200 focus:ring-orange-400' : 'border-blue-200 focus:ring-blue-400'}`}
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                 />
                 {!editingTaskId && (
                    <button 
                        type="button" 
                        onClick={handleSuggestTask}
                        className="p-3 bg-indigo-100 text-indigo-600 rounded-xl border border-indigo-200 hover:bg-indigo-200"
                        title="AI Gợi ý"
                    >
                    <Wand2 className="w-5 h-5" />
                    </button>
                 )}
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Điểm" 
                  className={`w-20 p-3 rounded-xl border outline-none text-center ${editingTaskId ? 'border-orange-200' : 'border-blue-200'}`}
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
              
              <button 
                type="submit" 
                className={`w-full py-3 text-white rounded-xl font-bold flex items-center justify-center gap-2 ${editingTaskId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {editingTaskId ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />} 
                {editingTaskId ? 'Lưu thay đổi' : 'Thêm nhiệm vụ'}
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
                  onEdit={handleStartEditTask}
                  isParentMode={true} 
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <form id="reward-form" onSubmit={submitReward} className={`p-4 rounded-2xl border space-y-3 transition-colors ${editingRewardId ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-100'}`}>
              <div className="flex justify-between items-center">
                 <h3 className={`font-bold ${editingRewardId ? 'text-orange-800' : 'text-yellow-800'}`}>
                    {editingRewardId ? 'Chỉnh sửa phần thưởng' : 'Thêm phần thưởng mới'}
                 </h3>
                 {editingRewardId && (
                    <button type="button" onClick={handleCancelEditReward} className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-lg">
                       Hủy
                    </button>
                 )}
              </div>

              <input 
                  type="text" 
                  placeholder="Tên phần thưởng" 
                  className={`w-full p-3 rounded-xl border outline-none focus:ring-2 ${editingRewardId ? 'border-orange-200 focus:ring-orange-400' : 'border-yellow-200 focus:ring-yellow-400'}`}
                  value={newRewardTitle}
                  onChange={(e) => setNewRewardTitle(e.target.value)}
               />
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Giá xu" 
                  className={`w-24 p-3 rounded-xl border outline-none text-center ${editingRewardId ? 'border-orange-200' : 'border-yellow-200'}`}
                  value={newRewardCost}
                  onChange={(e) => setNewRewardCost(Number(e.target.value))}
                />
                <IconPicker 
                  icons={COMMON_REWARD_ICONS} 
                  selected={newRewardIcon} 
                  onSelect={setNewRewardIcon} 
                />
                <select 
                  className={`flex-1 p-3 rounded-xl border outline-none bg-white ${editingRewardId ? 'border-orange-200' : 'border-yellow-200'}`}
                  value={rewardType}
                  onChange={(e) => setRewardType(e.target.value as RewardType)}
                >
                  <option value="toy">Đồ chơi</option>
                  <option value="activity">Hoạt động</option>
                  <option value="avatar">Avatar</option>
                  <option value="frame">Khung</option>
                </select>
              </div>
              <button 
                type="submit" 
                className={`w-full py-3 text-white rounded-xl font-bold hover:opacity-90 flex items-center justify-center gap-2 ${editingRewardId ? 'bg-orange-500' : 'bg-yellow-500'}`}
              >
                {editingRewardId ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingRewardId ? 'Lưu thay đổi' : 'Thêm phần thưởng'}
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
                  onEdit={handleStartEditReward}
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
                          className={`border-2 rounded-xl p-3 bg-white relative overflow-hidden flex gap-3 border-slate-100`}
                        >
                          <div className="absolute top-2 right-2">
                              <button 
                                onClick={() => handleStartEditSpecies(species)}
                                className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200"
                                title="Chỉnh sửa loài này"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                          </div>
                          
                          {species.isCustom && (
                             <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[9px] font-bold px-1.5 py-0.5 rounded-bl mr-10">Tự tạo</div>
                          )}

                          <div className="flex-1">
                              <span className="font-bold text-slate-800 block mb-1">{species.name}</span>
                              <div className="flex gap-2">
                                  {species.stages.map((stage: any) => (
                                    <div key={stage.minLevel} className="text-center">
                                        <span className="text-xl">{stage.image}</span>
                                        <span className="text-[9px] text-slate-400 block">Lv{stage.minLevel}</span>
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
              <div className={`p-4 rounded-2xl border animate-fade-in ${editingSpeciesId ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200'}`}>
                 <div className="flex justify-between items-center mb-4 border-b pb-2">
                   <h3 className={`font-bold text-lg ${editingSpeciesId ? 'text-orange-800' : 'text-slate-800'}`}>
                      {editingSpeciesId ? 'Chỉnh sửa loài vật' : 'Tạo loài vật mới'}
                   </h3>
                   <button onClick={handleCancelEditSpecies} className="text-slate-400 font-bold text-sm bg-white px-2 py-1 rounded border">Hủy</button>
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
                    
                    <div className="grid grid-cols-1 gap-4">
                       {[0, 1, 2, 3].map((idx) => (
                          <div key={idx} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between gap-4">
                             <div className="text-center">
                                <span className="text-[10px] text-slate-400 block mb-1">
                                   {idx === 0 ? 'Giai đoạn 1' : idx === 1 ? 'Giai đoạn 2' : idx === 2 ? 'Giai đoạn 3' : 'Giai đoạn 4'}
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
                             
                             <div className="flex-1">
                                <label className="block text-[10px] font-bold text-slate-500 mb-1">Cấp độ yêu cầu (Level)</label>
                                <input 
                                  type="number"
                                  min={idx === 0 ? 1 : newSpeciesLevels[idx-1] + 1}
                                  className="w-full p-2 text-sm border-2 border-slate-200 rounded-lg outline-none focus:border-blue-400"
                                  value={newSpeciesLevels[idx]}
                                  onChange={e => {
                                     const newLevs = [...newSpeciesLevels];
                                     newLevs[idx] = Number(e.target.value);
                                     setNewSpeciesLevels(newLevs);
                                  }}
                                />
                             </div>
                          </div>
                       ))}
                    </div>
                    <p className="text-xs text-slate-400 italic">Mẹo: Đặt cấp độ cao hơn cho các giai đoạn sau để bé có động lực phấn đấu.</p>
                    
                    <button 
                      type="submit" 
                      className={`w-full py-3 text-white rounded-xl font-bold flex items-center justify-center gap-2 ${editingSpeciesId ? 'bg-orange-500' : 'bg-purple-600'}`}
                    >
                       <Save className="w-5 h-5" /> {editingSpeciesId ? 'Lưu thay đổi' : 'Lưu loài vật'}
                    </button>
                 </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
