// ============================================================
// CLANK.WORLD BUILDER ENGINE v3 (STABLE CORE)
// app.js
// ============================================================

// -----------------------------
// STATE
// -----------------------------
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

// -----------------------------
// INIT
// -----------------------------
document.addEventListener("DOMContentLoaded", initBuilder);

function initBuilder() {
  console.log("Clank Engine booting...");

  function safeLoadTemplate(name) {
  sections = [];
  sectionCounter = 0;

  const canvas = document.getElementById("preview-canvas");
  if (canvas) canvas.innerHTML = "";

  const defaults = ["navbar", "hero", "cards", "stats", "footer"];

  defaults.forEach(type => addSection(type));

  updateSectionTree();
  requestRender();
}
  // IMPORTANT: defer render so DOM exists
  setTimeout(() => {
    requestRender();
  }, 50);

  console.log("Clank Engine ready");
}

// -----------------------------
// UTIL
// -----------------------------
function showToast(msg) {
  console.log("[Toast]", msg);
}

function pushUndo() {
  undoStack.push(JSON.stringify({ sections, sectionCounter }));
  if (undoStack.length > 30) undoStack.shift();
}

// -----------------------------
// SAFE SECTION RENDER
// -----------------------------
function renderSection(type, id) {
  if (typeof window.generateSectionHTML === "function") {
    return generateSectionHTML(type, id);
  }

  // SAFE FALLBACK (never breaks UI)
  return `
    <div class="preview-section" id="sec-${id}" data-type="${type}">
      <div class="section-overlay"></div>
      <div style="
        padding:16px;
        border:1px solid #333;
        border-radius:8px;
        margin:10px;
        color:#aaa;
        font-family:monospace;
      ">
        Missing generator for: <b>${type}</b>
      </div>
    </div>
  `;
}

// -----------------------------
// SECTION MANAGEMENT
// -----------------------------
function addSection(type) {
  const id = ++sectionCounter;
  sections.push({ id, type });

  const canvas = document.getElementById("preview-canvas");
  if (!canvas) return;

  const el = document.createElement("div");
  el.className = "preview-section";
  el.id = `sec-${id}`;
  el.dataset.type = type;

  el.innerHTML = `
    <div style="
      padding:20px;
      margin:10px;
      border:1px solid #444;
      color:white;
      border-radius:8px;
    ">
      SECTION: ${type}
    </div>
  `;

  canvas.appendChild(el);

  updateSectionTree();
  console.log("SECTION ADDED:", type);
}

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
  }

  if (dir === 1 && el.nextElementSibling) {
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

// -----------------------------
// SELECTION
// -----------------------------
function selectSection(sid) {
  document.querySelectorAll(".preview-section")
    .forEach(s => s.classList.remove("selected"));

  document.getElementById(sid)?.classList.add("selected");
}

// -----------------------------
// SECTION TREE
// -----------------------------
function updateSectionTree() {
  const tree = document.getElementById("section-tree");
  if (!tree) return;

  tree.innerHTML = "";

  document.querySelectorAll(".preview-section").forEach((sec, i) => {
    const type = sec.dataset.type || "section";

    const div = document.createElement("div");
    div.className = "tree-item";

    div.innerHTML = `
      <div class="ti-dot"></div>
      ${String(i + 1).padStart(2, "0")} ${type.toUpperCase()}
      <div class="ti-actions">
        <div onclick="moveSection('${sec.id}',-1)">↑</div>
        <div onclick="moveSection('${sec.id}',1)">↓</div>
        <div onclick="deleteSection('${sec.id}')">✕</div>
      </div>
    `;

    div.onclick = () => selectSection(sec.id);

    tree.appendChild(div);
  });
}

// -----------------------------
// ANIMATIONS
// -----------------------------
function selectAnim(slot, name, el) {
  activeAnims[slot] = name;

  el.parentElement.querySelectorAll(".anim-tag")
    .forEach(t => t.classList.remove("selected"));

  el.classList.add("selected");
}

function applyAnims() {
  const target = document.getElementById("animTarget")?.value;

  const map = {
    section: ".preview-section",
    cards: ".ps-card,.ps-glass-card",
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

// -----------------------------
// HOVER EFFECTS
// -----------------------------
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

// -----------------------------
// GENERATOR HOOK
// -----------------------------
function requestRender() {
  if (typeof window.generateCode === "function") {
    window.generateCode();
  } else {
    console.warn("generateCode not connected yet");
  }
}

// -----------------------------
// TEMPLATE LOADER
// -----------------------------
function safeLoadTemplate(name) {
  sections = [];
  sectionCounter = 0;

  const canvas = document.getElementById("preview-canvas");
  if (canvas) canvas.innerHTML = "";

  updateSectionTree();
  requestRender();
}
window.addSection = addSection;
window.deleteSection = deleteSection;
window.moveSection = moveSection;
window.cloneSection = cloneSection;
window.selectSection = selectSection;
window.updateSectionTree = updateSectionTree;
window.applyAnims = applyAnims;
window.loadTemplate = loadTemplate;
