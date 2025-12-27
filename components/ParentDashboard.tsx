
import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';

import GeneralSettings from './parent/GeneralSettings';
import TaskManager from './parent/TaskManager';
import RewardManager from './parent/RewardManager';
import PetSpeciesManager from './parent/PetSpeciesManager';
import CloudSync from './parent/CloudSync';

const ParentDashboard = ({ 
  user, tasks, rewards, speciesLibrary,
  onUpdateUser, setTasks, setRewards, setSpeciesLibrary,
  onDeletePet, onRemoveFromInventory,
  onClose 
}: any) => {
  const [activeTab, setActiveTab] = useState<'general' | 'tasks' | 'rewards' | 'pet' | 'cloud'>('general');

  const onSyncData = (data: any) => {
    if (data.user) onUpdateUser(data.user);
    if (data.tasks) setTasks(data.tasks);
    if (data.rewards) setRewards(data.rewards);
    if (data.speciesLibrary) setSpeciesLibrary(data.speciesLibrary);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-fade-in flex flex-col">
      <div className="sticky top-0 bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-20">
        <h2 className="font-bold text-lg flex items-center gap-2"><Settings className="w-5 h-5" /> Khu vực Phụ huynh</h2>
        <button onClick={onClose} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><X className="w-5 h-5" /></button>
      </div>

      <div className="flex gap-1 p-2 bg-slate-100 overflow-x-auto hide-scrollbar sticky top-[60px] z-20 shadow-sm">
        {['general', 'tasks', 'rewards', 'pet', 'cloud'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 min-w-[80px] py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${activeTab === tab ? 'bg-white shadow-md text-slate-800 scale-105' : 'text-slate-500'}`}>
            {{ general: 'Cài đặt', tasks: 'Nhiệm vụ', rewards: 'Quà', pet: 'Thú cưng', cloud: 'Đám mây' }[tab]}
          </button>
        ))}
      </div>

      <div className="p-4 max-w-md mx-auto w-full flex-1">
        {activeTab === 'general' && (
          <GeneralSettings 
            user={user} 
            onUpdateUser={onUpdateUser} 
            rewards={rewards} 
            onRemoveFromInventory={onRemoveFromInventory} 
          />
        )}
        {activeTab === 'tasks' && <TaskManager tasks={tasks} setTasks={setTasks} />}
        {/* Fix: Remove user={user} prop as it is not defined in RewardManager's prop types */}
        {activeTab === 'rewards' && <RewardManager rewards={rewards} setRewards={setRewards} />}
        {activeTab === 'pet' && (
          <PetSpeciesManager 
            user={user} 
            speciesLibrary={speciesLibrary} 
            setSpeciesLibrary={setSpeciesLibrary} 
            onUpdateUser={onUpdateUser}
            onDeletePet={onDeletePet}
          />
        )}
        {activeTab === 'cloud' && <CloudSync user={user} tasks={tasks} rewards={rewards} speciesLibrary={speciesLibrary} onUpdateUser={onUpdateUser} onSyncData={onSyncData} />}
      </div>
    </div>
  );
};

export default ParentDashboard;
