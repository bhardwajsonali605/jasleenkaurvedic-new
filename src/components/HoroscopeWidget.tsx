import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Compass, ShieldCheck, ArrowRight } from 'lucide-react';

interface HoroscopeWidgetProps {
  onOpenConsultationModal: (serviceName?: string) => void;
}

const zodiacSigns = [
  { signPa: 'ਮੇਖ (Aries)', signEn: 'Aries', dates: 'Mar 21 - Apr 19', element: 'Fire', remedyPa: 'ਮੰਗਲ ਗ੍ਰਹਿ ਸ਼ਾਂਤੀ ਲਈ ਲਾਲ ਰੰਗ ਦਾ ਦਾਨ ਕਰੋ ਅਤੇ ਹਨੂਮਾਨ ਚਾਲੀਸਾ ਦਾ ਪਾਠ ਕਰੋ।', remedyEn: 'Donate red items to balance Mars and chant Gurbani/Hanuman prayer.' },
  { signPa: 'ਬ੍ਰਿਖ (Taurus)', signEn: 'Taurus', dates: 'Apr 20 - May 20', element: 'Earth', remedyPa: 'ਸ਼ੁੱਕਰ ਦੋਸ਼ ਨਿਵਾਰਨ ਲਈ ਸਫੈਦ ਚੀਜ਼ਾਂ ਦਾਨ ਕਰੋ। ਪਤੀ-ਪਤਨੀ ਵਿੱਚ ਪਿਆਰ ਵਧੇਗਾ।', remedyEn: 'Donate white grains to harmonize Venus and restore family peace.' },
  { signPa: 'ਮਿਥੁਨ (Gemini)', signEn: 'Gemini', dates: 'May 21 - Jun 20', element: 'Air', remedyPa: 'ਬੁੱਧ ਗ੍ਰਹਿ ਅਨੁਕੂਲ ਕਰਨ ਲਈ ਹਰੇ ਰੰਗ ਦਾ ਪ੍ਰਯੋਗ ਕਰੋ। ਕਰੀਅਰ ਵਿਚ ਸਫਲਤਾ ਮਿਲੇਗੀ।', remedyEn: 'Keep green elements near work space to boost Mercury and career.' },
  { signPa: 'ਕਰਕ (Cancer)', signEn: 'Cancer', dates: 'Jun 21 - Jul 22', element: 'Water', remedyPa: 'ਚੰਦਰਮਾ ਮਜ਼ਬੂਤ ਕਰਨ ਲਈ ਚਾਂਦੀ ਧਾਰਨ ਕਰੋ। ਮਾਨਸਿਕ ਤਣਾਅ ਦੂਰ ਹੋਵੇਗਾ।', remedyEn: 'Wear silver to calm Moon energy and alleviate mental stress.' },
  { signPa: 'ਸਿੰਘ (Leo)', signEn: 'Leo', dates: 'Jul 23 - Aug 22', element: 'Fire', remedyPa: 'ਸੂਰਜ ਦੇਵਤਾ ਦੀ ਪੂਜਾ ਕਰੋ। ਬਿਜ਼ਨਸ ਅਤੇ ਸਮਾਜਿਕ ਮਾਣ-ਸਤਿਕਾਰ ਵਧੇਗਾ।', remedyEn: 'Offer morning prayers to Sun to boost business authority.' },
  { signPa: 'ਕੰਨਿਆ (Virgo)', signEn: 'Virgo', dates: 'Aug 23 - Sep 22', element: 'Earth', remedyPa: 'ਪੜ੍ਹਾਈ ਅਤੇ ਵੀਜ਼ਾ ਰੁਕਾਵਟਾਂ ਦੂਰ ਕਰਨ ਲਈ ਬੁੱਧ ਮੰਤਰ ਜਪੋ।', remedyEn: 'Chant Mercury mantras to clear student visa and study hurdles.' },
  { signPa: 'ਤੁਲਾ (Libra)', signEn: 'Libra', dates: 'Sep 23 - Oct 22', element: 'Air', remedyPa: 'ਵਿਆਹ ਦੇ ਝਗੜਿਆਂ ਲਈ ਗਊ ਸੇਵਾ ਕਰੋ। ਰਿਸ਼ਤਿਆਂ ਵਿਚ ਮਿਠਾਸ ਆਵੇਗੀ।', remedyEn: 'Perform selfless service to restore marital harmony.' },
  { signPa: 'ਬ੍ਰਿਸ਼ਚਕ (Scorpio)', signEn: 'Scorpio', dates: 'Oct 23 - Nov 21', element: 'Fire', remedyPa: 'ਬੁਰੀ ਨਜ਼ਰ ਤੋਂ ਬਚਣ ਲਈ ਸ਼ਨੀਵਾਰ ਨੂੰ ਤੇਲ ਦਾਨ ਕਰੋ।', remedyEn: 'Donate oil on Saturdays to remove evil eye energy.' },
  { signPa: 'ਧਨੂ (Sagittarius)', signEn: 'Sagittarius', dates: 'Nov 22 - Dec 21', element: 'Fire', remedyPa: 'ਗੁਰੂ ਗ੍ਰਹਿ ਅਨੁਕੂਲਤਾ ਲਈ ਕੇਸਰ ਦਾ ਤਿਲਕ ਲਗਾਓ।', remedyEn: 'Apply saffron mark for Jupiter blessings and financial prosperity.' },
  { signPa: 'ਮਕਰ (Capricorn)', signEn: 'Capricorn', dates: 'Dec 22 - Jan 19', element: 'Earth', remedyPa: 'ਸ਼ਨੀ ਢੱਈਆ / ਸਾੜ੍ਹਸਤੀ ਨਿਵਾਰਨ ਲਈ ਰੂਹਾਨੀ ਇਲਾਜ ਕਰੋ।', remedyEn: 'Spiritual prayers to mitigate Saturn (Shani) transit hurdles.' },
  { signPa: 'ਕੁੰਭ (Aquarius)', signEn: 'Aquarius', dates: 'Jan 20 - Feb 18', element: 'Air', remedyPa: 'ਮਾਲੀ ਤੰਗੀ ਦੂਰ ਕਰਨ ਲਈ ਪੀਲੇ ਚਾਵਲ ਦਾਨ ਕਰੋ।', remedyEn: 'Donate yellow rice for debt relief and financial stability.' },
  { signPa: 'ਮੀਨ (Pisces)', signEn: 'Pisces', dates: 'Feb 19 - Mar 20', element: 'Water', remedyPa: 'ਵਿਦੇਸ਼ ਯਾਤਰਾ ਵਿਚ ਆ ਰਹੀਆਂ ਰੁਕਾਵਟਾਂ ਲਈ ਗ੍ਰਹਿ ਸ਼ਾਂਤੀ ਕਰੋ।', remedyEn: 'Special Rahu remedies to clear foreign transit delays.' },
];

