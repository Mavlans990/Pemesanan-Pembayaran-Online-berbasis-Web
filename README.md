# Pesanan — Roadmap & Alur Project

Aplikasi kasir/admin (menu, meja, pesanan) memakai **Node.js + Express + EJS**.

- Frontend (EJS): `http://localhost:3000`
- Backend API: `http://localhost:4000/api`

```
browser → frontend :3000 (HTML)
                ↓ fetch / form / proxy /api dan /img
         backend :4000 (JSON + upload file)
```

Admin vs user **belum** dipisah folder. Semua EJS tetap di `frontend/`.

Frontend mem-proxy `/api` dan `/img` ke backend, jadi Dev Tunnel cukup port **3000**.

---

## Struktur folder

```
.
├── backend/                 # port 4000
│   ├── config/connect.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── app.js
└── frontend/                # port 3000
    ├── layouts/
    ├── menu/
    ├── meja/
    ├── pesanan/
    ├── public/js/
    │   ├── menu-search.js
    │   ├── menu-edit.js
    │   ├── pesanan-search.js
    │   └── pesanan-edit.js   # modal detail pesanan
    └── app.js
```

Alur: `request → routes → controllers → models / utils → JSON atau render EJS`

---

## API

| Method | URL | Fungsi |
|--------|-----|--------|
| GET | `/api/health` | Cek API |
| GET | `/api/menu` | List menu |
| GET | `/api/menu/search` | Filter nama + kategori |
| POST | `/api/menu/add` | Tambah (+ foto opsional) |
| POST | `/api/menu/edit/:id` | Ubah |
| POST | `/api/menu/status/:id` | `is_active`: ada / habis (AJAX) |
| GET | `/api/menu/delete/:id` | Hapus data + file |
| GET/POST | `/api/meja/...` | Pola sama |
| GET | `/api/pesanan` | List + JOIN `tb_meja` |
| GET | `/api/pesanan/search` | Cari kode / meja / status |
| GET | `/api/pesanan/detail/:kode` | Item `tb_pesanan_detail` + nama menu |
| POST | `/api/pesanan/status/:id` | Ubah status (AJAX + modal konfirmasi) |
| GET | `/api/pesanan/delete/:id` | Hapus pesanan by **id** + detail by **kode** |

Status pesanan: `pending` → `dibayar` → `diproses` → `selesai`

---

## Pesanan — hapus & detail

- **Detail:** klik kode pesanan (`.btn-detail`) → modal (`pesanan-edit.js`). Isi: kode + tabel qty/harga/subtotal.
- **Hapus header:** `DELETE` / `GET .../delete/:id` memakai **`id_pesanan`** (PK).
- **Hapus detail:** setelah id ketemu, ambil `kode`, lalu `DELETE FROM tb_pesanan_detail WHERE kode_pesanan = ?`.
- Jangan hapus header **hanya** by kode di URL; kode untuk relasi detail saja.

---

## Halaman admin yang sudah ada

- **Menu** — CRUD, foto, stok, switch ada/habis, search AJAX (`menu-search.js`)
- **Meja** — CRUD, QR hash, hapus file ikut
- **Pesanan** — list JOIN meja, search, status radio + modal, detail by kode, hapus id + detail. Tambah/edit pesanan dari admin **belum** (nanti dari user checkout)

---

## Jalankan

```bash
npm install
npm run install:all
npm run dev
```

Salin `backend/.env.example` → `backend/.env` dan `frontend/.env.example` → `frontend/.env`.

Jangan commit `node_modules/` dan `.env`.

---

## Ongoing / masih dipikirkan

1. **Jika user isi keranjang, kode pesanan dicetak atau tidak?**  
   Belum diputuskan. Usulan: keranjang di frontend **belum** punya kode. Kode (`PSN-...`) **baru dibuat saat checkout / insert `tb_pesanan`**, lalu bisa dicetak. Isi keranjang yang belum dikirim tidak perlu baris di database.
