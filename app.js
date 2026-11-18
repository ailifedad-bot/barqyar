var SB='https://zgswoheckqasqoclhodg.supabase.co',KEY='sb_publishable_Gs5TQ0bdmhNvboT6_1gU3Q_mzmnv2Ny';
var WA='989366428816',TG='makekzir',MAIL='makealmatykz@gmail.com';
var P=[],cat='همه',cart={},saved=false,mode='',token=null,tab='orders',O=[];
function $(i){return document.getElementById(i)}
function f(n){return Number(n||0).toLocaleString('fa-IR')}
function pr(n){return f(n)+' ریال'}
function en(n){return Number(n).toLocaleString('en-US')+' ریال'}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function val(i){var e=$(i);return e?e.value:''}
function api(path,o){o=o||{};var h={apikey:KEY,Authorization:'Bearer '+(token||KEY),'Content-Type':'application/json'};if(o.prefer)h.Prefer=o.prefer;
 return fetch(SB+'/rest/v1/'+path,{method:o.method||'GET',headers:h,body:o.body?JSON.stringify(o.body):undefined,keepalive:!!o.keep}).then(function(r){if(!r.ok)return r.text().then(function(t){throw new Error(t||r.status)});return r.status===204?null:r.text().then(function(t){return t?JSON.parse(t):null})})}
