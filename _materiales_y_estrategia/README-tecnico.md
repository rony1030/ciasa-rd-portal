# CIASA RD — Documentación Técnica de Entrega y Arquitectura

**Plataforma Oficial de Inversión Inmobiliaria y Gestión Comercial — CIASA Bolsa Inmobiliaria**  
**Dirección de Desarrollo Tecnológico:** Rony Bello  
**Versión:** 2.0.0 (Producción)

---

## 1. Contenido del Paquete y Estructura

```text
📁 entrega/
├── 📄 MANUAL_TECNICO_DE_ARQUITECTURA_Y_APIS.md  ← Manual técnico completo de APIs y desarrollo
├── 📄 MANUAL_DE_MARCA_Y_DESARROLLO_UI_UX.md     ← Manual de marca, colores y UI/UX
├── 📄 server.js                                 ← Servidor Node.js Express con soporte MVC
├── 📁 routes/                                   ← Controladores de rutas públicas y CRM admin
├── 📁 services/                                 ← Capa de servicios (SMTP y plantillas de correo)
├── 📁 views/                                    ← Motor de plantillas EJS y layouts
├── 📁 public/                                   ← Assets estáticos, videos y JavaScript
├── 📁 sitio-web/                                ← Espejo estático para despliegue
└── 📁 _materiales_y_estrategia/
    ├── 📁 datos/                                ← Capa de datos estructurada (JSON)
    └── 📁 estrategia-de-contenidos/             ← Documentos de estrategia comercial
```

---

## 2. Repositorio Oficial en GitHub y Accesos

* **URL:** `https://github.com/rony1030/ciasa-rd-portal`
* **Estado:** Privado.
* **Control de Accesos:** Actualmente el **Sr. Pedro** y la dirección técnica cuentan con acceso habilitado.
* **Solicitud de Nuevos Accesos:** Si el programador o cualquier técnico de CIASA requiere acceso para auditar o clonar el proyecto, solo debe suministrar su dirección de correo electrónico a la dirección de desarrollo para ser añadido como colaborador de inmediato.

---

## 3. Propiedad del Código y Evolución del Sistema

* **Propiedad Exclusiva:** Cada módulo, API, script, base de datos y diseño ha sido desarrollado a la medida para **CIASA Bolsa Inmobiliaria** y pertenece 100% a la empresa.
* **Nuevas Funcionalidades y Mejoras:** Si la directiva o el equipo técnico desea incorporar nuevas opciones, pasarelas de pago, integraciones o ajustes de flujo, pueden solicitarlo para coordinar su desarrollo y despliegue continuo con estimaciones de tiempo claras y transparentes.

---

## 4. Resumen de APIs Implementadas

1. **`POST /api/leads`** (`routes/index.js`): Captura automática de prospectos desde formularios web, registro en `datos/leads.json` y despacho de correos transaccionales de notificación.
2. **`GET /api/proyectos`** (`routes/index.js`): Catálogo JSON de proyectos disponibles para mapas y filtros dinámicos.
3. **`GET /api/npi/search`** (`server.js`): Motor de segmentación de leads médicos en EE.UU. con búsqueda multicriterio (MySQL + Fallback local).
4. **`GET /api/npi/states`** (`server.js`): Estadísticas agregadas por estado.
5. **`POST /api/npi/sync_socials`** (`server.js`): Sincronización de perfiles sociales y correos de médicos.
6. **`POST /admin/leads/:id/status-ajax`** (`routes/admin.js`): API interactiva para el tablero Kanban en tiempo real.
7. **`POST /admin/marketing/send`** (`routes/admin.js`): Despacho de campañas y secuencias de email marketing.
8. **`GET /videos/:filename`** (`server.js`): Streaming nativo de video con soporte HTTP 206 Partial Content.

Consulte el archivo [`MANUAL_TECNICO_DE_ARQUITECTURA_Y_APIS.md`](../MANUAL_TECNICO_DE_ARQUITECTURA_Y_APIS.md) para ver la especificación técnica completa y la guía de edición de código.
