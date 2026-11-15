/* LAB · Biologia Molecular. Cenas: lipídios, proteínas, ácidos nucleicos. Código e textos da equipe (Apolo). */
'use strict';
const BASE = { A: '#39E58C', T: '#FF4F6D', G: '#FFC53D', C: '#3FA9FF', U: '#C77DFF' };
const PUR = { A: 1, G: 1 };

// cadeia em zigue-zague (hidrocarboneto); kink: índice onde há dupla cis (dobra) ou trans (sem dobra)
function zz(x, y, n, ang, sg, o = {}) {
  const pts = [[x, y]]; let a = ang, px = x, py = y;
  for (let i = 1; i <= n; i++) { if (o.cis && i === o.cis) a += .55; const z = (i % 2 ? 1 : -1) * .5; px += Math.cos(a + z) * sg; py += Math.sin(a + z) * sg; pts.push([px, py]); }
  poly(pts, o.c || 'rgba(232,237,247,.8)', o.lw || 2);
  if (o.dupla) { const k = o.dupla, [ax, ay] = pts[k - 1], [bx, by] = pts[k], nx = -(by - ay), ny = bx - ax, L = Math.hypot(nx, ny) || 1; line(ax + nx / L * 3.5, ay + ny / L * 3.5, bx + nx / L * 3.5, by + ny / L * 3.5, C.s, 2); }
  return pts;
}

// =====================================================================================
// LIPÍDIOS
// =====================================================================================
def('lip', 'glicerideos', {
  t: 'Glicerídeos: gorduras e óleos', s: 'saturados, insaturados e trans', c: C.lip, loc: 'Triglicerídeos', still: 6,
  ctl: escolha('Ácido graxo', ['saturado', 'insaturado (cis)', 'trans'], 8),
  alt: 'Um glicerol se une a três ácidos graxos com saída de três moléculas de água; ao lado, cadeias retas se empilham bem e cadeias dobradas ficam soltas',
  d: `<p><b>Lipídios são moléculas que não se dissolvem em água (são hidrofóbicas), mas se dissolvem em solventes como o álcool e o éter.</b> Os mais comuns na dieta são os <b>glicerídeos</b>: um <b>glicerol</b> unido a ácidos graxos. Com três ácidos graxos, forma-se um <b>triglicerídeo</b>, e saem três moléculas de água.</p>
<p>Os triglicerídeos são a principal <b>reserva de energia</b> dos animais (no tecido adiposo, que também isola o calor e amortece impactos) e das sementes. Rendem cerca de 9&nbsp;kcal por grama, mais que o dobro dos carboidratos.</p>
<p>Nos ácidos graxos <b>saturados</b>, só há ligações simples entre os carbonos: a cadeia é reta, as moléculas se empilham bem, e a gordura é sólida à temperatura ambiente (manteiga, banha). Nos <b>insaturados</b>, uma dupla ligação do tipo cis dobra a cadeia; as moléculas ficam soltas, e o óleo é líquido (azeite, óleo de soja). Na gordura <b>trans</b>, a dupla não dobra a cadeia. Por isso ela se empilha como uma gordura saturada e é sólida à temperatura ambiente. No corpo, é ainda mais prejudicial: aumenta o colesterol "ruim" (LDL) e diminui o "bom" (HDL). No Brasil, a Anvisa proibiu os óleos parcialmente hidrogenados, a principal fonte de gordura trans, a partir de 2023.</p>`,
  kv: [['Triglicerídeo', '1 glicerol + 3 ácidos graxos'], ['Energia', 'cerca de 9 kcal por grama'], ['Saturada', 'só ligações simples; sólida (gordura)'], ['Insaturada cis', 'dupla que dobra a cadeia; líquida (óleo)'], ['Trans', 'dupla sem dobra; sólida; aumenta o LDL']],
  enem: 'A hidrogenação de óleos e a gordura trans são cobradas com a estrutura: a cadeia trans é quase reta, por isso as moléculas se empilham e a gordura fica sólida. Também cai a função de reserva e isolamento térmico do tecido adiposo, e a produção de sabão a partir de gorduras (saponificação).',
  links: [LK.tri, LK.oleico],
  draw(t, S) {
    const A = area(), tipo = Math.round(S.v), p = fr(t * .08), sg = NAR ? 9 : 13;
    const L = NAR ? { x0: A.x0, y0: A.y0, w: A.w, h: A.h * .52 } : { x0: A.x0, y0: A.y0, w: A.w * .56, h: A.h };
    const gx = L.x0 + (NAR ? 26 : 50), gy = L.y0 + L.h / 2, gs = NAR ? 30 : 46, j = ss((p - .1) / .35) * (p < .85 ? 1 : 1 - ss((p - .85) / .1));
    for (let k = 0; k < 3; k++) { const y = gy + (k - 1) * gs; circ(gx, y, NAR ? 8 : 10, C.c, 'rgba(11,15,28,.6)', 1); if (k) line(gx, y - gs + 10, gx, y - 10, 'rgba(232,237,247,.6)', 2); circ(gx + (NAR ? 16 : 22), y, NAR ? 6 : 8, C.o, 'rgba(11,15,28,.6)', 1); }
    tx('glicerol', gx, gy + gs * 1.5 + 6, { s: 12, w: 600 });
    for (let k = 0; k < 3; k++) {
      const y = gy + (k - 1) * gs, x0 = lerp(L.x0 + L.w * .52, gx + (NAR ? 30 : 42), j);
      rr(x0 - 4, y - 6, 10, 12, 3, C.lip); zz(x0 + 6, y, NAR ? 12 : 15, 0, sg, { cis: tipo === 1 ? 7 : 0, dupla: tipo ? 7 : 0, c: light(C.lip, .3) });
      const fH = seg(p, .38 + k * .04, .62 + k * .04); if (fH > 0 && fH < 1) { const hx2 = gx + 28 + fH * 30, hy2 = y - 6 - fH * (NAR ? 18 : 28); h2o(hx2, hy2, 7, -PI / 2, { a: Math.sin(fH * PI) * 1.6 }); }
    }
    if (j > .9) tx('triglicerídeo + 3 H₂O', L.x0 + L.w * .5, L.y0 + 12, { w: 600, c: C.lip }); else tx('glicerol + 3 ácidos graxos', L.x0 + L.w * .5, L.y0 + 12, { w: 600 });
    // empacotamento
    const P = NAR ? { x0: A.x0, y0: A.y0 + A.h * .56, w: A.w, h: A.h * .44 } : { x0: A.x0 + A.w * .6, y0: A.y0, w: A.w * .4, h: A.h };
    rr(P.x0, P.y0, P.w, P.h, 12, 'rgba(19,26,43,.6)', C.line, 1);
    const n = NAR ? 5 : 7, sp = (P.h - 70) / n, sg2 = Math.min(NAR ? 11 : 17, P.w / (NAR ? 15 : 24)), nseg = NAR ? 12 : 20;
    for (let k = 0; k < n; k++) { const wob = tipo === 1 ? Math.sin(t * 1.5 + k) * 4 : Math.sin(t * 1.5 + k) * 1; zz(P.x0 + 16 + (tipo === 1 ? (k % 2) * 14 : 0) + wob, P.y0 + 34 + k * sp * (tipo === 1 ? 1.06 : .78) + (tipo === 1 ? 0 : sp * .6), nseg, 0, sg2, { cis: tipo === 1 ? 6 : 0, dupla: tipo ? 6 : 0, c: light(C.lip, .25) }); }
    tx(tipo === 1 ? 'cadeias dobradas: ficam soltas' : 'cadeias retas: empilham bem', P.x0 + P.w / 2, P.y0 + 14, { s: 13, w: 600 });
    tok(P.x0 + P.w / 2, P.y1 - 18, tipo === 1 ? 'líquida: óleo' : 'sólida: gordura', tipo === 1 ? '#F2D06A' : '#EDE6D6');
    if (tipo) lab(P.x0 + 16 + 5.5 * sg2, P.y0 + 34 + (tipo === 1 ? 0 : sp * .6), P.x0 + P.w * .55, P.y0 + 36, tipo === 1 ? 'dupla cis' : 'dupla trans');
    cap(['Saturado: só ligações simples; cadeias retas e gordura sólida', 'Insaturado cis: a dupla dobra a cadeia; o óleo fica líquido', 'Trans: a dupla não dobra a cadeia; empilha como a saturada e aumenta o LDL'][tipo]);
  }
});

