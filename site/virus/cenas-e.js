/* LAB, módulo Vírus. Cenas: Prevenção (P1, vacina, soro e antivirais; P2, cada via, sua prevenção).
   Código da equipe (Aurelius). Textos: roteiro do Taxon revisado pelo Sapien (docs/revisao-biologia/virus-roteiro.md).
   Sem idades nem doses de vacinas: o calendário muda e a tela aponta para o calendário vigente. */
'use strict';
{
  const PRE = C.vacina;
  const passo = S => S.paused ? .12 : Math.min(.05, S.dt || .016);
  const modo = (id, t) => ({ t, on: S => { S.modo = id; }, pressed: S => S.modo === id });
  const toque = S => { const now = performance.now(), ok = now - (S.tapT || 0) > 200; S.tapT = now; return ok; };
  const sorte = k => { const R = rng(Math.imul(k + 1, 2654435761) >>> 0); R(); R(); return R; };

  // =====================================================================================
  // P1 VACINA, SORO E ANTIVIRAIS: gráficos de anticorpos, casos, antibiótico e imunidade coletiva
  // =====================================================================================
  // quantidade de anticorpos (0 a 1) no dia d; o vírus (ou o reforço) chega no dia 60
  const DV = 60;
  const prim = d => d <= 7 ? 0 : .4 * (1 - Math.exp(-(d - 7) / 7)) * Math.exp(-(d - 7) / 45);                  // resposta primária
  const secu = d => d <= DV + 2 ? 0 : .88 * (1 - Math.exp(-(d - DV - 2) / 4)) * Math.exp(-(d - DV - 2) / 80); // secundária (memória)
  const vac = d => Math.min(1, prim(d) + secu(d));
  const soro = d => d < 0 ? 0 : .85 * Math.exp(-d / 11);
  const soroPrim = d => prim(d - DV); // sem memória: diante do vírus, o corpo responde como na primeira vez
  function grafico(P, tipo, dia, t) {
    const { x, y, w, h } = P, cor = tipo === 'vac' ? C.vacina : C.soro;
    panel(x, y, w, h, { s: rgba(cor, .5) });
    head(tipo === 'vac' ? 'Vacina: imunização ativa' : 'Soro: imunização passiva', x + 14, y + 18, cor, 'left');
    const gx0 = x + (NAR ? 34 : 46), gx1 = x + w - 16, gy0 = y + 42, gy1 = y + h - (NAR ? 30 : 36), D1 = 120;
    const Xd = d => lerp(gx0, gx1, d / D1), Yv = v => lerp(gy1, gy0 + 14, v);
    line(gx0, gy1, gx1, gy1, C.dim, 1.2); line(gx0, gy1, gx0, gy0, C.dim, 1.2);
    for (const d of [0, 30, 60, 90, 120]) { line(Xd(d), gy1, Xd(d), gy1 + 4, C.dim, 1); tx(String(d), Xd(d), gy1 + 12, { f: FD, s: 12, w: 500, c: C.dim, bg: false }); }
    tx('dias', gx1, gy1 + (NAR ? 24 : 26), { s: 12, a: 'right', c: C.dim, bg: false });
    X.save(); X.translate(x + (NAR ? 14 : 18), (gy0 + gy1) / 2); X.rotate(-PI / 2); tx('anticorpos', 0, 0, { s: 12, c: C.dim, bg: false }); X.restore();
    // aplicação no dia 0: marca no eixo e nome ao lado do zero
    tx(tipo === 'vac' ? '1ª dose' : 'soro', Xd(0) + 10, gy1 + 12, { s: 12, w: 600, a: 'left', c: cor, bg: false });
    // "aqui chega o vírus" (no gráfico da vacina, também pode ser o reforço)
    line(Xd(DV), gy0 + 6, Xd(DV), gy1, rgba(C.virus, .6), 1, [4, 4]);
    if (dia > DV - 8) { virion(Xd(DV), gy0 + 8, NAR ? 7 : 9, { tipo: 'gripe', rot: t * .3, a: ss(seg(dia, DV - 8, DV)) }); if (LB) tx(tipo === 'vac' ? 'reforço ou vírus' : 'aqui chega o vírus', Xd(DV) + (NAR ? 10 : 14), gy0 + 8, { s: 12, a: 'left', c: C.virus }); }
    // curva até o dia atual
    const f = tipo === 'vac' ? vac : soro, pts = [];
    for (let d = 0; d <= dia; d += .5) pts.push([Xd(d), Yv(f(d))]);
    if (tipo !== 'vac' && dia > DV + 4) { const q = []; for (let d = DV + 4; d <= dia; d += .5) q.push([Xd(d), Yv(soroPrim(d))]); if (q.length > 1) poly(q, rgba(C.soro, .7), 1.8, [5, 4]); }
    if (pts.length > 1) { poly(pts, cor, 2.6); const p = pts[pts.length - 1]; circ(p[0], p[1], 4.5, cor, '#0B0F1C', 1.5); }
    circ(Xd(0), gy1, 4, cor, '#0B0F1C', 1.2);
    if (!LB) return;
    if (tipo === 'vac') {
      if (dia > 22) wrapTx('resposta primária: lenta e pequena', Xd(NAR ? 6 : 8), Yv(.4) - (NAR ? 8 : 4), NAR ? 130 : 220, { s: 12, a: 'left', c: C.txt, lh: 15 });
      if (dia > DV + 10) wrapTx(NAR ? 'resposta secundária: rápida e forte' : 'resposta secundária: rápida e forte, graças à memória', Xd(DV + 6), Yv(.36), gx1 - Xd(DV + 6) - 2, { s: 12, a: 'left', c: C.txt, lh: 15 });
    } else {
      if (dia > 4) wrapTx('efeito imediato: anticorpos prontos', Xd(NAR ? 9 : 7), Yv(.86) - 2, NAR ? 120 : 200, { s: 12, a: 'left', c: C.txt, lh: 15 });
      if (dia > 34) wrapTx('em poucas semanas, acabam', Xd(26), Yv(.3), NAR ? 100 : 170, { s: 12, a: 'left', c: C.txt, lh: 15 });
      if (dia > DV + 14) wrapTx('sem memória: o corpo responde devagar, como na primeira vez', Xd(DV + 6), Yv(.62), gx1 - Xd(DV + 8), { s: 12, a: 'left', c: C.dim, lh: 15 });
    }
  }
  function drawGraf(t, S, A) {
    const tt = t % 15, dia = 120 * ss(seg(tt, .4, 12));
    if (!NAR) { const g = 24, w = (A.w - g) / 2; grafico({ x: A.x0, y: A.y0, w, h: A.h }, 'vac', dia, t); grafico({ x: A.x0 + w + g, y: A.y0, w, h: A.h }, 'soro', dia, t); }
    else { const g = 10, h = (A.h - g) / 2; grafico({ x: A.x0, y: A.y0, w: A.w, h }, 'vac', dia, t); grafico({ x: A.x0, y: A.y0 + h + g, w: A.w, h }, 'soro', dia, t); }
    cap(dia < DV ? 'A vacina leva dias ou semanas para fazer efeito; o soro age na hora, mas os anticorpos dele acabam em poucas semanas.' : 'Quando o vírus chega, quem foi vacinado responde rápido e forte (memória). O soro não deixa memória.');
  }
  const VS = baralho({
    nome: 'vs',
    alvos: [{ t: 'vacina', c: C.vacina }, { t: 'soro e vacina', c: C.soro }],
    cartas: [
      { t: 'criança que vai completar o calendário de vacinação', k: 0, x: 'o objetivo é prevenir, e a vacina deixa memória por muito tempo.' },
      { t: 'pessoa mordida por um morcego', k: 1, x: 'o soro antirrábico age na hora, com anticorpos prontos, e a vacina faz o corpo produzir a própria defesa, que dura.' },
      { t: 'viajante que vai para área de febre amarela daqui a um mês', k: 0, x: 'a vacina precisa de tempo para agir: deve ser tomada com pelo menos 10 dias de antecedência.' },
      { t: 'menina ou menino na idade da vacina contra o HPV que ainda não se vacinou', k: 0, x: 'é uma vacina que previne câncer; a faixa de idade está no calendário vigente.' }
    ],
    certo: c => `Isso: ${c.x}`,
    errado: c => c.k ? 'A vacina sozinha demora dias ou semanas para agir. Depois de uma mordida, também é preciso o soro, que age na hora.' : 'Aqui não há emergência: o objetivo é prevenir, e isso é papel da vacina.',
    fim: () => 'Vacina previne e deixa memória; soro age na hora, para tratar ou em emergências, mas dura pouco.',
    dica: 'Primeiro toque num caso; depois, na resposta.'
  });
  const AB = baralho({
    nome: 'ab',
    alvos: [{ t: 'antibiótico não serve', c: C.erro }, { t: 'antibiótico serve', c: C.ok }],
    cartas: [
      { t: 'gripe', k: 0 }, { t: 'covid-19', k: 0 }, { t: 'dengue', k: 0 }, { t: 'resfriado comum', k: 0, m: 1 },
      { t: 'pneumonia bacteriana depois de uma gripe', k: 1 }
    ],
    certo: c => c.k ? 'Isso: aí a doença é causada por uma bactéria, que aproveitou a gripe. O antibiótico age nela.' : `Isso: ${c.t} é ${c.m ? 'causado' : 'causada'} por vírus, e antibiótico não age em vírus.`,
    errado: c => c.k ? 'Olhe de novo: essa pneumonia é causada por uma bactéria.' : `Olhe de novo: ${c.t} é uma virose.`,
    fim: () => 'Antibióticos atacam parede celular e ribossomos de bactérias, estruturas que o vírus não tem. Usá-los sem necessidade seleciona bactérias resistentes.',
    dica: 'Primeiro toque numa doença; depois, na coluna.'
  });
  // imunidade coletiva: 100 pessoas; cada uma encontra 15 outras; o caso de sarampo vem de fora, encontra 6 pessoas e transmite a todas as que não têm vacina.
  // Com transmissão de 85% por encontro, cada doente passaria o vírus a cerca de 13 pessoas sem imunidade (o roteiro dá de 12 a 18).
  // Ordem de vacinação embaralhada: com cobertura de c%, exatamente c pessoas estão vacinadas. Calibrado por simulação:
  // até 85%, o surto pega quase todos os sem vacina; em 90%, boa parte; em 95%, a cadeia para em uma ou duas pessoas.
  const NP = 100, NK = 15, PQ = .85;
  const ORD = (() => { const R = sorte(77), a = [...Array(NP).keys()]; for (let i = NP - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; })();
  const PES = Array.from({ length: NP }, (_, i) => { const R = sorte(500 + i); return { k: (ORD.indexOf(i) + .5) / NP, jx: R() - .5, jy: R() - .5 }; });
  const CONT = Array.from({ length: NP }, (_, i) => { const R = sorte(900 + i), s = new Set(); while (s.size < NK) { const j = Math.floor(R() * NP); if (j !== i) s.add(j); } return [...s]; });
  CONT.push([10, 30, 50, 70, 88, 96].map(r => ORD[r])); // quem o caso de fora encontra: gente de vários pontos da fila de vacinação
  const vacinado = (i, cov) => PES[i].k < cov / 100;
  function soltaCaso(S) { const r = S.rede || {}; S.rede = { on: true, cov: S.v, step: 0, tm: 0, inf: { [NP]: 0 }, links: [], fim: false, msg: '', seed: (r.seed || 0) + 1 }; }
  function passoRede(S) {
    const r = S.rede; if (!r || !r.on || r.fim) return;
    r.tm += passo(S); if (r.tm < .55) return; r.tm = 0;
    const R = sorte(r.seed * 7919 + r.step), novos = Object.keys(r.inf).map(Number).filter(i => r.inf[i] === r.step);
    let houve = false;
    for (const i of novos) for (const j of CONT[i]) if (!vacinado(j, r.cov) && r.inf[j] == null && (i === NP || R() < PQ)) { r.inf[j] = r.step + 1; r.links.push([i, j]); houve = true; }
    if (houve) { r.step++; return; }
    r.fim = true;
    const n = Object.keys(r.inf).length - 1, u = PES.filter((p, i) => !vacinado(i, r.cov)).length, ger = Math.max(...Object.values(r.inf));
    const meta = 'Para o sarampo, a meta é de cerca de 95%.';
    r.msg = !u ? 'Com todos vacinados, o vírus não encontrou ninguém para infectar.'
      : !n ? `Com cobertura de ${r.cov}%, o caso de sarampo só encontrou gente vacinada, e o vírus parou nele. É a imunidade coletiva: até quem não tomou a vacina ficou protegido. ${meta}`
      : n <= Math.max(2, u * .25) && ger <= 2 ? `Com cobertura de ${r.cov}%, a cadeia se interrompeu logo: só ${n} das ${u} pessoas sem vacina ${n === 1 ? 'ficou doente' : 'ficaram doentes'}. É a imunidade coletiva. ${meta}`
      : `Com cobertura de ${r.cov}%, o vírus passou de pessoa a pessoa: ${n === u ? `todas as ${u}` : `${n} das ${u}`} pessoas sem vacina ficaram doentes. Aumente a cobertura e solte outro caso. ${meta}`;
  }
  // ligação curva entre quem passou e quem pegou o vírus; k (0 a 1) é a fração desenhada
  function arco(x1, y1, x2, y2, k, c, lw) {
    const cx = (x1 + x2) / 2 - (y2 - y1) * .14, cy = (y1 + y2) / 2 + (x2 - x1) * .14;
    X.beginPath(); X.moveTo(x1, y1);
    for (let s = 1; s <= 16; s++) { const u = s / 16 * k, a = (1 - u) * (1 - u), b = 2 * u * (1 - u), d = u * u; X.lineTo(a * x1 + b * cx + d * x2, a * y1 + b * cy + d * y2); }
    X.strokeStyle = c; X.lineWidth = lw; X.lineCap = 'round'; X.stroke();
  }
  function drawRede(t, S, A) {
    if (S.rede && S.rede.on && S.rede.cov !== S.v) S.rede = null;
    passoRede(S);
    const r = S.rede, cov = S.v, k = r && !r.fim ? ss(r.tm / .35) : 1;
    const side = NAR ? Math.min(A.w, A.h - 150) : Math.min(A.h - 8, A.w * .48), gx0 = NAR ? A.x0 + (A.w - side) / 2 : A.x0 + 70, gy0 = NAR ? A.y0 + 36 : A.y0 + (A.h - side) / 2, cs = side / 10;
    const pos = i => i === NP ? (NAR ? [A.x0 + 16, A.y0 + 12] : [gx0 - 42, gy0 + side / 2]) : [gx0 + cs * ((i % 10) + .5 + PES[i].jx * .3), gy0 + cs * (Math.floor(i / 10) + .5 + PES[i].jy * .3)];
    rr(gx0 - 6, gy0 - 6, side + 12, side + 12, 12, 'rgba(19,26,43,.5)', C.line, 1);
    // quem pegou o vírus no último passo aparece quando a ligação chega até a pessoa
    const novo = j => r && !r.fim && r.inf[j] === r.step && k < 1;
    if (r) for (const [i, j] of r.links) { const [x1, y1] = pos(i), [x2, y2] = pos(j), nv = r.inf[j] === r.step && !r.fim; arco(x1, y1, x2, y2, nv ? k : 1, rgba(C.erro, nv ? .9 : .4), nv ? 2 : 1.2); }
    const sz = Math.min(26, cs * .62);
    for (let i = 0; i < NP; i++) {
      const [x, y] = pos(i), v = vacinado(i, cov), g = r && r.inf[i] != null && !novo(i) ? r.inf[i] : null, doente = g != null && g >= r.step - 1;
      const c = g != null ? (doente ? C.erro : '#9C3A3A') : v ? C.vacina : '#C9D3F0';
      if (v && g == null) circ(x, y, sz * .62, rgba(C.vacina, .14), rgba(C.vacina, .6), 1);
      bicho('humano', x, y, sz, { c, f: g != null ? rgba(C.erro, doente ? .6 : .3) : undefined, lw: 1.4 });
    }
    // o caso que vem de fora
    { const [x, y] = pos(NP); circ(x, y, sz * .75, rgba(C.erro, .2), C.erro, 1.5); bicho('humano', x, y, sz, { c: C.erro, f: rgba(C.erro, .6), lw: 1.4 }); tx('caso de sarampo', NAR ? x + sz * .9 : x, NAR ? y : y + sz * .95 + 8, { s: 12, w: 600, a: NAR ? 'left' : 'center', c: C.erro }); hitC(x, y, sz, 'caso'); }
    // legenda e contagem
    const u = PES.filter((p, i) => !vacinado(i, cov)).length, n = r ? Object.keys(r.inf).filter(i => +i !== NP && !novo(+i)).length : 0;
    const L = [['vacinado', C.vacina], ['sem vacina', '#C9D3F0'], ['doente agora', C.erro], ['já ficou doente', '#9C3A3A']];
    if (!NAR) {
      const lx = gx0 + side + 40, ly = gy0 + 10;
      head('Imunidade coletiva', lx, ly, C.txt, 'left');
      L.forEach(([s, c], q) => { bicho('humano', lx + 10, ly + 40 + q * 30, 22, { c, lw: 1.4 }); tx(s, lx + 30, ly + 40 + q * 30, { s: 13, a: 'left', c: C.txt }); });
      tx(`cobertura vacinal: ${cov}%`, lx, ly + 172, { s: 14, w: 600, a: 'left', c: C.vacina });
      tx(`sem vacina: ${u} de ${NP}`, lx, ly + 196, { s: 13, a: 'left', c: C.txt });
      tx(`doentes: ${n}`, lx, ly + 220, { s: 13, a: 'left', c: n ? C.erro : C.txt });
      wrapTx('Na simulação, cada pessoa encontra 15 outras, e a vacina protege todos os vacinados (na vida real, quase todos).', lx, ly + 252, A.x1 - lx, { s: 12, a: 'left', c: C.dim, lh: 16 });
    } else {
      const ly = gy0 + side + 22;
      L.forEach(([s, c], q) => { const lx = A.x0 + (q % 2) * A.w * .5; bicho('humano', lx + 8, ly + Math.floor(q / 2) * 24, 18, { c, lw: 1.3 }); tx(s, lx + 22, ly + Math.floor(q / 2) * 24, { s: 12, a: 'left', c: C.txt }); });
      tx(`cobertura: ${cov}%   sem vacina: ${u}   doentes: ${n}`, A.cx, ly + 56, { s: 12, w: 600, c: C.txt });
    }
    hitR(gx0, gy0, side, side, 'grade');
    cap(r && r.fim ? r.msg : r ? 'O vírus do sarampo passa pelo ar, de quem está doente para as pessoas sem proteção que ele encontra…' : 'Escolha a cobertura vacinal na faixa e toque em "Soltar um caso" (ou na grade).');
  }

  def('prevencao', 'vacinas', {
    t: 'Vacina, soro e antivirais', s: 'ensinar o corpo, emprestar anticorpos ou bloquear o vírus', c: PRE,
    loc: 'Anticorpos ao longo do tempo', locNota: 'Curvas esquemáticas',
    alt: 'dois gráficos de quantidade de anticorpos ao longo de 120 dias: com a vacina, a resposta primária é lenta e pequena e, quando o vírus ou o reforço chega, a resposta secundária é rápida e forte; com o soro, a subida é imediata e some em poucas semanas, sem memória; há também casos para decidir entre vacina e soro, doenças para decidir se antibiótico serve, e uma rede de 100 pessoas em que a cobertura vacinal interrompe a passagem do sarampo',
    still: 12,
    ctl: { l: 'Cobertura vacinal', min: 0, max: 100, step: 5, v: 70, f: v => `${v}%`, rate: () => 1 },
    ctlVis: S => S.modo === 'rede',
    extra: [
      modo('graf', 'Gráficos'), modo('vs', 'Vacina ou soro?'), modo('ab', 'Antibiótico serve?'), modo('rede', 'Imunidade coletiva'),
      { t: 'Soltar um caso', on: S => { S.modo = 'rede'; soltaCaso(S); }, pressed: () => false }
    ],
    init(S) { S.modo = 'graf'; S.rede = null; VS.zera(S); AB.zera(S); },
    d: `<p>Uma <b>vacina</b> apresenta ao sistema imune o vírus enfraquecido, morto, ou só um pedaço dele, sem causar a doença. O corpo produz <b>anticorpos</b> e células de <b>memória</b>, e, quando encontra o vírus de verdade, responde rápido e forte. É uma <b>imunização ativa</b> (o próprio corpo produz a defesa), <b>preventiva</b> e <b>duradoura</b>, mas que leva alguns dias ou semanas para fazer efeito. Os principais tipos são: <b>vírus atenuado</b> (vivo, enfraquecido: tríplice viral, febre amarela, catapora); <b>vírus inativado</b> (morto: poliomielite injetável, CoronaVac, gripe); <b>subunidade</b> ou <b>partícula semelhante ao vírus</b> (só proteínas do vírus, sem ácido nucleico: hepatite B e HPV); <b>vetor viral</b> e <b>RNA mensageiro</b> (o corpo recebe a "receita" de uma proteína do vírus e a produz por pouco tempo). O <b>soro</b> é diferente: contém <b>anticorpos prontos</b>, produzidos em outro animal (em geral cavalos) ou em pessoas. É uma <b>imunização passiva</b>: age <b>na hora</b>, mas <b>dura pouco</b> e não deixa memória. Por isso é usado para <b>tratar</b> ou em emergências, como o <b>soro antirrábico</b> depois da mordida de um animal com suspeita de raiva, junto com a vacina.</p>
<p>Quando muita gente se vacina, o vírus encontra poucas pessoas para infectar e para de circular, protegendo também quem não pode tomar a vacina (bebês muito pequenos, pessoas com imunidade baixa): é a <b>imunidade coletiva</b> (ou "de rebanho"). Foi assim que a <b>varíola</b> foi <b>erradicada</b> do mundo (a OMS declarou em <b>1980</b>) e que o Brasil não tem casos de <b>poliomielite</b> desde <b>1989</b>. A história das vacinas no Brasil passa pela <b>Revolta da Vacina</b> (1904), no Rio de Janeiro: a população se revoltou contra a vacinação obrigatória contra a varíola, campanha comandada pelo médico sanitarista <b>Oswaldo Cruz</b>. Contra vírus já instalados, <b>antibióticos não funcionam</b>: eles atacam parede celular e ribossomos de bactérias, estruturas que o vírus não tem, e usá-los sem necessidade seleciona <b>bactérias resistentes</b>. Para alguns vírus existem <b>antivirais</b>, que bloqueiam etapas da multiplicação viral: aciclovir (herpes), oseltamivir (gripe), os antirretrovirais (HIV) e os remédios que curam a hepatite C.</p>
<div class="tab"><table><thead><tr><th></th><th>Vacina</th><th>Soro</th></tr></thead><tbody>
<tr><td>O que contém</td><td>antígeno (vírus atenuado, inativado ou parte dele)</td><td>anticorpos prontos</td></tr>
<tr><td>Tipo de imunização</td><td>ativa</td><td>passiva</td></tr>
<tr><td>Quando age</td><td>depois de dias ou semanas</td><td>imediatamente</td></tr>
<tr><td>Duração</td><td>longa (memória)</td><td>curta (semanas)</td></tr>
<tr><td>Uso</td><td>prevenção</td><td>tratamento ou emergência</td></tr>
<tr><td>Exemplo com vírus</td><td>tríplice viral, febre amarela, HPV</td><td>soro antirrábico</td></tr>
</tbody></table></div>
<p>Idades e doses de cada vacina mudam: confira sempre o calendário vigente do Programa Nacional de Imunizações. Em "Imunidade coletiva", escolha a cobertura vacinal na faixa e solte um caso de sarampo.</p>`,
    enem: '<b>Vacina</b> = <b>antígeno</b>, imunização <b>ativa</b>, <b>preventiva</b>, com <b>memória</b>. <b>Soro</b> = <b>anticorpos prontos</b>, imunização <b>passiva</b>, efeito <b>imediato</b> e <b>curto</b>, usado para <b>tratar</b>. Esta é uma das comparações mais cobradas da Biologia. Também caem: <b>imunidade coletiva</b>, erradicação da <b>varíola</b>, <b>Revolta da Vacina</b> e o erro de usar <b>antibiótico contra vírus</b>. Gráficos de anticorpos com resposta primária e secundária são frequentes.',
    links: [LK.calendario, ['Cada via, sua prevenção', '#prevencao/transmissao'], ['HIV e aids', '#doencas/hiv']],
    tap(x, y, S) {
      if (S.modo === 'vs') { VS.tap(x, y, S); return; }
      if (S.modo === 'ab') { AB.tap(x, y, S); return; }
      if (S.modo === 'rede' && toque(S)) { const h = hitAt(x, y); if (h === 'grade' || h === 'caso') soltaCaso(S); }
    },
    grab(x, y, S) { return S.modo === 'vs' ? VS.grab(x, y, S) : S.modo === 'ab' ? AB.grab(x, y, S) : false; },
    grabMove(x, y, S) { VS.grabMove(x, y, S); AB.grabMove(x, y, S); },
    grabEnd(x, y, S) { VS.grabEnd(x, y, S); AB.grabEnd(x, y, S); },
    draw(t, S) {
      const A = area();
      if (S.modo === 'vs') { VS.draw(S, A, { cols: NAR ? 2 : 4, cartaH: NAR ? 54 : 56, slotH: NAR ? 50 : 44 }); cap(VS.msg(S) || 'Vacina ou soro? Toque num caso e depois na resposta (no computador, também dá para arrastar).'); }
      else if (S.modo === 'ab') { AB.draw(S, A, { cols: NAR ? 2 : 5, cartaH: NAR ? 44 : 48, slotH: 34 }); cap(AB.msg(S) || 'Antibiótico serve? Toque numa doença e depois na coluna.'); }
      else if (S.modo === 'rede') drawRede(t, S, A);
      else drawGraf(t, S, A);
    }
  });

  // =====================================================================================
  // P2 CADA VIA, SUA PREVENÇÃO: portas e trancas num bairro; monte o plano
  // =====================================================================================
  const VN = { resp: 'respiratória', vetor: 'vetorial', sangue: 'sangue e sexual', fecal: 'fecal-oral' };
  const PORTAS = [
    { id: 'resp', n: 'respiratória', ex: 'gripe, covid-19, sarampo, catapora, caxumba, rubéola', vt: 'gripe', m: [
      ['vacinação', 1], ['ambientes ventilados'], ['máscara quando indicada'], ['cobrir a boca e o nariz com o braço ao tossir e espirrar'], ['lavar as mãos'], ['ficar em casa quando doente']] },
    { id: 'vetor', n: 'vetorial', ex: 'dengue, zika, chikungunya, febre amarela', vt: 'dengue', m: [
      ['eliminar criadouros de água parada'], ['telas e repelente'], ['roupas que cobrem o corpo'], ['vacina (febre amarela e dengue)', 1], ['mosquitos com <i>Wolbachia</i>']] },
    { id: 'sangue', n: 'sangue e sexual', ex: 'HIV, hepatites B e C, HPV, herpes genital', vt: 'hiv', m: [
      ['preservativo'], ['não compartilhar seringas, agulhas e objetos cortantes'], ['material esterilizado ou descartável'], ['testagem do sangue doado'], ['testagem e tratamento; PrEP e PEP para o HIV'], ['vacina (hepatite B e HPV)', 1], ['pré-natal']] },
    { id: 'fecal', n: 'fecal-oral', ex: 'hepatite A, poliomielite, rotavírus, norovírus', vt: 'nu', m: [
      ['saneamento básico'], ['água tratada ou fervida'], ['lavar as mãos depois do banheiro e antes de comer'], ['lavar bem os alimentos crus'], ['vacina (hepatite A, poliomielite, rotavírus)', 1]] }
  ];
  function tranca(x, y, s, c, fechada) { // cadeado; aberto, a alça sobe e solta de um lado
    X.save(); X.lineCap = 'round'; X.lineJoin = 'round'; X.strokeStyle = c; X.lineWidth = Math.max(1.6, s * .12);
    const r = s * .24, by = y - s * .1, up = fechada ? 0 : s * .16, ay = by - s * .16 - up;
    X.beginPath(); X.moveTo(x - r, by); X.lineTo(x - r, ay); X.arc(x, ay, r, PI, 0); X.lineTo(x + r, fechada ? by : ay + s * .08); X.stroke();
    rr(x - s * .38, by, s * .76, s * .56, s * .1, fechada ? c : rgba(c, .25), c, 1.2); circ(x, by + s * .26, s * .07, '#0B0F1C');
    X.restore();
  }
  // fachada de casa com telhado; cx centro, by linha da calçada; devolve o topo do telhado
  function casa(cx, by, w, h, cor, sel) {
    const x = cx - w / 2, y = by - h, rh = w * .3, sc = rgba(cor, sel ? .95 : .5), lw = sel ? 2.2 : 1.4;
    X.save(); X.lineJoin = 'round';
    X.beginPath(); X.moveTo(x - w * .06, y + 1); X.lineTo(cx, y - rh); X.lineTo(x + w * 1.06, y + 1); X.closePath();
    X.fillStyle = '#1A2238'; X.fill(); X.strokeStyle = sc; X.lineWidth = lw; X.stroke(); X.restore();
    rr(x, y, w, h, 2, '#141B2E', sc, lw);
    circ(cx, y - rh * .4, Math.max(3, rh * .17), '#0B0F1C', sc, 1.2);
    return y - rh;
  }
  function drawPortas(t, S, A) {
    const n = PORTAS.length, g = NAR ? 6 : 24, cellW = (A.w - (n - 1) * g) / n;
    const hw = NAR ? cellW - 4 : Math.min(210, cellW * .76), hh = NAR ? 108 : Math.min(150, A.h * .34), rh = hw * .3;
    const by = A.y0 + (NAR ? 26 : 30) + rh + hh, dw = hw * (NAR ? .5 : .44), dh = hh * .8, dy = by - dh, ar = dw / 2;
    const st = S.tr || (S.tr = [0, 0, 0, 0]);
    if (S.sel != null) st[S.sel] = Math.min(PORTAS[S.sel].m.length, st[S.sel] + passo(S) / .8);
    const vacVista = st.some((v, i) => PORTAS[i].m.findIndex(m => m[1]) < Math.floor(v));
    const barY = (k, tot) => dy + ar * 1.15 + (k + .5) * (dh - ar * 1.15) / (tot + .2);
    line(A.x0, by + 1, A.x1, by + 1, C.line, 2); // calçada
    PORTAS.forEach((p, i) => {
      const cx = A.x0 + cellW * (i + .5), x = cx - dw / 2, cor = VIA[p.id].c, sel = S.sel === i, nt = Math.floor(st[i]), tot = p.m.length, fechada = nt >= tot;
      const topo = casa(cx, by, hw, hh, cor, sel);
      hitR(cx - hw / 2 - 4, topo - 4, hw + 8, by - topo + 8, 'p' + i);
      // porta com arco
      X.beginPath(); X.moveTo(x, by); X.lineTo(x, dy + ar); X.arc(cx, dy + ar, ar, PI, 0); X.lineTo(x + dw, by); X.closePath();
      X.fillStyle = '#05070D'; X.fill(); X.strokeStyle = cor; X.lineWidth = sel ? 3.5 : 2.4; X.stroke();
      // trancas na porta (a vacina em verde-água) e, se a vacina já apareceu noutra porta, a vaga dela tracejada
      for (let k = 0; k < Math.min(nt, tot); k++) line(x + 3, barY(k, tot), x + dw - 3, barY(k, tot), p.m[k][1] ? C.vacina : cor, NAR ? 2.5 : 4);
      const kv = p.m.findIndex(m => m[1]);
      if (vacVista && kv >= nt) line(x + 3, barY(kv, tot), x + dw - 3, barY(kv, tot), rgba(C.vacina, .55), NAR ? 2 : 3, [5, 4]);
      if (fechada) tranca(cx, dy + ar * .8, NAR ? 16 : 24, cor, true);
      // vírus chegando: entram enquanto a porta está aberta; com a porta trancada, batem e voltam
      if (S.sel == null || sel || fechada) {
        const R0 = sorte(40 + i), nv = NAR ? 3 : 4, al = S.sel == null || sel ? 1 : .4, rv = NAR ? 5 : 7;
        for (let k = 0; k < nv; k++) {
          const ph = fr(t * .22 + R0()), sx = cx + (R0() - .5) * hw * .9, sy = topo - (NAR ? 2 : 8) - R0() * (NAR ? 8 : 18), ex = cx + (R0() - .5) * dw * .5, ey = dy + dh * .6;
          let vx, vy, a = al;
          if (!fechada) { vx = lerp(sx, ex, ph); vy = lerp(sy, ey, ph); a *= ph > .75 ? 1 - (ph - .75) / .25 : 1; }
          else { const b = Math.sin(ph * PI); vx = lerp(sx, ex, b * .9); vy = lerp(sy, dy + ar * .25, b); }
          if (p.id === 'vetor') { bicho('mosquito', vx, vy, NAR ? 14 : 20, { c: C.vetor, a, flip: ex > sx }); virion(vx + (ex > sx ? 1 : -1) * (NAR ? 7 : 10), vy + (NAR ? 4 : 6), NAR ? 3 : 4, { tipo: 'dengue', a }); }
          else virion(vx, vy, rv, { tipo: p.vt, rot: t * .5 + k, a });
        }
      }
      // nome da via e exemplos
      const ny = by + (NAR ? 14 : 18);
      wrapTx(p.n, cx, ny, NAR ? cellW + 4 : cellW - 12, { s: NAR ? 12 : 14, w: 700, c: cor, lh: NAR ? 14 : 17 });
      if (!NAR) wrapTx(p.ex, cx, ny + 20, cellW - 16, { s: 12, c: C.dim, lh: 15 });
    });
    const ly0 = by + (NAR ? 50 : 78), tw = NAR ? A.w - 34 : 0;
    if (S.sel != null) {
      // lista de trancas da porta escolhida
      const p = PORTAS[S.sel], cor = VIA[p.id].c, nt = Math.floor(st[S.sel]);
      let ly = ly0;
      if (NAR) ly += wrapTx(`<b>${p.n}</b>: ${p.ex}`, A.x0 + 4, ly, A.w - 8, { s: 12, a: 'left', c: C.txt, lh: 15 }) + 8;
      const rows = NAR ? p.m.length : Math.ceil(p.m.length / 2), colW = Math.min(470, A.w * .42), lx0 = NAR ? A.x0 + 4 : A.cx - colW - 12;
      p.m.forEach((m, k) => {
        const on = k < nt, c = m[1] ? C.vacina : cor, col = Math.floor(k / rows), xx = lx0 + col * (colW + 24), yy = NAR ? ly : ly0 + (k % rows) * 28;
        tranca(xx + 10, yy, NAR ? 15 : 17, on ? c : C.dim, on);
        const hgt = wrapTx(m[0], xx + 26, yy + 1, NAR ? tw : colW - 30, { s: NAR ? 12 : 13, w: on ? 600 : 400, a: 'left', c: on ? C.txt : C.dim, lh: 15 });
        if (NAR) ly += Math.max(24, hgt + 9);
      });
      cap(nt >= p.m.length ? `Porta da via ${p.n} trancada. A vacinação aparece em todas as portas, mas cada vacina protege contra um vírus específico.` : `Via ${p.n}: cada medida de prevenção é uma tranca nessa porta.`);
    } else {
      // legenda: o que é cada tranca
      const lx = NAR ? A.x0 + 4 : A.cx - 230, s = NAR ? 15 : 17;
      tranca(lx + 10, ly0, s, '#C9D3F0', true);
      const h1 = wrapTx('cada medida de prevenção é uma tranca na porta da sua via', lx + 26, ly0 + 1, NAR ? tw : 460, { s: NAR ? 12 : 13, a: 'left', c: C.txt, lh: 15 });
      const y2 = ly0 + Math.max(28, h1 + 13);
      tranca(lx + 10, y2, s, C.vacina, true);
      wrapTx('a vacinação aparece em todas as portas, mas cada vacina protege contra um vírus específico', lx + 26, y2 + 1, NAR ? tw : 460, { s: NAR ? 12 : 13, a: 'left', c: C.txt, lh: 15 });
      cap('Para prevenir uma virose, a primeira pergunta é: como o vírus chega até a pessoa? Toque numa porta.');
    }
  }
  // "Monte o plano": uma virose e 12 medidas; escolher as três mais eficazes
  const MED = [
    { t: 'vacina' }, { t: 'máscara e ambiente ventilado', v: 'resp', pl: 1 }, { t: 'eliminar criadouros de água parada', v: 'vetor' }, { t: 'repelente e telas', v: 'vetor', pl: 1 },
    { t: 'preservativo', v: 'sangue' }, { t: 'não compartilhar seringas e objetos cortantes', v: 'sangue' }, { t: 'saneamento básico', v: 'fecal' }, { t: 'água tratada ou fervida', v: 'fecal' },
    { t: 'lavar as mãos' }, { t: 'testagem e tratamento', pl: 1 }, { t: 'antibiótico' }, { t: 'mosquiteiro só à noite', v: 'vetor' }
  ];
  // b: as três mais eficazes; ok: também valem (não contam como erro)
  const VIROSES = [
    { p: 'a hepatite A', v: 'fecal', b: [6, 7, 0], ok: [8], vac: 1 },
    { p: 'a gripe', v: 'resp', b: [0, 1, 8], vac: 1 },
    { p: 'a dengue', v: 'vetor', b: [2, 3, 0], vac: 1 },
    { p: 'a infecção pelo HIV', sv: 'o HIV', v: 'sangue', b: [4, 5, 9], vac: 0 },
    { p: 'a covid-19', v: 'resp', b: [0, 1, 8], vac: 1 },
    { p: 'a zika', sv: 'a zika', v: 'vetor', b: [2, 3, 4], vac: 0, nota: 'a zika também passa por relação sexual e, na gestação, da mãe para o bebê.' },
    { p: 'a hepatite B', v: 'sangue', b: [0, 4, 5], ok: [9], vac: 1 },
    { p: 'a poliomielite', v: 'fecal', b: [0, 6, 7], ok: [8], vac: 1 },
    { p: 'o sarampo', v: 'resp', b: [0, 1, 8], vac: 1 },
    { p: 'a infecção pelo HPV', v: 'sangue', b: [0, 4, 9], vac: 1, nota: 'o exame preventivo encontra lesões antes que virem câncer.' },
    { p: 'a febre amarela', v: 'vetor', b: [0, 3, 2], vac: 1, nota: 'no Brasil, a febre amarela é silvestre (vírus na mata, entre macacos, por <i>Haemagogus</i> e <i>Sabethes</i>); eliminar criadouros impede a volta do ciclo urbano pelo <i>Aedes</i>.' },
    { p: 'a hepatite C', sv: 'a hepatite C', v: 'sangue', b: [5, 9, 4], vac: 0, nota: 'a hepatite C tem cura com antivirais.' },
    { p: 'a infecção por rotavírus', v: 'fecal', b: [0, 7, 8], ok: [6], vac: 1 }
  ];
  const up = s => s.charAt(0).toUpperCase() + s.slice(1);
  const inutil = (V, m) => m === 10 || (m === 0 && !V.vac) || (m === 8 && (V.v === 'sangue' || V.v === 'vetor')) || (!!MED[m].v && MED[m].v !== V.v);
  const boa = (V, m) => V.b.includes(m) || (V.ok || []).includes(m);
  function explica(m, V) {
    const M = MED[m];
    if (m === 10) return 'Antibiótico não age em vírus.';
    if (m === 11) return V.v !== 'vetor' ? `Mosquiteiro não ajuda: a via ${VN[V.v]} não tem mosquito.` : V.p === 'a febre amarela' ? 'Mosquiteiro só à noite protege pouco: os mosquitos que transmitem a febre amarela na mata (<i>Haemagogus</i> e <i>Sabethes</i>) picam de dia.' : 'Mosquiteiro só à noite protege pouco: o <i>Aedes</i> pica de dia.';
    if (m === 0 && !V.vac) return `Não existe vacina contra ${V.sv}.`;
    if (m === 8 && (V.v === 'sangue' || V.v === 'vetor')) return `Lavar as mãos não impede a via ${VN[V.v]}.`;
    if (M.v && M.v !== V.v) return `${up(M.t)} não ${M.pl ? 'ajudam' : 'ajuda'} aqui: a via é ${VN[V.v]}.`;
    return `${up(M.t)} ${M.pl ? 'ajudam' : 'ajuda'}, mas há medidas mais eficazes para essa via.`;
  }
  // a primeira é a hepatite A (exemplo do roteiro); depois, sorteio sem repetir a anterior
  function novaVirose(S) {
    const N = VIROSES.length, a = S.pl ? S.pl.vi : -1;
    S.pl = { vi: a < 0 ? 0 : (a + 1 + Math.floor(Math.random() * (N - 1))) % N, sel: [], fim: false, pts: 0 };
  }
  function drawPlano(t, S, A) {
    if (!S.pl) novaVirose(S);
    const P = S.pl, V = VIROSES[P.vi];
    const hy = A.y0 + (NAR ? 10 : 14);
    title(`Como prevenir ${V.p}?`, A.cx, hy, A.w - 8, { s: NAR ? 15 : 18 });
    let gy = hy + (NAR ? 20 : 26);
    if (P.fim) { tok(A.cx, gy + 2, `via ${VN[V.v]}`, VIA[V.v].c, { s: 12 }); gy += 18; }
    else gy += wrapTx('Pense primeiro: como esse vírus chega até a pessoa? Escolha as 3 medidas mais eficazes.', A.cx, gy, A.w - 8, { s: 12, c: C.dim, lh: 15 }) - 4;
    const cols = NAR ? 2 : 4, g = NAR ? 8 : 12, y0 = gy + (NAR ? 8 : 12), cw = (A.w - (cols - 1) * g) / cols, rows = Math.ceil(MED.length / cols);
    const ch = Math.min(NAR ? 52 : 64, (A.y1 - y0 - 96 - (rows - 1) * g) / rows);
    MED.forEach((m, i) => {
      const x = A.x0 + (i % cols) * (cw + g), y = y0 + Math.floor(i / cols) * (ch + g), es = P.sel.includes(i), best = V.b.includes(i), vale = boa(V, i);
      let bc = es ? C.amber : 'rgba(157,169,196,.5)', lw = es ? 2.5 : 1.3, dash = null, f = 'rgba(19,26,43,.94)', nota = '';
      if (P.fim) {
        if (es && vale) { bc = C.ok; f = rgba(C.ok, .12); nota = best ? 'certa' : 'também vale'; }
        else if (es) { bc = C.erro; f = rgba(C.erro, .12); nota = inutil(V, i) ? 'não serve aqui' : 'não é a melhor'; }
        else if (best) { bc = C.ok; dash = [6, 4]; lw = 1.8; nota = P.pts < 3 ? 'faltou' : 'outra boa opção'; }
        else bc = 'rgba(157,169,196,.3)';
      }
      if (dash) X.setLineDash(dash); rr(x, y, cw, ch, 8, f, bc, lw); X.setLineDash([]);
      hitR(x, y, cw, ch, 'm' + i);
      const fs = NAR ? 12 : 13, lh = fs + 3, th = wrapTx(m.t, 0, 0, cw - 16, { s: fs, w: 600, lh, dry: true });
      wrapTx(m.t, x + cw / 2, y + ch / 2 - th / 2 + lh / 2 - (nota ? 6 : 0), cw - 16, { s: fs, w: 600, lh, c: P.fim && !es && !best ? C.dim : C.txt });
      if (nota) tx(nota, x + cw / 2, y + ch - 8, { s: 12, w: 600, c: es && !vale ? C.erro : C.ok, bg: false });
    });
    const ey = y0 + rows * (ch + g) + (NAR ? 8 : 12);
    if (P.fim) {
      const L = V.b.map(m => MED[m].t);
      let s = `<b>${P.pts} de 3.</b> As mais eficazes contra ${V.p}: ${L[0]}; ${L[1]}; ${L[2]}.`;
      for (const m of P.sel) if (!boa(V, m)) s += ' ' + explica(m, V);
      if (V.nota) s += ' Atenção: ' + V.nota;
      wrapTx(s, A.cx, ey + 6, Math.min(A.w - 8, 760), { s: NAR ? 12 : 13, c: C.txt, lh: NAR ? 16 : 18 });
      cap(P.pts === 3 ? 'Muito bem: 3 de 3. Toque em "Outra virose" para treinar mais.' : 'Leia a correção e toque em "Outra virose" para treinar mais.');
    } else {
      // pista: as quatro vias (sem dizer qual é a certa)
      tx('As quatro vias:', A.cx, ey + 6, { s: 12, c: C.dim, bg: false });
      const vs = ['resp', 'vetor', 'sangue', 'fecal'], ws = vs.map(k => mtw(VN[k], 12, 700) + 12), gp = 10;
      const fila = (ks, yy) => { let xx = A.cx - (ks.reduce((a, k) => a + ws[k], 0) + gp * (ks.length - 1)) / 2; ks.forEach(k => { tok(xx + ws[k] / 2, yy, VN[vs[k]], VIA[vs[k]].c, { s: 12 }); xx += ws[k] + gp; }); };
      if (NAR) { fila([0, 1], ey + 30); fila([2, 3], ey + 56); } else fila([0, 1, 2, 3], ey + 32);
      cap(`Escolha as 3 medidas mais eficazes (${P.sel.length} de 3).`);
    }
  }

  def('prevencao', 'transmissao', {
    t: 'Cada via, sua prevenção', s: 'ar, mosquito, sangue e sexo, água e alimento', c: PRE,
    loc: 'Vias de transmissão', locNota: 'Desenho esquemático',
    alt: 'quatro portas coloridas, uma por via de transmissão (respiratória, vetorial, sangue e sexual, fecal-oral): ao tocar numa porta, os vírus daquela via entram e cada medida de prevenção aparece como uma tranca que fecha a porta; a vacinação aparece em todas as portas, mas cada vacina protege contra um vírus específico; há também um jogo para escolher as três medidas mais eficazes contra uma virose sorteada',
    still: 0, ctl: false,
    extra: [
      modo('portas', 'As portas'), modo('plano', 'Monte o plano'),
      { t: 'Outra virose', on: S => { S.modo = 'plano'; novaVirose(S); }, pressed: () => false }
    ],
    init(S) { S.modo = 'portas'; S.sel = null; S.tr = [0, 0, 0, 0]; S.pl = null; },
    d: `<p>Para prevenir uma virose, a primeira pergunta é: <b>como o vírus chega até a pessoa?</b> Cada <b>via de transmissão</b> pede medidas diferentes, e a vacina, quando existe, entra em todas.</p>
<p><b>1. Respiratória</b> (gripe, covid-19, sarampo, catapora, caxumba, rubéola): vacinação, <b>ambientes ventilados</b>, máscara quando indicada, cobrir a boca e o nariz ao tossir e espirrar com o braço, lavar as mãos e ficar em casa quando doente.</p>
<p><b>2. Vetorial</b> (dengue, zika, chikungunya, febre amarela): <b>eliminar criadouros de água parada</b>, telas, repelente, roupas que cobrem o corpo, vacina (febre amarela e dengue); métodos novos como os mosquitos com <i>Wolbachia</i>.</p>
<p><b>3. Sangue e sexual</b> (HIV, hepatites B e C, HPV, herpes genital): <b>preservativo</b>, não compartilhar seringas, agulhas e objetos cortantes, material esterilizado ou descartável em hospitais, estúdios de tatuagem e manicures, <b>testagem</b> do sangue doado, testagem e tratamento, PrEP e PEP para o HIV, vacina (hepatite B e HPV), pré-natal para evitar a transmissão da mãe para o bebê.</p>
<p><b>4. Fecal-oral</b> (hepatite A, poliomielite, rotavírus, norovírus): <b>saneamento básico</b>, <b>água tratada</b> ou fervida, lavar as mãos depois de usar o banheiro e antes de comer, lavar bem os alimentos crus, vacina (hepatite A, poliomielite, rotavírus).</p>
<p><b>5. Mordida de animal</b> (raiva): vacinar cães e gatos, não mexer em morcegos, e, depois de uma mordida, lavar o ferimento com água e sabão e procurar atendimento para vacina e, se indicado, soro.</p>
<p>Algumas medidas valem para quase tudo: <b>vacinação em dia</b>, <b>água limpa e esgoto tratado</b> e <b>informação</b>. Muitas viroses são também problemas <b>sociais</b>: a dengue cresce onde falta coleta de lixo e água encanada regular (o que obriga a guardar água em recipientes), e a hepatite A, onde falta esgoto. Por isso a prevenção depende tanto da atitude de cada um quanto de <b>políticas públicas</b>.</p>
<p><b>Quadro-resumo do módulo</b> (vacina no SUS: idades e doses no calendário vigente):</p>
<div class="tab"><table><thead><tr><th>Virose</th><th>DNA ou RNA</th><th>Via</th><th>Vacina no SUS</th><th>Tela</th></tr></thead><tbody>
<tr><td>gripe</td><td>RNA</td><td>respiratória</td><td>sim</td><td><a href="#doencas/respiratorias">D3</a></td></tr>
<tr><td>covid-19</td><td>RNA</td><td>respiratória</td><td>sim</td><td><a href="#doencas/respiratorias">D3</a></td></tr>
<tr><td>sarampo</td><td>RNA</td><td>respiratória</td><td>sim</td><td><a href="#doencas/respiratorias">D3</a></td></tr>
<tr><td>catapora</td><td>DNA</td><td>respiratória</td><td>sim</td><td><a href="#replicacao/animal">R1</a></td></tr>
<tr><td>dengue</td><td>RNA</td><td>vetorial</td><td>sim, para grupos definidos</td><td><a href="#doencas/arboviroses">D1</a></td></tr>
<tr><td>zika</td><td>RNA</td><td>vetorial; também sexual e da mãe para o feto</td><td>não</td><td><a href="#doencas/arboviroses">D1</a></td></tr>
<tr><td>chikungunya</td><td>RNA</td><td>vetorial</td><td>não (fora do calendário)</td><td><a href="#doencas/arboviroses">D1</a></td></tr>
<tr><td>febre amarela</td><td>RNA</td><td>vetorial</td><td>sim</td><td><a href="#doencas/arboviroses">D1</a></td></tr>
<tr><td>HIV e aids</td><td>RNA (retrovírus)</td><td>sangue, sexual e da mãe para o filho</td><td>não (há tratamento, PrEP e PEP)</td><td><a href="#doencas/hiv">D2</a></td></tr>
<tr><td>hepatite A</td><td>RNA</td><td>fecal-oral</td><td>sim</td><td><a href="#doencas/hepatites-hpv">D4</a></td></tr>
<tr><td>hepatite B</td><td>DNA</td><td>sangue, sexual e da mãe para o filho</td><td>sim</td><td><a href="#doencas/hepatites-hpv">D4</a></td></tr>
<tr><td>hepatite C</td><td>RNA</td><td>sangue</td><td>não (tem cura)</td><td><a href="#doencas/hepatites-hpv">D4</a></td></tr>
<tr><td>HPV</td><td>DNA</td><td>sexual (pele e mucosa)</td><td>sim</td><td><a href="#doencas/hepatites-hpv">D4</a></td></tr>
<tr><td>herpes simples</td><td>DNA</td><td>contato com as lesões; sexual (genital)</td><td>não</td><td><a href="#replicacao/animal">R1</a></td></tr>
<tr><td>poliomielite</td><td>RNA</td><td>fecal-oral</td><td>sim</td><td><a href="#prevencao/vacinas">P1</a></td></tr>
<tr><td>rotavírus</td><td>RNA</td><td>fecal-oral</td><td>sim</td><td><a href="#prevencao/transmissao">P2</a></td></tr>
<tr><td>raiva</td><td>RNA</td><td>mordida de animal</td><td>sim (e soro, se indicado)</td><td><a href="#prevencao/vacinas">P1</a></td></tr>
</tbody></table></div>
<p>Toque numa porta para ver as trancas de cada via. Em "Monte o plano", escolha as três medidas mais eficazes contra a virose sorteada.</p>`,
    enem: 'O ENEM gosta de questões que dão uma doença e pedem a <b>medida de prevenção mais adequada</b>: o segredo é identificar primeiro a <b>via de transmissão</b>. Mosquito: <b>criadouros</b>. Ar: <b>vacina e ventilação</b>. Sangue e sexo: <b>preservativo e seringas</b>. Água e alimento: <b>saneamento</b>. Pegadinhas: usar antibiótico "para prevenir" virose; achar que mosquiteiro protege contra o <i>Aedes</i> (ele pica <b>de dia</b>; a tela e o repelente ajudam mais que o mosquiteiro só à noite); ou propor saneamento contra uma doença transmitida pelo ar.',
    links: [LK.calendario, ['Vacina, soro e antivirais', '#prevencao/vacinas'], ['Dengue, zika, chikungunya e febre amarela', '#doencas/arboviroses']],
    tap(x, y, S) {
      if (!toque(S)) return; const h = hitAt(x, y); if (typeof h !== 'string') return;
      if (S.modo === 'portas' && h[0] === 'p') { const i = +h.slice(1); S.sel = S.sel === i ? null : i; return; }
      if (S.modo === 'plano' && h[0] === 'm') {
        const P = S.pl, m = +h.slice(1); if (!P || P.fim) return;
        P.sel = P.sel.includes(m) ? P.sel.filter(q => q !== m) : P.sel.concat([m]);
        if (P.sel.length === 3) { const V = VIROSES[P.vi]; P.pts = Math.min(3, P.sel.filter(q => boa(V, q)).length); P.fim = true; }
      }
    },
    draw(t, S) { const A = area(); if (S.modo === 'plano') drawPlano(t, S, A); else drawPortas(t, S, A); }
  });
}
