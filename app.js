// ============================================================
// STATE
// ============================================================
let sections = [];
let sectionCounter = 0;

let activeAnims = { 1: "none", 2: "none" };

let toggleState = {
  gradTitle: false,
  neonText: false,
  hoverLift: true,
  hoverGlow: true,
};

let undoStack = [];

// ============================================================
// INIT
// ============================================================
document.addEventListener("DOMContentLoaded", initBuilder);

function initBuilder() {
  console.log("Clank Engine booting...");

  bootTemplate("landing");

  setTimeout(() => {
    requestRender();
  }, 50);

  console.log("Clank Engine ready");
}

// ============================================================
// SAFE TEMPLATE BOOT (REAL ENTRY POINT)
// ============================================================
function bootTemplate(name) {
  sections = [];
  sectionCounter = 0;

  const canvas = document.getElementById("preview-canvas");
  if (canvas) canvas.innerHTML = "";

  const defaults = ["navbar", "hero", "cards", "stats", "footer"];

  defaults.forEach(t => addSection(t));

  updateSectionTree();
  requestRender();
}

// ============================================================
// UTIL
// ============================================================
function showToast(msg) {
  console.log("[Toast]", msg);
}

function pushUndo() {
  undoStack.push(JSON.stringify({ sections, sectionCounter }));
  if (undoStack.length > 30) undoStack.shift();
}

// ============================================================
// SECTION SYSTEM
// ============================================================
function addSection(type) {
  const id = ++sectionCounter;
  sections.push({ id, type });

  const canvas = document.getElementById("preview-canvas");
  if (!canvas) return;

  const el = document.createElement("div");

  // FORCE BOTH LAYERS TO MATCH CSS
  el.className = `preview-section ps-${type}`;
  el.id = `sec-${id}`;
  el.dataset.type = type;

  // SIMPLE VISUAL CONTENT (no dependencies)
  el.innerHTML = `
    <div class="ps-card">
      <div style="font-family:Orbitron; font-weight:700;">
        ${type.toUpperCase()} SECTION
      </div>
    </div>
  `;

  canvas.appendChild(el);

  updateSectionTree();
  requestRender?.();

  console.log("SECTION ADDED:", type);

};

function deleteSection(sid) {
  pushUndo();

  document.getElementById(sid)?.remove();
  sections = sections.filter(s => `sec-${s.id}` !== sid);

  updateSectionTree();
  requestRender();
}

function moveSection(sid, dir) {
  pushUndo();

  const el = document.getElementById(sid);
  if (!el) return;

  if (dir === -1 && el.previousElementSibling) {
    el.parentNode.insertBefore(el, el.previousElementSibling);
  } else if (dir === 1 && el.nextElementSibling) {
    el.parentNode.insertBefore(el.nextElementSibling, el);
  }

  updateSectionTree();
  requestRender();
}

function cloneSection(sid) {
  pushUndo();

  const el = document.getElementById(sid);
  if (!el) return;

  const type = el.dataset.type || "section";
  const id = ++sectionCounter;

  sections.push({ id, type });

  const clone = el.cloneNode(true);
  clone.id = `sec-${id}`;
  clone.dataset.type = type;

  el.parentNode.insertBefore(clone, el.nextSibling);

  updateSectionTree();
  requestRender();
}

// ============================================================
// SELECTION
// ============================================================
function selectSection(sid) {
  document.querySelectorAll(".preview-section")
    .forEach(s => s.classList.remove("selected"));

  document.getElementById(sid)?.classList.add("selected");
}

// ============================================================
// SECTION TREE
// ============================================================
function updateSectionTree() {
  const tree = document.getElementById("section-tree");
  if (!tree) return;

  tree.innerHTML = "";

  document.querySelectorAll(".preview-section").forEach((sec, i) => {
    const type = sec.dataset.type || "section";

    const div = document.createElement("div");
    div.className = "tree-item";

    div.innerHTML = `
      <div>${String(i + 1).padStart(2, "0")} ${type}</div>
      <div>
        <button onclick="moveSection('${sec.id}',-1)">↑</button>
        <button onclick="moveSection('${sec.id}',1)">↓</button>
        <button onclick="deleteSection('${sec.id}')">✕</button>
      </div>
    `;

    div.onclick = () => selectSection(sec.id);

    tree.appendChild(div);
  });
}

