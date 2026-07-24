// ===== THEME GALLERY LOGIC — KARTU NAMA v3 =====
(function(){
  const root = document.documentElement;
  const grid = document.getElementById("themesGrid");
  if (!grid) return;

  let activeTheme = localStorage.getItem("colorTheme") || "default";
  let isDark = root.classList.contains("dark");

  const ILLU = { light:"fa-sun", dark:"fa-moon" };

  function applyTheme(slug){
    if (slug === "default") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", slug);
    localStorage.setItem("colorTheme", slug);
    activeTheme = slug;
    document.querySelectorAll(".tc-body").forEach(b=>{
      b.classList.toggle("active", b.dataset.slug === slug);
    });
  }

  function toggleCardMode(cardEl){
    isDark = !isDark;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    const m = cardEl.querySelector(".tc-mode");
    if (m) m.innerHTML = `<i class="fa-solid fa-${isDark?'sun':'moon'}"></i>`;
    if (window.syncIcon) syncIcon();
  }

  function getThemeVars(slug){
    let lightVars = "", darkVars = "";
    try {
      for (const sheet of document.styleSheets){
        try {
          for (const rule of sheet.cssRules){
            const sel = rule.selectorText || "";
            if (sel === `[data-theme="${slug}"]` && !sel.includes(".dark")){
              lightVars = rule.cssText.replace(/\[data-theme="[^"]+"\]\s*\{/, "").replace(/\}\s*$/, "").trim();
            }
            if (sel === `[data-theme="${slug}"].dark`){
              darkVars = rule.cssText.replace(/\[data-theme="[^"]+"\]\.dark\s*\{/, "").replace(/\}\s*$/, "").trim();
            }
          }
        } catch(e){}
      }
    } catch(e){}
    return {lightVars, darkVars};
  }

  function getThemeCSS(slug){
    const {lightVars, darkVars} = getThemeVars(slug);
    const name = THEMES.find(t=>t.slug===slug);
    const label = name ? `${name.name}` : slug;
    let css = `/* ===== ${label} ===== */\n\n/* Light Mode */\n:root {\n  ${lightVars.replace(/\n/g, "\n  ")}\n}\n`;
    if (darkVars) css += `\n/* Dark Mode */\n.dark {\n  ${darkVars.replace(/\n/g, "\n  ")}\n}\n`;
    return css;
  }

  function copyThemeCSS(slug){
    const css = getThemeCSS(slug);
    const lang = document.documentElement.lang || "id";
    const copiedMsg = lang === "en" ? "Copied!" : "Tersalin!";
    navigator.clipboard.writeText(css).then(()=>{
      const btn = document.querySelector(`[data-copy="${slug}"]`);
      if (btn){ btn.innerHTML = '<i class="fa-solid fa-check"></i> ' + copiedMsg; btn.classList.add("copied"); setTimeout(()=>{ btn.innerHTML = '<i class="fa-regular fa-copy"></i> ' + getButtonText("copy"); btn.classList.remove("copied"); }, 1500); }
    }).catch(()=>{
      const ta = document.createElement("textarea"); ta.value = css; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    });
  }

  function downloadThemeCSS(slug){
    const css = getThemeCSS(slug);
    const blob = new Blob([css], {type:"text/css"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `theme-${slug}.css`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    const btn = document.querySelector(`[data-download="${slug}"]`);
    const lang = document.documentElement.lang || "id";
    const downloadedMsg = lang === "en" ? "Downloaded!" : "Terunduh!";
    if (btn){ btn.innerHTML = '<i class="fa-solid fa-check"></i> ' + downloadedMsg; setTimeout(()=>{ btn.innerHTML = '<i class="fa-solid fa-download"></i> ' + getButtonText("download"); }, 1500); }
  }

  // Render icon: FA class, atau SVG/text custom untuk kasus khusus
  function iconHTML(icon){
    if (!icon) return '<i class="fa-solid fa-palette"></i>';
    if (icon === "svg-pumpkin"){
      return '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="#E0762A" aria-label="Pumpkin"><path d="M12 4c-1 0-1.7.6-2 .9C9.3 4.4 8.4 4 7.4 4c-.8 0-1.5.3-2 .9C4.7 4.4 3.8 4 3 4c-1.2 0-2 .9-2 2.2 0 .7.3 1.3.8 1.8C.9 8.7.7 9.5.7 10.4c0 1 .5 1.9 1.3 2.6C1.2 13.8.9 14.8 1 16c.1 1.4.9 2.6 2 3.4 1.2.9 2.8 1.3 4.4 1.1.9-.1 1.7-.4 2.4-.9.6.5 1.3.8 2.1.9.7.1 1.4 0 2.1-.2.6.4 1.3.6 2 .6 1.9 0 3.6-.7 4.7-2 .9-1.1 1.3-2.6 1.1-4.1-.1-1-.5-1.9-1-2.7.8-.7 1.3-1.6 1.3-2.6 0-.9-.2-1.7-.6-2.4.5-.5.8-1.1.8-1.8C21 4.9 20.2 4 19 4c-.8 0-1.7.4-2.4.9.5-.6 1.2-.9 2-.9-1 0-1.9.4-2.6.9C14.5 4.6 13.8 4 12 4z"/><path d="M10 3c.4-1 1.2-1.8 2-2.3C12.8 1.6 13 2.6 13 3.5c0 .7-.3 1.3-.8 1.8-.4-.5-1.2-.8-2-.8-.2 0-.3 0-.4.1.3-.4.7-.6 1.2-.6z" fill="#5C8A3A"/></svg>';
    }
    if (icon === "svg-snow"){
      return '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="#4FA8E0" stroke-width="1.6" stroke-linecap="round" aria-label="Snowflake"><g><line x1="12" y1="2" x2="12" y2="22"/><line x1="3.5" y1="7" x2="20.5" y2="17"/><line x1="20.5" y1="7" x2="3.5" y2="17"/><path d="M12 5l1.6 1.6M12 5L10.4 6.6M12 19l1.6-1.6M12 19l-1.6-1.6M5.5 8.5l2.1.3M5.5 8.5l.3 2.1M18.5 8.5l-2.1.3M18.5 8.5l-.3 2.1M18.5 15.5l-2.1-.3M18.5 15.5l-.3-2.1M5.5 15.5l2.1-.3M5.5 15.5l.3-2.1"/></g></svg>';
    }
    if (icon === "svg-ketupat"){
      return '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-label="Ketupat"><path d="M12 2l7 7-7 7-7-7 7-7z" fill="#2E8B57"/><path d="M12 2l7 7-7 7-7-7 7-7z" fill="none" stroke="#1f6b41" stroke-width="1"/><path d="M5 9h14M9 5v14M15 5v14M5 15h14" stroke="#3aa86a" stroke-width=".8" opacity=".7"/></svg>';
    }
    if (icon === "img-81"){
      return '<img src="logo-81.png?v=1" alt="81" class="ic-81-img" aria-label="HUT RI 81">';
    }
    return '<i class="fa-solid '+icon+'"></i>';
  }

  function getTagline(t){
    const lang = document.documentElement.lang || "id";
    if (lang === "en" && t.tagline_en) return t.tagline_en;
    if (t.tagline_id) return t.tagline_id;
    return (t.tag && t.tag !== "undefined") ? t.tag : (t.desc || "");
  }

  function getButtonText(key){
    const lang = document.documentElement.lang || "id";
    const btnLabels = {
      id: { apply: "Pakai", copy: "Copy", download: "Unduh", mode: "Mode" },
      en: { apply: "Apply", copy: "Copy", download: "Download", mode: "Mode" }
    };
    return (btnLabels[lang] || btnLabels.id)[key];
  }

  function cardHTML(t){
    const active = (t.slug === activeTheme) ? " active" : "";
    const tagline = getTagline(t);
    const illu = iconHTML(t.icon);
    const accent = t.accent || "var(--caramel)";
    const sw = (t.vars||["--caramel","--sunset","--espresso","--card","--cream","--border"]).map(v=>{
      const style = v.startsWith('#') ? `background:${v}` : `background:var(${v})`;
      return `<span class="tc-sw" style="${style}" title="${v}"></span>`;
    }).join("");
    return `
    <div class="theme-card" data-slug="${t.slug}" style="--accent:${accent}">
      <div class="tc-body${active}" data-slug="${t.slug}">
        <div class="tc-half light" data-prev="${t.slug}">
          <span class="lbl"><i class="fa-solid ${ILLU.light}"></i> Light</span>
          <div class="tc-illu">${illu}</div>
          <span class="tc-pill" style="background:${accent}">${illu} ${t.name}</span>
          <div class="tc-swatches">${sw}</div>
        </div>
        <div class="tc-info">
          <div class="tc-name">${t.name}</div>
          <div class="tc-tag" data-slug="${t.slug}">${tagline}</div>
        </div>
        <div class="tc-half dark" data-prev="${t.slug}">
          <span class="lbl"><i class="fa-solid ${ILLU.dark}"></i> Dark</span>
          <div class="tc-illu">${illu}</div>
          <span class="tc-pill" style="background:${accent}">${illu} ${t.name}</span>
          <div class="tc-swatches">${sw}</div>
        </div>
      </div>
      <div class="tc-actions">
        <button class="tc-apply" data-apply="${t.slug}"><i class="fa-solid fa-check"></i> ${getButtonText("apply")}</button>
        <button class="tc-mode" data-mode="${t.slug}" title="Toggle Dark/Light"><i class="fa-solid fa-${isDark?'sun':'moon'}"></i></button>
        <button class="tc-copy" data-copy="${t.slug}" title="Salin CSS"><i class="fa-regular fa-copy"></i> ${getButtonText("copy")}</button>
        <button class="tc-dl" data-download="${t.slug}" title="Unduh CSS"><i class="fa-solid fa-download"></i> ${getButtonText("download")}</button>
      </div>
    </div>`;
  }

  // ===== RENDER (loop semua grup dari GROUPS — extensible) =====
  let html = "";
  GROUPS.forEach((g, gi)=>{
    html += `<div class="theme-divider" style="--accent:${g.accent||'var(--caramel)'}"><span><i class="fa-solid ${g.icon||'fa-palette'}"></i> ${g.label}</span></div>`;
    html += `<div class="theme-group-sub">${g.sub}</div>`;
    html += `<div class="themes-grid">`;
    THEMES.filter(t=>t.group===g.key).forEach(t=>{ html += cardHTML(t); });
    html += `</div>`;
  });
  grid.innerHTML = html;

  // Set preview pakai data-theme masing-masing
  document.querySelectorAll(".tc-half[data-prev]").forEach(el=>{
    el.setAttribute("data-theme", el.dataset.prev);
  });

  // ===== EVENTS =====
  grid.addEventListener("click", e=>{
    const applyBtn = e.target.closest("[data-apply]");
    const modeBtn = e.target.closest("[data-mode]");
    const copyBtn = e.target.closest("[data-copy]");
    const dlBtn = e.target.closest("[data-download]");

    if (applyBtn){
      const slug = applyBtn.dataset.apply;
      applyTheme(slug);
      applyBtn.classList.add("done");
      const old = applyBtn.innerHTML;
      const lang = document.documentElement.lang || "id";
      const activeMsg = lang === "en" ? "Active!" : "Aktif!";
      applyBtn.innerHTML = '<i class="fa-solid fa-check"></i> ' + activeMsg;
      setTimeout(()=>{ applyBtn.classList.remove("done"); applyBtn.innerHTML = old; }, 1400);
    }
    if (modeBtn) toggleCardMode(modeBtn.closest(".theme-card"));
    if (copyBtn) copyThemeCSS(copyBtn.dataset.copy);
    if (dlBtn) downloadThemeCSS(dlBtn.dataset.download);
  });

  window.__syncGalleryMode = function(){};

  // Re-render gallery saat language berubah (tanpa reload)
  window.__syncGalleryLang = function(lang){
    const grid = document.getElementById("themesGrid");
    if (!grid || typeof THEMES === "undefined" || typeof GROUPS === "undefined") return;
    let html = "";
    GROUPS.forEach((g, gi)=>{
      html += `<div class="theme-divider" style="--accent:${g.accent||'var(--caramel)'}"><span><i class="fa-solid ${g.icon||'fa-palette'}"></i> ${g.label}</span></div>`;
      html += `<div class="theme-group-sub">${g.sub}</div>`;
      html += `<div class="themes-grid">`;
      THEMES.filter(t=>t.group===g.key).forEach(t=>{ html += cardHTML(t); });
      html += `</div>`;
    });
    grid.innerHTML = html;
    document.querySelectorAll(".tc-half[data-prev]").forEach(el=>{
      el.setAttribute("data-theme", el.dataset.prev);
    });
  };

  // Language toggle support (fallback reload)
  window.toggleLanguage = function(lang){
    document.documentElement.lang = lang;
    localStorage.setItem("language", lang);
    location.reload();
  };
})();
