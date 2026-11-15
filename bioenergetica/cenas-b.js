/* LAB · Módulo 08 Bioenergética. Cenas: fotossíntese, fatores limitantes, relação com a respiração. Código e textos da equipe. */
'use strict';
const LUZ = { l: 'Luz', min: 0, max: 100, step: 5, v: 80, f: v => v + ' %', rate: v => v / 100 };

// =====================================================================================
// FOTOSSÍNTESE
// =====================================================================================
def('foto', 'geral', {
  t: 'Visão geral da fotossíntese', s: 'equação e origem do O₂', c: C.cloro, loc: 'Cloroplasto', still: 3, ctl: LUZ,
  alt: 'No cloroplasto, a fase clara nos tilacoides usa luz e água e libera oxigênio; o ciclo de Calvin no estroma usa gás carbônico e produz açúcar',
  d: `<p><b>A fotossíntese usa a energia da luz para produzir açúcar a partir de CO₂ e água, liberando O₂.</b> Em plantas e algas, ela acontece nos cloroplastos; nas cianobactérias, em membranas internas da própria célula.</p>
<span class="eq">6 CO₂ + 12 H₂O + luz → C₆H₁₂O₆ + 6 O₂ + 6 H₂O</span>
<p>São duas etapas ligadas. Na <b>fase clara</b>, nas membranas dos tilacoides, a luz é usada para quebrar a água e produzir ATP e NADPH. No <b>ciclo de Calvin</b>, no estroma, esse ATP e esse NADPH são gastos para transformar CO₂ em açúcar.</p>
<p><b>Todo o O₂ liberado vem da água, não do CO₂.</b> Isso foi demonstrado com água marcada com o isótopo ¹⁸O: o oxigênio marcado apareceu no O₂. Por isso a equação completa traz 12 H₂O de um lado e 6 do outro. A versão simplificada (6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂) também é aceita.</p>`,
  kv: [['Onde', 'cloroplasto'], ['Fase clara', 'tilacoides: produz ATP, NADPH e O₂'], ['Ciclo de Calvin', 'estroma: fixa o CO₂ em açúcar'], ['Pigmento principal', 'clorofila <i>a</i>: absorve azul e vermelho, reflete verde'], ['Quem faz', 'plantas, algas e cianobactérias']],
  enem: 'Pontos clássicos: o O₂ vem da fotólise da água; a fase clara depende diretamente da luz, e o ciclo de Calvin depende dos produtos dela; a fotossíntese transforma energia luminosa em energia química e é a porta de entrada da energia nas cadeias alimentares.',
  links: [LK.cloro, LK.origemC],
  init(S) { S.g = S.v / 100; },
  draw(t, S) {
    const A = area(), v = S.v / 100; S.g += (v - S.g) * Math.min(1, S.dt * 1.5); const g = S.g, on = cl(v * 4, 0, 1);
    const cx = A.cx, cy = A.y0 + A.h * .52, rx = Math.min(A.w * (NAR ? .48 : .36), A.h * .9), ry = Math.min(A.h * (NAR ? .26 : .34), rx * .62);
    const G = cloro(cx, cy, rx, ry, { grana: [[-.62, .02], [-.36, -.22], [-.32, .3]], gw: .19, n: NAR ? 4 : 5 });
    const gp = [cx - rx * .42, cy], kp = [cx + rx * .42, cy], kR = Math.min(ry * .36, rx * .2);
    ring(kp[0], kp[1], kR, C.cloro, 3, 2.5);
    tx('fase clara', gp[0], cy + ry * .68, { w: 600 }); tx(NAR ? 'Calvin' : 'ciclo de Calvin', kp[0], kp[1], { w: 600, s: 12 });
    tx('estroma', cx, cy + ry * .78, { c: C.dim });
    // luz
    for (let i = 0; i < 3; i++) photon(gp[0] - rx * .25 + i * rx * .2 - 30, A.y0 + 6, gp[0] - rx * .2 + i * rx * .18, cy - ry * .62, t + i, on * .9);
    tx('luz', gp[0] - rx * .25 - 34 + rx * .2, A.y0 + 10, { c: C.luz, w: 600, a: 'left' });
    // trocas internas
    qarrow(gp[0] + rx * .14, cy - ry * .2, cx, cy - ry * .62, kp[0] - kR - 4, kp[1] - kR * .5, rgba(C.atp, .5), 1.5, [4, 4]);
    qarrow(kp[0] - kR - 4, kp[1] + kR * .5, cx, cy + ry * .62, gp[0] + rx * .14, cy + ry * .2, 'rgba(201,207,220,.4)', 1.5, [4, 4]);
    if (on > 0) {
      for (let i = 0; i < 2; i++) { const f = fr(t * .16 + i / 2), [x, y] = qpt(gp[0] + rx * .14, cy - ry * .2, cx, cy - ry * .62, kp[0] - kR - 4, kp[1] - kR * .5, f); tok(x, y, i ? 'NADPH' : 'ATP', i ? C.nad : C.atp, { a: Math.min(1, Math.sin(f * PI) * 2.5) }); }
      for (let i = 0; i < 2; i++) { const f = fr(t * .16 + i / 2 + .25), [x, y] = qpt(kp[0] - kR - 4, kp[1] + kR * .5, cx, cy + ry * .62, gp[0] + rx * .14, cy + ry * .2, f); tok(x, y, i ? 'NADP⁺' : 'ADP', '#C9CFDC', { a: Math.min(1, Math.sin(f * PI) * 2.5) }); }
      const b = cy + ry, tp = cy - ry;
      fly([[gp[0] - rx * .2, A.y1 - 4], [gp[0] - rx * .1, b - ry * .45]], fr(t * .14), 'H₂O', C.agua);
      fly([[gp[0] - rx * .3, tp + ry * .5], [cx - rx * (NAR ? .86 : 1.05), A.y0 + (NAR ? 32 : 20)]], fr(t * .14 + .5), 'O₂', C.o2);
      fly([[kp[0] + rx * .3, A.y0 + 8], [kp[0] + 4, kp[1] - kR]], fr(t * .14 + .3), 'CO₂', C.co2);
      fly([[kp[0] + 4, kp[1] + kR], [kp[0] + rx * .3, A.y1 - 4]], fr(t * .14 + .8), 'açúcar', C.glic);
    }
    lab(G[1].x, G[1].y - G[1].h / 2, G[1].x + 24, cy - ry - 18, 'granum (pilha de tilacoides)'); lab(cx + rx * .93, cy - ry * .25, cx + rx * .7, cy - ry - 18, 'envelope');
    const eq = `<span class="q">6 CO₂ + 12 <b style="color:${light(C.agua, .35)}">H₂O</b> + luz → C₆H₁₂O₆ + 6 <b style="color:${light(C.agua, .35)}">O₂</b> + 6 H₂O</span>`;
    cap(v === 0 ? 'No escuro, a fase clara para; sem ATP e NADPH, o ciclo de Calvin também para' : eq + '<br>o O₂ liberado vem da água');
  }
});

