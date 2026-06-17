/* ─ DATA ─────────────────────────────────────────── */
const categories = [
  { name: 'Mobiles', emoji: '📱', sub: 'Up to 50% Off' },
  { name: 'Electronics', emoji: '💻', sub: 'Laptops & Cameras' },
  { name: 'Fashion', emoji: '👕', sub: 'Brands & Trends' },
  { name: 'Home & Kitchen', emoji: '🏠', sub: 'Appliances & Décor' },
  { name: 'Books', emoji: '📚', sub: 'Bestsellers' },
  { name: 'Sports', emoji: '⚽', sub: 'Gear & Equipment' },
  { name: 'Grocery', emoji: '🥦', sub: 'Fresh & Packaged' },
  { name: 'Toys', emoji: '🧸', sub: 'For All Ages' },
];
 
const products = [
  { id:1, title:'boAt Rockerz 450 Bluetooth Headphones', price:1299, mrp:3990, stars:4, reviews:124520, badge:'Prime', emoji:'🎧' },
  { id:2, title:'Redmi Note 13 5G (8GB+128GB) Arctic White', price:14999, mrp:19999, stars:4.5, reviews:87234, badge:'Prime', emoji:'📱' },
  { id:3, title:'Sony WH-1000XM5 Noise Cancelling Headphones', price:24990, mrp:34990, stars:4.5, reviews:43210, badge:'Prime', emoji:'🎵' },
  { id:4, title:'HP Pavilion 15 Laptop Intel i5 16GB RAM 512GB SSD', price:54999, mrp:74999, stars:4, reviews:18740, badge:'Prime', emoji:'💻' },
  { id:5, title:'Fire-Boltt Ninja Call Pro Plus Smartwatch', price:1299, mrp:5999, stars:3.5, reviews:201450, badge:'', emoji:'⌚' },
  { id:6, title:'Casio G-Shock GA-100-1A2DR Analog-Digital Watch', price:4295, mrp:5500, stars:4.5, reviews:32100, badge:'Prime', emoji:'⏱️' },
  { id:7, title:'Prestige PKPW 500W Pop-Up Toaster', price:699, mrp:999, stars:4, reviews:56780, badge:'', emoji:'🍞' },
  { id:8, title:'Pigeon Healthifry Digital Air Fryer 4.2L', price:2799, mrp:5999, stars:4, reviews:98430, badge:'Prime', emoji:'🍟' },
];
 
const recommended = [
  { id:9, title:'The Alchemist – Paulo Coelho (Paperback)', price:199, mrp:350, stars:4.5, reviews:345210, badge:'Prime', emoji:'📖' },
  { id:10, title:'Himalaya Face Wash Purifying Neem 150ml', price:120, mrp:175, stars:4, reviews:231000, badge:'', emoji:'🧴' },
  { id:11, title:'Nike Air Force 1 \'07 Sneakers White', price:7495, mrp:8995, stars:4.5, reviews:67890, badge:'Prime', emoji:'👟' },
  { id:12, title:'Wipro Garnet 9W LED Bulb (Pack of 10)', price:349, mrp:699, stars:4, reviews:123450, badge:'Prime', emoji:'💡' },
  { id:13, title:'Fastrack Reflex 3.0 Activity Tracker', price:2495, mrp:4995, stars:3.5, reviews:45670, badge:'', emoji:'💪' },
  { id:14, title:'Milton Thermosteel Flask 750ml', price:899, mrp:1495, stars:4.5, reviews:189230, badge:'Prime', emoji:'🧊' },
  { id:15, title:'Classmate Pulse Ball Pen (20 Pack Blue)', price:99, mrp:150, stars:4, reviews:456780, badge:'', emoji:'✏️' },
  { id:16, title:'Amul Macho Eternity Brief (Pack of 3)', price:349, mrp:599, stars:4, reviews:234560, badge:'Prime', emoji:'🩲' },
];
 
/* ─ STATE ────────────────────────────────────────── */
// Note: localStorage is not available in this environment, so cart state
// is kept in memory only (it will reset on page reload).
let cart = [];
 
/* ─ HELPERS ──────────────────────────────────────── */
function saveCart() {
  // No-op placeholder (previously persisted to localStorage).
  // Kept so the rest of the code can call saveCart() without changes.
}
 
function discount(price, mrp) {
  return Math.round((mrp - price) / mrp * 100);
}
 
function starString(n) {
  const full = Math.floor(n), half = (n % 1) >= .5;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half?1:0));
}
 
function fmt(n) {
  return '₹' + n.toLocaleString('en-IN');
}
 
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}
 
/* ─ CART ─────────────────────────────────────────── */
function updateCartCount() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = total;
}
 
function toggleCart() {
  document.getElementById('cartOverlay').classList.toggle('open');
  document.getElementById('cartSidebar').classList.toggle('open');
  renderCart();
}
 
