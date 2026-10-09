import { getRandomQuoteInstance, RAW_QUOTES, AUTHORS } from './quotes.js';
import { soundEngine } from './audio.js';
import { videoManager } from './video.js';
import { generatePoster } from './poster.js';
import { getDissForTarget } from './diss.js';

let customQuotes = [...RAW_QUOTES];
let currentQuote = null;
let selectedCategory = "all";

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const btnStart = document.getElementById('btn-start');
const videoContainer = document.getElementById('video-container');

const philosopherCard = document.getElementById('philosopher-card');
const philosopherImg = document.getElementById('philosopher-img');
const philosopherName = document.getElementById('philosopher-name');
const philosopherTitle = document.getElementById('philosopher-title');

const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const quoteYear = document.getElementById('quote-year');

const btnTrigger = document.getElementById('btn-trigger');
const btnMute = document.getElementById('btn-mute');
const muteIcon = document.getElementById('mute-icon');
const btnPoster = document.getElementById('btn-poster');
const btnCustom = document.getElementById('btn-custom');

const customModal = document.getElementById('custom-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const customForm = document.getElementById('custom-form');
const filmClock = document.getElementById('film-clock');

// Setup Video Stage
videoManager.init(videoContainer);

// Start Experience
btnStart.addEventListener('click', () => {
  welcomeScreen.classList.add('hidden');
  soundEngine.start();
  currentQuote = getRandomQuoteInstance(customQuotes, selectedCategory);
  showQuote(currentQuote);
});

// Big Red Button Click: Next Random Aforizma & Author
btnTrigger.addEventListener('click', () => {
  triggerNext();
});

// Keyboard shortcut: Spacebar triggers next
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !customModal.classList.contains('active')) {
    e.preventDefault();
    triggerNext();
  }
});

function triggerNext() {
  // Transition background video
  videoManager.nextVideo();

  // Pick completely random quote + random author + random title
  currentQuote = getRandomQuoteInstance(customQuotes, selectedCategory);
  showQuote(currentQuote);
}

function showQuote(quote) {
  // 1. Play Edge Neural TTS Voiceover with Author Name & Ducking
  soundEngine.playQuoteWithAuthor(
    quote.audio,
    quote.authorAudio,
    () => {
      // Audio started
    },
    () => {
      // Full audio (quote + author name) ended
    }
  );

  // 2. Update Philosopher Portrait Card with dramatic transition
  philosopherCard.style.opacity = '0';
  philosopherCard.style.transform = 'translateX(-20px)';

  setTimeout(() => {
    philosopherImg.src = quote.image;
    philosopherName.textContent = quote.author;
    philosopherTitle.textContent = quote.title;
    philosopherCard.style.opacity = '1';
    philosopherCard.style.transform = 'translateX(0)';
  }, 200);

  // 3. Render Quote Text with staggered word reveal & gold highlights
  renderQuoteText(quote.text);
  quoteAuthor.textContent = `— ${quote.author}`;
  quoteYear.textContent = `(${quote.year || '2024'})`;
}

function renderQuoteText(text) {
  quoteText.innerHTML = '';
  const words = text.split(/\s+/);
  
  words.forEach((w, index) => {
    const span = document.createElement('span');
    span.className = 'word';
    // Highlight longer or impactful words in golden yellow
    if (w.length > 5 && (index % 3 === 0 || w.toUpperCase() === w)) {
      span.classList.add('gold-word');
    }
    span.textContent = w;
    span.style.animationDelay = `${index * 0.04}s`;
    quoteText.appendChild(span);
    quoteText.appendChild(document.createTextNode(' '));
  });
}

// Category Pills Handler
document.querySelectorAll('.cat-pill').forEach(pill => {
  pill.addEventListener('click', (e) => {
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    selectedCategory = pill.dataset.cat;
    triggerNext();
  });
});

// Mute Toggle
btnMute.addEventListener('click', () => {
  const isMuted = soundEngine.toggleMute();
  muteIcon.textContent = isMuted ? '🔇' : '🔊';
});

