# Nug12 Dev — Landing Page (Kopi Senja & Kode)

Landing page pribadi untuk showcase aplikasi buatan tangan, bertema hangat "kopi senja".
Dibangun statis (HTML/CSS/JS) tanpa framework, di‑serve via Caddy + Cloudflare.

## ✨ Fitur Utama

- **Bilingual ID/EN** — Toggle bahasa (ikon 🌐) di pojok kanan atas. Seluruh teks
  (hero, navigasi, tombol, deskripsi aplikasi, testimoni, footer) berubah real‑time
  via `localStorage`, tanpa reload.
- **Hero dengan aksen oranye** — "Kode yang Nyaman" diberi warna solid oranye
  (`--sunset`) baik di mode ID maupun EN.
- **Daftar Aplikasi** — Kartu aplikasi di‑render dari `apps.json`. KeuanganKu mendapat
  penanganan khusus (badge Live/Down otomatis, akun demo, tombol Buka Demo).
- **Cerita Pengguna (Testimoni)** — Diambil dari endpoint `/api/testi` (backend Python
  stdlib). Saat ganti bahasa, kartu testimoni langsung render ulang dalam EN/ID.
- **Modal Bagikan Cerita** — Form submit testimoni dengan anti‑spam honeypot +
  rate‑limit di sisi server. Placeholder & tombol bilingual.
- **Gallery Tema (tema.html)** — 23 tema (10 Coffee + 10 Soft Dark + 3 Event:
  Golden Eid 🟢, Snowy Christmas 🔵, Independence Day 🔴). Klik "Pakai" mengubah
  seluruh halaman sesuai aksen tema.
- **Dark/Light mode** — Toggle ikon bulan/matahari, tersimpan di `localStorage`.
- **Responsif** — Mobile‑first, grid otomatis.

## 🛠️ Tech Stack

- HTML5 + CSS3 (custom properties / CSS variables)
- Vanilla JavaScript (ES6+, fetch API)
- Font Awesome 6 (free) untuk ikon
- Backend testimoni: Python stdlib (`testi-server.py`, port 127.0.0.1:8088)
- Reverse proxy: Caddy + Cloudflare (cache rule = DYNAMIC / no‑store)

## 📁 Struktur File

```
index.html            # Landing page utama
tema.html             # Gallery tema
style.css             # Styling global + tema
script.js             # Render apps, testimoni, modal, dark mode
lang.js               # Sistem toggle bahasa EN/ID
apps.json             # Data aplikasi (termasuk description_en)
testi.json            # Data testimoni (termasuk field *_en)
themes-data.js        # Definisi 23 tema
themes-gallery.js     # Render & logic gallery tema
themes-gallery.css    # Styling kartu tema
themes-all.css        # Semua CSS var per tema (termasuk event)
testi-server.py       # Backend testimoni (Python stdlib)
```

## 🚀 Cara Menjalankan Lokal

1. **Clone repo**
   ```bash
   git clone https://github.com/Nug12/landing-page-coffee.git
   cd landing-page-coffee
   ```
2. **Serve statis** (butuh backend testimoni agar kartu muncul)
   ```bash
   # Static files
   python3 -m http.server 8080
   # Backend testimoni (terpisah)
   python3 testi-server.py
   ```
3. Buka `http://localhost:8080`.

> Untuk produksi, arahkan Caddy ke folder ini dan proxy `/api/*` ke
> `testi-server.py` (lihat `Caddyfile`).

## 🌐 Deployment (VPS)

- Web root: `/var/www/html` (milik `caddy:caddy`)
- Setiap edit → `sudo cp` dari `/home/ubuntu`, lalu bump `?v=N` di tag `<script>`/`<link>`
  untuk menghindari cache browser.
- Cloudflare: Cache Rule = DYNAMIC (no‑store) agar perubahan langsung terlihat.
- Backup harian via cron + rclone ke Google Drive.

## 🔧 Konfigurasi Bilingual

Tambahkan atribut pada elemen statis:
```html
<h2 data-text-id="Cerita Pengguna" data-text-en="User Stories">Cerita Pengguna</h2>
```
Untuk input/placeholder:
```html
<input id="tName" data-placeholder-id="Nama" data-placeholder-en="Name">
```
Untuk data dinamis (testimoni), sediakan field `quote_en`, `name_en`, `role_en` di JSON.

Dibuat dengan ☕ & ❤️ oleh Nug12 Dev
