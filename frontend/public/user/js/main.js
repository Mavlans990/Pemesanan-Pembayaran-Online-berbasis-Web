import './style.css';

const products = [
  {
    id: 'salad',
    name: 'Tasty Vegetable Salad',
    detail: 'Avocado · cherry tomato · lemon',
    category: 'Salads',
    price: 17.99,
    image: '/images/salad.jpg',
    alt: 'Fresh garden salad with greens, tomatoes and olives',
    vegetarian: true,
    badge: 'Chef’s pick',
    popularity: 6
  },
  {
    id: 'burger-chips',
    name: 'Original Cheeseburger With Chips',
    detail: 'Angus beef · aged cheddar',
    category: 'Burgers',
    price: 23.99,
    image: '/images/burger.jpg',
    alt: 'Classic cheeseburger with lettuce, tomato and melted cheddar',
    vegetarian: false,
    badge: 'Best seller',
    popularity: 1
  },
  {
    id: 'tacos',
    name: 'Tacos Salsa With Chicken',
    detail: 'Grilled chicken · house salsa',
    category: 'Tacos',
    price: 14.99,
    image: '/images/tacos.jpg',
    alt: 'Grilled chicken tacos with salsa and fresh herbs',
    vegetarian: false,
    badge: '',
    popularity: 2
  },
  {
    id: 'sushi',
    name: 'Tuna & Salmon Maki',
    detail: 'Salmon · tuna · avocado',
    category: 'Sushi',
    price: 9.99,
    image: '/images/sushi.jpg',
    alt: 'Fresh salmon sushi rolls arranged on a platter',
    vegetarian: false,
    badge: 'Fresh',
    popularity: 4
  },
  {
    id: 'orange-juice',
    name: 'Fresh Orange Juice With Basil Seed',
    detail: 'Cold-pressed · no added sugar',
    category: 'Drinks',
    price: 12.99,
    image: '/images/orange-juice.jpg',
    alt: 'A glass of fresh orange juice with a slice of orange',
    vegetarian: true,
    badge: '',
    popularity: 3
  },
  {
    id: 'burger-fries',
    name: 'Original Cheeseburger With Fries',
    detail: 'Double patty · crispy fries',
    category: 'Burgers',
    price: 10.59,
    image: '/images/burger-fries.jpg',
    alt: 'Cheeseburger served with golden french fries',
    vegetarian: false,
    badge: '20% off',
    popularity: 5
  }
];

const categoryConfig = [
  { id: 'All', label: 'All', icon: 'grid' },
  { id: 'Salads', label: 'Salads', icon: 'salad' },
  { id: 'Burgers', label: 'Burgers', icon: 'burger' },
  { id: 'Tacos', label: 'Tacos', icon: 'taco' },
  { id: 'Sushi', label: 'Sushi', icon: 'sushi' },
  { id: 'Drinks', label: 'Drinks', icon: 'drink' }
];

