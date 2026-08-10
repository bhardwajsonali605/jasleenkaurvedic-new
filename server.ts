import express from 'express';
import path from 'path';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import { createServer as createViteServer } from 'vite';

import {
  initialSiteSettings,
  initialServices,
  initialGallery,
  initialTestimonials,
  initialBlogs,
  initialFaqs,
} from './src/data/initialData';

import { Lead } from './src/types';

const app = express();

const PORT = Number(process.env.PORT) || 3000;

// ======================================================
// SUPABASE
// ======================================================

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables.');
  console.error('Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

// ======================================================
// CLOUDINARY
// ======================================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ======================================================
// EXPRESS
// ======================================================

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// ======================================================
// DATABASE STRUCTURE
// ======================================================

interface DBStructure {
  siteSettings: typeof initialSiteSettings;
  leads: Lead[];
  services: typeof initialServices;
  gallery: typeof initialGallery;
  testimonials: typeof initialTestimonials;
  blogs: typeof initialBlogs;
  faqs: typeof initialFaqs;
}

// ======================================================
// FAQ CLEANING
// ======================================================

function normalizeAndFilterFaqs(rawFaqs: any[]): typeof initialFaqs {
  if (!Array.isArray(rawFaqs) || rawFaqs.length === 0) {
    return initialFaqs;
  }

  const cleaned = rawFaqs
    .map((f, i) => {
      const questionEn = String(f.questionEn || f.qEn || '').trim();
      const questionPa = String(f.questionPa || f.qPa || '').trim();
      const answerEn = String(f.answerEn || f.aEn || '').trim();
      const answerPa = String(f.answerPa || f.aPa || '').trim();

      const id = f.id || `faq-${i + 1}`;

      return {
        id,
        questionEn,
        questionPa,
        answerEn,
        answerPa,
      };
    })
    .filter(
      (f) =>
        f.questionEn !== '' ||
        f.questionPa !== '' ||
        f.answerEn !== '' ||
        f.answerPa !== ''
    );

  return cleaned.length > 0 ? cleaned : initialFaqs;
}

// ======================================================
// DEFAULT DATABASE
// ======================================================

function createDefaultDB(): DBStructure {
  return {
    siteSettings: initialSiteSettings,
    leads: [],
    services: initialServices,
    gallery: initialGallery,
    testimonials: initialTestimonials,
    blogs: initialBlogs,
    faqs: initialFaqs,
  };
}

// ======================================================
// LOAD DATABASE FROM SUPABASE
// ======================================================

async function loadDB(): Promise<DBStructure> {
  if (!supabase) {
    console.error('❌ Supabase client is not configured.');
    return createDefaultDB();
  }

  try {
    const { data, error } = await supabase
      .from('site_data')
      .select('id, data')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      console.error('❌ Supabase load error:', error);
      return createDefaultDB();
    }

    if (!data) {
      const defaultDB = createDefaultDB();

      const { error: insertError } = await supabase
        .from('site_data')
        .insert({
          id: 1,
          data: defaultDB,
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('❌ Failed creating initial Supabase data:', insertError);
      } else {
        console.log('✅ Initial website data created in Supabase.');
      }

      return defaultDB;
    }

    const parsed = data.data || {};

    return {
      siteSettings: parsed.siteSettings || initialSiteSettings,
      leads: Array.isArray(parsed.leads) ? parsed.leads : [],
      services: parsed.services || initialServices,
      gallery: parsed.gallery || initialGallery,
      testimonials: parsed.testimonials || initialTestimonials,
      blogs: parsed.blogs || initialBlogs,
      faqs: normalizeAndFilterFaqs(parsed.faqs || initialFaqs),
    };
  } catch (error) {
    console.error('❌ Error loading Supabase database:', error);
    return createDefaultDB();
  }
}

// ======================================================
// SAVE DATABASE TO SUPABASE
// ======================================================

async function saveDB(db: DBStructure): Promise<boolean> {
  if (!supabase) {
    console.error('❌ Supabase client is not configured.');
    return false;
  }

  try {
    const { error } = await supabase
      .from('site_data')
      .upsert(
        {
          id: 1,
          data: db,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'id',
        }
      );

    if (error) {
      console.error('❌ Supabase save error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Error saving to Supabase:', error);
    return false;
  }
}

// ======================================================
// HEALTH CHECK
// ======================================================

app.get('/api/health', async (_req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    database: supabase ? 'supabase' : 'not-configured',
    storage: 'cloudinary',
  });
});

