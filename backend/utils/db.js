const db = require('../config/connect')


const findAll = async (table) => {
    try {
        // 1. Daftar tabel yang diperbolehkan di database Anda
        const allowedTables = ['tb_meja', 'tb_menu', 'tb_pesanan'];

        // 2. Cek apakah parameter 'table' ada di dalam whitelist
        if (!allowedTables.includes(table)) {
            throw new Error("Akses tabel tidak diizinkan!");
        }

        // const db = await connectDB()
        const sql = `SELECT * FROM ${table}`;
        const [result] = await db.query(sql);
        return result;
    } catch (err) {
        console.error("Query Error:", err);
        throw err;
    }
    
}


module.exports = {findAll}