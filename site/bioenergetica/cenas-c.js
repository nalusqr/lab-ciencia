/* LAB · Módulo Bioenergética. Cenas novas da auditoria ENEM (Taxon, docs/revisao-biologia/bioenergetica-enem.md):
   luz e pigmentos, plantas C3/C4/CAM e quadro dos cinco jeitos de obter energia. Código e textos da equipe (Apolo). */
'use strict';
// registra o tópico logo depois de outro da mesma seção
function defApos(sec, id, depois, o) { def(sec, id, o); const L = ORDER[sec], k = sec + '/' + id; L.splice(L.indexOf(k), 1); const j = L.indexOf(sec + '/' + depois); L.splice(j < 0 ? L.length : j + 1, 0, k); }
// texto que quebra em linhas para caber em maxw; devolve a altura usada
function wrapTx(s, x, y, maxw, o = {}) {
  const sz = o.s || 13, w = o.w || 400, f = o.f || FT, lh = o.lh || sz + 4, out = []; let cur = '';
  for (const p of s.split(' ')) { const t = cur ? cur + ' ' + p : p; if (cur && tw(t, sz, w, f) > maxw) { out.push(cur); cur = p; } else cur = t; }
  if (cur) out.push(cur); out.forEach((l, i) => tx(l, x, y + i * lh, Object.assign({ bg: false }, o, { s: sz }))); return out.length * lh;
}

