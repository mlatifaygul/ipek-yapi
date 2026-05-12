// Enhanced Admin Panel Data Management System
// This file handles all CRUD operations for the enhanced admin panel

// Initialize localStorage with default data if empty
function initializeEnhancedData() {
    if (!localStorage.getItem('ipek_navigation')) {
        const defaultNavigation = [
            {
                id: 1,
                name: 'Ana Sayfa',
                url: 'index.html',
                order: 1,
                active: true,
                subItems: [],
                icon: 'fas fa-home',
                target: '_self'
            },
            {
                id: 2,
                name: 'Biz Kimiz',
                url: 'biz-kimiz.html',
                order: 2,
                active: true,
                subItems: [
                    { id: 21, name: 'BİZ KİMİZ', url: 'biz-kimiz.html' },
                    { id: 22, name: 'Manifesto', url: 'biz-kimiz.html#manifesto' },
                    { id: 23, name: 'Tarihçe', url: 'biz-kimiz.html#tarihce' }
                ],
                icon: 'fas fa-users',
                target: '_self'
            },
            {
                id: 3,
                name: 'Projeler',
                url: 'projeler.html',
                order: 3,
                active: true,
                subItems: [
                    { id: 31, name: 'İpek Reserve', url: 'projeler.html' },
                    { id: 32, name: 'İpek Projeler', url: 'projeler.html' },
                    { id: 33, name: 'İpek Arsa', url: 'projeler.html' },
                    { id: 34, name: 'İpek Global', url: 'projeler.html' },
                    { id: 35, name: 'NOVU', url: 'projeler.html' },
                    { id: 36, name: 'Tümünü Gör', url: 'projeler.html' }
                ],
                icon: 'fas fa-building',
                target: '_self'
            },
            {
                id: 4,
                name: 'İpek Keşifleri',
                url: 'ipek-kesifleri.html',
                order: 4,
                active: true,
                subItems: [],
                icon: 'fas fa-compass',
                target: '_self'
            },
            {
                id: 5,
                name: 'İletişim',
                url: 'iletisim.html',
                order: 5,
                active: true,
                subItems: [],
                icon: 'fas fa-envelope',
                target: '_self'
            }
        ];
        localStorage.setItem('ipek_navigation', JSON.stringify(defaultNavigation));
    }

    if (!localStorage.getItem('ipek_pages')) {
        const defaultPages = [
            {
                title: 'Ana Sayfa',
                file: 'index.html',
                description: 'İPEK - İnce Düşünülmüş Yaşam Alanları',
                keywords: 'ipek, inşaat, konut, arsa, proje',
                template: 'default',
                active: true,
                updated: '2024-05-10'
            },
            {
                title: 'Biz Kimiz',
                file: 'biz-kimiz.html',
                description: 'İPEK Hakkımızda Sayfası',
                keywords: 'ipek, hakkımızda, şirket, tarihçe',
                template: 'default',
                active: true,
                updated: '2024-05-10'
            },
            {
                title: 'Biz Kimiz (Gelişmiş)',
                file: 'biz-kimiz-new.html',
                description: 'İPEK Hakkımızda - Resimli ve Zengin İçerik',
                keywords: 'ipek, hakkımızda, şirket, ekip, vizyon',
                template: 'default',
                active: true,
                updated: '2024-05-10'
            },
            {
                title: 'Projeler',
                file: 'projeler.html',
                description: 'İPEK Projeleri Sayfası',
                keywords: 'ipek, projeler, konut, ticari',
                template: 'default',
                active: true,
                updated: '2024-05-10'
            },
            {
                title: 'İpek Keşifleri',
                file: 'ipek-kesifleri.html',
                description: 'İPEK Keşifleri Sayfası',
                keywords: 'ipek, keşifler, inovasyon, foldhome',
                template: 'default',
                active: true,
                updated: '2024-05-10'
            },
            {
                title: 'İpek Keşifleri (Gelişmiş)',
                file: 'ipek-kesifleri-new.html',
                description: 'İPEK Keşifleri - Foldhome ve İnovasyon',
                keywords: 'ipek, keşifler, foldhome, inovasyon',
                template: 'default',
                active: true,
                updated: '2024-05-10'
            },
            {
                title: 'İletişim',
                file: 'iletisim.html',
                description: 'İPEK İletişim Sayfası',
                keywords: 'ipek, iletişim, adres, telefon',
                template: 'default',
                active: true,
                updated: '2024-05-10'
            },
            {
                title: 'İletişim (Gelişmiş)',
                file: 'iletisim-new.html',
                description: 'İPEK İletişim - Google Harita ve Detaylı Bilgiler',
                keywords: 'ipek, iletişim, harita, adres, telefon',
                template: 'default',
                active: true,
                updated: '2024-05-10'
            }
        ];
        localStorage.setItem('ipek_pages', JSON.stringify(defaultPages));
    }

    if (!localStorage.getItem('ipek_sections')) {
        const defaultSections = [
            // Ana Sayfa Bölümleri
            {
                id: 1,
                name: 'Ana Sayfa Hero',
                page: 'index.html',
                type: 'hero',
                order: 1,
                title: '2010 yılından beri metrekarelerle değil santimetrekarelerle çalışarak',
                subtitle: 'ince düşünülmüş yaşam alanları tasarlıyoruz.',
                content: 'Hero bölümü içeriği',
                bgImage: 'https://via.placeholder.com/1920x800/2c3e50/ffffff?text=İPEK+Hero',
                bgColor: '#ffffff'
            },
            {
                id: 2,
                name: 'Öne Çıkan Projeler',
                page: 'index.html',
                type: 'card',
                order: 2,
                title: 'Öne Çıkan Projeler',
                subtitle: 'En iyi projelerimiz',
                content: 'Öne çıkan projeler grid içeriği',
                bgImage: '',
                bgColor: '#f8f9fa'
            },
            {
                id: 3,
                name: 'İpek Arsa',
                page: 'index.html',
                type: 'feature',
                order: 3,
                title: 'Birikiminizle Birlikte Hayallerinizi Büyütün.',
                subtitle: 'Hayalinizdeki İpek Arsa\'ya Şimdi Sahip Olun',
                content: 'İpek Arsa bölümü içeriği',
                bgImage: '',
                bgColor: '#ffffff'
            },
            // Biz Kimiz Bölümleri
            {
                id: 4,
                name: 'Biz Kimiz Hero',
                page: 'biz-kimiz-new.html',
                type: 'hero',
                order: 1,
                title: '2010 Yılından Beri İnce Düşünülmüş Yaşam Alanları',
                subtitle: 'Metrekarelerle değil, santimetrekarelerle çalışarak hayata geçirdiğimiz projelerimizle Türkiye\'nin lider inşaat şirketlerinden biri olmayı sürdürüyoruz.',
                content: 'Hero istatistikleri ve içerik',
                bgImage: 'https://via.placeholder.com/1920x600/2c3e50/ffffff?text=İPEK+Hakkımızda',
                bgColor: '#ffffff'
            },
            {
                id: 5,
                name: 'Hikayemiz',
                page: 'biz-kimiz-new.html',
                type: 'text',
                order: 2,
                title: 'Hikayemiz',
                subtitle: '2010 yılında, inşaat sektörüne farklı bir bakış açısı getirmek için yola çıktık.',
                content: 'Sadece binalar değil, aynı zamanda yaşam kalitesini artıran, estetik ve fonksiyonelliği bir araya getiren mekanlar yaratma tutkusuyla İPEK\'i kurduk. İlk projemizden bu yana, her bir santimetreyi önemseyen bir anlayışla çalışıyoruz. Bize göre mükemmellik, detaylarda gizlidir. Bu nedenle projelerimizde her zaman en kaliteli malzemeleri, en son teknolojiyi ve en iyi mimari çözümleri kullanıyoruz.',
                bgImage: '',
                bgColor: '#ffffff'
            },
            {
                id: 6,
                name: 'Değerlerimiz',
                page: 'biz-kimiz-new.html',
                type: 'card',
                order: 3,
                title: 'Değerlerimiz',
                subtitle: 'Temel değerlerimiz',
                content: '6 değer kartı içeriği',
                bgImage: '',
                bgColor: '#f8f9fa'
            },
            {
                id: 7,
                name: 'Zaman Çizelgesi',
                page: 'biz-kimiz-new.html',
                type: 'custom',
                order: 4,
                title: 'Zaman Çizelgemiz',
                subtitle: 'Yolculuğumuz',
                content: 'Timeline bileşenleri',
                bgImage: '',
                bgColor: '#ffffff'
            },
            {
                id: 8,
                name: 'Lider Ekibimiz',
                page: 'biz-kimiz-new.html',
                type: 'card',
                order: 5,
                title: 'Lider Ekibimiz',
                subtitle: 'Yönetim kadromuz',
                content: '4 kişilik ekip kartları',
                bgImage: '',
                bgColor: '#f8f9fa'
            },
            {
                id: 9,
                name: 'Ödüllerimiz',
                page: 'biz-kimiz-new.html',
                type: 'card',
                order: 6,
                title: 'Ödüllerimiz',
                subtitle: 'Başarılarımız',
                content: 'Ödül kartları',
                bgImage: '',
                bgColor: '#ffffff'
            },
            // İpek Keşifleri Bölümleri
            {
                id: 10,
                name: 'İpek Keşifleri Hero',
                page: 'ipek-kesifleri-new.html',
                type: 'hero',
                order: 1,
                title: 'Foldhome İle Kişiye Özel Kullanım Alanlarını Keşfedin',
                subtitle: 'Bir İpek keşfi olan Foldhome ile evinizde olmasını hayal ettiğiniz ama bir eve sığamayacak alanlar dilediğiniz zaman evinize ekleniyor.',
                content: 'Hero içeriği',
                bgImage: 'https://via.placeholder.com/1920x800/2c3e50/ffffff?text=Foldhome+İnovasyonu',
                bgColor: '#ffffff'
            },
            {
                id: 11,
                name: 'Öne Çıkan Foldhome',
                page: 'ipek-kesifleri-new.html',
                type: 'feature',
                order: 2,
                title: 'Evine Ekstra Alanlar Kat',
                subtitle: 'Foldhome özellikleri',
                content: 'Foldhome detaylı açıklama',
                bgImage: '',
                bgColor: '#ffffff'
            },
            {
                id: 12,
                name: 'Tasarım ve İnovasyon',
                page: 'ipek-kesifleri-new.html',
                type: 'card',
                order: 3,
                title: 'Tasarım ve İnovasyon',
                subtitle: 'İnovasyon konseptleri',
                content: '4 inovasyon kartı',
                bgImage: '',
                bgColor: '#f8f9fa'
            },
            {
                id: 13,
                name: 'Keşif Kategorileri',
                page: 'ipek-kesifleri-new.html',
                type: 'card',
                order: 4,
                title: 'Keşif Kategorileri',
                subtitle: 'Ana kategoriler',
                content: '4 kategori kartı',
                bgImage: '',
                bgColor: '#ffffff'
            },
            {
                id: 14,
                name: 'Tüm Keşifler',
                page: 'ipek-kesifleri-new.html',
                type: 'card',
                order: 5,
                title: 'Tüm Keşifler',
                subtitle: 'Keşif kartları',
                content: '6 keşif kartı',
                bgImage: '',
                bgColor: '#f8f9fa'
            },
            // İletişim Bölümleri
            {
                id: 15,
                name: 'İletişim Hero',
                page: 'iletisim-new.html',
                type: 'hero',
                order: 1,
                title: 'İletişim',
                subtitle: 'Projelerimiz hakkında daha fazla bilgi almak, sorularınızı sormak veya bizimle iletişime geçmek için aşağıdaki kanalları kullanabilirsiniz.',
                content: 'Hero içeriği',
                bgImage: 'https://via.placeholder.com/1920x600/2c3e50/ffffff?text=İletişim+İPEK',
                bgColor: '#ffffff'
            },
            {
                id: 16,
                name: 'İletişim Bilgileri',
                page: 'iletisim-new.html',
                type: 'contact',
                order: 2,
                title: 'Bize Ulaşın',
                subtitle: 'İletişim formu ve bilgiler',
                content: 'İletişim formu ve bilgi kartları',
                bgImage: '',
                bgColor: '#f8f9fa'
            },
            {
                id: 17,
                name: 'Harita',
                page: 'iletisim-new.html',
                type: 'custom',
                order: 3,
                title: 'Konumumuz',
                subtitle: 'Google Harita',
                content: 'Google Maps iframe',
                bgImage: '',
                bgColor: '#ffffff'
            },
            {
                id: 18,
                name: 'Satış Ofisleri',
                page: 'iletisim-new.html',
                type: 'card',
                order: 4,
                title: 'Satış Ofislerimiz',
                subtitle: 'Türkiye geneli ofisler',
                content: '4 ofis kartı',
                bgImage: '',
                bgColor: '#f8f9fa'
            },
            {
                id: 19,
                name: 'SSS',
                page: 'iletisim-new.html',
                type: 'custom',
                order: 5,
                title: 'Sıkça Sorulan Sorular',
                subtitle: 'FAQ bölümü',
                content: '5 soru-cevap',
                bgImage: '',
                bgColor: '#ffffff'
            }
        ];
        localStorage.setItem('ipek_sections', JSON.stringify(defaultSections));
    }

    if (!localStorage.getItem('ipek_projects')) {
        const defaultProjects = [
            {
                id: 1,
                name: 'İpek Sapanca',
                category: 'konut',
                location: 'Sapanca, Kocaeli',
                status: 'Yaşam Başladı',
                description: 'Sapanca\'ya Şimdi İpek\'den Bakın',
                features: 'Doğa Manzarası, Göl Yakınlığı, Modern Tasarım',
                image: 'https://via.placeholder.com/400x250/34495e/ffffff?text=İpek+Sapanca',
                gallery: 'https://via.placeholder.com/400x250/34495e/ffffff?text=Gallery1,https://via.placeholder.com/400x250/34495e/ffffff?text=Gallery2',
                price: '₺2.500.000 - ₺5.000.000',
                delivery: '2024-06-01'
            },
            {
                id: 2,
                name: 'İpek Meram',
                category: 'konut',
                location: 'Meram, Konya',
                status: 'İnşaat Devam Ediyor',
                description: 'Trakya\'nın yıldızı parlıyor',
                features: 'Merkezi Konum, Modern Altyapı, Yeşil Alanlar',
                image: 'https://via.placeholder.com/400x250/34495e/ffffff?text=İpek+Meram',
                gallery: 'https://via.placeholder.com/400x250/34495e/ffffff?text=Gallery1,https://via.placeholder.com/400x250/34495e/ffffff?text=Gallery2',
                price: '₺1.800.000 - ₺3.200.000',
                delivery: '2025-03-01'
            },
            {
                id: 3,
                name: 'İpek Reserve',
                category: 'konut',
                location: 'Bodrum, Muğla',
                status: 'Yaşam Başladı',
                description: 'Premium yaşam alanları',
                features: 'Deniz Manzarası, Lüks Tasarım, Özel Hizmetler',
                image: 'https://via.placeholder.com/400x250/34495e/ffffff?text=İpek+Reserve',
                gallery: 'https://via.placeholder.com/400x250/34495e/ffffff?text=Gallery1,https://via.placeholder.com/400x250/34495e/ffffff?text=Gallery2',
                price: '₺8.000.000 - ₺15.000.000',
                delivery: '2023-12-01'
            },
            {
                id: 4,
                name: 'İpek Arsa Kaz Dağları',
                category: 'arsa',
                location: 'Kaz Dağları, Çanakkale',
                status: 'Satışta',
                description: 'Kaz Dağları\'nın Havası Yaşamınızın Bir Parçası Olsun',
                features: 'Doğa İç İçe, Yatırımlık, Modüler Ev İmkanı',
                image: 'https://via.placeholder.com/400x250/34495e/ffffff?text=İpek+Arsa+Kaz+Dağları',
                gallery: 'https://via.placeholder.com/400x250/34495e/ffffff?text=Gallery1,https://via.placeholder.com/400x250/34495e/ffffff?text=Gallery2',
                price: '₺500.000 - ₺1.500.000',
                delivery: '2024-08-01'
            },
            {
                id: 5,
                name: 'İpek Arsa Dikili',
                category: 'arsa',
                location: 'Dikili, İzmir',
                status: 'Satışta',
                description: 'Ege\'nin incisinde mükemmel bir yatırım',
                features: 'Deniz Yakınlığı, Turistik Bölge, Yatırımlık',
                image: 'https://via.placeholder.com/400x250/34495e/ffffff?text=İpek+Arsa+Dikili',
                gallery: 'https://via.placeholder.com/400x250/34495e/ffffff?text=Gallery1,https://via.placeholder.com/400x250/34495e/ffffff?text=Gallery2',
                price: '₺600.000 - ₺2.000.000',
                delivery: '2024-10-01'
            },
            {
                id: 6,
                name: 'İpek Arsa Lüleburgaz',
                category: 'arsa',
                location: 'Lüleburgaz, Kırklareli',
                status: 'Satışta',
                description: 'Trakya\'nın yıldızı parlıyor',
                features: 'Stratejik Konum, Gelişim Bölgesi, Yatırımlık',
                image: 'https://via.placeholder.com/400x250/34495e/ffffff?text=İpek+Arsa+Lüleburgaz',
                gallery: 'https://via.placeholder.com/400x250/34495e/ffffff?text=Gallery1,https://via.placeholder.com/400x250/34495e/ffffff?text=Gallery2',
                price: '₺400.000 - ₺1.200.000',
                delivery: '2024-09-01'
            }
        ];
        localStorage.setItem('ipek_projects', JSON.stringify(defaultProjects));
    }

    if (!localStorage.getItem('ipek_images')) {
        const defaultImages = [
            {
                id: 1,
                name: 'hero-image.jpg',
                url: 'https://via.placeholder.com/800x400/34495e/ffffff?text=Hero+Image',
                size: '125 KB'
            },
            {
                id: 2,
                name: 'logo.png',
                url: 'https://via.placeholder.com/200x100/2c3e50/ffffff?text=İPEK+Logo',
                size: '45 KB'
            },
            {
                id: 3,
                name: 'project-1.jpg',
                url: 'https://via.placeholder.com/400x250/34495e/ffffff?text=Project+1',
                size: '89 KB'
            },
            {
                id: 4,
                name: 'about-image.jpg',
                url: 'https://via.placeholder.com/600x400/34495e/ffffff?text=About+Image',
                size: '156 KB'
            },
            {
                id: 5,
                name: 'contact-map.jpg',
                url: 'https://via.placeholder.com/800x600/34495e/ffffff?text=Contact+Map',
                size: '234 KB'
            }
        ];
        localStorage.setItem('ipek_images', JSON.stringify(defaultImages));
    }

    if (!localStorage.getItem('ipek_settings')) {
        const defaultSettings = {
            siteTitle: 'İPEK - İnce Düşünülmüş Yaşam Alanları',
            siteDescription: '2010 yılından beri metrekarelerle değil santimetrekarelerle çalışarak, ince düşünülmüş yaşam alanları tasarlıyoruz.',
            contactEmail: 'info@ipek.com.tr',
            contactPhone: '+90 212 555 00 00',
            contactAddress: 'Maslak, Büyükdere Cad. No:123, Sarıyer/İstanbul',
            googleAnalytics: 'UA-XXXXXXX-X',
            metaKeywords: 'ipek, inşaat, konut, arsa, proje, yaşam alanları, metrekare, santimetrekare',
            faviconUrl: 'https://via.placeholder.com/32x32/2c3e50/ffffff?text=N'
        };
        localStorage.setItem('ipek_settings', JSON.stringify(defaultSettings));
    }

    if (!localStorage.getItem('ipek_activities')) {
        const defaultActivities = [
            {
                id: 1,
                action: 'Admin panel oluşturuldu',
                timestamp: new Date().toISOString(),
                user: 'admin',
                type: 'system'
            }
        ];
        localStorage.setItem('ipek_activities', JSON.stringify(defaultActivities));
    }

    if (!localStorage.getItem('ipek_cards')) {
        const defaultCards = [
            {
                id: 1,
                title: 'İpek Reserve',
                description: 'Premium yaşam alanları',
                image: 'https://via.placeholder.com/400x300/34495e/ffffff?text=İpek+Reserve',
                status: 'Yaşam Başladı',
                features: 'Deniz Manzarası, Lüks Tasarım, Özel Hizmetler',
                price: '₺8.000.000 - ₺15.000.000',
                link: '#',
                buttonText: 'Keşfet',
                page: 'index.html',
                order: 1
            },
            {
                id: 2,
                title: 'İpek Sapanca',
                description: 'Sapanca\'ya Şimdi İpek\'den Bakın',
                image: 'https://via.placeholder.com/400x300/34495e/ffffff?text=İpek+Sapanca',
                status: 'Yaşam Başladı',
                features: 'Doğa Manzarası, Göl Yakınlığı, Modern Tasarım',
                price: '₺2.500.000 - ₺5.000.000',
                link: '#',
                buttonText: 'Keşfet',
                page: 'index.html',
                order: 2
            },
            {
                id: 3,
                title: 'İpek Arsa',
                description: 'Birikiminizle Birlikte Hayallerinizi Büyütün',
                image: 'https://via.placeholder.com/400x300/34495e/ffffff?text=İpek+Arsa',
                status: 'Satışta',
                features: 'Yatırımlık, Modüler Ev İmkanı, Doğa İç İçe',
                price: '₺500.000 - ₺1.500.000',
                link: '#',
                buttonText: 'Keşfet',
                page: 'index.html',
                order: 3
            }
        ];
        localStorage.setItem('ipek_cards', JSON.stringify(defaultCards));
    }
}

