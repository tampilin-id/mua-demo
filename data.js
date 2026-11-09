/* =====================================================================
   DATA KLIEN — satu-satunya file yang perlu diubah per pembeli.
   Gambar taruh di folder assets/, lalu tulis nama filenya di sini.
   ===================================================================== */
window.SITE = {

  /* ---------- Pengaturan umum ---------- */
  tema: "ivory",            // "ivory" | "blush" | "sogan" | "noir"
  modeDemo: true,           // true = tampilkan panel ganti tema (untuk presentasi ke calon pembeli). Set false untuk klien.
  // Paket fitur yang dibeli klien: "basic" | "pro" | "premium", atau objek kustom mis. { kuota: false }.
  // Basic  = hero, tentang, paket, galeri, testimoni, booking WA, FAQ.
  // Pro    = Basic + carousel look & koleksi, aksesori, kuis, jam rias & checklist, kalender tanggal kosong.
  // Premium= Pro + kuota per tanggal, statistik, link penawaran pribadi.
  // Bagian yang datanya kosong otomatis hilang (termasuk menunya).
  fitur: "premium",
  statistik: true,          // true = hitung kunjungan & klik WhatsApp (hanya admin yang bisa melihat, lewat admin.html). false = matikan.

  brand: {
    nama: "Sekar Ayu",
    sub: "Makeup & Bridal",
    kota: "Malang",
    tagline: "Rias pengantin adat Jawa, Sunda, dan modern. Lengkap dengan busana dan aksesori.",
    whatsapp: "6281234567890",           // format internasional tanpa + dan spasi
    instagram: "sekarayu.bridal",
    alamat: "Jl. Ijen No. 12, Klojen, Kota Malang",
    jamBuka: "Senin–Sabtu, 09.00–17.00 (konsultasi dengan janji)",
    peta: "",                            // opsional: tempel link Google Maps lokasi. Kosong = dicari otomatis dari alamat
    url: "https://tampilin-id.github.io/mua-demo/"                              // alamat situs setelah online, mis. "https://namaklien.github.io/" (untuk preview link)
  },

  /* ---------- Hero: foto sebelum & sesudah dirias ---------- */
  hero: {
    sebelum: "assets/hero-sebelum.webp",
    sesudah: "assets/hero-sesudah.webp",
    judul: "Pengantin yang tetap terlihat seperti dirinya sendiri.",
    keterangan: "Paes Solo Putri · riasan 2,5 jam",
    /* Lencana bukti (maks. 3, kosongkan [] untuk menyembunyikan). Isi dengan angka asli klien. */
    bukti: [
      { angka: "200+", label: "pengantin dirias" },
      { angka: "8 tahun", label: "pengalaman" },
      { angka: "4,9 ★", label: "ulasan Google" }
    ]
  },

  /* ---------- Tentang ---------- */
  tentang: {
    paragraf: [
      "Sekar Ayu merias pengantin di Malang Raya sejak 2014. Kami percaya riasan pengantin harus tahan dari akad pagi sampai resepsi malam, dan tetap nyaman difoto dari dekat.",
      "Satu tim datang ke lokasi: perias utama, asisten, dan penata busana. Semua busana dan aksesori kami rawat sendiri."
    ],
    keahlian: ["Paes Solo Putri & Solo Basahan", "Paes Jogja", "Sunda Siger", "Hijab modern", "Riasan pengantin pria"]
  },

  /* ---------- Paket layanan ---------- */
  paket: [
    { nama: "Akad Nikah", harga: 3500000,
      isi: ["Rias & hijab/sanggul pengantin wanita", "Rias pengantin pria", "1 set busana akad", "Melati & aksesori"],
      catatan: "Durasi pendampingan 4 jam" },
    { nama: "Akad + Resepsi", harga: 8500000,
      isi: ["Semua isi paket Akad", "Ganti riasan & busana resepsi", "Paes adat (Solo / Jogja / Sunda)", "Rias 2 orang tua"],
      catatan: "Paling banyak dipilih" },
    { nama: "Lamaran / Tunangan", harga: 1500000,
      isi: ["Rias & hairdo/hijab", "Touch-up 1x"],
      catatan: "" },
    { nama: "Wisuda & Pesta", harga: 450000,
      isi: ["Rias wajah", "Hairdo atau hijab sederhana"],
      catatan: "Datang ke studio. Home service +Rp100.000" }
  ],

  /* ---------- Look (barisan model "Pilih look-nya") ----------
     foto  : foto pengantin badan penuh TANPA latar (diproses tools/proses_baju.py → look-xxx.webp)
     isi   : apa saja yang ada di look ini. Untuk busana tulis `busana: "Nama di koleksi"`
             supaya bisa diklik dan membuka foto belakang/detail. Untuk aksesori tulis `aksesori: "Nama di aksesori"`.
     harga : harga paket mulai dari (opsional)
     tag   : dipakai kuis "Look mana yang cocok". Look tanpa tag tidak ikut kuis (mis. pengantin pria). */
  looks: [
    { nama: "Akad Solo Putri", kategori: "Akad", foto: "assets/look-kebaya-akad-gading.webp", harga: 8500000, tag: ["akad","adat","terang","klasik"],
      ringkas: "Paes Solo Putri dengan kebaya brokat gading. Klasik, untuk akad pagi di rumah atau masjid.",
      isi: [ { jenis: "Riasan", nama: "Paes Solo Putri", gambar: "assets/hero-sesudah.webp" },
             { jenis: "Busana", busana: "Kebaya Akad Gading" },
             { jenis: "Aksesori", aksesori: "Ronce melati" },
             { jenis: "Aksesori", aksesori: "Cunduk mentul" } ] },
    { nama: "Lamaran Sage", kategori: "Lamaran", foto: "assets/look-kebaya-kutubaru-sage.webp", harga: 1500000, tag: ["lamaran","akad","terang","natural"],
      ringkas: "Riasan lembut dan sanggul rendah dengan kutubaru sage. Cocok untuk lamaran dan akad rumahan.",
      isi: [ { jenis: "Riasan", nama: "Natural bridal + sanggul modern" },
             { jenis: "Busana", busana: "Kebaya Kutubaru Sage" },
             { jenis: "Aksesori", aksesori: "Ronce melati" } ] },
    { nama: "Resepsi Champagne", kategori: "Resepsi", foto: "assets/look-gaun-resepsi-champagne.webp", harga: 8500000, tag: ["resepsi","modern","terang","glam"],
      ringkas: "Glam modern dengan ballgown champagne dan tiara kristal untuk resepsi gedung.",
      isi: [ { jenis: "Riasan", nama: "Modern glam + updo" },
             { jenis: "Busana", busana: "Gaun Resepsi Champagne" },
             { jenis: "Aksesori", aksesori: "Mahkota tiara" } ] },
    { nama: "Jogja Marun", kategori: "Adat", foto: "assets/look-kebaya-beludru-marun.webp", harga: 8500000, tag: ["resepsi","adat","gelap","klasik"],
      ringkas: "Paes Ageng Jogja dengan kebaya beludru marun bersulam emas.",
      isi: [ { jenis: "Riasan", nama: "Paes Ageng Jogja" },
             { jenis: "Busana", busana: "Kebaya Beludru Marun" },
             { jenis: "Aksesori", aksesori: "Kalung susun" },
             { jenis: "Aksesori", aksesori: "Gelang kana" } ] },
    { nama: "Resepsi Lilac", kategori: "Resepsi", foto: "assets/look-gaun-corset-lilac.webp", harga: 8500000, tag: ["resepsi","modern","terang","glam"],
      ringkas: "Gaun off-shoulder lilac dengan korset berpayet. Soft glam dan sanggul rendah dengan jepit mutiara, untuk resepsi yang romantis.",
      isi: [ { jenis: "Riasan", nama: "Soft glam mauve + sanggul rendah" },
             { jenis: "Busana", busana: "Gaun Corset Lilac" } ] },
    { nama: "Akad Hijab", kategori: "Muslimah", foto: "assets/look-kebaya-muslimah-putih.webp", harga: 3500000, tag: ["hijab","akad","lamaran","terang","natural"],
      ringkas: "Hijab pengantin yang rapi dengan mahkota tiara kecil dan kebaya muslimah putih. Tertutup sempurna, nyaman seharian.",
      isi: [ { jenis: "Riasan", nama: "Soft bridal + hijab pengantin" },
             { jenis: "Busana", busana: "Kebaya Muslimah Putih" },
             { jenis: "Aksesori", aksesori: "Mahkota tiara" } ] },
    { nama: "Akad Putih Modern", kategori: "Akad", foto: "assets/look-kebaya-akad-putih.webp", harga: 4500000, tag: ["akad","lamaran","modern","terang","natural"],
      ringkas: "Kebaya renda putih bertabur mutiara, sanggul rendah, dan cadar tule tipis. Bersih dan elegan untuk akad.",
      isi: [ { jenis: "Riasan", nama: "Soft bridal + sanggul rendah dan cadar" },
             { jenis: "Busana", busana: "Kebaya Akad Putih" } ] },
    { nama: "Solo Basahan Hitam", kategori: "Adat", foto: "assets/look-kebaya-beludru-hitam.webp", harga: 8500000, tag: ["resepsi","adat","gelap","klasik"],
      ringkas: "Paes Solo dengan beludru hitam berprada emas. Paling formal untuk resepsi adat.",
      isi: [ { jenis: "Riasan", nama: "Paes Solo Basahan" },
             { jenis: "Busana", busana: "Kebaya Beludru Hitam" },
             { jenis: "Aksesori", aksesori: "Cunduk mentul" },
             { jenis: "Aksesori", aksesori: "Gelang kana" } ] },
    { nama: "Pengantin Pria", kategori: "Pria", foto: "assets/look-beskap-pria-navy.webp", harga: 0,
      ringkas: "Beskap landung navy lengkap dengan blangkon dan jarik. Termasuk di semua paket akad.",
      isi: [ { jenis: "Riasan", nama: "Grooming pengantin pria" },
             { jenis: "Busana", busana: "Beskap Pria Navy" } ] }
  ],

  /* ---------- Kuis "Look mana yang cocok?" ----------
     Tiap pilihan menambah skor untuk look yang punya `tag` sama.
     wajib: true  = hanya look dengan tag itu yang boleh muncul
     kecuali: "x" = look dengan tag x tidak boleh muncul */
  kuis: {
    aktif: true,
    pertanyaan: [
      { t: "Kamu berhijab di hari H?", pilihan: [
        { teks: "Ya, berhijab", tag: "hijab", wajib: true },
        { teks: "Tidak", kecuali: "hijab" } ] },
      { t: "Untuk acara apa?", pilihan: [
        { teks: "Lamaran / tunangan", tag: "lamaran" },
        { teks: "Akad nikah", tag: "akad" },
        { teks: "Resepsi", tag: "resepsi" } ] },
      { t: "Gaya yang paling kamu suka?", pilihan: [
        { teks: "Adat Jawa yang klasik", tag: "adat" },
        { teks: "Modern dan elegan", tag: "modern" },
        { teks: "Lembut, seperti diri sendiri", tag: "natural" } ] },
      { t: "Nuansa warna busana?", pilihan: [
        { teks: "Terang: putih, gading, pastel", tag: "terang" },
        { teks: "Gelap dan mewah: marun, hitam", tag: "gelap" },
        { teks: "Terserah, ikut saran", tag: "" } ] }
    ]
  },

  /* ---------- Persiapan: kalkulator jam rias hari H ----------
     menit = lama rias pengantin wanita sampai siap busana */
  jadwal: {
    aktif: true,
    riasan: [
      { nama: "Hijab / modern", menit: 120 },
      { nama: "Paes adat (Solo / Jogja / Sunda)", menit: 150 },
      { nama: "Lamaran / natural", menit: 90 }
    ],
    busanaMenit: 30,      // memakai busana & aksesori
    cadanganMenit: 30,    // waktu longgar sebelum acara (foto keluarga, perjalanan singkat)
    persiapanTimMenit: 20 // tim datang lebih awal untuk menata alat
  },

  /* ---------- Persiapan: checklist perawatan sebelum hari H ----------
     hari = berapa hari sebelum acara. Pengunjung bisa mencentang (tersimpan di HP-nya). */
  checklist: [
    { hari: 30, judul: "H-30", item: ["Trial makeup dan pilih look final", "Konsultasi warna busana dengan perias", "Mulai rutin minum air putih dan tidur cukup"] },
    { hari: 14, judul: "H-14", item: ["Facial terakhir yang agak berat (jangan mendekati hari H)", "Rapikan alis di perias, lalu biarkan tumbuh", "Fitting busana dan cek ukuran"] },
    { hari: 7, judul: "H-7", item: ["Jangan coba skincare atau produk baru", "Jangan cabut atau cukur alis sendiri", "Konfirmasi jam mulai rias dan alamat ke tim"] },
    { hari: 3, judul: "H-3", item: ["Masker wajah ringan yang biasa dipakai", "Siapkan kebaya, kain, sepatu, dan pakaian dalam warna kulit", "Kumpulkan aksesori pribadi (cincin, bros keluarga)"] },
    { hari: 1, judul: "H-1", item: ["Keramas sore hari, jangan pakai conditioner berat di akar", "Tidur paling lambat jam 21.00", "Siapkan kemeja berkancing depan untuk dipakai saat dirias", "Makan malam yang tidak terlalu asin"] },
    { hari: 0, judul: "Hari H", item: ["Cuci muka tanpa skincare berat, biarkan perias yang mulai", "Sarapan ringan sebelum dirias", "Bawa sedotan untuk minum setelah lipstik"] }
  ],

  /* ---------- Link penawaran pribadi (dibuat dari admin.html → tab Penawaran) ---------- */
  penawaran: {
    dpPersen: 30,          // bawaan DP di form
    berlakuHari: 7,        // bawaan masa berlaku penawaran
    catatanBawah: "Harga sudah termasuk transport Malang Raya. Tanggal dikunci setelah DP diterima."
  },

  /* ---------- Koleksi busana (detail yang dibuka dari look) ----------
     gambar   : foto baju di hanger tanpa latar (thumbnail)
     dipakai  : foto baju saat dipakai
     belakang : foto tampak belakang
     detail   : foto close-up bordir/payet
     hargaSewa: isi 0 kalau termasuk paket / tidak disewakan terpisah */
  koleksi: [
    { nama: "Kebaya Akad Gading", kategori: "Akad", warna: "Gading & emas", ukuran: "S – XL (bisa disesuaikan)", hargaSewa: 1500000,
      deskripsi: "Kebaya brokat Prancis bertabur mutiara dan payet emas, dengan bros di dada. Sepasang dengan kain songket gading.",
      gambar: "assets/kebaya-akad-gading.webp", dipakai: "assets/kebaya-akad-gading-dipakai.webp",
      belakang: "assets/kebaya-akad-gading-belakang.webp", detail: "assets/kebaya-akad-gading-detail.webp" },
    { nama: "Kebaya Kutubaru Sage", kategori: "Akad", warna: "Hijau sage & sogan", ukuran: "M – L", hargaSewa: 850000,
      deskripsi: "Kutubaru katun halus dengan bordir bunga melati, tepi bergelombang. Sepasang dengan jarik batik sogan.",
      gambar: "assets/kebaya-kutubaru-sage.webp", dipakai: "assets/kebaya-kutubaru-sage-dipakai.webp",
      belakang: "assets/kebaya-kutubaru-sage-belakang.webp", detail: "assets/kebaya-kutubaru-sage-detail.webp" },
    { nama: "Gaun Resepsi Champagne", kategori: "Resepsi", warna: "Champagne", ukuran: "S – L", hargaSewa: 2500000,
      deskripsi: "Ballgown tulle berlapis dengan taburan kristal. Rok mengembang, tetap ringan untuk berjalan.",
      gambar: "assets/gaun-resepsi-champagne.webp", dipakai: "assets/gaun-resepsi-champagne-dipakai.webp",
      belakang: "assets/gaun-resepsi-champagne-belakang.webp", detail: "assets/gaun-resepsi-champagne-detail.webp" },
    { nama: "Kebaya Beludru Marun", kategori: "Resepsi", warna: "Marun", ukuran: "S – XL", hargaSewa: 1800000,
      deskripsi: "Beludru dengan sulam benang emas, pasangan paes Solo Basahan dan Jogja.",
      gambar: "assets/kebaya-beludru-marun.webp", dipakai: "assets/kebaya-beludru-marun-dipakai.webp",
      belakang: "assets/kebaya-beludru-marun-belakang.webp", detail: "assets/kebaya-beludru-marun-detail.webp" },
    { nama: "Gaun Corset Lilac", kategori: "Resepsi", warna: "Lilac dusty blue", ukuran: "S – L", hargaSewa: 2500000,
      deskripsi: "Gaun off-shoulder dengan korset berpayet mutiara dan kristal, rok tule berlapis. Tali korset di punggung bisa disesuaikan.",
      gambar: "assets/gaun-corset-lilac.webp", dipakai: "assets/gaun-corset-lilac-dipakai.webp",
      belakang: "assets/gaun-corset-lilac-belakang.webp", detail: "assets/gaun-corset-lilac-detail.webp" },
    { nama: "Kebaya Muslimah Putih", kategori: "Muslimah", warna: "Putih", ukuran: "S – XXL", hargaSewa: 1300000,
      deskripsi: "Kerah tinggi dan lengan panjang, brokat penuh. Tidak menerawang.",
      gambar: "assets/kebaya-muslimah-putih.webp", dipakai: "assets/kebaya-muslimah-putih-dipakai.webp",
      belakang: "assets/kebaya-muslimah-putih-belakang.webp", detail: "assets/kebaya-muslimah-putih-detail.webp" },
    { nama: "Kebaya Akad Putih", kategori: "Akad", warna: "Putih gading", ukuran: "S – XL", hargaSewa: 1800000,
      deskripsi: "Kebaya renda Prancis putih bertabur mutiara dengan kancing mutiara di depan. Sepasang dengan rok satin putih.",
      gambar: "assets/kebaya-akad-putih.webp", dipakai: "assets/kebaya-akad-putih-dipakai.webp",
      belakang: "assets/kebaya-akad-putih-belakang.webp", detail: "assets/kebaya-akad-putih-detail.webp" },
    { nama: "Kebaya Beludru Hitam", kategori: "Resepsi", warna: "Hitam", ukuran: "S – XL", hargaSewa: 1800000,
      deskripsi: "Beludru hitam dengan prada emas. Pasangan klasik paes Solo Putri.",
      gambar: "assets/kebaya-beludru-hitam.webp", dipakai: "assets/kebaya-beludru-hitam-dipakai.webp",
      belakang: "assets/kebaya-beludru-hitam-belakang.webp", detail: "assets/kebaya-beludru-hitam-detail.webp" },
    { nama: "Beskap Pria Navy", kategori: "Pria", warna: "Navy", ukuran: "M – XXL", hargaSewa: 900000,
      deskripsi: "Beskap landung dengan kancing kuningan. Sudah termasuk blangkon dan kain jarik.",
      gambar: "assets/beskap-pria-navy.webp", dipakai: "assets/beskap-pria-navy-dipakai.webp",
      belakang: "assets/beskap-pria-navy-belakang.webp", detail: "assets/beskap-pria-navy-detail.webp" }
  ],

  /* ---------- Aksesori ---------- */
  aksesori: [
    { nama: "Mahkota tiara", gambar: "assets/aks-tiara.jpg", ket: "Lapis emas dan kristal, untuk resepsi modern" },
    { nama: "Siger Sunda", gambar: "assets/aks-siger.jpg", ket: "Lapis emas, termasuk kembang tanjung" },
    { nama: "Ronce melati", gambar: "assets/aks-ronce-melati.jpg", ket: "Melati segar, dirangkai di hari H" },
    { nama: "Cunduk mentul", gambar: "assets/aks-cunduk-mentul.jpg", ket: "Set 5 / 7 / 9 untuk paes Solo" },
    { nama: "Kalung susun", gambar: "assets/aks-kalung-susun.jpg", ket: "Kalung tiga lapis" },
    { nama: "Gelang kana", gambar: "assets/aks-gelang-kana.jpg", ket: "Sepasang, untuk Solo Basahan" },
  ],

  /* ---------- Galeri portofolio ---------- */
  // Video peragaan (Pro ke atas). Ganti dengan video klien sendiri. Vertikal 9:16, ≤ 3 video, tiap file sebaiknya di bawah 2 MB. Kosongkan item untuk menyembunyikan bagian ini.
  video: {
    judul: "Lihat langsung",
    sub: "Detail riasan dan busana bergerak, supaya kamu bisa membayangkannya di hari-H.",
    item: [
      { src: "assets/look-lilac-video.mp4", poster: "assets/look-lilac-video-poster.jpg", judul: "Resepsi Lilac", ket: "Contoh peragaan. Model dibuat dengan AI." }
    ]
  },

  galeri: [
    { gambar: "assets/hero-sesudah.webp", kat: "Adat", ket: "Paes Solo Putri — Rina & Dimas, Batu" },
    { gambar: "assets/galeri-2.webp", kat: "Hijab", ket: "Hijab akad — Nisa & Fajar, Malang" },
    { gambar: "assets/galeri-3.webp", kat: "Akad & Lamaran", ket: "Soft glam lamaran — Ayu, Lawang" },
    { gambar: "assets/galeri-9.webp", kat: "Akad & Lamaran", ket: "Kebaya gading akad — Maya & Bima, Malang" },
    { gambar: "assets/galeri-4.webp", kat: "Resepsi", ket: "Gaun resepsi — Salsa & Rizky, Kepanjen" },
    { gambar: "assets/galeri-5.webp", kat: "Adat", ket: "Solo Basahan — Wulan & Bayu, Malang" },
    { gambar: "assets/galeri-10.webp", kat: "Akad & Lamaran", ket: "Buket melati — Sinta & Raka, Batu" },
    { gambar: "assets/galeri-6.webp", kat: "Resepsi", ket: "Modern bridal — Tiara, Singosari" },
    { gambar: "assets/galeri-7.webp", kat: "Adat", ket: "Paes Ageng Jogja — Dewi & Arga, Batu" },
    { gambar: "assets/galeri-13.webp", kat: "Adat", ket: "Pengantin pria beskap navy — Arga, Batu" },
    { gambar: "assets/galeri-11.webp", kat: "Akad & Lamaran", ket: "Sebelum akad — Putri, Pakis" },
    { gambar: "assets/galeri-8.webp", kat: "Akad & Lamaran", ket: "Akad putih — Lina & Reza, Malang" },
    { gambar: "assets/galeri-12.webp", kat: "Resepsi", ket: "Detail riasan mata — gaya champagne" }
  ],

  /* ---------- Testimoni ---------- */
  testimoni: [
    { nama: "Rina, Batu", isi: "Riasannya awet dari subuh sampai jam sepuluh malam. Di foto close-up tetap halus." },
    { nama: "Nisa, Malang", isi: "Hijabnya rapi, tidak ada jarum yang terasa. Timnya datang tepat waktu." },
    { nama: "Wulan, Malang", isi: "Paes-nya rapi sekali. Ibu saya sampai minta dirias juga." },
    /* Tangkapan layar chat asli (opsional): simpan di assets/, sumber: whatsapp | instagram | google.
       Gambar di bawah adalah contoh bertanda "CONTOH". Ganti dengan screenshot asli klien (izin klien, samarkan nomor telepon). */
    { gambar: "assets/testi-1.webp", sumber: "whatsapp", nama: "Dinda" },
    { gambar: "assets/testi-2.webp", sumber: "instagram", nama: "Ayu" },
    { gambar: "assets/testi-3.webp", sumber: "whatsapp", nama: "Nisa" },
    { gambar: "assets/testi-4.webp", sumber: "whatsapp", nama: "Wulan" }
  ],

  /* ---------- FAQ ---------- */
  faq: [
    { t: "Berapa DP untuk mengunci tanggal?", j: "DP 30% dari total paket. Tanggal baru kami kunci setelah DP masuk." },
    { t: "Apakah melayani di luar Kota Malang?", j: "Ya. Malang Raya gratis transport. Di luar itu ada biaya transport sesuai jarak." },
    { t: "Bisa trial makeup dulu?", j: "Bisa, Rp350.000 di studio. Biaya trial dipotong dari paket kalau jadi booking." },
    { t: "Kapan harus booking?", j: "Idealnya 3–6 bulan sebelum hari H, terutama untuk bulan Syawal dan Besar." }
  ],

  /* ---------- Booking ---------- */
  booking: {
    cekTanggal: true,          // false = tanpa kalender, langsung form ke WhatsApp
    // Isi dua baris ini setelah membuat project Supabase (lihat README). Kosong = mode demo.
    supabaseUrl: "https://tzywsgddayhjllscmgjs.supabase.co",
    supabaseAnonKey: "sb_publishable_5Q2yrChU38YP9SUFY2s6rg_LFsQNKKy",
    // Kuota booking per hari. 1 = satu tanggal untuk satu pengantin (default). 2 atau lebih = fitur kuota: tanggal baru
    // tertutup kalau slotnya habis, dan pengunjung melihat "tinggal N slot". Atur jumlah terisi dari admin.html.
    kuotaPerHari: 2,
    // Hanya mode demo. Objek {tanggal: jumlah slot terisi}. Jumlah = kuotaPerHari berarti penuh. (Daftar ["2026-11-14", ...] juga boleh = penuh semua.)
    tanggalPenuhDemo: { "2026-11-14": 2, "2026-11-15": 1, "2026-11-22": 2, "2026-11-28": 1, "2026-12-05": 2, "2026-12-06": 2, "2026-12-12": 1, "2026-12-20": 2, "2026-12-26": 1, "2026-12-27": 2 },
    maksBulanKeDepan: 18
  }
};
