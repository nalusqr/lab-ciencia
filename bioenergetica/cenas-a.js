/* LAB · Módulo 08 Bioenergética. Cenas: ATP e energia, respiração celular, fermentação. Código e textos da equipe. */
'use strict';
function badge(x, y, n) { circ(x, y, 11, '#E8EDF7', 'rgba(11,15,28,.7)', 1.5); tx(String(n), x, y + .5, { s: 13, w: 700, c: '#0B0F1C', bg: false }); }
function tl(lines, x, y, o = {}) { lines.forEach((s, i) => tx(s, x, y + i * 16, Object.assign({ s: 13, w: 600, c: C.txt }, o))); }
// ficha que segue um caminho e some nas pontas
function fly(p, f, s, c) { const [x, y] = pth(p, f); tok(x, y, s, c, { a: Math.min(1, Math.sin(cl(f, 0, 1) * PI) * 2.2) }); }

// =====================================================================================
// ATP E ENERGIA
// =====================================================================================
def('atp', 'ciclo', {
  t: 'ATP e ADP', s: 'a moeda de energia da célula', c: C.atp, loc: 'Em toda a célula', alt: 'A molécula de ATP perde o último fosfato, vira ADP e depois é refeita',
  d: `<p><b>O ATP (adenosina trifosfato) é a molécula que entrega energia pronta para uso em toda a célula.</b> Ele é um nucleotídeo: uma adenina, uma ribose e três fosfatos em fila. Quando a célula precisa de energia, uma enzima quebra a ligação do último fosfato com a ajuda da água (<b>hidrólise</b>), e sobram ADP (adenosina difosfato) e um fosfato solto (P<sub>i</sub>).</p>
<p>O ATP não é um estoque: é uma moeda que circula. A célula gasta e refaz o seu ATP o tempo todo, juntando de novo ADP e fosfato com a energia que vem dos alimentos (respiração celular e fermentação) ou da luz (fotossíntese).</p>
<p>A energia não fica "guardada dentro da ligação". Ela é liberada porque os produtos da reação (ADP e P<sub>i</sub>) são mais estáveis do que o ATP.</p>`,
  kv: [['Gasto', '<span class="q">ATP + H₂O → ADP + Pᵢ</span>'], ['Energia liberada', 'cerca de 30,5 kJ/mol (7,3 kcal/mol)'], ['Quem refaz o ATP', 'respiração, fermentação e fotossíntese'], ['Reserva de longo prazo', 'glicogênio, amido e gorduras, não o ATP'], ['Reciclagem diária', 'um adulto refaz em ATP uma massa parecida com o próprio peso']],
  enem: 'O ATP aparece como elo entre os processos que liberam energia e os que consomem: transporte ativo, contração muscular, síntese de proteínas. Erro comum: dizer que a célula "produz energia". Ela <b>transforma</b> energia: a respiração passa para o ATP parte da energia da glicose, e o resto vira calor.',
  links: [LK.biom, LK.mito],
  draw(t) {
    const A = area(), u = Math.min(A.w / 10.2, A.h / 7, 66), cx = A.cx, cy = A.y0 + A.h * .5, p = fr(t * .1);
    const s = p < .12 ? 0 : p < .3 ? ss((p - .12) / .18) : p < .58 ? 1 : p < .8 ? 1 - ss((p - .58) / .22) : 0, gasta = p >= .12 && p < .58;
    const x0 = cx - u * 3.75, P = [x0 + u * 3.75, x0 + u * 5, x0 + u * 6.25 + s * u * 1.25], gx = (P[1] + P[2]) / 2;
    const yT = A.y0 + 14, yB = A.y1 - 12;
    tl(NAR ? ['trabalho da célula:', 'transporte ativo, movimento, síntese'] : ['trabalho da célula: transporte ativo, movimento, síntese de moléculas'], cx, yT, { c: gasta ? C.txt : C.dim });
    tl(NAR ? ['energia dos alimentos (respiração)', 'ou da luz (fotossíntese)'] : ['energia dos alimentos (respiração e fermentação) ou da luz (fotossíntese)'], cx, yB - (NAR ? 16 : 0), { c: !gasta && p >= .58 && p < .86 ? C.txt : C.dim });
    // energia em trânsito
    const k1 = seg(p, .14, .5), k2 = seg(p, .56, .8);
    if (k1 > 0 && k1 < 1) for (let i = 0; i < 7; i++) { const f = cl(k1 * 1.5 - i * .07, 0, 1); if (f > 0 && f < 1) circ(gx + Math.sin(i * 2.4) * u * .9 * f, lerp(cy - u * .5, yT + (NAR ? 34 : 18), f), 4, rgba(C.luz, Math.sin(f * PI))); }
    if (k2 > 0 && k2 < 1) for (let i = 0; i < 7; i++) { const f = cl(k2 * 1.5 - i * .07, 0, 1); if (f > 0 && f < 1) circ(gx + Math.sin(i * 2.4) * u * .9 * (1 - f), lerp(yB - (NAR ? 34 : 18), cy + u * .5, f), 4, rgba(C.luz, Math.sin(f * PI))); }
    // adenina + ribose
    line(x0 + u * .5, cy, x0 + u * 2.1, cy, 'rgba(232,237,247,.6)', 2);
    ngon(x0 - u * .2, cy, u * .58, 6, PI / 6, rgba(C.n, .3), C.n, 2); ngon(x0 + u * .72, cy, u * .46, 5, PI, rgba(C.n, .3), C.n, 2);
    ngon(x0 + u * 2.2, cy, u * .52, 5, -PI / 2, rgba(C.creme, .3), C.creme, 2);
    line(x0 + u * 2.7, cy, P[0], cy, 'rgba(232,237,247,.6)', 2); line(P[0], cy, P[1], cy, 'rgba(232,237,247,.6)', 2);
    // ligação do último fosfato
    X.save(); X.globalAlpha = 1 - s; X.beginPath(); for (let i = 0; i <= 16; i++) { const xx = lerp(P[1], P[2], i / 16), yy = cy + Math.sin(i / 16 * TAU * 2) * 4; i ? X.lineTo(xx, yy) : X.moveTo(xx, yy); } X.strokeStyle = C.luz; X.lineWidth = 2.5; X.stroke(); X.restore();
    if (s > .02 && s < .98) for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; line(gx + Math.cos(a) * u * .25, cy + Math.sin(a) * u * .25, gx + Math.cos(a) * u * (.3 + .35 * s), cy + Math.sin(a) * u * (.3 + .35 * s), rgba(C.luz, 1 - Math.abs(s - .5) * 1.6), 2); }
    P.forEach((x, i) => { circ(x, cy, u * .45, C.p, 'rgba(11,15,28,.6)', 1.5); tx(i === 2 && s > .5 ? 'Pᵢ' : 'P', x, cy + .5, { s: Math.max(12, u * .38), w: 700, c: '#0B0F1C', bg: false }); });
    tx('adenina', x0 + u * .25, cy + u * 1.05, { c: C.dim }); tx('ribose', x0 + u * 2.2, cy + u * 1.05, { c: C.dim }); tx(s > .5 ? '2 fosfatos' : '3 fosfatos', (P[0] + P[1]) / 2 + (s > .5 ? 0 : u * .6), cy + u * 1.05, { c: C.dim });
    head(s > .5 ? 'ADP + Pᵢ' : 'ATP', cx, cy - u * 1.35, s > .5 ? C.txt : C.atp);
    lab(gx, cy - 5, gx + u * .6, cy - u * 2.1, s > .5 ? 'fosfato solto' : 'ligação rica em energia');
    cap(gasta ? 'Gasto: <span class="q">ATP + H₂O → ADP + Pᵢ</span> + energia para o trabalho da célula' : 'Recarga: <span class="q">ADP + Pᵢ</span> + energia dos alimentos ou da luz <span class="q">→ ATP</span>');
  }
});

