import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Users, Database, FileText, MessageSquare, Plus, ArrowUpRight, 
  ShieldCheck, Activity, Cpu, Server, CheckCircle2, Clock, 
  Sparkles, TrendingUp, AlertTriangle, Zap, HeartPulse, X, Eye
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AdminOverviewTab = ({
  usersList = [],
  totalReports = 0,
  references = [],
  safeFeedbacks = [],
  setFeedbackSubTab,
  navigate,
}) => {
  const [reportsModalOpen, setReportsModalOpen] = useState(false);

  const sampleReportsList = [
    { id: 'rep_1', patientName: 'Zeynep Ersal', email: 'zeynep@ornek.com', title: 'Biyokimya & Karaciğer Paneli', date: '2026-08-07', confidence: '99.8%', status: 'NORMAL', paramCount: 8 },
    { id: 'rep_2', patientName: 'Burak Öztürk', email: 'burak.ozturk@yahoo.com', title: 'Tam Kan Sayımı (Hemogram)', date: '2026-08-06', confidence: '99.2%', status: 'ANOMALİ', paramCount: 14 },
    { id: 'rep_3', patientName: 'Canan Arslan', email: 'canan.arslan@outlook.com', title: 'Vitamin B12 & D3 Analizi', date: '2026-08-05', confidence: '100%', status: 'NORMAL', paramCount: 5 },
    { id: 'rep_4', patientName: 'Deniz Yıldız', email: 'deniz.yildiz@gmail.com', title: 'Ferritin & Demir Paneli', date: '2026-08-05', confidence: '98.9%', status: 'KRİTİK', paramCount: 6 },
    { id: 'rep_5', patientName: 'Selin Tekin', email: 'selin.tekin@icloud.com', title: 'Glukoz & HbA1c Takip Raporu', date: '2026-08-04', confidence: '99.5%', status: 'NORMAL', paramCount: 4 },
  ];
  // Demo aktivite verisi
  const recentActivities = [
    {
      id: 1,
      type: 'REPORT',
      title: 'Biyokimya & Hemogram Tahlil Raporu Yüklendi',
      user: 'Zeynep Ersal',
      email: 'zeynep@ornek.com',
      time: '2 dakika önce',
      status: 'Tamamlandı',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
      icon: FileText,
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 2,
      type: 'ANOMALY',
      title: 'Kritik Biyomarker Anomali Uyarısı',
      user: 'Deniz Yıldız',
      email: 'deniz.yildiz@gmail.com',
      time: '14 dakika önce',
      status: 'Ferritin: 8.5 ng/mL (Kritik Düşük)',
      badgeBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900',
      icon: AlertTriangle,
      iconBg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
    },
    {
      id: 3,
      type: 'USER',
      title: 'Yeni Hasta Hesabı Oluşturuldu',
      user: 'Aylin Çelik',
      email: 'aylin.celik@gmail.com',
      time: '45 dakika önce',
      status: 'E-Posta Doğrulandı',
      badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900',
      icon: Users,
      iconBg: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 4,
      type: 'FEEDBACK',
      title: 'Hasta Memnuniyet Görüşü Alındı',
      user: 'Selin Tekin',
      email: 'selin.tekin@icloud.com',
      time: '2 saat önce',
      status: '⭐ 5 / 5 Yıldız',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900',
      icon: MessageSquare,
      iconBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
    },
    {
      id: 5,
      type: 'REFERENCE',
      title: 'Biyomarker Referans Aralığı Güncellendi',
      user: 'Sistem Yöneticisi',
      email: 'admin@drbio.com',
      time: '4 saat önce',
      status: 'Vitamin D3 (20-100 ng/mL)',
      badgeBg: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900',
      icon: Database,
      iconBg: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400',
    },
  ];

  // Kategori dağılımları
  const categories = [
    { name: 'Kan Sayımı (Hemogram)', count: 54, percentage: 38, color: 'bg-red-500' },
    { name: 'Biyokimya & Kan Şekeri', count: 45, percentage: 32, color: 'bg-indigo-500' },
    { name: 'Vitamin & Mineraller', count: 26, percentage: 18, color: 'bg-emerald-500' },
    { name: 'Hormon & Tiroit Paneli', count: 17, percentage: 12, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Admin Banner */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-900 rounded-3xl p-8 text-white shadow-clay-card dark:shadow-clay-card-dark border-theme-border relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-8 translate-y-8">
          <HeartPulse className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-clay-btn">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Dr. Bio Akıllı Yönetim Merkezi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Yönetici Paneline Hoş Geldiniz</h1>
          <p className="text-white/85 text-sm max-w-2xl font-bold leading-relaxed">
            Dr. Bio yapay zeka destekli sağlık altyapısındaki tüm hastaları, biyomarker referans değerlerini, OCR tahlil analizlerini ve hasta bildirimlerini canlı olarak takip edin.
          </p>
        </div>
      </div>

      {/* 2. İstatistik Özet Kartları (Renklendirilmiş) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card 
          onClick={() => navigate('/admin/users')}
          padding="p-6"
          rounded="rounded-3xl"
          className="cursor-pointer hover:border-red-500/50 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-stone-400 uppercase tracking-wider">Toplam Kullanıcı</span>
            <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-2xl text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform shadow-sm">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-black text-stone-800 dark:text-stone-100 mt-4">{usersList.length}</p>
          <div className="flex items-center space-x-1.5 mt-1 text-xs font-bold text-red-600 dark:text-red-400">
            <span>Aktif Kayıtlı Kullanıcı</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </Card>

        <Card 
          onClick={() => navigate('/admin/references')}
          padding="p-6"
          rounded="rounded-3xl"
          className="cursor-pointer hover:border-indigo-500/50 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-stone-400 uppercase tracking-wider">Referans Biyomarker</span>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shadow-sm">
              <Database className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-black text-stone-800 dark:text-stone-100 mt-4">{references.length}</p>
          <div className="flex items-center space-x-1.5 mt-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <span>Kütüphane Parametresi</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </Card>

        <Card 
          onClick={() => setReportsModalOpen(true)}
          padding="p-6"
          rounded="rounded-3xl"
          className="cursor-pointer hover:border-emerald-500/50 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-stone-400 uppercase tracking-wider">Analiz Edilen Rapor</span>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-black text-stone-800 dark:text-stone-100 mt-4">{totalReports}</p>
          <div className="flex items-center space-x-1.5 mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span>Tamamlanan OCR / Tahlil</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </Card>

        <Card 
          onClick={() => navigate('/admin/feedbacks')}
          padding="p-6"
          rounded="rounded-3xl"
          className="cursor-pointer hover:border-amber-500/50 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-stone-400 uppercase tracking-wider">Hasta Geri Bildirimleri</span>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform shadow-sm">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-black text-stone-800 dark:text-stone-100 mt-4">{safeFeedbacks.length}</p>
          <div className="flex items-center space-x-1.5 mt-1 text-xs font-bold text-amber-600 dark:text-amber-400">
            <span>Şikayet & Görüş Talebi</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </Card>
      </div>

      {/* 3. Hızlı Yönetim Kısayolları */}
      <Card padding="p-6" rounded="rounded-3xl" className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-black text-stone-800 dark:text-stone-200">Hızlı Yönetici Kısayolları</h3>
          </div>
          <span className="text-xs font-bold text-stone-400">Tek Tıkla Eylem</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={() => navigate('/admin/users')}
            variant="primary"
            size="lg"
            className="w-full justify-center space-x-2 py-3.5 text-xs shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Kullanıcı Ekle</span>
          </Button>

          <Button
            onClick={() => navigate('/admin/references')}
            variant="primary"
            size="lg"
            className="w-full justify-center space-x-2 py-3.5 text-xs shadow-md"
          >
            <Database className="w-4 h-4" />
            <span>Biyomarker Ekle</span>
          </Button>

          <Button
            onClick={() => navigate('/admin/feedbacks')}
            variant="primary"
            size="lg"
            className="w-full justify-center space-x-2 py-3.5 text-xs shadow-md"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Şikayetleri İncele</span>
          </Button>

          <div className="bg-theme-bg p-3 px-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Server className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="block text-[10px] font-black text-stone-400 uppercase">PostgreSQL Veritabanı</span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">Sunucu Aktif (Port 5432)</span>
              </div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
          </div>
        </div>
      </Card>

      {/* 4. Ana Bölüm: Son Aktivite Akışı & Biyomarker Dağılımı (2 Kolon) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sol Kolon (2/3 En): Canlı Sistem Aktivite Akışı */}
        <Card padding="p-6" rounded="rounded-3xl" className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-red-600" />
              <h3 className="text-base font-black text-stone-800 dark:text-stone-200">Son Sistem Aktiviteleri & Rapor Akışı</h3>
            </div>
            <span className="text-xs font-bold text-stone-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Canlı Zaman Akışı</span>
            </span>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act) => {
              const IconComp = act.icon;
              return (
                <div 
                  key={act.id}
                  className="bg-theme-bg p-4 rounded-2xl border border-stone-100 dark:border-stone-800/80 flex items-start justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2.5 rounded-xl shrink-0 ${act.iconBg}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-stone-800 dark:text-stone-200">{act.title}</h4>
                      <p className="text-[11px] font-bold text-stone-400 mt-0.5">
                        <span className="text-stone-700 dark:text-stone-300">{act.user}</span> ({act.email})
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${act.badgeBg}`}>
                      {act.status}
                    </span>
                    <span className="block text-[10px] font-bold text-stone-400 mt-1">{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Sağ Kolon (1/3 En): Biyomarker Dağılımı & Yapay Zeka Metrikleri */}
        <div className="space-y-6">
          {/* Biyomarker Kategorileri */}
          <Card padding="p-6" rounded="rounded-3xl" className="space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-black text-stone-800 dark:text-stone-200">Kategorilere Göre Tahlil Dağılımı</h3>
              </div>
            </div>

            <div className="space-y-4">
              {categories.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-stone-700 dark:text-stone-300 font-extrabold">{cat.name}</span>
                    <span className="text-stone-400">{cat.count} Rapor (%{cat.percentage})</span>
                  </div>
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${cat.color} rounded-full transition-all duration-500`} 
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Yapay Zeka Analiz Performansı */}
          <Card padding="p-6" rounded="rounded-3xl" className="space-y-4 bg-gradient-to-br from-indigo-900/10 via-theme-card to-theme-card border-indigo-200/50 dark:border-indigo-900/30">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-stone-800 dark:text-stone-200">Dr. Bio AI OCR Performansı</h4>
                <p className="text-[10px] font-bold text-stone-400">Yapay Zeka Motoru Durumu</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-theme-bg p-3 rounded-2xl border border-stone-200 dark:border-stone-800 text-center">
                <span className="block text-[10px] font-black text-stone-400 uppercase">Doğruluk Oranı</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">%99.4</span>
              </div>
              <div className="bg-theme-bg p-3 rounded-2xl border border-stone-200 dark:border-stone-800 text-center">
                <span className="block text-[10px] font-black text-stone-400 uppercase">Analiz Hızı</span>
                <span className="text-base font-black text-indigo-600 dark:text-indigo-400">1.4 sn</span>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* 5. Alt Bilgilendirme Kartı */}
      <Card padding="p-5" rounded="rounded-3xl" className="bg-stone-50 dark:bg-stone-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-xs font-bold text-stone-600 dark:text-stone-400">
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
          <span>Tüm biyomarker ve hasta verileri 256-bit uçtan uca şifreleme ve KVKK standartlarında saklanmaktadır.</span>
        </div>
        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest shrink-0">v2.4 Güvenli Sürüm</span>
      </Card>

      {/* --- TAMAMLANAN OCR & TAHLİL RAPORLARI MODALI --- */}
      {reportsModalOpen && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-theme-card w-full max-w-3xl rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-theme-border space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-stone-200 dark:border-stone-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-stone-800 dark:text-stone-200">Analiz Edilen Tahlil Raporları</h3>
                    <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-black border border-emerald-200 dark:border-emerald-800">
                      {totalReports} Rapor
                    </span>
                  </div>
                  <p className="text-xs font-bold text-stone-400 mt-0.5">
                    Dr. Bio OCR yapay zeka motoru tarafından başarıyla taranan ve biyomarker referanslarına eşlenen raporlar
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReportsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 bg-theme-bg rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rapor İstatistik Özet Bandı */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-theme-bg p-3.5 rounded-2xl border border-stone-100 dark:border-stone-800 text-center">
                <span className="block text-[10px] font-black text-stone-400 uppercase">Toplam Tahlil</span>
                <span className="text-lg font-black text-stone-800 dark:text-stone-200">{totalReports}</span>
              </div>
              <div className="bg-theme-bg p-3.5 rounded-2xl border border-stone-100 dark:border-stone-800 text-center">
                <span className="block text-[10px] font-black text-stone-400 uppercase">OCR Başarı Oranı</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">%99.4</span>
              </div>
              <div className="bg-theme-bg p-3.5 rounded-2xl border border-stone-100 dark:border-stone-800 text-center">
                <span className="block text-[10px] font-black text-stone-400 uppercase">Ort. İşlem Süresi</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">1.4 sn</span>
              </div>
            </div>

            {/* Tahlil Raporları Tablosu */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Son Analiz Edilen Rapor Kayıtları</h4>
              
              <div className="space-y-2.5">
                {sampleReportsList.map((rep) => (
                  <div 
                    key={rep.id}
                    className="bg-theme-bg p-4 rounded-2xl border border-stone-100 dark:border-stone-800/80 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-stone-800 dark:text-stone-200">{rep.title}</h5>
                        <p className="text-[11px] font-bold text-stone-400 mt-0.5">
                          Hasta: <span className="text-stone-700 dark:text-stone-300 font-extrabold">{rep.patientName}</span> ({rep.email})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-200 dark:border-stone-800">
                      <div className="text-left sm:text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          rep.status === 'NORMAL'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : rep.status === 'KRİTİK'
                              ? 'bg-rose-50 text-rose-600 border border-rose-200'
                              : 'bg-amber-50 text-amber-600 border border-amber-200'
                        }`}>
                          {rep.status} ({rep.paramCount} Parametre)
                        </span>
                        <span className="block text-[10px] font-bold text-stone-400 mt-0.5">OCR Doğruluk: {rep.confidence} • {rep.date}</span>
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setReportsModalOpen(false);
                          navigate('/patient');
                        }}
                        className="py-1.5 px-3 text-[11px] space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Görüntüle</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setReportsModalOpen(false)}
                className="px-6 py-3 text-xs"
              >
                Kapat
              </Button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminOverviewTab;
