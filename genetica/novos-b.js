// Genética, parte B: seções Biotecnologia e Genética de populações.
// Arquivo autônomo: o script principal de index.html fica dentro de uma função, então aqui
// ficam os próprios auxiliares de desenho e de controles (mesmas classes de estilo da página).
(()=>{
'use strict';
const TAU=Math.PI*2,PI=Math.PI;
const TXT='#E8EDF7',DIM='#9DA9C4',PAN='#1B2440',LIN='#5B6C99',AMB='#FFB347',BLU='#4B7BFF',GRN='#3FBF6A',RED='#D7303B',PNK='#F06AAE',VIO='#9A6BFF',TEA='#2FCFBF',YEL='#F7C13B';
const FT="'Atkinson Hyperlegible Next',system-ui,sans-serif",FD="'JetBrains Mono',ui-monospace,monospace";
const DNA=['O gene no DNA','../dna/index.html'],MOL=['Replicação e síntese de proteínas','../biologia-molecular/index.html'],
  EMB=['Embriologia: blastocisto e gêmeos','../embriologia/index.html'],BAC=['A célula bacteriana','../celula/index.html#celula_bacteria'],
  DIV=['Meiose e segregação','../divisao-celular/index.html'];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const cl=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,ss=t=>{t=cl(t,0,1);return t*t*(3-2*t)},seg=(p,a,b)=>cl((p-a)/(b-a),0,1);
function rng(s){s=s>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
function hx(c){const n=parseInt(c.slice(1),16);return[n>>16&255,n>>8&255,n&255]}
const rgba=(c,a)=>{const[r,g,b]=hx(c);return`rgba(${r},${g},${b},${a})`};
const nf=(v,d)=>v.toFixed(d).replace('.',',');
const nfs=(v,d)=>String(+v.toFixed(d)).replace('.',',');

// ---------- ambiente de desenho ----------
let X,W=600,H=340,T=0,last=0,ACT=null;
function env(inst){
  const cv=document.getElementById('cv');X=cv.getContext('2d');const r=cv.getBoundingClientRect();W=Math.max(200,r.width);H=Math.max(200,r.height);
  const n=performance.now(),dt=last?Math.min(.05,(n-last)/1000):0;last=n;
  const pb=document.getElementById('pause');if(!(pb&&pb.getAttribute('aria-pressed')==='true'))T+=dt;
  inst._seen=n;ACT=inst;if(inst._rf&&n-(inst._chk||0)>250){inst._chk=n;inst._rf()}}
const pr=(t0,d)=>RM?1:cl((T-t0)/d,0,1);
function circ(x,y,r,f,s,lw){X.beginPath();X.arc(x,y,Math.max(.1,r),0,TAU);if(f){X.fillStyle=f;X.fill()}if(s){X.strokeStyle=s;X.lineWidth=lw||1;X.stroke()}}
function line(x1,y1,x2,y2,s,lw){X.beginPath();X.moveTo(x1,y1);X.lineTo(x2,y2);X.strokeStyle=s;X.lineWidth=lw||1;X.stroke()}
function box(x,y,w,h,r,f,s,lw){X.beginPath();X.roundRect(x,y,Math.max(.1,w),Math.max(.1,h),r);if(f){X.fillStyle=f;X.fill()}if(s){X.strokeStyle=s;X.lineWidth=lw||1;X.stroke()}}
function ell(x,y,rx,ry,f,s,lw,rot){X.beginPath();X.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),rot||0,0,TAU);if(f){X.fillStyle=f;X.fill()}if(s){X.strokeStyle=s;X.lineWidth=lw||1;X.stroke()}}
function tx(s,x,y,o={}){X.font=`${o.w||400} ${Math.max(12,o.s||13)}px ${o.f||FT}`;X.textAlign=o.a||'center';X.textBaseline='middle';X.fillStyle=o.c||TXT;X.fillText(s,x,y)}
function para(s,x,y,mw,o={}){X.font=`${o.w||400} ${Math.max(12,o.s||13)}px ${o.f||FT}`;const ws=s.split(' ');let ln='',ls=[];for(const w of ws){const t=ln?ln+' '+w:w;if(X.measureText(t).width>mw&&ln){ls.push(ln);ln=w}else ln=t}ls.push(ln);const lh=Math.max(12,o.s||13)*1.35;ls.forEach((l,i)=>tx(l,x,y+i*lh,o));return ls.length*lh}
function rbc(x,y,r,sick){if(sick){X.beginPath();X.moveTo(x-r*1.6,y);X.quadraticCurveTo(x,y-r*1.1,x+r*1.6,y);X.quadraticCurveTo(x,y+r*.2,x-r*1.6,y);X.fillStyle='#C93A45';X.fill()}else{circ(x,y,r,'#C93A45','rgba(255,255,255,.3)',1);circ(x,y,r*.38,'rgba(70,8,18,.55)')}}

// ---------- painel de controles (mesma aparência dos controles da página) ----------
function panel(res){
  const ui=document.getElementById('ui'),out=document.getElementById('out'),cv=document.getElementById('cv'),syncs=[];
  const el=(t,c)=>{const e=document.createElement(t);if(c)e.className=c;return e};
  const refresh=()=>{syncs.forEach(f=>f());const h=res();if(out.innerHTML!==h)out.innerHTML=h;cv.setAttribute('aria-label','Ilustração: '+h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim())};
  const wrap=(label,tag,vis)=>{const w=el(tag,'pick'),l=el('span','pl');l.textContent=label;w.appendChild(l);ui.appendChild(w);if(vis)syncs.push(()=>{w.style.display=vis()?'':'none'});return w};
  function pick(label,opts,isOn,set,vis){const w=wrap(label,'div',vis),g=el('div','pg');g.setAttribute('role','group');g.setAttribute('aria-label',label);
    opts.forEach(([v,h])=>{const b=el('button','ob');b.type='button';b.innerHTML=h;b.onclick=()=>{set(v);refresh()};g.appendChild(b);syncs.push(()=>{const on=!!isOn(v);b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)})});w.appendChild(g)}
  function acts(label,list,vis){const w=wrap(label,'div',vis),g=el('div','pg');
    list.forEach(([t,fn,go,dis])=>{const b=el('button','ob'+(go?' go':''));b.type='button';b.textContent=t;b.onclick=()=>{fn();refresh()};g.appendChild(b);if(dis)syncs.push(()=>{b.disabled=!!dis();b.style.opacity=b.disabled?.45:1;b.style.cursor=b.disabled?'default':'pointer'})});w.appendChild(g)}
  function range(label,min,max,step,get,set,fmt,vis){const w=wrap(label,'label',vis),r=el('div','rg'),i=el('input'),b=el('b');i.type='range';i.min=min;i.max=max;i.step=step;i.value=get();b.textContent=fmt(get());
    i.oninput=()=>{set(+i.value);refresh()};syncs.push(()=>{if(document.activeElement!==i)i.value=get();b.textContent=fmt(get())});r.appendChild(i);r.appendChild(b);w.appendChild(r)}
  return{pick,acts,range,refresh}}

// toque no canvas (só vale para o tópico que está desenhando agora)
try{const cv0=document.getElementById('cv');if(cv0)cv0.addEventListener('click',e=>{if(!ACT||!ACT.tap||performance.now()-ACT._seen>250)return;const r=cv0.getBoundingClientRect();ACT.tap(e.clientX-r.left,e.clientY-r.top)})}catch(e){}

const FOOT='Conteúdo educativo, não substitui orientação médica.';
const foot=()=>tx(FOOT,W/2,H-12,{s:12,c:DIM});

