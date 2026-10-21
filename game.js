'use strict';
/* ============================================================
   LA MANO ARAÑA MUTANTE · v5 (versión 11)
   Historial resumido en LEEME.txt.
   Cambios principales respecto a v1:
   - Puntaje, combos (multiplicador) y récord de puntos
   - Peligros nuevos: pisotón con sombra de aviso, matamoscas que persigue,
     oleadas con hueco, nube de aerosol con daño, alarmas en piso 5 y 9
   - Game feel: sacudida de pantalla, destello al recibir daño, textos flotantes,
     avisos de peligro arriba, partículas con gravedad, mano que se inclina
   - Música procedural (Web Audio) que acelera con cada piso + efectos nuevos
   - Arreglos: canvas sin deformarse, HUD oculto en menú, Enter para empezar,
     Esc para pausar, se puede saltar el final, mutación con imán
   v3: arte nuevo (portada, 8 sprites de mano, objetos), 5 zonas con fondo propio
       (laboratorio → tuberías → cocina → biblioteca → dormitorio) y música mp3
   ============================================================ */

const $ = s => document.querySelector(s);
const c = $('#c'), g = c.getContext('2d');
const W = 480, H = 800, HAND_Y = 605;
c.width = W; c.height = H;

const ASSET_BASE = window.ASSET_BASE || 'assets/';
const images = {};
const names = [...Array.from({length:60},(_,i)=>'hazard-'+(2+Math.floor(i/12))+'-'+Math.floor(i%12/2)+'-'+(i%2)), ...Array.from({length:25},(_,i)=>'building-'+(2+Math.floor(i/5))+'-'+(i%5)), 'cover','background-0','background-1','background-2','background-3','background-4','spray','swatter','shoe','fly','firefly','beetle','moth',
  'bed','bed-sleeping','window','prof-crouch','prof-launch','prof-dive','prof-nightcap',...Array.from({length:4},(_,i)=>'prof-run-'+i),...Array.from({length:8},(_,i)=>'hand-'+i)];

// Tamaños de dibujo y cajas de colisión (medio ancho, medio alto) por tipo
const SIZE = {swatter:[115,155], spray:[130,140], shoe:[110,110], fly:[90,90], firefly:[65,65], beetle:[65,65], moth:[65,65]};
const HITBOX = {swatter:[40,53], spray:[36,44], shoe:[40,36], fly:[34,30], firefly:[42,42], beetle:[42,42], moth:[42,42]};

let ready=false, state='loading', x=240, target=240, t=0, height=0, light=0, total=0, lives=3,
    objects=[], parts=[], floaters=[], spawn=1, inv=0, shield=0, cool=0, mutation=0, last=0, keys={},
    muted=false, audio, best=0, bestScore=0, floor=1, ending=0, toastTimer,
    score=0, combo=0, happy=0, zone=0, prevZone=0, zoneFade=0, maxCombo=0, shake=0, flash=0, alarm=0, waveTimer=8, tilt=0;

try{ best = +localStorage.getItem('mano-best-v2') || 0; bestScore = +localStorage.getItem('mano-best-score-v3') || 0 }catch{}

const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const rand = arr => arr[Math.floor(Math.random()*arr.length)];
const mult = () => 1 + Math.min(4, Math.floor(combo/5));
const baseSpeed = () => 155 + floor*15;
let building = 1;
const BUILDINGS = ['Laboratorio del profesor','Alcantarillas Mutantes','Invernadero Carnívoro','Museo de los Bichos','Fábrica Tóxica','Observatorio Chiflado'];
const BUILDING_ZONES = [null,['DESAGÜES','TUBERÍAS','SALA DE BOMBAS','CISTERNA','ÁTICO'],['SEMILLERO','RAÍCES','INVERNADERO','ENREDADERAS','ÁTICO BOTÁNICO'],['DEPÓSITO','INSECTOS','FÓSILES','BIBLIOTECA','ÁTICO DEL MUSEO'],['CALDERAS','MAQUINARIA','CUBAS TÓXICAS','SALA ELÉCTRICA','ÁTICO INDUSTRIAL'],['LABORATORIO CÓSMICO','ENGRANAJES','METEORITOS','CARTAS CELESTES','OBSERVATORIO']];
/* ---------- Edificios bloqueados: se abren de a uno al ganar el anterior ----------
   Para probar todos sin jugar, abre el juego con ?desbloquear al final de la dirección. */
const UNLOCK_KEY = 'mano-unlocked-v1';
let unlocked = 1;
try{ unlocked = clamp(Math.floor(+localStorage.getItem(UNLOCK_KEY) || 1), 1, 6) }catch{}
const TEST_UNLOCK = /[?&]desbloquear\b/.test(location.search);
if(TEST_UNLOCK) unlocked = 6;
function saveUnlocked(){ if(TEST_UNLOCK) return; try{ localStorage.setItem(UNLOCK_KEY, unlocked) }catch{} }
function syncUnlocked(){ // partidas anteriores: cada edificio ya ganado abre el siguiente
  const earned = window.mutantAlbum?.snapshot().earned || {};
  for(let b = 1; b <= 5; b++) if(earned[b+'-win']) unlocked = Math.max(unlocked, b+1);
  saveUnlocked();
}
function renderBuildings(){
  const sel = $('#building-select');
  [...sel.options].forEach((o, i) => { const n = i+1, locked = n > unlocked;
    o.disabled = locked; o.textContent = n + ' · ' + BUILDINGS[i] + (locked ? ' · BLOQUEADO' : '') });
  if(+sel.value > unlocked || !sel.value) sel.value = String(unlocked);
}
function recordLine(){
  return 'EDIFICIOS ABIERTOS · ' + unlocked + '/6' + (bestScore ? ' · RÉCORD ' + bestScore + ' PTS' : '');
}
const zoneTitle = z => building===1 ? ZONES[z] : BUILDING_ZONES[building-1][z];
const ZONES = ['LABORATORIO','TUBERÍAS','COCINA','BIBLIOTECA','DORMITORIO'];
const zoneFor = h => clamp(Math.floor(h/200), 0, 4);

