import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { SiteSettings } from '../types';
import { MessageCircle, Phone, Calendar, ShieldCheck, Award, Star, Globe2, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  settings: SiteSettings;
  onOpenConsultationModal: (serviceName?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings, onOpenConsultationModal }) => {
  const { t } = useLanguage();

  const whatsappNumber = settings.whatsapp.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    t(
      'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜਸਲੀਨ ਜੀ, ਮੈਂ ਜੋਤਿਸ਼/ਰੂਹਾਨੀ ਇਲਾਜ ਲਈ ਸਲਾਹ ਲੈਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।',
      'Sat Sri Akal Jasleen Kaur Ji, I would like to book a spiritual astrology consultation.'
    )
  )}`;

  return (
    <section id="home" className="relative bg-black pt-10 pb-24 overflow-hidden border-b border-orange-900/30">
      {/* Background Glowing Ambiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-32 right-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Divine Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-[0_0_15px_rgba(234,88,12,0.2)]">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span className="text-orange-300 font-bold text-sm">ੴ</span>
              <span>{t('ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਕ੍ਰਿਪਾ ਕਰਨਗੇ', 'Divine Grace & Universal Healing')}</span>
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-serif font-extrabold tracking-tight text-white leading-[1.15]">
              <span className="bg-gradient-to-r from-orange-400 via-yellow-200 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(234,88,12,0.3)]">
                {t(settings.heroTitlePa, settings.heroTitleEn)}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-zinc-300 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
              {t(settings.heroSubtitlePa, settings.heroSubtitleEn)}
            </p>

            {/* Key Trust Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-orange-900/30 backdrop-blur-sm text-center shadow-lg hover:border-orange-500/40 transition-colors">
                <div className="text-2xl sm:text-3xl font-serif font-bold text-orange-400">100%</div>
                <div className="text-xs text-zinc-400 mt-0.5 font-medium">{t('ਗਰੰਟੀਸ਼ੁਦਾ ਇਲਾਜ', 'Guaranteed Remedies')}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-orange-900/30 backdrop-blur-sm text-center shadow-lg hover:border-orange-500/40 transition-colors">
                <div className="text-2xl sm:text-3xl font-serif font-bold text-orange-400">{settings.experienceYears}+</div>
                <div className="text-xs text-zinc-400 mt-0.5 font-medium">{t('ਸਾਲਾਂ ਦਾ ਤਜਰਬਾ', 'Years Experience')}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-orange-900/30 backdrop-blur-sm text-center shadow-lg hover:border-orange-500/40 transition-colors">
                <div className="text-2xl sm:text-3xl font-serif font-bold text-orange-400">28.5K+</div>
                <div className="text-xs text-zinc-400 mt-0.5 font-medium">{t('ਖੁਸ਼ਹਾਲ ਸ਼ਰਧਾਲੂ', 'Happy Clients')}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-orange-900/30 backdrop-blur-sm text-center shadow-lg hover:border-orange-500/40 transition-colors">
                <div className="text-2xl sm:text-3xl font-serif font-bold text-orange-400">45+</div>
                <div className="text-xs text-zinc-400 mt-0.5 font-medium">{t('ਦੇਸ਼ਾਂ ਵਿੱਚ ਸੇਵਾਵਾਂ', 'Countries Served')}</div>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-4">
              {/* WhatsApp Button */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/40 font-bold text-sm tracking-wide shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{t('ਵਾਟਸਐਪ ਸਲਾਹ ਲਵੋ', 'WhatsApp Consultation')}</span>
              </a>

              {/* Call Now Button */}
              <a
                href={`tel:${settings.phone}`}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-orange-400 border border-orange-500/30 font-bold text-sm tracking-wide shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
              >
                <Phone className="w-5 h-5" />
                <span>{t(`ਕਾਲ ਕਰੋ (${settings.phone})`, `Call Now (${settings.phone})`)}</span>
              </a>

              {/* Book Consultation Modal Trigger */}
              <button
                onClick={() => onOpenConsultationModal()}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-black font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(234,88,12,0.4)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span>{t('ਅਪੁਆਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ', 'Book Consultation')}</span>
              </button>
            </div>

            {/* Trust badge footer */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-2 text-xs text-zinc-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> 100% Confidential
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-orange-400">
                <Star className="w-4 h-4 fill-orange-400 text-orange-400" /> 4.9/5 Rating (850+ Google Reviews)
              </span>
            </div>
          </motion.div>

          {/* Right Column: Dual Images (Waheguru Ji + Astrologer Jasleen Kaur) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 relative">

              {/* Card 1: Sacred Waheguru Ji Image */}
              <div className="relative group rounded-3xl overflow-hidden bg-zinc-900 border border-orange-900/40 shadow-[0_0_35px_rgba(234,88,12,0.25)]">
                <div className="aspect-[4/3] w-full relative overflow-hidden">
                  <img
                    src={settings.waheguruImage}
                    alt="Waheguru Ji Blessing"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  
                  {/* Glowing Ek Onkar Badge */}
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-orange-500/40 px-3 py-1.5 rounded-full flex items-center gap-2 text-orange-300 text-xs font-bold shadow-[0_0_10px_rgba(234,88,12,0.3)]">
                    <span className="text-base text-orange-400 font-serif">ੴ</span>
                    <span>{t('ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਆਸ਼ੀਰਵਾਦ', 'Divine Waheguru Ji Blessing')}</span>
                  </div>
                </div>
                <div className="p-4 bg-zinc-950 border-t border-orange-900/30 text-center">
                  <p className="text-orange-200/90 text-xs font-serif italic">
                    {t('“ਧੁਰ ਕੀ ਬਾਣੀ ਆਈ ॥ ਤਿਨਿ ਸਗਲੀ ਚਿੰਤ ਮਿਟਾਈ ॥”', '"Divine Words eradicate all worldly anxieties."')}
                  </p>
                </div>
              </div>

              {/* Card 2: Astrologer Jasleen Kaur Personal Photo */}
              <div className="relative group rounded-3xl overflow-hidden bg-zinc-900 border border-orange-900/50 shadow-[0_0_40px_rgba(234,88,12,0.3)]">
                <div className="aspect-[3/4] sm:aspect-square lg:aspect-[4/3] w-full relative overflow-hidden">
                  <img
                    src={settings.jasleenImage}
                    alt="Astrologer Jasleen Kaur"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md border border-orange-500/40 p-3.5 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-orange-300 font-serif font-bold text-sm">
                          {t('ਐਸਟ੍ਰੋਲੋਜਰ ਜਸਲੀਨ ਕੌਰ ਜੀ', 'Astrologer Jasleen Kaur')}
                        </div>
                        <div className="text-zinc-400 text-[11px]">
                          {t('ਵਰਲਡ ਗੋਲਡ ਮੈਡਲਿਸਟ ਜੋਤਿਸ਼ੀ', 'World Gold Medalist Spiritual Healer')}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400 flex items-center justify-center text-orange-400 shadow-[0_0_10px_rgba(234,88,12,0.4)]">
                        <Award className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
