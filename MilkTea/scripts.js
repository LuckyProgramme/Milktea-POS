// Global Variables
const ANIMATION_DURATION = 300;

// Animation Functions
const animations = {
    fadeIn: (element, duration = ANIMATION_DURATION) => {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.transition = `opacity ${duration}ms ease-in-out`;
            element.style.opacity = '1';
        }, 10);
    },

    fadeOut: (element, duration = ANIMATION_DURATION) => {
        element.style.opacity = '1';
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.opacity = '0';

        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    },

    slideIn: (element, direction = 'right', duration = ANIMATION_DURATION) => {
        const translations = {
            right: 'translateX(20px)',
            left: 'translateX(-20px)',
            up: 'translateY(-20px)',
            down: 'translateY(20px)'
        };

        element.style.opacity = '0';
        element.style.transform = translations[direction];
        element.style.display = 'block';

        setTimeout(() => {
            element.style.transition = `all ${duration}ms ease-in-out`;
            element.style.opacity = '1';
            element.style.transform = 'translate(0)';
        }, 10);
    },

    scaleIn: (element, duration = ANIMATION_DURATION) => {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.95)';
        element.style.display = 'block';

        setTimeout(() => {
            element.style.transition = `all ${duration}ms ease-in-out`;
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 10);
    }
};

// Utility Functions
const utils = {
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    },

    formatDate: (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },

    generateOrderId: () => {
        return Math.random().toString(36).substr(2, 9).toUpperCase();
    },

    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Navigation Functions
const navigation = {
    init: () => {
        // Add active class to current page link
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            }
        });

        // Initialize mobile menu if exists
        const menuToggle = document.querySelector('.menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }
    }
};

// Form Validation Functions
const validation = {
    required: (value) => value && value.trim().length > 0,
    
    email: (value) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    },
    
    phone: (value) => {
        const regex = /^[0-9]{11}$/;
        return regex.test(value);
    },
    
    validateForm: (formElement, rules) => {
        let isValid = true;
        const errors = {};

        Object.keys(rules).forEach(fieldName => {
            const field = formElement.querySelector(`[name='${fieldName}']`);
            if (!field) return;

            const fieldRules = rules[fieldName];
            const fieldValue = field.value;
            
            fieldRules.forEach(rule => {
                if (typeof rule === 'function') {
                    if (!rule(fieldValue)) {
                        isValid = false;
                        errors[fieldName] = 'Invalid value';
                    }
                } else if (rule.test && !rule.test(fieldValue)) {
                    isValid = false;
                    errors[fieldName] = rule.message || 'Invalid value';
                }
            });
        });

        return { isValid, errors };
    }
};

// Order Management Functions
const orderManagement = {
    saveOrder: (orderData) => {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const newOrder = {
            id: utils.generateOrderId(),
            timestamp: new Date().toISOString(),
            status: 'pending',
            ...orderData
        };
        
        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        return newOrder;
    },

    updateOrderStatus: (orderId, status) => {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = status;
            localStorage.setItem('orders', JSON.stringify(orders));
            return true;
        }
        return false;
    },

    getOrders: (status = null) => {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        if (status) {
            return orders.filter(order => order.status === status);
        }
        return orders;
    }
};

// Cart Management Functions
const cartManagement = {
    addToCart: (item) => {
        const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
        const existingItem = cart.find(i => i.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            cart.push({ ...item, quantity: item.quantity || 1 });
        }
        
        sessionStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartUI();
    },

    removeFromCart: (itemId) => {
        const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
        const updatedCart = cart.filter(item => item.id !== itemId);
        sessionStorage.setItem('cart', JSON.stringify(updatedCart));
        this.updateCartUI();
    },

    updateQuantity: (itemId, quantity) => {
        const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
        const item = cart.find(i => i.id === itemId);
        
        if (item) {
            item.quantity = quantity;
            sessionStorage.setItem('cart', JSON.stringify(cart));
            this.updateCartUI();
        }
    },

    getCart: () => {
        return JSON.parse(sessionStorage.getItem('cart') || '[]');
    },

    clearCart: () => {
        sessionStorage.removeItem('cart');
        this.updateCartUI();
    },

    updateCartUI: () => {
        const cartItems = this.getCart();
        const cartCount = document.querySelector('.cart-count');
        const cartTotal = document.querySelector('.cart-total');
        
        if (cartCount) {
            cartCount.textContent = cartItems.reduce((total, item) => total + item.quantity, 0);
        }
        
        if (cartTotal) {
            const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = utils.formatCurrency(total);
        }
    }
};

let currentCategory = 'all';
let currentSearch = '';

// Render menu items
function renderMenu(category = currentCategory, search = currentSearch) {
    currentCategory = category;
    currentSearch = search;
    const menuGrid = document.querySelector('.menu-grid');
    menuGrid.innerHTML = '';

    let filteredItems = menuItems;
    if (category !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === category);
    }
    if (search && search.trim() !== '') {
        filteredItems = filteredItems.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (filteredItems.length === 0) {
        menuGrid.innerHTML = '<p style="padding:2rem;text-align:center;color:var(--text-light)">No items found.</p>';
        return;
    }

    filteredItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-item-info">
                <h3>${item.name}</h3>
                <div class="price">₱${item.price.toFixed(2)}</div>
                <button class="btn btn-primary btn-block" onclick="addToCart(${item.id})">
                    Add to Order
                </button>
            </div>
        `;
        menuGrid.appendChild(menuItem);
    });
}

// Filter menu by category
function filterMenu(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    renderMenu(category, document.querySelector('.search-input').value);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    navigation.init();
    cartManagement.updateCartUI();
    initializePage();
    loadCartFromSession();

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', (e) => {
        renderMenu(currentCategory, e.target.value);
    });
    // Optional: search on button click
    document.querySelector('.search-btn').addEventListener('click', () => {
        renderMenu(currentCategory, searchInput.value);
    });
});

// Export modules
window.POS = {
    animations,
    utils,
    validation,
    orderManagement,
    cartManagement
};