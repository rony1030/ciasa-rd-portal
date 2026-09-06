# Ecosistema Digital CIASA RD — Portal Web & Suite CRM Administrativa

> **Plataforma Oficial de Inversión Inmobiliaria y Gestión Comercial de CIASA Bolsa Inmobiliaria.**  
> Arquitectura en Node.js / Express con Clean URLs canónicas, streaming multimedia nativo HTTP 206, Suite CRM 360°, motor de segmentación médica NPI y automatización de Email Marketing.

---

## 1. Repositorio Oficial y Control de Acceso (GitHub)

* **Repositorio:** `https://github.com/rony1030/ciasa-rd-portal`
* **Visibilidad:** **Privado**
* **Acceso y Colaboradores:** El repositorio se encuentra bajo control de acceso privado. Actualmente el **Sr. Pedro** y la dirección técnica cuentan con acceso habilitado.
* **Solicitud de Nuevos Accesos:** Si algún desarrollador, ingeniero o personal técnico adicional de CIASA requiere acceso para auditar, clonar o colaborar en el repositorio, solo deben proporcionar su dirección de correo electrónico a **Rony Bello** (Desarrollo & Programación Web) para ser agregados como colaboradores de forma inmediata.

```bash
# Clonar repositorio oficial
git clone https://github.com/rony1030/ciasa-rd-portal.git
cd ciasa-rd-portal
```

---

## 2. Declaración de Propiedad y Política de Evolución

* **Propiedad Exclusiva:** Todo el código fuente, la lógica de negocio, los módulos, las APIs, las interfaces, las bases de datos y la arquitectura técnica han sido desarrollados a medida y son propiedad exclusiva de **CIASA Bolsa Inmobiliaria**.
* **Evolución y Mejoras Continuas:** Si el equipo directivo o técnico de CIASA desea incorporar nuevas opciones, funciones adicionales, pasarelas de pago o integraciones externas, pueden solicitarlo en cualquier momento. Cada nuevo requerimiento se planificará y desarrollará con estimaciones de tiempo y esfuerzo técnico transparentes y realistas.
* **Marco de Mantenimiento por Fases:** La documentación técnica se actualizará al término de cada fase de desarrollo, registrando de forma estructurada los componentes creados, modificados, tocados y eliminados.

---

## 3. Arquitectura Técnica del Proyecto

```text
📁 ciasa-rd-portal/
├── 📄 server.js                                     # Servidor Node.js Express (Clean URLs, Streaming HTTP 206, APIs NPI)
├── 📄 package.json                                  # Dependencias (Express, EJS, mysql2, nodemailer)
├── 📄 .env.example                                  # Plantilla de variables de entorno y base de datos
├── 📄 AGENTS.md                                     # Estándares de arquitectura y rutas canónicas
├── 📄 MANUAL_TECNICO_DE_ARQUITECTURA_Y_APIS.md      # Manual técnico exhaustivo para desarrolladores
├── 📄 MANUAL_TECNICO_DE_ARQUITECTURA_Y_APIS.pdf     # Documento ejecutivo formal descargable
├── 📄 MANUAL_DE_MARCA_Y_DESARROLLO_UI_UX.md         # Manual de marca y lineamientos de diseño
│
├── 📁 routes/                                       # Enrutadores y controladores MVC
│   ├── index.js                                     # Rutas públicas del portal y APIs (/api/leads, /api/proyectos)
│   └── admin.js                                     # Rutas protegidas del panel CRM administrativo (/admin/*)
│
├── 📁 services/                                     # Capa de lógica de negocio y automatizaciones
│   ├── emailService.js                              # Servicio de despacho de correos SMTP y registro de logs
│   └── emailTemplates.js                            # Plantillas HTML responsivas para secuencias transaccionales
│
├── 📁 views/                                        # Motor de plantillas EJS
│   ├── layouts/                                     # Master Header y Footer compartidos
│   ├── pages/                                       # Páginas públicas (inicio, nosotros, proyectos, invertir, etc.)
│   └── admin/                                       # Vistas del CRM (dashboard, leads, propiedades, blog, NPI)
│
├── 📁 public/                                       # Archivos estáticos servidos por Express
│   ├── assets/                                      # Identidad gráfica, logotipos y vectores SVG
│   ├── js/                                          # Scripts de cliente (kanban, filtros, calculadoras)
│   └── videos/                                      # Videos MP4 optimizados para streaming nativo
│
├── 📁 sitio-web/                                    # Espejo estático para compatibilidad y respaldos en Hostinger
│
└── 📁 _materiales_y_estrategia/
    ├── 📁 diagramas/                                # Diagramas arquitectónicos y de flujo en alta resolución
    └── 📁 datos/                                    # Capa de persistencia estructurada (JSON Database)
        ├── leads.json                               # Registro de prospectos e inversionistas
        ├── propiedades.json                         # Catálogo maestro de 27 propiedades
        ├── blog.json                                # Artículos y análisis de mercado
        ├── perfil.json                              # Datos corporativos de contacto
        ├── ajustes.json                             # Configuración global y SEO
        └── email_logs.json                          # Bitácora de auditoría de correos enviados
```

