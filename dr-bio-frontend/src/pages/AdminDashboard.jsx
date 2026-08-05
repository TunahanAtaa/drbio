import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Database, Plus, Trash2, Users, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { tab = 'references' } = useParams();

  const [references, setReferences] = useState([
    { id: 1, name: 'Hemoglobin', min: '13.5', max: '17.5', unit: 'g/dL', text: 'Kansızlık veya polisitemi belirtisi olabilir.' },
    { id: 2, name: 'WBC', min: '4.5', max: '11.0', unit: '10^3/uL', text: 'Enfeksiyon veya bağışıklık sistemi reaksiyonu.' }
  ]);

  const [users] = useState([
    { id: 101, name: 'Ahmet Yılmaz', role: 'PATIENT', doctor: 'Dr. Veli' },
    { id: 102, name: 'Ayşe Kaya', role: 'PATIENT', doctor: 'Dr. Veli' }
  ]);

  const deleteRef = (id) => setReferences(references.filter(r => r.id !== id));
  const addRef = () => setReferences([...references, { id: Date.now(), name: 'Yeni Parametre', min: '0', max: '100', unit: 'unit', text: 'Otomatik öneri metni...' }]);

  return (
    <Layout title="Yönetici Paneli" role="ADMIN">
      <div className="flex space-x-4 mb-8 border-b-2 border-stone-200 dark:border-stone-800 pb-2">
        <a href="/admin/references" className={`pb-2 px-4 font-black ${tab === 'references' ? 'text-red-600 border-b-4 border-red-600' : 'text-stone-400'}`}>Referans Kütüphanesi</a>
        <a href="/admin/users" className={`pb-2 px-4 font-black ${tab === 'users' ? 'text-red-600 border-b-4 border-red-600' : 'text-stone-400'}`}>Kullanıcı Yönetimi</a>
      </div>

      {tab === 'references' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-stone-800 dark:text-stone-200">Referans Değerler</h2>
            <button onClick={addRef} className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white font-bold rounded-2xl shadow-clay-btn active:shadow-clay-pressed active:scale-95 transition-all">
              <Plus className="w-5 h-5" /> <span>Yeni Ekle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {references.map((ref) => (
              <div key={ref.id} className="bg-theme-card p-6 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full space-y-3">
                  <div className="flex gap-4">
                    <input type="text" value={ref.name} className="flex-1 p-3 bg-theme-bg rounded-2xl font-bold text-stone-700 dark:text-stone-200 shadow-inner" readOnly />
                    <input type="text" value={`${ref.min} - ${ref.max} ${ref.unit}`} className="w-32 p-3 bg-theme-bg rounded-2xl font-bold text-stone-500 shadow-inner text-center" readOnly />
                  </div>
                  <input type="text" value={ref.text} className="w-full p-3 bg-theme-bg rounded-2xl text-sm font-medium text-stone-500 shadow-inner" readOnly />
                </div>
                <button onClick={() => deleteRef(ref.id)} className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl hover:scale-105 active:scale-95 transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="bg-theme-card p-8 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border">
          <h2 className="text-2xl font-black text-stone-800 dark:text-stone-200 mb-6">Sistem Kullanıcıları</h2>
          <div className="space-y-4">
            {users.map(u => (
              <div key={u.id} className="p-4 bg-theme-bg rounded-2xl shadow-inner flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-theme-card rounded-xl shadow-sm"><Users className="w-5 h-5 text-stone-400" /></div>
                  <div>
                    <p className="font-black text-stone-700 dark:text-stone-200">{u.name}</p>
                    <p className="text-xs font-bold text-stone-400">Rol: {u.role === 'PATIENT' ? 'Hasta' : u.role}</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4"/> <span>Aktif</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;
