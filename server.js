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

// 3. Proxy transparente para API CRM NPI (/api/npi/* -> Puerto 8085 o fallback)
app.use('/api/npi', (req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: 8085,
    path: '/api/npi' + req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: '127.0.0.1:8085'
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    res.status(503).json({
      error: 'Servicio NPI no disponible localmente',
      details: err.message
    });
  });

  req.pipe(proxyReq, { end: true });
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

// 5. Redirección y soporte para URL /crm-npi y /crm-npi.html
app.get('/crm-npi', (req, res) => {
  res.redirect(301, '/admin');
});
app.get('/crm-npi.html', (req, res) => {
  res.sendFile(path.join(SITIO_DIR, 'crm-npi.html'));
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
