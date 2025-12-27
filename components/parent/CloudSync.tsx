
import React, { useState } from 'react';
import { Cloud, Save, Download, Link2, Info } from 'lucide-react';
import { UserData } from '../../types';
import { loadFromCloud, saveToCloud } from '../../cloud';

const CloudSync = ({ user, tasks, rewards, speciesLibrary, onUpdateUser, onSyncData }: any) => {
  const [scriptUrl, setScriptUrl] = useState(user.googleScriptUrl || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateUrl = () => {
    onUpdateUser({ ...user, googleScriptUrl: scriptUrl });
    alert("Đã cập nhật đường dẫn!");
  };

  const handleSaveNow = async () => {
    if (!scriptUrl) return alert("Vui lòng nhập URL trước!");
    setIsLoading(true);
    try {
      await saveToCloud(scriptUrl, { user, tasks, rewards, speciesLibrary });
      alert("Đã sao lưu dữ liệu lên đám mây!");
    } catch (e) {
      alert("Lỗi sao lưu. Kiểm tra lại đường dẫn.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadNow = async () => {
    if (!scriptUrl) return alert("Vui lòng nhập URL trước!");
    if (!confirm("Tải dữ liệu từ đám mây sẽ ghi đè lên dữ liệu hiện tại trên máy. Bạn có chắc chắn?")) return;
    
    setIsLoading(true);
    try {
      const data = await loadFromCloud(scriptUrl);
      if (data) {
        onSyncData(data);
        alert("Đã đồng bộ dữ liệu thành công!");
      } else {
        alert("Không tìm thấy dữ liệu trên Cloud.");
      }
    } catch (e) {
      alert("Lỗi tải dữ liệu. Kiểm tra lại đường dẫn.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
        <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2"><Cloud className="w-5 h-5"/> Đồng bộ Đám mây</h3>
        <p className="text-xs text-blue-600 mb-4 leading-relaxed">
          Sử dụng Google Apps Script và Google Sheets để lưu trữ dữ liệu. Giúp bé có thể chơi trên nhiều thiết bị khác nhau.
        </p>
        
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Google Script URL</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 p-3 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="https://script.google.com/macros/s/..."
                value={scriptUrl}
                onChange={e => setScriptUrl(e.target.value)}
              />
              <button onClick={handleUpdateUrl} className="bg-blue-600 text-white px-4 rounded-xl font-bold"><Link2 className="w-4 h-4"/></button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={handleSaveNow}
          disabled={isLoading || !scriptUrl}
          className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:bg-slate-50 transition-all disabled:opacity-50"
        >
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <Save className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-700">Lưu lên Cloud</span>
        </button>

        <button 
          onClick={handleLoadNow}
          disabled={isLoading || !scriptUrl}
          className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:bg-slate-50 transition-all disabled:opacity-50"
        >
          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-700">Tải từ Cloud</span>
        </button>
      </div>

      <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 flex gap-3">
        <Info className="w-5 h-5 text-slate-400 shrink-0" />
        <div className="text-[11px] text-slate-500 leading-normal">
          <p className="font-bold mb-1">Hướng dẫn nhanh:</p>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Tạo một file Google Sheet mới.</li>
            <li>Vào Extensions > Apps Script.</li>
            <li>Dán mã Script xử lý (do admin cung cấp).</li>
            <li>Deploy dưới dạng Web App và cho phép truy cập Anyone.</li>
            <li>Copy URL và dán vào ô ở trên.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CloudSync;
