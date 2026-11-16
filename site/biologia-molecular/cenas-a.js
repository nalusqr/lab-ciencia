/* LAB · Biologia Molecular. Cenas: composição da célula, água, sais minerais, carboidratos. Código e textos da equipe (Apolo). */
'use strict';
const C_NA = '#C9B6FF', C_CL = '#8FE08F';

// molécula de água: O no centro, dois H a 104,5° (ang = direção da bissetriz, para o lado dos H)
function h2o(x, y, s, ang, o = {}) {
  const a1 = ang - .912, a2 = ang + .912, d = s * 1.15, hr = s * .62, al = o.a == null ? 1 : o.a;
  X.save(); X.globalAlpha *= al;
  if (o.bond) { line(x, y, x + Math.cos(a1) * d, y + Math.sin(a1) * d, 'rgba(232,237,247,.7)', 2); line(x, y, x + Math.cos(a2) * d, y + Math.sin(a2) * d, 'rgba(232,237,247,.7)', 2); }
  circ(x + Math.cos(a1) * d, y + Math.sin(a1) * d, hr, C.h, 'rgba(11,15,28,.55)', 1); circ(x + Math.cos(a2) * d, y + Math.sin(a2) * d, hr, C.h, 'rgba(11,15,28,.55)', 1);
  circ(x, y, s, C.o, 'rgba(11,15,28,.55)', 1);
  if (o.lbl) { tx('O', x, y + .5, { s: Math.max(12, s * .9), w: 700, c: '#0B0F1C', bg: false }); tx('H', x + Math.cos(a1) * d, y + Math.sin(a1) * d + .5, { s: Math.max(12, hr * .95), w: 700, c: '#0B0F1C', bg: false }); tx('H', x + Math.cos(a2) * d, y + Math.sin(a2) * d + .5, { s: Math.max(12, hr * .95), w: 700, c: '#0B0F1C', bg: false }); }
  X.restore();
  return [[x + Math.cos(a1) * d, y + Math.sin(a1) * d], [x + Math.cos(a2) * d, y + Math.sin(a2) * d]];
}
function ionB(x, y, r, c, s) { circ(x, y, r, c, 'rgba(11,15,28,.6)', 1.5); if (r >= 9) tx(s, x, y + .5, { s: 12, w: 700, c: '#0B0F1C', bg: false }); }

// ---------- pontos tocáveis (HTML) sobre os gráficos 2D, no padrão da cadeia respiratória ----------
// Cada ponto é um botão: toque, Enter ou espaço abrem o painel com nome e frase; Esc fecha. Entram em stagger de 60 ms
// (já visíveis com reduced-motion) e dão 2 pulsos de convite. A cena lê H2.sel para destacar o escolhido.
const H2 = (() => {
  const REDUZ = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let host = null, info = null, btns = [], cena = null, sel = null, aoSel = null, ultimo = '';
  function css() {
    if (document.getElementById('h2-css')) return;
    const st = document.createElement('style'); st.id = 'h2-css';
    st.textContent = `
.h2-host{position:absolute;inset:0;pointer-events:none;z-index:3}
.h2-p{position:absolute;padding:0;margin:0;border:0;background:transparent;cursor:pointer;pointer-events:auto;opacity:0;transform:scale(.6);transition:opacity 160ms cubic-bezier(.16,1,.3,1),transform 160ms cubic-bezier(.16,1,.3,1)}
.h2-p.on{opacity:1;transform:none}
.h2-p.h2-pt{width:44px;height:44px;border-radius:50%}
.h2-p.h2-pt i{position:absolute;left:50%;top:50%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:rgba(255,255,255,.92);border:2px solid rgba(11,15,28,.65);transition:background 90ms,transform 90ms}
.h2-p.h2-pt i::after{content:"";position:absolute;inset:-3px;border-radius:50%;border:1px solid rgba(255,255,255,.8);opacity:0}
.h2-p.on.h2-pt i::after{animation:h2pulso 1.2s cubic-bezier(.16,1,.3,1) 2 .4s}
.h2-p.h2-ln{border-radius:8px}
.h2-p.h2-ln i{position:absolute;inset:0;border-radius:8px;border:1px solid rgba(255,255,255,0);transition:background 90ms,border-color 90ms}
.h2-p.on.h2-ln i{animation:h2fio 1.2s cubic-bezier(.16,1,.3,1) 2 .4s}
.h2-p:hover i,.h2-p.sel i{background:rgba(255,179,71,.18);border-color:#FFB347}
.h2-p.h2-pt:hover i,.h2-p.h2-pt.sel i{background:#FFB347;transform:scale(1.25)}
.h2-p:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:-2px}
@keyframes h2pulso{from{transform:scale(1);opacity:.7}to{transform:scale(2.4);opacity:0}}
@keyframes h2fio{0%{border-color:rgba(255,255,255,0)}35%{border-color:rgba(255,255,255,.55)}100%{border-color:rgba(255,255,255,0)}}
.h2-info{position:absolute;right:16px;bottom:72px;width:min(340px,calc(100% - 32px));padding:12px 14px;border-radius:12px;background:var(--float,rgba(19,26,43,.92));border:1px solid var(--float-line,rgba(255,255,255,.08));box-shadow:var(--float-shadow,0 8px 24px rgba(0,0,0,.45));backdrop-filter:blur(8px);color:var(--txt,#E8EDF7);opacity:0;transform:translateY(8px);pointer-events:none;z-index:4;transition:opacity 160ms cubic-bezier(.7,0,.84,0),transform 160ms cubic-bezier(.7,0,.84,0)}
.h2-info.on{opacity:1;transform:none;pointer-events:auto;transition-duration:280ms;transition-timing-function:cubic-bezier(.16,1,.3,1)}
.h2-info .h{display:flex;align-items:center;gap:8px;padding-right:40px;font:600 16px/1.25 var(--f-title,system-ui)}
.h2-info .h i{width:10px;height:10px;border-radius:50%;flex:none}
.h2-info p{font-size:14px;line-height:1.45;margin:8px 0 0;color:#D3DAEA}
.h2-info .x{position:absolute;top:4px;right:4px;width:44px;height:44px;display:grid;place-items:center;border:0;border-radius:8px;background:none;color:var(--dim,#9DA9C4);cursor:pointer}
.h2-info .x:hover{color:var(--txt,#E8EDF7);background:var(--panel-2,#1B2440)}
.h2-info .x svg{width:20px;height:20px}
.h2-info .x:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
@media(max-width:699px){.h2-info{left:8px;right:8px;width:auto;top:48px;bottom:auto}}
@media(prefers-reduced-motion:reduce){.h2-p,.h2-info{transition-duration:150ms!important;transform:none}.h2-p.on.h2-pt i::after,.h2-p.on.h2-ln i{animation:none}.h2-p.h2-pt i::after{opacity:.7;inset:-2px}}`;
    document.head.appendChild(st);
  }
  function montar() {
    if (host) return;
    css(); const tela = document.getElementById('cv').parentElement;
    host = document.createElement('div'); host.className = 'h2-host'; tela.appendChild(host);
    info = document.createElement('div'); info.className = 'h2-info'; info.setAttribute('role', 'region'); info.setAttribute('aria-live', 'polite'); info.setAttribute('aria-label', 'Detalhe do ponto');
    info.innerHTML = '<div class="h"><i></i><span></span></div><p></p><button type="button" class="x" aria-label="Fechar o detalhe" title="Fechar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg></button>';
    tela.appendChild(info);
    info.querySelector('.x').addEventListener('click', () => fechar(true));
    host.addEventListener('keydown', e => { if (e.key === 'Escape') { fechar(true); e.stopPropagation(); } });
    info.addEventListener('keydown', e => { if (e.key === 'Escape') { fechar(true); e.stopPropagation(); } });
    document.addEventListener('click', e => { if (sel != null && !e.target.closest('.h2-p, .h2-info')) fechar(false); });
  }
  function fechar(foco) { const b = btns.find(q => q.d.id === sel); sel = null; if (info) info.classList.remove('on'); btns.forEach(q => q.el.classList.remove('sel')); if (foco && b) b.el.focus(); }
  function painel(d) { info.querySelector('.h i').style.background = d.cor || '#fff'; info.querySelector('.h span').textContent = d.nome; info.querySelector('p').textContent = d.frase || ''; ultimo = d.nome + '|' + d.frase; }
  function abrir(d) {
    sel = d.id; painel(d); info.classList.add('on'); btns.forEach(q => q.el.classList.toggle('sel', q.d.id === sel));
    if (aoSel) aoSel(d.id, d);
  }
  // chamada em todo quadro; lista = [{ id, x, y, nome, frase, cor, forma: 'ponto' | 'linha', w, h }]
  function pontos(chave, S, lista, op = {}) {
    montar(); aoSel = op.aoSel || null;
    if (chave !== cena) {
      cena = chave; sel = null; info.classList.remove('on'); host.innerHTML = ''; btns = [];
      lista.forEach((d, i) => {
        const el = document.createElement('button'); el.type = 'button'; el.className = 'h2-p ' + (d.forma === 'linha' ? 'h2-ln' : 'h2-pt'); el.innerHTML = '<i></i>';
        el.style.transitionDelay = (i * 60) + 'ms'; el.setAttribute('aria-label', d.nome + ': ver detalhe');
        const q = { el, d, x: -1, y: -1, w: -1, h: -1 }; el.addEventListener('click', e => { e.stopPropagation(); if (sel === q.d.id) fechar(false); else abrir(q.d); });
        host.appendChild(el); btns.push(q);
      });
    }
    const pronto = REDUZ || S.paused || S.ph > (op.atraso == null ? .6 : op.atraso);
    lista.forEach((d, i) => {
      const q = btns[i]; if (!q) return; q.d = d; const linha = d.forma === 'linha';
      const w = linha ? d.w : 44, h = linha ? d.h : 44, x = linha ? d.x : d.x - 22, y = linha ? d.y - d.h / 2 : d.y - 22;
      if (Math.abs(x - q.x) > .4 || Math.abs(y - q.y) > .4 || w !== q.w || h !== q.h) { q.x = x; q.y = y; q.w = w; q.h = h; const st = q.el.style; st.left = x.toFixed(1) + 'px'; st.top = y.toFixed(1) + 'px'; st.width = w.toFixed(1) + 'px'; st.height = h.toFixed(1) + 'px'; }
      q.el.classList.toggle('on', pronto && (d.ok == null || d.ok));
      if (sel === d.id && ultimo !== d.nome + '|' + d.frase) painel(d);
    });
  }
  function sair() { if (!host) return; sel = null; cena = null; ultimo = ''; host.innerHTML = ''; btns = []; info.classList.remove('on'); }
  return { pontos, sair, get sel() { return sel; }, set sel(v) { if (v == null) fechar(false); } };
})();