// ================= B1. DNA recombinante =================
function mkRecomb(){
  const st={step:0,enz:'same',t0:-99};let P;
  const same=()=>st.enz==='same';
  const go=n=>{st.step=n;st.t0=T};
  const blocked=()=>st.step>=3||(st.step===2&&!same());
  const inst={
    st,
    ui(){P=panel(()=>inst.res());
      P.pick('Enzima de restrição',[['same','Mesma enzima nos dois'],['diff','Enzimas diferentes']],v=>st.enz===v,v=>{st.enz=v;go(0)});
      P.acts('Montagem',[['Próximo passo',()=>{if(!blocked())go(st.step+1)},true,blocked],['Recomeçar',()=>go(0)]]);
      P.refresh();inst._rf=P.refresh},
    draw(){env(inst);
      const e=st.step,cx=W/2,R=Math.min(W*.19,(H-176)/2),cy=130+R,sy=80,gw=Math.min(W*.3,R*1.3,150),a=gw/2/R,ty=cy-R,x1=cx-gw/2,x2=cx+gw/2;
      const p=pr(st.t0,e===3?3.4:1.6),c=e===0?0:e===1?ss(seg(p,.3,.8)):1;
      const cap=[same()?'O DNA humano e o plasmídeo têm o mesmo ponto de corte (GAATTC).':'Aqui cada DNA tem um ponto de corte diferente: GAATTC no humano e GGATCC no plasmídeo.',
        same()?'A enzima de restrição corta nas marcas e deixa pontas em degrau.':'Duas enzimas cortam em marcas diferentes, e as pontas ficam diferentes.',
        same()?'O gene entra na abertura e a DNA ligase cola as junções.':'As pontas não combinam: é preciso cortar os dois DNAs com a mesma enzima.',
        'Cada bactéria vira uma pequena fábrica de insulina humana.'][e];
      if(e===3){bact(p,cx,cy,R,gw);para(cap,cx,H-30,W-28,{s:13,c:DIM});return}
      // DNA humano
      tx('DNA humano',20,sy-24,{a:'left',s:12,c:DIM});
      const gy=e<2?sy:same()?lerp(sy,ty,ss(p)):lerp(sy,ty-34,ss(seg(p,0,.7)));
      box(20,sy-7,x1-20-c*7,14,4,rgba(BLU,.85));box(x2+c*7,sy-7,W-20-x2-c*7,14,4,rgba(BLU,.85));
      if(c>.5){box(x1-c*7,sy+1,c*7,6,0,TEA);box(x2,sy-7,c*7,6,0,TEA)}
      const joined=same()&&e===2&&p>=1;
      if(!joined){box(x1,gy-7,gw,14,4,AMB);if(c>.5){box(x1-6,gy-7,6,6,0,TEA);box(x2,gy+1,6,6,0,TEA)}
        if(e<2)tx('gene da insulina',cx,gy-24,{s:12,c:AMB,w:600})}
      if(e===0){[x1,x2].forEach(x=>{line(x,sy-9,x,sy+9,TEA,2);tx('GAATTC',x,sy+22,{s:12,f:FD})})}
      else if(e===1||c>0){const fo=c;X.globalAlpha=fo;tx('G',x1-c*7-3,sy+22,{a:'right',s:12,f:FD});tx('AATTC',x2+c*7+3,sy+22,{a:'left',s:12,f:FD});
        if(e===1){tx('AATTC',x1+3,sy+22,{a:'left',s:12,f:FD});tx('G',x2-3,sy+22,{a:'right',s:12,f:FD})}X.globalAlpha=1}
      // plasmídeo
      const g=a*c;X.lineCap='butt';
      X.beginPath();if(e>=1&&!joined)X.arc(cx,cy,R,-PI/2+g,-PI/2-g+TAU);else X.arc(cx,cy,R,0,TAU);X.strokeStyle=rgba(BLU,.9);X.lineWidth=9;X.stroke();
      if(joined){X.beginPath();X.arc(cx,cy,R,-PI/2-a,-PI/2+a);X.strokeStyle=AMB;X.lineWidth=9;X.stroke();
        const ps=RM?1:cl((T-st.t0-1.6)/.6,0,1);if(ps<1)[-1,1].forEach(s=>circ(cx+R*Math.cos(-PI/2+s*a),cy+R*Math.sin(-PI/2+s*a),10+16*ps,null,rgba('#FFE7BD',1-ps),3))}
      tx('plasmídeo',cx,cy,{s:13,c:DIM});
      if(e===0){line(cx,ty-9,cx,ty+9,TEA,2);tx(same()?'GAATTC':'GGATCC',cx,ty+24,{s:12,f:FD})}
      if(e>=1&&!joined)[-1,1].forEach(s=>circ(cx+R*Math.cos(-PI/2+s*g),cy+R*Math.sin(-PI/2+s*g),5.5,same()?TEA:VIO));
      if(e===2&&!same()){const mx=(gy+ty)/2+3;line(cx-8,mx-8,cx+8,mx+8,RED,3);line(cx+8,mx-8,cx-8,mx+8,RED,3)}
      if(e===2&&same()&&p<1&&p>.2){}
      // enzimas
      if(e===1){const al=ss(seg(p,0,.25))*(1-ss(seg(p,.85,1)));if(al>.01){X.globalAlpha=al;const m=RM?.3:.15+.35*Math.abs(Math.sin(T*9));
        [[x1-c*3.5,sy-22],[x2+c*3.5,sy-22],[cx,ty-24]].forEach(([x,y],i)=>{X.beginPath();X.moveTo(x,y);X.arc(x,y,11,PI/2+m,PI/2-m+TAU);X.closePath();X.fillStyle=rgba(VIO,.95);X.fill();circ(x+3,y-4,1.8,'#0B0F1C')});
        tx('enzima de restrição',cx+18,ty-24,{a:'left',s:12,c:'#C8B6FF'});X.globalAlpha=1}}
      para(cap,cx,H-30,W-28,{s:13,c:DIM})},
    res(){const e=st.step,s=same();
      const ln=['<p>Passo 1 de 4. O gene da insulina humana (em âmbar) está no DNA humano (em azul). O plasmídeo é um pequeno DNA circular de bactéria. '+(s?'As duas moléculas têm a mesma sequência de corte, <b>GAATTC</b>.':'Nesta montagem, o DNA humano será cortado por uma enzima e o plasmídeo por outra, e as sequências de corte são diferentes.')+'</p>',
        '<p>Passo 2 de 4: <b>cortar</b>. '+(s?'A <b>enzima de restrição</b> corta o DNA humano e o plasmídeo exatamente no mesmo ponto e deixa <b>pontas em degrau</b>, com bases expostas que se encaixam.':'Cada enzima corta no seu ponto e deixa pontas em degrau, mas as pontas de um DNA não combinam com as do outro.')+'</p>',
        s?'<p>Passo 3 de 4: <b>colar</b>. As pontas iguais se encaixam e a <b>DNA ligase</b> fecha as junções. O plasmídeo agora é um <b>DNA recombinante</b>.</p>':'<p>Passo 3 de 4: <b>colar</b>. As pontas não combinam: é preciso cortar os dois DNAs com a mesma enzima. Escolha “Mesma enzima nos dois” para continuar.</p>',
        '<p>Passo 4 de 4: <b>inserir</b>. O plasmídeo entra numa bactéria, que se divide e passa o plasmídeo adiante. Em 3 divisões, 1 bactéria vira <b>8</b>.</p><p><b>bactérias com o gene: '+(inst._n||8)+'</b>. Cada bactéria vira uma pequena fábrica de insulina humana.</p>'];
      return ln[e]}};
  function bact(p,cx,cy,R,gw){
    const k=Math.min(3,Math.floor(p*4)),n=2**k,fr=p>=1?1:p*4-k,t=k===0?1:ss(seg(fr,0,.6));inst._n=p>=1?8:n;
    const cw=Math.min(86,(W-40)/4-8),ch=cw*.42,gx=cw+14,gyy=ch+26;
    const pos=(i,m)=>{const cols=Math.min(m,4),rows=Math.ceil(m/4),c=i%4,r=Math.floor(i/4);return[cx+(c-(cols-1)/2)*gx,cy+(r-(rows-1)/2)*gyy+10]};
    tx('bactérias com o gene: '+(p>=1?8:n),cx,76,{s:17,w:700,c:AMB});
    const cap=(x,y,al,i)=>{X.globalAlpha=al;box(x-cw/2,y-ch/2,cw,ch,ch/2,rgba(BLU,.16),BLU,1.5);
      circ(x-cw*.16,y,7,null,BLU,2);X.beginPath();X.arc(x-cw*.16,y,7,-PI/2-.8,-PI/2+.8);X.strokeStyle=AMB;X.lineWidth=2.5;X.stroke();
      if(p>.3)for(let j=0;j<3;j++){const ph=RM?.3+j*.2:((T*.45+j*.33+i*.17)%1);circ(x+cw*.08+j*cw*.15,y-ch/2-3-ph*16,2.6,AMB);}
      X.globalAlpha=1};
    for(let i=0;i<n;i++){const[tx2,ty2]=pos(i,n);let x=tx2,y=ty2,al=1;
      if(k>0){const src=i<n/2?pos(i,n/2):pos(i-n/2,n/2);x=lerp(src[0],tx2,t);y=lerp(src[1],ty2,t);if(i>=n/2)al=t}
      cap(x,y,al,i)}
    if(k===0){const t0=ss(seg(p/.25,0,.9)),rr=lerp(R,7,t0),px=cx-cw*.16;X.globalAlpha=1-t0*.0;
      if(t0<1){const xx=lerp(cx,px,t0);circ(xx,cy,rr,null,BLU,lerp(9,2,t0));X.beginPath();X.arc(xx,cy,rr,-PI/2-gw/2/R*(1-t0*.4),-PI/2+gw/2/R*(1-t0*.4));X.strokeStyle=AMB;X.lineWidth=lerp(9,2.5,t0);X.stroke()}}
  }
  return inst}

