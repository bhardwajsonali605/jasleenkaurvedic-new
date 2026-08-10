import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Lead, SiteSettings, ServiceItem, GalleryItem, TestimonialItem, BlogPost, FaqItem } from '../types';
import {
  Lock,
  X,
  Users,
  Settings,
  Grid,
  Camera,
  MessageSquareQuote,
  BookOpen,
  HelpCircle,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  Plus,
  Edit,
  Phone,
  MessageCircle,
  Upload,
  Save,
  RefreshCw,
  Video,
  Play,
  Crop,
  Maximize2,
  ZoomIn,
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  siteSettings: SiteSettings;
  services: ServiceItem[];
  gallery: GalleryItem[];
  testimonials: TestimonialItem[];
  blogs: BlogPost[];
  faqs?: FaqItem[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  siteSettings,
  services,
  gallery,
  testimonials,
  blogs,
  faqs = [],
  onRefreshData,
}) => {
  const { t } = useLanguage();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'leads' | 'settings' | 'services' | 'gallery' | 'testimonials' | 'blogs' | 'faqs'>('leads');

  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('All');

  // Editable Site Settings State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);

  // New & edit item states
  const [newService, setNewService] = useState<Partial<ServiceItem>>({
    titlePa: '',
    titleEn: '',
    descPa: '',
    descEn: '',
    category: 'Relationships',
    iconName: 'Sparkles',
  });
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const [newGalleryItem, setNewGalleryItem] = useState<Partial<GalleryItem>>({
    titlePa: '',
    titleEn: '',
    category: 'Photos',
    type: 'image',
    url: '',
  });
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);

  const [newTestimonial, setNewTestimonial] = useState<Partial<TestimonialItem>>({
    name: '',
    country: 'Canada',
    flagEmoji: '🇨🇦',
    rating: 5,
    reviewPa: '',
    reviewEn: '',
    service: 'Love Problem Solution',
  });
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);

  const [newBlog, setNewBlog] = useState<Partial<BlogPost>>({
    titlePa: '',
    titleEn: '',
    contentPa: '',
    contentEn: '',
    excerptPa: '',
    excerptEn: '',
    category: 'Astrology',
    featuredImage: '',
    tags: ['Astrology', 'Remedies'],
  });
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  const [newFaq, setNewFaq] = useState<Partial<FaqItem>>({
    questionPa: '',
    questionEn: '',
    answerPa: '',
    answerEn: '',
  });
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);

  // Image Crop & Frame Adjuster State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageUrl, setCropImageUrl] = useState<string>('');
  const [cropCallback, setCropCallback] = useState<((url: string) => void) | null>(null);
  const [cropScale, setCropScale] = useState<number>(1);
  const [cropOffsetY, setCropOffsetY] = useState<number>(0);
  const [cropOffsetX, setCropOffsetX] = useState<number>(0);
  const [cropAspect, setCropAspect] = useState<'4:3' | '16:9' | '1:1' | '3:4'>('4:3');
  const [isProcessingCrop, setIsProcessingCrop] = useState(false);

  const openCropModal = (imageUrl: string, onSaveCropped: (url: string) => void) => {
    if (!imageUrl) {
      alert('Please upload or enter an image URL first.');
      return;
    }
    setCropImageUrl(imageUrl);
    setCropCallback(() => onSaveCropped);
    setCropScale(1);
    setCropOffsetX(0);
    setCropOffsetY(0);
    setCropAspect('4:3');
    setCropModalOpen(true);
  };

  const handleApplyCrop = async () => {
    if (!cropImageUrl || !cropCallback) return;
    setIsProcessingCrop(true);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = cropImageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      let targetW = 800;
      let targetH = 600;
      if (cropAspect === '16:9') { targetW = 960; targetH = 540; }
      else if (cropAspect === '1:1') { targetW = 600; targetH = 600; }
      else if (cropAspect === '3:4') { targetW = 600; targetH = 800; }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, targetW, targetH);

        const imgAspect = img.naturalWidth / img.naturalHeight;
        const targetAspect = targetW / targetH;

        let renderW = targetW;
        let renderH = targetH;

        if (imgAspect > targetAspect) {
          renderH = targetH;
          renderW = targetH * imgAspect;
        } else {
          renderW = targetW;
          renderH = targetW / imgAspect;
        }

        renderW *= cropScale;
        renderH *= cropScale;

        const posX = (targetW - renderW) / 2 + (cropOffsetX / 100) * targetW;
        const posY = (targetH - renderH) / 2 + (cropOffsetY / 100) * targetH;

        ctx.drawImage(img, posX, posY, renderW, renderH);

        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              alert('Failed to generate cropped frame.');
              setIsProcessingCrop(false);
              return;
            }
            try {
              const formData = new FormData();
              formData.append('file', blob, 'cropped_frame.jpg');

              const res = await fetch('/api/upload-file', {
                method: 'POST',
                body: formData,
              });
              const resData = await res.json();

              if (resData.success && resData.url) {
                cropCallback(resData.url);
                setCropModalOpen(false);
              } else {
                alert('Failed to save cropped image: ' + (resData.error || 'Unknown error'));
              }
            } catch (uploadErr) {
              console.error(uploadErr);
              alert('Failed to upload cropped image.');
            } finally {
              setIsProcessingCrop(false);
            }
          },
          'image/jpeg',
          0.92
        );
      } else {
        setIsProcessingCrop(false);
      }
    } catch (err) {
      console.error(err);
      alert('Could not crop this image. Note: External images without CORS might block client canvas cropping; please upload the file directly first.');
      setIsProcessingCrop(false);
    }
  };

  useEffect(() => {
    if (siteSettings) {
      setSettingsForm(siteSettings);
    }
  }, [siteSettings]);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      fetchLeads();
    }
  }, [isAuthenticated, isOpen]);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/admin/leads');
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (e) {
      console.error('Failed fetching leads', e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Invalid Password');
      }
    } catch (e) {
      setAuthError('Connection error');
    }
  };

  const handleUpdateLeadStatus = async (id: string, newStatus: 'New' | 'Contacted' | 'Completed') => {
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchLeads();
    } catch (e) {
      console.error('Error updating status', e);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Delete this lead permanently?')) return;
    try {
      await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
      fetchLeads();
    } catch (e) {
      console.error('Delete error', e);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        alert('Settings saved successfully!');
        onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Generic Media Upload Handler (Images & Videos via Multipart FormData)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetFieldCallback: (url: string, isVideo?: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi|3gp|ogv)$/i.test(file.name);

    setUploading(true);

    try {
      // 1. Try direct binary multipart upload via FormData first
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload-file', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        targetFieldCallback(data.url, isVideo);
      } else {
        throw new Error(data.error || 'Multipart upload failed');
      }
    } catch (err) {
      console.warn('Multipart upload failed, trying Base64 upload fallback:', err);
      // 2. Base64 fallback if multipart fails
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64Data = reader.result as string;
            const res = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ fileData: base64Data, fileName: file.name }),
            });
            const data = await res.json();
            if (data.success && data.url) {
              targetFieldCallback(data.url, isVideo);
            } else {
              alert('Upload failed: ' + (data.error || 'File size too large.'));
            }
          } catch (e) {
            console.error(e);
            alert('Upload failed. Please check your internet connection or file size.');
          } finally {
            setUploading(false);
          }
        };
        reader.readAsDataURL(file);
        return; // reader callback will setUploading(false)
      } catch (fallbackErr) {
        console.error(fallbackErr);
        alert('Upload failed. Try linking YouTube or uploading a smaller clip.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSaveService = async () => {
    if (!newService.titlePa || !newService.titleEn) {
      alert('Please fill Punjabi & English titles');
      return;
    }
    try {
      await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingServiceId ? { ...newService, id: editingServiceId } : newService),
      });
      setNewService({ titlePa: '', titleEn: '', descPa: '', descEn: '', category: 'Relationships', iconName: 'Sparkles' });
      setEditingServiceId(null);
      onRefreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      onRefreshData();
    } catch (e) {
      console.error('Delete error', e);
    }
  };

  const handleSaveGallery = async () => {
    if (!newGalleryItem.url) return alert('Enter URL or Upload file');
    try {
      await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGalleryId ? { ...newGalleryItem, id: editingGalleryId } : newGalleryItem),
      });
      setNewGalleryItem({ titlePa: '', titleEn: '', category: 'Photos', type: 'image', url: '' });
      setEditingGalleryId(null);
      onRefreshData();
    } catch (e) {
      console.error(e);
    }
  };