// Navigation CRUD Operations
function getNavigationItems() {
    initializeEnhancedData();
    return JSON.parse(localStorage.getItem('ipek_navigation') || '[]');
}

function getNavigationItemById(id) {
    const items = getNavigationItems();
    return items.find(item => item.id === id);
}

function saveNavigationItem(item) {
    const items = getNavigationItems();
    const existingIndex = items.findIndex(i => i.id === item.id);

    if (existingIndex !== -1) {
        items[existingIndex] = { ...items[existingIndex], ...item };
    } else {
        const newId = Math.max(...items.map(i => i.id), 0) + 1;
        items.push({ id: newId, ...item });
    }

    localStorage.setItem('ipek_navigation', JSON.stringify(items));
    addActivity(`Navigasyon öğesi "${item.name}" ${item.id ? 'güncellendi' : 'eklendi'}`, 'navigation');
    return true;
}

function deleteNavigationItem(id) {
    const items = getNavigationItems();
    const item = items.find(i => i.id === id);
    const filteredItems = items.filter(item => item.id !== id);
    localStorage.setItem('ipek_navigation', JSON.stringify(filteredItems));
    addActivity(`Navigasyon öğesi "${item.name}" silindi`, 'navigation');
    return true;
}

// Sections CRUD Operations
function getSections() {
    initializeEnhancedData();
    return JSON.parse(localStorage.getItem('ipek_sections') || '[]');
}