// Copy Quote to Clipboard
const btnCopy = document.getElementById('btn-copy');
if (btnCopy) {
  btnCopy.addEventListener('click', () => {
    if (!currentQuote) return;
    const fullText = `"${currentQuote.text}" — ${currentQuote.author} (${currentQuote.title})`;
    navigator.clipboard.writeText(fullText).then(() => {
      btnCopy.textContent = "✓ Kopyalandı!";
      btnCopy.classList.add('copied');
      setTimeout(() => {
        btnCopy.textContent = "📋 Kopyala";
        btnCopy.classList.remove('copied');
      }, 1600);
    });
  });
}

// Poster Export
btnPoster.addEventListener('click', async () => {
  if (!currentQuote) return;
  btnPoster.style.transform = 'scale(0.9)';
  await generatePoster(currentQuote);
  setTimeout(() => {
    btnPoster.style.transform = '';
  }, 200);
});

// Prescription Modal Logic
const btnPrescription = document.getElementById('btn-prescription');
const prescriptionModal = document.getElementById('prescription-modal');
const btnCloseRx = document.getElementById('btn-close-rx');
const rxPatient = document.getElementById('rx-patient');
const rxDoctor = document.getElementById('rx-doctor');
const rxDiagnosis = document.getElementById('rx-diagnosis');
const rxCure = document.getElementById('rx-cure');

const DIAGNOSES = [
  "Akut Mont Fermuarı Sıkışması ve Kronik Pazar Bunalımı",
  "Ağır Halı Saha Son Dakika Aut Travması ve Defansa Dönmeme Hastalığı",
  "WhatsApp Grubunda 'Görüldü' Atılma Sonrası Gelişen Varoluşsal Boşluk",
  "Gece 03:00'te Buzdolabı Işığında Donup Kalma ve Sucuk Aşırma Sendromu",
  "Bozuk Para Üstünü Saymaktan Utanma ve Fakir Görünme Korkusu",
  "Lateks Yırtılması Sonrası Gelişen Panik ve Sahte Güven Şoku",
  "Şarj Kablosunu 90 Derece Bükerek Uyumaya Çalışma Bağımlılığı",
  "Aşırı Düşünme (Overthinking) ve Eski Sevgiliyi Stalklama Nüksü",
  "Kronik Yalnızlık, Bira Göbeği ve Sosyalleşememe Krizleri",
  "Riga Soğuğunda Akıl Tutulması ve Memleket Hasreti Melankolisi"
];

const PRESCRIPTION_ITEMS = [
  "31 çek geçer, büyütme bu kadar.",
  "Dışarı çık, biraz oksijen al ve insan yüzü gör.",
  "Arkadaşlarınla bowling harici bir aktivite yap artık, baydı.",
  "Ülkene dön, Letonya'da çürüdün gittin be adam.",
  "Kadın bul, acil olarak sosyal hayata karış.",
  "Halı sahada top kaybı yapınca ellerini beline koyup yürüme, koş.",
  "LoL oynamayı derhal bırak, odayı havalandır ve adam gibi duş al.",
  "Gece 03:00'te eski sevgiliye 'uyudun mu?' mesajı atmak kesinlikle yasaklandı.",
  "WhatsApp grubuna attığın o soğuk şakaları derhal sil ve insanlardan özür dile.",
  "Instagram story'lerine siyah arka planda hüzünlü şarkı koymayı bırak.",
  "Montunun fermuarını terziye diktir, 3 yıldır aynı montla edebiyat yapıyorsun.",
  "Islak tuvalet terliğine çorapla basmaktan derhal imtina edilecek.",
  "Metehan'dan sürekli 'kanka haftaya atarım' diyerek borç istemeyi kes.",
  "Sözer'in arabasına binerken kapıyı traktör kapısı gibi sert çarpma.",
  "Sözer'in zenci olduğunu yüzüne vurma.",
  "Kredi kartı asgarisini ödeyip kendini zengin sanma yanılgısını terk et.",
  "Sabah kahvesini şekersiz içip 'hayat çok acı' triplerine girme, şeker at."
];