def('lip', 'classes', {
  t: 'Fosfolipídios, esteroides e ceras', s: 'membranas, hormônios e proteção', c: C.lip, loc: 'Outras classes de lipídios', still: 0,
  ctl: escolha('Classe', ['fosfolipídios', 'esteroides', 'ceras'], 7),
  alt: 'Fosfolipídios formando uma bicamada, o esqueleto de quatro anéis dos esteroides e gotas de água sobre a cera de uma folha',
  d: `<p><b>Fosfolipídios</b> formam as membranas. Cada um tem uma cabeça <b>hidrofílica</b> (atrai a água), com um fosfato (−) e, em geral, um grupo com carga + como a colina; ela é polar, mas tem carga total zero. Tem também duas caudas <b>hidrofóbicas</b> (repelem a água). Na água, essas moléculas se organizam sozinhas em camadas duplas (bicamadas). É essa propriedade que faz a membrana das células ser estável. Na célula, os fosfolipídios novos são feitos no retículo endoplasmático liso e somados às membranas que já existem.</p>
<p><b>Esteroides</b> têm um esqueleto de quatro anéis unidos. O <b>colesterol</b> dá estabilidade à membrana das células animais e é a matéria-prima dos hormônios sexuais (testosterona, estrógeno e progesterona), do cortisol, da vitamina D e dos sais biliares, que ajudam a digerir gorduras.</p>
<p><b>Ceras</b> (cerídeos) unem um ácido graxo a um álcool de cadeia longa. São muito hidrofóbicas: impermeabilizam folhas (a cutícula reduz a perda de água), penas e pelos, e formam os favos das abelhas.</p>`,
  kv: [['Fosfolipídios', 'membranas (bicamada)'], ['Esteroides', 'colesterol, hormônios sexuais, cortisol, vitamina D'], ['Ceras', 'cutícula das folhas, penas, favos'], ['Hidrofílico × hidrofóbico', 'atrai × repele a água']],
  enem: 'Relacione estrutura e função: a bicamada de fosfolipídios explica por que substâncias polares atravessam a membrana com dificuldade. Hormônios esteroides são lipídios e atravessam a membrana sozinhos. Plantas de ambiente seco têm cutícula grossa (cera) para perder menos água.',
  links: [LK.fosfo, LK.bicamada],
  draw(t, S) {
    const A = area(), i = Math.round(S.v), cx = A.cx, cy = A.cy;
    if (i === 0) {
      const s = NAR ? 9 : 13, sp = s * 2.2, n = Math.floor(A.w / sp) - 1, yT = cy - s * 3.2, yB = cy + s * 3.2;
      rr(A.x0, A.y0, A.w, yT - s - A.y0, 10, rgba(C.aguaM, .12)); rr(A.x0, yB + s, A.w, A.y1 - yB - s, 10, rgba(C.aguaM, .12));
      for (let k = 0; k < n; k++) for (const [y, d] of [[yT, 1], [yB, -1]]) { const x = A.x0 + sp * .8 + k * sp + Math.sin(t + k) * 1.5; for (const o of [-.25, .25]) { X.beginPath(); X.moveTo(x + o * s, y + d * s * .6); for (let q = 1; q <= 5; q++) X.lineTo(x + o * s + Math.sin(t * 2 + k + q) * 1.5, y + d * (s * .6 + q * s * .5)); X.strokeStyle = 'rgba(255,205,228,.7)'; X.lineWidth = 2; X.stroke(); } circ(x, y, s * .55, C.memb); }
      tx('água', A.x0 + 12, A.y0 + 14, { a: 'left', c: C.aguaM, w: 600 }); tx('água', A.x0 + 12, A.y1 - 14, { a: 'left', c: C.aguaM, w: 600 });
      lab(A.x0 + sp * .8 + sp * 3, yT, A.x0 + sp * 5, A.y0 + 30, 'cabeça hidrofílica'); lab(A.x0 + sp * .8 + sp * 6, cy - s, A.x0 + sp * 9, cy - s * 1.2, 'caudas hidrofóbicas');
    } else if (i === 1) {
      const r = Math.min(A.w * (NAR ? .1 : .07), A.h * .13), h = r * Math.sqrt(3) / 2, x0 = cx - r * 2.6, y0 = cy + r * .4;
      const rings = [[x0, y0, 6], [x0 + 2 * h * Math.cos(PI / 6) * 1.0, y0 - r * .0 - h * 0, 6]];
      // quatro anéis: três de seis lados e um de cinco
      const pos = [[x0, y0], [x0 + h * 2 * .866 * 1.15, y0 - r * .5 * 1.0], [x0 + h * 2 * .866 * 2.3, y0], [x0 + h * 2 * .866 * 3.35, y0 - r * .55]];
      pos.forEach(([x, y], k) => ngon(x, y, k === 3 ? r * .88 : r, k === 3 ? 5 : 6, k === 3 ? PI : PI / 6, rgba(C.lip, .25), C.lip, 2.5));
      line(pos[0][0] - r * .87, pos[0][1] + r * .5, pos[0][0] - r * 1.6, pos[0][1] + r * 1.0, 'rgba(232,237,247,.7)', 2); circ(pos[0][0] - r * 1.75, pos[0][1] + r * 1.1, r * .26, C.o); tx('OH', pos[0][0] - r * 1.75, pos[0][1] + r * 1.75, { s: 12, w: 700, c: light(C.o, .4) });
      zz(pos[3][0] + r * .8, pos[3][1] - r * .3, 6, -.3, r * .55, { c: 'rgba(232,237,247,.8)' });
      tx('colesterol: quatro anéis unidos', cx, A.y0 + 14, { w: 600, c: C.lip });
      const der = ['hormônios sexuais', 'cortisol', 'vitamina D', 'sais biliares']; der.forEach((d, k) => tok(NAR ? A.x0 + A.w * (.27 + (k % 2) * .46) : A.x0 + A.w * (.14 + k * .24), A.y1 - (NAR ? 46 - Math.floor(k / 2) * 26 : 20), d, C.lip));
      tx('derivados do colesterol', cx, A.y1 - (NAR ? 66 : 44), { s: 12, c: C.dim });
    } else {
      // folha com cutícula e gotas que rolam
      const lw = A.w * .8, ly = cy + A.h * .1; X.save(); X.translate(cx, ly); X.rotate(-.08); rr(-lw / 2, 0, lw, A.h * .14, 10, C.cloro); rr(-lw / 2, -6, lw, 8, 4, '#F2E6B8'); X.restore();
      tx('cutícula (cera)', cx + lw * .3, ly - 30, { s: 13, w: 600, c: '#F2E6B8' });
      for (let k = 0; k < 3; k++) { const f = fr(t * .12 + k / 3), x = cx - lw / 2 + f * lw, y = ly - 14 - (x - cx) * .08 - 4; X.save(); X.globalAlpha = Math.min(1, Math.sin(f * PI) * 3); ell(x, y, 12, 9, 0, rgba(C.aguaM, .7), light(C.aguaM, .4), 1.5); circ(x - 4, y - 3, 2.5, 'rgba(255,255,255,.7)'); X.restore(); }
      for (let k = 0; k < (NAR ? 5 : 9); k++) ngon(A.x0 + 30 + k * 30 + (Math.floor(k / 1) % 2) * 0, A.y0 + 40 + (k % 2) * 26, 16, 6, 0, 'rgba(242,193,78,.3)', '#F2C14E', 2);
      tx('favo de cera das abelhas', A.x0 + 30, A.y0 + 90, { a: 'left', s: 12, c: C.dim });
      tx('a água não molha a cera e escorre', cx, A.y1 - 14, { s: 13, c: C.txt });
    }
    cap(['Fosfolipídios: cabeça hidrofílica para fora, caudas hidrofóbicas para dentro (bicamada)', 'Esteroides: quatro anéis; o colesterol origina hormônios, vitamina D e sais biliares', 'Ceras: muito hidrofóbicas; impermeabilizam folhas, penas e pelos'][i]);
  }
});