const handleDeleteGallery = async (id: string) => {
  if (!window.confirm('Delete this gallery item permanently?')) {
    return;
  }

  try {
    const res = await fetch(`/api/admin/gallery/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(
        data.error || 'Failed to delete gallery item'
      );
    }

    alert('Gallery item deleted successfully.');

    onRefreshData();
  } catch (error) {
    console.error('Gallery delete error:', error);

    alert(
      error instanceof Error
        ? error.message
        : 'Failed to delete gallery item.'
    );
  }
};

  const handleSaveTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.reviewEn) return alert('Fill name & review');
    try {
      await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTestimonialId ? { ...newTestimonial, id: editingTestimonialId } : newTestimonial),
      });
      setNewTestimonial({ name: '', country: 'Canada', flagEmoji: '🇨🇦', rating: 5, reviewPa: '', reviewEn: '', service: 'Love Problem Solution' });
      setEditingTestimonialId(null);
      onRefreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      onRefreshData();
    } catch (e) {
      console.error('Delete error', e);
    }
  };

  const handleSaveBlog = async () => {
    if (!newBlog.titleEn || !newBlog.contentEn) return alert('Fill Title & Content');
    try {
      await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBlogId ? { ...newBlog, id: editingBlogId } : {
          ...newBlog,
          slug: (newBlog.titleEn || 'blog').toLowerCase().replace(/[^a-z0-9]/g, '-'),
        }),
      });
      setNewBlog({ titlePa: '', titleEn: '', contentPa: '', contentEn: '', excerptPa: '', excerptEn: '', category: 'Astrology', featuredImage: '', tags: [] });
      setEditingBlogId(null);
      onRefreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      onRefreshData();
    } catch (e) {
      console.error('Delete error', e);
    }
  };

  const handleSaveFaq = async () => {
    if (!newFaq.questionEn || !newFaq.answerEn) return alert('Fill question and answer in English');
    try {
      await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaqId ? { ...newFaq, id: editingFaqId } : newFaq),
      });
      setNewFaq({ questionPa: '', questionEn: '', answerPa: '', answerEn: '' });
      setEditingFaqId(null);
      onRefreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' });
      onRefreshData();
    } catch (e) {
      console.error('Delete error', e);
    }
  };

  const handleCleanBlankFaqs = async () => {
    try {
      await fetch('/api/admin/faqs/clean-blank', { method: 'POST' });
      onRefreshData();
    } catch (e) {
      console.error('Clean FAQs error', e);
    }
  };

  if (!isOpen) return null;

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = leadStatusFilter === 'All' || lead.status === leadStatusFilter;
    const query = leadSearch.toLowerCase();
    const matchesQuery =
      lead.fullName.toLowerCase().includes(query) ||
      lead.phone.includes(query) ||
      lead.country.toLowerCase().includes(query) ||
      lead.serviceRequired.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-zinc-950 border border-orange-900/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(234,88,12,0.3)] my-6 flex flex-col max-h-[90vh]">
        
        {/* Admin Header */}
        <div className="bg-black px-6 py-4 border-b border-orange-900/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-400 flex items-center justify-center text-orange-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white">
                {t('ਐਸਟ੍ਰੋਲੋਜਰ ਜਸਲੀਨ ਕੌਰ - ਐਡਮਿਨ ਡੈਸ਼ਬੋਰਡ', 'Astro Jasleen Kaur - Admin Dashboard')}
              </h2>
              <p className="text-[11px] text-zinc-400 font-light">
                {t('ਲੀਡ ਪ੍ਰਬੰਧਨ, ਮੀਡੀਆ ਅੱਪਲੋਡ ਅਤੇ ਕੰਟੈਂਟ ਸੰਪਾਦਕ', 'Lead Management, Media Uploads & CMS Control')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Login Screen if not authenticated */}
        {!isAuthenticated ? (
          <div className="p-12 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-400 flex items-center justify-center text-orange-400 mx-auto shadow-[0_0_20px_rgba(234,88,12,0.4)]">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-serif font-bold text-white">
                {t('ਐਡਮਿਨ ਲੌਗਇਨ', 'Admin Authentication')}
              </h3>
              <p className="text-xs text-zinc-400 font-light">
                {t('ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹਣ ਲਈ ਪਾਸਵਰਡ ਭਰੋ', 'Enter password to access dashboard')}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {authError && (
                <div className="text-rose-400 text-xs font-semibold bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/30">
                  {authError}
                </div>
              )}

              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter Password"
                className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500 font-light"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 font-bold text-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(234,88,12,0.4)]"
              >
                {t('ਲੌਗਇਨ ਕਰੋ', 'Unlock Admin Dashboard')}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard Panel */
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* Top Navigation Tabs */}
            <div className="bg-black px-6 py-2 border-b border-zinc-900 flex flex-wrap gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('leads')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'leads'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-400 text-black shadow-[0_0_10px_rgba(234,88,12,0.5)]'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Leads ({leads.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-400 text-black shadow-[0_0_10px_rgba(234,88,12,0.5)]'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Site Content & Media</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'services'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-400 text-black shadow-[0_0_10px_rgba(234,88,12,0.5)]'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Services ({services.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'gallery'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-400 text-black shadow-[0_0_10px_rgba(234,88,12,0.5)]'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Gallery ({gallery.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('testimonials')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'testimonials'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-400 text-black shadow-[0_0_10px_rgba(234,88,12,0.5)]'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <MessageSquareQuote className="w-4 h-4" />
                <span>Testimonials ({testimonials.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('blogs')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'blogs'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-400 text-black shadow-[0_0_10px_rgba(234,88,12,0.5)]'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Blogs ({blogs.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('faqs')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'faqs'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-400 text-black shadow-[0_0_10px_rgba(234,88,12,0.5)]'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>FAQs ({faqs.length})</span>
              </button>
            </div>

            {/* TAB CONTENT Scrollable Area */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">

              {/* 1. LEADS TAB */}
              {activeTab === 'leads' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="relative w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          value={leadSearch}
                          onChange={(e) => setLeadSearch(e.target.value)}
                          placeholder="Search leads by name, phone, country..."
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-orange-500 font-light"
                        />
                      </div>

                      <select
                        value={leadStatusFilter}
                        onChange={(e) => setLeadStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-orange-500 font-light"
                      >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={fetchLeads}
                        className="px-3 py-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 border border-zinc-800"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh
                      </button>

                      <a
                        href="/api/admin/leads/export"
                        target="_blank"
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                      </a>
                    </div>
                  </div>

                  {/* Leads Table */}
                  <div className="rounded-2xl border border-zinc-800 overflow-x-auto bg-black">
                    <table className="w-full text-left text-xs text-zinc-300">
                      <thead className="bg-zinc-900 border-b border-zinc-800 text-orange-400 uppercase font-semibold text-[10px]">
                        <tr>
                          <th className="p-3">Date / Time</th>
                          <th className="p-3">Client Name</th>
                          <th className="p-3">Phone & WhatsApp</th>
                          <th className="p-3">Country / City</th>
                          <th className="p-3">Service Required</th>
                          <th className="p-3">Message</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900">
                        {filteredLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-zinc-900/50">
                            <td className="p-3 whitespace-nowrap text-zinc-400 text-[11px] font-light">
                              {new Date(lead.createdAt).toLocaleString()}
                            </td>
                            <td className="p-3 font-bold text-white whitespace-nowrap">
                              {lead.fullName}
                            </td>
                            <td className="p-3 whitespace-nowrap space-y-0.5">
                              <div><a href={`tel:${lead.phone}`} className="text-orange-400 hover:underline">{lead.phone}</a></div>
                              {lead.whatsapp && (
                                <div className="text-[10px] text-emerald-400">
                                  WA: <a href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{lead.whatsapp}</a>
                                </div>
                              )}
                            </td>
                            <td className="p-3 whitespace-nowrap font-light">
                              {lead.country} ({lead.city || 'N/A'})
                            </td>
                            <td className="p-3 font-semibold text-orange-300">
                              {lead.serviceRequired}
                            </td>
                            <td className="p-3 max-w-xs truncate text-zinc-400 font-light">
                              {lead.message || '-'}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <select
                                value={lead.status}
                                onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                                  lead.status === 'New'
                                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                                    : lead.status === 'Contacted'
                                    ? 'bg-orange-500/10 border-orange-500/40 text-orange-400'
                                    : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                }`}
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </td>
                            <td className="p-3 text-right whitespace-nowrap space-x-2">
                              <a
                                href={`https://wa.me/${(lead.whatsapp || lead.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `Sat Sri Akal ${lead.fullName} Ji, I am Astrologer Jasleen Kaur responding to your consultation request.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 inline-block"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                              </a>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white"
                                title="Delete lead"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {filteredLeads.length === 0 && (
                      <div className="p-8 text-center text-zinc-500 font-light">
                        No enquiries submitted yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. SETTINGS & MEDIA UPLOAD TAB */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-black border border-zinc-800 space-y-4">
                    <h3 className="text-sm font-bold text-orange-300 uppercase tracking-wider">
                      Contact Numbers & Social Media Handles
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-zinc-400 font-light">Phone Number</label>
                        <input
                          type="text"
                          value={settingsForm.phone}
                          onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 font-light">WhatsApp Number</label>
                        <input
                          type="text"
                          value={settingsForm.whatsapp}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 font-light">Notification Email</label>
                        <input
                          type="email"
                          value={settingsForm.email}
                          onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-zinc-400 font-light">Instagram Handle</label>
                        <input
                          type="text"
                          value={settingsForm.instagram}
                          onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 font-light">Snapchat Handle</label>
                        <input
                          type="text"
                          value={settingsForm.snapchat}
                          onChange={(e) => setSettingsForm({ ...settingsForm, snapchat: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Media Upload & Portraits */}
                  <div className="p-6 rounded-2xl bg-black border border-zinc-800 space-y-4">
                    <h3 className="text-sm font-bold text-orange-300 uppercase tracking-wider">
                      Homepage Hero Media Uploads
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Waheguru Ji Image */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-300">Waheguru Ji Blessing Image</label>
                        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 relative">
                          <img src={settingsForm.waheguruImage} alt="Waheguru" className="w-full h-full object-cover" />
                        </div>
                        <input
                          type="text"
                          value={settingsForm.waheguruImage}
                          onChange={(e) => setSettingsForm({ ...settingsForm, waheguruImage: e.target.value })}
                          placeholder="Image URL"
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                        />
                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-orange-400 text-xs font-semibold cursor-pointer flex items-center gap-1 border border-zinc-800">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload New File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, (url) => setSettingsForm({ ...settingsForm, waheguruImage: url }))}
                              className="hidden"
                            />
                          </label>
                          {settingsForm.waheguruImage && (
                            <button
                              type="button"
                              onClick={() => openCropModal(settingsForm.waheguruImage, (url) => setSettingsForm({ ...settingsForm, waheguruImage: url }))}
                              className="px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-semibold flex items-center gap-1 border border-orange-500/30"
                            >
                              <Crop className="w-3.5 h-3.5" />
                              <span>Adjust Frame / Crop</span>
                            </button>
                          )}
                          {uploading && <span className="text-xs text-orange-400 animate-pulse">Uploading...</span>}
                        </div>
                      </div>

                      {/* Jasleen Kaur Image */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-300">Jasleen Kaur Personal Photo</label>
                        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 relative">
                          <img src={settingsForm.jasleenImage} alt="Jasleen" className="w-full h-full object-cover object-top" />
                        </div>
                        <input
                          type="text"
                          value={settingsForm.jasleenImage}
                          onChange={(e) => setSettingsForm({ ...settingsForm, jasleenImage: e.target.value })}
                          placeholder="Image URL"
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                        />
                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-orange-400 text-xs font-semibold cursor-pointer flex items-center gap-1 border border-zinc-800">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload New File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, (url) => setSettingsForm({ ...settingsForm, jasleenImage: url }))}
                              className="hidden"
                            />
                          </label>
                          {settingsForm.jasleenImage && (
                            <button
                              type="button"
                              onClick={() => openCropModal(settingsForm.jasleenImage, (url) => setSettingsForm({ ...settingsForm, jasleenImage: url }))}
                              className="px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-semibold flex items-center gap-1 border border-orange-500/30"
                            >
                              <Crop className="w-3.5 h-3.5" />
                              <span>Adjust Frame / Crop</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
                  >
                    <Save className="w-4 h-4" /> Save Site Settings
                  </button>
                </div>
              )}

              {/* 3. SERVICES MANAGER TAB */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-3">
                    <h3 className="text-xs font-bold text-orange-400 uppercase">
                      {editingServiceId ? 'Edit Service' : 'Add New Service'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Punjabi Title (e.g. ਲਵ ਪ੍ਰਾਬਲਮ ਸਮਾਧਾਨ)"
                        value={newService.titlePa}
                        onChange={(e) => setNewService({ ...newService, titlePa: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="English Title (e.g. Love Problem Solution)"
                        value={newService.titleEn}
                        onChange={(e) => setNewService({ ...newService, titleEn: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <textarea
                        rows={2}
                        placeholder="Punjabi Description"
                        value={newService.descPa}
                        onChange={(e) => setNewService({ ...newService, descPa: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                      />
                      <textarea
                        rows={2}
                        placeholder="English Description"
                        value={newService.descEn}
                        onChange={(e) => setNewService({ ...newService, descEn: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveService}
                        className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs"
                      >
                        {editingServiceId ? 'Update Service' : 'Add Service'}
                      </button>
                      {editingServiceId && (
                        <button
                          onClick={() => {
                            setEditingServiceId(null);
                            setNewService({ titlePa: '', titleEn: '', descPa: '', descEn: '', category: 'Relationships', iconName: 'Sparkles' });
                          }}
                          className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {services.map((s) => (
                      <div key={s.id} className="p-3 rounded-xl bg-black border border-zinc-800 flex justify-between items-start text-xs">
                        <div>
                          <div className="font-bold text-orange-300">{s.titleEn}</div>
                          <div className="text-zinc-400 font-light">{s.titlePa}</div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditingServiceId(s.id);
                              setNewService(s);
                            }}
                            className="p-1 rounded bg-zinc-900 text-orange-400 hover:text-white border border-zinc-800"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(s.id)}
                            className="p-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. GALLERY MANAGER TAB */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-3">
                    <h3 className="text-xs font-bold text-orange-400 uppercase">
                      {editingGalleryId ? 'Edit Gallery Item' : 'Add Gallery Photo / Video / Proof'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <input
                        type="text"
                        placeholder="Title (Punjabi)"
                        value={newGalleryItem.titlePa}
                        onChange={(e) => setNewGalleryItem({ ...newGalleryItem, titlePa: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Title (English)"
                        value={newGalleryItem.titleEn}
                        onChange={(e) => setNewGalleryItem({ ...newGalleryItem, titleEn: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                      />
                      <select
                        value={newGalleryItem.type || 'image'}
                        onChange={(e) => setNewGalleryItem({ ...newGalleryItem, type: e.target.value as any })}
                        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-orange-400 font-semibold"
                      >
                        <option value="image">📷 Type: Image</option>
                        <option value="video">🎥 Type: Video</option>
                      </select>
                      <select
                        value={newGalleryItem.category}
                        onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value as any })}
                        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                      >
                        <option value="Photos">Photos</option>
                        <option value="Videos">Videos</option>
                        <option value="Chat Proofs">Chat Proofs</option>
                        <option value="Testimonials">Testimonials</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <input
                        type="text"
                        placeholder="Media URL or YouTube Link (e.g. https://...)"
                        value={newGalleryItem.url}
                        onChange={(e) => {
                          const url = e.target.value;
                          const isVid = url.includes('youtube.com') || url.includes('youtu.be') || /\.(mp4|webm|mov)$/i.test(url);
                          setNewGalleryItem({
                            ...newGalleryItem,
                            url,
                            type: isVid ? 'video' : newGalleryItem.type || 'image',
                          });
                        }}
                        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                      />

                      <div className="flex flex-wrap items-center gap-2">
                        <label className="px-3 py-2 rounded-xl bg-zinc-900 text-orange-400 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold cursor-pointer flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileUpload(e, (url) =>
                                setNewGalleryItem({ ...newGalleryItem, url, type: 'image' })
                              )
                            }
                            className="hidden"
                          />
                        </label>

                        <label className="px-3 py-2 rounded-xl bg-orange-500/20 text-orange-300 hover:bg-orange-500 hover:text-black border border-orange-500/40 text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors">
                          <Video className="w-3.5 h-3.5 text-orange-400" />
                          <span>Upload Video File</span>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) =>
                              handleFileUpload(e, (url, isVideo) =>
                                setNewGalleryItem({
                                  ...newGalleryItem,
                                  url,
                                  type: 'video',
                                  category: newGalleryItem.category === 'Photos' ? 'Videos' : newGalleryItem.category,
                                })
                              )
                            }
                            className="hidden"
                          />
                        </label>

                        {newGalleryItem.url && newGalleryItem.type !== 'video' && (
                          <button
                            type="button"
                            onClick={() => openCropModal(newGalleryItem.url, (url) => setNewGalleryItem({ ...newGalleryItem, url }))}
                            className="px-3 py-2 rounded-xl bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/30 text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Crop className="w-3.5 h-3.5" />
                            <span>Adjust Frame / Crop</span>
                          </button>
                        )}

                        {uploading && (
                          <span className="text-xs text-orange-400 animate-pulse font-medium">
                            Uploading file...
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={handleSaveGallery} className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs">
                        {editingGalleryId ? 'Update Gallery Item' : 'Save Gallery Item'}
                      </button>
                      {editingGalleryId && (
                        <button
                          onClick={() => {
                            setEditingGalleryId(null);
                            setNewGalleryItem({ titlePa: '', titleEn: '', category: 'Photos', type: 'image', url: '' });
                          }}
                          className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {gallery.map((g) => {
                      const isVideoItem = g.type === 'video' || /\.(mp4|webm|mov|ogg)$/i.test(g.url);
                      return (
                        <div key={g.id} className="relative rounded-xl overflow-hidden bg-black border border-zinc-800 group">
                          <div className="aspect-[4/3] w-full bg-zinc-900 relative flex items-center justify-center overflow-hidden">
                            {isVideoItem ? (
                              <video src={g.url} className="w-full h-full object-cover" muted playsInline />
                            ) : (
                              <img src={g.thumbnailUrl || g.url} alt="" className="w-full h-full object-cover" />
                            )}
                            {isVideoItem && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-orange-500 text-black flex items-center justify-center shadow-lg">
                                  <Play className="w-4 h-4 fill-current ml-0.5" />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="p-2 text-[10px] text-white flex justify-between items-center gap-1">
                            <span className="truncate">{g.titleEn || (isVideoItem ? 'Video Item' : 'Gallery Image')}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingGalleryId(g.id);
                                  setNewGalleryItem(g);
                                }}
                                className="p-1 rounded bg-zinc-800 text-orange-400 hover:text-white"
                                title="Edit Item"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteGallery(g.id)}
                                className="p-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5. TESTIMONIALS MANAGER TAB */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-3">
                    <h3 className="text-xs font-bold text-orange-400 uppercase">
                      {editingTestimonialId ? 'Edit Testimonial' : 'Add Testimonial'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Customer Name"
                        value={newTestimonial.name}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Country (e.g. Canada)"
                        value={newTestimonial.country}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, country: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Flag Emoji (e.g. 🇨🇦)"
                        value={newTestimonial.flagEmoji}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, flagEmoji: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <input
                        type="text"
                        placeholder="Customer Photo URL (Optional)"
                        value={newTestimonial.image || ''}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, image: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                      />
                      <label className="px-3 py-2 rounded-xl bg-zinc-900 text-orange-400 border border-zinc-800 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Customer Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, (url) => setNewTestimonial({ ...newTestimonial, image: url }))}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Review Text (English)"
                      value={newTestimonial.reviewEn}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, reviewEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />
                    <textarea
                      rows={2}
                      placeholder="Review Text (Punjabi)"
                      value={newTestimonial.reviewPa}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, reviewPa: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />

                    <div className="flex gap-2">
                      <button onClick={handleSaveTestimonial} className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs">
                        {editingTestimonialId ? 'Update Review' : 'Add Review'}
                      </button>
                      {editingTestimonialId && (
                        <button
                          onClick={() => {
                            setEditingTestimonialId(null);
                            setNewTestimonial({ name: '', country: 'Canada', flagEmoji: '🇨🇦', rating: 5, reviewPa: '', reviewEn: '', service: 'Love Problem Solution' });
                          }}
                          className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {testimonials.map((t) => (
                      <div key={t.id} className="p-3 rounded-xl bg-black border border-zinc-800 flex justify-between items-center text-xs gap-3">
                        <div className="flex-1">
                          <span className="font-bold text-orange-300">{t.name}</span> ({t.country} {t.flagEmoji})
                          <p className="text-zinc-400 text-[11px] line-clamp-1 font-light">“{t.reviewEn}”</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingTestimonialId(t.id);
                              setNewTestimonial(t);
                            }}
                            className="p-1.5 rounded bg-zinc-900 text-orange-400 hover:text-white border border-zinc-800"
                            title="Edit Review"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(t.id)}
                            className="p-1.5 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. BLOGS MANAGER TAB */}
              {activeTab === 'blogs' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-3">
                    <h3 className="text-xs font-bold text-orange-400 uppercase">
                      {editingBlogId ? 'Edit Blog Article' : 'Write New Blog Article'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Title (English)"
                        value={newBlog.titleEn}
                        onChange={(e) => setNewBlog({ ...newBlog, titleEn: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Title (Punjabi)"
                        value={newBlog.titlePa}
                        onChange={(e) => setNewBlog({ ...newBlog, titlePa: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Featured Image URL"
                        value={newBlog.featuredImage}
                        onChange={(e) => setNewBlog({ ...newBlog, featuredImage: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                      />
                      <label className="px-3 py-2 rounded-xl bg-zinc-900 text-orange-400 border border-zinc-800 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Featured Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, (url) => setNewBlog({ ...newBlog, featuredImage: url }))}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <textarea
                      rows={4}
                      placeholder="Blog Article Content (English)"
                      value={newBlog.contentEn}
                      onChange={(e) => setNewBlog({ ...newBlog, contentEn: e.target.value, excerptEn: e.target.value.slice(0, 100) + '...' })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />
                    <textarea
                      rows={3}
                      placeholder="Blog Article Content (Punjabi)"
                      value={newBlog.contentPa}
                      onChange={(e) => setNewBlog({ ...newBlog, contentPa: e.target.value, excerptPa: e.target.value.slice(0, 100) + '...' })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />

                    <div className="flex gap-2">
                      <button onClick={handleSaveBlog} className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs">
                        {editingBlogId ? 'Update Blog Article' : 'Publish Blog Article'}
                      </button>
                      {editingBlogId && (
                        <button
                          onClick={() => {
                            setEditingBlogId(null);
                            setNewBlog({ titlePa: '', titleEn: '', contentPa: '', contentEn: '', excerptPa: '', excerptEn: '', category: 'Astrology', featuredImage: '', tags: [] });
                          }}
                          className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {blogs.map((b) => (
                      <div key={b.id} className="p-3 rounded-xl bg-black border border-zinc-800 flex justify-between items-center text-xs gap-3">
                        <div className="flex-1">
                          <div className="font-bold text-orange-300">{b.titleEn}</div>
                          <div className="text-[10px] text-zinc-400 font-light">{b.date} • {b.category}</div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingBlogId(b.id);
                              setNewBlog(b);
                            }}
                            className="p-1.5 rounded bg-zinc-900 text-orange-400 hover:text-white border border-zinc-800"
                            title="Edit Article"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(b.id)}
                            className="p-1.5 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white"
                            title="Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. FAQS MANAGER TAB */}
              {activeTab === 'faqs' && (
                <div className="space-y-6">
                  {/* Top Header Controls */}
                  <div className="flex items-center justify-between gap-3 bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800 flex-wrap">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">FAQ Management</h4>
                      <p className="text-[11px] text-zinc-400">Total FAQs: {faqs.length}</p>
                    </div>
                    <button
                      onClick={handleCleanBlankFaqs}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Automatically purge all empty or unformatted FAQs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove All Blank FAQs</span>
                    </button>
                  </div>

                  {/* Add / Edit FAQ Form */}
                  <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-3">
                    <h3 className="text-xs font-bold text-orange-400 uppercase">
                      {editingFaqId ? 'Edit FAQ Item' : 'Add New FAQ Item'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-zinc-400 font-semibold mb-1 block">Question (English)*</label>
                        <input
                          type="text"
                          placeholder="e.g. How long does consultation take?"
                          value={newFaq.questionEn}
                          onChange={(e) => setNewFaq({ ...newFaq, questionEn: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-orange-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 font-semibold mb-1 block">Question (Punjabi)</label>
                        <input
                          type="text"
                          placeholder="e.g. ਸਲਾਹ ਲੈਣ ਲਈ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗਦਾ ਹੈ?"
                          value={newFaq.questionPa}
                          onChange={(e) => setNewFaq({ ...newFaq, questionPa: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-orange-500 outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-zinc-400 font-semibold mb-1 block">Answer (English)*</label>
                        <textarea
                          rows={3}
                          placeholder="e.g. Consultations usually last 30-45 minutes..."
                          value={newFaq.answerEn}
                          onChange={(e) => setNewFaq({ ...newFaq, answerEn: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-orange-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 font-semibold mb-1 block">Answer (Punjabi)</label>
                        <textarea
                          rows={3}
                          placeholder="e.g. ਰੂਹਾਨੀ ਸਲਾਹ ਆਮ ਤੌਰ 'ਤੇ 30-45 ਮਿੰਟ ਰਹਿੰਦੀ ਹੈ..."
                          value={newFaq.answerPa}
                          onChange={(e) => setNewFaq({ ...newFaq, answerPa: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-orange-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button onClick={handleSaveFaq} className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs shadow-md">
                        {editingFaqId ? 'Update FAQ' : 'Save FAQ Item'}
                      </button>
                      {editingFaqId && (
                        <button
                          onClick={() => {
                            setEditingFaqId(null);
                            setNewFaq({ questionPa: '', questionEn: '', answerPa: '', answerEn: '' });
                          }}
                          className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* FAQ List */}
                  <div className="space-y-2.5">
                    {faqs.length === 0 ? (
                      <div className="text-center py-8 text-zinc-500 text-xs bg-black rounded-2xl border border-zinc-800">
                        No FAQs found. Add your first FAQ using the form above!
                      </div>
                    ) : (
                      faqs.map((f) => {
                        const isBlank = !f.questionEn?.trim() && !f.questionPa?.trim();
                        return (
                          <div
                            key={f.id}
                            className={`p-3.5 rounded-2xl border flex justify-between items-start text-xs gap-3 transition-colors ${
                              isBlank
                                ? 'bg-rose-950/20 border-rose-800/40'
                                : 'bg-black border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex-1 space-y-1">
                              {isBlank ? (
                                <span className="inline-block px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                                  Empty / Unformatted Blank FAQ
                                </span>
                              ) : (
                                <>
                                  <div className="font-bold text-orange-300">
                                    {f.questionEn || f.questionPa || 'Untitled Question'}
                                  </div>
                                  {f.questionPa && f.questionPa !== f.questionEn && (
                                    <div className="text-[11px] text-zinc-400 font-serif">
                                      {f.questionPa}
                                    </div>
                                  )}
                                  <p className="text-zinc-300 text-[11px] font-light pt-0.5">
                                    {f.answerEn || f.answerPa || 'No answer provided.'}
                                  </p>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                              <button
                                onClick={() => {
                                  setEditingFaqId(f.id);
                                  setNewFaq(f);
                                }}
                                className="p-1.5 rounded-lg bg-zinc-900 text-orange-400 hover:text-white border border-zinc-800 transition-colors"
                                title="Edit FAQ"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteFaq(f.id)}
                                className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                                title="Delete FAQ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      {/* IMAGE CROP & FRAME ADJUSTMENT MODAL */}
      {cropModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-orange-500/40 rounded-3xl p-6 max-w-2xl w-full space-y-5 shadow-[0_0_50px_rgba(234,88,12,0.3)]">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Crop className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Adjust Image Frame & Crop
                </h3>
              </div>
              <button
                onClick={() => setCropModalOpen(false)}
                className="p-1.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Interactive Frame Preview */}
            <div className="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center">
              <div
                className="relative overflow-hidden w-full h-full flex items-center justify-center"
                style={{
                  aspectRatio: cropAspect === '16:9' ? '16/9' : cropAspect === '1:1' ? '1/1' : cropAspect === '3:4' ? '3/4' : '4/3',
                }}
              >
                <img
                  src={cropImageUrl}
                  alt="Crop Preview"
                  className="max-w-none transition-transform duration-100"
                  style={{
                    transform: `scale(${cropScale}) translate(${cropOffsetX}%, ${cropOffsetY}%)`,
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 rounded-full text-[10px] text-orange-300 border border-orange-500/30 font-semibold">
                Live Frame Aspect: {cropAspect}
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-3 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 text-xs">
              {/* Aspect Ratio Selector */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-zinc-400 font-semibold">Frame Aspect Ratio:</span>
                <div className="flex gap-1.5">
                  {(['4:3', '16:9', '1:1', '3:4'] as const).map((asp) => (
                    <button
                      key={asp}
                      type="button"
                      onClick={() => setCropAspect(asp)}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] border ${
                        cropAspect === asp
                          ? 'bg-orange-500 text-black border-orange-400'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white'
                      }`}
                    >
                      {asp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom Scale */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-400 font-semibold shrink-0">Zoom Level ({cropScale.toFixed(2)}x):</span>
                <input
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.05"
                  value={cropScale}
                  onChange={(e) => setCropScale(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              {/* Vertical Position (Top/Face Focus vs Center vs Bottom) */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <span className="text-zinc-400 font-semibold shrink-0">Vertical Alignment:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCropOffsetY(25)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${
                      cropOffsetY === 25 ? 'bg-orange-500/20 text-orange-300 border-orange-500' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    Top (Face Focus)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCropOffsetY(0)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${
                      cropOffsetY === 0 ? 'bg-orange-500/20 text-orange-300 border-orange-500' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => setCropOffsetY(-25)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${
                      cropOffsetY === -25 ? 'bg-orange-500/20 text-orange-300 border-orange-500' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    Bottom
                  </button>
                </div>
              </div>

              {/* Fine Offset Sliders */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[10px] text-zinc-400">Horizontal Pan (X):</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={cropOffsetX}
                    onChange={(e) => setCropOffsetX(parseInt(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400">Vertical Pan (Y):</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={cropOffsetY}
                    onChange={(e) => setCropOffsetY(parseInt(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCropModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                disabled={isProcessingCrop}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg"
              >
                {isProcessingCrop ? 'Processing Crop...' : 'Save & Apply Cropped Frame'}
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};
