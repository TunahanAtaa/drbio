import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Profile from './Profile';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Card from '../components/ui/Card';
import { 
  UploadCloud, AlertTriangle, CheckCircle, ArrowDownCircle, ArrowUpCircle, 
  Stethoscope, Sparkles, Loader2, FileText, Activity, Calendar, Clock, 
  Search, Filter, Eye, Download, Plus, HeartPulse, ChevronRight, ShieldCheck, 
  TrendingUp, Pill, Trash2, Star, MessageSquare
} from 'lucide-react';

const sampleHistory = [
  {
    id: 1,
    title: 'Biyokimya & Karaciğer Paneli',
    date: '2026-06-15',
    fileName: 'biyokimya_haziran.pdf',
    status: 'NORMAL',
    summaryNote: 'Böbrek ve karaciğer fonksiyon testleri tamamen referans aralıklarındadır.',
    doctorNote: 'Tüm değerler harika, rutin kontrollere devam edebilirsiniz.',
    params: [
      { name: 'ALT (SGPT)', value: '22 U/L', range: '7 - 56', status: 'NORMAL' },
      { name: 'AST (SGOT)', value: '25 U/L', range: '10 - 40', status: 'NORMAL' },
      { name: 'Kreatinin', value: '0.8 mg/dL', range: '0.6 - 1.2', status: 'NORMAL' },
      { name: 'Üre', value: '28 mg/dL', range: '10 - 50', status: 'NORMAL' }
    ]
  },
  {
    id: 2,
    title: 'Vitamin & Mineral Kontrolü',
    date: '2026-03-10',
    fileName: 'vitamin_paneli_mart.pdf',
    status: 'WARNING',
    summaryNote: '25-OH Vitamin D seviyesi referans değerin altındadır.',
    doctorNote: 'Haftalık D3 vitamini damlasına başlanması önerilir.',
    params: [
      { name: 'Vitamin D (25-OH)', value: '14.5 ng/mL', range: '30 - 100', status: 'LOW' },
      { name: 'Vitamin B12', value: '450 pg/mL', range: '200 - 900', status: 'NORMAL' },
      { name: 'Ferritin', value: '35 ng/mL', range: '12 - 150', status: 'NORMAL' }
    ]
  }
];

