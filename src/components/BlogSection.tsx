import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { BlogPost } from '../types';
import { BookOpen, Search, X, Calendar, Clock, User, ArrowRight, Tag } from 'lucide-react';

interface BlogSectionProps {
  blogs: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blogs }) => {
  const { t } = useLanguage();
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBlogs = blogs.filter(
    (b) =>
      b.titlePa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="blog" className="py-20 bg-black relative border-b border-orange-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('ਜੋਤਿਸ਼ ਅਤੇ ਰੂਹਾਨੀ ਗਿਆਨ ਬਲੌਗ', 'Astrology & Spiritual Knowledge Articles')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight">
            {t('ਨਵੀਨਤਮ ਜੋਤਿਸ਼ ਅਤੇ ਵੈਦਿਕ ਉਪਾਅ ਬਲੌਗ', 'Latest Astrology Articles & Remedies')}
          </h2>
          <p className="text-zinc-400 text-sm font-light">
            {t(
              'ਗ੍ਰਹਿਆਂ ਦੀ ਚਾਲ, ਵੀਜ਼ਾ ਉਪਾਅ, ਅਤੇ ਰਿਸ਼ਤਿਆਂ ਨੂੰ ਸੁਧਾਰਨ ਲਈ ਮੁਫ਼ਤ ਜਾਣਕਾਰੀ ਪੜ੍ਹੋ।',
              'Read expert guidance on horoscope doshas, marriage stability, and foreign visa remedies.'
            )}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full" />
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10 relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('ਬਲੌਗ ਖੋਜੋ...', 'Search blog articles...')}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-orange-900/40 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-orange-500 font-light"
          />
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBlogs.map((blog, idx) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onClick={() => setSelectedBlog(blog)}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-zinc-950 border border-orange-900/30 hover:border-orange-500/50 backdrop-blur-md shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/9] w-full relative overflow-hidden bg-black">
                  <img
                    src={blog.featuredImage}
                    alt={blog.titleEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 border border-orange-500/30 text-orange-300 text-[10px] font-bold">
                    {blog.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-light">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-orange-400" /> {blog.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-400" /> {blog.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-white group-hover:text-orange-300 transition-colors line-clamp-2">
                    {t(blog.titlePa, blog.titleEn)}
                  </h3>

                  <p className="text-zinc-400 text-xs line-clamp-3 leading-relaxed font-light">
                    {t(blog.excerptPa, blog.excerptEn)}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs text-orange-400 font-bold border-t border-zinc-900 mt-4">
                <span>{t('ਪੂਰਾ ਪੜ੍ਹੋ', 'Read Article')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Article Reader Modal */}
        {selectedBlog && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative max-w-3xl w-full bg-zinc-950 border border-orange-900/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(234,88,12,0.3)] my-8">
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/80 text-white hover:text-orange-400 border border-orange-500/30"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden">
                  <img
                    src={selectedBlog.featuredImage}
                    alt={selectedBlog.titleEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-orange-400 font-light">
                    <span className="px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 font-bold">
                      {selectedBlog.category}
                    </span>
                    <span>{selectedBlog.date}</span>
                    <span>•</span>
                    <span>{selectedBlog.author}</span>
                  </div>

                  <h2 className="text-2xl font-serif font-extrabold text-white">
                    {t(selectedBlog.titlePa, selectedBlog.titleEn)}
                  </h2>
                </div>

                <div className="prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed space-y-4 pt-4 border-t border-zinc-900 font-light">
                  <p>{t(selectedBlog.contentPa, selectedBlog.contentEn)}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  {selectedBlog.tags?.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-400 text-[11px] flex items-center gap-1 font-light">
                      <Tag className="w-3 h-3 text-orange-400" /> #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
