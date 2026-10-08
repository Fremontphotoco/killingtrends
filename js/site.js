// Killing Trends — shared behaviour: viewport frame, first-visit loader, scroll reveals.
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

  // Percentage loader, once per session
  var seen = false;
  try { seen = sessionStorage.getItem('kt-loaded') === '1'; } catch (e) {}
  if (!seen && !reduce) {
    var l = document.createElement('div');
    l.className = 'loader';
    l.setAttribute('aria-hidden', 'true');
    l.textContent = '0%';
    document.body.appendChild(l);
    var p = 0;
    var t = setInterval(function () {
      p = Math.min(100, p + 3 + Math.floor(Math.random() * 9));
      l.textContent = p + '%';
      if (p >= 100) {
        clearInterval(t);
        setTimeout(function () { l.classList.add('done'); }, 160);
        try { sessionStorage.setItem('kt-loaded', '1'); } catch (e) {}
      }
    }, 45);
  }

  // Reveal on scroll
  var els = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }
})();
