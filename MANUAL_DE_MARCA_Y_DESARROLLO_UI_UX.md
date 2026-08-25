# MANUAL OFICIAL DE MARCA, IDENTIDAD VISUAL Y GUÍA DE DISEÑO UI/UX
## CIASA Bolsa Inmobiliaria RD · Sistema de Diseño para Marketing, Programación y Piezas Gráficas

---

### 1. Filosofía de Marca y Posicionamiento Estratégico

**CIASA Bolsa Inmobiliaria** es el ecosistema de referencia para la inversión inmobiliaria de alta plusvalía en República Dominicana, dirigido a inversionistas privados, fondos patrimoniales y la comunidad de dominicanos y extranjeros en EE.UU.

* **Personalidad de Marca:**
  * **Institucional y Sólida:** Transmite la seguridad de un banco de inversión y la transparencia jurídica del mercado inmobiliario dominicano.
  * **Estratégica y Rentable:** Enfoque cuantitativo en ROI, plusvalía, régimen fiscal Ley CONFOTUR 158-01 y rentas cortas (Airbnb Friendly).
  * **Moderna y Accesible:** Interfaz tecnológica de vanguardia, limpia, sin fricción visual ni saturación de elementos.
* **Tono de Voz:**
  * Ejecutivo, asertivo, sofisticado, transparente y cercano. Se evitan modismos informales o lenguaje publicitario exagerado.

---

### 2. Lemas Oficiales, Taglines y Claims de Campaña

Los diseñadores, redactores y desarrolladores deben aplicar estos lemas según el contexto de la pieza:

| Tipo de Lema | Texto Oficial | Contexto de Uso |
| :--- | :--- | :--- |
| **Lema Principal (Brand Slogan)** | **"LA RUTA A CASA"** | Logotipo principal, encabezados institucionales, dossiers y firmas de correo. |
| **Tagline Web / Hero** | *"Tu portal de inversión inmobiliaria de alta plusvalía en República Dominicana."* | Hero de la web, portada de presentaciones y encabezados de landing pages. |
| **Claim de Seguridad & Confianza** | *"Seguridad jurídica, exención fiscal CONFOTUR y acompañamiento patrimonial 360°."* | Fichas técnicas, folletos para inversionistas y campañas de prospección. |
| **Claim Internacional / Diáspora** | *"Conectando la comunidad internacional con las mejores oportunidades del Caribe."* | Módulo NPI, campañas en EE.UU., webinars y eventos internacionales. |
| **Call to Action (CTA) Primario** | **"Descubrir Oportunidades"** / **"Consultar Asesoría Privada"** | Botones principales de acción, formularios y flyers de proyectos. |

---

### 3. Sistema Cromático Oficial (Tokens de Marketing y UI/UX)

La paleta de CIASA RD utiliza la regla armónica **60-30-10** (60% Fondo neutro, 30% Navy/Texto institucional, 10% Azul eléctrico/Verde acento).

```text
  [ Navy Institucional ]     [ Azul Royal ]       [ Azul Acento ]      [ Verde ROI ]
       #1B3A5C                  #2563EB               #5B9BD5             #7DB33A
  RGB(27, 58, 92)         RGB(37, 99, 235)      RGB(91, 155, 213)   RGB(125, 179, 58)
```

| Rol del Color | HEX | RGB | CMYK | Variable CSS | Aplicación en Diseño & Web |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **Navy Institucional** | `#1B3A5C` | `27, 58, 92` | `71, 37, 0, 64` | `--color-navy` | Barras de navegación, pie corporativo, portadas de dossier y titulares institucionales. |
| **Azul Royal Primario** | `#2563EB` | `37, 99, 235` | `84, 58, 0, 8` | `--color-blue-primary` | Botones de acción principal (CTA), estados hover activos, enlaces destacados. |
| **Azul Acento / Cielo** | `#5B9BD5` | `91, 155, 213` | `57, 27, 0, 16` | `--color-blue-accent` | Subtítulos, líneas de división elegantes, bordes de selección y badges de status. |
| **Verde Crecimiento** | `#7DB33A` | `125, 179, 58` | `30, 0, 68, 30` | `--color-green-roi` | Métricas de ROI, insignias CONFOTUR 158-01, porcentajes de ahorro y éxito. |
| **Superficie / Off-White** | `#F8FAFC` | `248, 250, 252` | `2, 1, 0, 1` | `--color-bg-light` | Fondo principal de la web, paneles de lectura ejecutiva, contenedores de tarjetas. |
| **Texto Titular Carbón** | `#1E293B` | `30, 41, 59` | `49, 31, 0, 77` | `--color-text-main` | Títulos de artículos, especificaciones numéricas y textos de alta jerarquía. |
| **Texto Secundario** | `#64748B` | `100, 116, 139` | `28, 16, 0, 45` | `--color-text-muted` | Párrafos descriptivos, metadatos, fechas, notas al pie y tooltips. |
| **Borde Estructural** | `#E2E8F0` | `226, 232, 240` | `6, 3, 0, 6` | `--color-border` | Bordes de tarjetas (1px solid), divisores horizontales y recuadros de formulario. |
| **Blanco Puro** | `#FFFFFF` | `255, 255, 255` | `0, 0, 0, 0` | `--color-white` | Fondo de modales, tarjetas elevadas (cards) y texto sobre fondos oscuros. |