function load(){api('shop_products?select=*&order=id').then(function(d){P=d||[];draw()}).catch(function(){$('grid').innerHTML='<p class="err" style="grid-column:1/-1;text-align:center">بارگذاری کالاها ناموفق بود. صفحه را دوباره باز کنید.</p>'})}
function cats(){return ['همه'].concat(P.map(function(x){return x.category}).filter(function(v,i,a){return v&&a.indexOf(v)===i}))}
function chg(id,d){cart[id]=Math.max(0,(cart[id]||0)+d);if(!cart[id])delete cart[id];saved=false;draw();if(mode==='cart')cartView()}
function show(m){mode=m;$('sh').className='sheet o'}
function closeSh(){$('sh').className='sheet';mode=''}
function lines(){var t=0,n=0,a=[];P.forEach(function(x){var q=cart[x.id];if(!q)return;var line=Number(q)*Number(x.price);t+=line;n+=q;a.push({product_id:x.id,name:x.name,unit:x.unit,qty:q,price:Number(x.price),line_total:line})});return {a:a,t:t,n:n}}
function openCart(){show('cart');cartView()}
function cartView(){
 var L=lines(),h='';
 if(!L.n){$('in').innerHTML='<p style="text-align:center">سبد خرید خالی است</p><button class="btn" onclick="closeSh()">بستن</button>';return}
 L.a.forEach(function(i){var x=P.filter(function(p){return p.name===i.name})[0];h+='<div class="row"><div><b>'+esc(i.name)+'</b><br><small class="mu">'+pr(i.price)+' × '+f(i.qty)+'</small></div><div class="qty"><button onclick="chg('+x.id+',1)">+</button><b>'+f(i.qty)+'</b><button onclick="chg('+x.id+',-1)">−</button></div></div>'});
 var nm=val('nm'),ph=val('ph'),ad=val('ad');
 $('in').innerHTML='<h3 style="margin:0 0 6px">سبد خرید</h3>'+h+'<div class="tot">جمع کل: '+pr(L.t)+'</div>'+
 '<input id="nm" placeholder="نام و نام خانوادگی" value="'+esc(nm)+'"><input id="ph" type="tel" placeholder="شماره تماس" value="'+esc(ph)+'"><textarea id="ad" rows="2" placeholder="آدرس تحویل">'+esc(ad)+'</textarea>'+
 '<p id="er" class="err"></p><p class="mu">ثبت و ارسال سفارش از طریق:</p>'+
 '<a class="btn wa" target="_blank" rel="noopener" href="#" onclick="return go(this,\'wa\')">واتس‌اپ</a>'+
 '<a class="btn tg" target="_blank" rel="noopener" href="https://t.me/'+TG+'" onclick="return go(this,\'tg\')">تلگرام (@'+TG+')</a>'+
 '<form method="POST" action="https://formsubmit.co/'+MAIL+'" target="_blank" onsubmit="return go(this,\'mail\')">'+
 '<input type="hidden" name="_subject" value="سفارش جدید برق‌یار"><input type="hidden" name="_captcha" value="false"><input type="hidden" name="_template" value="table">'+
 '<input type="hidden" name="name" id="f_n"><input type="hidden" name="phone" id="f_p"><input type="hidden" name="address" id="f_a"><input type="hidden" name="order" id="f_o">'+
 '<button class="btn gh" type="submit">ایمیل</button></form>';
}
function openContact(){show('contact');
 $('in').innerHTML='<h3 style="margin:0 0 6px">تماس با ما</h3><a class="btn wa" target="_blank" rel="noopener" href="https://wa.me/'+WA+'">واتس‌اپ</a><a class="btn tg" target="_blank" rel="noopener" href="https://t.me/'+TG+'">تلگرام (@'+TG+')</a>'+
 '<h4 style="margin:16px 0 6px">ارسال پیام</h4><form method="POST" action="https://formsubmit.co/'+MAIL+'" target="_blank">'+
 '<input type="hidden" name="_subject" value="پیام جدید از برق‌یار"><input type="hidden" name="_captcha" value="false"><input type="hidden" name="_template" value="table">'+
 '<input name="name" placeholder="نام" required><input name="phone" type="tel" placeholder="شماره تماس" required><textarea name="message" rows="3" placeholder="پیام شما" required></textarea><button class="btn" type="submit">ارسال پیام</button></form>';
}
/* ---------- مدیر ---------- */
function openAdmin(){show('admin');token?adminView():loginView()}
function loginView(m){$('in').innerHTML='<h3 style="margin:0 0 8px">ورود مدیر</h3><input id="em" type="email" placeholder="ایمیل" dir="ltr"><input id="pw" type="password" placeholder="رمز عبور" dir="ltr"><button class="btn" onclick="login()">ورود</button><p class="err">'+(m||'')+'</p>'}
function login(){
 fetch(SB+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({email:val('em').trim(),password:val('pw')})})
 .then(function(r){return r.json()}).then(function(d){if(!d.access_token)return loginView('ایمیل یا رمز عبور اشتباه است.');token=d.access_token;adminView()}).catch(function(){loginView('خطا در اتصال.')})
}
function logout(){token=null;closeSh()}
function fail(e){$('ab').innerHTML='<p class="err">دسترسی ندارید یا خطایی رخ داد. با ایمیل مدیر وارد شوید.</p>'}
function ost(i,s){api('shop_orders?id=eq.'+O[i].id,{method:'PATCH',prefer:'return=minimal',body:{status:s}}).then(ordersView).catch(fail)}
function odel(i){if(confirm('این سفارش حذف شود؟'))api('shop_orders?id=eq.'+O[i].id,{method:'DELETE'}).then(ordersView).catch(fail)}
function psave(i){var b={name:val('pn'+i).trim(),category:val('pc'+i).trim(),price:Number(val('pp'+i))||0,unit:val('pu'+i).trim()||'عدد',emoji:val('pe'+i)||'🔌',in_stock:val('ps'+i)==='1'};
 if(!b.name||!b.category)return alert('نام و دسته را وارد کنید.');
 api('shop_products?id=eq.'+P[i].id,{method:'PATCH',prefer:'return=minimal',body:b}).then(function(){Object.assign(P[i],b);draw();alert('ذخیره شد')}).catch(function(){alert('ذخیره نشد')})}
function pdel(i){if(confirm('این کالا حذف شود؟'))api('shop_products?id=eq.'+P[i].id,{method:'DELETE'}).then(function(){P.splice(i,1);draw();productsView()}).catch(function(){alert('حذف نشد')})}
function padd(){api('shop_products',{method:'POST',prefer:'return=representation',body:{name:'کالای جدید',category:'متفرقه',unit:'عدد',price:0,emoji:'🔌',in_stock:false}}).then(function(d){P.unshift(d[0]);draw();productsView()}).catch(function(){alert('افزودن نشد')})}

