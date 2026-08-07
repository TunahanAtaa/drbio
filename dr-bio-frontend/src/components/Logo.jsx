import React from 'react';
import { HeartPulse } from 'lucide-react';

const Logo = ({ 
  size = 'md', // 'sm', 'md', 'lg'
  showSubtitle = true,
  className = '' 
}) => {
  const sizeMap = {
    sm: {
      box: 'w-8 h-8 rounded-xl',
      icon: 'w-4 h-4',
      title: 'text-lg',
      subtitle: 'text-[8px]',
    },
    md: {
      box: 'w-11 h-11 rounded-2xl',
      icon: 'w-6 h-6',
      title: 'text-2xl',
      subtitle: 'text-[10px]',
    },
    lg: {
      box: 'w-16 h-16 rounded-[1.25rem]',
      icon: 'w-9 h-9',
      title: 'text-3xl',
      subtitle: 'text-[11px]',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center space-x-3 ${className}`.trim()}>
      <div className={`${currentSize.box} bg-red-600 shadow-clay-btn flex items-center justify-center text-white shrink-0`}>
        <HeartPulse className={`${currentSize.icon} text-white stroke-[2.5]`} />
      </div>
      <div>
        <h2 className={`${currentSize.title} font-black text-red-600 dark:text-red-400 tracking-tight leading-none`}>
          Dr. Bio
        </h2>
        {showSubtitle && (
          <span className={`${currentSize.subtitle} font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase block mt-0.5`}>
            AKILLI SAĞLIK PANELİ
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
