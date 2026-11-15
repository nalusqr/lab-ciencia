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

// =====================================================================================
// COMPOSIÇÃO QUÍMICA DA CÉLULA
// =====================================================================================
{
  const CL = [['água', C.aguaM], ['proteínas', C.prot], ['lipídios', C.lip], ['carboidratos', C.carb], ['ácidos nucleicos', C.na], ['sais e íons', C.sal], ['outras moléculas pequenas', '#6F7A96']];
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
    init(S) { S.k = 0; S.lastV = -1; },
    draw(t, S) {
      const A = area(), v = cl(Math.round(S.v) || 0, 0, 2), D = DADOS[v]; if (v !== S.lastV) { S.lastV = v; S.k = 0; } S.k = Math.min(1, S.k + (S.dt || .016) * .9 + (S.paused ? 1 : 0));
      const n = Math.round(100 * ss(S.k)), side = NAR ? Math.min(A.w * .86, A.h * .5) : Math.min(A.h * .92, A.w * .48), cs = side / 10, gx = NAR ? A.cx - side / 2 : A.x0 + A.w * .04, gy = NAR ? A.y0 + 4 : A.cy - side / 2;
      const cells = []; D.forEach((p, i) => { for (let j = 0; j < p; j++) cells.push(i); });
      for (let k = 0; k < 100; k++) { const col = k % 10, row = 9 - Math.floor(k / 10), c = k < n ? CL[cells[k]][1] : 'rgba(91,108,153,.18)'; rr(gx + col * cs + 1.5, gy + row * cs + 1.5, cs - 3, cs - 3, 3, c); }
      // legenda com valores
      const lx = NAR ? A.x0 + 6 : gx + side + A.w * .06, ly = NAR ? gy + side + 22 : A.cy - CL.length * 16, lh = NAR ? 20 : 32, colW = NAR ? A.w / 2 : 0;
      CL.forEach(([nome, c], i) => {
        const x = NAR ? lx + (i % 2) * colW : lx, y = NAR ? ly + Math.floor(i / 2) * lh : ly + i * lh, on = D[i] > 0;
        rr(x, y - 7, 14, 14, 3, on ? c : 'rgba(91,108,153,.3)');
        tx(NAR && nome.length > 16 ? 'outras pequenas' : nome, x + 22, y, { a: 'left', s: NAR ? 12 : 14, w: 600, c: on ? C.txt : C.dim, bg: false });
        tx(D[i] + ' %', NAR ? x + colW - 10 : x + A.w * .36, y, { a: 'right', f: FD, s: NAR ? 12 : 14, w: 500, c: on ? C.txt : C.dim, bg: false });
      });
      if (!NAR) { tx('cada quadrado = 1% da massa', gx + side / 2, gy + side + 18, { s: 12, c: C.dim, bg: false }); tx('inorgânicas: água e sais · orgânicas: as demais', lx, ly + CL.length * lh + 10, { a: 'left', s: 12, c: C.dim, bg: false }); }
      cap(v === 0 ? 'Célula animal: cerca de 70% de água e 18% de proteínas' : v === 1 ? 'Bactéria: ácidos nucleicos chegam a cerca de 7% (muito RNA nos ribossomos)' : 'Massa seca da célula animal: as proteínas são cerca de 60% do que sobra');
    }
  });
}
{
  const MASSA = [['O', 65], ['C', 18.5], ['H', 9.5], ['N', 3.2], ['Ca', 1.5], ['P', 1], ['K', .4], ['S', .3], ['Na', .2], ['Cl', .2], ['Mg', .1]];
  const ATOMOS = [['H', 62], ['O', 24], ['C', 12], ['N', 1.1], ['Ca', .22], ['P', .22], ['K', .03], ['S', .04], ['Na', .04], ['Cl', .02], ['Mg', .01]];
  const COR = { O: C.o, C: C.c, H: C.h, N: C.n, P: C.p, S: C.s, Ca: '#D6DCE8', K: '#C79BFF', Na: C_NA, Cl: C_CL, Mg: '#8FD18F' };
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
    init(S) { S.k = 0; S.lastV = -1; },
    draw(t, S) {
      const A = area(), v = Math.round(S.v), D = v ? ATOMOS : MASSA; if (v !== S.lastV) { S.lastV = v; S.k = 0; } S.k = Math.min(1, S.k + (S.dt || .016) * .8 + (S.paused ? 1 : 0));
      const bh = Math.min(26, (A.h - 20) / D.length - 8), gap = (A.h - 10) / D.length, x0 = A.x0 + (NAR ? 46 : 70), w = A.w - (NAR ? 46 : 70) - (NAR ? 60 : 110);
      D.forEach(([el, p], i) => {
        const y = A.y0 + 6 + i * gap, ch = 'CHONPS'.includes(el) && el.length === 1, f = ss(S.k * 1.4 - i * .04) * p / 70;
        rr(x0 - (NAR ? 40 : 56), y, NAR ? 32 : 40, bh, 4, COR[el], ch ? '#fff' : null, 1.5);
        tx(el, x0 - (NAR ? 24 : 36), y + bh / 2 + .5, { s: 13, w: 700, c: '#0B0F1C', bg: false });
        rr(x0, y, w, bh, 4, 'rgba(91,108,153,.16)'); rr(x0, y, Math.max(3, w * f), bh, 4, COR[el]);
        tx(nbr(p, p < 1 ? 2 : 1).replace(/,0$/, '') + ' %', x0 + Math.max(3, w * f) + 8, y + bh / 2, { a: 'left', f: FD, s: 13, w: 500, c: C.txt, bg: false });
      });
      if (!NAR) tx('contorno branco: C, H, O, N, P e S', A.x1 - 4, A.y1 - 8, { a: 'right', s: 12, c: C.dim, bg: false });
      cap(v ? 'Por número de átomos, o hidrogênio lidera: 62 de cada 100 átomos do corpo' : 'Por massa, o oxigênio lidera (cerca de 65%), seguido do carbono (cerca de 18,5%)');
    }
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
  def('agua', 'molecula', {
    t: 'Polaridade e ligações de hidrogênio', s: 'por que o gelo flutua', c: C.aguaM, loc: 'Moléculas de água', still: 2,
    ctl: { l: 'Temperatura', min: -20, max: 100, step: 1, v: 25, f: v => v + ' °C', rate: () => 1 },
    alt: 'Moléculas de água ligadas por ligações de hidrogênio; abaixo de zero grau elas formam uma rede aberta de gelo que ocupa mais volume',
    d: `<p><b>A molécula de água é polar.</b> O oxigênio atrai os elétrons das ligações com mais força do que o hidrogênio. Por isso o lado do oxigênio fica com carga parcial negativa (δ⁻) e os hidrogênios ficam com carga parcial positiva (δ⁺). Como a molécula é angular (cerca de 104,5°), as cargas não se anulam.</p>
<p>O hidrogênio de uma molécula é atraído pelo oxigênio da vizinha: é a <b>ligação de hidrogênio</b>, mais fraca do que uma ligação covalente, mas muito numerosa. Na água líquida, essas ligações se formam e se desfazem o tempo todo.</p>
<p>Abaixo de 0&nbsp;°C, cada molécula fica presa a quatro vizinhas numa rede hexagonal aberta. O gelo ocupa mais volume e é <b>menos denso</b> do que a água líquida (0,92 contra 1,00&nbsp;g/cm³). Por isso ele flutua, e lagos congelam de cima para baixo: a camada de gelo isola a água de baixo, onde a vida continua.</p>`,
    kv: [['Ângulo H–O–H', 'cerca de 104,5°'], ['Densidade do gelo', '0,92 g/cm³'], ['Densidade da água a 4 °C', '1,00 g/cm³ (a maior)'], ['Ligações por molécula no gelo', '4 ligações de hidrogênio']],
    enem: 'A polaridade e as ligações de hidrogênio explicam quase todas as propriedades da água que caem na prova: alto calor específico, coesão, capilaridade, ação como solvente e o gelo que flutua. Use o termo "ligação de hidrogênio" (o nome antigo "ponte de hidrogênio" ainda aparece em livros).',
    links: [LK.mol, ['Tabela periódica', '../tabela-periodica/index.html']],
    draw(t, S) {
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
  });
}

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
    const A = area(), d = S.v, hmm = 29.7 / d, ds = [2, 1, d], base = A.y1 - A.h * .22, scale = (base - A.y0 - 48) / 150;
    rr(A.x0 + A.w * (NAR ? .02 : .04), base, A.w * (NAR ? .96 : .56), A.y1 - base, 8, rgba(C.aguaM, .25), rgba(C.aguaM, .7), 1.5);
    const xs = NAR ? [.18, .5, .82] : [.12, .32, .52];
    ds.forEach((dd, i) => {
      const x = A.x0 + A.w * xs[i], wpx = Math.max(6, dd * (NAR ? 12 : 18)), h = 29.7 / dd * scale, top = A.y0 + 30, sub = Math.min(h, h * ss(t * .5));
      rr(x - wpx / 2 - 2, top, wpx + 4, A.y1 - 10 - top, 3, 'rgba(207,224,255,.06)', 'rgba(207,224,255,.65)', 1.5);
      rr(x - wpx / 2, base - sub, wpx, A.y1 - 12 - (base - sub), 2, rgba(C.aguaM, .7));
      X.beginPath(); X.moveTo(x - wpx / 2, base - sub - 3); X.quadraticCurveTo(x, base - sub + wpx * .35, x + wpx / 2, base - sub - 3); X.strokeStyle = light(C.aguaM, .3); X.lineWidth = 2; X.stroke();
      tx(i === 2 ? nbr(dd, 1) + ' mm' : dd + ' mm', x, A.y0 + 14, { s: 12, f: FD, w: 500, c: i === 2 ? C.txt : C.dim });
      tx('≈ ' + nbr(29.7 / dd / 10, 1) + ' cm', x, base - sub - 16, { s: 12, f: FD, w: 500, c: C.txt });
    });
    if (!NAR) {
      // zoom no menisco: adesão e coesão
      const zx = A.x0 + A.w * .82, zy = A.y0 + A.h * .42, zr = Math.min(A.w * .15, A.h * .36);
      circ(zx, zy, zr, 'rgba(19,26,43,.8)', C.line, 1.5); X.save(); X.beginPath(); X.arc(zx, zy, zr - 2, 0, TAU); X.clip();
      rr(zx - zr, zy - zr, zr * .3, zr * 2, 0, 'rgba(207,224,255,.25)'); rr(zx + zr * .7, zy - zr, zr * .3, zr * 2, 0, 'rgba(207,224,255,.25)');
      X.beginPath(); X.moveTo(zx - zr * .7, zy - zr * .5); X.quadraticCurveTo(zx, zy + zr * .1, zx + zr * .7, zy - zr * .5); X.lineTo(zx + zr * .7, zy + zr); X.lineTo(zx - zr * .7, zy + zr); X.closePath(); X.fillStyle = rgba(C.aguaM, .25); X.fill();
      const R = rng(3); const pts = []; for (let i = 0; i < 16; i++) { const px = zx - zr * .55 + R() * zr * 1.1, py = zy + zr * .05 + R() * zr * .8 - Math.pow((px - zx) / (zr * .7), 2) * zr * .45; pts.push([px, py]); h2o(px + Math.sin(t + i) * 2, py, 6, R() * TAU + t * .3); }
      X.restore();
      arrow(zx - zr * .5, zy - zr * .25, zx - zr * .72, zy - zr * .45, light(C.aguaM, .3), 2); arrow(zx + zr * .5, zy - zr * .25, zx + zr * .72, zy - zr * .45, light(C.aguaM, .3), 2);
      tx('adesão', zx - zr * .55, zy - zr * .7, { s: 13, w: 600 }); tx('coesão', zx, zy + zr * .55, { s: 13, w: 600 });
      tx('detalhe da borda', zx, zy + zr + 16, { s: 12, c: C.dim });
    }
    cap(`Tubo de ${nbr(d, 1)} mm: a água sobe cerca de ${nbr(hmm / 10, 1)} cm. Metade do diâmetro, o dobro da altura`);
  }
});

