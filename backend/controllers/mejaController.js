const mejaModel = require("../models/mejaModel");
const flash = require('connect-flash')


async function list(req, res) {
    try {
        const data = await mejaModel.getAll();
        res.render("meja/index", {
            layout: "layouts/main-layout",
            activePage: "meja",
            title: "Halaman Dashboard",
            mejas: data,
            msg: req.flash('msg')
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Terjadi kesalahan server");
    }
}

async function add(req, res) {
    try {
        const cekNama = await mejaModel.findOne(req.body.nama_meja);
        if (cekNama) {
            req.flash('msg', 'Nama Meja Sudah Ada!')
        }else{
            await mejaModel.create(req.body);
        }
        // console.log(req.body.nama_meja)
        res.redirect("/meja");
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
        res.redirect("/meja");
    } catch (error) {
        console.error(error);
        res.status(500).send("Terjadi kesalahan server");
    }
}

module.exports = {
    list,
    add,
    remove,
};
