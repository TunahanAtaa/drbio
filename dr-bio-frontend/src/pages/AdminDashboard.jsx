import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  Database, Users, Activity, MessageSquare, AlertTriangle, 
  RotateCcw, Loader2 
} from 'lucide-react';
import api from '../services/api';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';

import AdminOverviewTab from './admin/AdminOverviewTab';
import AdminReferencesTab from './admin/AdminReferencesTab';
import AdminUsersTab from './admin/AdminUsersTab';
import AdminFeedbacksTab from './admin/AdminFeedbacksTab';
import AdminAgendaTab from './admin/AdminAgendaTab';

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
    category: 'ŞİKAYET / ÖNERİ' 
  },
  { 
    id: 6, 
    userName: 'Aylin Çelik', 
    userEmail: 'aylin.celik@gmail.com', 
    rating: 5, 
    comment: 'Vitamin D eksikliğimi Dr. Bio raporundan fark edip takviyeye başladım. Sağlık takibi için her evde bulunması gereken harika bir uygulama.', 
    date: '2026-08-03', 
    status: 'UNREAD', 
    category: 'MEMNUNİYET' 
  }
];

const defaultAdminUsers = [
  {
    id: 'u1',
    name: 'Sistem Yöneticisi',
    email: 'admin@drbio.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    regDate: '2026-01-01',
    healthProfile: { age: '40', height: '180', weight: '78', gender: 'MALE' }
  },
  {
    id: 'u2',
    name: 'Test Hastası',
    email: 'hasta@drbio.com',
    role: 'PATIENT',
    status: 'ACTIVE',
    regDate: '2026-02-15',
    healthProfile: { age: '28', height: '168', weight: '58', gender: 'FEMALE' }
  },
  {
    id: 'u3',
    name: 'Burak Öztürk',
    email: 'burak.ozturk@yahoo.com',
    role: 'PATIENT',
    status: 'ACTIVE',
    regDate: '2026-03-10',
    healthProfile: { age: '35', height: '176', weight: '82', gender: 'MALE' }
  },
  {
    id: 'u4',
    name: 'Canan Arslan',
    email: 'canan.arslan@outlook.com',
    role: 'PATIENT',
    status: 'ACTIVE',
    regDate: '2026-04-05',
    healthProfile: { age: '31', height: '162', weight: '54', gender: 'FEMALE' }
  },
  {
    id: 'u5',
    name: 'Deniz Yıldız',
    email: 'deniz.yildiz@gmail.com',
    role: 'PATIENT',
    status: 'ACTIVE',
    regDate: '2026-05-12',
    healthProfile: { age: '24', height: '182', weight: '74', gender: 'MALE' }
  },
  {
    id: 'u6',
    name: 'Selin Tekin',
    email: 'selin.tekin@icloud.com',
    role: 'PATIENT',
    status: 'ACTIVE',
    regDate: '2026-06-20',
    healthProfile: { age: '29', height: '170', weight: '60', gender: 'FEMALE' }
  }
];

const defaultReferences = [
  { id: '1', name: 'Hemoglobin (HGB)', min: 13.5, max: 17.5, unit: 'g/dL', category: 'Kan Sayımı', text: 'Anemi veya polistemi riski değerlendirilmeli.' },
  { id: '2', name: 'Glukoz (Açlık)', min: 70, max: 99, unit: 'mg/dL', category: 'Biyokimya', text: 'Diyabet veya hipoglisemi durumları takip edilmeli.' },
  { id: '3', name: 'Vitamin B12', min: 200, max: 900, unit: 'pg/mL', category: 'Vitamin', text: 'Nörolojik sağlık ve alyuvar üretimi için kritik seviyeler.' },
  { id: '4', name: 'ALT (Alanin Aminotransferaz)', min: 7, max: 56, unit: 'U/L', category: 'Karaciğer', text: 'Karaciğer enzimleri ve yağlanma durumu incelenmeli.' },
  { id: '5', name: 'TSH', min: 0.4, max: 4.0, unit: 'mUI/L', category: 'Hormon', text: 'Tiroit bezi fonksiyonları değerlendirilmeli.' }
];

const getGenderStyles = (gender) => {
  switch (gender) {
    case 'MALE':
    case 'ERKEK':
      return {
        badgeBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
        avatarBg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
        label: 'Erkek'
      };
    case 'FEMALE':
    case 'KADIN':
      return {
        badgeBg: 'bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300',
        avatarBg: 'bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400',
        label: 'Kadın'
      };
    default:
      return {
        badgeBg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300',
        avatarBg: 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
        label: 'Belirtilmedi'
      };
  }
};