// =====================================================================================
// COMPOSIÇÃO QUÍMICA DA CÉLULA
// =====================================================================================
{
  const CL = [['água', C.aguaM], ['proteínas', C.prot], ['lipídios', C.lip], ['carboidratos', C.carb], ['ácidos nucleicos', C.na], ['sais e íons', C.sal], ['outras moléculas pequenas', '#6F7A96']];
  const FR = [
    'O solvente da vida. Dissolve íons e moléculas polares, transporta substâncias e participa das reações. É o maior componente da célula.',
    'Enzimas, transportadores, anticorpos e estruturas da célula. É o grupo orgânico mais abundante: mais da metade da massa seca.',
    'Gorduras, óleos e fosfolipídios das membranas. Também guardam energia.',
    'Açúcares e polissacarídeos. Fonte rápida de energia, com amido e glicogênio como reservas.',
    'DNA e RNA guardam e usam a informação genética. Na bactéria o RNA é abundante por causa dos muitos ribossomos.',
    'Na⁺, K⁺, Ca²⁺, Cl⁻ e outros íons. Somam cerca de 1% da massa, mas nervos, músculos e enzimas dependem deles.',
    'Aminoácidos, nucleotídeos, vitaminas e intermediários do metabolismo, em solução na célula.'
  ];
  const DADOS = [[70, 18, 5, 2, 1, 1, 3], [70, 15, 2, 3, 7, 1, 2], [0, 60, 16, 7, 5, 3, 9]];
  def('comp', 'celula', {
    t: 'Do que a célula é feita', s: 'água, proteínas, lipídios e o resto', c: C.dim, loc: 'Porcentagem da massa', still: 4,
    ctl: escolha('Célula', ['animal', 'bactéria', 'animal sem água'], 7),
    alt: 'Grade de cem quadrados coloridos mostrando a porcentagem de cada tipo de substância na massa da célula',
    d: `<p><b>Cerca de 70% da massa de uma célula é água.</b> O restante é quase todo formado por moléculas orgânicas grandes: proteínas, lipídios, carboidratos e ácidos nucleicos. Os sais minerais, na forma de íons dissolvidos, somam cerca de 1%, mas são indispensáveis.</p>
<p>As substâncias da célula se dividem em dois grupos. As <b>inorgânicas</b> (água e sais minerais) também existem fora dos seres vivos. As <b>orgânicas</b> têm esqueleto de carbono ligado a hidrogênio e são produzidas pelos seres vivos: carboidratos, lipídios, proteínas, ácidos nucleicos e vitaminas.</p>
<p>Tirando a água (a chamada <b>massa seca</b>), as <b>proteínas</b> são o grupo mais abundante: mais da metade do que sobra. Na bactéria, a parte dos ácidos nucleicos é maior, porque ela tem muitos ribossomos, ricos em RNA, para crescer depressa. Mude a célula no controle.</p>`,
    kv: [['Água', 'cerca de 70% da massa'], ['Substância orgânica mais abundante', 'proteínas'], ['Inorgânicas', 'água e sais minerais'], ['Orgânicas', 'carboidratos, lipídios, proteínas, ácidos nucleicos, vitaminas'], ['Valores', 'aproximados; variam com o tipo de célula']],
    enem: 'A prova cobra a ordem de grandeza: água é a substância mais abundante na célula, e proteínas são a orgânica mais abundante. Também cobra a classificação em inorgânicas (água e sais) e orgânicas. Cuidado com gráficos de pizza ou de barras: confira se o valor é da célula inteira ou da massa seca.',
    links: [LK.biom, LK.celula],
    init(S) { S.k = 0; S.lastV = -1; H2.sair(); },
    sair() { H2.sair(); },
    draw(t, S) {
      const A = area(), v = cl(Math.round(S.v) || 0, 0, 2), D = DADOS[v]; if (v !== S.lastV) { S.lastV = v; S.k = 0; } S.k = Math.min(3, S.k + (S.dt || .016) + (S.paused ? 3 : 0));
      const side = NAR ? Math.min(A.w * .86, A.h * .46) : Math.min(A.h * .92, A.w * .48), cs = side / 10, gx = NAR ? A.cx - side / 2 : A.x0 + A.w * .04, gy = NAR ? A.y0 + 4 : A.cy - side / 2, sel = H2.sel;
      const cells = []; D.forEach((p, i) => { for (let j = 0; j < p; j++) cells.push(i); });
      // trilho da grade e quadrados com volume; cada linha sobe com 100 ms de atraso, a coluna soma 12 ms
      rr(gx - 5, gy - 5, side + 10, side + 10, 10, 'rgba(19,26,43,.55)', C.line, 1);
      let nv = 0;
      for (let k = 0; k < 100; k++) {
        const col = k % 10, row = 9 - Math.floor(k / 10), x = gx + col * cs, y = gy + row * cs, q = cells[k] == null ? -1 : cells[k];
        const ap = ss((S.k - (Math.floor(k / 10) * .1 + col * .012)) / .3), on = k < 100 && q >= 0 && ap > 0;
        if (!on) { rr(x + 1.5, y + 1.5, cs - 3, cs - 3, 3, 'rgba(91,108,153,.16)'); continue; }
        if (ap >= 1) nv++;
        const c = CL[q][1], esc = .55 + .45 * ap, w = (cs - 3) * esc, o = (cs - w) / 2, mudo = sel != null && sel !== q;
        X.save(); X.globalAlpha = ap * (mudo ? .28 : 1);
        const g = X.createLinearGradient(x, y, x + cs, y + cs); g.addColorStop(0, light(c, .3)); g.addColorStop(.55, c); g.addColorStop(1, dark(c, .32));
        rr(x + o, y + o, w, w, 3.5, g, sel === q ? '#fff' : 'rgba(11,15,28,.45)', sel === q ? 2 : 1);
        rr(x + o + 2, y + o + 1.5, w - 4, Math.max(2, w * .28), 2, 'rgba(255,255,255,.2)');
        X.restore();
      }
      // legenda com valores; cada linha é um ponto tocável
      const lx = NAR ? A.x0 + 6 : gx + side + A.w * .06, lh = NAR ? 26 : 34, ly = NAR ? gy + side + 26 : A.cy - CL.length * lh / 2 + lh / 2, colW = NAR ? A.w / 2 : 0, lw = NAR ? colW - 6 : A.w * .36 + 28, pts = [];
      CL.forEach(([nome, c], i) => {
        const x = NAR ? lx + (i % 2) * colW : lx, y = NAR ? ly + Math.floor(i / 2) * lh : ly + i * lh, on = D[i] > 0, mudo = sel != null && sel !== i, ap = ss((S.k - .3 - i * .06) / .25);
        X.save(); X.globalAlpha = ap * (mudo ? .45 : 1);
        if (sel === i) rr(x - 6, y - lh / 2 + 1, lw, lh - 2, 8, rgba(c, .16), c, 1.5);
        rr(x, y - 7, 14, 14, 3, on ? c : 'rgba(91,108,153,.3)');
        tx(NAR && nome.length > 16 ? 'outras pequenas' : nome, x + 22, y, { a: 'left', s: NAR ? 12 : 14, w: 600, c: on ? C.txt : C.dim, bg: false });
        tx(D[i] + ' %', NAR ? x + colW - 14 : x + A.w * .36, y, { a: 'right', f: FD, s: NAR ? 12 : 14, w: 500, c: on ? C.txt : C.dim, bg: false });
        X.restore();
        pts.push({ id: i, forma: 'linha', x: x - 6, y, w: lw, h: lh - 2, nome: nome.charAt(0).toUpperCase() + nome.slice(1) + ', ' + D[i] + ' %', frase: FR[i], cor: c });
      });
      H2.pontos('celula', S, pts, { atraso: .9 });
      if (!NAR) { tx('cada quadrado = 1% da massa', gx + side / 2, gy + side + 20, { s: 12, c: C.dim, bg: false }); tx('inorgânicas: água e sais; orgânicas: as demais', lx, ly + CL.length * lh - lh / 2 + 14, { a: 'left', s: 12, c: C.dim, bg: false }); tx('toque numa linha para ver o detalhe', lx, ly + CL.length * lh - lh / 2 + 34, { a: 'left', s: 12, c: C.dim, bg: false }); }
      else { tx('cada quadrado = 1% da massa', A.cx, ly + 4 * lh + 4, { s: 12, c: C.dim, bg: false }); tx('toque numa linha para ver o detalhe', A.cx, ly + 4 * lh + 22, { s: 12, c: C.dim, bg: false }); }
      cap(v === 0 ? 'Célula animal: cerca de 70% de água e 18% de proteínas' : v === 1 ? 'Bactéria: ácidos nucleicos chegam a cerca de 7% (muito RNA nos ribossomos)' : 'Massa seca da célula animal: as proteínas são cerca de 60% do que sobra');
    }
  });
}
{
  const MASSA = [['O', 65], ['C', 18.5], ['H', 9.5], ['N', 3.2], ['Ca', 1.5], ['P', 1], ['K', .4], ['S', .3], ['Na', .2], ['Cl', .2], ['Mg', .1]];
  const ATOMOS = [['H', 62], ['O', 24], ['C', 12], ['N', 1.1], ['Ca', .22], ['P', .22], ['K', .03], ['S', .04], ['Na', .04], ['Cl', .02], ['Mg', .01]];
  const COR = { O: C.o, C: C.c, H: C.h, N: C.n, P: C.p, S: C.s, Ca: '#D6DCE8', K: '#C79BFF', Na: C_NA, Cl: C_CL, Mg: '#8FD18F' };
  const NOME = { O: 'Oxigênio', C: 'Carbono', H: 'Hidrogênio', N: 'Nitrogênio', Ca: 'Cálcio', P: 'Fósforo', K: 'Potássio', S: 'Enxofre', Na: 'Sódio', Cl: 'Cloro', Mg: 'Magnésio' };
  const FR = {
    O: 'Está na água e em quase toda molécula orgânica. Por massa é o elemento mais abundante do corpo, porque a água pesa muito e o átomo de oxigênio é pesado.',
    C: 'Faz quatro ligações e forma cadeias, anéis e ramificações: é o esqueleto de todas as moléculas orgânicas.',
    H: 'Há dois em cada molécula de água e muitos em toda molécula orgânica. Por número de átomos é o mais abundante, mas pesa pouco.',
    N: 'Está nos aminoácidos das proteínas e nas bases nitrogenadas do DNA e do RNA.',
    Ca: 'Forma ossos e dentes e participa da contração muscular e da coagulação do sangue.',
    P: 'Está no DNA, no RNA, no ATP e nos fosfolipídios das membranas, e também nos ossos.',
    K: 'Íon K⁺ é o principal cátion dentro das células e participa do impulso nervoso.',
    S: 'Está nos aminoácidos cisteína e metionina; as pontes dissulfeto ajudam a manter a forma das proteínas.',
    Na: 'Íon Na⁺ fica sobretudo fora das células, controla o equilíbrio da água e participa do impulso nervoso.',
    Cl: 'Íon Cl⁻ acompanha o sódio nos líquidos do corpo e forma o ácido clorídrico do suco gástrico.',
    Mg: 'Fica no centro da clorofila e ajuda muitas enzimas e o ATP a funcionar.'
  };
  def('comp', 'elementos', {
    t: 'Elementos químicos do corpo', s: 'C, H, O, N, P e S', c: C.dim, loc: 'Corpo humano', still: 6,
    ctl: escolha('Contar por', ['massa', 'número de átomos'], 8),
    alt: 'Barras com a porcentagem de cada elemento químico no corpo humano, por massa ou por número de átomos',
    d: `<p><b>Seis elementos formam quase toda a matéria viva: carbono, hidrogênio, oxigênio, nitrogênio, fósforo e enxofre</b> (o grupo "CHONPS"). Eles somam cerca de 98% da massa do corpo humano.</p>
<p>Por massa, o <b>oxigênio</b> lidera, porque está na água, que é a maior parte do corpo, e o átomo de oxigênio é pesado. Por número de átomos, o <b>hidrogênio</b> lidera: há dois em cada molécula de água e muitos em toda molécula orgânica. Troque a contagem no controle.</p>
<p>O <b>carbono</b> é a base das moléculas orgânicas: faz quatro ligações e forma cadeias longas, anéis e ramificações. Outros elementos aparecem em quantidade pequena, mas sem eles a vida para: cálcio, potássio, sódio, cloro, magnésio e, em traços, ferro, iodo e zinco. São esses que chegam ao corpo como <b>sais minerais</b>.</p>`,
    kv: [['Mais abundante em massa', 'oxigênio (cerca de 65%)'], ['Mais abundante em átomos', 'hidrogênio (cerca de 62%)'], ['C, H, O, N, P, S', 'cerca de 98% da massa'], ['Elementos-traço', 'ferro, iodo, zinco, cobre, flúor e outros']],
    enem: 'Questões com gráficos da composição do corpo pedem cuidado com a unidade: "porcentagem em massa" e "porcentagem em número de átomos" dão ordens diferentes. A ideia de que o carbono forma o esqueleto das moléculas orgânicas também aparece com frequência.',
    links: [['Tabela periódica', '../tabela-periodica/index.html'], LK.biom],
    init(S) { S.k = 0; S.lastV = -1; H2.sair(); },
    sair() { H2.sair(); },
    draw(t, S) {
      const A = area(), v = Math.round(S.v), D = v ? ATOMOS : MASSA; if (v !== S.lastV) { S.lastV = v; S.k = 0; } S.k = Math.min(4, S.k + (S.dt || .016) + (S.paused ? 4 : 0));
      const bh = Math.min(28, (A.h - 20) / D.length - 8), gap = (A.h - 10) / D.length, tw0 = NAR ? 32 : 40, x0 = A.x0 + (NAR ? 46 : 70), w = A.w - (NAR ? 46 : 70) - (NAR ? 64 : 112), sel = H2.sel, pts = [];
      D.forEach(([el, p], i) => {
        const y = A.y0 + 6 + i * gap, ch = 'CHONPS'.includes(el) && el.length === 1, c = COR[el], mudo = sel != null && sel !== i;
        // cada barra entra com 90 ms de atraso em relação à de cima; o ponto na ponta é o marcador que acompanha o valor
        const e = ss((S.k - .15 - i * .09) / .9), f = e * p / 70, bx = x0 + Math.max(3, w * f);
        X.save(); X.globalAlpha = (.25 + .75 * ss((S.k - i * .09) / .25)) * (mudo ? .4 : 1);
        if (sel === i) rr(x0 - (NAR ? 46 : 74), y - 4, A.w - (NAR ? 40 : 60), bh + 8, 8, rgba(c, .12), c, 1.5);
        // ficha do elemento: esfera com a cor CPK
        const r = bh / 2 + 3, cx = x0 - (NAR ? 24 : 36), cy = y + bh / 2, gs = X.createRadialGradient(cx - r * .35, cy - r * .4, r * .1, cx, cy, r); gs.addColorStop(0, light(c, .55)); gs.addColorStop(.55, c); gs.addColorStop(1, dark(c, .4));
        circ(cx, cy, r, gs, ch ? '#fff' : 'rgba(11,15,28,.5)', ch ? 1.8 : 1);
        tx(el, cx, cy + .5, { s: 13, w: 700, c: '#0B0F1C', bg: false });
        // trilho fundo e barra com volume
        rr(x0, y, w, bh, bh / 2, 'rgba(11,15,28,.5)', 'rgba(91,108,153,.28)', 1);
        const bw = bx - x0, g = X.createLinearGradient(0, y, 0, y + bh); g.addColorStop(0, light(c, .35)); g.addColorStop(.45, c); g.addColorStop(1, dark(c, .35));
        rr(x0, y, bw, bh, Math.min(bh / 2, bw / 2), g); if (bw > 10) rr(x0 + 3, y + 2, bw - 6, Math.max(2, bh * .22), 2, 'rgba(255,255,255,.24)');
        circ(bx, y + bh / 2, 4.5, '#fff', 'rgba(11,15,28,.55)', 1.5);
        const val = p * e; tx(nbr(val, p < 1 ? 2 : 1).replace(/,0$/, '') + ' %', bx + 12, y + bh / 2, { a: 'left', f: FD, s: 13, w: 500, c: C.txt, bg: false });
        X.restore();
        pts.push({ id: i, forma: 'linha', x: x0 - (NAR ? 46 : 74), y: y + bh / 2, w: A.w - (NAR ? 40 : 60), h: Math.max(34, gap - 2), nome: NOME[el] + ' (' + el + '), ' + nbr(p, p < 1 ? 2 : 1).replace(/,0$/, '') + ' %' + (v ? ' dos átomos' : ' da massa'), frase: FR[el], cor: c });
      });
      H2.pontos('elementos', S, pts, { atraso: 1 });
      if (!NAR) tx('contorno branco: C, H, O, N, P e S. Toque numa barra para ver o detalhe', A.x1 - 4, A.y1 - 4, { a: 'right', s: 12, c: C.dim, bg: false });
      cap(v ? 'Por número de átomos, o hidrogênio lidera: 62 de cada 100 átomos do corpo' : 'Por massa, o oxigênio lidera (cerca de 65%), seguido do carbono (cerca de 18,5%)');
    }
  });
}

// ---------- água em 3D (mol3d.js): uma molécula central e 4 vizinhas em arranjo tetraédrico, como no gelo ----------
const v3 = {
  s: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], k: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
  n: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
  x: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
};
const OH = .9584, HOH = 104.45 * PI / 180, OO = 2.8;
// uma molécula de água: O em o, H nas direções u1 e u2; devolve os índices [O, H1, H2]
function agua3d(M, o, u1, u2, op = {}) {
  const O = M.atomo('O', o, Object.assign({ no: op.no, grupo: op.grupo }, op.O || {}));
  const H1 = M.atomo('H', v3.s(o, v3.k(u1, OH)), Object.assign({ no: op.no, grupo: op.grupo }, op.H || {}));
  const H2 = M.atomo('H', v3.s(o, v3.k(u2, OH)), Object.assign({ no: op.no, grupo: op.grupo }, op.H2 || op.H || {}));
  M.ligacao(O, H1); M.ligacao(O, H2); return [O, H1, H2];
}
// segunda direção de H a 104,5° de u, girando no plano de u e p
const hdir2 = (u, p) => { const q = v3.n(v3.x(v3.x(u, p), u)); return v3.n(v3.s(v3.k(u, Math.cos(HOH)), v3.k(q, Math.sin(HOH)))); };
const AG = { viz: [] };
function agua3dMontar(M) {
  const h = HOH / 2, h1 = [Math.sin(h), -Math.cos(h), 0], h2 = [-Math.sin(h), -Math.cos(h), 0], lp1 = v3.n([0, .577, .816]), lp2 = v3.n([0, .577, -.816]);
  M.grupo('central', { nome: 'Molécula de água', cor: C.aguaM, frase: 'Um oxigênio preso a dois hidrogênios por ligações covalentes, em ângulo de cerca de 104,5°. O lado do oxigênio é negativo e o dos hidrogênios, positivo.' });
  const c = agua3d(M, [0, 0, 0], h1, h2, { grupo: 'central',
    O: { nome: 'Oxigênio (δ⁻)', frase: 'Puxa para si os elétrons das ligações com os hidrogênios e fica com carga parcial negativa.', rotulo: 'oxigênio δ⁻', prio: 0 },
    H: { nome: 'Hidrogênio (δ⁺)', frase: 'Perde parte dos elétrons para o oxigênio e fica com carga parcial positiva.', rotulo: 'hidrogênio δ⁺', prio: 1 },
    H2: { nome: 'Hidrogênio (δ⁺)', frase: 'Perde parte dos elétrons para o oxigênio e fica com carga parcial positiva.' } });
  AG.viz = [];
  // 2 vizinhas recebem os H da central (no O delas) e 2 doam um H ao O da central
  [[h1, 'rec'], [h2, 'rec'], [lp1, 'doa'], [lp2, 'doa']].forEach(([d, tipo], j) => {
    const o = v3.k(d, OO), id = 'v' + j, no = M.no(id, { origem: o });
    M.grupo(id, { nome: 'Molécula vizinha', cor: C.aguaM, frase: tipo === 'rec' ? 'Recebe no seu oxigênio (δ⁻) um hidrogênio da molécula central.' : 'Oferece um dos seus hidrogênios (δ⁺) ao oxigênio da molécula central.' });
    let w, ponte;
    if (tipo === 'rec') { const p = j ? [0, 0, -1] : [0, 0, 1], u1 = v3.n(v3.s(v3.k(d, Math.cos(h)), v3.k(p, Math.sin(h)))), u2 = v3.n(v3.s(v3.k(d, Math.cos(h)), v3.k(p, -Math.sin(h)))); w = agua3d(M, o, u1, u2, { no: id, grupo: id }); ponte = M.ponteH(c[j + 1], w[0], { k: 0 }); }
    else { const u1 = v3.k(d, -1), u2 = hdir2(u1, j === 2 ? [1, 0, 0] : [-1, 0, 0]); w = agua3d(M, o, u1, u2, { no: id, grupo: id }); ponte = M.ponteH(w[1], c[0], { k: 0 }); }
    if (j === 0) M.rotulo(ponte, 'ligação de hidrogênio', 2);
    AG.viz.push({ no, d, ponte });
  });
  M.vista = { th: -.55, fi: .32, zoom: 1 };
}
function agua3dAnimar(M, P) {
  M.enquadrar([.5, .92, 1.15][P.passo]);
  AG.viz.forEach((v, j) => {
    let e, k;
    if (j === 0) { e = P.passo === 0 ? 0 : P.passo === 1 ? P.entre(0, 1) : 1; k = P.passo === 0 ? 0 : P.passo === 1 ? P.linear(.8, 1.4) : 1; }
    else { const d = .35 * (j - 1); e = P.passo < 2 ? 0 : P.entre(.15 + d, 1.15 + d); k = P.passo < 2 ? 0 : P.linear(1 + d, 1.6 + d); }
    v.no.pos = v3.k(v.d, 3.2 * (1 - e)); v.no.rot = [0, 1.1 * (1 - e), .5 * (1 - e)]; v.no.esc = cl(e * 4, 0, 1); v.ponte.k = k;
  });
}

