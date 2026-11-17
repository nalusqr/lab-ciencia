// Genética, tópicos novos da parte A (roteiro de Taxon): letais, pleiotropia, herança quantitativa,
// sistemas de determinação do sexo, corpúsculo de Barr, herança restrita ao Y e calvície.
// Carregado antes do script principal; os helpers dele (circ, line, box, tx, para, punnett, ped, rng, gh...) só são usados dentro de mk().
(function () {
let LIB = null;
const AVISO = '<p><i>Conteúdo educativo, não substitui orientação médica.</i></p>';
// Autônomo: o script principal fica dentro de uma função, então os helpers (cópias) e os controles ficam aqui dentro e só são criados quando um tópico abre.
function criar() {
const TAU=Math.PI*2,PI=Math.PI;
const TXT='#E8EDF7',DIM='#9DA9C4',PAN='#1B2440',PAN1='#131A2B',LIN='#5B6C99',AMB='#FFB347',FOC='#8FD8FF';
const YEL='#F7C13B',GRN='#3FBF6A',RED='#D7303B',BLU='#4B7BFF',PNK='#F06AAE',VIO='#9A6BFF',TEA='#2FCFBF';
const cl=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,ss=t=>{t=cl(t,0,1);return t*t*(3-2*t)},seg=(p,a,b)=>cl((p-a)/(b-a),0,1);
function rng(s){s=s>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
function hx(c){const n=parseInt(c.slice(1),16);return[n>>16&255,n>>8&255,n&255]}
const rgba=(c,a)=>{const[r,g,b]=hx(c);return`rgba(${r},${g},${b},${a})`};
const FT="'Atkinson Hyperlegible Next',system-ui,sans-serif",FD="'JetBrains Mono',ui-monospace,monospace",FH="'Space Grotesk',sans-serif";
function circ(x,y,r,f,s,lw){X.beginPath();X.arc(x,y,Math.max(.1,r),0,TAU);if(f){X.fillStyle=f;X.fill()}if(s){X.strokeStyle=s;X.lineWidth=lw||1;X.stroke()}}
function line(x1,y1,x2,y2,s,lw){X.beginPath();X.moveTo(x1,y1);X.lineTo(x2,y2);X.strokeStyle=s;X.lineWidth=lw||1;X.stroke()}
function box(x,y,w,h,r,f,s,lw){X.beginPath();X.roundRect(x,y,w,h,r);if(f){X.fillStyle=f;X.fill()}if(s){X.strokeStyle=s;X.lineWidth=lw||1;X.stroke()}}
function tx(s,x,y,o={}){X.font=`${o.w||400} ${Math.max(12,o.s||13)}px ${o.f||FT}`;X.textAlign=o.a||'center';X.textBaseline='middle';X.fillStyle=o.c||TXT;X.fillText(s,x,y)}
// texto em várias linhas, quebrando por largura
function para(s,x,y,mw,o={}){X.font=`${o.w||400} ${Math.max(12,o.s||13)}px ${o.f||FT}`;const ws=s.split(' ');let ln='',ls=[];for(const w of ws){const t=ln?ln+' '+w:w;if(X.measureText(t).width>mw&&ln){ls.push(ln);ln=w}else ln=t}ls.push(ln);const lh=(o.s||13)*1.35;ls.forEach((l,i)=>tx(l,x,y+i*lh,o));return ls.length*lh}
// genótipo com sobrescrito: "I^Ai", "X^DX^d"
function gparts(s){const o=[];for(let i=0;i<s.length;i++){if(s[i]==='^')o.push([s[++i],1]);else o.push([s[i],0])}return o}
function gtx(s,x,y,sz,col){sz=Math.max(12,sz);const ps=gparts(s);let w=0;const ws=ps.map(([c,u])=>{X.font=`500 ${u?sz*.7:sz}px ${FD}`;const m=X.measureText(c).width;w+=m;return m});let cx=x-w/2;X.fillStyle=col||TXT;X.textAlign='left';X.textBaseline='middle';ps.forEach(([c,u],i)=>{X.font=`500 ${u?sz*.7:sz}px ${FD}`;X.fillText(c,cx,u?y-sz*.36:y);cx+=ws[i]})}
const gh=s=>'<span class="gt">'+s.replace(/\^(.)/g,'<sup>$1</sup>')+'</span>';
// símbolo de heredograma: quadrado = homem, círculo = mulher
function sym(x,y,r,sex,st){const f=st==='af'?TXT:PAN1;X.beginPath();if(sex==='M')X.rect(x-r,y-r,r*2,r*2);else X.arc(x,y,r,0,TAU);X.fillStyle=f;X.fill();X.strokeStyle=TXT;X.lineWidth=1.75;X.stroke();if(st==='pt')circ(x,y,r*.28,TXT)}
// quadro de Punnett genérico. o:{ga (colunas), gb (linhas), kid(a,b), icon(g,x,y,r), hl(g), la, lb, P}
function punnett(o){const m=o.ga.length,n=o.gb.length,big=m>2||n>2,hd=big?32:40,top=58,lw=W<520?18:22;
  const bt=o.bot||14,s=Math.min((W-24-hd-lw)/m,(H-top-bt-hd-lw)/n,big?86:118);
  const x0=(W-(hd+lw+s*m))/2+hd+lw,y0=top+lw+hd+(H-top-bt-hd-lw-s*n)/2;
  tx(o.la,x0+s*m/2,y0-hd-lw/2,{s:13,c:DIM});
  X.save();X.translate(x0-hd-lw/2,y0+s*n/2);X.rotate(-PI/2);tx(o.lb,0,0,{s:13,c:DIM});X.restore();
  const gs=big?14:18;
  o.ga.forEach((g,j)=>{box(x0+s*j+3,y0-hd+3,s-6,hd-6,8,'rgba(255,255,255,.06)');gtx(g,x0+s*(j+.5),y0-hd/2,gs,TXT)});
  o.gb.forEach((g,i)=>{box(x0-hd+3,y0+s*i+3,hd-6,s-6,8,'rgba(255,255,255,.06)');gtx(g,x0-hd/2,y0+s*(i+.5),gs,TXT)});
  for(let i=0;i<n;i++)for(let j=0;j<m;j++){const g=o.kid(o.ga[j],o.gb[i]),k=i*m+j,a=ss(seg(o.P,k/(n*m)*.7,k/(n*m)*.7+.3));
    const x=x0+s*j,y=y0+s*i,h=o.hl?o.hl(g):null;
    box(x+2,y+2,s-4,s-4,8,PAN,h?AMB:'rgba(255,255,255,.1)',h?2:1);
    X.save();X.globalAlpha=a*(h===false?.28:1);o.icon(g,x+s/2,y+s*.4,s*.2);gtx(g,x+s/2,y+s*.78,big?(s<60?12:13):16,TXT);X.restore()}}
// heredograma. P:{p:[[id,sexo,estado,col,linha]],u:[[a,b,[filhos]]]}; hl=conjunto de ids destacados; lab={id:texto}
function ped(P,o={}){const cols=Math.max(...P.p.map(q=>q[3])),rows=Math.max(...P.p.map(q=>q[4]))+1;
  const top=o.top||52,bot=o.bot||18,u=Math.min((W-56)/(cols+.6),82),v=Math.min((H-top-bot)/rows,96),r=cl(Math.min(u,v)*.24,11,17);
  const x0=(W-u*(cols-1))/2+10-u,y0=top+v*.42+(H-top-bot-v*rows)/2;
  const pos={};P.p.forEach(q=>pos[q[0]]=[x0+q[3]*u,y0+q[4]*v]);
  const R=['I','II','III','IV'];for(let i=0;i<rows;i++)tx(R[i],Math.max(12,x0-r-14),y0+i*v,{s:13,c:DIM,f:FD,w:500});
  X.lineCap='round';
  P.u.forEach(([a,b,ks])=>{const A=pos[a],B=pos[b],mx=(A[0]+B[0])/2,y=A[1];line(A[0],y,B[0],y,DIM,1.5);if(!ks.length)return;const yb=y+v*.5;line(mx,y,mx,yb,DIM,1.5);const xs=ks.map(k=>pos[k][0]);line(Math.min(mx,...xs),yb,Math.max(mx,...xs),yb,DIM,1.5);ks.forEach(k=>line(pos[k][0],yb,pos[k][0],pos[k][1]-r,DIM,1.5))});
  const cnt={};P.p.slice().sort((a,b)=>a[4]-b[4]||a[3]-b[3]).forEach(q=>{const[x,y]=pos[q[0]];cnt[q[4]]=(cnt[q[4]]||0)+1;
    if(o.hl&&o.hl.has(q[0])){circ(x,y,r+7+Math.sin(T*4)*1.5,rgba(AMB,.16),AMB,2)}
    sym(x,y,r,q[1],q[2]);
    const l=o.lab&&o.lab[q[0]];if(l)gtx(l,x,y+r+12,13,AMB);else tx(String(cnt[q[4]]),x,y+r+11,{s:12,c:DIM,f:FD,w:500})});
  return pos}

// ambiente próprio: o script principal fica dentro de uma função, então aqui há cópias dos desenhos e dos controles
const cv = document.getElementById('cv'), UI = document.getElementById('ui'), OUT = document.getElementById('out');
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
let X = cv.getContext('2d'), W = 600, H = 400, T = 0, A0 = 0, CURR = null; const syncs = [];
const env = () => { X = cv.getContext('2d'); const r = cv.getBoundingClientRect(); W = Math.max(200, r.width); H = Math.max(200, r.height); T = performance.now() / 1000; };
const el = (t, c) => { const e = document.createElement(t); if (c) e.className = c; return e; };
const rst = () => { A0 = T; };
function refresh() { syncs.forEach(f => f()); if (!CURR) return; const h = CURR.res ? CURR.res() : ''; if (OUT.innerHTML !== h) OUT.innerHTML = h; const t = document.getElementById('iT'); cv.setAttribute('aria-label', 'Ilustração: ' + (t ? t.textContent : '') + '. ' + h.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()); }
function pick(label, opts, isOn, set) { const w = el('div', 'pick'), l = el('span', 'pl'); l.textContent = label; w.appendChild(l); const g = el('div', 'pg'); g.setAttribute('role', 'group'); g.setAttribute('aria-label', label);
  opts.forEach(([v, h]) => { const b = el('button', 'ob'); b.type = 'button'; b.innerHTML = h; b.onclick = () => { set(v); rst(); refresh(); }; g.appendChild(b); syncs.push(() => { const on = !!isOn(v); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }); }); w.appendChild(g); UI.appendChild(w); }
function acts(label, list) { const w = el('div', 'pick'), l = el('span', 'pl'); l.textContent = label; w.appendChild(l); const g = el('div', 'pg'); list.forEach(([t, fn, go]) => { const b = el('button', 'ob' + (go ? ' go' : '')); b.type = 'button'; b.textContent = t; b.onclick = () => { fn(); refresh(); }; g.appendChild(b); }); w.appendChild(g); UI.appendChild(w); }
function range(label, min, max, step, get, set, fmt) { const w = el('label', 'pick'), l = el('span', 'pl'); l.textContent = label; w.appendChild(l); const r = el('div', 'rg'), i = el('input'), b = el('b'); i.type = 'range'; i.min = min; i.max = max; i.step = step; i.value = get(); b.textContent = fmt(get());
  i.oninput = () => { set(+i.value); b.textContent = fmt(+i.value); refresh(); }; r.appendChild(i); r.appendChild(b); w.appendChild(r); UI.appendChild(w); }
const wrap = o => { const r = { ui() { CURR = r; rst(); o.ui(); }, draw() { env(); o.draw(RM ? 1 : cl((T - A0) / 1.4, 0, 1)); }, res: o.res }; return r; };

const fim = (t0, dur) => RM ? 1 : cl((T - t0) / dur, 0, 1);
const pr = (n, d) => String(Math.round(n / d * 100)) + '%';

// ---------------------------------------------------------------- A1 alelos letais
function mouse(x, y, r, c, ghost) {
  X.save(); X.lineWidth = 1.4; X.lineJoin = 'round';
  const ln = ghost ? 'rgba(232,237,247,.6)' : 'rgba(0,0,0,.45)';
  if (ghost) X.setLineDash([3, 3]);
  X.beginPath(); X.moveTo(x - r * .8, y + r * .2); X.quadraticCurveTo(x - r * 1.3, y + r * .3, x - r * 1.35, y - r * .3); X.strokeStyle = ghost ? ln : c; X.lineWidth = 1.6; X.stroke(); X.lineWidth = 1.4;
  X.fillStyle = ghost ? 'rgba(232,237,247,.05)' : c; X.strokeStyle = ln;
  X.beginPath(); X.ellipse(x - r * .1, y + r * .1, r * .85, r * .55, 0, 0, TAU); X.fill(); X.stroke();
  X.beginPath(); X.arc(x + r * .75, y - r * .05, r * .38, 0, TAU); X.fill(); X.stroke();
  X.beginPath(); X.arc(x + r * .62, y - r * .38, r * .19, 0, TAU); X.fill(); X.stroke();
  X.beginPath(); X.arc(x + r * .92, y - r * .33, r * .19, 0, TAU); X.fill(); X.stroke();
  if (!ghost) { circ(x + r * .86, y - r * .1, r * .07, '#1a1a1a'); circ(x + r * 1.1, y + r * .02, r * .07, '#f4a6cf'); }
  X.restore();
  if (ghost) { X.save(); X.strokeStyle = rgba(RED, .85); X.lineWidth = 2; X.lineCap = 'round'; line(x - r * .6, y - r * .5, x + r * .6, y + r * .6, X.strokeStyle, 2); line(x + r * .6, y - r * .5, x - r * .6, y + r * .6, X.strokeStyle, 2); X.restore(); }
}
function mkLetais() {
  const AL = g => g.match(/A\^Y|A|a/g);
  const MODOS = {
    rato: { L: 'A^Y', col: { h: YEL, o: '#9A7B5A' }, nome: { h: 'amarelo', o: 'aguti' }, cruz: [['hh', 'A^Ya', 'A^Ya', 'amarelo × amarelo'], ['ho', 'A^Ya', 'aa', 'amarelo × aguti'], ['oo', 'aa', 'aa', 'aguti × aguti']],
      icon: (c, x, y, r) => mouse(x, y, r * 1.1, c === 'l' ? '' : c === 'h' ? YEL : '#9A7B5A', c === 'l') },
    acon: { L: 'A', col: { h: AMB, o: TEA }, nome: { h: 'com acondroplasia', o: 'sem acondroplasia', l: 'forma grave' }, cruz: [['hh', 'Aa', 'Aa', 'os dois com acondroplasia'], ['ho', 'Aa', 'aa', 'um com, um sem'], ['oo', 'aa', 'aa', 'os dois sem']],
      icon: (c, x, y, r) => { const f = c === 'l' ? RED : c === 'h' ? AMB : TEA; circ(x, y, r * .95, rgba(f, c === 'l' ? .55 : .9), 'rgba(255,255,255,.4)', 1.2); } }
  };
  const st = { m: 'rato', x: 'hh', prev: false, res: null, n: 0, t0: -99 };
  const M = () => MODOS[st.m], C = () => M().cruz.find(c => c[0] === st.x);
  const kidF = (a, b) => { const L = M().L; return a === L ? a + b : b === L ? b + a : a + b; };
  const cls = g => { const k = AL(g).filter(a => a === M().L).length; return k === 2 ? 'l' : k === 1 ? 'h' : 'o'; };
  const cells = () => { const c = C(), o = []; AL(c[1]).forEach(a => AL(c[2]).forEach(b => o.push(cls(kidF(a, b))))); return o; };
  function sorteia() {
    const c = C(), R = rng(9001 + st.n * 7919), ga = AL(c[1]), gb = AL(c[2]), cont = { l: 0, h: 0, o: 0 }; let perdidos = 0, tot = 0;
    const rato = st.m === 'rato';
    while (tot < 100) { const k = cls(kidF(ga[R() < .5 ? 0 : 1], gb[R() < .5 ? 0 : 1])); if (rato && k === 'l') { perdidos++; continue; } cont[k]++; tot++; }
    st.res = { c: cont, perdidos }; st.n++; st.t0 = T;
  }
  const build = () => {
    pick('Exemplo', [['rato', 'Camundongo'], ['acon', 'Acondroplasia']], v => st.m === v, v => { st.m = v; st.x = 'hh'; st.res = null; rebuild(); });
    pick('Cruzamento', M().cruz.map(c => [c[0], gh(c[1]) + ' × ' + gh(c[2]) + ' <small>' + c[3] + '</small>']), v => st.x === v, v => { st.x = v; st.res = null; });
    acts('Sorteio', [[st.m === 'rato' ? 'Nascer 100 filhotes' : 'Sortear 100 filhos', () => { sorteia(); rst(); }, true]]);
    pick('Comparar', [[false, 'Só o que nasceu'], [true, 'Mostrar o que o Punnett previa']], v => st.prev === v, v => st.prev = v);
  };
  const rebuild = () => { UI.innerHTML = ''; syncs.length = 0; build(); };
  return {
    ui: build,
    draw(P) {
      const m = M(), c = C(), ga = AL(c[1]), gb = AL(c[2]), rato = st.m === 'rato';
      const it = [['l', rato ? 'não se desenvolve' : 'forma grave'], ['h', m.nome.h], ['o', m.nome.o]];
      X.font = `400 12px ${FT}`; const ws = it.map(i => 30 + X.measureText(i[1]).width), gap = 14, tw = ws.reduce((a, b) => a + b, 0) + gap * 2, dois = tw > W - 16, bot = dois ? 120 : 100;
      punnett({ ga, gb, kid: kidF, icon: (g, x, y, r) => m.icon(cls(g), x, y, r), la: 'gametas do pai', lb: 'gametas da mãe', P, bot });
      // legenda
      const yl = H - bot + 12;
      const linha = (arr, y) => { const w2 = arr.reduce((a, i) => a + ws[i], 0) + gap * (arr.length - 1); let x = (W - w2) / 2; arr.forEach(i => { m.icon(it[i][0], x + 9, y, 8); tx(it[i][1], x + 30, y, { s: 12, c: DIM, a: 'left' }); x += ws[i] + gap; }); };
      if (dois) { linha([0, 1], yl); linha([2], yl + 18); } else linha([0, 1, 2], yl);
      // barras
      const bx = 16, bw = W - 32, ex = cells(), tot = 4;
      const segs = k => [['l', ex.filter(v => v === 'l').length], ['h', ex.filter(v => v === 'h').length], ['o', ex.filter(v => v === 'o').length]].filter(s => s[1]);
      const cor = k => k === 'l' ? RED : m.col[k];
      let yb = yl + (dois ? 40 : 22);
      if (st.prev) {
        let xx = bx; segs().forEach(([k, n]) => { const w = bw * n / tot; box(xx, yb, w - 2, 14, 4, rgba(cor(k), k === 'l' ? .12 : .18), rgba(cor(k), .9), 1.2); tx(String(n), xx + w / 2 - 1, yb + 7.5, { s: 12, c: DIM }); xx += w; });
        yb += 22;
      }
      if (st.res) {
        const q = fim(st.t0, 1.1), r = st.res, k = rato ? ['h', 'o'] : ['l', 'h', 'o'], total = k.reduce((a, b) => a + r.c[b], 0);
        X.save(); X.beginPath(); X.rect(bx, yb - 2, bw * q, 24); X.clip();
        let xx = bx; k.forEach(kk => { const w = bw * r.c[kk] / total; if (w > 0) { box(xx, yb, w - 2, 20, 5, rgba(cor(kk), .85)); if (q > .95) tx(`${r.c[kk]} ${kk === 'l' ? 'graves' : kk === 'h' ? (rato ? 'amarelos' : 'com') : (rato ? 'aguti' : 'sem')}`, xx + w / 2 - 1, yb + 10.5, { s: 12, w: 600, c: kk === 'l' ? TXT : '#10151f' }); } xx += w; });
        X.restore();
      } else tx(st.m === 'rato' ? 'Toque em "Nascer 100 filhotes" para sortear os nascimentos' : 'Toque em "Sortear 100 filhos" para sortear a prole', W / 2, yb + 10, { s: 12, c: DIM });
    },
    res() {
      const c = C(), r = st.res, rato = st.m === 'rato', ex = cells(), nl = ex.filter(v => v === 'l').length;
      let h = `<p><b>${gh(c[1])} × ${gh(c[2])}</b>. `;
      if (nl) h += rato ? `O quadro de Punnett prevê 1 : 2 : 1, mas a casa ${gh('A^YA^Y')} não nasce. Sobram <b>2 amarelos : 1 aguti</b> entre os nascidos (cerca de 67 e 33 em 100).` : `Em cada 4 filhos, <b>1 tem a forma grave</b>, 2 têm acondroplasia e 1 não tem a condição. Entre os que sobrevivem à fase de bebê, a proporção é de 2 com acondroplasia para 1 sem.`;
      else h += rato ? (st.x === 'ho' ? 'Aqui ninguém é A<sup>Y</sup>A<sup>Y</sup>: nascem cerca de <b>1 amarelo : 1 aguti</b>, sem perdas.' : 'Dois aguti só têm filhotes aguti.') : (st.x === 'ho' ? 'Metade dos filhos tem acondroplasia e metade não, <b>1 : 1</b>. Nenhum tem a forma grave.' : 'Sem o alelo alterado, nenhum filho tem a condição.');
      h += '</p>';
      if (r) h += rato ? `<p>Neste sorteio nasceram <b>${r.c.h} amarelos</b> e <b>${r.c.o} aguti</b>${r.perdidos ? `, e <b>${r.perdidos}</b> embriões ${gh('A^YA^Y')} foram perdidos` : ''}. Cada sorteio varia um pouco em torno do esperado.</p>` : `<p>Neste sorteio: <b>${r.c.l}</b> com a forma grave, <b>${r.c.h}</b> com acondroplasia e <b>${r.c.o}</b> sem. Cada sorteio varia um pouco em torno do esperado.</p>`;
      return h + (rato ? '<p>Em populações, o alelo letal recessivo tende a ficar raro, porque quem o carrega em dose dupla não deixa descendentes.</p>' : '<p>Cerca de 80% dos casos de acondroplasia surgem de uma mutação nova, em filhos de pais sem a condição.</p>');
    }
  };
}

// ---------------------------------------------------------------- A2 pleiotropia
function organ(k, x, y, r, on) {
  X.save(); X.lineWidth = 1.6; X.lineCap = 'round'; X.lineJoin = 'round'; const S = 'rgba(232,237,247,.8)';
  if (k === 'olho') {
    X.beginPath(); X.moveTo(x - r, y); X.quadraticCurveTo(x, y - r * .9, x + r, y); X.quadraticCurveTo(x, y + r * .9, x - r, y); X.closePath(); X.fillStyle = 'rgba(232,237,247,.12)'; X.fill(); X.strokeStyle = S; X.stroke();
    const dx = on ? r * .3 : 0, dy = on ? -r * .12 : 0; circ(x + dx, y + dy, r * .36, FOC, 'rgba(0,0,0,.4)', 1); circ(x + dx, y + dy, r * .15, '#10151f');
  } else if (k === 'coracao') {
    X.beginPath(); X.moveTo(x, y + r * .8); X.bezierCurveTo(x - r * 1.2, y + r * .1, x - r * .8, y - r * .8, x, y - r * .25); X.bezierCurveTo(x + r * .8, y - r * .8, x + r * 1.2, y + r * .1, x, y + r * .8); X.fillStyle = rgba(RED, .65); X.fill(); X.strokeStyle = S; X.stroke();
    X.beginPath(); X.moveTo(x - r * .1, y - r * .3); X.bezierCurveTo(x - r * .1, y - r * 1.2, x + r * .8, y - r * 1.2, x + r * .8, y - r * .5); X.strokeStyle = rgba(RED, .9); X.lineWidth = r * .24; X.stroke();
    if (on) circ(x + r * .35, y - r * 1.02, r * .36, rgba(RED, .9), S, 1.4);
  } else if (k === 'mao') {
    const f = on ? 1.25 : .8; box(x - r * .5, y + r * .05, r, r * .75, r * .2, 'rgba(232,237,247,.14)', S, 1.4);
    [-.36, -.12, .12, .36].forEach((o, i) => line(x + r * o, y + r * .05, x + r * o, y + r * .05 - r * f * (i === 0 || i === 3 ? .85 : 1), S, r * .16));
    line(x - r * .5, y + r * .4, x - r * .85, y + r * .02, S, r * .16);
  } else if (k === 'cerebro') {
    [[-.4, 0], [0, -.35], [.4, 0], [-.18, .3], [.22, .3]].forEach(([a, b]) => circ(x + a * r, y + b * r, r * .42, rgba(VIO, on ? .35 : .75), S, 1.2));
    if (on) { X.setLineDash([3, 3]); circ(x, y, r * 1.0, null, 'rgba(255,179,71,.8)', 1.4); }
  } else if (k === 'pele') {
    box(x - r * .8, y - r * .6, r * 1.6, r * 1.2, r * .25, on ? '#F2DCC8' : '#C9946F', 'rgba(255,255,255,.35)', 1.2);
  } else if (k === 'cabelo') {
    circ(x, y + r * .1, r * .62, '#D9A27E', S, 1.2); X.beginPath(); X.arc(x, y + r * .02, r * .72, PI * 1.05, PI * 1.95); X.lineTo(x + r * .55, y + r * .1); X.arc(x, y + r * .1, r * .55, 0, PI, true); X.closePath(); X.fillStyle = on ? '#D8BC8A' : '#3B2A20'; X.fill(); X.strokeStyle = 'rgba(255,255,255,.3)'; X.stroke();
  } else if (k === 'hemacia') {
    if (!on) { circ(x, y, r * .8, '#D7303B', 'rgba(255,255,255,.4)', 1.2); circ(x, y, r * .35, 'rgba(255,255,255,.22)'); }
    else { X.beginPath(); X.arc(x, y, r * .85, PI * .12, PI * 1.12); X.arc(x - r * .22, y + r * .12, r * .66, PI * 1.12, PI * .12, true); X.closePath(); X.fillStyle = '#D7303B'; X.fill(); X.strokeStyle = 'rgba(255,255,255,.4)'; X.stroke(); }
  } else if (k === 'vaso') {
    line(x - r, y - r * .42, x + r, y - r * .42, S, 1.6); line(x - r, y + r * .42, x + r, y + r * .42, S, 1.6);
    [-.8, -.45, .8].forEach(o => circ(x + o * r, y, r * .22, '#D7303B'));
    if (on) { [-.2, 0, .2].forEach((o, i) => { X.save(); X.translate(x + o * r, y + (i - 1) * r * .12); X.rotate(.6 + i); X.beginPath(); X.ellipse(0, 0, r * .3, r * .12, 0, 0, TAU); X.fillStyle = '#8E1F28'; X.fill(); X.restore(); }); }
    else circ(x + .1 * r, y, r * .22, '#D7303B');
  } else if (k === 'baco') {
    X.beginPath(); X.ellipse(x, y, r * .95, r * .55, -.4, 0, TAU); X.fillStyle = rgba(VIO, .55); X.fill(); X.strokeStyle = S; X.stroke();
    if (on) [[-.3, .05], [.2, -.1], [.45, .15]].forEach(([a, b]) => circ(x + a * r, y + b * r, r * .13, '#2A1F3A'));
  }
  X.restore();
}
function mkPleio() {
  const CD = {
    marfan: { n: 'Síndrome de Marfan', gene: 'gene FBN1', prot: 'fibrilina', org: [['olho', 'cristalino deslocado'], ['coracao', 'aorta dilatada'], ['mao', 'dedos longos']], ok: 'normal' },
    pku: { n: 'Fenilcetonúria', gene: 'gene PAH', prot: 'enzima', org: [['cerebro', 'deficiência intelectual sem dieta'], ['pele', 'pele mais clara'], ['cabelo', 'cabelos mais claros']], ok: 'normal' },
    falc: { n: 'Anemia falciforme', gene: 'gene da beta-globina', prot: 'hemoglobina', org: [['hemacia', 'hemácias em foice'], ['vaso', 'dor e vasos obstruídos'], ['baco', 'lesões em órgãos']], ok: 'normal' }
  };
  const st = { c: 'marfan', on: true, v: 'p' };
  return {
    ui() {
      pick('Visão', [['p', 'Pleiotropia'], ['i', 'Interação gênica']], v => st.v === v, v => { st.v = v; UI.innerHTML = ''; syncs.length = 0; this.ui(); });
      if (st.v === 'p') pick('Condição', [['marfan', 'Marfan'], ['pku', 'Fenilcetonúria'], ['falc', 'Anemia falciforme']], v => st.c === v, v => st.c = v);
      pick('Alelo', st.v === 'i' ? [[false, 'Cão E_'], [true, 'Cão ee']] : [[false, 'Alelo comum'], [true, 'Alelo alterado (doente)']], v => st.on === v, v => st.on = v);
    },
    draw(P) {
      const c = CD[st.c], on = st.on, small = W < 520;
      if (st.v === 'i') {
        const gx = [W * .28, W * .72], gy = 80, dx = W / 2, dy = H * .68;
        [['gene B', 'define o pigmento'], ['gene E', 'deixa o pigmento entrar no pelo']].forEach(([a, b], i) => {
          box(gx[i] - 52, gy - 16, 104, 32, 8, PAN, rgba(on && i ? AMB : LIN, .9), 1.4); tx(a, gx[i], gy, { s: 14, w: 700 });
          const p = ss(seg(P, i * .2, .6 + i * .2)); const sx0 = gx[i] + (i ? -52 : 52); line(sx0, gy, lerp(sx0, dx, p), lerp(gy, dy - 32, p), on && i ? AMB : DIM, 2);
          para(b, gx[i] + (i ? 52 : -52), gy + 32, small ? 112 : 190, { s: 12, c: DIM, a: i ? 'right' : 'left' });
        });
        const dog = on ? '#E9C46A' : '#3A3A46';
        circ(dx, dy, 32, dog, 'rgba(255,255,255,.5)', 2); circ(dx - 14, dy - 8, 4, on ? '#2a2a2a' : '#E8EDF7'); circ(dx + 14, dy - 8, 4, on ? '#2a2a2a' : '#E8EDF7'); circ(dx, dy + 8, 5, '#14161c');
        tx(on ? 'cão ee: pelagem amarela' : 'cão E_: pelagem escura', dx, dy + 50, { s: 14, w: 700 });
        tx('dois genes, uma característica', dx, dy + 68, { s: 13, c: AMB });
      } else {
        const gx = W / 2, gy = 82, gw = Math.min(210, W * .55);
        X.save(); X.lineWidth = 2;
        for (const s of [0, 1]) { X.beginPath(); for (let i = 0; i <= 40; i++) { const u = i / 40, px = gx - gw / 2 + u * gw, py = gy + Math.sin(u * 12 + s * PI + (RM ? 0 : T * 1.2)) * 8; i ? X.lineTo(px, py) : X.moveTo(px, py); } X.strokeStyle = s ? VIO : FOC; X.stroke(); }
        for (let i = 0; i < 12; i++) { const u = (i + .5) / 12, px = gx - gw / 2 + u * gw, a = Math.sin(u * 12 + (RM ? 0 : T * 1.2)) * 8; line(px, gy - a, px, gy + a, 'rgba(232,237,247,.3)', 1); }
        X.restore();
        tx(c.gene, gx, gy - 28, { s: 13, c: DIM, w: 600 });
        const px = gx + gw / 2 + 34; line(gx + gw / 2 + 4, gy, px - 18, gy, DIM, 1.4); circ(px, gy, 18, on ? rgba(AMB, .5) : rgba(GRN, .5), 'rgba(255,255,255,.4)', 1.4);
        para(on ? c.prot + ' alterada' : c.prot, px, gy + 34, 100, { s: 12, c: on ? AMB : DIM });
        const cw = W / 3, oy = H * .6 + 6, r = Math.min(30, cw * .27);
        c.org.forEach(([k, t], i) => {
          const ox = cw * (i + .5), p = on ? ss(seg(P, .1 + i * .2, .5 + i * .2)) : 1;
          line(gx, gy + 22, ox, oy - r - 8, on ? rgba(AMB, .35 + .65 * p) : 'rgba(157,169,196,.3)', on ? 2.2 : 1.2);
          circ(ox, oy, r + 10, PAN, on ? AMB : 'rgba(255,255,255,.12)', 1.4);
          organ(k, ox, oy, r, on && p > .5);
          para(on ? t : 'sem alteração', ox, oy + r + 28, cw - 12, { s: 13, c: on ? TXT : DIM, w: on ? 600 : 400 });
        });
        tx(on ? '1 gene, 3 efeitos' : '1 gene, efeitos normais', W - 12, 30, { s: 14, w: 700, c: on ? AMB : DIM, a: 'right' });
      }
      tx('desenho esquemático, fora de escala', W / 2, H - 10, { s: 12, c: DIM });
    },
    res() {
      const c = CD[st.c];
      if (st.v === 'i') return `<p><b>Interação gênica:</b> dois genes (B e E) agem na <b>mesma</b> característica, a cor do pelo do labrador. Na pleiotropia é o contrário: <b>um</b> gene, <b>várias</b> características.</p>`;
      return `<p><b>${c.n}</b>, ${c.gene}. ${st.on ? `${st.c === 'marfan' ? 'Com um alelo alterado (herança dominante)' : 'Com o alelo alterado em dose dupla (herança recessiva)'}, a proteína (${c.prot}) funciona mal em vários tecidos, e aparecem <b>3 efeitos</b>: ${c.org.map(o => o[1]).join('; ')}.` : 'Com o alelo comum, a proteína funciona e nenhum dos três órgãos tem alteração.'}</p>` + AVISO;
    }
  };
}

// ---------------------------------------------------------------- A3 herança quantitativa
function mkPoli() {
  const st = { n: 2, amb: false, curva: false, sel: 2, data: null, t0: -99, seed: 1, ma: 0 };
  const LET = 'ABCDEF';
  const pele = u => { const a = [241, 211, 179], b = [107, 67, 43]; return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], u))).join(',')})`; };
  function cruza() {
    const R = rng(777 + st.seed++ * 104729), d = [], N = 200, n = st.n;
    for (let i = 0; i < N; i++) { let k = 0; for (let j = 0; j < 2 * n; j++) if (R() < .5) k++; d.push({ k, e: (R() + R() + R() - 1.5) * 1.1 }); }
    st.data = d; st.t0 = T; st.sel = n; rst();
  }
  // monta o texto "AaBb": cada gene vira par de letras
  const gtxt = (k, modo) => { const n = st.n, c = Array(n).fill(0); if (modo === 'e') { const b = Math.floor(k / n), x = k % n; for (let i = 0; i < n; i++) c[i] = b + (i < x ? 1 : 0); } else { let r = k; for (let i = 0; i < n; i++) { c[i] = Math.min(2, r); r -= c[i]; } } return c.map((v, i) => { const U = LET[i], l = U.toLowerCase(); return v === 2 ? U + U : v === 1 ? U + l : l + l; }).join(''); };
  cruza(); st.t0 = -99;
  const lay = () => { const n = st.n, cols = 2 * n + 1, x0 = 26, cw = (W - 40) / cols, yb = H - 56, yt = 56; return { n, cols, x0, cw, yb, yt, h: yb - yt, ymax: 200 * (binom(2 * n, n) / Math.pow(4, n)) * 1.25 }; };
  const binom = (a, b) => { let r = 1; for (let i = 1; i <= b; i++) r = r * (a - b + i) / i; return Math.round(r); };
  const self = {
    ui() {
      range('Pares de genes', 1, 6, 1, () => st.n, v => { st.n = v; cruza(); }, v => String(v));
      acts('Cruzamento', [['Cruzar dois heterozigotos', () => cruza(), true]]);
      pick('Curva', [[false, 'Só as colunas'], [true, 'Mostrar curva normal']], v => st.curva === v, v => st.curva = v);
      pick('Ambiente', [[false, 'Sem ambiente'], [true, 'Somar efeito do ambiente']], v => st.amb === v, v => st.amb = v);
      range('Classe destacada', 0, 2 * st.n, 1, () => Math.min(st.sel, 2 * st.n), v => st.sel = Math.min(v, 2 * st.n), v => v + (v === 1 ? ' alelo' : ' alelos'));
      const rs = UI.querySelector('label.pick:last-child input[type=range]'); syncs.unshift(() => { rs.max = 2 * st.n; });
    },
    draw(P) {
      const L = lay(), q = fim(st.t0, 2.2), N = st.data.length;
      st.ma += ((st.amb ? 1 : 0) - st.ma) * (RM ? 1 : .12);
      // eixo
      line(L.x0 - 4, L.yb, W - 10, L.yb, LIN, 1.4);
      const cnt = Array(L.cols).fill(0), fall = [];
      st.data.forEach((d, i) => { const lt = i / N * .8; if (q >= lt + .18) cnt[d.k]++; else if (q > lt) fall.push([d, (q - lt) / .18]); });
      const ys = c => c / L.ymax * L.h;
      const bw = L.cw * .78;
      for (let k = 0; k < L.cols; k++) {
        const cx = L.x0 + (k + .5) * L.cw, u = L.cols > 1 ? k / (L.cols - 1) : .5, h = ys(cnt[k]);
        if (st.ma < .98) { X.save(); X.globalAlpha = 1 - st.ma; X.fillStyle = pele(u); X.fillRect(cx - bw / 2, L.yb - h, bw, h); X.restore(); }
        box(cx - L.cw / 2 + 1, L.yb + 22, L.cw - 2, 12, 3, pele(u), 'rgba(255,255,255,.25)', 1);
        tx(String(k), cx, L.yb + 11, { s: 12, c: k === st.sel ? AMB : DIM, w: k === st.sel ? 700 : 400 });
        if (k === Math.min(st.sel, 2 * L.n)) { X.save(); X.strokeStyle = AMB; X.lineWidth = 2; X.strokeRect(cx - L.cw / 2 + 1, L.yt, L.cw - 2, L.h + 34); X.restore(); }
      }
      if (!st.amb || st.ma < .98) fall.forEach(([d, f]) => { const cx = L.x0 + (d.k + .5) * L.cw, top = L.yb - ys(cnt[d.k]); circ(cx, lerp(L.yt - 6, top - 3, f * f), Math.min(4, L.cw * .22), pele(d.k / (L.cols - 1 || 1))); });
      if (st.ma > .02 && q > .4) { // curva contínua: ambiente espalha os valores
        const B = 4, nb = L.cols * B, hist = Array(nb).fill(0);
        st.data.forEach(d => { const v = d.k + .5 + d.e * 1.0; const b = Math.floor(v * B); if (b >= 0 && b < nb) hist[b]++; });
        let sm = hist; for (let r = 0; r < 4; r++) sm = sm.map((_, i) => (sm[i - 1] || 0) * .25 + sm[i] * .5 + (sm[i + 1] || 0) * .25);
        const g = X.createLinearGradient(L.x0, 0, L.x0 + L.cols * L.cw, 0); g.addColorStop(0, pele(0)); g.addColorStop(1, pele(1));
        X.save(); X.globalAlpha = st.ma * ss(seg(q, .4, 1)); X.beginPath(); X.moveTo(L.x0, L.yb);
        sm.forEach((v, i) => X.lineTo(L.x0 + (i + .5) / B * L.cw, L.yb - ys(v * B)));
        X.lineTo(L.x0 + L.cols * L.cw, L.yb); X.closePath(); X.fillStyle = g; X.fill(); X.restore();
      }
      if (st.curva) { X.save(); X.setLineDash([5, 4]); X.beginPath(); const s2 = L.n / 2; for (let i = 0; i <= 80; i++) { const k = -.5 + i / 80 * L.cols, z = k - L.n, v = 200 * Math.exp(-z * z / (2 * s2)) / Math.sqrt(2 * PI * s2); const px = L.x0 + (k + .5) * L.cw, py = L.yb - ys(v); i ? X.lineTo(px, py) : X.moveTo(px, py); } X.strokeStyle = AMB; X.lineWidth = 2; X.stroke(); X.restore(); }
      tx('número de alelos aditivos', W / 2, H - 9, { s: 12, c: DIM });
      tx(`${L.n} ${L.n === 1 ? 'par' : 'pares'}, ${L.cols} classes`, W - 12, 30, { s: 13, w: 700, a: 'right' });
    },
    res() {
      const n = st.n, k = Math.min(st.sel, 2 * n), ex = gtxt(k, 'e'), co = gtxt(k, 'c');
      const ext = st.data.filter(d => d.k === 2 * n).length, p4 = Math.pow(4, n);
      let h = `<p>Pares de genes: <b>${n}</b>. Fenótipos possíveis: 2n + 1 = <b>${2 * n + 1}</b>. Extremos: <b>1 em ${p4}</b> filhos de pais heterozigotos para todos os ${n} ${n === 1 ? 'par' : 'pares'}.</p>`;
      h += `<p>Neste sorteio de 200 filhos, <b>${ext}</b> ${ext === 1 ? 'tem' : 'têm'} todos os alelos aditivos (esperado ${Math.round(200 / p4 * 10) / 10 > 1 ? 'cerca de ' + Math.round(200 / p4) : 'menos de 1'}). ${n === 1 ? 'Com 1 par saem as 3 classes de 1 : 2 : 1.' : n === 2 ? 'Com 2 pares saem 5 classes na proporção 1 : 4 : 6 : 4 : 1.' : n === 3 ? 'Com 3 pares saem 7 classes, 1 : 6 : 15 : 20 : 15 : 6 : 1.' : 'Com mais pares, as colunas desenham um sino.'}</p>`;
      h += `<p>Classe com <b>${k}</b> alelos aditivos: genótipos como <span class="gt">${ex}</span>${co !== ex ? ` e <span class="gt">${co}</span> têm a mesma cor.` : '.'} Modelo escolar: na pele real há dezenas de genes, por isso a variação é contínua.</p>`;
      if (st.amb) h += '<p>Com o efeito do ambiente, cada filho se espalha um pouco e os degraus somem: é por isso que não se veem degraus na vida real.</p>';
      return h;
    }
  };
  cv.addEventListener('click', e => { if (!CURR || CURR.res !== self.res) return; const r = cv.getBoundingClientRect(), L = lay(), k = Math.floor((e.clientX - r.left - L.x0) / L.cw); if (k >= 0 && k < L.cols) { st.sel = k; rst(); refresh(); } });
  return self;
}

// ---------------------------------------------------------------- A4 sistemas de determinação do sexo
const CHR = { X: ['#8FD8FF', 38], Y: ['#C9A0FF', 24], Z: ['#FFB347', 38], W: ['#F4A6CF', 24], '0': [null, 24], n: ['#9DA9C4', 30] };
function capsule(l, x, y, sc) {
  const [c, h] = CHR[l], w = 15 * (sc || 1), hh = h * (sc || 1);
  if (!c) { X.save(); X.setLineDash([3, 3]); box(x - w / 2, y - hh / 2, w, hh, w / 2, null, 'rgba(232,237,247,.5)', 1.4); X.restore(); tx('0', x, y, { s: 12, c: DIM }); return; }
  box(x - w / 2, y - hh / 2, w, hh, w / 2, c, 'rgba(0,0,0,.35)', 1); if (l !== 'n') tx(l, x, y + .5, { s: 12, w: 700, c: '#10151f' });
}
function mkSist() {
  const SYS = {
    xy: { n: 'XY humano', mae: ['X', 'X'], pai: ['X', 'Y'], gm: ['X'], gp: ['X', 'Y'], tm: 'Mãe, XX', tp: 'Pai, XY', def: 'p', kid: (a, b) => b === 'Y' ? [false, 'XY'] : [true, 'XX'], nota: 'Quem define o sexo é o espermatozoide: X dá menina, Y dá menino.' },
    zw: { n: 'ZW galinha', mae: ['Z', 'W'], pai: ['Z', 'Z'], gm: ['Z', 'W'], gp: ['Z'], tm: 'Galinha, ZW', tp: 'Galo, ZZ', def: 'm', kid: (a, b) => a === 'W' ? [true, 'ZW'] : [false, 'ZZ'], nota: 'Nas aves é ao contrário: quem define o sexo é o óvulo, Z dá macho e W dá fêmea.' },
    x0: { n: 'X0 gafanhoto', mae: ['X', 'X'], pai: ['X', '0'], gm: ['X'], gp: ['X', '0'], tm: 'Fêmea, XX', tp: 'Macho, X0', def: 'p', kid: (a, b) => b === '0' ? [false, 'X0'] : [true, 'XX'], nota: 'O macho tem um X só (o zero indica a falta do outro) e define o sexo pelo tipo de gameta.' },
    hd: { n: 'Haplodiploidia abelha', mae: ['n', 'n', 'n', 'n'], pai: ['n', 'n'], gm: ['n'], gp: ['n'], tm: 'Rainha, 2n = 32', tp: 'Zangão, n = 16', def: 'e', nota: 'O óvulo fecundado vira fêmea diploide (2n = 32); o não fecundado vira macho haploide (n = 16).' },
    tm: { n: 'Temperatura tartaruga', nota: 'Não há cromossomo sexual: a temperatura de incubação dos ovos decide o sexo. Ovos mais quentes dão mais fêmeas.' }
  };
  const st = { s: 'xy', kids: [], fec: true, temp: 29, seed: 1 };
  const pf = t => 1 / (1 + Math.exp(-(t - 29) * 1.6));
  const novo = (f, l, d) => ({ f, l, at: RM ? -99 : T + d });
  function lote() {
    const R = rng(5150 + st.seed++ * 48611), S = SYS[st.s]; st.kids = [];
    for (let i = 0; i < 20; i++) {
      if (st.s === 'hd') { const fec = R() < .5; st.kids.push(novo(fec, fec ? '2n' : 'n', i * .07)); }
      else if (st.s === 'tm') st.kids.push(novo(R() < pf(st.temp), '', i * .07));
      else { const a = S.gm[Math.floor(R() * S.gm.length)], b = S.gp[Math.floor(R() * S.gp.length)], kk = S.kid(a, b); st.kids.push(novo(kk[0], kk[1], i * .07)); }
    }
    rst();
  }
  const build = () => {
    pick('Sistema', Object.entries(SYS).map(([k, v]) => [k, v.n]), v => st.s === v, v => { st.s = v; st.kids = []; rebuild(); });
    if (st.s === 'hd') {
      pick('Óvulo', [[true, 'Fecundado'], [false, 'Não fecundado']], v => st.fec === v, v => st.fec = v);
      acts('Pôr ovos', [['Pôr 1 ovo', () => { st.kids.push(novo(st.fec, st.fec ? '2n' : 'n', 0)); if (st.kids.length > 20) st.kids.shift(); }], ['Pôr 20 ovos', lote, true]]);
    } else if (st.s === 'tm') {
      range('Temperatura de incubação', 26, 32, .5, () => st.temp, v => st.temp = v, v => String(v).replace('.', ',') + ' °C');
      acts('Ovos', [['Chocar 20 ovos', lote, true]]);
    } else acts('Fecundação', [['Fecundar 20 vezes', lote, true]]);
  };
  const rebuild = () => { UI.innerHTML = ''; syncs.length = 0; build(); };
  return {
    ui: build,
    draw(P) {
      const S = SYS[st.s], cw = (W - 30) / 2, ch = 74, TP = 54;
      let yc = H * .56;
      if (st.s === 'tm') {
        const x0 = 44, x1 = W - 18, y0 = TP + 12, y1 = TP + 110;
        line(x0, y1, x1, y1, LIN, 1.4); line(x0, y0 - 4, x0, y1, LIN, 1.4);
        tx('100% fêmeas', x0 + 6, y0 + 6, { s: 12, c: DIM, a: 'left' }); tx('0%', x0 - 8, y1, { s: 12, c: DIM, a: 'right' });
        [26, 29, 32].forEach(t => { const px = lerp(x0, x1, (t - 26) / 6); line(px, y1, px, y1 + 4, LIN, 1.2); tx(t + ' °C', px, y1 + 15, { s: 12, c: DIM }); });
        X.beginPath(); for (let i = 0; i <= 60; i++) { const t = 26 + i / 10, px = lerp(x0, x1, i / 60), py = lerp(y1, y0, pf(t)); i ? X.lineTo(px, py) : X.moveTo(px, py); } X.strokeStyle = PNK; X.lineWidth = 3; X.stroke();
        const mx = lerp(x0, x1, (st.temp - 26) / 6), my = lerp(y1, y0, pf(st.temp));
        X.save(); X.setLineDash([4, 4]); line(mx, y1, mx, my, AMB, 1.4); line(x0, my, mx, my, AMB, 1.4); X.restore(); circ(mx, my, 6, AMB, '#10151f', 1.5);
        const dir = mx + 8 + 150 > W; tx('cerca de ' + Math.round(pf(st.temp) * 100) + '% de fêmeas', dir ? mx - 8 : mx + 8, my > (y0 + y1) / 2 ? my - 18 : my + 18, { s: 12, c: AMB, a: dir ? 'right' : 'left' });
        yc = y1 + 40;
      } else {
        [['m', 8], ['p', 14 + cw]].forEach(([w, x]) => {
          const t = w === 'm' ? S.tm : S.tp, cr = w === 'm' ? S.mae : S.pai, g = w === 'm' ? S.gm : S.gp, y = TP, def = S.def === w;
          const pulse = def && !RM ? .5 + .5 * Math.sin(T * 3) : 1;
          box(x, y, cw, ch, 10, PAN, def ? rgba(AMB, .5 + .5 * pulse) : 'rgba(255,255,255,.14)', def ? 2 : 1);
          tx(t, x + cw / 2, y + 13, { s: 13, w: 700 });
          const gp = 22; cr.forEach((l, i) => capsule(l, x + cw / 2 + (i - (cr.length - 1) / 2) * (st.s === 'hd' ? 24 : 34), y + 38, .8));
          tx(st.s === 'hd' ? (w === 'm' ? 'diploide' : 'haploide') : g.length > 1 ? 'dois tipos de gameta' : 'um só tipo de gameta', x + cw / 2, y + ch - 9, { s: 12, c: DIM });
          const gy = y + ch + 20; g.forEach((l, i) => { const gx = x + cw / 2 + (i - (g.length - 1) / 2) * 40, c = CHR[l][0]; circ(gx, gy, 13, c ? rgba(c, .9) : null, c ? 'rgba(0,0,0,.35)' : 'rgba(232,237,247,.5)', 1.3); tx(l === 'n' ? 'n' : l, gx, gy, { s: 12, w: 700, c: c ? '#10151f' : DIM }); });
          if (def) tx('este define o sexo', x + cw / 2, gy + 24, { s: 13, w: 700, c: AMB });
        });
        if (S.def === 'e') tx('o óvulo, fecundado ou não, define o sexo', W / 2, TP + ch + 46, { s: 13, w: 700, c: AMB });
        yc = TP + ch + 62;
      }
      // filhos
      const nn = 10, sx = (W - 24) / nn, r = Math.min(15, sx * .4), rows = 2;
      const ys = Math.min(H - 40 - yc, 72);
      st.kids.forEach((k, i) => {
        const cx = 12 + sx * (i % nn + .5), cy = yc + 8 + Math.floor(i / nn) * Math.max(r * 2 + 8, ys / 2), s = RM ? 1 : ss(seg(T - k.at, 0, .25));
        if (s <= 0) return;
        const rr = (st.s === 'hd' && !k.f ? r * .72 : r) * s;
        circ(cx, cy, rr, rgba(k.f ? PNK : BLU, .9), 'rgba(0,0,0,.35)', 1.2); if (k.l && s > .9) tx(k.l, cx, cy + .5, { s: 12, w: 700, c: '#10151f' });
      });
      if (!st.kids.length) tx('Toque em um botão para sortear os filhos', W / 2, yc + 30, { s: 13, c: DIM });
      const ly = H - 14; circ(W / 2 - 80, ly, 6, PNK); tx('fêmea', W / 2 - 70, ly, { s: 12, c: DIM, a: 'left' }); circ(W / 2 + 10, ly, 6, BLU); tx('macho', W / 2 + 20, ly, { s: 12, c: DIM, a: 'left' });
    },
    res() {
      const S = SYS[st.s], f = st.kids.filter(k => k.f).length, m = st.kids.length - f;
      let h = `<p><b>${S.n}.</b> ${S.nota}</p>`;
      if (st.kids.length) h += st.s === 'hd' ? `<p>${st.kids.length} ovos: <b>${f} fêmeas</b> (2n = 32) e <b>${m} machos</b> (n = 16). Cada ovo é sorteado como fecundado ou não.</p>` : `<p>${st.kids.length} filhos: <b>${f} fêmeas</b> e <b>${m} machos</b> (esperado cerca de metade de cada${st.s === 'tm' ? ` nesta temperatura: cerca de ${pr(Math.round(pf(st.temp) * 100), 100)} de fêmeas` : ''}).</p>`;
      if (st.s === 'tm') h += '<p>A curva é um exemplo: cada espécie tem a sua. Com o aquecimento global, ninhos mais quentes podem dar quase só fêmeas.</p>';
      if (st.s === 'hd') h += '<p>A rainha e as operárias são fêmeas diploides; a diferença vem da alimentação com geleia real.</p>';
      return h;
    }
  };
}

// ---------------------------------------------------------------- A5 corpúsculo de Barr
function mkBarr() {
  const KAR = { XY: ['X', 'Y'], XX: ['X', 'X'], X0: ['X'], XXY: ['X', 'X', 'Y'], XXX: ['X', 'X', 'X'] };
  const OR = '#E8892B', BK = '#383846', BR = '#F3EFE6';
  const st = { k: 'XX', cat: 'f', seed: 1, t0: -99, kt: -99 };
  const shapes = (cx, cy, s) => [[cx, cy, 70 * s, 34 * s, 0], [cx - 78 * s, cy - 14 * s, 30 * s, 26 * s, 0], [cx - 94 * s, cy - 48 * s, 8 * s, 15 * s, -.35], [cx - 62 * s, cy - 48 * s, 8 * s, 15 * s, .35], [cx + 84 * s, cy - 22 * s, 7 * s, 32 * s, .5], [cx - 30 * s, cy + 36 * s, 11 * s, 18 * s, 0], [cx + 38 * s, cy + 36 * s, 11 * s, 18 * s, 0]];
  const inside = (sh, x, y) => sh.some(([cx, cy, rx, ry, a]) => { const dx = x - cx, dy = y - cy, c = Math.cos(-a), s = Math.sin(-a), u = dx * c - dy * s, v = dx * s + dy * c; return u * u / (rx * rx) + v * v / (ry * ry) <= 1; });
  const build = () => {
    pick('Cariótipo', [['XY', 'XY <small>homem</small>'], ['XX', 'XX <small>mulher</small>'], ['X0', 'X0 <small>Turner</small>'], ['XXY', 'XXY <small>Klinefelter</small>'], ['XXX', 'XXX']], v => st.k === v, v => { st.k = v; st.kt = T; });
    pick('Filhote', [['f', 'Gata (XX)'], ['m', 'Gato (XY)']], v => st.cat === v, v => { st.cat = v; st.t0 = T; });
    acts('Embrião', [['Desenvolver embrião', () => { st.seed++; st.t0 = T; rst(); }, true]]);
  };
  const nb = () => KAR[st.k].filter(c => c === 'X').length - 1;
  return {
    ui: build,
    draw(P) {
      const narrow = W < 560, nx = 8, ny = narrow ? 54 : 8, nw = narrow ? W - 16 : W * .42, nh = narrow ? 112 : H - 16;
      box(nx, ny, nw, nh, 10, PAN1, 'rgba(255,255,255,.1)', 1);
      const rn = Math.min(narrow ? (nh - 30) / 2 : nh * .3, nw * .22, 60), cx = nx + (narrow ? nw * .22 : nw * .5), cy = ny + nh * (narrow ? .46 : .42);
      circ(cx, cy, rn, '#22305A', 'rgba(143,216,255,.7)', 2);
      const q = ss(fim(st.kt, 1.2)), chr = KAR[st.k]; let ix = 0, bi = 0; const act = chr.filter((c, i) => !(c === 'X' && chr.indexOf('X') !== i)).length;
      chr.forEach((c, i) => {
        const inact = c === 'X' && chr.indexOf('X') !== i;
        const px = cx + (ix - (act - 1) / 2) * rn * .5, py = cy;
        if (!inact) { capsule(c, px, py, rn / 55 * 1.1); ix++; }
        else { const ang = [PI * .8, PI * 1.25][bi++] || PI, bx = cx + Math.cos(ang) * (rn - 7), by = cy + Math.sin(ang) * (rn - 7), p = q; const mx = lerp(cx + rn * .15 * bi, bx, p), my = lerp(cy + rn * .35, by, p);
          if (p < .98) capsule('X', mx, my, rn / 55 * 1.1 * (1 - p * .5)); circ(mx, my, rn * .15 * p + 1, '#0a0e1a', 'rgba(255,255,255,.6)', 1.2 * p); }
      });
      const n = nb(), tx0 = narrow ? nx + nw * .42 : nx + nw / 2, ty0 = narrow ? ny + nh * .3 : cy + rn + 36;
      tx('núcleo da célula', narrow ? cx : cx, narrow ? ny + nh - 9 : cy - rn - 14, { s: 12, c: DIM });
      tx(`corpúsculos de Barr: ${n}`, tx0, ty0, { s: 14, w: 700, c: n ? AMB : TXT, a: narrow ? 'left' : 'center' });
      tx(`${chr.filter(c => c === 'X').length} X menos 1 = ${n}`, tx0, ty0 + 22, { s: 13, c: DIM, a: narrow ? 'left' : 'center' });
      if (n && q > .8) tx('mancha escura na borda', tx0, ty0 + 42, { s: 12, c: DIM, a: narrow ? 'left' : 'center' });
      // gato
      const cxx = narrow ? 8 : nx + nw + 10, cww = narrow ? W - 16 : W - cxx - 8, cy0 = narrow ? ny + nh + 8 : 8, chh = narrow ? H - cy0 - 8 : H - 16;
      box(cxx, cy0, cww, chh, 10, PAN1, 'rgba(255,255,255,.1)', 1);
      const sc = Math.min(cww / 270, (chh - 44) / 130), ccx = cxx + cww / 2 + 14 * sc, ccy = cy0 + (chh - 30) / 2 + 6 * sc, sh = shapes(ccx, ccy, sc), g = Math.max(8, 9 * sc);
      const R = rng(31337 + st.seed * 977), seeds = [], fem = st.cat === 'f';
      for (let i = 0; i < 11; i++) seeds.push([ccx + (R() - .5) * 190 * sc, ccy + (R() - .5) * 80 * sc, R() < .5]);
      const uni = R() < .5, qq = fim(st.t0, 2);
      const blanks = [[ccx - 5 * sc, ccy + 22 * sc, 36 * sc, 16 * sc], [ccx - 98 * sc, ccy - 8 * sc, 12 * sc, 9 * sc], [ccx - 28 * sc, ccy + 52 * sc, 12 * sc, 8 * sc]];
      for (let y = ccy - 80 * sc; y < ccy + 70 * sc; y += g) for (let x = ccx - 130 * sc; x < ccx + 110 * sc; x += g) {
        if (!inside(sh, x, y)) continue;
        let bd = 1e9, bc = false; seeds.forEach(s => { const d = Math.hypot(x - s[0], y - s[1]) * (.85 + .3 * (Math.sin(x * .31 + y * .17 + st.seed) * .5 + .5)); if (d < bd) { bd = d; bc = s[2]; } });
        let col = fem ? (bc ? OR : BK) : (uni ? OR : BK);
        if (fem && blanks.some(([bx, by, rx, ry]) => (x - bx) * (x - bx) / (rx * rx) + (y - by) * (y - by) / (ry * ry) <= 1)) col = BR;
        const on = qq >= 1 || bd < (qq * 150 * sc + 4);
        circ(x, y, g * .45, on ? col : 'rgba(255,255,255,.1)', col === BK && on ? 'rgba(255,255,255,.3)' : null, 1);
      }
      const ly = cy0 + chh - 14, items = fem ? [[OR, 'X laranja'], [BK, 'X preto'], [BR, 'branco: outro gene']] : [[uni ? OR : BK, 'só um X: uma cor só']];
      X.font = `400 12px ${FT}`; const ws = items.map(i => 18 + X.measureText(i[1]).width), gp = 10; let lx = cxx + (cww - ws.reduce((a, b) => a + b, 0) - gp * (items.length - 1)) / 2;
      items.forEach(([c, t], i) => { circ(lx + 6, ly, 5.5, c, 'rgba(255,255,255,.4)', 1); tx(t, lx + 16, ly, { s: 12, c: DIM, a: 'left' }); lx += ws[i] + gp; });
    },
    res() {
      const n = nb(), nx = KAR[st.k].filter(c => c === 'X').length, nm = { XY: 'homem', XX: 'mulher', X0: 'síndrome de Turner', XXY: 'síndrome de Klinefelter', XXX: 'mulher com três X' }[st.k];
      return `<p><b>${st.k}</b> (${nm}): ${nx} cromossomo${nx > 1 ? 's' : ''} X, então <b>${n}</b> corpúsculo${n === 1 ? '' : 's'} de Barr. O número depende dos X, não do sexo.</p><p>${st.cat === 'f' ? 'A gata tricolor é um mosaico: em cada grupo de células um X diferente ficou ativo. Cada clique sorteia manchas novas. O branco vem de outro gene.' : 'O gato XY tem um X só, que fica ativo em todas as células: sai de uma cor só, nunca tricolor. Gatos machos tricolores são raros e em geral XXY.'}</p>`;
    }
  };
}

// ---------------------------------------------------------------- A6 herança restrita ao Y e calvície
function face(x, y, r, bald, col, fem) {
  circ(x, y, r * 1.18, null, col, Math.max(2, r * .08));
  const skin = '#E2B896', hair = '#3B2A20';
  if (fem) { box(x - r * .98, y - r * .2, r * .38, r * 1.25, r * .19, hair); box(x + r * .6, y - r * .2, r * .38, r * 1.25, r * .19, hair); }
  if (bald) {
    circ(x, y, r, skin, 'rgba(0,0,0,.35)', 1); circ(x - r * .3, y - r * .55, r * .22, 'rgba(255,255,255,.35)');
    X.beginPath(); X.arc(x, y, r, PI * .78, PI * 1.02); X.arc(x, y, r * .8, PI * 1.02, PI * .78, true); X.closePath(); X.fillStyle = hair; X.fill();
    X.beginPath(); X.arc(x, y, r, -PI * .02, PI * .22); X.arc(x, y, r * .8, PI * .22, -PI * .02, true); X.closePath(); X.fill();
  } else {
    circ(x, y - r * .1, r * 1.04, hair); X.save(); X.beginPath(); X.ellipse(x, y + r * .16, r * .84, r * .86, 0, 0, TAU); X.fillStyle = skin; X.fill(); X.restore();
  }
  circ(x - r * .3, y + r * .06, Math.max(1.6, r * .08), '#1a1a1a'); circ(x + r * .3, y + r * .06, Math.max(1.6, r * .08), '#1a1a1a');
  X.beginPath(); X.arc(x, y + r * .35, r * .26, .15 * PI, .85 * PI); X.strokeStyle = '#7a4a38'; X.lineWidth = Math.max(1.2, r * .06); X.stroke();
}
function mkY() {
  const st = { tab: 'y', mark: false, t0: -99, fil: false, g: 'Cc', sx: 'M', seen: new Set(['Cc|M']), kids: null, seed: 1 };
  const calvo = (g, sx) => g === 'CC' || (g === 'Cc' && sx === 'M');
  const PP = [['a', 'M', 2, 0], ['b', 'F', 3, 0], ['c', 'M', 0, 1], ['d', 'F', 1, 1], ['e', 'F', 2, 1], ['f', 'M', 3, 1], ['g', 'M', 4, 1], ['h', 'F', 5, 1], ['i', 'M', 0, 2], ['j', 'F', 1, 2], ['k', 'M', 2, 2], ['l', 'F', 3, 2], ['m', 'M', 4, 2]];
  const UU = [['a', 'b', ['c', 'e', 'g']], ['c', 'd', ['i', 'j']], ['e', 'f', ['k', 'l']], ['g', 'h', ['m']]];
  const LIN_Y = { a: 0, c: 1, g: 1, i: 2, m: 2 };
  const mark = () => { st.seen.add(st.g + '|' + st.sx); };
  const build = () => {
    pick('Aba', [['y', 'Restrita ao Y'], ['c', 'Calvície']], v => st.tab === v, v => { st.tab = v; rebuild(); });
    if (st.tab === 'y') acts('Heredograma', [['Marcar o Y do avô', () => { st.mark = true; st.t0 = T; rst(); }, true], ['Testar uma filha', () => { st.fil = !st.fil; }]]);
    else {
      pick('Genótipo', [['CC', gh('CC')], ['Cc', gh('Cc')], ['cc', gh('cc')]], v => st.g === v, v => { st.g = v; mark(); });
      pick('Sexo', [['M', 'Homem'], ['F', 'Mulher']], v => st.sx === v, v => { st.sx = v; mark(); });
      acts('Cruzamento', [['Cruzar Cc × Cc (8 filhos)', () => { const R = rng(2468 + st.seed++ * 31); st.kids = []; for (let i = 0; i < 8; i++) { const a = (R() < .5 ? 'C' : 'c') + (R() < .5 ? 'C' : 'c'); st.kids.push([a === 'cC' ? 'Cc' : a, R() < .5 ? 'M' : 'F']); } rst(); }, true]]);
    }
  };
  const rebuild = () => { UI.innerHTML = ''; syncs.length = 0; build(); };
  return {
    ui: build,
    draw(P) {
      if (st.tab === 'y') {
        const t = RM ? 9 : T - st.t0, p = PP.map(([id, s, c, r]) => [id, s, st.mark && LIN_Y[id] !== undefined && t >= LIN_Y[id] * .6 ? 'af' : 'no', c, r]);
        const pos = ped({ p, u: UU }, { top: 58, bot: 34, hl: st.fil ? new Set(['e']) : null });
        const ly = H - 14; sym(W / 2 - 92, ly, 6, 'M', st.mark ? 'af' : 'no'); tx(st.mark ? 'tem o Y do avô' : 'Y do avô ainda não marcado', W / 2 - 80, ly, { s: 12, c: DIM, a: 'left' });
        if (st.fil) { const bw = 138, bx = W - bw - 6, by = pos.b[1] - 20; box(bx, by, bw, 40, 8, PAN, AMB, 1.6); para('Filha: não recebeu Y', bx + bw / 2, by + 13, bw - 12, { s: 13, c: AMB, w: 600 }); }
      } else {
        const wide = W >= 560, fr = wide ? 42 : Math.min(W * .12, 34), fx = wide ? W * .2 : W * .22, fy = 54 + fr * 1.2;
        face(fx, fy, fr, calvo(st.g, st.sx), st.sx === 'M' ? BLU : PNK, st.sx === 'F');
        tx(calvo(st.g, st.sx) ? 'calvície' : 'sem calvície', fx, fy + fr * 1.18 + 16, { s: 14, w: 700, c: calvo(st.g, st.sx) ? AMB : TXT });
        // tabela
        const tx0 = wide ? W * .42 : W * .47, tw = W - tx0 - 10, c0 = tw * .26, cw = (tw - c0) / 2, rh = wide ? 32 : 28, ty = 54;
        tx('homem', tx0 + c0 + cw * .5, ty + 8, { s: 12, c: BLU, w: 700 }); tx('mulher', tx0 + c0 + cw * 1.5, ty + 8, { s: 12, c: PNK, w: 700 });
        ['CC', 'Cc', 'cc'].forEach((g, i) => {
          const y = ty + 22 + i * rh; tx(g, tx0 + c0 / 2, y + rh / 2, { s: 14, f: FD, w: 600 });
          ['M', 'F'].forEach((s, j) => { const k = g + '|' + s, x = tx0 + c0 + cw * j, vis = st.seen.has(k), sel = st.g === g && st.sx === s; box(x + 2, y + 2, cw - 4, rh - 4, 6, vis ? PAN : PAN1, sel ? AMB : 'rgba(255,255,255,.12)', sel ? 2 : 1); tx(vis ? (calvo(g, s) ? 'calvo' : 'não calvo') : '?', x + cw / 2, y + rh / 2, { s: 12, c: vis ? (calvo(g, s) ? AMB : TXT) : DIM, w: vis ? 600 : 400 }); });
        });
        const ky = Math.max(fy + fr * 1.18 + 36, ty + 22 + rh * 3 + 18);
        if (!st.kids) tx('Toque em "Cruzar Cc × Cc" para sortear 8 filhos', W / 2, ky + 30, { s: 13, c: DIM });
        else {
          tx('filhos de Cc × Cc', 12, ky, { s: 12, c: DIM, a: 'left' });
          const kr = Math.min(16, (W - 24) / 8 * .36), sx0 = (W - 24) / 8, q = RM ? 1 : fim(st.kt || -99, 1);
          st.kids.forEach(([g, s], i) => { const x = 12 + sx0 * (i + .5), y = ky + 14 + kr * 1.3, a = RM ? 1 : ss(seg(P, i / 10, i / 10 + .35)); X.save(); X.globalAlpha = a; face(x, y, kr, calvo(g, s), s === 'M' ? BLU : PNK, s === 'F'); sym(x, y + kr * 1.18 + 12, 5, s, calvo(g, s) ? 'af' : 'no'); tx(g, x, y + kr * 1.18 + 28, { s: 12, c: DIM, f: FD }); X.restore(); });
        }
      }
    },
    res() {
      if (st.tab === 'y') return `<p>Genes do <b>Y</b> sem par no X passam do pai para <b>todos</b> os filhos homens e nunca aparecem em mulheres.${st.mark ? ' No heredograma, o Y do avô desce só pela linha paterna: filhos e netos pelo lado de filhos homens. A filha não recebeu Y, então os filhos dela não têm o Y do avô.' : ' Marque o Y do avô para ver a cor descer pela linha paterna.'}</p><p>O gene SRY, que inicia a formação dos testículos, é o exemplo mais claro.</p>` + AVISO;
      const b = calvo(st.g, st.sx), seen = ['M', 'F'].every(s => st.seen.has('Cc|' + s));
      let h = `<p><b>${gh(st.g)}, ${st.sx === 'M' ? 'homem' : 'mulher'}:</b> ${b ? 'calvície' : 'sem calvície'}. Modelo escolar: C é dominante nos homens e recessivo nas mulheres.${seen ? ' Só a linha Cc muda com o sexo: homem calvo, mulher sem calvície.' : ' Teste Cc nos dois sexos para ver a diferença.'}</p>`;
      if (st.kids) { const m = st.kids.filter(k => k[1] === 'M'), f = st.kids.filter(k => k[1] === 'F'); h += `<p>Neste sorteio: <b>${m.filter(k => calvo(...k)).length} de ${m.length}</b> meninos calvos (esperado cerca de 3/4) e <b>${f.filter(k => calvo(...k)).length} de ${f.length}</b> meninas calvas (esperado cerca de 1/4).</p>`; }
      return h + AVISO;
    }
  };
}

return { mkLetais: () => wrap(mkLetais()), mkPleio: () => wrap(mkPleio()), mkPoli: () => wrap(mkPoli()), mkSist: () => wrap(mkSist()), mkBarr: () => wrap(mkBarr()), mkY: () => wrap(mkY()) };
}
const mk = n => () => { LIB = LIB || criar(); return LIB[n](); };

window.GEN_EXTRA = (window.GEN_EXTRA || []).concat([
  { nova: { id: 'determinacao', t: 'Determinação do sexo', c: '#9FD8C8', tops: [] }, antes: 'sexo' },
  { sec: 'variacoes', depois: 'codominancia', top: { id: 'letais', t: 'Alelos letais', s: 'quando a proporção vira 2 : 1',
    d: `<p>Alguns alelos causam a morte do embrião quando estão em <b>dose dupla</b>. No camundongo, o alelo A<sup>Y</sup> deixa o pelo <b>amarelo</b> e é dominante para a cor, mas o embrião A<sup>Y</sup>A<sup>Y</sup> morre ainda no útero. Por isso ele é chamado de <b>letal recessivo</b>: só mata em homozigose.</p><p>Cruzando dois camundongos amarelos (A<sup>Y</sup>a), o quadro de Punnett prevê 1 : 2 : 1, mas a casa A<sup>Y</sup>A<sup>Y</sup> não nasce. Sobram <b>2 amarelos : 1 aguti</b> (pelo acinzentado). Em humanos, a <b>acondroplasia</b>, a forma mais comum de nanismo, segue lógica parecida: quem tem um alelo alterado do gene <b>FGFR3</b> vive normalmente, mas o homozigoto tem uma forma grave que, em geral, não sobrevive aos primeiros meses de vida.</p>` + AVISO,
    enem: `Se a prole de dois heterozigotos dá <b>2 : 1</b> em vez de 3 : 1, desconfie de um alelo letal: um quarto dos filhos morreu antes de nascer. Todos os indivíduos com o fenótipo dominante que nascem são, então, <b>heterozigotos</b>.`,
    links: [['Quadro de Punnett', '#lei1/punnett'], ['Pleiotropia', '#variacoes/pleiotropia'], ['Meiose e segregação', '../divisao-celular/index.html'], ['Equilíbrio de Hardy-Weinberg', '#populacoes/hardy-weinberg']], mk: mk('mkLetais') } },
  { sec: 'variacoes', depois: 'letais', top: { id: 'pleiotropia', t: 'Pleiotropia', s: 'um gene, vários efeitos',
    d: `<p>Na <b>pleiotropia</b>, um único gene afeta <b>várias características</b> ao mesmo tempo. Isso acontece porque a proteína que ele codifica atua em vários tecidos. É o contrário da interação gênica, em que vários genes afetam uma só característica.</p><p>Na <b>síndrome de Marfan</b>, um alelo alterado do gene da <b>fibrilina</b>, proteína do tecido conjuntivo, causa braços e dedos longos, problemas no cristalino do olho e dilatação da aorta. Na <b>fenilcetonúria</b>, a falta de uma enzima acumula fenilalanina e, sem dieta, causa deficiência intelectual e pele e cabelos mais claros. Por isso o <b>teste do pezinho</b>, feito no SUS nos primeiros dias de vida, procura essa doença.</p>` + AVISO,
    enem: `Se o enunciado descreve <b>um</b> alelo com <b>vários</b> sintomas em órgãos diferentes, a resposta é pleiotropia. Se descreve <b>vários</b> genes para <b>um</b> fenótipo, é interação gênica ou herança quantitativa.`,
    links: [['Interação gênica', '#extras/interacao'], ['Alelos letais', '#variacoes/letais'], ['O gene no DNA', '../dna/index.html']], mk: mk('mkPleio') } },
  { sec: 'extras', depois: 'interacao', top: { id: 'poligenica', t: 'Herança quantitativa', s: 'muitos genes somam efeitos',
    d: `<p>Características como <b>altura</b> e <b>cor da pele</b> não se dividem em duas ou três classes: variam de forma <b>contínua</b>. Elas dependem de vários genes, cada um com alelos <b>aditivos</b>, que somam um pouco de efeito, e de alelos que não somam nada. O ambiente também conta: a altura depende da alimentação, e a pele escurece com o sol.</p><p>No <b>modelo escolar</b> da cor da pele, há 2 genes e cada alelo aditivo acrescenta um pouco de melanina. O fenótipo depende só de <b>quantos</b> alelos aditivos a pessoa tem, de 0 a 4. Com <b>n</b> pares de genes, há <b>2n + 1</b> fenótipos, e as classes do meio são as mais comuns. Com muitos genes, o gráfico vira uma <b>curva normal</b>, em forma de sino. Na pele real há dezenas de genes envolvidos, por isso a variação humana é contínua e não se divide em grupos separados.</p>`,
    enem: `Conte os <b>alelos aditivos</b>, não as letras maiúsculas de um só gene. Para achar o número de genes, use 2n + 1 fenótipos; a classe extrema (todos aditivos) aparece com frequência (1/4)<sup>n</sup> num cruzamento de pais heterozigotos para todos os n genes.`,
    links: [['Interação gênica', '#extras/interacao'], ['Regra do E', '#probabilidade/e'], ['Di-hibridismo', '#lei2/dihibridismo']], mk: mk('mkPoli') } },
  { sec: 'determinacao', top: { id: 'sistemas', t: 'Sistemas de determinação do sexo', s: 'XY, ZW, X0 e haplodiploidia',
    d: `<p>Em muitas espécies, o sexo depende de <b>cromossomos sexuais</b>. No sistema <b>XY</b>, de mamíferos e da mosca-das-frutas, a fêmea é XX e o macho XY. O macho é <b>heterogamético</b>: produz espermatozoides com X ou com Y, e é ele quem define o sexo do filho. Em humanos, o gene <b>SRY</b>, no Y, inicia a formação dos testículos. No sistema <b>ZW</b>, de aves e borboletas, ocorre o contrário: a fêmea é ZW e o macho ZZ, e quem define o sexo é o <b>óvulo</b>.</p><p>No sistema <b>X0</b>, de gafanhotos e alguns percevejos, a fêmea é XX e o macho tem um X só (o zero indica a falta do outro). Em abelhas, formigas e vespas há <b>haplodiploidia</b>: o óvulo fecundado vira fêmea diploide e o óvulo <b>não fecundado</b> vira macho <b>haploide</b>, o zangão. Em crocodilos e em muitas tartarugas não há cromossomo sexual: a <b>temperatura</b> de incubação dos ovos decide o sexo.</p>`,
    enem: `Na espécie humana, a chance de cada filho ser menino ou menina é de cerca de 1/2, e quem determina é o <b>espermatozoide</b>. Cuidado: em aves é o contrário, e quem determina é a fêmea.`,
    links: [['Corpúsculo de Barr', '#determinacao/barr'], ['Daltonismo', '#sexo/daltonismo'], ['Meiose e segregação', '../divisao-celular/index.html']], mk: mk('mkSist') } },
  { sec: 'determinacao', top: { id: 'barr', t: 'Corpúsculo de Barr', s: 'um X desligado em cada célula',
    d: `<p>As fêmeas de mamíferos têm dois cromossomos X, e os machos só um. Para equilibrar a quantidade de produto dos genes do X, no início do embrião <b>um dos X</b> de cada célula feminina é <b>inativado</b> e fica muito condensado. Esse X compactado aparece no núcleo como uma mancha escura: o <b>corpúsculo de Barr</b>. A regra é: número de corpúsculos de Barr = número de X menos 1.</p><p>A escolha de qual X desliga é <b>ao acaso</b>, e as células-filhas mantêm a escolha. Por isso a fêmea é um <b>mosaico</b>. A gata <b>tricolor</b> mostra isso: o gene da cor laranja ou preta fica no X, e cada mancha do pelo vem de um grupo de células com um X diferente ativo. Gatos machos tricolores são raros, e em geral têm cariótipo XXY.</p>`,
    enem: `Conte os X: mulher XX tem 1 corpúsculo, homem XY tem 0, síndrome de Turner (X0) tem 0 e síndrome de Klinefelter (XXY) tem 1. Isso mostra que o corpúsculo depende do número de X, não do sexo.`,
    links: [['Sistemas de determinação do sexo', '#determinacao/sistemas'], ['Hemofilia', '#sexo/hemofilia'], ['Meiose e segregação', '../divisao-celular/index.html']], mk: mk('mkBarr') } },
  { sec: 'sexo', depois: 'hemofilia', top: { id: 'y-calvicie', t: 'Herança restrita ao Y e influenciada pelo sexo', s: 'do pai para os filhos homens, e a calvície',
    d: `<p>Genes que ficam na parte do <b>Y</b> sem correspondente no X têm <b>herança restrita ao Y</b> (holândrica). Eles passam do pai para <b>todos</b> os filhos homens e nunca aparecem em mulheres. O exemplo mais claro é o gene <b>SRY</b>; outros genes do Y atuam na produção de espermatozoides. O excesso de pelos na orelha (hipertricose auricular), exemplo antigo dos livros, hoje não tem herança restrita ao Y comprovada.</p><p>Na <b>herança influenciada pelo sexo</b>, o gene fica num cromossomo comum, mas o efeito depende dos <b>hormônios</b>. No modelo escolar da <b>calvície</b> (alopecia androgenética), o alelo C é dominante nos homens e recessivo nas mulheres: CC é calvo nos dois sexos, Cc é calvo só no homem e cc não é calvo. Na realidade a calvície envolve vários genes, inclusive um no X, e a testosterona.</p>` + AVISO,
    enem: `Num heredograma, se só homens são afetados e a característica passa de pai para <b>todos</b> os filhos homens, é restrita ao Y. Não confunda com <b>herança limitada ao sexo</b>, em que os dois sexos têm o gene mas só um o expressa, como a produção de leite em vacas.`,
    links: [['Qual é o padrão de herança?', '#heredogramas/exercicios'], ['Sistemas de determinação do sexo', '#determinacao/sistemas'], ['Daltonismo', '#sexo/daltonismo']], mk: mk('mkY') } }
]);
})();