// ======================================================
// GET ALL PUBLIC SITE DATA
// ======================================================

app.get('/api/site-data', async (_req, res) => {
  try {
    const db = await loadDB();

    res.json({
      siteSettings: db.siteSettings,
      services: db.services,
      gallery: db.gallery,
      testimonials: db.testimonials,
      blogs: db.blogs,
      faqs: db.faqs || initialFaqs,
    });
  } catch (error) {
    console.error('Site data error:', error);
    res.status(500).json({
      error: 'Unable to load site data.',
    });
  }
});

// ======================================================
// SUBMIT LEAD
// ======================================================

app.post('/api/leads/submit', async (req, res) => {
  try {
    const {
      fullName,
      phone,
      whatsapp,
      country,
      city,
      serviceRequired,
      preferredContactMethod,
      message,
    } = req.body;

    if (!fullName || !phone || !serviceRequired) {
      return res.status(400).json({
        error:
          'Full Name, Phone Number, and Service Required are mandatory.',
      });
    }

    const db = await loadDB();

    const clientIp =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      'Unknown IP';

    const userAgent =
      req.headers['user-agent'] || 'Unknown Device/Browser';

    const newLead: Lead = {
      id:
        'lead-' +
        Date.now() +
        '-' +
        Math.random().toString(36).substring(2, 7),

      fullName: String(fullName).trim(),

      phone: String(phone).trim(),

      whatsapp: String(whatsapp || phone).trim(),

      country: String(country || 'Not specified').trim(),

      city: String(city || 'Not specified').trim(),

      serviceRequired: String(serviceRequired).trim(),

      preferredContactMethod: String(
        preferredContactMethod || 'WhatsApp'
      ).trim(),

      message: String(message || '').trim(),

      createdAt: new Date().toISOString(),

      status: 'New',

      ipAddress: clientIp,

      browser: userAgent.split(' ')[0] || 'Browser',

      device: userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
    };

    db.leads.unshift(newLead);

    await saveDB(db);

    console.log('==========================================');
    console.log('📬 NEW LEAD');
    console.log('Name:', newLead.fullName);
    console.log('Phone:', newLead.phone);
    console.log('WhatsApp:', newLead.whatsapp);
    console.log('Country:', newLead.country);
    console.log('City:', newLead.city);
    console.log('Service:', newLead.serviceRequired);
    console.log('Message:', newLead.message);
    console.log('Time:', newLead.createdAt);
    console.log('==========================================');

    // ==================================================
    // WHATSAPP CLOUD API
    // ==================================================

    const waToken = process.env.WHATSAPP_CLOUD_API_TOKEN;
    const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    let whatsappSent = false;

    if (waToken && waPhoneId) {
      try {
        console.log(
          'WhatsApp Cloud API credentials detected.'
        );

        // WhatsApp API can be connected here later.
        whatsappSent = false;
      } catch (err) {
        console.error(
          'WhatsApp Cloud API error:',
          err
        );
      }
    }

    // ==================================================
    // DIRECT WHATSAPP LINK
    // ==================================================

    const targetWaNumber = String(
      db.siteSettings.whatsapp || '+917375920228'
    ).replace(/[^0-9]/g, '');

    const textMsg = encodeURIComponent(
      `*New Spiritual Consultation Enquiry*\n\n` +
        `👤 *Name:* ${newLead.fullName}\n` +
        `📞 *Phone:* ${newLead.phone}\n` +
        `💬 *WhatsApp:* ${newLead.whatsapp}\n` +
        `🌍 *Country:* ${newLead.country}\n` +
        `🏙️ *City:* ${newLead.city}\n` +
        `🔮 *Service:* ${newLead.serviceRequired}\n` +
        `✉️ *Message:* ${newLead.message}\n` +
        `⏰ *Date:* ${new Date(
          newLead.createdAt
        ).toLocaleString()}`
    );

    const directWaUrl =
      `https://wa.me/${targetWaNumber}?text=${textMsg}`;

    res.json({
      success: true,
      message:
        'Enquiry submitted successfully! Astrologer Jasleen Kaur will contact you shortly.',
      leadId: newLead.id,
      emailSentTo: 'Astrojasleenkaur@gmail.com',
      whatsappSent,
      directWaUrl,
    });
  } catch (error) {
    console.error('❌ Error submitting lead:', error);

    res.status(500).json({
      error: 'Server error processing consultation request.',
    });
  }
});

