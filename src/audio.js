class SoundEngine {
  constructor() {
    this.bgAudio = new Audio('/audio/bg_music.mp3');
    this.bgAudio.loop = true;
    this.bgAudio.volume = 0;
    
    this.quoteAudio = new Audio();
    this.authorAudio = new Audio();
    this.isMuted = false;
    this.targetBgVolume = 0.45;
    this.duckedVolume = 0.08;
    this.isPlaying = false;
    this.hasStarted = false;
    this.currentEndHandler = null;
    this.authorEndHandler = null;
    this.authorTimeout = null;
    this.fadeInterval = null;
  }

  start() {
    if (this.hasStarted) return;
    this.hasStarted = true;
    this.isPlaying = true;
    
    this.bgAudio.play().then(() => {
      this.fadeVolume(this.bgAudio, 0, this.targetBgVolume, 2000);
    }).catch(err => {
      console.warn("Auto-play prevented, waiting for interaction:", err);
    });
  }

  stopCurrentQuote() {
    if (this.authorTimeout) {
      clearTimeout(this.authorTimeout);
      this.authorTimeout = null;
    }
    if (this.currentEndHandler) {
      this.quoteAudio.removeEventListener('ended', this.currentEndHandler);
      this.currentEndHandler = null;
    }
    if (this.authorEndHandler) {
      this.authorAudio.removeEventListener('ended', this.authorEndHandler);
      this.authorEndHandler = null;
    }
    this.quoteAudio.pause();
    this.quoteAudio.currentTime = 0;
    this.authorAudio.pause();
    this.authorAudio.currentTime = 0;
  }

  playClickSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.09);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {}
  }

  playLighterSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      // Flint strike + ignition
      const bufferSize = Math.floor(ctx.sampleRate * 0.2);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2400;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }

  playGlassClinkSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2850, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2700, ctx.currentTime + 1.1);
      gain.gain.setValueAtTime(0.45, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.1);
    } catch (e) {}
  }

  playQuoteWithAuthor(quoteAudioUrl, authorAudioUrl, onStart, onEnded) {
    if (!this.hasStarted) {
      this.start();
    }

    // Analog tactile button click
    this.playClickSound();

    // Instantly cut off any previous audio!
    this.stopCurrentQuote();

    if (this.isMuted) {
      if (onStart) onStart();
      setTimeout(() => {
        if (onEnded) onEnded();
      }, 3500);
      return;
    }

    // Duck background music fast
    this.fadeVolume(this.bgAudio, this.bgAudio.volume, this.duckedVolume, 250);

    // Load and play quote
    this.quoteAudio.src = quoteAudioUrl;
    this.quoteAudio.currentTime = 0;

    this.currentEndHandler = () => {
      this.currentEndHandler = null;
      
      // If author voice is available, play it after a brief 250ms breath/pause
      if (authorAudioUrl) {
        this.authorTimeout = setTimeout(() => {
          this.authorAudio.src = authorAudioUrl;
          this.authorAudio.currentTime = 0;

          this.authorEndHandler = () => {
            this.authorEndHandler = null;
            this.restoreBgVolume();
            if (onEnded) onEnded();
          };
          this.authorAudio.addEventListener('ended', this.authorEndHandler, { once: true });
          this.authorAudio.play().catch(e => {
            console.log('Author audio play deferred:', e);
            this.restoreBgVolume();
            if (onEnded) onEnded();
          });
        }, 280);
      } else {
        this.restoreBgVolume();
        if (onEnded) onEnded();
      }
    };

    this.quoteAudio.addEventListener('ended', this.currentEndHandler, { once: true });

    this.quoteAudio.play().then(() => {
      if (onStart) onStart();
    }).catch(err => {
      console.warn("Quote audio play error:", err);
      this.restoreBgVolume();
      if (onStart) onStart();
      if (onEnded) onEnded();
    });
  }

  restoreBgVolume() {
    if (!this.isMuted) {
      this.fadeVolume(this.bgAudio, this.bgAudio.volume, this.targetBgVolume, 1000);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.bgAudio.volume = 0;
      this.stopCurrentQuote();
    } else {
      this.bgAudio.volume = this.targetBgVolume;
    }
    return this.isMuted;
  }

  fadeVolume(audioElement, startVol, endVol, durationMs) {
    if (this.isMuted) {
      audioElement.volume = 0;
      return;
    }
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }
    const steps = 15;
    const stepTime = durationMs / steps;
    const volChange = (endVol - startVol) / steps;
    let currentStep = 0;

    this.fadeInterval = setInterval(() => {
      currentStep++;
      const newVol = Math.max(0, Math.min(1, startVol + (volChange * currentStep)));
      audioElement.volume = newVol;

      if (currentStep >= steps) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        audioElement.volume = endVol;
      }
    }, stepTime);
  }
}

export const soundEngine = new SoundEngine();
