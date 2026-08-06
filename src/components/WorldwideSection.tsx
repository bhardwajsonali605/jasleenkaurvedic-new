import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { countriesList } from '../data/initialData';
import { Globe2, PhoneCall, MessageCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface WorldwideSectionProps {
  onOpenConsultationModal: (countryName?: string) => void;
  whatsappNumber: string;
}

export const WorldwideSection: React.FC<WorldwideSectionProps> = ({ onOpenConsultationModal, whatsappNumber }) => {
  const { t } = useLanguage();

  const cleanWa = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <section id="worldwide" className="py-20 bg-black relative border-b border-orange-900/30 overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <Globe2 className="w-3.5 h-3.5" />
            <span>{t('ਅੰਤਰਰਾਸ਼ਟਰੀ ਜੋਤਿਸ਼ ਸੇਵਾਵਾਂ', 'Global Astrological Reach')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight">
            {t('ਸਾਡੀਆਂ ਸੇਵਾਵਾਂ ਪੂਰੀ ਦੁਨੀਆ ਵਿੱਚ ਉਪਲਬਧ ਹਨ', 'Our Services Are Available Worldwide')}
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-light">
            {t(
              'ਤੁਸੀਂ ਚਾਹੇ ਕੈਨੇਡਾ, ਯੂ.ਕੇ., ਅਮਰੀਕਾ, ਆਸਟ੍ਰੇਲੀਆ, ਜਾਂ ਦੁਬਈ ਵਿੱਚ ਹੋਵੋ - ਵਾਟਸਐਪ ਅਤੇ ਫੋਨ ਰਾਹੀਂ ਤੁਰੰਤ ਸਲਾਹ ਲਵੋ।',
              'Whether you are in Canada, UK, USA, Australia, or UAE - connect via instant WhatsApp & Phone consultation.'
            )}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full" />
        </div>

        {/* Interactive World Map graphic banner */}
        <div className="mb-12 rounded-3xl p-6 bg-zinc-950 border border-orange-900/30 text-center relative overflow-hidden shadow-[0_0_35px_rgba(234,88,12,0.15)]">
          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <span className="text-4xl text-orange-400 inline-block animate-bounce">🌍</span>
            <h3 className="text-2xl font-serif font-bold text-orange-300">
              {t('28,500+ ਅੰਤਰਰਾਸ਼ਟਰੀ ਸ਼ਰਧਾਲੂਆਂ ਦਾ ਵਿਸ਼ਵਾਸ', 'Trusted by 28,500+ Overseas Clients Worldwide')}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 font-light">
              {t(
                'ਕੈਨੇਡਾ, ਯੂ.ਕੇ., ਅਮਰੀਕਾ, ਆਸਟ੍ਰੇਲੀਆ ਅਤੇ ਯੂ.ਏ.ਈ. ਦੇ ਪੰਜਾਬੀ ਭਾਈਚਾਰੇ ਲਈ ਸਭ ਤੋਂ ਭਰੋਸੇਮੰਦ ਜੋਤਿਸ਼ ਕੇਂਦਰ।',
                'The most trusted astrology & spiritual healing center for the Punjabi diaspora worldwide.'
              )}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-orange-400 font-medium pt-2">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Instant WhatsApp Audio/Video</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Timezone Flexible</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Secure International Payments</span>
            </div>
          </div>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {countriesList.map((country, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.02 }}
              onClick={() => onOpenConsultationModal(country.nameEn)}
              className="cursor-pointer group p-4 rounded-2xl bg-zinc-950 border border-orange-900/30 hover:border-orange-500/60 backdrop-blur-sm text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(234,88,12,0.2)]"
            >
              <div className="text-3xl mb-2 group-hover:scale-125 transition-transform">
                {country.flag}
              </div>
              <div className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors">
                {t(country.namePa, country.nameEn)}
              </div>
              <div className="text-[11px] text-orange-400/80 font-mono mt-0.5">
                {country.code}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Worldwide Callout Banner */}
        <div className="mt-12 text-center">
          <a
            href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(
              t(
                'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੈਂ ਕੈਨੇਡਾ/ਵਿਦੇਸ਼ ਤੋਂ ਸਲਾਹ ਲੈਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।',
                'Sat Sri Akal, I would like to consult from Overseas.'
              )
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>{t('ਵਿਦੇਸ਼ ਤੋਂ ਤੁਰੰਤ ਵਾਟਸਐਪ ਸਲਾਹ ਲਵੋ', 'Consult Worldwide via WhatsApp')}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
