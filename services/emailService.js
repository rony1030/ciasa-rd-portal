// CIASA RD — Servicio de Automatización de Correos Electrónicos (Email Service)
// Envío Transaccional, Secuencias de Nutrición (Drip) y Notificaciones de Leads

const fs = require('fs');
const path = require('path');
const { EMAIL_TEMPLATES } = require('./emailTemplates');

const LOGS_FILE = path.join(__dirname, '../_materiales_y_estrategia/datos/email_logs.json');

// Configuración de Servidor de Correo (SMTP)
// Compatible con Hostinger, cPanel, Mailchimp Transac o Simulación Segura en Local
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE !== 'false',
  user: process.env.SMTP_USER || 'info@ciasard.org.do',
  pass: process.env.SMTP_PASS || '',
  from: process.env.SMTP_FROM || '"CIASA Bolsa Inmobiliaria" <info@ciasard.org.do>',
  adminRecipient: process.env.ADMIN_NOTIFY_EMAIL || 'paola.caram@ciasard.org.do'
};

function readEmailLogs() {
  try {
    if (fs.existsSync(LOGS_FILE)) {
      return JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
}

function recordEmailLog(entry) {
  try {
    const logs = readEmailLogs();
    logs.unshift({
      id: 'elog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      ...entry
    });
    // Mantener últimos 100 logs
    const trimmed = logs.slice(0, 100);
    fs.writeFileSync(LOGS_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Error recording email log:', e.message);
  }
}

/**
 * Envío de un correo individual utilizando una plantilla específica
 */
async function sendTemplateEmail({ templateId, lead, customRecipient, customSubject }) {
  const template = EMAIL_TEMPLATES[templateId] || EMAIL_TEMPLATES.bienvenida_dossier;
  const to = customRecipient || lead.email;
  const subject = customSubject || template.subject.replace(/{{nombre}}/g, lead.nombre || 'Inversionista');
  const html = template.render(lead);

  const result = {
    templateId,
    to,
    subject,
    status: 'simulated',
    timestamp: new Date().toISOString()
  };

  if (!to || !to.includes('@')) {
    result.status = 'skipped_no_email';
    return result;
  }

  // Intentar envío real vía Nodemailer si hay credenciales configuradas
  try {
    const nodemailer = require('nodemailer');
    if (SMTP_CONFIG.pass && SMTP_CONFIG.user) {
      const transporter = nodemailer.createTransport({
        host: SMTP_CONFIG.host,
        port: SMTP_CONFIG.port,
        secure: SMTP_CONFIG.secure,
        auth: {
          user: SMTP_CONFIG.user,
          pass: SMTP_CONFIG.pass
        },
        tls: { rejectUnauthorized: false }
      });

      await transporter.sendMail({
        from: SMTP_CONFIG.from,
        to,
        subject,
        html
      });

      result.status = 'delivered_smtp';
      recordEmailLog(result);
      console.log(`[CIASA EMAIL] Correo enviado exitosamente a ${to} (Plantilla: ${templateId})`);
      return result;
    }
  } catch (err) {
    console.warn(`[CIASA EMAIL] Error SMTP (fallback a simulación local):`, err.message);
    result.error = err.message;
  }

  // Modo local simulado
  result.status = 'simulated_local';
  recordEmailLog(result);
  console.log(`[CIASA EMAIL] Simulación de correo exitosa para ${to} (Plantilla: ${templateId})`);
  return result;
}

/**
 * Función Principal de Envío Automatizado al Capturar un Lead (Formularios / Chatbot)
 */
async function sendLeadEmails(lead) {
  const results = {
    admin: null,
    client: null
  };

  // 1. Notificación a Dirección Ejecutiva (Paola Caram)
  results.admin = await sendTemplateEmail({
    templateId: 'notificacion_lead',
    lead,
    customRecipient: SMTP_CONFIG.adminRecipient
  });

  // 2. Confirmación y Dossier al Cliente (si proporcionó correo)
  if (lead.email && lead.email.includes('@')) {
    results.client = await sendTemplateEmail({
      templateId: 'bienvenida_dossier',
      lead
    });
  }

  return results;
}

module.exports = {
  sendLeadEmails,
  sendTemplateEmail,
  readEmailLogs,
  EMAIL_TEMPLATES,
  SMTP_CONFIG
};
