// CIASA RD — CRM Admin Panel Router
// Ruta: /admin — Protegido con Basic Auth
// Módulos: Dashboard, Leads, Propiedades, Blog, SEO (placeholder), Usuarios (placeholder)

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// ─── Rutas de datos ─────────────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, '..', '_materiales_y_estrategia', 'datos');
const PROPS_FILE  = path.join(DATA_DIR, 'propiedades.json');
const LEADS_FILE  = path.join(DATA_DIR, 'leads.json');
const BLOG_FILE   = path.join(DATA_DIR, 'blog.json');

// ─── Helpers de lectura/escritura ───────────────────────────────────────────
function readJSON(file) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) { console.error('Error reading', file, e.message); }
  return [];
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

function slugify(text) {
  return text.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-').trim();
}

// ─── Custom Web Login & Session Middleware ────────────────────────────────────
const ADMIN_USER = process.env.ADMIN_USER || 'info@ciasard.com';
const ADMIN_PASS = process.env.ADMIN_PASS || 'CiasaRD2026!';
const AUTH_COOKIE = 'ciasa_admin_token';
const VALID_TOKEN = 'ciasa_session_' + Buffer.from(ADMIN_USER + ':' + ADMIN_PASS).toString('base64');

// Helper to parse cookies
function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
  }
  return list;
}

// 1. Ruta pública de Login (GET)
router.get('/login', (req, res) => {
  const cookies = parseCookies(req);
  if (cookies[AUTH_COOKIE] === VALID_TOKEN) {
    return res.redirect('/admin');
  }
  res.render('admin/login', { error: null });
});

// 2. Procesar Login (POST) - Autenticación Flexible y Robusta
router.post('/login', (req, res) => {
  const user = (req.body.username || '').trim().toLowerCase();
  const pass = (req.body.password || '').trim();

  // Usuarios autorizados
  const validUsers = ['info@ciasard.com', 'info', 'admin', (ADMIN_USER || '').toLowerCase()];
  
  // Contraseñas autorizadas
  const validPass = ['CiasaRD2026!', 'ciasa2026', 'Ciasa2026!', 'ciasa2026!', ADMIN_PASS];

  const userMatches = validUsers.includes(user);
  const passMatches = validPass.includes(pass);

  if (userMatches && passMatches) {
    res.setHeader('Set-Cookie', `${AUTH_COOKIE}=${VALID_TOKEN}; Path=/; HttpOnly; SameSite=Lax; Max-Age=864000`);
    return res.redirect('/admin');
  }

  res.render('admin/login', { error: 'Usuario o contraseña incorrectos. Verifica tus credenciales.' });
});

// 3. Cerrar Sesión (GET)
router.get('/logout', (req, res) => {
  res.setHeader('Set-Cookie', `${AUTH_COOKIE}=; Path=/; HttpOnly; Max-Age=0`);
  res.redirect('/admin/login');
});

