var SB='https://zgswoheckqasqoclhodg.supabase.co',KEY='sb_publishable_Gs5TQ0bdmhNvboT6_1gU3Q_mzmnv2Ny';
var WA='989366428816',TG='makekzir',MAIL='makealmatykz@gmail.com',APP_URL='https://ailifedad-bot.github.io/barqyar/';
function returnAppUrl(c){return APP_URL+(c?'?track='+encodeURIComponent(c):'')+'#home'}
var P=[],cat='همه',cart={},saved=false,mode='',token=null,managerAccess=false,tab='orders',O=[],AF=[];
// مدیر با ایمیل و رمز عبور وارد می‌شود؛ نشست فقط در حافظه همین صفحه می‌ماند و پس از بارگذاری مجدد دوباره ورود لازم است.
var adminAuthClient=window.supabase.createClient(SB,KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
adminAuthClient.auth.onAuthStateChange(function(event,session){token=session&&session.access_token?session.access_token:null;if(event==='SIGNED_OUT'){managerAccess=false}});
function $(i){return document.getElementById(i)}
function f(n){return Number(n||0).toLocaleString('fa-IR')}
function pr(n){return f(n)+' تومان'}
function en(n){return Number(n).toLocaleString('en-US')+' تومان'}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function val(i){var e=$(i);return e?e.value:''}
function api(path,o){o=o||{};var h={apikey:KEY,Authorization:'Bearer '+(token||KEY),'Content-Type':'application/json'};if(o.prefer)h.Prefer=o.prefer;return fetch(SB+'/rest/v1/'+path,{method:o.method||'GET',headers:h,body:o.body?JSON.stringify(o.body):undefined,keepalive:!!o.keep}).then(function(r){if(!r.ok)return r.text().then(function(t){throw new Error(t||r.status)});return r.status===204?null:r.text().then(function(t){return t?JSON.parse(t):null})})}
function initApp(){load();startProductRealtime()}
function load(){refreshProducts()}
function refreshProducts(){
 if(managerAccess)return;
 api('shop_products?select=id,name,category,unit,price,emoji,in_stock,image_url,stock_qty,sku&order=id')
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
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')refreshProducts()});
window.addEventListener('online',function(){refreshProducts()});
function cats(){return ['همه'].concat(P.map(function(x){return x.category}).filter(function(v,i,a){return v&&a.indexOf(v)===i}))}
function chg(id,d){cart[id]=Math.max(0,(cart[id]||0)+d);if(!cart[id])delete cart[id];saved=false;draw();if(mode==='cart')cartView()}
function show(m){mode=m;$('sh').className='sheet o'}
var orderPdfUrl=null;
function closeSh(){if(orderPdfUrl){URL.revokeObjectURL(orderPdfUrl);orderPdfUrl=null}$('sh').className='sheet';mode=''}
function lines(){var t=0,n=0,a=[];P.forEach(function(x){var q=cart[x.id];if(!q)return;t+=q*x.price;n+=q;a.push({product_id:x.id,sku:x.sku||'',name:x.name,unit:x.unit,qty:q,price:x.price})});return {a:a,t:t,n:n}}
function openCart(){show('cart');cartView();refreshProducts()}
function openTerms(){
 show('terms');
 $('in').innerHTML='<h3 style="margin:0 0 8px">شرایط استفاده از برنامه برق‌یار</h3>'+
 '<div class="cfbox"><b>۱. هدف برنامه</b><p class="mu">برق‌یار برنامه‌ای برای معرفی و ارائه اطلاعات تجهیزات برق ساختمان، ثبت سفارش و امکانات مرتبط با پیگیری سفارش‌ها است.</p></div>'+
 '<div class="cfbox"><b>۲. مسئولیت اطلاعات واردشده</b><p class="mu">کاربر مسئول صحت اطلاعاتی است که در برنامه وارد می‌کند، از جمله نام، شماره تلفن، نشانی و اطلاعات سفارش. کاربر موظف است اطلاعات صحیح و قابل استفاده برای هماهنگی سفارش را ارائه دهد.</p></div>'+
 '<div class="cfbox"><b>۳. سفارش و هماهنگی</b><p class="mu">ثبت سفارش به معنای تکمیل خودکار معامله، تضمین موجودی کالا یا تضمین قیمت نهایی نیست. موجودی، قیمت نهایی، هزینه ارسال، زمان تحویل و سایر موارد مرتبط ممکن است نیازمند هماهنگی و تأیید مدیریت فروشگاه باشند.</p></div>'+
 '<div class="cfbox"><b>۴. مسئولیت کاربران</b><p class="mu">کاربران مسئول نحوه استفاده از برنامه، اطلاعات واردشده و اقداماتی هستند که از طریق برنامه انجام می‌دهند. استفاده برای اقدامات غیرقانونی، ورود اطلاعات خلاف واقع، سوءاستفاده یا ایجاد اختلال در خدمات ممنوع است.</p></div>'+
 '<div class="cfbox"><b>۵. دسترسی غیرمجاز و دست‌کاری برنامه</b><p class="mu">هرگونه تلاش برای نفوذ، دسترسی غیرمجاز، تخریب، اختلال یا دست‌کاری کدها، تنظیمات و ساختار برنامه بدون مجوز ممنوع است. مسئولیت اقدامات غیرمجاز بر عهده شخص انجام‌دهنده خواهد بود، در حدودی که قوانین قابل اجرا تعیین می‌کنند.</p></div>'+
 '<div class="cfbox"><b>۶. حدود مسئولیت</b><p class="mu">برق‌یار تلاش می‌کند خدمات را با کیفیت مناسب ارائه دهد، اما ممکن است به دلیل مشکلات اینترنت، زیرساخت‌های ثالث، اختلال فنی، تغییر قیمت یا شرایط خارج از کنترل متعارف، ارائه خدمات با محدودیت مواجه شود. این شرایط به معنای سلب یا محدود کردن مسئولیت‌های قانونی مالک یا مدیر برنامه و حقوق قانونی کاربران نیست.</p></div>'+
 '<div class="cfbox"><b>۷. حقوق برنامه</b><p class="mu">نام، طراحی، ساختار، کدها و محتوای اختصاصی برق‌یار، در حدود حقوق قانونی مربوط، متعلق به مالک برنامه یا صاحبان حقوق مربوط است. استفاده، بازتولید، تغییر یا انتشار بخش‌های اختصاصی برنامه بدون مجوز، در مواردی که نیازمند مجوز است، مجاز نیست.</p></div>'+
 '<div class="cfbox"><b>۸. تغییرات برنامه</b><p class="mu">ممکن است امکانات، محتوا، قیمت‌ها یا نحوه ارائه خدمات برق‌یار در آینده تغییر کند. نسخه به‌روزشده برنامه و توضیحات امکانات آن ملاک استفاده از خدمات خواهد بود.</p></div>'+
 '<div class="cfbox"><b>۹. پذیرش شرایط</b><p class="mu">با استفاده از امکانات سفارش‌دهی برنامه و پذیرش شرایط در فرم سفارش، کاربر اعلام می‌کند شرایط استفاده را مطالعه کرده و پذیرفته است.</p></div>'+
 '<div class="cfbox"><b>۱۰. ارتباط با پشتیبانی</b><p class="mu">برای گزارش مشکلات یا دریافت راهنمایی با ایمیل ailifedad@gmail.com تماس بگیرید.</p></div>'+
 '<button class="btn" type="button" onclick="closeSh()">بازگشت به برنامه</button>';
}
function cancelCart(){cart={};saved=false;closeSh();draw();alert('سبد خرید لغو شد. اطلاعات واردشده در پرونده جداگانه ذخیره نمی‌شود.')}
function cartView(){
 var L=lines(),h='';
 if(!L.n){$('in').innerHTML='<p style="text-align:center">سبد خرید خالی است</p><button class="btn" onclick="closeSh()">بستن</button>';return}
 L.a.forEach(function(i){var x=P.filter(function(p){return p.name===i.name})[0];h+='<div class="row"><div><b>'+esc(i.name)+'</b><br><small class="mu" dir="ltr">SKU: '+esc(i.sku||'—')+'</small><br><small class="mu">'+pr(i.price)+' × '+f(i.qty)+'</small></div><div class="qty"><button onclick="chg('+x.id+',1)">+</button><b>'+f(i.qty)+'</b><button onclick="chg('+x.id+',-1)">−</button></div></div>'});
 var nm=val('nm'),ph=val('ph'),ad=val('ad');
 $('in').innerHTML='<h3 style="margin:0 0 6px">سبد خرید</h3>'+h+'<div class="tot">جمع کل: '+pr(L.t)+'</div>'+
 '<input id="nm" placeholder="نام و نام خانوادگی" value="'+esc(nm)+'"><label class="order-field-label" for="ph">موبایل مشتری</label><input id="ph" type="tel" inputmode="tel" dir="ltr" placeholder="موبایل مشتری" aria-describedby="phHelp" value="'+esc(ph)+'"><p id="phHelp" class="order-field-help">شماره موبایل را با صفر ابتدایی وارد کنید؛ مثال: <b dir="ltr">۰۹۱۱۳۸۸۹۷۵۹</b></p><textarea id="ad" rows="2" placeholder="آدرس تحویل">'+esc(ad)+'</textarea>'+
 '<div class="cfbox" style="margin:10px 0"><b>راهنمای مشتری</b><p class="mu" style="margin:6px 0">۱) اطلاعات تماس و نشانی را دقیق وارد کنید. ۲) پیام سفارش را در واتس‌اپ یا ایمیل ارسال کنید. ۳) کد پیگیری را نگه دارید. ۴) وضعیت سفارش را از بخش پیگیری مشاهده کنید.</p></div><div class="cfbox" style="margin:10px 0;border:2px solid #b45309;background:rgba(245,158,11,.10)"><b>⚠️ شرایط استفاده و مسئولیت کاربران</b><p class="mu" style="margin:6px 0">کاربر مسئول نحوه استفاده، اطلاعات واردشده و اقداماتی است که از طریق برنامه انجام می‌دهد. خطاها و اشتباهات ناشی از استفاده نادرست یا ناآگاهی از راهنمای برنامه، سوءاستفاده و اقدامات غیرمجاز کاربران بر عهده خود آنان است. هک، دسترسی غیرمجاز و تغییر کدها یا تنظیمات برنامه بدون اجازه، خارج از اختیار و کنترل کاربر مجاز و مدیریت برنامه است؛ مسئولیت اقدامات و خسارات ناشی از آن، در حدودی که قانون اجازه می‌دهد، متوجه عامل آن خواهد بود. این بند مسئولیت‌های قانونی غیرقابل اسقاط مدیر و مالک را حذف نمی‌کند.</p><button class="btn gh" type="button" onclick="openTerms()">مطالعه متن کامل شرایط استفاده</button><label style="display:flex;gap:9px;align-items:flex-start;margin-top:10px;font-size:12px;line-height:1.9"><input id="termsAccepted" type="checkbox" style="width:auto;min-width:18px;margin:3px 0 0"><span>شرایط استفاده، مسئولیت کاربران و محدودیت‌های مربوط به دست‌کاری و دسترسی غیرمجاز را مطالعه کردم و می‌پذیرم.</span></label></div>'+'<p id="er" class="err"></p><div id="orderReceipt" class="cfbox" style="display:none;margin:10px 0"></div><p class="mu">روش ارسال سفارش:</p>'+
 '<a class="btn wa" target="_blank" rel="noopener" href="#" onclick="return go(this,\'wa\')">واتس‌اپ</a>'+
 '<a class="btn tg" target="_blank" rel="noopener" href="https://t.me/'+TG+'" onclick="return go(this,\'tg\')">تلگرام (@'+TG+')</a>'+
 '<form method="POST" action="https://formsubmit.co/'+MAIL+'" target="_blank" onsubmit="return go(this,\'mail\')">'+
 '<input type="hidden" name="_subject" value="سفارش جدید برق‌یار"><input type="hidden" name="_captcha" value="false"><input type="hidden" name="_template" value="table"><input type="hidden" name="_next" id="f_next"><input type="hidden" name="return_link" id="f_return">'+
 '<input type="hidden" name="name" id="f_n"><input type="hidden" name="phone" id="f_p"><input type="hidden" name="address" id="f_a"><input type="hidden" name="order" id="f_o">'+
 '<button class="btn gh" type="submit">ایمیل</button></form><button class="btn gh" type="button" onclick="cancelCart()">انصراف از سبد خرید</button>';
}
function openContact(){show('contact');
 $('in').innerHTML='<h3 style="margin:0 0 6px">تماس با ما</h3><a class="btn gh" href="tel:09366428816">📞 تماس تلفنی: ۰۹۳۶۶۴۲۸۸۱۶</a><a class="btn wa" target="_blank" rel="noopener" href="https://wa.me/'+WA+'">واتس‌اپ</a><a class="btn tg" target="_blank" rel="noopener" href="https://t.me/'+TG+'">تلگرام (@'+TG+')</a>'+
 '<h4 style="margin:16px 0 6px">ارسال پیام</h4><form method="POST" action="https://formsubmit.co/'+MAIL+'" target="_blank">'+
 '<input type="hidden" name="_subject" value="پیام جدید از برق‌یار"><input type="hidden" name="_captcha" value="false"><input type="hidden" name="_template" value="table"><input type="hidden" name="_next" value="'+esc(returnAppUrl(''))+'"><input type="hidden" name="return_link" value="'+esc(returnAppUrl(''))+'">'+
 '<input name="name" placeholder="نام" required><input name="phone" type="tel" placeholder="شماره موبایل تماس" required><textarea name="message" rows="3" placeholder="پیام شما" required></textarea><button class="btn" type="submit">ارسال پیام</button><p class="mu">پس از ارسال پیام، با لینک بازگشت به برنامه برق‌یار برمی‌گردید.</p></form>';
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
   if(ok===true){managerAccess=true;adminView()}
   else{token=null;managerAccess=false;return adminAuthClient.auth.signOut().then(function(){loginView('این حساب در فهرست مدیران مجاز برق‌یار نیست.')})}
  });
 }).catch(function(){token=null;managerAccess=false;loginView('تأیید ورود مدیر انجام نشد. اتصال را بررسی و دوباره تلاش کنید.')});
}
function logout(){adminAuthClient.auth.signOut().finally(function(){token=null;managerAccess=false;closeSh();load();startProductRealtime()})}
function fail(e){$('ab').innerHTML='<p class="err">دسترسی ندارید یا خطایی رخ داد. با ایمیل مدیر وارد شوید.</p>'}