btnPrescription.addEventListener('click', () => {
  soundEngine.playClickSound();
  const doctor = currentQuote ? currentQuote.author : "Emre Göksan";
  const potentialPatients = AUTHORS.filter(a => a.name !== doctor);
  const patientObj = potentialPatients[Math.floor(Math.random() * potentialPatients.length)];
  
  if (rxDoctor) rxDoctor.textContent = `Prof. Dr. ${doctor}`;
  if (rxPatient) rxPatient.textContent = patientObj ? patientObj.name : "Efe Sözer";
  rxDiagnosis.textContent = DIAGNOSES[Math.floor(Math.random() * DIAGNOSES.length)];
  
  // Pick 3 to 4 random unhinged prescriptions
  const shuffled = [...PRESCRIPTION_ITEMS].sort(() => 0.5 - Math.random());
  const selectedCures = shuffled.slice(0, 4);
  rxCure.innerHTML = selectedCures.map(c => `• ${c}`).join('<br>');

  prescriptionModal.classList.add('active');
});

btnCloseRx.addEventListener('click', () => {
  prescriptionModal.classList.remove('active');
});

prescriptionModal.addEventListener('click', (e) => {
  if (e.target === prescriptionModal) {
    prescriptionModal.classList.remove('active');
  }
});

// Custom Victim Modal Controls
btnCustom.addEventListener('click', () => {
  customModal.classList.add('active');
});

btnCloseModal.addEventListener('click', () => {
  customModal.classList.remove('active');
});

customModal.addEventListener('click', (e) => {
  if (e.target === customModal) {
    customModal.classList.remove('active');
  }
});

// Handle Custom Victim Upload
customForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('victim-name').value.trim();
  const title = document.getElementById('victim-title').value.trim();
  const fileInput = document.getElementById('victim-file');

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const customImgUrl = ev.target.result;
      const randomAudioId = Math.floor(Math.random() * 50) + 3;
      
      const newCustomItem = {
        id: `quote_${randomAudioId}`,
        text: `Bazen sadece susarsın... Çünkü hayat, tıpkı ${name}'ın unuttuğu o son sigara izmariti gibi kendi kendine küllenirdi...`,
        customAuthor: name,
        customTitle: title,
        customImage: customImgUrl
      };

      customQuotes.unshift(newCustomItem);
      customModal.classList.remove('active');
      customForm.reset();
      
      currentQuote = getRandomQuoteInstance([newCustomItem]);
      showQuote(currentQuote);
    };
    reader.readAsDataURL(fileInput.files[0]);
  }
});

// Film HUD Clock (HH:MM:SS)
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  if (filmClock) {
    filmClock.textContent = `${h}:${m}:${s}`;
  }
}
setInterval(updateClock, 1000);
updateClock();

// ==========================================================================
// Credits Modal (Jenerik)
// ==========================================================================
const btnCredits = document.getElementById('btn-credits');
const creditsModal = document.getElementById('credits-modal');
const btnCloseCredits = document.getElementById('btn-close-credits');

if (btnCredits && creditsModal) {
  btnCredits.addEventListener('click', () => {
    soundEngine.playClickSound();
    creditsModal.classList.add('active');
  });

  if (btnCloseCredits) {
    btnCloseCredits.addEventListener('click', () => {
      creditsModal.classList.remove('active');
    });
  }

  creditsModal.addEventListener('click', (e) => {
    if (e.target === creditsModal) {
      creditsModal.classList.remove('active');
    }
  });
}

// ==========================================================================
// Diss Modal (Felsefi Hesaplaşma)
// ==========================================================================
const btnDiss = document.getElementById('btn-diss');
const dissModal = document.getElementById('diss-modal');
const btnCloseDiss = document.getElementById('btn-close-diss');
const btnNextDiss = document.getElementById('btn-next-diss');
const dissFromImg = document.getElementById('diss-from-img');
const dissFromName = document.getElementById('diss-from-name');
const dissToImg = document.getElementById('diss-to-img');
const dissToName = document.getElementById('diss-to-name');
const dissText = document.getElementById('diss-text');