function getSectionById(id) {
    const sections = getSections();
    return sections.find(section => section.id === id);
}

function saveSection(section) {
    const sections = getSections();
    const existingIndex = sections.findIndex(s => s.id === section.id);

    if (existingIndex !== -1) {
        sections[existingIndex] = { ...sections[existingIndex], ...section };
    } else {
        const newId = Math.max(...sections.map(s => s.id), 0) + 1;
        sections.push({ id: newId, ...section });
    }

    localStorage.setItem('ipek_sections', JSON.stringify(sections));
    addActivity(`Bölüm "${section.name}" ${section.id ? 'güncellendi' : 'eklendi'}`, 'section');
    return true;
}

function deleteSection(id) {
    const sections = getSections();
    const section = sections.find(s => s.id === id);
    const filteredSections = sections.filter(section => section.id !== id);
    localStorage.setItem('ipek_sections', JSON.stringify(filteredSections));
    addActivity(`Bölüm "${section.name}" silindi`, 'section');
    return true;
}

// Pages CRUD Operations
function getPages() {
    initializeEnhancedData();
    return JSON.parse(localStorage.getItem('ipek_pages') || '[]');
}

function getPageByFile(file) {
    const pages = getPages();
    return pages.find(page => page.file === file);
}

function savePage(page) {
    const pages = getPages();
    const existingIndex = pages.findIndex(p => p.file === page.file);

    if (existingIndex !== -1) {
        pages[existingIndex] = {
            ...pages[existingIndex],
            ...page,
            updated: new Date().toISOString().split('T')[0]
        };
    } else {
        pages.push({
            ...page,
            active: true,
            updated: new Date().toISOString().split('T')[0]
        });
    }

    localStorage.setItem('ipek_pages', JSON.stringify(pages));
    addActivity(`Sayfa "${page.title}" ${page.file ? 'güncellendi' : 'eklendi'}`, 'page');
    return true;
}

