document.addEventListener('DOMContentLoaded', function() {
  console.log("🚀 Trang checkout đang khởi chạy...");
  
  const formatCurrency = v => {
    if (isNaN(v)) return '0đ';
    return v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  // Elements
  const cartItemsEl = document.getElementById('cartItems');
  const emptyCartEl = document.getElementById('emptyCart');
  const subtotalEl = document.getElementById('subtotal');
  const shippingFeeEl = document.getElementById('shippingFee');
  const totalEl = document.getElementById('total');
  const discountEl = document.getElementById('discount');
  const engravingFeeEl = document.getElementById('engravingFee');
  
  const shippingDisplay = document.getElementById('shippingDisplay');
  const noShippingInfo = document.getElementById('noShippingInfo');
  const engravingInfo = document.getElementById('engravingInfo');
  const engravedNameCheckout = document.getElementById('engravedNameCheckout');
  
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const confirmOrderBtn = document.getElementById('confirmOrderBtn');
  const overlay = document.getElementById('overlay');
  const successPopup = document.getElementById('successPopup');
  const closePopupBtn = document.getElementById('closePopupBtn');
  const orderIdEl = document.getElementById('orderId');

  const showMessage = (message, type = 'info') => {
    const colors = { success: '#16a34a', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `position:fixed;top:20px;right:20px;background:${colors[type]};color:#fff;padding:12px 20px;border-radius:8px;z-index:1000;animation:slideInRight .3s ease;box-shadow:0 4px 12px rgba(0,0,0,.1);`;
    document.body.appendChild(toast);
    setTimeout(()=>{ toast.style.animation='slideOutRight .3s ease'; setTimeout(()=>toast.remove(),300); },3000);
  };

  // Add CSS keyframes for toasts
  const style = document.createElement('style');
  style.textContent = `@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOutRight{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}`;
  document.head.appendChild(style);

  let orderData = null;

  async function loadOrder() {
    try {
      const res = await fetch('/api/order');
      if (res.ok) {
        orderData = await res.json();
        console.log('✅ Loaded order from server:', orderData);
      } else if (res.status === 404) {
        orderData = null;
        console.log('❌ No order found on server');
      } else {
        throw new Error('Failed to load order');
      }
    } catch (err) {
      console.error('❌ Error fetching order:', err);
      orderData = null;
    }
  }

  function initializeCheckout() {
    if (!orderData) {
      showNoOrderData();
      return;
    }
    renderCart();
    displayShippingInfo();
    displayEngravingInfo();
    updateTotals();
    setupEventListeners();
  }

  function showNoOrderData() {
    if (emptyCartEl) emptyCartEl.style.display = 'block';
    if (shippingDisplay) shippingDisplay.style.display = 'none';
    if (engravingInfo) engravingInfo.style.display = 'none';
    if (noShippingInfo) noShippingInfo.style.display = 'block';
    if (confirmOrderBtn) { confirmOrderBtn.disabled = true; confirmOrderBtn.textContent = 'Không có dữ liệu đơn hàng'; confirmOrderBtn.style.background = '#ccc'; }
    showMessage('Không tìm thấy đơn hàng. Vui lòng quay lại giỏ hàng!', 'error');
  }

  function renderCart() {
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = '';
    if (!orderData.cart || orderData.cart.length === 0) {
      if (emptyCartEl) emptyCartEl.style.display = 'block';
      return;
    }
    if (emptyCartEl) emptyCartEl.style.display = 'none';
    orderData.cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name || 'Sản phẩm không tên'}</div>
          <div class="cart-item-price">${formatCurrency(item.price || 0)} x ${item.quantity || 0}</div>
        </div>
        <div class="cart-item-controls">
          <span style="font-weight:600;color:var(--color-text-dark);">${formatCurrency((item.price||0)*(item.quantity||0))}</span>
        </div>`;
      cartItemsEl.appendChild(div);
    });
  }

  function displayShippingInfo() {
    if (!orderData.shippingInfo) {
      if (shippingDisplay) shippingDisplay.style.display = 'none';
      if (noShippingInfo) noShippingInfo.style.display = 'block';
      return;
    }
    if (shippingDisplay) {
      shippingDisplay.style.display = 'block';
      const info = orderData.shippingInfo;
      const setTextContent = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text || 'N/A'; };
      setTextContent('displayFullname', info.fullname);
      setTextContent('displayPhone', info.phone);
      setTextContent('displayProvince', info.province);
      setTextContent('displayDistrict', info.district);
      setTextContent('displayAddress', info.address);
    }
    if (noShippingInfo) noShippingInfo.style.display = 'none';
  }

  function displayEngravingInfo() {
    if (!engravingInfo || !engravedNameCheckout) return;
    if (orderData.engravingName) {
      engravedNameCheckout.textContent = orderData.engravingName;
      engravingInfo.style.display = 'block';
    } else {
      engravingInfo.style.display = 'none';
    }
  }

  function updateTotals() {
    const subtotal = orderData.subtotal || 0;
    const engravingFee = orderData.engravingFee || 0;
    const shipping = orderData.shipping || 0;
    const discountAmount = orderData.discountAmount || 0;
    const total = orderData.total || 0;

    if (progressBar) {
      const progressPercent = Math.min((subtotal + engravingFee) / 150000 * 100, 100);
      progressBar.style.width = `${progressPercent}%`;
    }

    if (progressText) {
      if (shipping === 0 && (subtotal + engravingFee) > 0) {
        progressText.textContent = '🎉 Bạn được miễn phí vận chuyển!';
        progressText.style.color = '#16a34a';
      } else {
        progressText.textContent = 'Đơn hàng đang được xử lý';
        progressText.style.color = '#A68686';
      }
    }

    const updateElement = (element, value) => { if (element) element.textContent = value; };
    updateElement(subtotalEl, formatCurrency(subtotal));
    updateElement(engravingFeeEl, formatCurrency(engravingFee));
    updateElement(shippingFeeEl, shipping === 0 ? 'Miễn phí' : formatCurrency(shipping));
    updateElement(discountEl, `-${formatCurrency(discountAmount)}`);
    updateElement(totalEl, formatCurrency(total));
  }

  function setupEventListeners() {
    if (confirmOrderBtn) confirmOrderBtn.addEventListener('click', confirmOrder);
    if (closePopupBtn) closePopupBtn.addEventListener('click', closePopup);
    if (overlay) overlay.addEventListener('click', closePopup);
  }

  async function confirmOrder() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    if (!paymentMethod) {
      showMessage('Vui lòng chọn phương thức thanh toán!', 'error');
      return;
    }
    const orderId = `ORD${Date.now()}`;
    if (orderIdEl) orderIdEl.textContent = orderId;
    if (overlay) overlay.classList.remove('hidden');
    if (successPopup) successPopup.classList.remove('hidden');

    try {
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      orderHistory.unshift({ id: orderId, ...orderData, paymentMethod: paymentMethod.value, status: 'confirmed', orderDate: new Date().toISOString() });
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      await fetch('/api/order', { method: 'DELETE' });
      console.log('✅ Cleared current order on server');
    } catch (err) {
      console.error('❌ Error finalizing order:', err);
    }
  }

  function closePopup() {
    if (overlay) overlay.classList.add('hidden');
    if (successPopup) successPopup.classList.add('hidden');
    setTimeout(()=>{ window.location.href = '/cart/cart.html'; }, 800);
  }

  (async function main(){
    await loadOrder();
    initializeCheckout();
  })();
});
