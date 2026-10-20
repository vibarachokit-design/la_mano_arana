'use strict';
/* ============================================================
   ÁLBUM DE LÁMINAS · La Mano Araña Mutante
   - 17 láminas en 4 rarezas (común, rara, épica, legendaria)
   - Sobres con apertura animada (desgarro + vibración + sonido) y protección
     contra repetidas
   - Repetidas → MOCO (moneda) o trueque del día
   - Conjuntos completos desbloquean aspectos para la mano
   Todo se guarda en localStorage ('mano-album-v1').
   ============================================================ */
const Album = (() => {
  const BASE = (window.ASSET_BASE || 'assets/') + 'cards/';

  const RAR = {
    comun:      {name:'Común',      stars:'⭐',        moco:10,  score:10,  color:'#e9dcc0'},
    rara:       {name:'Rara',       stars:'⭐⭐',       moco:25,  score:25,  color:'#5fc8ff'},
    epica:      {name:'Épica',      stars:'⭐⭐⭐',      moco:60,  score:50,  color:'#c27bff'},
    legendaria: {name:'Legendaria', stars:'⭐⭐⭐⭐',     moco:150, score:100, color:'#ffd34a'}
  };

  const CARDS = [
    {id:1,  name:'Mosca Pie',            r:'comun', mix:'Mosca + pie humano',
     desc:'Una mosca gigante con un pie humano calzado con zapatilla sucia. Vuela torpe porque el pie pesa.',
     weak:'Si se le desata el cordón, se enreda y aterriza de guata.', quote:'"¿Alguien huele a queso? Ah no… soy yo."'},
    {id:2,  name:'Gusano Dentudo',       r:'comun', mix:'Gusano + dentadura humana',
     desc:'Gusano rechoncho con una sonrisa de dientes amarillos. Deja babas ácidas al pasar.',
     weak:'Le tiene pánico al cepillo de dientes.', quote:'"¡Sonríe para la foto! Ñiiiii."'},
    {id:3,  name:'Piojo Guatón',         r:'comun', mix:'Piojo + guata enorme',
     desc:'Piojo redondo y panzón, con chupete y cara de no querer moverse. Rueda en vez de caminar.',
     weak:'Si le quitas el chupete, llora hasta inundar la cabeza.', quote:'"Mmm… ¿y si mejor me llevas en brazos?"'},
    {id:4,  name:'Pulga Tóxica',         r:'comun', mix:'Pulga + residuos tóxicos',
     desc:'Pulga verde fluorescente que brilla en la oscuridad. Al saltar deja un charco radiactivo.',
     weak:'No puede esconderse: se ve a kilómetros en la noche.', quote:'"¡Salto y ensucio, salto y ensucio!"'},
    {id:5,  name:'Cucaracha Peinada',    r:'comun', mix:'Cucaracha + tupé',
     desc:'Cucaracha con tupé setentero y bigote. Se esconde cuando la miras.',
     weak:'Un soplido de secador la deja chascona y sin autoestima.', quote:'"Ni un pelo fuera de lugar, mi amor."'},
    {id:6,  name:'Hormiga Cabezona',     r:'comun', mix:'Hormiga + cabeza gigante',
     desc:'Hormiga con una cabeza enorme que usa como martillo. Camina chueca por el peso.',
     weak:'Se va de punta en las bajadas.', quote:'"Pienso, luego… me caigo."'},
    {id:7,  name:'Zancudo Vampirón',     r:'rara', mix:'Zancudo + vampiro',
     desc:'Mosquito con capa, colmillos y peinado de Drácula. Chupa sangre, pero se marea con la suya.',
     weak:'Si le muestras un espejo, se paraliza.', quote:'"Buenas noches… ¿me prestas un poquito de tu sangre?"'},
    {id:8,  name:'Araña Narigona',       r:'rara', mix:'Araña + nariz humana',
     desc:'Araña con una nariz enorme que huele a sus presas a kilómetros. Estornuda telaraña.',
     weak:'La pimienta la hace estornudar sin parar.', quote:'"Huelo… huelo… ¡AAACHÍS!"'},
    {id:9,  name:'Escarabajo Peludo',    r:'rara', mix:'Escarabajo + pelaje de gato',
     desc:'Escarabajo cubierto de pelo de gato. Ronronea y se frota contra las patas de la mano-araña.',
     weak:'Un puntero láser lo distrae por horas.', quote:'"Purrr… rásquenme la caparazón."'},
    {id:10, name:'Grillo Orejón',        r:'rara', mix:'Grillo + orejas de elefante',
     desc:'Grillo con orejas gigantes. Escucha todo y chismosea con los demás bichos.',
     weak:'Los ruidos fuertes lo dejan girando como trompo.', quote:'"¿Supiste lo que dijo la cucaracha? Te cuento…"'},
    {id:11, name:'Mariposa Lengüilarga', r:'rara', mix:'Mariposa + lengua humana',
     desc:'Mariposa con una lengua larguísima que lame todo. Sus alas son de papel de diario.',
     weak:'Un día de lluvia le deja las alas como papel maché.', quote:'"¡Slurp! Esto sabe a noticia vieja."'},
    {id:12, name:'Escorpión Coqueto',    r:'epica', mix:'Escorpión + maquillaje',
     desc:'Escorpión con pestañas postizas y tenazas pintadas. Su aguijón de labial deja brillos.',
     weak:'Si se le corre el delineado, no sale de su guarida.', quote:'"Un picotazo y quedas divino, cariño."'},
    {id:13, name:'Ciempiés Zapatón',     r:'epica', mix:'Ciempiés + zapatos',
     desc:'Ciempiés que usa un zapato distinto en cada pata. Camina haciendo clic-clac.',
     weak:'Tarda tres horas en atarse los cordones.', quote:'"¡Clic-clac, clic-clac, abran paso a la pasarela!"'},
    {id:14, name:'Mantis Rezongona',     r:'epica', mix:'Mantis + cara de enojada',
     desc:'Mantis con ceño fruncido permanente y una escoba de arma. Pelea con todos, pero es la más fuerte del álbum.',
     weak:'Un "por favor" y un "gracias" la desarman.', quote:'"¡¿Y quién ensució el laboratorio OTRA VEZ?!"'},
    {id:15, name:'La Mano Araña Mutante', r:'legendaria', mix:'Mano + araña',
     desc:'El personaje principal en su versión dorada. Trepa diez pisos con tal de darle un susto al profesor.',
     weak:'No resiste hacer cosquillas en una cara dormida.', quote:'"Chuuut… el profesor duerme."'},
    {id:16, name:'Rey Gusano',           r:'legendaria', mix:'Gusano + corona',
     desc:'Gusano gigante con corona torcida y cetro de lata. Su trono es un tarro de basura.',
     weak:'Si le sacan la basura, se queda sin reino.', quote:'"¡Inclínense ante su majestad la Basura!"'},
    {id:17, name:'La Mosca Reina',       r:'legendaria', mix:'Mosca + vestido de gala',
     desc:'Mosca con vestido de novia y velo. Pone huevos de oro, literalmente.',
     weak:'Se le enreda el velo en cualquier telaraña.', quote:'"Sí, acepto… ¡todos los huevos de oro!"'}
  ];

  const SETS = [
    {key:'comun', name:'Basura Básica', ids:[1,2,3,4,5,6], reward:'verde', rewardName:'Brillo verde', rewardDesc:'La mano brilla con moco radiactivo.'},
    {key:'rara',  name:'Bichos Raros', ids:[7,8,9,10,11], reward:'azul', rewardName:'Aura azul + escudo inicial', rewardDesc:'Empiezas cada partida con 3 s de escudo.'},
    {key:'epica', name:'Glamour Mutante', ids:[12,13,14], reward:'brillos', rewardName:'Rastro de brillos', rewardDesc:'La mano deja una estela de brillitos.'},
    {key:'legendaria', name:'Pesadilla Legendaria', ids:[15,16,17], reward:'dorada', rewardName:'Mano Dorada', rewardDesc:'Tu mano se vuelve de oro puro.'}
  ];

  const PACKS = {
    alcantarilla: {name:'Sobre de Alcantarilla', cost:60, n:3, odds:{comun:70, rara:22, epica:7, legendaria:1}, color:'#5f8a2b',
                   hint:'3 láminas · más comunes'},
    laboratorio:  {name:'Sobre de Laboratorio', cost:150, n:4, odds:{comun:40, rara:36, epica:17, legendaria:7}, color:'#6b2fa3',
                   hint:'4 láminas · la última es rara o mejor', guarantee:true}
  };

  // Trueque del día: cambia según la fecha
  const TRADES = [
    {give:{r:'comun', n:3}, get:'rara',  text:'3 comunes repetidas → 1 rara'},
    {give:{r:'comun', n:5}, get:'epica', text:'5 comunes repetidas → 1 épica'},
    {give:{r:'rara',  n:2}, get:'epica', text:'2 raras repetidas → 1 épica'},
    {give:{r:'epica', n:2}, get:'legendaria', text:'2 épicas repetidas → 1 legendaria'}
  ];

  /* ---------------- Estado guardado ---------------- */
  const KEY = 'mano-album-v1';
  let S = {owned:{}, moco:0, free:1, skin:'', seen:{}};
  try{ Object.assign(S, JSON.parse(localStorage.getItem(KEY)) || {}) }catch{}
  const save = () => { try{ localStorage.setItem(KEY, JSON.stringify(S)) }catch{} };

  const byId = id => CARDS.find(c => c.id === id);
  const count = id => S.owned[id] || 0;
  const ownedCount = () => CARDS.filter(c => count(c.id) > 0).length;
  const score = () => CARDS.reduce((a,c) => a + (count(c.id) ? RAR[c.r].score : 0), 0);
  const maxScore = CARDS.reduce((a,c) => a + RAR[c.r].score, 0);
  const setDone = s => s.ids.every(id => count(id) > 0);
  const dupes = r => CARDS.filter(c => c.r === r).reduce((a,c) => a + Math.max(0, count(c.id)-1), 0);
  const unlocked = () => SETS.filter(setDone).map(s => s.reward);
  const todayTrade = () => TRADES[Math.floor(Date.now()/86400000) % TRADES.length];

  /* ---------------- Sonido (usa el audio del juego si existe) ---------------- */
  const snd = {
    tear(){ try{ noise(.35,.12,2500,0,null,.6); noise(.2,.08,5000,.12,null,.6) }catch{} },
    flip(){ try{ tone(500,.07,'triangle',.04,0,1.6) }catch{} },
    reveal(r){ try{
      if(r==='comun') tone(660,.12,'triangle',.05,0,1);
      else if(r==='rara'){ tone(660,.1,'square',.04,0,1); tone(990,.16,'square',.04,.08,1) }
      else if(r==='epica'){ [523,784,1047].forEach((f,i)=>tone(f,.16,'square',.04,i*.08,1)) }
      else { [523,659,784,1047,1319].forEach((f,i)=>tone(f,.22,'square',.045,i*.09,1)); noise(.8,.03,6000,.3,null,.5) }
    }catch{} },
    coin(){ try{ tone(988,.07,'square',.035,0,1); tone(1319,.12,'square',.035,.06,1) }catch{} }
  };
  const vibrate = p => { try{ navigator.vibrate && navigator.vibrate(p) }catch{} };

  /* ---------------- Lógica de sobres ---------------- */
  function rollRarity(odds){
    let x = Math.random()*100;
    for(const r of ['comun','rara','epica','legendaria']){ if((x -= odds[r]) < 0) return r }
    return 'comun';
  }
  function pickCard(r, exclude){
    const pool = CARDS.filter(c => c.r === r && !exclude.includes(c.id));
    const missing = pool.filter(c => !count(c.id));
    // Protección contra repetidas: 80 % de probabilidad de dar una que no tienes
    const from = missing.length && Math.random() < .8 ? missing : pool.length ? pool : CARDS.filter(c => c.r === r);
    return from[Math.floor(Math.random()*from.length)];
  }
  function openPackData(kind){
    const P = PACKS[kind], out = [];
    for(let i=0;i<P.n;i++){
      let r = rollRarity(P.odds);
      if(P.guarantee && i === P.n-1 && r === 'comun') r = 'rara';
      out.push(pickCard(r, out.map(c => c.id)));
    }
    // ordenar: la mejor al final (más suspenso)
    const order = ['comun','rara','epica','legendaria'];
    out.sort((a,b) => order.indexOf(a.r) - order.indexOf(b.r));
    return out;
  }

  /* ---------------- Recompensa al terminar partida ---------------- */
  function reward(floor, bugs, win){
    const m = floor*8 + bugs*2 + (win ? 120 : 0);
    S.moco += m; save(); refreshMenu();
    return m;
  }

  /* ---------------- DOM ---------------- */
  const $ = s => document.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if(cls) e.className = cls; if(html != null) e.innerHTML = html; return e };
  let root, view;

  function injectCSS(){
    const css = `
#album{position:absolute;inset:0;z-index:20;display:none;flex-direction:column;background:radial-gradient(#2a1838,#0d0a12 75%);color:#f3e5c6;font:15px system-ui}
#album.show{display:flex}
#album header{display:flex;align-items:center;gap:8px;padding:12px 12px 8px;border-bottom:1px solid #ffffff18}
#album header h3{margin:0;font-size:18px;flex:1;letter-spacing:.5px}
#album .moco{background:#2b3a14;border:1px solid #9ad43a;color:#d4ff7a;border-radius:20px;padding:4px 10px;font-weight:800;white-space:nowrap}
#album .x{background:#ffffff14;border:1px solid #ffffff30;border-radius:10px;padding:6px 11px}
#album .tabs{display:flex;gap:6px;padding:8px 12px}
#album .tabs button{flex:1;background:#ffffff10;border:1px solid #ffffff25;border-radius:10px;padding:8px 4px;font-weight:800;font-size:13px}
#album .tabs button.on{background:#c1e14d;color:#14210d;border-color:#c1e14d}
#album .body{flex:1;overflow:auto;padding:4px 12px 20px;-webkit-overflow-scrolling:touch}
.al-prog{background:#ffffff10;border-radius:12px;padding:10px 12px;margin:6px 0 12px}
.al-bar{height:8px;background:#ffffff18;border-radius:4px;overflow:hidden;margin-top:6px}
.al-bar i{display:block;height:100%;background:linear-gradient(90deg,#9ad43a,#ffd34a);border-radius:4px}
.al-set{margin:14px 0 6px;display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.al-set b{font-size:15px}.al-set small{font:11px system-ui;letter-spacing:0;color:#cbbd9c;text-align:right}
.al-set small.done{color:#c1e14d}
.al-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.al-slot{position:relative;aspect-ratio:2/3;border-radius:8px;overflow:hidden;background:#ffffff08;border:1px dashed #ffffff30;cursor:pointer;padding:0}
.al-slot img{width:100%;height:100%;display:block;object-fit:cover}
.al-slot.miss img{filter:grayscale(1) brightness(.22) contrast(1.4)}
.al-slot .num{position:absolute;top:4px;left:4px;background:#000a;border-radius:6px;padding:1px 5px;font:800 11px system-ui}
.al-slot .cnt{position:absolute;bottom:4px;right:4px;background:#c1e14d;color:#14210d;border-radius:8px;padding:1px 6px;font:900 11px system-ui}
.al-slot .q{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font:900 30px system-ui;color:#ffffff55;text-align:center}
.al-slot .q small{font:10px system-ui;letter-spacing:0;color:#ffffff70;margin-top:4px;padding:0 4px}
.al-slot.new::after{content:'¡NUEVA!';position:absolute;top:4px;right:4px;background:#ff5a43;color:#fff;border-radius:6px;padding:1px 5px;font:900 10px system-ui}
.al-slot:not(.miss).rara,.al-slot:not(.miss).epica,.al-slot:not(.miss).legendaria{border:0}
.holo{position:relative;overflow:hidden}
.holo::before{content:'';position:absolute;inset:0;pointer-events:none;z-index:2;mix-blend-mode:color-dodge;opacity:.45;
  background:linear-gradient(115deg,transparent 20%,#ff8ad8 32%,#7cf3ff 42%,#ffe96b 52%,#9dff8a 62%,transparent 75%);
  background-size:250% 250%;background-position:var(--hx,50%) var(--hy,50%);animation:holo 4s linear infinite}
.holo.rara::before{opacity:.28}
.holo.legendaria::before{opacity:.6}
.holo::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:3;mix-blend-mode:overlay;opacity:.5;
  background:radial-gradient(circle at var(--hx,50%) var(--hy,30%),#fff8 0,transparent 45%)}
@keyframes holo{0%{background-position:0% 0%}100%{background-position:250% 250%}}
.al-pack{display:flex;gap:12px;align-items:center;background:#ffffff0d;border:1px solid #ffffff20;border-radius:14px;padding:12px;margin:10px 0}
.al-pack .bag{width:72px;height:100px;border-radius:6px;flex:none;position:relative;overflow:hidden;box-shadow:0 4px 12px #0008}
.al-pack .bag img{width:100%;height:100%;object-fit:cover;opacity:.9}
.al-pack .bag::before{content:'';position:absolute;inset:0 0 auto 0;height:9px;background:repeating-linear-gradient(90deg,#ddd 0 4px,#999 4px 8px)}
.al-pack .info{flex:1}.al-pack .info b{display:block;font-size:15px}.al-pack .info span{color:#cbbd9c;font-size:12px}
.al-btn{background:#c1e14d;color:#14210d;border:0;border-radius:10px;padding:10px 14px;font-weight:900;box-shadow:0 3px #65812e;white-space:nowrap}
.al-btn:disabled{background:#555;color:#999;box-shadow:none;cursor:not-allowed}
.al-btn.alt{background:#ffffff18;color:#f3e5c6;box-shadow:none;border:1px solid #ffffff35}
.al-note{color:#cbbd9c;font-size:12px;line-height:1.5}
.al-skins{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.al-skin{background:#ffffff0d;border:1px solid #ffffff25;border-radius:12px;padding:10px;text-align:left}
.al-skin.on{border-color:#c1e14d;background:#c1e14d22}.al-skin.lock{opacity:.45}
.al-skin b{display:block;font-size:13px}.al-skin span{font-size:11px;color:#cbbd9c}
/* detalle */
#al-detail{position:absolute;inset:0;z-index:30;background:#060409ee;display:none;flex-direction:column;align-items:center;overflow:auto;padding:14px}
#al-detail.show{display:flex}
#al-detail .card{width:min(78%,300px);aspect-ratio:2/3;border-radius:12px;transition:transform .1s;transform-style:preserve-3d;box-shadow:0 10px 40px #000a;flex:none}
#al-detail .card img{width:100%;height:100%;display:block}
#al-detail .ficha{width:min(92%,360px);background:#f3e5c6;color:#2a1a10;border-radius:12px;padding:12px 14px;margin-top:14px;font-size:13px;line-height:1.45}
#al-detail .ficha h4{margin:0 0 4px;font-size:18px}
#al-detail .ficha p{margin:6px 0;color:#2a1a10}
#al-detail .ficha i{display:block;margin-top:8px;color:#6b2fa3;font-weight:700}
/* apertura de sobre */
#al-open{position:absolute;inset:0;z-index:40;display:none;flex-direction:column;align-items:center;justify-content:center;
  background:radial-gradient(circle,#3b2155,#0b0710 70%);overflow:hidden;touch-action:none}
#al-open.show{display:flex}
#al-open .msg{position:absolute;top:22px;width:100%;text-align:center;font-weight:900;color:#c1e14d;font-size:17px;padding:0 10px}
#al-open .sub{position:absolute;bottom:22px;width:100%;text-align:center;color:#cbbd9c;font-size:13px;padding:0 12px}
.pk{position:relative;width:min(62%,250px);aspect-ratio:2/3;user-select:none;cursor:grab}
.pk .top,.pk .bot{position:absolute;left:0;right:0;background-size:cover;background-position:center;box-shadow:0 10px 30px #000c}
.pk .top{top:0;height:16%;border-radius:8px 8px 0 0;background-position:center top;transform-origin:0% 100%;transition:transform .55s cubic-bezier(.3,1.4,.5,1),opacity .55s}
.pk .bot{top:16%;bottom:0;border-radius:0 0 8px 8px;background-position:center bottom;transition:transform .6s ease-in,opacity .6s}
.pk .top::after{content:'';position:absolute;left:0;right:0;bottom:-3px;height:6px;background:radial-gradient(circle at 4px 0,transparent 4px,#0000 4px) repeat-x;}
.pk .crimp{position:absolute;left:0;right:0;height:12px;background:repeating-linear-gradient(90deg,#e8e8e8 0 5px,#9a9a9a 5px 10px);opacity:.85}
.pk .label{position:absolute;left:8%;right:8%;bottom:8%;background:#000b;border-radius:8px;padding:8px;text-align:center;font-weight:900;font-size:14px;line-height:1.2}
.pk .tearline{position:absolute;left:0;top:16%;height:3px;background:#fff;box-shadow:0 0 12px #fff,0 0 30px #c1e14d;width:0;transition:width .05s}
.pk.shake{animation:pkshake .35s}
@keyframes pkshake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px) rotate(-2deg)}40%{transform:translateX(6px) rotate(2deg)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
.pk.torn{pointer-events:none}
.pk.torn .top{transform:translate(40px,-160px) rotate(-35deg);opacity:0}
.pk.torn .bot{transform:translateY(130%);opacity:0}
.stack{position:absolute;width:min(62%,250px);aspect-ratio:2/3;display:none}
.stack.show{display:block}
.fc{position:absolute;inset:0;perspective:900px;cursor:pointer;transition:transform .45s cubic-bezier(.2,1.3,.4,1),opacity .4s}
.fc .in{position:absolute;inset:0;transform-style:preserve-3d;transition:transform .55s cubic-bezier(.3,1.2,.4,1)}
.fc.flip .in{transform:rotateY(180deg)}
.fc .face,.fc .back{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:12px;overflow:hidden}
.fc .face{transform:rotateY(180deg)}
.fc .face img{width:100%;height:100%;display:block}
.fc .back{background:radial-gradient(circle at 50% 40%,#7b3fc0,#2a0f45 70%);border:5px solid #c8b894;display:flex;align-items:center;justify-content:center;flex-direction:column;
  font:900 20px system-ui;color:#c1e14d;text-align:center;line-height:1.05;text-shadow:0 2px 0 #000}
.fc .back small{font:12px monospace;color:#f3e5c6;margin-top:10px;letter-spacing:2px}
.fc.glow-rara .back{box-shadow:0 0 25px #5fc8ff}.fc.glow-epica .back{box-shadow:0 0 30px #c27bff}.fc.glow-legendaria .back{box-shadow:0 0 40px #ffd34a,0 0 80px #ffd34a}
.fc .tag{position:absolute;left:50%;bottom:-38px;transform:translateX(-50%);white-space:nowrap;font-weight:900;font-size:14px;padding:4px 10px;border-radius:8px;opacity:0;transition:opacity .3s .3s}
.fc.flip .tag{opacity:1}
.fc.gone{transform:translateX(-140%) rotate(-18deg);opacity:0;pointer-events:none}
.burst{position:absolute;left:50%;top:50%;width:10px;height:10px;border-radius:50%;pointer-events:none;z-index:5;animation:burst .9s ease-out forwards}
@keyframes burst{from{transform:translate(-50%,-50%) scale(0);opacity:1}to{transform:translate(-50%,-50%) scale(60);opacity:0}}
.sum{display:none;flex-direction:column;align-items:center;gap:10px;width:92%}
.sum.show{display:flex}
.sum .row{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.sum .row div{width:76px;text-align:center;font-size:11px}
.sum .row img{width:76px;border-radius:6px;display:block}
`;
    document.head.appendChild(el('style', null, css));
  }

  function build(){
    injectCSS();
    const cab = $('#cabinet');
    root = el('div'); root.id = 'album';
    root.innerHTML = `<header><h3>ÁLBUM MUTANTE</h3><span class="moco" id="al-moco"></span><button class="x" id="al-close" aria-label="Cerrar álbum">✕</button></header>
      <div class="tabs"><button data-v="album">Láminas</button><button data-v="sobres">Sobres</button><button data-v="trueque">Trueque</button><button data-v="premios">Premios</button></div>
      <div class="body" id="al-body"></div>`;
    cab.appendChild(root);
    const det = el('div'); det.id = 'al-detail'; cab.appendChild(det);
    const op = el('div'); op.id = 'al-open'; cab.appendChild(op);
    $('#al-close').onclick = close;
    root.querySelectorAll('.tabs button').forEach(b => b.onclick = () => show(b.dataset.v));
    det.onclick = e => { if(e.target === det || e.target.dataset.close) det.classList.remove('show') };
    // botones del menú principal
    const startBtn = $('#start');
    const row = el('div'); row.style.cssText = 'display:flex;gap:8px;margin-top:12px';
    row.innerHTML = `<button id="btn-album" class="primary" style="background:#6b2fa3;color:#f3e5c6;box-shadow:0 5px #3a1660;padding:12px 18px">📖 ÁLBUM <span id="album-count"></span></button>`;
    startBtn.insertAdjacentElement('afterend', row);
    $('#btn-album').onclick = () => open(S.free > 0 ? 'sobres' : 'album');
    refreshMenu();
  }

  function refreshMenu(){
    const c = $('#album-count'); if(!c) return;
    c.textContent = ownedCount() + '/' + CARDS.length + (S.free > 0 || S.moco >= PACKS.alcantarilla.cost ? ' · ¡SOBRE!' : '');
    const m = $('#al-moco'); if(m) m.textContent = '🟢 ' + S.moco + ' MOCO';
  }

  function open(v='album'){
    if(typeof state !== 'undefined' && !['menu','over','win'].includes(state)) return;
    root.classList.add('show'); show(v);
  }
  function close(){ root.classList.remove('show'); S.seen = {}; save(); refreshMenu() }

  function show(v){
    view = v;
    root.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
    refreshMenu();
    const body = $('#al-body'); body.innerHTML = ''; body.scrollTop = 0;
    if(v === 'album') renderAlbum(body);
    if(v === 'sobres') renderPacks(body);
    if(v === 'trueque') renderTrade(body);
    if(v === 'premios') renderRewards(body);
  }

  function renderAlbum(body){
    const sc = score();
    body.appendChild(el('div','al-prog',`<b>${ownedCount()} / ${CARDS.length} láminas</b> · Puntaje de colección ${sc} / ${maxScore}
      <div class="al-bar"><i style="width:${sc/maxScore*100}%"></i></div>`));
    for(const set of SETS){
      const have = set.ids.filter(id => count(id)).length, done = have === set.ids.length;
      body.appendChild(el('div','al-set',`<b style="color:${RAR[set.key].color}">${RAR[set.key].stars} ${set.name}</b>
        <small class="${done?'done':''}">${have}/${set.ids.length} · ${done ? '✔ ' + set.rewardName : 'Premio: ' + set.rewardName}</small>`));
      const grid = el('div','al-grid');
      for(const id of set.ids){
        const c = byId(id), n = count(id);
        const slot = el('button', `al-slot ${c.r} ${n ? 'holo' : 'miss'} ${S.seen[id] ? 'new' : ''}`);
        slot.setAttribute('aria-label', n ? c.name : 'Lámina ' + id + ' sin conseguir');
        slot.innerHTML = `<img src="${BASE}${String(id).padStart(2,'0')}-s.webp" alt="" loading="lazy">` +
          (n ? (n > 1 ? `<span class="cnt">x${n}</span>` : '') :
          `<span class="q">?<small>${c.r === 'comun' ? 'Sobre de Alcantarilla' : 'Mejor en Sobre de Laboratorio'}</small></span>`) +
          `<span class="num">${String(id).padStart(2,'0')}</span>`;
        slot.onclick = () => n ? detail(c) : null;
        grid.appendChild(slot);
      }
      body.appendChild(grid);
    }
  }

  function detail(c){
    const det = $('#al-detail'), R = RAR[c.r];
    det.innerHTML = `<div class="card holo ${c.r}"><img src="${BASE}${String(c.id).padStart(2,'0')}.webp" alt="${c.name}"></div>
      <div class="ficha"><h4>${c.name}</h4>
      <p><b>Rareza:</b> ${R.name} ${R.stars} · <b>Tienes:</b> ${count(c.id)}</p>
      <p><b>Mezcla:</b> ${c.mix}</p><p><b>Descripción:</b> ${c.desc}</p><p><b>Debilidad:</b> ${c.weak}</p><i>${c.quote}</i></div>
      <button class="al-btn alt" data-close="1" style="margin-top:12px">Cerrar</button>`;
    det.classList.add('show');
    const card = det.querySelector('.card');
    // inclinación 3D + reflejo que sigue al dedo
    const tilt = e => { const r = card.getBoundingClientRect(), px = (e.clientX - r.left)/r.width, py = (e.clientY - r.top)/r.height;
      card.style.transform = `rotateY(${(px-.5)*22}deg) rotateX(${(.5-py)*22}deg)`; card.style.setProperty('--hx', px*100+'%'); card.style.setProperty('--hy', py*100+'%') };
    card.onpointermove = tilt; card.onpointerleave = () => card.style.transform = '';
  }

  function renderPacks(body){
    body.appendChild(el('p','al-note',`Gana <b>MOCO</b> jugando: 8 por piso, 2 por bicho y 120 extra si asustas al profesor. Las repetidas también se reciclan en MOCO.`));
    if(S.free > 0){
      const d = el('div','al-pack',`<div class="bag"><img src="${BASE}15-s.webp" alt=""></div><div class="info"><b>¡Sobre de regalo!</b><span>Tu primer Sobre de Alcantarilla es gratis.</span></div>`);
      const b = el('button','al-btn','ABRIR'); b.onclick = () => { S.free--; save(); startOpening('alcantarilla') }; d.appendChild(b); body.appendChild(d);
    }
    for(const [k,P] of Object.entries(PACKS)){
      const cover = k === 'alcantarilla' ? '16' : '14';
      const d = el('div','al-pack',`<div class="bag" style="background:${P.color}"><img src="${BASE}${cover}-s.webp" alt=""></div>
        <div class="info"><b>${P.name}</b><span>${P.hint}<br>${P.cost} MOCO</span></div>`);
      const b = el('button','al-btn', S.moco >= P.cost ? 'ABRIR' : 'Faltan ' + (P.cost - S.moco));
      b.disabled = S.moco < P.cost;
      b.onclick = () => { if(S.moco < P.cost) return; S.moco -= P.cost; save(); startOpening(k) };
      d.appendChild(b); body.appendChild(d);
    }
    const odds = Object.values(PACKS).map(P => `<b>${P.name}:</b> común ${P.odds.comun}% · rara ${P.odds.rara}% · épica ${P.odds.epica}% · legendaria ${P.odds.legendaria}%`).join('<br>');
    body.appendChild(el('p','al-note', odds + '<br>Protección: casi siempre te toca primero una lámina que todavía no tienes.'));
  }

  function renderTrade(body){
    const tr = todayTrade(), have = dupes(tr.give.r);
    body.appendChild(el('div','al-prog',`<b>Trueque del día</b><br><span class="al-note">${tr.text}. Cambia cada día.</span><br><span class="al-note">Tienes ${have} ${RAR[tr.give.r].name.toLowerCase()}s repetidas.</span>`));
    const b = el('button','al-btn','HACER TRUEQUE'); b.disabled = have < tr.give.n;
    b.onclick = () => {
      let need = tr.give.n;
      for(const c of CARDS.filter(c => c.r === tr.give.r)){ while(need > 0 && count(c.id) > 1){ S.owned[c.id]--; need-- } }
      const got = pickCard(tr.get, []); S.owned[got.id] = count(got.id) + 1; S.seen[got.id] = 1; save();
      snd.reveal(got.r); vibrate(60); show('trueque'); detail(got);
    };
    body.appendChild(b);
    // reciclar
    const tot = CARDS.reduce((a,c) => a + Math.max(0,count(c.id)-1)*RAR[c.r].moco, 0);
    body.appendChild(el('div','al-prog',`<b>Reciclar repetidas</b><br><span class="al-note">Convierte todas tus repetidas en MOCO (común 10 · rara 25 · épica 60 · legendaria 150). Se queda 1 de cada una en el álbum.</span>`));
    const rb = el('button','al-btn alt', tot ? `RECICLAR → +${tot} MOCO` : 'No tienes repetidas'); rb.disabled = !tot;
    rb.onclick = () => { for(const c of CARDS) if(count(c.id) > 1) S.owned[c.id] = 1; S.moco += tot; save(); snd.coin(); show('trueque') };
    body.appendChild(rb);
    const list = CARDS.filter(c => count(c.id) > 1).map(c => `${c.name} x${count(c.id)-1}`).join(' · ');
    if(list) body.appendChild(el('p','al-note','Repetidas: ' + list));
  }

  function renderRewards(body){
    body.appendChild(el('p','al-note','Completa cada conjunto para desbloquear un aspecto para tu mano. Elige cuál usar:'));
    const grid = el('div','al-skins'), un = unlocked();
    const opts = [{reward:'', rewardName:'Normal', rewardDesc:'La mano de siempre.'}, ...SETS];
    for(const o of opts){
      const ok = o.reward === '' || un.includes(o.reward);
      const b = el('button', `al-skin ${S.skin === o.reward ? 'on' : ''} ${ok ? '' : 'lock'}`, `<b>${ok ? '' : '🔒 '}${o.rewardName}</b><span>${o.rewardDesc}${o.name ? '<br>Conjunto: ' + o.name : ''}</span>`);
      b.onclick = () => { if(!ok) return; S.skin = o.reward; save(); show('premios') };
      grid.appendChild(b);
    }
    body.appendChild(grid);
    const all = ownedCount() === CARDS.length;
    body.appendChild(el('div','al-prog', all ? '<b>🏆 ¡ÁLBUM COMPLETO!</b><br><span class="al-note">Eres oficialmente coleccionista de basura mutante.</span>'
      : `<b>Álbum completo:</b> ${ownedCount()}/${CARDS.length}<div class="al-bar"><i style="width:${ownedCount()/CARDS.length*100}%"></i></div>`));
  }

  /* ---------------- Apertura animada ---------------- */
  function startOpening(kind){
    const P = PACKS[kind], cards = openPackData(kind), op = $('#al-open');
    const cover = kind === 'alcantarilla' ? '16' : '14';
    op.innerHTML = `<div class="msg">${P.name}</div>
      <div class="pk" id="pk"><div class="top" style="background-image:url(${BASE}${cover}.webp)"><div class="crimp" style="top:0"></div></div>
        <div class="bot" style="background-image:url(${BASE}${cover}.webp)"><div class="crimp" style="bottom:0"></div>
        <div class="label">${P.name.toUpperCase()}<br><small style="font:11px system-ui;color:#c1e14d">${P.n} láminas mutantes</small></div></div>
        <div class="tearline" id="tl"></div></div>
      <div class="stack" id="stk"></div><div class="sum" id="sum"></div>
      <div class="sub" id="opsub">Desliza el dedo por la parte de arriba para romper el sobre ✂️</div>`;
    op.classList.add('show');
    const pk = $('#pk'), tl = $('#tl');
    let dragging = false, x0 = 0, done = false;
    const tear = () => {
      if(done) return; done = true; snd.tear(); vibrate([30,40,60]);
      pk.classList.add('shake'); setTimeout(() => { pk.classList.add('torn'); showStack(cards); setTimeout(() => pk.style.display = 'none', 650) }, 300);
    };
    pk.onpointerdown = e => { dragging = true; x0 = e.clientX; pk.setPointerCapture(e.pointerId) };
    pk.onpointermove = e => { if(!dragging) return; const r = pk.getBoundingClientRect(), w = Math.min(1, Math.abs(e.clientX - x0)/(r.width*.7));
      tl.style.width = (w*100) + '%'; if(w > .25 && Math.random() < .3){ try{ noise(.04,.05,4000) }catch{} vibrate(8) } if(w >= 1) tear() };
    pk.onpointerup = pk.onpointercancel = () => { dragging = false; if(!done && parseFloat(tl.style.width) > 50) tear(); else if(!done) tl.style.width = 0 };
    pk.onclick = () => { if(!done && !parseFloat(tl.style.width || 0)) { $('#opsub').textContent = 'Desliza más rápido… ¡o toca otra vez para romperlo!'; pk.onclick = tear } };
  }

  function showStack(cards){
    const stk = $('#stk'); stk.classList.add('show'); $('#opsub').textContent = 'Toca la lámina para darla vuelta';
    // se guardan al tiro (por si se cierra la página)
    const results = cards.map(c => { const isNew = !count(c.id); S.owned[c.id] = count(c.id) + 1; if(isNew) S.seen[c.id] = 1; return {c, isNew} });
    save();
    results.slice().reverse().forEach(({c,isNew}, k) => {
      const i = results.length - 1 - k;
      const fc = el('div', `fc glow-${c.r}`);
      fc.style.transform = `translate(${(i-1)*3}px, ${-i*3}px) rotate(${(i-1)*1.5}deg)`;
      fc.innerHTML = `<div class="in"><div class="back">LA MANO<br>ARAÑA<br>MUTANTE<small>Nº ??</small></div>
        <div class="face ${c.r !== 'comun' ? 'holo ' + c.r : ''}"><img src="${BASE}${String(c.id).padStart(2,'0')}.webp" alt="${c.name}"></div></div>
        <div class="tag" style="background:${isNew ? '#ff5a43' : '#ffffff22'};color:#fff">${isNew ? '¡NUEVA! ' : 'Repetida · '}${RAR[c.r].name} ${RAR[c.r].stars}</div>`;
      fc.dataset.idx = i; stk.appendChild(fc);
    });
    let cur = 0;
    const next = () => {
      const fc = stk.querySelector(`.fc[data-idx="${cur}"]`); if(!fc) return;
      if(!fc.classList.contains('flip')){
        fc.classList.add('flip'); snd.flip(); const r = results[cur].c.r;
        setTimeout(() => { snd.reveal(r); if(r !== 'comun'){ const b = el('div','burst'); b.style.background = RAR[r].color; stk.appendChild(b); setTimeout(() => b.remove(), 900); vibrate(r === 'legendaria' ? [80,50,120] : 50) } }, 250);
        $('#opsub').textContent = cur < results.length-1 ? 'Toca otra vez para la siguiente' : 'Toca para ver el resumen';
      }else{
        fc.classList.add('gone'); cur++;
        if(cur >= results.length) setTimeout(() => summary(results), 300);
      }
    };
    stk.onclick = next;
  }

  function summary(results){
    $('#stk').classList.remove('show');
    const sum = $('#sum'); sum.classList.add('show');
    const nuevas = results.filter(r => r.isNew).length;
    sum.innerHTML = `<div style="font-weight:900;font-size:20px;color:#c1e14d">${nuevas ? '¡' + nuevas + (nuevas > 1 ? ' láminas nuevas!' : ' lámina nueva!') : 'Puras repetidas… ¡a reciclar!'}</div>
      <div class="row">${results.map(({c,isNew}) => `<div><img src="${BASE}${String(c.id).padStart(2,'0')}-s.webp" alt="">${isNew ? '<b style="color:#ff8a7a">NUEVA</b>' : 'repetida'}</div>`).join('')}</div>
      <button class="al-btn" id="al-paste">PEGAR EN EL ÁLBUM</button>`;
    $('#opsub').textContent = '';
    const done = SETS.filter(s => setDone(s) && s.ids.some(id => results.find(r => r.isNew && r.c.id === id)));
    if(done.length) sum.insertAdjacentHTML('afterbegin', `<div class="al-prog" style="text-align:center"><b>🏆 ¡Conjunto ${done.map(s=>s.name).join(' y ')} completo!</b><br><span class="al-note">Desbloqueaste: ${done.map(s=>s.rewardName).join(', ')}. Actívalo en Premios.</span></div>`);
    $('#al-paste').onclick = () => { $('#al-open').classList.remove('show'); show('album') };
  }

  /* ---------------- Aspectos de la mano (usados por game.js) ---------------- */
  const tintCache = {};
  function goldVersion(im, key){
    if(tintCache[key]) return tintCache[key];
    const cv = document.createElement('canvas'); cv.width = im.width; cv.height = im.height;
    const x = cv.getContext('2d'); x.drawImage(im,0,0);
    x.globalCompositeOperation = 'multiply'; x.fillStyle = '#ffcc33'; x.fillRect(0,0,cv.width,cv.height);
    x.globalCompositeOperation = 'source-atop'; x.fillStyle = 'rgba(255,215,90,.28)'; x.fillRect(0,0,cv.width,cv.height);
    x.globalCompositeOperation = 'destination-in'; x.drawImage(im,0,0);
    return tintCache[key] = cv;
  }
  function drawHand(g, im, name, px, py, w, h, angle){
    const skin = S.skin, fit = Math.min(w/im.width, h/im.height), iw = im.width*fit, ih = im.height*fit;
    g.save(); g.translate(px, py); g.rotate(angle);
    if(skin === 'verde'){ g.shadowColor = '#9dff3a'; g.shadowBlur = 22 }
    if(skin === 'azul'){ g.shadowColor = '#5fc8ff'; g.shadowBlur = 22 }
    g.drawImage(skin === 'dorada' ? goldVersion(im, name) : im, -iw/2, -ih/2, iw, ih);
    g.restore();
  }
  const hasSkin = () => !!S.skin && unlocked().includes(S.skin);
  const skin = () => hasSkin() ? S.skin : '';

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', build) : build();

  return {CARDS, reward, open, close, drawHand, skin, refreshMenu, get moco(){ return S.moco }};
})();
window.Album = Album;
