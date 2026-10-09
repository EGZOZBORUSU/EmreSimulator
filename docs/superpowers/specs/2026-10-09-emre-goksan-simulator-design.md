# Emre Göksan Simülatörü - Sistem Tasarım Dokümanı (Spec)

**Tarih:** 2026-10-09  
**Durum:** Onaylandı / Uygulama Aşaması  
**Proje:** Emre Göksan Simülatörü (Boş Yapma Butonu / Can Dündar Belgeseli Generator & Sahte Filozof Post Motoru)  
**Hedef Kitle:** Yarışma jürisi, arkadaş grubu, absürt internet mizahı sevenler

---

## 1. Genel Bakış ve Konsept

Emre Göksan Simülatörü; arkadaş grubundaki kişilerin (başta Eren Efe Özkan olmak üzere) fotoğraflarını alıp, onların üzerine Can Dündar melankolisinde sahte-felsefi, edebi, absürt ve hafif erotik/müstehcen alt metinli aforizmalar basan ve bunu tam ekran sinematik festival belgeseli estetiğiyle (ağır çekim b-roll videolar, ney/çello tınıları, Can Dündar tonlamasında Türkçe seslendirme) sunan tek sayfalık bir web deneyimidir.

---

## 2. Arayüz ve Sahne Mimarisi (UI/UX)

Uygulama katmanlı bir sinematik sahne (Cinematic Stage) olarak tasarlanmıştır:

1. **Katman 0 - Video Katmanı (Background Video Player):**
   * Tam ekran (100vw, 100vh, `object-fit: cover`), 2.39:1 sinematik letterbox (üst ve alt siyah sinema bantları).
   * 10-15 adet yüksek kaliteli, kasvetli, ağır çekim siyah-beyaz b-roll video (yağmur, sokak lambası, sigara dumanı, tren rayları, boş çay bardağı).
   * Butona her tıklandığında CSS cross-fade ile pürüzsüz sahne değişimi.
   * Üzerinde vintage film greni (CSS grain overlay) ve vignette efekti.

2. **Katman 1 - Düşünür / Röportaj Portresi (Interviewee Overlay):**
   * Sol tarafta veya sağ alt köşede, belgeselde konuşan düşünür gibi buğulu şekilde beliren Eren Efe Özkan / arkadaş fotoğrafları.
   * Portrenin altında sinematik şerit:
     * İsim: *"Eren Efe Özkan"*
     * Unvan: *"Bağımsız Düşünür & Riga Felsefe Enstitüsü Kıdemli Üyesi"* (veya randomize absürt unvanlar).

3. **Katman 2 - Altyazı & Aforizma Sahnesi (The Subtitle Canvas):**
   * Ekranın alt-orta kısmında festival filmi altyazı stili (sarı vurgulu kalın kelimeler, daktilo harf harf akış efekti).
   * Font: Cormorant Garamond / Playfair Display / Montserrat.
   * Altında alıntı imzası: `— Eren Efe Özkan, 2024` veya `— Emre Göksan Belgesel Arşivi`.

