const CACHE_NAME = 'momonga-pwa-v2';
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./失敗.txt",
  "./失敗.html",
  "./assets/audio/talk_01.wav",
  "./assets/audio/bgm.wav",
  "./assets/audio/notification.wav",
  "./assets/audio/talk_03.wav",
  "./assets/audio/talk_02.wav",
  "./assets/data/momonga_settings_2026-10-03-08-02-40.json",
  "./assets/images/stand-by.png",
  "./assets/images/mouth_close.png",
  "./assets/images/Jackpot-boosting symbol.png",
  "./assets/images/hand_l_2.png",
  "./assets/images/01_まぶた.png",
  "./assets/images/building.png",
  "./assets/images/chain.png",
  "./assets/images/mouth_open.png",
  "./assets/images/ram.png",
  "./assets/images/ear_l_2.png",
  "./assets/images/14_.png",
  "./assets/images/09_.png",
  "./assets/images/body_2 - コピー.png",
  "./assets/images/ribbon_2.png",
  "./assets/images/08_.png",
  "./assets/images/hair_2.png",
  "./assets/images/ear_r_2.png",
  "./assets/images/01_.png",
  "./assets/images/character_2.png",
  "./assets/images/05_.png",
  "./assets/images/leg_l.png",
  "./assets/images/Effoct.png",
  "./assets/images/Fine-grained.png",
  "./assets/images/background.png",
  "./assets/images/tail_2.png",
  "./assets/images/素材.png",
  "./assets/images/body_no_eye.png",
  "./assets/images/06_.png",
  "./assets/images/eye_open.png",
  "./assets/images/Half-open eyes.png",
  "./assets/images/hand_r_2.png",
  "./assets/images/welcome home.png",
  "./assets/images/04_.png",
  "./assets/images/10_.png",
  "./assets/images/headband_2.png",
  "./assets/images/02_眼球.png",
  "./assets/images/eye_close.png",
  "./assets/images/ball.png",
  "./assets/images/訂.jpg",
  "./assets/images/Probability Variation.png",
  "./assets/images/leg_c.png",
  "./assets/images/Iron ball.png",
  "./assets/images/nc175512.jpg"
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => {
    if (cached) return cached;
    return fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => caches.match('./index.html'));
  }));
});
