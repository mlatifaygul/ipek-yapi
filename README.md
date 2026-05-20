# İPEK Website Clone

Modern bir Türk emlak geliştirme şirketi olan İPEK'in web sitesinin responsive bir klonu.

## Özellikler

- ✅ Modern ve şık tasarım
- ✅ Responsive mobil uyumlu arayüz
- ✅ Smooth scroll animasyonları
- ✅ Interaktif dropdown menüler
- ✅ Proje galerisi
- ✅ İletişim formu
- ✅ Haberler bölümü
- ✅ SEO dostu yapı
- ✅ Performans optimizasyonu

## Kullanılan Teknolojiler

- **HTML5** - Semantik yapı
- **CSS3** - Modern stiller ve animasyonlar
- **JavaScript** - Interaktif fonksiyonlar
- **Font Awesome** - İkonlar
- **Google Fonts** - Montserrat fontu

## Proje Yapısı

```
yapi-proje/
├── index.html          # Ana HTML dosyası
├── style.css           # Stiller
├── script.js           # JavaScript fonksiyonları
└── README.md           # Proje dokümantasyonu
```

## Bölümler

1. **Header** - Navigasyon menüsü ve logo
2. **Hero** - Ana banner ve tanıtım
3. **Öne Çıkan Projeler** - Proje kartları
4. **İPEK Arsa** - Arsa projeleri listesi
5. **CTA** - Eylem çağrısı bölümü
6. **Haberler** - Haberler ve duyurular
7. **İletişim** - İletişim formu
8. **Footer** - Alt bilgi ve linkler

## Kurulum ve Çalıştırma

1. Projeyi bilgisayarınıza klonlayın
2. Vercel projesine Neon bağlayın (Storage -> Marketplace -> Neon)
3. `DATABASE_URL` değişkeninin Production ortamında tanımlı olduğundan emin olun
2. Yerel bir sunucu başlatın:
   ```bash
   # Node.js ile
   npx serve -s . -p 8000
   
   # Python ile
   python -m http.server 8000
   
   # PHP ile
   php -S localhost:8000
   ```
3. Tarayıcıda `http://localhost:8000` adresini açın

## Admin Veri Kalıcılığı

- Admin panelde yapılan içerik değişiklikleri `/api/state` üzerinden Neon PostgreSQL tablosuna (`site_state`) yazılır.
- Tarayıcı çerezi veya localStorage temizlense bile frontend açılışta aynı endpoint'ten state'i tekrar çekip yükler.
- Redeploy sonrası verilerin sıfırlanmaması için admin panel açılışında otomatik “sunucuya yaz” kaldırıldı; Neon’daki kayıt önceliklidir ve daha yeni sunucu verisi varken eski localStorage ile üzerine yazılmaz.

## Özellik Detayları

### Responsive Tasarım
- Mobil, tablet ve masaüstü cihazlarda mükemmel görünüm
- Hamburger menü (mobil için)
- Esnek grid sistemleri

### Animasyonlar
- Scroll ile birlikte fade-in efektleri
- Hover animasyonları
- Parallax scrolling
- Smooth page transitions

### Form Validasyonu
- Real-time validasyon
- Türkçe telefon formatı kontrolü
- E-posta formatı kontrolü
- Başarı/hata mesajları

### Performans
- Lazy loading for images
- Debounced scroll events
- Optimized animations
- Minimal JavaScript

## Tarayıcı Desteği

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Lisans

Bu proje eğitim amaçlıdır. İPEK'in orijinal web sitesine ait değildir.

## Geliştirici

Modern web development best practices ile geliştirilmiştir.
