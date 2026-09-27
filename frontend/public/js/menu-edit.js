(function () {
    const modal = document.getElementById("modalEditMenu");
    if (!modal) return;

    document.addEventListener("click", function (e) {
        const btn = e.target.closest(".btn-edit");
        if (!btn || !btn.dataset.id_menu) return;

        const d = btn.dataset;
        const form = modal.querySelector("form");
        if (form) form.action = "/menu/edit/" + d.id_menu;

        const setVal = (name, value) => {
            const el = modal.querySelector('[name="' + name + '"]');
            if (el) el.value = value ?? "";
        };

        setVal("id", d.id_menu);
        setVal("id_menu", d.id_menu);
        setVal("oldNama", d.nama);
        setVal("nama", d.nama);
        setVal("kategori", d.kategori);
        setVal("harga", d.harga);
        setVal("star", d.star);
        setVal("deskripsi", d.deskripsi);
    });
})();