// ================= B2. PCR e teste de DNA =================
function mkCase(k,seed){
  const R=rng(seed),truth=[1,2,0][k%3],pool=[0,1,2,3,4,5,6,7,8,9];
  for(let i=9;i>0;i--){const j=Math.floor(R()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  const M=pool.slice(0,4),Pp=pool.slice(4,6),O=[...pool.slice(0,4),...pool.slice(6,10)];
  const pickN=(arr,n)=>{const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,n)};
  const s=a=>a.slice().sort((x,y)=>x-y),C=[...pickN(M,2),...Pp],tru=[...Pp,...pickN(O,2)],non=pickN(O,4),non1=[Pp[0],...pickN(O,3)];
  let F1,F2;if(truth===1){F1=tru;F2=non}else if(truth===2){F1=non;F2=tru}else{F1=non1;F2=pickN(O,4)}
  return{truth,M:s(M),C:s(C),F:[s(F1),s(F2)],P:s(Pp)}}
function mkPcr(){
  const st={tab:'pcr',n:0,anim:false,t0:-99,k:0,data:null,on:false,gt:-99,guess:null,rev:new Set()};let P;
  const newCase=()=>{st.data=mkCase(st.k,st.k*977+13+(Math.random()*1e4|0));st.on=false;st.guess=null;st.rev=new Set();st.k++};
  newCase();
  const big=n=>(2**n).toLocaleString('pt-BR');
  const gelDone=()=>st.on&&pr(st.gt,3)>=1;
  const inst={
    ui(){P=panel(()=>inst.res());
      P.pick('Parte',[['pcr','1. PCR'],['gel','2. Gel de paternidade']],v=>st.tab===v,v=>{st.tab=v});
      P.range('Ciclos',0,30,1,()=>st.n,v=>{st.n=v;st.anim=false},v=>String(v),()=>st.tab==='pcr');
      P.acts('Termociclador',[['Rodar 1 ciclo',()=>{st.n=Math.min(30,st.n+1);st.anim=true;st.t0=T},true,()=>st.n>=30],['Zerar',()=>{st.n=0;st.anim=false}]],()=>st.tab==='pcr');
      P.acts('Eletroforese',[['Ligar a corrente',()=>{st.on=true;st.gt=T},true,()=>st.on],['Mostrar a origem das bandas',()=>{if(gelDone())st.data.C.forEach((_,i)=>st.rev.add(i))},false,()=>!gelDone()],['Novo caso',newCase]],()=>st.tab==='gel');
      P.pick('Seu palpite',[[1,'É o pai 1'],[2,'É o pai 2'],[0,'Nenhum dos dois']],v=>st.guess===v,v=>{st.guess=v},()=>st.tab==='gel');
      P.refresh();inst._rf=P.refresh},
    tap(x,y){if(st.tab!=='gel'||!gelDone())return;const g=gelGeom(),d=st.data;
      if(Math.abs(x-g.lx(1))>g.laneW/2+4)return;let best=-1,bd=18;d.C.forEach((idx,i)=>{const dd=Math.abs(g.by(idx,1)-y);if(dd<bd){bd=dd;best=i}});
      if(best>=0){if(st.rev.has(best))st.rev.delete(best);else st.rev.add(best);P.refresh()}},
    draw(){env(inst);if(st.tab==='pcr')drawPcr();else drawGel()},
    res(){
      if(st.tab==='pcr'){const n=st.n;return`<p>Ciclo <b>${n}</b> de 30. Cada ciclo tem 3 etapas: separar as fitas (cerca de 95 °C), ligar os <b>primers</b> (cerca de 55 °C) e completar as fitas com a <b>DNA polimerase</b> (cerca de 72 °C). O número de cópias dobra a cada ciclo.</p><p>Cópias do trecho: <b>${big(n)}</b>${n>=30?' (cerca de 1 bilhão)':''}.</p>`}
      const d=st.data,g=st.guess;let m='<p>Compare as bandas do filho com as da mãe. Toda banda do filho que a mãe não tem veio do pai.</p>';
      if(!gelDone())return m+'<p>Ligue a corrente para os fragmentos andarem pelo gel. Depois, toque nas bandas do filho para ver de onde vieram.</p>';
      if(g===null)return m+'<p>Escolha o seu palpite.</p>';
      const patB=d.C.map((x,i)=>[x,i]).filter(([x])=>!d.M.includes(x)),ok=g===d.truth;
      if(ok)return m+`<p class="good"><b>Correto:</b> ${d.truth?`todas as bandas do filho que não vieram da mãe estão no suposto pai ${d.truth}.`:'nenhum dos dois tem todas as bandas do filho que não vieram da mãe.'}</p>`;
      if(g>0){const f=d.F[g-1],miss=patB.find(([x])=>!f.includes(x));return m+`<p class="bad"><b>Não:</b> a banda ${miss[1]+1} do filho (contando de cima) não veio da mãe e não está no suposto pai ${g}.</p>`}
      return m+`<p class="bad"><b>Não:</b> o suposto pai ${d.truth} tem todas as bandas do filho que não vieram da mãe.</p>`}};
  function gelGeom(){const gw=Math.min(W-32,420),gx0=(W-gw)/2,M=40,laneW=(gw-M-8)/4,gy0=92,gy1=H-50;
    return{gw,gx0,M,laneW,gy0,gy1,lx:i=>gx0+M+laneW*(i+.5),by:(idx,pg)=>gy0+16+(gy1-gy0-40)*((idx+.4)/10)*pg}}
  function drawPcr(){
    const wide=W>=620,bx=wide?W*.1:30,tX=bx+40,tY=72,tW=100,tH=150,cyT=tY+tH*.45,u=st.anim?(RM?1:(T-st.t0)/2.7):-1,run=u>=0&&u<1;
    if(u>=1)st.anim=false;
    const ph=run?Math.floor(u*3):-1,sub=run?u*3-ph:0,temp=[95,55,72][ph];
    // termômetro
    box(bx+10,tY,12,tH,6,'rgba(255,255,255,.06)',LIN,1);
    const lv=run?[1,.45,.7][ph]:.12;box(bx+11.5,tY+tH-4-(tH-8)*lv,9,(tH-8)*lv,4,run?[RED,BLU,AMB][ph]:LIN);
    tx(run?temp+' °C':'parado',bx+16,tY+tH+16,{s:12,f:FD,c:run?TXT:DIM});
    // tubo
    X.beginPath();X.roundRect(tX,tY,tW,tH,[6,6,tW/2,tW/2]);X.fillStyle='rgba(143,216,255,.06)';X.fill();X.strokeStyle=LIN;X.lineWidth=2;X.stroke();
    const xa=tX+12,xb=tX+tW-12;
    if(run){
      const gap=ph===0?lerp(5,22,ss(sub)):ph===1?22:lerp(22,5,ss(seg(sub,.65,1))),ya=cyT-gap/2,yb=cyT+gap/2;
      line(xa,ya,xb,ya,BLU,3);line(xa,yb,xb,yb,BLU,3);
      if(ph===0){line(xa,ya,xb,ya,rgba(RED,ss(sub)*.9),3);line(xa,yb,xb,yb,rgba(RED,ss(sub)*.9),3);for(let i=0;i<6;i++){const rr=(T*3+i*1.7)%6/6;circ(tX+14+i*14,tY+tH*.75-rr*40,2,rgba(RED,.5*(1-rr)))}}
      if(ph>=1){const al=ph===1?ss(sub):1;X.globalAlpha=al;line(xa,yb,xa+20,yb,AMB,4);line(xb-20,ya,xb,ya,AMB,4);X.globalAlpha=1}
      if(ph===2){const e=ss(seg(sub,0,.65));line(xa+20,yb,lerp(xa+20,xb,e),yb,AMB,3);line(xb-20,ya,lerp(xb-20,xa,e),ya,AMB,3)}
      if(ph===1)tx('primer',xa+10,yb+14,{s:12,c:AMB})}
    else{const d=Math.min(8,2**st.n),rh=Math.min(16,(tH-50)/d);for(let i=0;i<d;i++){const y=cyT-(d-1)*rh/2+i*rh;line(xa,y-3,xb,y-3,BLU,2.5);line(xa,y+3,xb,y+3,i===0?BLU:AMB,2.5)}
      if(2**st.n>8)tx('e muitas outras',tX+tW/2,tY+tH+16,{s:12,c:DIM})}
    // textos à direita
    const rx=tX+tW+18,rw=Math.max(120,W-16-rx);
    tx('ciclo '+st.n+' de 30',rx,tY+8,{a:'left',s:13,c:DIM});
    para(run?['Separar as fitas','Ligar os primers','A polimerase completa as fitas'][ph]:(st.n?'Ciclo concluído':'Tubo com 1 molécula'),rx,tY+32,rw,{a:'left',s:14,w:600});
    tx('cópias do trecho',rx,tY+84,{a:'left',s:12,c:DIM});
    tx((2**st.n).toLocaleString('pt-BR'),rx,tY+108,{a:'left',s:Math.min(20,rw/10),f:FD,c:AMB,w:500});
    if(st.n>=30)tx('cerca de 1 bilhão',rx,tY+132,{a:'left',s:13});
    // barra logarítmica
    const bx0=16,bw=W-32,by=H-70;box(bx0,by,bw,14,7,'rgba(255,255,255,.07)');if(st.n>0)box(bx0,by,Math.max(14,bw*st.n/30),14,7,AMB);
    [[10,'mil'],[20,'1 milhão'],[30,'1 bilhão']].forEach(([n,l])=>{const x=bx0+bw*n/30;line(x,by-3,x,by+17,'rgba(255,255,255,.4)',1);tx(l,n===30?x:x,by+30,{a:n===30?'right':'center',s:12,c:DIM})});
    tx('escala logarítmica: cada ciclo dobra o número de cópias',W/2,H-16,{s:12,c:DIM})}
  function drawGel(){
    const g=gelGeom(),d=st.data,pg=st.on?pr(st.gt,3):0,{gx0,gw,gy0,gy1,laneW}=g,bw=laneW*.62,names=['Mãe','Filho','Pai 1','Pai 2'];
    const sets=[d.M,d.C,d.F[0],d.F[1]];
    box(gx0,gy0,gw,gy1-gy0,8,'#0A0F1E',LIN,1.5);
    tx('−',gx0+20,gy0+16,{s:22,w:600});tx('+',gx0+20,gy1-14,{s:22,w:600});
    sets.forEach((set,i)=>{const x=g.lx(i);tx(names[i],x,gy0-12,{s:13,w:600});box(x-bw/2,gy0+6,bw,8,2,'rgba(75,123,255,.35)');
      if(pg>.01)set.forEach((idx,j)=>{const y=g.by(idx,ease(pg)),cm=i===1&&st.rev.has(j),mat=i===1&&d.M.includes(idx);
        box(x-bw/2,y-3,bw,6,2,i===1&&cm?(mat?PNK:AMB):'rgba(255,255,255,.92)');
        if(i===0&&st.rev.size&&d.C.some((c,k)=>st.rev.has(k)&&c===idx&&d.M.includes(c)))box(x-bw/2-2,y-5,bw+4,10,3,null,PNK,1.5);
        if(i>=2&&st.rev.size&&d.C.some((c,k)=>st.rev.has(k)&&c===idx&&!d.M.includes(c)))box(x-bw/2-2,y-5,bw+4,10,3,null,AMB,1.5)})});
    para('O DNA tem carga negativa e anda para o polo positivo (+), embaixo. Os fragmentos menores andam mais.',W/2,H-26,W-28,{s:13,c:DIM})}
  const ease=t=>1-(1-t)*(1-t);
  return inst}

// ================= B3. Clonagem e células-tronco =================
function sheep(x,y,s,wool,face,al){
  X.save();X.globalAlpha=al==null?1:al;
  [-14,-5,7,16].forEach(dx=>line(x+dx*s,y+10*s,x+dx*s,y+25*s,face,3*s));
  [[-16,-4],[-6,-9],[6,-9],[16,-4],[-12,6],[0,8],[12,6],[0,-1]].forEach(([a,b])=>circ(x+a*s,y+b*s,10*s,wool,'rgba(0,0,0,.28)',1));
  ell(x-25*s,y-1*s,8*s,10.5*s,face,'rgba(0,0,0,.3)',1);circ(x-27*s,y-4*s,1.6*s,'#0B0F1C');ell(x-18*s,y-9*s,3*s,6*s,face,null,0,.5);
  X.restore()}
function cellOoc(x,y,r,o){circ(x,y,r,'rgba(244,231,200,.92)','rgba(255,255,255,.5)',2);
  for(let i=0;i<6;i++){const a=i/6*TAU+.4;circ(x+Math.cos(a)*r*.62,y+Math.sin(a)*r*.62,2.2,VIO)}
  if(o.nuc)circ(x+(o.nx||0),y+(o.ny||0),r*.3,PNK,null,0,0);
  if(o.don)circ(x,y,r*.3,BLU)}
function mkClone(){
  const st={tab:'clone',step:0,t0:-99,ans:null,org:null,t1:-99};let P;
  const go=n=>{st.step=n;st.t0=T;if(n<5)st.ans=null};
  const TIPOS=[['neu','Neurônio'],['mus','Músculo cardíaco'],['hem','Hemácia'],['fig','Célula do fígado'],['pel','Pele']];
  const reach=k=>st.org==='adu'?k==='hem':!!st.org;
  const icon=(k,x,y,r,al)=>{X.save();X.globalAlpha=al;
    if(k==='neu'){circ(x,y,r*.45,'#C9B8FF');[[-1,-1],[1,-1],[0,1.2],[-1.2,.4]].forEach(([a,b])=>line(x,y,x+a*r,y+b*r,'#C9B8FF',2))}
    else if(k==='mus'){box(x-r,y-r*.6,r*2,r*1.2,r*.4,'#B5483F');for(let i=-1;i<=1;i++)line(x+i*r*.5,y-r*.6,x+i*r*.5,y+r*.6,'rgba(255,220,210,.5)',1.5)}
    else if(k==='hem')rbc(x,y,r*.85,false);
    else if(k==='fig'){X.beginPath();for(let i=0;i<6;i++){const a=i/6*TAU+.5;i?X.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r):X.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r)}X.closePath();X.fillStyle='#8C5A3A';X.fill();circ(x,y,r*.3,'#4A2C1A')}
    else{box(x-r,y-r*.8,r*2,r*1.6,4,'#E3B99B');line(x-r,y-r*.2,x+r,y-r*.2,'rgba(120,70,40,.5)',1.5);line(x-r,y+r*.3,x+r,y+r*.3,'rgba(120,70,40,.5)',1.5)}
    X.restore()};
  const inst={
    ui(){P=panel(()=>inst.res());
      P.pick('Assunto',[['clone','Clonagem'],['stem','Células-tronco']],v=>st.tab===v,v=>{st.tab=v});
      P.acts('Passo',[['Próximo passo',()=>go(st.step+1),true,()=>st.step>=5],['Recomeçar',()=>go(0)]],()=>st.tab==='clone');
      P.pick('Com quem o filhote se parece?',[['nuc','Doadora do núcleo (branca)'],['ooc','Doadora do ovócito (cara preta)'],['sur','Mãe de aluguel (cinza)']],v=>st.ans===v,v=>{if(st.step>=5)st.ans=v},()=>st.tab==='clone'&&st.step>=5);
      P.pick('Origem da célula-tronco',[['emb','Embrionária'],['adu','Adulta da medula'],['ips','iPS']],v=>st.org===v,v=>{st.org=v;st.t1=T},()=>st.tab==='stem');
      P.refresh();inst._rf=P.refresh},
    draw(){env(inst);if(st.tab==='clone')drawClone();else drawStem();foot()},
    res(){
      if(st.tab==='clone'){const s=st.step,tx2=['Três ovelhas participam: a <b>doadora do núcleo</b> (branca), a <b>doadora do ovócito</b> (cara preta) e a <b>mãe de aluguel</b> (em cinza no desenho).',
        'Passo 1 de 5. Colhe-se uma célula do corpo da ovelha branca e um ovócito da ovelha de cara preta.',
        'Passo 2 de 5. O núcleo do ovócito é retirado, e o ovócito fica sem o seu DNA nuclear.',
        'Passo 3 de 5. A célula da ovelha branca é posta ao lado do ovócito e um pequeno choque elétrico faz os dois se fundirem. É a <b>transferência nuclear</b>.',
        'Passo 4 de 5. O embrião se divide e é implantado no útero da ovelha cinza.',
        'Passo 5 de 5. Nasce o filhote.'][s];
        let a='';if(s>=5){a=st.ans===null?'<p>Escolha com quem o filhote se parece.</p>':st.ans==='nuc'?'<p class="good"><b>Correto:</b> o DNA do núcleo veio da ovelha branca, então o filhote é geneticamente igual a ela. O DNA das <b>mitocôndrias</b> vem do ovócito da ovelha de cara preta.</p>':'<p class="bad"><b>Não:</b> quem fornece o núcleo, onde está quase todo o DNA, é a ovelha branca. A de cara preta dá só o ovócito (com as mitocôndrias) e a cinza apenas gesta o filhote.</p>'}
        return'<p>'+tx2+'</p>'+a}
      const o=st.org;return o?`<p>Quantos tipos de célula pode formar: <b>${o==='adu'?'poucos (só células do sangue)':'muitos'}</b>.</p><p>${o==='emb'?'A <b>célula-tronco embrionária</b> vem do blastocisto e forma quase todos os tecidos.':o==='adu'?'A <b>célula-tronco adulta</b> da medula óssea forma os tipos de célula do sangue. O transplante de medula já usa essas células.':'A <b>iPS</b> é uma célula adulta reprogramada em laboratório. Forma muitos tipos de célula, não destrói embrião e é compatível com o próprio paciente.'}</p>`:'<p>Escolha uma origem para ver em quais tipos de célula ela pode se transformar.</p>'}};
  function drawClone(){
    const s=st.step,p=pr(st.t0,s===4?3:1.6),cx=W/2,sc=Math.min(1.15,W/420),sy=104,cs=[W/6,W/2,W*5/6],ly=236;
    const sh=[['#F3EFE6','#D9D4C7'],['#F3EFE6','#2A2A33'],['#9A9FAB','#C7CBD4']];
    sh.forEach(([w,f],i)=>sheep(cs[i],sy,sc,w,f));
    [['Doadora do núcleo',0],['Doadora do ovócito',1],['Mãe de aluguel',2]].forEach(([l,i])=>para(l,cs[i],sy+48*sc,W/3-12,{s:12,c:DIM}));
    const dY=sy+14;
    if(s===1||s===2||s===3){
      const t=s===1?ss(p):1;
      let sx=lerp(cs[0],cx-80,t),syy=lerp(dY,ly,t);
      if(s===3)sx=lerp(cx-80,cx-34,ss(seg(p,0,.4)));
      const ox=lerp(cs[1],cx,t),oy=lerp(dY,ly,t);
      // ovócito
      cellOoc(ox,oy,26,{nuc:s===1,nx:4,ny:-2});
      if(s===2){const t2=ss(p);if(t2<1){X.globalAlpha=1-t2;circ(cx+4+34*t2,ly-2-26*t2,8,PNK);X.globalAlpha=1}else{}}
      // célula do corpo
      const fused=s===3&&p>.65,fa=s===3?1-ss(seg(p,.6,.85)):1;
      X.globalAlpha=fa;circ(sx,syy,15,'rgba(243,239,230,.9)','rgba(255,255,255,.6)',2);circ(sx,syy,6,BLU);X.globalAlpha=1;
      if(s===3&&p>.35&&p<.7){const f=RM||Math.floor(T*14)%2;X.strokeStyle=YEL;X.lineWidth=2.5;[-1,1].forEach(d=>{X.beginPath();X.moveTo(cx+d*52,ly-24);X.lineTo(cx+d*40,ly-8);X.lineTo(cx+d*50,ly-6);X.lineTo(cx+d*36,ly+16);X.stroke()});if(!f){}}
      if(fused){const t3=ss(seg(p,.65,1));circ(lerp(sx,cx,t3),ly,26*.3,BLU)}
      tx(['','células colhidas','núcleo retirado','choque elétrico e fusão'][s],cx,ly+46,{s:13,c:AMB,w:600});
      tx('célula do corpo',cx-80,ly+(s===1?30:200),{s:12,c:DIM});
    }
    if(s===4){
      const n=p<.25?1:p<.5?2:4,t=ss(seg(p,.5,1)),ex=lerp(cx,cs[2],t),ey=lerp(ly,sy+4,t);
      if(t>.6){circ(cs[2]+4,sy+2,17,rgba(PNK,.18),PNK,1.5)}
      const o=[[0,0],[-1,0],[1,0],[0,-1],[0,1]];
      if(n===1)cellOoc(ex,ey,lerp(26,9,t),{don:true});else[[-.5,-.5],[.5,-.5],[-.5,.5],[.5,.5]].slice(0,n===2?2:4).forEach(([a,b],i)=>{const r=lerp(14,6,t);circ(ex+(n===2?(i?1:-1)*r*.55:a*r*1.2),ey+(n===2?0:b*r*1.2),r,'rgba(244,231,200,.92)','rgba(255,255,255,.5)',1.5);circ(ex+(n===2?(i?1:-1)*r*.55:a*r*1.2),ey+(n===2?0:b*r*1.2),r*.35,BLU)});
      tx(t<.1?'o embrião se divide':'embrião no útero da ovelha cinza',cx,ly+46,{s:13,c:AMB,w:600})}
    if(s===5){const t=ss(p);sheep(cs[2],ly-22,sc*.8*t,'#F3EFE6','#D9D4C7',t);tx('filhote',cs[2],ly+16,{s:12,c:TXT,w:600});
      para('Núcleo da doadora branca, mitocôndrias do ovócito da ovelha de cara preta.',cx,ly+10,W-40,{s:13,c:AMB,w:600})}
    if(s===0)para('Clonagem por transferência nuclear: o núcleo de uma célula do corpo vai para um ovócito sem núcleo.',cx,ly+10,W-40,{s:13,c:AMB,w:600});
  }
  function drawStem(){
    const o=st.org,p=pr(st.t1,1.2),cx=W/2,cy=92,n=TIPOS.length,ty=H-92,dx=Math.min(110,(W-30)/n);
    const col=o==='emb'?PNK:o==='adu'?TEA:o==='ips'?VIO:LIN;
    circ(cx,cy,28,rgba(col,.2),col,2.5);circ(cx,cy,10,col);if(!o)tx('?',cx,cy+1,{s:20,w:700,c:'#0B0F1C'});
    tx(o==='emb'?'célula-tronco embrionária':o==='adu'?'célula-tronco adulta (medula óssea)':o==='ips'?'iPS (célula adulta reprogramada)':'escolha uma origem',cx,cy+44,{s:13,w:600,c:o?TXT:DIM});
    TIPOS.forEach(([k,l],i)=>{const x=cx+(i-(n-1)/2)*dx,ok=reach(k),al=o?(ok?1:.3):.45;
      if(o&&ok){const t=ss(seg(p,i*.06,.7+i*.06)),sx=cx,sy2=cy+60,c1x=lerp(sx,x,.2),c1y=(sy2+ty-22)/2;
        X.beginPath();X.moveTo(sx,sy2+10);X.quadraticCurveTo(c1x,c1y+20,lerp(sx,x,1),lerp(sy2+10,ty-26,t));X.strokeStyle=rgba(col,.8);X.lineWidth=2;
        if(t<1){X.setLineDash([4,5])}X.stroke();X.setLineDash([]);
        if(t>.95){X.beginPath();X.moveTo(x,ty-24);X.lineTo(x-5,ty-34);X.lineTo(x+5,ty-34);X.closePath();X.fillStyle=rgba(col,.9);X.fill()}}
      icon(k,x,ty,14,al);para(l,x,ty+30,dx-4,{s:12,c:ok||!o?TXT:DIM})});
  }
  return inst}

