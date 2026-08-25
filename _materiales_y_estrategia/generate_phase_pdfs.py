import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# Canvas para numeración de páginas profesional
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
            self.drawString(54, 750, "CIASA Bolsa Inmobiliaria RD · Documentación Ejecutiva Oficial")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 742, 612 - 54, 742)

        # Footer (Todas las páginas)
        page_str = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(612 - 54, 36, page_str)
        self.drawString(54, 36, "Documento Confidencial · Rony Bello — Desarrollo & Dirección Técnica CIASA RD")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 48, 612 - 54, 48)
        
        self.restoreState()

def get_styles():
    styles = getSampleStyleSheet()
    
    PRIMARY = colors.HexColor("#0A1E36")    # CIASA Navy
    SECONDARY = colors.HexColor("#7DB33A")  # CIASA Green
    TEXT_DARK = colors.HexColor("#0F172A")
    TEXT_MUTED = colors.HexColor("#475569")
    
    styles.add(ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=PRIMARY,
        spaceAfter=4
    ))
    
    styles.add(ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=SECONDARY,
        spaceAfter=14
    ))
    
    styles.add(ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        'SubSectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=PRIMARY,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=TEXT_DARK,
        spaceAfter=6
    ))

    styles.add(ParagraphStyle(
        'BodyMuted',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=TEXT_MUTED,
        spaceAfter=5
    ))

    styles.add(ParagraphStyle(
        'CalloutBox',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12.5,
        textColor=PRIMARY,
        spaceAfter=8
    ))

    styles.add(ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=PRIMARY
    ))

    styles.add(ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=TEXT_DARK
    ))

    styles.add(ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=PRIMARY
    ))

    return styles

