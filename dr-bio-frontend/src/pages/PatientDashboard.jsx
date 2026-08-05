import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { UploadCloud, AlertTriangle, CheckCircle, ArrowDownCircle, ArrowUpCircle, Stethoscope, Sparkles, Loader2, FileText } from 'lucide-react';

const PatientDashboard = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResults(null);

    // Simulate API upload
    setTimeout(() => {
      if (file.name.includes('error')) {
        setError('Dosya okunamadı. Lütfen geçerli bir PDF yükleyin.');
        setFile(null);
        setLoading(false);
        return;
      }

      setResults({
        params: [
          { name: 'Hemoglobin (HGB)', value: '11.2', range: '13.5 - 17.5', status: 'LOW' },
          { name: 'WBC (Lökosit)', value: '8.4', range: '4.5 - 11.0', status: 'NORMAL' },
          { name: 'Kolesterol', value: '240', range: '0 - 200', status: 'HIGH' }
        ],
        systemNote: 'Hemoglobin değeriniz referans aralığının altındadır. Kansızlık (anemi) belirtisi olabilir. Kolesterol değeriniz yüksek, diyetinize dikkat etmeniz önerilir.',
        doctorNote: 'Son tahlillerinize göre hafif bir demir eksikliği var. Size yazdığım takviyeye başlayın, 1 ay sonra tekrar görüşelim.'
      });
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    // Simulate fetching user data/history
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) {
    return (
      <Layout title="Hasta Paneli" role="PATIENT">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-stone-400">
          <Loader2 className="w-16 h-16 animate-spin text-red-600 mb-6" />
          <h2 className="text-2xl font-black text-stone-700 dark:text-stone-200 mb-2">Tahlil Verileri Yükleniyor...</h2>
          <p className="font-bold">Lütfen bekleyin, bilgileriniz şifreli olarak getiriliyor.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Hasta Paneli" role="PATIENT">
      
      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-[2rem] p-4 mb-8 shadow-sm flex items-start space-x-3">
        <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm font-bold text-amber-800 dark:text-amber-500 leading-relaxed">
          Yasal Uyarı: Bu sistemin sunduğu otomatik analiz sonuçları yapay zeka destekli ön değerlendirmedir. Kesin teşhis ve tedavi kararı yalnızca uzman doktorunuz tarafından verilebilir.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Section */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-2xl font-black text-stone-800 dark:text-stone-200">Tahlil Yükle</h2>
          <div className="bg-theme-card rounded-[2rem] p-8 shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex flex-col items-center justify-center text-center">
            
            <div className="w-24 h-24 bg-theme-bg rounded-3xl shadow-inner flex items-center justify-center mb-6">
              <UploadCloud className="w-10 h-10 text-red-600" />
            </div>
            
            <p className="font-bold text-stone-600 dark:text-stone-300 mb-2">PDF formatında tahlil sonucunuzu seçin</p>
            <p className="text-xs text-stone-400 mb-6 font-medium">Maksimum dosya boyutu: 5MB</p>
            
            <input type="file" id="file" accept=".pdf" className="hidden" onChange={handleFile} />
            <label htmlFor="file" className="px-6 py-3 bg-theme-bg text-stone-600 dark:text-stone-300 font-black text-sm rounded-2xl shadow-clay-card cursor-pointer hover:scale-105 active:scale-95 transition-all mb-4">
              {file ? file.name : 'Dosya Seç'}
            </label>
            
            <button 
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full py-4 mt-2 bg-red-600 text-white font-black rounded-3xl shadow-clay-btn active:shadow-clay-pressed active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? 'Yükleniyor ve Analiz Ediliyor...' : 'Yükle ve Analiz Et'}
            </button>
            
            {error && <p className="text-sm text-red-600 font-bold mt-4 animate-fade-in">{error}</p>}
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-stone-800 dark:text-stone-200">Analiz Sonuçları</h2>
          
          {results ? (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.params.map((param, idx) => (
                  <div key={idx} className="bg-theme-card p-5 rounded-3xl shadow-clay-card dark:shadow-clay-card-dark border-theme-border">
                    <p className="text-xs font-black text-stone-400 uppercase tracking-wider mb-2">{param.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-stone-700 dark:text-stone-200">{param.value}</span>
                      
                      {param.status === 'NORMAL' && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                      {param.status === 'HIGH' && <ArrowUpCircle className="w-6 h-6 text-red-600" />}
                      {param.status === 'LOW' && <ArrowDownCircle className="w-6 h-6 text-blue-600" />}
                    </div>
                    <p className="text-xs font-bold text-stone-400 mt-2">Ref: {param.range}</p>
                    
                    <div className={`mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs font-black ${
                      param.status === 'NORMAL' ? 'text-emerald-600' :
                      param.status === 'HIGH' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {param.status === 'NORMAL' ? 'NORMAL' : param.status === 'HIGH' ? 'YÜKSEK' : 'DÜŞÜK'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-theme-card p-6 rounded-[2rem] shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-start space-x-4">
                <div className="w-12 h-12 shrink-0 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-stone-800 dark:text-stone-200 mb-2">Sistem Önerisi</h3>
                  <p className="text-sm font-medium text-stone-500 dark:text-stone-400 leading-relaxed">{results.systemNote}</p>
                </div>
              </div>

              {results.doctorNote && (
                <div className="bg-theme-card p-6 rounded-[2rem] shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex items-start space-x-4">
                  <div className="w-12 h-12 shrink-0 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl flex items-center justify-center">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-stone-800 dark:text-stone-200 mb-2">Doktorunuzun Notu</h3>
                    <p className="text-sm font-bold text-red-700 dark:text-red-400 leading-relaxed">{results.doctorNote}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-theme-card rounded-[2rem] p-12 shadow-clay-card dark:shadow-clay-card-dark border-theme-border flex flex-col items-center justify-center text-center text-stone-400 h-full min-h-[400px]">
              <FileText className="w-16 h-16 text-stone-200 dark:text-stone-800 mb-4" />
              <p className="font-bold text-lg">Sonuçları görmek için tahlil dosyanızı yükleyin.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PatientDashboard;
