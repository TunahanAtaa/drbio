import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon, Bell, User, CheckCircle2, Sparkles, AlertCircle, X, Trash2, MessageSquare, Star } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const initialNotifications = [
  {
    id: 1,
    title: 'Günlük Su Hatırlatıcısı',
    text: 'Böbrek sağlığınız için günlük su hedefinizi (2.5L) tamamlamayı unutmayın.',
    time: '1 saat önce',
    unread: true,
    type: 'HEALTH'
  },
  {
    id: 2,
    title: 'Hoş Geldiniz',
    text: 'Dr. Bio akıllı sağlık asistanına hoş geldiniz! Profil bilgilerinizi güncel tutarak daha isabetli yönlendirmeler alabilirsiniz.',
    time: '5 saat önce',
    unread: false,
    type: 'SYSTEM'
  }
];

const defaultAdminNotifications = [
  {
    id: 1001,
    title: '⚠️ Yeni Şikayet — Deniz Yıldız',
    text: 'Deniz Yıldız 1/5 yıldız verdi: "Son tahlilimde Ferritin seviyem kritik sınırda görünüyordu fakat bildirim gelmedi."',
    time: '5 dakika önce',
    unread: true,
    type: 'COMPLAINT'
  },
  {
    id: 1002,
    title: '⭐ Yeni Değerlendirme — Canan Arslan',
    text: 'Canan Arslan 4/5 yıldız verdi: "Tahlil sonuçlarımdaki referans dışı değerler kırmızı ile çok güzel vurgulanmış."',
    time: '15 dakika önce',
    unread: true,
    type: 'REVIEW'
  },
  {
    id: 1003,
    title: '⭐ Yeni Değerlendirme — Selin Tekin',
    text: 'Selin Tekin 5/5 yıldız verdi: "Glukoz ve HbA1c dalgalanmalarını Dr. Bio sayesinde saniyeler içinde anladım."',
    time: '1 saat önce',
    unread: false,
    type: 'REVIEW'
  }
];

const Navbar = ({ title, user }) => {
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const userEmail = (user?.email || '').toLowerCase();
  const isAdmin = (user?.role || '').toUpperCase() === 'ADMIN';

  const [notifications, setNotifications] = useState(() => {
    if (isAdmin) {
      const aSaved = localStorage.getItem('admin_notifications');
      if (aSaved) {
        try {
          const p = JSON.parse(aSaved);
          if (Array.isArray(p)) return p;
        } catch (e) {}
      }
      return defaultAdminNotifications;
    } else {
      const specificKey = `drbio_notif_${userEmail}`;
      const specificSaved = localStorage.getItem(specificKey);
      if (specificSaved) {
        try {
          const p = JSON.parse(specificSaved);
          if (Array.isArray(p)) return p;
        } catch (e) {}
      }
      return initialNotifications;
    }
  });

  useEffect(() => {
    if (isAdmin) {
      const aSaved = localStorage.getItem('admin_notifications');
      if (aSaved) {
        try {
          const p = JSON.parse(aSaved);
          if (Array.isArray(p)) setNotifications(p);
        } catch (e) {}
      } else {
        setNotifications(defaultAdminNotifications);
      }
    } else {
      const specificKey = `drbio_notif_${userEmail}`;
      const specificSaved = localStorage.getItem(specificKey);
      if (specificSaved) {
        try {
          const p = JSON.parse(specificSaved);
          if (Array.isArray(p)) setNotifications(p);
        } catch (e) {}
      } else {
        setNotifications(initialNotifications);
      }
    }
  }, [isNotificationsOpen, userEmail, isAdmin]);

  const dropdownRef = useRef(null);

  // Dışarıya tıklanınca bildirim menüsünü kapatma
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    if (isAdmin) {
      localStorage.setItem('admin_notifications', JSON.stringify([]));
    } else {
      localStorage.setItem(`drbio_notif_${userEmail}`, JSON.stringify([]));
      localStorage.setItem('userNotifications', JSON.stringify([]));
    }
  };

  const removeNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    if (isAdmin) {
      localStorage.setItem('admin_notifications', JSON.stringify(updated));
    } else {
      localStorage.setItem(`drbio_notif_${userEmail}`, JSON.stringify(updated));
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-theme-card rounded-3xl m-4 p-4 md:px-8 shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center justify-between z-30 relative">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-stone-800 dark:text-stone-200">{title}</h1>
        <p className="text-sm font-bold text-stone-400">
          Hoş geldin, <span className="text-lime-700 dark:text-lime-400">{user?.name || 'Kullanıcı'}</span>
        </p>
      </div>

      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Tema Değiştirici */}
        <ThemeToggle />

        {/* Bildirim Zili ve Dropdown Menüsü */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-3 bg-theme-bg rounded-2xl shadow-clay-card dark:shadow-clay-card-dark hover:scale-105 active:scale-95 transition-transform relative text-stone-600 dark:text-stone-300"
            aria-label="Bildirimler"
          >
            <Bell className="w-5 h-5 text-stone-500 dark:text-stone-300" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-lime-700 rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Açılır Bildirim Kutusu */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-theme-card rounded-[2rem] p-5 shadow-2xl border-theme-border z-50 animate-fade-in">
              <div className="flex justify-between items-center mb-4 border-b border-stone-200 dark:border-stone-800 pb-3">
                <div className="flex items-center space-x-2">
                  <h4 className="font-black text-stone-800 dark:text-stone-200 text-sm">Bildirimler</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-lime-700 text-white text-[10px] font-black rounded-full">
                      {unreadCount} Yeni
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAllNotifications}
                    className="text-xs text-lime-700 dark:text-lime-400 hover:underline font-bold"
                  >
                    Tümünü Okundu İşaretle ve Sil
                  </button>
                )}
              </div>

              {/* Bildirim Listesi */}
              {notifications.length > 0 ? (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 rounded-2xl text-xs relative group transition-all border ${notif.unread
                        ? 'bg-lime-50/80 dark:bg-lime-950/40 border-lime-200 dark:border-lime-900/50'
                        : 'bg-theme-bg border-stone-100 dark:border-stone-800/60 opacity-80'
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2 mb-1">
                          {notif.type === 'ANALYSIS' && <Sparkles className="w-4 h-4 text-lime-700 shrink-0" />}
                          {notif.type === 'HEALTH' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                          {notif.type === 'SYSTEM' && <AlertCircle className="w-4 h-4 text-blue-500 shrink-0" />}
                          {notif.type === 'COMPLAINT' && <MessageSquare className="w-4 h-4 text-lime-700 shrink-0 animate-pulse" />}
                          {notif.type === 'REVIEW' && <Star className="w-4 h-4 text-amber-500 shrink-0" />}
                          <h5 className="font-black text-stone-800 dark:text-stone-200 text-xs">{notif.title}</h5>
                        </div>

                        <button
                          onClick={() => removeNotification(notif.id)}
                          className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-lime-700 transition"
                          title="Sil"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="font-medium text-stone-600 dark:text-stone-300 leading-relaxed pl-6">
                        {notif.text}
                      </p>
                      <span className="text-[10px] text-stone-400 font-bold mt-2 block pl-6">
                        {notif.time}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-stone-400 font-bold text-xs">
                  Henüz bildiriminiz bulunmamaktadır.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Çıkış Yap */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 md:px-5 py-3 rounded-2xl font-black text-white bg-lime-700 hover:bg-lime-800 shadow-clay-btn hover:brightness-110 active:shadow-none active:scale-95 transition-all text-xs sm:text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Çıkış Yap</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;

