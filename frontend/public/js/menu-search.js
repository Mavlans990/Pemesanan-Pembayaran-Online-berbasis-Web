(function () {
    const input = document.getElementById("cari-menu");
    const filterKategori = document.getElementById("filter-kategori");
    const tbody = document.getElementById("menu-tbody");
    if (!input || !tbody) {
        console.warn("menu-search: #cari-menu atau #menu-tbody tidak ketemu");
        return;
    }

    let timer = null;
    const table = tbody.closest("table");

    function escapeHtml(text) {
        return String(text ?? "")
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function resetDataTable() {
        if (!table || !window.jQuery || !window.jQuery.fn || !window.jQuery.fn.DataTable) {
            return;
        }
        const $table = window.jQuery(table);
        if (window.jQuery.fn.DataTable.isDataTable(table)) {
            $table.DataTable().destroy();
        }
    }

    function renderRows(rows) {
        resetDataTable();

        if (!rows.length) {
            tbody.innerHTML = `<tr><td colspan="6">Menu tidak ditemukan.</td></tr>`;
            return;
        }

        tbody.innerHTML = rows
            .map((menu, index) => {
                const badgeKategori = menu.kategori === "Makanan" ? "primary" : "dark";
                const favorit =
                    Number(menu.star) === 1
                        ? `<p class="fs-3 mb-0"> ⭐ </p>`
                        : `<p class="fs-3 mb-0"> 🚫 </p>`;

                return `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${escapeHtml(menu.nama)}</strong></td>
            <td>
                <span class="badge text-bg-${badgeKategori}"> ${escapeHtml(menu.kategori)} </span>
            </td>
            <td>${escapeHtml(menu.hargaText || menu.harga)}</td>
            <td>${favorit}</td>
            <td>
                <button type="button" class="btn btn-sm btn-success btn-detail" data-bs-toggle="modal" data-bs-target="#modalDetailMenu"
                    data-id_menu="${menu.id_menu}"
                    data-nama="${escapeHtml(menu.nama)}"
                    data-path="${escapeHtml(menu.path ? (window.API_BASE || "") + menu.path : "")}">
                    Detail
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-sm btn-warning btn-edit" data-bs-toggle="modal" data-bs-target="#modalEditMenu"
                    data-id_menu="${menu.id_menu}"
                    data-nama="${escapeHtml(menu.nama)}"
                    data-kategori="${escapeHtml(menu.kategori)}"
                    data-harga="${menu.harga}"
                    data-star="${menu.star}"
                    data-deskripsi="${escapeHtml(menu.deskripsi)}">
                    Edit
                </button>
                <a href="${window.API_BASE}/api/menu/delete/${menu.id_menu}" class="btn btn-sm btn-danger" onclick="return confirm('Apakah mau menghapus data ini?')">Hapus</a>
            </td>
        </tr>`;
            })
            .join("");
    }

    async function cari() {
        const params = new URLSearchParams({
            q: input.value.trim(),
            kategori: filterKategori ? filterKategori.value : "",
        });

        try {
            const res = await fetch((window.API_BASE || "") + "/api/menu/search?" + params.toString(), {
                headers: { Accept: "application/json" },
            });
            const json = await res.json();
            console.log("hasil search:", json);

            if (!json.success) {
                tbody.innerHTML = `<tr><td colspan="6">${json.message || "Gagal mencari"}</td></tr>`;
                return;
            }
            renderRows(json.data || []);
        } catch (err) {
            console.error("search error:", err);
            tbody.innerHTML = `<tr><td colspan="6">Gagal memuat hasil pencarian. Cek /menu/search di Network.</td></tr>`;
        }
    }

    input.addEventListener("input", function () {
        clearTimeout(timer);
        timer = setTimeout(cari, 300);
    });

    if (filterKategori) {
        filterKategori.addEventListener("change", cari);
    }

    cari();
})();