def('foto', 'clara', {
  t: 'Fase clara', s: 'fotossistemas, fotólise da água, ATP e NADPH', c: C.cloro, loc: 'Membrana do tilacoide', still: 3,
  ctl: { l: 'Intensidade da luz', min: 0, max: 100, step: 5, v: 80, f: v => v + ' %', rate: v => v / 100 },
  alt: 'A luz atinge os fotossistemas; a água é quebrada e libera oxigênio; elétrons percorrem a membrana, prótons se acumulam dentro do tilacoide e voltam pela ATP sintase',
  d: `<p><b>A fase clara transforma energia da luz em energia química (ATP e NADPH) e libera O₂.</b> Ela acontece na membrana dos tilacoides, onde ficam os <b>fotossistemas</b>, conjuntos de proteínas e clorofila que captam a luz.</p>
<p>A luz excita a clorofila do <b>fotossistema II</b>, que perde elétrons. Para repô-los, uma enzima quebra a água (<b>fotólise</b>): saem elétrons, H⁺ e O₂. Os elétrons seguem por uma cadeia transportadora até o <b>fotossistema I</b>, recebem um novo impulso de luz e terminam no NADP⁺, que vira <b>NADPH</b>.</p>
<p>No caminho, H⁺ são bombeados do estroma para dentro do tilacoide. Somados aos H⁺ que vieram da água, eles formam um gradiente. Quando voltam ao estroma pela ATP sintase, forma-se ATP (<b>fotofosforilação</b>). É a mesma quimiosmose da mitocôndria, movida a luz.</p>`,
  kv: [['Onde', 'membrana dos tilacoides'], ['Entra', 'luz, H₂O, NADP⁺, ADP + Pᵢ'], ['Sai', 'O₂, NADPH e ATP'], ['Os H⁺ se acumulam', 'no interior (lúmen) do tilacoide'], ['Outros nomes', 'etapa fotoquímica; reações de claro']],
  enem: 'Compare com a mitocôndria: nas duas organelas há cadeia de elétrons, gradiente de H⁺ e ATP sintase. Na mitocôndria, os elétrons vêm do alimento (NADH) e terminam no O₂, formando água. No cloroplasto, vêm da água, liberando O₂, e terminam no NADPH. Herbicidas que bloqueiam o transporte de elétrons entre os fotossistemas também aparecem em questões.',
  links: [LK.cloro, ['Cadeia transportadora da mitocôndria', '#resp/cadeia'], LK.origemC],
  init(S) { S.g = S.v / 100; S.r2 = S.ph; },
  draw(t, S) {
    const A = area(), v = S.v / 100; S.g += (v - S.g) * Math.min(1, S.dt * 1.1); S.r2 += S.dt * S.g; const g = S.g, on = cl(v * 4, 0, 1);
    const mh = NAR ? 34 : 58, ym = A.y0 + A.h * .52, x0 = A.x0, w = A.w, mt = ym - mh / 2, mb = ym + mh / 2;
    rr(x0, A.y0, w, ym - A.y0, 14, 'rgba(63,191,106,.13)'); rr(x0, ym, w, A.y1 - ym, 14, '#12301F');
    membrane(x0, A.x1, ym, mh, C.cloro);
    tx('estroma', x0 + 12, A.y0 + 14, { a: 'left', w: 600, c: '#CDE8D5' }); tx(NAR ? 'interior do tilacoide' : 'interior do tilacoide (lúmen)', x0 + 12, A.y1 - 14, { a: 'left', w: 600, c: '#CDE8D5' });
    const px = f => x0 + w * f, pw = NAR ? 38 : 76, ph = mh + (NAR ? 20 : 36), x2 = px(.12), xb = px(.36), x1 = px(.57), xf = px(.74), xS = px(.9);
    // H⁺ acumulados dentro do tilacoide
    const Rn = rng(23), N = NAR ? 30 : 70;
    for (let i = 0; i < N; i++) { const bx = x0 + 14 + Rn() * (w - 28), by = mb + 22 + Rn() * Math.max(10, A.y1 - mb - 52), k = Rn(); if (k < g * .95 + .05) hplus(bx + Math.sin(t * 1.1 + i) * 3, by + Math.cos(t * .9 + i * 2) * 3, NAR ? 5 : 6, .9); }
    for (let i = 0; i < 3; i++) hplus(px(.26 + i * .2) + Math.sin(t + i) * 3, mt - 60 - (i % 2) * 20, NAR ? 5 : 6, .4);
    const ep = [[x2, mb + 26], [x2, ym + 3], [xb, ym + 3], [xb, mb + 9], [x1, mb + 9], [x1, ym], [x1, mt - 9], [xf, mt - 9], [xf, mt - 34]];
    poly(ep, rgba(C.e, .28), 2, [3, 5]);
    const fl2 = on * (.5 + .5 * Math.sin(t * 5)), fl1 = on * (.5 + .5 * Math.sin(t * 5 + 2));
    protein(x2, ym, pw, ph, '#7FD79B', NAR ? 'PS II' : 'PS II', { glow: fl2 * .9 }); protein(xb, ym, pw * .78, ph, '#B7D3C0', 'b₆f'); protein(x1, ym, pw, ph, '#7FD79B', 'PS I', { glow: fl1 * .9 });
    protein(xf, mt - 8, pw * .72, 20, '#B7D3C0', NAR ? '' : 'FNR');
    const qx = lerp(x2 + pw * .75, xb - pw * .65, .5 - .5 * Math.cos(t * 1.6)), cxx = lerp(xb + pw * .65, x1 - pw * .75, .5 - .5 * Math.cos(t * 1.6 + 1.5));
    circ(qx, ym + 3, 9, '#D7C2FF', 'rgba(11,15,28,.6)', 1); circ(cxx, mb + 9, 9, '#A8D8FF', 'rgba(11,15,28,.6)', 1);
    // luz nos dois fotossistemas
    for (const xp of [x2, x1]) for (let j = 0; j < 2; j++) photon(xp - 34 + j * 22, A.y0 + (NAR ? 30 : 34), xp - 10 + j * 14, mt - ph / 2 + mh / 2 - 3, t + j + xp, on * .9);
    if (on > 0) {
      for (let i = 0; i < 7; i++) { const f = fr(t * .2 + i / 7), [x, y] = pth(ep, f); elec(x, y, 4.5, on * Math.min(1, Math.sin(f * PI) * 4)); }
      for (let j = 0; j < 2; j++) { const f = fr(t * .55 + j / 2); hplus(xb + pw * .39 + 6, lerp(mt - 26, mb + 26, f), NAR ? 5 : 6, on * Math.min(1, Math.sin(f * PI) * 2.5)); }
      arrow(xb + pw * .39 + 6, mt - 14, xb + pw * .39 + 6, mb + 10, rgba(C.h, .35), 1.5);
      // fotólise: H⁺ e O₂ saem da água, do lado de dentro
      for (let j = 0; j < 2; j++) { const f = fr(t * .4 + j / 2); hplus(x2 - 12 + f * 30 * (j ? 1 : -.3), mb + 30 + f * 30, NAR ? 5 : 6, Math.sin(f * PI)); }
      fly([[x2 + 6, mb + 46], [x2 + (NAR ? 40 : 90), A.y1 - 32]], fr(t * .2), 'O₂', C.o2);
      fly([[xf, mt - 40], [xf + (NAR ? 6 : 30), A.y0 + 30]], fr(t * .22), 'NADPH', C.nad);
    }
    tok(x2 - (NAR ? 0 : 6), mb + 46, 'H₂O', C.agua); tok(xf - (NAR ? 10 : 46), mt - 36, 'NADP⁺', '#C9CFDC', { a: .9 });
    const sy = synthase(xS, ym, mh, -1, S.r2 * 1.6, NAR ? .9 : 1.5);
    if (g > .03) { for (let j = 0; j < 3; j++) { const f = fr(S.r2 * .6 + j / 3); hplus(xS, lerp(mb + 30, mt - 8, f), NAR ? 5 : 6, Math.min(1, Math.sin(f * PI) * 2.5)); } fly([[xS - 4, sy.hy - sy.hr - 4], [xS - (NAR ? 20 : 50), A.y0 + 30]], fr(S.r2 * .28), 'ATP', C.atp); }
    lab(x2 - 6, mt - ph / 2 + mh / 2, x2 + 16, A.y0 + (NAR ? 66 : 70), 'fotossistema II'); lab(xS + 8, mb, xS - 20, A.y1 - 40, 'ATP sintase'); lab(x1 + 6, mb + ph / 2 - mh / 2, x1 - 20, A.y1 - 68, 'fotossistema I');
    lab(qx, ym + 3, qx + 10, mt - 60, 'plastoquinona'); lab(cxx, mb + 9, cxx + 10, mb + 74, 'plastocianina');
    const st = Math.floor(t / 4.5) % 4;
    cap(v === 0 ? 'No escuro, a fase clara para: sem luz não se formam ATP nem NADPH' : ['1. A luz excita a clorofila dos fotossistemas, que perdem elétrons', '2. A fotólise da água repõe os elétrons do fotossistema II e libera O₂ e H⁺', '3. A passagem dos elétrons bombeia H⁺ para dentro do tilacoide; a volta pela ATP sintase forma ATP', '4. No fim do caminho, os elétrons reduzem o NADP⁺ a NADPH'][st]);
  }
});

