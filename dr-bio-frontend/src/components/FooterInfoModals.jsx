import React from 'react';
import { X, ShieldCheck, FileText, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

const FooterInfoModals = ({ activeModal, onClose }) => {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-theme-card w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Gizlilik Politikası */}
        {activeModal === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
              <div className="p-3 bg-red-50 dark:bg-red-950/60 rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-stone-800 dark:text-stone-100">Gizlilik Politikası & KVKK</h3>
                <p className="text-xs font-bold text-stone-400">Kişisel Sağlık Verilerinizin Korunması</p>
              </div>
            </div>

            <div className="text-xs font-medium text-stone-600 dark:text-stone-300 leading-relaxed space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
              <p>
                Dr. Bio olarak kişisel sağlık verilerinizin gizliliğine ve güvenliğine en yüksek derecede önem veriyoruz. 6698 sayılı KVKK standartları gereğince verileriniz korunmaktadır.
              </p>
              <div className="p-3.5 bg-stone-50 dark:bg-stone-900 rounded-2xl space-y-2 border border-stone-200/60 dark:border-stone-800">
                <div className="flex items-center space-x-2 text-stone-800 dark:text-stone-200 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Güvenli Veri Saklama</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Laboratuvar sonuçlarınız ve kişisel profil bilgileriniz yalnızca sizin erişiminize açık olup izinsiz 3. taraflarla paylaşılmaz.
                </p>
              </div>
              <div className="p-3.5 bg-stone-50 dark:bg-stone-900 rounded-2xl space-y-2 border border-stone-200/60 dark:border-stone-800">
                <div className="flex items-center space-x-2 text-stone-800 dark:text-stone-200 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Kullanıcı Hakları</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Dilediğiniz an hesabınızı ve yüklediğiniz tüm tahlil verilerini sistemimizden kalıcı olarak silme hakkına sahipsiniz.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. Kullanım Şartları */}
        {activeModal === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
              <div className="p-3 bg-red-50 dark:bg-red-950/60 rounded-2xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-stone-800 dark:text-stone-100">Kullanım Şartları</h3>
                <p className="text-xs font-bold text-stone-400">Hizmet Sözleşmesi ve Uyarılar</p>
              </div>
            </div>

            <div className="text-xs font-medium text-stone-600 dark:text-stone-300 leading-relaxed space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
              <p>
                Dr. Bio platformunu kullanarak aşağıdaki kullanım koşullarını ve yapay zeka bilgilendirme ilkelerini kabul etmiş olursunuz:
              </p>
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl text-amber-800 dark:text-amber-300 space-y-1">
                <span className="font-black text-xs block">⚠️ Tıbbi Teşhis Sorumluluk Reddi</span>
                <p className="text-[11px] leading-relaxed">
                  Dr. Bio tarafından üretilen tahlil analizleri ve yapay zeka önerileri <b>bilgilendirme amaçlıdır</b>. Kesin tıbbi teşhis, tedavi veya reçete yerine geçmez. Sağlık sorunlarınız için her zaman yetkili bir hekime başvurmalısınız.
                </p>
              </div>
              <p className="text-stone-500 text-[11px]">
                Kullanıcılar hesap güvenliklerinden kendileri sorumludur. Platformun kötüye kullanımı durumunda hesap geçici veya kalıcı olarak askıya alınabilir.
              </p>
            </div>
          </div>
        )}

        {/* 3. İletişim */}
        {activeModal === 'contact' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
              <div className="p-3 bg-red-50 dark:bg-red-950/60 rounded-2xl">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-stone-800 dark:text-stone-100">İletişim & Destek</h3>
                <p className="text-xs font-bold text-stone-400">Bizimle İletişime Geçin</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs font-bold">
              <a
                href="mailto:destek@drbio.com"
                className="p-4 bg-stone-50 dark:bg-stone-900 hover:bg-red-50 dark:hover:bg-red-950/30 border border-stone-200 dark:border-stone-800 rounded-2xl flex items-center justify-between transition group"
              >
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block text-stone-800 dark:text-stone-200">E-posta Destek</span>
                    <span className="text-[11px] font-medium text-stone-400">destek@drbio.com</span>
                  </div>
                </div>
                <span className="text-red-600 text-xs">E-posta Gönder →</span>
              </a>

              <a
                href="tel:08503000000"
                className="p-4 bg-stone-50 dark:bg-stone-900 hover:bg-red-50 dark:hover:bg-red-950/30 border border-stone-200 dark:border-stone-800 rounded-2xl flex items-center justify-between transition group"
              >
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block text-stone-800 dark:text-stone-200">Çağrı Merkezi</span>
                    <span className="text-[11px] font-medium text-stone-400">0850 300 00 00 (Hafta içi 09:00-18:00)</span>
                  </div>
                </div>
                <span className="text-red-600 text-xs">Ara →</span>
              </a>

              <div className="p-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <span className="block text-stone-800 dark:text-stone-200">Genel Merkez</span>
                  <span className="text-[11px] font-medium text-stone-400">Dr. Bio Teknoloji A.Ş., Maslak Mah. Büyükdere Cad. No:142 Sarıyer / İstanbul</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Anlaşıldı / Kapat Butonu */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-clay-btn transition active:scale-95 text-xs"
          >
            Anladım, Kapat
          </button>
        </div>

      </div>
    </div>
  );
};

export default FooterInfoModals;