def('atp', 'acoplamento', {
  t: 'Acoplamento energético', s: 'uma reação paga a outra', c: C.atp, loc: 'Em toda a célula', alt: 'A energia de uma reação que libera energia passa pelo ATP e move uma reação que consome energia',
  d: `<p><b>Acoplamento energético é usar a energia liberada por uma reação para empurrar outra que, sozinha, não aconteceria.</b> A quebra da glicose libera energia (reação <b>exergônica</b>). Montar uma proteína ou bombear íons contra o gradiente consome energia (reação <b>endergônica</b>). O ATP faz a ponte entre as duas.</p>
<p>Na prática, o ATP passa um fosfato para a molécula que vai reagir (<b>fosforilação</b>), e ela fica mais reativa. É assim que a bomba de sódio e potássio muda de forma e que a miosina puxa a actina no músculo.</p>
<p>Nenhuma transferência é perfeita: a cada passo, parte da energia se dissipa como <b>calor</b>. É esse calor que ajuda a manter a temperatura do nosso corpo.</p>`,
  kv: [['Reação exergônica', 'libera energia (ex.: respiração)'], ['Reação endergônica', 'consome energia (ex.: síntese de proteínas)'], ['Eficiência da respiração', 'cerca de um terço da energia da glicose vai para o ATP'], ['O restante', 'dissipa-se como calor']],
  enem: 'Fluxo de energia: ela passa da luz para a glicose, da glicose para o ATP e do ATP para o trabalho da célula, sempre com perda de calor. Por isso a energia não se recicla nos ecossistemas (a matéria, sim), e cada nível trófico recebe menos energia do que o anterior.',
  links: [LK.biom],
  draw(t) {
    const A = area(), w = A.w, h = A.h, yT = A.y0 + h * .24, yB = A.y0 + h * .78, cx = A.cx, cy = A.y0 + h * .51, R = Math.min(w * .105, h * .19, 72);
    const lx0 = A.x0 + w * .03, lx1 = A.x0 + w * .33, rx0 = A.x0 + w * .67, rx1 = A.x0 + w * .97, d = (lx1 - lx0) * .24;
    const Lp = [[lx0, yT], [lx0 + d, yT], [lx1 - d, yB], [lx1, yB]], Rp = [[rx0, yB], [rx0 + d, yB], [rx1 - d, yT], [rx1, yT]];
    poly(Lp, rgba(C.mito, .9), 4); poly(Rp, 'rgba(207,224,255,.8)', 4);
    tx('libera energia', (lx0 + lx1) / 2, A.y0 + 12, { w: 600, c: C.txt }); tx('consome energia', (rx0 + rx1) / 2, A.y0 + 12, { w: 600, c: C.txt });
    tok(lx0 + (NAR ? 40 : 46), yT - 18, 'glicose + O₂', C.glic); tok(lx1 - (NAR ? 36 : 40), yB + 18, 'CO₂ + H₂O', C.co2);
    tok(rx0 + (NAR ? 40 : 44), yB + 18, 'aminoácidos', '#CFE0FF'); tok(rx1 - (NAR ? 30 : 34), yT - 18, 'proteína', '#CFE0FF');
    for (let i = 0; i < 3; i++) { const f = fr(t * .11 + i / 3), [x, y] = pth(Lp, f); circ(x, y - 8, 7, C.glic, 'rgba(11,15,28,.6)', 1); const [x2, y2] = pth(Rp, f); circ(x2, y2 - 8, 7, '#CFE0FF', 'rgba(11,15,28,.6)', 1); }
    // energia: rampa esquerda -> roda -> rampa direita
    for (let i = 0; i < 4; i++) { const f = fr(t * .4 + i / 4); circ(lerp((lx0 + lx1) / 2 + 8, cx - R - 6, f), lerp((yT + yB) / 2, cy, f), 3.5, rgba(C.luz, Math.sin(f * PI))); circ(lerp(cx + R + 6, (rx0 + rx1) / 2 - 8, f), lerp(cy, (yT + yB) / 2, f), 3.5, rgba(C.luz, Math.sin(f * PI))); }
    ring(cx, cy, R, C.atp, 4, 3);
    for (let i = 0; i < 2; i++) { const a = t * .7 + i * PI + PI, up = Math.sin(a) < 0; tok(cx + Math.cos(a) * R, cy + Math.sin(a) * R, up ? 'ATP' : 'ADP + Pᵢ', up ? C.atp : '#C9CFDC'); }
    tx('ciclo do ATP', cx, cy, { w: 600, c: C.dim });
    heat(lx1 - d * .4, yB - 26, t); heat(rx0 + d * 1.4, yB - 30, t, 1, .4); heat(cx, cy - R - 20, t, .8, .7);
    tx('calor', cx, cy - R - 58, { c: C.calor, w: 600 });
    cap('A energia da reação que libera carrega o ATP; o ATP descarrega na reação que consome; parte sempre vira calor');
  }
});

