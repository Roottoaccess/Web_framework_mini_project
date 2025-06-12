let cart = JSON.parse(localStorage.getItem('cart')) || {};

// Tax rate constant
const TAX_RATE = 0.014; // 1.4%

function addToCart(button) {
    if (!isLoggedIn()) {
        // Store current page URL for redirect after login
        sessionStorage.setItem('redirectUrl', window.location.href);
        window.location.href = 'login.html';
        return;
    }

    const item = button.parentElement;
    const itemId = item.dataset.id;
    const itemName = item.dataset.name;
    const itemPrice = parseFloat(item.dataset.price);
    const itemImage = item.dataset.image;

    if (cart[itemId]) {
        cart[itemId].quantity++;
    } else {
        cart[itemId] = {
            name: itemName,
            price: itemPrice,
            image: itemImage,
            quantity: 1
        };
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay(); // Update cart display if on cart page
    showAddedToCartAnimation(button);
}

function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function updateCartCount() {
    const count = Object.values(cart).reduce((total, item) => total + item.quantity, 0);
    // Create or update cart count element
    let cartCount = document.querySelector('.cart-count');
    if (!cartCount) {
        cartCount = document.createElement('span');
        cartCount.className = 'cart-count';
        document.querySelector('a[href="cart.html"]').appendChild(cartCount);
    }
    cartCount.textContent = count;
}

function showAddedToCartAnimation(button) {
    button.classList.add('added');
    button.textContent = 'Added!';
    setTimeout(() => {
        button.classList.remove('added');
        button.textContent = 'Add to Cart';
    }, 1000);
}

// New functions for cart display and calculations
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return; // Only proceed if we're on the cart page

    // Clear current display
    cartItems.innerHTML = '';

    // Add each item to the display
    Object.entries(cart).forEach(([itemId, item]) => {
        const itemSubtotal = item.price * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.dataset.id = itemId;
        
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-price">₹${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" onclick="updateItemQuantity('${itemId}', -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="updateItemQuantity('${itemId}', 1)">+</button>
                </div>
                <p class="item-subtotal">₹${itemSubtotal.toFixed(2)}</p>
            </div>
            <button class="remove-item" onclick="removeItem('${itemId}')">Remove</button>
        `;
        
        cartItems.appendChild(itemElement);
    });

    updateCartTotals();
}

function updateItemQuantity(itemId, change) {
    if (!cart[itemId]) return;

    cart[itemId].quantity += change;
    
    if (cart[itemId].quantity <= 0) {
        removeItem(itemId);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
    }
}

function removeItem(itemId) {
    delete cart[itemId];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
}

function updateCartTotals() {
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');

    if (!subtotalElement || !taxElement || !totalElement) return;

    // Calculate subtotal
    const subtotal = Object.values(cart).reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    // Calculate tax
    const tax = subtotal * TAX_RATE;

    // Calculate total
    const total = subtotal + tax;

    // Update display
    subtotalElement.textContent = subtotal.toFixed(2);
    taxElement.textContent = tax.toFixed(2);
    totalElement.textContent = total.toFixed(2);
}

// Placeholder for checkout function
function checkout() {
    alert('Checkout functionality will be implemented soon!');
}

// Initialize cart display and count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartDisplay();
});
