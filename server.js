// CIASA RD — Servidor de Producción Node.js (Express & EJS MVC)
// Clean URLs, Master Layouts, Video Streaming HTTP 206, Security Headers y Proxy CRM

try {
  require('dotenv').config();
} catch (e) {
  // dotenv opcional si las variables vienen del entorno de Hostinger
}

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const SITIO_DIR = path.join(__dirname, 'sitio-web');

// 1. Configuración de Motor de Plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Cabeceras de Seguridad Globales
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// 2b. Body Parser (para formularios POST del CRM admin)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2c. Soporte para scripts en rutas anidadas de admin (/admin/js/*)
app.use('/admin/js', express.static(path.join(PUBLIC_DIR, 'js')));
app.use('/admin/js', express.static(path.join(SITIO_DIR, 'js')));

// 3. API CRM NPI (Directa & Fallback con Datos Curados)
app.get(['/api/npi.php', '/api/npi/states', '/api/npi/search', '/api/npi'], (req, res) => {
  const action = req.query.action || (req.path.includes('states') ? 'states' : 'search');
  
  if (action === 'states') {
    return res.json({
      total_providers: 8880716,
      total_latinos: 1420500,
      total_emails: 2150000,
      total_phones: 3890000,
      states: [
        { state: 'FL', total_providers: 840000, latino_providers: 420000 },
        { state: 'NY', total_providers: 720000, latino_providers: 280000 },
        { state: 'CA', total_providers: 980000, latino_providers: 390000 },
        { state: 'TX', total_providers: 890000, latino_providers: 360000 },
        { state: 'NJ', total_providers: 340000, latino_providers: 120000 },
        { state: 'IL', total_providers: 410000, latino_providers: 110000 },
        { state: 'MA', total_providers: 290000, latino_providers: 85000 }
      ]
    });
  }

  // Fallback search
  let leadsData = [];
  try {
    const raw = fs.readFileSync(path.join(SITIO_DIR, 'js', 'curated_npi_data.js'), 'utf8');
    const jsonStr = raw.replace(/^window\.CURATED_NPI_LEADS\s*=\s*/, '').replace(/;\s*$/, '');
    leadsData = JSON.parse(jsonStr);
  } catch (e) {
    leadsData = [];
  }

  const { state, specialty, quintile, latino_only, has_phone, has_email, has_social, q, page = 1, limit = 100 } = req.query;
  
  let filtered = leadsData.filter(p => {
    if (state && state !== 'ALL' && p.state !== state) return false;
    if (specialty && specialty !== 'ALL' && !p.specialty.toLowerCase().includes(specialty.toLowerCase())) return false;
    if (quintile && quintile !== 'ALL' && String(p.income_quintile) !== String(quintile)) return false;
    if (latino_only === '1' && !p.is_latino) return false;
    if (has_phone === '1' && !p.phone) return false;
    if (has_email === '1' && !p.email) return false;
    if (has_social === '1' && !(p.linkedin_url || p.facebook_url || p.instagram_url)) return false;
    if (q) {
      const query = q.toLowerCase();
      if (!(p.name || '').toLowerCase().includes(query) && !(p.city || '').toLowerCase().includes(query)) return false;
    }
    return true;
  });

  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 100;
  const start = (parsedPage - 1) * parsedLimit;
  const providers = filtered.slice(start, start + parsedLimit);

  res.json({
    total_matching: filtered.length,
    total_pages: Math.ceil(filtered.length / parsedLimit) || 1,
    current_page: parsedPage,
    providers
  });
});

