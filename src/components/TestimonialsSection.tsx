import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { TestimonialItem } from '../types';
import { Star, MessageSquareQuote, ShieldCheck, Heart } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
  onOpenConsultationModal: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials, onOpenConsultationModal }) => {
  const { t } = useLanguage();

  return (
    <section id="testimonials" className="py-20 bg-black relative border-b border-orange-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>{t('ਸ਼ਰਧਾਲੂਆਂ ਦੇ ਸੱਚੇ ਅਨੁਭਵ', 'Verified Client Testimonials')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight">
            {t('ਦੇਸ਼-ਵਿਦੇਸ਼ ਤੋਂ ਆਏ ਖੁਸ਼ਹਾਲ ਸ਼ਰਧਾਲੂਆਂ ਦੇ ਵਿਚਾਰ', 'What Our Worldwide Clients Say')}
          </h2>
          <p className="text-zinc-400 text-sm font-light">
            {t(
              'ਕੈਨੇਡਾ, ਯੂ.ਕੇ., ਅਮਰੀਕਾ, ਆਸਟ੍ਰੇਲੀਆ ਅਤੇ ਭਾਰਤ ਦੇ ਹਜ਼ਾਰਾਂ ਪਰਿਵਾਰਾਂ ਨੇ ਪਾਇਆ ਸੁਖੀ ਸਮਾਧਾਨ।',
              'Read real experiences from clients across Canada, UK, USA, Australia, and India.'
            )}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full" />
        </div>

        {/* Grid of Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 sm:p-8 rounded-3xl bg-zinc-950/90 border border-orange-900/30 hover:border-orange-500/50 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-4 hover:shadow-[0_10px_30px_rgba(234,88,12,0.15)] transition-all"
            >
              <div className="space-y-4">
                {/* Rating & Flag */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-orange-400">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <span className="text-2xl" title={item.country}>
                    {item.flagEmoji}
                  </span>
                </div>

                {/* Review Quote */}
                <p className="text-zinc-200 text-sm sm:text-base leading-relaxed font-light italic">
                  “{t(item.reviewPa, item.reviewEn)}”
                </p>
              </div>

              {/* Client Info Footer */}
              <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-serif font-bold text-orange-300">{item.name}</h3>
                  <p className="text-xs text-zinc-400 flex items-center gap-1 font-light">
                    <span>{item.country}</span>
                    <span>•</span>
                    <span className="text-orange-400">{item.service}</span>
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center space-y-3">
          <button
            onClick={onOpenConsultationModal}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-black font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all"
          >
            {t('ਆਪਣੀ ਸਮੱਸਿਆ ਦਾ ਸਮਾਧਾਨ ਪਾਓ', 'Get Solution for Your Problem')}
          </button>
        </div>

      </div>
    </section>
  );
};
