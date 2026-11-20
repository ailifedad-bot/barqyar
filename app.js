var SB='https://zgswoheckqasqoclhodg.supabase.co',KEY='sb_publishable_Gs5TQ0bdmhNvboT6_1gU3Q_mzmnv2Ny';
var WA='989366428816',TG='makekzir',MAIL='makealmatykz@gmail.com',APP_URL='https://ailifedad-bot.github.io/barqyar/';
function returnAppUrl(c){return APP_URL+(c?'?track='+encodeURIComponent(c):'')+'#homeConfirm'}
var P=[],cat='همه',cart={},saved=false,mode='',token=null,managerAccess=false,tab='orders',O=[];
function $(i){return document.getElementById(i)}
function f(n){return Number(n||0).toLocaleString('fa-IR')}
function pr(n){return f(n)+' تومان'}
function en(n){return Number(n).toLocaleString('en-US')+' تومان'}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function val(i){var e=$(i);return e?e.value:''}
function api(path,o){o=o||{};var h={apikey:KEY,Authorization:'Bearer '+(token||KEY),'Content-Type':'application/json'};if(o.prefer)h.Prefer=o.prefer;
 return fetch(SB+'/rest/v1/'+path,{method:o.method||'GET',headers:h,body:o.body?JSON.stringify(o.body):undefined,keepalive:!!o.keep}).then(function(r){if(!r.ok)return r.text().then(function(t){throw new Error(t||r.status)});return r.status===204?null:r.text().then(function(t){return t?JSON.parse(t):null})})}
function load(){refreshProducts()}
function refreshProducts(){if(managerAccess)return;api('shop_products?select=*&order=id').then(function(d){P=d||[];draw();if(mode==='cart')cartView()}).catch(function(){if(!$('grid').innerHTML||$('grid').innerHTML.indexOf('در حال بارگذاری')>-1)$('grid').innerHTML='<p class="err" style="grid-column:1/-1;text-align:center">بارگذاری کالاها ناموفق بود. صفحه را دوباره باز کنید.</p>'})}
var productChannel=null,productRealtimeClient=null;
function startProductRealtime(){
 if(productChannel||!window.supabase||!window.supabase.createClient)return;
 try{
  productRealtimeClient=window.supabase.createClient(SB,KEY);
  productChannel=productRealtimeClient.channel('barqyar-products-live')
   .on('postgres_changes',{event:'*',schema:'public',table:'shop_products'},function(){refreshProducts()})
   .subscribe(function(status){if(status==='SUBSCRIBED')console.log('Barqyar live product updates connected')});
 }catch(e){console.warn('Realtime connection unavailable',e)}
}
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')refreshProducts()});
window.addEventListener('online',function(){refreshProducts()});
function cats(){return ['همه'].concat(P.map(function(x){return x.category}).filter(function(v,i,a){return v&&a.indexOf(v)===i}))}
function chg(id,d){cart[id]=Math.max(0,(cart[id]||0)+d);if(!cart[id])delete cart[id];saved=false;draw();if(mode==='cart')cartView()}
function show(m){mode=m;$('sh').className='sheet o'}
var orderPdfUrl=null;
function closeSh(){if(orderPdfUrl){URL.revokeObjectURL(orderPdfUrl);orderPdfUrl=null}$('sh').className='sheet';mode=''}
function lines(){var t=0,n=0,a=[];P.forEach(function(x){var q=cart[x.id];if(!q)return;t+=q*x.price;n+=q;a.push({product_id:x.id,name:x.name,unit:x.unit,qty:q,price:x.price})});return {a:a,t:t,n:n}}
function openCart(){show('cart');cartView()}
function cartView(){
 var L=lines(),h='';
 if(!L.n){$('in').innerHTML='<p style="text-align:center">سبد خرید خالی است</p><button class="btn" onclick="closeSh()">بستن</button>';return}
 L.a.forEach(function(i){var x=P.filter(function(p){return p.name===i.name})[0];h+='<div class="row"><div><b>'+esc(i.name)+'</b><br><small class="mu">'+pr(i.price)+' × '+f(i.qty)+'</small></div><div class="qty"><button onclick="chg('+x.id+',1)">+</button><b>'+f(i.qty)+'</b><button onclick="chg('+x.id+',-1)">−</button></div></div>'});
 var nm=val('nm'),ph=val('ph'),ad=val('ad');
 $('in').innerHTML='<h3 style="margin:0 0 6px">سبد خرید</h3>'+h+'<div class="tot">جمع کل: '+pr(L.t)+'</div>'+
 '<input id="nm" placeholder="نام و نام خانوادگی" value="'+esc(nm)+'"><input id="ph" type="tel" placeholder="شماره موبایل مشتری (برای پیگیری و تأیید دریافت)" value="'+esc(ph)+'"><textarea id="ad" rows="2" placeholder="آدرس تحویل">'+esc(ad)+'</textarea>'+
 '<div class="cfbox" style="margin:10px 0"><b>راهنمای مشتری</b><p class="mu" style="margin:6px 0">۱) اطلاعات تماس و نشانی را دقیق وارد کنید. ۲) پیام سفارش را در واتس‌اپ یا ایمیل ارسال کنید. ۳) کد پیگیری را نگه دارید. ۴) پس از تحویل واقعی کالا، از بخش پیگیری سفارش دریافت را تأیید کنید. ۵) تأیید نهایی مدیر پس از تأیید شما ثبت می‌شود.</p></div><p id="er" class="err"></p><div id="orderReceipt" class="cfbox" style="display:none;margin:10px 0"></div><p class="mu">روش ارسال سفارش:</p>'+
 '<a class="btn wa" target="_blank" rel="noopener" href="#" onclick="return go(this,\'wa\')">واتس‌اپ</a>'+
 '<a class="btn tg" target="_blank" rel="noopener" href="https://t.me/'+TG+'" onclick="return go(this,\'tg\')">تلگرام (@'+TG+')</a>'+
 '<form method="POST" action="https://formsubmit.co/'+MAIL+'" target="_blank" onsubmit="return go(this,\'mail\')">'+
 '<input type="hidden" name="_subject" value="سفارش جدید برق‌یار"><input type="hidden" name="_captcha" value="false"><input type="hidden" name="_template" value="table"><input type="hidden" name="_next" id="f_next"><input type="hidden" name="return_link" id="f_return">'+
 '<input type="hidden" name="name" id="f_n"><input type="hidden" name="phone" id="f_p"><input type="hidden" name="address" id="f_a"><input type="hidden" name="order" id="f_o">'+
 '<button class="btn gh" type="submit">ایمیل</button></form>';
}
function openContact(){show('contact');
 $('in').innerHTML='<h3 style="margin:0 0 6px">تماس با ما</h3><a class="btn gh" href="tel:09366428816">📞 تماس تلفنی: ۰۹۳۶۶۴۲۸۸۱۶</a><a class="btn wa" target="_blank" rel="noopener" href="https://wa.me/'+WA+'">واتس‌اپ</a><a class="btn tg" target="_blank" rel="noopener" href="https://t.me/'+TG+'">تلگرام (@'+TG+')</a>'+
 '<h4 style="margin:16px 0 6px">ارسال پیام</h4><form method="POST" action="https://formsubmit.co/'+MAIL+'" target="_blank">'+
 '<input type="hidden" name="_subject" value="پیام جدید از برق‌یار"><input type="hidden" name="_captcha" value="false"><input type="hidden" name="_template" value="table"><input type="hidden" name="_next" value="'+esc(returnAppUrl(''))+'"><input type="hidden" name="return_link" value="'+esc(returnAppUrl(''))+'">'+
 '<input name="name" placeholder="نام" required><input name="phone" type="tel" placeholder="شماره موبایل مشتری (برای پیگیری و تأیید دریافت)" required><textarea name="message" rows="3" placeholder="پیام شما" required></textarea><button class="btn" type="submit">ارسال پیام</button><p class="mu">پس از ارسال پیام، با لینک بازگشت به برنامه برق‌یار برمی‌گردید.</p></form>';
}
/* ---------- مدیر ---------- */
function openAdmin(){show('admin');token&&managerAccess?adminView():loginView()}
function loginView(m){$('in').innerHTML='<h3 style="margin:0 0 8px">ورود مدیر</h3><input id="em" type="email" placeholder="ایمیل" dir="ltr"><input id="pw" type="password" placeholder="رمز عبور" dir="ltr"><button class="btn" onclick="login()">ورود</button><p class="err">'+(m||'')+'</p>'}
function login(){
 fetch(SB+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({email:val('em').trim(),password:val('pw')})})
 .then(function(r){return r.json()}).then(function(d){if(!d.access_token)return loginView('ایمیل یا رمز عبور اشتباه است.');token=d.access_token;api('rpc/shop_is_admin').then(function(ok){if(ok===true){managerAccess=true;adminView()}else{token=null;managerAccess=false;loginView('این حساب در فهرست مدیران مجاز برق‌یار نیست.')}}).catch(function(){token=null;managerAccess=false;loginView('تأیید دسترسی مدیر انجام نشد. دوباره تلاش کنید.')})}).catch(function(){loginView('خطا در اتصال.')})
}
function logout(){token=null;managerAccess=false;closeSh()}
function fail(e){$('ab').innerHTML='<p class="err">دسترسی ندارید یا خطایی رخ داد. با ایمیل مدیر وارد شوید.</p>'}

