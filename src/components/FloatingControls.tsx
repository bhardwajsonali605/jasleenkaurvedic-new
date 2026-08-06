import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MessageCircle, Phone, ArrowUp, X, Instagram, Camera, Lock } from 'lucide-react';

interface FloatingControlsProps {
  phone: string;
  whatsapp: string;
  instagram: string;
  snapchat: string;
  onOpenAdmin?: () => void;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({ phone, whatsapp, instagram, snapchat, onOpenAdmin }) => {
  const { t } = useLanguage();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanWa = whatsapp.replace(/[^0-9]/g, '');
  const directWaUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    t('ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜਸਲੀਨ ਜੀ, ਮੈਨੂੰ ਜੋਤਿਸ਼ ਸਲਾਹ ਚਾਹੀਦੀ ਹੈ।', 'Sat Sri Akal Jasleen Kaur Ji, I require spiritual astrology advice.')
  )}`;

  return (
    <>
      {/* Floating Popup Chat Widget */}
      {chatOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 max-w-xs w-full bg-neutral-900 border border-amber-500/40 rounded-3xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-amber-300">
                {t('ਐਸਟ੍ਰੋਲੋਜਰ ਜਸਲੀਨ ਕੌਰ ਲਾਈਵ', 'Jasleen Kaur Online')}
              </span>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-950 text-xs text-neutral-200 leading-relaxed border border-neutral-800">
            {t(
              'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ! ਕੀ ਤੁਸੀਂ ਆਪਣੀ ਲਵ ਲਾਈਫ, ਵੀਜ਼ਾ, ਜਾਂ ਕਾਰੋਬਾਰੀ ਮੁਸ਼ਕਿਲ ਲਈ ਸਲਾਹ ਲੈਣਾ ਚਾਹੁੰਦੇ ਹੋ?',
              'Sat Sri Akal! Are you seeking remedies for love disputes, visa hurdles, or business success?'
            )}
          </div>

          <a
            href={directWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{t('ਵਾਟਸਐਪ ‘ਤੇ ਚੈਟ ਸ਼ੁਰੂ ਕਰੋ', 'Start WhatsApp Chat')}</span>
          </a>
        </div>
      )}

      {/* Floating Buttons Stack */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        
        {/* Admin Panel Floating Button */}
        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="px-3 py-1.5 rounded-full bg-black/90 border border-orange-500/50 text-orange-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold shadow-lg backdrop-blur-md transition-all transform hover:scale-105"
            title="Open Admin Panel"
          >
            <Lock className="w-3.5 h-3.5 text-orange-400" />
            <span>Admin</span>
          </button>
        )}

        {/* Back To Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="w-11 h-11 rounded-full bg-neutral-900 border border-amber-500/40 text-amber-400 hover:bg-neutral-800 flex items-center justify-center shadow-lg transition-all transform hover:scale-110"
            title="Back to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* Floating Call Button */}
        <a
          href={`tel:${phone}`}
          className="w-12 h-12 rounded-full bg-amber-500 text-neutral-950 font-bold flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all transform hover:scale-110"
          title={`Call ${phone}`}
        >
          <Phone className="w-6 h-6" />
        </a>

        {/* Floating WhatsApp Button */}
        <div className="relative">
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all transform hover:scale-110 animate-bounce"
            title="WhatsApp Chat"
          >
            <MessageCircle className="w-7 h-7 fill-current" />
          </button>
          <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-amber-400 border-2 border-neutral-950 animate-pulse" />
        </div>

      </div>
    </>
  );
};
