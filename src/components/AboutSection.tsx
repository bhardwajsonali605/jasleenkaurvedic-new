import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { SiteSettings } from '../types';
import { Award, ShieldCheck, HeartHandshake, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

interface AboutSectionProps {
  settings: SiteSettings;
  onOpenConsultationModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings, onOpenConsultationModal }) => {
  const { t } = useLanguage();

  const achievements = [
    {
      titlePa: '15+ ਸਾਲਾਂ ਦਾ ਰੂਹਾਨੀ ਤਜਰਬਾ',
      titleEn: '15+ Years Spiritual Experience',
      descPa: 'ਹਜ਼ਾਰਾਂ ਪਰਿਵਾਰਾਂ ਦੀਆਂ ਜ਼ਿੰਦਗੀਆਂ ਵਿਚ ਖੁਸ਼ਹਾਲੀ ਅਤੇ ਸ਼ਾਂਤੀ ਲਿਆਂਦੀ।',
      descEn: 'Transformed thousands of lives through authentic Vedic & Gurbani guidance.',
    },
    {
      titlePa: '28,500+ ਖੁਸ਼ਹਾਲ ਕਲਾਇੰਟ',
      titleEn: '28,500+ Happy Clients',
      descPa: 'ਭਾਰਤ, ਕੈਨੇਡਾ, ਯੂ.ਕੇ., ਅਮਰੀਕਾ ਅਤੇ ਆਸਟ੍ਰੇਲੀਆ ਵਿੱਚ ਫੈਲੇ ਸ਼ਰਧਾਲੂ।',
      descEn: 'Clients across India, Canada, UK, USA, Australia, and UAE.',
    },
    {
      titlePa: '100% ਗੁਪਤ ਅਤੇ ਭਰੋਸੇਯੋਗ',
      titleEn: '100% Confidential & Honest',
      descPa: 'ਤੁਹਾਡੀ ਹਰ ਗੱਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਗੁਪਤ ਰੱਖੀ ਜਾਂਦੀ ਹੈ।',
      descEn: 'Strict privacy maintained with no fake promises or misleading claims.',
    },
    {
      titlePa: 'ਵਰਲਡਵਾਈਡ ਵਾਟਸਐਪ ਸੇਵਾ',
      titleEn: 'Worldwide WhatsApp Consultations',
      descPa: 'ਘਰ ਬੈਠੇ ਫੋਨ ਅਤੇ ਵਾਟਸਐਪ ਰਾਹੀਂ ਪੂਰੀ ਰਹਿਨੁਮਾਈ।',
      descEn: 'Instant audio/video consultation accessible from anywhere globally.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-black relative border-b border-orange-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>{t('ਮੇਰੀ ਰੂਹਾਨੀ ਯਾਤਰਾ ਅਤੇ ਮਿਸ਼ਨ', 'Spiritual Journey & Mission')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white">
            {t('ਐਸਟ੍ਰੋਲੋਜਰ ਜਸਲੀਨ ਕੌਰ ਜੀ ਬਾਰੇ', 'About Astrologer Jasleen Kaur')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Profile Card & Artwork */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-orange-600/40 via-yellow-500/20 to-zinc-900 shadow-[0_0_40px_rgba(234,88,12,0.2)]">
              <div className="bg-zinc-950 rounded-[22px] overflow-hidden p-6 space-y-6 border border-orange-900/30">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden relative border border-orange-500/30">
                  <img
                    src={settings.jasleenImage}
                    alt="Jasleen Kaur Profile"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <span className="px-3 py-1 rounded-full bg-orange-600 text-black text-xs font-bold uppercase tracking-wider shadow-md">
                      {t('ਵਿਸ਼ਵ ਪ੍ਰਸਿੱਧ ਜੋਤਿਸ਼ੀ', 'World Famous Astrologer')}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-center">
                  <h3 className="text-xl font-serif font-bold text-orange-300">
                    {t('ਐਸਟ੍ਰੋਲੋਜਰ ਜਸਲੀਨ ਕੌਰ', 'Astrologer Jasleen Kaur')}
                  </h3>
                  <p className="text-xs text-zinc-400 font-light">
                    {t(
                      'ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ ਸਾਹਿਬ ਦੀਆਂ ਪਵਿੱਤਰ ਪਰੰਪਰਾਵਾਂ ਅਤੇ ਵੈਦਿਕ ਜੋਤਿਸ਼ ਦੇ ਮਾਹਿਰ',
                      'Rooted in Divine Spiritual Traditions & Ancient Vedic Calculations'
                    )}
                  </p>
                  <div className="flex justify-center gap-1 text-orange-400">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles key={i} className="w-4 h-4 fill-orange-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Description & Pillars */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed font-light">
              <p>
                {t(
                  'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ। ਐਸਟ੍ਰੋਲੋਜਰ ਜਸਲੀਨ ਕੌਰ ਜੀ ਪਿਛਲੇ 15 ਤੋਂ ਵੱਧ ਸਾਲਾਂ ਤੋਂ ਦੇਸ਼-ਵਿਦੇਸ਼ ਦੇ ਲੱਖਾਂ ਸ਼ਰਧਾਲੂਆਂ ਨੂੰ ਰੂਹਾਨੀ ਇਲਾਜ, ਕੁੰਡਲੀ ਵਿਸ਼ਲੇਸ਼ਣ, ਅਤੇ ਗ੍ਰਹਿ ਨਿਵਾਰਨ ਰਾਹੀਂ ਸਹੀ ਰਸਤਾ ਦਿਖਾ ਰਹੇ ਹਨ।',
                  'Sat Sri Akal. Astrologer Jasleen Kaur has been empowering thousands of individuals and families globally for over 15 years through authentic Vedic astrology, Gurbani prayers, and planetary alignment.'
                )}
              </p>
              <p>
                {t(
                  'ਸਾਡਾ ਮੁੱਖ ਮਕਸਦ ਲੋਕਾਂ ਦੇ ਜੀਵਨ ਵਿੱਚੋਂ ਦੁੱਖ, ਕਲੇਸ਼, ਵੀਜ਼ਾ ਰੁਕਾਵਟਾਂ, ਪਿਆਰ ਦੀਆਂ ਨਿਰਾਸ਼ਾਵਾਂ ਅਤੇ ਕਾਰੋਬਾਰੀ ਘਾਟੇ ਨੂੰ ਖਤਮ ਕਰਕੇ ਖੁਸ਼ਹਾਲੀ ਲਿਆਉਣਾ ਹੈ। ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਦੀ ਅਪਾਰ ਕ੍ਰਿਪਾ ਨਾਲ ਹਰ ਸਮੱਸਿਆ ਦਾ ਪੱਕਾ ਸਮਾਧਾਨ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।',
                  'Our divine mission is to eradicate hopelessness, relationship rifts, visa hindrances, domestic friction, and business losses. With the supreme grace of Waheguru Ji, every genuine consultation leads to peace and resolution.'
                )}
              </p>
            </div>

            {/* Grid of 4 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {achievements.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-zinc-950 border border-orange-900/30 backdrop-blur-sm space-y-1 hover:border-orange-500/50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>{t(item.titlePa, item.titleEn)}</span>
                  </div>
                  <p className="text-xs text-zinc-400 pl-6 leading-normal font-light">
                    {t(item.descPa, item.descEn)}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Call */}
            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <button
                onClick={onOpenConsultationModal}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-black font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all"
              >
                {t('ਹੁਣੇ ਸਲਾਹ ਲਵੋ', 'Consult Jasleen Kaur Now')}
              </button>
              <div className="text-xs text-orange-400/90 font-medium">
                {t('✓ 100% ਗੁਪਤਤਾ ਅਤੇ ਸੁੱਚੀ ਰਹਿਨੁਮਾਈ', '✓ 100% Confidential & Authentic Solution')}
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
