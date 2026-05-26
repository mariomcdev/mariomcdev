/**
 * ==========================================================================
 * MARIO MELGAREJO — CV interactivo (HTML / CSS / JS puro)
 * ==========================================================================
 *
 * ÍNDICE DE EDICIÓN RÁPIDA:
 * 1. PROJECTS_GALLERY     → Proyectos e imágenes en /projects/
 * 2. initHero()           → Interacción cara dividida
 * 3. NETWORK_NODES        → Posición nodos del grafo
 * 4. PCB_PATHS            → Trazas del circuito
 * 5. initParticles()      → Cantidad de partículas
 * ==========================================================================
 */

/* --------------------------------------------------------------------------
   GALERÍA — AÑADE TUS PROYECTOS AQUÍ
   -------------------------------------------------------------------------- */
const PROJECTS_GALLERY = [
  {
    image: "projects/proyecto-cloud.jpg",
    title: "Infraestructura Cloud",
    description: "Despliegue y monitoreo de servicios en la nube.",
    tag: "systems",
  },
  {
    image: "projects/automatizacion-ia.jpg",
    title: "Automatización con IA",
    description: "Flujos inteligentes y asistentes operativos.",
    tag: "systems",
  },
  {
    image: "projects/apc-ups.jpg",
    title: "Mantenimiento APC / UPS",
    description: "Continuidad energética y revisión de baterías.",
    tag: "electronics",
  },
  {
    image: "projects/cctv-hikvision.jpg",
    title: "CCTV Hikvision",
    description: "Instalación y configuración de videovigilancia.",
    tag: "electronics",
  },
  {
    image: "projects/instrumentacion.jpg",
    title: "Instrumentación",
    description: "Medición y calibración de señales.",
    tag: "electronics",
  },
  {
    image: "projects/redes-soporte.jpg",
    title: "Redes y Soporte TI",
    description: "Cableado, diagnóstico y soporte N1.",
    tag: "systems",
  },
];

/* --------------------------------------------------------------------------
   RED DE NODOS (lado Sistemas) — Coordenadas 0-100 en el SVG
   -------------------------------------------------------------------------- */
const NETWORK_NODES = [
  { x: 18, y: 32 },
  { x: 38, y: 18 },
  { x: 58, y: 38 },
  { x: 28, y: 58 },
  { x: 52, y: 68 },
];

const NETWORK_EDGES = [
  [0, 1], [1, 2], [0, 3], [2, 4], [3, 4], [1, 3],
];

/* --------------------------------------------------------------------------
   TRAZAS PCB (lado Electrónica) — Atributo "d" del path SVG
   -------------------------------------------------------------------------- */
const PCB_PATHS = [
  "M8 18 H38 V32 H22 V48 H52",
  "M55 12 H88 V28 H72 V44 H92 V58",
  "M12 68 H42 V82 H28",
];

const PCB_PADS = [
  { x: 20, y: 28 },
  { x: 38, y: 42 },
  { x: 55, y: 22 },
  { x: 72, y: 50 },
];

/* --------------------------------------------------------------------------
   Utilidades
   -------------------------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const SVG_NS = "http://www.w3.org/2000/svg";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* --------------------------------------------------------------------------
   HERO — Modos Sistemas / Electrónica (Refactorizado con Eventos)
   -------------------------------------------------------------------------- */
function initHero() {
  const hero = $(".hero");
  const zoneLeft = $('.hero__zone[data-zone="systems"]');
  const zoneRight = $('.hero__zone[data-zone="electronics"]');

  if (!hero) return;

  function setMode(mode) {
    hero.classList.remove("is-systems", "is-electronics");
    if (mode === "systems") hero.classList.add("is-systems");
    if (mode === "electronics") hero.classList.add("is-electronics");
    
    // Disparar evento global para sincronizar componentes sin MutationObserver
    window.dispatchEvent(new CustomEvent("heromodechange", { detail: { mode } }));
  }

  zoneLeft?.addEventListener("mouseenter", () => setMode("systems"));
  zoneLeft?.addEventListener("focus", () => setMode("systems"));
  zoneRight?.addEventListener("mouseenter", () => setMode("electronics"));
  zoneRight?.addEventListener("focus", () => setMode("electronics"));

  hero.addEventListener("mouseleave", () => setMode(null));
}

