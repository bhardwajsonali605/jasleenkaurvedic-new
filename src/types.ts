export type Language = 'pa' | 'en';

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  country: string;
  city: string;
  serviceRequired: string;
  preferredContactMethod: string;
  message: string;
  createdAt: string;
  status: 'New' | 'Contacted' | 'Completed';
  ipAddress?: string;
  browser?: string;
  device?: string;
}

export interface ServiceItem {
  id: string;
  iconName: string;
  titlePa: string;
  titleEn: string;
  descPa: string;
  descEn: string;
  category: string;
  popular?: boolean;
}

export interface GalleryItem {
  id: string;
  titlePa: string;
  titleEn: string;
  category: 'Photos' | 'Videos' | 'Screenshots' | 'Testimonials' | 'Chat Proofs';
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  date: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  country: string;
  flagEmoji: string;
  rating: number;
  reviewPa: string;
  reviewEn: string;
  image?: string;
  videoUrl?: string;
  service: string;
  date: string;
}

export interface BlogPost {
  id: string;
  titlePa: string;
  titleEn: string;
  slug: string;
  contentPa: string;
  contentEn: string;
  excerptPa: string;
  excerptEn: string;
  category: string;
  featuredImage: string;
  tags: string[];
  date: string;
  readTime: string;
  author: string;
}

export interface FaqItem {
  id: string;
  questionPa: string;
  questionEn: string;
  answerPa: string;
  answerEn: string;
}

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  snapchat: string;
  heroTitlePa: string;
  heroTitleEn: string;
  heroSubtitlePa: string;
  heroSubtitleEn: string;
  waheguruImage: string;
  jasleenImage: string;
  experienceYears: number;
  consultationsCompleted: number;
  satisfactionRate: number;
  countriesServed: number;
}
