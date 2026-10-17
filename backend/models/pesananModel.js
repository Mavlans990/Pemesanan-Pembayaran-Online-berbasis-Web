const db = require("../config/connect");
const mejaModel = require("./mejaModel");
const { verifyNama } = require("../utils/mejaQr");
const { saveBuktiFoto } = require("../utils/pesananUtils");
const { deleteFileByPublicPath } = require("../utils/menuUtils");

// Ambil data berdasarkan ID
// async function findById(id) {
//     const [result] = await db.query(`SELECT * FROM tb_menu WHERE id_menu = ?`, [id]);
//     return result[0] || null;
// }

async function search(keyword = "") {
    const sql = `
        SELECT p.*, m.nama_meja
        FROM tb_pesanan p
        LEFT JOIN tb_meja m ON m.id_meja = p.id_meja
        WHERE (
            CAST(p.kode_pesanan AS CHAR) LIKE ?
            OR COALESCE(m.nama_meja, '') LIKE ?
            OR COALESCE(p.tipe, '') LIKE ?
            OR COALESCE(p.status, '') LIKE ?
            )
        ORDER BY p.kode_pesanan ASC
    `;
    const like = [`%${keyword}%`];
    const [result] = await db.query(sql, [like, like, like, like]);
    return result;
}

async function updateStatus(id, status) {
    const allowed = ["pending", "dibayar", "diproses", "selesai"];
    const next = allowed.includes(String(status).toLowerCase())
        ? String(status).toLowerCase()
        : "pending";
    const sql = `UPDATE tb_pesanan SET status = ? WHERE id_pesanan = ?`;
    const [result] = await db.query(sql, [next, id]);
    return result;
}

async function getDetailByKode(kode) {
    const sql = `
        SELECT d.*, m.nama AS nama_menu
        FROM tb_pesanan_detail d
        LEFT JOIN tb_menu m ON m.id_menu = d.id_menu
        WHERE d.kode_pesanan = ?
    `;
    const [result] = await db.query(sql, [kode]);
    return result;
}

async function getAll() {
    const sql = `
        SELECT p.*, m.nama_meja
        FROM tb_pesanan p
        LEFT JOIN tb_meja m ON m.id_meja = p.id_meja
        ORDER BY p.id_pesanan ASC
    `;
    const [result] = await db.query(sql);
    return result;
}

async function nextKode() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const prefix = `PSN-${y}${m}${d}-`;
    const [rows] = await db.query(
        `SELECT kode_pesanan FROM tb_pesanan WHERE kode_pesanan LIKE ? ORDER BY id_pesanan DESC LIMIT 1`,
        [`${prefix}%`]
    );
    let n = 1;
    if (rows[0] && rows[0].kode_pesanan) {
        const parts = String(rows[0].kode_pesanan).split("-");
        n = (parseInt(parts[2], 10) || 0) + 1;
    }
    return prefix + String(n).padStart(3, "0");
}

