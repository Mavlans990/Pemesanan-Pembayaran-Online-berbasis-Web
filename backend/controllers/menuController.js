const menuModel = require("../models/menuModel");
const { formatRupiah } = require("../utils/menuUtils");

async function list(req, res) {
    try {
        const data = await menuModel.getAll();
        res.render("menu/index", {
            layout: "layouts/main-layout",
            activePage: "menu",
            title: "Halaman Dashboard",
            menus: data,
            formatRupiah,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Terjadi kesalahan server");
    }
}

// Buat fungsi search tanpa load halaman
async function search(req, res) {
    try {
        const keyword = req.query.q || "";
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

async function add(req, res) {
    try {
        const foto = req.files && req.files.foto;
        // console.log(req.files.foto)
        await menuModel.create(req.body, foto);
        // console.log(req.body)
        res.redirect("/menu");
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
        res.redirect("/menu");
    } catch (error) {
        console.error(error);
        res.status(500).send("Terjadi kesalahan server");
    }
}

async function remove(req, res) {
    try {
        await menuModel.remove(req.params.id);
        res.redirect("/menu");
    } catch (error) {
        console.error(error);
        res.status(500).send("Terjadi kesalahan server");
    }
}

module.exports = {
    list,
    search,
    add,
    edit,
    remove,
};
