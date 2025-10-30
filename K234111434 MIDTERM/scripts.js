document.addEventListener('DOMContentLoaded', () => {
    const STUDENT_NAME = 'Nguyen Van A';      // Thay tên bạn vào đây
    const STUDENT_ID   = 'SE123456';
    const STUDENT_CLASS = 'SE18A';

    /* ==================== Q2 – Default page ==================== */
    $('#studentId').textContent   = STUDENT_ID;
    $('#studentName').textContent = STUDENT_NAME;
    $('#studentClass').textContent = STUDENT_CLASS;

    /* ==================== Q1 – Menu navigation ==================== */
    $$('.menu-item').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = link.dataset353.content + '-content';
            $$('.menu-item').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            $$('.content-panel').forEach(p => p.classList.add('hidden'));
            $(`#${target}`).classList.remove('hidden');

            if (target === 'books-content' && !window.booksLoaded) loadBooks();
            if (target === 'customers-content' && !window.custLoaded) { renderCustomers(); window.custLoaded = true; }
            if (target === 'rss-content' && !window.rssLoaded) loadRSS();
        });
    });

    const $  = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

    /* ==================== Q8 – Stock AJAX ==================== */
    $('#loadStockBtn').addEventListener('click', () => {
        const tbody = $('#stock-tbody');
        tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
        fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://gadgets.dantri.com.vn/api/finance/stocks'))
            .then(r => r.json())
            .then(d => JSON.parse(d.contents))
            .then(arr => {
                tbody.innerHTML = '';
                arr.forEach(s => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${s.code}</td><td>${s.price}</td><td>${s.sourceUpdatedAt}</td>`;
                    tbody.appendChild(tr);
                });
            })
            .catch(() => tbody.innerHTML = '<tr><td colspan="3">Failed to load.</td></tr>');
    });

    /* ==================== Q3 – Books XML ==================== */
    function loadBooks() {
        const tbody = $('#books-table tbody');
        tbody.innerHTML = '<tr><td colspan="4">Loading books...</td></tr>';
        fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://tranduythanh.com/datasets/books.xml'))
            .then(r => r.json())
            .then(d => new DOMParser().parseFromString(d.contents, 'application/xml'))
            .then(xml => {
                const books = xml.querySelectorAll('book');
                tbody.innerHTML = '';
                books.forEach(b => {
                    const id   = b.querySelector('id').textContent;
                    const name = b.querySelector('name').textContent.trim();
                    const desc = b.querySelector('description').textContent.trim();
                    const img  = b.querySelector('image').textContent;
                    const tr   = document.createElement('tr');
                    tr.innerHTML = `<td>${id}</td><td><img src="${img}" alt="${name}"></td><td>${name}</td><td>${desc}</td>`;
                    tbody.appendChild(tr);
                });
                window.booksLoaded = true;
            })
            .catch(() => tbody.innerHTML = '<tr><td colspan="4">Failed to load books.</td></tr>');
    }

    /* ==================== Q4 – Customers ==================== */
    let customers = JSON.parse(localStorage.getItem('kiwi-customers') || '[]');
    function renderCustomers() {
        const tbody = $('#custTable tbody');
        tbody.innerHTML = '';
        customers.forEach((c, i) => {
            const tr = document.createElement('tr');
            tr.dataset.idx = i;
            const ageBg = (c.age >= 18 && c.age <= 35) ? 'yellow' : 'magenta';
            tr.innerHTML = `
                <td>${c.id}</td><td>${c.name}</td><td>${c.phone}</td><td>${c.email}</td>
                <td style="background:${ageBg}">${c.age}</td>
                <td><button class="del">Delete</button></td>`;
            tbody.appendChild(tr);
        });
    }
    $('#customerForm').addEventListener('submit', e => {
        e.preventDefault();
        const id = +$('#cid').value;
        const idx = customers.findIndex(c => c.id === id);
        const cust = {
            id, name: $('#cname').value, phone: $('#cphone').value,
            email: $('#cemail').value, age: +$('#cage').value || 0
        };
        if (idx > -1) customers[idx] = cust;
        else customers.push(cust);
        localStorage.setItem('kiwi-customers', JSON.stringify(customers));
        renderCustomers();
        e.target.reset();
    });
    $('#custTable').addEventListener('click', e => {
        if (e.target.classList.contains('del') && confirm('Delete this customer?')) {
            const idx = e.target.closest('tr').dataset.idx;
            customers.splice(idx, 1);
            localStorage.setItem('kiwi-customers', JSON.stringify(customers));
            renderCustomers();
        }
    });
    renderCustomers();

    /* ==================== Q6 – Weather API ==================== */
    const OPENWEATHER_KEY = 'YOUR_KEY_HERE'; // Thay bằng key thật
    $('#getWeatherBtn').addEventListener('click', () => {
        const city = $('#cityInput').value.trim() || 'Hanoi';
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_KEY}&units=metric`)
            .then(r => r.json())
            .then(d => {
                $('#wCity').textContent = d.name;
                $('#wTemp').textContent = `${d.main.temp} °C`;
                $('#wDesc').textContent = d.weather[0].description;
                $('#weatherTable').hidden = false;
            })
            .catch(() => alert('Check city or API key'));
    });

    /* ==================== Q7 – RSS ==================== */
    function loadRSS() {
        const container = $('#rssFeed');
        container.innerHTML = 'Loading RSS...';
        fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://vnexpress.net/rss/giao-duc.rss'))
            .then(r => r.json())
            .then(d => new DOMParser().parseFromString(d.contents, 'application/xml'))
            .then(xml => {
                const items = xml.querySelectorAll('item');
                container.innerHTML = '';
                items.forEach(it => {
                    const title = it.querySelector('title').textContent;
                    const link  = it.querySelector('link').textContent;
                    const p = document.createElement('p');
                    p.innerHTML = `<a href="${link}" target="_blank" style="color:#006064;">${title}</a>`;
                    container.appendChild(p);
                });
                window.rssLoaded = true;
            })
            .catch(() => container.innerHTML = 'Failed to load RSS.');
    }

    /* ==================== Q10 – Footer ==================== */
    function updateFooter() {
        const now = new Date();
        $('#footerName').textContent = STUDENT_NAME;
        $('#footerDate').textContent = now.toLocaleString();
    }
    updateFooter();
    setInterval(updateFooter, 1000);
});