(function () {
  const inSubdir = window.location.pathname.includes('/pages/');
  const root = inSubdir ? '../' : '';
  const currentFile = decodeURIComponent(window.location.pathname.split('/').pop() || '');
  const isHome = currentFile === 'index.html' || currentFile === '';

  // ── Styles ──────────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent =
    ".nav-wrapper{background:#210f36;padding:10px max(48px,calc((100vw - 1280px) / 2));border-bottom:1px solid rgba(64,140,132,.2);display:flex;align-items:center;gap:20px;font-family:'Roboto',sans-serif;flex-wrap:wrap;" +
    "position:fixed;top:0;left:0;right:0;z-index:1000;transform:translateY(0);transition:transform .3s ease,box-shadow .3s ease;}" +
    '.nav-wrapper.nav-hidden{transform:translateY(-100%);}' +
    '.nav-wrapper.nav-scrolled{box-shadow:0 4px 20px rgba(0,0,0,.4);}' +
    '.nav-divider{width:1px;height:20px;background:rgba(255,255,255,.15);flex-shrink:0;}' +
    '.nav-seq{display:flex;align-items:center;gap:0;flex-wrap:wrap;}' +
    '.nav-step{display:flex;align-items:center;gap:7px;text-decoration:none;padding:6px 12px;border-radius:6px;transition:background .2s,color .2s;position:relative;}' +
    '.nav-step-num{font-size:10px;font-weight:700;color:#4f9990;letter-spacing:.08em;opacity:.7;line-height:1;}' +
    '.nav-step-label{font-size:13px;font-weight:500;color:#7a7a8c;white-space:nowrap;transition:color .2s;}' +
    '.nav-step:hover .nav-step-label{color:#c8c8d8;}' +
    '.nav-step:hover .nav-step-num{opacity:1;}' +
    '.nav-step.active .nav-step-num{opacity:1;color:#4f9990;}' +
    '.nav-step.active .nav-step-label{color:#fff;font-weight:600;}' +
    '.nav-step.active{background:rgba(64,140,132,.12);}' +
    '.nav-step.active::after{content:"";position:absolute;bottom:0;left:12px;right:12px;height:2px;background:#4f9990;border-radius:2px 2px 0 0;}' +
    '.nav-arrow{color:rgba(255,255,255,.2);font-size:14px;padding:0 2px;user-select:none;flex-shrink:0;}' +
    '.nav-next-banner{background:#210f36;border-top:1px solid rgba(64,140,132,.2);}' +
    ".nav-next-link{display:flex;align-items:center;gap:20px;padding:36px max(64px,calc((100% - 1280px) / 2));text-decoration:none;transition:background .25s;font-family:'Roboto',sans-serif;}" +
    '.nav-next-link:hover{background:rgba(64,140,132,.06);}' +
    '.nav-next-eyebrow{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#4f9990;white-space:nowrap;}' +
    '.nav-next-title{font-size:17px;font-weight:600;color:#fff;}' +
    '.nav-next-num{font-size:17px;font-weight:700;color:#4f9990;margin-right:4px;}' +
    '.nav-next-arrow{margin-left:auto;font-size:22px;color:#4f9990;transition:transform .25s;}' +
    '.nav-next-link:hover .nav-next-arrow{transform:translateX(5px);}' +
    '@media(max-width:900px){.nav-step-label{max-width:120px;overflow:hidden;text-overflow:ellipsis;}.nav-next-link{padding:28px 24px;}}' +
    '@media(max-width:640px){.nav-step-label{display:none;}.nav-step{padding:6px 8px;}.nav-step-num{font-size:12px;opacity:1;}}';
  document.head.appendChild(style);

  // ── Nav HTML ─────────────────────────────────────────────────────────────────
  const navEl = document.createElement('div');
  navEl.className = 'nav-wrapper';
  navEl.innerHTML =
    '<a href="' + root + 'index.html" class="nav-step' + (isHome ? ' active' : '') + '" aria-current="' + (isHome ? 'page' : '') + '">' +
    '<span class="nav-step-num">00</span>' +
    '<span class="nav-step-label">Design with AI</span>' +
    '</a>' +
    '<div class="nav-divider"></div>' +
    '<div class="nav-seq" id="nav-seq"></div>';

  const currentScript = document.currentScript;
  currentScript.parentNode.insertBefore(navEl, currentScript);

  // Push page content down so fixed nav doesn't overlap it
  function syncBodyPadding() {
    document.body.style.paddingTop = navEl.offsetHeight + 'px';
  }
  requestAnimationFrame(syncBodyPadding);
  window.addEventListener('resize', syncBodyPadding, { passive: true });

  // ── Scroll hide/show ─────────────────────────────────────────────────────────
  var lastScrollY = 0;
  var navVisible = true;

  function showNav() {
    if (!navVisible) {
      navEl.classList.remove('nav-hidden');
      navVisible = true;
    }
  }
  function hideNav() {
    if (navVisible) {
      navEl.classList.add('nav-hidden');
      navVisible = false;
    }
  }

  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (y < 60) {
      showNav();
      navEl.classList.remove('nav-scrolled');
    } else {
      navEl.classList.add('nav-scrolled');
      if (y > lastScrollY + 8) {
        hideNav();
      } else if (y < lastScrollY - 8) {
        showNav();
      }
    }
    lastScrollY = y;
  }, { passive: true });

  // Show nav when cursor approaches the top of the screen
  document.addEventListener('mousemove', function (e) {
    if (e.clientY < 72) showNav();
  }, { passive: true });

  // ── Page sequence helpers ────────────────────────────────────────────────────
  function addNavStep(filename, index) {
    const seq = document.getElementById('nav-seq');
    const num = String(index + 1).padStart(2, '0');
    const label = filename.replace(/\.[^/.]+$/, '').replace(/^\d+\s+/, '');
    const isActive = currentFile === filename;

    if (index > 0) {
      const arrow = document.createElement('span');
      arrow.className = 'nav-arrow';
      arrow.textContent = '›';
      seq.appendChild(arrow);
    }

    const a = document.createElement('a');
    a.href = root + 'pages/' + encodeURIComponent(filename);
    a.className = 'nav-step' + (isActive ? ' active' : '');
    a.setAttribute('aria-current', isActive ? 'page' : '');
    a.innerHTML =
      '<span class="nav-step-num">' + num + '</span>' +
      '<span class="nav-step-label">' + label + '</span>';
    seq.appendChild(a);
  }

  function injectNextStep(filename, stepNum) {
    if (!filename) return;
    const label = filename.replace(/\.[^/.]+$/, '').replace(/^\d+\s+/, '');
    const href = root + 'pages/' + encodeURIComponent(filename);

    const banner = document.createElement('div');
    banner.className = 'nav-next-banner';
    banner.innerHTML =
      '<a href="' + href + '" class="nav-next-link">' +
      '<span class="nav-next-eyebrow">Up next</span>' +
      '<span class="nav-next-title"><span class="nav-next-num">' + stepNum + '</span>' + label + '</span>' +
      '<span class="nav-next-arrow">→</span>' +
      '</a>';

    function insert() {
      const footer = document.querySelector('.page-footer');
      if (footer) footer.parentNode.insertBefore(banner, footer);
      else document.body.appendChild(banner);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', insert);
    } else {
      insert();
    }
  }

  // ── Load pages ───────────────────────────────────────────────────────────────
  async function loadPages() {
    var pages = [];

    // Try local directory listing (works with python -m http.server)
    try {
      const res = await fetch(root + 'pages/');
      if (res.ok) {
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const files = Array.from(doc.querySelectorAll('a[href]'))
          .map(function (a) { return a.getAttribute('href'); })
          .filter(function (h) { return h && !h.startsWith('?') && !h.startsWith('/') && h !== '../' && !h.endsWith('/'); });
        if (files.length) pages = files.map(function (h) { return decodeURIComponent(h); });
      }
    } catch (e) {}

    // Fall back to GitHub API (works on GitHub Pages)
    if (!pages.length) {
      try {
        const res = await fetch('https://api.github.com/repos/lustandfury/medpace_UX_analysis/contents/pages');
        const data = await res.json();
        if (Array.isArray(data)) {
          pages = data.filter(function (f) { return f.type === 'file'; }).map(function (f) { return f.name; });
        }
      } catch (e) {}
    }

    pages.forEach(function (name, i) { addNavStep(name, i); });

    // Determine next page and inject footer CTA
    var nextFile = null;
    var nextNum = '';
    if (isHome && pages.length) {
      nextFile = pages[0];
      nextNum = '01';
    } else {
      var idx = pages.findIndex(function (p) { return p === currentFile; });
      if (idx >= 0 && idx < pages.length - 1) {
        nextFile = pages[idx + 1];
        nextNum = String(idx + 2).padStart(2, '0');
      }
    }
    injectNextStep(nextFile, nextNum);
  }

  loadPages();
})();
