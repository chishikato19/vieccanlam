
import React from 'react';
import { Star, CheckCircle2, Trash2, Pencil, Zap } from 'lucide-react';
import { Task } from '../types';

const TaskCard: React.FC<{ 
  task: Task; 
  onComplete: (id: string, points: number) => void;
  onDelete?: (id: string) => void;
  onEdit?: (task: Task) => void;
  isParentMode?: boolean;
}> = ({ task, onComplete, onDelete, onEdit, isParentMode }) => {
  const isDone = task.status === 'done';

  const handleClick = () => {
    if (!isDone && !isParentMode) {
      onComplete(task.id, task.points);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`relative group overflow-hidden rounded-2xl p-4 transition-all duration-300 transform 
      ${isDone 
        ? 'bg-green-100 border-2 border-green-200 opacity-80 scale-95' 
        : 'bg-white border-2 border-slate-100 shadow-lg hover:-translate-y-1 hover:shadow-xl active:scale-95 cursor-pointer'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-colors shrink-0
          ${isDone ? 'bg-green-200' : 'bg-blue-50'}`}>
          {task.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold text-lg leading-tight truncate ${isDone ? 'text-green-800 line-through' : 'text-slate-800'}`}>
              {task.title}
            </h3>
            {task.streak > 0 && !isDone && (
              <span className="flex items-center gap-0.5 bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-[10px] font-black animate-bounce">
                <Zap className="w-3 h-3 fill-current" /> {task.streak} ngày
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1
              ${isDone ? 'bg-green-200 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              <Star className="w-3 h-3 fill-current" />
              {task.points} xu
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-md border ${task.isDaily ? 'bg-blue-50 text-blue-500 border-blue-100' : 'bg-purple-50 text-purple-500 border-purple-100'}`}>
              {task.isDaily ? 'Hàng ngày' : 'Đột xuất'}
            </span>
          </div>
        </div>

        {!isParentMode && (
           <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all shrink-0
             ${isDone ? 'bg-green-500 border-green-500' : 'border-slate-200 group-hover:border-blue-300'}`}>
             {isDone && <CheckCircle2 className="w-5 h-5 text-white" />}
           </div>
        )}

        {isParentMode && (
          <div className="flex gap-2">
            {onEdit && (
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                className="p-2 bg-blue-100 text-blue-500 rounded-full hover:bg-blue-200 z-10"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                className="p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-200 z-10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
      
      {!isDone && (
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
      )}
    </div>
  );
};

export default TaskCard;
