import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Shield, User, Loader2, UserPlus, CheckCircle2, ArrowRight, ArrowLeft, HeartPulse, AlertCircle, KeyRound, Lock, Check, Zap, LineChart, ShieldCheck, FileText } from 'lucide-react';
import AuthBackground from '../components/AuthBackground';
import ThemeToggle from '../components/ThemeToggle';
import FooterInfoModals from '../components/FooterInfoModals';
import api from '../services/api';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

import Logo from '../components/Logo';

const defaultUsers = [
  { name: 'Sistem Yöneticisi', email: 'admin@drbio.com', password: '123', role: 'ADMIN' },
  { name: 'Zeynep Ersal', email: 'hasta@drbio.com', password: '123', role: 'PATIENT' },
  { name: 'Zeynep Ersal', email: 'zeynep@ornek.com', password: '123', role: 'PATIENT' }
];

const Login = () => {
  const navigate = useNavigate();

  // Bozuk localStorage verilerini temizle
  useEffect(() => {
    const safeKeys = ['user', 'userAccounts', 'adminReferences', 'drbio_feedbacks', 'userNotifications', 'theme'];
    safeKeys.forEach(key => {
      const val = localStorage.getItem(key);
      if (val) {
        try { JSON.parse(val); } catch (e) { localStorage.removeItem(key); }
      }
    });
    // Ayrıca 'user' varsa ama geçerli role içermiyorsa temizle
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        if (!u || !u.role || !u.email) localStorage.removeItem('user');
      } catch (e) { localStorage.removeItem('user'); }
    }
  }, []);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Temel Kayıt, 2: Sağlık Bilgileri Formu
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [activeFooterModal, setActiveFooterModal] = useState(null);

  // Şifre sıfırlama formu için state'ler
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');

  // Yardımcı fonksiyon kaldırıldı, artık backend kullanılıyor.

  // Tüm kayıt ve sağlık verileri için state
  const [formData, setFormData] = useState({
    // Temel Bilgiler
    name: '',
    email: '',
    password: '',
    role: 'PATIENT',

    // Zorunlu Sağlık Bilgileri
    age: '',
    weight: '',
    height: '',
    gender: '',

    // Detaylı Sağlık & Yaşam Tarzı Bilgileri
    maritalStatus: 'Bekar',
    hasChildren: 'Hayır',
    occupation: '',
    geneticDiseases: '',
    pastSurgeries: '',
    regularMedications: '',
    allergies: '',
    chronicComplaints: '',
    smoking: 'Kullanmıyor',
    alcohol: 'Kullanmıyor'
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setShowForgotPassword(false);
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, role, fullName, email: userEmail, userId } = response.data;

      const userRole = role || 'PATIENT';
      const path = userRole === 'ADMIN' ? '/admin' : '/patient';

      localStorage.setItem('user', JSON.stringify({
        id: userId,
        name: fullName || email.split('@')[0],
        email: userEmail || email,
        role: userRole,
        token: token,
        healthProfile: {}
      }));

      navigate(path);
    } catch (error) {
      console.error(error);
      if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 404)) {
        setLoginError('E-posta veya şifre hatalı! Kaydınız yoksa lütfen kaydolun.');
        setShowForgotPassword(true);
      } else {
        setLoginError('Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenResetPassword = () => {
    setIsResetPasswordOpen(true);
    setIsRegisterOpen(false);
    setNewPassword('');
    setConfirmPassword('');
    setResetError('');
    setLoginError('');
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setResetError('');

    if (newPassword !== confirmPassword) {
      setResetError('Girdiğiniz şifreler eşleşmiyor! Lütfen kontrol edip tekrar deneyin.');
      return;
    }

    if (newPassword.length < 3) {
      setResetError('Şifreniz en az 3 karakter olmalıdır.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const normEmail = email.trim().toLowerCase();
      const accounts = getUserAccounts();

      // Hesap listesindeki şifreyi yeni şifre ile güncelle
      const updatedAccounts = accounts.map(acc => {
        if (acc.email.trim().toLowerCase() === normEmail) {
          return { ...acc, password: newPassword };
        }
        return acc;
      });

      localStorage.setItem('userAccounts', JSON.stringify(updatedAccounts));

      // Giriş şifresi state'ini güncelle ve giriş formuna başarı mesajıyla dön
      setPassword(newPassword);
      setIsResetPasswordOpen(false);
      setShowForgotPassword(false);
      setSuccessMessage('Şifreniz başarıyla güncellendi! Yeni şifrenizle giriş yapabilirsiniz.');

      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    }, 600);
  };

  const handleBasicSubmit = (e) => {
    e.preventDefault();
    setRegisterError('');
    // Frontend-side duplicate check is removed, we'll let the backend handle uniqueness
    setStep(2);
  };

  const handleHealthSubmit = (e) => {
    e.preventDefault();
    setRegisterError('');
    setStep(3); // Adım 3: Kullanım Şartları & Onay Sözleşmesi
  };

  const handleFinalRegister = async () => {
    if (!termsAccepted) {
      setRegisterError('Kayıt işlemini tamamlamak için lütfen kullanım şartlarını ve tıbbi teşhis bildirimini kabul ediniz.');
      return;
    }
    setLoading(true);
    setRegisterError('');

    try {
      // Backend'in beklediği Registration payload'ı:
      const payload = {
        email: formData.email,
        password: formData.password,
        fullName: formData.name,
        gender: formData.gender === 'Kadın' ? 'FEMALE' : (formData.gender === 'Erkek' ? 'MALE' : 'OTHER'),
        birthDate: new Date().getFullYear() - parseInt(formData.age || 30) + "-01-01", // Yaş'ı birthdate'e çevirme varsayımı
        role: formData.role,
        kvkkApproved: true
      };

      await api.post('/auth/register', payload);

      setSuccessMessage('Kayıt işleminiz ve sözleşme onayınız başarıyla oluşturuldu! Yönlendiriliyorsunuz...');

      // Kayıt başarılıysa otomatik login yapalım
      const loginResp = await api.post('/auth/login', { email: formData.email, password: formData.password });
      const { token, role, fullName, email: userEmail, userId } = loginResp.data;

      const userRole = role || 'PATIENT';
      const path = userRole === 'ADMIN' ? '/admin' : '/patient';

      localStorage.setItem('user', JSON.stringify({
        id: userId,
        name: fullName || formData.email.split('@')[0],
        email: userEmail || formData.email,
        role: userRole,
        token: token,
        memberSince: new Date().toISOString(),
        healthProfile: {}
      }));

      setTimeout(() => navigate(path), 900);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 409) {
        setRegisterError('Bu e-posta adresi zaten kullanılıyor.');
        setStep(1);
      } else {
        setRegisterError('Kayıt işlemi sırasında bir hata oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 py-8 relative overflow-hidden"
    >
      {/* Light overlay — no blur for performance */}
      <div className="absolute inset-0 bg-white/30 dark:bg-stone-950/70"></div>

      {/* Theme Toggle Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle className="bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-700 shadow-sm" />
      </div>

      <AuthBackground />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Left Marketing Panel (Screens >= 1024px only) */}
        <div className="hidden lg:flex flex-col flex-1 max-w-lg space-y-8 pr-4">
          <div className="space-y-3">
            <h1 className="text-3xl lg:text-4xl font-black text-stone-800 dark:text-stone-100 tracking-tight leading-tight">
              Tahlillerinizi saniyeler içinde anlayın
            </h1>
            <p className="text-base font-medium text-stone-600 dark:text-stone-300 leading-relaxed">
              Dr. Bio, laboratuvar sonuçlarınızı analiz ederek anlaşılır hale getirir.
            </p>
          </div>

          <div className="space-y-6 pt-2">
            {/* Feature 1 */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-950/50 rounded-2xl border border-red-200/60 dark:border-red-900/40 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-black text-base text-stone-800 dark:text-stone-100">
                  Anında Analiz
                </h3>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-0.5">
                  Sonuçlarınızı hemen görün
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-950/50 rounded-2xl border border-red-200/60 dark:border-red-900/40 flex items-center justify-center shrink-0">
                <LineChart className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-black text-base text-stone-800 dark:text-stone-100">
                  Referans Takibi
                </h3>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-0.5">
                  Değerlerinizi geçmişle karşılaştırın
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-950/50 rounded-2xl border border-red-200/60 dark:border-red-900/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-black text-base text-stone-800 dark:text-stone-100">
                  Güvenli Saklama
                </h3>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-0.5">
                  Verileriniz sizde kalır
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className={`w-full ${isRegisterOpen && (step === 2 || step === 3) ? 'max-w-xl' : 'max-w-md'} bg-theme-card rounded-2xl p-8 shadow-clay-card dark:shadow-clay-card-dark border-theme-border animate-fade-in transition-all duration-300`}>
        <Logo size="lg" className="justify-center mb-8" />

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-2xl flex items-center space-x-3 text-sm font-bold animate-fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {isResetPasswordOpen ? (
          /* --- SİFRE SIFIRLAMA FORMU --- */
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center space-x-1 text-amber-600 dark:text-amber-400 font-bold text-sm mb-1">
                <KeyRound className="w-4 h-4" />
                <span>Yeni Şifre Oluşturma</span>
              </div>
              <h2 className="text-xl font-black text-stone-800 dark:text-stone-100">Şifrenizi Güncelleyin</h2>
              <p className="text-xs text-stone-500 font-bold mt-1">
                <span className="text-red-600 dark:text-red-400">{email}</span> hesabı için yeni şifre belirleyin
              </p>
            </div>

            {resetError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 rounded-2xl flex items-center space-x-3 text-xs font-bold animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                <span>{resetError}</span>
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Yeni Şifre</label>
                <Input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Yeni Şifre (Tekrar)</label>
                <Input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {/* Şifreyi Güncelle Butonu */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-clay-btn active:scale-95 transition-all flex items-center justify-center space-x-2 mt-4 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Şifreyi Güncelle ve Giriş Yap</span>}
              </button>

              <button
                type="button"
                onClick={() => setIsResetPasswordOpen(false)}
                className="w-full py-2.5 text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-all text-center block"
              >
                Giriş Ekranına Geri Dön
              </button>
            </form>
          </div>
        ) : !isRegisterOpen ? (
          /* --- GİRİŞ YAP FORMU VE ALANI --- */
          <div>

            {/* Giriş Hatası Uyarısı */}
            {loginError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 rounded-2xl space-y-2 animate-fade-in">
                <div className="flex items-center space-x-3 text-xs font-bold">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                  <span>{loginError}</span>
                </div>

                {/* Kayıt Yoksa Kaydol Butonu */}
                {loginError.includes('kayıt bulunmamaktadır') && (
                  <button
                    type="button"
                    onClick={() => { setLoginError(''); setIsRegisterOpen(true); setStep(1); }}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all text-xs flex items-center justify-center space-x-1 shadow-clay-btn"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Hemen Kaydolun</span>
                  </button>
                )}

                {/* Şifre Yanlışsa Şifremi Unuttum Butonu */}
                {showForgotPassword && (
                  <button
                    type="button"
                    onClick={handleOpenResetPassword}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all text-xs flex items-center justify-center space-x-1 shadow-clay-btn"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Şifremi Unuttum? (Yeni Şifre Oluştur)</span>
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">E-posta Adresi</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hasta@drbio.com"
                  required
                  className="w-full px-5 py-4 bg-theme-bg rounded-2xl font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600/20 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-2">
                  <label className="block text-sm font-black text-stone-400 uppercase tracking-widest">Şifre</label>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {/* Beni Hatırla & Şifremi Unuttum Row */}
              <div className="flex items-center justify-between pt-1 pb-1 px-1">
                <label className="flex items-center space-x-2 text-xs font-bold text-stone-600 dark:text-stone-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-stone-300 dark:border-stone-700 text-red-600 accent-red-600 cursor-pointer"
                  />
                  <span>Beni Hatırla</span>
                </label>

                <button
                  type="button"
                  onClick={handleOpenResetPassword}
                  className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline transition-colors"
                >
                  Şifremi Unuttum?
                </button>
              </div>

              {/* Giriş Yap Butonu */}
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-clay-btn active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 text-base"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Giriş Yap</span>}
              </button>
            </form>

            {/* --- KAYIT OL YÖNLENDİRMESİ VE BUTONU --- */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-sm font-bold text-slate-500 mb-4">Hesabınız yok mu?</p>
              <button
                type="button"
                onClick={() => { setLoginError(''); setIsRegisterOpen(true); setStep(1); }}
                className="w-full py-4 bg-transparent border-2 border-red-600 text-red-600 dark:text-red-400 font-extrabold rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/30 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>Kayıt Ol</span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 text-center mb-4 uppercase tracking-wider">Test Hesapları (Gerçek Backend)</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setEmail('admin@drbio.com'); setPassword('admin123'); setLoginError(''); }} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-red-600 border border-slate-200 dark:border-slate-700 flex flex-col items-center"><Shield className="w-4 h-4 mb-1 text-red-600" />Admin</button>
                <button onClick={() => { setEmail('hasta@drbio.com'); setPassword('hasta123'); setLoginError(''); }} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-red-600 border border-slate-200 dark:border-slate-700 flex flex-col items-center"><User className="w-4 h-4 mb-1 text-red-600" />Hasta</button>
              </div>
            </div>
          </div>
        ) : step === 1 ? (
          /* --- ADIM 1: TEMEL KAYIT FORMU --- */
          <div>
            <div className="text-center mb-6">
              <p className="text-stone-500 font-bold text-sm">Adım 1 / 2</p>
              <h2 className="text-xl font-black text-stone-800 dark:text-stone-200 mt-1">Önce temel hesap bilgilerinizi oluşturalım</h2>
            </div>

            {registerError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 rounded-2xl flex items-center space-x-3 text-xs font-bold animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                <span>{registerError}</span>
              </div>
            )}

            <form onSubmit={handleBasicSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2 ml-2">Ad Soyad</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Zeynep Ersal"
                  className="w-full px-5 py-3.5 bg-theme-bg rounded-3xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2 ml-2">E-posta Adresi</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="zeynep@ornek.com"
                  className="w-full px-5 py-3.5 bg-theme-bg rounded-3xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2 ml-2">Şifre</label>
                <Input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2 ml-2">Hesap Türü</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-5 py-3.5 bg-theme-bg rounded-3xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-inner"
                >
                  <option value="PATIENT">Hasta</option>
                  <option value="ADMIN">Yönetici (Admin)</option>
                </select>
              </div>

              {/* Devam Et Butonu */}
              <button
                type="submit"
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-3xl shadow-clay-btn active:scale-95 transition-all flex items-center justify-center space-x-2 mt-6"
              >
                <span>Devam Et (Sağlık Bilgileri)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Geri Dönüş Linki */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsRegisterOpen(false)}
                className="text-sm font-bold text-red-600 dark:text-red-400 hover:underline transition-all"
              >
                Zaten hesabınız var mı? Giriş Yapın
              </button>
            </div>
          </div>
        ) : step === 2 ? (
          /* --- ADIM 2: HASTA SAĞLIK VE ANAMNEZ FORMU --- */
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-1">
                <HeartPulse className="w-4 h-4 animate-pulse" />
                <span>Adım 2 / 2 - Sağlık & Profil Bilgileri</span>
              </div>
              <h2 className="text-xl font-black text-stone-800 dark:text-stone-200">Tıbbi Özgeçmiş ve Profil</h2>
              <p className="text-xs text-stone-500 font-bold mt-1">Size daha iyi hizmet verebilmemiz için lütfen formu doldurun</p>
            </div>

            <form onSubmit={handleHealthSubmit} className="space-y-4 text-left">

              {/* Zorunlu Alanlar (Kırmızı Ünlemli ⚠️) */}
              <div className="bg-blue-50/80 dark:bg-blue-950/30 p-4 rounded-3xl border border-blue-200 dark:border-blue-900">
                <p className="text-xs font-black text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-3">Zorunlu Sağlık Verileri</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1 mb-1">
                      Yaş <span className="text-red-500 font-extrabold text-xs" title="Bu bilgiyi girmek zorunludur">⚠️</span>
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Örn: 22"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1 mb-1">
                      Cinsiyet <span className="text-red-500 font-extrabold text-xs" title="Bu bilgiyi girmek zorunludur">⚠️</span>
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="">Seçiniz</option>
                      <option value="Kadın">Kadın</option>
                      <option value="Erkek">Erkek</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1 mb-1">
                      Boy (cm) <span className="text-red-500 font-extrabold text-xs" title="Bu bilgiyi girmek zorunludur">⚠️</span>
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Örn: 170"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1 mb-1">
                      Kilo (kg) <span className="text-red-500 font-extrabold text-xs" title="Bu bilgiyi girmek zorunludur">⚠️</span>
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Örn: 60"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Sosyal ve Demografik Bilgiler */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Medeni Durum</label>
                  <select
                    className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none text-sm"
                    value={formData.maritalStatus}
                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                  >
                    <option value="Bekar">Bekar</option>
                    <option value="Evli">Evli</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Çocuğunuz var mı?</label>
                  <select
                    className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none text-sm"
                    value={formData.hasChildren}
                    onChange={(e) => setFormData({ ...formData, hasChildren: e.target.value })}
                  >
                    <option value="Hayır">Hayır</option>
                    <option value="Evet">Evet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Yaptığınız İş / Meslek</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none text-sm"
                  placeholder="Örn: Yazılım Mühendisi, Öğrenci..."
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                />
              </div>

              {/* Tıbbi Geçmiş */}
              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Genetik / Kronik Hastalık Var mı?</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none text-sm"
                  placeholder="Örn: Diyabet, Tansiyon (Yoksa boş bırakın)"
                  value={formData.geneticDiseases}
                  onChange={(e) => setFormData({ ...formData, geneticDiseases: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Geçirdiğiniz Operasyonlar / Ameliyatlar</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none text-sm"
                  placeholder="Örn: Apandisit ameliyatı (Yoksa yok yazabilirsiniz)"
                  value={formData.pastSurgeries}
                  onChange={(e) => setFormData({ ...formData, pastSurgeries: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Sürekli Kullandığınız İlaçlar</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none text-sm"
                  placeholder="Örn: Kan sulandırıcı, tansiyon ilacı vb."
                  value={formData.regularMedications}
                  onChange={(e) => setFormData({ ...formData, regularMedications: e.target.value })}
                />
              </div>

              {/* Eklenen Akıllı Alanlar: Alerjiler ve Kronik Ağrı */}
              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Bilinen Bir Alerjiniz Var mı?</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none text-sm"
                  placeholder="Örn: Polen, Penisilin, Arı..."
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Kronik Ağrı / Şikayetiniz Var mı?</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none text-sm"
                  placeholder="Örn: Kronik bel ağrısı, migren..."
                  value={formData.chronicComplaints}
                  onChange={(e) => setFormData({ ...formData, chronicComplaints: e.target.value })}
                />
              </div>

              {/* Yaşam Tarzı / Alışkanlıklar */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Sigara Tüketimi</label>
                  <select
                    className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none text-sm"
                    value={formData.smoking}
                    onChange={(e) => setFormData({ ...formData, smoking: e.target.value })}
                  >
                    <option value="Kullanmıyor">Kullanmıyor</option>
                    <option value="Ara sıra">Ara sıra</option>
                    <option value="Düzenli / Kullanıyor">Düzenli / Kullanıyor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Alkol Tüketimi</label>
                  <select
                    className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none text-sm"
                    value={formData.alcohol}
                    onChange={(e) => setFormData({ ...formData, alcohol: e.target.value })}
                  >
                    <option value="Kullanmıyor">Kullanmıyor</option>
                    <option value="Sosyal olarak">Sosyal olarak</option>
                    <option value="Düzenli">Düzenli</option>
                  </select>
                </div>
              </div>

              {/* Devam Et Butonu */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-3xl shadow-clay-btn active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Devam Et (Kullanım Şartları Onayı) →</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-2.5 text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-all flex items-center justify-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Temel Bilgilere Geri Dön</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* --- ADIM 3: KULLANIM ŞARTLARI VE SÖZLEŞME ONAYI --- */
          <div className="space-y-5 animate-fade-in">
            <div className="text-center space-y-1">
              <p className="text-stone-400 font-bold text-xs uppercase tracking-wider">Adım 3 / 3 — Son Onay</p>
              <h2 className="text-xl font-black text-stone-800 dark:text-stone-100">Kullanım Şartları & Onay Sözleşmesi</h2>
              <p className="text-xs text-stone-500 font-medium">Lütfen aşağıdaki hizmet şartlarını ve sağlık bildirimi sözleşmesini inceleyiniz.</p>
            </div>

            {registerError && (
              <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 rounded-2xl flex items-center space-x-3 text-xs font-bold animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                <span>{registerError}</span>
              </div>
            )}

            {/* Kaydırılabilir Sözleşme Kutusu */}
            <div className="max-h-56 overflow-y-auto bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 space-y-3.5 text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              <div className="space-y-1">
                <h4 className="font-black text-stone-800 dark:text-stone-100 text-xs flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
                  <span>1. Tıbbi Teşhis Sorumluluk Reddi</span>
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Dr. Bio platformundaki yapay zeka tahlil yorumlamaları ve genel sağlık önerileri yalnızca <b>bilgilendirme amaçlıdır</b>. Kesin tıbbi teşhis, reçete veya tedavi yerine geçmez. Sağlık durumunuz için yetkili hekime danışınız.
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-stone-200/60 dark:border-stone-800">
                <h4 className="font-black text-stone-800 dark:text-stone-100 text-xs flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>2. KVKK ve Kişisel Veri Gizliliği</span>
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Üyeliğiniz kapsamında sistemimize aktardığınız laboratuvar sonuçları ve kişisel sağlık verileriniz 6698 sayılı KVKK ilkelerine uygun olarak şifrelenir ve izinsiz 3. taraflarla asla paylaşılmaz.
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-stone-200/60 dark:border-stone-800">
                <h4 className="font-black text-stone-800 dark:text-stone-100 text-xs flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>3. Kullanıcı Beyanı ve Sorumluluk</span>
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Kullanıcı, üyelik formlarında beyan ettiği ad, e-posta ve sağlık geçmişi bilgilerinin doğruluğundan bizzat sorumludur.
                </p>
              </div>
            </div>

            {/* Onay Checkbox'ı */}
            <label className="flex items-start space-x-3 p-3.5 bg-red-50/60 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/40 rounded-2xl cursor-pointer select-none">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-red-300 text-red-600 accent-red-600 cursor-pointer shrink-0"
              />
              <span className="text-xs font-bold text-stone-700 dark:text-stone-200 leading-snug">
                Dr. Bio Kullanım Şartları'nı, KVKK Aydınlatma Metni'ni ve Tıbbi Teşhis Sorumluluk Reddi Beyanı'nı okudum, anladım ve kabul ediyorum.
              </span>
            </label>

            {/* Okudum, Anladım ve Kabul Ediyorum Butonu */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleFinalRegister}
                disabled={loading || !termsAccepted}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-clay-btn active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 text-sm"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Okudum, Anladım ve Kabul Ediyorum</span>}
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-2.5 text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-all flex items-center justify-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sağlık Bilgilerine Geri Dön</span>
              </button>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Bottom-Left Anchored Page Footer Area */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-auto">
        <div className="flex items-center space-x-3 text-xs font-bold text-stone-500 dark:text-stone-400">
          <button
            type="button"
            onClick={() => setActiveFooterModal('privacy')}
            className="hover:text-red-600 dark:hover:text-red-400 transition-colors focus:outline-none cursor-pointer"
          >
            Gizlilik Politikası
          </button>
          <span className="text-stone-300 dark:text-stone-600">•</span>
          <button
            type="button"
            onClick={() => setActiveFooterModal('terms')}
            className="hover:text-red-600 dark:hover:text-red-400 transition-colors focus:outline-none cursor-pointer"
          >
            Kullanım Şartları
          </button>
          <span className="text-stone-300 dark:text-stone-600">•</span>
          <button
            type="button"
            onClick={() => setActiveFooterModal('contact')}
            className="hover:text-red-600 dark:hover:text-red-400 transition-colors focus:outline-none cursor-pointer"
          >
            İletişim
          </button>
        </div>
      </div>

      {/* Interactive Footer Informational Modals */}
      <FooterInfoModals
        activeModal={activeFooterModal}
        onClose={() => setActiveFooterModal(null)}
      />
    </div>
  );
};

export default Login;


