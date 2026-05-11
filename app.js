// ============================================================
// CLANK.WORLD BUILDER ENGINE v2 (FIXED CORE)
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
  safeLoadTemplate("landing");
  applyHoverEffects();
  generateCode();
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
// SAFE SECTION RENDERING
// -----------------------------
function safeRenderSection(type, id) {
  if (typeof window.generateSectionHTML === "function") {
    return generateSectionHTML(type, id);
  }

  // fallback UI so NOTHING breaks
  return `
  <div class="preview-section" id="sec-${id}" data-type="${type}">
    <div class="section-overlay"></div>
    <div style="padding:20px;border:1px solid #333;margin:10px;border-radius:8px">
      <strong>Missing generator:</strong> ${type}
    </div>
  </div>
  `;
}

// -----------------------------
// SECTION MANAGEMENT
// -----------------------------
function addSection(type) {
  pushUndo();

  const id = ++sectionCounter;
  sections.push({ id, type });

  const canvas = document.getElementById("preview-canvas");
  if (!canvas) return;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = safeRenderSection(type, id);

  const el = wrapper.firstChild;

  canvas.appendChild(el);

  updateSectionTree();
  generateCode();

  showToast(`${type} added`);
}

function deleteSection(sid) {
  pushUndo();

  document.getElementById(sid)?.remove();

  sections = sections.filter(s => `sec-${s.id}` !== sid);

  updateSectionTree();
  generateCode();
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
  generateCode();
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
  generateCode();
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
// ANIMATIONS (UNCHANGED CORE)
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

  generateCode();
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
function generateCode() {
  if (typeof window.generateCode === "function" && window.generateCode !== generateCode) {
    window.generateCode();
    return;
  }

  console.log("generateCode fallback (no generator connected)");
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
  generateCode();
}