def('foto', 'calvin', {
  t: 'Ciclo de Calvin', s: 'o CO₂ vira açúcar', c: C.cloro, loc: 'Estroma do cloroplasto',
  alt: 'Num ciclo, o gás carbônico é fixado pela RuBisCO, reduzido com ATP e NADPH e forma açúcar de três carbonos',
  d: `<p><b>O ciclo de Calvin usa o ATP e o NADPH da fase clara para transformar CO₂ em açúcar.</b> Ele acontece no estroma, o líquido que envolve os tilacoides.</p>
<p>O ciclo tem três momentos. Na <b>fixação do carbono</b>, a enzima <b>RuBisCO</b> une o CO₂ a uma molécula de 5 carbonos, a RuBP. Na <b>redução</b>, ATP e NADPH transformam os compostos de 3 carbonos que resultam em <b>G3P</b> (gliceraldeído-3-fosfato, que alguns livros chamam de PGAL), um açúcar de 3 carbonos. Na <b>regeneração</b>, a maior parte do G3P é usada para refazer a RuBP, com gasto de mais ATP.</p>
<p>A cada 3 CO₂ fixados sobra 1 G3P para a planta. Dois G3P formam uma glicose, que pode virar sacarose (transportada pelo floema), amido (reserva) ou celulose (parede celular). O ciclo não usa luz diretamente, mas para pouco depois que escurece, porque acabam o ATP e o NADPH. Por isso, evite o nome "fase escura".</p>`,
  kv: [['Onde', 'estroma'], ['Para 1 glicose', '6 CO₂, 18 ATP e 12 NADPH'], ['Enzima-chave', 'RuBisCO, provavelmente a proteína mais abundante do planeta'], ['Produto direto', 'G3P (3 carbonos)'], ['Outros nomes', 'ciclo de Calvin-Benson; etapa química']],
  enem: 'A matéria seca da planta vem principalmente do CO₂ do ar, não do solo: o carbono fixado no ciclo de Calvin forma açúcares, celulose e madeira. As questões também pedem a dependência entre as fases: sem luz não há ATP nem NADPH, e o ciclo para.',
  links: [LK.cloro, ['Fase clara', '#foto/clara']],
  draw(t) {
    const A = area(), R = Math.min(A.w * (NAR ? .235 : .2), A.h * .28), cx = A.cx, cy = A.y0 + A.h * .5;
    rr(A.x0, A.y0, A.w, A.h, 24, 'rgba(63,191,106,.12)', rgba(C.cloro, .55), 2); tx('estroma', A.x1 - 14, A.y1 - 14, { a: 'right', c: C.dim });
    ring(cx, cy, R, C.cloro, 6, 3);
    tx('ciclo de Calvin', cx, cy - 9, { f: FH, s: NAR ? 13 : 16, w: 600, c: C.txt }); tx('3 CO₂ → 1 G3P', cx, cy + 11, { c: C.dim, f: FD, s: 12, w: 500 });
    const q = fr(t * .065), a = -PI / 2 + q * TAU, n = q < .02 || q > .68 ? 5 : 3, r = NAR ? 5 : 8, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
    circ(cx, cy - R, NAR ? 13 : 16, light(C.cloro, .2), 'rgba(11,15,28,.6)', 1.5);
    rr(x - n * r * .95 - 6, y - r - 5, n * r * 1.9 + 12, r * 2 + 10, 999, 'rgba(11,15,28,.75)'); cchain(x, y, n, r);
    const rad = NAR ? 1.42 : 1.5;
    estacao(cx, cy, R, -PI / 2 + .34, '3 CO₂', C.co2, seg(q, -.02, .14) * (q > .9 ? 0 : 1) || seg(q, .96, 1.12), rad);
    estacao(cx, cy, R, -PI / 2 + .3 * TAU - .2, '6 ATP', C.atp, seg(q, .22, .4), rad); estacao(cx, cy, R, -PI / 2 + .3 * TAU + .22, '6 NADPH', C.nad, seg(q, .22, .4), rad);
    estacao(cx, cy, R, PI / 2, '1 G3P → açúcares', C.glic, seg(q, .44, .64), rad);
    estacao(cx, cy, R, -PI / 2 + .74 * TAU, '3 ATP', C.atp, seg(q, .66, .84), rad);
    lab(cx - (NAR ? 10 : 12), cy - R - 6, cx - R * .9, cy - R * 1.6, 'RuBisCO');
    tx(q < .33 ? 'compostos de 3 C' : q < .68 ? 'G3P (3 C)' : 'RuBP (5 C)', x + Math.cos(a) * -34, y + Math.sin(a) * -26, { s: 12, c: C.txt });
    cap(q < .33 ? '1. Fixação: a enzima RuBisCO une o CO₂ à RuBP (5 C)' : q < .68 ? '2. Redução: ATP e NADPH da fase clara formam G3P; uma parte sai do ciclo e vira açúcar' : '3. Regeneração: com mais ATP, o restante do G3P refaz a RuBP');
  }
});

// =====================================================================================
// FATORES LIMITANTES (gráficos interativos)
// =====================================================================================
function grafLayout() {
  const A = area();
  return NAR ? { A, G: box(A.x0 + 32, A.y0 + 6, A.x1 - 6, A.y0 + A.h * .58), B: { x: A.x0 + 6, y: A.y0 + A.h * .58 + 66, w: A.w - 12, gap: 38 } }
    : { A, G: box(A.x0 + 44, A.y0 + 8, A.x0 + A.w * .66, A.y1 - 44), B: { x: A.x0 + A.w * .72, y: A.cy - 30, w: A.w * .28, gap: 64 } };
}
function box(x0, y0, x1, y1) { return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 }; }
const VERDE = '#6BE08F';

