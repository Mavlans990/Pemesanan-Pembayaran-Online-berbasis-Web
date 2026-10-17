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
| `GET /admin` | Dashboard |
| `GET /admin/menu` | CRUD menu |
| `GET /admin/meja` | CRUD meja |
| `GET /admin/pesanan` | Daftar pesanan |

Nav admin memakai path `/admin...` (bukan `/`).

---

## Halaman user (`GET /`)

- Menu: `GET /api/menu`, hanya `is_active = ada`, gambar `path`, harga Rupiah.
- Keranjang **lokal** sampai Place order.
- Tipe order: **Dine in** / **Take away** (Delivery disembunyikan).
- Nama + no. HP opsional (keduanya). Dine in pilih meja (`id_meja`). Take away `id_meja = "-"`.
- Bayar: **Cash** / **QRIS**. QRIS: gambar `/img/qrcode/qris.png` + input foto bukti.
- Total = subtotal item, **tanpa pajak**.
- Checkout: `POST /api/pesanan/add` (multipart). Kode `PSN-...` baru di server. Item → `tb_pesanan_detail`.
- Search daftar menu: filter di browser dari list yang sudah di-load.

Sumber class komponen: `user/src/input.css` + `public/user/css/layout.css`. Jangan edit `style.css` hasil generate. Script build memakai `node ./node_modules/tailwindcss/lib/cli.js` (Windows).

Ubah UI: diskusikan dulu + ikut tutor class Tailwind.

---

## Checkout API

`POST /api/pesanan/add` (JSON atau `multipart/form-data`)

Field: `tipe` (`dine_in` \| `takeaway`), `id_meja`, `nama`, `no_hp`, `pay` (`Cash` \| `Qris`), `catatan`, `items` (JSON: `[{ id_menu, qty }]`).

File QRIS: `bukti` (`req.files.bukti` + `.mv`).

Status: Cash → `pending`; QRIS + bukti → `dibayar`.

SSE admin: `GET /api/pesanan/events` (text/event-stream). Pesanan baru di-broadcast.

---

## API

| Method | URL | Fungsi |
|--------|-----|--------|
| GET | `/api/menu` | List menu |
| GET | `/api/menu/search` | Search admin |
| POST | `/api/pesanan/add` | Checkout user |
| GET | `/api/pesanan` | List |
| GET | `/api/pesanan/search` | Cari |
| GET | `/api/pesanan/detail/:kode` | Detail item |
| POST | `/api/pesanan/status/:id` | Ubah status |
| GET | `/api/pesanan/delete/:id` | Hapus header by id, detail by kode |
| GET | `/api/pesanan/events` | Notifikasi realtime (SSE) |

Status pesanan: `pending` → `dibayar` → `diproses` → `selesai`  
Warna: Pending warning, Dibayar primary, Diproses info, Selesai success.

Postman: JSON, header, port **4000**.

---

## Halaman admin

- **Menu** — CRUD, foto opsional, switch ada/habis, search AJAX (`menu-search.js`). Pertama buka: list penuh.
- **Meja** — CRUD, QR hash, hapus file `deleteFileByPublicPath`.
- **Pesanan** — terpisah dari dashboard. List JOIN meja, search, status radio, detail klik **kode** (`.btn-detail` + `data-kode_pesanan`). Tambah pesanan dari admin **belum**.

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

- Delivery
- Cetak struk