const PatientDashboard = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Tab yönetimi: 'dashboard' (Ana Sayfa), 'upload' (Tahlil Yükle), 'history' (Geçmiş Tahlillerim), 'profile' (Profilim)
  const [currentView, setCurrentView] = useState(tab || 'dashboard');

  useEffect(() => {
    if (tab) {
      setCurrentView(tab);
    } else {
      setCurrentView('dashboard');
    }
  }, [tab]);

  // Aktif kullanıcı adı ve e-postası
  const activeUser = (() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { name: 'Zeynep Ersal', email: 'hasta@drbio.com' };
  })();

  const userEmail = (activeUser.email || '').trim().toLowerCase();
  const isTestAccount = userEmail === 'hasta@drbio.com' || userEmail === 'admin@drbio.com';
  const historyStorageKey = `userTestHistory_${userEmail}`;

  // Geçmiş Tahliller Verisi State'i (Kullanıcı bazlı saklama)
  const [historyList, setHistoryList] = useState(() => {
    const saved = localStorage.getItem(historyStorageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // SADECE varsayılan test hesaplarında örnek tahlilleri göster. Diğer kullanıcılarda BOŞ DİZİ [] ver!
    return isTestAccount ? sampleHistory : [];
  });

  // Tahlil Yükleme ve Analiz State'leri
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [saveToast, setSaveToast] = useState('');

  // Geri Bildirim Modal & Form State'leri
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    // 3 yıldız ve altında yorum zorunlu
    if (feedbackRating <= 3 && !feedbackComment.trim()) return;
    // En az bir yıldız verilmiş olmalı
    if (feedbackRating === 0) return;

    const newFeedback = {
      id: Date.now(),
      userName: activeUser.name || 'Zeynep Ersal',
      userEmail: activeUser.email || 'hasta@drbio.com',
      rating: feedbackRating || 5,
      comment: feedbackComment.trim() || 'Hizmet ve tahlil değerlendirmesinden çok memnun kaldım.',
      date: new Date().toISOString().split('T')[0],
      status: 'UNREAD',
      category: feedbackRating <= 3 ? 'ŞİKAYET / ÖNERİ' : 'MEMNUNİYET'
    };

    const saved = localStorage.getItem('drbio_feedbacks');
    let list = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) list = parsed;
      } catch (e) {}
    }
    list = [newFeedback, ...list];
    localStorage.setItem('drbio_feedbacks', JSON.stringify(list));

    // Admin bildirim bell'ine yeni geri bildirim bildirimi ekle
    const adminNotifKey = 'admin_notifications';
    let adminNotifs = [];
    const savedAdmin = localStorage.getItem(adminNotifKey);
    if (savedAdmin) { try { const p = JSON.parse(savedAdmin); if (Array.isArray(p)) adminNotifs = p; } catch(e) {} }
    const ratingLabel = feedbackRating <= 3 ? `⚠️ Şikayet/Öneri` : `⭐ Memnuniyet`;
    const adminNotif = {
      id: Date.now() + 1,
      title: `Yeni Geri Bildirim — ${ratingLabel}`,
      text: `${activeUser.name || 'Hasta'} ${feedbackRating}/5 yıldız verdi. ${feedbackComment.trim() ? `"${feedbackComment.trim().substring(0, 60)}${feedbackComment.trim().length > 60 ? '...' : ''}"` : 'Yorumsuz değerlendirme.'}`,
      time: 'Az önce',
      unread: true,
      type: feedbackRating <= 3 ? 'COMPLAINT' : 'REVIEW'
    };
    localStorage.setItem(adminNotifKey, JSON.stringify([adminNotif, ...adminNotifs]));

    setFeedbackSuccess('Geri bildiriminiz ve puanınız yönetime başarıyla iletildi. Değerli görüşleriniz için teşekkür ederiz!');
    setFeedbackComment('');
    setFeedbackRating(5);
    setFeedbackModalOpen(false);

    setTimeout(() => setFeedbackSuccess(''), 4000);
  };

  // Geçmiş Tahliller Arama & Filtreleme
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTestModal, setSelectedTestModal] = useState(null);

  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResults(null);

    setTimeout(() => {
      if (file.name.toLowerCase().includes('error')) {
        setError('Dosya okunamadı. Lütfen geçerli bir PDF veya resim tahlil dosyası yükleyin.');
        setFile(null);
        setLoading(false);
        return;
      }

      const mockResult = {
        id: Date.now(),
        title: file.name.replace('.pdf', '').replace('.png', '').replace('.jpg', '') || 'Yeni Yüklenen Tahlil',
        date: new Date().toISOString().split('T')[0],
        fileName: file.name,
        status: 'WARNING',
        params: [
          { name: 'Hemoglobin (HGB)', value: '11.2 g/dL', range: '13.5 - 17.5', status: 'LOW' },
          { name: 'WBC (Lökosit)', value: '8.4 x10^3/µL', range: '4.5 - 11.0', status: 'NORMAL' },
          { name: 'Kolesterol (Total)', value: '240 mg/dL', range: '0 - 200', status: 'HIGH' },
          { name: 'Ferritin', value: '18 ng/mL', range: '12 - 150', status: 'NORMAL' }
        ],
        systemNote: 'Hemoglobin değeriniz referans aralığının altındadır. Kansızlık (anemi) belirtisi olabilir. Kolesterol değeriniz yüksek, beslenmenize dikkat etmeniz tavsiye edilir.',
        doctorNote: 'Hafif demir eksikliği anemisi gözlenmiştir. Diyetinize kırmızı et ve yeşil yapraklı sebzeler ekleyin.'
      };

      setResults(mockResult);
      setLoading(false);
    }, 1500);
  };

  const handleSaveToHistory = () => {
    if (!results) return;
    const updated = [results, ...historyList];
    setHistoryList(updated);
    localStorage.setItem(historyStorageKey, JSON.stringify(updated));
    setSaveToast('Tahlil analiziniz geçmiş tahlillerinize başarıyla kaydedildi!');
    setTimeout(() => setSaveToast(''), 3000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) {
    return (
      <Layout title="Hasta Paneli" role="PATIENT">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-stone-400">
          <Loader2 className="w-16 h-16 animate-spin text-red-600 mb-6" />
          <h2 className="text-2xl font-black text-stone-700 dark:text-stone-200 mb-2">Tahlil Verileri Yükleniyor...</h2>
          <p className="font-bold">Lütfen bekleyin, bilgileriniz şifreli olarak getiriliyor.</p>
        </div>
      </Layout>
    );
  }

  // Filtrelenmiş geçmiş tahliller
  const filteredHistory = historyList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.summaryNote && item.summaryNote.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout title="Hasta Paneli" role="PATIENT" onViewChange={setCurrentView}>
      
      {/* 1. SEKMELERE GÖRE İÇERİK YÖNETİMİ */}

      {/* --- PROFiL SEKMESİ --- */}
      {currentView === 'profile' && <Profile />}

      {/* --- ANA SAYFA SEKMESİ --- */}
      {(currentView === 'dashboard' || currentView === 'home') && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Karşılama Banner */}
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-900 rounded-2xl p-8 text-white shadow-clay-card dark:shadow-clay-card-dark border-theme-border relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-8 translate-y-8">
              <HeartPulse className="w-80 h-80 text-white" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white">
                <ShieldCheck className="w-4 h-4" />
                <span>Dr. Bio Akıllı Sağlık Asistanı</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black">Hoş geldin, {activeUser.name}! 👋</h1>
              <p className="text-red-100 font-medium max-w-2xl text-sm sm:text-base leading-relaxed">
                Tahlil sonuçlarınızı yükleyerek yapay zeka destekli anlık referans analizlerini görüntüleyebilir ve sağlık geçmişinizi güvenle takip edebilirsiniz.
              </p>

              {/* Hızlı Eylem Butonları */}
              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/patient/upload')}
                  className="px-6 py-3.5 bg-white text-red-700 hover:bg-red-50 font-black rounded-2xl shadow-clay-btn hover:scale-105 active:scale-95 transition-all text-sm flex items-center space-x-2"
                >
                  <UploadCloud className="w-5 h-5" />
                  <span>Yeni Tahlil Yükle</span>
                </button>
                <button
                  onClick={() => navigate('/patient/history')}
                  className="px-6 py-3.5 bg-white/20 hover:bg-white/30 text-white border border-white/30 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all text-sm flex items-center space-x-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Geçmiş Tahlillerim ({historyList.length})</span>
                </button>
                <button
                  onClick={() => setFeedbackModalOpen(true)}
                  className="px-6 py-3.5 bg-white/20 hover:bg-white/30 text-white border border-white/30 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all text-sm flex items-center space-x-2"
                >
                  <Star className="w-5 h-5 fill-white" />
                  <span>Geri Bildirim & Yıldız Ver</span>
                </button>
              </div>
            </div>
          </div>

          {feedbackSuccess && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-2xl flex items-center space-x-3 text-sm font-bold animate-fade-in">
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
              <span>{feedbackSuccess}</span>
            </div>
          )}

          {/* İstatistik & Metrik Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-theme-card p-6 rounded-2xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center space-x-4">
              <div className="w-14 h-14 bg-red-50 dark:bg-red-950/40 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <span className="block text-xs font-black text-slate-400 uppercase tracking-wider">Son Tahlil Tarihi</span>
                <span className="text-lg font-black text-slate-800 dark:text-slate-100 truncate">
                  {historyList.length > 0 ? historyList[0].date : 'Yüklenmedi'}
                </span>
              </div>
            </div>

            <div className="bg-theme-card p-6 rounded-2xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center space-x-4">
              <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/40 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <span className="block text-xs font-black text-slate-400 uppercase tracking-wider">Anormal Değerler</span>
                <span className="text-base font-black text-amber-600 dark:text-amber-400">
                  {historyList.length > 0 
                    ? `${historyList[0].params.filter(p => p.status !== 'NORMAL').length} Parametre` 
                    : '0 Parametre'}
                </span>
              </div>
            </div>

            <div className="bg-theme-card p-6 rounded-2xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center space-x-4">
              <div className="w-14 h-14 bg-sky-50 dark:bg-sky-950/40 rounded-2xl flex items-center justify-center text-sky-600 shrink-0">
                <Pill className="w-7 h-7" />
              </div>
              <div>
                <span className="block text-xs font-black text-slate-400 uppercase tracking-wider">Günlük Takviye</span>
                <span className="text-base font-black text-slate-800 dark:text-slate-100">
                  {historyList.length > 0 ? 'Demir & D3' : 'Belirtilmedi'}
                </span>
              </div>
            </div>

            <div className="bg-theme-card p-6 rounded-2xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center space-x-4">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                <HeartPulse className="w-7 h-7" />
              </div>
              <div>
                <span className="block text-xs font-black text-slate-400 uppercase tracking-wider">Genel Takip</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  {historyList.length > 0 ? '%85 Stabil' : 'Veri Bekleniyor'}
                </span>
              </div>
            </div>
          </div>

          {/* Son Tahlil Özeti & Sağlık İpuçları */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sol: Son Tahlil Özet Kartı */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span>Son Yüklenen Tahlil Özeti</span>
                </h2>
                {historyList.length > 0 && (
                  <button 
                    onClick={() => navigate('/patient/history')}
                    className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1"
                  >
                    <span>Tümünü Gör</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {historyList.length > 0 ? (
                <div className="bg-theme-card rounded-2xl p-6 shadow-clay-card dark:shadow-clay-card-dark border-theme-border space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div>
                      <h3 className="font-black text-lg text-slate-800 dark:text-slate-100">{historyList[0].title}</h3>
                      <p className="text-xs text-slate-400 font-bold mt-0.5">Tarih: {historyList[0].date}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase inline-self-start sm:inline-self-auto border ${
                      historyList[0].status === 'NORMAL' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200'
                    }`}>
                      {historyList[0].status === 'NORMAL' ? 'Tüm Değerler Normal' : 'Takip Gerektiren Değer Var'}
                    </span>
                  </div>

                  {/* Parametre Özet Badgeleri */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {historyList[0].params.map((p, i) => (
                      <div key={i} className="bg-theme-bg p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                        <span className="block text-[10px] font-black text-slate-400 uppercase truncate">{p.name}</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-black text-slate-800 dark:text-slate-100">{p.value}</span>
                          {p.status === 'NORMAL' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                          {p.status === 'HIGH' && <ArrowUpCircle className="w-4 h-4 text-red-600" />}
                          {p.status === 'LOW' && <ArrowDownCircle className="w-4 h-4 text-sky-600" />}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sistem Önerisi */}
                  <div className="p-4 bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-start space-x-3 text-xs font-bold text-red-700 dark:text-red-200">
                    <Sparkles className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <span>{historyList[0].summaryNote}</span>
                  </div>
                </div>
              ) : (
                /* KULLANICI HENÜZ TAHLİL YÜKLEMEDİYSE BOŞ STATE */
                <div className="bg-theme-card rounded-2xl p-8 shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex flex-col items-center justify-center text-center space-y-4 min-h-[220px]">
                  <div className="w-16 h-16 bg-theme-bg rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-800 dark:text-slate-100">Henüz Tahlil Bilgisi Yüklenmedi</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1 max-w-sm">
                      Sisteme tahlil yüklediğinizde akıllı analiz sonuçlarınız ve doktor değerlendirmeleriniz burada görüntülenecektir.
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/patient/upload')}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-2xl shadow-clay-btn transition flex items-center space-x-2"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>İlk Tahlilinizi Yükleyin</span>
                  </button>
                </div>
              )}
            </div>

            {/* Sağ: Günlük AI Sağlık İpuçları */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-stone-800 dark:text-stone-200 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Kişiselleştirilmiş İpuçları</span>
              </h2>

              <div className="bg-theme-card rounded-[2rem] p-6 shadow-clay-card dark:shadow-clay-card-dark border-theme-border space-y-4 text-xs font-bold">
                <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300">
                  <p className="font-black text-amber-900 dark:text-amber-200 mb-1">🍋 C Vitamini Tüketimi</p>
                  <p className="leading-relaxed">Demir emilimini artırmak için demir takviyenizi taze sıkılmış portakal suyu veya C vitamini içeren gıdalarla almanız tavsiye edilir.</p>
                </div>

                <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/40 text-blue-800 dark:text-blue-300">
                  <p className="font-black text-blue-900 dark:text-blue-200 mb-1">💧 Düzenli Sıvı Alımı</p>
                  <p className="leading-relaxed">Böbrek ve biyokimya değerlerinizin dengede kalması için günde en az 2 - 2.5 litre su içmeyi ihmal etmeyin.</p>
                </div>

                <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                  <p className="font-black text-emerald-900 dark:text-emerald-200 mb-1">🏃‍♂️ Haftalık Tempolu Yürüyüş</p>
                  <p className="leading-relaxed">Kolesterol seviyenizi kontrol altında tutmak için haftada en az 3 gün 30 dakika tempolu yürüyüş yapın.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* --- TAHLİL YÜKLE SEKMESİ --- */}
      {currentView === 'upload' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-[2rem] p-4 shadow-sm flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-500 leading-relaxed">
              Yasal Uyarı: Bu sistemin sunduğu otomatik analiz sonuçları yapay zeka destekli ön değerlendirmedir. Kesin teşhis ve tedavi kararı yalnızca uzman doktorunuz tarafından verilebilir.
            </p>
          </div>

          {saveToast && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-3xl flex items-center space-x-3 text-sm font-bold animate-fade-in">
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
              <span>{saveToast}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Upload Section */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-2xl font-black text-stone-800 dark:text-stone-200">Tahlil Yükle</h2>
              <div className="bg-theme-card rounded-[2rem] p-8 shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex flex-col items-center justify-center text-center">

                <div className="w-24 h-24 bg-theme-bg rounded-3xl shadow-inner flex items-center justify-center mb-6 border border-stone-200 dark:border-stone-800">
                  <UploadCloud className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>

                <p className="font-bold text-stone-600 dark:text-stone-300 mb-2 text-sm">PDF veya Resim formatında tahlil sonucunuzu seçin</p>
                <p className="text-xs text-stone-400 mb-6 font-medium">Maksimum dosya boyutu: 10MB (SSL Şifreli)</p>

                <input type="file" id="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={handleFile} />
                <label htmlFor="file" className="w-full px-6 py-3.5 bg-theme-bg text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 font-black text-sm rounded-2xl shadow-clay-card cursor-pointer hover:scale-105 active:scale-95 transition-all mb-4 text-center truncate">
                  {file ? file.name : '📁 Dosya Seç'}
                </label>

                <button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="w-full py-4 mt-2 bg-red-600 hover:bg-red-700 text-white font-black rounded-3xl shadow-clay-btn active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analiz Ediliyor...</span>
                    </>
                  ) : (
                    <span>Yükle ve Analiz Et</span>
                  )}
                </button>

                {error && <p className="text-sm text-red-500 font-bold mt-4 animate-fade-in">{error}</p>}
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-stone-800 dark:text-stone-200">Analiz Sonuçları</h2>
                {results && (
                  <button
                    onClick={handleSaveToHistory}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl shadow-clay-btn transition flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Geçmişe Kaydet</span>
                  </button>
                )}
              </div>

              {results ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                    {results.params.map((param, idx) => (
                      <div key={idx} className="bg-theme-card p-5 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border">
                        <p className="text-xs font-black text-stone-400 uppercase tracking-wider mb-2">{param.name}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black text-stone-700 dark:text-stone-200">{param.value}</span>

                          {param.status === 'NORMAL' && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                          {param.status === 'HIGH' && <ArrowUpCircle className="w-6 h-6 text-red-600" />}
                          {param.status === 'LOW' && <ArrowDownCircle className="w-6 h-6 text-blue-600" />}
                        </div>
                        <p className="text-xs font-bold text-stone-400 mt-2">Ref: {param.range}</p>

                        <div className={`mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs font-black ${
                          param.status === 'NORMAL' ? 'text-emerald-600' :
                          param.status === 'HIGH' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {param.status === 'NORMAL' ? 'NORMAL' : param.status === 'HIGH' ? 'YÜKSEK' : 'DÜŞÜK'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-theme-card p-6 rounded-[2rem] shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-start space-x-4">
                    <div className="w-12 h-12 shrink-0 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-stone-800 dark:text-stone-200 mb-2">Sistem Değerlendirmesi</h3>
                      <p className="text-sm font-medium text-stone-500 dark:text-stone-400 leading-relaxed">{results.systemNote}</p>
                    </div>
                  </div>

                  {results.doctorNote && (
                    <div className="bg-theme-card p-6 rounded-[2rem] shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-start space-x-4">
                      <div className="w-12 h-12 shrink-0 bg-red-50 dark:bg-red-900/20 text-red-600 shrink-0 rounded-2xl flex items-center justify-center">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-stone-800 dark:text-stone-200 mb-2">Uzman Önerisi</h3>
                        <p className="text-sm font-bold text-red-900 dark:text-red-400 leading-relaxed">{results.doctorNote}</p>
                      </div>
                    </div>
                  )}

                  {/* Değerlendirme & Geri Bildirim Kartı */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-6 rounded-[2rem] border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 text-center sm:text-left">
                      <div className="w-12 h-12 bg-amber-400/20 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                        <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="font-black text-stone-800 dark:text-stone-200 text-sm">Analiz Hizmetimizi Nasıl Buldunuz?</h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 font-bold mt-0.5">5 üzerinden yıldız vererek görüş veya şikayetinizi yönetime iletebilirsiniz.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFeedbackModalOpen(true)}
                      className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-2xl shadow-clay-btn transition shrink-0 flex items-center space-x-1.5"
                    >
                      <Star className="w-4 h-4 fill-white" />
                      <span>Yıldız Ver & Yorum Yaz</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-theme-card rounded-[2rem] p-12 shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex flex-col items-center justify-center text-center text-slate-400 h-full min-h-[380px]">
                  <FileText className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
                  <p className="font-bold text-lg text-slate-600 dark:text-slate-400">Sonuçları ve AI analizini görmek için tahlil dosyanızı yükleyin.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- GEÇMİŞ TAHLİLLERİM SEKMESİ --- */}
      {currentView === 'history' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200">Geçmiş Tahlillerim</h2>
              <p className="text-xs font-bold text-slate-400 mt-1">Önceden yüklediğiniz ve analiz edilen tahlil raporlarınız</p>
            </div>

            <button
              onClick={() => navigate('/patient/upload')}
              className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-2xl shadow-clay-btn transition flex items-center space-x-2 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Tahlil Ekle</span>
            </button>
          </div>

          {/* Arama ve Filtre Çubuğu */}
          <div className="bg-theme-card p-4 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex flex-col sm:flex-row gap-4 justify-between items-center">
            
            {/* Arama İnputu */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tahlil adı veya içerik ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600/20"
              />
            </div>

            {/* Durum Filtresi */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-bold text-slate-400">Filtrele:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">Tümü ({historyList.length})</option>
                <option value="NORMAL">Normal</option>
                <option value="WARNING">Uyarı Var</option>
              </select>
            </div>
          </div>

          {/* Tahlil Listesi */}
          {filteredHistory.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredHistory.map((item) => (
                <div 
                  key={item.id}
                  className="bg-theme-card p-6 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-red-600/30 transition duration-200"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 bg-theme-bg text-slate-500 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-800 flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                        <span>{item.date}</span>
                      </span>

                      <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                        item.status === 'NORMAL' 
                          ? 'bg-emerald-950 text-emerald-200 border-emerald-900/60' 
                          : 'bg-amber-950 text-amber-200 border-amber-900/60'
                      }`}>
                        {item.status === 'NORMAL' ? 'Normal' : 'Takip Var'}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">{item.title}</h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {item.summaryNote}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => setSelectedTestModal(item)}
                      className="flex-1 md:flex-none px-4 py-2.5 bg-theme-bg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-1 border border-slate-200 dark:border-slate-700"
                    >
                      <Eye className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span>Detay İncele</span>
                    </button>

                    <button
                      onClick={() => alert(`"${item.fileName}" dosyasını indirme simülasyonu başlatıldı.`)}
                      className="px-3 py-2.5 bg-theme-bg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 rounded-2xl text-xs font-bold transition flex items-center justify-center border border-slate-200 dark:border-slate-700"
                      title="Raporu İndir"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-theme-card rounded-[2.5rem] p-12 text-center border-theme-border shadow-clay-card dark:shadow-clay-card-dark space-y-4">
              <div className="w-20 h-20 bg-theme-bg rounded-3xl mx-auto flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-800">
                <FileText className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-200">
                  {searchQuery ? 'Aramanızla Eşleşen Tahlil Bulunamadı' : 'Henüz Tahlil Kaydınız Yok'}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1 max-w-sm mx-auto">
                  {searchQuery ? 'Farklı bir arama terimi deneyebilir veya filtreyi değiştirebilirsiniz.' : 'Tahlil sonuçlarınızı yükleyip geçmişe kaydettikçe raporlarınız burada listelenecektir.'}
                </p>
              </div>
              {!searchQuery && (
                <button
                  onClick={() => navigate('/patient/upload')}
                  className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-clay-btn text-xs inline-flex items-center space-x-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Hemen Tahlil Yükleyin</span>
                </button>
              )}
            </div>
          )}

          {/* DETAY İNCELE MODAL */}
          {selectedTestModal && createPortal(
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-theme-card w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl border-theme-border space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200">{selectedTestModal.title}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1">Tarih: {selectedTestModal.date} | Dosya: {selectedTestModal.fileName}</p>
                  </div>
                  <button
                    onClick={() => setSelectedTestModal(null)}
                    className="p-2 bg-theme-bg hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full font-black text-slate-500"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase text-slate-400 tracking-wider">Parametre Detayları</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedTestModal.params.map((p, idx) => (
                      <div key={idx} className="bg-theme-bg p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <span className="block text-xs font-black text-slate-400 uppercase">{p.name}</span>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-lg font-black text-slate-800 dark:text-slate-200">{p.value}</span>
                          <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                            p.status === 'NORMAL' ? 'bg-emerald-950 text-emerald-200 border-emerald-900/60' :
                            p.status === 'HIGH' ? 'bg-red-950 text-red-200 border-red-900/60' : 'bg-sky-950 text-sky-200 border-sky-900/60'
                          }`}>
                            {p.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-bold mt-1">Referans: {p.range}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-2xl text-xs font-bold text-blue-800 dark:text-blue-300">
                    <p className="font-black mb-1">Sistem Notu:</p>
                    <p>{selectedTestModal.summaryNote}</p>
                  </div>

                  {selectedTestModal.doctorNote && (
                    <div className="p-4 bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl text-xs font-bold text-red-700 dark:text-red-300">
                      <p className="font-black mb-1">Uzman Notu:</p>
                      <p>{selectedTestModal.doctorNote}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setSelectedTestModal(null)}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl text-xs shadow-clay-btn"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}

        </div>
      )}

      {/* GERİ BİLDİRİM & YILDIZ VERME MODAL */}
      {feedbackModalOpen && createPortal(
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-theme-card w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border-theme-border space-y-6">
            <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-xl flex items-center justify-center font-black">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-800 dark:text-stone-200">Geri Bildirim Yapın</h3>
                  <p className="text-xs font-bold text-stone-400">Deneyiminizi 5 üzerinden yıldızla değerlendirin</p>
                </div>
              </div>
              <button
                onClick={() => setFeedbackModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              {/* Yıldız Seçimi */}
              <div className="text-center space-y-2">
                <label className="block text-xs font-black text-stone-400 uppercase tracking-wider">
                  Hizmet Kalitesi & Değerlendirme
                </label>
                <div className="flex justify-center items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125 active:scale-95 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || feedbackRating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-300 dark:text-stone-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  {feedbackRating === 5 && '🌟 Harika! (5 / 5)'}
                  {feedbackRating === 4 && '👍 Çok İyi (4 / 5)'}
                  {feedbackRating === 3 && '😐 Orta (3 / 5)'}
                  {feedbackRating === 2 && '👎 Geliştirilmeli (2 / 5)'}
                  {feedbackRating === 1 && '⚠️ Memnun Kalmadım (1 / 5)'}
                </p>
              </div>

              {/* Yorum / Şikayet Metin Alanı */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs font-black text-stone-600 dark:text-stone-300">
                  <span>Görüş, Öneri veya Şikayetiniz:</span>
                  {feedbackRating <= 3 && feedbackRating > 0 ? (
                    <span className="text-red-500 font-black text-[10px] uppercase tracking-wider animate-pulse">⚠ Zorunlu</span>
                  ) : (
                    <span className="text-stone-400 font-bold text-[10px]">(İsteğe bağlı)</span>
                  )}
                </label>
                <textarea
                  rows="4"
                  required={feedbackRating <= 3}
                  placeholder={
                    feedbackRating <= 3 && feedbackRating > 0
                      ? 'Lütfen şikayetinizi veya önerinizi açıklayın...'
                      : 'Tahlil analiziniz, sistem deneyiminiz veya iletmek istediğiniz bir şikayet/öneri var mı? Buraya yazabilirsiniz...'
                  }
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className={`w-full p-4 bg-theme-bg border rounded-2xl text-xs font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 transition ${
                    feedbackRating <= 3 && feedbackRating > 0 && !feedbackComment.trim()
                      ? 'border-red-400 dark:border-red-600 focus:ring-red-400/20'
                      : 'border-stone-200 dark:border-stone-700 focus:ring-amber-500/20'
                  }`}
                ></textarea>
                {feedbackRating <= 3 && feedbackRating > 0 && !feedbackComment.trim() && (
                  <p className="text-red-500 text-[10px] font-bold mt-1">
                    3 yıldız ve altında değerlendirmelerde açıklama zorunludur.
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFeedbackModalOpen(false)}
                  className="px-5 py-3 bg-theme-bg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold rounded-2xl text-xs"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl text-xs shadow-clay-btn transition flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Geri Bildirimi Gönder</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </Layout>
  );
};

export default PatientDashboard;