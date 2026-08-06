import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { ServiceItem } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { Sparkles, Search, ArrowRight, ShieldCheck, Star } from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
  onOpenConsultationModal: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onOpenConsultationModal }) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Relationships', 'Family', 'Career', 'Finance', 'Astrology', 'Spiritual'];

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      service.titlePa.toLowerCase().includes(query) ||
      service.titleEn.toLowerCase().includes(query) ||
      service.descPa.toLowerCase().includes(query) ||
      service.descEn.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="services" className="py-20 bg-black relative border-b border-orange-900/30">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('21+ ਅਚੂਕ ਅਤੇ ਗਰੰਟੀਸ਼ੁਦਾ ਰੂਹਾਨੀ ਸੇਵਾਵਾਂ', '21+ Authentic Spiritual & Astrological Solutions')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight">
            <span className="bg-gradient-to-r from-orange-400 via-yellow-200 to-orange-400 bg-clip-text text-transparent">
              {t('ਸਾਡੀਆਂ ਪ੍ਰਮੁੱਖ ਜੋਤਿਸ਼ ਸੇਵਾਵਾਂ', 'Our Premium Astrology Services')}
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-light">
            {t(
              'ਹਰ ਸਮੱਸਿਆ ਦਾ ਸਹੀ ਗ੍ਰਹਿ ਵਿਸ਼ਲੇਸ਼ਣ, ਰੂਹਾਨੀ ਇਲਾਜ ਅਤੇ 100% ਗੁਪਤ ਗਰੰਟੀਸ਼ੁਦਾ ਸਮਾਧਾਨ।',
              'Comprehensive horoscope readings, spiritual cleansing, and permanent solutions for all life obstacles.'
            )}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full" />
        </div>

        {/* Search & Category Filters */}
        <div className="space-y-6 mb-12">
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('ਸੇਵਾ ਲੱਭੋ (ਜਿਵੇਂ: ਵੀਜ਼ਾ, ਪਿਆਰ, ਕਾਰੋਬਾਰ)...', 'Search service (e.g. Visa, Love, Business)...')}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-zinc-950 border border-orange-900/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-lg transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-orange-600 to-orange-400 text-black font-bold shadow-[0_0_15px_rgba(234,88,12,0.4)] scale-105'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-orange-300 hover:border-orange-500/40'
                }`}
              >
                {cat === 'All' ? t('ਸਭ ਸੇਵਾਵਾਂ (All)', 'All Services') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative rounded-3xl bg-zinc-950/90 border border-orange-900/30 hover:border-orange-500/60 p-6 flex flex-col justify-between backdrop-blur-md shadow-xl hover:shadow-[0_15px_40px_rgba(234,88,12,0.15)] transition-all duration-300 hover:-translate-y-1"
            >
              {/* Popular Glow Badge */}
              {service.popular && (
                <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-400/50 text-orange-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_8px_rgba(234,88,12,0.4)]">
                  <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                  <span>{t('ਪ੍ਰਮੁੱਖ', 'Popular')}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 via-orange-600/10 to-transparent border border-orange-500/40 flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(234,88,12,0.2)]">
                  <DynamicIcon name={service.iconName} className="w-6 h-6" />
                </div>

                {/* Category Badge */}
                <div className="text-[11px] font-semibold uppercase tracking-wider text-orange-400">
                  {service.category}
                </div>

                {/* Title */}
                <h3 className="text-lg font-serif font-bold text-white group-hover:text-orange-300 transition-colors">
                  {t(service.titlePa, service.titleEn)}
                </h3>

                {/* Description */}
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light">
                  {t(service.descPa, service.descEn)}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-zinc-900 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Solution
                </span>

                <button
                  onClick={() => onOpenConsultationModal(t(service.titlePa, service.titleEn))}
                  className="px-4 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-600 border border-orange-500/30 hover:border-orange-400 text-orange-300 hover:text-black text-xs font-bold flex items-center gap-1.5 transition-all group-hover:shadow-[0_0_12px_rgba(234,88,12,0.4)]"
                >
                  <span>{t('ਸਲਾਹ ਲਵੋ', 'Book Solution')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12 text-neutral-400">
            {t('ਕੋਈ ਸੇਵਾ ਨਹੀਂ ਮਿਲੀ। ਕਿਰਪਾ ਕਰਕੇ ਕੋਈ ਹੋਰ ਸ਼ਬਦ ਖੋਜੋ।', 'No service found matching your search query.')}
          </div>
        )}

      </div>
    </section>
  );
};
