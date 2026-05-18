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
        const willOpen = !navMenu.classList.contains('active');
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Prevent background scrolling when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';

        if (!willOpen) {
            document.querySelectorAll('.nav-item.dropdown.open').forEach(item => item.classList.remove('open'));
        }
    });

    // Close mobile menu when clicking a standard link
    navMenu.addEventListener('click', (e) => {
        const link = e.target.closest('.nav-link');
        if (link) {
            // Check if it's a dropdown toggle link
            const parentLi = link.closest('.nav-item.dropdown');
            if (parentLi && window.innerWidth <= 1024) {
                // Dropdown toggling is handled by the inline onclick attribute
                return;
            }

            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            document.querySelectorAll('.nav-item.dropdown.open').forEach(item => item.classList.remove('open'));
        }
    });
}

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
const SITE_PAGES = [
    { file: 'index.html', title: 'Ana Sayfa' },
    { file: 'biz-kimiz.html', title: 'Biz Kimiz' },
    { file: 'biz-kimiz-new.html', title: 'Biz Kimiz Yeni' },
    { file: 'projeler.html', title: 'Projeler' },
    { file: 'ipek-kesifleri.html', title: 'İpek Keşifleri' },
    { file: 'ipek-kesifleri-new.html', title: 'İpek Keşifleri Yeni' },
    { file: 'iletisim.html', title: 'İletişim' },
    { file: 'iletisim-new.html', title: 'İletişim Yeni' },
    { file: 'ipekli-olmak.html', title: 'İpekli Olmak' },
    { file: 'dynamic-index.html', title: 'Dinamik Ana Sayfa' }
];
const DEFAULT_PAGE_META = {
    'index.html': { description: 'İPEK - İnce Düşünülmüş Yaşam Alanları', keywords: 'ipek,inşaat,konut' },
    'biz-kimiz.html': { description: 'İPEK Hakkımızda', keywords: 'ipek,hakkımızda' },
    'biz-kimiz-new.html': { description: 'İPEK Hakkımızda - Yeni', keywords: 'ipek,hakkımızda,yeni' },
    'projeler.html': { description: 'İPEK Projeleri', keywords: 'ipek,projeler' },
    'ipek-kesifleri.html': { description: 'İPEK Keşifleri', keywords: 'ipek,keşifler' },
    'ipek-kesifleri-new.html': { description: 'İPEK Keşifleri - Yeni', keywords: 'ipek,keşifler,yeni' },
    'iletisim.html': { description: 'İPEK İletişim', keywords: 'ipek,iletişim' },
    'iletisim-new.html': { description: 'İPEK İletişim - Yeni', keywords: 'ipek,iletişim,yeni' },
    'ipekli-olmak.html': { description: 'İPEK Kariyer', keywords: 'ipek,kariyer,ik' },
    'dynamic-index.html': { description: 'İPEK Dinamik Ana Sayfa', keywords: 'ipek,dinamik,anasayfa' }
};
const DEFAULT_SECTION_PRESETS = [
    { key: 'home-hero', name: 'Ana Sayfa Hero', page: 'index.html', type: 'hero', title: '2010 yılından beri metrekarelerle değil santimetrekarelerle çalışarak, ince düşünülmüş yaşam alanları tasarlıyoruz.', subtitle: '', content: '', bgImage: 'https://via.placeholder.com/800x600/2c3e50/ffffff?text=İPEK+Yaşam+Alanları', order: 1 },
    { key: 'home-featured', name: 'Ana Sayfa Öne Çıkan Projeler', page: 'index.html', type: 'content', title: 'Yaşam Alanlarımızı Keşfedin', subtitle: 'Estetik, konfor ve fonksiyonelliğin harmanlandığı, her detayı titizlikle planlanmış projelerimizle hayatınıza değer katıyoruz.', content: '', bgImage: '', order: 2 },
    { key: 'home-arsa', name: 'Ana Sayfa İpek Arsa', page: 'index.html', type: 'content', title: 'Birikiminizle Birlikte Hayallerinizi Büyütün.', subtitle: 'Hayalinizdeki İpek Arsa\'ya Şimdi Sahip Olun', content: '', bgImage: '', order: 3 },
    { key: 'home-cta', name: 'Ana Sayfa CTA', page: 'index.html', type: 'banner', title: '24 ODALI 1+1 EV : FOLDHOME', subtitle: 'Yenilikçi yaşam konsepti ile tanışın', content: '', bgImage: '', order: 4 },
    { key: 'home-news', name: 'Ana Sayfa Haberler', page: 'index.html', type: 'content', title: 'Haberler ve Duyurular', subtitle: '', content: '', bgImage: '', order: 5 },
    { key: 'home-contact', name: 'Ana Sayfa İletişim', page: 'index.html', type: 'content', title: 'Size Ulaşalım', subtitle: 'Projelerimiz hakkında daha fazla bilgi için bizimle iletişime geçin.', content: '', bgImage: '', order: 6 },
    { key: 'about-hero', name: 'Biz Kimiz Hero', page: 'biz-kimiz.html', type: 'hero', title: '2010 Yılından Beri İnce Düşünülmüş Yaşam Alanları', subtitle: 'Metrekarelerle değil, santimetrekarelerle çalışarak hayata geçirdiğimiz projelerimizle Türkiye\'nin lider inşaat şirketlerinden biri olmayı sürdürüyoruz.', content: '', bgImage: '', order: 1 },
    { key: 'about-vision', name: 'Biz Kimiz Vizyon', page: 'biz-kimiz.html', type: 'content', title: 'Vizyonumuz', subtitle: 'Müşterilerimize sadece binalar değil, aynı zamanda yaşam kalitesini artıran, estetik ve fonksiyonelliği bir araya getiren yaşam alanları sunmak.', content: '', bgImage: '', order: 2 },
    { key: 'about-manifesto', name: 'Biz Kimiz Manifesto', page: 'biz-kimiz.html', type: 'content', title: 'Manifesto', subtitle: 'Biz İPEK olarak, inşaatı sadece bir sektör değil, bir sanat ve bir sorumluluk olarak görüyoruz.', content: '', bgImage: '', order: 3 },
    { key: 'about-history', name: 'Biz Kimiz Tarihçe', page: 'biz-kimiz.html', type: 'content', title: 'Tarihçe', subtitle: '', content: '', bgImage: '', order: 4 },
    { key: 'discoveries-hero', name: 'Keşifler Hero', page: 'ipek-kesifleri.html', type: 'hero', title: 'İpek Keşifleri', subtitle: 'Yaşam alanlarındaki yenilikçi yaklaşımımız, sürdürülebilirlik vizyonumuz ve sektöre yön veren projelerimiz hakkında her şey.', content: '', bgImage: '', order: 1 },
    { key: 'discoveries-featured', name: 'Keşifler Öne Çıkan', page: 'ipek-kesifleri.html', type: 'content', title: 'FoldHome: 24 Odalı 1+1 Ev Konsepti', subtitle: 'Dünyada bir ilk olan FoldHome konsepti ile 1+1 dairenizde 24 farklı odaya sahip olabilirsiniz.', content: '', bgImage: '', order: 2 },
    { key: 'discoveries-categories', name: 'Keşifler Kategoriler', page: 'ipek-kesifleri.html', type: 'content', title: 'Keşif Kategorileri', subtitle: '', content: '', bgImage: '', order: 3 },
    { key: 'discoveries-grid', name: 'Keşifler Liste Başlığı', page: 'ipek-kesifleri.html', type: 'content', title: 'Tüm Keşifler', subtitle: '', content: '', bgImage: '', order: 4 },
    { key: 'discoveries-newsletter', name: 'Keşifler Bülten', page: 'ipek-kesifleri.html', type: 'content', title: 'Keşiflerden Haberdar Olun', subtitle: 'En yeni keşifler, projeler ve İPEK dünyasından haberler için bültenimize abone olun.', content: '', bgImage: '', order: 5 },
    { key: 'contact-hero', name: 'İletişim Hero', page: 'iletisim.html', type: 'hero', title: 'İletişim', subtitle: 'Projelerimiz hakkında daha fazla bilgi almak, sorularınızı sormak veya bizimle iletişime geçmek için aşağıdaki kanalları kullanabilirsiniz.', content: '', bgImage: '', order: 1 },
    { key: 'contact-form', name: 'İletişim Form Alanı', page: 'iletisim.html', type: 'content', title: 'Bize Ulaşın', subtitle: '', content: '', bgImage: '', order: 2 },
    { key: 'contact-map', name: 'İletişim Harita', page: 'iletisim.html', type: 'content', title: 'Merkez Ofisimiz', subtitle: 'Maslak\'taki merkez ofisimizi ziyaret edebilirsiniz. Randevu almanızı öneririz.', content: '', bgImage: '', order: 3 },
    { key: 'contact-offices', name: 'İletişim Ofisler', page: 'iletisim.html', type: 'content', title: 'Satış Ofislerimiz', subtitle: '', content: '', bgImage: '', order: 4 },
    { key: 'contact-faq', name: 'İletişim SSS', page: 'iletisim.html', type: 'content', title: 'Sıkça Sorulan Sorular', subtitle: '', content: '', bgImage: '', order: 5 },
    { key: 'careers-hero', name: 'Kariyer Hero', page: 'ipekli-olmak.html', type: 'hero', title: 'İpek\'li Olmak', subtitle: 'Kariyerinize yön verecek, sizi geleceğe taşıyacak bir iş ortamında yer alın. İPEK ailesinin bir parçası olun.', content: '', bgImage: '', order: 1 },
    { key: 'careers-why', name: 'Kariyer Neden İPEK', page: 'ipekli-olmak.html', type: 'content', title: 'Neden İPEK?', subtitle: '', content: '', bgImage: '', order: 2 },
    { key: 'careers-positions', name: 'Kariyer Pozisyonlar', page: 'ipekli-olmak.html', type: 'content', title: 'Açık Pozisyonlar', subtitle: '', content: '', bgImage: '', order: 3 },
    { key: 'careers-culture', name: 'Kariyer Kültür', page: 'ipekli-olmak.html', type: 'content', title: 'İPEK Kültürü', subtitle: 'Birlikte Daha İyisi', content: 'İPEK olarak çalışma kültürümüzü; inovasyon, iş birliği ve mükemmeliyet üzerine kurduk.', bgImage: '', order: 4 },
    { key: 'careers-process', name: 'Kariyer Başvuru Süreci', page: 'ipekli-olmak.html', type: 'content', title: 'Başvuru Süreci', subtitle: '', content: '', bgImage: '', order: 5 },
    { key: 'careers-testimonials', name: 'Kariyer Yorumlar', page: 'ipekli-olmak.html', type: 'content', title: 'İPEK\'liler Ne Diyor?', subtitle: '', content: '', bgImage: '', order: 6 },
    { key: 'careers-cta', name: 'Kariyer CTA', page: 'ipekli-olmak.html', type: 'banner', title: 'Kariyerinize İPEK\'te Başlayın', subtitle: 'Türkiye\'nin lider inşaat şirketinde yerinizi alın ve geleceği birlikte inşa edin.', content: '', bgImage: '', order: 7 }
];

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

