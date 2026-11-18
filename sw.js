const V='fin-v23';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
const LIBS=['https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js','https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js','https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE).then(()=>Promise.all(LIBS.map(u=>fetch(u,{mode:'no-cors'}).then(r=>c.put(u,r)).catch(()=>{}))))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(/tesseract|tessdata|naptha/i.test(e.request.url)&&!e.request.url.startsWith(self.location.origin))return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
    const net=fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque')){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}return r}).catch(()=>hit||caches.match('./index.html'));
    return hit||net;
  }));
});