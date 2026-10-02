const db = require("../config/connect");
const { findAll } = require("../utils/db");
const { saveMenuFoto, deleteFileByPublicPath } = require("../utils/menuUtils");

async function getAll() {
    return findAll("tb_menu");
}

// Ambil data berdasarkan ID
async function findById(id) {
    const [result] = await db.query(`SELECT * FROM tb_menu WHERE id_menu = ?`, [id]);
    return result[0] || null;
}

async function search(keyword = "", kategori = "") {
    let sql = `SELECT * FROM tb_menu WHERE nama LIKE ?`;
    const params = [`%${keyword}%`];

    if (kategori && kategori !== "Semua Kategori") {
        sql += ` AND kategori = ?`;
        params.push(kategori);
    }

    sql += ` ORDER BY nama ASC`;
    const [result] = await db.query(sql, params);
    return result;
}

async function updateStatus(id, is_active) {
    const status = is_active === "ada" ? "ada" : "habis";
    const sql = `UPDATE tb_menu SET is_active = ? WHERE id_menu = ?`;
    const [result] = await db.query(sql, [status, id]);
    return result;
}

async function create(colums, file) {
    // data yang di ambil dari post / re
    const dataArray = Array.isArray(colums) ? colums : [colums];

    let foto = null;
    let fotoPath = null;
    if (file && dataArray.length === 1) {
        const saved = await saveMenuFoto(file);
        foto = saved.foto;
        fotoPath = saved.path;
    }

    const values = dataArray.map((item, index) => [
        item.nama,
        item.deskripsi,
        item.harga,
        item.kategori,
        item.star,
        index === 0 ? foto : item.foto || null,
        index === 0 ? fotoPath : item.path || null,
    ]);

    const sql = `
        INSERT INTO tb_menu (nama, deskripsi, harga, kategori, star, foto, path)
        VALUES ?
    `;
    const [result] = await db.query(sql, [values]);
    return result;
}

async function update(colums, file) {
    const { id, nama, kategori, harga, deskripsi, star } = colums;

    const dataOld = await findById(id);
    // ambil data lama foto dan path
    let foto = dataOld ? dataOld.foto : null;
    let fotoPath = dataOld ? dataOld.path : null;

    if (file) {
        const saved = await saveMenuFoto(file);
        if (dataOld && dataOld.path) {
            await deleteFileByPublicPath(dataOld.path);
        }
        foto = saved.foto;
        fotoPath = saved.path;
    }

    const sql = `
        UPDATE tb_menu
        SET nama = ?, deskripsi = ?, harga = ?, kategori = ?, star = ?, foto = ?, path = ?
        WHERE id_menu = ?
    `;
    const [result] = await db.query(sql, [
        nama,
        deskripsi,
        harga,
        kategori,
        star,
        foto,
        fotoPath,
        id,
    ]);
    return result;
}

async function remove(id) {
    const dataOld = await findById(id);
    if (dataOld && dataOld.path) {
        await deleteFileByPublicPath(dataOld.path);
    }

    const sql = `DELETE FROM tb_menu WHERE id_menu = ?`;
    const [result] = await db.query(sql, [id]);
    return result;
}

module.exports = {
    getAll,
    create,
    update,
    remove,
    search,
    updateStatus,
};
