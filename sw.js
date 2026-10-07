const CACHE = 'rdd-rehearsal-v5';
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png", "./S1.mp3", "./S2.mp3", "./S3.mp3", "./S4.mp3", "./S5.mp3", "./S6.mp3", "./S7.mp3", "./S8.mp3", "./S9.mp3", "./S10.mp3", "./S11.mp3", "./S12.mp3", "./S13.mp3", "./S14.mp3", "./S15.mp3", "./S16.mp3", "./S17.mp3", "./S18.mp3", "./S19.mp3", "./S20.mp3", "./S21.mp3", "./S22.mp3", "./S23.mp3", "./S24.mp3", "./S25.mp3", "./S27.mp3", "./QA.mp3"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// iPhone asks for audio in byte ranges; answer those from the cache with a proper 206 response
async function ranged(req, res) {
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range') || '');
  const buf = await res.arrayBuffer(), size = buf.byteLength;
  let start = m && m[1] ? +m[1] : 0, end = m && m[2] ? +m[2] : size - 1;
  if (m && !m[1] && m[2]) { start = size - +m[2]; end = size - 1; }
  end = Math.min(end, size - 1);
  return new Response(buf.slice(start, end + 1), { status: 206, statusText: 'Partial Content', headers: {
    'Content-Type': res.headers.get('Content-Type') || 'audio/mpeg', 'Content-Range': `bytes ${start}-${end}/${size}`,
    'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes' } });
}
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith((async () => {
    const hit = await caches.match(e.request, { ignoreSearch: true });
    if (hit) return e.request.headers.get('range') ? ranged(e.request, hit) : hit;
    try { return await fetch(e.request); } catch (err) { return (await caches.match('./index.html')) || Response.error(); }
  })());
});
