(function () {
    const input = document.getElementById("cari-pesanan");
    const tbody = document.getElementById("pesanan-tbody");
    const modalEl = document.getElementById("modalKonfirmasiStatus");
    if (!input || !tbody) return;

    let timer = null;
    let pending = null;
    let confirmed = false;

    function escapeHtml(text) {
        return String(text ?? "")
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function labelTipe(tipe) {
        const t = String(tipe || "").toLowerCase();
        if (t === "takeaway") {
            return `<span class="badge text-bg-dark">Take Away</span>`;
        }
        return `<span class="badge text-bg-primary">Dine In</span>`;
    }

    function radioStatus(id, status) {
        const cur = String(status || "pending").toLowerCase();
        const items = [
            { value: "pending", label: "Pending", cls: "btn-outline-warning" },
            { value: "dibayar", label: "Dibayar", cls: "btn-outline-primary" },
            { value: "diproses", label: "Diproses", cls: "btn-outline-info" },
            { value: "selesai", label: "Selesai", cls: "btn-outline-success" },
        ];
        return `
            <div class="btn-group btn-group-sm status-group" role="group" data-id="${id}" data-status="${cur}">
                ${items
                        .map(
                            (item) => `
                <input type="radio" class="btn-check radio-status" name="status-${id}"
                    id="status-${id}-${item.value}" value="${item.value}"
                    data-id_pesanan="${id}" autocomplete="off"
                    ${cur === item.value ? "checked" : ""}>
                <label class="btn ${item.cls}" for="status-${id}-${item.value}">${item.label}</label>
                `
                )
                .join("")}
            </div>`;
    }

    function renderRows(rows) {
        if (!rows.length) {
            tbody.innerHTML = `<tr><td colspan="6">Pesanan tidak ditemukan.</td></tr>`;
            return;
        }

        tbody.innerHTML = rows
            .map((p, index) => {
                const kode = p.kode_pesanan;
                const meja = (p.tipe === "dine_in" ? p.nama_meja : "-");
                return `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <button type="button" class="btn btn-light btn-detail" data-bs-toggle="modal" data-bs-target="#modalDetailPesanan"
                            data-kode_pesanan="${escapeHtml(kode)}">
                            <strong>${escapeHtml(kode)}</strong>
                        </button>
                    </td>
                    <td>${labelTipe(p.tipe)}</td>
                    <td><strong>${escapeHtml(meja)}</strong></td>
                    <td>${radioStatus(p.id_pesanan, p.status)}</td>
                    <td>${escapeHtml(p.totalText || p.total)}</td>
                    <td>
                        <a href="${window.API_BASE || ""}/api/pesanan/delete/${p.id_pesanan}" class="btn btn-sm btn-danger" 
                            onclick="return confirm('Hapus pesanan ${escapeHtml(kode)} beserta detailnya?')">Hapus</a>
                    </td>
                </tr>`;
                })
                .join("");
    }

    async function cari() {
        const q = encodeURIComponent(input.value.trim());
        try {
            const res = await fetch((window.API_BASE || "") + "/api/pesanan/search?q=" + q, {
                headers: { Accept: "application/json" },
            });
            const json = await res.json();
            if (!json.success) {
                tbody.innerHTML = `<tr><td colspan="6">${json.message || "Gagal mencari"}</td></tr>`;
                return;
            }
            renderRows(json.data || []);
        } catch (err) {
            console.error(err);
            tbody.innerHTML = `<tr><td colspan="6">Gagal memuat hasil pencarian.</td></tr>`;
        }
    }

    // fungsi update status pakai radio
    function setChecked(group, status) {
        const radio = group.querySelector('.radio-status[value="' + status + '"]');
        if (radio) radio.checked = true;
    }

    tbody.addEventListener("change", function (e) {
        const radio = e.target.closest(".radio-status");
        if (!radio) return;

        const group = radio.closest(".status-group");
        const prev = group.dataset.status;
        const next = radio.value;
        if (prev === next) return;

        confirmed = false;
        pending = { group, prev, next, id: radio.dataset.id_pesanan };
        const teks = document.getElementById("teks-konfirmasi-status");
        if (teks) {
            const nama = { pending: "Pending", dibayar: "Dibayar", diproses: "Diproses", selesai: "Selesai" };
            teks.textContent = "Ubah status menjadi " + (nama[next] || next) + "?";
        }

        if (window.bootstrap && modalEl) {
            window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
        } else if (confirm("Ubah status pesanan?")) {
            simpanStatus();
        } else {
            setChecked(group, prev);
            pending = null;
        }
    });

    async function simpanStatus() {
        if (!pending) return;
        const { group, prev, next, id } = pending;
        try {
            const res = await fetch((window.API_BASE || "") + "/api/pesanan/status/" + id, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ status: next }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message);
            group.dataset.status = json.status || next;
            console.log(id)
        } catch (err) {
            console.error(err);
            setChecked(group, prev);
            alert("Gagal mengubah status pesanan");
        } finally {
            pending = null;
        }
    }

    function batalStatus() {
        if (!pending) return;
        setChecked(pending.group, pending.prev);
        pending = null;
    }

    const btnYa = document.getElementById("btn-status-ya");
    if (btnYa) {
        btnYa.addEventListener("click", function () {
            confirmed = true;
            simpanStatus();
        });
    }
    if (modalEl) {
        modalEl.addEventListener("hidden.bs.modal", function () {
            if (pending && !confirmed) batalStatus();
        });
    }

    // input search
    input.addEventListener("input", function () {
        clearTimeout(timer);
        timer = setTimeout(cari, 300);
    });

    cari();
})();
