// ============================================================
// CLANK.WORLD GENERATOR ENGINE v2 (ROBUST)
// generator.js
// ============================================================

console.log("generator loaded");

(function () {
  "use strict";

  // -----------------------------
  // SAFE GLOBAL HOOKS
  // -----------------------------
  const safe = {
    getCanvas: () => document.getElementById("preview-canvas"),
    get: (id) => document.getElementById(id),
    val: (id) => {
      const el = document.getElementById(id);
      return el ? el.value : "";
    }
  };

  // -----------------------------
  // MAIN ENTRY
  // -----------------------------
  window.generateCode = function generateCode() {
    try {
      const html = buildHTML();
      const css = buildCSS();
      const full = buildFull(html, css);

      pushOutputs(html, css, full);
    } catch (err) {
      console.error("generateCode error:", err);
    }
  };

  // -----------------------------
  // HTML BUILDER
  // -----------------------------
  function buildHTML() {
    const canvas = safe.getCanvas();
    if (!canvas) return fallbackHTML();

    const sections = canvas.querySelectorAll(".preview-section");
    if (!sections.length) return fallbackHTML();

    let out = "";
    sections.forEach(sec => out += serializeSection(sec));

    return out;
  }

  function serializeSection(sec) {
    try {
      const clone = sec.cloneNode(true);

      clone.querySelectorAll(".section-overlay, .drag-handle")
        .forEach(el => el.remove());

      clone.querySelectorAll("[contenteditable]")
        .forEach(el => el.removeAttribute("contenteditable"));

      clone.removeAttribute("id");
      clone.classList.remove("selected");

      return clone.outerHTML + "\n";
    } catch (e) {
      console.warn("section serialize failed:", e);
      return "";
    }
  }

  function fallbackHTML() {
    return `
<section class="ps-card" style="margin:20px;padding:20px">
  <h2 style="font-family:Orbitron">NO SECTIONS FOUND</h2>
  <p style="opacity:0.7">
    Builder engine is running but no .preview-section elements exist.
    Check app.js section creation.
  </p>
</section>
`;
  }

  // -----------------------------
  // CSS BUILDER
  // -----------------------------
  function buildCSS() {
    const bg = safe.val("bgColor");
    const accent = safe.val("colAccent");
    const secondary = safe.val("colSecondary");
    const text = safe.val("colTextPrimary");
    const muted = safe.val("colTextMuted");
    const card = safe.val("colCard");
    const border = safe.val("colBorder");

    return `
<style>
:root{
  --bg:${bg || "#050710"};
  --accent:${accent || "#00f5ff"};
  --secondary:${secondary || "#b400ff"};
  --text-primary:${text || "#e8eeff"};
  --text-muted:${muted || "#8890bb"};
  --card-bg:${card || "#111428"};
  --border:${border || "#1a1f3a"};
}

body{
  margin:0;
  background:var(--bg);
  color:var(--text-primary);
  font-family:Exo 2, sans-serif;
}

.preview-section{ margin:12px; }

.ps-card{
  background:var(--card-bg);
  border:1px solid var(--border);
  border-radius:12px;
  padding:18px;
}

.ps-btn{
  padding:10px 14px;
  border-radius:6px;
  border:none;
  cursor:pointer;
}

.ps-btn-primary{
  background:linear-gradient(135deg,var(--accent),var(--secondary));
  color:#000;
}

.ps-card-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(200px,1fr));
  gap:14px;
}
</style>
`;
  }

  // -----------------------------
  // FULL OUTPUT
  // -----------------------------
  function buildFull(html, css) {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${css}
</head>
<body>
${html}
</body>
</html>
`;
  }

  // -----------------------------
  // OUTPUT PIPE
  // -----------------------------
  function pushOutputs(html, css, full) {
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setText("rcode-html", html);
    setText("rcode-css", css);
    setText("rcode-full", full);
  }

})();
