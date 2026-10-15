(function () {
    const modal = document.getElementById("modalDetailPesanan");
    if (!modal) return;

    const elKode = document.getElementById("detail-kode-pesanan");
    const tbody = document.getElementById("detail-pesanan-tbody");

    document.addEventListener("click", function (e) {
        const btn = e.target.closest(".btn-detail");
        if (!btn || !btn.dataset.kode_pesanan) return;
        isiDetail(btn.dataset.kode_pesanan);
    });

    async function isiDetail(kode) {
        if (elKode) elKode.textContent = kode;
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="5">Memuat...</td></tr>`;
        }

        try {
            const res = await fetch(
                (window.API_BASE || "") + "/api/pesanan/detail/" + encodeURIComponent(kode),
                { headers: { Accept: "application/json" } }
            );
            const json = await res.json();
            if (!json.success) throw new Error(json.message);
            renderDetail(json.data || []);
        } catch (err) {
            console.error(err);
            if (tbody) {
                tbody.innerHTML = `<tr><td colspan="5">Gagal memuat detail.</td></tr>`;
            }
        }
    }

    function renderDetail(rows) {
        if (!tbody) return;
        if (!rows.length) {
            tbody.innerHTML = `<tr><td colspan="5">Tidak ada item.</td></tr>`;
            return;
        }

        tbody.innerHTML = rows
            .map(
                (item) => `
                        <tr>
                            <td>${item.no}</td>
                            <td>${item.nama_menu || "---"}</td>
                            <td>${item.hargaText || item.harga}</td>
                            <td>${item.qty}</td>
                            <td>${item.subtotalText || item.subtotal}</td>
                        </tr>`
            )
            .join("");
    }
})();
