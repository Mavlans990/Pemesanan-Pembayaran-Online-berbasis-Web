# Pesanan — Roadmap & Alur Project

Aplikasi kasir/admin (menu, meja, dll) memakai **Node.js + Express + EJS**, **satu port**. Frontend dan backend folder terpisah, tapi masih satu server.

```
request → routes → controllers → models / utils → render EJS / JSON
```

---

## Alur project sekarang

### Layer

| Layer | Tugas | Contoh |
|--------|--------|--------|
| **Route** | URL saja | `GET /menu`, `POST /menu/add`, `GET /menu/search` |
| **Controller** | Ambil `req` → panggil model → `render` / `redirect` / `json` | `list`, `add`, `edit`, `search` |
| **Model** | Query DB (CRUD) | `getAll`, `create`, `update`, `remove`, `search` |
| **Utils** | Bukan DB: format, hash, QR, simpan/hapus file | `formatRupiah`, `saveMenuFoto`, `generateQRCode` |

Nama fungsi boleh sama (`create` di menu dan user) asal dipanggil `menuModel.create` / `userModel.create`.

---

## Route menu (acuan)

| Method | URL | Fungsi |
|--------|-----|--------|
| GET | `/menu` | Halaman list |
| GET | `/menu/search` | JSON filter nama + kategori |
| POST | `/menu/add` | Tambah (+ foto opsional) |
| POST | `/menu/edit/:id` | Ubah (foto opsional) |
| GET | `/menu/delete/:id` | Hapus data + file |

Meja mengikuti pola yang sama (`/meja/...`).

---

## Lanjut (belum dikerjakan di prompt ini)

- Halaman user (CRUD + foto) dengan JS terpisah.
- Database permanen sudah dipakai; API terpisah 2 port ditunda.
- Pagination DataTables vs search AJAX (bisa dirapikan nanti).
- Auth admin.

---

## Jalankan

```bash
cd backend
npm run dev
```

Buka `http://localhost:3000`.