def('lip', 'colesterol', {
  t: 'Colesterol, HDL e LDL', s: 'lipoproteínas e placas nas artérias', c: C.lip, loc: 'Corte de uma artéria', still: 6,
  ctl: { l: 'Gordura saturada e trans', min: 0, max: 100, step: 5, v: 30, f: v => v < 35 ? 'pouca' : v < 70 ? 'média' : 'muita', rate: () => 1 },
  alt: 'No sangue de uma artéria, partículas de LDL deixam colesterol na parede e formam uma placa; partículas de HDL recolhem colesterol e o levam ao fígado',
  d: `<p><b>O colesterol é indispensável:</b> faz parte da membrana das células animais e é a matéria-prima de hormônios, da vitamina D e dos sais biliares. Cerca de dois terços dele são produzidos pelo próprio fígado; o resto vem de alimentos de origem animal. Plantas praticamente não têm colesterol.</p>
<p>Como é hidrofóbico, o colesterol viaja no sangue dentro de <b>lipoproteínas</b>, partículas com uma casca de proteínas e fosfolipídios. A <b>LDL</b> leva colesterol do fígado aos tecidos; em excesso, deixa colesterol na parede das artérias e ajuda a formar <b>placas de ateroma</b> (aterosclerose). A <b>HDL</b> recolhe o colesterol que sobra e o leva de volta ao fígado. Por isso se diz, de forma simplificada, que o LDL é o colesterol "ruim" e o HDL, o "bom". Mas HDL e LDL não são tipos de colesterol: são os veículos que o transportam.</p>
<p>Dietas ricas em gordura saturada e trans, o sedentarismo e o fumo elevam o LDL; atividade física regular ajuda a elevar o HDL. Mude a dieta no controle e acompanhe a placa.</p>`,
  kv: [['Produção própria', 'cerca de dois terços, no fígado'], ['LDL', 'leva colesterol aos tecidos; em excesso, forma placas'], ['HDL', 'devolve o colesterol ao fígado'], ['Placa de ateroma', 'estreita a artéria; pode causar infarto e AVC']],
  enem: 'A prova cobra a leitura de exames e de rótulos: LDL alto e HDL baixo aumentam o risco de infarto e de AVC. Lembre que alimentos de origem vegetal não têm colesterol, mesmo quando o rótulo destaca "zero colesterol" num óleo.',
  links: [['Glicerídeos e gordura trans', '#lip/glicerideos'], ['Esteroides', '#lip/classes']],
  init(S) { S.pl = .15; },
  draw(t, S) {
    const A = area(), d = S.v / 100; S.pl += ((.1 + d * .85) - S.pl) * Math.min(1, (S.dt || 0) * .35); const pl = S.pl;
    const top = A.y0 + A.h * .14, bot = A.y1 - A.h * .14, wall = A.h * .1, cx0 = A.x0 + A.w * .55, pw = A.w * .32;
    rr(A.x0, top - wall, A.w, wall, 6, '#9B4A55'); rr(A.x0, bot, A.w, wall, 6, '#9B4A55'); rr(A.x0, top, A.w, bot - top, 0, 'rgba(160,30,45,.35)');
    // placa
    const ph = (bot - top) * .5 * pl; X.beginPath(); X.moveTo(cx0 - pw / 2, bot); X.quadraticCurveTo(cx0, bot - ph * 2, cx0 + pw / 2, bot); X.closePath(); X.fillStyle = '#F2D06A'; X.fill(); X.strokeStyle = 'rgba(11,15,28,.5)'; X.lineWidth = 1.5; X.stroke();
    if (pl > .25) lab(cx0, bot - ph * .9, cx0 + pw * .4, bot - ph - 40, 'placa de ateroma');
    tx('fluxo de sangue', A.x0 + 12, top + 14, { a: 'left', s: 12, c: '#FFC9CF' });
    const nL = Math.round(4 + d * 10), nH = Math.round(9 - d * 6), R = rng(6), speed = 1 - pl * .45;
    for (let i = 0; i < nL; i++) { const f = fr(t * .06 * speed + R()), x = A.x0 + f * A.w, ymax = x > cx0 - pw / 2 && x < cx0 + pw / 2 ? bot - ph * 1.6 * (1 - Math.pow((x - cx0) / (pw / 2), 2)) : bot, y = top + 16 + R() * (ymax - top - 32); circ(x, y, NAR ? 9 : 12, '#F2A65A', '#0B0F1C', 1); if (!NAR || i < 3) tx('LDL', x, y + .5, { s: 12, w: 700, c: '#0B0F1C', bg: false }); }
    for (let i = 0; i < nH; i++) { const f = fr(t * .07 * speed + R()), x = A.x1 - f * A.w, y = top + 16 + R() * (bot - top - 32 - ph); circ(x, y, NAR ? 7 : 9, '#9FE3C0', '#0B0F1C', 1); if (!NAR) tx('HDL', x, y + .5, { s: 12, w: 700, c: '#0B0F1C', bg: false }); }
    tok(A.x1 - (NAR ? 50 : 70), top - wall / 2, '→ fígado (HDL)', '#9FE3C0');
    tx(`luz da artéria: ${Math.round(100 - pl * 55)} %`, A.cx, A.y1 - 4, { s: 12, f: FD, w: 500, c: C.txt });
    cap(d < .35 ? 'Pouca gordura saturada e trans: menos LDL, mais HDL, placa pequena' : d < .7 ? 'Mais LDL circulando: o colesterol começa a se acumular na parede' : 'Muito LDL e pouco HDL: a placa cresce e estreita a artéria');
  }
});

