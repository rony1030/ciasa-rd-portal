const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Carga segura de datos de propiedades desde la base de datos JSON
function getProjectsData() {
  const dataPath = path.join(__dirname, '..', '_materiales_y_estrategia', 'datos', 'propiedades.json');
  try {
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading properties json:', e);
  }
  return [];
}

// Carga segura de artículos del blog desde JSON
function getBlogData() {
  const dataPath = path.join(__dirname, '..', '_materiales_y_estrategia', 'datos', 'blog.json');
  try {
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading blog json:', e);
  }
  return [];
}

// 1. Inicio
router.get('/', (req, res) => {
  const projects = getProjectsData();
  const featuredProjects = projects.filter(p => p.featured).slice(0, 6);
  res.render('pages/index', {
    pageTitle: 'CIASA Bolsa Inmobiliaria — Inversión Inmobiliaria en RD',
    pageDesc: 'Portal oficial de CIASA Bolsa Inmobiliaria. Inversión inmobiliaria con Ley CONFOTUR para dominicanos en el exterior.',
    activePage: 'inicio',
    featuredProjects
  });
});

// 2. Nosotros
router.get('/nosotros', (req, res) => {
  res.render('pages/nosotros', {
    pageTitle: 'Nosotros | CIASA Bolsa Inmobiliaria — Expertos en RD',
    pageDesc: 'Conoce al equipo detrás de CIASA Bolsa Inmobiliaria: Paola Caram, Angeline Pimentel y Giordana Moscoso.',
    activePage: 'nosotros'
  });
});

// 3. Servicios
router.get('/servicios', (req, res) => {
  res.render('pages/servicios', {
    pageTitle: 'Servicios Complementarios | CIASA Bolsa Inmobiliaria',
    pageDesc: 'Seguros, viajes, servicios financieros, legales y gestión de trámites para inversionistas inmobiliarios en República Dominicana.',
    activePage: 'servicios'
  });
});

// 4. Guía de Inversión
router.get('/invertir', (req, res) => {
  res.render('pages/invertir', {
    pageTitle: 'Guía de Inversión & Ley CONFOTUR | CIASA Bolsa Inmobiliaria',
    pageDesc: 'Aprende cómo invertir con seguridad en República Dominicana con los beneficios fiscales de la Ley CONFOTUR 158-01.',
    activePage: 'invertir'
  });
});

// 5. Herramientas & Calculadoras
router.get('/herramientas', (req, res) => {
  res.render('pages/herramientas', {
    pageTitle: 'Calculadoras Inmobiliarias & ROI | CIASA Bolsa Inmobiliaria',
    pageDesc: 'Simula el retorno de inversión de tu propiedad, calcula el ahorro fiscal con Ley CONFOTUR y estima tus cuotas hipotecarias en RD.',
    activePage: 'herramientas'
  });
});

// 6. Wizard de Inversión
router.get('/wizard', (req, res) => {
  res.render('pages/wizard', {
    pageTitle: 'Wizard de Inversión Inmobiliaria | CIASA Bolsa Inmobiliaria',
    pageDesc: 'Encuentra tu propiedad ideal en República Dominicana en 4 pasos según tu presupuesto, objetivos y rentabilidad proyectada.',
    activePage: 'wizard'
  });
});

// 7. Artículos & Guías (conectado a blog.json)
router.get('/articulos', (req, res) => {
  const articles = getBlogData().filter(a => a.estado === 'publicado');
  res.render('pages/articulos', {
    pageTitle: 'Artículos & Guías de Inversión | CIASA Bolsa Inmobiliaria',
    pageDesc: 'Análisis de mercado, consejos legales, Ley CONFOTUR y guías prácticas para inversionistas en bienes raíces en RD.',
    activePage: 'articulos',
    articles
  });
});

// 7b. Ficha Detallada del Artículo
router.get('/articulos/:slug', (req, res) => {
  const articles = getBlogData();
  const article = articles.find(a => a.slug === req.params.slug || a.id === req.params.slug);
  if (!article) return res.redirect('/articulos');
  res.render('pages/articulo-detalle', {
    article,
    activePage: 'articulos'
  });
});

