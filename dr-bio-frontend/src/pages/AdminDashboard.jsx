import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  Database, Plus, Trash2, Users, CheckCircle, XCircle, Search, Edit2, 
  Shield, Activity, FileText, Sparkles, Filter, ChevronRight, UserPlus, 
  Settings, Server, ArrowUpRight, Save, X, Eye, AlertTriangle, UserCheck, 
  Heart, Pill, Stethoscope, Scale, Ruler, Briefcase, Flame, Star, MessageSquare,
  Send, CheckCircle2, Bell, Check, RotateCcw, TrendingUp, Loader2
} from 'lucide-react';
import api from '../services/api';

const defaultFeedbacks = [
  { 
    id: 1, 
    userName: 'Burak Öztürk', 
    userEmail: 'burak.ozturk@yahoo.com', 
    rating: 2, 
    comment: 'Mobil cihazdan tahlil yüklerken kamera ile fotoğraf çekme adımı bazen yavaşlıyor. Mobil tarayıcı uyumluluğunun iyileştirilmesini öneririm.', 
    date: '2026-08-05', 
    status: 'UNREAD', 
    category: 'ŞİKAYET / ÖNERİ' 
  },
  { 
    id: 2, 
    userName: 'Canan Arslan', 
    userEmail: 'canan.arslan@outlook.com', 
    rating: 4, 
    comment: 'Tahlil sonuçlarımdaki referans dışı değerler kırmızı ile çok güzel vurgulanmış. Geçmiş tahlillerimle karşılaştırma grafiği çok faydalı.', 
    date: '2026-08-05', 
    status: 'UNREAD', 
    category: 'MEMNUNİYET' 
  },
  { 
    id: 3, 
    userName: 'Deniz Yıldız', 
    userEmail: 'deniz.yildiz@gmail.com', 
    rating: 1, 
    comment: 'Son tahlilimde Ferritin seviyem kritik sınırda görünüyordu fakat bildirim gelmedi. Acil uyarı sisteminin anlık bildirim ile desteklenmesini istiyorum.', 
    date: '2026-08-05', 
    status: 'UNREAD', 
    category: 'ŞİKAYET / ÖNERİ' 
  },
  { 
    id: 4, 
    userName: 'Selin Tekin', 
    userEmail: 'selin.tekin@icloud.com', 
    rating: 5, 
    comment: 'Doktorumun bile tam açıklayamadığı glukoz ve HbA1c dalgalanmalarını Dr. Bio sayesinde saniyeler içinde anladım. Arayüz harika!', 
    date: '2026-08-04', 
    status: 'UNREAD', 
    category: 'MEMNUNİYET' 
  },
  { 
    id: 5, 
    userName: 'Mert Aksoy', 
    userEmail: 'mert.aksoy@hotmail.com', 
    rating: 3, 
    comment: 'Tahlil yükledikten sonra yapay zeka analiz raporu 15 saniyede geldi. Hız güzel fakat PDF indirme butonunun yeri daha belirgin olmalı.', 
    date: '2026-08-04', 
    status: 'UNREAD', 
    category: 'ÖNERİ' 
  },
  { 
    id: 6, 
    userName: 'Dr. Zeynep Ersal', 
    userEmail: 'hasta@drbio.com', 
    rating: 5, 
    comment: 'Yapay zeka tahlil analizi ve otomatik referans parametre eşleştirmesi kusursuz çalışıyor. Dr. Bio platformuna 5 yıldız!', 
    date: '2026-08-06', 
    status: 'UNREAD', 
    category: 'MEMNUNİYET' 
  }
];

