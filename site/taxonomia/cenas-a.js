/* LAB, módulo Taxonomia. Cenas: História (Aristóteles, Lineu) e Categorias (hierarquia).
   Código da equipe (Aurelius). Textos: roteiro do Taxon (docs/revisao-biologia/taxonomia-roteiro.md). */
'use strict';
{
  const HIST = '#D8C08A';
  // caramujo: ícone só deste arquivo
  BICHOS.caramujo = (c) => {
    X.beginPath(); X.moveTo(-.95, .45); X.quadraticCurveTo(-.2, .3, .7, .45); X.lineTo(.95, .45); X.quadraticCurveTo(.6, .6, -.95, .6); X.closePath(); X.fill(); X.stroke();
    X.beginPath(); X.arc(-.05, .02, .45, 0, TAU); X.fill(); X.stroke();
    X.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU * 1.6, r = .38 * (1 - i / 48); i ? X.lineTo(-.05 + Math.cos(a) * r, .02 + Math.sin(a) * r) : X.moveTo(-.05 + Math.cos(a) * r, .02 + Math.sin(a) * r); } X.stroke();
    X.beginPath(); X.moveTo(.75, .45); X.lineTo(.85, .05); X.moveTo(.88, .45); X.lineTo(1, .1); X.stroke();
  };
  const toque = S => { const now = performance.now(), ok = now - (S.tapT || 0) > 220; S.tapT = now; return ok; };
  const ano = v => v < 0 ? `${Math.round(-v)} a.C.` : `${Math.round(v)}`;

  // =====================================================================================
  // H1 ANTES DE LINEU: cartões de animais em "com sangue" e "sem sangue"
  // =====================================================================================
  // s = 1 com sangue (vertebrado hoje); g = grupo atual
  const GR = {
    mam: ['mamífero', C.animalia], ave: ['ave', '#7CC8FF'], rep: ['réptil', C.ord], anf: ['anfíbio', C.cla], pei: ['peixe', C.filo],
    mol: ['molusco', C.proto], ins: ['inseto', C.fam], cru: ['crustáceo', C.gen], ara: ['aracnídeo', '#D9A0E8'], ane: ['anelídeo', C.esp], equ: ['equinodermo', '#C9D3F0']
  };
  const AN = [
    ['onça', 'onca', 1, 'mam', 'vivíparo'], ['polvo', 'polvo', 0, 'mol'], ['sapo', 'sapo', 1, 'anf', 'ovíparo'], ['abelha', 'abelha', 0, 'ins'],
    ['peixe', 'peixe', 1, 'pei', 'ovíparo'], ['caranguejo', 'caranguejo', 0, 'cru'], ['pássaro', 'ave', 1, 'ave', 'ovíparo'], ['minhoca', 'minhoca', 0, 'ane'],
    ['cobra', 'cobra', 1, 'rep', 'ovíparo'], ['aranha', 'aranha', 0, 'ara'], ['baleia', 'baleia', 1, 'mam', 'vivíparo'], ['estrela-do-mar', 'estrela', 0, 'equ'],
    ['cavalo', 'cavalo', 1, 'mam', 'vivíparo'], ['borboleta', 'borboleta', 0, 'ins'], ['lagarto', 'lagarto', 1, 'rep', 'ovíparo'], ['caramujo', 'caramujo', 0, 'mol']
  ].map(([n, ic, s, g, rep], i) => ({ i, n, ic, s, g, rep }));
  const CX_A = [{ t: 'Com sangue', sub: 'sangue vermelho', c: C.esp }, { t: 'Sem sangue', sub: 'sem sangue vermelho', c: '#9DA9C4' }];
  const CX_H = [{ t: 'Vertebrados', sub: 'com coluna vertebral', c: C.cla }, { t: 'Invertebrados', sub: 'sem coluna vertebral', c: C.fam }];
  const MARCOS = [
    [-350, 'cerca de 350 a.C.', 'Aristóteles descreve cerca de 500 tipos de animais: com sangue e sem sangue'],
    [-300, 'cerca de 300 a.C.', 'Teofrasto, aluno de Aristóteles, separa cerca de 500 plantas em árvores, arbustos e ervas'],
    [1500, 'séculos XVI e XVII', 'as grandes navegações trazem milhares de seres desconhecidos; cada estudioso usa uma frase longa em latim'],
    [1686, '1686', 'John Ray usa a palavra espécie no sentido biológico: seres que geram filhos parecidos com eles'],
    [1735, '1735', 'Lineu publica o <i>Systema Naturae</i>, com categorias encaixadas'],
    [1758, '1758', 'a 10ª edição do <i>Systema Naturae</i> é o marco da nomenclatura binomial dos animais']
  ];
  // escala da linha do tempo: Antiguidade (380 a 270 a.C.), corte, e 1480 a 1760
  function tl(v, x0, w) {
    const a = .24, gap = .07;
    if (v <= -270) return x0 + w * a * seg(v, -380, -270);
    if (v < 1480) return x0 + w * (a + gap * seg(v, -270, 1480));
    return x0 + w * (a + gap + (1 - a - gap) * seg(v, 1480, 1760));
  }
  function layA(A) {
    const g = NAR ? 5 : 8, tlH = NAR ? 66 : 58, hd = NAR ? 30 : 40, ext = NAR ? 0 : 24;
    const sc = NAR ? 4 : 8, sr = NAR ? 4 : 2, bc = 4, br = 2, stack = NAR;
    const tly = A.y1 + ext - tlH, cw = (A.w - (sc - 1) * g) / sc;
    const rows = sr + (stack ? 2 * br : br), hh = stack ? 2 * hd : hd;
    const ch = Math.min(NAR ? 52 : 66, (tly - A.y0 - hh - 22 - rows * g - (stack ? 8 : 0)) / rows);
    const shelf = i => [A.x0 + (i % sc) * (cw + g), A.y0 + Math.floor(i / sc) * (ch + g)];
    const yb = A.y0 + sr * (ch + g) + 6;
    const bw = stack ? A.w : (A.w - 16) / 2, bh = stack ? (tly - 10 - yb - 8) / 2 : tly - 10 - yb, bcw = (bw - 12 - (bc - 1) * g) / bc;
    const box = k => ({ x: stack ? A.x0 : A.x0 + k * (bw + 16), y: stack ? yb + k * (bh + 8) : yb, w: bw, h: bh });
    const slot = (k, j) => { const b = box(k); return [b.x + 6 + (j % bc) * (bcw + g), b.y + hd + Math.floor(j / bc) * (ch + g)]; };
    return { cw, ch, bcw, shelf, box, slot, tl: { x: A.x0, y: tly, w: A.w, h: tlH } };
  }
  function placeA(S, c, k) { // põe o cartão c na caixa k
    S.where[c.i] = k; S.order[k] = S.order[k].filter(i => i !== c.i).concat([c.i]);
  }
  function soltar(S, i, k) {
    const c = AN[i], certo = (c.s ? 0 : 1) === k;
    S.sel = null;
    if (S.hoje) { S.msg = 'No modo "Ver hoje" os cartões já estão nos grupos atuais. Toque em "Ver hoje" de novo para voltar.'; return; }
    if (certo) {
      placeA(S, c, k);
      const left = AN.filter(a => S.where[a.i] == null).length;
      S.msg = left ? `Isso: Aristóteles poria ${art(c)} entre os <b>${k ? 'sem sangue' : 'com sangue'}</b>.${c.s ? ` Dentro do grupo, ele ainda separava os ${c.rep === 'vivíparo' ? '<b>vivíparos</b> (parem filhotes)' : '<b>ovíparos</b> (põem ovos)'}.` : ''} Faltam ${left}.`
        : 'Pronto, como Aristóteles. Agora toque em "Ver hoje" para comparar com a classificação atual.';
    } else {
      S.bounce[i] = 1;
      S.msg = `Olhe de novo: ${art(c)} ${c.s ? 'tem sangue vermelho' : 'não tem sangue vermelho'}. Aristóteles poria esse animal entre os <b>${c.s ? 'com sangue' : 'sem sangue'}</b>.`;
    }
  }
  const art = c => ({ 'onça': 'a onça', 'polvo': 'o polvo', 'sapo': 'o sapo', 'abelha': 'a abelha', 'peixe': 'o peixe', 'caranguejo': 'o caranguejo', 'pássaro': 'o pássaro', 'minhoca': 'a minhoca', 'cobra': 'a cobra', 'aranha': 'a aranha', 'baleia': 'a baleia', 'estrela-do-mar': 'a estrela-do-mar', 'cavalo': 'o cavalo', 'borboleta': 'a borboleta', 'lagarto': 'o lagarto', 'caramujo': 'o caramujo' }[c.n]);
  function zeraA(S) { S.where = {}; S.order = [[], []]; S.sel = null; S.hoje = false; S.auto = 0; S.msg = null; S.bounce = {}; }
  function organizar(S) { zeraA(S); S.auto = 1; S.autoT = 0; }

  def('historia', 'aristoteles', {
    t: 'Antes de Lineu', s: 'com sangue, sem sangue, e uma escada da natureza', c: HIST,
    loc: 'De Aristóteles a John Ray', alt: 'dezesseis cartões de animais para separar em com sangue e sem sangue, como Aristóteles, e depois em vertebrados e invertebrados, com uma linha do tempo de 350 a.C. a 1758',
    ctl: { l: 'Ano', min: -350, max: 1758, step: 1, v: -350, f: ano, rate: () => 1 },
    auto: S => S.v > -270 && S.v < 1480 ? 900 : 42, still: 0, stillV: 1758,
    extra: [
      { t: 'Organizar como Aristóteles', on: S => organizar(S), pressed: () => false },
      { t: 'Ver hoje', on: S => { if (S.hoje) { S.hoje = false; S.msg = null; } else { AN.forEach(c => { if (S.where[c.i] == null) placeA(S, c, c.s ? 0 : 1); }); S.hoje = true; S.sel = null; S.auto = 0; S.msg = null; } }, pressed: S => !!S.hoje },
      { t: 'Misturar', on: S => zeraA(S), pressed: () => false }
    ],
    init(S) { zeraA(S); S.pos = {}; },
    d: `<p>Classificar é juntar em grupos o que se parece e separar o que é diferente. Toda cultura faz isso com plantas e animais que come, cultiva ou teme. O primeiro sistema escrito que conhecemos é o do filósofo grego <b>Aristóteles</b> (384-322 a.C.), que descreveu cerca de <b>500 tipos de animais</b> e os dividiu em dois grandes grupos: os <b>com sangue</b> (vermelho), que hoje correspondem mais ou menos aos vertebrados, e os <b>sem sangue</b>, como insetos, polvos e crustáceos. Dentro deles, separou os animais pelo modo de reprodução (vivíparos, que parem filhotes, e ovíparos, que põem ovos) e pelo ambiente. Seu aluno <b>Teofrasto</b> fez o mesmo com cerca de 500 plantas, separadas em árvores, arbustos e ervas.</p>
<p>Aristóteles também imaginou a <b>escada da natureza</b> (<i>scala naturae</i>): os seres em degraus, dos mais "simples" aos mais "perfeitos", com o ser humano no topo. Essa ideia durou quase 2 mil anos. Nos séculos XVI e XVII, as grandes navegações trouxeram para a Europa milhares de plantas e animais desconhecidos, e os nomes viraram um caos: cada estudioso descrevia uma planta com uma frase longa em latim, diferente da do outro. O inglês <b>John Ray</b> (1686) foi um dos primeiros a usar a palavra <b>espécie</b> no sentido biológico: seres que se reproduzem e geram filhos parecidos com eles.</p>
<p>Toque num cartão e depois numa caixa (com o mouse, também dá para arrastar). Depois, toque em "Ver hoje". A faixa "Ano" percorre a linha do tempo até Lineu.</p>`,
    enem: 'A prova não pede detalhes de Aristóteles, mas cobra a ideia por trás: os primeiros sistemas eram <b>artificiais</b>, baseados em poucas características escolhidas por conveniência (ter sangue, onde vive, para que serve). Os sistemas atuais são <b>naturais</b> ou <b>filogenéticos</b>: agrupam pelo <b>parentesco evolutivo</b>. Pegadinha: "baleia é peixe" é uma classificação artificial, pelo ambiente; pelo parentesco, ela é mamífero.',
    links: [['Lineu e o <i>Systema Naturae</i>', '#historia/lineu'], ['As categorias', '#categorias/hierarquia']],
    tap(x, y, S) {
      if (!toque(S)) return; const h = hitAt(x, y); if (h == null) { S.sel = null; return; }
      if (h === 'lineu') { location.hash = 'historia/lineu'; return; }
      if (typeof h === 'number') { if (S.where[h] == null && !S.hoje) S.sel = S.sel === h ? null : h; else S.msg = S.hoje ? null : `${art(AN[h])[0].toUpperCase() + art(AN[h]).slice(1)} já está na caixa certa.`; return; }
      if (h.startsWith && h.startsWith('cx') && S.sel != null) soltar(S, S.sel, +h[2]);
      else if (h.startsWith && h.startsWith('cx')) S.msg = 'Primeiro toque num cartão da estante; depois, na caixa.';
    },
    grab(x, y, S) { const h = hitAt(x, y); if (typeof h === 'number' && S.where[h] == null && !S.hoje) { S.drag = { i: h, x, y }; S.sel = h; return true; } return false; },
    grabMove(x, y, S) { if (S.drag) { S.drag.x = x; S.drag.y = y; } },
    grabEnd(x, y, S) { const d = S.drag; S.drag = null; if (!d) return; const h = hitAt(x, y); if (typeof h === 'string' && h.startsWith('cx')) soltar(S, d.i, +h[2]); },
    draw(t, S) {
      const A = area(), Ly = layA(A), dt = S.dt || (S.paused ? 0 : .016);
      // organização automática: um cartão a cada 0,35 s
      if (S.auto) { S.autoT += S.dt || 0; const n = Math.floor(S.autoT / .35), pend = AN.filter(c => S.where[c.i] == null); if (pend.length && n > 16 - pend.length) placeA(S, pend[0], pend[0].s ? 0 : 1); if (!pend.length) { S.auto = 0; S.msg = 'Assim ficaria com Aristóteles. Toque em "Ver hoje" para comparar com a classificação atual.'; } }
      const caixas = S.hoje ? CX_H : CX_A;
      if (AN.every(c => S.where[c.i] != null)) { const [sx, sy] = Ly.shelf(0), sh = Ly.box(0).y - 6 - sy - 4; X.setLineDash([6, 6]); rr(sx, sy, A.w, sh, 10, null, 'rgba(157,169,196,.3)', 1); X.setLineDash([]); tx('estante vazia: todos os cartões estão nas caixas', A.cx, sy + sh / 2, { s: 12, c: C.dim, bg: false }); }
      // caixas
      for (let k = 0; k < 2; k++) {
        const b = Ly.box(k), cx = caixas[k], on = S.sel != null && !S.hoje;
        rr(b.x, b.y, b.w, b.h, 12, rgba(cx.c, .08), rgba(cx.c, on ? .9 : .55), on ? 2 : 1.5);
        hitR(b.x, b.y, b.w, b.h, 'cx' + k);
        tx(cx.t, b.x + 12, b.y + (NAR ? 17 : 20), { f: FH, s: NAR ? 14 : 16, w: 600, a: 'left', c: cx.c, bg: false });
        if (!(NAR && S.hoje)) tx(cx.sub, b.x + 16 + tw(cx.t, NAR ? 14 : 16, 600, FH), b.y + (NAR ? 17 : 20), { s: 12, a: 'left', c: C.dim, bg: false });
        if (S.hoje) { const gs = [...new Set(AN.filter(a => (a.s ? 0 : 1) === k).map(a => a.g))]; tx(`${gs.length} grupos nesta amostra`, b.x + b.w - 10, b.y + (NAR ? 17 : 20), { s: 12, a: 'right', c: C.txt, bg: false }); }
      }
      // posições-alvo e animação dos cartões
      const tgt = c => { const k = S.where[c.i]; if (k == null) return Ly.shelf(c.i).concat([Ly.cw]); return Ly.slot(k, S.order[k].indexOf(c.i)).concat([Ly.bcw]); };
      const draws = [];
      for (const c of AN) {
        const [tx0, ty0, w] = tgt(c), p = S.pos[c.i] || (S.pos[c.i] = { x: tx0, y: ty0, w });
        const k = 1 - Math.exp(-(S.paused ? 30 : 9) * Math.max(dt, .016)); p.x = lerp(p.x, tx0, k); p.y = lerp(p.y, ty0, k); p.w = lerp(p.w, w, k);
        let ox = 0; if (S.bounce[c.i]) { S.bounce[c.i] = Math.max(0, S.bounce[c.i] - (S.dt || .016) * 1.6); ox = Math.sin(S.bounce[c.i] * 30) * 6 * S.bounce[c.i]; }
        let x = p.x + ox, y = p.y; if (S.drag && S.drag.i === c.i) { x = S.drag.x - p.w / 2; y = S.drag.y - Ly.ch / 2; }
        draws.push([c, x, y, p.w]);
      }
      draws.sort((a, b) => (S.drag && a[0].i === S.drag.i) - (S.drag && b[0].i === S.drag.i));
      for (const [c, x, y, w] of draws) {
        const h = Ly.ch, sel = S.sel === c.i, k = S.where[c.i], g = GR[c.g];
        const bc = sel ? C.amber : S.hoje ? g[1] : k != null ? caixas[k].c : 'rgba(157,169,196,.45)';
        rr(x, y, w, h, 8, 'rgba(19,26,43,.92)', bc, sel ? 2.5 : 1.3);
        hitR(x, y, w, h, c.i);
        const small = NAR || w < 110, isz = small ? Math.min(h * .5, 24) : Math.min(h * .72, 40);
        if (small) {
          bicho(c.ic, x + w / 2, y + 4 + isz / 2, isz, { c: C.txt });
          tx(c.n, x + w / 2, y + h - 10, { s: 12, w: 600, c: C.txt, bg: false });
        } else {
          bicho(c.ic, x + 8 + isz / 2, y + h / 2, isz, { c: C.txt });
          const lx = x + 14 + isz; let fs = 14; while (fs > 12 && tw(c.n, fs, 600) > x + w - lx - 4) fs--;
          const sub = S.hoje ? g[0] : (k === 0 ? c.rep : null), parts = tw(c.n, fs, 600) > x + w - lx - 4 && c.n.includes('-') ? [c.n.slice(0, c.n.indexOf('-') + 1), c.n.slice(c.n.indexOf('-') + 1)] : [c.n];
          parts.forEach((q, j) => tx(q, lx, y + h / 2 - (sub ? 8 : 0) + (j - (parts.length - 1) / 2) * 14 - (sub && parts.length > 1 ? 4 : 0), { s: fs, w: 600, a: 'left', c: C.txt, bg: false }));
          if (sub) tx(sub, lx, y + h / 2 + 10, { s: 12, a: 'left', c: S.hoje ? g[1] : C.dim, bg: false });
        }
        if (small && S.hoje) circ(x + w - 7, y + 7, 4, g[1]);
      }
      // linha do tempo
      const T = Ly.tl, ly = T.y + (NAR ? 40 : 34), yr = S.v;
      line(T.x, ly, tl(-270, T.x, T.w) - 4, ly, rgba(HIST, .7), 2); line(tl(1480, T.x, T.w) + 4, ly, T.x + T.w, ly, rgba(HIST, .7), 2);
      for (const dx of [-3, 3]) { const bx = (tl(-270, T.x, T.w) + tl(1480, T.x, T.w)) / 2 + dx; line(bx - 3, ly + 6, bx + 3, ly - 6, rgba(HIST, .7), 1.5); }
      const nav0 = tl(1500, T.x, T.w), nav1 = tl(1700, T.x, T.w); rr(nav0, ly - 4, nav1 - nav0, 8, 4, rgba(HIST, .28));
      let cur = MARCOS[0];
      for (const m of MARCOS) { const x = tl(m[0], T.x, T.w), on = yr >= m[0]; if (on) cur = m; circ(x, ly, on ? 5 : 4, on ? HIST : '#0B0F1C', HIST, 1.5); }
      tx('350 a.C.', T.x, ly + 15, { s: 12, f: FD, w: 500, a: 'left', c: C.dim, bg: false });
      tx('1500', nav0, ly + 15, { s: 12, f: FD, w: 500, c: C.dim, bg: false });
      // fim da faixa: segue em Lineu (tocável)
      const lt = 'Lineu', lw = tw(lt, 12, 600) + 22, lx = T.x + T.w - lw;
      rr(lx, ly + 7, lw, 18, 9, rgba(HIST, yr >= 1735 ? .95 : .25), null); tx(lt + ' ›', lx + lw / 2, ly + 16, { s: 12, w: 600, c: yr >= 1735 ? '#0B0F1C' : C.txt, bg: false }); hitR(lx, ly + 4, lw, 24, 'lineu');
      const mx = tl(cl(yr, -380, 1760), T.x, T.w); X.beginPath(); X.moveTo(mx, ly - 7); X.lineTo(mx - 6, ly - 15); X.lineTo(mx + 6, ly - 15); X.closePath(); X.fillStyle = C.amber; X.fill();
      const txt = `<b>${cur[1]}:</b> ${cur[2]}`;
      if (NAR) wrapTx(txt, T.x, T.y + 4, T.w, { s: 12, a: 'left', c: C.txt, lh: 14 }); else mtx(txt, T.x, T.y + 10, { s: 13, a: 'left', c: C.txt, bg: false });
      // legenda
      if (S.msg) cap(S.msg);
      else if (S.hoje) cap('Hoje, os "com sangue" são os <b>vertebrados</b>. Os "sem sangue" variam muito mais, e a minhoca tem sangue vermelho: o critério falha.');
      else if (S.sel != null) cap(`${art(AN[S.sel])[0].toUpperCase() + art(AN[S.sel]).slice(1)}: agora toque na caixa "com sangue" ou "sem sangue".`);
      else cap('Separe como Aristóteles: toque num cartão e depois numa caixa.');
    }
  });

  // =====================================================================================
  // H2 LINEU E O SYSTEMA NATURAE: gavetas encaixadas e frase-nome que vira binômio
  // =====================================================================================
  const LIN = [
    { b: 'Tomateiro', ic: 'tomate', g: 'Solanum', e: 'lycopersicum', obra: '<i>Species Plantarum</i>, 1753',
      fr: 'solano de caule herbáceo, folhas recortadas e fruto liso',
      gav: [['Reino', 'Vegetal'], ['Classe', 'Pentandria', 'cinco estames'], ['Ordem', 'Monogynia', 'um pistilo'], ['Gênero', '<i>Solanum</i>'], ['Espécie', '<i>Solanum lycopersicum</i>']],
      nota: 'Nas plantas, a classe de Lineu dependia do número de estames da flor: um critério artificial.' },
    { b: 'Ser humano', ic: 'humano', g: 'Homo', e: 'sapiens', obra: '<i>Systema Naturae</i>, 10ª edição, 1758',
      fr: 'animal de dois pés, sem pelos no corpo, que fala, raciocina e fabrica ferramentas',
      gav: [['Reino', 'Animal'], ['Classe', 'Mammalia'], ['Ordem', 'Primates'], ['Gênero', '<i>Homo</i>'], ['Espécie', '<i>Homo sapiens</i>']],
      nota: '<i>Homo sapiens</i> quer dizer "homem sábio". Lineu nos pôs entre os primatas, ao lado dos macacos.' },
    { b: 'Onça-pintada', ic: 'onca', g: 'Felis', e: 'onca', obra: '<i>Systema Naturae</i>, 10ª edição, 1758',
      fr: 'gato muito grande da América, de pelo amarelado com manchas negras em forma de roseta',
      gav: [['Reino', 'Animal'], ['Classe', 'Mammalia'], ['Ordem', 'Ferae', 'nome da época'], ['Gênero', '<i>Felis</i>'], ['Espécie', '<i>Felis onca</i>']],
      nota: 'Hoje a onça está em outro gênero: <i>Panthera onca</i>. O epíteto <i>onca</i> ficou, e o gênero mudou.' }
  ];
  const LCOR = [C.rei, C.cla, C.ord, C.gen, C.esp];

  def('historia', 'lineu', {
    t: 'Lineu e o <i>Systema Naturae</i>', s: 'duas palavras para cada ser vivo', c: HIST,
    loc: 'Lineu, 1735 a 1758', alt: 'página de rosto do Systema Naturae que se abre em gavetas encaixadas, reino, classe, ordem, gênero e espécie, e uma frase-nome longa que encolhe até virar duas palavras',
    still: 9.5,
    extra: [
      ...LIN.map((s, i) => ({ t: s.b, on: S => { S.esp = i; S.t0 = S.ph; }, pressed: S => (S.esp || 0) === i })),
      { t: 'Frase ou binômio', on: S => { S.man = S.man === 'bin' ? 'frase' : 'bin'; }, pressed: S => S.man === 'bin' }
    ],
    init(S) { S.esp = 0; S.t0 = 0; S.man = null; S.fb = 0; },
    d: `<p>O botânico sueco <b>Carl von Linné</b>, ou <b>Lineu</b> (1707-1778), pôs ordem no caos. Em 1735 publicou o <i>Systema Naturae</i>, com os seres agrupados em <b>categorias</b> encaixadas umas nas outras: reino, classe, ordem, gênero e espécie. Anos depois, passou a usar de forma sistemática um jeito simples de dar nome: <b>duas palavras em latim</b> para cada espécie, a <b>nomenclatura binomial</b>. Em vez de uma frase descrevendo a planta, um nome curto e único. Os marcos oficiais dessa nomenclatura são duas obras dele: <i>Species Plantarum</i> (<b>1753</b>), com cerca de 6 mil espécies de plantas, e a <b>10ª edição</b> do <i>Systema Naturae</i> (<b>1758</b>), com cerca de 4.400 espécies de animais. Nomes mais antigos que essas datas não valem. Foi nessa 10ª edição que Lineu nos deu o nome <b><i>Homo sapiens</i></b> ("homem sábio") e nos colocou entre os primatas, ao lado dos macacos, o que chocou muita gente na época.</p>
<p>Lineu reconhecia três reinos: animal, vegetal e mineral. Ele era <b>fixista</b>: acreditava que as espécies tinham sido criadas assim e não mudavam. Seu sistema era em parte <b>artificial</b>: as plantas, por exemplo, eram separadas pelo número de estames das flores. Depois de Darwin (<i>A Origem das Espécies</i>, 1859), as categorias de Lineu ganharam um novo sentido: seres do mesmo grupo se parecem porque <b>descendem de um ancestral comum</b>. O sistema de nomes continua o mesmo até hoje.</p>
<p>Escolha uma espécie e use "Frase ou binômio" para alternar entre o nome descritivo e as duas palavras. As frases foram escritas pela equipe no estilo da época, resumidas e traduzidas: não são citações.</p>`,
    enem: 'Lineu é o "pai da taxonomia" e da <b>nomenclatura binomial</b>. Guarde três ideias: ele criou o sistema de <b>categorias hierárquicas</b>, deu <b>dois nomes em latim</b> a cada espécie, e era <b>fixista</b>. A classificação que usamos hoje mantém os nomes de Lineu, mas o critério mudou: agora é o <b>parentesco evolutivo</b>, uma ideia que só veio com Darwin.',
    links: [['As categorias de hoje', '#categorias/hierarquia'], ['Antes de Lineu', '#historia/aristoteles']],
    draw(t, S) {
      const A = area(), sp = LIN[S.esp || 0], lt = t - (S.t0 || 0), P = 16, u = lt % P;
      const op = S.paused ? 1 : ss(seg(u, 1.6, 2.6)), nOpen = S.paused ? 5 : cl((u - 2.4) / 1.1, 0, 5);
      // frase (0) ou binômio (1): automático no ciclo, ou fixo pelo botão
      const alvo = S.man ? (S.man === 'bin' ? 1 : 0) : (S.paused ? 1 : ss(seg(u, 8.5, 10.5)));
      S.fb = S.man ? lerp(S.fb || 0, alvo, 1 - Math.exp(-6 * Math.max(S.dt, .016))) : alvo;
      // layout
      const stack = NAR || A.w < 820, gap = 16;
      const L = stack ? { x: A.x0, y: A.y0, w: A.w, h: A.h * .58 } : { x: A.x0, y: A.y0, w: A.w * .52, h: A.h };
      const R = stack ? { x: A.x0, y: A.y0 + A.h * .58 + 10, w: A.w, h: A.h * .42 - 10 } : { x: A.x0 + A.w * .52 + gap, y: A.y0, w: A.w * .48 - gap, h: A.h };
      // ---- livro: página de rosto (desenho próprio) ----
      const pw = stack ? Math.min(96, L.w * .26) : Math.min(150, L.w * .3), ph = stack ? Math.min(L.h * .8, pw * 1.45) : Math.min(L.h * .62, pw * 1.45);
      const bx = L.x, by = L.y + (stack ? L.h * .05 : 0);
      rr(bx + 4, by + 4, pw, ph, 4, 'rgba(0,0,0,.35)');
      rr(bx, by, pw, ph, 4, C.papel, '#B9A57C', 1.5); rr(bx + 6, by + 6, pw - 12, ph - 12, 2, null, rgba(C.tinta, .5), 1);
      const tc = C.tinta;
      X.save(); X.beginPath(); X.rect(bx, by, pw, ph); X.clip();
      tx(pw < 120 ? 'LINNAEUS' : 'CAROLI LINNAEI', bx + pw / 2, by + ph * .14, { s: 12, w: 600, c: tc, bg: false, f: FH });
      tx('SYSTEMA', bx + pw / 2, by + ph * .3, { s: stack ? 13 : 18, w: 700, c: tc, bg: false, f: FH });
      tx('NATURAE', bx + pw / 2, by + ph * .3 + (stack ? 16 : 22), { s: stack ? 13 : 18, w: 700, c: tc, bg: false, f: FH });
      const ey = by + ph * .62; for (let i = 0; i < 3; i++) line(bx + pw * .3, ey + i * 7, bx + pw * .7, ey + i * 7, rgba(tc, .45), 1.2);
      circ(bx + pw / 2, by + ph * .8, Math.min(pw, ph) * .07, null, rgba(tc, .6), 1.2);
      tx('1735', bx + pw / 2, by + ph * .92, { s: 12, f: FD, w: 500, c: tc, bg: false });
      X.restore();
      tx('desenho próprio', bx + pw / 2, by + ph + 12, { s: 12, c: C.dim, bg: false });
      // ---- gavetas encaixadas ----
      const gx = bx + pw + (stack ? 10 : 18), gw = L.x + L.w - gx, gy = L.y, gh = L.h;
      const dh = (gh - 6) / 5, ind = Math.min(16, gw * .05);
      for (let i = 0; i < 5; i++) {
        const a = op * ss(cl(nOpen - i, 0, 1)); if (a <= .02) continue;
        const x = gx + i * ind, w = gw - i * ind * 2, y = gy + i * dh, h = gh - i * dh - i * 6;
        const slide = (1 - a) * -30;
        X.save(); X.globalAlpha *= a;
        rr(x + slide, y, w, h - (i < 4 ? 0 : 0), 10, rgba(LCOR[i], .1), rgba(LCOR[i], .85), 1.6);
        const [cat, val, nota] = sp.gav[i], ty = y + Math.min(dh / 2, 18);
        circ(x + slide + 14, ty, 4.5, LCOR[i]);
        const cw = tx(cat, x + slide + 24, ty, { s: NAR ? 12 : 13, w: 600, a: 'left', c: LCOR[i], bg: false });
        void cw;
        const vx = x + slide + 24 + tw(cat, NAR ? 12 : 13, 600) + 8;
        const vw = mtx(val, vx, ty, { s: NAR ? 13 : 15, w: 700, a: 'left', c: C.txt, bg: false });
        if (nota && w - (vx - x) - vw > tw(nota, 12) + 16) tx(`(${nota})`, vx + vw + 8, ty, { s: 12, a: 'left', c: C.dim, bg: false });
        X.restore();
      }
      if (op > .5 && nOpen >= 5) {
        const fy = gy + 4 * dh + Math.min(dh / 2, 18) + (NAR ? 18 : 22);
        if (fy < gy + gh - 8) bicho(sp.ic, gx + gw / 2, Math.min(gy + gh - 22, fy + 14), Math.min(36, gh - (fy - gy) - 4), { c: C.esp });
      }
      // ---- antes e depois: frase-nome e binômio ----
      panel(R.x, R.y, R.w, R.h, { r: 12 });
      const k = S.fb, cx = R.x + R.w / 2, pad = 14;
      tx(k < .5 ? 'Antes de Lineu: uma frase' : 'Depois de Lineu: duas palavras', R.x + pad, R.y + 18, { f: FH, s: NAR ? 14 : 16, w: 600, a: 'left', c: HIST, bg: false });
      // frase encolhendo
      if (k < .98) {
        X.save(); X.globalAlpha *= 1 - ss(seg(k, .2, .75)); const sc = lerp(1, .55, ss(seg(k, 0, .8)));
        X.translate(cx, R.y + R.h * .42); X.scale(sc, sc);
        const fw = Math.min(R.w - 2 * pad, 460), hh = wrapTx(`"${sp.fr}"`, 0, 0, fw, { s: NAR ? 14 : 16, w: 600, c: C.papel, dry: true, lh: NAR ? 19 : 22 });
        wrapTx(`"${sp.fr}"`, 0, -hh / 2 + 10, fw, { s: NAR ? 14 : 16, w: 600, c: C.papel, lh: NAR ? 19 : 22 });
        X.restore();
      }
      // binômio
      if (k > .02) {
        X.save(); X.globalAlpha *= ss(seg(k, .35, 1)); const sz = NAR ? 22 : Math.min(30, R.w / 14), by2 = R.y + R.h * .42;
        const gtxt = sp.g, etxt = sp.e, gwid = tw(gtxt, sz, 700, FT, true), ewid = tw(etxt, sz, 700, FT, true), sp1 = tw(' ', sz, 700, FT, true), tot = gwid + sp1 + ewid, x0 = cx - tot / 2;
        tx(gtxt, x0, by2, { s: sz, w: 700, i: true, a: 'left', c: C.txt, bg: false });
        tx(etxt, x0 + gwid + sp1, by2, { s: sz, w: 700, i: true, a: 'left', c: C.txt, bg: false });
        X.lineCap = 'round'; line(x0, by2 + sz * .65, x0 + gwid, by2 + sz * .65, C.genero, 3); line(x0 + gwid + sp1, by2 + sz * .65, x0 + tot, by2 + sz * .65, C.epiteto, 3); X.lineCap = 'butt';
        tx('gênero', x0 + gwid, by2 + sz * .65 + 14, { s: 12, w: 600, a: 'right', c: C.genero, bg: false });
        tx('epíteto específico', x0 + gwid + sp1, by2 + sz * .65 + 14, { s: 12, w: 600, a: 'left', c: C.epiteto, bg: false });
        X.restore();
      }
      const noteY = R.y + R.h - (NAR ? 34 : 40);
      mtx(k < .5 ? 'frase no estilo pré-Lineu, não é citação' : `marco: ${sp.obra}`, R.x + pad, noteY, { s: 12, a: 'left', c: C.dim, bg: false });
      if (!NAR || R.w > 340) wrapTx(sp.nota, R.x + pad, noteY + 16, R.w - 2 * pad, { s: 12, a: 'left', c: C.txt, lh: 15 });
      // legenda
      if (S.man) cap(S.man === 'bin' ? `Nome binomial: <i>${sp.g} ${sp.e}</i>. A primeira palavra é o gênero; a segunda, o epíteto específico.` : 'A frase-nome descrevia o ser vivo, mas era longa e mudava de um autor para outro.');
      else if (nOpen < 5 && op > 0) cap('Categorias encaixadas de Lineu: reino, classe, ordem, gênero e espécie.');
      else cap(sp.nota);
    }
  });

  // =====================================================================================
  // C1 AS CATEGORIAS TAXONÔMICAS: caixas dentro de caixas e "Até onde vão juntos?"
  // =====================================================================================
  const NOMES8 = ['Domínio', 'Reino', 'Filo', 'Classe', 'Ordem', 'Família', 'Gênero', 'Espécie'];
  const CAIXA = [
    ['Eukarya', 'células com núcleo'], ['Animalia', 'pluricelulares que comem outros seres'], ['Chordata', 'notocorda (nos vertebrados, coluna vertebral)'],
    ['Mammalia', 'pelos e glândulas mamárias'], ['Carnivora', 'dentes próprios para cortar carne'], ['Felidae', 'garras que se recolhem'],
    ['<i>Felis</i>', 'gatos de pequeno porte'], ['<i>Felis catus</i>', 'o gato doméstico']
  ];
  // anel de cada ícone: -1 fora do domínio; i = está na caixa i mas não na i+1
  const ANEIS = [['bacteria', -1, 'bactéria'], ['milho', 0, 'milho'], ['cogumelo', 0, 'cogumelo'], ['minhoca', 1, 'minhoca'], ['abelha', 1, 'abelha'],
    ['peixe', 2, 'peixe'], ['sapo', 2, 'sapo'], ['humano', 3, 'ser humano'], ['cao', 4, 'cão'], ['lobo', 4, 'lobo'], ['onca', 5, 'onça'], ['gato', 7, 'gato']];
  const SERES = [
    ['ser humano', 'humano', ['Eukarya', 'Animalia', 'Chordata', 'Mammalia', 'Primates', 'Hominidae', '<i>Homo</i>', '<i>Homo sapiens</i>']],
    ['chimpanzé', 'chimpanze', ['Eukarya', 'Animalia', 'Chordata', 'Mammalia', 'Primates', 'Hominidae', '<i>Pan</i>', '<i>Pan troglodytes</i>']],
    ['cão', 'cao', ['Eukarya', 'Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Canidae', '<i>Canis</i>', '<i>Canis familiaris</i>']],
    ['lobo', 'lobo', ['Eukarya', 'Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Canidae', '<i>Canis</i>', '<i>Canis lupus</i>']],
    ['gato', 'gato', ['Eukarya', 'Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Felidae', '<i>Felis</i>', '<i>Felis catus</i>']],
    ['onça-pintada', 'onca', ['Eukarya', 'Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Felidae', '<i>Panthera</i>', '<i>Panthera onca</i>']],
    ['galinha', 'galinha', ['Eukarya', 'Animalia', 'Chordata', 'Aves', 'Galliformes', 'Phasianidae', '<i>Gallus</i>', '<i>Gallus gallus</i>']],
    ['sapo-cururu', 'sapo', ['Eukarya', 'Animalia', 'Chordata', 'Amphibia', 'Anura', 'Bufonidae', '<i>Rhinella</i>', '<i>Rhinella</i> sp.']],
    ['abelha', 'abelha', ['Eukarya', 'Animalia', 'Arthropoda', 'Insecta', 'Hymenoptera', 'Apidae', '<i>Apis</i>', '<i>Apis mellifera</i>']],
    ['milho', 'milho', ['Eukarya', 'Plantae', 'Magnoliophyta', 'Liliopsida', 'Poales', 'Poaceae', '<i>Zea</i>', '<i>Zea mays</i>']]
  ];
  const MESMO = ['mesmo domínio', 'mesmo reino', 'mesmo filo', 'mesma classe', 'mesma ordem', 'mesma família', 'mesmo gênero', 'mesma espécie'];
  function comum(a, b) { let k = -1; for (let i = 0; i < 8; i++) { if (SERES[a][2][i] === SERES[b][2][i]) k = i; else break; } return k; }
  function frase(a, b) {
    const k = comum(a, b), na = SERES[a][0], nb = SERES[b][0];
    if (a === b) return `${na} e ${na}: o mesmo ser, ${MESMO[7]}.`;
    if (k < 0) return `${na} e ${nb}: nenhuma categoria em comum.`;
    if (k === 0) return `${na} e ${nb}: só o domínio (${SERES[a][2][0]}).`;
    return `${na} e ${nb}: ${MESMO[k]} (${SERES[a][2][k]}).`;
  }

  def('categorias', 'hierarquia', {
    t: 'As categorias taxonômicas', s: 'do domínio à espécie, cada vez mais parecidos', c: C.dom,
    loc: 'Domínio, reino, filo, classe, ordem, família, gênero, espécie', alt: 'caixas coloridas encaixadas, do domínio Eukarya à espécie Felis catus; a cada caixa, os seres de fora somem até restar só o gato; e uma tabela que compara dois seres até a última categoria em comum',
    ctl: { l: 'Categoria', min: 0, max: 7, step: 1, v: 0, f: v => NOMES8[cl(Math.floor(v + 1e-6), 0, 7)].toLowerCase(), rate: () => 1 },
    auto: .4, stillV: 4,
    extra: [
      { t: 'Caixas', on: S => { S.modo = 0; }, pressed: S => !S.modo },
      { t: 'Até onde vão juntos?', on: S => { S.modo = 1; S.v = 0; S.touch = 0; }, pressed: S => S.modo === 1 }
    ],
    init(S) { S.modo = 0; S.a = 2; S.b = 4; S.nx = 0; S.z = S.v; },
    d: `<p>As <b>categorias taxonômicas</b> se encaixam como caixas, umas dentro das outras: <b>domínio</b>, <b>reino</b>, <b>filo</b>, <b>classe</b>, <b>ordem</b>, <b>família</b>, <b>gênero</b> e <b>espécie</b>. Cada grupo concreto, como "mamíferos" ou "felídeos", é um <b>táxon</b>. Quanto mais alta a categoria, mais seres ela reúne e menos características eles têm em comum; quanto mais baixa, menos seres e mais parecidos. Em botânica, ainda se usa <b>divisão</b> no lugar de filo. Entre as categorias principais podem entrar outras (subfilo, superordem, subfamília), quando é preciso mais detalhe.</p>
<p>Veja três animais da sua casa (ou da sua rua). O ser humano, o cão e o gato estão no mesmo domínio, no mesmo reino, no mesmo filo e na mesma classe: são <b>mamíferos</b>. O cão e o gato também estão na mesma <b>ordem</b>, a dos <b>carnívoros</b>, e se separam na família: o cão é um <b>canídeo</b> (como o lobo e a raposa), e o gato, um <b>felídeo</b> (como a onça e o leão). O ser humano fica em outra ordem, a dos <b>primatas</b>. Conclusão: o cão é mais aparentado com o gato do que com o ser humano, porque divide com o gato <b>mais categorias</b>. Conhecemos e nomeamos cerca de <b>1,9 milhão de espécies</b> (Chapman, 2009); as estimativas do total na Terra chegam a cerca de <b>8,7 milhões</b> só de eucariontes (Mora e colaboradores, 2011). Ou seja, a maior parte da vida ainda nem tem nome.</p>
<div class="tab"><table>
<thead><tr><th>Categoria</th><th>Ser humano</th><th>Cão</th><th>Gato</th></tr></thead>
<tbody>
<tr><td>Domínio</td><td>Eukarya</td><td>Eukarya</td><td>Eukarya</td></tr>
<tr><td>Reino</td><td>Animalia</td><td>Animalia</td><td>Animalia</td></tr>
<tr><td>Filo</td><td>Chordata</td><td>Chordata</td><td>Chordata</td></tr>
<tr><td>Classe</td><td>Mammalia</td><td>Mammalia</td><td>Mammalia</td></tr>
<tr><td>Ordem</td><td>Primates</td><td>Carnivora</td><td>Carnivora</td></tr>
<tr><td>Família</td><td>Hominidae</td><td>Canidae</td><td>Felidae</td></tr>
<tr><td>Gênero</td><td><i>Homo</i></td><td><i>Canis</i></td><td><i>Felis</i></td></tr>
<tr><td>Espécie</td><td><i>Homo sapiens</i></td><td><i>Canis familiaris</i> (ou <i>Canis lupus familiaris</i>)</td><td><i>Felis catus</i></td></tr>
</tbody></table></div>
<p>Em "Caixas", a faixa desce do domínio à espécie. Em "Até onde vão juntos?", toque em dois seres da lista e veja até onde eles ficam no mesmo grupo. No milho, a linha do filo mostra a divisão, como se diz em botânica.</p>`,
    enem: 'Decore a ordem <b>domínio, reino, filo, classe, ordem, família, gênero, espécie</b> (uma frase para lembrar: "<b>D</b>ona <b>R</b>ita <b>F</b>ez <b>C</b>afé <b>O</b>ntem; <b>F</b>oi <b>G</b>ostoso <b>E</b>ssa vez"). A questão típica dá uma tabela e pergunta quais seres são <b>mais aparentados</b>: são os que dividem a categoria <b>mais baixa</b>. Dois seres do mesmo gênero estão obrigatoriamente na mesma família, ordem, classe e assim por diante; o contrário não vale.',
    links: [['Nomenclatura binomial', '#nomes/binomial'], ['Lineu', '#historia/lineu']],
    tap(x, y, S) {
      if (!toque(S)) return; const h = hitAt(x, y); if (h == null) return;
      if (typeof h === 'string' && h.startsWith('s')) { const i = +h.slice(1); if (S.nx) S.b = i; else S.a = i; S.nx = 1 - S.nx; S.v = 0; S.touch = 0; S.hold = 0; }
    },
    draw(t, S) {
      const A = area();
      if (S.modo === 1) return drawCmp(A, S);
      // zoom suave até a categoria da faixa
      const tgt = cl(Math.floor(S.v + 1e-6), 0, 7);
      S.z = S.paused ? tgt : lerp(S.z == null ? tgt : S.z, tgt, 1 - Math.exp(-3.5 * Math.max(S.dt, .016)));
      const z = S.z, barH = NAR ? 50 : 46;
      const B = { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y1 - barH - 8 };
      // caixas em coordenadas do "mundo": nível -1 (seres vivos) a 7; cada caixa tira uma faixa à esquerda e o título em cima
      const lh = NAR ? 24 : 28, Wm = 1000, Hm = 640, sw = (Wm - 300) / 8;
      const box = i => { const j = i + 1; return { x: j * sw, y: j * lh, w: Wm - j * sw, h: Hm - j * lh }; };
      const zi = Math.floor(z), zf = z - zi, b0 = box(zi), b1 = box(Math.min(7, zi + 1));
      const vz = { x: lerp(b0.x, b1.x, zf), y: lerp(b0.y, b1.y, zf), w: lerp(b0.w, b1.w, zf), h: lerp(b0.h, b1.h, zf) };
      // mostra também a faixa da caixa de fora (contexto), com folga à esquerda
      const ctx = z > .02 ? Math.min(1, z) : 0, vx = vz.x - sw * .55 * ctx, vy = vz.y - lh * ctx, vw = vz.w + sw * .55 * ctx, vh = vz.h + lh * ctx;
      const SX = v => B.x0 + (v - vx) / vw * (B.x1 - B.x0), SY = v => B.y0 + (v - vy) / vh * (B.y1 - B.y0);
      X.save(); X.beginPath(); X.rect(A.x0 - 4, A.y0 - 4, A.w + 8, B.y1 - A.y0 + 8); X.clip();
      for (let i = -1; i <= 7; i++) {
        const b = box(i), x = SX(b.x), y = SY(b.y), w = SX(b.x + b.w) - x, h = SY(b.y + b.h) - y, c = i < 0 ? '#5B6C99' : CATC[i];
        const cur = i === tgt, al = i < z - 1.05 ? .35 : 1;
        X.save(); X.globalAlpha *= al;
        rr(x, y, w, h, 12, rgba(c, i < 0 ? .03 : .07), rgba(c, cur ? 1 : .7), cur ? 2.5 : 1.5);
        const nm = i < 0 ? 'Seres vivos' : `${NOMES8[i]} ${CAIXA[i][0]}`, ty = SY(b.y) + Math.min(lh, (SY(b.y + lh) - SY(b.y))) / 2 + 1;
        if (x + 8 >= A.x0 - 2 && ty >= A.y0 + 4) { const lw = mtw(nm, NAR ? 12 : 13, 600); if (x + 14 + lw < A.x1) mtx(nm, x + 10, ty, { s: NAR ? 12 : 13, w: 600, a: 'left', c: i < 0 ? C.dim : c, bg: false }); }
        X.restore();
      }
      // ícones em cada faixa
      const byRing = {}; ANEIS.forEach(a => (byRing[a[1]] = byRing[a[1]] || []).push(a));
      for (const r in byRing) {
        const i = +r, list = byRing[i];
        let rx0, rx1, ry0, ry1;
        if (i === 7) { const b = box(7); rx0 = SX(b.x); rx1 = SX(b.x + b.w); ry0 = SY(b.y + lh); ry1 = SY(b.y + b.h); }
        else { const b = box(i), bi = box(i + 1); rx0 = SX(b.x); rx1 = SX(bi.x); ry0 = SY(bi.y); ry1 = SY(b.y + b.h); }
        const sw2 = rx1 - rx0, sh2 = ry1 - ry0; if (sw2 < 8 || rx1 < A.x0 - 20) continue;
        const al = i < z - .6 ? cl(1 - (z - .6 - i) * 2, 0, 1) : 1; if (al <= .02) continue;
        const s = cl(Math.min(sw2 - 10, sh2 / list.length - (LB ? 22 : 8)), 12, i === 7 ? Math.min(120, sh2 * .5) : 54);
        list.forEach((a, j) => {
          const cx = (rx0 + rx1) / 2, cy = ry0 + (j + .5) * sh2 / list.length - (LB && s > 20 ? 6 : 0);
          bicho(a[0], cx, cy, s, { c: i === 7 ? C.esp : C.txt, a: al });
          if (LB && s > 20 && sw2 > 44) { X.save(); X.globalAlpha *= al; tx(a[2], cx, cy + s / 2 + 10, { s: 12, c: C.dim }); X.restore(); }
        });
      }
      X.restore();
      // característica em comum da caixa atual
      if (tgt >= 0) { const b = box(Math.min(7, tgt + 1)), y = SY(box(tgt).y) + lh * (B.y1 - B.y0) / vh * .5; void b; const s2 = `em comum: ${CAIXA[tgt][1]}`; const xr = A.x1 - 8; if (!NAR) tx(s2, xr, Math.max(y, A.y0 + 8), { s: 12, a: 'right', c: C.txt }); }
      // contadores
      const by = A.y1 - barH, bw = (A.w - 24) / 2, f = z / 7;
      hbar(A.x0, by + 18, bw, 10, 1 - f * .92, C.dom, NAR ? 'Seres no grupo' : 'Seres neste grupo', f < .5 ? 'muitos' : 'poucos');
      hbar(A.x0 + bw + 24, by + 18, bw, 10, .08 + f * .92, C.esp, NAR ? 'Em comum' : 'Características em comum', f < .5 ? 'poucas' : 'muitas');
      if (NAR) tx(`em comum: ${CAIXA[tgt][1]}`, A.cx, by + 42, { s: 12, c: C.txt, bg: false });
      cap(tgt === 0 ? 'Domínio Eukarya: todos os seres com núcleo. A bactéria fica de fora.' : tgt === 7 ? 'Espécie <i>Felis catus</i>: só o gato. Quanto mais baixa a categoria, menos seres e mais parecidos.' : `${NOMES8[tgt]} ${CAIXA[tgt][0]}: ficam de fora os seres das caixas maiores.`);
    }
  });
  function hbar(x, y, w, h, f, c, name, val) { rr(x, y, w, h, 4, 'rgba(91,108,153,.25)'); if (f > .005) rr(x, y, Math.max(4, w * cl(f, 0, 1)), h, 4, c); tx(name, x, y - 10, { s: 12, w: 600, a: 'left', c: C.txt, bg: false }); if (val) tx(val, x + w, y - 10, { s: 12, w: 600, a: 'right', c: C.dim, bg: false }); }

  function drawCmp(A, S) {
    // lista de seres (tocáveis)
    const cols = NAR ? 5 : 10, cg = 6, chw = (A.w - (cols - 1) * cg) / cols, chh = NAR ? 54 : 66;
    SERES.forEach((s, i) => {
      const x = A.x0 + (i % cols) * (chw + cg), y = A.y0 + Math.floor(i / cols) * (chh + cg), on = i === S.a || i === S.b;
      const c = i === S.a ? C.filo : i === S.b ? C.gen : 'rgba(157,169,196,.4)';
      rr(x, y, chw, chh, 8, on ? rgba(c, .14) : 'rgba(19,26,43,.85)', c, on ? 2 : 1); hitR(x, y, chw, chh, 's' + i);
      bicho(s[1], x + chw / 2, y + chh * .38, Math.min(chh * .48, chw * .6), { c: C.txt });
      let fs = 12; while (fs > 10 && tw(s[0], fs, 600) > chw - 4) fs -= .5;
      X.font = `600 ${fs}px ${FT}`; X.fillStyle = C.txt; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(s[0], x + chw / 2, y + chh - 10);
    });
    const ty0 = A.y0 + Math.ceil(SERES.length / cols) * (chh + cg) + 8;
    const k = comum(S.a, S.b), rows = 8, rh = Math.min(NAR ? 34 : 34, (A.y1 - ty0 - 30) / (rows + 1)), lc = NAR ? 74 : 150;
    const colW = (A.w - lc) / 2, rev = Math.floor(S.v + 1e-6);
    // cabeçalho
    const hy = ty0 + rh / 2;
    [S.a, S.b].forEach((s, j) => { const x = A.x0 + lc + j * colW + colW / 2; tx(SERES[s][0], x, hy, { s: NAR ? 13 : 14, w: 700, c: j ? C.gen : C.filo, bg: false }); });
    for (let i = 0; i < rows; i++) {
      const y = ty0 + (i + 1) * rh, shown = i <= rev || S.paused, same = i <= k, c = CATC[i];
      circ(A.x0 + 6, y + rh / 2, 4.5, c);
      tx(NOMES8[i], A.x0 + 16, y + rh / 2, { s: NAR ? 12 : 13, w: 600, a: 'left', c: C.txt, bg: false });
      if (!shown) { line(A.x0 + lc, y + rh, A.x1, y + rh, 'rgba(91,108,153,.25)', 1); continue; }
      if (same) rr(A.x0 + lc + 2, y + 3, A.w - lc - 4, rh - 6, 8, rgba(c, .2), rgba(c, .75), 1.5);
      else { rr(A.x0 + lc + 2, y + 3, colW - 6, rh - 6, 8, 'rgba(19,26,43,.6)', 'rgba(157,169,196,.35)', 1); rr(A.x0 + lc + colW + 4, y + 3, colW - 6, rh - 6, 8, 'rgba(19,26,43,.6)', 'rgba(157,169,196,.35)', 1); }
      [S.a, S.b].forEach((s, j) => {
        const v = SERES[s][2][i], x = A.x0 + lc + j * colW + colW / 2; let fs = NAR ? 12 : 14; while (fs > 10 && mtw(v, fs, 600) > colW - 10) fs -= .5;
        if (same && j === 1) return;
        mtx(v, same ? A.x0 + lc + colW : x, y + rh / 2, { s: fs, w: 600, c: same ? C.txt : C.dim, bg: false });
      });
      if (i === k + 1 && !NAR) tx('separam-se aqui', A.x1 - 4, y - 1, { s: 12, w: 600, a: 'right', c: C.amber, bg: false });
      line(A.x0 + lc, y + rh, A.x1, y + rh, 'rgba(91,108,153,.25)', 1);
    }
    const done = rev >= Math.min(7, k + 1) || S.paused;
    cap(done ? frase(S.a, S.b).replace(/^./, m => m.toUpperCase()) + (S.a !== S.b ? ' Quanto mais categorias em comum, mais aparentados.' : '') : `Toque em dois seres da lista (agora: ${S.nx ? 'o segundo' : 'o primeiro'}). As linhas acendem até a última categoria em comum.`);
  }
}
