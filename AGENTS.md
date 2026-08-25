# CIASA RD — Reglas y Estándares de Arquitectura del Proyecto

## 1. Runtime y Entorno de Ejecución: Node.js
* **Lenguaje:** JavaScript / Node.js (`server.js`, `package.json`).
* **Estándar:** Todas las rutas del portal deben servirse a través de Node.js con **URLs limpias** (Clean URLs), sin extensiones `.html` visibles en el navegador o en los enlaces de navegación.
* **Ejemplos de Rutas Canónicas:**
  * Inicio: `/`
  * Módulo CRM & Leads: `/crm-npi` (no `/crm-npi.html`)
  * Catálogo de Proyectos: `/proyectos/`
  * Fichas de Proyectos: `/proyectos/ciasa-001-pc`
  * Guía de Inversión: `/invertir/`
  * Calculadoras: `/herramientas/`
  * Mapa: `/mapa/`
  * Nosotros: `/nosotros/`
  * Contacto: `/contacto/`

## 2. Soporte Multimedia y Seguridad en Node.js
* **Streaming de Video:** Node.js responde a solicitudes `Range` con cabeceras `HTTP 206 Partial Content` para reproducción instantánea de videos MP4.
* **Cabeceras de Seguridad:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`.
* **Proxy de Backend:** Todas las peticiones `/api/npi/*` son enrutadas por Node.js de forma transparente.

## 3. Integración de Módulos
* **CRM NPI:** El módulo `/crm-npi` cuenta con un motor de segmentación y exportación de prospectos en lotes (150 leads/archivo ZIP) optimizado para importación directa en **Hostinger Reach**, **Mailchimp** y **Brevo**.