def('agua', 'calor', {
  t: 'Calor específico', s: 'a água esquenta e esfria devagar', c: C.aguaM, loc: 'Praia ao longo de um dia',
  alt: 'Gráfico da temperatura da areia e do mar ao longo de um dia: a areia esquenta e esfria muito mais do que a água',
  d: `<p><b>Calor específico é a quantidade de energia necessária para aquecer 1 grama de uma substância em 1&nbsp;°C.</b> O da água é alto, 1&nbsp;cal/g·°C, cerca de cinco vezes o da areia. Parte da energia que chega é gasta para romper ligações de hidrogênio antes de as moléculas se agitarem mais.</p>
<p>Por isso, num dia de sol, a areia da praia esquenta muito e esfria depressa à noite, enquanto o mar muda pouco de temperatura. Regiões perto de grandes massas de água têm clima mais ameno do que o interior.</p>
<p>Nos seres vivos, a água funciona como um <b>tampão térmico</b>: como somos 60% água, a temperatura do corpo muda pouco. Além disso, a água tem alto <b>calor de vaporização</b>: ao evaporar, o suor leva muito calor da pele. A transpiração das plantas faz o mesmo nas folhas.</p>`,
  kv: [['Calor específico da água', '1 cal/g·°C (4,18 J/g·°C)'], ['Areia seca', 'cerca de 0,2 cal/g·°C'], ['Calor de vaporização', 'cerca de 540 cal/g a 100 °C'], ['Efeito', 'estabilidade da temperatura do corpo e do clima']],
  enem: 'Aparece em questões de clima (cidades litorâneas × interior, brisa marítima), de regulação da temperatura (suor, transpiração das plantas) e em comparações entre substâncias. A pista é sempre a mesma: muita energia para pouca mudança de temperatura.',
  links: [LK.mol],
  draw(t) {
    const A = area(), h = (t * 1.2) % 24, sand = x => 24 + 14 * Math.sin((x - 9) / 24 * TAU), sea = x => 24 + 1.6 * Math.sin((x - 11) / 24 * TAU);
    const G = NAR ? { x0: A.x0 + 32, y0: A.y0 + A.h * .44, x1: A.x1 - 6, y1: A.y1 - 34 } : { x0: A.x0 + 50, y0: A.y0 + 10, x1: A.x0 + A.w * .55, y1: A.y1 - 44 }; G.w = G.x1 - G.x0; G.h = G.y1 - G.y0;
    const g = graph(G, { x0: 0, x1: 24, y0: 5, y1: 45, xl: 'hora do dia', yl: 'temperatura (°C)', xt: [[0, '0 h'], [6, '6'], [12, '12'], [18, '18'], [24, '24 h']], curves: [{ f: sand, c: '#E8C99A', lw: 3 }, { f: sea, c: C.aguaM, lw: 3 }] });
    tx('areia', g.fx(15), g.fy(sand(15)) - 14, { s: 12, w: 600, c: '#E8C99A' }); tx('mar', g.fx(21), g.fy(sea(21)) - 14, { s: 12, w: 600, c: C.aguaM });
    line(g.fx(h), G.y0, g.fx(h), G.y1, rgba(C.luz, .5), 1.5); marker(g.fx(h), g.fy(sand(h)), '#E8C99A'); marker(g.fx(h), g.fy(sea(h)), C.aguaM);
    // praia
    const P = NAR ? { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y0 + A.h * .34 } : { x0: A.x0 + A.w * .62, y0: A.y0 + 10, x1: A.x1, y1: A.y1 - 30 }, pw = P.x1 - P.x0, ph = P.y1 - P.y0, day = Math.sin((h - 6) / 24 * TAU);
    rr(P.x0, P.y0, pw, ph, 12, day > 0 ? 'rgba(60,90,140,.55)' : 'rgba(14,20,40,.9)', C.line, 1);
    const sx = P.x0 + pw * ((h - 6) / 12), sy = P.y0 + ph * (.55 - .4 * Math.max(0, day));
    if (day > 0) { circ(sx, sy, 14, C.luz); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * .2; line(sx + Math.cos(a) * 18, sy + Math.sin(a) * 18, sx + Math.cos(a) * 24, sy + Math.sin(a) * 24, C.luz, 2); } } else { circ(P.x0 + pw * .8, P.y0 + ph * .2, 10, '#E8EDF7'); circ(P.x0 + pw * .8 + 5, P.y0 + ph * .2 - 3, 9, 'rgba(14,20,40,1)'); }
    const ty = P.y0 + ph * .62, ts = sand(h), tm = sea(h), col = T => `rgb(${cl(120 + (T - 10) * 5, 80, 255) | 0},${cl(140 - Math.abs(T - 25) * 1.5, 60, 200) | 0},${cl(220 - (T - 10) * 5, 40, 230) | 0})`;
    rr(P.x0 + 2, ty, pw * .5, P.y1 - ty - 2, 8, '#C9A574'); rr(P.x0 + pw * .5, ty + 6, pw * .5 - 2, P.y1 - ty - 8, 8, '#2A6F9C');
    tok(P.x0 + pw * .25, ty + (P.y1 - ty) / 2, 'areia ' + Math.round(ts) + ' °C', col(ts)); tok(P.x0 + pw * .75, ty + (P.y1 - ty) / 2 + 3, 'mar ' + Math.round(tm) + ' °C', col(tm));
    cap(`${String(Math.floor(h)).padStart(2, '0')} h: areia a ${Math.round(ts)} °C e mar a ${Math.round(tm)} °C. A água varia pouco porque tem alto calor específico`);
  }
});

