const crypto = require("crypto");
const path = require("path");
const fs = require("fs/promises");

const hashNama = (text) => {
    return crypto
        .createHash("sha256")
        .update(`${text}-${Date.now()}-${Math.random()}`)
        .digest("hex");
};

async function saveBuktiFoto(foto) {
    if (!foto) return { foto: null, path: null };

    const tipeFoto = [".png", ".jpg", ".jpeg", ".webp"];
    const ext = path.extname(foto.name).toLowerCase();
    const ukuranFoto = foto.data ? foto.data.length : foto.size;

    if (!tipeFoto.includes(ext)) {
        const err = new Error("Tipe foto tidak sesuai. Gunakan jpg, jpeg, png, atau webp.");
        err.status = 400;
        throw err;
    }

    if (ukuranFoto > 5 * 1024 * 1024) {
        const err = new Error("Ukuran foto terlalu besar (maks 5MB).");
        err.status = 400;
        throw err;
    }

    const folder = path.join(__dirname, "../../frontend/public/img/bukti");
    await fs.mkdir(folder, { recursive: true });

    const unik = crypto.randomBytes(3).toString("hex");
    const namaFoto = `${unik}${foto.md5 || hashNama(foto.name)}${ext}`;
    const target = path.join(folder, namaFoto);
    const publicPath = `/img/bukti/${namaFoto}`;

    await foto.mv(target);

    return { foto: namaFoto, path: publicPath };
}

module.exports = { saveBuktiFoto };
