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

- Kerangka HTML di **EJS**; JS terpisah (pola seperti `menu-search.js`).
- Menu: `fetch("/api/menu")`. Hanya `is_active === "ada"`. Gambar dari `path` API (`/img/menu/...`).
- Harga **Rupiah** (`id-ID`).
- **Keranjang lokal** (belum ke DB, belum `POST /api/pesanan/add`). Kode `PSN-...` baru saat checkout (belum dikerjakan).
- Search / filter kategori **di browser** dari daftar yang sudah di-load (bukan `GET /api/menu/search`).
- Checkout / QR **belum**.

CSS:

```bash
cd frontend
npm run build:css    # Tailwind CLI → public/user/css/style.css
npm run watch:css
npm run dev
```

Sumber class komponen: `user/src/input.css` + `public/user/css/layout.css`. Jangan edit `style.css` hasil generate. Script build memakai `node ./node_modules/tailwindcss/lib/cli.js` (Windows).

Ubah UI: diskusikan dulu + ikut tutor class Tailwind.

---

## API

| Method | URL | Fungsi |
|--------|-----|--------|
| GET | `/api/health` | Cek API |
| GET | `/api/menu` | List menu |
| GET | `/api/menu/search` | Filter nama + kategori (**admin**) |
| POST | `/api/menu/add` | Tambah (+ foto opsional, `req.files.foto` + `.mv`) |
| POST | `/api/menu/edit/:id` | Ubah |
| POST | `/api/menu/status/:id` | `is_active`: ada / habis (AJAX) |
| GET | `/api/menu/delete/:id` | Hapus data + file |
| GET/POST | `/api/meja/...` | Pola sama; QR filename di-hash |
| GET | `/api/pesanan` | List + JOIN `tb_meja` |
| GET | `/api/pesanan/search` | Cari kode / meja / status |
| GET | `/api/pesanan/detail/:kode` | Item detail + nama menu (`m.id_menu = d.idmenu`) |
| POST | `/api/pesanan/add` | Ada di API; **belum** dipanggil UI user |
| POST | `/api/pesanan/status/:id` | Ubah status (AJAX + konfirmasi) |
| GET | `/api/pesanan/delete/:id` | Hapus header by **id_pesanan**, detail by **kode_pesanan** |

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
npm run dev
```

`frontend`: `npm run build:css` lalu `npm run dev`. Backend port 4000.

Salin `backend/.env.example` → `backend/.env` dan `frontend/.env.example` → `frontend/.env`.

Jangan commit `node_modules/` (root, `backend/`, `frontend/`) dan `.env`.

---

## Ongoing

1. Keranjang belum punya kode. `PSN-...` baru saat checkout / insert `tb_pesanan`.
2. List menu yg dipesan disimpan di table tb_detail_pesanan
3. Checkout, QR, POST pesanan dari halaman user — belum.
4. UI user belum final; ubah setelah diskusi.