const MESSAGE_TEMPLATES = [
  { 
    id: 'received', 
    emoji: '📬', 
    title: 'Şikayet & İnceleme Alındı', 
    text: 'Geri bildiriminiz ve ilettiğiniz durum yönetim ekibimiz tarafından incelemeye alınmıştır. Süreçle ilgili en kısa sürede bilgilendirileceksiniz.' 
  },
  { 
    id: 'investigating', 
    emoji: '🔍', 
    title: 'Detaylı İnceleme Başlatıldı', 
    text: 'İlettiğiniz teknik konu yazılım ve medikal ekibimize aktarılmış olup detaylı inceleme başlatılmıştır. Anlayışınız için teşekkür ederiz.' 
  },
  { 
    id: 'will_contact', 
    emoji: '📞', 
    title: 'Temsilci İletişime Geçecek', 
    text: 'Görüşünüz değerlendirilmiştir. Müşteri temsilcimiz detayları görüşmek üzere kayıtlı e-posta/telefon adresiniz üzerinden sizinle iletişime geçecektir.' 
  },
  { 
    id: 'thankyou', 
    emoji: '🙏', 
    title: 'Teşekkür & Değerlendirme', 
    text: 'Görüşleriniz ve değerli vaktinizi ayırıp bildirimde bulunduğunuz için Dr. Bio ailesi olarak çok teşekkür ederiz.' 
  },
  { 
    id: 'praise', 
    emoji: '⭐', 
    title: 'Memnuniyet Teşekkürü', 
    text: 'Güzel ve nazik yorumlarınız için çok teşekkür ederiz! Yorumlarınız ve memnuniyetiniz bizlere ilham veriyor. Sağlıklı günler dileriz.' 
  }
];

