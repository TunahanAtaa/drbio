import React, { useState, useEffect } from 'react';
import { User, Edit3, Save, X, CheckCircle2, Heart, Shield, Activity, Sparkles } from 'lucide-react';

const UserProfile = () => {
  // LocalStorage'dan mevcut kullanıcı ve sağlık profilini yükle, yoksa varsayılan veriyi kullan
  const loadInitialData = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const profile = parsed.healthProfile || {};
        return {
          name: parsed.name || 'Zeynep Ersal',
          email: parsed.email || 'zeynep@ornek.com',
          role: parsed.role || 'PATIENT',
          age: profile.age || '22',
          weight: profile.weight || '60',
          height: profile.height || '170',
          gender: profile.gender || 'Kadın',
          maritalStatus: profile.maritalStatus || 'Bekar',
          hasChildren: profile.hasChildren || 'Hayır',
          occupation: profile.occupation || 'Yazılım Mühendisliği Öğrencisi',
          geneticDiseases: profile.geneticDiseases || 'Yok',
          pastSurgeries: profile.pastSurgeries || 'Yok',
          regularMedications: profile.regularMedications || 'Yok',
          allergies: profile.allergies || 'Polen',
          chronicComplaints: profile.chronicComplaints || 'Yok',
          smoking: profile.smoking || 'Kullanmıyor',
          alcohol: profile.alcohol || 'Kullanmıyor'
        };
      } catch (err) {
        console.error('User data parsing error', err);
      }
    }
    return {
      name: 'Zeynep Ersal',
      email: 'zeynep@ornek.com',
      role: 'PATIENT',
      age: '22',
      weight: '60',
      height: '170',
      gender: 'Kadın',
      maritalStatus: 'Bekar',
      hasChildren: 'Hayır',
      occupation: 'Yazılım Mühendisliği Öğrencisi',
      geneticDiseases: 'Yok',
      pastSurgeries: 'Yok',
      regularMedications: 'Yok',
      allergies: 'Polen',
      chronicComplaints: 'Yok',
      smoking: 'Kullanmıyor',
      alcohol: 'Kullanmıyor'
    };
  };

  const [user, setUser] = useState(loadInitialData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleUpdate = (e) => {
    e.preventDefault();
    setUser(formData);
    setIsEditing(false);

    // LocalStorage güncellemesi
    const savedUser = localStorage.getItem('user');
    let currentUserObj = {};
    if (savedUser) { try { currentUserObj = JSON.parse(savedUser) || {}; } catch(e) {} }
    
    currentUserObj = {
      ...currentUserObj,
      name: formData.name,
      email: formData.email,
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

    localStorage.setItem('user', JSON.stringify(currentUserObj));
    setSuccessMsg('Profil bilgileriniz başarıyla güncellendi!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Üst Header / Profil Kartı */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-900 rounded-2xl p-8 text-white shadow-clay-card dark:shadow-clay-card-dark border-theme-border relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Heart className="w-64 h-64 text-white" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-inner">
              {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">{user.name}</h1>
              <p className="text-red-100 font-medium text-sm mt-0.5">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                {user.role === 'PATIENT' ? 'Hasta Profili' : user.role}
              </span>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => { setFormData(user); setIsEditing(true); }}
              className="bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold px-5 py-3 rounded-2xl text-sm transition duration-200 flex items-center space-x-2 border border-white/20 shadow-clay-btn"
            >
              <Edit3 className="w-4 h-4" />
              <span>Bilgileri Düzenle</span>
            </button>
          )}
        </div>
      </div>

      {/* Başarı Bildirimi */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-2xl flex items-center space-x-3 text-sm font-bold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* İçerik Alanı: Görüntüleme veya Düzenleme Formu */}
      <div className="bg-theme-card rounded-2xl p-8 shadow-clay-card dark:shadow-clay-card-dark border-theme-border">
        {!isEditing ? (
          /* --- GÖRÜNTÜLEME MODU --- */
          <div className="space-y-8">
            
            {/* Fiziksel Bilgiler Kartları */}
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-4 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span>Kişisel ve Fiziksel Bilgiler</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-theme-bg p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <div>
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">YAŞ</span>
                  <span className="text-xl font-black text-slate-800 dark:text-slate-100">{user.age}</span>
                </div>
                <div>
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">CİNSİYET</span>
                  <span className="text-xl font-black text-slate-800 dark:text-slate-100">{user.gender}</span>
                </div>
                <div>
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">BOY</span>
                  <span className="text-xl font-black text-slate-800 dark:text-slate-100">{user.height} cm</span>
                </div>
                <div>
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">KİLO</span>
                  <span className="text-xl font-black text-slate-800 dark:text-slate-100">{user.weight} kg</span>
                </div>
              </div>
            </div>

            {/* Sosyal ve Yaşam Tarzı */}
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span>Sosyal ve Yaşam Tarzı</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between py-3 border-b border-slate-200 dark:border-slate-800 font-bold">
                  <span className="text-slate-500">Medeni Durum:</span>
                  <span className="text-slate-800 dark:text-slate-200">{user.maritalStatus}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-200 dark:border-slate-800 font-bold">
                  <span className="text-slate-500">Çocuk Durumu:</span>
                  <span className="text-slate-800 dark:text-slate-200">{user.hasChildren}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-200 dark:border-slate-800 font-bold">
                  <span className="text-slate-500">Meslek:</span>
                  <span className="text-slate-800 dark:text-slate-200">{user.occupation || 'Belirtilmemiş'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-200 dark:border-slate-800 font-bold">
                  <span className="text-slate-500">Sigara / Alkol:</span>
                  <span className="text-slate-800 dark:text-slate-200">{user.smoking} / {user.alcohol}</span>
                </div>
              </div>
            </div>

            {/* Tıbbi Geçmiş ve Sağlık */}
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-4 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span>Tıbbi Geçmiş ve Sağlık Bilgileri</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-theme-bg p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">GENETİK / KRONİK HASTALIKLAR</span>
                  <p className="text-slate-800 dark:text-slate-200 font-bold">{user.geneticDiseases || 'Yok'}</p>
                </div>
                <div className="bg-theme-bg p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">GEÇİRİLEN OPERASYONLAR</span>
                  <p className="text-slate-800 dark:text-slate-200 font-bold">{user.pastSurgeries || 'Yok'}</p>
                </div>
                <div className="bg-theme-bg p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">SÜREKLİ KULLANILAN İLAÇLAR</span>
                  <p className="text-slate-800 dark:text-slate-200 font-bold">{user.regularMedications || 'Yok'}</p>
                </div>
                <div className="bg-theme-bg p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">BİLİNEN ALERJİLER</span>
                  <p className="text-slate-800 dark:text-slate-200 font-bold">{user.allergies || 'Yok'}</p>
                </div>
                <div className="bg-theme-bg p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 md:col-span-2">
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">KRONİK AĞRI / ŞİKAYETLER</span>
                  <p className="text-slate-800 dark:text-slate-200 font-bold">{user.chronicComplaints || 'Yok'}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* --- DÜZENLEME (GÜNCELLEME) FORMU --- */
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Profil Bilgilerini Güncelle</h3>
              <span className="text-xs text-red-500 font-bold">⚠️ Zorunlu alanlar işaretlidir</span>
            </div>

            {/* Temel Bilgiler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Ad Soyad</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-3.5 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600/20"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">E-posta Adresi</label>
                <input
                  type="email"
                  required
                  className="w-full px-5 py-3.5 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600/20"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Zorunlu Fiziksel Veriler */}
            <div className="bg-sky-50/80 dark:bg-sky-950/30 p-5 rounded-2xl border border-sky-200 dark:border-sky-900">
              <p className="text-xs font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider mb-3">Zorunlu Sağlık Verileri ⚠️</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Yaş ⚠️</label>
                  <input 
                    type="number" required 
                    className="w-full px-4 py-2.5 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cinsiyet ⚠️</label>
                  <select 
                    required className="w-full px-4 py-2.5 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  >
                    <option value="Kadın">Kadın</option>
                    <option value="Erkek">Erkek</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Boy (cm) ⚠️</label>
                  <input 
                    type="number" required 
                    className="w-full px-4 py-2.5 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Kilo (kg) ⚠️</label>
                  <input 
                    type="number" required 
                    className="w-full px-4 py-2.5 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Düzenleme Kontrol Butonları */}
            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-clay-btn active:scale-95 transition text-sm flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Değişiklikleri Kaydet</span>
              </button>
              <button 
                type="button" 
                onClick={() => { setFormData(user); setIsEditing(false); }}
                className="px-6 py-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl transition text-sm flex items-center justify-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>İptal</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
