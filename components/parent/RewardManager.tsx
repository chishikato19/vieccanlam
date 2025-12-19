
import React, { useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { Reward, RewardType, UserData } from '../../types';
import { COMMON_REWARD_ICONS } from '../../data';
import { generateId } from '../../utils';
import IconPicker from '../IconPicker';
import RewardCard from '../RewardCard';

const RewardManager = ({ rewards, setRewards, user }: { rewards: Reward[], setRewards: (r: Reward[]) => void, user: UserData }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState(100);
  const [image, setImage] = useState('🎁');
  const [type, setType] = useState<RewardType>('toy');

  const submitReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    if (editingId) setRewards(rewards.map(r => r.id === editingId ? { ...r, title, cost, image, type } : r));
    else setRewards([...rewards, { id: generateId(), title, cost, image, type }]);
    setEditingId(null); setTitle(''); setCost(100); setImage('🎁'); setType('toy');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submitReward} className={`p-4 rounded-2xl border space-y-3 ${editingId ? 'bg-orange-50' : 'bg-yellow-50'}`}>
        <h3 className="font-bold">{editingId ? 'Sửa phần thưởng' : 'Thêm phần thưởng'}</h3>
        <input type="text" placeholder="Tên quà..." className="w-full p-3 rounded-xl border" value={title} onChange={e => setTitle(e.target.value)} />
        <div className="flex gap-2">
          <input type="number" className="w-24 p-3 rounded-xl border text-center" value={cost} onChange={e => setCost(Number(e.target.value))} />
          <IconPicker icons={COMMON_REWARD_ICONS} selected={image} onSelect={setImage} />
          <select className="flex-1 p-3 rounded-xl border bg-white" value={type} onChange={e => setType(e.target.value as RewardType)}>
            <option value="toy">Đồ chơi</option><option value="activity">Hoạt động</option>
            <option value="avatar">Avatar</option><option value="frame">Khung</option><option value="decor">Nội thất</option>
          </select>
        </div>
        <button type="submit" className={`w-full py-3 text-white rounded-xl font-bold flex justify-center items-center gap-2 ${editingId ? 'bg-orange-500' : 'bg-yellow-500'}`}>
          {editingId ? <Save className="w-5 h-5"/> : <Plus className="w-5 h-5"/>} {editingId ? 'Lưu' : 'Thêm'}
        </button>
      </form>
      <div className="grid grid-cols-2 gap-3">
        {rewards.map(r => (
          <RewardCard key={r.id} reward={r} user={user} onAction={() => {}} isParentMode onEdit={(rew) => { setEditingId(rew.id); setTitle(rew.title); setCost(rew.cost); setImage(rew.image); setType(rew.type); }} onDelete={(id) => setRewards(rewards.filter(x => x.id !== id))} />
        ))}
      </div>
    </div>
  );
};

export default RewardManager;
