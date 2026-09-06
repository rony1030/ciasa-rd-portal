import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable, Image as RLImage
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (Página 2 en adelante)
        if self._pageNumber > 1:
            self.drawString(45, 752, "CIASA Bolsa Inmobiliaria RD · Manual Técnico de Arquitectura, APIs & Desarrollo")
            self.drawRightString(612 - 45, 752, "Versión 2.0.0 (Producción)")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(45, 744, 612 - 45, 744)

        # Footer (Todas las páginas)
        page_str = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(612 - 45, 32, page_str)
        self.drawString(45, 32, "Documento Técnico Confidencial · Rony Bello — Desarrollo & Programación Web")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(45, 42, 612 - 45, 42)
        
        self.restoreState()

def get_styles():
    styles = getSampleStyleSheet()
    
    PRIMARY = colors.HexColor("#0A1E36")    # CIASA Navy
    SECONDARY = colors.HexColor("#7DB33A")  # CIASA Green
    ACCENT = colors.HexColor("#2563EB")     # CIASA Blue
    TEXT_DARK = colors.HexColor("#0F172A")
    TEXT_MUTED = colors.HexColor("#475569")
    
    styles.add(ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=PRIMARY,
        spaceAfter=2
    ))
    
    styles.add(ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13.5,
        textColor=SECONDARY,
        spaceAfter=8
    ))
    
    styles.add(ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=PRIMARY,
        spaceBefore=9,
        spaceAfter=4,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        'SubSectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12.5,
        textColor=ACCENT,
        spaceBefore=6,
        spaceAfter=2.5,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=11,
        textColor=TEXT_DARK,
        spaceAfter=4.5
    ))

    styles.add(ParagraphStyle(
        'BodyMuted',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.2,
        leading=10,
        textColor=TEXT_MUTED,
        spaceAfter=3.5
    ))

    styles.add(ParagraphStyle(
        'CalloutBox',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=7.5,
        leading=11,
        textColor=PRIMARY,
        spaceAfter=5
    ))

    styles.add(ParagraphStyle(
        'CodeBlock',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=6.8,
        leading=9,
        textColor=colors.HexColor("#1E293B")
    ))

    styles.add(ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.2,
        leading=9.2,
        textColor=PRIMARY
    ))

    styles.add(ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.2,
        leading=9.8,
        textColor=TEXT_DARK
    ))

    styles.add(ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.2,
        leading=9.8,
        textColor=PRIMARY
    ))

    return styles