async function create(colums, file) {
    const body = Array.isArray(colums) ? colums[0] : colums;
    let items = body.items;
    if (typeof items === "string") {
        items = JSON.parse(items || "[]");
    }
    if (!Array.isArray(items) || items.length === 0) {
        const err = new Error("Keranjang kosong");
        err.status = 400;
        throw err;
    }

    const ids = items.map((it) => Number(it.id_menu)).filter(Boolean);
    const [menus] = await db.query(
        `SELECT id_menu, harga, is_active FROM tb_menu WHERE id_menu IN (?)`,
        [ids]
    );
    const byId = {};
    menus.forEach((m) => {
        byId[m.id_menu] = m;
    });

    const detailRows = [];
    let total = 0;
    for (const it of items) {
        const menu = byId[Number(it.id_menu)];
        const qty = Math.max(1, parseInt(it.qty, 10) || 0);
        if (!menu || String(menu.is_active).toLowerCase() !== "ada") {
            const err = new Error("Menu tidak tersedia");
            err.status = 400;
            throw err;
        }
        const harga = Number(menu.harga) || 0;
        const subtotal = harga * qty;
        total += subtotal;
        detailRows.push([null, Number(it.id_menu), harga, qty, subtotal]);
    }

    const tipe = body.tipe === "takeaway" ? "takeaway" : "dine_in";
    const pay = String(body.pay || "Cash") === "Qris" ? "Qris" : "Cash";
    let idMeja = "-";
    if (tipe === "dine_in") {
        const namaMeja = String(body.nama_meja || "").trim();
        const sig = String(body.sig || "").trim();
        if (!namaMeja || !verifyNama(namaMeja, sig)) {
            const err = new Error("Dine in wajib scan QR meja");
            err.status = 400;
            throw err;
        }
        const meja = await mejaModel.findOne(namaMeja);
        if (!meja) {
            const err = new Error("Meja tidak ditemukan");
            err.status = 400;
            throw err;
        }
        idMeja = String(meja.id_meja);
    }

    let buktiFoto = null;
    let buktiPath = null;
    if (pay === "Qris") {
        if (!file) {
            const err = new Error("Unggah bukti pembayaran QRIS");
            err.status = 400;
            throw err;
        }
        const saved = await saveBuktiFoto(file);
        buktiFoto = saved.foto;
        buktiPath = saved.path;
    }

    const status = pay === "Qris" && buktiPath ? "dibayar" : "pending";
    const nama = String(body.nama || "").slice(0, 30);
    const catatan = String(body.catatan || "");
    let noHp = parseInt(String(body.no_hp || "").replace(/\D/g, ""), 10);
    if (!noHp || noHp > 2147483647) noHp = 0;

    const kode = await nextKode();
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const [ins] = await conn.query(
            `INSERT INTO tb_pesanan
                (kode_pesanan, tipe, id_meja, status, total, nama, no_hp, pay, catatan, bukti_foto, bukti_path)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [kode, tipe, idMeja, status, total, nama, noHp, pay, catatan, buktiFoto, buktiPath]
        );
        const detailValues = detailRows.map((row) => [kode, row[1], row[2], row[3], row[4]]);
        await conn.query(
            `INSERT INTO tb_pesanan_detail (kode_pesanan, id_menu, harga, qty, subtotal) VALUES ?`,
            [detailValues]
        );
        await conn.commit();
        return {
            id_pesanan: ins.insertId,
            kode_pesanan: kode,
            status,
            total,
            tipe,
            pay,
        };
    } catch (err) {
        await conn.rollback();
        if (buktiPath) await deleteFileByPublicPath(buktiPath);
        throw err;
    } finally {
        conn.release();
    }
}

// async function update(colums, file) {
//     const { id, nama, kategori, harga, stok, deskripsi, star } = colums;

//     const dataOld = await findById(id);
//     // ambil data lama foto dan path
//     let foto = dataOld ? dataOld.foto : null;
//     let fotoPath = dataOld ? dataOld.path : null;

//     if (file) {
//         const saved = await saveMenuFoto(file);
//         if (dataOld && dataOld.path) {
//             await deleteFileByPublicPath(dataOld.path);
//         }
//         foto = saved.foto;
//         fotoPath = saved.path;
//     }

//     const sql = `
//         UPDATE tb_menu
//         SET nama = ?, deskripsi = ?, harga = ?, stok = ?, kategori = ?, star = ?, foto = ?, path = ?
//         WHERE id_menu = ?
//     `;
//     const [result] = await db.query(sql, [
//         nama,
//         deskripsi,
//         harga,
//         stok,
//         kategori,
//         star,
//         foto,
//         fotoPath,
//         id,
//     ]);
//     return result;
// }

async function remove(id) {
    const [rows] = await db.query(
        `SELECT kode_pesanan, id_pesanan, bukti_path FROM tb_pesanan WHERE id_pesanan = ?`, [id]
    );
    const row = rows[0];
    if (!row) return { affectedRows: 0 };

    const kode = row.kode_pesanan;
    await db.query(`DELETE FROM tb_pesanan_detail WHERE kode_pesanan = ?`, [kode]);
    const [result] = await db.query(`DELETE FROM tb_pesanan WHERE id_pesanan = ?`, [id]);
    if (row.bukti_path) await deleteFileByPublicPath(row.bukti_path);
    return result;
}

module.exports = {
    getAll,
    search,
    updateStatus,
    getDetailByKode,
    create,
    remove,
};
// module.exports = {
//     getAll,
//     create,
//     update,
//     search,
//     updateStatus,
// };
