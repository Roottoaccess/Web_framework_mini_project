/**
 * Authentication management for SmartBite application
 * Handles login, logout, and session persistence using localStorage
 */

// Custom event for auth state changes
const AUTH_STATE_CHANGED = 'authStateChanged';

// Check if user is already authenticated when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkAuthState();
    
    // Also initialize login form if we're on the login page
    if (isLoginPage()) {
        initLoginForm();
    }
});

/**
 * Check if current page is a login page
 */
function isLoginPage() {
    const path = window.location.pathname.toLowerCase();
    return path.endsWith('login.html') || path.endsWith('login') || path.includes('login.html');
}

/**
 * Check the current authentication state and redirect if needed
 */
function checkAuthState() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const currentPath = window.location.pathname.toLowerCase();
    
    // Dispatch auth state change event
    dispatchAuthEvent(isAuthenticated);
    
    // Handle redirections based on auth state
    if (isAuthenticated && isLoginPage()) {
        // If user is authenticated and trying to access login page, redirect to menu
        window.location.href = 'menu.html';
    } else if (!isAuthenticated && isProtectedPage(currentPath)) {
        // If user is not authenticated and trying to access protected pages, redirect to login
        window.location.href = 'login.html';
    }
    
    // Update UI based on authentication state
    updateNavigation(isAuthenticated);
}

/**
 * Check if a page requires authentication
 */
function isProtectedPage(path) {
    // Add paths that require authentication here
    const protectedPaths = ['cart.html', 'orders.html'];
    return protectedPaths.some(page => path.includes(page));
}

/**
 * Dispatch an event when authentication state changes
 */
function dispatchAuthEvent(isAuthenticated) {
    const event = new CustomEvent(AUTH_STATE_CHANGED, { 
        detail: { isAuthenticated } 
    });
    document.dispatchEvent(event);
}

/**
 * Update navigation links based on authentication state
 */
function updateNavigation(isAuthenticated) {
    const loginLink = document.querySelector('.nav-link[href="login.html"]');
    
    if (loginLink) {
        // Remove any existing event listeners by cloning the node
        const oldLoginLink = loginLink;
        const newLoginLink = oldLoginLink.cloneNode(true);
        oldLoginLink.parentNode.replaceChild(newLoginLink, oldLoginLink);
        
        if (isAuthenticated) {
            newLoginLink.textContent = 'Logout';
            newLoginLink.setAttribute('href', '#');
            newLoginLink.setAttribute('id', 'logout-link');
            
            // Add logout event listener
            newLoginLink.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        } else {
            newLoginLink.textContent = 'Login';
            newLoginLink.setAttribute('href', 'login.html');
            
            // Make sure to remove the id to avoid any confusion
            if (newLoginLink.hasAttribute('id')) {
                newLoginLink.removeAttribute('id');
            }
        }
        
        // Mark this link as active if we're on the login page and not authenticated
        if (isLoginPage() && !isAuthenticated) {
            newLoginLink.classList.add('active');
        } else if (newLoginLink.classList.contains('active') && !isLoginPage()) {
            newLoginLink.classList.remove('active');
        }
    }
    
    // Set active class for current page links
    updateActiveNavLinks();
}

/**
 * Initialize login form event listeners
 */
function initLoginForm() {
    const loginForm = document.getElementById('loginForm') || document.querySelector('.login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

/**
 * Handle the login form submission
 */
function handleLogin() {
    const username = document.getElementById('username') || document.getElementById('email');
    const password = document.getElementById('password');
    const rememberMeEl = document.querySelector('.remember-me input[type="checkbox"]');
    
    if (!username || !password) {
        showLoginError('Please enter both username and password');
        return;
    }
    
    const usernameValue = username.value;
    const passwordValue = password.value;
    const rememberMe = rememberMeEl ? rememberMeEl.checked : false;
    
    // Simple validation
    if (!usernameValue || !passwordValue) {
        showLoginError('Please enter both username and password');
        return;
    }
    
    // In a real application, you would verify credentials with a server
    // For this demo, we'll just authenticate any input
    
    // Store authentication state
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', usernameValue);
    if (rememberMe) {
        localStorage.setItem('rememberMe', rememberMe);
    }
    
    // Dispatch auth state change event
    dispatchAuthEvent(true);
    
    // Show success message before redirecting
    showLoginSuccess('Login successful! Redirecting...');
    
    // Redirect to menu page after a brief delay
    setTimeout(() => {
        // Redirect to stored URL or default to menu
        const redirectUrl = sessionStorage.getItem('redirectUrl') || 'menu.html';
        sessionStorage.removeItem('redirectUrl'); // Clear stored URL
        window.location.href = redirectUrl;
    }, 1000);
}

/**
 * Handle logout
 */
function logout() {
    // Clear authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail'); // For backward compatibility
    localStorage.removeItem('rememberMe');
    
    // Clear cart data
    localStorage.removeItem('cart');
    
    // Dispatch auth state change event
    dispatchAuthEvent(false);
    
    // Redirect to home page
    window.location.href = 'index.html';
}

/**
 * Show login error message
 */
function showLoginError(message) {
    const formElement = document.getElementById('loginForm') || document.querySelector('.login-form');
    if (!formElement) {
        alert(message);
        return;
    }
    
    // Check if an error message already exists
    let errorElement = document.querySelector('.login-error');
    
    if (!errorElement) {
        // Create error element if it doesn't exist
        errorElement = document.createElement('p');
        errorElement.className = 'login-error';
        errorElement.style.color = '#ff3333';
        errorElement.style.textAlign = 'center';
        errorElement.style.marginTop = '10px';
        
        // Insert before the signup text
        const signupText = document.querySelector('.signup-text');
        formElement.insertBefore(errorElement, signupText);
    }
    
    errorElement.textContent = message;
}

/**
 * Show login success message
 */
function showLoginSuccess(message) {
    const formElement = document.getElementById('loginForm') || document.querySelector('.login-form');
    if (!formElement) {
        alert(message);
        return;
    }
    
    // Remove any existing error message
    const errorElement = document.querySelector('.login-error');
    if (errorElement) {
        errorElement.remove();
    }
    
    // Create success element
    const successElement = document.createElement('p');
    successElement.className = 'login-success';
    successElement.style.color = '#4CAF50';
    successElement.style.textAlign = 'center';
    successElement.style.marginTop = '10px';
    successElement.textContent = message;
    
    // Insert before the signup text
    const signupText = document.querySelector('.signup-text');
    formElement.insertBefore(successElement, signupText);
}

// Function to update active state in nav links
function updateActiveNavLinks() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath.endsWith(href)) {
            link.classList.add('active');
        } else if (link.id !== 'logout-link') {
            link.classList.remove('active');
        }
    });
}

// Listen for auth state changes
document.addEventListener(AUTH_STATE_CHANGED, function(event) {
    const isAuthenticated = event.detail.isAuthenticated;
    updateNavigation(isAuthenticated);
});