// =====================================================================================
// PROTEÍNAS
// =====================================================================================
{
  const RS = [['glicina', 'H', 'Gly'], ['alanina', 'CH₃', 'Ala'], ['serina', 'CH₂OH', 'Ser'], ['fenilalanina', 'CH₂–anel', 'Phe'], ['lisina', '(CH₂)₄–NH₂', 'Lys']];
  const AA = ['Gly', 'Ala', 'Val', 'Leu', 'Ile', 'Met', 'Pro', 'Phe', 'Trp', 'Tyr', 'Ser', 'Thr', 'Cys', 'Asn', 'Gln', 'Asp', 'Glu', 'Lys', 'Arg', 'His'], ESS = ['His', 'Ile', 'Leu', 'Lys', 'Met', 'Phe', 'Thr', 'Trp', 'Val'];
  def('prot', 'aminoacidos', {
    t: 'Aminoácidos', s: 'as 20 peças das proteínas', c: C.prot, loc: 'Estrutura geral', still: 0,
    ctl: escolha('Grupo R', RS.map(r => r[0]), 5),
    alt: 'Estrutura geral de um aminoácido: um carbono central ligado a um grupo amino, um grupo carboxila, um hidrogênio e um grupo R que muda de um aminoácido para outro',
    d: `<p><b>Proteínas são cadeias de aminoácidos.</b> Todo aminoácido tem um carbono central (carbono alfa) ligado a quatro grupos: um <b>grupo amino</b> (–NH₂), um <b>grupo carboxila</b> (–COOH), um hidrogênio e um <b>grupo R</b>, a cadeia lateral. O grupo R é o que muda de um aminoácido para outro e define se ele é polar, apolar, ácido ou básico.</p>
<p>Os seres vivos usam 20 aminoácidos para montar proteínas. Nossas células fabricam 11 deles (<b>não essenciais</b>). Os outros 9 são <b>essenciais</b>: precisam vir da dieta. São histidina, isoleucina, leucina, lisina, metionina, fenilalanina, treonina, triptofano e valina. Em crianças e em algumas situações, como crescimento e trauma, a arginina também precisa vir da dieta.</p>
<p>Na fenilcetonúria, falta a enzima que transforma fenilalanina em tirosina. A fenilalanina se acumula e prejudica o cérebro. O teste do pezinho detecta a doença logo após o nascimento, e uma dieta pobre em fenilalanina evita o dano. É por isso que refrigerantes diet avisam: "contém fenilalanina".</p>`,
    kv: [['Aminoácidos nas proteínas', '20'], ['Essenciais (adulto)', '9: His, Ile, Leu, Lys, Met, Phe, Thr, Trp, Val'], ['Grupos comuns', 'amino, carboxila, H e o grupo R'], ['Elementos', 'C, H, O, N (e S na metionina e na cisteína)']],
    enem: 'Dieta e aminoácidos essenciais: arroz e feijão se complementam (o feijão tem lisina; o arroz, metionina). A fenilcetonúria, o teste do pezinho e o aviso "contém fenilalanina" nos produtos com aspartame já apareceram na prova.',
    links: [LK.amino],
    draw(t, S) {
      const A = area(), i = Math.round(S.v), r = RS[i], u = NAR ? 34 : 54, cx = NAR ? A.cx : A.x0 + A.w * .28, cy = NAR ? A.y0 + A.h * .3 : A.cy;
      const G = [[-1, 0, 'H₂N', C.n, 'grupo amino'], [1, 0, 'COOH', C.o, 'grupo carboxila'], [0, -1, 'H', C.h, ''], [0, 1, r[1], C.prot, 'grupo R (cadeia lateral)']];
      G.forEach(([dx, dy, s, c, n]) => { const x = cx + dx * u * 1.6, y = cy + dy * u * 1.25; line(cx, cy, x, y, 'rgba(232,237,247,.7)', 2.5); const w = Math.max(u * .8, tw(s, 15, 700) + 18); rr(x - w / 2, y - u * .32, w, u * .64, 10, rgba(c, .9), 'rgba(11,15,28,.5)', 1.5); tx(s, x, y + .5, { s: NAR ? 13 : 15, w: 700, c: '#0B0F1C', bg: false }); if (n) lab(x + (dx || .3) * w * .5, y + dy * u * .32, x + (dx || .5) * u * .6 + (dx ? 0 : u * 1.2), y + (dy || -.6) * u * .9, n); });
      circ(cx, cy, u * .34, C.c, '#0B0F1C', 1.5); tx('C', cx, cy + .5, { s: 15, w: 700, c: '#0B0F1C', bg: false });
      head(r[0] + ' (' + r[2] + ')', cx, NAR ? A.y0 + 10 : A.y0 + 16, C.prot);
      // grade dos 20
      const gx = NAR ? A.x0 + 4 : A.x0 + A.w * .56, gy = NAR ? A.y0 + A.h * .64 : A.y0 + 40, cols = 5, cw2 = (NAR ? A.w - 8 : A.w * .42) / cols, ch2 = NAR ? 28 : 40;
      if (!NAR) tx('os 20 aminoácidos das proteínas', gx, A.y0 + 16, { a: 'left', s: 13, w: 600, c: C.dim, bg: false });
      AA.forEach((a, k) => { const x = gx + (k % cols) * cw2, y = gy + Math.floor(k / cols) * (ch2 + 6), e = ESS.includes(a), on = a === r[2]; rr(x + 2, y, cw2 - 4, ch2, 6, on ? rgba(C.prot, .6) : 'rgba(19,26,43,.8)', e ? C.prot : C.line, e ? 2 : 1); tx(a, x + cw2 / 2, y + ch2 / 2 + .5, { s: 13, f: FD, w: 500, c: C.txt, bg: false }); });
      const ly = gy + 4 * (ch2 + 6) + 10; rr(gx + 2, ly, 16, 12, 3, null, C.prot, 2); tx('contorno forte: essencial (9)', gx + 26, ly + 6, { a: 'left', s: 12, c: C.dim, bg: false });
      cap(`Todo aminoácido tem amino, carboxila, H e um grupo R; na ${r[0]}, R = ${r[1]}`);
    }
  });
}

def('prot', 'peptidica', {
  t: 'Ligação peptídica', s: 'aminoácidos formam cadeias', c: C.prot, loc: 'Síntese de uma proteína', still: 4,
  alt: 'Dois aminoácidos se unem pela ligação peptídica, com saída de água; a cadeia cresce e forma um polipeptídeo',
  d: `<p><b>A ligação peptídica une o grupo carboxila de um aminoácido ao grupo amino do seguinte, com a saída de uma molécula de água</b> (síntese por desidratação). Dois aminoácidos formam um dipeptídeo; muitos formam um <b>polipeptídeo</b>. Uma proteína tem um ou mais polipeptídeos, com dezenas a milhares de aminoácidos.</p>
<p>A cadeia tem duas pontas diferentes: a <b>ponta amino</b> (N-terminal), onde a síntese começa, e a <b>ponta carboxila</b> (C-terminal). Na célula, quem faz as ligações peptídicas é o <b>ribossomo</b>, seguindo a ordem de códons do RNA mensageiro.</p>
<p>Na digestão acontece o inverso: enzimas como a pepsina, no estômago, e a tripsina, no intestino, fazem a <b>hidrólise</b> das ligações peptídicas e liberam aminoácidos, que o corpo absorve e usa para montar as próprias proteínas.</p>`,
  kv: [['Une', 'carboxila (–COOH) + amino (–NH₂)'], ['Sai', '1 molécula de água por ligação'], ['n aminoácidos', 'n − 1 ligações peptídicas'], ['Quem faz na célula', 'o ribossomo (tradução)']],
  enem: 'Cálculos simples aparecem: uma cadeia com n aminoácidos tem n − 1 ligações peptídicas e libera n − 1 moléculas de água ao ser formada. A ligação com a tradução (códon, RNA mensageiro, ribossomo) e com a digestão de proteínas também é comum.',
  links: [LK.pept, ['Tradução (DNA)', '../dna/index.html']],
  draw(t) {
    const A = area(), p = fr(t * .07), n = NAR ? 6 : 9, u = Math.min((A.w - 40) / (n + .5), NAR ? 52 : 92), cy = A.cy, x0 = A.cx - (n - 1) * u / 2, seq = ['Met', 'Val', 'His', 'Leu', 'Thr', 'Pro', 'Glu', 'Glu', 'Lys'];
    const k = p * (n + .3);
    for (let i = 0; i < n; i++) {
      const arr = cl(k - i, 0, 1), x = lerp(A.x1 + 40, x0 + i * u, ss(arr)), y = cy + (i % 2 ? 12 : -12) * ss(arr);
      if (arr <= 0) continue;
      if (i > 0 && arr > .8) { line(x0 + (i - 1) * u + u * .3, cy + ((i - 1) % 2 ? 12 : -12), x - u * .3, y, 'rgba(232,237,247,.8)', 2.5); circ((x0 + (i - 1) * u + x) / 2, (cy + ((i - 1) % 2 ? 12 : -12) + y) / 2, 5, C.n); }
      rr(x - u * .34, y - u * .26, u * .68, u * .52, 10, rgba(C.prot, .85), 'rgba(11,15,28,.5)', 1.5); tx(seq[i], x, y + .5, { s: NAR ? 12 : 14, f: FD, w: 500, c: '#0B0F1C', bg: false });
      const fh = seg(k - i, .55, 1.4); if (i > 0 && fh > 0 && fh < 1) h2o(x - u * .5, y - u * .4 - fh * 40, 8, -PI / 2, { a: Math.sin(fh * PI) * 1.5 });
    }
    const m = Math.min(n, Math.floor(k + .2));
    tx('ponta amino (N)', x0 - u * .3, cy + u * .7, { a: 'left', s: 12, c: C.dim }); if (m >= n) tx('ponta carboxila (C)', x0 + (n - 1) * u + u * .3, cy + u * .7, { a: 'right', s: 12, c: C.dim });
    if (m >= 2) lab(x0 + u * .5, cy, x0 + u * .9, cy - u * 1.1 - 10, 'ligação peptídica');
    tx(`${Math.max(0, m)} aminoácidos · ${Math.max(0, m - 1)} ligações · ${Math.max(0, m - 1)} H₂O`, A.cx, A.y0 + 14, { f: FD, s: 13, w: 500, c: C.txt });
    cap(m < 2 ? 'A cadeia começa pela ponta amino' : 'Cada nova ligação peptídica libera uma molécula de água');
  }
});