function ost(i,s){api('rpc/shop_admin_set_order_status',{method:'POST',body:{p_order_id:O[i].id,p_status:s}}).then(ordersView).catch(function(e){alert(errMsg(e)||'انجام نشد')})}
function odel(i){rptArchive(i)}
function psave(i){var b={name:val('pn'+i).trim(),category:val('pc'+i).trim(),price:Number(val('pp'+i))||0,unit:val('pu'+i).trim()||'عدد',emoji:val('pe'+i)||'🔌',in_stock:val('ps'+i)==='1'};
 if(!b.name||!b.category)return alert('نام و دسته را وارد کنید.');
 api('shop_products?id=eq.'+P[i].id,{method:'PATCH',prefer:'return=minimal',body:b}).then(function(){Object.assign(P[i],b);draw();alert('ذخیره شد')}).catch(function(){alert('ذخیره نشد')})}
function pdel(i){if(confirm('این کالا حذف شود؟'))api('shop_products?id=eq.'+P[i].id,{method:'DELETE'}).then(function(){P.splice(i,1);draw();productsView()}).catch(function(){alert('حذف نشد')})}
function padd(){api('shop_products',{method:'POST',prefer:'return=representation',body:{name:'کالای جدید',category:'متفرقه',unit:'عدد',price:0,stock_qty:0,emoji:'🔌',in_stock:false}}).then(function(d){P.unshift(d[0]);draw();productsView()}).catch(function(){alert('افزودن نشد')})}


/* ---- جدول مادر کالا: بروزرسانی اختصاصی مدیر ---- */
function masterView(){
 $('ab').innerHTML='<div class="ar"><b>جدول مادر موجودی و قیمت کالاها</b><p class="mu">این جدول منبع اصلی اطلاعات کالاهاست. جستجو با کد یکتای کالا انجام می‌شود. برای کالاهای قدیمی، موجودی ثبت‌نشده خالی نمایش داده می‌شود و به‌صورت خودکار صفر فرض نمی‌شود.</p><input id="mcode" dir="ltr" placeholder="کد یکتای کالا، مانند BYK-000001"><button class="btn" onclick="masterFind()">جستجوی کالا</button><div id="mresult"></div></div><div id="masterlist" class="ar"><p class="mu">در حال دریافت فهرست کالاها…</p></div>';
 api('shop_products?select=*&order=id').then(function(d){P=d||[];draw();masterListView()}).catch(fail);
}
function masterListView(){
 var h='<b>جدول ویرایش مستقیم قیمت و موجودی</b><p class="mu">قیمت و موجودی را در ردیف همان کد تغییر دهید و ذخیره کنید. تغییرات برای کاربران به‌صورت خودکار ارسال می‌شود.</p>';
 h+=P.map(function(x){
  return '<div class="ar"><div class="row" style="border:0"><b>'+esc(x.name)+'</b><b dir="ltr">'+esc(x.sku||'بدون کد')+'</b></div>'+
   '<div class="g"><label class="mu">موجودی ('+esc(x.unit||'عدد')+')<input id="mq_'+x.id+'" type="number" min="0" step="1" value="'+(x.stock_qty===null||x.stock_qty===undefined?'':Number(x.stock_qty))+'" placeholder="ثبت نشده"></label>'+
   '<label class="mu">قیمت واحد (تومان)<input id="mp_'+x.id+'" type="number" min="0" step="1" value="'+Number(x.price||0)+'"></label></div>'+
   '<button class="btn" onclick="masterSaveInline(\''+esc(x.sku||'')+'\','+x.id+')">ذخیره این کالا</button></div>';
 }).join('');
 $('masterlist').innerHTML=h;
}
function masterSaveInline(code,id){
 var raw=val('mq_'+id).trim(),priceRaw=val('mp_'+id).trim(),price=Number(priceRaw),body={price:price};
 if(!code){alert('کد یکتای کالا موجود نیست.');return}
 if(priceRaw===''||!Number.isFinite(price)||price<0){alert('قیمت معتبر و نامنفی وارد کنید.');return}
 if(raw!==''){
  var qty=Number(raw);
  if(!Number.isFinite(qty)||qty<0||!Number.isInteger(qty)){alert('موجودی باید عدد صحیح و نامنفی باشد.');return}
  body.stock_qty=qty;body.in_stock=qty>0;
 }
 api('shop_products?sku=eq.'+encodeURIComponent(code),{method:'PATCH',prefer:'return=representation',body:body}).then(function(d){
  if(!d||!d.length)throw new Error('هیچ کالایی بروزرسانی نشد');
  var x=P.filter(function(p){return p.id===id})[0];if(x)Object.assign(x,body);
  draw();masterListView();alert('اطلاعات '+code+' ذخیره شد و برای کاربران به‌روزرسانی می‌شود.');
 }).catch(function(e){alert('ذخیره انجام نشد. دسترسی مدیر یا اتصال Supabase را بررسی کنید. '+errMsg(e))});
}
function masterFind(){
 var c=val('mcode').trim().toUpperCase();
 if(!c){$('mresult').innerHTML='<p class="err">کد یکتای کالا را وارد کنید.</p>';return}
 var x=P.filter(function(p){return String(p.sku||'').toUpperCase()===c})[0];
 if(!x){$('mresult').innerHTML='<p class="err">کالایی با این کد پیدا نشد. فهرست کدها را بررسی کنید.</p>';return}
 $('mresult').innerHTML='<div class="ar"><b>'+esc(x.name)+'</b><div class="mu">کد یکتا: <span dir="ltr">'+esc(x.sku)+'</span> · '+esc(x.category||'')+'</div><label>موجودی ('+esc(x.unit||'عدد')+')</label><input id="mqty" type="number" min="0" step="1" value="'+(x.stock_qty===null||x.stock_qty===undefined?'':Number(x.stock_qty))+'" placeholder="در صورت ثبت موجودی، تعداد را وارد کنید"><label>قیمت واحد (تومان)</label><input id="mprice" type="number" min="0" step="1" value="'+Number(x.price||0)+'"><p class="mu">اگر موجودی را خالی بگذارید، فقط قیمت بروزرسانی می‌شود.</p><button class="btn" onclick="masterSave(\''+esc(x.sku)+'\')">ذخیره تغییرات</button></div>';
}
function masterSave(code){
 var raw=val('mqty').trim(),priceRaw=val('mprice').trim(),price=Number(priceRaw),body={price:price};
 if(priceRaw===''||!Number.isFinite(price)||price<0){alert('قیمت معتبر و نامنفی وارد کنید.');return}
 if(raw!==''){
  var qty=Number(raw);
  if(!Number.isFinite(qty)||qty<0||!Number.isInteger(qty)){alert('موجودی باید عدد صحیح و نامنفی باشد.');return}
  body.stock_qty=qty;body.in_stock=qty>0;
 }
 api('shop_products?sku=eq.'+encodeURIComponent(code),{method:'PATCH',prefer:'return=representation',body:body}).then(function(d){
  if(!d||!d.length)throw new Error('هیچ کالایی بروزرسانی نشد');
  var x=P.filter(function(p){return p.sku===code})[0];if(x)Object.assign(x,body);
  draw();masterListView();masterFind();alert('قیمت و اطلاعات موجودی کالا با موفقیت ذخیره شد.');
 }).catch(function(e){alert('ذخیره انجام نشد. دسترسی مدیر یا اتصال Supabase را بررسی کنید. '+errMsg(e))});
}