{
  const Pm = 13, K = 30, Rr = 3, bruta = I => Pm * (1 - Math.exp(-I / K)), liq = I => bruta(I) - Rr, sombra = I => 5.2 * (1 - Math.exp(-I / 9)) - 1, Ic = -K * Math.log(1 - Rr / Pm), Is = 78;
  def('fatores', 'luz', {
    t: 'Luz e ponto de compensação', s: 'quando a fotossíntese empata com a respiração', c: C.luz, loc: 'Gráfico interativo', still: 0,
    ctl: { l: 'Luz', min: 0, max: 100, step: 1, v: 35, f: v => v + ' %', rate: () => 1 },
    alt: 'Gráfico da troca de gás carbônico em função da intensidade da luz, com o ponto de compensação luminoso e o ponto de saturação',
    d: `<p><b>Quanto mais luz, mais fotossíntese, mas só até certo ponto.</b> Arraste o marcador no gráfico. A curva mostra a troca de gases da planta: acima da linha do zero, ela absorve mais CO₂ do que libera; abaixo, libera mais do que absorve.</p>
<p>No escuro só há respiração. Com pouca luz, a fotossíntese ainda não compensa a respiração. No <b>ponto de compensação luminoso</b>, as duas taxas se igualam: todo o O₂ que a fotossíntese produz é consumido pela respiração, e todo o CO₂ da respiração é usado na fotossíntese. A planta sobrevive, mas não acumula matéria. Para crescer, ela precisa passar boa parte do dia acima desse ponto.</p>
<p>Com luz forte, a curva se estabiliza no <b>ponto de saturação luminosa</b>: os fotossistemas e as enzimas já trabalham no limite, e outro fator passa a limitar. Plantas de sombra têm pontos de compensação e de saturação mais baixos do que plantas de sol.</p>`,
    kv: [['Ponto de compensação', 'fotossíntese = respiração'], ['Abaixo dele', 'a planta consome as reservas'], ['Acima dele', 'sobra matéria orgânica para crescer'], ['Ponto de saturação', 'mais luz não aumenta a taxa']],
    enem: 'Gráficos de taxa de fotossíntese e de respiração em função da luz são clássicos. Leia os eixos, localize onde as curvas se cruzam e lembre que a respiração não para quando há luz. Uma planta mantida abaixo do ponto de compensação morre depois de gastar as reservas.',
    links: [['Fotossíntese × respiração', '#relacao/ciclo'], LK.cloro],
    drag(x, y, S) { return S.inv ? S.inv(x) : null; },
    draw(t, S) {
      const { A, G, B } = grafLayout(), I = S.v;
      const g = graph(G, { x0: 0, x1: 100, y0: -5, y1: 12, xl: 'intensidade da luz', yl: NAR ? 'troca de CO₂' : 'troca de CO₂ da planta', xt: [[0, '0'], [25, '25'], [50, '50'], [75, '75'], [100, '100 %']], curves: [{ f: sombra, c: 'rgba(107,224,143,.55)', lw: 2, dash: [5, 4] }, { f: () => -Rr, c: rgba(C.mito, .8), lw: 1.5, dash: [2, 4] }, { f: liq, c: VERDE, lw: 3 }] });
      S.inv = g.inv;
      X.save(); X.globalAlpha = .1; X.fillStyle = C.red || '#FF6B7D'; X.fillRect(G.x0 + 1, g.fy(0), G.w - 2, G.y1 - g.fy(0) - 1); X.restore();
      tx('absorve CO₂, libera O₂', G.x1 - 8, G.y0 + 14, { a: 'right', c: C.dim, s: 12 }); tx('libera CO₂, consome O₂', G.x1 - 8, G.y1 - 12, { a: 'right', c: C.dim, s: 12 });
      tx('planta de sol', g.fx(60), g.fy(liq(60)) - 14, { c: VERDE, w: 600, s: 12 }); tx('planta de sombra', g.fx(64), g.fy(sombra(64)) + 14, { c: 'rgba(107,224,143,.8)', s: 12 });
      line(g.fx(Ic), G.y0 + 30, g.fx(Ic), G.y1, 'rgba(255,255,255,.5)', 1, [3, 4]); circ(g.fx(Ic), g.fy(0), 5, '#fff', '#0B0F1C', 1.5);
      lab(g.fx(Ic), g.fy(0), g.fx(Ic) + 26, g.fy(0) + (NAR ? 30 : 40), 'ponto de compensação');
      lab(g.fx(Is), g.fy(liq(Is)), g.fx(Is) - 70, g.fy(liq(Is)) - 34, 'ponto de saturação');
      lab(g.fx(3), g.fy(-Rr), g.fx(14), g.fy(-Rr) + 24, 'respiração');
      line(g.fx(I), G.y0, g.fx(I), G.y1, rgba(C.luz, .5), 1.5); marker(g.fx(I), g.fy(liq(I)), C.luz);
      hbar(B.x, B.y, B.w, 14, bruta(I) / Pm, VERDE, 'Fotossíntese', ''); hbar(B.x, B.y + B.gap, B.w, 14, Rr / Pm, C.mito, 'Respiração', '');
      if (!NAR) tx(liq(I) > .15 ? 'saldo: a planta libera O₂' : liq(I) < -.15 ? 'saldo: a planta consome O₂' : 'saldo zero', B.x, B.y + B.gap * 2 - 14, { a: 'left', w: 600, c: C.txt, bg: false });
      cap(I === 0 ? 'No escuro só há respiração: a planta consome O₂ e libera CO₂' : Math.abs(I - Ic) < 1.6 ? 'Ponto de compensação: o O₂ produzido é igual ao consumido; a planta não cresce' : I < Ic ? 'Abaixo do ponto de compensação: a respiração supera a fotossíntese, e a planta gasta reservas' : I < Is ? 'Acima do ponto de compensação sobra matéria orgânica para crescer; a luz ainda é o fator limitante' : 'Saturação: mais luz não aumenta a taxa; agora quem limita é o CO₂ ou a temperatura');
    }
  });
}
{
  const forte = c => 11 * (1 - Math.exp(-c / 330)), fraca = c => 4.6 * (1 - Math.exp(-c / 170));
  def('fatores', 'co2', {
    t: 'Concentração de CO₂', s: 'a matéria-prima escassa', c: C.co2, loc: 'Gráfico interativo', still: 0,
    ctl: { l: 'CO₂ no ar', min: 0, max: 1200, step: 20, v: 420, f: v => v + ' ppm', rate: () => 1 },
    alt: 'Gráfico da taxa de fotossíntese em função da concentração de gás carbônico, com uma curva para luz forte e outra para luz fraca',
    d: `<p><b>O CO₂ é a matéria-prima do ciclo de Calvin, e no ar ele é escasso: cerca de 0,04% (420 ppm).</b> Por isso, em dias claros, é comum que o CO₂ seja o <b>fator limitante</b>, isto é, o fator em menor oferta, que segura a taxa do processo inteiro.</p>
<p>No gráfico, aumentar o CO₂ faz a taxa subir até um patamar. A altura do patamar depende da luz: com luz fraca, a planta satura cedo, porque faltam ATP e NADPH para fixar mais carbono. A ideia central é esta: a taxa obedece ao fator que estiver em falta.</p>
<p>O CO₂ entra na folha pelos <b>estômatos</b>. Em dias quentes e secos, a planta fecha os estômatos para não perder água; o CO₂ dentro da folha cai e a fotossíntese diminui, mesmo com luz de sobra.</p>`,
    kv: [['CO₂ no ar', 'cerca de 0,04% (420 ppm)'], ['Entrada na folha', 'estômatos'], ['Em estufas', 'enriquecer o ar com CO₂ aumenta a produção'], ['Fator limitante', 'o que estiver em menor oferta']],
    enem: 'Aparece em questões sobre estufas, abertura e fechamento dos estômatos e adaptações a ambientes secos. O raciocínio pedido é identificar, no gráfico, qual fator limita em cada trecho: se a curva ainda sobe, é o fator do eixo horizontal; se está no patamar, é outro.',
    links: [['Ciclo de Calvin', '#foto/calvin'], ['Ciclo do carbono', '#relacao/carbono']],
    drag(x, y, S) { return S.inv ? S.inv(x) : null; },
    draw(t, S) {
      const { G, B } = grafLayout(), c = S.v;
      const g = graph(G, { x0: 0, x1: 1200, y0: 0, y1: 12, xl: 'CO₂ no ar (ppm)', yl: 'taxa de fotossíntese', xt: [[0, '0'], [400, '400'], [800, '800'], [1200, '1200']], curves: [{ f: fraca, c: 'rgba(107,224,143,.6)', lw: 2.5, dash: [5, 4] }, { f: forte, c: VERDE, lw: 3 }] });
      S.inv = g.inv;
      tx('luz forte', g.fx(1000), g.fy(forte(1000)) - 14, { c: VERDE, w: 600, s: 12 }); tx('luz fraca', g.fx(1000), g.fy(fraca(1000)) - 14, { c: 'rgba(107,224,143,.85)', s: 12 });
      line(g.fx(420), G.y0, g.fx(420), G.y1, 'rgba(255,255,255,.5)', 1, [3, 4]); lab(g.fx(420), G.y1 - 22, g.fx(420) + 26, G.y1 - 34, 'ar hoje: 420 ppm');
      line(g.fx(c), G.y0, g.fx(c), G.y1, rgba(C.luz, .5), 1.5); marker(g.fx(c), g.fy(forte(c)), C.luz); marker(g.fx(c), g.fy(fraca(c)), '#C9CFDC');
      hbar(B.x, B.y, B.w, 14, forte(c) / 11, VERDE, 'Com luz forte', ''); hbar(B.x, B.y + B.gap, B.w, 14, fraca(c) / 11, 'rgba(107,224,143,.6)', 'Com luz fraca', '');
      cap(c === 0 ? 'Sem CO₂ não há o que fixar: o ciclo de Calvin para' : c < 620 ? 'Neste trecho a curva sobe: o CO₂ é o fator limitante, e mais CO₂ aumenta a taxa' : 'No patamar, mais CO₂ quase não muda a taxa: quem limita agora é a luz ou as enzimas');
    }
  });
}
{
  const fot = T => 10 * Math.exp(-Math.pow((T - 30) / (T < 30 ? 13 : 7), 2)), res = T => Math.min(6, 1.1 * Math.pow(2, (T - 20) / 10)) * (T > 45 ? Math.max(.2, 1 - (T - 45) / 8) : 1);
  def('fatores', 'temp', {
    t: 'Temperatura', s: 'enzimas têm uma faixa ótima', c: C.calor, loc: 'Gráfico interativo', still: 0,
    ctl: { l: 'Temperatura', min: 0, max: 50, step: 1, v: 25, f: v => v + ' °C', rate: () => 1 },
    alt: 'Gráfico em forma de sino da taxa de fotossíntese em função da temperatura, com um ponto ótimo perto de 30 graus Celsius',
    d: `<p><b>A fotossíntese depende de enzimas, e enzimas têm uma faixa de temperatura em que trabalham melhor.</b> Com frio, as moléculas se movem devagar e as reações são lentas. Conforme a temperatura sobe, a taxa aumenta até um valor <b>ótimo</b>.</p>
<p>Acima do ótimo, a taxa cai depressa: as enzimas começam a perder a forma (<b>desnaturação</b>), as membranas dos tilacoides ficam instáveis e a planta fecha os estômatos para economizar água. A respiração continua aumentando com o calor por mais tempo, e por isso o saldo da planta piora.</p>
<p>A temperatura afeta sobretudo o ciclo de Calvin, que é uma sequência de reações enzimáticas. A captação de luz na fase clara depende pouco dela. O valor ótimo muda de espécie para espécie: plantas de clima frio têm ótimos mais baixos do que plantas tropicais.</p>`,
    kv: [['Ótimo de muitas plantas', 'entre 25 e 35&nbsp;°C'], ['Com frio', 'reações lentas'], ['Com calor excessivo', 'enzimas desnaturam e os estômatos se fecham'], ['Etapa mais sensível', 'ciclo de Calvin']],
    enem: 'Liga-se a enzimas (temperatura ótima, desnaturação) e a mudanças climáticas: ondas de calor reduzem a produtividade das lavouras. Uma curva em forma de sino é a pista de que há enzimas no processo.',
    links: [['Ciclo de Calvin', '#foto/calvin'], LK.biom],
    drag(x, y, S) { return S.inv ? S.inv(x) : null; },
    draw(t, S) {
      const { G, B } = grafLayout(), T = S.v;
      const g = graph(G, { x0: 0, x1: 50, y0: 0, y1: 12, xl: 'temperatura (°C)', yl: 'taxa', xt: [[0, '0'], [10, '10'], [20, '20'], [30, '30'], [40, '40'], [50, '50']], curves: [{ f: res, c: rgba(C.mito, .85), lw: 2, dash: [5, 4] }, { f: fot, c: VERDE, lw: 3 }] });
      S.inv = g.inv;
      tx('fotossíntese', g.fx(13), g.fy(fot(13)) - 16, { c: VERDE, w: 600, s: 12 }); tx('respiração', g.fx(NAR ? 40 : 44), g.fy(res(44)) - 14, { c: light(C.mito, .3), s: 12 });
      lab(g.fx(30), g.fy(10), g.fx(30) + 30, g.fy(10) - 16, 'temperatura ótima');
      line(g.fx(T), G.y0, g.fx(T), G.y1, rgba(C.luz, .5), 1.5); marker(g.fx(T), g.fy(fot(T)), C.luz);
      hbar(B.x, B.y, B.w, 14, fot(T) / 10, VERDE, 'Fotossíntese', ''); hbar(B.x, B.y + B.gap, B.w, 14, res(T) / 10, C.mito, 'Respiração', '');
      cap(T < 18 ? 'Com frio, as enzimas trabalham devagar, e a taxa é baixa' : T <= 34 ? 'Faixa ótima: as enzimas do ciclo de Calvin trabalham no ritmo máximo' : 'Calor demais: as enzimas desnaturam e os estômatos se fecham; a taxa despenca');
    }
  });
}