function ost(i,s){api('rpc/shop_admin_set_order_status',{method:'POST',body:{p_order_id:O[i].id,p_status:s}}).then(ordersView).catch(function(e){alert(errMsg(e)||'انجام نشد')})}
function odel(i){rptArchive(i)}
function psave(i){var b={name:val('pn'+i).trim(),category:val('pc'+i).trim(),price:Number(val('pp'+i))||0,unit:val('pu'+i).trim()||'عدد',emoji:val('pe'+i)||'🔌',in_stock:val('ps'+i)==='1'};
 if(!b.name||!b.category)return alert('نام و دسته را وارد کنید.');
 api('shop_products?id=eq.'+P[i].id,{method:'PATCH',prefer:'return=minimal',body:b}).then(function(){Object.assign(P[i],b);draw();alert('ذخیره شد')}).catch(function(){alert('ذخیره نشد')})}
function pdel(i){if(confirm('این کالا حذف شود؟'))api('shop_products?id=eq.'+P[i].id,{method:'DELETE'}).then(function(){P.splice(i,1);draw();productsView()}).catch(function(){alert('حذف نشد')})}
function padd(){api('shop_products',{method:'POST',prefer:'return=representation',body:{name:'کالای جدید',category:'متفرقه',unit:'عدد',price:0,stock_qty:0,emoji:'🔌',in_stock:false,sku:''}}).then(function(d){if(!d||!d[0]||!d[0].sku)throw new Error('کد SKU توسط پایگاه داده صادر نشد');P.unshift(d[0]);draw();productsView();alert('کالای جدید با کد '+d[0].sku+' ایجاد شد.')}).catch(function(e){alert('افزودن کالا انجام نشد: '+(errMsg(e)||'اتصال یا تنظیم صدور SKU را بررسی کنید.'))})}


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