const iconPaths = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.3"/><path d="m16 16 4.2 4.2"/>',
  sliders: '<path d="M4 6h9M17 6h3M4 18h3M11 18h9"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="18" r="2"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
  salad: '<path d="M4 14.2c0-4.2 3.4-7.4 8-7.4s8 3.2 8 7.4H4Z"/><path d="M3.5 15h17l-1.4 4H4.9l-1.4-4Z"/><path d="M8.3 6.5c-.5-1.4.1-2.7 1.6-3.5M13.2 6c-.1-1.2.7-2.2 2.1-2.8M16.5 7c.2-1.1 1-1.8 2.2-2.1"/>',
  burger: '<path d="M4 9.5c.3-3.2 3.5-5.2 8-5.2s7.7 2 8 5.2H4Z"/><path d="M4 11h16v2H4zM5 15h14l1.5 4H3.5L5 15Z"/><path d="M8 8h.01M12 7h.01M16 8h.01"/>',
  taco: '<path d="M3.4 17.8c1.1-5.7 4.5-9.1 8.6-9.1s7.5 3.4 8.6 9.1H3.4Z"/><path d="m5.5 14 2.4 1.2 1.8-2 2.2 1.5 2-2 2.2 1.4 2.4-1.1"/><path d="M8 9.2 7 6.9M12 8.7V5.8M16 9.2l1.1-2.3"/>',
  sushi: '<path d="M4 10.5c0-2.2 3.6-4 8-4s8 1.8 8 4v7c0 1.1-3.6 2-8 2s-8-.9-8-2v-7Z"/><path d="M4 10.5c0 1.1 3.6 2 8 2s8-.9 8-2"/><path d="M8 8.2c.7-1.7 2-2.6 4-2.6s3.3.9 4 2.6"/><path d="M8 15.5h.01M12 16h.01M16 15.5h.01"/>',
  drink: '<path d="M6 4h12l-1.2 16H7.2L6 4Z"/><path d="M7 9h10M10 4l3-3M14 14h.01"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  heart: '<path d="M20.5 8.7c0 5.1-8.5 10.1-8.5 10.1S3.5 13.8 3.5 8.7a4.4 4.4 0 0 1 8.5-1.6 4.4 4.4 0 0 1 8.5 1.6Z"/>',
  leaf: '<path d="M19.5 4.5C10 4.7 5 8.3 5 14.3a5 5 0 0 0 5 5.2c6.1 0 9.5-6.4 9.5-15Z"/><path d="M4.5 20c2.8-4 6.2-6.9 10.5-9.2"/>',
  meat: '<path d="M7.3 5.1c2.4-1.5 6.1-.6 8.8 2.1 2.7 2.7 3.6 6.4 2.1 8.8-1.5 2.5-4.4 3.6-7 2.2-1.3-.7-2.7-.5-3.8.2-1.7 1-3.8.7-5-.6-1.2-1.2-1.5-3.3-.5-5 .7-1.1.9-2.5.2-3.8-1.4-2.6-.3-5.5 2.2-7Z"/><circle cx="13.6" cy="10.4" r="2.1"/>',
  edit: '<path d="m14.5 5.5 4 4M4 20l4.1-.8L19 8.3a2.1 2.1 0 0 0-3-3L5.1 16.2 4 20Z"/><path d="M12 20h8"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  cash: '<rect x="3" y="6" width="18" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9h.01M18 15h.01"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/>',
  qr: '<rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/><path d="M15 14h2v2h-2zM19 14v2M14 18h2v2M18 18h3v3h-3z"/>',
  check: '<path d="m5 12.5 4.2 4.2L19.5 6.8"/>',
  spark: '<path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.3 2"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  user: '<circle cx="12" cy="8" r="3.2"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  bag: '<path d="M5 8h14l1 12H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'
};

