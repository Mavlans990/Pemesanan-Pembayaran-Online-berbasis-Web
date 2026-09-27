const crypto = require("crypto");
const QRCode = require('qrcode')
const path = require('path');
const fs = require("fs/promises");

// const addMenu = async (colums) => {
//     try {
//         const dataArray = Array.isArray(colums) ? colums : [colums]; //buat cek data masuk 1 atau banyak

//         const values = dataArray.map(item => [
//             item.nama, 
//             item.deskripsi, 
//             item.harga, 
//             item.kategori, 
//             item.star
//         ]);

//         // const db = await connectDB()
//         const sql = `INSERT INTO tb_menu (nama, deskripsi, harga, kategori, star) VALUES ?`;
//         const [result] = await db.query(sql, [values]);
//         return result;
//     } catch (err) {
//         console.error("Query Error:", err);
//         // throw err;
//     }
// }

// const editMenu = async (colums) => {
//     try {
//         const {id, nama, kategori, harga, deskripsi, star} = colums
//         // const db = await connectDB()
//         const sql = `UPDATE tb_menu SET nama = '${nama}', deskripsi = '${deskripsi}', harga = ${harga}, kategori = '${kategori}', star = ${star} WHERE id_menu = '${id}'`;
//         const [result] = await db.query(sql);
//         return result;
//     } catch (err) {
//         console.error("Query Error:", err);
//         throw err;
//     }
// }

// const deleteMenu = async (id) => {
//     try {
//         // const db = await connectDB()
//         const sql = `DELETE FROM tb_menu WHERE id_menu = ${id}`;
//         const [result] = await db.query(sql);
//         return result;
//     } catch (err) {
//         console.error("Query Error:", err);
//         throw err;
//     }
// }

const hashNama = (text) => {
    return crypto
        .createHash("sha256")
        .update(`${text}-${Date.now()}-${Math.random()}`)
        .digest("hex");
};

const generateQRCode = async (textQR) => {
    const qrFolder = path.join(__dirname, "../../frontend/public/img/qrcode");
    // otomatis buat folder kalau tidak ada folder
    await fs.mkdir(qrFolder, { recursive: true });

    const foto = `${hashNama(textQR)}.png`;
    const publicPath = `/img/qrcode/${foto}`;
    const filePath = path.join(qrFolder, foto);

    try {
        await QRCode.toFile(filePath, textQR, {
            type: "png",
            width: 300,
            errorCorrectionLevel: "Q", // tingkat toleransi kerusakan: L, M, Q, H
        });

        console.log('QR Code berhasil disimpan!');
    } catch (err) {
        console.error('Gagal membuat QR Code!', err);
    };

    return { foto, path: publicPath };
}

const slug = (text) => {
    return text.toLowerCase().replace(/\s+/g, '-');
}

const formatRupiah = (angka, withPrefix = true) => {
    if (angka === null || angka === undefined || isNaN(angka)) {
        return withPrefix ? 'Rp 0' : '0';
    }

    // Menggunakan Intl.NumberFormat bawaan JavaScript (Sangat cepat & bersih)
    const formatted = new Intl.NumberFormat('id-ID', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(angka);

    return withPrefix ? `Rp ${formatted}` : formatted;
};

const deleteFileByPublicPath = async (publicPath) => {
    if (!publicPath) return;

    const relative = String(publicPath).replace(/^\/+/, "");
    const filePath = path.join(__dirname, "../../frontend/public", relative);

    try {
        await fs.unlink(filePath);
    } catch (err) {
        if (err.code !== "ENOENT") {
            console.error("Gagal hapus file:", err);
        }
    }
};

module.exports = { generateQRCode, slug, formatRupiah, deleteFileByPublicPath }