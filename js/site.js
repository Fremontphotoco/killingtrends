// Killing Trends — shared behaviour: viewport frame, phone menu, scroll reveals,
// colour-on-scroll for touch screens.
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Corner squares framing the viewport
  var vf = document.createElement('div');
  vf.className = 'vframe';
  vf.setAttribute('aria-hidden', 'true');
  vf.innerHTML = '<i></i><i></i><i></i><i></i>';
  document.body.appendChild(vf);

  // Add bottom corner squares to every .frame
  document.querySelectorAll('.frame').forEach(function (f) {
    if (f.querySelector(':scope > .c1')) return;
    var a = document.createElement('span'); a.className = 'c1';
    var b = document.createElement('span'); b.className = 'c2';
    f.appendChild(a); f.appendChild(b);
  });

  // Phone menu: one [menu] button opens a full-screen list of the header links
  var header = document.querySelector('.site-header');
  if (header) {
    var links = header.querySelectorAll('nav a');
    var btn = document.createElement('button');
    btn.className = 'menu-btn';
    btn.type = 'button';
    btn.textContent = 'menu';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'menu-panel');
    header.appendChild(btn);

    var panel = document.createElement('div');
    panel.className = 'menu-panel';
    panel.id = 'menu-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Site menu');
    var close = document.createElement('button');
    close.className = 'btn close';
    close.type = 'button';
    close.textContent = 'close';
    panel.appendChild(close);
    links.forEach(function (l) {
      var c = l.cloneNode(true);
      panel.appendChild(c);
    });
    document.body.appendChild(panel);

    function setOpen(open) {
      panel.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', String(open));
      (open ? panel.querySelector('a') : btn).focus();
    }
    btn.addEventListener('click', function () { setOpen(true); });
    close.addEventListener('click', function () { setOpen(false); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) setOpen(false); });
  }

  var hasIO = 'IntersectionObserver' in window;

  // Background videos: make sure they autoplay on phones. Some phones (iPhone Low
  // Power Mode, data saver) ignore the autoplay attribute until the visitor touches
  // the page, so we also start them when they scroll into view and on the first
  // tap/scroll. Off-screen videos pause to save battery and data.
  var bgVideos = Array.prototype.slice.call(document.querySelectorAll('video[autoplay]'));
  if (bgVideos.length) {
    var tryPlay = function (v) {
      v.muted = true; v.defaultMuted = true; v.playsInline = true;
      v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    };
    var visible = new Set();
    if (hasIO) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target;
          if (en.isIntersecting) { visible.add(v); tryPlay(v); }
          else { visible.delete(v); if (!v.paused) v.pause(); }
        });
      }, { threshold: 0.15 });
      bgVideos.forEach(function (v) { vio.observe(v); });
    } else {
      bgVideos.forEach(tryPlay);
    }
    var kick = function () {
      (hasIO ? Array.from(visible) : bgVideos).forEach(function (v) { if (v.paused) tryPlay(v); });
    };
    ['touchstart', 'pointerdown', 'scroll', 'keydown'].forEach(function (ev) {
      addEventListener(ev, kick, { passive: true });
    });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) kick(); });
  }

  // Reveal on scroll
  var els = document.querySelectorAll('.rv');
  if (reduce || !hasIO) {
    els.forEach(function (e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  // Touch screens can't hover: show photos in colour while they sit mid-screen
  if (hasIO && matchMedia('(hover: none)').matches) {
    var lit = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('lit', en.isIntersecting); });
    }, { rootMargin: '-35% 0px -35% 0px' });
    document.querySelectorAll('.duo.hover-reveal').forEach(function (d) { lit.observe(d); });
  }
})();