function deletePageItem(file) {
    const pages = getPages();
    const page = pages.find(p => p.file === file);
    const filteredPages = pages.filter(page => page.file !== file);
    localStorage.setItem('ipek_pages', JSON.stringify(filteredPages));
    addActivity(`Sayfa "${page.title}" silindi`, 'page');
    return true;
}

// Projects CRUD Operations
function getProjects() {
    initializeEnhancedData();
    return JSON.parse(localStorage.getItem('ipek_projects') || '[]');
}

function getProjectById(id) {
    const projects = getProjects();
    return projects.find(project => project.id === id);
}

function saveProject(project) {
    const projects = getProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);

    if (existingIndex !== -1) {
        projects[existingIndex] = { ...projects[existingIndex], ...project };
    } else {
        const newId = Math.max(...projects.map(p => p.id), 0) + 1;
        projects.push({ id: newId, ...project });
    }

    localStorage.setItem('ipek_projects', JSON.stringify(projects));
    addActivity(`Proje "${project.name}" ${project.id ? 'güncellendi' : 'eklendi'}`, 'project');
    return true;
}

function deleteProjectItem(id) {
    const projects = getProjects();
    const project = projects.find(p => p.id === id);
    const filteredProjects = projects.filter(project => project.id !== id);
    localStorage.setItem('ipek_projects', JSON.stringify(filteredProjects));
    addActivity(`Proje "${project.name}" silindi`, 'project');
    return true;
}

