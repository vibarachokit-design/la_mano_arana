'use strict';
const MUTANT_HAZARDS={
  2:[['Garrapata Desatascadora','pull'],['Rata Cepillo','chase'],['Cucaracha Llave Inglesa','dash'],['Tubería Reventona','jet'],['Rejilla Mordedora','snap'],['Burbuja Cloacal','burst']],
  3:[['Mosquito Regadera','jet'],['Oruga Tijera','dash'],['Babosa Cactus','pulse'],['Maceta Escupidora','jet'],['Liana Látigo','sweep'],['Hongo Estornudo','burst']],
  4:[['Polilla Momia','sine'],['Escarabajo Fósil','dash'],['Araña Pincel','sweep'],['Mandíbula Dinosaurio','snap'],['Marco Embrujado','spin'],['Columna Quebradiza','stomp']],
  5:[['Avispa Taladro','dash'],['Cucaracha Tuerca','spin'],['Mosca Soldadora','jet'],['Pistón Aplastador','stomp'],['Válvula Vaporosa','jet'],['Bidón Derramador','burst']],
  6:[['Garrapata Imán','pull'],['Polilla Satélite','sine'],['Escarabajo Meteorito','spin'],['Telescopio Estornudón','jet'],['Anillo Gravitatorio','pull'],['Engranaje Orbital','sweep']]
};
function spawnMutantHazard(px,asWave=false){
  // Los primeros dos pisos presentan enemigos; desde el tercero aparecen obstáculos.
  const index=asWave?Math.floor(Math.random()*3):Math.floor(Math.random()*(floor<3?3:6));
  const [label,kind]=MUTANT_HAZARDS[building][index];
  const side=px??(kind==='jet'?(Math.random()<.5?80:400):75+Math.random()*330);
  objects.push({mutant:true,type:'mutant',building,index,label,kind,x:side,origin:side,y:asWave?-100:-80,pick:false,phase:Math.random()*6,vy:baseSpeed()*(1+(building-2)*.04),armed:false,active:false,warning:.95,age:0,wave:asWave});
}
function updateMutantHazard(o,dt){
  if(!o.armed){o.y+=o.vy*dt;if(o.y>=370){o.armed=true;o.y=370; if(!o.wave)sfx.warn();}return;}
  if(o.warning>0){o.warning=Math.max(0,o.warning-dt);if(o.warning===0){o.active=true; o.age=0;}return;}
  o.age+=dt;
  const speed=o.vy*(o.kind==='dash'?2.1:o.kind==='stomp'?2.8:1);
  o.y+=speed*dt;
  if(o.kind==='chase'&&o.y<HAND_Y-95)o.x+=Math.sign(x-o.x)*Math.min(Math.abs(x-o.x),85*dt);
  if(o.kind==='sine'||o.kind==='spin')o.x=clamp(o.origin+Math.sin(o.age*3+o.phase)*55,65,415);
  if(o.kind==='sweep')o.x=clamp(o.origin+Math.sin(o.age*4)*100,65,415);
  if(o.kind==='pull'&&Math.abs(o.y-HAND_Y)<160&&Math.abs(o.x-x)<135&&shield<=0&&mutation<=0){target=clamp(target+Math.sign(o.x-x)*50*dt,65,415);}
  o.active=!(o.kind==='pulse'||o.kind==='snap')||Math.sin(o.age*6)>.0;
}
function mutantDimensions(o){return o.wave?[76,92]:o.kind==='jet'?[155,135]:o.kind==='stomp'?[100,180]:o.kind==='burst'?[135,135]:[115,135];}
function drawMutantHazard(o){
  const [w,h]=mutantDimensions(o), pose=o.active?1:0;
  const angle=o.kind==='spin'&&o.active?o.age*3:Math.sin(t*5+o.phase)*.045;
  image('hazard-'+o.building+'-'+o.index+'-'+pose,o.x,o.y,w,h,angle);
  if(o.armed&&o.warning>0){
    g.save();g.strokeStyle='#ffcc65';g.fillStyle='#ffcc65';g.lineWidth=2;g.setLineDash([5,5]);
    g.beginPath();g.ellipse(o.x,HAND_Y+45,o.wave?35:60,15,0,0,Math.PI*2);g.stroke();g.setLineDash([]);
    g.font='900 25px system-ui';g.textAlign='center';g.fillText('!',o.x,o.y-80);
    if(!o.wave){g.font='bold 12px system-ui';g.fillText(o.label,clamp(o.x,95,385),o.y-60);}g.restore();
  }
  if(o.active&&o.kind==='jet'){
    const dir=o.x<W/2?1:-1;g.save();g.fillStyle=o.building===5?'#dbedff66':'#a6ef5866';g.beginPath();g.ellipse(o.x+dir*75,o.y+5,65,18,0,0,Math.PI*2);g.fill();g.restore();
  }
  if(o.active&&o.kind==='pull'){g.save();g.strokeStyle='#c68aff99';g.lineWidth=2;for(let i=0;i<3;i++){g.beginPath();g.arc(o.x,o.y,60+(o.age*40+i*22)%70,0,Math.PI*2);g.stroke();}g.restore();}
}
function hitsMutant(o){
  if(!o.active)return false;
  const hw=o.wave?25:34,hh=o.wave?32:o.kind==='stomp'?65:43;
  if(Math.abs(o.x-x)<hw&&Math.abs(o.y-HAND_Y)<hh)return true;
  if(o.kind==='burst'&&Math.abs(o.x-x)<55&&Math.abs(o.y-HAND_Y)<48)return true;
  if(o.kind==='jet'){const dir=o.x<W/2?1:-1;return Math.abs(o.x+dir*75-x)<60&&Math.abs(o.y+5-HAND_Y)<23;}
  return false;
}
