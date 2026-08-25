import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# Define NumberedCanvas for professional header/footer with Page X of Y
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
        
        # Header (Only on page 2 and later)
        if self._pageNumber > 1:
            self.drawString(54, 750, "Proyecto CIASA RD | Propuesta Técnica & Documentación de Servicio")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(54, 742, 612 - 54, 742)

        # Footer (All pages)
        page_str = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(612 - 54, 36, page_str)
        self.drawString(54, 36, "Documento Técnico Confidencial - Rony Bello | Desarrollo & Gestión Técnica CIASA RD")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 48, 612 - 54, 48)
        
        self.restoreState()

def get_custom_styles():
    styles = getSampleStyleSheet()
    
    # Primary Palette
    PRIMARY = colors.HexColor("#0F172A")    # Dark slate / Navy
    SECONDARY = colors.HexColor("#1E3A8A")  # Corporate blue
    ACCENT = colors.HexColor("#2563EB")     # Bright accent blue
    TEXT_DARK = colors.HexColor("#334155")  # Charcoal text
    
    # Custom styles
    styles.add(ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=19,
        leading=23,
        textColor=PRIMARY,
        spaceAfter=4
    ))
    
    styles.add(ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=ACCENT,
        spaceAfter=12
    ))

    styles.add(ParagraphStyle(
        'MetaHeader',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#475569")
    ))

    styles.add(ParagraphStyle(
        'MetaHeaderBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=PRIMARY
    ))

    styles.add(ParagraphStyle(
        'SectionHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12.5,
        leading=16,
        textColor=SECONDARY,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.2,
        leading=13.5,
        textColor=TEXT_DARK,
        spaceAfter=7
    ))

    styles.add(ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.2,
        leading=13.5,
        textColor=TEXT_DARK,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    ))

    styles.add(ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1E293B")
    ))

    styles.add(ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=0
    ))

    styles.add(ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=11.5,
        textColor=TEXT_DARK
    ))

    styles.add(ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.2,
        leading=11.5,
        textColor=PRIMARY
    ))

    return styles

