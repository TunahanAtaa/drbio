import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon, Bell, User } from 'lucide-react';

const Navbar = ({ title, user }) => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="bg-theme-card rounded-3xl m-4 p-4 md:px-8 shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-center justify-between z-10 relative">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-stone-800 dark:text-stone-200">{title}</h1>
        <p className="text-sm font-bold text-stone-400">
          Hoş geldin, <span className="text-red-600">{user?.name || 'Kullanıcı'}</span>
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-3 bg-theme-bg rounded-2xl shadow-clay-card dark:shadow-clay-card-dark hover:scale-105 active:scale-95 transition-transform"
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-stone-500" />}
        </button>

        {/* Notifications */}
        <button className="p-3 bg-theme-bg rounded-2xl shadow-clay-card dark:shadow-clay-card-dark hover:scale-105 active:scale-95 transition-transform relative">
          <Bell className="w-5 h-5 text-stone-500" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 rounded-full"></span>
        </button>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-white bg-red-600 shadow-clay-btn hover:brightness-110 active:shadow-none active:scale-95 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Çıkış Yap</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
