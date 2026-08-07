import React from 'react';
import { createPortal } from 'react-dom';
import { 
  Star, TrendingUp, MessageSquare, CheckCircle, AlertTriangle, Search, 
  Trash2, Send, Check, Bell, CheckCircle2, X 
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Card from '../../components/ui/Card';

const AdminFeedbacksTab = ({
  safeFeedbacks = [],
  avgRating,
  satisfiedCount,
  complaintCount,
  respondedCount,
  unhandledFeedbacksCount,
  feedbackSearch = '',
  setFeedbackSearch,
  starFilter = 'ALL',
  setStarFilter,
  feedbackSubTab = 'all',
  setFeedbackSubTab,
  filteredFeedbacks = [],
  contactPendingIds = [],
  acknowledgedIds = [],
  feedbackLastAction = {},
  usersList = [],
  getGenderStyles,
  getProcessNote,
  getRespondedNote,
  handleDeleteFeedback,
  toggleFeedbackStatus,
  openAckModal,
  openResolveModal,
  ackModalTarget,
  setAckModalTarget,
  ackSelectedTemplate,
  ackCustomNote,
  setAckCustomNote,
  MESSAGE_TEMPLATES = [],
  handleSelectTemplate,
  handleSendAcknowledgement,
  resolveModalTarget,
  setResolveModalTarget,
  resolveSelectedTemplate,
  resolveCustomNote,
  setResolveCustomNote,
  RESOLUTION_TEMPLATES = [],
  handleSelectResolutionTemplate,
  handleSendResolution,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200">Geri Bildirim & Şikayet Yönetimi</h2>
          <p className="text-xs font-bold text-slate-400 mt-1">Hastaların gönderdiği tahlil deneyimleri, öneriler ve şikayetlerin analizi</p>
        </div>
      </div>

      {/* İstatistik Metrik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card padding="p-6" rounded="rounded-3xl" className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/40 rounded-2xl flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
            <Star className="w-7 h-7 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Ortalama Puan</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{avgRating} / 5.0</span>
          </div>
        </Card>

        <Card padding="p-6" rounded="rounded-3xl" className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-cyan-50 dark:bg-cyan-950/40 rounded-2xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0 shadow-sm">
            <TrendingUp className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Memnuniyet Oranı</span>
            <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">%{Math.round(((satisfiedCount || 0) / (safeFeedbacks.length || 1)) * 100)}</span>
          </div>
        </Card>

        <Card padding="p-6" rounded="rounded-3xl" className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-sm">
            <MessageSquare className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Toplam Bildirim</span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{safeFeedbacks.length}</span>
          </div>
        </Card>

        <Card padding="p-6" rounded="rounded-3xl" className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-sm">
            <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Memnun Hastalar</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{satisfiedCount} Hasta</span>
          </div>
        </Card>

        <Card padding="p-6" rounded="rounded-3xl" className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/40 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 shadow-sm">
            <AlertTriangle className="w-7 h-7 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <span className="block text-xs font-black text-stone-400 uppercase tracking-wider">Şikayet / Öneri</span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{complaintCount} Kayıt</span>
          </div>
        </Card>
      </div>

      {/* Arama ve Yıldız Filtresi */}
      <Card padding="p-4" rounded="rounded-3xl" className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-stone-400" />
          <Input
            type="text"
            placeholder="Hasta adı, e-posta veya yorum ara..."
            value={feedbackSearch}
            onChange={(e) => setFeedbackSearch(e.target.value)}
            className="pl-11 py-2.5 text-xs"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-black text-stone-400 uppercase tracking-wider shrink-0">Filtrele:</span>
          <Select
            value={starFilter}
            onChange={(e) => setStarFilter(e.target.value)}
            className="py-2.5 px-4 text-xs font-bold w-auto"
          >
            <option value="ALL">Tüm Yıldız Dereceleri</option>
            <option value="5">5 Yıldız (Mükemmel)</option>
            <option value="4">4 Yıldız (Çok İyi)</option>
            <option value="3_BELOW">1-3 Yıldız (Şikayet / Öneri)</option>
          </Select>
        </div>
      </Card>

      {/* Alt Sekme Navigasyonu */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFeedbackSubTab('all')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 ${
            feedbackSubTab === 'all'
              ? 'bg-red-600 text-white shadow-clay-btn'
              : 'bg-theme-bg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Tüm Bildirimler ({unhandledFeedbacksCount})</span>
        </button>

        <button
          onClick={() => setFeedbackSubTab('complaints')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 ${
            feedbackSubTab === 'complaints'
              ? 'bg-red-600 text-white shadow-clay-btn'
              : 'bg-theme-bg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Şikayetler ({complaintCount})</span>
        </button>

        <button
          onClick={() => setFeedbackSubTab('pending_contact')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 relative ${
            feedbackSubTab === 'pending_contact'
              ? 'bg-red-600 text-white shadow-clay-btn'
              : 'bg-theme-bg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Bekleyen Dönüşler ({contactPendingIds.length})</span>
          {contactPendingIds.length > 0 && feedbackSubTab !== 'pending_contact' && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
              {contactPendingIds.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setFeedbackSubTab('responded')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 ${
            feedbackSubTab === 'responded'
              ? 'bg-red-600 text-white shadow-clay-btn'
              : 'bg-theme-bg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Yanıtlananlar ({respondedCount})</span>
        </button>
      </div>

      {/* Geri Bildirim Kartları */}
      {filteredFeedbacks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredFeedbacks.map((item) => {
            const matchedUser = usersList.find(u => u.email?.trim().toLowerCase() === (item.userEmail || '').trim().toLowerCase());
            const gStyle = getGenderStyles(matchedUser?.healthProfile?.gender || item.gender);
            return (
              <Card 
                key={item.id}
                padding="p-6"
                rounded="rounded-3xl"
                className={`flex flex-col space-y-4 ${
                  contactPendingIds.includes(item.id)
                    ? 'ring-2 ring-amber-400/50 dark:ring-amber-500/30'
                    : feedbackSubTab === 'responded' && acknowledgedIds.includes(item.id)
                      ? 'ring-2 ring-sky-400/40 dark:ring-sky-500/25'
                      : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-11 h-11 ${gStyle.avatarBg} rounded-2xl flex items-center justify-center font-black text-base shadow-sm shrink-0`}>
                      {(item.userName || 'H').charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-stone-800 dark:text-stone-200 text-sm">{item.userName}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${gStyle.badgeBg}`}>
                          {gStyle.label}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-stone-400">{item.userEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-start sm:self-auto">
                    <span className="text-xs font-black text-stone-400">{item.date}</span>
                    <button
                      onClick={() => handleDeleteFeedback(item.id)}
                      className="p-2 text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition"
                      title="Geri bildirimi sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < item.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300 dark:text-stone-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-black text-amber-600 dark:text-amber-400">{item.rating} / 5</span>
                      {item.category && (
                        <span className="px-2.5 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-md text-[10px] font-black uppercase">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-stone-700 dark:text-stone-300 leading-relaxed">
                      "{item.comment}"
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100 dark:border-stone-800">
                    <button
                      onClick={() => toggleFeedbackStatus(item.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center space-x-1.5 ${
                        item.status === 'REVIEWED'
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
                          : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{item.status === 'REVIEWED' ? 'İncelendi' : 'İnceleme Bekliyor'}</span>
                    </button>

                    {feedbackSubTab === 'pending_contact' || contactPendingIds.includes(item.id) ? (
                      <Button
                        onClick={() => openResolveModal(item)}
                        variant="primary"
                        size="sm"
                        className="space-x-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Çözüm Mesajı Gönder</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => openAckModal(item)}
                        variant="primary"
                        size="sm"
                        className="space-x-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{acknowledgedIds.includes(item.id) ? 'Yanıtı Güncelle' : 'Yanıtla & Bildir'}</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Süreç Notu / Son Mesaj Durumu */}
                {(() => {
                  if (feedbackSubTab === 'responded' || acknowledgedIds.includes(item.id)) {
                    const rNote = getRespondedNote(item.id);
                    return (
                      <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-2 ${rNote.bg}`}>
                        <div className="flex items-center space-x-2 font-bold">
                          <span>{rNote.emoji}</span>
                          <span className={rNote.color}>{rNote.text}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase text-stone-400">Hastaya Ulaştırıldı</span>
                      </div>
                    );
                  }
                  const pNote = getProcessNote(item.id);
                  return (
                    <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-2 ${pNote.bg}`}>
                      <div className="flex items-center space-x-2 font-bold">
                        <span>{pNote.emoji}</span>
                        <span className={pNote.color}>{pNote.text}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase text-stone-400">Süreç Durumu</span>
                    </div>
                  );
                })()}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card padding="p-12" rounded="rounded-3xl" className="text-center space-y-3">
          <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-3xl flex items-center justify-center mx-auto text-stone-400">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-stone-700 dark:text-stone-300">Geri Bildirim Bulunamadı</h3>
          <p className="text-xs font-bold text-stone-400 max-w-sm mx-auto">
            Arama kriterlerinize veya seçili sekmeye uygun herhangi bir hasta mesajı mevcut değil.
          </p>
        </Card>
      )}

      {/* --- HASTAYA YANIT GÖNDERME MODALI --- */}
      {ackModalTarget && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-theme-card w-full max-w-2xl rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-theme-border space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950/60 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-slate-200">Hastaya Yanıt & Bildirim Gönder</h3>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">
                    <span className="text-red-600 font-extrabold">{ackModalTarget.userName}</span> ({ackModalTarget.userEmail}) için kalıp cümle seçin veya özel mesaj yazın.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAckModalTarget(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-theme-bg rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-50 dark:bg-stone-900/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-800/80 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-black text-stone-400 uppercase tracking-widest text-[10px]">Hasta Geri Bildirimi</span>
                <span className="font-extrabold text-amber-500 flex items-center gap-1">
                  ⭐ {ackModalTarget.rating} / 5 Yıldız
                </span>
              </div>
              <p className="font-semibold text-stone-700 dark:text-stone-300 italic">
                "{ackModalTarget.comment || 'Yorum belirtilmemiş.'}"
              </p>
            </div>

            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2.5 ml-1">
                ⚡ Hızlı Kalıp Cümleler (Seçmek için Tıklayın)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {MESSAGE_TEMPLATES.map((tpl) => {
                  const isSelected = ackSelectedTemplate?.id === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tpl)}
                      className={`p-3 rounded-2xl border text-left transition text-xs font-bold flex flex-col justify-between space-y-1 ${
                        isSelected
                          ? 'border-red-500 bg-red-50/60 dark:bg-red-950/40 text-red-700 dark:text-red-300 shadow-sm'
                          : 'border-stone-200 dark:border-stone-800 bg-theme-bg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 font-black">
                        <span>{tpl.emoji}</span>
                        <span>{tpl.title}</span>
                      </div>
                      <p className="text-[11px] font-medium opacity-80 line-clamp-2">{tpl.text}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSendAcknowledgement} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1.5 ml-1">
                  💬 Hastaya Gönderilecek Mesaj Metni
                </label>
                <Textarea
                  required
                  rows={4}
                  value={ackCustomNote}
                  onChange={(e) => setAckCustomNote(e.target.value)}
                  placeholder="Hastaya iletilecek bildirim mesajını buraya yazın..."
                  className="text-xs font-semibold"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 py-3.5 text-xs space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Hastaya Bildirimi Gönder</span>
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setAckModalTarget(null)}
                  className="px-5 py-3.5 text-xs"
                >
                  İptal
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* --- HASTAYA ÇÖZÜM MESAJI GÖNDERME MODALI (BEKLEYEN DÖNÜŞLER İÇİN) --- */}
      {resolveModalTarget && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-theme-card w-full max-w-2xl rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-theme-border space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-slate-200">Çözüm Mesajı Gönder & Bekleyenden Çıkar</h3>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">
                    <span className="text-emerald-600 font-extrabold">{resolveModalTarget.userName}</span> ({resolveModalTarget.userEmail}) için çözüm şablonu seçin veya özel yanıt yazın.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setResolveModalTarget(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-theme-bg rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-50 dark:bg-stone-900/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-800/80 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-black text-stone-400 uppercase tracking-widest text-[10px]">Hasta Geri Bildirimi</span>
                <span className="font-extrabold text-amber-500 flex items-center gap-1">
                  ⭐ {resolveModalTarget.rating} / 5 Yıldız
                </span>
              </div>
              <p className="font-semibold text-stone-700 dark:text-stone-300 italic">
                "{resolveModalTarget.comment || 'Yorum belirtilmemiş.'}"
              </p>
            </div>

            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2.5 ml-1">
                🛠️ Çözüm & Dönüş Şablonları (Seçmek için Tıklayın)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {RESOLUTION_TEMPLATES.map((tpl) => {
                  const isSelected = resolveSelectedTemplate?.id === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleSelectResolutionTemplate(tpl)}
                      className={`p-3 rounded-2xl border text-left transition text-xs font-bold flex flex-col justify-between space-y-1 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-sm'
                          : 'border-stone-200 dark:border-stone-800 bg-theme-bg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 font-black">
                        <span>{tpl.emoji}</span>
                        <span>{tpl.title}</span>
                      </div>
                      <p className="text-[11px] font-medium opacity-80 line-clamp-2">{tpl.text}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSendResolution} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1.5 ml-1">
                  💬 Hastaya İletilecek Çözüm Mesajı
                </label>
                <Textarea
                  required
                  rows={4}
                  value={resolveCustomNote}
                  onChange={(e) => setResolveCustomNote(e.target.value)}
                  placeholder="Hastaya iletilecek çözüm açıklamasını buraya yazın..."
                  className="text-xs font-semibold"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 py-3.5 text-xs space-x-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Çözüm Mesajını Gönder & Tamamla</span>
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setResolveModalTarget(null)}
                  className="px-5 py-3.5 text-xs"
                >
                  İptal
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminFeedbacksTab;
