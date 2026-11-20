(function(){
"use strict";
if(window.__barqyarPriceAdminInstalled)return;
window.__barqyarPriceAdminInstalled=true;
var baseAdminView=window.adminView, busy=false;
var css=".bp-note{border:1px solid var(--bd);background:var(--card);border-radius:13px;padding:11px;margin:9px 0;font-size:12px;line-height:1.9}.bp-run{width:100%;padding:13px;border:0;border-radius:12px;background:linear-gradient(135deg,#b45309,#f59e0b);color:#1b2330;font:inherit;font-weight:800}.bp-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:9px 0}.bp-stat,.bp-card{border:1px solid var(--bd);background:var(--card);border-radius:12px;padding:10px}.bp-stat{text-align:center}.bp-stat b{display:block;font-size:20px;color:var(--ac2)}.bp-stat small,.bp-muted{font-size:11px;color:var(--mu)}.bp-card{margin:10px 0}.bp-head{display:flex;justify-content:space-between;gap:8px}.bp-sku{direction:ltr;color:var(--mu);font-size:11px}.bp-prices{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:9px 0}.bp-prices div{background:var(--bg);border-radius:9px;padding:8px;font-size:11px}.bp-prices b{display:block;font-size:13px;margin-top:3px}.bp-source{border-inline-start:3px solid var(--ac);padding:7px 8px;margin:6px 0;background:var(--bg);font-size:11px;overflow-wrap:anywhere}.bp-source a{color:var(--ac2);font-weight:700}.bp-source small{display:block;color:var(--mu)}.bp-actions{display:flex;gap:7px;margin-top:8px}.bp-actions button{flex:1;border:0;border-radius:9px;padding:10px;font:inherit;font-weight:700}.bp-yes{background:#15803d;color:white}.bp-no{background:#fee2e2;color:#991b1b}.bp-pill{font-size:10px;border-radius:20px;padding:3px 7px;background:#fef3c7;color:#92400e}.bp-empty{border:1px dashed var(--bd);padding:14px;border-radius:12px;text-align:center;color:var(--mu);font-size:12px}";
var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
function e(s){return window.esc?window.esc(s):String(s||"").replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function n(v){return Number(v||0).toLocaleString("fa-IR")}
function money(v){return v==null?"یافت نشد":n(v)+" تومان"}
function dt(v){return v?new Date(v).toLocaleString("fa-IR"):"—"}
function api(path,o){return window.api(path,o||{})}
function tabs(){return '<div class="tabs"><button class="chip" onclick="tab=\'orders\';adminView()">سفارش‌ها</button><button class="chip" onclick="tab=\'products\';adminView()">کالاها</button><button class="chip" onclick="tab=\'master\';adminView()">جدول مادر قیمت و موجودی</button><button class="chip" onclick="tab=\'report\';adminView()">گزارش</button><button class="chip on">قیمت هوشمند</button></div>'}
function page(){
if(!window.token||!window.managerAccess){baseAdminView();return}
$("in").innerHTML='<div class="row"><h3 style="margin:0">⚙️ مدیریت</h3><button class="link" onclick="logout()">خروج</button></div>'+tabs()+
'<div class="bp-note"><b>هوشمند بروزرسانی قیمت</b><br>بازار ایران · منابع عمده و خرده‌فروشی · فاصله ۱۴ روز<br>همه کالاهای جدول مادر در هر اجرا بررسی می‌شوند؛ کالای جدید نیز در اجرای بعدی خودکار اضافه می‌شود.<br><b>ثبت قیمت فقط با تأیید مدیر انجام می‌شود.</b></div>'+
'<button class="bp-run" id="bpStart" onclick="barqyarStartPriceScan()">🔎 شروع جستجوی قیمت همه کالاها</button><p id="bpProgress" class="bp-muted" aria-live="polite"></p><div id="bpSummary"></div><div id="bpList"><p class="bp-empty">در حال دریافت اطلاعات…</p></div>';
load();
if(window.startPoll)startPoll();
}
function load(){
Promise.all([api("shop_price_update_runs?select=*&order=created_at.desc&limit=1"),api("shop_price_candidates?select=*&order=created_at.desc&limit=100")])
.then(function(r){
var run=(r[0]||[])[0],all=r[1]||[],cs=run?all.filter(function(x){return x.run_id===run.id}):[];
var pending=cs.filter(function(x){return x.status==="pending"}).length,src=cs.filter(function(x){return x.sources&&x.sources.length}).length;
var label=run?(run.status==="completed"?"تکمیل‌شده":run.status==="running"?"در حال اجرا":"ناموفق"):"هنوز اجرا نشده";
$("bpSummary").innerHTML='<div class="bp-note"><b>آخرین اجرا: '+label+'</b><div class="bp-muted">زمان: '+dt(run&&run.started_at)+' · کالاهای بررسی‌شده: '+n(run&&run.product_count)+'</div>'+(run&&run.error_message?'<p class="err">'+e(run.error_message)+'</p>':'')+'</div>'+
'<div class="bp-stats"><div class="bp-stat"><b>'+n(cs.length)+'</b><small>کالاهای بررسی‌شده</small></div><div class="bp-stat"><b>'+n(pending)+'</b><small>در انتظار بررسی</small></div><div class="bp-stat"><b>'+n(src)+'</b><small>دارای منبع</small></div></div>';
if(!cs.length){$("bpList").innerHTML='<p class="bp-empty">هنوز پیشنهادی ثبت نشده است. جستجوی اولیه را شروع کنید.</p>';return}
$("bpList").innerHTML='<h4>فهرست قیمت‌های پیشنهادی</h4>'+cs.map(card).join("");
}).catch(function(x){$("bpSummary").innerHTML='<p class="err">خواندن اطلاعات ناموفق بود: '+e(x.message)+'</p>';$("bpList").innerHTML=""});
}
function card(c){
var ok=c.match_status==="verified"&&Number(c.match_confidence)>=.7&&c.unit_match===true&&c.sources&&c.sources.length>0;
var status=c.status==="approved"?"تأیید و ثبت شد":c.status==="rejected"?"رد شد":ok?"قابل بررسی":"نیازمند بررسی بیشتر";
var sources=(c.sources||[]).map(function(s){return '<div class="bp-source"><a target="_blank" rel="noopener" href="'+e(s.url)+'">'+e(s.title||s.url)+'</a><small>'+(s.source_type==="wholesale"?"عمده‌فروشی":s.source_type==="retail"?"خرده‌فروشی":"منبع دیگر")+' · '+money(s.price)+' · واحد: '+e(s.unit||"نامشخص")+' · '+e(s.observed_at||"")+'</small></div>'}).join("")||'<p class="bp-muted">منبع قیمت معتبر یافت نشد.</p>';
var act=c.status==="pending"?'<label class="bp-muted" for="bpfin_'+c.id+'">قیمت نهایی مورد تأیید مدیر (تومان)</label><input id="bpfin_'+c.id+'" type="number" min="1" step="1" value="'+(c.suggested_price||"")+'" placeholder="قیمت نهایی">'+
'<div class="bp-actions"><button class="bp-yes" '+(ok?"":"disabled title=\"تطبیق کالا و واحد و منبع کافی نیست\"")+' onclick="barqyarReviewPrice(\''+c.id+'\',\'approve\')">تأیید و ثبت قیمت</button><button class="bp-no" onclick="barqyarReviewPrice(\''+c.id+'\',\'reject\')">رد پیشنهاد</button></div>'+
(!ok?'<p class="bp-note">ثبت فقط زمانی مجاز است که منبع واقعی، واحد منطبق و اطمینان حداقل ۷۰٪ وجود داشته باشد.</p>':''):
'<p class="bp-muted">قیمت نهایی ثبت‌شده: '+money(c.approved_price)+' · '+dt(c.reviewed_at)+'</p>';
return '<div class="bp-card"><div class="bp-head"><div><b>'+e(c.product_name)+'</b><div class="bp-sku">'+e(c.product_sku)+'</div></div><span class="bp-pill">'+status+'</span></div>'+
'<div class="bp-muted">دسته: '+e(c.category||"—")+' · واحد: '+e(c.unit)+'</div>'+
'<div class="bp-prices"><div>قیمت فعلی<b>'+money(c.current_price)+'</b></div><div>پیشنهاد هوش مصنوعی<b>'+money(c.suggested_price)+'</b></div><div>عمده‌فروشی<b>'+money(c.wholesale_price)+'</b></div><div>خرده‌فروشی<b>'+money(c.retail_price)+'</b></div></div>'+
'<div class="bp-muted">اطمینان: '+n(Number(c.match_confidence)*100)+'٪ · تطبیق واحد: '+(c.unit_match?"بله":"خیر")+'</div>'+(c.notes?'<p class="bp-note">'+e(c.notes)+'</p>':'')+'<b class="bp-muted">منابع قیمت</b>'+sources+act+'</div>';
}
window.barqyarStartPriceScan=function(){
if(busy||!window.token||!window.managerAccess)return;busy=true;
var b=$("bpStart"),p=$("bpProgress");b.disabled=true;b.textContent="در حال جستجوی قیمت…";p.textContent="در حال بررسی تمام کالاهای جدول مادر و جستجوی منابع اینترنتی؛ ممکن است چند دقیقه طول بکشد.";
fetch("https://zgswoheckqasqoclhodg.supabase.co/functions/v1/barqyar-price-update",{method:"POST",headers:{apikey:window.KEY,Authorization:"Bearer "+window.token,"Content-Type":"application/json"},body:JSON.stringify({trigger:"manual"})})
.then(function(r){return r.json().then(function(d){if(!r.ok||!d.ok)throw new Error(d.error||"جستجو انجام نشد");return d})})
.then(function(d){p.textContent="پایان جستجو: "+n(d.products_scanned)+" کالا بررسی شد و "+n(d.candidates_saved)+" پیشنهاد ذخیره شد.";load()})
.catch(function(x){p.textContent="خطا: "+(x.message||"اتصال برقرار نشد");alert("جستجوی قیمت انجام نشد: "+(x.message||""))})
.finally(function(){busy=false;b.disabled=false;b.textContent="🔎 شروع جستجوی قیمت همه کالاها"});
};
window.barqyarReviewPrice=function(id,action){
var price=null;if(action==="approve"){price=Number($("bpfin_"+id).value);if(!Number.isFinite(price)||price<=0){alert("قیمت نهایی معتبر وارد کنید.");return}if(!confirm("قیمت تأییدشده در جدول مادر ثبت شود؟"))return}else if(!confirm("این پیشنهاد رد شود؟"))return;
api("rpc/shop_admin_review_price_candidate",{method:"POST",body:{p_candidate_id:id,p_action:action,p_final_price:price}})
.then(function(){alert(action==="approve"?"قیمت با تأیید مدیر در جدول مادر ثبت شد.":"پیشنهاد رد شد.");load()})
.catch(function(x){alert("عملیات انجام نشد: "+(x.message||""))});
};
window.adminView=function(){
if(!window.token||!window.managerAccess){baseAdminView();return}
if(window.tab==="prices"){page();return}
baseAdminView();
var t=document.querySelector(".tabs");if(t&&!document.getElementById("bpPriceTab")){var b=document.createElement("button");b.id="bpPriceTab";b.className="chip";b.textContent="قیمت هوشمند";b.onclick=function(){window.tab="prices";window.adminView()};t.appendChild(b)}
};
})();