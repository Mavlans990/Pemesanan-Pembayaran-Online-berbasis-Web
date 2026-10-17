(function () {
    const U = window.UserPage;

    function renderModeOptions() {
        const modes = [
            { id: "dine", label: "Dine in" },
            { id: "takeaway", label: "Take away" },
        ];
        const el = document.querySelector("#order-mode");
        if (!el) return;
        el.innerHTML = modes
            .map(function (mode) {
                return (
                    '<button type="button" data-action="set-mode" data-value="' +
                    mode.id +
                    '" class="' +
                    (U.state.mode === mode.id ? "is-active" : "") +
                    '" aria-pressed="' +
                    (U.state.mode === mode.id) +
                    '">' +
                    mode.label +
                    "</button>"
                );
            })
            .join("");
    }

    function renderTablePicker() {
        const picker = document.querySelector("#table-picker");
        if (!picker) return;
        const list = U.mejas || [];
        let buttons = "";
        list.forEach(function (meja) {
            const id = String(meja.id_meja);
            const active = String(U.state.idMeja) === id;
            buttons +=
                '<button type="button" data-action="select-table" data-value="' +
                id +
                '" class="grid h-8 place-items-center rounded-lg border text-[10px] font-bold ' +
                (active
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-[#e8ede8] bg-white text-[#657168]") +
                '">' +
                String(meja.nama_meja || id) +
                "</button>";
        });
        picker.innerHTML =
            '<div class="mb-2 flex items-center justify-between"><span class="text-[10px] font-bold text-[#36443a]">Pilih meja</span></div><div class="grid grid-cols-2 gap-1.5">' +
            (buttons || "<span class=\"text-[10px] text-muted\">Tidak ada meja</span>") +
            "</div>";
    }

    function renderCartItems() {
        const items = Object.entries(U.state.cart)
            .map(function (entry) {
                return { product: U.getProduct(entry[0]), quantity: entry[1] };
            })
            .filter(function (entry) {
                return entry.product && entry.quantity > 0;
            });
        const container = document.querySelector("#cart-items");
        const clearButton = document.querySelector("#clear-order");
        document.querySelector("#item-count-badge").textContent = String(U.getCartCount());
        clearButton.disabled = items.length === 0;
        clearButton.classList.toggle("opacity-40", items.length === 0);

        if (items.length === 0) {
            container.innerHTML =
                '<div class="cart-empty"><div>' +
                U.icon("bag", "h-4 w-4") +
                '<p class="m-0 font-semibold text-[#5c685f]">Your basket is looking fresh.</p><p class="mb-0 mt-1 text-[9px]">Add a dish to get started.</p></div></div>';
            return;
        }

        container.innerHTML = items
            .map(function (entry) {
                const product = entry.product;
                const quantity = entry.quantity;
                return (
                    '<article class="cart-item"><img class="cart-item-image" src="' +
                    product.image +
                    '" alt="" loading="lazy" /><div class="cart-item-body"><div class="cart-item-top"><h3 class="cart-item-name">' +
                    product.name +
                    '</h3><span class="cart-item-total">' +
                    U.formatCurrency(product.price * quantity) +
                    '</span></div><div class="cart-item-bottom"><span class="cart-item-unit">' +
                    U.formatCurrency(product.price) +
                    ' each</span><div class="cart-quantity"><button type="button" data-action="decrease" data-product-id="' +
                    product.id +
                    '">' +
                    U.icon("minus", "h-2.5 w-2.5", 2.2) +
                    "</button><span>" +
                    quantity +
                    '</span><button type="button" data-action="increase" data-product-id="' +
                    product.id +
                    '">' +
                    U.icon("plus", "h-2.5 w-2.5", 2.2) +
                    "</button></div></div></div></article>"
                );
            })
            .join("");
    }

    function renderTotals() {
        const subtotal = U.getCartSubtotal();
        document.querySelector("#cart-totals").innerHTML =
            '<div class="totals-card"><div class="total-row grand"><span>Total</span><strong>' +
            U.formatCurrency(subtotal) +
            "</strong></div></div>";
    }

    function renderPaymentOptions() {
        const options = [
            { id: "cash", label: "Cash", icon: "cash" },
            { id: "qris", label: "QRIS", icon: "qr" },
        ];
        document.querySelector("#payment-options").innerHTML = options
            .map(function (option) {
                return (
                    '<button type="button" class="payment-option ' +
                    (U.state.payment === option.id ? "is-active" : "") +
                    '" data-action="set-payment" data-value="' +
                    option.id +
                    '">' +
                    U.icon(option.icon, "h-[20px] w-[20px]") +
                    "<span>" +
                    option.label +
                    "</span></button>"
                );
            })
            .join("");
    }

    function renderMobileOrderBar() {
        const count = U.getCartCount();
        const total = U.getCartSubtotal();
        document.querySelector("#mobile-order-count").textContent =
            count + (count === 1 ? " item" : " items") + " in your basket";
        document.querySelector("#mobile-order-total").textContent = U.formatCurrency(total);
        document.querySelector("#mobile-order-button").disabled = count === 0;
    }

    U.renderCart = function () {
        const dine = U.state.mode !== "takeaway";
        const meja = (U.mejas || []).find(function (m) {
            return String(m.id_meja) === String(U.state.idMeja);
        });
        document.querySelector("#table-title").textContent = dine
            ? meja
                ? meja.nama_meja
                : "Pilih meja"
            : "Take away";
        const guest = document.querySelector("#guest-name");
        if (guest) guest.textContent = U.state.nama || "Tamu";
        const tableWrap = document.querySelector(".table-edit-wrap");
        if (tableWrap) tableWrap.classList.toggle("hidden", !dine);
        const qrisBox = document.querySelector("#qris-box");
        if (qrisBox) qrisBox.classList.toggle("hidden", U.state.payment !== "qris");
        renderModeOptions();
        renderTablePicker();
        renderCartItems();
        renderTotals();
        renderPaymentOptions();
        renderMobileOrderBar();
        document.querySelector("#place-order").disabled = U.getCartCount() === 0;
    };
})();
