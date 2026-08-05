import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  Database, Plus, Trash2, Users, CheckCircle, XCircle, Search, Edit2, 
  Shield, Activity, FileText, Sparkles, Filter, ChevronRight, UserPlus, 
  Settings, Server, ArrowUpRight, Save, X, Eye, AlertTriangle, UserCheck, 
  Heart, Pill, Stethoscope, Scale, Ruler, Briefcase, Flame, Star, MessageSquare,
  Send, CheckCircle2, Bell
} from 'lucide-react';

const defaultFeedbacks = [
  { 
    id: 1, 
    userName: 'Zeynep Ersal', 
    userEmail: 'hasta@drbio.com', 
    rating: 5, 
    comment: 'Tahlil sonuçlarındaki hemoglobin ve kolesterol analizleri çok anlaşılır ifade edilmiş. Yapay zeka tavsiyeleri harika!', 
    date: '2026-08-05', 
    status: 'REVIEWED', 
    category: 'MEMNUNİYET' 
  },
  { 
    id: 2, 
    userName: 'Ahmet Yılmaz', 
    userEmail: 'ahmet@ornek.com', 
    rating: 4, 
    comment: 'PDF yükledikten sonra analiz hızlı geldi. Telefon ekranında grafiklerin biraz daha büyük olmasını öneririm.', 
    date: '2026-08-04', 
    status: 'UNREAD', 
    category: 'MEMNUNİYET' 
  },
  { 
    id: 3, 
    userName: 'Ayşe Kaya', 
    userEmail: 'ayse@ornek.com', 
    rating: 2, 
    comment: 'Tahlil raporundaki bazı kısaltmalar (ALT, AST) açıklanırken tıbbi terimler biraz ağır kalmış. Daha sade dille yazılabilirdi.', 
    date: '2026-08-03', 
    status: 'UNREAD', 
    category: 'ŞİKAYET / ÖNERİ' 
  }
];

const defaultAdminUsers = [
  { 
    id: 101, 
    name: 'Zeynep Ersal', 
    email: 'hasta@drbio.com', 
    role: 'PATIENT', 
    status: 'ACTIVE', 
    regDate: '2026-08-01',
    healthProfile: {
      age: '26',
      weight: '62',
      height: '168',
      gender: 'Kadın',
      maritalStatus: 'Bekar',
      childrenCount: '0',
      occupation: 'Yazılım Mühendisi',
      genetics: 'Ailede Tip-2 Diyabet öyküsü var',
      surgeries: 'Apendektomi (2020)',
      medications: 'B-Kompleks vitamini',
      allergies: 'Toz ve Penisilin alerjisi',
      chronicPain: 'Migren (Zaman zaman)',
      habits: 'Sigara kullanmıyor, Sosyal alkol (Nadir)'
    }
  },
  { 
    id: 102, 
    name: 'Sistem Yöneticisi', 
    email: 'admin@drbio.com', 
    role: 'ADMIN', 
    status: 'ACTIVE', 
    regDate: '2026-07-15',
    healthProfile: {
      age: '32',
      weight: '78',
      height: '182',
      gender: 'Erkek',
      maritalStatus: 'Evli',
      childrenCount: '1',
      occupation: 'Sistem Mimarı',
      genetics: 'Yok',
      surgeries: 'Yok',
      medications: 'Yok',
      allergies: 'Yok',
      chronicPain: 'Yok',
      habits: 'Kullanmıyor'
    }
  },
  { 
    id: 103, 
    name: 'Ahmet Yılmaz', 
    email: 'ahmet@ornek.com', 
    role: 'PATIENT', 
    status: 'ACTIVE', 
    regDate: '2026-08-03',
    healthProfile: {
      age: '45',
      weight: '84',
      height: '176',
      gender: 'Erkek',
      maritalStatus: 'Evli',
      childrenCount: '2',
      occupation: 'Öğretmen',
      genetics: 'Hipertansiyon (Yüksek tansiyon)',
      surgeries: 'Yok',
      medications: 'Tansiyon düzenleyici (Günlük 1 doz)',
      allergies: 'Polen ve çim alerjisi',
      chronicPain: 'Bel ağrısı',
      habits: 'Sigara kullanmıyor'
    }
  },
  { 
    id: 104, 
    name: 'Ayşe Kaya', 
    email: 'ayse@ornek.com', 
    role: 'PATIENT', 
    status: 'ACTIVE', 
    regDate: '2026-08-04',
    healthProfile: {
      age: '34',
      weight: '58',
      height: '165',
      gender: 'Kadın',
      maritalStatus: 'Evli',
      childrenCount: '1',
      occupation: 'Mimar',
      genetics: 'Tiroid hastalığı öyküsü',
      surgeries: 'Yok',
      medications: 'Levotiron (Tiroid ilacı)',
      allergies: 'Deniz ürünleri alerjisi',
      chronicPain: 'Yok',
      habits: 'Kullanmıyor'
    }
  }
];

const defaultReferences = [
  { id: 1, name: 'Hemoglobin (HGB)', min: '13.5', max: '17.5', unit: 'g/dL', category: 'Kan Sayımı', text: 'Kansızlık (anemi) veya demir eksikliği belirtisi olabilir. Beslenme düzenine dikkat edilmelidir.' },
  { id: 2, name: 'WBC (Lökosit)', min: '4.5', max: '11.0', unit: '10^3/uL', category: 'Kan Sayımı', text: 'Enfeksiyon veya bağışıklık sistemi reaksiyonu göstergesi olabilir.' },
  { id: 3, name: 'Kolesterol (Total)', min: '0', max: '200', unit: 'mg/dL', category: 'Biyokimya', text: 'Yüksek kolesterol damar sağlığı riski oluşturabilir. Diyet ve egzersiz tavsiye edilir.' },
  { id: 4, name: 'Açlık Kan Şekeri (Glukoz)', min: '70', max: '100', unit: 'mg/dL', category: 'Biyokimya', text: 'Şeker metabolizması takibi için kritik değerdir.' },
  { id: 5, name: 'Vitamin D (25-OH)', min: '30', max: '100', unit: 'ng/mL', category: 'Vitamin', text: 'Kemik sağlığı ve bağışıklık için önemlidir. D3 takviyesi gerekebilir.' },
  { id: 6, name: 'ALT (SGPT)', min: '7', max: '56', unit: 'U/L', category: 'Karaciğer', text: 'Karaciğer hücre enzimidir, yüksekliği karaciğer yorgunluğuna işaret edebilir.' }
];