---

### 4. Sistema Tipográfico y Jerarquía de Texto

#### Tipografías Oficiales:
* **Títulos y Display de Lujo:** `Outfit` / `Playfair Display` (Uso en portadas, héroes y titulares de marketing).
* **Cuerpo de Texto y Datos:** `Inter` / `system-ui`, `-apple-system`, `sans-serif` (Uso en contenido web, CRM, tablas y descripciones).

#### Escala Tipográfica Exacta:

| Nivel / Rol | Tamaño Web | Tamaño Print (PDF) | Peso (Weight) | Interlineado (Leading) | Tracking / Espaciado |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **H1 — Hero / Titular Principal** | `40px` (2.5rem) | `22pt` | `Bold (700)` | `1.15` (46px) | `-0.02em` (Apretado) |
| **H2 — Título de Sección / Dossier** | `30px` (1.875rem) | `16pt` | `SemiBold (600)` | `1.25` (36px) | `-0.01em` |
| **H3 — Módulos / Tarjetas** | `20px` (1.25rem) | `12pt` | `SemiBold (600)` | `1.35` (26px) | `Normal` |
| **Tagline / Lema en Caja Alta** | `16px` (1.0rem) | `10pt` | `Medium (500)` | `1.4` (22px) | `+0.12em` (+2px espaciado) |
| **Cuerpo de Texto (Párrafos)** | `16px` (1.0rem) | `9.5pt` | `Regular (400)` | `1.6` (24px) | `Normal` |
| **Descripciones / Ficha Técnica** | `14px` (0.875rem) | `8.5pt` | `Regular (400)` | `1.45` (20px) | `Normal` |
| **Micro-copy / Badges / Legal** | `12px` (0.75rem) | `7.5pt` | `Medium (500)` | `1.3` (16px) | `+0.05em` |

---

### 5. Reglas de Diseño Gráfico, UI/UX y Marketing

1. **Iconografía Institucional:**
   - Se prohíbe terminantemente el uso de emojis en interfaces, documentos PDF y piezas formales.
   - Usar exclusivamente **iconos vectoriales SVG lineales** (grosor de trazo `1.75px` o `2px`, terminaciones redondeadas `stroke-linecap="round"`).
2. **Tratamiento Fotográfico:**
   - Fotografías de proyectos con luz natural caribeña, encuadres arquitectónicos rectos y colores vivos pero equilibrados.
   - En web y PDFs, las imágenes deben tener esquinas redondeadas (`rounded-lg` / `8px` o `12px`) y una sombra sutil de elevación.
3. **Botones y Componentes CTA:**
   - **Botón Primario:** Fondo `#2563EB`, texto `#FFFFFF`, esquinas redondeadas (8px), padding `12px 24px`. Hover: `#1D4ED8` con transición fluida `0.2s ease`.
   - **Botón Secundario / Outline:** Fondo transparente, borde 1.5px `#1B3A5C`, texto `#1B3A5C`. Hover: fondo `#F1F5F9`.
   - **Badge CONFOTUR / ROI:** Fondo `#7DB33A` al 15% de opacidad, borde 1px `#7DB33A`, texto verde oscuro `#2E6010`, peso `600`.
4. **Formatos para Redes Sociales y Marketing Digital:**
   - **Feed Instagram/LinkedIn:** `1080 x 1080 px` (1:1) o `1080 x 1350 px` (4:5 vertical).
   - **Stories / Reels:** `1080 x 1920 px` (9:16 vertical con márgenes de seguridad superior e inferior de 250px).
   - **Banners Web / Presentaciones:** `1920 x 1080 px` (16:9).

---

### 6. Estándares para Documentos y PDFs para Inversionistas

* **Regla de 1 Sola Hoja (Single-Page Impact):** Fichas de leads, resúmenes de proyectos y actas deben diagramarse estrictamente en 1 página A4/Carta para evitar desbordes visuales.
* **Cabecera y Pie Institucional:**
  - Línea superior delgada `#E2E8F0`, nombre institucional y lema "LA RUTA A CASA".
  - Pie de página con numeración "Página X de Y", aviso de confidencialidad y datos de contacto de CIASA RD.
