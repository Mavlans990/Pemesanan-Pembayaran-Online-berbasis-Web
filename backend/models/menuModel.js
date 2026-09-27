const db = require("../config/connect");
const { findAll } = require("../utils/db");

async function getAll() {
    return findAll("tb_menu");
}

async function search(keyword = "", kategori = "") {
    let sql = `SELECT * FROM tb_menu WHERE nama LIKE ?`;
    const params = [`%${keyword}%`];

    if (kategori && kategori !== "Semua Kategori") {
        sql += ` AND kategori = ?`;
        params.push(kategori);
    }

    sql += ` ORDER BY nama ASC`;
    const [rows] = await db.query(sql, params);
    return rows;
}

async function create(colums) {
    const dataArray = Array.isArray(colums) ? colums : [colums];

    const values = dataArray.map((item) => [
        item.nama,
        item.deskripsi,
        item.harga,
        item.kategori,
        item.star,
    ]);

    const sql = `INSERT INTO tb_menu (nama, deskripsi, harga, kategori, star) VALUES ?`;
    const [result] = await db.query(sql, [values]);
    return result;
}

async function update(colums) {
    const { id, nama, kategori, harga, deskripsi, star } = colums;
    const sql = `
        UPDATE tb_menu
        SET nama = ?, deskripsi = ?, harga = ?, kategori = ?, star = ?
        WHERE id_menu = ?
    `;
    const [result] = await db.query(sql, [nama, deskripsi, harga, kategori, star, id]);
    return result;
}

async function remove(id) {
    const sql = `DELETE FROM tb_menu WHERE id_menu = ?`;
    const [result] = await db.query(sql, [id]);
    return result;
}

module.exports = {
    getAll,
    search,
    create,
    update,
    remove,
};
