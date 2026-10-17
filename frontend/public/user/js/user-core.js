(function (global) {
    const CATEGORY_ICONS = {
        All: "grid",
        Makanan: "burger",
        Minuman: "drink",
        Salads: "salad",
        Burgers: "burger",
        Tacos: "taco",
        Sushi: "sushi",
        Drinks: "drink",
    };

    const iconPaths = {
        menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
        search: '<circle cx="10.8" cy="10.8" r="6.3"/><path d="m16 16 4.2 4.2"/>',
        sliders: '<path d="M4 6h9M17 6h3M4 18h3M11 18h9"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="18" r="2"/>',
        grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
        salad: '<path d="M4 14.2c0-4.2 3.4-7.4 8-7.4s8 3.2 8 7.4H4Z"/><path d="M3.5 15h17l-1.4 4H4.9l-1.4-4Z"/>',
        burger: '<path d="M4 9.5c.3-3.2 3.5-5.2 8-5.2s7.7 2 8 5.2H4Z"/><path d="M4 11h16v2H4zM5 15h14l1.5 4H3.5L5 15Z"/>',
        taco: '<path d="M3.4 17.8c1.1-5.7 4.5-9.1 8.6-9.1s7.5 3.4 8.6 9.1H3.4Z"/>',
        sushi: '<path d="M4 10.5c0-2.2 3.6-4 8-4s8 1.8 8 4v7c0 1.1-3.6 2-8 2s-8-.9-8-2v-7Z"/>',
        drink: '<path d="M6 4h12l-1.2 16H7.2L6 4Z"/><path d="M7 9h10"/>',
        plus: '<path d="M12 5v14M5 12h14"/>',
        minus: '<path d="M5 12h14"/>',
        heart: '<path d="M20.5 8.7c0 5.1-8.5 10.1-8.5 10.1S3.5 13.8 3.5 8.7a4.4 4.4 0 0 1 8.5-1.6 4.4 4.4 0 0 1 8.5 1.6Z"/>',
        leaf: '<path d="M19.5 4.5C10 4.7 5 8.3 5 14.3a5 5 0 0 0 5 5.2c6.1 0 9.5-6.4 9.5-15Z"/>',
        meat: '<path d="M7.3 5.1c2.4-1.5 6.1-.6 8.8 2.1 2.7 2.7 3.6 6.4 2.1 8.8-1.5 2.5-4.4 3.6-7 2.2-1.3-.7-2.7-.5-3.8.2-1.7 1-3.8.7-5-.6-1.2-1.2-1.5-3.3-.5-5 .7-1.1.9-2.5.2-3.8-1.4-2.6-.3-5.5 2.2-7Z"/>',
        bag: '<path d="M5 8h14l1 12H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
        cash: '<rect x="3" y="6" width="18" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.6"/>',
        card: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/>',
        qr: '<rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/>',
    };

    const state = {
        activeCategory: "All",
        query: "",
        sort: "popular",
        vegetarianOnly: false,
        cart: {},
        mode: "dine",
        payment: "cash",
        idMeja: "",
        nama: "",
        noHp: "",
        catatan: "",
        buktiFile: null,
        favorites: new Set(),
    };

    let products = [];
    let mejas = [];
    let categoryConfig = [{ id: "All", label: "Semua", icon: "grid" }];
    let toastTimer;

    function icon(name, className, strokeWidth) {
        className = className || "h-5 w-5";
        strokeWidth = strokeWidth || 1.8;
        return (
            '<svg class="' +
            className +
            '" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' +
            strokeWidth +
            '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            (iconPaths[name] || "") +
            "</svg>"
        );
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Number(value) || 0);
    }

    function placeholderImage(name) {
        const label = String(name || "Menu")
            .slice(0, 18)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        return (
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#eef2ee" width="400" height="300"/><text x="200" y="158" text-anchor="middle" fill="#7d8780" font-size="18" font-family="Inter,sans-serif">' +
                label +
                "</text></svg>"
            )
        );
    }

    function mapMenuItem(item) {
        const category = item.kategori || "Lainnya";
        const active = String(item.is_active || "ada").toLowerCase();
        if (active && active !== "ada") return null;
        const path = item.path || "";
        return {
            id: String(item.id_menu),
            name: item.nama || "Menu",
            detail: item.deskripsi || category,
            category: category,
            price: Number(item.harga) || 0,
            image: path || placeholderImage(item.nama),
            alt: item.nama || "Foto menu",
            vegetarian: false,
            badge: Number(item.star) === 1 ? "Favorit" : "",
            popularity: Number(item.star) === 1 ? 1 : 9,
        };
    }

    function buildCategories() {
        const names = [];
        products.forEach(function (p) {
            if (p.category && names.indexOf(p.category) === -1) names.push(p.category);
        });
        categoryConfig = [{ id: "All", label: "Semua", icon: "grid" }].concat(
            names.map(function (name) {
                return { id: name, label: name, icon: CATEGORY_ICONS[name] || "grid" };
            })
        );
    }

    async function loadMenus() {
        try {
            const res = await fetch("/api/menu", { headers: { Accept: "application/json" } });
            const json = await res.json();
            const rows = json.data || json || [];
            products = rows.map(mapMenuItem).filter(Boolean);
        } catch (err) {
            console.error("Gagal memuat menu:", err);
            products = [];
        }
        buildCategories();
        try {
            const resM = await fetch("/api/meja", { headers: { Accept: "application/json" } });
            const jsonM = await resM.json();
            mejas = jsonM.data || jsonM || [];
            if (!state.idMeja && mejas[0]) state.idMeja = String(mejas[0].id_meja);
        } catch (err) {
            mejas = [];
        }
    }

    async function checkout() {
        const items = Object.entries(state.cart)
            .map(function (entry) {
                return { id_menu: entry[0], qty: entry[1] };
            })
            .filter(function (it) {
                return it.qty > 0;
            });
        if (!items.length) throw new Error("Keranjang kosong");
        if (state.mode === "dine" && !state.idMeja) throw new Error("Pilih meja");
        if (state.payment === "qris" && !state.buktiFile) throw new Error("Unggah bukti QRIS");

        const fd = new FormData();
        fd.append("tipe", state.mode === "takeaway" ? "takeaway" : "dine_in");
        fd.append("id_meja", state.mode === "takeaway" ? "-" : String(state.idMeja));
        fd.append("nama", state.nama || "");
        fd.append("no_hp", state.noHp || "");
        fd.append("pay", state.payment === "qris" ? "Qris" : "Cash");
        fd.append("catatan", state.catatan || "");
        fd.append("items", JSON.stringify(items));
        if (state.payment === "qris" && state.buktiFile) fd.append("bukti", state.buktiFile);

        const res = await fetch("/api/pesanan/add", {
            method: "POST",
            headers: { Accept: "application/json" },
            body: fd,
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Gagal checkout");
        return json.data;
    }

    function getProduct(id) {
        return products.find(function (p) {
            return p.id === id;
        });
    }

    function getCartCount() {
        return Object.values(state.cart).reduce(function (t, q) {
            return t + q;
        }, 0);
    }

    function getCartSubtotal() {
        return Object.entries(state.cart).reduce(function (total, entry) {
            const product = getProduct(entry[0]);
            return total + (product ? product.price * entry[1] : 0);
        }, 0);
    }

    function showToast(message) {
        const toast = document.querySelector("#toast");
        if (!toast) return;
        toast.querySelector("[data-toast-message]").textContent = message;
        toast.classList.add("is-visible");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(function () {
            toast.classList.remove("is-visible");
        }, 2600);
    }

    function changeQuantity(id, delta) {
        const next = (state.cart[id] || 0) + delta;
        if (next <= 0) delete state.cart[id];
        else state.cart[id] = next;
        if (global.UserPage.renderMenu) global.UserPage.renderMenu();
        if (global.UserPage.renderCart) global.UserPage.renderCart();
    }

    function renderAll() {
        if (global.UserPage.renderMenu) global.UserPage.renderMenu();
        if (global.UserPage.renderCart) global.UserPage.renderCart();
    }

    global.UserPage = {
        state: state,
        get products() {
            return products;
        },
        get mejas() {
            return mejas;
        },
        checkout: checkout,
        get categoryConfig() {
            return categoryConfig;
        },
        icon: icon,
        formatCurrency: formatCurrency,
        loadMenus: loadMenus,
        getProduct: getProduct,
        getCartCount: getCartCount,
        getCartSubtotal: getCartSubtotal,
        showToast: showToast,
        changeQuantity: changeQuantity,
        renderAll: renderAll,
    };
})(window);
