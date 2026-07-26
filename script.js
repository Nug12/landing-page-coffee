// Theme toggle (dark/light) - global
const toggle = document.getElementById("themeToggle");
const root = document.documentElement;

function syncIcon(){
  const dark = root.classList.contains("dark");
  if (toggle) toggle.innerHTML = dark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}
if (toggle){
  toggle.addEventListener("click", () => {
    root.classList.toggle("dark");
    try { localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light"); } catch(e){}
    syncIcon();
    // sync gallery tile mode
    if (window.__syncGalleryMode) window.__syncGalleryMode();
  });
}
syncIcon();

// Load apps with bilingual support
fetch("apps.json?v=3")
  .then(r => r.json())
  .then(data => {
    document.getElementById("appsGrid").innerHTML = data.apps.map(app => {
      const demo = app.demo ? `
        <div class="app-demo">
          <div class="demo-title"><i class="fa-solid fa-key"></i> Akun Demo</div>
          <div class="demo-row"><span>User</span><code>${app.demo.username}</code><button class="copy-btn" data-copy="${app.demo.username}"><i class="fa-regular fa-copy"></i></button></div>
          <div class="demo-row"><span>Pass</span><code>${app.demo.password}</code><button class="copy-btn" data-copy="${app.demo.password}"><i class="fa-regular fa-copy"></i></button></div>
        </div>` : "";
      const st = app.status ? app.status.toLowerCase() : 'live';
      
      // Special handling for KeuanganKu card
      if (app.name === "KeuanganKu") {
        return `
      <div class="app-card keuanganku-card" data-url="${app.url}">
        <span class="status ${st} corner" data-status><span class="dot"></span>${app.status || 'Live'}</span>
        <div class="app-icon-wrapper">
          <div class="app-icon" style="background:${app.color || '#C8893F'}"><i class="${app.icon}"></i></div>
          <h3 data-text-id="KeuanganKu" data-text-en="KeuanganKu">${app.name}</h3>
        </div>
        <p data-text-id="${app.description}" data-text-en="${app.description_en || app.description}">${app.description}</p>
        ${demo}
        <div class="app-meta">
          <a class="app-link gh-link" href="https://github.com/nug12" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> GitHub</a>
          <span class="sep">|</span>
          <a class="app-link" href="${app.url}" target="_blank" rel="noopener" data-text-id="Buka Demo" data-text-en="Open Demo">Buka Demo <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>`;
      }
      
      // Regular app cards
      return `
      <div class="app-card" data-url="${app.url}">
        <span class="status ${st} corner" data-status><span class="dot"></span>${app.status || 'Live'}</span>
        <div class="app-icon" style="background:${app.color || '#C8893F'}"><i class="${app.icon}"></i></div>
        <h3>${app.name}</h3>
        <p>${app.description}</p>
        ${demo}
        <div class="app-meta">
          <a class="app-link gh-link" href="https://github.com/nug12" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> GitHub</a>
          <span class="sep">|</span>
          <a class="app-link" href="${app.url}" target="_blank" rel="noopener">Buka Demo <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>`;
    }).join("");
    document.querySelectorAll(".copy-btn").forEach(b => {
      b.addEventListener("click", () => {
        navigator.clipboard.writeText(b.dataset.copy);
        b.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(() => b.innerHTML = '<i class="fa-regular fa-copy"></i>', 1200);
      });
    });
    // ===== AUTO-CHECK STATUS SERVER (Live / Down) =====
    document.querySelectorAll(".app-card").forEach(card => {
      const url = card.dataset.url;
      const badge = card.querySelector("[data-status]");
      if (!badge) return;
      const setDown = () => {
        badge.className = "status down corner";
        badge.innerHTML = '<span class="dot"></span>Down';
      };
      // no-cors fetch: kalau network gagal/timeout -> Down
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 5000);
      fetch(url, {mode:"no-cors", cache:"no-store", signal:ctrl.signal})
        .then(() => clearTimeout(to))
        .catch(() => { clearTimeout(to); setDown(); });
    });
  })
  .catch(() => { 
    const grid = document.getElementById("appsGrid");
    if (grid) grid.innerHTML = '<p class="testi-empty">Gagal memuat aplikasi.</p>'; 
  });

