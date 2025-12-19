
import React, { useState } from 'react';
import { Plus, Eye, Save, RefreshCcw, Pencil } from 'lucide-react';
import { PetSpecies, UserData, PetState } from '../../types';
import { generateId, calculateMaxXp } from '../../utils';

const PetSpeciesManager = ({ user, speciesLibrary, setSpeciesLibrary, onUpdateUser }: any) => {
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
    else { const id = 'custom_' + generateId(); setSpeciesLibrary({ ...speciesLibrary, [id]: { id, name, isCustom: true, stages } }); }
    setIsCreating(false); setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {!isCreating ? (
        <>
          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-purple-900 flex items-center gap-2"><Eye className="w-5 h-5" /> Loài vật</h3>
              <button onClick={() => setIsCreating(true)} className="text-xs bg-purple-200 text-purple-800 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1"><Plus className="w-3 h-3" /> Tạo mới</button>
            </div>
            <div className="space-y-4">
              {Object.values(speciesLibrary).map((s: any) => (
                <div key={s.id} className="border-2 rounded-xl p-3 bg-white flex gap-3 relative">
                  <button onClick={() => { setEditingId(s.id); setName(s.name); setImages(s.stages.map((st:any)=>st.image)); setLevels(s.stages.map((st:any)=>st.minLevel)); setIsCreating(true); }} className="absolute top-2 right-2 p-2 bg-slate-50 rounded-full"><Pencil className="w-4 h-4"/></button>
                  <div className="flex-1">
                    <span className="font-bold block mb-1">{s.name}</span>
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
              <h3 className="font-bold text-slate-700 mb-2">Sửa bé thú cưng hiện tại</h3>
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border mb-2">
                <span>Level: <strong>{activePet.level}</strong></span>
                <div className="flex gap-2">
                  <button onClick={() => onUpdateUser({...user, pets: user.pets.map((p:any)=>p.id===activePet.id ? {...p, level: Math.max(1, p.level-1), xp: 0, maxXp: calculateMaxXp(Math.max(1, p.level-1))}:p)})} className="w-8 h-8 bg-slate-100 rounded-lg">-</button>
                  <button onClick={() => onUpdateUser({...user, pets: user.pets.map((p:any)=>p.id===activePet.id ? {...p, level: p.level+1, xp: 0, maxXp: calculateMaxXp(p.level+1)}:p)})} className="w-8 h-8 bg-slate-100 rounded-lg">+</button>
                </div>
              </div>
              <button onClick={() => { if(confirm("Reset về trứng?")) onUpdateUser({...user, pets: user.pets.map((p:any)=>p.id===activePet.id ? {...p, level: 1, xp: 0, maxXp: 100}:p)}) }} className="w-full py-3 bg-red-100 text-red-600 font-bold rounded-xl flex items-center justify-center gap-2"><RefreshCcw className="w-4 h-4" /> Reset level</button>
            </div>
          )}
        </>
      ) : (
        <form onSubmit={submit} className="p-4 bg-white border rounded-2xl space-y-4 animate-fade-in">
          <h3 className="font-bold">{editingId ? 'Sửa loài' : 'Loài mới'}</h3>
          <input type="text" required className="w-full p-3 border rounded-xl" placeholder="Tên loài..." value={name} onChange={e => setName(e.target.value)} />
          {[0,1,2,3].map(i => (
            <div key={i} className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border">
              <input type="text" className="w-12 h-12 text-center text-2xl border rounded-lg" value={images[i]} onChange={e => { const n = [...images]; n[i] = e.target.value; setImages(n); }} />
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-500">Level yêu cầu</label>
                <input type="number" className="w-full p-2 border rounded-lg" value={levels[i]} onChange={e => { const n = [...levels]; n[i] = Number(e.target.value); setLevels(n); }} />
              </div>
            </div>
          ))}
          <button type="submit" className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl flex justify-center items-center gap-2"><Save className="w-5 h-5"/> Lưu</button>
          <button type="button" onClick={() => setIsCreating(false)} className="w-full py-2 text-slate-400 font-bold">Hủy</button>
        </form>
      )}
    </div>
  );
};

export default PetSpeciesManager;
