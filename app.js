var SB='https://zgswoheckqasqoclhodg.supabase.co',KEY='sb_publishable_Gs5TQ0bdmhNvboT6_1gU3Q_mzmnv2Ny';
var WA='989366428816',MAIL='makealmatykz@gmail.com';
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
function chg(id,d){var p=P.find(function(x){return String(x.id)===String(id)});if(!p)return;var next=Math.max(0,(cart[id]||0)+d);if(d>0&&(!p.in_stock||(p.stock_qty!==null&&p.stock_qty!==undefined&&next>Number(p.stock_qty)))){alert('تعداد درخواستی بیشتر از موجودی ثبت‌شده است.');return}cart[id]=next;if(!cart[id])delete cart[id];saved=false;code='';draw();if(mode==='cart')cartView()}
function show(m){mode=m;$('sh').className='sheet o'}
function closeSh(){$('sh').className='sheet';mode=''}
function lines(){var t=0,n=0,a=[];P.forEach(function(x){var q=cart[x.id];if(!q)return;var line=Number(q)*Number(x.price);t+=line;n+=q;a.push({product_id:x.id,name:x.name,unit:x.unit,qty:q,price:Number(x.price),line_total:line})});return {a:a,t:t,n:n}}
function openCart(){show('cart');cartView()}
function cartView(){
 var L=lines(),h='';
 if(!L.n){$('in').innerHTML='<p style="text-align:center">سبد خرید خالی است</p><button class="btn" onclick="closeSh()">بستن</button>';return}
 L.a.forEach(function(i){var x=P.find(function(p){return String(p.id)===String(i.product_id)});if(!x)return;h+='<div class="row"><div style="flex:1"><b>'+esc(i.name)+'</b><br><small class="mu">قیمت واحد: '+pr(i.price)+' × '+f(i.qty)+'</small><br><b class="pr">مبلغ این کالا: '+pr(i.line_total)+'</b></div><div class="qty"><button onclick="chg('+x.id+',1)">+</button><b>'+f(i.qty)+'</b><button onclick="chg('+x.id+',-1)">−</button></div></div>'});
 var nm=val('nm'),ph=val('ph'),ad=val('ad'),pay=val('pay')||'cash_on_delivery',delivery=val('delivery')||'';
 $('in').innerHTML='<h3 style="margin:0 0 6px">سبد خرید</h3>'+h+'<div class="tot">جمع مبلغ کالاها: '+pr(L.t)+'</div><p class="mu">هزینه ارسال پس از بررسی آدرس و هماهنگی مدیر اعلام می‌شود.</p>'+
 '<input id="nm" placeholder="نام و نام خانوادگی" value="'+esc(nm)+'"><input id="ph" type="tel" placeholder="شماره تماس" value="'+esc(ph)+'"><textarea id="ad" rows="2" placeholder="آدرس کامل تحویل">'+esc(ad)+'</textarea>'+
 '<label>روش پرداخت</label><select id="pay"><option value="cash_on_delivery"'+(pay==='cash_on_delivery'?' selected':'')+'>نقدی هنگام تحویل</option><option value="card_transfer_on_delivery"'+(pay==='card_transfer_on_delivery'?' selected':'')+'>کارت‌به‌کارت پس از تحویل</option></select>'+
 '<label>روش ارسال پیشنهادی</label><select id="delivery"><option value=""'+(!delivery?' selected':'')+'>هماهنگی توسط مدیر برق‌یار</option><option value="motorcycle"'+(delivery==='motorcycle'?' selected':'')+'>پیک موتوری</option><option value="van"'+(delivery==='van'?' selected':'')+'>وانت</option><option value="post"'+(delivery==='post'?' selected':'')+'>پست</option><option value="carrier"'+(delivery==='carrier'?' selected':'')+'>کریر / باربری</option></select>'+
 '<p id="er" class="err"></p><p class="mu">پس از ثبت، مدیر برای تأیید موجودی، هزینه ارسال و هماهنگی تحویل با شما تماس می‌گیرد.</p>'+
 '<button class="btn wa" type="button" onclick="sendWhatsApp()">ثبت سفارش و ارسال به واتساپ</button>'+
 '<form id="mailOrder" method="POST" action="https://formsubmit.co/'+MAIL+'" target="_blank" onsubmit="return sendEmail(event,this)">'+
 '<input type="hidden" name="_subject" value="سفارش جدید برق‌یار"><input type="hidden" name="_captcha" value="false"><input type="hidden" name="_template" value="table">'+
 '<input type="hidden" name="name" id="f_n"><input type="hidden" name="phone" id="f_p"><input type="hidden" name="address" id="f_a"><input type="hidden" name="order" id="f_o">'+
 '<button class="btn gh" type="submit">ثبت سفارش و ارسال به ایمیل مدیر</button></form>';
}

