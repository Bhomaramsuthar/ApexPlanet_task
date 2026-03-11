const products = [
    { id: 1, name: "Premium Smartphone X", category: "smartphones", price: 999, rating: 4.8, image: "fa-mobile-alt" },
    { id: 2, name: "UltraBook Pro 15", category: "laptops", price: 1499, rating: 4.9, image: "fa-laptop" },
    { id: 3, name: "Noise Cancelling Headphones", category: "headphones", price: 299, rating: 4.5, image: "fa-headphones" },
    { id: 4, name: "4K Monitor 27inch", category: "accessories", price: 399, rating: 4.6, image: "fa-desktop" },
    { id: 5, name: "Budget Phone Lite", category: "smartphones", price: 299, rating: 4.0, image: "fa-mobile-alt" },
    { id: 6, name: "Gaming Laptop Z", category: "laptops", price: 1899, rating: 4.7, image: "fa-gamepad" },
    { id: 7, name: "Wireless Earbuds", category: "headphones", price: 129, rating: 4.2, image: "fa-headphones-alt" },
    { id: 8, name: "Mechanical Keyboard", category: "accessories", price: 149, rating: 4.8, image: "fa-keyboard" },
    { id: 9, name: "Smart Watch Series 5", category: "accessories", price: 349, rating: 4.4, image: "fa-clock" },
    { id: 10, name: "Tablet Pro 11", category: "smartphones", price: 799, rating: 4.6, image: "fa-tablet-alt" }
];

document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const productCount = document.getElementById('product-count');
    const searchInput = document.getElementById('search-input');
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    const sortSelect = document.getElementById('sort-select');
    const resetBtn = document.getElementById('reset-filters');
    const categoryCheckboxes = document.querySelectorAll('#category-filters input');

    let currentProducts = [...products];

    // Initial Render
    renderProducts(currentProducts);

    // Event Listeners
    searchInput.addEventListener('input', filterProducts);
    priceRange.addEventListener('input', (e) => {
        priceValue.textContent = e.target.value;
        filterProducts();
    });
    sortSelect.addEventListener('change', sortProducts);
    resetBtn.addEventListener('click', resetFilters);

    categoryCheckboxes.forEach(cb => {
        cb.addEventListener('change', (e) => {
            // If "All" is clicked, uncheck others. If others clicked, uncheck "All"
            if (e.target.value === 'all' && e.target.checked) {
                categoryCheckboxes.forEach(box => {
                    if (box.value !== 'all') box.checked = false;
                });
            } else if (e.target.value !== 'all' && e.target.checked) {
                document.querySelector('input[value="all"]').checked = false;
            }
            // If no categories checked, re-check "All"
            const anyChecked = Array.from(categoryCheckboxes).some(box => box.checked);
            if (!anyChecked) {
                document.querySelector('input[value="all"]').checked = true;
            }

            filterProducts();
        });
    });

    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const maxPrice = parseInt(priceRange.value);

        // Get selected categories
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        currentProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm);
            const matchesPrice = product.price <= maxPrice;
            const matchesCategory = selectedCategories.includes('all') || selectedCategories.includes(product.category);

            return matchesSearch && matchesPrice && matchesCategory;
        });

        // Apply current sort
        sortProducts(null, false);
        renderProducts(currentProducts);
    }

    function sortProducts(e, render = true) {
        const value = sortSelect.value;

        switch (value) {
            case 'price-low':
                currentProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                currentProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                currentProducts.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // If default, we might want to sort by ID or keep filter order
                // For simplicity, let's sort by ID
                currentProducts.sort((a, b) => a.id - b.id);
        }

        if (render) renderProducts(currentProducts);
    }

    function resetFilters() {
        searchInput.value = '';
        priceRange.value = 2000;
        priceValue.textContent = '2000';
        sortSelect.value = 'default';

        categoryCheckboxes.forEach(cb => {
            cb.checked = cb.value === 'all';
        });

        currentProducts = [...products];
        renderProducts(currentProducts);
    }

    function renderProducts(productsToRender) {
        productGrid.innerHTML = '';
        productCount.textContent = productsToRender.length;

        if (productsToRender.length === 0) {
            productGrid.innerHTML = '<p class="no-results">No products found.</p>';
            return;
        }

        productsToRender.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image">
                    <i class="fas ${product.image}"></i>
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h4 class="product-title">${product.name}</h4>
                    <div class="product-rating">
                        ${getStars(product.rating)}
                        <span>(${product.rating})</span>
                    </div>
                    <div class="product-price-row">
                        <span class="product-price">$${product.price}</span>
                        <button class="add-to-cart"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });
    }

    function getStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) stars += '<i class="fas fa-star"></i>';
            else if (i - 0.5 <= rating) stars += '<i class="fas fa-star-half-alt"></i>';
            else stars += '<i class="far fa-star"></i>';
        }
        return stars;
    }
});