function setText(selector, value) {
    if (!value) return;
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
}

function setImage(selector, url) {
    if (!url) return;
    const element = document.querySelector(selector);
    if (element) element.src = url;
}

function setHtml(selector, html) {
    if (!html) return;
    const element = document.querySelector(selector);
    if (element) element.innerHTML = html;
}

const SECTION_BINDINGS = {
    'home-hero': section => {
        setText('#hero-title', section.title);
        setImage('#hero-img', section.bgImage);
    },
    'home-featured': section => {
        setText('.featured-projects .section-title', section.title);
        setText('.featured-projects .section-subtitle', section.subtitle);
    },
    'home-arsa': section => {
        setText('.ipek-arsa .arsa-header h2', section.title);
        setText('.ipek-arsa .arsa-header p', section.subtitle);
        setHtml('.ipek-arsa .arsa-grid', section.content);
    },
    'home-cta': section => {
        setText('.cta-section .cta-content h2', section.title);
        setText('.cta-section .cta-content p', section.subtitle);
    },
    'home-news': section => {
        setText('.news-section .section-title', section.title);
        setHtml('.news-section .news-grid', section.content);
    },
    'home-contact': section => {
        setText('.contact-section .contact-content h2', section.title);
        setText('.contact-section .contact-content > p', section.subtitle);
    },
    'about-hero': section => {
        setText('.about-page .hero-section .hero-content h1', section.title);
        setText('.about-page .hero-section .hero-content p', section.subtitle);
    },
    'about-vision': section => {
        setText('.about-page .content-section:first-of-type h2', section.title);
        setText('.about-page .content-section:first-of-type .section-content > p', section.subtitle);
        setHtml('.about-page .content-section:first-of-type .values-grid', section.content);
    },
    'about-manifesto': section => {
        setText('#manifesto h2', section.title);
        setText('#manifesto .section-content > p', section.subtitle);
    },
    'about-history': section => {
        setText('#tarihce h2', section.title);
        setHtml('#tarihce .timeline', section.content);
    },
    'discoveries-hero': section => {
        setText('.discoveries-page .hero-section .hero-content h1', section.title);
        setText('.discoveries-page .hero-section .hero-content p', section.subtitle);
    },
    'discoveries-featured': section => {
        setText('.featured-discovery .featured-title', section.title);
        setText('.featured-discovery .featured-description', section.subtitle);
    },
    'discoveries-categories': section => {
        setText('.categories-section .section-title', section.title);
        setHtml('.categories-section .categories-grid', section.content);
    },
    'discoveries-grid': section => {
        setText('.discoveries-section .section-title', section.title);
        setHtml('.discoveries-section .discoveries-grid', section.content);
    },
    'discoveries-newsletter': section => {
        setText('.newsletter-section h2', section.title);
        setText('.newsletter-section p', section.subtitle);
    },
    'contact-hero': section => {
        setText('.contact-page .hero-section .hero-content h1', section.title);
        setText('.contact-page .hero-section .hero-content p', section.subtitle);
    },
    'contact-form': section => setText('.contact-form-section .form-title', section.title),
    'contact-map': section => {
        setText('.map-overlay h3', section.title);
        setText('.map-overlay p', section.subtitle);
    },
    'contact-offices': section => {
        setText('.offices-section .section-title', section.title);
        setHtml('.offices-section .offices-grid', section.content);
    },
    'contact-faq': section => {
        setText('.faq-section .section-title', section.title);
        setHtml('.faq-section .faq-container', section.content);
    },
    'careers-hero': section => {
        setText('.careers-page .hero-section .hero-content h1', section.title);
        setText('.careers-page .hero-section .hero-content p', section.subtitle);
    },
    'careers-why': section => {
        setText('.why-ipek-section .section-title', section.title);
        setHtml('.why-ipek-section .beipekits-grid', section.content);
    },
    'careers-positions': section => {
        setText('.open-positions .section-title', section.title);
        setHtml('.open-positions .positions-grid', section.content);
    },
    'careers-culture': section => {
        setText('.culture-section > .container > .section-title', section.title);
        setText('.culture-text h2', section.subtitle);
        setText('.culture-text > p', section.content);
    },
    'careers-process': section => {
        setText('.application-process .section-title', section.title);
        setHtml('.application-process .process-steps', section.content);
    },
    'careers-testimonials': section => {
        setText('.testimonials .section-title', section.title);
        setHtml('.testimonials .testimonials-grid', section.content);
    },
    'careers-cta': section => {
        setText('.careers-page .cta-section h2', section.title);
        setText('.careers-page .cta-section p', section.subtitle);
    }
};

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
                <a href="${item.url || '#'}" class="nav-link" onclick="if(window.innerWidth <= 1024) { event.preventDefault(); this.parentElement.classList.toggle('active'); return false; }">${item.name || ''} <i class="fas fa-chevron-down"></i></a>
                <div class="dropdown-content">
                    ${item.subItems.map(sub => `<a href="${sub.url || '#'}">${sub.name || ''}</a>`).join('')}
                </div>
            </li>
        `;
    }).join('') + `
        <li class="mobile-menu-footer">
            <div class="mobile-logo">İPEK<span>.</span></div>
            <div class="mobile-social">
                <a href="#"><i class="fab fa-instagram"></i></a>
                <a href="#"><i class="fab fa-linkedin"></i></a>
                <a href="#"><i class="fab fa-youtube"></i></a>
            </div>
        </li>
    `;
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

    const contactPhone = document.querySelector('.contact-info-section .info-card:nth-child(1) a');
    if (contactPhone && settings.contactPhone) {
        contactPhone.textContent = settings.contactPhone;
        contactPhone.href = `tel:${settings.contactPhone.replace(/\s+/g, '')}`;
    }

    const contactEmail = document.querySelector('.contact-info-section .info-card:nth-child(2) a');
    if (contactEmail && settings.contactEmail) {
        contactEmail.textContent = settings.contactEmail;
        contactEmail.href = `mailto:${settings.contactEmail}`;
    }

    const contactAddress = document.querySelector('.contact-info-section .info-card:nth-child(3) p');
    if (contactAddress && settings.contactAddress) {
        contactAddress.textContent = settings.contactAddress;
    }
}

function checkAndInitData() {
    if (!localStorage.getItem(DATA_KEYS.nav)) {
        console.log('Initializing default data...');
        // Default Nav
        const defaultNav = [
            { id: 1, name: 'Ana Sayfa', url: 'index.html', order: 1, active: true, subItems: [] },
            {
                id: 2, name: 'Biz Kimiz', url: 'biz-kimiz.html', order: 2, active: true, subItems: [
                    { id: 21, name: 'BİZ KİMİZ', url: 'biz-kimiz.html' },
                    { id: 22, name: 'Manifesto', url: 'biz-kimiz.html#manifesto' },
                    { id: 23, name: 'Tarihçe', url: 'biz-kimiz.html#tarihce' }
                ]
            },
            {
                id: 3, name: 'Projeler', url: 'projeler.html', order: 3, active: true, subItems: [
                    { id: 31, name: 'İpek Reserve', url: 'projeler.html' },
                    { id: 32, name: 'İpek Sapanca', url: 'projeler.html' },
                    { id: 33, name: 'İpek Arsa', url: 'projeler.html' }
                ]
            },
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
    ensureDynamicSeedData();
}

function ensureDynamicSeedData() {
    const pages = getLocalData(DATA_KEYS.pages) || [];
    const pageMap = new Map(pages.map(page => [page.file, page]));
    let pagesChanged = false;

    SITE_PAGES.forEach(page => {
        if (!pageMap.has(page.file)) {
            pages.push({
                file: page.file,
                title: page.title,
                description: DEFAULT_PAGE_META[page.file]?.description || page.title,
                keywords: DEFAULT_PAGE_META[page.file]?.keywords || 'ipek',
                active: true,
                updated: new Date().toISOString().split('T')[0]
            });
            pagesChanged = true;
        }
    });

    if (pagesChanged) {
        localStorage.setItem(DATA_KEYS.pages, JSON.stringify(pages));
    }

    const sections = getLocalData(DATA_KEYS.sections) || [];
    const sectionKeys = new Set(sections.map(section => section.key).filter(Boolean));
    let sectionsChanged = false;

    DEFAULT_SECTION_PRESETS.forEach(section => {
        if (!sectionKeys.has(section.key)) {
            sections.push(section);
            sectionsChanged = true;
        }
    });

    if (sectionsChanged) {
        localStorage.setItem(DATA_KEYS.sections, JSON.stringify(sections));
    }
}

function applyManagedSections(currentPage, sections) {
    sections
        .filter(section => section.page === currentPage && section.key)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .forEach(section => {
            const apply = SECTION_BINDINGS[section.key];
            if (typeof apply === 'function') apply(section);
        });
}


function loadDynamicContent() {
    const sections = getLocalData(DATA_KEYS.sections) || [];
    const cards = getLocalData(DATA_KEYS.cards) || [];
    const projects = getLocalData(DATA_KEYS.projects) || [];
    let currentPage = location.pathname.split('/').pop() || 'index.html';
    if (currentPage && !currentPage.includes('.')) {
        currentPage += '.html';
    }
    applyManagedSections(currentPage, sections);

    const heroSection = sections.find(s => s.type === 'hero' && (s.page === 'index.html' || s.page === currentPage));
    if (heroSection) {
        const heroTitle = document.getElementById('hero-title');
        if (heroTitle) heroTitle.innerHTML = `${heroSection.title} <br> <span style="font-weight: 300;">${heroSection.subtitle || ''}</span>`;

        const heroEl = document.querySelector('.hero');
        if (heroEl) {
            if (heroSection.bgImage) {
                heroEl.style.backgroundImage = `linear-gradient(rgba(26, 42, 58, 0.72), rgba(26, 42, 58, 0.72)), url('${heroSection.bgImage}')`;
                heroEl.style.backgroundSize = 'cover';
                heroEl.style.backgroundPosition = 'center';
                heroEl.style.backgroundRepeat = 'no-repeat';
                heroEl.classList.add('has-bg-image');
            } else {
                heroEl.style.backgroundImage = '';
                heroEl.classList.remove('has-bg-image');
            }
        }

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
                    <div class="project-content">
                        <h3>${card.title}</h3>
                        <p>${card.description || 'Lokasyon Bilgisi'}</p>
                        <div class="project-features">
                            ${(card.features || '').split(',').filter(Boolean).map(f => `<span class="feature-tag">${f.trim()}</span>`).join('')}
                        </div>
                        <div class="project-action">
                            <a href="${card.link || '#'}" class="project-link">${card.buttonText || 'Keşfet'} <i class="fas fa-arrow-right"></i></a>
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