// ======================================================
// ADMIN LOGIN
// ======================================================

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;

  const adminPassword =
    process.env.ADMIN_PASSWORD || 'admin123';

  if (password === adminPassword) {
    return res.json({
      success: true,
      token: 'session-' + Date.now(),
    });
  }

  return res.status(401).json({
    error: 'Invalid admin credentials.',
  });
});

// ======================================================
// ADMIN GET LEADS
// ======================================================

app.get('/api/admin/leads', async (_req, res) => {
  try {
    const db = await loadDB();

    res.json({
      leads: db.leads,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Unable to load leads.',
    });
  }
});

// ======================================================
// ADMIN UPDATE LEAD STATUS
// ======================================================

app.patch('/api/admin/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const db = await loadDB();

    const lead = db.leads.find(
      (l) => l.id === id
    );

    if (!lead) {
      return res.status(404).json({
        error: 'Lead not found',
      });
    }

    lead.status = status;

    await saveDB(db);

    return res.json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Unable to update lead.',
    });
  }
});

// ======================================================
// ADMIN DELETE LEAD
// ======================================================

app.delete('/api/admin/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const db = await loadDB();

    db.leads = db.leads.filter(
      (l) => l.id !== id
    );

    await saveDB(db);

    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Unable to delete lead.',
    });
  }
});

// ======================================================
// EXPORT LEADS CSV
// ======================================================

app.get('/api/admin/leads/export', async (_req, res) => {
  try {
    const db = await loadDB();

    let csv =
      'ID,Full Name,Phone,WhatsApp,Country,City,Service,Contact Method,Status,Created At,Message,IP\n';

    db.leads.forEach((l) => {
      const row = [
        `"${l.id}"`,
        `"${l.fullName.replace(/"/g, '""')}"`,
        `"${l.phone}"`,
        `"${l.whatsapp}"`,
        `"${l.country}"`,
        `"${l.city}"`,
        `"${l.serviceRequired.replace(/"/g, '""')}"`,
        `"${l.preferredContactMethod}"`,
        `"${l.status}"`,
        `"${l.createdAt}"`,
        `"${(l.message || '').replace(/"/g, '""')}"`,
        `"${l.ipAddress || ''}"`,
      ].join(',');

      csv += row + '\n';
    });

    res.setHeader(
      'Content-Type',
      'text/csv'
    );

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=astrology_leads.csv'
    );

    res.send(csv);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Unable to export leads.',
    });
  }
});

// ======================================================
// UPDATE SITE SETTINGS
// ======================================================

app.post('/api/admin/settings', async (req, res) => {
  try {
    const db = await loadDB();

    db.siteSettings = {
      ...db.siteSettings,
      ...req.body,
    };

    await saveDB(db);

    res.json({
      success: true,
      siteSettings: db.siteSettings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Unable to update settings.',
    });
  }
});

// ======================================================
// SERVICES
// ======================================================

app.post('/api/admin/services', async (req, res) => {
  try {
    const db = await loadDB();

    const service = req.body;

    if (!service.id) {
      service.id = 'service-' + Date.now();
      db.services.push(service);
    } else {
      const idx = db.services.findIndex(
        (s) => s.id === service.id
      );

      if (idx !== -1) {
        db.services[idx] = service;
      } else {
        db.services.push(service);
      }
    }

    await saveDB(db);

    res.json({
      success: true,
      services: db.services,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Unable to save service.',
    });
  }
});

app.delete('/api/admin/services/:id', async (req, res) => {
  try {
    const db = await loadDB();

    db.services = db.services.filter(
      (s) => s.id !== req.params.id
    );

    await saveDB(db);

    res.json({
      success: true,
      services: db.services,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Unable to delete service.',
    });
  }
});

// ======================================================
// GALLERY
// ======================================================

