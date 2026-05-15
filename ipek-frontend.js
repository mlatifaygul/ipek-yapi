/**
 * IPEK Frontend Integration Module
 * Admin panel verilerini frontend sayfalarına entegre eder
 * Tüm HTML sayfalarına dahil edilmeli: <script src="ipek-frontend.js"></script>
 */

(function () {
    'use strict';

    // Admin data helper - admin-data.js'den verileri çeker
    const IPEKData = {
        // Navigation
        getNavigation: function () {
            return JSON.parse(localStorage.getItem('ipek_navigation') || '[]');
        },

        // Pages
        getPages: function () {
            return JSON.parse(localStorage.getItem('ipek_pages') || '[]');
        },

        getCurrentPage: function () {
            const path = window.location.pathname;
            const filename = path.split('/').pop() || 'index.html';
            return this.getPages().find(p => p.file === filename);
        },

        // Sections
        getSections: function (page) {
            const allSections = JSON.parse(localStorage.getItem('ipek_sections') || '[]');
            return page ? allSections.filter(s => s.page === page).sort((a, b) => a.order - b.order) : allSections;
        },

        // Cards
        getCards: function (page) {
            const allCards = JSON.parse(localStorage.getItem('ipek_cards') || '[]');
            return page ? allCards.filter(c => c.page === page).sort((a, b) => a.order - b.order) : allCards;
        },

        // Projects
        getProjects: function () {
            return JSON.parse(localStorage.getItem('ipek_projects') || '[]');
        },

        // Images
        getImages: function () {
            return JSON.parse(localStorage.getItem('ipek_images') || '[]');
        },

        // Settings
        getSettings: function () {
            return JSON.parse(localStorage.getItem('ipek_settings') || '{}');
        }
    };

    // Navigation Builder
    const NavigationBuilder = {
        build: function () {
            const navMenu = document.querySelector('.nav-menu');
            if (!navMenu) return;

            const items = IPEKData.getNavigation().filter(item => item.active);
            navMenu.innerHTML = items.map(item => this.buildItem(item)).join('');
        },

        buildItem: function (item) {
            const hasSubItems = item.subItems && item.subItems.length > 0;

            if (hasSubItems) {
                return `
                    <li class="nav-item dropdown">
                        <a href="${item.url}" class="nav-link" onclick="if(window.innerWidth <= 1024) { event.preventDefault(); this.parentElement.classList.toggle('active'); return false; }">
                            ${item.icon ? `<i class="${item.icon}"></i> ` : ''}
                            ${item.name} 
                            <i class="fas fa-chevron-down"></i>
                        </a>
                        <div class="dropdown-content">
                            ${item.subItems.map(sub => `
                                <a href="${sub.url}">${sub.name}</a>
                            `).join('')}
                        </div>
                    </li>
                `;
            } else {
                return `
                    <li class="nav-item">
                        <a href="${item.url}" class="nav-link">
                            ${item.icon ? `<i class="${item.icon}"></i> ` : ''}
                            ${item.name}
                        </a>
                    </li>
                `;
            }
        }
    };

    // Page Meta Builder
    const MetaBuilder = {
        build: function () {
            const currentPage = IPEKData.getCurrentPage();
            const settings = IPEKData.getSettings();

            // Update title
            if (currentPage && currentPage.title) {
                document.title = currentPage.title;
            } else if (settings.siteTitle) {
                document.title = settings.siteTitle;
            }

            // Update meta description
            this.updateMeta('description', currentPage?.description || settings.siteDescription);

            // Update meta keywords
            this.updateMeta('keywords', currentPage?.keywords || settings.metaKeywords);

            // Update favicon
            if (settings.faviconUrl) {
                this.updateFavicon(settings.faviconUrl);
            }
        },

        updateMeta: function (name, content) {
            if (!content) return;

            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = name;
                document.head.appendChild(meta);
            }
            meta.content = content;
        },

        updateFavicon: function (url) {
            let link = document.querySelector('link[rel="icon"]');
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = url;
        }
    };

    // Cards Builder
    const CardsBuilder = {
        build: function (containerId, page) {
            const container = document.getElementById(containerId);
            if (!container) return;

            const cards = IPEKData.getCards(page || this.getCurrentPageName());
            container.innerHTML = cards.map(card => this.buildCard(card)).join('');
        },

        buildCard: function (card) {
            return `
                <div class="project-card" data-id="${card.id}">
                    <div class="project-image">
                        <img src="${card.image || 'https://via.placeholder.com/400x300/34495e/ffffff?text=No+Image'}" 
                             alt="${card.title}"
                             onerror="this.src='https://via.placeholder.com/400x300/34495e/ffffff?text=Error'">
                        ${card.status ? `<span class="project-status">${card.status}</span>` : ''}
                    </div>
                    <div class="project-content">
                        <h3>${card.title}</h3>
                        <p>${card.description}</p>
                        ${card.features ? `
                            <div class="project-features">
                                ${card.features.split(',').map(f => `
                                    <span class="feature-tag">${f.trim()}</span>
                                `).join('')}
                            </div>
                        ` : ''}
                        ${card.price ? `<div class="project-price">${card.price}</div>` : ''}
                        <div class="project-action">
                            <a href="${card.link || '#'}" class="project-link">
                                ${card.buttonText || 'Keşfet'} 
                                <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        },

        getCurrentPageName: function () {
            const path = window.location.pathname;
            return path.split('/').pop() || 'index.html';
        }
    };

    // Projects Builder
    const ProjectsBuilder = {
        build: function (containerId, options = {}) {
            const container = document.getElementById(containerId);
            if (!container) return;

            let projects = IPEKData.getProjects();

            // Apply filters
            if (options.category) {
                projects = projects.filter(p => p.category === options.category);
            }
            if (options.status) {
                projects = projects.filter(p => p.status === options.status);
            }
            if (options.limit) {
                projects = projects.slice(0, options.limit);
            }

            container.innerHTML = projects.map(project => this.buildProject(project)).join('');
        },

        buildProject: function (project) {
            const statusClass = this.getStatusClass(project.status);

            return `
                <div class="project-card" data-category="${project.category}" data-id="${project.id}">
                    <div class="project-image">
                        <img src="${project.image || 'https://via.placeholder.com/400x250/34495e/ffffff?text=No+Image'}" 
                             alt="${project.name}"
                             onerror="this.src='https://via.placeholder.com/400x250/34495e/ffffff?text=Error'">
                        <span class="project-status ${statusClass}">${project.status}</span>
                    </div>
                    <div class="project-info">
                        <h3 class="project-name">${project.name}</h3>
                        <div class="project-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${project.location}</span>
                        </div>
                        ${project.features ? `
                            <div class="project-features">
                                ${project.features.split(',').map(f => `
                                    <span class="feature-tag">${f.trim()}</span>
                                `).join('')}
                            </div>
                        ` : ''}
                        ${project.price ? `<div class="project-price">${project.price}</div>` : ''}
                        <div class="project-action">
                            <a href="#" class="discover-btn">Keşfet <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                </div>
            `;
        },

        getStatusClass: function (status) {
            const statusMap = {
                'Yaşam Başladı': 'yasam-basladi',
                'Satışta': 'satista',
                'İnşaat Devam Ediyor': 'insaat',
                'Tamamlandı': 'tamamlandi'
            };
            return statusMap[status] || '';
        }
    };

    // Footer Builder
    const FooterBuilder = {
        build: function () {
            const settings = IPEKData.getSettings();

            // Update footer description
            const footerDesc = document.querySelector('.footer-section p');
            if (footerDesc && settings.siteDescription) {
                footerDesc.textContent = settings.siteDescription;
            }

            // Update contact info
            this.updateElement('.footer-section ul li:has(i.fa-phone)', `<i class="fas fa-phone"></i> ${settings.contactPhone || ''}`);
            this.updateElement('.footer-section ul li:has(i.fa-envelope)', `<i class="fas fa-envelope"></i> ${settings.contactEmail || ''}`);
            this.updateElement('.footer-section ul li:has(i.fa-map-marker-alt)', `<i class="fas fa-map-marker-alt"></i> ${settings.contactAddress || ''}`);

            // Build corporate links from navigation
            this.buildFooterLinks();
        },

        updateElement: function (selector, html) {
            const element = document.querySelector(selector);
            if (element) {
                element.innerHTML = html;
            }
        },

        buildFooterLinks: function () {
            const navigation = IPEKData.getNavigation();

            // Find "Biz Kimiz" for corporate links
            const corporate = navigation.find(item => item.name === 'Biz Kimiz');
            if (corporate && corporate.subItems) {
                const corporateList = document.querySelector('.footer-section:nth-child(2) ul');
                if (corporateList) {
                    corporateList.innerHTML = corporate.subItems.map(sub => `
                        <li><a href="${sub.url}">${sub.name}</a></li>
                    `).join('');
                }
            }

            // Find "Projeler" for project links
            const projects = navigation.find(item => item.name === 'Projeler');
            if (projects && projects.subItems) {
                const projectsList = document.querySelector('.footer-section:nth-child(3) ul');
                if (projectsList) {
                    projectsList.innerHTML = projects.subItems.map(sub => `
                        <li><a href="${sub.url}">${sub.name}</a></li>
                    `).join('');
                }
            }
        }
    };

    // Dynamic Content Loader
    const DynamicLoader = {
        loadHeroContent: function () {
            const hero = document.querySelector('.hero h2');
            const settings = IPEKData.getSettings();

            if (hero && settings.heroTitle) {
                hero.textContent = settings.heroTitle;
            }
        },

        loadSection: function (sectionId, pageFile) {
            const container = document.getElementById(sectionId);
            if (!container) return;

            const sections = IPEKData.getSections(pageFile);
            const section = sections.find(s => s.id === parseInt(sectionId.replace('section-', '')));

            if (section) {
                container.innerHTML = this.renderSection(section);
            }
        },

        renderSection: function (section) {
            switch (section.type) {
                case 'hero':
                    return this.renderHero(section);
                case 'text':
                    return this.renderText(section);
                case 'card':
                    return this.renderCardSection(section);
                default:
                    return section.content || '';
            }
        },

        renderHero: function (section) {
            return `
                <div class="hero-section" style="background: ${section.bgColor || '#667eea'}; ${section.bgImage ? `background-image: url('${section.bgImage}'); background-size: cover;` : ''}">
                    <div class="container">
                        <div class="hero-content">
                            <h1>${section.title}</h1>
                            <p>${section.subtitle}</p>
                            ${section.content || ''}
                        </div>
                    </div>
                </div>
            `;
        },

        renderText: function (section) {
            return `
                <section class="text-section" style="background: ${section.bgColor || '#fff'};">
                    <div class="container">
                        <h2>${section.title}</h2>
                        <p>${section.subtitle}</p>
                        <div class="text-content">${section.content}</div>
                    </div>
                </section>
            `;
        },

        renderCardSection: function (section) {
            return `
                <section class="card-section" style="background: ${section.bgColor || '#fff'};">
                    <div class="container">
                        <h2>${section.title}</h2>
                        <p>${section.subtitle}</p>
                        <div class="cards-grid">${section.content || ''}</div>
                    </div>
                </section>
            `;
        }
    };

    // Admin Link Helper removed as per request
    const AdminHelper = {
        showAdminLink: function () {
            // Disabled
        }
    };

    // Main Initialization
    const IPEKFrontend = {
        init: function () {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.load());
            } else {
                this.load();
            }
        },

        load: function () {
            console.log('🚀 IPEK Frontend Integration Loading...');

            // Initialize default data if available (e.g. from admin-data.js)
            // This is crucial for Vercel deployments where localStorage is initially empty
            if (typeof window.initializeEnhancedData === 'function') {
                window.initializeEnhancedData();
            }

            try {
                // Load page meta
                MetaBuilder.build();

                // Load navigation
                NavigationBuilder.build();

                // Load footer
                FooterBuilder.build();

                // Admin link removed

                console.log('✅ IPEK Frontend Integration Loaded Successfully');
            } catch (error) {
                console.error('❌ IPEK Frontend Integration Error:', error);
            }
        },

        // Public API
        api: {
            // Data access
            data: IPEKData,

            // Builders
            buildNavigation: () => NavigationBuilder.build(),
            buildCards: (containerId, page) => CardsBuilder.build(containerId, page),
            buildProjects: (containerId, options) => ProjectsBuilder.build(containerId, options),
            buildFooter: () => FooterBuilder.build(),

            // Dynamic loaders
            loadSection: (sectionId, page) => DynamicLoader.loadSection(sectionId, page),

            // Utilities
            getCurrentPage: () => IPEKData.getCurrentPage(),
            getSettings: () => IPEKData.getSettings()
        }
    };

    // Auto-initialize
    IPEKFrontend.init();

    // Export to global scope
    window.IPEKFrontend = IPEKFrontend.api;

})();