// =====================================================================================
// RESPIRAÇÃO CELULAR
// =====================================================================================
def('resp', 'geral', {
  t: 'Visão geral da respiração', s: 'três etapas, três lugares', c: C.mito, loc: 'Citosol e mitocôndria', alt: 'A glicose é quebrada no citosol; o ciclo de Krebs ocorre na matriz e a cadeia transportadora nas cristas da mitocôndria',
  d: `<p><b>A respiração celular aeróbica transfere a energia da glicose para o ATP, usando O₂ e liberando CO₂ e água.</b> Ela acontece em três etapas, cada uma num lugar da célula.</p>
<span class="eq">C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + energia (ATP e calor)</span>
<p><b>1. Glicólise</b>, no citosol: a glicose é partida em dois piruvatos. <b>2. Ciclo de Krebs</b>, na matriz da mitocôndria: os carbonos saem como CO₂ e os elétrons vão para o NADH e o FADH₂. <b>3. Cadeia transportadora e quimiosmose</b>, nas cristas: os elétrons chegam ao O₂, forma-se água e é produzida a maior parte do ATP.</p>
<p>Respiração celular não é o mesmo que respiração pulmonar. A ventilação nos pulmões só traz o O₂ que as células usam e leva embora o CO₂ que elas produzem.</p>`,
  kv: [['Glicólise', 'citosol; não usa O₂'], ['Ciclo de Krebs', 'matriz mitocondrial'], ['Cadeia e quimiosmose', 'membrana interna (cristas)'], ['Saldo', 'cerca de 30 a 32 ATP por glicose'], ['Em bactérias', 'sem mitocôndria: a cadeia fica na membrana plasmática']],
  enem: 'O que mais cai: onde ocorre cada etapa, quais são os reagentes e os produtos e qual é o papel do O₂. Plantas também respiram, de dia e de noite. E a mitocôndria <b>transforma</b> energia; não cria.',
  links: [LK.mito, LK.origem],
  draw(t) {
    const A = area(), w = A.w, h = A.h; rr(A.x0, A.y0, w, h, 24, rgba(C.cito, .6), rgba(C.memb, .8), 2);
    let g1, M; if (NAR) { g1 = [A.cx, A.y0 + h * .2]; M = { cx: A.cx, cy: A.y0 + h * .66, L: w * .94, Wd: Math.min(h * .44, w * .6) }; } else { g1 = [A.x0 + w * .15, A.cy]; M = { cx: A.x0 + w * .63, cy: A.cy, L: w * .6, Wd: Math.min(h * .68, w * .3) }; }
    const m = mito(M.cx, M.cy, M.L, M.Wd, { n: NAR ? 3 : 4, free: .4 }), kx = m.xl + m.iL * .22, ky = M.cy, kR = Math.min(m.iW * .22, 36);
    const k = m.cr[1], p3 = [k.x, k.y1 + (k.top ? 16 : -16)], top = M.cy - M.Wd / 2, bot = M.cy + M.Wd / 2;
    tx('citosol', A.x0 + 14, A.y1 - 14, { a: 'left', c: C.dim }); if (!NAR) tx('matriz', kx, bot - m.m - 14, { c: C.dim });
    // caminhos
    const gin = NAR ? [A.x0 + 34, g1[1]] : [g1[0], A.y0 + 22];
    arrow(gin[0], gin[1], lerp(gin[0], g1[0], .78), lerp(gin[1], g1[1], .78), rgba(C.glic, .5), 1.5, [4, 4]);
    arrow(g1[0], g1[1], lerp(g1[0], kx, .8), lerp(g1[1], ky, .8), rgba(C.glic, .5), 1.5, [4, 4]);
    arrow(kx + kR, ky, lerp(kx + kR, p3[0], .9), lerp(ky, p3[1], .9), rgba(C.nad, .5), 1.5, [4, 4]);
    fly([gin, g1], fr(t * .11), 'glicose', C.glic);
    fly([g1, [kx, ky]], fr(t * .11 + .5), '2 piruvato', C.glic);
    fly([g1, NAR ? [g1[0] + w * .32, g1[1] - 4] : [g1[0], g1[1] + h * .3]], fr(t * .11 + .2), '2 ATP', C.atp);
    ring(kx, ky, kR, C.mito, 3, 2.5);
    fly([[kx, ky - kR], [kx - 6, top - 22]], fr(t * .11 + .1), 'CO₂', C.co2);
    fly([[kx, ky + kR], [kx - 6, bot + 22]], fr(t * .11 + .6), '2 ATP', C.atp);
    fly([[kx + kR, ky], p3], fr(t * .11 + .35), 'NADH', C.nad); fly([[kx + kR, ky], p3], fr(t * .11 + .85), 'FADH₂', C.nad);
    const oIn = [p3[0] + (NAR ? 40 : 70), k.top ? bot + 26 : top - 26];
    fly([oIn, [p3[0] + 14, p3[1]]], fr(t * .11 + .45), 'O₂', C.o2);
    fly([[p3[0] + 10, p3[1]], [oIn[0] + (NAR ? 50 : 90), oIn[1]]], fr(t * .11 + .95), 'H₂O', C.agua);
    const aOut = NAR ? [M.cx + M.L * .3, (k.top ? top - 24 : bot + 24)] : [M.cx + M.L / 2 + 6, M.cy + (k.top ? -1 : 1) * M.Wd * .3];
    fly([p3, aOut], fr(t * .11 + .7), '≈ 28 ATP', C.atp); fly([p3, aOut], fr(t * .11 + .2), '≈ 28 ATP', C.atp);
    badge(g1[0], g1[1], 1); badge(kx, ky, 2); badge(p3[0], p3[1], 3);
    tx('glicólise', g1[0], g1[1] + 24, { w: 600 }); tx('ciclo de Krebs', kx, ky + kR + 16, { w: 600 }); tx(NAR ? 'cadeia' : 'cadeia transportadora', p3[0], p3[1] + (k.top ? 24 : -24), { w: 600 });
    lab(M.cx + M.L * .36, top + 2, M.cx + M.L * .2, top - 26, 'membrana externa'); lab(k.x + k.cw / 2, (k.y0 + k.y1) / 2, k.x + 44, k.top ? k.y0 + 8 : k.y0 - 8, 'crista');
    cap('1. Glicólise no citosol → 2. Ciclo de Krebs na matriz → 3. Cadeia transportadora nas cristas, onde o O₂ é usado');
  }
});

