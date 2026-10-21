'use strict';
/* ============================================================
   FINALES DE LOS EDIFICIOS 2 A 6
   Cada escena dura 10 s, igual que la del edificio 1 (la cama y la ventana, en game.js):
   el tiempo `ending` controla todo, así se puede saltar sin romper nada.
   Los sprites salen de las láminas de arte en assets/end-*.webp.
   Este archivo se carga antes de game.js; las funciones de dibujo (sprite, image, puff…)
   son de game.js y solo se usan cuando la escena ya está corriendo.
   ============================================================ */
const END_SPRITES = [
  // Edificio 2 · sillón y chimenea
  'armchair','prof-sit','prof-scared','hand-front','fireplace','prof-dive2','prof-chimney','banana-fly','smoke',
  // Edificio 3 · la mano duerme y el profesor se venga
  'bed-hand','bed-empty','hand-springs','hand-ceiling','prof-sneak','prof-boo','prof-laugh1','prof-laugh2',
  // Edificio 4 · café y puerta
  'table','cup-spill','cup-empty','door','door-prof1','door-prof2',
  'prof-drink','prof-drink-hand','prof-coffee-scared','hand-jump','chair-tip','prof-spill','prof-run-r1','prof-run-r2',
  // Edificio 5 · hamaca en la playa
  'hammock-sleep','hammock-empty','hand-thread1','hand-thread2','prof-jump','run-back1','run-back2','run-back3','run-back4','run-back5','dust',
  // Edificio 6 · pasillo y vidrio
  'prof-peek','prof-hall-scared','run-front1','run-front2','face-glass','prof-dizzy','glass-crack'
].map(n => 'end-' + n);

/* ---------- utilidades de dibujo ---------- */
// Dibuja un sprite con su base apoyada en (cx, bottom) y una altura dada en píxeles del lienzo.
function endH(name, cx, bottom, h, angle=0, sx=1, sy=1){
  const im = images['end-'+name]; if(!im || !im.width) return;
  sprite('end-'+name, cx, bottom, h/im.height, angle, sx, sy);
}
// Igual, pero centrado en (cx, cy).
function endC(name, cx, cy, h, angle=0){
  const im = images['end-'+name]; if(!im || !im.width) return;
  spriteC('end-'+name, cx, cy, h/im.height, angle);
}
// Por ancho, centrado.
function endW(name, cx, cy, w, angle=0){
  const im = images['end-'+name]; if(!im || !im.width) return;
  spriteC('end-'+name, cx, cy, w/im.width, angle);
}
function endBubble(x, y, text, k, fill='#f6ecbf', ink='#b84430', size=30){
  if(k <= 0) return; const p = ease(Math.min(1, k));
  g.save(); g.translate(x, y); g.scale(p, p);
  g.font = `900 ${size}px system-ui`; const w = Math.max(90, g.measureText(text).width/2 + 26);
  g.fillStyle = fill; g.strokeStyle = '#3d281e'; g.lineWidth = 3;
  g.beginPath(); g.ellipse(0, 0, w, size*1.3, -.06, 0, Math.PI*2); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(-w*.45, size*.9); g.lineTo(-w*.8, size*2.2); g.lineTo(-w*.1, size*1.1); g.fill();
  g.fillStyle = ink; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 0, 2); g.restore();
  g.textBaseline = 'alphabetic';
}
function endZzz(x, y){
  for(let i=0;i<3;i++){ const k = ((t*.5 + i/3) % 1); g.globalAlpha = Math.sin(k*Math.PI); g.fillStyle = '#eadfb9';
    g.font = `italic ${14+k*14}px serif`; g.textAlign = 'center'; g.fillText('Z', x + k*40, y - k*60) }
  g.globalAlpha = 1;
}
function endFlash(e, at, dur=.25, col='255,255,240'){
  if(e >= at && e < at+dur){ g.fillStyle = `rgba(${col},${(1-(e-at)/dur)*.75})`; g.fillRect(0,0,W,H) }
}
function endHand(x, y, size, crawl=true, angle=0){ image('hand-'+(crawl ? Math.floor(t*10)%4 : 4), x, y, size, size, angle) }
function endFade(e, at, dur=.35){ // fundido a negro y de vuelta, centrado en `at`
  const d = Math.abs(e-at); if(d < dur){ g.fillStyle = `rgba(8,6,14,${1-d/dur})`; g.fillRect(0,0,W,H) }
}
function woodFloor(y0, c0='#4a3826', c1='#2d2218', line='#1f170f'){
  const fl = g.createLinearGradient(0,y0,0,H); fl.addColorStop(0,c0); fl.addColorStop(1,c1);
  g.fillStyle = fl; g.fillRect(0,y0,W,H-y0);
  g.strokeStyle = line; g.lineWidth = 2; for(let yy=y0+22; yy<H; yy+=34){ g.beginPath(); g.moveTo(0,yy); g.lineTo(W,yy); g.stroke() }
}
function wallpaper(c0, c1, y1, stripe='#ffffff0d'){
  const wall = g.createLinearGradient(0,0,0,y1); wall.addColorStop(0,c0); wall.addColorStop(1,c1);
  g.fillStyle = wall; g.fillRect(0,0,W,y1);
  g.strokeStyle = stripe; g.lineWidth = 6; for(let xx=20; xx<W; xx+=40){ g.beginPath(); g.moveTo(xx,0); g.lineTo(xx,y1); g.stroke() }
}
function rug(cx, cy, rx, ry, c0='#6b1f3a', c1='#3d0f22'){
  const r = g.createRadialGradient(cx,cy,10,cx,cy,rx); r.addColorStop(0,c0); r.addColorStop(1,c1);
  g.fillStyle = r; g.beginPath(); g.ellipse(cx,cy,rx,ry,0,0,Math.PI*2); g.fill();
  g.strokeStyle = '#d9a44a55'; g.lineWidth = 3; g.beginPath(); g.ellipse(cx,cy,rx-10,ry-6,0,0,Math.PI*2); g.stroke();
}
function stepsSfx(before, now, from, to, every=.18, vol=.05){
  if(now < from || now > to) return;
  if(Math.floor((before-from)/every) !== Math.floor((now-from)/every)){ tone(110,.05,'triangle',vol,0,.6); noise(.05,vol*.7,400) }
}
function endLaugh(at){ [0,.22,.44,.66,.88].forEach((d,i) => tone(300 + (i%2)*40, .16, 'square', .035, at + d, 1.15)) }

