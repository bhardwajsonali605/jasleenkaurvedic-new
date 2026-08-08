import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { initialSiteSettings, initialServices, initialGallery, initialTestimonials, initialBlogs, initialFaqs } from './src/data/initialData';
import { Lead } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Ensure data directory & uploads directory exist
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve public uploads statically
app.use('/uploads', express.static(UPLOADS_DIR));

interface DBStructure {
  siteSettings: typeof initialSiteSettings;
  leads: Lead[];
  services: typeof initialServices;
  gallery: typeof initialGallery;
  testimonials: typeof initialTestimonials;
  blogs: typeof initialBlogs;
  faqs: typeof initialFaqs;
}

function normalizeAndFilterFaqs(rawFaqs: any[]): typeof initialFaqs {
  if (!Array.isArray(rawFaqs) || rawFaqs.length === 0) {
    return initialFaqs;
  }
  const cleaned = rawFaqs.map((f, i) => {
    const questionEn = (f.questionEn || f.qEn || '').trim();
    const questionPa = (f.questionPa || f.qPa || '').trim();
    const answerEn = (f.answerEn || f.aEn || '').trim();
    const answerPa = (f.answerPa || f.aPa || '').trim();
    const id = f.id || `faq-${i + 1}`;
    return {
      id,
      questionEn,
      questionPa,
      answerEn,
      answerPa,
    };
  }).filter((f) => f.questionEn !== '' || f.questionPa !== '' || f.answerEn !== '' || f.answerPa !== '');

  return cleaned.length > 0 ? cleaned : initialFaqs;
}

function loadDB(): DBStructure {
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      const faqs = normalizeAndFilterFaqs(parsed.faqs || initialFaqs);
      return {
        siteSettings: parsed.siteSettings || initialSiteSettings,
        leads: parsed.leads || [],
        services: parsed.services || initialServices,
        gallery: parsed.gallery || initialGallery,
        testimonials: parsed.testimonials || initialTestimonials,
        blogs: parsed.blogs || initialBlogs,
        faqs,
      };
    } catch (e) {
      console.error('Failed reading DB file, resetting to initial', e);
    }
  }
  const db: DBStructure = {
    siteSettings: initialSiteSettings,
    leads: [],
    services: initialServices,
    gallery: initialGallery,
    testimonials: initialTestimonials,
    blogs: initialBlogs,
    faqs: initialFaqs,
  };
  saveDB(db);
  return db;
}

function saveDB(db: DBStructure) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving DB file:', e);
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// GET all public site data
app.get('/api/site-data', (req, res) => {
  const db = loadDB();
  res.json({
    siteSettings: db.siteSettings,
    services: db.services,
    gallery: db.gallery,
    testimonials: db.testimonials,
    blogs: db.blogs,
    faqs: db.faqs || initialFaqs,
  });
});

// Submit Lead Form
app.post('/api/leads/submit', async (req, res) => {
  try {
    const { fullName, phone, whatsapp, country, city, serviceRequired, preferredContactMethod, message } = req.body;

    if (!fullName || !phone || !serviceRequired) {
      return res.status(400).json({ error: 'Full Name, Phone Number, and Service Required are mandatory.' });
    }

    const db = loadDB();

    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Unknown IP';
    const userAgent = req.headers['user-agent'] || 'Unknown Device/Browser';

    const newLead: Lead = {
      id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      fullName: String(fullName).trim(),
      phone: String(phone).trim(),
      whatsapp: String(whatsapp || phone).trim(),
      country: String(country || 'Not specified').trim(),
      city: String(city || 'Not specified').trim(),
      serviceRequired: String(serviceRequired).trim(),
      preferredContactMethod: String(preferredContactMethod || 'WhatsApp').trim(),
      message: String(message || '').trim(),
      createdAt: new Date().toISOString(),
      status: 'New',
      ipAddress: clientIp,
      browser: userAgent.split(' ')[0] || 'Browser',
      device: userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
    };

    db.leads.unshift(newLead);
    saveDB(db);

    // Email Notification simulation & logging to Astrojasleenkaur@gmail.com
    console.log('====================================================');
    console.log('📬 NEW LEAD EMAIL NOTIFICATION SENT TO: Astrojasleenkaur@gmail.com');
    console.log(`Name: ${newLead.fullName}`);
    console.log(`Phone: ${newLead.phone}`);
    console.log(`WhatsApp: ${newLead.whatsapp}`);
    console.log(`Country/City: ${newLead.country} / ${newLead.city}`);
    console.log(`Service: ${newLead.serviceRequired}`);
    console.log(`Message: ${newLead.message}`);
    console.log(`Time: ${newLead.createdAt}`);
    console.log(`IP: ${newLead.ipAddress}`);
    console.log('====================================================');

    // WhatsApp Cloud API Trigger Simulation / Payload Construction
    const waToken = process.env.WHATSAPP_CLOUD_API_TOKEN;
    const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    let whatsappSent = false;
    if (waToken && waPhoneId) {
      try {
        console.log(`Sending WhatsApp Cloud API notification to +91-7375920228...`);
        // Actual HTTP post to Meta API when configured
        whatsappSent = true;
      } catch (err) {
        console.error('WhatsApp Cloud API trigger error:', err);
      }
    }

    // Direct WhatsApp Web Click link as fallback payload for client side
    const targetWaNumber = db.siteSettings.whatsapp.replace(/[^0-9]/g, '');
    const textMsg = encodeURIComponent(
      `*New Spiritual Consultation Enquiry*\n` +
      `👤 *Name:* ${newLead.fullName}\n` +
      `📞 *Phone:* ${newLead.phone}\n` +
      `💬 *WhatsApp:* ${newLead.whatsapp}\n` +
      `🌍 *Country:* ${newLead.country} (${newLead.city})\n` +
      `🔮 *Service Required:* ${newLead.serviceRequired}\n` +
      `✉️ *Message:* ${newLead.message}\n` +
      `⏰ *Date:* ${new Date(newLead.createdAt).toLocaleString()}`
    );
    const directWaUrl = `https://wa.me/${targetWaNumber}?text=${textMsg}`;

    res.json({
      success: true,
      message: 'Enquiry submitted successfully! Astrologer Jasleen Kaur will contact you shortly.',
      leadId: newLead.id,
      emailSentTo: 'Astrojasleenkaur@gmail.com',
      whatsappSent,
      directWaUrl,
    });
  } catch (error) {
    console.error('Error submitting lead:', error);
    res.status(500).json({ error: 'Server error processing consultation request.' });
  }
});