app.post('/api/admin/gallery', async (req, res) => {
  try {
    const db = await loadDB();

    const item = req.body;

    if (!item.id) {
      item.id = 'gal-' + Date.now();
      item.date =
        item.date ||
        new Date().toISOString().split('T')[0];

      db.gallery.unshift(item);
    } else {
      const idx = db.gallery.findIndex(
        (g) => g.id === item.id
      );

      if (idx !== -1) {
        db.gallery[idx] = item;
      } else {
        db.gallery.unshift(item);
      }
    }

    await saveDB(db);

    res.json({
      success: true,
      gallery: db.gallery,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Unable to save gallery item.',
    });
  }
});

app.delete('/api/admin/gallery/:id', async (req, res) => {
  try {
    const db = await loadDB();

    db.gallery = db.gallery.filter(
      (g) => g.id !== req.params.id
    );

    await saveDB(db);

    res.json({
      success: true,
      gallery: db.gallery,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Unable to delete gallery item.',
    });
  }
});

// ======================================================
// TESTIMONIALS
// ======================================================

app.post('/api/admin/testimonials', async (req, res) => {
  try {
    const db = await loadDB();

    const item = req.body;

    if (!item.id) {
      item.id = 't-' + Date.now();

      item.date =
        item.date ||
        new Date().toISOString().split('T')[0];

      db.testimonials.unshift(item);
    } else {
      const idx = db.testimonials.findIndex(
        (t) => t.id === item.id
      );

      if (idx !== -1) {
        db.testimonials[idx] = item;
      } else {
        db.testimonials.unshift(item);
      }
    }

    await saveDB(db);

    res.json({
      success: true,
      testimonials: db.testimonials,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Unable to save testimonial.',
    });
  }
});

app.delete(
  '/api/admin/testimonials/:id',
  async (req, res) => {
    try {
      const db = await loadDB();

      db.testimonials =
        db.testimonials.filter(
          (t) => t.id !== req.params.id
        );

      await saveDB(db);

      res.json({
        success: true,
        testimonials: db.testimonials,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: 'Unable to delete testimonial.',
      });
    }
  }
);

// ======================================================
// BLOGS
// ======================================================

app.post('/api/admin/blogs', async (req, res) => {
  try {
    const db = await loadDB();

    const post = req.body;

    if (!post.id) {
      post.id = 'b-' + Date.now();

      post.date =
        post.date ||
        new Date().toISOString().split('T')[0];

      db.blogs.unshift(post);
    } else {
      const idx = db.blogs.findIndex(
        (b) => b.id === post.id
      );

      if (idx !== -1) {
        db.blogs[idx] = post;
      } else {
        db.blogs.unshift(post);
      }
    }

    await saveDB(db);

    res.json({
      success: true,
      blogs: db.blogs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Unable to save blog.',
    });
  }
});

app.delete('/api/admin/blogs/:id', async (req, res) => {
  try {
    const db = await loadDB();

    db.blogs = db.blogs.filter(
      (b) => b.id !== req.params.id
    );

    await saveDB(db);

    res.json({
      success: true,
      blogs: db.blogs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Unable to delete blog.',
    });
  }
});

// ======================================================
// FAQS
// ======================================================

app.post('/api/admin/faqs', async (req, res) => {
  try {
    const db = await loadDB();

    const faq = req.body;

    if (!db.faqs) {
      db.faqs = [...initialFaqs];
    }

    if (!faq.id) {
      faq.id = 'faq-' + Date.now();
      db.faqs.push(faq);
    } else {
      const idx = db.faqs.findIndex(
        (f) => f.id === faq.id
      );

      if (idx !== -1) {
        db.faqs[idx] = faq;
      } else {
        db.faqs.push(faq);
      }
    }

    await saveDB(db);

    res.json({
      success: true,
      faqs: db.faqs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Unable to save FAQ.',
    });
  }
});

app.delete('/api/admin/faqs/:id', async (req, res) => {
  try {
    const db = await loadDB();

    if (!db.faqs) {
      db.faqs = [...initialFaqs];
    }

    db.faqs = db.faqs.filter(
      (f) => f.id !== req.params.id
    );

    await saveDB(db);

    res.json({
      success: true,
      faqs: db.faqs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Unable to delete FAQ.',
    });
  }
});