def build_pdf_1_propuesta(filename, styles):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    story = []

    # Title & Header
    story.append(Paragraph("PROPUESTA TÉCNICA Y DE GESTIÓN PROYECTO CIASA RD", styles['DocTitle']))
    story.append(Paragraph("Servicio de Desarrollo, Gestión Profesional y Estabilización Digital", styles['DocSubtitle']))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#2563EB"), spaceAfter=10))

    # Metadata Card Table
    meta_data = [
        [
            Paragraph("<b>A la atención de:</b> Paola Caram Ibarra", styles['MetaHeader']),
            Paragraph("<b>De:</b> Rony Bello (Desarrollo & Gestión Técnica)", styles['MetaHeader'])
        ],
        [
            Paragraph("<b>Fecha:</b> 12 de Agosto de 2026", styles['MetaHeader']),
            Paragraph("<b>Condición Financiera:</b> Iguala Mensual Fija (RD$ 10,000.00 DOP)", styles['MetaHeaderBold'])
        ],
        [
            Paragraph("<b>Inicio de Servicio:</b> 30 de Agosto de 2026", styles['MetaHeader']),
            Paragraph("<b>Alcance del Servicio:</b> Proyecto CIASA RD (Ecosistema Digital + CRM + Hosting)", styles['MetaHeader'])
        ]
    ]
    t_meta = Table(meta_data, colWidths=[250, 254])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#F1F5F9")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # Introducción
    story.append(Paragraph("1. Introducción y Contexto del Proyecto", styles['SectionHeader']))
    story.append(Paragraph(
        "Estimada Paola,<br/><br/>"
        "En seguimiento a nuestras conversaciones y formalizando la aprobación de la iguala mensual de <b>RD$ 10,000.00 DOP</b> "
        "(a iniciar el <b>30 de agosto de 2026</b>), presento esta propuesta técnica actualizada que contempla la gestión integral del <b>Proyecto CIASA RD</b>.",
        styles['BodyCustom']
    ))
    story.append(Paragraph(
        "Esta iguala mensual no responde al simple alquiler o mantenimiento de páginas web individuales, sino al <b>soporte, desarrollo profesional y dirección técnica "
        "continua de todo el ecosistema digital del proyecto CIASA RD</b>. Esto incluye la intervención directa del código fuente heredado para corregir errores, "
        "la creación de nuevas herramientas operativas, la integración con el sistema CRM propietario, la migración y alojamiento en infraestructura de hosting propia (Hostinger), "
        "y cualquier eventualidad técnica del proyecto (como actualizaciones de marca, cambio de logotipo, nombre o nuevos requerimientos digitales).",
        styles['BodyCustom']
    ))

    # Alcance
    story.append(Paragraph("2. Alcance del Trabajo y Cobertura Técnica", styles['SectionHeader']))
    story.append(Paragraph(
        "La mensualidad fija de RD$ 10,000.00 DOP abarca los siguientes aspectos técnicos y profesionales para el Proyecto CIASA RD:",
        styles['BodyCustom']
    ))

    bullets = [
        "<b>Corrección y Reestructuración de Código Tercerizado:</b> Saneamiento profundo, diagnóstico y reparación de errores técnicos, visuales y de rendimiento en los desarrollos entregados previamente por terceros.",
        "<b>Desarrollo de Herramientas y Módulos a Medida:</b> Creación de nuevas funciones, formularios interactivos, módulos específicos y adaptaciones técnicas requeridas por la operación del proyecto.",
        "<b>Gestión de Identidad Digital y Branding:</b> Implementación de cambios técnicos referentes a la marca CIASA RD (actualización de logotipos, tipografías, cambio de nombre o ajustes visuales corporativos).",
        "<b>Conexión e Integración con Sistema CRM:</b> Vinculación continua entre las plataformas de captación web y el sistema CRM propietario desarrollado para la gestión de prospectos.",
        "<b>Alojamiento en Servidor Propio (Hostinger) y Seguridad:</b> Migración y despliegue en servidor Hostinger administrado, gestión de certificados SSL (HTTPS), configuración de DNS y copias de seguridad (backups) periódicas.",
        "<b>Soporte Técnico y Mantenimiento Preventivo:</b> Monitoreo de disponibilidad, resolución ágil de incidencias y asistencia técnica continua."
    ]
    for b in bullets:
        story.append(Paragraph(f"• {b}", styles['BulletCustom']))
    
    story.append(Spacer(1, 6))

    # Metodología por Fases
    story.append(Paragraph("3. Metodología de Trabajo por Fases Documentadas", styles['SectionHeader']))
    story.append(Paragraph(
        "Para mantener total visibilidad y control sobre las entregas, el plan de trabajo se estructura mediante <b>Fases de Desarrollo y Estabilización</b> con tiempos específicos por cada entregable:",
        styles['BodyCustom']
    ))

    bullets_fases = [
        "<b>Documento de Alcance por Fase:</b> Al inicio de cada etapa se define formalmente un documento especificando los entregables técnicos, módulos a intervenir y el desglose de tiempo para cada tarea.",
        "<b>Tiempos Estimados por Tarea y Fase:</b> Cada tarea cuenta con su tiempo estimado de ejecución (generalmente de 1 a 2 semanas por hito, totalizando de 3 a 5 semanas por fase) garantizando avances constantes y medibles.",
        "<b>Despliegue y Hospedaje en Hostinger:</b> Al culminar cada ciclo de desarrollo, la versión final estabilizada se publica directamente en la infraestructura de hosting gestionada en Hostinger.",
        "<b>Reporte de Logros e Informes de Avance:</b> Al finalizar o avanzar cada fase se presentará un reporte técnico detallado con las mejoras desplegadas, justificando el retorno de la inversión de la iguala mensual."
    ]
    for bf in bullets_fases:
        story.append(Paragraph(f"• {bf}", styles['BulletCustom']))

    story.append(Spacer(1, 6))

    # Inversión y Condiciones
    story.append(Paragraph("4. Inversión y Condiciones Comerciales", styles['SectionHeader']))
    
    condiciones_table_data = [
        [Paragraph("<b>Concepto de Servicio</b>", styles['TableHeader']), Paragraph("<b>Monto / Frecuencia</b>", styles['TableHeader'])],
        [
            Paragraph("<b>Iguala Mensual de Gestión Técnica y Desarrollo Proyecto CIASA RD</b><br/>(Cubre desarrollo, corrección de código, adaptaciones de marca, servidor Hostinger e integración CRM)", styles['TableCell']),
            Paragraph("<b>RD$ 10,000.00 DOP</b><br/>Mensual", styles['TableCellBold'])
        ],
        [
            Paragraph("<b>Fecha de Pago / Facturación:</b>", styles['TableCell']),
            Paragraph("Día 30 de cada mes (Iniciando el 30 de Agosto de 2026)", styles['TableCell'])
        ],
        [
            Paragraph("<b>Documentación de Respaldo:</b>", styles['TableCell']),
            Paragraph("Cada fase estará soportada por su Documento de Alcance con tiempos detallados y Reporte de Logros.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Propiedad Intelectual y Datos:</b>", styles['TableCell']),
            Paragraph("100% propiedad exclusiva de la empresa.", styles['TableCell'])
        ]
    ]
    t_cond = Table(condiciones_table_data, colWidths=[330, 174])
    t_cond.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E3A8A")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor("#F8FAFC")),
    ]))
    story.append(t_cond)
    story.append(Spacer(1, 10))

    # Cierre & Firmas
    story.append(Paragraph(
        "Quedo a su disposición para continuar con los trabajos y avances planificados para el proyecto.",
        styles['BodyCustom']
    ))
    story.append(Spacer(1, 16))

    firmas_data = [
        [
            Paragraph("__________________________________________<br/><b>Rony Bello</b><br/>Desarrollo y Gestión Técnica", styles['BodyCustom']),
            Paragraph("__________________________________________<br/><b>Paola Caram Ibarra</b><br/>Aprobado / Recepción Formal", styles['BodyCustom'])
        ]
    ]
    t_firmas = Table(firmas_data, colWidths=[250, 254])
    t_firmas.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(KeepTogether(t_firmas))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF 1 generado exitosamente: {filename}")


