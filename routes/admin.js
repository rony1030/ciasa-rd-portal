// CIASA RD — CRM Admin Panel Router
// Ruta: /admin — Protegido con Basic Auth
// Módulos: Dashboard, Leads, Propiedades, Blog, SEO (placeholder), Usuarios (placeholder)

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// ─── Rutas de datos ─────────────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, '..', '_materiales_y_estrategia', 'datos');
const PROPS_FILE  = path.join(DATA_DIR, 'propiedades.json');
const LEADS_FILE  = path.join(DATA_DIR, 'leads.json');
const BLOG_FILE   = path.join(DATA_DIR, 'blog.json');
const USERS_FILE  = path.join(DATA_DIR, 'usuarios.json');

// ─── Helpers de Criptografía Segura (Scrypt + Salt) ──────────────────────────
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
}

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

// ─── Custom Web Login & Session Middleware con RBAC y Criptografía ────────────
const AUTH_COOKIE = 'ciasa_user_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'ciasa_secure_secret_token_2026_rbac';

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

function signSession(userData) {
  const payload = Buffer.from(JSON.stringify(userData)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifySession(token) {
  if (!token || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  if (signature !== expectedSignature) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (data.exp && data.exp < Date.now()) return null;
    return data;
  } catch (e) {
    return null;
  }
}

// 1. Ruta pública de Login (GET)
router.get('/login', (req, res) => {
  const cookies = parseCookies(req);
  const sessionUser = verifySession(cookies[AUTH_COOKIE]);
  if (sessionUser) {
    return res.redirect('/admin');
  }
  res.render('admin/login', { error: null });
});

// 1.1 Ruta de Acceso Rápido / Bypass para Desarrollo Local (Entra como Paola Caram - Admin)
router.get(['/bypass', '/dev-login', '/autologin'], (req, res) => {
  const users = readJSON(USERS_FILE);
  const adminUser = users.find(u => u.role === 'admin' && u.activo !== false) || {
    id: 'usr_admin_paola',
    nombre: 'Paola Caram',
    username: 'paola.caram',
    email: 'paola.caram@ciasard.org.do',
    role: 'admin',
    cargo: 'Directora Ejecutiva',
    comisionPorcentaje: 100
  };

  const sessionToken = signSession({
    id: adminUser.id,
    username: adminUser.username,
    role: adminUser.role,
    nombre: adminUser.nombre,
    cargo: adminUser.cargo,
    email: adminUser.email,
    comisionPorcentaje: adminUser.comisionPorcentaje || 100,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7
  });

  res.setHeader('Set-Cookie', `${AUTH_COOKIE}=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
  res.redirect('/admin');
});

// 2. Procesar Login (POST) - Autenticación Multi-Usuario contra usuarios.json con fallback
router.post('/login', (req, res) => {
  const userIdentifier = (req.body.username || '').trim().toLowerCase();
  const passwordInput = (req.body.password || '').trim();

  const users = readJSON(USERS_FILE);
  let matchedUser = users.find(u => 
    (u.username && u.username.toLowerCase() === userIdentifier) || 
    (u.email && u.email.toLowerCase() === userIdentifier)
  );

  let authenticated = false;

  if (matchedUser) {
    if (matchedUser.activo === false) {
      return res.render('admin/login', { error: 'Esta cuenta ha sido desactivada. Contacta a la administración.' });
    }
    if (matchedUser.passwordHash && verifyPassword(passwordInput, matchedUser.passwordHash)) {
      authenticated = true;
    }
  }

  // Fallback de compatibilidad para credenciales de entorno
  if (!authenticated) {
    const adminUserEnv = (process.env.ADMIN_USER || 'info@ciasard.com').toLowerCase();
    const adminPassEnv = process.env.ADMIN_PASS || 'CiasaRD2026!';
    const validAliases = ['info@ciasard.org.do', 'paola.caram@ciasard.org.do', 'info@ciasard.com', 'admin', 'paola.caram', adminUserEnv];
    const validPasses = ['CiasaRD2026!', 'ciasa2026', 'Ciasa2026!', 'ciasa2026!', adminPassEnv];

    if (validAliases.includes(userIdentifier) && validPasses.includes(passwordInput)) {
      matchedUser = users.find(u => u.role === 'admin') || {
        id: 'usr_admin_paola',
        nombre: 'Paola Caram',
        username: 'paola.caram',
        email: 'paola.caram@ciasard.org.do',
        role: 'admin',
        cargo: 'Directora Ejecutiva',
        comisionPorcentaje: 100
      };
      authenticated = true;
    }
  }

  if (authenticated && matchedUser) {
    const sessionToken = signSession({
      id: matchedUser.id,
      username: matchedUser.username,
      role: matchedUser.role,
      nombre: matchedUser.nombre,
      cargo: matchedUser.cargo,
      email: matchedUser.email,
      comisionPorcentaje: matchedUser.comisionPorcentaje || 50,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7
    });

    res.setHeader('Set-Cookie', `${AUTH_COOKIE}=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
    return res.redirect('/admin');
  }

  res.render('admin/login', { error: 'Usuario o contraseña incorrectos. Verifica tus credenciales.' });
});

// 3. Cerrar Sesión (GET)
router.get('/logout', (req, res) => {
  res.setHeader('Set-Cookie', `${AUTH_COOKIE}=; Path=/; HttpOnly; Max-Age=0`);
  res.redirect('/admin/login');
});

// 4. Middleware de Protección para todo /admin con Inyección de Usuario
router.use((req, res, next) => {
  const cookies = parseCookies(req);
  const sessionUser = verifySession(cookies[AUTH_COOKIE]);

  if (!sessionUser) {
    return res.redirect('/admin/login');
  }

  // Refrescar datos del usuario desde usuarios.json
  const users = readJSON(USERS_FILE);
  const currentUser = users.find(u => u.id === sessionUser.id) || sessionUser;

  if (currentUser.activo === false) {
    res.setHeader('Set-Cookie', `${AUTH_COOKIE}=; Path=/; HttpOnly; Max-Age=0`);
    return res.redirect('/admin/login?error=inactive');
  }

  req.user = currentUser;
  res.locals.currentUser = currentUser;
  next();
});

// Helper de Autorización por Rol (RBAC)
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).render('admin/dashboard', {
        pageTitle: 'Acceso Denegado — CIASA Admin',
        error: 'No tienes los permisos de autorización requeridos para acceder a este módulo.',
        stats: null,
        recentLeads: []
      });
    }
    next();
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
router.get('/', (req, res) => {
  const projects = readJSON(PROPS_FILE);
  let allLeads   = readJSON(LEADS_FILE);
  const articles = readJSON(BLOG_FILE);

  // RBAC: Si el usuario es asesor comercial, filtrar exclusivamente sus leads asignados
  let visibleLeads = [...allLeads];
  if (req.user && req.user.role === 'asesor') {
    visibleLeads = visibleLeads.filter(l => 
      l.asesorId === req.user.id || 
      (l.asesorAsignado && l.asesorAsignado.toLowerCase() === req.user.nombre.toLowerCase())
    );
  }

  const hoy = new Date().toISOString().slice(0, 10);
  const leadsHoy = visibleLeads.filter(l => (l.createdAt || '').slice(0, 10) === hoy).length;
  const proyectosDisponibles = projects.filter(p => p.available !== false).length;
  const articulosPublicados  = articles.filter(a => a.estado === 'publicado').length;

  // Comisiones del usuario si es asesor o globales si es admin
  const comisionesAcumuladas = visibleLeads.reduce((acc, l) => acc + (l.comisionEstimadaUSD || 0), 0);

  // Últimos 5 leads visibles
  const recentLeads = visibleLeads
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  res.render('admin/dashboard', {
    pageTitle: 'Dashboard — CIASA Admin',
    stats: {
      totalLeads: visibleLeads.length,
      leadsHoy,
      proyectosDisponibles,
      totalProyectos: projects.length,
      articulosPublicados,
      totalArticulos: articles.length,
      comisionesAcumuladas
    },
    recentLeads
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// LEADS
// ═══════════════════════════════════════════════════════════════════════════
router.get('/leads', (req, res) => {
  let allLeads = readJSON(LEADS_FILE);
  const { estado, proyecto, q, asesorId, limit = 100, page = 1 } = req.query;

  // RBAC: Si el usuario es asesor, aislar estrictamente su cartera comercial
  if (req.user && req.user.role === 'asesor') {
    allLeads = allLeads.filter(l => 
      l.asesorId === req.user.id || 
      (l.asesorAsignado && l.asesorAsignado.toLowerCase() === req.user.nombre.toLowerCase())
    );
  } else if (asesorId) {
    allLeads = allLeads.filter(l => l.asesorId === asesorId);
  }

  let leads = [...allLeads];
  if (estado && estado !== 'all') leads = leads.filter(l => l.statusVentas === estado || l.estado === estado);
  if (proyecto && proyecto !== 'all') leads = leads.filter(l => (l.proyectoInteres || '').toLowerCase().includes(proyecto.toLowerCase()));
  if (q) {
    const query = q.toLowerCase();
    leads = leads.filter(l =>
      (l.nombre || '').toLowerCase().includes(query) ||
      (l.email || '').toLowerCase().includes(query) ||
      (l.telefono || '').toLowerCase().includes(query) ||
      (l.pais || '').toLowerCase().includes(query) ||
      (l.asesorAsignado || '').toLowerCase().includes(query)
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
    filtros: { estado: estado || 'all', proyecto: proyecto || 'all', q: q || '', limit: parsedLimit, asesorId: asesorId || '' }
  });
});

router.get('/leads/nuevo', (req, res) => {
  const projects = readJSON(PROPS_FILE).map(p => ({ id: p.id, name: p.name, code: p.code }));
  const users = readJSON(USERS_FILE);
  res.render('admin/leads/nuevo', { pageTitle: 'Nuevo Lead — CIASA Admin', projects, users, error: null });
});

router.post('/leads/nuevo', (req, res) => {
  const leads = readJSON(LEADS_FILE);
  const users = readJSON(USERS_FILE);
  const { nombre, email, telefono, pais, ciudad, proyectoInteres, montoInversion, source, statusVentas, notas, asesorId } = req.body;

  if (!nombre || !email) {
    const projects = readJSON(PROPS_FILE).map(p => ({ id: p.id, name: p.name, code: p.code }));
    return res.render('admin/leads/nuevo', { pageTitle: 'Nuevo Lead — CIASA Admin', projects, users, error: 'Nombre y email son requeridos.' });
  }

  // Determinar asesor asignado con seguridad
  let assignedUser = null;
  if (req.user && req.user.role === 'asesor') {
    assignedUser = req.user;
  } else if (asesorId) {
    assignedUser = users.find(u => u.id === asesorId);
  }
  if (!assignedUser) {
    assignedUser = users.find(u => u.role === 'admin') || req.user;
  }

  const montoNum = parseFloat(String(montoInversion || '185000').replace(/[^0-9.]/g, '')) || 185000;
  const comisionPct = assignedUser.comisionPorcentaje || 5;
  const comisionEstimada = Math.round(montoNum * (comisionPct / 100));

  const newLead = {
    _id: Date.now().toString(36).toUpperCase(),
    nombre, email, telefono: telefono || '', pais: pais || '',
    ciudad: ciudad || '', proyectoInteres: proyectoInteres || '',
    montoInversion: montoInversion || '',
    montoEstimadoUSD: montoNum,
    comisionPorcentaje: comisionPct,
    comisionEstimadaUSD: comisionEstimada,
    asesorId: assignedUser.id,
    asesorAsignado: assignedUser.nombre,
    source: source || 'admin-manual',
    statusVentas: statusVentas || 'nuevo', estado: 'Nacional',
    nurtureStatus: '', razones: notas || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  leads.unshift(newLead);
  writeJSON(LEADS_FILE, leads);
  res.redirect('/admin/leads?success=1');
});

// Ficha 360° Detallada del Lead (Protegida por RBAC)
router.get('/leads/:id', (req, res) => {
  const leads = readJSON(LEADS_FILE);
  const lead = leads.find(l => l._id === req.params.id || l.id === req.params.id);
  if (!lead) return res.redirect('/admin/leads');

  // RBAC: Si es asesor, verificar que el lead le pertenezca
  if (req.user && req.user.role === 'asesor') {
    const isOwner = lead.asesorId === req.user.id || (lead.asesorAsignado && lead.asesorAsignado.toLowerCase() === req.user.nombre.toLowerCase());
    if (!isOwner) {
      return res.status(403).render('admin/dashboard', {
        pageTitle: 'Acceso Denegado — CIASA Admin',
        error: 'No tienes autorización para consultar la ficha de un prospecto no asignado a tu cartera.',
        stats: null,
        recentLeads: []
      });
    }
  }

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

// Endpoint AJAX para Drag & Drop instantáneo en Tablero Kanban
router.post('/leads/:id/status-ajax', (req, res) => {
  const leads = readJSON(LEADS_FILE);
  const lead = leads.find(l => l._id === req.params.id || l.id === req.params.id);
  if (lead) {
    lead.statusVentas = req.body.statusVentas;
    lead.updatedAt = new Date().toISOString();
    writeJSON(LEADS_FILE, leads);
    return res.json({ ok: true, status: lead.statusVentas });
  }
  res.status(404).json({ ok: false, error: 'Lead no encontrado' });
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
        bedrooms, bathrooms, parking, levels, paymentPlan, roi, reserveAmount, description, delivery, confotur, airbnbFriendly,
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
    parking: parking || '',
    levels: levels || '',
    paymentPlan: paymentPlan || '',
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
        bedrooms, bathrooms, parking, levels, paymentPlan, roi, reserveAmount, description, delivery, confotur, airbnbFriendly,
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
    parking: parking || projects[idx].parking,
    levels: levels || projects[idx].levels,
    paymentPlan: paymentPlan || projects[idx].paymentPlan,
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
router.get('/blog', requireRole('admin'), (req, res) => {
  const articles = readJSON(BLOG_FILE).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.render('admin/blog/index', {
    pageTitle: 'Blog — CIASA Admin',
    articles
  });
});

router.get('/blog/nuevo', requireRole('admin'), (req, res) => {
  res.render('admin/blog/form', {
    pageTitle: 'Nuevo Artículo — CIASA Admin',
    article: null, isNew: true, error: null
  });
});

router.get('/blog/:id/editar', requireRole('admin'), (req, res) => {
  const articles = readJSON(BLOG_FILE);
  const article = articles.find(a => a.id === req.params.id);
  if (!article) return res.redirect('/admin/blog');
  res.render('admin/blog/form', {
    pageTitle: `Editar: ${article.titulo} — CIASA Admin`,
    article, isNew: false, error: null
  });
});

router.post('/blog/nuevo', requireRole('admin'), (req, res) => {
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

router.post('/blog/:id/editar', requireRole('admin'), (req, res) => {
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

router.post('/blog/:id/eliminar', requireRole('admin'), (req, res) => {
  const articles = readJSON(BLOG_FILE);
  const updated = articles.filter(a => a.id !== req.params.id);
  writeJSON(BLOG_FILE, updated);
  res.redirect('/admin/blog?deleted=1');
});

// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO MARKETING & CRM NPI (Integrado nativo en panel Admin)
// ═══════════════════════════════════════════════════════════════════════════
router.get(['/npi', '/crm-npi'], requireRole('admin'), (req, res) => {
  res.render('admin/npi', {
    pageTitle: 'Marketing & Proveedores NPI — CIASA Admin',
    activePage: 'npi'
  });
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

  // Sincronizar automáticamente correo y WhatsApp con ajustes generales
  try {
    const ajustes = readJSON(AJUSTES_FILE);
    if (ajustes) {
      if (email) ajustes.contactoEmail = email;
      if (telefono) ajustes.whatsappPhone = telefono.replace(/[^0-9+]/g, '');
      writeJSON(AJUSTES_FILE, ajustes);
    }
  } catch (e) {}

  res.redirect('/admin/perfil?success=1');
});

// 2. Mis Tareas Globales
router.get('/tareas', (req, res) => {
  let leads = readJSON(LEADS_FILE);
  // RBAC: Si es asesor, únicamente sus tareas
  if (req.user && req.user.role === 'asesor') {
    leads = leads.filter(l => 
      l.asesorId === req.user.id || 
      (l.asesorAsignado && l.asesorAsignado.toLowerCase() === req.user.nombre.toLowerCase())
    );
  }

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
router.get('/seo', requireRole('admin'), (req, res) => {
  const ajustes = readJSON(AJUSTES_FILE);
  res.render('admin/seo', {
    pageTitle: 'Ajustes & SEO — CIASA Admin',
    ajustes,
    success: req.query.success === '1'
  });
});

router.post('/seo', requireRole('admin'), (req, res) => {
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

// MÓDULO DE GESTIÓN DE USUARIOS, ASESORES & COMISIONES (SOLO ADMIN)
router.get('/usuarios', requireRole('admin'), (req, res) => {
  const usuarios = readJSON(USERS_FILE);
  const leads    = readJSON(LEADS_FILE);
  res.render('admin/usuarios', {
    pageTitle: 'Gestión de Usuarios & Asesores — CIASA Admin',
    activePage: 'usuarios',
    usuarios,
    leads,
    success: req.query.success === '1',
    error: req.query.error || null
  });
});

router.post('/usuarios', requireRole('admin'), (req, res) => {
  const usuarios = readJSON(USERS_FILE);
  const { nombre, email, username, password, telefono, role, comisionPorcentaje } = req.body;

  if (!nombre || !email || !username || !password) {
    return res.redirect('/admin/usuarios?error=' + encodeURIComponent('Todos los campos marcados con * son requeridos.'));
  }

  const cleanUsername = username.trim().toLowerCase();
  const cleanEmail = email.trim().toLowerCase();

  // Validar duplicados
  const exists = usuarios.find(u => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanEmail);
  if (exists) {
    return res.redirect('/admin/usuarios?error=' + encodeURIComponent('El nombre de usuario o correo ya se encuentra registrado.'));
  }

  const newUser = {
    id: 'usr_' + (role || 'asesor') + '_' + Date.now().toString(36),
    nombre: nombre.trim(),
    email: cleanEmail,
    username: cleanUsername,
    role: role === 'admin' ? 'admin' : 'asesor',
    cargo: role === 'admin' ? 'Director(a) / Administrador(a)' : 'Asesor(a) Inmobiliario(a)',
    telefono: telefono ? telefono.trim() : '',
    avatar: '/assets/images/team/paola-caram-avatar.jpg',
    activo: true,
    passwordHash: hashPassword(password),
    comisionPorcentaje: parseInt(comisionPorcentaje) || (role === 'admin' ? 100 : 50),
    createdAt: new Date().toISOString()
  };

  usuarios.push(newUser);
  writeJSON(USERS_FILE, usuarios);
  res.redirect('/admin/usuarios?success=1');
});

// 4. Módulo de Email Marketing & Automatizaciones
const { EMAIL_TEMPLATES, sendTemplateEmail, readEmailLogs } = require('../services/emailService');

router.get('/marketing', requireRole('admin'), (req, res) => {
  const leads = readJSON(LEADS_FILE);
  const logs = readEmailLogs();
  res.render('admin/marketing', {
    pageTitle: 'Email Marketing & Secuencias — CIASA Admin',
    activePage: 'marketing',
    leads,
    templates: EMAIL_TEMPLATES,
    logs,
    success: req.query.success === '1'
  });
});

router.get('/marketing/preview/:templateId', (req, res) => {
  const template = EMAIL_TEMPLATES[req.params.templateId];
  if (!template) {
    return res.status(404).send('Plantilla no encontrada');
  }
  const sampleLead = {
    nombre: req.query.nombre || 'Dr. Carlos Mendoza',
    email: req.query.email || 'carlos.mendoza@example.com',
    telefono: '+1 (809) 555-1234',
    ciudad: 'Miami',
    pais: 'EE.UU.',
    montoInversion: '185,000',
    region: 'Punta Cana',
    proyectoInteres: 'Moon Garden'
  };
  const html = template.render(sampleLead);
  res.send(html);
});

router.post('/marketing/send', requireRole('admin'), async (req, res) => {
  try {
    const { templateId, leadId, customEmail, customNombre, customSubject } = req.body;
    let lead = {
      nombre: customNombre || 'Inversionista',
      email: customEmail,
      telefono: '',
      region: 'República Dominicana'
    };

    if (leadId) {
      const leads = readJSON(LEADS_FILE);
      const found = leads.find(l => (l._id === leadId || l.id === leadId));
      if (found) {
        lead = found;
        if (customEmail) lead.email = customEmail;
      }
    }

    if (!lead.email || !lead.email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Debe especificar un correo electrónico de destino válido.' });
    }

    const result = await sendTemplateEmail({
      templateId,
      lead,
      customRecipient: lead.email,
      customSubject
    });

    // Si el lead existe, agregar nota en su historial
    if (leadId) {
      const leads = readJSON(LEADS_FILE);
      const idx = leads.findIndex(l => (l._id === leadId || l.id === leadId));
      if (idx !== -1) {
        leads[idx].notas = leads[idx].notas || [];
        leads[idx].notas.unshift({
          id: 'n_' + Date.now(),
          texto: `Correo enviado (${templateId}): ${result.subject}`,
          fecha: new Date().toISOString(),
          autor: 'Email Marketing CIASA'
        });
        writeJSON(LEADS_FILE, leads);
      }
    }

    return res.json({
      success: true,
      message: 'Correo procesado y despachado exitosamente.',
      result
    });
  } catch (err) {
    console.error('Error in marketing send endpoint:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