function icon(name, className = 'h-5 w-5', strokeWidth = 1.8) {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || ''}</svg>`;
}

const state = {
  activeCategory: 'All',
  query: '',
  sort: 'popular',
  vegetarianOnly: false,
  cart: {
    'burger-chips': 1,
    tacos: 1,
    sushi: 1,
    'orange-juice': 1
  },
  mode: 'dine',
  payment: 'qr',
  tableNo: 4,
  favorites: new Set()
};

const root = document.querySelector('#app');

root.innerHTML = `
  <div class="app-shell">
    <main class="menu-pane">
      <header class="menu-topbar">
        <button class="menu-toggle" type="button" data-action="jump-categories" aria-label="Jump to food categories" title="Browse categories">
          ${icon('menu', 'h-[19px] w-[19px]')}
        </button>
        <label class="search-shell" aria-label="Search menu">
          ${icon('search', 'h-[18px] w-[18px] shrink-0 text-[#526057]')}
          <input id="product-search" type="search" autocomplete="off" placeholder="Search product here..." />
          <kbd class="hidden rounded-md border border-[#edf0ed] px-1.5 py-0.5 text-[9px] font-medium text-[#9aa39c] sm:inline">⌘ K</kbd>
        </label>
        <div class="filter-wrap">
          <button id="filter-toggle" class="filter-toggle" type="button" data-action="toggle-filter" aria-label="Open menu filters" aria-expanded="false" title="Filter and sort">
            ${icon('sliders', 'h-[19px] w-[19px]')}
          </button>
          <div id="filter-popover" class="filter-popover hidden">
            <div class="mb-3 flex items-start justify-between gap-3">
              <div>
                <p class="m-0 text-[12px] font-bold text-ink">Refine menu</p>
                <p class="mb-0 mt-1 text-[10px] text-muted">A little easier to find your favorite.</p>
              </div>
              <span class="rounded-lg bg-brand-50 p-1.5 text-brand-600">${icon('sliders', 'h-4 w-4')}</span>
            </div>
            <label for="sort-select" class="mb-1.5 block text-[10px] font-semibold text-[#69756c]">Sort by</label>
            <select id="sort-select" class="w-full rounded-xl border border-[#e5ebe5] bg-white px-3 py-2 text-[11px] text-ink outline-none">
              <option value="popular">Recommended</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
            <label class="mt-3 flex cursor-pointer items-center gap-2 text-[11px] font-medium text-[#4d5a51]">
              <input id="vegetarian-only" type="checkbox" class="h-4 w-4 accent-[#09853b]" />
              Vegetarian options only
            </label>
          </div>
        </div>
      </header>

      <div class="menu-content">
        <section class="menu-intro" aria-labelledby="welcome-heading">
          <div>
            <p class="eyebrow">THE GOOD FOOD EDIT</p>
            <h1 id="welcome-heading">Order something delicious</h1>
            <p class="subcopy">Freshly prepared favorites, picked just for your table.</p>
          </div>
          <div class="kitchen-status" aria-label="Kitchen is open">
            <span class="status-dot"></span>
            <div>
              <p class="m-0 text-[10px] font-bold text-[#3b4c40]">Kitchen is open</p>
              <p class="m-0 mt-1 text-[9px] text-[#89938c]">About 15–20 min</p>
            </div>
          </div>
        </section>

        <section id="category-section" class="category-section" aria-labelledby="category-heading">
          <div class="section-head">
            <div>
              <h2 id="category-heading">Browse categories</h2>
              <p>Find the right bite for the moment</p>
            </div>
            <button type="button" data-action="reset-category" class="hidden items-center gap-1 border-0 bg-transparent text-[10px] font-semibold text-brand-600 sm:inline-flex">
              View all ${icon('chevron', 'h-3 w-3')}
            </button>
          </div>
          <div id="category-list" class="category-track" role="group" aria-label="Food categories"></div>
        </section>

        <section class="product-section" aria-labelledby="products-heading">
          <div class="section-head">
            <div>
              <h2 id="products-heading">Popular picks</h2>
              <p id="results-summary">A few guest favorites to get you started</p>
            </div>
            <span id="result-count" class="rounded-full border border-[#e4e9e4] bg-white px-2.5 py-1 text-[9px] font-semibold text-[#748078]"></span>
          </div>
          <div id="product-grid" class="product-grid" aria-live="polite"></div>
        </section>

        <section class="team-strip" aria-label="Dining room team">
          <div class="team-strip-title">
            <p>On the floor</p>
            <p>Ready to help</p>
          </div>
          <div class="team-members">
            <div class="team-pill">
              <span class="team-avatar">T1</span>
              <div class="min-w-0"><div class="team-name">Jacob Jones</div><div class="team-role">6 tables · Kitchen</div></div>
            </div>
            <div class="team-pill">
              <span class="team-avatar">T2</span>
              <div class="min-w-0"><div class="team-name">Bessie Cooper</div><div class="team-role">6 tables · Kitchen</div></div>
            </div>
            <div class="team-pill">
              <span class="team-avatar">T3</span>
              <div class="min-w-0"><div class="team-name">Ralph Edwards</div><div class="team-role">6 tables · Kitchen</div></div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <aside id="order-panel" class="cart-panel" aria-label="Order summary">
      <div class="cart-inner">
        <div class="cart-header">
          <div>
            <p id="table-title" class="cart-title">Table 04</p>
            <p class="cart-subtitle"><span id="guest-name">Floyd Miles</span><span class="mx-1.5 text-[#c4cbc5]">•</span><span>2 guests</span></p>
          </div>
          <div class="table-edit-wrap">
            <button class="table-edit-button" type="button" data-action="toggle-table-picker" aria-label="Edit table number" title="Change table">
              ${icon('edit', 'h-[18px] w-[18px]')}
            </button>
            <div id="table-picker" class="table-picker hidden"></div>
          </div>
        </div>

        <div id="order-mode" class="order-mode" role="group" aria-label="Order type"></div>

        <div class="cart-section-heading">
          <h2>Your order <span id="item-count-badge" class="ml-1 rounded-full bg-brand-50 px-1.5 py-0.5 text-[9px] font-bold text-brand-700"></span></h2>
          <button id="clear-order" type="button" data-action="clear-order">Clear all</button>
        </div>
        <div id="cart-items" class="cart-items" aria-live="polite"></div>
        <div id="cart-totals"></div>

        <section class="payment-block" aria-labelledby="payment-heading">
          <div class="payment-heading">
            <h2 id="payment-heading">Payment method</h2>
            <span>Choose at checkout</span>
          </div>
          <div id="payment-options" class="payment-options" role="group" aria-label="Payment method"></div>
        </section>

        <button id="place-order" class="place-order-button" type="button" data-action="place-order">
          <span>Place order</span>${icon('arrow', 'h-[16px] w-[16px]')}
        </button>
      </div>
    </aside>
  </div>

  <div class="mobile-order-bar">
    <button id="mobile-order-button" class="mobile-order-button" type="button" data-action="scroll-to-order">
      <span class="mobile-order-copy"><strong>Review your order</strong><span id="mobile-order-count">0 items in your basket</span></span>
      <span class="mobile-order-total"><span id="mobile-order-total">$0.00</span>${icon('chevron', 'h-4 w-4')}</span>
    </button>
  </div>

  <div id="toast" class="toast" role="status" aria-live="polite">
    <span class="grid h-7 w-7 place-items-center rounded-full bg-brand-50 text-brand-600" data-toast-icon>${icon('check', 'h-4 w-4')}</span>
    <span data-toast-message>Done</span>
  </div>