// =====================================================================================
// ÁGUA
// =====================================================================================
{
  const N = 30, R0 = rng(77), base = [], ice = [];
  for (let i = 0; i < N; i++) base.push([(i % 6) + (R0() - .5) * .5 + (Math.floor(i / 6) % 2) * .3, Math.floor(i / 6) + (R0() - .5) * .5, R0() * TAU, R0() * TAU, .6 + R0()]);
  // gelo: rede de hexágonos, mais espaçada
  for (let i = 0; i < N; i++) { const col = i % 6, row = Math.floor(i / 6); ice.push([col * 1.08 + (row % 2) * .54, row * 1.22 + (col % 2) * .32, (row % 2 ? -1 : 1) * PI / 2 + (col % 2) * .5]); }
  def('agua', 'molecula', MOL3D.cena({
    t: 'Polaridade e ligações de hidrogênio', s: 'por que o gelo flutua', c: C.aguaM, loc: 'Moléculas de água em 3D', still: 2,
    ctl: escolha('Passo', ['1 molécula', 'a ligação', '4 vizinhas'], 6),
    montar: agua3dMontar, animar: agua3dAnimar,
    legenda: P => ['A água é angular: o oxigênio fica com carga parcial negativa (δ⁻) e os hidrogênios, positiva (δ⁺)', 'O hidrogênio de uma molécula atrai o oxigênio da vizinha: surge a ligação de hidrogênio', 'Cada molécula faz até 4 ligações de hidrogênio; no gelo essa rede fica fixa e aberta, por isso ele flutua'][P.passo],
    alt: 'Moléculas de água ligadas por ligações de hidrogênio; abaixo de zero grau elas formam uma rede aberta de gelo que ocupa mais volume',
    d: `<p><b>A molécula de água é polar.</b> O oxigênio atrai os elétrons das ligações com mais força do que o hidrogênio. Por isso o lado do oxigênio fica com carga parcial negativa (δ⁻) e os hidrogênios ficam com carga parcial positiva (δ⁺). Como a molécula é angular (cerca de 104,5°), as cargas não se anulam.</p>
<p>O hidrogênio de uma molécula é atraído pelo oxigênio da vizinha: é a <b>ligação de hidrogênio</b>, mais fraca do que uma ligação covalente, mas muito numerosa. Na água líquida, essas ligações se formam e se desfazem o tempo todo.</p>
<p>Abaixo de 0&nbsp;°C, cada molécula fica presa a quatro vizinhas numa rede hexagonal aberta. O gelo ocupa mais volume e é <b>menos denso</b> do que a água líquida (0,92 contra 1,00&nbsp;g/cm³). Por isso ele flutua, e lagos congelam de cima para baixo: a camada de gelo isola a água de baixo, onde a vida continua.</p>`,
    kv: [['Ângulo H–O–H', 'cerca de 104,5°'], ['Densidade do gelo', '0,92 g/cm³'], ['Densidade da água a 4 °C', '1,00 g/cm³ (a maior)'], ['Ligações por molécula no gelo', '4 ligações de hidrogênio']],
    enem: 'A polaridade e as ligações de hidrogênio explicam quase todas as propriedades da água que caem na prova: alto calor específico, coesão, capilaridade, ação como solvente e o gelo que flutua. Use o termo "ligação de hidrogênio" (o nome antigo "ponte de hidrogênio" ainda aparece em livros).',
    links: [LK.mol, ['Tabela periódica', '../tabela-periodica/index.html']],
    // desenho plano antigo: só aparece se o 3D não abrir neste navegador
    plano(t, S0) {
      const S = Object.assign({}, S0, { v: [25, 25, -10][Math.round(S0.v)] || 25 });
      const A = area(), T = S.v, k = ss((1 - T) / 3), jit = (T + 25) / 125;
      const bw = NAR ? A.w * .92 : A.w * .56, s = Math.min(bw / 7.4, (A.h - (NAR ? 150 : 40)) / 7.6), ox = NAR ? A.cx - bw / 2 : A.x0 + 10, bot = A.y1 - 8;
      // recipiente
      const topLiq = bot - s * 5.6, topIce = bot - s * 6.6, lev = lerp(topLiq, topIce, k);
      rr(ox, lev - 6, bw, bot - lev + 6, 10, rgba(C.aguaM, .1 + .06 * k)); poly([[ox, A.y0 + (NAR ? 120 : 10)], [ox, bot], [ox + bw, bot], [ox + bw, A.y0 + (NAR ? 120 : 10)]], C.line, 2);
      line(ox + 2, lev - 6, ox + bw - 2, lev - 6, rgba(C.aguaM, .9), 2);
      tx(k > .5 ? 'nível do gelo' : 'nível da água', ox + bw - 8, lev - 18, { a: 'right', s: 12, c: light(C.aguaM, .4) });
      const P = [];
      for (let i = 0; i < N; i++) {
        const b = base[i], e = ice[i], m = 1 + jit * 1.5;
        const lx = ox + s * .8 + b[0] * s * 1.05 + Math.sin(t * 1.3 * m + b[2]) * s * .22 * jit * 2, ly = bot - s * .7 - b[1] * s * 1.0 + Math.cos(t * 1.1 * m + b[3]) * s * .22 * jit * 2;
        const ix = ox + s * .8 + e[0] * s * 1.05, iy = bot - s * .7 - e[1] * s * 1.0 * 1.0;
        const x = lerp(lx, ix, k), y = lerp(ly, iy, k), a = lerp(b[2] + t * b[4] * jit * 1.6, e[2], k); P.push([x, y, a]);
      }
      // ligações de hidrogênio entre vizinhas próximas (oscilam no líquido)
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const d = Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]); if (d > s * 1.45) continue;
        const flick = k > .5 ? 1 : (Math.sin(t * 3 + i * 1.7 + j * 2.3) > -.2 + jit * .5 ? 1 : 0); if (!flick) continue;
        line(P[i][0], P[i][1], P[j][0], P[j][1], 'rgba(143,216,255,.55)', 1.5, [2, 3]);
      }
      P.forEach(p => h2o(p[0], p[1], s * .26, p[2]));
      // molécula ampliada
      const zx = NAR ? A.cx : A.x0 + A.w * .8, zy = NAR ? A.y0 + 54 : A.y0 + A.h * .3, zs = NAR ? 15 : 24;
      const [h1, h2] = h2o(zx, zy, zs, PI / 2, { bond: true, lbl: true });
      tx('δ⁻', zx, zy - zs - 12, { s: 15, w: 700, c: light(C.o, .3) }); tx('δ⁺', h1[0] + (NAR ? 20 : 26), h1[1] + 6, { s: 15, w: 700, c: C.h }); tx('δ⁺', h2[0] - (NAR ? 20 : 26), h2[1] + 6, { s: 15, w: 700, c: C.h });
      if (!NAR) { tx('104,5°', zx, zy + zs * 2.2, { f: FD, s: 13, w: 500, c: C.dim }); tl(['molécula polar:', 'o oxigênio puxa os elétrons'], zx, zy + zs * 2.2 + 28, { c: C.txt }); tl([k > .5 ? 'gelo: rede aberta,' : 'água líquida: ligações', k > .5 ? 'menos denso, flutua' : 'que se formam e se desfazem'], zx, A.y1 - 80, { c: C.dim }); }
      lab(P[13][0], P[13][1], NAR ? P[13][0] + 30 : ox + bw + 20, NAR ? A.y0 + 110 : P[13][1] - s * 1.6, 'ligação de hidrogênio');
      cap(T < 1 ? 'Gelo: cada molécula presa a 4 vizinhas numa rede hexagonal aberta; ocupa mais volume e flutua' : T > 90 ? 'Perto da fervura as moléculas se agitam muito, e as ligações de hidrogênio duram menos' : 'Água líquida: as ligações de hidrogênio se formam e se desfazem o tempo todo');
    }
  }));
}

// figuras de IA (figura-ia.js): tubos na água (A) e detalhe do menisco (B); os scripts das imagens só carregam quando a cena abre
const CAP_FIG = window.LAB_FIGIA ? LAB_FIGIA({
  nome: 'Tubos de vidro na água e detalhe do menisco', mask: { miolo: .74, borda: 1 },
  vistas: [{ id: 'a', img: 'biologia-molecular-agua-capilaridade-a', nome: 'Tubos' }, { id: 'b', img: 'biologia-molecular-agua-capilaridade-b', nome: 'Menisco' }],
  hs: [
    { id: 'largo', c: C.aguaM, em: { a: [31.5, 40] }, t: 'Tubo largo, 2 mm de diâmetro', d: 'A água sobe pouco, cerca de 1,5 cm: a coluna é larga e pesada para a força de adesão que a puxa.', z: 2.2 },
    { id: 'medio', c: C.aguaM, em: { a: [52.5, 36] }, t: 'Tubo médio, 1 mm de diâmetro', d: 'Com metade do diâmetro, a água sobe o dobro, cerca de 3 cm.', z: 2.4 },
    { id: 'fino', c: C.aguaM, em: { a: [70, 20] }, t: 'Tubo fino', d: 'Quanto mais fino o tubo, mais alto a água sobe. Mude o diâmetro no controle e veja a altura mudar.', z: 2.6 },
    { id: 'cuba', c: '#8FD8FF', em: { a: [20, 80] }, t: 'Água na cuba', d: 'Fora dos tubos a superfície é plana: ali a adesão não puxa a água para cima.', z: 1.8 },
    { id: 'menisco', c: C.aguaM, em: { b: [50, 57] }, t: 'Menisco', d: 'A superfície se curva para cima junto ao vidro, porque a adesão da água ao vidro é maior do que a coesão entre as moléculas.', z: 2.6 },
    { id: 'adesao', c: '#FFB347', em: { b: [37.5, 49] }, t: 'Adesão', d: 'As moléculas de água se ligam às paredes polares do vidro e sobem por elas.', z: 3 },
    { id: 'coesao', c: '#8FD8FF', em: { b: [50, 50.5] }, t: 'Coesão', d: 'As ligações de hidrogênio entre as moléculas arrastam o resto da coluna atrás das que sobem pela parede.', z: 3 }
  ]
}) : null;
def('agua', 'capilaridade', {
  t: 'Coesão, adesão e capilaridade', s: 'a água sobe em tubos finos', c: C.aguaM, loc: 'Tubos capilares de vidro', still: 6,
  ctl: { l: 'Diâmetro do tubo', min: .2, max: 2, step: .1, v: .6, f: v => nbr(v, 1) + ' mm', rate: () => 1 },
  alt: 'Três tubos finos mergulhados na água; a água sobe mais no tubo mais fino',
  d: `<p><b>Coesão</b> é a atração entre moléculas de água, graças às ligações de hidrogênio. Ela cria a <b>tensão superficial</b>: a superfície se comporta como uma película, que sustenta insetos como o gerris e forma gotas.</p>
<p><b>Adesão</b> é a atração entre a água e outras superfícies polares, como o vidro ou a parede de celulose das plantas. Num tubo fino, a adesão puxa a água pela parede e a coesão arrasta o resto da coluna: é a <b>capilaridade</b>. Quanto mais fino o tubo, mais alto a água sobe. Mude o diâmetro no controle.</p>
<p>Nas plantas, a capilaridade ajuda a água a molhar paredes e vasos, mas não explica sozinha a subida até o alto de uma árvore. O que puxa a água no xilema é a <b>transpiração</b> das folhas, e a coesão mantém a coluna contínua (teoria da coesão e tensão).</p>`,
  kv: [['Coesão', 'água atrai água'], ['Adesão', 'água atrai outras superfícies polares'], ['Altura no capilar', 'inversamente proporcional ao diâmetro'], ['Exemplos', 'papel absorvente, solo úmido, tensão superficial']],
  enem: 'A coesão entre moléculas de água, somada à transpiração, explica a subida da seiva bruta no xilema; essa ligação com a fisiologia vegetal é frequente. Também caem tensão superficial (inseto sobre a água, detergente que a reduz) e a capilaridade no solo.',
  links: [LK.mol],
  draw(t, S) {
    const A = area(), d = S.v, hmm = 29.7 / d;
    if (CAP_FIG) CAP_FIG.desenhar(X, { x: A.x0, y: A.y0, w: A.w, h: A.h }, {
      sobre(R) {
        if (R.vista === 'a') {
          // a água sobe nos três tubos; o fino chega mais alto. Altura em % da figura: cerca de 26 dividido pelo diâmetro (mm)
          const p = S.paused ? 3 : fr(t / 8) * 8, rise = S.paused ? 1 : ss(seg(p, .4, 3.8)), al = S.paused ? 1 : 1 - ss(seg(p, 6.6, 7.6)), y0 = 73;
          const TB = [{ x: 31.5, hw: 5.2, ym: 58, mm: 2, cm: 1.5, lado: 1 }, { x: 52.5, hw: 2.6, ym: 46, mm: 1, cm: 3, lado: 1 }, { x: 70, hw: .9, ym: y0 - Math.min(62, 26 / d), mm: d, cm: hmm / 10, lado: -1 }];
          TB.forEach((b, i) => {
            const [px, py0] = R.pt(b.x, y0), [, pym] = R.pt(b.x, b.ym), yy = lerp(py0, pym, rise), hw = Math.max(2.5, R.s * b.hw);
            X.save(); X.globalAlpha *= al;
            const g = X.createLinearGradient(0, py0, 0, pym); g.addColorStop(0, rgba(C.aguaM, .08)); g.addColorStop(1, rgba(C.aguaM, .5)); X.fillStyle = g; X.fillRect(px - hw, yy, hw * 2, py0 - yy);
            X.strokeStyle = light(C.aguaM, .55); X.lineWidth = 2; X.beginPath(); X.moveTo(px - hw - 3, yy); X.lineTo(px + hw + 3, yy); X.stroke();
            for (let k = 0; k < 3; k++) { const f = fr(t * .5 + k / 3 + i * .2), by = lerp(py0, yy, f); circ(px + Math.sin(k * 2.1 + i) * hw * .5, by, Math.max(1.5, hw * .22), rgba('#FFFFFF', .6 * Math.sin(f * PI))); }
            if (rise > .15) { X.save(); X.globalAlpha *= ss(seg(rise, .15, .6)); const lx = Math.min(R.pt(80, 0)[0], R.x + R.w - tw('cerca de 5,0 cm', 13, 500, FD) - 6); line(px + hw + 4, yy, lx - 6, yy, 'rgba(207,224,255,.35)', 1, [3, 4]); tx('cerca de ' + nbr(b.cm, 1) + ' cm', lx, yy, { s: 13, f: FD, w: 500, c: C.txt, a: 'left' }); X.restore(); }
            X.restore();
            const [lx, ly] = R.pt(b.x, 4.5); tx(nbr(b.mm, 1) + ' mm', lx, ly, { s: 13, f: FD, w: 500, c: i === 2 ? C.txt : C.dim });
          });
        } else {
          // menisco: as moléculas que tocam o vidro sobem (adesão) e arrastam as vizinhas (coesão)
          const N = 6, s = cl(R.s * 1.5, 7, 20), P = [];
          for (let i = 0; i < N; i++) { const x = 39.5 + i * (21 / (N - 1)), y = 49.5 + 7.5 * (1 - Math.pow((x - 50) / 11.5, 2)), [px, py] = R.pt(x, y); P.push([px, py + Math.sin(t * 1.6 + i * 1.3) * R.s * .22]); }
          for (let i = 0; i < N - 1; i++) line(P[i][0], P[i][1], P[i + 1][0], P[i + 1][1], rgba('#8FD8FF', .35 + .4 * Math.sin(t * 2 + i) ** 2), 2, [3, 4]);
          P.forEach((q, i) => h2o(q[0], q[1], s, i * 1.1 + t * .3));
          [[36.8, 1], [63.2, -1]].forEach(([x, dir], i) => {
            const f = S.paused ? .8 : fr(t * .7 + i * .35), [ax, ay] = R.pt(x, 54), [bx, by] = R.pt(x, 54 - 12 * ss(f));
            X.save(); X.globalAlpha *= S.paused ? 1 : Math.sin(f * PI); arrow(ax, ay, bx, by, '#FFB347', 3.5); X.restore();
          });
          const [ax, ay] = R.pt(29, 47), [bx, by] = R.pt(71, 47), [cx, cy] = R.pt(50, 66);
          tx('adesão', ax, ay, { s: 14, w: 600, c: '#FFB347' }); tx('adesão', bx, by, { s: 14, w: 600, c: '#FFB347' }); tx('coesão entre as moléculas', cx, cy, { s: 14, w: 600, c: '#8FD8FF' });
        }
      }
    });
    cap(`Tubo de ${nbr(d, 1)} mm: a água sobe cerca de ${nbr(hmm / 10, 1)} cm. A altura é inversamente proporcional ao diâmetro: com metade do diâmetro, sobe o dobro`);
  }
});

