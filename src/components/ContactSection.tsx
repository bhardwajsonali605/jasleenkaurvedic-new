import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SiteSettings, ServiceItem } from '../types';
import { countriesList } from '../data/initialData';
import { Phone, MessageCircle, Mail, MapPin, Send, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface ContactSectionProps {
  settings: SiteSettings;
  services: ServiceItem[];
  preSelectedService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings, services, preSelectedService }) => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    country: 'India',
    city: '',
    serviceRequired: preSelectedService || services[0]?.titleEn || 'Love Problem Solution',
    preferredContactMethod: 'WhatsApp',
    message: '',
    honeypot: '', // Spam protection
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState<{ message: string; directWaUrl: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Honeypot spam check
    if (formData.honeypot) {
      console.warn('Bot detected via honeypot field');
      return;
    }

    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setErrorMessage(t('ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਅਤੇ ਫੋਨ ਨੰਬਰ ਭਰੋ।', 'Please fill in your Full Name and Phone Number.'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          whatsapp: formData.whatsapp || formData.phone,
          country: formData.country,
          city: formData.city,
          serviceRequired: formData.serviceRequired,
          preferredContactMethod: formData.preferredContactMethod,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessResponse({
          message: data.message,
          directWaUrl: data.directWaUrl,
        });
        setFormData({
          fullName: '',
          phone: '',
          whatsapp: '',
          country: 'India',
          city: '',
          serviceRequired: services[0]?.titleEn || 'Love Problem Solution',
          preferredContactMethod: 'WhatsApp',
          message: '',
          honeypot: '',
        });
      } else {
        setErrorMessage(data.error || 'Failed to submit form.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(t('ਸਰਵਰ ਨਾਲ ਸੰਪਰਕ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ।', 'Failed to connect to server. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-black relative border-b border-orange-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('100% ਗਰੰਟੀਸ਼ੁਦਾ ਅਤੇ ਗੁਪਤ ਸਲਾਹ', '100% Guaranteed & Confidential Consultation')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight">
            {t('ਆਪਣੀ ਸਮੱਸਿਆ ਦਾ ਤੁਰੰਤ ਸਮਾਧਾਨ ਪਾਓ', 'Book Your Astrology & Spiritual Consultation')}
          </h2>
          <p className="text-zinc-400 text-sm font-light">
            {t(
              'ਹੇਠਾਂ ਦਿੱਤਾ ਫਾਰਮ ਭਰੋ। ਐਸਟ੍ਰੋਲੋਜਰ ਜਸਲੀਨ ਕੌਰ ਜੀ ਆਪ ਤੁਹਾਡੇ ਨਾਲ ਵਾਟਸਐਪ ਜਾਂ ਫੋਨ ‘ਤੇ ਸੰਪਰਕ ਕਰਨਗੇ।',
              'Fill out the form below. Astrologer Jasleen Kaur will contact you directly via WhatsApp or Phone.'
            )}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Contact Information Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950 border border-orange-900/40 shadow-[0_0_35px_rgba(234,88,12,0.15)] space-y-6">
              <h3 className="text-xl font-serif font-bold text-orange-300">
                {t('ਸਿੱਧਾ ਸੰਪਰਕ ਕਰੋ', 'Direct Contact Details')}
              </h3>

              <div className="space-y-4">
                {/* Phone */}
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-black/70 border border-zinc-900 hover:border-orange-500/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400 font-light">{t('ਫੋਨ ਨੰਬਰ', 'Phone Number')}</div>
                    <div className="text-base font-bold text-white group-hover:text-orange-300">
                      {settings.phone}
                    </div>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 hover:border-emerald-400/60 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400 font-light">{t('ਵਾਟਸਐਪ ਨੰਬਰ', 'WhatsApp Number')}</div>
                    <div className="text-base font-bold text-emerald-400">
                      {settings.whatsapp}
                    </div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-black/70 border border-zinc-900 hover:border-orange-500/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400 font-light">{t('ਈਮੇਲ ਆਈਡੀ', 'Email Address')}</div>
                    <div className="text-sm font-bold text-white group-hover:text-orange-300 break-all">
                      {settings.email}
                    </div>
                  </div>
                </a>
              </div>

              {/* Social Media Links */}
              <div className="pt-4 border-t border-zinc-900 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                  {t('ਸੋਸ਼ਲ ਮੀਡੀਆ', 'Official Social Profiles')}
                </div>
                <div className="flex gap-3">
                  <a
                    href={`https://instagram.com/${settings.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-black border border-zinc-800 hover:border-pink-500/50 text-zinc-300 hover:text-pink-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Instagram</span>
                  </a>
                  <a
                    href={`https://snapchat.com/add/${settings.snapchat}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-black border border-zinc-800 hover:border-yellow-500/50 text-zinc-300 hover:text-yellow-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Snapchat</span>
                  </a>
                </div>
              </div>

              {/* Address / Location Badge */}
              <div className="p-4 rounded-2xl bg-black border border-orange-900/30 text-xs text-zinc-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-orange-400">
                  <MapPin className="w-4 h-4" />
                  <span>{t('ਮੁੱਖ ਕੇਂਦਰ', 'Main Sacred Center')}</span>
                </div>
                <p className="pl-5 text-zinc-400 font-light">
                  {t(
                    'ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ ਸਾਹਿਬ, ਪੰਜਾਬ, ਭਾਰਤ (ਸੇਵਾਵਾਂ ਪੂਰੀ ਦੁਨੀਆ ਵਿੱਚ ਉਪਲਬਧ)',
                    'Sri Amritsar Sahib, Punjab, India (Worldwide Online Consultations Available)'
                  )}
                </p>
              </div>

            </div>
          </div>

          {/* Right Form Component */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950 border border-orange-900/40 backdrop-blur-md shadow-[0_0_35px_rgba(234,88,12,0.15)] relative">
              
              {successResponse ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-bold text-white">
                      {t('ਤੁਹਾਡਾ ਸੁਨੇਹਾ ਸਫਲਤਾਪੂਰਵਕ ਮਿਲ ਗਿਆ ਹੈ!', 'Enquiry Received Successfully!')}
                    </h3>
                    <p className="text-zinc-300 text-sm max-w-md mx-auto font-light">
                      {successResponse.message}
                    </p>
                    <p className="text-xs text-orange-400 font-medium">
                      {t(
                        'ਨੋਟੀਫਿਕੇਸ਼ਨ Astrojasleenkaur@gmail.com ‘ਤੇ ਭੇਜ ਦਿੱਤੀ ਗਈ ਹੈ।',
                        'Email alert sent to Astrojasleenkaur@gmail.com.'
                      )}
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                    <a
                      href={successResponse.directWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    >
                      <MessageCircle className="w-5 h-5 fill-current" />
                      <span>{t('ਹੁਣੇ ਵਾਟਸਐਪ ‘ਤੇ ਸਿੱਧੀ ਗੱਲ ਕਰੋ', 'Chat Instantly on WhatsApp')}</span>
                    </a>
                    <button
                      onClick={() => setSuccessResponse(null)}
                      className="px-6 py-3.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-sm"
                    >
                      {t('ਨਵਾਂ ਫਾਰਮ ਭਰੋ', 'Submit Another Enquiry')}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Honeypot hidden input */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs font-semibold">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-300">
                        {t('ਪੂਰਾ ਨਾਮ (Full Name) *', 'Full Name *')}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder={t('ਆਪਣਾ ਨਾਮ ਲਿਖੋ', 'Enter your name')}
                        className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-orange-500 font-light"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-300">
                        {t('ਫੋਨ ਨੰਬਰ (Phone Number) *', 'Phone Number *')}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 / +1 / +44..."
                        className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-orange-500 font-light"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* WhatsApp Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-300">
                        {t('ਵਾਟਸਐਪ ਨੰਬਰ (WhatsApp Number)', 'WhatsApp Number')}
                      </label>
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder={t('ਫੋਨ ਨੰਬਰ ਵਰਗਾ ਹੀ', 'Same as phone number')}
                        className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-orange-500 font-light"
                      />
                    </div>

                    {/* Country Selector */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-300">
                        {t('ਦੇਸ਼ (Country)', 'Country')}
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white text-xs focus:outline-none focus:border-orange-500 font-light"
                      >
                        {countriesList.map((c, i) => (
                          <option key={i} value={c.nameEn}>
                            {c.flag} {c.nameEn} ({t(c.namePa, c.nameEn)})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* City */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-300">
                        {t('ਸ਼ਹਿਰ (City)', 'City')}
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder={t('ਆਪਣੇ ਸ਼ਹਿਰ ਦਾ ਨਾਮ', 'City name')}
                        className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-orange-500 font-light"
                      />
                    </div>

                    {/* Service Required Dropdown */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-300">
                        {t('ਲੋੜੀਂਦੀ ਸੇਵਾ (Service Required) *', 'Service Required *')}
                      </label>
                      <select
                        required
                        value={formData.serviceRequired}
                        onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white text-xs focus:outline-none focus:border-orange-500 font-light"
                      >
                        {services.map((s) => (
                          <option key={s.id} value={t(s.titlePa, s.titleEn)}>
                            {t(s.titlePa, s.titleEn)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Preferred Contact Method */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">
                      {t('ਗੱਲਬਾਤ ਦਾ ਤਰੀਕਾ (Preferred Contact Method)', 'Preferred Contact Method')}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['WhatsApp', 'Phone Call', 'Email'].map((method) => (
                        <button
                          type="button"
                          key={method}
                          onClick={() => setFormData({ ...formData, preferredContactMethod: method })}
                          className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                            formData.preferredContactMethod === method
                              ? 'bg-orange-500/20 border-orange-400 text-orange-300'
                              : 'bg-black border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">
                      {t('ਆਪਣੀ ਸਮੱਸਿਆ ਬਾਰੇ ਲਿਖੋ (Message)', 'Detail Message')}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t('ਕੁਝ ਸ਼ਬਦਾਂ ਵਿਚ ਆਪਣੀ ਮੁਸ਼ਕਿਲ ਦੱਸੋ...', 'Describe your problem briefly...')}
                      className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-orange-500 font-light"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-black font-bold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t('ਸਬਮਿਟ ਕਰੋ ਅਤੇ ਸਲਾਹ ਲਵੋ', 'Submit Enquiry Now')}</span>
                      </>
                    )}
                  </button>

                  <div className="text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1.5 pt-1 font-light">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{t('100% ਗੁਪਤਤਾ। ਈਮੇਲ ਅਤੇ ਵਾਟਸਐਪ ਨੋਟੀਫਿਕੇਸ਼ਨ ਆਪਣੇ ਆਪ ਭੇਜੀ ਜਾਵੇਗੀ।', '100% Private. Automated Email & WhatsApp notification enabled.')}</span>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