def('resp', 'glicolise', {
  t: 'Glicólise', s: 'a glicose é partida em dois piruvatos', c: C.glic, loc: 'Citosol',
  d: `<p><b>A glicólise parte a glicose (6 carbonos) em duas moléculas de piruvato (3 carbonos cada), no citosol.</b> São dez reações em sequência, cada uma com sua enzima. No começo a célula gasta 2 ATP para ativar a glicose (fase de investimento). Depois recupera 4 ATP (fase de rendimento), o que dá um saldo de 2 ATP.</p>
<p>No caminho, a glicose perde elétrons e hidrogênios, recolhidos pelo <b>NAD⁺</b>, um transportador de elétrons. Carregado, ele vira <b>NADH</b>.</p>
<p>A glicólise não usa O₂ e existe em praticamente todos os seres vivos, sinal de que é uma via muito antiga. O destino do piruvato depende do oxigênio: com O₂, ele entra na mitocôndria; sem O₂, segue para a fermentação.</p>`,
  kv: [['Onde', 'citosol'], ['Entra', '1 glicose, 2 NAD⁺, 2 ADP + 2 Pᵢ (saldo)'], ['Sai', '2 piruvatos, 2 NADH, 2 ATP (saldo)'], ['Precisa de O₂', 'não']],
  enem: 'A glicólise é a etapa comum à respiração e à fermentação e ocorre <b>fora</b> da mitocôndria. As questões pedem o saldo (2 ATP) e o destino do piruvato com e sem O₂. As hemácias humanas, que não têm mitocôndrias, vivem só de glicólise seguida de fermentação lática.',
  links: [LK.biom, ['Fermentação', '#ferm/latica']],
  draw(t) {
    const A = area(), P = (f, o) => NAR ? [A.cx + o, A.y0 + 26 + f * (A.h - 52)] : [A.x0 + 20 + f * (A.w - 40), A.cy + o];
    const off = NAR ? Math.min(62, A.w * .2) : Math.min(84, A.h * .2), r = NAR ? 6 : 8, L = off + (NAR ? 34 : 46);
    rr(A.x0, A.y0, A.w, A.h, 24, rgba(C.cito, .6), rgba(C.memb, .5), 1.5); tx('citosol', A.x0 + 14, A.y1 - 14, { a: 'left', c: C.dim });
    const tr = 'rgba(232,237,247,.22)'; poly([P(.05, 0), P(.44, 0)], tr, 2, [5, 5]); for (const sg of [-1, 1]) poly([P(.44, 0), P(.58, sg * off), P(.95, sg * off)], tr, 2, [5, 5]);
    const p = fr(t * .08), f = .05 + Math.min(1, p / .86) * .9;
    tx('glicose (6 C)', ...(NAR ? [A.cx, P(.05, 0)[1] - 18] : [P(.05, 0)[0] + 34, A.cy - 26]), { w: 600, c: f < .2 ? C.txt : C.dim });
    tx('2 piruvatos (3 C cada)', ...(NAR ? [A.cx, P(.95, 0)[1] + 18] : [P(.95, 0)[0] - 60, A.cy]), { w: 600, c: f > .9 ? C.txt : C.dim });
    if (f < .44) { const q = P(f, 0); cchain(q[0], q[1], 6, r); }
    else { const o = ss((f - .44) / .14) * off; for (const sg of [-1, 1]) { const q = P(f, sg * o); cchain(q[0], q[1], 3, r); } }
    const k1 = seg(f, .12, .27), k2 = seg(f, .27, .42), k3 = seg(f, .62, .86);
    if (k1 > 0 && k1 < 1) fly([P(.14, -L), P(.26, -r * 3)], k1 * .6, '2 ATP', C.atp);
    if (k2 > 0 && k2 < 1) fly([P(.28, -r * 3), P(.4, -L)], .4 + k2 * .6, '2 ADP', '#C9CFDC');
    if (k3 > 0 && k3 < 1) { fly([P(.66, -off - 12), P(.8, -L - 6)], .25 + k3 * .7, '2 NADH', C.nad); fly([P(.66, off + 12), P(.8, L + 6)], .25 + k3 * .7, '4 ATP', C.atp); }
    cap(f < .3 ? 'Investimento: a célula gasta 2 ATP para ativar a glicose' : f < .6 ? 'A molécula de 6 carbonos é partida em duas de 3 carbonos' : f < .9 ? 'Rendimento: formam-se 4 ATP e 2 NADH' : 'Saldo da glicólise: 2 ATP, 2 NADH e 2 piruvatos');
  }
});

// fichas nas estações de um ciclo: apagadas em repouso, acendem quando a molécula passa
function estacao(cx, cy, R, ang, s, c, k, rad = 1.44) { const on = k > 0 && k < 1, rr2 = R * (rad + (on ? .16 * Math.sin(k * PI) : 0)); tok(cx + Math.cos(ang) * rr2, cy + Math.sin(ang) * rr2, s, c, { a: on ? 1 : .32 }); }

def('resp', 'krebs', {
  t: 'Ciclo de Krebs', s: 'os carbonos saem como CO₂', c: C.mito, loc: 'Matriz mitocondrial',
  d: `<p><b>O ciclo de Krebs termina de desmontar a glicose: os carbonos saem como CO₂ e os elétrons são entregues a transportadores.</b> Antes do ciclo, cada piruvato entra na mitocôndria, perde um CO₂ e vira <b>acetil-CoA</b> (2 carbonos), formando um NADH.</p>
<p>Na matriz, o acetil-CoA se une ao oxaloacetato (4 carbonos) e forma citrato (6 carbonos). A cada volta saem 2 CO₂ e são formados 3 NADH, 1 FADH₂ e 1 ATP. O oxaloacetato é refeito no fim, e por isso o processo é um ciclo. Como cada glicose rende dois piruvatos, o ciclo gira duas vezes.</p>
<p>O CO₂ que você expira vem daqui e da oxidação do piruvato. O ciclo quase não produz ATP diretamente: ele produz elétrons de alta energia, levados pelo NADH e pelo FADH₂ até a cadeia transportadora. Ácidos graxos e aminoácidos também alimentam o ciclo, depois de convertidos em acetil-CoA ou em intermediários.</p>`,
  kv: [['Onde', 'matriz mitocondrial'], ['Por glicose (2 voltas)', '2 ATP, 6 NADH, 2 FADH₂ e 4 CO₂'], ['Oxidação dos 2 piruvatos', '2 NADH e 2 CO₂'], ['Outros nomes', 'ciclo do ácido cítrico; ciclo dos ácidos tricarboxílicos']],
  enem: 'Costuma cair a origem do CO₂ expirado (ciclo de Krebs e oxidação do piruvato, não a cadeia transportadora) e o lugar do ciclo (matriz). O O₂ não participa diretamente, mas sem ele o ciclo para, porque o NADH deixa de ser reciclado em NAD⁺.',
  links: [LK.mito, LK.origem],
  draw(t) {
    const A = area(), R = Math.min(A.w * (NAR ? .235 : .2), A.h * .27), cx = NAR ? A.cx : A.x0 + A.w * .56, cy = A.y0 + A.h * (NAR ? .6 : .54);
    rr(A.x0, A.y0, A.w, A.h, 24, 'rgba(242,92,59,.12)', rgba(C.mito, .55), 2); tx('matriz mitocondrial', A.x1 - 14, A.y1 - 14, { a: 'right', c: C.dim });
    ring(cx, cy, R, C.mito, 6, 3);
    tx('ciclo de Krebs', cx, cy - 9, { f: FH, s: NAR ? 13 : 16, w: 600, c: C.txt }); tx('2 voltas por glicose', cx, cy + 11, { c: C.dim });
    const q = fr(t * .065), e0 = NAR ? [A.x0 + 52, A.y0 + 24] : [A.x0 + A.w * .12, A.y0 + A.h * .18], e1 = [cx, cy - R];
    arrow(e0[0], e0[1] + 12, lerp(e0[0], e1[0], .88), lerp(e0[1], e1[1], .88), 'rgba(232,237,247,.3)', 1.5, [4, 4]);
    tx('piruvato (3 C)', e0[0], e0[1] - 8 + (NAR ? -4 : 0), { w: 600, c: q < .1 ? C.txt : C.dim, a: NAR ? 'center' : 'center' });
    const em = [lerp(e0[0], e1[0], .5), lerp(e0[1], e1[1], .5)], nx = NAR ? 1 : .6, ke = seg(q, .07, .2);
    tok(em[0] + 46 * nx + (ke > 0 && ke < 1 ? 14 * Math.sin(ke * PI) : 0), em[1] - 26, 'CO₂', C.co2, { a: ke > 0 && ke < 1 ? 1 : .32 }); tok(em[0] + 62 * nx + (ke > 0 && ke < 1 ? 14 * Math.sin(ke * PI) : 0), em[1] - 2, 'NADH', C.nad, { a: ke > 0 && ke < 1 ? 1 : .32 });
    const qa = seg(q, .2, 1), r = NAR ? 5 : 8;
    if (q < .2) { const f = ss(q / .2); cchain(lerp(e0[0], e1[0], f), lerp(e0[1] + 12, e1[1], f), f < .5 ? 3 : 2, r); if (f > .5) tx('acetil-CoA (2 C)', lerp(e0[0], e1[0], f) + (NAR ? 0 : -70), lerp(e0[1] + 12, e1[1], f) + (NAR ? 18 : 0), { c: C.txt, w: 600 }); }
    else { const a = -PI / 2 + qa * TAU, n = qa < .25 ? 6 : qa < .42 ? 5 : 4, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R; rr(x - n * r * .95 - 6, y - r - 5, n * r * 1.9 + 12, r * 2 + 10, 999, 'rgba(11,15,28,.75)'); cchain(x, y, n, r); }
    const E = [[.25, -.17, 'CO₂', C.co2], [.25, .17, 'NADH', C.nad], [.42, -.17, 'CO₂', C.co2], [.42, .17, 'NADH', C.nad], [.57, 0, 'ATP', C.atp], [.72, 0, 'FADH₂', C.nad], [.88, 0, 'NADH', C.nad]];
    for (const [fs, da, s, c] of E) estacao(cx, cy, R, -PI / 2 + fs * TAU + da * (NAR ? 1.5 : 1), s, c, q < .2 ? 0 : seg(qa, fs - .02, fs + .15), NAR ? 1.42 : 1.5);
    cap(q < .2 ? 'O piruvato perde um CO₂ e vira acetil-CoA (2 C)' : qa < .22 ? 'Acetil-CoA (2 C) + oxaloacetato (4 C) → citrato (6 C)' : qa < .55 ? 'Saem 2 CO₂: os carbonos da glicose terminam aqui' : qa < .7 ? 'Forma-se 1 ATP por volta' : 'FADH₂ e NADH levam elétrons para a cadeia; o oxaloacetato (4 C) é refeito');
  }
});

