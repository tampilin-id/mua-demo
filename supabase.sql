-- Jalankan sekali di Supabase: SQL Editor → New query → tempel → Run.
-- Satu project Supabase per klien (paket gratis cukup).

create table if not exists public.tanggal_penuh (
  tanggal    date primary key,
  terisi     int  not null default 1 check (terisi >= 1),   -- jumlah booking di tanggal itu (fitur kuota per hari)
  catatan    text,
  dibuat     timestamptz not null default now()
);
-- Untuk project lama yang tabelnya sudah ada (aman dijalankan ulang):
alter table public.tanggal_penuh add column if not exists terisi int not null default 1 check (terisi >= 1);

alter table public.tanggal_penuh enable row level security;

-- Pengunjung website hanya bisa MEMBACA tanggal penuh
drop policy if exists "publik baca" on public.tanggal_penuh;
create policy "publik baca" on public.tanggal_penuh
  for select to anon, authenticated using (true);

-- Hanya admin yang login yang bisa menambah / menghapus
drop policy if exists "admin tambah" on public.tanggal_penuh;
create policy "admin tambah" on public.tanggal_penuh
  for insert to authenticated with check (true);

drop policy if exists "admin ubah" on public.tanggal_penuh;
create policy "admin ubah" on public.tanggal_penuh
  for update to authenticated using (true) with check (true);

drop policy if exists "admin hapus" on public.tanggal_penuh;
create policy "admin hapus" on public.tanggal_penuh
  for delete to authenticated using (true);

-- Setelah itu: Authentication → Users → Add user (email + kata sandi untuk MUA).
-- Matikan pendaftaran publik: Authentication → Sign In / Providers → Email → nonaktifkan "Allow new users to sign up".


-- =====================================================================
-- STATISTIK KUNJUNGAN & KLIK WHATSAPP (opsional, jalankan bagian ini juga)
-- Pengunjung website hanya bisa MENCATAT (insert). Hanya admin yang login yang bisa MEMBACA angkanya.
-- Tidak menyimpan IP, nama, atau nomor: hanya jenis kejadian, label tombol, dan kode acak per browser.
-- Jam hari memakai WIB (Asia/Jakarta). Ganti di dua tempat di bawah kalau klien di zona waktu lain.
-- =====================================================================
create table if not exists public.events (
  id       bigint generated always as identity primary key,
  dibuat   timestamptz not null default now(),
  hari     date        not null default (timezone('Asia/Jakarta', now()))::date,
  jenis    text        not null,
  label    text        check (char_length(label) <= 80),
  visitor  text        check (char_length(visitor) <= 40)
);
create index if not exists events_hari_idx on public.events (hari);
-- daftar jenis yang boleh dicatat (dibuat ulang supaya project lama ikut terbarui)
alter table public.events drop constraint if exists events_jenis_check;
alter table public.events add constraint events_jenis_check check (jenis in ('kunjungan', 'klik_wa', 'booking', 'penawaran'));

alter table public.events enable row level security;

drop policy if exists "publik catat" on public.events;
create policy "publik catat" on public.events
  for insert to anon, authenticated with check (true);

drop policy if exists "admin baca" on public.events;
create policy "admin baca" on public.events
  for select to authenticated using (true);

-- Ringkasan untuk halaman admin (dipanggil admin.html). Anon tidak bisa memanggilnya.
create or replace function public.statistik(p_hari int default 30)
returns json language sql stable as $$
  with batas as (select (timezone('Asia/Jakarta', now()))::date - (greatest(p_hari, 1) - 1) as mulai)
  select json_build_object(
    'harian', (select coalesce(json_agg(r order by r.hari), '[]'::json) from (
        select e.hari,
               count(*) filter (where e.jenis = 'kunjungan')                    as kunjungan,
               count(distinct e.visitor) filter (where e.jenis = 'kunjungan')   as pengunjung,
               count(*) filter (where e.jenis = 'klik_wa')                      as klik_wa,
               count(*) filter (where e.jenis = 'booking')                      as booking
        from public.events e, batas b where e.hari >= b.mulai group by e.hari) r),
    'label',  (select coalesce(json_agg(r order by r.jumlah desc), '[]'::json) from (
        select e.label, e.jenis, count(*) as jumlah
        from public.events e, batas b
        where e.jenis in ('klik_wa', 'booking', 'penawaran') and e.hari >= b.mulai
        group by e.label, e.jenis order by count(*) desc limit 15) r),
    'unik',   (select count(distinct e.visitor) from public.events e, batas b where e.jenis = 'kunjungan' and e.hari >= b.mulai)
  );
$$;
revoke all on function public.statistik(int) from public, anon;
grant execute on function public.statistik(int) to authenticated;