// =====================================================================================
// LUZ, COR E PIGMENTOS
// =====================================================================================
{
  const g = (l, m, s) => Math.exp(-Math.pow((l - m) / s, 2) / 2);
  const chlA = l => .92 * g(l, 430, 16) + .74 * g(l, 662, 11) + .22 * g(l, 410, 22) + .1 * g(l, 615, 14);
  const chlB = l => .95 * g(l, 455, 13) + .52 * g(l, 642, 10) + .12 * g(l, 595, 14);
  const car = l => l > 530 ? 0 : .62 * g(l, 450, 16) + .72 * g(l, 478, 15) + .3 * g(l, 425, 14);
  const acao = l => cl((chlA(l) + .6 * chlB(l) + .45 * car(l)) / 1.25 + .06, 0, 1);
  // cor aproximada de cada comprimento de onda (luz visível)
  function cor(l, a = 1) {
    let r = 0, gg = 0, b = 0;
    if (l < 440) { r = (440 - l) / 60 * .7; b = 1; } else if (l < 490) { gg = (l - 440) / 50; b = 1; } else if (l < 510) { gg = 1; b = (510 - l) / 20; }
    else if (l < 580) { r = (l - 510) / 70; gg = 1; } else if (l < 645) { r = 1; gg = (645 - l) / 65; } else r = 1;
    const k = l < 420 ? .45 + .55 * (l - 400) / 20 : l > 680 ? .45 + .55 * (700 - l) / 20 : 1, m = v => Math.round(255 * cl(v * k * .88 + .12, 0, 1));
    return `rgba(${m(r)},${m(gg)},${m(b)},${a})`;
  }
  const nome = l => l < 430 ? 'violeta' : l < 490 ? 'azul' : l < 520 ? 'azul-esverdeada' : l < 570 ? 'verde' : l < 590 ? 'amarela' : l < 620 ? 'laranja' : 'vermelha';
  // posições das bactérias de Engelmann: espalhadas ou acumuladas onde a alga libera mais O₂
  const CDF = []; { let s = 0; for (let l = 400; l <= 700; l++) { s += Math.max(0, acao(l) - .12) * (l > 600 ? 2.4 : 1); CDF.push(s); } for (let i = 0; i < CDF.length; i++) CDF[i] /= s; }
  const inv = u => { let i = 0; while (i < CDF.length - 1 && CDF[i] < u) i++; return 400 + i; };
  const BAC = (() => { const r = rng(77), o = []; for (let k = 0; k < 44; k++) o.push({ u: (k + r()) / 44, c: inv(r()), dy: (r() - .5) * 2, ph: r() * TAU }); return o; })();

  defApos('foto', 'pigmentos', 'geral', {
    t: 'Luz, cor e pigmentos', s: 'por que a folha é verde', c: C.cloro, loc: 'Espectro da luz visível', still: 6,
    ctl: { l: 'Cor da luz', min: 400, max: 700, step: 10, v: 450, f: v => v + ' nm', rate: () => 1 },
    alt: 'Espectro da luz visível com as curvas de absorção da clorofila a, da clorofila b e dos carotenoides; bactérias se juntam nas faixas azul e vermelha ao redor de uma alga',
    d: `<p><b>Cada pigmento absorve só algumas cores da luz, e a fotossíntese é mais intensa nas cores absorvidas.</b> A luz visível vai do violeta (cerca de 400&nbsp;nm) ao vermelho (cerca de 700&nbsp;nm). A <b>clorofila <i>a</i></b>, o pigmento principal, absorve sobretudo o <b>azul-violeta</b> e o <b>vermelho</b>. A <b>clorofila <i>b</i></b> e os <b>carotenoides</b> (amarelos e alaranjados) absorvem outras faixas do azul e passam a energia para a clorofila <i>a</i>, ampliando o aproveitamento da luz.</p>
<p>O <b>verde</b> é pouco absorvido: é refletido e atravessa a folha, e por isso as folhas parecem verdes. Mova a faixa para escolher a cor da luz e compare a absorção com a liberação de O₂.</p>
<p>Em 1882, <b>Engelmann</b> iluminou uma alga filamentosa com a luz decomposta por um prisma e espalhou bactérias que procuram O₂ ao redor dela. Elas se juntaram nas faixas <b>azul</b> e <b>vermelha</b>, onde a alga mais produzia O₂. No outono, a clorofila se desfaz antes dos carotenoides, e as folhas de algumas árvores ficam amarelas.</p>`,
    kv: [['Luz visível', 'de cerca de 400 a 700&nbsp;nm'], ['Clorofila <i>a</i>', 'absorve azul-violeta e vermelho'], ['Clorofila <i>b</i> e carotenoides', 'pigmentos acessórios: ampliam a faixa'], ['Cor menos absorvida', 'verde, refletida pela folha'], ['Experimento clássico', 'Engelmann, 1882']],
    enem: 'A prova pergunta em que cor de luz a planta faz mais fotossíntese, ou por que a folha é verde. A resposta: os pigmentos absorvem <b>azul e vermelho</b> e refletem o <b>verde</b>, a cor menos usada. Sob luz só verde, a fotossíntese é baixa. Por isso as estufas e cultivos internos com LED usam luz vermelha e azul. O experimento de Engelmann (bactérias juntas no azul e no vermelho) é a prova clássica.',
    links: [['Fase clara', '#foto/clara'], LK.cloro],
    drag(x, y, S) { return S.inv ? S.inv(x) : null; },
    draw(t, S) {
      const { A, G, B } = grafLayout(), L = S.v;
      const gr = graph(G, { x0: 400, x1: 700, y0: 0, y1: 1.08, xl: '', yl: 'absorção da luz', xt: [[400, '400'], [500, '500'], [600, '600'], [700, '700 nm']],
        curves: [{ f: car, c: '#F2B33D', lw: 2, dash: [6, 4] }, { f: chlB, c: '#A6E37A', lw: 2 }, { f: chlA, c: VERDE, lw: 3 }] });
      S.inv = gr.inv;
      // faixa do verde, pouco absorvida
      X.save(); X.globalAlpha = .08; X.fillStyle = '#6BE08F'; X.fillRect(gr.fx(500), G.y0 + 1, gr.fx(570) - gr.fx(500), G.h - 2); X.restore();
      tx('clorofila a', gr.fx(NAR ? 432 : 438), gr.fy(chlA(430)) - 12, { s: 12, w: 600, c: VERDE, a: 'left' });
      tx('clorofila b', gr.fx(634), gr.fy(.5), { s: 12, w: 600, c: '#A6E37A', a: 'right' });
      if (!NAR) tx('carotenoides', gr.fx(505), gr.fy(.5), { s: 12, w: 600, c: '#F2B33D', a: 'left' });
      tx('verde: pouco absorvido', gr.fx(535), G.y0 + 14, { s: 12, c: C.dim });
      // espectro com a alga e as bactérias (Engelmann)
      const sy = G.y1 + 26, sh = 16, mig = S.paused ? 1 : ss(t / 5);
      for (let l = 400; l < 700; l += 2) { X.fillStyle = cor(l + 1); X.fillRect(gr.fx(l), sy - sh / 2, gr.fx(l + 2) - gr.fx(l) + .6, sh); }
      rr(gr.fx(400), sy - 3, G.w, 6, 3, '#2A9450', 'rgba(11,15,28,.6)', 1);
      for (let x = gr.fx(400) + 6; x < G.x1; x += 12) line(x, sy - 3, x, sy + 3, 'rgba(11,15,28,.5)', 1);
      for (const b of BAC) { const l = lerp(400 + b.u * 300, b.c, mig), x = gr.fx(l) + Math.sin(t * 2 + b.ph) * 1.5, y = sy + (b.dy < 0 ? -1 : 1) * (6 + Math.abs(b.dy) * 3) + Math.cos(t * 2.4 + b.ph) * 1.2; ell(x, y, 3.2, 2, b.ph, '#E8EDF7', 'rgba(11,15,28,.7)', 1); }
      if (!NAR) tx('alga sob o espectro, com bactérias que procuram O₂', G.x0, sy + 22, { a: 'left', s: 12, c: C.dim, bg: false });
      // cor escolhida
      line(gr.fx(L), G.y0, gr.fx(L), sy + sh / 2, rgba(C.luz, .6), 1.5); marker(gr.fx(L), gr.fy(chlA(L)), C.luz);
      circ(gr.fx(L), sy, 7, cor(L), '#fff', 2);
      hbar(B.x, B.y, B.w, 14, acao(L), VERDE, 'Fotossíntese (O₂ liberado)', Math.round(acao(L) * 100) + ' %');
      hbar(B.x, B.y + B.gap, B.w, 14, chlA(L) / .95, cor(L), 'Absorção pela clorofila a', '');
      if (!NAR) {
        // folha: a luz escolhida é absorvida ou refletida
        const fx = B.x + B.w * .5, fy = B.y - 92, ab = acao(L) > .3;
        leaf(fx, fy, 34, -.25, C.cloro);
        photon(fx - 92, fy - 64, fx - 14, fy - 8, t, 1, cor(L));
        if (!ab) photon(fx + 6, fy - 12, fx + 76, fy - 66, t, 1, cor(L));
        tx(ab ? 'absorvida' : 'refletida', fx + 48, fy + 24, { s: 13, w: 600, c: C.txt });
        tx(`luz ${nome(L)}`, fx - 92, fy - 78, { a: 'left', s: 12, c: C.dim });
      }
      const k = acao(L);
      cap(L >= 500 && L <= 580 ? `Luz ${nome(L)}: quase não é absorvida, e a fotossíntese é baixa. É a cor que a folha reflete` : `Luz ${nome(L)}: ${k > .5 ? 'muito absorvida pelos pigmentos, e a alga libera muito O₂' : k > .25 ? 'absorção moderada, fotossíntese média' : 'pouco absorvida, e a fotossíntese é baixa'}`);
    }
  });
}

