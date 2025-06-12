/**
 * Navigation management for SmartBite application
 * Handles navigation state and authentication-aware navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation based on current auth state
    initNavigation();
    
    // Set up smooth scrolling
    setupSmoothScrolling();
});

/**
 * Initialize navigation state
 */
function initNavigation() {
    // Get current authentication state
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    // Update active nav link based on current page
    updateActiveNavLinks();
    
    // Set up auth-aware navigation elements
    updateAuthNavigation(isAuthenticated);
}

/**
 * Update which navigation link is active based on current page
 */
function updateActiveNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Skip the login/logout link as it's handled separately
        if (link.id === 'logout-link') return;
        
        if (href === currentPage || currentPath.endsWith(href)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Update navigation elements based on authentication state
 */
function updateAuthNavigation(isAuthenticated) {
    const loginLink = document.querySelector('.nav-link[href="login.html"]');
    
    if (loginLink) {
        // Remove any existing event listeners
        const newLoginLink = loginLink.cloneNode(true);
        loginLink.parentNode.replaceChild(newLoginLink, loginLink);
        
        if (isAuthenticated) {
            newLoginLink.textContent = 'Logout';
            newLoginLink.setAttribute('href', '#');
            newLoginLink.setAttribute('id', 'logout-link');
            
            // Add logout event listener
            newLoginLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Call logout function from auth.js
                if (typeof logout === 'function') {
                    logout();
                } else {
                    console.error('Logout function not found');
                }
            });
        } else {
            newLoginLink.textContent = 'Login';
            newLoginLink.setAttribute('href', 'login.html');
            
            // Remove logout ID if it exists
            if (newLoginLink.hasAttribute('id')) {
                newLoginLink.removeAttribute('id');
            }
            
            // Make login active if we're on the login page
            if (window.location.pathname.toLowerCase().includes('login')) {
                newLoginLink.classList.add('active');
            }
        }
    }
}

/**
 * Set up smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Skip if this is the logout link
            if (this.id === 'logout-link') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Listen for auth state changes from auth.js
 */
document.addEventListener('authStateChanged', function(event) {
    const isAuthenticated = event.detail.isAuthenticated;
    updateAuthNavigation(isAuthenticated);
    updateActiveNavLinks();
});
