const products=[
{id:1,name:"Classic Summer Dress",category:"Fashion",price:1499,rating:4.8,badge:"BEST SELLER",img:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80"},
{id:2,name:"Wireless Headphones",category:"Electronics",price:2499,rating:4.7,badge:"TRENDING",img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"},
{id:3,name:"Everyday Sneakers",category:"Shoes",price:1899,rating:4.6,badge:"SALE",img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"},
{id:4,name:"Minimalist Watch",category:"Fashion",price:2999,rating:4.9,badge:"TOP RATED",img:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=80"},
{id:5,name:"Skincare Essentials",category:"Beauty",price:999,rating:4.5,badge:"NEW",img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=700&q=80"},
{id:6,name:"Modern Table Lamp",category:"Home",price:1299,rating:4.4,badge:"POPULAR",img:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80"},
{id:7,name:"Smart Fitness Band",category:"Electronics",price:2199,rating:4.6,badge:"HOT",img:"https://images.unsplash.com/photo-1557935728-e6d1eaabe558?auto=format&fit=crop&w=700&q=80"},
{id:8,name:"Cozy Hoodie",category:"Fashion",price:1199,rating:4.8,badge:"SALE",img:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80"}
];

let cart=JSON.parse(localStorage.getItem("shopEaseCart")||"[]");
let orders=JSON.parse(localStorage.getItem("shopEaseOrders")||"[]");
let wishlist=new Set(JSON.parse(localStorage.getItem("shopEaseWishlist")||"[]"));
let selectedCategory="All",searchTerm="",sortBy="featured";

const $=id=>document.getElementById(id);
const money=v=>"₹"+Number(v).toLocaleString("en-IN");
const grid=$("productGrid"),emptyState=$("emptyState"),cartCount=$("cartCount"),cartItems=$("cartItems"),cartTotal=$("cartTotal"),toast=$("toast");

function save(){
  localStorage.setItem("shopEaseCart",JSON.stringify(cart));
  localStorage.setItem("shopEaseWishlist",JSON.stringify([...wishlist]));
  localStorage.setItem("shopEaseOrders",JSON.stringify(orders));
}

function renderProducts(){
  let list=products.filter(p=>
    (selectedCategory==="All"||p.category===selectedCategory)&&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase())||p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  if(sortBy==="low")list.sort((a,b)=>a.price-b.price);
  if(sortBy==="high")list.sort((a,b)=>b.price-a.price);
  if(sortBy==="rating")list.sort((a,b)=>b.rating-a.rating);

  grid.innerHTML=list.map(p=>`
    <article class="product-card">
      <div class="product-img">
        <button class="wish ${wishlist.has(p.id)?"liked":""}" onclick="toggleWishlist(${p.id})">${wishlist.has(p.id)?"♥":"♡"}</button>
        <span class="badge">${p.badge}</span><img src="${p.img}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-info">
        <div class="product-cat">${p.category}</div><div class="product-name">${p.name}</div>
        <div class="rating">★★★★★ <span>${p.rating}</span></div>
        <div class="price-row"><div class="price">${money(p.price)}</div><button class="add-btn" onclick="addToCart(${p.id})">+ Add</button></div>
      </div>
    </article>`).join("");
  emptyState.style.display=list.length?"none":"block";
}

function addToCart(id){
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++; else cart.push({id,qty:1});
  save();renderCart();showToast("Added to cart ✓");
}
function changeQty(id,amount){
  const item=cart.find(x=>x.id===id);if(!item)return;
  item.qty+=amount;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  save();renderCart();
}
function removeItem(id){cart=cart.filter(x=>x.id!==id);save();renderCart();showToast("Item removed");}
function getSubtotal(){return cart.reduce((s,x)=>{const p=products.find(p=>p.id===x.id);return s+p.price*x.qty},0)}
function renderCart(){
  cartCount.textContent=cart.reduce((s,x)=>s+x.qty,0);
  if(!cart.length){cartItems.innerHTML='<div style="text-align:center;color:#999;padding:60px 10px">Your cart is empty 🛒<br><small>Add some products to get started.</small></div>';cartTotal.textContent="₹0";return}
  cartItems.innerHTML=cart.map(i=>{const p=products.find(p=>p.id===i.id);return`
    <div class="cart-item"><img src="${p.img}" alt="${p.name}"><div style="flex:1">
      <h4>${p.name}</h4><p>${money(p.price)} × ${i.qty}</p>
      <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${i.qty}</b><button onclick="changeQty(${p.id},1)">+</button><button class="remove" onclick="removeItem(${p.id})">Remove</button></div>
    </div></div>`}).join("");
  cartTotal.textContent=money(getSubtotal());
}
function toggleWishlist(id){wishlist.has(id)?wishlist.delete(id):wishlist.add(id);save();renderProducts();showToast(wishlist.has(id)?"Added to wishlist ♡":"Removed from wishlist")}
function showToast(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>toast.classList.remove("show"),1800)}
function openPanel(id){$(id).classList.add("open");$("overlay").classList.add("show")}
function closeAll(){$$(" .side-panel")?.forEach?.(()=>{});document.querySelectorAll(".side-panel").forEach(x=>x.classList.remove("open"));$("overlay").classList.remove("show")}
function openModal(id){$(id).classList.add("show")}
function closeModal(id){$(id).classList.remove("show")}

function $$(selector){return [...document.querySelectorAll(selector)]}

function renderCheckoutPreview(){
  const preview=$("checkoutPreview");
  if(!cart.length){preview.innerHTML="<p>Your cart is empty.</p>";return}
  preview.innerHTML=cart.map(i=>{const p=products.find(p=>p.id===i.id);return`<div class="preview-line"><span>${p.name} × ${i.qty}</span><b>${money(p.price*i.qty)}</b></div>`}).join("")+
  `<div class="preview-line preview-total"><span>Total</span><b>${money(getSubtotal())}</b></div>`;
  $("placeOrderTotal").textContent=money(getSubtotal());
}

function openCheckout(){
  if(!cart.length){showToast("Your cart is empty");return}
  closeAll();renderCheckoutPreview();openModal("checkoutModal");
}

function placeOrder(e){
  e.preventDefault();
  if(!cart.length)return;
  const data=new FormData(e.target);
  const order={
    id:"SE"+Date.now().toString().slice(-8),
    date:new Date().toLocaleString("en-IN"),
    customer:{name:data.get("name"),phone:data.get("phone"),address:data.get("address"),city:data.get("city"),pin:data.get("pin")},
    payment:data.get("payment"),
    items:cart.map(i=>{const p=products.find(p=>p.id===i.id);return{id:p.id,name:p.name,price:p.price,qty:i.qty}}),
    total:getSubtotal(),
    status:"Confirmed"
  };
  orders.unshift(order);cart=[];save();renderCart();e.target.reset();closeModal("checkoutModal");
  $("successText").textContent=`Order #${order.id} has been confirmed. Total: ${money(order.total)}.`;
  openModal("successModal");
}

function renderOrders(){
  const box=$("ordersList");
  if(!orders.length){box.innerHTML='<div style="text-align:center;color:#999;padding:60px 10px">No orders yet 📦<br><small>Your placed orders will appear here.</small></div>';return}
  box.innerHTML=orders.map(o=>`
    <div class="order-card"><div class="order-top"><span class="order-id">#${o.id}</span><span class="status">${o.status}</span></div>
    <div class="order-date">${o.date} • ${o.payment}</div>
    <div class="order-products">${o.items.map(i=>`${i.name} × ${i.qty}`).join("<br>")}</div>
    <div class="order-total"><span>Total</span><span>${money(o.total)}</span></div></div>`).join("");
}

document.querySelectorAll(".category").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".category").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
  selectedCategory=btn.dataset.category;renderProducts();
}));
$("searchInput").addEventListener("input",e=>{searchTerm=e.target.value;renderProducts()});
$("sortSelect").addEventListener("change",e=>{sortBy=e.target.value;renderProducts()});
$("allProductsBtn").addEventListener("click",()=>{selectedCategory="All";document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x.dataset.category==="All"));$("products").scrollIntoView({behavior:"smooth"});renderProducts()});
$("cartBtn").addEventListener("click",()=>openPanel("cartPanel"));
$("wishlistBtn").addEventListener("click",()=>{
  const liked=products.filter(p=>wishlist.has(p.id));
  if(!liked.length){showToast("Your wishlist is empty");return}
  grid.innerHTML=liked.map(p=>`<article class="product-card"><div class="product-img"><button class="wish liked" onclick="toggleWishlist(${p.id})">♥</button><span class="badge">WISHLIST</span><img src="${p.img}" alt="${p.name}"></div><div class="product-info"><div class="product-cat">${p.category}</div><div class="product-name">${p.name}</div><div class="rating">★★★★★ <span>${p.rating}</span></div><div class="price-row"><div class="price">${money(p.price)}</div><button class="add-btn" onclick="addToCart(${p.id})">+ Add</button></div></div></article>`).join("");
  $("products").scrollIntoView({behavior:"smooth"});
});
$("ordersBtn").addEventListener("click",()=>{renderOrders();openPanel("ordersPanel")});
$("checkoutBtn").addEventListener("click",openCheckout);
$("checkoutForm").addEventListener("submit",placeOrder);
$("viewOrdersAfterOrder").addEventListener("click",()=>{closeModal("successModal");renderOrders();openPanel("ordersPanel")});
$("overlay").addEventListener("click",closeAll);
document.querySelectorAll("[data-close]").forEach(btn=>btn.addEventListener("click",()=>{const id=btn.dataset.close;if(id==="checkoutModal"||id==="successModal")closeModal(id);else closeAll()}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeAll();closeModal("checkoutModal");closeModal("successModal")}});

renderProducts();renderCart();
