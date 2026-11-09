/* Template MUA — logika halaman. Tidak perlu diubah per klien; ubah data.js saja. */
(function () {
  "use strict";
  var S = window.SITE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var el = function (tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DEMO_KEY = "mua_demo_tanggal_penuh";

  /* ---------- fitur sesuai paket (fitur.js + `fitur` di data.js) ---------- */
  var SEMUA = { look: true, aksesori: true, kuis: true, persiapan: true, kalender: true, kuota: true, statistik: true, penawaran: true, paket: "premium" };
  var FITUR = window.MUA_FITUR ? window.MUA_FITUR.baca(S) : SEMUA;
  var B0 = S.booking || (S.booking = {});
  if (!FITUR.kalender) B0.cekTanggal = false;
  if (!FITUR.kuota) B0.kuotaPerHari = 1;
  if (!FITUR.statistik) S.statistik = false;
  if (!FITUR.kuis && S.kuis) S.kuis.aktif = false;
  if (!FITUR.persiapan) { if (S.jadwal) S.jadwal.aktif = false; S.checklist = []; }
  function ada(x) { return Array.isArray(x) && x.length > 0; }
  function slug(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function rupiah(n) { return "Rp " + Number(n).toLocaleString("id-ID"); }
  function get(path) { return path.split(".").reduce(function (o, k) { return o ? o[k] : ""; }, S); }
  function waLink(pesan) { return "https://wa.me/" + S.brand.whatsapp + (pesan ? "?text=" + encodeURIComponent(pesan) : ""); }
  function bukaLink(url, lacak) { var a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener"; if (lacak) a.dataset.track = lacak; document.body.appendChild(a); a.click(); a.remove(); }

  /* ---------- statistik anonim: kunjungan & klik WhatsApp (angka hanya terlihat di admin.html) ----------
     Tidak memakai cookie, tidak menyimpan IP / nama / nomor. Hanya kode acak per browser untuk menghitung pengunjung unik.
     Dimatikan dengan `statistik: false` di data.js. Tanpa Supabase = tersimpan di browser ini (mode demo). */
  /* Header Supabase: key baru (sb_publishable_...) hanya lewat apikey; key lama (JWT, eyJ...) juga dikirim sebagai Bearer. */
  function sbHeader(extra) {
    var k = (S.booking || {}).supabaseAnonKey || "", h = { apikey: k };
    if (/^eyJ/.test(k)) h.Authorization = "Bearer " + k;
    for (var x in extra) h[x] = extra[x];
    return h;
  }
  var EV_KEY = "mua_demo_events";
  var track = (function () {
    var B = S.booking || {}, live = !!(B.supabaseUrl && B.supabaseAnonKey);
    var vid = store("mua_vid");
    if (!vid) { vid = Math.random().toString(36).slice(2, 12) + Date.now().toString(36); store("mua_vid", vid); }
    function catat(jenis, label) {
      if (S.statistik === false || navigator.webdriver || store("mua_abaikan") === "1") return;
      label = label ? String(label).slice(0, 80) : null;
      if (live) {
        try {
          fetch(B.supabaseUrl.replace(/\/$/, "") + "/rest/v1/events", {
            method: "POST", keepalive: true,
            headers: sbHeader({ "Content-Type": "application/json", Prefer: "return=minimal" }),
            body: JSON.stringify({ jenis: jenis, label: label, visitor: vid })
          }).catch(function () {});
        } catch (e) {}
      } else {
        var arr = []; try { arr = JSON.parse(store(EV_KEY) || "[]"); } catch (e) {}
        arr.push({ t: Date.now(), jenis: jenis, label: label, visitor: vid });
        store(EV_KEY, JSON.stringify(arr.slice(-2000)));
      }
    }
    var baru = true; try { baru = !sessionStorage.getItem("mua_sesi"); sessionStorage.setItem("mua_sesi", "1"); } catch (e) {}
    if (baru) catat("kunjungan");
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[data-track]"); if (!a) return;
      var t = a.dataset.track.split("|"); catat(t[0], t[1]);
    }, true);
    return catat;
  })();

  /* ---------- tema & teks umum ---------- */
  function setTema(t) { document.documentElement.setAttribute("data-tema", t); }
  setTema(store("mua_demo_tema") && S.modeDemo ? store("mua_demo_tema") : S.tema);
  document.title = S.brand.nama + " " + S.brand.sub + " — Rias Pengantin " + S.brand.kota;
  document.querySelectorAll("[data-bind]").forEach(function (n) { n.textContent = get(n.getAttribute("data-bind")); });

  var sapa = "Halo " + S.brand.nama + ", saya mau tanya jasa rias pengantin.";
  var sumberWA = { "wa-top": "WA · header", "wa-foot": "WA · footer", "wa-float": "WA · tombol melayang", "wa-bar": "WA · bar bawah (HP)" };
  Object.keys(sumberWA).forEach(function (id) { var a = $("#" + id); if (a) { a.href = waLink(sapa); a.dataset.track = "klik_wa|" + sumberWA[id]; } });

  /* bar CTA di HP: sembunyi saat hero (tombolnya sudah terlihat) dan saat di bagian booking */
  (function () {
    var bar = $("#cta-bar"); if (!bar || !("IntersectionObserver" in window)) return;
    var lihat = { hero: true, booking: false };
    function upd() { bar.classList.toggle("sembunyi", lihat.hero || lihat.booking); }
    function amati(node, key) {
      new IntersectionObserver(function (en) { lihat[key] = en[0].isIntersecting; upd(); }, { threshold: 0.1 }).observe(node);
    }
    amati($(".hero-aksi"), "hero");
    amati($("#booking"), "booking");
    upd();
  })();
  $("#wa-nomor").textContent = "+" + S.brand.whatsapp.replace(/^(\d{2})(\d{3})(\d{4})(\d+)$/, "$1 $2-$3-$4");
  $("#ig-foot").href = "https://instagram.com/" + S.brand.instagram;
  /* Google Maps: pakai brand.peta kalau diisi, kalau kosong cari otomatis dari alamat */
  $("#maps-foot").href = S.brand.peta ||
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(S.brand.alamat + ", " + S.brand.kota);

  /* ---------- hero sebelum / sesudah ---------- */
  (function () {
    var ba = $("#ba"), range = $("#ba-range");
    $("#ba-sebelum").src = S.hero.sebelum;
    $("#ba-sesudah").src = S.hero.sesudah;
    var anim = null;
    function set(p) {
      p = Math.max(0, Math.min(100, p));
      ba.style.setProperty("--pos", p + "%");
      range.value = Math.round(p);
      ba.querySelector(".ba-label-kiri").style.opacity = p < 14 ? 0 : 1;
      ba.querySelector(".ba-label-kanan").style.opacity = p > 86 ? 0 : 1;
    }
    function fromEvent(e) { var r = ba.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 100); }
    var drag = false;
    ba.addEventListener("pointerdown", function (e) { drag = true; cancelAnimationFrame(anim); fromEvent(e); try { ba.setPointerCapture(e.pointerId); } catch (_) {} });
    ba.addEventListener("pointermove", function (e) {
      if (drag) fromEvent(e);
      else if (e.pointerType === "mouse" && matchMedia("(hover: hover)").matches) { cancelAnimationFrame(anim); fromEvent(e); }
    });
    ["pointerup", "pointercancel"].forEach(function (t) { ba.addEventListener(t, function () { drag = false; }); });
    range.addEventListener("input", function () { set(+range.value); });
    ba.addEventListener("click", function () { range.focus({ preventScroll: true }); });

    // petunjuk gerak sekali saat dimuat
    if (!reduce) {
      var t0 = null, frames = [[0, 50], [700, 50], [1500, 22], [2500, 78], [3300, 50]];
      var step = function (ts) {
        if (t0 === null) t0 = ts;
        var t = ts - t0, i = 0;
        while (i < frames.length - 1 && t > frames[i + 1][0]) i++;
        if (i >= frames.length - 1) { set(50); return; }
        var a = frames[i], b = frames[i + 1], k = (t - a[0]) / (b[0] - a[0]);
        k = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        set(a[1] + (b[1] - a[1]) * k);
        anim = requestAnimationFrame(step);
      };
      setTimeout(function () { anim = requestAnimationFrame(step); }, 400);
    }
  })();

  /* ---------- tentang ---------- */
  var T0 = S.tentang || {};
  if (!ada(T0.paragraf) && !ada(T0.keahlian)) $("#tentang").hidden = true;
  (T0.paragraf || []).forEach(function (p) { $("#tentang-teks").appendChild(el("p", null, p)); });
  (T0.keahlian || []).forEach(function (k) { $("#keahlian").appendChild(el("li", null, k)); });
  if (!ada(T0.keahlian)) $("#keahlian").hidden = true;

  /* ---------- paket ---------- */
  if (!ada(S.paket)) $("#paket").hidden = true;
  (S.paket || []).forEach(function (p) {
    var row = el("div", "paket-row");
    var kiri = el("div"); kiri.appendChild(el("h3", "paket-nama", p.nama));
    if (p.catatan) kiri.appendChild(el("p", "paket-catatan", p.catatan));
    var ul = el("ul", "paket-isi"); (p.isi || []).forEach(function (i) { ul.appendChild(el("li", null, i)); });
    var h = el("p", "paket-harga"); h.appendChild(el("small", null, "mulai")); h.appendChild(el("strong", null, rupiah(p.harga)));
    row.append(kiri, ul, h); $("#paket-list").appendChild(row);
    var o = el("option", null, p.nama); o.value = p.nama; $("#f-paket").appendChild(o);
  });
  var oLain = el("option", null, "Belum tahu / konsultasi"); oLain.value = "Konsultasi"; $("#f-paket").appendChild(oLain);

  /* ---------- look: barisan pengantin ---------- */
  if (!FITUR.look || !ada(S.looks)) $("#koleksi").hidden = true;
  var look = $("#koleksi").hidden ? { go: function () {} } : (function () {
    var L = S.looks || [], n = L.length, active = 0, fokus = false, lastK = [];
    var stage = $("#look-stage"), track = $("#look-track"), side = $("#look-side-isi");
    var KOL = S.koleksi || [];
    var cariBusana = function (nama) { for (var i = 0; i < KOL.length; i++) if (KOL[i].nama === nama) return i; return -1; };
    var cariAks = function (nama) { return FITUR.aksesori ? (S.aksesori || []).filter(function (a) { return a.nama === nama; })[0] : null; };
    var pad = function (x) { return String(x).padStart(2, "0"); };

    var nodes = L.map(function (l, i) {
      var b = el("button", "look-model"); b.type = "button";
      var img = el("img"); img.dataset.src = l.foto; img.alt = ""; img.decoding = "async";
      /* busana lebar (gaun) memakai kanvas lebih lebar; bungkus mengikuti rasio foto */
      img.addEventListener("load", function () { if (img.naturalWidth && img.naturalHeight) b.style.aspectRatio = img.naturalWidth + " / " + img.naturalHeight; });
      b.appendChild(img);
      b.setAttribute("aria-label", "Look " + pad(i + 1) + ": " + l.nama);
      b.addEventListener("click", function () {
        if (geser.moved) return;
        if (i === active) setFokus(!fokus); else { setFokus(false); go(i); }
        jedaAuto();
      });
      track.appendChild(b); lastK.push(0);
      return b;
    });

    function offset(i) { var k = ((i - active) % n + n) % n; if (k > n / 2) k -= n; return k; }

    function position() {
      var W = stage.clientWidth, wide = window.innerWidth >= 960;
      var gap = wide ? Math.max(150, W * .17) : W * .36;
      nodes.forEach(function (b, i) {
        var k = offset(i), a = Math.abs(k);
        var s = k === 0 ? (fokus ? (wide ? 1.12 : 1.06) : 1) : Math.max(.7, .86 - (a - 1) * .06);
        var x = k * gap - (k === 0 ? 0 : Math.sign(k) * gap * .08 * (a - 1));
        b.classList.toggle("lompat", Math.abs(k - lastK[i]) > 1);
        lastK[i] = k;
        b.style.transform = "translateX(-50%) translateX(" + x + "px) scale(" + s + ")";
        b.style.filter = a === 0 ? "none" : "blur(" + Math.min(a * 2.2, 6) + "px)";
        b.style.opacity = a > 3 ? 0 : (a === 0 ? 1 : 1 - a * .22);
        b.style.zIndex = 20 - a;
        b.dataset.k = k;
        b.tabIndex = a <= 1 ? 0 : -1;
        b.style.pointerEvents = a > 3 ? "none" : "";
      });
      $("#look-hitung").textContent = pad(active + 1) + " / " + pad(n);
    }

    function isiSamping() {
      var l = L[active];
      side.classList.remove("ganti"); void side.offsetWidth; side.classList.add("ganti");
      $("#ls-kat").textContent = "Look " + pad(active + 1) + "  ·  " + l.kategori;
      $("#ls-nama").textContent = l.nama;
      $("#ls-ringkas").textContent = l.ringkas || "";
      var ul = $("#ls-items"); ul.textContent = "";
      (l.isi || []).forEach(function (it) {
        var bi = it.busana ? cariBusana(it.busana) : -1, bus = bi >= 0 ? KOL[bi] : null;
        var aks = it.aksesori ? cariAks(it.aksesori) : null;
        var nama = it.nama || (bus && bus.nama) || (aks && aks.nama) || it.busana || it.aksesori;
        var foto = it.gambar || (bus && bus.gambar) || (aks && aks.gambar);
        var li = el("li"), row = el(bus ? "button" : "div", "look-item");
        if (bus) { row.type = "button"; row.addEventListener("click", function () { panel.buka(bus, bi, KOL.length); }); }
        var f = el("span", "look-item-foto");
        if (foto) { var im = el("img"); im.src = foto; im.alt = ""; im.loading = "lazy"; if (bus || aks) im.className = "contain"; f.appendChild(im); }
        else f.appendChild(el("span", null, it.jenis.charAt(0)));
        var t = el("span"); t.append(el("small", null, it.jenis), el("span", "look-item-nama", nama));
        row.append(f, t);
        if (bus) row.appendChild(el("span", "look-item-panah", "›"));
        li.appendChild(row); ul.appendChild(li);
      });
      var vb = $("#ls-video"); vb.hidden = !l.video;
      vb.onclick = l.video ? function () { bukaVideo(l, vb); } : null;
      var h = $("#ls-harga"); h.textContent = "";
      if (l.harga) { h.append(el("small", null, "Paket mulai"), document.createTextNode(rupiah(l.harga))); }
      $("#ls-wa").href = waLink("Halo " + S.brand.nama + ", saya tertarik dengan look \"" + l.nama + "\" (Look " + pad(active + 1) + "). Boleh info paket dan ketersediaan tanggalnya?");
      $("#ls-wa").dataset.track = "klik_wa|Look · " + l.nama;
      $("#lf-nomor").textContent = "Look " + pad(active + 1);
      $("#lf-nama").textContent = l.nama;
    }

    /* video gerak look (opsional: look.video + look.videoPoster). Baru diunduh saat tombol diklik. */
    function bukaVideo(l, pemicu) {
      var o = el("div", "vid-modal"); o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "Video look " + l.nama);
      var v = el("video"); v.src = l.video; if (l.videoPoster) v.poster = l.videoPoster;
      v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true; v.controls = true; v.setAttribute("playsinline", ""); v.setAttribute("aria-label", "Video " + l.nama);
      var x = el("button", "vid-tutup", "×"); x.type = "button"; x.setAttribute("aria-label", "Tutup video");
      var cap = el("p", "vid-cap", l.nama + " · model dibuat dengan AI");
      function tutup() { document.removeEventListener("keydown", tombol); o.remove(); document.body.classList.remove("vid-buka"); try { pemicu.focus(); } catch (e) {} }
      function tombol(e) { if (e.key === "Escape") tutup(); else if (e.key === "Tab") { e.preventDefault(); x.focus(); } }
      x.addEventListener("click", tutup);
      o.addEventListener("click", function (e) { if (e.target === o) tutup(); });
      var kotak = el("div", "vid-kotak"); kotak.append(v, x, cap); o.appendChild(kotak);
      document.body.appendChild(o); document.body.classList.add("vid-buka"); document.addEventListener("keydown", tombol); x.focus();
      var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
    }

    function go(i) { active = ((i % n) + n) % n; position(); isiSamping(); }
    function setFokus(v) { fokus = v; stage.classList.toggle("fokus", v); $("#look-fokus").hidden = !v; position(); }

    $("#look-prev").addEventListener("click", function () { setFokus(false); go(active - 1); jedaAuto(); });
    $("#look-next").addEventListener("click", function () { setFokus(false); go(active + 1); jedaAuto(); });
    $("#lf-tutup").addEventListener("click", function () { setFokus(false); });
    stage.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); setFokus(false); go(active + 1); jedaAuto(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); setFokus(false); go(active - 1); jedaAuto(); }
      if (e.key === "Escape" && fokus) setFokus(false);
    });

    // geser (swipe / drag)
    var geser = { x: 0, on: false, moved: false };
    stage.addEventListener("pointerdown", function (e) { geser.on = true; geser.moved = false; geser.x = e.clientX; });
    stage.addEventListener("pointermove", function (e) {
      if (!geser.on) return;
      var dx = e.clientX - geser.x;
      if (Math.abs(dx) > 50) { geser.moved = true; geser.x = e.clientX; setFokus(false); go(active + (dx < 0 ? 1 : -1)); jedaAuto(); }
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (t) {
      stage.addEventListener(t, function () { geser.on = false; setTimeout(function () { geser.moved = false; }, 0); });
    });
    stage.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 30) {
        e.preventDefault(); if (geser.wheel) return; geser.wheel = true; setTimeout(function () { geser.wheel = false; }, 450);
        setFokus(false); go(active + (e.deltaX > 0 ? 1 : -1)); jedaAuto();
      }
    }, { passive: false });

    // jalan otomatis pelan saat terlihat, berhenti saat disentuh
    var auto = null, jeda = 0, terlihat = false, hover = false;
    var berhenti = reduce;
    function jedaAuto() { jeda = Date.now() + 9000; }
    var tJeda = $("#look-jeda");
    function setBerhenti(v) {
      berhenti = v; tJeda.setAttribute("aria-pressed", v ? "true" : "false");
      tJeda.setAttribute("aria-label", v ? "Putar pergantian otomatis" : "Jeda pergantian otomatis");
    }
    tJeda.addEventListener("click", function () { setBerhenti(!berhenti); });
    setBerhenti(berhenti);
    if (n < 2) tJeda.hidden = true;
    if (n > 1) {
      auto = setInterval(function () { if (!berhenti && terlihat && !hover && !fokus && Date.now() > jeda && panelTutup()) go(active + 1); }, 3600);
      stage.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") hover = true; });
      stage.addEventListener("pointerleave", function () { hover = false; });
      stage.addEventListener("focusin", function () { hover = true; });
      stage.addEventListener("focusout", function () { hover = false; });
      if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { terlihat = en[0].isIntersecting; }, { threshold: .4 }).observe(stage);
    }
    function panelTutup() { return $("#panel").hidden; }

    /* foto look baru dimuat saat pengunjung mendekati bagian koleksi (hemat kuota di awal) */
    function muatFoto() { $("#look-track").querySelectorAll("img[data-src]").forEach(function (im) { im.src = im.dataset.src; im.removeAttribute("data-src"); }); }
    if ("IntersectionObserver" in window) {
      var ioFoto = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { muatFoto(); ioFoto.disconnect(); } }, { rootMargin: "800px 0px" });
      ioFoto.observe($("#koleksi"));
    } else muatFoto();

    window.addEventListener("resize", position);
    if (n) { go(0); }

    /* link per look: #look-3 (nomor urut) atau #look-akad-solo-putri (nama) */
    function dariHash() {
      var m = location.hash.match(/^#look-(.+)$/); if (!m || !n) return;
      var k = decodeURIComponent(m[1]), i = /^\d+$/.test(k) ? Number(k) - 1 : L.map(function (l) { return slug(l.nama); }).indexOf(k);
      if (i < 0 || i >= n) return;
      setFokus(false); go(i); jeda = Date.now() + 60000;
      $("#koleksi").scrollIntoView({ behavior: "auto", block: "start" });
    }
    window.addEventListener("hashchange", dariHash);
    dariHash();

    var tBagi = $("#ls-bagikan");
    tBagi.addEventListener("click", function () {
      var l = L[active], url = location.href.split("#")[0] + "#look-" + slug(l.nama);
      var asli = "Bagikan link look ini", beri = function (t) { tBagi.textContent = t; setTimeout(function () { tBagi.textContent = asli; }, 2200); };
      if (navigator.share) { navigator.share({ title: l.nama + " · " + S.brand.nama, text: l.ringkas || l.nama, url: url }).catch(function () {}); return; }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () { beri("Link tersalin ✓"); }, function () { beri(url); });
      else beri(url);
    });
    return { go: go };
  })();

  /* ---------- panel detail ---------- */
  var panel = (function () {
    var p = $("#panel"), latar = $("#panel-latar"), foto = $("#p-foto"), cur = null, lastFocus = null;
    function tampil(jenis) {
      p.querySelectorAll(".tab button").forEach(function (b) { b.setAttribute("aria-selected", b.dataset.foto === jenis ? "true" : "false"); });
      foto.src = cur[jenis] || cur.gambar; foto.alt = cur.nama + " — " + jenis;
    }
    p.querySelectorAll(".tab button").forEach(function (b) { b.addEventListener("click", function () { tampil(b.dataset.foto); }); });
    function tutup() { p.hidden = true; latar.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus({ preventScroll: true }); }
    $("#panel-tutup").addEventListener("click", tutup);
    latar.addEventListener("click", tutup);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !p.hidden) tutup(); });
    return {
      buka: function (k, i, n) {
        cur = k; lastFocus = document.activeElement;
        $("#p-nomor").textContent = String(i + 1).padStart(2, "0") + " / " + String(n).padStart(2, "0") + "   " + k.kategori;
        $("#p-nama").textContent = k.nama;
        $("#p-desk").textContent = k.deskripsi;
        $("#p-warna").textContent = k.warna;
        $("#p-ukuran").textContent = k.ukuran;
        $("#p-harga").textContent = k.hargaSewa ? rupiah(k.hargaSewa) : "Termasuk paket";
        $("#p-wa").href = waLink("Halo " + S.brand.nama + ", saya tertarik dengan busana \"" + k.nama + "\" (" + k.kategori + "). Apakah tersedia untuk tanggal ...?");
        $("#p-wa").dataset.track = "klik_wa|Busana · " + k.nama;
        tampil("dipakai");
        p.hidden = false; latar.hidden = false; document.body.style.overflow = "hidden";
        $("#panel-tutup").focus({ preventScroll: true });
      }
    };
  })();

  /* ---------- aksesori, galeri, testimoni, faq ---------- */
  if (!FITUR.aksesori || !ada(S.aksesori)) $("#aksesori").hidden = true;
  if (!$("#aksesori").hidden) S.aksesori.forEach(function (a) {
    var f = el("figure"), box = el("div", "aks-foto"), img = el("img"); img.src = a.gambar; img.alt = a.nama; img.loading = "lazy";
    box.appendChild(img);
    var c = el("figcaption"); c.append(el("strong", null, a.nama), el("span", null, a.ket));
    f.append(box, c); $("#aks-list").appendChild(f);
  });
  if (!ada(S.galeri)) { $("#galeri").hidden = true; S.galeri = []; }

  /* ---------- lightbox foto: panah / swipe / Esc, fokus terkunci. Dipakai galeri dan testimoni ---------- */
  var lightbox = (function () {
    var box = el("div", "lb"), gbr = el("img", "lb-img"), cap = el("p", "lb-cap"), hit = el("p", "lb-hitung");
    var bt = el("button", "lb-btn lb-tutup", "✕"), pv = el("button", "lb-btn lb-prev", "‹"), nx = el("button", "lb-btn lb-next", "›");
    bt.type = pv.type = nx.type = "button";
    bt.setAttribute("aria-label", "Tutup"); pv.setAttribute("aria-label", "Foto sebelumnya"); nx.setAttribute("aria-label", "Foto berikutnya");
    gbr.alt = "";
    box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "Galeri foto"); box.hidden = true;
    var fig = el("div", "lb-fig"); fig.append(gbr, cap, hit);
    box.append(fig, bt, pv, nx); document.body.appendChild(box);
    var daftar = [], i = 0, asal = null, x0 = null;
    function tampil(k) {
      var n = daftar.length; i = (k + n) % n; var g = daftar[i];
      gbr.src = g.gambar; gbr.alt = g.ket; cap.textContent = g.ket; hit.textContent = (i + 1) + " / " + n;
      pv.hidden = nx.hidden = n < 2;
      [1, -1].forEach(function (d) { new Image().src = daftar[(i + d + n) % n].gambar; });
    }
    function tutup() { box.hidden = true; document.body.classList.remove("lb-buka"); if (asal) asal.focus(); }
    bt.addEventListener("click", tutup);
    pv.addEventListener("click", function () { tampil(i - 1); });
    nx.addEventListener("click", function () { tampil(i + 1); });
    box.addEventListener("click", function (e) { if (e.target === box || e.target === fig) tutup(); });
    box.addEventListener("pointerdown", function (e) { x0 = e.clientX; });
    box.addEventListener("pointerup", function (e) {
      if (x0 === null) return; var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 50 && daftar.length > 1) tampil(i + (dx < 0 ? 1 : -1));
    });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") tutup();
      else if (e.key === "ArrowRight" && daftar.length > 1) tampil(i + 1);
      else if (e.key === "ArrowLeft" && daftar.length > 1) tampil(i - 1);
      else if (e.key === "Tab") {
        var u = [bt, pv, nx].filter(function (x) { return !x.hidden; }), k = u.indexOf(document.activeElement);
        e.preventDefault(); u[(k + (e.shiftKey ? -1 : 1) + u.length) % u.length].focus();
      }
    });
    return { buka: function (list, k, dari) { daftar = list; asal = dari; tampil(k); box.hidden = false; document.body.classList.add("lb-buka"); bt.focus(); } };
  })();

  /* ---------- galeri + filter kategori (otomatis muncul kalau ada 2 kategori atau lebih) ---------- */
  var galAktif = "", galKat = [];
  S.galeri.forEach(function (g) { if (g.kat && galKat.indexOf(g.kat) < 0) galKat.push(g.kat); });
  function gambarGaleri() {
    var tampilan = S.galeri.filter(function (g) { return !galAktif || g.kat === galAktif; }), wadah = $("#galeri-list");
    wadah.textContent = "";
    tampilan.forEach(function (g, k) {
      var f = el("figure"), img = el("img"), tb = el("button", "galeri-btn"); img.src = g.gambar; img.alt = ""; img.loading = "lazy";
      tb.type = "button"; tb.setAttribute("aria-label", "Perbesar foto: " + g.ket); tb.appendChild(img);
      tb.addEventListener("click", function () { lightbox.buka(tampilan, k, tb); });
      f.append(tb, el("figcaption", null, g.ket)); wadah.appendChild(f);
    });
  }
  if (galKat.length >= 2 && S.galeriFilter !== false) {
    var fb = $("#galeri-filter"), chips = [];
    ["Semua"].concat(galKat).forEach(function (nama, k) {
      var c = el("button", "chip", nama); c.type = "button"; c.setAttribute("aria-pressed", k === 0 ? "true" : "false");
      c.addEventListener("click", function () {
        galAktif = k === 0 ? "" : nama;
        chips.forEach(function (x, j) { x.setAttribute("aria-pressed", j === k ? "true" : "false"); });
        gambarGaleri();
      });
      chips.push(c); fb.appendChild(c);
    });
    fb.hidden = false;
  }
  gambarGaleri();

  /* ---------- testimoni: kutipan teks dan/atau tangkapan layar chat (WhatsApp, Instagram, Google) ---------- */
  var tTeks = (S.testimoni || []).filter(function (t) { return t.isi; }), tFoto = (S.testimoni || []).filter(function (t) { return t.gambar; });
  if (!tTeks.length && !tFoto.length) $(".testi-blok").hidden = true;
  if (!tTeks.length) $("#testi-list").hidden = true;
  tTeks.forEach(function (t) {
    var q = el("blockquote"); q.append(el("p", null, "“" + t.isi + "”"), el("cite", null, t.nama)); $("#testi-list").appendChild(q);
  });
  if (tFoto.length) {
    var SUMBER = { whatsapp: "Chat WhatsApp", instagram: "Pesan Instagram", google: "Ulasan Google" };
    var dShot = tFoto.map(function (t) {
      var s0 = t.sumber ? (SUMBER[String(t.sumber).toLowerCase()] || t.sumber) : "Testimoni";
      return { gambar: t.gambar, ket: s0 + (t.nama ? " · " + t.nama : "") };
    });
    $("#testi-shot-wrap").hidden = false;
    dShot.forEach(function (g, k) {
      var f = el("figure"), tb = el("button", "galeri-btn"), img = el("img");
      img.src = g.gambar; img.alt = "Tangkapan layar testimoni: " + g.ket; img.loading = "lazy";
      tb.type = "button"; tb.setAttribute("aria-label", "Perbesar: " + g.ket); tb.appendChild(img);
      tb.addEventListener("click", function () { lightbox.buka(dShot, k, tb); });
      f.append(tb, el("figcaption", null, g.ket)); $("#testi-shot").appendChild(f);
    });
  }

  /* ---------- lencana bukti di hero (maks. 3): hero.bukti = [{ angka, label }] ---------- */
  var BK = (S.hero && S.hero.bukti) || [];
  if (ada(BK)) {
    BK.slice(0, 3).forEach(function (b) {
      var li = el("li"); li.append(el("strong", null, b.angka), el("span", null, b.label)); $("#hero-bukti").appendChild(li);
    });
    $("#hero-bukti").hidden = false;
  }
  if (!ada(S.faq)) $("#faq").hidden = true;
  (S.faq || []).forEach(function (f) {
    var d = el("details"), s = el("summary", null, f.t); d.append(s, el("p", null, f.j)); $("#faq-list").appendChild(d);
  });

  /* ---------- booking ---------- */
  var booking = (function () {
    var B = S.booking, penuh = new Map(), view = new Date(), dipilih = "";
    var KUOTA = Math.max(1, Number(B.kuotaPerHari) || 1);   /* berapa booking per hari; 1 = satu tanggal satu pengantin */
    view.setDate(1);
    var hariIni = new Date(); hariIni.setHours(0, 0, 0, 0);
    var BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    var HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    var inp = $("#f-tanggal"), info = $("#tanggal-info");

    function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
    function panjang(s) { var d = new Date(s + "T00:00:00"); return HARI[d.getDay()] + ", " + d.getDate() + " " + BULAN[d.getMonth()] + " " + d.getFullYear(); }
    inp.min = iso(hariIni);

    /* daftar tanggal ([...]) = penuh semua; objek ({"2026-11-14": 1}) = jumlah slot terisi */
    function peta(raw) {
      if (Array.isArray(raw)) return new Map(raw.map(function (d) { return [d, KUOTA]; }));
      return new Map(Object.keys(raw || {}).map(function (k) { return [k, Number(raw[k])]; }));
    }
    function terisi(s) { return penuh.get(s) || 0; }
    function sisa(s) { return Math.max(0, KUOTA - terisi(s)); }

    function muat() {
      if (B.supabaseUrl && B.supabaseAnonKey) {
        var ambil = function (kolom) {
          return fetch(B.supabaseUrl.replace(/\/$/, "") + "/rest/v1/tanggal_penuh?select=" + kolom + "&tanggal=gte." + iso(hariIni), {
            headers: sbHeader({})
          }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
        };
        /* database lama belum punya kolom `terisi` -> ambil tanggal saja (dianggap penuh) */
        return ambil("tanggal,terisi").catch(function () { return ambil("tanggal"); })
          .then(function (rows) { penuh = new Map(rows.map(function (r) { return [r.tanggal, r.terisi || KUOTA]; })); })
          .catch(function () { info.className = "field-info no"; info.textContent = "Data tanggal belum bisa dimuat. Tanya ketersediaan langsung lewat WhatsApp."; });
      }
      var lokal = null; try { lokal = JSON.parse(store(DEMO_KEY) || "null"); } catch (e) {}
      penuh = peta(lokal || B.tanggalPenuhDemo || []);
      return Promise.resolve();
    }

    function kalender() {
      var grid = $("#kal-grid"); grid.textContent = "";
      $("#kal-bulan").textContent = BULAN[view.getMonth()] + " " + view.getFullYear();
      var awal = (view.getDay() + 6) % 7, jml = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      for (var i = 0; i < awal; i++) grid.appendChild(el("span"));
      for (var d = 1; d <= jml; d++) {
        var tgl = new Date(view.getFullYear(), view.getMonth(), d), s = iso(tgl), b = el("button", null, d);
        b.type = "button"; b.dataset.tgl = s;
        var lewat = tgl < hariIni, isPenuh = terisi(s) >= KUOTA, sebagian = !isPenuh && terisi(s) > 0;
        if (isPenuh) b.classList.add("penuh");
        if (sebagian) b.classList.add("sebagian");
        if (+tgl === +hariIni) b.classList.add("hari-ini");
        b.disabled = lewat || isPenuh;
        b.setAttribute("aria-label", panjang(s) + (isPenuh ? ", sudah penuh" : lewat ? "" : sebagian ? ", tersisa " + sisa(s) + " slot" : ", kosong"));
        b.setAttribute("aria-pressed", s === dipilih ? "true" : "false");
        b.addEventListener("click", function () { pilih(this.dataset.tgl); });
        grid.appendChild(b);
      }
      var batas = new Date(hariIni.getFullYear(), hariIni.getMonth() + B.maksBulanKeDepan, 1);
      $("#kal-prev").disabled = view <= new Date(hariIni.getFullYear(), hariIni.getMonth(), 1);
      $("#kal-next").disabled = view >= batas;
    }

    function cek(s) {
      if (!s) { info.textContent = ""; return true; }
      if (!B.cekTanggal) { info.className = "field-info"; info.textContent = panjang(s); return true; }
      if (terisi(s) >= KUOTA) { info.className = "field-info no"; info.textContent = panjang(s) + " sudah penuh. Pilih tanggal lain atau tanyakan jadwal jam lain lewat WhatsApp."; return false; }
      info.className = "field-info ok";
      info.textContent = panjang(s) + (terisi(s) > 0 ? " masih tersedia, tinggal " + sisa(s) + " slot." : " masih kosong."); return true;
    }
    function pilih(s) {
      dipilih = s; inp.value = s; inp.removeAttribute("aria-invalid"); cek(s);
      var d = new Date(s + "T00:00:00");
      if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) { view = new Date(d.getFullYear(), d.getMonth(), 1); }
      kalender();
    }
    inp.addEventListener("change", function () { inp.removeAttribute("aria-invalid"); pilih(inp.value); });
    $("#f-nama").addEventListener("input", function () { this.removeAttribute("aria-invalid"); $("#nama-err").textContent = ""; });
    $("#kal-prev").addEventListener("click", function () { view.setMonth(view.getMonth() - 1); kalender(); });
    $("#kal-next").addEventListener("click", function () { view.setMonth(view.getMonth() + 1); kalender(); });

    function terapkanMode() {
      $("#kal").hidden = !B.cekTanggal;
      $("#legenda-sebagian").hidden = KUOTA < 2;
      $("#booking-sub").textContent = B.cekTanggal
        ? "Pilih tanggal acara di kalender. Tanggal yang dicoret sudah dipesan pengantin lain." + (KUOTA > 1 ? " Tanda titik berarti slot tinggal sedikit." : "")
        : "Isi data singkat di bawah. Kami akan membalas ketersediaan tanggal lewat WhatsApp.";
      cek(inp.value);
    }

    $("#form-booking").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target, err = $("#form-error");
      var data = { tanggal: f.tanggal.value, paket: f.paket.value, nama: f.nama.value.trim(), lokasi: f.lokasi.value.trim(), catatan: f.catatan.value.trim() };
      var namaErr = $("#nama-err"), ok = true, fokusKe = null;
      err.textContent = ""; namaErr.textContent = "";
      f.tanggal.removeAttribute("aria-invalid"); f.nama.removeAttribute("aria-invalid");
      if (!data.tanggal) { info.className = "field-info no"; info.textContent = "Pilih tanggal acara dulu."; f.tanggal.setAttribute("aria-invalid", "true"); ok = false; fokusKe = f.tanggal; }
      else if (!cek(data.tanggal)) { f.tanggal.setAttribute("aria-invalid", "true"); ok = false; fokusKe = f.tanggal; }
      if (!data.nama) { namaErr.textContent = "Tulis nama calon pengantin."; f.nama.setAttribute("aria-invalid", "true"); ok = false; fokusKe = fokusKe || f.nama; }
      if (!ok) { fokusKe.focus(); return; }
      var pesan = "Halo " + S.brand.nama + ", saya mau booking rias pengantin.\n\n" +
        "Nama: " + data.nama + "\n" +
        "Tanggal: " + panjang(data.tanggal) + "\n" +
        "Paket: " + data.paket + "\n" +
        (data.lokasi ? "Lokasi: " + data.lokasi + "\n" : "") +
        (data.catatan ? "Catatan: " + data.catatan + "\n" : "") +
        "\nApakah tanggal ini masih bisa?";
      bukaLink(waLink(pesan), "booking|Form booking");
    });

    muat().then(function () { kalender(); terapkanMode(); });
    kalender(); terapkanMode();
    return { setCek: function (v) { B.cekTanggal = v; terapkanMode(); } };
  })();

  var HARI_P = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"], BULAN_P = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  function tglPendek(d) { return HARI_P[d.getDay()] + ", " + d.getDate() + " " + BULAN_P[d.getMonth()]; }
  function tombol(teks, cls, fn) { var b = el("button", cls, teks); b.type = "button"; b.addEventListener("click", fn); return b; }

  /* ---------- kuis: look mana yang cocok ---------- */
  (function () {
    var K = S.kuis, P = K && K.pertanyaan;
    var calon = (S.looks || []).map(function (l, i) { return { l: l, i: i }; }).filter(function (x) { return x.l.tag && x.l.tag.length; });
    if (!K || K.aktif === false || !P || !P.length || calon.length < 2) return;
    $("#kuis").hidden = false;
    var box = $("#kuis-box"), jawab = [];
    $("#kuis-sub").textContent = "Jawab " + P.length + " pertanyaan singkat, kami pilihkan dari " + calon.length + " look kami. Kurang dari satu menit.";
    function punya(x, t) { return x.l.tag.indexOf(t) > -1; }
    function fokus(n) { n.tabIndex = -1; n.focus({ preventScroll: true }); }

    function awal() { box.textContent = ""; box.appendChild(tombol("Mulai kuis", "btn", function () { jawab = []; tanya(0); })); }
    function tanya(k) {
      box.textContent = "";
      var q = P[k], bar = el("div", "kuis-bar"), isi = el("i"); isi.style.width = (k / P.length * 100) + "%"; bar.appendChild(isi);
      bar.setAttribute("aria-hidden", "true");
      var h = el("h3", "kuis-tanya", q.t), list = el("div", "kuis-pilihan");
      list.setAttribute("role", "group"); list.setAttribute("aria-label", q.t);
      q.pilihan.forEach(function (p) {
        var b = tombol(p.teks, "kuis-opsi", function () { jawab[k] = p; if (k + 1 < P.length) tanya(k + 1); else hasil(0); });
        if (jawab[k] === p) b.setAttribute("aria-pressed", "true");
        list.appendChild(b);
      });
      box.append(bar, el("p", "kuis-langkah", "Pertanyaan " + (k + 1) + " dari " + P.length), h, list);
      if (k > 0) box.appendChild(tombol("‹ Pertanyaan sebelumnya", "link-kecil", function () { tanya(k - 1); }));
      fokus(h);
    }
    function urut() {
      var pool = calon.slice();
      jawab.forEach(function (p) {
        if (p.wajib && p.tag) { var f = pool.filter(function (x) { return punya(x, p.tag); }); if (f.length) pool = f; }
        if (p.kecuali) { var g = pool.filter(function (x) { return !punya(x, p.kecuali); }); if (g.length) pool = g; }
      });
      return pool.map(function (x) {
        var alasan = jawab.filter(function (p) { return p.tag && punya(x, p.tag); }).map(function (p) { return p.teks; });
        return { x: x, s: alasan.length, alasan: alasan };
      }).sort(function (a, b) { return b.s - a.s || a.x.i - b.x.i; });
    }
    function hasil(pilih) {
      var r = urut(), top = r[pilih] || r[0], l = top.x.l;
      box.textContent = "";
      var kartu = el("div", "kuis-hasil"), foto = el("div", "kuis-foto"), img = el("img"), tx = el("div", "kuis-teks");
      img.src = l.foto; img.alt = l.nama; foto.appendChild(img);
      var h = el("h3", null, l.nama);
      tx.append(el("p", "kicker", pilih ? "Alternatif untukmu" : "Paling cocok untukmu"), h, el("p", "sub", l.ringkas));
      if (top.alasan.length) {
        var ul = el("ul", "kuis-alasan"); top.alasan.forEach(function (t) { ul.appendChild(el("li", null, t)); });
        tx.append(el("p", "kuis-alasan-judul", "Cocok dengan pilihanmu:"), ul);
      }
      var aksi = el("div", "kuis-aksi"), wa = el("a", "btn", "Tanya look ini via WA");
      wa.href = waLink("Halo " + S.brand.nama + ", dari kuis di website saya cocok dengan look \"" + l.nama + "\". Boleh info paket dan tanggal kosongnya?");
      wa.target = "_blank"; wa.rel = "noopener"; wa.dataset.track = "klik_wa|Kuis · " + l.nama;
      aksi.append(wa, tombol("Lihat di koleksi", "btn btn-garis", function () {
        $("#koleksi").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); look.go(top.x.i);
      }));
      tx.appendChild(aksi); kartu.append(foto, tx); box.appendChild(kartu);
      var lain = r.map(function (v, j) { return j; }).filter(function (j) { return j !== (r[pilih] ? pilih : 0); }).slice(0, 2);
      if (lain.length) {
        var al = el("div", "kuis-alt"); al.appendChild(el("p", "kuis-alasan-judul", pilih ? "Pilihan lain" : "Juga bisa dipertimbangkan"));
        lain.forEach(function (j) {
          var b = tombol("", "kuis-alt-btn", function () { hasil(j); }), im = el("img"); im.src = r[j].x.l.foto; im.alt = "";
          b.append(im, el("span", null, r[j].x.l.nama)); al.appendChild(b);
        });
        box.appendChild(al);
      }
      box.appendChild(tombol("Ulangi kuis", "link-kecil", function () { jawab = []; tanya(0); }));
      fokus(h);
    }
    awal();
  })();

  /* ---------- persiapan: jam mulai rias + checklist ---------- */
  (function () {
    var J = S.jadwal, C = S.checklist || [];
    var adaJ = !!(J && J.aktif !== false && J.riasan && J.riasan.length), adaC = C.length > 0;
    if (!adaJ && !adaC) return;
    $("#persiapan").hidden = false;
    var tJ = $("#pt-jadwal"), tC = $("#pt-cek");
    function tab(cek) {
      tJ.setAttribute("aria-selected", String(!cek)); tC.setAttribute("aria-selected", String(cek));
      tJ.tabIndex = cek ? -1 : 0; tC.tabIndex = cek ? 0 : -1;
      $("#pp-jadwal").hidden = cek; $("#pp-cek").hidden = !cek;
      if (cek) siapCek();
    }
    tJ.addEventListener("click", function () { tab(false); });
    tC.addEventListener("click", function () { tab(true); });
    [tJ, tC].forEach(function (t) {
      t.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        var keCek = t === tJ; if ((keCek ? tC : tJ).hidden) return; tab(keCek); (keCek ? tC : tJ).focus();
      });
    });
    if (!adaJ) { tJ.hidden = true; tab(true); }
    if (!adaC) tC.hidden = true;

    /* jadwal mundur dari jam acara */
    if (adaJ) {
      var sel = $("#j-rias");
      J.riasan.forEach(function (r, i) { var o = el("option", null, r.nama); o.value = i; sel.appendChild(o); });
      var fmt = function (m) { var x = ((m % 1440) + 1440) % 1440; return String(Math.floor(x / 60)).padStart(2, "0") + "." + String(x % 60).padStart(2, "0"); };
      var lama = function (m) { var j = Math.floor(m / 60), s = m % 60; return (j ? j + " jam" : "") + (j && s ? " " : "") + (s ? s + " menit" : ""); };
      var hitung = function () {
        var v = ($("#j-jam").value || "08:00").split(":"), T = Number(v[0]) * 60 + Number(v[1] || 0);
        var r = J.riasan[Number(sel.value)] || J.riasan[0], n = Number($("#j-ortu").value);
        var siap = T - (J.cadanganMenit || 0), busana = siap - (J.busanaMenit || 0), mulai = busana - r.menit;
        var kel = n ? siap - n * 30 : null;
        var tiba = Math.min(mulai, kel === null ? mulai : kel) - (J.persiapanTimMenit || 0), bangun = tiba - 40;
        var L = [
          [bangun, "Bangun, mandi, sarapan ringan", "Pakai kemeja berkancing depan supaya riasan aman saat ganti baju."],
          [tiba, "Tim " + S.brand.nama + " tiba", "Menata alat dan pencahayaan."],
          [mulai, "Mulai rias pengantin", r.nama + ", sekitar " + lama(r.menit) + "."],
          [busana, "Pakai busana dan aksesori", ""],
          [siap, "Pengantin siap", "Waktu longgar untuk foto keluarga."],
          [T, "Acara dimulai", ""]
        ];
        if (kel !== null) L.push([kel, "Rias keluarga (" + n + " orang)", "Oleh asisten, sekitar 30 menit per orang."]);
        L.sort(function (a, b) { return a[0] - b[0]; });
        var ol = $("#j-hasil"); ol.textContent = "";
        var teks = "Jadwal hari H (acara jam " + fmt(T) + "), perkiraan dari " + S.brand.nama + ":\n";
        L.forEach(function (x, i) {
          var li = el("li", i === L.length - 1 ? "akhir" : null), w = el("time", null, fmt(x[0]));
          var isi = el("div"); isi.appendChild(el("strong", null, x[1]));
          if (x[0] < 0) isi.appendChild(el("span", "kemarin", " malam sebelumnya"));
          if (x[2]) isi.appendChild(el("p", null, x[2]));
          li.append(w, isi); ol.appendChild(li);
          teks += "\n" + fmt(x[0]) + "  " + x[1] + (x[0] < 0 ? " (malam sebelumnya)" : "");
        });
        var k = $("#j-konfirmasi");
        k.href = waLink("Halo " + S.brand.nama + ", acara kami mulai jam " + fmt(T) + " dengan riasan " + r.nama + (n ? " dan " + n + " keluarga ikut dirias" : "") + ". Apakah jadwal ini pas?\n\n" + teks);
        k.dataset.track = "klik_wa|Jadwal hari H";
        $("#j-bagikan").href = "https://wa.me/?text=" + encodeURIComponent(teks);
      };
      $("#jadwal-form").addEventListener("input", hitung);
      $("#jadwal-form").addEventListener("change", hitung);
      $("#jadwal-form").addEventListener("submit", function (e) { e.preventDefault(); });
      hitung();
    }

    /* checklist, centang disimpan di HP pengunjung */
    var CK = "mua_checklist", TK = "mua_tgl_acara";
    function baca() { try { return JSON.parse(store(CK) || "{}") || {}; } catch (e) { return {}; } }
    function siapCek() {
      var t = $("#c-tgl");
      if (!t.value) t.value = $("#f-tanggal").value || store(TK) || "";
      gambar();
    }
    function gambar() {
      var st = baca(), tgl = $("#c-tgl").value, list = $("#c-list"), total = 0, selesai = 0, kini = null;
      var hariIni = new Date(); hariIni.setHours(0, 0, 0, 0);
      var acara = tgl ? new Date(tgl + "T00:00:00") : null, sisa = acara ? Math.round((acara - hariIni) / 864e5) : null;
      if (sisa !== null && sisa >= 0) C.forEach(function (g) { if (g.hari >= sisa && (kini === null || g.hari < kini)) kini = g.hari; });
      list.textContent = "";
      C.forEach(function (g, gi) {
        var grup = el("section", "cek-grup" + (g.hari === kini ? " kini" : "")), kepala = el("h3");
        kepala.appendChild(el("span", null, g.judul));
        if (acara) { var d = new Date(acara); d.setDate(d.getDate() - g.hari); kepala.appendChild(el("small", null, tglPendek(d))); }
        if (g.hari === kini) kepala.appendChild(el("em", "cek-kini", "Sekarang"));
        var ul = el("ul");
        g.item.forEach(function (t, ii) {
          var key = gi + "-" + ii, id = "ck-" + key, li = el("li"), cb = el("input"), lb = el("label", null, t);
          cb.type = "checkbox"; cb.id = id; cb.checked = !!st[key]; lb.htmlFor = id;
          total++; if (cb.checked) selesai++;
          cb.addEventListener("change", function () { var s = baca(); if (cb.checked) s[key] = 1; else delete s[key]; store(CK, JSON.stringify(s)); gambar(); document.getElementById(id).focus(); });
          li.append(cb, lb); ul.appendChild(li);
        });
        grup.append(kepala, ul); list.appendChild(grup);
      });
      $("#c-jumlah").textContent = selesai; $("#c-dari").textContent = "dari " + total + " selesai";
      $("#c-bar").style.width = (total ? selesai / total * 100 : 0) + "%";
    }
    $("#c-tgl").addEventListener("change", function () { store(TK, this.value); gambar(); });
    if (!adaJ) siapCek();
  })();

  /* ---------- menu & tombol menyesuaikan bagian yang tampil ---------- */
  document.querySelectorAll('.nav a[href^="#"]').forEach(function (a) {
    var t = document.getElementById(a.getAttribute("href").slice(1)); if (t && t.hidden) a.hidden = true;
  });
  if (!S.booking.cekTanggal) document.querySelectorAll('a.btn[href="#booking"]').forEach(function (a) { a.textContent = "Booking sekarang"; });

  /* ---------- panel demo (untuk presentasi ke calon pembeli) ---------- */
  if (S.modeDemo) {
    var demo = $("#demo"); demo.hidden = false; document.body.classList.add("ada-demo");
    var WARNA = { ivory: "#E7DED3", blush: "#E8C9C6", sogan: "#9C6B3C", noir: "#161312" };
    Object.keys(WARNA).forEach(function (t) {
      var b = el("button"); b.type = "button"; b.style.background = WARNA[t]; b.title = "Tema " + t; b.setAttribute("aria-label", "Tema " + t);
      b.setAttribute("aria-pressed", document.documentElement.getAttribute("data-tema") === t ? "true" : "false");
      b.addEventListener("click", function () {
        setTema(t); store("mua_demo_tema", t);
        $("#demo-tema").querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      });
      $("#demo-tema").appendChild(b);
    });
    /* pilih paket: Basic / Pro / Premium, halaman dimuat ulang dengan fitur paket itu */
    if (window.MUA_FITUR) {
      var P = window.MUA_FITUR.PAKET, N = window.MUA_FITUR.NAMA, wadah = $("#demo-paket");
      Object.keys(P).forEach(function (k) {
        var b = el("button", null, k.charAt(0).toUpperCase() + k.slice(1)); b.type = "button";
        b.setAttribute("aria-pressed", String(FITUR.paket === k));
        b.addEventListener("click", function () { store("mua_demo_paket", k); try { sessionStorage.setItem("mua_demo_buka", "1"); } catch (e) {} location.reload(); });
        wadah.appendChild(b);
      });
      var isi = Object.keys(N).filter(function (k) { return FITUR[k]; }).map(function (k) { return N[k]; });
      $("#demo-paket-isi").textContent = isi.length ? "Termasuk: " + isi.join(", ") + "." : "Inti saja: hero, paket, galeri, testimoni, booking WA, FAQ.";
      $("#demo-admin").hidden = !(FITUR.kalender || FITUR.statistik || FITUR.penawaran);
      try { if (sessionStorage.getItem("mua_demo_buka")) { demo.open = true; sessionStorage.removeItem("mua_demo_buka"); } } catch (e) {}
    }
  }
})();
