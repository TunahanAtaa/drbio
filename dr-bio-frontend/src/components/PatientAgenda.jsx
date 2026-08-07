import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, Clock, Plus, CheckCircle2, Pill, Droplet, 
  Activity, Stethoscope, Trash2, Bell, AlertCircle, Sparkles, Check, X, 
  HeartPulse, ShieldCheck, Filter, ChevronRight, CheckCircle, Bot, AlertTriangle 
} from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Card from './ui/Card';

const DEFAULT_SAMPLE_AGENDA = [
  {
    id: 'ag-1',
    title: 'Tiroit İlacı (Euthyrox 50mcg)',
    time: '08:00',
    dosage: '1 Tablet',
    instruction: 'Sabah aç karnına bol su ile içilecek.',
    category: 'MEDICINE',
    completed: true,
    completedAt: '08:02'
  },
  {
    id: 'ag-2',
    title: 'Vitamin B12 & D3 Desteği',
    time: '12:30',
    dosage: '5 Damla',
    instruction: 'Öğle yemeği sonrasında alınacak.',
    category: 'VITAMIN',
    completed: false,
    completedAt: null
  },
  {
    id: 'ag-3',
    title: 'Günlük 2.5 Litre Su Hedefi',
    time: '16:00',
    dosage: '500 ml',
    instruction: 'Böbrek ve metabolizma sağlığı için su içmeyi unutmayın.',
    category: 'WATER',
    completed: false,
    completedAt: null
  },
  {
    id: 'ag-4',
    title: 'Omega-3 Balık Yağı',
    time: '20:00',
    dosage: '1 Kapsül',
    instruction: 'Akşam yemeğinden sonra tok karnına.',
    category: 'VITAMIN',
    completed: false,
    completedAt: null
  },
  {
    id: 'ag-5',
    title: 'D Vitamini & Güneş Rutini',
    time: '10:30',
    dosage: '15 Dk Güneş + D3',
    instruction: 'Geçmiş tahlilinizdeki düşük D Vitamini (14.2 ng/mL) için kemik ve bağışıklık desteği.',
    category: 'ROUTINE',
    isAiGenerated: true,
    labSource: 'D Vitamini (14.2 ng/mL - Düşük)',
    completed: false,
    completedAt: null
  },
  {
    id: 'ag-6',
    title: 'C Vitamini Destekli Demir Emilim Rutini',
    time: '15:00',
    dosage: 'Taze Narenciye Suyu',
    instruction: 'Son tahlildeki düşük Ferritin (11 ng/mL) seviyesini artırmak için C vitamini takviyesi.',
    category: 'ROUTINE',
    isAiGenerated: true,
    labSource: 'Ferritin (11 ng/mL - Düşük)',
    completed: false,
    completedAt: null
  },
  {
    id: 'ag-7',
    title: 'Yemek Sonrası 15 Dk Hafif Yürüyüş',
    time: '19:30',
    dosage: '15 Dakika Yürüyüş',
    instruction: 'Açlık Glukoz (112 mg/dL) ve insülin dengesini korumak için akşam yürüyüşü.',
    category: 'ROUTINE',
    isAiGenerated: true,
    labSource: 'Glukoz (112 mg/dL - Yüksek)',
    completed: false,
    completedAt: null
  }
];

