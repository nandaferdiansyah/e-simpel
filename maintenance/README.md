# Halaman "e-Simpel sedang tidak bisa diakses"

Isi folder:
- `index.html`: halaman untuk **error mendadak** (kucing berhelm memperbaiki server). Mandiri, mendukung mode gelap dan HP.
- `terjadwal.html`: halaman untuk **maintenance terjadwal** (kucing tidur). Tampil saat `MAINTENANCE = "true"`.
- `worker.js`: Cloudflare Worker yang berada di depan web. Kalau server mati atau tunnel putus (error 502, 52x, 530/1033), Worker menampilkan halaman ini dengan status 503.
- `wrangler.toml`: konfigurasi deploy.

## Cara pasang
1. Pastikan domain sudah dikelola Cloudflare.
2. Di `wrangler.toml`, ganti `GANTI-DOMAIN-KAMU` dan `GANTI-ZONE-KAMU`.
3. Di terminal, dari folder ini:
   ```
   npx wrangler login
   npx wrangler deploy
   ```

## Mode maintenance manual
Ubah `MAINTENANCE = "true"` di `wrangler.toml` lalu `npx wrangler deploy`.
Atau ubah variabel `MAINTENANCE` di dashboard Cloudflare (Workers, Settings, Variables).
Kembalikan ke `"false"` setelah selesai.

## Cara uji
- Matikan `cloudflared` di komputer, lalu buka web. Halaman maaf harus muncul.
- Buka `index.html` langsung di browser untuk melihat tampilannya.

## Catatan
- Navigasi browser dapat halaman HTML. Panggilan API (bukan `text/html`) dapat JSON `503` agar aplikasi tidak error.
- Worker tidak mengubah apa pun saat server normal.
- Worker berjalan di jaringan Cloudflare, jadi tetap hidup saat komputer atau VPS mati.