def('resp', 'cadeia', {
  t: 'Cadeia transportadora e quimiosmose', s: 'gradiente de H⁺ e ATP sintase', c: C.mito, loc: 'Cristas da mitocôndria', still: 3,
  alt: 'Elétrons passam por proteínas da membrana interna até o oxigênio; prótons são bombeados da matriz para o espaço intermembranas e voltam pela ATP sintase',
  ctl: { l: 'Oferta de O₂', min: 0, max: 100, step: 5, v: 100, f: v => v + ' %', rate: v => v / 100 },
  d: `<p><b>A cadeia transportadora de elétrons e a quimiosmose produzem a maior parte do ATP da respiração.</b> Elas ficam na membrana interna da mitocôndria, dobrada em <b>cristas</b>, que aumentam a área disponível.</p>
<p>O NADH e o FADH₂ entregam seus elétrons a uma fila de proteínas (complexos I a IV). Ao passar de uma para a outra, os elétrons perdem energia, e essa energia é usada para bombear prótons (H⁺) <b>da matriz para o espaço intermembranas</b>. No fim da fila, os elétrons são recebidos pelo <b>O₂, o aceptor final</b>, que se junta a H⁺ e forma água.</p>
<p>Os H⁺ acumulados só conseguem voltar à matriz por dentro da <b>ATP sintase</b>. A passagem faz a enzima girar e unir ADP e fosfato, formando ATP. Esse acoplamento entre o gradiente de prótons e a síntese de ATP é a <b>quimiosmose</b>; as duas etapas juntas são a fosforilação oxidativa. Leve o controle "Oferta de O₂" a zero e veja a cadeia parar.</p>`,
  kv: [['Onde', 'membrana interna (cristas)'], ['Doadores de elétrons', 'NADH e FADH₂'], ['Aceptor final', 'O₂, que forma H₂O'], ['Caminho dos H⁺', 'matriz → espaço intermembranas → matriz, pela ATP sintase'], ['Rende', 'cerca de 26 a 28 ATP por glicose']],
  enem: 'É o tópico de mitocôndria mais cobrado. Guarde três ideias: o O₂ é o aceptor final dos elétrons e forma água; os H⁺ são bombeados da matriz para o espaço intermembranas; o ATP é feito pela ATP sintase quando os H⁺ voltam. Questões com cianeto (bloqueia o complexo IV) ou com desacopladores (deixam os H⁺ vazarem pela membrana, e a energia vira calor) cobram esse raciocínio.',
  links: [LK.mito, LK.origem],
  init(S) { S.g = S.v / 100; S.r2 = S.ph; },
  draw(t, S) {
    const A = area(), v = S.v / 100; S.g += (v - S.g) * Math.min(1, S.dt * 1.1); S.r2 += S.dt * S.g; const g = S.g;
    const mh = NAR ? 34 : 58, ym = A.y0 + A.h * .46, x0 = A.x0, w = A.w, mt = ym - mh / 2, mb = ym + mh / 2;
    rr(x0, A.y0, w, ym - A.y0, 14, C.inter); rr(x0, ym, w, A.y1 - ym, 14, 'rgba(242,92,59,.17)');
    membrane(x0, A.x1, ym, mh, C.mito);
    tx('espaço intermembranas', x0 + 12, A.y0 + 14, { a: 'left', w: 600, c: '#E3C9C0' }); tx('matriz', x0 + 12, A.y1 - 14, { a: 'left', w: 600, c: '#E3C9C0' });
    const px = f => x0 + w * f, pw = NAR ? 32 : 68, ph = mh + (NAR ? 20 : 36), xI = px(.1), xII = px(.26), xIII = px(.43), xIV = px(.65), xS = px(.88);
    // gradiente: H⁺ acumulados no espaço intermembranas
    const Rn = rng(11), N = NAR ? 30 : 70;
    for (let i = 0; i < N; i++) { const bx = x0 + 14 + Rn() * (w - 28), by = A.y0 + 30 + Rn() * Math.max(10, mt - A.y0 - 44), k = Rn(); if (k < g * .95 + .05) hplus(bx + Math.sin(t * 1.1 + i) * 3, by + Math.cos(t * .9 + i * 2) * 3, NAR ? 5 : 6, .9); }
    for (let i = 0; i < 4; i++) hplus(px(.18 + i * .16) + Math.sin(t + i) * 3, mb + 46 + (i % 2) * 22, NAR ? 5 : 6, .4);
    // caminho dos elétrons
    const ep = [[xI, mb + 30], [xI, ym + 3], [xIII, ym + 3], [xIII, mt - 9], [xIV, mt - 9], [xIV, ym], [xIV, mb + 32]];
    poly(ep, rgba(C.e, .28), 2, [3, 5]);
    protein(xI, ym, pw, ph, '#E9A07A', 'I'); protein(xII, ym + mh * .34, pw * .8, mh * .9, '#C98A6E', 'II'); protein(xIII, ym, pw, ph, '#E9A07A', 'III'); protein(xIV, ym, pw, ph, '#E9A07A', 'IV');
    const qx = lerp(xII + pw * .75, xIII - pw * .8, .5 - .5 * Math.cos(t * 1.6)), cxx = lerp(xIII + pw * .8, xIV - pw * .8, .5 - .5 * Math.cos(t * 1.6 + 1.5));
    circ(qx, ym + 3, 9, '#D7C2FF', 'rgba(11,15,28,.6)', 1); tx('Q', qx, ym + 3.5, { s: 12, w: 700, c: '#0B0F1C', bg: false });
    circ(cxx, mt - 9, 9, '#FFB3C7', 'rgba(11,15,28,.6)', 1); tx('c', cxx, mt - 9.5, { s: 12, w: 700, c: '#0B0F1C', bg: false });
    const on = cl(v * 4, 0, 1);
    if (on > 0) {
      for (let i = 0; i < 6; i++) { const f = fr(t * .2 + i / 6), [x, y] = pth(ep, f); elec(x, y, 4.5, on * Math.min(1, Math.sin(f * PI) * 4)); }
      for (let i = 0; i < 2; i++) { const f = fr(t * .5 + i / 2); elec(xII, lerp(mb + 30, ym + 10, f), 4, on * Math.sin(f * PI)); }
      for (const xp of [xI, xIII, xIV]) for (let j = 0; j < 2; j++) { const f = fr(t * .55 + j / 2 + xp * .013); hplus(xp + pw / 2 + 6, lerp(mb + 24, mt - 26, f), NAR ? 5 : 6, on * Math.min(1, Math.sin(f * PI) * 2.5)); }
      for (const xp of [xI, xIII, xIV]) arrow(xp + pw / 2 + 6, mb + 8, xp + pw / 2 + 6, mt - 14, rgba(C.h, .35), 1.5);
    }
    tok(xI, mb + 46, 'NADH', C.nad); tok(xII, mb + 46 + (NAR ? 24 : 0), 'FADH₂', C.nad);
    tok(xIV + (NAR ? 8 : 26), mb + 48, 'O₂', C.o2, { a: .25 + .75 * on });
    if (on > 0) fly([[xIV - 4, mb + 50], [xIV - (NAR ? 34 : 70), A.y1 - 34]], fr(t * .25), 'H₂O', C.agua);
    // ATP sintase
    const sy = synthase(xS, ym, mh, 1, S.r2 * 1.6, NAR ? .9 : 1.5);
    if (g > .03) { for (let j = 0; j < 3; j++) { const f = fr(S.r2 * .6 + j / 3); hplus(xS, lerp(mt - 30, mb + 8, f), NAR ? 5 : 6, Math.min(1, Math.sin(f * PI) * 2.5)); } fly([[xS - 6, sy.hy + sy.hr + 4], [xS - (NAR ? 26 : 60), A.y1 - 30]], fr(S.r2 * .28), 'ATP', C.atp); }
    tok(xS - sy.hr - (NAR ? 24 : 34), sy.hy, NAR ? 'ADP' : 'ADP + Pᵢ', '#C9CFDC', { a: .9 });
    lab(xS + 8, mt - 2, xS - 20, A.y0 + 40, 'ATP sintase'); lab(xIII, mt - ph / 2 + mh / 2 - 2, xIII - 30, A.y0 + 68, 'cadeia transportadora');
    lab(qx, ym + 3, qx - 10, mb + (NAR ? 112 : 96), 'ubiquinona'); lab(cxx, mt - 9, cxx + 10, A.y0 + 96, 'citocromo c');
    const st = Math.floor(t / 4.5) % 3;
    cap(v === 0 ? 'Sem O₂ para receber os elétrons, a cadeia para: o bombeamento de H⁺ e a produção de ATP cessam' : ['1. Os elétrons do NADH e do FADH₂ passam de proteína em proteína até o O₂, que forma água', '2. A energia liberada bombeia H⁺ da matriz para o espaço intermembranas', '3. Os H⁺ voltam pela ATP sintase, que gira e forma ATP: é a quimiosmose'][st]);
  }
});

