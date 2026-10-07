const CACHE = 'rdd-rehearsal-v4';
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png", "./S1.mp3", "./S2.mp3", "./S3.mp3", "./S4.mp3", "./S5.mp3", "./S6.mp3", "./S7.mp3", "./S8.mp3", "./S9.mp3", "./S10.mp3", "./S11.mp3", "./S12.mp3", "./S13.mp3", "./S14.mp3", "./S15.mp3", "./S16.mp3", "./S17.mp3", "./S18.mp3", "./S19.mp3", "./S20.mp3", "./S21.mp3", "./S22.mp3", "./S23.mp3", "./S24.mp3", "./S25.mp3", "./S27.mp3", "./QA.mp3"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).catch(() => caches.match('./index.html'))));
});
