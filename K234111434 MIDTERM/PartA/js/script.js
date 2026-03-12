// ======== Router & Menu ========
document.addEventListener('DOMContentLoaded', () => {
  const menuLinks = document.querySelectorAll('.menu-link[data-page]');
  menuLinks.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navigate(a.dataset.page);
    });
  });
  navigate('about');
  startFooterClock('Nguyễn Vân Ngọc Khánh – K234111434');
});

function navigate(page) {
  clearBDynamic();
  switch (page) {
    case 'about': renderAbout(); break;
    case 'books': renderBooks(); break;
    case 'customers': renderCustomers(); break;
    case 'style': renderStyle(); break;
    case 'weather': renderWeather(); break;
    case 'rss': renderRss(); break;
    case 'stocks': renderStocks(); break;
    default: renderAbout();
  }
}

function clearBDynamic() {
  const bd = document.getElementById('b-dynamic');
  if (bd) bd.innerHTML = '';
}

// ======== ABOUT ========
function renderAbout() {
  document.getElementById('content-area').innerHTML = `
  <div class="card">
    <h2>About Me</h2>
    <div class="about">
      <img src="images/khanh.jpg" style="width:90px;border-radius:50%;border:2px solid #f3dbe0;">
      <div>
        <p><b>Student:</b> Nguyễn Vân Ngọc Khánh</p>
        <p><b>ID:</b> K234111434</p>
        <p><b>Theme:</b> Sakura Pink – BW03</p>
      </div>
    </div>
  </div>`;
}