def('prot', 'niveis', {
  t: 'Níveis de estrutura', s: 'primária, secundária, terciária e quaternária', c: C.prot, loc: 'Dobramento de uma proteína', still: 0,
  ctl: escolha('Nível', ['primária', 'secundária', 'terciária', 'quaternária'], 6),
  alt: 'A sequência de aminoácidos, a alfa-hélice e a folha beta, a cadeia dobrada em forma tridimensional e quatro cadeias unidas como na hemoglobina',
  d: `<p><b>A função de uma proteína depende da sua forma, e a forma depende da sequência de aminoácidos.</b> Os biólogos descrevem essa forma em quatro níveis.</p>
<p><b>Primária:</b> a sequência de aminoácidos, unidos por ligações peptídicas; é determinada pelo gene. <b>Secundária:</b> dobras regulares mantidas por ligações de hidrogênio entre partes próximas da cadeia, como a <b>alfa-hélice</b> e a <b>folha beta</b>. <b>Terciária:</b> o dobramento da cadeia inteira em três dimensões, mantido por interações entre os grupos R (ligações de hidrogênio, atrações entre cargas, pontes de dissulfeto e o agrupamento das partes hidrofóbicas longe da água).</p>
<p><b>Quaternária:</b> a união de duas ou mais cadeias. A hemoglobina tem quatro (duas alfa e duas beta). Na anemia falciforme, a troca de um único aminoácido na cadeia beta (valina no lugar de ácido glutâmico) muda a forma da proteína, e a hemácia se deforma.</p>`,
  kv: [['Primária', 'sequência de aminoácidos'], ['Secundária', 'alfa-hélice e folha beta (ligações de hidrogênio)'], ['Terciária', 'forma 3D de uma cadeia'], ['Quaternária', 'várias cadeias (ex.: hemoglobina)']],
  enem: 'A ideia central é sequência → forma → função. A anemia falciforme é o exemplo clássico: uma mutação muda um aminoácido, a forma da hemoglobina e o formato da hemácia. Relaciona-se com mutação e seleção natural (traço falciforme e malária).',
  links: [LK.helice, LK.folha, ['Hemoglobina e anemia falciforme (DNA)', '../dna/index.html']],
  draw(t, S) {
    const A = area(), i = Math.round(S.v), cx = A.cx, cy = A.cy, R = Math.min(A.w, A.h) * .32, bead = NAR ? 7 : 9;
    if (i === 0) { const seq = 'MVHLTPEEKSAVTALWGKV', n = NAR ? 10 : 19, sp = Math.min((A.w - 20) / n, 52); for (let k = 0; k < n; k++) { const x = cx - (n - 1) * sp / 2 + k * sp, y = cy + Math.sin(k * .6 + t) * 6; if (k) line(x - sp, cy + Math.sin((k - 1) * .6 + t) * 6, x, y, 'rgba(232,237,247,.6)', 2); circ(x, y, sp * .38, rgba(C.prot, .85), 'rgba(11,15,28,.5)', 1); tx(seq[k], x, y + .5, { s: 12, f: FD, w: 500, c: '#0B0F1C', bg: false }); } tx('cada letra é um aminoácido', cx, cy + 50, { s: 13, c: C.dim }); }
    else if (i === 1) { const hx = NAR ? cx : A.x0 + A.w * .28, hl = Math.min(A.h * .7, 300); X.beginPath(); for (let k = 0; k <= 160; k++) { const f = k / 160, y = cy - hl / 2 + f * hl, x = hx + Math.sin(f * TAU * 4.5 + t) * (NAR ? 30 : 44); k ? X.lineTo(x, y) : X.moveTo(x, y); } X.strokeStyle = C.prot; X.lineWidth = 6; X.lineCap = 'round'; X.stroke(); tx('alfa-hélice', hx, cy + hl / 2 + 16, { w: 600 });
      if (!NAR) { const fx = A.x0 + A.w * .66; for (let k = 0; k < 4; k++) { const x = fx + (k - 1.5) * 50; const p0 = [x, cy - hl / 2], pts = []; for (let q = 0; q <= 8; q++) pts.push([x + (q % 2 ? 6 : -6), cy - hl / 2 + q * hl / 8]); poly(pts, C.prot, 5); arrowHead(pts[8][0], pts[8][1] + 6, k % 2 ? -PI / 2 : PI / 2, C.prot, 12); if (k < 3) for (let q = 1; q < 8; q += 2) line(x + 6, cy - hl / 2 + q * hl / 8, x + 44, cy - hl / 2 + q * hl / 8, 'rgba(143,216,255,.6)', 1.5, [2, 3]); } tx('folha beta', fx, cy + hl / 2 + 16, { w: 600 }); lab(fx - 50, cy - hl / 2 + 3 * hl / 8, fx - 30, cy - hl / 2 - 6, 'ligações de hidrogênio'); } }
    else if (i === 2) { const pts = []; for (let k = 0; k <= 220; k++) { const f = k / 220, a = f * TAU * 2.2 + t * .1, rr2 = R * (.35 + .5 * Math.abs(Math.sin(f * 7.3))) ; pts.push([cx + Math.cos(a) * rr2 + Math.sin(f * 40) * 6, cy + Math.sin(a) * rr2 * .8 + Math.cos(f * 40) * 6]); } poly(pts, C.prot, 5); circ(pts[60][0], pts[60][1], 6, C.s); circ(pts[150][0], pts[150][1], 6, C.s); line(pts[60][0], pts[60][1], pts[150][0], pts[150][1], C.s, 2, [3, 3]); lab(pts[60][0], pts[60][1], cx + R * 1.1, cy - R * .9, 'ponte de dissulfeto (S–S)'); tx('uma cadeia dobrada em 3D', cx, A.y1 - 10, { s: 13, c: C.dim }); }
    else { const cs = [['α', -1, -1, '#E07AD8'], ['β', 1, -1, '#B66FD9'], ['β', -1, 1, '#B66FD9'], ['α', 1, 1, '#E07AD8']]; cs.forEach(([n, dx, dy, c], k) => { const x = cx + dx * R * .48, y = cy + dy * R * .42 + Math.sin(t + k) * 2; X.beginPath(); for (let q = 0; q <= 40; q++) { const a = q / 40 * TAU, rr2 = R * .45 * (1 + .08 * Math.sin(a * 5 + k)); q ? X.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2 * .85) : X.moveTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2 * .85); } X.closePath(); X.fillStyle = rgba(c, .55); X.fill(); X.strokeStyle = c; X.lineWidth = 2; X.stroke(); X.save(); X.translate(x + R * .15, y - R * .1); X.rotate(.6); rr(-7, -7, 14, 14, 3, '#C9303B'); X.restore(); tx(n, x - R * .12, y + R * .12, { f: FH, s: 18, w: 700, c: C.txt }); }); lab(cx + R * .63, cy - R * .52, cx + R * 1.1, cy - R * 1.05, 'grupo heme (com ferro)'); tx('hemoglobina: 2 cadeias α + 2 cadeias β', cx, A.y1 - 10, { s: 13, c: C.dim }); }
    cap(['Primária: a ordem dos aminoácidos, ditada pelo gene', 'Secundária: alfa-hélice e folha beta, mantidas por ligações de hidrogênio', 'Terciária: a forma 3D da cadeia, mantida pelas interações entre grupos R', 'Quaternária: várias cadeias juntas, como na hemoglobina'][i]);
  }
});

