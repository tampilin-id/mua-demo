# Template Website MUA / Sanggar Rias

Website portofolio + booking untuk MUA dan sanggar rias pengantin. HTML/CSS/JS biasa, tanpa framework, bisa di-hosting gratis di GitHub Pages.

## Isi folder

| File | Fungsi | Diubah per klien? |
|---|---|---|
| `data.js` | Semua teks, harga, koleksi, nomor WA, pengaturan | **Ya, ini satu-satunya** |
| `assets/` | Semua gambar | **Ya, ganti gambarnya** |
| `index.html`, `style.css`, `app.js` | Tampilan & logika | Tidak |
| `admin.html` | Halaman MUA untuk menandai tanggal penuh | Tidak |
| `supabase.sql` | Skrip database tanggal penuh | Dijalankan sekali |

## Alur setiap ada pembeli baru

1. Salin seluruh folder ini ke repo baru (misal `sekarayu-bridal`).
2. Edit `data.js`:
   - `tema`: `"ivory"`, `"blush"`, `"sogan"`, atau `"noir"`
   - `modeDemo: false` (supaya panel ganti tema hilang)
   - `brand`: nama, WA (format `628xxx`), IG, alamat, `peta` (link Google Maps, boleh kosong), `url` (alamat situs setelah online, mis. `https://namaklien.github.io/`)
   - `paket`, `koleksi`, `aksesori`, `galeri`, `testimoni`, `faq`
3. Ganti gambar di `assets/` lalu sesuaikan nama file di `data.js`.
4. Kalau klien pakai fitur cek tanggal, lihat bagian Supabase di bawah. Kalau tidak, set `booking.cekTanggal: false`.
5. Buat preview link (WhatsApp/Google): jalankan `python3 tools/buat_seo.py .` dari folder situs. Ini mengisi judul, deskripsi, dan gambar preview dari `data.js`. Isi `brand.url` dulu, kalau kosong preview WhatsApp tidak menampilkan gambar. Ulangi setiap data merek/hero berubah.
6. Push ke GitHub → Settings → Pages → Deploy from branch `main` / root.

## Ukuran foto

| Foto | Rasio | Catatan |
|---|---|---|
| Hero sebelum & sesudah | 4:5 (misal 1000×1250) | **Pose, jarak, cahaya dan latar harus sama persis.** Pakai tripod. |
| Busana di rak (`gambar`) | 300:440 (≈2:3) | **PNG tanpa latar**, hanger di tengah atas, baju utuh |
| Dipakai / belakang / detail | 2:3 | Boleh berlatar |
| Aksesori | 10:7 | Latar polos terang |
| Galeri | 4:5 | |

Kompres dulu (squoosh.app, kualitas 80, lebar maks. 1200px). Target < 250 KB per foto.

## Fitur cek tanggal (Supabase)

1. Buat project baru di supabase.com (gratis), satu project per klien.
2. SQL Editor → tempel isi `supabase.sql` → Run.
3. Authentication → Users → **Add user**: email & kata sandi untuk MUA.
4. Authentication → Sign In / Providers → Email → **matikan "Allow new users to sign up"**.
5. Project Settings → API → salin **Project URL** dan **anon public key** ke `data.js`:
   ```js
   supabaseUrl: "https://xxxx.supabase.co",
   supabaseAnonKey: "eyJhbGci...",
   ```
6. MUA membuka `https://domainnya/admin.html`, login, lalu ketuk tanggal untuk menandai penuh.

Selama `supabaseUrl` kosong, website berjalan dalam **mode demo**: tanggal penuh diambil dari `tanggalPenuhDemo`, dan `admin.html` memakai PIN `1234` yang menyimpan ke browser saja. Cocok untuk presentasi.

Anon key memang boleh ada di website publik. Keamanannya dijaga oleh aturan RLS di `supabase.sql`: publik hanya bisa membaca, dan hanya user yang login yang bisa mengubah.

## Paket fitur (Basic / Pro / Premium)

Atur di `data.js` → `fitur: "basic" | "pro" | "premium"`. Untuk kustom pakai objek, mis. `fitur: { kuota: false, penawaran: false }` (yang tidak disebut ikut premium).