/* --------------------------------------------------------------------------
   LÍNEAS DIGITALES
   -------------------------------------------------------------------------- */
function initDigitalLines() {
  const container = $("[data-digital-lines]");
  if (!container || prefersReducedMotion()) return;

  const count = 10;
  const fragment = document.createDocumentFragment();
  
  for (let i = 0; i < count; i++) {
    const line = document.createElement("div");
    line.className = "digital-line";
    line.style.top = `${8 + i * 8}%`;
    line.style.animationDelay = `${i * 0.35}s`;
    line.style.animationDuration = `${2.8 + (i % 3) * 0.4}s`;
    fragment.appendChild(line);
  }
  container.appendChild(fragment);
}

/* --------------------------------------------------------------------------
   GRAFO DE NODOS SVG
   -------------------------------------------------------------------------- */
function initNetworkGraph() {
  const linesGroup = $("[data-network-lines]");
  const nodesGroup = $("[data-network-nodes]");
  if (!linesGroup || !nodesGroup) return;

  const linesFragment = document.createDocumentFragment();
  NETWORK_EDGES.forEach(([a, b], i) => {
    const n1 = NETWORK_NODES[a];
    const n2 = NETWORK_NODES[b];
    const line = document.createElementNS(SVG_NS, "line");
    line.setAttributeNS(null, "x1", String(n1.x));
    line.setAttributeNS(null, "y1", String(n1.y));
    line.setAttributeNS(null, "x2", String(n2.x));
    line.setAttributeNS(null, "y2", String(n2.y));
    line.style.animationDelay = `${i * 0.2}s`;
    linesFragment.appendChild(line);
  });
  linesGroup.appendChild(linesFragment);

  const nodesFragment = document.createDocumentFragment();
  NETWORK_NODES.forEach((n, i) => {
    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttributeNS(null, "cx", String(n.x));
    circle.setAttributeNS(null, "cy", String(n.y));
    circle.setAttributeNS(null, "r", "0.8");
    circle.style.animationDelay = `${i * 0.15}s`;
    nodesFragment.appendChild(circle);
  });
  nodesGroup.appendChild(nodesFragment);
}

/* --------------------------------------------------------------------------
   PCB — Trazas y pads
   -------------------------------------------------------------------------- */
function initPcb() {
  const tracesGroup = $("[data-pcb-traces]");
  const padsGroup = $("[data-pcb-pads]");
  if (!tracesGroup || !padsGroup) return;

  const tracesFragment = document.createDocumentFragment();
  PCB_PATHS.forEach((d, i) => {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttributeNS(null, "d", d);
    path.style.animationDelay = `${i * 0.4}s`;
    tracesFragment.appendChild(path);
  });
  tracesGroup.appendChild(tracesFragment);

  const padsFragment = document.createDocumentFragment();
  PCB_PADS.forEach((pad, i) => {
    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttributeNS(null, "x", String(pad.x));
    rect.setAttributeNS(null, "y", String(pad.y));
    rect.setAttributeNS(null, "width", "3");
    rect.setAttributeNS(null, "height", "3");
    rect.style.animationDelay = `${i * 0.25}s`;
    padsFragment.appendChild(rect);
  });
  padsGroup.appendChild(padsFragment);
}

/* --------------------------------------------------------------------------
   PULSOS ELÉCTRICOS
   -------------------------------------------------------------------------- */
function initElectricPulses() {
  const container = $("[data-electric-pulses]");
  if (!container) return;

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 3; i++) {
    const ring = document.createElement("div");
    ring.className = "pulse-ring";
    fragment.appendChild(ring);
  }
  container.appendChild(fragment);
}

