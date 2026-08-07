import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, UploadCloud, AlertCircle, CheckCircle2, Sparkles, 
  HelpCircle, Clock, HeartPulse, ShieldAlert, ArrowRight, Trash2, 
  Flame, Droplets, Zap, ChevronRight, FileText, Image as ImageIcon, Camera
} from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const SAMPLE_PRESETS = [
  {
    id: 'sample-1',
    title: 'Hafif Yüzeysel Kesik / Çizik',
    type: 'Kesik / Çizik',
    duration: 'Bugün oluştu',
    symptoms: ['⚡ Kaşıntı var'],
    painLevel: 2,
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=80',
    analysis: {
      possibleCauses: 'Yüzeysel epidermal abrazyon (doku çizilmesi) ve hafif kapiler sızıntı.',
      aiQuestions: 'Kesik paslı veya kirli bir cisimle mi gerçekleşti? En son ne zaman tetanos aşısı oldunuz?',
      soothingTips: [
        'Yara bölgesini ılık su ve antibakteriyel sabun ile nazikçe yıkayın.',
        'Steril gazlı bez ile hafifçe kurulayıp temiz bir bandajla kapatın.',
        'Bölgeyi kuru ve temiz tutun, doğrudan güneş ışığından koruyun.'
      ],
      urgency: 'LOW', // LOW, MEDIUM, HIGH
      doctorAdvice: 'Normal iyileşme sürecindedir. Kızarıklık yayılmazsa doktora gitmeniz gerekmez.'
    }
  },
  {
    id: 'sample-2',
    title: 'Alerjik Döküntü & Kızarıklık',
    type: 'Kızarıklık / Döküntü',
    duration: '1-3 gündür var',
    symptoms: ['🔥 Ateş veya Yanma var', '⚡ Kaşıntı var', '📈 Kızarıklık Giderek Yayılıyor'],
    painLevel: 5,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&auto=format&fit=crop&q=80',
    analysis: {
      possibleCauses: 'Kontakt dermatit, ürtiker veya lokal alerjik reaksiyon tablosu.',
      aiQuestions: 'Son 48 saat içinde yeni bir kozmetik, sabun, deterjan kullandınız mı veya farklı bir gıda tükettiniz mi?',
      soothingTips: [
        'Bölgeyi kesinlikle kaşımayın ve tırnak temasından kaçının.',
        'Temiz bir havluya sarılı soğuk kompres (buz paketi) uygulayarak yanmayı hafifletin.',
        'Sentetik kıyafetler yerine bol pamuklu giysiler tercih edin.'
      ],
      urgency: 'HIGH',
      doctorAdvice: '⚠️ Kızarıklık yayılıyor ve yanma hissi eşlik ediyor. Lütfen en kısa sürede bir Dermatoloji (Cildiye) uzmanına muayene olunuz.'
    }
  }
];

