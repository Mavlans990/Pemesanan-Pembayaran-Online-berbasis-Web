# Dokumentasi Database `db_pesanan`

Dokumentasi mengikuti `db_pesanan.sql` plus perubahan yang disepakati (kolom `layanan` dihapus; `bukti_foto` / `bukti_path` ditambah).

## 1. Tabel `tb_meja`

| Kolom | Tipe Data | Null | Key | Default / Keterangan |
|---|---|---|---|---|
| `id_meja` | `int(11)` | Tidak | PK, AUTO_INCREMENT | ID meja |
| `nama_meja` | `varchar(30)` | Tidak | — | Nama meja |
| `foto` | `text` | Tidak | — | Nama file QR code |
| `path` | `text` | Tidak | — | Path file QR code |

## 2. Tabel `tb_menu`

| Kolom | Tipe Data | Null | Key | Default / Keterangan |
|---|---|---|---|---|
| `id_menu` | `int(11)` | Tidak | PK, AUTO_INCREMENT | ID menu |
| `nama` | `varchar(30)` | Tidak | — | Nama menu |
| `deskripsi` | `text` | Tidak | — | Deskripsi menu |
| `harga` | `int(11)` | Tidak | — | Harga menu |
| `stok` | `int(11)` | Tidak | — | Jumlah stok |
| `is_active` | `enum('ada','habis')` | Tidak | — | Status ketersediaan |
| `kategori` | `varchar(20)` | Tidak | — | Makanan / minuman |
| `star` | `int(11)` | Tidak | — | Penanda favorit |
| `foto` | `text` | Ya | — | Nama file foto |
| `path` | `text` | Ya | — | Path foto |
| `slug` | `varchar(30)` | Tidak | — | Slug menu |

## 3. Tabel `tb_pesanan`

| Kolom | Tipe Data | Null | Key | Default / Keterangan |
|---|---|---|---|---|
| `id_pesanan` | `int(11)` | Tidak | PK, AUTO_INCREMENT | ID pesanan |
| `kode_pesanan` | `varchar(35)` | Tidak | — | Dibuat saat checkout (`PSN-...`) |
| `tipe` | `enum('dine_in','takeaway')` | Tidak | — | Delivery belum dipakai |
| `id_meja` | `varchar(10)` | Tidak | — | Dine in: id meja. Take away: `"-"` |
| `status` | `enum('pending','dibayar','diproses','selesai','batal')` | Tidak | — | Cash → `pending`. QRIS + bukti → `dibayar` |
| `total` | `int(11)` | Tidak | — | Jumlah subtotal item (**tanpa pajak**) |
| `nama` | `varchar(30)` | Tidak | — | Opsional di UI; kosong disimpan `""` |
| `no_hp` | `int(11)` | Tidak | — | Opsional; kosong disimpan `0` (nol di depan tidak tersimpan) |
| `pay` | `enum('Cash','Qris')` | Tidak | — | Metode bayar |
| `catatan` | `text` | Tidak | — | Opsional; kosong `""` |
| `bukti_foto` | `text` | Ya | — | Nama file bukti QRIS |
| `bukti_path` | `text` | Ya | — | Path publik bukti, mis. `/img/bukti/...` |
| `created_at` | `timestamp` | Tidak | — | `current_timestamp()` |
| `update_at` | `timestamp` | Tidak | — | `ON UPDATE CURRENT_TIMESTAMP` |

Kolom **`layanan` sudah dihapus**.

Gambar QRIS toko (bukan bukti user): `frontend/public/img/qrcode/qris.png` (URL `/img/qrcode/qris.png`).

SQL kolom bukti (jalankan jika belum ada):

```sql
ALTER TABLE tb_pesanan
  ADD COLUMN bukti_foto TEXT NULL AFTER catatan,
  ADD COLUMN bukti_path TEXT NULL AFTER bukti_foto;
```

## 4. Tabel `tb_pesanan_detail`

Rincian menu per pesanan (bukan `tb_detail_pesanan`).

| Kolom | Tipe Data | Null | Key | Default / Keterangan |
|---|---|---|---|---|
| `id_detail` | `int(11)` | Tidak | PK, AUTO_INCREMENT | ID detail |
| `kode_pesanan` | `varchar(35)` | Tidak | — | Sama dengan header |
| `id_menu` | `int(11)` | Tidak | — | Menu yang dipesan |
| `harga` | `int(11)` | Tidak | — | Harga saat pesan |
| `qty` | `int(11)` | Tidak | — | Jumlah |
| `subtotal` | `int(11)` | Tidak | — | `harga × qty` |

## Relasi (tanpa FK di SQL)

| Sumber | Tujuan |
|---|---|
| `tb_pesanan_detail.kode_pesanan` | `tb_pesanan.kode_pesanan` |
| `tb_pesanan_detail.id_menu` | `tb_menu.id_menu` |
| `tb_pesanan.id_meja` | `tb_meja.id_meja` (tipe beda; take away `"-"`) |