{
  const NB = 40, R0 = rng(21), fold = [], open = [];
  for (let i = 0; i < NB; i++) { const a = i / NB * TAU * 2.4, r = .35 + .55 * Math.abs(Math.sin(i * .9)); fold.push([Math.cos(a) * r * .8, Math.sin(a) * r * .7]); open.push([-1.6 + i / (NB - 1) * 3.2, Math.sin(i * .7) * .35 + (R0() - .5) * .3]); }
  def('prot', 'desnaturacao', {
    t: 'Desnaturação', s: 'calor e pH desfazem a forma', c: C.prot, loc: 'Uma proteína aquecida', still: 2,
    ctl: { l: 'Temperatura', min: 20, max: 100, step: 1, v: 37, f: v => v + ' °C', rate: () => 1 },
    alt: 'Uma proteína dobrada se desenrola quando a temperatura sobe; ao lado, a clara do ovo fica branca',
    d: `<p><b>Desnaturação é a perda da forma tridimensional de uma proteína.</b> Calor intenso, pH muito ácido ou muito básico, sais em excesso e alguns solventes rompem as interações fracas que mantêm a estrutura secundária, terciária e quaternária. A proteína se desenrola e perde a função.</p>
<p>As <b>ligações peptídicas não se rompem</b>: a sequência de aminoácidos (estrutura primária) continua a mesma. É por isso que a carne cozida ainda é uma boa fonte de aminoácidos.</p>
<p>O exemplo do dia a dia é a clara do ovo: a albumina, transparente, fica branca e firme quando aquece, e não volta ao estado anterior ao esfriar. Febres muito altas são perigosas em parte porque começam a desnaturar proteínas do corpo, inclusive enzimas. Aumente a temperatura no controle.</p>`,
    kv: [['Causas', 'calor, pH extremo, excesso de sais, solventes'], ['O que se perde', 'estrutura secundária, terciária e quaternária'], ['O que se mantém', 'a estrutura primária (ligações peptídicas)'], ['Consequência', 'perda da função']],
    enem: 'Liga-se a enzimas (temperatura e pH ótimos), febre, cozimento de alimentos, pasteurização e conservação. Distinga desnaturação (perde a forma, mantém a sequência) de hidrólise (a digestão rompe as ligações peptídicas).',
    links: [['Enzimas e temperatura', '#enz'], LK.helice],
    init(S) { S.k = 0; },
    draw(t, S) {
      const A = area(), T = S.v, alvo = ss((T - 52) / 22); S.k += (alvo - S.k) * Math.min(1, (S.dt || 0) * 1.5 + (S.paused ? 1 : 0)); const k = S.k;
      const cx = NAR ? A.cx : A.x0 + A.w * .38, cy = NAR ? A.y0 + A.h * .32 : A.cy, sc = Math.min(NAR ? A.w * .4 : A.w * .2, A.h * .36);
      const P = fold.map((f, i) => { const o = open[i]; const j = Math.sin(t * 2 + i) * (1 + k * 4) * (T / 60); return [cx + lerp(f[0], o[0], k) * sc + j, cy + lerp(f[1], o[1], k) * sc + Math.cos(t * 1.7 + i) * (1 + k * 3) * (T / 60)]; });
      poly(P, 'rgba(232,237,247,.6)', 2); P.forEach((p, i) => circ(p[0], p[1], NAR ? 5 : 7, i % 5 === 0 ? '#B66FD9' : C.prot, 'rgba(11,15,28,.5)', 1));
      if (k < .4) for (let q = 0; q < 6; q++) { const a = P[q * 6], b = P[(q * 6 + 13) % NB]; if (Math.hypot(a[0] - b[0], a[1] - b[1]) < sc * .5) line(a[0], a[1], b[0], b[1], `rgba(143,216,255,${.6 * (1 - k * 2.5)})`, 1.5, [2, 3]); }
      tx(k < .5 ? 'forma ativa (dobrada)' : 'desnaturada (desenrolada)', cx, NAR ? A.y0 + 8 : A.y0 + 16, { w: 600, c: k < .5 ? C.prot : C.txt });
      // ovo
      const ex = NAR ? A.cx : A.x0 + A.w * .82, ey = NAR ? A.y0 + A.h * .78 : A.cy, er = NAR ? Math.min(A.w * .22, A.h * .16) : Math.min(A.w * .12, A.h * .3);
      ell(ex, ey, er * 1.25, er, 0, `rgba(${lerp(200, 245, k) | 0},${lerp(225, 245, k) | 0},${lerp(235, 245, k) | 0},${lerp(.25, .95, k)})`, 'rgba(255,255,255,.4)', 1.5); circ(ex + er * .15, ey, er * .42, '#F2B33D', 'rgba(11,15,28,.4)', 1);
      tx('clara do ovo', ex, ey + er + 18, { s: 13, w: 600 });
      hbar(NAR ? A.x0 + 6 : A.x0 + 10, NAR ? A.y0 + A.h * .58 : A.y1 - 20, NAR ? A.w - 12 : A.w * .5, 12, 1 - k, C.prot, 'função', Math.round((1 - k) * 100) + ' %');
      cap(T < 45 ? 'Temperatura do corpo: a proteína mantém a forma e funciona' : k < .5 ? 'O calor agita a cadeia; as ligações fracas começam a se romper' : 'Desnaturada: perdeu a forma e a função, mas a sequência de aminoácidos é a mesma');
    }
  });
}

// =====================================================================================
// ÁCIDOS NUCLEICOS
// =====================================================================================
function nucleo(x, y, u, base, rna, o = {}) {
  // fosfato (esquerda), pentose (centro), base (direita)
  const px = x - u * 1.2, bx = x + u * 1.3;
  line(px, y, x - u * .4, y, 'rgba(232,237,247,.7)', 2.5); line(x + u * .4, y, bx - u * .5, y, 'rgba(232,237,247,.7)', 2.5);
  circ(px, y, u * .34, C.p, 'rgba(11,15,28,.5)', 1.5); tx('P', px, y + .5, { s: Math.max(12, u * .32), w: 700, c: '#0B0F1C', bg: false });
  ngon(x, y, u * .45, 5, -PI / 2, rgba(C.creme, .35), C.creme, 2);
  const c2x = x + Math.cos(-PI / 2 + 2 * TAU / 5) * u * .45, c2y = y + Math.sin(-PI / 2 + 2 * TAU / 5) * u * .45;
  line(c2x, c2y, c2x, c2y + u * .45, 'rgba(232,237,247,.6)', 1.5); tx(rna ? 'OH' : 'H', c2x, c2y + u * .62, { s: 12, w: 700, c: rna ? light(C.o, .3) : C.h });
  const c = BASE[base]; if (PUR[base]) { ngon(bx - u * .1, y, u * .42, 6, 0, rgba(c, .85), 'rgba(11,15,28,.5)', 1.5); ngon(bx + u * .58, y, u * .36, 5, 0, rgba(c, .85), 'rgba(11,15,28,.5)', 1.5); } else ngon(bx, y, u * .45, 6, 0, rgba(c, .85), 'rgba(11,15,28,.5)', 1.5);
  tx(base, bx + (PUR[base] ? u * .2 : 0), y + .5, { s: Math.max(13, u * .4), w: 700, c: '#0B0F1C', bg: false });
  return { px, bx };
}