// Images CRUD Operations
function getImages() {
    initializeEnhancedData();
    return JSON.parse(localStorage.getItem('ipek_images') || '[]');
}

function saveImage(image) {
    const images = getImages();
    const newId = Math.max(...images.map(i => i.id), 0) + 1;
    images.push({ id: newId, ...image });
    localStorage.setItem('ipek_images', JSON.stringify(images));
    addActivity(`Resim "${image.name}" yüklendi`, 'image');
    return true;
}

function deleteImageItem(id) {
    const images = getImages();
    const image = images.find(i => i.id === id);
    const filteredImages = images.filter(image => image.id !== id);
    localStorage.setItem('ipek_images', JSON.stringify(filteredImages));
    addActivity(`Resim "${image.name}" silindi`, 'image');
    return true;
}

function updateImage(imageData) {
    const images = getImages();
    const index = images.findIndex(i => i.id === imageData.id);

    if (index !== -1) {
        images[index] = { ...images[index], ...imageData };
        localStorage.setItem('ipek_images', JSON.stringify(images));
        addActivity(`Resim "${imageData.name}" güncellendi`, 'image');
        return true;
    }

    return false;
}

function getImageById(id) {
    const images = getImages();
    return images.find(image => image.id === id);
}

// Settings CRUD Operations
function getSettings() {
    initializeEnhancedData();
    return JSON.parse(localStorage.getItem('ipek_settings') || '{}');
}

