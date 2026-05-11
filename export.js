// ============================================================
// CLANK.WORLD EXPORT ENGINE
// export.js
// ============================================================

const Exporter = {

  // ----------------------------------------
  // MAIN DOWNLOAD
  // ----------------------------------------
  download() {
    const html = buildHTML();
    const css = buildCSS();
    const full = buildFull(html, css);

    this.downloadFile("index.html", full);
  },

  // ----------------------------------------
  // COPY TO CLIPBOARD
  // ----------------------------------------
  copy(type) {
    let data = "";

    if (type === "html") data = buildHTML();
    if (type === "css") data = buildCSS();
    if (type === "full") data = buildFull(buildHTML(), buildCSS());

    navigator.clipboard.writeText(data);
    showToast("Copied!");
  },

  // ----------------------------------------
  // FILE DOWNLOAD
  // ----------------------------------------
  downloadFile(name, content) {
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();

    URL.revokeObjectURL(url);
  }
};

// ----------------------------------------
// BUILD FULL PAGE
// ----------------------------------------
function buildFull(html, css) {
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
