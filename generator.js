// ============================================================
// CLANK.WORLD GENERATOR ENGINE
// generator.js
// ============================================================

// ------------------------------------------------------------
// MAIN ENTRY
// ------------------------------------------------------------
function generateCode() {
  const html = buildHTML();
  const css = buildCSS();
  const full = buildFullOutput(html, css);

  pushToOutputs(html, css, full);
}

// ------------------------------------------------------------
// HTML BUILDER
// ------------------------------------------------------------
function buildHTML() {
  const canvas = document.getElementById("preview-canvas");
  if (!canvas) return "";

  let out = "";

  canvas.querySelectorAll(".preview-section").forEach(sec => {
    const clone = sec.cloneNode(true);

    // remove builder UI artifacts
    clone.querySelectorAll(".section-overlay, .drag-handle")
      .forEach(el => el.remove());

    clone.querySelectorAll("[contenteditable]")
      .forEach(el => el.removeAttribute("contenteditable"));

    clone.removeAttribute("id");
    clone.classList.remove("selected");

    out += clone.outerHTML + "\n";
  });

  return out;
}

// ------------------------------------------------------------
// CSS BUILDER
// ------------------------------------------------------------
function buildCSS() {
  const bg = val("bgColor");
  const accent = val("colAccent");
  const secondary = val("colSecondary");
  const text = val("colTextPrimary");
  const muted = val("colTextMuted");
  const card = val("colCard");
  const border = val("colBorder");

  return `
<style>
:root{
  --bg:${bg};
  --accent:${accent};
  --secondary:${secondary};
  --text-primary:${text};
  --text-muted:${muted};
  --card-bg:${card};
  --border:${border};
}

body{
  background:var(--bg);
  color:var(--text-primary);
  font-family:Inter, sans-serif;
}

/* ========================= */
/* CORE ANIMATIONS */
/* ========================= */
@keyframes float {0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes pulse {0%,100%{opacity:1}50%{opacity:.6}}
@keyframes shimmer {0%{background-position:-200%}100%{background-position:200%}}
@keyframes fade-in {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

/* ========================= */
/* CARDS */
/* ========================= */
.ps-card{
  background:var(--card-bg);
  border:1px solid var(--border);
  border-radius:12px;
  padding:20px;
  transition:.3s;
}

.ps-card:hover{
  transform:translateY(-4px);
  box-shadow:0 10px 30px rgba(0,0,0,.3);
}

/* ========================= */
/* HERO */
/* ========================= */
.ps-hero-title{
  font-size:clamp(28px,5vw,56px);
  font-weight:800;
  color:var(--text-primary);
}

/* ========================= */
/* BUTTONS */
/* ========================= */
.ps-btn{
  padding:10px 18px;
  border-radius:6px;
  cursor:pointer;
  border:none;
}

.ps-btn-primary{
  background:linear-gradient(135deg,var(--accent),var(--secondary));
  color:#000;
}

/* ========================= */
/* GRID */
/* ========================= */
.ps-card-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
  gap:16px;
}

</style>
`;
}

// ------------------------------------------------------------
// FULL OUTPUT COMBINER
// ------------------------------------------------------------
function buildFullOutput(html, css) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
${css}
</head>
<body>

${html}

</body>
</html>
`;
}

// ------------------------------------------------------------
// OUTPUT INJECTION (UI)
// ------------------------------------------------------------
function pushToOutputs(html, css, full) {
  setText("rcode-html", html);
  setText("rcode-css", css);
  setText("rcode-full", full);
}

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------
function val(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