| Fitur | Basic | Pro | Premium |
|---|---|---|---|
| Hero sebelum/sesudah, tentang, paket, galeri, testimoni, booking WA, FAQ, Maps, SEO | ✓ | ✓ | ✓ |
| Carousel look + koleksi busana | | ✓ | ✓ |
| Aksesori | | ✓ | ✓ |
| Kuis look (butuh carousel look) | | ✓ | ✓ |
| Jam mulai rias + checklist | | ✓ | ✓ |
| Kalender tanggal kosong + admin | | ✓ | ✓ |
| Kuota per tanggal | | | ✓ |
| Statistik kunjungan & klik WA | | | ✓ |
| Link penawaran pribadi | | | ✓ |

- Daftar paket ada di `fitur.js` (dipakai halaman utama, admin, dan penawaran). Ubah di sana kalau isi paket jualmu berubah.
- Bagian yang datanya kosong (tentang, paket, look, aksesori, galeri, testimoni, FAQ) otomatis hilang, termasuk menu dan tombolnya. Tanpa kalender, tombol "Cek tanggal kosong" berganti menjadi "Booking sekarang".
- Admin hanya menampilkan tab yang termasuk paket. Paket Basic tidak memakai admin.
- Mode demo: panel Demo punya pilihan Basic / Pro / Premium. Halaman dimuat ulang dengan fitur paket itu, jadi calon pembeli bisa melihat bedanya langsung. Pilihan ini hanya berlaku saat `modeDemo: true`.

## Link per look

Setiap look punya link sendiri: `namasitus/#look-3` (nomor urut) atau `namasitus/#look-akad-solo-putri` (nama look, huruf kecil, spasi jadi tanda minus). Link ini langsung membuka bagian koleksi dengan look tersebut di tengah dan menahan putaran otomatis selama 1 menit. Di panel samping ada tombol **Bagikan link look ini** (di HP membuka menu bagikan, di laptop menyalin link). Halaman penawaran juga punya tautan "Lihat look ini di website". Link berbasis nama tetap benar walaupun urutan look berubah.

## Kompatibilitas iPhone lama

CSS memakai cadangan untuk Safari lama: latar solid sebelum `color-mix()` (Safari < 16.2) dan `vh` sebelum `svh` (Safari < 15.4), serta `top/right/bottom/left` sebagai ganti `inset`. Jangan hapus baris cadangan ini saat mengubah gaya.

## Fitur untuk calon pengantin

Semua diatur di `data.js` dan bisa dimatikan satu per satu.

- **Kuis "Look mana yang cocok?"** (`kuis`): 4 pertanyaan ketuk, lalu rekomendasi look + 2 alternatif, tombol WA dan "Lihat di koleksi". Tiap look diberi `tag` (mis. `"hijab"`, `"adat"`, `"resepsi"`). Pilihan kuis menambah skor look dengan tag yang sama; `wajib: true` = hanya look dengan tag itu; `kecuali: "hijab"` = buang look ber-tag hijab. Look tanpa `tag` tidak ikut kuis. Matikan: `kuis.aktif: false`.
- **Jam mulai rias** (`jadwal`): calon pengantin memasukkan jam acara, jenis riasan, dan jumlah keluarga yang dirias, lalu keluar jadwal mundur (bangun, tim tiba, mulai rias, busana, siap). Bisa dikirim ke MUA untuk konfirmasi atau dibagikan ke keluarga. Lama rias per jenis diatur di `jadwal.riasan`. Matikan: `jadwal.aktif: false`.
- **Checklist perawatan H-30 sampai hari H** (`checklist`): bisa dicentang (tersimpan di HP pengunjung), dan kalau tanggal acara diisi, tiap tahap menampilkan tanggal sebenarnya plus penanda "Sekarang". Kosongkan daftar untuk mematikan.

## Link penawaran pribadi

Di `admin.html` → tab **Penawaran**: isi nama pasangan, tanggal, lokasi, look, paket (harga bisa diubah), item tambahan, potongan, DP, dan masa berlaku. Klik **Buat link penawaran**, lalu **Kirim ke WA** (kalau nomor calon pengantin diisi, langsung ke nomornya).