def('na', 'nucleotideo', {
  t: 'Nucleotídeos', s: 'fosfato, pentose e base nitrogenada', c: C.na, loc: 'As peças do DNA e do RNA', still: 0,
  ctl: escolha('Ácido nucleico', ['DNA', 'RNA'], 6),
  alt: 'Um nucleotídeo com fosfato, açúcar de cinco carbonos e base nitrogenada; o açúcar do RNA tem um OH a mais que o do DNA',
  d: `<p><b>Ácidos nucleicos (DNA e RNA) são cadeias de nucleotídeos.</b> Cada nucleotídeo tem três partes: um <b>fosfato</b>, uma <b>pentose</b> (açúcar de cinco carbonos) e uma <b>base nitrogenada</b>.</p>
<p>No DNA, a pentose é a <b>desoxirribose</b>; no RNA, é a <b>ribose</b>, que tem um grupo OH a mais no carbono 2 (o nome "desoxi" quer dizer "sem um oxigênio"). As bases são de dois tipos: as <b>purinas</b>, com dois anéis (adenina e guanina), e as <b>pirimidinas</b>, com um anel (citosina, timina e uracila). A timina só aparece no DNA, e a uracila, só no RNA.</p>
<p>Os nucleotídeos se unem por <b>ligações fosfodiéster</b>: o fosfato de um se liga ao açúcar do seguinte, formando um "corrimão" de açúcar e fosfato, com as bases voltadas para o lado. O ATP também é um nucleotídeo, com três fosfatos.</p>`,
  kv: [['Partes', 'fosfato + pentose + base nitrogenada'], ['Pentose do DNA', 'desoxirribose'], ['Pentose do RNA', 'ribose (um OH a mais)'], ['Purinas (2 anéis)', 'adenina (A) e guanina (G)'], ['Pirimidinas (1 anel)', 'citosina (C), timina (T) e uracila (U)']],
  enem: 'Cai muito a comparação DNA × RNA: açúcar (desoxirribose × ribose), bases (T × U) e número de fitas. Lembre que o fosfato é a fonte de fósforo das moléculas da hereditariedade e do ATP.',
  links: [LK.dna, LK.bioen],
  draw(t, S) {
    const A = area(), rna = Math.round(S.v) === 1, u = NAR ? 24 : 40, bases = rna ? ['A', 'U', 'G', 'C'] : ['A', 'T', 'G', 'C'];
    const cx = NAR ? A.cx - u * .1 : A.x0 + A.w * .3, cy = NAR ? A.y0 + A.h * .2 : A.cy - u * .4, b = bases[Math.floor(t / 2.2) % 4];
    const N = nucleo(cx, cy, u * (NAR ? 1.2 : 1.4), b, rna);
    lab(N.px, cy - u * .5, N.px - 10, cy - u * 2.2, 'fosfato'); lab(cx, cy - u * .6, cx + 10, cy - u * 2.4, rna ? 'ribose' : 'desoxirribose'); lab(N.bx, cy - u * .6, N.bx + 20, cy - u * 2.2, 'base nitrogenada');
    head(rna ? 'nucleotídeo de RNA' : 'nucleotídeo de DNA', cx, A.y0 + 10, C.na);
    // cadeia
    const ch = NAR ? { x: A.x0 + 10, y: A.y0 + A.h * .48 } : { x: A.x0 + A.w * .62, y: A.y0 + 30 }, n = 4, gap = NAR ? u * 1.5 : u * 1.9, cu = u * .7;
    for (let i = 0; i < n; i++) { const y = ch.y + i * gap + 20; nucleo(ch.x + cu * 1.6, y, cu, bases[(i + 1) % 4], rna); if (i) line(ch.x + cu * .4, y - gap + 4, ch.x + cu * 1.6 - cu * .3, y - cu * .2 , 'rgba(232,237,247,.5)', 2); }
    if (!NAR) { tx('ligações fosfodiéster formam a cadeia', ch.x + cu * 2.2, ch.y + n * gap + 26, { s: 12, c: C.dim }); }
    const ty = NAR ? A.y1 - 30 : A.y1 - 40, tx0 = NAR ? A.x0 + 6 : A.x0 + 10;
    tx('purinas (2 anéis): A, G', tx0, ty, { a: 'left', s: 13, w: 600, c: C.txt, bg: false }); tx(rna ? 'pirimidinas (1 anel): C, U' : 'pirimidinas (1 anel): C, T', tx0, ty + 20, { a: 'left', s: 13, w: 600, c: C.txt, bg: false });
    cap(rna ? 'RNA: ribose (com OH no carbono 2) e uracila (U) no lugar da timina' : 'DNA: desoxirribose (sem o OH no carbono 2) e timina (T)');
  }
});

def('na', 'pareamento', {
  t: 'Pareamento de bases', s: 'A com T, G com C', c: C.na, loc: 'Trecho de DNA com 100 pares', still: 2,
  ctl: { l: 'Adenina no DNA', min: 10, max: 40, step: 1, v: 30, f: v => v + ' %', rate: () => 1 },
  alt: 'Escada de DNA com pares de bases: adenina com timina por duas ligações de hidrogênio e guanina com citosina por três; o cálculo das porcentagens muda com o controle',
  d: `<p><b>No DNA, as duas fitas se unem pelas bases: adenina sempre com timina (A–T) e guanina sempre com citosina (G–C).</b> Uma purina sempre pareia com uma pirimidina, e por isso a largura da dupla hélice é constante.</p>
<p>Como as bases pareiam assim, num DNA de fita dupla a quantidade de A é igual à de T, e a de G é igual à de C (<b>regras de Chargaff</b>). Sabendo a porcentagem de uma base, dá para calcular as outras: se A = 30%, então T = 30%, e G + C = 40%, ou seja, G = C = 20%. Mude a porcentagem de adenina no controle.</p>
<p>A–T faz 2 ligações de hidrogênio e G–C faz 3. Mais GC deixa o DNA mais estável: em parte por essas ligações, mas principalmente porque os pares G–C se empilham com mais força. As fitas são <b>antiparalelas</b>: uma corre no sentido 5'→3' e a outra no sentido 3'→5'.</p>`,
  kv: [['Pares', 'A–T (2 ligações de H) e G–C (3 ligações de H)'], ['Chargaff', 'A = T e G = C; A + G = T + C = 50%'], ['Fitas', 'antiparalelas (5\'→3\' e 3\'→5\')'], ['No RNA', 'fita simples; A pareia com U quando há pareamento']],
  enem: 'Questão clássica: dada a porcentagem de uma base, calcule as outras. Também cai o número de ligações de hidrogênio de um trecho. Exemplo: 100 pares com 30% de A têm 60 pares A–T e 40 pares G–C, logo 60 × 2 + 40 × 3 = 240 ligações de hidrogênio.',
  links: [LK.dna],
  draw(t, S) {
    const A = area(), a = S.v, g = 50 - a, pAT = 2 * a, pGC = 100 - pAT, hb = pAT * 2 + pGC * 3, n = NAR ? 10 : 14, R = rng(5);
    const pairs = []; let nat = Math.round(n * pAT / 100); const idx = [...Array(n).keys()].sort(() => R() - .5).slice(0, nat);
    for (let i = 0; i < n; i++) { const at = idx.includes(i), flip = R() < .5; pairs.push(at ? (flip ? ['A', 'T'] : ['T', 'A']) : (flip ? ['G', 'C'] : ['C', 'G'])); }
    const L = NAR ? { x: A.cx, y0: A.y0 + 6, h: A.h * .58 } : { x: A.x0 + A.w * .28, y0: A.y0 + 8, h: A.h - 16 }, hw = NAR ? A.w * .32 : Math.min(A.w * .2, 150), sp = L.h / n;
    for (let i = 0; i < n; i++) {
      const y = L.y0 + sp * (i + .5), tw2 = Math.cos(t * .5 + i * .45), w = hw * (.55 + .45 * Math.abs(tw2)), xl = L.x - w, xr = L.x + w, [b1, b2] = pairs[i];
      if (i) { line(L.x - hw * (.55 + .45 * Math.abs(Math.cos(t * .5 + (i - 1) * .45))), y - sp, xl, y, rgba(C.creme, .7), 3); line(L.x + hw * (.55 + .45 * Math.abs(Math.cos(t * .5 + (i - 1) * .45))), y - sp, xr, y, rgba(C.creme, .7), 3); }
      circ(xl, y, 5, C.p); circ(xr, y, 5, C.p);
      rr(xl + 6, y - sp * .28, L.x - xl - 10, sp * .56, 4, BASE[b1]); rr(L.x + 4, y - sp * .28, xr - L.x - 10, sp * .56, 4, BASE[b2]);
      const nb = b1 === 'A' || b1 === 'T' ? 2 : 3; for (let k = 0; k < nb; k++) line(L.x - 3, y + (k - (nb - 1) / 2) * 4, L.x + 3, y + (k - (nb - 1) / 2) * 4, '#0B0F1C', 1.2);
      if (w > hw * .5) { tx(b1, (xl + L.x) / 2 + 2, y + .5, { s: 12, w: 700, c: '#0B0F1C', bg: false }); tx(b2, (xr + L.x) / 2 - 2, y + .5, { s: 12, w: 700, c: '#0B0F1C', bg: false }); }
    }
    if (!NAR) { tx("5'", L.x - hw - 14, L.y0 + 8, { s: 12, f: FD, w: 500, c: C.dim }); tx("3'", L.x + hw + 14, L.y0 + 8, { s: 12, f: FD, w: 500, c: C.dim }); }
    // cálculo
    const qx = NAR ? A.x0 + 6 : A.x0 + A.w * .56, qy = NAR ? A.y0 + A.h * .64 : A.y0 + 30, bw = NAR ? A.w - 70 : A.w * .3;
    [['A', a], ['T', a], ['G', g], ['C', g]].forEach(([b, v], k) => { const y = qy + k * (NAR ? 22 : 34); rr(qx, y - 8, 24, 18, 4, BASE[b]); tx(b, qx + 12, y + 1, { s: 12, w: 700, c: '#0B0F1C', bg: false }); rr(qx + 32, y - 5, bw, 12, 3, 'rgba(91,108,153,.2)'); rr(qx + 32, y - 5, bw * v / 50, 12, 3, BASE[b]); tx(v + ' %', qx + 40 + bw, y + 1, { a: 'left', f: FD, s: 13, w: 500, c: C.txt, bg: false }); });
    if (!NAR) { const y = qy + 4 * 34 + 16; tl([`em 100 pares: ${pAT} A–T e ${pGC} G–C`, `ligações de H: ${pAT} × 2 + ${pGC} × 3 = ${hb}`], qx + bw / 2, y, { c: C.txt }); }
    cap(`A = T = ${a}% e G = C = ${g}%; em 100 pares, ${hb} ligações de hidrogênio`);
  }
});