// =====================================================================================
// FOTOSSÍNTESE × RESPIRAÇÃO
// =====================================================================================
def('relacao', 'ciclo', {
  t: 'Processos complementares', s: 'o que uma produz, a outra consome', c: C.agua, loc: 'Célula vegetal', still: 3,
  ctl: { l: 'Luz', min: 0, max: 100, step: 5, v: 100, f: v => v + ' %', rate: () => 1 },
  alt: 'O cloroplasto envia glicose e oxigênio para a mitocôndria, que devolve gás carbônico e água',
  d: `<p><b>Fotossíntese e respiração são processos complementares: os produtos de uma são os reagentes da outra.</b> O cloroplasto usa luz, CO₂ e água para fazer glicose e O₂. A mitocôndria usa glicose e O₂ e devolve CO₂ e água, passando a energia para o ATP.</p>
<p>Elas não são simplesmente o inverso uma da outra. Ocorrem em organelas diferentes, com enzimas diferentes, e a energia segue um caminho de mão única: entra como luz, passa pela glicose e pelo ATP e sai como calor. <b>A matéria circula; a energia flui.</b></p>
<p>A célula vegetal tem cloroplastos e mitocôndrias e <b>respira o tempo todo</b>, de dia e de noite. De dia, com luz suficiente, a fotossíntese supera a respiração, e a planta libera O₂. No escuro só a respiração continua, e a planta consome O₂ e parte do amido que guardou. Leve o controle "Luz" a zero para ver.</p>`,
  kv: [['Fotossíntese', 'cloroplasto; consome CO₂ e H₂O; libera O₂; armazena energia em açúcar'], ['Respiração', 'mitocôndria; consome açúcar e O₂; libera CO₂ e H₂O; passa energia ao ATP'], ['Quem faz fotossíntese', 'plantas, algas e cianobactérias'], ['Quem respira', 'quase todos os seres vivos, inclusive as plantas']],
  enem: 'Erros que a prova explora: "plantas só respiram à noite" (respiram sempre) e "a Amazônia é o pulmão do mundo" (numa floresta madura, quase todo o O₂ produzido é consumido pela respiração da própria floresta, incluindo os decompositores; o O₂ da atmosfera se acumulou ao longo de milhões de anos, e boa parte da produção atual vem do fitoplâncton marinho).',
  links: [LK.cloro, LK.mito, LK.origem],
  init(S) { S.g = S.v / 100; S.pc = S.ph; },
  draw(t, S) {
    const A = area(), v = S.v / 100; S.g += (v - S.g) * Math.min(1, S.dt * 1.5); S.pc += S.dt * v; const g = S.g, tc = S.pc;
    rr(A.x0, A.y0, A.w, A.h, 18, rgba(C.cito, .6), C.parede, 3); rr(A.x0 + 5, A.y0 + 5, A.w - 10, A.h - 10, 14, null, rgba(C.memb, .7), 1.5);
    let cp, mp, a1, a2;
    if (NAR) { cp = { x: A.cx, y: A.y0 + A.h * .25, rx: A.w * .33, ry: A.h * .13 }; mp = { x: A.cx, y: A.y0 + A.h * .76, L: A.w * .66, Wd: A.h * .2 }; a1 = [cp.x + cp.rx, cp.y, A.x1 - 2, A.cy, mp.x + mp.L / 2 - 6, mp.y - mp.Wd / 2 - 4]; a2 = [mp.x - mp.L / 2 + 6, mp.y - mp.Wd / 2 - 4, A.x0 + 2, A.cy, cp.x - cp.rx, cp.y]; }
    else { cp = { x: A.x0 + A.w * .24, y: A.cy, rx: A.w * .16, ry: Math.min(A.h * .24, A.w * .1) }; mp = { x: A.x0 + A.w * .76, y: A.cy, L: A.w * .32, Wd: Math.min(A.h * .32, A.w * .13) }; a1 = [cp.x + cp.rx * .6, cp.y - cp.ry * .85, A.cx, A.y0 - A.h * .08, mp.x - mp.L * .3, mp.y - mp.Wd / 2 - 4]; a2 = [mp.x - mp.L * .3, mp.y + mp.Wd / 2 + 4, A.cx, A.y1 + A.h * .08, cp.x + cp.rx * .6, cp.y + cp.ry * .85]; }
    cloro(cp.x, cp.y, cp.rx, cp.ry, { n: NAR ? 3 : 4 }); mito(mp.x, mp.y, mp.L, mp.Wd, { n: 5 });
    tl(['cloroplasto', 'fotossíntese'], cp.x, cp.y + cp.ry + 16, { c: light(C.cloro, .4) }); tl(['mitocôndria', 'respiração'], mp.x, mp.y + mp.Wd / 2 + 16, { c: light(C.mito, .4) });
    for (let i = 0; i < 3; i++) photon(cp.x - cp.rx * .5 + i * cp.rx * .4 - 26, A.y0 + (NAR ? 12 : 16), cp.x - cp.rx * .4 + i * cp.rx * .36, cp.y - cp.ry - 3, t + i, g * .9);
    tx('luz', cp.x - cp.rx * .5 - (NAR ? 46 : 50), A.y0 + 20, { c: C.luz, w: 600, a: 'left' });
    qarrow(...a1, rgba(C.cloro, .25 + .45 * g), 2); qarrow(...a2, rgba(C.mito, .7), 2);
    if (g > .04) for (let i = 0; i < 2; i++) { const f = fr(tc * .14 + i / 2), [x, y] = qpt(...a1, f); tok(x, y, i ? 'O₂' : 'glicose', i ? C.o2 : C.glic, { a: g * Math.min(1, Math.sin(f * PI) * 3) }); }
    for (let i = 0; i < 2; i++) { const f = fr(t * .14 + i / 2 + .25), [x, y] = qpt(...a2, f); tok(x, y, i ? 'H₂O' : 'CO₂', i ? C.agua : C.co2, { a: Math.min(1, Math.sin(f * PI) * 3) }); }
    if (g < .5) { const ax = NAR ? mp.x - mp.L * .34 : mp.x, ay = NAR ? mp.y - mp.Wd / 2 - 30 : mp.y - mp.Wd / 2 - 46; tok(ax, ay, 'amido (reserva)', C.glic, { a: 1 - g * 2 }); X.save(); X.globalAlpha = 1 - g * 2; arrow(ax, ay + 12, ax, mp.y - mp.Wd / 2 - 4, C.glic, 1.5); X.restore(); }
    fly([[mp.x + mp.L * .3, mp.y], [NAR ? mp.x + mp.L * .46 : mp.x + mp.L * .6, mp.y + (NAR ? mp.Wd * .9 : -mp.Wd * .9)]], fr(t * .16), 'ATP', C.atp);
    heat(mp.x + mp.L * .1, mp.y - mp.Wd / 2 - 6, t, .9);
    cap(v === 0 ? 'No escuro a fotossíntese para, mas a respiração continua: a planta usa o amido que guardou' : 'Glicose e O₂ vão do cloroplasto para a mitocôndria; CO₂ e H₂O fazem o caminho de volta. A matéria circula; a energia flui');
  }
});

