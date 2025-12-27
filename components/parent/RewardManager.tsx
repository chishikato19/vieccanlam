
import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ShoppingBag } from 'lucide-react';
import { Reward, RewardType } from '../../types';
import IconPicker from '../IconPicker';
import { COMMON_REWARD_ICONS } from '../../data';
import { generateId } from '../../utils';

const RewardManager = ({ rewards, setRewards }: { rewards: Reward[], setRewards: (r: Reward[]) => void }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);

  const [title, setTitle] = useState('');
  const [cost, setCost] = useState(100);
  const [image, setImage] = useState('🎁');
  const [type, setType] = useState<RewardType>('toy');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReward) {
      setRewards(rewards.map(r => r.id === editingReward.id ? { ...r, title, cost, image, type } : r));
    } else {
      const newReward: Reward = { id: generateId(), title, cost, image, type };
      setRewards([...rewards, newReward]);
    }
    resetForm();
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingReward(null);
    setTitle('');
    setCost(100);
    setImage('🎁');
    setType('toy');
  };

  const handleEdit = (reward: Reward) => {
    setEditingReward(reward);
    setTitle(reward.title);
    setCost(reward.cost);
    setImage(reward.image);
    setType(reward.type);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Xóa phần quà này?")) {
      setRewards(rewards.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-700 flex items-center gap-2"><ShoppingBag className="w-5 h-5"/> Quản lý Phần quà</h3>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
            <Plus className="w-3 h-3" /> Thêm mới
          </button>
        )}
      </div>

      {isAdding ? (
        <form onSubmit={handleSave} className="bg-white p-4 border rounded-2xl space-y-4 shadow-lg animate-pop">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Tên phần quà / Hoạt động</label>
            <input type="text" required className="w-full p-3 border rounded-xl outline-none" value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: 30 phút xem Youtube..." />
          </div>
          <div className="flex gap-4">
             <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 block mb-1">Giá trị (Xu)</label>
                <input type="number" className="w-full p-3 border rounded-xl" value={cost} onChange={e => setCost(Number(e.target.value))} />
             </div>
             <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Biểu tượng</label>
                <IconPicker icons={COMMON_REWARD_ICONS} selected={image} onSelect={setImage} />
             </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Phân loại</label>
            <select className="w-full p-3 border rounded-xl" value={type} onChange={e => setType(e.target.value as RewardType)}>
              <option value="toy">🎁 Đồ chơi / Hiện vật</option>
              <option value="activity">🎮 Hoạt động giải trí</option>
              <option value="avatar">✨ Avatar (Dùng trang trí)</option>
              <option value="frame">🖼️ Khung (Dùng trang trí)</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={resetForm} className="flex-1 py-3 bg-slate-100 font-bold rounded-xl">Hủy</button>
            <button type="submit" className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl">Lưu lại</button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {rewards.map(reward => (
            <div key={reward.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{reward.image}</span>
                <div>
                  <p className="font-bold text-slate-800 text-sm leading-tight">{reward.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{reward.cost} xu • {reward.type === 'toy' ? 'Đồ chơi' : reward.type === 'activity' ? 'Hoạt động' : 'Trang trí'}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(reward)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4"/></button>
                <button onClick={() => handleDelete(reward.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RewardManager;