// Testimonials
const tg = document.getElementById("testiGrid");
function renderTesti(list){
  if (!tg) return; // Guard: testiGrid tidak ada (e.g., tema.html)
  const lang = document.documentElement.getAttribute("data-lang") || "id";
  if (!list || list.length === 0){
    tg.innerHTML = `
      <div class="testi-card">
        <p class="testi-empty"><i class="fa-solid fa-mug-hot"></i> Belum ada cerita. Jadilah yang pertama mencoba dan berbagi pengalaman ☕</p>
        <div class="testi-author"><div class="testi-avatar">?</div><div><div class="testi-name">Kosong</div><div class="testi-role">Menunggu pengguna</div></div></div>
      </div>`;
    return;
  }
  tg.innerHTML = list.slice().reverse().map(t => `
    <div class="testi-card">
      <p class="testi-quote">"${lang === "en" && t.quote_en ? t.quote_en : t.quote}"</p>
      <div class="testi-author"><div class="testi-avatar">${(t.initial||'?')}</div><div><div class="testi-name">${lang === "en" && t.name_en ? t.name_en : t.name}</div><div class="testi-role">${lang === "en" && t.role_en ? t.role_en : t.role || 'Pengguna'}</div></div></div>
    </div>`).join("");
}
fetch("/api/testi")
  .then(r => r.json())
  .then(renderTesti)
  .catch(() => renderTesti([]));

// ===== MODAL CERITA =====
const ceritaMenu = document.getElementById("ceritaMenu");
const ceritaModal = document.getElementById("ceritaModal");
const ceritaClose = document.getElementById("ceritaClose");
function openCerita(){ if(ceritaModal) ceritaModal.classList.add("open"); }
function closeCerita(){ if(ceritaModal) ceritaModal.classList.remove("open"); }
if (ceritaMenu){
  ceritaMenu.addEventListener("click", (e)=>{ e.preventDefault(); openCerita(); });
}
if (ceritaClose) ceritaClose.addEventListener("click", closeCerita);
if (ceritaModal) ceritaModal.addEventListener("click", (e)=>{ if(e.target===ceritaModal) closeCerita(); });
document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") closeCerita(); });
// Auto-open jika diarahkan dari tema.html
try{ if(localStorage.getItem("openCerita")==="1"){ localStorage.removeItem("openCerita"); setTimeout(openCerita,400); } }catch(e){}

// Setup form placeholders with bilingual data attributes
function setupFormPlaceholders() {
  const nameInput = document.getElementById("tName");
  const roleInput = document.getElementById("tRole");
  const quoteInput = document.getElementById("tQuote");
  
  if (nameInput) {
    nameInput.setAttribute('data-placeholder-id', 'Nama');
    nameInput.setAttribute('data-placeholder-en', 'Name');
  }
  if (roleInput) {
    roleInput.setAttribute('data-placeholder-id', 'Peran (mis. Developer)');
    roleInput.setAttribute('data-placeholder-en', 'Role (e.g. Developer)');
  }
  if (quoteInput) {
    quoteInput.setAttribute('data-placeholder-id', 'Cerita kamu...');
    quoteInput.setAttribute('data-placeholder-en', 'Your story...');
  }
}

// Call on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupFormPlaceholders);
} else {
  setupFormPlaceholders();
}

const form = document.getElementById("testiForm");
const msg = document.getElementById("tMsg");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById("tName").value,
      role: document.getElementById("tRole").value,
    quote: document.getElementById("tQuote").value,
    hp: document.getElementById("tHp").value
  };
  msg.textContent = "Mengirim...";
  msg.style.color = "var(--espresso-2)";
  fetch("/api/testi", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  })
  .then(r => { if (!r.ok) throw new Error("fail"); return r.json(); })
  .then(() => {
    form.reset();
    msg.textContent = "✅ Terima kasih! Ceritamu sudah tampil.";
    msg.style.color = "#4a7a4a";
    fetch("/api/testi").then(r=>r.json()).then(renderTesti);
    setTimeout(closeCerita, 900);
  })
  .catch(() => { msg.textContent = "❌ Gagal mengirim, coba lagi."; msg.style.color = "#c0392b"; });
  });
}

// Expose renderTesti ke global agar lang.js bisa panggil saat ganti bahasa
window.renderTesti = renderTesti;
