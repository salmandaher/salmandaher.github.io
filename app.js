// Enhanced Portfolio JavaScript with Gallery functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initContactForm();
    initAnimations();
    initTypingEffect();
    initGallery(); // New gallery functionality
    initLightbox(); // New lightbox functionality
});

// Gallery functionality
function initGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
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
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });
}

// Lightbox functionality
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    let galleryImages = [];

    function updateGalleryImages() {
        galleryImages = Array.from(document.querySelectorAll('.gallery-item:not(.hidden) img'));
    }

    function openLightbox(index) {
        updateGalleryImages();
        currentIndex = index;
        showImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showImage() {
        if (galleryImages[currentIndex]) {
            const img = galleryImages[currentIndex];
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxTitle.textContent = img.getAttribute('data-title') || '';
            lightboxDescription.textContent = img.getAttribute('data-description') || '';
        }
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        showImage();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        showImage();
    }

    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });

    // Make openLightbox globally accessible
    window.openLightbox = openLightbox;
}

// Enhanced scroll effects for gallery
function initScrollEffects() {
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

    // Observe sections and gallery items
    const sections = document.querySelectorAll('section');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    sections.forEach(section => observer.observe(section));
    galleryItems.forEach(item => observer.observe(item));
}

// Rest of your existing JavaScript functions...
// (Include all the existing functions from your app.js file)
