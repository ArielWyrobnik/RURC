/* =========================================================
   RURC — interactions & effects
   Vanilla JS, no dependencies. Respects prefers-reduced-motion.
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Current year in footer ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar: scrolled state + progress bar + back-to-top ---------- */
  const nav = $("#nav");
  const progress = $("#scrollProgress");
  const toTop = $("#toTop");

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 24);
    if (toTop) toTop.classList.toggle("show", y > 600);

    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" }));

  /* ---------- Mobile menu ---------- */
  const toggle = $("#navToggle");
  const menu = $("#navMenu");
  if (toggle && menu) {
    const setOpen = (open) => {
      toggle.classList.toggle("open", open);
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
    $$(".nav__link, .nav__cta", menu).forEach((l) => l.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = $$(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$("[data-count]");
  // Years (e.g. 2025) should not get a thousands separator -> data-group="false".
  const fmt = (el, n) => (el.dataset.group === "false" ? String(n) : n.toLocaleString());
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const dur = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = fmt(el, Math.round(target * eased)) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      counters.forEach((el) => (el.textContent = fmt(el, parseFloat(el.dataset.count)) + (el.dataset.suffix || "")));
    } else {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach((el) => cio.observe(el));
    }
  }

  /* ---------- Scrollspy: highlight active nav link ---------- */
  const sections = $$("section[id]");
  const navLinks = $$(".nav__link");
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Card cursor-tracking glow ---------- */
  $$(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
    });
  });

  /* ---------- Magnetic buttons ---------- */
  if (!prefersReduced && window.matchMedia("(pointer: fine)").matches) {
    $$("[data-magnetic]").forEach((btn) => {
      const strength = 0.32;
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
    });
  }

  /* ---------- Hero canvas: node network ---------- */
  const canvas = $("#heroCanvas");
  if (canvas && !prefersReduced) initNetwork(canvas);

  function initNetwork(cv) {
    const ctx = cv.getContext("2d");
    let w, h, dpr, nodes, raf, mouse = { x: -9999, y: -9999 };
    const COLOR = "27, 47, 181"; // brand blue rgb

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = cv.getBoundingClientRect();
      w = rect.width; h = rect.height;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(Math.floor((w * h) / 16000), 90);
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.8,
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // gentle attraction toward cursor
        const dxm = mouse.x - n.x, dym = mouse.y - n.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 160) { n.x += dxm * 0.0016; n.y += dym * 0.0016; }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLOR}, 0.55)`;
        ctx.fill();
      }
      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${COLOR}, ${0.16 * (1 - d / 130)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    }

    const heroEl = cv.closest(".hero");
    window.addEventListener("pointermove", (e) => {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    window.addEventListener("pointerout", () => { mouse.x = -9999; mouse.y = -9999; });

    // Pause when hero is off-screen to save CPU
    if ("IntersectionObserver" in window && heroEl) {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { if (!raf) frame(); }
          else { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0 }).observe(heroEl);
    }

    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(size, 200); });
    size();
    frame();
  }
})();
