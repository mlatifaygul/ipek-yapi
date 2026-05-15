// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
<<<<<<< HEAD
        const willOpen = !navMenu.classList.contains('active');
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        if (!willOpen) {
            document.querySelectorAll('.nav-item.dropdown.open').forEach(item => item.classList.remove('open'));
        }
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    if (!hamburger || !navMenu) return;
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.querySelectorAll('.nav-item.dropdown.open').forEach(item => item.classList.remove('open'));
}));

// ==========================================
// DYNAMIC CONTENT LOADING SYSTEM
// ==========================================

const DATA_KEYS = {
    nav: 'ipek_navigation',
    pages: 'ipek_pages',
    projects: 'ipek_projects',
    images: 'ipek_images',
    settings: 'ipek_settings',
    cards: 'ipek_cards',
    sections: 'ipek_sections'
};

const CLOUD_STATE_ENDPOINT = '/api/state';
let cloudStateHydrated = false;

function getLocalData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error reading localStorage:', e);
        return null;
    }
}

async function hydrateCloudState() {
    if (cloudStateHydrated) return;
    try {
        const res = await fetch(CLOUD_STATE_ENDPOINT, { cache: 'no-store' });
        if (!res.ok) return;
        const payload = await res.json();
        if (!payload || !payload.ok || !payload.state) return;
        Object.entries(payload.state).forEach(([key, raw]) => {
            if (typeof raw === 'string') localStorage.setItem(key, raw);
        });
        cloudStateHydrated = true;
    } catch (e) {
        console.warn('Cloud state could not be loaded:', e);
    }
}

// Initialize Dynamic Content
document.addEventListener('DOMContentLoaded', async () => {
    await hydrateCloudState();

    // Initialize defaults if localStorage is empty (important for Vercel deployment)
    checkAndInitData();
    
    loadDynamicNav();
    loadDynamicSettings();
    
    // Run content loading
    loadDynamicContent();
});

function loadDynamicNav() {
    const nav = getLocalData(DATA_KEYS.nav) || [];
    const navMenuEl = document.querySelector('.nav-menu');
    if (!navMenuEl || !nav.length) return;

    const items = nav
        .filter(item => item.active !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    navMenuEl.innerHTML = items.map(item => {
        const hasSub = Array.isArray(item.subItems) && item.subItems.length > 0;
        if (!hasSub) {
            return `
                <li class="nav-item">
                    <a href="${item.url || '#'}" class="nav-link">${item.name || ''}</a>
                </li>
            `;
        }

        return `
            <li class="nav-item dropdown">
                <a href="${item.url || '#'}" class="nav-link">${item.name || ''} <i class="fas fa-chevron-down"></i></a>
                <div class="dropdown-content">
                    ${item.subItems.map(sub => `<a href="${sub.url || '#'}">${sub.name || ''}</a>`).join('')}
                </div>
            </li>
        `;
    }).join('');
}

function loadDynamicSettings() {
    const settings = getLocalData(DATA_KEYS.settings) || {};

    if (settings.siteTitle) {
        document.title = settings.siteTitle;
    }

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && settings.siteDescription) {
        metaDesc.setAttribute('content', settings.siteDescription);
    }
}