const AdminDashboard = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const currentTab = tab || 'dashboard';

  // State'ler
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('userAccounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((u, index) => {
          const matchDefault = defaultAdminUsers.find(d => d.email.trim().toLowerCase() === u.email.trim().toLowerCase());
          return {
            id: index + 200,
            name: u.name || u.email.split('@')[0],
            email: u.email,
            role: u.role || 'PATIENT',
            status: 'ACTIVE',
            regDate: u.regDate || '2026-08-05',
            healthProfile: u.healthProfile || (matchDefault ? matchDefault.healthProfile : {
              age: '29', weight: '70', height: '172', gender: 'Belirtilmedi', maritalStatus: 'Belirtilmedi',
              childrenCount: '0', occupation: 'Belirtilmedi', genetics: 'Yok', surgeries: 'Yok',
              medications: 'Yok', allergies: 'Yok', chronicPain: 'Yok', habits: 'Kullanmıyor'
            })
          };
        });
      } catch (e) {}
    }
    return defaultAdminUsers;
  });

  const [references, setReferences] = useState(() => {
    const saved = localStorage.getItem('adminReferences');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return defaultReferences;
  });

  // Arama & Filtre
  const [refSearch, setRefSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Parametre Ekleme/Düzenleme Modal State
  const [refModalOpen, setRefModalOpen] = useState(false);
  const [editingRef, setEditingRef] = useState(null);
  const [refFormData, setRefFormData] = useState({
    name: '', min: '', max: '', unit: '', category: 'Biyokimya', text: ''
  });

  // Kullanıcı Ekleme Modal State
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [newUserFormData, setNewUserFormData] = useState({
    name: '', email: '', password: '123', role: 'PATIENT'
  });

  // Kullanıcı Tüm Detay Modalı State
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);

  const saveReferences = (newList) => {
    setReferences(newList);
    localStorage.setItem('adminReferences', JSON.stringify(newList));
  };

  const handleDeleteRef = (id) => {
    const newList = references.filter(r => r.id !== id);
    saveReferences(newList);
  };

  const handleOpenRefModal = (refObj = null) => {
    if (refObj) {
      setEditingRef(refObj);
      setRefFormData({ ...refObj });
    } else {
      setEditingRef(null);
      setRefFormData({ name: '', min: '', max: '', unit: '', category: 'Biyokimya', text: '' });
    }
    setRefModalOpen(true);
  };

  const handleSaveRefSubmit = (e) => {
    e.preventDefault();
    if (editingRef) {
      const newList = references.map(r => r.id === editingRef.id ? { ...r, ...refFormData } : r);
      saveReferences(newList);
    } else {
      const newObj = { id: Date.now(), ...refFormData };
      saveReferences([newObj, ...references]);
    }
    setRefModalOpen(false);
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: Date.now(),
      name: newUserFormData.name,
      email: newUserFormData.email,
      role: newUserFormData.role,
      status: 'ACTIVE',
      regDate: new Date().toISOString().split('T')[0],
      healthProfile: {
        age: '30', weight: '70', height: '175', gender: 'Belirtilmedi', maritalStatus: 'Belirtilmedi',
        childrenCount: '0', occupation: 'Belirtilmedi', genetics: 'Yok', surgeries: 'Yok',
        medications: 'Yok', allergies: 'Yok', chronicPain: 'Yok', habits: 'Kullanmıyor'
      }
    };
    const updated = [newUser, ...usersList];
    setUsersList(updated);

    // localStorage ekle
    const storedUsers = localStorage.getItem('userAccounts');
    let accounts = [];
    if (storedUsers) { try { accounts = JSON.parse(storedUsers) || []; } catch(e) {} }
    accounts.push({
      name: newUserFormData.name,
      email: newUserFormData.email,
      password: newUserFormData.password,
      role: newUserFormData.role,
      healthProfile: newUser.healthProfile
    });
    localStorage.setItem('userAccounts', JSON.stringify(accounts));

    setUserModalOpen(false);
  };

  const toggleUserStatus = (id) => {
    setUsersList(usersList.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'PASSIVE' : 'ACTIVE' } : u));
  };

  // Geri Bildirimler State'leri
  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem('drbio_feedbacks');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return defaultFeedbacks;
  });

  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [starFilter, setStarFilter] = useState('ALL');
  const [acknowledgedIds, setAcknowledgedIds] = useState(() => {
    const saved = localStorage.getItem('drbio_acknowledged_ids');
    if (saved) { try { const p = JSON.parse(saved); if (Array.isArray(p)) return p; } catch(e) {} }
    return [];
  });
  const [ackToast, setAckToast] = useState('');

  const safeFeedbacks = Array.isArray(feedbacks) ? feedbacks : [];

  const handleDeleteFeedback = (id) => {
    const newList = safeFeedbacks.filter(f => f.id !== id);
    setFeedbacks(newList);
    localStorage.setItem('drbio_feedbacks', JSON.stringify(newList));
  };

  const toggleFeedbackStatus = (id) => {
    const target = safeFeedbacks.find(f => f.id === id);
    const newStatus = (target?.status === 'UNREAD') ? 'REVIEWED' : 'UNREAD';
    const newList = safeFeedbacks.map(f => f.id === id ? { ...f, status: newStatus } : f);
    setFeedbacks(newList);
    localStorage.setItem('drbio_feedbacks', JSON.stringify(newList));

    if (newStatus === 'REVIEWED' && target) {
      // Hastaya otomatik bilgilendirme bildirimi gönder
      const userEmail = (target.userEmail || '').toLowerCase();
      const notifKey = `drbio_notif_${userEmail}`;
      let patientNotifs = [];
      const pSaved = localStorage.getItem(notifKey);
      if (pSaved) { try { const p = JSON.parse(pSaved); if (Array.isArray(p)) patientNotifs = p; } catch(e) {} }
      const patientNotif = {
        id: Date.now(),
        title: 'Geri Bildiriminiz İncelendi ✅',
        text: 'Yönetim ekibimiz geri bildiriminizi inceledi. Değerli görüşleriniz için teşekkür ederiz.',
        time: 'Az önce',
        unread: true,
        type: 'SYSTEM'
      };
      localStorage.setItem(notifKey, JSON.stringify([patientNotif, ...patientNotifs]));
      // Genel bildirim key'ini de güncelle
      let generalNotifs = [];
      const gSaved = localStorage.getItem('userNotifications');
      if (gSaved) { try { const p = JSON.parse(gSaved); if (Array.isArray(p)) generalNotifs = p; } catch(e) {} }
      localStorage.setItem('userNotifications', JSON.stringify([patientNotif, ...generalNotifs]));

      // Admin bell'ine de onay bildirimi ekle
      const adminNotifKey = 'admin_notifications';
      let adminNotifs = [];
      const aSaved = localStorage.getItem(adminNotifKey);
      if (aSaved) { try { const p = JSON.parse(aSaved); if (Array.isArray(p)) adminNotifs = p; } catch(e) {} }
      const adminConfirmNotif = {
        id: Date.now() + 2,
        title: 'Geri Bildirim İncelendi 🗂',
        text: `${target.userName} adlı hastanın ${target.rating}/5 yıldızlı geri bildirimi incelendi olarak işaretlendi. Hasta bilgilendirmesi gönderildi.`,
        time: 'Az önce',
        unread: false,
        type: 'SYSTEM'
      };
      localStorage.setItem(adminNotifKey, JSON.stringify([adminConfirmNotif, ...adminNotifs]));

      // acknowledgedIds güncelle
      setAcknowledgedIds(prev => {
        const updated = [...prev, id];
        localStorage.setItem('drbio_acknowledged_ids', JSON.stringify(updated));
        return updated;
      });

      setAckToast(`"${target.userName}" incelendi olarak işaretlendi ve hastaya bildirim gönderildi.`);
      setTimeout(() => setAckToast(''), 4000);
    }
  };


  // Mesaj şablon listesi
  const MESSAGE_TEMPLATES = [
    { id: 'received',      emoji: '📬', label: 'Alındı Onayı',            title: 'Geri Bildiriminiz Alındı',          text: '📬 Geri bildiriminiz ekibimize ulaştı. Kısa süre içinde konuyla ilgili tarafınıza bilgi verilecektir. Değerli görüşleriniz için teşekkür ederiz.' },
    { id: 'investigating', emoji: '🔍', label: 'İnceleniyor',             title: 'Şikayetiniz İnceleniyor',           text: '🔍 Şikayetinizi aldık ve ekibimiz konuyu aktif olarak inceliyor. En kısa sürede size dönüş yapılacaktır. Sabrınız için teşekkür ederiz.' },
    { id: 'resolved',      emoji: '✅', label: 'Çözüme Kavuştu',          title: 'Sorununuz Çözüldü',                 text: '✅ Bildirdiğiniz konu incelendi ve gerekli düzenlemeler yapıldı. Hizmetimizi daha iyi hale getirmemize katkı sağladığınız için teşekkür ederiz.' },
    { id: 'will_contact',  emoji: '📞', label: 'İletişime Geçilecek',     title: 'Yakında Sizi Arayacağız',           text: '📞 Geri bildiriminizi değerlendirdik. Ekibimiz en kısa sürede sizinle iletişime geçecektir. Anlayışınız için teşekkür ederiz.' },
    { id: 'thankyou',      emoji: '🙏', label: 'Teşekkür',                title: 'Görüşleriniz İçin Teşekkürler',     text: '🙏 Değerli geri bildiriminiz için teşekkür ederiz. Görüşleriniz hizmet kalitemizi artırmamıza büyük katkı sağlamaktadır.' },
    { id: 'apology',       emoji: '🤝', label: 'Özür & Anlayış',          title: 'Yaşattığımız Sorunu Özür Dileriz',  text: '🤝 Yaşadığınız olumsuz deneyim için özür dileriz. Sorununuzu en kısa sürede çözmek için çalışıyoruz. Anlayışınız için teşekkür ederiz.' },
  ];

  const [ackModalTarget, setAckModalTarget] = useState(null);
  const [ackSelectedTemplate, setAckSelectedTemplate] = useState(null);
  const [ackCustomNote, setAckCustomNote] = useState('');

  const openAckModal = (item) => {
    setAckModalTarget(item);
    setAckSelectedTemplate(null);
    setAckCustomNote('');
  };

  const handleSendAcknowledgement = (item, templateId, customNote) => {
    const template = MESSAGE_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;
    const finalText = customNote.trim()
      ? `${template.text}\n\n💬 Ek Not: ${customNote.trim()}`
      : template.text;

    const userEmail = (item.userEmail || '').toLowerCase();
    const notifKey = `drbio_notif_${userEmail}`;
    let notifs = [];
    const saved = localStorage.getItem(notifKey);
    if (saved) { try { const p = JSON.parse(saved); if (Array.isArray(p)) notifs = p; } catch(e) {} }
    const newNotif = { id: Date.now(), title: `${template.emoji} ${template.title}`, text: finalText, time: 'Az önce', unread: true, type: 'SYSTEM' };
    localStorage.setItem(notifKey, JSON.stringify([newNotif, ...notifs]));

    const generalKey = 'userNotifications';
    let generalNotifs = [];
    const generalSaved = localStorage.getItem(generalKey);
    if (generalSaved) { try { const p = JSON.parse(generalSaved); if (Array.isArray(p)) generalNotifs = p; } catch(e) {} }
    localStorage.setItem(generalKey, JSON.stringify([newNotif, ...generalNotifs]));

    const newList = safeFeedbacks.map(f => f.id === item.id ? { ...f, status: 'REVIEWED' } : f);
    setFeedbacks(newList);
    localStorage.setItem('drbio_feedbacks', JSON.stringify(newList));

    const newAcked = [...acknowledgedIds, item.id];
    setAcknowledgedIds(newAcked);
    localStorage.setItem('drbio_acknowledged_ids', JSON.stringify(newAcked));

    setAckModalTarget(null);
    setAckToast(`"${item.userName}" adlı hastaya "${template.label}" mesajı gönderildi!`);
    setTimeout(() => setAckToast(''), 4000);
  };

  // Filtrelenmiş geri bildirimler
  const filteredFeedbacks = safeFeedbacks.filter(f => {
    if (!f) return false;
    const searchLower = (feedbackSearch || '').toLowerCase();
    const matchesSearch = (f.userName || '').toLowerCase().includes(searchLower) ||
                          (f.userEmail || '').toLowerCase().includes(searchLower) ||
                          (f.comment || '').toLowerCase().includes(searchLower);
    
    let matchesStar = true;
    if (starFilter === '5') matchesStar = f.rating === 5;
    else if (starFilter === '4') matchesStar = f.rating === 4;
    else if (starFilter === '3_BELOW') matchesStar = (f.rating || 0) <= 3;

    return matchesSearch && matchesStar;
  });

  // Metrik hesaplamaları
  const avgRating = safeFeedbacks.length > 0 
    ? (safeFeedbacks.reduce((acc, curr) => acc + ((curr && curr.rating) || 5), 0) / safeFeedbacks.length).toFixed(1)
    : '5.0';
  const satisfiedCount = safeFeedbacks.filter(f => f && (f.rating || 0) >= 4).length;
  const complaintCount = safeFeedbacks.filter(f => f && (f.rating || 0) <= 3).length;

  // Filtrelenmiş referanslar
  const filteredReferences = references.filter(r => 
    r.name.toLowerCase().includes(refSearch.toLowerCase()) || 
    r.category.toLowerCase().includes(refSearch.toLowerCase())
  );

  // Filtrelenmiş kullanıcılar
  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <Layout title="Yönetici Paneli" role="ADMIN">
      
      {/* Üst Sekme Navigasyonu */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-stone-200 dark:border-stone-800 pb-4">
        <button 
          onClick={() => navigate('/admin')}
          className={`px-5 py-3 rounded-2xl font-black text-sm transition-all flex items-center space-x-2 ${
            currentTab === 'dashboard' || currentTab === 'admin'
              ? 'bg-red-600 text-white shadow-clay-btn' 
              : 'bg-theme-card text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 shadow-sm'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Genel Bakış</span>
        </button>

        <button 
          onClick={() => navigate('/admin/references')}
          className={`px-5 py-3 rounded-2xl font-black text-sm transition-all flex items-center space-x-2 ${
            currentTab === 'references' 
              ? 'bg-red-600 text-white shadow-clay-btn' 
              : 'bg-theme-card text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 shadow-sm'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Referans Kütüphanesi ({references.length})</span>
        </button>

        <button 
          onClick={() => navigate('/admin/users')}
          className={`px-5 py-3 rounded-2xl font-black text-sm transition-all flex items-center space-x-2 ${
            currentTab === 'users' 
              ? 'bg-red-600 text-white shadow-clay-btn' 
              : 'bg-theme-card text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 shadow-sm'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kullanıcı Yönetimi ({usersList.length})</span>
        </button>

        <button 
          onClick={() => navigate('/admin/feedbacks')}
          className={`px-5 py-3 rounded-2xl font-black text-sm transition-all flex items-center space-x-2 ${
            currentTab === 'feedbacks' 
              ? 'bg-red-600 text-white shadow-clay-btn' 
              : 'bg-theme-card text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 shadow-sm'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Geri Bildirimler ({feedbacks.length})</span>
        </button>
      </div>

      {/* --- 1. GENEL BAKIŞ (DASHBOARD) TABI --- */}
      {(currentTab === 'dashboard' || currentTab === 'admin') && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Admin Banner */}
          <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-red-950 rounded-[2.5rem] p-8 text-white shadow-clay-card dark:shadow-clay-card-dark relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
              <Shield className="w-80 h-80 text-white" />
            </div>

            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center space-x-2 bg-red-600/30 border border-red-500/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-red-300">
                <Shield className="w-4 h-4 text-red-500" />
                <span>Dr. Bio Sistem Yönetim Merkezi</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black">Yönetici Kontrol Paneli</h1>
              <p className="text-stone-300 font-medium max-w-xl text-sm leading-relaxed">
                Tıbbi referans parametrelerini yönetebilir, kayıtlı hasta hesaplarını inceleyebilir ve kullanıcıların detaylı sağlık profillerini görüntüleyebilirsiniz.
              </p>
            </div>
          </div>

          {/* İstatistik Metrik Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-theme-card p-6 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center space-x-4">
              <div className="w-14 h-14 bg-red-50 dark:bg-red-950/40 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Kayıtlı Kullanıcı</span>
                <span className="text-2xl font-black text-stone-800 dark:text-stone-200">{usersList.length}</span>
              </div>
            </div>

            <div className="bg-theme-card p-6 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center space-x-4">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                <Database className="w-7 h-7" />
              </div>
              <div>
                <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Referans Parametre</span>
                <span className="text-2xl font-black text-stone-800 dark:text-stone-200">{references.length}</span>
              </div>
            </div>

            <div className="bg-theme-card p-6 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center space-x-4">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                <Server className="w-7 h-7" />
              </div>
              <div>
                <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">AI Motor Durumu</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">Aktif & Stabil</span>
              </div>
            </div>

            <div className="bg-theme-card p-6 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center space-x-4">
              <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/40 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Bu Ayki Analiz</span>
                <span className="text-2xl font-black text-stone-800 dark:text-stone-200">128</span>
              </div>
            </div>
          </div>

          {/* Hızlı İşlem & Son Aktivite Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Hızlı Eylemler */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-stone-800 dark:text-stone-200 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-red-600" />
                <span>Hızlı Yönetim İşlemleri</span>
              </h2>

              <div className="bg-theme-card rounded-[2rem] p-6 shadow-clay-card dark:shadow-clay-card-dark border-theme-border space-y-3">
                <button
                  onClick={() => handleOpenRefModal()}
                  className="w-full p-4 bg-theme-bg hover:bg-stone-200 dark:hover:bg-stone-800 rounded-2xl font-bold text-stone-700 dark:text-stone-200 text-xs flex items-center justify-between border border-stone-200 dark:border-stone-800 transition"
                >
                  <div className="flex items-center space-x-3">
                    <Plus className="w-4 h-4 text-red-600" />
                    <span>Yeni Referans Parametresi Ekle</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => setUserModalOpen(true)}
                  className="w-full p-4 bg-theme-bg hover:bg-stone-200 dark:hover:bg-stone-800 rounded-2xl font-bold text-stone-700 dark:text-stone-200 text-xs flex items-center justify-between border border-stone-200 dark:border-stone-800 transition"
                >
                  <div className="flex items-center space-x-3">
                    <UserPlus className="w-4 h-4 text-blue-600" />
                    <span>Yeni Kullanıcı Ekle</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => navigate('/admin/references')}
                  className="w-full p-4 bg-theme-bg hover:bg-stone-200 dark:hover:bg-stone-800 rounded-2xl font-bold text-stone-700 dark:text-stone-200 text-xs flex items-center justify-between border border-stone-200 dark:border-stone-800 transition"
                >
                  <div className="flex items-center space-x-3">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span>Tüm Referans Kütüphanesini Yönet</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              </div>
            </div>

            {/* Sistem Logları & Son Hesaplar */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-black text-stone-800 dark:text-stone-200 flex items-center space-x-2">
                <Users className="w-5 h-5 text-red-600" />
                <span>Son Kaydolan Kullanıcılar</span>
              </h2>

              <div className="bg-theme-card rounded-[2rem] p-6 shadow-clay-card dark:shadow-clay-card-dark border-theme-border space-y-3">
                {usersList.slice(0, 4).map((u) => (
                  <div key={u.id} className="p-4 bg-theme-bg rounded-2xl border border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-50 dark:bg-red-950/40 rounded-xl flex items-center justify-center text-red-600 font-black text-sm">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-stone-800 dark:text-stone-200 text-sm">{u.name}</p>
                        <p className="text-xs text-stone-400 font-bold">{u.email}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedUserDetail(u)}
                      className="px-3.5 py-2 bg-theme-card hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-red-600" />
                      <span>Detay İncele</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* --- 2. REFERANS KÜTÜPHANESİ TABI --- */}
      {currentTab === 'references' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-stone-800 dark:text-stone-200">Referans Kütüphanesi</h2>
              <p className="text-xs font-bold text-stone-400 mt-1">Tahlil parametrelerinin alt/üst sınırları ve otomatik yapay zeka öneri metinleri</p>
            </div>

            <button
              onClick={() => handleOpenRefModal()}
              className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-2xl shadow-clay-btn transition flex items-center space-x-2 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Parametre Ekle</span>
            </button>
          </div>

          {/* Arama Çubuğu */}
          <div className="bg-theme-card p-4 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Parametre adı veya kategori ara (Örn. Hemoglobin, Biyokimya)..."
                value={refSearch}
                onChange={(e) => setRefSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl text-xs font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-red-600/20"
              />
            </div>
          </div>

          {/* Referans Kartları Listesi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReferences.map((ref) => (
              <div 
                key={ref.id}
                className="bg-theme-card p-6 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex flex-col justify-between space-y-4 relative group"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-3 py-1 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                      {ref.category || 'Tahlil'}
                    </span>
                    
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handleOpenRefModal(ref)}
                        className="p-2 bg-theme-bg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl transition"
                        title="Düzenle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteRef(ref.id)}
                        className="p-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 rounded-xl transition"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-stone-800 dark:text-stone-200 mb-1">{ref.name}</h3>

                  <div className="inline-flex items-center space-x-2 bg-theme-bg px-3 py-1.5 rounded-xl border border-stone-100 dark:border-stone-800 text-xs font-black text-stone-700 dark:text-stone-300 my-2">
                    <span>Referans:</span>
                    <span className="text-red-600 dark:text-red-400">{ref.min} - {ref.max} {ref.unit}</span>
                  </div>

                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 leading-relaxed mt-2 bg-theme-bg p-3 rounded-2xl">
                    <span className="font-black text-stone-700 dark:text-stone-300 block mb-0.5">Otomatik AI Önerisi:</span>
                    {ref.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- 3. KULLANICI YÖNETİMİ TABI --- */}
      {currentTab === 'users' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-stone-800 dark:text-stone-200">Kullanıcı Yönetimi</h2>
              <p className="text-xs font-bold text-stone-400 mt-1">Sistemdeki tüm hasta ve yönetici hesaplarının kontrolü ve detaylı profil incelemesi</p>
            </div>

            <button
              onClick={() => setUserModalOpen(true)}
              className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-2xl shadow-clay-btn transition flex items-center space-x-2 self-start md:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>Yeni Kullanıcı Ekle</span>
            </button>
          </div>

          {/* Arama Çubuğu */}
          <div className="bg-theme-card p-4 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="İsim veya e-posta adresi ile kullanıcı ara..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl text-xs font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-red-600/20"
              />
            </div>
          </div>

          {/* Kullanıcı Listesi */}
          <div className="bg-theme-card rounded-[2.5rem] p-6 shadow-clay-card dark:shadow-clay-card-dark border-theme-border space-y-3">
            {filteredUsers.map((u) => (
              <div 
                key={u.id}
                className="p-4 bg-theme-bg rounded-2xl border border-stone-100 dark:border-stone-800/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-stone-300 transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-stone-800 dark:text-stone-200 text-sm">{u.name}</h4>
                    <p className="text-xs font-bold text-stone-400">{u.email}</p>
                    <span className="text-[10px] text-stone-400 font-semibold block mt-0.5">Kayıt: {u.regDate}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    u.role === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                  }`}>
                    {u.role === 'ADMIN' ? 'Yönetici' : 'Hasta'}
                  </span>

                  <button
                    onClick={() => toggleUserStatus(u.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center space-x-1 ${
                      u.status === 'ACTIVE' 
                        ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' 
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{u.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedUserDetail(u)}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-black transition flex items-center space-x-1 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Tüm Bilgileri Gör</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* --- 4. GERİ BİLDİRİMLER VE ŞİKAYETLER TABI --- */}
      {currentTab === 'feedbacks' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-stone-800 dark:text-stone-200">Geri Bildirimler ve Şikayetler</h2>
              <p className="text-xs font-bold text-stone-400 mt-1">Hastaların tahlil yükleme ve analiz hizmeti için verdikleri 5 yıldızlı puanlar ve yorumlar</p>
            </div>
          </div>

          {/* İstatistik Metrik Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-theme-card p-6 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center space-x-4">
              <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/40 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                <Star className="w-7 h-7 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Ortalama Puan</span>
                <span className="text-2xl font-black text-stone-800 dark:text-stone-200">{avgRating} / 5.0</span>
              </div>
            </div>

            <div className="bg-theme-card p-6 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center space-x-4">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                <MessageSquare className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Toplam Bildirim</span>
                <span className="text-2xl font-black text-stone-800 dark:text-stone-200">{feedbacks.length}</span>
              </div>
            </div>

            <div className="bg-theme-card p-6 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center space-x-4">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Memnun Hastalar</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{satisfiedCount} Hasta</span>
              </div>
            </div>

            <div className="bg-theme-card p-6 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center space-x-4">
              <div className="w-14 h-14 bg-red-50 dark:bg-red-950/40 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <div>
                <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Şikayet / Öneri</span>
                <span className="text-2xl font-black text-red-600 dark:text-red-400">{complaintCount} Kayıt</span>
              </div>
            </div>
          </div>

          {/* Arama ve Yıldız Filtresi */}
          <div className="bg-theme-card p-4 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Hasta adı, e-posta veya yorum ara..."
                value={feedbackSearch}
                onChange={(e) => setFeedbackSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl text-xs font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-red-600/20"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-stone-400 shrink-0" />
              <span className="text-xs font-bold text-stone-400">Yıldız Filtresi:</span>
              <select
                value={starFilter}
                onChange={(e) => setStarFilter(e.target.value)}
                className="px-3 py-2 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-200 focus:outline-none"
              >
                <option value="ALL">Tümü ({feedbacks.length})</option>
                <option value="5">5 Yıldız (Harika)</option>
                <option value="4">4 Yıldız (Çok İyi)</option>
                <option value="3_BELOW">1-3 Yıldız (Şikayet / Öneri)</option>
              </select>
            </div>
          </div>

          {/* Geri Bildirim Kartları */}
          {filteredFeedbacks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredFeedbacks.map((item) => (
                <div 
                  key={item.id}
                  className="bg-theme-card p-6 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex flex-col space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-sm">
                        {(item.userName || 'H').charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-stone-800 dark:text-stone-200 text-sm">{item.userName}</h4>
                        <p className="text-xs font-bold text-stone-400">{item.userEmail} • Tarih: {item.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Yıldız Gösterimi */}
                      <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-900/40">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= item.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-stone-300 dark:text-stone-700'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-black text-amber-700 dark:text-amber-300 ml-1">
                          {item.rating}.0
                        </span>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.status === 'REVIEWED' 
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' 
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                      }`}>
                        {item.status === 'REVIEWED' ? 'İncelendi' : 'Yeni Bildirim'}
                      </span>
                    </div>
                  </div>

                  {/* Yorum / Şikayet Metni */}
                  <div className="bg-theme-bg p-4 rounded-2xl border border-stone-100 dark:border-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 leading-relaxed">
                    <p className="font-black text-stone-400 text-[10px] uppercase mb-1">Hasta Görüşü / Şikayeti:</p>
                    <p>"{item.comment}"</p>
                  </div>

                  {/* Alt İşlem Butonları */}
                  <div className="flex flex-wrap justify-end gap-2 pt-1">

                    {/* Bildirim Gönder Butonu - Şikayet/öneri olan kartlarda vurgulu */}
                    {acknowledgedIds.includes(item.id) ? (
                      <span className="px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Bildirim Gönderildi</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendAcknowledgement(item)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm ${
                          (item.rating || 5) <= 3
                            ? 'bg-amber-500 hover:bg-amber-600 text-stone-950 animate-pulse'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                        title={`${item.userName} adlı hastaya şikayeti aldığınıza dair bildirim gönder`}
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Hastayı Bilgilendir</span>
                      </button>
                    )}

                    <button
                      onClick={() => toggleFeedbackStatus(item.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                        item.status === 'REVIEWED'
                          ? 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{item.status === 'REVIEWED' ? 'Yeni Olarak İşaretle' : 'İncelendi İşaretle'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteFeedback(item.id)}
                      className="px-3 py-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Sil</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-theme-card rounded-[2.5rem] p-12 text-center border-theme-border shadow-clay-card dark:shadow-clay-card-dark space-y-4">
              <div className="w-20 h-20 bg-theme-bg rounded-3xl mx-auto flex items-center justify-center text-stone-400 border border-stone-200 dark:border-stone-800">
                <MessageSquare className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-stone-800 dark:text-stone-200">
                  {feedbackSearch || starFilter !== 'ALL' ? 'Filtreleme ile Eşleşen Geri Bildirim Bulunamadı' : 'Henüz Geri Bildirim Yapılmadı'}
                </h3>
                <p className="text-xs font-bold text-stone-400 mt-1 max-w-sm mx-auto">
                  Hastaların gönderdikleri puanlama ve yorumlar burada listelenecektir.
                </p>
              </div>
            </div>
          )}

        </div>
      )}

      {/* --- ACK TOAST BİLDİRİMİ --- */}
      {ackToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-fade-in">
          <div className="flex items-center space-x-3 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm max-w-sm">
            <Send className="w-5 h-5 shrink-0" />
            <span>{ackToast}</span>
          </div>
        </div>
      )}

      {/* --- KULLANICI TÜM BİLGİLERİ VE SAĞLIK PROFİLİ DETAY MODALI --- */}
      {selectedUserDetail && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-theme-card w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl border-theme-border space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Başlık */}
            <div className="flex justify-between items-start border-b border-stone-200 dark:border-stone-800 pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-clay-btn">
                  {selectedUserDetail.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-stone-800 dark:text-stone-200">{selectedUserDetail.name}</h3>
                  <p className="text-xs font-bold text-stone-400">{selectedUserDetail.email}</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedUserDetail(null)} 
                className="p-2 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 1. Temel Hesap ve Kimlik Bilgileri */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-red-600" />
                <span>Hesap ve İletişim Bilgileri</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-theme-bg p-3.5 rounded-2xl border border-stone-100 dark:border-stone-800">
                  <span className="block text-[10px] font-black text-stone-400 uppercase">Kullanıcı Rolü</span>
                  <span className="text-sm font-black text-stone-800 dark:text-stone-200">
                    {selectedUserDetail.role === 'ADMIN' ? 'Yönetici' : 'Hasta'}
                  </span>
                </div>
                <div className="bg-theme-bg p-3.5 rounded-2xl border border-stone-100 dark:border-stone-800">
                  <span className="block text-[10px] font-black text-stone-400 uppercase">Kayıt Tarihi</span>
                  <span className="text-sm font-black text-stone-800 dark:text-stone-200">{selectedUserDetail.regDate}</span>
                </div>
                <div className="bg-theme-bg p-3.5 rounded-2xl border border-stone-100 dark:border-stone-800">
                  <span className="block text-[10px] font-black text-stone-400 uppercase">Hesap Durumu</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{selectedUserDetail.status}</span>
                </div>
                <div className="bg-theme-bg p-3.5 rounded-2xl border border-stone-100 dark:border-stone-800">
                  <span className="block text-[10px] font-black text-stone-400 uppercase">Kimlik Doğrulama</span>
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400">E-Posta Doğrulanmış</span>
                </div>
              </div>
            </div>

            {/* 2. Fiziksel Bilgiler ve Vücut Kitle İndeksi */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center space-x-2">
                <Scale className="w-4 h-4 text-red-600" />
                <span>Fiziksel Özellikler & Ölçümler</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-theme-bg p-3.5 rounded-2xl border border-stone-100 dark:border-stone-800">
                  <span className="block text-[10px] font-black text-stone-400 uppercase">Yaş</span>
                  <span className="text-base font-black text-stone-800 dark:text-stone-200">{selectedUserDetail.healthProfile?.age || '28'} Yaş</span>
                </div>
                <div className="bg-theme-bg p-3.5 rounded-2xl border border-stone-100 dark:border-stone-800">
                  <span className="block text-[10px] font-black text-stone-400 uppercase">Boy</span>
                  <span className="text-base font-black text-stone-800 dark:text-stone-200">{selectedUserDetail.healthProfile?.height || '175'} cm</span>
                </div>
                <div className="bg-theme-bg p-3.5 rounded-2xl border border-stone-100 dark:border-stone-800">
                  <span className="block text-[10px] font-black text-stone-400 uppercase">Kilo</span>
                  <span className="text-base font-black text-stone-800 dark:text-stone-200">{selectedUserDetail.healthProfile?.weight || '68'} kg</span>
                </div>
                <div className="bg-theme-bg p-3.5 rounded-2xl border border-stone-100 dark:border-stone-800">
                  <span className="block text-[10px] font-black text-stone-400 uppercase">VKİ (İndeks)</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {(() => {
                      const h = parseFloat(selectedUserDetail.healthProfile?.height || 175) / 100;
                      const w = parseFloat(selectedUserDetail.healthProfile?.weight || 68);
                      const bmi = (w / (h * h)).toFixed(1);
                      return `${bmi} (Normal)`;
                    })()}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Anamnez & Tıbbi Geçmiş Bilgileri */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-red-600" />
                <span>Detaylı Anamnez & Tıbbi Geçmiş Formu</span>
              </h4>

              <div className="bg-theme-bg p-5 rounded-2xl border border-stone-100 dark:border-stone-800 space-y-3.5 text-xs font-bold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-black">Cinsiyet:</span>
                    <span className="text-stone-800 dark:text-stone-200">{selectedUserDetail.healthProfile?.gender || 'Kadın'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-black">Medeni Durum / Çocuk:</span>
                    <span className="text-stone-800 dark:text-stone-200">
                      {selectedUserDetail.healthProfile?.maritalStatus || 'Bekar'} ({selectedUserDetail.healthProfile?.childrenCount || '0'} Çocuk)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-black">Meslek:</span>
                    <span className="text-stone-800 dark:text-stone-200">{selectedUserDetail.healthProfile?.occupation || 'Belirtilmedi'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-black">Genetik / Ailevi Hastalıklar:</span>
                    <span className="text-stone-800 dark:text-stone-200">{selectedUserDetail.healthProfile?.genetics || 'Yok'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-black">Geçirilmiş Operasyonlar:</span>
                    <span className="text-stone-800 dark:text-stone-200">{selectedUserDetail.healthProfile?.surgeries || 'Yok'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-black">Sürekli Kullanılan İlaçlar:</span>
                    <span className="text-stone-800 dark:text-stone-200">{selectedUserDetail.healthProfile?.medications || 'Yok'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
                  <div>
                    <span className="text-red-500 block text-[10px] uppercase font-black">Alerjiler:</span>
                    <span className="text-red-700 dark:text-red-400 font-black">{selectedUserDetail.healthProfile?.allergies || 'Yok'}</span>
                  </div>
                  <div>
                    <span className="text-amber-500 block text-[10px] uppercase font-black">Kronik Ağrı / Şikayet:</span>
                    <span className="text-amber-700 dark:text-amber-400 font-black">{selectedUserDetail.healthProfile?.chronicPain || 'Yok'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-black">Alkol ve Sigara Kullanımı:</span>
                  <span className="text-stone-800 dark:text-stone-200">{selectedUserDetail.healthProfile?.habits || 'Kullanmıyor'}</span>
                </div>
              </div>
            </div>

            {/* Modal Kapat Butonu */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="px-6 py-3.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-black rounded-2xl text-xs shadow-clay-btn transition"
              >
                Pencereyi Kapat
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- REFERANS EKLE / DÜZENLE MODAL --- */}
      {refModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-theme-card w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border-theme-border space-y-5">
            <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-4">
              <h3 className="text-xl font-black text-stone-800 dark:text-stone-200">
                {editingRef ? 'Parametreyi Düzenle' : 'Yeni Referans Parametresi Ekle'}
              </h3>
              <button onClick={() => setRefModalOpen(false)} className="p-2 text-stone-400 hover:text-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRefSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1.5 ml-1">Parametre Adı</label>
                <input
                  type="text" required
                  placeholder="Örn. Hemoglobin (HGB)"
                  value={refFormData.name}
                  onChange={(e) => setRefFormData({ ...refFormData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-xs text-stone-700 dark:text-stone-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1.5 ml-1">Min Ref</label>
                  <input
                    type="text" required
                    placeholder="13.5"
                    value={refFormData.min}
                    onChange={(e) => setRefFormData({ ...refFormData, min: e.target.value })}
                    className="w-full px-3 py-3 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-xs text-stone-700 dark:text-stone-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1.5 ml-1">Max Ref</label>
                  <input
                    type="text" required
                    placeholder="17.5"
                    value={refFormData.max}
                    onChange={(e) => setRefFormData({ ...refFormData, max: e.target.value })}
                    className="w-full px-3 py-3 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-xs text-stone-700 dark:text-stone-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1.5 ml-1">Birim</label>
                  <input
                    type="text" required
                    placeholder="g/dL"
                    value={refFormData.unit}
                    onChange={(e) => setRefFormData({ ...refFormData, unit: e.target.value })}
                    className="w-full px-3 py-3 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-xs text-stone-700 dark:text-stone-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1.5 ml-1">Kategori</label>
                <select
                  value={refFormData.category}
                  onChange={(e) => setRefFormData({ ...refFormData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-xs text-stone-700 dark:text-stone-200 focus:outline-none"
                >
                  <option value="Kan Sayımı">Kan Sayımı</option>
                  <option value="Biyokimya">Biyokimya</option>
                  <option value="Vitamin">Vitamin & Mineral</option>
                  <option value="Karaciğer">Karaciğer</option>
                  <option value="Hormon">Hormon</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1.5 ml-1">Otomatik AI Öneri Metni</label>
                <textarea
                  required rows="3"
                  placeholder="Parametre anormal çıktığında hastaya sunulacak öneri metni..."
                  value={refFormData.text}
                  onChange={(e) => setRefFormData({ ...refFormData, text: e.target.value })}
                  className="w-full px-4 py-3 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-xs text-stone-700 dark:text-stone-200 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl text-xs shadow-clay-btn transition"
                >
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => setRefModalOpen(false)}
                  className="px-5 py-3.5 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold rounded-2xl text-xs transition"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- KULLANICI EKLE MODAL --- */}
      {userModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-theme-card w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border-theme-border space-y-5">
            <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-4">
              <h3 className="text-xl font-black text-stone-800 dark:text-stone-200">Yeni Kullanıcı Oluştur</h3>
              <button onClick={() => setUserModalOpen(false)} className="p-2 text-stone-400 hover:text-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1.5 ml-1">Ad Soyad</label>
                <input
                  type="text" required
                  placeholder="Ahmet Yılmaz"
                  value={newUserFormData.name}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-xs text-stone-700 dark:text-stone-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1.5 ml-1">E-posta Adresi</label>
                <input
                  type="email" required
                  placeholder="ahmet@ornek.com"
                  value={newUserFormData.email}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-xs text-stone-700 dark:text-stone-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1.5 ml-1">Şifre</label>
                <input
                  type="password" required
                  placeholder="••••••••"
                  value={newUserFormData.password}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-xs text-stone-700 dark:text-stone-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1.5 ml-1">Rol</label>
                <select
                  value={newUserFormData.role}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, role: e.target.value })}
                  className="w-full px-4 py-3 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-xs text-stone-700 dark:text-stone-200 focus:outline-none"
                >
                  <option value="PATIENT">Hasta</option>
                  <option value="ADMIN">Yönetici (Admin)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl text-xs shadow-clay-btn transition"
                >
                  Kullanıcıyı Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-5 py-3.5 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold rounded-2xl text-xs transition"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default AdminDashboard;