/* ============================== AUDIO ============================== */
let master, sfxBus, musicBus, noiseBuf;
function ensureAudio(){
  if(!audio){
    audio = new (window.AudioContext||window.webkitAudioContext)();
    master = audio.createGain(); master.gain.value = 1; master.connect(audio.destination);
    sfxBus = audio.createGain(); sfxBus.gain.value = 1; sfxBus.connect(master);
    musicBus = audio.createGain(); musicBus.gain.value = .55; musicBus.connect(master);
    noiseBuf = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
    const d = noiseBuf.getChannelData(0); for(let i=0;i<d.length;i++) d[i] = Math.random()*2-1;
  }
  if(audio.state === 'suspended') audio.resume();
  return audio;
}
// Tono con caída de frecuencia (slide = frecuencia final / inicial)
function tone(f, d=.13, type='triangle', vol=.05, at=0, slide=.5, bus){
  if(muted) return;
  try{
    ensureAudio();
    const now = audio.currentTime + at, o = audio.createOscillator(), v = audio.createGain();
    o.type = type; o.frequency.setValueAtTime(f, now); o.frequency.exponentialRampToValueAtTime(Math.max(20, f*slide), now+d);
    v.gain.setValueAtTime(vol, now); v.gain.exponentialRampToValueAtTime(.001, now+d);
    o.connect(v); v.connect(bus || sfxBus); o.start(now); o.stop(now+d+.02);
  }catch{}
}
function noise(d=.2, vol=.06, freq=1200, at=0, bus, q=.8){
  if(muted) return;
  try{
    ensureAudio();
    const now = audio.currentTime + at, s = audio.createBufferSource(), f = audio.createBiquadFilter(), v = audio.createGain();
    s.buffer = noiseBuf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
    v.gain.setValueAtTime(vol, now); v.gain.exponentialRampToValueAtTime(.001, now+d);
    s.connect(f); f.connect(v); v.connect(bus || sfxBus); s.start(now); s.stop(now+d+.02);
  }catch{}
}

const sfx = {
  start(){ tone(523,.1,'square',.04); tone(659,.1,'square',.04,.09); tone(784,.18,'square',.04,.18,1) },
  pickup(){ const b = 700 + Math.min(combo,14)*45; tone(b,.08,'triangle',.05,0,1.2); tone(b*1.5,.1,'triangle',.04,.06,1.1) },
  hit(){ noise(.3,.14,500); tone(160,.35,'sawtooth',.06,0,.35) },
  block(){ noise(.12,.06,3200); tone(380,.1,'square',.025,0,1.6) },
  web(){ noise(.35,.05,1800,0,null,2); tone(300,.25,'triangle',.04,0,1.8) },
  floorUp(){ tone(660,.1,'triangle',.05,0,1); tone(880,.14,'triangle',.05,.1,1) },
  mutation(){ [523,659,784,1047].forEach((f,i)=>tone(f,.12,'square',.035,i*.07,1)) },
  heal(){ tone(587,.1,'sine',.06,0,1); tone(880,.2,'sine',.06,.08,1) },
  warn(){ tone(220,.09,'square',.03,0,1); tone(220,.09,'square',.03,.14,1) },
  alarm(){ for(let i=0;i<4;i++){ tone(880,.14,'sawtooth',.03,i*.3,.6) } },
  lose(){ [392,330,262,196].forEach((f,i)=>tone(f,.25,'triangle',.06,i*.18,.9)) },
  win(){ [523,659,784,1047,784,1047].forEach((f,i)=>tone(f,.18,'square',.04,i*.11,1)) }
};

// ---------- Música procedural: bajo + arpegio + hi-hat, acelera por piso ----------
const BASS = [110,0,110,0,130.81,0,123.47,98];
const ARP_NOTES = [440,523.25,587.33,659.25,783.99,880,1046.5];
const ARP = [0,2,4,2,1,3,5,3,0,2,4,6,5,3,2,1];
let musicOn=false, nextNote=0, stepIdx=0, musicTimer=0;
// Música principal: un mp3 en loop por edificio (si falla, se usa la música procedural).
// Edificios 5 y 6 usan temporalmente las canciones de los niveles 1 y 2.
const MUSIC = [null, 'musica.mp3', 'musica-2.mp3', 'musica-3.mp3', 'musica-4.mp3', 'musica.mp3', 'musica-2.mp3'];
const track = new Audio(ASSET_BASE + MUSIC[1]);
track.loop = true; track.preload = 'auto'; track.volume = .55;
let trackOk = true, fadeTimer = 0, trackFile = MUSIC[1];
track.onerror = () => { trackOk = false };
function selectMusic(b){
  const file = MUSIC[b] || MUSIC[1];
  if(file === trackFile) return;
  clearInterval(fadeTimer); track.pause();
  trackFile = file; trackOk = true; track.src = ASSET_BASE + file; track.load();
}
function musicRate(){ try{ track.preservesPitch = true; track.playbackRate = 1 + (floor-1)*.012 + (alarm > 0 ? .04 : 0) }catch{} }
function fadeOutMusic(ms=1500){
  clearInterval(fadeTimer); const v0 = track.volume, steps = 20; let k = 0;
  fadeTimer = setInterval(() => { k++; track.volume = Math.max(0, v0*(1-k/steps)); if(k >= steps){ clearInterval(fadeTimer); track.pause(); track.volume = .55 } }, ms/steps);
}
function startMusic(){
  if(muted || musicOn) return;
  if(trackOk){
    clearInterval(fadeTimer); track.volume = .55; musicRate();
    musicOn = true; track.play().catch(() => { musicOn = false; trackOk = false; startMusic() });
    return;
  }
  try{ ensureAudio() }catch{ return }
  musicOn = true; nextNote = audio.currentTime + .05; stepIdx = 0;
  musicTimer = setInterval(scheduleMusic, 25);
}
function stopMusic(fade){ musicOn = false; clearInterval(musicTimer); if(trackOk){ if(fade) fadeOutMusic(); else track.pause() } }
function scheduleMusic(){
  if(!musicOn || !audio || trackOk) return;
  const stepDur = 60 / (104 + floor*5) / 4; // semicorcheas
  while(nextNote < audio.currentTime + .12){
    const at = nextNote - audio.currentTime, i = stepIdx;
    if(i % 2 === 0){ const b = BASS[(i/2) % 8]; if(b) tone(b, stepDur*1.8, 'triangle', .07, at, .98, musicBus) }
    if(floor >= 2 && (floor >= 6 || i % 2 === 0)){
      const n = ARP_NOTES[ARP[i % 16]] * (alarm > 0 ? 1.0595 : 1);
      tone(n, stepDur*.9, 'square', .012 + Math.min(floor,10)*.0012, at, 1, musicBus);
    }
    if(i % 4 === 2) noise(.04, .025, 7000, at, musicBus, 1);
    if(floor >= 4 && i % 8 === 4) noise(.09, .04, 900, at, musicBus, .6);
    nextNote += stepDur; stepIdx = (stepIdx + 1) % 32;
  }
}

