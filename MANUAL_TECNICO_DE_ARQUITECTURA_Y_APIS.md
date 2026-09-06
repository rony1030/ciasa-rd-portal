# MANUAL TÉCNICO DE ARQUITECTURA, APIS Y GUÍA DE DESARROLLO
## Ecosistema Digital, Suite CRM Administrativa y Motor de Prospección NPI
### CIASA Bolsa Inmobiliaria RD

---

### Ficha Técnica del Documento

| Campo | Detalle |
| :--- | :--- |
| **A la atención de:** | Equipo Técnico, Desarrolladores y Directiva de CIASA Bolsa Inmobiliaria (Paola Caram Ibarra & Sr. Pedro) |
| **De:** | **Rony Bello** (Desarrollo & Programación Web) |
| **Proyecto:** | Ecosistema Digital CIASA RD (Portal Inmobiliario + Suite CRM + Motor NPI) |
| **Versión del Sistema:** | **Versión 2.0.0 (Producción) — Node.js MVC + Capa Híbrida JSON/MySQL** |
| **Fecha de Emisión:** | Agosto de 2026 |
| **Repositorio Oficial:** | `https://github.com/rony1030/ciasa-rd-portal.git` (**Privado**) |
| **Control de Accesos:** | Actualmente habilitado para el **Sr. Pedro** y dirección técnica. Para otorgar acceso a otros programadores o técnicos de la empresa, proporcionar su correo electrónico para cursar la invitación inmediata como colaborador. |
| **Declaración de Propiedad:** | **100% Propiedad Exclusiva de CIASA Bolsa Inmobiliaria** (Código fuente, APIs, bases de datos, módulos y recursos visuales). |
| **Política de Evolución:** | Arquitectura abierta y modular. Si el equipo técnico o directivo desea modificar una API, agregar nuevas funciones o integrar pasarelas, puede solicitarlo directamente; cada nuevo requerimiento se planificará bajo estimaciones de tiempo y esfuerzo técnico transparentes. |
| **Marco de Mantenimiento:** | Actualización continua al cierre de cada fase técnica, documentando componentes creados, modificados, tocados y eliminados. |

---

## 1. ARQUITECTURA DE SOFTWARE Y PATRONES DE DISEÑO (DEEP DIVE)

El ecosistema digital opera bajo una arquitectura desacoplada en **Node.js (v18+) con Express** implementando el patrón **Modelo-Vista-Controlador (MVC)**. El sistema ha sido diseñado para proporcionar máxima velocidad de respuesta (<100 ms), separación estricta de responsabilidades, seguridad en cabeceras HTTP y persistencia híbrida.

```text
ciasa-rd-portal/
├── server.js                                     # Punto de entrada, middlewares globales, APIs NPI y streaming
├── package.json                                  # Manifiesto de dependencias y scripts de arranque
├── AGENTS.md                                     # Reglas maestras de arquitectura y rutas canónicas
├── MANUAL_TECNICO_DE_ARQUITECTURA_Y_APIS.md      # Manual técnico exhaustivo de desarrollo
├── MANUAL_DE_MARCA_Y_DESARROLLO_UI_UX.md         # Guía de estilo visual y componentes UI
│
├── routes/                                       # Controladores y enrutadores modulares (Capa Controlador)
│   ├── index.js                                  # Rutas públicas del portal y APIs (/api/leads, /api/proyectos)
│   └── admin.js                                  # Rutas protegidas del panel CRM administrativo (/admin/*)
│
├── services/                                     # Capa de servicios e integraciones
│   ├── emailService.js                           # Motor de despacho SMTP y registro de auditoría de correos
│   └── emailTemplates.js                         # Plantillas HTML responsivas para secuencias comerciales
│
├── views/                                        # Motor de plantillas EJS (Capa Vista)
│   ├── layouts/                                  # Plantillas maestras (header.ejs, footer.ejs)
│   ├── pages/                                    # Vistas públicas (inicio, proyectos, invertir, mapa, etc.)
│   └── admin/                                    # Vistas del CRM (dashboard, leads, propiedades, blog, NPI)
│
├── public/                                       # Archivos estáticos servidos directamente por Express
│   ├── assets/                                   # Imágenes institucionales, logotipos y vectores SVG
│   ├── js/                                       # Scripts de cliente (kanban, calculadoras, filtros)
│   └── videos/                                   # Videos MP4 codificados para streaming nativo HTTP 206
│
├── sitio-web/                                    # Espejo estático para compatibilidad y respaldos en Hostinger
│
└── _materiales_y_estrategia/
    ├── diagramas/                                # Diagramas arquitectónicos en alta resolución
    │   ├── diagrama_1_flujo_leads.png
    │   ├── diagrama_2_arquitectura_global.png
    │   ├── diagrama_3_sistema_traducciones.png
    │   ├── diagrama_4_motor_npi.png
    │   └── diagrama_5_pipeline_crm_kanban.png
    └── datos/                                    # Capa de persistencia estructurada (JSON Data Layer)
        ├── leads.json                            # Base de datos de prospectos e inversionistas
        ├── propiedades.json                      # Catálogo maestro de 27 propiedades inmobiliarias
        ├── blog.json                             # Artículos, análisis de mercado y guías de inversión
        ├── perfil.json                           # Datos corporativos de contacto de la dirección
        ├── ajustes.json                          # Metadatos globales de SEO, WhatsApp y analítica
        └── email_logs.json                       # Historial de auditoría de correos despachados
```

