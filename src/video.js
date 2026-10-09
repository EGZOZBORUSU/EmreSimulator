class VideoManager {
  constructor() {
    this.videoList = [
      '/videos/video_smoke.webm',
      '/videos/video_street_lamp_snow.webm',
      '/videos/video_rain_window.webm',
      '/videos/video_night_traffic.webm',
      '/videos/video_snow.webm',
      '/videos/video_street_rain.webm',
      '/videos/video_rain.webm'
    ];
    this.currentIndex = 0;
    this.videoA = null;
    this.videoB = null;
    this.activePlayer = 'A'; // 'A' or 'B'
  }

  init(containerEl) {
    this.container = containerEl;
    this.videoA = document.createElement('video');
    this.videoB = document.createElement('video');

    [this.videoA, this.videoB].forEach(v => {
      v.autoplay = true;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.className = 'cinematic-bg-video';
    });

    this.videoA.src = this.videoList[0];
    this.videoA.style.opacity = '1';
    this.videoB.style.opacity = '0';

    this.container.appendChild(this.videoA);
    this.container.appendChild(this.videoB);

    this.videoA.play().catch(e => console.log('Video A autoplay deferred:', e));
  }

  nextVideo() {
    this.currentIndex = (this.currentIndex + 1) % this.videoList.length;
    const nextSrc = this.videoList[this.currentIndex];

    if (this.activePlayer === 'A') {
      this.videoB.src = nextSrc;
      this.videoB.load();
      this.videoB.play().then(() => {
        this.videoB.style.opacity = '1';
        this.videoA.style.opacity = '0';
        this.activePlayer = 'B';
      }).catch(e => console.log('Video transition error:', e));
    } else {
      this.videoA.src = nextSrc;
      this.videoA.load();
      this.videoA.play().then(() => {
        this.videoA.style.opacity = '1';
        this.videoB.style.opacity = '0';
        this.activePlayer = 'A';
      }).catch(e => console.log('Video transition error:', e));
    }
  }
}

export const videoManager = new VideoManager();
