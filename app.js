// ============================================================
// CLANK.WORLD BUILDER ENGINE
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

// undo stack (basic)
let undoStack = [];

// -----------------------------
// INIT
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  initBuilder();
});

function initBuilder() {
  loadTemplate("landing");
  applyHoverEffects();
  generateCode();
}

// -----------------------------
// UTIL
// -----------------------------
function showToast(msg) {
  console.log("[Toast]", msg);
  // replace with UI toast if you have one
}

function pushUndo() {
  undoStack.push(JSON.stringify({ sections, sectionCounter }));
  if (undoStack.length > 30) undoStack.shift();
}

// -----------------------------
// SECTION MANAGEMENT
// -----------------------------
function addSection(type) {
  pushUndo();

  const id = ++sectionCounter;
  sections.push({ id, type });

  const canvas = document.getElementById("preview-canvas");

  const wrapper = document.createElement("div");
  wrapper.innerHTML = generateSectionHTML(type, id);
  canvas.appendChild(wrapper.firstChild);

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

  const id = ++sectionCounter;
  const type = el.dataset.type;

  sections.push({ id, type });

  const clone = el.cloneNode(true);
  clone.id = `sec-${id}`;

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
// SECTION TREE UI
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
    cards: ".ps-card,.ps-glass-card,.ps-hscroll-card",
    hero: ".ps-hero-title",
    stats: ".ps-stat-val",
    buttons: ".ps-btn",
  };

  const els = document.querySelectorAll(map[target] || ".preview-section");

  els.forEach(el => {
    el.classList.remove(
      "anim-float",
      "anim-pulse",
      "anim-shimmer",
      "anim-fade-in"
    );

    const a1 = activeAnims[1];
    const a2 = activeAnims[2];

    if (a1 !== "none") el.classList.add("anim-" + a1);
    if (a2 !== "none") el.classList.add("anim-" + a2);
  });

  showToast("Animations applied");
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
// PREVIEW
// -----------------------------
function selectSection(sid) {
  document.querySelectorAll(".preview-section")
    .forEach(s => s.classList.remove("selected"));

  document.getElementById(sid)?.classList.add("selected");
}

// -----------------------------
// CODE GENERATION HOOK
// (your full generator lives in another file)
// -----------------------------
function generateCode() {
  console.log("generateCode() called — connect your builder-generator.js here");
}

// -----------------------------
// TEMPLATE LOADER (stub hook)
// -----------------------------
function loadTemplate(name) {
  console.log("Loading template:", name);

  sections = [];
  sectionCounter = 0;

  const canvas = document.getElementById("preview-canvas");
  if (canvas) canvas.innerHTML = "";

  updateSectionTree();
  generateCode();
}
