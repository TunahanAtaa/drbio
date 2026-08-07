import React, { useState } from 'react';
import { 
  CalendarDays, Clock, Pill, CheckCircle2, AlertCircle, 
  Search, Filter, User, Bot, Sparkles, Send, Bell, ChevronDown, 
  ChevronUp, Check, X, ShieldCheck, Activity 
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

// Örnek Hasta Ajanda Verileri (Admin Tarafında Tüm Hastaların İlaç ve Görev Takibi)
const DEFAULT_ALL_PATIENT_AGENDAS = [
  {
    patientId: 'p-1',
    patientName: 'Zeynep Ersal',
    patientEmail: 'hasta@drbio.com',
    avatar: 'Z',
    items: [
      { id: 'ag-1', title: 'Tiroit İlacı (Euthyrox 50mcg)', time: '08:00', dosage: '1 Tablet', instruction: 'Sabah aç karnına bol su ile.', category: 'MEDICINE', completed: true, completedAt: '08:02' },
      { id: 'ag-2', title: 'Vitamin B12 & D3 Desteği', time: '12:30', dosage: '5 Damla', instruction: 'Öğle yemeği sonrasında.', category: 'VITAMIN', completed: false, completedAt: null },
      { id: 'ag-3', title: 'Günlük 2.5 Litre Su Hedefi', time: '16:00', dosage: '500 ml', instruction: 'Böbrek sağlığı için su tüketimi.', category: 'WATER', completed: false, completedAt: null },
      { id: 'ag-4', title: 'Omega-3 Balık Yağı', time: '20:00', dosage: '1 Kapsül', instruction: 'Akşam yemeğinden sonra.', category: 'VITAMIN', completed: false, completedAt: null },
      { id: 'ag-5', title: '🤖 D Vitamini & Güneş Rutini', time: '10:30', dosage: '15 Dk Güneş + D3', instruction: 'Düşük D Vitamini (14.2 ng/mL) takibi.', category: 'ROUTINE', isAiGenerated: true, labSource: 'D Vitamini (14.2 ng/mL)', completed: false, completedAt: null }
    ]
  },
  {
    patientId: 'p-2',
    patientName: 'Burak Öztürk',
    patientEmail: 'burak.ozturk@yahoo.com',
    avatar: 'B',
    items: [
      { id: 'b-1', title: 'Tansiyon İlacı (Coveram 5/5mg)', time: '08:30', dosage: '1 Tablet', instruction: 'Sabah kahvaltısından önce.', category: 'MEDICINE', completed: true, completedAt: '08:35' },
      { id: 'b-2', title: 'Magnezyum Kompleks', time: '21:30', dosage: '1 Şase', instruction: 'Gece uykudan önce.', category: 'VITAMIN', completed: true, completedAt: '21:28' },
      { id: 'b-3', title: '🤖 Karaciğer Yağlanma Detoksu', time: '19:00', dosage: 'Enginar Ekstratı', instruction: 'ALT (58 U/L) yüksekliği için detoks.', category: 'ROUTINE', isAiGenerated: true, labSource: 'ALT Enzimi (58 U/L)', completed: false, completedAt: null }
    ]
  },
  {
    patientId: 'p-3',
    patientName: 'Canan Arslan',
    patientEmail: 'canan.arslan@outlook.com',
    avatar: 'C',
    items: [
      { id: 'c-1', title: 'Demir İlacı (Ferro Sanol)', time: '07:30', dosage: '1 Kapsül', instruction: 'Sabah aç karnına C vitamini ile.', category: 'MEDICINE', completed: true, completedAt: '07:31' },
      { id: 'c-2', title: 'B12 Dilaltı Damla', time: '13:00', dosage: '2 Damla', instruction: 'Öğle saatinde.', category: 'VITAMIN', completed: true, completedAt: '13:05' },
      { id: 'c-3', title: 'Günlük 2 Litre Su Rutini', time: '18:00', dosage: '400 ml', instruction: 'Su tüketim hedefi.', category: 'WATER', completed: true, completedAt: '18:00' }
    ]
  },
  {
    patientId: 'p-4',
    patientName: 'Deniz Yıldız',
    patientEmail: 'deniz.yildiz@gmail.com',
    avatar: 'D',
    items: [
      { id: 'd-1', title: 'Diyabet İlacı (Glucophage 850mg)', time: '09:00', dosage: '1 Tablet', instruction: 'Kahvaltı ortasında.', category: 'MEDICINE', completed: false, completedAt: null },
      { id: 'd-2', title: 'Diyabet İlacı (Glucophage 850mg)', time: '19:00', dosage: '1 Tablet', instruction: 'Akşam yemeği ortasında.', category: 'MEDICINE', completed: false, completedAt: null },
      { id: 'd-3', title: '🤖 Yemek Sonrası 15 Dk Yürüyüş', time: '20:00', dosage: '15 Dk Tempolu', instruction: 'HbA1c (%7.2) yüksekliği için yürüyüş.', category: 'ROUTINE', isAiGenerated: true, labSource: 'HbA1c (%7.2)', completed: false, completedAt: null }
    ]
  },
  {
    patientId: 'p-5',
    patientName: 'Selin Tekin',
    patientEmail: 'selin.tekin@icloud.com',
    avatar: 'S',
    items: [
      { id: 's-1', title: 'Çinko & C Vitamini', time: '11:00', dosage: '1 Efervesan', instruction: 'Bol su ile eriterek.', category: 'VITAMIN', completed: true, completedAt: '11:04' },
      { id: 's-2', title: 'Probiyotik Kapsül', time: '22:00', dosage: '1 Kapsül', instruction: 'Yatmadan önce su ile.', category: 'VITAMIN', completed: false, completedAt: null }
    ]
  }
];

const AdminAgendaTab = () => {
  const [patientAgendas, setPatientAgendas] = useState(DEFAULT_ALL_PATIENT_AGENDAS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedPatientId, setExpandedPatientId] = useState('p-1'); // Varsayılan Zeynep Ersal açık
  const [notifToast, setNotifToast] = useState('');
  const [sentReminders, setSentReminders] = useState({});

  // Arama ve Filtreleme
  const filteredPatients = patientAgendas.map(patient => {
    const matchesSearch = patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.items.some(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const filteredItems = patient.items.filter(item => {
      if (statusFilter === 'COMPLETED') return item.completed;
      if (statusFilter === 'PENDING') return !item.completed;
      if (statusFilter === 'AI') return item.isAiGenerated;
      return true;
    });

    return { ...patient, filteredItems, matchesSearch };
  }).filter(p => p.matchesSearch && p.filteredItems.length > 0);

  // Genel KPI İstatistikleri
  let grandTotalItems = 0;
  let grandCompletedItems = 0;
  let grandPendingItems = 0;

  patientAgendas.forEach(patient => {
    patient.items.forEach(item => {
      grandTotalItems += 1;
      if (item.completed) grandCompletedItems += 1;
      else grandPendingItems += 1;
    });
  });

  const grandAdherenceRate = grandTotalItems > 0 ? Math.round((grandCompletedItems / grandTotalItems) * 100) : 0;

  // Hastaya İlaç Hatırlatıcısı Bildirimi Gönderme
  const handleSendReminderNotif = (patientEmail, patientName, itemTitle, itemTime, itemId) => {
    try {
      const userNotifKey = `drbio_notif_${patientEmail.trim().toLowerCase()}`;
      let currentNotifs = [];
      const saved = localStorage.getItem(userNotifKey);
      if (saved) {
        try { const p = JSON.parse(saved); if (Array.isArray(p)) currentNotifs = p; } catch(e) {}
      }

      const adminReminderNotif = {
        id: Date.now(),
        title: `⚠️ Yönetici Hatırlatıcısı: ${itemTitle}`,
        text: `Sayın ${patientName}, saat ${itemTime} vaktinde almanız gereken "${itemTitle}" henüz onaylanmadı. Lütfen ilacınızı almayı unutmayınız.`,
        time: 'Az önce',
        unread: true,
        type: 'HEALTH'
      };

      localStorage.setItem(userNotifKey, JSON.stringify([adminReminderNotif, ...currentNotifs]));

      // Buton durumunu gönderildi yap
      setSentReminders(prev => ({ ...prev, [itemId]: true }));

      setNotifToast(`"${patientName}" kullanıcısına "${itemTitle}" için canlı ilaç hatırlatıcısı başarıyla gönderildi! 🔔`);
      setTimeout(() => setNotifToast(''), 4500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Üst Banner */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-900 rounded-[2.5rem] p-8 text-white shadow-clay-card dark:shadow-clay-card-dark relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-8 translate-y-8">
          <CalendarDays className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white">
            <ShieldCheck className="w-4 h-4 text-red-200" />
            <span>Yönetici Hasta İlaç & Görev Takip Paneli</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Sağlık Ajanda Takibi</h2>
          <p className="text-sm font-medium text-red-100 max-w-2xl leading-relaxed">
            Sistemdeki tüm hastaların günlük ilaç kullanım durumlarını, saatlerini ve AI tahlil önerilerine uyum oranlarını anlık olarak izleyin ve gerekirse hatırlatma gönderin.
          </p>
        </div>
      </div>

      {/* Canlı Bildirim Toast */}
      {notifToast && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-2xl flex items-center space-x-3 text-xs sm:text-sm font-bold animate-fade-in shadow-sm">
          <Bell className="w-5 h-5 shrink-0 animate-bounce" />
          <span>{notifToast}</span>
        </div>
      )}

      {/* 2. Genel KPI İstatistik Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5 flex items-center space-x-4 border-l-4 border-l-red-600">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-950/60 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 font-black">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Takip Edilen Hasta</span>
            <span className="text-2xl font-black text-stone-800 dark:text-stone-100">{patientAgendas.length}</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center space-x-4 border-l-4 border-l-emerald-500">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">İlacını Alanlar</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{grandCompletedItems}</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center space-x-4 border-l-4 border-l-amber-500">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/60 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 font-black">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Bekleyen İlaçlar</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{grandPendingItems}</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center space-x-4 border-l-4 border-l-sky-500">
          <div className="w-12 h-12 bg-sky-100 dark:bg-sky-950/60 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400 font-black">
            <Activity className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Genel İlaç Uyum Oranı</span>
              <span className="text-sm font-black text-sky-600 dark:text-sky-400">%{grandAdherenceRate}</span>
            </div>
            <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="h-full bg-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${grandAdherenceRate}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Arama & Filtreleme Barı */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-100 dark:border-stone-800 pb-4 gap-4">
          <div>
            <h3 className="text-xl font-black text-stone-800 dark:text-stone-100">Hasta İlaç & Rutin Detayları</h3>
            <p className="text-xs font-bold text-stone-400">Hastaların tanımlı ilaç saatlerini ve kullanım durumlarını inceleyin</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
            {/* Arama Kutusu */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Hasta adı, e-posta veya ilaç ara..."
                className="w-full pl-10 pr-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-800 rounded-xl text-xs font-bold text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {/* Durum Filtresi */}
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2.5 text-xs font-bold w-auto"
            >
              <option value="ALL">Tüm İlaçlar & Görevler</option>
              <option value="PENDING">🟡 Sadece Bekleyenler / Almayanlar</option>
              <option value="COMPLETED">🟢 Sadece Alınanlar / Tamamlananlar</option>
              <option value="AI">🤖 Sadece AI Tahlil Önerileri</option>
            </Select>
          </div>
        </div>

        {/* 4. Hasta BAZLI Akordiyon / İlaç Takip Kartları */}
        {filteredPatients.length > 0 ? (
          <div className="space-y-4">
            {filteredPatients.map((patient) => {
              const pTotal = patient.items.length;
              const pCompleted = patient.items.filter(i => i.completed).length;
              const pRate = pTotal > 0 ? Math.round((pCompleted / pTotal) * 100) : 0;
              const isExpanded = expandedPatientId === patient.patientId;

              return (
                <div 
                  key={patient.patientId}
                  className="bg-theme-bg border border-stone-200/80 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  {/* Hasta Başlık Kartı (Tıklanınca Detay Açılır/Kapanır) */}
                  <div 
                    onClick={() => setExpandedPatientId(isExpanded ? null : patient.patientId)}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-clay-btn shrink-0">
                        {patient.avatar}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-black text-stone-800 dark:text-stone-100 text-base">
                            {patient.patientName}
                          </h4>
                          <span className="px-2.5 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-full text-[10px] font-black border border-stone-200 dark:border-stone-700">
                            {patient.patientEmail}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 text-xs font-bold text-stone-500 dark:text-stone-400 mt-1 flex-wrap gap-y-1">
                          <span>Tanımlı İlaç: <b>{pTotal}</b></span>
                          <span>—</span>
                          <span className="text-emerald-600 dark:text-emerald-400">Alınan: <b>{pCompleted}</b></span>
                          <span>—</span>
                          <span className="text-amber-600 dark:text-amber-400">Bekleyen: <b>{pTotal - pCompleted}</b></span>
                        </div>
                      </div>
                    </div>

                    {/* Uyum Oranı ve Aç/Kapa İkonu */}
                    <div className="flex items-center space-x-4 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">İlaç Uyum Oranı</span>
                        <span className={`text-base font-black ${pRate === 100 ? 'text-emerald-600 dark:text-emerald-400' : (pRate >= 50 ? 'text-sky-600 dark:text-sky-400' : 'text-amber-600 dark:text-amber-400')}`}>
                          %{pRate}
                        </span>
                      </div>

                      <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Hasta İlaç ve Görev Detay Listesi */}
                  {isExpanded && (
                    <div className="p-5 bg-stone-50/50 dark:bg-stone-900/30 border-t border-stone-200/80 dark:border-stone-800 space-y-3">
                      <p className="text-[11px] font-black uppercase tracking-wider text-stone-400 mb-2">
                        {patient.patientName} — Günlük Saatli İlaç Çizelgesi:
                      </p>

                      {patient.filteredItems.map((item) => (
                        <div 
                          key={item.id}
                          className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                            item.completed 
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40' 
                              : 'bg-theme-card border-stone-200 dark:border-stone-800'
                          }`}
                        >
                          <div className="flex items-start space-x-3.5">
                            {/* Saat Rozeti */}
                            <div className="px-3 py-1.5 bg-red-600 text-white rounded-xl font-black text-xs flex items-center space-x-1 shrink-0">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{item.time}</span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 flex-wrap">
                                <h5 className={`font-black text-sm ${item.completed ? 'line-through text-stone-400' : 'text-stone-800 dark:text-stone-100'}`}>
                                  {item.title}
                                </h5>
                                {item.isAiGenerated && (
                                  <span className="px-2 py-0.5 bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 text-[10px] font-black rounded-full border border-red-200 dark:border-red-900">
                                    🤖 AI Tahlil Önerisi
                                  </span>
                                )}
                              </div>

                              <p className="text-xs font-bold text-stone-500 dark:text-stone-400">
                                <b>Dozaj:</b> {item.dosage} — <i>"{item.instruction}"</i>
                              </p>

                              {item.labSource && (
                                <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 block">
                                  Tahlil Kaynağı: {item.labSource}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Durum Rozeti ve Hatırlatma Gönder Butonu */}
                          <div className="flex items-center space-x-3 self-end md:self-center">
                            {item.completed ? (
                              <span className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-black flex items-center space-x-1 border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Saat {item.completedAt || item.time}'de Alındı</span>
                              </span>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span className="px-3 py-1.5 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-black flex items-center space-x-1 border border-amber-200 dark:border-amber-800">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Bekliyor (Alınmadı)</span>
                                </span>

                                {sentReminders[item.id] ? (
                                  <span
                                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-black shadow-sm flex items-center space-x-1 shrink-0 animate-fade-in border border-emerald-500"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                                    <span>Gönderildi 🟢</span>
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleSendReminderNotif(patient.patientEmail, patient.patientName, item.title, item.time, item.id)}
                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-clay-btn transition flex items-center space-x-1 shrink-0 active:scale-95"
                                    title="Hastaya İlaç Bildirimi Gönder"
                                  >
                                    <Bell className="w-3.5 h-3.5" />
                                    <span>Hatırlat</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-stone-400 font-bold text-sm">
            Arama kriterlerine uygun hasta veya ilaç kaydı bulunamadı.
          </div>
        )}
      </Card>

    </div>
  );
};

export default AdminAgendaTab;