/* ---- بهبودها: عکس کالا، کد پیگیری، گزارش، اعلان ---- */
var ST={new:'جدید',confirmed:'تأییدشده',shipping:'در حال ارسال',done:'تحویل‌شده',cancelled:'لغو‌شده'};
var code='',pollT=null,lastNew=-1;
function genCode(){var a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',s='BY-',b=new Uint8Array(6);crypto.getRandomValues(b);for(var i=0;i<6;i++)s+=a[b[i]%a.length];return s}
function draw(){
 var cs=cats();
 $('chips').innerHTML=cs.map(function(c){return '<button class="chip'+(c===cat?' on':'')+'">'+esc(c)+'</button>'}).join('');
 Array.prototype.forEach.call($('chips').children,function(b,i){b.onclick=function(){cat=cs[i];draw()}});
 var q=$('q').value.trim();
 var l=P.filter(function(x){return (cat==='همه'||x.category===cat)&&(!q||x.name.indexOf(q)>-1||x.category.indexOf(q)>-1)});
 $('grid').innerHTML=l.length?l.map(function(x){
  var n=cart[x.id]||0,b;
  if(!x.in_stock)b='<button class="btn gh" disabled>ناموجود</button>';
  else if(n)b='<div class="qty"><button onclick="chg('+x.id+',1)">+</button><b>'+f(n)+'</b><button onclick="chg('+x.id+',-1)">−</button></div>';
  else b='<button class="btn" onclick="chg('+x.id+',1)">افزودن به سبد</button>';
  var ic=x.image_url?'<div class="ic im"><img src="'+esc(x.image_url)+'" alt="" loading="lazy"></div>':'<div class="ic">'+esc(x.emoji)+'</div>';
  return '<div class="p">'+ic+'<b>'+esc(x.name)+'</b><small>'+esc(x.category)+' · '+esc(x.unit)+'</small><div class="pr">'+pr(x.price)+'</div>'+b+'</div>'
 }).join(''):'<p class="mu" style="grid-column:1/-1;text-align:center">کالایی پیدا نشد</p>';
 var L=lines();$('bar').className='bar'+(L.n?'':' h');$('bn').textContent='مشاهده سبد ('+f(L.n)+' کالا)';$('bt').textContent=pr(L.t);
}
function orderText(){var L=lines();return 'سفارش جدید از برق‌یار\nکد پیگیری: '+code+'\n'+L.a.map(function(i){return '• '+i.name+' × '+i.qty+' ('+i.unit+') = '+en(i.qty*i.price)}).join('\n')+'\nجمع کل: '+en(L.t)+'\nنام: '+val('nm')+'\nتلفن: '+val('ph')+'\nآدرس: '+val('ad')}
function go(el,k){
 if(!val('nm').trim()||!val('ph').trim()||!val('ad').trim()){$('er').textContent='لطفاً نام، شماره تماس و آدرس را کامل کنید.';return false}
 var L=lines();
 if(!saved){saved=true;code=genCode();api('shop_orders',{method:'POST',prefer:'return=minimal',keep:1,body:{customer_name:val('nm').trim(),phone:val('ph').trim(),address:val('ad').trim(),items:L.a,total:L.t,tracking_code:code,payment_method:'cash_on_delivery'}}).catch(function(){saved=false})}
 var t=orderText();
 $('er').className='okc';$('er').textContent='سفارش ثبت شد. کد پیگیری شما: '+code+' (آن را نگه دارید)';
 if(k==='wa'){el.href='https://wa.me/'+WA+'?text='+encodeURIComponent(t)}
 else if(k==='tg'){try{navigator.clipboard.writeText(t)}catch(e){}$('er').textContent+=' — متن سفارش کپی شد؛ در تلگرام Paste و ارسال کنید.'}
 else{$('f_n').value=val('nm');$('f_p').value=val('ph');$('f_a').value=val('ad');$('f_o').value=t}
 return true;
}
function openTrack(){show('track');$('in').innerHTML='<h3 style="margin:0 0 8px">پیگیری سفارش</h3><input id="tc" placeholder="کد پیگیری (مثلاً BY-AB12CD)" dir="ltr"><button class="btn" onclick="doTrack()">پیگیری</button><div id="tr" style="margin-top:10px"></div>'}
function doTrack(){var c=val('tc').trim();if(!c)return;
 api('rpc/shop_track_order',{method:'POST',body:{p_code:c}}).then(function(d){
  $('tr').innerHTML=d&&d.length?'<div class="ar"><b>وضعیت: '+ST[d[0].status]+'</b><div class="mu">'+new Date(d[0].created_at).toLocaleString('fa-IR')+' · '+pr(d[0].total)+'</div></div>':'<p class="err">سفارشی با این کد پیدا نشد.</p>'}).catch(function(){$('tr').innerHTML='<p class="err">خطا در اتصال.</p>'})}
/* مدیر */
function adminView(){
 $('in').innerHTML='<div class="row"><h3 style="margin:0">⚙️ مدیریت</h3><button class="link" onclick="logout()">خروج</button></div><div class="tabs"><button class="chip'+(tab==='orders'?' on':'')+'" onclick="tab=\'orders\';adminView()">سفارش‌ها</button><button class="chip'+(tab==='products'?' on':'')+'" onclick="tab=\'products\';adminView()">کالاها</button><button class="chip'+(tab==='report'?' on':'')+'" onclick="tab=\'report\';adminView()">گزارش</button></div><div id="ab"><p class="mu">در حال بارگذاری…</p></div>';
 tab==='orders'?ordersView():tab==='products'?productsView():reportView();
 startPoll();
}
function ordersView(){api('shop_orders?select=*&order=created_at.desc&limit=100').then(function(d){O=d||[];
 $('ab').innerHTML=O.length?O.map(function(o,i){return '<div class="ar"><div class="row" style="border:0"><b>'+esc(o.customer_name)+'</b><span class="st">'+ST[o.status]+'</span></div><div class="mu" dir="ltr" style="text-align:right">'+esc(o.tracking_code||'')+'</div><div class="mu">'+esc(o.phone)+' · '+new Date(o.created_at).toLocaleString('fa-IR')+'</div><div class="mu">'+esc(o.address)+'</div>'+
  o.items.map(function(x){return '<div style="font-size:13px">• '+esc(x.name)+' × '+f(x.qty)+'</div>'}).join('')+'<div class="tot" style="padding:6px 0">'+pr(o.total)+'</div>'+
  '<div class="acts"><button onclick="ost('+i+',\'confirmed\')">تأیید</button><button onclick="ost('+i+',\'shipping\')">ارسال شد</button><button onclick="ost('+i+',\'done\')">تحویل شد</button><button onclick="ost('+i+',\'cancelled\')">لغو</button><button onclick="odel('+i+')">حذف</button></div></div>'}).join(''):'<p class="mu">هنوز سفارشی ثبت نشده است.</p>';
 lastNew=O.filter(function(o){return o.status==='new'}).length;badge(lastNew)}).catch(fail)}
function reportView(){api('shop_orders?select=created_at,total,items&status=neq.cancelled&order=created_at.desc&limit=1000').then(function(d){
 d=d||[];var now=Date.now(),day=864e5,s=new Date();s.setHours(0,0,0,0);
 var R=[['امروز',s.getTime()],['۷ روز اخیر',now-7*day],['۳۰ روز اخیر',now-30*day],['کل',0]];
 var h='<div class="g2">'+R.map(function(r){var l=d.filter(function(o){return new Date(o.created_at).getTime()>=r[1]});var t=l.reduce(function(a,o){return a+Number(o.total)},0);return '<div class="ar"><div class="mu">'+r[0]+'</div><b>'+pr(t)+'</b><div class="mu">'+f(l.length)+' سفارش</div></div>'}).join('')+'</div>';
 var m={};d.forEach(function(o){o.items.forEach(function(x){var e=m[x.name]||(m[x.name]={q:0,t:0});e.q+=x.qty;e.t+=x.qty*x.price})});
 var top=Object.keys(m).sort(function(a,b){return m[b].t-m[a].t}).slice(0,5);
 h+='<h4 style="margin:6px 0">پرفروش‌ترین کالاها</h4>'+(top.length?top.map(function(k){return '<div class="row"><span>'+esc(k)+'</span><span class="mu">'+f(m[k].q)+' عدد · '+pr(m[k].t)+'</span></div>'}).join(''):'<p class="mu">هنوز فروشی ثبت نشده است.</p>')+'<p class="mu">سفارش‌های لغوشده در گزارش حساب نمی‌شوند.</p>';
 $('ab').innerHTML=h}).catch(fail)}
function productsView(){var h='<button class="btn gh" onclick="padd()">＋ کالای جدید</button>';
 P.forEach(function(x,i){h+='<div class="ar"><div class="row" style="border:0">'+(x.image_url?'<img class="thumb" src="'+esc(x.image_url)+'" alt="">':'<span style="font-size:34px">'+esc(x.emoji)+'</span>')+'<div style="flex:1"><input type="file" accept="image/*" onchange="upImg('+i+',this)" style="margin:0"><div id="pm'+i+'" class="mu"></div></div></div><div class="g" style="display:grid;grid-template-columns:1fr 1fr;gap:6px"><input id="pn'+i+'" value="'+esc(x.name)+'" placeholder="نام"><input id="pc'+i+'" value="'+esc(x.category)+'" placeholder="دسته"><input id="pp'+i+'" type="number" value="'+x.price+'" placeholder="قیمت (ریال)"><input id="pu'+i+'" value="'+esc(x.unit)+'" placeholder="واحد"><input id="pe'+i+'" value="'+esc(x.emoji)+'" placeholder="ایموجی"><select id="ps'+i+'"><option value="1"'+(x.in_stock?' selected':'')+'>موجود</option><option value="0"'+(x.in_stock?'':' selected')+'>ناموجود</option></select></div>'+
  '<div class="acts"><button onclick="psave('+i+')">ذخیره</button>'+(x.image_url?'<button onclick="rmImg('+i+')">حذف عکس</button>':'')+'<button onclick="pdel('+i+')">حذف کالا</button></div></div>'});
 $('ab').innerHTML=h}
function upImg(i,inp){var fl=inp.files[0];if(!fl)return;var m=$('pm'+i);m.textContent='در حال آپلود…';
 var img=new Image();img.onload=function(){var s=Math.min(1,640/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);
  c.toBlob(function(b){var nm='p'+P[i].id+'-'+Date.now()+'.jpg';
   fetch(SB+'/storage/v1/object/shop-images/'+nm,{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+token,'Content-Type':'image/jpeg'},body:b}).then(function(r){if(!r.ok)throw 0;var u=SB+'/storage/v1/object/public/shop-images/'+nm;
    return api('shop_products?id=eq.'+P[i].id,{method:'PATCH',prefer:'return=minimal',body:{image_url:u}}).then(function(){P[i].image_url=u;draw();productsView()})}).catch(function(){m.textContent='آپلود نشد'})},'image/jpeg',0.82)};
 img.onerror=function(){m.textContent='فایل تصویر نیست'};img.src=URL.createObjectURL(fl)}