def('resp', 'saldo', {
  t: 'Saldo de ATP', s: 'cerca de 30 a 32 por glicose', c: C.atp, loc: 'Por molécula de glicose', still: 9,
  ctl: { l: 'Cálculo', min: 0, max: 1, step: 1, v: 0, f: v => v ? 'livros antigos' : 'atual', rate: () => 1 },
  d: `<p><b>Uma glicose rende cerca de 30 a 32 ATP na respiração aeróbica.</b> Só 4 deles são feitos diretamente na glicólise e no ciclo de Krebs. O restante vem da cadeia transportadora, a partir dos elétrons levados por 10 NADH e 2 FADH₂.</p>
<p>Os livros mais antigos trazem <b>36 a 38 ATP</b>. Eles contavam 3 ATP por NADH e 2 por FADH₂. Medidas mais recentes mostram um rendimento menor, perto de 2,5 e 1,5, porque são necessários cerca de 4 H⁺ para produzir e exportar cada ATP. Use o controle "Cálculo" para comparar as duas contas.</p>
<p>A diferença entre 30 e 32 depende de como os elétrons do NADH da glicólise entram na mitocôndria: o NADH não atravessa a membrana interna, e o rendimento muda conforme a "lançadeira" que leva os elétrons. O número é um teto; na célula viva o rendimento varia.</p>`,
  kv: [['Glicólise', '2 ATP e 2 NADH'], ['Oxidação do piruvato', '2 NADH'], ['Ciclo de Krebs', '2 ATP, 6 NADH e 2 FADH₂'], ['Fosforilação oxidativa', 'cerca de 26 a 28 ATP'], ['Fermentação, para comparar', '2 ATP por glicose']],
  enem: 'O ENEM raramente cobra o número exato; cobra a comparação: a respiração aeróbica rende muito mais ATP por glicose do que a fermentação (2 ATP). Se a questão trouxer 36 ou 38, use o dado do enunciado: é a conta dos livros mais antigos.',
  links: [LK.mito, ['Fermentação', '#ferm/latica']],
  draw(t, S) {
    const A = area(), old = S.v >= .5, kn = old ? 3 : 2.5, kf = old ? 2 : 1.5, ox = 10 * kn + 2 * kf, tot = 4 + ox, p = fr(t * .07);
    const rows = [['Glicólise', 'citosol', 2, '+ 2 NADH', 0, .14], ['Ciclo de Krebs', 'matriz, com a oxidação do piruvato', 2, '+ 8 NADH e 2 FADH₂', .16, .3], ['Cadeia e quimiosmose', 'cristas', ox, `10 NADH × ${nbr(kn, 1)} + 2 FADH₂ × ${nbr(kf, 1)}`, .34, .72]];
    const rh = (A.h - (NAR ? 52 : 60)) / 3, r = NAR ? 5 : 8, per = NAR ? 17 : 34, xc = A.x0 + (NAR ? 12 : 24);
    let sum = 0;
    rows.forEach(([n, onde, q, car, a, b], i) => {
      const y = A.y0 + i * rh, sh = Math.round(q * seg(p, a, b)); sum += sh;
      rr(A.x0, y + 2, A.w, rh - 6, 12, 'rgba(19,26,43,.6)', i === 2 ? rgba(C.mito, .6) : C.line, 1);
      badge(xc + 8, y + 22, i + 1); tx(n, xc + 28, y + 22, { a: 'left', f: FH, s: NAR ? 14 : 16, w: 600, c: C.txt, bg: false }); tx(onde, NAR ? xc + 28 : A.x1 - 20, NAR ? y + 40 : y + 22, { a: NAR ? 'left' : 'right', c: C.dim, bg: false });
      const cy0 = y + (NAR ? 62 : 52);
      for (let k = 0; k < q; k++) { const cxk = xc + 8 + (k % per) * (r * 2 + 3), cyk = cy0 + Math.floor(k / per) * (r * 2 + 4); circ(cxk, cyk, r, k < sh ? C.atp : 'rgba(91,108,153,.3)', 'rgba(11,15,28,.5)', 1); }
      tx(car, xc, Math.min(y + rh - 16, cy0 + (Math.ceil(q / per)) * (r * 2 + 4) + 8), { a: 'left', f: FD, s: 12, w: 500, c: C.nad, bg: false });
      tx(`${sh} ATP`, A.x1 - 16, y + rh - 18, { a: 'right', f: FD, s: 13, w: 500, c: C.txt, bg: false });
    });
    // transportadores descem para a etapa 3
    
    const yb = A.y1 - (NAR ? 34 : 38);
    rr(A.x0, yb, A.w, NAR ? 32 : 36, 12, C.atp); tx(`Total: ${sum < tot ? sum + ' ATP…' : 'cerca de ' + (tot - 2) + ' a ' + tot + ' ATP por glicose'}`, A.cx, yb + (NAR ? 16 : 18) + .5, { f: FH, s: NAR ? 14 : 17, w: 700, c: '#0B0F1C', bg: false });
    cap(old ? 'Conta dos livros antigos: 3 ATP por NADH e 2 por FADH₂, total de 36 a 38' : 'Conta atual: cerca de 2,5 ATP por NADH e 1,5 por FADH₂, total de 30 a 32');
  }
});

