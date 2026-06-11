/* =========================================================================
   SLICE — interactions & motion
   ========================================================================= */
(function () {
  "use strict";

  // If any animation lib failed to load, fall back to the static no-JS experience
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || typeof Lenis === "undefined") {
    document.documentElement.classList.remove("js");
    document.body.classList.remove("is-loading");
    return;
  }

  const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const COARSE = window.matchMedia("(pointer: coarse)").matches;
  const STATIC = /[?&](static|nomotion)/.test(location.search);
  const FROZEN = RM || STATIC;

  gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------------ Lenis smooth scroll */
  let lenis = null;
  let closeMenu = () => {};
  function initLenis() {
    if (FROZEN) return;
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, smoothTouch: false });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  /* ------------------------------------------------ Loader: build the pizza */
  const STATUS = [
    "Wyrabiamy ciasto…",
    "Rozciągamy spód…",
    "Nakładamy sos San Marzano…",
    "Posypujemy mozzarellą…",
    "Dodajemy świeżą bazylię…",
    "Rozgrzewamy piec do 450°…",
    "Gotowe – czas na kawałek!"
  ];

  function runLoader() {
    const statusEl = document.getElementById("loaderStatus");
    const fill = document.getElementById("loaderFill");
    const pct = document.getElementById("loaderPct");
    statusEl.textContent = STATUS[0];

    if (FROZEN) {
      fill.style.width = "100%";
      pct.textContent = "100";
      statusEl.textContent = STATUS[6];
      revealSite(true);
      return;
    }

    const setStatus = (i) => () => { statusEl.textContent = STATUS[i]; };
    const counter = { v: 0 };
    const ease = "back.out(1.7)";

    gsap.set([".lp--pep", ".lp--basil"], { opacity: 1 });
    gsap.set([".lp--pep > *", ".lp--basil > *"], { opacity: 0, transformOrigin: "50% 50%" });
    gsap.set([".lp--base", ".lp--sauce", ".lp--cheese", ".lp--face"], { transformOrigin: "50% 50%" });

    const tl = gsap.timeline({ delay: 0.25, onComplete: () => revealSite(false) });

    tl.from(".lp--base", { scale: 0, opacity: 0, rotation: -45, duration: 0.55, ease });
    tl.add(setStatus(1));
    tl.fromTo(".lp--sauce", { opacity: 0, scale: 0.25 }, { opacity: 1, scale: 1, duration: 0.4, ease });
    tl.add(setStatus(2));
    tl.fromTo(".lp--cheese", { opacity: 0, scale: 0.35, y: -36 }, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease });
    tl.add(setStatus(3));
    tl.fromTo(".lp--pep > *", { opacity: 0, scale: 0, y: -70 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(2.2)", stagger: 0.07 });
    tl.add(setStatus(4));
    tl.fromTo(".lp--basil > *", { opacity: 0, scale: 0, rotation: -40 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.45, ease: "back.out(1.8)", stagger: 0.1 });
    tl.add(setStatus(5));
    tl.fromTo(".lp--face", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2.4)" });
    tl.to(".loader__pizza", { rotation: "+=10", duration: 0.45, ease: "power1.inOut", yoyo: true, repeat: 1 }, "-=0.1");
    tl.add(setStatus(6));
    tl.to({}, { duration: 0.35 });

    const total = tl.duration();
    tl.to(counter, {
      v: 100, duration: total, ease: "none",
      onUpdate() { const n = Math.round(counter.v); pct.textContent = n; fill.style.width = n + "%"; }
    }, 0);
  }

  /* ------------------------------------------------ Color-band reveal */
  function revealSite(instant) {
    const loader = document.getElementById("loader");
    const reveal = document.getElementById("reveal");
    const finish = () => {
      if (loader) loader.remove();
      if (reveal) reveal.remove();
      document.body.classList.remove("is-loading");
      if (lenis) lenis.start();
      ScrollTrigger.refresh();
      heroIntro();
      startCueLoops();
      setTimeout(showCookie, 1400);
    };

    if (instant || FROZEN) { finish(); return; }

    const bands = gsap.utils.toArray(".reveal__band");
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(loader, { yPercent: -130, duration: 0.7, ease: "power3.inOut" });
    tl.to(bands, { yPercent: -130, duration: 0.82, ease: "power3.inOut", stagger: 0.13 }, "-=0.42");
  }

  /* ------------------------------------------------ Hero intro */
  // Pre-hide the hero pieces up-front so they never flash on screen while the
  // loader / colour-band reveal is still playing (this was the "double load").
  function prepHero() {
    if (FROZEN) return;
    gsap.set(".hero__headline .char", { yPercent: 130, opacity: 0 });
    gsap.set(".hero__product", { scale: 0, opacity: 0 });
    gsap.set(".hero__brand", { yPercent: 70, opacity: 0 });
    gsap.set(".hero__copy", { y: 30, opacity: 0 });
    gsap.set(".hero__badge", { scale: 0, opacity: 0 });
    gsap.set(".scroll-cue", { opacity: 0, y: 10 });
  }

  function heroIntro() {
    if (FROZEN) return;
    const tl = gsap.timeline({ defaults: { ease: "back.out(1.6)" } });
    tl.to(".hero__headline .char", { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.035, ease: "back.out(1.7)" });
    tl.to(".hero__product", { scale: 1, opacity: 1, duration: 0.75, ease: "back.out(1.5)" }, "-=0.32");
    tl.to(".hero__brand", { yPercent: 0, opacity: 1, duration: 0.6 }, "-=0.45");
    tl.to(".hero__badge", { scale: 1, opacity: 1, duration: 0.5, stagger: 0.12 }, "-=0.4");
    tl.to(".hero__copy", { y: 0, opacity: 1, duration: 0.55, stagger: 0.1 }, "-=0.3");
    tl.to(".scroll-cue", { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
  }

  /* ------------------------------------------------ Scroll reveals */
  function initReveals() {
    if (FROZEN) return;

    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%" }
      });
    });

    gsap.utils.toArray("[data-reveal-head]").forEach((head) => {
      const lines = head.querySelectorAll(".dline");
      gsap.to(lines, {
        opacity: 1, y: 0, rotate: 0, duration: 0.8, ease: "back.out(1.4)", stagger: 0.12,
        scrollTrigger: { trigger: head, start: "top 84%" }
      });
    });

    const cards = gsap.utils.toArray("[data-card]");
    if (cards.length) {
      ScrollTrigger.batch(cards, {
        start: "top 88%",
        onEnter: (els) => els.forEach((c, i) => {
          const rot = parseFloat(getComputedStyle(c).getPropertyValue("--rot")) || 0;
          gsap.fromTo(c,
            { opacity: 0, y: 80, scale: 0.9, rotation: 0 },
            { opacity: 1, y: 0, scale: 1, rotation: rot, duration: 0.85, ease: "back.out(1.5)", delay: i * 0.1 });
        })
      });
    }

    gsap.utils.toArray("[data-city]").forEach((c) => {
      const rot = parseFloat(getComputedStyle(c).getPropertyValue("--rot")) || 0;
      gsap.fromTo(c,
        { opacity: 0, scale: 0.78, y: 50, rotation: 0 },
        {
          opacity: 1, scale: 1, y: 0, rotation: rot, duration: 0.7, ease: "back.out(1.6)",
          scrollTrigger: { trigger: c, start: "top 88%" }
        });
    });
  }

  /* ------------------------------------------------ Parallax */
  function initParallax() {
    if (FROZEN) return;

    gsap.utils.toArray(".floater").forEach((f, i) => {
      const dist = parseFloat(f.dataset.parallax) || 0;
      gsap.to(f, {
        yPercent: dist, rotation: (i % 2 ? 18 : -18), ease: "none",
        scrollTrigger: { trigger: ".layers", start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    gsap.to(".fullbleed__img img", {
      yPercent: 16, ease: "none",
      scrollTrigger: { trigger: ".fullbleed", start: "top bottom", end: "bottom top", scrub: true }
    });

    gsap.to(".mascot--selfie", {
      yPercent: -28, ease: "none",
      scrollTrigger: { trigger: ".classic", start: "top bottom", end: "bottom top", scrub: true }
    });
    gsap.to(".mascot--chef", {
      yPercent: -18, rotation: 10, ease: "none",
      scrollTrigger: { trigger: ".change", start: "top bottom", end: "bottom top", scrub: true }
    });
  }

  /* ------------------------------------------------ Airplane along route */
  function initPlane() {
    const route = document.getElementById("routePath");
    const plane = document.querySelector(".plane");
    if (!route || !plane) return;

    const flight = document.querySelector(".flight");
    const L = route.getTotalLength();

    // cache the rendered box; the 100x100 viewBox is stretched non-uniformly into it
    let fw = 1, fh = 1, lastP = 0;
    const measure = () => {
      const r = flight.getBoundingClientRect();
      if (r.width && r.height) { fw = r.width; fh = r.height; }
    };
    measure();

    const place = (p) => {
      lastP = p = gsap.utils.clamp(0, 1, p);
      const la = p * L;
      const l1 = Math.min(la, L - 0.6);          // back off so the tangent stays defined at p=1
      const a = route.getPointAtLength(la);
      const t0 = route.getPointAtLength(l1);
      const t1 = route.getPointAtLength(l1 + 0.6);
      const ang = Math.atan2((t1.y - t0.y) * fh, (t1.x - t0.x) * fw) * 180 / Math.PI;
      // compositor-only transforms: no layout work while scrubbing
      gsap.set(plane, { x: (a.x / 100) * fw, y: (a.y / 100) * fh, xPercent: -50, yPercent: -50, rotation: ang + 90 });
    };
    window.addEventListener("resize", () => { measure(); place(lastP); }, { passive: true });
    ScrollTrigger.addEventListener("refresh", () => { measure(); place(lastP); });
    place(0);
    if (FROZEN) { place(0.5); return; }

    ScrollTrigger.create({
      trigger: ".flight", start: "top 64%", end: "bottom bottom", scrub: 0.5,
      onUpdate: (self) => place(self.progress)
    });
  }

  /* ------------------------------------------------ Googly eyes */
  function initEyes() {
    if (FROZEN) return;
    const groups = [];
    gsap.utils.toArray(".eyes").forEach((svg) => {
      const g = { svg, visible: false, pupils: [] };
      svg.querySelectorAll(".pupil").forEach((p) => {
        g.pupils.push({
          x: gsap.quickTo(p, "x", { duration: 0.35, ease: "power2" }),
          y: gsap.quickTo(p, "y", { duration: 0.35, ease: "power2" })
        });
      });
      groups.push(g);
    });
    if (!groups.length) return;

    // only track the eyes that are actually on screen
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        const g = groups.find((x) => x.svg === en.target);
        if (g) g.visible = en.isIntersecting;
      }
    });
    groups.forEach((g) => io.observe(g.svg));

    window.addEventListener("mousemove", (e) => {
      for (const g of groups) {
        if (!g.visible) continue;
        const r = g.svg.getBoundingClientRect();
        const ang = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
        for (const p of g.pupils) { p.x(Math.cos(ang) * 9); p.y(Math.sin(ang) * 9); }
      }
    }, { passive: true });
  }

  /* ------------------------------------------------ Custom cursor */
  function initCursor() {
    const cur = document.querySelector(".cursor");
    if (COARSE || FROZEN) { if (cur) cur.style.display = "none"; return; }
    const label = cur.querySelector(".cursor__label");
    const xTo = gsap.quickTo(cur, "x", { duration: 0.22, ease: "power3" });
    const yTo = gsap.quickTo(cur, "y", { duration: 0.22, ease: "power3" });
    window.addEventListener("mousemove", (e) => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });

    document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cur.classList.add("is-active");
        label.textContent = el.getAttribute("data-cursor") || "";
      });
      el.addEventListener("mouseleave", () => {
        cur.classList.remove("is-active");
        label.textContent = "";
      });
    });
  }

  /* ------------------------------------------------ Nav hide / stick */
  function initNav() {
    const nav = document.getElementById("nav");
    let last = 0;
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        nav.classList.toggle("is-stuck", y > 40);
        if (y > last && y > 320) nav.classList.add("is-hidden");
        else nav.classList.remove("is-hidden");
        last = y;
      }
    });
  }

  /* ------------------------------------------------ Menu overlay */
  function initMenu() {
    const btn = document.getElementById("menuBtn");
    const overlay = document.getElementById("menuOverlay");
    const links = overlay.querySelectorAll("a");
    const toggle = (open) => {
      overlay.classList.toggle("is-open", open);
      overlay.inert = !open;                       // closed menu: not focusable, out of a11y tree
      overlay.setAttribute("aria-hidden", String(!open));
      btn.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);  // CSS scroll lock (covers the no-Lenis path too)
      if (lenis) open ? lenis.stop() : lenis.start();
      if (open) { (overlay.querySelector("a") || overlay).focus(); }
      else if (overlay.contains(document.activeElement)) { btn.focus(); }
    };
    closeMenu = () => { if (overlay.classList.contains("is-open")) toggle(false); };
    overlay.inert = true;
    btn.addEventListener("click", () => toggle(!overlay.classList.contains("is-open")));
    links.forEach((a) => a.addEventListener("click", () => toggle(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && overlay.classList.contains("is-open")) toggle(false); });
    overlay.addEventListener("keydown", (e) => {   // focus trap while open
      if (e.key !== "Tab") return;
      const f = [...links]; if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    if (!FROZEN) {
      gsap.set(links, { yPercent: 110 });
      const obs = new MutationObserver(() => {
        if (overlay.classList.contains("is-open"))
          gsap.to(links, { yPercent: 0, duration: 0.6, ease: "back.out(1.5)", stagger: 0.07 });
        else
          gsap.to(links, { yPercent: 110, duration: 0.3, ease: "power2.in" });
      });
      obs.observe(overlay, { attributes: true, attributeFilter: ["class"] });
    }
  }

  /* ------------------------------------------------ Anchor nav: colour-sweep transition */
  function initAnchors() {
    const bands = gsap.utils.toArray(".page-sweep__band");
    // the CSS fallback transform parses into a fixed px offset — zero it so yPercent is the only driver
    if (bands.length) gsap.set(bands, { y: 0, yPercent: 118 });
    let navigating = false;

    const jumpTo = (target) => {
      if (lenis) lenis.scrollTo(target, { offset: -16, immediate: true, force: true });
      else window.scrollTo(0, target.getBoundingClientRect().top + scrollY - 16);
      ScrollTrigger.update();
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
    };

    const navigateTo = (target) => {
      closeMenu();
      // reduced motion / no overlay: skip the show, just go
      if (FROZEN || !bands.length) { jumpTo(target); return; }
      if (navigating) return;
      navigating = true;
      const tl = gsap.timeline({ onComplete: () => { navigating = false; } });
      tl.fromTo(bands, { yPercent: 118 }, { yPercent: 0, duration: 0.5, ease: "power3.in", stagger: 0.07 });
      tl.add(() => jumpTo(target), "+=0.02");
      tl.to(bands, { yPercent: -118, duration: 0.65, ease: "power3.out", stagger: 0.07 }, "+=0.1");
      tl.set(bands, { yPercent: 118 }); // park below for the next run
    };

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        navigateTo(target);
      });
    });
  }

  /* ------------------------------------------------ Cookie banner */
  // sessionStorage can throw with blocked cookies / private mode
  const cookieStore = {
    get() { try { return sessionStorage.getItem("slice-cookie"); } catch (err) { return null; } },
    set() { try { sessionStorage.setItem("slice-cookie", "1"); } catch (err) { /* no-op */ } }
  };
  function showCookie() {
    if (cookieStore.get() === "1") return;
    const c = document.getElementById("cookie");
    c.inert = false;
    c.classList.add("is-shown");
  }
  function initCookie() {
    document.querySelectorAll("[data-cookie]").forEach((b) =>
      b.addEventListener("click", () => {
        const c = document.getElementById("cookie");
        c.classList.remove("is-shown");
        c.inert = true;
        cookieStore.set();
      })
    );
  }

  /* ------------------------------------------------ Misc loops (idle wobble) */
  function startCueLoops() {
    if (FROZEN) return;
    gsap.to(".hero__badge--a", { rotation: "-=4", y: "+=6", duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(".hero__badge--b", { rotation: "+=4", y: "-=6", duration: 2.7, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(".mascot--tl", { y: "+=12", rotation: "-=6", duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(".mascot--tr", { y: "-=12", rotation: "+=6", duration: 3.3, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(".hero__disc", { rotation: "+=4", duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1 });
  }

  /* ------------------------------------------------ Boot */
  function boot() {
    if (STATIC) document.documentElement.classList.add("is-static");
    initLenis();
    initCursor();
    initEyes();
    initNav();
    initMenu();
    initAnchors();
    initCookie();
    initReveals();
    initParallax();
    initPlane();
    prepHero();
    runLoader();

    window.addEventListener("load", () => ScrollTrigger.refresh());
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