// ============================================================
// ANIMATIONS
// ============================================================
function selectAnim(slot, name, el) {
  activeAnims[slot] = name;
  requestRender();
}

function applyAnims() {
  const target = document.getElementById("animTarget")?.value;

  const map = {
    section: ".preview-section",
    cards: ".ps-card",
    hero: ".ps-hero-title",
    stats: ".ps-stat-val",
    buttons: ".ps-btn",
  };

  const els = document.querySelectorAll(map[target] || ".preview-section");

  els.forEach(el => {
    el.classList.remove("anim-float","anim-pulse","anim-shimmer","anim-fade-in");

    if (activeAnims[1] !== "none") el.classList.add("anim-" + activeAnims[1]);
    if (activeAnims[2] !== "none") el.classList.add("anim-" + activeAnims[2]);
  });

  requestRender();
}

// ============================================================
// HOVER EFFECTS
// ============================================================
function applyHoverEffects() {
  let style = document.getElementById("hover-effects-style");

  if (!style) {
    style = document.createElement("style");
    style.id = "hover-effects-style";
    document.head.appendChild(style);
  }

  let css = "";

  if (toggleState.hoverLift) {
    css += `.ps-card:hover{transform:translateY(-6px)!important;}`;
  }

  if (toggleState.hoverGlow) {
    css += `.ps-card:hover{box-shadow:0 0 20px rgba(0,245,255,0.2)!important;}`;
  }

  style.textContent = css;
}

// ============================================================
// RENDER HOOK
// ============================================================
function requestRender() {
  if (typeof window.generateCode === "function") {
    window.generateCode();
  } else {
    console.warn("generateCode not connected yet");
  }
}

// ============================================================
// TEMPLATE ACCESS (GLOBAL SAFE)
// ============================================================
window.loadTemplate = bootTemplate;

// ============================================================
// GLOBAL EXPORTS (CRITICAL FOR MOBILE)
// ============================================================
window.addSection = addSection;
window.deleteSection = deleteSection;
window.moveSection = moveSection;
window.cloneSection = cloneSection;
window.selectSection = selectSection;
window.updateSectionTree = updateSectionTree;
window.applyAnims = applyAnims;

// ============================================================
// GLOBAL UI API (FIXES ALL BUTTON ERRORS)
// ============================================================

window.copyCode = function(type) {
  const html = document.getElementById("rcode-html")?.textContent || "";
  const css = document.getElementById("rcode-css")?.textContent || "";
  const full = document.getElementById("rcode-full")?.textContent || "";

  const map = { html, css, full };

  navigator.clipboard.writeText(map[type] || "")
    .then(() => console.log("copied:", type))
    .catch(console.warn);
};

window.setPreviewSize = function(size, el) {
  const canvas = document.getElementById("preview-canvas");
  if (!canvas) return;

  const sizes = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px"
  };

  canvas.style.width = sizes[size] || "100%";

  document.querySelectorAll(".sidebar button")
    .forEach(b => b.classList.remove("active"));

  el?.classList.add("active");
};

window.zoom = function(delta) {
  const canvas = document.getElementById("preview-canvas");
  if (!canvas) return;

  let z = parseFloat(canvas.dataset.zoom || "1");
  z = Math.max(0.5, Math.min(1.5, z + delta));

  canvas.dataset.zoom = z;
  canvas.style.transform = `scale(${z})`;

  const label = document.getElementById("zoom-label");
  if (label) label.textContent = Math.round(z * 100) + "%";
};

window.resetLayout = function() {
  const canvas = document.getElementById("preview-canvas");
  if (canvas) canvas.innerHTML = "";

  if (typeof window.loadTemplate === "function") {
    window.loadTemplate("landing");
  }

  console.log("layout reset");
};
window.generateSectionHTML = window.generateSectionHTML || function(type, id) {
  return `
    <div class="preview-section ps-${type}" id="sec-${id}">
      <div class="ps-card">${type}</div>
    </div>
  `;
};
