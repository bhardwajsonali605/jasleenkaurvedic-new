import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { SiteSettings, ServiceItem, GalleryItem, TestimonialItem, BlogPost, FaqItem } from './types';
import { initialSiteSettings, initialServices, initialGallery, initialTestimonials, initialBlogs } from './data/initialData';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { WorldwideSection } from './components/WorldwideSection';
import { HoroscopeWidget } from './components/HoroscopeWidget';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { FloatingControls } from './components/FloatingControls';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { ConsultationModal } from './components/ConsultationModal';

export function AppContent() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<string | undefined>(undefined);

  const loadData = async () => {
    try {
      const res = await fetch('/api/site-data');
      if (res.ok) {
        const data = await res.json();
        if (data.siteSettings) setSiteSettings(data.siteSettings);
        if (Array.isArray(data.services)) setServices(data.services);
        if (Array.isArray(data.gallery)) setGallery(data.gallery);
        if (Array.isArray(data.testimonials)) setTestimonials(data.testimonials);
        if (Array.isArray(data.blogs)) setBlogs(data.blogs);
        if (Array.isArray(data.faqs)) setFaqs(data.faqs);
      }
    } catch (e) {
      console.warn('Backend API offline or loading local fallback data', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenConsultationModal = (serviceName?: string) => {
    setSelectedServiceForModal(serviceName);
    setIsConsultationModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500 selection:text-neutral-950">
      
      {/* Sticky Top Navbar */}
      <Navbar
        settings={siteSettings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenConsultationModal={handleOpenConsultationModal}
      />

      {/* Hero Section */}
      <HeroSection
        settings={siteSettings}
        onOpenConsultationModal={handleOpenConsultationModal}
      />

      {/* Proof Gallery & Photos/Videos (Moved first above About section) */}
      <GallerySection items={gallery} />

      {/* About Me Section */}
      <AboutSection
        settings={siteSettings}
        onOpenConsultationModal={() => handleOpenConsultationModal()}
      />

      {/* 21+ Services Section */}
      <ServicesSection
        services={services}
        onOpenConsultationModal={handleOpenConsultationModal}
      />

      {/* Worldwide Services Map & Countries */}
      <WorldwideSection
        onOpenConsultationModal={handleOpenConsultationModal}
        whatsappNumber={siteSettings.whatsapp}
      />

      {/* Interactive Zodiac Horoscope & Numerology Calculator */}
      <HoroscopeWidget
        onOpenConsultationModal={handleOpenConsultationModal}
      />

      {/* Verified Client Testimonials */}
      <TestimonialsSection
        testimonials={testimonials}
        onOpenConsultationModal={() => handleOpenConsultationModal()}
      />

      {/* FAQ Accordion */}
      <FaqSection faqs={faqs} />

      {/* SEO Astrology Blog */}
      <BlogSection blogs={blogs} />

      {/* Main Working Contact Form */}
      <ContactSection
        settings={siteSettings}
        services={services}
        preSelectedService={selectedServiceForModal}
      />

      {/* Footer */}
      <Footer
        settings={siteSettings}
        onOpenConsultationModal={() => handleOpenConsultationModal()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating Action Buttons */}
      <FloatingControls
        phone={siteSettings.phone}
        whatsapp={siteSettings.whatsapp}
        instagram={siteSettings.instagram}
        snapchat={siteSettings.snapchat}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Admin Panel Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        siteSettings={siteSettings}
        services={services}
        gallery={gallery}
        testimonials={testimonials}
        blogs={blogs}
        faqs={faqs}
        onRefreshData={loadData}
      />

      {/* Quick Consultation Popup Modal */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        preSelectedService={selectedServiceForModal}
        services={services}
        whatsappNumber={siteSettings.whatsapp}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
