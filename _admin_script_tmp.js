
        // ===========================
        // DATA LAYER (localStorage)
        // ===========================
        const KEYS = {
            nav: 'ipek_navigation',
            pages: 'ipek_pages',
            projects: 'ipek_projects',
            images: 'ipek_images',
            settings: 'ipek_settings',
            cards: 'ipek_cards',
            sections: 'ipek_sections',
            activities: 'ipek_activities'
        };

        const CLOUD_STATE_ENDPOINT = '/api/state';
        const CLOUD_UPLOAD_ENDPOINT = '/api/upload';
        const MAX_UPLOAD_SIZE_BYTES = 3 * 1024 * 1024;
        let cloudSyncTimer = null;
        let isCloudSyncing = false;

        function getData(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; } }
        function setData(key, val) { 
            try {
                localStorage.setItem(key, JSON.stringify(val));
                scheduleCloudSync();
            } catch (e) {
                console.error('LocalStorage error:', e);
                if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                    toast('Depolama alanı dolu! Lütfen bazı resimleri silin veya daha küçük resimler kullanın.', 'error');
                } else {
                    toast('Veri kaydedilirken bir hata olu�Ytu.', 'error');
                }
            }
        }
        function getStateSnapshot() {
            const snapshot = {};
            Object.values(KEYS).forEach(k => {
                const raw = localStorage.getItem(k);
                if (raw !== null) snapshot[k] = raw;
            });
            return snapshot;
        }

        async function loadCloudState() {
            try {
                const res = await fetch(CLOUD_STATE_ENDPOINT, { cache: 'no-store' });
                if (!res.ok) return;
                const payload = await res.json();
                if (!payload || !payload.ok || !payload.state) return;
                Object.entries(payload.state).forEach(([key, raw]) => {
                    if (typeof raw === 'string') localStorage.setItem(key, raw);
                });
            } catch (err) {
                console.warn('Cloud state load skipped:', err);
            }
        }

        function scheduleCloudSync() {
            if (cloudSyncTimer) clearTimeout(cloudSyncTimer);
            cloudSyncTimer = setTimeout(() => syncCloudState(), 700);
        }

        async function syncCloudState() {
            if (isCloudSyncing) return;
            isCloudSyncing = true;
            try {
                await fetch(CLOUD_STATE_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ state: getStateSnapshot() })
                });
            } catch (err) {
                console.warn('Cloud state sync failed:', err);
            } finally {
                isCloudSyncing = false;
            }
        }

        function fileToDataURL(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        async function uploadImageToServer(file) {
            if (file.size > MAX_UPLOAD_SIZE_BYTES) {
                throw new Error('File too large');
            }
            const dataUrl = await fileToDataURL(file);
            const res = await fetch(CLOUD_UPLOAD_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: file.name, type: file.type || 'application/octet-stream', dataUrl })
            });
            const payload = await res.json();
            if (!res.ok || !payload.ok || !payload.url) throw new Error(payload.error || 'Upload failed');
            return payload.url;
        }
        function initData() {
            if (!getData(KEYS.nav)) setData(KEYS.nav, [
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
                        { id: 32, name: 'İpek Projeler', url: 'projeler.html' },
                        { id: 33, name: 'İpek Arsa', url: 'projeler.html' },
                        { id: 34, name: 'İpek Global', url: 'projeler.html' },
                        { id: 35, name: 'NOVU', url: 'projeler.html' },
                        { id: 36, name: 'Tümünü Gör', url: 'projeler.html' }
                    ]
                },
                { id: 4, name: 'İpek Ke�Yifleri', url: 'ipek-kesifleri.html', order: 4, active: true, subItems: [] },
                { id: 5, name: 'İleti�Yim', url: 'iletisim.html', order: 5, active: true, subItems: [] }
            ]);
            if (!getData(KEYS.pages)) setData(KEYS.pages, [
                { file: 'index.html', title: 'Ana Sayfa', description: 'İPEK - İnce Dü�Yünülmü�Y Ya�Yam Alanları', keywords: 'ipek,in�Yaat,konut', active: true, updated: today() },
                { file: 'biz-kimiz.html', title: 'Biz Kimiz', description: 'İPEK Hakkımızda', keywords: 'ipek,hakkımızda', active: true, updated: today() },
                { file: 'projeler.html', title: 'Projeler', description: 'İPEK Projeleri', keywords: 'ipek,projeler', active: true, updated: today() },
                { file: 'ipek-kesifleri.html', title: 'İpek Ke�Yifleri', description: 'İPEK Ke�Yifleri', keywords: 'ipek,ke�Yifler', active: true, updated: today() },
                { file: 'iletisim.html', title: 'İleti�Yim', description: 'İPEK İleti�Yim', keywords: 'ipek,ileti�Yim', active: true, updated: today() }
            ]);
            if (!getData(KEYS.projects)) setData(KEYS.projects, [
                { id: 1, name: 'İpek Sapanca', category: 'konut', location: 'Sapanca, Kocaeli', status: 'Ya�Yam Ba�Yladı', description: "Sapanca'ya Şimdi İpek'den Bakın", features: 'Do�Ya Manzarası, Göl Yakınlı�Yı', image: 'https://via.placeholder.com/400x250/34495e/ffffff?text=İpek+Sapanca', price: '�,�2.500.000 - �,�5.000.000', delivery: '2024-06-01' },
                { id: 2, name: 'İpek Meram', category: 'konut', location: 'Meram, Konya', status: 'İn�Yaat Devam Ediyor', description: 'Trakya\'nın yıldızı parlıyor', features: 'Merkezi Konum, Ye�Yil Alanlar', image: 'https://via.placeholder.com/400x250/34495e/ffffff?text=İpek+Meram', price: '�,�1.800.000 - �,�3.200.000', delivery: '2025-03-01' },
                { id: 3, name: 'İpek Reserve', category: 'konut', location: 'Bodrum, Mu�Yla', status: 'Ya�Yam Ba�Yladı', description: 'Premium ya�Yam alanları', features: 'Deniz Manzarası, Lüks Tasarım', image: 'https://via.placeholder.com/400x250/34495e/ffffff?text=İpek+Reserve', price: '�,�8.000.000 - �,�15.000.000', delivery: '2023-12-01' },
                { id: 4, name: 'İpek Arsa Kaz Da�Yları', category: 'arsa', location: 'Kaz Da�Yları, �?anakkale', status: 'Satı�Yta', description: "Kaz Da�Yları'nın Havası", features: 'Do�Ya İç İçe, Modüler Ev', image: 'https://via.placeholder.com/400x250/34495e/ffffff?text=İpek+Arsa+Kaz', price: '�,�500.000 - �,�1.500.000', delivery: '' },
                { id: 5, name: 'İpek Arsa Dikili', category: 'arsa', location: 'Dikili, İzmir', status: 'Satı�Yta', description: "Ege'nin incisi", features: 'Deniz Yakınlı�Yı, Turistik', image: 'https://via.placeholder.com/400x250/34495e/ffffff?text=İpek+Arsa+Dikili', price: '�,�600.000 - �,�2.000.000', delivery: '' },
                { id: 6, name: 'İpek Arsa Lüleburgaz', category: 'arsa', location: 'Lüleburgaz, Kırklareli', status: 'Satı�Yta', description: 'Trakya\'nın yıldızı', features: 'Stratejik Konum, Yatırımlık', image: 'https://via.placeholder.com/400x250/34495e/ffffff?text=İpek+Arsa+Luleburgaz', price: '�,�400.000 - �,�1.200.000', delivery: '' }
            ]);
            if (!getData(KEYS.images)) setData(KEYS.images, [
                { id: 1, name: 'hero-image.jpg', url: 'https://via.placeholder.com/800x400/34495e/ffffff?text=Hero+Image', size: '125 KB', date: today() },
                { id: 2, name: 'logo.png', url: 'https://via.placeholder.com/200x100/2c3e50/ffffff?text=İPEK+Logo', size: '45 KB', date: today() },
                { id: 3, name: 'project-1.jpg', url: 'https://via.placeholder.com/400x250/34495e/ffffff?text=Project+1', size: '89 KB', date: today() },
                { id: 4, name: 'about-image.jpg', url: 'https://via.placeholder.com/600x400/34495e/ffffff?text=About+Image', size: '156 KB', date: today() }
            ]);
            if (!getData(KEYS.settings)) setData(KEYS.settings, {
                siteTitle: 'İPEK - İnce Dü�Yünülmü�Y Ya�Yam Alanları',
                siteDescription: '2010 yılından beri metrekarelerle de�Yil santimetrekarelerle çalı�Yarak, ince dü�Yünülmü�Y ya�Yam alanları tasarlıyoruz.',
                contactEmail: 'info@ipek.com.tr', contactPhone: '+90 212 555 00 00',
                contactAddress: 'Maslak, Büyükdere Cad. No:123, Sarıyer/İstanbul',
                metaKeywords: 'ipek,in�Yaat,konut,arsa', faviconUrl: '', googleAnalytics: ''
            });
            if (!getData(KEYS.cards)) setData(KEYS.cards, [
                { id: 1, title: 'İpek Reserve', page: 'index.html', order: 1, status: 'Ya�Yam Ba�Yladı', description: 'Premium ya�Yam alanları', image: 'https://via.placeholder.com/400x300/34495e/ffffff?text=İpek+Reserve', features: 'Deniz Manzarası, Lüks Tasarım', price: '�,�8.000.000 - �,�15.000.000', link: '#', buttonText: 'Ke�Yfet' },
                { id: 2, title: 'İpek Sapanca', page: 'index.html', order: 2, status: 'Ya�Yam Ba�Yladı', description: "Sapanca'ya Şimdi İpek'den Bakın", image: 'https://via.placeholder.com/400x300/34495e/ffffff?text=İpek+Sapanca', features: 'Do�Ya Manzarası, Göl Yakınlı�Yı', price: '�,�2.500.000 - �,�5.000.000', link: '#', buttonText: 'Ke�Yfet' },
                { id: 3, title: 'İpek Arsa', page: 'index.html', order: 3, status: 'Satı�Yta', description: 'Birikiminizle Birlikte Hayallerinizi Büyütün', image: 'https://via.placeholder.com/400x300/34495e/ffffff?text=İpek+Arsa', features: 'Yatırımlık, Modüler Ev', price: '�,�500.000 - �,�1.500.000', link: '#', buttonText: 'Ke�Yfet' }
            ]);
            if (!getData(KEYS.sections)) setData(KEYS.sections, [
                { id: 1, name: 'Ana Sayfa Hero', page: 'index.html', type: 'hero', title: '2010 yılından beri metrekarelerle de�Yil santimetrekarelerle çalı�Yarak, ince dü�Yünülmü�Y ya�Yam alanları tasarlıyoruz.', subtitle: '', content: '', bgImage: 'https://via.placeholder.com/800x600/2c3e50/ffffff?text=İPEK+Ya�Yam+Alanları', order: 1 }
            ]);
            if (!getData(KEYS.activities)) setData(KEYS.activities, [{ id: 1, text: 'Admin paneli olu�Yturuldu', time: new Date().toISOString(), type: 'info' }]);
        }

        function today() { return new Date().toISOString().split('T')[0]; }

        function addActivity(text, type = 'info') {
            const acts = getData(KEYS.activities) || [];
            acts.unshift({ id: Date.now(), text, time: new Date().toISOString(), type });
            if (acts.length > 30) acts.pop();
            setData(KEYS.activities, acts);
        }

        // ===========================
        // ROUTING
        // ===========================
        const pageIcons = {
            dashboard: 'chart-pie', navigation: 'bars', pages: 'file-alt', sections: 'layer-group',
            cards: 'th-large', projects: 'building', media: 'images', settings: 'cog'
        };
        const pageTitles = {
            dashboard: 'Dashboard', navigation: 'Navigasyon & Menüler', pages: 'Sayfa Yönetimi', sections: 'Bölüm Yönetimi',
            cards: 'Kartlar & İçerikler', projects: 'Proje Yönetimi', media: 'Resim Kütüphanesi', settings: 'Site Ayarları'
        };

        function goPage(name) {
            document.querySelectorAll('.section-page').forEach(p => p.classList.remove('active'));
            document.getElementById('page-' + name).classList.add('active');
            document.querySelectorAll('.nav-item').forEach(i => { i.classList.toggle('active', i.dataset.page === name); });
            document.getElementById('topbarTitle').textContent = pageTitles[name] || name;
            document.getElementById('topbarIcon').className = 'fas fa-' + (pageIcons[name] || 'circle');
            document.getElementById('currentPageBadge').textContent = pageTitles[name] || name;
            loadPage(name);
        }

        function loadPage(name) {
            if (name === 'dashboard') renderDashboard();
            else if (name === 'navigation') renderNav();
            else if (name === 'pages') renderPages();
            else if (name === 'sections') renderSections();
            else if (name === 'cards') renderCards();
            else if (name === 'projects') renderProjects();
            else if (name === 'media') renderMedia();
            else if (name === 'settings') loadSettings();
        }

        document.querySelectorAll('.nav-item[data-page]').forEach(item => {
            item.addEventListener('click', () => goPage(item.dataset.page));
        });

        // ===========================
        // DASHBOARD
        // ===========================
        function renderDashboard() {
            const pages = getData(KEYS.pages) || [];
            const projects = getData(KEYS.projects) || [];
            const images = getData(KEYS.images) || [];
            const cards = getData(KEYS.cards) || [];
            document.getElementById('stat-pages').textContent = pages.length;
            document.getElementById('stat-projects').textContent = projects.length;
            document.getElementById('stat-cards').textContent = cards.length;
            document.getElementById('stat-images').textContent = images.length;

            const acts = getData(KEYS.activities) || [];
            const actEl = document.getElementById('activityList');
            actEl.innerHTML = acts.slice(0, 8).map(a => `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);">
            <div style="width:8px;height:8px;border-radius:50%;background:var(--${a.type === 'error' ? 'red' : a.type === 'success' ? 'green' : 'accent'});flex-shrink:0;"></div>
            <div style="flex:1;font-size:13px;">${a.text}</div>
            <div style="font-size:11px;color:var(--text3);">${timeAgo(a.time)}</div>
        </div>`).join('');
        }

        function timeAgo(iso) {
            const diff = (Date.now() - new Date(iso)) / 1000;
            if (diff < 60) return 'Az önce';
            if (diff < 3600) return Math.floor(diff / 60) + ' dk önce';
            if (diff < 86400) return Math.floor(diff / 3600) + ' sa önce';
            return Math.floor(diff / 86400) + ' gün önce';
        }

        // ===========================
        // NAVIGATION
        // ===========================
        function renderNav() {
            const items = getData(KEYS.nav) || [];
            const el = document.getElementById('navList');
            if (!items.length) { el.innerHTML = '<p style="color:var(--text2);font-size:13px;text-align:center;padding:20px;">Henüz menü ö�Yesi yok.</p>'; return; }
            el.innerHTML = items.sort((a, b) => a.order - b.order).map(item => `
        <div class="content-item">
            <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
            <div class="ci-thumb-placeholder"><i class="fas fa-link"></i></div>
            <div class="ci-info">
                <div class="ci-name">${item.name}</div>
                <div class="ci-meta">${item.url} ${item.subItems && item.subItems.length ? '�?� ' + item.subItems.length + ' alt menü' : ''}</div>
                ${item.subItems && item.subItems.length ? `
                <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">
                ${item.subItems.map(s => `<span style="background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:3px 9px;font-size:11px;color:var(--text2);">${s.name}</span>`).join('')}
                </div>`: ''}
            </div>
            <span class="ci-badge ${item.active ? 'active' : 'inactive'}">${item.active ? 'Aktif' : 'Pasif'}</span>
            <div style="display:flex;gap:6px;">
                <button class="btn btn-icon edit" onclick="editNav(${item.id})" title="Düzenle"><i class="fas fa-edit"></i></button>
                <button class="btn btn-icon del" onclick="deleteConfirm('nav',${item.id},'${item.name} menüsünü silmek istedi�Yinizden emin misiniz?')" title="Sil"><i class="fas fa-trash"></i></button>
            </div>
        </div>`).join('');
        }

        function openNavModal(id = null) {
            document.getElementById('navId').value = id || '';
            document.getElementById('navModalTitle').textContent = id ? 'Menü �-�Yesini Düzenle' : 'Menü �-�Yesi Ekle';
            document.getElementById('navName').value = '';
            document.getElementById('navUrl').value = '';
            document.getElementById('navOrder').value = 1;
            document.getElementById('navActive').value = 'true';
            document.getElementById('subNavItems').innerHTML = '';
            if (id) {
                const items = getData(KEYS.nav) || [];
                const item = items.find(i => i.id === id);
                if (item) {
                    document.getElementById('navName').value = item.name;
                    document.getElementById('navUrl').value = item.url;
                    document.getElementById('navOrder').value = item.order || 1;
                    document.getElementById('navActive').value = item.active.toString();
                    (item.subItems || []).forEach(s => addSubNavRow(s.name, s.url));
                }
            }
            openModal('navModal');
        }

        function addSubNavRow(name = '', url = '') {
            const row = document.createElement('div');
            row.className = 'sub-item';
            row.innerHTML = `
        <input class="form-control sub-name" type="text" placeholder="Alt menü adı" value="${name}" style="flex:1;">
        <input class="form-control sub-url" type="text" placeholder="URL" value="${url}" style="flex:1;">
        <button class="btn btn-icon del" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;
            document.getElementById('subNavItems').appendChild(row);
        }

        function editNav(id) { openNavModal(id); }

        function saveNav() {
            const name = document.getElementById('navName').value.trim();
            const url = document.getElementById('navUrl').value.trim();
            if (!name || !url) { toast('Menü adı ve URL zorunludur.', 'error'); return; }
            const id = parseInt(document.getElementById('navId').value) || null;
            const items = getData(KEYS.nav) || [];
            const subRows = document.querySelectorAll('#subNavItems .sub-item');
            const subItems = [];
            subRows.forEach((row, i) => {
                const n = row.querySelector('.sub-name').value.trim();
                const u = row.querySelector('.sub-url').value.trim();
                if (n && u) subItems.push({ id: Date.now() + i, name: n, url: u });
            });
            const data = { name, url, order: parseInt(document.getElementById('navOrder').value) || 1, active: document.getElementById('navActive').value === 'true', subItems };
            if (id) {
                const idx = items.findIndex(i => i.id === id);
                if (idx >= 0) items[idx] = { ...items[idx], ...data };
            } else {
                const newId = Math.max(0, ...items.map(i => i.id)) + 1;
                items.push({ id: newId, ...data });
            }
            setData(KEYS.nav, items);
            addActivity(`Menü "${name}" ${id ? 'güncellendi' : 'eklendi'}`, 'success');
            closeModal('navModal');
            renderNav();
            toast(`Menü ${id ? 'güncellendi' : 'eklendi'}!`, 'success');
        }

        function deleteNav(id) {
            const items = (getData(KEYS.nav) || []).filter(i => i.id !== id);
            setData(KEYS.nav, items); renderNav(); addActivity('Menü silindi', 'info'); toast('Menü silindi', 'info');
        }

        // ===========================
        // PAGES
        // ===========================
        function renderPages() {
            const pages = getData(KEYS.pages) || [];
            const tbody = document.getElementById('pagesTableBody');
            tbody.innerHTML = pages.map(p => `
        <tr>
            <td><strong>${p.title}</strong></td>
            <td><code style="background:var(--surface2);padding:2px 8px;border-radius:4px;font-size:11px;">${p.file}</code></td>
            <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text2);font-size:12px;">${p.description || '-'}</td>
            <td><span class="badge ${p.active !== false ? 'badge-active' : 'badge-inactive'}">${p.active !== false ? 'Aktif' : 'Pasif'}</span></td>
            <td style="color:var(--text2);font-size:12px;">${p.updated || '-'}</td>
            <td>
                <div style="display:flex;gap:6px;">
                    <a href="${p.file}" target="_blank" class="btn btn-icon view" title="Görüntüle"><i class="fas fa-eye"></i></a>
                    <button class="btn btn-icon edit" onclick="editPage('${p.file}')" title="Düzenle"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-icon del" onclick="deleteConfirm('page','${p.file}','${p.title} sayfasını silmek istedi�Yinizden emin misiniz?')" title="Sil"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>`).join('');
        }

        function openPageModal(file = null) {
            document.getElementById('pageModalFile').value = file || '';
            document.getElementById('pageModalTitle').textContent = file ? 'Sayfayı Düzenle' : 'Yeni Sayfa';
            document.getElementById('pmTitle').value = '';
            document.getElementById('pmFile').value = '';
            document.getElementById('pmDescription').value = '';
            document.getElementById('pmKeywords').value = '';
            document.getElementById('pmStatus').value = 'active';
            if (file) {
                const pages = getData(KEYS.pages) || [];
                const p = pages.find(x => x.file === file);
                if (p) {
                    document.getElementById('pmTitle').value = p.title || '';
                    document.getElementById('pmFile').value = p.file || '';
                    document.getElementById('pmDescription').value = p.description || '';
                    document.getElementById('pmKeywords').value = p.keywords || '';
                    document.getElementById('pmStatus').value = p.active !== false ? 'active' : 'inactive';
                }
            }
            openModal('pageModal');
        }

        function editPage(file) { openPageModal(file); }

        function savePage() {
            const title = document.getElementById('pmTitle').value.trim();
            const file = document.getElementById('pmFile').value.trim();
            if (!title || !file) { toast('Ba�Ylık ve dosya adı zorunludur.', 'error'); return; }
            const origFile = document.getElementById('pageModalFile').value;
            const pages = getData(KEYS.pages) || [];
            const data = { title, file, description: document.getElementById('pmDescription').value, keywords: document.getElementById('pmKeywords').value, active: document.getElementById('pmStatus').value === 'active', updated: today() };
            if (origFile) {
                const idx = pages.findIndex(p => p.file === origFile);
                if (idx >= 0) pages[idx] = { ...pages[idx], ...data };
            } else {
                pages.push(data);
            }
            setData(KEYS.pages, pages);
            addActivity(`Sayfa "${title}" ${origFile ? 'güncellendi' : 'eklendi'}`, 'success');
            closeModal('pageModal'); renderPages();
            toast(`Sayfa ${origFile ? 'güncellendi' : 'eklendi'}!`, 'success');
        }

        function deletePage(file) {
            const pages = (getData(KEYS.pages) || []).filter(p => p.file !== file);
            setData(KEYS.pages, pages); renderPages(); addActivity('Sayfa silindi', 'info'); toast('Sayfa silindi', 'info');
        }

        // ===========================
        // SECTIONS
        // ===========================
        function renderSections() {
            const filter = document.getElementById('sectionPageFilter').value;
            let sections = getData(DATA_KEYS.sections) || getData('ipek_sections') || [];
            if (filter) sections = sections.filter(s => s.page === filter);
            sections.sort((a, b) => a.order - b.order);
            const el = document.getElementById('sectionsList');
            if (!sections.length) { el.innerHTML = '<p style="color:var(--text2);font-size:13px;text-align:center;padding:30px;">Bölüm bulunamadı.</p>'; return; }
            el.innerHTML = sections.map(s => `
        <div class="content-item">
            <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
            ${s.bgImage ? `<img class="ci-thumb" src="${s.bgImage}" style="width:80px;height:50px;object-fit:cover;">` : `<div class="ci-thumb-placeholder"><i class="fas fa-layer-group"></i></div>`}
            <div class="ci-info">
                <div class="ci-name">${s.name}</div>
                <div class="ci-meta">${s.page} �?� Tip: ${s.type} �?� Sıra: ${s.order}</div>
                <div style="font-size:12px;color:var(--text2);margin-top:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${s.title}</div>
            </div>
            <div style="display:flex;gap:6px;">
                <button class="btn btn-icon edit" onclick="editSection(${s.id})" title="Düzenle"><i class="fas fa-edit"></i></button>
                <button class="btn btn-icon del" onclick="deleteConfirm('section',${s.id},'${s.name} bölümünü silmek istedi�Yinizden emin misiniz?')" title="Sil"><i class="fas fa-trash"></i></button>
            </div>
        </div>`).join('');
        }

        function openSectionModal(id = null) {
            document.getElementById('sectionId').value = id || '';
            document.getElementById('sectionModalTitle').textContent = id ? 'Bölümü Düzenle' : 'Yeni Bölüm Ekle';
            ['sectionName', 'sectionTitle', 'sectionSubtitle', 'sectionBgImage'].forEach(f => document.getElementById(f).value = '');
            document.getElementById('sectionContent').value = '';
            document.getElementById('sectionOrder').value = 1;
            document.getElementById('sectionType').value = 'hero';
            document.getElementById('sectionPage').value = 'index.html';
            
            if (id) {
                const sections = getData(KEYS.sections) || getData('ipek_sections') || [];
                const s = sections.find(x => x.id === id);
                if (s) {
                    document.getElementById('sectionName').value = s.name || '';
                    document.getElementById('sectionTitle').value = s.title || '';
                    document.getElementById('sectionSubtitle').value = s.subtitle || '';
                    document.getElementById('sectionContent').value = s.content || '';
                    document.getElementById('sectionBgImage').value = s.bgImage || '';
                    document.getElementById('sectionOrder').value = s.order || 1;
                    document.getElementById('sectionType').value = s.type || 'hero';
                    document.getElementById('sectionPage').value = s.page || 'index.html';
                }
            }
            openModal('sectionModal');
        }

        function editSection(id) { openSectionModal(id); }

        function saveSection() {
            const name = document.getElementById('sectionName').value.trim();
            const page = document.getElementById('sectionPage').value;
            if (!name || !page) { toast('Ad ve sayfa zorunludur.', 'error'); return; }
            const id = parseInt(document.getElementById('sectionId').value) || null;
            const sections = getData(KEYS.sections) || getData('ipek_sections') || [];
            const data = { 
                name, 
                page, 
                order: parseInt(document.getElementById('sectionOrder').value) || 1, 
                type: document.getElementById('sectionType').value,
                title: document.getElementById('sectionTitle').value,
                subtitle: document.getElementById('sectionSubtitle').value,
                content: document.getElementById('sectionContent').value,
                bgImage: document.getElementById('sectionBgImage').value
            };
            if (id) {
                const idx = sections.findIndex(s => s.id === id);
                if (idx >= 0) sections[idx] = { ...sections[idx], ...data };
            } else {
                const newId = Math.max(0, ...sections.map(s => s.id)) + 1;
                sections.push({ id: newId, ...data });
            }
            setData(KEYS.sections, sections);
            addActivity(`Bölüm "${name}" güncellendi`, 'success');
            closeModal('sectionModal'); renderSections();
            toast(`Bölüm kaydedildi!`, 'success');
        }

        function deleteSection(id) {
            const sections = (getData(KEYS.sections) || []).filter(s => s.id !== id);
            setData(KEYS.sections, sections); renderSections(); toast('Bölüm silindi', 'info');
        }

        function switchSectionImgTab(tab, el) {
            ['url', 'upload', 'library'].forEach(t => {
                const e = document.getElementById('sectionImgTab' + t.charAt(0).toUpperCase() + t.slice(1));
                if (e) e.style.display = t === tab ? 'block' : 'none';
            });
            document.querySelectorAll('#sectionModal .img-picker-tab').forEach(t => t.classList.remove('active'));
            if (el) el.classList.add('active');
            if (tab === 'library') renderSectionLibrary();
        }

        function renderSectionLibrary() {
            const images = getData(KEYS.images) || [];
            const el = document.getElementById('sectionLibraryGrid');
            el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
        ${images.map(img => `
        <div onclick="selectSectionLibraryImg('${img.url}','${img.name}')" style="cursor:pointer;border:2px solid var(--border);border-radius:6px;overflow:hidden;transition:border-color .2s;" 
             title="${img.name}" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
            <img src="${img.url}" style="width:100%;height:60px;object-fit:cover;display:block;" onerror="this.parentElement.style.display='none'">
        </div>`).join('')}
    </div>`;
        }

        function selectSectionLibraryImg(url, name) {
            document.getElementById('sectionBgImage').value = url;
            setSectionImgPreview(url);
            switchSectionImgTab('url', document.querySelectorAll('#sectionModal .img-picker-tab')[0]);
            toast(`"${name}" seçildi`, 'success');
        }

        async function handleSectionImageUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            try {
                const url = await uploadImageToServer(file);
                document.getElementById('sectionBgImage').value = url;
                setSectionImgPreview(url);
                const images = getData(KEYS.images) || [];
                const newId = Math.max(0, ...images.map(i => i.id)) + 1;
                images.push({ id: newId, name: file.name, url, size: formatSize(file.size), date: today() });
                setData(KEYS.images, images);
                toast('Resim yüklendi!', 'success');
            } catch (err) {
                toast('Resim yüklenemedi.', 'error');
            }
        }

        function updateSectionImgPreview() { setSectionImgPreview(document.getElementById('sectionBgImage').value); }

        function setSectionImgPreview(url) {
            const img = document.getElementById('sectionImgPreview');
            const ph = document.getElementById('sectionImgPlaceholder');
            if (url) { img.src = url; img.style.display = 'block'; ph.style.display = 'none'; }
            else { img.style.display = 'none'; ph.style.display = 'flex'; }
        }

        // ===========================
        // CARDS
        // ===========================
        function renderCards() {
            const filter = document.getElementById('cardPageFilter').value;
            let cards = getData(KEYS.cards) || [];
            if (filter) cards = cards.filter(c => c.page === filter);
            cards.sort((a, b) => a.order - b.order);
            const el = document.getElementById('cardsList');
            if (!cards.length) { el.innerHTML = '<p style="color:var(--text2);font-size:13px;text-align:center;padding:30px;">Bu sayfa için kart bulunamadı. Yeni kart ekleyin.</p>'; return; }
            el.innerHTML = cards.map(c => `
        <div class="content-item">
            <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
            ${c.image ? `<img class="ci-thumb" src="${c.image}" alt="${c.title}" onerror="this.style.display='none'">` :
                    `<div class="ci-thumb-placeholder"><i class="fas fa-image"></i></div>`}
            <div class="ci-info" style="flex:1;min-width:0;">
                <div class="ci-name">${c.title}</div>
                <div class="ci-meta">${c.page} �?� Sıra:${c.order} ${c.price ? '�?� ' + c.price : ''}</div>
                ${c.description ? `<div style="font-size:12px;color:var(--text2);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.description}</div>` : ''}
                ${c.features ? `<div style="font-size:11px;color:var(--accent);margin-top:4px;">${c.features}</div>` : ''}
            </div>
            ${c.status ? `<span class="ci-badge ${c.status === 'Satı�Yta' ? 'satis' : c.status === 'İn�Yaat Devam Ediyor' ? 'insaat' : 'active'}">${c.status}</span>` : ''}
            <div style="display:flex;gap:6px;flex-shrink:0;">
                <button class="btn btn-icon edit" onclick="editCard(${c.id})" title="Düzenle"><i class="fas fa-edit"></i></button>
                <button class="btn btn-icon del" onclick="deleteConfirm('card',${c.id},'${c.title} kartını silmek istedi�Yinizden emin misiniz?')" title="Sil"><i class="fas fa-trash"></i></button>
            </div>
        </div>`).join('');
        }

        function openCardModal(id = null) {
            document.getElementById('cardId').value = id || '';
            document.getElementById('cardModalTitle').textContent = id ? 'Kartı Düzenle' : 'Yeni Kart Ekle';
            ['cardTitle', 'cardFeatures', 'cardPrice', 'cardLink', 'cardButtonText'].forEach(f => document.getElementById(f).value = '');
            document.getElementById('cardDescription').value = '';
            document.getElementById('cardOrder').value = 1;
            document.getElementById('cardStatus').value = '';
            document.getElementById('cardPage').value = 'index.html';
            document.getElementById('cardImage').value = '';
            setCardImgPreview('');
            switchCardImgTab('url', null);
            if (id) {
                const cards = getData(KEYS.cards) || [];
                const c = cards.find(x => x.id === id);
                if (c) {
                    document.getElementById('cardTitle').value = c.title || '';
                    document.getElementById('cardPage').value = c.page || 'index.html';
                    document.getElementById('cardOrder').value = c.order || 1;
                    document.getElementById('cardStatus').value = c.status || '';
                    document.getElementById('cardDescription').value = c.description || '';
                    document.getElementById('cardImage').value = c.image || '';
                    document.getElementById('cardFeatures').value = c.features || '';
                    document.getElementById('cardPrice').value = c.price || '';
                    document.getElementById('cardLink').value = c.link || '';
                    document.getElementById('cardButtonText').value = c.buttonText || 'Ke�Yfet';
                    setCardImgPreview(c.image);
                }
            }
            renderCardLibrary();
            openModal('cardModal');
        }

        function editCard(id) { openCardModal(id); }

        function saveCard() {
            const title = document.getElementById('cardTitle').value.trim();
            const page = document.getElementById('cardPage').value;
            if (!title || !page) { toast('Ba�Ylık ve sayfa zorunludur.', 'error'); return; }
            const id = parseInt(document.getElementById('cardId').value) || null;
            const cards = getData(KEYS.cards) || [];
            const data = { title, page, order: parseInt(document.getElementById('cardOrder').value) || 1, status: document.getElementById('cardStatus').value, description: document.getElementById('cardDescription').value, image: document.getElementById('cardImage').value, features: document.getElementById('cardFeatures').value, price: document.getElementById('cardPrice').value, link: document.getElementById('cardLink').value, buttonText: document.getElementById('cardButtonText').value || 'Ke�Yfet' };
            if (id) {
                const idx = cards.findIndex(c => c.id === id);
                if (idx >= 0) cards[idx] = { ...cards[idx], ...data };
            } else {
                const newId = Math.max(0, ...cards.map(c => c.id)) + 1;
                cards.push({ id: newId, ...data });
            }
            setData(KEYS.cards, cards);
            addActivity(`Kart "${title}" ${id ? 'güncellendi' : 'eklendi'}`, 'success');
            closeModal('cardModal'); renderCards();
            toast(`Kart ${id ? 'güncellendi' : 'eklendi'}!`, 'success');
        }

        function deleteCard(id) {
            const cards = (getData(KEYS.cards) || []).filter(c => c.id !== id);
            setData(KEYS.cards, cards); renderCards(); addActivity('Kart silindi', 'info'); toast('Kart silindi', 'info');
        }

        function switchCardImgTab(tab, el) {
            ['url', 'upload', 'library'].forEach(t => {
                const el2 = document.getElementById('cardImgTab' + t.charAt(0).toUpperCase() + t.slice(1));
                if (el2) el2.style.display = t === tab ? 'block' : 'none';
            });
            document.querySelectorAll('#cardModal .img-picker-tab').forEach(t => t.classList.remove('active'));
            if (el) el.classList.add('active');
            else {
                const tabs = document.querySelectorAll('#cardModal .img-picker-tab');
                const idx = { url: 0, upload: 1, library: 2 }[tab] || 0;
                if (tabs[idx]) tabs[idx].classList.add('active');
            }
            if (tab === 'library') renderCardLibrary();
        }

        function renderCardLibrary() {
            const images = getData(KEYS.images) || [];
            const el = document.getElementById('cardLibraryGrid');
            el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
        ${images.map(img => `
        <div onclick="selectCardLibraryImg('${img.url}','${img.name}')" style="cursor:pointer;border:2px solid var(--border);border-radius:6px;overflow:hidden;transition:border-color .2s;" 
             title="${img.name}" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
            <img src="${img.url}" style="width:100%;height:60px;object-fit:cover;display:block;" onerror="this.parentElement.style.display='none'">
            <div style="padding:4px;font-size:10px;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${img.name}</div>
        </div>`).join('')}
    </div>`;
        }

        function selectCardLibraryImg(url, name) {
            document.getElementById('cardImage').value = url;
            setCardImgPreview(url);
            switchCardImgTab('url', null);
            toast(`"${name}" seçildi`, 'success');
        }

        async function handleCardImageUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            if (file.size > MAX_UPLOAD_SIZE_BYTES) { toast('Dosya 3MB\'dan büyük olamaz.', 'error'); return; }
            try {
                const url = await uploadImageToServer(file);
                document.getElementById('cardImage').value = url;
                setCardImgPreview(url);
                const images = getData(KEYS.images) || [];
                const newId = Math.max(0, ...images.map(i => i.id)) + 1;
                images.push({ id: newId, name: file.name, url, size: formatSize(file.size), date: today() });
                setData(KEYS.images, images);
                toast('Resim yüklendi ve kütüphaneye eklendi!', 'success');
            } catch (err) {
                toast('Resim yüklenemedi.', 'error');
            }
        }

        function updateCardImgPreview() { setCardImgPreview(document.getElementById('cardImage').value); }

        function setCardImgPreview(url) {
            const img = document.getElementById('cardImgPreview');
            const ph = document.getElementById('cardImgPlaceholder');
            if (url) { img.src = url; img.style.display = 'block'; ph.style.display = 'none'; }
            else { img.style.display = 'none'; ph.style.display = 'flex'; }
        }

        // ===========================
        // PROJECTS
        // ===========================
        function renderProjects() {
            const projects = getData(KEYS.projects) || [];
            const tbody = document.getElementById('projectsTableBody');
            tbody.innerHTML = projects.map(p => `
        <tr>
            <td>${p.image ? `<img src="${p.image}" style="width:60px;height:42px;object-fit:cover;border-radius:6px;border:1px solid var(--border);" onerror="this.style.display='none'">` :
                    `<div style="width:60px;height:42px;background:var(--surface2);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--text3);"><i class="fas fa-image"></i></div>`}</td>
            <td><strong>${p.name}</strong></td>
            <td style="color:var(--text2);font-size:12px;">${p.category}</td>
            <td style="color:var(--text2);font-size:12px;">${p.location}</td>
            <td><span class="ci-badge ${p.status === 'Ya�Yam Ba�Yladı' ? 'active' : p.status === 'Satı�Yta' ? 'satis' : 'insaat'}" style="font-size:11px;">${p.status}</span></td>
            <td style="color:var(--text2);font-size:12px;">${p.price || '-'}</td>
            <td>
                <div style="display:flex;gap:6px;">
                    <button class="btn btn-icon edit" onclick="editProject(${p.id})" title="Düzenle"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-icon del" onclick="deleteConfirm('project',${p.id},'${p.name} projesini silmek istedi�Yinizden emin misiniz?')" title="Sil"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>`).join('');
        }

        function openProjectModal(id = null) {
            document.getElementById('projectId').value = id || '';
            document.getElementById('projectModalTitle').textContent = id ? 'Projeyi Düzenle' : 'Yeni Proje Ekle';
            ['projectName', 'projectLocation', 'projectDescription', 'projectFeatures', 'projectImage', 'projectPrice'].forEach(f => document.getElementById(f).value = '');
            document.getElementById('projectCategory').value = 'konut';
            document.getElementById('projectStatus').value = 'Ya�Yam Ba�Yladı';
            document.getElementById('projectDelivery').value = '';
            setProjImgPreview('');
            switchProjImgTab('url', null);
            if (id) {
                const projects = getData(KEYS.projects) || [];
                const p = projects.find(x => x.id === id);
                if (p) {
                    document.getElementById('projectName').value = p.name || '';
                    document.getElementById('projectCategory').value = p.category || 'konut';
                    document.getElementById('projectLocation').value = p.location || '';
                    document.getElementById('projectStatus').value = p.status || 'Ya�Yam Ba�Yladı';
                    document.getElementById('projectDescription').value = p.description || '';
                    document.getElementById('projectImage').value = p.image || '';
                    document.getElementById('projectFeatures').value = p.features || '';
                    document.getElementById('projectPrice').value = p.price || '';
                    document.getElementById('projectDelivery').value = p.delivery || '';
                    setProjImgPreview(p.image);
                }
            }
            renderProjLibrary();
            openModal('projectModal');
        }

        function editProject(id) { openProjectModal(id); }

        function saveProject() {
            const name = document.getElementById('projectName').value.trim();
            if (!name) { toast('Proje adı zorunludur.', 'error'); return; }
            const id = parseInt(document.getElementById('projectId').value) || null;
            const projects = getData(KEYS.projects) || [];
            const data = { name, category: document.getElementById('projectCategory').value, location: document.getElementById('projectLocation').value, status: document.getElementById('projectStatus').value, description: document.getElementById('projectDescription').value, image: document.getElementById('projectImage').value, features: document.getElementById('projectFeatures').value, price: document.getElementById('projectPrice').value, delivery: document.getElementById('projectDelivery').value };
            if (id) {
                const idx = projects.findIndex(p => p.id === id);
                if (idx >= 0) projects[idx] = { ...projects[idx], ...data };
            } else {
                const newId = Math.max(0, ...projects.map(p => p.id)) + 1;
                projects.push({ id: newId, ...data });
            }
            setData(KEYS.projects, projects);
            addActivity(`Proje "${name}" ${id ? 'güncellendi' : 'eklendi'}`, 'success');
            closeModal('projectModal'); renderProjects();
            toast(`Proje ${id ? 'güncellendi' : 'eklendi'}!`, 'success');
        }

        function deleteProject(id) {
            const projects = (getData(KEYS.projects) || []).filter(p => p.id !== id);
            setData(KEYS.projects, projects); renderProjects(); addActivity('Proje silindi', 'info'); toast('Proje silindi', 'info');
        }

        function switchProjImgTab(tab, el) {
            ['url', 'upload', 'library'].forEach(t => {
                const e = document.getElementById('projImgTab' + t.charAt(0).toUpperCase() + t.slice(1));
                if (e) e.style.display = t === tab ? 'block' : 'none';
            });
            document.querySelectorAll('#projectModal .img-picker-tab').forEach(t => t.classList.remove('active'));
            if (el) el.classList.add('active');
            else {
                const tabs = document.querySelectorAll('#projectModal .img-picker-tab');
                const idx = { url: 0, upload: 1, library: 2 }[tab] || 0;
                if (tabs[idx]) tabs[idx].classList.add('active');
            }
            if (tab === 'library') renderProjLibrary();
        }

        function renderProjLibrary() {
            const images = getData(KEYS.images) || [];
            const el = document.getElementById('projLibraryGrid');
            el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
        ${images.map(img => `
        <div onclick="selectProjLibraryImg('${img.url}','${img.name}')" style="cursor:pointer;border:2px solid var(--border);border-radius:6px;overflow:hidden;transition:border-color .2s;"
             onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
            <img src="${img.url}" style="width:100%;height:60px;object-fit:cover;display:block;" onerror="this.parentElement.style.display='none'">
            <div style="padding:4px;font-size:10px;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${img.name}</div>
        </div>`).join('')}
    </div>`;
        }

        function selectProjLibraryImg(url, name) {
            document.getElementById('projectImage').value = url;
            setProjImgPreview(url);
            switchProjImgTab('url', null);
            toast(`"${name}" seçildi`, 'success');
        }

        async function handleProjImageUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            try {
                const url = await uploadImageToServer(file);
                document.getElementById('projectImage').value = url;
                setProjImgPreview(url);
                const images = getData(KEYS.images) || [];
                const newId = Math.max(0, ...images.map(i => i.id)) + 1;
                images.push({ id: newId, name: file.name, url, size: formatSize(file.size), date: today() });
                setData(KEYS.images, images);
                toast('Resim yüklendi!', 'success');
            } catch (err) {
                toast('Resim yüklenemedi.', 'error');
            }
        }

        function updateProjImgPreview() { setProjImgPreview(document.getElementById('projectImage').value); }

        function setProjImgPreview(url) {
            const img = document.getElementById('projImgPreview');
            const ph = document.getElementById('projImgPlaceholder');
            if (url) { img.src = url; img.style.display = 'block'; ph.style.display = 'none'; }
            else { img.style.display = 'none'; ph.style.display = 'flex'; }
        }

        // ===========================
        // MEDIA
        // ===========================
        let selectedImages = new Set();

        function renderMedia() {
            const images = getData(KEYS.images) || [];
            const search = document.getElementById('mediaSearch').value.toLowerCase();
            const filtered = images.filter(img => !search || img.name.toLowerCase().includes(search));
            document.getElementById('mediaCount').textContent = `(${filtered.length} resim)`;
            const grid = document.getElementById('mediaGrid');
            if (!filtered.length) { grid.innerHTML = '<p style="color:var(--text2);font-size:13px;grid-column:1/-1;text-align:center;padding:40px;">Resim bulunamadı.</p>'; return; }
            grid.innerHTML = filtered.map(img => `
        <div class="media-item ${selectedImages.has(img.id) ? 'selected' : ''}" id="mitem-${img.id}">
            <img class="media-thumb" src="${img.url}" alt="${img.name}" onerror="this.parentElement.querySelector('.media-thumb-placeholder').style.display='flex';this.style.display='none'">
            <div class="media-thumb-placeholder" style="display:none;"><i class="fas fa-image" style="font-size:28px;"></i></div>
            <div class="media-info">
                <div class="media-name" title="${img.name}">${img.name}</div>
                <div class="media-size">${img.size || '�?"'} �?� ${img.date || ''}</div>
            </div>
            <div class="media-actions">
                <button class="media-action-btn copy" onclick="copyUrl('${img.url}')" title="URL Kopyala"><i class="fas fa-copy"></i></button>
                <button class="media-action-btn edit" onclick="openImgEdit(${img.id})" title="Düzenle/De�Yi�Ytir"><i class="fas fa-edit"></i></button>
                <button class="media-action-btn del" onclick="deleteConfirm('image',${img.id},'Bu resmi silmek istedi�Yinizden emin misiniz?')" title="Sil"><i class="fas fa-trash"></i></button>
            </div>
            <div class="media-check"><i class="fas fa-check"></i></div>
        </div>`).join('');
            document.getElementById('bulkDeleteBtn').style.display = selectedImages.size ? 'flex' : 'none';
        }

        async function handleFileUpload(event) {
            const files = Array.from(event.target.files);
            if (!files.length) return;
            const progress = document.getElementById('uploadProgress');
            const fill = document.getElementById('progressFill');
            const ptext = document.getElementById('progressText');
            progress.style.display = 'block'; fill.style.width = '0%';
            let done = 0;
            let errors = 0;

            for (const file of files) {
                try {
                    if (!file.type.startsWith('image/')) throw new Error('invalid type');
                    const url = await uploadImageToServer(file);
                    const images = getData(KEYS.images) || [];
                    const newId = Math.max(0, ...images.map(x => x.id)) + 1;
                    images.push({ id: newId, name: file.name, url, size: formatSize(file.size), date: today() });
                    setData(KEYS.images, images);
                } catch (err) {
                    errors++;
                }

                done++;
                const pct = Math.round(done / files.length * 100);
                fill.style.width = pct + '%';
                ptext.textContent = `Yükleniyor... ${done}/${files.length}`;
            }

            setTimeout(() => { progress.style.display = 'none'; fill.style.width = '0%'; }, 800);
            renderMedia(); updateStats();
            if (errors === 0) {
                addActivity(`${files.length} resim yüklendi`, 'success');
                toast(`${done} resim yüklendi!`, 'success');
            } else {
                addActivity(`${files.length - errors} resim yüklendi, ${errors} hata`, 'warning');
                toast(`${files.length - errors} resim yüklendi, ${errors} dosya yüklenemedi.`, 'warning');
            }

            event.target.value = '';
        }

        function addImageFromUrl() {
            const url = document.getElementById('urlImageInput').value.trim();
            const name = document.getElementById('urlImageName').value.trim() || 'url-image-' + Date.now() + '.jpg';
            if (!url) { toast('URL zorunludur.', 'error'); return; }
            const images = getData(KEYS.images) || [];
            const newId = Math.max(0, ...images.map(i => i.id)) + 1;
            images.push({ id: newId, name, url, size: 'URL', date: today() });
            setData(KEYS.images, images);
            document.getElementById('urlImageInput').value = '';
            document.getElementById('urlImageName').value = '';
            document.getElementById('urlPreviewWrap').style.display = 'none';
            renderMedia(); updateStats();
            addActivity(`Resim URL'den eklendi`, 'success');
            toast('Resim kütüphaneye eklendi!', 'success');
        }

        document.getElementById('urlImageInput').addEventListener('input', function () {
            const wrap = document.getElementById('urlPreviewWrap');
            const img = document.getElementById('urlPreviewImg');
            if (this.value) { wrap.style.display = 'block'; img.src = this.value; }
            else { wrap.style.display = 'none'; }
        });

        function copyUrl(url) {
            navigator.clipboard.writeText(url).then(() => toast('URL kopyalandı!', 'success')).catch(() => {
                const ta = document.createElement('textarea'); ta.value = url; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); toast('URL kopyalandı!', 'success');
            });
        }

        function openImgEdit(id) {
            const images = getData(KEYS.images) || [];
            const img = images.find(i => i.id === id);
            if (!img) return;
            document.getElementById('editImgId').value = id;
            document.getElementById('editImgName').value = img.name;
            document.getElementById('editImgCurrent').src = img.url;
            document.getElementById('editImgUrl').value = '';
            document.getElementById('editImgNewPreview').style.display = 'none';
            document.getElementById('editImgFile').value = '';
            openModal('imgEditModal');
        }

        function previewEditImage(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                const prev = document.getElementById('editImgNewPreview');
                prev.src = e.target.result; prev.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }

        async function saveImageEdit() {
            const id = parseInt(document.getElementById('editImgId').value);
            const name = document.getElementById('editImgName').value.trim();
            const urlInput = document.getElementById('editImgUrl').value.trim();
            const fileInput = document.getElementById('editImgFile');
            const images = getData(KEYS.images) || [];
            const idx = images.findIndex(i => i.id === id);
            if (idx < 0) return;
            images[idx].name = name || images[idx].name;
            const finish = (url) => {
                if (url) images[idx].url = url;
                images[idx].date = today();
                setData(KEYS.images, images);
                closeModal('imgEditModal'); renderMedia();
                addActivity(`Resim "${images[idx].name}" güncellendi`, 'success');
                toast('Resim güncellendi!', 'success');
            };
            if (fileInput.files.length) {
                try {
                    const uploadedUrl = await uploadImageToServer(fileInput.files[0]);
                    finish(uploadedUrl);
                } catch (err) {
                    toast('Resim güncellenemedi.', 'error');
                }
            } else {
                finish(urlInput || null);
            }
        }

        function deleteImage(id) {
            const images = (getData(KEYS.images) || []).filter(i => i.id !== id);
            setData(KEYS.images, images); selectedImages.delete(id); renderMedia(); updateStats();
            addActivity('Resim silindi', 'info'); toast('Resim silindi', 'info');
        }

        function bulkDeleteImages() {
            if (!selectedImages.size) return;
            const images = (getData(KEYS.images) || []).filter(i => !selectedImages.has(i.id));
            setData(KEYS.images, images); selectedImages.clear(); renderMedia(); updateStats();
            toast('Seçili resimler silindi', 'info');
        }

        function formatSize(bytes) {
            if (!bytes) return '?';
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / 1048576).toFixed(1) + ' MB';
        }

        // Drag to upload
        const zone = document.getElementById('uploadZone');
        zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
        zone.addEventListener('drop', e => {
            e.preventDefault(); zone.classList.remove('dragover');
            const dt = e.dataTransfer;
            if (dt.files.length) handleFileUpload({ target: { files: dt.files }, });
        });

        // ===========================
        // SETTINGS
        // ===========================
        function loadSettings() {
            const s = getData(KEYS.settings) || {};
            ['siteTitle', 'siteDescription', 'metaKeywords', 'faviconUrl', 'contactEmail', 'contactPhone', 'contactAddress', 'googleAnalytics'].forEach(k => {
                const el = document.getElementById(k);
                if (el) el.value = s[k] || '';
            });
        }

        function saveSettings(e) {
            e.preventDefault();
            const s = {};
            ['siteTitle', 'siteDescription', 'metaKeywords', 'faviconUrl', 'contactEmail', 'contactPhone', 'contactAddress', 'googleAnalytics'].forEach(k => {
                const el = document.getElementById(k);
                if (el) s[k] = el.value;
            });
            setData(KEYS.settings, s);
            addActivity('Site ayarları güncellendi', 'success');
            toast('Ayarlar kaydedildi!', 'success');
        }

        // ===========================
        // DATA IMPORT/EXPORT
        // ===========================
        function exportData() {
            const data = {};
            Object.values(KEYS).forEach(k => {
                data[k] = localStorage.getItem(k);
            });
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ipek_yapi_backup_${today()}.json`;
            a.click();
            toast('Yedek dosyası indirildi.', 'success');
        }

        function importData(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                try {
                    const data = JSON.parse(e.target.result);
                    Object.keys(data).forEach(k => {
                        if (data[k]) localStorage.setItem(k, data[k]);
                    });
                    toast('Veriler ba�Yarıyla yüklendi! Sayfa yenileniyor...', 'success');
                    setTimeout(() => location.reload(), 1500);
                } catch (err) {
                    toast('Hatalı dosya formatı.', 'error');
                }
            };
            reader.readAsText(file);
        }

        // ===========================
        // STATS
        // ===========================
        function updateStats() {
            if (document.getElementById('page-dashboard').classList.contains('active')) renderDashboard();
        }

        // ===========================
        // CONFIRM DELETE
        // ===========================
        let _confirmCb = null;
        function deleteConfirm(type, id, text) {
            document.getElementById('confirmText').textContent = text;
            _confirmCb = () => {
                if (type === 'nav') deleteNav(id);
                else if (type === 'page') deletePage(id);
                else if (type === 'card') deleteCard(id);
                else if (type === 'project') deleteProject(id);
                else if (type === 'image') deleteImage(id);
                closeModal('confirmModal');
            };
            document.getElementById('confirmBtn').onclick = _confirmCb;
            openModal('confirmModal');
        }

        // ===========================
        // MODAL HELPERS
        // ===========================
        function openModal(id) { document.getElementById(id).classList.add('open'); }
        function closeModal(id) { document.getElementById(id).classList.remove('open'); }
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
        });

        // ===========================
        // TOAST
        // ===========================
        function toast(msg, type = 'info') {
            const tc = document.getElementById('toastContainer');
            const t = document.createElement('div');
            t.className = `toast ${type}`;
            const icons = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle' };
            t.innerHTML = `<i class="fas fa-${icons[type] || 'info-circle'} toast-icon"></i><span>${msg}</span>`;
            tc.appendChild(t);
            setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(100%)'; t.style.transition = 'all .3s'; setTimeout(() => t.remove(), 300); }, 3000);
        }

        // ===========================
        // AUTH
        // ===========================
        function logout() {
            if (confirm('�?ıkı�Y yapmak istedi�Yinizden emin misiniz?')) {
                localStorage.removeItem('adminLoggedIn');
                localStorage.removeItem('adminUsername');
                window.location.href = 'admin-login.html';
            }
        }

        // ===========================
        // INIT
        // ===========================
        window.addEventListener('load', async () => {
            // Auth check
            if (!localStorage.getItem('adminLoggedIn')) {
                window.location.href = 'admin-login.html'; return;
            }
            const uname = localStorage.getItem('adminUsername') || 'Admin';
            document.getElementById('sidebarName').textContent = uname;
            document.getElementById('sidebarAvatar').textContent = uname.charAt(0).toUpperCase();

            await loadCloudState();
            initData();
            renderDashboard();
            scheduleCloudSync();
        });
    