4. **Katman 3 - Kontrol Paneli & O Kırmızı Buton:**
   * Ekranın alt-merkezinde (veya sabit sinematik bir kontrol dock'unda) hipnotize edici, nabız gibi kırmızı parlayan **"EMRE GÖKSAN'I BAŞLAT" / "BOŞ YAP"** butonu.
   * Köşelerde minimal, şık ikonlar:
     * 🔊 Ses Aç/Kapat (Mute/Unmute)
     * 📷 "Post Olarak İndir" (O anki sahneyi Emre Göksan Instagram kartı gibi PNG olarak dışa aktarır)
     * ➕ "Yeni Kurban Yükle" (Kullanıcının kendi istediği arkadaşının fotoğrafını yükleyebileceği gizli/şık modal)

---

## 3. Ses Mimarisi (Audio Engine)

* **Arka Plan Müziği:** Kasvetli ney ve yaylı/çello orkestrası döngüsü (Web Audio API ile kesintisiz loop).
* **Seslendirme (Can Dündar AI Voice):**
  * Microsoft Edge Neural TTS (`tr-TR-AhmetNeural`), parametreler: `rate: -15%`, `pitch: -5Hz`.
  * Ağır, felsefi, sigara içmiş yorgun belgeselci tonu.
  * 30+ adet aforizma önceden MP3 olarak üretilecek ve yerel olarak sunulacak (sıfır gecikme).
* **Akıllı Ducking Sistemi:**
  * Butona basıldığında Web Audio `GainNode` üzerinden arka plan müziği 0.4 saniye içinde %20 seviyesine iner.
  * Seslendirme başlar ve altyazı daktilo efektiyle senkron akar.
  * Seslendirme bittiğinde müzik tekrar 1.2 saniyede %100 seviyesine yükselir.

---

## 4. Aforizma Kütüphanesi & Veri Modeli

Aforizmalar 3 temel grupta kurgulanır:
1. **Gündelik Hayatın Absürt Trajedileri:**
   * *"Çünkü gitmek, bazen sadece bir montun fermuarını çekerken sıkışan astarı kurtarmaktı..."*
   * *"İnsan en çok, ıslak tuvalet terliğine çorapla bastığında anlardı yalnızlığı..."*
   * *"Biz seninle aynı dolmuşta farklı duraklarda inecek iki yabancı gibiydik; üstelik şoföre 'müsait bir yerde' bile diyemedik..."*
2. **Karanlık, Cinsel & Biyolojik Absürtlükler:**
   * *"Aşk dediğin; gecenin üçünde gelen 'uyudun mu?' mesajındaki o çaresiz, hüzünlü biyolojik kıpırtıydı..."*
   * *"Biz seninle, son kullanma tarihi geçmiş bir prezervatifin vadettiği o sahte güven duygusu kadar çaresizdik..."*
   * *"Bazen sevmek; sabah uyanıp onun yastığında kalan saç telini koklamak değil, lavabo deliğinden cımbızla çekip çıkarmaktı..."*
3. **Eren Efe Özkan / Emre Göksan İmzalı Orijinaller:**
   * *"Tanrım, bir gün bütün insanlara istedikleri kadar para ver ki, asıl ihtiyaçlarının o olmadığını anlayabilsinler."*
   * *"Bazı çiçekler bazı topraklarda olmuyor. Hayatın gerçeği bu."*

---

## 5. Dış Medya Varlıklarının Temini (Ajan Otomasyonu)

* **Videolar:** Pexels/Pixabay açık lisanslı veya telifsiz video kaynaklarından 8-12 adet sinematik siyah-beyaz b-roll video script ile doğrudan `/public/videos/` dizinine indirilecek.
* **Sesler:** Telifsiz hüzünlü ney/çello fon müziği `/public/audio/bg_music.mp3` olarak indirilecek.
* **TTS Seslendirmeleri:** Python `edge-tts` kütüphanesiyle tüm aforizmalar otomatik olarak Can Dündar tonlamasında üretilip `/public/audio/quotes/*.mp3` dizinine kaydedilecek.
* **Görseller:** Kullanıcının yüklediği Eren Efe Özkan fotoğrafları `/public/images/` klasörüne aktarılacak.

---

## 6. Güvenilirlik & Hata Yönetimi

* Tarayıcıların "Autoplay Policy" (kullanıcı etkileşimi olmadan ses çalmama) kuralı için: Sayfa ilk açıldığında sinematik bir "Belgesele Başla / Sessizliği Boz" karşılama ekranı yer alacak. İlk tıkla AudioContext başlatılacak.
* Video yüklenememe veya yavaş bağlantı durumunda: Otomatik olarak CSS gradyanlı yedek sinematik arka plan ve fotoğraflar devreye girecek.
* Mobil / Desktop duyarlılığı: 2.39:1 sinematik letterbox dikey veya yatay ekrana göre dinamik ayarlanacak.