def('agua', 'solvente', {
  t: 'Solvente universal', s: 'a água dissolve o sal', c: C.aguaM, loc: 'Cristal de cloreto de sódio na água',
  alt: 'Um cristal de sal se desfaz na água: cada íon de sódio fica cercado pelos oxigênios e cada íon de cloreto pelos hidrogênios das moléculas de água',
  d: `<p><b>A água dissolve mais substâncias do que qualquer outro líquido comum, por isso é chamada de solvente universal.</b> Ela dissolve bem substâncias <b>polares</b> e <b>iônicas</b>, como açúcares, aminoácidos e sais.</p>
<p>Quando um cristal de sal (NaCl) cai na água, as moléculas de água cercam os íons da superfície e os arrancam do cristal. O lado negativo (oxigênio) se volta para o íon positivo, Na⁺; o lado positivo (hidrogênios) se volta para o íon negativo, Cl⁻. Cada íon fica envolvido por uma <b>camada de hidratação</b>.</p>
<p>Substâncias apolares, como óleos e gorduras, não se misturam com a água (são <b>hidrofóbicas</b>). Dissolvidas, as substâncias podem reagir, ser transportadas pelo sangue e pela seiva e atravessar membranas. Quase todas as reações da célula acontecem em meio aquoso.</p>`,
  kv: [['Dissolve bem', 'substâncias polares e iônicas (hidrofílicas)'], ['Não dissolve', 'substâncias apolares: óleos, gorduras (hidrofóbicas)'], ['Na⁺ cercado por', 'oxigênios (δ⁻) da água'], ['Cl⁻ cercado por', 'hidrogênios (δ⁺) da água']],
  enem: 'Liga-se a transporte (sangue, seiva, urina), à digestão (reações de hidrólise, em que a água participa) e à poluição (substâncias dissolvidas na água se espalham). Também cai a regra "semelhante dissolve semelhante": polar com polar, apolar com apolar.',
  links: [LK.nacl, LK.mol],
  draw(t) {
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
});

{
  const TEC = [['pulmões', 83], ['músculos', 79], ['rins', 79], ['encéfalo', 73], ['coração', 73], ['pele', 64], ['ossos', 31], ['tecido adiposo', 15]];
  const idadeAgua = a => a <= 0 ? 75 : a < 1 ? lerp(75, 65, a) : a < 20 ? lerp(65, 60, (a - 1) / 19) : a < 70 ? lerp(60, 55, (a - 20) / 50) : lerp(55, 50, Math.min(1, (a - 70) / 20));
  def('agua', 'teor', {
    t: 'Teor de água', s: 'varia com o tecido e com a idade', c: C.aguaM, loc: 'Corpo humano', still: 0,
    ctl: { l: 'Idade', min: 0, max: 90, step: 1, v: 30, f: v => v === 0 ? 'recém-nascido' : v + (v === 1 ? ' ano' : ' anos'), rate: () => 1 },
    alt: 'Silhueta humana preenchida até a porcentagem de água do corpo para a idade escolhida, ao lado de barras com o teor de água de cada tecido',
    d: `<p><b>A quantidade de água muda de um tecido para outro e diminui com a idade.</b> Em geral, quanto mais intensa a atividade metabólica de um tecido, maior o teor de água: pulmões, músculos e rins têm cerca de 80%; os ossos, cerca de 30%; o tecido adiposo, que guarda gordura, tem pouca água.</p>
<p>Um embrião no início da gestação tem cerca de 90% de água; o recém-nascido, perto de 75%; um adulto, em torno de 60%; e um idoso, de 50 a 55%. Mude a idade no controle. Como o tecido adiposo tem pouca água, pessoas com mais gordura corporal têm proporcionalmente menos água.</p>
<p>A água também varia entre espécies: águas-vivas têm cerca de 95%, e sementes secas, menos de 15%. A semente só germina depois de absorver água, porque o metabolismo depende dela.</p>`,
    kv: [['Recém-nascido', 'cerca de 75%'], ['Adulto', 'cerca de 60%'], ['Idoso', 'cerca de 50 a 55%'], ['Mais água', 'tecidos de metabolismo intenso'], ['Água-viva × semente seca', 'cerca de 95% × menos de 15%']],
    enem: 'Relações que a prova cobra: o teor de água cai com a idade, é maior em tecidos de metabolismo intenso e menor em tecidos de reserva e sustentação (gordura, osso, dente). Bebês e idosos desidratam com mais facilidade, um tema ligado a diarreia e ao soro caseiro.',
    links: [['Água e sais na hemácia', '#sais/osmose']],
    draw(t, S) {
      const A = area(), a = S.v, p = idadeAgua(a), Bh = NAR ? A.h * .46 : A.h * .92, Bw = Bh * .42, bx = NAR ? A.x0 + A.w * .28 : A.x0 + A.w * .2, by = NAR ? A.y0 + 4 : A.cy - Bh / 2, sc = .78 + .22 * Math.min(1, a / 16);
      // silhueta
      const sh = () => { const hh = Bh * sc, x = bx, y0 = by + Bh - hh, hr = hh * .09; X.beginPath(); X.arc(x, y0 + hr, hr, 0, TAU); X.roundRect(x - hh * .14, y0 + hr * 2.2, hh * .28, hh * .42, hh * .06); X.roundRect(x - hh * .22, y0 + hr * 2.4, hh * .07, hh * .36, hh * .035); X.roundRect(x + hh * .15, y0 + hr * 2.4, hh * .07, hh * .36, hh * .035); X.roundRect(x - hh * .13, y0 + hr * 2.2 + hh * .4, hh * .11, hh * .42, hh * .05); X.roundRect(x + hh * .02, y0 + hr * 2.2 + hh * .4, hh * .11, hh * .42, hh * .05); };
      X.save(); sh(); X.fillStyle = 'rgba(91,108,153,.25)'; X.fill(); X.clip(); const top = by + Bh - Bh * sc * p / 100 + Math.sin(t * 2) * 2; X.fillStyle = rgba(C.aguaM, .75); X.fillRect(bx - Bh, top, Bh * 2, Bh); X.restore();
      X.save(); sh(); X.strokeStyle = C.line; X.lineWidth = 1.5; X.stroke(); X.restore();
      tx(Math.round(p) + ' % de água', bx + Bh * .32, by + Bh * .45, { a: 'left', f: FH, s: NAR ? 16 : 20, w: 700, c: C.txt });
      // barras dos tecidos (adulto)
      const x0 = NAR ? A.x0 + 100 : A.x0 + A.w * .5, w = NAR ? A.w - 140 : A.w * .38, y0 = NAR ? A.y0 + A.h * .54 : A.y0 + 30, gap = NAR ? (A.h * .46 - 4) / TEC.length : (A.h - 50) / TEC.length;
      if (!NAR) tx('teor de água por tecido (adulto)', x0 - 96, A.y0 + 8, { a: 'left', s: 13, w: 600, c: C.dim, bg: false });
      TEC.forEach(([n, v], i) => { const y = y0 + i * gap, bh = Math.min(14, gap - 8); tx(n, x0 - 8, y + bh / 2, { a: 'right', s: 12, w: 600, c: C.txt, bg: false }); rr(x0, y, w, bh, 3, 'rgba(91,108,153,.2)'); rr(x0, y, w * v / 100, bh, 3, C.aguaM); tx(v + ' %', x0 + w * v / 100 + 6, y + bh / 2, { a: 'left', f: FD, s: 12, w: 500, c: C.txt, bg: false }); });
      cap(a === 0 ? 'Recém-nascido: cerca de 75% de água' : a < 15 ? 'Na infância o teor de água cai depressa' : a < 65 ? 'Adulto: cerca de 60% de água' : 'Idoso: cerca de 50 a 55% de água; a sede também diminui');
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
  function minDraw(i, x, y, u, t) {
    const m = MIN[i];
    if (i === 0) { const L = u * 2.2; rr(x - L / 2, y - u * .22, L, u * .44, u * .2, '#EDE6D6', 'rgba(11,15,28,.5)', 1.5); for (const sx of [-1, 1]) for (const sy of [-1, 1]) circ(x + sx * L / 2, y + sy * u * .26, u * .3, '#EDE6D6', 'rgba(11,15,28,.5)', 1.5); rr(x - L / 2 + 6, y - u * .1, L - 12, u * .2, 4, '#EDE6D6'); tx('osso', x, y + u * .75, { s: 12, c: C.dim }); }
    else if (i === 1) { ell(x, y, u * 1.1, u * .9, 0, '#C9303B', 'rgba(11,15,28,.5)', 1.5); ell(x, y, u * .55, u * .42, 0, '#A3252F'); const hs = u * .5; X.save(); X.translate(x, y); X.rotate(t * .2); rr(-hs / 2, -hs / 2, hs, hs, 4, null, '#FFD0B0', 2); X.restore(); circ(x, y, u * .14, m.c, '#fff', 1.5); tx('heme da hemoglobina', x, y + u * 1.25, { s: 12, c: C.dim }); }
    else if (i === 2) { const mw = u * 2.6; rr(x - mw / 2, y - u * .22, mw, u * .44, 4, rgba(C.memb, .3)); rr(x - u * .3, y - u * .4, u * .6, u * .8, 8, '#B98CFF', 'rgba(11,15,28,.5)', 1.5); for (let k = 0; k < 3; k++) { const f = fr(t * .4 + k / 3); circ(x - u * .12, lerp(y + u * .9, y - u * .9, f), 6, C_NA); } for (let k = 0; k < 2; k++) { const f = fr(t * .4 + k / 2 + .2); circ(x + u * .12, lerp(y - u * .9, y + u * .9, f), 7, '#C79BFF'); } tx('fora', x + mw / 2 - 4, y - u * .6, { a: 'right', s: 12, c: C.dim }); tx('dentro', x + mw / 2 - 4, y + u * .62, { a: 'right', s: 12, c: C.dim }); tx('3 Na⁺ saem, 2 K⁺ entram', x, y + u * 1.25, { s: 12, c: C.dim }); }
    else if (i === 3) { line(x - u * 1.4, y, x + u * .6, y, 'rgba(232,237,247,.6)', 2); ngon(x - u * 1.5, y, u * .32, 5, -PI / 2, rgba(C.creme, .3), C.creme, 2); for (let k = 0; k < 3; k++) circ(x - u * .7 + k * u * .62, y, u * .26, C.p, 'rgba(11,15,28,.5)', 1.5), tx('P', x - u * .7 + k * u * .62, y + .5, { s: 12, w: 700, c: '#0B0F1C', bg: false }); tx('ATP: três fosfatos', x - u * .3, y + u * .75, { s: 12, c: C.dim }); }
    else if (i === 4) { const r = u * .8; X.save(); X.translate(x, y); X.rotate(PI / 4); rr(-r, -r, r * 2, r * 2, r * .5, 'rgba(63,191,106,.25)', C.cloro, 2.5); X.restore(); for (let k = 0; k < 4; k++) { const a = k / 4 * TAU; ngon(x + Math.cos(a) * r * .75, y + Math.sin(a) * r * .75, r * .26, 5, a, 'rgba(63,191,106,.4)', C.cloro, 1.5); line(x, y, x + Math.cos(a) * r * .5, y + Math.sin(a) * r * .5, 'rgba(232,237,247,.6)', 1.5); } circ(x, y, u * .2, m.c, '#fff', 1.5); tx('centro da clorofila', x, y + u * 1.25, { s: 12, c: C.dim }); }
    else if (i === 5) { const g = 1 + .08 * Math.sin(t * 1.5); for (const sx of [-1, 1]) ell(x + sx * u * .5 * g, y, u * .5 * g, u * .75 * g, sx * .3, '#C95C78', 'rgba(11,15,28,.5)', 1.5); rr(x - u * .25, y - u * .15, u * .5, u * .3, 6, '#C95C78'); tx('tireoide', x, y + u * 1.25, { s: 12, c: C.dim }); }
    else { X.save(); X.translate(x, y); X.beginPath(); for (let k = 0; k <= 40; k++) { const a = k / 40 * TAU, rr2 = u * (1 + .08 * Math.sin(a * 5)) * (Math.abs(Math.cos(a / 2)) < .2 ? .55 : 1); k ? X.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2 * .8) : X.moveTo(Math.cos(a) * rr2, Math.sin(a) * rr2 * .8); } X.closePath(); X.fillStyle = rgba(C.enz, .35); X.fill(); X.strokeStyle = C.enz; X.lineWidth = 2; X.stroke(); X.restore(); circ(x - u * .55, y, u * .16, m.c, '#fff', 1.5); tx('enzima com zinco no sítio ativo', x, y + u * 1.25, { s: 12, c: C.dim }); }
  }
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
      const A = area(), i = Math.round(S.v), m = MIN[i], u = NAR ? Math.min(A.w * .14, 42) : Math.min(A.h * .2, 80);
      const tw2 = NAR ? 64 : 92, tx0 = NAR ? A.x0 + 6 : A.x0 + 10, ty0 = A.y0 + (NAR ? 2 : 10);
      rr(tx0, ty0, tw2, tw2, 8, m.c, 'rgba(255,255,255,.3)', 1.5); tx(m.s, tx0 + tw2 / 2, ty0 + tw2 * .45, { f: FH, s: m.s.length > 2 ? (NAR ? 18 : 24) : (NAR ? 26 : 36), w: 700, c: '#0B0F1C', bg: false }); tx(m.ion, tx0 + tw2 / 2, ty0 + tw2 * .8, { s: 12, w: 700, c: '#0B0F1C', bg: false });
      tx(m.n, tx0 + tw2 + 14, ty0 + 18, { a: 'left', f: FH, s: NAR ? 18 : 22, w: 600, c: C.txt });
      MIN.forEach((q, k) => circ(tx0 + tw2 + 18 + k * 16, ty0 + (NAR ? 44 : 48), 5, k === i ? q.c : 'rgba(91,108,153,.4)'));
      const ix = NAR ? A.x1 - u * 1.6 : A.x0 + A.w * .2, iy = NAR ? ty0 + tw2 / 2 + 6 : A.y0 + A.h * .58;
      minDraw(i, ix, iy, NAR ? u * .7 : u, t);
      const qx = NAR ? A.x0 + 6 : A.x0 + A.w * .42, qw = NAR ? A.w - 12 : A.w * .56; let y = NAR ? ty0 + tw2 + (NAR ? 40 : 24) : A.y0 + 20;
      for (const [h, s] of [['Função', m.f], ['Fontes', m.fo], ['Carência ou excesso', m.ca]]) { tx(h, qx, y, { a: 'left', s: 13, w: 700, c: m.c, bg: false }); y += 20; y += para(s, qx, y, qw, { s: NAR ? 13 : 15, lh: NAR ? 18 : 22 }) + (NAR ? 10 : 18); }
      { const c0 = m.ca.split('.')[0]; cap(m.n + ': ' + c0.charAt(0).toLowerCase() + c0.slice(1)); }
    }
  });
}

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
    const A = area(), c = S.v, vol = c < .05 ? 1.6 : cl(Math.pow(.9 / c, .55), .62, 1.6), burst = c < .4, R = rng(4), n = NAR ? 4 : 6, u = Math.min(A.w / (NAR ? 5 : 8), A.h / 4.4);
    rr(A.x0, A.y0, A.w, A.h, 14, rgba(C.sal, .05 + c * .05), C.line, 1);
    for (let i = 0; i < (NAR ? 18 : 40); i++) { const x = A.x0 + 10 + R() * (A.w - 20), y = A.y0 + 10 + R() * (A.h - 20); if (R() < c / 2) { circ(x, y, 3.5, C_NA); circ(x + 7, y + 2, 4.5, C_CL); } }
    for (let i = 0; i < n; i++) {
      const x = A.x0 + A.w * ((i % (NAR ? 2 : 3)) + .5) / (NAR ? 2 : 3), y = A.y0 + A.h * (Math.floor(i / (NAR ? 2 : 3)) + .5) / 2, w = u * .55 * (vol > 1 ? 1 + (vol - 1) * .35 : vol), h = u * .55 * (vol > 1 ? vol : .9 + (vol - .62) * .3);
      if (burst && c < .3) { X.save(); X.setLineDash([4, 5]); ell(x, y, w * 1.05, w * 1.05, 0, 'rgba(201,48,59,.12)', 'rgba(201,48,59,.6)', 1.5); X.restore(); for (let k = 0; k < 6; k++) { const a = k + i, f = fr(t * .3 + k / 6); circ(x + Math.cos(a) * w * (1 + f), y + Math.sin(a) * w * (1 + f), 2.5, rgba('#C9303B', 1 - f)); } continue; }
      if (vol < .9) { X.beginPath(); for (let k = 0; k <= 48; k++) { const a = k / 48 * TAU, rr2 = w * (1 + .14 * Math.sin(a * 9 + i)); k ? X.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2) : X.moveTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } X.closePath(); X.fillStyle = '#C9303B'; X.fill(); X.strokeStyle = 'rgba(11,15,28,.5)'; X.lineWidth = 1.5; X.stroke(); }
      else { ell(x, y, Math.max(w, h * (vol > 1.2 ? 1 : .95)), Math.max(w, h * (vol > 1.2 ? 1 : .95)), 0, '#C9303B', 'rgba(11,15,28,.5)', 1.5); if (vol < 1.2) ell(x, y, w * .45, w * .45, 0, '#A3252F'); }
      // setas de água
      const d = c < .85 ? 1 : c > .95 ? -1 : 0; if (d) for (let k = 0; k < 4; k++) { const a = k / 4 * TAU + .4, f = fr(t * .6 + k / 4), r1 = w * 1.9, r2 = w * 1.15, rA = d > 0 ? lerp(r1, r2, f) : lerp(r2, r1, f); circ(x + Math.cos(a) * rA, y + Math.sin(a) * rA, 4, rgba(C.aguaM, Math.sin(f * PI))); }
    }
    const tipo = c < .85 ? 'hipotônica' : c > .95 ? 'hipertônica' : 'isotônica';
    tok(A.x1 - (NAR ? 60 : 80), A.y0 + 16, 'solução ' + tipo, tipo === 'isotônica' ? C.vit : C.sal);
    cap(c < .3 ? 'Meio muito hipotônico: a água entra até a hemácia estourar (hemólise)' : c < .85 ? 'Meio hipotônico: a água entra e a hemácia incha' : c > .95 ? 'Meio hipertônico: a água sai e a hemácia murcha' : 'Meio isotônico (0,9% de NaCl): a água entra e sai na mesma taxa');
  }
});

