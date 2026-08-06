import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { initialFaqs } from '../data/initialData';
import { FaqItem } from '../types';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

interface FaqSectionProps {
  faqs?: FaqItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const displayFaqs = (faqs && faqs.length > 0) ? faqs : initialFaqs.map((f, i) => ({
    id: `faq-${i}`,
    questionPa: f.qPa,
    questionEn: f.qEn,
    answerPa: f.aPa,
    answerEn: f.aEn,
  }));

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-black relative border-b border-orange-900/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('ਆਮ ਪੁੱਛੇ ਜਾਣ ਵਾਲੇ ਸਵਾਲ', 'Frequently Asked Questions')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white tracking-tight">
            {t('ਤੁਹਾਡੇ ਮਨ ਵਿਚਲੇ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ', 'Answers to Your Questions')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full" />
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {displayFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id || index}
                className="rounded-2xl bg-zinc-950 border border-orange-900/30 overflow-hidden backdrop-blur-md transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left font-serif font-bold text-white hover:text-orange-300 flex items-center justify-between gap-4 transition-colors"
                >
                  <span className="text-sm sm:text-base">{t(faq.questionPa, faq.questionEn)}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-orange-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1 text-zinc-300 text-xs sm:text-sm leading-relaxed border-t border-zinc-900 font-light">
                        {t(faq.answerPa, faq.answerEn)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
