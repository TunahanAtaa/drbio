import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Shield, User, Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      let role = 'PATIENT';
      let path = '/patient';
      
      if (email === 'admin@drbio.com') { role = 'ADMIN'; path = '/admin'; }
      else if (email === 'doktor@drbio.com') { role = 'DOCTOR'; path = '/doctor'; }

      localStorage.setItem('user', JSON.stringify({ name: email.split('@')[0].toUpperCase(), email, role }));
      navigate(path);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-theme-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-theme-card rounded-[2rem] p-8 shadow-clay-card dark:shadow-clay-card-dark border-theme-border animate-fade-in">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-2xl shadow-clay-btn flex items-center justify-center text-white font-black text-3xl">
            <Activity className="w-8 h-8" />
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-center text-stone-800 dark:text-stone-200 mb-2">Dr. Bio</h1>
        <p className="text-center text-stone-500 font-bold mb-8">Sisteme Giriş Yapın</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-black text-stone-400 uppercase tracking-widest mb-2 ml-2">E-posta Adresi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doktor@drbio.com"
              required
              className="w-full px-5 py-4 bg-theme-bg rounded-3xl font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-4 focus:ring-red-600/20 shadow-inner"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-4 bg-red-600 text-white font-black rounded-3xl shadow-clay-btn active:scale-95 active:shadow-clay-btn transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Giriş Yap</span>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
          <p className="text-xs font-bold text-stone-400 text-center mb-4 uppercase">Test Hesapları</p>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => setEmail('admin@drbio.com')} className="p-2 bg-theme-bg rounded-xl text-xs font-bold text-stone-500 hover:text-red-600 shadow-sm flex flex-col items-center"><Shield className="w-4 h-4 mb-1"/>Admin</button>
            <button onClick={() => setEmail('doktor@drbio.com')} className="p-2 bg-theme-bg rounded-xl text-xs font-bold text-stone-500 hover:text-red-600 shadow-sm flex flex-col items-center"><Activity className="w-4 h-4 mb-1"/>Doktor</button>
            <button onClick={() => setEmail('hasta@drbio.com')} className="p-2 bg-theme-bg rounded-xl text-xs font-bold text-stone-500 hover:text-red-600 shadow-sm flex flex-col items-center"><User className="w-4 h-4 mb-1"/>Hasta</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