/* ---- بهبودها: عکس کالا، کد پیگیری، گزارش، اعلان ---- */
var productPollT=null;
var ST={shipping:'ارسال‌شده؛ در انتظار تأیید دریافت',done:'تحویل نهایی‌شده',cancelled:'لغوشده'};
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
  var stockText=(x.stock_qty===null||x.stock_qty===undefined)?'موجودی: ثبت نشده':'موجودی: '+f(x.stock_qty)+' '+esc(x.unit||'عدد');
  return '<div class="p">'+ic+'<b>'+esc(x.name)+'</b><small>'+esc(x.category)+' · '+esc(x.unit)+'</small><small class="mu">'+stockText+'</small><div class="pr">قیمت: '+pr(x.price)+'</div>'+b+'</div>'
 }).join(''):'<p class="mu" style="grid-column:1/-1;text-align:center">کالایی پیدا نشد</p>';
 var L=lines();$('bar').className='bar'+(L.n?'':' h');$('bn').textContent='مشاهده سبد ('+f(L.n)+' کالا)';$('bt').textContent=pr(L.t);
}
function orderText(){var L=lines(),p=toEn(val('ph').trim()).replace(/\D/g,'').slice(-4),back=returnAppUrl(code);return 'سفارش جدید از برق‌یار\nکد پیگیری: '+code+'\nچهار رقم آخر شماره موبایلی که مشتری هنگام ثبت سفارش وارد کرده: '+p+'\n'+L.a.map(function(i){return '• '+i.name+' × '+i.qty+' ('+i.unit+') = '+en(i.qty*i.price)}).join('\n')+'\nجمع کل: '+en(L.t)+'\nنام: '+val('nm')+'\nتلفن: '+val('ph')+'\nآدرس: '+val('ad')+'\n\nبرای بازگشت به برنامه برق‌یار و پیگیری همین سفارش، این لینک را باز کنید:\n'+back}
function showOrderReceipt(){
 var phone=toEn(val('ph').trim()).replace(/\D/g,'');
 var last4=phone.slice(-4);TR=code;
 if($('homeTrackCode'))$('homeTrackCode').value=code;
 if($('homePhone4'))$('homePhone4').value=last4;
 var r=$('orderReceipt');
 if(r){r.style.display='block';r.innerHTML='<b>✅ سفارش شما آماده ارسال در واتس‌اپ است</b><p class="mu" style="margin:6px 0">اطلاعات پیگیری همین سفارش به‌صورت خودکار آماده شد:</p><div>کد پیگیری: <b dir="ltr">'+esc(code)+'</b></div><div>چهار رقم آخر شماره موبایل ثبت‌شده برای همین سفارش: <b dir="ltr">'+esc(last4)+'</b></div><button type="button" class="btn gh" onclick="openTrackForCurrentOrder()">پیگیری همین سفارش</button><button type="button" class="btn gh" onclick="copyTrackInfo()">کپی اطلاعات پیگیری</button>'}
 var hc=$('homeConfirm');if(hc)hc.scrollIntoView({behavior:'smooth',block:'nearest'});
 try{sessionStorage.setItem('barqyar_last_order',JSON.stringify({code:code,phone4:last4}))}catch(e){}
}
function openTrackForCurrentOrder(){
 var c=val('homeTrackCode').trim();if(!c)return;
 openTrack();
 setTimeout(function(){if($('tc')){$('tc').value=c;doTrack()}},450);
}
function go(el,k){
 if(!val('nm').trim()||!val('ph').trim()||!val('ad').trim()){$('er').textContent='لطفاً نام، شماره تماس و آدرس را کامل کنید.';return false}
 var L=lines();
 if(!saved){saved=true;code=genCode();api('shop_orders',{method:'POST',prefer:'return=minimal',keep:1,body:{customer_name:val('nm').trim(),phone:toEn(val('ph').trim()),address:val('ad').trim(),items:L.a,total:L.t,tracking_code:code,status:'shipping'}}).catch(function(e){saved=false;var m=errMsg(e),r=$('er');if(r){r.className='err';r.textContent='سفارش از طریق پیام ارسال شد، ولی در سامانه ثبت نشد'+(m?': '+m:'')+'. اپراتور از روی پیام پیگیری می‌کند.'}})}
 var t=orderText();
 showOrderReceipt();
 $('er').className='okc';$('er').textContent='سفارش آماده ارسال شد. کد پیگیری و چهار رقم آخر همان شماره موبایلی که در فرم همین سفارش وارد کردید، در این صفحه نمایش داده شده است.';
 if(k==='wa'){el.href='https://wa.me/'+WA+'?text='+encodeURIComponent(t)}
 else if(k==='tg'){try{navigator.clipboard.writeText(t)}catch(e){}$('er').textContent+=' — متن سفارش کپی شد؛ در تلگرام Paste و ارسال کنید.'}
 else{$('f_n').value=val('nm');$('f_p').value=val('ph');$('f_a').value=val('ad');$('f_o').value=t;$('f_next').value=returnAppUrl(code);$('f_return').value=returnAppUrl(code)}
 return true;
}
function openTrack(){show('track');var hc=val('homeTrackCode').trim();$('in').innerHTML='<h3 style="margin:0 0 8px">پیگیری سفارش</h3><input id="tc" placeholder="کد پیگیری (مثلاً BY-AB12CD)" dir="ltr" autocomplete="off" value="'+esc(hc)+'"><button class="btn" onclick="doTrack()">پیگیری</button><div id="tr" style="margin-top:10px"></div>'}
function copyTrackInfo(){var c=TR||'',p=val('tp4')||val('homePhone4');var t='کد پیگیری: '+c+'\nچهار رقم آخر شماره موبایل ثبت‌شده برای همین سفارش: '+p;if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){alert('کد پیگیری و چهار رقم آخر تلفن کپی شد.')}).catch(function(){alert('کپی خودکار انجام نشد؛ اطلاعات در همین صفحه نمایش داده می‌شود.')})}else{alert(t)}}
function doTrack(){var c=val('tc').trim().toUpperCase();if(!c)return;
 $('tr').innerHTML='<p class="mu">در حال دریافت اطلاعات سفارش…</p>';
 api('rpc/shop_track_order_details',{method:'POST',body:{p_code:c}}).then(function(d){
  if(!d||!d.length){$('tr').innerHTML='<p class="err">سفارشی با این کد پیدا نشد.</p>';return}
  var o=d[0],phone4=String(o.phone4||'');TR=o.tracking_code||c;
  if($('homeTrackCode'))$('homeTrackCode').value=TR;
  if($('homePhone4'))$('homePhone4').value=phone4;
  var h='<div class="ar"><b>وضعیت: '+ST[o.status]+'</b><div class="mu">'+new Date(o.created_at).toLocaleString('fa-IR')+' · '+pr(o.total)+'</div></div>';
  h+='<div class="cfbox"><b>اطلاعات تأیید همین سفارش</b><p class="mu" style="margin:6px 0">کد پیگیری و چهار رقم آخر شماره موبایلی که هنگام ثبت همین سفارش وارد کرده‌اید، به‌صورت خودکار نمایش داده شد.</p><div class="mu">کد پیگیری</div><b dir="ltr">'+esc(TR)+'</b><div class="mu" style="margin-top:8px">چهار رقم آخر شماره موبایلی که هنگام ثبت همین سفارش وارد کرده‌اید</div><input id="tp4" type="tel" inputmode="numeric" maxlength="4" value="'+esc(phone4)+'" placeholder="در اطلاعات سفارش ثبت نشده" dir="ltr"><button class="btn gh" onclick="copyTrackInfo()">کپی کد و چهار رقم آخر</button></div>';
  if(o.customer_confirmed_at)h+='<div class="cfok">✅ شما دریافت کالا را تأیید کرده‌اید<br><small>'+new Date(o.customer_confirmed_at).toLocaleString('fa-IR')+'</small></div><div class="cfbox"><b>ارسال تأیید دریافت به مدیر</b><p class="mu">کد یکتای همین سفارش به‌صورت خودکار در پیام مدیر قرار گرفته است. برای ارسال، دکمه زیر را بزنید.</p><label class="mu" for="managerOrderCode">کادر کد یکتای سفارش</label><input id="managerOrderCode" dir="ltr" readonly value="'+esc(TR)+'"><a class="btn wa" target="_blank" rel="noopener" href="'+managerConfirmLink(TR)+'">ارسال پیام تأیید به مدیر در واتساپ</a></div>';
  else if(o.status==='shipping'||o.status==='done')h+='<div class="cfbox"><div style="font-weight:700;margin-bottom:6px">کالای سفارش را دریافت کرده‌اید؟</div><button class="cfbtn" onclick="custConfirm()">✅ تأیید نهایی دریافت کالا</button><p id="tm" class="err"></p></div>';
  else h+='<p class="mu">فرم تأیید دریافت پس از ارسال سفارش فعال می‌شود.</p>';
  if(o.delivered_at)h+='<div class="dlok">📦 تحویل نهایی توسط مدیر ثبت شد<br><small>'+new Date(o.delivered_at).toLocaleString('fa-IR')+'</small></div>';
  $('tr').innerHTML=h}).catch(function(){$('tr').innerHTML='<p class="err">خطا در اتصال به سامانه پیگیری سفارش.</p>'})}
