(function () {
  'use strict';
  const $ = id => document.getElementById(id), cfg = window.YOMEMADO_CONFIG || {}, S = window.YomemadoState;
  const letters = (Array.isArray(window.YOMEMADO_LETTERS) ? window.YOMEMADO_LETTERS : []).slice().sort((a,b)=>a.id.localeCompare(b.id));
  const ids = new Set();
  for (const l of letters) {
    if (!/^\d{3}$/.test(l.id) || ids.has(l.id) || !l.date || !l.title || !l.place || !Array.isArray(l.paragraphs) || !l.paragraphs.length || !Number.isFinite(l.mapX) || !Number.isFinite(l.mapY) || l.mapX<0 || l.mapX>100 || l.mapY<0 || l.mapY>100 || !l.frontImage || !l.backImage) {
      $('mapTip').textContent='DATA ERROR · 请检查 letters.js 的字段'; throw Error('Invalid public letter: '+String(l.id));
    }
    ids.add(l.id);
  }
  if (!letters.length) { $('mapTip').textContent='NO LETTERS · 请在 letters.js 添加来信'; return; }
  const key=cfg.storageKey||'yomemado-public-letters-v1', lookup=Object.fromEntries(letters.map(l=>[l.id,l]));
  let saved={letters:{}};
  try {const x=JSON.parse(localStorage.getItem(key)||'null');if(x&&x.letters&&typeof x.letters==='object')saved=x;}catch(_){}
  let activeId=letters.at(-1).id,step='idle',archiveOpen=false,readerOpen=false,flipped=false,soundOn=true,toastTimer,musicStep=0;
  const active=()=>lookup[activeId],state=l=>S.stateFor(letters,saved,cfg.initialCollectedIds,l);
  const persist=()=>{try{localStorage.setItem(key,JSON.stringify(saved));}catch(_){toast('当前浏览器无法保存本地记录');}};
  const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function assetURL(src){const u=new URL(src,location.href);if(!['http:','https:','file:'].includes(u.protocol))throw Error('Use a relative or HTTPS image URL');return u.href;}
  const img=(src,alt)=>`<img class="stamp-full-image" src="${escapeHTML(assetURL(src))}" alt="${escapeHTML(alt)}" decoding="async">`;
  function toast(t){clearTimeout(toastTimer);$('toast').textContent=t;$('toast').classList.add('show');toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2500);}
  window.yomemadoNotify=toast;
  document.title=cfg.siteTitle||document.title;document.querySelector('.name-main').textContent=cfg.siteTitle||'游目窗 · 浮世来信机';
  if(cfg.fontFamily)document.documentElement.style.setProperty('--public-font',cfg.fontFamily);
  try{soundOn=localStorage.getItem(key+'-sound')!=='off';}catch(_){}
  // Procedural interaction sounds, with no bundled third-party recording.
  let context;
  function tone(f,offset=0,duration=.05,volume=.025){
    if(!soundOn)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    context||=new C();if(context.state==='suspended')context.resume().catch(()=>{});
    const o=context.createOscillator(),g=context.createGain(),t=context.currentTime+offset;
    o.type='triangle';o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(.00001,t);g.gain.linearRampToValueAtTime(volume,t+.008);g.gain.exponentialRampToValueAtTime(.00001,t+duration);
    o.connect(g);g.connect(context.destination);o.start(t);o.stop(t+duration+.02);
  }
  function sfx(k){if(k==='mechanism'){tone(220,0,.08,.055);for(let i=0;i<8;i++)tone(230+i%2*60,.22+i*.08,.035);tone(784,1.15,.26);tone(1047,1.27,.32);}else if(k==='paper'){tone(1500,0,.035,.009);tone(1000,.04,.055,.008);}else if(k==='save'){tone(660);tone(880,.08,.14);}else tone(k==='pickup'?380:540,0,.045,.015);}
  window.yomemadoPlaySfx=sfx;
  function soundButtons(){for(const id of ['sfxToggle','readerSoundToggle']){$(id).setAttribute('aria-pressed',String(soundOn));$(id).setAttribute('aria-label',soundOn?'关闭音效':'开启音效');}$('sfxToggle').classList.toggle('on',soundOn);$('readerSoundToggle').classList.toggle('is-muted',!soundOn);}
  function toggleSound(){soundOn=!soundOn;try{localStorage.setItem(key+'-sound',soundOn?'on':'off');}catch(_){}soundButtons();if(soundOn)sfx('tap');}
  const music=$('farewellAudio');music.preload='none';
  if(cfg.musicUrl){const u=new URL(cfg.musicUrl,location.href);if(['http:','https:','file:'].includes(u.protocol))music.src=u.href;}
  $('audioKnob').addEventListener('click',()=>{if(!cfg.musicUrl){toast('尚未配置音乐；可在 config.js 换成自己有使用权的音乐');return;}musicStep=(musicStep+1)%5;music.volume=musicStep/4;if(musicStep)music.play().catch(()=>toast('音乐无法播放，请检查地址或浏览器权限'));else music.pause();$('audioKnob').setAttribute('aria-label','乐音音量'+musicStep*25+'%，点击切换');});
  function sync(l){$('readerFront').innerHTML=img(l.frontImage,l.title+' · 邮票正面');$('readerBack').innerHTML=img(l.backImage,l.title+' · 邮票背面');$('ejectStamp').innerHTML=img(l.frontImage,l.title+' · 出票');$('readerShade').dataset.letterId=l.id;$('readerShade').querySelector('.reader-top span').textContent='YOMEMADO · LETTER '+l.id;window.yomemadoActiveLetter=l;}
  const pins={};
  function createPins(){const first=$('firstPin');letters.forEach((l,i)=>{const p=i?document.createElement('button'):first;if(i){p.className='pin';p.innerHTML='<span class="pin-wave"></span><span class="pin-core"></span>';first.parentNode.insertBefore(p,$('pinLabel'));}p.id='pin-'+l.id;p.type='button';Object.assign(p.style,{left:l.mapX+'%',top:l.mapY+'%',zIndex:'20',pointerEvents:'auto'});p.title=l.place+' · '+(l.region||'');p.setAttribute('aria-label','选择'+l.place+'来信 '+l.id);p.addEventListener('click',()=>select(l.id));pins[l.id]=p;});$('mapCount').textContent=String(letters.length).padStart(2,'0');}
  function select(id){if(step==='dispensing')return;activeId=id;sync(active());step='ready';render();sfx('tap');}
  function render(){
    const l=active(),q=state(l);
    for(const x of letters){pins[x.id].classList.toggle('read',state(x).read);pins[x.id].classList.toggle('selected',x.id===activeId&&step==='ready');}
    $('releaseBtn').disabled=step!=='ready';$('readyLed').classList.toggle('active',step==='ready');$('outputLed').classList.toggle('active',['dispensing','ejected'].includes(step));$('doneLed').classList.toggle('active',q.collected);$('ticketExit').classList.toggle('ejected',step==='ejected');$('mailTrace').classList.toggle('active',step==='dispensing');
    document.querySelectorAll('.release-lamps .bar-light').forEach((e,i)=>e.classList.toggle('lit',step==='dispensing'?i<3:step==='ejected'||q.collected||i===0));
    $('pinLabel').textContent=l.id+' · '+l.place.toUpperCase();$('pinLabel').style.left=l.mapX+'%';
    $('displayLine').textContent=step==='dispensing'?'DISPENSING':'LETTER '+l.id;
    const xy=Number.isFinite(l.latitude)&&Number.isFinite(l.longitude)?` · ${l.latitude.toFixed(4)} / ${l.longitude.toFixed(4)}`:'';
    $('displaySub').textContent=[l.place,l.region].filter(Boolean).join(' · ').toUpperCase()+xy;$('mapNotice').textContent=step==='ejected'?'TAKE YOUR LETTER · 请取信':'A LITTLE WORLD, DELIVERED TO YOU';$('mapTip').textContent=step==='ready'?'SELECTED · PRESS RELEASE TO RECEIVE':'TOUCH THE ILLUMINATED POINT · 点击亮起的地点';
    const archived=letters.filter(x=>state(x).collected).sort((a,b)=>b.id.localeCompare(a.id));$('collectedCount').textContent=String(archived.length).padStart(3,'0');$('archiveList').replaceChildren();
    for(const x of archived){const b=document.createElement('button');b.type='button';b.className='archive-card';b.innerHTML=`<div class="tiny-postage mini-stamp" aria-hidden="true"><div class="stamp">${img(x.frontImage,'')}</div></div><div class="archive-detail"><span class="archive-tag">${escapeHTML(x.id)} · READ / 已读</span><b>${escapeHTML(x.title)}</b><span>${escapeHTML([x.place,x.region].filter(Boolean).join(' · '))}</span><span>示例日期：${escapeHTML(x.date)}</span></div>`;b.addEventListener('click',()=>{activeId=x.id;sync(x);step='idle';toggleArchive(false);render();openReader();});$('archiveList').appendChild(b);}
  }
  function toggleArchive(open){archiveOpen=open;$('archive').classList.toggle('open',open);$('archive').setAttribute('aria-hidden',String(!open));$('archiveShade').classList.toggle('visible',open);document.body.classList.toggle('archive-open',open);}
  function openReader(){readerOpen=true;flipped=false;$('readerCard').classList.remove('flipped');$('readerMessage').textContent=(cfg.receiverName||'收信人')+'，轻触邮票，翻阅背面的示例来信。';$('readerShade').classList.add('visible');$('readerShade').setAttribute('aria-hidden','false');$('flipBtn').focus();}
  function closeReader(){readerOpen=false;$('readerShade').classList.remove('visible');$('readerShade').setAttribute('aria-hidden','true');step='idle';render();$('openArchive').focus();}
  function flip(){flipped=!flipped;$('readerCard').classList.toggle('flipped',flipped);$('readerMessage').textContent=flipped?'这是一枚公开测试样例，可替换成自己的画面和来信。':(cfg.receiverName||'收信人')+'，轻触邮票，翻阅背面的示例来信。';if(flipped){saved.letters[activeId]={...saved.letters[activeId],readFor:S.identity(active())};persist();render();}sfx('paper');}
  $('releaseBtn').addEventListener('click',()=>{if(step!=='ready')return;step='dispensing';render();sfx('mechanism');setTimeout(()=>{step='ejected';render();toast('邮票已抵达 · 点击出口拾取');},1250);});
  $('ticketPick').addEventListener('click',()=>{if(step==='ejected'){sfx('pickup');openReader();}});
  $('openArchive').addEventListener('click',()=>toggleArchive(!archiveOpen));$('closeArchive').addEventListener('click',()=>toggleArchive(false));$('archiveShade').addEventListener('click',()=>toggleArchive(false));$('readerCard').addEventListener('click',flip);$('flipBtn').addEventListener('click',flip);
  $('closeReader').addEventListener('click',()=>{saved.letters[activeId]={...saved.letters[activeId],manualCollectedFor:S.identity(active()),readFor:S.identity(active())};persist();sfx('save');closeReader();toast('来信已收入藏信册');});
  $('readerShade').addEventListener('click',e=>{if(e.target===$('readerShade'))closeReader();});$('sfxToggle').addEventListener('click',toggleSound);$('readerSoundToggle').addEventListener('click',toggleSound);
  $('reprintLetter')?.addEventListener('click',()=>{if(step==='dispensing')return;if(readerOpen)closeReader();toggleArchive(false);step='ready';render();});document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(readerOpen)closeReader();else toggleArchive(false);}});
  function alignArchive(){const r=$('machine').getBoundingClientRect();$('archive').style.setProperty('--archive-machine-top',r.top+scrollY+'px');$('archive').style.setProperty('--archive-machine-height',r.height+'px');}
  new ResizeObserver(alignArchive).observe($('machine'));window.addEventListener('resize',alignArchive);createPins();sync(active());soundButtons();render();alignArchive();
})();
