const menuModel = require("../models/menuModel");
const { formatRupiah } = require("../utils/menuUtils");

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

function wantsJson(req) {
    return req.xhr || (req.headers.accept || "").includes("application/json");
}

// function redirectFront(req, res, path) {
//     const referer = req.get("referer");
//     if (referer) {
//         try {
//         return res.redirect(new URL(referer).origin + path);
//         } catch (err) {
//         /* ignore */
//         }
//     }
//     const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
//     return res.redirect(frontendUrl + path);
// }

async function list(req, res) {
    try {
        const data = await menuModel.getAll();
        res.json({
            success: true,
            data: data.map((item, index) => ({
                ...item,
                no: index + 1,
                hargaText: formatRupiah(item.harga),
            })),
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Terjadi kesalahan server");
    }
}

// Buat fungsi search tanpa load halaman
async function search(req, res) {
    try {
        const keyword = req.query.nama || "";
        const kategori = req.query.kategori || "";

        const data = await menuModel.search(keyword, kategori);

        res.json({
            success: true,
            data: data.map((item, index) => ({
                ...item,
                no: index + 1,
                hargaText: formatRupiah(item.harga),
            })),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Gagal mencari menu" });
    }
}

async function setStatus(req, res) {
    try {
        const is_active = req.body.is_active === "ada" ? "ada" : "habis";
        await menuModel.updateStatus(req.params.id, is_active);
        res.json({ success: true, is_active });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Gagal mengubah status menu" });
    }
}

async function add(req, res) {
    try {
        const foto = req.files && req.files.foto;
        // console.log(req.files.foto)
        await menuModel.create(req.body, foto);
        // console.log(req.body)
        if (wantsJson(req)) return res.json({ success: true });
        res.redirect(frontendUrl + "/menu");
    } catch (error) {
        console.error(error);req.files
        res.status(error.status || 500).send(error.message || "Terjadi kesalahan server");
    }
}

async function edit(req, res) {
    try {
        const foto = req.files && req.files.foto;
        // console.log(req.files)
        await menuModel.update(req.body, foto);
        if (wantsJson(req)) return res.json({ success: true });
        res.redirect(frontendUrl + "/menu");
    } catch (error) {
        console.error(error);
        res.status(500).send("Terjadi kesalahan server");
    }
}

async function remove(req, res) {
    try {
        await menuModel.remove(req.params.id);
        if (wantsJson(req)) return res.json({ success: true });
        res.redirect(frontendUrl + "/menu");
    } catch (error) {
        console.error(error);
        res.status(500).send("Terjadi kesalahan server");
    }
}

module.exports = {
    list,
    add,
    edit,
    remove,
    search,
    setStatus,
};
