import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, Database, Upload, FileText, User, MessageSquare } from 'lucide-react';

const Sidebar = ({ role = 'PATIENT' }) => {
  const location = useLocation();

  const getLinks = () => {
    switch(role) {
      case 'ADMIN':
        return [
          { name: 'Ana Sayfa', path: '/admin', icon: Home },
          { name: 'Kullanıcılar', path: '/admin/users', icon: Users },
          { name: 'Referans Kütüphanesi', path: '/admin/references', icon: Database },
          { name: 'Geri Bildirimler', path: '/admin/feedbacks', icon: MessageSquare },
        ];
      case 'PATIENT':
        return [
          { name: 'Ana Sayfa', path: '/patient', icon: Home },
          { name: 'Tahlil Yükle', path: '/patient/upload', icon: Upload },
          { name: 'Geçmiş Tahlillerim', path: '/patient/history', icon: FileText },
          { name: 'Profilim', path: '/patient/profile', icon: User },
        ];
      default: return [];
    }
  };

  const links = getLinks();
  const safeRoleLower = (role || 'patient').toLowerCase();

  return (
    <aside className="w-64 min-h-[calc(100vh-2rem)] bg-theme-card rounded-2xl m-4 p-6 shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex-col hidden lg:flex">
      <div className="flex items-center space-x-3 mb-10 pl-2">
        <div className="w-10 h-10 bg-red-600 rounded-xl shadow-clay-btn flex items-center justify-center text-white font-black text-xl">
          D
        </div>
        <div>
          <h2 className="text-2xl font-black text-red-600 dark:text-red-400 tracking-tight">Dr. Bio</h2>
          <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block -mt-1">Akıllı Sağlık Paneli</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
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
                  : 'text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-red-600 dark:text-red-400'}`} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
