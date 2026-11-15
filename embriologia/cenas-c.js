/* LAB · Módulo Embriologia. Cenas C (Prometeu): blastóporo (protostômios e deuterostômios), folhetos e derivados,
   nêurula e organogênese. Fonte científica: docs/revisao-biologia/embriologia-roteiro.md (Taxon, D5 a D8).
   Usa a API do motor.js (def, tx, circ, ell, rr, line, lab, cap, area, C...). Código e textos da equipe. */
'use strict';
{
  // cores do contrato do módulo (C.ecto, C.meso, C.endo...), com reserva caso o motor ainda não as tenha
  const RES = { ecto: '#4D8DFF', meso: '#F2555A', endo: '#F2D24B', vitelo: '#F2B35A', ovo: '#F4C9B0', sangue: '#E0404A' };
  const K = n => (C && C[n]) || RES[n];
  const NOTO = () => (C && C.noto) || '#3FBF6A';   // notocorda em verde (convenção de Gilbert e Moore)
  const FUNDO = '#0B0F1C', TERAT = '#FF9A3C';
  // quebra de texto: usa a do motor se houver
  function quebra(s, x, y, maxw, o = {}) {
    if (typeof wrapTx === 'function') return wrapTx(s, x, y, maxw, o);
    const sz = o.s || 13, w = o.w || 400, lh = o.lh || sz + 4, out = []; let cur = '';
    for (const p of s.split(' ')) { const t = cur ? cur + ' ' + p : p; if (cur && tw(t, sz, w) > maxw) { out.push(cur); cur = p; } else cur = t; }
    if (cur) out.push(cur); out.forEach((l, i) => tx(l, x, y + i * lh, Object.assign({ bg: false }, o, { s: sz }))); return out.length * lh;
  }
  // a faixa toca sozinha uma vez ao abrir (de min a max em dur segundos); se o aluno mexer, ele manda
  function auto(S, t, ctl, dur) {
    if (S.vSet === undefined) { S.vSet = S.v; S.toq = false; }
    if (S.v !== S.vSet) S.toq = true;
    if (!S.toq && !S.paused && t <= dur + .05) {
      const v = cl(Math.round(lerp(ctl.min, ctl.max, ss(t / dur)) / ctl.step) * ctl.step, ctl.min, ctl.max);
      if (v !== S.v) {
        S.v = S.vSet = v;
        const r = $('ctlR'), vv = $('ctlV');
        if (r) { r.value = v; r.setAttribute('aria-valuetext', ctl.f(v)); }
        if (vv) vv.textContent = ctl.f(v);
      }
    }
    return S.v;
  }
  // pastilhas de exemplos centradas em linhas; devolve a altura usada
  function chips(list, cx, y, maxw, c) {
    const ws = list.map(s => tw(s, 12, 700) + 12), rows = [[]]; let acc = 0;
    ws.forEach((w, i) => { if (acc && acc + w + 6 > maxw) { rows.push([]); acc = 0; } rows[rows.length - 1].push(i); acc += w + 6; });
    rows.forEach((r, j) => { const tot = r.reduce((a, i) => a + ws[i] + 6, -6); let x = cx - tot / 2; for (const i of r) { tok(x + ws[i] / 2, y + j * 26, list[i], c); x += ws[i] + 6; } });
    return rows.length * 26;
  }
  const ordn = n => n + 'ª';
  const semF = d => Math.ceil(d / 7), semD = d => Math.ceil((d + 14) / 7);   // semana após a fecundação e pela DUM

  // =====================================================================================
  // D5 PROTOSTÔMIOS E DEUTEROSTÔMIOS
  // =====================================================================================
  // gástrula em corte longitudinal: o blastóporo fica à esquerda; o arquêntero cresce até abrir do outro lado
  function gastrula(cx, cy, rx, ry, p) {
    const e = ry * .2, m = ry * .13, gh = ry * .66, ew = gh * .26;
    ell(cx, cy, rx, ry, 0, K('ecto'), 'rgba(11,15,28,.7)', 1.5);
    ell(cx, cy, rx - e, ry - e, 0, K('meso'));
    ell(cx, cy, rx - e - m, ry - e - m, 0, '#1C1830');   // cavidade do corpo (celoma), revestida pela mesoderme
    const f = ss(seg(p, 0, .85)), xL = cx - rx - gh, xR = p < .85 ? lerp(cx - rx * .15, cx + rx - e * 1.3, f) : lerp(cx + rx - e * 1.3, cx + rx + gh, seg(p, .85, 1));
    X.save(); ell(cx, cy, rx, ry, 0); X.clip();
    rr(xL, cy - gh / 2 - m, xR - xL + m, gh + m * 2, gh / 2 + m, K('meso'));   // mesoderme da parede do intestino: celoma verdadeiro
    rr(xL, cy - gh / 2, xR - xL, gh, gh / 2, K('endo'));
    rr(xL, cy - gh / 2 + ew, xR - xL - ew, gh - ew * 2, (gh - ew * 2) / 2, FUNDO);
    X.restore();
    return { left: cx - rx, right: cx + rx, open2: p >= .9, xR };
  }
  const ctlD5 = { l: 'Desenvolvimento', min: 0, max: 100, step: 1, v: 100, f: v => v < 10 ? 'blastóporo aberto' : v < 90 ? 'arquêntero crescendo' : 'tubo completo', rate: () => 1 };
  def('desenvolvimento', 'blastoporo', {
    t: 'Protostômios e deuterostômios', s: 'o blastóporo vira boca ou ânus', c: K('endo'), loc: 'Gástrulas em corte, lado a lado', still: 99,
    ctl: ctlD5,
    alt: 'Duas gástrulas em corte longitudinal. Com a faixa, o tubo digestório se completa: no protostômio o blastóporo vira boca e o ânus abre depois; no deuterostômio o blastóporo vira ânus e a boca abre depois',
    d: `<p>O destino do <b>blastóporo</b>, a abertura do arquêntero que surge na <a href="#desenvolvimento/gastrula">gástrula</a>, divide os animais triblásticos em dois grandes grupos.</p>
<p>Nos <b>protostômios</b> (do grego "boca primeiro"), o blastóporo dá origem à <b>boca</b>, e o ânus, quando existe, se forma depois: platelmintos (que têm tubo digestório incompleto, só com boca), nematódeos, anelídeos, moluscos e artrópodes. Nos <b>deuterostômios</b> ("boca em segundo"), o blastóporo dá origem ao <b>ânus</b>, e a boca se abre depois, do outro lado: <b>equinodermos</b> e <b>cordados</b>, incluindo nós. Por isso a estrela-do-mar é, em termos de desenvolvimento, mais parente nossa do que a minhoca ou o inseto.</p>
<p>Os folhetos também separam os grupos. Esponjas não têm folhetos verdadeiros. <b>Diblásticos</b> (cnidários: águas-vivas, corais, hidras) têm só ectoderme e endoderme. Os demais são <b>triblásticos</b>, com mesoderme. Nos triblásticos, a cavidade do corpo pode faltar (<b>acelomados</b>, como os platelmintos), ser revestida só em parte pela mesoderme (<b>pseudocelomados</b>, como os nematódeos) ou ser toda revestida por ela, o <b>celoma</b> verdadeiro (anelídeos, moluscos, artrópodes, equinodermos e cordados).</p>
<p>Mova a faixa para completar o tubo digestório e ver onde surgem a boca e o ânus.</p>`,
    kv: [['Protostômios', 'blastóporo vira boca'], ['Deuterostômios', 'blastóporo vira ânus'], ['Deuterostômios', 'equinodermos e cordados'], ['Diblásticos', 'cnidários (sem mesoderme)'], ['Triblásticos', 'de platelmintos em diante']],
    enem: 'Blastóporo vira <b>boca</b> nos protostômios (moluscos, anelídeos, artrópodes) e <b>ânus</b> nos deuterostômios (<b>equinodermos e cordados</b>). É argumento de parentesco evolutivo: equinodermos estão mais próximos dos cordados do que dos outros invertebrados. Cnidários são <b>diblásticos</b>; a partir dos platelmintos, os animais são <b>triblásticos</b>.',
    links: [['Gástrula', '#desenvolvimento/gastrula'], ['O que cada folheto forma', '#desenvolvimento/folhetos']],
    draw(t, S) {
      const A = area(), p = auto(S, t, ctlD5, 6) / 100;
      const P = [
        { k: 'Protostômio', sub: 'boca primeiro', g: 'anelídeos, moluscos, artrópodes', ex: ['minhoca', 'caracol', 'inseto'], a1: 'boca', a2: 'ânus' },
        { k: 'Deuterostômio', sub: 'boca em segundo', g: 'equinodermos e cordados', ex: ['estrela-do-mar', 'peixe', 'ser humano'], a1: 'ânus', a2: 'boca' }];
      P.forEach((q, i) => {
        const pw = NAR ? A.w : (A.w - 24) / 2, ph = NAR ? (A.h - 12) / 2 : A.h, px = NAR ? A.x0 : A.x0 + i * (pw + 24), py = NAR ? A.y0 + i * (ph + 12) : A.y0;
        rr(px, py, pw, ph, 12, 'rgba(19,26,43,.55)', C.line, 1);
        const cx = px + pw / 2;
        if (NAR) {
          tx(q.k, px + 12, py + 16, { f: FH, s: 15, w: 600, a: 'left', c: C.txt });
          tx(q.sub, px + pw - 12, py + 16, { s: 12, a: 'right', c: C.dim, bg: false });
        } else {
          tx(q.k, cx, py + 22, { f: FH, s: 17, w: 600, c: C.txt });
          tx(q.sub + ': ' + q.g, cx, py + 44, { s: 13, c: C.dim, bg: false });
        }
        const top = py + (NAR ? 34 : 64), bot = py + ph - (NAR ? 34 : 66), cy = (top + bot) / 2 + (NAR ? 0 : -6);
        const rx = Math.min(pw * (NAR ? .34 : .3), (bot - top) * .5 / .58 * .8), ry = rx * .58;
        const g = gastrula(cx, cy, rx, ry, p);
        // aberturas: nome embaixo de cada ponta
        const yN = cy + ry + (NAR ? 13 : 18);
        const fim = p >= .9;
        if (NAR) tx(fim ? q.a1 + ' (era o blastóporo)' : 'blastóporo', px + 12, yN, { s: 13, w: 700, c: C.txt, a: 'left' });
        else {
          tx(fim ? q.a1 : 'blastóporo', g.left + rx * .12, yN, { s: 13, w: 700, c: C.txt, a: 'center' });
          tx(fim ? 'era o blastóporo' : '1ª abertura', g.left + rx * .12, yN + 17, { s: 12, c: C.dim, bg: false });
        }
        if (g.open2) {
          const al = seg(p, .9, 1); X.save(); X.globalAlpha = al;
          tx(q.a2, NAR ? px + pw - 12 : g.right - rx * .12, yN, { s: 13, w: 700, c: C.txt, a: NAR ? 'right' : 'center' });
          if (!NAR) tx('abre depois', g.right - rx * .12, yN + 17, { s: 12, c: C.dim, bg: false });
          X.restore();
        }
        if (!NAR && i === 0) {
          lab(cx - rx * .55, cy - ry * .75, cx - rx - 12, cy - ry * .95, 'ectoderme');
          lab(cx + rx * .45, cy + ry * .62, cx + rx + 12, cy + ry * .95, 'mesoderme');
        }
        if (!NAR && i === 1) lab(Math.min(g.xR - 20, cx + rx * .2), cy - ry * .28, cx + rx + 12, cy - ry * .95, 'endoderme');
        if (NAR) {
          tx(q.ex.join(', '), cx, py + ph - 14, { s: 12, c: C.dim, bg: false });
        } else chips(q.ex, cx, py + ph - 30, pw - 24, '#C9D1E3');
      });
      cap(p < .1 ? 'O blastóporo é a primeira abertura do arquêntero, o intestino primitivo. Mova a faixa e veja o que ele vira'
        : p < .9 ? 'O arquêntero cresce até o outro lado do embrião, onde vai abrir a segunda abertura'
          : '<b>Protostômio</b>: o blastóporo virou boca e o ânus abriu depois. <b>Deuterostômio</b>: o blastóporo virou ânus e a boca abriu depois');
    }
  });

  // =====================================================================================
  // D6 O QUE CADA FOLHETO FORMA
  // =====================================================================================
  {
    const FOL = ['ecto', 'meso', 'endo', 'misto'];
    const NOMES = ['Ectoderme', 'Mesoderme', 'Endoderme', 'Órgão misto'];
    const LISTA = [
      '<b>Ectoderme</b> (camada externa): epiderme, pelos, unhas e glândulas da pele; esmalte dos dentes; encéfalo, medula espinal e nervos; retina e cristalino',
      '<b>Mesoderme</b> (camada do meio): músculos, ossos e cartilagens, derme, coração, vasos e sangue, rins, gônadas e tecidos conjuntivos',
      '<b>Endoderme</b> (camada interna): revestimento do tubo digestório e do sistema respiratório, fígado, pâncreas, tireoide e epitélio da bexiga',
      '<b>Órgão misto</b>: o estômago tem epitélio de origem endodérmica e músculos de origem mesodérmica. A pele tem epiderme ectodérmica e derme mesodérmica'];
    // silhueta humana em coordenadas de 0 a 1 (altura); x centrado em 0
    function corpo(ox, oy, s, pele) {
      const P = (x, y) => [ox + x * s, oy + y * s];
      const f = pele ? rgba(K('ecto'), .28) : 'rgba(157,169,196,.10)', st = pele ? K('ecto') : 'rgba(157,169,196,.45)', lw = pele ? 3 : 1.5;
      const membro = (x1, y1, x2, y2, w) => { const [a, b] = P(x1, y1), [c, d] = P(x2, y2); X.beginPath(); X.moveTo(a, b); X.lineTo(c, d); X.lineCap = 'round'; X.lineWidth = w * s; X.strokeStyle = st; X.stroke(); X.lineWidth = w * s - lw * 2; X.strokeStyle = pele ? '#22305A' : '#161C2E'; X.stroke(); X.strokeStyle = f; X.stroke(); X.lineCap = 'butt'; };
      membro(-.15, .22, -.23, .52, .065); membro(.15, .22, .23, .52, .065);
      membro(-.07, .56, -.09, .97, .085); membro(.07, .56, .09, .97, .085);
      const [nx, ny] = P(-.03, .14); rr(nx, ny, .06 * s, .07 * s, 4, '#161C2E', st, lw);
      const [tx0, ty0] = P(-.17, .18); rr(tx0, ty0, .34 * s, .4 * s, .07 * s, '#161C2E', st, lw); rr(tx0, ty0, .34 * s, .4 * s, .07 * s, f);
      const [hx0, hy0] = P(0, .085); ell(hx0, hy0, .065 * s, .078 * s, 0, '#161C2E', st, lw); ell(hx0, hy0, .065 * s, .078 * s, 0, f);
    }
    // órgãos: [folheto, nome, desenho]; o primeiro de cada folheto ganha rótulo antes
    const ORG = [
      ['endo', 'pulmões', (P, s, f, st) => { for (const k of [-1, 1]) { const [x, y] = P(k * .072, .29); ell(x, y, .052 * s, .075 * s, 0, f, st, 1.5); } return P(-.09, .27); }],
      ['meso', 'coração', (P, s, f, st, t) => { const [x, y] = P(.025, .3), b = 1 + .06 * Math.max(0, Math.sin(t * 7)); ell(x, y, .036 * s * b, .032 * s * b, -.5, f, st, 1.5); return [x, y]; }],
      ['endo', 'fígado', (P, s, f, st) => { const [x, y] = P(-.055, .39); ell(x, y, .085 * s, .036 * s, .15, f, st, 1.5); return [x - .04 * s, y]; }],
      ['misto', 'estômago', (P, s, f, st, t, sel) => { const [x, y] = P(.065, .395); if (sel === 'misto') { ell(x, y, .046 * s, .036 * s, -.3, rgba(K('meso'), .9), K('meso'), 1.5); ell(x, y, .03 * s, .021 * s, -.3, K('endo')); } else ell(x, y, .046 * s, .036 * s, -.3, f, st, 1.5); return [x, y]; }],
      ['endo', 'pâncreas', (P, s, f, st) => { const [x, y] = P(.0, .435); ell(x, y, .05 * s, .012 * s, -.1, f, st, 1.2); return [x - .03 * s, y]; }],
      ['endo', 'intestino', (P, s, f, st) => { const [x, y] = P(0, .5); X.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU * 2.2, r = (.025 + .045 * i / 40) * s; const px = x + Math.cos(a) * r * 1.4, py = y + Math.sin(a) * r * .7; i ? X.lineTo(px, py) : X.moveTo(px, py); } X.strokeStyle = f === 'transparent' ? st : f; X.lineWidth = Math.max(2, .012 * s); X.stroke(); return [x + .08 * s, y + .02 * s]; }],
      ['endo', 'tireoide', (P, s, f, st) => { const [x, y] = P(0, .175); ell(x, y, .024 * s, .011 * s, 0, f, st, 1.2); return [x, y]; }],
      ['meso', 'rins', (P, s, f, st) => { for (const k of [-1, 1]) { const [x, y] = P(k * .09, .45); ell(x, y, .018 * s, .03 * s, k * .2, f, st, 1.2); } return P(.09, .45); }],
      ['meso', 'ossos', (P, s, f, st, t, sel) => { const c = sel === 'meso' ? light(K('meso'), .25) : st, w = sel === 'meso' ? 3 : 1.2; for (const [a, b, c2, d] of [[-.08, .6, -.085, .76], [.08, .6, .085, .76], [-.087, .79, -.09, .95], [.087, .79, .09, .95], [-.16, .24, -.19, .37], [.16, .24, .19, .37]]) { const [x1, y1] = P(a, b), [x2, y2] = P(c2, d); line(x1, y1, x2, y2, c, w); } return P(-.087, .87); }],
      ['meso', 'vasos e sangue', (P, s, f, st, t, sel) => { const [x1, y1] = P(-.15, .23), [x2, y2] = P(-.225, .5), [x3, y3] = P(-.02, .27); const c = sel === 'meso' ? K('meso') : 'rgba(157,169,196,.25)', w = sel === 'meso' ? 2.2 : 1; line(x3, y3, x1, y1, c, w); line(x1, y1, x2, y2, c, w); return P(-.19, .37); }],
      ['meso', 'músculos', (P, s, f, st) => { for (const k of [-1, 1]) { const [x, y] = P(k * .077, .67); ell(x, y, .03 * s, .075 * s, 0, f, st, 1.2); } return P(.077, .67); }],
      ['ecto', 'encéfalo', (P, s, f, st) => { const [x, y] = P(0, .07); ell(x, y, .05 * s, .042 * s, 0, f, st, 1.5); return [x, y - .01 * s]; }],
      ['ecto', 'medula espinal', (P, s, f, st, t, sel) => { const [x1, y1] = P(0, .13), [x2, y2] = P(0, .55); line(x1, y1, x2, y2, sel === 'ecto' ? K('ecto') : st, sel === 'ecto' ? 4 : 1.2); for (const [a, b, c, d] of [[0, .24, -.17, .33], [0, .24, .17, .33], [0, .54, -.075, .78], [0, .54, .075, .78]]) { const [p1, q1] = P(a, b), [p2, q2] = P(c, d); line(p1, q1, p2, q2, sel === 'ecto' ? rgba(K('ecto'), .9) : 'rgba(157,169,196,.25)', sel === 'ecto' ? 1.8 : 1); } return P(0, .2); }],
      ['ecto', 'cristalino', (P, s, f, st) => { for (const k of [-1, 1]) { const [x, y] = P(k * .024, .1); circ(x, y, .009 * s, f, st, 1); } return P(.024, .1); }],
    ];
    const ctlD6 = { l: 'Folheto', min: 0, max: 3, step: 1, v: 0, f: v => NOMES[v], rate: () => 1 };
    def('desenvolvimento', 'folhetos', {
      t: 'O que cada folheto forma', s: 'ectoderme, mesoderme e endoderme', c: K('meso'), loc: 'Corte de embrião e corpo humano', still: 2,
      ctl: ctlD6,
      alt: 'Corte transversal de um embrião com as três camadas coloridas e a silhueta de um corpo humano. Ao escolher um folheto, os órgãos que vêm dele acendem com a mesma cor: pele e sistema nervoso em azul; músculos, ossos, coração e rins em vermelho; revestimento dos pulmões, fígado e intestino em amarelo',
      d: `<p><b>Cada folheto germinativo dá origem a um conjunto de tecidos e órgãos.</b> A <b>ectoderme</b>, a camada externa, forma a <b>epiderme</b> e seus anexos (pelos, unhas, glândulas sudoríparas e mamárias), o <b>esmalte dos dentes</b>, o cristalino e todo o <b>sistema nervoso</b>. A <b>mesoderme</b>, a do meio, forma os <b>músculos</b>, os <b>ossos</b> e as cartilagens, a derme, o <b>coração</b>, os vasos e o <b>sangue</b>, os <b>rins</b>, as <b>gônadas</b> e os tecidos conjuntivos. A <b>endoderme</b>, a interna, forma o <b>revestimento</b> (epitélio) do tubo digestório e do sistema respiratório, além do <b>fígado</b>, do <b>pâncreas</b>, da tireoide e do epitélio da bexiga.</p>
<p>Atenção: um órgão costuma ter tecidos de mais de um folheto. O estômago, por exemplo, tem epitélio de origem endodérmica e músculos de origem mesodérmica. A pele tem epiderme ectodérmica e derme mesodérmica.</p>
<p>Mova a faixa para escolher um folheto. Os órgãos que vêm dele acendem na silhueta com a mesma cor.</p>
<div class="tab"><table><thead><tr><th>Folheto</th><th>Forma</th></tr></thead><tbody>
<tr><td>Ectoderme</td><td>epiderme, pelos, unhas, glândulas da pele (sudoríparas, sebáceas, mamárias); esmalte dos dentes; encéfalo, medula espinal, nervos; retina e cristalino; hipófise; melanócitos e medula da adrenal (pela crista neural)</td></tr>
<tr><td>Mesoderme</td><td>músculos esquelético, liso e cardíaco; ossos e cartilagens; derme; coração, vasos e sangue; rins e ureteres; gônadas; córtex da adrenal; baço; revestimento das cavidades (pleura, peritônio)</td></tr>
<tr><td>Endoderme</td><td>epitélio do tubo digestório (esôfago ao reto) e do sistema respiratório (traqueia, brônquios, alvéolos); fígado; pâncreas; tireoide e paratireoides; timo; epitélio da bexiga e da uretra</td></tr>
</tbody></table></div>
<p class="nota">Desenho esquemático; posição e tamanho dos órgãos aproximados. Quadro baseado em Moore, cap. 5 e 6.</p>`,
      kv: [['Ectoderme', 'pele e sistema nervoso'], ['Mesoderme', 'ossos, músculos, sangue, coração, rins'], ['Endoderme', 'revestimento do tubo digestório e respiratório, fígado, pâncreas'], ['Pegadinha', 'sistema nervoso vem da ectoderme']],
      enem: 'Regra prática: <b>ectoderme</b> = "o que fica por fora e o que pensa" (pele e sistema nervoso); <b>mesoderme</b> = "o que sustenta, move e transporta" (ossos, músculos, sangue, coração, rins); <b>endoderme</b> = "o que reveste por dentro" o tubo digestório e o respiratório, mais fígado e pâncreas. Pegadinha clássica: o <b>sistema nervoso vem da ectoderme</b>, e não da mesoderme.',
      links: [['Nêurula', '#desenvolvimento/neurula'], ['Gástrula', '#desenvolvimento/gastrula']],
      draw(t, S) {
        const A = area(), sel = FOL[S.v | 0], cor = sel === 'misto' ? K('meso') : K(sel);
        // corte do embrião (ou do estômago, no órgão misto)
        const er = NAR ? Math.min(46, A.h * .16) : Math.min(A.w * .15, A.h * .3), ex = NAR ? A.x0 + er + 6 : A.x0 + A.w * .2, ey = NAR ? A.y0 + er + 4 : A.cy - 10;
        const on = k => sel === k ? 1 : .22;
        if (sel !== 'misto') {
          X.save(); X.globalAlpha = on('ecto'); circ(ex, ey, er, K('ecto'), 'rgba(11,15,28,.7)', 1.5); X.restore();
          circ(ex, ey, er * .84, FUNDO);
          X.save(); X.globalAlpha = on('meso'); circ(ex, ey + er * .1, er * .7, K('meso')); X.restore();
          circ(ex, ey + er * .1, er * .56, '#1C1830');
          X.save(); X.globalAlpha = on('meso'); circ(ex, ey + er * .28, er * .4, K('meso')); X.restore(); circ(ex, ey + er * .28, er * .36, '#1C1830');
          X.save(); X.globalAlpha = on('endo'); circ(ex, ey + er * .28, er * .32, K('endo')); X.restore();
          circ(ex, ey + er * .28, er * .17, FUNDO);
          X.save(); X.globalAlpha = on('ecto'); circ(ex, ey - er * .6, er * .16, K('ecto')); X.restore(); circ(ex, ey - er * .6, er * .06, FUNDO);
          circ(ex, ey - er * .3, er * .09, NOTO());
          if (!NAR) {
            tx('corte do embrião', ex, ey + er + 18, { s: 12, c: C.dim, bg: false });
            const yy = ey + er + 44; [['ecto', 'ectoderme'], ['meso', 'mesoderme'], ['endo', 'endoderme']].forEach(([k, n], i) => { const y = yy + i * 22; X.save(); X.globalAlpha = on(k) > .5 ? 1 : .45; circ(ex - 50, y, 6, K(k)); tx(n, ex - 38, y, { s: 13, w: sel === k ? 700 : 400, a: 'left', c: C.txt, bg: false }); X.restore(); });
          }
        } else {
          circ(ex, ey, er, K('meso'), 'rgba(11,15,28,.7)', 1.5);
          for (let i = 0; i < 3; i++) circ(ex, ey, er * (.92 - i * .1), null, 'rgba(11,15,28,.35)', 1);
          X.beginPath(); for (let i = 0; i <= 120; i++) { const a = i / 120 * TAU, r = er * (.52 + .06 * Math.sin(a * 9)); i ? X.lineTo(ex + Math.cos(a) * r, ey + Math.sin(a) * r) : X.moveTo(ex + Math.cos(a) * r, ey + Math.sin(a) * r); } X.closePath(); X.fillStyle = K('endo'); X.fill();
          X.beginPath(); for (let i = 0; i <= 120; i++) { const a = i / 120 * TAU, r = er * (.4 + .06 * Math.sin(a * 9)); i ? X.lineTo(ex + Math.cos(a) * r, ey + Math.sin(a) * r) : X.moveTo(ex + Math.cos(a) * r, ey + Math.sin(a) * r); } X.closePath(); X.fillStyle = FUNDO; X.fill();
          if (!NAR) {
            tx('estômago em corte', ex, ey + er + 18, { s: 12, c: C.dim, bg: false });
            circ(ex - 70, ey + er + 46, 6, K('endo')); tx('epitélio: endoderme', ex - 58, ey + er + 46, { s: 13, a: 'left', c: C.txt, bg: false });
            circ(ex - 70, ey + er + 68, 6, K('meso')); tx('músculo: mesoderme', ex - 58, ey + er + 68, { s: 13, a: 'left', c: C.txt, bg: false });
          } else {
            lab(ex, ey - er * .46, ex + er + 24, ey - er * .55, 'epitélio');
            lab(ex + er * .8, ey + er * .5, ex + er + 24, ey + er * .5, 'músculo');
          }
        }
        // silhueta
        const s = NAR ? Math.min(A.h - 8, (A.w - 2 * er - 20) * 1.9) : Math.min(A.h - 6, A.w * .62 * 1.6), ox = NAR ? A.x0 + 2 * er + 12 + (A.w - 2 * er - 12) / 2 : A.x0 + A.w * .64, oy = A.y0 + (A.h - s) / 2;
        const P = (x, y) => [ox + x * s, oy + y * s];
        corpo(ox, oy, s, sel === 'ecto');
        const pts = [];
        for (const [k, n, fn] of ORG) {
          const lit = k === sel || (sel === 'misto' && k === 'misto') || (sel === 'endo' && k === 'misto');
          const f = lit ? rgba(k === 'misto' ? K('endo') : K(k), .85) : 'transparent', st = lit ? (k === 'misto' ? K('endo') : K(k)) : 'rgba(157,169,196,.35)';
          const pt = fn(P, s, f, st, t, sel);
          if (lit || (sel === 'meso' && k === 'misto')) pts.push([pt, n]);
        }
        if (sel === 'meso') {   // músculo do estômago e derme também são mesodérmicos
          const [x, y] = P(.065, .395); ell(x, y, .046 * s, .036 * s, -.3, null, K('meso'), 3);
        }
        if (sel === 'ecto') pts.push([P(-.2, .45), 'pele (epiderme)']);
        // rótulos alternando lados
        // rótulos: lado e altura fixos por órgão (em unidades da silhueta), para não disputarem lugar
        const POS = { 'tireoide': [1, .15], 'pulmões': [-1, .24], 'fígado': [-1, .35], 'pâncreas': [-1, .46], 'estômago': [1, .37], 'intestino': [1, .5],
          'coração': [1, .26], 'rins': [-1, .47], 'ossos': [-1, .86], 'músculos': [1, .66], 'vasos e sangue': [-1, .32],
          'encéfalo': [1, .05], 'cristalino': [-1, .1], 'medula espinal': [1, .22], 'pele (epiderme)': [-1, .45] };
        const nomeDe = n => n === 'estômago' ? (sel === 'endo' ? 'epitélio do estômago' : sel === 'meso' ? 'músculo do estômago' : 'estômago')
          : (sel === 'endo' && !NAR && (n === 'pulmões' || n === 'intestino')) ? n + ' (revestimento)' : n;
        const ORDEM = ['coração', 'rins', 'ossos', 'músculos', 'vasos e sangue', 'pulmões', 'fígado', 'pâncreas', 'intestino', 'estômago', 'tireoide'];
        pts.sort((a, b) => (ORDEM.indexOf(a[1]) + 1 || 99) - (ORDEM.indexOf(b[1]) + 1 || 99));
        for (const [pt, n] of pts) { const q = POS[n] || [pt[0] < ox ? -1 : 1, (pt[1] - oy) / s]; lab(pt[0], pt[1], ox + q[0] * s * .3, oy + q[1] * s, nomeDe(n)); }
        if (!NAR) tx(NOMES[S.v | 0], ex, A.y0 + 14, { f: FH, s: 17, w: 600, c: cor });
        cap(LISTA[S.v | 0]);
      }
    });
  }

  // =====================================================================================
  // D7 NÊURULA
  // =====================================================================================
  {
    const ctlD7 = { l: 'Neurulação', min: 0, max: 100, step: 1, v: 100, f: v => v < 20 ? 'placa neural' : v < 50 ? 'sulco neural' : v < 80 ? 'pregas neurais' : 'tubo neural', rate: () => 1 };
    // corte transversal das costas do embrião: placa → sulco → pregas → tubo
    function corte(cx, y0, w, Lh, p, t, nar) {
      const T = Math.max(7, Lh * .18), r1 = Lh / PI, rn = Math.max(6, Lh * .12);
      const k = ss(seg(p, .05, .82)), fecha = seg(p, .78, .9), solta = seg(p, .86, 1);
      const yb = y0 + ss(k) * (T + 2 * r1 + 6) + solta * 6;
            const ecto = K('ecto'), placa = light(K('ecto'), .3);
      // notocorda: logo abaixo da placa
      const yn = yb + T / 2 + rn + 3, yEndo = yn + rn + T * .9 + 8;
      rr(cx - w / 2, yEndo, w, T, T / 2, K('endo'));   // endoderme (teto do intestino)
      // mesoderme: lâmina lateral, que perto do tubo se condensa em somitos
      let syR = 0; const som = seg(p, .4, .8), sw = lerp(r1 * 1.1, r1 * 1.25, som), sxo = r1 + T + 8 + sw / 2;
      for (const sd of [-1, 1]) {
        const sx = cx + sd * sxo, sy = lerp(yn, y0 + T + r1 + 6, som); syR = sy;
        rr(Math.min(sx + sd * sw / 2, cx + sd * w / 2), sy - T * .35, Math.abs(cx + sd * w / 2 - (sx + sd * sw / 2)), T * .7, T * .35, rgba(K('meso'), .8));
        rr(sx - sw / 2, sy - lerp(T * .6, sw * .45, som), sw, lerp(T * 1.2, sw * .9, som), lerp(T * .6, 8, som), K('meso'), 'rgba(11,15,28,.55)', 1);
      }
      circ(cx, yn, rn, NOTO(), 'rgba(11,15,28,.6)', 1.2);
      // placa neural (arco de curvatura constante que se enrola até virar círculo)
      const kk = Math.max(.0001, k), r = Lh / (PI * kk), pt = s => { const th = s * PI * kk; return [cx + r * Math.sin(th), yb - r * (1 - Math.cos(th))]; };
      const eL = pt(-1), eR = pt(1);
      // ectoderme da superfície
      X.lineCap = 'round'; X.lineJoin = 'round';
      if (fecha < 1) {
        for (const [sd, e] of [[-1, eL], [1, eR]]) { X.beginPath(); X.moveTo(cx + sd * w / 2, y0); X.quadraticCurveTo(lerp(cx + sd * w / 2, e[0], .7), y0, e[0] + sd * T * .3, e[1]); X.strokeStyle = ecto; X.lineWidth = T * .8; X.stroke(); }
      }
      if (fecha > 0) { X.save(); X.globalAlpha = fecha; line(cx - w / 2, y0, cx + w / 2, y0, ecto, T * .8); X.restore(); }
      // tubo / placa
      X.beginPath(); for (let i = 0; i <= 60; i++) { const q = pt(-1 + i / 30); i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1]); }
      X.strokeStyle = placa; X.lineWidth = T; X.stroke(); X.lineCap = 'butt';
      // crista neural: células nas bordas das pregas, que depois migram para os lados
      const nc = [];
      for (const sd of [-1, 1]) {
        const e = sd < 0 ? eL : eR;
        for (let j = 0; j < 4; j++) {
          const bx = e[0] + sd * (T * .4 + (j % 2) * 4), by = e[1] - T * .3 + (j >> 1) * 5;
          const mx = cx + sd * (r1 + T + 4 + j * 3), my = y0 + T + r1 * (.3 + j * .35) + 6;
          const x = lerp(bx, mx, solta), y = lerp(by, my, solta); circ(x, y, 3, '#C9E0FF', 'rgba(11,15,28,.6)', 1); nc.push([x, y]);
        }
      }
      return { T, r1, rn, yn, yb, yEndo, syR, eL, eR, nc, tubo: [cx, yb - r1], k, som, sxo };
    }
    // vista de cima: o tubo fecha como um zíper, do meio para as pontas; somitos se somam aos pares
    function cima(cx, cy, h, p) {
      const w = h * .34, z = seg(p, .55, 1), nS = Math.round(lerp(0, 9, seg(p, .35, 1)));
      ell(cx, cy, w / 2, h / 2, 0, 'rgba(244,201,176,.12)', 'rgba(157,169,196,.5)', 1.5);
      const top = cy - h * .42, bot = cy + h * .42, gap = y => { const u = (y - top) / (bot - top); return lerp(w * .17, w * .08, u) + (u < .25 ? (.25 - u) * w * .5 : 0); };
      const mid = lerp(top, bot, .45), half = (bot - top) * .55, c0 = Math.max(top + 4, mid - z * half), c1 = Math.min(bot - 4, mid + z * half);
      const fold = sd => { X.beginPath(); for (let i = 0; i <= 50; i++) { const y = lerp(top, bot, i / 50), closed = y >= c0 && y <= c1 && z > 0, gg = closed ? 2 : gap(y) * (1 - ss(seg(p, .1, .6)) * .6); const x = cx + sd * gg; i ? X.lineTo(x, y) : X.moveTo(x, y); } X.strokeStyle = light(K('ecto'), .3); X.lineWidth = 4; X.lineJoin = 'round'; X.stroke(); };
      // placa neural (área entre as pregas)
      X.beginPath(); for (let i = 0; i <= 50; i++) { const y = lerp(top, bot, i / 50); X.lineTo(cx - gap(y) - 3, y); } for (let i = 50; i >= 0; i--) { const y = lerp(top, bot, i / 50); X.lineTo(cx + gap(y) + 3, y); } X.closePath(); X.fillStyle = rgba(K('ecto'), .22); X.fill();
      fold(-1); fold(1);
      if (z > 0) line(cx, c0, cx, c1, K('ecto'), 5);
      const ves = seg(p, .9, 1);   // vesículas do encéfalo na ponta da frente
      if (ves > 0) for (let i = 0; i < 3; i++) ell(cx, top + h * (.04 + i * .06), w * (.11 - i * .015) * ves, h * .03, 0, K('ecto'), light(K('ecto'), .3), 1.5);
      for (let i = 0; i < nS; i++) { const y = lerp(mid - h * .12, mid + h * .3, i / 8); for (const sd of [-1, 1]) rr(cx + sd * (w * .2) - (sd < 0 ? w * .12 : 0), y - h * .018, w * .12, h * .036, 3, K('meso')); }
      return { top, bot, mid, c0, c1, z, nS, w };
    }
    def('desenvolvimento', 'neurula', {
      t: 'Nêurula', s: 'o tubo neural se fecha', c: K('ecto'), loc: 'Corte transversal das costas do embrião', still: 99,
      ctl: ctlD7,
      alt: 'Corte transversal das costas do embrião: a ectoderme azul engrossa em placa neural sobre a notocorda verde, dobra-se em sulco, as pregas sobem e se fecham no tubo neural; a crista neural se solta e a mesoderme vermelha forma somitos dos lados. Ao lado, vista de cima com o tubo fechando como um zíper',
      d: `<p>Na <b>neurulação</b>, a <b>notocorda</b> induz a ectoderme que fica logo acima dela a engrossar e formar a <b>placa neural</b>. A placa se dobra para dentro e forma o <b>sulco neural</b>; as bordas, as <b>pregas neurais</b>, sobem e se encontram, fechando o <b>tubo neural</b>, que se separa da ectoderme da superfície. Da parte da frente do tubo surge o <b>encéfalo</b>; do resto, a <b>medula espinal</b>.</p>
<p>Células da borda das pregas, a <b>crista neural</b>, migram e formam nervos e gânglios, os melanócitos da pele e a medula da adrenal. Ao mesmo tempo, a mesoderme ao lado do tubo se divide em blocos pareados, os <b>somitos</b>, que vão formar vértebras, músculos esqueléticos e derme. A notocorda regride; no adulto, restos dela formam o centro dos discos entre as vértebras.</p>
<p>No ser humano, a neurulação ocorre entre a <b>3ª e a 4ª semana após a fecundação</b> (cerca da 5ª e da 6ª semana de gestação, contada pela DUM, a data da última menstruação). O tubo termina de se fechar por volta do <b>28º dia após a fecundação</b>, muitas vezes antes de a mulher saber que está grávida. Se ele não se fecha direito, surgem defeitos do tubo neural, como a <b>espinha bífida</b> e a <b>anencefalia</b>. O risco cai bastante com <b>ácido fólico</b> (folato, uma vitamina do complexo B) tomado antes da gravidez e no começo dela.</p>
<p>Mova a faixa para dobrar a placa neural até fechar o tubo. Os folhetos estão no tópico <a href="#desenvolvimento/folhetos">O que cada folheto forma</a>.</p>`,
      kv: [['Tubo neural', 'vem da ectoderme'], ['Quem induz', 'a notocorda'], ['Somitos', 'vértebras, músculos esqueléticos, derme'], ['Crista neural', 'nervos, gânglios, melanócitos'], ['Fecha no ser humano', 'cerca do 28º dia após a fecundação'], ['Prevenção de defeitos', 'ácido fólico antes e no início da gestação']],
      enem: 'Nêurula = formação do <b>tubo neural</b> a partir da <b>ectoderme</b>, induzida pela <b>notocorda</b>. Os cordados têm tubo nervoso <b>dorsal</b>; nos anelídeos e artrópodes, o cordão nervoso é <b>ventral</b>. Liga-se à saúde: o <b>ácido fólico</b> antes e no início da gestação previne defeitos do tubo neural, e por isso a farinha de trigo e de milho é enriquecida com ele no Brasil.',
      links: [['O que cada folheto forma', '#desenvolvimento/folhetos'], ['Organogênese', '#desenvolvimento/organogenese']],
      draw(t, S) {
        const A = area(), p = auto(S, t, ctlD7, 8) / 100;
        // corte (esquerda ou em cima) e vista de cima (direita ou embaixo)
        const cw = NAR ? A.w : A.w * .66, Lh = NAR ? Math.min(A.w * .21, A.h * .2) : Math.min(cw * .17, A.h * .3), ccx = A.x0 + cw / 2, w = Math.min(cw * .96, Lh * 6.5);
        const y0 = A.y0 + (NAR ? 18 : 30) + Lh / PI * 1.2;
        const R = corte(ccx, y0, w, Lh, p, t, NAR), yB = R.yEndo + R.T / 2 + (NAR ? 26 : 34);
        lab(R.tubo[0], p > .8 ? R.tubo[1] : (R.eL[1] + R.yb) / 2, ccx - w * .3, y0 - R.r1 - 30, p < .2 ? 'placa neural' : p < .5 ? 'sulco neural' : p < .8 ? 'pregas neurais' : 'tubo neural');
        lab(R.nc[4][0], R.nc[4][1], ccx + w * .22, y0 - R.r1 - 30, 'crista neural');
        lab(ccx, R.yn, ccx - w * .2, yB, 'notocorda');
        if (R.som > .3) lab(ccx + R.sxo, R.syR, ccx + w * .14, yB, 'somito');
        if (!NAR) { lab(ccx - w * .44, y0, ccx - w * .47, y0 + 46, 'ectoderme'); lab(ccx + w * .42, R.yEndo + R.T / 2, ccx + w * .36, yB, 'endoderme'); }
        // dia no ser humano, com as duas contagens
        const dia = Math.round(lerp(18, 28, p)), yD = yB + (NAR ? 30 : 40);
        if (NAR) {
          tx(`ser humano: cerca do dia ${dia} após a fecundação`, ccx, yD, { s: 12, w: 600, c: C.txt, bg: false });
          tx(`(${ordn(semF(dia))} semana; ${ordn(semD(dia))} de gestação pela DUM)`, ccx, yD + 17, { s: 12, c: C.dim, bg: false });
        } else {
          tx(`Ser humano: cerca do dia ${dia} após a fecundação (${ordn(semF(dia))} semana; ${ordn(semD(dia))} semana de gestação, pela DUM)`, ccx, yD, { s: 13, c: C.dim, bg: false });
        }
        // vista de cima
        const vh = NAR ? Math.min(A.y1 - (yD + 30) - 4, A.w * .9) : Math.min(A.h - 80, (A.w - cw) * 2.2), vx = NAR ? A.x0 + A.w * .3 : A.x0 + cw + (A.w - cw) * .42, vy = NAR ? A.y1 - vh / 2 - 2 : A.y0 + 44 + vh / 2;
        if (vh > 90) {
          const V = cima(vx, vy, vh, p);
          if (!NAR) tx('vista de cima', vx, vy + vh / 2 + 16, { s: 12, c: C.dim, bg: false });
          if (p > .9) { tx('encéfalo', vx + V.w * .62, V.top + vh * .06, { s: 12, w: 600, c: C.txt, a: 'left' }); tx('medula espinal', vx + V.w * .62, V.mid + vh * .18, { s: 12, w: 600, c: C.txt, a: 'left' }); }
          else if (V.z > 0) tx('fecha como zíper', vx + V.w * .62, V.mid, { s: 12, c: C.dim, a: 'left', bg: false });
          if (V.nS) tx(`${V.nS} pares de somitos`, vx + V.w * .62, V.mid + vh * .36, { s: 12, c: C.dim, a: 'left', bg: false });
          tx('cabeça', vx - V.w * .62, V.top + 4, { s: 12, c: C.dim, a: 'right', bg: false }); tx('cauda', vx - V.w * .62, V.bot - 4, { s: 12, c: C.dim, a: 'right', bg: false });
        }
        cap(p < .2 ? 'A notocorda (verde) induz a ectoderme logo acima a engrossar: é a <b>placa neural</b>'
          : p < .5 ? 'A placa se dobra para dentro e forma o <b>sulco neural</b>. Dos lados, a mesoderme começa a formar os somitos'
            : p < .8 ? 'As <b>pregas neurais</b> sobem e se aproximam. Nas bordas delas estão as células da crista neural'
              : 'O <b>tubo neural</b> fechou e se separou da ectoderme da superfície. A crista neural migra; os somitos ficam dos lados do tubo');
      }
    });
  }

  // =====================================================================================
  // D8 ORGANOGÊNESE
  // =====================================================================================
  {
    const diaDe = v => Math.round(22 + (v - 4) / 4 * 34);                     // faixa 4 a 8 → dia 22 a 56 após a fecundação
    const MM = [[22, 3], [28, 4], [35, 8], [42, 13], [49, 17], [56, 30]];      // comprimento (mm), Moore cap. 6
    const mmDe = d => { for (let i = 1; i < MM.length; i++) if (d <= MM[i][0]) return lerp(MM[i - 1][1], MM[i][1], (d - MM[i - 1][0]) / (MM[i][0] - MM[i - 1][0])); return 30; };
    const MARCOS = [[22, 'coração começa a bater'], [26, 'brotos dos braços'], [28, 'brotos das pernas'], [30, 'olhos e orelhas se esboçam'], [42, 'dedos começam a aparecer'], [56, 'dedos separados; órgãos esboçados']];
    const ctlD8 = { l: 'Semana', min: 4, max: 8, step: .25, v: 4, f: v => `${ordn(semF(diaDe(v)))} semana (dia ${diaDe(v)})`, rate: () => 1 };
    // embrião humano em perfil, esquemático (desenho próprio); s = escala em px
    function embriao(ox, oy, s, d, t) {
      const g = seg(d, 22, 56), pele = K('ovo'), borda = dark(pele, .45);
      const Rb = s * lerp(.36, .3, g), a0 = 1.5 * PI + lerp(.25, .05, g), uEnd = lerp(1, .8, seg(d, 40, 56));
      const a1 = .5 * PI - lerp(1.15, .25, g);
      const Pc = u => { const a = lerp(a0, a1, u); return [ox + Rb * Math.cos(a), oy + Rb * Math.sin(a), a]; };
      const rB = u => s * lerp(.16, .02, Math.pow(u, 1.6)) * lerp(.85, 1.05, g);
      const [hx0, hy0] = Pc(0), hr = s * lerp(.2, .27, g), hx = hx0 + s * lerp(.08, .1, g), hy = hy0 + s * lerp(.05, .02, g);
      // membros: broto → remo → placa da mão com raios → dedos separados
      const membro = (u, d0, comp) => {
        if (d < d0) return null;
        const [x, y, a] = Pc(u), r = rB(u), nx = -Math.cos(a), ny = -Math.sin(a), bx = x + nx * r * .55, by = y + ny * r * .55;
        const L = s * comp * lerp(.14, 1, seg(d, d0, 56)), dir = Math.atan2(ny, nx) + (u < .5 ? -.15 : .55), ex = bx + Math.cos(dir) * L, ey = by + Math.sin(dir) * L, wd = s * lerp(.065, .05, g);
        const pr = d >= 36 ? wd * lerp(1.1, 1.4, seg(d, 36, 46)) : 0;
        return { bx, by, ex, ey, wd, pr, dir };
      };
      const MB = [membro(.36, 26, .36), membro(.7, 28, .3)];
      // duas passadas: contorno (um pouco maior, escuro) e preenchimento
      for (const k of [2, 0]) {
        const c = k ? borda : pele;
        for (let i = 0; i <= 80; i++) { const u = i / 80 * uEnd, [x, y] = Pc(u); circ(x, y, rB(u) + k, c); }
        circ(hx, hy, hr + k, c);
        X.lineCap = 'round';
        for (const m of MB) if (m) {
          line(m.bx, m.by, m.ex, m.ey, c, m.wd * 2 + k * 2);
          if (m.pr) circ(m.ex, m.ey, m.pr + k, c);
          if (d >= 50) for (let i = -2; i <= 2; i++) { const aa = m.dir + i * .36, sep = seg(d, 50, 56), q = m.pr * (1.1 + .4 * sep); line(m.ex, m.ey, m.ex + Math.cos(aa) * q, m.ey + Math.sin(aa) * q, c, m.pr * .42 + k * 2); }
        }
        X.lineCap = 'butt';
      }
      // raios dos dedos (placa da mão, antes de os dedos se separarem)
      for (const m of MB) if (m && d >= 42 && d < 50) for (let i = -2; i <= 2; i++) { const aa = m.dir + i * .32; line(m.ex, m.ey, m.ex + Math.cos(aa) * m.pr * .95, m.ey + Math.sin(aa) * m.pr * .95, dark(pele, .3), 1.2); }
      // somitos nas costas (somem com o crescimento)
      const sa = 1 - seg(d, 35, 50);
      if (sa > 0) for (let i = 0; i < 16; i++) { const u = .12 + i / 16 * .7 * uEnd, [x, y, a] = Pc(u), r = rB(u); circ(x + Math.cos(a) * r * .72, y + Math.sin(a) * r * .72, Math.max(1.5, r * .16), rgba(K('meso'), .55 * sa)); }
      // arcos faríngeos (somem até a 7ª semana)
      const fa = 1 - seg(d, 38, 49);
      let arcos = null;
      if (fa > 0) for (let i = 0; i < 3; i++) {
        const u = .1 + i * .045, [x, y, a] = Pc(u), r = rB(u), nx = -Math.cos(a), ny = -Math.sin(a);   // sulcos na face ventral do pescoço
        const qx = x + nx * r * .78, qy = y + ny * r * .78, L = r * .32;
        line(qx - nx * L, qy - ny * L, qx + nx * L * .35, qy + ny * L * .35, rgba(dark(pele, .3), .95 * fa), 2.2);
        if (i === 1) arcos = [qx, qy];
      }
      const out = { arcos: fa > .5 ? arcos : null, coracao: null, braco: MB[0] && [MB[0].ex, MB[0].ey], perna: MB[1] && [MB[1].ex, MB[1].ey], olho: null, orelha: null, hx, hy, hr };
      if (d >= 28) { const ex = hx + hr * .45, ey = hy + hr * .05, ea = seg(d, 28, 34); circ(ex, ey, hr * .17, rgba(dark(pele, .5), ea), dark(pele, .6), 1.2); if (d >= 40) circ(ex, ey, hr * .1, '#1A1020'); out.olho = [ex, ey]; }
      if (d >= 30) { const ox2 = hx - hr * .05, oy2 = hy + hr * .35; X.beginPath(); X.arc(ox2, oy2, hr * .14, -1.2, 2.2); X.strokeStyle = dark(pele, .5); X.lineWidth = 2; X.stroke(); out.orelha = [ox2, oy2]; }
      // coração: saliência na frente do corpo, logo abaixo da cabeça, batendo
      { const [x, y, a] = Pc(.27), r = rB(.27), cx = x - Math.cos(a) * r * .95, cy = y - Math.sin(a) * r * .95, b = 1 + .1 * Math.max(0, Math.sin(t * TAU * 1.6)), k = lerp(.5, .32, g); ell(cx, cy, r * k * b, r * k * .88 * b, 0, C.sangueF || K('sangue'), dark(C.sangueF || K('sangue'), .4), 1.5); out.coracao = [cx, cy]; }
      return out;
    }
    def('desenvolvimento', 'organogenese', {
      t: 'Organogênese', s: 'os órgãos se formam', c: K('meso'), loc: 'Embrião humano em perfil, da 4ª à 8ª semana', still: 2,
      ctl: ctlD8,
      alt: 'Embrião humano em perfil, desenho esquemático, crescendo da 4ª à 8ª semana após a fecundação: coração batendo, brotos dos membros, olhos, orelhas e dedos aparecem; uma régua mostra o tamanho e uma barra marca o período mais sensível a teratógenos, da 3ª à 8ª semana',
      d: `<p>Depois da nêurula, os folhetos se diferenciam e formam os órgãos: é a <b>organogênese</b>. O embrião se dobra e ganha a forma de um tubo dentro de outro tubo. O coração surge como um tubo que se dobra e começa a bater no ser humano por volta do <b>22º dia após a fecundação</b> (6ª semana de gestação, pela DUM); aparecem os brotos dos braços e das pernas, os olhos, os arcos faríngeos (que darão partes do rosto e do pescoço).</p>
<p>No ser humano, a organogênese ocupa da <b>4ª à 8ª semana após a fecundação</b> (cerca da 6ª à 10ª semana de gestação, pela DUM): ao fim da 8ª, todos os órgãos principais estão esboçados e o embrião mede cerca de 3&nbsp;cm. Daí em diante, ele passa a se chamar <b>feto</b>, e o resto da gestação é sobretudo crescimento e amadurecimento (calendário completo em <a href="#humano/semanas">Semana a semana</a>).</p>
<p>Por isso, o período da 3ª à 8ª semana após a fecundação é o mais sensível a agentes que causam malformações, os <b>teratógenos</b>: álcool, alguns medicamentos (como a talidomida, que causou falta ou encurtamento de membros), radiação e infecções como a rubéola e o <b>vírus zika</b>, ligado à microcefalia na epidemia brasileira de 2015 e 2016. Contra o zika, a prevenção é o repelente e o combate ao mosquito <i>Aedes aegypti</i>.</p>
<p>Mova a faixa para passar da 4ª à 8ª semana.</p>
<p class="nota">Desenho esquemático; proporções aproximadas. Idades contadas desde a fecundação, como no Moore; a contagem do pré-natal (pela DUM) soma cerca de 2 semanas. Tamanhos: Moore, cap. 6.</p>`,
      kv: [['Período', '4ª à 8ª semana após a fecundação'], ['Coração bate', 'cerca do 22º dia'], ['Fim da 8ª semana', 'cerca de 3&nbsp;cm; vira feto'], ['Mais sensível a teratógenos', '3ª à 8ª semana'], ['Teratógenos', 'álcool, talidomida, radiação, rubéola, zika']],
      enem: 'O ENEM liga a organogênese a <b>saúde pública</b>: o embrião é mais vulnerável nas <b>primeiras 8 semanas</b>, quando os órgãos se formam (calendário em <a href="#humano/semanas">Semana a semana</a>). Álcool, cigarro, drogas, medicamentos sem orientação e infecções (rubéola, zika, toxoplasmose) podem causar malformações. Por isso o pré-natal deve começar cedo, e a vacina contra rubéola é feita <b>antes</b> da gravidez.',
      links: [['Semana a semana', '#humano/semanas'], ['Nêurula', '#desenvolvimento/neurula']],
      draw(t, S) {
        const A = area(), d = diaDe(S.v), mm = mmDe(d);
        // linha do tempo embaixo: semanas 1 a 9, com a faixa dos teratógenos (3 a 8)
        const tlH = NAR ? 70 : 78, tl = { x0: A.x0 + (NAR ? 6 : 20), x1: A.x1 - (NAR ? 6 : 20), y: A.y1 - tlH + 26 };
        const fx = dd => lerp(tl.x0, tl.x1, cl((dd - 0) / 63, 0, 1));
        rr(fx(14), tl.y - 16, fx(56) - fx(14), 10, 4, rgba(TERAT, .85));
        tx(NAR ? 'mais sensível a teratógenos' : 'período mais sensível a teratógenos (3ª à 8ª semana)', (fx(14) + fx(56)) / 2, tl.y - 28, { s: 12, w: 600, c: TERAT });
        line(tl.x0, tl.y, tl.x1, tl.y, C.line, 2);
        for (let w = 0; w <= 9; w++) { const x = fx(w * 7); line(x, tl.y - 4, x, tl.y + 4, C.line, 1.5); }
        for (let w = 1; w <= 9; w++) if (!NAR || w % 2) tx(String(w), fx(w * 7 - 3.5), tl.y + 14, { s: 12, f: FD, c: C.dim, bg: false });
        tx(NAR ? 'semana após a fecundação' : 'semana após a fecundação (pela DUM, some cerca de 2)', (tl.x0 + tl.x1) / 2, tl.y + 32, { s: 12, c: C.dim, bg: false });
        marker(fx(d), tl.y, K('meso'));
        // embrião
        const top = A.y0 + (NAR ? 8 : 16), botE = tl.y - 44, eh = botE - top;
        const s = Math.min(eh * .95, NAR ? A.w * .75 : A.w * .42), ox = NAR ? A.x0 + A.w * .5 : A.x0 + A.w * .36, oy = top + eh * .54;
        const E = embriao(ox, oy, s, d, t);
        lab(E.coracao[0], E.coracao[1], E.coracao[0] + s * .45, E.coracao[1] + s * .05, 'coração');
        if (E.braco) lab(E.braco[0], E.braco[1], E.braco[0] + s * .45, E.braco[1] + (NAR ? 44 : 14), d >= 42 ? 'mão' : 'broto do braço');
        if (E.perna) lab(E.perna[0], E.perna[1], E.perna[0] + s * .4, E.perna[1] + 30, d >= 42 ? 'pé' : 'broto da perna');
        if (E.olho) lab(E.olho[0], E.olho[1], E.olho[0] + s * .4, E.olho[1] - 26, 'olho');
        if (E.arcos) lab(E.arcos[0], E.arcos[1], NAR ? E.arcos[0] - s * .6 : E.arcos[0] + s * .5, NAR ? E.arcos[1] + 30 : E.arcos[1] - 4, 'arcos faríngeos');
        if (E.orelha) lab(E.orelha[0], E.orelha[1], E.orelha[0] - s * .5, E.orelha[1] - 30, 'orelha');
        // painel de dados e marcos (computador) ou resumo curto (celular)
        if (!NAR) {
          const px = A.x0 + A.w * .7, pw = A.w * .3 - 4;
          tx(`dia ${d} após a fecundação`, px, top + 8, { f: FH, s: 17, w: 600, a: 'left', c: C.txt });
          tx(`${ordn(semF(d))} semana; ${ordn(semD(d))} de gestação pela DUM`, px, top + 32, { s: 13, a: 'left', c: C.dim, bg: false });
          // régua de 0 a 3 cm
          const ry = top + 66; tx(`comprimento: cerca de ${nbr(mm < 10 ? Math.round(mm) : Math.round(mm), 0)} mm`, px, ry, { s: 13, w: 600, a: 'left', c: C.txt, bg: false });
          const rx0 = px, rw = Math.min(pw - 10, 220); rr(rx0, ry + 14, rw, 10, 3, 'rgba(91,108,153,.25)'); rr(rx0, ry + 14, rw * mm / 30, 10, 3, K('ovo'));
          for (let c = 0; c <= 3; c++) { line(rx0 + rw * c / 3, ry + 26, rx0 + rw * c / 3, ry + 31, C.dim, 1); tx(c + ' cm', rx0 + rw * c / 3, ry + 42, { s: 12, f: FD, c: C.dim, bg: false }); }
          let y = ry + 76;
          for (const [d0, s0] of MARCOS) { const on = d >= d0; circ(px + 6, y, 5, on ? K('meso') : null, on ? null : C.line, 1.5); y += quebra(s0, px + 18, y, pw - 22, { s: 13, a: 'left', c: on ? C.txt : C.dim, w: on ? 600 : 400 }) + 6; }
        } else {
          tx(`dia ${d}: cerca de ${Math.round(mm)} mm`, A.x0 + 4, top + 4, { s: 13, w: 600, a: 'left', c: C.txt });
          tx(`${ordn(semD(d))} semana pela DUM`, A.x1 - 4, top + 4, { s: 12, a: 'right', c: C.dim, bg: false });
        }
        const atual = MARCOS.filter(m => d >= m[0]).pop();
        cap(`Dia ${d} após a fecundação (${ordn(semD(d))} semana pela DUM): ${atual ? atual[1] : ''}${d >= 56 ? '. Daqui em diante, ele se chama <b>feto</b>' : ''}`);
      }
    });
  }
}