const REGION_METADATA = {
  'punta-cana': {
    id: 'punta-cana',
    name: 'Punta Cana & Cap Cana',
    coords: [18.56, -68.38],
    zoom: 11,
    desc: 'El epicentro del turismo en el Caribe. Cap Cana, Bávaro y Cabeza de Toro ofrecen las mejores oportunidades con alta demanda y retorno.'
  },
  'bayahibe': {
    id: 'bayahibe',
    name: 'Bayahíbe & Dominicus',
    coords: [18.37, -68.84],
    zoom: 12,
    desc: 'Paraíso natural con playas vírgenes y punto de partida a Isla Saona. Alto turismo europeo y buceo de clase mundial.'
  },
  'juan-dolio': {
    id: 'juan-dolio',
    name: 'Juan Dolio / San Pedro',
    coords: [18.43, -69.41],
    zoom: 12,
    desc: 'A solo 45 min de Santo Domingo, combina playa y ciudad. Ideal para segunda residencia y plusvalía continua.'
  },
  'distrito-nacional': {
    id: 'distrito-nacional',
    name: 'Santo Domingo & DN',
    coords: [18.48, -69.93],
    zoom: 12,
    desc: 'El corazón corporativo y financiero de la República Dominicana. Alta demanda residencial y rentas a largo plazo.'
  },
  'bani': {
    id: 'bani',
    name: 'Baní / Peravia',
    coords: [18.28, -70.33],
    zoom: 11,
    desc: 'Exclusivas villas de lujo con amplios terrenos para inversionistas que buscan privacidad y exclusividad.'
  },
  'miches': {
    id: 'miches',
    name: 'Miches / El Seibo',
    coords: [18.98, -69.05],
    zoom: 11,
    desc: 'La nueva frontera de ultra lujo y desarrollo turístico en el Caribe con alta proyección de valorización.'
  }
};

function getDynamicRegions(projects) {
  const regionsMap = {};

  Object.keys(REGION_METADATA).forEach(key => {
    regionsMap[key] = {
      ...REGION_METADATA[key],
      projects: [],
      projectCount: 0,
      minPrice: null,
      maxPrice: null,
      priceRange: 'Consultar',
      rois: []
    };
  });

  projects.forEach(p => {
    const regKey = (p.region || '').toLowerCase();
    let targetKey = Object.keys(regionsMap).find(k => regKey.includes(k) || k.includes(regKey));
    if (!targetKey) {
      targetKey = 'punta-cana';
    }

    const reg = regionsMap[targetKey];
    reg.projects.push(p);
    reg.projectCount++;

    if (p.priceFrom && typeof p.priceFrom === 'number') {
      if (reg.minPrice === null || p.priceFrom < reg.minPrice) reg.minPrice = p.priceFrom;
      if (reg.maxPrice === null || p.priceFrom > reg.maxPrice) reg.maxPrice = p.priceFrom;
    }
    if (p.priceTo && typeof p.priceTo === 'number') {
      if (reg.maxPrice === null || p.priceTo > reg.maxPrice) reg.maxPrice = p.priceTo;
    }
    if (p.roi) {
      reg.rois.push(p.roi);
    }
  });

  return Object.values(regionsMap).map(reg => {
    if (reg.minPrice && reg.maxPrice) {
      const minK = Math.round(reg.minPrice / 1000);
      const maxK = Math.round(reg.maxPrice / 1000);
      reg.priceRange = (minK === maxK) ? `$${minK}K USD` : `$${minK}K - $${maxK}K USD`;
    } else if (reg.minPrice) {
      reg.priceRange = `Desde $${Math.round(reg.minPrice / 1000)}K USD`;
    }

    reg.avgRoi = reg.rois.length > 0 ? reg.rois[0] : '8% - 14%';
    return reg;
  });
}

// 8. Mapa Interactivo de Polos Turísticos
router.get('/mapa', (req, res) => {
  const projects = getProjectsData();
  const dynamicRegions = getDynamicRegions(projects);
  res.render('pages/mapa', {
    pageTitle: 'Mapa Interactivo de Polos Turísticos | CIASA Bolsa Inmobiliaria',
    pageDesc: 'Explora las principales regiones de inversión inmobiliaria en República Dominicana: Punta Cana, Cap Cana, Santo Domingo, Juan Dolio, Bayahíbe, Samaná y Miches.',
    activePage: 'mapa',
    projects,
    dynamicRegions
  });
});

// 9. Contacto Directo
router.get('/contacto', (req, res) => {
  res.render('pages/contacto', {
    pageTitle: 'Contacto Directo | CIASA Bolsa Inmobiliaria',
    pageDesc: 'Comunícate con nuestro equipo en Santo Domingo o para atención a dominicanos en EE.UU. y el exterior.',
    activePage: 'contacto'
  });
});

