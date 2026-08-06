import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ServiceItem } from '../types';
import { countriesList } from '../data/initialData';
import { X, MessageCircle, Send, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedService?: string;
  services: ServiceItem[];
  whatsappNumber: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  preSelectedService,
  services,
  whatsappNumber,
}) => {
  const { t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('');
  const [serviceRequired, setServiceRequired] = useState(preSelectedService || services[0]?.titleEn || 'Love Problem Solution');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submittedResponse, setSubmittedResponse] = useState<{ directWaUrl: string; message: string } | null>(null);

  useEffect(() => {
    if (preSelectedService) {
      setServiceRequired(preSelectedService);
    }
  }, [preSelectedService]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          whatsapp: whatsapp || phone,
          country,
          city,
          serviceRequired,
          preferredContactMethod: 'WhatsApp',
          message,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedResponse({
          message: data.message,
          directWaUrl: data.directWaUrl,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-orange-900/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(234,88,12,0.3)] my-6">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black text-zinc-400 hover:text-white border border-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400 flex items-center justify-center text-orange-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-orange-300">
                {t('ਰੂਹਾਨੀ ਇਲਾਜ ਅਤੇ ਅਪੁਆਇੰਟਮੈਂਟ', 'Book Spiritual Consultation')}
              </h3>
              <p className="text-xs text-zinc-400 font-light">
                {t('ਐਸਟ੍ਰੋਲੋਜਰ ਜਸਲੀਨ ਕੌਰ ਜੀ ਨਾਲ ਤੁਰੰਤ ਸੰਪਰਕ ਕਰੋ', 'Direct consultation with Astrologer Jasleen Kaur')}
              </p>
            </div>
          </div>

          {submittedResponse ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-xs text-zinc-200 font-light">{submittedResponse.message}</p>
              
              <a
                href={submittedResponse.directWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{t('ਵਾਟਸਐਪ ‘ਤੇ ਤੁਰੰਤ ਗੱਲ ਕਰੋ', 'Chat Instantly on WhatsApp')}</span>
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div>
                <label className="text-xs text-zinc-300 font-semibold">{t('ਪੂਰਾ ਨਾਮ (Full Name) *', 'Full Name *')}</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t('ਆਪਣਾ ਨਾਮ', 'Your Name')}
                  className="w-full px-3 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-orange-500 font-light"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-zinc-300 font-semibold">{t('ਫੋਨ ਨੰਬਰ *', 'Phone *')}</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 / +1..."
                    className="w-full px-3 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-orange-500 font-light"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-300 font-semibold">{t('ਦੇਸ਼', 'Country')}</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-orange-500 font-light"
                  >
                    {countriesList.map((c, i) => (
                      <option key={i} value={c.nameEn}>
                        {c.flag} {c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-300 font-semibold">{t('ਲੋੜੀਂਦੀ ਸੇਵਾ', 'Service Required')}</label>
                <select
                  value={serviceRequired}
                  onChange={(e) => setServiceRequired(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-orange-500 font-light"
                >
                  {services.map((s) => (
                    <option key={s.id} value={t(s.titlePa, s.titleEn)}>
                      {t(s.titlePa, s.titleEn)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-300 font-semibold">{t('ਸੁਨੇਹਾ (Message)', 'Brief Message')}</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('ਆਪਣੀ ਮੁਸ਼ਕਿਲ ਲਿਖੋ...', 'Brief details...')}
                  className="w-full px-3 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-orange-500 font-light"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(234,88,12,0.4)]"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t('ਅਪੁਆਇੰਟਮੈਂਟ ਕਨਫਰਮ ਕਰੋ', 'Confirm Consultation')}</span>
                  </>
                )}
              </button>

              <div className="text-[10px] text-zinc-400 text-center flex items-center justify-center gap-1 pt-1 font-light">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Guaranteed Confidentiality</span>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
