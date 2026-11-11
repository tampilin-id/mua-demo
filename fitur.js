/* =====================================================================
   FITUR PER PAKET JUAL — dipakai index.html, admin.html, penawaran.html.
   Tidak perlu diubah per klien. Atur lewat `fitur` di data.js:
     fitur: "basic" | "pro" | "premium"
     atau objek untuk kustom, mis. { kuota: false, penawaran: false }  (sisanya ikut premium)
   Bagian wajib (hero, tentang, paket, galeri, testimoni, booking WA, FAQ) selalu ada,
   dan otomatis hilang kalau datanya kosong.
   ===================================================================== */
(function () {
  var PAKET = {
    basic:   { katalog: false, video: false, look: false, aksesori: false, kuis: false, persiapan: false, kalender: false, kuota: false, statistik: false, penawaran: false, dekor: false },
    pro:     { katalog: false, video: true,  look: true,  aksesori: true,  kuis: true,  persiapan: true,  kalender: true,  kuota: false, statistik: false, penawaran: false, dekor: false },
    premium: { katalog: true,  video: true,  look: true,  aksesori: true,  kuis: true,  persiapan: true,  kalender: true,  kuota: true,  statistik: true,  penawaran: true,  dekor: true }
  };
  var NAMA = {
    katalog: "Katalog lengkap (halaman terpisah)", video: "Video peragaan", look: "Carousel look + koleksi busana", aksesori: "Aksesori", kuis: "Kuis look", persiapan: "Jam rias + checklist",
    kalender: "Kalender tanggal kosong", kuota: "Kuota per tanggal", statistik: "Statistik kunjungan & klik WA", penawaran: "Link penawaran pribadi", dekor: "Slide dekorasi"
  };

  function baca(S) {
    var pilih = S.fitur, demo = null;
    if (S.modeDemo) { try { demo = localStorage.getItem("mua_demo_paket"); } catch (e) {} }
    if (S.modeDemo) { try { var mp = location.search.match(/[?&]paket=(basic|pro|premium)/); if (mp) { demo = mp[1]; localStorage.setItem("mua_demo_paket", demo); } } catch (e) {} }
    if (demo && PAKET[demo]) pilih = demo;
    var dasar = typeof pilih === "string" && PAKET[pilih] ? pilih : "premium", f = {}, k;
    for (k in PAKET[dasar]) f[k] = PAKET[dasar][k];
    if (pilih && typeof pilih === "object") for (k in pilih) if (k in f) f[k] = pilih[k] !== false;
    f.kuis = f.kuis && f.look;   // kuis butuh foto look
    f.paket = typeof pilih === "string" && PAKET[pilih] ? pilih : (pilih && typeof pilih === "object" ? "kustom" : "premium");
    return f;
  }

  window.MUA_FITUR = { PAKET: PAKET, NAMA: NAMA, baca: baca };
})();