const RESOLUTION_TEMPLATES = [
  { 
    id: 'resolved', 
    emoji: '✅', 
    title: 'Sorun Çözüme Ulaştırıldı', 
    text: 'Bildirmiş olduğunuz konu ekibimiz tarafından detaylıca incelenmiş ve başarıyla çözüme ulaştırılmıştır. İlginize teşekkür ederiz.' 
  },
  { 
    id: 'fixed_bug', 
    emoji: '🛠️', 
    title: 'Sistem Uyumsuzluğu Düzeltildi', 
    text: 'Tahlil yükleme / görüntüleme esnasında karşılaştığınız aksaklık giderilmiş ve sistem güncellemesi yayınlanmıştır. Tekrar deneyebilirsiniz.' 
  },
  { 
    id: 'update_done', 
    emoji: '🔄', 
    title: 'Geliştirme & Güncelleme Tamamlandı', 
    text: 'Öneriniz doğrultusunda ilgili alanda iyileştirme yapılmıştır. Değerli katkılarınız için Dr. Bio olarak teşekkür ederiz.' 
  },
  { 
    id: 'apology', 
    emoji: '🤝', 
    title: 'Telafi & Özür Mesajı', 
    text: 'Yaşanan gecikme/aksaklık nedeniyle özür dileriz. Talebiniz sonuçlandırılmış olup gerekli tüm önlemler alınmıştır.' 
  }
];

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
        
        if (usersRes.data && Array.isArray(usersRes.data)) {
          setUsersList(usersRes.data);
        }

        if (refsRes.data && Array.isArray(refsRes.data)) {
          const mappedRefs = refsRes.data.map(r => ({
            id: r.id,
            name: r.parameterName || '',
            min: r.minValue || '',
            max: r.maxValue || '',
            unit: r.unit || '',
            category: 'Biyokimya',
            text: r.lowRecommendation || r.normalRecommendation || ''
          }));
          setReferences(mappedRefs);
        }

        setTotalReports(reportsRes.data && Array.isArray(reportsRes.data) ? reportsRes.data.length : 0);
      } catch (err) {
        console.warn('Backend verileri çekilemedi veya yetki yetersiz, demo veriler ile devam ediliyor:', err);
        setUsersList(defaultAdminUsers);
        setReferences(defaultReferences);
        setTotalReports(142);
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
    name: '',
    min: '',
    max: '',
    unit: '',
    category: 'Kan Sayımı',
    text: ''
  });

  const handleOpenRefModal = (ref = null) => {
    if (ref) {
      setEditingRef(ref);
      setRefFormData({
        name: ref.name || '',
        min: ref.min || '',
        max: ref.max || '',
        unit: ref.unit || '',
        category: ref.category || 'Kan Sayımı',
        text: ref.text || ''
      });
    } else {
      setEditingRef(null);
      setRefFormData({
        name: '',
        min: '',
        max: '',
        unit: '',
        category: 'Kan Sayımı',
        text: ''
      });
    }
    setRefModalOpen(true);
  };

  const handleSaveRef = async (e) => {
    e.preventDefault();
    try {
      if (editingRef) {
        await api.put(`/reference-values/${editingRef.id}`, refFormData);
      } else {
        await api.post('/reference-values', refFormData);
      }
      const res = await api.get('/reference-values');
      setReferences(res.data);
    } catch (err) {
      console.warn('Backend güncelleme başarısız, yerel state güncelleniyor:', err);
      if (editingRef) {
        setReferences(references.map(r => r.id === editingRef.id ? { ...r, ...refFormData } : r));
      } else {
        const newRef = { id: String(Date.now()), ...refFormData };
        setReferences([...references, newRef]);
      }
    }
    setRefModalOpen(false);
  };

  const handleDeleteRef = async (id) => {
    if (window.confirm('Bu referans parametresini silmek istediğinize emin misiniz?')) {
      try {
        await api.delete(`/reference-values/${id}`);
        const res = await api.get('/reference-values');
        setReferences(res.data);
      } catch (err) {
        console.warn('Backend silme başarısız, yerel state güncelleniyor:', err);
        setReferences(references.filter(r => r.id !== id));
      }
    }
  };

  // Kullanıcı State'leri
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [newUserFormData, setNewUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PATIENT'
  });

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUserFormData.name || !newUserFormData.email) return;

    const newUser = {
      id: `u_${Date.now()}`,
      name: newUserFormData.name,
      email: newUserFormData.email,
      role: newUserFormData.role,
      status: 'ACTIVE',
      regDate: new Date().toISOString().split('T')[0],
      healthProfile: { age: '25', height: '175', weight: '70', gender: 'BELİRTİLMEDİ' }
    };

    const updatedUsers = [newUser, ...usersList];
    setUsersList(updatedUsers);

    let userAccounts = [];
    const saved = localStorage.getItem('userAccounts');
    if (saved) {
      try { userAccounts = JSON.parse(saved); } catch (err) {}
    }
    userAccounts.push({
      email: newUserFormData.email,
      password: newUserFormData.password || '123456',
      name: newUserFormData.name,
      role: newUserFormData.role
    });
    localStorage.setItem('userAccounts', JSON.stringify(userAccounts));

    setUserModalOpen(false);
    setNewUserFormData({ name: '', email: '', password: '', role: 'PATIENT' });
  };

  const toggleUserStatus = (id) => {
    setUsersList(usersList.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'PASSIVE' : 'ACTIVE' } : u));
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`${userName} kullanıcısını silmek istediğinize emin misiniz?`)) {
      try {
        await api.delete(`/users/${userId}`);
        const usersRes = await api.get('/users');
        if (usersRes.data && Array.isArray(usersRes.data)) {
          setUsersList(usersRes.data);
          return;
        }
      } catch (err) {
        console.warn('Backend yanıtı veremedi, yerel state güncellendi:', err);
      }
      setUsersList(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      const usersRes = await api.get('/users');
      if (usersRes.data && Array.isArray(usersRes.data)) {
        setUsersList(usersRes.data);
        return;
      }
    } catch (err) {
      console.warn('Backend yanıtı veremedi, yerel state güncellendi:', err);
    }
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  // Geri Bildirimler State'leri
  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem('drbio_feedbacks');
    if (saved) {
      try { const parsed = JSON.parse(saved); if (Array.isArray(parsed)) return parsed; } catch (e) {}
    }
    return defaultFeedbacks;
  });

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

  const [feedbackLastAction, setFeedbackLastAction] = useState(() => {
    const saved = localStorage.getItem('drbio_last_action');
    if (saved) { try { const p = JSON.parse(saved); if (typeof p === 'object') return p; } catch(e) {} }
    return {};
  });

  const [ackToast, setAckToast] = useState('');
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [starFilter, setStarFilter] = useState('ALL');
  const [feedbackSubTab, setFeedbackSubTab] = useState('all');

  const [ackModalTarget, setAckModalTarget] = useState(null);
  const [ackSelectedTemplate, setAckSelectedTemplate] = useState(null);
  const [ackCustomNote, setAckCustomNote] = useState('');

  const [resolveModalTarget, setResolveModalTarget] = useState(null);
  const [resolveSelectedTemplate, setResolveSelectedTemplate] = useState(null);
  const [resolveCustomNote, setResolveCustomNote] = useState('');

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

      setAcknowledgedIds(prev => {
        const updated = [...prev, id];
        localStorage.setItem('drbio_acknowledged_ids', JSON.stringify(updated));
        return updated;
      });

      setAckToast(`"${target.userName}" incelendi olarak işaretlendi.`);
      setTimeout(() => setAckToast(''), 4000);
    }
  };

  const openAckModal = (item) => {
    setAckModalTarget(item);
    const defaultTpl = (item.rating || 5) <= 3 ? MESSAGE_TEMPLATES[0] : MESSAGE_TEMPLATES[3];
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
    const newNotif = { id: Date.now(), title, text: finalText, time: 'Az önce', unread: true, type: 'SYSTEM' };
    localStorage.setItem(notifKey, JSON.stringify([newNotif, ...notifs]));

    const newList = safeFeedbacks.map(f => f.id === item.id ? { ...f, status: 'REVIEWED' } : f);
    setFeedbacks(newList);
    localStorage.setItem('drbio_feedbacks', JSON.stringify(newList));

    const newAcked = [...acknowledgedIds, item.id];
    setAcknowledgedIds(newAcked);
    localStorage.setItem('drbio_acknowledged_ids', JSON.stringify(newAcked));

    const PENDING_TRIGGER_IDS = ['received', 'investigating', 'will_contact'];

    const newLastAction = { ...feedbackLastAction, [item.id]: ackSelectedTemplate?.id || 'custom' };
    setFeedbackLastAction(newLastAction);
    localStorage.setItem('drbio_last_action', JSON.stringify(newLastAction));

    if (PENDING_TRIGGER_IDS.includes(ackSelectedTemplate?.id)) {
      if (!contactPendingIds.includes(item.id)) {
        const newPending = [...contactPendingIds, item.id];
        setContactPendingIds(newPending);
        localStorage.setItem('drbio_contact_pending_ids', JSON.stringify(newPending));
      }
    }

    setAckModalTarget(null);
    setAckToast(`"${item.userName}" kullanıcısına bildirim gönderildi!`);
    setTimeout(() => setAckToast(''), 4000);
  };

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
    const title = resolveSelectedTemplate ? `${resolveSelectedTemplate.emoji} ${resolveSelectedTemplate.title}` : '✅ Dr. Bio — Talebiniz Yanıtlandı';
    const finalText = resolveCustomNote.trim();

    const userEmail = (item.userEmail || '').toLowerCase();
    const notifKey = `drbio_notif_${userEmail}`;
    let notifs = [];
    const savedN = localStorage.getItem(notifKey);
    if (savedN) { try { const p = JSON.parse(savedN); if (Array.isArray(p)) notifs = p; } catch(e) {} }
    const newNotif = { id: Date.now(), title, text: finalText, time: 'Az önce', unread: true, type: 'SYSTEM' };
    localStorage.setItem(notifKey, JSON.stringify([newNotif, ...notifs]));

    const newList = safeFeedbacks.map(f => f.id === item.id ? { ...f, status: 'REVIEWED' } : f);
    setFeedbacks(newList);
    localStorage.setItem('drbio_feedbacks', JSON.stringify(newList));

    const newPending = contactPendingIds.filter(id => id !== item.id);
    setContactPendingIds(newPending);
    localStorage.setItem('drbio_contact_pending_ids', JSON.stringify(newPending));

    const newLastAction = { ...feedbackLastAction, [item.id]: resolveSelectedTemplate?.id || 'resolved' };
    setFeedbackLastAction(newLastAction);
    localStorage.setItem('drbio_last_action', JSON.stringify(newLastAction));

    setResolveModalTarget(null);
    setAckToast(`"${item.userName}" adlı hastaya çözüm mesajı iletildi!`);
    setTimeout(() => setAckToast(''), 4000);
  };

  const handleResetAllData = () => {
    localStorage.removeItem('drbio_feedbacks');
    localStorage.removeItem('drbio_acknowledged_ids');
    localStorage.removeItem('drbio_contact_pending_ids');
    localStorage.removeItem('drbio_last_action');
    localStorage.removeItem('userAccounts');
    setFeedbacks(defaultFeedbacks);
    setUsersList([]);
    setAcknowledgedIds([]);
    setContactPendingIds([]);
    setFeedbackLastAction({});
    setAckToast('Tüm eski veriler temizlendi ve taze test kullanıcıları yüklendi! 🔄');
    setTimeout(() => setAckToast(''), 4000);
  };

  // Filtrelenmiş geri bildirimler
  const filteredFeedbacks = safeFeedbacks.filter(f => {
    if (!f) return false;

    if (feedbackSubTab === 'all') {
      if (acknowledgedIds.includes(f.id) || contactPendingIds.includes(f.id)) return false;
    }
    if (feedbackSubTab === 'complaints') {
      if ((f.rating || 0) > 3) return false;
      if (acknowledgedIds.includes(f.id) || contactPendingIds.includes(f.id)) return false;
    }
    if (feedbackSubTab === 'pending_contact' && !contactPendingIds.includes(f.id)) return false;
    if (feedbackSubTab === 'responded' && !acknowledgedIds.includes(f.id)) return false;

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

  const getProcessNote = (feedbackId) => {
    const lastAction = feedbackLastAction[feedbackId];
    const MAP = {
      'received':      { emoji: '📬', text: 'Şikayet alındı, yanıt bekleniyor',   color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900' },
      'investigating': { emoji: '🔍', text: 'İnceleme başlatıldı',                  color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900' },
      'will_contact':  { emoji: '📞', text: 'Temsilci en kısa sürede ulaşacak',  color: 'text-rose-600 dark:text-rose-400',     bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900' },
    };
    return MAP[lastAction] || { emoji: '⏳', text: 'Görüş bildirildi, inceleme bekleniyor', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900' };
  };

  const getRespondedNote = (feedbackId) => {
    const lastAction = feedbackLastAction[feedbackId];
    const MAP = {
      'received':      { emoji: '📬', text: 'Şikayet alındı mesajı gönderildi',          color: 'text-amber-700 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900' },
      'investigating': { emoji: '🔍', text: 'İnceleme başlatıldı bilgisi verildi',       color: 'text-blue-700 dark:text-blue-400',     bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900' },
      'will_contact':  { emoji: '📞', text: 'Temsilci iletişim bilgisi gönderildi',   color: 'text-rose-700 dark:text-rose-400',     bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900' },
      'thankyou':      { emoji: '🙏', text: 'Teşekkür mesajı gönderildi',              color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900' },
      'praise':        { emoji: '⭐', text: 'Güzel yorum teşekkür mesajı gönderildi',  color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900' },
      'resolved':      { emoji: '✅', text: 'Çözüme ulaştırıldı mesajı gönderildi',    color: 'text-lime-800 dark:text-lime-400',     bg: 'bg-lime-50 dark:bg-lime-950/30 border-lime-200 dark:border-lime-900' },
    };
    return MAP[lastAction] || { emoji: '💬', text: 'Özel yanıt gönderildi', color: 'text-stone-700 dark:text-stone-400', bg: 'bg-stone-50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800' };
  };

  const unhandledFeedbacksCount = safeFeedbacks.filter(f =>
    f && !acknowledgedIds.includes(f.id) && !contactPendingIds.includes(f.id)
  ).length;

  const complaintCount = safeFeedbacks.filter(f =>
    f && (f.rating || 0) <= 3 && !acknowledgedIds.includes(f.id) && !contactPendingIds.includes(f.id)
  ).length;

  const respondedCount = safeFeedbacks.filter(f =>
    f && acknowledgedIds.includes(f.id)
  ).length;

  const avgRating = safeFeedbacks.length > 0 
    ? (safeFeedbacks.reduce((acc, curr) => acc + ((curr && curr.rating) || 5), 0) / safeFeedbacks.length).toFixed(1)
    : '5.0';
  const satisfiedCount = safeFeedbacks.filter(f => f && (f.rating || 0) >= 4).length;

  const filteredReferences = references.filter(r => 
    r.name.toLowerCase().includes(refSearch.toLowerCase()) || 
    r.category.toLowerCase().includes(refSearch.toLowerCase())
  );

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
          title="Tüm kullanıcı ve geri bildirim verilerini sıfırla"
          className="px-4 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold rounded-2xl text-xs transition flex items-center space-x-2 shadow-clay-btn shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
          <span>Verileri Sıfırla & Yenile</span>
        </button>
      </div>

      {ackToast && (
        <Alert variant="success" className="mb-6">
          {ackToast}
        </Alert>
      )}

      {loadingData && (
        <div className="w-full flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      )}

      {errorData && (
        <Alert variant="error" className="mb-6 flex flex-col md:flex-row justify-between gap-4">
          <span>{errorData}</span>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              localStorage.removeItem('user');
              navigate('/');
            }}
          >
            Admin Giriş Sayfasına Git
          </Button>
        </Alert>
      )}

      {!loadingData && !errorData && (
        <>
          {(currentTab === 'dashboard' || currentTab === 'admin') && (
            <AdminOverviewTab
              usersList={usersList}
              totalReports={totalReports}
              references={references}
              safeFeedbacks={safeFeedbacks}
              setFeedbackSubTab={setFeedbackSubTab}
              navigate={navigate}
            />
          )}

          {currentTab === 'references' && (
            <AdminReferencesTab
              filteredReferences={filteredReferences}
              refSearch={refSearch}
              setRefSearch={setRefSearch}
              handleOpenRefModal={handleOpenRefModal}
              handleDeleteRef={handleDeleteRef}
              refModalOpen={refModalOpen}
              setRefModalOpen={setRefModalOpen}
              editingRef={editingRef}
              refFormData={refFormData}
              setRefFormData={setRefFormData}
              handleSaveRef={handleSaveRef}
            />
          )}

          {currentTab === 'users' && (
            <AdminUsersTab
              filteredUsers={filteredUsers}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              toggleUserStatus={toggleUserStatus}
              handleDeleteUser={handleDeleteUser}
              handleChangeRole={handleChangeRole}
              selectedUserDetail={selectedUserDetail}
              setSelectedUserDetail={setSelectedUserDetail}
              getGenderStyles={getGenderStyles}
              userModalOpen={userModalOpen}
              setUserModalOpen={setUserModalOpen}
              newUserFormData={newUserFormData}
              setNewUserFormData={setNewUserFormData}
              handleAddUserSubmit={handleAddUserSubmit}
            />
          )}

          {currentTab === 'feedbacks' && (
            <AdminFeedbacksTab
              safeFeedbacks={safeFeedbacks}
              avgRating={avgRating}
              satisfiedCount={satisfiedCount}
              complaintCount={complaintCount}
              respondedCount={respondedCount}
              unhandledFeedbacksCount={unhandledFeedbacksCount}
              feedbackSearch={feedbackSearch}
              setFeedbackSearch={setFeedbackSearch}
              starFilter={starFilter}
              setStarFilter={setStarFilter}
              feedbackSubTab={feedbackSubTab}
              setFeedbackSubTab={setFeedbackSubTab}
              filteredFeedbacks={filteredFeedbacks}
              contactPendingIds={contactPendingIds}
              acknowledgedIds={acknowledgedIds}
              feedbackLastAction={feedbackLastAction}
              usersList={usersList}
              getGenderStyles={getGenderStyles}
              getProcessNote={getProcessNote}
              getRespondedNote={getRespondedNote}
              handleDeleteFeedback={handleDeleteFeedback}
              toggleFeedbackStatus={toggleFeedbackStatus}
              openAckModal={openAckModal}
              openResolveModal={openResolveModal}
              ackModalTarget={ackModalTarget}
              setAckModalTarget={setAckModalTarget}
              ackSelectedTemplate={ackSelectedTemplate}
              ackCustomNote={ackCustomNote}
              setAckCustomNote={setAckCustomNote}
              MESSAGE_TEMPLATES={MESSAGE_TEMPLATES}
              handleSelectTemplate={handleSelectTemplate}
              handleSendAcknowledgement={handleSendAcknowledgement}
              resolveModalTarget={resolveModalTarget}
              setResolveModalTarget={setResolveModalTarget}
              resolveSelectedTemplate={resolveSelectedTemplate}
              resolveCustomNote={resolveCustomNote}
              setResolveCustomNote={setResolveCustomNote}
              RESOLUTION_TEMPLATES={RESOLUTION_TEMPLATES}
              handleSelectResolutionTemplate={handleSelectResolutionTemplate}
              handleSendResolution={handleSendResolution}
            />
          )}

          {currentTab === 'agenda' && (
            <AdminAgendaTab />
          )}
        </>
      )}
    </Layout>
  );
};

export default AdminDashboard;
