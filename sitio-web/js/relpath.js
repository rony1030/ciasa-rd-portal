// Portable-paths helper for CIASA RD
// Prevents recursive MutationObserver loops and handles relative paths safely

(function () {
  'use strict';

  // In HTTP/HTTPS server environments, URLs are already absolute domain-relative
  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    window.relRoot = function () { return ''; };
    return; // Exit immediately on web servers to prevent any DOM mutation overhead
  }

  function relRoot() {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute('src') || '';
      var j = src.indexOf('js/relpath.js');
      if (j >= 0) return src.slice(0, j); // "" at root, "../" one level deep, etc.
    }
    return '';
  }
  var REL = relRoot();
  window.relRoot = function () { return REL; };

  function rel(v) {
    if (!v || v.charAt(0) !== '/' || v.charAt(1) === '/') return v;
    return REL + (v === '/' ? 'index.html' : v.slice(1));
  }

  function fixEl(el) {
    if (!el || el.nodeType !== 1 || !el.getAttribute) return;
    var h = el.getAttribute('href');
    if (h && h.charAt(0) === '/' && h.charAt(1) !== '/') {
      var targetH = rel(h);
      if (targetH !== h) el.setAttribute('href', targetH);
    }
    var s = el.getAttribute('src');
    if (s && s.charAt(0) === '/' && s.charAt(1) !== '/') {
      var targetS = rel(s);
      if (targetS !== s) el.setAttribute('src', targetS);
    }
    var st = el.getAttribute('style');
    if (st && st.indexOf('url(') >= 0 && /url\((['"]?)\/(?!\/)/.test(st)) {
      var targetSt = st.replace(/url\((['"]?)\/(?!\/)/g, 'url($1' + REL);
      if (targetSt !== st) el.setAttribute('style', targetSt);
    }
  }

  function scan(node) {
    if (!node || node.nodeType !== 1) return;
    fixEl(node);
    var kids = node.querySelectorAll ? node.querySelectorAll('[href],[src],[style]') : [];
    for (var i = 0; i < kids.length; i++) fixEl(kids[i]);
  }

  function initial() { scan(document.documentElement); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initial);
  } else {
    initial();
  }
})();
