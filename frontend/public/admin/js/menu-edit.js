(function () {
    const modalEdit = document.getElementById("modalEditMenu");
    const modalDetail = document.getElementById("modalDetailMenu");

    document.addEventListener("click", function (e) {
        const btnEdit = e.target.closest(".btn-edit");
        
        if (btnEdit && btnEdit.dataset.id_menu && modalEdit) {
            isiFormEdit(btnEdit.dataset);
        }

        const btnDetail = e.target.closest(".btn-detail");
        // console.log(btnDetail)
        if (btnDetail && modalDetail) {
            isiFotoDetail(btnDetail.dataset);
        }
    });

    function isiFormEdit(d) {
        const form = modalEdit.querySelector("form");
        if (form) form.action = (window.API_BASE || "") + "/api/menu/edit/" + d.id_menu;

        const setVal = (name, value) => {
            const el = modalEdit.querySelector('[name="' + name + '"]');
            if (el) el.value = value ?? "";
        };


        setVal("id", d.id_menu);
        setVal("id_menu", d.id_menu);
        setVal("oldNama", d.nama);
        setVal("nama", d.nama);
        setVal("kategori", d.kategori);
        setVal("harga", d.harga);
        setVal("stok", d.stok);
        setVal("star", d.star);
        setVal("deskripsi", d.deskripsi);
    }

    function isiFotoDetail(d) {
        const img = modalDetail.querySelector("#foto-detail-menu");
        const judul = modalDetail.querySelector("#nama-detail-menu");
        const deskripsi = modalDetail.querySelector("#deskripsi-detail-menu");
        const path = d.path;
        // console.log(img)

        if (judul) judul.textContent = 'Nama Menu : ' + d.nama || "";
        if (deskripsi) deskripsi.textContent = d.deskripsi || "";

        if (!img) return;

        if (path) {
            img.src = path;
            img.alt = d.nama || "Foto menu";
            img.style.display = "";
        } else {
            img.removeAttribute("src");
            img.alt = "Tidak ada foto";
            img.style.display = "none";
        }
    }
})();
