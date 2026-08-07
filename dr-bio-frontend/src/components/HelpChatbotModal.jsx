import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, X, Send, Sparkles, FileText, User, MessageSquare, 
  HelpCircle, ShieldCheck, ChevronRight, RotateCcw, AlertTriangle 
} from 'lucide-react';

const PRESET_QUESTIONS = [
  {
    id: 'upload',
    icon: FileText,
    question: 'Tahlil raporumu nasıl yükleyebilirim ve analiz ettirebilirim?',
    answer: 'Tahlil yüklemek çok kolay! Sol menüdeki "Tahlil Yükle" sekmesine tıklayarak PDF veya resim formatındaki tahlil belgenizi sürükleyip bırakabilirsiniz. Akıllı sistemimiz parametreleri saniyeler içinde otomatik analiz eder.',
    actionText: 'Tahlil Yükleme Sayfasına Git',
    actionPath: '/patient/upload'
  },
  {
    id: 'reference',
    icon: AlertTriangle,
    question: 'Referans dışı kırmızı ile vurgulanan değerler ne anlama geliyor?',
    answer: 'Kırmızı renkle vurgulanan değerler, laboratuvar standart referans aralığının altında veya üstünde kalan parametrelerdir. Bu değerler olası riskleri gösterir ancak kesin teşhis yerine hekiminize danışmanız tavsiye edilir.',
    actionText: 'Tahlil Geçmişimi İncele',
    actionPath: '/patient/history'
  },
  {
    id: 'kvkk',
    icon: ShieldCheck,
    question: 'Kişisel ve tıbbi sağlık verilerim güvende mi?',
    answer: 'Sağlık ve kişisel verileriniz güvenliğiniz için özenle korunur ve yalnızca hesabınıza bağlı yetkili işlemlerde kullanılır. Verileriniz üçüncü şahıslarla asla paylaşılmaz.',
  },
  {
    id: 'history',
    icon: FileText,
    question: 'Eski tahlillerimi ve analiz raporlarımı nerede bulabilirim?',
    answer: 'Tüm geçmiş tahlil analizlerinize "Geçmiş Tahlillerim" sekmesinden ulaşabilirsiniz. Burada tarih bazlı filtreleme yapabilir ve detaylı analiz raporlarını inceleyebilirsiniz.',
    actionText: 'Geçmiş Tahlillerime Git',
    actionPath: '/patient/history'
  },
  {
    id: 'feedback',
    icon: MessageSquare,
    question: 'Sistemle ilgili öneri veya şikayetimi nasıl iletirim?',
    answer: 'Ana sayfadaki "Geri Bildirim & Yıldız Ver" butonuna tıklayarak veya yönetime doğrudan iletmek istediğiniz görüşlerinizi yıldız puanlamasıyla bize gönderebilirsiniz. Yönetim ekibimiz tüm bildirimleri titizlikle inceler.',
  },
  {
    id: 'profile',
    icon: User,
    question: 'Profil bilgilerimi (yaş, boy, kilo, alerji) nasıl güncellerim?',
    answer: 'Sol menüden "Profilim" sekmesine girerek "Bilgileri Düzenle" butonuna tıklayabilir veya sol taraftaki "Hızlı Tamamla" alanını kullanarak kişisel sağlık profilinizi güncelleyebilirsiniz.',
    actionText: 'Profil Sayfasına Git',
    actionPath: '/patient/profile'
  }
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: 'Merhaba! Ben Dr. Bio Akıllı Asistanı. 🤖❤️\nSağlık paneli, tahlil yükleme veya profilinizle ilgili yaşadığınız tüm konularda size yardımcı olmaya hazırım. Aşağıdaki hazır sorulardan birini seçebilir veya sorunuzu doğrudan yazabilirsiniz.',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const HelpChatbotModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSelectQuestion = (qObj) => {
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: qObj.question,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: qObj.answer,
        actionText: qObj.actionText,
        actionPath: qObj.actionPath,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 500);
  };

  const handleCustomSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userQuery = inputText.trim();
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userQuery,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = 'Sorunuzu aldım. Dr. Bio paneli üzerinden tahlillerinizi yükleyebilir, referans değerlerinizi takip edebilir ve profilinizi güncelleyebilirsiniz. Detaylı destek için destek@drbio.com adresimizden bize ulaşabilirsiniz.';
      let actText = null;
      let actPath = null;

      const lower = userQuery.toLowerCase();
      if (lower.includes('tahlil') || lower.includes('yükle') || lower.includes('pdf')) {
        botResponse = 'Tahlil belgenizi (PDF veya Görsel) "Tahlil Yükle" sekmesinden kolayca yükleyerek anında AI destekli analiz alabilirsiniz.';
        actText = 'Tahlil Yükleme Sayfasına Git';
        actPath = '/patient/upload';
      } else if (lower.includes('profil') || lower.includes('kilo') || lower.includes('boy') || lower.includes('yaş')) {
        botResponse = 'Profil bilgilerinizi güncel tutmak yapay zeka tahlil analizi doğruluk oranını artırır. Profilim sekmesinden kolayca güncelleyebilirsiniz.';
        actText = 'Profilim Sayfasına Git';
        actPath = '/patient/profile';
      } else if (lower.includes('kırmızı') || lower.includes('referans') || lower.includes('sonuç')) {
        botResponse = 'Laboratuvar analizinizde referans aralığı dışında çıkan parametreler kırmızı ile vurgulanır. Geçmiş tahlillerinizden tüm sonuçları inceleyebilirsiniz.';
        actText = 'Geçmiş Tahlillerim';
        actPath = '/patient/history';
      } else if (lower.includes('güven') || lower.includes('kvkk') || lower.includes('şifre')) {
        botResponse = 'Sağlık ve kişisel verileriniz güvenliğiniz için özenle korunur ve yalnızca hesabınıza bağlı yetkili işlemlerde kullanılır.';
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        actionText: actText,
        actionPath: actPath,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return createPortal(
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-theme-card w-full max-w-xl rounded-[2.5rem] shadow-2xl border-theme-border flex flex-col h-[620px] max-h-[92vh] overflow-hidden">
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-900 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-inner">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-lg text-white">Dr. Bio Destek Asistanı</h3>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-xs font-medium text-red-100">7/24 Akıllı Sağlık & Panel Desteği</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetChat}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
              title="Sohbeti Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-theme-bg/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[78%] p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-red-600 text-white rounded-br-none font-semibold'
                    : 'bg-theme-card text-stone-800 dark:text-stone-100 border border-stone-200/80 dark:border-stone-800 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.actionText && msg.actionPath && (
                  <div className="mt-3 pt-2.5 border-t border-stone-200/60 dark:border-stone-700/60">
                    <button
                      onClick={() => {
                        onClose();
                        navigate(msg.actionPath);
                      }}
                      className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-sm transition flex items-center space-x-1.5"
                    >
                      <span>{msg.actionText}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold text-stone-400 px-1">
                {msg.time}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-stone-400 text-xs font-bold p-2">
              <Bot className="w-4 h-4 text-red-600 animate-bounce" />
              <span>Dr. Bio yazıyor...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Questions Chips Carousel */}
        <div className="p-3 bg-theme-card border-t border-stone-200 dark:border-stone-800 shrink-0">
          <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-2 px-1">
            Sık Sorulan Hazır Konular:
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {PRESET_QUESTIONS.map((q) => {
              const IconComp = q.icon;
              return (
                <button
                  key={q.id}
                  onClick={() => handleSelectQuestion(q)}
                  className="px-3 py-2 bg-theme-bg hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-300 dark:hover:border-red-800 border border-stone-200/70 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl text-xs font-bold shrink-0 transition flex items-center space-x-1.5 shadow-2xs"
                >
                  <IconComp className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span className="truncate max-w-[200px]">{q.question}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input Bar */}
        <form onSubmit={handleCustomSend} className="p-3 sm:p-4 bg-theme-card border-t border-stone-200 dark:border-stone-800 flex items-center space-x-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Sorunuzu buraya yazabilirsiniz..."
            className="flex-1 px-4 py-3 bg-theme-bg border border-stone-200 dark:border-stone-800 rounded-2xl text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-2xl shadow-clay-btn transition shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>,
    document.body
  );
};

export default HelpChatbotModal;