// ================= B4. CRISPR e terapia gênica =================
const BASES='ACGT',CMP={A:'T',C:'G',G:'C',T:'A'};
const SEQ=(()=>{const R=rng(7),a=[];for(let i=0;i<74;i++)a.push(BASES[Math.floor(R()*4)]);
  const put=(i,s)=>[...s].forEach((ch,k)=>a[i+k]=ch);put(14,'CCTGTGGA');put(38,'TTGACAGT');put(60,'ACGTTGCA');return a})();
const TGT={hbb:{pos:14,g:'CCTGTGGA',cut:19},bcl:{pos:38,g:'TTGACAGT',cut:43},bad:{pos:60,g:'ACGTTGCT',cut:65}};
function mkCrispr(){
  const st={tgt:null,sent:false,t0:-99,cell:'pac'};let P;
  const CW=17,start=4*CW;
  const done=()=>st.sent&&pr(st.t0,3.6)>=1;
  const inst={
    ui(){P=panel(()=>inst.res());
      P.pick('Alvo do RNA guia',[['hbb','Gene da anemia falciforme'],['bcl','Gene que desliga a hemoglobina fetal'],['bad','Sequência errada (guia mal escolhido)']],v=>st.tgt===v,v=>{st.tgt=v;st.sent=false});
      P.pick('Quem é editado',[['pac','Editar células do paciente'],['emb','Editar um embrião']],v=>st.cell===v,v=>{st.cell=v});
      P.acts('Cas9',[['Enviar Cas9',()=>{if(st.tgt){st.sent=true;st.t0=T}},true,()=>!st.tgt],['Recomeçar',()=>{st.sent=false;st.tgt=null}]]);
      P.refresh();inst._rf=P.refresh},
    draw(){env(inst);
      const tg=st.tgt?TGT[st.tgt]:null,p=st.sent?pr(st.t0,3.6):0,tcx=tg?(tg.pos+4)*CW:start,cas=st.sent?lerp(start,tcx,ss(p/.5)):start,cam=cas-W/2,arrived=st.sent&&p>=.5,cut=st.sent&&p>=.7;
      // fita de DNA
      const yT=140,yB=162,cutX=tg?tg.cut*CW-cam:0;
      line(0,yT+11,W,yT+11,'rgba(255,255,255,.08)',1);
      for(let i=0;i<SEQ.length;i++){const x=i*CW-cam+CW/2;if(x<-20||x>W+20)continue;
        const sep=cut&&tg&&Math.abs(x-cutX)<CW*1.6?ss(seg(p,.7,.85))*4*(x<cutX?-1:1):0;
        tx(SEQ[i],x+sep,yT,{s:13,f:FD,c:TXT});tx(CMP[SEQ[i]],x+sep,yB,{s:13,f:FD,c:DIM});line(x+sep,yT+8,x+sep,yB-8,'rgba(255,255,255,.18)',1)}
      if(cut){const a=ss(seg(p,.7,.8));X.globalAlpha=a;line(cutX,yT-10,cutX,yB+10,RED,2.5);X.globalAlpha=1}
      // Cas9 e RNA guia
      const gx=cas-cam,gg=tg?tg.g:'????????',bw=8*CW;
      box(gx-bw/2-12,58,bw+24,40,20,rgba(VIO,.32),VIO,2);tx('Cas9',gx,70,{s:13,w:700,c:'#D9CCFF'});
      box(gx-bw/2,100,bw,18,5,rgba(AMB,.18),AMB,1.5);
      for(let i=0;i<8;i++){const x=gx-bw/2+CW*(i+.5);tx(tg?gg[i].replace('T','U'):'?',x,109,{s:13,f:FD,c:AMB,w:600});
        if(tg&&arrived){const m=SEQ[tg.pos+i]===gg[i];line(x,121,x,129,m?GRN:RED,2.5)}}
      tx('RNA guia',gx-bw/2-16,109,{a:'right',s:12,c:AMB});
      // árvore
      const ty0=196+(H-340)*.3,tc=W/2;
      const nodes=[[tc,ty0,0],[tc-44,ty0+24,1],[tc+44,ty0+24,1],[tc-66,ty0+48,2],[tc-22,ty0+48,2],[tc+22,ty0+48,2],[tc+66,ty0+48,2]],par=[-1,0,0,1,1,2,2];
      const edBy=n=>st.cell==='emb'?true:n[2]===0;
      nodes.forEach((n,i)=>{if(par[i]>=0)line(nodes[par[i]][0],nodes[par[i]][1],n[0],n[1],'rgba(255,255,255,.25)',1.5)});
      nodes.forEach(n=>{const ed=edBy(n)&&done();circ(n[0],n[1],8,ed?AMB:PAN,ed?'#FFE7BD':LIN,1.5)});
      tx(st.cell==='emb'?'a mudança passa aos descendentes':'só o paciente muda',tc,ty0+68,{s:12,c:st.cell==='emb'?AMB:DIM,w:600});
      tx('3 gerações',tc-80,ty0+24,{a:'right',s:12,c:DIM});
      // hemácias
      const yc=H-58,okc=done()&&st.tgt==='bcl';
      [[W*.3,'antes',true],[W*.7,'depois',!okc]].forEach(([x,l,sick])=>{for(let i=0;i<4;i++){const xx=x+(i-1.5)*30;rbc(xx,yc,10,sick)}tx(l,x,H-34,{s:12,c:DIM,w:600})});
      foot()},
    res(){const t=st.tgt;
      let a='<p>O <b>RNA guia</b> leva a <b>Cas9</b> até a sequência que combina com ele, e a Cas9 corta as duas fitas do DNA ali.</p>';
      if(!t)return a+'<p>Escolha o alvo e toque em “Enviar Cas9”.</p>';
      if(!done())return a+'<p>A Cas9 percorre o DNA procurando a sequência do guia.</p>';
      let b=t==='bcl'?'<p><b>Corte no alvo.</b> A célula conserta o corte e o gene que desliga a hemoglobina fetal deixa de funcionar. A <b>hemoglobina fetal</b> volta a ser produzida e compensa a hemoglobina alterada: menos hemácias em foice.</p>':t==='hbb'?'<p><b>Corte no gene da hemoglobina.</b> Só cortar não corrige o erro: a célula conserta o corte de forma imprecisa. Por isso a terapia aprovada edita o gene que desliga a hemoglobina fetal.</p>':'<p class="bad"><b>Corte fora do alvo.</b> O guia combinou quase por completo com um trecho parecido e a Cas9 cortou no lugar errado. Esse é um risco real da técnica, e o guia precisa ser bem escolhido.</p>';
      const c=st.cell==='emb'?'<p class="bad">Em um embrião, a mudança passaria às próximas gerações: por isso é proibida na maioria dos países.</p>':'<p>Em células do paciente (<b>células somáticas</b>), a mudança fica só nele e não passa aos filhos.</p>';
      return a+b+c}};
  return inst}

