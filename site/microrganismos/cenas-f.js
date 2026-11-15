/* LAB, módulo Microrganismos e fungos. Cenas do Fungi: F1 (o corpo e a vida dos fungos) e F2 (liquens e micorrizas).
   Código da equipe (Prometeu). Textos: roteiro do Taxon revisado pelo Sapien (docs/revisao-biologia/seres-vivos-roteiro.md).
   Os parágrafos do aluno e os cartões "No ENEM" entre as marcas TXT vêm do roteiro. */
'use strict';
{
  const FUN = C.fungi;
  const passo = S => S.paused ? .12 : Math.min(.05, S.dt || .016);
  const modo = (id, t) => ({ t, on: S => { S.modo = id; S.msg = null; }, pressed: S => S.modo === id });
  const toque = S => { const now = performance.now(), ok = now - (S.tapT || 0) > 200; S.tapT = now; return ok; };
  const NOTA = 'Desenho esquemático, fora de escala';
  const HIFA = '#EDE3D0';
  const TXT = {};
  //TXT-INICIO
  TXT.F1 = { d: "<p>Os fungos são eucariontes <b>heterótrofos</b> que se alimentam por <b>absorção</b>: lançam <b>enzimas digestivas</b> no ambiente, digerem o alimento do lado de fora e absorvem as moléculas pequenas. Têm <b>parede celular de quitina</b> (a mesma substância do esqueleto dos insetos) e guardam energia como <b>glicogênio</b>, como os animais. Não fazem fotossíntese. Estudos de DNA mostram que os fungos são <b>mais aparentados com os animais</b> do que com as plantas. Há fungos <b>unicelulares</b>, as <b>leveduras</b>, como o <i>Saccharomyces cerevisiae</i> do pão e da cerveja (ver o modelo #celula_levedura), e <b>pluricelulares</b>, formados por filamentos chamados <b>hifas</b>. O conjunto de hifas é o <b>micélio</b>, que cresce escondido no solo, na madeira ou no pão. O <b>cogumelo</b> que vemos é só o <b>corpo de frutificação</b>, a parte que produz esporos.</p>\n<p>Os fungos se reproduzem de forma <b>assexuada</b> (por <b>esporos</b> levados pelo vento, pela água ou por animais; por <b>brotamento</b>, nas leveduras; ou por pedaços de hifa) e <b>sexuada</b>, quando hifas de linhagens diferentes se fundem. Pela estrutura que forma os esporos sexuados, os livros separam quatro grupos: <b>quitridiomicetos</b> (com esporos que nadam com flagelo; um deles, o <i>Batrachochytrium</i>, está matando sapos e rãs no mundo todo), <b>zigomicetos</b> (como o <i>Rhizopus</i>, o bolor preto do pão), <b>ascomicetos</b> (leveduras, o <i>Penicillium</i>, o <i>Aspergillus</i> e as trufas) e <b>basidiomicetos</b> (cogumelos, orelhas-de-pau e as ferrugens das plantas). Os fungos vivem no solo, na madeira, em restos de seres vivos, na água e dentro ou sobre outros seres. Gostam de <b>umidade</b> e de matéria orgânica, e muitos toleram ambientes ácidos.</p>\n<p>Com as bactérias, os fungos são os grandes <b>decompositores</b>: sem eles, troncos e folhas mortas se acumulariam e os nutrientes não voltariam ao solo. Na <b>alimentação</b>, as leveduras fazem a <b>fermentação alcoólica</b> que crescem o pão e produzem cerveja e vinho (ver Bioenergética); fungos do gênero <i>Penicillium</i> dão sabor aos queijos roquefort e camembert; e comemos vários cogumelos, como o champignon e o shimeji. Na <b>medicina</b>, Alexander <b>Fleming</b> descobriu em <b>1928</b> que um bolor, o <i>Penicillium</i>, matava bactérias numa placa: foi o início da <b>penicilina</b>, o primeiro antibiótico usado em larga escala. Do lado ruim, fungos causam <b>micoses</b>, como o pé de atleta e outras \"frieiras\" (pele), a <b>candidíase</b> (mucosas) e a histoplasmose (pulmões, por esporos em fezes de morcegos e aves); causam doenças em plantações, como a <b>vassoura-de-bruxa</b> do cacau e a ferrugem do café; e alguns produzem toxinas, como as <b>aflatoxinas</b> do amendoim e do milho mal armazenados. Há cogumelos <b>venenosos</b> que se parecem com os comestíveis: cogumelo do mato não se come.</p>", enem: "As características que separam fungos de plantas caem muito: <b>heterótrofos por absorção</b>, <b>parede de quitina</b> e reserva de <b>glicogênio</b>. Também aparecem: o papel de <b>decompositores</b> na ciclagem da matéria, a <b>fermentação</b> das leveduras (pão, que cresce pelo gás carbônico, e bebidas alcoólicas), a <b>penicilina</b> e as condições que favorecem o bolor (umidade, calor, matéria orgânica). Pegadinha: o cogumelo <b>não é o fungo inteiro</b>, é o corpo de frutificação." };
  TXT.F2 = { d: "<p>Um <b>líquen</b> não é um ser só: é a associação de um <b>fungo</b> (quase sempre um ascomiceto) com uma <b>alga verde</b> ou uma <b>cianobactéria</b>. As hifas do fungo formam o corpo do líquen e envolvem as células da alga. O fungo dá <b>proteção</b> contra a seca e a luz forte e retém <b>água e sais minerais</b>; a alga, ou a cianobactéria, faz <b>fotossíntese</b> e fornece <b>matéria orgânica</b> ao fungo. Os dois se beneficiam: é um caso de <b>mutualismo</b> (ver relações ecológicas no módulo Ecologia). Juntos, conseguem viver onde nenhum dos dois viveria sozinho: em <b>rochas nuas</b>, troncos, telhados, desertos e regiões geladas. Os liquens se reproduzem sobretudo por pedacinhos que contêm hifas e algas juntas (os <b>sorédios</b>), levados pelo vento.</p>\n<p>Os liquens são <b>pioneiros</b>: estão entre os primeiros seres a ocupar uma rocha nua. Liberam <b>ácidos</b> que desgastam a rocha e, quando morrem, deixam matéria orgânica; com o tempo, forma-se uma camada fina de solo onde musgos e depois plantas maiores conseguem crescer (é a <b>sucessão ecológica primária</b>, no módulo Ecologia). Como absorvem tudo o que chega pelo ar e pela chuva, sem uma cutícula de proteção, os liquens são muito <b>sensíveis à poluição do ar</b>, principalmente ao <b>dióxido de enxofre</b> (SO₂). Por isso funcionam como <b>bioindicadores</b>: num lugar com muitos liquens variados, o ar tende a ser limpo; nos centros de cidades poluídas, eles somem dos troncos.</p>\n<p>As <b>micorrizas</b> são associações entre fungos e <b>raízes de plantas</b>. As hifas do fungo se espalham pelo solo como uma extensão da raiz e <b>aumentam muito a absorção de água e de sais minerais</b>, principalmente o <b>fósforo</b>; a planta, em troca, fornece <b>açúcares</b> ao fungo. A grande maioria das plantas terrestres, <b>cerca de 80%</b> das espécies, tem micorrizas. Fósseis indicam que essa parceria já existia nas primeiras plantas que saíram da água, há mais de 400 milhões de anos, e pode ter sido essencial para a conquista do ambiente terrestre. Hoje, mudas com micorrizas são usadas em reflorestamento de solos pobres. Outro exemplo de fungo em parceria: as <b>formigas cortadeiras</b> (saúvas) não comem as folhas que cortam; elas cultivam com as folhas um fungo dentro do formigueiro e se alimentam dele.</p>", enem: "<b>Líquen</b> = fungo + alga (ou cianobactéria), em <b>mutualismo</b>: o fungo dá proteção, água e sais; a alga dá alimento. As duas ideias mais cobradas: liquens como <b>pioneiros</b> na sucessão primária (desgastam a rocha e iniciam o solo) e como <b>bioindicadores da poluição do ar</b> (somem onde há muito SO₂). <b>Micorriza</b> = fungo + raiz, que aumenta a absorção de <b>água e fósforo</b>. Se a questão falar de \"associação em que os dois ganham\", é mutualismo, não parasitismo nem comensalismo." };
  //TXT-FIM
  const LKT = ['Relembre na Taxonomia: fungo não é planta', '../taxonomia/index.html#sistemas/reinos'];

  function chips(S, list, x, y, w, cols, h, pre, o = {}) {
    const g = 8, cw = (w - (cols - 1) * g) / cols, fs = NAR ? 12 : 13;
    list.forEach((s, i) => {
      const cx = x + (i % cols) * (cw + g), cy = y + Math.floor(i / cols) * (h + g), fl = S.flash && S.flash.i === i && S.flash.k === pre && performance.now() - S.flash.t < 700;
      const ox = fl ? Math.sin((performance.now() - S.flash.t) / 25) * 4 : 0;
      rr(cx + ox, cy, cw, h, 8, 'rgba(19,26,43,.94)', fl ? C.erro : (o.cor || FUN), fl ? 2.2 : 1.3);
      const th = wrapTx(s, 0, 0, cw - 10, { s: fs, w: 600, lh: fs + 3, dry: true });
      wrapTx(s, cx + ox + cw / 2, cy + h / 2 - th / 2 + (fs + 3) / 2, cw - 10, { s: fs, w: 600, lh: fs + 3, c: C.txt });
      hitR(cx, cy, cw, h, pre + i);
    });
    return Math.ceil(list.length / cols) * (h + g) - g;
  }
  // hifas: árvore de segmentos [x1, y1, x2, y2, nascimento, profundidade], em coordenadas unitárias
  function gera(R, x, y, a, l, d, b, out, max) {
    const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l; out.push([x, y, x2, y2, b, d]); if (d >= max) return;
    const nb = d < 1 ? 3 : 2;
    for (let k = 0; k < nb; k++) gera(R, x2, y2, a + (R() - .5) * 1.1 + (k ? (k % 2 ? .6 : -.6) : 0), l * (.76 + R() * .14), d + 1, b + .1 + R() * .06, out, max);
  }
  const PAO = []; { const R = rng(7); [[.2, .3], [.7, .25], [.35, .7], [.8, .72], [.5, .5]].forEach(([x, y]) => gera(R, x, y, R() * TAU, .12, 0, R() * .15, PAO, 4)); }
  const SOLO = []; { const R = rng(19); [-1.15, -.6, -.2, .2, .6, 1.15].forEach(a => gera(R, 0, 0, PI / 2 + a, .22, 0, R() * .1, SOLO, 4)); }
  function desenhaHifas(list, g, ox, oy, sx, sy, lw, c) {
    for (const s of list) { const p = seg(g, s[4], s[4] + .14); if (p <= 0) continue; line(ox + s[0] * sx, oy + s[1] * sy, ox + lerp(s[0], s[2], p) * sx, oy + lerp(s[1], s[3], p) * sy, c, Math.max(.8, lw * (1 - s[5] * .15))); }
  }

  // =====================================================================================
  // F1 O CORPO E A VIDA DOS FUNGOS
  // =====================================================================================
  function drawPao(t, S, A) {
    const T = t % 19, g = seg(T, 2.2, 12.5), sp = ss(seg(T, 12.5, 15.5)), fade = 1 - ss(seg(T, 17.5, 19));
    const wide = !NAR, bw = wide ? A.w * .54 : A.w, bh = wide ? A.h : A.h * .5 - 4;
    const bx = A.x0, by = A.y0, pad = 16;
    X.save(); X.globalAlpha *= fade;
    rr(bx, by, bw, bh, 26, '#C58A4A', '#7A4C22', 2); rr(bx + 9, by + 9, bw - 18, bh - 18, 20, '#E9CB8F');
    const R0 = rng(3); for (let i = 0; i < 40; i++) circ(bx + 18 + R0() * (bw - 36), by + 18 + R0() * (bh - 36), 1.5 + R0() * 2.5, 'rgba(160,110,60,.3)');
    // esporos pousando
    const ox = bx + pad + 4, oy = by + pad + 18, sw = bw - 2 * pad - 8, sh = bh - 2 * pad - 24;
    if (T < 3) [[.2, .3], [.7, .25], [.35, .7], [.8, .72], [.5, .5]].forEach(([u, v], i) => { const f = ss(seg(T, i * .15, i * .15 + 1.6)); circ(ox + u * sw, lerp(by - 4, oy + v * sh, f), 3, '#5C5448'); });
    desenhaHifas(PAO, g, ox, oy, sw, sh, 1.8, HIFA);
    if (sp > 0) for (const s of PAO) if (s[5] === 4) { const x = ox + s[2] * sw, y = oy + s[3] * sh; line(x, y, x, y - 5 * sp, HIFA, 1); circ(x, y - 5 * sp, 3.2 * sp, '#14110D'); }
    tx('pão úmido', bx + 14, by + 16, { s: 12, a: 'left', c: '#4B2F14', bg: false });
    X.restore();
    // lente de aumento: ponta de hifa
    const zr = wide ? Math.min(A.w * .21, A.h * .36) : Math.min(A.w * .3, A.h * .22), zx = wide ? A.x0 + bw + (A.w - bw) / 2 : A.cx, zy = wide ? A.cy : A.y0 + bh + 10 + zr + 14;
    line(bx + bw * .5, by + bh * .5, zx - (wide ? zr : 0), zy - (wide ? 0 : zr), 'rgba(255,255,255,.4)', 1, [4, 4]); circ(bx + bw * .5, by + bh * .5, 5, null, '#fff', 1.4);
    circ(zx, zy, zr, 'rgba(11,15,28,.88)', C.amber, 2);
    X.save(); X.beginPath(); X.arc(zx, zy, zr - 2, 0, TAU); X.clip();
    const hx0 = zx - zr, hy = zy, hx1 = zx - zr * .1, hw = zr * .2;
    rr(hx0, hy - hw / 2, hx1 - hx0, hw, hw / 2, rgba(HIFA, .22), HIFA, 2); circ(hx1, hy, hw / 2, rgba(HIFA, .22), HIFA, 2);
    const e = fr(t * .3), BL = [[.35, -.45], [.55, .1], [.3, .5]];
    BL.forEach(([u, v], i) => { const bx2 = zx + u * zr, by2 = zy + v * zr, pq = ss(seg(e, .35 + i * .04, .7)); if (pq < 1) ell(bx2, by2, zr * .17 * (1 - pq * .8), zr * .12 * (1 - pq * .8), i, rgba('#C2B08A', .9), '#7C6A44', 1); if (e > .4) { const f = ss(seg(e, .55 + i * .05, .95)); for (let k = 0; k < 3; k++) circ(lerp(bx2 + (k - 1) * 5, hx1 + hw * .3, f), lerp(by2 + (k - 1) * 4, hy + (k - 1) * 3, f), 2.2, '#8EE08E'); } });
    for (let i = 0; i < 6; i++) { const f = ss(seg(e, 0, .4)); if (e < .45) { const tgt = BL[i % 3]; circ(lerp(hx1 + 4, zx + tgt[0] * zr, f), lerp(hy + (i - 3) * 2, zy + tgt[1] * zr, f), 2.4, C.amber); } }
    X.restore();
    if (LB) { tx('ponta de hifa, ampliada', zx, zy - zr - 10, { s: 12, c: C.dim }); mtx('<b>digestão fora do corpo</b>', zx, zy + zr + 12, { s: 13, c: C.amber }); tx('enzimas', zx + zr * .4, zy - zr * .78, { s: 12, c: C.amber, bg: false }); }
    cap(T < 2.2 ? 'Esporos pousam no pão úmido.' : T < 12.5 ? 'Cada esporo germina e as <b>hifas</b> crescem como fios brancos: juntas, formam o <b>micélio</b>. Na lente, a ponta da hifa lança <b>enzimas</b> e absorve moléculas pequenas.' : 'Por fim, aparecem os pontinhos pretos: os <b>esporângios</b>, que liberam novos esporos.');
  }
  function drawCogu(t, S, A) {
    const T = t % 16, g = ss(seg(T, 0, 7)), em = ss(seg(T, 5, 9)), gy = A.y0 + A.h * .4, sh = A.y1 - gy;
    X.save(); X.beginPath(); X.rect(A.x0, gy, A.w, sh); X.clip(); X.fillStyle = 'rgba(92,64,40,.55)'; X.fillRect(A.x0, gy, A.w, sh);
    const R0 = rng(4); for (let i = 0; i < 60; i++) circ(A.x0 + R0() * A.w, gy + R0() * sh, 1 + R0() * 2, 'rgba(60,40,22,.55)');
    desenhaHifas(SOLO, g, A.cx, gy + 4, Math.min(A.w * .46, 520), sh * 1.6, 1.8, HIFA);
    X.restore(); line(A.x0, gy, A.x1, gy, '#7A5A38', 2);
    const mh = A.h * .24 * em, sw2 = Math.min(18, A.w * .03), cwid = Math.min(A.w * .12, 70);
    if (em > .02) { rr(A.cx - sw2 / 2, gy - mh, sw2, mh + 4, 5, '#EFE6D6', '#9C8F78', 1.6); X.beginPath(); X.ellipse(A.cx, gy - mh, cwid * em, cwid * .6 * em, 0, PI, TAU); X.closePath(); X.fillStyle = '#B5563B'; X.fill(); X.strokeStyle = '#6E2C1C'; X.lineWidth = 1.8; X.stroke(); for (let i = 0; i < 4; i++) circ(A.cx + (i - 1.5) * cwid * .4 * em, gy - mh - cwid * .22 * em - (i % 2) * 3 * em, 2.6 * em, '#F3E6D0'); }
    if (LB) {
      const bx = A.x1 - 18; line(bx, gy - A.h * .24, bx, gy - 2, '#E8EDF7', 1.5); tx('só isto aparece: corpo de frutificação', bx - 8, gy - A.h * .12, { s: 12, a: 'right', c: C.txt });
      line(bx, gy + 6, bx, A.y1 - 4, HIFA, 1.5); tx('micélio: a maior parte do fungo', bx - 8, gy + sh * .5, { s: 12, a: 'right', c: HIFA });
      if (em > .8) lab(A.cx + cwid * .6, gy - mh - cwid * .2, A.cx + cwid * 1.8, gy - mh - 24, 'cogumelo');
      lab(A.cx - A.w * .18, gy + sh * .5, A.cx - A.w * .3, gy + sh * .8, 'hifas');
    }
    cap('<b>O cogumelo é só a parte que aparece</b>: o corpo de frutificação, que produz esporos. O resto do fungo, o micélio, cresce escondido na terra.');
  }
  const FUNGO = baralho({
    nome: 'fng',
    alvos: [{ t: 'fungo', c: '#D9A066' }, { t: 'não é fungo', c: '#7FB2E5' }, { t: 'associação', c: '#6BCB77' }],
    cartas: [
      { t: 'cogumelo', k: 0, x: 'é o corpo de frutificação de um fungo.' },
      { t: 'levedura do pão', k: 0, x: 'o <i>Saccharomyces cerevisiae</i> é um fungo unicelular.' },
      { t: 'bolor da laranja', k: 0, x: 'o bolor é feito de hifas: é fungo (<i>Penicillium</i>).' },
      { t: 'orelha-de-pau', k: 0, x: 'é um basidiomiceto, parente dos cogumelos.' },
      { t: 'musgo', k: 1, x: 'o musgo é uma planta (briófita), com clorofila e fotossíntese.' },
      { t: 'alga verde', k: 1, x: 'é autótrofa e entra no Protoctista, não nos fungos.' },
      { t: 'bactéria do iogurte', k: 1, x: 'é procarionte (reino Monera), sem núcleo.' },
      { t: 'líquen', k: 2, x: 'não é um ser só: é um fungo associado a uma alga ou cianobactéria.' }
    ],
    certo: c => '<b>Certo.</b> ' + c.x.charAt(0).toUpperCase() + c.x.slice(1),
    errado: (c, a) => `<b>Ainda não.</b> ${semTag(c.t)} não vai em "${a.t}". Pense em: heterótrofo por absorção, quitina, hifas.`,
    fim: () => '<b>Pronto.</b> Fungo: heterótrofo por absorção, parede de quitina, reserva de glicogênio. O líquen é uma associação, e musgo e alga verde fazem fotossíntese.',
    dica: 'Toque num cartão e depois no lugar certo.'
  });
  const BOM = baralho({
    nome: 'bom',
    alvos: [{ t: 'útil', c: '#6BCB77' }, { t: 'prejudicial', c: '#F0605D' }, { t: 'os dois', c: '#FFB347' }],
    cartas: [
      { t: 'decompõe folhas e troncos', t2: 'decompositor', k: 0, x: 'os decompositores devolvem os nutrientes ao solo.' },
      { t: 'produz penicilina', t2: 'penicilina', k: 0, x: 'Fleming, em 1928, viu que o <i>Penicillium</i> matava bactérias: nasceu o primeiro antibiótico em larga escala.' },
      { t: 'causa pé de atleta', t2: 'pé de atleta', k: 1, x: 'é uma micose de pele.' },
      { t: 'fermenta o pão', t2: 'pão', k: 0, x: 'a levedura faz fermentação alcoólica, e o gás carbônico faz a massa crescer.' },
      { t: 'ataca o cacau', t2: 'cacau', k: 1, x: 'a vassoura-de-bruxa é doença de plantação.' },
      { t: 'produz aflatoxina no amendoim', t2: 'aflatoxina', k: 1, x: 'as aflatoxinas aparecem em amendoim e milho mal armazenados.' },
      { t: '<i>Penicillium</i> no queijo e na laranja', t2: 'queijo e laranja', k: 2, x: 'dá sabor ao roquefort e ao camembert, mas estraga frutas.' },
      { t: '<i>Aspergillus</i>', t2: '<i>Aspergillus</i>', k: 2, x: 'há tipos usados em alimentos fermentados e tipos que produzem aflatoxina.' }
    ],
    certo: c => '<b>Certo.</b> ' + c.x.charAt(0).toUpperCase() + c.x.slice(1),
    errado: (c, a) => `<b>Ainda não.</b> "${semTag(c.t)}" não é só "${a.t}". Pense no que ele faz e onde.`,
    fim: () => '<b>Pronto.</b> Um mesmo grupo de fungos pode ser útil num lugar e praga em outro. Cogumelo do mato não se come: há venenosos parecidos com os comestíveis.',
    dica: 'Toque num cartão e depois no lugar certo.'
  });
  function drawCartas(B, S, A, n, ch3) {
    const cols = NAR ? 2 : 4, ch = NAR ? 36 : 42, g = NAR ? 6 : 8, rows = Math.ceil(n / cols), ay0 = A.y0 + rows * (ch + g) + 4;
    B.draw(S, { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y1 }, {
      cols, cartaH: ch, slotH: NAR ? 30 : 34,
      alvoRect: k => { const rw = (A.w - 2 * 10) / 3; return { x: A.x0 + k * (rw + 10), y: ay0, w: rw, h: A.y1 - ay0 }; }
    });
    cap(B.msg(S) || ch3);
  }

  def('fungi', 'fungos', {
    t: 'O corpo e a vida dos fungos', s: 'hifas, esporos e digestão do lado de fora', c: FUN,
    loc: S => ({ pao: 'Bolor no pão', cogu: 'O cogumelo e o micélio', fng: 'Fungo ou não?', bom: 'Bom ou ruim?' })[S.modo] || '',
    locNota: S => S.modo === 'fng' || S.modo === 'bom' ? '' : NOTA,
    ctlVis: S => S.modo === 'pao' || S.modo === 'cogu',
    alt: 'o crescimento de bolor numa fatia de pão úmido (esporos, hifas, micélio e esporângios pretos), com a ponta de uma hifa ampliada liberando enzimas e absorvendo moléculas pequenas, um cogumelo cortado ao meio com o micélio escondido sob a terra e dois jogos de cartões: fungo ou não, e útil ou prejudicial',
    still: 13.5,
    extra: [modo('pao', 'Bolor no pão'), modo('cogu', 'O cogumelo e o micélio'), modo('fng', 'Fungo ou não?'), modo('bom', 'Bom ou ruim?')],
    init(S) { S.modo = 'pao'; FUNGO.zera(S); BOM.zera(S); },
    d: TXT.F1.d + '<p>Em "Bolor no pão" e "O cogumelo e o micélio", veja o corpo do fungo. Nos jogos, leve cada cartão ao lugar certo.</p>',
    enem: TXT.F1.enem,
    links: [LKT, ['Levedura em 3D', '../celula/index.html#celula_levedura'], ['Fermentação na Bioenergética', '../bioenergetica/index.html']],
    tap(x, y, S) { if (S.modo === 'fng') FUNGO.tap(x, y, S); else if (S.modo === 'bom') BOM.tap(x, y, S); },
    grab(x, y, S) { return S.modo === 'fng' ? FUNGO.grab(x, y, S) : S.modo === 'bom' && BOM.grab(x, y, S); },
    grabMove(x, y, S) { (S.modo === 'fng' ? FUNGO : BOM).grabMove(x, y, S); },
    grabEnd(x, y, S) { (S.modo === 'fng' ? FUNGO : BOM).grabEnd(x, y, S); },
    draw(t, S) {
      const A = area();
      if (S.modo === 'pao') drawPao(t, S, A); else if (S.modo === 'cogu') drawCogu(t, S, A);
      else if (S.modo === 'fng') drawCartas(FUNGO, S, A, 8, 'Fungo ou não? Leve cada cartão a "fungo", "não é fungo" ou "associação".');
      else drawCartas(BOM, S, A, 8, 'Bom ou ruim? Leve cada fungo ao que ele é para nós.');
    }
  });

  // =====================================================================================
  // F2 LIQUENS E MICORRIZAS
  // =====================================================================================
  const LIQ = '#C7B27A', ALGA = '#4CC25D', AGUA = '#7CC4FF', ACUC = '#FFB347';
  function drawLiquen(t, S, A) {
    const lw = Math.min(A.w - 20, 640), x0 = A.cx - lw / 2, top = A.y0 + 34, hh = A.h - 34 - (NAR ? 70 : 62), rock = hh * .2, bandA = (hh - rock) / 3;
    // chuva e luz acima
    for (let i = 0; i < 5; i++) { const f = fr(t * .3 + i * .21), px = x0 + lw * (.12 + i * .19); circ(px, lerp(A.y0 + 6, top, f), 2.6, rgba(AGUA, .9 - f * .5)); }
    // córtex
    rr(x0, top, lw, bandA, 8, rgba('#8A7A55', .55), '#C7B27A', 1.6); for (let i = 0; i < 26; i++) line(x0 + 6 + i * (lw - 12) / 25, top + 4, x0 + 6 + i * (lw - 12) / 25, top + bandA - 4, 'rgba(237,227,208,.5)', 1.4);
    // camada de algas entre hifas
    const ya = top + bandA; rr(x0, ya, lw, bandA, 0, rgba('#5F7A4A', .35));
    const algs = []; for (let i = 0; i < (NAR ? 5 : 8); i++) algs.push([x0 + lw * (.14 + i * (NAR ? .18 : .105)), ya + bandA * (.35 + (i % 2) * .3)]);
    algs.forEach(([ax, ay], i) => { for (let k = -1; k <= 1; k += 2) line(ax - 2, ay, ax + k * lw * .05, ay + (i % 2 ? -1 : 1) * 8, HIFA, 1.4); circ(ax, ay, bandA * .24, rgba(ALGA, .75), '#1E6B33', 1.4); circ(ax, ay, bandA * .08, '#BFF0C6'); });
    // medula: hifas soltas
    const ym = ya + bandA; rr(x0, ym, lw, bandA, 0, rgba('#8A7A55', .22));
    const R0 = rng(11); for (let i = 0; i < 22; i++) { const px = x0 + R0() * lw, py = ym + R0() * bandA * .3; line(px, py, px + (R0() - .5) * 60, py + bandA * (.35 + R0() * .4), rgba(HIFA, .6), 1.2); }
    line(x0, ym, x0 + lw, ym, 'rgba(199,178,122,.5)', 1);
    // rocha
    const yr = ym + bandA; rr(x0 - 6, yr, lw + 12, rock + 6, 6, '#5A5F6E', '#848A9B', 1.6); const R1 = rng(2); for (let i = 0; i < 30; i++) circ(x0 + R1() * lw, yr + 5 + R1() * rock, 1 + R1() * 2.4, 'rgba(180,186,200,.35)');
    for (let i = 0; i < 9; i++) line(x0 + lw * (.06 + i * .11), ym + bandA * .5, x0 + lw * (.06 + i * .11) + (i % 2 ? 4 : -4), yr + 3, HIFA, 1.2);
    // fluxos: água e sais descem pelo fungo até a alga; açúcar vai da alga para o fungo
    algs.forEach(([ax, ay], i) => {
      if (i % 2) return; const f = fr(t * .35 + i * .13), f2 = fr(t * .35 + i * .13 + .5);
      arrow(ax - bandA * .6, ay - bandA * .55, ax - bandA * .3, ay - bandA * .2, AGUA, 1.8); circ(lerp(ax - bandA * .6, ax - bandA * .3, f), lerp(ay - bandA * .55, ay - bandA * .2, f), 2.8, '#fff');
      arrow(ax + bandA * .28, ay + bandA * .1, ax + bandA * .7, ay + bandA * .5, ACUC, 1.8); circ(lerp(ax + bandA * .28, ax + bandA * .7, f2), lerp(ay + bandA * .1, ay + bandA * .5, f2), 2.8, '#fff');
    });
    if (LB) {
      lab(x0 + lw * .55, top + bandA * .5, x0 + lw * .78, top - 14, 'fungo (hifas): proteção');
      lab(algs[1][0], algs[1][1], x0 + lw * .08, ya + bandA * .1 - 6, 'alga ou cianobactéria');
      lab(x0 + lw * .2, yr + rock * .5, x0 + lw * .5, yr + rock + 22, 'rocha nua');
      tx('água e sais: do fungo para a alga', x0 + 6, A.y1 - 34, { s: 12, a: 'left', c: AGUA }); tx('açúcar: da alga para o fungo', x0 + 6, A.y1 - 16, { s: 12, a: 'left', c: ACUC });
    }
    cap('<b>Líquen</b> = fungo + alga (ou cianobactéria), em <b>mutualismo</b>: o fungo dá proteção, água e sais; a alga faz fotossíntese e dá matéria orgânica.');
  }
  function drawSuc(t, S, A) {
    const T = t % 24, gy = A.y0 + A.h * .55, E = ['rocha nua', 'liquens', 'musgos', 'capim', 'arbusto'];
    const solo = ss(seg(T, 4, 20)) * A.h * .11, fase = T < 3 ? 0 : T < 7 ? 1 : T < 11 ? 2 : T < 15 ? 3 : 4;
    rr(A.x0, gy, A.w, A.y1 - gy - 30, 6, '#5A5F6E', '#848A9B', 1.6); const R1 = rng(2); for (let i = 0; i < 60; i++) circ(A.x0 + R1() * A.w, gy + 4 + R1() * (A.y1 - gy - 40), 1 + R1() * 2.4, 'rgba(180,186,200,.3)');
    if (solo > 1) { X.fillStyle = 'rgba(110,76,44,.92)'; X.fillRect(A.x0 + 1, gy - solo, A.w - 2, solo); }
    const top = gy - solo, R = rng(6);
    const li = ss(seg(T, 2.5, 5)); for (let i = 0; i < 16; i++) { const px = A.x0 + 20 + R() * (A.w - 40), c = ['#C9D07A', '#E6A04B', '#9CC0B0'][i % 3]; if (li > 0) ell(px, top - 1, 8 * li, 3.4 * li, 0, c, null); }
    const mu = ss(seg(T, 7, 10)); for (let i = 0; i < 22; i++) { const px = A.x0 + 14 + R() * (A.w - 28); if (mu > 0) for (let k = 0; k < 4; k++) line(px + k * 2.4, top, px + k * 2.4 + (k - 1.5) * 1.5, top - (6 + k % 2 * 3) * mu, '#3FA45A', 1.8); }
    const ca = ss(seg(T, 11, 14)); for (let i = 0; i < 30; i++) { const px = A.x0 + 10 + R() * (A.w - 20), hgt = (14 + R() * 12) * ca; if (ca > 0) line(px, top, px + (R() - .5) * 8, top - hgt, '#7FC63B', 1.8); }
    const ar = ss(seg(T, 15, 20)); if (ar > 0) { const bx = A.x0 + A.w * .72, hgt = A.h * .22 * ar; line(bx, top, bx, top - hgt, '#7A5A38', 4); circ(bx, top - hgt, A.h * .09 * ar, rgba('#2E8B4A', .9), '#1E6B33', 1.6); circ(bx - A.h * .05 * ar, top - hgt + A.h * .04 * ar, A.h * .06 * ar, rgba('#3FA45A', .9)); }
    E.forEach((s, i) => tx(s, A.x0 + A.w * (i + .5) / 5, A.y1 - 14, { s: NAR ? 12 : 13, w: i === fase ? 700 : 500, c: i === fase ? C.amber : C.dim }));
    if (LB) tx('solo novo', A.x0 + 10, gy - solo - 12 > A.y0 ? gy + 14 : gy + 14, { s: 12, a: 'left', c: solo > 8 ? '#E0B68C' : C.dim });
    cap(['A rocha nua: nenhum ser vivo, quase nenhum solo.', 'Os <b>liquens pioneiros</b> chegam e liberam ácidos que desgastam a rocha.', 'Ao morrer, deixam matéria orgânica: forma-se uma camada fina de <b>solo</b>, onde crescem musgos.', 'Com mais solo, chega o capim.', 'Por fim, o solo sustenta um arbusto: é a <b>sucessão ecológica primária</b>.'][fase]);
  }
  const TREES = [[.05, .5, 0], [.13, .22, 0], [.19, .72, 0], [.31, .4, 1], [.42, .68, 2], [.53, .28, 3], [.65, .7, 4], [.76, .36, 6], [.87, .62, 8], [.95, .26, 10]];
  const LTIP = ['#C9D07A', '#E6A04B', '#9CC0B0', '#D98BB5'];
  const Q1 = ['na zona rural', 'no centro industrial', 'no meio do caminho'], Q2 = ['os liquens precisam de sombra, e o centro é ensolarado', 'há mais plantas disputando espaço no centro', 'os liquens são muito sensíveis ao dióxido de enxofre (SO₂) do ar'];
  function drawAr(t, S, A) {
    const mh = NAR ? A.h * .32 : A.h * .46, mx = A.x0, my = A.y0, mw = A.w;
    X.save(); X.beginPath(); X.roundRect(mx, my, mw, mh, 10); X.clip();
    const gr = X.createLinearGradient(mx, 0, mx + mw, 0); gr.addColorStop(0, 'rgba(120,96,80,.85)'); gr.addColorStop(.45, 'rgba(110,120,90,.6)'); gr.addColorStop(1, 'rgba(60,130,70,.55)'); X.fillStyle = gr; X.fillRect(mx, my, mw, mh);
    // fábricas e fumaça no centro; casas no meio; campo à direita
    for (let i = 0; i < 3; i++) { const fx = mx + 14 + i * 34; rr(fx, my + mh - 34 - i % 2 * 8, 26, 34 + i % 2 * 8, 2, '#3A3F52', '#1B1F2E', 1.2); rr(fx + 16, my + mh - 52 - i % 2 * 8, 6, 20, 1, '#3A3F52'); for (let k = 0; k < 4; k++) { const f = fr(t * .2 + i * .3 + k * .25); circ(fx + 19 + f * 24, my + mh - 56 - i % 2 * 8 - f * 36, 5 + f * 9, rgba('#9A9AA6', .5 * (1 - f))); } }
    for (let i = 0; i < 3; i++) { const hx = mx + mw * (.42 + i * .07); rr(hx, my + mh - 22, 16, 22, 2, '#59607A'); shape([[hx - 2, my + mh - 22], [hx + 8, my + mh - 32], [hx + 18, my + mh - 22]], '#7A4B3A'); }
    X.restore(); rr(mx, my, mw, mh, 10, null, C.line, 1);
    if (LB) { tx('centro industrial', mx + 8, my + 14, { s: 12, a: 'left', c: C.txt }); tx('zona rural', mx + mw - 8, my + 14, { s: 12, a: 'right', c: C.txt }); }
    S.vis = S.vis || {};
    TREES.forEach(([u, v, n], i) => {
      const px = mx + 18 + u * (mw - 36), py = my + mh * .28 + v * mh * .55, sel = S.sel === i;
      line(px, py + 10, px, py + 20, '#6B4A2B', 4); circ(px, py, 11, '#2F7A45', sel ? C.amber : '#1B4D2B', sel ? 3 : 1.4); if (S.vis[i]) circ(px, py, 3, '#fff'); hitC(px, py + 4, 17, 't' + i);
    });
    const iy = my + mh + 10, vis = Object.keys(S.vis).length;
    // árvore escolhida: tronco com os tipos de líquen
    const ih = NAR ? 54 : A.h * .26;
    if (S.sel != null) {
      const n = TREES[S.sel][2];
      rr(A.x0, iy, 38, ih, 6, '#6B4A2B', '#3E2A16', 1.4); for (let k = 0; k < n; k++) { const px = A.x0 + 6 + (k * 11) % 26, py = iy + 6 + (k * 17) % (ih - 14); ell(px, py, 6 + (k % 3), 3 + (k % 2) * 2, k * .5, LTIP[k % 4], null); }
      mtx(`<b>Árvore ${S.sel + 1}</b>: ${n === 0 ? 'nenhum líquen no tronco' : n === 1 ? '1 tipo de líquen' : n + ' tipos de líquen'}`, A.x0 + 50, iy + 14, { s: 13, a: 'left', c: C.txt });
      mtx(vis < 5 ? `Toque em mais árvores (${vis} de 5 ou mais).` : 'Já dá para responder à pergunta.', A.x0 + 50, iy + 34, { s: 12, a: 'left', c: C.dim });
    } else mtx('Toque numa árvore para contar os tipos de líquen no tronco.', A.x0, iy + 14, { s: 13, a: 'left', c: C.dim });
    // pergunta
    if (vis >= 5) {
      const qy = iy + (NAR ? 60 : ih + 6), q1ok = S.q1 === 1;
      if (!q1ok) { mtx('Onde o ar é mais poluído?', A.x0, qy + 8, { s: 14, w: 600, f: FH, a: 'left', c: C.txt }); chips(S, Q1, A.x0, qy + 24, A.w, NAR ? 1 : 3, NAR ? 30 : 36, 'a', { cor: FUN }); }
      else if (S.q2 !== 1) { mtx('E por quê?', A.x0, qy + 8, { s: 14, w: 600, f: FH, a: 'left', c: C.txt }); chips(S, Q2, A.x0, qy + 24, A.w, NAR ? 1 : 3, NAR ? 38 : 44, 'b', { cor: FUN }); }
      else mtx('<b>Certo.</b> Liquens somem onde há muito SO₂: são bioindicadores do ar.', A.x0, qy + 14, { s: 14, a: 'left', c: C.ok });
    }
    cap(S.msg || 'Mapa de uma cidade <b>fictícia</b>, com dez árvores. Toque nelas e compare os tipos de líquen no tronco.');
  }
  function planta(x, y, h, folhas, c) {
    line(x, y, x, y - h, c, 3); const n = Math.max(1, Math.round(folhas)); for (let i = 0; i < n; i++) { const fy = y - h * (.25 + .7 * i / Math.max(1, n)), sd = i % 2 ? 1 : -1; ell(x + sd * h * .17, fy, h * .17, h * .06, sd * -.5, rgba(c, .8), '#1E6B33', 1.2); }
  }
  function drawMicor(t, S, A) {
    const w = S.v, k = ss(w / 12), pw = (A.w - 12) / 2, gy = A.y0 + A.h * .46, sh = A.y1 - gy;
    [[A.x0, false], [A.x0 + pw + 12, true]].forEach(([x, com]) => {
      panel(x, A.y0, pw, A.h); mtx(com ? '<b>com</b> micorriza' : '<b>sem</b> micorriza', x + pw / 2, A.y0 + 14, { s: NAR ? 12 : 14, f: FH, c: C.txt });
      rr(x + 6, gy, pw - 12, sh - 6, 6, 'rgba(110,76,44,.75)'); const R0 = rng(com ? 8 : 9); for (let i = 0; i < 18; i++) { const px = x + 14 + R0() * (pw - 28), py = gy + 8 + R0() * (sh - 24); circ(px, py, 2.4, '#F0D060'); }
      const cx = x + pw / 2, ph = A.h * (com ? lerp(.12, .36, k) : lerp(.12, .2, k));
      // raízes
      for (let i = -2; i <= 2; i++) line(cx, gy, cx + i * pw * .07, gy + sh * (.28 - Math.abs(i) * .03), '#C9A27A', 1.6);
      if (com) { const g = k; for (let i = 0; i < 12; i++) { const a = PI * (.1 + .8 * i / 11), l = pw * .42 * g * (.6 + (i % 3) * .2); line(cx + Math.cos(a) * 6 * (i % 2 ? 1 : -1), gy + sh * .22, cx + Math.cos(a) * l, gy + sh * .22 + Math.sin(a) * l * .8, rgba(HIFA, .8), 1.2); } if (LB && k > .3) tx('hifas', cx + pw * .3, gy + sh * .72, { s: 12, c: HIFA }); if (k > .35) { const f = fr(t * .4); arrow(cx + 6, gy + sh * .15, cx + 22, gy + sh * .28, ACUC, 1.4); circ(lerp(cx + 6, cx + 22, f), lerp(gy + sh * .15, gy + sh * .28, f), 2.4, '#fff'); } }
      planta(cx, gy, ph, 2 + k * (com ? 5 : 2), '#3FA45A');
    });
    if (LB) { tx('P = fósforo (pontos amarelos)', A.x0 + 10, A.y1 - 12, { s: 12, a: 'left', c: '#F0D060' }); tx('solo pobre em fósforo', A.x1 - 10, A.y1 - 12, { s: 12, a: 'right', c: C.dim }); }
    cap(w < 1 ? 'Duas mudas iguais em solo pobre em fósforo. Avance as semanas.' : w < 7 ? 'As hifas da micorriza se espalham pelo solo como uma extensão da raiz.' : 'A muda <b>com micorriza</b> absorve mais água e <b>fósforo</b> e cresce mais; em troca, entrega <b>açúcares</b> ao fungo.');
  }
  def('fungi', 'liquens', {
    t: 'Liquens e micorrizas', s: 'fungos que vivem em parceria', c: FUN,
    loc: S => ({ liquen: 'Líquen em corte', suc: 'Da rocha ao solo', ar: 'Mapa do ar', micor: 'Micorriza liga e desliga' })[S.modo] || '',
    locNota: S => S.modo === 'ar' ? 'Cidade fictícia' : NOTA,
    alt: 'um líquen em corte, com hifas, algas e setas de água e açúcar, a sucessão de rocha nua a arbusto, um mapa de cidade fictícia com dez árvores e o número de tipos de líquen em cada tronco, e duas mudas em solo pobre em fósforo, uma com micorriza e outra sem',
    still: 10,
    ctl: { l: 'Semanas', min: 0, max: 12, step: 1, v: 0, f: v => v + (v === 1 ? ' semana' : ' semanas'), rate: () => 1 }, stillV: 12,
    ctlVis: S => S.modo === 'micor',
    extra: [modo('liquen', 'Líquen em corte'), modo('suc', 'Rocha vira solo'), modo('ar', 'Mapa do ar'), modo('micor', 'Micorriza liga e desliga')],
    init(S) { S.modo = 'liquen'; S.sel = null; S.vis = {}; S.q1 = S.q2 = null; S.msg = null; },
    d: TXT.F2.d + '<p>Veja o líquen em corte e a sucessão da rocha ao solo. No "Mapa do ar", conte os liquens em pelo menos cinco árvores e responda. Em "Micorriza liga e desliga", avance as semanas.</p>',
    enem: TXT.F2.enem,
    links: [['Relações ecológicas e sucessão na Ecologia', '../ecologia/index.html'], ['Taxonomia: fungo não é planta', '../taxonomia/index.html#sistemas/reinos']],
    tap(x, y, S) {
      if (!toque(S) || S.modo !== 'ar') return; const h = hitAt(x, y); if (typeof h !== 'string') return;
      if (h[0] === 't') { S.sel = +h.slice(1); S.vis[S.sel] = 1; S.msg = null; }
      else if (h[0] === 'a') { const i = +h.slice(1); if (i === 1) { S.q1 = 1; S.msg = '<b>Certo.</b> No centro, onde o ar tem mais poluição, quase não há liquens. Agora, o motivo.'; S.flash = null; } else { S.flash = { i, t: performance.now(), k: 'a' }; S.msg = '<b>Ainda não.</b> Compare quantos tipos de líquen há em cada lugar: onde o ar é pior, há menos.'; } }
      else if (h[0] === 'b') { const i = +h.slice(1); if (i === 2) { S.q2 = 1; S.msg = null; S.flash = null; } else { S.flash = { i, t: performance.now(), k: 'b' }; S.msg = '<b>Ainda não.</b> Os liquens absorvem tudo o que vem pelo ar e pela chuva, sem cutícula de proteção. Qual poluente os afeta?'; } }
    },
    draw(t, S) {
      const A = area();
      if (S.modo === 'liquen') drawLiquen(t, S, A); else if (S.modo === 'suc') drawSuc(t, S, A); else if (S.modo === 'ar') drawAr(t, S, A); else drawMicor(t, S, A);
    }
  });
}
