
import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ListTodo } from 'lucide-react';
import { Task } from '../../types';
import IconPicker from '../IconPicker';
import { COMMON_ICONS } from '../../data';
import { generateId } from '../../utils';

const TaskManager = ({ tasks, setTasks }: { tasks: Task[], setTasks: (t: Task[]) => void }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState(10);
  const [icon, setIcon] = useState('✨');
  const [isDaily, setIsDaily] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, title, points, icon, isDaily } : t));
    } else {
      const newTask: Task = { id: generateId(), title, points, icon, isDaily, status: 'todo' };
      setTasks([...tasks, newTask]);
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingTask(null);
    setIsAdding(false);
    setTitle('');
    setPoints(10);
    setIcon('✨');
    setIsDaily(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setPoints(task.points);
    setIcon(task.icon);
    setIsDaily(task.isDaily);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Xóa nhiệm vụ này?")) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-700 flex items-center gap-2"><ListTodo className="w-5 h-5"/> Quản lý Nhiệm vụ</h3>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
            <Plus className="w-3 h-3" /> Thêm mới
          </button>
        )}
      </div>

      {isAdding ? (
        <form onSubmit={handleSave} className="bg-white p-4 border rounded-2xl space-y-4 shadow-lg animate-pop">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Tên nhiệm vụ</label>
            <input type="text" required className="w-full p-3 border rounded-xl outline-none" value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: Quét nhà giúp mẹ..." />
          </div>
          <div className="flex gap-4">
             <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 block mb-1">Điểm thưởng (Xu)</label>
                <input type="number" className="w-full p-3 border rounded-xl" value={points} onChange={e => setPoints(Number(e.target.value))} />
             </div>
             <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Biểu tượng</label>
                <IconPicker icons={COMMON_ICONS} selected={icon} onSelect={setIcon} />
             </div>
          </div>
          <div className="flex items-center gap-2 py-2">
             <input type="checkbox" id="isDaily" checked={isDaily} onChange={e => setIsDaily(e.target.checked)} className="w-4 h-4" />
             <label htmlFor="isDaily" className="text-sm font-bold text-slate-700">Nhiệm vụ hàng ngày (làm mới mỗi ngày)</label>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={resetForm} className="flex-1 py-3 bg-slate-100 font-bold rounded-xl">Hủy</button>
            <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl">Lưu lại</button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{task.icon}</span>
                <div>
                  <p className="font-bold text-slate-800 text-sm leading-tight">{task.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{task.points} xu • {task.isDaily ? 'Hàng ngày' : 'Đột xuất'}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(task)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4"/></button>
                <button onClick={() => handleDelete(task.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskManager;