function saveSettings(settings) {
    localStorage.setItem('ipek_settings', JSON.stringify(settings));
    addActivity('Site ayarları güncellendi', 'settings');
    return true;
}

// Activities CRUD Operations
function getActivities() {
    initializeEnhancedData();
    return JSON.parse(localStorage.getItem('ipek_activities') || '[]');
}

function addActivity(action, type) {
    const activities = getActivities();
    const newActivity = {
        id: Math.max(...activities.map(a => a.id), 0) + 1,
        action,
        timestamp: new Date().toISOString(),
        user: localStorage.getItem('adminUsername') || 'admin',
        type
    };
    activities.unshift(newActivity);

    // Keep only last 50 activities
    if (activities.length > 50) {
        activities.splice(50);
    }

    localStorage.setItem('ipek_activities', JSON.stringify(activities));
}

// Dashboard Stats
function getDashboardStats() {
    const pages = getPages();
    const projects = getProjects();
    const images = getImages();
    const sections = getSections();

    return {
        pages: pages.length,
        projects: projects.length,
        images: images.length,
        sections: sections.length
    };
}

// Dynamic Content Generation Functions
function generateNavigationHTML() {
    const navigation = getNavigationItems();
    let html = '';

    navigation.forEach(item => {
        if (item.subItems && item.subItems.length > 0) {
            html += `
                <li class="nav-item dropdown">
                    <a href="${item.url}" class="nav-link">${item.name} <i class="fas fa-chevron-down"></i></a>
                    <div class="dropdown-content">
                        ${item.subItems.map(sub => `<a href="${sub.url}">${sub.name}</a>`).join('')}
                    </div>
                </li>
            `;
        } else {
            html += `
                <li class="nav-item">
                    <a href="${item.url}" class="nav-link">${item.name}</a>
                </li>
            `;
        }
    });

    return html;
}