def('agua', 'calor', {
  t: 'Calor específico', s: 'a água esquenta e esfria devagar', c: C.aguaM, loc: 'Praia ao longo de um dia', still: 12.5,
  alt: 'Gráfico da temperatura da areia e do mar ao longo de um dia: a areia esquenta e esfria muito mais do que a água',
  d: `<p><b>Calor específico é a quantidade de energia necessária para aquecer 1 grama de uma substância em 1&nbsp;°C.</b> O da água é alto, 1&nbsp;cal/(g&nbsp;°C), cerca de cinco vezes o da areia. Parte da energia que chega é gasta para romper ligações de hidrogênio antes de as moléculas se agitarem mais.</p>
<p>Por isso, num dia de sol, a areia da praia esquenta muito e esfria depressa à noite, enquanto o mar muda pouco de temperatura. Regiões perto de grandes massas de água têm clima mais ameno do que o interior.</p>
<p>Nos seres vivos, a água funciona como um <b>tampão térmico</b>: como somos 60% água, a temperatura do corpo muda pouco. Além disso, a água tem alto <b>calor de vaporização</b>: ao evaporar, o suor leva muito calor da pele. A transpiração das plantas faz o mesmo nas folhas.</p>`,
  kv: [['Calor específico da água', '1 cal/(g °C) (4,18 J/(g °C))'], ['Areia seca', 'cerca de 0,2 cal/(g °C)'], ['Calor de vaporização', 'cerca de 540 cal/g a 100 °C'], ['Efeito', 'estabilidade da temperatura do corpo e do clima']],
  enem: 'Aparece em questões de clima (cidades litorâneas × interior, brisa marítima), de regulação da temperatura (suor, transpiração das plantas) e em comparações entre substâncias. A pista é sempre a mesma: muita energia para pouca mudança de temperatura.',
  links: [LK.mol],
  init(S) { S.hb = 0; S.tb = 0; S.hold = null; S.hs = 0; H2.sair(); },
  sair() { H2.sair(); },
  draw(t, S) {
    const A = area(), sand = x => 24 + 14 * Math.sin((x - 9) / 24 * TAU), sea = x => 24 + 1.6 * Math.sin((x - 11) / 24 * TAU), AREIA = '#E8C99A', ph = S.ph;
    // o relógio do dia: 1,2 h por segundo; tocar num ponto leva o marcador até a hora dele e o segura por 5 s
    const dt = S.dt || 0, dif = (a, b) => ((b - a + 36) % 24) - 12;
    if (S.hold) { if (ph > S.hold.ate) { S.hb = S.hs; S.tb = ph; S.hold = null; } else S.hs = S.paused ? S.hold.h : (S.hs + dif(S.hs, S.hold.h) * (1 - Math.exp(-dt * 7)) + 24) % 24; }
    const h = S.hold ? S.hs : (((S.hb + (ph - S.tb) * 1.2) % 24) + 24) % 24; if (!S.hold) S.hs = h;
    const G = NAR ? { x0: A.x0 + 32, y0: A.y0 + A.h * .44, x1: A.x1 - 6, y1: A.y1 - 34 } : { x0: A.x0 + 50, y0: A.y0 + 10, x1: A.x0 + A.w * .55, y1: A.y1 - 44 }; G.w = G.x1 - G.x0; G.h = G.y1 - G.y0;
    const g = graph(G, { x0: 0, x1: 24, y0: 5, y1: 45, xl: 'hora do dia', yl: 'temperatura (°C)', xt: [[0, '0 h'], [6, '6'], [12, '12'], [18, '18'], [24, '24 h']], curves: [] });
    // as curvas se desenham da esquerda para a direita em 1,2 s; o volume vem de uma área em degradê sob cada uma
    const rev = ss(seg(ph, .1, 1.3)) * 24, curva = (f, c, lw) => {
      X.save(); X.beginPath(); X.rect(G.x0, G.y0, G.w, G.h); X.clip();
      const gr = X.createLinearGradient(0, G.y0, 0, G.y1); gr.addColorStop(0, rgba(c, .3)); gr.addColorStop(1, rgba(c, 0));
      X.beginPath(); X.moveTo(g.fx(0), G.y1); for (let i = 0; i <= 120; i++) { const v = Math.min(rev, i / 5); X.lineTo(g.fx(v), g.fy(f(v))); } X.lineTo(g.fx(rev), G.y1); X.closePath(); X.fillStyle = gr; X.fill();
      X.beginPath(); for (let i = 0; i <= 120; i++) { const v = Math.min(rev, i / 5); i ? X.lineTo(g.fx(v), g.fy(f(v))) : X.moveTo(g.fx(v), g.fy(f(v))); } X.strokeStyle = c; X.lineWidth = lw; X.lineJoin = 'round'; X.lineCap = 'round'; X.stroke(); X.restore();
    };
    curva(sand, AREIA, 3.5); curva(sea, C.aguaM, 3.5);
    const fade = ss(seg(ph, 1, 1.5)); X.save(); X.globalAlpha = fade; tx('areia', g.fx(15), g.fy(sand(15)) - 22, { s: 13, w: 600, c: AREIA }); tx('mar', g.fx(21), g.fy(sea(21)) - 16, { s: 13, w: 600, c: C.aguaM }); X.restore();
    const sel = H2.sel, mh = Math.min(h, rev);
    if (fade > 0) { X.save(); X.globalAlpha = fade; line(g.fx(mh), G.y0, g.fx(mh), G.y1, rgba(C.luz, .5), 1.5); marker(g.fx(mh), g.fy(sand(mh)), AREIA); marker(g.fx(mh), g.fy(sea(mh)), C.aguaM); X.restore(); }
    // pontos do gráfico: cada um leva o marcador à sua hora
    const PT = [
      { id: 'max', hora: 15, f: sand, c: AREIA, nome: 'Areia: a mais quente às 15 h', frase: 'A areia chega a cerca de 38 °C no começo da tarde. O calor específico dela é baixo: pouca energia basta para subir muito a temperatura.' },
      { id: 'min', hora: 3, f: sand, c: AREIA, nome: 'Areia: a mais fria de madrugada', frase: 'Sem o sol, a areia perde calor depressa e cai para cerca de 10 °C. Variação de cerca de 28 °C em um dia.' },
      { id: 'mar', hora: 17, f: sea, c: C.aguaM, nome: 'Mar: quase não muda', frase: 'A temperatura do mar varia só cerca de 3 °C no dia inteiro. A água absorve muita energia, em parte rompendo ligações de hidrogênio, antes de esquentar.' },
      { id: 'dif', hora: 14, f: x => (sand(x) + sea(x)) / 2, c: C.luz, nome: 'A diferença move o vento', frase: 'De dia o ar sobre a areia quente sobe e o ar mais frio do mar entra: é a brisa marítima. À noite a areia esfria mais e o vento inverte.' }
    ];
    PT.forEach(p => { if (sel === p.id) { X.save(); X.globalAlpha = fade; circ(g.fx(p.hora), g.fy(p.f(p.hora)), 15, null, '#FFB347', 2.5); X.restore(); } });
    H2.pontos('calor', S, PT.map(p => ({ id: p.id, x: g.fx(p.hora), y: g.fy(p.f(p.hora)), nome: p.nome, frase: p.frase, cor: p.c, ok: rev > p.hora - .5 })), { atraso: 1.3, aoSel: (id, d) => { const p = PT.find(q => q.id === id); S.hold = { h: p.hora, ate: S.ph + 5 }; if (S.paused) S.hs = p.hora; } });
    if (!NAR) tx('toque num ponto para ver o detalhe', G.x0 + G.w / 2, G.y0 + 16, { s: 12, c: C.dim, bg: false });
    // praia
    const P = NAR ? { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y0 + A.h * .34 } : { x0: A.x0 + A.w * .62, y0: A.y0 + 10, x1: A.x1, y1: A.y1 - 30 }, pw = P.x1 - P.x0, ph2 = P.y1 - P.y0, day = Math.sin((h - 6) / 24 * TAU);
    rr(P.x0, P.y0, pw, ph2, 12, day > 0 ? 'rgba(60,90,140,.55)' : 'rgba(14,20,40,.9)', C.line, 1);
    const sx = P.x0 + pw * ((h - 6) / 12), sy = P.y0 + ph2 * (.55 - .4 * Math.max(0, day));
    if (day > 0) { circ(sx, sy, 14, C.luz); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * .2; line(sx + Math.cos(a) * 18, sy + Math.sin(a) * 18, sx + Math.cos(a) * 24, sy + Math.sin(a) * 24, C.luz, 2); } } else { circ(P.x0 + pw * .8, P.y0 + ph2 * .2, 10, '#E8EDF7'); circ(P.x0 + pw * .8 + 5, P.y0 + ph2 * .2 - 3, 9, 'rgba(14,20,40,1)'); }
    const ty = P.y0 + ph2 * .62, ts = sand(h), tm = sea(h), col = T => `rgb(${cl(120 + (T - 10) * 5, 80, 255) | 0},${cl(140 - Math.abs(T - 25) * 1.5, 60, 200) | 0},${cl(220 - (T - 10) * 5, 40, 230) | 0})`;
    rr(P.x0 + 2, ty, pw * .5, P.y1 - ty - 2, 8, '#C9A574'); rr(P.x0 + pw * .5, ty + 6, pw * .5 - 2, P.y1 - ty - 8, 8, '#2A6F9C');
    tok(P.x0 + pw * .25, ty + (P.y1 - ty) / 2, 'areia ' + Math.round(ts) + ' °C', col(ts)); tok(P.x0 + pw * .75, ty + (P.y1 - ty) / 2 + 3, 'mar ' + Math.round(tm) + ' °C', col(tm));
    cap(`${String(Math.floor(h)).padStart(2, '0')} h: areia a ${Math.round(ts)} °C e mar a ${Math.round(tm)} °C. A água varia pouco porque tem alto calor específico`);
  }
});

// ---------- NaCl dissolvendo em 3D (mol3d.js): cristal 3x3x3 com 4 íons da quina que se soltam e se hidratam ----------
// Raios iônicos (Å): Na⁺ 1,02 e Cl⁻ 1,81, que somam os 2,82 Å entre vizinhos do cristal. Na água, o O fica a 2,4 Å do Na⁺ e o H a 2,2 Å do Cl⁻.
const NC = { io: [] };
function naclMontar(M) {
  const S = 2.82, dirs = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]], hm = HOH / 2;
  const SOLTOS = { '022': 'A', '021': 'B', '012': 'C', '011': 'D' };
  const IONF = { na: { nome: 'Íon sódio (Na⁺)', frase: 'Perdeu um elétron e tem carga positiva. No cristal é atraído pelos Cl⁻ vizinhos; na água, pelos oxigênios (δ⁻) das moléculas de água.', r: [.72, 1.02] }, cl: { nome: 'Íon cloreto (Cl⁻)', frase: 'Ganhou um elétron e tem carga negativa. No cristal é atraído pelos Na⁺ vizinhos; na água, pelos hidrogênios (δ⁺) das moléculas de água.', r: [1.02, 1.81] } };
  M.grupo('cristal', { nome: 'Cristal de NaCl', cor: C_NA, frase: 'Rede cúbica em que cada Na⁺ tem 6 Cl⁻ vizinhos e cada Cl⁻ tem 6 Na⁺. A atração entre cargas opostas (ligação iônica) mantém os íons no lugar.' });
  M.grupo('hidNa', { nome: 'Na⁺ hidratado', cor: C_NA, frase: 'O sódio saiu do cristal e ficou cercado por moléculas de água com o oxigênio (δ⁻) voltado para ele: é a camada de hidratação.' });
  M.grupo('hidCl', { nome: 'Cl⁻ hidratado', cor: C_CL, frase: 'O cloreto saiu do cristal e ficou cercado por moléculas de água com os hidrogênios (δ⁺) voltados para ele: é a camada de hidratação.' });
  NC.io = []; const ref = {};
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) {
    const na = (i + j + k) % 2 === 0, p = [(i - 1) * S, (j - 1) * S, (k - 1) * S], key = '' + i + j + k, id = SOLTOS[key], F = na ? IONF.na : IONF.cl;
    if (!id) { const a = M.atomo(na ? 'Na' : 'Cl', p, { grupo: 'cristal', r: F.r, nome: F.nome, frase: F.frase }); ref[key] = a; continue; }
    const no = M.no('n' + id, { origem: p }), grupo = na ? 'hidNa' : 'hidCl', out = v3.n([i - 1, j - 1, k - 1]);
    const a = M.atomo(na ? 'Na' : 'Cl', p, { no: 'n' + id, grupo, r: F.r, nome: F.nome, frase: F.frase }), ws = [];
    dirs.forEach((d, q) => {
      const perp = v3.n(v3.x(d, Math.abs(d[1]) > .9 ? [1, 0, 0] : [0, 1, 0])), fora = out[0] * d[0] + out[1] * d[1] + out[2] * d[2] > .1;
      const o = v3.s(p, v3.k(d, na ? 2.4 : 2.2 + OH)), wid = 'w' + id + q, wn = M.no(wid, { pai: 'n' + id, origem: o });
      let u1, u2;
      if (na) { u1 = v3.n(v3.s(v3.k(d, Math.cos(hm)), v3.k(perp, Math.sin(hm)))); u2 = v3.n(v3.s(v3.k(d, Math.cos(hm)), v3.k(perp, -Math.sin(hm)))); }
      else { u1 = v3.k(d, -1); u2 = hdir2(u1, perp); }
      const w = agua3d(M, o, u1, u2, { no: wid, grupo, O: { r: [.5, 1.3], nome: 'Oxigênio da água', frase: na ? 'Voltado para o Na⁺: o lado negativo (δ⁻) da molécula atrai o íon positivo.' : 'Do lado oposto ao Cl⁻: o hidrogênio (δ⁺) é que se volta para o íon negativo.' }, H: { r: [.3, .8], nome: 'Hidrogênio da água', frase: na ? 'Fica do lado de fora: o lado positivo (δ⁺) da molécula não se volta para o Na⁺.' : 'Voltado para o Cl⁻: o lado positivo (δ⁺) da molécula atrai o íon negativo.' } });
      ws.push({ no: wn, d, fora, w });
    });
    NC.io.push({ id, no, ws, na, drift: v3.n([i - 1, j - 1, k - 1].map((x, q) => q ? x : x * 1.2)), atomo: a });
  }
  const A = NC.io.find(q => q.id === 'A'), B = NC.io.find(q => q.id === 'B');
  M.rotulo(A.atomo, 'sódio Na⁺', 0); M.rotulo(B.atomo, 'cloreto Cl⁻', 1);
  M.rotulo(A.ws.find(q => q.fora && q.d[2] === 1).w[0], 'oxigênio δ⁻ da água', 2); M.rotulo(B.ws.find(q => q.fora && q.d[1] === 1).w[1], 'hidrogênio δ⁺ da água', 3);
  M.rotulo(ref['222'], 'cristal de NaCl', 4);
  M.vista = { th: -.62, fi: .34, zoom: 1 };
}
function naclAnimar(M, P) {
  M.enquadrar([1, 1.1, 2.2][P.passo]);
  NC.io.forEach((io, j) => {
    const e = P.passo === 2 ? P.entre(.2 + j * .45, 1.7 + j * .45) : 0;
    io.no.pos = v3.k(io.drift, 8.5 * e);
    io.ws.forEach((w, q) => {
      if (w.fora) { const a = P.passo === 0 ? 0 : P.passo === 1 ? P.entre(.1 + (j * 2 + q % 3) * .12, 1.1 + (j * 2 + q % 3) * .12) : 1; w.no.pos = v3.k(w.d, 5 * (1 - a)); w.no.esc = cl(a * 4, 0, 1); }
      else { w.no.pos = [0, 0, 0]; w.no.esc = P.passo < 2 ? 0 : cl((e - .3) * 3, 0, 1); }
    });
  });
}