/* ============================================================
   ESCENAS
   ============================================================ */
const ENDINGS = {

/* ---------- EDIFICIO 2 · el plátano, el sillón y la chimenea ---------- */
2: {
  outro: '¡El profesor salió disparado por la chimenea!',
  caption: e => e<2.4 ? 'El profesor disfruta su plátano…' : e<3.6 ? '¡Una mano en el sillón!' : e<5.2 ? '¡Se lanza a la chimenea!' : e<7.4 ? '¡Hollín y plátano en la cabeza!' : '¡Edificio 2 completado!',
  draw(e){
    if(e < 5.2){
      wallpaper('#26162f', '#3a2248', 610);
      g.fillStyle = '#20180f'; g.fillRect(0,604,W,10);
      woodFloor(612); rug(220, 712, 210, 48);
      // cuadro en la pared
      g.fillStyle = '#5a3b1c'; g.fillRect(52,190,96,120); g.fillStyle = '#2c3b2e'; g.fillRect(62,200,76,100);
      // chimenea con fuego (el humo crece cuando el profesor entra)
      const FX = 352, FB = 640, FH = 330;
      endH('fireplace', FX, FB, FH);
      const flick = Math.sin(t*17)*.5 + Math.sin(t*11)*.5;
      const fire = g.createRadialGradient(FX, FB-62, 6, FX, FB-62, 90);
      fire.addColorStop(0, `rgba(255,214,90,${.85+flick*.1})`); fire.addColorStop(.5,'rgba(255,120,30,.55)'); fire.addColorStop(1,'rgba(255,80,20,0)');
      g.fillStyle = fire; g.beginPath(); g.ellipse(FX, FB-58, 82, 58 + flick*6, 0, 0, Math.PI*2); g.fill();
      for(let i=0;i<5;i++){ const fx = FX-50+i*25, fh = 40 + 22*Math.abs(Math.sin(t*9+i*1.7));
        g.fillStyle = i%2 ? '#ffb43a' : '#ff7a1f'; g.beginPath(); g.moveTo(fx-12, FB-36); g.quadraticCurveTo(fx, FB-36-fh*1.4, fx+12, FB-36); g.fill() }
      // sillón
      endH('armchair', 150, 655, 250);
      if(e < 3.0){
        // el profesor come su plátano (se balancea un poco)
        endH('prof-sit', 168, 628, 285, Math.sin(t*2)*.015);
        // la mano entra gateando y trepa por el sillón
        if(e > .3){
          const k1 = ease(phase(e, .3, 2.2)), k2 = ease(phase(e, 2.2, 2.95));
          const hx = lerp(lerp(-70, 40, k1), 70, k2), hy = lerp(712, 548, k2);
          endHand(hx, hy, 92, true, -.3*k2);
        }
      }else if(e < 3.6){
        const jolt = Math.sin(e*70)*4;
        endH('prof-scared', 176 + jolt, 632, 300);
        // el plátano sale volando
        const k = phase(e, 3.0, 3.6);
        endC('banana-fly', lerp(250, 20, k), 380 - Math.sin(k*Math.PI)*120, 70, k*8);
        endBubble(310, 250, '¡¡AAAH!!', phase(e, 3.05, 3.2));
      }else{
        // la mano se queda feliz en el sillón
        endH('hand-front', 140, 566, 120, Math.sin(t*5)*.05);
        // el profesor se lanza de cabeza a la chimenea
        if(e < 4.7){
          const k = ease(phase(e, 3.6, 4.6)), x = lerp(170, FX, k), y = lerp(560, 560, k) - Math.sin(k*Math.PI)*120, h = lerp(280, 150, k);
          if(e > 4.25){ g.save(); g.beginPath(); g.rect(FX-95, 410, 190, 230); g.clip(); endC('prof-dive2', x, y, h, -.5 + k*.4); g.restore() }
          else endC('prof-dive2', x, y, h, -.5 + k*.4);
        }
        // humo negro que sale de la chimenea
        for(let i=0;i<4;i++){ const k = phase(e, 4.5 + i*.12, 5.3 + i*.12); if(k<=0 || k>=1) continue;
          g.globalAlpha = 1-k; endC('smoke', FX + (i-1.5)*40, 470 - k*240, 90 + k*90, i); g.globalAlpha = 1 }
      }
    }else{
      // ---- en el techo: el profesor sale por arriba de la chimenea ----
      const sky = g.createLinearGradient(0,0,0,560); sky.addColorStop(0,'#0b1430'); sky.addColorStop(1,'#2a3a72');
      g.fillStyle = sky; g.fillRect(0,0,W,H);
      g.fillStyle = '#f3e7b0'; g.beginPath(); g.arc(380, 190, 34, 0, Math.PI*2); g.fill();
      for(let i=0;i<22;i++){ g.globalAlpha = .4 + .5*Math.abs(Math.sin(t*2 + i)); g.fillStyle = '#cfe0ff'; g.fillRect((i*97)%W, 150 + (i*53)%260, 2, 2) }
      g.globalAlpha = 1;
      // tejados del barrio
      g.fillStyle = '#141a33'; g.beginPath(); g.moveTo(0,520); g.lineTo(120,450); g.lineTo(260,520); g.lineTo(330,470); g.lineTo(480,540); g.lineTo(480,800); g.lineTo(0,800); g.fill();
      g.fillStyle = '#1d2547'; g.fillRect(70,400,26,70); g.fillRect(300,420,22,60);
      // techo propio, con la ventana donde mira la mano
      g.fillStyle = '#2b2236'; g.beginPath(); g.moveTo(0,600); g.lineTo(480,520); g.lineTo(480,800); g.lineTo(0,800); g.fill();
      g.strokeStyle = '#3a2f48'; g.lineWidth = 3; for(let i=0;i<9;i++){ g.beginPath(); g.moveTo(0,620+i*24); g.lineTo(480,540+i*24); g.stroke() }
      g.fillStyle = '#ffcf6b'; g.fillRect(48,640,100,92); g.fillStyle = '#b8402f'; g.fillRect(48,640,18,92); g.fillRect(130,640,18,92);
      endH('hand-front', 98, 728, 70, Math.sin(t*6)*.08);
      g.strokeStyle = '#3d281e'; g.lineWidth = 6; g.strokeRect(48,640,100,92);
      // la chimenea sube de golpe con el profesor tiznado
      const pop = phase(e, 5.35, 5.75), bounce = pop < 1 ? ease(pop)*1.08 : 1 + Math.sin((e-5.75)*16)*.03*Math.max(0, 1-(e-5.75)*2);
      const cy = lerp(960, 790, Math.min(1, bounce));
      for(let i=0;i<5;i++){ const k = ((e*.45 + i/5) % 1); g.globalAlpha = (1-k)*.9; endC('smoke', 330 + Math.sin(i*2+e)*30 + (i%2?40:-40), cy - 330 - k*260, 80 + k*80, i); g.globalAlpha = 1 }
      endH('prof-chimney', 320, cy, 380, Math.sin(t*20)*.01*(e<6.5?1:0));
    }
    endFade(e, 5.2, .3);
    endFlash(e, 3.0);
  },
  sfx(cross){
    if(cross(3.0)){ professorScream(); noise(.3,.1,700) }
    if(cross(3.6)) tone(240,.25,'triangle',.05,0,2.5);
    if(cross(4.35)){ noise(.6,.12,300,0,null,.5); shake = Math.max(shake, 8) }
    if(cross(5.45)){ tone(180,.35,'triangle',.06,0,3); noise(.4,.08,500) }
  }
},

/* ---------- EDIFICIO 3 · la mano duerme y el profesor se venga ---------- */
3: {
  title: '¡EL PROFESOR<br>SE VENGÓ!',
  canvasTitle: ['¡EL PROFESOR', 'SE VENGÓ!'],
  outro: '¡Esta vez el profesor le dio el susto a la mano!',
  caption: e => e<2.2 ? 'La mano araña duerme como un bebé…' : e<3.4 ? 'Shhh… alguien se acerca' : e<4.4 ? '¡BUUU!' : e<7.4 ? '¡El susto fue para la mano!' : '¡Edificio 3 completado!',
  draw(e){
    // ático con vigas y la lámpara verde de araña
    const wall = g.createLinearGradient(0,0,0,620); wall.addColorStop(0,'#2a1b33'); wall.addColorStop(1,'#3d2747');
    g.fillStyle = wall; g.fillRect(0,0,W,620);
    g.fillStyle = '#4a2f1d'; g.beginPath(); g.moveTo(0,0); g.lineTo(170,0); g.lineTo(0,240); g.fill(); g.beginPath(); g.moveTo(480,0); g.lineTo(310,0); g.lineTo(480,240); g.fill();
    g.fillStyle = '#5c3a22'; g.fillRect(0,168,W,26); g.fillStyle = '#3b2414'; g.fillRect(0,192,W,6);
    woodFloor(612, '#5a3d24', '#33241a');
    g.fillStyle = '#2a1a10'; g.fillRect(392,560,72,60); g.fillStyle = '#5a3b1c'; g.fillRect(388,548,80,14);
    const lamp = g.createRadialGradient(428,520,4,428,520,90); lamp.addColorStop(0,'rgba(150,255,90,.65)'); lamp.addColorStop(1,'rgba(150,255,90,0)');
    g.fillStyle = lamp; g.beginPath(); g.arc(428,520,90,0,Math.PI*2); g.fill(); g.fillStyle = '#9dff5a'; g.beginPath(); g.arc(428,522,20,0,Math.PI*2); g.fill();
    // cama
    const BX = 190, BB = 700, BH = 300;
    if(e < 3.6){ const breath = 1 + Math.sin(t*2.2)*.012; endH('bed-hand', BX, BB, BH, 0, 1, breath); if(e < 3.3) endZzz(BX+10, 450) }
    else endH('bed-empty', BX, BB, BH);
    // la mano salta del susto y queda pegada en la viga
    if(e >= 3.6 && e < 4.25){
      const k = ease(phase(e, 3.6, 4.2)), x = lerp(BX, 250, k), y = lerp(500, 300, k);
      endC('hand-springs', x + Math.sin(e*60)*5, y, lerp(170, 210, k), Math.sin(e*40)*.15);
    }else if(e >= 4.25){
      const wob = Math.exp(-(e-4.25)*2.2) * Math.sin((e-4.25)*18);
      endH('hand-ceiling', 250, 192 + 230*(1 + wob*.12), 230*(1 + wob*.12), wob*.06);
    }
    // el profesor entra de puntillas, grita ¡BUU! y se ríe
    if(e >= 2.2 && e < 3.4){
      const k = ease(phase(e, 2.2, 3.3)), bob = Math.abs(Math.sin(e*7))*8;
      endH('prof-sneak', lerp(560, 350, k), 760 - bob, 310);
    }else if(e >= 3.4 && e < 4.4){
      endH('prof-boo', 345 + Math.sin(e*50)*2, 760, 320);
      endBubble(330, 330, '¡BUUU!', phase(e, 3.4, 3.55), '#f6ecbf', '#5b2a7a', 34);
    }else if(e >= 4.4){
      const f = Math.floor((e-4.4)/.22) % 2;
      endH(f ? 'prof-laugh2' : 'prof-laugh1', 330, 815, 360, Math.sin(e*14)*.02);
      if(e < 7.4) endBubble(150, 520, '¡JA JA JA!', phase(e, 4.45, 4.6), '#fff4c9', '#2f6b1a', 28);
    }
    endFlash(e, 3.6, .2, '210,255,170');
  },
  sfx(cross){
    if(cross(3.4)){ tone(140,.4,'sawtooth',.07,0,.6); noise(.25,.08,300) }
    if(cross(3.6)){ [900,1300,1700].forEach((f,i)=>tone(f,.12,'square',.04,i*.05,1.4)) }
    if(cross(4.25)){ tone(220,.6,'sine',.07,0,2.2); tone(330,.5,'triangle',.04,.1,.5); shake = Math.max(shake, 6) }
    if(cross(4.45)) endLaugh(0);
    if(cross(5.6)) endLaugh(0);
  }
},

/* ---------- EDIFICIO 4 · el café y la puerta ---------- */
4: {
  outro: '¡El profesor huyó por la puerta y dejó el café!',
  caption: e => e<2.4 ? 'Un café calentito para el profesor…' : e<3.2 ? '¿Quién está en tu hombro?' : e<4.3 ? '¡Café por todos lados!' : e<6.7 ? '¡Huye por la puerta!' : e<7.4 ? '¡PAM!' : '¡Edificio 4 completado!',
  draw(e){
    // comedor cálido
    wallpaper('#3a2618', '#4c3120', 600, '#ffffff0a');
    g.fillStyle = '#2e1d12'; g.fillRect(0,520,W,80); g.fillStyle = '#5a3b22'; g.fillRect(0,516,W,6);
    woodFloor(600, '#6a4a2c', '#3b2818');
    const lampG = g.createRadialGradient(120,160,4,120,160,160); lampG.addColorStop(0,'rgba(255,210,120,.35)'); lampG.addColorStop(1,'rgba(255,210,120,0)');
    g.fillStyle = lampG; g.fillRect(0,0,300,320);
    // puerta (cambia mientras el profesor sale)
    const DX = 392, DB = 640, DH = 360;
    if(e >= 6.0 && e < 6.3) endH('door-prof1', DX, DB, DH);
    else if(e >= 6.3 && e < 6.65) endH('door-prof2', DX, DB, DH);
    else { const slam = e >= 6.65 ? Math.exp(-(e-6.65)*6)*Math.sin((e-6.65)*50)*.03 : 0; endH('door', DX, DB, DH, slam) }
    endH('table', 92, 650, 150);
    if(e < 3.8){
      // tomando café; la mano sube por la silla hasta su hombro
      if(e < 2.6){
        endH('prof-drink', 210, 700, 340, Math.sin(t*1.6)*.01);
        for(let i=0;i<3;i++){ const k = ((t*.6 + i/3) % 1); g.globalAlpha = (1-k)*.5; g.strokeStyle = '#fff'; g.lineWidth = 3;
          g.beginPath(); g.moveTo(252 + i*8, 430 - k*60); g.quadraticCurveTo(262 + i*8 + Math.sin(t*3+i)*10, 410 - k*60, 252 + i*8, 392 - k*60); g.stroke() }
        g.globalAlpha = 1;
        if(e > 1.0){ const k = ease(phase(e, 1.0, 2.55)); endHand(lerp(-60, 120, k), lerp(700, 470, k), 88, true, -.5*k) }
      }else if(e < 3.2) endH('prof-drink-hand', 214, 700, 345);
      else { endH('prof-coffee-scared', 222 + Math.sin(e*70)*4, 700, 360); endBubble(330, 250, '¡¡AAAH!!', phase(e, 3.25, 3.4)) }
    }else{
      // la silla se cae, la mano queda saltando y la taza termina en el piso
      endH('chair-tip', 150, 700, 250);
      if(e < 6.7) endH('hand-jump', 120, 520 - Math.abs(Math.sin(e*7))*24, 150);
      else endHand(150, 640, 96, false, Math.sin(t*6)*.08);
      const kc = phase(e, 3.8, 4.4);
      if(kc < 1) endC('cup-spill', lerp(270, 300, kc), 560 - Math.sin(kc*Math.PI)*90 + kc*120, 64, kc*6);
      else endH('cup-empty', 300, 700, 46, .2);
      // salto y carrera hacia la puerta
      if(e < 4.3){ const k = ease(phase(e, 3.8, 4.3)); endH('prof-spill', lerp(240, 270, k), 700 - Math.sin(k*Math.PI)*60, 330) }
      else if(e < 6.0){
        const k = phase(e, 4.3, 6.0), x = lerp(250, 360, k), f = Math.floor(e/.12) % 2, bob = Math.abs(Math.sin(e*26))*8;
        endH(f ? 'prof-run-r2' : 'prof-run-r1', x, 708 - bob, 300 - k*30);
        for(let p=0;p<3;p++){ const kd = ((e*3 + p/3) % 1); puff(x - 90 - kd*30, 700, kd, 5, 14, p) }
      }
    }
    endFlash(e, 3.2);
  },
  sfx(cross, before, now){
    if(cross(3.2)){ professorScream(); noise(.3,.1,700) }
    if(cross(3.85)){ noise(.4,.1,900,0,null,.6); tone(500,.2,'sine',.04,0,.4) }
    if(cross(4.35)){ noise(.2,.1,200) }
    stepsSfx(before, now, 4.3, 6.0, .16);
    if(cross(6.05)) tone(300,.2,'triangle',.04,0,.5);
    if(cross(6.65)){ noise(.3,.18,150); tone(70,.3,'sine',.1); shake = Math.max(shake, 10) }
  }
},

/* ---------- EDIFICIO 5 · la hamaca en la playa ---------- */
5: {
  outro: '¡El profesor corrió hasta el horizonte!',
  caption: e => e<1.9 ? 'Siesta en la hamaca al atardecer…' : e<3.2 ? 'Algo baja de las palmeras…' : e<4.0 ? '¡SUSTO EN LA HAMACA!' : e<7.0 ? '¡Corre hasta el horizonte!' : e<7.4 ? 'La hamaca ahora es de la mano' : '¡Edificio 5 completado!',
  draw(e){
    const HZ = 470;
    const sky = g.createLinearGradient(0,0,0,HZ); sky.addColorStop(0,'#3b1f5e'); sky.addColorStop(.55,'#c45a6a'); sky.addColorStop(1,'#ffb84d');
    g.fillStyle = sky; g.fillRect(0,0,W,HZ);
    const sun = g.createRadialGradient(330,HZ-10,10,330,HZ-10,140); sun.addColorStop(0,'rgba(255,240,170,1)'); sun.addColorStop(.25,'rgba(255,214,110,.9)'); sun.addColorStop(1,'rgba(255,180,80,0)');
    g.fillStyle = sun; g.beginPath(); g.arc(330,HZ-10,140,0,Math.PI*2); g.fill();
    g.fillStyle = '#5d3a6b'; g.beginPath(); g.moveTo(0,HZ); g.lineTo(60,HZ-50); g.lineTo(130,HZ-20); g.lineTo(190,HZ-60); g.lineTo(260,HZ); g.fill();
    const sea = g.createLinearGradient(0,HZ,0,HZ+60); sea.addColorStop(0,'#7a5aa0'); sea.addColorStop(1,'#4a3a7a');
    g.fillStyle = sea; g.fillRect(0,HZ,W,60);
    g.strokeStyle = '#ffd98a88'; g.lineWidth = 2; for(let i=0;i<6;i++){ const yy = HZ+8+i*9, xx = 300 + Math.sin(t*2+i)*14; g.beginPath(); g.moveTo(xx-30+i*4,yy); g.lineTo(xx+30-i*4,yy); g.stroke() }
    const sand = g.createLinearGradient(0,HZ+56,0,H); sand.addColorStop(0,'#e8b765'); sand.addColorStop(1,'#b8803c');
    g.fillStyle = sand; g.fillRect(0,HZ+56,W,H-HZ-56);
    g.fillStyle = '#f2cf86'; g.beginPath(); g.moveTo(318,HZ+56); g.lineTo(342,HZ+56); g.lineTo(430,H); g.lineTo(150,H); g.fill();
    const runner = () => {
    // el profesor corre por el camino hacia el horizonte
    if(e >= 3.95 && e < 6.9){
      const k = phase(e, 3.95, 6.6), kk = 1 - Math.pow(1-k, 1.6);
      const x = lerp(400, 330, kk), y = lerp(800, HZ+70, kk), h = lerp(240, 26, kk);
      const frames = h > 120 ? ['run-back1','run-back2'] : h > 60 ? ['run-back3','run-back4'] : ['run-back4','run-back5'];
      const f = frames[Math.floor(e/.11) % 2];
      if(e < 6.6) endH(f, x, y - Math.abs(Math.sin(e*24))*h*.04, h);
      if(e > 6.45){ const kd = phase(e, 6.45, 6.95); g.globalAlpha = 1-kd; endC('dust', 330, HZ+60, 34 + kd*30); g.globalAlpha = 1 }
    }
    };
    // hamaca entre palmeras
    const sway = Math.sin(t*1.3)*.012;
    if(e < 3.2){ endH('hammock-sleep', 232, 790, 450, sway); if(e < 3.0) endZzz(150, 560) }
    else endH('hammock-empty', 232, 790, 450, sway);
    // la mano baja colgando de un hilo y se queda en la hamaca
    if(e >= 1.9 && e < 3.25){
      const k = ease(phase(e, 1.9, 3.1)), f = Math.floor(e/.3) % 2;
      endH(f ? 'hand-thread2' : 'hand-thread1', 250, lerp(-10, 520, k), 300);
    }else if(e >= 3.25){
      endHand(236 + Math.sin(t*1.3)*6, 626, 104, false, sway*4);
    }
    runner();
    // salto del susto
    if(e >= 3.2 && e < 4.0){
      const k = phase(e, 3.2, 4.0);
      endC('prof-jump', lerp(200, 245, k), lerp(600, 760, k) - Math.sin(k*Math.PI)*300, 240, -.2 + k*.3);
      endBubble(330, 220, '¡¡AAAH!!', phase(e, 3.25, 3.4));
    }
    endFlash(e, 3.2);
  },
  sfx(cross, before, now){
    if(cross(1.95)) tone(800,1.0,'sine',.02,0,.5);
    if(cross(3.2)){ professorScream(); noise(.3,.1,700) }
    stepsSfx(before, now, 4.0, 6.5, .14, .04);
    if(cross(6.5)) noise(.5,.05,1200,0,null,.6);
  }
},

/* ---------- EDIFICIO 6 · el pasillo y el vidrio ---------- */
6: {
  title: '¡LOS 6 EDIFICIOS<br>SON TUYOS!',
  canvasTitle: ['¡LOS 6 EDIFICIOS', 'SON TUYOS!'],
  outro: '¡El profesor corrió tan rápido que chocó contra el vidrio!',
  caption: e => e<1.6 ? 'El profesor espía su laboratorio…' : e<3.0 ? 'Algo se arrastra por el pasillo…' : e<3.7 ? '¡Una mano a su espalda!' : e<4.85 ? '¡Corre sin mirar!' : e<7.4 ? '¡CRASH! ¡Contra el vidrio!' : '¡Completaste los 6 edificios!',
  draw(e){
    // pasillo en perspectiva
    const VX = 240, VY = 330;
    g.fillStyle = '#2a1736'; g.fillRect(0,0,W,H);
    g.fillStyle = '#3a2148'; g.beginPath(); g.moveTo(0,0); g.lineTo(VX-70,VY-120); g.lineTo(VX-70,VY+110); g.lineTo(0,640); g.fill();
    g.beginPath(); g.moveTo(W,0); g.lineTo(VX+70,VY-120); g.lineTo(VX+70,VY+110); g.lineTo(W,640); g.fill();
    g.fillStyle = '#c9e86a'; g.globalAlpha = .55; g.fillRect(VX-70,VY-120,140,230); g.globalAlpha = 1;
    g.fillStyle = '#5a1f2c'; g.beginPath(); g.moveTo(VX-70,VY+110); g.lineTo(VX+70,VY+110); g.lineTo(W,640); g.lineTo(W,H); g.lineTo(0,H); g.lineTo(0,640); g.fill();
    g.fillStyle = '#7a2c3a'; g.beginPath(); g.moveTo(VX-30,VY+110); g.lineTo(VX+30,VY+110); g.lineTo(380,H); g.lineTo(100,H); g.fill();
    for(const [lx,ly] of [[60,230],[420,230]]){ const lg = g.createRadialGradient(lx,ly,2,lx,ly,70); lg.addColorStop(0,'rgba(255,200,110,.8)'); lg.addColorStop(1,'rgba(255,200,110,0)'); g.fillStyle = lg; g.beginPath(); g.arc(lx,ly,70,0,Math.PI*2); g.fill() }
    if(e < 4.85){
      if(e < 3.0){
        // puerta del laboratorio entreabierta y el profesor espiando
        const dg = g.createLinearGradient(330,0,450,0); dg.addColorStop(0,'rgba(190,255,120,.75)'); dg.addColorStop(1,'rgba(120,200,80,.25)');
        g.fillStyle = dg; g.fillRect(338, 300, 110, 400);
        endH('prof-peek', 300, 715, 400, Math.sin(t*2)*.01);
        if(e > 1.4){ const k = ease(phase(e, 1.4, 2.9)); endHand(lerp(-60, 120, k), 690, 96) }
      }else if(e < 3.7){
        endH('prof-hall-scared', 250 + Math.sin(e*70)*4, 730, 400);
        endBubble(330, 220, '¡¡AAAH!!', phase(e, 3.05, 3.2));
      }else{
        // corre hacia la cámara cada vez más grande
        const k = phase(e, 3.7, 4.85), s = Math.pow(k, 2.2), h = lerp(330, 1150, s), f = Math.floor(e/.1) % 2;
        endHand(240, 520, 70, false);
        endH(f ? 'run-front2' : 'run-front1', 240, lerp(720, 1180, s) - Math.abs(Math.sin(e*24))*10, h);
      }
    }else{
      // después del choque: mareado en el piso y la mano mirando desde la puerta
      endHand(240, 400, 80, false, Math.sin(t*5)*.1);
      endH('prof-dizzy', 240, 805, 330, Math.sin(t*3)*.04);
      // la cara aplastada contra el vidrio se resbala hacia abajo
      if(e < 6.4){
        const k = ease(phase(e, 5.5, 6.4));
        g.globalAlpha = 1 - k; endW('face-glass', 240, 420 + k*260, 560); g.globalAlpha = 1;
      }
      g.globalAlpha = .75; endW('glass-crack', 240, 400, 620, 0); g.globalAlpha = 1;
    }
    endFlash(e, 3.0);
    endFlash(e, 4.85, .35, '255,255,255');
  },
  sfx(cross, before, now){
    if(cross(3.0)){ professorScream(); noise(.3,.1,700) }
    stepsSfx(before, now, 3.7, 4.85, .13, .06);
    if(cross(4.85)){ noise(.5,.2,2500,0,null,.4); noise(.4,.15,300); for(let i=0;i<7;i++) tone(1800+Math.random()*2400,.12,'triangle',.03,.05+i*.06,.7); shake = Math.max(shake, 16) }
    if(cross(5.6)){ for(let i=0;i<3;i++) tone(1400+i*300,.12,'sine',.03,i*.15,1.2) }
  }
}
};