/* ---- گزارش تاریخچه تغییر قیمت و فایل‌های PDF مدیر ---- */
var priceHistoryRows=[],priceReportRows=[],priceReportPreviewUrl=null;
function priceReportsView(){
 if(!token||!managerAccess)return;
 $('ab').innerHTML='<section class="price-history-hero"><div class="price-history-kicker">مدیریت هوشمند قیمت‌ها</div><h3>📊 تاریخچه بروزرسانی قیمت کالاها</h3><p>هر بار که قیمت یک کالا در جدول مادر تغییر کند، تاریخ و مقدار قبل و بعد آن به‌صورت خودکار ثبت می‌شود.</p><div class="price-history-latest" id="priceHistoryLatest">در حال دریافت آخرین تاریخ بروزرسانی…</div><button class="price-report-create" onclick="priceSnapshotGenerate()">📄 نمایش بروزرسانی قیمت امروز · تهیه PDF</button><button class="btn gh" style="width:100%;margin-top:9px" onclick="priceReportGenerate()">تهیه PDF تاریخچه تغییرات ثبت‌شده</button><p class="mu">گزارش امروز، فهرست قیمت‌های فعلی جدول مادر را در یک فایل PDF مستقل ثبت می‌کند. این گزارش برای نمایش، چاپ و ذخیره است و قیمت کالاها را تغییر نمی‌دهد.</p></section><div class="price-history-stats" id="priceHistoryStats"></div><div class="ar"><div class="row"><b>سوابق تغییر قیمت</b><span class="st">تا ۵۰۰ تغییر اخیر</span></div><div id="priceHistoryList" class="mu">در حال دریافت…</div></div><div class="ar"><div class="row"><b>فایل‌های PDF ذخیره‌شده</b><span class="st">بایگانی مدیر</span></div><p class="mu">گزارش‌های ذخیره‌شده در فضای امن برق‌یار نگهداری می‌شوند و مدیر می‌تواند آن‌ها را دریافت، چاپ یا حذف کند.</p><div id="priceReportFiles" class="mu">در حال دریافت…</div></div>';
 Promise.all([
  api('shop_price_history?select=*&order=changed_at.desc&limit=500'),
  api('shop_price_reports?select=*&order=created_at.desc&limit=100')
 ]).then(function(r){
  priceHistoryRows=Array.isArray(r[0])?r[0]:[];priceReportRows=Array.isArray(r[1])?r[1]:[];
  var latest=priceHistoryRows[0],last=$('priceHistoryLatest');
  if(last)last.innerHTML=latest?'آخرین تغییر قیمت: <b>'+dt(latest.changed_at)+'</b>':'هنوز تغییری پس از فعال‌سازی تاریخچه قیمت ثبت نشده است.';
  var stats=$('priceHistoryStats');
  if(stats)stats.innerHTML='<div><small>تعداد تغییرات ثبت‌شده</small><b>'+f(priceHistoryRows.length)+'</b></div><div><small>گزارش‌های PDF ذخیره‌شده</small><b>'+f(priceReportRows.length)+'</b></div>';
  var list=$('priceHistoryList');
  if(list)list.innerHTML=priceHistoryRows.length?priceHistoryRows.map(function(x){return '<article class="price-history-row"><div class="row"><b>'+esc(x.product_name)+'</b><span class="price-history-date">'+dt(x.changed_at)+'</span></div><div class="mu">کد کالا: <b dir="ltr">'+esc(x.sku||'—')+'</b> · ثبت‌کننده: '+esc(x.changed_by||'مدیر')+'</div><div class="price-history-values"><span>قبل: <b>'+pr(x.old_price)+'</b></span><span>بعد: <b>'+pr(x.new_price)+'</b></span><span class="'+(Number(x.new_price)>=Number(x.old_price)?'price-up':'price-down')+'">'+(Number(x.new_price)>Number(x.old_price)?'▲ افزایش':Number(x.new_price)<Number(x.old_price)?'▼ کاهش':'بدون تغییر')+'</span></div></article>'}).join(''):'<div class="price-history-empty">هنوز سابقه تغییر قیمت ثبت نشده است. از این پس تغییر قیمت در جدول مادر به‌صورت خودکار ثبت می‌شود.</div>';
  priceReportFilesView();
 }).catch(function(e){var l=$('priceHistoryList');if(l)l.innerHTML='<span class="err">دریافت سوابق انجام نشد: '+esc(errMsg(e)||'اتصال یا دسترسی مدیر را بررسی کنید.')+'</span>'});
}
function priceReportFilesView(){
 var box=$('priceReportFiles');if(!box)return;
 box.innerHTML=priceReportRows.length?priceReportRows.map(function(x){return '<article class="price-history-row price-report-file"><b>📄 '+esc(x.file_name)+'</b><div class="mu">تاریخ ذخیره: '+dt(x.created_at)+' · تعداد تغییر قیمت: '+f(x.rows_count)+'</div><div class="acts"><button onclick="priceReportDownload(\''+esc(x.id)+'\')">⬇ دریافت PDF</button><button onclick="priceReportPrint(\''+esc(x.id)+'\')">🖨 بازکردن برای چاپ</button><button class="price-delete" onclick="priceReportDelete(\''+esc(x.id)+'\')">حذف گزارش</button></div></article>'}).join(''):'<div class="price-history-empty">هنوز فایل PDF ذخیره نشده است. برای ساخت اولین گزارش، دکمه بنفش بالای صفحه را بزنید.</div>';
}
function priceReportHtml(rows){
 var trs=rows.map(function(x,i){return '<tr><td>'+(i+1)+'</td><td dir="ltr">'+esc(x.sku||'—')+'</td><td>'+esc(x.product_name)+'</td><td>'+pr(x.old_price)+'</td><td>'+pr(x.new_price)+'</td><td>'+dt(x.changed_at)+'</td><td>'+esc(x.changed_by||'مدیر')+'</td></tr>'}).join('');
 return '<div id="priceReportPdfSource" dir="rtl" style="width:100%;padding:18px;background:#fff;color:#152238;font-family:Vazirmatn,Tahoma,sans-serif;font-size:11px;line-height:1.9"><div style="text-align:center;background:#102b45;color:#fff;padding:18px;border-radius:12px"><h1 style="margin:0;font-size:22px">⚡ برق‌یار</h1><h2 style="margin:5px 0;color:#ffe29a">گزارش تاریخچه بروزرسانی قیمت کالاها</h2><div>گزارش مدیریتی · تاریخ تهیه: '+dt(Date.now())+'</div></div><p>تعداد تغییرات ثبت‌شده در این گزارش: <b>'+f(rows.length)+'</b></p><table style="width:100%;border-collapse:collapse"><thead><tr style="background:#eaf5fc"><th>ردیف</th><th>SKU</th><th>نام کالا</th><th>قیمت قبلی</th><th>قیمت جدید</th><th>تاریخ تغییر</th><th>ثبت‌کننده</th></tr></thead><tbody>'+(trs||'<tr><td colspan="7">هنوز تغییر قیمتی ثبت نشده است.</td></tr>')+'</tbody></table><p style="margin-top:18px;border-top:1px solid #ccd5df;padding-top:8px;font-size:10px">این گزارش از سوابق ثبت‌شده در پایگاه داده برق‌یار تهیه شده است. '+esc(CRT)+'</p></div>';
}