def('agua', 'solvente', MOL3D.cena({
  t: 'Solvente universal', s: 'a água dissolve o sal', c: C.aguaM, loc: 'Cristal de cloreto de sódio na água', still: 3,
  ctl: escolha('Passo', ['cristal', 'água ataca', 'íons hidratados'], 7),
  montar: naclMontar, animar: naclAnimar,
  legenda: P => ['Cristal de NaCl: Na⁺ e Cl⁻ alternados, presos pela atração entre cargas opostas', 'As moléculas de água chegam à superfície: o oxigênio (δ⁻) se volta para o Na⁺ e os hidrogênios (δ⁺), para o Cl⁻', 'Cercados pela água, os íons saem do cristal: cada um fica com a sua camada de hidratação'][P.passo],
  alt: 'Um cristal de sal se desfaz na água: cada íon de sódio fica cercado pelos oxigênios e cada íon de cloreto pelos hidrogênios das moléculas de água',
  d: `<p><b>A água dissolve mais substâncias do que qualquer outro líquido comum, por isso é chamada de solvente universal.</b> Ela dissolve bem substâncias <b>polares</b> e <b>iônicas</b>, como açúcares, aminoácidos e sais.</p>
<p>Quando um cristal de sal (NaCl) cai na água, as moléculas de água cercam os íons da superfície e os arrancam do cristal. O lado negativo (oxigênio) se volta para o íon positivo, Na⁺; o lado positivo (hidrogênios) se volta para o íon negativo, Cl⁻. Cada íon fica envolvido por uma <b>camada de hidratação</b>.</p>
<p>Substâncias apolares, como óleos e gorduras, não se misturam com a água (são <b>hidrofóbicas</b>). Dissolvidas, as substâncias podem reagir, ser transportadas pelo sangue e pela seiva e atravessar membranas. Quase todas as reações da célula acontecem em meio aquoso.</p>`,
  kv: [['Dissolve bem', 'substâncias polares e iônicas (hidrofílicas)'], ['Não dissolve', 'substâncias apolares: óleos, gorduras (hidrofóbicas)'], ['Na⁺ cercado por', 'oxigênios (δ⁻) da água'], ['Cl⁻ cercado por', 'hidrogênios (δ⁺) da água']],
  enem: 'Liga-se a transporte (sangue, seiva, urina), à digestão (reações de hidrólise, em que a água participa) e à poluição (substâncias dissolvidas na água se espalham). Também cai a regra "semelhante dissolve semelhante": polar com polar, apolar com apolar.',
  links: [LK.nacl, LK.mol],
  // desenho plano antigo: só aparece se o 3D não abrir neste navegador
  plano(t) {
    const A = area(), s = Math.min(A.w, A.h) / (NAR ? 15 : 17), cx = NAR ? A.cx : A.x0 + A.w * .3, cy = A.cy + (NAR ? A.h * .1 : 0), p = fr(t * .06), R = rng(9);
    rr(A.x0, A.y0, A.w, A.h, 14, rgba(C.aguaM, .08));
    const ions = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) ions.push({ x: cx + (c - 1.5) * s * 1.15, y: cy + (r - 1.5) * s * 1.15, na: (r + c) % 2 === 0 });
    const order = [0, 3, 12, 15, 1, 14, 4, 11];
    // moléculas de água soltas ao fundo
    for (let i = 0; i < (NAR ? 14 : 26); i++) { const x = A.x0 + 20 + R() * (A.w - 40), y = A.y0 + 20 + R() * (A.h - 40); if (Math.hypot(x - cx, y - cy) < s * 3.4) continue; h2o(x + Math.sin(t + i) * 4, y + Math.cos(t * .8 + i) * 4, s * .22, R() * TAU + t * .5, { a: .55 }); }
    ions.forEach((io, i) => {
      const oi = order.indexOf(i), k = oi < 0 ? 0 : ss((p - .08 - oi * .1) / .14);
      const tx0 = NAR ? A.x0 + A.w * (.12 + (oi % 4) * .25) : A.x0 + A.w * (.6 + (oi % 2) * .2), ty0 = NAR ? A.y0 + A.h * (oi < 4 ? .1 : .24) : A.y0 + A.h * (.14 + Math.floor(oi / 2) * .22);
      const x = lerp(io.x, tx0, k), y = lerp(io.y, ty0, k), r = io.na ? s * .42 : s * .55;
      if (k > .05) for (let j = 0; j < 6; j++) { const a = j / 6 * TAU + t * .4, rr2 = r + s * .5; h2o(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2, s * .2, io.na ? a : a + PI, { a: k }); }
      ionB(x, y, r, io.na ? C_NA : C_CL, io.na ? 'Na⁺' : 'Cl⁻');
    });
    if (!NAR) { tx('cristal de NaCl', cx, cy + s * 2.9, { w: 600 }); tx('íons hidratados', A.x0 + A.w * .7, A.y1 - 14, { w: 600 }); }
    lab(cx - s * 1.73, cy - s * 1.73, cx - s * 2.2, cy - s * 3.2, 'Na⁺: oxigênios voltados para ele');
    cap(p < .1 ? 'As moléculas de água atacam os íons da superfície do cristal' : 'Na⁺ fica cercado pelo lado negativo da água (O); Cl⁻, pelo lado positivo (H)');
  }
}));

{
  const TEC = [['pulmões', 83], ['músculos', 79], ['rins', 79], ['encéfalo', 73], ['coração', 73], ['pele', 64], ['ossos', 31], ['tecido adiposo', 15]];
  const idadeAgua = a => a <= 0 ? 75 : a < 1 ? lerp(75, 65, a) : a < 20 ? lerp(65, 60, (a - 1) / 19) : a < 70 ? lerp(60, 55, (a - 20) / 50) : lerp(55, 50, Math.min(1, (a - 70) / 20));
  // figuras de IA (figura-ia.js): corpo de frente (A) e de perfil (B), com o teor de água de cada tecido nos pontos
  const TEC_ID = ['pulmoes', 'musculos', 'rins', 'encefalo', 'coracao', 'pele', 'ossos', 'adiposo'];
  const TEC_D = ['Tecido fino e úmido, em atividade o tempo todo para trocar gases.', 'Trabalham muito e têm metabolismo intenso.', 'Filtram o sangue sem parar e ajustam a água do corpo.', 'Metabolismo muito intenso, com neurônios sempre ativos.', 'Músculo que não para de contrair.', 'A maior parte da água fica na derme.', 'A matriz mineral dá rigidez e deixa pouco espaço para a água.', 'Guarda gordura, que não se mistura com a água.'];
  const TEC_T = ['Pulmões', 'Músculos', 'Rins', 'Encéfalo', 'Coração', 'Pele', 'Ossos', 'Tecido adiposo'];
  const TEC_EM = [{ a: [42, 21], b: [52, 21] }, { a: [41, 57], b: [47, 57] }, { a: [43, 36], b: [45, 36] }, { a: [50, 6], b: [44, 7] }, { a: [53, 25] }, { a: [25, 30], b: [58, 11] }, { a: [41, 67], b: [47, 68] }, { a: [58, 41], b: [56, 42] }];
  const TEOR_FIG = window.LAB_FIGIA ? LAB_FIGIA({
    nome: 'Corpo humano em transparência, de frente e de perfil, com o teor de água de cada tecido', mask: { miolo: .72, borda: 1 },
    vistas: [{ id: 'a', img: 'biologia-molecular-agua-teor-a', nome: 'De frente' }, { id: 'b', img: 'biologia-molecular-agua-teor-b', nome: 'De perfil' }],
    hs: TEC.map(([n, v], i) => ({ id: TEC_ID[i], c: C.aguaM, em: TEC_EM[i], t: TEC_T[i] + ': cerca de ' + v + ' % de água', d: TEC_D[i], z: 2.4 }))
  }) : null;
  def('agua', 'teor', {
    t: 'Teor de água', s: 'varia com o tecido e com a idade', c: C.aguaM, loc: 'Corpo humano', still: 0,
    ctl: { l: 'Idade', min: 0, max: 90, step: 1, v: 30, f: v => v === 0 ? 'recém-nascido' : v + (v === 1 ? ' ano' : ' anos'), rate: () => 1 },
    alt: 'Silhueta humana preenchida até a porcentagem de água do corpo para a idade escolhida, ao lado de barras com o teor de água de cada tecido',
    d: `<p><b>A quantidade de água muda de um tecido para outro e diminui com a idade.</b> Em geral, quanto mais intensa a atividade metabólica de um tecido, maior o teor de água: pulmões, músculos e rins têm cerca de 80%; os ossos, cerca de 30%; o tecido adiposo, que guarda gordura, tem pouca água.</p>
<p>Um embrião no início da gestação tem cerca de 90% de água; o recém-nascido, perto de 75%; um adulto, em torno de 60%; e um idoso, cerca de 50 a 55%. Mude a idade no controle. Como o tecido adiposo tem pouca água, pessoas com mais gordura corporal têm proporcionalmente menos água.</p>
<p>A água também varia entre espécies: águas-vivas têm cerca de 95%, e sementes secas, menos de 15%. A semente só germina depois de absorver água, porque o metabolismo depende dela.</p>`,
    kv: [['Recém-nascido', 'cerca de 75%'], ['Adulto', 'cerca de 60%'], ['Idoso', 'cerca de 50 a 55%'], ['Mais água', 'tecidos de metabolismo intenso'], ['Água-viva × semente seca', 'cerca de 95% × menos de 15%']],
    enem: 'Relações que a prova cobra: o teor de água cai com a idade, é maior em tecidos de metabolismo intenso e menor em tecidos de reserva e sustentação (gordura, osso, dente). Bebês e idosos desidratam com mais facilidade, um tema ligado a diarreia e ao soro caseiro.',
    links: [['Água e sais na hemácia', '#sais/osmose']],
    draw(t, S) {
      const A = area(), a = S.v, p = idadeAgua(a), pr = Math.round(p / 5) * 5, sel = TEOR_FIG && TEOR_FIG.aberto ? TEC_ID.indexOf(TEOR_FIG.aberto.id) : -1;
      const box = NAR ? { x: A.x0, y: A.y0, w: A.w, h: A.h * .6 } : { x: A.x0, y: A.y0, w: A.w * .42, h: A.h };
      if (TEOR_FIG) TEOR_FIG.desenhar(X, box, {
        sobre(R) {
          // nível de água do corpo para a idade escolhida: um tubo ao lado da figura, com a superfície ondulando
          X.save(); X.globalAlpha *= 1 - ss(seg(R.z, 1.05, 1.5));
          const gx = R.vista === 'a' ? 9 : 12, [x, y0] = R.pt(gx, 12), [, y1] = R.pt(gx, 90), w = Math.max(12, R.s * 2.6), hh = y1 - y0, lv = hh * p / 100, top = y1 - lv;
          rr(x - w / 2, y0, w, hh, w / 2, 'rgba(19,26,43,.7)', 'rgba(232,237,247,.4)', 1.5);
          X.save(); X.beginPath(); X.roundRect(x - w / 2 + 1, y0 + 1, w - 2, hh - 2, w / 2); X.clip();
          X.beginPath(); X.moveTo(x - w, y1); for (let k = 0; k <= 8; k++) X.lineTo(x - w / 2 + k * w / 8, top + Math.sin(t * 2.4 + k * .9) * 1.6); X.lineTo(x + w, y1); X.closePath();
          const g = X.createLinearGradient(0, top, 0, y1); g.addColorStop(0, rgba(C.aguaM, .95)); g.addColorStop(1, rgba(C.aguaM, .55)); X.fillStyle = g; X.fill();
          for (let k = 0; k < 3; k++) { const f = fr(t * .35 + k / 3); circ(x + Math.sin(k * 2.3 + t) * w * .2, lerp(y1 - 4, top + 4, f), 2, rgba('#FFFFFF', .55 * Math.sin(f * PI))); }
          X.restore();
          const [nx, ny] = R.pt(gx + 8, 5);
          const ny2 = ny + (NAR ? 15 : 18); tx('cerca de', nx, ny, { s: 13, c: C.dim }); tx(pr + '%', nx, ny2, { f: FH, s: NAR ? 20 : 24, w: 700, c: C.txt }); tx('de água', nx, ny2 + (NAR ? 18 : 22), { s: 13, c: C.dim }); X.restore();
        }
      });
      // barras dos tecidos (adulto): crescem na entrada; o tecido do ponto aberto fica em destaque
      const x0 = NAR ? A.x0 + 112 : A.x0 + A.w * .53, w = NAR ? A.w - 200 : A.w * .15, y0 = NAR ? A.y0 + A.h * .64 : A.y0 + 38, gap = NAR ? (A.h * .36 - 6) / TEC.length : (A.h - 70) / TEC.length;
      if (!NAR) tx('teor aproximado de água por tecido (adulto)', x0 - 96, A.y0 + 10, { a: 'left', s: 14, w: 600, c: C.dim, bg: false });
      TEC.forEach(([n, v], i) => {
        const y = y0 + i * gap, bh = Math.min(16, gap - 8), g = S.paused ? 1 : ss(seg(t, .5 + i * .08, 1.5 + i * .08)), on = i === sel;
        tx(n, x0 - 8, y + bh / 2, { a: 'right', s: 13, w: on ? 700 : 600, c: C.txt, bg: false }); rr(x0, y, w, bh, 3, 'rgba(91,108,153,.2)', on ? '#FFB347' : null, 1.5); rr(x0, y, Math.max(2, w * v / 100 * g), bh, 3, on ? light(C.aguaM, .3) : C.aguaM);
        tx('cerca de ' + v + '%', x0 + w * v / 100 * g + 6, y + bh / 2, { a: 'left', f: FD, s: 12, w: 500, c: C.txt, bg: false });
      });
      if (!NAR) tx('Toque nos pontos da figura para ver cada órgão', x0 - 96, A.y1 - 4, { a: 'left', s: 13, c: C.dim, bg: false });
      cap(a === 0 ? 'Recém-nascido: cerca de 75% de água' : a < 15 ? 'Na infância o teor de água cai depressa' : a < 65 ? `Adulto: cerca de ${pr}% de água` : 'Idoso: cerca de 50 a 55% de água; a sede também diminui');
    }
  });
}

