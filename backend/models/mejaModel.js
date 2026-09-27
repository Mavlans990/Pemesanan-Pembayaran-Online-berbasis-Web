const db = require("../config/connect");
const { findAll } = require("../utils/db");
const { generateQRCode, deleteFileByPublicPath } = require("../utils/menuUtils");

async function getAll() {
    return findAll("tb_meja");
}

async function findOne(nama) {
    try {
        // const db = await connectDB()
        const sql = `SELECT * FROM tb_meja WHERE nama_meja = ? LIMIT 1`;
        const [result] = await db.query(sql, [nama]);
        // console.log(result)
        return result.length > 0 ? result[0] : null;
    } catch (err) {
        console.error("Query Error:", err);
        throw err;
    }
}

async function create(colums) {
    const { nama_meja } = colums;
    const { foto, path: qrPath } = await generateQRCode(nama_meja);

    const sql = `INSERT INTO tb_meja (nama_meja, foto, path) VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [nama_meja, foto, qrPath]);
    return result;
}

// async function update(colums) {
//     const { id, nama, kategori, harga, deskripsi, star } = colums;
//     const sql = `
//         UPDATE tb_menu
//         SET nama = ?, deskripsi = ?, harga = ?, kategori = ?, star = ?
//         WHERE id_menu = ?
//     `;
//     const [result] = await db.query(sql, [nama, deskripsi, harga, kategori, star, id]);
//     return result;
// }

async function remove(id) {
    // Hapus file yg ada di public/img/qrcode
    const [rows] = await db.query(
        `SELECT path FROM tb_meja WHERE id_meja = ?`, [id]
    );

    if (rows[0] && rows[0].path) {
        await deleteFileByPublicPath(rows[0].path);
    }

    const sql = `DELETE FROM tb_meja WHERE id_meja = ?`;
    const [result] = await db.query(sql, [id]);
    return result;
}

module.exports = {
    getAll,
    findOne,
    create,
    remove,
};
