import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SiteSettings } from '../types';
import { Phone, MessageCircle, Mail, ShieldCheck, Heart, Lock } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  onOpenConsultationModal: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenConsultationModal, onOpenAdmin }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-black border-t border-orange-900/30 text-zinc-400 text-xs py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center font-bold text-black text-xl shadow-[0_0_20px_rgba(234,88,12,0.5)]">
                ੴ
              </div>
              <div>
                <div className="text-base font-serif font-bold text-white">
                  {t('ਐਸਟ੍ਰੋਲੋਜਰ ਜਸਲੀਨ ਕੌਰ', 'Astro Jasleen Kaur')}
                </div>
                <div className="text-[10px] text-orange-400 font-medium tracking-wide uppercase">
                  {t('ਰੂਹਾਨੀ ਇਲਾਜ ਅਤੇ ਵੈਦਿਕ ਜੋਤਿਸ਼', 'Spiritual Healing & Vedic Astrology')}
                </div>
              </div>
            </div>
            <p className="text-zinc-400 leading-relaxed text-xs font-light">
              {t(
                'ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਦੀ ਮਿਹਰ ਨਾਲ ਲੱਖਾਂ ਸ਼ਰਧਾਲੂਆਂ ਦੀਆਂ ਜ਼ਿੰਦਗੀਆਂ ਵਿਚ ਖੁਸ਼ਹਾਲੀ ਅਤੇ ਸ਼ਾਂਤੀ ਲਿਆਉਣ ਲਈ ਵਚਨਬੱਧ।',
                'Dedicated to restoring harmony, prosperity, and peace across families globally with divine blessings.'
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif font-bold text-orange-300 uppercase tracking-wider">
              {t('ਤੁਰੰਤ ਲਿੰਕ', 'Quick Links')}
            </h4>
            <ul className="space-y-2 font-light">
              <li><a href="#home" className="hover:text-orange-400 transition-colors">{t('ਹੋਮ (Home)', 'Home')}</a></li>
              <li><a href="#about" className="hover:text-orange-400 transition-colors">{t('ਮੇਰੇ ਬਾਰੇ (About Me)', 'About Me')}</a></li>
              <li><a href="#services" className="hover:text-orange-400 transition-colors">{t('ਸੇਵਾਵਾਂ (Services)', 'Services')}</a></li>
              <li><a href="#worldwide" className="hover:text-orange-400 transition-colors">{t('ਵਰਲਡਵਾਈਡ (Worldwide)', 'Worldwide')}</a></li>
              <li><a href="#gallery" className="hover:text-orange-400 transition-colors">{t('ਗੈਲਰੀ (Gallery)', 'Gallery')}</a></li>
              <li><a href="#blog" className="hover:text-orange-400 transition-colors">{t('ਬਲੌਗ (Blog)', 'Blog')}</a></li>
            </ul>
          </div>

          {/* Services list */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif font-bold text-orange-300 uppercase tracking-wider">
              {t('ਪ੍ਰਮੁੱਖ ਸੇਵਾਵਾਂ', 'Popular Services')}
            </h4>
            <ul className="space-y-2 font-light">
              <li><a href="#services" className="hover:text-orange-400 transition-colors">{t('ਪਿਆਰ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ (Love Problem)', 'Love Problem Solution')}</a></li>
              <li><a href="#services" className="hover:text-orange-400 transition-colors">{t('ਵੀਜ਼ਾ ਅਤੇ ਪੀ.ਆਰ. ਰੁਕਾਵਟਾਂ (Visa & PR)', 'Visa & PR Solutions')}</a></li>
              <li><a href="#services" className="hover:text-orange-400 transition-colors">{t('ਪਤੀ-ਪਤਨੀ ਝਗੜਾ (Husband Wife Dispute)', 'Husband Wife Disputes')}</a></li>
              <li><a href="#services" className="hover:text-orange-400 transition-colors">{t('ਬੁਰੀ ਨਜ਼ਰ ਨਿਵਾਰਨ (Evil Eye Removal)', 'Black Magic & Evil Eye')}</a></li>
              <li><a href="#services" className="hover:text-orange-400 transition-colors">{t('ਕਰੀਅਰ ਅਤੇ ਬਿਜ਼ਨਸ (Career & Business)', 'Career & Business Growth')}</a></li>
            </ul>
          </div>

          {/* Contact Details & Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif font-bold text-orange-300 uppercase tracking-wider">
              {t('ਸੰਪਰਕ ਜਾਣਕਾਰੀ', 'Contact Information')}
            </h4>
            <div className="space-y-2 font-light">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400" />
                <a href={`tel:${settings.phone}`} className="hover:text-orange-300">{settings.phone}</a>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <MessageCircle className="w-4 h-4" />
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-semibold"
                >
                  {settings.whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400" />
                <a href={`mailto:${settings.email}`} className="hover:text-orange-300 break-all">{settings.email}</a>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <a
                href={`https://instagram.com/${settings.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-pink-400 hover:border-pink-500 font-semibold"
              >
                Instagram
              </a>
              <a
                href={`https://snapchat.com/add/${settings.snapchat}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-yellow-400 hover:border-yellow-500 font-semibold"
              >
                Snapchat
              </a>
            </div>
          </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-zinc-900 text-center space-y-4">
          <p className="text-[11px] text-zinc-500 max-w-4xl mx-auto leading-relaxed font-light">
            {t(
              'ਬੇਦਾਅਵਾ (Disclaimer): ਜੋਤਿਸ਼ ਅਤੇ ਰੂਹਾਨੀ ਇਲਾਜ ਵੈਦਿਕ ਗਿਆਨ ਅਤੇ ਸ਼ਰਧਾ ‘ਤੇ ਅਧਾਰਿਤ ਹੈ। ਨਤੀਜੇ ਵਿਅਕਤੀਗਤ ਗ੍ਰਹਿਆਂ ਅਤੇ ਅਰਦਾਸ ਅਨੁਸਾਰ ਭਿੰਨ ਹੋ ਸਕਦੇ ਹਨ। ਸਾਡਾ ਮਕਸਦ ਕੇਵਲ ਸਕਾਰਾਤਮਕ ਮਾਰਗਦਰਸ਼ਨ ਦੇਣਾ ਹੈ।',
              'Disclaimer: Astrology & Spiritual healing remedies are based on Vedic tradition and personal faith. Individual results may vary based on planetary alignments. All consultation conversations remain 100% private.'
            )}
          </p>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-500 gap-4 pt-2 font-light">
            <div>
              © 2026 Astro Jasleen Kaur. {t('ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।', 'All Rights Reserved.')}
            </div>
            <div className="flex items-center gap-4">
              <a href="#home" className="hover:text-zinc-300">Privacy Policy</a>
              <span>•</span>
              <a href="#home" className="hover:text-zinc-300">Terms of Service</a>
              {onOpenAdmin && (
                <>
                  <span>•</span>
                  <button
                    onClick={onOpenAdmin}
                    className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/30"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Admin Panel</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