function checkAndInitData() {
    if (!localStorage.getItem(DATA_KEYS.nav)) {
        console.log('Initializing default data...');
        // Default Nav
        const defaultNav = [
            { id: 1, name: 'Ana Sayfa', url: 'index.html', order: 1, active: true, subItems: [] },
            { id: 2, name: 'Biz Kimiz', url: 'biz-kimiz.html', order: 2, active: true, subItems: [
                { id: 21, name: 'BİZ KİMİZ', url: 'biz-kimiz.html' },
                { id: 22, name: 'Manifesto', url: 'biz-kimiz.html#manifesto' },
                { id: 23, name: 'Tarihçe', url: 'biz-kimiz.html#tarihce' }
            ]},
            { id: 3, name: 'Projeler', url: 'projeler.html', order: 3, active: true, subItems: [
                { id: 31, name: 'İpek Reserve', url: 'projeler.html' },
                { id: 32, name: 'İpek Sapanca', url: 'projeler.html' },
                { id: 33, name: 'İpek Arsa', url: 'projeler.html' }
            ]},
            { id: 5, name: 'İletişim', url: 'iletisim.html', order: 5, active: true, subItems: [] }
        ];
        localStorage.setItem(DATA_KEYS.nav, JSON.stringify(defaultNav));

        // Default Sections
        const defaultSections = [
            { id: 1, name: 'Ana Sayfa Hero', page: 'index.html', type: 'hero', title: '2010 yılından beri metrekarelerle değil santimetrekarelerle çalışarak, ince düşünülmüş yaşam alanları tasarlıyoruz.', subtitle: '', content: '', bgImage: 'https://via.placeholder.com/800x600/2c3e50/ffffff?text=İPEK+Yaşam+Alanları', order: 1 }
        ];
        localStorage.setItem(DATA_KEYS.sections, JSON.stringify(defaultSections));

        // Default Cards
        const defaultCards = [
            { id: 1, title: 'İpek Reserve', page: 'index.html', order: 1, status: 'Yaşam Başladı', description: 'Premium yaşam alanları', image: 'https://via.placeholder.com/400x300/34495e/ffffff?text=İpek+Reserve', features: 'Deniz Manzarası, Lüks Tasarım', link: '#', buttonText: 'Keşfet' },
            { id: 2, title: 'İpek Sapanca', page: 'index.html', order: 2, status: 'Yaşam Başladı', description: "Sapanca'ya Şimdi İpek'den Bakın", image: 'https://via.placeholder.com/400x300/34495e/ffffff?text=İpek+Sapanca', features: 'Doğa Manzarası, Göl Yakınlığı', link: '#', buttonText: 'Keşfet' },
            { id: 3, title: 'İpek Arsa', page: 'index.html', order: 3, status: 'Satışta', description: 'Birikiminizle Birlikte Hayallerinizi Büyütün', image: 'https://via.placeholder.com/400x300/34495e/ffffff?text=İpek+Arsa', features: 'Yatırımlık, Modüler Ev', link: '#', buttonText: 'Keşfet' }
        ];
        localStorage.setItem(DATA_KEYS.cards, JSON.stringify(defaultCards));

        // Default Settings
        const defaultSettings = {
            siteTitle: 'İPEK - İnce Düşünülmüş Yaşam Alanları',
            contactEmail: 'info@ipek.com.tr',
            contactPhone: '+90 212 555 00 00'
        };
        localStorage.setItem(DATA_KEYS.settings, JSON.stringify(defaultSettings));
    }
}


