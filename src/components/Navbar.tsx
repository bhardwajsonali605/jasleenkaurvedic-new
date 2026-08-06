import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SiteSettings } from '../types';
import { Phone, MessageCircle, Lock, Menu, X, Sparkles, Globe, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
  onOpenConsultationModal: (serviceName?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, onOpenAdmin, onOpenConsultationModal }) => {
  const { lang, toggleLang, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', labelPa: 'ਹੋਮ', labelEn: 'Home' },
    { href: '#gallery', labelPa: 'ਗੈਲਰੀ', labelEn: 'Gallery' },
    { href: '#about', labelPa: 'ਮੇਰੇ ਬਾਰੇ', labelEn: 'About Me' },
    { href: '#services', labelPa: 'ਸੇਵਾਵਾਂ', labelEn: 'Services' },
    { href: '#worldwide', labelPa: 'ਵਰਲਡਵਾਈਡ', labelEn: 'Worldwide' },
    { href: '#horoscope', labelPa: 'ਰਾਸ਼ੀਫਲ', labelEn: 'Horoscope' },
    { href: '#testimonials', labelPa: 'ਰਿਵਿਊ', labelEn: 'Reviews' },
    { href: '#faq', labelPa: 'ਸਵਾਲ-ਜਵਾਬ', labelEn: 'FAQ' },
    { href: '#blog', labelPa: 'ਬਲੌਗ', labelEn: 'Blog' },
    { href: '#contact', labelPa: 'ਸੰਪਰਕ ਕਰੋ', labelEn: 'Contact' },
  ];

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 via-yellow-400 to-orange-500 z-50 pointer-events-none shadow-[0_0_12px_rgba(234,88,12,0.8)]" />

      {/* Top Announcement Bar */}
      <div className="bg-zinc-950 border-b border-orange-900/30 text-xs text-orange-200/90 py-2 px-4 relative z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-orange-400 font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              {t('ੴ ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫਤਿਹ', 'ੴ Divine Blessings of Waheguru Ji')}
            </span>
            <span className="hidden sm:inline-block text-zinc-800">|</span>
            <span className="hidden sm:flex items-center gap-1 text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              {t('100% ਗਰੰਟੀਸ਼ੁਦਾ ਅਤੇ ਗੁਪਤ ਇਲਾਜ', '100% Guaranteed & Confidential Consultation')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-1 hover:text-orange-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-orange-400" />
              <span>{settings.phone}</span>
            </a>
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Language Switcher Pill */}
            <div className="flex items-center bg-zinc-900 rounded-full p-1 border border-zinc-800">
              <button
                onClick={toggleLang}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  lang === 'pa'
                    ? 'bg-orange-600 text-white shadow-[0_0_10px_rgba(234,88,12,0.5)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                ਪੰਜਾਬੀ
              </button>
              <button
                onClick={toggleLang}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  lang === 'en'
                    ? 'bg-orange-600 text-white shadow-[0_0_10px_rgba(234,88,12,0.5)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-md border-b border-orange-900/40 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.9)]'
            : 'bg-black/80 backdrop-blur-md border-b border-orange-900/30 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#home" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-yellow-400 flex items-center justify-center text-black font-bold text-xl shadow-[0_0_15px_rgba(234,88,12,0.4)] group-hover:scale-105 transition-transform">
              ੴ
            </div>
            <div className="leading-none">
              <h1 className="text-xl font-serif font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-200 to-orange-400 group-hover:from-white group-hover:to-orange-300 transition-colors">
                ASTRO JASLEEN KAUR
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-orange-500/80 font-medium mt-0.5">
                {t('ਰੂਹਾਨੀ ਇਲਾਜ ਅਤੇ ਵੈਦਿਕ ਜੋਤਿਸ਼', 'Spiritual Guide & Philanthropist')}
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wide text-zinc-300 hover:text-orange-400 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-400 hover:after:w-full after:transition-all"
              >
                {t(link.labelPa, link.labelEn)}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => onOpenConsultationModal()}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:scale-105 transition-transform text-xs tracking-wider uppercase flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>{t('ਅਪੁਆਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ', 'Book Consultation')}</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-orange-400 hover:border-orange-500/50 transition-all"
              title={t('ਐਡਮਿਨ ਪੈਨਲ', 'Admin Panel')}
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleLang}
              className="px-2.5 py-1 rounded bg-orange-600 text-white text-xs font-bold shadow-sm"
            >
              {lang === 'pa' ? 'ਪੰਜਾਬੀ' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-orange-400 hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-zinc-950 border-b border-orange-900/30 px-4 py-6 space-y-3">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-zinc-800">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-sm font-medium text-zinc-200 hover:text-orange-400 hover:border-orange-500/40"
                >
                  {t(link.labelPa, link.labelEn)}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultationModal();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-400 text-black font-bold text-sm text-center shadow-[0_0_20px_rgba(234,88,12,0.4)]"
              >
                {t('ਅਪੁਆਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ', 'Book Consultation')}
              </button>

              <div className="flex gap-2">
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="py-2 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-orange-400 text-xs flex items-center gap-1"
                >
                  <Lock className="w-4 h-4" />
                  Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