function generateProjectsHTML() {
    const projects = getProjects();
    let html = '';

    projects.forEach(project => {
        const statusClass = project.status === 'Yaşam Başladı' ? 'yasam-basladi' :
            project.status === 'Satışta' ? 'satista' : 'insaat';

        html += `
            <div class="project-card" data-category="${project.category}" data-location="${project.location}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.name}">
                    <span class="project-status ${statusClass}">${project.status}</span>
                </div>
                <div class="project-info">
                    <h3 class="project-name">${project.name}</h3>
                    <div class="project-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${project.location}</span>
                    </div>
                    <div class="project-features">
                        <span class="feature-tag">${project.category}</span>
                        ${project.features ? project.features.split(',').map(f => `<span class="feature-tag">${f.trim()}</span>`).join('') : ''}
                    </div>
                    ${project.price ? `<div class="project-price">${project.price}</div>` : ''}
                    <div class="project-action">
                        <a href="#" class="discover-btn">Keşfet <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        `;
    });

    return html;
}

function generateSectionsHTML(page) {
    const sections = getSections().filter(s => s.page === page).sort((a, b) => a.order - b.order);
    let html = '';

    sections.forEach(section => {
        switch (section.type) {
            case 'hero':
                html += generateHeroSection(section);
                break;
            case 'text':
                html += generateTextSection(section);
                break;
            case 'card':
                html += generateCardSection(section);
                break;
            case 'feature':
                html += generateFeatureSection(section);
                break;
            case 'contact':
                html += generateContactSection(section);
                break;
            case 'cta':
                html += generateCTASection(section);
                break;
            case 'custom':
                html += section.content || '';
                break;
        }
    });

    return html;
}

function generateHeroSection(section) {
    const bgStyle = section.bgImage ?
        `background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%), url('${section.bgImage}') center/cover;` :
        `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`;

    return `
        <section class="hero-section" style="${bgStyle}">
            <div class="container">
                <div class="hero-content">
                    <h1>${section.title}</h1>
                    <p>${section.subtitle}</p>
                    ${section.content ? `<div class="hero-content-extra">${section.content}</div>` : ''}
                </div>
            </div>
        </section>
    `;
}