/* ============================== UI ============================== */
function toast(msg){ clearTimeout(toastTimer); $('#toast').textContent = msg; toastTimer = setTimeout(()=>$('#toast').textContent='', 1900) }
function setState(s){ state = s; $('#cabinet').classList.toggle('title-screen', s==='loading'||s==='menu'); $('#cabinet').classList.toggle('playing', s==='play' || s==='paused'); $('#cabinet').classList.toggle('result-screen', s==='over'||s==='win') }
function hud(){
  $('#score').textContent = floor + ' / 10';
  $('#building-number').textContent = building + ' / 6';
  $('#points').textContent = score;
  $('#dna').textContent = light + ' / 5';
  $('#lives').textContent = lives > 0 ? '♥ '.repeat(lives) : '—';
  $('#bar').style.width = Math.min(100, height/10) + '%';
  const w = $('#web'); w.textContent = cool > 0 ? 'RECARGA ' + Math.ceil(cool) + 's' : 'TELARAÑA'; w.classList.toggle('cooling', cool > 0);
}
function floater(px, py, text, col='#e9ff8a', size=20){ floaters.push({x:px, y:py, text, col, size, life:1}) }
function burst(px, py, col, n=18, power=240){
  for(let i=0;i<n;i++){ const a = Math.random()*Math.PI*2, s = power*(.35+Math.random()*.65);
    parts.push({x:px, y:py, vx:Math.cos(a)*s, vy:Math.sin(a)*s - 60, life:.8, max:.8, col, r:2+Math.random()*3}) }
}

function start(){
  if(window.albumOpen || !ready || state === 'play' || state === 'paused' || state === 'ending') return;
  building = Math.max(1,Math.min(unlocked,Number($('#building-select').value)||1));
  window.mutantAlbum?.newRun();
  selectMusic(building);
  setState('play');
  x = target = 240; t = height = light = total = inv = shield = cool = mutation = ending = 0;
  score = combo = maxCombo = shake = flash = alarm = happy = zone = prevZone = zoneFade = 0;
  try{ track.currentTime = 0 }catch{} waveTimer = 8; spawn = 1.3; lives = 3; floor = 1;
  objects = []; parts = []; floaters = []; keys = {};
  $('#overlay').style.display = 'none'; $('#pause').textContent = 'Ⅱ'; $('#toast').textContent = '';
  hud(); sfx.start(); startMusic(); toast('EDIFICIO '+building+' · ¡A trepar!');
}
$('#start').onclick = start;

function web(){ if(state==='play' && cool<=0){ shield = 2.2; cool = 6; sfx.web(); burst(x, HAND_Y, '#bdefff', 14, 160) } }
$('#web').onpointerdown = e => { e.preventDefault(); web() };

function toggleSound(){
  muted = !muted;
  $('#sound').textContent = 'SONIDO: ' + (muted ? 'OFF' : 'ON');
  $('#sound-mobile').textContent = $('#sound-menu').textContent = '♪ ' + (muted ? 'OFF' : 'ON');
  if(muted) stopMusic(); else { tone(500); if(state==='play') startMusic() }
}
$('#sound').onclick = $('#sound-mobile').onclick = $('#sound-menu').onclick = toggleSound;

function pause(){
  if(window.albumOpen) return;
  if(state==='play'){ setState('paused'); stopMusic(); $('#pause').textContent='▶'; keys={} }
  else if(state==='paused'){ setState('play'); startMusic(); $('#pause').textContent='Ⅱ'; $('#toast').textContent='' }
}
$('#pause').onclick = pause;
document.addEventListener('visibilitychange', ()=>{ if(document.hidden && state==='play') pause() });
onblur = () => { keys = {}; if(state==='play') pause() };