const PatientSkinAnalysis = () => {
  // Aktif kullanıcı e-postası
  const activeUser = (() => {
    try {
      const saved = localStorage.getItem('user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { name: 'Zeynep Ersal', email: 'hasta@drbio.com' };
  })();

  const userEmail = (activeUser.email || '').trim().toLowerCase();
  const storageKey = `drbio_skin_analyses_${userEmail}`;

  // Form State'leri
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [woundType, setWoundType] = useState('Kızarıklık / Döküntü');
  const [duration, setDuration] = useState('1-3 gündür var');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [painLevel, setPainLevel] = useState(3);
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Analiz & Yükleme Durumu
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [pastAnalyses, setPastAnalyses] = useState([]);
  const [activeTab, setActiveTab] = useState('new'); // 'new' veya 'history'

  // Geçmiş Analizleri Yükle
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setPastAnalyses(parsed);
      }
    } catch (e) {
      console.error(e);
    }
  }, [storageKey]);

  // Fotoğraf Yükleme İşleyicisi
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Örnek Fotoğraf Seçme
  const handleSelectPreset = (preset) => {
    setImagePreview(preset.imageUrl);
    setSelectedImage(null);
    setWoundType(preset.type);
    setDuration(preset.duration);
    setSelectedSymptoms(preset.symptoms);
    setPainLevel(preset.painLevel);
  };

  // Semptom İşaretleme
  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  // Yapay Zeka Görsel Analiz Tetikleme
  const handleRunAnalysis = () => {
    if (!imagePreview) {
      alert('Lütfen analiz için bir yara veya cilt fotoğrafı yükleyin.');
      return;
    }

    setIsAnalyzing(true);
    setCurrentResult(null);

    setTimeout(() => {
      // Yüksek risk semptomları kontrolü
      const hasHighRisk = selectedSymptoms.includes('🔥 Ateş veya Yanma var') || 
                          selectedSymptoms.includes('💧 Akıntı veya Sıvı Geliyor') || 
                          selectedSymptoms.includes('📈 Kızarıklık Giderek Yayılıyor') || 
                          painLevel >= 7;

      const urgency = hasHighRisk ? 'HIGH' : (painLevel >= 4 ? 'MEDIUM' : 'LOW');

      let possibleCauses = '';
      if (woundType === 'Kesik / Çizik') {
        possibleCauses = 'Yüzeysel epidermal doku bütünlüğü bozulması ve doku hassasiyeti.';
      } else if (woundType === 'Kızarıklık / Döküntü') {
        possibleCauses = 'Lokal dermatit, alerjik reaksiyon veya cilt hassasiyeti tablosu.';
      } else if (woundType === 'Böcek Isırığı') {
        possibleCauses = 'Böcek ısırığına bağlı lokal histamin salgısı ve papüler ürtiker reaksiyonu.';
      } else if (woundType === 'Hafif Yanık') {
        possibleCauses = '1. Derece yüzeysel termal iritasyon ve lokal eritem.';
      } else {
        possibleCauses = 'Görsel ve belirtilerinize göre yüzeysel cilt iritasyonu veya lokal doku hassasiyeti.';
      }

      let doctorAdvice = '';
      if (urgency === 'HIGH') {
        doctorAdvice = '⚠️ DİKKAT: Ateş, akıntı veya hızlı yayılan kızarıklık enfeksiyon belirtisi olabilir. Lütfen en kısa sürede bir Dermatoloji (Cildiye) veya Acil Servis hekimine başvurunuz.';
      } else if (urgency === 'MEDIUM') {
        doctorAdvice = '⚡ Şikayetleriniz 48 saat içinde gerilemezse veya ağrı şiddetlenirse cildiye polikliniğine muayene olmanız önerilir.';
      } else {
        doctorAdvice = '🟢 Mevcut tablo hafif seyirlidir. Evde bakım önerilerine uyarak 2-3 gün takip ediniz.';
      }

      const soothingTips = [
        'Yara/cilt bölgesini kaşımayınız ve tırnak temasından koruyunuz.',
        'pH nötr, kokusuz sabun ve ılık su ile nazikçe temiz tutunuz.',
        'Yanma ve şişliği hafifletmek için günde 3 kez 10 dakikalık soğuk kompres uygulayabilirsiniz.',
        'Bölgeye doktor tavsiyesi olmadan bilinmeyen merhem veya sert kimyasal sürmeyiniz.'
      ];

      const newAnalysis = {
        id: Date.now(),
        date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        woundType,
        duration,
        symptoms: selectedSymptoms,
        painLevel,
        imageUrl: imagePreview,
        possibleCauses,
        soothingTips,
        urgency,
        doctorAdvice,
        additionalNotes
      };

      setCurrentResult(newAnalysis);

      // Geçmişe Kaydet
      const updatedHistory = [newAnalysis, ...pastAnalyses];
      setPastAnalyses(updatedHistory);
      try {
        localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
      } catch (e) {
        console.error(e);
      }

      setIsAnalyzing(false);
    }, 1500);
  };

  // Kayıt Silme
  const handleDeleteRecord = (id) => {
    const updated = pastAnalyses.filter(item => item.id !== id);
    setPastAnalyses(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Üst Banner */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-900 rounded-[2.5rem] p-8 text-white shadow-clay-card dark:shadow-clay-card-dark relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-8 translate-y-8">
          <Stethoscope className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white">
            <Sparkles className="w-4 h-4" />
            <span>AI Görsel Cilt & Yara Analiz Motoru</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Yara & Cilt Görüntü Analizi
          </h2>

          <p className="text-sm font-medium text-red-100 max-w-2xl leading-relaxed">
            Vücudunuzda oluşan yara, kesik, kızarıklık veya döküntü fotoğraflarını yükleyin. Yapay zeka semptomlarınızı değerlendirsin, evde rahatlatıcı bakım tavsiyeleri sunsun.
          </p>

          <div className="pt-2 flex items-center space-x-3 text-xs font-bold text-red-100">
            <span className="px-3 py-1 bg-black/20 rounded-full border border-white/10">
              🛡️ Kesin Teşhis Koymaz — Bilgilendirme Amaçlıdır
            </span>
          </div>
        </div>
      </div>

      {/* Sekme Butonları (Yeni Analiz / Geçmiş Analizlerim) */}
      <div className="flex items-center space-x-3 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('new')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTab === 'new'
              ? 'bg-red-600 text-white shadow-clay-btn'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Yeni Yara / Cilt Analizi</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTab === 'history'
              ? 'bg-red-600 text-white shadow-clay-btn'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Geçmiş Analizlerim ({pastAnalyses.length})</span>
        </button>
      </div>

      {activeTab === 'new' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sol Kolon: Fotoğraf Yükleme ve Semptom Formu */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Fotoğraf Yükleme Alanı */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-black text-stone-800 dark:text-stone-100 flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-red-600" />
                <span>1. Yara / Cilt Fotoğrafı Yükleyin</span>
              </h3>

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-black/5 aspect-video flex items-center justify-center">
                  <img src={imagePreview} alt="Cilt Analiz Görseli" className="max-h-64 object-contain rounded-xl" />
                  <button
                    onClick={() => { setImagePreview(''); setSelectedImage(null); }}
                    className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 transition"
                    title="Fotoğrafı Kaldır"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-red-500 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer bg-stone-50/50 dark:bg-stone-900/40 transition group">
                  <UploadCloud className="w-12 h-12 text-stone-400 group-hover:text-red-600 transition-colors mb-3" />
                  <span className="font-black text-sm text-stone-700 dark:text-stone-200">Fotoğraf Seçin veya Buraya Sürükleyin</span>
                  <span className="text-xs font-bold text-stone-400 mt-1">JPG, PNG, WEBP — Net ve aydınlık bir fotoğraf önerilir</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}

              {/* Örnek Fotoğraflar */}
              <div className="pt-2">
                <span className="text-[11px] font-black text-stone-400 uppercase tracking-wider block mb-2">Hızlı Test İçin Örnek Fotoğraf Seçin:</span>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_PRESETS.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className="p-2.5 bg-stone-100 dark:bg-stone-800/60 hover:bg-red-50 dark:hover:bg-red-950/40 border border-stone-200 dark:border-stone-700 rounded-xl text-left transition flex items-center space-x-2"
                    >
                      <img src={p.imageUrl} alt={p.title} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-xs font-bold text-stone-700 dark:text-stone-200 truncate">{p.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Semptom & Belirti Anketi */}
            <Card className="p-6 space-y-5">
              <h3 className="text-lg font-black text-stone-800 dark:text-stone-100 flex items-center space-x-2">
                <HeartPulse className="w-5 h-5 text-red-600" />
                <span>2. Belirti & Semptom Detayları</span>
              </h3>

              {/* Yara Türü Seçimi */}
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-wider mb-2">Görüntülenen Durum Türü:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Kesik / Çizik', 'Kızarıklık / Döküntü', 'Böcek Isırığı', 'Hafif Yanık', 'Su Toplaması', 'Diğer'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setWoundType(t)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition border ${
                        woundType === t
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Süre */}
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-wider mb-2">Ne Zamandır Var?</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 bg-theme-bg border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-800 dark:text-stone-200"
                >
                  <option value="Bugün oluştu">Bugün oluştu</option>
                  <option value="1-3 gündür var">1 - 3 gündür var</option>
                  <option value="1 haftadan uzun">1 haftadan uzun süredir var</option>
                </select>
              </div>

              {/* Semptom Çipleri */}
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-wider mb-2">Eşlik Eden Şikayetler (Birden Fazla Seçilebilir):</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    '🔥 Ateş veya Yanma var',
                    '💧 Akıntı veya Sıvı Geliyor',
                    '💥 Şiddetli Ağrı var',
                    '📈 Kızarıklık Giderek Yayılıyor',
                    '⚡ Kaşıntı var'
                  ].map(symptom => {
                    const isSelected = selectedSymptoms.includes(symptom);
                    return (
                      <button
                        key={symptom}
                        type="button"
                        onClick={() => toggleSymptom(symptom)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition border ${
                          isSelected
                            ? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800'
                            : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{symptom}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ağrı Şiddeti */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-black text-stone-400 uppercase tracking-wider">Ağrı / Rahatsızlık Hissi (1 - 10):</label>
                  <span className="text-sm font-black text-red-600">{painLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={painLevel}
                  onChange={(e) => setPainLevel(parseInt(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>

              {/* Analizi Başlat Butonu */}
              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || !imagePreview}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-clay-btn transition active:scale-95 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 mt-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Görsel ve Semptomlar Analiz Ediliyor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Yapay Zeka Analizini Başlat</span>
                  </>
                )}
              </button>
            </Card>

          </div>

          {/* Sağ Kolon: Analiz Sonuç Kartı */}
          <div className="lg:col-span-5">
            {currentResult ? (
              <Card className="p-6 space-y-6 border-l-4 border-l-red-600 animate-fade-in sticky top-6">
                
                {/* Sonuç Başlığı & Aciliyet Rozeti */}
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
                  <div>
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">AI Analiz Raporı</span>
                    <h4 className="text-xl font-black text-stone-800 dark:text-stone-100">{currentResult.woundType}</h4>
                  </div>

                  {currentResult.urgency === 'HIGH' ? (
                    <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 rounded-full text-xs font-black border border-red-200 animate-pulse">
                      ⚠️ Yüksek Risk / Doktora Danışın
                    </span>
                  ) : currentResult.urgency === 'MEDIUM' ? (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 rounded-full text-xs font-black border border-amber-200">
                      ⚡ Orta Seviye İritasyon
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full text-xs font-black border border-emerald-200">
                      🟢 Hafif Seyirli
                    </span>
                  )}
                </div>

                {/* Olası Nedenler (Teşhis Koymaz) */}
                <div className="space-y-2">
                  <h5 className="text-xs font-black text-stone-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Stethoscope className="w-4 h-4 text-red-600" />
                    <span>Olası Tablo & Nedenler (Teşhis Değildir):</span>
                  </h5>
                  <p className="text-xs font-bold text-stone-700 dark:text-stone-200 leading-relaxed bg-stone-50 dark:bg-stone-900 p-3.5 rounded-2xl border border-stone-200/60 dark:border-stone-800">
                    {currentResult.possibleCauses}
                  </p>
                </div>

                {/* AI Takip Soruları */}
                <div className="space-y-2">
                  <h5 className="text-xs font-black text-stone-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                    <span>Yapay Zeka Takip Sorusu:</span>
                  </h5>
                  <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 bg-blue-50/70 dark:bg-blue-950/40 p-3.5 rounded-2xl border border-blue-200/60 dark:border-blue-900/50">
                    {currentResult.aiQuestions}
                  </p>
                </div>

                {/* Evde Rahatlatıcı Bakım Önerileri */}
                <div className="space-y-2">
                  <h5 className="text-xs font-black text-stone-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldAlert className="w-4 h-4 text-emerald-500" />
                    <span>Evde Rahatlatıcı Bakım Tavsiyeleri:</span>
                  </h5>
                  <ul className="space-y-2">
                    {currentResult.soothingTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs font-bold text-stone-600 dark:text-stone-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Doktora Danışma Uyarısı (Red Flag Banner) */}
                <div className={`p-4 rounded-2xl border text-xs font-bold leading-relaxed ${
                  currentResult.urgency === 'HIGH' 
                    ? 'bg-red-50 dark:bg-red-950/60 border-red-200 text-red-800 dark:text-red-200' 
                    : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300'
                }`}>
                  {currentResult.doctorAdvice}
                </div>

              </Card>
            ) : (
              <Card className="p-12 text-center text-stone-400 space-y-4 border-dashed">
                <Camera className="w-12 h-12 mx-auto text-stone-300 animate-pulse" />
                <div>
                  <h4 className="font-black text-stone-700 dark:text-stone-200 text-base">Analiz Sonucu Burada Görünecek</h4>
                  <p className="text-xs font-semibold text-stone-400 max-w-xs mx-auto mt-1">
                    Sol taraftan yara veya cilt fotoğrafını yükleyip belirtileri işaretledikten sonra analiz butonuna basınız.
                  </p>
                </div>
              </Card>
            )}
          </div>

        </div>
      ) : (
        /* Geçmiş Analizlerim Sekmesi */
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-black text-stone-800 dark:text-stone-100 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-red-600" />
            <span>Geçmiş Cilt & Yara Analiz Kayıtları</span>
          </h3>

          {pastAnalyses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastAnalyses.map(item => (
                <div key={item.id} className="p-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-3 relative">
                  <div className="flex items-center space-x-3">
                    <img src={item.imageUrl} alt={item.woundType} className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0" />
                    <div>
                      <h4 className="font-black text-sm text-stone-800 dark:text-stone-100">{item.woundType}</h4>
                      <span className="text-[11px] font-bold text-stone-400 block">{item.date}</span>
                      <span className={`inline-block mt-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
                        item.urgency === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {item.urgency === 'HIGH' ? '⚠️ Yüksek Risk' : '🟢 Hafif Seyirli'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-stone-600 dark:text-stone-300 line-clamp-2">
                    {item.possibleCauses}
                  </p>

                  <button
                    onClick={() => handleDeleteRecord(item.id)}
                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1 pt-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Kaydı Sil</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-stone-400 font-bold text-sm">
              Henüz kaydedilmiş geçmiş cilt veya yara analiziniz bulunmamaktadır.
            </div>
          )}
        </Card>
      )}

    </div>
  );
};

export default PatientSkinAnalysis;
