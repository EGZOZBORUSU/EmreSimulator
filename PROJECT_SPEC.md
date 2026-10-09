# Emre Göksan Simülatörü - Proje Tasarım ve Mimari Dokümanı

**Proje Adı:** Emre Göksan Simülatörü  
**Konsept:** Boş Yapma Butonu / Can Dündar Sinematik Belgesel Jeneratörü & Sahte Filozof Post Motoru  
**Ana İlke:** **VİDEO ODAKLI SİNEMATİK DENEYİM.** Video oynatma kesinlikle temel omurgadır; fotoğraf ve aforizmalar bu sinematik video akışının bir parçası olarak sahneye girer.

---

## 1. Kesinleşen Temel Özellikler

### 1.1. Video Odaklı Sahne & Atmosfer (Festival Belgeseli B-Roll)
* **Ana Katman (Fullscreen Video):** 
  * Arka planda tam ekran, yüksek kaliteli, siyah-beyaz / kasvetli ağır çekim (slow-motion) sinematik stock video döngüleri kesintisiz akar (yağmurda buğulu sokaklar, sigara dumanı, boş tren rayları, gece ıslak asfalt, yalnız yürüyen silüetler).
  * Tüm bu videolar ajan (yapay zeka) tarafından otomatik indirilip yerel depolanacaktır.
* **Belgesel Portre Entegrasyonu (Interviewee Katmanı):**
  * Butona basıldığında video arka planda akmaya devam ederken, belgesellerdeki "konuşmacı / düşünür" sahnesi gibi arkadaşın portresi (Eren Efe Özkan vb.) sinematik bir duman/fade geçişiyle sahnenin bir köşesinde belirir.
  * Altında belgesel unvanı: *"Eren Efe Özkan - Bağımsız Düşünür & Riga Felsefe Enstitüsü"* veya *"Emre Göksan - Hayat Tasarımcısı"*.
* **"Yeni Kurban / Düşünür Yükle":** Kullanıcı isterse kendi arkadaşının fotoğrafını da yükleyebilecek, sistem onu siyah-beyaz yapıp videolu belgesel kurgusuna dahil edecek.
* **Ekstra Özellik - Poster İndir:** İstenildiği an o anki sahne, Emre Göksan'ın meşhur sosyal medya posteri formatında (Eren'in yüzü + sarı/beyaz aforizma + Riga logosu) HD PNG olarak tek tıkla indirilebilecek.

### 1.2. Ses Mimarisi (Ney/Çello + Edge Neural TTS)
* **Arka Plan Müziği:** Kasvetli, derinden çalan ney ve yaylı/çello orkestrası döngüsü.
* **Can Dündar TTS:** Microsoft Edge Neural TTS (`tr-TR-AhmetNeural`), `pitch: -5Hz`, `rate: -15%` ile üretilmiş tok, yavaş, dumanlı Türkçe seslendirme havuzu.
* **Akıllı Ducking:** Butona basıldığında video devam eder, arka plan müziği otomatik %25'e kısılır, Can Dündar sesi aforizmayı tane tane okur, daktilo altyazı akar, konuşma bitince müzik tekrar yükselir.

### 1.3. Aforizma Dünyası (Absürt + Günlük Rezillik + Cinsel Göndermeli Boş Yapma)
* Aşırı lirik ve edebi başlayıp yerin dibine giren absürt aforizmalar:
  * *"Çünkü gitmek, bazen sadece bir montun fermuarını çekerken sıkışan astarı kurtarmaktı..."*
  * *"Aşk dediğin; gecenin üçünde gelen 'uyudun mu?' mesajındaki o çaresiz, hüzünlü biyolojik kıpırtıydı..."*
  * *"Biz seninle aynı yatakta ters yönlere yatan iki telefon şarj kablosu gibiydik; birbirimize yetemedik..."*
  * *"Tanrım, bir gün bütün insanlara istedikleri kadar para ver ki, asıl ihtiyaçlarının o olmadığını anlayabilsinler. - Eren Efe Özkan"*
  * *"Bazı çiçekler bazı topraklarda olmuyor. Hayatın gerçeği bu. - Eren Efe Özkan"*

---

## 2. Teknik Yığın & Mimari

* **Ön Yüz:** Vite + Vanilla JS / Modern CSS (Ultra hızlı, sıfır hantallık, 60fps video-canvas performansı).
* **Medya Yönetimi:** 
  * Yerel `/public/videos/` klasöründe yüksek kaliteli sinematik stock döngüleri.
  * Yerel `/public/audio/` klasöründe ney/çello döngüsü ve seslendirilmiş aforizma MP3'leri.
  * Yerel `/public/images/` klasöründe Eren Efe Özkan ve arkadaş kadrosunun fotoğrafları.
* **Canvas Export:** HTML5 Canvas / html-to-image ile anında sosyal medya görseli üretimi.