// =====================================================================================
// PLANTAS C3, C4 E CAM
// =====================================================================================
{
  const TIPOS = [
    { k: 'C3', ex: 'trigo, arroz, soja, feijão', exs: 'trigo, arroz, feijão' },
    { k: 'C4', ex: 'cana-de-açúcar, milho, capins', exs: 'cana, milho' },
    { k: 'CAM', ex: 'cactos, abacaxi, agave', exs: 'cactos, abacaxi' }];
  // abertura do estômato, fixação de CO₂ agora e água perdida no dia (0 a 1), para luz do dia D e calor h
  const estado = (k, D, h, cyc) => k === 0 ? { ab: D * (1 - .8 * h), fix: D * (1 - .7 * h), agua: 1 - .8 * h, foto: D * h }
    : k === 1 ? { ab: D * (1 - .6 * h), fix: D * (1 - .12 * h), agua: (1 - .6 * h) * .55, foto: 0 }
      : { ab: (1 - D) * .9, fix: D * .5, agua: .22, foto: 0, vac: cyc < .5 ? 1 - cyc * 2 : (cyc - .5) * 2 };
  function estomato(x, y, ab, s) { const gp = 2 + ab * 7 * s; for (const k of [-1, 1]) ell(x + k * (gp / 2 + 8 * s), y, 8 * s, 5 * s, 0, '#3FBF6A', 'rgba(11,15,28,.7)', 1.2); tx(ab > .15 ? 'estômato aberto' : 'estômato fechado', x, y + 9 * s + 6, { s: 12, c: C.dim, bg: false }); }
  function painel(i, x, y, w, h, t, D, hh, cyc, nar) {
    const T = TIPOS[i], E = estado(i, D, hh, cyc);
    rr(x, y, w, h, 12, 'rgba(19,26,43,.6)', C.line, 1);
    // diagrama do corte da folha
    const dx = x + 8, dw = nar ? w * .56 : w - 16, dy = nar ? y + 8 : y + 52, dh = nar ? h - 16 : h * .6, s = nar ? .8 : 1.3;
    rr(dx, dy, dw, dh, 8, '#10261A', rgba(C.cloro, .5), 1);
    const sx = dx + dw * .5, sy = dy + dh - 9 * s - 22, fora = [sx, dy + dh + 30];
    estomato(sx, sy, E.ab, s);
    const rc = Math.min(dw, dh) * (nar ? .16 : .15);
    if (i === 0) {
      const cx = dx + dw * .5, cy = dy + dh * .38; ell(cx, cy, dw * .3, dh * .26, 0, 'rgba(63,191,106,.18)', C.cloro, 1.5);
      ring(cx, cy, rc, C.cloro, 4, 2); tx('Calvin', cx, cy, { s: 12, w: 600, c: C.txt, bg: false });
      if (E.ab > .1) for (let j = 0; j < 2; j++) fly([[sx, sy + 8], [sx, sy - 10], [cx - rc * .8, cy + rc]], fr(t * .35 + j / 2), 'CO₂', C.co2);
      if (E.foto > .3) { fly([[dx + dw - 14, dy + 12], [cx + rc, cy - rc * .4]], fr(t * .3), 'O₂', C.o2); tx('fotorrespiração', cx, dy + 12, { s: 12, w: 600, c: C.o2 }); }
    } else if (i === 1) {
      const mx = dx + dw * .28, my = dy + dh * .5, bx = dx + dw * .7, by = dy + dh * .36;
      ell(mx, my, dw * .2, dh * .2, 0, 'rgba(63,191,106,.14)', C.cloro, 1.5); ell(bx, by, dw * .22, dh * .26, 0, 'rgba(63,191,106,.24)', C.grana, 2);
      ring(bx, by, rc * .9, C.cloro, 4, 2); tx('Calvin', bx, by, { s: 12, w: 600, c: C.txt, bg: false });
      tx('mesofilo', mx, my + dh * .2 + 10, { s: 12, c: C.dim, bg: false }); if (!nar) tx('bainha do feixe', bx, dy + 10, { s: 12, c: C.dim, bg: false });
      for (let j = 0; j < 2; j++) { const f = fr(t * .3 + j / 2), P = [[sx, sy + 8], [sx - 4, sy - 12], [mx, my], [bx - rc * .9, by + rc * .5]], s2 = f < .5 ? 'CO₂' : f < .85 ? '4 C' : 'CO₂'; if (E.ab > .1 || f > .5) fly(P, f, s2, s2 === '4 C' ? C.creme : C.co2); }
    } else {
      const vx = dx + dw * .32, vy = dy + dh * .44, vr = Math.min(dw * .17, dh * .26), cx = dx + dw * .72, cy = dy + dh * .36, nt = D < .5;
      circ(vx, vy, vr, 'rgba(42,159,201,.12)', C.agua, 1.5);
      X.save(); X.beginPath(); X.arc(vx, vy, vr - 1.5, 0, TAU); X.clip(); X.fillStyle = rgba(C.agua, .55); X.fillRect(vx - vr, vy + vr - 2 * vr * E.vac, 2 * vr, 2 * vr * E.vac); X.restore();
      tx('vacúolo', vx, vy - vr - 9, { s: 12, c: C.dim, bg: false });
      ring(cx, cy, rc * .9, C.cloro, 4, 2); tx('Calvin', cx, cy, { s: 12, w: 600, c: rgba(C.txt, nt ? .45 : 1), bg: false });
      if (nt) for (let j = 0; j < 2; j++) { const f = fr(t * .3 + j / 2); fly([[sx, sy + 8], [sx, sy - 10], [vx, vy + vr * .3]], f, f < .6 ? 'CO₂' : 'ácido', f < .6 ? C.co2 : C.agua); }
      else fly([[vx + vr * .6, vy], [cx - rc, cy + rc * .2]], fr(t * .3), 'CO₂', C.co2);
    }
    // nome, exemplos e medidores
    const px = nar ? dx + dw + 10 : x + 12, pw = nar ? x + w - px - 8 : w - 24;
    tx(T.k, px, y + (nar ? 14 : 18), { f: FH, s: nar ? 15 : 18, w: 700, a: 'left', c: C.txt, bg: false });
    tx(nar ? T.exs : T.ex, nar ? px : px + tw(T.k, 18, 700, FH) + 12, y + (nar ? 32 : 19), { s: 12, a: 'left', c: C.dim, bg: false });
    const by0 = nar ? y + 62 : dy + dh + 36, gp = nar ? 40 : 44;
    hbar(px, by0, pw, 10, E.fix, VERDE, 'Fixa CO₂ agora', '');
    hbar(px, by0 + gp, pw, 10, E.agua, C.agua, nar ? 'Perda de água' : 'Água perdida no dia', '');
    return E;
  }
  def('fatores', 'c4cam', {
    t: 'Plantas C3, C4 e CAM', s: 'três jeitos de fixar o CO₂', c: C.cloro, loc: 'Folhas em corte', still: 4,
    ctl: { l: 'Calor e seca', min: 0, max: 100, step: 5, v: 20, f: v => v + ' %', rate: () => 1 },
    alt: 'Três folhas em corte, C3, C4 e CAM, ao longo de um dia e uma noite: o estômato abre e fecha, o gás carbônico chega ao ciclo de Calvin e medidores comparam a fixação e a perda de água',
    d: `<p><b>A RuBisCO tem um defeito: além do CO₂, ela também se liga ao O₂, e isso desperdiça energia.</b> É a <b>fotorrespiração</b>. O problema piora com calor e seca, quando a planta fecha os estômatos e o O₂ se acumula na folha.</p>
<p>A maioria das plantas é <b>C3</b>: fixa o CO₂ direto no ciclo de Calvin, e o primeiro composto formado tem 3 carbonos (trigo, arroz, soja, feijão). As plantas <b>C4</b>, como <b>cana-de-açúcar</b>, milho e capins tropicais, primeiro prendem o CO₂ num composto de 4 carbonos, com outra enzima, nas células do mesofilo, e o levam para células mais internas (a bainha do feixe), onde o liberam concentrado para a RuBisCO: uma <b>separação no espaço</b>.</p>
<p>As plantas <b>CAM</b>, como <b>cactos</b>, <b>abacaxi</b>, agave e muitas bromélias, abrem os estômatos <b>à noite</b>, guardam o CO₂ como ácido no vacúolo e o usam de dia, de estômatos fechados: uma <b>separação no tempo</b>, que economiza muita água. Aumente o calor e a seca e compare as três.</p>`,
    kv: [['C3', 'CO₂ direto no ciclo de Calvin'], ['C4', 'separa as etapas no espaço (mesofilo e bainha)'], ['CAM', 'separa as etapas no tempo (noite e dia)'], ['Fotorrespiração', 'RuBisCO usando O₂; piora com calor'], ['Perda de água', 'CAM menor que C4, que é menor que C3']],
    enem: 'Aparece ligado a <b>adaptações a ambientes secos</b> (Caatinga, cactos, bromélias) e à <b>agricultura</b> (cana e milho, plantas C4, muito produtivas em clima quente). Guarde: C4 separa as etapas <b>no espaço</b>, em dois tipos de célula; CAM separa <b>no tempo</b>, abrindo os estômatos à noite. A pista na questão costuma ser "estômatos abertos à noite" (CAM).',
    links: [['Ciclo de Calvin', '#foto/calvin'], ['Concentração de CO₂', '#fatores/co2']],
    draw(t, S) {
      const A = area(), hh = S.v / 100, cyc = fr(t / 16), D = ss(Math.sin(cyc * TAU) * 2.5 + .5);
      // relógio de dia e noite
      const cw = Math.min(220, A.w * .6), cx0 = A.cx - cw / 2, cy0 = A.y0 + 10;
      rr(cx0, cy0 - 5, cw / 2, 10, 5, 'rgba(255,233,168,.35)'); rr(cx0 + cw / 2, cy0 - 5, cw / 2, 10, 5, 'rgba(91,108,153,.35)');
      circ(cx0 + cw * cyc, cy0, 8, D > .5 ? C.luz : '#C9CFDC', 'rgba(11,15,28,.7)', 1.5);
      tx('dia', cx0 - 8, cy0, { a: 'right', s: 12, c: D > .5 ? C.txt : C.dim, bg: false }); tx('noite', cx0 + cw + 8, cy0, { a: 'left', s: 12, c: D > .5 ? C.dim : C.txt, bg: false });
      const y0 = A.y0 + 26, gap = NAR ? 8 : 16, E = [];
      if (NAR) { const h = (A.y1 - y0 - gap * 2) / 3; for (let i = 0; i < 3; i++) E.push(painel(i, A.x0, y0 + i * (h + gap), A.w, h, t, D, hh, cyc, true)); }
      else { const w = (A.w - gap * 2) / 3; for (let i = 0; i < 3; i++) E.push(painel(i, A.x0 + i * (w + gap), y0, w, A.y1 - y0, t, D, hh, cyc, false)); }
      cap(D > .5 ? (hh > .5 ? 'Dia quente e seco: a C3 fecha o estômato e perde para a fotorrespiração; a C4 quase não sente; a CAM usa o CO₂ guardado à noite' : 'Dia: C3 e C4 abrem os estômatos e fixam CO₂; a CAM fica fechada e usa o CO₂ guardado no vacúolo')
        : 'Noite: sem luz, C3 e C4 param o ciclo de Calvin; a CAM abre os estômatos, com o ar fresco, e guarda o CO₂ como ácido');
    }
  });
}