def build_comprehensive_pdf(filename):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    diag_dir = os.path.join(base_dir, "diagramas")

    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=45,
        rightMargin=45,
        topMargin=45,
        bottomMargin=45
    )
    styles = get_styles()
    story = []

    # Title & Subtitle
    story.append(Paragraph("MANUAL TÉCNICO DE ARQUITECTURA, APIS Y GUÍA DE DESARROLLO", styles['DocTitle']))
    story.append(Paragraph("Ecosistema Digital CIASA RD · Portal Inmobiliario, Suite CRM Administrativa y Motor NPI", styles['DocSubtitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0A1E36"), spaceBefore=2, spaceAfter=8))

    # Ficha Técnica Table
    ficha_data = [
        [Paragraph("A la atención de:", styles['TableHeader']), Paragraph("Equipo Técnico, Desarrolladores y Directiva de CIASA Bolsa Inmobiliaria (Paola Caram & Sr. Pedro)", styles['TableCell'])],
        [Paragraph("De:", styles['TableHeader']), Paragraph("<b>Rony Bello</b> (Desarrollo & Programación Web)", styles['TableCellBold'])],
        [Paragraph("Proyecto:", styles['TableHeader']), Paragraph("Ecosistema Digital CIASA RD (Portal Inmobiliario + Suite CRM + Motor NPI)", styles['TableCell'])],
        [Paragraph("Versión / Entorno:", styles['TableHeader']), Paragraph("<b>Versión 2.0.0 (Producción) — Node.js MVC + Capa Híbrida JSON / MySQL</b>", styles['TableCellBold'])],
        [Paragraph("Repositorio GitHub:", styles['TableHeader']), Paragraph("<b>https://github.com/rony1030/ciasa-rd-portal.git</b> (Privado)", styles['TableCellBold'])],
        [Paragraph("Control de Accesos:", styles['TableHeader']), Paragraph("Habilitado para el <b>Sr. Pedro</b> y dirección técnica. Para incorporar otros desarrolladores, proporcionar su correo para invitación inmediata.", styles['TableCell'])],
        [Paragraph("Declaración de Propiedad:", styles['TableHeader']), Paragraph("<b>100% Propiedad Exclusiva de CIASA Bolsa Inmobiliaria</b> (Código, APIs, Bases de Datos y Módulos).", styles['TableCellBold'])],
        [Paragraph("Política de Evolución:", styles['TableHeader']), Paragraph("Arquitectura modular y abierta. Nuevas funciones o cambios de APIs se coordinan bajo estimaciones realistas de tiempo y alcance técnico.", styles['TableCell'])],
        [Paragraph("Marco de Mantenimiento:", styles['TableHeader']), Paragraph("Actualización continua al cierre de cada fase técnica, registrando lo creado, modificado, tocado y eliminado.", styles['TableCell'])]
    ]
    t_ficha = Table(ficha_data, colWidths=[115, 407])
    t_ficha.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_ficha)
    story.append(Spacer(1, 6))

    # Section 1: Arquitectura de Software
    story.append(Paragraph("1. Arquitectura de Software y Patrones de Diseño (Deep Dive)", styles['SectionHeading']))
    story.append(Paragraph("El ecosistema digital opera bajo el patrón <b>Modelo-Vista-Controlador (MVC)</b> en <b>Node.js (v18+) con Express</b>. Cada petición HTTP atraviesa un pipeline de middlewares que inyecta cabeceras de seguridad (<font name='Courier'>nosniff</font>, <font name='Courier'>SAMEORIGIN</font>, <font name='Courier'>Referrer-Policy</font>), parsea cuerpos JSON y URL-encoded, e inyecta dinámicamente en <font name='Courier'>res.locals</font> los datos de contacto corporativos desde <font name='Courier'>perfil.json</font> y <font name='Courier'>ajustes.json</font> sin sobrecarga de base de datos.", styles['BodyDark']))
    
    diag2_path = os.path.join(diag_dir, "diagrama_2_arquitectura_global.png")
    if os.path.exists(diag2_path):
        story.append(RLImage(diag2_path, width=520, height=265))
        story.append(Spacer(1, 6))

    # Section 2: Flujo de Leads
    story.append(Paragraph("2. Protocolo Integral de Formularios, Notificaciones y Captura de Leads", styles['SectionHeading']))
    story.append(Paragraph("Cuando un inversionista envía un formulario en el portal (Contacto, Ficha de Proyecto, Wizard de Inversión o Cotizador), se desencadena una secuencia automatizada en tiempo real:<br/>"
                           "1. <b>Recepción y Validación (<font name='Courier'>POST /api/leads</font>):</b> Sanitiza entradas, previene duplicados y genera un identificador único con timestamp.<br/>"
                           "2. <b>Persistencia Atómica:</b> Inserta la entidad al inicio de <font name='Courier'>_materiales_y_estrategia/datos/leads.json</font> con estado <font name='Courier'>statusVentas = 'nuevo'</font>.<br/>"
                           "3. <b>Doble Despacho SMTP Transaccional:</b> Envía correo de confirmación con el Dossier oficial al cliente y correo de alerta inmediata a la dirección comercial (<font name='Courier'>paola.caram@ciasard.org.do</font>).<br/>"
                           "4. <b>Gestión CRM 360°:</b> Publica el prospecto en el Tablero Kanban, crea tarea de seguimiento con fecha límite de 24 horas y habilita el canal de <b>WhatsApp Corporativo</b> para atención humana 1 a 1 sin intermediación de bots.", styles['BodyDark']))

    diag1_path = os.path.join(diag_dir, "diagrama_1_flujo_leads.png")
    if os.path.exists(diag1_path):
        story.append(RLImage(diag1_path, width=520, height=265))
        story.append(Spacer(1, 6))

    # Section 3: Diagnóstico de Traducciones
    story.append(Paragraph("3. Diagnóstico Exhaustivo y Plan de Reparación del Sistema Multiidioma (ES / EN / FR)", styles['SectionHeading']))
    story.append(Paragraph("<b>Nota de Transparencia Técnica:</b> El selector de idiomas (ES / EN / FR) y el diccionario centralizado <font name='Courier'>sitio-web/js/i18n.js</font> (1,500+ líneas) existen en el proyecto; sin embargo, <b>actualmente se encuentran desacoplados de las vistas dinámicas de Node.js / EJS y no traducen el contenido en el portal en vivo</b>. Este módulo debe ser reparado y sincronizado de forma prioritaria previo al lanzamiento internacional.", styles['CalloutBox']))

    diag3_path = os.path.join(diag_dir, "diagrama_3_sistema_traducciones.png")
    if os.path.exists(diag3_path):
        story.append(RLImage(diag3_path, width=520, height=265))
        story.append(Spacer(1, 6))

    story.append(Paragraph("<b>Hoja de Ruta de Sincronización (1 a 2 semanas):</b><br/>"
                           "• <b>Paso 1:</b> Etiquetar todas las vistas EJS con atributos <font name='Courier'>data-i18n</font> en elementos generados por servidor.<br/>"
                           "• <b>Paso 2:</b> Sincronizar el diccionario <font name='Courier'>i18n.js</font> para abarcar las 27 propiedades, amenidades y calculadoras.<br/>"
                           "• <b>Paso 3:</b> Implementar middleware en Express para detección de idioma por cookie y cabeceras HTTP.", styles['BodyDark']))
    story.append(Spacer(1, 6))

    # Section 4: APIs
    story.append(Paragraph("4. Especificación Técnica Profunda de Todas las APIs y Guía de Modificación", styles['SectionHeading']))
    story.append(Paragraph("El equipo técnico de CIASA puede consultar a continuación la especificación de cada endpoint sin necesidad de auditar el código fuente archivo por archivo:", styles['BodyDark']))
    
    apis_data = [
        [Paragraph("Endpoint", styles['TableHeader']), Paragraph("Método", styles['TableHeader']), Paragraph("Archivo / Controlador", styles['TableHeader']), Paragraph("Lógica Interna, Parámetros y Guía de Modificación de Código", styles['TableHeader'])],
        [
            Paragraph("<b>/api/leads</b>", styles['TableCellBold']),
            Paragraph("POST", styles['TableCell']),
            Paragraph("routes/index.js (L:298)", styles['TableCell']),
            Paragraph("Recibe <font name='Courier'>nombre, email, telefono, pais, ciudad, estado, montoInversion, region, proyectoInteres, razones, mensaje, source</font>. Valida y sanitiza inputs, crea registro en <font name='Courier'>leads.json</font>, genera tarea a 24h y dispara <font name='Courier'>sendLeadEmails()</font>. Para añadir campos, desestructurarlos de <font name='Courier'>req.body</font> en L:307 e insertarlos en <font name='Courier'>newLead</font>.", styles['TableCell'])
        ],
        [
            Paragraph("<b>/api/proyectos</b>", styles['TableCellBold']),
            Paragraph("GET", styles['TableCell']),
            Paragraph("routes/index.js (L:293)", styles['TableCell']),
            Paragraph("Devuelve el catálogo de 27 propiedades en JSON leyendo <font name='Courier'>propiedades.json</font>. Para filtrar solo proyectos activos, aplicar <font name='Courier'>.filter(p =&gt; p.available !== false)</font> en L:294.", styles['TableCell'])
        ],
        [
            Paragraph("<b>/api/npi/search</b>", styles['TableCellBold']),
            Paragraph("GET", styles['TableCell']),
            Paragraph("server.js (L:92)", styles['TableCell']),
            Paragraph("Motor de búsqueda médica en EE.UU. Parámetros: <font name='Courier'>state, specialty, quintile, latino_only, has_phone, has_email, has_social, q, page, limit</font>. Consulta dinámica en MySQL con <font name='Courier'>LIMIT/OFFSET</font> y fallback automático en 5 ms a <font name='Courier'>curated_npi_data.js</font>.", styles['TableCell'])
        ],
        [
            Paragraph("<b>/api/npi/states</b>", styles['TableCellBold']),
            Paragraph("GET", styles['TableCell']),
            Paragraph("server.js (L:95)", styles['TableCell']),
            Paragraph("Agregación analítica por estado de EE.UU. Ejecuta <font name='Courier'>SELECT state, COUNT(*), SUM(is_latino) FROM npi_providers GROUP BY state</font> con fallback resiliente.", styles['TableCell'])
        ],
        [
            Paragraph("<b>/api/npi/sync_socials</b>", styles['TableCellBold']),
            Paragraph("POST", styles['TableCell']),
            Paragraph("server.js (L:247)", styles['TableCell']),
            Paragraph("Sincronización masiva de redes y correos. Aplica <font name='Courier'>UPDATE npi_providers SET col = COALESCE(NULLIF(?, ''), col) WHERE npi = ?</font> y actualiza simultáneamente el archivo de caché local.", styles['TableCell'])
        ],
        [
            Paragraph("<b>/admin/leads/:id/status-ajax</b>", styles['TableCellBold']),
            Paragraph("POST", styles['TableCell']),
            Paragraph("routes/admin.js (L:231)", styles['TableCell']),
            Paragraph("API AJAX para Tablero Kanban. Actualiza <font name='Courier'>statusVentas</font> de forma atómica en <font name='Courier'>leads.json</font> al arrastrar tarjetas (Drag & Drop) sin recarga.", styles['TableCell'])
        ],
        [
            Paragraph("<b>/admin/marketing/send</b>", styles['TableCellBold']),
            Paragraph("POST", styles['TableCell']),
            Paragraph("routes/admin.js (L:732)", styles['TableCell']),
            Paragraph("Despacha plantillas HTML conectadas a SMTP (<font name='Courier'>bienvenida_dossier, confotur, roi, zoom</font>), registra en la bitácora del lead y en <font name='Courier'>email_logs.json</font>.", styles['TableCell'])
        ],
        [
            Paragraph("<b>/videos/:filename</b>", styles['TableCellBold']),
            Paragraph("GET", styles['TableCell']),
            Paragraph("server.js (L:332)", styles['TableCell']),
            Paragraph("Streaming multimedia con cabeceras <font name='Courier'>HTTP 206 Partial Content</font> (Range Requests) para salto instantáneo en videos MP4 sin descarga total.", styles['TableCell'])
        ]
    ]
    t_apis = Table(apis_data, colWidths=[90, 35, 80, 317])
    t_apis.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#E2E8F0")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_apis)
    story.append(Spacer(1, 6))

    diag4_path = os.path.join(diag_dir, "diagrama_4_motor_npi.png")
    if os.path.exists(diag4_path):
        story.append(RLImage(diag4_path, width=520, height=265))
        story.append(Spacer(1, 6))

    # Section 5: Modelos Matemáticos y Algoritmos
    story.append(Paragraph("5. Modelos Matemáticos y Algoritmos Implementados en el Portal", styles['SectionHeading']))
    story.append(Paragraph("• <b>Algoritmo de Regiones Dinámicas (<font name='Courier'>getDynamicRegions</font>):</b> Agrupa propiedades por polo turístico, extrayendo en tiempo real el precio mínimo, precio máximo y retorno promedio.<br/>"
                           "• <b>Modelo de Retorno de Inversión (ROI / Cap Rate):</b> <font name='Courier'>ROI = [ (Tarifa Noche x 365 x Ocupación 70%) - Gastos Operativos (18%) ] / Precio Total x 100</font>.<br/>"
                           "• <b>Modelo de Ahorro Fiscal Ley CONFOTUR 158-01:</b> <font name='Courier'>Ahorro Total = (Precio x 3% Transferencia) + [ (Precio x 1% IPI Anual) x 15 Años ]</font>.<br/>"
                           "• <b>Simulador Hipotecario BanReservas USD (Fórmula Francesa):</b> <font name='Courier'>M = P * [ r*(1+r)^n ] / [ (1+r)^n - 1 ]</font>, donde <font name='Courier'>P</font> es capital financiado, <font name='Courier'>r</font> tasa mensual y <font name='Courier'>n</font> total de cuotas.", styles['BodyDark']))
    story.append(Spacer(1, 6))

    # Section 6: Suite CRM Administrativa
    story.append(Paragraph("6. Suite CRM Administrativa, Pipeline Kanban y Gestión Comercial 360°", styles['SectionHeading']))
    story.append(Paragraph("El panel administrativo (<font name='Courier'>/admin</font>) centraliza la gestión comercial: Dashboard de conversión en tiempo real, Tablero Kanban con etapas (<font name='Courier'>nuevo</font>, <font name='Courier'>contactado</font>, <font name='Courier'>calificado</font>, <font name='Courier'>en_negociacion</font>, <font name='Courier'>cerrado</font>), gestor de tareas con alertas a 24 horas y <b>Ficha Ejecutiva Imprimible A4 en 1 sola página</b>.", styles['BodyDark']))

    diag5_path = os.path.join(diag_dir, "diagrama_5_pipeline_crm_kanban.png")
    if os.path.exists(diag5_path):
        story.append(RLImage(diag5_path, width=520, height=265))
        story.append(Spacer(1, 6))

    # Section 7: GitHub y Propiedad
    story.append(Paragraph("7. Control de Acceso al Repositorio de GitHub y Política de Evolución", styles['SectionHeading']))
    story.append(Paragraph("• <b>Repositorio Privado:</b> <font name='Courier'>https://github.com/rony1030/ciasa-rd-portal.git</font><br/>"
                           "• <b>Gestión de Colaboradores Técnicos:</b> El acceso está habilitado para el <b>Sr. Pedro</b> y la dirección técnica. Para incorporar otros desarrolladores de CIASA, suministrar su correo electrónico a Rony Bello para cursar la invitación oficial de inmediato.<br/>"
                           "• <b>Propiedad Exclusiva 100% CIASA:</b> Todo el código, APIs, bases de datos y módulos pertenecen a <b>CIASA Bolsa Inmobiliaria</b>.<br/>"
                           "• <b>Evolución Transparente y Nuevas Funcionalidades:</b> Si el equipo técnico o directivo desea modificar una API, agregar nuevas pasarelas o integrar CRMs externos (HubSpot, Salesforce), se coordinará de forma abierta y transparente bajo estimaciones realistas de tiempo según la complejidad técnica.", styles['BodyDark']))
    story.append(Spacer(1, 6))

    # Section 8: Marco de Cambios por Fases
    story.append(Paragraph("8. Marco de Control de Cambios por Fases (Auditoría Técnica — Fase 1)", styles['SectionHeading']))
    
    diff_data = [
        [Paragraph("Categoría", styles['TableHeader']), Paragraph("Módulos / Archivos Afectados", styles['TableHeader']), Paragraph("Detalle del Cambio Técnico", styles['TableHeader'])],
        [Paragraph("<b>CREADO</b>", styles['TableCellBold']), Paragraph("server.js, routes/index.js, routes/admin.js", styles['TableCell']), Paragraph("Arquitectura MVC en Node.js, Clean URLs, motor EJS y suite CRM administrativa.", styles['TableCell'])],
        [Paragraph("<b>CREADO</b>", styles['TableCellBold']), Paragraph("services/emailService.js, services/emailTemplates.js", styles['TableCell']), Paragraph("Motor transaccional SMTP y 5 plantillas HTML responsivas para nutrición comercial.", styles['TableCell'])],
        [Paragraph("<b>CREADO</b>", styles['TableCellBold']), Paragraph("_materiales_y_estrategia/datos/leads.json", styles['TableCell']), Paragraph("Base de datos estructurada con bitácora, gestor de tareas y carpeta KYC.", styles['TableCell'])],
        [Paragraph("<b>CREADO</b>", styles['TableCellBold']), Paragraph("_materiales_y_estrategia/diagramas/*.png", styles['TableCell']), Paragraph("5 diagramas arquitectónicos y de flujo en alta resolución corporativa.", styles['TableCell'])],
        [Paragraph("<b>MODIFICADO</b>", styles['TableCellBold']), Paragraph("views/layouts/header.ejs, views/layouts/footer.ejs", styles['TableCell']), Paragraph("Erradicación de emojis informales, iconografía SVG vectorial y cabeceras de seguridad.", styles['TableCell'])],
        [Paragraph("<b>MODIFICADO</b>", styles['TableCellBold']), Paragraph("sitio-web/js/curated_npi_data.js", styles['TableCell']), Paragraph("Indexación de dataset curado para resiliencia dual en el motor de búsqueda NPI.", styles['TableCell'])],
        [Paragraph("<b>TOCADO</b>", styles['TableCellBold']), Paragraph("_materiales_y_estrategia/datos/propiedades.json", styles['TableCell']), Paragraph("Validación y homologación de 27 propiedades activas con Ley CONFOTUR 158-01.", styles['TableCell'])],
        [Paragraph("<b>ELIMINADO</b>", styles['TableCellBold']), Paragraph("Scripts legacy y emojis decorativos en código", styles['TableCell']), Paragraph("Depuración de dependencias obsoletas y saneamiento general de la estructura.", styles['TableCell'])]
    ]
    t_diff = Table(diff_data, colWidths=[65, 175, 282])
    t_diff.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#E2E8F0")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_diff)
    story.append(Spacer(1, 10))

    # Section 9: Firmas
    story.append(Paragraph("9. Firmas de Conformidad y Validación Técnica", styles['SectionHeading']))
    story.append(Spacer(1, 15))
    
    firmas_data = [
        [Paragraph("__________________________________________<br/><b>Rony Bello</b><br/>Desarrollo & Programación Web<br/>CIASA Bolsa Inmobiliaria RD", styles['TableCell']),
         Paragraph("__________________________________________<br/><b>Paola Caram Ibarra</b><br/>Directora Comercial & Ejecutiva<br/>CIASA Bolsa Inmobiliaria RD", styles['TableCell'])]
    ]
    t_firmas = Table(firmas_data, colWidths=[260, 262])
    t_firmas.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_firmas)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF generado exitosamente en: {filename}")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(base_dir)
    downloads_dir = os.path.join(os.path.expanduser('~'), 'Downloads')
    
    pdf_root = os.path.join(root_dir, "MANUAL_TECNICO_DE_ARQUITECTURA_Y_APIS.pdf")
    pdf_mat = os.path.join(base_dir, "MANUAL_TECNICO_DE_ARQUITECTURA_Y_APIS.pdf")
    pdf_down = os.path.join(downloads_dir, "MANUAL_TECNICO_DE_ARQUITECTURA_Y_APIS.pdf")
    
    build_comprehensive_pdf(pdf_root)
    build_comprehensive_pdf(pdf_mat)
    try:
        build_comprehensive_pdf(pdf_down)
    except Exception as e:
        print("Downloads folder notice:", e)
