# CIASA RD — Sitio Web · Paquete de Entrega (Handoff técnico)

Este paquete contiene el **sitio web estático** de CIASA RD junto con sus datos y
recursos gráficos, listo para ser alojado en cualquier servidor web. No requiere
base de datos, servidor de aplicaciones, ni servicios externos.

---

## 1. Contenido del paquete

```
entregable/
├── index.html                  ← Documento de entrega (ábralo en el navegador)
├── README-tecnico.md           ← Este archivo
├── sitio-web/                  ← Sitio web estático completo
├── datos/                      ← Exportaciones de datos (CSV / JSON)
├── imagenes-fuente/            ← Imágenes en alta resolución (originales)
├── social-media/              ← Calendario de contenidos, posts, historias y reels
│   ├── calendario-y-posts.html ← Calendario de contenidos (ábralo en el navegador)
│   ├── posts.json              ← Publicaciones en formato de datos
│   └── assets/clients/ciasard/ ← Imágenes y videos (incl. reels/ con 8 reels MP4)
└── estrategia-de-contenidos/   ← Estrategia de Contenidos (HTML + Markdown)
```

## 2. Cómo publicar el sitio

El sitio es 100% estático (HTML/CSS/JS). Opciones:

- **Hosting estático**: suba el contenido de `sitio-web/` a cualquier proveedor
  (Netlify, Vercel, GitHub Pages, Cloudflare Pages, Amazon S3, o un hosting cPanel
  tradicional). La raíz del sitio es `sitio-web/index.html`.
- **Prueba local**:
  ```bash
  cd sitio-web
  python3 -m http.server 8080
  # luego abra http://localhost:8080
  ```

> Las rutas internas son **relativas**, por lo que el sitio funciona tanto en la
> raíz de un dominio como dentro de un subdirectorio
> (p. ej. `midominio.com/sitio/`) e incluso abriendo los archivos directamente
> desde el disco. No es necesario configurar la raíz del dominio.

## 3. Qué incluye el sitio

- Página principal, Proyectos (listado + 27 fichas de proyecto), Mapa,
  Guía de Inversión, Wizard de Inversión, Calculadoras, Artículos, FAQ,
  Servicios, Nosotros, Contacto.
- Buscador interno (Pagefind) — funciona sin conexión, índice ya generado.
- Galería de artes promocionales (`/artes/`) — página no enlazada en el menú.
- Presentación de estrategia (`/estrategia/`) — página no enlazada en el menú.
- Soporte multiidioma (ES / EN / FR) ya incorporado.

El **listado de proyectos** y las **fichas** se renderizan desde el catálogo
incluido en `sitio-web/js/projects-data.js` (no requieren base de datos).

## 4. Formularios de contacto

Como el sitio no tiene servidor, los formularios (contacto, interés en proyecto,
wizard) **abren el correo del visitante** con los datos prellenados, dirigidos a:

```
paola.caram@ciasard.org.do
```

Para cambiar el destinatario, edite `LEAD_NOTIFICATION_EMAIL` al inicio de
`sitio-web/js/lead-form.js`.

**Para recibir los formularios automáticamente** (en una hoja de cálculo, correo
o CRM propio), reemplace el cuerpo de la función `submitLead()` en ese mismo
archivo por una llamada `fetch()` a su propio servicio de formularios
(p. ej. Formspree, Netlify Forms, Google Forms, o la API de su CRM).

## 5. Datos exportados (`datos/`)

- `propiedades.csv` — catálogo de las 27 propiedades (formato hoja de cálculo,
  compatible con Excel, codificación UTF-8).
- `propiedades.json` — el mismo catálogo en JSON, con todos los campos.
- *(si se incluyen)* `leads.csv` / `contactos.csv` — registros de contactos y
  leads del sitio.

## 6. Imágenes en alta resolución (`imagenes-fuente/`)

- `proyectos-alta-resolucion/` — PNG originales en alta resolución de los
  proyectos. Las versiones optimizadas (JPEG) ya están dentro del sitio en
  `sitio-web/assets/images/projects/`.
- Los artes promocionales y códigos QR están dentro del sitio en
  `sitio-web/assets/images/flyers/` y `sitio-web/assets/images/qr/`.

## 7. Qué NO se incluye (y por qué)

Las siguientes piezas eran **servicios operados por el proveedor** sobre su propia
infraestructura y no forman parte del sitio web entregable:

- Panel CRM / administración (gestión de leads, usuarios, emails, etc.).
- Funciones de servidor (Cloud Functions), envío automático de correos, y
  asistente de IA (chat). El asistente de IA fue retirado del sitio entregado.
- Claves de API, contraseñas, credenciales o accesos a bases de datos o
  infraestructura (son recursos propietarios del proveedor).
- Sistemas internos de atribución/seguimiento de campañas y analítica.

## 8. Créditos / tecnología

HTML/CSS/JS sin framework · Mapas con Leaflet · Buscador con Pagefind ·
Tipografía Inter (Google Fonts).
