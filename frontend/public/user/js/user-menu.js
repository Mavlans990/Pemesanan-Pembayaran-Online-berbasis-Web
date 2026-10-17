(function () {
    const U = window.UserPage;

    function renderCategories() {
        const container = document.querySelector("#category-list");
        if (!container) return;
        const products = U.products;
        container.innerHTML = U.categoryConfig
            .map(function (category, index) {
                const count =
                    category.id === "All"
                        ? products.length
                        : products.filter(function (p) {
                            return p.category === category.id;
                        }).length;
                const activeClass = U.state.activeCategory === category.id ? "is-active" : "";
                const countLabel = count === 1 ? "1 dish" : count + " dishes";
                const enter = U.state.enterAnim
                    ? ' animate-slide-in-up" style="animation-delay:' + (120 + index * 70) + 'ms"'
                    : '"';
                return (
                    '<button type="button" class="category-tile ' +
                    activeClass +
                    enter +
                    " data-category=\"" +
                    category.id +
                    '" aria-pressed="' +
                    (U.state.activeCategory === category.id) +
                    '">' +
                    '<span class="category-icon">' +
                    U.icon(category.icon, "h-[25px] w-[25px]", 1.7) +
                    "</span>" +
                    "<span><span class=\"category-label\">" +
                    category.label +
                    '</span><span class="category-count">' +
                    countLabel +
                    "</span></span></button>"
                );
            })
            .join("");
    }

    function renderProductCard(product, index) {
        const quantity = U.state.cart[product.id] || 0;
        const isFavorite = U.state.favorites.has(product.id);
        const badge = product.badge ? '<span class="product-badge">' + product.badge + "</span>" : "";
        // const dietIcon = product.vegetarian ? U.icon("leaf", "h-3 w-3") : U.icon("meat", "h-3 w-3");
        // const dietText = product.vegetarian ? "Veg" : "Non Veg";
        const cartControl =
            quantity > 0
                ? '<div class="quantity-control">' +
                '<button type="button" data-action="decrease" data-product-id="' +
                product.id +
                '">' +
                U.icon("minus", "h-3 w-3", 2.3) +
                "</button><span>" +
                quantity +
                '</span><button type="button" data-action="increase" data-product-id="' +
                product.id +
                '">' +
                U.icon("plus", "h-3 w-3", 2.3) +
                "</button></div>"
                : '<button type="button" class="add-button" data-action="add" data-product-id="' +
                product.id +
                '">' +
                U.icon("plus", "h-3.5 w-3.5", 2.2) +
                "<span>Add to dish</span></button>";

        const enter = U.state.animProducts
            ? " animate-slide-in-up"
            : "";
        const delay = U.state.animProducts
            ? ' style="animation-delay:' + Math.min(index, 12) * 70 + 'ms"'
            : "";
        return (
            '<article class="product-card ' +
            (quantity > 0 ? "is-in-cart" : "") +
            enter +
            '"' +
            delay +
            ">" +
            '<div class="product-image-wrap">' +
            '<img class="product-image" src="' +
            product.image +
            '" alt="' +
            product.alt +
            '" loading="lazy" />' +
            badge +
            // '<button type="button" class="favorite-button ' +
            // (isFavorite ? "is-favorite" : "") +
            // '" data-action="favorite" data-product-id="' +
            // product.id +
            // '" aria-pressed="' +
            // isFavorite +
            // '">' +
            U.icon("heart", "h-4 w-4", isFavorite ? 2.5 : 1.8) +
            "</button></div>" +
            '<h3 class="product-name">' +
            product.name +
            "</h3>" +
            '<p class="product-detail">' +
            product.detail +
            "</p>" +
            '<div class="product-meta"><span class="product-price">' +
            U.formatCurrency(product.price) +
            // '</span><span class="diet-tag">' +
            // dietIcon +
            // "<span>" +
            // dietText +
            "</span></span></div>" +
            cartControl +
            "</article>"
        );
    }

    function getVisibleProducts() {
        const query = U.state.query.trim().toLowerCase();
        let visible = U.products.filter(function (product) {
            const matchesCategory =
                U.state.activeCategory === "All" || product.category === U.state.activeCategory;
            const matchesQuery =
                !query ||
                (product.name).toLowerCase().indexOf(query) !== -1;
            // const matchesDiet = !U.state.vegetarianOnly || product.vegetarian;
            return matchesCategory && matchesQuery;
        });

        if (U.state.sort === "price-low") {
            visible = visible.slice().sort(function (a, b) {
                return a.price - b.price;
            });
        } else if (U.state.sort === "price-high") {
            visible = visible.slice().sort(function (a, b) {
                return b.price - a.price;
            });
        } else {
            visible = visible.slice().sort(function (a, b) {
                return a.popularity - b.popularity;
            });
        }
        return visible;
    }

    function renderProducts() {
        const visible = getVisibleProducts();
        const heading = document.querySelector("#products-heading");
        const summary = document.querySelector("#results-summary");
        const count = document.querySelector("#result-count");
        const grid = document.querySelector("#product-grid");
        if (!grid) return;

        heading.textContent =
            U.state.activeCategory === "All" ? "Popular picks" : U.state.activeCategory + " favorites";
        if (U.state.query.trim()) {
            summary.textContent = 'Results for “' + U.state.query.trim() + "”";
        } else if (U.state.activeCategory === "All") {
            summary.textContent = "A few guest favorites to get you started";
        } else {
            summary.textContent = "Fresh picks from our " + U.state.activeCategory.toLowerCase() + " menu";
        }
        count.textContent = visible.length + (visible.length === 1 ? " item" : " items");

        if (visible.length === 0) {
            grid.innerHTML =
                '<div class="empty-menu"><p class="m-0 text-[12px] font-bold text-[#435148]">No dishes found</p><p class="mb-0 mt-1 text-[10px]">Try another search or choose a different category.</p></div>';
            return;
        }
        grid.innerHTML = visible.map(renderProductCard).join("");
    }

    U.renderMenu = function () {
        renderCategories();
        renderProducts();
    };
    U.renderCategories = renderCategories;
    U.renderProducts = renderProducts;
})();
