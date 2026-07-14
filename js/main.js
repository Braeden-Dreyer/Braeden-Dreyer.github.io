/* ============================================================
   Braeden Dreyer — Portfolio interactions
   ============================================================ */
(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- nav: scrolled state, burger, active link ---------- */
  const nav = document.getElementById("nav");
  const navLinks = document.getElementById("navLinks");
  const burger = document.getElementById("navBurger");

  const onScrollNav = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    })
  );

  // highlight nav link for the section in view
  const sections = [...document.querySelectorAll("section[id]")];
  const linkFor = (id) => navLinks.querySelector(`a[href="#${id}"]`);
  const sectionSpy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const link = linkFor(e.target.id);
        if (!link) return;
        if (e.isIntersecting) {
          navLinks.querySelectorAll("a").forEach((a) => a.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => sectionSpy.observe(s));

  /* ---------- reveal on scroll ---------- */
  const revealObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
    revealObs.observe(el);
  });

  /* ---------- typewriter for hero roles ---------- */
  const roles = [
    "Mechatronics Engineering Student",
    "Robotics & Automation Builder",
    "CAD Designer — CSWA Certified",
    "Embedded Systems Programmer",
  ];
  const typedEl = document.getElementById("typed");
  if (reducedMotion) {
    typedEl.textContent = roles[0];
  } else {
    let roleIdx = 0, charIdx = 0, deleting = false;
    const tick = () => {
      const word = roles[roleIdx];
      charIdx += deleting ? -1 : 1;
      typedEl.textContent = word.slice(0, charIdx);
      let delay = deleting ? 32 : 62;
      if (!deleting && charIdx === word.length) {
        delay = 2100;
        deleting = true;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        delay = 420;
      }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 600);
  }

  /* ---------- animated counters ---------- */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const dur = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const countObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => {
    if (reducedMotion) {
      el.textContent = parseFloat(el.dataset.count).toFixed(parseInt(el.dataset.decimals || "0", 10));
    } else {
      countObs.observe(el);
    }
  });

  /* ---------- terminal typing ---------- */
  const terminalBody = document.getElementById("terminalBody");
  const terminalLines = [
    { html: '<span class="t-dim">$</span> <span class="t-cmd">braeden --init</span>', pause: 500 },
    { html: '<span class="t-key">  program</span>   : Mechatronic Systems Eng.', pause: 120 },
    { html: '<span class="t-key">  school</span>    : Western University', pause: 120 },
    { html: '<span class="t-key">  gpa</span>       : <span class="t-val">3.82 / 4.0</span>', pause: 120 },
    { html: '<span class="t-key">  honors</span>    : <span class="t-val">Dean\'s List ×2</span>', pause: 260 },
    { html: '<span class="t-dim">$</span> <span class="t-cmd">braeden --modules</span>', pause: 500 },
    { html: '  <span class="t-dim">[ok]</span> solidworks.cswa', pause: 110 },
    { html: '  <span class="t-dim">[ok]</span> esp32.firmware', pause: 110 },
    { html: '  <span class="t-dim">[ok]</span> 3d_printing.rapid_proto', pause: 110 },
    { html: '  <span class="t-dim">[ok]</span> altium.pcb', pause: 260 },
    { html: '<span class="t-dim">$</span> <span class="t-cmd">braeden --status</span>', pause: 500 },
    { html: '  <span class="t-val">● building. always.</span>', pause: 0 },
  ];
  let termStarted = false;
  const runTerminal = () => {
    if (termStarted) return;
    termStarted = true;
    if (reducedMotion) {
      terminalBody.innerHTML = terminalLines.map((l) => l.html).join("\n");
      return;
    }
    let i = 0;
    const caret = '<span class="t-caret"></span>';
    const next = () => {
      const done = terminalLines
        .slice(0, i + 1)
        .map((l) => l.html)
        .join("\n");
      const isLast = i === terminalLines.length - 1;
      terminalBody.innerHTML = done + (isLast ? " " + caret : "\n" + caret);
      i++;
      if (i < terminalLines.length) setTimeout(next, 90 + terminalLines[i - 1].pause);
    };
    next();
  };
  const termObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          runTerminal();
          termObs.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );
  termObs.observe(document.getElementById("terminal"));

  /* ---------- expandable project cards ---------- */
  const projGrid = document.getElementById("projectsGrid");
  if (projGrid) {
    projGrid.classList.add("js");
    const cards = [...projGrid.querySelectorAll(".card--project")];
    cards.forEach((c, i) => {
      c.style.viewTransitionName = "proj-card-" + i;
      c.setAttribute("tabindex", "0");
    });

    const setState = (target) => {
      cards.forEach((c) => {
        const on = c === target;
        c.classList.toggle("expanded", on);
        c.setAttribute("aria-expanded", String(on));
      });
      projGrid.classList.toggle("has-expanded", !!target);
    };

    const update = (target) => {
      const scrollTo = () => {
        if (target) target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" });
      };
      if (document.startViewTransition && !reducedMotion) {
        const t = document.startViewTransition(() => setState(target));
        t.finished.then(scrollTo).catch(scrollTo);
      } else {
        setState(target);
        scrollTo();
      }
    };

    cards.forEach((c) => {
      c.addEventListener("click", (e) => {
        if (e.target.closest(".card__close")) { update(null); return; }
        update(c.classList.contains("expanded") ? null : c);
      });
      c.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          update(c.classList.contains("expanded") ? null : c);
        } else if (e.key === "Escape") {
          update(null);
        }
      });
    });
  }

  /* ---------- robot arm: subtle mouse parallax ---------- */
  const arm = document.getElementById("robotArm");
  const armWrap = document.getElementById("armWrap");
  if (arm && !reducedMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelector(".hero").addEventListener("mousemove", (ev) => {
      const r = armWrap.getBoundingClientRect();
      const dx = (ev.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const dy = (ev.clientY - (r.top + r.height / 2)) / window.innerHeight;
      arm.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`;
    });
  }

  /* ---------- circuit network canvas ---------- */
  const canvas = document.getElementById("circuit-canvas");
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, dpr = 1;
  let nodes = [];
  let pulses = [];

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initNodes();
  };

  const initNodes = () => {
    const count = Math.floor((W * H) / 16000);
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.6 + 0.8,
    }));
    pulses = [];
  };

  const LINK_DIST = 140;

  const spawnPulse = () => {
    if (nodes.length < 2 || pulses.length > 6) return;
    const a = nodes[(Math.random() * nodes.length) | 0];
    // find a neighbour within link distance
    const near = nodes.filter(
      (n) => n !== a && Math.hypot(n.x - a.x, n.y - a.y) < LINK_DIST
    );
    if (!near.length) return;
    const b = near[(Math.random() * near.length) | 0];
    pulses.push({ a, b, t: 0, speed: 0.008 + Math.random() * 0.01 });
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);

    // links
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DIST) {
          const alpha = (1 - d / LINK_DIST) * 0.34;
          ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // nodes
    for (const n of nodes) {
      ctx.fillStyle = "rgba(96, 165, 250, 0.55)";
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();

      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
    }

    // pulses travelling along links
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.t += p.speed;
      if (p.t >= 1) { pulses.splice(i, 1); continue; }
      const x = p.a.x + (p.b.x - p.a.x) * p.t;
      const y = p.a.y + (p.b.y - p.a.y) * p.t;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 6);
      g.addColorStop(0, "rgba(147, 197, 253, 0.9)");
      g.addColorStop(1, "rgba(147, 197, 253, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    if (Math.random() < 0.06) spawnPulse();

    requestAnimationFrame(draw);
  };

  const drawStatic = () => {
    // single, non-animated frame for reduced motion
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DIST) {
          ctx.strokeStyle = `rgba(37, 99, 235, ${(1 - d / LINK_DIST) * 0.3})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = "rgba(96, 165, 250, 0.5)";
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  window.addEventListener("resize", () => {
    resize();
    if (reducedMotion) drawStatic();
  });
  resize();
  if (reducedMotion) drawStatic();
  else requestAnimationFrame(draw);
})();
