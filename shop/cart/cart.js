document.addEventListener('DOMContentLoaded', function() {
  // ===== STATE =====
  let cartItems = [
    { id: 1, name: "Trà Sữa Trân Châu", price: 45000, quantity: 2 },
    { id: 2, name: "Trà Chanh Dây", price: 40000, quantity: 1 },
    { id: 3, name: "Cà Phê Sữa Đá", price: 35000, quantity: 1 }
  ];
  let engravingName = null;
  let discountPercent = 0;

  const ENGRAVING_FEE = 50000;
  const SHIPPING_FEE = 30000;
  const FREE_SHIPPING_THRESHOLD = 150000;

  // ===== ELEMENTS =====
  const provinceSelect = document.getElementById("province");
  const districtSelect = document.getElementById("district");
  const cartItemsEl = document.getElementById("cartItems");
  const emptyCartEl = document.getElementById("emptyCart");
  const subtotalEl = document.getElementById("subtotal");
  const shippingFeeEl = document.getElementById("shippingFee");
  const totalEl = document.getElementById("total");
  const discountRow = document.getElementById("discountRow");
  const discountEl = document.getElementById("discount");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const addEngravingBtn = document.getElementById("addEngravingBtn");
  const engraveNameInput = document.getElementById("engraveNameInput");
  const engravingDisplay = document.getElementById("engravingDisplay");
  const engravedNameEl = document.getElementById("engravedName");
  const removeEngravingBtn = document.getElementById("removeEngravingBtn");
  const engravingFeeRow = document.getElementById("engravingFeeRow");
  const engravingFeeEl = document.getElementById("engravingFee");
  const couponInput = document.getElementById("couponInput");
  const applyCouponBtn = document.getElementById("applyCouponBtn");
  const couponMessage = document.getElementById("couponMessage");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  // ===== HELPER FUNCTIONS =====
  const formatCurrency = v => {
    if (isNaN(v)) return '0đ';
    return v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };
  
  const showMessage = (message, type = 'info') => {
    const colors = {
      success: '#16a34a',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      animation: slideInRight 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // Keyframes for toast animations (in case CSS not loaded)
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
  `;
  document.head.appendChild(style);

  // ===== PROVINCE / DISTRICT DATA =====
  const PROVINCE_DISTRICTS = {
    "Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 10", "Thủ Đức", "Bình Thạnh"],
    "Hà Nội": ["Ba Đình", "Hoàn Kiếm", "Đống Đa", "Hai Bà Trưng", "Cầu Giấy", "Tây Hồ"],
    "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn"],
    "An Giang": ["Long Xuyên", "Châu Đốc"],
    "Bà Rịa - Vũng Tàu": ["Vũng Tàu", "Bà Rịa"],
    "Bắc Giang": ["Bắc Giang"],
    "Bắc Kạn": ["Bắc Kạn"],
    "Bạc Liêu": ["Bạc Liêu"],
    "Bắc Ninh": ["Bắc Ninh", "Từ Sơn"],
    "Bến Tre": ["Bến Tre"],
    "Bình Định": ["Quy Nhơn"],
    "Bình Dương": ["Thủ Dầu Một", "Dĩ An", "Thuận An"],
    "Bình Phước": ["Đồng Xoài"],
    "Bình Thuận": ["Phan Thiết"],
    "Cà Mau": ["Cà Mau"],
    "Cần Thơ": ["Ninh Kiều", "Bình Thủy", "Cái Răng"],
    "Cao Bằng": ["Cao Bằng"],
    "Đắk Lắk": ["Buôn Ma Thuột"],
    "Đắk Nông": ["Gia Nghĩa"],
    "Điện Biên": ["Điện Biên Phủ"],
    "Đồng Nai": ["Biên Hòa", "Long Khánh"],
    "Đồng Tháp": ["Cao Lãnh", "Sa Đéc"],
    "Gia Lai": ["Pleiku"],
    "Hà Giang": ["Hà Giang"],
    "Hà Nam": ["Phủ Lý"],
    "Hà Tĩnh": ["Hà Tĩnh"],
    "Hải Dương": ["Hải Dương"],
    "Hải Phòng": ["Hồng Bàng", "Lê Chân", "Ngô Quyền"],
    "Hậu Giang": ["Vị Thanh"],
    "Hòa Bình": ["Hòa Bình"],
    "Hưng Yên": ["Hưng Yên"],
    "Khánh Hòa": ["Nha Trang", "Cam Ranh"],
    "Kiên Giang": ["Rạch Giá", "Phú Quốc"],
    "Kon Tum": ["Kon Tum"],
    "Lai Châu": ["Lai Châu"],
    "Lâm Đồng": ["Đà Lạt", "Bảo Lộc"],
    "Lạng Sơn": ["Lạng Sơn"],
    "Lào Cai": ["Lào Cai", "Sa Pa"],
    "Long An": ["Tân An"],
    "Nam Định": ["Nam Định"],
    "Nghệ An": ["Vinh"],
    "Ninh Bình": ["Ninh Bình"],
    "Ninh Thuận": ["Phan Rang - Tháp Chàm"],
    "Phú Thọ": ["Việt Trì"],
    "Phú Yên": ["Tuy Hòa"],
    "Quảng Bình": ["Đồng Hới"],
    "Quảng Nam": ["Tam Kỳ", "Hội An"],
    "Quảng Ngãi": ["Quảng Ngãi"],
    "Quảng Ninh": ["Hạ Long", "Cẩm Phả"],
    "Quảng Trị": ["Đông Hà"],
    "Sóc Trăng": ["Sóc Trăng"],
    "Sơn La": ["Sơn La"],
    "Tây Ninh": ["Tây Ninh"],
    "Thái Bình": ["Thái Bình"],
    "Thái Nguyên": ["Thái Nguyên"],
    "Thanh Hóa": ["Thanh Hóa", "Sầm Sơn"],
    "Thừa Thiên Huế": ["Huế"],
    "Tiền Giang": ["Mỹ Tho"],
    "Trà Vinh": ["Trà Vinh"],
    "Tuyên Quang": ["Tuyên Quang"],
    "Vĩnh Long": ["Vĩnh Long"],
    "Vĩnh Phúc": ["Vĩnh Yên"],
    "Yên Bái": ["Yên Bái"]
  };

  // ===== INIT DROPDOWN =====
  function initProvinceDropdown() {
    provinceSelect.innerHTML = '<option value="">Chọn Tỉnh/Thành phố</option>';
    districtSelect.innerHTML = '<option value="">Chọn Quận/Huyện</option>';
    Object.keys(PROVINCE_DISTRICTS).forEach(province => {
      const option = document.createElement("option");
      option.value = province;
      option.textContent = province;
      provinceSelect.appendChild(option);
    });
  }

  // ===== RENDER CART =====
  function renderCart() {
    cartItemsEl.innerHTML = "";
    if (cartItems.length === 0) {
      emptyCartEl.style.display = 'block';
      subtotalEl.textContent = '0đ';
      shippingFeeEl.textContent = '0đ';
      totalEl.textContent = '0đ';
      progressBar.style.width = '0%';
      progressText.textContent = `Thêm ${formatCurrency(FREE_SHIPPING_THRESHOLD)} để được miễn phí ship`;
      progressText.style.color = '#A68686';
      return;
    }

    emptyCartEl.style.display = 'none';

    cartItems.forEach(item => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatCurrency(item.price)} x ${item.quantity}</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-id="${item.id}" data-change="-1">-</button>
          <span style="margin: 0 10px; font-weight: 600;">${item.quantity}</span>
          <button class="qty-btn" data-id="${item.id}" data-change="1">+</button>
        </div>
      `;
      cartItemsEl.appendChild(div);
    });

    updateTotals();
  }

  // ===== CHANGE QUANTITY =====
  function changeQuantity(id, change) {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        cartItems = cartItems.filter(i => i.id !== id);
      }
      renderCart();
    }
  }

  // ===== SETUP EVENT LISTENERS =====
  function setupEventListeners() {
    cartItemsEl.addEventListener('click', function(e) {
      if (e.target.classList.contains('qty-btn')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        const change = parseInt(e.target.getAttribute('data-change'));
        changeQuantity(id, change);
      }
    });

    provinceSelect.addEventListener("change", function() {
      districtSelect.innerHTML = '<option value="">Chọn Quận/Huyện</option>';
      const districts = PROVINCE_DISTRICTS[this.value] || [];
      districts.forEach(district => {
        const option = document.createElement("option");
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
      });
      districtSelect.disabled = districts.length === 0;
      updateTotals();
    });

    districtSelect.addEventListener("change", updateTotals);

    addEngravingBtn.addEventListener("click", function() {
      const name = engraveNameInput.value.trim();
      if (!name) {
        showMessage("Vui lòng nhập tên cần khắc!", "error");
        return;
      }
      engravingName = name;
      engravedNameEl.textContent = name;
      engravingDisplay.style.display = "flex";
      engraveNameInput.value = "";
      updateTotals();
      showMessage("Đã thêm dịch vụ khắc tên!", "success");
    });

    removeEngravingBtn.addEventListener("click", function() {
      engravingName = null;
      engravingDisplay.style.display = "none";
      updateTotals();
      showMessage("Đã xóa dịch vụ khắc tên", "info");
    });

    applyCouponBtn.addEventListener("click", function() {
      const code = couponInput.value.trim().toUpperCase();
      if (code === 'BANMOI') {
        discountPercent = 15;
        couponMessage.textContent = "✅ Áp dụng thành công giảm 15%";
        couponMessage.style.color = "#16a34a";
      } else {
        discountPercent = 0;
        couponMessage.textContent = "❌ Mã giảm giá không hợp lệ";
        couponMessage.style.color = "#ef4444";
      }
      couponMessage.classList.remove("hidden");
      updateTotals();
    });

    clearCartBtn.addEventListener("click", function() {
      if (confirm("Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?")) {
        cartItems = [];
        renderCart();
        showMessage("Đã xóa giỏ hàng", "success");
      }
    });

    checkoutBtn.addEventListener("click", async function() {
      const fullname = document.getElementById("fullname").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const province = provinceSelect.value;
      const district = districtSelect.value;
      const address = document.getElementById("address").value.trim();
      
      if (cartItems.length === 0) return showMessage("Giỏ hàng trống!", "error");
      if (!fullname) return showMessage("Vui lòng nhập họ và tên!", "error");
      if (!phone) return showMessage("Vui lòng nhập số điện thoại!", "error");
      if (!province) return showMessage("Vui lòng chọn tỉnh/thành phố!", "error");
      if (!district) return showMessage("Vui lòng chọn quận/huyện!", "error");
      if (!address) return showMessage("Vui lòng nhập địa chỉ chi tiết!", "error");

      // Tính toán tổng tiền
      const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      const engravingFee = engravingName ? ENGRAVING_FEE : 0;
      const subPlusEngraving = subtotal + engravingFee;
      const shipping = subtotal > 0 && subPlusEngraving < FREE_SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
      const discountAmount = Math.round(subPlusEngraving * discountPercent / 100);
      const total = subPlusEngraving - discountAmount + shipping;

      const orderData = {
        cart: [...cartItems],
        engravingName,
        shippingInfo: { fullname, phone, province, district, address },
        subtotal,
        engravingFee,
        shipping,
        discountPercent,
        discountAmount,
        total,
        timestamp: new Date().toISOString()
      };

      try {
        const res = await fetch('/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
        if (!res.ok) {
          showMessage('Lỗi: Không thể lưu dữ liệu đơn hàng!', 'error');
          return;
        }
        showMessage('Đang chuyển đến trang thanh toán...', 'success');
        setTimeout(() => { window.location.href = '/checkout/checkout.html'; }, 800);
      } catch (err) {
        console.error('❌ Lỗi khi gọi API:', err);
        showMessage('Lỗi hệ thống, vui lòng thử lại!', 'error');
      }
    });
  }

  // ===== UPDATE TOTALS =====
  function updateTotals() {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const engravingFee = engravingName ? ENGRAVING_FEE : 0;
    const subPlusEngraving = subtotal + engravingFee;
    const shipping = subtotal > 0 && subPlusEngraving < FREE_SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
    const discountAmount = Math.round(subPlusEngraving * discountPercent / 100);
    const total = subPlusEngraving - discountAmount + shipping;

    subtotalEl.textContent = formatCurrency(subtotal);

    if (engravingName) {
      engravingFeeEl.textContent = formatCurrency(engravingFee);
      engravingFeeRow.style.display = 'flex';
    } else {
      engravingFeeRow.style.display = 'none';
    }

    if (subtotal === 0) {
      shippingFeeEl.textContent = formatCurrency(0);
    } else if (shipping === 0) {
      shippingFeeEl.textContent = 'Miễn phí';
    } else {
      shippingFeeEl.textContent = formatCurrency(shipping);
    }

    if (discountPercent > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `-${formatCurrency(discountAmount)}`;
    } else {
      discountRow.style.display = 'none';
    }

    totalEl.textContent = formatCurrency(total);

    const progressPercent = Math.min((subPlusEngraving / FREE_SHIPPING_THRESHOLD) * 100, 100);
    progressBar.style.width = `${progressPercent}%`;

    if (subPlusEngraving >= FREE_SHIPPING_THRESHOLD) {
      progressText.textContent = '🎉 Bạn đã được miễn phí ship!';
      progressText.style.color = '#16a34a';
    } else {
      const needed = FREE_SHIPPING_THRESHOLD - subPlusEngraving;
      progressText.textContent = `Thêm ${formatCurrency(needed)} để được miễn phí ship`;
      progressText.style.color = '#A68686';
    }
  }

  // ===== INITIALIZE =====
  function initialize() {
    initProvinceDropdown();
    engravingDisplay.style.display = 'none';
    engravingFeeRow.style.display = 'none';
    discountRow.style.display = 'none';
    couponMessage.classList.add('hidden');
    setupEventListeners();
    renderCart();
  }

  initialize();
});
