// ============================================================
// CLANK.WORLD RENDERING ENGINE
// renderer.js
// ============================================================

const Renderer = {
  canvas: null,

  // ----------------------------------------
  // INIT
  // ----------------------------------------
  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error("Renderer: canvas not found");
      return;
    }
  },

  // ----------------------------------------
  // MOUNT SINGLE SECTION
  // ----------------------------------------
  mount(section) {
    const node = this.createNode(section);
    if (!node) return;

    this.canvas.appendChild(node);
  },

  // ----------------------------------------
  // CREATE DOM NODE FROM SECTION
  // ----------------------------------------
  createNode(section) {
    const { id, type } = section;

    const wrapper = document.createElement("div");
    wrapper.className = "preview-section";
    wrapper.id = `sec-${id}`;
    wrapper.dataset.type = type;

    wrapper.innerHTML = `
      ${this.buildControls(id)}
      ${this.renderSection(type, id)}
    `;

    this.attachEvents(wrapper, id);

    return wrapper;
  },

  // ----------------------------------------
  // SECTION RENDER PIPELINE
  // ----------------------------------------
  renderSection(type, id) {
    const reg = SectionRegistry[type];

    if (!reg) {
      return `<p style="color:red">Unknown section: ${type}</p>`;
    }

    return reg.render(id);
  },

  // ----------------------------------------
  // CONTROLS OVERLAY
  // ----------------------------------------
  buildControls(id) {
    return `
      <div class="section-overlay">
        <div class="sec-ctrl" data-action="up">↑</div>
        <div class="sec-ctrl" data-action="down">↓</div>
        <div class="sec-ctrl" data-action="clone">⧉</div>
        <div class="sec-ctrl del" data-action="delete">✕</div>
      </div>

      <div class="drag-handle">⋮⋮</div>
    `;
  },

  // ----------------------------------------
  // EVENT BINDING (NO INLINE JS ANYMORE)
  // ----------------------------------------
  attachEvents(el, id) {
    const actions = el.querySelectorAll("[data-action]");

    actions.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();

        const action = btn.dataset.action;

        switch (action) {
          case "up":
            moveSection(`sec-${id}`, -1);
            break;

          case "down":
            moveSection(`sec-${id}`, 1);
            break;

          case "delete":
            deleteSection(`sec-${id}`);
            break;

          case "clone":
            cloneSection(`sec-${id}`);
            break;
        }
      });
    });

    el.addEventListener("click", () => {
      selectSection(`sec-${id}`);
    });
  },

  // ----------------------------------------
  // FULL RENDER (REBUILD CANVAS)
  // ----------------------------------------
  renderAll(sections) {
    if (!this.canvas) return;

    this.canvas.innerHTML = "";

    sections.forEach(sec => {
      this.mount(sec);
    });
  }
};
