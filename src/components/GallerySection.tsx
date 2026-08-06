import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { GalleryItem } from '../types';
import { Camera, Play, X, Eye, Sparkles, Image as ImageIcon } from 'lucide-react';

interface GallerySectionProps {
  items: GalleryItem[];
}

function getYouTubeEmbedUrl(url: string) {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
  }
  return url;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items }) => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Photos', 'Videos', 'Chat Proofs', 'Testimonials'];

  const filteredItems = items.filter((item) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Chat Proofs') return item.category === 'Chat Proofs' || item.category === 'Screenshots';
    return item.category === activeCategory;
  });

  return (
    <section id="gallery" className="py-20 bg-black relative border-b border-orange-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>{t('ਪ੍ਰਮਾਣ ਅਤੇ ਸਿਖਰਲੀ ਗੈਲਰੀ', 'Proof & Spiritual Gallery')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight">
            {t('ਗੈਲਰੀ ਅਤੇ ਕਲਾਇੰਟ ਸਕ੍ਰੀਨਸ਼ਾਟ', 'Gallery & Client Proof Screenshots')}
          </h2>
          <p className="text-zinc-400 text-sm font-light">
            {t(
              'ਦੇਸ਼-ਵਿਦੇਸ਼ ਤੋਂ ਆਏ ਸ਼ਰਧਾਲੂਆਂ ਦੇ ਵੀਡੀਓ ਸੁਨੇਹੇ, ਵਾਟਸਐਪ ਚੈਟ ਪ੍ਰਮਾਣ ਅਤੇ ਰੂਹਾਨੀ ਪ੍ਰੋਗਰਾਮ।',
              'Real WhatsApp chat proofs, video testimonials, and sacred prayer event highlights.'
            )}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full" />
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-orange-600 to-orange-400 text-black font-bold shadow-[0_0_15px_rgba(234,88,12,0.4)] scale-105'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-orange-300'
              }`}
            >
              {cat === 'All' ? t('ਸਭ (All)', 'All') : cat}
            </button>
          ))}
        </div>

        {/* Grid of items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => {
            const isVideoMedia = item.type === 'video' || /\.(mp4|webm|mov|ogg)$/i.test(item.url) || item.url.includes('youtube.com') || item.url.includes('youtu.be');
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => setSelectedItem(item)}
                className="group cursor-pointer rounded-3xl overflow-hidden bg-zinc-950 border border-orange-900/30 hover:border-orange-500/60 shadow-xl relative"
              >
                <div className="aspect-[4/3] w-full relative overflow-hidden bg-black flex items-center justify-center">
                  {isVideoMedia && !item.thumbnailUrl ? (
                    item.url.includes('youtube.com') || item.url.includes('youtu.be') ? (
                      <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                        <Play className="w-12 h-12 text-orange-500" />
                      </div>
                    ) : (
                      <video src={item.url} muted playsInline preload="metadata" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )
                  ) : (
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.titleEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

                  {/* Video Play Overlay */}
                  {isVideoMedia && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-orange-600 text-black flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.6)] group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-orange-500/40 text-orange-300 text-[10px] font-bold">
                    {item.category}
                  </div>

                  {/* Eye Icon Hover */}
                  <div className="absolute top-3 right-3 p-2 rounded-full bg-black/80 border border-zinc-800 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-4 bg-zinc-950">
                  <h3 className="text-sm font-serif font-bold text-white group-hover:text-orange-300 transition-colors line-clamp-1">
                    {t(item.titlePa, item.titleEn)}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-1 font-light">{item.date}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Lightbox Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full bg-zinc-950 border border-orange-900/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(234,88,12,0.3)]">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/80 text-white hover:text-orange-400 border border-orange-500/30"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-6 space-y-4">
                <div className="aspect-[16/9] w-full bg-black rounded-2xl overflow-hidden flex items-center justify-center">
                  {selectedItem.type === 'video' || /\.(mp4|webm|mov|ogg)$/i.test(selectedItem.url) || selectedItem.url.includes('youtube.com') || selectedItem.url.includes('youtu.be') ? (
                    selectedItem.url.includes('youtube.com') || selectedItem.url.includes('youtu.be') ? (
                      <iframe
                        src={getYouTubeEmbedUrl(selectedItem.url)}
                        title={selectedItem.titleEn}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={selectedItem.url}
                        controls
                        autoPlay
                        className="w-full h-full max-h-[70vh] object-contain rounded-xl"
                      />
                    )
                  ) : (
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.titleEn}
                      referrerPolicy="no-referrer"
                      className="max-h-[70vh] w-auto object-contain rounded-xl"
                    />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-orange-300">
                    {t(selectedItem.titlePa, selectedItem.titleEn)}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-semibold border border-orange-500/30">
                      {selectedItem.category}
                    </span>
                    <span>{selectedItem.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