function co2dot(x, y, a = 1) { X.save(); X.globalAlpha *= a; circ(x - 4.5, y, 2.6, C.o); circ(x + 4.5, y, 2.6, C.o); circ(x, y, 3.4, C.c, 'rgba(11,15,28,.5)', .8); X.restore(); }
def('relacao', 'carbono', {
  t: 'Ciclo do carbono', s: 'do ar para os seres vivos e de volta', c: C.co2, loc: 'Ecossistema', still: 3,
  ctl: { l: 'Queima de fósseis', min: 0, max: 100, step: 5, v: 60, f: v => v + ' %', rate: () => 1 },
  alt: 'Paisagem com árvore, animal, decompositores e fábrica; setas mostram o gás carbônico saindo do ar pela fotossíntese e voltando pela respiração, pela decomposição e pela combustão',
  d: `<p><b>O carbono circula entre o ar, os seres vivos, o solo e os oceanos.</b> A fotossíntese retira CO₂ da atmosfera e o transforma em matéria orgânica. Essa matéria passa pela cadeia alimentar. A respiração de plantas, animais e microrganismos e a decomposição devolvem o carbono ao ar como CO₂.</p>
<p>Uma parte do carbono fica guardada por muito tempo: na madeira, no solo, dissolvida nos oceanos e, ao longo de milhões de anos, em <b>combustíveis fósseis</b> (carvão, petróleo e gás natural), formados de restos de seres vivos.</p>
<p>Ao queimar esses combustíveis e ao derrubar e queimar florestas, devolvemos esse carbono ao ar muito mais depressa do que a fotossíntese e os oceanos conseguem retirar. A concentração de CO₂ passou de cerca de 280 ppm, antes da Revolução Industrial, para mais de 420 ppm, o que intensifica o <b>efeito estufa</b>. Use o controle para comparar.</p>`,
  kv: [['Retira CO₂ do ar', 'fotossíntese (e quimiossíntese)'], ['Devolve CO₂ ao ar', 'respiração, decomposição e combustão'], ['Reservatórios', 'atmosfera, oceanos, seres vivos, solo, rochas e fósseis'], ['CO₂ no ar', 'cerca de 280 ppm em 1750; mais de 420 ppm hoje']],
  enem: 'Ciclos biogeoquímicos são tema recorrente. Raciocínios pedidos: biocombustíveis, como o etanol de cana, devolvem ao ar o CO₂ que a planta fixou há pouco tempo, enquanto os fósseis liberam carbono guardado há milhões de anos; florestas em crescimento retiram mais CO₂ do que florestas maduras; desmatamento e queimadas somam emissões.',
  links: [['Fermentação alcoólica (etanol)', '#ferm/alcoolica'], ['Fotossíntese × respiração', '#relacao/ciclo']],
  draw(t, S) {
    const A = area(), v = S.v / 100, w = A.w, gy = A.y0 + A.h * .68, sky = A.y0 + A.h * .25, u = Math.min(w / 9, A.h / 7, 54);
    rr(A.x0, A.y0, w, A.h, 18, 'rgba(22,34,60,.7)', C.line, 1);
    X.save(); X.beginPath(); X.roundRect(A.x0, A.y0, w, A.h, 18); X.clip();
    X.fillStyle = '#2B2118'; X.fillRect(A.x0, gy, w, A.y1 - gy); line(A.x0, gy, A.x1, gy, '#6E8B3D', 3);
    const xs = (NAR ? [.14, .5, .7, .89] : [.14, .44, .66, .87]).map(f => A.x0 + w * f), [xt, xa, xd, xf] = xs;
    // reserva fóssil
    rr(xf - u * (NAR ? 1.5 : 1.1), gy + (A.y1 - gy) * .45, u * (NAR ? 3 : 2.2), (A.y1 - gy) * .35, 8, '#0C0C10', 'rgba(255,255,255,.12)', 1);
    // CO₂ na atmosfera
    const Rn = rng(31), N = Math.round((NAR ? 9 : 20) * (1 + v * 1.6));
    for (let i = 0; i < N; i++) { const bx = A.x0 + 16 + Rn() * (w - 32), by = A.y0 + 30 + Rn() * (sky - A.y0 - 34); co2dot(bx + Math.sin(t * .5 + i) * 5, by + Math.cos(t * .4 + i * 2) * 3, .85); }
    X.restore();
    tx('CO₂ na atmosfera', A.cx, A.y0 + 14, { w: 600, c: C.txt }); if (NAR) { tx('carvão, petróleo', xf, gy + (A.y1 - gy) * .625 - 8, { s: 12, c: C.dim, bg: false }); tx('e gás', xf, gy + (A.y1 - gy) * .625 + 8, { s: 12, c: C.dim, bg: false }); } else tx('carvão, petróleo e gás', xf, gy + (A.y1 - gy) * .625, { s: 12, c: C.dim, bg: false });
    // árvore
    rr(xt - u * .12, gy - u * 1.1, u * .24, u * 1.1, 3, '#7A5638'); circ(xt, gy - u * 1.5, u * .62, C.cloro, 'rgba(11,15,28,.4)', 1); circ(xt - u * .42, gy - u * 1.2, u * .4, C.grana); circ(xt + u * .42, gy - u * 1.2, u * .4, C.grana); circ(xt, gy - u * 1.55, u * .5, C.cloro);
    // animal
    ell(xa, gy - u * .55, u * .5, u * .28, 0, '#D9B38C', 'rgba(11,15,28,.5)', 1); circ(xa + u * .55, gy - u * .78, u * .2, '#D9B38C', 'rgba(11,15,28,.5)', 1); for (const dx of [-.32, -.12, .12, .32]) line(xa + dx * u, gy - u * .32, xa + dx * u, gy - 1, '#D9B38C', 3);
    // decompositores
    for (const [dx, s] of [[-.25, 1], [.25, .7]]) { rr(xd + dx * u - 3 * s, gy - u * .4 * s, 6 * s, u * .4 * s, 2, '#EFE3CF'); X.beginPath(); X.arc(xd + dx * u, gy - u * .4 * s, u * .26 * s, PI, 0); X.closePath(); X.fillStyle = '#C98A6E'; X.fill(); X.strokeStyle = 'rgba(11,15,28,.5)'; X.lineWidth = 1; X.stroke(); }
    // fábrica
    rr(xf - u * .7, gy - u * .6, u * 1.4, u * .6, 2, '#8A93A8', 'rgba(11,15,28,.5)', 1); rr(xf + u * .25, gy - u * 1.3, u * .28, u * .75, 2, '#6F7890', 'rgba(11,15,28,.5)', 1); for (let i = 0; i < 3; i++) rr(xf - u * .55 + i * u * .32, gy - u * .42, u * .18, u * .18, 1, '#FFE9A8');
    // fluxos
    const flows = [[xt - u * .5, sky, gy - u * 2.2, C.cloro, 'fotossíntese', 1, 1], [xt + u * .55, gy - u * 2.2, sky, C.mito, '', 1, 0], [xa, gy - u * 1.1, sky, C.mito, 'respiração', 1, 0], [xd, gy - u * .8, sky, C.creme, 'decomposição', 1, 1], [xf + u * .39, gy - u * 1.4, sky, C.calor, 'combustão', v, 0]];
    flows.forEach(([x, y1, y2, c, name, k, lv], i) => {
      if (k <= 0) return; arrow(x, y1, x, y2, rgba(c, .85), 1.5 + k * 2);
      const n = k > .6 ? 3 : 2; for (let j = 0; j < n; j++) { const f = fr(t * .22 + j / n + i * .13); co2dot(x + 12, lerp(y1, y2, f), Math.sin(f * PI)); }
      if (name) tx(name, x + (i === 0 ? u * 1.05 + (NAR ? 14 : 20) : 0), (y1 + y2) / 2 + (lv ? -12 : 12) * (NAR ? 1.6 : 1), { s: 12, w: 600, c: light(c, .35), a: i === 0 ? 'left' : 'center' });
    });
    arrow(xt + u * .75, gy - u * .5, xa - u * .65, gy - u * .5, 'rgba(232,237,247,.6)', 1.5, [4, 4]); arrow(xa + u * .8, gy - u * .2, xd - u * .55, gy - u * .2, 'rgba(232,237,247,.6)', 1.5, [4, 4]);
    if (!NAR) { tx('alimento', (xt + xa) / 2 + u * .05, gy - u * .5 - 12, { s: 12, c: C.dim }); tx('restos', (xa + xd) / 2 + u * .1, gy - u * .2 - 12, { s: 12, c: C.dim }); }
    if (v > 0) arrow(xf + u * .39, gy + (A.y1 - gy) * .45, xf + u * .39, gy + 4, rgba(C.calor, .8), 1.5, [3, 3]);
    cap(v === 0 ? 'Sem queima de fósseis, o CO₂ devolvido pela respiração e pela decomposição equivale ao que a fotossíntese retirou' : 'A combustão devolve ao ar, em décadas, carbono guardado há milhões de anos: o CO₂ da atmosfera sobe');
  }
});

