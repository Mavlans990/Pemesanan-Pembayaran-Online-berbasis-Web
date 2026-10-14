const db = require("../config/connect");
const { findAll } = require("../utils/db");
// const { saveMenuFoto, deleteFileByPublicPath } = require("../utils/menuUtils");

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

async function create(colums, file) {
    // data yang di ambil dari post / re
    const dataArray = Array.isArray(colums) ? colums : [colums];

    const values = dataArray.map((item, index) => [
        item.kode_pesanan,
        item.tipe,
        item.id_meja,
        item.status,
        item.total,
        item.catatan,
    ]);

    const sql = `
        INSERT INTO tb_pesanan (kode_pesanan, tipe, id_meja, status, total, catatan)
        VALUES ?
    `;
    const [result] = await db.query(sql, [values]);
    return result;
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
        `SELECT kode_pesanan, id_pesanan FROM tb_pesanan WHERE id_pesanan = ?`, [id]
    );
    const row = rows[0];
    if (!row) return { affectedRows: 0 };

    const kode = row.kode_pesanan;
    await db.query(`DELETE FROM tb_pesanan_detail WHERE kode_pesanan = ?`, [kode]);
    const [result] = await db.query(`DELETE FROM tb_pesanan WHERE id_pesanan = ?`, [id]);
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
