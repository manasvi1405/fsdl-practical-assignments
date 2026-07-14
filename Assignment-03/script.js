let products = JSON.parse(localStorage.getItem("products")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

if (products.length === 0) preloadProducts();

// --- Auth & Navigation ---
function showAdminLogin() { document.getElementById("adminLogin").classList.toggle("d-none"); }
function adminLogin() {
  if (adminUser.value === "admin" && adminPass.value === "admin@123") loginSuccess("admin");
  else alert("Wrong credentials");
}
function userLogin() { loginSuccess("user"); }
function loginSuccess(role) {
  loginPage.classList.add("d-none"); navbar.classList.remove("d-none"); mainFooter.classList.remove("d-none");
  if (role === "admin") { adminPanel.classList.remove("d-none"); heroSection.classList.add("d-none"); searchContainer.classList.add("d-none"); }
  else showHome();
  renderProducts();
}
function showHome() {
    store.classList.remove("d-none"); heroSection.classList.remove("d-none");
    searchContainer.classList.remove("d-none"); cartPage.classList.add("d-none");
    adminPanel.classList.add("d-none"); renderProducts();
}
function logout() { location.reload(); }

// --- Filtering ---
function updatePriceLabel(val) {
    document.getElementById("priceLabel").innerText = val;
    renderProducts();
}

// --- CRUD Operations ---
function addProduct() {
  if(!pName.value || !pImg.value || !pPrice.value) return alert("Please fill details");
  products.push({ id: Date.now(), name: pName.value, img: pImg.value, cat: pCat.value, qty: Number(pQty.value), price: Number(pPrice.value) });
  save(); renderProducts(); resetAdminForm();
}

function editProduct(id) {
    const p = products.find(p => p.id === id);
    if (!p) return;
    document.getElementById("editId").value = p.id;
    pName.value = p.name; pImg.value = p.img; pCat.value = p.cat; pPrice.value = p.price; pQty.value = p.qty;
    
    document.getElementById("adminTitle").innerText = "Update Product Info";
    document.getElementById("addBtn").classList.add("d-none");
    document.getElementById("updateBtn").classList.remove("d-none");
    document.getElementById("cancelBtn").classList.remove("d-none");
    window.scrollTo(0, 0);
}

function updateProduct() {
    const id = Number(document.getElementById("editId").value);
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = { id, name: pName.value, img: pImg.value, cat: pCat.value, qty: Number(pQty.value), price: Number(pPrice.value) };
        save(); renderProducts(); resetAdminForm();
    }
}

function resetAdminForm() {
    document.getElementById("editId").value = "";
    pName.value = ""; pImg.value = ""; pPrice.value = ""; pQty.value = "";
    document.getElementById("adminTitle").innerHTML = '<i class="bi bi-plus-circle me-2"></i>Inventory Management';
    document.getElementById("addBtn").classList.remove("d-none");
    document.getElementById("updateBtn").classList.add("d-none");
    document.getElementById("cancelBtn").classList.add("d-none");
}

function deleteProduct(id) {
  if(confirm("Delete this item?")) { products = products.filter(p => p.id !== id); save(); renderProducts(); }
}

// --- UI Rendering ---
function renderProducts() {
  const list = document.getElementById("productList");
  const adminList = document.getElementById("adminProducts");
  if (list) list.innerHTML = ""; if (adminList) adminList.innerHTML = "";

  let filtered = [...products];
  let search = document.getElementById("searchInput")?.value.toLowerCase();
  let cat = document.getElementById("categoryFilter")?.value;
  let maxPrice = document.getElementById("priceRange")?.value;

  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
  if (cat) filtered = filtered.filter(p => p.cat === cat);
  if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice));

  filtered.forEach(p => {
    list?.insertAdjacentHTML("beforeend", `
      <div class="col-md-3 mb-4"><div class="card card-product h-100 border-0 shadow-sm ${p.qty === 0 ? 'out-stock':''}">
        <img src="${p.img}" class="product-img card-img-top">
        <div class="card-body d-flex flex-column">
          <small class="text-muted text-uppercase">${p.cat}</small>
          <h5 class="fw-bold">${p.name}</h5>
          <p class="h5 text-primary mt-auto">₹${p.price}</p>
          ${p.qty > 0 ? `<button class="btn btn-dark btn-sm mt-2" onclick="addToCart(${p.id})">Add to Cart</button>` : '<span class="text-danger">Out of Stock</span>'}
        </div>
      </div></div>`);

    adminList?.insertAdjacentHTML("beforeend", `
      <div class="col-md-4 mb-3"><div class="card p-2 d-flex flex-row align-items-center">
          <img src="${p.img}" style="width:50px;height:50px;object-fit:cover" class="me-2 rounded">
          <div class="flex-grow-1"><h6 class="mb-0">${p.name}</h6><small>₹${p.price}</small></div>
          <button class="btn btn-outline-primary btn-sm me-1" onclick="editProduct(${p.id})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-outline-danger btn-sm" onclick="deleteProduct(${p.id})"><i class="bi bi-trash"></i></button>
      </div></div>`);
  });
  document.getElementById("cartCount").innerText = cart.length;
}

// --- Shopping Logic ---
function addToCart(id) {
  let p = products.find(p => p.id === id);
  if (p.qty > 0) { p.qty--; cart.push({...p}); save(); renderProducts(); }
}
function toggleCart() { store.classList.add("d-none"); heroSection.classList.add("d-none"); searchContainer.classList.add("d-none"); cartPage.classList.remove("d-none"); renderCart(); }
function renderCart() {
  cartItems.innerHTML = ""; let total = 0;
  cart.forEach(c => { total += c.price; cartItems.innerHTML += `<div class="d-flex justify-content-between py-2 border-bottom"><span>${c.name}</span><strong>₹${c.price}</strong></div>`; });
  cartTotal.innerText = total;
}
function showCheckout() { if (cart.length > 0) document.getElementById("checkoutModal").classList.remove("d-none"); }
function hideCheckout() { document.getElementById("checkoutModal").classList.add("d-none"); }
function processOrder() {
    if (!custName.value || !custPhone.value || !custAddr.value) return alert("Fill all details");
    document.getElementById("checkoutForm").classList.add("d-none"); document.getElementById("successMsg").classList.remove("d-none");
}
function returnToHomeFromSuccess() { cart = []; save(); hideCheckout(); document.getElementById("checkoutForm").classList.remove("d-none"); document.getElementById("successMsg").classList.add("d-none"); showHome(); }

function save() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("cart", JSON.stringify(cart));
}

function preloadProducts() {
  products = [
    { id: 1, name: "Premium Slim Blazer", cat: "Fashion", price: 4999, qty: 10, img: "https://images.unsplash.com/photo-1594932224030-94091a1abec4?w=500" },
    { id: 2, name: "Distressed Denim Jacket", cat: "Fashion", price: 2499, qty: 5, img: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=500" },
    { id: 3, name: "Urban White Sneakers", cat: "Footwear", price: 3200, qty: 8, img: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500" },
    { id: 4, name: "Leather Chelsea Boots", cat: "Footwear", price: 6500, qty: 6, img: "https://images.unsplash.com/photo-1638247025967-b4e38f687b76?w=500" }
  ];
  save();
}