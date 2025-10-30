document.addEventListener('DOMContentLoaded', () => {
    // --- State to prevent re-fetching data ---
    let booksLoaded = false;
    let customers = []; // Q4: Array to store customer data

    // --- Initial data loading ---
    fetchAndDisplayStocks();

    // --- Main Menu Navigation (Q1) ---
    const menuItems = document.querySelectorAll('.menu-item');
    const contentPanels = document.querySelectorAll('.content-panel');

    menuItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const contentId = item.getAttribute('data-content');
            
            const targetContent = document.getElementById(`${contentId}-content`);
            if (!targetContent) return;

            // Manage active classes for menu items and visibility for content panels
            menuItems.forEach(link => link.classList.remove('active'));
            item.classList.add('active');
            
            contentPanels.forEach(panel => panel.classList.add('hidden'));
            targetContent.classList.remove('hidden');

            // --- Trigger data loading for specific sections ---
            if (contentId === 'books' && !booksLoaded) {
                fetchAndDisplayBooks();
            }
        });
    });

    // --- Q4: Customer Management ---
    const customerForm = document.getElementById('add-customer-form');
    const customerTableBody = document.getElementById('customers-tbody');

    customerForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Get values from form
        const customer = {
            id: document.getElementById('customer-id').value,
            name: document.getElementById('customer-name').value,
            phone: document.getElementById('customer-phone').value,
            email: document.getElementById('customer-email').value,
            age: parseInt(document.getElementById('customer-age').value, 10)
        };
        
        // Add to array and re-render table
        customers.push(customer);
        renderCustomerTable();
        
        // Reset form
        customerForm.reset();
    });

    function renderCustomerTable() {
        customerTableBody.innerHTML = ''; // Clear existing table

        if (customers.length === 0) {
            customerTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No customers added yet.</td></tr>';
            return;
        }

        customers.forEach(customer => {
            const row = customerTableBody.insertRow();
            
            // Apply conditional background color based on age
            const age = customer.age;
            if (age >= 18 && age <= 35) {
                row.className = 'age-yellow';
            } else {
                row.className = 'age-magenta';
            }

            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td>${customer.email}</td>
                <td>${customer.age}</td>
                <td>
                    <button class="delete-btn" data-id="${customer.id}" title="Delete Customer">
                        &#10006;
                    </button>
                </td>
            `;
        });
    }

    // Event delegation for delete buttons
    customerTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const customerId = event.target.getAttribute('data-id');
            const confirmDelete = confirm(`Are you sure you want to delete customer with ID: ${customerId}?`);

            if (confirmDelete) {
                customers = customers.filter(c => c.id !== customerId);
                renderCustomerTable();
            }
        }
    });

    // Initial render
    renderCustomerTable();


    // --- Q8 (Part B): Fetch and Display Stocks ---
    async function fetchAndDisplayStocks() {
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const apiUrl = 'https://gadgets.dantri.com.vn/api/finance/stocks';
        const tableBody = document.querySelector('#stock-tbody');

        tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Loading stocks...</td></tr>';

        try {
            const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            const stockList = JSON.parse(data.contents); // The actual JSON is in the 'contents' property

            tableBody.innerHTML = ''; // Clear loading state

            if (!stockList || stockList.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No stock data available.</td></tr>';
                return;
            }

            stockList.forEach(stock => {
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${stock.code}</td>
                    <td>${stock.price}</td>
                    <td>${stock.sourceUpdatedAt}</td>
                `;
            });

        } catch (error) {
            console.error("Error fetching stock data:", error);
            tableBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Failed to load stocks.</td></tr>`;
        }
    }


    // --- Q3: Fetch and Display Books from XML ---
    async function fetchAndDisplayBooks() {
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const xmlUrl = 'https://tranduythanh.com/datasets/books.xml';
        const tableBody = document.querySelector('#books-table tbody');
        
        // Show loading state
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Loading books...</td></tr>';

        try {
            const response = await fetch(proxyUrl + encodeURIComponent(xmlUrl));
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            const xmlString = data.contents;
            
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "application/xml");
            
            const parseError = xmlDoc.querySelector("parsererror");
            if (parseError) {
                console.error("XML Parsing Error:", parseError);
                throw new Error("Failed to parse XML data.");
            }

            const books = xmlDoc.querySelectorAll("book");
            tableBody.innerHTML = ''; // Clear loading state

            if (books.length === 0) {
                 tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No books found.</td></tr>';
                 return;
            }

            books.forEach(book => {
                const getText = (element, tagName) => {
                    const node = element.querySelector(tagName);
                    return node ? node.textContent.trim() : 'N/A';
                };

                const id = getText(book, 'id');
                const name = getText(book, 'name');
                const description = getText(book, 'description');
                const imageUrl = getText(book, 'image');

                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${id}</td>
                    <td><img src="${imageUrl}" alt="${name}"></td>
                    <td>${name}</td>
                    <td>${description}</td>
                `;
            });
            
            booksLoaded = true; // Mark as loaded to prevent re-fetch

        } catch (error) {
            console.error("Error fetching or parsing books XML:", error);
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Failed to load books. ${error.message}</td></tr>`;
        }
    }
});