def build_pdf_2_alcance_fase_1(filename, styles):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    story = []

    # Title & Header
    story.append(Paragraph("DOCUMENTO DE ALCANCE Y PLAN DE TRABAJO", styles['DocTitle']))
    story.append(Paragraph("Fase 1: Diagnóstico Técnico, Integración CRM y Despliegue en Servidor Propio (Hostinger)", styles['DocSubtitle']))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#2563EB"), spaceAfter=10))

    # Meta
    meta_data = [
        [
            Paragraph("<b>Proyecto:</b> Gestión Técnica & Desarrollo CIASA RD", styles['MetaHeader']),
            Paragraph("<b>Fase de Trabajo:</b> Fase 1 (En Proceso / Avanzado)", styles['MetaHeaderBold'])
        ],
        [
            Paragraph("<b>Fecha de Inicio:</b> Agosto 2026", styles['MetaHeader']),
            Paragraph("<b>Tiempo Total Fase 1:</b> 3 a 5 semanas", styles['MetaHeaderBold'])
        ],
        [
            Paragraph("<b>Responsable Técnico:</b> Rony Bello", styles['MetaHeader']),
            Paragraph("<b>Destino de Alojamiento:</b> Servidor Propio en Hostinger", styles['MetaHeaderBold'])
        ]
    ]
    t_meta = Table(meta_data, colWidths=[250, 254])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#F1F5F9")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # Objetivos
    story.append(Paragraph("1. Objetivos de la Fase 1", styles['SectionHeader']))
    story.append(Paragraph(
        "Esta primera fase (con una duración estimada global de <b>3 a 5 semanas</b>) tiene como objetivo llevar a producción la infraestructura base del proyecto CIASA RD, "
        "corregir las inconsistencias críticas del código entregado por terceros e integrar los formularios de captación de clientes directamente con el sistema CRM. "
        "<b>Como hito culminante de la Fase 1, todo el sitio web y sus servicios asociados serán migrados y alojados definitivamente en mi infraestructura de servidor en Hostinger</b>, "
        "asegurando independencia tecnológica, velocidad óptima, certificado de seguridad SSL y copias de respaldo continuas.",
        styles['BodyCustom']
    ))

    # Plan de Trabajo (Tabla)
    story.append(Paragraph("2. Matriz de Entregables, Detalle de Tareas y Tiempos Estimados", styles['SectionHeader']))
    
    plan_data = [
        [
            Paragraph("<b>Código / Tarea</b>", styles['TableHeader']),
            Paragraph("<b>Detalle del Trabajo Técnico</b>", styles['TableHeader']),
            Paragraph("<b>Tiempo Estimado</b>", styles['TableHeader']),
            Paragraph("<b>Estado Actual</b>", styles['TableHeader'])
        ],
        [
            Paragraph("<b>T-01</b>", styles['TableCellBold']),
            Paragraph("<b>Auditoría y Corrección de Código Base:</b><br/>Depuración profunda de errores en scripts JavaScript heredados, limpieza de estilos y optimización del rendimiento de carga de páginas.", styles['TableCell']),
            Paragraph("<b>1 a 2 semanas</b><br/>(Semanas 1 y 2)", styles['TableCell']),
            Paragraph("<b>En Proceso / Avanzado</b><br/>(En estabilización)", styles['TableCell'])
        ],
        [
            Paragraph("<b>T-02</b>", styles['TableCellBold']),
            Paragraph("<b>Integración de Formularios con Sistema CRM:</b><br/>Conexión técnica de los formularios de contacto y wizards mediante Webhooks/APIs para envío automático y en tiempo real de leads al CRM.", styles['TableCell']),
            Paragraph("<b>1 a 2 semanas</b><br/>(Semanas 2 y 3)", styles['TableCell']),
            Paragraph("<b>En Proceso</b><br/>(Pruebas activas de flujo)", styles['TableCell'])
        ],
        [
            Paragraph("<b>T-03</b>", styles['TableCellBold']),
            Paragraph("<b>Ajustes de Marca, Diseño y Experiencia Móvil:</b><br/>Actualización visual de componentes para permitir cambios de logotipo/nombre institucional y optimización responsive en dispositivos móviles.", styles['TableCell']),
            Paragraph("<b>1 semana</b><br/>(Semanas 3 y 4)", styles['TableCell']),
            Paragraph("<b>En Proceso</b><br/>(Optimización UX/UI)", styles['TableCell'])
        ],
        [
            Paragraph("<b>T-04</b>", styles['TableCellBold']),
            Paragraph("<b>Migración y Puesta en Producción en Hostinger:</b><br/>Subida completa de todos los archivos y recursos del sitio web al servidor propio en <b>Hostinger</b>, configuración de DNS, instalación de certificado SSL (HTTPS) y verificación final al culminar la fase.", styles['TableCell']),
            Paragraph("<b>1 semana</b><br/>(Semanas 4 y 5)", styles['TableCellBold']),
            Paragraph("<b>En Preparación</b><br/>(Cierre de Fase 1)", styles['TableCellBold'])
        ]
    ]
    t_plan = Table(plan_data, colWidths=[45, 235, 105, 119])
    t_plan.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E3A8A")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(t_plan)
    story.append(Spacer(1, 10))

    # Criterios de Aceptación
    story.append(Paragraph("3. Criterios de Validación y Entrega de la Fase 1", styles['SectionHeader']))
    bullets_crit = [
        "<b>Alojamiento en Servidor Hostinger:</b> Todo el proyecto web estará subido y operando 100% en el hosting propio (Hostinger), con dominio activo y certificado de seguridad SSL.",
        "<b>Verificación de Flujo CRM:</b> Confirmación de la transmisión correcta de datos desde los formularios web hacia el CRM sin pérdida de prospectos.",
        "<b>Estabilidad y Código Saneado:</b> Funcionamiento continuo sin errores en consola, enlaces rotos ni lentitud de carga.",
        "<b>Adaptabilidad de Imagen:</b> Capacidad de actualizar rápidamente elementos visuales, logos o datos de marca de CIASA RD."
    ]
    for bc in bullets_crit:
        story.append(Paragraph(f"• {bc}", styles['BulletCustom']))

    story.append(Spacer(1, 12))

    # Firmas
    firmas_data = [
        [
            Paragraph("__________________________________________<br/><b>Rony Bello</b><br/>Desarrollo y Gestión Técnica", styles['BodyCustom']),
            Paragraph("__________________________________________<br/><b>Paola Caram Ibarra</b><br/>Aprobación de Alcance Fase 1", styles['BodyCustom'])
        ]
    ]
    t_firmas = Table(firmas_data, colWidths=[250, 254])
    t_firmas.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(KeepTogether(t_firmas))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF 2 generado exitosamente: {filename}")


