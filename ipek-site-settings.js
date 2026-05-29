/**
 * Site geneli marka, SEO ve tema ayarlarını uygular (ipek_settings).
 */
(function () {
    'use strict';

    function getSettings() {
        try {
            return JSON.parse(localStorage.getItem('ipek_settings') || '{}');
        } catch (e) {
            return {};
        }
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function upsertMeta(name, content, attribute) {
        if (!content) return;
        const attr = attribute || 'name';
        let meta = document.querySelector(`meta[${attr}="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attr, name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    function applyTheme(settings) {
        const cssVars = [];
        const map = {
            primaryColor: '--primary',
            primaryDarkColor: '--primary-dark',
            secondaryColor: '--secondary',
            textColor: '--text',
            bgAltColor: '--bg-alt'
        };

        Object.entries(map).forEach(([key, cssVar]) => {
            if (settings[key]) cssVars.push(`${cssVar}: ${settings[key]}`);
        });

        let themeEl = document.getElementById('ipek-theme-vars');
        if (!themeEl) {
            themeEl = document.createElement('style');
            themeEl.id = 'ipek-theme-vars';
            document.head.appendChild(themeEl);
        }
        themeEl.textContent = cssVars.length ? `:root { ${cssVars.join('; ')} }` : '';

        if (settings.headerBgColor) {
            document.querySelectorAll('.header').forEach(header => {
                header.style.background = settings.headerBgColor;
            });
        }

        let customEl = document.getElementById('ipek-custom-css');
        if (settings.customCss && settings.customCss.trim()) {
            if (!customEl) {
                customEl = document.createElement('style');
                customEl.id = 'ipek-custom-css';
                document.head.appendChild(customEl);
            }
            customEl.textContent = settings.customCss;
        } else if (customEl) {
            customEl.remove();
        }
    }

    function applyBranding(settings) {
        const link = settings.logoLink || 'index.html';
        const brandName = settings.brandName || 'İPEK';
        const brandAccent = settings.brandAccent != null ? settings.brandAccent : '.';

        document.querySelectorAll('.nav-logo').forEach(logoEl => {
            if (settings.logoUrl) {
                logoEl.innerHTML = `<a href="${escapeHtml(link)}" class="site-logo-link" style="display:flex;align-items:center;text-decoration:none;">
                    <img src="${escapeHtml(settings.logoUrl)}" alt="${escapeHtml(settings.logoAlt || brandName)}" class="site-logo-img" style="max-height:52px;max-width:200px;width:auto;object-fit:contain;">
                </a>`;
            } else {
                const accentHtml = brandAccent
                    ? `<span>${escapeHtml(brandAccent)}</span>`
                    : '';
                logoEl.innerHTML = `<h1><a href="${escapeHtml(link)}" style="text-decoration:none;color:inherit;">${escapeHtml(brandName)}${accentHtml}</a></h1>`;
            }
        });

        document.querySelectorAll('.mobile-logo').forEach(el => {
            const accentHtml = brandAccent ? `<span>${escapeHtml(brandAccent)}</span>` : '';
            el.innerHTML = `${escapeHtml(brandName)}${accentHtml}`;
        });

        const footerCopy = document.querySelector('.footer-bottom p');
        if (footerCopy && settings.brandName) {
            const year = new Date().getFullYear();
            footerCopy.textContent = `© ${year} ${settings.brandName}. Tüm hakları saklıdır.`;
        }
    }

    function applySeo(settings) {
        const pages = (() => {
            try {
                return JSON.parse(localStorage.getItem('ipek_pages') || '[]');
            } catch (e) {
                return [];
            }
        })();
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        const currentPage = pages.find(p => p.file === filename);

        if (currentPage && currentPage.title) {
            document.title = currentPage.title;
        } else if (settings.siteTitle) {
            document.title = settings.siteTitle;
        }

        upsertMeta('description', (currentPage && currentPage.description) || settings.siteDescription);
        upsertMeta('keywords', (currentPage && currentPage.keywords) || settings.metaKeywords);
        if (settings.seoRobots) upsertMeta('robots', settings.seoRobots);

        const ogTitle = (currentPage && currentPage.title) || settings.siteTitle;
        const ogDesc = (currentPage && currentPage.description) || settings.siteDescription;
        if (ogTitle) upsertMeta('og:title', ogTitle, 'property');
        if (ogDesc) upsertMeta('og:description', ogDesc, 'property');
        if (settings.ogImageUrl) upsertMeta('og:image', settings.ogImageUrl, 'property');

        if (settings.faviconUrl) {
            let icon = document.querySelector('link[rel="icon"]');
            if (!icon) {
                icon = document.createElement('link');
                icon.rel = 'icon';
                document.head.appendChild(icon);
            }
            icon.href = settings.faviconUrl;
        }

        if (settings.canonicalBaseUrl) {
            const canonical = settings.canonicalBaseUrl.replace(/\/$/, '') + '/' + filename;
            let link = document.querySelector('link[rel="canonical"]');
            if (!link) {
                link = document.createElement('link');
                link.rel = 'canonical';
                document.head.appendChild(link);
            }
            link.href = canonical;
        }
    }

    function applyAnalytics(settings) {
        const gaId = (settings.googleAnalytics || '').trim();
        if (!gaId) return;

        if (!document.getElementById('ipek-ga-script')) {
            const gaScript = document.createElement('script');
            gaScript.id = 'ipek-ga-script';
            gaScript.async = true;
            gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
            document.head.appendChild(gaScript);
        }

        if (!document.getElementById('ipek-ga-inline')) {
            const inline = document.createElement('script');
            inline.id = 'ipek-ga-inline';
            inline.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId.replace(/'/g, '')}');`;
            document.head.appendChild(inline);
        }
    }

    function apply() {
        const settings = getSettings();
        if (!settings || typeof settings !== 'object') return;
        applyTheme(settings);
        applyBranding(settings);
        applySeo(settings);
        applyAnalytics(settings);
    }

    window.IPEKSiteSettings = { apply, getSettings };

    function run() {
        const start = () => apply();
        if (window.__ipekCloudReady && typeof window.__ipekCloudReady.then === 'function') {
            window.__ipekCloudReady.then(start).catch(start);
        } else {
            start();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