app.post(
  '/api/admin/faqs/clean-blank',
  async (_req, res) => {
    try {
      const db = await loadDB();

      db.faqs = normalizeAndFilterFaqs(
        db.faqs
      );

      await saveDB(db);

      res.json({
        success: true,
        faqs: db.faqs,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: 'Unable to clean FAQs.',
      });
    }
  }
);

// ======================================================
// CLOUDINARY FILE UPLOAD
// ======================================================

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 300 * 1024 * 1024,
  },
});

// ======================================================
// CLOUDINARY BUFFER UPLOAD
// ======================================================

function uploadBufferToCloudinary(
  buffer: Buffer,
  mimeType: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const isVideo =
      mimeType.startsWith('video/');

    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: 'astrology_uploads',
          resource_type: isVideo
            ? 'video'
            : 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        }
      );

    uploadStream.end(buffer);
  });
}

// ======================================================
// MULTIPART FILE UPLOAD
// ======================================================

app.post(
  '/api/upload-file',
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
        });
      }

      const result =
        await uploadBufferToCloudinary(
          req.file.buffer,
          req.file.mimetype
        );

      res.json({
        success: true,
        url: result.secure_url,
        mimeType: req.file.mimetype,
      });
    } catch (err: any) {
      console.error(
        '❌ Cloudinary upload error:',
        err
      );

      res.status(500).json({
        error:
          err?.message ||
          'Failed to upload file to Cloudinary',
      });
    }
  }
);

// ======================================================
// BASE64 UPLOAD
// ======================================================

app.post('/api/upload', async (req, res) => {
  try {
    const { fileData } = req.body;

    if (
      !fileData ||
      typeof fileData !== 'string'
    ) {
      return res.status(400).json({
        error: 'No file data provided',
      });
    }

    let mimeType =
      'application/octet-stream';

    let base64Data = fileData;

    if (fileData.includes(';base64,')) {
      const parts =
        fileData.split(';base64,');

      mimeType = parts[0]
        .replace(/^data:/, '')
        .trim()
        .toLowerCase();

      base64Data = parts[1];
    } else if (
      fileData.startsWith('data:')
    ) {
      const commaIdx =
        fileData.indexOf(',');

      if (commaIdx !== -1) {
        const semicolonIdx =
          fileData.indexOf(';');

        mimeType = fileData
          .substring(
            5,
            semicolonIdx
          )
          .trim()
          .toLowerCase();

        base64Data =
          fileData.substring(
            commaIdx + 1
          );
      }
    }

    base64Data =
      base64Data.replace(
        /[\r\n\s]/g,
        ''
      );

    if (!base64Data) {
      return res.status(400).json({
        error: 'Invalid Base64 string',
      });
    }

    const dataUri =
      `data:${mimeType};base64,${base64Data}`;

    const isVideo =
      mimeType.startsWith('video/');

    const result =
      await cloudinary.uploader.upload(
        dataUri,
        {
          folder: 'astrology_uploads',
          resource_type: isVideo
            ? 'video'
            : 'auto',
        }
      );

    res.json({
      success: true,
      url: result.secure_url,
      mimeType,
    });
  } catch (err: any) {
    console.error(
      '❌ Cloudinary upload error:',
      err
    );

    res.status(500).json({
      error:
        err?.message ||
        'Failed to upload file to Cloudinary',
    });
  }
});

// ======================================================
// VITE
// ======================================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite =
      await createViteServer({
        server: {
          middlewareMode: true,
        },
        appType: 'spa',
      });

    app.use(vite.middlewares);
  } else {
    const distPath =
      path.join(
        process.cwd(),
        'dist'
      );

    app.use(
      express.static(distPath)
    );

    app.get('*', (_req, res) => {
      res.sendFile(
        path.join(
          distPath,
          'index.html'
        )
      );
    });
  }

  app.listen(
    PORT,
    '0.0.0.0',
    () => {
      console.log(
        `✨ Astrology Server running on port ${PORT}`
      );

      console.log(
        `☁️ Cloudinary storage: enabled`
      );

      console.log(
        `🗄️ Supabase database: ${
          supabase
            ? 'enabled'
            : 'NOT CONFIGURED'
        }`
      );
    }
  );
}

startServer();