def build_pdf_3_reporte_logros_fase_1(filename, styles):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    story = []

    # Title & Header
    story.append(Paragraph("REPORTE DE AVANCE Y LOGROS TÉCNICOS", styles['DocTitle']))
    story.append(Paragraph("Informe de Avance y Entregables en Producción – Fase 1", styles['DocSubtitle']))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#2563EB"), spaceAfter=10))

    # Meta
    meta_data = [
        [
            Paragraph("<b>Proyecto:</b> Gestión Técnica CIASA RD", styles['MetaHeader']),
            Paragraph("<b>Fase Reportada:</b> Fase 1 (En Proceso / Producción)", styles['MetaHeaderBold'])
        ],
        [
            Paragraph("<b>Tiempo Total Estimado:</b> 3 a 5 semanas", styles['MetaHeaderBold']),
            Paragraph("<b>Infraestructura Destino:</b> Hosting Propio (Hostinger)", styles['MetaHeader'])
        ],
        [
            Paragraph("<b>Responsable Técnico:</b> Rony Bello", styles['MetaHeader']),
            Paragraph("<b>Respaldo Financiero:</b> Iguala Mensual (RD$ 10,000 DOP)", styles['MetaHeader'])
        ]
    ]
    t_meta = Table(meta_data, colWidths=[250, 254])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#F1F5F9")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # Resumen Ejecutivo
    story.append(Paragraph("1. Resumen Ejecutivo de Avances", styles['SectionHeader']))
    story.append(Paragraph(
        "Se presenta el informe correspondiente al avance de la <b>Fase 1 de Trabajo (con un tiempo global de 3 a 5 semanas)</b>. "
        "A la fecha, el saneamiento del código y las pruebas de integración CRM muestran un progreso significativo. "
        "Al culminar esta fase, todo el ecosistema digital será transferido y puesto en marcha en el servidor propio de <b>Hostinger</b>, "
        "garantizando control total, alta velocidad y disponibilidad continua.",
        styles['BodyCustom']
    ))

    # Tabla de Logros
    story.append(Paragraph("2. Detalle de Logros, Tiempos y Estatus de Entregables", styles['SectionHeader']))

    logros_data = [
        [
            Paragraph("<b>Entregable / Hito</b>", styles['TableHeader']),
            Paragraph("<b>Trabajo Técnico Ejecutado / Planificado</b>", styles['TableHeader']),
            Paragraph("<b>Tiempo Est.</b>", styles['TableHeader']),
            Paragraph("<b>Estatus Actual</b>", styles['TableHeader'])
        ],
        [
            Paragraph("<b>Saneamiento de Código Base</b>", styles['TableCellBold']),
            Paragraph("Depuración de errores sintácticos y de estructura heredados del desarrollo de terceros.", styles['TableCell']),
            Paragraph("1-2 semanas", styles['TableCell']),
            Paragraph("<b>AVANZADO</b><br/>(En optimización)", styles['TableCellBold'])
        ],
        [
            Paragraph("<b>Integración Web-CRM</b>", styles['TableCellBold']),
            Paragraph("Intervención técnica de formularios y configuración de Webhooks para envío automático de leads.", styles['TableCell']),
            Paragraph("1-2 semanas", styles['TableCell']),
            Paragraph("<b>EN PROCESO</b><br/>(Pruebas de datos)", styles['TableCellBold'])
        ],
        [
            Paragraph("<b>Soporte de Marca & UX Mobile</b>", styles['TableCellBold']),
            Paragraph("Adecuaciones para eventuales cambios de logo/nombre y diseño adaptativo en móviles.", styles['TableCell']),
            Paragraph("1 semana", styles['TableCell']),
            Paragraph("<b>EN PROCESO</b><br/>(Ajustes UI)", styles['TableCellBold'])
        ],
        [
            Paragraph("<b>Despliegue Final en Hostinger</b>", styles['TableCellBold']),
            Paragraph("Montaje y publicación completa en servidor Hostinger administrado con SSL y DNS.", styles['TableCell']),
            Paragraph("1 semana", styles['TableCell']),
            Paragraph("<b>EN PLAN</b><br/>(Cierre Fase 1)", styles['TableCellBold'])
        ]
    ]
    t_logros = Table(logros_data, colWidths=[100, 204, 85, 115])
    t_logros.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E3A8A")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(t_logros)
    story.append(Spacer(1, 10))

    # Justificación de Valor
    story.append(Paragraph("3. Justificación del Servicio y Valor Aportado", styles['SectionHeader']))
    story.append(Paragraph(
        "Llevar a cabo la corrección, la integración de captación de clientes y el posterior alojamiento en <b>Hostinger</b> bajo la iguala mensual "
        "asegura que el proyecto CIASA RD cuente con una base tecnológica sólida y confiable, sin costes imprevistos de infraestructura y con un "
        "acompañamiento técnico ágil y constante.",
        styles['BodyCustom']
    ))
    story.append(Spacer(1, 14))

    # Firmas
    firmas_data = [
        [
            Paragraph("__________________________________________<br/><b>Rony Bello</b><br/>Desarrollo y Gestión Técnica", styles['BodyCustom']),
            Paragraph("__________________________________________<br/><b>Paola Caram Ibarra</b><br/>Conformidad de Avance Fase 1", styles['BodyCustom'])
        ]
    ]
    t_firmas = Table(firmas_data, colWidths=[250, 254])
    t_firmas.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(KeepTogether(t_firmas))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF 3 generado exitosamente: {filename}")


if __name__ == '__main__':
    styles = get_custom_styles()
    
    out_dir = r"C:\Users\Rony\Downloads"
    
    pdf1 = os.path.join(out_dir, "Propuesta Técnica - Gestión y Mantenimiento Web.pdf")
    pdf2 = os.path.join(out_dir, "Documento_de_Alcance_Fase_1.pdf")
    pdf3 = os.path.join(out_dir, "Reporte_de_Logros_Fase_1.pdf")
    
    build_pdf_1_propuesta(pdf1, styles)
    build_pdf_2_alcance_fase_1(pdf2, styles)
    build_pdf_3_reporte_logros_fase_1(pdf3, styles)
    
    print("--- Todos los PDFs han sido actualizados exitosamente ---")