`;

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
}

function getProduct(id) {
  return products.find((product) => product.id === id);
}

function getCartCount() {
  return Object.values(state.cart).reduce((total, quantity) => total + quantity, 0);
}

function getCartSubtotal() {
  return Object.entries(state.cart).reduce((total, [id, quantity]) => {
    const product = getProduct(id);
    return total + (product ? product.price * quantity : 0);
  }, 0);
}

function renderCategories() {
  const container = document.querySelector('#category-list');
  container.innerHTML = categoryConfig.map((category) => {
    const count = category.id === 'All'
      ? products.length
      : products.filter((product) => product.category === category.id).length;
    const activeClass = state.activeCategory === category.id ? 'is-active' : '';
    const countLabel = count === 1 ? '1 dish' : `${count} dishes`;
    return `
      <button type="button" class="category-tile ${activeClass}" data-category="${category.id}" aria-pressed="${state.activeCategory === category.id}">
        <span class="category-icon">${icon(category.icon, 'h-[25px] w-[25px]', 1.7)}</span>
        <span><span class="category-label">${category.label}</span><span class="category-count">${countLabel}</span></span>
      </button>
    `;
  }).join('');
}

function renderProductCard(product) {
  const quantity = state.cart[product.id] || 0;
  const isFavorite = state.favorites.has(product.id);
  const badge = product.badge
    ? `<span class="product-badge">${product.badge}</span>`
    : '';
  const dietIcon = product.vegetarian
    ? icon('leaf', 'h-3 w-3')
    : icon('meat', 'h-3 w-3');
  const dietText = product.vegetarian ? 'Veg' : 'Non Veg';
  const cartControl = quantity > 0
    ? `
      <div class="quantity-control" aria-label="Quantity controls for ${product.name}">
        <button type="button" data-action="decrease" data-product-id="${product.id}" aria-label="Remove one ${product.name}">${icon('minus', 'h-3 w-3', 2.3)}</button>
        <span aria-live="polite">${quantity}</span>
        <button type="button" data-action="increase" data-product-id="${product.id}" aria-label="Add one ${product.name}">${icon('plus', 'h-3 w-3', 2.3)}</button>
      </div>
    `
    : `
      <button type="button" class="add-button" data-action="add" data-product-id="${product.id}" aria-label="Add ${product.name} to your order">
        ${icon('plus', 'h-3.5 w-3.5', 2.2)}<span>Add to dish</span>
      </button>
    `;

  return `
    <article class="product-card ${quantity > 0 ? 'is-in-cart' : ''}">
      <div class="product-image-wrap">
        <img class="product-image" src="${product.image}" alt="${product.alt}" loading="lazy" />
        ${badge}
        <button type="button" class="favorite-button ${isFavorite ? 'is-favorite' : ''}" data-action="favorite" data-product-id="${product.id}" aria-label="${isFavorite ? 'Remove from' : 'Add to'} favorites" aria-pressed="${isFavorite}">
          ${icon('heart', 'h-4 w-4', isFavorite ? 2.5 : 1.8)}
        </button>
      </div>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-detail">${product.detail}</p>
      <div class="product-meta">
        <span class="product-price">${formatCurrency(product.price)}</span>
        <span class="diet-tag">${dietIcon}<span>${dietText}</span></span>
      </div>
      ${cartControl}
    </article>
  `;
}

function getVisibleProducts() {
  const query = state.query.trim().toLowerCase();
  let visible = products.filter((product) => {
    const matchesCategory = state.activeCategory === 'All' || product.category === state.activeCategory;
    const matchesQuery = !query || `${product.name} ${product.detail} ${product.category}`.toLowerCase().includes(query);
    const matchesDiet = !state.vegetarianOnly || product.vegetarian;
    return matchesCategory && matchesQuery && matchesDiet;
  });

  if (state.sort === 'price-low') {
    visible = [...visible].sort((a, b) => a.price - b.price);
  } else if (state.sort === 'price-high') {
    visible = [...visible].sort((a, b) => b.price - a.price);
  } else {
    visible = [...visible].sort((a, b) => a.popularity - b.popularity);
  }

  return visible;
}

function renderProducts() {
  const visible = getVisibleProducts();
  const heading = document.querySelector('#products-heading');
  const summary = document.querySelector('#results-summary');
  const count = document.querySelector('#result-count');
  const grid = document.querySelector('#product-grid');

  heading.textContent = state.activeCategory === 'All' ? 'Popular picks' : `${state.activeCategory} favorites`;
  if (state.query.trim()) {
    summary.textContent = `Results for “${state.query.trim()}”`;
  } else if (state.vegetarianOnly) {
    summary.textContent = 'Fresh vegetarian options';
  } else if (state.activeCategory === 'All') {
    summary.textContent = 'A few guest favorites to get you started';
  } else {
    summary.textContent = `Fresh picks from our ${state.activeCategory.toLowerCase()} menu`;
  }
  count.textContent = `${visible.length} ${visible.length === 1 ? 'item' : 'items'}`;

  if (visible.length === 0) {
    grid.innerHTML = `
      <div class="empty-menu">
        <span class="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-white text-brand-600 shadow-sm">${icon('search', 'h-5 w-5')}</span>
        <p class="m-0 text-[12px] font-bold text-[#435148]">No dishes found</p>
        <p class="mb-0 mt-1 text-[10px]">Try another search or choose a different category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = visible.map(renderProductCard).join('');
}

