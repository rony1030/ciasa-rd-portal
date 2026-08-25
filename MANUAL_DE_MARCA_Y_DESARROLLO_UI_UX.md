# MANUAL DE MARCA Y GUÍA DE ESTILO TÉCNICO UI/UX
## Ecosistema Digital CIASA RD · Estándares de Programación, Diseño y Generación de Documentos

---

### 1. Introducción y Propósito
Este manual define las directrices oficiales de **identidad visual, arquitectura frontend, estándares de interfaz de usuario (UI/UX), redacción técnica y lineamientos para documentos PDF** en todo el software desarrollado para **CIASA Bolsa Inmobiliaria RD**.

Su objetivo es asegurar consistencia matemática y estética en el código, evitando discrepancias de color, tipografía desalineada, componentes improvisados o sobrecarga visual.

---

### 2. Paleta Cromática Institucional y Tokens CSS

Los desarrolladores y diseñadores deben utilizar exclusivamente las siguientes variables y códigos HEX:

| Rol / Token | Código HEX | Variable CSS | Uso Exclusivo |
| :--- | :---: | :--- | :--- |
| **Navy Institucional** | `#1B3A5C` | `--color-navy` | Encabezados principales, barras de navegación, footer corporativo. |
| **Azul Primario** | `#2563EB` | `--color-blue-primary` | Botones de acción principal (CTA), estados activos, enlaces clave. |
| **Azul Acento / Cielo** | `#5B9BD5` | `--color-blue-accent` | Subtítulos, badges informativos, bordes de selección. |
| **Verde Crecimiento** | `#7DB33A` | `--color-green-roi` | Métricas de rentabilidad, badges CONFOTUR, indicadores positivos. |
| **Superficie Neutra** | `#F8FAFC` | `--color-bg-light` | Fondo principal de la web, paneles de lectura, tablas limpias. |
| **Texto Titular** | `#1E293B` | `--color-text-main` | Títulos, textos de alta jerarquía y datos tabulares. |
| **Texto Secundario** | `#64748B` | `--color-text-muted` | Metadatos, fechas, descripciones secundarias y tooltips. |
| **Borde / Separador** | `#E2E8F0` | `--color-border` | Divisores de tarjetas, líneas de tabla y recuadros de input. |
| **Blanco Puro** | `#FFFFFF` | `--color-white` | Fondos de tarjetas elevadas, modales y botones secundarios. |

---

### 3. Tipografía y Jerarquía Visual

```css
/* Pila Tipográfica Recomendada */
--font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-heading: 'Outfit', 'Inter', sans-serif;
```

#### Escala Tipográfica Estándar:
* **H1 (Hero Title):** `2.5rem` (40px) | `font-weight: 700` | `line-height: 1.15`
* **H2 (Sección Principal):** `1.875rem` (30px) | `font-weight: 600` | `line-height: 1.25`
* **H3 (Tarjetas y Módulos):** `1.25rem` (20px) | `font-weight: 600` | `line-height: 1.35`
* **Cuerpo de Texto:** `1.0rem` (16px) | `font-weight: 400` | `line-height: 1.6`
* **Notas / Subtextos:** `0.875rem` (14px) | `font-weight: 400` | `color: var(--color-text-muted)`

---

### 4. Reglas Estrictas de Frontend & Programación

1. **Cero Emojis en el Interfaz:**
   - Queda terminantemente prohibido el uso de emojis en títulos, botones, modales o notificaciones.
   - En su lugar, utilizar exclusivamente **iconos vectoriales SVG optimizados** (20x20px o 24x24px) con `stroke="currentColor"`.
2. **Botones y Estados Interactivos:**
   - **Botón Primario:** Fondo `#2563EB`, texto blanco `#FFFFFF`, esquinas redondeadas `rounded-lg` (8px), padding `12px 24px`, hover suave con transición `all 0.2s ease`.
   - **Botón Secundario / Outline:** Fondo transparente, borde 1px `#E2E8F0`, texto `#1E293B`, hover `#F1F5F9`.
3. **Clean URLs Obligatorias:**
   - No se permiten enlaces con extensión `.html` en vistas EJS o menús de navegación (`/nosotros`, no `/nosotros.html`).
4. **Streaming de Video HTTP 206:**
   - Todo video corporativo en background o hero debe servirse con soporte de rangos parciales para reproducción instantánea en móviles sin bloquear el hilo de red.

---

### 5. Estándares para Generación de Documentos y PDFs (A4 / Carta)

Para la emisión de Fichas de Leads, Dossiers de Proyectos y Reportes de Auditoría:

1. **Regla de 1 Sola Página (Single Page Layout):**
   - Las fichas de leads y resúmenes ejecutivos deben diagramarse para caber estrictamente en 1 página A4/Carta sin desbordar pie de página.
2. **Encabezado y Pie Institucional:**
   - Encabezado con línea superior delgada en `#E2E8F0`, título corporativo en mayúsculas a 8pt y lema "LA RUTA A CASA".
   - Pie de página con numeración "Página X de Y", confidencialidad y marca de agua sutil.
3. **Tablas de Datos:**
   - Encabezados de tabla con fondo `#1B3A5C` y texto blanco, o fondo `#F8FAFC` con borde inferior `#E2E8F0`.
   - Filas alternadas con fondo blanco y `#FAFAFA` para máxima legibilidad.

---

### 6. Control de Versiones y Gobernanza
* **Versión del Manual:** 2.0 (Edición Programación y Arquitectura)
* **Fecha de Emisión:** Agosto 2026
* **Aprobación:** Dirección Técnica (Rony Bello) & Dirección Comercial CIASA RD (Paola Caram)
