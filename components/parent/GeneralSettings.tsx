
import React, { useState } from 'react';
import { User, KeyRound, Wand2, ToggleLeft, ToggleRight } from 'lucide-react';
import { UserData } from '../../types';

const GeneralSettings = ({ user, onUpdateUser }: { user: UserData, onUpdateUser: (u: UserData) => void }) => {
  const [editName, setEditName] = useState(user.name);
  const [newPin, setNewPin] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><User className="w-5 h-5"/> Thông tin bé</h3>
        <div className="flex gap-2">
          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1 p-3 rounded-xl border border-slate-200" placeholder="Tên bé..." />
          <button onClick={() => { onUpdateUser({ ...user, name: editName }); alert('Đã lưu tên bé!'); }} className="bg-blue-600 text-white px-4 rounded-xl font-bold">Lưu</button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-700 flex items-center gap-2"><Wand2 className="w-5 h-5"/> Chế độ kiểm thử</h3>
            <p className="text-xs text-slate-500 mt-1">Hiện nút hack Xu/XP để thử nghiệm.</p>
          </div>
          <button onClick={() => onUpdateUser({ ...user, isTestingMode: !user.isTestingMode })} className={`text-3xl ${user.isTestingMode ? 'text-green-500' : 'text-slate-300'}`}>
            {user.isTestingMode ? <ToggleRight className="w-10 h-10 fill-current" /> : <ToggleLeft className="w-10 h-10" />}
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
        <h3 className="font-bold text-slate-700 flex items-center gap-2"><KeyRound className="w-5 h-5" /> Đổi mật khẩu</h3>
        <div className="flex gap-2">
          <input type="text" maxLength={4} placeholder="PIN mới (4 số)" className="flex-1 p-3 rounded-xl border border-slate-200 text-center tracking-widest font-bold" value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))} />
          <button onClick={() => { if (newPin.length === 4) { onUpdateUser({ ...user, pin: newPin }); setNewPin(''); alert('Đổi PIN thành công!'); } else alert('Nhập đủ 4 số.'); }} className="bg-slate-800 text-white px-4 rounded-xl font-bold">Lưu</button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
