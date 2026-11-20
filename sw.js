const V='fin-v29';
const MUST=['./index.html'];
const CORE=['./','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
const LIBS=['https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js','https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js','https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js'];
const SKIP=/tessdata|naptha|tesseract-core|worker\.min|\.traineddata/i;
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(MUST).then(()=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})).concat(LIBS.map(u=>fetch(u,{mode:'no-cors'}).then(r=>c.put(u,r)).catch(()=>{}))))))
.then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  if(SKIP.test(r.url)&&!r.url.startsWith(self.location.origin))return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>{
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res});
    if(hit){net.catch(()=>{});return hit}
    return net.catch(()=>r.mode==='navigate'?caches.match('./index.html',{ignoreSearch:true}).then(x=>x||caches.match('./',{ignoreSearch:true})||Response.error()):new Response('',{status:504,statusText:'offline'}));
  }));
});