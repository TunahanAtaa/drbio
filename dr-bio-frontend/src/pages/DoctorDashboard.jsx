import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Activity, Clock, FileText, CheckCircle, ChevronRight, AlertTriangle, Send, Search } from 'lucide-react';

const DoctorDashboard = () => {
  const { tab } = useParams();
  const [patients] = useState([
    { id: 1, name: 'Ahmet Yılmaz', date: '10 Ekim 2026', isCritical: true, note: '' },
    { id: 2, name: 'Ayşe Kaya', date: '09 Ekim 2026', isCritical: false, note: 'Tüm değerler normal.' }
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [noteText, setNoteText] = useState('');

  const handleSelect = (p) => {
    setSelectedPatient(p);
    setNoteText(p.note);
  };

  const handleSave = () => {
    alert('Yorum kaydedildi ve hastaya gönderildi!');
    setSelectedPatient(null);
  };

  return (
    <Layout title="Doktor Paneli" role="DOCTOR">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {(!tab || tab === 'patients') && (
          <>
            {/* Patient List */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-stone-800 dark:text-stone-200">Kritik Tahlil Bekleyenler</h2>
              {patients.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => handleSelect(p)}
                  className={`bg-theme-card rounded-[2rem] p-6 shadow-clay-card dark:shadow-clay-card-dark border ${p.isCritical && !p.note ? 'border-red-200 dark:border-red-900/30' : 'border-theme-border'} cursor-pointer hover:scale-[1.02] active:scale-95 transition-all`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-black text-lg text-stone-700 dark:text-stone-200">{p.name}</h3>
                      <div className="flex items-center space-x-2 mt-1 text-stone-400">
                        <Clock className="w-4 h-4" /> <span className="text-xs font-bold">{p.date}</span>
                      </div>
                    </div>
                    {p.isCritical && !p.note ? (
                      <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 rounded-full text-xs font-black flex items-center space-x-1">
                        <AlertTriangle className="w-4 h-4"/> <span>Kritik</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-500 rounded-full text-xs font-black flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4"/> <span>İncelendi</span>
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-stone-500 truncate">{p.note || 'Henüz not eklenmedi...'}</p>
                </div>
              ))}
            </div>

            {/* Moderation Panel */}
            <div className="bg-theme-card rounded-[2rem] p-8 shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex flex-col h-full min-h-[500px]">
              {selectedPatient ? (
                <div className="flex flex-col h-full animate-fade-in">
                  <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl"><FileText className="w-6 h-6"/></div>
                    <div>
                      <h2 className="text-xl font-black text-stone-800 dark:text-stone-200">{selectedPatient.name} Tahlili</h2>
                      <p className="text-xs font-bold text-stone-400">Tarih: {selectedPatient.date}</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 overflow-y-auto mb-6">
                    <div className="p-4 bg-theme-bg rounded-2xl shadow-inner">
                      <p className="text-sm font-black text-stone-400 mb-2">Sistem Analizi:</p>
                      <p className="text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                        {selectedPatient.isCritical ? 'Dikkat: Hemoglobin ve WBC değerleri referans aralığı dışında. Demir eksikliği şüphesi.' : 'Tüm değerler normal aralıkta seyretmektedir.'}
                      </p>
                    </div>
                    
                    <div className="mt-auto">
                      <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2 ml-2">Doktor Değerlendirmesi</label>
                      <textarea 
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        className="w-full h-40 p-4 bg-theme-bg rounded-3xl font-medium text-stone-700 dark:text-stone-300 shadow-inner focus:outline-none focus:ring-4 focus:ring-red-600/20 resize-none"
                        placeholder="Hastaya iletilecek notlarınızı buraya yazın..."
                      ></textarea>
                    </div>
                  </div>

                  <button 
                    onClick={handleSave}
                    className="w-full py-4 bg-red-600 text-white font-black rounded-3xl shadow-clay-btn active:shadow-clay-pressed active:scale-95 transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5"/> <span>Yorumu Onayla ve Hastaya Gönder</span>
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-stone-400">
                  <Activity className="w-16 h-16 text-stone-200 dark:text-stone-800 mb-4" />
                  <p className="font-bold text-lg">İncelemek için sol taraftan bir hasta seçin.</p>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'search' && (
          <div className="lg:col-span-2 bg-theme-card rounded-[2rem] p-8 shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex flex-col items-center justify-center min-h-[400px]">
            <Search className="w-16 h-16 text-stone-200 dark:text-stone-800 mb-4" />
            <h2 className="text-2xl font-black text-stone-800 dark:text-stone-200 mb-2">Hasta Arama Modülü</h2>
            <p className="text-stone-500 font-medium">Bu özellik henüz geliştirme aşamasındadır.</p>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default DoctorDashboard;
