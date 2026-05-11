// ============================================================
// CLANK.WORLD UI CONTROLS ENGINE
// ui-controls.js
// ============================================================

const UIControls = {

  // ----------------------------------------
  // INIT ALL CONTROL BINDINGS
  // ----------------------------------------
  init() {
    this.bindButtons();
    this.bindSliders();
    this.bindToggles();
    this.bindTemplates();
  },

  // ----------------------------------------
  // BUTTONS
  // ----------------------------------------
  bindButtons() {
    document.querySelectorAll("[data-action]").forEach(btn => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.action;

        switch (action) {
          case "add-section":
            addSection(btn.dataset.type);
            Renderer.renderAll(sections);
            break;

          case "reset":
            resetLayout();
            Renderer.renderAll(sections);
            break;

          case "export":
            Exporter.download();
            break;

          case "save":
            savePreset();
            break;

          case "load":
            loadPreset();
            Renderer.renderAll(sections);
            break;
        }
      });
    });
  },

  // ----------------------------------------
  // SLIDERS (spacing, typography, etc.)
  // ----------------------------------------
  bindSliders() {
    const sliders = document.querySelectorAll("input[type='range']");

    sliders.forEach(slider => {
      slider.addEventListener("input", () => {
        applySpacing?.();
        applyTypo?.();
        applyHoverEffects?.();
      });
    });
  },

  // ----------------------------------------
  // TOGGLES
  // ----------------------------------------
  bindToggles() {
    document.querySelectorAll("[data-toggle]").forEach(toggle => {
      toggle.addEventListener("click", () => {
        const key = toggle.dataset.toggle;

        toggleState[key] = !toggleState[key];

        applyTypo?.();
        applyHoverEffects?.();
      });
    });
  },

  // ----------------------------------------
  // TEMPLATE SELECTOR
  // ----------------------------------------
  bindTemplates() {
    document.querySelectorAll("[data-template]").forEach(btn => {
      btn.addEventListener("click", () => {
        loadTemplate(btn.dataset.template);
        Renderer.renderAll(sections);
      });
    });
  }
};
