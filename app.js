// Portfolio JavaScript functionality

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initContactForm();
    initAnimations();
    initTypingEffect();
    initGallery(); // NEW: Gallery functionality
    initLightbox(); // NEW: Lightbox functionality
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    // Mobile navigation toggle
    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile nav when clicking on a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinksItems.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Update active navigation link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);

    // Update active navigation link
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// Scroll effects and animations
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe sections for animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Observe cards for staggered animations
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe gallery items for fade-in
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        // Validate form
        if (!validateForm(name, email, subject, message)) {
            return;
        }
        // Create mailto link
        const mailtoLink = `mailto:salmandaher121@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        // Open email client
        window.location.href = mailtoLink;
        // Show success message
        showNotification('Thank you for your message! Your email client should open shortly.', 'success');
        // Reset form
        contactForm.reset();
    });

    // Form validation
    function validateForm(name, email, subject, message) {
        clearFormErrors();
        let isValid = true;
        if (name.trim().length < 2) {
            showFieldError('name', 'Name must be at least 2 characters long');
            isValid = false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
        if (subject.trim().length < 3) {
            showFieldError('subject', 'Subject must be at least 3 characters long');
            isValid = false;
        }
        if (message.trim().length < 10) {
            showFieldError('message', 'Message must be at least 10 characters long');
            isValid = false;
        }
        return isValid;
    }

    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        field.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = 'var(--color-error)';
        errorElement.style.fontSize = 'var(--font-size-sm)';
        errorElement.style.marginTop = 'var(--space-4)';
        errorElement.style.display = 'block';
        formGroup.appendChild(errorElement);
    }

    function clearFormErrors() {
        const errorElements = document.querySelectorAll('.field-error');
        const errorFields = document.querySelectorAll('.form-control.error');
        errorElements.forEach(element => element.remove());
        errorFields.forEach(field => field.classList.remove('error'));
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--color-${type === 'success' ? 'success' : 'error'});
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Initialize animations
function initAnimations() {
    // Add CSS for form error state
    const style = document.createElement('style');
    style.textContent = `
        .form-control.error {
            border-color: var(--color-error);
            box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1);
        }
    `;
    document.head.appendChild(style);

    // Add hover effects for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add hover effects for achievement cards
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Animate statistics numbers
    animateStats();
}

// Animate statistics numbers
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const isNumber = /^\d+/.test(text);
                if (isNumber) {
                    const finalNumber = parseInt(text);
                    animateNumber(target, 0, finalNumber, 2000);
                }
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(stat => observer.observe(stat));
}

// Animate number counting
function animateNumber(element, start, end, duration) {
    const startTime = Date.now();
    const suffix = element.textContent.replace(/^\d+/, '');
    function updateNumber() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);
        element.textContent = current + suffix;
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    updateNumber();
}

// Typing effect for hero title
function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    const text = 'Salman Daher';
    let index = 0;
    typingText.textContent = '';
    function typeCharacter() {
        if (index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
            setTimeout(typeCharacter, 100);
        } else {
            setTimeout(() => {
                typingText.style.borderRight = 'none';
            }, 1000);
        }
    }
    setTimeout(typeCharacter, 500);
}

// Smooth scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
function addScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--color-primary);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    document.body.appendChild(scrollButton);
    scrollButton.addEventListener('click', scrollToTop);
    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
}
addScrollToTopButton();

// Handle resize events
window.addEventListener('resize', function () {
    // Close mobile menu on resize
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (window.innerWidth > 768) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// --- NEW: Gallery Functionality ---
function initGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            galleryItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.animationDelay = `${index * 0.1}s`;
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // Add click handlers for gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function () {
            openLightbox(index);
        });
    });
}

// --- NEW: Lightbox Functionality ---
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    let currentIndex =