def('na', 'dna-rna', {
  t: 'DNA × RNA', s: 'duas fitas ou uma; T ou U', c: C.na, loc: 'Comparação', still: 3,
  alt: 'À esquerda, o DNA em dupla hélice; à direita, o RNA em fita simples dobrada sobre si mesma',
  d: `<p><b>O DNA guarda a informação genética; o RNA a usa para fabricar proteínas.</b> O DNA tem duas fitas enroladas em dupla hélice, com desoxirribose e as bases A, T, G e C. Fica no núcleo dos eucariontes (e também nas mitocôndrias e nos cloroplastos) e se duplica antes de a célula se dividir.</p>
<p>O RNA tem uma fita só, com ribose e as bases A, U, G e C. É feito a partir de um trecho do DNA (<b>transcrição</b>) e tem vários tipos: o <b>RNA mensageiro</b> leva a receita da proteína ao ribossomo; o <b>RNA transportador</b> leva os aminoácidos; o <b>RNA ribossômico</b> forma o ribossomo junto com proteínas. A fita do RNA pode dobrar sobre si mesma e parear trechos, como no RNA transportador.</p>
<p>Num ser vivo, todas as células têm o mesmo DNA (com poucas exceções, como as hemácias dos mamíferos, que não têm núcleo), mas cada tipo de célula produz RNAs diferentes, conforme os genes que estão ativos.</p>`,
  kv: [['Fitas', 'DNA: duas · RNA: uma'], ['Pentose', 'DNA: desoxirribose · RNA: ribose'], ['Bases exclusivas', 'DNA: timina · RNA: uracila'], ['Função', 'DNA: guardar e transmitir · RNA: produzir proteínas'], ['Onde', 'DNA: núcleo, mitocôndria, cloroplasto · RNA: núcleo e citoplasma']],
  enem: 'Além da tabela de diferenças, a prova cobra o fluxo da informação: DNA → RNA → proteína. Vírus de RNA (como o da gripe e o da covid-19) e as vacinas de RNA mensageiro também aparecem; lembre que o RNA da vacina não entra no núcleo nem altera o nosso DNA.',
  links: [LK.dna, ['Nucleotídeos', '#na/nucleotideo']],
  draw(t) {
    const A = area(), half = NAR ? A.h / 2 : A.w / 2, R = rng(8), seqD = 'ATGGTGCACCTGACTCCTGAGGAG', seqR = 'GCGGAUUUAGCUCAGUUGGGAGAGC';
    // DNA
    const D = NAR ? { x0: A.x0, y0: A.y0, w: A.w, h: half - 8 } : { x0: A.x0, y0: A.y0, w: half - 12, h: A.h };
    rr(D.x0, D.y0, D.w, D.h, 12, 'rgba(19,26,43,.5)', C.line, 1); tx('DNA: dupla hélice', D.x0 + D.w / 2, D.y0 + 16, { w: 600, c: C.na });
    const n = NAR ? 16 : 18, x0 = D.x0 + 20, sp = (D.w - 40) / (n - 1), cy = D.y0 + D.h * .55, amp = Math.min(D.h * .25, 60);
    for (let i = 0; i < n; i++) { const x = x0 + i * sp, ph = i * .55 + t * .6, y1 = cy + Math.sin(ph) * amp, y2 = cy - Math.sin(ph) * amp, b = seqD[i % seqD.length], c2 = { A: 'T', T: 'A', G: 'C', C: 'G' }[b]; line(x, y1, x, (y1 + y2) / 2, BASE[b], 3); line(x, (y1 + y2) / 2, x, y2, BASE[c2], 3); const front = Math.cos(ph) > 0; circ(x, y1, 4, front ? C.creme : rgba(C.creme, .45)); circ(x, y2, 4, front ? rgba(C.creme, .45) : C.creme); }
    tx('A–T e G–C', D.x0 + D.w / 2, D.y1 - 14, { s: 12, c: C.dim });
    // RNA (grampo)
    const Rr = NAR ? { x0: A.x0, y0: A.y0 + half + 8, w: A.w, h: half - 8 } : { x0: A.x0 + half + 12, y0: A.y0, w: half - 12, h: A.h };
    rr(Rr.x0, Rr.y0, Rr.w, Rr.h, 12, 'rgba(19,26,43,.5)', C.line, 1); tx('RNA: fita simples', Rr.x0 + Rr.w / 2, Rr.y0 + 16, { w: 600, c: C.na });
    const m = 12, s2 = Math.min((Rr.h - 70) / (m / 2 + 1), 26), cx = Rr.x0 + Rr.w / 2, top = Rr.y0 + 40;
    const pts = []; for (let i = 0; i < m; i++) { const side = i < m / 2 ? -1 : 1, k = i < m / 2 ? i : m - 1 - i; pts.push([cx + side * s2 * .9 + Math.sin(t + i) * 1.5, top + (m / 2 - k) * s2]); }
    for (let i = 0; i < m / 2 - 1; i++) { const a = seqR[i], b = { A: 'U', U: 'A', G: 'C', C: 'G' }[a]; line(pts[i][0], pts[i][1], pts[m - 1 - i][0], pts[m - 1 - i][1], 'rgba(143,216,255,.5)', 1.5, [2, 3]); }
    poly(pts, rgba(C.creme, .7), 3); pts.forEach((p, i) => { const b = i < m / 2 - 1 ? seqR[i] : i > m / 2 ? { A: 'U', U: 'A', G: 'C', C: 'G' }[seqR[m - 1 - i]] : 'A'; circ(p[0], p[1], 9, BASE[b], 'rgba(11,15,28,.5)', 1); tx(b, p[0], p[1] + .5, { s: 12, w: 700, c: '#0B0F1C', bg: false }); });
    tx('dobra sobre si mesma; U no lugar de T', cx, Rr.y1 - 14, { s: 12, c: C.dim });
    cap('DNA: duas fitas, desoxirribose e timina. RNA: uma fita, ribose e uracila');
  }
});
