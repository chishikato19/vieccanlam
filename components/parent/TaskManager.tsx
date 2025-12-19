
import React, { useState } from 'react';
import { Plus, Wand2, CheckCircle2, Save } from 'lucide-react';
import { Task } from '../../types';
import { COMMON_ICONS, AI_SUGGESTIONS } from '../../data';
import { generateId } from '../../utils';
import IconPicker from '../IconPicker';
import TaskCard from '../TaskCard';

const TaskManager = ({ tasks, setTasks }: { tasks: Task[], setTasks: (t: Task[]) => void }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState(10);
  const [icon, setIcon] = useState('⭐');
  const [isDaily, setIsDaily] = useState(true);

  const resetForm = () => { setEditingId(null); setTitle(''); setPoints(10); setIcon('⭐'); setIsDaily(true); };

  const submitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    if (editingId) {
      setTasks(tasks.map(t => t.id === editingId ? { ...t, title, points, icon, isDaily } : t));
    } else {
      setTasks([...tasks, { id: generateId(), title, points, icon, isDaily, status: 'todo' }]);
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submitTask} className={`p-4 rounded-2xl border space-y-3 ${editingId ? 'bg-orange-50' : 'bg-blue-50'}`}>
        <h3 className="font-bold">{editingId ? 'Sửa nhiệm vụ' : 'Thêm nhiệm vụ mới'}</h3>
        <div className="flex gap-2">
          <input type="text" placeholder="Tên nhiệm vụ" className="flex-1 p-3 rounded-xl border" value={title} onChange={e => setTitle(e.target.value)} />
          <button type="button" onClick={() => { const r = AI_SUGGESTIONS[Math.floor(Math.random()*AI_SUGGESTIONS.length)]; setTitle(r.title); setPoints(r.points); setIcon(r.icon); }} className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Wand2 className="w-5 h-5"/></button>
        </div>
        <div className="flex gap-2">
          <input type="number" className="w-20 p-3 rounded-xl border text-center" value={points} onChange={e => setPoints(Number(e.target.value))} />
          <IconPicker icons={COMMON_ICONS} selected={icon} onSelect={setIcon} />
          <div onClick={() => setIsDaily(!isDaily)} className="flex-1 flex items-center gap-2 bg-white px-3 rounded-xl border cursor-pointer">
            {isDaily && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
            <span className="text-sm">Hàng ngày</span>
          </div>
        </div>
        <button type="submit" className={`w-full py-3 text-white rounded-xl font-bold flex justify-center items-center gap-2 ${editingId ? 'bg-orange-500' : 'bg-blue-600'}`}>
          {editingId ? <Save className="w-5 h-5"/> : <Plus className="w-5 h-5"/>} {editingId ? 'Lưu' : 'Thêm'}
        </button>
      </form>
      <div className="space-y-2">
        {tasks.map(t => (
          <TaskCard key={t.id} task={t} onComplete={() => {}} isParentMode onEdit={(task) => { setEditingId(task.id); setTitle(task.title); setPoints(task.points); setIcon(task.icon); setIsDaily(task.isDaily); }} onDelete={(id) => setTasks(tasks.filter(x => x.id !== id))} />
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
