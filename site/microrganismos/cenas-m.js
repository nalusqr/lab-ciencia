/* LAB, módulo Microrganismos e fungos. Cenas: Monera (M1 a célula bacteriana, M2 divisão, troca de genes e resistência, M3 doenças).
   Código da equipe (Aurelius). Textos: roteiro do Taxon revisado pelo Sapien (docs/revisao-biologia/seres-vivos-roteiro.md).
   Sem idades nem doses de vacinas: o calendário muda e a tela aponta para o calendário vigente. */
'use strict';
{
  const MON = C.monera, OLV = C.parede, PLA = C.plasmideo, GPOS = '#9B6FD6', GNEG = '#E58FB5', AM = C.amber;

  // silhuetas de bactérias por forma (caixa de lado s, centrada em cx, cy)
  function sil(id, cx, cy, s, c, a = 1) {
    X.save(); X.globalAlpha *= a; X.lineWidth = 1.8; X.strokeStyle = c; X.fillStyle = rgba(c, .3); X.lineJoin = X.lineCap = 'round';
    const r = s * .19, cir = (x, y, q) => { X.beginPath(); X.arc(cx + x, cy + y, q, 0, TAU); X.fill(); X.stroke(); };
    if (id === 'coco') cir(0, 0, s * .25);
    else if (id === 'diplo') { cir(-r * .95, 0, r); cir(r * .95, 0, r); }
    else if (id === 'estrepto') for (let i = 0; i < 4; i++) cir((i - 1.5) * r * 1.65, Math.sin(i * 1.3) * r * .45, r * .82);
    else if (id === 'estafilo') [[-1, -.5], [.15, -1.05], [1.1, -.3], [-.5, .75], [.7, .85]].forEach(p => cir(p[0] * r * .95, p[1] * r * .95, r * .8));
    else if (id === 'bacilo') { X.beginPath(); X.roundRect(cx - s * .36, cy - s * .12, s * .72, s * .24, s * .12); X.fill(); X.stroke(); }
    else if (id === 'espirilo' || id === 'espiroqueta') {
      const ro = id === 'espirilo'; X.beginPath();
      for (let i = 0; i <= 40; i++) { const u = i / 40 - .5, x = cx + u * s * .86, y = cy + Math.sin(u * TAU * (ro ? 2.1 : 5)) * s * (ro ? .15 : .085); i ? X.lineTo(x, y) : X.moveTo(x, y); }
      X.lineWidth = ro ? 5 : 2.4; X.stroke();
    } else if (id === 'vibriao') { X.beginPath(); X.arc(cx, cy - s * .2, s * .36, .22 * PI, .78 * PI); X.lineWidth = s * .17; X.stroke(); }
    X.restore();
  }
  // fileira de botões pequenos na base da área (escolha de uma parte)
  function chips(A, nomes, sel, pre, c) {
    const cols = 4, g = 6, n = nomes.length, rows = Math.ceil(n / cols), h = 34, cw = (A.w - (cols - 1) * g) / cols, y0 = A.y1 + 4 - rows * (h + 4) + 4;
    nomes.forEach((nm, i) => btn(A.x0 + (i % cols) * (cw + g), y0 + Math.floor(i / cols) * (h + 4), cw, h, nm, c, pre + i, { on: sel === i, s: NAR ? 12 : 13 }));
    return y0;
  }

  // =====================================================================================
  // M1 A CÉLULA BACTERIANA: estrutura, Gram, formas e arranjos, como se alimenta
  // =====================================================================================
  const PARTES = [
    ['cápsula', 'Cápsula: camada de açúcares por fora da parede, que protege a bactéria das defesas do corpo.'],
    ['parede celular', 'Parede celular de peptidoglicano: dá forma à célula e impede que ela estoure ao absorver água.'],
    ['membrana plasmática', 'Membrana plasmática: controla o que entra e o que sai da célula.'],
    ['nucleoide', 'Nucleoide: região do citoplasma com o cromossomo, uma molécula de DNA circular, sem membrana em volta.'],
    ['plasmídeo', 'Plasmídeo: pequeno círculo extra de DNA, que pode carregar genes úteis, como os de resistência a antibióticos.'],
    ['ribossomos', 'Ribossomos 70S, menores que os nossos. Não há mitocôndria, cloroplasto nem retículo: nenhuma organela com membrana.'],
    ['fímbrias', 'Fímbrias: filamentos curtos que prendem a bactéria a superfícies.'],
    ['flagelo', 'Flagelo: filamento longo que gira e faz a bactéria nadar.']
  ];
  function drawCel(t, S, A) {
    const bw = Math.min(A.w * (NAR ? .64 : .58), 470), bh = bw * (NAR ? .46 : .36), cx = A.x0 + (A.w - bw * 1.42) / 2 + bw / 2, cy = A.y0 + (A.h - 84) / 2 + (NAR ? 18 : 10);
    const idx = S.sel != null ? S.sel : (((Math.floor(t / 3.2) || 0) % 8) + 8) % 8, pad = bh * .16;
    const fimb = (c, lw) => { for (let i = 0; i <= 6; i++) { const x = cx - bw * .4 + i * bw * .8 / 6, d = bh * (.2 + .05 * Math.sin(i * 2.1)), w = Math.sin(t * 2 + i) * 2; line(x, cy - bh / 2, x + w, cy - bh / 2 - d, c, lw); line(x, cy + bh / 2, x + w, cy + bh / 2 + d, c, lw); } };
    const flag = (c, lw) => { X.beginPath(); for (let i = 0; i <= 40; i++) { const u = i / 40, x = cx + bw / 2 + u * bw * .4, y = cy + Math.sin(u * 9 - t * 5) * bh * .15 * u; i ? X.lineTo(x, y) : X.moveTo(x, y); } X.strokeStyle = c; X.lineWidth = lw; X.stroke(); };
    rr(cx - bw / 2 - pad, cy - bh / 2 - pad, bw + 2 * pad, bh + 2 * pad, bh / 2 + pad, 'rgba(217,200,160,.1)', 'rgba(217,200,160,.6)', 1.5);
    fimb(C.dim, 1.5); flag(C.dim, 2.4);
    bacteriaCorte(cx, cy, bw, bh, { ribo: 18 });
    const p1 = [cx + bw * .37, cy - bh * .12, bh * .075], p2 = [cx - bw * .4, cy + bh * .16, bh * .06];
    circ(p1[0], p1[1], p1[2], null, PLA, 2.5); circ(p2[0], p2[1], p2[2], null, PLA, 2.5);
    // realce da parte ativa
    X.save(); X.setLineDash([6, 4]);
    if (idx === 0) rr(cx - bw / 2 - pad, cy - bh / 2 - pad, bw + 2 * pad, bh + 2 * pad, bh / 2 + pad, null, AM, 2.5);
    if (idx === 1) rr(cx - bw / 2 - 2, cy - bh / 2 - 2, bw + 4, bh + 4, bh / 2 + 2, null, AM, 3);
    if (idx === 2) rr(cx - bw / 2 + 4, cy - bh / 2 + 4, bw - 8, bh - 8, bh / 2 - 4, null, AM, 3);
    if (idx === 3) ell(cx, cy, bw * .31, bh * .36, 0, null, AM, 2.5);
    if (idx === 4) { circ(p1[0], p1[1], p1[2] + 6, null, AM, 2.5); circ(p2[0], p2[1], p2[2] + 6, null, AM, 2.5); }
    if (idx === 5) { const R = rng(5); X.setLineDash([]); for (let i = 0; i < 18; i++) circ(cx + (R() - .5) * (bw - bh * .7), cy + (R() - .5) * bh * .62, Math.max(3.5, bh * .055), null, AM, 1.6); }
    X.restore();
    if (idx === 6) fimb(AM, 2.6); if (idx === 7) flag(AM, 3.4);
    const anc = [[cx - bw * .2, cy - bh / 2 - pad, cx - bw * .2, cy - bh / 2 - 58], [cx + bw * .1, cy - bh / 2, cx + bw * .1, cy - bh / 2 - 58], [cx - bw * .1, cy + bh / 2 - 4, cx - bw * .1, cy + bh / 2 + 62],
      [cx + bw * .12, cy + bh * .1, cx + bw * .12, cy + bh / 2 + 62], [p1[0], p1[1], p1[0], cy - bh / 2 - 58], [cx - bw * .3, cy - bh * .1, cx - bw * .3, cy - bh / 2 - 58], [cx - bw * .4 + bw * .8 / 6, cy - bh / 2 - bh * .3, cx - bw * .4 + bw * .8 / 6, cy - bh / 2 - 58], [cx + bw / 2 + bw * .24, cy, cx + bw / 2 + bw * .22, cy - bh / 2 - 58]][idx];
    lab(anc[0], anc[1], anc[2], anc[3], PARTES[idx][0]);
    chips(A, PARTES.map(p => p[0]), S.sel, 'p', MON);
    cap(PARTES[idx][1]);
  }
  function drawGram(t, S, A) {
    const u = t % 13, pw = (A.w - 12) / 2, bx = [A.x0, A.x0 + pw + 12], y0 = A.y0 + (NAR ? 40 : 30);
    const a0 = ss(seg(u, 3.5, 5.5)), a1 = ss(seg(u, 7, 9));
    const gn = a1 > 0 ? mix(mix(GPOS, '#CFC9DA', a0), GNEG, a1) : mix(GPOS, '#CFC9DA', a0);
    const etapa = u < 3.5 ? '1. Cristal violeta: todas as bactérias ficam roxas.' : u < 7 ? '2. Álcool: a parede fina da Gram-negativa deixa o corante sair.' : '3. Corante rosa: só a Gram-negativa fica rosada.';
    [['Gram-positiva', GPOS, GPOS], ['Gram-negativa', GNEG, gn]].forEach(([nm, c, cell], k) => {
      const x = bx[k], gp = k === 0, mem = (yy, h) => { rr(x + 10, yy, pw - 20, h, 6, rgba(C.membrana, .3), rgba(C.membrana, .9), 1.4); };
      panel(x, y0 - 26, pw, Math.min(A.h - 10, 330), { s: rgba(c, .6) });
      title(nm, x + pw / 2, y0 - 8, pw - 12, { c, s: NAR ? 14 : 16 });
      sil('bacilo', x + pw / 2, y0 + 30, NAR ? 70 : 90, cell); tx(gp ? 'roxa' : (u > 7 ? 'rosada' : u > 3.5 ? 'sem cor' : 'roxa'), x + pw / 2, y0 + 62, { s: 12, c: C.dim });
      let y = y0 + 84; const bw2 = pw - 20;
      const band = (h, f, s2, txt, tc) => { rr(x + 10, y, bw2, h, 5, f, s2, 1.2); if (txt) tx(txt, x + pw / 2, y + h / 2, { s: 12, w: 600, c: tc || C.txt, bg: false }); y += h; };
      if (gp) { band(76, rgba(OLV, .5), OLV, 'peptidoglicano grosso'); for (let i = 1; i < 6; i++) line(x + 10, y - 76 + i * 12, x + 10 + bw2, y - 76 + i * 12, rgba(OLV, .6), 1, [3, 3]); band(22, rgba(C.membrana, .35), C.membrana, 'membrana plasmática'); }
      else { band(22, rgba(C.membrana, .35), C.membrana, 'membrana externa'); band(20, rgba(OLV, .5), OLV, 'peptidoglicano fino'); band(18, 'rgba(19,26,43,.9)', C.line, 'espaço'); band(22, rgba(C.membrana, .35), C.membrana, 'membrana plasmática'); }
      band(34, rgba(C.citoplasma, .8), C.line, 'citoplasma', C.dim);
      wrapTx(gp ? 'parede grossa: retém o corante e fica roxa' : 'parede fina e membrana externa, que dificulta a entrada de vários antibióticos', x + pw / 2, y + 22, pw - 24, { s: 12, w: 600, lh: 15, c: C.txt });
    });
    cap(etapa);
  }
  const FORMAS = [['bacilo', 'bacilo', 'Bacilo: bastão. Exemplos: <i>Escherichia coli</i> e <i>Mycobacterium tuberculosis</i>.'], ['estafilo', 'estafilococo', 'Estafilococo: cocos em cachos. <i>Staphylococcus</i>, comum na pele.'], ['vibriao', 'vibrião', 'Vibrião: forma de vírgula. <i>Vibrio cholerae</i>, causador da cólera.'],
    ['diplo', 'diplococo', 'Diplococo: cocos em pares.'], ['espiroqueta', 'espiroqueta', 'Espiroqueta: espiral flexível. <i>Treponema pallidum</i>, causador da sífilis.'], ['coco', 'coco', 'Coco: esfera. Os cocos podem ficar em pares, fileiras ou cachos.'],
    ['estrepto', 'estreptococo', 'Estreptococo: cocos em fileira. <i>Streptococcus</i>, que pode infectar a garganta.'], ['espirilo', 'espirilo', 'Espirilo: espiral rígida.']];
  const ORD = ['coco', 'diplo', 'estrepto', 'estafilo', 'bacilo', 'espirilo', 'espiroqueta', 'vibriao'];
  const BF = baralho({
    nome: 'bf', dica: 'Toque numa silhueta e depois no nome da forma (no mouse, também dá para arrastar).',
    cartas: FORMAS.map(f => ({ t: f[1], k: ORD.indexOf(f[0]), ic: (x, y, w, h, on) => sil(f[0], x, y, Math.min(w * (on ? .8 : .7), h * (on ? .95 : .9) * 1.15), MON) })),
    alvos: ORD.map(i => ({ t: FORMAS.find(f => f[0] === i)[1], c: MON })),
    certo: c => FORMAS[c.i][2], errado: (c, al) => `Não é ${al.t}. Compare a forma e o arranjo das células.`,
    fim: () => 'Todas as formas no lugar. Pela forma: cocos, bacilos, espirilos, espiroquetas e vibriões.'
  });
  function drawFormas(S, A) {
    const cols = NAR ? 4 : 8, ch = NAR ? 52 : 60, g = NAR ? 6 : 8, rows = Math.ceil(8 / cols);
    BF.draw(S, { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y1 }, { cols, cartaH: ch, slotH: 70, alvoRect: (k, n, bx) => {
      const ay0 = bx.y0 + rows * (ch + g) + 4, c2 = 4, rw = (A.w - (c2 - 1) * 8) / c2, rh = (bx.y1 - ay0 - 8) / 2;
      return { x: A.x0 + (k % c2) * (rw + 8), y: ay0 + Math.floor(k / c2) * (rh + 8), w: rw, h: rh };
    } });
    cap(BF.msg(S) || 'Arraste cada silhueta até o nome da forma.');
  }
  const NUT = [['decompositora', '#C08A5A', 'Decompositoras comem restos de seres mortos, como folhas caídas, e devolvem os nutrientes ao solo: reciclam a matéria.'],
    ['parasita', C.sangue, 'Parasitas vivem às custas de outro ser e podem causar doenças, como a tuberculose, que ataca os pulmões.'],
    ['fotossintetizante', '#F7C13B', 'Fotossintetizantes, como as cianobactérias, têm clorofila <i>a</i>, fazem fotossíntese e liberam gás oxigênio.'],
    ['quimiossintetizante', '#9DA9C4', 'Quimiossintetizantes tiram energia de substâncias minerais, como as nitrificantes, que usam amônia no ciclo do nitrogênio.']];
  function icone(i, x, y, s, c, t) {
    if (i === 0) { X.save(); X.translate(x, y); X.rotate(-.6); ell(0, 0, s * .42, s * .22, 0, rgba(c, .3), c, 2); line(-s * .42, 0, s * .42, 0, c, 1.5); for (let k = -2; k <= 2; k++) { line(k * s * .1, 0, k * s * .1 + s * .07, -s * .15, c, 1); line(k * s * .1, 0, k * s * .1 + s * .07, s * .15, c, 1); } X.restore(); }
    else if (i === 1) { ell(x - s * .2, y + s * .05, s * .17, s * .3, .15, rgba(c, .3), c, 2); ell(x + s * .2, y + s * .05, s * .17, s * .3, -.15, rgba(c, .3), c, 2); line(x, y - s * .38, x, y - s * .05, c, 2.5); line(x, y - s * .05, x - s * .15, y + s * .02, c, 2); line(x, y - s * .05, x + s * .15, y + s * .02, c, 2); }
    else if (i === 2) { circ(x, y, s * .2, rgba(c, .5), c, 2); for (let k = 0; k < 8; k++) { const a = k / 8 * TAU + t * .4; line(x + Math.cos(a) * s * .28, y + Math.sin(a) * s * .28, x + Math.cos(a) * s * .42, y + Math.sin(a) * s * .42, c, 2.2); } }
    else { shape([[x - s * .4, y + s * .3], [x - s * .3, y - s * .1], [x - s * .05, y - s * .3], [x + s * .25, y - s * .2], [x + s * .42, y + s * .3]], rgba(c, .3), c, 2); tx('amônia', x + s * .02, y + s * .04, { s: 12, c: C.txt, w: 600 }); }
  }
  function drawNut(t, S, A) {
    const cols = NAR ? 2 : 4, g = 10, cw = (A.w - (cols - 1) * g) / cols, ch = Math.min(NAR ? (A.h - g) / 2 - 6 : A.h * .62, 210);
    NUT.forEach((n, i) => {
      const x = A.x0 + (i % cols) * (cw + g), y = A.y0 + 6 + Math.floor(i / cols) * (ch + g), on = S.nut === i;
      rr(x, y, cw, ch, 12, rgba(n[1], on ? .2 : .08), on ? AM : rgba(n[1], .6), on ? 2.5 : 1.4); hitR(x, y, cw, ch, 'n' + i);
      icone(i, x + cw / 2, y + ch * .4, Math.min(cw * .8, ch * .6), n[1], t);
      title(n[0], x + cw / 2, y + ch - 20, cw - 12, { c: n[1], s: NAR ? 13 : 15 });
    });
    cap(S.nut != null ? NUT[S.nut][2] : 'Toque num cartão para ver como cada grupo de bactérias se alimenta.');
  }
  def('monera', 'celula', {
    t: 'A célula bacteriana', s: 'pequena, sem núcleo e presente em todo lugar', c: MON,
    loc: S => ({ cel: 'Bactéria em corte', gram: 'Parede: Gram-positiva e Gram-negativa', formas: 'Formas e arranjos', nut: 'Como se alimenta?' })[S.modo] || 'Bactéria em corte',
    locNota: 'Desenho esquemático, fora de escala', still: 3, ctlVis: S => S.modo === 'cel' || S.modo === 'gram',
    alt: 'bactéria em corte com cápsula, parede, membrana, nucleoide, plasmídeos, ribossomos, fímbrias e flagelo; comparação das paredes Gram-positiva e Gram-negativa; oito silhuetas de formas de bactérias para ligar aos nomes; quatro modos de nutrição',
    extra: [modo('cel', 'Estrutura'), modo('gram', 'Gram'), modo('formas', 'Formas e arranjos'), modo('nut', 'Como se alimenta?')],
    init(S) { S.modo = 'cel'; S.sel = null; S.nut = null; BF.zera(S); },
    d: "<p>As bactérias são <b>procariontes</b>: o DNA fica solto no citoplasma, numa região chamada <b>nucleoide</b>, sem membrana em volta. Quase todas medem de <b>1 a 5 micrômetros</b>, cerca de dez vezes menos que uma célula humana. O <b>cromossomo</b> é uma molécula de DNA <b>circular</b>; muitas têm também <b>plasmídeos</b>, pequenos círculos de DNA extras, que podem carregar genes úteis, como os de resistência a antibióticos (ver <a href=\"#monera/reproducao\">Divisão, troca de genes e resistência</a>). No citoplasma há <b>ribossomos</b> menores que os nossos (<b>70S</b>), mas nenhuma organela com membrana: nada de mitocôndria, cloroplasto ou retículo. Em volta da membrana plasmática fica a <b>parede celular</b>, feita de <b>peptidoglicano</b>, que dá forma à célula e impede que ela estoure ao absorver água. Muitas têm por fora uma <b>cápsula</b> de açúcares, que as protege das defesas do corpo, <b>fímbrias</b> para se prender a superfícies e <b>flagelos</b> para nadar.</p>\n<p>Em <b>1884</b>, o dinamarquês <b>Hans Christian Gram</b> criou um jeito de corar bactérias que ainda é usado nos hospitais. As <b>Gram-positivas</b> ficam roxas: têm parede grossa de peptidoglicano. As <b>Gram-negativas</b> ficam rosadas: têm parede fina e, por fora dela, uma <b>membrana externa</b>, que dificulta a entrada de vários antibióticos. Pela forma, as bactérias são <b>cocos</b> (esferas), <b>bacilos</b> (bastões), <b>espirilos</b> (espirais rígidas), <b>espiroquetas</b> (espirais flexíveis) e <b>vibriões</b> (vírgulas). Os cocos podem ficar em pares (<b>diplococos</b>), em fileiras (<b>estreptococos</b>) ou em cachos (<b>estafilococos</b>).</p>\n<p>As bactérias vivem em <b>todos os ambientes</b>: solo, água, ar, gelo, fontes quentes e dentro de outros seres. Há bactérias <b>heterótrofas</b>, que comem matéria orgânica: as <b>decompositoras</b>, que reciclam os restos de seres mortos; as <b>parasitas</b>, que causam doenças; e as <b>mutualísticas</b>, como as do nosso intestino, que ajudam na digestão e produzem vitamina K. Há bactérias <b>autótrofas</b>: as <b>fotossintetizantes</b>, como as <b>cianobactérias</b>, que têm clorofila <i>a</i> e liberam gás oxigênio, e as <b>quimiossintetizantes</b>, que tiram energia de substâncias minerais, como as <b>nitrificantes</b> do ciclo do nitrogênio. Pela relação com o oxigênio, há <b>aeróbias</b> (precisam dele), <b>anaeróbias obrigatórias</b> (o oxigênio as mata, como o bacilo do tétano) e <b>facultativas</b> (vivem com ou sem, como a <i>Escherichia coli</i>). As <b>cianobactérias</b> merecem destaque: há cerca de 2,4 bilhões de anos, foram elas que encheram a atmosfera de oxigênio, e algumas, com células especiais chamadas <b>heterocistos</b>, fixam o nitrogênio do ar. Em lagos e represas com excesso de nutrientes, podem se multiplicar demais (<b>floração</b>) e liberar toxinas que atacam o fígado. As <b>arqueas</b>, o outro grupo de procariontes, têm a mesma aparência, mas outra química.</p>\n", enem: "Saiba o que a célula bacteriana <b>tem</b> (parede de peptidoglicano, membrana, ribossomos 70S, DNA circular, plasmídeos) e o que <b>não tem</b> (núcleo e organelas com membrana). Muitas questões cobram o <b>papel ecológico</b>: bactérias <b>decompositoras</b> reciclam a matéria, bactérias do solo e das raízes <b>fixam nitrogênio</b>, e <b>cianobactérias</b> fazem fotossíntese mas são Monera, não plantas nem algas. Floração de cianobactérias em represa aparece ligada à <b>eutrofização</b>.",
    links: [LK.celbact, LK.reinos, LK.dominios, LK.ecologia, LK.bioenergetica],
    tap(x, y, S) {
      if (S.modo === 'formas') { BF.tap(x, y, S); return; }
      if (!toque(S)) return; const h = hitAt(x, y); if (typeof h !== 'string') return;
      if (S.modo === 'cel' && h[0] === 'p') S.sel = S.sel === +h.slice(1) ? null : +h.slice(1);
      if (S.modo === 'nut' && h[0] === 'n') S.nut = S.nut === +h.slice(1) ? null : +h.slice(1);
    },
    grab(x, y, S) { return S.modo === 'formas' && BF.grab(x, y, S); }, grabMove: BF.grabMove, grabEnd: BF.grabEnd,
    draw(t, S) { const A = area(); if (S.modo === 'gram') drawGram(t, S, A); else if (S.modo === 'formas') drawFormas(S, A); else if (S.modo === 'nut') drawNut(t, S, A); else drawCel(t, S, A); }
  });

  // =====================================================================================
  // M2 DIVISÃO, TROCA DE GENES E RESISTÊNCIA
  // =====================================================================================
  const along = (pts, f) => { const L = []; let tot = 0; for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); L.push(l); tot += l; } let d = cl(f, 0, 1) * tot, i = 0; while (i < L.length - 1 && d > L[i]) { d -= L[i]; i++; } const k = L[i] ? d / L[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; };
  function drawDiv(t, S, A) {
    const T = 9, gg = Math.floor(t / T) % 6, u = (t % T) / T, w0 = NAR ? A.w * .4 : Math.min(A.w * .26, 220), h0 = w0 * .36, cx = A.cx, cy = A.y0 + h0 / 2 + 20;
    const p1 = ss(seg(u, 0, .22)), p2 = ss(seg(u, .2, .58)), p3 = ss(seg(u, .55, .82)), p4 = ss(seg(u, .84, 1)), L = w0 * (1 + .9 * p2), d = L * .2 * p2 + p4 * 8;
    if (p4 < .02) {
      rr(cx - L / 2, cy - h0 / 2, L, h0, h0 / 2, rgba(C.citoplasma, .9), OLV, Math.max(2.5, h0 * .06));
      if (p3 > 0) { line(cx, cy - h0 / 2 + 2, cx, cy - h0 / 2 + 2 + p3 * h0 / 2, OLV, 3); line(cx, cy + h0 / 2 - 2, cx, cy + h0 / 2 - 2 - p3 * h0 / 2, OLV, 3); }
    } else for (const s of [-1, 1]) { const dw = L / 2 - 2 - p4 * 6; rr(cx + s * (L / 4 + p4 * 14) - dw / 2, cy - h0 / 2, dw, h0, h0 / 2, rgba(C.citoplasma, .9), OLV, Math.max(2.5, h0 * .06)); }
    const sep = p4 * 14;
    cromCirc(cx - d - (p4 > 0 ? sep * .5 : 0), cy, h0 * .3, h0 * .3, { seed: 21 });
    cromCirc(cx + d + (p4 > 0 ? sep * .5 : 0), cy, h0 * .3, h0 * .3, { seed: 21, a: p1 });
    const y1 = cy + h0 / 2 + 34, cr = NAR ? 15 : 18, kx = A.cx - (NAR ? 100 : 130);
    circ(kx, y1, cr, 'rgba(19,26,43,.9)', C.line, 2); line(kx, y1, kx + Math.sin(u * TAU) * cr * .8, y1 - Math.cos(u * TAU) * cr * .8, AM, 2.5); circ(kx, y1, 2, AM);
    mtx('cada divisão: cerca de 20 min', kx + cr + 12, y1, { a: 'left', s: NAR ? 13 : 15, w: 600 });
    const n = 2 ** gg, cols = NAR ? 8 : 16, r = Math.min(7, A.w / cols / 2.7), y2 = y1 + 36, sx = (r * 2.8) * Math.min(cols, n);
    for (let i = 0; i < n; i++) { const x = A.cx - sx / 2 + r * 1.4 + (i % cols) * r * 2.8, y = y2 + Math.floor(i / cols) * r * 2.8; circ(x, y, r, rgba(OLV, .5), OLV, 1.4); }
    const y3 = y2 + Math.ceil(n / cols) * r * 2.8 + 14;
    mtx(gg ? `Depois de cerca de ${nbr(gg * 20)} min: ${n} bactérias` : 'No começo: 1 bactéria', A.cx, y3, { s: NAR ? 14 : 16, w: 600, f: FH });
    wrapTx('Em 10 horas, com 30 divisões seguidas, seriam mais de 1 bilhão. Na prática, a comida e o espaço acabam, e o crescimento para.', A.cx, y3 + 28, Math.min(A.w - 20, 560), { s: NAR ? 12 : 14, lh: NAR ? 16 : 19, c: C.dim });
    cap(u < .22 ? '1. A bactéria copia o cromossomo circular.' : u < .58 ? '2. A célula cresce e as duas cópias vão para lados opostos.' : u < .84 ? '3. A parede cresce no meio e divide a célula.' : '4. Duas células iguais: é a divisão binária, reprodução assexuada.');
  }
  const TROC = ['Transformação', 'Conjugação', 'Transdução'];
  function drawTroca(t, S, A) {
    const q = S.q != null ? S.q : Math.floor(t / 11) % 3, u = (t % 11) / 11, gw = 6, tw2 = (A.w - 2 * gw) / 3;
    TROC.forEach((n, i) => btn(A.x0 + i * (tw2 + gw), A.y0, tw2, 36, n, MON, 'q' + i, { on: q === i, s: NAR ? 12 : 14 }));
    const bw = Math.min(A.w * (NAR ? .4 : .26), 200), bh = bw * .4, cy = (A.y0 + 44 + A.y1) / 2 - 6, xl = A.x0 + A.w * (NAR ? .24 : .2), xr = A.x0 + A.w * (NAR ? .76 : .78);
    const nome = (s, x, y) => tx(s, x, y, { s: 12, c: C.dim });
    if (q === 0) {
      bacteriaCorte(xl, cy, bw, bh, { lise: 1, crom: false, ribo: 0 }); nome('bactéria morta', xl, cy + bh / 2 + 28);
      const ins = ss(seg(u, .62, .92));
      bacteriaCorte(xr, cy, bw, bh, { ins: { f: .3, len: .1, c: C.dnaClaro, k: ins } }); nome('bactéria receptora', xr, cy + bh / 2 + 28);
      for (let i = 0; i < 4; i++) {
        const f = ss(seg(u, .08 + i * .06, .55 + i * .03)), sx = xl + (i - 1.5) * 14, sy = cy + (i % 2 ? -1 : 1) * bh * .5 - (i % 2 ? 6 : -6) * 0, tx0 = xr - bw / 2 - 16, ty0 = cy + (i - 1.5) * 8;
        const x = lerp(sx, tx0, f), y = lerp(sy, ty0, f) + Math.sin(t * 2 + i) * 3 * (1 - f); let a = 1; if (i === 0) a = 1 - ss(seg(u, .55, .66)); else a = 1 - ss(seg(u, .55, .7)) * (i === 1 ? .6 : .6);
        fita([[x - 10, y], [x + 10, y]], { tipo: 'dna', c: C.dnaClaro, amp: 2.2, ond: 8, lw: 1.3, a: i === 0 ? a : (u > .58 ? .5 : 1) });
      }
      cap(u < .08 ? 'Uma bactéria morreu e soltou pedaços de DNA no ambiente.' : u < .6 ? 'Outra bactéria absorve um pedaço de DNA solto no ambiente.' : 'O DNA novo se junta ao cromossomo: a bactéria ganha um gene novo. Griffith viu essa transformação em 1928, com pneumococos, antes de se saber que o agente era o DNA.');
    } else if (q === 1) {
      const pr = ss(seg(u, .05, .3)), m = ss(seg(u, .35, .75)), gain = ss(seg(u, .75, .92)), ex = xl + bw / 2, rx0 = xr - bw / 2;
      line(ex, cy, lerp(ex, rx0, pr), cy, C.dim, 4); if (pr > .95) circ(rx0, cy, 4, C.dim);
      bacteriaCorte(xl, cy, bw, bh, { ribo: 8 }); bacteriaCorte(xr, cy, bw, bh, { ribo: 8 });
      const pd = [xl + bw * .24, cy - bh * .14], pc = [xr + bw * .24, cy - bh * .14], pr2 = bh * .08;
      circ(pd[0], pd[1], pr2, null, PLA, 2.5);
      if (m > 0 && m < 1) { const p = along([pd, [ex, cy], [rx0, cy], pc], m); circ(p[0], p[1], pr2 * .85, null, PLA, 2.5); }
      if (gain > 0) { X.save(); X.globalAlpha *= gain; circ(pc[0], pc[1], pr2, null, PLA, 2.5); X.restore(); }
      nome('doadora', xl, cy + bh / 2 + 28); nome('receptora', xr, cy + bh / 2 + 28); if (pr > .5) nome('pilus', (ex + rx0) / 2, cy - 14);
      cap(u < .3 ? 'A doadora estica um tubo, o pilus, até a receptora.' : u < .75 ? 'Uma cópia do plasmídeo passa pelo pilus.' : 'Agora as duas têm o plasmídeo, e a receptora pode ganhar, por exemplo, um gene de resistência.');
    } else {
      const ls = ss(seg(u, .05, .22)), mv = ss(seg(u, .25, .55)), ct = ss(seg(u, .55, .7)), dn = 1 - ss(seg(u, .66, .8)), k = ss(seg(u, .76, .95)), s = bw * .62;
      bacteriaCorte(xl, cy, bw, bh, { lise: ls, ribo: 8, pic: ls * .6 }); nome('bactéria A', xl, cy + bh / 2 + 28);
      bacteriaCorte(xr, cy, bw, bh, { ribo: 8, ins: { f: .3, len: .1, c: C.dna, k } }); nome('bactéria B', xr, cy + bh / 2 + 28);
      const px = lerp(xl + bw * .15, xr - bw / 2 - s * .13, mv), py = cy + lerp(0, 0, mv) - (1 - mv) * bh * .0;
      if (u > .12) fago(px, py, s, { ang: PI, contrai: ct, dna: dn, dnaC: C.dna });
      if (u > .12 && u < .62) nome('fago com DNA da bactéria A', px + s * .1, cy - bh / 2 - 30);
      cap(u < .22 ? 'Um fago destrói a bactéria A e, por engano, leva um pedaço do DNA dela.' : u < .55 ? 'O fago procura a bactéria B.' : u < .8 ? 'O fago injeta na bactéria B o DNA que veio da A.' : 'O pedaço de DNA da A se junta ao cromossomo da B: é a transdução.');
    }
  }
  // Antibiótico na placa: bactérias sensíveis (verde-oliva) e resistentes (vermelhas); a rodada escolhida age como seleção
  const PLN = (() => { const out = [], s = .1, R = rng(9); for (let j = -11; j <= 11; j++) for (let i = -11; i <= 11; i++) { const x = (i + (j & 1) * .5) * s + (R() - .5) * .02, y = j * s * .866 + (R() - .5) * .02; if (x * x + y * y < .81) out.push([x, y]); } return out; })();
  const OPC = [['completo', 'Tratamento completo'], ['parar', 'Parar no meio'], ['gripe', 'Antibiótico para gripe']];
  const KILL = { completo: .985, parar: .9, gripe: .95 };
  const FIM = 'O antibiótico não ensinou as bactérias a resistir; ele eliminou as que não resistiam.';
  function novaPlaca(S) {
    const R = rng((Date.now() & 0xffffff) + (S.rod || 0) * 7919 + 1), n = PLN.length; S.st = new Int8Array(n).fill(1); S.fd = new Float32Array(n); S.gr = new Float32Array(n).fill(1);
    let k = 0; while (k < 3) { const i = Math.floor(R() * n); if (S.st[i] === 1) { S.st[i] = 2; k++; } }
    S.f2 = 'idle'; S.t2 = 0; S.die = null; S.cur = false; S.pls = null; S.rod = (S.rod || 0) + 1;
  }
  const fracRes = S => { let a = 0, r = 0; S.st.forEach(v => { if (v) { a++; if (v === 2) r++; } }); return a ? r / a * 100 : 0; };
  function zeraPlaca(S) { S.rod = 0; novaPlaca(S); S.hist = [{ f: fracRes(S), r: 'início' }]; S.msg = 'Cerca de 300 bactérias: quase todas sensíveis e umas poucas resistentes. Escolha o que o paciente faz.'; }
  function aplica(S, op) {
    if (S.f2 !== 'idle') return; if (S.cur) { novaPlaca(S); S.cur = false; }
    const R = rng(Date.now() & 0xffffff); S.opt = op; S.f2 = 'wave'; S.t2 = 0; S.die = Array.from(S.st, (v, i) => v === 1 && R() < KILL[op] ? (PLN[i][0] + .9) / 1.8 * 1.8 : -1);
    S.msg = 'O antibiótico entra como uma onda e atinge as bactérias.';
  }
  function plasmideo(S) {
    if (S.f2 !== 'idle' || S.pls || S.cur) return; const R = rng(Date.now() & 0xffffff); let best = null;
    for (let tries = 0; tries < 400 && !best; tries++) { const a = Math.floor(R() * PLN.length); if (S.st[a] !== 2) continue; for (let b = 0; b < PLN.length; b++) if (S.st[b] === 1 && Math.hypot(PLN[a][0] - PLN[b][0], PLN[a][1] - PLN[b][1]) < .13) { best = [a, b]; break; } }
    if (best) { S.pls = { a: best[0], b: best[1], t: 0 }; S.msg = 'Uma resistente passa o plasmídeo a uma vizinha sensível, que também fica resistente.'; } else S.msg = 'Sem vizinha sensível por perto: tente de novo.';
  }
  function passoPlaca(S, dt) {
    const n = PLN.length;
    for (let i = 0; i < n; i++) { if (S.fd[i] > 0) S.fd[i] = Math.max(0, S.fd[i] - dt * 2); if (S.gr[i] < 1) S.gr[i] = Math.min(1, S.gr[i] + dt * 3); }
    if (S.pls) { S.pls.t += dt; if (S.pls.t >= .9) { S.st[S.pls.b] = 2; S.gr[S.pls.b] = .3; S.pls = null; if (S.hist) S.hist[S.hist.length - 1].f = fracRes(S); } }
    if (S.f2 === 'wave') {
      S.t2 += dt; for (let i = 0; i < n; i++) if (S.die[i] >= 0 && S.st[i] === 1 && S.t2 >= S.die[i]) { S.st[i] = 0; S.fd[i] = 1; }
      if (S.t2 >= 2.3) { S.t2 = 0; if (S.opt === 'completo') S.f2 = 'clear'; else { S.f2 = 'regrow'; const alive = []; S.st.forEach((v, i) => { if (v) alive.push(v); }); const R = rng(Date.now() & 0xffffff); S.rg = Array.from(S.st, v => v ? -1 : R() * 1.8); S.rt = Array.from(S.st, () => alive.length ? alive[Math.floor(R() * alive.length)] : 1); } }
    } else if (S.f2 === 'clear') {
      S.t2 += dt; if (S.t2 > 1.2) { for (let i = 0; i < n; i++) if (S.st[i]) { S.st[i] = 0; S.fd[i] = 1; } S.hist.push({ f: 0, r: 'curou' }); S.f2 = 'idle'; S.cur = true; S.msg = 'Tratamento completo: as sensíveis morreram e as defesas do corpo eliminaram as poucas resistentes. Curou.'; }
    } else if (S.f2 === 'regrow') {
      S.t2 += dt; for (let i = 0; i < n; i++) if (S.rg[i] >= 0 && S.t2 >= S.rg[i] && !S.st[i]) { S.st[i] = S.rt[i]; S.gr[i] = 0; }
      if (S.t2 >= 2.1) { S.f2 = 'idle'; S.hist.push({ f: fracRes(S), r: 'rodada ' + S.hist.length }); S.msg = S.opt === 'parar' ? 'Parou no meio: sobraram muitas, e as resistentes, que já existiam, se multiplicaram.' : 'Antibiótico para gripe: vírus não têm alvo para ele. Mesmo assim, as bactérias sensíveis do corpo morrem e as resistentes se multiplicam.'; }
    }
  }
  function drawPlaca(t, S, A) {
    if (!S.st) zeraPlaca(S); passoPlaca(S, passo(S));
    const R = NAR ? Math.min(A.w * .3, A.h * .19) : Math.min(A.h * .46, A.w * .27), dx = NAR ? A.cx : A.x0 + R + 8, dy = NAR ? A.y0 + R + 2 : A.cy, k = R / .95, cr = .1 * k * .4, busy = S.f2 !== 'idle';
    circ(dx, dy, R, 'rgba(217,200,160,.07)', C.line, 2); circ(dx, dy, R * .97, null, 'rgba(217,200,160,.18)', 1);
    PLN.forEach((p, i) => {
      const v = S.st[i], x = dx + p[0] * k, y = dy + p[1] * k;
      if (v) circ(x, y, cr * (.4 + .6 * S.gr[i]), rgba(v === 2 ? C.erro : OLV, .8), v === 2 ? '#FFD0CF' : null, 1);
      else if (S.fd[i] > 0) circ(x, y, cr, rgba(OLV, S.fd[i] * .6));
    });
    if (S.f2 === 'wave') { const wx = dx - R + 2 * R * Math.min(1, S.t2 / 1.8); X.save(); X.beginPath(); X.arc(dx, dy, R, 0, TAU); X.clip(); rr(wx - 22, dy - R, 28, 2 * R, 0, rgba(C.vacina, .22)); X.restore(); line(wx, dy - R, wx, dy + R, rgba(C.vacina, .7), 2); }
    if (S.pls) { const a = PLN[S.pls.a], b = PLN[S.pls.b], f = ss(S.pls.t / .9), px = dx + lerp(a[0], b[0], f) * k, py = dy + lerp(a[1], b[1], f) * k; circ(px, py, cr * 1.1, null, PLA, 2.5); }
    // legenda de cores (cor nunca é a única pista: o nome vem escrito)
    const ly = dy + R + 16; circ(dx - 70, ly, 5, OLV); tx('sensível', dx - 62, ly, { s: 12, a: 'left', c: C.dim }); circ(dx + 12, ly, 5, C.erro); tx('resistente', dx + 20, ly, { s: 12, a: 'left', c: C.dim });
    // botões e gráfico
    const bx = NAR ? A.x0 : dx + R + 28, bwid = NAR ? A.w : A.x1 - bx, by0 = NAR ? ly + 12 : A.y0 + 4, bh = NAR ? 32 : 40;
    OPC.forEach((o, i) => btn(bx, by0 + i * (bh + 6), bwid, bh, o[1], i === 1 ? C.amber : MON, busy ? null : 'o' + i, { s: NAR ? 13 : 14, on: S.opt === o[0] && busy }));
    const yb = by0 + 3 * (bh + 6), hw = (bwid - 8) / 2;
    btn(bx, yb, hw, bh, 'Passar o plasmídeo', PLA, busy ? null : 'pl', { s: NAR ? 12 : 13 }); btn(bx + hw + 8, yb, hw, bh, 'Nova placa', C.dim, 'rs', { s: NAR ? 12 : 13 });
    const gy0 = yb + bh + 16, gh = A.y1 - 4 - gy0 - 22, hs = S.hist.slice(-8), nota = S.hist.length > 1 ? FIM : '';
    if (gh > 70) {
      tx('% de bactérias resistentes, a cada rodada', bx, gy0 - 4, { s: 12, a: 'left', c: C.dim }); const mx = Math.max(20, ...hs.map(h => h.f)) * 1.1, bwd = Math.min(46, bwid / 8 - 6), gb = nota ? 34 : 0;
      line(bx, gy0 + gh - gb, bx + bwid, gy0 + gh - gb, C.line, 1);
      hs.forEach((h, i) => { const x = bx + i * (bwd + 6) + 3, bhh = (gh - gb - 14) * h.f / mx; rr(x, gy0 + gh - gb - bhh, bwd, Math.max(bhh, 1.5), 3, rgba(C.erro, .75)); tx(nbr(h.f, h.f < 10 ? 1 : 0) + ' %', x + bwd / 2, gy0 + gh - gb - bhh - 9, { s: 11, w: 600 }); tx(h.r === 'início' ? 'início' : h.r === 'curou' ? 'curou' : String(i), x + bwd / 2, gy0 + gh - gb + 10, { s: 11, c: C.dim, bg: false }); });
      if (nota) wrapTx(nota, bx, gy0 + gh - 8, bwid, { s: 12, lh: 15, a: 'left', c: C.amber });
    } else { mtx('Resistentes por rodada: ' + hs.map(h => nbr(h.f, h.f < 10 ? 1 : 0) + ' %').join(', '), bx, gy0 + 6, { s: 12, a: 'left', c: C.dim });
      if (nota) wrapTx(nota, bx, gy0 + 26, bwid, { s: 12, lh: 15, a: 'left', c: C.amber }); }
    cap(S.msg);
  }
  def('monera', 'reproducao', {
    t: 'Divisão, troca de genes e resistência', s: 'uma vira duas a cada cerca de 20 minutos, e o antibiótico escolhe as que sobram', c: MON,
    loc: S => ({ div: 'Divisão binária', troca: 'Troca de genes', placa: 'Antibiótico na placa' })[S.modo] || 'Divisão binária', locNota: 'Desenho esquemático, fora de escala', still: 5, ctlVis: S => S.modo !== 'placa',
    alt: 'uma bactéria em divisão binária e a população dobrando; três quadros de troca de genes (transformação, conjugação e transdução); uma placa com bactérias sensíveis e resistentes em que o aluno escolhe como usar o antibiótico',
    extra: [modo('div', 'Divisão'), modo('troca', 'Troca de genes'), modo('placa', 'Antibiótico na placa')],
    init(S) { S.modo = 'div'; S.q = null; S.st = null; S.hist = null; S.opt = null; },
    d: "<p>A bactéria se reproduz de forma <b>assexuada</b>, por <b>divisão binária</b> (ou cissiparidade): copia o cromossomo, cresce e se divide em duas células iguais. Em condições ideais, a <i>E. coli</i> se divide a cada <b>20 minutos</b> ou pouco mais. Uma bactéria vira 2, 4, 8, 16... em 10 horas, seriam mais de 1 bilhão. Por isso uma infecção ou um alimento estragado \"explodem\" em poucas horas. Na prática, a comida e o espaço acabam, e a população para de crescer. Algumas bactérias, como as dos gêneros <i>Clostridium</i> e <i>Bacillus</i>, formam <b>endósporos</b> quando o ambiente piora: uma forma de resistência, com parede grossa, que aguenta fervura, seca e desinfetantes por anos. Para destruir endósporos, os hospitais usam a <b>autoclave</b> (vapor a 121 °C sob pressão); é por isso que conservas mal feitas podem guardar o bacilo do <b>botulismo</b>.</p>\n<p>Mesmo sem sexo, as bactérias variam. Primeiro, por <b>mutação</b>: com bilhões de divisões, sempre surgem cópias com erros, e alguns erros são úteis. Segundo, porque elas <b>trocam genes</b> por três caminhos: na <b>transformação</b>, uma bactéria absorve pedaços de DNA soltos no ambiente, de bactérias mortas (foi o que Frederick <b>Griffith</b> viu em 1928 com pneumococos); na <b>conjugação</b>, uma bactéria passa uma cópia de um <b>plasmídeo</b> para outra por um tubo, o <b>pilus</b>; na <b>transdução</b>, um <b>bacteriófago</b> leva pedaços de DNA de uma bactéria para outra.</p>\n<p>Os <b>antibióticos</b> são substâncias que matam bactérias ou impedem que se multipliquem, atacando o que só a célula bacteriana tem: a <b>penicilina</b> impede a construção da <b>parede</b>; a tetraciclina e a eritromicina travam os <b>ribossomos 70S</b>. Por isso antibiótico <b>não age em vírus</b>, que não têm parede nem ribossomos. A <b>resistência</b> surge assim: numa população de milhões de bactérias, umas poucas já têm, por mutação ou por um plasmídeo, um gene que as protege. O antibiótico mata as sensíveis e <b>as resistentes sobrevivem e se multiplicam</b>: é <b>seleção natural</b> em ação. O antibiótico <b>não cria</b> a resistência; ele <b>seleciona</b> quem já era resistente. Tomar antibiótico sem necessidade (contra gripe, por exemplo), em dose errada ou <b>parar antes do fim</b> do tratamento favorece essas sobreviventes. Os genes de resistência ainda passam de uma bactéria para outra por conjugação, até entre espécies diferentes. Assim surgem as <b>superbactérias</b>, resistentes a quase todos os antibióticos, um dos maiores problemas de saúde do mundo segundo a OMS.</p>\n", enem: "É dos temas mais cobrados do item. A resposta certa fala em <b>seleção</b> de bactérias resistentes que <b>já existiam</b> na população (por mutação ou por plasmídeos), nunca em bactérias que \"se adaptam\", \"se acostumam\" ou \"criam resistência para sobreviver\": essa é a alternativa lamarckista, sempre errada. Também caem: por que antibiótico não serve para gripe (vírus não têm os alvos), por que não se deve interromper o tratamento, e a reprodução por <b>divisão binária</b> com crescimento muito rápido.",
    links: [LK.transducao, LK.virus, LK.celbact],
    tap(x, y, S) {
      if (!toque(S)) return; const h = hitAt(x, y); if (typeof h !== 'string') return;
      if (S.modo === 'troca' && h[0] === 'q') S.q = S.q === +h.slice(1) ? null : +h.slice(1);
      if (S.modo === 'placa') { if (h[0] === 'o') aplica(S, OPC[+h.slice(1)][0]); else if (h === 'pl') plasmideo(S); else if (h === 'rs') zeraPlaca(S); }
    },
    draw(t, S) { const A = area(); if (S.modo === 'troca') drawTroca(t, S, A); else if (S.modo === 'placa') drawPlaca(t, S, A); else drawDiv(t, S, A); }
  });


  // =====================================================================================
  // M3 DOENÇAS CAUSADAS POR BACTÉRIAS: portas de entrada e "por onde entra, como se evita"
  // =====================================================================================
  const V3 = [
    { n: 'Pelo ar', c: C.resp, at: [.6, -4.25], dis: ['tuberculose (<i>Mycobacterium tuberculosis</i>)', 'hanseníase (<i>Mycobacterium leprae</i>)', 'coqueluche', 'difteria', 'meningite meningocócica'] },
    { n: 'Água e alimento', c: C.fecal, at: [-.6, -3.5], dis: ['cólera (<i>Vibrio cholerae</i>)', 'febre tifoide (<i>Salmonella</i> Typhi)', 'diarreias por <i>Salmonella</i> e por certas <i>E. coli</i>', 'botulismo (<i>Clostridium botulinum</i>)'] },
    { n: 'Pela pele: solo, água ou ferimento', c: C.pele, at: [.75, 5], dis: ['tétano (<i>Clostridium tetani</i>)', 'leptospirose (<i>Leptospira</i>)'] },
    { n: 'Sexo e mãe para o bebê', c: C.sangue, at: [0, 1.1], dis: ['sífilis (<i>Treponema pallidum</i>), inclusive a congênita', 'gonorreia e clamídia'] },
    { n: 'Vetor', c: C.vetor, at: [2.1, -1.3], dis: ['febre maculosa (<i>Rickettsia rickettsii</i>), pelo carrapato-estrela', 'peste bubônica (<i>Yersinia pestis</i>), pela pulga do rato'] }
  ];
  const VIA = ['pelo ar', 'pela água e pelos alimentos', 'pela pele (solo, água ou ferimento)', 'pelo sexo ou da mãe para o bebê', 'por um vetor'];
  function drawCorpo(t, S, A) {
    const hb = NAR ? Math.min(A.h * .7, 300) : Math.min(A.h * .92, 440), u = hb / 10, bx = A.x0 + (NAR ? 2.7 * u : A.w * .2), by = A.cy, tx0 = NAR ? bx + 2.9 * u + 8 : A.x0 + A.w * .42, tw3 = A.x1 - tx0;
    silhueta(bx, by, hb, '#9DA9C4');
    let y = A.y0 + 4; const hs = [];
    V3.forEach((v, i) => {
      const on = S.sel === i, hh = Math.max(42, wrapTx(v.n, 0, 0, tw3 - 40, { s: NAR ? 13 : 14, w: 600, lh: 16, dry: true }) + 18), th = on ? hh + wrapTx(v.dis.join('; ') + '.', 0, 0, tw3 - 20, { s: NAR ? 12 : 13, lh: NAR ? 16 : 18, dry: true }) + 10 : hh;
      hs.push([y, th, hh]); y += th + 6;
    });
    V3.forEach((v, i) => {
      const [yy, th, hh] = hs[i], on = S.sel === i, mx = bx + v.at[0] * u, my = by + v.at[1] * u, ty = yy + hh / 2;
      line(mx, my, tx0, ty, rgba(v.c, on ? .9 : .4), on ? 2.2 : 1.2, on ? null : [4, 4]);
      circ(mx, my, 6 + (on ? Math.sin(t * 4) * 1.5 : 0), rgba(v.c, .35), v.c, 2);
      if (on) for (let k = 0; k < 3; k++) { const f = fr(t * .45 + k / 3), px = lerp(tx0, mx, f), py = lerp(ty, my, f); X.save(); X.translate(px, py); X.rotate(Math.atan2(my - ty, mx - tx0)); rr(-6, -2.5, 12, 5, 2.5, OLV, '#0B0F1C', 1); X.restore(); }
      rr(tx0, yy, tw3, th, 10, rgba(v.c, on ? .16 : .07), on ? AM : rgba(v.c, .6), on ? 2.5 : 1.3); hitR(tx0, yy, tw3, th, 'v' + i);
      circ(tx0 + 16, ty, 6, v.c); wrapTx(v.n, tx0 + 28, ty - (hh - 18) / 2 + 8, tw3 - 40, { s: NAR ? 13 : 14, w: 600, lh: 16, a: 'left' });
      if (on) wrapTx(v.dis.join('; ') + '.', tx0 + 10, yy + hh + 8, tw3 - 20, { s: NAR ? 12 : 13, lh: NAR ? 16 : 18, a: 'left', c: C.txt });
    });
    cap(S.sel == null ? 'Toque numa porta de entrada para ver as bactérias e as doenças daquela via. A silhueta é só ilustrativa.' : `As bactérias entram ${VIA[S.sel]} e causam as doenças listadas.`);
  }
  const CARTAS = [['Tuberculose', 0], ['Hanseníase', 0], ['Cólera', 1], ['Botulismo', 1], ['Tétano', 2], ['Leptospirose', 2], ['Sífilis', 3], ['Febre maculosa', 4]];
  const BV = baralho({
    nome: 'bv', dica: 'Toque numa doença e depois na porta de entrada (no mouse, também dá para arrastar).',
    cartas: [CARTAS[4], CARTAS[2], CARTAS[6], CARTAS[0], CARTAS[7], CARTAS[3], CARTAS[1], CARTAS[5]].map(c => ({ t: c[0], k: c[1] })),
    alvos: [['Pelo ar', C.resp], ['Água e alimento', C.fecal], ['Pela pele', C.pele], ['Sexo e mãe para o bebê', C.sangue], ['Vetor', C.vetor]].map(a => ({ t: a[0], c: a[1] })),
    certo: c => `${c.t}: a bactéria entra ${VIA[c.k]}.`, errado: c => `${c.t} não entra por essa porta. Pense em como a bactéria chega ao corpo.`,
    fim: () => 'Todas nas portas certas. Agora falta escolher a prevenção de cada uma.'
  });
  const MED = ['vacina', 'saneamento e água tratada', 'cozinhar e conservar bem os alimentos', 'preservativo e pré-natal', 'controle de ratos e evitar água de enchente', 'roupa clara e examinar o corpo depois de andar na mata', 'tratar todas as pessoas doentes até o fim'];
  const DS = [
    ['Tuberculose', [0, 6], 'A vacina BCG protege contra as formas graves; o tratamento dura pelo menos seis meses, e abandoná-lo favorece bacilos resistentes.'],
    ['Hanseníase', [6], 'A hanseníase tem cura, e o tratamento gratuito no SUS interrompe a transmissão logo que começa. Pessoa com hanseníase deve ser tratada até o fim.'],
    ['Cólera', [1, 2], 'Vem de água e alimentos contaminados por fezes: saneamento, água tratada e alimentos bem cozidos e conservados. Saneamento é responsabilidade pública.'],
    ['Botulismo', [2], 'A toxina se forma em conservas mal preparadas: cozinhar e conservar bem e nunca consumir lata estufada.'],
    ['Tétano', [0], 'A prevenção é a vacina, com reforço; num ferimento de risco em quem não está vacinado, usa-se também o soro.'],
    ['Leptospirose', [1, 4], 'Controle de ratos, esgoto e coleta de lixo (responsabilidade pública) e evitar a água de enchente.'],
    ['Sífilis', [3, 6], 'Preservativo e teste no pré-natal; o tratamento com penicilina corta a passagem da gestante para o bebê.'],
    ['Febre maculosa', [5], 'Roupa clara e examinar o corpo depois de andar em mata, pasto ou beira de rio. A capivara não transmite a doença: ela só hospeda o carrapato.']
  ];
  function drawJogo(t, S, A) {
    if (S.pm == null) S.pm = 'cart';
    if (S.pm === 'cart') {
      const fim = BV.feito(S), box = { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y1 - (fim ? 48 : 0) };
      BV.draw(S, box, { cols: NAR ? 4 : 4, cartaH: NAR ? 40 : 40, slotH: NAR ? 28 : 34 });
      if (fim) btn(A.cx - 150, A.y1 - 42, 300, 40, 'Escolher as medidas de prevenção', C.ok, 'go', { s: 14 });
      cap(BV.msg(S) || 'Arraste cada doença até a porta de entrada da bactéria.'); return;
    }
    const i = S.mi, d = DS[i], cols = NAR ? 2 : 4, g = 8, cw = (A.w - (cols - 1) * g) / cols, h = NAR ? 50 : 54, y0 = A.y0 + 46, fin = i >= DS.length;
    if (fin) { title(`Fim: ${S.pts} de ${DS.length} certas na primeira tentativa`, A.cx, A.y0 + 20, A.w, { s: 18 }); btn(A.cx - 100, A.y0 + 56, 200, 44, 'Recomeçar', MON, 'rs', { s: 14 }); cap('Lembre: vacina e soro são diferentes. Vacina previne, e o corpo cria memória; soro traz anticorpos prontos, de ação rápida e passageira.'); return; }
    title(`${i + 1} de ${DS.length}: ${d[0]}. Quais medidas previnem?`, A.cx, A.y0 + 20, A.w, { s: NAR ? 14 : 17 });
    MED.forEach((m, k) => { const on = S.msel.includes(k), mk = S.ok && d[1].includes(k); btn(A.x0 + (k % cols) * (cw + g), y0 + Math.floor(k / cols) * (h + g), cw, h, m, mk ? C.ok : on ? AM : MON, S.ok ? null : 'm' + k, { on, s: NAR ? 12 : 13 }); });
    const yb = y0 + Math.ceil(7 / cols) * (h + g) + 6; btn(A.cx - 110, yb, 220, 44, S.ok ? (i === DS.length - 1 ? 'Ver o resultado' : 'Próxima doença') : 'Conferir', S.ok ? C.ok : AM, S.ok ? 'nx' : 'cf', { s: 14 });
    cap(S.jm || 'Escolha todas as medidas que servem (algumas doenças têm mais de uma) e toque em Conferir.');
  }
  function confere(S) {
    const d = DS[S.mi], sel = S.msel.slice().sort().join(), ok = d[1].slice().sort().join();
    if (!S.msel.length) { S.jm = 'Escolha pelo menos uma medida.'; return; }
    if (sel === ok) { S.ok = true; if (!S.tent) S.pts++; S.jm = 'Certo. ' + d[2]; }
    else { S.tent++; S.jm = S.tent >= 2 ? `Ainda não. As medidas certas são: ${d[1].map(k => MED[k]).join(' e ')}. ${d[2]}` : 'Ainda não: alguma medida não serve para esta doença, ou falta alguma. Pense na via de entrada e tente de novo.'; if (S.tent >= 2) { S.msel = d[1].slice(); S.ok = true; } }
  }
  def('monera', 'doencas', {
    t: 'Doenças causadas por bactérias', s: 'pelo ar, pela água, pela pele, pelo sexo e por vetores', c: C.sangue,
    loc: S => S.modo === 'jogo' ? 'Por onde entra, como se evita' : 'Portas de entrada', locNota: 'Silhueta neutra, esquemática', still: 2, ctlVis: S => S.modo === 'corpo',
    alt: 'silhueta humana neutra com cinco portas de entrada coloridas, uma por via (ar, água e alimento, pele, sexo e gestação, vetor); jogo de arrastar oito doenças até a porta certa e escolher as medidas de prevenção',
    extra: [modo('corpo', 'Portas de entrada'), modo('jogo', 'Por onde entra')],
    init(S) { S.modo = 'corpo'; S.sel = null; S.pm = 'cart'; BV.zera(S); S.mi = 0; S.msel = []; S.ok = false; S.tent = 0; S.pts = 0; S.jm = null; },
    d: "<p>A maioria das bactérias é inofensiva ou útil, mas algumas causam doenças, por invadirem tecidos ou por produzirem <b>toxinas</b>. Separar as doenças pela <b>via de transmissão</b> ajuda a lembrar como evitá-las:</p>\n<p><b>Pelo ar (gotículas e aerossóis).</b> A <b>tuberculose</b> é causada pelo <i>Mycobacterium tuberculosis</i>, o bacilo descoberto por Robert <b>Koch</b> em <b>1882</b>. Ataca sobretudo os pulmões, com tosse por mais de três semanas, febre no fim da tarde, suor noturno e emagrecimento. Tem cura, com antibióticos por <b>pelo menos seis meses</b>, gratuitos no SUS; abandonar o tratamento favorece bacilos resistentes. A vacina <b>BCG</b>, do calendário infantil (ver o calendário vigente), protege contra as formas graves na criança. A <b>hanseníase</b>, causada pelo <i>Mycobacterium leprae</i>, ataca a pele e os nervos, com manchas com perda de sensibilidade; passa pelas vias aéreas, só com <b>contato próximo e prolongado</b>, e deixa de passar logo que o tratamento começa. <b>Tem cura</b>, com tratamento gratuito no SUS. O Brasil é o <b>segundo país</b> com mais casos novos no mundo. Também passam pelo ar a <b>coqueluche</b>, a <b>difteria</b> e a <b>meningite meningocócica</b>, todas com vacina no calendário.</p>\n<p><b>Pela água e pelos alimentos (fecal-oral).</b> A <b>cólera</b> (<i>Vibrio cholerae</i>) causa diarreia muito intensa, que desidrata em horas; o tratamento principal é repor água e sais (<b>soro de reidratação oral</b>). A <b>febre tifoide</b> (<i>Salmonella</i> Typhi) e as diarreias por <i>Salmonella</i> e por certas <i>E. coli</i> também vêm de água e comida contaminadas por fezes. O <b>botulismo</b> vem da toxina do <i>Clostridium botulinum</i>, que cresce sem oxigênio em <b>conservas e enlatados</b> mal preparados: lata <b>estufada</b> não se consome.</p>\n<p><b>Pela pele (solo, água ou ferimento).</b> O <b>tétano</b> (<i>Clostridium tetani</i>) começa com um ferimento, muitas vezes profundo, contaminado com <b>esporos</b> do solo; a toxina causa contrações musculares fortes. Previne-se com <b>vacina</b> (e reforço a cada dez anos); num ferimento de risco em quem não está vacinado, usa-se também o <b>soro</b>. A <b>leptospirose</b> (<i>Leptospira</i>) vem da <b>urina de ratos</b> na água de <b>enchentes</b> e esgotos; a bactéria entra pela pele, sobretudo se houver feridas, e pelas mucosas.</p>\n<p><b>Pelo sexo e da mãe para o bebê.</b> A <b>sífilis</b> (<i>Treponema pallidum</i>) começa com uma ferida indolor (o <b>cancro duro</b>) e, sem tratamento, pode atingir o coração e o sistema nervoso anos depois. Passa da gestante para o feto (<b>sífilis congênita</b>), por isso o teste é feito no pré-natal. Trata-se com <b>penicilina</b>. A <b>gonorreia</b> e a <b>clamídia</b> também são bactérias transmitidas pelo sexo. O <b>preservativo</b> previne as três.</p>\n<p><b>Por vetores.</b> A <b>febre maculosa</b> (<i>Rickettsia rickettsii</i>) passa pela picada do <b>carrapato-estrela</b>, que vive em cavalos e capivaras, em áreas de mata, pasto e beira de rio, sobretudo no Sudeste. A capivara não transmite a doença; ela só hospeda o carrapato. A <b>peste bubônica</b> (<i>Yersinia pestis</i>), que matou pelo menos um terço da população da Europa no século XIV, passa pela <b>pulga</b> do rato.</p>\n", enem: "O ENEM cobra a doença ligada ao <b>contexto</b>: <b>leptospirose</b> depois de <b>enchente</b>; <b>cólera</b> e diarreias onde falta <b>saneamento</b>; <b>tétano</b> com ferimento e <b>vacina com reforço</b>; <b>tuberculose</b> e o risco de <b>abandonar o tratamento</b>; <b>botulismo</b> e lata estufada; <b>sífilis congênita</b> e o <b>pré-natal</b>. Diferencie <b>vacina</b> (prevenção, o corpo produz anticorpos e memória, ação lenta e duradoura) de <b>soro</b> (anticorpos prontos, ação rápida e passageira, como no tétano). A hanseníase aparece em questões sobre preconceito: <b>tem cura</b> e não passa por um toque.",
    links: [LK.calendario, LK.virus, LK.ecologia],
    tap(x, y, S) {
      if (S.modo === 'jogo' && S.pm === 'cart') { if (BV.tap(x, y, S)) return; }
      if (!toque(S)) return; const h = hitAt(x, y); if (typeof h !== 'string') return;
      if (S.modo === 'corpo' && h[0] === 'v') S.sel = S.sel === +h.slice(1) ? null : +h.slice(1);
      if (S.modo !== 'jogo') return;
      if (h === 'go') { S.pm = 'med'; S.mi = 0; S.msel = []; S.ok = false; S.tent = 0; S.pts = 0; S.jm = null; }
      else if (h === 'rs') { S.pm = 'cart'; BV.zera(S); }
      else if (h[0] === 'm') { const k = +h.slice(1); S.msel = S.msel.includes(k) ? S.msel.filter(q => q !== k) : S.msel.concat([k]); }
      else if (h === 'cf') confere(S);
      else if (h === 'nx') { S.mi++; S.msel = []; S.ok = false; S.tent = 0; S.jm = null; }
    },
    grab(x, y, S) { return S.modo === 'jogo' && S.pm === 'cart' && BV.grab(x, y, S); }, grabMove: BV.grabMove, grabEnd: BV.grabEnd,
    draw(t, S) { const A = area(); if (S.modo === 'jogo') drawJogo(t, S, A); else drawCorpo(t, S, A); }
  });

}
