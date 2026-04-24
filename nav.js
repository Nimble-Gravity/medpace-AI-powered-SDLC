(function () {

  // ── Craft manifest ────────────────────────────────────────────────────────
  var CRAFTS = [
    {
      id: 'requirements',
      label: 'Product',
      color: '#8c47e4',
      navColor: '#c4b5fd',
      pages: [
        '01 AI Multiplier Effect',
        '02 Stakeholder Intake',
        '03 AI-Ready Requirements'
      ]
    },
    {
      id: 'design',
      label: 'Design',
      color: '#4f9990',
      navColor: '#6ee7df',
      pages: [
        '01 PRD UX Analysis Skill',
        '02 Example PRD Interview',
        '03 Designing with LLMs'
      ]
    },
    {
      id: 'handoff',
      label: 'Handoff',
      color: '#3c7a6b',
      navColor: '#8dd8c5',
      pages: [
        '01 Handoff'
      ]
    },
    {
      id: 'development',
      label: 'Development',
      color: '#2b6880',
      navColor: '#7dd3e8',
      pages: [
        '01 Models, Prompts & Context',
        '02 Agents, Skills & Planning',
        '03 MCP, Context Hygiene & Scaling',
        '04 Audit-Ready Release Automation'
      ]
    },
    {
      id: 'qa',
      label: 'QA & Testing',
      color: '#e8a317',
      navColor: '#f2c56b',
      pages: [
        '01 AI-Assisted Test Generation',
        '02 PR Gates, Reports & Traceability',
        '03 Playwright, Evidence & GxP'
      ]
    }
  ];

  // ── Path detection ────────────────────────────────────────────────────────
  var pathParts   = window.location.pathname.split('/').filter(Boolean);
  var pagesIdx    = pathParts.indexOf('pages');
  var inPages     = pagesIdx !== -1 && pathParts.length > pagesIdx + 1;
  var craftFolder = inPages ? pathParts[pagesIdx + 1] : null;
  var currentFile = inPages ? decodeURIComponent(pathParts[pathParts.length - 1]) : '';
  var root        = inPages ? '../../' : '';
  var isHome      = !inPages;

  function ensureIconoirStylesheet() {
    if (document.getElementById('iconoir-css')) return;

    var link = document.createElement('link');
    link.id = 'iconoir-css';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/gh/iconoir-icons/iconoir@main/css/iconoir.css';
    document.head.appendChild(link);
  }

  ensureIconoirStylesheet();

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Styles ────────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent =
    "@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap');" +

    // Wrapper — two-row column layout
    ".nav-wrapper{background:#210f36;border-bottom:1px solid rgba(255,255,255,.08);" +
    "display:flex;flex-direction:column;font-family:'Roboto',sans-serif;" +
    "position:fixed;top:0;left:0;right:0;z-index:1000;" +
    "transform:translateY(0);transition:transform .3s ease,box-shadow .3s ease;}" +
    '.nav-wrapper.nav-hidden{transform:translateY(-100%);}' +
    '.nav-wrapper.nav-scrolled{box-shadow:0 4px 24px rgba(0,0,0,.5);}' +

    // Top row
    ".nav-top{display:flex;align-items:stretch;padding:0 max(48px,calc((100vw - 1280px) / 2));min-height:48px;}" +

    // Sub row (steps)
    ".nav-sub{display:flex;align-items:center;padding:0 max(48px,calc((100vw - 1280px) / 2));height:36px;" +
    "border-top:1px solid rgba(255,255,255,.06);overflow:hidden;}" +

    // Home link
    '.nav-home{display:flex;align-items:center;gap:9px;text-decoration:none;' +
    'padding:0 12px 0 0;margin-right:4px;flex-shrink:0;' +
    'border-bottom:2px solid transparent;transition:border-color .2s;}' +
    '.nav-home.active{border-bottom-color:#4f9990;}' +
    '.nav-home-icon{display:inline-flex;align-items:center;justify-content:center;font-size:15px;line-height:1;color:#b1adc4;flex-shrink:0;transition:color .2s;}' +
    '.nav-home-label{font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#b1adc4;white-space:nowrap;transition:color .2s;}' +
    '.nav-home:hover .nav-home-label,.nav-home:hover .nav-home-icon{color:#ffffff;}' +
    '.nav-home.active .nav-home-label,.nav-home.active .nav-home-icon{color:#fff;}' +

    // Vertical divider
    '.nav-vdivider{width:1px;background:rgba(255,255,255,.1);align-self:stretch;flex-shrink:0;margin:0 4px;}' +

    // Craft labels (top row only — no inline steps)
    '.nav-craft{display:flex;align-items:center;padding:0 8px;flex-shrink:0;' +
    'border-bottom:2px solid transparent;transition:border-color .2s;}' +
    '.nav-craft.nav-craft--active{border-bottom-color:var(--nc,#4f9990);}' +
    '.nav-craft-name{font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;' +
    'color:#b1adc4;padding:0 2px;white-space:nowrap;transition:color .2s;cursor:default;text-decoration:none;}' +
    '.nav-craft--active .nav-craft-name{color:var(--nc,#4f9990);}' +
    '.nav-craft--haslink .nav-craft-name{cursor:pointer;}' +
    '.nav-craft--haslink:hover .nav-craft-name{color:#ffffff;}' +
    '.nav-craft--soon .nav-craft-name{color:#a6a2b7;}' +
    '.nav-craft--soon::after{content:"soon";font-size:11px;font-weight:700;letter-spacing:.06em;' +
    'text-transform:uppercase;color:#a6a2b7;margin-left:5px;padding:1px 5px;' +
    'border:1px solid #a6a2b7;border-radius:3px;}' +

    // Sub-row steps
    '.nav-sub-step{display:flex;align-items:center;gap:6px;text-decoration:none;padding:0 8px;' +
    'height:100%;border-bottom:2px solid transparent;flex-shrink:0;' +
    'opacity:0;animation:navStepIn .22s ease forwards;}' +
    '.nav-sub-step.active{border-bottom-color:var(--nc,#4f9990);}' +
    '.nav-sub-num{font-size:11px;font-weight:700;letter-spacing:.06em;color:#a6a2b7;transition:color .2s;}' +
    '.nav-sub-label{font-size:13px;font-weight:500;color:#b1adc4;white-space:nowrap;transition:color .2s;}' +
    '.nav-sub-step:hover .nav-sub-label{color:#ffffff;}' +
    '.nav-sub-step:hover .nav-sub-num{color:#cbc7db;}' +
    '.nav-sub-step.active .nav-sub-num{color:var(--nc,#4f9990);}' +
    '.nav-sub-step.active .nav-sub-label{color:#fff;font-weight:600;}' +
    '.nav-sub-arrow{color:#8f8aa6;font-size:12px;padding:0 1px;user-select:none;flex-shrink:0;' +
    'opacity:0;animation:navStepIn .18s ease forwards;}' +

    // Step entrance animation
    '@keyframes navStepIn{from{opacity:0;transform:translateY(-7px)}to{opacity:1;transform:translateY(0)}}' +
    '@keyframes navItemReveal{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}' +
    '@media(prefers-reduced-motion:reduce){.nav-sub-step,.nav-sub-arrow{animation:none;opacity:1;transform:none;}}' +

    // ── Hamburger button ──────────────────────────────────────────────────
    '.nav-hamburger{display:none;align-items:center;justify-content:center;' +
    'width:40px;height:40px;margin-left:auto;background:none;border:none;' +
    'cursor:pointer;padding:0;color:#b1adc4;transition:color .2s;flex-shrink:0;border-radius:8px;}' +
    '.nav-hamburger:hover{color:#fff;background:rgba(255,255,255,.06);}' +
    '.nav-hamburger:focus-visible{outline:2px solid #4f9990;outline-offset:2px;}' +
    '.nav-ham-icon{display:flex;flex-direction:column;gap:5px;width:20px;pointer-events:none;}' +
    '.nav-ham-line{display:block;height:2px;background:currentColor;border-radius:2px;' +
    'transition:transform .28s cubic-bezier(.4,0,.2,1),opacity .2s ease;}' +
    '.nav-wrapper.nav-menu-open .nav-ham-line:nth-child(1){transform:translateY(7px) rotate(45deg);}' +
    '.nav-wrapper.nav-menu-open .nav-ham-line:nth-child(2){opacity:0;transform:scaleX(0);}' +
    '.nav-wrapper.nav-menu-open .nav-ham-line:nth-child(3){transform:translateY(-7px) rotate(-45deg);}' +
    '@media(prefers-reduced-motion:reduce){.nav-ham-line{transition:none;}}' +

    // ── Mobile overlay ────────────────────────────────────────────────────
    '.nav-mobile-overlay{position:fixed;left:0;right:0;bottom:0;z-index:999;' +
    'background:#180b28;overflow-y:auto;overflow-x:hidden;' +
    'display:flex;flex-direction:column;' +
    'opacity:0;pointer-events:none;' +
    'transition:opacity .28s ease;}' +
    '.nav-mobile-overlay.nav-overlay-open{opacity:1;pointer-events:auto;}' +
    '@media(prefers-reduced-motion:reduce){.nav-mobile-overlay{transition:none;}}' +

    '.nav-overlay-body{padding:8px 20px 60px;display:flex;flex-direction:column;}' +

    '.nav-overlay-craft-group{margin-bottom:4px;}' +

    '.nav-overlay-craft-label{' +
    'display:flex;align-items:center;gap:10px;' +
    'font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;' +
    'color:var(--nc,#b1adc4);padding:20px 4px 8px;cursor:default;}' +
    '.nav-overlay-craft-label::after{content:"";flex:1;height:1px;background:rgba(255,255,255,.08);}' +
    '.nav-overlay-craft-label.active-craft{color:var(--nc,#fff);}' +

    '.nav-overlay-page-link{' +
    'display:flex;align-items:center;gap:14px;' +
    'padding:13px 16px;border-radius:10px;' +
    'text-decoration:none;color:#a8a4bc;' +
    'font-size:15px;font-weight:500;line-height:1.3;' +
    'border:1px solid transparent;' +
    'transition:background .18s ease,color .18s ease,border-color .18s ease;' +
    'opacity:0;}' +
    '.nav-overlay-page-link.nav-ol-animate{animation:navItemReveal .26s ease forwards;}' +
    '.nav-overlay-page-link.nav-ol-visible{opacity:1;}' +
    '.nav-overlay-page-link:hover{background:rgba(255,255,255,.06);color:#fff;border-color:rgba(255,255,255,.1);}' +
    '.nav-overlay-page-link.active{' +
    'background:rgba(255,255,255,.08);color:#fff;' +
    'border-color:rgba(255,255,255,.12);}' +
    '@media(prefers-reduced-motion:reduce){.nav-overlay-page-link{animation:none!important;opacity:1;}}' +

    '.nav-ol-num{font-size:11px;font-weight:700;letter-spacing:.06em;' +
    'color:var(--nc,#8f8aa6);flex-shrink:0;width:18px;text-align:right;}' +
    '.nav-overlay-page-link.active .nav-ol-num{color:var(--nc,#fff);}' +
    '.nav-ol-title{flex:1;min-width:0;}' +
    '.nav-ol-active-dot{width:6px;height:6px;border-radius:50%;' +
    'background:var(--nc,#4f9990);flex-shrink:0;opacity:0;transition:opacity .2s;}' +
    '.nav-overlay-page-link.active .nav-ol-active-dot{opacity:1;}' +

    // Home link inside overlay
    '.nav-overlay-home{' +
    'display:flex;align-items:center;gap:12px;padding:16px 16px 12px;' +
    'text-decoration:none;color:#b1adc4;' +
    'border-bottom:1px solid rgba(255,255,255,.08);' +
    'font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;' +
    'transition:color .18s;opacity:0;}' +
    '.nav-overlay-home.nav-ol-animate{animation:navItemReveal .22s ease forwards;}' +
    '.nav-overlay-home.nav-ol-visible{opacity:1;}' +
    '.nav-overlay-home:hover{color:#fff;}' +
    '.nav-overlay-home.active{color:#fff;}' +
    '@media(prefers-reduced-motion:reduce){.nav-overlay-home{animation:none!important;opacity:1;}}' +

    // Shared previous / next band
    '.nav-next-banner{position:relative;background:linear-gradient(180deg,#271344 0%,#210f36 100%);border-top:1px solid rgba(255,255,255,.14);box-shadow:0 -18px 44px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.04);}' +
    '.nav-next-banner::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(196,181,253,.08),transparent 32%,transparent 68%,rgba(110,231,223,.06));pointer-events:none;}' +
    ".nav-sequence-grid{position:relative;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;padding:28px max(64px,calc((100% - 1280px) / 2)) 22px;font-family:'Roboto',sans-serif;}" +
    '.nav-sequence-grid--single{grid-template-columns:minmax(0,1fr);}' +
    '.nav-sequence-card{position:relative;display:flex;align-items:center;gap:18px;min-height:112px;padding:24px 28px;border-radius:22px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(180deg,rgba(255,255,255,.055) 0%,rgba(255,255,255,.03) 100%);text-decoration:none;overflow:hidden;transition:transform .28s ease,background .28s ease,border-color .28s ease,box-shadow .28s ease;}' +
    '.nav-sequence-card::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at top,rgba(255,255,255,.11),transparent 58%);opacity:.45;pointer-events:none;}' +
    '.nav-sequence-card:hover{transform:translateY(-1px);background:linear-gradient(180deg,rgba(255,255,255,.07) 0%,rgba(255,255,255,.04) 100%);border-color:rgba(255,255,255,.18);box-shadow:0 18px 36px rgba(0,0,0,.18);}' +
    '.nav-sequence-card--prev{justify-content:flex-start;}' +
    '.nav-sequence-card--next{justify-content:flex-end;text-align:right;}' +
    '.nav-next-copy{position:relative;display:flex;flex:1 1 auto;width:100%;flex-direction:column;gap:9px;min-width:0;z-index:1;}' +
    '.nav-sequence-card--next .nav-next-copy{align-items:stretch;text-align:right;}' +
    '.nav-sequence-card--prev .nav-next-copy{align-items:stretch;text-align:left;}' +
    '.nav-next-meta{display:flex;align-items:center;gap:10px;min-width:0;}' +
    '.nav-sequence-card--next .nav-next-meta{justify-content:flex-end;}' +
    '.nav-next-direction,.nav-next-craft{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;}' +
    '.nav-next-divider{width:1px;height:12px;background:rgba(255,255,255,.18);flex:0 0 auto;}' +
    '.nav-next-title{display:block;width:100%;font-size:21px;font-weight:600;color:#fff;line-height:1.18;letter-spacing:-.01em;max-width:none;}' +
    '.nav-next-arrow{position:relative;z-index:1;font-size:24px;line-height:1;flex:0 0 auto;transition:transform .36s cubic-bezier(.18,.72,.2,1);}' +
    '.nav-sequence-card--next:hover .nav-next-arrow{transform:translateX(6px);}' +
    '.nav-sequence-card--prev:hover .nav-next-arrow{transform:translateX(-6px);}' +

    // ── Responsive ────────────────────────────────────────────────────────
    '@media(max-width:768px){' +
    '.nav-top{padding:0 16px;}' +
    '.nav-sub{display:none;}' +
    '.nav-hamburger{display:flex;}' +
    '.nav-vdivider,.nav-craft{display:none;}' +
    '.nav-sequence-grid{grid-template-columns:1fr;gap:14px;padding:22px 16px 18px;}' +
    '.nav-sequence-card{min-height:96px;padding:20px;}' +
    '.nav-next-title{font-size:18px;max-width:none;}' +
    '}' +

    '';
  document.head.appendChild(style);

  // ── Build nav ─────────────────────────────────────────────────────────────
  var navEl = document.createElement('div');
  navEl.className = 'nav-wrapper';

  // ── Top row ───────────────────────────────────────────────────────────────
  var topRow = document.createElement('div');
  topRow.className = 'nav-top';

  // Home link
  var homeEl = document.createElement('a');
  homeEl.href = root + 'index.html';
  homeEl.className = 'nav-home' + (isHome ? ' active' : '');
  homeEl.innerHTML =
    '<i class="nav-home-icon iconoir-book" aria-hidden="true"></i>' +
    '<span class="nav-home-label">SDLC Playbook</span>';
  topRow.appendChild(homeEl);

  // Craft labels
  CRAFTS.forEach(function (craft) {
    var isCurrent = craft.id === craftFolder;
    var hasPages  = craft.pages.length > 0;
    var isSoon    = craft.pages.length === 0;

    var divider = document.createElement('div');
    divider.className = 'nav-vdivider';
    topRow.appendChild(divider);

    var craftEl = document.createElement('div');
    craftEl.className = 'nav-craft' +
      (isCurrent  ? ' nav-craft--active'  : '') +
      (hasPages && !isCurrent ? ' nav-craft--haslink' : '') +
      (isSoon     ? ' nav-craft--soon'    : '');
    craftEl.style.setProperty('--nc', craft.navColor || craft.color);

    var nameEl;
    if (hasPages && !isCurrent) {
      nameEl = document.createElement('a');
      nameEl.href = root + 'pages/' + craft.id + '/' + encodeURIComponent(craft.pages[0] + '.html');
      nameEl.className = 'nav-craft-name';
    } else {
      nameEl = document.createElement('span');
      nameEl.className = 'nav-craft-name';
    }
    nameEl.textContent = craft.label;
    craftEl.appendChild(nameEl);
    topRow.appendChild(craftEl);
  });

  // ── Hamburger button ──────────────────────────────────────────────────────
  var hamburgerBtn = document.createElement('button');
  hamburgerBtn.className = 'nav-hamburger';
  hamburgerBtn.setAttribute('aria-label', 'Open navigation menu');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  hamburgerBtn.setAttribute('aria-controls', 'nav-mobile-overlay');
  hamburgerBtn.innerHTML =
    '<span class="nav-ham-icon" aria-hidden="true">' +
      '<span class="nav-ham-line"></span>' +
      '<span class="nav-ham-line"></span>' +
      '<span class="nav-ham-line"></span>' +
    '</span>';
  topRow.appendChild(hamburgerBtn);

  navEl.appendChild(topRow);

  // ── Sub row (steps for active craft only) ─────────────────────────────────
  var activeCraft = CRAFTS.find(function (c) { return c.id === craftFolder; }) || null;

  if (activeCraft && activeCraft.pages.length > 0) {
    var subRow = document.createElement('div');
    subRow.className = 'nav-sub';
    subRow.style.setProperty('--nc', activeCraft.color);

    activeCraft.pages.forEach(function (pageName, i) {
      // Arrow between steps
      if (i > 0) {
        var arrow = document.createElement('span');
        arrow.className = 'nav-sub-arrow';
        arrow.textContent = '›';
        arrow.style.animationDelay = (i * 90 - 30) + 'ms';
        subRow.appendChild(arrow);
      }

      var filename = pageName + '.html';
      var isActive = currentFile === filename;
      var label    = pageName;

      var stepA = document.createElement('a');
      stepA.href = root + 'pages/' + activeCraft.id + '/' + encodeURIComponent(filename);
      stepA.className = 'nav-sub-step' + (isActive ? ' active' : '');
      stepA.style.setProperty('--nc', activeCraft.color);
      stepA.style.animationDelay = (i * 90) + 'ms';
      stepA.setAttribute('aria-current', isActive ? 'page' : '');
      stepA.innerHTML =
        '<span class="nav-sub-label">' + label + '</span>';
      subRow.appendChild(stepA);
    });

    navEl.appendChild(subRow);
  }

  // Insert before the script tag
  var currentScript = document.currentScript;
  currentScript.parentNode.insertBefore(navEl, currentScript);

  // ── Mobile overlay ─────────────────────────────────────────────────────────
  var overlay = document.createElement('div');
  overlay.id = 'nav-mobile-overlay';
  overlay.className = 'nav-mobile-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Navigation menu');

  var overlayBody = document.createElement('div');
  overlayBody.className = 'nav-overlay-body';

  // Home link at top
  var overlayHome = document.createElement('a');
  overlayHome.href = root + 'index.html';
  overlayHome.className = 'nav-overlay-home' + (isHome ? ' active' : '');
  overlayHome.innerHTML =
    '<i class="iconoir-book" aria-hidden="true" style="font-size:16px;flex-shrink:0;"></i>' +
    '<span>SDLC Playbook</span>';
  overlayBody.appendChild(overlayHome);

  // Craft groups with page links
  var allOverlayLinks = [overlayHome];

  CRAFTS.forEach(function (craft) {
    if (!craft.pages.length) return;

    var group = document.createElement('div');
    group.className = 'nav-overlay-craft-group';

    var isCraftActive = craft.id === craftFolder;

    var craftLabel = document.createElement('div');
    craftLabel.className = 'nav-overlay-craft-label' + (isCraftActive ? ' active-craft' : '');
    craftLabel.style.setProperty('--nc', craft.navColor || craft.color);
    craftLabel.textContent = craft.label;
    group.appendChild(craftLabel);

    craft.pages.forEach(function (pageName) {
      var filename = pageName + '.html';
      var isActive = isCraftActive && currentFile === filename;
      var numMatch = pageName.match(/^(\d+)/);
      var num = numMatch ? numMatch[1].replace(/^0+/, '') : '';
      var title = pageName.replace(/^\d+\s+/, '');

      var link = document.createElement('a');
      link.href = root + 'pages/' + craft.id + '/' + encodeURIComponent(filename);
      link.className = 'nav-overlay-page-link' + (isActive ? ' active' : '');
      link.style.setProperty('--nc', craft.navColor || craft.color);
      link.setAttribute('aria-current', isActive ? 'page' : '');
      link.innerHTML =
        '<span class="nav-ol-num">' + num + '</span>' +
        '<span class="nav-ol-title">' + title + '</span>' +
        '<span class="nav-ol-active-dot" aria-hidden="true"></span>';

      group.appendChild(link);
      allOverlayLinks.push(link);
    });

    overlayBody.appendChild(group);
  });

  overlay.appendChild(overlayBody);

  // ── Overlay open / close ──────────────────────────────────────────────────
  var menuOpen = false;
  var scrollLockY = 0;

  function openMenu() {
    menuOpen = true;
    navEl.classList.add('nav-menu-open');
    overlay.classList.add('nav-overlay-open');
    overlay.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    hamburgerBtn.setAttribute('aria-label', 'Close navigation menu');

    // Position overlay top flush with nav bottom
    overlay.style.top = navEl.offsetHeight + 'px';

    // Scroll lock
    scrollLockY = window.scrollY;
    document.body.style.overflow = 'hidden';

    // Staggered item reveal
    if (!reducedMotion) {
      allOverlayLinks.forEach(function (el, i) {
        el.classList.remove('nav-ol-animate', 'nav-ol-visible');
        el.style.animationDelay = (i * 45 + 40) + 'ms';
        // Force reflow to restart animation
        void el.offsetWidth;
        el.classList.add('nav-ol-animate');
      });
    } else {
      allOverlayLinks.forEach(function (el) {
        el.classList.add('nav-ol-visible');
      });
    }
  }

  function closeMenu() {
    menuOpen = false;
    navEl.classList.remove('nav-menu-open');
    overlay.classList.remove('nav-overlay-open');
    overlay.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-label', 'Open navigation menu');

    // Restore scroll
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', function () {
    if (menuOpen) closeMenu(); else openMenu();
  });

  // Close on overlay link click
  allOverlayLinks.forEach(function (el) {
    el.addEventListener('click', function () {
      closeMenu();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (menuOpen && (e.key === 'Escape' || e.keyCode === 27)) {
      closeMenu();
      hamburgerBtn.focus();
    }
  });

  // Close when viewport goes wide (e.g. rotate to landscape tablet)
  window.addEventListener('resize', function () {
    if (menuOpen && window.innerWidth > 768) closeMenu();
    // Keep overlay top aligned
    if (overlay.classList.contains('nav-overlay-open')) {
      overlay.style.top = navEl.offsetHeight + 'px';
    }
  }, { passive: true });

  // Append overlay to body after nav is in DOM
  document.body.appendChild(overlay);

  // Sync body padding to nav height (accounts for one or two rows)
  function syncBodyPadding() {
    document.body.style.paddingTop = navEl.offsetHeight + 'px';
  }
  requestAnimationFrame(syncBodyPadding);
  window.addEventListener('resize', syncBodyPadding, { passive: true });

  // ── Scroll hide / show ────────────────────────────────────────────────────
  var lastScrollY = 0;
  var navVisible  = true;

  function showNav() { if (!navVisible) { navEl.classList.remove('nav-hidden'); navVisible = true; } }
  function hideNav() { if (navVisible)  { navEl.classList.add('nav-hidden');    navVisible = false; } }

  window.addEventListener('scroll', function () {
    // Never hide while mobile menu is open
    if (menuOpen) return;
    var y = window.scrollY;
    if (y < 60) { showNav(); navEl.classList.remove('nav-scrolled'); }
    else {
      navEl.classList.add('nav-scrolled');
      if (y > lastScrollY + 8) hideNav();
      else if (y < lastScrollY - 8) showNav();
    }
    lastScrollY = y;
  }, { passive: true });

  document.addEventListener('mousemove', function (e) {
    if (e.clientY < 72) showNav();
  }, { passive: true });

  // ── "Up next" footer banner ───────────────────────────────────────────────
  var linearSeq = [];
  CRAFTS.forEach(function (craft) {
    craft.pages.forEach(function (pageName, i) {
      linearSeq.push({
        craftId:    craft.id,
        craftLabel: craft.label,
        color:      craft.navColor || craft.color,
        file:       pageName + '.html',
        label:      pageName
      });
    });
  });

  function buildSequenceCard(entry, direction, labelText, isCraftTransition) {
    var href = root + 'pages/' + entry.craftId + '/' + encodeURIComponent(entry.file);
    var arrow = direction === 'next' ? '→' : '←';
    var directionColor = entry.color;
    var eyebrow = isCraftTransition
      ? (direction === 'next' ? 'Next craft' : 'Previous craft')
      : (direction === 'next' ? 'Up next' : 'Previous');

    return (
      '<a href="' + href + '" class="nav-sequence-card nav-sequence-card--' + direction + '">' +
        (direction === 'prev'
          ? '<span class="nav-next-arrow" style="color:' + directionColor + '">' + arrow + '</span>'
          : '') +
        '<span class="nav-next-copy">' +
          '<span class="nav-next-meta">' +
            '<span class="nav-next-direction" style="color:' + directionColor + '">' + eyebrow + '</span>' +
            '<span class="nav-next-divider" aria-hidden="true"></span>' +
            '<span class="nav-next-craft" style="color:' + directionColor + '">' + entry.craftLabel + '</span>' +
          '</span>' +
          '<span class="nav-next-title">' + labelText + '</span>' +
        '</span>' +
        (direction === 'next'
          ? '<span class="nav-next-arrow" style="color:' + directionColor + '">' + arrow + '</span>'
          : '') +
      '</a>'
    );
  }

  function injectNextStep() {
    var currentIdx = -1;
    if (!isHome) {
      linearSeq.forEach(function (entry, i) {
        if (entry.craftId === craftFolder && entry.file === currentFile) currentIdx = i;
      });
    }

    var previous = !isHome && currentIdx > 0 ? linearSeq[currentIdx - 1] : null;
    var next = isHome
      ? (linearSeq.length ? linearSeq[0] : null)
      : (currentIdx >= 0 && currentIdx < linearSeq.length - 1 ? linearSeq[currentIdx + 1] : null);

    function insert() {
      var footer = window.SDLCFooter && typeof window.SDLCFooter.ensure === 'function'
        ? window.SDLCFooter.ensure()
        : document.querySelector('.page-footer, footer');
      if (!previous && !next) return;

      var banner = document.createElement('div');
      var bannerCards = [];
      var gridClass = 'nav-sequence-grid' + (previous && next ? '' : ' nav-sequence-grid--single');

      banner.className = 'nav-next-banner';

      if (previous) {
        bannerCards.push(
          buildSequenceCard(
            previous,
            'prev',
            previous.label,
            linearSeq[currentIdx] && linearSeq[currentIdx].craftId !== previous.craftId
          )
        );
      }

      if (next) {
        bannerCards.push(
          buildSequenceCard(
            next,
            'next',
            next.label,
            !isHome && linearSeq[currentIdx] && linearSeq[currentIdx].craftId !== next.craftId
          )
        );
      }

      banner.innerHTML = '<div class="' + gridClass + '">' + bannerCards.join('') + '</div>';

      if (footer) footer.parentNode.insertBefore(banner, footer);
      else document.body.appendChild(banner);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', insert);
    else insert();
  }

  injectNextStep();

  // ── Tip-trick scroll reveal ───────────────────────────────────────────────
  (function initTipReveal() {
    if (!window.IntersectionObserver) return;
    if (reducedMotion) return;

    function revealCard(card) {
      card.classList.add('tt-visible');
    }

    function setup() {
      var cards = document.querySelectorAll('.tip-trick');
      if (!cards.length) return;

      var vh = window.innerHeight;
      if (!vh) return;

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            revealCard(e.target);
            observer.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' });

      var toAnimate = [];
      cards.forEach(function (card) {
        if (card.getBoundingClientRect().top > vh - 40) {
          card.classList.add('tt-anim');
          observer.observe(card);
          toAnimate.push(card);
        }
      });

      if (toAnimate.length) {
        setTimeout(function () {
          toAnimate.forEach(function (card) {
            if (!card.classList.contains('tt-visible')) revealCard(card);
          });
        }, 1500);
      }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
    else setup();
  })();

})();