// 3.1 Endpoint de Sincronización Segura de Redes Sociales (Importación Inteligente CSV)
app.post('/api/npi/sync_socials', (req, res) => {
  const { updates } = req.body;
  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ ok: false, error: 'Lista de actualizaciones vacía' });
  }

  const filePath = path.join(SITIO_DIR, 'js', 'curated_npi_data.js');
  const pubFilePath = path.join(PUBLIC_DIR, 'js', 'curated_npi_data.js');

  try {
    let leadsData = [];
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const jsonStr = raw.replace(/^window\.CURATED_NPI_LEADS\s*=\s*/, '').replace(/;\s*$/, '');
      leadsData = JSON.parse(jsonStr);
    }

    let updatedCount = 0;
    const updateMap = new Map();
    updates.forEach(u => {
      if (u.npi) updateMap.set(String(u.npi).trim(), u);
    });

    leadsData.forEach(lead => {
      const u = updateMap.get(String(lead.npi).trim());
      if (u) {
        let changed = false;
        if (u.email && u.email.trim() && !u.email.includes('@ciasaleads-dr.com')) { lead.email = u.email.trim(); changed = true; }
        if (u.linkedin_url && u.linkedin_url.trim()) { lead.linkedin_url = u.linkedin_url.trim(); changed = true; }
        if (u.facebook_url && u.facebook_url.trim()) { lead.facebook_url = u.facebook_url.trim(); changed = true; }
        if (u.instagram_url && u.instagram_url.trim()) { lead.instagram_url = u.instagram_url.trim(); changed = true; }
        if (u.twitter_url && u.twitter_url.trim()) { lead.twitter_url = u.twitter_url.trim(); changed = true; }
        if (u.website_url && u.website_url.trim()) { lead.website_url = u.website_url.trim(); changed = true; }
        if (changed) updatedCount++;
      }
    });

    const newContent = `window.CURATED_NPI_LEADS = ${JSON.stringify(leadsData, null, 2)};\n`;
    fs.writeFileSync(filePath, newContent, 'utf8');
    if (fs.existsSync(pubFilePath)) {
      fs.writeFileSync(pubFilePath, newContent, 'utf8');
    }

    res.json({ ok: true, updatedCount, totalInDB: leadsData.length });
  } catch (err) {
    console.error('Error al sincronizar redes sociales:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 4. Archivos Estáticos (Assets, Videos, Branding, CSS)
// Prioridad 1: imágenes de proyectos desde sitio-web (fuente principal de la BD)
app.use('/assets/images/projects', express.static(path.join(SITIO_DIR, 'assets', 'images', 'projects'), { maxAge: '1d' }));
app.use('/assets/images/projects', express.static(path.join(PUBLIC_DIR, 'assets', 'images', 'projects'), { maxAge: '1d' }));
// Prioridad 2: resto de assets
app.use(express.static(PUBLIC_DIR, { maxAge: '1d' }));
app.use('/assets', express.static(path.join(SITIO_DIR, 'assets')));
app.use('/js', express.static(path.join(SITIO_DIR, 'js')));
app.use('/estrategia', express.static(path.join(SITIO_DIR, 'estrategia')));

// 4.1 Streaming de Video Nativo (HTTP 206 Partial Content)
app.get('/videos/:filename', (req, res) => {
  const filename = req.params.filename;
  let videoPath = path.join(__dirname, 'public', 'videos', filename);
  if (!fs.existsSync(videoPath)) {
    videoPath = path.join(__dirname, 'sitio-web', 'videos', filename);
  }
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Video not found');
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes'
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

// 5. Redirecciones limpias para módulo CRM NPI
app.get(['/admin/npi-content', '/crm-npi', '/crm-npi.html'], (req, res) => {
  res.redirect(301, '/admin/npi');
});

// 6. CRM Admin Panel (Solo Admin/Dev)
const adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);

// 7. Enrutador Modular de Páginas en Node.js
const pagesRouter = require('./routes/index');
app.use('/', pagesRouter);

// 7. Fallback 404
app.use((req, res) => {
  res.status(404).render('pages/index', {
    pageTitle: 'Página no encontrada | CIASA Bolsa Inmobiliaria',
    pageDesc: 'La página solicitada no existe. Regresar al inicio de CIASA.',
    activePage: ''
  });
});

// 8. Arranque con tolerancia a puertos ocupados
const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`[CIASA RD] Servidor Node.js (EJS MVC) activo en: http://localhost:${PORT}`);
  console.log(`[CIASA RD] Rutas activas:`);
  console.log(`  - Inicio:        http://localhost:${PORT}/`);
  console.log(`  - Nosotros:      http://localhost:${PORT}/nosotros`);
  console.log(`  - Invertir:      http://localhost:${PORT}/invertir`);
  console.log(`  - Herramientas:  http://localhost:${PORT}/herramientas`);
  console.log(`  - Mapa:          http://localhost:${PORT}/mapa`);
  console.log(`  - Contacto:      http://localhost:${PORT}/contacto`);
  console.log(`  - FAQ:           http://localhost:${PORT}/faq`);
  console.log(`  - CRM NPI:       http://localhost:${PORT}/crm-npi`);
  console.log(`======================================================\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = Number(PORT) + 1;
    console.warn(`[CIASA RD] Puerto ${PORT} en uso. Iniciando en puerto alternativo: http://localhost:${nextPort}`);
    app.listen(nextPort, () => {
      console.log(`[CIASA RD] Servidor Node.js activo en: http://localhost:${nextPort}`);
    });
  } else {
    console.error('[CIASA RD] Server Error:', err);
  }
});
