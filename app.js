var CACHE='barqyar-v9';
var SHELL=['./','index.html','app.js','privacy.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
// شبکه اول با مهلت ۳ ثانیه؛ اگر کند بود از کش (برای اینترنت ضعیف)
self.addEventListener('fetch',function(e){
  var r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==self.location.origin)return;
  var net=fetch(r).then(function(res){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)});return res});
  var timeout=new Promise(function(_,rej){setTimeout(rej,3000)});
  e.respondWith(Promise.race([net,timeout]).catch(function(){return caches.match(r).then(function(m){return m||net.catch(function(){return caches.match('index.html')})})}));
});
