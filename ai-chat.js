/* برق‌یار - مشاور هوشمند آزمایشی */
(function(){
  'use strict';
  var history=[], busy=false;
  function el(tag,attrs,html){var n=document.createElement(tag);Object.keys(attrs||{}).forEach(function(k){n.setAttribute(k,attrs[k])});if(html!==undefined)n.innerHTML=html;return n}
  function init(){
    if(document.getElementById('barqyarAiLauncher'))return;
    var style=el('style',{},`
      #barqyarAiLauncher{position:fixed;left:14px;bottom:88px;z-index:30;border:0;border-radius:999px;padding:12px 16px;background:linear-gradient(135deg,#0b5f91,#102b45);color:#fff;font:700 13px Vazirmatn,Tahoma,sans-serif;box-shadow:0 7px 22px #102b4544;cursor:pointer}
      #barqyarAiPanel{position:fixed;inset:auto 10px 10px 10px;z-index:40;max-width:560px;margin:auto;height:min(78vh,680px);display:none;flex-direction:column;background:var(--card,#fff);color:var(--tx,#17202b);border:1px solid var(--bd,#ddd);border-radius:18px;box-shadow:0 15px 50px #0005;overflow:hidden;font-family:Vazirmatn,Tahoma,sans-serif}
      #barqyarAiPanel.open{display:flex}
      #barqyarAiHead{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:#102b45;color:#fff}
      #barqyarAiHead button{border:0;background:transparent;color:#fff;font-size:22px}
      #barqyarAiNotice{padding:8px 12px;font-size:11px;line-height:1.8;background:#fff7e6;color:#754b0b}
      #barqyarAiMessages{flex:1;overflow:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
      .bqai-msg{max-width:90%;padding:9px 11px;border-radius:13px;font-size:13px;line-height:1.9;white-space:pre-wrap;overflow-wrap:anywhere}
      .bqai-user{align-self:flex-start;background:#dbeafe;color:#123}
      .bqai-assistant{align-self:flex-end;background:var(--bg,#f4f6f8);border:1px solid var(--bd,#ddd)}
      #barqyarAiForm{display:flex;gap:7px;padding:10px;border-top:1px solid var(--bd,#ddd)}
      #barqyarAiInput{margin:0;min-width:0;flex:1;resize:none}
      #barqyarAiSend{border:0;border-radius:10px;padding:0 14px;background:#f6bd45;color:#19344d;font:700 13px Vazirmatn,Tahoma,sans-serif}
      #barqyarAiSend:disabled{opacity:.5}
      @media(min-width:600px){#barqyarAiPanel{left:18px;right:auto;bottom:18px;width:440px;height:650px}}
    `);
    document.head.appendChild(style);
    var launch=el('button',{id:'barqyarAiLauncher',type:'button'},'✦ مشاور هوشمند');
    var panel=el('section',{id:'barqyarAiPanel','aria-label':'مشاور هوشمند برق‌یار'},'<div id="barqyarAiHead"><b>✦ مشاور هوشمند برق‌یار <small>آزمایشی</small></b><button type="button" id="barqyarAiClose" aria-label="بستن">×</button></div><div id="barqyarAiNotice">پاسخ‌ها راهنمای اولیه هستند. برای کار با برق شهر، حتماً برق را از فیوز اصلی قطع کنید و در موارد تخصصی از برق‌کار مجاز کمک بگیرید. قیمت و موجودی فقط از فهرست ثبت‌شده برق‌یار اعلام می‌شود.</div><div id="barqyarAiMessages" aria-live="polite"><div class="bqai-msg bqai-assistant">سلام! درباره انتخاب و کاربرد کالاهای برق ساختمان چه سؤالی دارید؟</div></div><form id="barqyarAiForm"><textarea id="barqyarAiInput" rows="2" maxlength="1000" placeholder="مثلاً برای روشنایی اتاق چه نوع لامپی مناسب است؟" required></textarea><button id="barqyarAiSend" type="submit">ارسال</button></form>');
    document.body.appendChild(launch);document.body.appendChild(panel);
    launch.addEventListener('click',function(){panel.classList.add('open');document.getElementById('barqyarAiInput').focus()});
    document.getElementById('barqyarAiClose').addEventListener('click',function(){panel.classList.remove('open')});
    document.getElementById('barqyarAiForm').addEventListener('submit',send);
  }
  function add(role,text){var box=document.getElementById('barqyarAiMessages');var m=el('div',{class:'bqai-msg '+(role==='user'?'bqai-user':'bqai-assistant')});m.textContent=text;box.appendChild(m);box.scrollTop=box.scrollHeight}
  function send(e){
    e.preventDefault();if(busy)return;
    var input=document.getElementById('barqyarAiInput'),message=input.value.trim();if(!message)return;
    if(message.length>1000){add('assistant','لطفاً پرسش را کوتاه‌تر و حداکثر ۱۰۰۰ نویسه وارد کنید.');return}
    var di=typeof getActivationIdentity==='function'?getActivationIdentity():null;
    if(!di||!di.id||!di.secret){add('assistant','اطلاعات فعال‌سازی این دستگاه در دسترس نیست. لطفاً برنامه را دوباره باز و فعال‌سازی را بررسی کنید.');return}
    add('user',message);history.push({role:'user',content:message});if(history.length>8)history=history.slice(-8);
    input.value='';busy=true;var btn=document.getElementById('barqyarAiSend');btn.disabled=true;btn.textContent='…';
    fetch(SB+'/functions/v1/barqyar-ai-chat',{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json','x-client-info':'barqyar-device='+di.id+';secret='+di.secret},body:JSON.stringify({messages:history})})
    .then(function(r){return r.json().catch(function(){return {}}).then(function(d){if(!r.ok){var x=new Error(d.error||'پاسخ‌گویی موقتاً در دسترس نیست.');x.status=r.status;throw x}return d})})
    .then(function(d){var answer=String(d.answer||'پاسخی دریافت نشد.');add('assistant',answer);history.push({role:'assistant',content:answer});if(history.length>8)history=history.slice(-8)})
    .catch(function(err){var msg=err.status===429?'سقف آزمایشی پرسش‌ها برای این دستگاه موقتاً پر شده است. کمی بعد دوباره تلاش کنید.':err.status===503?'مشاور هنوز آماده نیست؛ مدیر باید کلید امن سرویس هوش مصنوعی را در تنظیمات سرور وارد کند.':'ارتباط با مشاور برقرار نشد. لطفاً بعداً دوباره تلاش کنید.';add('assistant',msg)})
    .finally(function(){busy=false;btn.disabled=false;btn.textContent='ارسال';input.focus()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();