function renderModeOptions() {
  const modes = [
    { id: 'dine', label: 'Dine in' },
    { id: 'takeaway', label: 'Take away' },
    { id: 'delivery', label: 'Delivery' }
  ];
  document.querySelector('#order-mode').innerHTML = modes.map((mode) => `
    <button type="button" data-action="set-mode" data-value="${mode.id}" class="${state.mode === mode.id ? 'is-active' : ''}" aria-pressed="${state.mode === mode.id}">${mode.label}</button>
  `).join('');
}

function renderTablePicker() {
  const picker = document.querySelector('#table-picker');
  picker.innerHTML = `
    <div class="mb-2 flex items-center justify-between">
      <span class="text-[10px] font-bold text-[#36443a]">Choose a table</span>
      <span class="text-[9px] text-[#9aa39c]">Dining room</span>
    </div>
    <div class="grid grid-cols-4 gap-1.5">
      ${Array.from({ length: 8 }, (_, index) => index + 1).map((tableNo) => `
        <button type="button" data-action="select-table" data-value="${tableNo}" class="grid h-8 place-items-center rounded-lg border text-[10px] font-bold transition ${state.tableNo === tableNo ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-[#e8ede8] bg-white text-[#657168] hover:border-[#b8ddc2]'}" aria-pressed="${state.tableNo === tableNo}">${String(tableNo).padStart(2, '0')}</button>
      `).join('')}
    </div>
  `;
}