// =====================================================================================
// SAIS MINERAIS
// =====================================================================================
{
  const MIN = [
    { s: 'Ca', n: 'Cálcio', ion: 'Ca²⁺', f: 'Forma ossos e dentes (fosfato de cálcio); atua na contração muscular, na coagulação do sangue e no impulso nervoso.', fo: 'Leite e derivados, sardinha, folhas verde-escuras.', ca: 'Raquitismo na criança (junto com a falta de vitamina D) e osteoporose no adulto.', c: '#D6DCE8' },
    { s: 'Fe', n: 'Ferro', ion: 'Fe²⁺', f: 'Fica no centro do grupo heme da hemoglobina, que leva o O₂ no sangue; também está na mioglobina e nos citocromos.', fo: 'Carnes, fígado, feijão, folhas verde-escuras (a vitamina C melhora a absorção do ferro vegetal).', ca: 'Anemia ferropriva: cansaço, palidez e baixo rendimento.', c: '#E0745A' },
    { s: 'Na K', n: 'Sódio e potássio', ion: 'Na⁺ e K⁺', f: 'Mantêm o potencial da membrana e o impulso nervoso; a bomba de sódio e potássio leva 3 Na⁺ para fora e 2 K⁺ para dentro, gastando ATP. Controlam a água do corpo.', fo: 'Sal de cozinha (Na); banana, feijão, batata, frutas (K).', ca: 'Excesso de sódio: hipertensão. Falta de potássio: fraqueza e cãibras.', c: C_NA },
    { s: 'P', n: 'Fósforo', ion: 'PO₄³⁻', f: 'Faz parte do ATP, do DNA, do RNA, dos fosfolipídios das membranas e da matriz dos ossos.', fo: 'Carnes, ovos, leite, cereais e feijão.', ca: 'Carência rara; ossos fracos. Na agricultura, o fósforo é o "P" do adubo NPK.', c: C.p },
    { s: 'Mg', n: 'Magnésio', ion: 'Mg²⁺', f: 'Ocupa o centro da molécula de clorofila; ajuda centenas de enzimas, sobretudo as que usam ATP.', fo: 'Folhas verdes, castanhas, sementes e grãos integrais.', ca: 'Fraqueza e cãibras; nas plantas, folhas amareladas (clorose).', c: '#8FD18F' },
    { s: 'I', n: 'Iodo', ion: 'I⁻', f: 'Entra nos hormônios da tireoide (T3 e T4), que regulam o metabolismo e o desenvolvimento.', fo: 'Sal iodado (obrigatório no Brasil), peixes e frutos do mar.', ca: 'Bócio (aumento da tireoide); na gestação, prejudica o desenvolvimento do cérebro do bebê.', c: '#B07AE0' },
    { s: 'Zn', n: 'Zinco', ion: 'Zn²⁺', f: 'Ajuda centenas de enzimas a funcionar; importante para a imunidade, a cicatrização e o crescimento.', fo: 'Carnes, frutos do mar, sementes, castanhas e feijão.', ca: 'Crescimento atrasado, baixa imunidade e perda do paladar.', c: '#9DB4C8' }
  ];
  // figuras de IA (figura-ia.js): fêmur em corte (A) e alimentos (B); um ponto por mineral, e o mineral escolhido no controle ganha anéis e íons em movimento
  const FM = (i, o) => Object.assign({ c: MIN[i].c, m: i }, o);
  const FUN_HS = [
    FM(0, { id: 'ca-osso', em: { a: [55, 38] }, t: 'Cálcio no osso', ion: 'Ca²⁺', d: MIN[0].f }),
    FM(3, { id: 'p-osso', em: { a: [45, 86] }, t: 'Fósforo no osso', ion: 'PO₄³⁻', d: MIN[3].f }),
    FM(1, { id: 'fe-medula', em: { a: [50, 52] }, t: 'Ferro na medula', ion: 'Fe²⁺', d: MIN[1].f }),
    FM(0, { id: 'ca-leite', em: { b: [10, 50] }, t: 'Cálcio no leite', ion: 'Ca²⁺', d: 'Fontes: ' + MIN[0].fo }),
    FM(4, { id: 'mg-espinafre', em: { b: [36, 46] }, t: 'Magnésio nas folhas', ion: 'Mg²⁺', d: MIN[4].f + ' Fontes: ' + MIN[4].fo }),
    FM(2, { id: 'k-banana', em: { b: [47, 47] }, t: 'Potássio na banana', ion: 'K⁺', d: MIN[2].f + ' Fontes: ' + MIN[2].fo }),
    FM(3, { id: 'p-feijao', em: { b: [61, 51] }, t: 'Fósforo no feijão', ion: 'PO₄³⁻', d: 'Fontes: ' + MIN[3].fo }),
    FM(1, { id: 'fe-carne', em: { b: [71, 45] }, t: 'Ferro na carne', ion: 'Fe²⁺', d: 'Fontes: ' + MIN[1].fo }),
    FM(6, { id: 'zn-carne', em: { b: [79, 54] }, t: 'Zinco na carne', ion: 'Zn²⁺', d: MIN[6].f + ' Fontes: ' + MIN[6].fo }),
    FM(2, { id: 'na-sal', em: { b: [86, 60] }, t: 'Sódio no sal', ion: 'Na⁺', d: MIN[2].f + ' Fontes: ' + MIN[2].fo }),
    FM(5, { id: 'i-sal', em: { b: [94, 55] }, t: 'Iodo no sal iodado', ion: 'I⁻', d: MIN[5].f + ' Fontes: ' + MIN[5].fo })
  ];
  const FUN_FIG = window.LAB_FIGIA ? LAB_FIGIA({
    nome: 'Fêmur em corte e alimentos ricos em sais minerais', mask: { miolo: .8, borda: 1 },
    vistas: [{ id: 'a', img: 'biologia-molecular-sais-funcoes-a', nome: 'Osso', recorte: [.22, 0, .56, 1] }, { id: 'b', img: 'biologia-molecular-sais-funcoes-b', nome: 'Alimentos', recorte: [0, .18, 1, .56] }],
    hs: FUN_HS
  }) : null;
  def('sais', 'funcoes', {
    t: 'Sais minerais e suas funções', s: 'Ca, Fe, Na, K, P, Mg, I, Zn', c: C.sal, loc: 'Íons no corpo', still: 0,
    ctl: escolha('Mineral', MIN.map(m => m.n), 6),
    alt: 'Ficha de cada sal mineral com uma ilustração da sua função, as fontes na dieta e a doença causada pela carência',
    d: `<p><b>Os sais minerais são substâncias inorgânicas que, no corpo, aparecem principalmente como íons dissolvidos</b> (Na⁺, K⁺, Ca²⁺, Cl⁻) ou presos a moléculas e estruturas (o ferro na hemoglobina, o cálcio no osso). Não fornecem energia, mas sem eles nervos, músculos, enzimas e ossos param de funcionar.</p>
<p>Eles chegam pela alimentação e pela água e saem na urina, nas fezes e no suor. As carências mais comuns no Brasil são de <b>ferro</b> (anemia) e de <b>cálcio</b>. A de <b>iodo</b>, que causava bócio, era comum e foi controlada pela iodação do sal, obrigatória por lei desde 1974. As farinhas de trigo e de milho são enriquecidas com ferro e ácido fólico.</p>
<p>O controle passa por sete minerais; escolha um para ver a ficha.</p>`,
    kv: MIN.map(m => [m.n + ' (' + m.ion + ')', m.ca.split(';')[0].split('.')[0]]),
    enem: 'As carências mais cobradas: ferro e anemia, iodo e bócio, cálcio e osteoporose (com a vitamina D). A prova também gosta das políticas públicas: sal iodado e farinhas fortificadas. Na fisiologia, Na⁺ e K⁺ aparecem no impulso nervoso, e o Ca²⁺, na contração muscular e na coagulação.',
    links: [['Vitaminas', '#vit'], ['Tabela periódica', '../tabela-periodica/index.html'], ['Hemoglobina e DNA', '../dna/index.html']],
    draw(t, S) {
      const A = area(), i = Math.round(S.v), m = MIN[i], box = NAR ? { x: A.x0, y: A.y0, w: A.w, h: A.h * .4 } : { x: A.x0, y: A.y0, w: A.w * .6, h: A.h };
      if (FUN_FIG) FUN_FIG.desenhar(X, box, {
        vista: [0, 1, 3].includes(i) ? 'a' : 'b',
        sobre(R) {
          // o mineral escolhido: dois anéis se abrindo no ponto e três íons em órbita, com o símbolo do íon
          FUN_HS.forEach(h => {
            const q = h.em[R.vista]; if (!q || h.m !== i) return;
            const [px, py] = R.pt(q[0], q[1]), r0 = Math.max(12, R.s * 3);
            for (let k = 0; k < 2; k++) { const f = S.paused ? .5 + k * .3 : fr(t * .5 + k / 2); X.save(); X.globalAlpha *= (1 - f) * .85; circ(px, py, r0 * (.6 + f * 1.5), null, h.c, 2); X.restore(); }
            for (let k = 0; k < 3; k++) { const a = t * .9 + k * TAU / 3; circ(px + Math.cos(a) * r0 * 1.25, py + Math.sin(a) * r0 * 1.25, Math.max(3, R.s * .6), h.c, 'rgba(11,15,28,.7)', 1.2); }
            tok(px, py - r0 * 1.9, h.ion, h.c);
          });
        }
      });
      const tw2 = NAR ? 56 : 92, tx0 = NAR ? A.x0 + 6 : A.x0 + A.w * .63, ty0 = NAR ? A.y0 + A.h * .42 : A.y0 + 10;
      rr(tx0, ty0, tw2, tw2, 8, m.c, 'rgba(255,255,255,.3)', 1.5); tx(m.s, tx0 + tw2 / 2, ty0 + tw2 * .45, { f: FH, s: m.s.length > 2 ? (NAR ? 16 : 24) : (NAR ? 24 : 36), w: 700, c: '#0B0F1C', bg: false }); tx(m.ion, tx0 + tw2 / 2, ty0 + tw2 * .8, { s: 12, w: 700, c: '#0B0F1C', bg: false });
      tx(m.n, tx0 + tw2 + 14, ty0 + 18, { a: 'left', f: FH, s: NAR ? 18 : 22, w: 600, c: C.txt });
      MIN.forEach((q, k) => circ(tx0 + tw2 + 18 + k * 16, ty0 + (NAR ? 40 : 48), 5, k === i ? q.c : 'rgba(91,108,153,.4)'));
      const qx = NAR ? A.x0 + 6 : tx0, qw = NAR ? A.w - 12 : A.x1 - tx0; let y = ty0 + tw2 + (NAR ? 20 : 30);
      for (const [h, s] of [['Função', m.f], ['Fontes', m.fo], ['Carência ou excesso', m.ca]]) { tx(h, qx, y, { a: 'left', s: 13, w: 700, c: m.c, bg: false }); y += 20; y += para(s, qx, y, qw, { s: NAR ? 13 : 15, lh: NAR ? 18 : 22 }) + (NAR ? 8 : 16); }
      { const c0 = m.ca.split('.')[0]; cap(m.n + ': ' + c0.charAt(0).toLowerCase() + c0.slice(1)); }
    }
  });
}

// figuras de IA (figura-ia.js): hemácias inchada, normal e murcha (A) e a mesma cena com a hemólise (B); os scripts das imagens só carregam quando a cena abre
const OSM_CEL = [{ x: 17.5, y: 50, r: 14.5, tipo: 'hipotônica', sub: 'a água entra', dir: 1 }, { x: 52, y: 51, r: 14, tipo: 'isotônica', sub: 'entra e sai igual', dir: 0 }, { x: 83.5, y: 50, r: 12.5, tipo: 'hipertônica', sub: 'a água sai', dir: -1 }];
const OSM_FIG = window.LAB_FIGIA ? LAB_FIGIA({
  nome: 'Hemácias inchada, normal e murcha em soluções com pouco, médio e muito sal', mask: { miolo: .78, borda: 1 },
  vistas: [{ id: 'a', img: 'biologia-molecular-sais-osmose-b', nome: 'Três soluções' }, { id: 'b', img: 'biologia-molecular-sais-osmose-a', nome: 'Com hemólise' }],
  hs: [
    { id: 'inchada', c: '#8FD8FF', em: { a: [17.5, 50], b: [17.5, 52] }, t: 'Hemácia inchada', d: 'Em meio hipotônico a água entra por osmose, a célula incha e pode estourar: é a hemólise.', z: 2.2 },
    { id: 'normal', c: '#7FE0A2', em: { a: [52, 51], b: [52, 53] }, t: 'Hemácia normal', d: 'Em meio isotônico, cerca de 0,9% de NaCl, a água entra e sai na mesma taxa e a célula mantém o formato de disco.', z: 2.2 },
    { id: 'murcha', c: '#F2C14E', em: { a: [83.5, 50], b: [84, 52] }, t: 'Hemácia murcha', d: 'Em meio hipertônico a água sai, a célula encolhe e a superfície fica enrugada.', z: 2.4 },
    { id: 'hemolise', c: '#FF8A7A', em: { b: [25, 20] }, t: 'Hemólise', d: 'A membrana se rompe e a hemoglobina se espalha pelo meio. Por isso não se injeta água pura na veia.', z: 3 }
  ]
}) : null;
def('sais', 'osmose', {
  t: 'Sais e o equilíbrio de água', s: 'hemácias em soluções de sal', c: C.sal, loc: 'Hemácias numa lâmina', still: 2,
  ctl: { l: 'NaCl na solução', min: 0, max: 2, step: .1, v: .9, f: v => nbr(v, 1) + ' %', rate: () => 1 },
  alt: 'Hemácias em soluções com diferentes concentrações de sal: incham e estouram em pouca concentração, murcham em muita e ficam normais em 0,9 por cento',
  d: `<p><b>Os sais dissolvidos controlam para onde a água vai.</b> A água atravessa a membrana por <b>osmose</b>, do lado com menos solutos para o lado com mais solutos. Por isso a concentração de sais no sangue precisa ficar estável.</p>
<p>Uma hemácia num meio com a mesma concentração que ela (<b>isotônico</b>, cerca de 0,9% de NaCl) não muda. Num meio com menos sal (<b>hipotônico</b>), a água entra, a célula incha e pode estourar (<b>hemólise</b>). Num meio com mais sal (<b>hipertônico</b>), a água sai e a célula murcha. Mude a concentração no controle.</p>
<p>É por isso que o <b>soro fisiológico</b> tem 0,9% de NaCl, e que o soro caseiro leva sal e açúcar: repõe a água e os sais perdidos na diarreia, e o açúcar ajuda o intestino a absorver o sódio, e a água vai junto. Salgar carnes e fazer doces muito açucarados conserva os alimentos, porque o meio hipertônico tira a água dos microrganismos.</p>`,
  kv: [['Isotônico para a hemácia', 'cerca de 0,9% de NaCl'], ['Hipotônico', 'a água entra; a célula incha'], ['Hipertônico', 'a água sai; a célula murcha'], ['Soro caseiro', 'água, sal e açúcar']],
  enem: 'Tema muito frequente: soro caseiro e desidratação, conservação de alimentos com sal ou açúcar, por que não beber água do mar e por que não injetar água pura na veia. Pense sempre para que lado a água vai: para onde há mais solutos.',
  links: [['Teor de água', '#agua/teor'], ['Membranas (Morfofisiologia)', '../morfofisiologia/index.html']],
  draw(t, S) {
    const A = area(), c = S.v, sel = c < .85 ? 0 : c > .95 ? 2 : 1, tipo = OSM_CEL[sel].tipo;
    if (OSM_FIG) OSM_FIG.desenhar(X, { x: A.x0, y: A.y0, w: A.w, h: A.h }, {
      vista: c < .3 ? 'b' : 'a',
      sobre(R) {
        const N = 12;
        OSM_CEL.forEach((q, i) => {
          const [cx, cy] = R.pt(q.x, q.y), rp = R.s * q.r, on = i === sel;
          if (!on) { X.beginPath(); X.arc(cx, cy, rp, 0, TAU); X.fillStyle = 'rgba(6,9,18,.38)'; X.fill(); }
          // gotas de água cruzando a membrana: para dentro na hipotônica, para fora na hipertônica, nos dois sentidos na isotônica
          for (let k = 0; k < N; k++) {
            const a = k / N * TAU + i * .5, f = fr(t * .45 + k * .37), dentro = q.dir > 0 || (q.dir === 0 && k % 2 === 0), r1 = rp * 1.25 + R.s * 4, r2 = rp * .78, rA = dentro ? lerp(r1, r2, f) : lerp(r2, r1, f);
            X.save(); X.globalAlpha *= Math.sin(f * PI) * (on ? 1 : .55); circ(cx + Math.cos(a) * rA, cy + Math.sin(a) * rA, Math.max(3.2, R.s * .7), '#8FD8FF', 'rgba(11,15,28,.6)', 1); X.restore();
          }
          if (on) { X.save(); X.setLineDash([6, 6]); X.lineDashOffset = -t * 12; circ(cx, cy, rp * 1.08, null, '#FFB347', 2); X.restore(); }
          const [lx, ly] = R.pt(q.x, 88), [, sy] = R.pt(q.x, 94);
          tx(q.tipo, lx, ly, { s: 14, w: 700, c: on ? C.txt : C.dim }); tx(q.sub, lx, sy, { s: 13, c: on ? '#8FD8FF' : C.dim });
        });
        // sais dissolvidos: poucos à esquerda, mais no meio, muitos à direita
        const G = rng(4), Z = [[3, 32, 5], [37, 67, 10], [71, 96, 20]];
        Z.forEach(([xa, xb, n]) => { for (let k = 0; k < n; k++) { const x = lerp(xa, xb, G()), y = 4 + G() * 10, [px, py] = R.pt(x, y), dx = Math.sin(t * .8 + k) * 3, dy = Math.cos(t * .7 + k * 1.3) * 3; circ(px + dx, py + dy, Math.max(3, R.s * .5), C_NA, 'rgba(11,15,28,.6)', 1); circ(px + dx + R.s * 1.1, py + dy + 2, Math.max(3.5, R.s * .7), C_CL, 'rgba(11,15,28,.6)', 1); } });
        const [ix, iy] = R.pt(50, 19); tx('íons Na⁺ e Cl⁻ dissolvidos', ix, iy, { s: 13, c: C.dim });
      }
    });
    tok(A.x1 - (NAR ? 60 : 80), A.y0 + 30, 'solução ' + tipo, tipo === 'isotônica' ? C.vit : C.sal);
    cap(c < .3 ? 'Meio muito hipotônico: a água entra até a hemácia estourar (hemólise)' : c < .85 ? 'Meio hipotônico: a água entra e a hemácia incha' : c > .95 ? 'Meio hipertônico: a água sai e a hemácia murcha' : 'Meio isotônico (0,9% de NaCl): a água entra e sai na mesma taxa');
  }
});

