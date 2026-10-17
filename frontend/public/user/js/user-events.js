(function () {
    const U = window.UserPage;

    document.addEventListener("click", function (event) {
        const categoryButton = event.target.closest("[data-category]");
        if (categoryButton) {
            U.state.activeCategory = categoryButton.dataset.category;
            U.renderMenu();
            return;
        }

        const button = event.target.closest("[data-action]");
        if (!button) return;

        const productId = button.dataset.productId;
        const value = button.dataset.value;

        switch (button.dataset.action) {
            case "jump-categories":
                document.querySelector("#category-section").scrollIntoView({ behavior: "smooth", block: "start" });
                break;
            case "reset-category":
                U.state.activeCategory = "All";
                U.renderMenu();
                break;
            case "toggle-filter": {
                const popover = document.querySelector("#filter-popover");
                const isOpen = !popover.classList.contains("hidden");
                popover.classList.toggle("hidden", isOpen);
                button.setAttribute("aria-expanded", String(!isOpen));
                break;
            }
            case "add":
            case "increase":
                U.changeQuantity(productId, 1);
                break;
            case "decrease":
                U.changeQuantity(productId, -1);
                break;
            case "favorite":
                if (U.state.favorites.has(productId)) U.state.favorites.delete(productId);
                else U.state.favorites.add(productId);
                U.renderMenu();
                break;
            case "set-mode":
                U.state.mode = value;
                U.renderCart();
                break;
            case "set-payment":
                U.state.payment = value;
                U.renderCart();
                break;
            case "toggle-table-picker":
                document.querySelector("#table-picker").classList.toggle("hidden");
                break;
            case "select-table":
                U.state.idMeja = String(value);
                U.renderCart();
                break;
            case "clear-order":
                U.state.cart = {};
                U.renderAll();
                U.showToast("Your basket has been cleared");
                break;
            case "place-order":
                if (U.getCartCount() === 0) return;
                button.disabled = true;
                U.checkout()
                    .then(function (data) {
                        U.state.cart = {};
                        U.state.buktiFile = null;
                        const bukti = document.querySelector("#bukti-qris");
                        if (bukti) bukti.value = "";
                        U.renderAll();
                        U.showToast("Pesanan " + (data && data.kode_pesanan ? data.kode_pesanan : "") + " terkirim");
                    })
                    .catch(function (err) {
                        U.showToast(err.message || "Gagal checkout");
                    })
                    .then(function () {
                        button.disabled = U.getCartCount() === 0;
                    });
                break;
            case "scroll-to-order": {
                const panel = document.querySelector("#order-panel");
                if (!panel) break;
                const top = panel.getBoundingClientRect().top + window.pageYOffset - 12;
                window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                break;
            }
            default:
                break;
        }
    });

    document.addEventListener("input", function (event) {
        if (event.target.id === "product-search") {
            U.state.query = event.target.value;
            U.renderMenu();
        }
        if (event.target.id === "vegetarian-only") {
            U.state.vegetarianOnly = event.target.checked;
            U.renderMenu();
        }
        if (event.target.id === "guest-nama") {
            U.state.nama = event.target.value;
            const g = document.querySelector("#guest-name");
            if (g) g.textContent = U.state.nama || "Tamu";
        }
        if (event.target.id === "guest-hp") U.state.noHp = event.target.value;
        if (event.target.id === "guest-catatan") U.state.catatan = event.target.value;
    });

    document.addEventListener("change", function (event) {
        if (event.target.id === "sort-select") {
            U.state.sort = event.target.value;
            U.renderMenu();
        }
        if (event.target.id === "bukti-qris") {
            U.state.buktiFile = event.target.files && event.target.files[0] ? event.target.files[0] : null;
        }
    });

    document.addEventListener("click", function (event) {
        const filterWrap = document.querySelector(".filter-wrap");
        const filterPopover = document.querySelector("#filter-popover");
        if (filterWrap && !filterWrap.contains(event.target) && !filterPopover.classList.contains("hidden")) {
            filterPopover.classList.add("hidden");
            document.querySelector("#filter-toggle").setAttribute("aria-expanded", "false");
        }
        const tableWrap = document.querySelector(".table-edit-wrap");
        const tablePicker = document.querySelector("#table-picker");
        if (tableWrap && !tableWrap.contains(event.target) && !tablePicker.classList.contains("hidden")) {
            tablePicker.classList.add("hidden");
        }
    });

    document.addEventListener("keydown", function (event) {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
            event.preventDefault();
            document.querySelector("#product-search").focus();
        }
        if (event.key === "Escape") {
            document.querySelector("#filter-popover").classList.add("hidden");
            document.querySelector("#table-picker").classList.add("hidden");
        }
    });

    U.loadMenus().then(function () {
        U.renderAll();
    });
})();
