
import React, { useState } from 'react';
import { Cloud, Upload, Download } from 'lucide-react';
import { saveToCloud, loadFromCloud } from '../../cloud';

const CloudSync = ({ user, tasks, rewards, speciesLibrary, onUpdateUser, onSyncData }: any) => {
  const [url, setUrl] = useState(user.googleScriptUrl || '');
  const [syncing, setSyncing] = useState(false);

  const handleSave = async () => {
    if (!url.trim()) return alert("Nhập link Script!");
    onUpdateUser({ ...user, googleScriptUrl: url.trim() });
    setSyncing(true);
    try {
      await saveToCloud(url.trim(), { user: { ...user, googleScriptUrl: url.trim() }, tasks, rewards, speciesLibrary });
      alert("Đã lưu!");
    } catch (e) { alert("Lỗi: " + e); } finally { setSyncing(false); }
  };

  const handleLoad = async () => {
    if (!url.trim()) return alert("Nhập link Script!");
    setSyncing(true);
    try {
      const data = await loadFromCloud(url.trim());
      if (data && confirm("Ghi đè dữ liệu cũ?")) onSyncData(data);
    } catch (e) { alert("Lỗi: " + e); } finally { setSyncing(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><Cloud className="w-5 h-5" /> Đồng bộ</h3>
        <input type="text" className="w-full p-2 text-xs border rounded-lg mb-4" placeholder="URL Google Apps Script..." value={url} onChange={e => setUrl(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleSave} disabled={syncing} className="p-4 bg-white border-2 border-blue-200 rounded-xl flex flex-col items-center"><Upload className="w-6 h-6 text-blue-500 mb-1"/><span className="text-xs font-bold">Lưu lên Mây</span></button>
          <button onClick={handleLoad} disabled={syncing} className="p-4 bg-white border-2 border-green-200 rounded-xl flex flex-col items-center"><Download className="w-6 h-6 text-green-500 mb-1"/><span className="text-xs font-bold">Tải về Máy</span></button>
        </div>
        {syncing && <p className="text-center text-xs font-bold text-blue-500 mt-2 animate-pulse">Đang xử lý...</p>}
      </div>
    </div>
  );
};

export default CloudSync;
