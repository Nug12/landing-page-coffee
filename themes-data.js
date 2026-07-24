// Data 23 tema untuk gallery
// icon = FontAwesome FREE solid class (pasti ada di kit free 6.x)
const THEMES = [
  // 10 Coffee (dark pekat)
  {slug:"cinnamon-latte", name:"Cinnamon Latte", icon:"fa-mug-saucer", group:"coffee", desc:"Kayu manis hangat", tag:"Hangatnya bikin lupa deadline.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  {slug:"mocha-night", name:"Mocha Night", icon:"fa-mug-hot", group:"coffee", desc:"Mocha pekat, kontras tinggi", tag:"Buat yang begadah tapi stylish.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  {slug:"caramel-macchiato", name:"Caramel Macchiato", icon:"fa-cookie", group:"coffee", desc:"Karamel manis, cerah", tag:"Manisnya pas, nggak bikin enek.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  {slug:"sunset-ember", name:"Sunset Ember", icon:"fa-fire", group:"coffee", desc:"Bara senja menyala", tag:"Api semangat di ujung jari.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  {slug:"hazelnut-cream", name:"Hazelnut Cream", icon:"fa-seedling", group:"coffee", desc:"Krim hazelnut kalem", tag:"Kalem tapi ngena, kayak mantan baik.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  {slug:"espresso-shot", name:"Espresso Shot", icon:"fa-bolt", group:"coffee", desc:"Espresso bold, berani", tag:"Satu shot, langsung ngegas.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  {slug:"vanilla-bean", name:"Vanilla Bean", icon:"fa-leaf", group:"coffee", desc:"Vanilla creamy fresh", tag:"Clean girl aesthetic, buat kode.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  {slug:"chocolate-truffle", name:"Chocolate Truffle", icon:"fa-gem", group:"coffee", desc:"Cokelat truffle mewah", tag:"Mewah tapi nggak bikin miskin.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  {slug:"pumpkin-spice", name:"Pumpkin Spice", icon:"svg-pumpkin", group:"coffee", desc:"Labu rempah earthy", tag:"Vibes autumn, minus daun gugur.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  {slug:"midnight-roast", name:"Midnight Roast", icon:"fa-star", group:"coffee", desc:"Sangrai tengah malam", tag:"Jam 2 pagi? Tetap kece.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  // 10 Soft Dark (dark terang)
  {slug:"sunset-breeze", name:"Sunset Breeze", icon:"fa-sun", group:"soft", desc:"Senja orange lembut", tag:"Ademnya nyeruput senja.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  {slug:"ocean-mist", name:"Ocean Mist", icon:"fa-water", group:"soft", desc:"Laut tenang biru", tag:"Tenang kayak laut, bukan deadline.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  {slug:"forest-dew", name:"Forest Dew", icon:"fa-tree", group:"soft", desc:"Hutan hijau segar", tag:"Segarnya kayak pagi di hutan.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  {slug:"lavender-dream", name:"Lavender Dream", icon:"fa-spa", group:"soft", desc:"Lavender ungu dreamy", tag:"Mimpi manis, tanpa ngorbanin kontras.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  {slug:"peachy-sunset", name:"Peachy Sunset", icon:"fa-apple-whole", group:"soft", desc:"Persik hangat", tag:"Manisnya nggak palsu.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  {slug:"cherry-blossom", name:"Cherry Blossom", icon:"fa-fan", group:"soft", desc:"Sakura pink", tag:"Romantis, tapi buat IDE.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  {slug:"mint-fresh", name:"Mint Fresh", icon:"fa-feather", group:"soft", desc:"Mint menyegarkan", tag:"Napas kode jadi segar.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  {slug:"golden-hour", name:"Golden Hour", icon:"fa-crown", group:"soft", desc:"Emas senja", tag:"Waktunya bersinar, bro.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  {slug:"sky-blue", name:"Sky Blue", icon:"fa-cloud", group:"soft", desc:"Langit biru cerah", tag:"Langit biru, hati tenang.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  {slug:"rose-gold", name:"Rose Gold", icon:"fa-heart", group:"soft", desc:"Mawar emas lembut", tag:"Elegant, nggak norak.", vars:["--caramel","--sunset","--espresso","--card","--cream","--border"]},
  // === TEMA EVENT ===
  {slug:"golden-eid", name:"Golden Eid", icon:"fa-diamond", group:"event", desc:"Emas hari raya", tagline_id:"Berkah & kehangatan", tagline_en:"Blessings & warmth", accent:"#2E8B57", vars:["--lebaran-1","--lebaran-2","--lebaran-3","--lebaran-4","--lebaran-5","--lebaran-6"]},
  {slug:"snowy-christmas", name:"Snowy Christmas", icon:"fa-snowflake", group:"event", desc:"Salju merah putih", tagline_id:"Dingin luar, hangat dalam", tagline_en:"Cold outside, warm inside", accent:"#4FA8E0", vars:["--natal-1","--natal-2","--natal-3","--natal-4","--natal-5","--natal-6"]},
  {slug:"independence-day", name:"Independence Day", icon:"fa-flag", group:"event", desc:"Merah putih bersemi", tagline_id:"Merah putih bersemi", tagline_en:"Red & white blooming", accent:"#E60012", vars:["--kemerdekaan-1","--kemerdekaan-2","--kemerdekaan-3","--kemerdekaan-4","--kemerdekaan-5","--kemerdekaan-6"]},
];

// Konfigurasi grup (extensible)
const GROUPS = [
  {key:"coffee", label:"10 Tema Coffee (Dark Pekat)", sub:"Nuansa kopi klasik, mode gelap tetap dalam — tenang di mata, berani di warna.", icon:"fa-mug-hot", accent:"var(--caramel)"},
  {key:"soft",   label:"10 Tema Soft Dark (Dark Lebih Terang)", sub:"Mode gelap lebih terang & nyaman di mata untuk kerja malam panjang.", icon:"fa-cloud-sun", accent:"var(--sunset)"},
  {key:"event",  label:"Tema Event Khusus", sub:"Koleksi tema musim & perayaan — pas buat moment spesial, ubah suasana sekali klik.", icon:"fa-calendar-star", accent:"var(--sunset-2)"}
];