function priceSnapshotHtml(rows,generatedAt){
 var trs=rows.map(function(x,n){
  return '<tr><td style="text-align:center">'+(n+1)+'</td><td dir="ltr" style="text-align:center">'+esc(x.sku||'—')+'</td><td>'+esc(x.name||x.product_name||'—')+'</td><td>'+esc(x.category||'—')+'</td><td>'+esc(x.unit||'عدد')+'</td><td style="text-align:left;white-space:nowrap"><b>'+pr(x.price)+'</b></td><td style="text-align:center">'+(x.stock_qty===null||x.stock_qty===undefined?'ثبت نشده':f(x.stock_qty))+'</td></tr>';
 }).join('');
 return '<div dir="rtl" style="width:100%;padding:20px;background:#fff;color:#172b43;font-family:Tahoma,Vazirmatn,sans-serif;font-size:11px;line-height:1.9"><div style="text-align:center;background:#102b45;color:#fff;padding:18px;border-radius:10px"><h1 style="margin:0;font-size:24px">⚡ برق‌یار</h1><h2 style="margin:5px 0;color:#ffe29a">گزارش بروزرسانی قیمت کالاها</h2><div>گزارش مدیریتی · تاریخ تهیه: '+dt(generatedAt)+'</div></div><div style="margin:16px 0;padding:10px;background:#f0f5fa;border:1px solid #d6e1ec;border-radius:8px"><b>تعداد کالاها:</b> '+f(rows.length)+' &nbsp; | &nbsp; <b>منبع:</b> جدول مادر موجودی و قیمت برق‌یار<br><b>توضیح:</b> این سند تصویر قیمت‌های ثبت‌شده در جدول مادر در زمان تهیه گزارش است؛ به‌تنهایی سابقه قیمت قبلی یا منبع بیرونی هر قیمت را اثبات نمی‌کند.</div><table style="width:100%;border-collapse:collapse"><thead><tr style="background:#eaf1f8"><th style="border:1px solid #aebdca;padding:7px">ردیف</th><th style="border:1px solid #aebdca;padding:7px">SKU</th><th style="border:1px solid #aebdca;padding:7px">نام کالا</th><th style="border:1px solid #aebdca;padding:7px">دسته‌بندی</th><th style="border:1px solid #aebdca;padding:7px">واحد</th><th style="border:1px solid #aebdca;padding:7px">قیمت فعلی (تومان)</th><th style="border:1px solid #aebdca;padding:7px">موجودی</th></tr></thead><tbody>'+trs+'</tbody></table><p style="margin-top:18px;border-top:1px solid #ccd5df;padding-top:8px;font-size:10px">این گزارش به درخواست مدیر برنامه برق‌یار تهیه شده است. '+esc(CRT)+'</p></div>';
}
function priceSnapshotGenerate(){
 if(!token||!managerAccess)return;
 var button=document.querySelector('.price-report-create');if(button){button.disabled=true;button.textContent='در حال تهیه گزارش PDF…'}
 var generatedAt=new Date();
 api('shop_products?select=id,sku,name,category,unit,price,stock_qty,updated_at&order=sku.asc').then(function(rows){
  if(!Array.isArray(rows)||!rows.length)throw new Error('فهرست کالاها از جدول مادر دریافت نشد.');
  var valid=rows.filter(function(x){return x.sku&&x.name&&x.price!==null&&Number.isFinite(Number(x.price))});
  if(!valid.length)throw new Error('هیچ کالای دارای SKU و قیمت معتبر پیدا نشد.');
  var file='barqyar-price-update-'+generatedAt.toISOString().slice(0,10)+'.pdf';
  return ensureHtml2Pdf().then(function(){
   var host=document.createElement('div');host.style.cssText='position:fixed;left:-12000px;top:0;width:980px;background:#fff;z-index:-1';host.innerHTML=priceSnapshotHtml(valid,generatedAt);document.body.appendChild(host);
   return html2pdf().set({margin:8,filename:file,image:{type:'jpeg',quality:.97},html2canvas:{scale:1.6,useCORS:true,backgroundColor:'#fff'},jsPDF:{unit:'mm',format:'a4',orientation:'landscape'}}).from(host.firstElementChild).outputPdf('blob').then(function(blob){host.remove();return priceReportUpload(blob,file,valid.length,generatedAt.toISOString(),generatedAt.toISOString())});
  });
 }).then(function(){alert('گزارش PDF قیمت‌های فعلی با موفقیت در بایگانی برق‌یار ذخیره شد. از فهرست فایل‌های PDF می‌توانید آن را دریافت یا برای چاپ باز کنید.');priceReportsView()})
 .catch(function(e){alert('تهیه یا ذخیره گزارش انجام نشد: '+(errMsg(e)||e.message||'اتصال و دسترسی مدیر را بررسی کنید.'))})
 .finally(function(){if(button){button.disabled=false;button.textContent='📄 نمایش بروزرسانی قیمت امروز · تهیه PDF'}});
}
function priceReportGenerate(){
 if(!token||!managerAccess)return;
 var rows=priceHistoryRows.slice(),file='barqyar-price-history-'+new Date().toISOString().replace(/[:.]/g,'-')+'.pdf';
 if(!rows.length&&!confirm('هنوز هیچ تغییر قیمتی در تاریخچه ثبت نشده است. یک گزارش خالی با وضعیت فعلی تهیه شود؟'))return;
 ensureHtml2Pdf().then(function(){
  var host=document.createElement('div');host.style.cssText='position:fixed;left:-10000px;top:0;width:760px;background:#fff;z-index:-1';host.innerHTML=priceReportHtml(rows);document.body.appendChild(host);
  return html2pdf().set({margin:8,filename:file,image:{type:'jpeg',quality:.96},html2canvas:{scale:1.5,useCORS:true,backgroundColor:'#ffffff'},jsPDF:{unit:'mm',format:'a4',orientation:'landscape'}}).from(host.firstElementChild).outputPdf('blob').then(function(blob){host.remove();return priceReportUpload(blob,file,rows.length)});
 }).then(function(){alert('گزارش PDF با موفقیت در بایگانی برق‌یار ذخیره شد.');priceReportsView()})
 .catch(function(e){console.error('Price report PDF:',e);alert('تهیه یا ذخیره PDF انجام نشد: '+(errMsg(e)||e.message||'اتصال و دسترسی مدیر را بررسی کنید.'))});
}
function priceReportUpload(blob,file,count,periodStart,periodEnd){
 var path='price-reports/'+Date.now()+'-'+file;
 return fetch(SB+'/storage/v1/object/barqyar-price-reports/'+path,{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+token,'Content-Type':'application/pdf','x-upsert':'false'},body:blob})
 .then(function(r){if(!r.ok)return r.text().then(function(t){throw new Error(t||'ذخیره فایل PDF انجام نشد')})})
 .then(function(){return api('shop_price_reports',{method:'POST',prefer:'return=representation',body:{file_name:file,file_path:path,rows_count:count,period_start:periodStart||(priceHistoryRows.length?priceHistoryRows[priceHistoryRows.length-1].changed_at:null),period_end:periodEnd||(priceHistoryRows.length?priceHistoryRows[0].changed_at:null),created_by:'مدیر'}})})
 .catch(function(e){fetch(SB+'/storage/v1/object/barqyar-price-reports/'+path,{method:'DELETE',headers:{apikey:KEY,Authorization:'Bearer '+token}}).catch(function(){});throw e});
}
function priceReportGetBlob(id){
 var x=priceReportRows.filter(function(r){return r.id===id})[0];if(!x)return Promise.reject(new Error('فایل گزارش پیدا نشد'));
 return fetch(SB+'/storage/v1/object/barqyar-price-reports/'+x.file_path,{headers:{apikey:KEY,Authorization:'Bearer '+token}})
 .then(function(r){if(!r.ok)throw new Error('دریافت فایل PDF ناموفق بود');return r.blob()});
}
function priceReportDownload(id){
 if(!token||!managerAccess)return;
 priceReportGetBlob(id).then(function(blob){var url=URL.createObjectURL(blob),x=priceReportRows.filter(function(r){return r.id===id})[0],a=document.createElement('a');a.href=url;a.download=x.file_name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},60000)})
 .catch(function(e){alert(errMsg(e)||e.message||'دریافت فایل انجام نشد')});
}
function priceReportPrint(id){
 if(!token||!managerAccess)return;
 priceReportGetBlob(id).then(function(blob){var url=URL.createObjectURL(blob),w=window.open(url,'_blank');if(!w){URL.revokeObjectURL(url);alert('مرورگر پنجره چاپ را مسدود کرد. دریافت PDF را بزنید و از نمایشگر PDF چاپ کنید.');return}setTimeout(function(){try{w.focus()}catch(e){}},700);setTimeout(function(){URL.revokeObjectURL(url)},120000)})
 .catch(function(e){alert(errMsg(e)||e.message||'بازکردن PDF انجام نشد')});
}
function priceReportDelete(id){
 if(!token||!managerAccess)return;
 var x=priceReportRows.filter(function(r){return r.id===id})[0];if(!x)return;
 if(!confirm('فایل PDF «'+x.file_name+'» و سابقه بایگانی آن حذف شود؟ این کار برگشت‌پذیر نیست.'))return;
 fetch(SB+'/storage/v1/object/barqyar-price-reports/'+x.file_path,{method:'DELETE',headers:{apikey:KEY,Authorization:'Bearer '+token}})
 .then(function(r){if(!r.ok)throw new Error('حذف فایل از فضای ذخیره‌سازی ناموفق بود');return api('shop_price_reports?id=eq.'+encodeURIComponent(id),{method:'DELETE'})})
 .then(function(){priceReportRows=priceReportRows.filter(function(r){return r.id!==id});priceReportFilesView();alert('فایل PDF حذف شد.')})
 .catch(function(e){alert(errMsg(e)||e.message||'حذف گزارش انجام نشد')});
}