function addToCart(product) {
  const idx = cart.findIndex(i => i.id === product.id);
  if (idx > -1) cart[idx].qty++;
  else cart.push({ ...product, qty: 1 });
  saveCart(); updateCartCount();
  showToast(`✓ "${product.title.slice(0,32)}..." added to cart`);
}
 
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart(); updateCartCount(); renderCart();
}
 
function changeQty(id, delta) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx === -1) return;
  cart[idx].qty = Math.max(1, cart[idx].qty + delta);
  saveCart(); updateCartCount(); renderCart();
}
 
function renderCart() {
  const container = document.getElementById('cartItems');
  const totalEl   = document.getElementById('cartTotal');
  if (!cart.length) {
    container.innerHTML = '<p style="color:#666;margin-top:20px;text-align:center">Your cart is empty 🛒</p>';
    totalEl.textContent = '';
    return;
  }
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div style="font-size:2.5rem">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title.slice(0, 48)}…</div>
        <div class="cart-item-price">${fmt(item.price)}</div>
        <div class="cart-qty">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    </div>
  `).join('');
  const grand = cart.reduce((s, i) => s + i.price * i.qty, 0);
  totalEl.innerHTML = `Subtotal (${cart.reduce((s,i)=>s+i.qty,0)} items): <span style="color:var(--amazon-red)">${fmt(grand)}</span>`;
}
 
/* ─ SEARCH ───────────────────────────────────────── */
function doSearch() {
  const q = document.getElementById('searchInput').value.trim();
  if (q) showToast(`Searching for "${q}"…`);
  else showToast('Please enter a search term');
}
 
/* ─ CAROUSEL ─────────────────────────────────────── */
let currentSlide = 0;
const totalSlides = 4;
let slideTimer;
 
function renderDots() {
  const c = document.getElementById('dots');
  c.innerHTML = Array.from({length: totalSlides}, (_, i) =>
    `<div class="dot ${i===currentSlide?'active':''}" onclick="goToSlide(${i})"></div>`
  ).join('');
}
 
function goToSlide(n) {
  currentSlide = (n + totalSlides) % totalSlides;
  document.getElementById('slides').style.transform = `translateX(-${currentSlide * 100}%)`;
  renderDots();
}
 
function moveSlide(dir) {
  goToSlide(currentSlide + dir);
  resetTimer();
}
 
function resetTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => goToSlide(currentSlide + 1), 4500);
}
 
/* ─ COUNTDOWN ────────────────────────────────────── */
function startCountdown() {
  const end = new Date(); end.setHours(23, 59, 59, 0);
  function tick() {
    const diff = end - new Date();
    if (diff <= 0) { document.getElementById('countdown').textContent = '00:00:00'; return; }
    const h = String(Math.floor(diff/3600000)).padStart(2,'0');
    const m = String(Math.floor((diff%3600000)/60000)).padStart(2,'0');
    const s = String(Math.floor((diff%60000)/1000)).padStart(2,'0');
    document.getElementById('countdown').textContent = `${h}:${m}:${s}`;
  }
  tick(); setInterval(tick, 1000);
}
 
/* ─ RENDER CATEGORIES ────────────────────────────── */
function renderCategories() {
  document.getElementById('categoryCards').innerHTML = categories.map(cat => `
    <div class="card" onclick="showToast('Opening ${cat.name}...')">
      <h3>${cat.name}</h3>
      <div class="product-img" style="display:flex;align-items:center;justify-content:center;font-size:4rem;background:#f7f7f7;border-radius:6px;aspect-ratio:1">${cat.emoji}</div>
      <a class="card-link">See more in ${cat.name} →</a>
    </div>
  `).join('');
}
 
/* ─ RENDER PRODUCTS ─────────────────────────────── */
function renderProducts(list, containerId) {
  document.getElementById(containerId).innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-img" style="display:flex;align-items:center;justify-content:center;font-size:4rem;background:#f7f7f7;border-radius:6px;aspect-ratio:1">${p.emoji}</div>
      <div class="product-title">${p.title}</div>
      <div class="stars">${starString(p.stars)} <span style="color:var(--text-muted);font-size:.72rem">${p.stars}</span></div>
      <div class="rating-count">${p.reviews.toLocaleString()} ratings</div>
      <div class="price-block">
        <div class="price-mrp">M.R.P: ${fmt(p.mrp)}</div>
        <div class="price-main">${fmt(p.price)}</div>
        <div class="price-off">(${discount(p.price, p.mrp)}% off)</div>
        ${p.badge ? `<div class="prime-badge">⚡ ${p.badge} Eligible</div>` : ''}
      </div>
      <button class="add-cart-btn" onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
    </div>
  `).join('');
}
 
/* ─ INIT ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
  });
 
  renderDots();
  resetTimer();
  startCountdown();
 
  renderCategories();
  renderProducts(products, 'productsGrid');
  renderProducts(recommended, 'recommendedGrid');
  updateCartCount();
});
 