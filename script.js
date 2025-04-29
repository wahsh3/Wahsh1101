// بيانات أساسية: منتجات وعروض
let appState = {
  products: [
    { id: "usdt", name: "بطاقة USDT", desc: "تحويل رصيد تيذر USDT بسرعة وآمان.", img:"https://cryptologos.cc/logos/tether-usdt-logo.png", prices: [75, 150], categories: ["$10","$20"], available:true, isDiscount:0 },
    { id: "steam", name: "بطاقة ستيم", desc: "اشحن الستيم والعب بلا حدود.", img: "https://cdn.icon-icons.com/icons2/912/PNG/512/steam_icon-icons.com_71866.png", prices: [80, 150], categories: ["$20","$50"], available: true, isDiscount:0 },
    { id: "appstore", name: "بطاقة AppStore", desc: "اشحن حساب أبل ستور أو شراء التطبيقات.", img: "https://developer.apple.com/assets/elements/icons/app-store/app-store-128x128_2x.png", prices: [50, 100], categories: ["$10","$20"], available:true, isDiscount:0 },
    { id: "getword", name: "GETWORD", desc: "رصيد GETWORD لشراء اشتراكات.", img: "https://cdn-icons-png.flaticon.com/512/25/25310.png", prices: [33,62], categories: ["$5","$10"], available:true, isDiscount:0 },
    { id: "netflix", name: "بطاقة نتفليكس", desc: "بطاقة لمتابعة مسلسلاتك العالمية.", img: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", prices: [120], categories: ["$30"], available:true, isDiscount:0 },
    { id: "xbox", name: "XBOX Gift Card", desc: "بطاقة رصيد أكس بوكس للألعاب.", img: "https://upload.wikimedia.org/wikipedia/commons/4/43/Xbox_one_logo.svg", prices: [75], categories: ["$10"], available:true, isDiscount:0 },
  ],
  offers: [
    {id: "mastercard", name: "ماستر كارد", desc: "بطاقة ماستر كارد بخصم خاص 5%.", img:"https://cdn.jsdelivr.net/gh/jboesch/creditcard-icons@master/svg/mastercard.svg", prices: [95, 190], categories: ["$10","$20"], available: true, isDiscount:1, discount:5},
    {id: "visa", name: "فيزا كارد", desc: "بطاقة فيزا بخصم خاص 4%.", img:"https://cdn.jsdelivr.net/gh/jboesch/creditcard-icons@master/svg/visa.svg", prices: [96, 192], categories: ["$10","$20"], available: true, isDiscount:1, discount:4}
  ],
  cart: [],
  orders: [],
  adminLogged: false,
  adminUsername: 'adminxcard',
  adminPassword: 'xc@rd2024'
};

// وظائف التنقل
function navigateTo(tab) {
  document.getElementById('main-section').style.display = tab==='main'?'':'none';
  document.getElementById('offers-section').style.display = tab==='offers'?'':'none';
  document.getElementById('products-section').style.display = tab==='products'?'':'none';
  if(tab==="main") { renderProductGrid(); }
  if(tab==="offers") { renderOffersGrid(); }
  if(tab==="products") { renderProductsList(); }
}

// عرض شبكة المنتجات في الصفحة الرئيسية
function renderProductGrid() {
  let grid = document.getElementById('product-icon-grid');
  let data = appState.products;
  grid.innerHTML = '';
  if(!data.length) { document.getElementById('no-products').style.display=''; return; }
  document.getElementById('no-products').style.display='none';
  data.forEach((item) => {
    if(!item.available) return;
    let btn = document.createElement('button');
    btn.className = "product-tile flex flex-col items-center justify-center p-4";
    btn.onclick = ()=>showProductModal(item.id, 'product');
    btn.innerHTML = `
      <img src="${item.img}" class="product-logo block mb-1" alt="${item.name}" />
      <span class="block font-bold text-blue-900 mb-0.5 text-xs truncate">${item.name}</span>
    `;
    grid.appendChild(btn);
  });
}

// عرض العروض الخاصة
function renderOffersGrid() {
  let grid = document.getElementById('offers-grid');
  let data = appState.offers;
  grid.innerHTML = '';
  if(!data.length) { document.getElementById('no-offers').style.display = ''; return; }
  document.getElementById('no-offers').style.display = 'none';
  data.forEach((item) => {
    if(!item.available) return;
    let btn = document.createElement('button');
    btn.className = "product-tile flex flex-col items-center justify-center p-4";
    btn.onclick = ()=>showProductModal(item.id, 'offer');
    btn.innerHTML = `
      <img src="${item.img}" class="product-logo block mb-1" alt="${item.name}" />
      <span class="block font-bold text-blue-900 mb-0.5 text-xs truncate">${item.name}</span>
      ${item.discount ? `<div class="text-xs text-green-600 font-bold">خصم ${item.discount}%</div>` : ''}
    `;
    grid.appendChild(btn);
  });
}

// عرض قائمة جميع المنتجات
function renderProductsList() {
  let grid = document.getElementById('products-list');
  let data = [...appState.products, ...appState.offers];
  grid.innerHTML = '';
  if(!data.length) { document.getElementById('no-products2').style.display=''; return; }
  document.getElementById('no-products2').style.display='none';
  data.forEach((item) => {
    if(!item.available) return;
    let btn = document.createElement('button');
    btn.className = "product-tile flex flex-col items-center justify-center p-4";
    btn.onclick = ()=>showProductModal(item.id, item.isDiscount ? 'offer' : 'product');
    btn.innerHTML = `
      <img src="${item.img}" class="product-logo block mb-1" alt="${item.name}" />
      <span class="block font-bold text-blue-900 mb-0.5 text-xs truncate">${item.name}</span>
      ${item.discount ? `<div class="text-xs text-green-600 font-bold">خصم ${item.discount}%</div>` : ''}
    `;
    grid.appendChild(btn);
  });
}

// منتج: عرض بيانات
function showProductModal(id, type='product'){
  let arr = type==='offer' ? appState.offers : appState.products;
  let item = arr.find(x=>x.id===id);
  if(!item) return;
  let catsHTML = (item.categories||[]).map(
    (c, i)=>`<span class="cat-badge px-3 py-1 font-bold">${c}</span>`
  ).join(' ');
  let priceBtns = (item.prices||[]).map((p,i)=>`
    <button type="button" class="w-full py-2 rounded bg-green-700 text-white font-bold text-base my-1 mb-2 small-btn" onclick="addToCartDialog('${item.id}', ${p}, '${item.categories[i]||""}', '${type}')">
      شراء بـ <span class="font-mono">${p}</span> د.ل ${item.categories[i]||""}
    </button>
  `).join('');
  let modal = document.createElement('div');
  modal.className = "modal-root fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50";
  modal.innerHTML = `
    <div class="bg-white rounded-xl shadow-lg max-w-xs sm:max-w-sm w-full p-5 relative admin-modal animate-fadeInUp flex flex-col items-center">
      <button type="button" onclick="closeModal()" class="absolute left-3 top-2 text-blue-600 text-xl hover:text-red-700 small-btn"><i class="fa-solid fa-arrow-right-long"></i></button>
      <img src="${item.img}" alt="${item.name}" class="h-20 w-20 object-contain rounded-lg mx-auto mb-2 border bg-blue-50">
      <div class="font-bold text-lg text-blue-900 mb-0.5">${item.name}</div>
      <div class="mb-2 text-blue-700 text-xs font-normal">${item.desc||''}</div>
      <div class="flex flex-wrap justify-center mb-2 gap-1" style="direction:ltr;">
        ${catsHTML}
      </div>
      <div class="w-full flex flex-col items-stretch mt-2">${priceBtns}</div>
    </div>
  `;
  document.body.appendChild(modal);
}

// إغلاق النوافذ المنبثقة
function closeModal(){
  let modals = document.getElementsByClassName('modal-root');
  while(modals[0]) modals[0].remove();
}

// إضافة إلى السلة
function addToCartDialog(productId, price, category, type='product'){
  let arr = type==='offer'? appState.offers: appState.products;
  let item = arr.find(x=>x.id===productId);
  if(!item) return;
  addToCart(item, price, category);
  closeModal();
}

function addToCart(prod, price, category){
  appState.cart = loadLS('CART', []);
  let idx = appState.cart.findIndex(e=>e.id===prod.id && e.price===price && e.category===category);
  if(idx!==-1){ appState.cart[idx].qty+=1;}
  else appState.cart.push({id: prod.id, name: prod.name, price, category, qty:1, img: prod.img});
  saveLS('CART',appState.cart);
  updateCartCount();
  toast('تمت إضافة البطاقة لسلة التسوق');
}

// عرض سلة التسوق
function showCart() {
  appState.cart = loadLS('CART', []);
  let modal = document.createElement('div');
  modal.className = "modal-root fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50";
  let listHtml = '';
  if(appState.cart.length===0){
    listHtml = `<div class="text-gray-500 py-7 text-center">سلة التسوق فارغة <i class="ml-2 fa-solid fa-face-sad-tear"></i></div>`;
  }else{
    appState.cart.forEach((item, idx)=>{
      listHtml += `
        <div class="flex items-center justify-between mb-3 pb-2 border-b text-base">
          <div class="flex items-center">
            <img src="${item.img}" alt="${item.name}" class="w-10 h-10 object-contain mr-2">
            <div>
              <div class="font-bold text-blue-800 mb-1">${item.name}</div>
              <div class="text-xs text-blue-700 mb-1">الفئة: <span class="cat-badge px-2">${item.category}</span></div>
              <div class="text-sm text-blue-700">السعر: ${item.price} د.ل</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button class="rounded px-2 py-1 bg-blue-200 text-blue-800 font-bold text-lg hover:bg-blue-400" onclick="setCartQty(${idx},${item.qty-1});renderCartModal()">-</button>
            <span class="font-mono px-2 text-blue-900">${item.qty}</span>
            <button class="rounded px-2 py-1 bg-blue-700 text-white font-bold text-lg hover:bg-blue-900" onclick="setCartQty(${idx},${item.qty+1});renderCartModal()">+</button>
            <button class="ml-1 text-red-700 hover:text-red-900" title="حذف" onclick="removeFromCart(${idx});renderCartModal()"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `;
    });
  }
  let total = appState.cart.reduce((a,b)=>a+(b.qty*b.price),0);
  modal.innerHTML = `
    <div class="bg-white rounded-xl shadow-xl max-w-xs w-full relative p-5 admin-modal">
      <button onclick="closeModal()" class="absolute top-2 left-3 text-blue-900 text-xl hover:text-red-700"><i class="fa-solid fa-arrow-right-long"></i></button>
      <div class="font-bold text-xl text-center mb-4 text-blue-800">سلة التسوق</div>
      <div id="cart-items-list">${listHtml}</div>
      <div class="mt-4 flex justify-between items-center border-t pt-3">
        <span class="font-bold text-blue-700">الإجمالي:</span>
        <span class="font-bold text-lg text-blue-900 ltr">${total} د.ل</span>
      </div>
      <div class="flex flex-col gap-2 mt-5">
        <button onclick="closeModal()" class="w-full py-3 bg-gray-100 text-blue-900 font-bold rounded hover:bg-gray-200 no-print">العودة</button>
        <button onclick="proceedCheckout()" class="w-full py-3 btn-main rounded font-bold hover:bg-blue-900 text-lg no-print" ${appState.cart.length === 0 ? 'disabled' : ''}>إتمام الدفع</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function renderCartModal() { 
  closeModal(); 
  showCart(); 
}

function updateCartCount(){
  appState.cart = loadLS('CART', []);
  let cnt = appState.cart.reduce((a,b)=>a+(b.qty||1),0);
  let el = document.getElementById('cart-count');
  if(!cnt) el.style.display = "none";
  else { el.textContent = cnt; el.style.display="inline-block"; }
}

function setCartQty(idx, qty){
  if(qty<1){ removeFromCart(idx); return;}
  appState.cart = loadLS('CART', []);
  appState.cart[idx].qty = qty;
  saveLS('CART',appState.cart);
  updateCartCount();
}

function removeFromCart(idx) {
  appState.cart = loadLS('CART', []);
  appState.cart.splice(idx,1);
  saveLS('CART',appState.cart)
  updateCartCount();
}

// الدفع + خيار التحويل
function proceedCheckout(){
  closeModal();
  appState.cart = loadLS('CART', []);
  if(!appState.cart.length) { toast('سلة التسوق فارغة','err'); return;}
  let total = appState.cart.reduce((a,b)=>a+(b.qty*b.price),0);
  let totalInQirsh = total * 1000;
  let transferCode = `*122*0948181815*${totalInQirsh}*1#`;
  let transferUrl = `tel:*122*0948181815*${totalInQirsh}*1%23`;

  let modal = document.createElement('div');
  modal.className = "modal-root fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-40";
  modal.innerHTML = `
    <div class="bg-white rounded-xl shadow-xl max-w-xs w-full relative p-6 admin-modal">
      <button onclick="closeModal()" class="absolute top-2 left-3 text-blue-800 text-xl hover:text-red-700"><i class="fa-solid fa-arrow-right-long"></i></button>
      <h2 class="text-lg font-bold mb-5 text-blue-800 flex items-center"><i class="fa-solid fa-credit-card mr-1"></i> الدفع والتحويل</h2>
      <div class="text-blue-800 text-center mb-2">
        يرجى تحويل المبلغ الإجمالي<br>
        <span class="text-xl font-extrabold">${total} د.ل</span>
        <br>إلى رقم المسؤول
      </div>
      <div class="bg-blue-50 border border-blue-200 p-3 rounded font-bold text-blue-900 text-lg text-center select-all mb-4">0948181815</div>
      <div class="mb-3">
        <a href="${transferUrl}" id="direct-transfer-btn" class="w-full py-3 font-bold text-lg flex items-center justify-center gap-2 pulse-animation direct-transfer-btn rounded-lg">
          <i class="fa-solid fa-phone"></i> تحويل الآن
        </a>
        <button id="copy-transfer-btn" class="w-full py-2 btn-main rounded font-bold text-lg flex items-center justify-center gap-2 copy-btn mt-2" onclick="copyTransferCode('${transferCode}')">
          <i class="fa-solid fa-copy"></i> نسخ كود التحويل
        </button>
        <div class="text-xs text-gray-500 mt-1">رصيد 1 دينار = 1000 قرش (قروض ليبيا)</div>
      </div>
      <form onsubmit="event.preventDefault();finishOrder(${total})" class="mt-3">
        <label class="block text-xs mb-1 font-bold text-blue-800">رقم هاتفك الذي حولت منه:</label>
        <input id="input-paid-phone" required type="tel" class="border rounded py-2 px-3 w-full mb-3 text-base" minlength="10" maxlength="11" placeholder="09xxxxxxxxx">
        <button type="submit" class="w-full py-2 btn-main rounded font-bold hover:bg-blue-900 no-print">تأكيد الطلب</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

function copyTransferCode(code){
  navigator.clipboard.writeText(code).then(() => {
    document.getElementById('copy-transfer-btn').innerHTML = '<i class="fa-solid fa-check"></i> تم النسخ';
    setTimeout(() => {
      document.getElementById('copy-transfer-btn').innerHTML = '<i class="fa-solid fa-copy"></i> نسخ كود التحويل';
    }, 2000);
  }).catch(err => {
    console.error('حدث خطأ أثناء نسخ النص: ', err);
    // في حالة فشل النسخ، نقدم تعليمات بديلة
    toast('يرجى النسخ يدويًا: ' + code, 'err');
  });
}

function directTransfer(transferCode) {
  // تحويل الكود إلى صيغة URL للاتصال
  let transferUrl = transferCode.replace('#', '%23');
  window.location.href = 'tel:' + transferUrl;
}

function finishOrder(total){
  let phone = document.getElementById('input-paid-phone').value.trim();
  if(!/^09\d{8,9}$/.test(phone)){
    toast('رقم الهاتف المدخل غير صحيح','err');
    document.getElementById('input-paid-phone').focus();
    return;
  }
  let orders = loadLS('ORDERS',[]);
  let items = loadLS('CART', []);
  let orderId = Date.now().toString();
  orders.push({
    id: orderId,
    products: items,
    total: total,
    userPhone: phone,
    date: (new Date()).toLocaleString('ar-EG')
  });
  saveLS('ORDERS', orders);
  saveLS('CART', []);
  updateCartCount();
  closeModal();
  let modal = document.createElement('div');
  modal.className = "modal-root fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50";
  modal.innerHTML = `
    <div class="bg-white rounded-xl text-center shadow-xl max-w-xs w-full relative p-7 flex flex-col items-center">
      <i class="fa-solid fa-circle-check text-green-600 text-5xl mb-6"></i>
      <h2 class="text-xl font-bold mb-2 text-green-700">تم حفظ طلبك بنجاح</h2>
      <div class="text-blue-800 mb-3">سيتم التواصل معك أو إرسال البطاقات بعد التحقق من التحويل.</div>
      <button onclick="closeModal();" class="mt-3 px-7 py-3 btn-main rounded font-bold no-print">العودة للرئيسية</button>
    </div>
  `;
  document.body.appendChild(modal);
}

// لوحة تحكم المسؤول
function showAdminModal(){
  if(localStorage.getItem('ADMIN_LOGGED')==='1'){
    showAdminPanel();
  } else {
    showAdminLogin();
  }
}

function showAdminLogin(){
  let modal = document.createElement('div');
  modal.className = "modal-root fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50";
  modal.innerHTML = `
    <form onsubmit="event.preventDefault();adminLogin();" class="bg-white rounded-xl admin-modal max-w-xs w-full p-6 relative">
      <button type="button" onclick="closeModal();" class="absolute top-2 left-3 text-blue-700 text-xl hover:text-red-700"><i class="fa-solid fa-arrow-right-long"></i></button>
      <h2 class="text-lg mb-4 text-center font-bold text-blue-800 flex items-center justify-center"><i class="fa-solid fa-user-lock"></i> تسجيل الدخول</h2>
      <div class="mb-3">
        <label class="block mb-1 text-sm font-bold">اسم الدخول</label>
        <input id="adm-u" type="text" autocomplete="username" class="w-full px-3 py-2 border rounded" required>
      </div>
      <div class="mb-4">
        <label class="block mb-1 text-sm font-bold">كلمة المرور</label>
        <input id="adm-p" type="password" autocomplete="current-password" class="w-full px-3 py-