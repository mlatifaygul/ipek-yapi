/**
 * Preloader — Deploy-zamanı statik içeriğin kısa süreliğine görünmesini engeller.
 * <head> içinde senkron çalışır; body render edilmeden önce CSS enjekte ederek
 * tüm section/footer öğelerini gizler. Dinamik veri (Neon cloud + localStorage)
 * yüklendikten sonra script.js revealPageContent() ile içeriği gösterir.
 *
 * Ayrıca index.html'deki hero görseli varsa erken preload yapar.
 */
(function () {
    'use strict';

    /* ── 1. TÜM SAYFALAR: deploy-zamanı statik içeriği gizle ─────────── */
    document.documentElement.classList.add('ipek-content-pending');

    var style = document.createElement('style');
    style.id = 'ipek-content-critical';
    style.textContent =
        /* Header hariç tüm bölümleri gizle */
        'html.ipek-content-pending section,' +
        'html.ipek-content-pending footer,' +
        'html.ipek-content-pending .footer,' +
        'html.ipek-content-pending .nav-menu {' +
        '  opacity:0 !important;' +
        '}' +
        /* İçerik hazır olduğunda yumuşak geçiş */
        'html.ipek-content-ready section,' +
        'html.ipek-content-ready footer,' +
        'html.ipek-content-ready .footer,' +
        'html.ipek-content-ready .nav-menu {' +
        '  opacity:1 !important;' +
        '  transition:opacity .3s ease !important;' +
        '}';
    document.head.appendChild(style);

    /* Güvenlik zamanlayıcısı: 8 sn içinde JS yüklenemezse yine de göster */
    var safetyTimer = setTimeout(function () {
        if (document.documentElement.classList.contains('ipek-content-pending')) {
            document.documentElement.classList.remove('ipek-content-pending');
            document.documentElement.classList.add('ipek-content-ready');
        }
    }, 8000);

    /* Global erişim: script.js zamanlayıcıyı temizleyebilsin */
    window.__ipekSafetyTimer = safetyTimer;

    /* ── 2. INDEX.HTML: Hero'ya özel ön-yükleme ──────────────────────── */
    var page = (location.pathname.split('/').pop() || 'index.html').replace(/^\//, '');
    var pageFile = page.includes('.') ? page : page + '.html';
    if (pageFile !== 'index.html') return;

    document.documentElement.classList.add('ipek-hero-pending');

    function getHomeHeroSection() {
        try {
            var sections = JSON.parse(localStorage.getItem('ipek_sections') || '[]');
            if (!Array.isArray(sections)) return null;
            return (
                sections.find(function (s) { return s.key === 'home-hero'; }) ||
                sections.find(function (s) { return s.page === 'index.html' && s.type === 'hero'; })
            );
        } catch (e) {
            return null;
        }
    }

    var hero = getHomeHeroSection();
    if (!hero) return;

    window.__IPEK_HERO_SECTION__ = hero;

    if (hero.bgImage) {
        window.__IPEK_HERO_BG_URL__ = hero.bgImage;
        var link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = hero.bgImage;
        document.head.appendChild(link);
    }

    var heroStyle = document.createElement('style');
    heroStyle.id = 'ipek-hero-critical';
    heroStyle.textContent =
        '.hero{background-color:#1a2a3a}' +
        'html.ipek-hero-pending .hero .hero-content,html.ipek-hero-pending .hero .hero-image{opacity:0;visibility:hidden}';
    document.head.appendChild(heroStyle);
})();
