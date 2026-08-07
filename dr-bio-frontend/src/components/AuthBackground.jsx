import React from 'react';
import { Activity, HeartPulse, ShieldAlert, Droplets, TrendingUp, TrendingDown, ClipboardList } from 'lucide-react';

const decorativeCards = [
  {
    id: 1,
    type: 'standard',
    title: 'Hemoglobin',
    value: '13.8 g/dL',
    status: 'Normal',
    icon: Droplets,
    color: 'text-red-600',
    position: 'top-[6%] left-[4%]',
    rotation: '-rotate-3',
    scale: 'scale-95',
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
    position: 'top-[6%] right-[4%]',
    rotation: 'rotate-3',
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
    position: 'bottom-[18%] left-[4%]',
    rotation: 'rotate-6',
    scale: 'scale-100',
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
    position: 'top-[42%] left-[3%]',
    rotation: '-rotate-3',
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
    position: 'bottom-[8%] right-[4%]',
    rotation: '-rotate-6',
    scale: 'scale-105',
    hideOnMobile: true
  },
  {
    id: 6,
    type: 'standard',
    title: 'Cholesterol',
    value: '185 mg/dL',
    status: 'Normal',
    icon: Activity,
    color: 'text-red-600',
    position: 'top-[45%] right-[3%]',
    rotation: 'rotate-3',
    scale: 'scale-90',
    hideOnMobile: true
  },
  {
    id: 7,
    type: 'standard',
    title: 'Lökosit',
    value: '7.200 /µL',
    status: 'Normal',
    icon: Droplets,
    color: 'text-blue-600',
    position: 'top-[5%] left-[28%]',
    rotation: '-rotate-2',
    scale: 'scale-90',
    hideOnMobile: true
  },
  {
    id: 8,
    type: 'standard',
    title: 'Tansiyon',
    value: '118/76 mmHg',
    status: 'Normal',
    icon: HeartPulse,
    color: 'text-emerald-600',
    position: 'bottom-[8%] right-[28%]',
    rotation: '-rotate-2',
    scale: 'scale-95',
    hideOnMobile: true
  },
  {
    id: 9,
    type: 'standard',
    title: 'Kreatinin',
    value: '0.9 mg/dL',
    status: 'Normal',
    icon: Activity,
    color: 'text-purple-600',
    position: 'top-[5%] right-[28%]',
    rotation: 'rotate-2',
    scale: 'scale-90',
    hideOnMobile: true
  }
];

const AuthBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-theme-bg">
      {/* Static ambient color blobs — no blur filter, just soft color with opacity */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-emerald-200/15 dark:bg-emerald-900/10 rounded-full"></div>
      <div className="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] bg-blue-200/15 dark:bg-blue-900/10 rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[45rem] h-[45rem] bg-purple-200/10 dark:bg-purple-900/8 rounded-full"></div>

      {/* Static decorative cards — no animation, low opacity */}
      {decorativeCards.map((card) => (
        <div
          key={card.id}
          className={`absolute ${card.position} ${card.hideOnMobile ? 'hidden md:block' : 'block'}`}
        >
          <div className={`${card.rotation} ${card.scale} flex flex-col bg-white/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/30 shadow-sm rounded-2xl p-4 opacity-30 dark:opacity-15 min-w-[180px]`}>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg ${card.color}`}>
                  <card.icon className="w-4 h-4" />
                </div>
                <span className="font-bold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">{card.title}</span>
              </div>
            </div>

            {/* Dynamic Content based on type */}
            {card.type === 'standard' && (
              <>
                <div className="text-xl font-black text-slate-700 dark:text-slate-200 mb-0.5">{card.value}</div>
                <div className={`text-[10px] font-bold ${card.status === 'Normal' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {card.status}
                </div>
              </>
            )}

            {card.type === 'trend' && (
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-black text-slate-700 dark:text-slate-200 leading-none mb-0.5">
                    {card.value} <span className="text-xs text-slate-400 font-bold">{card.unit}</span>
                  </div>
                  <div className={`text-[10px] font-bold ${card.status === 'Normal' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {card.status}
                  </div>
                </div>
                <div className={`p-1 rounded-md ${card.trend === 'up' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                  {card.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                </div>
              </div>
            )}

            {card.type === 'score' && (
              <div className="flex items-center space-x-2">
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{card.value}</div>
                <div className="text-[10px] font-bold text-slate-500 leading-tight">Genel<br/>Durum<br/><span className="text-emerald-500">Mükemmel</span></div>
              </div>
            )}

            {card.type === 'report' && (
              <>
                <div className="text-base font-black text-slate-700 dark:text-slate-200 mb-0.5">{card.value}</div>
                <div className="text-[10px] font-bold text-slate-400">{card.date}</div>
              </>
            )}

          </div>
        </div>
      ))}
    </div>
  );
};

export default AuthBackground;
