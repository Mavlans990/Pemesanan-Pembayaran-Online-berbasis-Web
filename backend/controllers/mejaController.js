const mejaModel = require("../models/mejaModel");
const { verifyNama } = require("../utils/mejaQr");
// const flash = require('connect-flash')
const frontendUrl = process.env.FRONTEND_URL + "/admin" || "http://localhost:3000/admin";

function wantsJson(req) {
    return req.xhr || (req.headers.accept || "").includes("application/json");
}

async function list(req, res) {
    try {
        const data = await mejaModel.getAll();
        // res.render("meja/index", {
        //     layout: "layouts/main-layout",
        //     activePage: "meja",
        //     title: "Halaman Dashboard",
        //     mejas: data,
        //     msg: req.flash('msg')
        // });
        res.json({ success: true, data });
        // console.log(frontendUrl)
    } catch (error) {
        console.error(error);
        res.status(500).send("Terjadi kesalahan server");
    }
}

async function add(req, res) {
    try {
        const cekNama = await mejaModel.findOne(req.body.nama_meja);
        // if (cekNama) {
        //     req.flash('msg', 'Nama Meja Sudah Ada!')
        // }else{
        //     await mejaModel.create(req.body);
        // }
        if (cekNama) {
            if (wantsJson(req)) {
                return res.status(400).json({ success: false, message: "Nama Meja Sudah Ada!" });
            }
            return res.redirect(frontendUrl + "/meja?error=" + encodeURIComponent("Nama Meja Sudah Ada!"));
        }
        await mejaModel.create(req.body);
        // console.log(req.body.nama_meja)
        if (wantsJson(req)) return res.json({ success: true });
        res.redirect(frontendUrl + "/meja");
    } catch (error) {
        console.error(error);
        res.status(500).send("Terjadi kesalahan server");
    }
}

// async function edit(req, res) {
//     try {
//         await mejaModel.update(req.body);
//         res.redirect("/meja");
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Terjadi kesalahan server");
//     }
// }

async function remove(req, res) {
    try {
        await mejaModel.remove(req.params.id);
        if (wantsJson(req)) return res.json({ success: true });
        res.redirect(frontendUrl + "/meja");
    } catch (error) {
        console.error(error);
        res.status(500).send("Terjadi kesalahan server");
    }
}

async function scan(req, res) {
    try {
        const nama = String(req.query.meja || "").trim();
        const sig = String(req.query.sig || "").trim();
        if (!nama || !verifyNama(nama, sig)) {
            return res.status(403).json({ success: false, message: "QR meja tidak valid" });
        }
        const row = await mejaModel.findOne(nama);
        if (!row) {
            return res.status(404).json({ success: false, message: "Meja tidak ditemukan" });
        }
        res.json({
            success: true,
            data: { id_meja: row.id_meja, nama_meja: row.nama_meja },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Gagal cek QR meja" });
    }
}

module.exports = {
    list,
    add,
    remove,
    scan,
};
