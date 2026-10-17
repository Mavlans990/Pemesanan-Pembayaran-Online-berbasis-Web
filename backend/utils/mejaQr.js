const crypto = require("crypto");

function qrSecret() {
    return process.env.QR_SECRET || "ganti-qr-secret";
}

function signNama(nama) {
    return crypto.createHmac("sha256", qrSecret()).update(String(nama)).digest("hex").slice(0, 20);
}

function verifyNama(nama, sig) {
    const expect = signNama(nama);
    const a = Buffer.from(String(sig || ""), "utf8");
    const b = Buffer.from(expect, "utf8");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
}

function orderUrl(nama) {
    // const base = String(process.env.FRONTEND_URL || "https://cdwln3q7-3000.asse.devtunnels.ms").replace(/\/$/, "");
    const base = String("https://cdwln3q7-3000.asse.devtunnels.ms").replace(/\/$/, "");
    const q = new URLSearchParams({ meja: String(nama), sig: signNama(nama) });
    return base + "/?" + q.toString();
}

module.exports = { signNama, verifyNama, orderUrl };