function renderCartItems() {
  const items = Object.entries(state.cart)
    .map(([id, quantity]) => ({ product: getProduct(id), quantity }))
    .filter((entry) => entry.product && entry.quantity > 0);
  const container = document.querySelector('#cart-items');
  const clearButton = document.querySelector('#clear-order');

  document.querySelector('#item-count-badge').textContent = `${getCartCount()}`;
  clearButton.disabled = items.length === 0;
  clearButton.classList.toggle('opacity-40', items.length === 0);

  if (items.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div>
          <span class="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-600">${icon('bag', 'h-4 w-4')}</span>
          <p class="m-0 font-semibold text-[#5c685f]">Your basket is looking fresh.</p>
          <p class="mb-0 mt-1 text-[9px]">Add a dish to get started.</p>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(({ product, quantity }) => `
    <article class="cart-item">
      <img class="cart-item-image" src="${product.image}" alt="" loading="lazy" />
      <div class="cart-item-body">
        <div class="cart-item-top">
          <h3 class="cart-item-name">${product.name}</h3>
          <span class="cart-item-total">${formatCurrency(product.price * quantity)}</span>
        </div>
        <div class="cart-item-bottom">
          <span class="cart-item-unit">${formatCurrency(product.price)} each</span>
          <div class="cart-quantity" aria-label="Quantity for ${product.name}">
            <button type="button" data-action="decrease" data-product-id="${product.id}" aria-label="Remove one ${product.name}">${icon('minus', 'h-2.5 w-2.5', 2.2)}</button>
            <span>${quantity}</span>
            <button type="button" data-action="increase" data-product-id="${product.id}" aria-label="Add one ${product.name}">${icon('plus', 'h-2.5 w-2.5', 2.2)}</button>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

function renderTotals() {
  const subtotal = getCartSubtotal();
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + tax;

  document.querySelector('#cart-totals').innerHTML = `
    <div class="totals-card">
      <div class="total-row"><span>Subtotal</span><strong>${formatCurrency(subtotal)}</strong></div>
      <div class="total-row"><span>Tax <span class="text-[9px] text-[#a2aaa4]">(5%)</span></span><strong>${formatCurrency(tax)}</strong></div>
      <div class="total-divider"></div>
      <div class="total-row grand"><span>Total amount</span><strong>${formatCurrency(total)}</strong></div>
    </div>
  `;
}

function renderPaymentOptions() {
  const options = [
    { id: 'cash', label: 'Cash', icon: 'cash' },
    { id: 'card', label: 'Credit / debit', icon: 'card' },
    { id: 'qr', label: 'QR code', icon: 'qr' }
  ];
  document.querySelector('#payment-options').innerHTML = options.map((option) => `
    <button type="button" class="payment-option ${state.payment === option.id ? 'is-active' : ''}" data-action="set-payment" data-value="${option.id}" aria-pressed="${state.payment === option.id}">
      ${icon(option.icon, 'h-[20px] w-[20px]')}
      <span>${option.label}</span>
    </button>
  `).join('');
}

function renderCart() {
  document.querySelector('#table-title').textContent = `Table ${String(state.tableNo).padStart(2, '0')}`;
  renderModeOptions();
  renderTablePicker();
  renderCartItems();
  renderTotals();
  renderPaymentOptions();

  const empty = getCartCount() === 0;
  document.querySelector('#place-order').disabled = empty;
}

function renderMobileOrderBar() {
  const count = getCartCount();
  const total = getCartSubtotal();
  const tax = Math.round(total * 0.05 * 100) / 100;
  document.querySelector('#mobile-order-count').textContent = `${count} ${count === 1 ? 'item' : 'items'} in your basket`;
  document.querySelector('#mobile-order-total').textContent = formatCurrency(total + tax);
  document.querySelector('#mobile-order-button').disabled = count === 0;
}

function renderAll() {
  renderCategories();
  renderProducts();
  renderCart();
  renderMobileOrderBar();
}

let toastTimer;
function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.querySelector('[data-toast-message]').textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function changeQuantity(id, delta) {
  const next = (state.cart[id] || 0) + delta;
  if (next <= 0) {
    delete state.cart[id];
  } else {
    state.cart[id] = next;
  }
  renderProducts();
  renderCart();
  renderMobileOrderBar();
}

root.addEventListener('click', (event) => {
  const categoryButton = event.target.closest('[data-category]');
  if (categoryButton) {
    state.activeCategory = categoryButton.dataset.category;
    renderCategories();
    renderProducts();
    return;
  }

  const button = event.target.closest('[data-action]');
  if (!button) return;

  const productId = button.dataset.productId;
  const value = button.dataset.value;

  switch (button.dataset.action) {
    case 'jump-categories':
      document.querySelector('#category-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
      break;
    case 'reset-category':
      state.activeCategory = 'All';
      renderCategories();
      renderProducts();
      break;
    case 'toggle-filter': {
      const popover = document.querySelector('#filter-popover');
      const isOpen = !popover.classList.contains('hidden');
      popover.classList.toggle('hidden', isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
      break;
    }
    case 'add':
    case 'increase':
      changeQuantity(productId, 1);
      break;
    case 'decrease':
      changeQuantity(productId, -1);
      break;
    case 'favorite':
      if (state.favorites.has(productId)) state.favorites.delete(productId);
      else state.favorites.add(productId);
      renderProducts();
      break;
    case 'set-mode':
      state.mode = value;
      renderModeOptions();
      break;
    case 'set-payment':
      state.payment = value;
      renderPaymentOptions();
      break;
    case 'toggle-table-picker':
      document.querySelector('#table-picker').classList.toggle('hidden');
      break;
    case 'select-table':
      state.tableNo = Number(value);
      renderCart();
      showToast(`Now serving Table ${String(state.tableNo).padStart(2, '0')}`);
      break;
    case 'clear-order':
      state.cart = {};
      renderAll();
      showToast('Your basket has been cleared');
      break;
    case 'place-order':
      if (getCartCount() === 0) return;
      showToast(`Order sent to the kitchen for Table ${String(state.tableNo).padStart(2, '0')}`);
      state.cart = {};
      renderAll();
      break;
    case 'scroll-to-order':
      document.querySelector('#order-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
      break;
    default:
      break;
  }
});

root.addEventListener('input', (event) => {
  if (event.target.id === 'product-search') {
    state.query = event.target.value;
    renderProducts();
  }

  if (event.target.id === 'vegetarian-only') {
    state.vegetarianOnly = event.target.checked;
    renderProducts();
  }
});

root.addEventListener('change', (event) => {
  if (event.target.id === 'sort-select') {
    state.sort = event.target.value;
    renderProducts();
  }
});

document.addEventListener('click', (event) => {
  const filterWrap = document.querySelector('.filter-wrap');
  const filterPopover = document.querySelector('#filter-popover');
  if (filterWrap && !filterWrap.contains(event.target) && !filterPopover.classList.contains('hidden')) {
    filterPopover.classList.add('hidden');
    document.querySelector('#filter-toggle').setAttribute('aria-expanded', 'false');
  }

  const tableWrap = document.querySelector('.table-edit-wrap');
  const tablePicker = document.querySelector('#table-picker');
  if (tableWrap && !tableWrap.contains(event.target) && !tablePicker.classList.contains('hidden')) {
    tablePicker.classList.add('hidden');
  }
});

const searchInput = document.querySelector('#product-search');
document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === 'Escape') {
    document.querySelector('#filter-popover').classList.add('hidden');
    document.querySelector('#table-picker').classList.add('hidden');
  }
});

renderAll();