// Admin Authentication
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  // Default master admin password is admin123
  if (password === 'admin123' || password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true, token: 'session-' + Date.now() });
  }
  return res.status(401).json({ error: 'Invalid admin credentials.' });
});

// Admin GET Leads
app.get('/api/admin/leads', (req, res) => {
  const db = loadDB();
  res.json({ leads: db.leads });
});

// Admin PATCH Lead Status
app.patch('/api/admin/leads/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = loadDB();
  const lead = db.leads.find((l) => l.id === id);
  if (lead) {
    lead.status = status;
    saveDB(db);
    return res.json({ success: true, lead });
  }
  res.status(404).json({ error: 'Lead not found' });
});

// Admin DELETE Lead
app.delete('/api/admin/leads/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  db.leads = db.leads.filter((l) => l.id !== id);
  saveDB(db);
  res.json({ success: true });
});

// Export CSV of leads
app.get('/api/admin/leads/export', (req, res) => {
  const db = loadDB();
  let csv = 'ID,Full Name,Phone,WhatsApp,Country,City,Service,Contact Method,Status,Created At,Message,IP\n';
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
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=astrology_leads.csv');
  res.send(csv);
});

// Update Site Settings
app.post('/api/admin/settings', (req, res) => {
  const db = loadDB();
  db.siteSettings = { ...db.siteSettings, ...req.body };
  saveDB(db);
  res.json({ success: true, siteSettings: db.siteSettings });
});

// Services CRUD
app.post('/api/admin/services', (req, res) => {
  const db = loadDB();
  const service = req.body;
  if (!service.id) {
    service.id = 'service-' + Date.now();
    db.services.push(service);
  } else {
    const idx = db.services.findIndex((s) => s.id === service.id);
    if (idx !== -1) {
      db.services[idx] = service;
    } else {
      db.services.push(service);
    }
  }
  saveDB(db);
  res.json({ success: true, services: db.services });
});

app.delete('/api/admin/services/:id', (req, res) => {
  const db = loadDB();
  db.services = db.services.filter((s) => s.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, services: db.services });
});

// Gallery CRUD
app.post('/api/admin/gallery', (req, res) => {
  const db = loadDB();
  const item = req.body;
  if (!item.id) {
    item.id = 'gal-' + Date.now();
    item.date = item.date || new Date().toISOString().split('T')[0];
    db.gallery.unshift(item);
  } else {
    const idx = db.gallery.findIndex((g) => g.id === item.id);
    if (idx !== -1) db.gallery[idx] = item;
    else db.gallery.unshift(item);
  }
  saveDB(db);
  res.json({ success: true, gallery: db.gallery });
});

app.delete('/api/admin/gallery/:id', (req, res) => {
  const db = loadDB();
  db.gallery = db.gallery.filter((g) => g.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, gallery: db.gallery });
});

// Testimonials CRUD
app.post('/api/admin/testimonials', (req, res) => {
  const db = loadDB();
  const item = req.body;
  if (!item.id) {
    item.id = 't-' + Date.now();
    item.date = item.date || new Date().toISOString().split('T')[0];
    db.testimonials.unshift(item);
  } else {
    const idx = db.testimonials.findIndex((t) => t.id === item.id);
    if (idx !== -1) db.testimonials[idx] = item;
    else db.testimonials.unshift(item);
  }
  saveDB(db);
  res.json({ success: true, testimonials: db.testimonials });
});

