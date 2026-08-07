import React, { useState } from 'react';
import { User, Edit3, Save, X, CheckCircle2, Heart, HeartPulse, Sparkles, Activity } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';

export default function UserProfile({ initialUserData }) {
    // Kullanıcının güncel bilgilerini tutan state (LocalStorage ve veritabanı senkronizasyonu)
    const loadUserData = () => {
        if (initialUserData) return initialUserData;
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                const hp = parsed.healthProfile || {};
                return {
                    name: parsed.name || 'Zeynep Ersal',
                    email: parsed.email || 'zeynep@ornek.com',
                    role: parsed.role || 'PATIENT',
                    age: hp.age || '22',
                    weight: hp.weight || '60',
                    height: hp.height || '170',
                    gender: hp.gender || 'Kadın',
                    maritalStatus: hp.maritalStatus || 'Bekar',
                    hasChildren: hp.hasChildren || 'Hayır',
                    occupation: hp.occupation || 'Yazılım Mühendisliği Öğrencisi',
                    geneticDiseases: hp.geneticDiseases || 'Yok',
                    pastSurgeries: hp.pastSurgeries || 'Yok',
                    regularMedications: hp.regularMedications || 'Yok',
                    allergies: hp.allergies || 'Polen',
                    chronicComplaints: hp.chronicComplaints || 'Yok',
                    smoking: hp.smoking || 'Kullanmıyor',
                    alcohol: hp.alcohol || 'Kullanmıyor'
                };
            } catch (e) {
                console.error('Error parsing user storage', e);
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

    const [user, setUser] = useState(loadUserData);

    // Düzenleme modunda olup olmadığını kontrol eden state
    const [isEditing, setIsEditing] = useState(false);
    // Form geçici verileri (Düzenleme iptal edilirse eski haline dönebilmek için)
    const [formData, setFormData] = useState(user);
    const [successMsg, setSuccessMsg] = useState('');

    const handleUpdate = (e) => {
        e.preventDefault();
        setUser(formData); // State'i güncelle
        setIsEditing(false); // Düzenleme modundan çık

        // LocalStorage senkronizasyonu
        const savedUser = localStorage.getItem('user');
        let currentObj = {};
        if (savedUser) { try { currentObj = JSON.parse(savedUser) || {}; } catch(e) {} }
        currentObj = {
            ...currentObj,
            name: formData.name,
            email: formData.email,
            healthProfile: {
                ...(currentObj.healthProfile || {}),
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
        localStorage.setItem('user', JSON.stringify(currentObj));

        setSuccessMsg("Profil bilgileriniz başarıyla güncellendi!");
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            
            {/* Üst Header / Profil Kartı */}
            <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-900 rounded-[2.5rem] p-8 text-white shadow-clay-card dark:shadow-clay-card-dark relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-8 translate-y-8">
                    <HeartPulse className="w-80 h-80 text-white" />
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
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-3xl flex items-center space-x-3 text-sm font-bold animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>{successMsg}</span>
                </div>
            )}

            {/* İçerik Alanı: Görüntüleme veya Düzenleme Formu */}
            <div className="bg-theme-card rounded-[2.5rem] p-8 shadow-clay-card dark:shadow-clay-card-dark border-theme-border">
                {!isEditing ? (
                    /* --- GÖRÜNTÜLEME MODU --- */
                    <div className="space-y-8">
                        
                        {/* Fiziksel Bilgiler Kartları */}
                        <div>
                            <h3 className="text-lg font-black text-stone-800 dark:text-stone-200 mb-4 flex items-center space-x-2">
                                <Sparkles className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <span>Kişisel ve Fiziksel Bilgiler</span>
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-theme-bg p-5 rounded-3xl shadow-inner">
                                <div>
                                    <span className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1">YAŞ</span>
                                    <span className="text-xl font-black text-stone-800 dark:text-stone-200">{user.age}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1">CİNSİYET</span>
                                    <span className="text-xl font-black text-stone-800 dark:text-stone-200">{user.gender}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1">BOY</span>
                                    <span className="text-xl font-black text-stone-800 dark:text-stone-200">{user.height} cm</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1">KİLO</span>
                                    <span className="text-xl font-black text-stone-800 dark:text-stone-200">{user.weight} kg</span>
                                </div>
                            </div>
                        </div>

                        {/* Sosyal ve Yaşam Tarzı */}
                        <div>
                            <h3 className="text-lg font-black text-stone-800 dark:text-stone-200 mb-4 flex items-center space-x-2">
                                <User className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <span>Sosyal ve Yaşam Tarzı</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex justify-between py-3 border-b border-stone-200 dark:border-stone-800 font-bold">
                                    <span className="text-stone-500 dark:text-stone-400">Medeni Durum:</span>
                                    <span className="text-stone-800 dark:text-stone-200">{user.maritalStatus}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-stone-200 dark:border-stone-800 font-bold">
                                    <span className="text-stone-500 dark:text-stone-400">Çocuk Durumu:</span>
                                    <span className="text-stone-800 dark:text-stone-200">{user.hasChildren}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-stone-200 dark:border-stone-800 font-bold">
                                    <span className="text-stone-500 dark:text-stone-400">Meslek:</span>
                                    <span className="text-stone-800 dark:text-stone-200">{user.occupation || 'Belirtilmemiş'}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-stone-200 dark:border-stone-800 font-bold">
                                    <span className="text-stone-500 dark:text-stone-400">Sigara / Alkol:</span>
                                    <span className="text-stone-800 dark:text-stone-200">{user.smoking} / {user.alcohol}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tıbbi Geçmiş ve Sağlık */}
                        <div>
                            <h3 className="text-lg font-black text-stone-800 dark:text-stone-200 mb-4 flex items-center space-x-2">
                                <Activity className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <span>Tıbbi Geçmiş ve Sağlık Bilgileri</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="bg-theme-bg p-4 rounded-2xl">
                                    <span className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1">GENETİK / KRONİK HASTALIKLAR</span>
                                    <p className="text-stone-800 dark:text-stone-200 font-bold">{user.geneticDiseases || 'Yok'}</p>
                                </div>
                                <div className="bg-theme-bg p-4 rounded-2xl">
                                    <span className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1">GEÇİRİLEN OPERASYONLAR</span>
                                    <p className="text-stone-800 dark:text-stone-200 font-bold">{user.pastSurgeries || 'Yok'}</p>
                                </div>
                                <div className="bg-theme-bg p-4 rounded-2xl">
                                    <span className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1">SÜREKLİ KULLANILAN İLAÇLAR</span>
                                    <p className="text-stone-800 dark:text-stone-200 font-bold">{user.regularMedications || 'Yok'}</p>
                                </div>
                                <div className="bg-theme-bg p-4 rounded-2xl">
                                    <span className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1">BİLİNEN ALERJİLER</span>
                                    <p className="text-stone-800 dark:text-stone-200 font-bold">{user.allergies || 'Yok'}</p>
                                </div>
                                <div className="bg-theme-bg p-4 rounded-2xl md:col-span-2">
                                    <span className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1">KRONİK AĞRI / ŞİKAYETLER</span>
                                    <p className="text-stone-800 dark:text-stone-200 font-bold">{user.chronicComplaints || 'Yok'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* --- DÜZENLEME (GÜNCELLEME) FORMU --- */
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-stone-200 dark:border-stone-800">
                            <h3 className="text-xl font-black text-stone-800 dark:text-stone-200">Profil Bilgilerini Güncelle</h3>
                            <span className="text-xs text-red-500 font-bold">⚠️ Zorunlu alanlar işaretlidir</span>
                        </div>

                        {/* Temel Bilgiler */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Ad Soyad</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-5 py-3.5 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-3xl font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-red-600/20"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">E-posta Adresi</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-5 py-3.5 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-3xl font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-red-600/20"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Zorunlu Fiziksel Veriler */}
                        <div className="p-4 bg-blue-50/60 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/60 space-y-3">
                            <p className="text-xs font-black text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-3">Zorunlu Sağlık Verileri ⚠️</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Yaş ⚠️</label>
                                    <input
                                        type="number" required
                                        className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Cinsiyet ⚠️</label>
                                    <select
                                        required className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="Kadın">Kadın</option>
                                        <option value="Erkek">Erkek</option>
                                        <option value="Diğer">Diğer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Boy (cm) ⚠️</label>
                                    <input
                                        type="number" required
                                        className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.height}
                                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Kilo (kg) ⚠️</label>
                                    <input
                                        type="number" required
                                        className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sosyal Bilgiler */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Medeni Durum</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 text-sm focus:outline-none"
                                    value={formData.maritalStatus}
                                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                                >
                                    <option value="Bekar">Bekar</option>
                                    <option value="Evli">Evli</option>
                                    <option value="Diğer">Diğer</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Çocuk Durumu</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 text-sm focus:outline-none"
                                    value={formData.hasChildren}
                                    onChange={(e) => setFormData({ ...formData, hasChildren: e.target.value })}
                                >
                                    <option value="Hayır">Hayır</option>
                                    <option value="Evet">Evet</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Meslek</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 text-sm focus:outline-none"
                                value={formData.occupation}
                                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                            />
                        </div>

                        {/* Tıbbi Detaylar */}
                        <div>
                            <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Genetik / Kronik Hastalıklar</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 text-sm focus:outline-none"
                                value={formData.geneticDiseases}
                                onChange={(e) => setFormData({ ...formData, geneticDiseases: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Geçirilen Operasyonlar</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 text-sm focus:outline-none"
                                value={formData.pastSurgeries}
                                onChange={(e) => setFormData({ ...formData, pastSurgeries: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Sürekli Kullanılan İlaçlar</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 text-sm focus:outline-none"
                                value={formData.regularMedications}
                                onChange={(e) => setFormData({ ...formData, regularMedications: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Alerjiler</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 text-sm focus:outline-none"
                                value={formData.allergies}
                                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Kronik Ağrı / Şikayetler</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 text-sm focus:outline-none"
                                value={formData.chronicComplaints}
                                onChange={(e) => setFormData({ ...formData, chronicComplaints: e.target.value })}
                            />
                        </div>

                        {/* Yaşam Tarzı */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">Sigara Tüketimi</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 text-sm focus:outline-none"
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
                                    className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-stone-700 dark:text-stone-200 text-sm focus:outline-none"
                                    value={formData.alcohol}
                                    onChange={(e) => setFormData({ ...formData, alcohol: e.target.value })}
                                >
                                    <option value="Kullanmıyor">Kullanmıyor</option>
                                    <option value="Sosyal olarak">Sosyal olarak</option>
                                    <option value="Düzenli">Düzenli</option>
                                </select>
                            </div>
                        </div>

                        {/* Düzenleme Kontrol Butonları */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-3xl shadow-clay-btn active:scale-95 transition text-sm flex items-center justify-center space-x-2"
                            >
                                <Save className="w-5 h-5" />
                                <span>Değişiklikleri Kaydet</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setFormData(user); setIsEditing(false); }}
                                className="px-6 py-4 bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold rounded-3xl transition text-sm flex items-center justify-center space-x-2"
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
}