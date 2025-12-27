
import React, { useState } from 'react';
import { Plus, Eye, Save, RefreshCcw, Pencil, Trash2, Heart } from 'lucide-react';
import { PetSpecies, UserData, PetState } from '../../types';
import { calculateMaxXp } from '../../utils';

const PetSpeciesManager = ({ 
  user, 
  speciesLibrary, 
  setSpeciesLibrary, 
  onUpdateUser,
  onDeletePet
}: {
  user: UserData,
  speciesLibrary: Record<string, PetSpecies>,
  setSpeciesLibrary: (lib: any) => void,
  onUpdateUser: (u: UserData) => void,
  onDeletePet: (id: string) => void
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [images, setImages] = useState(['🥚', '🐥', '🐓', '🦅']);
  const [levels, setLevels] = useState([1, 5, 15, 30]);

  const activePet = user.pets.find((p: any) => p.id === user.activePetId) || user.pets[0];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const stages = [0,1,2,3].map(i => ({ minLevel: levels[i], image: images[i], name: 'Giai đoạn ' + (i+1), dialogue: ['Chào bé!'] }));
    if (editingId) setSpeciesLibrary({ ...speciesLibrary, [editingId]: { ...speciesLibrary[editingId], name, stages } });
    else { const id = 'custom_' + Math.random().toString(36).substr(2, 9); setSpeciesLibrary({ ...speciesLibrary, [id]: { id, name, isCustom: true, stages } }); }
    setIsCreating(false); setEditingId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {!isCreating ? (
        <>
          {/* DANH SÁCH THÚ CƯNG BÉ ĐANG CÓ */}
          <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100">
             <h3 className="font-bold text-pink-900 mb-3 flex items-center gap-2"><Heart className="w-5 h-5" /> Thú cưng bé đang nuôi ({user.pets.length})</h3>
             <div className="space-y-2">
                {user.pets.map(p => {
                  // Fix: Added minLevel and other missing properties to fallback stage to satisfy PetStage type requirements
                  const s = speciesLibrary[p.speciesId] || { 
                    name: 'Loài lạ', 
                    stages: [{ minLevel: 1, image: '?', name: 'Lỗi', dialogue: [] }] 
                  };
                  const currentStage = [...s.stages].reverse().find(st => p.level >= st.minLevel) || s.stages[0];
                  const isActive = p.id === user.activePetId;

                  return (
                    <div key={p.id} className={`flex items-center justify-between bg-white p-3 rounded-xl border-2 transition-all ${isActive ? 'border-pink-300 shadow-md ring-2 ring-pink-50' : 'border-slate-100'}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{currentStage.image}</span>
                        <div>
                          <p className="text-sm font-bold text-slate-700 leading-none">{s.name}</p>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase">Level {p.level} {isActive ? '• Đang chọn' : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!isActive && (
                           <button onClick={() => onUpdateUser({...user, activePetId: p.id})} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg mr-1">Chọn</button>
                        )}
                        <button 
                          onClick={() => onDeletePet(p.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa thú cưng"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-purple-900 flex items-center gap-2"><Eye className="w-5 h-5" /> Thư viện loài vật</h3>
              <button onClick={() => setIsCreating(true)} className="text-xs bg-purple-200 text-purple-800 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1"><Plus className="w-3 h-3" /> Loài mới</button>
            </div>
            <div className="space-y-4">
              {Object.values(speciesLibrary).map((s: any) => (
                <div key={s.id} className="border-2 rounded-xl p-3 bg-white flex gap-3 relative border-slate-100">
                  <button onClick={() => { setEditingId(s.id); setName(s.name); setImages(s.stages.map((st:any)=>st.image)); setLevels(s.stages.map((st:any)=>st.minLevel)); setIsCreating(true); }} className="absolute top-2 right-2 p-2 bg-slate-50 rounded-full hover:bg-slate-100"><Pencil className="w-4 h-4 text-slate-400"/></button>
                  <div className="flex-1">
                    <span className="font-bold block mb-1 text-slate-700">{s.name}</span>
                    <div className="flex gap-2">
                      {s.stages.map((st: any) => ( <div key={st.minLevel} className="text-center"><span className="text-xl">{st.image}</span><span className="text-[9px] text-slate-400 block">Lv{st.minLevel}</span></div> ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {activePet && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-2">Sửa thông số bé {speciesLibrary[activePet.speciesId]?.name}</h3>
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border mb-2">
                <span className="text-sm font-bold text-slate-600">Cấp độ (Level)</span>
                <div className="flex gap-2">
                  <button onClick={() => onUpdateUser({...user, pets: user.pets.map((p:any)=>p.id===activePet.id ? {...p, level: Math.max(1, p.level-1), xp: 0, maxXp: calculateMaxXp(Math.max(1, p.level-1))}:p)})} className="w-8 h-8 bg-slate-100 rounded-lg font-bold">-</button>
                  <span className="w-8 flex items-center justify-center font-bold text-blue-600">{activePet.level}</span>
                  <button onClick={() => onUpdateUser({...user, pets: user.pets.map((p:any)=>p.id===activePet.id ? {...p, level: p.level+1, xp: 0, maxXp: calculateMaxXp(p.level+1)}:p)})} className="w-8 h-8 bg-slate-100 rounded-lg font-bold">+</button>
                </div>
              </div>
              <button onClick={() => { if(confirm("Reset level về trứng?")) onUpdateUser({...user, pets: user.pets.map((p:any)=>p.id===activePet.id ? {...p, level: 1, xp: 0, maxXp: 100}:p)}) }} className="w-full py-3 bg-red-100 text-red-600 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-200 transition-colors"><RefreshCcw className="w-4 h-4" /> Reset level</button>
            </div>
          )}
        </>
      ) : (
        <form onSubmit={submit} className="p-4 bg-white border rounded-2xl space-y-4 animate-fade-in shadow-xl">
          <h3 className="font-bold text-lg text-slate-800">{editingId ? 'Sửa loài vật' : 'Thêm loài vật mới'}</h3>
          <input type="text" required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-purple-400" placeholder="Tên loài (ví dụ: Rồng Lửa)..." value={name} onChange={e => setName(e.target.value)} />
          {[0,1,2,3].map(i => (
            <div key={i} className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border">
              <input type="text" className="w-12 h-12 text-center text-2xl border rounded-lg bg-white" value={images[i]} onChange={e => { const n = [...images]; n[i] = e.target.value; setImages(n); }} />
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-500 block">Level yêu cầu giai đoạn {i+1}</label>
                <input type="number" className="w-full p-2 border rounded-lg bg-white mt-1" value={levels[i]} onChange={e => { const n = [...levels]; n[i] = Number(e.target.value); setLevels(n); }} />
              </div>
            </div>
          ))}
          <button type="submit" className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl flex justify-center items-center gap-2 shadow-lg hover:bg-purple-700 transition-colors"><Save className="w-5 h-5"/> Lưu loài vật</button>
          <button type="button" onClick={() => setIsCreating(false)} className="w-full py-2 text-slate-400 font-bold">Quay lại</button>
        </form>
      )}
    </div>
  );
};

export default PetSpeciesManager;