// ================= P1. Equilíbrio de Hardy-Weinberg =================
const CASOS=[['alb','Albinismo: 1 em 10 000',1e-4],['fc','Fibrose cística na Europa: cerca de 1 em 2 500',4e-4],['inv','Caso inventado: 16%',.16]];
function crowd(x0,y0,cs,nAA,nAa,naa){let i=0;const arr=[];for(let k=0;k<nAA;k++)arr.push(0);for(let k=0;k<nAa;k++)arr.push(1);for(let k=0;k<naa;k++)arr.push(2);
  arr.slice(0,100).forEach((g,i)=>{const x=x0+(i%10)*cs+cs/2,y=y0+Math.floor(i/10)*cs+cs/2,r=cs*.36;
    if(g===0)circ(x,y,r,GRN);else if(g===2)circ(x,y,r,VIO);
    else{X.beginPath();X.arc(x,y,r,PI/2,PI*1.5);X.fillStyle=GRN;X.fill();X.beginPath();X.arc(x,y,r,-PI/2,PI/2);X.fillStyle=VIO;X.fill()}})}
function legend(x,y,nAA,nAa,naa){const it=[[GRN,'AA '+nAA],['mix','Aa '+nAa],[VIO,'aa '+naa]];
  it.forEach(([c,l],i)=>{const cx=x,yy=y+i*17;if(c==='mix'){X.beginPath();X.arc(cx+5,yy,5,PI/2,PI*1.5);X.fillStyle=GRN;X.fill();X.beginPath();X.arc(cx+5,yy,5,-PI/2,PI/2);X.fillStyle=VIO;X.fill()}else circ(cx+5,yy,5,c);
    tx(l,cx+16,yy,{a:'left',s:12,f:FD})})}
