# Pesanan — Roadmap & Alur Project

Aplikasi pemesanan: **admin** (CRUD) dan **halaman user** (pesan makanan).

- Frontend (EJS): `http://localhost:3000`
- Backend API: `http://localhost:4000/api`

```
browser → frontend :3000 (HTML)
                ↓ fetch / form / proxy /api dan /img
         backend :4000 (JSON + upload file)
```

Frontend mem-proxy `/api` dan `/img` ke backend. Dev Tunnel cukup port **3000**. `http-proxy-middleware` **v2**.

Port frontend dan backend **dipisah**. Diskusikan dulu sebelum ubah/buat/tambah fitur.

---

## Struktur folder

```
.
├── backend/                      # port 4000
│   ├── config/connect.js
│   ├── controllers/
│   ├── models/                   # CRUD di model; utils helper saja
│   ├── routes/
│   ├── utils/
│   └── app.js
└── frontend/                     # port 3000
    ├── admin/
    │   ├── layouts/              # nav, main-layout (Bootstrap)
    │   ├── menu/
    │   ├── meja/
    │   └── pesanan/
    ├── user/
    │   ├── index.ejs             # GET /  — kerangka HTML, layout: false
    │   ├── src/input.css         # sumber Tailwind
    │   └── tailwind.config.js
    ├── public/
    │   ├── admin/js/
    │   │   ├── menu-search.js
    │   │   ├── menu-edit.js
    │   │   ├── pesanan-search.js
    │   │   └── pesanan-edit.js
    │   └── user/
    │       ├── css/
    │       │   ├── layout.css    # CSS tampilan (jangan andalkan hasil compile saja)
    │       │   └── style.css     # output Tailwind CLI
    │       └── js/
    │           ├── user-core.js  # state, fetch /api/menu, Rupiah
    │           ├── user-menu.js  # kategori + kartu produk
    │           ├── user-cart.js  # keranjang, meja, payment (lokal)
    │           └── user-events.js
    ├── index.ejs                 # dashboard admin
    └── app.js
```

Alur API: `request → routes → controllers → models / utils → JSON`

---

## Route halaman

| URL | Halaman |
|-----|---------|
| `GET /` | User pesan makanan (`user/index.ejs`, **tanpa** layout admin) |
| `GET /?meja=Nama&sig=…` | User dine in setelah scan QR meja |
| `GET /admin` | Dashboard |
| `GET /admin/menu` | CRUD menu |
| `GET /admin/meja` | CRUD meja |
| `GET /admin/pesanan` | Daftar pesanan |

Nav admin memakai path `/admin...` (bukan `/`).

---

## Halaman user (`GET /`)

- Menu: `GET /api/menu`, hanya `is_active = ada`, gambar `path`, harga Rupiah.
- Keranjang **lokal** sampai Place order. Kode `PSN-...` hanya di server saat checkout.
- **Tanpa scan QR:** hanya **Take away** (`id_meja = "-"`).
- **Scan QR meja:** hanya **Dine in**, nama meja **terkunci**. Tidak bisa ganti ke take away / ganti meja di UI.
- Nama + no. HP opsional (keduanya). 
- Bayar: **Cash** / **QRIS**. QRIS: gambar `/img/qrcode/qris.png` + input foto bukti.
- Total = subtotal item, **tanpa pajak**.
- Checkout: `POST /api/pesanan/add` (multipart). Kode `PSN-...` baru di server. Item → `tb_pesanan_detail`.
- Animasi `animate-slide-in-up` (tw-animations): berurutan saat load; kartu menu ulang saat ganti kategori.
- Search daftar menu: filter di browser dari list yang sudah di-load.
- CSS: Tailwind **v4.3** CLI + `layout.css`.  
  `cd frontend && npm run build:css`  
  (`node ./node_modules/@tailwindcss/cli/dist/index.mjs …`). Tema di `user/src/input.css` (`@theme`, `@import "tw-animations"`).

Ubah UI: diskusikan dulu + ikut tutor class Tailwind.

---

## QR meja

Isi PNG **bukan** nama meja mentah, melainkan URL:

`{FRONTEND_URL}/?meja={nama_meja}&sig={hmac}`

- `sig` = HMAC-SHA256 (`QR_SECRET`) atas nama meja, 20 hex. Dicek di **backend** (`GET /api/meja/scan`). Ganti nama di URL tanpa `sig` sah → ditolak.
- Checkout dine in wajib `nama_meja` + `sig` (bukan hanya `id_meja` di form).

`backend/.env`:

```
FRONTEND_URL=https://xxxx-3000.devtunnels.ms
CORS_ORIGIN=https://xxxx-3000.devtunnels.ms
QR_SECRET=k4nt1n-uduk-2026-x7pQ
```

Tunnel = port **3000**. `QR_SECRET` hanya di server.

---

## Checkout API

`POST /api/pesanan/add` (JSON atau `multipart/form-data`)

Field: `tipe` (`dine_in` \| `takeaway`), `nama`, `no_hp`, `pay` (`Cash` \| `Qris`), `catatan`, `items` (`[{ id_menu, qty }]`).  
Dine in: `nama_meja` + `sig`. File: `bukti`.

Status: Cash → `pending`; QRIS + bukti → `dibayar`.  
Insert `tb_pesanan` lalu `tb_pesanan_detail`.

SSE: `GET /api/pesanan/events` — toast admin. Suara opsional: `public/admin/sound/kaching.mp3`.

---

## API

| Method | URL | Fungsi |
|--------|-----|--------|
| GET | `/api/menu` | List menu |
| GET | `/api/menu/search` | Search admin |
| GET | `/api/meja` | List meja |
| GET | `/api/meja/scan` | Validasi QR `meja` + `sig` |
| POST | `/api/pesanan/add` | Checkout user |
| GET | `/api/pesanan` | List |
| GET | `/api/pesanan/search` | Cari |
| GET | `/api/pesanan/detail/:kode` | Detail item |
| POST | `/api/pesanan/status/:id` | Ubah status |
| GET | `/api/pesanan/delete/:id` | Header by `id_pesanan`, detail by `kode_pesanan` |
| GET | `/api/pesanan/events` | Notifikasi realtime (SSE) |

Status pesanan: `pending` → `dibayar` → `diproses` → `selesai`  
Warna: Pending warning, Dibayar primary, Diproses info, Selesai success.

Postman: JSON, header, port **4000**.

---

## Halaman admin

- **Menu** — CRUD, foto opsional, switch ada/habis, search AJAX (`menu-search.js`). Pertama buka: list penuh.
- **Meja** — CRUD, QR hash, hapus file `deleteFileByPublicPath`.
- **Pesanan** — detail klik **kode**. Tambah dari admin belum.

---

## Jalankan

```bash
npm install
npm run install:all
cd frontend && npm run build:css && npm run dev
```

`frontend`: `npm run build:css` lalu `npm run dev`. Backend port 4000.

Salin `backend/.env.example` → `backend/.env` dan `frontend/.env.example` → `frontend/.env`.

Jangan commit `node_modules/` (root, `backend/`, `frontend/`) dan `.env`.

---

## Ongoing

- login admin ada 2 role admin dan kasir
    admin = bisa manage semua list
    kasir = hanya buka list pesanan
- Halaman Pesanan : di detail ada Nama, No, Catatan, Bukti Foto
- Delivery
- Cetak struk