// =====================================================================================
// CARBOIDRATOS
// =====================================================================================
// ---------- açúcares em 3D (mol3d.js) ----------
// Anel de seis lados em cadeira (4C1, como a glicose) e de cinco lados em envelope plano (furanose), com todos os átomos.
// Vista de Haworth: eixo z do desenho vira o Y da cena (para cima). OH e H em "up" ou "down" como nos livros.
const SG = (() => {
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], add = v3.s, k = v3.k, n = v3.n, x = v3.x;
  const rot = (v, ax, an) => { const u = n(ax), c = Math.cos(an), s = Math.sin(an), cr = x(u, v), d = dot(u, v) * (1 - c); return [v[0] * c + cr[0] * s + u[0] * d, v[1] * c + cr[1] * s + u[1] * d, v[2] * c + cr[2] * s + u[2] * d]; };
  const alinhar = (v, a, b) => { const ax = x(a, b), s = Math.hypot(ax[0], ax[1], ax[2]), c = dot(a, b); if (s < 1e-6) return c > 0 ? v : rot(v, Math.abs(a[2]) < .9 ? x(a, [0, 0, 1]) : x(a, [1, 0, 0]), PI); return rot(v, ax, Math.atan2(s, c)); };
  const cena = p => [p[0], p[2], -p[1]];
  // construtor de uma unidade: átomos { el, p, tag }, ligações [i, j]
  function unidade() {
    const at = [], lg = [];
    const A = (el, p, tag) => (at.push({ el, p, tag }), at.length - 1), L = (i, j) => lg.push([i, j]);
    // hidroxila no carbono ci, direção d, com H tangente
    const oh = (ci, d, t, tag) => { const c = at[ci].p, o = A('O', add(c, k(d, 1.43)), tag && 'O' + tag), h = A('H', add(at[o].p, k(n(add(k(d, .34), k(t, .94))), .96)), tag && 'H' + tag); L(ci, o); L(o, h); return [o, h]; };
    const hc = (ci, d) => { const h = A('H', add(at[ci].p, k(d, 1.09)), 'Hc'); L(ci, h); return h; };
    // CH2OH: carbono c6 com eixo a; o O sai para o lado radial p
    const met = (ci, a, p) => { const c6 = A('C', add(at[ci].p, k(a, 1.53)), 'C6'); L(ci, c6); const pp = n(sub(p, k(a, dot(p, a)))), q = x(a, pp); const dd = f => add(k(a, .333), k(add(k(pp, Math.cos(f)), k(q, Math.sin(f))), .943));
      const o = A('O', add(at[c6].p, k(dd(0), 1.43)), 'O6'), h = A('H', add(at[o].p, k(n(add(k(dd(0), .34), k(q, .94))), .96)), 'H6'); L(c6, o); L(o, h);
      for (const f of [2.094, -2.094]) { const h2 = A('H', add(at[c6].p, k(dd(f), 1.09)), 'Hc'); L(c6, h2); } return c6; };
    return { at, lg, A, L, oh, hc, met };
  }
  // piranose: C1..C4 com lados cfg.lados (up/down); C5 leva CH2OH para cima
  function piranose(lados) {
    const U = unidade(), R = 1.44, r = [], ref = {};
    for (let q = 0; q < 6; q++) { const th = -q * PI / 3, s = q % 2 ? 1 : -1; r.push(U.A(q === 5 ? 'O' : 'C', [R * Math.cos(th), R * Math.sin(th), s * .25], q === 5 ? 'O5' : 'C' + (q + 1))); }
    for (let q = 0; q < 6; q++) U.L(r[q], r[(q + 1) % 6]);
    const slot = (q, lado) => { const th = -q * PI / 3, s = q % 2 ? 1 : -1, ax = [0, 0, s], eq = n([Math.cos(th), Math.sin(th), -s * .33]); return (lado === 'up') === (s > 0) ? ax : eq; };
    const outro = l => l === 'up' ? 'down' : 'up';
    [...lados, 'up'].forEach((l, q) => {
      const th = -q * PI / 3, t = [-Math.sin(th), Math.cos(th), 0];
      if (q < 4) { const [o, h] = U.oh(r[q], slot(q, l), t, '' + (q + 1)); ref['c' + (q + 1) + 'O'] = o; ref['c' + (q + 1) + 'H'] = h; ref['c' + (q + 1)] = r[q]; }
      else U.met(r[q], slot(q, l), [Math.cos(th), Math.sin(th), 0]);
      U.hc(r[q], slot(q, outro(l)));
    });
    ref.anC = ref.c1; ref.anO = ref.c1O; ref.anH = ref.c1H;
    return { U, ref, ring: r };
  }
  // furanose da frutose: C2 (OH para cima, CH2OH para baixo), C3 (OH up), C4 (OH down), C5 (CH2OH up)
  function furanose() {
    const U = unidade(), R = 1.28, r = [], ref = {}, lado = (th, up) => n([Math.cos(th) * .577, Math.sin(th) * .577, up ? .816 : -.816]);
    for (let q = 0; q < 5; q++) { const th = 18 * PI / 180 - q * 2 * PI / 5; r.push(U.A(q === 4 ? 'O' : 'C', [R * Math.cos(th), R * Math.sin(th), 0], q === 4 ? 'O5' : 'C' + (q + 2))); }
    for (let q = 0; q < 5; q++) U.L(r[q], r[(q + 1) % 5]);
    const T = q => { const th = 18 * PI / 180 - q * 2 * PI / 5; return [-Math.sin(th), Math.cos(th), 0]; }, TH = q => 18 * PI / 180 - q * 2 * PI / 5;
    const [o2, h2] = U.oh(r[0], lado(TH(0), true), T(0), '2'); ref.anC = r[0]; ref.anO = o2; ref.anH = h2; ref.c2 = r[0]; ref.c2O = o2; ref.c2H = h2;
    U.met(r[0], lado(TH(0), false), [Math.cos(TH(0)), Math.sin(TH(0)), 0]);
    U.oh(r[1], lado(TH(1), true), T(1), '3'); U.hc(r[1], lado(TH(1), false));
    U.oh(r[2], lado(TH(2), false), T(2), '4'); U.hc(r[2], lado(TH(2), true));
    U.met(r[3], lado(TH(3), true), [Math.cos(TH(3)), Math.sin(TH(3)), 0]); U.hc(r[3], lado(TH(3), false));
    return { U, ref, ring: r };
  }
  const centro = (u, ring) => { const c = [0, 0, 0]; ring.forEach(i => { c[0] += u.at[i].p[0]; c[1] += u.at[i].p[1]; c[2] += u.at[i].p[2]; }); return k(c, 1 / ring.length); };
  // junta A e B: o O da ponte fica a 1,42 Å do C anomérico de A e o ângulo C-O-C vale cerca de 117°; acha a orientação de B sem choque
  function ligar(a, b, sitio) {
    const U = a.U, V = b.U, cA = U.at[a.ref.anC].p, oA = U.at[a.ref.anO].p, hA = a.ref.anH;
    const rC = sitio === 'c4' ? b.ref.c4 : b.ref.anC, rO = sitio === 'c4' ? b.ref.c4O : b.ref.anO, rH = sitio === 'c4' ? b.ref.c4H : b.ref.anH;
    const dA = n(sub(oA, cA)), Ob = add(cA, k(dA, 1.42)), cB = V.at[rC].p, dB = n(sub(V.at[rO].p, cB)), u = k(dA, -1);
    const e1 = n(x(u, Math.abs(u[2]) < .9 ? [0, 0, 1] : [1, 0, 0])), e2 = x(u, e1), a117 = 117 * PI / 180;
    let best = null;
    for (let ps = 0; ps < 360; ps += 12) for (let ch = 0; ch < 360; ch += 12) {
      const w = add(k(u, Math.cos(a117)), k(add(k(e1, Math.cos(ps * PI / 180)), k(e2, Math.sin(ps * PI / 180))), Math.sin(a117))), nw = k(w, -1), cN = add(Ob, k(w, 1.43));
      const mover = p => add(cN, rot(alinhar(sub(p, cB), dB, nw), nw, ch * PI / 180));
      let m = 99; const P = V.at.map(q => mover(q.p));
      U.at.forEach((q, i) => { if (i === a.ref.anO || i === hA) return; P.forEach((p2, j) => { if (j === rO || j === rH) return; const d = Math.hypot(q.p[0] - p2[0], q.p[1] - p2[1], q.p[2] - p2[2]); if (d < m) m = d; }); });
      if (!best || m > best.m) best = { m, P };
    }
    return { Ob, P: best.P, rC, rO, rH, folga: best.m };
  }
  return { piranose, furanose, ligar, cena, centro, rot, sub, add, k, n };
})();
const SU = [];
function sugarMontar(M) {
  const FR = {
    glc: ['Glicose', 'Monossacarídeo C₆H₁₂O₆ em anel de seis lados, na forma de cadeira. É o combustível das células: feita na fotossíntese e quebrada na respiração.'],
    fru: ['Frutose', 'Monossacarídeo C₆H₁₂O₆ em anel de cinco lados. Está nas frutas e no mel e é mais doce do que a glicose.'],
    gal: ['Galactose', 'Monossacarídeo C₆H₁₂O₆ igual à glicose, exceto pela posição de uma OH (no carbono 4). Vem da lactose do leite.']
  };
  const DEF = [
    { id: 'sac', nome: 'Sacarose', a: ['glc', () => SG.piranose(['down', 'down', 'up', 'down'])], b: ['fru', () => SG.furanose()], sitio: 'an' },
    { id: 'lac', nome: 'Lactose', a: ['gal', () => SG.piranose(['up', 'down', 'up', 'up'])], b: ['glc', () => SG.piranose(['up', 'down', 'up', 'down'])], sitio: 'c4' },
    { id: 'mal', nome: 'Maltose', a: ['glc', () => SG.piranose(['down', 'down', 'up', 'down'])], b: ['glc', () => SG.piranose(['up', 'down', 'up', 'down'])], sitio: 'c4' }
  ];
  SU.length = 0;
  DEF.forEach(D => {
    const a = D.a[1](), b = D.b[1](), L = SG.ligar(a, b, D.sitio), id = D.id;
    // coordenadas finais no mundo do desenho
    const PA = a.U.at.map(q => q.p), PB = L.P, cA = SG.centro(a.U, a.ring), cB = SG.centro({ at: PB.map(p => ({ p })) }, b.ring);
    const sc = SG.cena, sA = sc(cA), sB = sc(cB), phi = Math.atan2(sB[2] - sA[2], sB[0] - sA[0]), mid = [(sA[0] + sB[0]) / 2, (sA[1] + sB[1]) / 2, (sA[2] + sB[2]) / 2];
    const Y = p => { const q = sc(p), d = [q[0] - mid[0], q[1] - mid[1], q[2] - mid[2]], c = Math.cos(phi), s = Math.sin(phi); return [d[0] * c + d[2] * s, d[1], -d[0] * s + d[2] * c]; };
    const nomeA = FR[D.a[0]], nomeB = FR[D.b[0]], gA = id + 'A', gB = id + 'B', gL = id + 'L', gW = id + 'W';
    M.grupo(gA, { nome: nomeA[0], cor: C.carb, frase: nomeA[1] }); M.grupo(gB, { nome: nomeB[0], cor: C.carb, frase: nomeB[1] });
    M.grupo(gL, { nome: 'Ligação glicosídica', cor: C.o, frase: 'Ponte C–O–C entre dois monossacarídeos. Surge quando eles se unem e perdem uma molécula de água (síntese por desidratação) e se desfaz na hidrólise, com ajuda de enzimas como sacarase, lactase e maltase.' });
    M.grupo(gW, { nome: 'Água', cor: C.aguaM, frase: 'Sai na síntese por desidratação e entra na hidrólise. É feita de um oxigênio e dois hidrogênios que estavam nas hidroxilas (OH) dos açúcares.' });
    M.no(id, { origem: [0, 0, 0] }); const oB = Y(PB[L.rC]); M.no(id + 'b', { pai: id, origem: oB });
    const iA = a.U.at.map((q, i) => M.atomo(q.el, Y(PA[i]), { no: id, grupo: gA })), iB = b.U.at.map((q, i) => M.atomo(q.el, Y(PB[i]), { no: id + 'b', grupo: gB }));
    const bd = (I, Ls) => Ls.forEach(([i, j]) => M.ligacao(I[i], I[j], { raio: .11 }));
    bd(iA, a.U.lg); bd(iB, b.U.lg);
    // átomo da ponte (aparece quando a água sai) e a molécula de água liberada
    const Ob = Y(L.Ob), ponte = M.atomo('O', Ob, { no: id, grupo: gL, nome: 'Oxigênio da ligação glicosídica', frase: 'Liga o carbono 1 de um açúcar ao outro. É o que sobra das duas hidroxilas depois que a água sai.' });
    M.ligacao(iA[a.ref.anC], ponte); M.ligacao(ponte, iB[L.rC]);
    M.no(gW, { pai: id, origem: Ob });
    const out = SG.n([0, .9, .45]), ca = Math.cos(52.2 * PI / 180), sa = Math.sin(52.2 * PI / 180), hd = f => SG.n([out[0] * ca + f * sa, out[1] * ca, out[2] * ca]);
    const wo = M.atomo('O', Ob, { no: gW, grupo: gW }), wh1 = M.atomo('H', SG.add(Ob, SG.k(hd(1), OH)), { no: gW, grupo: gW }), wh2 = M.atomo('H', SG.add(Ob, SG.k(hd(-1), OH)), { no: gW, grupo: gW });
    M.ligacao(wo, wh1); M.ligacao(wo, wh2);
    M.rotulo(ponte, 'ligação glicosídica', 0); M.rotulo(iA[a.ring[5]], nomeA[0].toLowerCase(), 1); M.rotulo(iB[b.ring[b.ring.length - 1]], nomeB[0].toLowerCase(), 2); M.rotulo(wo, 'água', 3);
    const o1 = iA[a.ref.anO], h1 = iA[a.ref.anH], o2 = iB[L.rO], h2 = iB[L.rH];
    SU.push({ id, nome: D.nome, no: M.nos[id], nb: M.nos[id + 'b'], nw: M.nos[gW], ponte, reag: [o1, h1, o2, h2], out, gs: [gA, gB, gL, gW], nomes: [nomeA[0], nomeB[0], 'Ligação glicosídica', 'Água'], qA: nomeA[0].toLowerCase(), qB: nomeB[0].toLowerCase() });
  });
  M.vista = { th: -.45, fi: .55, zoom: 1 };
}
const sugarC = P => P.tp > 1e6 ? 6.8 : P.tp % 14;
function sugarAnimar(M, P) {
  const v = cl(P.passo, 0, 2), c = sugarC(P), seg2 = (a, b) => ss(seg(c, a, b));
  const j = seg2(1.2, 3.4) - seg2(11.3, 13.5), rx = seg2(3.4, 4.3) - seg2(10.6, 11.3), wp = seg2(4.3, 5.8) - seg2(9.2, 10.6), ap = P.tp > 1e6 ? 1 : ss(P.tp / .3);
  SU.forEach((s, q) => {
    const on = q === v; s.no.esc = on ? Math.max(.001, ap) : .0001;
    ['A', 'B', 'L', 'W'].forEach((l, i) => { M.grupos[s.gs[i]].nome = on ? s.nomes[i] : ''; });
    if (!on) return;
    s.nb.pos = [5.6 * (1 - j), 0, 0]; s.nb.rot = [0, .5 * (1 - j), 0];
    s.reag.forEach(i => { M.atomos[i].esc = 1 - ss(rx / .6); }); M.atomos[s.ponte].esc = ss((rx - .3) / .5);
    s.nw.pos = s.out.map(x => x * 5.2 * wp); s.nw.esc = Math.max(.001, ss(rx * 1.6));
  });
  M.enquadrar(1.3);
}
function sugarLegenda(P) {
  const s = SU[cl(P.passo, 0, 2)], c = sugarC(P), nm = s.nome, a = s.qA, b = s.qB;
  return c < 1.2 ? `${nm}: ${a} e ${b}, dois monossacarídeos separados` : c < 3.4 ? `${nm}: os dois monossacarídeos se aproximam` : c < 5.8 ? 'Síntese por desidratação: forma-se a ligação glicosídica e sai uma molécula de água' : c < 9.2 ? `${nm} (dissacarídeo): ${a} e ${b} unidos pela ligação glicosídica` : c < 11.3 ? 'Hidrólise (digestão): a água entra e quebra a ligação' : 'De volta aos monossacarídeos, que a célula absorve';
}