/* --------------------------------------------------------------------------
   DESTELLOS (sparks)
   -------------------------------------------------------------------------- */
function initSparks() {
  const container = $("[data-sparks]");
  if (!container || prefersReducedMotion()) return;

  function spawnSpark() {
    if (!document.querySelector(".hero.is-electronics")) return;

    const spark = document.createElement("div");
    spark.className = "spark";
    spark.style.left = `${20 + Math.random() * 60}%`;
    spark.style.top = `${25 + Math.random() * 50}%`;
    container.appendChild(spark);
    setTimeout(() => spark.remove(), 600);
  }

  setInterval(spawnSpark, 400);
}

/* --------------------------------------------------------------------------
   PARTÍCULAS CANVAS
   -------------------------------------------------------------------------- */
const PARTICLE_COUNT = 40;

function initParticles() {
  const canvas = $('.particles[data-particles="systems"]');
  if (!canvas || prefersReducedMotion()) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let animId = null;
  let running = false;

  function resize() {
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  }

  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.3 - Math.random() * 0.6,
      size: 1 + Math.random() * 2,
      alpha: 0.3 + Math.random() * 0.5,
    }));
  }

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < 0) {
        p.y = canvas.height;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      
      // Estilos asignados por ciclo para evitar pérdidas por resize
      ctx.fillStyle = `rgba(34, 211, 238, ${p.alpha})`;
      ctx.shadowColor = "#22d3ee";
      ctx.shadowBlur = 8;
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  function start() {
    if (running) return;
    resize();
    createParticles();
    running = true;
    draw();
  }

  function stop() {
    running = false;
    if (animId) cancelAnimationFrame(animId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Escucha el evento global personalizado de heromodechange
  window.addEventListener("heromodechange", (e) => {
    if (e.detail.mode === "systems") start();
    else stop();
  });

  window.addEventListener("resize", () => {
    if (running) {
      resize();
      createParticles();
    }
  });
}

/* --------------------------------------------------------------------------
   OSCILOSCOPIO
   -------------------------------------------------------------------------- */
function initOscilloscope() {
  const canvas = $("[data-osc-wave]");
  if (!canvas || prefersReducedMotion()) return;

  const ctx = canvas.getContext("2d");
  let phase = 0;
  let animId = null;
  let running = false;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width - 16;
    canvas.height = 48;
  }

  function draw() {
    if (!running) return;
    const w = canvas.width;
    const h = canvas.height;
    const mid = h / 2;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "#fb923c";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#f97316";
    ctx.shadowBlur = 6;
    ctx.beginPath();

    for (let x = 0; x < w; x++) {
      const t = (x / w) * Math.PI * 4 + phase;
      const y = mid + Math.sin(t) * (h * 0.32) + Math.sin(t * 2.3 + phase) * (h * 0.08);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    /* Línea base */
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(251, 146, 60, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, mid);
    ctx.lineTo(w, mid);
    ctx.stroke();

    phase += 0.08;
    animId = requestAnimationFrame(draw);
  }

  function start() {
    if (running) return;
    resize();
    running = true;
    draw();
  }

  function stop() {
    running = false;
    if (animId) cancelAnimationFrame(animId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Escucha el evento global personalizado de heromodechange
  window.addEventListener("heromodechange", (e) => {
    if (e.detail.mode === "electronics") start();
    else stop();
  });

  window.addEventListener("resize", () => {
    if (running) resize();
  });
}

/* --------------------------------------------------------------------------
   TIMELINE
   -------------------------------------------------------------------------- */
function initTimelines() {
  const cards = $$(".timeline-card, .cv-reveal");
  if (!cards.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  cards.forEach((card, i) => {
    if (card.classList.contains("timeline-card")) {
      card.style.transitionDelay = `${i * 0.06}s`;
    }
    io.observe(card);
  });
}

/* --------------------------------------------------------------------------
   BARRAS DE HABILIDADES
   -------------------------------------------------------------------------- */
function initSkillBars() {
  const skills = $$(".cv-skill");
  if (!skills.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const level = el.dataset.level || "0";
        el.style.setProperty("--level", level);
        el.classList.add("is-animated");
        const bar = el.querySelector(".cv-skill__bar span");
        if (bar) bar.style.width = `${level}%`;
        io.unobserve(el);
      });
    },
    { threshold: 0.3 }
  );

  skills.forEach((s) => io.observe(s));
}

/* --------------------------------------------------------------------------
   IMPRIMIR / GUARDAR CV
   -------------------------------------------------------------------------- */
/*function initPrintCv() {
  const btn = $("[data-print-cv]");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.print();
  });
}
*/
/* --------------------------------------------------------------------------
   GALERÍA — Render desde PROJECTS_GALLERY (Optimizado con Fragmentos)
   -------------------------------------------------------------------------- */
function initGallery() {
  const grid = $("[data-gallery-grid]");
  const emptyMsg = $("[data-gallery-empty]");
  if (!grid) return;

  if (!PROJECTS_GALLERY.length) {
    emptyMsg?.removeAttribute("hidden");
    return;
  }

  let loaded = 0;
  const fragment = document.createDocumentFragment();

  PROJECTS_GALLERY.forEach((project, index) => {
    const card = document.createElement("article");
    card.className = `gallery-card gallery-card--${project.tag}`;
    card.style.transitionDelay = `${index * 0.06}s`;

    const img = document.createElement("img");
    img.className = "gallery-card__media";
    img.src = project.image;
    img.alt = project.title;
    img.loading = "lazy";

    img.onerror = () => {
      card.remove();
      loaded++;
      if (loaded === PROJECTS_GALLERY.length && !grid.children.length) {
        emptyMsg?.removeAttribute("hidden");
      }
    };

    img.onload = () => {
      emptyMsg?.setAttribute("hidden", "");
    };

    const tag = document.createElement("span");
    tag.className = "gallery-card__tag";
    tag.textContent = project.tag === "systems" ? "SYS" : "HW";

    const overlay = document.createElement("div");
    overlay.className = "gallery-card__overlay";

    const glass = document.createElement("div");
    glass.className = "gallery-card__glass";

    const title = document.createElement("h3");
    title.className = "gallery-card__title";
    title.textContent = project.title;

    const desc = document.createElement("p");
    desc.className = "gallery-card__desc";
    desc.textContent = project.description;

    glass.append(title, desc);
    overlay.appendChild(glass);
    card.append(img, tag, overlay);
    fragment.appendChild(card);

    /* Animación scroll individual */
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) card.classList.add("is-visible");
      },
      { threshold: 0.1 }
    );
    io.observe(card);
  });

  grid.appendChild(fragment);
}

/* --------------------------------------------------------------------------
   Navegación móvil
   -------------------------------------------------------------------------- */
function initNav() {
  const toggle = $("[data-nav-toggle]");
  const nav = $(".site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  $$(".site-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* --------------------------------------------------------------------------
   Año en footer
   -------------------------------------------------------------------------- */
function initFooterYear() {
  const el = $("[data-year]");
  if (el) el.textContent = new Date().getFullYear();
}

/* --------------------------------------------------------------------------
   FOTO PERFIL — Fallback a SVG si falta profile-split.png
   -------------------------------------------------------------------------- */
function initProfileImageFallback() {
  $$("[data-profile-img]").forEach((img) => {
    img.addEventListener("error", function onErr() {
      if (this.dataset.fallbackApplied) return;
      this.dataset.fallbackApplied = "1";
      this.src = "img/profile-split.svg";
    });
  });
}

/* --------------------------------------------------------------------------
   Inicialización Unificada
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initProfileImageFallback();
  initHero();
  initDigitalLines();
  initNetworkGraph();
  initPcb();
  initElectricPulses();
  initSparks();
  initParticles();
  initOscilloscope();
  initTimelines();
  initSkillBars();
  initPrintCv();
  initGallery();
  initNav();
  initFooterYear();
});