def build_pdf_fase1(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    styles = get_styles()
    story = []

    # Title & Subtitle
    story.append(Paragraph("RESUMEN EJECUTIVO Y ACTA DE ENTREGA TÉCNICA — FASE 1", styles['DocTitle']))
    story.append(Paragraph("Ecosistema Digital CIASA RD · Portal Web, Suite CRM Administrativa y Motor NPI", styles['DocSubtitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0A1E36"), spaceBefore=2, spaceAfter=10))

    # Ficha Técnica Table
    ficha_data = [
        [Paragraph("A la atención de:", styles['TableHeader']), Paragraph("Paola Caram Ibarra (Directora Comercial & Ejecutiva CIASA RD)", styles['TableCell'])],
        [Paragraph("De:", styles['TableHeader']), Paragraph("Rony Bello (Desarrollo & Dirección Técnica)", styles['TableCell'])],
        [Paragraph("Proyecto:", styles['TableHeader']), Paragraph("Ecosistema Digital CIASA RD (Portal Inmobiliario + CRM + Motor NPI)", styles['TableCell'])],
        [Paragraph("Fase:", styles['TableHeader']), Paragraph("<b>Fase 1: Saneamiento, Arquitectura Node.js, Suite CRM y Motor NPI</b>", styles['TableCell'])],
        [Paragraph("Fecha del Documento:", styles['TableHeader']), Paragraph("21 de Agosto de 2026", styles['TableCell'])],
        [Paragraph("Estado Operativo:", styles['TableHeader']), Paragraph("<b>En Proceso de Pruebas Activas & Validación Final de Despliegue</b>", styles['TableCellBold'])],
        [Paragraph("Nota de Cierre:", styles['TableHeader']), Paragraph("Código 100% desarrollado y probado en entorno staging; actualmente en proceso de validación en vivo mientras se completa la configuración y propagación del dominio en el hosting.", styles['TableCell'])],
        [Paragraph("Infraestructura:", styles['TableHeader']), Paragraph("Node.js Express (Clean URLs) + Hostinger Cloud / MySQL", styles['TableCell'])],
        [Paragraph("Repositorio GitHub:", styles['TableHeader']), Paragraph("https://github.com/rony1030/ciasa-realestate.git (Rama main)", styles['TableCell'])]
    ]
    t_ficha = Table(ficha_data, colWidths=[120, 384])
    t_ficha.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_ficha)
    story.append(Spacer(1, 10))

    # Section 1
    story.append(Paragraph("1. Resumen Ejecutivo de la Fase 1", styles['SectionHeading']))
    story.append(Paragraph("La <b>Fase 1</b> del proyecto CIASA RD ha alcanzado su culminación técnica en desarrollo, transformando la estructura estática previa en una <b>aplicación web moderna y robusta en Node.js</b>, integrando una <b>Suite Administrativa CRM completa</b>, un <b>Motor de Segmentación y Exportación en Lotes para Email Marketing (NPI)</b>, y un <b>diseño visual ejecutivo 100% corporativo</b> adaptado a computadoras, tablets y teléfonos móviles.", styles['BodyDark']))
    story.append(Paragraph("<i><b>Nota de Despliegue:</b> El sistema se encuentra en su fase de pruebas de aceptación y homologación final, listo para el enrutamiento definitivo una vez completada la configuración de DNS y dominio principal en la infraestructura de Hostinger.</i>", styles['CalloutBox']))

    # Section 2
    story.append(Paragraph("2. Matriz de Logros y Entregables Culminados (Fase 1)", styles['SectionHeading']))
    
    story.append(Paragraph("2.1. Arquitectura de Backend & Seguridad (Node.js)", styles['SubSectionHeading']))
    story.append(Paragraph("• <b>Clean URLs Canónicas:</b> Todas las rutas operan sin extensiones .html (/proyectos, /articulos, /admin).<br/>• <b>Streaming de Video HTTP 206:</b> Reproductor nativo en Hero con Partial Content y controles interactivos (Play/Pause y Mute/Unmute).<br/>• <b>Seguridad de Servidor:</b> Cabeceras HTTP activas (nosniff, SAMEORIGIN, strict-origin-when-cross-origin).<br/>• <b>Control de Acceso Seguro:</b> Login web personalizado (/admin/login) con cookies HTTPOnly y cierre de sesión seguro.", styles['BodyDark']))

    story.append(Paragraph("2.2. Suite Administrativa CRM (/admin)", styles['SubSectionHeading']))
    story.append(Paragraph("• <b>Dashboard Ejecutivo:</b> Métricas en tiempo real de leads captados, proyectos disponibles, artículos publicados y conversión.<br/>• <b>Ficha 360° del Inversionista:</b> Bitácora cronológica, gestor de tareas con alertas, carpeta digital KYC y ficha imprimible A4 en 1 sola página.<br/>• <b>Catálogo & Editor de Propiedades:</b> Creación modular, galería multimedia de fotos y creador dinámico de amenidades.<br/>• <b>Editor de Blog WYSIWYG:</b> Tipografía calibrada y bloques de llamada a la acción (CTA) con botones interactivos.", styles['BodyDark']))

    story.append(Paragraph("2.3. Módulo de Marketing & Segmentación NPI (Integrado en el CRM)", styles['SubSectionHeading']))
    story.append(Paragraph("• <b>Consola NPI Integrada (/admin/npi):</b> Filtrado de médicos por Estado, Especialidad y Patrimonio con exportación en lotes ZIP de 150 contactos para plataformas de Email Marketing.<br/>• <b>Cero Emojis:</b> Erradicación total de emojis en favor de tipografía corporativa e iconografía vectorial SVG oficial.", styles['BodyDark']))

    # Section 3
    story.append(Paragraph("3. Estado de Infraestructura & Próximo Paso de Dominio", styles['SectionHeading']))
    estado_data = [
        [Paragraph("Código Fuente", styles['TableHeader']), Paragraph("100% Completado y Sincronizado en GitHub (main)", styles['TableCell'])],
        [Paragraph("Suite CRM & BD", styles['TableHeader']), Paragraph("Totalmente funcional con autenticación y sesiones seguras", styles['TableCell'])],
        [Paragraph("Pruebas Staging", styles['TableHeader']), Paragraph("Activas y validadas en entorno local y servidor", styles['TableCell'])],
        [Paragraph("Dominio en Hosting", styles['TableHeader']), Paragraph("<b>En proceso de configuración y vinculación final de DNS</b>", styles['TableCellBold'])]
    ]
    t_estado = Table(estado_data, colWidths=[120, 384])
    t_estado.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#FFFFFF")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_estado)
    story.append(Spacer(1, 15))

    # Firmas
    story.append(Paragraph("4. Firmas de Conformidad (En Proceso de Validación Final)", styles['SectionHeading']))
    story.append(Spacer(1, 20))
    
    firmas_data = [
        [Paragraph("__________________________________________<br/><b>Rony Bello</b><br/>Desarrollo & Dirección Técnica", styles['TableCell']),
         Paragraph("__________________________________________<br/><b>Paola Caram Ibarra</b><br/>Directora Comercial & Ejecutiva CIASA RD", styles['TableCell'])]
    ]
    t_firmas = Table(firmas_data, colWidths=[250, 254])
    t_firmas.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(t_firmas)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF Fase 1 generado exitosamente: {filename}")

def build_pdf_fase2(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    styles = get_styles()
    story = []

    # Title & Subtitle
    story.append(Paragraph("DOCUMENTO DE ALCANCE Y PLAN DE TRABAJO — FASE 2", styles['DocTitle']))
    story.append(Paragraph("Proyecto CIASA RD · Automatización de Leads, API Webhooks, Campañas de Email Marketing y Analítica", styles['DocSubtitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0A1E36"), spaceBefore=2, spaceAfter=10))

    # Ficha Técnica Table
    ficha_data = [
        [Paragraph("A la atención de:", styles['TableHeader']), Paragraph("Paola Caram Ibarra (Directora Comercial & Ejecutiva)", styles['TableCell'])],
        [Paragraph("De:", styles['TableHeader']), Paragraph("Rony Bello (Desarrollo & Dirección Técnica)", styles['TableCell'])],
        [Paragraph("Proyecto:", styles['TableHeader']), Paragraph("Ecosistema Digital CIASA RD", styles['TableCell'])],
        [Paragraph("Fase:", styles['TableHeader']), Paragraph("<b>Fase 2: Automatización de Leads, API Webhooks, Email Marketing y Analítica</b>", styles['TableCell'])],
        [Paragraph("Fecha de Inicio:", styles['TableHeader']), Paragraph("1 de Septiembre de 2026", styles['TableCell'])],
        [Paragraph("Duración Estimada:", styles['TableHeader']), Paragraph("<b>8 a 10 semanas (Cronograma de ritmo pausado y validación exhaustiva)</b>", styles['TableCellBold'])],
        [Paragraph("Condición Financiera:", styles['TableHeader']), Paragraph("Respaldado por la Iguala Mensual Fija de Desarrollo (RD$ 10,000.00 DOP)", styles['TableCell'])]
    ]
    t_ficha = Table(ficha_data, colWidths=[120, 384])
    t_ficha.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_ficha)
    story.append(Spacer(1, 10))

    # Section 1
    story.append(Paragraph("1. Resumen Ejecutivo y Objetivos de la Fase 2", styles['SectionHeading']))
    story.append(Paragraph("Con la <b>Fase 1 culminada en desarrollo y en proceso de validación final de dominio</b>, la <b>Fase 2</b> abordará la automatización comercial profunda y la escalabilidad digital sobre la infraestructura del hosting en Hostinger. Debido a la naturaleza de las integraciones con APIs externas (Webhooks, servicios de mensajería, servidores de correo y algoritmos de indexación de Google), <b>esta fase se ejecutará con un cronograma extendido y controlado (8 a 10 semanas)</b>, garantizando que cada flujo se pruebe rigurosamente con casos reales antes de su pase a producción.", styles['BodyDark']))

    # Section 2: Timeline Table
    story.append(Paragraph("2. Matriz de Entregables, Acciones y Cronograma Detallado (Fase 2)", styles['SectionHeading']))
    
    tasks_data = [
        [Paragraph("Código", styles['TableHeader']), Paragraph("Módulo Técnico", styles['TableHeader']), Paragraph("Acciones Específicas", styles['TableHeader']), Paragraph("Tiempo Est.", styles['TableHeader']), Paragraph("Fechas Estimadas", styles['TableHeader'])],
        [
            Paragraph("<b>T-05</b>", styles['TableCellBold']),
            Paragraph("<b>Automatización de Leads & Webhooks API</b>", styles['TableCell']),
            Paragraph("• Endpoints Node.js para formularios web y Wizard.<br/>• Disparadores de emails de confirmación.<br/>• Pruebas de estrés y prevención de spam/duplicados.", styles['TableCell']),
            Paragraph("2 a 3 semanas", styles['TableCell']),
            Paragraph("1 al 20 Sept 2026", styles['TableCell'])
        ],
        [
            Paragraph("<b>T-06</b>", styles['TableCellBold']),
            Paragraph("<b>Integración Campañas Email Marketing</b>", styles['TableCell']),
            Paragraph("• Secuencias de nutrición (Nurture sequence de 3 emails).<br/>• Plantillas HTML corporativas para envío de dossiers.<br/>• Sincronización de apertura, clics y prospectos.", styles['TableCell']),
            Paragraph("2 semanas", styles['TableCell']),
            Paragraph("21 Sept al 4 Oct 2026", styles['TableCell'])
        ],
        [
            Paragraph("<b>T-07</b>", styles['TableCellBold']),
            Paragraph("<b>SEO Internacional & Proyectos</b>", styles['TableCell']),
            Paragraph("• Sitemap XML dinámico de proyectos y blog.<br/>• Schema.org (RealEstateListing).<br/>• Verificación Google Search Console USA.", styles['TableCell']),
            Paragraph("2 semanas", styles['TableCell']),
            Paragraph("5 al 18 Oct 2026", styles['TableCell'])
        ],
        [
            Paragraph("<b>T-08</b>", styles['TableCellBold']),
            Paragraph("<b>Simulador Hipotecario BanReservas USD</b>", styles['TableCell']),
            Paragraph("• Lógica de amortización en dólares.<br/>• Tablas de ahorro fiscal CONFOTUR 158-01.<br/>• Sliders interactivos en /herramientas.", styles['TableCell']),
            Paragraph("1 a 2 semanas", styles['TableCell']),
            Paragraph("19 Oct al 1 Nov 2026", styles['TableCell'])
        ],
        [
            Paragraph("<b>T-09</b>", styles['TableCellBold']),
            Paragraph("<b>Backups Automáticos & Auditoría Final</b>", styles['TableCell']),
            Paragraph("• Respaldos periódicos de bases de datos JSON.<br/>• Auditoría de velocidad y certificados SSL.<br/>• Reporte de Logros y Cierre Fase 2.", styles['TableCell']),
            Paragraph("1 semana", styles['TableCell']),
            Paragraph("2 al 8 Nov 2026", styles['TableCell'])
        ]
    ]
    t_tasks = Table(tasks_data, colWidths=[35, 110, 195, 74, 90])
    t_tasks.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#F8FAFC")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_tasks)
    story.append(Spacer(1, 10))

    # Section 3 & 4
    story.append(Paragraph("3. Metodología de Ejecución Gradual & Respaldo", styles['SectionHeading']))
    story.append(Paragraph("• <b>Desarrollo por Bloques:</b> Cada módulo se desarrollará y validará en un entorno aislado de pruebas antes de su pase a producción.<br/>• <b>Revisión y Homologación Comercial:</b> Paola Caram y el equipo comercial validarán cada flujo de email y lead.<br/>• <b>Condición Financiera:</b> Cubierto bajo la iguala mensual acordada de <b>RD$ 10,000.00 DOP</b> (Facturación día 30).", styles['BodyDark']))

    story.append(Spacer(1, 15))
    story.append(Paragraph("4. Firmas de Conformidad", styles['SectionHeading']))
    story.append(Spacer(1, 20))
    
    firmas_data = [
        [Paragraph("__________________________________________<br/><b>Rony Bello</b><br/>Desarrollo & Dirección Técnica", styles['TableCell']),
         Paragraph("__________________________________________<br/><b>Paola Caram Ibarra</b><br/>Directora Comercial & Ejecutiva CIASA RD", styles['TableCell'])]
    ]
    t_firmas = Table(firmas_data, colWidths=[250, 254])
    t_firmas.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(t_firmas)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF Fase 2 generado exitosamente: {filename}")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    downloads_dir = os.path.join(os.path.expanduser('~'), 'Downloads')
    
    # Generate in project folder
    pdf1_proj = os.path.join(base_dir, 'RESUMEN_EJECUTIVO_ENTREGA_FASE1.pdf')
    pdf2_proj = os.path.join(base_dir, 'Documento_de_Alcance_Fase_2.pdf')
    
    # Generate in Downloads folder for easy access
    pdf1_down = os.path.join(downloads_dir, 'RESUMEN_EJECUTIVO_ENTREGA_FASE1.pdf')
    pdf2_down = os.path.join(downloads_dir, 'Documento_de_Alcance_Fase_2.pdf')
    
    build_pdf_fase1(pdf1_proj)
    build_pdf_fase1(pdf1_down)
    
    build_pdf_fase2(pdf2_proj)
    build_pdf_fase2(pdf2_down)
    
    print("--- Todos los PDFs ejecutivos han sido generados exitosamente ---")