// =====================================================================================
// CARBOIDRATOS
// =====================================================================================
{
  const DIS = [['sacarose', ['glicose', 6], ['frutose', 5], 'açúcar de mesa (cana, beterraba)'], ['lactose', ['glicose', 6], ['galactose', 6], 'açúcar do leite'], ['maltose', ['glicose', 6], ['glicose', 6], 'surge na digestão do amido']];
  def('carb', 'mono-di', {
    t: 'Monossacarídeos e dissacarídeos', s: 'ligação glicosídica e hidrólise', c: C.carb, loc: 'Moléculas de açúcar', still: 4.5,
    ctl: escolha('Dissacarídeo', DIS.map(d => d[0]), 10),
    alt: 'Dois monossacarídeos se unem, liberando uma molécula de água, e formam um dissacarídeo; depois a água volta e os separa',
    d: `<p><b>Carboidratos (glicídios ou açúcares) são a principal fonte de energia das células.</b> São formados por carbono, hidrogênio e oxigênio, em geral na proporção (CH₂O)ₙ.</p>
<p>Os <b>monossacarídeos</b> são os açúcares simples, que não se quebram em açúcares menores: <b>glicose</b> (o combustível das células), frutose (das frutas e do mel), galactose, e as pentoses <b>ribose</b> (do RNA) e <b>desoxirribose</b> (do DNA). A glicose, C₆H₁₂O₆, é feita na fotossíntese e quebrada na respiração.</p>
<p>Dois monossacarídeos se unem por uma <b>ligação glicosídica</b>, com a saída de uma molécula de água (<b>síntese por desidratação</b>), formando um <b>dissacarídeo</b>. Na digestão ocorre o contrário: a água entra e separa as unidades (<b>hidrólise</b>), com ajuda de enzimas como a sacarase e a lactase.</p>`,
    kv: [['Monossacarídeos', 'glicose, frutose, galactose, ribose, desoxirribose'], ['Sacarose', 'glicose + frutose'], ['Lactose', 'glicose + galactose'], ['Maltose', 'glicose + glicose'], ['Energia', 'cerca de 4 kcal por grama']],
    enem: 'A intolerância à lactose é tema recorrente: sem a enzima lactase, a lactose não é quebrada no intestino delgado, chega ao intestino grosso e é fermentada por bactérias, causando gases e diarreia. Também cai a montagem e a quebra de moléculas (desidratação × hidrólise) e o diabetes (glicose no sangue e insulina).',
    links: [['ATP e respiração (Bioenergética)', '../bioenergetica/index.html#resp/glicolise'], ['Enzimas', '#enz']],
    draw(t, S) {
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
  });
}
{
  const POL = ['amido', 'glicogênio', 'celulose', 'quitina'];
  const INFO = [
    ['reserva de energia das plantas', 'grãos, batata, mandioca', 'ligações α: digerível (amilase)'],
    ['reserva de energia dos animais e fungos', 'fígado e músculos', 'muito ramificado: libera glicose depressa'],
    ['parede celular das plantas', 'fibras dos vegetais', 'ligações β: não digerimos; vira fibra alimentar'],
    ['exoesqueleto dos artrópodes e parede dos fungos', 'carapaça de insetos e crustáceos', 'glicose com nitrogênio (N-acetilglicosamina)']
  ];
  def('carb', 'polissacarideos', {
    t: 'Polissacarídeos', s: 'amido, glicogênio, celulose e quitina', c: C.carb, loc: 'Cadeias de monossacarídeos', still: 0,
    ctl: escolha('Polissacarídeo', POL, 7),
    alt: 'Cadeias de anéis de glicose: o amido em hélice com poucas ramificações, o glicogênio muito ramificado, a celulose em cadeias retas paralelas e a quitina com nitrogênio',
    d: `<p><b>Polissacarídeos são cadeias de centenas a milhares de monossacarídeos.</b> Quase todos os importantes são feitos só de glicose; o que muda é o tipo de ligação e o formato da cadeia, e isso muda a função.</p>
<p><b>Amido</b> e <b>glicogênio</b> são reservas de energia. O amido, das plantas, tem ligações do tipo α e forma hélices com poucas ramificações. O glicogênio, dos animais, fica no fígado e nos músculos e é muito ramificado: tem muitas pontas de onde a glicose pode ser solta ao mesmo tempo.</p>
<p>A <b>celulose</b> tem ligações do tipo β, que deixam a cadeia reta. As cadeias se alinham lado a lado, unidas por ligações de hidrogênio, e formam fibras resistentes: é a parede celular das plantas. Nós não temos enzima para quebrar a ligação β; a celulose passa pelo intestino como <b>fibra alimentar</b>. Ruminantes e cupins a digerem graças a microrganismos que vivem no seu tubo digestório. A <b>quitina</b>, um polissacarídeo com nitrogênio, forma o exoesqueleto dos artrópodes e a parede dos fungos.</p>`,
    kv: [['Amido', 'reserva vegetal; ligações α'], ['Glicogênio', 'reserva animal; fígado e músculos'], ['Celulose', 'parede celular; ligações β; fibra'], ['Quitina', 'exoesqueleto de artrópodes; parede de fungos']],
    enem: 'O contraste mais cobrado é amido × celulose: os dois são feitos de glicose, mas só o amido é digerido por nós, porque temos amilase para a ligação α e não temos enzima para a ligação β. Ruminantes digerem celulose com a ajuda de microrganismos (mutualismo). Teste do iodo: o amido fica azul-escuro.',
    links: [['Parede celular (Célula)', '../celula/index.html'], ['Mono e dissacarídeos', '#carb/mono-di']],
    draw(t, S) {
      const A = area(), i = Math.round(S.v), r = NAR ? 7 : 10, sp = r * 1.9, k = .5 + .5 * Math.sin(t * 2), u = (x, y, n) => { anel(x, y, r, 6, C.carb); if (n) circ(x + r * .6, y - r * .6, 4, C.n, '#0B0F1C', 1); };
      const D = NAR ? { x0: A.x0, y0: A.y0 + 4, w: A.w, h: A.h * .6 } : { x0: A.x0, y0: A.y0, w: A.w * .6, h: A.h }, cx = D.x0 + D.w / 2, cy = D.y0 + D.h / 2;
      rr(D.x0, D.y0, D.w, D.h, 14, 'rgba(242,193,78,.06)', C.line, 1);
      if (i === 0) { const n = Math.floor(D.w / sp) - 2; for (let j = 0; j < n; j++) { const x = D.x0 + sp * 1.2 + j * sp, y = cy + Math.sin(j * .7 + t * .3) * D.h * .18; u(x, y); if (j % 9 === 4) for (let b = 1; b < 4; b++) u(x + b * sp * .5, y - b * sp * .9 * Math.sign(Math.sin(j)) - (Math.sin(j) === 0 ? b * sp * .9 : 0)); } tx('amilose em hélice (vista de lado) e poucas ramificações', cx, D.y0 + D.h - 14, { s: 12, c: C.dim }); }
      else if (i === 1) { const tree = (x, y, a, d) => { if (d > (NAR ? 3 : 4)) return; let px = x, py = y; for (let s2 = 0; s2 < 3; s2++) { px += Math.cos(a) * sp; py += Math.sin(a) * sp; u(px, py); } tree(px, py, a - .5, d + 1); tree(px, py, a + .5, d + 1); }; u(cx, cy); for (let b = 0; b < 4; b++) tree(cx, cy, b / 4 * TAU + .4 + t * .05, 1); circ(cx, cy, r * 1.2, null, '#fff', 2); tx('muitas pontas: a glicose sai depressa', cx, D.y0 + D.h - 14, { s: 12, c: C.dim }); }
      else { const rows = NAR ? 4 : 5, n = Math.floor(D.w / sp) - 2; for (let rw = 0; rw < rows; rw++) { const y = cy + (rw - (rows - 1) / 2) * r * 3.4; for (let j = 0; j < n; j++) u(D.x0 + sp * 1.2 + j * sp + (rw % 2) * sp * .5, y, i === 3); if (rw < rows - 1) for (let j = 1; j < n; j += 2) line(D.x0 + sp * 1.2 + j * sp + (rw % 2) * sp * .5, y + r, D.x0 + sp * 1.2 + j * sp + (rw % 2) * sp * .5 + sp * .25, y + r * 2.4, rgba(C.focus, .4 + .3 * k), 1.5, [2, 3]); }
        tx(i === 2 ? 'cadeias retas lado a lado: fibras resistentes' : 'cadeias retas com nitrogênio (N azul)', cx, D.y0 + D.h - 14, { s: 12, c: C.dim }); if (LB) lab(D.x0 + sp * 2.2, cy + r * 1.7 + (rows % 2 ? 0 : -r * 1.7), D.x0 + sp * 4, D.y0 + 24, 'ligações de hidrogênio entre cadeias'); }
      const qx = NAR ? A.x0 + 6 : A.x0 + A.w * .64, qw = NAR ? A.w - 12 : A.w * .34; let y = NAR ? D.y0 + D.h + 22 : A.y0 + 30;
      tx(POL[i], qx, y, { a: 'left', f: FH, s: NAR ? 18 : 24, w: 700, c: C.carb, bg: false }); y += NAR ? 26 : 36;
      for (const [h, s] of [['função', INFO[i][0]], ['onde', INFO[i][1]], ['detalhe', INFO[i][2]]]) { tx(h, qx, y, { a: 'left', s: 12, w: 700, c: C.dim, bg: false }); y += 18; y += para(s, qx, y, qw, { s: NAR ? 13 : 15, lh: NAR ? 18 : 21 }) + (NAR ? 4 : 12); }
      cap(['Amido: reserva das plantas, digerível pela amilase', 'Glicogênio: reserva animal, muito ramificado', 'Celulose: glicose em cadeias retas (ligação β), que não digerimos', 'Quitina: polissacarídeo com nitrogênio do exoesqueleto e dos fungos'][i]);
    }
  });
}
