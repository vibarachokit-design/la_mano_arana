'use strict';
(() => {
  const titles=['Mosca Pie','Gusano Dentudo','Piojo Guatón','Pulga Tóxica','Cucaracha Peinada','Hormiga Cabezona','Zancudo Vampirón','Araña Narigona','Escarabajo Peludo','Grillo Orejón','Mariposa Lengüilarga','Escorpión Coqueto','Ciempiés Zapatón','Mantis Rezongona','La Mano Araña Mutante','Rey Gusano','La Mosca Reina'];
  const descriptions=['Mosca + pie humano. ¡Demasiado peso para esas alas!','Gusano + dentadura. Su sonrisa deja un rastro de baba.','Piojo + guata gigante. Prefiere rodar entre los pelos.','Pulga + barril tóxico. Un salto y todo queda verde.','Cucaracha + peluquín. Nunca pierde su tupé.','Hormiga + cabeza gigante. Las migas tiemblan a su paso.','Zancudo + vampiro. Se marea con su propia picadura.','Araña + nariz. ¡Estornuda telarañas!','Escarabajo + gato. Caparazón por fuera, ronroneo por dentro.','Grillo + elefante. Escucha hasta los secretos más pequeños.','Mariposa + lengua. Sus alas traen las noticias más pegajosas.','Escorpión + cosméticos. El aguijón más coqueto del laboratorio.','Ciempiés + pies calzados. Nunca encuentra todos sus zapatos.','Mantis + cara rezongona. Barre con todo el que la moleste.','Mano + araña. La travesura original, en versión dorada.','Gusano + realeza basurera. Su corona huele a victoria.','Mosca + novia real. Sus huevos son un tesoro dorado.'];
  const cards=titles.map((name,i)=>({id:i+1,name,description:descriptions[i],rarity:i<6?'Común':i<11?'Rara':i<14?'Épica':'Legendaria'}));
  cards.push(...[{"id": 18, "name": "Araña Chueca", "rarity": "Común", "description": "Araña + pierna ortopédica. Teje torcido y se enreda en su propia telaraña."}, {"id": 19, "name": "Gorgojo Cebollón", "rarity": "Común", "description": "Gorgojo + cebolla. Hace llorar a sus amigos y brota cuando lo riegan."}, {"id": 20, "name": "Babosa Resbalosa", "rarity": "Común", "description": "Babosa + pista de patinaje. Lleva casco porque resbala hasta con su propia baba."}, {"id": 21, "name": "Termita Carpintera", "rarity": "Común", "description": "Termita + martillo y clavos. Construye muebles masticados y siempre le sobran tornillos."}, {"id": 22, "name": "Cochinilla Coqueta", "rarity": "Común", "description": "Cochinilla + espejo de bolsillo. Se enrolla para mirarse y arreglarse las antenas."}, {"id": 23, "name": "Saltamontes Saltona", "rarity": "Común", "description": "Saltamontes + cama elástica. Salta hasta el techo y nunca cae donde quiere."}, {"id": 24, "name": "Escarabajo Pelotero Fitness", "rarity": "Rara", "description": "Escarabajo pelotero + mancuerna. Entrena con su bola y entra en crisis si la pierde."}, {"id": 25, "name": "Luciérnaga Insomne", "rarity": "Rara", "description": "Luciérnaga + café triple. Sus ojeras brillan y se duerme cuando apagan la luz."}, {"id": 26, "name": "Libélula Helicóptero", "rarity": "Rara", "description": "Libélula + helicóptero. Lleva auriculares para soportar su motor, pero se marea en las alturas."}, {"id": 27, "name": "Chinche Apestosa", "rarity": "Rara", "description": "Chinche + perfume barato. Su nube perfumada espanta a todos, incluida ella misma."}, {"id": 28, "name": "Caracol Apurado", "rarity": "Rara", "description": "Caracol + patines. Siempre llega tarde y las bajadas lo aterrorizan."}, {"id": 29, "name": "Grillo Cantante de Ópera", "rarity": "Rara", "description": "Grillo + micrófono de ópera. Canta de madrugada; pedirle silencio solo aumenta el volumen."}, {"id": 30, "name": "Escorpión Bailarín de Tango", "rarity": "Épica", "description": "Escorpión + traje de tango. Baila con su aguijón y se paraliza si cambian la música."}, {"id": 31, "name": "Ciempiés Maratonista", "rarity": "Épica", "description": "Ciempiés + zapatillas de correr. Le faltan treinta nudos para llegar a la meta."}, {"id": 32, "name": "Mantis Boxeadora", "rarity": "Épica", "description": "Mantis + guantes de boxeo. Campeona de peso pluma, se distrae si aparece una mosca."}, {"id": 33, "name": "Abeja Reina Dramática", "rarity": "Épica", "description": "Abeja + corona de Miss. Reina de la colmena y del drama: exige néctar y aplausos."}, {"id": 34, "name": "Escarabajo Joyero", "rarity": "Épica", "description": "Escarabajo + joyas robadas. Su caparazón se desarma si pierde un brillante."}, {"id": 35, "name": "La Mano Araña Dorada", "rarity": "Legendaria", "description": "Mano araña + oro macizo. Teje hilos de oro, aunque tanto brillo pesa demasiado."}, {"id": 36, "name": "Rey Escarabajo Pelotero", "rarity": "Legendaria", "description": "Escarabajo pelotero + trono real. Corona de estiércol, capa de papel y cetro de cuchara."}, {"id": 37, "name": "La Mosca Madrina", "rarity": "Legendaria", "description": "Mosca + hada madrina. Concede deseos, pero siempre los entiende mal."}, {"id": 41, "name": "Pulga Trapecista", "rarity": "Épica", "description": "Pulga + trapecista. Hace triples mortales sobre su red de lechuga y aterriza en caras ajenas."}, {"id": 42, "name": "Lombriz Solitaria", "rarity": "Legendaria", "description": "Lombriz + compañera de piso. Ocho metros de inquilina, bata de ositos, té a las cinco y valijas."}, {"id": 43, "name": "Garrapata con Patas", "rarity": "Rara", "description": "Garrapata + ciempiés. Desfila con cuarenta zapatos y todos los cordones desatados."}]);
  const TOTAL=cards.length, SLOTS=44;
  const KEY='mano-album-v1';
  const PRICE=3000; // puntos por lámina comprada
  let data={counts:Array(SLOTS-1).fill(0),packs:1,special:0,small:0,dna:0,points:0,earned:{}}, awarded=new Set(),opened=false,resume=false;
  try {
    const v=JSON.parse(localStorage.getItem(KEY));
    if(v&&Array.isArray(v.counts)){
      data.counts=data.counts.map((_,i)=>Number.isSafeInteger(v.counts[i])&&v.counts[i]>=0?v.counts[i]:0);
      for(const k of ['packs','special','small','dna','points'])data[k]=Number.isSafeInteger(v[k])&&v[k]>=0?v[k]:0;
      data.special=Math.min(data.special,data.packs);
      // Sobres ya ganados por edificio ("2-5" = edificio 2, piso 5; "2-win" = victoria)
      if(v.earned&&typeof v.earned==='object')for(const k of Object.keys(v.earned))if(/^[1-6]-([2-9]|10|win)$/.test(k))data.earned[k]=true;
    }
  }catch{}
  const q=s=>document.querySelector(s),panel=q('#album-panel'),viewer=q('#card-view');
  function save(){try{localStorage.setItem(KEY,JSON.stringify(data));}catch{}update();}
  function update(){const n=cards.filter(c=>data.counts[c.id-1]>0).length;q('#album-launch').textContent=q('#album-menu').textContent=`ÁLBUM · ${n}/${TOTAL}`;const wins=Object.keys(data.earned).filter(k=>k.endsWith('-win')).length;q('#album-status').textContent=`${n}/${TOTAL} descubiertas · ${data.packs+data.small} sobre/s por abrir · ${data.dna} ADN · monedero ${data.points} pts · sobres de edificios ganados ${wins}/6`;q('#buy-card').disabled=data.points<PRICE;const big=data.packs>0;q('#open-pack').disabled=!big&&!data.small;q('#open-pack').textContent=!big&&data.small?'Abrir sobre · 1 lámina':data.special?'Abrir sobre especial · 3 láminas':'Abrir sobre · 3 láminas';q('#craft-card').disabled=data.dna<30||!cards.some(c=>c.rarity!=='Común'&&!data.counts[c.id-1]);}
  function tile(card,reveal=false){const b=document.createElement('button'),owned=data.counts[card.id-1]>0;b.type='button';b.className='sticker'+(!owned?' locked':'');const img=document.createElement('img');img.src=`${ASSET_BASE}thumbs/card-${String(card.id).padStart(2,'0')}.webp`;img.alt=card.name;img.loading='lazy';const label=document.createElement('span');label.textContent=`${String(card.id).padStart(2,'0')} · ${card.name} · ${card.rarity}`;const count=document.createElement('b');count.textContent=owned?'×'+data.counts[card.id-1]:'POR DESCUBRIR';b.append(img,count,label);b.onclick=()=>showCard(card.id);if(reveal)b.style.animationDelay=(reveal-1)*.12+'s';return b;}
  function render(){update();const filter=q('#album-filter').value;const grid=q('#album-grid');grid.replaceChildren();cards.filter(c=>filter==='all'||(filter==='owned'?data.counts[c.id-1]>0:!data.counts[c.id-1])).forEach(c=>grid.append(tile(c)));}
  function showCard(id){const card=cards.find(c=>c.id===id),count=data.counts[id-1];q('#card-image').src=`${ASSET_BASE}card-${String(id).padStart(2,'0')}.webp`;q('#card-image').alt=card.name;q('#card-detail').textContent=count?`${card.name} · ${card.rarity} · ${count} copia/s. ${card.description}`:`${card.name} · ${card.rarity}. Todavía no la tienes: completa edificios para ganar sobres o compra láminas con puntos${card.rarity!=='Común'?'; también puedes canjear ADN por una especial':''}.`;q('#card-image').style.filter=count?'':'grayscale(1) brightness(.5)';const actions=q('#card-actions');actions.replaceChildren();if(count>1){const b=document.createElement('button');b.textContent='Canjear 1 repetida → 10 ADN';b.onclick=()=>{if(data.counts[id-1]<=1)return;data.counts[id-1]--;data.dna+=10;save();render();showCard(id);};actions.append(b);}viewer.hidden=false;q('#card-close').focus();}
  function closeCard(){viewer.hidden=true;const el=q('#album-grid').querySelectorAll('button');(el[0]||q('#album-close')).focus();}
  function choose(special=false){
    const ranks=['Común','Rara','Épica','Legendaria'], weights=[58,30,9,3];
    const available=ranks.filter((r,i)=>(!special||i>0)&&cards.some(c=>c.rarity===r));
    let r=Math.random()*available.reduce((sum,k)=>sum+weights[ranks.indexOf(k)],0),rarity=available[available.length-1];
    for(const k of available){r-=weights[ranks.indexOf(k)];if(r<0){rarity=k;break;}}
    let pool=cards.filter(c=>c.rarity===rarity);const missing=pool.filter(c=>!data.counts[c.id-1]);
    if(missing.length&&Math.random()<.8)pool=missing;
    return pool[Math.floor(Math.random()*pool.length)];
  }

  /* ================= ANIMACIÓN DE SOBRE =================
     Sobre cerrado → se toca → tiembla y se rompe → salen las láminas boca abajo → se dan vuelta.
     Tocar la pantalla (o Enter/Espacio) adelanta la animación; un toque en una lámina la da vuelta. */
  const po={el:q('#pack-open'),pack:q('#pack-open .po-pack'),cardsBox:q('#pack-open .po-cards'),title:q('#pack-open .po-title'),hint:q('#pack-open .po-hint'),flash:q('#pack-open .po-flash'),done:q('#pack-open .po-done'),phase:'off',items:[],timers:[]};
  const later=(ms,fn)=>po.timers.push(setTimeout(fn,ms));
  const snd=fn=>{try{fn();}catch{}};
  const RCLASS={'Común':'r-comun','Rara':'r-rara','Épica':'r-epica','Legendaria':'r-legendaria'};
  function packReveal(items,opts={}){
    po.timers.forEach(clearTimeout);po.timers=[];po.items=items;po.cardsBox.replaceChildren();po.done.hidden=true;po.el.hidden=false;
    po.pack.className='po-pack'+(opts.special?' special':'');po.pack.querySelector('small').textContent=items.length===1?'1 LÁMINA':items.length+' LÁMINAS';
    po.pack.querySelector('b').textContent=opts.special?'SOBRE ESPECIAL':'SOBRE MUTANTE';
    po.title.textContent=opts.title||'';
    if(opts.pack){po.pack.hidden=false;po.phase='sealed';po.hint.textContent='Toca el sobre para abrirlo';po.pack.focus();}
    else{po.pack.hidden=true;po.hint.textContent='';startCards();}
  }
  function tearPack(){
    if(po.phase!=='sealed')return;po.phase='tearing';po.hint.textContent='';
    po.pack.classList.add('shake');snd(()=>{for(let i=0;i<3;i++)tone(170+i*40,.07,'square',.03,i*.13,1);});
    later(480,()=>{po.pack.classList.add('torn');po.flash.classList.remove('on');void po.flash.offsetWidth;po.flash.classList.add('on');snd(()=>noise(.4,.12,2400,0,null,1.1));try{navigator.vibrate&&navigator.vibrate(50);}catch{}});
    later(900,()=>po.pack.classList.add('out'));
    later(1000,startCards);
  }
  function startCards(){
    po.phase='cards';
    const n=po.items.length;po.cardsBox.style.setProperty('--cw',n>1?'min(27vw,175px,calc((min(60dvh,440px) - 60px)/1.5))':'min(48vw,240px,calc((min(60dvh,440px) - 60px)/1.5))');
    po.items.forEach((it,i)=>{
      const c=document.createElement('div');c.className='po-card '+RCLASS[it.card.rarity];c.tabIndex=-1;
      c.innerHTML='<div class="po-inner"><div class="po-back"><span>?</span></div><div class="po-front"><img alt=""></div></div><em class="po-new">¡NUEVA!</em><span class="po-label"></span>';
      c.querySelector('img').src=`${ASSET_BASE}card-${String(it.card.id).padStart(2,'0')}.webp`;c.querySelector('img').alt=it.card.name;
      c.querySelector('.po-label').textContent=`${it.card.name} · ${it.card.rarity}`;if(!it.isNew)c.querySelector('.po-new').remove();
      c.onclick=e=>{e.stopPropagation();flipCard(i);};
      po.cardsBox.append(c);later(60+i*140,()=>c.classList.add('in'));
    });
    po.items.forEach((_,i)=>later(750+i*620,()=>flipCard(i)));
  }
  function flipCard(i){
    const c=po.cardsBox.children[i];if(!c||c.classList.contains('flip'))return;c.classList.add('in','flip');
    const r=po.items[i].card.rarity;
    snd(()=>{tone(520+i*110,.09,'triangle',.05,0,1.5);
      if(r==='Rara')tone(990,.16,'sine',.05,.08,1);
      if(r==='Épica')[660,880,1175].forEach((f,k)=>tone(f,.14,'square',.035,.08+k*.08,1));
      if(r==='Legendaria')sfx.win();});
    if(r==='Legendaria'||r==='Épica'){try{navigator.vibrate&&navigator.vibrate([30,40,90]);}catch{}}
    if([...po.cardsBox.children].every(x=>x.classList.contains('flip')))later(450,finish);
  }
  function finish(){
    if(po.phase==='done')return;po.phase='done';po.timers.forEach(clearTimeout);po.timers=[];
    const nuevas=po.items.filter(it=>it.isNew).length,rep=po.items.length-nuevas;
    po.hint.textContent=[nuevas?nuevas+(nuevas===1?' nueva':' nuevas'):'',rep?rep+(rep===1?' repetida':' repetidas'):''].filter(Boolean).join(' · ');
    po.done.hidden=false;po.done.focus();
  }
  function skip(){
    if(po.phase==='sealed'){tearPack();return;}
    if(po.phase==='done'||po.phase==='off')return;
    po.timers.forEach(clearTimeout);po.timers=[];po.pack.classList.add('out');
    if(!po.cardsBox.children.length)startCards();
    po.timers.forEach(clearTimeout);po.timers=[];
    [...po.cardsBox.children].forEach((c,i)=>{c.classList.add('in');flipCard(i);});finish();
  }
  function closeReveal(){po.timers.forEach(clearTimeout);po.timers=[];po.phase='off';po.el.hidden=true;po.cardsBox.replaceChildren();(q('#open-pack').disabled?q('#album-close'):q('#open-pack')).focus();}

  /* ================= RESPALDO DEL AVANCE =================
     Código de texto con la colección, monedero, edificios abiertos y récords.
     Formato: MANO1.<datos en base64>.<suma de control>. Al cargarlo se recarga la página. */
  const BK_KEYS=['mano-album-v1','mano-unlocked-v1','mano-best-v2','mano-best-score-v3'];
  const bkHash=s=>{let h=5381;for(let i=0;i<s.length;i++)h=(h*33+s.charCodeAt(i))>>>0;return h.toString(36);};
  function bkExport(){const d={};for(const k of BK_KEYS){try{const v=localStorage.getItem(k);if(v!==null)d[k]=v;}catch{}}
    d['mano-album-v1']=JSON.stringify(data);const json=JSON.stringify({v:1,fecha:new Date().toISOString().slice(0,10),d});
    const b64=btoa(unescape(encodeURIComponent(json)));return `MANO1.${b64}.${bkHash(b64)}`;}
  function bkParse(text){const m=String(text||'').replace(/\s+/g,'').match(/MANO1\.([A-Za-z0-9+/=]+)\.([a-z0-9]+)/);
    if(!m)throw new Error('No parece un código de respaldo de La Mano Araña.');
    if(bkHash(m[1])!==m[2])throw new Error('El código está incompleto o tiene un error. Cópialo completo de nuevo.');
    const o=JSON.parse(decodeURIComponent(escape(atob(m[1]))));if(!o||o.v!==1||!o.d||!o.d['mano-album-v1'])throw new Error('El respaldo no tiene datos válidos.');
    const a=JSON.parse(o.d['mano-album-v1']);if(!a||!Array.isArray(a.counts))throw new Error('El respaldo no tiene una colección válida.');
    const owned=cards.filter(c=>a.counts[c.id-1]>0).length,un=Math.min(6,Math.max(1,parseInt(o.d['mano-unlocked-v1'])||1));
    return {o,summary:`Respaldo del ${o.fecha||'?'}: ${owned}/${TOTAL} láminas · ${(a.points|0).toLocaleString('es-CL')} pts en el monedero · ${un}/6 edificios abiertos · récord ${(parseInt(o.d['mano-best-score-v3'])||0).toLocaleString('es-CL')} pts.`};}
  let bkPending=null;const bkMsg=(t,bad)=>{const m=q('#bk-msg');m.textContent=t;m.classList.toggle('bad',!!bad);};
  function bkCheck(text){bkPending=null;q('#bk-apply').hidden=true;try{const r=bkParse(text);bkPending=r.o;bkMsg(r.summary+' Si lo cargas, reemplazará tu avance actual en este navegador.');q('#bk-apply').hidden=false;}catch(e){bkMsg(e.message,true);}}
  q('#bk-copy').onclick=async()=>{const code=bkExport(),out=q('#bk-out');out.value=code;out.hidden=false;out.focus();out.select();
    let ok=false;try{await navigator.clipboard.writeText(code);ok=true;}catch{try{ok=document.execCommand('copy');}catch{}}
    bkMsg(ok?'Código copiado. Guárdalo en un lugar seguro (por ejemplo, envíatelo por correo).':'Selecciona el código y cópialo manualmente.');};
  q('#bk-download').onclick=()=>{const blob=new Blob([bkExport()+'\n'],{type:'text/plain'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);
    a.download=`mano-arana-respaldo-${new Date().toISOString().slice(0,10)}.txt`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);bkMsg('Archivo de respaldo descargado.');};
  q('#bk-check').onclick=()=>bkCheck(q('#bk-input').value);
  q('#bk-file').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{q('#bk-input').value=t.trim();bkCheck(t);}).catch(()=>bkMsg('No se pudo leer el archivo.',true));e.target.value='';};
  q('#bk-apply').onclick=()=>{if(!bkPending)return;try{for(const k of BK_KEYS)localStorage.removeItem(k);for(const [k,v] of Object.entries(bkPending.d))if(BK_KEYS.includes(k))localStorage.setItem(k,v);}catch{bkMsg('Este navegador no permite guardar datos.',true);return;}
    bkMsg('¡Avance cargado! Reiniciando…');setTimeout(()=>location.reload(),600);};
  po.el.addEventListener('click',e=>{if(e.target.closest('.po-done')){closeReveal();return;}if(po.phase==='sealed'){if(e.target.closest('.po-pack'))tearPack();return;}skip();});

  // Suma una lámina y recuerda si era nueva (para el aviso ¡NUEVA!).
  function grant(card){const isNew=!data.counts[card.id-1];data.counts[card.id-1]++;return {card,isNew};}
  // Primero los sobres de 3 láminas (bienvenida y victorias); después los de 1 lámina que queden de versiones anteriores.
  function openPack(){const big=data.packs>0;if(!big&&!data.small)return;let special=false;if(big){data.packs--;special=data.special>0;if(special)data.special--;}else data.small--;const items=[];for(let i=0;i<(big?3:1);i++)items.push(grant(choose(special&&i===2)));save();render();q('#pack-result').replaceChildren(...items.map((it,i)=>tile(it.card,i+1)));packReveal(items,{pack:true,special,title:special?'¡SOBRE ESPECIAL!':'¡SOBRE MUTANTE!'});}
  function buy(){if(data.points<PRICE)return;data.points-=PRICE;const it=grant(choose(false));save();render();q('#pack-result').replaceChildren(tile(it.card,1));packReveal([it],{title:'¡LÁMINA COMPRADA!'});}
  function craft(){if(data.dna<30)return;const pool=cards.filter(c=>c.rarity!=='Común'&&!data.counts[c.id-1]);if(!pool.length)return;data.dna-=30;const it=grant(pool[Math.floor(Math.random()*pool.length)]);save();render();q('#pack-result').replaceChildren(tile(it.card,1));packReveal([it],{title:'¡CANJE DE ADN!'});}
  function show(e){if(state==='ending')return;opener=e&&e.currentTarget;resume=state==='play';if(resume)pause();opened=true;window.albumOpen=true;panel.hidden=false;render();q('#album-close').focus();}
  let opener=null;
  function close(){if(!po.el.hidden)closeReveal();viewer.hidden=true;panel.hidden=true;opened=false;window.albumOpen=false;if(resume&&state==='paused'&&!document.hidden)pause();resume=false;(opener&&opener.offsetParent?opener:q('#start')).focus();}
  document.addEventListener('keydown',e=>{if(!opened)return;e.stopImmediatePropagation();if(!po.el.hidden){if(['Enter','Space','Escape','NumpadEnter'].includes(e.code)){e.preventDefault();if(po.phase==='done')closeReveal();else skip();}if(e.code==='Tab'){e.preventDefault();(po.done.hidden?po.pack:po.done).focus();}return;}if(e.code==='Escape'){e.preventDefault();if(!viewer.hidden)closeCard();else close();}if(e.code==='Tab'){const root=viewer.hidden?panel:viewer;const focus=[...root.querySelectorAll('button:not(:disabled):not([hidden]),select,summary,textarea:not([hidden]),input')].filter(el=>el.offsetParent);const first=focus[0],last=focus[focus.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}},true);
  q('#album-launch').onclick=q('#album-menu').onclick=show;q('#album-close').onclick=close;q('#card-close').onclick=closeCard;q('#open-pack').onclick=openPack;q('#craft-card').onclick=craft;q('#buy-card').onclick=buy;q('#album-filter').onchange=render;
  // Solo se gana un sobre de 3 láminas la primera vez que se completa cada edificio. Los pisos ya no dan sobres.
  window.mutantAlbum={newRun(){awarded.clear();},floor(){return false;},addPoints(n){n=Math.max(0,Math.floor(Number(n)||0));data.points+=n;save();return data.points;},win(){if(awarded.has('win'))return false;awarded.add('win');const k=building+'-win';if(data.earned[k])return false;data.earned[k]=true;data.packs++;data.special++;save();return true;},snapshot(){return JSON.parse(JSON.stringify(data));}};
  save();
})();