/* ---- بهبودها: عکس کالا، کد پیگیری، گزارش، اعلان ---- */
var productPollT=null;
var ST={shipping:'در انتظار تأیید مدیر',approved:'تأییدشده؛ در انتظار تحویل',done:'تکمیل‌شده',cancelled:'لغوشده'};
var code='',pollT=null,lastNew=-1;
function genCode(){var a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',s='BY-',b=new Uint8Array(6);crypto.getRandomValues(b);for(var i=0;i<6;i++)s+=a[b[i]%a.length];return s}
function draw(){
 var cs=cats();
 $('chips').innerHTML=cs.map(function(c){return '<button class="chip'+(c===cat?' on':'')+'">'+esc(c)+'</button>'}).join('');
 Array.prototype.forEach.call($('chips').children,function(b,i){b.onclick=function(){cat=cs[i];draw()}});
 var q=$('q').value.trim();
 var l=P.filter(function(x){return (cat==='همه'||x.category===cat)&&(!q||x.name.indexOf(q)>-1||x.category.indexOf(q)>-1||String(x.sku||'').toLowerCase().indexOf(q.toLowerCase())>-1)});
 if(!P.length){$('grid').innerHTML='<p class="err" style="grid-column:1/-1;text-align:center">فهرست کالاها از سرور دریافت نشد. اتصال اینترنت را بررسی کنید.</p>'}
 else $('grid').innerHTML=l.length?l.map(function(x){
  var n=cart[x.id]||0,b;
  if(!x.in_stock)b='<button class="btn gh" disabled>ناموجود</button>';
  else if(n)b='<div class="qty"><button onclick="chg('+x.id+',1)">+</button><b>'+f(n)+'</b><button onclick="chg('+x.id+',-1)">−</button></div>';
  else b='<button class="btn" onclick="chg('+x.id+',1)">افزودن به سبد</button>';
  var ic=x.image_url?'<div class="ic im"><img src="'+esc(x.image_url)+'" alt="" loading="lazy"></div>':'<div class="ic">'+esc(x.emoji)+'</div>';
  var stockText=(x.stock_qty===null||x.stock_qty===undefined)?'موجودی: ثبت نشده':'موجودی: '+f(x.stock_qty)+' '+esc(x.unit||'عدد');
  return '<div class="p">'+ic+'<b>'+esc(x.name)+'</b><small class="sku-public" dir="ltr">SKU: '+esc(x.sku||'در انتظار کد')+'</small><small>'+esc(x.category)+' · '+esc(x.unit)+'</small><small class="mu">'+stockText+'</small><div class="pr">قیمت: '+pr(x.price)+'</div>'+b+'</div>'
 }).join(''):'<p class="mu" style="grid-column:1/-1;text-align:center">کالایی پیدا نشد</p>';
 var L=lines();$('bar').className='bar'+(L.n?'':' h');$('bn').textContent='مشاهده سبد ('+f(L.n)+' کالا)';$('bt').textContent=pr(L.t);
}
function orderText(){var L=lines();return 'سفارش جدید از برق‌یار\\nکد پیگیری: '+code+'\\n'+L.a.map(function(i){return '• ['+(i.sku||'بدون SKU')+'] '+i.name+' × '+i.qty+' ('+i.unit+') = '+en(i.qty*i.price)}).join('\\n')+'\\nجمع کل: '+en(L.t)+'\\nنام: '+val('nm')+'\\nتلفن: '+val('ph')+'\\nآدرس: '+val('ad')+'\\n\\nلینک پیگیری وضعیت سفارش: '+returnAppUrl(code)}
function showOrderReceipt(){var r=$('orderReceipt');if(r){r.style.display='block';r.innerHTML='<b>✅ سفارش در سامانه ثبت شد</b><div>کد پیگیری: <b dir="ltr">'+esc(code)+'</b></div><div>شماره موبایل پیگیری: <b dir="ltr">'+esc(toEn(val('ph').trim()))+'</b></div><button class="btn" type="button" onclick="openTrackForCurrentOrder()">پیگیری همین سفارش</button>'}try{localStorage.setItem('barqyar_last_order',JSON.stringify({code:code,phone:toEn(val('ph').trim())}))}catch(e){}}
var LOCAL_ORDERS_KEY='barqyar_my_orders_v1';
function localPhoneKey(v){return toEn(String(v||'')).replace(/[^0-9]/g,'')}
function rememberLocalOrder(o){try{var a=JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY)||'[]');if(!Array.isArray(a))a=[];var summary=(o.items||[]).map(function(x){return (x.sku?'['+x.sku+'] ':'')+x.name+' × '+x.qty}).join('، ');a=a.filter(function(x){return x.code!==o.tracking_code});a.unshift({code:o.tracking_code,phone:localPhoneKey(o.phone),name:o.customer_name,summary:summary,total:o.total,created_at:new Date().toISOString()});localStorage.setItem(LOCAL_ORDERS_KEY,JSON.stringify(a.slice(0,30)))}catch(e){console.warn('Local order history could not be saved',e)}}
function localOrderOptions(){var phone=localPhoneKey(val('trackPhone')),a=[];try{a=JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY)||'[]')}catch(e){}if(!Array.isArray(a))a=[];return a.filter(function(x){return phone&&x.phone===phone})}
function renderLocalOrderChoices(){var s=$('trackOrderSelect');if(!s)return;var a=localOrderOptions();s.innerHTML='<option value="">انتخاب کد سفارش شما…</option>'+a.map(function(x){return '<option value="'+esc(x.code)+'">'+esc(x.code)+' — '+esc((x.summary||'سفارش').slice(0,65))+' — '+pr(x.total)+'</option>'}).join('');if(!a.length)s.insertAdjacentHTML('beforeend','<option value="" disabled>سفارشی با این شماره در همین مرورگر ذخیره نشده است</option>')}
function chooseLocalOrder(){var s=$('trackOrderSelect');if(s&&s.value){$('tc').value=s.value;doTrack()}}
function openTrackForCurrentOrder(){try{localStorage.setItem('barqyar_last_order',JSON.stringify({code:code,phone:toEn(val('ph').trim())}))}catch(e){}openTrack();setTimeout(function(){if($('tc')){$('tc').value=code;if($('trackPhone')&&!$('trackPhone').value)$('trackPhone').value=toEn(val('ph').trim());doTrack()}},250)}
function go(el,k){if(!$('termsAccepted')||!$('termsAccepted').checked){$('er').className='err';$('er').textContent='برای ادامه ثبت سفارش، ابتدا شرایط استفاده را مطالعه و گزینه پذیرش را فعال کنید.';return false}if(!val('nm').trim()||!val('ph').trim()||!val('ad').trim()){$('er').textContent='لطفاً نام، شماره تماس و نشانی را کامل کنید.';return false}var L=lines();if(!L.n)return false;if(!saved){saved=true;code=genCode();var od={customer_name:val('nm').trim(),phone:toEn(val('ph').trim()),address:val('ad').trim(),items:L.a,total:L.t,tracking_code:code,status:'shipping'};$('er').className='mu';$('er').textContent='در حال ثبت سفارش…';api('shop_orders',{method:'POST',prefer:'return=minimal',keep:1,body:od}).then(function(){rememberLocalOrder(od);showOrderReceipt();$('er').className='okc';$('er').textContent='سفارش با موفقیت در برق‌یار ثبت شد. کد آن در فهرست پیگیری همین مرورگر ذخیره شد.'}).catch(function(e){saved=false;$('er').className='err';$('er').textContent='ثبت سفارش ناموفق بود: '+(errMsg(e)||'اتصال یا اطلاعات را بررسی کنید.')})}var t=orderText();if(k==='wa')el.href='https://wa.me/'+WA+'?text='+encodeURIComponent(t);else if(k==='tg'){try{navigator.clipboard.writeText(t)}catch(e){}}else{$('f_n').value=val('nm');$('f_p').value=val('ph');$('f_a').value=val('ad');$('f_o').value=t;$('f_next').value=returnAppUrl(code);$('f_return').value=returnAppUrl(code)}return true}
function openTrack(){show('track');var hc=new URLSearchParams(location.search).get('track')||'',last=null;try{last=JSON.parse(localStorage.getItem('barqyar_last_order')||'null')}catch(e){}if(!hc&&last&&last.code)hc=last.code;var hp=last&&last.phone?last.phone:'';$('in').innerHTML='<h3 style="margin:0 0 8px">پیگیری سفارش</h3><div class="track-guide">🔎 کد سفارش و شماره موبایل آخرین سفارش ثبت‌شده در این مرورگر به‌صورت خودکار درج می‌شود. برای سفارش دیگر، اطلاعات آن را وارد کنید.</div><label>شماره موبایل ثبت‌شده در سفارش</label><input id="trackPhone" type="tel" inputmode="tel" dir="ltr" placeholder="مثلاً 0912…" value="'+esc(hp)+'" oninput="renderLocalOrderChoices()"><label>سفارش‌های ثبت‌شده در این مرورگر</label><select id="trackOrderSelect" onchange="chooseLocalOrder()"><option value="">انتخاب سفارش…</option></select><p class="mu">با انتخاب سفارش، کد یکتای آن به‌صورت خودکار در کادر پیگیری قرار می‌گیرد.</p><label>کد یکتای سفارش</label><input id="tc" placeholder="کد پیگیری سفارش" dir="ltr" autocomplete="off" value="'+esc(hc)+'"><button class="btn" onclick="doTrack()">نمایش وضعیت سفارش</button><div id="tr" style="margin-top:10px"></div>';renderLocalOrderChoices();if(hc){setTimeout(function(){if($('tc'))doTrack()},0)}}
function doTrack(){
 var c=val('tc').trim().toUpperCase();
 if(!c){$('tr').innerHTML='<p class="err">کد سفارش را وارد کنید.</p>';return}
 $('tr').innerHTML='<p class="mu">در حال دریافت وضعیت…</p>';
 api('rpc/shop_track_order_details',{method:'POST',body:{p_code:c}})
 .then(function(d){
  if(!d||!d.length){$('tr').innerHTML='<p class="err">سفارشی با این کد پیدا نشد.</p>';return}
  var o=d[0],status=ST[o.status]||o.status||'نامشخص',action='';
  if(o.status==='shipping'){
   action='<div class="rpt-action rpt-amber" style="margin-top:10px">سفارش شما ثبت شده و در انتظار بررسی و تأیید مدیر برق‌یار است.</div>';
  }else if(o.status==='approved'){
   action='<div class="rpt-action rpt-blue" style="margin-top:10px">سفارش شما توسط مدیر تأیید شده و در مرحله آماده‌سازی یا تحویل است.</div>';
  }else if(o.status==='done'){
   action='<div class="cfok">✓ سفارش تکمیل شده و تحویل آن توسط مدیر برق‌یار ثبت شده است.</div>';
  }else if(o.status==='cancelled'){
   action='<div class="rpt-warning">این سفارش لغو شده است. برای راهنمایی با مدیریت تماس بگیرید.</div>';
  }
  $('tr').innerHTML='<div class="ar"><b>وضعیت: '+esc(status)+'</b><div class="mu">تاریخ ثبت: '+dt(o.created_at)+'</div><div class="mu">مبلغ سفارش: '+pr(o.total)+'</div><div class="mu">کد پیگیری: <b dir="ltr">'+esc(o.tracking_code||c)+'</b></div>' +action+'</div>';
 })
 .catch(function(e){$('tr').innerHTML='<p class="err">خطا در دریافت وضعیت سفارش: '+esc(errMsg(e)||'اتصال برقرار نشد')+'</p>'});
}

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

