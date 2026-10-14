const pesananModel = require("../models/pesananModel");
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
        const data = await pesananModel.getAll();
        res.json({
            success: true,
            data: data.map((item, index) => ({
                ...item,
                no: index + 1,
                totalText: formatRupiah(item.total),
            })),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Gagal menampilkan list pesanan" });
    }
}

// Buat fungsi search tanpa load halaman
async function search(req, res) {
    try {
        const keyword = req.query.q || "";
        const data = await pesananModel.search(keyword);

        res.json({
            success: true,
            data: data.map((item, index) => ({
                ...item,
                no: index + 1,
                totalText: formatRupiah(item.total),
            })),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Gagal mencari pesanan" });
    }
}

async function setStatus(req, res) {
    try {
        const status = req.body.status;
        await pesananModel.updateStatus(req.params.id, status);
        res.json({ success: true, status: String(status).toLowerCase() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Gagal mengubah status pesanan" });
    }
}

async function detail(req, res) {
    try {
        const kode = req.params.kode;
        const data = await pesananModel.getDetailByKode(kode);
        res.json({
            success: true,
            kode,
            data: data.map((item, index) => ({
                ...item,
                no: index + 1,
                hargaText: formatRupiah(item.harga),
                subtotalText: formatRupiah(item.subtotal),
            })),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Gagal memuat detail pesanan" });
    }
}

async function add(req, res) {
    try {
        await pesananModel.create(req.body);
        if (wantsJson(req)) return res.json({ success: true });
        // res.redirect(frontendUrl + "/menu");
    } catch (error) {
        console.error(error); req.files
        res.status(500).json({ success: false, message: "Gagal menambah pesanan" });
    }
}

// async function edit(req, res) {
//     try {
//         const foto = req.files && req.files.foto;
//         // console.log(req.files)
//         await menuModel.update(req.body, foto);
//         if (wantsJson(req)) return res.json({ success: true });
//         res.redirect(frontendUrl + "/menu");
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Terjadi kesalahan server");
//     }
// }

async function remove(req, res) {
    try {
        await pesananModel.remove(req.params.id);
        if (wantsJson(req)) return res.json({ success: true });
        res.redirect(frontendUrl + "/pesanan");
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Gagal menghapus pesanan" });
    }
}

module.exports = {
    list,
    search,
    setStatus,
    detail,
    add,
    remove,
};

// module.exports = {
//     list,
//     add,
//     edit,
//     search,
//     setStatus,
// };