function triggerRandomDiss() {
  const shuffled = [...AUTHORS].sort(() => 0.5 - Math.random());
  const fromAuthor = shuffled[0];
  const toAuthor = shuffled[1];

  if (dissFromImg) dissFromImg.src = fromAuthor.image;
  if (dissFromName) dissFromName.textContent = fromAuthor.name;
  if (dissToImg) dissToImg.src = toAuthor.image;
  if (dissToName) dissToName.textContent = toAuthor.name;
  // Guarantees the diss sentence targets toAuthor and ends with their name!
  if (dissText) dissText.textContent = getDissForTarget(toAuthor.name);
}

if (btnDiss && dissModal) {
  btnDiss.addEventListener('click', () => {
    soundEngine.playClickSound();
    triggerRandomDiss();
    dissModal.classList.add('active');
  });

  if (btnNextDiss) {
    btnNextDiss.addEventListener('click', () => {
      soundEngine.playClickSound();
      triggerRandomDiss();
    });
  }

  if (btnCloseDiss) {
    btnCloseDiss.addEventListener('click', () => {
      dissModal.classList.remove('active');
    });
  }

  dissModal.addEventListener('click', (e) => {
    if (e.target === dissModal) {
      dissModal.classList.remove('active');
    }
  });
}

// ==========================================================================
// Efkar Modu (Sol tık: Sigara/Rakı/Kapat Döngüsü | Sağ tık: Rakı)
// ==========================================================================
const btnEfkar = document.getElementById('btn-efkar');
const efkarIcon = document.getElementById('efkar-icon');

let currentEfkarState = 'none'; // 'none' | 'sigara' | 'raki'

function showToast(msg) {
  let toast = document.querySelector('.efkar-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'efkar-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = msg;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function setEfkarMode(mode) {
  document.body.classList.remove('efkar-active-sigara', 'efkar-active-raki');
  if (btnEfkar) btnEfkar.classList.remove('active-sigara', 'active-raki');

  currentEfkarState = mode;

  if (mode === 'sigara') {
    document.body.classList.add('efkar-active-sigara');
    if (btnEfkar) btnEfkar.classList.add('active-sigara');
    if (efkarIcon) efkarIcon.textContent = '🚬';
    soundEngine.playLighterSound();
    showToast('🚬 <strong>EFKAR MODU: SİGARA YAKILDI</strong><br><span style="font-size:0.75rem;opacity:0.85">Bir dal Maltepe yakıldı, dertler havaya karıştı. (Tekrar bas: Rakı)</span>');
  } else if (mode === 'raki') {
    document.body.classList.add('efkar-active-raki');
    if (btnEfkar) btnEfkar.classList.add('active-raki');
    if (efkarIcon) efkarIcon.textContent = '🥃';
    soundEngine.playGlassClinkSound();
    showToast('🥃 <strong>EFKAR MODU: RAKI DOLDURULDU</strong><br><span style="font-size:0.75rem;opacity:0.85">Şerefe! Masaya beyaz peynir ve kavun çekildi. (Tekrar bas: Kapat)</span>');
  } else {
    if (efkarIcon) efkarIcon.textContent = '🚬';
    soundEngine.playClickSound();
    showToast('💨 <strong>EFKAR KAPATILDI</strong><br><span style="font-size:0.75rem;opacity:0.85">Masadan kalkıldı, gerçek hayata dönüldü.</span>');
  }
}

if (btnEfkar) {
  // Left Click on button: Cycles None -> Sigara -> Raki -> None
  btnEfkar.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentEfkarState === 'none') {
      setEfkarMode('sigara');
    } else if (currentEfkarState === 'sigara') {
      setEfkarMode('raki');
    } else {
      setEfkarMode('none');
    }
  });

  // Right Click on button: Directly triggers / toggles Raki
  btnEfkar.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentEfkarState === 'raki') {
      setEfkarMode('none');
    } else {
      setEfkarMode('raki');
    }
  });
}

// Right Click ANYWHERE on document (outside open modals/inputs) -> Toggles Raki Mode!
window.addEventListener('contextmenu', (e) => {
  if (e.target.closest('.modal-backdrop.active') || e.target.closest('input')) {
    return;
  }
  e.preventDefault();
  if (currentEfkarState === 'raki') {
    setEfkarMode('none');
  } else {
    setEfkarMode('raki');
  }
});
