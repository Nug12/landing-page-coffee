// Language Toggle System v18 — clean
const html = document.documentElement;

function getLang() {
  return html.getAttribute("data-lang") || "id";
}

function updateLangButton(lang) {
  const btn = document.querySelector(".lang-text");
  if (btn) btn.textContent = lang === "id" ? "ID" : "EN";
}

function updatePageContent(lang) {
  const attr = lang === "id" ? "data-text-id" : "data-text-en";

  // Update semua elemen dengan data-text-id/en
  document.querySelectorAll("[data-text-id][data-text-en]").forEach((el) => {
    const text = el.getAttribute(attr);
    if (!text) return;
    const tag = el.tagName.toLowerCase();

    if (["h1", "h2", "h3"].includes(tag) && el.querySelector("span.accent")) {
      const accentSpan = el.querySelector("span.accent");
      const parts = text.split(", ");
      if (parts.length === 2) {
        el.textContent = parts[0] + ", ";
        accentSpan.textContent = parts[1];
        el.appendChild(accentSpan);
      } else {
        el.textContent = text;
      }
    } else if (["h4", "h5", "h6", "p", "a", "span", "button", "li"].includes(tag)) {
      // Jika punya icon anak, pertahankan icon
      const icon = el.querySelector("i");
      if (icon && el.children.length > 0) {
        el.textContent = "";
        el.appendChild(icon.cloneNode(true));
        el.insertAdjacentText("beforeend", " " + text);
      } else {
        el.textContent = text;
      }
    } else {
      el.textContent = text;
    }
  });

  // Placeholders form
  document.querySelectorAll("[data-placeholder-id][data-placeholder-en]").forEach((el) => {
    const ph = el.getAttribute(lang === "id" ? "data-placeholder-id" : "data-placeholder-en");
    if (ph) el.setAttribute("placeholder", ph);
  });

  // Modal title (landing page)
  const modalTitle = document.getElementById("ceritaTitle");
  if (modalTitle) {
    const titleText = modalTitle.getAttribute(attr);
    if (titleText) {
      modalTitle.innerHTML = `<i class="fa-solid fa-comments"></i> ${titleText} <i class="fa-solid fa-mug-hot"></i>`;
    }
  }

  // Submit button (landing page)
  const submitBtn = document.querySelector("#testiForm .btn-primary");
  if (submitBtn) {
    const btnText = submitBtn.getAttribute(attr);
    if (btnText) submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${btnText}`;
  }
}

function switchLang(lang) {
  html.setAttribute("data-lang", lang);
  try { localStorage.setItem("lang", lang); } catch (e) {}
  updateLangButton(lang);
  updatePageContent(lang);

  // Sync gallery tema (jika ada)
  if (typeof window.__syncGalleryLang === "function") {
    window.__syncGalleryLang(lang);
  }

  // Landing page: re-fetch testimoni
  if (typeof window.renderTesti === "function") {
    fetch("/api/testi")
      .then((r) => r.json())
      .then(window.renderTesti)
      .catch(() => {});
  }
}

function initLang() {
  const saved = (function () {
    try { return localStorage.getItem("lang") || "id"; } catch (e) { return "id"; }
  })();
  html.setAttribute("data-lang", saved);
  updateLangButton(saved);
  updatePageContent(saved);
  if (typeof window.__syncGalleryLang === "function") window.__syncGalleryLang(saved);
}

function toggleLanguageNow() {
  const current = getLang();
  switchLang(current === "id" ? "en" : "id");
}

// Expose global untuk inline onclick
window.toggleLanguageNow = toggleLanguageNow;

// Init saat load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLang);
} else {
  initLang();
}