```
+-----------------------------------------------------------------------------------+
|                        DIAGRAMA 2: ARQUITECTURA TÉCNICA GLOBAL                    |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [CAPA CLIENTE]          [SERVIDOR NODE.JS]          [CAPA SERVICIOS]   [DATOS]   |
|  - HTML5 Semántico  ---> - Express 4.19 (MVC)   ---> - emailService.js ---> JSON DB |
|  - CSS3 Modular          - Clean URLs Canónicas      - Motor NPI (Pool) ---> MySQL |
|  - JS Vanilla / EJS      - HTTP 206 Streaming        - Admin CRM Manager           |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### 1.1 Ciclo de Vida de una Petición HTTP y Middlewares Globales
1. **Cabeceras de Seguridad:** Cada petición pasa por un middleware global que inyecta cabeceras `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN` y `Referrer-Policy: strict-origin-when-cross-origin`.
2. **Inyección de Contexto Global (`res.locals`):** El servidor carga dinámicamente `perfil.json` y `ajustes.json` inyectándolos en `res.locals.perfil` y `res.locals.ajustes`. Esto permite que cualquier plantilla EJS acceda a los teléfonos, correos y enlaces de WhatsApp corporativos sin necesidad de pasarlos manualmente en cada controlador.
3. **Body Parsers:** `express.json()` y `express.urlencoded({ extended: true })` procesan payloads JSON y formularios estándar.
4. **Tolerancia a Fallos en Arranque (`EADDRINUSE`):** Si el puerto configurado (ej. 3000) estuviera ocupado, el evento `server.on('error')` detecta el código `EADDRINUSE` y conmuta automáticamente al puerto siguiente (`PORT + 1`), evitando bloqueos en despliegues.

---

## 2. PROTOCOLO INTEGRAL DE FORMULARIOS, NOTIFICACIONES Y CAPTURA DE LEADS

El circuito de captación de prospectos es uno de los componentes más sensibles del portal. A continuación se explica minuciosamente cómo se procesa cada solicitud y cómo interactúan las distintas capas del sistema.

```
+-----------------------------------------------------------------------------------+
|               DIAGRAMA 1: FLUJO DE ENTRADA, NOTIFICACIÓN Y CRM                    |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  1. Formulario Web (Contacto / Ficha / Wizard)                                    |
|     │                                                                             |
|     ▼                                                                             |
|  2. API POST /api/leads (Sanitización + Generación ID + Inserción en leads.json)  |
|     │                                                                             |
|     ├───────────────────────────────┬────────────────────────────────┐            |
|     ▼                               ▼                                ▼            |
|  3A. Correo Confirmación       3B. Correo Alerta Interna       3C. Entrada CRM    |
|      (Al Inversionista con         (A Paola Caram / Ventas         (Ficha 'Nuevo' |
|       Dossier y copia de            con datos completos y           + Tarea a 24h |
|       su consulta)                  canal WhatsApp)                 + Bitácora)   |
|     │                               │                                │            |
|     └───────────────────────────────┴────────────────────────────────┘            |
|                                     │                                             |
|                                     ▼                                             |
|  4. Asignación de Agente & Atención Directa 1 a 1 vía WhatsApp / Correo           |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### 2.1 Flujo Operativo Detallado
1. **Captura en el Frontend:** El usuario completa un formulario en el portal (Ficha de Proyecto `/proyectos/:slug`, Contacto `/contacto`, Wizard de Inversión `/wizard`, o Cotizador en `/herramientas`).
2. **Recepción en Controlador (`routes/index.js` -> `POST /api/leads`):**
   * Valida que exista `nombre` y al menos un canal de contacto (`email` o `telefono`).
   * Sanitiza cadenas eliminando espacios redundantes y caracteres de control.
   * Genera un identificador único con timestamp: `lead_` + `Date.now()` + aleatorio alfanumérico.