function mkHW(){
  const st={mode:'q',q:.4,caso:'alb',t0:-99,gen:0,obs:null,seed:1};let P;
  const cs=()=>CASOS.find(c=>c[0]===st.caso);
  const calc=()=>{const f=cs()[2],q=Math.sqrt(f),p=1-q,h=2*p*q,N=h*100;return{f,q,p,h}};
  const nn=h=>{const n=1/h;return n<10?Math.round(n):Math.round(n/5)*5};
  const pc=h=>{const v=Math.round(h*1000)/10;return String(v).replace('.',',')};
  const counts=()=>{const q=st.q,p=1-q;if(st.obs)return st.obs;const a=Math.round(p*p*100),c=Math.round(q*q*100);return[a,100-a-c,c]};
  const inst={
    ui(){P=panel(()=>inst.res());
      P.pick('Modo',[['q','Escolher q'],['calc','Calcular a partir dos afetados']],v=>st.mode===v,v=>{st.mode=v;st.t0=T});
      P.range('q, frequência do alelo a',0,1,.01,()=>st.q,v=>{st.q=v;st.gen=0;st.obs=null},v=>nf(v,2),()=>st.mode==='q');
      P.acts('Gerações',[['Próxima geração',()=>{const R=rng(st.seed=st.seed*31+7+(Math.random()*999|0)),q=st.q;let c=[0,0,0];for(let i=0;i<100;i++){const k=(R()<q?1:0)+(R()<q?1:0);c[k===0?0:k===1?1:2]++}st.obs=c;st.gen++},true],['Voltar ao início',()=>{st.gen=0;st.obs=null}]],()=>st.mode==='q');
      P.pick('Caso',CASOS.map(c=>[c[0],c[1]]),v=>st.caso===v,v=>{st.caso=v;st.t0=T},()=>st.mode==='calc');
      P.refresh();inst._rf=P.refresh},
    draw(){env(inst);
      if(st.mode==='calc'){const{f,q,p,h}=calc(),rows=[
          ['afetados  q² = '+nfs(f,4)],['q = √'+nfs(f,4)+' = '+nfs(q,2)],['p = 1 − '+nfs(q,2)+' = '+nfs(p,2)],['2pq = 2 × '+nfs(p,2)+' × '+nfs(q,2)+' ≈ '+nfs(h,4)],['portadores: cerca de '+pc(h)+'%']];
        const lh=22,y0=68;rows.forEach(([s],i)=>{const a=RM?1:ss((T-st.t0-i*.55)/.4);if(a<=0)return;X.globalAlpha=a;
          tx(['1','2','3','4','5'][i]+'.',16,y0+i*lh,{a:'left',s:13,f:FD,c:DIM});tx(s,40,y0+i*lh,{a:'left',s:Math.min(16,Math.max(13,W/26)),f:FD,c:i===4?AMB:TXT,w:i===4?700:500});X.globalAlpha=1});
        const a5=RM?1:ss((T-st.t0-4*.55)/.4),nAa=Math.round(h*100),naa=Math.round(f*100),gy=y0+5*lh+4,cs2=Math.min(16,(H-gy-14)/10),gx=W-16-cs2*10;
        if(cs2>=9){crowd(gx,gy,cs2,100-nAa-naa,nAa,naa);legend(16,gy+14,100-nAa-naa,nAa,naa);tx('100 pessoas',16,gy+14+3*17,{a:'left',s:12,c:DIM})}
        void a5;return}
      const q=st.q,p=1-q,s=Math.min(H-150,(W-56)*.52,230),cg=Math.min(20,Math.max(9,(W-56-s)/10)),tot=s+24+cg*10,x0=(W-tot)/2,sy=78;
      // quadrado p x q
      const pw=p*s,qw=q*s;
      [[0,0,pw,pw,GRN,'p²',p*p],[pw,0,qw,pw,'mix','pq',p*q],[0,pw,pw,qw,'mix','pq',p*q],[pw,pw,qw,qw,VIO,'q²',q*q]].forEach(([dx,dy,w,h,c,l,v])=>{
        if(w<.5||h<.5)return;const x=x0+dx,y=sy+dy;
        if(c==='mix'){X.fillStyle=rgba(GRN,.55);X.fillRect(x,y,w,h);X.beginPath();X.moveTo(x+w,y);X.lineTo(x+w,y+h);X.lineTo(x,y+h);X.closePath();X.fillStyle=rgba(VIO,.6);X.fill()}
        else{X.fillStyle=rgba(c,.6);X.fillRect(x,y,w,h)}
        X.strokeStyle='rgba(11,15,28,.7)';X.lineWidth=1.5;X.strokeRect(x,y,w,h);
        if(w>=52&&h>=20)tx(l+' '+nf(v,2),x+w/2,y+h/2,{s:13,f:FD,w:600,c:'#fff'})});
      if(pw>40)tx('p '+nf(p,2),x0+pw/2,sy-12,{s:12,w:600,c:'#7FE0A2'});if(qw>40)tx('q '+nf(q,2),x0+pw+qw/2,sy-12,{s:12,w:600,c:'#C9B1FF'});
      tx('verde: alelo A     roxo: alelo a',x0+s/2,sy+s+16,{s:12,c:DIM});
      const[a,b,c]=counts(),gx=x0+s+24;crowd(gx,sy,cg,a,b,c);legend(gx,sy+cg*10+16,a,b,c);
      tx(st.gen?'sorteio da geração '+st.gen:'100 pessoas esperadas',gx,sy+cg*10+16+3*17,{a:'left',s:12,c:DIM})},
    res(){
      if(st.mode==='calc'){const{f,q,p,h}=calc(),n=nn(h),fs=[...f.toString().includes('e')?[nfs(f,4)]:[nfs(f,4)]][0];
        return`<p>Os afetados (aa) são ${CASOS.find(c=>c[0]===st.caso)[1].split(': ')[1]}, então <b>q² = ${fs}</b>. Tirando a raiz, <b>q = ${nfs(q,2)}</b> e <b>p = 1 − q = ${nfs(p,2)}</b>. Os heterozigotos são <b>2pq ≈ ${nfs(h,4)}</b>.</p><p><b>Portadores: cerca de ${pc(h)}% ${h>=.2?'':` (cerca de 1 em ${n} pessoas)`}.</b>${q<.1?' Quando o alelo é raro, há muito mais portadores do que afetados.':''}</p>`}
      const q=st.q,p=1-q,pp=p*p,hh=2*p*q,qq=q*q;
      return`<p>p = <b>${nf(p,2)}</b> e q = <b>${nf(q,2)}</b>, com p + q = 1. Genótipos esperados: AA <b>${pct(pp)}</b>, Aa <b>${pct(hh)}</b>, aa <b>${pct(qq)}</b>.</p><p>${st.gen?`Depois de ${st.gen} geração${st.gen>1?'ões':''} de cruzamentos ao acaso, p e q continuam iguais; os números sorteados só flutuam um pouco. Esse é o equilíbrio.`:'Use “Próxima geração” para sortear cruzamentos ao acaso e ver que p e q não mudam.'}</p>`}};
  const pct=v=>(Math.round(v*1000)/10).toString().replace('.',',')+'%';
  return inst}