function generateTextSection(section) {
    return `
        <section class="text-section" style="background: ${section.bgColor};">
            <div class="container">
                <h2>${section.title}</h2>
                <p>${section.subtitle}</p>
                <div class="text-content">
                    ${section.content}
                </div>
            </div>
        </section>
    `;
}

function generateCardSection(section) {
    return `
        <section class="card-section" style="background: ${section.bgColor};">
            <div class="container">
                <h2>${section.title}</h2>
                <p>${section.subtitle}</p>
                <div class="cards-grid">
                    ${section.content || 'Card content buraya gelecek'}
                </div>
            </div>
        </section>
    `;
}

function generateFeatureSection(section) {
    return `
        <section class="feature-section" style="background: ${section.bgColor};">
            <div class="container">
                <h2>${section.title}</h2>
                <p>${section.subtitle}</p>
                <div class="feature-content">
                    ${section.content}
                </div>
            </div>
        </section>
    `;
}

function generateContactSection(section) {
    return `
        <section class="contact-section" style="background: ${section.bgColor};">
            <div class="container">
                <h2>${section.title}</h2>
                <p>${section.subtitle}</p>
                <div class="contact-content">
                    ${section.content}
                </div>
            </div>
        </section>
    `;
}

function generateCTASection(section) {
    return `
        <section class="cta-section" style="background: ${section.bgColor};">
            <div class="container">
                <h2>${section.title}</h2>
                <p>${section.subtitle}</p>
                <div class="cta-content">
                    ${section.content}
                </div>
            </div>
        </section>
    `;
}

// Card Content Management
function getCardContents() {
    initializeEnhancedData();
    return JSON.parse(localStorage.getItem('ipek_cards') || '[]');
}

function getCardById(id) {
    const cards = getCardContents();
    return cards.find(card => card.id === id);
}

function saveCard(card) {
    const cards = getCardContents();
    const existingIndex = cards.findIndex(c => c.id === card.id);

    if (existingIndex !== -1) {
        cards[existingIndex] = { ...cards[existingIndex], ...card };
    } else {
        const newId = Math.max(...cards.map(c => c.id), 0) + 1;
        cards.push({ id: newId, ...card });
    }

    localStorage.setItem('ipek_cards', JSON.stringify(cards));
    addActivity(`Kart "${card.title}" ${card.id ? 'güncellendi' : 'eklendi'}`, 'card');
    return true;
}

function deleteCard(id) {
    const cards = getCardContents();
    const card = cards.find(c => c.id === id);
    const filteredCards = cards.filter(card => card.id !== id);
    localStorage.setItem('ipek_cards', JSON.stringify(filteredCards));
    addActivity(`Kart "${card.title}" silindi`, 'card');
    return true;
}

function generateCardsHTML(page = 'index.html') {
    const cards = getCardContents().filter(card => card.page === page).sort((a, b) => a.order - b.order);
    let html = '';

    cards.forEach(card => {
        html += `
            <div class="project-card" data-id="${card.id}">
                <div class="project-image">
                    <img src="${card.image}" alt="${card.title}">
                    ${card.status ? `<span class="project-status">${card.status}</span>` : ''}
                </div>
                <div class="project-content">
                    <h3>${card.title}</h3>
                    <p>${card.description}</p>
                    ${card.features ? `
                        <div class="project-features">
                            ${card.features.split(',').map(f => `<span class="feature-tag">${f.trim()}</span>`).join('')}
                        </div>
                    ` : ''}
                    ${card.price ? `<div class="project-price">${card.price}</div>` : ''}
                    <div class="project-action">
                        <a href="${card.link || '#'}" class="discover-btn">${card.buttonText || 'Keşfet'} <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        `;
    });

    return html;
}

// Export functions for use in main pages
window.İPEKAdminEnhanced = {
    getNavigationItems,
    getNavigationItemById,
    saveNavigationItem,
    deleteNavigationItem,
    getSections,
    getSectionById,
    saveSection,
    deleteSection,
    getPages,
    getPageByFile,
    savePage,
    deletePageItem,
    getProjects,
    getProjectById,
    saveProject,
    deleteProjectItem,
    getImages,
    saveImage,
    deleteImageItem,
    updateImage,
    getImageById,
    getSettings,
    saveSettings,
    getActivities,
    addActivity,
    getDashboardStats,
    generateNavigationHTML,
    generateProjectsHTML,
    generateSectionsHTML,
    getCardContents,
    getCardById,
    saveCard,
    deleteCard,
    generateCardsHTML
};

// Auto-initialize when script loads
initializeEnhancedData();