// ======== BOOKS (XML) ========
function renderBooks() {
  const content = document.getElementById('content-area');
  content.innerHTML = `
    <div class="card">
      <h2>Books (XML)</h2>
      <div class="responsive-table">
        <table class="table-modern">
          <caption>Danh sách Books từ XML</caption>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Description</th><th>Image</th></tr>
          </thead>
          <tbody id="books-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  // 📚 Fetch file XML thật trong thư mục dataset/
  fetch('../html/books.xml')
    .then(r => r.text())
    .then(text => {
      const xml = new DOMParser().parseFromString(text, 'text/xml');
      let books = Array.from(xml.getElementsByTagName('book'));
      if (!books.length) {
        const catalog = xml.querySelector('catalog, bookstore');
        if (catalog) books = Array.from(catalog.getElementsByTagName('book'));
      }

      const tbody = document.getElementById('books-tbody');
      if (!books.length) {
        tbody.innerHTML = '<tr><td colspan="4">Không tìm thấy dữ liệu book trong XML.</td></tr>';
        return;
      }

      tbody.innerHTML = books.map(b => {
        const id = b.querySelector('id')?.textContent || '';
        const name = b.querySelector('name')?.textContent || '';
        const desc = b.querySelector('description')?.textContent || '';
        const img = b.querySelector('image')?.textContent || '';
        return `
          <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td class="truncate">${desc}</td>
            <td>${img ? `<img src="${img}" width="60" alt="${name}">` : ''}</td>
          </tr>`;
      }).join('');
    })
    .catch(err => {
      document.getElementById('books-tbody').innerHTML = `<tr><td colspan="4">Lỗi đọc XML: ${err}</td></tr>`;
    });
}

// ======== CUSTOMERS (Form & LocalStorage) ========
function renderCustomers() {
  const content = document.getElementById('content-area');
  content.innerHTML = `
    <div class="card">
      <h2>Customers</h2>
      <p class="note">Tuổi 18–35: nền vàng pastel; ngoài khoảng: nền hồng. Có thể xóa khách hàng.</p>
      <table class="table-modern">
        <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Age</th><th>Action</th></tr></thead>
        <tbody id="customers-tbody"></tbody>
      </table>
    </div>
  `;

  const bd = document.getElementById('b-dynamic');
  bd.innerHTML = `
    <div class="sidebar-card">
      <h4>Thêm Customers</h4>
      <form id="form-cus">
        <label>ID</label><input id="cid" required>
        <label>Name</label><input id="cname" required>
        <label>Phone</label><input id="cphone" required>
        <label>Email</label><input id="cemail" required>
        <label>Age</label><input id="cage" type="number" required min="1">
        <button type="submit" class="menu-link" style="background:#e6a6b0;color:white;">Save</button>
      </form>
    </div>
  `;

  const form = document.getElementById('form-cus');
  const tbody = document.getElementById('customers-tbody');
  let list = JSON.parse(localStorage.getItem('sakura_customers') || '[]');
  redraw();

  form.onsubmit = e => {
    e.preventDefault();
    const c = {
      id: cid.value.trim(),
      name: cname.value.trim(),
      phone: cphone.value.trim(),
      email: cemail.value.trim(),
      age: +cage.value
    };
    if (list.some(x => x.id === c.id)) return alert('ID trùng!');
    if (!/^0\\d{9}$/.test(c.phone)) return alert('Số điện thoại không hợp lệ!');
    list.push(c);
    localStorage.setItem('sakura_customers', JSON.stringify(list));
    form.reset();
    redraw();
  };

  tbody.onclick = e => {
    if (e.target.tagName === 'BUTTON') {
      list.splice(e.target.dataset.i, 1);
      localStorage.setItem('sakura_customers', JSON.stringify(list));
      redraw();
    }
  };

  function redraw() {
    tbody.innerHTML = '';
    list.forEach((x, i) => {
      const cls = x.age >= 18 && x.age <= 35 ? 'age-18-35' : 'age-other';
      tbody.innerHTML += `
        <tr class="${cls}">
          <td>${x.id}</td>
          <td>${x.name}</td>
          <td>${x.phone}</td>
          <td>${x.email}</td>
          <td>${x.age}</td>
          <td><button data-i="${i}" class="menu-link" style="background:#f9c6cf;">Delete</button></td>
        </tr>`;
    });
  }
}

// ======== STYLE DEMO ========
function renderStyle() {
  document.getElementById('content-area').innerHTML = `
  <div class="card">
    <h2>Style Demo</h2>
    <div class="grid cols-3">
      <div><h3>Inline</h3><div style="background:#ffe4eb;border:2px dashed #e6a6b0;padding:10px;border-radius:8px;">Inline Style</div></div>
      <div><h3>Internal</h3><style>.internal-box{background:#fde2e7;border:2px solid #e6a6b0;padding:10px;border-radius:8px;}</style><div class="internal-box">Internal Style</div></div>
      <div><h3>External</h3><div class="external-box">External Style</div></div>
    </div>
  </div>`;
}

// ======== WEATHER API ========
function renderWeather() {
  const c = document.getElementById('content-area');
  c.innerHTML = `<div class="card"><h2>Weather API</h2><div id="weather_grid" class="weather-grid"></div></div>`;
  fetch('https://webapi.dantri.com.vn/misc')
    .then(r => r.json())
    .then(d => {
      const g = document.getElementById('weather_grid');
      g.innerHTML = d.weathers.map(w => `
        <div class="weather-card">
          <b>${w.name}</b><br>${w.temperature}°C<br>${w.clouds}
        </div>`).join('');
    })
    .catch(() => document.getElementById('weather_grid').textContent = 'Không tải được dữ liệu.');
}

// ======== RSS ========
function renderRss() {
  const c = document.getElementById('content-area');
  c.innerHTML = `<div class="card"><h2>VNExpress RSS</h2><div id="rss"></div></div>`;
  fetch('https://api.allorigins.win/raw?url=https://vnexpress.net/rss/giao-duc.rss')
    .then(r => r.text())
    .then(t => {
      const x = new DOMParser().parseFromString(t, 'text/xml');
      let html = '';
      x.querySelectorAll('item').forEach(it => {
        const title = it.querySelector('title')?.textContent;
        const link = it.querySelector('link')?.textContent;
        html += `<p><a href="${link}" target="_blank">${title}</a></p>`;
      });
      document.getElementById('rss').innerHTML = html;
    })
    .catch(() => document.getElementById('rss').textContent = 'Không tải được RSS.');
}

// ======== STOCKS (AJAX API) ========
function renderStocks() {
  const c = document.getElementById('content-area');
  c.innerHTML = `
  <div class="card">
    <h2>Stocks (AJAX)</h2>
    <div class="stock-toolbar">
      <input id="stock_search" type="text" placeholder="Tìm mã (VD: VNM)">
      <select id="stock_sort">
        <option value="code">Theo mã</option>
        <option value="price">Theo giá</option>
      </select>
    </div>
    <div id="stock_grid" class="stock-grid"></div>
  </div>`;

  const grid = document.getElementById('stock_grid');
  fetch('https://gadgets.dantri.com.vn/api/finance/stocks')
    .then(r => r.json())
    .then(data => {
      const list = Array.isArray(data) ? data : data.stocks || data.data || [];
      if (!list.length) return grid.innerHTML = '<div>Không có dữ liệu.</div>';
      render(list);

      const search = document.getElementById('stock_search');
      const sort = document.getElementById('stock_sort');
      search.addEventListener('input', update);
      sort.addEventListener('change', update);

      function update() {
        const text = search.value.trim().toUpperCase();
        const mode = sort.value;
        let filtered = list.filter(it => (it.Code || it.code || '').toUpperCase().includes(text));
        filtered.sort((a, b) => mode === 'price'
          ? (b.Price || b.price || 0) - (a.Price || a.price || 0)
          : (a.Code || a.code || '').localeCompare(b.Code || b.code || '')
        );
        render(filtered);
      }

      function render(arr) {
        grid.innerHTML = arr.map(it => `
          <div class="stock-card">
            <div class="stock-code">${it.Code || it.code}</div>
            <div class="stock-price">${it.Price || it.price}</div>
            <div class="stock-time">${it.sourceUpdatedAt ? new Date(it.sourceUpdatedAt).toLocaleTimeString() : ''}</div>
          </div>`).join('');
      }
    })
    .catch(err => grid.innerHTML = `<div>Lỗi tải dữ liệu: ${err}</div>`);
}

// ======== FOOTER CLOCK ========
function startFooterClock(name) {
  const el = document.getElementById('footer-text');
  setInterval(() => {
    el.textContent = `Designed by ${name}, today is ${new Date().toLocaleString()}`;
  }, 1000);
}
