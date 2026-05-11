// ============================================================
// CLANK.WORLD SECTION REGISTRY
// sections.js
// ============================================================

const SectionRegistry = {
  // ------------------------------------------------------------
  // NAVBAR
  // ------------------------------------------------------------
  navbar: {
    type: "navbar",
    render: (id) => `
      <div class="ps-navbar">
        <div class="ps-nav-logo" contenteditable="true">CLANK.WORLD</div>
        <div class="ps-nav-link" contenteditable="true">HOME</div>
        <div class="ps-nav-link" contenteditable="true">PROFILE</div>
        <div class="ps-nav-link" contenteditable="true">STATS</div>
        <div class="ps-nav-link" contenteditable="true">LEADERBOARD</div>
      </div>
    `
  },

  // ------------------------------------------------------------
  // HERO
  // ------------------------------------------------------------
  hero: {
    type: "hero",
    render: () => `
      <div class="ps-hero">
        <div class="ps-hero-eyebrow" contenteditable="true">
          ◆ WELCOME TO THE FUTURE ◆
        </div>

        <h1 class="ps-hero-title" contenteditable="true">
          NEXT LEVEL<br>GAMING
        </h1>

        <p class="ps-hero-sub" contenteditable="true">
          A cutting-edge platform built for creators and champions.
        </p>

        <div class="ps-hero-cta">
          <button class="ps-btn ps-btn-primary" contenteditable="true">
            JOIN NOW
          </button>
          <button class="ps-btn ps-btn-outline" contenteditable="true">
            LEARN MORE
          </button>
        </div>
      </div>
    `
  },

  // ------------------------------------------------------------
  // CARDS
  // ------------------------------------------------------------
  cards: {
    type: "cards",
    render: () => `
      <div class="ps-section-header">
        <h2 class="ps-section-title" contenteditable="true">FEATURES</h2>
        <p class="ps-section-sub" contenteditable="true">
          Everything you need to build and dominate.
        </p>
      </div>

      <div class="ps-card-grid">
        ${card("⚡", "LIGHTNING SPEED", "Ultra-fast performance with zero compromise.")}
        ${card("🔒", "SECURE VAULT", "Military-grade protection for all assets.")}
        ${card("🌐", "GLOBAL NETWORK", "Connect with players worldwide.")}
      </div>
    `
  },

  // ------------------------------------------------------------
  // STATS
  // ------------------------------------------------------------
  stats: {
    type: "stats",
    render: () => `
      <div class="ps-section-header ps-centered">
        <h2 class="ps-section-title" contenteditable="true">BY THE NUMBERS</h2>
      </div>

      <div class="ps-stats-row">
        ${stat("12.4K", "Active Players")}
        ${stat("98%", "Uptime")}
        ${stat("$4.2M", "Distributed")}
        ${stat("340+", "Countries")}
      </div>
    `
  },

  // ------------------------------------------------------------
  // LEADERBOARD
  // ------------------------------------------------------------
  leaderboard: {
    type: "leaderboard",
    render: () => `
      <div class="ps-section-header">
        <h2 class="ps-section-title" contenteditable="true">LEADERBOARD</h2>
        <p class="ps-section-sub">Top players this season</p>
      </div>

      <div class="ps-lb">
        ${lbRow("#1", "CLANKMASTER", "9,842", true)}
        ${lbRow("#2", "DARKX99", "8,417")}
        ${lbRow("#3", "NEXUS_OP", "7,229")}
        ${lbRow("#4", "VOID_EX", "6,011")}
        ${lbRow("#5", "STARBURST", "5,884")}
      </div>
    `
  },

  // ------------------------------------------------------------
  // FOOTER
  // ------------------------------------------------------------
  footer: {
    type: "footer",
    render: () => `
      <div class="ps-footer">
        <div class="ps-footer-logo" contenteditable="true">
          CLANK.WORLD
        </div>

        <div class="ps-footer-links">
          <div class="ps-footer-link">PRIVACY</div>
          <div class="ps-footer-link">TERMS</div>
          <div class="ps-footer-link">CONTACT</div>
        </div>

        <div class="ps-footer-copy">
          © 2025 CLANK.WORLD
        </div>
      </div>
    `
  }
};

// ============================================================
// HELPERS (small reusable UI blocks)
// ============================================================

function card(icon, title, desc) {
  return `
    <div class="ps-card">
      <div class="ps-card-icon">${icon}</div>
      <div class="ps-card-title">${title}</div>
      <div class="ps-card-desc">${desc}</div>
    </div>
  `;
}

function stat(value, label) {
  return `
    <div class="ps-stat-item">
      <span class="ps-stat-val">${value}</span>
      <span class="ps-stat-label">${label}</span>
    </div>
  `;
}

function lbRow(rank, name, score, top = false) {
  return `
    <div class="ps-lb-row">
      <div class="ps-lb-rank ${top ? "top" : ""}">${rank}</div>
      <div class="ps-lb-name">${name}</div>
      <div class="ps-lb-score">${score}</div>
    </div>
  `;
}