function loadDynamicContent() {
    const sections = getLocalData(DATA_KEYS.sections) || [];
    const cards = getLocalData(DATA_KEYS.cards) || [];
    const projects = getLocalData(DATA_KEYS.projects) || [];
    const currentPage = location.pathname.split('/').pop() || 'index.html';

    const heroSection = sections.find(s => s.type === 'hero' && (s.page === 'index.html' || s.page === currentPage));
    if (heroSection) {
        const heroTitle = document.getElementById('hero-title');
        if (heroTitle) heroTitle.innerHTML = `${heroSection.title} <br> <span style="font-weight: 300;">${heroSection.subtitle || ''}</span>`;

        const heroImg = document.getElementById('hero-img');
        if (heroImg && heroSection.bgImage) heroImg.src = heroSection.bgImage;
    }

    const projectsGrid = document.getElementById('projects-grid') || document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    if (currentPage === 'projeler.html' && projects.length > 0) {
        projectsGrid.innerHTML = projects.map(project => `
            <div class="project-card" data-category="${project.category || ''}" data-location="${(project.location || '').toLowerCase()}">
                <div class="project-image">
                    <img src="${project.image || 'https://via.placeholder.com/400x300'}" alt="${project.name || 'Proje'}">
                    ${project.status ? `<span class="project-status ${project.status === 'Yaşam Başladı' ? 'yasam-basladi' : ''}">${project.status}</span>` : ''}
                </div>
                <div class="project-info">
                    <h3 class="project-name">${project.name || ''}</h3>
                    <div class="project-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${project.location || ''}</span>
                    </div>
                    <div class="project-features">
                        ${(project.features || '').split(',').filter(Boolean).map(f => `<span class="feature-tag">${f.trim()}</span>`).join('')}
                    </div>
                    ${project.price ? `<div class="project-price">${project.price}</div>` : ''}
                    <div class="project-action">
                        <a href="#" class="discover-btn">Keşfet <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        `).join('');
        return;
    }

    if (cards.length > 0) {
        const pageCards = cards
            .filter(c => c.page === currentPage || (!c.page && currentPage === 'index.html'))
            .sort((a, b) => a.order - b.order);

        if (pageCards.length > 0) {
            projectsGrid.innerHTML = pageCards.map(card => `
                <div class="project-card" data-category="${card.status === 'Satışta' ? 'arsa' : 'konut'}" data-location="istanbul">
                    <div class="project-image">
                        <img src="${card.image || 'https://via.placeholder.com/400x300'}" alt="${card.title}">
                        ${card.status ? `<span class="project-status ${card.status === 'Yaşam Başladı' ? 'yasam-basladi' : ''}">${card.status}</span>` : ''}
                    </div>
                    <div class="project-info">
                        <h3 class="project-name">${card.title}</h3>
                        <div class="project-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${card.description || 'Lokasyon Bilgisi'}</span>
                        </div>
                        <div class="project-features">
                            ${(card.features || '').split(',').filter(Boolean).map(f => `<span class="feature-tag">${f.trim()}</span>`).join('')}
                        </div>
                        <div class="project-action">
                            <a href="${card.link || '#'}" class="discover-btn">${card.buttonText || 'Keşfet'} <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Mobile dropdown toggle
document.querySelectorAll('.nav-item.dropdown > .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth > 768) return;
        e.preventDefault();
        e.stopPropagation();

        const parent = link.parentElement;
        const isOpen = parent.classList.contains('open');

        document.querySelectorAll('.nav-item.dropdown.open').forEach(item => item.classList.remove('open'));
        if (!isOpen) {
            parent.classList.add('open');
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.project-card, .arsa-item, .news-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const phone = contactForm.querySelector('input[type="tel"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const interest = contactForm.querySelector('select').value;

        // Simple validation
        if (!name || !phone || !email || !interest) {
            showNotification('Lütfen tüm alanları doldurun.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Lütfen geçerli bir e-posta adresi girin.', 'error');
            return;
        }

        // Phone validation (Turkish phone format)
        const phoneRegex = /^(\+90|0)?\s*[5-9]\d{2}\s*\d{3}\s*\d{2}\s*\d{2}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            showNotification('Lütfen geçerli bir telefon numarası girin.', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Gönderiliyor...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;

    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#27ae60';
            break;
        case 'error':
            notification.style.background = '#e74c3c';
            break;
        default:
            notification.style.background = '#3498db';
    }

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Project card hover effects
document.querySelectorAll('.project-card, .arsa-item, .news-item').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Counter animation for statistics (if any)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '0';
            img.onload = () => {
                img.style.transition = 'opacity 0.5s ease';
                img.style.opacity = '1';
            };
            observer.unobserve(img);
        }
    });
});

// Observe all images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => imageObserver.observe(img));
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Smooth reveal animation for sections
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, {
    threshold: 0.1
});

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        sectionObserver.observe(section);
    });
});

// Add revealed class styles
const style = document.createElement('style');
style.textContent = `
    section.revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Project filtering (if needed)
function filterProjects(category) {
    const projects = document.querySelectorAll('.project-card, .arsa-item');
    projects.forEach(project => {
        if (category === 'all' || project.dataset.category === category) {
            project.style.display = 'block';
            setTimeout(() => {
                project.style.opacity = '1';
                project.style.transform = 'scale(1)';
            }, 100);
        } else {
            project.style.opacity = '0';
            project.style.transform = 'scale(0.8)';
            setTimeout(() => {
                project.style.display = 'none';
            }, 300);
        }
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Projelerde ara...';
    searchInput.style.cssText = `
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 25px;
        margin: 20px auto;
        display: block;
        max-width: 400px;
        width: 100%;
        font-size: 14px;
    `;

    const featuredProjects = document.querySelector('.featured-projects .container');
    if (featuredProjects) {
        featuredProjects.insertBefore(searchInput, featuredProjects.firstChild);

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const projects = document.querySelectorAll('.project-card');

            projects.forEach(project => {
                const title = project.querySelector('h3').textContent.toLowerCase();
                const description = project.querySelector('p').textContent.toLowerCase();

                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    project.style.display = 'block';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSearch);

// Performance optimization - Debounce function
function debounce(func, wait) {
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

// Debounced scroll events
const debouncedScroll = debounce(() => {
    // Scroll-related animations
}, 100);

window.addEventListener('scroll', debouncedScroll);

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Console Easter egg
console.log('%c İPEK Clone ', 'background: #2c3e50; color: #fff; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Modern web development with attention to detail ', 'background: #3498db; color: #fff; padding: 5px;');