// =====================================================================================
// CINCO JEITOS DE OBTER ENERGIA
// =====================================================================================
{
  const PR = [
    { n: 'Fotossíntese', c: C.cloro, ic: 'sol', L: ['Energia: luz', 'Carbono: CO₂', 'Libera: O₂', 'Quem: plantas, algas, cianobactérias'] },
    { n: 'Quimiossíntese', c: C.s, ic: 'fonte', L: ['Energia: oxidar NH₃, H₂S, Fe²⁺', 'Carbono: CO₂', 'Não libera O₂', 'Quem: nitrificantes, sulfobactérias'] },
    { n: 'Respiração aeróbica', c: C.mito, ic: 'glic', L: ['Energia: glicose', 'Aceptor final: O₂', 'Libera: CO₂ e H₂O', 'ATP: 30 a 32'] },
    { n: 'Respiração anaeróbica', c: C.nad, ic: 'glic', L: ['Energia: orgânicos', 'Aceptor: nitrato, sulfato', 'Libera: CO₂ e outros', 'ATP: menos que a aeróbica'] },
    { n: 'Fermentação', c: C.creme, ic: 'glic', L: ['Energia: glicose', 'Sem cadeia transportadora', 'Libera: lactato, ou etanol + CO₂', 'ATP: 2'] }];
  const FIL = [
    { f: 'todos', on: [1, 1, 1, 1, 1] },
    { f: 'usa O₂', on: [0, 1, 1, 0, 0], nt: { 1: 'em geral, para oxidar' } },
    { f: 'libera CO₂', on: [0, 0, 1, 1, 1], nt: { 4: 'só a alcoólica' } },
    { f: 'libera O₂', on: [1, 0, 0, 0, 0] },
    { f: 'autótrofos', on: [1, 1, 0, 0, 0] },
    { f: 'heterótrofos', on: [0, 0, 1, 1, 1] }];
  const CAPS = ['Todo ser vivo precisa de uma fonte de energia e de uma fonte de carbono',
    'Usam O₂: a respiração aeróbica, como aceptor final, e em geral a quimiossíntese, para oxidar NH₃ ou H₂S',
    'Liberam CO₂: as respirações e a fermentação alcoólica; a fermentação lática não libera CO₂',
    'Só a fotossíntese libera O₂, e esse O₂ vem da água',
    'Autótrofos fazem matéria orgânica a partir do CO₂: com luz ou com energia química',
    'Heterótrofos tiram energia e carbono do alimento: respiram ou fermentam'];
  function icone(k, x, y, r, c) {
    if (k === 'sol') { circ(x, y, r * .5, C.luz, 'rgba(11,15,28,.5)', 1); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; line(x + Math.cos(a) * r * .68, y + Math.sin(a) * r * .68, x + Math.cos(a) * r, y + Math.sin(a) * r, C.luz, 1.6); } }
    else if (k === 'fonte') { X.beginPath(); X.moveTo(x - r, y + r * .8); X.lineTo(x - r * .3, y - r * .3); X.lineTo(x + r * .3, y - r * .3); X.lineTo(x + r, y + r * .8); X.closePath(); X.fillStyle = '#5A4A3E'; X.fill(); circ(x - r * .1, y - r * .65, r * .2, 'rgba(201,207,220,.5)'); circ(x + r * .2, y - r * 1, r * .14, 'rgba(201,207,220,.4)'); }
    else ngon(x, y, r * .8, 6, PI / 6, rgba(C.glic, .25), C.glic, 1.8);
  }
  def('relacao', 'comparar', {
    t: 'Cinco jeitos de obter energia', s: 'quadro comparativo', c: C.agua, loc: 'Quadro comparativo', still: 3,
    ctl: { l: 'Destacar', min: 0, max: 5, step: 1, v: 0, f: v => FIL[v].f, rate: () => 1 },
    alt: 'Cinco cartões comparam fotossíntese, quimiossíntese, respiração aeróbica, respiração anaeróbica e fermentação, com a fonte de energia, o carbono, o que liberam e o rendimento em ATP',
    d: `<p><b>Todo ser vivo precisa de uma fonte de energia e de uma fonte de carbono.</b> Os <b>autótrofos</b> fazem a própria matéria orgânica a partir do CO₂: com energia da <b>luz</b> (fotossíntese) ou de <b>reações químicas</b> com substâncias inorgânicas (quimiossíntese). Os <b>heterótrofos</b> tiram energia e carbono do alimento orgânico.</p>
<p>Para liberar a energia do alimento, há três caminhos. A <b>respiração aeróbica</b> usa O₂ como aceptor final dos elétrons e rende cerca de 30 ATP por glicose. A <b>respiração anaeróbica</b>, de certas bactérias, tem cadeia transportadora, mas usa outro aceptor, como nitrato ou sulfato. A <b>fermentação</b>, sem cadeia transportadora, rende só 2 ATP.</p>
<p>Uma mesma planta faz fotossíntese e respiração, e uma mesma levedura pode respirar ou fermentar, conforme haja O₂ ou não. Use a faixa para destacar os processos que usam O₂, liberam CO₂ ou liberam O₂.</p>`,
    kv: [['Fotossíntese', 'luz e CO₂; libera O₂'], ['Quimiossíntese', 'oxidação de inorgânicos e CO₂; não libera O₂'], ['Respiração aeróbica', 'O₂ como aceptor; 30 a 32 ATP'], ['Respiração anaeróbica', 'nitrato ou sulfato como aceptor; menos ATP'], ['Fermentação', 'sem cadeia transportadora; 2 ATP']],
    enem: 'O ENEM gosta de pedir a classificação: quem é <b>autótrofo</b> (luz ou química) e quem é <b>heterótrofo</b>, quem <b>libera CO₂</b> (respiração e fermentação alcoólica, não a lática) e quem <b>libera O₂</b> (só a fotossíntese). Erros comuns: achar que planta não respira, que fermentação é "respiração sem O₂" e que quimiossíntese usa luz. Na dúvida, pergunte: de onde vem a energia e de onde vem o carbono?',
    links: [['Quimiossíntese', '#relacao/quimio'], ['Saldo de ATP', '#resp/saldo'], ['Fermentação alcoólica', '#ferm/alcoolica']],
    draw(t, S) {
      const A = area(), F = FIL[S.v], cols = NAR ? 2 : 5, gap = NAR ? 8 : 12;
      const rows = NAR ? 3 : 1, barH = NAR ? 0 : Math.max(130, A.h * .4), cw = (A.w - gap * (cols - 1)) / cols, ch = NAR ? (A.h - gap * (rows - 1)) / rows : Math.min(250, A.h - barH - gap);
      PR.forEach((p, i) => {
        const x = A.x0 + (i % cols) * (cw + gap), y = A.y0 + Math.floor(i / cols) * (ch + gap), on = F.on[i];
        X.save(); X.globalAlpha = on ? 1 : .3;
        rr(x, y, cw, ch, 12, on && S.v ? rgba(p.c, .1) : 'rgba(19,26,43,.6)', on && S.v ? p.c : C.line, on && S.v ? 2 : 1);
        const ir = NAR ? 9 : 12; icone(p.ic, x + cw - ir - 10, y + ir + 10, ir, p.c);
        const pad = 10, mw = cw - pad * 2; let yy = y + 18;
        yy += wrapTx(p.n, x + pad, yy, mw - ir * 2 - 6, { f: FH, s: NAR ? 13 : 16, w: 700, a: 'left', c: p.c, lh: NAR ? 16 : 20 }) + (NAR ? 4 : 8);
        for (const l of p.L) { if (yy > y + ch - 14) break; yy += wrapTx(l, x + pad, yy, mw, { s: NAR ? 12 : 13, a: 'left', c: C.txt, lh: NAR ? 15 : 18 }) + (NAR ? 3 : 6); }
        const nt = F.nt && F.nt[i]; if (nt && yy < y + ch - 6) tx(nt, x + pad, Math.min(y + ch - 12, yy + 4), { s: 12, w: 700, a: 'left', c: C.luz, bg: false });
        X.restore();
      });
      // rendimento em ATP por glicose
      const g = S.paused ? 1 : ss(t / 2);
      const bx = NAR ? A.x0 + cw + gap + 8 : A.x0, bw = NAR ? cw - 16 : A.w * .5, by = NAR ? A.y0 + 2 * (ch + gap) + 30 : A.y0 + ch + 56;
      if (NAR) { rr(A.x0 + cw + gap, A.y0 + 2 * (ch + gap), cw, ch, 12, 'rgba(19,26,43,.6)', C.line, 1); tx('ATP por glicose', bx, by - 16, { s: 12, w: 700, a: 'left', c: C.txt, bg: false }); }
      else tx('ATP por glicose', bx, by - 22, { f: FH, s: 15, w: 600, a: 'left', c: C.txt, bg: false });
      const sp = NAR ? 38 : 40;
      hbar(bx, by + 10, bw, 12, g * 31 / 32, C.mito, NAR ? 'Aeróbica' : 'Respiração aeróbica', '30 a 32');
      hbar(bx, by + 10 + sp, bw, 12, g * 2 / 32, C.creme, 'Fermentação', '2');
      if (!NAR) wrapTx('A respiração anaeróbica rende menos que a aeróbica; o valor depende do aceptor.', A.x0 + A.w * .56, by, A.w * .42, { s: 13, a: 'left', c: C.dim });
      cap(CAPS[S.v]);
    }
  });
}
