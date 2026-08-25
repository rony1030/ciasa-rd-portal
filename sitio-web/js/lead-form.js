// Lead Form Handler & Security Hardening Module — CIASA RD
// Implements Frontend Security Standards (Anti-XSS, Bot Honeypot, RFC Validation, Cooldown Protection)
var LEAD_NOTIFICATION_EMAIL = "paola.caram@ciasard.org.do";

// ============ SECURITY & SANITIZATION UTILITIES ============

// Strip HTML tags, dangerous scripts, control characters and trim
function sanitizeString(str, maxLen) {
  if (typeof str !== 'string') return '';
  maxLen = maxLen || 255;
  var clean = str
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove ASCII control characters
    .trim();
  return clean.slice(0, maxLen);
}

// RFC 5322 compliant simplified email validator
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  var clean = email.trim();
  if (clean.indexOf('..') !== -1) return false;
  var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(clean) && clean.length <= 254;
}

// Validate phone number format (digits, spaces, +, -, parentheses)
function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  var digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 7 && digitsOnly.length <= 16;
}

// Global cooldown tracker to prevent submission spam/flooding
var _lastSubmitTimestamp = 0;
var SUBMIT_COOLDOWN_MS = 8000; // 8 seconds cooldown

// Ensure all external target="_blank" links have rel="noopener noreferrer" (Anti-Tabnabbing)
function secureExternalLinks() {
  var externalLinks = document.querySelectorAll('a[target="_blank"]');
  externalLinks.forEach(function(link) {
    var rel = link.getAttribute('rel') || '';
    if (rel.indexOf('noopener') === -1 || rel.indexOf('noreferrer') === -1) {
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', secureExternalLinks);
  } else {
    secureExternalLinks();
  }
}

// ============ FORM HANDLERS ============

function _bindComoNosEncontroHandlers(form) {
  var sel = form.querySelector('[name="comoNosEncontro"]');
  if (!sel) return;
  sel.addEventListener('change', function () {
    var referidoInput = form.querySelector('[name="comoNosEncontroNombre"]');
    var otrosInput    = form.querySelector('[name="otrosMedios"]');
    var showReferido  = this.value === 'referido-otro';
    var showOtros     = this.value === 'otros';
    if (referidoInput) {
      referidoInput.style.display = showReferido ? 'block' : 'none';
      if (showReferido) { referidoInput.focus(); if (otrosInput) otrosInput.value = ''; }
      else referidoInput.value = '';
    }
    if (otrosInput) {
      otrosInput.style.display = showOtros ? 'block' : 'none';
      if (showOtros) { otrosInput.focus(); if (referidoInput) referidoInput.value = ''; }
      else otrosInput.value = '';
    }
  });
}

// Automatically inject an invisible honeypot trap field to catch automated bots
function _injectHoneypot(form) {
  if (form.querySelector('input[name="_cias_sec_hp"]')) return;
  var hp = document.createElement('input');
  hp.type = 'text';
  hp.name = '_cias_sec_hp';
  hp.tabIndex = -1;
  hp.setAttribute('autocomplete', 'off');
  hp.setAttribute('aria-hidden', 'true');
  hp.style.cssText = 'position:absolute;left:-9999px;top:-9999px;opacity:0;height:0;width:0;z-index:-1;pointer-events:none;';
  form.appendChild(hp);
}

// Build secure mailto link with sanitized content
function submitLead(lead) {
  var lines = [
    'Nombre: ' + lead.nombre,
    'Teléfono: ' + (lead.telefono || 'No especificado'),
    'Email: ' + lead.email,
    'Ciudad/Estado/País: ' + [lead.ciudad, lead.estado, lead.pais].filter(Boolean).join(', '),
    'Monto de inversión: ' + (lead.montoInversion || 'No especificado'),
    'Región de interés: ' + (lead.region || 'Cualquiera'),
    'Proyecto de interés: ' + (lead.proyectoInteres || 'General'),
    'Razones: ' + (Array.isArray(lead.razones) ? lead.razones.join(', ') : lead.razones),
    '¿Cómo nos encontró?: ' + [lead.comoNosEncontro, lead.comoNosEncontroNombre, lead.otrosMedios].filter(Boolean).join(' / '),
    'Origen del formulario: ' + lead.source,
    'Fecha/Hora: ' + new Date().toLocaleString()
  ];
  var subject = 'Nueva consulta web — ' + (lead.nombre || lead.email || 'CIASA RD');
  var href = 'mailto:' + LEAD_NOTIFICATION_EMAIL +
    '?subject=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent(lines.join('\n'));
  window.location.href = href;
}

function initLeadForm(formId, source) {
  var form = document.getElementById(formId);
  if (!form) return;

  _bindComoNosEncontroHandlers(form);
  _injectHoneypot(form);

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // 1. Honeypot check (Silent discard for bots)
    var hpInput = form.querySelector('input[name="_cias_sec_hp"]');
    if (hpInput && hpInput.value.trim().length > 0) {
      console.warn("Seguridad: Intento de bot bloqueado.");
      showToast("Solicitud recibida correctamente.", "success");
      form.reset();
      return;
    }

    // 2. Anti-spam submission cooldown check
    var now = Date.now();
    if (now - _lastSubmitTimestamp < SUBMIT_COOLDOWN_MS) {
      var waitSecs = Math.ceil((SUBMIT_COOLDOWN_MS - (now - _lastSubmitTimestamp)) / 1000);
      showToast("Por favor espera " + waitSecs + " segundos antes de reenviar.", "error");
      return;
    }

    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn ? submitBtn.innerHTML : 'Enviar';

    var formData = new FormData(form);
    
    // 3. Extract & Sanitize all fields
    var lead = {
      nombre: sanitizeString(formData.get("nombre") || "", 100),
      telefono: sanitizeString(formData.get("telefono") || "", 30),
      email: sanitizeString(formData.get("email") || "", 100),
      zipCode: sanitizeString(formData.get("zipCode") || "", 20),
      ciudad: sanitizeString(formData.get("ciudad") || "", 60),
      estado: sanitizeString(formData.get("estado") || "", 60),
      pais: sanitizeString(formData.get("pais") || "", 60),
      montoInversion: sanitizeString(formData.get("montoInversion") || "", 50),
      region: sanitizeString(formData.get("region") || "", 50),
      razones: (formData.getAll("razones") || []).map(function(r) { return sanitizeString(r, 40); }),
      proyectoInteres: sanitizeString(formData.get("proyectoInteres") || "", 50),
      comoNosEncontro: sanitizeString(formData.get("comoNosEncontro") || "", 50),
      comoNosEncontroNombre: sanitizeString(formData.get("comoNosEncontroNombre") || "", 100),
      otrosMedios: sanitizeString(formData.get("otrosMedios") || "", 100),
      source: sanitizeString(source || "contacto", 30),
    };

    // 4. Strict Validations
    if (!lead.nombre || lead.nombre.length < 2) {
      showToast("Por favor ingresa tu nombre completo", "error");
      var nameEl = form.querySelector('[name="nombre"]');
      if (nameEl) nameEl.focus();
      return;
    }

    if (!lead.email && !lead.telefono) {
      showToast("Por favor ingresa un email o número de teléfono", "error");
      return;
    }

    if (lead.email && !isValidEmail(lead.email)) {
      showToast("Por favor ingresa un formato de email válido (ej: nombre@correo.com)", "error");
      var emailEl = form.querySelector('[name="email"]');
      if (emailEl) emailEl.focus();
      return;
    }

    if (lead.telefono && !isValidPhone(lead.telefono)) {
      showToast("Por favor ingresa un número de teléfono válido", "error");
      var phoneEl = form.querySelector('[name="telefono"]');
      if (phoneEl) phoneEl.focus();
      return;
    }

    // 5. Update UI to processing state (Defensive UX)
    _lastSubmitTimestamp = now;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Abriendo correo seguro...</span>';
    }

    submitLead(lead);

    showToast("¡Gracias " + lead.nombre.split(' ')[0] + "! Se abrirá tu correo para enviar la consulta.", "success");
    form.reset();

    setTimeout(function() {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }, 2000);
  });
}

// Enhanced Accessible Toast notification system
function showToast(message, type) {
  var existing = document.querySelector(".toast");
  if (existing) existing.remove();

  var toast = document.createElement("div");
  toast.className = "toast " + (type || "info");
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");

  var icon = type === "success" 
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;vertical-align:middle;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
    : type === "error"
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;vertical-align:middle;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    : '';

  toast.innerHTML = '<div style="display:flex;align-items:center;">' + icon + '<span>' + message + '</span></div>';
  document.body.appendChild(toast);

  requestAnimationFrame(function () {
    toast.classList.add("show");
  });

  setTimeout(function () {
    toast.classList.remove("show");
    setTimeout(function () {
      if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4500);
}

// Quick lead capture
function initQuickLeadForm(formId) {
  initLeadForm(formId, "hero");
}

// Project interest form
function initProjectLeadForm(formId, projectCode) {
  var form = document.getElementById(formId);
  if (!form) return;

  var hiddenInput = form.querySelector('input[name="proyectoInteres"]');
  if (hiddenInput) {
    hiddenInput.value = projectCode;
  }

  initLeadForm(formId, "proyecto");
}

function autoFillGeoLocation() { /* no-op in secure static build */ }