/* مدیر */
function adminView(){
 if(!token||!managerAccess){loginView('برای ورود به مدیریت، حساب مدیر مجاز لازم است.');return}
 $('in').innerHTML='<div class="row"><h3 style="margin:0">⚙️ مدیریت</h3><button class="link" onclick="logout()">خروج</button></div><div class="tabs"><button class="chip'+(tab==='orders'?' on':'')+'" onclick="tab=\'orders\';adminView()">سفارش‌ها</button><button class="chip'+(tab==='products'?' on':'')+'" onclick="tab=\'products\';adminView()">کالاها</button><button class="chip'+(tab==='master'?' on':'')+'" onclick="tab=\'master\';adminView()">جدول مادر قیمت و موجودی</button><button class="chip'+(tab==='report'?' on':'')+'" onclick="tab=\'report\';adminView()">گزارش</button></div>'+(tab==='report'?'<button class="btn dl" onclick="docFinal()">📄 گزارش نهایی بایگانی (چاپ / ذخیره PDF)</button>':'')+'<div id="ab"><p class="mu">در حال بارگذاری…</p></div>';
 tab==='orders'?ordersView():tab==='products'?productsView():tab==='master'?masterView():reportView();
 startPoll();
}

function ordersView(){
 api('shop_orders?select=*&report_archived_at=is.null&order=created_at.desc&limit=100').then(function(d){
  O=d||[];
  $('ab').innerHTML=O.length?O.map(function(o,i){
   var a='';
   if(o.status==='shipping'&&o.customer_confirmed_at)
    a+='<div class="cfbox" style="width:100%"><b>مشتری دریافت همین سفارش را تأیید کرده است.</b><label class="mu" for="odcode_'+i+'">کد یکتای سفارش</label><input id="odcode_'+i+'" dir="ltr" value="'+esc(o.tracking_code||'')+'" placeholder="کد یکتای سفارش" autocomplete="off"><button class="dlbtn" onclick="odeliver('+i+')">ثبت تحویل نهایی توسط مدیر</button></div>';
   if(o.status==='done')a+='<span class="tag c">✔ تحویل نهایی ثبت شده</span>';
   if(o.status!=='done'&&o.status!=='cancelled')a+='<button onclick="ost('+i+',\'cancelled\')">لغو سفارش</button>';
   return '<div class="ar">'+
    '<div class="row" style="border:0"><b>'+esc(o.customer_name)+'</b><span class="st">'+esc(ST[o.status]||o.status||'نامشخص')+'</span></div>'+
    '<div class="mu" style="margin:4px 0">'+(o.status==='shipping'?(o.customer_confirmed_at?'اقدام بعدی: بررسی کد و ثبت تحویل نهایی توسط مدیر':'سفارش ارسال شده؛ منتظر تأیید دریافت مشتری'):(o.status==='done'?'سفارش تکمیل شده':'سفارش لغو شده'))+'</div>'+
    '<div class="mu" dir="ltr" style="text-align:right">'+esc(o.tracking_code||'')+'</div><div class="mu">'+esc(o.phone||'')+' · '+dt(o.created_at)+'</div><div class="mu">'+esc(o.address||'')+'</div>'+
    (Array.isArray(o.items)?o.items:[]).map(function(x){return '<div style="font-size:13px">• '+esc(x.name)+' × '+f(x.qty)+(x.unit?' '+esc(x.unit):'')+(x.price?' · '+pr(x.price*x.qty):'')+'</div>'}).join('')+
    '<div class="tot" style="padding:6px 0">'+pr(o.total)+'</div>'+
    (o.customer_confirmed_at?'<span class="tag c">✔ تأیید مشتری · '+dt(o.customer_confirmed_at)+'</span>':'<span class="tag">در انتظار تأیید مشتری</span>')+
    (o.delivered_at?'<span class="tag d">✔ تأیید نهایی مدیر · '+dt(o.delivered_at)+'</span>':'')+
    '<div class="acts"><button class="dlbtn" onclick="docOrder('+i+')">📄 مشاهده گزارش سفارش (PDF)</button>'+a+'</div></div>';
  }).join(''):'<p class="mu">هنوز سفارشی ثبت نشده است.</p>';
  lastNew=O.filter(function(o){return o.status==='shipping'&&!o.customer_confirmed_at}).length;
  badge(lastNew);
 }).catch(fail)
}
function reportView(){
 api('shop_orders?select=*&status=neq.cancelled&report_archived_at=is.null&order=created_at.desc&limit=1000').then(function(d){
  d=d||[];O=d;
  var done=d.filter(function(o){return o.status==='done'&&!!o.customer_confirmed_at&&!!o.delivered_at&&o.delivery_verified===true});
  var waitCustomer=d.filter(function(o){return o.status==='shipping'&&!o.customer_confirmed_at&&!o.delivered_at&&!o.delivery_verified});
  var waitManager=d.filter(function(o){return o.status==='shipping'&&!!o.customer_confirmed_at&&!o.delivered_at&&!o.delivery_verified});
  var review=d.filter(function(o){return done.indexOf(o)<0&&waitCustomer.indexOf(o)<0&&waitManager.indexOf(o)<0});
  var now=Date.now(),day=864e5,s=new Date();s.setHours(0,0,0,0);
  var R=[['امروز',s.getTime()],['۷ روز اخیر',now-7*day],['۳۰ روز اخیر',now-30*day],['کل',0]];
  var h='<div class="rpt-intro"><b>گزارش وضعیت سفارش‌ها</b><p>هر سفارش بر اساس وضعیت ثبت‌شده در پایگاه داده در یکی از گروه‌های زیر قرار می‌گیرد. وضعیت‌ها با به‌روزرسانی اطلاعات سفارش تغییر می‌کنند.</p></div>';
  h+='<div class="rpt-summary">'+[
   ['rpt-green','تکمیل‌شده',done.length,'تأیید مشتری و ثبت نهایی مدیر'],
   ['rpt-amber','در انتظار تأیید مشتری',waitCustomer.length,'ارسال شده؛ دریافت مشتری هنوز ثبت نشده'],
   ['rpt-purple','در انتظار تأیید مدیر',waitManager.length,'تأیید مشتری ثبت شده؛ مدیر باید نهایی کند']
  ].map(function(x){return '<div class="rpt-count-card '+x[0]+'"><b>'+x[1]+'</b><strong>'+f(x[2])+'</strong><small>'+x[3]+'</small></div>'}).join('')+'</div>';
  function orderCard(o,kind){
   var i=O.indexOf(o),items=Array.isArray(o.items)?o.items:[];
   var action='';
   if(kind==='done')action='<div class="rpt-action">اقدام لازم: سفارش تکمیل شده است. برای بایگانی، سند تحویل را چاپ یا به PDF ذخیره کنید.</div><button class="rpt-btn rpt-btn-green" onclick="docOrder('+i+')">📄 سند تحویل همین سفارش</button>';
   if(kind==='customer')action='<div class="rpt-action">اقدام مدیر: فعلاً تأیید نهایی نکنید. با مشتری پیگیری کنید تا پس از دریافت واقعی کالا، از لینک پیگیری سفارش دریافت را تأیید کند.</div>';
   if(kind==='manager')action='<div class="rpt-action">اقدام لازم: کد یکتای همین سفارش را بررسی کنید و پس از تطبیق، تأیید نهایی مدیر را ثبت کنید.</div><label class="rpt-label" for="odcode_'+i+'">کد یکتای همین سفارش</label><input class="rpt-code" id="odcode_'+i+'" dir="ltr" autocomplete="off" value="'+esc(o.tracking_code||'')+'"><button class="rpt-btn rpt-btn-purple" onclick="odeliver('+i+')">تأیید نهایی توسط مدیر</button>';
   if(kind==='review')action=o.status==='done'?'<div class="rpt-warning">این سفارش در جدول با وضعیت «تحویل‌شده» ثبت شده، اما حداقل یکی از مدارک تأیید مشتری یا تأیید نهایی مدیر ناقص است. بنابراین در شمار تکمیل‌شده‌ها قرار نمی‌گیرد. مدیر باید سوابق را بررسی کند؛ اطلاعات قبلی به‌صورت خودکار تغییر داده نشده است.</div>':'<div class="rpt-action">اقدام لازم: وضعیت این سفارش با مراحل استاندارد همخوان نیست. پیش از هر تأیید، جزئیات آن را در بخش سفارش‌ها بررسی کنید.</div>';
   var history=(o.customer_confirmed_at?'<span class="tag c">✔ تأیید مشتری · '+dt(o.customer_confirmed_at)+'</span>':'')+(o.delivered_at?'<span class="tag d">✔ تأیید نهایی مدیر · '+dt(o.delivered_at)+'</span>':'');
   if(kind==='done'&&!o.delivered_at)history+='<div class="rpt-warning">نکته سوابق: وضعیت سفارش «تکمیل‌شده» است، اما زمان تحویل نهایی در رکورد ثبت نشده است. وضعیت سفارش تغییر داده نشده؛ این مورد را برای تکمیل سوابق بررسی کنید.</div>';
   return '<article class="rpt-order"><div class="rpt-order-head"><b>'+esc(o.customer_name||'مشتری')+'</b><span class="st">'+esc(ST[o.status]||o.status||'نامشخص')+'</span></div><div class="rpt-meta">کد یکتا: <b dir="ltr">'+esc(o.tracking_code||'ثبت نشده')+'</b></div><div class="rpt-meta">'+esc(o.phone||'')+' · '+dt(o.created_at)+'</div><div class="rpt-meta">'+esc(o.address||'')+'</div>'+items.map(function(x){return '<div class="rpt-item">• '+esc(x.name)+' × '+f(x.qty)+(x.unit?' '+esc(x.unit):'')+(x.price?' · '+pr(Number(x.qty||0)*Number(x.price||0)):'')+'</div>'}).join('')+'<div class="rpt-total">مبلغ سفارش: '+pr(o.total)+'</div>'+(history?'<div class="rpt-history">'+history+'</div>':'')+action+'<div class="acts"><button type="button" onclick="rptEditOpen('+i+')">✏️ ویرایش گزارش</button><button type="button" onclick="rptArchive('+i+')">🗑️ حذف گزارش</button></div><div id="rptedit_'+i+'" class="ar" style="display:none;margin-top:8px"><b>ویرایش اطلاعات گزارش</b><label class="rpt-label" for="rpt_name_'+i+'">نام مشتری</label><input id="rpt_name_'+i+'" maxlength="120" value="'+esc(o.customer_name||'')+'"><label class="rpt-label" for="rpt_phone_'+i+'">شماره تماس</label><input id="rpt_phone_'+i+'" type="tel" maxlength="30" dir="ltr" value="'+esc(o.phone||'')+'"><label class="rpt-label" for="rpt_address_'+i+'">نشانی</label><textarea id="rpt_address_'+i+'" rows="2" maxlength="500">'+esc(o.address||'')+'</textarea><button type="button" class="btn" onclick="rptSaveEdit('+i+')">ذخیره اصلاحات</button><button type="button" class="btn gh" onclick="rptEditClose('+i+')">انصراف</button><p class="mu">کالاها، مبلغ، وضعیت و سوابق تأیید برای جلوگیری از مغایرت مالی و موجودی در این فرم تغییر نمی‌کنند.</p></div></article>';
  }
  function group(title,desc,cls,arr,kind){
   return '<section class="rpt-group '+cls+'"><div class="rpt-group-head"><div><b>'+title+'</b><p>'+desc+'</p></div><strong>'+f(arr.length)+'</strong></div>'+(arr.length?arr.map(function(o){return orderCard(o,kind)}).join(''):'<p class="rpt-empty">در حال حاضر سفارشی در این گروه وجود ندارد.</p>')+'</section>';
  }
  h+=group('سفارش‌های تکمیل‌شده','تأیید مشتری و تأیید نهایی مدیر هر دو با زمان و نشان تأیید معتبر در پایگاه داده ثبت شده‌اند.','rpt-green',done,'done');
  h+=group('در انتظار تأیید مشتری','سفارش ارسال شده است؛ مشتری باید پس از دریافت واقعی کالا، دریافت را از طریق کد پیگیری تأیید کند.','rpt-amber',waitCustomer,'customer');
  h+=group('در انتظار تأیید مدیر','تأیید دریافت مشتری ثبت شده است؛ مدیر باید کد یکتا را کنترل و تحویل نهایی را ثبت کند.','rpt-purple',waitManager,'manager');
  if(review.length)h+=group('نیازمند بررسی وضعیت','این سفارش‌ها تأییدهای کامل و قابل استناد ندارند یا وضعیت آن‌ها با مراحل استاندارد همخوان نیست؛ پیش از اقدام بررسی شوند.','rpt-red',review,'review');
  var active=d.filter(function(o){return o.status!=='cancelled'});
  h+='<h4 class="rpt-fin-title">خلاصه مالی سفارش‌ها</h4><div class="g2">'+R.map(function(r){var l=active.filter(function(o){return new Date(o.created_at).getTime()>=r[1]});var t=l.reduce(function(a,o){return a+Number(o.total||0)},0);return '<div class="ar"><div class="mu">'+r[0]+'</div><b>'+pr(t)+'</b><div class="mu">'+f(l.length)+' سفارش</div></div>'}).join('')+'</div>';
  var m={};active.forEach(function(o){(Array.isArray(o.items)?o.items:[]).forEach(function(x){var e=m[x.name]||(m[x.name]={q:0,t:0});e.q+=Number(x.qty||0);e.t+=Number(x.qty||0)*Number(x.price||0)})});
  var top=Object.keys(m).sort(function(a,b){return m[b].t-m[a].t}).slice(0,5);
  h+='<h4 style="margin:6px 0">پرفروش‌ترین کالاها</h4>'+(top.length?top.map(function(k){return '<div class="row"><span>'+esc(k)+'</span><span class="mu">'+f(m[k].q)+' عدد · '+pr(m[k].t)+'</span></div>'}).join(''):'<p class="mu">هنوز فروشی ثبت نشده است.</p>')+'<p class="mu">سفارش‌های لغوشده در خلاصه گزارش محاسبه نمی‌شوند.</p>';
  $('ab').innerHTML=h;
 }).catch(fail)
}
function rptEditOpen(i){
 if(!token||!managerAccess)return;
 var e=$('rptedit_'+i);if(e){e.style.display='block';e.scrollIntoView({behavior:'smooth',block:'nearest'})}
}
function rptEditClose(i){var e=$('rptedit_'+i);if(e)e.style.display='none'}
function rptSaveEdit(i){
 if(!token||!managerAccess||!O[i])return;
 var name=val('rpt_name_'+i).trim(),phone=val('rpt_phone_'+i).trim(),address=val('rpt_address_'+i).trim();
 if(name.length<1||name.length>120){alert('نام مشتری را درست وارد کنید.');return}
 if(phone.length<5||phone.length>30){alert('شماره تماس باید بین ۵ تا ۳۰ نویسه باشد.');return}
 if(address.length<1||address.length>500){alert('نشانی را درست وارد کنید.');return}
 api('rpc/shop_admin_update_order_report',{method:'POST',body:{p_order_id:O[i].id,p_customer_name:name,p_phone:phone,p_address:address}})
  .then(function(){alert('گزارش با موفقیت ویرایش شد.');reportView()})
  .catch(function(e){alert(errMsg(e)||'ویرایش گزارش انجام نشد. دسترسی مدیر و اتصال را بررسی کنید.')});
}
function rptArchive(i){
 if(!token||!managerAccess||!O[i])return;
 if(!confirm('این گزارش از فهرست گزارش‌ها و سفارش‌های فعال حذف شود؟\nاطلاعات اصلی سفارش و سوابق مالی و تحویل برای بایگانی محفوظ می‌ماند.'))return;
 api('rpc/shop_admin_archive_order_report',{method:'POST',body:{p_order_id:O[i].id}})
  .then(function(){alert('گزارش از فهرست فعال حذف و برای بایگانی محفوظ شد.');if(tab==='orders')ordersView();else reportView()})
  .catch(function(e){alert(errMsg(e)||'حذف گزارش انجام نشد. دسترسی مدیر و اتصال را بررسی کنید.')});
}
function productsView(){var h='<button class="btn gh" onclick="padd()">＋ کالای جدید</button>';
 P.forEach(function(x,i){h+='<div class="ar"><div class="row" style="border:0">'+(x.image_url?'<img class="thumb" src="'+esc(x.image_url)+'" alt="">':'<span style="font-size:34px">'+esc(x.emoji)+'</span>')+'<div style="flex:1"><input type="file" accept="image/*" onchange="upImg('+i+',this)" style="margin:0"><div id="pm'+i+'" class="mu"></div></div></div><div class="g" style="display:grid;grid-template-columns:1fr 1fr;gap:6px"><input id="pn'+i+'" value="'+esc(x.name)+'" placeholder="نام"><input id="pc'+i+'" value="'+esc(x.category)+'" placeholder="دسته"><input id="pp'+i+'" type="number" value="'+x.price+'" placeholder="قیمت (تومان)"><input id="pu'+i+'" value="'+esc(x.unit)+'" placeholder="واحد"><input id="pe'+i+'" value="'+esc(x.emoji)+'" placeholder="ایموجی"><select id="ps'+i+'"><option value="1"'+(x.in_stock?' selected':'')+'>موجود</option><option value="0"'+(x.in_stock?'':' selected')+'>ناموجود</option></select></div>'+
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
 api('shop_orders?select=id&status=eq.shipping&customer_confirmed_at=is.null').then(function(d){var n=(d||[]).length;badge(n);
  if(lastNew>=0&&n>lastNew){beep();try{if(window.Notification&&Notification.permission==='granted')new Notification('سفارش جدید در برق‌یار')}catch(e){}if(mode==='admin'&&tab==='orders')ordersView()}
  lastNew=n}).catch(function(){})}
function startPoll(){try{if(window.Notification&&Notification.permission==='default')Notification.requestPermission()}catch(e){}if(pollT)return;chk();pollT=setInterval(chk,30000)}
load();startProductRealtime();

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

/* ---- تأیید دریافت مشتری، تحویل نهایی مدیر، سند PDF ---- */
var TR=null,PHONE='۰۹۳۶۶۴۲۸۸۱۶',CRT='تمام حقوق معنوی و مادی برنامه برقیار متعلق به سازنده برنامه بنام محمدرضا دانشیار می‌باشد.';
function errMsg(e){try{var m=JSON.parse(e.message);return m.message||m.error_description||''}catch(x){var t=e&&e.message?String(e.message):'';return t.length<160&&t.indexOf('<')<0?t:''}}
function toEn(s){return String(s).replace(/[۰-۹]/g,function(c){return '۰۱۲۳۴۵۶۷۸۹'.indexOf(c)}).replace(/[٠-٩]/g,function(c){return '٠١٢٣٤٥٦٧٨٩'.indexOf(c)})}
function managerConfirmMessage(code){return 'تأیید دریافت مشتری در برنامه برق‌یار ثبت شد. لطفاً همان سفارش را در پنل مدیریت بررسی و تحویل نهایی را ثبت کنید.\nکد یکتای سفارش: '+code+'\nبرنامه برق‌یار: '+returnAppUrl(code)}
function managerConfirmLink(code){return 'https://wa.me/'+WA+'?text='+encodeURIComponent(managerConfirmMessage(code))}
function homeCustConfirm(){
 var c=val('homeTrackCode').trim().toUpperCase(),p=toEn(val('homePhone4').trim()),m=$('homeConfirmMsg');
 if(!c){m.className='err';m.textContent='کد پیگیری سفارش را وارد کنید.';return}
 if(!/^\d{4}$/.test(p)){m.className='err';m.textContent='چهار رقم آخر شماره تلفن را وارد کنید.';return}
 m.className='mu';m.textContent='در حال بررسی…';
 api('rpc/shop_customer_confirm',{method:'POST',body:{p_code:c,p_phone4:p}}).then(function(r){
  if(r==='ok'||r==='already'){m.className='okc';m.textContent=r==='ok'?'تأیید دریافت شما با موفقیت ثبت شد. اکنون کد یکتای سفارش برای ارسال به مدیر آماده است.':'دریافت این سفارش قبلاً تأیید شده است.';openTrack();setTimeout(function(){if($('tc')){$('tc').value=c;doTrack()}},250)}
  else if(r==='not_ready'){m.className='err';m.textContent='این سفارش هنوز به مرحله تحویل نرسیده است.'}
  else{m.className='err';m.textContent='کد پیگیری یا چهار رقم آخر شماره موبایل ثبت‌شده برای این سفارش صحیح نیست.'}
 }).catch(function(){m.className='err';m.textContent='ارتباط با سامانه برقرار نشد؛ دوباره تلاش کنید.'});
}
function restoreTrackFromLink(){try{var u=new URL(window.location.href),c=(u.searchParams.get('track')||'').trim().toUpperCase();if(!c)return;if($('homeTrackCode'))$('homeTrackCode').value=c;var hc=$('homeConfirm');if(hc)hc.scrollIntoView({behavior:'smooth',block:'start'});openTrack();setTimeout(function(){if($('tc')){$('tc').value=c;doTrack()}},350)}catch(e){console.warn('Tracking return link could not be processed',e)}}
window.addEventListener('load',function(){setTimeout(restoreTrackFromLink,250)});
function custConfirm(){var p=toEn(val('tp4').trim());if(!/^\d{4}$/.test(p)){$('tm').textContent='چهار رقم آخر شماره موبایلی که هنگام ثبت این سفارش وارد کرده‌اید، در اطلاعات سفارش موجود نیست یا معتبر نیست.';return}
 api('rpc/shop_customer_confirm',{method:'POST',body:{p_code:TR,p_phone4:p}}).then(function(r){
  if(r==='ok'||r==='already')doTrack();
  else $('tm').textContent=r==='not_ready'?'هنوز سفارش به ارسال‌کننده تحویل داده نشده است.':'اطلاعات با سفارش مطابقت ندارد.'}).catch(function(){$('tm').textContent='خطا در اتصال.'})}
function odeliver(i){var c=toEn(val('odcode_'+i).trim()).toUpperCase();if(!c){alert('کد یکتای سفارش در کادر مخصوص وارد نشده است.');return}
 if(c!==String(O[i].tracking_code||'').toUpperCase()){alert('کد واردشده با کد یکتای همین سفارش مطابقت ندارد.');return}
 api('rpc/shop_admin_deliver',{method:'POST',body:{p_order_id:O[i].id,p_code:c}}).then(function(){alert('تحویل نهایی همین سفارش با موفقیت ثبت شد.');if(tab==='report')reportView();else ordersView()}).catch(function(e){alert(errMsg(e)||'ثبت تحویل نهایی انجام نشد')})}
function dt(x){return x?new Date(x).toLocaleString('fa-IR'):'—'}
function printDoc(h){if(!token)return;var d=document.createElement('div');d.id='pa';d.innerHTML=h;document.body.appendChild(d);document.body.classList.add('pr');
 var done=function(){document.body.classList.remove('pr');var e=$('pa');if(e)e.remove();window.removeEventListener('afterprint',done)};
 window.addEventListener('afterprint',done);setTimeout(function(){window.print()},200)}
function docHead(t){return '<div style="text-align:center;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:12px"><h1 style="margin:0;font-size:22px">⚡ برق‌یار</h1><div style="font-size:16px;font-weight:700">'+t+'</div><div>تلفن: <span dir="ltr">'+PHONE+'</span></div></div>'}
function docFoot(){return '<div style="margin-top:18px;font-size:11px;border-top:1px solid #888;padding-top:6px">'+esc(CRT)+'<br>تاریخ صدور سند: '+dt(Date.now())+'</div>'}
function docOrder(i){
 if(!token||!managerAccess||!O[i])return;
 var o=O[i],items=Array.isArray(o.items)?o.items:[];
 var rows=items.map(function(x,n){return '<tr><td>'+f(n+1)+'</td><td>'+esc(x.name)+'</td><td>'+esc(x.unit||'')+'</td><td>'+f(x.qty)+'</td><td>'+pr(x.price)+'</td><td>'+pr(Number(x.price||0)*Number(x.qty||0))+'</td></tr>'}).join('');
 var report='<div id="orderPdfSource" dir="rtl" style="position:fixed;left:-10000px;top:0;width:780px;padding:22px;background:#fff;color:#111;font-family:Vazirmatn,Tahoma,sans-serif;font-size:13px;line-height:1.9">'+
  docHead('گزارش سفارش کالا')+
  '<table><tr><td>کد یکتای سفارش</td><td dir="ltr"><b>'+esc(o.tracking_code||'')+'</b></td><td>تاریخ ثبت</td><td>'+dt(o.created_at)+'</td></tr><tr><td>وضعیت</td><td>'+esc(ST[o.status]||o.status||'')+'</td><td>مبلغ کل</td><td><b>'+pr(o.total)+'</b></td></tr><tr><td>نام مشتری</td><td>'+esc(o.customer_name||'')+'</td><td>شماره تماس</td><td dir="ltr">'+esc(o.phone||'')+'</td></tr><tr><td>نشانی تحویل</td><td colspan="3">'+esc(o.address||'')+'</td></tr></table><br>'+
  '<table><tr><th>ردیف</th><th>نام کالا</th><th>واحد</th><th>تعداد</th><th>قیمت واحد</th><th>مبلغ ردیف</th></tr>'+rows+'<tr><td colspan="5"><b>جمع کل سفارش</b></td><td><b>'+pr(o.total)+'</b></td></tr></table><br>'+
  '<table><tr><td>تأیید دریافت مشتری</td><td>'+(o.customer_confirmed_at?'ثبت شده · '+dt(o.customer_confirmed_at):'در انتظار تأیید')+'</td></tr><tr><td>تأیید نهایی مدیر</td><td>'+(o.delivered_at?'ثبت شده · '+dt(o.delivered_at):'ثبت نشده')+'</td></tr></table>'+docFoot()+'</div>';
 $('in').innerHTML='<div class="row"><b>گزارش سفارش (PDF)</b><button class="link" onclick="closeSh()">بستن</button></div><p class="mu">گزارش همین سفارش در پنجره زیر نمایش داده می‌شود. از ابزارهای نمایش PDF می‌توانید آن را چاپ یا ذخیره کنید.</p><div id="orderPdfFrame" style="width:100%;height:68vh;min-height:420px;background:#eee;border:1px solid var(--bd);border-radius:10px;overflow:hidden;display:flex;align-items:center;justify-content:center">در حال ساخت فایل PDF…</div><div id="orderPdfDownload" style="margin-top:8px"></div>'+report;
 if(!window.html2pdf){$('orderPdfFrame').textContent='ابزار ساخت PDF بارگذاری نشده است. اتصال اینترنت را بررسی و صفحه را تازه کنید.';return}
 html2pdf().set({margin:8,filename:'barqyar-order-'+String(o.tracking_code||o.id)+'.pdf',image:{type:'jpeg',quality:0.98},html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff'},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}}).from($('orderPdfSource')).outputPdf('blob').then(function(blob){
  if(!$('orderPdfFrame'))return;
  if(orderPdfUrl)URL.revokeObjectURL(orderPdfUrl);
  orderPdfUrl=URL.createObjectURL(blob);
  $('orderPdfFrame').innerHTML='<iframe title="گزارش سفارش PDF" src="'+orderPdfUrl+'" style="width:100%;height:100%;border:0;background:#fff"></iframe>';
  $('orderPdfDownload').innerHTML='<a class="btn dl" href="'+orderPdfUrl+'" download="barqyar-order-'+esc(o.tracking_code||o.id)+'.pdf">⬇️ دریافت فایل PDF</a>';
 }).catch(function(e){$('orderPdfFrame').textContent='ساخت PDF انجام نشد. دوباره تلاش کنید.';console.error('Order PDF generation failed',e)});
}
function docFinal(){if(!token)return;
 api('shop_orders?select=*&status=eq.done&report_archived_at=is.null&order=delivered_at.desc.nullslast&limit=1000').then(function(d){d=d||[];
  var sum=d.reduce(function(a,o){return a+Number(o.total)},0),cc=d.filter(function(o){return o.customer_confirmed_at}).length;
  var rows=d.map(function(o,n){return '<tr><td>'+f(n+1)+'</td><td dir="ltr">'+esc(o.tracking_code||'')+'</td><td>'+esc(o.customer_name)+'</td><td>'+esc(o.phone)+'</td><td>'+pr(o.total)+'</td><td>'+(o.customer_confirmed_at?'✔':'—')+'</td><td>'+dt(o.delivered_at)+'</td></tr>'}).join('');
  printDoc(docHead('گزارش نهایی تحویل‌ها (بایگانی)')+
  '<table><tr><td>تعداد سفارش‌های تحویل‌شده</td><td>'+f(d.length)+'</td><td>جمع مبلغ</td><td>'+pr(sum)+'</td><td>تأیید مشتری</td><td>'+f(cc)+'</td></tr></table><br>'+
  '<table><tr><th>#</th><th>کد سفارش</th><th>مشتری</th><th>تلفن</th><th>مبلغ</th><th>تأیید مشتری</th><th>تحویل نهایی مدیر</th></tr>'+(rows||'<tr><td colspan="7">سفارش تحویل‌شده‌ای ثبت نشده است.</td></tr>')+'</table>'+docFoot())}).catch(function(){alert('دریافت گزارش انجام نشد')})}