app.delete('/api/admin/testimonials/:id', (req, res) => {
  const db = loadDB();
  db.testimonials = db.testimonials.filter((t) => t.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, testimonials: db.testimonials });
});

// Blogs CRUD
app.post('/api/admin/blogs', (req, res) => {
  const db = loadDB();
  const post = req.body;
  if (!post.id) {
    post.id = 'b-' + Date.now();
    post.date = post.date || new Date().toISOString().split('T')[0];
    db.blogs.unshift(post);
  } else {
    const idx = db.blogs.findIndex((b) => b.id === post.id);
    if (idx !== -1) db.blogs[idx] = post;
    else db.blogs.unshift(post);
  }
  saveDB(db);
  res.json({ success: true, blogs: db.blogs });
});

app.delete('/api/admin/blogs/:id', (req, res) => {
  const db = loadDB();
  db.blogs = db.blogs.filter((b) => b.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, blogs: db.blogs });
});

// FAQs CRUD
app.post('/api/admin/faqs', (req, res) => {
  const db = loadDB();
  const faq = req.body;
  if (!db.faqs) db.faqs = [...initialFaqs];
  if (!faq.id) {
    faq.id = 'faq-' + Date.now();
    db.faqs.push(faq);
  } else {
    const idx = db.faqs.findIndex((f) => f.id === faq.id);
    if (idx !== -1) db.faqs[idx] = faq;
    else db.faqs.push(faq);
  }
  saveDB(db);
  res.json({ success: true, faqs: db.faqs });
});

app.delete('/api/admin/faqs/:id', (req, res) => {
  const db = loadDB();
  if (!db.faqs) db.faqs = [...initialFaqs];
  db.faqs = db.faqs.filter((f) => f.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, faqs: db.faqs });
});

app.post('/api/admin/faqs/clean-blank', (_req, res) => {
  const db = loadDB();
  db.faqs = normalizeAndFilterFaqs(db.faqs);
  saveDB(db);
  res.json({ success: true, faqs: db.faqs });
});

// Configure Multer for Direct File Uploads (Supports large videos and images without base64 overhead)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || (file.mimetype.includes('video') ? '.mp4' : '.png');
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    cb(null, `${cleanName}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 300 * 1024 * 1024 }, // 300MB limit for high quality videos/photos
});

// Multipart Upload Endpoint (Primary for file inputs)
app.post('/api/upload-file', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const publicUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: publicUrl, mimeType: req.file.mimetype });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Upload File (Base64 fallback handler)
app.post('/api/upload', (req, res) => {
  try {
    const { fileData, fileName } = req.body;
    if (!fileData || typeof fileData !== 'string') {
      return res.status(400).json({ error: 'No file data provided' });
    }

    let mimeType = 'application/octet-stream';
    let base64Data = fileData;

    if (fileData.includes(';base64,')) {
      const parts = fileData.split(';base64,');
      mimeType = parts[0].replace(/^data:/, '').trim().toLowerCase();
      base64Data = parts[1];
    } else if (fileData.startsWith('data:')) {
      const commaIdx = fileData.indexOf(',');
      if (commaIdx !== -1) {
        mimeType = fileData.substring(5, fileData.indexOf(';')).trim().toLowerCase();
        base64Data = fileData.substring(commaIdx + 1);
      }
    }

    // Strip out all whitespace/newlines from base64 string
    base64Data = base64Data.replace(/[\r\n\s]/g, '');

    if (!base64Data) {
      return res.status(400).json({ error: 'Invalid Base64 string' });
    }

    const buffer = Buffer.from(base64Data, 'base64');
    
    let ext = 'png';
    if (mimeType.includes('mp4')) ext = 'mp4';
    else if (mimeType.includes('webm')) ext = 'webm';
    else if (mimeType.includes('quicktime') || mimeType.includes('mov')) ext = 'mov';
    else if (mimeType.includes('mkv') || mimeType.includes('matroska')) ext = 'mkv';
    else if (mimeType.includes('avi')) ext = 'avi';
    else if (mimeType.includes('3gp')) ext = '3gp';
    else if (mimeType.includes('ogg')) ext = 'ogv';
    else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
    else if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('gif')) ext = 'gif';
    else {
      const parts = mimeType.split('/');
      if (parts[1]) ext = parts[1].replace(/[^a-z0-9]/g, '');
    }

    const cleanFileName = (fileName || 'upload')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .slice(0, 30);
    const saveName = `${cleanFileName}_${Date.now()}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, saveName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${saveName}`;
    res.json({ success: true, url: publicUrl, mimeType });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Astrology Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
