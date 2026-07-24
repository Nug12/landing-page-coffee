// Language Toggle System with comprehensive sync
const langToggle = document.getElementById('langToggle');
const html = document.documentElement;

// Initialize language from localStorage or default to 'id'
function initLang() {
  try {
    const saved = localStorage.getItem('lang') || 'id';
    html.setAttribute('data-lang', saved);
    updateLangButton(saved);
    updatePageContent(saved);
  } catch(e) {
    console.log('Lang init:', e.message);
  }
}

function updateLangButton(lang) {
  const btn = document.querySelector('.lang-text');
  if (btn) btn.textContent = lang === 'id' ? 'ID' : 'EN';
}

function switchLang(lang) {
  html.setAttribute('data-lang', lang);
  try {
    localStorage.setItem('lang', lang);
  } catch(e) {}
  updateLangButton(lang);
  updatePageContent(lang);
  
  // Re-fetch and re-render testimonials in the new language
  fetch('/api/testi')
    .then(r => r.json())
    .then(renderTesti)
    .catch(()=>{});
  
  // Sync gallery language if on themes page
  if (window.__syncGalleryLang) {
    window.__syncGalleryLang(lang);
  }
}

function updatePageContent(lang) {
  const attr = lang === 'id' ? 'data-text-id' : 'data-text-en';
  
  // Update all text content elements with data-text-id/en
  document.querySelectorAll('[data-text-id][data-text-en]').forEach(el => {
    const text = el.getAttribute(attr);
    if (text) {
      const tag = el.tagName.toLowerCase();
      
      // For h1/h2/h3 with accent span, split text and update span
      if (['h1', 'h2', 'h3'].includes(tag) && el.querySelector('span.accent')) {
        const accentSpan = el.querySelector('span.accent');
        // Assume format: "Kopi Senja, Kode yang Nyaman" and span has "Kode yang Nyaman"
        const parts = text.split(', ');
        if (parts.length === 2) {
          el.textContent = parts[0] + ', ';
          accentSpan.textContent = parts[1];
          el.appendChild(accentSpan);
        } else {
          el.textContent = text;
        }
      } else if (['h4', 'h5', 'h6', 'p'].includes(tag)) {
        el.textContent = text;
      } else if (el.children.length > 0 && el.querySelector('i')) {
        // For elements with icons (buttons, nav), preserve icon, replace text
        const icon = el.querySelector('i');
        el.textContent = '';
        el.appendChild(icon.cloneNode(true));
        el.insertAdjacentText('beforeend', ' ' + text);
      } else {
        el.textContent = text;
      }
    }
  });
  
  // Update placeholders for form inputs
  document.querySelectorAll('[data-placeholder-id][data-placeholder-en]').forEach(el => {
    const placeholder = el.getAttribute(lang === 'id' ? 'data-placeholder-id' : 'data-placeholder-en');
    if (placeholder) el.setAttribute('placeholder', placeholder);
  });
  
  // Update modal title
  const modalTitle = document.getElementById('ceritaTitle');
  if (modalTitle) {
    const titleText = modalTitle.getAttribute(attr);
    if (titleText) {
      const icon = modalTitle.querySelector('i:first-child');
      const mugIcon = modalTitle.querySelector('i:last-child');
      if (icon && mugIcon) {
        modalTitle.innerHTML = `<i class="fa-solid fa-comments"></i> ${titleText} <i class="fa-solid fa-mug-hot"></i>`;
      }
    }
  }
  
  // Update form button text
  const submitBtn = document.querySelector('#testiForm .btn-primary');
  if (submitBtn) {
    const btnText = submitBtn.getAttribute(attr);
    if (btnText) {
      submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${btnText}`;
    }
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLang);
} else {
  initLang();
}

function toggleLanguageNow() {
  const html = document.documentElement;
  const currentLang = html.getAttribute("data-lang") || "id";
  const newLang = currentLang === "id" ? "en" : "id";
  switchLang(newLang);
}
