import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, Database, Upload, FileText, User } from 'lucide-react';

const Sidebar = ({ role }) => {
  const location = useLocation();

  const getLinks = () => {
    switch(role) {
      case 'ADMIN':
        return [
          { name: 'Ana Sayfa', path: '/admin', icon: Home },
          { name: 'Kullanıcılar', path: '/admin/users', icon: Users },
          { name: 'Referans Kütüphanesi', path: '/admin/references', icon: Database },
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

  return (
    <aside className="w-64 min-h-[calc(100vh-2rem)] bg-theme-card rounded-3xl m-4 p-6 shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex-col hidden lg:flex">
      <div className="flex items-center space-x-3 mb-10 pl-2">
        <div className="w-10 h-10 bg-red-600 rounded-xl shadow-clay-btn flex items-center justify-center text-white font-black text-xl">
          D
        </div>
        <h2 className="text-2xl font-black text-red-700 dark:text-red-600 tracking-tight">Dr. Bio</h2>
      </div>

      <nav className="flex-1 space-y-3">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path || (link.path !== `/${role.toLowerCase()}` && location.pathname.startsWith(link.path));

          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3.5 rounded-3xl font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-red-600 text-white shadow-clay-btn'
                  : 'text-stone-500 hover:text-red-700 hover:bg-[#fcfbfa] dark:hover:bg-[#181514] active:shadow-clay-btn dark:active:shadow-clay-btn'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-red-600/70'}`} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