function adminView(){if(!token||!managerAccess){loginView('برای ورود مدیر لازم است.');return}$('in').innerHTML='<div class="row"><h3>مدیریت</h3><button class="link" onclick="logout()">خروج</button></div><div class="tabs"><button class="chip" onclick="setAdminTab(&quot;orders&quot;)">سفارش‌ها</button><button class="chip" onclick="setAdminTab(&quot;products&quot;)">کالاها</button><button class="chip" onclick="setAdminTab(&quot;master&quot;)">جدول مادر</button><button class="chip" onclick="setAdminTab(&quot;report&quot;)">گزارش سفارش‌ها</button><button class="chip" onclick="setAdminTab(&quot;feedback&quot;)">بازخورد کاربران</button></div>'+(tab==='report'?'<button class="btn dl" onclick="docFinal()">📄 گزارش نهایی بایگانی</button>':'')+'<div id="ab"></div>';tab==='report'?reportView():tab==='orders'?ordersView():tab==='products'?productsView():tab==='master'?masterView():tab==='feedback'?feedbackView():ordersView();startPoll()}
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
function ordersView(){
 api('shop_orders?select=*&report_archived_at=is.null&order=created_at.desc&limit=300').then(function(d){
  O=d||[];
  $('ab').innerHTML=O.length?O.map(function(o,i){
   var a='';
   if(o.status==='shipping')a='<button class="dlbtn" onclick="approveOrder('+i+')">تأیید سفارش توسط مدیر</button>';
   else if(o.status==='approved')a='<span class="tag d">تأییدشده؛ در انتظار تکمیل تحویل</span><button class="dlbtn" onclick="finalizeDelivery('+i+')">ثبت تحویل و تکمیل سفارش</button>';
   else if(o.status==='done')a='<span class="tag c">✓ تکمیل‌شده</span>';
   else a='<span class="tag">لغو شده</span>';
   return '<div class="ar"><b>'+esc(o.customer_name)+'</b><div class="mu">کد سفارش: <b dir="ltr">'+esc(o.tracking_code||'')+'</b></div><div class="mu">شماره تماس: <b dir="ltr">'+esc(o.phone||'')+'</b> · '+esc(o.address||'')+'</div>'+(Array.isArray(o.items)?o.items:[]).map(function(x){return '<div>• '+(x.sku?'<b dir="ltr">['+esc(x.sku)+']</b> ':'')+esc(x.name)+' × '+f(x.qty)+' '+esc(x.unit||'')+' · '+pr(Number(x.price||0)*Number(x.qty||0))+'</div>'}).join('')+'<div class="tot">'+pr(o.total)+'</div><div class="acts">'+a+(o.status==='shipping'?'<button onclick="cancelOrder('+i+')">لغو سفارش</button>':'')+'<button onclick="deleteOrder('+i+')">🗑️ حذف دائمی سفارش</button></div></div>'
  }).join(''):'<p class="mu">هنوز سفارشی ثبت نشده است.</p>';
  badge(O.filter(function(o){return o.status==='shipping'}).length)
 }).catch(fail)
}
function cancelOrder(i){ost(i,'cancelled')}
function approveOrder(i){if(!O[i]||!O[i].tracking_code)return;if(!confirm('سفارش با این کد یکتا به‌عنوان تأییدشده توسط مدیر ثبت شود؟'))return;var b=api('rpc/shop_admin_approve_order',{method:'POST',body:{p_order_id:O[i].id,p_code:O[i].tracking_code}});b.then(function(){alert('سفارش با موفقیت توسط مدیر تأیید شد.');if(tab==='report')reportView();else ordersView()}).catch(function(e){console.error('Barqyar manager approval failed:',e);var m=errMsg(e)||'خطای نامشخص در ارتباط با پایگاه داده';alert('تأیید سفارش ثبت نشد.\n'+m);if(tab==='report')reportView();else ordersView()})}
function finalizeDelivery(i){
 if(!token||!managerAccess||!O[i])return;
 var o=O[i];
 if(o.status!=='approved'){alert('ابتدا سفارش باید توسط مدیر تأیید شود.');return}
 if(!confirm('تحویل سفارش '+(o.tracking_code||'')+' ثبت و سفارش تکمیل شود؟'))return;
 api('rpc/shop_admin_deliver',{method:'POST',body:{p_order_id:o.id,p_code:o.tracking_code}})
 .then(function(){alert('تحویل و تکمیل سفارش با موفقیت ثبت شد.');if(tab==='report')reportView();else ordersView()})
 .catch(function(e){alert('ثبت تحویل انجام نشد: '+(errMsg(e)||'دسترسی مدیر یا وضعیت سفارش را بررسی کنید.'))})
}
function reportView(){
 api('shop_orders?select=*&report_archived_at=is.null&order=created_at.desc&limit=1000').then(function(d){
  O=d||[];
  var pending=O.filter(function(o){return o.status==='shipping'}),
      approved=O.filter(function(o){return o.status==='approved'}),
      done=O.filter(function(o){return o.status==='done'}),
      cancelled=O.filter(function(o){return o.status==='cancelled'});
  function card(o){
   var i=O.indexOf(o),items=Array.isArray(o.items)?o.items:[],deliveryAction='';
   if(o.status==='approved')deliveryAction='<button class="dlbtn" onclick="finalizeDelivery('+i+')">ثبت تحویل و تکمیل سفارش</button>';
   return '<article class="rpt-order"><div class="rpt-order-head"><b>'+esc(o.customer_name||'مشتری')+'</b><span class="st">'+esc(ST[o.status]||o.status||'نامشخص')+'</span></div><div class="rpt-meta">کد سفارش: <b dir="ltr">'+esc(o.tracking_code||'—')+'</b></div><div class="rpt-meta">شماره تماس: <b dir="ltr">'+esc(o.phone||'')+'</b> · '+dt(o.created_at)+'</div><div class="rpt-meta">'+esc(o.address||'')+'</div>'+items.map(function(x){return '<div class="rpt-item">• '+(x.sku?'<b dir="ltr">['+esc(x.sku)+']</b> ':'')+esc(x.name)+' × '+f(x.qty)+' '+esc(x.unit||'')+' · '+pr(Number(x.qty||0)*Number(x.price||0))+'</div>'}).join('')+'<div class="rpt-total">مبلغ سفارش: '+pr(o.total)+'</div><div class="acts"><button onclick="docOrder('+i+')">📄 مشاهده گزارش سفارش (PDF)</button><button onclick="rptEditOpen('+i+')">✏️ ویرایش اطلاعات</button>'+deliveryAction+'<button onclick="rptArchive('+i+')">🗃️ بایگانی گزارش</button><button onclick="deleteOrder('+i+')">🗑️ حذف دائمی گزارش و سفارش</button></div><div id="rptedit_'+i+'" class="ar" style="display:none"><b>ویرایش گزارش</b><label>نام مشتری</label><input id="rpt_name_'+i+'" value="'+esc(o.customer_name||'')+'"><label>شماره تماس</label><input id="rpt_phone_'+i+'" value="'+esc(o.phone||'')+'"><label>نشانی</label><textarea id="rpt_address_'+i+'">'+esc(o.address||'')+'</textarea><button class="btn" onclick="rptSaveEdit('+i+')">ذخیره</button></div></article>'
  }
  function group(t,cl,a){return '<section class="rpt-group '+cl+'"><div class="rpt-group-head"><b>'+t+'</b><strong>'+f(a.length)+'</strong></div>'+(a.length?a.map(card).join(''):'<p class="rpt-empty">سفارشی وجود ندارد.</p>')+'</section>'}
  var h='<div class="rpt-intro"><b>گزارش و بایگانی سفارش‌ها</b><p>سفارش پس از ثبت در انتظار تأیید مدیر قرار می‌گیرد. مدیر پس از بررسی سفارش، آن را تأیید می‌کند و هنگام تحویل کالا، سفارش را تکمیل می‌کند. مشتری فقط می‌تواند وضعیت سفارش را پیگیری کند.</p></div><div class="rpt-summary"><div class="rpt-count-card rpt-amber"><b>در انتظار تأیید مدیر</b><strong>'+f(pending.length)+'</strong><small>بررسی سفارش توسط مدیر</small></div><div class="rpt-count-card rpt-blue"><b>تأییدشده؛ در انتظار تحویل</b><strong>'+f(approved.length)+'</strong><small>ثبت تحویل و تکمیل توسط مدیر</small></div><div class="rpt-count-card rpt-green"><b>تکمیل‌شده</b><strong>'+f(done.length)+'</strong><small>تحویل در سامانه ثبت شده است</small></div></div>';
  h+=group('سفارش‌های در انتظار تأیید مدیر','rpt-amber',pending)+group('سفارش‌های تأییدشده؛ در انتظار تحویل','rpt-blue',approved)+group('سفارش‌های تکمیل‌شده','rpt-green',done);
  if(cancelled.length)h+=group('سفارش‌های لغوشده','rpt-red',cancelled);
  $('ab').innerHTML=h
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
 P.forEach(function(x,i){h+='<div class="ar"><div class="row" style="border:0">'+(x.image_url?'<img class="thumb" src="'+esc(x.image_url)+'" alt="">':'<span style="font-size:34px">'+esc(x.emoji)+'</span>')+'<div style="flex:1"><input type="file" accept="image/*" onchange="upImg('+i+',this)" style="margin:0"><div id="pm'+i+'" class="mu"></div></div></div><div class="g" style="display:grid;grid-template-columns:1fr 1fr;gap:6px"><input value="'+esc(x.sku||'بدون SKU')+'" dir="ltr" readonly title="کد کالا ثابت است" style="font-weight:800;background:var(--bg)"><input id="pn'+i+'" value="'+esc(x.name)+'" placeholder="نام"><input id="pc'+i+'" value="'+esc(x.category)+'" placeholder="دسته"><input id="pp'+i+'" type="number" value="'+x.price+'" placeholder="قیمت (تومان)"><input id="pu'+i+'" value="'+esc(x.unit)+'" placeholder="واحد"><input id="pe'+i+'" value="'+esc(x.emoji)+'" placeholder="ایموجی"><select id="ps'+i+'"><option value="1"'+(x.in_stock?' selected':'')+'>موجود</option><option value="0"'+(x.in_stock?'':' selected')+'>ناموجود</option></select></div>'+
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
initApp();
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
 var rows=items.map(function(x,n){return '<tr><td>'+f(n+1)+'</td><td dir="ltr">'+esc(x.sku||'—')+'</td><td>'+esc(x.name)+'</td><td>'+esc(x.unit||'')+'</td><td>'+f(x.qty)+'</td><td>'+pr(x.price)+'</td><td>'+pr(Number(x.price||0)*Number(x.qty||0))+'</td></tr>'}).join('');
 var report='<div id="orderPdfSource" dir="rtl" style="width:100%;max-width:780px;margin:12px auto;padding:18px;background:#fff;color:#111;font-family:Vazirmatn,Tahoma,sans-serif;font-size:13px;line-height:1.9;border:1px solid #ddd">'+docHead('گزارش سفارش کالا')+'<p style="font-size:11px;color:#444">قیمت‌های این سند، قیمت ثبت‌شده هنگام ثبت سفارش هستند.</p><table style="width:100%;border-collapse:collapse"><tr><td>کد سفارش</td><td dir="ltr"><b>'+esc(o.tracking_code||'')+'</b></td><td>تاریخ ثبت</td><td>'+dt(o.created_at)+'</td></tr><tr><td>وضعیت</td><td>'+esc(ST[o.status]||o.status||'')+'</td><td>مبلغ کل</td><td><b>'+pr(o.total)+'</b></td></tr><tr><td>نام مشتری</td><td>'+esc(o.customer_name||'')+'</td><td>شماره تماس</td><td dir="ltr">'+esc(o.phone||'')+'</td></tr><tr><td>نشانی</td><td>'+esc(o.address||'')+'</td></tr></table><br><table style="width:100%;border-collapse:collapse"><tr><th>ردیف</th><th>SKU</th><th>نام کالا</th><th>واحد</th><th>تعداد</th><th>قیمت واحد</th><th>مبلغ ردیف</th></tr>'+rows+'<tr><td colspan="6"><b>جمع کل سفارش</b></td><td><b>'+pr(o.total)+'</b></td></tr></table>'+docFoot()+'</div>';
 $('in').innerHTML='<div class="row"><b>گزارش سفارش (PDF)</b><button class="link" onclick="closeSh()">بستن</button></div><p class="mu">گزارش سفارش فقط در پنل مدیر نمایش داده می‌شود.</p><div id="orderPdfFrame" style="width:100%;height:65vh;min-height:360px;background:#eee;border:1px solid var(--bd);border-radius:10px;overflow:hidden;display:flex;align-items:center;justify-content:center">در حال ساخت PDF…</div><div id="orderPdfDownload" style="margin-top:8px"></div>'+report;
 var source=$('orderPdfSource');$('orderPdfFrame').textContent='در حال آماده‌سازی فایل PDF…';
 ensureHtml2Pdf().then(function(){if(!$('orderPdfFrame'))return;return html2pdf().set({margin:8,filename:'barqyar-order-'+String(o.tracking_code||o.id)+'.pdf',image:{type:'jpeg',quality:0.98},html2canvas:{scale:1.5,useCORS:true,backgroundColor:'#ffffff',scrollX:0,scrollY:0},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}}).from(source).outputPdf('blob').then(function(blob){if(!$('orderPdfFrame'))return;if(orderPdfUrl)URL.revokeObjectURL(orderPdfUrl);orderPdfUrl=URL.createObjectURL(blob);$('orderPdfFrame').innerHTML='<iframe title="گزارش سفارش PDF" src="'+orderPdfUrl+'" style="width:100%;height:100%;border:0;background:#fff"></iframe>';source.style.display='none';$('orderPdfDownload').innerHTML='<a class="btn dl" href="'+orderPdfUrl+'" download="barqyar-order-'+esc(o.tracking_code||o.id)+'.pdf">⬇️ دریافت فایل PDF</a>'}).catch(function(e){console.error('PDF error',e);$('orderPdfFrame').textContent='ساخت PDF ناموفق بود؛ نسخه چاپی را به PDF ذخیره کنید.';$('orderPdfDownload').innerHTML='<button class="btn" onclick="printOrderFallback()">چاپ / ذخیره PDF</button>'})})
}
function printOrderFallback(){var s=$('orderPdfSource');if(s)printDoc(s.outerHTML)}
function docFinal(){if(!token||!managerAccess)return;api('shop_orders?select=*&status=eq.done&report_archived_at=is.null&order=delivered_at.desc.nullslast&limit=1000').then(function(d){d=d||[];var sum=d.reduce(function(a,o){return a+Number(o.total||0)},0);var rows=d.map(function(o,n){return '<tr><td>'+f(n+1)+'</td><td dir="ltr">'+esc(o.tracking_code||'')+'</td><td>'+esc(o.customer_name)+'</td><td>'+esc(o.phone)+'</td><td>'+pr(o.total)+'</td><td>'+dt(o.delivered_at)+'</td></tr>'}).join('');printDoc(docHead('گزارش نهایی سفارش‌های تکمیل‌شده')+'<table><tr><td>تعداد سفارش</td><td>'+f(d.length)+'</td><td>جمع مبلغ</td><td>'+pr(sum)+'</td></tr></table><br><table><tr><th>ردیف</th><th>کد سفارش</th><th>مشتری</th><th>تلفن</th><th>مبلغ</th><th>تاریخ تکمیل</th></tr>'+(rows||'<tr><td colspan="6">سفارشی ثبت نشده است.</td></tr>')+'</table>'+docFoot())}).catch(function(e){alert(errMsg(e)||'دریافت گزارش انجام نشد')})}
