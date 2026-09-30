# Pesanan — Port terpisah

Aplikasi kasir/admin (menu, meja) memakai **Node.js + Express + EJS**.

- Frontend (EJS): `http://localhost:3000`
- Backend API: `http://localhost:4000/api`

```
browser → frontend :3000 (HTML)
                ↓ fetch / form
         backend :4000 (JSON + upload file)
```

Admin vs user **belum** dipisah folder. Semua EJS tetap di `frontend/`.

## API

| Method | URL | Fungsi |
|--------|-----|--------|
| GET | `/api/health` | Cek API |
| GET | `/api/menu` | List menu JSON |
| GET | `/api/menu/search` | Filter nama + kategori |
| POST | `/api/menu/add` | Tambah (+ foto opsional) |
| POST | `/api/menu/edit/:id` | Ubah |
| GET | `/api/menu/delete/:id` | Hapus data + file |
| GET/POST | `/api/meja/...` | Pola sama |

Setelah form add/edit/hapus, backend **redirect** ke `http://localhost:3000/menu` (atau `/meja`).

Foto/QR: `frontend/public/img/...` diserve di `http://localhost:4000/img/...`.

## Jalankan

```bash
npm install
npm run install:all
npm run dev
```

Atau dua terminal:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

Salin `backend/.env.example` → `backend/.env` dan `frontend/.env.example` → `frontend/.env`.