// 10. Preguntas Frecuentes (FAQ)
router.get('/faq', (req, res) => {
  res.render('pages/faq', {
    pageTitle: 'Preguntas Frecuentes (FAQ) | CIASA Bolsa Inmobiliaria',
    pageDesc: 'Respuestas claras sobre compra a distancia, Ley CONFOTUR, financiamiento bancario y rentas Airbnb en República Dominicana.',
    activePage: 'faq'
  });
});

// 11. Catálogo Dinámico de Proyectos (solo disponibles)
router.get('/proyectos', (req, res) => {
  const allProjects = getProjectsData();
  // Solo mostrar proyectos con available !== false
  const projects = allProjects.filter(p => p.available !== false);
  res.render('pages/proyectos', {
    pageTitle: 'Catálogo de Proyectos Inmobiliarios | CIASA Bolsa Inmobiliaria',
    pageDesc: 'Explora nuestro catálogo exclusivo de proyectos turísticos y residenciales en República Dominicana con Ley CONFOTUR.',
    activePage: 'proyectos',
    projects
  });
});

// 12. Ficha de Detalle de Proyecto (/proyectos/:slug)
router.get('/proyectos/:slug', (req, res) => {
  const projects = getProjectsData();
  const slugParam = req.params.slug.toLowerCase();
  
  const project = projects.find(p => 
    (p.slug && p.slug.toLowerCase() === slugParam) || 
    (p.id && p.id.toLowerCase() === slugParam) ||
    (p.code && p.code.toLowerCase() === slugParam)
  );

  if (!project) {
    return res.redirect('/proyectos');
  }

  const relatedProjects = projects
    .filter(p => p.region === project.region && p.id !== project.id)
    .slice(0, 3);

  res.render('pages/proyecto-detalle', {
    pageTitle: `${project.name} — ${project.region} | CIASA Bolsa Inmobiliaria`,
    pageDesc: `${project.name} en ${project.region}: Desde $${project.priceFrom ? project.priceFrom.toLocaleString('en-US') : ''} USD. ${project.description ? project.description.slice(0, 140) : ''}...`,
    activePage: 'proyectos',
    project,
    relatedProjects
  });
});

// 13. API JSON de Proyectos
router.get('/api/proyectos', (req, res) => {
  const projects = getProjectsData();
  res.json(projects);
});

// 14. API de Captación Automática de Leads (Formularios Web -> CRM)
router.post('/api/leads', (req, res) => {
  try {
    const dataPath = path.join(__dirname, '..', '_materiales_y_estrategia', 'datos', 'leads.json');
    let leads = [];
    if (fs.existsSync(dataPath)) {
      leads = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }

    const { nombre, email, telefono, pais, ciudad, estado, montoInversion, region, proyectoInteres, comoNosEncontro, razones, mensaje, source } = req.body;

    if (!nombre || (!email && !telefono)) {
      return res.status(400).json({ success: false, error: 'Nombre y al menos un método de contacto (email o teléfono) son requeridos.' });
    }

    const newLead = {
      _id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      nombre: nombre.trim(),
      email: (email || '').trim(),
      telefono: (telefono || '').trim(),
      pais: pais || 'EE.UU.',
      ciudad: ciudad || '',
      estado: estado || '',
      montoInversion: montoInversion || '',
      region: region || '',
      proyectoInteres: proyectoInteres || '',
      comoNosEncontro: comoNosEncontro || '',
      razones: razones || '',
      source: source || 'Formulario Web Directo',
      statusVentas: 'nuevo',
      statusConstructora: 'pendiente',
      notas: mensaje ? [{
        id: 'n_' + Date.now(),
        texto: `Mensaje de contacto inicial: ${mensaje}`,
        fecha: new Date().toISOString(),
        autor: 'Sistema Web CIASA'
      }] : [],
      tareas: [{
        id: 't_' + Date.now(),
        titulo: `Contactar a ${nombre.trim()} por ${proyectoInteres ? proyectoInteres : 'consulta general'}`,
        fechaLimite: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        completada: false,
        prioridad: 'alta'
      }],
      documentos: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    leads.unshift(newLead);
    fs.writeFileSync(dataPath, JSON.stringify(leads, null, 2), 'utf-8');

    return res.json({
      success: true,
      message: 'Prospecto registrado exitosamente en el CRM.',
      leadId: newLead._id
    });
  } catch (error) {
    console.error('Error saving lead to CRM:', error);
    return res.status(500).json({ success: false, error: 'Error interno del servidor al procesar el prospecto.' });
  }
});

module.exports = router;
