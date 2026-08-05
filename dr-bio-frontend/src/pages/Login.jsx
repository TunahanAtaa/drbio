import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Shield, User, Loader2, UserPlus, CheckCircle2, ArrowRight, ArrowLeft, HeartPulse, AlertCircle, KeyRound, Lock, Check } from 'lucide-react';

const defaultUsers = [
  { name: 'Sistem Yöneticisi', email: 'admin@drbio.com', password: '123', role: 'ADMIN' },
  { name: 'Zeynep Ersal', email: 'hasta@drbio.com', password: '123', role: 'PATIENT' },
  { name: 'Zeynep Ersal', email: 'zeynep@ornek.com', password: '123', role: 'PATIENT' }
];

const Login = () => {
  const navigate = useNavigate();
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

  // Şifre sıfırlama formu için state'ler
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');

  // Tüm kullanıcı hesaplarını localStorage'dan çeken veya varsayılanları getiren yardımcı
  const getUserAccounts = () => {
    const saved = localStorage.getItem('userAccounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing userAccounts', e);
      }
    }
    return defaultUsers;
  };

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

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    setShowForgotPassword(false);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const normEmail = email.trim().toLowerCase();
      const accounts = getUserAccounts();

      // 1. Hesap kayıtlı mı kontrolü
      const foundUser = accounts.find(u => u.email.trim().toLowerCase() === normEmail);

      if (!foundUser) {
        setLoginError('Böyle bir kayıt bulunmamaktadır! Sisteme giriş yapabilmek için lütfen önce kaydolun.');
        setShowForgotPassword(false);
        return;
      }

      // 2. Şifre doğrulaması
      if (foundUser.password && password !== foundUser.password) {
        setLoginError('E-posta veya şifre hatalı!');
        setShowForgotPassword(true);
        return;
      }

      // 3. Doğru giriş -> İsim ve Soyisim bilgisiyle oturum aç
      const role = foundUser.role || 'PATIENT';
      const path = role === 'ADMIN' ? '/admin' : '/patient';

      localStorage.setItem('user', JSON.stringify({ 
        name: foundUser.name || normEmail.split('@')[0].toUpperCase(), 
        email: foundUser.email, 
        role: role,
        healthProfile: foundUser.healthProfile || {}
      }));

      navigate(path);
    }, 600);
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

    // E-posta benzersizlik (duplicate) kontrolü
    const accounts = getUserAccounts();
    const normalizedEmail = formData.email.trim().toLowerCase();

    if (accounts.some(u => u.email.trim().toLowerCase() === normalizedEmail)) {
      setRegisterError('Bu e-posta adresi ile zaten kayıtlı bir hesap bulunmaktadır! Lütfen farklı bir e-posta adresi deneyin veya giriş yapın.');
      return;
    }

    // Sorun yoksa Adım 2 (Sağlık Bilgileri)'ne geç
    setStep(2);
  };

  const handleHealthSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      console.log("Kaydedilen Hasta Verileri:", formData);
      
      let path = '/patient';
      if (formData.role === 'ADMIN') path = '/admin';

      const normalizedEmail = formData.email.trim().toLowerCase();
      const accounts = getUserAccounts();

      const newUserObj = {
        name: formData.name,
        email: normalizedEmail,
        password: formData.password,
        role: formData.role,
        healthProfile: {
          age: formData.age,
          weight: formData.weight,
          height: formData.height,
          gender: formData.gender,
          maritalStatus: formData.maritalStatus,
          hasChildren: formData.hasChildren,
          occupation: formData.occupation,
          geneticDiseases: formData.geneticDiseases,
          pastSurgeries: formData.pastSurgeries,
          regularMedications: formData.regularMedications,
          allergies: formData.allergies,
          chronicComplaints: formData.chronicComplaints,
          smoking: formData.smoking,
          alcohol: formData.alcohol
        }
      };

      if (!accounts.some(u => u.email.trim().toLowerCase() === normalizedEmail)) {
        accounts.push(newUserObj);
        localStorage.setItem('userAccounts', JSON.stringify(accounts));
      }

      // Kullanıcı adını Tam Ad Soyad olarak kaydet
      localStorage.setItem('user', JSON.stringify({ 
        name: formData.name, 
        email: formData.email, 
        role: formData.role,
        healthProfile: newUserObj.healthProfile
      }));
      
      setSuccessMessage('Kayıt ve sağlık profiliniz başarıyla oluşturuldu! Yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate(path);
      }, 900);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-theme-bg flex items-center justify-center p-4 py-8">
      <div className={`w-full ${isRegisterOpen && step === 2 ? 'max-w-xl' : 'max-w-md'} bg-theme-card rounded-[2rem] p-8 shadow-clay-card dark:shadow-clay-card-dark border-theme-border animate-fade-in transition-all duration-300`}>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-600 rounded-2xl shadow-clay-btn flex items-center justify-center text-white font-black text-3xl">
            <Activity className="w-8 h-8" />
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-center text-stone-800 dark:text-stone-200 mb-2">Dr. Bio</h1>

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
              <h2 className="text-xl font-black text-stone-800 dark:text-stone-200">Şifrenizi Güncelleyin</h2>
              <p className="text-xs text-stone-500 font-bold mt-1">
                <span className="text-red-600">{email}</span> hesabı için yeni şifre belirleyin
              </p>
            </div>

            {resetError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl flex items-center space-x-3 text-xs font-bold animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                <span>{resetError}</span>
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2 ml-2">Yeni Şifre</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 bg-theme-bg rounded-3xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-4 focus:ring-amber-500/20 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2 ml-2">Yeni Şifre (Tekrar)</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 bg-theme-bg rounded-3xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-4 focus:ring-amber-500/20 shadow-inner"
                />
              </div>

              {/* Şifreyi Güncelle Butonu */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-3xl shadow-clay-btn active:scale-95 transition-all flex items-center justify-center space-x-2 mt-4 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Şifreyi Güncelle</span>}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsResetPasswordOpen(false)}
                className="text-sm font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-all flex items-center justify-center space-x-1 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Giriş Ekranına Dön</span>
              </button>
            </div>
          </div>
        ) : !isRegisterOpen ? (
          /* --- GİRİŞ YAP FORMU VE ALANI --- */
          <div>
            <p className="text-center text-stone-500 font-bold mb-6">Sisteme Giriş Yapın</p>

            {/* Giriş Hatası Uyarısı */}
            {loginError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl space-y-3 text-xs font-bold animate-fade-in">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                  <span className="leading-relaxed">{loginError}</span>
                </div>
                
                {/* Kayıt Yoksa Kaydol Butonu */}
                {loginError.includes('kayıt bulunmamaktadır') && (
                  <button
                    type="button"
                    onClick={() => { setLoginError(''); setIsRegisterOpen(true); setStep(1); }}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all text-xs flex items-center justify-center space-x-1"
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
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all text-xs flex items-center justify-center space-x-1 shadow-sm"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Şifremi Unuttum? (Yeni Şifre Oluştur)</span>
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-black text-stone-400 uppercase tracking-widest mb-2 ml-2">E-posta Adresi</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hasta@drbio.com"
                  required
                  className="w-full px-5 py-4 bg-theme-bg rounded-3xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-4 focus:ring-red-600/20 shadow-inner"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-2">
                  <label className="block text-sm font-black text-stone-400 uppercase tracking-widest">Şifre</label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-theme-bg rounded-3xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-4 focus:ring-red-600/20 shadow-inner"
                />
              </div>
              
              {/* Giriş Yap Butonu */}
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-3xl shadow-clay-btn active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Giriş Yap</span>}
              </button>
            </form>

            {/* --- KAYIT OL YÖNLENDİRMESİ VE BUTONU --- */}
            <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800 text-center">
              <p className="text-sm font-bold text-stone-500 mb-4">Hesabınız yok mu?</p>
              <button
                type="button"
                onClick={() => { setLoginError(''); setIsRegisterOpen(true); setStep(1); }}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-3xl shadow-clay-btn active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>Kayıt Ol</span>
              </button>
            </div>

            {/* Test Hesapları */}
            <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
              <p className="text-xs font-bold text-stone-400 text-center mb-4 uppercase">Test Hesapları</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setEmail('admin@drbio.com'); setPassword('123'); setLoginError(''); }} className="p-2 bg-theme-bg rounded-xl text-xs font-bold text-stone-500 hover:text-red-600 shadow-sm flex flex-col items-center"><Shield className="w-4 h-4 mb-1"/>Admin</button>
                <button onClick={() => { setEmail('hasta@drbio.com'); setPassword('123'); setLoginError(''); }} className="p-2 bg-theme-bg rounded-xl text-xs font-bold text-stone-500 hover:text-red-600 shadow-sm flex flex-col items-center"><User className="w-4 h-4 mb-1"/>Hasta</button>
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
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl flex items-center space-x-3 text-xs font-bold animate-fade-in">
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
                  placeholder="ornek@mail.com"
                  className="w-full px-5 py-3.5 bg-theme-bg rounded-3xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2 ml-2">Şifre</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 bg-theme-bg rounded-3xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-inner"
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
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl shadow-clay-btn active:scale-95 transition-all flex items-center justify-center space-x-2 mt-6"
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
                className="text-sm font-bold text-red-600 hover:underline transition-all"
              >
                Zaten hesabınız var mı? Giriş Yapın
              </button>
            </div>
          </div>
        ) : (
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
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, hasChildren: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, occupation: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, geneticDiseases: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Geçirdiğiniz Operasyonlar / Ameliyatlar</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none text-sm"
                  placeholder="Örn: Apandisit ameliyatı (Yoksa yok yazabilirsiniz)"
                  value={formData.pastSurgeries}
                  onChange={(e) => setFormData({...formData, pastSurgeries: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Sürekli Kullandığınız İlaçlar</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none text-sm"
                  placeholder="Örn: Kan sulandırıcı, tansiyon ilacı vb."
                  value={formData.regularMedications}
                  onChange={(e) => setFormData({...formData, regularMedications: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Kronik Ağrı / Şikayetiniz Var mı?</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none text-sm"
                  placeholder="Örn: Kronik bel ağrısı, migren..."
                  value={formData.chronicComplaints}
                  onChange={(e) => setFormData({...formData, chronicComplaints: e.target.value})}
                />
              </div>

              {/* Yaşam Tarzı / Alışkanlıklar */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Sigara Tüketimi</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none text-sm"
                    value={formData.smoking}
                    onChange={(e) => setFormData({...formData, smoking: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, alcohol: e.target.value})}
                  >
                    <option value="Kullanmıyor">Kullanmıyor</option>
                    <option value="Sosyal olarak">Sosyal olarak</option>
                    <option value="Düzenli">Düzenli</option>
                  </select>
                </div>
              </div>

              {/* Kaydı Tamamla ve Panele Git */}
              <div className="pt-2 space-y-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-3xl shadow-clay-btn active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Kaydı Tamamla ve Panele Git</span>}
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
        )}
      </div>
    </div>
  );
};

export default Login;