---

## 4. Protocolo de Captura de Leads y Multicanal

1. **Formularios Web:** Captura de inversionistas en formularios de contacto, wizard de inversión, cotizadores y fichas de proyecto.
2. **Procesamiento Backend (`POST /api/leads`):** Sanitización y registro inmediato en `datos/leads.json`.
3. **Doble Despacho Transaccional SMTP:**
   * Correo de confirmación al inversionista con el Dossier oficial y beneficios de la Ley CONFOTUR.
   * Correo de alerta inmediata a la dirección comercial (`paola.caram@ciasard.org.do`).
4. **CRM 360° & Tarea a 24h:** Entrada automática en la etapa **"Nuevo"** del Tablero Kanban y generación de tarea comercial de seguimiento con alerta a 24 horas.
5. **Canal Directo WhatsApp:** Atención humana 1 a 1 sin intermediación de bots para respuesta inmediata.

---

## 5. Diagnóstico del Sistema Multiidioma (ES / EN / FR)

* **Diagnóstico:** El selector de idioma (banderas ES / EN / FR) y el diccionario `sitio-web/js/i18n.js` se encuentran creados; sin embargo, al migrar las vistas dinámicas a Node.js/EJS, los tags `data-i18n` quedaron desacoplados en el servidor.
* **Hoja de Ruta:** Módulo priorizado para su reparación integral (etiquetado de vistas EJS, ampliación del diccionario para las 27 propiedades y middleware en Express) antes de la comercialización internacional masiva.

---

## 6. Catálogo de APIs y Endpoints del Sistema

| Endpoint | Método | Ubicación en Código | Propósito Funcional |
| :--- | :--- | :--- | :--- |
| `/api/leads` | `POST` | `routes/index.js` | Captura y registro de prospectos con doble despacho de correos y tarea a 24h |
| `/api/proyectos` | `GET` | `routes/index.js` | Catálogo de proyectos en formato JSON para mapas y filtros dinámicos |
| `/api/npi/search` | `GET` | `server.js` | Motor de búsqueda y segmentación multicriterio NPI (MySQL + Fallback local) |
| `/api/npi/states` | `GET` | `server.js` | Estadísticas agregadas de proveedores médicos y latinos por estado |
| `/api/npi/sync_socials` | `POST` | `server.js` | Sincronización masiva de perfiles de LinkedIn, Instagram y correos |
| `/admin/leads/:id/status-ajax` | `POST` | `routes/admin.js` | Actualización interactiva de etapas en el Tablero Kanban (Drag & Drop) |
| `/admin/propiedades/:id/toggle` | `POST` | `routes/admin.js` | Publicación / despublicación instantánea de proyectos en el portal |
| `/admin/marketing/send` | `POST` | `routes/admin.js` | Envío de secuencias de email marketing y registro en el historial |
| `/videos/:filename` | `GET` | `server.js` | Streaming multimedia con protocolo HTTP 206 Partial Content |

Para consultar la especificación completa de parámetros, payloads y guías de edición de cada API, consulte el documento [`MANUAL_TECNICO_DE_ARQUITECTURA_Y_APIS.md`](./MANUAL_TECNICO_DE_ARQUITECTURA_Y_APIS.md).

---

## 7. Guía de Inicio Rápido (Desarrollo Local)

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Iniciar el servidor local
npm start
```

Abre tu navegador en: **`http://localhost:3000`**

---

## 8. Rutas Canónicas del Portal

* 🏠 **Inicio:** `/`
* 🏢 **Nosotros:** `/nosotros`
* 📊 **Guía de Inversión (Ley CONFOTUR):** `/invertir`
* 📐 **Catálogo de Proyectos:** `/proyectos`
* 🧮 **Calculadoras & ROI:** `/herramientas`
* 🧙 **Wizard de Inversión:** `/wizard`
* 🗺️ **Mapa Interactivo:** `/mapa`
* 📰 **Artículos & Guías:** `/articulos`
* ✉️ **Contacto:** `/contacto`
* ❓ **Preguntas Frecuentes:** `/faq`
* 🔐 **Suite CRM Administrativa:** `/admin` (Login en `/admin/login`)
* 🎯 **Módulo NPI:** `/admin/npi`
* 📧 **Email Marketing:** `/admin/marketing`

---

## 9. Despliegue a Producción (Hostinger)

Para subir los cambios al servidor de producción en Hostinger:

```bash
python scripts/deploy_hostinger.py
```

El script empaqueta el contenido de `sitio-web/` y lo transfiere mediante el protocolo TUS de Hostinger de manera segura y atómica.

---

## 10. Soporte Técnico y Contacto

* **Responsable Técnico:** **Rony Bello** (Desarrollo & Programación Web).
* **Consultas y Nuevos Requerimientos:** Comunicarse directamente con la dirección técnica para evaluar requerimientos, planificar nuevas funciones y coordinar entregas bajo cronogramas realistas y transparentes.
