/**
 * Hero: yanlış varsayılan içeriği gizler, doğru görseli erken önbelleğe alır.
 */
(function () {
    'use strict';

    const page = (location.pathname.split('/').pop() || 'index.html').replace(/^\//, '');
    const pageFile = page.includes('.') ? page : page + '.html';
    if (pageFile !== 'index.html') return;

    document.documentElement.classList.add('ipek-hero-pending');

    function getHomeHeroSection() {
        try {
            const sections = JSON.parse(localStorage.getItem('ipek_sections') || '[]');
            if (!Array.isArray(sections)) return null;
            return (
                sections.find(s => s.key === 'home-hero') ||
                sections.find(s => s.page === 'index.html' && s.type === 'hero')
            );
        } catch (e) {
            return null;
        }
    }

    const hero = getHomeHeroSection();
    if (!hero) return;

    window.__IPEK_HERO_SECTION__ = hero;

    if (hero.bgImage) {
        window.__IPEK_HERO_BG_URL__ = hero.bgImage;
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = hero.bgImage;
        document.head.appendChild(link);
    }

    const style = document.createElement('style');
    style.id = 'ipek-hero-critical';
    style.textContent =
        '.hero{background-color:#1a2a3a}' +
        'html.ipek-hero-pending .hero .hero-content,html.ipek-hero-pending .hero .hero-image{opacity:0;visibility:hidden}';
    document.head.appendChild(style);
})();