// ================= P2. O que tira a população do equilíbrio =================
const NV=[10,20,50,100,200,500,1000],FAT=[['none','Nenhum (equilíbrio)'],['drift','Deriva'],['sel','Seleção contra aa'],['mig','Migração'],['bott','Gargalo']],LCOL=[AMB,TEA,PNK,YEL,'#8FD8FF'];
const DEFN={none:6,drift:1,sel:5,mig:5,bott:5};
function gauss(R){let u=0,v=0;while(!u)u=R();v=R();return Math.sqrt(-2*Math.log(u))*Math.cos(TAU*v)}
function simLine(q0,N0,fac,seed){const R=rng(seed),pts=[q0],Ns=[N0];let q=q0;
  for(let g=1;g<=50;g++){let N=N0;if(fac==='bott'&&g>=10)N=Math.min(N0,10*2**(g-10));
    if(fac==='sel')q=q*(1-.3*q)/(1-.3*q*q);if(fac==='mig')q=.9*q+.1*.8;
    const n=2*N;let k=0;if(n>400){k=cl(Math.round(n*q+Math.sqrt(n*q*(1-q))*gauss(R)),0,n)}else for(let i=0;i<n;i++)if(R()<q)k++;
    q=k/n;pts.push(q);Ns.push(N)}
  return{pts,Ns}}
function mkFat(){
  const st={fac:'none',ni:6,q0:.5,lines:[],t0:-99};let P;
  const clear=()=>{st.lines=[]};
  const run=add=>{const seed=(performance.now()*1000|0)+st.lines.length*7919+1;const L=simLine(st.q0,NV[st.ni],st.fac,seed);if(!add)st.lines=[];if(st.lines.length>=5)st.lines.shift();st.lines.push(L);st.t0=T};
  const inst={
    ui(){P=panel(()=>inst.res());
      P.pick('Fator',FAT,v=>st.fac===v,v=>{st.fac=v;st.ni=DEFN[v];clear()});
      P.range('Tamanho da população',0,6,1,()=>st.ni,v=>{st.ni=v;clear()},v=>String(NV[v]));
      P.range('q inicial',.1,.9,.05,()=>st.q0,v=>{st.q0=v;clear()},v=>nf(v,2));
      P.acts('Simulação',[['Rodar 50 gerações',()=>run(false),true],['Repetir (nova linha)',()=>run(true),false,()=>!st.lines.length||false]]);
      P.refresh();inst._rf=P.refresh},
    draw(){env(inst);
      const prg=st.lines.length?pr(st.t0,2.6):1,gmax=Math.floor(50*prg),L=st.lines[st.lines.length-1],gd=L?gmax:0,qd=L?L.pts[gd]:st.q0,Nd=L?L.Ns[gd]:NV[st.ni];
      // ilha
      const ix=W*.24,iy=92,irx=W*.2,iry=32;ell(ix,iy+6,irx,iry,'rgba(47,207,191,.10)',LIN,1.5);
      const nd=Math.min(60,Nd),R=rng(5),na=Math.round(nd*(1-qd));
      for(let i=0;i<nd;i++){const a=R()*TAU,d=Math.sqrt(R());circ(ix+Math.cos(a)*d*(irx-9),iy+6+Math.sin(a)*d*(iry-8),3.4,i<na?GRN:VIO)}
      tx('população: '+Nd,ix+irx+12,iy-2,{a:'left',s:13,w:600});tx('geração '+gd,ix+irx+12,iy+18,{a:'left',s:12,c:DIM});
      if(st.fac==='mig'){const bx=W-48,by=iy+4+(RM?0:Math.sin(T*1.6)*3);X.beginPath();X.moveTo(bx-26,by+6);X.lineTo(bx+26,by+6);X.lineTo(bx+17,by+18);X.lineTo(bx-17,by+18);X.closePath();X.fillStyle='#8A6A44';X.fill();
        for(let i=0;i<5;i++)circ(bx-16+i*8,by-1,3.4,i===0?GRN:VIO);tx('vizinha q = 0,8',bx,by+34,{s:12,c:DIM})}
      // gráfico
      const cx0=48,cx1=W-16,ct=152,cb=H-64,xx=g=>cx0+(cx1-cx0)*g/50,yy=q=>cb-(cb-ct)*q;
      box(cx0,ct,cx1-cx0,cb-ct,4,'rgba(255,255,255,.03)','rgba(255,255,255,.14)',1);
      [0,.5,1].forEach(v=>{tx(nfs(v,1),cx0-8,yy(v),{a:'right',s:12,f:FD,c:DIM});if(v>0&&v<1)line(cx0,yy(v),cx1,yy(v),'rgba(255,255,255,.08)',1)});
      [0,10,20,30,40,50].forEach(g=>tx(String(g),xx(g),cb+14,{s:12,f:FD,c:DIM}));
      tx('geração',(cx0+cx1)/2,cb+34,{s:12,c:DIM});tx('q',cx0+8,ct+12,{a:'left',s:13,f:FD,c:TXT,w:600});
      box(cx0,yy(st.q0)-3,cx1-cx0,6,2,'rgba(255,255,255,.16)');
      if(st.fac==='bott'){line(xx(10),ct,xx(10),cb,'rgba(255,255,255,.3)',1);tx('gargalo',xx(10)+4,ct+12,{a:'left',s:12,c:DIM})}
      st.lines.forEach((ln,k)=>{const last=k===st.lines.length-1,gm=last?gmax:50;X.beginPath();for(let g=0;g<=gm;g++)g?X.lineTo(xx(g),yy(ln.pts[g])):X.moveTo(xx(g),yy(ln.pts[g]));X.strokeStyle=LCOL[k%5];X.lineWidth=2;X.lineJoin='round';X.stroke()});
      if(!st.lines.length)tx('toque em “Rodar 50 gerações”',(cx0+cx1)/2,(ct+cb)/2,{s:13,c:DIM})},
    res(){
      const msg={none:'Nenhum fator: com população grande, q quase não muda de uma geração para outra. Com população pequena, o acaso já mexe nas frequências.',
        drift:'Deriva: em população pequena, o acaso pode eliminar um alelo sem que ele seja pior.',
        sel:'Seleção contra aa: q cai devagar, e mais devagar quando já é baixo, porque o alelo se esconde nos heterozigotos.',
        mig:'Migração: q é puxado para o valor da população vizinha (q = 0,8).',
        bott:'Gargalo: depois da catástrofe, poucos indivíduos refazem a população, e as frequências podem ficar bem diferentes das de antes.'}[st.fac];
      const prg=st.lines.length?pr(st.t0,2.6):1,fin=prg>=1;
      const chips=st.lines.map((ln,k)=>{const q=ln.pts[50];return chip(LCOL[k%5],'linha '+(k+1)+': q final',fin||k<st.lines.length-1?nf(q,2)+(q===0?' (alelo a perdido)':q===1?' (alelo a fixado)':''):'...')}).join('');
      return`<p>${msg}</p>`+(chips?`<div class="chips">${chips}</div>`:'<p>População de <b>'+NV[st.ni]+'</b> indivíduos e q inicial <b>'+nf(st.q0,2)+'</b>.</p>')}};
  const chip=(c,l,v)=>`<span class="chip"><i style="background:${c}"></i>${l} <b>${v}</b></span>`;
  return inst}

