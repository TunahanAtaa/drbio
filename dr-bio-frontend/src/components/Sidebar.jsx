import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Users, Database, Upload, FileText, User, MessageSquare, 
  CheckCircle2, Sparkles, X, ArrowRight, ShieldCheck, HeartPulse, 
  Calendar, Lightbulb, HelpCircle, LogOut, Bot, CalendarDays, Stethoscope 
} from 'lucide-react';
import Logo from './Logo';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { healthTips } from '../data/healthTips';
import HelpChatbotModal from './HelpChatbotModal';

const Sidebar = ({ role = 'PATIENT', reportCount = null, onHelpClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [quickModalOpen, setQuickModalOpen] = useState(false);
  const [quickSavedToast, setQuickSavedToast] = useState('');
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const getReportCount = () => {
    if (reportCount !== null && reportCount !== undefined) return reportCount;
    try {
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const userObj = JSON.parse(userRaw);
        const userEmail = (userObj.email || '').trim().toLowerCase();
        const key = `userTestHistory_${userEmail}`;
        const savedHistory = localStorage.getItem(key);
        if (savedHistory) {
          const parsed = JSON.parse(savedHistory);
          if (Array.isArray(parsed)) return parsed.length;
        }
      }
    } catch (e) {}
    return 0;
  };

  const getMemberSinceText = () => {
    let rawDate = null;
    try {
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const u = JSON.parse(userRaw);
        rawDate = u.memberSince || u.createdAt || u.regDate;
      }
    } catch(e) {}

    if (!rawDate) {
      return 'Ocak 2026';
    }

    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return 'Ocak 2026';
      const trMonths = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
      ];
      return `${trMonths[d.getMonth()]} ${d.getFullYear()}`;
    } catch(e) {
      return 'Ocak 2026';
    }
  };

  const getLinks = () => {
    switch(role) {
      case 'ADMIN':
        return [
          { name: 'Ana Sayfa', path: '/admin', icon: Home },
          { name: 'Kullanıcılar', path: '/admin/users', icon: Users },
          { name: 'Referans Kütüphanesi', path: '/admin/references', icon: Database },
          { name: 'Geri Bildirimler', path: '/admin/feedbacks', icon: MessageSquare },
          { name: 'Ajanda Takibi', path: '/admin/agenda', icon: CalendarDays },
        ];
      case 'PATIENT':
        return [
          { name: 'Ana Sayfa', path: '/patient', icon: Home },
          { name: 'Tahlil Yükle', path: '/patient/upload', icon: Upload },
          { name: 'Geçmiş Tahlillerim', path: '/patient/history', icon: FileText },
          { name: 'Yara & Cilt Analizi', path: '/patient/skin-analysis', icon: Stethoscope },
          { name: 'Profilim', path: '/patient/profile', icon: User },
          { name: 'Sağlık Ajandam', path: '/patient/agenda', icon: CalendarDays },
        ];
      default: return [];
    }
  };

  const links = getLinks();
  const safeRoleLower = (role || 'patient').toLowerCase();

  const getProfileData = () => {
    let healthProfile = {};
    let userObj = {};
    try {
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        userObj = JSON.parse(userRaw) || {};
        healthProfile = userObj.healthProfile || {};
      }
    } catch (e) {}

    const getValue = (key) => {
      if (healthProfile[key] !== undefined && healthProfile[key] !== null && String(healthProfile[key]).trim() !== '') {
        return String(healthProfile[key]).trim();
      }
      if (userObj[key] !== undefined && userObj[key] !== null && String(userObj[key]).trim() !== '') {
        return String(userObj[key]).trim();
      }
      return '';
    };

    const age = getValue('age') || '22';
    const height = getValue('height') || '170';
    const weight = getValue('weight') || '60';
    const gender = getValue('gender') || 'Kadın';

    const maritalStatus = getValue('maritalStatus') || 'Bekar';
    const hasChildren = getValue('hasChildren') || 'Hayır';
    const occupation = getValue('occupation') || 'Yazılım Mühendisliği Öğrencisi';
    const geneticDiseases = getValue('geneticDiseases') || 'Yok';
    const pastSurgeries = getValue('pastSurgeries') || 'Yok';
    const regularMedications = getValue('regularMedications') || 'Yok';
    const allergies = getValue('allergies') || 'Polen';
    const chronicComplaints = getValue('chronicComplaints') || 'Yok';
    const smoking = getValue('smoking') || 'Kullanmıyor';
    const alcohol = getValue('alcohol') || 'Kullanmıyor';

    const optionalValues = [
      maritalStatus, hasChildren, occupation, geneticDiseases, 
      pastSurgeries, regularMedications, allergies, chronicComplaints, 
      smoking, alcohol
    ];

    let filledOptional = 0;
    optionalValues.forEach(val => {
      if (val && val !== 'Yok') filledOptional += 1;
    });

    const reqScore = (age ? 2 : 0) + (height ? 2 : 0) + (weight ? 2 : 0) + (gender ? 2 : 0); // 8 points
    const maxPoints = 18;
    const currentPoints = reqScore + filledOptional;
    const percent = Math.round((currentPoints / maxPoints) * 100);

    return {
      percent: Math.min(100, Math.max(0, percent)),
      userObj,
      healthProfile,
      formState: {
        age, height, weight, gender, maritalStatus, hasChildren, 
        occupation, geneticDiseases, pastSurgeries, regularMedications, 
        allergies, chronicComplaints, smoking, alcohol
      }
    };
  };

  const profileData = getProfileData();
  const [quickForm, setQuickForm] = useState(profileData.formState);

  const handleQuickFormSave = (e) => {
    if (e) e.preventDefault();
    try {
      const userRaw = localStorage.getItem('user');
      let userObj = {};
      if (userRaw) {
        try { userObj = JSON.parse(userRaw) || {}; } catch(e) {}
      }

      const updatedUser = {
        ...userObj,
        name: userObj.name || 'Hasta',
        email: userObj.email || 'hasta@drbio.com',
        healthProfile: {
          ...(userObj.healthProfile || {}),
          ...quickForm
        }
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setQuickSavedToast('Profil verileriniz başarıyla güncellendi!');
      setTimeout(() => setQuickSavedToast(''), 3000);
      setQuickModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const isPatient = role === 'PATIENT';

  return (
    <aside className="w-64 max-h-[calc(100vh-2rem)] bg-theme-card rounded-2xl m-4 p-6 shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex flex-col hidden lg:flex">
      {/* Fixed Logo Header */}
      <Logo size="md" className="mb-6 pl-1 shrink-0" />

      {/* Scrollable Middle Container (Nav + Patient Widgets) */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 min-h-0 scrollbar-thin">
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || (link.path !== `/${safeRoleLower}` && location.pathname.startsWith(link.path));

            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-clay-btn'
                    : 'text-stone-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-red-600 dark:text-red-400'}`} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {isPatient && (() => {
          const percent = profileData.percent;
          const totalReportsCount = getReportCount();
          const memberSinceDateText = getMemberSinceText();
          const today = new Date();
          const dayIndex = (today.getDate() + today.getMonth()) % healthTips.length;
          const dailyTipText = healthTips[dayIndex];

          return (
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 space-y-3">
              {/* PROFILE COMPLETION CARD */}
              <div 
                onClick={() => {
                  setQuickForm(getProfileData().formState);
                  setQuickModalOpen(true);
                }}
                className="bg-theme-bg p-4 rounded-2xl border border-stone-100 dark:border-stone-800 space-y-2.5 cursor-pointer hover:border-red-400/60 transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-stone-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    Profilini Tamamla
                  </span>
                  <span className="text-sm font-black text-stone-700 dark:text-stone-200">
                    %{percent}
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                  <div 
                    className="h-full bg-red-600 dark:bg-red-500 rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="pt-0.5 flex items-center justify-between">
                  {percent < 100 ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickForm(getProfileData().formState);
                        setQuickModalOpen(true);
                      }}
                      className="text-xs font-black text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Hızlı Tamamla & AI Analiz Puanı</span>
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Profilin tamam!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* QUICK STATS BLOCK */}
              <div className="px-2 pt-1 space-y-2">
                {/* Row 1: Toplam Tahlil */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-stone-400" />
                    <span className="text-stone-500 dark:text-stone-400 font-medium">Toplam Tahlil</span>
                  </div>
                  <span className="font-black text-stone-700 dark:text-stone-200">
                    {totalReportsCount}
                  </span>
                </div>

                {/* Row 2: Üyelik */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-stone-400" />
                    <span className="text-stone-500 dark:text-stone-400 font-medium">Üyelik</span>
                  </div>
                  <span className="font-black text-stone-700 dark:text-stone-200">
                    {memberSinceDateText}
                  </span>
                </div>
              </div>

              {/* DAILY HEALTH TIP CARD */}
              <div className="bg-theme-bg p-3.5 rounded-2xl border border-stone-100 dark:border-stone-800 space-y-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 bg-red-50 dark:bg-red-950/40 rounded-xl flex items-center justify-center border border-red-200/50 dark:border-red-900/40 shrink-0">
                    <Lightbulb className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-700 dark:text-red-400">
                    Günün İpucu
                  </span>
                </div>
                <p className="text-xs font-medium text-stone-600 dark:text-stone-300 leading-snug">
                  {dailyTipText}
                </p>
              </div>
            </div>
          );
        })()}
      </div>

      {/* BOTTOM FIXED BLOCK — LOGOUT + HELP (PATIENT ONLY) */}
      {isPatient && (
        <div className="mt-auto pt-4 border-t border-stone-200 dark:border-stone-800 shrink-0 flex items-center justify-between px-1">
          {/* Yardım */}
          <button
            type="button"
            onClick={() => {
              if (onHelpClick) {
                onHelpClick();
              } else {
                setHelpModalOpen(true);
              }
            }}
            className="text-stone-600 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400 text-xs font-extrabold transition-colors flex items-center space-x-1.5"
          >
            <Bot className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span>Yardım</span>
          </button>

          {/* Çıkış Yap */}
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('user');
              navigate('/');
            }}
            className="text-red-600 hover:text-red-700 text-xs font-bold transition-colors flex items-center space-x-1.5"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      )}

      {/* --- HIZLI PROFİL TAMAMLAMA & AI SAĞLIK PENCERESİ --- */}
      {quickModalOpen && createPortal(
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-theme-card w-full max-w-lg rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-theme-border space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-stone-200 dark:border-stone-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950/60 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-stone-800 dark:text-stone-200">Hızlı Profil Tamamlama</h3>
                    <span className="px-2.5 py-0.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full text-xs font-black border border-red-200 dark:border-red-900">
                      %{profileData.percent} Tamamlandı
                    </span>
                  </div>
                  <p className="text-xs font-bold text-stone-400 mt-0.5">
                    Sağlık bilgilerinizi güncelleyerek yapay zeka tahlil analizi doğruluk oranını artırın.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQuickModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-bold bg-theme-bg rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Doğruluk Katkı Bandı */}
            <div className="bg-red-50/70 dark:bg-red-950/40 p-4 rounded-2xl border border-red-200/60 dark:border-red-900/40 flex items-center space-x-3">
              <ShieldCheck className="w-8 h-8 text-red-600 dark:text-red-400 shrink-0" />
              <p className="text-xs font-bold text-red-950 dark:text-red-200 leading-relaxed">
                Yapay zeka tahlillerinizdeki anormallikleri hesaplarken yaş, kilo, cinsiyet ve medikal geçmişinizi baz alır. Eksiksiz profil daha isabetli teşhis sunar.
              </p>
            </div>

            {/* Hızlı Form */}
            <form onSubmit={handleQuickFormSave} className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Yaş</label>
                  <Input
                    type="number"
                    value={quickForm.age}
                    onChange={(e) => setQuickForm({ ...quickForm, age: e.target.value })}
                    className="py-2 px-3 text-xs"
                    placeholder="22"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Kilo (kg)</label>
                  <Input
                    type="number"
                    value={quickForm.weight}
                    onChange={(e) => setQuickForm({ ...quickForm, weight: e.target.value })}
                    className="py-2 px-3 text-xs"
                    placeholder="60"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Boy (cm)</label>
                  <Input
                    type="number"
                    value={quickForm.height}
                    onChange={(e) => setQuickForm({ ...quickForm, height: e.target.value })}
                    className="py-2 px-3 text-xs"
                    placeholder="170"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Cinsiyet</label>
                  <Select
                    value={quickForm.gender}
                    onChange={(e) => setQuickForm({ ...quickForm, gender: e.target.value })}
                    className="py-2 px-2 text-xs"
                  >
                    <option value="Kadın">Kadın</option>
                    <option value="Erkek">Erkek</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Alerjiler</label>
                  <Input
                    type="text"
                    value={quickForm.allergies}
                    onChange={(e) => setQuickForm({ ...quickForm, allergies: e.target.value })}
                    className="py-2 text-xs"
                    placeholder="Polen, Penasilin vb."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Sürekli Kullanılan İlaçlar</label>
                  <Input
                    type="text"
                    value={quickForm.regularMedications}
                    onChange={(e) => setQuickForm({ ...quickForm, regularMedications: e.target.value })}
                    className="py-2 text-xs"
                    placeholder="Tiroit ilacı, B12 vb."
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 py-3 text-xs space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Bilgileri Güncelle & Kaydet</span>
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setQuickModalOpen(false);
                    navigate('/patient/profile');
                  }}
                  className="py-3 px-4 text-xs space-x-1"
                >
                  <span>Detaylı Profil Sayfası</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* --- YARDIM & SSS CHATBOT ASİSTANI MODAL --- */}
      <HelpChatbotModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />
    </aside>
  );
};

export default Sidebar;