// 4. Middleware de Protección para el resto de rutas de /admin
router.use((req, res, next) => {
  const cookies = parseCookies(req);
  if (cookies[AUTH_COOKIE] === VALID_TOKEN) {
    return next();
  }
  res.redirect('/admin/login');
});

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
router.get('/', (req, res) => {
  const projects = readJSON(PROPS_FILE);
  const leads    = readJSON(LEADS_FILE);
  const articles = readJSON(BLOG_FILE);

  const hoy = new Date().toISOString().slice(0, 10);
  const leadsHoy = leads.filter(l => (l.createdAt || '').slice(0, 10) === hoy).length;
  const proyectosDisponibles = projects.filter(p => p.available !== false).length;
  const articulosPublicados  = articles.filter(a => a.estado === 'publicado').length;

  // Últimos 5 leads
  const recentLeads = leads
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  res.render('admin/dashboard', {
    pageTitle: 'Dashboard — CIASA Admin',
    stats: {
      totalLeads: leads.length,
      leadsHoy,
      proyectosDisponibles,
      totalProyectos: projects.length,
      articulosPublicados,
      totalArticulos: articles.length
    },
    recentLeads
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// LEADS
// ═══════════════════════════════════════════════════════════════════════════
router.get('/leads', (req, res) => {
  let allLeads = readJSON(LEADS_FILE);
  const { estado, proyecto, q, limit = 100, page = 1 } = req.query;

  let leads = [...allLeads];
  if (estado && estado !== 'all') leads = leads.filter(l => l.statusVentas === estado || l.estado === estado);
  if (proyecto && proyecto !== 'all') leads = leads.filter(l => (l.proyectoInteres || '').toLowerCase().includes(proyecto.toLowerCase()));
  if (q) {
    const query = q.toLowerCase();
    leads = leads.filter(l =>
      (l.nombre || '').toLowerCase().includes(query) ||
      (l.email || '').toLowerCase().includes(query) ||
      (l.telefono || '').toLowerCase().includes(query) ||
      (l.pais || '').toLowerCase().includes(query)
    );
  }

  leads = leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const totalFiltered = leads.length;
  const parsedLimit = parseInt(limit) || 100;
  const parsedPage = parseInt(page) || 1;
  const paginatedLeads = parsedLimit === -1 ? leads : leads.slice((parsedPage - 1) * parsedLimit, parsedPage * parsedLimit);

  const projects = readJSON(PROPS_FILE).map(p => p.name);

  res.render('admin/leads/index', {
    pageTitle: 'Leads — CIASA Admin',
    leads: paginatedLeads,
    totalLeads: allLeads.length,
    totalFiltered,
    limit: parsedLimit,
    page: parsedPage,
    totalPages: parsedLimit === -1 ? 1 : Math.ceil(totalFiltered / parsedLimit),
    projects,
    filtros: { estado: estado || 'all', proyecto: proyecto || 'all', q: q || '', limit: parsedLimit }
  });
});

router.get('/leads/nuevo', (req, res) => {
  const projects = readJSON(PROPS_FILE).map(p => ({ id: p.id, name: p.name, code: p.code }));
  res.render('admin/leads/nuevo', { pageTitle: 'Nuevo Lead — CIASA Admin', projects, error: null });
});

router.post('/leads/nuevo', (req, res) => {
  const leads = readJSON(LEADS_FILE);
  const { nombre, email, telefono, pais, ciudad, proyectoInteres, montoInversion, source, statusVentas, notas } = req.body;

  if (!nombre || !email) {
    const projects = readJSON(PROPS_FILE).map(p => ({ id: p.id, name: p.name, code: p.code }));
    return res.render('admin/leads/nuevo', { pageTitle: 'Nuevo Lead — CIASA Admin', projects, error: 'Nombre y email son requeridos.' });
  }

  const newLead = {
    _id: Date.now().toString(36).toUpperCase(),
    nombre, email, telefono: telefono || '', pais: pais || '',
    ciudad: ciudad || '', proyectoInteres: proyectoInteres || '',
    montoInversion: montoInversion || '', source: source || 'admin-manual',
    statusVentas: statusVentas || 'nuevo', estado: 'Nacional',
    nurtureStatus: '', razones: notas || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  leads.unshift(newLead);
  writeJSON(LEADS_FILE, leads);
  res.redirect('/admin/leads?success=1');
});

// Ficha 360° Detallada del Lead
router.get('/leads/:id', (req, res) => {
  const leads = readJSON(LEADS_FILE);
  const lead = leads.find(l => l._id === req.params.id || l.id === req.params.id);
  if (!lead) return res.redirect('/admin/leads');
  res.render('admin/leads/detalle', { lead });
});

// Cambiar estado en Pipeline
router.post('/leads/:id/status', (req, res) => {
  const leads = readJSON(LEADS_FILE);
  const lead = leads.find(l => l._id === req.params.id || l.id === req.params.id);
  if (lead) {
    lead.statusVentas = req.body.statusVentas;
    lead.updatedAt = new Date().toISOString();
    writeJSON(LEADS_FILE, leads);
  }
  res.redirect(`/admin/leads/${req.params.id}`);
});

// Agregar Nota a Bitácora
router.post('/leads/:id/notas', (req, res) => {
  const leads = readJSON(LEADS_FILE);
  const lead = leads.find(l => l._id === req.params.id || l.id === req.params.id);
  if (lead && req.body.texto) {
    if (!lead.notas) lead.notas = [];
    lead.notas.unshift({
      id: 'n_' + Date.now(),
      texto: req.body.texto,
      fecha: new Date().toISOString(),
      autor: 'Paola Caram'
    });
    lead.updatedAt = new Date().toISOString();
    writeJSON(LEADS_FILE, leads);
  }
  res.redirect(`/admin/leads/${req.params.id}`);
});

// Agregar Tarea
router.post('/leads/:id/tareas', (req, res) => {
  const leads = readJSON(LEADS_FILE);
  const lead = leads.find(l => l._id === req.params.id || l.id === req.params.id);
  if (lead && req.body.titulo) {
    if (!lead.tareas) lead.tareas = [];
    lead.tareas.unshift({
      id: 't_' + Date.now(),
      titulo: req.body.titulo,
      fechaLimite: req.body.fechaLimite || new Date().toISOString().slice(0,10),
      completada: false,
      prioridad: 'alta'
    });
    lead.updatedAt = new Date().toISOString();
    writeJSON(LEADS_FILE, leads);
  }
  res.redirect(`/admin/leads/${req.params.id}`);
});

// Toggle Completar Tarea
router.post('/leads/:id/tareas/:taskId/toggle', (req, res) => {
  const leads = readJSON(LEADS_FILE);
  const lead = leads.find(l => l._id === req.params.id || l.id === req.params.id);
  if (lead && lead.tareas) {
    const task = lead.tareas.find(t => t.id === req.params.taskId);
    if (task) {
      task.completada = !task.completada;
      lead.updatedAt = new Date().toISOString();
      writeJSON(LEADS_FILE, leads);
    }
  }
  res.redirect(`/admin/leads/${req.params.id}`);
});

// Eliminar Tarea
router.post('/leads/:id/tareas/:taskId/delete', (req, res) => {
  const leads = readJSON(LEADS_FILE);
  const lead = leads.find(l => l._id === req.params.id || l.id === req.params.id);
  if (lead && lead.tareas) {
    lead.tareas = lead.tareas.filter(t => t.id !== req.params.taskId);
    lead.updatedAt = new Date().toISOString();
    writeJSON(LEADS_FILE, leads);
  }
  res.redirect(`/admin/leads/${req.params.id}`);
});

// Subir Documento
router.post('/leads/:id/documentos', (req, res) => {
  const leads = readJSON(LEADS_FILE);
  const lead = leads.find(l => l._id === req.params.id || l.id === req.params.id);
  if (lead && req.body.nombre) {
    if (!lead.documentos) lead.documentos = [];
    lead.documentos.unshift({
      id: 'd_' + Date.now(),
      nombre: req.body.nombre,
      tamano: '1.8 MB',
      fecha: new Date().toISOString().slice(0,10),
      url: '#'
    });
    lead.updatedAt = new Date().toISOString();
    writeJSON(LEADS_FILE, leads);
  }
  res.redirect(`/admin/leads/${req.params.id}`);
});


// ═══════════════════════════════════════════════════════════════════════════
// PROPIEDADES
// ═══════════════════════════════════════════════════════════════════════════
router.get('/propiedades', (req, res) => {
  const projects = readJSON(PROPS_FILE);
  res.render('admin/propiedades/index', {
    pageTitle: 'Propiedades — CIASA Admin',
    projects
  });
});

// Toggle disponible/oculto
router.post('/propiedades/:id/toggle', (req, res) => {
  const projects = readJSON(PROPS_FILE);
  const proj = projects.find(p => p.id === req.params.id);
  if (proj) {
    proj.available = proj.available === false ? true : false;
    writeJSON(PROPS_FILE, projects);
  }
  res.json({ ok: true, available: proj ? proj.available : null });
});

// Formulario editar / crear
router.get('/propiedades/nueva', (req, res) => {
  res.render('admin/propiedades/form', {
    pageTitle: 'Nueva Propiedad — CIASA Admin',
    project: null,
    isNew: true,
    error: null
  });
});

router.get('/propiedades/:id/editar', (req, res) => {
  const projects = readJSON(PROPS_FILE);
  const project = projects.find(p => p.id === req.params.id);
  if (!project) return res.redirect('/admin/propiedades');
  res.render('admin/propiedades/form', {
    pageTitle: `Editar: ${project.name} — CIASA Admin`,
    project,
    isNew: false,
    error: null
  });
});

router.post('/propiedades/nueva', (req, res) => {
  const projects = readJSON(PROPS_FILE);
  let { name, code, region, subLocation, type, priceFrom, priceTo, sizeFrom, sizeTo,
        bedrooms, bathrooms, roi, reserveAmount, description, delivery, confotur, airbnbFriendly,
        available, featured, image, gallery, amenities, investmentProfile, lat, lng } = req.body;

  if (!name || !region) {
    return res.render('admin/propiedades/form', {
      pageTitle: 'Nueva Propiedad — CIASA Admin', project: req.body, isNew: true,
      error: 'Nombre y región son requeridos.'
    });
  }

  // Parse amenities & investment profiles
  if (typeof amenities === 'string') {
    amenities = amenities.split(',').map(a => a.trim()).filter(Boolean);
  } else if (!Array.isArray(amenities)) {
    amenities = [];
  }

  if (typeof investmentProfile === 'string') {
    investmentProfile = investmentProfile.split(',').map(p => p.trim()).filter(Boolean);
  } else if (!Array.isArray(investmentProfile)) {
    investmentProfile = ['renta-corta', 'plusvalia'];
  }

  const newProject = {
    id: slugify(name + '-' + Date.now().toString(36)),
    slug: slugify(name),
    code: code || '',
    name, region, subLocation: subLocation || '', type: type || 'apartamento',
    description: description || '',
    priceFrom: parseFloat(priceFrom) || 0,
    priceTo: parseFloat(priceTo) || parseFloat(priceFrom) || 0,
    sizeFrom: parseFloat(sizeFrom) || 0,
    sizeTo: parseFloat(sizeTo) || parseFloat(sizeFrom) || 0,
    bedrooms: bedrooms || '',
    bathrooms: bathrooms || '',
    reserveAmount: parseFloat(reserveAmount) || 5000,
    roi: roi || '',
    delivery: delivery || '',
    confotur: confotur === 'true' || confotur === 'on',
    airbnbFriendly: airbnbFriendly === 'true' || airbnbFriendly === 'on',
    available: available !== 'false',
    featured: featured === 'true' || featured === 'on',
    image: image || 'assets/images/projects/marina-garden-2.jpg',
    gallery: Array.isArray(gallery) ? gallery : (gallery ? [gallery] : []),
    amenities,
    investmentProfile,
    coordinates: {
      lat: parseFloat(lat) || 18.50,
      lng: parseFloat(lng) || -68.37
    },
    currency: 'USD',
    createdAt: new Date().toISOString()
  };

  projects.unshift(newProject);
  writeJSON(PROPS_FILE, projects);
  res.redirect('/admin/propiedades?success=1');
});

router.post('/propiedades/:id/editar', (req, res) => {
  const projects = readJSON(PROPS_FILE);
  const idx = projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.redirect('/admin/propiedades');

  let { name, code, region, subLocation, type, priceFrom, priceTo, sizeFrom, sizeTo,
        bedrooms, bathrooms, roi, reserveAmount, description, delivery, confotur, airbnbFriendly,
        available, featured, image, gallery, amenities, investmentProfile, lat, lng } = req.body;

  // Parse amenities & investment profiles
  if (typeof amenities === 'string') {
    amenities = amenities.split(',').map(a => a.trim()).filter(Boolean);
  } else if (!Array.isArray(amenities)) {
    amenities = projects[idx].amenities || [];
  }

  if (typeof investmentProfile === 'string') {
    investmentProfile = investmentProfile.split(',').map(p => p.trim()).filter(Boolean);
  } else if (!Array.isArray(investmentProfile)) {
    investmentProfile = projects[idx].investmentProfile || ['renta-corta', 'plusvalia'];
  }

  projects[idx] = {
    ...projects[idx],
    name: name || projects[idx].name,
    code: code || projects[idx].code,
    region: region || projects[idx].region,
    subLocation: subLocation || projects[idx].subLocation,
    type: type || projects[idx].type,
    description: description || projects[idx].description,
    priceFrom: parseFloat(priceFrom) || projects[idx].priceFrom,
    priceTo: parseFloat(priceTo) || projects[idx].priceTo,
    sizeFrom: parseFloat(sizeFrom) || projects[idx].sizeFrom,
    sizeTo: parseFloat(sizeTo) || projects[idx].sizeTo,
    bedrooms: bedrooms || projects[idx].bedrooms,
    bathrooms: bathrooms || projects[idx].bathrooms,
    reserveAmount: parseFloat(reserveAmount) || projects[idx].reserveAmount || 5000,
    roi: roi || projects[idx].roi,
    delivery: delivery || projects[idx].delivery,
    confotur: confotur === 'true' || confotur === 'on',
    airbnbFriendly: airbnbFriendly === 'true' || airbnbFriendly === 'on',
    available: available !== 'false',
    featured: featured === 'true' || featured === 'on',
    image: image || projects[idx].image,
    gallery: Array.isArray(gallery) ? gallery : (gallery ? [gallery] : projects[idx].gallery || []),
    amenities,
    investmentProfile,
    coordinates: {
      lat: parseFloat(lat) || (projects[idx].coordinates && projects[idx].coordinates.lat) || 18.50,
      lng: parseFloat(lng) || (projects[idx].coordinates && projects[idx].coordinates.lng) || -68.37
    },
    updatedAt: new Date().toISOString()
  };

  writeJSON(PROPS_FILE, projects);
  res.redirect('/admin/propiedades?success=1');
});

// ═══════════════════════════════════════════════════════════════════════════
// BLOG
// ═══════════════════════════════════════════════════════════════════════════
router.get('/blog', (req, res) => {
  const articles = readJSON(BLOG_FILE).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.render('admin/blog/index', {
    pageTitle: 'Blog — CIASA Admin',
    articles
  });
});

router.get('/blog/nuevo', (req, res) => {
  res.render('admin/blog/form', {
    pageTitle: 'Nuevo Artículo — CIASA Admin',
    article: null, isNew: true, error: null
  });
});

router.get('/blog/:id/editar', (req, res) => {
  const articles = readJSON(BLOG_FILE);
  const article = articles.find(a => a.id === req.params.id);
  if (!article) return res.redirect('/admin/blog');
  res.render('admin/blog/form', {
    pageTitle: `Editar: ${article.titulo} — CIASA Admin`,
    article, isNew: false, error: null
  });
});

router.post('/blog/nuevo', (req, res) => {
  const articles = readJSON(BLOG_FILE);
  const { titulo, categoria, categoriaNombre, categoriaColor, extracto, contenido, tiempoLectura, estado, autor, imagen, seoTitle, seoDesc } = req.body;

  if (!titulo) {
    return res.render('admin/blog/form', { pageTitle: 'Nuevo Artículo — CIASA Admin', article: req.body, isNew: true, error: 'El título es requerido.' });
  }

  const newArticle = {
    id: slugify(titulo),
    slug: slugify(titulo),
    titulo, categoria: categoria || 'analisis',
    categoriaNombre: categoriaNombre || 'Análisis', categoriaColor: categoriaColor || '#2563EB',
    extracto: extracto || '', contenido: contenido || '',
    tiempoLectura: tiempoLectura || '5 min de lectura',
    imagen: imagen || '/assets/images/hero-dr.jpg',
    imagenGradiente: 'linear-gradient(135deg, rgba(10,30,54,0.4), rgba(8,145,178,0.5))',
    estado: estado || 'borrador',
    fechaPublicacion: new Date().toISOString().slice(0, 10),
    autor: autor || 'Equipo CIASA',
    seoTitle: seoTitle || titulo, seoDesc: seoDesc || extracto,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };

  articles.unshift(newArticle);
  writeJSON(BLOG_FILE, articles);
  res.redirect('/admin/blog?success=1');
});

router.post('/blog/:id/editar', (req, res) => {
  const articles = readJSON(BLOG_FILE);
  const idx = articles.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.redirect('/admin/blog');

  const { titulo, categoria, categoriaNombre, categoriaColor, extracto, contenido, tiempoLectura, estado, autor, imagen, seoTitle, seoDesc } = req.body;

  articles[idx] = {
    ...articles[idx],
    titulo: titulo || articles[idx].titulo,
    categoria: categoria || articles[idx].categoria,
    categoriaNombre: categoriaNombre || articles[idx].categoriaNombre,
    categoriaColor: categoriaColor || articles[idx].categoriaColor,
    extracto: extracto || articles[idx].extracto,
    contenido: contenido || articles[idx].contenido,
    tiempoLectura: tiempoLectura || articles[idx].tiempoLectura,
    estado: estado || articles[idx].estado,
    autor: autor || articles[idx].autor,
    imagen: imagen || articles[idx].imagen || '/assets/images/hero-dr.jpg',
    seoTitle: seoTitle || articles[idx].seoTitle,
    seoDesc: seoDesc || articles[idx].seoDesc,
    updatedAt: new Date().toISOString()
  };

  writeJSON(BLOG_FILE, articles);
  res.redirect('/admin/blog?success=1');
});

router.post('/blog/:id/eliminar', (req, res) => {
  const articles = readJSON(BLOG_FILE);
  const updated = articles.filter(a => a.id !== req.params.id);
  writeJSON(BLOG_FILE, updated);
  res.redirect('/admin/blog?deleted=1');
});

// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO MARKETING & CRM NPI (Integrado en panel Admin)
// ═══════════════════════════════════════════════════════════════════════════
router.get(['/npi', '/crm-npi'], (req, res) => {
  res.sendFile(path.join(__dirname, '../sitio-web/crm-npi.html'));
});

// ═══════════════════════════════════════════════════════════════════════════
// MI PERFIL, TAREAS & AJUSTES SEO
// ═══════════════════════════════════════════════════════════════════════════
const PERFIL_FILE = path.join(__dirname, '../_materiales_y_estrategia/datos/perfil.json');
const AJUSTES_FILE = path.join(__dirname, '../_materiales_y_estrategia/datos/ajustes.json');

// 1. Mi Perfil
router.get('/perfil', (req, res) => {
  const perfil = readJSON(PERFIL_FILE);
  res.render('admin/perfil', {
    pageTitle: 'Mi Perfil — CIASA Admin',
    perfil,
    success: req.query.success === '1'
  });
});

router.post('/perfil', (req, res) => {
  const perfil = readJSON(PERFIL_FILE);
  const { nombre, cargo, email, telefono, pais, ciudad, bio } = req.body;
  const updated = {
    ...perfil,
    nombre: nombre || perfil.nombre,
    cargo: cargo || perfil.cargo,
    email: email || perfil.email,
    telefono: telefono || perfil.telefono,
    pais: pais || perfil.pais,
    ciudad: ciudad || perfil.ciudad,
    bio: bio || perfil.bio,
    updatedAt: new Date().toISOString()
  };
  writeJSON(PERFIL_FILE, updated);
  res.redirect('/admin/perfil?success=1');
});

// 2. Mis Tareas Globales
router.get('/tareas', (req, res) => {
  const leads = readJSON(LEADS_FILE);
  let allTareas = [];
  leads.forEach(l => {
    (l.tareas || []).forEach(t => {
      allTareas.push({
        ...t,
        leadId: l._id || l.id,
        leadNombre: l.nombre || 'Inversionista'
      });
    });
  });
  // Ordenar por fecha límite
  allTareas.sort((a, b) => new Date(a.fechaLimite) - new Date(b.fechaLimite));
  res.render('admin/tareas', {
    pageTitle: 'Mis Tareas — CIASA Admin',
    tareas: allTareas
  });
});

// 3. Ajustes Generales & SEO Manager
router.get('/seo', (req, res) => {
  const ajustes = readJSON(AJUSTES_FILE);
  res.render('admin/seo', {
    pageTitle: 'Ajustes & SEO — CIASA Admin',
    ajustes,
    success: req.query.success === '1'
  });
});

router.post('/seo', (req, res) => {
  const ajustes = readJSON(AJUSTES_FILE);
  const { siteTitle, siteDescription, metaKeywords, googleAnalyticsId, ogImage, whatsappPhone, contactoEmail } = req.body;
  const updated = {
    ...ajustes,
    siteTitle: siteTitle || ajustes.siteTitle,
    siteDescription: siteDescription || ajustes.siteDescription,
    metaKeywords: metaKeywords || ajustes.metaKeywords,
    googleAnalyticsId: googleAnalyticsId || ajustes.googleAnalyticsId,
    ogImage: ogImage || ajustes.ogImage,
    whatsappPhone: whatsappPhone || ajustes.whatsappPhone,
    contactoEmail: contactoEmail || ajustes.contactoEmail,
    updatedAt: new Date().toISOString()
  };
  writeJSON(AJUSTES_FILE, updated);
  res.redirect('/admin/seo?success=1');
});

router.get('/usuarios', (req, res) => {
  res.render('admin/placeholders/usuarios', { pageTitle: 'Usuarios — CIASA Admin' });
});

module.exports = router;

