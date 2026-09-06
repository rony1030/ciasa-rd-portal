import os
from PIL import Image, ImageDraw, ImageFont

def get_fonts():
    try:
        font_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 22)
        font_sub = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 14)
        font_box_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 15)
        font_box_text = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 12)
        font_badge = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 11)
    except:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_box_title = ImageFont.load_default()
        font_box_text = ImageFont.load_default()
        font_badge = ImageFont.load_default()
    return font_title, font_sub, font_box_title, font_box_text, font_badge

def draw_rounded_rect(draw, coords, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(coords, radius=radius, fill=fill, outline=outline, width=width)

def generate_diagram_1(out_path):
    # Diagrama 1: Flujo Integral de Leads
    W, H = 1000, 520
    im = Image.new("RGB", (W, H), "#F8FAFC")
    draw = ImageDraw.Draw(im)
    ft, fs, fbt, ftx, fbg = get_fonts()

    # Header
    draw_rounded_rect(draw, (20, 15, 980, 75), 10, "#0A1E36")
    draw.text((40, 24), "DIAGRAMA 1: FLUJO INTEGRAL DE CAPTACIÓN, NOTIFICACIONES Y CRM", font=ft, fill="#FFFFFF")
    draw.text((40, 50), "Flujo automatizado desde el formulario web hasta la asignación de agente comercial y alertas multicanal", font=fs, fill="#7DB33A")

    # Step 1: Formulario Web
    draw_rounded_rect(draw, (30, 100, 210, 230), 8, "#FFFFFF", "#2563EB", 2)
    draw_rounded_rect(draw, (30, 100, 210, 130), 6, "#2563EB")
    draw.text((40, 107), "1. FORMULARIO WEB", font=fbt, fill="#FFFFFF")
    draw.text((40, 140), "• Contacto / Cotizador\n• Ficha de Proyecto\n• Wizard Inversión\n• Validación de datos\n• Origen y Atribución", font=ftx, fill="#1E293B")

    # Arrow 1 -> 2
    draw.line((210, 165, 260, 165), fill="#2563EB", width=3)
    draw.polygon([(260, 165), (250, 160), (250, 170)], fill="#2563EB")

    # Step 2: Servidor Node.js
    draw_rounded_rect(draw, (260, 100, 470, 230), 8, "#FFFFFF", "#0A1E36", 2)
    draw_rounded_rect(draw, (260, 100, 470, 130), 6, "#0A1E36")
    draw.text((270, 107), "2. API POST /api/leads", font=fbt, fill="#FFFFFF")
    draw.text((270, 140), "• Sanitización de inputs\n• Generación ID único\n• Inserción en leads.json\n• Tarea seguimiento 24h\n• Bitácora inicial", font=ftx, fill="#1E293B")

    # Arrow 2 -> 3 (Split into two: Emails & CRM)
    draw.line((470, 145, 520, 145), fill="#7DB33A", width=3)
    draw.polygon([(520, 145), (510, 140), (510, 150)], fill="#7DB33A")

    draw.line((470, 185, 520, 185), fill="#0A1E36", width=3)
    draw.polygon([(520, 185), (510, 180), (510, 190)], fill="#0A1E36")

    # Step 3A: Despacho de Correos (SMTP)
    draw_rounded_rect(draw, (520, 95, 730, 235), 8, "#FFFFFF", "#7DB33A", 2)
    draw_rounded_rect(draw, (520, 95, 730, 125), 6, "#7DB33A")
    draw.text((530, 102), "3A. DESPACHO SMTP", font=fbt, fill="#FFFFFF")
    draw.text((530, 135), "1. Correo al Inversionista:\n   Confirmación + Dossier\n2. Correo Interno CIASA:\n   Alerta de nuevo prospecto\n   a Paola Caram / Ventas", font=ftx, fill="#1E293B")

    # Step 3B: Registro CRM 360
    draw_rounded_rect(draw, (520, 250, 730, 390), 8, "#FFFFFF", "#0A1E36", 2)
    draw_rounded_rect(draw, (520, 250, 730, 280), 6, "#0A1E36")
    draw.text((530, 257), "3B. SUITE CRM 360°", font=fbt, fill="#FFFFFF")
    draw.text((530, 290), "• Entrada a etapa 'Nuevo'\n• Tablero Kanban activo\n• Registro en email_logs\n• Ficha KYC descargable\n• Carpeta de documentos", font=ftx, fill="#1E293B")

    # Arrow 3 -> 4
    draw.line((730, 165, 780, 165), fill="#2563EB", width=3)
    draw.polygon([(780, 165), (770, 160), (770, 170)], fill="#2563EB")

    draw.line((730, 320, 780, 320), fill="#2563EB", width=3)
    draw.polygon([(780, 320), (770, 315), (770, 325)], fill="#2563EB")

    # Step 4: Asignación y Comunicación
    draw_rounded_rect(draw, (780, 95, 970, 390), 8, "#FFFFFF", "#2563EB", 2)
    draw_rounded_rect(draw, (780, 95, 970, 125), 6, "#2563EB")
    draw.text((790, 102), "4. ATENCIÓN & CIERRE", font=fbt, fill="#FFFFFF")
    draw.text((790, 135), "• Asignación a Asesor\n• WhatsApp Directo:\n  Atención 1 a 1 sin bots\n• Llamada / Zoom asesoría\n• Envío de cotización\n• Avance en Pipeline:\n  Nuevo -> Contactado ->\n  Calificado -> Negociación\n  -> Cierre de Venta", font=ftx, fill="#1E293B")

    # Footer note
    draw_rounded_rect(draw, (30, 410, 970, 500), 8, "#F1F5F9", "#CBD5E1", 1)
    draw.text((45, 420), "PROTOCOLO DE COMUNICACIÓN: Correo transaccional para formalización de solicitudes y WhatsApp como canal principal directo.", font=fbt, fill="#0A1E36")
    draw.text((45, 445), "Cada lead genera trazabilidad completa en la bitácora del CRM, impidiendo pérdida de prospectos o duplicidad de contactos.", font=ftx, fill="#475569")
    draw.text((45, 468), "Desarrollado y operado bajo el stack Node.js de CIASA RD — Autor: Rony Bello (Desarrollo & Programación Web).", font=fbg, fill="#7DB33A")

    im.save(out_path, quality=95)
    print(f"Diagrama 1 generado en {out_path}")

def generate_diagram_2(out_path):
    # Diagrama 2: Arquitectura Global
    W, H = 1000, 520
    im = Image.new("RGB", (W, H), "#F8FAFC")
    draw = ImageDraw.Draw(im)
    ft, fs, fbt, ftx, fbg = get_fonts()

    # Header
    draw_rounded_rect(draw, (20, 15, 980, 75), 10, "#0A1E36")
    draw.text((40, 24), "DIAGRAMA 2: ARQUITECTURA GLOBAL DEL ECOSISTEMA DIGITAL CIASA", font=ft, fill="#FFFFFF")
    draw.text((40, 50), "Infraestructura Node.js MVC, persistencia híbrida, seguridad HTTP y módulos administrativos", font=fs, fill="#7DB33A")

    # Box 1: Frontend Client
    draw_rounded_rect(draw, (30, 100, 210, 480), 8, "#FFFFFF", "#5B9BD5", 2)
    draw_rounded_rect(draw, (30, 100, 210, 130), 6, "#5B9BD5")
    draw.text((40, 107), "CAPA CLIENTE (UI)", font=fbt, fill="#FFFFFF")
    draw.text((40, 140), "• HTML5 Semántico\n• CSS3 Modular / Grid\n• JavaScript Vanilla\n• Responsive (Mobile/PC)\n• Sin dependencias pesadas\n• Leaflet Mapas\n• Pagefind Buscador\n• Calculadoras ROI\n• Wizard Interactivo\n• Reproductor Video HD", font=ftx, fill="#1E293B")

    # Box 2: Node.js Express Server
    draw_rounded_rect(draw, (240, 100, 490, 480), 8, "#FFFFFF", "#0A1E36", 2)
    draw_rounded_rect(draw, (240, 100, 490, 130), 6, "#0A1E36")
    draw.text((250, 107), "SERVIDOR BACKEND (NODE.JS)", font=fbt, fill="#FFFFFF")
    draw.text((250, 140), "• Express 4.19 MVC\n• Clean URLs Canónicas\n• Motor de Plantillas EJS\n• Cabeceras de Seguridad:\n  - nosniff\n  - SAMEORIGIN\n  - Referrer-Policy\n• Video Streaming HTTP 206\n• Auth Cookie HttpOnly\n• Proxy & API Router\n• Control de Errores 404/500", font=ftx, fill="#1E293B")

    # Box 3: Servicios & Lógica
    draw_rounded_rect(draw, (520, 100, 720, 480), 8, "#FFFFFF", "#7DB33A", 2)
    draw_rounded_rect(draw, (520, 100, 720, 130), 6, "#7DB33A")
    draw.text((530, 107), "CAPA DE SERVICIOS", font=fbt, fill="#FFFFFF")
    draw.text((530, 140), "• emailService.js:\n  - Nodemailer SMTP SSL\n  - Plantillas HTML Drip\n  - Auditoría email_logs\n• Motor NPI:\n  - Búsqueda multicriterio\n  - Resiliencia dual\n  - Exportación ZIP lotes\n• Admin Manager:\n  - CRUD Propiedades\n  - Blog WYSIWYG\n  - CRM Kanban Drag&Drop", font=ftx, fill="#1E293B")

    # Box 4: Persistencia Híbrida
    draw_rounded_rect(draw, (750, 100, 970, 480), 8, "#FFFFFF", "#2563EB", 2)
    draw_rounded_rect(draw, (750, 100, 970, 130), 6, "#2563EB")
    draw.text((760, 107), "PERSISTENCIA DE DATOS", font=fbt, fill="#FFFFFF")
    draw.text((760, 140), "1. JSON Database Layer:\n• leads.json (Prospectos)\n• propiedades.json (27 props)\n• blog.json (Artículos)\n• perfil.json (Contacto)\n• ajustes.json (SEO/Config)\n• email_logs.json (Auditoría)\n\n2. Relacional MySQL:\n• u868879774_ciasa_npi\n• Tabla npi_providers\n• 8.8M+ registros indexados", font=ftx, fill="#1E293B")

    im.save(out_path, quality=95)
    print(f"Diagrama 2 generado en {out_path}")

def generate_diagram_3(out_path):
    # Diagrama 3: Diagnóstico y Plan de Traducciones
    W, H = 1000, 520
    im = Image.new("RGB", (W, H), "#F8FAFC")
    draw = ImageDraw.Draw(im)
    ft, fs, fbt, ftx, fbg = get_fonts()

    # Header
    draw_rounded_rect(draw, (20, 15, 980, 75), 10, "#0A1E36")
    draw.text((40, 24), "DIAGRAMA 3: SISTEMA DE TRADUCCIONES (ES / EN / FR) & PLAN DE REPARACIÓN", font=ft, fill="#FFFFFF")
    draw.text((40, 50), "Diagnóstico técnico del módulo multiidioma, detección de desacople en EJS y protocolo de sincronización", font=fs, fill="#7DB33A")

    # Column 1: Arquitectura Prevista
    draw_rounded_rect(draw, (30, 100, 320, 370), 8, "#FFFFFF", "#2563EB", 2)
    draw_rounded_rect(draw, (30, 100, 320, 130), 6, "#2563EB")
    draw.text((40, 107), "1. ESTRUCTURA PREVISTA", font=fbt, fill="#FFFFFF")
    draw.text((40, 140), "• Selector visual en Navbar:\n  Banderas ES / EN / FR.\n• Diccionario centralizado:\n  sitio-web/js/i18n.js (1,500+ líneas).\n• Atributos en DOM:\n  data-i18n=\"clave.traduccion\"\n• Persistencia en localStorage:\n  guarda preferencia del usuario.", font=ftx, fill="#1E293B")

    # Column 2: Diagnóstico del Fallo Actual
    draw_rounded_rect(draw, (350, 100, 650, 370), 8, "#FFFFFF", "#DC2626", 2)
    draw_rounded_rect(draw, (350, 100, 650, 130), 6, "#DC2626")
    draw.text((360, 107), "2. DIAGNÓSTICO DEL FALLO", font=fbt, fill="#FFFFFF")
    draw.text((360, 140), "• DESACOPLE DE MOTOR:\n  Al migrar a Node.js / EJS, las vistas\n  dinámicas no poseen todos los tags\n  data-i18n en elementos del servidor.\n• TEXTOS HARDCODEADOS:\n  Fichas de proyecto y calculadoras\n  tienen textos fijos en español.\n• SÍNTOMA:\n  Al hacer clic en EN o FR, solo cambia\n  el botón del selector pero no el contenido.", font=ftx, fill="#1E293B")

    # Column 3: Plan de Reparación Obligatorio
    draw_rounded_rect(draw, (680, 100, 970, 370), 8, "#FFFFFF", "#7DB33A", 2)
    draw_rounded_rect(draw, (680, 100, 970, 130), 6, "#7DB33A")
    draw.text((690, 107), "3. PLAN DE REPARACIÓN", font=fbt, fill="#FFFFFF")
    draw.text((690, 140), "• FASE DE AJUSTE INMEDIATO:\n  1. Etiquetar todas las vistas EJS\n     con sus atributos data-i18n.\n  2. Sincronizar diccionario i18n.js\n     para cubrir catálogo y wizard.\n  3. Middleware en Node.js para\n     servir idioma por cookie/cabecera.\n• CONDICIÓN:\n  Debe corregirse antes del lanzamiento\n  oficial para la diáspora angloparlante.", font=ftx, fill="#1E293B")

    # Bottom Banner
    draw_rounded_rect(draw, (30, 390, 970, 500), 8, "#FEF2F2", "#FCA5A5", 1)
    draw.text((45, 400), "DECLARACIÓN DE TRANSPARENCIA TÉCNICA (RONY BELLO - DESARROLLO & PROGRAMACIÓN WEB):", font=fbt, fill="#991B1B")
    draw.text((45, 425), "El multiidioma es prioritario para captar clientes en EE.UU., Canadá y Europa. Este informe deja establecido el diagnóstico exacto", font=ftx, fill="#1E293B")
    draw.text((45, 448), "y la hoja de ruta técnica para su reparación integral previo a la fase de comercialización masiva.", font=ftx, fill="#1E293B")
    draw.text((45, 472), "Tiempo estimado de sincronización total: 1 a 2 semanas dentro del cronograma acordado.", font=fbg, fill="#0A1E36")

    im.save(out_path, quality=95)
    print(f"Diagrama 3 generado en {out_path}")

def generate_diagram_4(out_path):
    # Diagrama 4: Motor NPI
    W, H = 1000, 520
    im = Image.new("RGB", (W, H), "#F8FAFC")
    draw = ImageDraw.Draw(im)
    ft, fs, fbt, ftx, fbg = get_fonts()

    # Header
    draw_rounded_rect(draw, (20, 15, 980, 75), 10, "#0A1E36")
    draw.text((40, 24), "DIAGRAMA 4: MOTOR NPI (LEADS MÉDICOS USA) & EXPORTACIÓN EN LOTES", font=ft, fill="#FFFFFF")
    draw.text((40, 50), "Filtrado multicriterio, arquitectura resiliente MySQL y generación de paquetes ZIP para Email Marketing", font=fs, fill="#7DB33A")

    # Box 1: Filtros Multicriterio
    draw_rounded_rect(draw, (30, 100, 290, 480), 8, "#FFFFFF", "#0A1E36", 2)
    draw_rounded_rect(draw, (30, 100, 290, 130), 6, "#0A1E36")
    draw.text((40, 107), "1. FILTROS MULTICRITERIO", font=fbt, fill="#FFFFFF")
    draw.text((40, 140), "• Estado: FL, NY, CA, TX, NJ...\n• Especialidad: Odontología,\n  Cardiología, Cirugía...\n• Quintil de Ingresos (1 al 5)\n• Filtro Hispano (latino_only=1)\n• Teléfono directo (has_phone=1)\n• Email verificado (has_email=1)\n• Perfiles Sociales (LinkedIn/IG)\n• Búsqueda libre por nombre/NPI", font=ftx, fill="#1E293B")

    # Box 2: Motor de Consulta & Resiliencia
    draw_rounded_rect(draw, (320, 100, 660, 480), 8, "#FFFFFF", "#2563EB", 2)
    draw_rounded_rect(draw, (320, 100, 660, 130), 6, "#2563EB")
    draw.text((330, 107), "2. RESILIENCIA DUAL DEL BACKEND", font=fbt, fill="#FFFFFF")
    draw.text((330, 140), "• ENDPOINTS: /api/npi/search y /states\n\n• RUTA PRIMARIA (MySQL LIVE):\n  Pool mysql2 conectado a Hostinger\n  (u868879774_ciasa_npi).\n  Consulta dinámica parametrizada con\n  paginación LIMIT y OFFSET.\n\n• RUTA SECUNDARIA (FALLBACK LOCAL):\n  Si MySQL no responde, conmuta en 5ms\n  a curated_npi_data.js sin caídas.", font=ftx, fill="#1E293B")

    # Box 3: Exportación en Lotes ZIP
    draw_rounded_rect(draw, (690, 100, 970, 480), 8, "#FFFFFF", "#7DB33A", 2)
    draw_rounded_rect(draw, (690, 100, 970, 130), 6, "#7DB33A")
    draw.text((700, 107), "3. EXPORTACIÓN & MARKETING", font=fbt, fill="#FFFFFF")
    draw.text((700, 140), "• MOTOR DE FRAGMENTACIÓN:\n  Segmenta los resultados en bloques\n  exactos de 150 leads por archivo CSV.\n\n• EMPAQUETADO ZIP AUTOMÁTICO:\n  JSZip genera un archivo comprimido\n  con todos los lotes rotulados.\n\n• COMPATIBILIDAD DIRECTA:\n  - Hostinger Reach\n  - Mailchimp Transac\n  - Brevo (Sendinblue)\n  - Google Sheets / CRM externo", font=ftx, fill="#1E293B")

    im.save(out_path, quality=95)
    print(f"Diagrama 4 generado en {out_path}")

def generate_diagram_5(out_path):
    # Diagrama 5: Ciclo de Vida del Lead en Kanban
    W, H = 1000, 520
    im = Image.new("RGB", (W, H), "#F8FAFC")
    draw = ImageDraw.Draw(im)
    ft, fs, fbt, ftx, fbg = get_fonts()

    # Header
    draw_rounded_rect(draw, (20, 15, 980, 75), 10, "#0A1E36")
    draw.text((40, 24), "DIAGRAMA 5: PIPELINE COMERCIAL & CICLO DE VIDA DEL INVERSIONISTA", font=ft, fill="#FFFFFF")
    draw.text((40, 50), "Etapas del Tablero Kanban, llamadas AJAX en tiempo real, gestión de tareas y carpeta digital", font=fs, fill="#7DB33A")

    stages = [
        ("1. NUEVO", "#64748B", "• Captura en web\n• Alerta enviada\n• Tarea 24h creada\n• En espera de contacto"),
        ("2. CONTACTADO", "#2563EB", "• WhatsApp enviado\n• Llamada inicial\n• Validación interés\n• Registro en bitácora"),
        ("3. CALIFICADO", "#7DB33A", "• Presupuesto validado\n• Polo turístico fijo\n• Ley CONFOTUR\n• Envío de Dossier"),
        ("4. EN NEGOCIACIÓN", "#EAB308", "• Unidad reservada\n• Asesoría bancaria\n• Revisión contrato\n• Fideicomiso"),
        ("5. CERRADO / VENTA", "#16A34A", "• Firma contrato\n• Pago inicial\n• Ficha KYC lista\n• Comisión liquidada")
    ]

    col_w = 175
    start_x = 30
    for idx, (st_title, st_color, st_desc) in enumerate(stages):
        x = start_x + idx * (col_w + 14)
        draw_rounded_rect(draw, (x, 100, x + col_w, 360), 8, "#FFFFFF", st_color, 2)
        draw_rounded_rect(draw, (x, 100, x + col_w, 130), 6, st_color)
        draw.text((x + 10, 107), st_title, font=fbt, fill="#FFFFFF")
        draw.text((x + 10, 140), st_desc, font=ftx, fill="#1E293B")
        
        if idx < len(stages) - 1:
            draw.line((x + col_w, 230, x + col_w + 14, 230), fill=st_color, width=2)
            draw.polygon([(x + col_w + 14, 230), (x + col_w + 8, 226), (x + col_w + 8, 234)], fill=st_color)

    # Bottom summary box
    draw_rounded_rect(draw, (30, 380, 970, 495), 8, "#F1F5F9", "#CBD5E1", 1)
    draw.text((45, 390), "INTERACTIVIDAD TÉCNICA DEL TABLERO KANBAN (/admin/leads):", font=fbt, fill="#0A1E36")
    draw.text((45, 415), "• Endpoint POST /admin/leads/:id/status-ajax actualiza de forma atómica en leads.json al arrastrar (Drag & Drop).", font=ftx, fill="#1E293B")
    draw.text((45, 438), "• Ficha 360° individual (/admin/leads/:id) permite adjuntar contratos KYC, bitácora de llamadas y tareas con alertas.", font=ftx, fill="#1E293B")
    draw.text((45, 462), "• Botón de impresión A4 formateado para generar resumen ejecutivo en 1 sola página para comités comerciales.", font=fbg, fill="#7DB33A")

    im.save(out_path, quality=95)
    print(f"Diagrama 5 generado en {out_path}")

if __name__ == '__main__':
    diag_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "diagramas")
    os.makedirs(diag_dir, exist_ok=True)
    
    generate_diagram_1(os.path.join(diag_dir, "diagrama_1_flujo_leads.png"))
    generate_diagram_2(os.path.join(diag_dir, "diagrama_2_arquitectura_global.png"))
    generate_diagram_3(os.path.join(diag_dir, "diagrama_3_sistema_traducciones.png"))
    generate_diagram_4(os.path.join(diag_dir, "diagrama_4_motor_npi.png"))
    generate_diagram_5(os.path.join(diag_dir, "diagrama_5_pipeline_crm_kanban.png"))
    print("Todos los diagramas gráficos generados exitosamente.")
