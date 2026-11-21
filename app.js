var SB='https://zgswoheckqasqoclhodg.supabase.co',KEY='sb_publishable_Gs5TQ0bdmhNvboT6_1gU3Q_mzmnv2Ny';
var WA='989366428816',TG='makekzir',MAIL='makealmatykz@gmail.com',APP_URL='https://ailifedad-bot.github.io/barqyar/';
function returnAppUrl(c){return APP_URL+(c?'?track='+encodeURIComponent(c):'')+'#home'}
var P=[],cat='همه',cart={},saved=false,mode='',token=null,managerAccess=false,tab='orders',O=[],AF=[];
// Supabase Auth session is stored and refreshed by the official client, so an authorized manager stays signed in after reload.
var adminAuthClient=window.supabase.createClient(SB,KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
adminAuthClient.auth.onAuthStateChange(function(event,session){token=session&&session.access_token?session.access_token:null;if(event==='SIGNED_OUT'){managerAccess=false}});
function $(i){return document.getElementById(i)}
function f(n){return Number(n||0).toLocaleString('fa-IR')}
function pr(n){return f(n)+' تومان'}
function en(n){return Number(n).toLocaleString('en-US')+' تومان'}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function val(i){var e=$(i);return e?e.value:''}
var activationIdentity=null,activationUnlocked=false,ACTIVATION_STORAGE_KEY='barqyar_device_activation_v1';
function getActivationIdentity(){
 if(activationIdentity)return activationIdentity;
 try{var old=localStorage.getItem(ACTIVATION_STORAGE_KEY);if(old){var parsed=JSON.parse(old);if(parsed&&parsed.id&&parsed.secret){activationIdentity=parsed;return parsed}}}catch(e){}
 try{var bytes=new Uint8Array(32);crypto.getRandomValues(bytes);var secret=Array.prototype.map.call(bytes,function(x){return x.toString(16).padStart(2,'0')}).join('');var id=crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0;return (c==='x'?r:(r&3|8)).toString(16)});activationIdentity={id:id,secret:secret};try{localStorage.setItem(ACTIVATION_STORAGE_KEY,JSON.stringify(activationIdentity))}catch(e){}return activationIdentity}catch(e){return null}
}
function api(path,o){o=o||{};var h={apikey:KEY,Authorization:'Bearer '+(token||KEY),'Content-Type':'application/json'};if(o.prefer)h.Prefer=o.prefer;return fetch(SB+'/rest/v1/'+path,{method:o.method||'GET',headers:h,body:o.body?JSON.stringify(o.body):undefined,keepalive:!!o.keep}).then(function(r){if(!r.ok)return r.text().then(function(t){throw new Error(t||r.status)});return r.status===204?null:r.text().then(function(t){return t?JSON.parse(t):null})})}
function hideActivationGate(){var g=$('activationGate');if(g)g.remove()}
function showActivationGate(message){
 var g=$('activationGate');if(!g){g=document.createElement('div');g.id='activationGate';g.className='activation-gate';document.body.appendChild(g)}
 g.innerHTML='<div class="activation-card"><div class="activation-logo">⚡ برق‌یار</div><h2>فعال‌سازی برنامه</h2><p>برای استفاده از برنامه، کد فعال‌سازی اختصاصی را که از مدیر دریافت کرده‌اید وارد کنید.</p><form onsubmit="submitActivation();return false"><input id="activationCode" dir="ltr" autocomplete="one-time-code" placeholder="BYR-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" maxlength="36" required><button class="btn" type="submit">فعال‌سازی برنامه</button></form><p id="activationMessage" class="activation-message">'+(message||'کد فقط یک‌بار قابل استفاده است و به همین دستگاه اختصاص می‌یابد.')+'</p><button class="btn gh" type="button" onclick="activationAdminLogin()">ورود مدیر / ساخت کد فعال‌سازی</button><small>پس از فعال‌سازی، در دفعات بعد نیازی به واردکردن مجدد کد نیست.</small></div>';
}
function activationAdminLogin(){hideActivationGate();openAdmin()}
function submitActivation(){
 var code=val('activationCode').trim().toUpperCase(),di=getActivationIdentity(),m=$('activationMessage');
 if(!di){if(m)m.textContent='ذخیره شناسه دستگاه ممکن نیست. حافظه مرورگر را بررسی کنید.';return}
 if(!code){if(m)m.textContent='کد فعال‌سازی را وارد کنید.';return}
 if(m)m.textContent='در حال بررسی کد…';
 api('rpc/shop_redeem_activation',{method:'POST',body:{p_code:code,p_device_id:di.id,p_device_secret:di.secret}})
 .then(function(r){if(!r||r.ok!==true)throw new Error('فعال‌سازی تأیید نشد');activationUnlocked=true;hideActivationGate();if(m)m.textContent='کد اشتراک با موفقیت ثبت شد. استفاده عادی از برنامه رایگان است و جزئیات امکانات ویژه طبق طرح اعلامی ارائه می‌شود.';load();startProductRealtime()})
 .catch(function(e){if(m)m.textContent=errMsg(e)||'کد معتبر نیست، منقضی شده یا قبلاً استفاده شده است.'})
}
function initActivation(){
 // استفاده معمولی از برق‌یار رایگان است؛ کد اشتراک فقط در صورت تمایل کاربر ثبت می‌شود.
 adminAuthClient.auth.getSession().then(function(result){
  var session=result&&result.data&&result.data.session;
  if(session&&session.access_token){
   token=session.access_token;
   return api('rpc/shop_is_admin').then(function(isAdmin){
    if(isAdmin===true){managerAccess=true;load();startProductRealtime();return true}
    managerAccess=false;token=null;
    return adminAuthClient.auth.signOut().then(function(){return false});
   }).catch(function(){managerAccess=false;token=null;return false});
  }
  return false;
 }).then(function(isAdmin){
  if(isAdmin)return;
  activationUnlocked=true;
  return api('shop_products?select=id,name,category,unit,price,emoji,in_stock,image_url,stock_qty&order=id')
   .then(function(d){P=Array.isArray(d)?d:[];draw();startProductRealtime()})
   .catch(function(e){console.warn('Product loading failed:',e);if($('grid'))$('grid').innerHTML='<p class="err" style="grid-column:1/-1;text-align:center">دریافت کالاها ناموفق بود. اتصال اینترنت را بررسی کنید و دوباره تلاش کنید.</p>'});
 });
}
function load(){refreshProducts()}
function refreshProducts(){
 if(managerAccess||!activationUnlocked)return;
 api('shop_products?select=id,name,category,unit,price,emoji,in_stock,image_url,stock_qty&order=id')
 .then(function(d){
  P=Array.isArray(d)?d:[];
  draw();
  if(mode==='cart')cartView();
 }).catch(function(e){
  console.warn('Product loading failed:',e);
  if(!$('grid').innerHTML||$('grid').innerHTML.indexOf('در حال بارگذاری')>-1||$('grid').innerHTML.indexOf('دریافت نشد')>-1)
   $('grid').innerHTML='<p class="err" style="grid-column:1/-1;text-align:center">دریافت کالاها ناموفق بود. اتصال اینترنت یا دسترسی دستگاه را بررسی کنید.</p>';
 });
}
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
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&activationUnlocked)refreshProducts()});
window.addEventListener('online',function(){if(activationUnlocked)refreshProducts()});
function cats(){return ['همه'].concat(P.map(function(x){return x.category}).filter(function(v,i,a){return v&&a.indexOf(v)===i}))}
function chg(id,d){cart[id]=Math.max(0,(cart[id]||0)+d);if(!cart[id])delete cart[id];saved=false;draw();if(mode==='cart')cartView()}
function show(m){mode=m;$('sh').className='sheet o'}
var orderPdfUrl=null;
function closeSh(){if(orderPdfUrl){URL.revokeObjectURL(orderPdfUrl);orderPdfUrl=null}$('sh').className='sheet';mode=''}
function lines(){var t=0,n=0,a=[];P.forEach(function(x){var q=cart[x.id];if(!q)return;t+=q*x.price;n+=q;a.push({product_id:x.id,name:x.name,unit:x.unit,qty:q,price:x.price})});return {a:a,t:t,n:n}}
function openCart(){show('cart');cartView()}
var customerDraftTimer=null,customerDraftPromise=null,customerDraftKey='';
function saveCustomerDraft(){
 if(customerDraftTimer){clearTimeout(customerDraftTimer);customerDraftTimer=null}
 var name=val('nm').trim(),phone=toEn(val('ph').trim()),address=val('ad').trim();
 if(name.length<1||name.length>120||phone.replace(/[^0-9]/g,'').length<10)return Promise.resolve(null);
 var key=name+'|'+phone+'|'+address;
 if(customerDraftPromise&&customerDraftKey===key)return customerDraftPromise;
 customerDraftKey=key;
 customerDraftPromise=api('rpc/shop_register_customer',{method:'POST',body:{p_name:name,p_phone:phone,p_address:address}}).then(function(x){if(!x||!x.customer_id||!x.subscription_code)throw new Error('پرونده مشتری ایجاد نشد');return x}).finally(function(){customerDraftPromise=null});
 return customerDraftPromise;
}
function queueCustomerDraft(){if(customerDraftTimer)clearTimeout(customerDraftTimer);customerDraftTimer=setTimeout(function(){saveCustomerDraft().catch(function(e){console.warn('Customer draft save failed:',e)})},650)}
function cancelCart(){if(customerDraftTimer){clearTimeout(customerDraftTimer);customerDraftTimer=null}saveCustomerDraft().then(function(x){cart={};saved=false;closeSh();draw();alert(x?'سبد خرید لغو شد؛ اطلاعات مشتری در بانک مشتریان ذخیره شد.':'سبد خرید لغو شد. برای ثبت پرونده مشتری، نام و شماره موبایل معتبر لازم است.')}).catch(function(e){cart={};saved=false;closeSh();draw();alert('سبد خرید لغو شد، اما ذخیره اطلاعات مشتری ناموفق بود: '+(errMsg(e)||'اتصال را بررسی کنید.'))})}
function cartView(){
 var L=lines(),h='';
 if(!L.n){$('in').innerHTML='<p style="text-align:center">سبد خرید خالی است</p><button class="btn" onclick="closeSh()">بستن</button>';return}
 L.a.forEach(function(i){var x=P.filter(function(p){return p.name===i.name})[0];h+='<div class="row"><div><b>'+esc(i.name)+'</b><br><small class="mu">'+pr(i.price)+' × '+f(i.qty)+'</small></div><div class="qty"><button onclick="chg('+x.id+',1)">+</button><b>'+f(i.qty)+'</b><button onclick="chg('+x.id+',-1)">−</button></div></div>'});
 var nm=val('nm'),ph=val('ph'),ad=val('ad');
 $('in').innerHTML='<h3 style="margin:0 0 6px">سبد خرید</h3>'+h+'<div class="tot">جمع کل: '+pr(L.t)+'</div>'+
 '<input id="nm" placeholder="نام و نام خانوادگی" value="'+esc(nm)+'" oninput="queueCustomerDraft()" onblur="saveCustomerDraft().catch(function(){})"><label class="order-field-label" for="ph">موبایل مشتری</label><input id="ph" type="tel" inputmode="tel" dir="ltr" placeholder="موبایل مشتری" aria-describedby="phHelp" value="'+esc(ph)+'" oninput="queueCustomerDraft()" onblur="saveCustomerDraft().catch(function(){})"><p id="phHelp" class="order-field-help">شماره موبایل را با صفر ابتدایی وارد کنید؛ مثال: <b dir="ltr">۰۹۱۱۳۸۸۹۷۵۹</b></p><textarea id="ad" rows="2" placeholder="آدرس تحویل" oninput="queueCustomerDraft()" onblur="saveCustomerDraft().catch(function(){})">'+esc(ad)+'</textarea>'+
 '<div class="cfbox" style="margin:10px 0"><b>راهنمای مشتری</b><p class="mu" style="margin:6px 0">۱) اطلاعات تماس و نشانی را دقیق وارد کنید. ۲) پیام سفارش را در واتس‌اپ یا ایمیل ارسال کنید. ۳) کد پیگیری را نگه دارید. ۴) کد اشتراک مشتری را نگهداری کنید. ۵) وضعیت سفارش را از بخش پیگیری مشاهده کنید.</p></div><p id="er" class="err"></p><div id="orderReceipt" class="cfbox" style="display:none;margin:10px 0"></div><p class="mu">روش ارسال سفارش:</p>'+
 '<a class="btn wa" target="_blank" rel="noopener" href="#" onclick="return go(this,\'wa\')">واتس‌اپ</a>'+
 '<a class="btn tg" target="_blank" rel="noopener" href="https://t.me/'+TG+'" onclick="return go(this,\'tg\')">تلگرام (@'+TG+')</a>'+
 '<form method="POST" action="https://formsubmit.co/'+MAIL+'" target="_blank" onsubmit="return go(this,\'mail\')">'+
 '<input type="hidden" name="_subject" value="سفارش جدید برق‌یار"><input type="hidden" name="_captcha" value="false"><input type="hidden" name="_template" value="table"><input type="hidden" name="_next" id="f_next"><input type="hidden" name="return_link" id="f_return">'+
 '<input type="hidden" name="name" id="f_n"><input type="hidden" name="phone" id="f_p"><input type="hidden" name="address" id="f_a"><input type="hidden" name="order" id="f_o">'+
 '<button class="btn gh" type="submit">ایمیل</button></form><button class="btn gh" type="button" onclick="cancelCart()">انصراف از سبد خرید</button>';
}
function openSubscription(){
 show('subscription');
 $('in').innerHTML='<h3 style="margin:0 0 6px">اشتراک اختیاری برق‌یار</h3><p class="mu">استفاده عادی از برنامه رایگان است. اگر مایل به تهیه اشتراک یا حمایت از توسعه برق‌یار هستید، مدت موردنظر را انتخاب و درخواست خود را ارسال کنید.</p><label>مدت اشتراک درخواستی</label><select id="subDays"><option value="30">یک‌ماهه (۳۰ روز)</option><option value="90">سه‌ماهه (۹۰ روز)</option><option value="180">شش‌ماهه (۱۸۰ روز)</option><option value="365">یکساله (۳۶۵ روز)</option></select><input id="subName" placeholder="نام شما (اختیاری)"><input id="subPhone" type="tel" inputmode="tel" dir="ltr" placeholder="شماره تماس (اختیاری)"><a class="btn wa" href="#" target="_blank" rel="noopener" onclick="return sendSubscriptionRequest(this)">ارسال درخواست اشتراک در واتس‌اپ</a><div class="cfbox"><b>کد اشتراک دریافت کرده‌اید؟</b><p class="mu">کد را فقط در صورت دریافت از مدیر وارد کنید. این کد برای ثبت عضویت اختیاری است؛ استفاده معمولی از برنامه به کد نیاز ندارد.</p><input id="activationCode" dir="ltr" autocomplete="one-time-code" placeholder="کد اشتراک دریافتی"><p id="activationMessage" class="activation-message mu">کد اشتراک اختیاری است.</p><button class="btn gh" type="button" onclick="submitActivation()">ثبت کد اشتراک</button></div><button class="btn gh" onclick="closeSh()">ادامه استفاده رایگان از برق‌یار</button>';
}
function sendSubscriptionRequest(el){
 var days=Number(val('subDays'))||30,name=val('subName').trim(),phone=toEn(val('subPhone').trim());
 var duration=days===30?'یک‌ماهه':days===90?'سه‌ماهه':days===180?'شش‌ماهه':'یکساله';
 var message='سلام، می‌خواهم اشتراک اختیاری برنامه برق‌یار را داشته باشم.\nمدت درخواستی: '+duration+' ('+days+' روز)\nنام: '+(name||'ثبت نشده')+'\nشماره تماس: '+(phone||'ثبت نشده')+'\nلطفاً شرایط و روش پرداخت را اعلام کنید.';
 el.href='https://wa.me/'+WA+'?text='+encodeURIComponent(message);return true;
}
function openContact(){show('contact');
 $('in').innerHTML='<h3 style="margin:0 0 6px">تماس با ما</h3><a class="btn gh" href="tel:09366428816">📞 تماس تلفنی: ۰۹۳۶۶۴۲۸۸۱۶</a><a class="btn wa" target="_blank" rel="noopener" href="https://wa.me/'+WA+'">واتس‌اپ</a><a class="btn tg" target="_blank" rel="noopener" href="https://t.me/'+TG+'">تلگرام (@'+TG+')</a>'+
 '<h4 style="margin:16px 0 6px">ارسال پیام</h4><form method="POST" action="https://formsubmit.co/'+MAIL+'" target="_blank">'+
 '<input type="hidden" name="_subject" value="پیام جدید از برق‌یار"><input type="hidden" name="_captcha" value="false"><input type="hidden" name="_template" value="table"><input type="hidden" name="_next" value="'+esc(returnAppUrl(''))+'"><input type="hidden" name="return_link" value="'+esc(returnAppUrl(''))+'">'+
 '<input name="name" placeholder="نام" required><input name="phone" type="tel" placeholder="شماره موبایل مشتری (برای تشکیل پرونده مشتری)" required><textarea name="message" rows="3" placeholder="پیام شما" required></textarea><button class="btn" type="submit">ارسال پیام</button><p class="mu">پس از ارسال پیام، با لینک بازگشت به برنامه برق‌یار برمی‌گردید.</p></form>';
}
/* ---------- مدیر ---------- */
function openAdmin(){show('admin');token&&managerAccess?adminView():loginView()}
function loginView(m){$('in').innerHTML='<h3 style="margin:0 0 8px">ورود مدیر اصلی برق‌یار</h3><p class="mu">حساب سازنده و مدیر اصلی برنامه</p><input id="em" type="email" value="" placeholder="ایمیل مدیر (ورود دستی)" autocomplete="username" dir="ltr"><input id="pw" type="password" placeholder="رمز عبور" dir="ltr"><button class="btn" onclick="login()">ورود مدیر</button><p class="err">'+(m||'')+'</p>'}
function login(){
 adminAuthClient.auth.signInWithPassword({email:val('em').trim(),password:val('pw')})
 .then(function(result){
  if(result.error||!result.data||!result.data.session)return loginView('ایمیل یا رمز عبور اشتباه است.');
  token=result.data.session.access_token;
  return api('rpc/shop_is_admin').then(function(ok){
   if(ok===true){managerAccess=true;hideActivationGate();adminView()}
   else{token=null;managerAccess=false;return adminAuthClient.auth.signOut().then(function(){loginView('این حساب در فهرست مدیران مجاز برق‌یار نیست.')})}
  });
 }).catch(function(){token=null;managerAccess=false;loginView('تأیید ورود مدیر انجام نشد. اتصال را بررسی و دوباره تلاش کنید.')});
}
function logout(){
 adminAuthClient.auth.signOut().finally(function(){
  token=null;managerAccess=false;closeSh();
  activationUnlocked=true;load();startProductRealtime();
 });
}
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
var ST={shipping:'در انتظار تأیید مدیر',approved:'تأییدشده توسط مدیر',done:'تکمیل‌شده',cancelled:'لغوشده'};
var code='',pollT=null,lastNew=-1;
function genCode(){var a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',s='BY-',b=new Uint8Array(6);crypto.getRandomValues(b);for(var i=0;i<6;i++)s+=a[b[i]%a.length];return s}
function draw(){
 var cs=cats();
 $('chips').innerHTML=cs.map(function(c){return '<button class="chip'+(c===cat?' on':'')+'">'+esc(c)+'</button>'}).join('');
 Array.prototype.forEach.call($('chips').children,function(b,i){b.onclick=function(){cat=cs[i];draw()}});
 var q=$('q').value.trim();
 var l=P.filter(function(x){return (cat==='همه'||x.category===cat)&&(!q||x.name.indexOf(q)>-1||x.category.indexOf(q)>-1)});
 if(!P.length){$('grid').innerHTML='<p class="err" style="grid-column:1/-1;text-align:center">فهرست کالاها از سرور دریافت نشد. اتصال اینترنت را بررسی کنید.</p>'}
 else $('grid').innerHTML=l.length?l.map(function(x){
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
function orderText(){var L=lines();return 'سفارش جدید از برق‌یار\\nکد پیگیری: '+code+'\\n'+L.a.map(function(i){return '• '+i.name+' × '+i.qty+' ('+i.unit+') = '+en(i.qty*i.price)}).join('\\n')+'\\nجمع کل: '+en(L.t)+'\\nنام: '+val('nm')+'\\nتلفن: '+val('ph')+'\\nآدرس: '+val('ad')+'\\n\\nلینک پیگیری وضعیت سفارش: '+returnAppUrl(code)}
function showOrderReceipt(subscriptionCode){var r=$('orderReceipt');if(r){r.style.display='block';r.innerHTML='<b>✅ سفارش در سامانه ثبت شد</b><div>کد پیگیری: <b dir="ltr">'+esc(code)+'</b></div><div>کد اشتراک مشتری: <b dir="ltr">'+esc(subscriptionCode||'—')+'</b></div><button class="btn" type="button" onclick="openTrackForCurrentOrder()">پیگیری همین سفارش</button>'}try{sessionStorage.setItem('barqyar_last_order',JSON.stringify({code:code,subscriptionCode:subscriptionCode||''}))}catch(e){}}
var LOCAL_ORDERS_KEY='barqyar_my_orders_v1';
function localPhoneKey(v){return toEn(String(v||'')).replace(/[^0-9]/g,'')}
function rememberLocalOrder(o){try{var a=JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY)||'[]');if(!Array.isArray(a))a=[];var summary=(o.items||[]).map(function(x){return x.name+' × '+x.qty}).join('، ');a=a.filter(function(x){return x.code!==o.tracking_code});a.unshift({code:o.tracking_code,phone:localPhoneKey(o.phone),name:o.customer_name,summary:summary,total:o.total,created_at:new Date().toISOString()});localStorage.setItem(LOCAL_ORDERS_KEY,JSON.stringify(a.slice(0,30)))}catch(e){console.warn('Local order history could not be saved',e)}}
function localOrderOptions(){var phone=localPhoneKey(val('trackPhone')),a=[];try{a=JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY)||'[]')}catch(e){}if(!Array.isArray(a))a=[];return a.filter(function(x){return phone&&x.phone===phone})}
function renderLocalOrderChoices(){var s=$('trackOrderSelect');if(!s)return;var a=localOrderOptions();s.innerHTML='<option value="">انتخاب کد سفارش شما…</option>'+a.map(function(x){return '<option value="'+esc(x.code)+'">'+esc(x.code)+' — '+esc((x.summary||'سفارش').slice(0,65))+' — '+pr(x.total)+'</option>'}).join('');if(!a.length)s.insertAdjacentHTML('beforeend','<option value="" disabled>سفارشی با این شماره در همین مرورگر ذخیره نشده است</option>')}
function chooseLocalOrder(){var s=$('trackOrderSelect');if(s&&s.value){$('tc').value=s.value;doTrack()}}
function openTrackForCurrentOrder(){openTrack();setTimeout(function(){if($('tc')){$('tc').value=code;doTrack()}},250)}
function go(el,k){if(!val('nm').trim()||!val('ph').trim()||!val('ad').trim()){$('er').textContent='لطفاً نام، شماره تماس و نشانی را کامل کنید.';return false}var L=lines();if(!L.n)return false;if(!saved){saved=true;code=genCode();var od={customer_name:val('nm').trim(),phone:toEn(val('ph').trim()),address:val('ad').trim(),items:L.a,total:L.t,tracking_code:code,status:'shipping'};$('er').className='mu';$('er').textContent='در حال ثبت سفارش و پرونده مشتری…';api('rpc/shop_register_customer',{method:'POST',body:{p_name:od.customer_name,p_phone:od.phone,p_address:od.address}}).then(function(c){if(!c||!c.customer_id||!c.subscription_code)throw new Error('پرونده مشتری ایجاد نشد');od.customer_id=c.customer_id;od.subscription_code=c.subscription_code;return api('shop_orders',{method:'POST',prefer:'return=minimal',keep:1,body:od}).then(function(){rememberLocalOrder(od);showOrderReceipt(c.subscription_code);$('er').className='okc';$('er').textContent='سفارش با موفقیت در برق‌یار ثبت شد. کد آن در فهرست پیگیری همین مرورگر ذخیره شد.'})}).catch(function(e){saved=false;$('er').className='err';$('er').textContent='ثبت سفارش ناموفق بود: '+(errMsg(e)||'اتصال یا اطلاعات را بررسی کنید.')})}var t=orderText();if(k==='wa')el.href='https://wa.me/'+WA+'?text='+encodeURIComponent(t);else if(k==='tg'){try{navigator.clipboard.writeText(t)}catch(e){}}else{$('f_n').value=val('nm');$('f_p').value=val('ph');$('f_a').value=val('ad');$('f_o').value=t;$('f_next').value=returnAppUrl(code);$('f_return').value=returnAppUrl(code)}return true}
function openTrack(){show('track');var hc=new URLSearchParams(location.search).get('track')||'';$('in').innerHTML='<h3 style="margin:0 0 8px">پیگیری سفارش</h3><div class="track-guide">🔎 برای مشاهده وضعیت، شماره موبایلی را وارد کنید که سفارش را با آن ثبت کرده‌اید؛ سپس کد همان سفارش را از فهرست انتخاب کنید.</div><label>شماره موبایل ثبت‌شده در سفارش</label><input id="trackPhone" type="tel" inputmode="tel" dir="ltr" placeholder="مثلاً 0912…" oninput="renderLocalOrderChoices()"><label>سفارش‌های ثبت‌شده در این مرورگر</label><select id="trackOrderSelect" onchange="chooseLocalOrder()"><option value="">ابتدا شماره موبایل را وارد کنید</option></select><p class="mu">با انتخاب هر سفارش، کد یکتای همان سفارش در کادر پیگیری قرار می‌گیرد.</p><label>کد یکتای سفارش</label><input id="tc" placeholder="کد پیگیری سفارش" dir="ltr" autocomplete="off" value="'+esc(hc)+'"><button class="btn" onclick="doTrack()">نمایش وضعیت سفارش</button><div id="tr" style="margin-top:10px"></div>';if(hc){setTimeout(function(){if($('tc'))doTrack()},0)}}
function doTrack(){var c=val('tc').trim().toUpperCase();if(!c)return;$('tr').innerHTML='<p class="mu">در حال دریافت وضعیت…</p>';api('rpc/shop_track_order_details',{method:'POST',body:{p_code:c}}).then(function(d){if(!d||!d.length){$('tr').innerHTML='<p class="err">سفارشی با این کد پیدا نشد.</p>';return}var o=d[0];$('tr').innerHTML='<div class="ar"><b>وضعیت: '+esc(ST[o.status]||o.status||'نامشخص')+'</b><div class="mu">تاریخ ثبت: '+dt(o.created_at)+'</div><div class="mu">مبلغ سفارش: '+pr(o.total)+'</div><div class="mu">کد پیگیری: <b dir="ltr">'+esc(o.tracking_code||c)+'</b></div></div>'}).catch(function(e){$('tr').innerHTML='<p class="err">خطا در دریافت وضعیت سفارش: '+esc(errMsg(e)||'اتصال برقرار نشد')+'</p>'})}
/* ---------- بازخورد و امتیاز کاربران ---------- */
function openFeedback(){
 show('feedback');
 $('in').innerHTML='<h3 style="margin:0 0 6px">نظر و امتیاز شما</h3><p class="mu">برای بهبود برق‌یار، امتیاز و یک توضیح کوتاه ثبت کنید.</p><form id="feedbackForm" onsubmit="submitAppFeedback();return false"><label>امتیاز شما</label><select id="fbRating"><option value="">بدون امتیاز</option><option value="5">۵ - عالی</option><option value="4">۴ - خوب</option><option value="3">۳ - متوسط</option><option value="2">۲ - ضعیف</option><option value="1">۱ - خیلی ضعیف</option></select><label>موضوع</label><select id="fbType"><option value="general">نظر کلی</option><option value="bug">گزارش مشکل</option><option value="usability">سهولت استفاده</option><option value="order">سفارش و پیگیری</option><option value="product">کالا و قیمت</option><option value="suggestion">پیشنهاد</option><option value="other">سایر</option></select><label>توضیح کوتاه</label><textarea id="fbMessage" rows="3" maxlength="1000" placeholder="نظر یا مشکل خود را کوتاه بنویسید…"></textarea><div aria-hidden="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden"><label>این قسمت را خالی بگذارید<input id="fbWebsite" tabindex="-1" autocomplete="off"></label></div><button class="btn" type="submit">ثبت نظر</button><p id="fbResult" class="mu" role="status"></p></form>';
}
function submitAppFeedback(){
 var rating=val('fbRating')?Number(val('fbRating')):null,message=val('fbMessage').trim();
 if(!rating&&!message){$('fbResult').className='err';$('fbResult').textContent='لطفاً امتیاز بدهید یا شرحی از نظر و مشکل خود بنویسید.';return}
 var payload={rating:rating,feedback_type:val('fbType')||'general',message:message,contact_name:null,contact_phone:null,order_code:null,app_version:'1.0.0',status:'new'};
 $('fbResult').className='mu';$('fbResult').textContent='در حال ارسال…';
 payload.website=val('fbWebsite');
 fetch(SB+'/functions/v1/submit-app-feedback',{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'},body:JSON.stringify(payload)})
 .then(function(r){return r.json().catch(function(){return {}}).then(function(d){if(!r.ok){var e=new Error(d.error||'feedback_not_saved');e.status=r.status;throw e}return d})})
 .then(function(){$('fbResult').className='okc';$('fbResult').textContent='سپاسگزاریم؛ بازخورد شما با موفقیت ثبت شد.';$('feedbackForm').reset()})
 .catch(function(e){$('fbResult').className='err';$('fbResult').textContent=e.status===429?'تعداد ارسال‌های شما در یک ساعت اخیر به حد مجاز رسیده است. لطفاً بعداً دوباره تلاش کنید.':'ارسال انجام نشد. اتصال اینترنت را بررسی کنید و دوباره تلاش کنید. '+(e.message||'')});
}

/* مدیر */
function setAdminTab(t){tab=t;adminView()}
function adminView(){if(!token||!managerAccess){loginView('برای ورود مدیر لازم است.');return}$('in').innerHTML='<div class="row"><h3>مدیریت</h3><button class="link" onclick="logout()">خروج</button></div><div class="tabs"><button class="chip" onclick="setAdminTab(&quot;orders&quot;)">سفارش‌ها</button><button class="chip" onclick="setAdminTab(&quot;products&quot;)">کالاها</button><button class="chip" onclick="setAdminTab(&quot;master&quot;)">جدول مادر</button><button class="chip" onclick="setAdminTab(&quot;customers&quot;)">مشتریان</button><button class="chip" onclick="setAdminTab(&quot;report&quot;)">گزارش سفارش‌ها</button><button class="chip" onclick="setAdminTab(&quot;feedback&quot;)">بازخورد کاربران</button><button class="chip" onclick="setAdminTab(&quot;activation&quot;)">کدهای فعال‌سازی</button></div>'+(tab==='report'?'<button class="btn dl" onclick="docFinal()">📄 گزارش نهایی بایگانی</button>':'')+'<div id="ab"></div>';tab==='report'?reportView():tab==='orders'?ordersView():tab==='products'?productsView():tab==='master'?masterView():tab==='activation'?activationAdminView():tab==='feedback'?feedbackView():customersView();if(tab!=='activation')startPoll()}
function feedbackView(){
 var box=$('ab');if(!box)return;box.innerHTML='<p class="mu">در حال دریافت بازخورد کاربران…</p>';
 api('shop_app_feedback?select=id,rating,feedback_type,message,status,admin_note,summary,archived_at,created_at&order=created_at.desc&limit=250').then(function(rows){
  AF=rows||[];var active=AF.filter(function(x){return !x.archived_at}),rated=AF.filter(function(x){return x.rating!==null&&x.rating!==undefined}),avg=rated.length? rated.reduce(function(s,x){return s+Number(x.rating)},0)/rated.length:0;
  var pending=active.filter(function(x){return x.status==='new'}).length;
  var h='<div class="g2"><div class="ar"><small>بازخوردهای فعال</small><br><b>'+f(active.length)+'</b></div><div class="ar"><small>میانگین امتیاز کاربران</small><br><b>'+(rated.length?avg.toFixed(2)+' / 5':'—')+'</b><small>از '+f(rated.length)+' امتیاز</small></div></div><p class="mu">در انتظار بررسی: '+f(pending)+'</p><button class="btn gh" onclick="feedbackShowArchived=!feedbackShowArchived;feedbackView()">'+(feedbackShowArchived?'نمایش بازخوردهای فعال':'نمایش بایگانی')+'</button>';
  var shown=AF.filter(function(x){return feedbackShowArchived?!!x.archived_at:!x.archived_at});
  h+=shown.length?shown.map(function(x){var i=AF.indexOf(x),types={general:'نظر کلی',bug:'گزارش خطا',usability:'سهولت استفاده',order:'سفارش',product:'کالا و قیمت',suggestion:'پیشنهاد',other:'سایر'};return '<article class="ar"><div class="row"><b>بازخورد #'+f(x.id)+'</b><span class="st">'+(x.archived_at?'بایگانی‌شده':esc(types[x.feedback_type]||x.feedback_type))+'</span></div><div class="mu">'+dt(x.created_at)+' · امتیاز: <b>'+(x.rating?f(x.rating)+' / 5':'ثبت نشده')+'</b></div><p style="white-space:pre-wrap;overflow-wrap:anywhere">'+esc(x.message||'بدون توضیح متنی')+'</p><label>خلاصه موضوع برای بایگانی</label><input id="fbSummary_'+i+'" maxlength="160" value="'+esc(x.summary||((x.message||types[x.feedback_type]||'بازخورد').slice(0,120)))+'" placeholder="مثلاً مشکل انتخاب کد پیگیری"><label>وضعیت بررسی</label><select id="fbStatus_'+i+'"><option value="new" '+(x.status==='new'?'selected':'')+'>جدید</option><option value="reviewing" '+(x.status==='reviewing'?'selected':'')+'>در حال بررسی</option><option value="resolved" '+(x.status==='resolved'?'selected':'')+'>برطرف شد</option><option value="closed" '+(x.status==='closed'?'selected':'')+'>بسته شد</option></select><label>یادداشت داخلی مدیر (اختیاری)</label><textarea id="fbNote_'+i+'" rows="2" maxlength="1000">'+esc(x.admin_note||'')+'</textarea><div class="acts"><button onclick="feedbackSave('+i+')">ذخیره خلاصه و وضعیت</button>'+(x.archived_at?'<button onclick="feedbackUnarchive('+i+')">بازگردانی</button>':'<button onclick="feedbackArchive('+i+')">بایگانی</button>')+'<button onclick="feedbackDelete('+i+')">حذف دائمی</button></div></article>'}).join(''):'<p class="mu">در این فهرست موردی وجود ندارد.</p>';
  box.innerHTML=h;
 }).catch(function(e){box.innerHTML='<p class="err">دریافت بازخورد ناموفق بود: '+esc(errMsg(e)||'دسترسی مدیر یا اتصال را بررسی کنید.')+'</p>'});
}
var feedbackShowArchived=false;
function feedbackSave(i){var x=AF[i];if(!x)return;var summary=val('fbSummary_'+i).trim();if(summary.length>160){alert('خلاصه حداکثر ۱۶۰ نویسه باشد.');return}var body={summary:summary||null,status:val('fbStatus_'+i),admin_note:val('fbNote_'+i).trim()||null};api('shop_app_feedback?id=eq.'+encodeURIComponent(x.id),{method:'PATCH',prefer:'return=minimal',body:body}).then(function(){feedbackView()}).catch(function(e){alert('ذخیره انجام نشد: '+(errMsg(e)||'دسترسی مدیر را بررسی کنید.'))})}
function feedbackArchive(i){var x=AF[i];if(!x)return;var summary=val('fbSummary_'+i).trim();if(!summary){alert('ابتدا خلاصه موضوع را وارد کنید.');return}api('shop_app_feedback?id=eq.'+encodeURIComponent(x.id),{method:'PATCH',prefer:'return=minimal',body:{summary:summary,archived_at:new Date().toISOString(),status:'closed'}}).then(function(){feedbackView()}).catch(function(e){alert('بایگانی انجام نشد: '+(errMsg(e)||'دسترسی مدیر را بررسی کنید.'))})}
function feedbackUnarchive(i){var x=AF[i];if(!x)return;api('shop_app_feedback?id=eq.'+encodeURIComponent(x.id),{method:'PATCH',prefer:'return=minimal',body:{archived_at:null}}).then(function(){feedbackView()}).catch(function(e){alert('بازگردانی انجام نشد: '+(errMsg(e)||'دسترسی مدیر را بررسی کنید.'))})}
function feedbackDelete(i){var x=AF[i];if(!x||!confirm('بازخورد #'+x.id+' برای همیشه حذف شود؟ این کار برگشت‌پذیر نیست.'))return;api('shop_app_feedback?id=eq.'+encodeURIComponent(x.id),{method:'DELETE',prefer:'return=minimal'}).then(function(){feedbackView()}).catch(function(e){alert('حذف انجام نشد: '+(errMsg(e)||'دسترسی مدیر را بررسی کنید.'))})}
function activationAdminView(){
 $('ab').innerHTML='<div class="ar"><b>صدور کد فعال‌سازی یک‌بارمصرف</b><p class="mu">هر کد فقط برای یک دستگاه و یک‌بار قابل استفاده است. پس از فعال‌سازی، دسترسی روی همان مرورگر باقی می‌ماند تا مدیر آن را لغو کند.</p><label>اعتبار کد برای فعال‌سازی</label><select id="activationDays"><option value="7">۷ روز</option><option value="30" selected>۳۰ روز (پیشنهادی)</option><option value="90">۹۰ روز</option><option value="180">۱۸۰ روز</option><option value="365">۳۶۵ روز</option></select><button class="btn" onclick="activationCreateCode()">＋ ایجاد کد جدید</button><div id="activationNewCode"></div></div><div class="ar"><div class="row"><b>فهرست کدها و دستگاه‌ها</b><button class="link" onclick="activationRefresh()">بروزرسانی</button></div><div id="activationList" class="mu">در حال دریافت…</div></div>';
 activationRefresh();
}
function activationCreateCode(){
 var days=Number(val('activationDays'))||30;
 api('rpc/shop_admin_create_activation_code',{method:'POST',body:{p_expires_days:days}})
 .then(function(r){if(!r||!r.code)throw new Error('کد ایجاد نشد');$('activationNewCode').innerHTML='<div class="activation-new"><b>کد جدید؛ فقط همین یک‌بار نمایش داده می‌شود:</b><div class="activation-code" dir="ltr">'+esc(r.code)+'</div><button class="btn gh" onclick="activationCopyCode(\''+esc(r.code)+'\')">کپی کد</button><p class="mu">مهلت استفاده: '+dt(r.expires_at)+'</p><p class="mu">این کد را برای یک کاربر ارسال کنید. پس از استفاده، دیگر قابل استفاده نیست.</p></div>';activationRefresh()})
 .catch(function(e){alert(errMsg(e)||'ساخت کد ناموفق بود؛ ورود مدیر را بررسی کنید.')})
}
function activationCopyCode(code){try{navigator.clipboard.writeText(code).then(function(){alert('کد کپی شد')}).catch(function(){alert('کد را به‌صورت دستی انتخاب و کپی کنید: '+code)})}catch(e){alert('کد را به‌صورت دستی انتخاب و کپی کنید: '+code)}}
function activationRefresh(){
 var box=$('activationList');if(!box)return;box.textContent='در حال دریافت…';
 api('rpc/shop_admin_list_activation_codes',{method:'POST',body:{}})
 .then(function(rows){rows=rows||[];if(!rows.length){box.innerHTML='<p class="mu">هنوز کدی ساخته نشده است.</p>';return}
 box.innerHTML=rows.map(function(x){
  var status=x.revoked_at?'کد لغوشده':x.redeemed_at?(x.activation_revoked_at?'فعال‌سازی لغوشده':'استفاده‌شده'):(new Date(x.expires_at).getTime()<Date.now()?'منقضی‌شده':'آماده استفاده');
  var action=x.device_id&&!x.activation_revoked_at?'<button onclick="activationRevokeDevice(\''+esc(x.device_id)+'\')">لغو دسترسی دستگاه</button>':(!x.redeemed_at&&!x.revoked_at?'<button onclick="activationRevokeCode(\''+esc(x.id)+'\')">لغو کد</button>':'');
  return '<div class="activation-row"><b>کد …'+esc(x.code_hint)+'</b><span>'+status+'</span><small>ایجاد: '+dt(x.created_at)+' · انقضا: '+dt(x.expires_at)+'</small>'+(x.redeemed_at?'<small>استفاده: '+dt(x.redeemed_at)+'</small>':'')+(x.device_id?'<small dir="ltr">دستگاه: '+esc(x.device_id)+'</small>':'')+'<div class="acts">'+action+'</div></div>'
 }).join('')})
 .catch(function(e){box.innerHTML='<p class="err">دریافت فهرست کدها ناموفق بود: '+esc(errMsg(e)||'خطای اتصال یا دسترسی مدیر')+'</p>'})
}
function activationRevokeCode(id){if(!confirm('این کد استفاده‌نشده لغو شود؟'))return;api('rpc/shop_admin_revoke_activation_code',{method:'POST',body:{p_code_id:id}}).then(activationRefresh).catch(function(e){alert(errMsg(e)||'لغو کد انجام نشد')})}
function activationRevokeDevice(id){if(!confirm('دسترسی این دستگاه فوراً لغو شود؟'))return;api('rpc/shop_admin_revoke_activation',{method:'POST',body:{p_device_id:id}}).then(activationRefresh).catch(function(e){alert(errMsg(e)||'لغو دسترسی انجام نشد')})}
function ordersView(){api('shop_orders?select=*&report_archived_at=is.null&order=created_at.desc&limit=300').then(function(d){O=d||[];$('ab').innerHTML=O.length?O.map(function(o,i){var a=o.status==='shipping'?'<button class="dlbtn" onclick="approveOrder('+i+')">تأیید سفارش توسط مدیر</button>':o.status==='approved'?'<span class="tag c">✔ تأییدشده توسط مدیر</span>':o.status==='done'?'<span class="tag c">✔ تکمیل‌شده</span>':'<span class="tag">لغو شده</span>';return '<div class="ar"><b>'+esc(o.customer_name)+'</b><div class="mu">کد سفارش: <b dir="ltr">'+esc(o.tracking_code||'')+'</b> · کد اشتراک: <b dir="ltr">'+esc(o.subscription_code||'—')+'</b></div><div class="mu">شماره تماس: <b dir="ltr">'+esc(o.phone||'')+'</b> · '+esc(o.address||'')+'</div>'+(Array.isArray(o.items)?o.items:[]).map(function(x){return '<div>• '+esc(x.name)+' × '+f(x.qty)+' '+esc(x.unit||'')+' · '+pr(Number(x.price||0)*Number(x.qty||0))+'</div>'}).join('')+'<div class="tot">'+pr(o.total)+'</div><div class="acts">'+a+(o.status==='shipping'?'<button onclick="cancelOrder('+i+')">لغو سفارش</button>':'')+'<button onclick="deleteOrder('+i+')">🗑️ حذف دائمی سفارش</button></div></div>'}).join(''):'<p class="mu">هنوز سفارشی ثبت نشده است.</p>';badge(O.filter(function(o){return o.status==='shipping'}).length)}).catch(fail)}
function cancelOrder(i){ost(i,'cancelled')}
function approveOrder(i){if(!O[i]||!O[i].tracking_code)return;if(!confirm('سفارش با این کد یکتا به‌عنوان تأییدشده توسط مدیر ثبت شود؟'))return;var b=api('rpc/shop_admin_approve_order',{method:'POST',body:{p_order_id:O[i].id,p_code:O[i].tracking_code}});b.then(function(){alert('سفارش با موفقیت توسط مدیر تأیید شد.');if(tab==='report')reportView();else ordersView()}).catch(function(e){console.error('Barqyar manager approval failed:',e);var m=errMsg(e)||'خطای نامشخص در ارتباط با پایگاه داده';alert('تأیید سفارش ثبت نشد.\n'+m);if(tab==='report')reportView();else ordersView()})}
function reportView(){api('shop_orders?select=*&report_archived_at=is.null&order=created_at.desc&limit=1000').then(function(d){O=d||[];var pending=O.filter(function(o){return o.status==='shipping'}),approved=O.filter(function(o){return o.status==='approved'}),done=O.filter(function(o){return o.status==='done'}),cancelled=O.filter(function(o){return o.status==='cancelled'});
 function card(o){var i=O.indexOf(o),items=Array.isArray(o.items)?o.items:[];return '<article class="rpt-order"><div class="rpt-order-head"><b>'+esc(o.customer_name||'مشتری')+'</b><span class="st">'+esc(ST[o.status]||o.status||'نامشخص')+'</span></div><div class="rpt-meta">کد سفارش: <b dir="ltr">'+esc(o.tracking_code||'—')+'</b> · کد اشتراک: <b dir="ltr">'+esc(o.subscription_code||'—')+'</b></div><div class="rpt-meta">شماره تماس: <b dir="ltr">'+esc(o.phone||'')+'</b> · '+dt(o.created_at)+'</div><div class="rpt-meta">'+esc(o.address||'')+'</div>'+items.map(function(x){return '<div class="rpt-item">• '+esc(x.name)+' × '+f(x.qty)+' '+esc(x.unit||'')+' · '+pr(Number(x.qty||0)*Number(x.price||0))+'</div>'}).join('')+'<div class="rpt-total">مبلغ سفارش: '+pr(o.total)+'</div><div class="acts"><button onclick="docOrder('+i+')">📄 مشاهده گزارش سفارش (PDF)</button><button onclick="rptEditOpen('+i+')">✏️ ویرایش اطلاعات</button><button onclick="rptArchive('+i+')">🗃️ بایگانی گزارش</button><button onclick="deleteOrder('+i+')">🗑️ حذف دائمی گزارش و سفارش</button></div><div id="rptedit_'+i+'" class="ar" style="display:none"><b>ویرایش گزارش</b><label>نام مشتری</label><input id="rpt_name_'+i+'" value="'+esc(o.customer_name||'')+'"><label>شماره تماس</label><input id="rpt_phone_'+i+'" value="'+esc(o.phone||'')+'"><label>نشانی</label><textarea id="rpt_address_'+i+'">'+esc(o.address||'')+'</textarea><button class="btn" onclick="rptSaveEdit('+i+')">ذخیره</button></div></article>'}
 function group(t,cl,a){return '<section class="rpt-group '+cl+'"><div class="rpt-group-head"><b>'+t+'</b><strong>'+f(a.length)+'</strong></div>'+(a.length?a.map(card).join(''):'<p class="rpt-empty">سفارشی وجود ندارد.</p>')+'</section>'}
 var h='<div class="rpt-intro"><b>گزارش و بایگانی سفارش‌ها</b><p>گزارش کامل فقط در پنل مدیر نمایش داده می‌شود. تأیید سفارش بر عهده مدیر است و تأیید مشتری در فرایند وجود ندارد. هر سفارش با کد یکتا و شماره تماس مشتری ثبت می‌شود.</p></div><div class="rpt-summary"><div class="rpt-count-card rpt-amber"><b>در انتظار تأیید مدیر</b><strong>'+f(pending.length)+'</strong><small>اقدام لازم: بررسی و تأیید مدیر</small></div><div class="rpt-count-card rpt-green"><b>تأییدشده توسط مدیر</b><strong>'+f(approved.length)+'</strong><small>آماده بایگانی</small></div><div class="rpt-count-card rpt-red"><b>لغوشده</b><strong>'+f(cancelled.length)+'</strong></div></div>';
 h+=group('سفارش‌های در انتظار تأیید مدیر','rpt-amber',pending)+group('سفارش‌های تأییدشده توسط مدیر','rpt-green',approved)+group('سفارش‌های تکمیل‌شده قدیمی','rpt-blue',done);if(cancelled.length)h+=group('سفارش‌های لغوشده','rpt-red',cancelled);$('ab').innerHTML=h
 }).catch(fail)}
var CUSTOMERS=[],CUSTOMER_ORDERS=[],CUSTOMER_STATS={},CUSTOMER_GROUP_SETTINGS={active_days:90,loyal_min_orders:3,bulk_min_total_toman:null};
var CUSTOMER_GROUPS=['مشتری فعال','مشتری جزئی','مشتری دائمی','مشتری عمده','شرکت ها','پروژه ها','بازاریاب','سایر'];
function customerPhoneKey(v){return toEn(String(v||'')).replace(/[^0-9]/g,'')}
function customerBuildStats(){
 CUSTOMER_STATS={};
 CUSTOMERS.forEach(function(c){
  var s={count:0,total:0,last:null},phone=customerPhoneKey(c.phone);
  CUSTOMER_ORDERS.forEach(function(o){
   if(o.status==='cancelled')return;
   var match=o.customer_id?o.customer_id===c.id:(phone&&customerPhoneKey(o.phone)===phone);
   if(!match)return;
   s.count+=1;s.total+=Number(o.total||0);
   var date=o.created_at?new Date(o.created_at):null;
   if(date&&!isNaN(date.getTime())&&(!s.last||date>s.last))s.last=date;
  });
  CUSTOMER_STATS[c.id]=s;
 });
}
function customerAutoGroup(c){
 var s=CUSTOMER_STATS[c.id]||{count:0,total:0,last:null},days=CUSTOMER_GROUP_SETTINGS.active_days||90;
 if(CUSTOMER_GROUP_SETTINGS.bulk_min_total_toman&&s.total>=Number(CUSTOMER_GROUP_SETTINGS.bulk_min_total_toman))return 'مشتری عمده';
 if(s.count>=Number(CUSTOMER_GROUP_SETTINGS.loyal_min_orders||3))return 'مشتری دائمی';
 if(s.last&&((Date.now()-s.last.getTime())/86400000)<=days)return 'مشتری فعال';
 if(s.count>0)return 'مشتری جزئی';
 return 'سایر';
}
function customerCurrentGroup(c){return c.customer_group_manual?(c.customer_group||'سایر'):customerAutoGroup(c)}
function customerGroupClass(g){return {'مشتری فعال':'cg-active','مشتری جزئی':'cg-small','مشتری دائمی':'cg-loyal','مشتری عمده':'cg-bulk','شرکت ها':'cg-company','پروژه ها':'cg-project','بازاریاب':'cg-marketer','سایر':'cg-other'}[g]||'cg-other'}
function customersView(){
 $('ab').innerHTML='<div class="rpt-intro"><b>بانک اطلاعات مشتریان</b><p>پرونده مشتریان به‌صورت خودکار از فرم سفارش ایجاد می‌شود. آمار از سفارش‌های ثبت‌شده محاسبه می‌شود و مدیر می‌تواند گروه و مشخصات هر مشتری را ویرایش کند.</p></div>'+
 '<div class="customer-settings"><b>تنظیم معیارهای دسته‌بندی خودکار</b><div class="g"><label>فعال بودن در چند روز اخیر<input id="cgActiveDays" type="number" min="1" max="3650" value="90"></label><label>حداقل سفارش برای مشتری دائمی<input id="cgLoyalOrders" type="number" min="2" max="10000" value="3"></label><label style="grid-column:1/-1">حداقل مجموع خرید برای مشتری عمده (تومان)<input id="cgBulkTotal" type="number" min="1" placeholder="برای غیرفعال ماندن خالی بگذارید"></label></div><button class="btn" onclick="customerSettingsSave()">ذخیره معیارها</button><p class="mu">مشتری فعال: سفارش در بازه تعیین‌شده · دائمی: حداقل تعداد سفارش · عمده: مجموع مبلغ سفارش‌ها به حد تعیین‌شده. گروه شرکت‌ها، پروژه‌ها و بازاریاب با انتخاب مدیر تعیین می‌شوند.</p></div>'+
 '<input id="customerSearch" placeholder="جستجو با نام، شماره تماس، کد اشتراک یا گروه" oninput="filterCustomers()"><div id="customerList">در حال دریافت…</div>';
 Promise.all([
  api('shop_customers?select=id,subscription_code,full_name,phone,phone_normalized,last_address,created_at,customer_group,customer_group_manual&order=created_at.desc&limit=2000'),
  api('shop_orders?select=id,customer_id,phone,total,status,created_at&limit=5000'),
  api('shop_settings?select=customer_active_days,customer_loyal_min_orders,customer_bulk_min_total_toman&id=eq.1')
 ]).then(function(r){
  CUSTOMERS=r[0]||[];CUSTOMER_ORDERS=r[1]||[];
  if(r[2]&&r[2][0])CUSTOMER_GROUP_SETTINGS={active_days:r[2][0].customer_active_days,loyal_min_orders:r[2][0].customer_loyal_min_orders,bulk_min_total_toman:r[2][0].customer_bulk_min_total_toman};
  $('cgActiveDays').value=CUSTOMER_GROUP_SETTINGS.active_days||90;
  $('cgLoyalOrders').value=CUSTOMER_GROUP_SETTINGS.loyal_min_orders||3;
  $('cgBulkTotal').value=CUSTOMER_GROUP_SETTINGS.bulk_min_total_toman||'';
  customerBuildStats();filterCustomers();
 }).catch(function(e){$('customerList').innerHTML='<p class="err">دریافت بانک مشتریان یا آمار سفارش‌ها ناموفق بود: '+esc(errMsg(e)||'دسترسی مدیر و اتصال را بررسی کنید')+'</p>'});
}
function customerSettingsSave(){
 var days=Number(val('cgActiveDays')),loyal=Number(val('cgLoyalOrders')),bulkRaw=val('cgBulkTotal').trim(),bulk=bulkRaw===''?null:Number(bulkRaw);
 if(!Number.isInteger(days)||days<1||days>3650||!Number.isInteger(loyal)||loyal<2||loyal>10000||(bulk!==null&&(!Number.isFinite(bulk)||bulk<=0))){alert('معیارها را به‌درستی وارد کنید.');return}
 api('shop_settings?id=eq.1',{method:'PATCH',prefer:'return=representation',body:{customer_active_days:days,customer_loyal_min_orders:loyal,customer_bulk_min_total_toman:bulk}})
 .then(function(d){if(!d||!d.length)throw new Error('تنظیمات ذخیره نشد');CUSTOMER_GROUP_SETTINGS={active_days:d[0].customer_active_days,loyal_min_orders:d[0].customer_loyal_min_orders,bulk_min_total_toman:d[0].customer_bulk_min_total_toman};filterCustomers();alert('معیارهای دسته‌بندی ذخیره شد.')})
 .catch(function(e){alert('ذخیره معیارها انجام نشد: '+(errMsg(e)||'دسترسی مدیر را بررسی کنید'))});
}
function customerSaveGroup(id){
 var group=val('customerGroup_'+id);
 if(CUSTOMER_GROUPS.indexOf(group)<0)return alert('گروه انتخاب‌شده معتبر نیست.');
 api('shop_customers?id=eq.'+encodeURIComponent(id),{method:'PATCH',prefer:'return=representation',body:{customer_group:group,customer_group_manual:true}})
 .then(function(d){if(!d||!d.length)throw new Error('تغییری ذخیره نشد');var c=CUSTOMERS.filter(function(x){return x.id===id})[0];if(c){c.customer_group=group;c.customer_group_manual=true}filterCustomers();alert('گروه مشتری ذخیره شد.')})
 .catch(function(e){alert('ذخیره گروه انجام نشد: '+(errMsg(e)||'دسترسی مدیر را بررسی کنید'))});
}
function customerAutoReset(id){
 if(!confirm('گروه این مشتری بر اساس تعداد و مبلغ سفارش‌ها به‌صورت خودکار تعیین شود؟'))return;
 api('shop_customers?id=eq.'+encodeURIComponent(id),{method:'PATCH',prefer:'return=representation',body:{customer_group:'سایر',customer_group_manual:false}})
 .then(function(d){if(!d||!d.length)throw new Error('تغییری ذخیره نشد');var c=CUSTOMERS.filter(function(x){return x.id===id})[0];if(c){c.customer_group='سایر';c.customer_group_manual=false}filterCustomers();alert('دسته‌بندی خودکار فعال شد.')})
 .catch(function(e){alert('تغییر گروه انجام نشد: '+(errMsg(e)||'دسترسی مدیر را بررسی کنید'))});
}
function customerSaveDetails(id){
 var c=CUSTOMERS.filter(function(x){return x.id===id})[0];if(!c)return;
 var name=val('customerName_'+id).trim(),phone=toEn(val('customerPhone_'+id).trim()),address=val('customerAddress_'+id).trim(),normalized=customerPhoneKey(phone);
 if(!name||name.length>120||normalized.length<10||normalized.length>15||address.length>500){alert('نام، شماره موبایل یا نشانی معتبر نیست.');return}
 api('shop_customers?id=eq.'+encodeURIComponent(id),{method:'PATCH',prefer:'return=representation',body:{full_name:name,phone:phone,phone_normalized:normalized,last_address:address}})
 .then(function(d){if(!d||!d.length)throw new Error('تغییری ذخیره نشد');Object.assign(c,d[0]);customerBuildStats();filterCustomers();alert('مشخصات مشتری ویرایش شد.')})
 .catch(function(e){alert('ویرایش مشخصات انجام نشد: '+(errMsg(e)||'شماره موبایل تکراری یا خطای دسترسی'))});
}
function filterCustomers(){
 var q=val('customerSearch').trim().toLowerCase();
 var a=CUSTOMERS.filter(function(c){return [c.full_name,c.phone,c.subscription_code,c.last_address,customerCurrentGroup(c)].join(' ').toLowerCase().includes(q)});
 $('customerList').innerHTML=a.length?a.map(function(c){
  var s=CUSTOMER_STATS[c.id]||{count:0,total:0,last:null},g=customerCurrentGroup(c),opts=CUSTOMER_GROUPS.map(function(x){return '<option value="'+esc(x)+'"'+(x===g?' selected':'')+'>'+esc(x)+'</option>'}).join('');
  return '<article class="ar customer-card"><div class="customer-head"><b>'+esc(c.full_name||'بدون نام')+'</b><span class="customer-badge '+customerGroupClass(g)+'">'+esc(g)+'</span></div>'+
   '<div class="customer-stats"><div><small>تعداد سفارش</small><b>'+f(s.count)+'</b></div><div><small>مجموع خرید</small><b>'+pr(s.total)+'</b></div><div><small>آخرین سفارش</small><b>'+dt(s.last?s.last.toISOString():null)+'</b></div></div>'+
   '<div class="mu">موبایل: <b dir="ltr">'+esc(c.phone||'')+'</b> · کد اشتراک: <b dir="ltr">'+esc(c.subscription_code||'—')+'</b></div>'+
   '<label class="mu">انتخاب گروه مشتری</label><select id="customerGroup_'+esc(c.id)+'">'+opts+'</select><div class="acts"><button onclick="customerSaveGroup(\''+esc(c.id)+'\')">ثبت گروه انتخاب‌شده</button><button onclick="customerAutoReset(\''+esc(c.id)+'\')">بازگشت به دسته‌بندی خودکار</button></div>'+
   '<details class="customer-edit"><summary>ویرایش مشخصات مشتری</summary><label>نام مشتری</label><input id="customerName_'+esc(c.id)+'" value="'+esc(c.full_name||'')+'"><label>شماره موبایل</label><input id="customerPhone_'+esc(c.id)+'" type="tel" dir="ltr" value="'+esc(c.phone||'')+'"><label>نشانی</label><textarea id="customerAddress_'+esc(c.id)+'" rows="2">'+esc(c.last_address||'')+'</textarea><button class="btn" onclick="customerSaveDetails(\''+esc(c.id)+'\')">ذخیره مشخصات</button></details></article>';
 }).join(''):'<p class="mu">مشتری‌ای پیدا نشد.</p>';
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
function deleteOrder(i){
 if(!token||!managerAccess||!O[i])return;
 var o=O[i];
 if(!confirm('حذف دائمی سفارش '+(o.tracking_code||'بدون کد')+'؟\\nاین عملیات برگشت‌پذیر نیست و سفارش از گزارش و سامانه حذف می‌شود.'))return;
 api('rpc/shop_admin_delete_order',{method:'POST',body:{p_order_id:o.id}}).then(function(){alert('سفارش و گزارش به‌صورت دائمی حذف شد.');if(tab==='orders')ordersView();else reportView()}).catch(function(e){alert('حذف انجام نشد: '+(errMsg(e)||'دسترسی مدیر یا اتصال را بررسی کنید.'))});
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
 api('shop_orders?select=id&status=eq.shipping').then(function(d){var n=(d||[]).length;badge(n);
  if(lastNew>=0&&n>lastNew){beep();try{if(window.Notification&&Notification.permission==='granted')new Notification('سفارش جدید در برق‌یار')}catch(e){}if(mode==='admin'&&tab==='orders')ordersView()}
  lastNew=n}).catch(function(){})}
function startPoll(){try{if(window.Notification&&Notification.permission==='default')Notification.requestPermission()}catch(e){}if(pollT)return;chk();pollT=setInterval(chk,30000)}
initActivation();

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

/* ---- مدیریت سفارش و گزارش PDF ---- */
var TR=null,PHONE='۰۹۳۶۶۴۲۸۸۱۶',CRT='تمام حقوق معنوی و مادی برنامه برقیار متعلق به سازنده برنامه بنام محمدرضا دانشیار می‌باشد.';
function errMsg(e){try{var m=JSON.parse(e.message);return m.message||m.error_description||''}catch(x){var t=e&&e.message?String(e.message):'';return t.length<160&&t.indexOf('<')<0?t:''}}
function toEn(s){return String(s).replace(/[۰-۹]/g,function(c){return '۰۱۲۳۴۵۶۷۸۹'.indexOf(c)}).replace(/[٠-٩]/g,function(c){return '٠١٢٣٤٥٦٧٨٩'.indexOf(c)})}
function dt(x){return x?new Date(x).toLocaleString('fa-IR'):'—'}
function printDoc(h){if(!token)return;var d=document.createElement('div');d.id='pa';d.innerHTML=h;document.body.appendChild(d);document.body.classList.add('pr');
 var done=function(){document.body.classList.remove('pr');var e=$('pa');if(e)e.remove();window.removeEventListener('afterprint',done)};
 window.addEventListener('afterprint',done);setTimeout(function(){window.print()},200)}
function docHead(t){return '<div style="text-align:center;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:12px"><h1 style="margin:0;font-size:22px">⚡ برق‌یار</h1><div style="font-size:16px;font-weight:700">'+t+'</div><div>تلفن: <span dir="ltr">'+PHONE+'</span></div></div>'}
function docFoot(){return '<div style="margin-top:18px;font-size:11px;border-top:1px solid #888;padding-top:6px">'+esc(CRT)+'<br>تاریخ صدور سند: '+dt(Date.now())+'</div>'}
var html2pdfLoader=null;
function ensureHtml2Pdf(){
 if(window.html2pdf)return Promise.resolve();
 if(html2pdfLoader)return html2pdfLoader;
 html2pdfLoader=new Promise(function(resolve,reject){var s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js';s.onload=resolve;s.onerror=function(){html2pdfLoader=null;reject(new Error('کتابخانه PDF بارگذاری نشد'))};document.head.appendChild(s)});
 return html2pdfLoader;
}
function docOrder(i){
 if(!token||!managerAccess||!O[i])return;var o=O[i],items=Array.isArray(o.items)?o.items:[];
 var rows=items.map(function(x,n){return '<tr><td>'+f(n+1)+'</td><td>'+esc(x.name)+'</td><td>'+esc(x.unit||'')+'</td><td>'+f(x.qty)+'</td><td>'+pr(x.price)+'</td><td>'+pr(Number(x.price||0)*Number(x.qty||0))+'</td></tr>'}).join('');
 var report='<div id="orderPdfSource" dir="rtl" style="width:100%;max-width:780px;margin:12px auto;padding:18px;background:#fff;color:#111;font-family:Vazirmatn,Tahoma,sans-serif;font-size:13px;line-height:1.9;border:1px solid #ddd">'+docHead('گزارش سفارش کالا')+'<table style="width:100%;border-collapse:collapse"><tr><td>کد سفارش</td><td dir="ltr"><b>'+esc(o.tracking_code||'')+'</b></td><td>تاریخ ثبت</td><td>'+dt(o.created_at)+'</td></tr><tr><td>وضعیت</td><td>'+esc(ST[o.status]||o.status||'')+'</td><td>مبلغ کل</td><td><b>'+pr(o.total)+'</b></td></tr><tr><td>نام مشتری</td><td>'+esc(o.customer_name||'')+'</td><td>شماره تماس</td><td dir="ltr">'+esc(o.phone||'')+'</td></tr><tr><td>کد اشتراک</td><td dir="ltr">'+esc(o.subscription_code||'—')+'</td><td>نشانی</td><td>'+esc(o.address||'')+'</td></tr></table><br><table style="width:100%;border-collapse:collapse"><tr><th>ردیف</th><th>نام کالا</th><th>واحد</th><th>تعداد</th><th>قیمت واحد</th><th>مبلغ ردیف</th></tr>'+rows+'<tr><td colspan="5"><b>جمع کل سفارش</b></td><td><b>'+pr(o.total)+'</b></td></tr></table>'+docFoot()+'</div>';
 $('in').innerHTML='<div class="row"><b>گزارش سفارش (PDF)</b><button class="link" onclick="closeSh()">بستن</button></div><p class="mu">گزارش سفارش فقط در پنل مدیر نمایش داده می‌شود.</p><div id="orderPdfFrame" style="width:100%;height:65vh;min-height:360px;background:#eee;border:1px solid var(--bd);border-radius:10px;overflow:hidden;display:flex;align-items:center;justify-content:center">در حال ساخت PDF…</div><div id="orderPdfDownload" style="margin-top:8px"></div>'+report;
 var source=$('orderPdfSource');$('orderPdfFrame').textContent='در حال آماده‌سازی فایل PDF…';
 ensureHtml2Pdf().then(function(){if(!$('orderPdfFrame'))return;return html2pdf().set({margin:8,filename:'barqyar-order-'+String(o.tracking_code||o.id)+'.pdf',image:{type:'jpeg',quality:0.98},html2canvas:{scale:1.5,useCORS:true,backgroundColor:'#ffffff',scrollX:0,scrollY:0},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}}).from(source).outputPdf('blob').then(function(blob){if(!$('orderPdfFrame'))return;if(orderPdfUrl)URL.revokeObjectURL(orderPdfUrl);orderPdfUrl=URL.createObjectURL(blob);$('orderPdfFrame').innerHTML='<iframe title="گزارش سفارش PDF" src="'+orderPdfUrl+'" style="width:100%;height:100%;border:0;background:#fff"></iframe>';source.style.display='none';$('orderPdfDownload').innerHTML='<a class="btn dl" href="'+orderPdfUrl+'" download="barqyar-order-'+esc(o.tracking_code||o.id)+'.pdf">⬇️ دریافت فایل PDF</a>'}).catch(function(e){console.error('PDF error',e);$('orderPdfFrame').textContent='ساخت PDF ناموفق بود؛ نسخه چاپی را به PDF ذخیره کنید.';$('orderPdfDownload').innerHTML='<button class="btn" onclick="printOrderFallback()">چاپ / ذخیره PDF</button>'})})
}
function printOrderFallback(){var s=$('orderPdfSource');if(s)printDoc(s.outerHTML)}
function docFinal(){if(!token||!managerAccess)return;api('shop_orders?select=*&status=eq.done&report_archived_at=is.null&order=delivered_at.desc.nullslast&limit=1000').then(function(d){d=d||[];var sum=d.reduce(function(a,o){return a+Number(o.total||0)},0);var rows=d.map(function(o,n){return '<tr><td>'+f(n+1)+'</td><td dir="ltr">'+esc(o.tracking_code||'')+'</td><td>'+esc(o.customer_name)+'</td><td>'+esc(o.phone)+'</td><td>'+pr(o.total)+'</td><td>'+dt(o.delivered_at)+'</td></tr>'}).join('');printDoc(docHead('گزارش نهایی سفارش‌های تکمیل‌شده')+'<table><tr><td>تعداد سفارش</td><td>'+f(d.length)+'</td><td>جمع مبلغ</td><td>'+pr(sum)+'</td></tr></table><br><table><tr><th>ردیف</th><th>کد سفارش</th><th>مشتری</th><th>تلفن</th><th>مبلغ</th><th>تاریخ تکمیل</th></tr>'+(rows||'<tr><td colspan="6">سفارشی ثبت نشده است.</td></tr>')+'</table>'+docFoot())}).catch(function(e){alert(errMsg(e)||'دریافت گزارش انجام نشد')})}