const PatientAgenda = () => {
  const activeUser = (() => {
    try {
      const saved = localStorage.getItem('user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { email: 'hasta@drbio.com', name: 'Zeynep Ersal' };
  })();

  const userEmail = (activeUser.email || '').trim().toLowerCase();
  const storageKey = `drbio_patient_agenda_${userEmail}`;
  const notifKey = `drbio_notif_${userEmail}`;

  const [agendaList, setAgendaList] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_SAMPLE_AGENDA;
  });

  const [filterCategory, setFilterCategory] = useState('ALL');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    time: '09:00',
    dosage: '',
    instruction: '',
    category: 'MEDICINE'
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(agendaList));
    } catch (e) {
      console.error(e);
    }
  }, [agendaList, storageKey]);

  // AI Tahlil Taraması ile Yeni Görev Üretme
  const handleGenerateAiTasks = () => {
    const aiTasks = [
      {
        id: `ag-ai-${Date.now()}-1`,
        title: 'D Vitamini & Güneş Rutini',
        time: '10:30',
        dosage: '15 Dk Güneş + D3',
        instruction: 'Geçmiş tahlilinizdeki düşük D Vitamini (14.2 ng/mL) için kemik ve bağışıklık desteği.',
        category: 'ROUTINE',
        isAiGenerated: true,
        labSource: 'D Vitamini (14.2 ng/mL - Düşük)',
        completed: false,
        completedAt: null
      },
      {
        id: `ag-ai-${Date.now()}-2`,
        title: 'C Vitamini Destekli Demir Emilim Rutini',
        time: '15:00',
        dosage: 'Taze Narenciye Suyu',
        instruction: 'Son tahlildeki düşük Ferritin (11 ng/mL) seviyesini artırmak için C vitamini takviyesi.',
        category: 'ROUTINE',
        isAiGenerated: true,
        labSource: 'Ferritin (11 ng/mL - Düşük)',
        completed: false,
        completedAt: null
      },
      {
        id: `ag-ai-${Date.now()}-3`,
        title: 'Yemek Sonrası 15 Dk Hafif Yürüyüş',
        time: '19:30',
        dosage: '15 Dakika Yürüyüş',
        instruction: 'Açlık Glukoz (112 mg/dL) ve insülin dengesini korumak için akşam yürüyüşü.',
        category: 'ROUTINE',
        isAiGenerated: true,
        labSource: 'Glukoz (112 mg/dL - Yüksek)',
        completed: false,
        completedAt: null
      }
    ];

    // Var olanlarla birleştir (varsa tekrar ekleme)
    const existingIds = new Set(agendaList.map(a => a.title));
    const newFilteredAiTasks = aiTasks.filter(t => !existingIds.has(t.title));

    const finalList = [...agendaList, ...newFilteredAiTasks].sort((a, b) => a.time.localeCompare(b.time));
    setAgendaList(finalList);

    setSuccessToast('Yapay zeka geçmiş tahlillerinizi taradı ve kişiselleştirilmiş 3 yeni sağlık görevi ajandanıza tanımlandı!');
    setTimeout(() => setSuccessToast(''), 4500);
  };

  const handleAddAgendaItem = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newItem = {
      id: `ag-${Date.now()}`,
      title: formData.title.trim(),
      time: formData.time,
      dosage: formData.dosage.trim() || '1 Doz',
      instruction: formData.instruction.trim() || 'Zamanında alınacak.',
      category: formData.category,
      completed: false,
      completedAt: null
    };

    const updatedList = [...agendaList, newItem].sort((a, b) => a.time.localeCompare(b.time));
    setAgendaList(updatedList);

    try {
      let currentNotifs = [];
      const savedNotifs = localStorage.getItem(notifKey);
      if (savedNotifs) {
        try { const p = JSON.parse(savedNotifs); if (Array.isArray(p)) currentNotifs = p; } catch(e) {}
      }

      const newNotif = {
        id: Date.now(),
        title: `💊 İlaç Hatırlatıcısı: ${newItem.title}`,
        text: `Saat ${newItem.time} vaktiniz geldi. (${newItem.dosage} - ${newItem.instruction})`,
        time: 'Az önce',
        unread: true,
        type: 'HEALTH',
        agendaId: newItem.id
      };

      localStorage.setItem(notifKey, JSON.stringify([newNotif, ...currentNotifs]));
    } catch (e) {
      console.error(e);
    }

    setFormData({
      title: '',
      time: '09:00',
      dosage: '',
      instruction: '',
      category: 'MEDICINE'
    });

    setAddModalOpen(false);
    setSuccessToast('Yeni ilaç / görev başarıyla ajandanıza eklendi!');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const toggleComplete = (id) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const updated = agendaList.map(item => {
      if (item.id === id) {
        const isNowCompleted = !item.completed;
        return {
          ...item,
          completed: isNowCompleted,
          completedAt: isNowCompleted ? nowTime : null
        };
      }
      return item;
    });

    setAgendaList(updated);

    try {
      const savedNotifs = localStorage.getItem(notifKey);
      if (savedNotifs) {
        const parsed = JSON.parse(savedNotifs);
        if (Array.isArray(parsed)) {
          const updatedNotifs = parsed.map(n => {
            if (n.agendaId === id) {
              return { ...n, unread: false, text: `${n.text} (🟢 Aldım olarak işaretlendi)` };
            }
            return n;
          });
          localStorage.setItem(notifKey, JSON.stringify(updatedNotifs));
        }
      }
    } catch (e) {}
  };

  const handleDelete = (id) => {
    setAgendaList(agendaList.filter(item => item.id !== id));
  };

  const filteredItems = agendaList.filter(item => {
    if (filterCategory === 'ALL') return true;
    return item.category === filterCategory;
  });

  const totalCount = agendaList.length;
  const completedCount = agendaList.filter(item => item.completed).length;
  const pendingCount = totalCount - completedCount;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getCategoryBadge = (category, isAiGenerated) => {
    if (isAiGenerated) {
      return { 
        icon: Bot, 
        color: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 border-red-200 dark:border-red-900 font-black', 
        label: '🤖 AI Tahlil Önerisi' 
      };
    }
    switch (category) {
      case 'MEDICINE':
        return { icon: Pill, color: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 border-red-200 dark:border-red-900', label: 'İlaç' };
      case 'VITAMIN':
        return { icon: Sparkles, color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-900', label: 'Takviye / Vitamin' };
      case 'WATER':
        return { icon: Droplet, color: 'bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400 border-sky-200 dark:border-sky-900', label: 'Su Tüketimi' };
      default:
        return { icon: Stethoscope, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900', label: 'Sağlık Görevi' };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Şık Üst Banner */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-900 rounded-[2.5rem] p-8 text-white shadow-clay-card dark:shadow-clay-card-dark relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-8 translate-y-8">
          <HeartPulse className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white">
              <Bot className="w-4 h-4" />
              <span>AI Tahlil Destekli Akıllı Takip</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Sağlık Ajandam & AI Görevleri</h2>
            <p className="text-sm font-medium text-red-100 max-w-xl leading-relaxed">
              İlaç saatlerinizi kaydedin ve geçmiş laboratuvar tahlillerinizden yapay zeka tarafından otomatik oluşturulan sağlık rutinlerini takip edin.
            </p>
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-6 py-4 bg-white text-red-600 hover:bg-red-50 font-black rounded-2xl text-xs sm:text-sm shadow-clay-btn transition-transform hover:scale-105 active:scale-95 flex items-center space-x-2 shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Yeni İlaç / Görev Ekle</span>
          </button>
        </div>
      </div>

      {/* Başarı Toast */}
      {successToast && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-2xl flex items-center space-x-3 text-xs sm:text-sm font-bold animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* 2. Özet İstatistik Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5 flex items-center space-x-4 border-l-4 border-l-red-600">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-950/60 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 font-black">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Toplam Takip</span>
            <span className="text-2xl font-black text-stone-800 dark:text-stone-100">{totalCount}</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center space-x-4 border-l-4 border-l-emerald-500">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Tamamlanan (Aldım)</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{completedCount}</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center space-x-4 border-l-4 border-l-amber-500">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/60 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 font-black">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Bekleyen İlaçlar</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center space-x-4 border-l-4 border-l-sky-500">
          <div className="w-12 h-12 bg-sky-100 dark:bg-sky-950/60 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400 font-black">
            <Activity className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Tamamlama</span>
              <span className="text-sm font-black text-sky-600 dark:text-sky-400">%{completionRate}</span>
            </div>
            <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="h-full bg-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. AI TAHLİL ANALİZİ İLE GÖREV ÜRETME BANDI */}
      <div className="bg-gradient-to-r from-red-500/10 via-red-600/10 to-amber-500/10 p-5 rounded-2xl border border-red-200 dark:border-red-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-11 h-11 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black shadow-clay-btn shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-black text-stone-800 dark:text-stone-100 text-base">
                Geçmiş Tahlillerden Üretilen AI Sağlık Görevleri
              </h4>
              <span className="px-2.5 py-0.5 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                Yapay Zeka Analizli
              </span>
            </div>
            <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
              Yapay zeka asistanınız, tahlillerinizdeki referans dışı değerleri (Ferritin, D Vitamini, Glukoz vb.) tarayarak ajandanıza otomatik kişiselleştirilmiş sağlık görevleri tanımlar.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateAiTasks}
          className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-clay-btn transition flex items-center space-x-2 shrink-0 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Tahlillerimi Tara & AI Önerisi Üret</span>
        </button>
      </div>

      {/* 4. Filtreleme & Timeline Başlığı */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-100 dark:border-stone-800 pb-4 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-black text-stone-800 dark:text-stone-100">Bugünün Zaman Akış Çizgisi</h3>
              <span className="px-2.5 py-0.5 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-full text-xs font-black border border-red-200 dark:border-red-900">
                Canlı Akış
              </span>
            </div>
            <p className="text-xs font-bold text-stone-400 mt-0.5">
              İlaç ve AI tahlil önerilerinizi kronolojik zaman çizgisi üzerinde takip edin
            </p>
          </div>

          {/* Kategori Filtre Butonları */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'ALL', label: 'Tümü' },
              { id: 'MEDICINE', label: '💊 İlaçlar' },
              { id: 'VITAMIN', label: '✨ Takviyeler' },
              { id: 'WATER', label: '💧 Su' },
              { id: 'ROUTINE', label: '🩺 AI & Sağlık Görevleri' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                  filterCategory === tab.id
                    ? 'bg-red-600 text-white shadow-clay-btn'
                    : 'bg-theme-bg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Görsel Zaman Akış Çizgisi (Visual Timeline Track) */}
        {filteredItems.length > 0 ? (
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-1 before:bg-stone-200 dark:before:bg-stone-800 before:rounded-full">
            {filteredItems.map((item) => {
              const catBadge = getCategoryBadge(item.category, item.isAiGenerated);
              const CatIcon = catBadge.icon;

              return (
                <div key={item.id} className="relative group">
                  
                  {/* Timeline Düğüm Noktası (Node) */}
                  <div 
                    className={`absolute -left-6 sm:-left-8 top-3.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      item.completed
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950 shadow-md'
                        : item.isAiGenerated 
                          ? 'bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950 shadow-md'
                          : 'bg-red-600 text-white ring-4 ring-red-100 dark:ring-red-950 animate-pulse shadow-md'
                    }`}
                  >
                    {item.completed ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : item.isAiGenerated ? (
                      <Sparkles className="w-3 h-3" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>

                  {/* İlaç & Görev Kartı Container */}
                  <div 
                    className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md ${
                      item.completed
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-900/50'
                        : item.isAiGenerated
                          ? 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/60'
                          : 'bg-theme-bg border-stone-200/80 dark:border-stone-800 hover:border-red-400 dark:hover:border-red-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      
                      {/* Saat Rozeti */}
                      <div className="px-4 py-2.5 bg-red-600 text-white rounded-2xl font-black text-sm flex items-center space-x-1.5 shadow-clay-btn shrink-0 w-fit">
                        <Clock className="w-4 h-4" />
                        <span>{item.time}</span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <h4 className={`font-black text-base ${item.completed ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-800 dark:text-stone-100'}`}>
                            {item.title}
                          </h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border flex items-center space-x-1 ${catBadge.color}`}>
                            <CatIcon className="w-3 h-3" />
                            <span>{catBadge.label}</span>
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 text-xs font-bold text-stone-500 dark:text-stone-400 flex-wrap gap-y-1">
                          <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md text-stone-700 dark:text-stone-300">
                            <b>Dozaj/Hedef:</b> {item.dosage}
                          </span>
                          <span className="italic">"{item.instruction}"</span>
                        </div>

                        {/* AI Tahlil Kaynağı Etiketi */}
                        {item.labSource && (
                          <div className="pt-1 flex items-center space-x-1.5 text-[11px] font-black text-amber-700 dark:text-amber-400">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                            <span>Tahlil Kaynağı: {item.labSource}</span>
                          </div>
                        )}

                        {item.completed && item.completedAt && (
                          <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 pt-1">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Saat {item.completedAt}'de tamamlandı</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Aksiyon Butonları */}
                    <div className="flex items-center space-x-3 shrink-0 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-stone-200/60 dark:border-stone-800">
                      <button
                        onClick={() => toggleComplete(item.id)}
                        className={`px-5 py-3 rounded-2xl font-black text-xs transition-transform active:scale-95 flex items-center space-x-2 ${
                          item.completed
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900'
                            : 'bg-red-600 hover:bg-red-700 text-white shadow-clay-btn'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{item.completed ? '🟢 Tamamlandı (Geri Al)' : 'Tamamladım / Aldım'}</span>
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-3 text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-2xl transition"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-stone-400 space-y-3">
            <CalendarDays className="w-12 h-12 mx-auto text-stone-300" />
            <p className="font-bold text-sm">Seçili kategoride henüz kayıtlı bir görev bulunmuyor.</p>
            <Button variant="primary" onClick={handleGenerateAiTasks} className="text-xs space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>AI Tahlil Önerilerini Yükle</span>
            </Button>
          </div>
        )}
      </Card>

      {/* 6. Yeni İlaç / Görev Ekle Modalı */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-theme-card w-full max-w-lg rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-theme-border space-y-6">
            
            <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center font-black">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-800 dark:text-stone-100">Yeni İlaç / Görev Ekle</h3>
                  <p className="text-xs font-bold text-stone-400">Saatli hatırlatmanız için detayları girin</p>
                </div>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAgendaItem} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-stone-600 dark:text-stone-300 mb-1">
                  İlaç veya Görev Adı <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Örn: Euthyrox 50mcg, B12 Vitamini..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-stone-600 dark:text-stone-300 mb-1">
                    Hatırlatma Saati <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-stone-600 dark:text-stone-300 mb-1">
                    Kategori
                  </label>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="MEDICINE">💊 İlaç</option>
                    <option value="VITAMIN">✨ Takviye / Vitamin</option>
                    <option value="WATER">💧 Su Tüketimi</option>
                    <option value="ROUTINE">🩺 Sağlık Görevi</option>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-600 dark:text-stone-300 mb-1">
                  Dozaj / Miktar
                </label>
                <Input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  placeholder="Örn: 1 Tablet, 5 Damla, 500 ml..."
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-600 dark:text-stone-300 mb-1">
                  Kullanım Talimatı & Not
                </label>
                <Input
                  type="text"
                  value={formData.instruction}
                  onChange={(e) => setFormData({ ...formData, instruction: e.target.value })}
                  placeholder="Örn: Aç karnına, bol su ile, yemekten sonra..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setAddModalOpen(false)}
                >
                  Vazgeç
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajandaya Ekle</span>
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default PatientAgenda;