function rmImg(i){api('shop_products?id=eq.'+P[i].id,{method:'PATCH',prefer:'return=minimal',body:{image_url:null}}).then(function(){P[i].image_url=null;draw();productsView()}).catch(function(){alert('حذف نشد')})}
/* اعلان سفارش جدید (فقط وقتی برنامه باز است) */
function badge(n){var b=$('admb');if(b)b.innerHTML='⚙️ مدیر'+(n>0?'<span class="bdg">'+f(n)+'</span>':'')}
function beep(){try{var c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator();o.connect(c.destination);o.frequency.value=880;o.start();setTimeout(function(){o.stop();c.close()},350)}catch(e){}}
function chk(){if(!token){clearInterval(pollT);pollT=null;lastNew=-1;badge(0);return}
 api('shop_orders?select=id&status=eq.new').then(function(d){var n=(d||[]).length;badge(n);
  if(lastNew>=0&&n>lastNew){beep();try{if(window.Notification&&Notification.permission==='granted')new Notification('سفارش جدید در برق‌یار')}catch(e){}if(mode==='admin'&&tab==='orders')ordersView()}
  lastNew=n}).catch(function(){})}
function startPoll(){try{if(window.Notification&&Notification.permission==='default')Notification.requestPermission()}catch(e){}if(pollT)return;chk();pollT=setInterval(chk,30000)}
load();

