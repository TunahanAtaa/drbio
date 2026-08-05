import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '' }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initial theme check
    setIsDark(document.documentElement.classList.contains('dark'));

    // Optional: listen to theme changes from other tabs/instances if needed
    const handleStorage = (e) => {
      if (e.key === 'theme') {
        const newIsDark = e.newValue === 'dark';
        setIsDark(newIsDark);
        if (newIsDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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

  return (
    <button 
      onClick={toggleTheme}
      aria-label="Tema Değiştir"
      className={`p-3 bg-theme-bg rounded-2xl shadow-clay-card dark:shadow-clay-card-dark hover:scale-105 active:scale-95 transition-transform text-stone-600 dark:text-stone-300 ${className}`}
    >
      {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-stone-500" />}
    </button>
  );
};

export default ThemeToggle;