// =====================================================================================
// FERMENTAÇÃO
// =====================================================================================
function fermento(t, al) {
  const A = area(), Pw = NAR ? A.w : A.w * .6, Ph = NAR ? A.h * .52 : A.h, py = A.y0 + Ph * (NAR ? .34 : .36), xs = [A.x0 + Pw * .13, A.x0 + Pw * .5, A.x0 + Pw * .87], r = NAR ? 5 : 9;
  rr(A.x0, A.y0, Pw, Ph, 20, rgba(C.cito, .6), rgba(C.memb, .5), 1.5); tx('citosol', A.x0 + 12, A.y0 + 14, { a: 'left', c: C.dim });
  arrow(xs[0] + 8, py, xs[1] - (NAR ? 34 : 44), py, 'rgba(232,237,247,.3)', 1.5, [4, 4]); arrow(xs[1] + 8, py, xs[2] - (NAR ? 30 : 40), py, 'rgba(232,237,247,.3)', 1.5, [4, 4]);
  tx('glicose', xs[0], py + 32, { w: 600 }); tx('2 piruvatos', xs[1], py + 32, { w: 600 }); tx(al ? '2 etanol' : '2 lactatos', xs[2], py + 32, { w: 600 });
  tx('glicólise', (xs[0] + xs[1]) / 2, py - 44, { c: C.dim }); tx(al ? 'sai CO₂' : 'sem CO₂', (xs[1] + xs[2]) / 2, py - 44, { c: C.dim });
  for (let i = 0; i < 2; i++) {
    const f = fr(t * .08 + i / 2), x = lerp(xs[0], xs[2], f), a = Math.min(1, Math.sin(f * PI) * 5);
    if (f < .22) cchain(x, py, 6, r, { a });
    else { const n = al && f > .62 ? 2 : 3, o = ss((f - .22) / .1) * (r + 3), c = f > .62 ? (al ? '#CFE0FF' : light(C.creme, .1)) : C.c; cchain(x, py - o, n, r, { a, c }); cchain(x, py + o, n, r, { a, c }); }
    if (al) { const k = seg(f, .56, .8); if (k > 0 && k < 1) tok(lerp(xs[1], xs[2], .35) + k * 10, py - 16 - k * (NAR ? 34 : 50), '2 CO₂', C.co2, { a: Math.sin(k * PI) }); }
    const ka = seg(f, .2, .46); if (ka > 0 && ka < 1) tok((xs[0] + xs[1]) / 2, py - 16 - ka * 18, '2 ATP', C.atp, { a: Math.sin(ka * PI) });
  }
  // o NAD⁺ é reciclado
  const lx = (xs[0] + xs[2]) / 2, ly = py + (NAR ? 76 : 96), lrx = (xs[2] - xs[0]) * .28, lry = NAR ? 18 : 24;
  ell(lx, ly, lrx, lry, 0, null, rgba(C.nad, .6), 2); arrowHead(lx + 4, ly - lry, 0, C.nad, 9); arrowHead(lx - 4, ly + lry, PI, C.nad, 9);
  for (let i = 0; i < 2; i++) { const a = t * .8 + i * PI, up = Math.sin(a) < 0; tok(lx + Math.cos(a) * lrx, ly + Math.sin(a) * lry, up ? 'NADH' : 'NAD⁺', up ? C.nad : '#C9CFDC'); }
  tx('o NAD⁺ é reciclado', lx, ly + lry + 22, { c: C.dim });
  // aplicações
  const Q = NAR ? { x0: A.x0, y0: A.y0 + A.h * .56, w: A.w, h: A.h * .44 } : { x0: A.x0 + A.w * .64, y0: A.y0, w: A.w * .36, h: A.h };
  const c1 = NAR ? [Q.x0 + Q.w * .25, Q.y0 + Q.h * .42] : [Q.x0 + Q.w * .5, Q.y0 + Q.h * .24], c2 = NAR ? [Q.x0 + Q.w * .75, Q.y0 + Q.h * .42] : [Q.x0 + Q.w * .5, Q.y0 + Q.h * .7], u = NAR ? Math.min(Q.w * .17, Q.h * .28) : Math.min(Q.w * .22, Q.h * .15);
  const ly1 = c1[1] + u * 1.15 + 14, ly2 = c2[1] + u * 1.15 + 14;
  if (!al) {
    // pote de iogurte com lactobacilos
    X.beginPath(); X.moveTo(c1[0] - u, c1[1] - u * .9); X.lineTo(c1[0] + u, c1[1] - u * .9); X.lineTo(c1[0] + u * .72, c1[1] + u); X.lineTo(c1[0] - u * .72, c1[1] + u); X.closePath(); X.fillStyle = '#F4F1E8'; X.fill(); X.strokeStyle = C.line; X.lineWidth = 2; X.stroke();
    rr(c1[0] - u * 1.1, c1[1] - u * 1.05, u * 2.2, u * .22, 3, '#CFE0FF');
    const Rn = rng(5); for (let i = 0; i < 9; i++) { const bx = c1[0] + (Rn() - .5) * u * 1.15, by = c1[1] + (Rn() - .4) * u * 1.3, a = Rn() * PI + Math.sin(t * .6 + i) * .25; X.save(); X.translate(bx, by); X.rotate(a); rr(-u * .2, -u * .065, u * .4, u * .13, 9, C.nucleo); X.restore(); }
    tl(['iogurte e queijo:', 'lactobacilos'], c1[0], ly1);
    // fibra muscular
    const mw = u * 2.4, mhh = u * .8; rr(c2[0] - mw / 2, c2[1] - mhh / 2, mw, mhh, mhh / 2, '#C4504E', 'rgba(11,15,28,.5)', 1.5);
    X.save(); X.beginPath(); X.roundRect(c2[0] - mw / 2, c2[1] - mhh / 2, mw, mhh, mhh / 2); X.clip(); const sq = 1 + .12 * Math.sin(t * 2.2); for (let i = -9; i <= 9; i++) line(c2[0] + i * mw / 16 * sq, c2[1] - mhh / 2, c2[0] + i * mw / 16 * sq, c2[1] + mhh / 2, 'rgba(11,15,28,.35)', 2); X.restore();
    tl(['músculo em', 'esforço intenso'], c2[0], ly2);
  } else {
    // massa de pão crescendo
    const gk = .55 + .45 * ss(fr(t * .06) * 1.4), dw = u * 1.25, dh = u * 1.5 * gk;
    X.beginPath(); X.moveTo(c1[0] - dw, c1[1] + u); X.bezierCurveTo(c1[0] - dw * 1.15, c1[1] + u - dh * 1.3, c1[0] + dw * 1.15, c1[1] + u - dh * 1.3, c1[0] + dw, c1[1] + u); X.closePath(); X.fillStyle = '#E8C99A'; X.fill(); X.strokeStyle = 'rgba(11,15,28,.5)'; X.lineWidth = 1.5; X.stroke();
    const Rn = rng(8); for (let i = 0; i < 8; i++) { const bx = c1[0] + (Rn() - .5) * dw * 1.3, by = c1[1] + u - (.15 + Rn() * .55) * dh; circ(bx, by, (2 + Rn() * 3) * gk, 'rgba(255,255,255,.35)', 'rgba(11,15,28,.3)', 1); }
    line(c1[0] - dw * 1.2, c1[1] + u, c1[0] + dw * 1.2, c1[1] + u, C.line, 2);
    tl(['pão: o CO₂ faz', 'a massa crescer'], c1[0], ly1);
    // leveduras brotando
    const Y = [[-.7, -.1], [.15, .2], [.8, -.25]]; Y.forEach(([a, b], i) => { const x = c2[0] + a * u, y = c2[1] + b * u + Math.sin(t * .8 + i) * 2; ell(x, y, u * .36, u * .3, .3, rgba(C.creme, .8), C.parede, 2); ell(x + u * .4, y - u * .22, u * .17, u * .15, .3, rgba(C.creme, .8), C.parede, 2); circ(x - u * .08, y + u * .02, u * .1, C.nucleo); });
    for (let i = 0; i < 4; i++) { const f = fr(t * .3 + i / 4); circ(c2[0] + (i - 1.5) * u * .5, c2[1] - u * .5 - f * u * .7, 3, null, rgba(C.co2, Math.sin(f * PI)), 1.5); }
    tl(['leveduras: cerveja,', 'vinho e etanol'], c2[0], ly2);
  }
  cap(al ? 'Fermentação alcoólica: <span class="q">glicose → 2 etanol + 2 CO₂ + 2 ATP</span>' : 'Fermentação lática: <span class="q">glicose → 2 lactato + 2 ATP</span>');
}