function skipEnding(){ if(state==='ending' && ending > 1.2 && ending < 7.6) ending = 7.6 }
onkeydown = e => {
  if(['ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
  keys[e.code] = true;
  if((e.code==='Enter' || e.code==='Space') && ['menu','over','win'].includes(state) && !e.repeat){ e.preventDefault(); start(); return }
  if(e.code==='Space'){ web(); skipEnding() }
  if(e.code==='Enter') skipEnding();
  if((e.code==='KeyP' || e.code==='Escape') && !e.repeat) pause();
};
onkeyup = e => keys[e.code] = false;

for(const id of ['left','right']){
  const b = $('#'+id);
  b.onpointerdown = e => { e.preventDefault(); keys[id] = true; b.setPointerCapture(e.pointerId) };
  b.onpointerup = b.onpointercancel = b.onlostpointercapture = () => keys[id] = false;
}
let drag = false;
function move(e){ const r = c.getBoundingClientRect(); target = clamp((e.clientX - r.left)/r.width*W, 65, 415) }
c.onpointerdown = e => { if(state==='ending'){ skipEnding(); return } if(state!=='play') return; drag = true; c.setPointerCapture(e.pointerId); move(e) };
c.onpointermove = e => { if(drag) move(e) };
c.onpointerup = c.onpointercancel = () => drag = false;

const bichos = n => n + (n === 1 ? ' bicho' : ' bichos');
const walletLine = w => w == null ? '' : '<br><span style="font-size:14px;color:#d9f47c">Monedero: ' + w + ' pts · cada lámina cuesta 1.000</span>';
function end(win=false){
  setState(win ? 'win' : 'over'); stopMusic();
  if(win){ score += lives*500; window.mutantAlbum?.win(); }
  const wallet = window.mutantAlbum?.addPoints(score);
  best = Math.max(best, Math.floor(height)); bestScore = Math.max(bestScore, score);
  try{ localStorage.setItem('mano-best-v2', best); localStorage.setItem('mano-best-score-v3', bestScore) }catch{}
  $('#overlay').style.display = 'flex';
  const h2 = $('#overlay h2'); h2.style.display = 'block';
  h2.innerHTML = win ? '¡LA MANO ARAÑA<br>ATACA DE NUEVO!' : '¡TE ATRAPARON!';
  $('#overlay p').innerHTML = win
    ? '¡Edificio '+building+' completado! ¡El profesor huyó por la ventana!<br>' + bichos(total) + ' · combo máx. x' + Math.max(1, maxCombo) + ' · bono vidas +' + lives*500 + '<br><b style="font-size:22px">' + score + ' PUNTOS</b>' + walletLine(wallet)
    : 'Llegaste al piso ' + floor + ' de 10 · ' + bichos(total) + '.<br><b style="font-size:22px">' + score + ' PUNTOS</b>' + walletLine(wallet) + '<br>¡El profesor sigue durmiendo!';
  let opened = '';
  if(win && building === unlocked && unlocked < 6){ unlocked++; saveUnlocked(); opened = '<br><b style="color:#c4fa50">¡NUEVO! Edificio ' + unlocked + ' desbloqueado: ' + BUILDINGS[unlocked-1] + '</b>' }
  if(win && building === 6) opened = '<br><b style="color:#c4fa50">¡Completaste los 6 edificios!</b>';
  $('#overlay p').innerHTML += opened;
  renderBuildings();
  if(win && building<6) $('#building-select').value=String(building+1);
  $('#start').textContent = win ? (building<6 ? 'SIGUIENTE EDIFICIO' : 'VOLVER A JUGAR') : 'VOLVER A INTENTAR';
  $('#record').textContent = recordLine();
  if(!win) sfx.lose();
  hud();
}

/* ============================== DIBUJO ============================== */
function image(name, px, py, w, h, angle=0){
  const im = images[name]; if(!im || !im.complete || !im.width) return;
  g.save(); g.translate(px, py); g.rotate(angle);
  const fit = Math.min(w/im.width, h/im.height), iw = im.width*fit, ih = im.height*fit;
  g.drawImage(im, -iw/2, -ih/2, iw, ih); g.restore();
}
function drawZone(z, alpha){
  const im = images[building===1 ? 'background-'+z : 'building-'+building+'-'+z];
  if(!im || !im.width) return;
  const bh = Math.round(im.height*W/im.width);
  const scroll = state==='ending' || state==='win' ? bh-H : (height*1.4)%bh;
  g.globalAlpha=alpha;
  // Todas las copias permanecen derechas; nunca se invierte el eje vertical.
  for(let y=scroll-bh;y<H;y+=bh) g.drawImage(im,0,y,W,bh);
  g.globalAlpha=1;
}
function background(){
  drawZone(zone, 1);
  if(zoneFade > 0) drawZone(prevZone, zoneFade);
  g.fillStyle = '#07181038'; g.fillRect(0, 0, W, H);
}


function professorScream(){
  if(muted) return;
  try{
    ensureAudio();
    const now = audio.currentTime, osc = audio.createOscillator(), gain = audio.createGain();
    osc.type='sawtooth'; osc.frequency.setValueAtTime(280,now); osc.frequency.exponentialRampToValueAtTime(1050,now+.18);
    osc.frequency.setValueAtTime(920,now+.4); osc.frequency.exponentialRampToValueAtTime(420,now+1.1);
    const filter = audio.createBiquadFilter(); filter.type='bandpass'; filter.frequency.value=1200; filter.Q.value=.7;
    osc.connect(filter); filter.connect(gain); gain.connect(sfxBus);
    gain.gain.setValueAtTime(.001,now); gain.gain.exponentialRampToValueAtTime(.14,now+.06); gain.gain.setValueAtTime(.12,now+.8);
    gain.gain.exponentialRampToValueAtTime(.001,now+1.2); osc.start(); osc.stop(now+1.2);
  }catch{}
}

/* ---------------- ESCENA FINAL ----------------
   Todo se calcula a partir del tiempo `ending` (sin estado guardado), así la
   animación es fluida a cualquier FPS y se puede saltar sin romper nada.
   0.0–3.0  la mano trepa por la cama hasta la cara del profesor dormido
   3.0–3.5  ¡POF! nube de polvo, el profesor salta fuera de la cama, vuela el gorro
   3.5–4.4  agachado y temblando: ¡¡AAAAH!!
   4.4–6.3  corre hacia la ventana (4 cuadros sincronizados con la distancia)
   6.3–7.4  impulso y clavado por la ventana abierta
   7.4–10   la mano celebra con su "shh" */
const lerp = (a,b,k) => a + (b-a)*k;
const ease = k => { k = clamp(k,0,1); return k*k*(3-2*k) };
const phase = (e,a,b) => clamp((e-a)/(b-a), 0, 1);
// Dibuja un sprite a escala fija, anclado abajo al centro (sin "saltos" de tamaño entre cuadros)
function sprite(name, cx, bottom, scale, angle=0, sx=1, sy=1){
  const im = images[name]; if(!im || !im.width) return;
  const w = im.width*scale, h = im.height*scale;
  g.save(); g.translate(cx, bottom); g.rotate(angle); g.scale(sx, sy); g.drawImage(im, -w/2, -h, w, h); g.restore();
}
function spriteC(name, cx, cy, scale, angle=0){
  const im = images[name]; if(!im || !im.width) return;
  const w = im.width*scale, h = im.height*scale;
  g.save(); g.translate(cx, cy); g.rotate(angle); g.drawImage(im, -w/2, -h/2, w, h); g.restore();
}
function puff(cx, cy, k, n=10, size=34, seed=1){ // nube de polvo determinista
  if(k <= 0 || k >= 1) return;
  g.save(); g.globalAlpha = (1-k)*.9;
  for(let i=0;i<n;i++){
    const a = i/n*Math.PI*2 + seed, r = 12 + k*size*(1.2 + ((i*37+seed*11)%10)/10);
    g.fillStyle = i%2 ? '#efe6d2' : '#cfc3ad';
    g.beginPath(); g.arc(cx + Math.cos(a)*r, cy + Math.sin(a)*r*.7, (1-k*.5)*(10 + (i*13%7)), 0, Math.PI*2); g.fill();
  }
  g.restore();
}
const BED = {x:0, w:350, bottom:705};                    // cama (ancho y base en el lienzo)
const WIN = {cx:356, cy:352, scale:.5};                   // ventana
const OPEN = {x:WIN.cx-121+64, y:WIN.cy-84+32, w:115, h:116}; // hueco de la ventana (calculado del sprite)
const FACE = {x:BED.x + BED.w*.25, y:0};                  // cara del profesor, y se calcula al dibujar
const RUN_FROM = 130, RUN_TO = 300, FLOOR_Y = 772, PROF_S = .44;

function runX(e){ // arranca acelerando y luego corre a velocidad constante
  const u = phase(e, 4.4, 6.3), s = u < .3 ? u*u/.6 : u - .15;
  return lerp(RUN_FROM, RUN_TO, s/.85);
}

function drawRoom(){
  const wall = g.createLinearGradient(0,0,0,618); wall.addColorStop(0,'#1c1830'); wall.addColorStop(1,'#2b2238');
  g.fillStyle = wall; g.fillRect(0,0,480,620);
  g.strokeStyle = '#ffffff10'; g.lineWidth = 2; for(let xx=24; xx<480; xx+=48){ g.beginPath(); g.moveTo(xx,0); g.lineTo(xx,618); g.stroke() }
  const fl = g.createLinearGradient(0,618,0,800); fl.addColorStop(0,'#4a3826'); fl.addColorStop(1,'#2d2218');
  g.fillStyle = fl; g.fillRect(0,618,480,182);
  g.strokeStyle = '#1f170f'; g.lineWidth = 2; for(let yy=640; yy<800; yy+=34){ g.beginPath(); g.moveTo(0,yy); g.lineTo(480,yy); g.stroke() }
  g.fillStyle = '#20180f'; g.fillRect(0,612,480,8); // zócalo
  // Cielo nocturno detrás del hueco de la ventana
  const sky = g.createLinearGradient(0,OPEN.y,0,OPEN.y+OPEN.h); sky.addColorStop(0,'#0b1430'); sky.addColorStop(1,'#26356a');
  g.fillStyle = sky; g.fillRect(OPEN.x, OPEN.y, OPEN.w, OPEN.h);
  g.fillStyle = '#f3e7b0'; g.beginPath(); g.arc(OPEN.x+OPEN.w-28, OPEN.y+28, 14, 0, Math.PI*2); g.fill();
  g.fillStyle = '#0b1430'; g.beginPath(); g.arc(OPEN.x+OPEN.w-22, OPEN.y+24, 12, 0, Math.PI*2); g.fill(); // luna creciente
  for(let i=0;i<12;i++){ g.globalAlpha = .5 + .5*Math.sin(t*3 + i*1.7); g.fillStyle = '#cfe0ff'; g.fillRect(OPEN.x+8+(i*37)%(OPEN.w-16), OPEN.y+10+(i*53)%(OPEN.h-20), 2, 2) }
  g.globalAlpha = 1;
  // Luz de luna en el piso
  g.fillStyle = '#9fb6ff12'; g.beginPath(); g.moveTo(OPEN.x, OPEN.y+OPEN.h); g.lineTo(OPEN.x+OPEN.w, OPEN.y+OPEN.h); g.lineTo(OPEN.x+OPEN.w-30, 800); g.lineTo(OPEN.x-150, 800); g.closePath(); g.fill();
  spriteC('window', WIN.cx, WIN.cy, WIN.scale);
}

function drawFinale(){
  const e = ending;
  drawRoom();

  // ---- Cama: con el profesor dormido hasta el susto, luego vacía (el cambio se oculta con la nube) ----
  const sleeping = e < 3.08;
  let faceY;
  { const im = images['bed-sleeping']; const s = im && im.width ? BED.w/im.width : .42, h = im && im.width ? im.height*s : 194;
    faceY = BED.bottom - h + h*.34; FACE.y = faceY;
    if(sleeping){ const breath = 1 + Math.sin(t*2.1)*.008; sprite('bed-sleeping', BED.x + BED.w/2, BED.bottom, s, 0, 1, breath) }
    else { const eb = images.bed; sprite('bed', BED.x + BED.w/2 + 6, BED.bottom, eb && eb.width ? (BED.w+10)/eb.width : .58) }
  }
  if(e < 3){ // Zzz
    for(let i=0;i<3;i++){ const k = ((t*.5 + i/3) % 1); g.globalAlpha = Math.sin(k*Math.PI); g.fillStyle = '#eadfb9';
      g.font = `italic ${14+k*14}px serif`; g.textAlign = 'center'; g.fillText('Z', FACE.x + 20 + k*40, faceY - 30 - k*60) }
    g.globalAlpha = 1;
  }

  // ---- Gorro de dormir: sale volando con el susto y cae al piso girando ----
  if(e >= 3){
    const k = phase(e, 3, 4.3), cx = lerp(FACE.x - 10, 52, k), cy = faceY - 20 - Math.sin(k*Math.PI)*170 + k*(752 - faceY + 20);
    spriteC('prof-nightcap', cx, Math.min(cy, 752), .28, k*Math.PI*3);
  }

  // ---- Profesor ----
  if(e >= 3.05 && e < 4.4){
    const k = phase(e, 3.05, 3.5);
    if(k < 1){ // salto fuera de la cama
      const kk = ease(k), x = lerp(FACE.x+10, RUN_FROM, kk), y = lerp(faceY + 70, FLOOR_Y, kk) - Math.sin(k*Math.PI)*120;
      sprite('prof-crouch', x, y, .5, -.35*(1-k));
    }else{ // aterriza (aplastado un instante) y tiembla
      const land = phase(e, 3.5, 3.62), squash = 1 - Math.sin(land*Math.PI)*.12, jolt = Math.sin(e*70)*3;
      sprite('prof-crouch', RUN_FROM + jolt, FLOOR_Y, .5, 0, 2-squash, squash);
      if(e > 3.55){ // globo de grito
        const pop = ease(phase(e, 3.55, 3.7));
        g.save(); g.translate(250, 560); g.scale(pop, pop);
        g.fillStyle='#f6ecbf'; g.strokeStyle='#3d281e'; g.lineWidth=3; g.beginPath(); g.ellipse(0,0,96,40,-.08,0,Math.PI*2); g.fill(); g.stroke();
        g.beginPath(); g.moveTo(-60,28); g.lineTo(-95,70); g.lineTo(-30,36); g.fill();
        g.fillStyle='#b84430'; g.font='900 30px system-ui'; g.textAlign='center'; g.fillText('¡¡AAAAH!!', 0, 10); g.restore();
      }
    }
  }else if(e >= 4.4 && e < 6.3){ // carrera
    const x = runX(e), dist = x - RUN_FROM, f = Math.floor(dist/15) % 4, bob = Math.abs(Math.sin(dist/15*Math.PI/2))*7;
    sprite('prof-run-'+f, x, FLOOR_Y - bob, PROF_S, .05);
    // polvo en los pies (se repite cada paso)
    for(let p=0;p<3;p++){ const kd = ((dist/15 + p*1.33) % 4)/4; puff(x - 50 - kd*30, FLOOR_Y - 8, kd, 5, 14, p) }
  }else if(e >= 6.3 && e < 7.4){
    const k = phase(e, 6.3, 6.5);
    if(k < 1){ sprite('prof-launch', lerp(RUN_TO, RUN_TO+15, k), lerp(FLOOR_Y, FLOOR_Y-40, ease(k)), PROF_S, -.15*k) }
    else{
      const q = phase(e, 6.5, 7.4);
      let cx, cy, sc, ang;
      if(q < .75){ // arco hacia el centro del hueco
        const u = ease(q/.75), P0 = [RUN_TO+30, FLOOR_Y-110], P1 = [RUN_TO+10, OPEN.y+10], P2 = [OPEN.x+OPEN.w/2, OPEN.y+OPEN.h/2];
        cx = (1-u)*(1-u)*P0[0] + 2*(1-u)*u*P1[0] + u*u*P2[0]; cy = (1-u)*(1-u)*P0[1] + 2*(1-u)*u*P1[1] + u*u*P2[1];
        sc = lerp(PROF_S, .2, u); ang = lerp(-.7, 0, u);
        spriteC('prof-dive', cx, cy, sc, ang);
      }else{ // atraviesa la ventana: se recorta al hueco y se aleja
        const u = (q-.75)/.25; cx = lerp(OPEN.x+OPEN.w/2, OPEN.x+OPEN.w+70, u); cy = lerp(OPEN.y+OPEN.h/2, OPEN.y+OPEN.h/2-25, u); sc = lerp(.2,.12,u);
        g.save(); g.beginPath(); g.rect(OPEN.x, OPEN.y, OPEN.w, OPEN.h); g.clip(); spriteC('prof-dive', cx, cy, sc, -.1*u); g.restore();
      }
    }
  }

  // ---- Nube del susto (tapa el cambio de cama) ----
  puff(FACE.x + 10, faceY + 10, phase(e, 2.98, 3.7), 14, 70, 2);
  if(e >= 2.98 && e < 3.2){ g.fillStyle = `rgba(255,255,240,${(1-phase(e,2.98,3.2))*.7})`; g.fillRect(0,0,W,H) }

  // ---- La mano ----
  if(e < 3){ // trepa por la cama con una curva suave
    const k = ease(phase(e, .2, 2.85)), P0 = [300, 820], P1 = [250, 560], P2 = [FACE.x + 36, faceY + 4];
    const hx = (1-k)*(1-k)*P0[0] + 2*(1-k)*k*P1[0] + k*k*P2[0], hy = (1-k)*(1-k)*P0[1] + 2*(1-k)*k*P1[1] + k*k*P2[1];
    image('hand-'+(k < 1 ? Math.floor(t*10)%4 : 4), hx, hy, 82, 82, -.25*k + Math.sin(t*12)*.04*(1-k));
  }else if(e < 7.4){ // sobre la almohada, feliz con la travesura
    image('hand-'+(e < 4.4 ? 4 : Math.floor(t*8)%4), FACE.x + 20, faceY + 6 - Math.abs(Math.sin(t*6))*4, 82, 82, -.1);
  }else{ // salta al piso y hace "shh"
    const k = ease(phase(e, 7.4, 7.9)), hx = lerp(FACE.x + 20, 236, k), hy = lerp(faceY + 6, 735, k) - Math.sin(k*Math.PI)*90;
    image('hand-'+(k < 1 ? 4 : 7), hx, hy, k < 1 ? 82 : 110, k < 1 ? 82 : 110);
  }

  if(state==='win') return; // el resultado ya lo muestra la capa HTML
  if(e > 7.6){
    const k = ease(phase(e, 7.6, 8)); g.save(); g.translate(240, 205); g.scale(k, k);
    g.fillStyle='#14210d'; g.font='900 26px system-ui'; g.textAlign='center'; g.fillText('¡LA MANO ARAÑA',2,-13); g.fillText('ATACA DE NUEVO!',2,19);
    g.fillStyle='#cbe750'; g.fillText('¡LA MANO ARAÑA',0,-15); g.fillText('ATACA DE NUEVO!',0,17); g.restore();
  }
  g.fillStyle='#f1e3bf'; g.font='bold 18px system-ui'; g.textAlign='center';
  g.fillText(e<3 ? 'Chuuut… el profesor duerme.' : e<4.4 ? '¡Una mano en mi cara!' : e<7.4 ? '¡Corre, profesor, corre!' : '¡Edificio '+building+' completado!', 240, 120);
  if(state==='ending' && e > 1.2 && e < 7.6){ g.globalAlpha = .55 + Math.sin(t*4)*.25; g.font='13px system-ui'; g.fillText('Toca o pulsa Espacio para saltar', 240, 790); g.globalAlpha = 1 }
}

function drawWarnings(){
  for(const o of objects){
    if(o.pick || o.mutant) continue;
    // Sombra del pisotón: crece mientras se acerca el golpe
    if(o.stomp){
      const k = o.delay > 0 ? 1 - o.delay/o.delayMax : 1;
      g.fillStyle = `rgba(255,60,40,${.18 + k*.25})`;
      g.beginPath(); g.ellipse(o.x, HAND_Y + 45, 30 + k*28, 10 + k*8, 0, 0, Math.PI*2); g.fill();
      if(o.delay > 0 && Math.floor(t*10) % 2 === 0){
        g.fillStyle = '#ff5a43'; g.font = '900 34px system-ui'; g.textAlign = 'center'; g.fillText('!', o.x, HAND_Y - 70);
      }
    }
    // Aviso arriba para lo que aún no entra en pantalla
    if(o.y < 40 && !(o.stomp && o.delay > 0)){
      const a = .5 + Math.sin(t*14)*.3;
      g.fillStyle = `rgba(255,95,70,${a})`;
      g.beginPath(); g.moveTo(o.x-11, 122); g.lineTo(o.x+11, 122); g.lineTo(o.x, 138); g.closePath(); g.fill();
    }
  }
}

function draw(){
  g.clearRect(0,0,W,H); g.fillStyle='#142825'; g.fillRect(0,0,W,H);
  if(['loading','menu'].includes(state)){
    const im = images.cover;
    if(im && im.width){ const ch = im.height*W/im.width; g.drawImage(im, 0, Math.min(0, (H-ch)/2 + 40), W, ch) }
    return;
  }

  g.save();
  if(shake > 0){ const s = shake; g.translate((Math.random()-.5)*s, (Math.random()-.5)*s) }
  background();
  if(state==='ending' || state==='win'){ drawFinale(); g.restore(); return }

  drawWarnings();
  for(const o of objects){
    if(o.stomp && o.delay > 0) continue;
    if(o.mutant){drawMutantHazard(o);continue;}
    const wobble = Math.sin(t*6 + o.phase), [w,h] = SIZE[o.type];
    if(o.pick){ // halo de los bichos
      g.fillStyle = o.type==='beetle' ? '#65d9ff33' : o.type==='moth' ? '#8dff8a33' : '#f4ff6a33';
      g.beginPath(); g.arc(o.x, o.y, 34 + Math.sin(t*5+o.phase)*4, 0, Math.PI*2); g.fill();
    }
    image(o.type, o.x, o.y, w, h, o.type==='swatter' ? wobble*.4 : o.pick ? wobble*.12 : wobble*.1);
    if(o.type==='spray'){ g.fillStyle='#b7ef4744'; g.beginPath(); g.ellipse(o.x+Math.sin(t*3)*16, o.y+50, 36, 35, 0, 0, Math.PI*2); g.fill() }
  }

  if(shield > 0 || mutation > 0){
    g.strokeStyle = mutation > 0 ? '#caff43' : '#79dcff'; g.lineWidth = 3;
    if(shield > 0 && shield < 1 && Math.floor(t*12) % 2) g.globalAlpha = .35; // parpadea antes de acabarse
    for(const r of [68,82]){ g.beginPath(); g.arc(x, HAND_Y, r, 0, Math.PI*2); g.stroke() }
    for(let i=0;i<8;i++){ const a = i*Math.PI/4 + t*.4; g.beginPath(); g.moveTo(x,HAND_Y); g.lineTo(x+Math.cos(a)*82, HAND_Y+Math.sin(a)*82); g.stroke() }
    g.globalAlpha = 1;
  }
  const hs = mutation > 0 ? 150 : 135;
  if(inv <= 0 || Math.floor(t*14) % 2 === 0)
    image('hand-'+(mutation>0 ? 6 : inv>0 ? 5 : happy>0 ? 4 : Math.floor(t*8)%4), x, HAND_Y, hs, hs, Math.sin(t*8)*.025 + tilt);

  if(mult() > 1){
    g.font = '900 18px system-ui'; g.textAlign = 'center'; g.fillStyle = '#14210d';
    g.fillText('COMBO x'+mult(), x+1, HAND_Y-79); g.fillStyle = '#e9ff8a'; g.fillText('COMBO x'+mult(), x, HAND_Y-80);
  }

  for(const p of parts){ g.globalAlpha = Math.max(0, p.life/p.max); g.fillStyle = p.col; g.beginPath(); g.arc(p.x, p.y, p.r, 0, Math.PI*2); g.fill() }
  g.globalAlpha = 1;
  for(const f of floaters){
    g.globalAlpha = Math.min(1, f.life*2); g.font = `900 ${f.size}px system-ui`; g.textAlign = 'center';
    g.fillStyle = '#0a1210'; g.fillText(f.text, f.x+2, f.y+2); g.fillStyle = f.col; g.fillText(f.text, f.x, f.y);
  }
  g.globalAlpha = 1;
  g.restore();

  // Bordes rojos durante la alarma y destello al recibir daño
  if(alarm > 0){
    const a = .18 + Math.sin(t*8)*.12, grd = g.createRadialGradient(240,400,250,240,400,520);
    grd.addColorStop(0,'rgba(255,40,30,0)'); grd.addColorStop(1,`rgba(255,40,30,${a})`); g.fillStyle = grd; g.fillRect(0,0,W,H);
  }
  if(flash > 0){ g.fillStyle = `rgba(255,70,60,${flash*.9})`; g.fillRect(0,0,W,H) }
  if(lives === 1 && state==='play'){ // última vida: viñeta roja suave
    const grd = g.createRadialGradient(240,400,300,240,400,560);
    grd.addColorStop(0,'rgba(120,0,0,0)'); grd.addColorStop(1,`rgba(120,0,0,${.25+Math.sin(t*5)*.1})`); g.fillStyle = grd; g.fillRect(0,0,W,H);
  }
  if(state==='paused'){
    g.fillStyle='#071517bb'; g.fillRect(0,100,480,600); g.fillStyle='#d9ee75'; g.font='bold 36px system-ui'; g.textAlign='center';
    g.fillText('PAUSA',240,390); g.font='17px system-ui'; g.fillText('Pulsa ▶, P o Esc para continuar',240,425);
  }
}

/* ============================== LÓGICA ============================== */
function spawnPickup(px){
  const r = Math.random(), type = r < .7 ? 'firefly' : r < .9 ? 'beetle' : 'moth';
  objects.push({x: px ?? 75 + Math.random()*330, y:-100, type, pick:true, phase:Math.random()*6, vy:baseSpeed()});
}
function spawnHazard(){
  if(building>1){spawnMutantHazard();return;}
  const types = floor<3 ? ['shoe','fly'] : floor<5 ? ['shoe','fly','swatter'] : ['shoe','fly','swatter','spray'];
  const type = rand(types);
  if(type==='shoe' && floor >= 4 && Math.random() < .35){ // pisotón dirigido a la mano
    const d = Math.max(.6, 1 - floor*.03);
    objects.push({x:clamp(target,75,405), y:-120, type, pick:false, phase:0, vy:0, stomp:true, delay:d, delayMax:d});
    sfx.warn(); return;
  }
  objects.push({x:75 + Math.random()*330, y:-100, type, pick:false, phase:Math.random()*6,
    vy: baseSpeed() * (type==='fly' ? 1.08 : 1), homing: type==='swatter' && floor >= 5});
}
function spawnWave(){ // fila de peligros con un hueco que tiene un bicho de premio
  const cols = [75,157,240,322,405], gap = Math.floor(Math.random()*cols.length);
  cols.forEach((cx,i)=>{
    if(i===gap) spawnPickup(cx);
    else if(building>1) spawnMutantHazard(cx,true);
    else objects.push({x:cx, y:-100, type: rand(['shoe','fly']), pick:false, phase:Math.random()*6, vy:baseSpeed()*.85, wave:true});
  });
  toast('¡OLEADA! Busca el hueco');
}
function hits(o){
  if(o.mutant)return hitsMutant(o);
  const [hw,hh] = HITBOX[o.type], k = mutation > 0 && o.pick ? 1.15 : 1;
  if(Math.abs(o.x - x) < hw*k && Math.abs(o.y - HAND_Y) < hh*k) return true;
  if(o.type==='spray'){ const cx = o.x + Math.sin(t*3)*16, cy = o.y + 50; if(Math.abs(cx-x) < 34 && Math.abs(cy-HAND_Y) < 32) return true }
  return false;
}
function collect(o){
  total++; combo++; happy = .3; maxCombo = Math.max(maxCombo, mult());
  const pts = 10*mult(); score += pts;
  burst(x, HAND_Y, o.type==='beetle' ? '#65d9ff' : o.type==='moth' ? '#8dff8a' : '#d8ef68');
  sfx.pickup(); floater(o.x, HAND_Y-60, '+'+pts);
  if(combo % 5 === 0 && mult() <= 5) toast('¡COMBO x'+mult()+'!');
  if(o.type==='beetle'){ shield = Math.max(shield,5); toast('¡ESCUDO LUMINOSO!') }
  else if(o.type==='moth'){ if(lives < 3){ lives++; toast('¡VIDA RECUPERADA!'); sfx.heal() } else { score += 50; floater(o.x, HAND_Y-90, '+50 BONO', '#8dff8a') } }
  else { light++; if(light >= 5){ light = 0; mutation = 7; toast('¡MUTACIÓN ACTIVADA!'); sfx.mutation(); shake = Math.max(shake,6) } }
}
function damage(){
  lives--; inv = 1.8; combo = 0; shake = 14; flash = .35;
  burst(x, HAND_Y, '#f17469', 26, 300); sfx.hit(); floater(x, HAND_Y-70, '-1 ♥', '#ff8a7a', 24);
  if(navigator.vibrate) try{ navigator.vibrate(80) }catch{}
  if(lives <= 0){ hud(); end(); return true }
  return false;
}

function step(dt){
  if(state !== 'paused') t += dt;
  shake = Math.max(0, shake - dt*40); flash = Math.max(0, flash - dt*1.5);
  for(const f of floaters){ f.y -= 45*dt; f.life -= dt } floaters = floaters.filter(f => f.life > 0);
  if(state !== 'paused'){ for(const p of parts){ p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 420*dt; p.life -= dt } parts = parts.filter(p => p.life > 0) }

  if(state === 'ending'){
    const before = ending; ending += dt;
    const cross = x => before < x && ending >= x;
    if(cross(2.98)){ professorScream(); noise(.35,.1,700) }
    if(cross(3.5)){ noise(.18,.12,180); tone(90,.2,'sine',.08) }       // aterrizaje
    if(ending >= 4.4 && ending < 6.3){                                   // pasos sincronizados con la carrera
      const s0 = Math.floor((runX(before)-RUN_FROM)/30), s1 = Math.floor((runX(ending)-RUN_FROM)/30);
      if(s1 !== s0) { tone(110,.05,'triangle',.06,0,.6); noise(.05,.04,400) }
    }
    if(cross(6.3)) tone(240,.25,'triangle',.05,0,2.5);                  // impulso
    if(cross(6.5)) noise(.6,.06,1500,0,null,.5);                         // whoosh
    if(cross(7.6)) sfx.win();
    if(ending >= 10) end(true);
  }

  if(state === 'play'){
    height = Math.min(1000, height + dt*(13 + floor*.65));
    const next = Math.min(10, 1 + Math.floor(height/100));
    if(next !== floor){
      floor = next; score += 100; sfx.floorUp(); floater(240, 370, 'PISO '+floor+' · +100', '#caed55', 24);
      const pack = window.mutantAlbum?.floor(floor) ? ' · ¡+1 SOBRE!' : '';
      if(floor === 5 || floor === 9){ alarm = 6; sfx.alarm(); toast((floor===9 ? '¡ÚLTIMOS PISOS!' : '¡ALARMA EN EL EDIFICIO!') + pack) }
      else toast('PISO '+floor+pack);
    }
    const z = zoneFor(height);
    if(z !== zone){ prevZone = zone; zone = z; zoneFade = 1; if(zone !== 2 && zone !== 4){ const zn = zoneTitle(zone); setTimeout(() => { if(state==='play') toast('ZONA: ' + zn) }, 900) } }
    zoneFade = Math.max(0, zoneFade - dt*.8);
    musicRate();
    if(height >= 1000){
      setState('ending'); ending = 0; stopMusic(true); zone = 4; zoneFade = 0; objects = []; $('#toast').textContent = ''; hud(); return;
    }

    if(keys.ArrowLeft || keys.KeyA || keys.left) target -= dt*380;
    if(keys.ArrowRight || keys.KeyD || keys.right) target += dt*380;
    target = clamp(target, 65, 415);
    const px = x; x += (target - x)*Math.min(1, dt*16);
    tilt += (clamp((x - px)/Math.max(dt,.001)/1500, -.25, .25) - tilt)*Math.min(1, dt*10);
    inv = Math.max(0, inv-dt); shield = Math.max(0, shield-dt); cool = Math.max(0, cool-dt);
    mutation = Math.max(0, mutation-dt); happy = Math.max(0, happy-dt); alarm = Math.max(0, alarm-dt);

    spawn -= dt;
    if(spawn <= 0){
      spawn = Math.max(.48, 1 - floor*.045) * (alarm > 0 ? .65 : 1);
      if(Math.random() < (alarm > 0 ? .3 : .43)) spawnPickup(); else spawnHazard();
    }
    if(floor >= 6){ waveTimer -= dt; if(waveTimer <= 0){ waveTimer = 7 + Math.random()*3; spawnWave(); spawn = 1.3 } }

    for(const o of objects){
      if(o.stomp && o.delay > 0){ o.delay -= dt; if(o.delay <= 0) o.vy = 820; continue }
      if(o.mutant){updateMutantHazard(o,dt);}else o.y += o.vy*dt;
      if(o.type==='fly' || o.pick){ const amp = o.type==='fly' && floor >= 7 ? 95 : 45; o.x = clamp(o.x + Math.sin(t*3+o.phase)*dt*amp, 55, 425) }
      if(o.homing && o.y < HAND_Y - 120) o.x += Math.sign(x - o.x)*Math.min(Math.abs(x - o.x), 55*dt);
      if(mutation > 0 && o.pick){ // imán mutante
        const dx = x - o.x, dy = HAND_Y - o.y, d = Math.hypot(dx,dy);
        if(d < 200 && d > 1){ o.x += dx/d*300*dt; o.y += dy/d*300*dt }
      }
      if(hits(o)){
        o.y = 1000;
        if(o.pick) collect(o);
        else if(shield > 0 || mutation > 0){ score += 25; burst(x, HAND_Y, '#b5f4ff'); sfx.block(); shake = Math.max(shake, 4); floater(o.x, HAND_Y-60, 'BLOQUEO +25', '#b5f4ff', 17) }
        else if(inv <= 0){ if(damage()) break }
      }
      if(o.stomp && o.y > HAND_Y + 60 && !o.landed){ o.landed = true; shake = Math.max(shake, 7); noise(.15,.08,250) }
    }
    objects = objects.filter(o => o.y < 950);
    hud();
  }
  draw();
}

function frame(now){ const dt = Math.min(.035, (now - last)/1000 || .016); last = now; step(dt); requestAnimationFrame(frame) }

Promise.all(names.map(name => new Promise((resolve, reject) => {
  const im = new Image(); im.onload = () => resolve(); im.onerror = () => (['cover','hand-0'].includes(name) ? reject(new Error(name)) : resolve());
  im.src = ASSET_BASE + name + '.webp'; images[name] = im;
}))).then(() => {
  ready = true; setState('menu');
  $('#start').textContent = '¡SUBIR AL PISO 10!';
  syncUnlocked(); renderBuildings(); $('#building-select').value = String(unlocked); // seguir donde quedaste
  $('#record').textContent = recordLine();
  hud();
}).catch(() => {
  $('#start').textContent = 'RECARGAR IMÁGENES'; $('#start').onclick = () => location.reload();
  $('#record').textContent = 'No se pudieron cargar las imágenes. Intenta recargar.';
});
requestAnimationFrame(frame);
