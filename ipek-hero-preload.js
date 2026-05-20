/**
 * Ana sayfa hero görselini sayfa çizilmeden önce önbelleğe alır (localStorage).
 */
(function () {
    'use strict';

    function getPageHeroBgUrl() {
        try {
            const sections = JSON.parse(localStorage.getItem('ipek_sections') || '[]');
            if (!Array.isArray(sections)) return null;

            const page = (location.pathname.split('/').pop() || 'index.html').replace(/^\//, '');
            const pageFile = page.includes('.') ? page : page + '.html';

            const hero =
                sections.find(s => s.key === 'home-hero' && pageFile === 'index.html') ||
                sections.find(s => s.page === pageFile && s.type === 'hero' && s.bgImage);

            return hero && hero.bgImage ? hero.bgImage : null;
        } catch (e) {
            return null;
        }
    }

    const url = getPageHeroBgUrl();
    if (!url) return;

    window.__IPEK_HERO_BG_URL__ = url;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.id = 'ipek-hero-critical';
    style.textContent = '.hero{background-color:#1a2a3a}';
    document.head.appendChild(style);
})();