Calon pengantin membuka `penawaran.html` yang berisi: "Untuk Rina & Dimas", status tanggal (masih tersedia / tinggal N slot / penuh), foto look, rincian harga, DP dan pelunasan, masa berlaku, pesan pribadi, serta tombol **Kunci tanggal** dan **Tanya dulu** ke WA. Setelah lewat masa berlaku, tombolnya berganti menjadi "Minta harga terbaru".

- Isi penawaran tersimpan di link itu sendiri, jadi tidak perlu database. Jalan juga tanpa Supabase.
- Di tab Statistik terlihat "Penawaran dibuka · nama", "Penawaran · nama" (tanya), dan "DP penawaran · nama". Untuk klien dengan Supabase, jalankan ulang `supabase.sql` supaya jenis `penawaran` diizinkan.
- Riwayat 15 penawaran terakhir tersimpan di perangkat admin.
- Catatan: isi link bisa diubah oleh orang yang paham teknis. Anggap halaman ini sebagai tampilan penawaran; kesepakatan akhir tetap di chat WA.
- Teks bawah halaman diatur di `penawaran.catatanBawah`; DP dan masa berlaku bawaan di `penawaran.dpPersen` dan `penawaran.berlakuHari`.

## Kuota booking per hari (fitur premium)

Secara bawaan satu tanggal = satu pengantin (`booking.kuotaPerHari: 1`). Untuk tim yang bisa menangani beberapa pengantin sehari, ubah ke `2`, `3`, dst. di `data.js`.

- Kalender pengunjung: tanggal dengan slot tersisa ditandai titik dan pesannya "masih tersedia, tinggal N slot". Tanggal dicoret kalau slotnya habis.
- Admin (`admin.html` → Tanggal penuh): ketuk tanggal, lalu atur jumlah slot terisi dengan tombol + dan −. Dengan kuota 1, ketuk tanggal langsung menandai penuh / membuka (seperti biasa).
- Klien lama: jalankan ulang `supabase.sql` (aman, menambah kolom `terisi` dan izin ubah). Tanpa kolom itu situs tetap jalan, semua tanggal dianggap penuh.
- Demo: `tanggalPenuhDemo` boleh berupa objek `{"2026-11-14": 2}` (jumlah slot terisi) atau daftar tanggal (dianggap penuh semua).
- Kuota hanya diatur di `data.js`; database hanya menyimpan jumlah terisi per tanggal.

## Statistik kunjungan & klik WhatsApp

Situs mencatat tiga hal secara anonim: **kunjungan** (sekali per sesi browser), **klik tombol WhatsApp** (dengan label: header, footer, tombol melayang, bar HP, atau nama look/busana), dan **kirim form booking**. Angkanya hanya bisa dilihat admin: buka `admin.html` → login → tab **Statistik** (grafik kunjungan per hari, orang berbeda per hari, tombol/look yang paling banyak diklik, periode 7/30/90 hari).

- Aktifkan: jalankan seluruh `supabase.sql` (bagian STATISTIK ada di bawah). Tanpa Supabase, statistik tampil sebagai data contoh dan hanya cocok untuk demo.
- Pengunjung hanya bisa MENCATAT. Membaca, mengubah, dan menghapus hanya untuk admin yang login (sudah diuji).
- Privasi: tanpa cookie, tanpa IP, nama, atau nomor. Hanya kode acak per browser untuk menghitung orang berbeda. Sebaiknya sebut di footer klien: "Statistik kunjungan anonim".
- Matikan: `statistik: false` di `data.js`.
- Kunjungan pemilik: di tab Statistik, centang "Jangan hitung kunjungan dari perangkat ini" di HP/laptop pemilik.
- Hari dihitung WIB. Untuk zona waktu lain ganti `Asia/Jakarta` di `supabase.sql` (2 tempat).
- Bot dan alat otomatis (Playwright dsb.) tidak dihitung.

## Ide paket jual

- **Basic**: website tanpa cek tanggal (`cekTanggal: false`)
- **Premium**: + kalender cek tanggal + halaman admin
- **Biaya perawatan bulanan**: ganti foto/paket/harga oleh kamu