3. **Persistencia en Base de Datos JSON:**
   * Abre `_materiales_y_estrategia/datos/leads.json`.
   * Inserta la nueva entidad al principio del arreglo (`leads.unshift(newLead)`).
   * Asigna automáticamente el estado comercial `statusVentas = 'nuevo'`.
   * Genera la primera entrada en la bitácora con el mensaje inicial del cliente.
   * Crea una tarea comercial automática: `"Contactar a [Nombre] por consulta de [Proyecto]"` con fecha límite a 24 horas y prioridad alta.
4. **Disparo Transaccional Asíncrono de Correos (`services/emailService.js`):**
   * **Correo de Confirmación al Inversionista:** Despacha un correo con diseño corporativo agradeciendo su interés, adjuntando el Dossier de Inversión y resumiendo los beneficios fiscales de la Ley CONFOTUR.
   * **Correo de Alerta Interna a Dirección:** Notifica inmediatamente a `paola.caram@ciasard.org.do` e `info@ciasard.org.do` con la ficha completa del lead, presupuesto, proyecto consultado y un botón directo para iniciar conversación en WhatsApp con un solo clic.
5. **Entrada en la Suite CRM:**
   * El lead aparece de inmediato en la primera columna (**"Nuevo"**) del Tablero Kanban administrativo (`/admin/leads`).
6. **Canales de Comunicación Establecidos:**
   * **Correo Electrónico:** Se utiliza como canal formal para confirmación de solicitudes, envío de cotizaciones, planos y contratos.
   * **WhatsApp Corporativo:** Se mantiene como canal prioritario para contacto humano directo, 1 a 1, sin intermediación de bots.

---

## 3. DIAGNÓSTICO EXHAUSTIVO Y PLAN DE REPARACIÓN DEL SISTEMA MULTIIDIOMA (ES / EN / FR)

> [!IMPORTANT]
> **Diagnóstico de Transparencia Técnica sobre el Sistema Multiidioma:**  
> El selector de idiomas (Banderas **ES / EN / FR**) y el diccionario centralizado (`sitio-web/js/i18n.js` con más de 1,500 líneas de traducción) están presentes en el proyecto; **sin embargo, el sistema de traducción se encuentra actualmente desacoplado de las vistas dinámicas de Node.js / EJS y NO está funcionando correctamente en el portal en vivo**.  
> **Este módulo debe ser reparado y sincronizado de forma prioritaria antes de cualquier lanzamiento comercial internacional**.