// ================= registro das seções =================
window.GEN_EXTRA=(window.GEN_EXTRA||[]).concat([
 {nova:{id:'biotec',t:'Biotecnologia',c:'#5FC9B8',tops:[
  {id:'recombinante',t:'DNA recombinante e transgênicos',s:'cortar, colar e pôr um gene em outro ser',
   d:`<p>As <b>enzimas de restrição</b> são proteínas de bactérias que cortam o DNA sempre na mesma sequência curta. Cortando com a mesma enzima o gene de interesse e um <b>plasmídeo</b> (pequeno DNA circular da bactéria), as pontas se encaixam, e a <b>DNA ligase</b> cola os pedaços. O resultado é um <b>DNA recombinante</b>.</p><p>A bactéria que recebe esse plasmídeo passa a fabricar a proteína do gene inserido. Assim se produz a <b>insulina humana</b> desde 1982. Quando o gene vem de outra espécie, o ser modificado é um <b>transgênico</b>, como o milho <b>Bt</b>, que fabrica uma proteína tóxica para lagartas, e a soja tolerante a herbicida, muito plantada no Brasil.</p>`,
   enem:`O ENEM pede a <b>sequência de passos</b> (cortar, ligar, inserir, selecionar) e os <b>prós e contras</b> dos transgênicos: mais produção e menos inseticida, mas risco de resistência em pragas e de cruzamento com plantas nativas. No Brasil, quem avalia a liberação é a <b>CTNBio</b>.`,
   links:[DNA,BAC,MOL],mk:mkRecomb},
  {id:'pcr',t:'PCR e teste de DNA',s:'copiar DNA e comparar perfis no gel',
   d:`<p>A <b>PCR</b> (reação em cadeia da polimerase) copia um trecho de DNA no tubo, imitando a replicação. Em cada <b>ciclo</b> o tubo é aquecido a cerca de 95 °C para separar as fitas, esfria a cerca de 55 °C para os <b>primers</b> se ligarem, e a cerca de 72 °C a <b>DNA polimerase</b> resistente ao calor completa as fitas. Cada ciclo dobra o número de cópias: depois de 30 ciclos, há cerca de 1 bilhão de cópias.</p><p>Na <b>eletroforese em gel</b>, os fragmentos de DNA, que têm carga negativa, andam em direção ao polo positivo, e os <b>menores andam mais</b>. Cada pessoa forma um padrão próprio de bandas, o <b>perfil de DNA</b>. No teste de paternidade, cada banda do filho tem de vir da mãe ou do suposto pai.</p>`,
   enem:`Questões trazem um <b>gel</b> e pedem o pai ou o suspeito compatível: elimine as bandas que o filho herdou da mãe e veja quem tem as que sobram. Também aparece a PCR no <b>diagnóstico</b> de vírus, como no teste RT-PCR da covid-19.`,
   links:[DNA,MOL,['Como ler um heredograma','#heredogramas/leitura']],mk:mkPcr},
  {id:'clonagem',t:'Clonagem e células-tronco',s:'cópias genéticas e células que viram outras',
   d:`<p>Um <b>clone</b> é um ser geneticamente igual a outro. Gêmeos idênticos são clones naturais. Na <b>clonagem reprodutiva</b>, o núcleo de uma célula do corpo do doador é posto num ovócito sem núcleo (<b>transferência nuclear</b>); o embrião vai para o útero de uma mãe de aluguel. Foi assim que nasceu a ovelha <b>Dolly</b>, em 1996. O clone tem o DNA nuclear do doador, mas as mitocôndrias vêm do ovócito.</p><p><b>Células-tronco</b> são células que se dividem muito e podem se transformar em outros tipos. As <b>embrionárias</b> vêm do blastocisto e formam quase todos os tecidos. As <b>adultas</b>, como as da medula óssea, formam poucos tipos. As <b>iPS</b> são células adultas reprogramadas em laboratório para voltar a agir como embrionárias, sem usar embriões.</p>`,
   enem:`O ENEM cobra a origem do material genético do clone (núcleo do doador) e o <b>debate ético</b>: a pesquisa com embriões no Brasil é permitida pela Lei de Biossegurança, de 2005, só com embriões de fertilização em laboratório inviáveis ou congelados há 3 anos ou mais, e com autorização dos genitores. O transplante de <b>medula óssea</b> é o uso de células-tronco adultas que já salva vidas.`,
   links:[EMB,DIV,['A célula','../celula/index.html#nucleo']],mk:mkClone},
  {id:'crispr',t:'CRISPR e terapia gênica',s:'corrigir genes, com limites éticos',
   d:`<p>O <b>CRISPR-Cas9</b> é uma ferramenta de <b>edição gênica</b> tirada da defesa das bactérias contra vírus. Um <b>RNA guia</b> leva a enzima <b>Cas9</b> até a sequência exata do DNA, que é cortada ali. A célula conserta o corte, e nesse conserto o gene pode ser desligado ou corrigido. A técnica rendeu o Nobel de Química de 2020 a Emmanuelle Charpentier e Jennifer Doudna.</p><p>A <b>terapia gênica</b> trata doenças mudando os genes das células do paciente. Em 2023 foi aprovada a primeira terapia com CRISPR, para a <b>anemia falciforme</b> e a beta-talassemia: células da medula do paciente são editadas fora do corpo para voltar a produzir <b>hemoglobina fetal</b>, e depois devolvidas. Editar células do corpo não passa para os filhos; editar embriões passaria, e por isso fazer nascer um bebê de embrião editado é proibido em muitos países.</p>`,
   enem:`A banca diferencia <b>terapia em células somáticas</b> (só o paciente muda) de edição em <b>células germinativas ou embriões</b> (a mudança passa aos descendentes). Em 2018, um pesquisador chinês editou embriões que nasceram, e o caso foi condenado pela comunidade científica.`,
   links:[DNA,MOL],mk:mkCrispr}]},antes:'extras'},
 {nova:{id:'populacoes',t:'Genética de populações',c:'#A98FE0',tops:[
  {id:'hardy-weinberg',t:'Equilíbrio de Hardy-Weinberg',s:'frequências que não mudam de geração em geração',
   d:`<p>Numa população, chama-se <b>p</b> a frequência do alelo dominante A e <b>q</b> a do recessivo a. Como só há esses dois alelos, <b>p + q = 1</b>. Se os cruzamentos acontecem ao acaso, as frequências dos genótipos são <b>p²</b> (AA), <b>2pq</b> (Aa) e <b>q²</b> (aa), e <b>p² + 2pq + q² = 1</b>. É a regra do E aplicada a gametas.</p><p>O <b>equilíbrio</b> só vale se a população for muito grande, os cruzamentos forem ao acaso e não houver mutação, migração nem seleção natural. Na prova, comece pelos recessivos: se 1 em cada 10 000 pessoas é albina, q² = 0,0001, então q = 0,01 e p = 0,99. Os <b>portadores</b> (2pq) são cerca de 2% da população, cerca de 1 em 50.</p>`,
   enem:`O caminho quase sempre é o mesmo: a frequência dos <b>afetados recessivos</b> é q², tire a raiz para achar q, faça p = 1 − q e calcule 2pq para os heterozigotos. Erro comum: usar a frequência dos afetados como se fosse q.`,
   links:[['Regra do E','#probabilidade/e'],['Gene e alelo','#conceitos/gene']],mk:mkHW},
  {id:'fatores',t:'O que tira a população do equilíbrio',s:'os fatores que fazem a população evoluir',
   d:`<p>Quando as frequências dos alelos mudam de uma geração para outra, a população está <b>evoluindo</b>. Os fatores são: <b>mutação</b> (cria alelos novos), <b>migração</b> (traz ou leva alelos), <b>seleção natural</b> (quem tem certo fenótipo deixa mais filhos) e <b>deriva genética</b> (mudança ao acaso, forte em populações pequenas).</p><p>Dois casos de deriva aparecem muito: o <b>efeito fundador</b>, quando poucos indivíduos fundam uma população nova, e o <b>gargalo populacional</b>, quando uma catástrofe mata quase todos. Os <b>cruzamentos entre parentes</b> não mudam p e q, mas aumentam os homozigotos e, com eles, as doenças recessivas.</p>`,
   enem:`O ENEM pede para reconhecer o fator em uma história: ilha colonizada por poucas pessoas é efeito fundador, bactéria que sobrevive ao antibiótico é seleção. Também cobra que a seleção atua no <b>fenótipo</b>, e não diretamente no alelo.`,
   links:[['Equilíbrio de Hardy-Weinberg','#populacoes/hardy-weinberg'],['Ecologia','../ecologia/index.html'],['Seres vivos e evolução','../biologia/index.html']],mk:mkFat}]},antes:'extras'}
]);
})();