export const HoroscopeWidget: React.FC<HoroscopeWidgetProps> = ({ onOpenConsultationModal }) => {
  const { t } = useLanguage();
  const [selectedSign, setSelectedSign] = useState(zodiacSigns[0]);

  return (
    <section id="horoscope" className="py-20 bg-black relative border-b border-orange-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>{t('ਤੁਰੰਤ ਰਾਸ਼ੀਫਲ ਅਤੇ ਗ੍ਰਹਿ ਨਿਵਾਰਨ', 'Instant Zodiac & Planetary Guidance')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white">
            {t('ਆਪਣੀ ਰਾਸ਼ੀ ਅਨੁਸਾਰ ਅਚੂਕ ਉਪਾਅ ਜਾਣੋ', 'Find Personalized Remedies for Your Zodiac Sign')}
          </h2>
          <p className="text-zinc-400 text-sm font-light">
            {t(
              'ਹੇਠਾਂ ਆਪਣੀ ਰਾਸ਼ੀ ਚੁਣੋ ਅਤੇ ਜਾਣੋ ਕਿ ਗ੍ਰਹਿਆਂ ਦੀ ਚਾਲ ਤੁਹਾਡੇ ਜੀਵਨ ‘ਤੇ ਕੀ ਪ੍ਰਭਾਵ ਪਾ ਰਹੀ ਹੈ।',
              'Select your sign below for instant spiritual insight & recommended astrological alignment.'
            )}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full" />
        </div>

        {/* Zodiac Sign Picker Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-8">
          {zodiacSigns.map((z, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSign(z)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                selectedSign.signEn === z.signEn
                  ? 'bg-gradient-to-br from-orange-600 to-orange-400 border-orange-300 text-black font-bold shadow-[0_0_20px_rgba(234,88,12,0.4)] scale-105'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-orange-500/50 hover:text-orange-300'
              }`}
            >
              <div className="text-xs font-semibold truncate">{t(z.signPa, z.signEn)}</div>
              <div className="text-[10px] opacity-75">{z.dates}</div>
            </button>
          ))}
        </div>

        {/* Active Sign Result Card */}
        <div className="rounded-3xl bg-zinc-950 border border-orange-900/40 p-6 sm:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(234,88,12,0.15)] max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-2xl font-serif font-extrabold text-orange-300">
                  {t(selectedSign.signPa, selectedSign.signEn)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-xs border border-orange-500/30 font-medium">
                  {selectedSign.dates}
                </span>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed pt-1 font-light">
                <strong className="text-orange-400 font-semibold">{t('ਅਚੂਕ ਉਪਾਅ: ', 'Recommended Remedy: ')}</strong>
                {t(selectedSign.remedyPa, selectedSign.remedyEn)}
              </p>
              <div className="text-xs text-zinc-400 flex items-center justify-center md:justify-start gap-2 font-light">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t('ਪੂਰੇ ਗ੍ਰਹਿ ਨਿਵਾਰਨ ਰਿਪੋਰਟ ਲਈ ਜਸਲੀਨ ਕੌਰ ਜੀ ਨਾਲ ਸੰਪਰਕ ਕਰੋ', 'For full birth chart reading, contact Astrologer Jasleen Kaur')}</span>
              </div>
            </div>

            <button
              onClick={() => onOpenConsultationModal(t(selectedSign.signPa, selectedSign.signEn) + ' Horoscope')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-black font-bold text-xs uppercase tracking-wider shrink-0 shadow-[0_0_15px_rgba(234,88,12,0.4)] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('ਪੂਰੀ ਕੁੰਡਲੀ ਰਿਪੋਰਟ ਲਵੋ', 'Get Full Horoscope')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
