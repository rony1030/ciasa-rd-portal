// CIASA RD — Motor de Plantillas de Email Marketing & Secuencias de Nutrición
// Basado en Master Layouts 600px 100% compatibles con Gmail, Outlook, Apple Mail y Yahoo

function getMasterEmailLayout({ title, preheader, contentHtml, unsubscribeEmail }) {
  const unsubLink = unsubscribeEmail 
    ? `https://ciasard.org.do/api/email/unsubscribe?email=${encodeURIComponent(unsubscribeEmail)}` 
    : 'https://ciasard.org.do/contacto';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'CIASA Bolsa Inmobiliaria'}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { max-width: 100%; height: auto; display: block; border: 0; }
    a { color: #2563EB; text-decoration: underline; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; border-radius: 0 !important; }
      .content-cell { padding: 24px 18px !important; }
      .header-cell { padding: 24px 18px !important; }
      .footer-cell { padding: 24px 18px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9;">
  ${preheader ? `<div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">${preheader}</div>` : ''}

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F1F5F9; padding: 30px 0;">
    <tr>
      <td align="center">
        
        <!-- Contenedor Principal 600px -->
        <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(10, 30, 54, 0.06);">
          
          <!-- Barra Superior de Marca -->
          <tr>
            <td height="5" style="background: linear-gradient(90deg, #0A1E36 0%, #7DB33A 50%, #A3E635 100%); font-size: 1px; line-height: 1px;">&nbsp;</td>
          </tr>

          <!-- Cabecera Institucional -->
          <tr>
            <td class="header-cell" style="padding: 28px 40px 20px; text-align: center; border-bottom: 1px solid #F1F5F9; background-color: #0A1E36;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <div style="font-size: 1.45rem; font-weight: 900; color: #FFFFFF; letter-spacing: 0.5px; line-height: 1.1;">
                      CIASA <span style="color: #A3E635; font-weight: 700; font-size: 1.15rem;">Bolsa Inmobiliaria</span>
                    </div>
                    <div style="font-size: 0.76rem; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.12em; margin-top: 4px;">
                      República Dominicana · Asesoría Patrimonial & Ley CONFOTUR
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenido Dinámico -->
          <tr>
            <td class="content-cell" style="padding: 36px 40px 32px; font-size: 15px; line-height: 1.7; color: #334155;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Pie de Página Institucional -->
          <tr>
            <td class="footer-cell" style="background-color: #0A1E36; padding: 32px 40px; text-align: center; color: #CBD5E1;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                
                <!-- Contacto Rápido -->
                <tr>
                  <td align="center" style="font-size: 12px; color: #94A3B8; padding-bottom: 16px;">
                    <strong>Dirección Ejecutiva:</strong> Paola Caram · <a href="mailto:paola.caram@ciasard.org.do" style="color: #A3E635; text-decoration: none;">paola.caram@ciasard.org.do</a><br>
                    <strong>Atención General:</strong> <a href="mailto:info@ciasard.org.do" style="color: #A3E635; text-decoration: none;">info@ciasard.org.do</a> · Tel: +1 (809) 299-5233
                  </td>
                </tr>

                <!-- Disclaimer Legal -->
                <tr>
                  <td align="center" style="font-size: 11px; color: #64748B; line-height: 1.5; padding-bottom: 16px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">
                    <strong>Aviso de Confidencialidad:</strong> Los precios, tipologías y proyecciones de rentabilidad (ROI) presentados están sujetos a disponibilidad y validación por las constructoras aliadas. Las exenciones fiscales aplican según los términos vigentes de la Ley 158-01 (CONFOTUR).
                  </td>
                </tr>

                <!-- Enlaces y Desuscripción -->
                <tr>
                  <td align="center" style="font-size: 11px; color: #94A3B8;">
                    <a href="https://ciasard.org.do/invertir" style="color: #CBD5E1; text-decoration: underline; margin-right: 12px;">Guía CONFOTUR</a>
                    <a href="https://ciasard.org.do/proyectos" style="color: #CBD5E1; text-decoration: underline; margin-right: 12px;">Catálogo 27 Proyectos</a>
                    <a href="https://ciasard.org.do/contacto" style="color: #CBD5E1; text-decoration: underline;">Contacto Directo</a><br><br>
                    <span style="color: #64748B;">¿No deseas recibir estos correos de asesoría? <a href="${unsubLink}" style="color: #A3E635; text-decoration: underline;">Cancele su suscripción aquí</a>.</span>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────
// PLANTILLAS DE EMAIL MARKETING Y SECUENCIAS
// ─────────────────────────────────────────────────────────────

const EMAIL_TEMPLATES = {
  // 1. Notificación de Nuevo Lead (Dirección)
  notificacion_lead: {
    id: 'notificacion_lead',
    name: 'Notificación de Nuevo Lead (Dirección)',
    subject: '🔔 Nuevo Prospecto Calificado: {{nombre}} — CIASA CRM',
    description: 'Enviada automáticamente a Paola Caram y al equipo de ventas cuando se registra un prospecto en el portal o chatbot.',
    render: (lead) => {
      const cleanPhone = (lead.telefono || '').replace(/[^0-9]/g, '');
      const waLink = cleanPhone ? `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(lead.nombre || '')},%20te%20escribe%20Paola%20Caram%20de%20CIASA%20Bolsa%20Inmobiliaria.` : '#';

      const content = `
        <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
          <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #15803D; letter-spacing: 0.05em;">Nuevo Prospecto Calificado</span>
          <div style="font-size: 16px; font-weight: 900; color: #0A1E36; margin-top: 2px;">${lead.nombre || 'Inversionista'}</div>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #F1F5F9; color: #64748B; width: 140px; font-weight: 600;">Teléfono / WhatsApp:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #F1F5F9; color: #0A1E36; font-weight: 700;">${lead.telefono || 'No especificado'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Correo Electrónico:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #F1F5F9; color: #0A1E36; font-weight: 700;">${lead.email || 'No especificado'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Ubicación:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #F1F5F9; color: #0A1E36;">${lead.ciudad ? lead.ciudad + ', ' : ''}${lead.pais || 'República Dominicana'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Presupuesto:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #F1F5F9; color: #15803D; font-weight: 800;">${lead.montoInversion ? 'US$ ' + lead.montoInversion : 'Por definir'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Zona / Proyecto:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #F1F5F9; color: #0A1E36; font-weight: 700;">${lead.proyectoInteres || lead.region || 'Interés General'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Origen del Lead:</td>
            <td style="padding: 8px 0; color: #0A1E36;">${lead.source || 'Portal Web CIASA'}</td>
          </tr>
        </table>

        ${lead.mensaje || (lead.notas && lead.notas[0]) ? `
        <div style="background: #F8FAFC; border-left: 3px solid #7DB33A; padding: 14px 16px; border-radius: 6px; font-size: 13px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
          <strong>Mensaje del Cliente:</strong><br>
          ${lead.mensaje || (lead.notas[0] ? lead.notas[0].texto : '')}
        </div>` : ''}

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 10px;">
          <tr>
            <td align="center">
              ${cleanPhone ? `
              <a href="${waLink}" target="_blank" style="background: #25D366; color: #FFFFFF; font-weight: 800; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 8px; display: inline-block; margin-right: 10px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);">
                Escribir por WhatsApp
              </a>` : ''}
              <a href="https://ciasard.org.do/admin/leads" target="_blank" style="background: #0A1E36; color: #FFFFFF; font-weight: 800; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 8px; display: inline-block;">
                Ver en CRM CIASA
              </a>
            </td>
          </tr>
        </table>
      `;

      return getMasterEmailLayout({
        title: `Nuevo Prospecto: ${lead.nombre || 'Inversionista'}`,
        preheader: `Nuevo contacto registrado en CRM CIASA: ${lead.nombre} (${lead.region || 'General'})`,
        contentHtml: content
      });
    }
  },

  // 2. Bienvenida & Dossier CONFOTUR (Cliente - Minuto 0)
  bienvenida_dossier: {
    id: 'bienvenida_dossier',
    name: 'Bienvenida & Dossier CONFOTUR (Cliente)',
    subject: 'CIASA Bolsa Inmobiliaria — Confirmación de Asesoría Patrimonial en RD',
    description: 'Enviada automáticamente al cliente al llenar el formulario o solicitar cotización en el chatbot.',
    render: (lead) => {
      const content = `
        <h2 style="font-size: 20px; font-weight: 800; color: #0A1E36; margin: 0 0 14px; line-height: 1.3;">
          Hola ${lead.nombre || 'Estimado(a) Inversionista'},
        </h2>
        <p style="margin: 0 0 16px;">
          Gracias por contactar a <strong>CIASA Bolsa Inmobiliaria</strong>. Hemos recibido tu solicitud de asesoría patrimonial sobre proyectos en República Dominicana.
        </p>
        <p style="margin: 0 0 20px;">
          Nuestro equipo directivo, encabezado por <strong>Paola Caram</strong>, está analizando las oportunidades verificadas que mejor se adaptan a tu presupuesto y objetivo financiero (rentas vacacionales Airbnb, plusvalía o retiro).
        </p>

        <!-- Tarjeta de Beneficios CONFOTUR -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <div style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #15803D; letter-spacing: 0.05em; margin-bottom: 8px;">
            Beneficios Exclusivos de la Ley CONFOTUR 158-01:
          </div>
          <ul style="margin: 0; padding-left: 18px; font-size: 14px; color: #475569; line-height: 1.6;">
            <li><strong>15 Años de Exención del 100% del IPI:</strong> Cero impuesto sobre la propiedad inmobiliaria (ahorro del 1% anual).</li>
            <li><strong>0% Impuesto de Transferencia Inmobiliaria:</strong> Ahorro directo del 3% en la compra y titulación.</li>
            <li><strong>0% Impuesto sobre la Renta:</strong> Exención tributaria por ingresos de alquileres turísticos.</li>
          </ul>
        </div>

        <p style="margin: 0 0 24px;">
          Un asesor patrimonial te contactará en menos de <strong>24 horas hábiles</strong>. Si deseas coordinar una sesión directa de inmediato o recibir el catálogo por WhatsApp, puedes pulsar el siguiente botón:
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
          <tr>
            <td align="center">
              <a href="https://wa.me/18092995233?text=Hola%20Paola,%20recib%C3%AD%20el%20correo%20de%20CIASA%20y%20deseo%20dar%20seguimiento%20a%20mi%20inversi%C3%B3n." target="_blank" style="background: #7DB33A; color: #FFFFFF; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 14px rgba(125, 179, 58, 0.35);">
                Hablar Directamente con Paola Caram por WhatsApp
              </a>
            </td>
          </tr>
        </table>

        <!-- Firma Ejecutiva -->
        <div style="border-top: 1px solid #E2E8F0; padding-top: 20px; display: flex; align-items: center; gap: 14px;">
          <div style="font-size: 13px; color: #64748B; line-height: 1.5;">
            <strong style="color: #0A1E36; font-size: 14px; display: block;">Paola Caram</strong>
            Directora Ejecutiva · CIASA Bolsa Inmobiliaria<br>
            <span style="color: #2563EB;">paola.caram@ciasard.org.do · +1 (809) 299-5233</span>
          </div>
        </div>
      `;

      return getMasterEmailLayout({
        title: 'CIASA — Confirmación de Asesoría de Inversión',
        preheader: 'Hemos recibido tu solicitud de inversión en RD. Conoce los beneficios de la Ley CONFOTUR.',
        contentHtml: content,
        unsubscribeEmail: lead.email
      });
    }
  },

  // 3. Secuencia Drip 2: Comparativa de Regiones (Día 2)
  drip_regiones: {
    id: 'drip_regiones',
    name: 'Secuencia 2: Las 3 Zonas de Mayor Plusvalía en RD',
    subject: '¿Punta Cana, Santo Domingo o Samaná? — Comparativa de Inversión CIASA',
    description: 'Enviada automáticamente al segundo día para educar al prospecto sobre rentabilidad y destinos.',
    render: (lead) => {
      const content = `
        <h2 style="font-size: 20px; font-weight: 800; color: #0A1E36; margin: 0 0 14px;">
          Hola ${lead.nombre || 'Estimado(a) Inversionista'},
        </h2>
        <p style="margin: 0 0 16px;">
          Al momento de invertir en bienes raíces en República Dominicana, la ubicación determina tanto tu <strong>flujo de caja por alquileres vacacionales</strong> como la <strong>plusvalía de tu capital</strong>.
        </p>

        <!-- Bloque 1: Punta Cana -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; margin-bottom: 14px;">
          <strong style="color: #0A1E36; font-size: 15px;">🏖️ 1. Punta Cana & Cap Cana (ROI 9% - 14% USD)</strong>
          <p style="font-size: 13px; color: #475569; margin: 4px 0 0; line-height: 1.5;">
            El polo turístico #1 del Caribe con más de 8 millones de visitantes al año. Ideal para alquileres vacacionales en dólares mediante Airbnb y Property Management.
          </p>
        </div>

        <!-- Bloque 2: Santo Domingo -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; margin-bottom: 14px;">
          <strong style="color: #0A1E36; font-size: 15px;">🏙️ 2. Santo Domingo & Distrito Nacional (Plusvalía Sólida)</strong>
          <p style="font-size: 13px; color: #475569; margin: 4px 0 0; line-height: 1.5;">
            El centro financiero del país (Piantini, Naco, Bella Vista). Demanda corporativa estable, contratos de largo plazo y excelente liquidez patrimonial.
          </p>
        </div>

        <!-- Bloque 3: Samaná & Las Terrenas -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
          <strong style="color: #0A1E36; font-size: 15px;">🌴 3. Samaná & Las Terrenas (Turismo Exclusivo)</strong>
          <p style="font-size: 13px; color: #475569; margin: 4px 0 0; line-height: 1.5;">
            Destino boutique preferido por inversionistas europeos y estadounidenses. Proyectos residenciales eco-luxury con alta ocupación estacional.
          </p>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
          <tr>
            <td align="center">
              <a href="https://ciasard.org.do/proyectos" target="_blank" style="background: #0A1E36; color: #FFFFFF; font-weight: 800; font-size: 13px; text-decoration: none; padding: 13px 26px; border-radius: 8px; display: inline-block;">
                Explorar el Catálogo de 27 Proyectos
              </a>
            </td>
          </tr>
        </table>
      `;

      return getMasterEmailLayout({
        title: 'Comparativa de Regiones Inmobiliarias en RD',
        preheader: 'Conoce cuál polo de desarrollo ofrece el mejor retorno según tu perfil de inversión.',
        contentHtml: content,
        unsubscribeEmail: lead.email
      });
    }
  },

  // 4. Secuencia Drip 3: Financiamiento a Distancia (Día 4)
  drip_financiamiento: {
    id: 'drip_financiamiento',
    name: 'Secuencia 3: Financiamiento a Distancia para la Diáspora',
    subject: '¿Cómo financiar tu propiedad en RD desde EE.UU. o Europa?',
    description: 'Enviada automáticamente al cuarto día explicando requisitos bancarios, fideicomisos y firma remota.',
    render: (lead) => {
      const content = `
        <h2 style="font-size: 20px; font-weight: 800; color: #0A1E36; margin: 0 0 14px;">
          Hola ${lead.nombre || 'Estimado(a) Inversionista'},
        </h2>
        <p style="margin: 0 0 16px;">
          Muchos dominicanos y extranjeros en el exterior tienen la misma duda: <em>"¿Puedo comprar y financiar un inmueble en República Dominicana sin tener que viajar para cada trámite?"</em>
        </p>
        <p style="margin: 0 0 20px;">
          La respuesta es un rotundo <strong>SÍ</strong>. En CIASA te acompañamos en un proceso 100% seguro y regulado:
        </p>

        <div style="background: #F8FAFC; border-left: 4px solid #2563EB; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
          <strong style="color: #0A1E36; font-size: 14px;">Pilares de Seguridad Jurídica CIASA:</strong>
          <ul style="margin: 8px 0 0; padding-left: 18px; font-size: 13px; color: #475569; line-height: 1.6;">
            <li><strong>Firma Digital Certificada:</strong> Firma tu contrato de reserva y promesa de compraventa desde tu teléfono u ordenador con plena validez notarial.</li>
            <li><strong>Cuentas de Fideicomiso Regulado:</strong> Tus pagos van directamente a la cuenta fiduciaria del banco (Banreservas, BHD o Popular), garantizando la ejecución de la obra.</li>
            <li><strong>Precalificación Hipotecaria en USD:</strong> Gestionamos tu evaluación con los oficiales de banca internacional con tus ingresos de EE.UU. (W2, 1099 o Tax Returns).</li>
          </ul>
        </div>

        <p style="margin: 0 0 24px;">
          ¿Deseas que realicemos una simulación de cuota hipotecaria personalizada para tu presupuesto?
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
          <tr>
            <td align="center">
              <a href="https://wa.me/18092995233?text=Hola%20Paola,%20quisiera%20asesor%C3%ADa%20sobre%20financiamiento%20para%20comprar%20en%20RD%20desde%20el%20exterior." target="_blank" style="background: #7DB33A; color: #FFFFFF; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 14px rgba(125, 179, 58, 0.35);">
                Solicitar Simulación Financiera por WhatsApp
              </a>
            </td>
          </tr>
        </table>
      `;

      return getMasterEmailLayout({
        title: 'Financiamiento a Distancia para Dominicanos en el Exterior',
        preheader: 'Descubre cómo comprar tu propiedad en RD desde EE.UU. con cuentas de fideicomiso y firma digital.',
        contentHtml: content,
        unsubscribeEmail: lead.email
      });
    }
  }
};

module.exports = {
  getMasterEmailLayout,
  EMAIL_TEMPLATES
};
