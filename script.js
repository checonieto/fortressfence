// DOM Ready Function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initWebsite();
});

function initWebsite() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Initialize components
    initMobileMenu();
    initFormSubmission();
    initSmoothScroll();
    initDropdowns();
    initAnimations();
    initGallery();
    initFixedButton();
    initLoadingScreen();
    
    // Update business hours indicator
    updateBusinessHours();
    
    // Preload images for better performance
    preloadImages();
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            nav.classList.toggle('active');
            this.classList.toggle('active');
            
            // Change icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Mobile dropdown functionality
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (link) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (nav && nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    function closeMobileMenu() {
        nav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        
        // Close all dropdowns
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
}

// Form Submission
function initFormSubmission() {
    const quoteForm = document.getElementById('quoteForm');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#dc3545';
                    isValid = false;
                    
                    // Add error message
                    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.style.color = '#dc3545';
                        errorMsg.style.fontSize = '0.85rem';
                        errorMsg.style.marginTop = '5px';
                        errorMsg.textContent = 'This field is required';
                        field.parentNode.appendChild(errorMsg);
                    }
                } else {
                    field.style.borderColor = '';
                    const errorMsg = field.parentNode.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                }
            });
            
            if (!isValid) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call (replace with actual API call)
            setTimeout(() => {
                // Here you would typically send data to your server
                // Example: fetch('/api/quote', { method: 'POST', body: formData })
                
                // Show success message
                showNotification('Thank you! Your quote request has been submitted. We will contact you within 24 hours.', 'success');
                
                // Reset form
                this.reset();
                
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Scroll to thank you message
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
            }, 1500);
        });
        
        // Remove error styling on input
        quoteForm.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', function() {
                this.style.borderColor = '';
                const errorMsg = this.parentNode.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            });
        });
    }
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                const nav = document.querySelector('.nav');
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                }
                
                // Close all dropdowns
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
                
                // Calculate header height
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Dropdown Hover Effects
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        if (window.innerWidth > 768) {
            dropdown.addEventListener('mouseenter', function() {
                this.classList.add('active');
            });
            
            dropdown.addEventListener('mouseleave', function() {
                this.classList.remove('active');
            });
        }
    });
}

// Animations on Scroll
function initAnimations() {
    // Create Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // For stats counter animation
                if (entry.target.classList.contains('stat')) {
                    animateCounter(entry.target.querySelector('.stat-number'));
                }
            }
        });
    }, observerOptions);
    
    // Observe elements to animate
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .material-card, .feature, .gallery-item, .stat'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
    
    // Counter animation function
    function animateCounter(element) {
        if (!element || element.hasAttribute('data-animated')) return;
        
        const target = parseInt(element.textContent);
        const suffix = element.textContent.replace(/[0-9]/g, '');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        element.setAttribute('data-animated', 'true');
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    }
}