{
  const DIS = [['sacarose', ['glicose', 6], ['frutose', 5], 'açúcar de mesa (cana, beterraba)'], ['lactose', ['glicose', 6], ['galactose', 6], 'açúcar do leite'], ['maltose', ['glicose', 6], ['glicose', 6], 'surge na digestão do amido']];
  def('carb', 'mono-di', MOL3D.cena({
    t: 'Monossacarídeos e dissacarídeos', s: 'ligação glicosídica e hidrólise', c: C.carb, loc: 'Moléculas de açúcar em 3D', still: 6,
    ctl: escolha('Dissacarídeo', DIS.map(d => d[0]), 14),
    alt: 'Dois monossacarídeos se unem, liberando uma molécula de água, e formam um dissacarídeo; depois a água volta e os separa',
    d: `<p><b>Carboidratos (glicídios ou açúcares) são a principal fonte de energia das células.</b> São formados por carbono, hidrogênio e oxigênio, em geral na proporção (CH₂O)ₙ.</p>
<p>Os <b>monossacarídeos</b> são os açúcares simples, que não se quebram em açúcares menores: <b>glicose</b> (o combustível das células), frutose (das frutas e do mel), galactose, e as pentoses <b>ribose</b> (do RNA) e <b>desoxirribose</b> (do DNA). A glicose, C₆H₁₂O₆, é feita na fotossíntese e quebrada na respiração.</p>
<p>Dois monossacarídeos se unem por uma <b>ligação glicosídica</b>, com a saída de uma molécula de água (<b>síntese por desidratação</b>), formando um <b>dissacarídeo</b>. Na digestão ocorre o contrário: a água entra e separa as unidades (<b>hidrólise</b>), com ajuda de enzimas como a sacarase e a lactase.</p>`,
    kv: [['Monossacarídeos', 'glicose, frutose, galactose, ribose, desoxirribose'], ['Sacarose', 'glicose + frutose'], ['Lactose', 'glicose + galactose'], ['Maltose', 'glicose + glicose'], ['Energia', 'cerca de 4 kcal por grama']],
    enem: 'A intolerância à lactose é tema recorrente: sem a enzima lactase, a lactose não é quebrada no intestino delgado, chega ao intestino grosso e é fermentada por bactérias, causando gases e diarreia. Também cai a montagem e a quebra de moléculas (desidratação × hidrólise) e o diabetes (glicose no sangue e insulina).',
    links: [['ATP e respiração (Bioenergética)', '../bioenergetica/index.html#resp/glicolise'], ['Enzimas', '#enz']],
    montar: sugarMontar, animar: sugarAnimar, legenda: sugarLegenda,
    // desenho plano antigo: só aparece se o 3D não abrir neste navegador
    plano(t, S) {
      const A = area(), dsc = DIS[Math.round(S.v)], p = fr(t * .09), r = NAR ? 26 : 40, cx = A.cx, cy = A.y0 + A.h * (NAR ? .36 : .4), gap = NAR ? 54 : 84;
      const j = p < .3 ? 0 : p < .45 ? ss((p - .3) / .15) : p < .7 ? 1 : p < .85 ? 1 - ss((p - .7) / .15) : 0;
      const sep = lerp(NAR ? A.w * .34 : A.w * .3, gap / 2 + r * .6, j), x1 = cx - sep, x2 = cx + sep;
      const [n1, k1] = dsc[1], [n2, k2] = dsc[2];
      anel(x1, cy, r, k1, C.carb); anel(x2, cy, r * (k2 === 5 ? .9 : 1), k2, C.carb);
      tx(n1, x1, cy + r + 16, { s: 13, w: 600 }); tx(n2, x2, cy + r + 16, { s: 13, w: 600 });
      // ligação glicosídica com o O
      if (j > .02) { X.save(); X.globalAlpha = j; line(x1 + r * .9, cy, x2 - r * .9, cy, 'rgba(232,237,247,.8)', 2.5); circ(cx, cy, 8, C.o, '#0B0F1C', 1); X.restore(); if (j > .9) lab(cx, cy, cx + 30, cy - r - 30, 'ligação glicosídica'); }
      const fH = seg(p, .32, .62), fB = seg(p, .7, .86);
      if (fH > 0 && fH < 1) { const [hx2, hy2] = qpt(cx, cy, cx, cy + r * 1.5, cx + (NAR ? 40 : 120), cy + r * 2.2, fH); h2o(hx2, hy2, 10, -PI / 2, { a: Math.sin(fH * PI) * 1.5 }); tx('sai H₂O', hx2 + 18, hy2, { a: 'left', s: 12, c: C.aguaM }); }
      if (fB > 0 && fB < 1) { const [hx2, hy2] = qpt(cx - (NAR ? 40 : 120), cy + r * 2.2, cx, cy + r * 1.5, cx, cy, fB); h2o(hx2, hy2, 10, -PI / 2, { a: Math.sin(fB * PI) * 1.5 }); tx('entra H₂O', hx2 - 18, hy2, { a: 'right', s: 12, c: C.aguaM }); }
      head(j > .5 ? dsc[0] + ' (dissacarídeo)' : 'dois monossacarídeos', cx, A.y0 + 14, j > .5 ? C.carb : C.txt);
      if (j > .5) tx(dsc[3], cx, A.y0 + 36, { s: 13, c: C.dim });
      // linha de baixo: classes
      const yb = A.y1 - (NAR ? 70 : 54), cols = [['monossacarídeos', 'glicose, frutose, ribose'], ['dissacarídeos', 'sacarose, lactose, maltose'], ['polissacarídeos', 'amido, glicogênio, celulose']];
      cols.forEach(([h, e], k) => { const x = NAR ? A.x0 + 6 : A.x0 + A.w * (k / 3) + 10, y = NAR ? yb + k * 22 : yb; tx(h, x, y, { a: 'left', s: 13, w: 700, c: C.carb, bg: false }); tx(e, NAR ? x + 128 : x, NAR ? y : y + 20, { a: 'left', s: 12, c: C.dim, bg: false }); });
      cap(p < .3 ? 'Dois monossacarídeos se aproximam' : p < .7 ? 'Síntese por desidratação: forma-se a ligação glicosídica e sai uma molécula de água' : p < .86 ? 'Hidrólise (digestão): a água entra e separa as unidades' : 'De volta aos monossacarídeos, que a célula absorve');
    }
  }));
}
{
  const POL = ['amido', 'glicogênio', 'celulose', 'quitina'];
  const INFO = [
    ['reserva de energia das plantas', 'grãos, batata, mandioca', 'ligações α: digerível (amilase)'],
    ['reserva de energia dos animais e fungos', 'fígado e músculos (nos animais)', 'muito ramificado: libera glicose depressa'],
    ['parede celular das plantas', 'fibras dos vegetais', 'ligações β: não digerimos; vira fibra alimentar'],
    ['exoesqueleto dos artrópodes e parede dos fungos', 'carapaça de insetos e crustáceos', 'glicose com nitrogênio (N-acetilglicosamina)']
  ];
  // figuras de IA (figura-ia.js): células de batata com grãos de amido (A) e amido ao lado de glicogênio (B); a cadeia em detalhe fica numa lupa ao lado
  const POL_FIG = window.LAB_FIGIA ? LAB_FIGIA({
    nome: 'Células de batata cheias de grãos de amido e, ao lado, um grão de amido e uma partícula de glicogênio', mask: { miolo: .7, borda: 1 },
    vistas: [{ id: 'a', img: 'biologia-molecular-carb-polissacarideos-a', nome: 'Batata' }, { id: 'b', img: 'biologia-molecular-carb-polissacarideos-b', nome: 'Amido e glicogênio' }],
    hs: [
      { id: 'graos', c: C.carb, em: { a: [30, 40] }, t: 'Grão de amido', d: 'A batata guarda glicose como amido, em grãos de camadas dentro das células. Ligações do tipo α: a amilase digere.', z: 2.4 },
      { id: 'parede', c: '#8FD8FF', em: { a: [57, 38] }, t: 'Parede celular', d: 'É feita de celulose, também de glicose, mas com ligações do tipo β. Nós não digerimos: vira fibra alimentar.', z: 2.6 },
      { id: 'cloro', c: '#7FE0A2', em: { a: [78, 62] }, t: 'Cloroplastos', d: 'Pontos verdes entre os grãos: as plantas fazem a glicose na fotossíntese e guardam o excesso como amido.', z: 2.6 },
      { id: 'amido', c: C.carb, em: { b: [25, 45] }, t: 'Grão de amido', d: 'Camadas de amilose, em hélice, e amilopectina, pouco ramificada (mais que a amilose, menos que o glicogênio). É a reserva de energia das plantas.', z: 2.4 },
      { id: 'glicogenio', c: '#FF8A7A', em: { b: [80, 40] }, t: 'Glicogênio', d: 'Partícula muito ramificada, reserva de animais e fungos no fígado e nos músculos.', z: 2.2 },
      { id: 'pontas', c: '#FFB347', em: { b: [73, 55] }, t: 'Muitas pontas', d: 'Cada ponta pode soltar glicose ao mesmo tempo, por isso o glicogênio libera energia depressa.', z: 3 }
    ]
  }) : null;
  // cadeia em detalhe, dentro da lupa: amido em hélice girando, glicogênio ramificado, celulose e quitina em cadeias retas lado a lado
  function poliLupa(i, cx, cy, rP, t, paused) {
    const r = NAR ? 5.5 : Math.max(7.5, rP * .085), sp = r * 1.9, u = (x, y, n, a) => { X.save(); X.globalAlpha *= a == null ? 1 : a; anel(x, y, r, 6, C.carb); if (n) circ(x + r * .6, y - r * .6, 4, C.n, '#0B0F1C', 1); X.restore(); };
    circ(cx, cy, rP, 'rgba(19,26,43,.82)', C.line, 1.5); X.save(); X.beginPath(); X.arc(cx, cy, rP - 2, 0, TAU); X.clip();
    if (i === 0) {
      const n = Math.floor(rP * 1.75 / sp), ph = paused ? 0 : t * 1.4, P = [];
      for (let j = 0; j < n; j++) { const a = ph - j * .75; P.push([cx - rP * .85 + j * sp, cy + Math.sin(a) * rP * .3, Math.cos(a)]); }
      poly(P.map(q => [q[0], q[1]]), 'rgba(232,237,247,.3)', 2);
      [-1, 1].forEach(side => P.forEach((q, j) => { if ((q[2] < 0) !== (side < 0)) return; u(q[0], q[1], false, side < 0 ? .5 : 1); if (side > 0 && j % 8 === 3) for (let b = 1; b < 4; b++) u(q[0] + b * sp * .45, q[1] - Math.sign(Math.sin(j + 1) || 1) * b * sp * .85, false, .9); }));
    } else if (i === 1) {
      const tree = (x, y, a, d) => { if (d > 2) return; let px = x, py = y; for (let s2 = 0; s2 < 3; s2++) { px += Math.cos(a) * sp; py += Math.sin(a) * sp; u(px, py); } tree(px, py, a - .55, d + 1); tree(px, py, a + .55, d + 1); };
      u(cx, cy); for (let b = 0; b < 4; b++) tree(cx, cy, b / 4 * TAU + .4 + (paused ? 0 : t * .05), 1); circ(cx, cy, r * 1.2, null, '#fff', 2);
    } else {
      const rows = 3, n = Math.floor(rP * 1.8 / sp);
      for (let rw = 0; rw < rows; rw++) { const y = cy + (rw - 1) * r * 3.3; for (let j = 0; j < n; j++) u(cx - rP * .85 + j * sp + (rw % 2) * sp * .5, y, i === 3); if (rw < rows - 1) for (let j = 1; j < n; j += 2) line(cx - rP * .85 + j * sp + (rw % 2) * sp * .5, y + r, cx - rP * .85 + j * sp + (rw % 2) * sp * .5 + sp * .25, y + r * 2.3, rgba(C.agua, .4 + .3 * (.5 + .5 * Math.sin(t * 2))), 1.5, [2, 3]); }
    }
    X.restore();
  }
  def('carb', 'polissacarideos', {
    t: 'Polissacarídeos', s: 'amido, glicogênio, celulose e quitina', c: C.carb, loc: 'Cadeias de monossacarídeos', still: 0,
    ctl: escolha('Polissacarídeo', POL, 7),
    alt: 'Cadeias de anéis de glicose: o amido em hélice e pouco ramificado, o glicogênio muito ramificado, a celulose em cadeias retas paralelas e a quitina com nitrogênio',
    d: `<p><b>Polissacarídeos são cadeias de centenas a milhares de monossacarídeos.</b> A maioria é feita de glicose (a quitina, de um derivado dela, com nitrogênio); o que muda é o tipo de ligação e o formato da cadeia, e isso muda a função.</p>
<p><b>Amido</b> e <b>glicogênio</b> são reservas de energia. O amido, das plantas, tem ligações do tipo α e mistura a amilose, em hélice e sem ramificações, com a amilopectina, que tem poucas. O glicogênio, dos animais e fungos, é muito ramificado e, nos animais, fica no fígado e nos músculos: tem muitas pontas de onde a glicose pode ser solta ao mesmo tempo.</p>
<p>A <b>celulose</b> tem ligações do tipo β, que deixam a cadeia reta. As cadeias se alinham lado a lado, unidas por ligações de hidrogênio, e formam fibras resistentes: é a parede celular das plantas. Nós não temos enzima para quebrar a ligação β; a celulose passa pelo intestino como <b>fibra alimentar</b>. Ruminantes e cupins a digerem graças a microrganismos que vivem no seu tubo digestório. A <b>quitina</b>, um polissacarídeo com nitrogênio, forma o exoesqueleto dos artrópodes e a parede dos fungos.</p>`,
    kv: [['Amido', 'reserva vegetal; ligações α'], ['Glicogênio', 'reserva de animais e fungos; fígado e músculos'], ['Celulose', 'parede celular; ligações β; fibra'], ['Quitina', 'exoesqueleto de artrópodes; parede de fungos']],
    enem: 'O contraste mais cobrado é amido × celulose: os dois são feitos de glicose, mas só o amido é digerido por nós, porque temos amilase para a ligação α e não temos enzima para a ligação β. Ruminantes digerem celulose com a ajuda de microrganismos (mutualismo). Teste do iodo: o amido fica azul-escuro.',
    links: [['Parede celular (Célula)', '../celula/index.html'], ['Mono e dissacarídeos', '#carb/mono-di']],
    draw(t, S) {
      const A = area(), i = Math.round(S.v), nar = NAR;
      const box = nar ? { x: A.x0, y: A.y0, w: A.w, h: A.h * .38 } : { x: A.x0, y: A.y0, w: A.w * .46, h: A.h };
      if (POL_FIG) POL_FIG.desenhar(X, box, {
        vista: i === 1 ? 'b' : 'a',
        sobre(R) {
          // o polissacarídeo escolhido ganha um anel que respira sobre a figura (celulose e quitina não têm grão: a parede da batata, para a celulose)
          const alvo = R.vista === 'a' ? (i === 0 ? [[30, 40, 9]] : i === 2 ? [[57, 38, 7]] : []) : (i === 0 ? [[25, 45, 14]] : i === 1 ? [[80, 40, 13]] : []);
          alvo.forEach(([x, y, r]) => { const [px, py] = R.pt(x, y), k = S.paused ? .5 : .5 + .5 * Math.sin(t * 2.2); circ(px, py, R.s * (r + k * 1.5), null, rgba('#FFB347', .5 + .4 * k), 2.5); });
        }
      });
      const rP = nar ? Math.min(A.w * .21, A.h * .15) : Math.min(A.w * .14, A.h * .33), cx = nar ? A.x0 + rP + 6 : A.x0 + A.w * .5 + rP + 6, cy = nar ? A.y0 + A.h * .38 + rP + 18 : A.y0 + rP + 30;
      poliLupa(i, cx, cy, rP, t, S.paused);
      tx('cadeia em detalhe', cx, cy - rP - 14, { s: 12, c: C.dim });
      const legenda = ['amilose em hélice, sem ramificações; a amilopectina tem poucas', 'muitas pontas: a glicose sai depressa', 'cadeias retas lado a lado: fibras resistentes', 'cadeias retas com nitrogênio (N azul)'][i];
      para(legenda, cx, cy + rP + 14, rP * 2 + 24, { a: 'center', s: 13, lh: 16, c: C.dim });
      const qx = cx + rP + 20, qw = A.x1 - qx - 4; let y = nar ? cy - rP + 6 : A.y0 + 24;
      tx(POL[i], qx, y, { a: 'left', f: FH, s: nar ? 18 : 24, w: 700, c: C.carb, bg: false }); y += nar ? 26 : 36;
      for (const [h, s] of [['função', INFO[i][0]], ['onde', INFO[i][1]], ['detalhe', INFO[i][2]]]) { tx(h, qx, y, { a: 'left', s: 12, w: 700, c: C.dim, bg: false }); y += 17; y += para(s, qx, y, qw, { s: nar ? 13 : 15, lh: nar ? 17 : 21 }) + (nar ? 4 : 12); }
      cap(['Amido: reserva das plantas, digerível pela amilase', 'Glicogênio: reserva de animais e fungos, muito ramificado', 'Celulose: glicose em cadeias retas (ligação β), que não digerimos', 'Quitina: polissacarídeo com nitrogênio do exoesqueleto e dos fungos'][i]);
    }
  });
}
