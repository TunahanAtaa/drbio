import React from 'react';
import { Activity, Beaker, HeartPulse, ShieldAlert, Droplets, TrendingUp, TrendingDown, ClipboardList } from 'lucide-react';

const decorativeCards = [
  {
    id: 1,
    type: 'standard',
    title: 'Hemoglobin',
    value: '13.8 g/dL',
    status: 'Normal',
    icon: Droplets,
    color: 'text-red-500',
    position: 'top-[12%] left-[8%]',
    delay: '0s',
    duration: '24s',
    rotation: '-rotate-3',
    scale: 'scale-100',
    hideOnMobile: true
  },
  {
    id: 2,
    type: 'trend',
    title: 'Vitamin B12',
    value: '420',
    unit: 'pg/mL',
    status: 'Normal',
    trend: 'up',
    icon: Activity,
    color: 'text-blue-500',
    position: 'top-[20%] right-[10%]',
    delay: '2s',
    duration: '28s',
    rotation: 'rotate-2',
    scale: 'scale-95',
    hideOnMobile: false
  },
  {
    id: 3,
    type: 'score',
    title: 'Health Score',
    value: '94',
    status: 'Excellent',
    icon: ShieldAlert,
    color: 'text-emerald-500',
    position: 'bottom-[25%] left-[6%]',
    delay: '4s',
    duration: '22s',
    rotation: 'rotate-6',
    scale: 'scale-105',
    hideOnMobile: false
  },
  {
    id: 4,
    type: 'report',
    title: 'Biyokimya Raporu',
    value: 'Hazır',
    date: '12 Eyl 2026',
    icon: ClipboardList,
    color: 'text-purple-500',
    position: 'top-[50%] left-[2%]',
    delay: '1s',
    duration: '32s',
    rotation: '-rotate-2',
    scale: 'scale-90',
    hideOnMobile: true
  },
  {
    id: 5,
    type: 'trend',
    title: 'Vitamin D',
    value: '28',
    unit: 'ng/mL',
    status: 'Düşük',
    trend: 'down',
    icon: HeartPulse,
    color: 'text-amber-500',
    position: 'bottom-[20%] right-[8%]',
    delay: '3s',
    duration: '26s',
    rotation: '-rotate-6',
    scale: 'scale-110',
    hideOnMobile: true
  },
  {
    id: 6,
    type: 'standard',
    title: 'Cholesterol',
    value: '185 mg/dL',
    status: 'Normal',
    icon: Activity,
    color: 'text-cyan-500',
    position: 'top-[55%] right-[2%]',
    delay: '5s',
    duration: '35s',
    rotation: 'rotate-3',
    scale: 'scale-95',
    hideOnMobile: true
  }
];

const AuthBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-theme-bg">
      {/* Ambient Blobs (Animations removed for performance) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-300/20 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
      <div className="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] bg-emerald-300/20 dark:bg-emerald-900/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[45rem] h-[45rem] bg-purple-300/20 dark:bg-purple-900/10 rounded-full blur-3xl"></div>

      {/* SVG Network Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20">
        <defs>
          <linearGradient id="line-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        <g className="text-stone-400 dark:text-stone-600 stroke-current">
          {/* Hemo -> B12 */}
          <line x1="15%" y1="18%" x2="85%" y2="25%" strokeWidth="1" stroke="url(#line-grad-1)" strokeDasharray="4 4" />
          {/* B12 -> Cholesterol */}
          <line x1="85%" y1="25%" x2="95%" y2="60%" strokeWidth="1" stroke="url(#line-grad-1)" />
          {/* Hemo -> Rapor */}
          <line x1="15%" y1="18%" x2="8%" y2="55%" strokeWidth="1" stroke="url(#line-grad-1)" />
          {/* Rapor -> Health Score */}
          <line x1="8%" y1="55%" x2="12%" y2="70%" strokeWidth="1" stroke="url(#line-grad-1)" strokeDasharray="2 6" />
          {/* Health Score -> Vit D */}
          <line x1="12%" y1="70%" x2="88%" y2="75%" strokeWidth="1" stroke="url(#line-grad-1)" />
          {/* Cholesterol -> Vit D */}
          <line x1="95%" y1="60%" x2="88%" y2="75%" strokeWidth="1" stroke="url(#line-grad-1)" strokeDasharray="4 4" />
        </g>
      </svg>

      {/* Floating Cards */}
      {decorativeCards.map((card) => (
        <div
          key={card.id}
          className={`absolute ${card.position} ${card.hideOnMobile ? 'hidden md:block' : 'block'}`}
          // Animation removed for performance
        >
          <div className={`${card.rotation} ${card.scale} flex flex-col bg-theme-card/70 dark:bg-theme-card/40 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-clay-card dark:shadow-clay-card-dark rounded-3xl p-5 opacity-80 dark:opacity-60 min-w-[200px]`}>
            
            <div className="flex items-center justify-between mb-3 opacity-90">
              <div className="flex items-center space-x-3">
                <div className={`p-2 bg-theme-bg rounded-xl shadow-clay-btn ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <span className="font-black text-xs text-stone-500 dark:text-stone-400 uppercase tracking-widest">{card.title}</span>
              </div>
              
              {/* Optional top-right indicator */}
              {card.type === 'score' && (
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              )}
            </div>

            {/* Dynamic Content based on type */}
            {card.type === 'standard' && (
              <>
                <div className="text-2xl font-black text-stone-700 dark:text-stone-200 mb-1">{card.value}</div>
                <div className={`text-xs font-bold ${card.status === 'Normal' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {card.status}
                </div>
              </>
            )}

            {card.type === 'trend' && (
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-black text-stone-700 dark:text-stone-200 leading-none mb-1">
                    {card.value} <span className="text-sm text-stone-400 font-bold">{card.unit}</span>
                  </div>
                  <div className={`text-xs font-bold ${card.status === 'Normal' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {card.status}
                  </div>
                </div>
                <div className={`p-1.5 rounded-lg ${card.trend === 'up' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                  {card.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>
              </div>
            )}

            {card.type === 'score' && (
              <div className="flex items-center space-x-3">
                <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{card.value}</div>
                <div className="text-xs font-bold text-stone-500 leading-tight">Genel<br/>Durum<br/><span className="text-emerald-500">Mükemmel</span></div>
              </div>
            )}

            {card.type === 'report' && (
              <>
                <div className="text-lg font-black text-stone-700 dark:text-stone-200 mb-1">{card.value}</div>
                <div className="text-xs font-bold text-stone-400">{card.date}</div>
              </>
            )}

          </div>
        </div>
      ))}
    </div>
  );
};

export default AuthBackground;