```
+-----------------------------------------------------------------------------------+
|               DIAGRAMA 3: DIAGNÓSTICO Y PLAN DE REPARACIÓN I18N                   |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ESTADO ACTUAL]               [DIAGNÓSTICO TÉCNICO]         [PLAN DE REPARACIÓN] |
|  - Selector ES/EN/FR visible   - Al migrar a EJS, los tags   1. Etiquetar vistas  |
|  - Diccionario i18n.js listo     data-i18n no están en          EJS con data-i18n |
|  - Fallo: al hacer clic en       elementos dinámicos.        2. Sincronizar       |
|    EN/FR solo cambia el botón  - Textos de proyectos y          diccionario JS    |
|    pero el texto sigue en ES.    calculadoras en español.    3. Middleware Express|
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### 3.1 Causa Raíz del Desacople
1. **Desfase entre HTML Estático y Vistas EJS:** En la versión estática anterior, el cliente ejecutaba `i18n.js` buscando selectores DOM `[data-i18n]`. Al migrar a Node.js, las páginas se renderizan en el servidor mediante plantillas EJS (`views/pages/*.ejs`) que leen los datos directamente desde `propiedades.json` y `blog.json` en español, omitiendo los atributos `data-i18n`.
2. **Comportamiento Actual:** Al hacer clic en inglés (EN) o francés (FR), el selector cambia visualmente en la barra superior, pero el 85% del contenido de la página permanece en español.

### 3.2 Hoja de Ruta Técnica para la Reparación Integral
* **Fase 1 (Etiquetado en EJS):** Incorporar los atributos `data-i18n="clave"` en todos los textos estáticos de las plantillas (`views/layouts/header.ejs`, `footer.ejs`, `pages/index.ejs`, `pages/proyectos.ejs`, `pages/invertir.ejs`, `pages/herramientas.ejs`, `pages/wizard.ejs`).
* **Fase 2 (Sincronización del Diccionario):** Actualizar `sitio-web/js/i18n.js` para incluir las descripciones de los 27 proyectos y los términos técnicos de las calculadoras.
* **Fase 3 (Middleware de Localización en Express):** Crear un middleware en `server.js` que detecte la cookie `ciasa_lang` o la cabecera `Accept-Language` para renderizar el idioma correcto desde el servidor, beneficiando la indexación multilingüe en Google.
* **Tiempo Estimado de Corrección:** **1 a 2 semanas**.

---

## 4. ESPECIFICACIÓN TÉCNICA PROFUNDA DE TODAS LAS APIS Y GUÍA DE MODIFICACIÓN

A continuación se detalla cada una de las APIs implementadas en el servidor, explicando su código fuente, parámetros, lógica interna y las instrucciones exactas para que cualquier programador pueda editarlas o extenderlas sin necesidad de inspeccionar el repositorio archivo por archivo.

---

### 4.1 API DE CAPTACIÓN DE PROSPECTOS (`POST /api/leads`)
* **Archivo Fuente:** [`routes/index.js`](file:///c:/Users/Rony%20Bello/Documents/GitHub/ciasa-rd-portal/routes/index.js#L298-L367)
* **Método HTTP:** `POST`
* **Content-Type:** `application/json` o `application/x-www-form-urlencoded`

#### Parámetros de Entrada y Tipos de Datos
| Parámetro | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `nombre` | `string` | Sí | Nombre completo del prospecto. |
| `email` | `string` | Condicional* | Correo electrónico (*Requerido si no se envía teléfono). |
| `telefono` | `string` | Condicional* | Número telefónico con código de país (*Requerido si no se envía email). |
| `pais` | `string` | No | País de residencia (Por defecto: `"EE.UU."`). |
| `ciudad` | `string` | No | Ciudad de residencia. |
| `estado` | `string` | No | Estado o provincia. |
| `montoInversion` | `string` | No | Rango de presupuesto en dólares (ej. `"185000"`). |
| `region` | `string` | No | Polo turístico de interés (`"Punta Cana"`, `"Santo Domingo"`, etc.). |
| `proyectoInteres`| `string` | No | Nombre del proyecto consultado (ej. `"Marina Garden 2"`). |
| `razones` | `string` | No | Propósito de compra (`"Renta corta"`, `"Plusvalía"`, `"Retiro"`). |
| `mensaje` | `string` | No | Consulta libre o comentario del inversionista. |
| `source` | `string` | No | Canal de procedencia (`"Formulario Web Directo"`, `"Wizard"`). |

#### Request Payload de Ejemplo
```json
{
  "nombre": "Dr. Carlos Mendoza",
  "email": "carlos.mendoza@clinicafl.com",
  "telefono": "+1 (305) 555-0192",
  "pais": "EE.UU.",
  "ciudad": "Miami",
  "estado": "FL",
  "montoInversion": "185000",
  "region": "Punta Cana",
  "proyectoInteres": "Marina Garden 2",
  "razones": "Renta corta Airbnb con Ley CONFOTUR",
  "mensaje": "Solicito información de planes de pago y reserva.",
  "source": "Ficha de Proyecto Web"
}
```

#### Response Payload (`200 OK`)
```json
{
  "success": true,
  "message": "Prospecto registrado exitosamente en el CRM y notificaciones enviadas.",
  "leadId": "lead_1725028491000_a3x9f"
}
```

#### Guía para el Programador: Cómo Modificar o Extender esta API
1. **Para agregar un nuevo campo (ej. `fechaEstimadaVisita`):**
   * Abra `routes/index.js` en la línea 307.
   * Extraiga el campo de `req.body`:
     ```javascript
     const { nombre, email, telefono, ..., fechaEstimadaVisita } = req.body;
     ```
   * Asigne el valor al objeto `newLead` en la línea 314:
     ```javascript
     const newLead = {
       _id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
       nombre: nombre.trim(),
       fechaEstimadaVisita: fechaEstimadaVisita || '',
       // ... resto de campos
     };
     ```
2. **Para cambiar el correo de alerta interna:**
   * Abra `services/emailService.js` en la línea 19 y modifique `adminRecipient` o defina la variable en el entorno.

---

### 4.2 API PÚBLICA DE CATÁLOGO DE PROYECTOS (`GET /api/proyectos`)
* **Archivo Fuente:** [`routes/index.js`](file:///c:/Users/Rony%20Bello/Documents/GitHub/ciasa-rd-portal/routes/index.js#L293-L296)
* **Método HTTP:** `GET`
* **Propósito:** Expone el catálogo maestro de 27 propiedades en formato JSON para el mapa interactivo (`/mapa`) y los filtros dinámicos del frontend.

#### Estructura del Objeto de Propiedad (JSON)
```json
[
  {
    "id": "ciasa-001-pc",
    "slug": "marina-garden-2-cap-cana",
    "code": "PC-001",
    "name": "Marina Garden 2",
    "region": "Punta Cana",
    "subLocation": "Cap Cana Marina",
    "type": "apartamento",
    "priceFrom": 185000,
    "priceTo": 340000,
    "sizeFrom": 65,
    "sizeTo": 142,
    "bedrooms": "1, 2 y 3",
    "bathrooms": "2 y 3",
    "parking": "1 o 2",
    "roi": "10% - 13.5%",
    "reserveAmount": 5000,
    "delivery": "Diciembre 2026",
    "confotur": true,
    "airbnbFriendly": true,
    "available": true,
    "featured": true,
    "coordinates": {
      "lat": 18.5142,
      "lng": -68.3789
    },
    "image": "assets/images/projects/marina-garden-2.jpg",
    "amenities": ["Piscina Infinity", "Acceso a Marina", "Gimnasio", "Seguridad 24/7"]
  }
]
```

#### Guía para el Programador: Cómo Filtrar o Modificar Proyectos
* Para excluir propiedades marcadas como no disponibles (`available === false`), modifique la función en `routes/index.js`:
  ```javascript
  router.get('/api/proyectos', (req, res) => {
    const projects = getProjectsData().filter(p => p.available !== false);
    res.json(projects);
  });
  ```

---

### 4.3 MOTOR DE SEGMENTACIÓN NPI DE EE.UU. (`GET /api/npi/search` y `/api/npi/states`)
* **Archivo Fuente:** [`server.js`](file:///c:/Users/Rony%20Bello/Documents/GitHub/ciasa-rd-portal/server.js#L92-L244)
* **Método HTTP:** `GET`
* **Propósito:** Búsqueda y segmentación en tiempo real sobre la base de datos de más de 8.8 millones de proveedores de salud (NPI) en Estados Unidos.

```
+-----------------------------------------------------------------------------------+
|               DIAGRAMA 4: MOTOR NPI & EXPORTACIÓN EN LOTES ZIP                    |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [FILTROS MULTICRITERIO]       [RESILIENCIA DUAL BACKEND]      [EXPORTACIÓN ZIP]  |
|  - Estado (FL, NY, CA, TX...)  - MySQL Live (Hostinger DB) ---> Bloques de 150    |
|  - Especialidad médica           Pool mysql2 parametrizado      leads por archivo |
|  - Quintil de ingresos (1-5)   - Fallback Dataset Local         ZIP listo para    |
|  - Filtro Hispano (latino=1)     curated_npi_data.js (5ms)      Mailchimp/Brevo   |
|  - Teléfono / Email / Redes                                                       |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

#### Parámetros de Consulta (Query Params)
* `state`: Código de estado (`FL`, `NY`, `CA`, `TX`, `NJ`, `ALL`).
* `specialty`: Especialidad médica (`Dentist`, `Cardiology`, `Surgery`, `ALL`).
* `quintile`: Nivel de ingresos de la zona geográfica (`1` a `5`, `ALL`).
* `latino_only`: `1` para filtrar exclusivamente profesionales hispanos.
* `has_phone`: `1` para exigir número de teléfono directo.
* `has_email`: `1` para exigir correo electrónico verificado.
* `has_social`: `1` para exigir perfil de LinkedIn, Facebook o Instagram.
* `page`: Número de página para paginación (Por defecto `1`).
* `limit`: Cantidad de registros por página (Por defecto `100`, máximo `500`).

#### Response Schema (`200 OK`)
```json
{
  "source": "mysql_live",
  "total_matching": 142050,
  "total_pages": 1421,
  "current_page": 1,
  "providers": [
    {
      "npi": "1497829104",
      "name": "DR. CARLOS MENDOZA",
      "first_name": "CARLOS",
      "last_name": "MENDOZA",
      "specialty": "Cardiovascular Disease",
      "city": "MIAMI",
      "state": "FL",
      "zip": "33133",
      "phone": "(305) 555-0192",
      "email": "dr.mendoza@cardiologyfl.com",
      "is_latino": 1,
      "income_quintile": 5,
      "linkedin_url": "https://linkedin.com/in/drcarlosmendoza",
      "facebook_url": "",
      "instagram_url": "",
      "notes": "Especialista de alto patrimonio"
    }
  ]
}
```

#### Mecanismo de Resiliencia Dual (MySQL + Fallback Local)
* **Ruta Primaria (MySQL Live):** El backend ejecuta una consulta dinámica parametrizada con `LIMIT ? OFFSET ?` sobre la base de datos `u868879774_ciasa_npi`.
* **Ruta Secundaria (Fallback Local):** Si MySQL no responde en menos de 500 ms o se encuentra en mantenimiento, el servidor conmuta de forma automática al dataset curado en `sitio-web/js/curated_npi_data.js`, devolviendo `source: "dataset_cache"` sin interrupción de servicio.

---

### 4.4 API DE SINCRONIZACIÓN Y ENRIQUECIMIENTO SOCIAL NPI (`POST /api/npi/sync_socials`)
* **Archivo Fuente:** [`server.js`](file:///c:/Users/Rony%20Bello/Documents/GitHub/ciasa-rd-portal/server.js#L247-L319)
* **Método HTTP:** `POST`
* **Propósito:** Ingesta y actualización masiva de perfiles de LinkedIn, Instagram, Facebook y correos electrónicos desde herramientas externas de prospección.

#### Payload de Entrada
```json
{
  "updates": [
    {
      "npi": "1497829104",
      "email": "dr.mendoza@cardiologyfl.com",
      "linkedin_url": "https://linkedin.com/in/drcarlosmendoza",
      "instagram_url": "https://instagram.com/drcarlosmendoza"
    }
  ]
}
```

#### Lógica de Persistencia Atómica
El backend ejecuta una consulta `UPDATE` usando `COALESCE(NULLIF(?, ''), columna_actual)` para no sobreescribir datos existentes con valores en blanco. Simultáneamente actualiza el archivo físico `curated_npi_data.js` para mantener la paridad en ambos entornos.

---

### 4.5 APIS DEL PIPELINE COMERCIAL Y TABLERO KANBAN (`POST /admin/leads/:id/*`)
* **Archivo Fuente:** [`routes/admin.js`](file:///c:/Users/Rony%20Bello/Documents/GitHub/ciasa-rd-portal/routes/admin.js#L219-L305)

```
+-----------------------------------------------------------------------------------+
|               DIAGRAMA 5: PIPELINE COMERCIAL & TABLERO KANBAN                     |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [1. NUEVO] ───> [2. CONTACTADO] ───> [3. CALIFICADO] ───> [4. EN NEGOCIACIÓN]    |
|  - Web captado   - WhatsApp/Llamada   - Presupuesto validado - Reserva de unidad  |
|  - Tarea a 24h   - Bitácora activa    - Dossier enviado      - Fideicomiso        |
|                                                                     │             |
|                                                                     ▼             |
|                                                            [5. CERRADO / VENTA]   |
|                                                            - Firma de contrato    |
|                                                            - Ficha KYC lista      |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

#### Endpoints Disponibles
1. **`POST /admin/leads/:id/status-ajax`:**
   * Actualiza el estado comercial (`statusVentas`) mediante arrastrar y soltar (Drag & Drop) en el Tablero Kanban.
   * Estados soportados: `nuevo`, `contactado`, `calificado`, `en_negociacion`, `cerrado`, `descartado`.
2. **`POST /admin/leads/:id/notas`:**
   * Agrega una nota con fecha, hora y autor en la bitácora cronológica del lead.
3. **`POST /admin/leads/:id/tareas`:**
   * Crea una nueva tarea de seguimiento con fecha límite y prioridad.
4. **`POST /admin/leads/:id/tareas/:taskId/toggle`:**
   * Conmuta el estado de completado de una tarea.
5. **`POST /admin/leads/:id/documentos`:**
   * Registra documentos digitales KYC asociados al inversionista.

---

### 4.6 APIS DE EMAIL MARKETING Y SECUENCIAS DRIP (`POST /admin/marketing/send`)
* **Archivo Fuente:** [`routes/admin.js`](file:///c:/Users/Rony%20Bello/Documents/GitHub/ciasa-rd-portal/routes/admin.js#L732) y [`services/emailService.js`](file:///c:/Users/Rony%20Bello/Documents/GitHub/ciasa-rd-portal/services/emailService.js)
* **Propósito:** Despacha campañas de correo personalizadas y secuencias automáticas de nutrición con plantillas HTML responsivas.

#### Plantillas Incorporadas en `services/emailTemplates.js`
1. `bienvenida_dossier`: Presentación corporativa, catálogo de proyectos destacados y beneficios CONFOTUR.
2. `confotur_beneficios`: Desglose legal del ahorro fiscal (exención de 3% de transferencia y 1% de IPI por 15 años).
3. `roi_rentabilidad`: Análisis financiero con proyecciones de rentabilidad del 8% al 14% en renta vacacional.
4. `invitacion_zoom`: Convocatoria a sesión de asesoría virtual privada 1 a 1.
5. `seguimiento_calido`: Reactivación de prospectos en seguimiento.

---

### 4.7 STREAMING DE VIDEO MULTIMEDIA (`GET /videos/:filename`)
* **Archivo Fuente:** [`server.js`](file:///c:/Users/Rony%20Bello/Documents/GitHub/ciasa-rd-portal/server.js#L332-L369)
* **Protocolo:** `HTTP 206 Partial Content` (Range Requests).
* **Propósito:** Permite la reproducción instantánea de videos MP4 (recorridos virtuales y presentaciones de proyectos) sin requerir la descarga completa del archivo, admitiendo saltos directos (scrubbing) en la línea de tiempo.

---

## 5. MODELOS MATEMÁTICOS Y ALGORITMOS DEL PORTAL

A continuación se documentan las fórmulas matemáticas implementadas en las herramientas interactivas del portal (`/herramientas` y `/mapa`), para que el equipo técnico pueda comprender y calibrar los cálculos.

### 5.1 Algoritmo de Regiones Dinámicas (`getDynamicRegions` en `routes/index.js`)
El servidor agrupa las 27 propiedades por polo turístico y calcula en tiempo real:
* **Rango de Precios:** Extrae el valor mínimo (`minPrice`) y máximo (`maxPrice`) en la región y formatea la etiqueta comercial (ej. `"$185K - $340K USD"`).
* **Conteo de Proyectos:** Cantidad de proyectos disponibles en cada zona geográfica.

### 5.2 Modelo Matemático de Cálculo de Rentabilidad (ROI)
El retorno de inversión proyectado en el portal se calcula mediante la fórmula de rentabilidad neta (Cap Rate):

$$\text{ROI Anual (\%)} = \frac{(\text{Tarifa Noche} \times 365 \times \text{Ocupación \%}) - \text{Gastos Operativos (18\%)}}{\text{Precio Total de la Propiedad}} \times 100$$

* **Ocupación Promedio Estimada:** 65% a 75% en zonas turísticas de Punta Cana y Cap Cana.
* **Gastos Operativos Estándar:** 18% (Mantenimiento, administración de propiedad, servicios básicos y limpieza).

### 5.3 Modelo de Ahorro Fiscal por Ley CONFOTUR 158-01
El simulador de beneficios fiscales calcula el ahorro total para el inversionista según la legislación dominicana:

$$\text{Ahorro Impuesto Transferencia (3\%)} = \text{Precio de Compra} \times 0.03$$

$$\text{Ahorro IPI Anual (1\% por 15 años)} = (\text{Precio de Compra} \times 0.01) \times 15$$

$$\text{Ahorro Total CONFOTUR} = \text{Ahorro Transferencia} + \text{Ahorro IPI a 15 Años}$$

* *Ejemplo:* Para una propiedad de **$200,000 USD**, el inversionista ahorra **$6,000 USD** de transferencia inicial y **$30,000 USD** de IPI durante 15 años, totalizando **$36,000 USD** de exención fiscal garantizada.

### 5.4 Simulador Hipotecario BanReservas en USD (Fórmula de Amortización Francesa)
La cuota mensual estimada en dólares se calcula mediante el sistema de cuota fija:

$$M = P \frac{r(1+r)^n}{(1+r)^n - 1}$$

* $M$: Cuota mensual estimada en USD.
* $P$: Monto del préstamo (Precio de propiedad menos inicial del 20% o 30%).
* $r$: Tasa de interés mensual ($\text{Tasa Anual} / 12$).
* $n$: Número total de cuotas mensuales ($\text{Años} \times 12$).

---

## 6. SUITE CRM ADMINISTRATIVA & GESTIÓN COMERCIAL 360°

El panel de control administrativo (`/admin`) centraliza la gestión comercial y operativa:

* **Dashboard Ejecutivo (`/admin`):** Conteo de leads captados en el día, acumulado histórico, propiedades activas y publicaciones del blog.
* **Tablero Kanban Interactivo (`/admin/leads`):** Visualización en columnas de etapas de venta con soporte Drag & Drop en tiempo real.
* **Ficha 360° del Inversionista (`/admin/leads/:id`):** Historial cronológico de interacciones, gestión de compromisos con alertas y botón de **Impresión A4 en 1 sola página** para comités comerciales.
* **Editor de Catálogo (`/admin/propiedades`):** Modificación de especificaciones, amenidades, precios y alternador de visibilidad pública.
* **Editor de Blog (`/admin/blog`):** Publicación de artículos de análisis inmobiliario con campos SEO optimizados.
* **Consola NPI (`/admin/npi`):** Segmentación y empaquetado en lotes ZIP de 150 contactos para importación directa en herramientas de Email Marketing.

---

## 7. CONTROL DE ACCESO AL REPOSITORIO DE GITHUB Y POLÍTICA DE EVOLUCIÓN

### 7.1 Repositorio Privado Oficial
* **URL:** `https://github.com/rony1030/ciasa-rd-portal.git`
* **Rama Principal:** `main`
* **Estado:** **Privado**.

### 7.2 Gestión de Nuevos Colaboradores Técnicos
El acceso al código fuente se encuentra restringido para proteger los activos de software de CIASA. Actualmente cuentan con acceso habilitado el **Sr. Pedro** y la dirección técnica.  
Si cualquier otro desarrollador, ingeniero o personal técnico de la empresa necesita acceso para auditar, clonar o colaborar:
1. La directiva o el interesado debe suministrar su **dirección de correo electrónico** vinculada a GitHub a **Rony Bello** (Desarrollo & Programación Web).
2. Se le enviará inmediatamente la invitación oficial como colaborador con permisos completos.

### 7.3 Propiedad Intelectual y Política de Nuevas Funcionalidades
* **Propiedad 100% Exclusiva:** Cada línea de código, arquitectura, base de datos, API y recurso gráfico pertenece íntegramente a **CIASA Bolsa Inmobiliaria**.
* **Solicitud de Nuevas Funcionalidades:** Si la directiva o el equipo técnico desea incorporar nuevas pasarelas de pago, cotizadores avanzados, conexiones a CRMs externos (HubSpot, Salesforce, Zoho) o ajustar flujos comerciales, pueden solicitarlo directamente.
* **Transparencia en Tiempos de Desarrollo:** Todo nuevo requerimiento se planificará de forma abierta y transparente, entregando una estimación de tiempo y alcance técnico acorde a la complejidad solicitada.

---

## 8. MARCO DE CONTROL DE CAMBIOS POR FASES (AUDITORÍA TÉCNICA)

Este manual se actualizará formalmente al término de cada fase de desarrollo, registrando el diff arquitectónico detallado:

### 8.1 Matriz de Cambios de la Fase 1 (Culminada en Desarrollo)

| Categoría | Archivos / Módulos Afectados | Descripción Técnica del Cambio |
| :--- | :--- | :--- |
| **CREADO** | `server.js`, `routes/index.js`, `routes/admin.js` | Arquitectura MVC en Node.js, Clean URLs, sistema de plantillas EJS y suite administrativa completa. |
| **CREADO** | `services/emailService.js`, `services/emailTemplates.js` | Motor de despacho transaccional SMTP y 5 plantillas HTML responsivas. |
| **CREADO** | `_materiales_y_estrategia/datos/leads.json` | Base de datos estructurada para prospectos con bitácora, tareas y KYC. |
| **CREADO** | `_materiales_y_estrategia/datos/email_logs.json` | Bitácora de auditoría histórica de correos despachados por el sistema. |
| **CREADO** | `_materiales_y_estrategia/diagramas/*.png` | 5 diagramas de alta resolución (Leads, Arquitectura, i18n, NPI y Kanban). |
| **MODIFICADO** | `views/layouts/header.ejs`, `views/layouts/footer.ejs` | Erradicación total de emojis, iconografía SVG vectorial, cabeceras de seguridad y optimización móvil. |
| **MODIFICADO** | `sitio-web/js/curated_npi_data.js` | Indexación de dataset curado para soporte de resiliencia local en el motor NPI. |
| **TOCADO** | `_materiales_y_estrategia/datos/propiedades.json` | Validación y homologación de las 27 propiedades activas con Ley CONFOTUR. |
| **TOCADO** | `_materiales_y_estrategia/datos/blog.json` | Estructuración de artículos y análisis de mercado para el editor administrativo. |
| **ELIMINADO** | Scripts legacy sin mantenimiento y emojis informales en el código fuente. | Depuración de dependencias obsoletas y limpieza general de la estructura. |

---

## 9. FIRMAS DE CONFORMIDAD Y VALIDACIÓN TÉCNICA

<br/><br/>

__________________________________________  
**Rony Bello**  
Desarrollo & Programación Web  
CIASA Bolsa Inmobiliaria RD  

<br/><br/>

__________________________________________  
**Paola Caram Ibarra**  
Directora Comercial & Ejecutiva  
CIASA Bolsa Inmobiliaria RD  

---
*CIASA Bolsa Inmobiliaria RD — Manual Técnico de Arquitectura, APIs y Guía de Desarrollo.*