// Gallery Lightbox
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageUrl = this.querySelector('.gallery-image').style.backgroundImage
                .replace('url("', '')
                .replace('")', '');
            const caption = this.querySelector('.gallery-caption h4').textContent;
            
            openLightbox(imageUrl, caption);
        });
    });
    
    function openLightbox(imageUrl, caption) {
        // Create lightbox elements
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img src="${imageUrl}" alt="${caption}">
                <div class="lightbox-caption">${caption}</div>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Add styles for lightbox
        if (!document.querySelector('#lightbox-styles')) {
            const styles = document.createElement('style');
            styles.id = 'lightbox-styles';
            styles.textContent = `
                .lightbox {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    animation: fadeIn 0.3s ease;
                }
                .lightbox-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                }
                .lightbox-content img {
                    max-width: 100%;
                    max-height: 80vh;
                    border-radius: 8px;
                }
                .lightbox-close {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .lightbox-caption {
                    color: white;
                    text-align: center;
                    margin-top: 15px;
                    font-size: 1.2rem;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Close lightbox
        lightbox.addEventListener('click', function(e) {
            if (e.target === this || e.target.classList.contains('lightbox-close')) {
                document.body.removeChild(this);
                document.body.style.overflow = '';
            }
        });
        
        // Close with ESC key
        document.addEventListener('keydown', function closeOnEsc(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(lightbox);
                document.body.style.overflow = '';
                document.removeEventListener('keydown', closeOnEsc);
            }
        });
    }
}

// Fixed Call Button
function initFixedButton() {
    const callBtn = document.querySelector('.fixed-call-btn');
    
    if (callBtn) {
        callBtn.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                // Confirm call on mobile
                if (confirm('Call Fortress Fencing at (905) 897-1333?')) {
                    window.location.href = 'tel:9058971333';
                }
            }
        });
    }
}

// Business Hours Indicator
function updateBusinessHours() {
    const now = new Date();
    const hours = now.getHours();
    const day = now.getDay();
    const callBtn = document.querySelector('.fixed-call-btn');
    
    // Business hours: Mon-Fri 7AM-7PM, Sat 8AM-4PM
    const isBusinessHours = 
        (day >= 1 && day <= 5 && hours >= 7 && hours < 19) || // Mon-Fri
        (day === 6 && hours >= 8 && hours < 16); // Saturday
    
    if (callBtn) {
        if (!isBusinessHours) {
            callBtn.innerHTML = '<i class="fas fa-clock"></i><span>Leave Message</span>';
            callBtn.style.background = 'linear-gradient(135deg, #7F8C8D, #95A5A6)';
            callBtn.onclick = function(e) {
                e.preventDefault();
                document.getElementById('quote').scrollIntoView({ behavior: 'smooth' });
            };
        }
    }
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                animation: slideInRight 0.3s ease;
            }
            .notification-content {
                background: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                gap: 12px;
                border-left: 4px solid #28a745;
                min-width: 300px;
            }
            .notification-error .notification-content {
                border-left-color: #dc3545;
            }
            .notification i {
                font-size: 1.2rem;
            }
            .notification-success i {
                color: #28a745;
            }
            .notification-error i {
                color: #dc3545;
            }
            .notification span {
                flex: 1;
                font-weight: 500;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6c757d;
                line-height: 1;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Close notification
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
    
    // Add slide out animation
    if (!document.querySelector('#notification-animations')) {
        const animations = document.createElement('style');
        animations.id = 'notification-animations';
        animations.textContent = `
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(animations);
    }
}

// Image Preloader
function preloadImages() {
    const images = [
        'heroff.jpg',
        'logoff.jpg',
        'project1.jpg',
        'project2.jpg',
        'project3.jpg'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Loading Screen
function initLoadingScreen() {
    // Create loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading';
    loadingScreen.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loadingScreen);
    
    // Hide loading screen after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.remove();
                }
            }, 500);
        }, 500);
    });
}

// Sticky Header
function initStickyHeader() {
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 100) {
            header.classList.remove('hidden');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('hidden')) {
            // Scrolling down
            header.classList.add('hidden');
        } else if (currentScroll < lastScroll && header.classList.contains('hidden')) {
            // Scrolling up
            header.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });
}

// Add CSS for sticky header
const stickyHeaderStyles = document.createElement('style');
stickyHeaderStyles.textContent = `
    .header {
        transition: transform 0.3s ease;
    }
    .header.hidden {
        transform: translateY(-100%);
    }
`;
document.head.appendChild(stickyHeaderStyles);

// Initialize sticky header
initStickyHeader();

// Service Form Enhancements
function enhanceServiceForm() {
    const serviceSelect = document.querySelector('select');
    const materialSelect = document.querySelectorAll('select')[1];
    
    if (serviceSelect && materialSelect) {
        serviceSelect.addEventListener('change', function() {
            // Clear material selection when service changes
            materialSelect.value = '';
        });
    }
}

enhanceServiceForm();