const defaultAdminUsers = [
  { 
    id: 101, 
    name: 'Dr. Zeynep Ersal', 
    email: 'hasta@drbio.com', 
    role: 'PATIENT', 
    status: 'ACTIVE', 
    regDate: '2026-08-01',
    healthProfile: {
      age: '28',
      weight: '62',
      height: '168',
      gender: 'Kadın',
      maritalStatus: 'Bekar',
      childrenCount: '0',
      occupation: 'Biyomedikal Mühendisi',
      genetics: 'Ailede Tip-2 Diyabet öyküsü var',
      surgeries: 'Apendektomi (2020)',
      medications: 'B-Kompleks vitamini, D3 Takviyesi',
      allergies: 'Toz ve Penisilin alerjisi',
      chronicPain: 'Migren (Hafif düzeyde)',
      habits: 'Sigara kullanmıyor, Sosyal alkol'
    }
  },
  { 
    id: 102, 
    name: 'Sistem Yöneticisi (Admin)', 
    email: 'admin@drbio.com', 
    role: 'ADMIN', 
    status: 'ACTIVE', 
    regDate: '2026-07-15',
    healthProfile: {
      age: '35',
      weight: '76',
      height: '180',
      gender: 'Erkek',
      maritalStatus: 'Evli',
      childrenCount: '1',
      occupation: 'Başhekim / Sistem Mimarı',
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
    name: 'Burak Öztürk', 
    email: 'burak.ozturk@yahoo.com', 
    role: 'PATIENT', 
    status: 'ACTIVE', 
    regDate: '2026-08-02',
    healthProfile: {
      age: '31',
      weight: '82',
      height: '180',
      gender: 'Erkek',
      maritalStatus: 'Evli',
      childrenCount: '1',
      occupation: 'Yazılım Mimarı',
      genetics: 'Hipertansiyon öyküsü',
      surgeries: 'Menisküs Operasyonu (2022)',
      medications: 'Omega-3',
      allergies: 'Fıstık alerjisi',
      chronicPain: 'Sol diz ağrısı',
      habits: 'Sigara kullanmıyor'
    }
  },
  { 
    id: 104, 
    name: 'Canan Arslan', 
    email: 'canan.arslan@outlook.com', 
    role: 'PATIENT', 
    status: 'ACTIVE', 
    regDate: '2026-08-03',
    healthProfile: {
      age: '29',
      weight: '60',
      height: '168',
      gender: 'Kadın',
      maritalStatus: 'Bekar',
      childrenCount: '0',
      occupation: 'Finans Analisti',
      genetics: 'Yok',
      surgeries: 'Yok',
      medications: 'Magnezyum Kompleks',
      allergies: 'Gluten hassasiyeti',
      chronicPain: 'Bel ağrısı',
      habits: 'Kullanmıyor'
    }
  },
  { 
    id: 105, 
    name: 'Deniz Yıldız', 
    email: 'deniz.yildiz@gmail.com', 
    role: 'PATIENT', 
    status: 'ACTIVE', 
    regDate: '2026-08-04',
    healthProfile: {
      age: '38',
      weight: '74',
      height: '173',
      gender: 'Kadın',
      maritalStatus: 'Evli',
      childrenCount: '2',
      occupation: 'Avukat',
      genetics: 'Demir Eksikliği Anemisi',
      surgeries: 'Sezaryen Doğum (2019, 2022)',
      medications: 'Demir Takviyesi (Ferro Sanol)',
      allergies: 'Yok',
      chronicPain: 'Boyun düzleşmesi ağrısı',
      habits: 'Kullanmıyor'
    }
  },
  { 
    id: 106, 
    name: 'Selin Tekin', 
    email: 'selin.tekin@icloud.com', 
    role: 'PATIENT', 
    status: 'ACTIVE', 
    regDate: '2026-08-04',
    healthProfile: {
      age: '27',
      weight: '55',
      height: '162',
      gender: 'Kadın',
      maritalStatus: 'Bekar',
      childrenCount: '0',
      occupation: 'Grafik Tasarımcı',
      genetics: 'İnsülin Direnci',
      surgeries: 'Yok',
      medications: 'Glucophage (500mg)',
      allergies: 'Polen Alerjisi',
      chronicPain: 'Yok',
      habits: 'Kullanmıyor'
    }
  },
  { 
    id: 107, 
    name: 'Mert Aksoy', 
    email: 'mert.aksoy@hotmail.com', 
    role: 'PATIENT', 
    status: 'ACTIVE', 
    regDate: '2026-08-05',
    healthProfile: {
      age: '42',
      weight: '88',
      height: '185',
      gender: 'Erkek',
      maritalStatus: 'Evli',
      childrenCount: '2',
      occupation: 'İnşaat Mühendisi',
      genetics: 'Yüksek Kolesterol Öyküsü',
      surgeries: 'Yok',
      medications: 'Atorvastatin',
      allergies: 'Yok',
      chronicPain: 'Omuz sıkışması',
      habits: 'Sigara kullanmıyor'
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

const getGenderStyles = (genderInput) => {
  const g = (genderInput || '').toString().toLowerCase().trim();
  if (g === 'kadın' || g === 'female' || g === 'kadin') {
    return {
      avatarBg: 'bg-rose-950 text-rose-200 border border-rose-900/60 font-black shadow-sm',
      badgeBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/40',
      label: 'Kadın'
    };
  } else if (g === 'erkek' || g === 'male') {
    return {
      avatarBg: 'bg-sky-950 text-sky-200 border border-sky-900/60 font-black shadow-sm',
      badgeBg: 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 border-sky-200 dark:border-sky-900/40',
      label: 'Erkek'
    };
  } else {
    return {
      avatarBg: 'bg-slate-800 text-slate-300 border border-slate-700/80 font-black shadow-sm',
      badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      label: 'Belirtilmedi'
    };
  }
};

const AdminDashboard = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const currentTab = tab || 'dashboard';

  // State'ler
  const [usersList, setUsersList] = useState([]);
  const [references, setReferences] = useState([]);
  const [totalReports, setTotalReports] = useState(0);

  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState('');

  // Verileri Backend'den Çek
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      setErrorData('');
      try {
        const [usersRes, refsRes, reportsRes] = await Promise.all([
          api.get('/users'),
          api.get('/reference-values'),
          api.get('/reports/all')
        ]);
        
        setUsersList(usersRes.data);
        setReferences(refsRes.data);
        setTotalReports(reportsRes.data.length);
      } catch (err) {
        console.error('Admin verileri alınamadı:', err);
        setErrorData('Sunucudan veriler alınırken bir hata oluştu.');
        // Hata durumunda boş bırakıyoruz
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, [currentTab]);

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

  const saveReferences = async (refData, isEdit) => {
    try {
      if (isEdit) {
        const res = await api.put(`/reference-values/${refData.id}`, refData);
        setReferences(references.map(r => r.id === res.data.id ? res.data : r));
      } else {
        const res = await api.post('/reference-values', refData);
        setReferences([res.data, ...references]);
      }
    } catch (error) {
      console.error("Referans kaydedilemedi", error);
    }
  };

  const handleDeleteRef = async (id) => {
    try {
      await api.delete(`/reference-values/${id}`);
      setReferences(references.filter(r => r.id !== id));
    } catch (error) {
      console.error("Referans silinemedi", error);
    }
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
    saveReferences(refFormData, !!editingRef);
    setRefModalOpen(false);
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', {
        fullName: newUserFormData.name,
        email: newUserFormData.email,
        password: newUserFormData.password,
        kvkkApproved: true
      });
      // Yeniden listele
      const usersRes = await api.get('/users');
      setUsersList(usersRes.data);
    } catch (err) {
      console.error("Kullanıcı eklenemedi:", err);
    }

    setUserModalOpen(false);
  };

  const toggleUserStatus = (id) => {
    setUsersList(usersList.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'PASSIVE' : 'ACTIVE' } : u));
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`${userName} kullanıcısını ve TÜM tıbbi raporlarını kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
      try {
        await api.delete(`/users/${userId}`);
        const usersRes = await api.get('/users');
        setUsersList(usersRes.data);
      } catch (err) {
        alert(err.response?.data?.message || 'Kullanıcı silinirken bir hata oluştu.');
      }
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      const usersRes = await api.get('/users');
      setUsersList(usersRes.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Rol değiştirilirken bir hata oluştu.');
    }
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
  const [feedbackSubTab, setFeedbackSubTab] = useState('all'); // 'all' | 'complaints' | 'pending_contact'
  const [acknowledgedIds, setAcknowledgedIds] = useState(() => {
    const saved = localStorage.getItem('drbio_acknowledged_ids');
    if (saved) { try { const p = JSON.parse(saved); if (Array.isArray(p)) return p; } catch(e) {} }
    return [];
  });
  const [contactPendingIds, setContactPendingIds] = useState(() => {
    const saved = localStorage.getItem('drbio_contact_pending_ids');
    if (saved) { try { const p = JSON.parse(saved); if (Array.isArray(p)) return p; } catch(e) {} }
    return [];
  });
  // Son gönderilen şablon: { [feedbackId]: templateId }
  const [feedbackLastAction, setFeedbackLastAction] = useState(() => {
    const saved = localStorage.getItem('drbio_last_action');
    if (saved) { try { const p = JSON.parse(saved); if (typeof p === 'object') return p; } catch(e) {} }
    return {};
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


  // Mesaj şablon listesi (Kalıp Cümleler)
  const MESSAGE_TEMPLATES = [
    { 
      id: 'received',      
      emoji: '📬', 
      label: 'Şikayet & Talep Alındı',            
      title: 'Şikayetiniz Alınmıştır',          
      text: 'Şikayetiniz ve talebiniz alınmıştır. En kısa süre içerisinde uzman ekibimiz tarafından detaylı inceleme yapılıp tarafınıza geri dönüş sağlanacaktır.',
      badgeBg: 'bg-amber-950 text-amber-200 border border-amber-900/60'
    },
    { 
      id: 'investigating', 
      emoji: '🔍', 
      label: 'İnceleme Başlatıldı',             
      title: 'Konu İncelenmektedir',           
      text: 'Görüşleriniz ve geri bildiriminiz bizim için çok değerli. Hizmet kalitemizi artırmak adına bildirdiğiniz konu hakkında gerekli incelemeler başlatılmıştır.',
      badgeBg: 'bg-sky-950 text-sky-200 border border-sky-900/60'
    },
    { 
      id: 'thankyou',      
      emoji: '🙏', 
      label: 'Geri Bildirim Teşekkürü',                
      title: 'Geri Bildiriminiz İçin Teşekkürler',     
      text: 'Geri bildiriminiz ve değerli önerileriniz için Dr. Bio ailesi olarak çok teşekkür ederiz. Sağlıklı günler dileriz!',
      badgeBg: 'bg-emerald-950 text-emerald-200 border border-emerald-900/60'
    },
    { 
      id: 'praise',        
      emoji: '⭐', 
      label: 'Güzel Yorum Teşekkürü',          
      title: 'Nazik Yorumlarınız İçin Teşekkürler',  
      text: 'Güzel ve nazik yorumlarınız için çok teşekkür ederiz! Yorumlarınız ve memnuniyetiniz bizlere ilham veriyor. Sağlıklı günler dileriz.',
      badgeBg: 'bg-purple-950 text-purple-200 border border-purple-900/60'
    },
    { 
      id: 'resolved',      
      emoji: '✅', 
      label: 'Çözüme Ulaştırıldı',          
      title: 'Talebiniz Çözüme Ulaştırıldı',                 
      text: 'Bildirdiğiniz konu incelenmiş ve gerekli düzenlemeler yapılmıştır. Hizmetimizi iyileştirmemize katkı sağladığınız için teşekkür ederiz.',
      badgeBg: 'bg-emerald-950 text-emerald-200 border border-emerald-900/60'
    },
    { 
      id: 'will_contact',  
      emoji: '📞', 
      label: 'Temsilci İletişimi',     
      title: 'Sizinle İletişime Geçilecek',           
      text: 'Geri bildiriminizi değerlendirdik. Ekibimiz en kısa süre içerisinde tarafınızla iletişime geçecektir.',
      badgeBg: 'bg-rose-950 text-rose-200 border border-rose-900/60'
    },
  ];

  // Çözüm mesajları (Bekleyen Dönüşler → Geri Dönüş Yap butonu için)
  const RESOLUTION_TEMPLATES = [
    {
      id: 'resolved',
      emoji: '✅',
      label: 'Sorun Çözüldü',
      title: 'Talebiniz Çözüme Kavuşturuldu',
      text: 'Bildirdiğiniz sorun ve talebiniz ekibimiz tarafından incelenerek çözüme kavuşturulmuştur. İlginiz ve sabrınız için teşekkür ederiz. Sağlıklı günler dileriz.',
      badgeBg: 'bg-emerald-950 text-emerald-200 border border-emerald-900/60'
    },
    {
      id: 'fixed_bug',
      emoji: '🛠️',
      label: 'Hata Düzeltildi',
      title: 'Bildirdiğiniz Hata Giderildi',
      text: 'Bildirdiğiniz teknik hata/sorun tespit edilmiş ve gerekli düzeltme işlemi tamamlanmıştır. Değerli geri bildiriminiz sistemimizin gelişimine katkı sağladı.',
      badgeBg: 'bg-sky-950 text-sky-200 border border-sky-900/60'
    },
    {
      id: 'update_done',
      emoji: '🔄',
      label: 'Güncelleme Yapıldı',
      title: 'Talebiniz Doğrultusunda Güncelleme Yapıldı',
      text: 'Talebiniz ve öneriniz doğrultusunda sistemimizde gerekli güncelleme yapılmıştır. Katkılarınız Dr. Bio ailesini daha iyi hale getiriyor.',
      badgeBg: 'bg-purple-950 text-purple-200 border border-purple-900/60'
    },
    {
      id: 'apology',
      emoji: '🤝',
      label: 'Özür & Çözüm Bilgisi',
      title: 'Yaşattığımız Rahatsızlık İçin Özür Dileriz',
      text: 'Yaşadığınız olumsuz deneyim için içtenlikle özür dileriz. Sorununuz çözüme kavuşturulmuş olup, benzer bir durumun tekrarlanmaması için gerekli önlemler alınmıştır.',
      badgeBg: 'bg-rose-950 text-rose-200 border border-rose-900/60'
    },
    {
      id: 'thankyou',
      emoji: '🙏',
      label: 'Teşekkür & Kapanış',
      title: 'Geri Bildiriminiz İçin Teşekkürler',
      text: 'Geri bildiriminiz ve sabrınız için içtenlikle teşekkür ederiz. Konunuz ilgili ekibimize iletilmiş olup en kısa sürede gerekli adımlar atılacaktır.',
      badgeBg: 'bg-amber-950 text-amber-200 border border-amber-900/60'
    },
  ];

  const [ackModalTarget, setAckModalTarget] = useState(null);
  const [ackSelectedTemplate, setAckSelectedTemplate] = useState(MESSAGE_TEMPLATES[0]);
  const [ackCustomNote, setAckCustomNote] = useState(MESSAGE_TEMPLATES[0].text);

  // Çözüm/Geri dönüş modalı state
  const [resolveModalTarget, setResolveModalTarget] = useState(null);
  const [resolveSelectedTemplate, setResolveSelectedTemplate] = useState(null);
  const [resolveCustomNote, setResolveCustomNote] = useState('');

  const openResolveModal = (item) => {
    setResolveModalTarget(item);
    setResolveSelectedTemplate(RESOLUTION_TEMPLATES[0]);
    setResolveCustomNote(RESOLUTION_TEMPLATES[0].text);
  };

  const handleSelectResolutionTemplate = (tpl) => {
    setResolveSelectedTemplate(tpl);
    setResolveCustomNote(tpl.text);
  };

  const handleSendResolution = (e) => {
    if (e) e.preventDefault();
    if (!resolveModalTarget || !resolveCustomNote.trim()) return;

    const item = resolveModalTarget;
    const title = resolveSelectedTemplate
      ? `${resolveSelectedTemplate.emoji} ${resolveSelectedTemplate.title}`
      : '✅ Dr. Bio — Talebiniz Yanıtlandı';
    const finalText = resolveCustomNote.trim();

    // Hastaya bildirim gönder
    const userEmail = (item.userEmail || '').toLowerCase();
    const notifKey = `drbio_notif_${userEmail}`;
    let notifs = [];
    const savedN = localStorage.getItem(notifKey);
    if (savedN) { try { const p = JSON.parse(savedN); if (Array.isArray(p)) notifs = p; } catch(e) {} }
    const newNotif = { id: Date.now(), title, text: finalText, time: 'Az önce', unread: true, type: 'SYSTEM' };
    localStorage.setItem(notifKey, JSON.stringify([newNotif, ...notifs]));

    // Feedback'i REVIEWED yap
    const newList = safeFeedbacks.map(f => f.id === item.id ? { ...f, status: 'REVIEWED' } : f);
    setFeedbacks(newList);
    localStorage.setItem('drbio_feedbacks', JSON.stringify(newList));

    // Bekleyen listesinden çıkar (sorun çözüldü)
    const newPending = contactPendingIds.filter(id => id !== item.id);
    setContactPendingIds(newPending);
    localStorage.setItem('drbio_contact_pending_ids', JSON.stringify(newPending));

    // Son eylemi güncelle
    const newLastAction = { ...feedbackLastAction, [item.id]: resolveSelectedTemplate?.id || 'resolved' };
    setFeedbackLastAction(newLastAction);
    localStorage.setItem('drbio_last_action', JSON.stringify(newLastAction));

    setResolveModalTarget(null);
    setAckToast(`"${item.userName}" adlı hastaya çözüm mesajı iletildi ve bekleyen listesinden çıkarıldı!`);
    setTimeout(() => setAckToast(''), 5000);
  };

  const openAckModal = (item) => {
    setAckModalTarget(item);
    // Varsayılan kalıp olarak şikayet ise 'received', yüksek puan ise 'thankyou' seçilsin
    const defaultTpl = (item.rating || 5) <= 3 ? MESSAGE_TEMPLATES[0] : MESSAGE_TEMPLATES[2];
    setAckSelectedTemplate(defaultTpl);
    setAckCustomNote(defaultTpl.text);
  };

  const handleSelectTemplate = (tpl) => {
    setAckSelectedTemplate(tpl);
    setAckCustomNote(tpl.text);
  };

  const handleSendAcknowledgement = (e) => {
    if (e) e.preventDefault();
    if (!ackModalTarget || !ackCustomNote.trim()) return;

    const item = ackModalTarget;
    const title = ackSelectedTemplate ? `${ackSelectedTemplate.emoji} ${ackSelectedTemplate.title}` : '💬 Dr. Bio Yönetim Bildirimi';
    const finalText = ackCustomNote.trim();

    const userEmail = (item.userEmail || '').toLowerCase();
    const notifKey = `drbio_notif_${userEmail}`;
    let notifs = [];
    const saved = localStorage.getItem(notifKey);
    if (saved) { try { const p = JSON.parse(saved); if (Array.isArray(p)) notifs = p; } catch(e) {} }
    const newNotif = { id: Date.now(), title: title, text: finalText, time: 'Az önce', unread: true, type: 'SYSTEM' };
    localStorage.setItem(notifKey, JSON.stringify([newNotif, ...notifs]));

    const newList = safeFeedbacks.map(f => f.id === item.id ? { ...f, status: 'REVIEWED' } : f);
    setFeedbacks(newList);
    localStorage.setItem('drbio_feedbacks', JSON.stringify(newList));

    const newAcked = [...acknowledgedIds, item.id];
    setAcknowledgedIds(newAcked);
    localStorage.setItem('drbio_acknowledged_ids', JSON.stringify(newAcked));

    // Bekleyen dönüşler mantığı:
    // 'received', 'investigating', 'will_contact' → bekleyene ekle
    // 'resolved', 'thankyou', 'praise', 'apology' → bekleyenden çıkar (çözüme kavuştu)
    const PENDING_TRIGGER_IDS = ['received', 'investigating', 'will_contact'];
    const PENDING_RESOLVE_IDS = ['resolved', 'thankyou', 'praise', 'apology'];

    // Son eylemi kaydet
    const newLastAction = { ...feedbackLastAction, [item.id]: ackSelectedTemplate?.id || 'custom' };
    setFeedbackLastAction(newLastAction);
    localStorage.setItem('drbio_last_action', JSON.stringify(newLastAction));

    if (PENDING_TRIGGER_IDS.includes(ackSelectedTemplate?.id)) {
      if (!contactPendingIds.includes(item.id)) {
        const newPending = [...contactPendingIds, item.id];
        setContactPendingIds(newPending);
        localStorage.setItem('drbio_contact_pending_ids', JSON.stringify(newPending));
      }
    } else if (PENDING_RESOLVE_IDS.includes(ackSelectedTemplate?.id)) {
      if (contactPendingIds.includes(item.id)) {
        const newPending = contactPendingIds.filter(id => id !== item.id);
        setContactPendingIds(newPending);
        localStorage.setItem('drbio_contact_pending_ids', JSON.stringify(newPending));
      }
    }

    setAckModalTarget(null);
    setAckToast(`"${item.userName}" adlı hastaya geri bildirim mesajınız başarıyla iletildi!`);
    setTimeout(() => setAckToast(''), 4000);
  };

  const handleResetAllData = () => {
    localStorage.removeItem('drbio_feedbacks');
    localStorage.removeItem('drbio_acknowledged_ids');
    localStorage.removeItem('drbio_contact_pending_ids');
    localStorage.removeItem('drbio_last_action');
    localStorage.removeItem('userAccounts');
    localStorage.removeItem('admin_notifications');
    localStorage.removeItem('userNotifications');
    setFeedbacks(defaultFeedbacks);
    setUsersList(defaultAdminUsers);
    setAcknowledgedIds([]);
    setContactPendingIds([]);
    setFeedbackLastAction({});
    setAckToast('Tüm eski veriler temizlendi ve taze test kullanıcıları yüklendi! 🔄');
    setTimeout(() => setAckToast(''), 4000);
  };

  useEffect(() => {
    const isV3 = localStorage.getItem('drbio_v3_fresh_data_seeded');
    if (!isV3) {
      localStorage.setItem('drbio_v3_fresh_data_seeded', 'true');
      handleResetAllData();
    }
  }, []);

  // Filtrelenmiş geri bildirimler: önce alt sekme, sonra arama + yıldız filtresi
  const filteredFeedbacks = safeFeedbacks.filter(f => {
    if (!f) return false;

    // 1) Alt sekme filtresi
    if (feedbackSubTab === 'all') {
      // Tüm Bildirimler: Bütün hastalar ve bildirimler eksiksiz gözükür
    }
    if (feedbackSubTab === 'complaints') {
      // Şikayetler: 3 yıldız ve altı (rating <= 3) veren tüm hastalarımız gözüksün
      if ((f.rating || 0) > 3) return false;
    }
    if (feedbackSubTab === 'pending_contact' && !contactPendingIds.includes(f.id)) return false;
    if (feedbackSubTab === 'responded' && !acknowledgedIds.includes(f.id)) return false; // yalnızca yanıtlananlar

    // 2) Arama filtresi
    const searchLower = (feedbackSearch || '').toLowerCase();
    const matchesSearch = (f.userName || '').toLowerCase().includes(searchLower) ||
                          (f.userEmail || '').toLowerCase().includes(searchLower) ||
                          (f.comment || '').toLowerCase().includes(searchLower);

    // 3) Yıldız filtresi
    let matchesStar = true;
    if (starFilter === '5') matchesStar = f.rating === 5;
    else if (starFilter === '4') matchesStar = f.rating === 4;
    else if (starFilter === '3_BELOW') matchesStar = (f.rating || 0) <= 3;

    return matchesSearch && matchesStar;
  });

  // Süreç notu yardımcı fonksiyonu
  const getProcessNote = (feedbackId) => {
    const lastAction = feedbackLastAction[feedbackId];
    const MAP = {
      'received':      { emoji: '📬', text: 'Şikayet alındı, yanıt bekleniyor',   color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900' },
      'investigating': { emoji: '🔍', text: 'İnceleme başlatıldı',                  color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900' },
      'will_contact':  { emoji: '📞', text: 'Temsilci en kısa sürede ulaşacak',  color: 'text-rose-600 dark:text-rose-400',     bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900' },
    };
    return MAP[lastAction] || { emoji: '⏳', text: 'Görüş bildirildi, inceleme bekleniyor', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900' };
  };

  // Yanıtlananlar için son mesaj notunu göster
  const getRespondedNote = (feedbackId) => {
    const lastAction = feedbackLastAction[feedbackId];
    const MAP = {
      'received':      { emoji: '📬', text: 'Şikayet alındı mesajı gönderildi',          color: 'text-amber-700 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900' },
      'investigating': { emoji: '🔍', text: 'İnceleme başlatıldı bilgisi verildi',       color: 'text-blue-700 dark:text-blue-400',     bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900' },
      'will_contact':  { emoji: '📞', text: 'Temsilci iletişim bilgisi gönderildi',   color: 'text-rose-700 dark:text-rose-400',     bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900' },
      'thankyou':      { emoji: '🙏', text: 'Teşekkür mesajı gönderildi',              color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900' },
      'praise':        { emoji: '⭐', text: 'Güzel yorum teşekkür mesajı gönderildi',  color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900' },
      'resolved':      { emoji: '✅', text: 'Çözüme ulaştırıldı mesajı gönderildi',    color: 'text-lime-800 dark:text-lime-400',     bg: 'bg-lime-50 dark:bg-lime-950/30 border-lime-200 dark:border-lime-900' },
      'fixed_bug':     { emoji: '🛠️', text: 'Hata düzeltildi bilgisi verildi',         color: 'text-blue-700 dark:text-blue-400',     bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900' },
      'update_done':   { emoji: '🔄', text: 'Güncelleme yapıldı bilgisi verildi',      color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900' },
      'apology':       { emoji: '🤝', text: 'Telafi ve özür mesajı gönderildi',       color: 'text-rose-700 dark:text-rose-400',     bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900' },
    };
    return MAP[lastAction] || { emoji: '💬', text: 'Özel yanıt gönderildi',                    color: 'text-stone-700 dark:text-stone-400',   bg: 'bg-stone-50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800' };
  };

  const complaintCount = safeFeedbacks.filter(f =>
    f && (f.rating || 0) <= 3
  ).length;

  const respondedCount = safeFeedbacks.filter(f =>
    f && acknowledgedIds.includes(f.id)
  ).length;

  // Metrik hesaplamaları
  const avgRating = safeFeedbacks.length > 0 
    ? (safeFeedbacks.reduce((acc, curr) => acc + ((curr && curr.rating) || 5), 0) / safeFeedbacks.length).toFixed(1)
    : '5.0';
  const satisfiedCount = safeFeedbacks.filter(f => f && (f.rating || 0) >= 4).length;


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
      <div className="flex flex-wrap items-center justify-between gap-2 mb-8 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => navigate('/admin')}
            className={`px-5 py-3 rounded-2xl font-black text-sm transition-all flex items-center space-x-2 ${
              currentTab === 'dashboard' || currentTab === 'admin'
                ? 'bg-red-600 text-white shadow-clay-btn' 
                : 'bg-theme-card text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shadow-clay-card dark:shadow-clay-card-dark border-theme-border'
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
                : 'bg-theme-card text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shadow-clay-card dark:shadow-clay-card-dark border-theme-border'
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
                : 'bg-theme-card text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shadow-clay-card dark:shadow-clay-card-dark border-theme-border'
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
                : 'bg-theme-card text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shadow-clay-card dark:shadow-clay-card-dark border-theme-border'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Geri Bildirimler ({feedbacks.length})</span>
          </button>
        </div>

        <button 
          onClick={handleResetAllData}
          title="Tüm kullanıcı ve geri bildirim verilerini sıfırla, taze test verileri yükle"
          className="px-4 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold rounded-2xl text-xs transition flex items-center space-x-2 shadow-clay-btn shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
          <span>Verileri Sıfırla & Yenile</span>
        </button>
      </div>

      {loadingData && (
        <div className="w-full flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      )}

      {errorData && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl flex items-center space-x-3 text-sm font-bold animate-fade-in">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorData}</span>
        </div>
      )}

      {!loadingData && !errorData && (
        <>
          {/* --- 1. GENEL BAKIŞ (DASHBOARD) TABI --- */}
      {(currentTab === 'dashboard' || currentTab === 'admin') && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Admin Banner */}
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-900 rounded-2xl p-8 text-white shadow-clay-card dark:shadow-clay-card-dark border-theme-border relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-8 translate-y-8">
              <Shield className="w-80 h-80 text-white" />
            </div>

            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-clay-btn">
                <Shield className="w-4 h-4 text-white" />
                <span>Dr. Bio Sistem Yönetim Merkezi</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">Yönetici Kontrol Paneli</h1>
              <p className="text-red-100 font-medium max-w-xl text-sm leading-relaxed">
                Tıbbi referans parametrelerini yönetebilir, kayıtlı hasta hesaplarını inceleyebilir ve kullanıcıların detaylı sağlık profillerini görüntüleyebilirsiniz.
              </p>
            </div>
          </div>

          {/* İstatistik Metrik Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-theme-card p-6 rounded-2xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center space-x-4">
              <div className="w-14 h-14 bg-red-50 dark:bg-red-950/40 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <span className="block text-xs font-black text-slate-400 uppercase tracking-wider">Kayıtlı Kullanıcı</span>
                <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{usersList.length}</span>
              </div>
            </div>

            <div className="bg-theme-card p-6 rounded-2xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center space-x-4">
              <div className="w-14 h-14 bg-sky-50 dark:bg-sky-950/40 rounded-2xl flex items-center justify-center text-sky-600 shrink-0">
                <Database className="w-7 h-7" />
              </div>
              <div>
                <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Referans Parametre</span>
                <span className="text-2xl font-black text-stone-800 dark:text-stone-100">{references.length}</span>
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
                <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Toplam Rapor</span>
                <span className="text-2xl font-black text-stone-800 dark:text-stone-200">{totalReports}</span>
              </div>
            </div>
          </div>

          {/* Hızlı İşlem & Son Aktivite Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Hızlı Eylemler */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-red-600" />
                <span>Hızlı Yönetim İşlemleri</span>
              </h2>

              <div className="bg-theme-card rounded-[2rem] p-6 shadow-clay-card dark:shadow-clay-card-dark border-theme-border space-y-3">
                <button
                  onClick={() => handleOpenRefModal()}
                  className="w-full p-4 bg-theme-bg hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-200 text-xs flex items-center justify-between border border-slate-200 dark:border-slate-800 transition"
                >
                  <div className="flex items-center space-x-3">
                    <Plus className="w-4 h-4 text-red-600" />
                    <span>Yeni Referans Parametresi Ekle</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => setUserModalOpen(true)}
                  className="w-full p-4 bg-theme-bg hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-200 text-xs flex items-center justify-between border border-slate-200 dark:border-slate-800 transition"
                >
                  <div className="flex items-center space-x-3">
                    <UserPlus className="w-4 h-4 text-blue-600" />
                    <span>Yeni Kullanıcı Ekle</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => navigate('/admin/references')}
                  className="w-full p-4 bg-theme-bg hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-200 text-xs flex items-center justify-between border border-slate-200 dark:border-slate-800 transition"
                >
                  <div className="flex items-center space-x-3">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span>Tüm Referans Kütüphanesini Yönet</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Sistem Logları & Son Hesaplar */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                <Users className="w-5 h-5 text-red-600" />
                <span>Son Kaydolan Kullanıcılar</span>
              </h2>

              <div className="bg-theme-card rounded-[2rem] p-6 shadow-clay-card dark:shadow-clay-card-dark border-theme-border space-y-3">
                {usersList.slice(0, 4).map((u) => {
                  const gStyle = getGenderStyles(u.healthProfile?.gender);
                  return (
                    <div key={u.id} className="p-4 bg-theme-bg rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${gStyle.avatarBg} rounded-xl flex items-center justify-center font-black text-sm shadow-sm`}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-black text-slate-800 dark:text-slate-200 text-sm">{u.name}</p>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${gStyle.badgeBg}`}>
                              {gStyle.label}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-bold">{u.email}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setSelectedUserDetail(u)}
                        className="px-3.5 py-2 bg-theme-card hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                        <span>Detay İncele</span>
                      </button>
                    </div>
                  );
                })}
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
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200">Referans Kütüphanesi</h2>
              <p className="text-xs font-bold text-slate-400 mt-1">Tahlil parametrelerinin alt/üst sınırları ve otomatik yapay zeka öneri metinleri</p>
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
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Parametre adı veya kategori ara (Örn. Hemoglobin, Biyokimya)..."
                value={refSearch}
                onChange={(e) => setRefSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600/20"
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
                        className="p-2 bg-theme-bg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition"
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

                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-1">{ref.name}</h3>

                  <div className="inline-flex items-center space-x-2 bg-theme-bg px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-black text-slate-700 dark:text-slate-300 my-2">
                    <span>Referans:</span>
                    <span className="text-red-600 dark:text-red-400">{ref.min} - {ref.max} {ref.unit}</span>
                  </div>

                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed mt-2 bg-theme-bg p-3 rounded-2xl">
                    <span className="font-black text-slate-700 dark:text-slate-300 block mb-0.5">Otomatik AI Önerisi:</span>
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
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200">Kullanıcı Yönetimi</h2>
              <p className="text-xs font-bold text-slate-400 mt-1">Sistemdeki tüm hasta ve yönetici hesaplarının kontrolü ve detaylı profil incelemesi</p>
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
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="İsim veya e-posta adresi ile kullanıcı ara..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600/20"
              />
            </div>
          </div>

          {/* Kullanıcı Listesi */}
          <div className="bg-theme-card rounded-[2.5rem] p-6 shadow-clay-card dark:shadow-clay-card-dark border-theme-border space-y-3">
            {filteredUsers.map((u) => {
              const gStyle = getGenderStyles(u.healthProfile?.gender);
              return (
                <div 
                  key={u.id}
                  className="p-4 bg-theme-bg rounded-2xl border border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-slate-300 transition"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${gStyle.avatarBg} rounded-2xl flex items-center justify-center font-black text-lg shadow-sm`}>
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-800 dark:text-slate-200 text-sm">{u.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${gStyle.badgeBg}`}>
                          {gStyle.label}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-400">{u.email}</p>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Kayıt: {u.regDate}</span>
                    </div>
                  </div>

                <div className="flex items-center space-x-2">
<<<<<<< HEAD
                  <select
                    value={u.role}
                    onChange={(e) => handleChangeRole(u.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase appearance-none outline-none cursor-pointer text-center ${
                      u.role === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    <option value="PATIENT">HASTA</option>
                    <option value="ADMIN">YÖNETİCİ</option>
                  </select>
=======
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                    u.role === 'ADMIN' 
                      ? 'bg-purple-950 text-purple-200 border-purple-900/60' 
                      : 'bg-sky-950 text-sky-200 border-sky-900/60'
                  }`}>
                    {u.role === 'ADMIN' ? 'Yönetici' : 'Hasta'}
                  </span>
>>>>>>> 110254d18730d2a5207ff13bd91c0e0bd92063b8

                  <button
                    onClick={() => toggleUserStatus(u.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center space-x-1 border ${
                      u.status === 'ACTIVE' 
                        ? 'bg-emerald-950 text-emerald-200 border-emerald-900/60' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{u.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteUser(u.id, u.name)}
                    className="px-3.5 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-800/60 text-red-600 dark:text-red-400 rounded-full text-xs font-black transition flex items-center shadow-sm shrink-0"
                    title="Kullanıcıyı Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSelectedUserDetail(u)}
<<<<<<< HEAD
                    className="px-3.5 py-1.5 bg-lime-700 hover:bg-lime-800 text-white rounded-full text-xs font-black transition flex items-center space-x-1 shadow-sm shrink-0"
=======
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-black transition flex items-center space-x-1 shadow-clay-btn"
>>>>>>> 110254d18730d2a5207ff13bd91c0e0bd92063b8
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">İncele</span>
                  </button>
                </div>
              </div>
            );
          })}
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
              <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/30 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                <Star className="w-7 h-7 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Ortalama Puan</span>
                <span className="text-2xl font-black text-stone-800 dark:text-stone-200">{avgRating} / 5.0</span>
              </div>
            </div>

            <div className="bg-theme-card p-6 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center space-x-4">
              <div className="w-14 h-14 bg-sky-50/70 dark:bg-sky-950/30 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <TrendingUp className="w-7 h-7 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Memnuniyet Oranı</span>
                <span className="text-2xl font-black text-sky-700 dark:text-sky-300">{avgRating} / 5.0</span>
              </div>
            </div>

            <div className="bg-theme-card p-6 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center space-x-4">
              <div className="w-14 h-14 bg-sky-50/70 dark:bg-sky-950/30 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <MessageSquare className="w-7 h-7 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Toplam Bildirim</span>
                <span className="text-2xl font-black text-sky-700 dark:text-sky-300">{feedbacks.length}</span>
              </div>
            </div>

            <div className="bg-theme-card p-6 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center space-x-4">
              <div className="w-14 h-14 bg-sky-50/70 dark:bg-sky-950/30 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <CheckCircle className="w-7 h-7 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Memnun Hastalar</span>
                <span className="text-2xl font-black text-sky-700 dark:text-sky-300">{satisfiedCount} Hasta</span>
              </div>
            </div>

            <div className="bg-theme-card p-6 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center space-x-4">
              <div className="w-14 h-14 bg-rose-50/70 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <AlertTriangle className="w-7 h-7 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Şikayet / Öneri</span>
                <span className="text-2xl font-black text-rose-700 dark:text-rose-300">{complaintCount} Kayıt</span>
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
                className="w-full pl-11 pr-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl text-xs font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
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

          {/* Alt Sekme Navigasyonu: Tümü / Şikayetler / Bekleyen Dönüşler / Yanıtlananlar */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFeedbackSubTab('all')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                feedbackSubTab === 'all'
                  ? 'bg-red-600 text-white shadow-clay-btn'
                  : 'bg-theme-bg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Tüm Bildirimler ({safeFeedbacks.length})</span>
            </button>

            <button
              onClick={() => setFeedbackSubTab('complaints')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                feedbackSubTab === 'complaints'
                  ? 'bg-red-600 text-white shadow-clay-btn'
                  : 'bg-theme-bg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Şikayetler ({complaintCount})</span>
            </button>

            <button
              onClick={() => setFeedbackSubTab('pending_contact')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 relative ${
                feedbackSubTab === 'pending_contact'
                  ? 'bg-red-600 text-white shadow-clay-btn'
                  : 'bg-theme-bg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Bekleyen Dönüşler ({contactPendingIds.length})</span>
              {contactPendingIds.length > 0 && feedbackSubTab !== 'pending_contact' && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {contactPendingIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setFeedbackSubTab('responded')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                feedbackSubTab === 'responded'
                  ? 'bg-red-600 text-white shadow-clay-btn'
                  : 'bg-theme-bg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Yanıtlananlar ({respondedCount})</span>
            </button>
          </div>

          {/* Geri Bildirim Kartları */}
          {filteredFeedbacks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredFeedbacks.map((item) => {
                const matchedUser = usersList.find(u => u.email.trim().toLowerCase() === (item.userEmail || '').trim().toLowerCase());
                const gStyle = getGenderStyles(matchedUser?.healthProfile?.gender || item.gender);
                return (
                  <div 
                    key={item.id}
                    className={`bg-theme-card p-6 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex flex-col space-y-4 ${
                      contactPendingIds.includes(item.id)
                        ? 'ring-2 ring-amber-400/50 dark:ring-amber-500/30'
                        : feedbackSubTab === 'responded' && acknowledgedIds.includes(item.id)
                          ? 'ring-2 ring-sky-400/40 dark:ring-sky-500/25'
                          : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className={`w-10 h-10 ${gStyle.avatarBg} rounded-2xl flex items-center justify-center font-black text-sm shadow-sm`}>
                            {(item.userName || 'H').charAt(0)}
                          </div>
                          {/* Bekleyen dönüş rozeti */}
                          {contactPendingIds.includes(item.id) && (
                            <span
                              title="Bu hasta geri dönüş bekliyor!"
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse shadow-sm border-2 border-white dark:border-stone-900"
                            >
                              !
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-stone-800 dark:text-stone-200 text-sm">{item.userName}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${gStyle.badgeBg}`}>
                              {gStyle.label}
                            </span>
                            {contactPendingIds.includes(item.id) && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[10px] font-black rounded-full border border-amber-200 dark:border-amber-900/40">
                                <Bell className="w-2.5 h-2.5" />
                                Geri Dönüş Bekliyor
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-stone-400">{item.userEmail} • Tarih: {item.date}</p>
                        </div>
                      </div>

                    <div className="flex items-center space-x-3">
                      {/* Yıldız Gösterimi */}
                      <div className="flex items-center space-x-1 bg-amber-50/60 dark:bg-amber-950/30 px-3 py-1.5 rounded-full border border-amber-200/50 dark:border-amber-900/30">
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
                          ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border border-sky-200/50 dark:border-sky-900/30' 
                          : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30'
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

                  {/* Süreç Notu — Bekleyen Dönüşler veya Yanıtlananlar sekmesinde göster */}
                  {feedbackSubTab === 'pending_contact' && contactPendingIds.includes(item.id) && (() => {
                    const note = getProcessNote(item.id);
                    return (
                      <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold ${note.bg}`}>
                        <span className="text-base">{note.emoji}</span>
                        <div>
                          <span className="font-black text-[10px] uppercase tracking-widest block text-stone-400 dark:text-stone-500 mb-0.5">Süreç Durumu</span>
                          <span className={`${note.color} font-extrabold`}>{note.text}</span>
                        </div>
                      </div>
                    );
                  })()}
                  {feedbackSubTab === 'responded' && acknowledgedIds.includes(item.id) && (() => {
                    const note = getRespondedNote(item.id);
                    return (
                      <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold ${note.bg}`}>
                        <span className="text-base">{note.emoji}</span>
                        <div>
                          <span className="font-black text-[10px] uppercase tracking-widest block text-stone-400 dark:text-stone-500 mb-0.5">Gönderilen Yanıt</span>
                          <span className={`${note.color} font-extrabold`}>{note.text}</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Alt İşlem Butonları */}
                  <div className="flex flex-wrap justify-end gap-2 pt-1">

                    {/* Bekleyen Dönüşler sekmesindeyken → Geri Dönüş Yap butonu öne çıkar */}
                    {feedbackSubTab === 'pending_contact' && contactPendingIds.includes(item.id) && (
                      <button
                        onClick={() => openResolveModal(item)}
                        className="px-4 py-2.5 bg-sky-950/90 hover:bg-sky-900 text-sky-200 font-bold rounded-xl text-xs shadow-sm transition flex items-center space-x-1.5 border border-sky-800/60"
                        title="Hastanın sorununu çözdüğünüzü bildirin ve bekleyen listesinden çıkarın"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>🔁 Geri Dönüş Yap / Çözümü Bildir</span>
                      </button>
                    )}

                    {/* Normal bilgilendirme butonu */}
                    {acknowledgedIds.includes(item.id) ? (
                      <div className="flex items-center gap-1.5">
                        <span className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 bg-sky-950/60 text-sky-300 border border-sky-800/50">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Bildirim Gönderildi</span>
                        </span>
                        <button
                          onClick={() => openAckModal(item)}
                          className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1"
                          title="Hastaya tekrar mesaj veya kalıp yanıt gönder"
                        >
                          <Send className="w-3 h-3" />
                          <span>Yeniden Mesaj Gönder</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => openAckModal(item)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm border ${
                          (item.rating || 5) <= 3
                            ? 'bg-amber-950/90 hover:bg-amber-900 text-amber-200 border-amber-800/60'
                            : 'bg-sky-950/90 hover:bg-sky-900 text-sky-200 border-sky-800/60'
                        }`}
                        title={`${item.userName} adlı hastaya kalıp mesaj veya özel yanıt gönder`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Hastayı Bilgilendir / Yanıt Gönder</span>
                      </button>
                    )}

                    <button
                      onClick={() => toggleFeedbackStatus(item.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                        item.status === 'REVIEWED'
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
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
              );
            })}
          </div>
          ) : (
            <div className="bg-theme-card rounded-[2.5rem] p-12 text-center border-theme-border shadow-clay-card dark:shadow-clay-card-dark space-y-4">
              <div className="w-20 h-20 bg-theme-bg rounded-3xl mx-auto flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-800">
                <MessageSquare className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-200">
                  {feedbackSearch || starFilter !== 'ALL' ? 'Filtreleme ile Eşleşen Geri Bildirim Bulunamadı' : 'Henüz Geri Bildirim Yapılmadı'}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1 max-w-sm mx-auto">
                  Hastaların gönderdikleri puanlama ve yorumlar burada listelenecektir.
                </p>
              </div>
            </div>
          )}

        </div>
      )}

      {/* --- ACK TOAST BİLDİRİMİ --- */}
      {ackToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] animate-fade-in">
          <div className="flex items-center space-x-3 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm max-w-sm">
            <Send className="w-5 h-5 shrink-0" />
            <span>{ackToast}</span>
          </div>
        </div>
      )}

      {/* --- KULLANICI TÜM BİLGİLERİ VE SAĞLIK PROFİLİ DETAY MODALI --- */}
      {selectedUserDetail && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-theme-card w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl border-theme-border space-y-6 max-h-[90vh] overflow-y-auto">
            {(() => {
              const gStyle = getGenderStyles(selectedUserDetail.healthProfile?.gender);
              return (
                <>
                  {/* Modal Başlık */}
                  <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 ${gStyle.avatarBg} rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm`}>
                        {selectedUserDetail.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200">{selectedUserDetail.name}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${gStyle.badgeBg}`}>
                            {gStyle.label}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-400">{selectedUserDetail.email}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedUserDetail(null)} 
                      className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* 1. Temel Hesap ve Kimlik Bilgileri */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-red-600" />
                      <span>Hesap ve İletişim Bilgileri</span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-theme-bg p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Kullanıcı Rolü</span>
                        <span className="text-sm font-black text-slate-800 dark:text-slate-200">
                          {selectedUserDetail.role === 'ADMIN' ? 'Yönetici' : 'Hasta'}
                        </span>
                      </div>
                      <div className="bg-theme-bg p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Kayıt Tarihi</span>
                        <span className="text-sm font-black text-slate-800 dark:text-slate-200">{selectedUserDetail.regDate}</span>
                      </div>
                      <div className="bg-theme-bg p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Hesap Durumu</span>
                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{selectedUserDetail.status}</span>
                      </div>
                      <div className="bg-theme-bg p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Kimlik Doğrulama</span>
                        <span className="text-sm font-black text-blue-600 dark:text-blue-400">E-Posta Doğrulanmış</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Fiziksel Bilgiler ve Vücut Kitle İndeksi */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                      <Scale className="w-4 h-4 text-red-600" />
                      <span>Fiziksel Özellikler & Ölçümler</span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-theme-bg p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Yaş</span>
                        <span className="text-base font-black text-slate-800 dark:text-slate-200">{selectedUserDetail.healthProfile?.age || '28'} Yaş</span>
                      </div>
                      <div className="bg-theme-bg p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Boy</span>
                        <span className="text-base font-black text-slate-800 dark:text-slate-200">{selectedUserDetail.healthProfile?.height || '175'} cm</span>
                      </div>
                      <div className="bg-theme-bg p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Kilo</span>
                        <span className="text-base font-black text-slate-800 dark:text-slate-200">{selectedUserDetail.healthProfile?.weight || '68'} kg</span>
                      </div>
                      <div className="bg-theme-bg p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">VKİ (İndeks)</span>
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
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                      <Stethoscope className="w-4 h-4 text-red-600" />
                      <span>Detaylı Anamnez & Tıbbi Geçmiş Formu</span>
                    </h4>

                    <div className="bg-theme-bg p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3.5 text-xs font-bold">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-black">Cinsiyet:</span>
                          <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-black border ${gStyle.badgeBg}`}>
                            {gStyle.label}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-black">Medeni Durum / Çocuk:</span>
                          <span className="text-slate-800 dark:text-slate-200">
                            {selectedUserDetail.healthProfile?.maritalStatus || 'Bekar'} ({selectedUserDetail.healthProfile?.childrenCount || '0'} Çocuk)
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-black">Meslek:</span>
                          <span className="text-slate-800 dark:text-slate-200">{selectedUserDetail.healthProfile?.occupation || 'Belirtilmedi'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-black">Genetik / Ailevi Hastalıklar:</span>
                          <span className="text-slate-800 dark:text-slate-200">{selectedUserDetail.healthProfile?.genetics || 'Yok'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-black">Geçirilmiş Operasyonlar:</span>
                          <span className="text-slate-800 dark:text-slate-200">{selectedUserDetail.healthProfile?.surgeries || 'Yok'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-black">Sürekli Kullanılan İlaçlar:</span>
                          <span className="text-slate-800 dark:text-slate-200">{selectedUserDetail.healthProfile?.medications || 'Yok'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="text-red-500 block text-[10px] uppercase font-black">Alerjiler:</span>
                          <span className="text-red-600 dark:text-red-400 font-black">{selectedUserDetail.healthProfile?.allergies || 'Yok'}</span>
                        </div>
                        <div>
                          <span className="text-amber-500 block text-[10px] uppercase font-black">Kronik Ağrı / Şikayet:</span>
                          <span className="text-amber-700 dark:text-amber-400 font-black">{selectedUserDetail.healthProfile?.chronicPain || 'Yok'}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-black">Alkol ve Sigara Kullanımı:</span>
                        <span className="text-slate-800 dark:text-slate-200">{selectedUserDetail.healthProfile?.habits || 'Kullanmıyor'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Modal Kapat Butonu */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedUserDetail(null)}
                      className="px-6 py-3.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black rounded-2xl text-xs shadow-clay-btn transition"
                    >
                      Pencereyi Kapat
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>,
        document.body
      )}

      {/* --- REFERANS EKLE / DÜZENLE MODAL --- */}
      {refModalOpen && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-theme-card w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border-theme-border space-y-5">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-200">
                {editingRef ? 'Parametreyi Düzenle' : 'Yeni Referans Parametresi Ekle'}
              </h3>
              <button onClick={() => setRefModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRefSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Parametre Adı</label>
                <input
                  type="text" required
                  placeholder="Örn. Hemoglobin (HGB)"
                  value={refFormData.name}
                  onChange={(e) => setRefFormData({ ...refFormData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Min Ref</label>
                  <input
                    type="text" required
                    placeholder="13.5"
                    value={refFormData.min}
                    onChange={(e) => setRefFormData({ ...refFormData, min: e.target.value })}
                    className="w-full px-3 py-3 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Max Ref</label>
                  <input
                    type="text" required
                    placeholder="17.5"
                    value={refFormData.max}
                    onChange={(e) => setRefFormData({ ...refFormData, max: e.target.value })}
                    className="w-full px-3 py-3 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Birim</label>
                  <input
                    type="text" required
                    placeholder="g/dL"
                    value={refFormData.unit}
                    onChange={(e) => setRefFormData({ ...refFormData, unit: e.target.value })}
                    className="w-full px-3 py-3 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Kategori</label>
                <select
                  value={refFormData.category}
                  onChange={(e) => setRefFormData({ ...refFormData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  <option value="Kan Sayımı">Kan Sayımı</option>
                  <option value="Biyokimya">Biyokimya</option>
                  <option value="Vitamin">Vitamin & Mineral</option>
                  <option value="Karaciğer">Karaciğer</option>
                  <option value="Hormon">Hormon</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Otomatik AI Öneri Metni</label>
                <textarea
                  required rows="3"
                  placeholder="Parametre anormal çıktığında hastaya sunulacak öneri metni..."
                  value={refFormData.text}
                  onChange={(e) => setRefFormData({ ...refFormData, text: e.target.value })}
                  className="w-full px-4 py-3 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
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
                  className="px-5 py-3.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-xs transition"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* --- KULLANICI EKLE MODAL --- */}
      {userModalOpen && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-theme-card w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border-theme-border space-y-5">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-200">Yeni Kullanıcı Oluştur</h3>
              <button onClick={() => setUserModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Ad Soyad</label>
                <input
                  type="text" required
                  placeholder="Ahmet Yılmaz"
                  value={newUserFormData.name}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">E-posta Adresi</label>
                <input
                  type="email" required
                  placeholder="ahmet@ornek.com"
                  value={newUserFormData.email}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Şifre</label>
                <input
                  type="password" required
                  placeholder="••••••••"
                  value={newUserFormData.password}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Rol</label>
                <select
                  value={newUserFormData.role}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, role: e.target.value })}
                  className="w-full px-4 py-3 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
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
                  className="px-5 py-3.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-xs transition"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* --- HASTAYA GERİ BİLDİRİM & KALIP CÜMLE GÖNDERME MODALI --- */}
      {ackModalTarget && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-theme-card w-full max-w-2xl rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-theme-border space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Başlık */}
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950/60 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-slate-200">Hastaya Yanıt & Bildirim Gönder</h3>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">
                    <span className="text-red-600 font-extrabold">{ackModalTarget.userName}</span> ({ackModalTarget.userEmail}) için kalıp cümle seçin veya özel mesaj yazın.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAckModalTarget(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-theme-bg rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Orijinal Hasta Yorum Özeti */}
            <div className="bg-stone-50 dark:bg-stone-900/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-800/80 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-black text-stone-400 uppercase tracking-widest text-[10px]">Hasta Geri Bildirimi</span>
                <span className="font-extrabold text-amber-500 flex items-center gap-1">
                  ⭐ {ackModalTarget.rating} / 5 Yıldız
                </span>
              </div>
              <p className="font-semibold text-stone-700 dark:text-stone-300 italic">
                "{ackModalTarget.comment || 'Yorum belirtilmemiş.'}"
              </p>
            </div>

            {/* Kalıp Cümle Şablon Seçenekleri */}
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2.5 ml-1">
                ⚡ Hızlı Kalıp Cümleler (Seçmek için Tıklayın)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MESSAGE_TEMPLATES.map((tpl) => {
                  const isSelected = ackSelectedTemplate?.id === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tpl)}
                      className={`p-3 rounded-2xl text-left border transition-all flex items-start space-x-3 text-xs ${
                        isSelected
                          ? 'bg-blue-50/90 dark:bg-blue-950/50 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                          : 'bg-theme-bg border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <span className="text-xl shrink-0 mt-0.5">{tpl.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-black text-stone-800 dark:text-stone-200 truncate">{tpl.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                        </div>
                        <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                          {tpl.text}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Düzenlenebilir Mesaj Metni Formu */}
            <form onSubmit={handleSendAcknowledgement} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-xs font-black text-stone-400 uppercase tracking-widest">
                    ✏️ Gönderilecek Mesaj Metni (Düzenlenebilir)
                  </label>
                  {ackSelectedTemplate && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${ackSelectedTemplate.badgeBg}`}>
                      {ackSelectedTemplate.emoji} {ackSelectedTemplate.label}
                    </span>
                  )}
                </div>
                <textarea
                  rows={4}
                  required
                  value={ackCustomNote}
                  onChange={(e) => setAckCustomNote(e.target.value)}
                  placeholder="Hastaya iletilecek mesaj içeriğini yazın..."
                  className="w-full p-4 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 leading-relaxed shadow-inner"
                />
                <p className="text-[10px] font-bold text-stone-400 mt-1 ml-1">
                  * Bu mesaj hastanın bildirim kutusunda ("Bildirimler" menüsünde) anında görüntülenecektir.
                </p>
              </div>

              {/* Alt Aksiyon Butonları */}
              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={!ackCustomNote.trim()}
                  className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl text-xs shadow-clay-btn transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>Geri Bildirimi Hastaya Gönder</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAckModalTarget(null)}
                  className="px-5 py-3.5 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold rounded-2xl text-xs transition"
                >
                  İptal
                </button>
              </div>
            </form>

          </div>
        </div>,
        document.body
      )}

      {/* --- GERİ DÖNÜŞ YAP / ÇÖZÜM BİLDİRİM MODALI --- */}
      {resolveModalTarget && createPortal(
        <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-theme-card w-full max-w-2xl rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-theme-border space-y-6 max-h-[90vh] overflow-y-auto">

            {/* Modal Başlık */}
            <div className="flex justify-between items-start border-b border-stone-200 dark:border-stone-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/60 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-800 dark:text-stone-200">Geri Dönüş Yap / Çözüm Bildir</h3>
                  <p className="text-xs font-bold text-stone-400 mt-0.5">
                    <span className="text-amber-500 font-extrabold">{resolveModalTarget.userName}</span> ({resolveModalTarget.userEmail}) adlı hastanın bekleyen talebine yanıt verin.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setResolveModalTarget(null)}
                className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 bg-theme-bg rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hasta Şikayet Özeti */}
            <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 text-xs">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest text-[10px] flex items-center gap-1">
                  <Bell className="w-3 h-3" /> Bekleyen Şikayet / Geri Bildirim
                </span>
                <span className="font-extrabold text-amber-600 flex items-center gap-1">
                  ⭐ {resolveModalTarget.rating} / 5 Yıldız
                </span>
              </div>
              <p className="font-semibold text-stone-700 dark:text-stone-300 italic">
                "{resolveModalTarget.comment || 'Yorum belirtilmemiş.'}"
              </p>
            </div>

            {/* Çözüm Kalıp Cümle Seçenekleri */}
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2.5 ml-1">
                ⚡ Çözüm Kalıpları (Seçmek için Tıklayın)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {RESOLUTION_TEMPLATES.map((tpl) => {
                  const isSelected = resolveSelectedTemplate?.id === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleSelectResolutionTemplate(tpl)}
                      className={`p-3 rounded-2xl text-left border transition-all flex items-start space-x-3 text-xs ${
                        isSelected
                          ? 'bg-blue-50/90 dark:bg-blue-950/50 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                          : 'bg-theme-bg border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <span className="text-xl shrink-0 mt-0.5">{tpl.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-black text-stone-800 dark:text-stone-200 truncate">{tpl.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                        </div>
                        <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                          {tpl.text}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Düzenlenebilir Mesaj */}
            <form onSubmit={handleSendResolution} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-xs font-black text-stone-400 uppercase tracking-widest">
                    ✏️ Gönderilecek Çözüm Mesajı (Düzenlenebilir)
                  </label>
                  {resolveSelectedTemplate && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${resolveSelectedTemplate.badgeBg}`}>
                      {resolveSelectedTemplate.emoji} {resolveSelectedTemplate.label}
                    </span>
                  )}
                </div>
                <textarea
                  rows={4}
                  required
                  value={resolveCustomNote}
                  onChange={(e) => setResolveCustomNote(e.target.value)}
                  placeholder="Hastaya iletilecek çözüm mesajını yazın..."
                  className="w-full p-4 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 leading-relaxed shadow-inner"
                />
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-1 ml-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Gönderildiğinde bu hasta "Bekleyen Dönüşler" listesinden otomatik olarak çıkarılacak.
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={!resolveCustomNote.trim()}
                  className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl text-xs shadow-clay-btn transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Çözümü Bildir &amp; Hastayı Bilgilendir</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResolveModalTarget(null)}
                  className="px-5 py-3.5 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold rounded-2xl text-xs transition"
                >
                  İptal
                </button>
              </div>
            </form>

          </div>
        </div>,
        document.body
      )}
      </>
      )}

    </Layout>
  );
};

export default AdminDashboard;