/* ---- نصب PWA ---- */
var dip=null;
function isStd(){return (window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true}
function hideInst(){if($('inst'))$('inst').style.display='none'}
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();dip=e;if(!isStd()&&$('inst'))$('inst').style.display=''});
window.addEventListener('appinstalled',function(){dip=null;hideInst()});
function installApp(){
 if(dip){dip.prompt();dip.userChoice.then(function(c){dip=null;if(c&&c.outcome==='accepted')hideInst()}).catch(function(){});return}
 var ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
 show('install');
 $('in').innerHTML='<h3 style="margin:0 0 8px">نصب برق‌یار روی گوشی</h3>'+(ios
  ?'<p>در Safari: دکمهٔ <b>اشتراک‌گذاری</b> (مربع با فلش) را بزنید، سپس <b>Add to Home Screen</b> (افزودن به صفحهٔ اصلی) را انتخاب کنید.</p>'
  :'<p>در Chrome: منوی <b>⋮</b> بالای صفحه را بزنید و <b>Install app</b> (نصب برنامه) یا <b>Add to Home screen</b> را انتخاب کنید.</p><p class="mu">اگر این گزینه را نمی‌بینید، صفحه را یک‌بار تازه کنید و چند ثانیه صبر کنید.</p>')+
  '<button class="btn" onclick="closeSh()">متوجه شدم</button>';
}
if(!isStd()&&$('inst'))$('inst').style.display='';