def('ferm', 'latica', {
  t: 'Fermentação lática', s: 'iogurte e esforço muscular intenso', c: C.creme, loc: 'Citosol, sem O₂', alt: 'A glicose vira dois piruvatos e depois dois lactatos; o NADH volta a ser NAD⁺',
  d: `<p><b>Na fermentação, a célula obtém ATP sem usar O₂, só com a glicólise.</b> O problema é que a glicólise gasta NAD⁺ e, sem a cadeia transportadora, ele acabaria. A fermentação resolve isso: o NADH devolve seus elétrons ao próprio piruvato e volta a ser NAD⁺, pronto para outra glicólise.</p>
<p>Na <b>fermentação lática</b>, o piruvato vira <b>lactato</b> (ácido lático), sem liberar CO₂. É o que fazem os lactobacilos do iogurte, da coalhada e de muitos queijos: o ácido baixa o pH e faz as proteínas do leite coagularem.</p>
<p>Nossas fibras musculares também fermentam quando o esforço é intenso e o O₂ não chega na velocidade necessária. O rendimento é baixo, 2 ATP por glicose, porque a maior parte da energia continua presa no lactato.</p>`,
  kv: [['Onde', 'citosol'], ['Equação', '<span class="q">glicose → 2 lactato + 2 ATP</span>'], ['Libera CO₂', 'não'], ['Quem faz', 'lactobacilos, fibras musculares, hemácias'], ['Aplicações', 'iogurte, queijos, chucrute, silagem']],
  enem: 'Aparece em produção de alimentos e em exercício físico. Cuidado com uma ideia antiga: a dor muscular que surge um ou dois dias depois do exercício não é causada pelo ácido lático, e sim por microlesões nas fibras. O lactato é reaproveitado em pouco tempo pelo fígado e pelo coração. Já a fadiga durante o esforço intenso está ligada, entre outros fatores, ao aumento da acidez no músculo.',
  links: [['Glicólise', '#resp/glicolise'], LK.biom],
  draw(t) { fermento(t, false); }
});
def('ferm', 'alcoolica', {
  t: 'Fermentação alcoólica', s: 'pão, cerveja e etanol', c: C.creme, loc: 'Citosol, sem O₂', alt: 'A glicose vira dois piruvatos, que perdem CO₂ e formam etanol; o NADH volta a ser NAD⁺',
  d: `<p><b>Na fermentação alcoólica, o piruvato perde um CO₂ e vira etanol.</b> Como na lática, o que a célula ganha é o NAD⁺ reciclado, que mantém a glicólise funcionando. O saldo também é de 2 ATP por glicose.</p>
<p>Quem faz são principalmente as <b>leveduras</b>, fungos unicelulares como <i>Saccharomyces cerevisiae</i>, e algumas bactérias. No pão, as bolhas de CO₂ ficam presas na massa e a fazem crescer; o etanol evapora no forno. Na cerveja, no vinho e no etanol combustível, o produto que interessa é o álcool.</p>
<p>As leveduras são <b>anaeróbias facultativas</b>: com O₂, respiram e se multiplicam mais depressa; sem O₂, fermentam. Fermentação não é o mesmo que <b>respiração anaeróbica</b>, na qual há cadeia transportadora, mas o aceptor final dos elétrons é outra substância (nitrato ou sulfato, por exemplo) em vez do O₂.</p>`,
  kv: [['Onde', 'citosol'], ['Equação', '<span class="q">glicose → 2 etanol + 2 CO₂ + 2 ATP</span>'], ['Libera CO₂', 'sim'], ['Quem faz', 'leveduras e algumas bactérias'], ['Aplicações', 'pão, cerveja, vinho, etanol de cana']],
  enem: 'Tema frequente em biotecnologia: etanol de cana-de-açúcar, pão e bebidas. Perguntas típicas: por que a massa cresce (CO₂), por que a dorna de fermentação fica fechada (sem O₂, a levedura fermenta em vez de respirar) e por que o rendimento em ATP é baixo.',
  links: [['Glicólise', '#resp/glicolise'], ['Ciclo do carbono', '#relacao/carbono']],
  draw(t) { fermento(t, true); }
});