def('relacao', 'quimio', {
  t: 'Quimiossíntese', s: 'matéria orgânica sem luz', c: C.s, loc: 'Bactérias e arqueias',
  alt: 'Numa fonte hidrotermal no fundo do mar, uma bactéria oxida sulfeto de hidrogênio e usa a energia para transformar gás carbônico em matéria orgânica',
  d: `<p><b>Na quimiossíntese, a matéria orgânica é produzida com energia de reações químicas, e não da luz.</b> Algumas bactérias e arqueias oxidam substâncias inorgânicas, como amônia (NH₃), nitrito (NO₂⁻), sulfeto de hidrogênio (H₂S) ou íons de ferro (Fe²⁺). A energia liberada serve para fixar CO₂ em açúcares, como no ciclo de Calvin.</p>
<p>Esses seres são <b>autótrofos quimiossintetizantes</b>: produzem o próprio alimento sem depender do Sol. Nas fontes hidrotermais do fundo do mar, onde a luz não chega, bactérias que oxidam H₂S sustentam comunidades inteiras de vermes tubulares, mexilhões e camarões.</p>
<p>No solo, as <b>bactérias nitrificantes</b> fazem quimiossíntese: <i>Nitrosomonas</i> transforma amônia em nitrito, e <i>Nitrobacter</i> transforma nitrito em nitrato, a forma de nitrogênio que as plantas mais absorvem.</p>`,
  kv: [['Fonte de energia', 'oxidação de substâncias inorgânicas'], ['Fonte de carbono', 'CO₂'], ['Quem faz', 'algumas bactérias e arqueias'], ['Exemplos', 'nitrificantes, sulfobactérias, ferrobactérias'], ['Libera O₂', 'não']],
  enem: 'Aparece em duas situações: no ciclo do nitrogênio (nitrificação) e em ecossistemas sem luz, nos quais os produtores são quimiossintetizantes. A pergunta de fundo é sempre a mesma: de onde vem a energia que sustenta a cadeia alimentar?',
  links: [['Ciclo de Calvin', '#foto/calvin'], ['Ciclo do carbono', '#relacao/carbono']],
  draw(t) {
    const A = area(), w = A.w, h = A.h; rr(A.x0, A.y0, w, h, 18, '#08121F', C.line, 1);
    const fy = A.y1 - h * .1, vx = NAR ? A.x0 + w * .2 : A.x0 + w * .16, vh = h * (NAR ? .26 : .5), vw = Math.min(w * .1, 60);
    X.save(); X.beginPath(); X.roundRect(A.x0, A.y0, w, h, 18); X.clip(); X.fillStyle = '#1B1613'; X.fillRect(A.x0, fy, w, A.y1 - fy);
    X.beginPath(); X.moveTo(vx - vw, fy); X.lineTo(vx - vw * .4, fy - vh); X.lineTo(vx + vw * .4, fy - vh); X.lineTo(vx + vw, fy); X.closePath(); X.fillStyle = '#3A2E27'; X.fill(); X.strokeStyle = 'rgba(255,255,255,.15)'; X.lineWidth = 1; X.stroke();
    for (let i = 0; i < 10; i++) { const f = fr(t * .12 + i / 10), k = Math.sin(i * 3.3); circ(vx + k * vw * (.3 + f * 1.4), fy - vh - f * h * .32, 6 + f * 16, `rgba(120,130,150,${.22 * (1 - f)})`); }
    X.restore();
    tx('fonte hidrotermal', vx, fy + (A.y1 - fy) / 2, { s: 12, c: C.dim, bg: false }); tx('fundo do mar, sem luz', A.x1 - 14, A.y0 + 14, { a: 'right', c: C.dim });
    const bx = NAR ? A.cx : A.x0 + w * .62, by = NAR ? A.y0 + h * .36 : A.cy - h * .04, L = NAR ? w * .9 : w * .58, Wd = Math.min(h * (NAR ? .36 : .5), L * .5);
    capsule(bx, by, L + 10, Wd + 10); X.strokeStyle = C.parede; X.lineWidth = 3; X.stroke(); capsule(bx, by, L, Wd); X.fillStyle = rgba(C.cito, .85); X.fill(); X.strokeStyle = C.memb; X.lineWidth = 1.5; X.stroke();
    const n1 = [bx - L * .22, by], n2 = [bx + L * .22, by], nr = Math.min(Wd * .26, L * .11);
    circ(n1[0], n1[1], nr, rgba(C.s, .18), C.s, 2); circ(n2[0], n2[1], nr, rgba(C.cloro, .16), C.cloro, 2);
    tl(['oxidação', 'libera energia'], n1[0], n1[1] - 8, { s: 12, w: 600, bg: false }); tl(['fixação', 'do CO₂'], n2[0], n2[1] - 8, { s: 12, w: 600, bg: false });
    for (let i = 0; i < 3; i++) { const f = fr(t * .5 + i / 3); circ(lerp(n1[0] + nr, n2[0] - nr, f), by, 4, rgba(C.luz, Math.sin(f * PI))); }
    tx('energia (ATP)', bx, by - 14, { s: 12, c: C.luz });
    const src = NAR ? [vx + 10, fy - vh - 10] : [vx + vw * .2, fy - vh - 10];
    fly([src, [n1[0] - nr * .6, n1[1] + nr * .4]], fr(t * .12), 'H₂S', C.s); fly([src, [n1[0] - nr * .6, n1[1] + nr * .4]], fr(t * .12 + .5), 'H₂S', C.s);
    fly([[n1[0] - L * .12, A.y0 + 24], [n1[0], n1[1] - nr]], fr(t * .12 + .3), 'O₂', C.o2);
    fly([[n1[0], n1[1] + nr], [n1[0] + L * .06, by + Wd / 2 + (NAR ? 30 : 44)]], fr(t * .12 + .7), NAR ? 'S + H₂O' : 'enxofre + H₂O', '#C9CFDC');
    fly([[n2[0] + L * .1, A.y0 + 24], [n2[0], n2[1] - nr]], fr(t * .12 + .15), 'CO₂', C.co2);
    fly([[n2[0], n2[1] + nr], [n2[0] + L * .1, by + Wd / 2 + (NAR ? 30 : 44)]], fr(t * .12 + .6), 'açúcar', C.glic);
    lab(bx + L * .44, by - Wd * .3, bx + L * .3, by - Wd / 2 - 30, 'bactéria quimiossintetizante');
    cap('A energia para fixar o CO₂ vem da oxidação de substâncias inorgânicas, como o H₂S, e não da luz');
  }
});
