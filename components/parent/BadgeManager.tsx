
import React, { useState } from 'react';
import { Plus, Trash2, Award, Info } from 'lucide-react';
import { Badge, Task } from '../../types';
import IconPicker from '../IconPicker';
import { COMMON_ICONS } from '../../data';
import { generateId } from '../../utils';

const BadgeManager = ({ badges, setBadges, tasks }: { badges: Badge[], setBadges: (b: Badge[]) => void, tasks: Task[] }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🏆');
  const [targetTaskId, setTargetTaskId] = useState('');
  const [requiredCompletions, setRequiredCompletions] = useState(10);
  const [revocationThreshold, setRevocationThreshold] = useState(3);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTaskId) return alert("Vui lòng chọn một nhiệm vụ!");
    
    const newBadge: Badge = {
      id: generateId(),
      name,
      icon,
      targetTaskId,
      requiredCompletions,
      revocationThreshold
    };
    
    setBadges([...badges, newBadge]);
    setIsAdding(false);
    setName('');
    setIcon('🏆');
  };

  const handleDelete = (id: string) => {
    if (confirm("Xóa danh hiệu này? Bé sẽ không thấy danh hiệu này nữa.")) {
      setBadges(badges.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-700 flex items-center gap-2"><Award className="w-5 h-5"/> Quản lý Danh hiệu</h3>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
            <Plus className="w-3 h-3" /> Tạo mới
          </button>
        )}
      </div>

      {isAdding ? (
        <form onSubmit={handleSave} className="bg-white p-4 border rounded-2xl space-y-4 shadow-lg animate-pop">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Tên danh hiệu</label>
            <input type="text" required className="w-full p-3 border rounded-xl outline-none" value={name} onChange={e => setName(e.target.value)} placeholder="VD: Dũng sĩ diệt sâu răng..." />
          </div>

          <div className="flex gap-4">
             <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 block mb-1">Chọn nhiệm vụ</label>
                <select className="w-full p-3 border rounded-xl" value={targetTaskId} onChange={e => setTargetTaskId(e.target.value)}>
                   <option value="">-- Chọn nhiệm vụ --</option>
                   {tasks.map(t => <option key={t.id} value={t.id}>{t.icon} {t.title}</option>)}
                </select>
             </div>
             <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Biểu tượng</label>
                <IconPicker icons={COMMON_ICONS} selected={icon} onSelect={setIcon} />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Cấp sau (lần làm)</label>
                <input type="number" className="w-full p-3 border rounded-xl" value={requiredCompletions} onChange={e => setRequiredCompletions(Number(e.target.value))} />
             </div>
             <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Tước sau (lần bỏ)</label>
                <input type="number" className="w-full p-3 border rounded-xl" value={revocationThreshold} onChange={e => setRevocationThreshold(Number(e.target.value))} />
             </div>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-slate-100 font-bold rounded-xl">Hủy</button>
            <button type="submit" className="flex-1 py-3 bg-yellow-600 text-white font-bold rounded-xl">Lưu lại</button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {badges.length === 0 && (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-xs">Chưa có danh hiệu nào. Hãy tạo thử nhé!</p>
            </div>
          )}
          {badges.map(badge => (
            <div key={badge.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{badge.icon}</span>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{badge.name}</p>
                  <p className="text-[10px] text-slate-400">Làm {badge.requiredCompletions} lần • Tước sau {badge.revocationThreshold} lần bỏ</p>
                </div>
              </div>
              <button onClick={() => handleDelete(badge.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
            </div>
          ))}

          <div className="bg-blue-50 p-4 rounded-xl flex gap-3 mt-4">
             <Info className="w-5 h-5 text-blue-400 shrink-0" />
             <p className="text-[10px] text-blue-600 leading-tight">
                <strong>Gợi ý:</strong> Tạo danh hiệu giúp bé hào hứng hơn. Bé sẽ nhận được thông báo khi đạt đủ số lần hoàn thành nhiệm vụ tương ứng. Nếu bé quên làm quá số lần tước, danh hiệu sẽ biến mất.
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeManager;
