# Ecosistema Digital CIASA RD — Portal Web & Suite CRM Administrativa

> **Plataforma Oficial de Inversión Inmobiliaria y Gestión Comercial de CIASA Bolsa Inmobiliaria.**  
> Desarrollado bajo arquitectura Node.js / Express con URLs canónicas, streaming nativo HTTP 206, Suite CRM 360° y Motor de Segmentación NPI.

---

## 🏛️ Identidad de Marca y Filosofía Visual

CIASA RD opera bajo una identidad institucional ejecutiva enfocada en el inversionista de alto patrimonio y la diáspora en EE.UU.:

* **Tono de Comunicación:** Ejecutivo, seguro, transparente, institucional y sofisticado.
* **Paleta de Colores Primaria:**
  * **Navy Institucional:** `#1B3A5C` (Confianza, solidez corporativa)
  * **Azul Eléctrico / Primario:** `#2563EB` (Interactividad, modernidad, botones CTA principales)
  * **Azul Cielo / Acento:** `#5B9BD5` (Detalles y enlaces secundarios)
  * **Verde Inversión / CONFOTUR:** `#7DB33A` (Rentabilidad, ROI, beneficios fiscales)
  * **Fondo Superficie:** `#F8FAFC` (Lectura limpia, fondo corporativo)
  * **Texto Principal:** `#1E293B` (Legibilidad óptima sobre fondos claros)
  * **Bordes & Separadores:** `#E2E8F0` (Estructura sutil y moderna)
* **Tipografía Oficial:**
  * **Títulos y Encabezados:** `Outfit`, `Playfair Display` o `Inter` (Font-weight 600/700, tracking ajustado).
  * **Cuerpo de Texto y Datos:** `Inter`, `system-ui`, `-apple-system`, `sans-serif` (Lectura fluida y descansada).
* **Cero Emojis en Código y UI:** Se prohíbe el uso de emojis decorativos; toda la iconografía se renderiza con vectores SVG limpios y consistentes.

---

## 🏗️ Arquitectura Técnica del Proyecto

```text
📁 CIASARD-produccion/
├── 📄 server.js                   # Servidor Node.js Express (Clean URLs, Streaming HTTP 206)
├── 📄 package.json                # Dependencias (Express, EJS)
├── 📄 .env.example                # Variables de entorno y credenciales MySQL
├── 📄 AGENTS.md                   # Reglas de arquitectura del ecosistema
├── 📄 MANUAL_DE_MARCA_Y_DESARROLLO_UI_UX.md # Manual técnico de marca y frontend
├── 📄 MANUAL_DE_MARCA_Y_DESARROLLO_UI_UX.pdf # Documento ejecutivo descargable
│
├── 📁 routes/                     # Enrutadores modulares
│   ├── index.js                   # Rutas públicas del portal
│   └── admin.js                   # Rutas protegidas del panel CRM (/admin)
│
├── 📁 views/                      # Motor de plantillas EJS
│   ├── layouts/                   # Master Header y Footer
│   ├── pages/                     # Páginas públicas (inicio, proyectos, invertir, etc.)
│   └── admin/                     # Módulos del CRM (leads, propiedades, blog, NPI)
│
├── 📁 public/                     # Assets estáticos servidos por Node.js
│   ├── assets/                    # Imágenes, logos y branding
│   └── videos/                    # Videos MP4 optimizados para streaming
│
├── 📁 sitio-web/                  # Espejo estático para despliegue en Hostinger (public_html)
│   ├── .htaccess                  # Reglas Apache, Clean URLs y seguridad
│   ├── index.html                 # Home estático
│   ├── crm-npi.html               # Módulo NPI
│   └── (carpetas de módulos)
│
└── 📁 scripts/
    └── deploy_hostinger.py        # Despliegue automatizado por TUS protocol
```

---

## ⚡ Guía de Inicio Rápido (Desarrollo Local)

### 1. Requisitos Previos
* Node.js v18.0.0 o superior
* Python 3.8+ (para el script de despliegue)

### 2. Instalación y Ejecución
```bash
# 1. Clonar el repositorio
git clone https://github.com/rony1030/ciasa-rd-portal.git
cd ciasa-rd-portal

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor local de desarrollo
npm start
```

Abre tu navegador en: **`http://localhost:3000`**

---

## 🚀 Rutas Canónicas del Portal
* 🏠 **Inicio:** `/`
* 🏢 **Nosotros:** `/nosotros`
* 📊 **Invertir en RD:** `/invertir`
* 📐 **Proyectos:** `/proyectos`
* 🧮 **Herramientas & ROI:** `/herramientas`
* 🗺️ **Mapa Interactivo:** `/mapa`
* ✉️ **Contacto:** `/contacto`
* ❓ **FAQ:** `/faq`
* 🔐 **Panel CRM Admin:** `/admin` (Login en `/admin/login`)
* 🎯 **Motor NPI:** `/admin/npi`

---

## 🌐 Despliegue a Hostinger (Producción)

Para subir los cambios al servidor de producción en Hostinger:

```bash
python scripts/deploy_hostinger.py
```

El script empaqueta el contenido de `sitio-web/` y lo transfiere mediante el protocolo TUS de Hostinger de manera segura y atómica.