function openContact(){show('contact');
 $('in').innerHTML='<h3 style="margin:0 0 6px">تماس با ما</h3><a class="btn wa" target="_blank" rel="noopener" href="https://wa.me/'+WA+'">واتس‌اپ</a>'+
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
function ost(i,s){api('rpc/shop_admin_set_order_status',{method:'POST',body:{p_order_id:O[i].id,p_status:s}}).then(function(){ordersView();load()}).catch(function(e){alert('تغییر وضعیت انجام نشد: '+(e.message||''));fail(e)})}
function saveOrderOps(i){var b={delivery_method:val('odm'+i)||null,shipping_fee:Math.max(0,Number(val('ofee'+i))||0),payment_status:val('opay'+i)};api('shop_orders?id=eq.'+O[i].id,{method:'PATCH',prefer:'return=minimal',body:b}).then(ordersView).catch(function(e){alert('ذخیره اطلاعات ارسال/پرداخت ناموفق بود: '+(e.message||''))})}
function odel(i){if(!confirm('این سفارش حذف شود؟'))return;var restore=O[i].inventory_deducted?api('rpc/shop_admin_set_order_status',{method:'POST',body:{p_order_id:O[i].id,p_status:'cancelled'}}):Promise.resolve();restore.then(function(){return api('shop_orders?id=eq.'+O[i].id,{method:'DELETE'})}).then(ordersView).catch(fail)}
function psave(i){var stockText=val('pq'+i).trim();var b={name:val('pn'+i).trim(),category:val('pc'+i).trim(),price:Number(val('pp'+i))||0,unit:val('pu'+i).trim()||'عدد',emoji:val('pe'+i)||'🔌',in_stock:val('ps'+i)==='1',stock_qty:stockText===''?null:Math.max(0,Math.floor(Number(stockText)))};
 if(!b.name||!b.category)return alert('نام و دسته را وارد کنید.');
 api('shop_products?id=eq.'+P[i].id,{method:'PATCH',prefer:'return=minimal',body:b}).then(function(){Object.assign(P[i],b);draw();alert('ذخیره شد')}).catch(function(){alert('ذخیره نشد')})}
function pdel(i){if(confirm('این کالا حذف شود؟'))api('shop_products?id=eq.'+P[i].id,{method:'DELETE'}).then(function(){P.splice(i,1);draw();productsView()}).catch(function(){alert('حذف نشد')})}
function padd(){api('shop_products',{method:'POST',prefer:'return=representation',body:{name:'کالای جدید',category:'متفرقه',unit:'عدد',price:0,emoji:'🔌',in_stock:false,stock_qty:0}}).then(function(d){P.unshift(d[0]);draw();productsView()}).catch(function(){alert('افزودن نشد')})}

/* ---- بهبودها: عکس کالا، کد پیگیری، گزارش، اعلان ---- */
var ST={new:'جدید',confirmed:'تأییدشده',preparing:'در حال آماده‌سازی',shipping:'تحویل به ارسال‌کننده',done:'تحویل‌شده',cancelled:'لغوشده'};
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
  if(!x.in_stock||(x.stock_qty!==null&&x.stock_qty!==undefined&&Number(x.stock_qty)<=0))b='<button class="btn gh" disabled>ناموجود</button>';
  else if(n)b='<div class="qty"><button onclick="chg('+x.id+',1)">+</button><b>'+f(n)+'</b><button onclick="chg('+x.id+',-1)">−</button></div>';
  else b='<button class="btn" onclick="chg('+x.id+',1)">افزودن به سبد</button>';
  var ic=x.image_url?'<div class="ic im"><img src="'+esc(x.image_url)+'" alt="" loading="lazy"></div>':'<div class="ic">'+esc(x.emoji)+'</div>';
  return '<div class="p">'+ic+'<b>'+esc(x.name)+'</b><small>'+esc(x.category)+' · '+esc(x.unit)+'</small><small class="mu">'+(x.stock_qty==null?'موجودی دقیق ثبت نشده':('موجودی: '+f(x.stock_qty)))+'</small><div class="pr">'+pr(x.price)+'</div>'+b+'</div>'
 }).join(''):'<p class="mu" style="grid-column:1/-1;text-align:center">کالایی پیدا نشد</p>';
 var L=lines();$('bar').className='bar'+(L.n?'':' h');$('bn').textContent='مشاهده سبد ('+f(L.n)+' کالا)';$('bt').textContent=pr(L.t);
}
function orderText(){var L=lines();var pay=val('pay')==='card_transfer_on_delivery'?'کارت‌به‌کارت پس از تحویل':'نقدی هنگام تحویل';var dm={motorcycle:'پیک موتوری',van:'وانت',post:'پست',carrier:'کریر / باربری'};var delivery=dm[val('delivery')]||'هماهنگی توسط مدیر برق‌یار';return 'سفارش جدید از برق‌یار\nکد پیگیری: '+code+'\n'+L.a.map(function(i){return '• '+i.name+' × '+i.qty+' ('+i.unit+') | واحد: '+en(i.price)+' | جمع: '+en(i.line_total)}).join('\n')+'\nجمع مبلغ کالاها: '+en(L.t)+'\nروش پرداخت: '+pay+'\nروش ارسال: '+delivery+'\nهزینه ارسال: پس از هماهنگی مدیر\nنام: '+val('nm')+'\nتلفن: '+val('ph')+'\nآدرس: '+val('ad')}
async function createOrder(){if(!val('nm').trim()||!val('ph').trim()||!val('ad').trim())throw new Error('لطفاً نام، شماره تماس و آدرس را کامل کنید.');var L=lines();if(!L.n)throw new Error('سبد خرید خالی است.');if(saved&&code)return {code:code,text:orderText()};code=genCode();var body={customer_name:val('nm').trim(),phone:val('ph').trim(),address:val('ad').trim(),items:L.a,total:L.t,tracking_code:code,payment_method:val('pay')||'cash_on_delivery',delivery_method:val('delivery')||null};try{await api('shop_orders',{method:'POST',prefer:'return=minimal',keep:1,body:body});saved=true;}catch(e){saved=false;code='';throw new Error('ثبت سفارش در پایگاه داده انجام نشد. لطفاً دوباره تلاش کنید. '+(e.message||''));}var t=orderText();$('er').className='okc';$('er').textContent='سفارش در پایگاه داده ثبت شد. کد پیگیری: '+code+'؛ هزینه ارسال بعداً اعلام می‌شود.';return {code:code,text:t};}
async function sendWhatsApp(){var w=window.open('about:blank','_blank');try{var r=await createOrder();if(w)w.location.href='https://wa.me/'+WA+'?text='+encodeURIComponent(r.text);else $('er').textContent='سفارش ثبت شد. پنجره واتساپ باز نشد؛ کد پیگیری: '+r.code;}catch(e){if(w)w.close();$('er').className='err';$('er').textContent=e.message||'خطا در ثبت سفارش';}}
async function sendEmail(ev,form){ev.preventDefault();try{var r=await createOrder();$('f_n').value=val('nm');$('f_p').value=val('ph');$('f_a').value=val('ad');$('f_o').value=r.text;form.submit();}catch(e){$('er').className='err';$('er').textContent=e.message||'خطا در ثبت سفارش';}}

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
 $('ab').innerHTML=O.length?O.map(function(o,i){
 var pm=o.payment_method==='card_transfer_on_delivery'?'کارت‌به‌کارت پس از تحویل':'نقدی هنگام تحویل';
 return '<div class="ar"><div class="row" style="border:0"><b>'+esc(o.customer_name)+'</b><span class="st">'+(ST[o.status]||o.status)+'</span></div><div class="mu" dir="ltr" style="text-align:right">'+esc(o.tracking_code||'')+'</div><div class="mu">'+esc(o.phone)+' · '+new Date(o.created_at).toLocaleString('fa-IR')+'</div><div class="mu">'+esc(o.address)+'</div>'+
 o.items.map(function(x){return '<div style="font-size:13px">• '+esc(x.name)+' × '+f(x.qty)+' | واحد '+pr(x.price)+' | جمع '+pr(x.line_total||x.price*x.qty)+'</div>'}).join('')+
 '<div class="tot" style="padding:6px 0">جمع کالاها: '+pr(o.total)+'<br><small>هزینه ارسال: '+pr(o.shipping_fee||0)+' · مبلغ نهایی: '+pr(Number(o.total)+Number(o.shipping_fee||0))+'</small></div>'+
 '<div class="mu">پرداخت: '+pm+' · وضعیت: '+(o.payment_status==='paid'?'پرداخت‌شده':'پرداخت‌نشده')+'</div>'+
 '<div class="g"><label>روش ارسال<select id="odm'+i+'"><option value="">هماهنگی مدیر</option><option value="motorcycle"'+(o.delivery_method==='motorcycle'?' selected':'')+'>پیک موتوری</option><option value="van"'+(o.delivery_method==='van'?' selected':'')+'>وانت</option><option value="post"'+(o.delivery_method==='post'?' selected':'')+'>پست</option><option value="carrier"'+(o.delivery_method==='carrier'?' selected':'')+'>کریر / باربری</option></select></label><label>هزینه ارسال (ریال)<input id="ofee'+i+'" type="number" min="0" value="'+Number(o.shipping_fee||0)+'"></label><label>وضعیت پرداخت<select id="opay'+i+'"><option value="unpaid"'+(o.payment_status!=='paid'?' selected':'')+'>پرداخت‌نشده</option><option value="paid"'+(o.payment_status==='paid'?' selected':'')+'>پرداخت‌شده</option></select></label></div>'+
 '<div class="acts"><button onclick="saveOrderOps('+i+')">ذخیره ارسال و پرداخت</button><button onclick="ost('+i+',&quot;confirmed&quot;)">تأیید سفارش</button><button onclick="ost('+i+',&quot;preparing&quot;)">آماده‌سازی</button><button onclick="ost('+i+',&quot;shipping&quot;)">تحویل به ارسال‌کننده</button><button onclick="ost('+i+',&quot;done&quot;)">تحویل مشتری</button><button onclick="ost('+i+',&quot;cancelled&quot;)">لغو</button><button onclick="odel('+i+')">حذف</button></div></div>'
 }).join(''):'<p class="mu">هنوز سفارشی ثبت نشده است.</p>';
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
 P.forEach(function(x,i){h+='<div class="ar"><div class="row" style="border:0">'+(x.image_url?'<img class="thumb" src="'+esc(x.image_url)+'" alt="">':'<span style="font-size:34px">'+esc(x.emoji)+'</span>')+'<div style="flex:1"><input type="file" accept="image/*" onchange="upImg('+i+',this)" style="margin:0"><div id="pm'+i+'" class="mu"></div></div></div><div class="g" style="display:grid;grid-template-columns:1fr 1fr;gap:6px"><input id="pn'+i+'" value="'+esc(x.name)+'" placeholder="نام"><input id="pc'+i+'" value="'+esc(x.category)+'" placeholder="دسته"><input id="pp'+i+'" type="number" min="0" value="'+x.price+'" placeholder="قیمت (ریال)"><input id="pu'+i+'" value="'+esc(x.unit)+'" placeholder="واحد"><input id="pe'+i+'" value="'+esc(x.emoji)+'" placeholder="ایموجی"><input id="pq'+i+'" type="number" min="0" step="1" value="'+(x.stock_qty==null?'':x.stock_qty)+'" placeholder="موجودی عددی"><select id="ps'+i+'"><option value="1"'+(x.in_stock?' selected':'')+'>موجود</option><option value="0"'+(x.in_stock?'':' selected')+'>ناموجود</option></select></div><div class="mu">اگر موجودی دقیق را وارد کنید، برنامه تعداد قابل سفارش را کنترل می‌کند. خالی گذاشتن یعنی تعداد دقیق هنوز ثبت نشده است.</div><div class="acts"><button onclick="psave('+i+')">ذخیره</button>'+(x.image_url?'<button onclick="rmImg('+i+')">حذف عکس</button>':'')+'<button onclick="pdel('+i+')">حذف کالا</button></div></div>'});
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
