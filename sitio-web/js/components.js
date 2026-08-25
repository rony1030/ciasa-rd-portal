// Shared UI Components for Bolsa Inmobiliaria
// Renders navbar and footer dynamically on all public pages
// Eliminates HTML duplication — change once, applies everywhere

(function () {
  'use strict';

  // Relative path root for this page (set by js/relpath.js); '' at root, '../' one level deep.
  var REL = (typeof window.relRoot === 'function') ? window.relRoot() : '';

  function currentLang() {
    try {
      if (typeof window.getLang === 'function') return window.getLang();
      if (window._lang) return window._lang;
    } catch (e) {}
    return 'es';
  }

  // ============ NAVBAR ============

  function renderNavbar() {
    var el = document.getElementById('navbar');
    if (!el) return;

    var lang = currentLang();

    // Detect current page for active state
    var path = window.location.pathname;
    function isActive(href) {
      if (href === '/') return path === '/' || path === '/index.html';
      return path.indexOf(href) === 0;
    }
    function ac(href) { return isActive(href) ? ' class="active"' : ''; }

    // Only render innerHTML if navbar is empty
    if (!el.firstElementChild) {
      el.innerHTML =
        '<div class="navbar-inner">' +
          '<a href="/" class="navbar-logo">' +
            '<img class="navbar-logomark" src="' + REL + 'assets/images/branding/ciasa-bolsa-inmobiliaria-logomark-transparent.png" alt="" aria-hidden="true">' +
            '<span class="navbar-logo-words">CIASA <span>Bolsa Inmobiliaria</span> <small class="navbar-tagline">Tu Ruta a la Prosperidad</small></span>' +
          '</a>' +
          '<ul class="navbar-links" id="navLinks">' +
            '<li><a href="/proyectos/"' + ac('/proyectos/') + ' data-i18n="nav.proyectos">Proyectos</a></li>' +
            '<li><a href="/mapa/"' + ac('/mapa/') + ' data-i18n="nav.mapa">Mapa</a></li>' +
            '<li class="navbar-dropdown">' +
              '<button type="button" class="navbar-dropdown-trigger" aria-expanded="false" aria-controls="advisoryMenu" data-i18n="nav.asesoria">Asesoría</button>' +
              '<ul class="navbar-dropdown-menu" id="advisoryMenu">' +
                '<li><a href="/invertir/"' + ac('/invertir/') + ' data-i18n="nav.guia">Guía de Inversión</a></li>' +
                '<li><a href="/wizard/"' + ac('/wizard/') + ' data-i18n="nav.wizard">Wizard de Inversión</a></li>' +
                '<li><a href="/herramientas/"' + ac('/herramientas/') + ' data-i18n="nav.calculadoras">Calculadoras</a></li>' +
                '<li><a href="/articulos/"' + ac('/articulos/') + ' data-i18n="nav.articulos">Artículos</a></li>' +
              '</ul>' +
            '</li>' +
            '<li><a href="/servicios/"' + ac('/servicios/') + ' data-i18n="nav.servicios">Servicios</a></li>' +
            '<li><a href="/nosotros/"' + ac('/nosotros/') + ' data-i18n="nav.nosotros">Nosotros</a></li>' +
            '<li><a href="/contacto/"' + ac('/contacto/') + ' data-i18n="nav.contacto">Contacto</a></li>' +
            '<li><a href="/contacto/" class="btn btn-primary btn-sm" style="background:#7DB33A!important;color:#FFFFFF!important;font-weight:700!important;text-shadow:0 1px 2px rgba(0,0,0,0.35)!important;" data-i18n="nav.invertir">Invertir Ahora</a></li>' +
            '<li><button class="search-trigger" onclick="openSearch()" aria-label="Buscar" data-i18n-title="nav.buscar" title="Buscar (Ctrl+K)">' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' +
            '</button></li>' +
            '<li class="lang-dropdown-wrap" id="langDropdownWrap">' +
              '<button class="lang-trigger" id="langTrigger" onclick="toggleLangDropdown(event)" aria-label="Idioma / Language" aria-expanded="false" aria-controls="langDropdownMenu">' +
                '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' +
                '<span id="langCurrentLabel">' + lang.toUpperCase() + '</span>' +
                '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>' +
              '</button>' +
              '<div class="lang-dropdown-menu" id="langDropdownMenu">' +
                '<button class="lang-btn lang-option' + (lang === 'es' ? ' active' : '') + '" data-lang="es" onclick="if(typeof setLang===\'function\')setLang(\'es\');closeLangDropdown()">Español</button>' +
                '<button class="lang-btn lang-option' + (lang === 'en' ? ' active' : '') + '" data-lang="en" onclick="if(typeof setLang===\'function\')setLang(\'en\');closeLangDropdown()">English</button>' +
                '<button class="lang-btn lang-option' + (lang === 'fr' ? ' active' : '') + '" data-lang="fr" onclick="if(typeof setLang===\'function\')setLang(\'fr\');closeLangDropdown()">Français</button>' +
              '</div>' +
            '</li>' +
          '</ul>' +
          '<button class="navbar-toggle" id="navToggle" type="button" aria-label="Abrir menú de navegación" aria-expanded="false" aria-controls="navLinks">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>' +
          '</button>' +
        '</div>';
    }

    function closeMobileMenu() {
      var links = document.getElementById('navLinks');
      var button = document.getElementById('navToggle');
      if (links) links.classList.remove('open');
      if (button) {
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Abrir menú de navegación');
      }
    }

    // Mobile toggle
    var toggleBtn = document.getElementById('navToggle');
    if (toggleBtn && !toggleBtn._hasToggleListener) {
      toggleBtn._hasToggleListener = true;
      toggleBtn.addEventListener('click', function () {
        var links = document.getElementById('navLinks');
        if (!links) return;
        var open = links.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggleBtn.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
      });
    }

    var dropdown = el.querySelector('.navbar-dropdown');
    var dropdownTrigger = el.querySelector('.navbar-dropdown-trigger');
    if (dropdown && dropdownTrigger && !dropdownTrigger._hasDropdownListener) {
      dropdownTrigger._hasDropdownListener = true;
      dropdownTrigger.addEventListener('click', function () {
        var open = dropdown.classList.toggle('open');
        dropdownTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    var navLinks = document.getElementById('navLinks');
    if (navLinks && !navLinks._hasLinkCloseListener) {
      navLinks._hasLinkCloseListener = true;
      navLinks.addEventListener('click', function (e) {
        if (e.target.closest('a')) closeMobileMenu();
      });
    }

    // Close lang dropdown on outside click
    if (!document._hasLangCloseListener) {
      document._hasLangCloseListener = true;
      document.addEventListener('click', function (e) {
        var wrap = document.getElementById('langDropdownWrap');
        if (wrap && !wrap.contains(e.target)) {
          wrap.classList.remove('open');
          var langButton = document.getElementById('langTrigger');
          if (langButton) langButton.setAttribute('aria-expanded', 'false');
        }
        if (dropdown && !dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
          if (dropdownTrigger) dropdownTrigger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Scroll effect
    if (!window._hasScrollListener) {
      window._hasScrollListener = true;
      window.addEventListener('scroll', function () {
        el.classList.toggle('scrolled', window.scrollY > 10);
      });
    }

    if (!window._hasNavResizeListener) {
      window._hasNavResizeListener = true;
      window.addEventListener('resize', function () {
        if (window.innerWidth > 1120) closeMobileMenu();
      });
    }

    // Apply i18n if non-Spanish
    if (typeof setLang === 'function' && lang !== 'es') {
      setLang(lang);
    }
  }

  // ============ FOOTER ============

  function renderFooter() {
    var el = document.getElementById('siteFooter');
    if (!el) return;

    el.className = 'footer';
    if (el.firstElementChild) return; // Keep existing static markup

    el.innerHTML =
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div>' +
            '<div class="footer-brand">' +
              '<img class="footer-logomark" src="' + REL + 'assets/images/branding/ciasa-bolsa-inmobiliaria-logomark-transparent.png" alt="" aria-hidden="true">' +
              '<span class="footer-brand-words">CIASA <span class="footer-brand-accent">Bolsa Inmobiliaria</span> <small class="navbar-tagline">Tu Ruta a la Prosperidad</small></span>' +
            '</div>' +
            '<p class="footer-description" data-i18n="footer.description">Conectamos a dominicanos en el exterior con las mejores oportunidades de inversión inmobiliaria en República Dominicana.</p>' +
          '</div>' +
          '<div>' +
            '<h4 class="footer-heading" data-i18n="footer.explorar">Explorar</h4>' +
            '<ul class="footer-links">' +
              '<li><a href="/proyectos/" data-i18n="nav.proyectos">Proyectos</a></li>' +
              '<li><a href="/mapa/">Mapa Interactivo</a></li>' +
              '<li><a href="/invertir/" data-i18n="nav.guia">Guía de Inversión</a></li>' +
              '<li><a href="/nosotros/" data-i18n="nav.nosotros">Nosotros</a></li>' +
              '<li><a href="/contacto/" data-i18n="nav.contacto">Contacto</a></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h4 class="footer-heading">Responsabilidad Social</h4>' +
            '<p style="font-size:var(--font-size-xs);color:var(--gray-400);line-height:1.6;margin:0 0 var(--space-3);">Parte de nuestro impacto va de regreso a la comunidad.</p>' +
            '<a href="https://www.evolutionfoundationusa.org.do" target="_blank" rel="noopener noreferrer" ' +
               'style="display:inline-flex;align-items:center;gap:6px;font-size:var(--font-size-sm);color:var(--teal);font-weight:600;text-decoration:none;">' +
              '❤ Evolution Foundation' +
            '</a>' +
          '</div>' +
          '<div>' +
            '<h4 class="footer-heading" data-i18n="footer.herramientas">Herramientas</h4>' +
            '<ul class="footer-links">' +
              '<li><a href="/herramientas/" data-i18n="nav.calculadoras">Calculadoras</a></li>' +
              '<li><a href="/faq/">Preguntas Frecuentes</a></li>' +
              '<li><a href="/crm-npi" style="color:var(--teal);font-weight:600;"><i class="fa-solid fa-chart-line" style="margin-right:4px;"></i> NPI CRM</a></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h4 class="footer-heading" data-i18n="footer.contacto">Contacto</h4>' +
            '<ul class="footer-links">' +
              '<li><a href="tel:+18092995233" data-sc="phone-href" data-sc-no-text>+1 (809) 299-5233</a></li>' +
              '<li><a href="mailto:paola.caram@ciasard.org.do" data-sc="email-href" data-sc-no-text>paola.caram@ciasard.org.do</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<p data-i18n-html="footer.rights">&copy; 2026 Bolsa Inmobiliaria. Todos los derechos reservados.</p>' +
          '<div style="display:flex;align-items:center;gap:16px;">' +
            '<a href="/crm-npi" class="footer-crm-badge" title="Panel de CRM & Leads"><i class="fa-solid fa-lock" style="font-size:0.75rem;margin-right:4px;"></i> NPI CRM</a>' +
            '<p>Powered by CIASA</p>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  // ============ SEARCH OVERLAY ============

  function renderSearchOverlay() {
    if (document.getElementById('searchOverlay')) return;

    var overlay = document.createElement('div');
    overlay.id = 'searchOverlay';
    overlay.className = 'search-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;justify-content:center;padding-top:15vh;';
    overlay.innerHTML =
      '<div id="searchContainer" style="background:white;border-radius:12px;width:90%;max-width:600px;max-height:70vh;overflow:auto;padding:24px;position:relative;">' +
        '<button onclick="closeSearch()" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:24px;cursor:pointer;">&times;</button>' +
        '<div id="searchInner"></div>' +
      '</div>';

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSearch();
    });

    document.body.appendChild(overlay);
  }

  // Search functions (global)
  var stopWords = ['de','del','el','la','los','las','un','una','unos','unas','en','con','por','para','al','a','y','o','e','que','se','su','es','lo','le','les','nos','me','te','mi','tu','si','no','ni','como','mas','pero','este','esta','estos','estas','son','ser','ha','han','fue','sido','tiene','hay','the','a','an','in','on','of','for','to','and','or','is','it','at','by','as','be','do','if','so','up','my','we','he','us'];
  var pagefindLoaded = false;

  window.openSearch = function () {
    var overlay = document.getElementById('searchOverlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
    if (!pagefindLoaded) {
      pagefindLoaded = true;
      var script = document.createElement('script');
      script.src = '/pagefind/pagefind-ui.js';
      script.onload = function () {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/pagefind/pagefind-ui.css';
        document.head.appendChild(link);
        new PagefindUI({
          element: '#searchInner',
          showSubResults: true,
          processTerm: function (term) {
            return term.split(/\s+/).filter(function (w) {
              return stopWords.indexOf(w.toLowerCase()) === -1;
            }).join(' ');
          }
        });
        setTimeout(function () {
          var input = document.querySelector('#searchInner input');
          if (input) input.focus();
        }, 100);
      };
      document.head.appendChild(script);
    } else {
      setTimeout(function () {
        var input = document.querySelector('#searchInner input');
        if (input) input.focus();
      }, 50);
    }
  };

  window.closeSearch = function () {
    var overlay = document.getElementById('searchOverlay');
    if (!overlay) return;
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
  };

  // Keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      var overlay = document.getElementById('searchOverlay');
      if (overlay && overlay.style.display === 'flex') closeSearch();
      else openSearch();
    }
    if (e.key === 'Escape') {
      closeSearch();
      closeLangDropdown();
      var links = document.getElementById('navLinks');
      var navButton = document.getElementById('navToggle');
      var dropdown = document.querySelector('#navbar .navbar-dropdown');
      var dropdownButton = document.querySelector('#navbar .navbar-dropdown-trigger');
      if (links) links.classList.remove('open');
      if (navButton) {
        navButton.setAttribute('aria-expanded', 'false');
        navButton.setAttribute('aria-label', 'Abrir menú de navegación');
      }
      if (dropdown) dropdown.classList.remove('open');
      if (dropdownButton) dropdownButton.setAttribute('aria-expanded', 'false');
    }
  });

  // ============ LANGUAGE DROPDOWN ============

  window.toggleLangDropdown = function (e) {
    e.stopPropagation();
    var wrap = document.getElementById('langDropdownWrap');
    var button = document.getElementById('langTrigger');
    if (wrap) {
      var open = wrap.classList.toggle('open');
      if (button) button.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
  };

  window.closeLangDropdown = function () {
    var wrap = document.getElementById('langDropdownWrap');
    if (wrap) wrap.classList.remove('open');
    var button = document.getElementById('langTrigger');
    if (button) button.setAttribute('aria-expanded', 'false');
  };

  // ============ INIT ============

  window.renderNavbar = renderNavbar;
  window.renderFooter = renderFooter;

  function init() {
    try { renderNavbar(); } catch (e) { console.error('Navbar init error:', e); }
    try { renderFooter(); } catch (e) { console.error('Footer init error:', e); }
    try { renderSearchOverlay(); } catch (e) { console.error('Search init error:', e); }
  }

  // components.js is loaded after the static navbar/footer markup. Initialize
  // immediately so navigation remains interactive even if a later third-party
  // map script is slow or unavailable.
  if (document.getElementById('navbar') || document.getElementById('siteFooter')) {
    init();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
