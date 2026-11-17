/* LAB Vírus: "Dengue, zika, chikungunya e febre amarela" com figuras de IA realistas e duas viagens por cima (Martin).
   Viagem do vírus (vista A, o Aedes aegypti): pessoa doente com vírus no sangue, a fêmea pica, o vírus se multiplica no
   intestino e chega às glândulas salivares, e ela pica outra pessoa. Ciclo do Aedes (vista C, nova: pratinho de vaso em
   corte com ovos na parede, larvas presas pelo sifão, pupas e o adulto saindo da pupa): ovo, larva, pupa e adulto, em
   cerca de 7 a 10 dias; depois a fêmea procura os criadouros (vista B). As duas terminam na prevenção.
   Medidor: dias (com o vírus no mosquito, ou desde que a água cobriu os ovos). Tocar num ponto leva a viagem até a etapa.
   O quintal, a mata e as fichas antigas ficam atrás de "Ver esquema" (LAB_FIGALT, figura-alterna.js). O bloco antigo
   desta rota saiu de cenas-figura.js. Com prefers-reduced-motion nada anda sozinho: etapas por botão.
   Carregar depois de cenas-figura.js e antes de LAB_VIRUS_iniciar(). Texto na tela: sem "!", sem setas ou pontos como separador. */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const K = 'doencas/arboviroses', c3 = SC[K]; if (!c3) return;
  const RED = LAB_FIGALT.RED, PI = Math.PI, TAU = PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k, fr = v => v - Math.floor(v);
  const sst = (a, b, x) => { const u = cl((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const eIO = u => { u = cl(u, 0, 1); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
  const FT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

  // ---------- curva suave (Catmull-Rom) por pontos em % da figura ----------
  function trilha(P, ar) {
    const N = 12, AM = [], LC = [0];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      for (let j = 0; j < N; j++) { const t = j / N, t2 = t * t, t3 = t2 * t; AM.push([0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3))); }
    }
    AM.push(P[P.length - 1].slice());
    for (let i = 1; i < AM.length; i++) LC.push(LC[i - 1] + Math.hypot((AM[i][0] - AM[i - 1][0]) * ar[0], (AM[i][1] - AM[i - 1][1]) * ar[1]));
    const LT = LC[LC.length - 1] || 1, LF = LC.map(v => v / LT);
    return {
      AM, LF, ar,
      at(f) { f = cl(f, 0, 1); let i = 1; while (i < LF.length - 1 && LF[i] < f) i++; const u = (f - LF[i - 1]) / ((LF[i] - LF[i - 1]) || 1), a = AM[i - 1], b = AM[i]; return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), Math.atan2((b[1] - a[1]) * ar[1], (b[0] - a[0]) * ar[0])]; }
    };
  }
  // traço do caminho já feito: tracejado fino (rastro) ou cheio e brilhante (tubo, haste, filamento)
  function traco(R, X, tr, f0, f1, cor, o) {
    o = o || {}; if (f1 <= f0) return;
    X.save(); X.lineCap = 'round'; X.lineJoin = 'round';
    if (o.cheio) { X.strokeStyle = rgba(cor, o.a == null ? .9 : o.a); X.lineWidth = o.lw || 3; if (o.glow) { X.shadowColor = rgba(cor, .8); X.shadowBlur = o.glow; } }
    else { X.setLineDash([2, 5]); X.strokeStyle = rgba(cor, .65); X.lineWidth = 1.6; }
    X.beginPath(); let st = false;
    const a = tr.at(f0), p0 = R.pt(a[0], a[1]); X.moveTo(p0[0], p0[1]); st = true;
    for (let i = 0; i < tr.AM.length; i++) { if (tr.LF[i] <= f0) continue; if (tr.LF[i] > f1) break; const s = R.pt(tr.AM[i][0], tr.AM[i][1]); X.lineTo(s[0], s[1]); }
    const b = tr.at(f1), q = R.pt(b[0], b[1]); if (st) { X.lineTo(q[0], q[1]); X.stroke(); } X.restore();
  }

  // ---------- desenhos básicos ----------
  function dot(X, x, y, r, c, a) { X.globalAlpha = cl(a == null ? 1 : a, 0, 1); X.beginPath(); X.arc(x, y, Math.max(.2, r), 0, TAU); X.fillStyle = c; X.fill(); X.globalAlpha = 1; }
  function brilho(X, x, y, r, cor, a) { if (a <= 0 || r <= 0) return; const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(cor, cl(a, 0, 1))); g.addColorStop(1, rgba(cor, 0)); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); }
  function anel(X, x, y, r, cor, a, lw) { if (a <= 0) return; X.save(); X.globalAlpha = cl(a, 0, 1); X.strokeStyle = cor; X.lineWidth = lw || 2; X.beginPath(); X.arc(x, y, Math.max(.5, r), 0, TAU); X.stroke(); X.restore(); }
  function pulso(X, x, y, r, cor, T, per) { if (RED) { anel(X, x, y, r * 1.3, cor, .7, 2); return; } const k = fr(T / (per || 1.6)); anel(X, x, y, r * (.6 + k * 1.4), cor, .85 * (1 - k), 2); }
  function com(X, x, y, ang, a, fn) { X.save(); X.globalAlpha = cl(a == null ? 1 : a, 0, 1); X.translate(x, y); X.rotate(ang || 0); fn(); X.restore(); }
  const borda = 'rgba(20,16,8,.75)';
  // bordas esfumadas em retângulo, na cor do palco
  function esfuma(R, X, k) {
    const f = Math.min(R.w, R.h) * (k || .06), C = 'rgba(13,19,34,', x0 = R.x, y0 = R.y, x1 = R.x + R.w, y1 = R.y + R.h;
    [[x0, 0, x0 + f, 0, x0, y0, f, R.h], [x1, 0, x1 - f, 0, x1 - f, y0, f, R.h], [0, y0, 0, y0 + f, x0, y0, R.w, f], [0, y1, 0, y1 - f, x0, y1 - f, R.w, f]].forEach(q => {
      const g = X.createLinearGradient(q[0], q[1], q[2], q[3]); g.addColorStop(0, C + '1)'); g.addColorStop(1, C + '0)'); X.fillStyle = g; X.fillRect(q[4], q[5], q[6], q[7]);
    });
  }
  function txt(X, s, x, y, o = {}) { X.font = `${o.w || 600} ${o.s || 13}px ${FT}`; X.fillStyle = o.c || TXT; X.textAlign = o.a || 'left'; X.textBaseline = 'middle'; X.fillText(s, x, y); }
  function quebra(X, s, w, o) { X.font = `${o.w || 500} ${o.s || 13}px ${FT}`; const L = []; let l = ''; s.split(' ').forEach(p => { const n = l ? l + ' ' + p : p; if (X.measureText(n).width > w && l) { L.push(l); l = p; } else l = n; }); if (l) L.push(l); return L; }
  function bloco(X, s, x, y, w, o, seco) { const L = quebra(X, s, w, o), lh = o.lh || 18; if (!seco) L.forEach((l, i) => txt(X, l, x, y + i * lh, o)); return L.length * lh; }

  const TXT = '#E8EDF7', DIM = '#9DA9C4', OK = '#7FD3A0';
  const VIR = '#F28B8B', SAN = '#C7353B', NOVO = '#FFD43B', AGUA = '#8FD8FF', OVO = '#B9C3D9', LARV = '#E9D9A6', PUPA = '#D9A85B', ADU = '#CFE0FF';

  // ---------- desenhos do vírus e do mosquito ----------
  // partícula de vírus: esfera com espículas (dengue, zika e chikungunya são vírus de RNA com envelope)
  function virus(X, x, y, r, cor, a, rot) {
    com(X, x, y, rot || 0, a, () => {
      X.strokeStyle = cor; X.lineWidth = Math.max(1, r * .28); X.lineCap = 'round';
      for (let i = 0; i < 8; i++) { const t = i / 8 * TAU; X.beginPath(); X.moveTo(Math.cos(t) * r, Math.sin(t) * r); X.lineTo(Math.cos(t) * r * 1.45, Math.sin(t) * r * 1.45); X.stroke(); }
      X.beginPath(); X.arc(0, 0, r, 0, TAU); X.fillStyle = cor; X.fill(); X.strokeStyle = 'rgba(40,10,10,.7)'; X.lineWidth = 1; X.stroke();
      X.beginPath(); X.arc(0, 0, r * .45, 0, TAU); X.fillStyle = 'rgba(255,230,230,.85)'; X.fill();
    });
  }
  // fêmea de Aedes em voo, bem pequena (a frente aponta para ang)
  function mosquito(X, x, y, ang, L, T) {
    com(X, x, y, ang, 1, () => {
      const bat = RED ? .5 : Math.sin(T * 50) * .5 + .5;
      X.fillStyle = 'rgba(220,235,255,.45)'; [-1, 1].forEach(sg => { X.beginPath(); X.ellipse(-L * .05, sg * L * (.18 + .1 * bat), L * .32, L * .1, sg * (.35 + .3 * bat), 0, TAU); X.fill(); });
      X.strokeStyle = '#1A1A22'; X.lineCap = 'round'; X.lineWidth = Math.max(2, L * .14); X.beginPath(); X.moveTo(-L * .45, 0); X.lineTo(L * .1, 0); X.stroke();
      X.strokeStyle = '#F2F4FA'; X.lineWidth = Math.max(1, L * .05); [-.35, -.2].forEach(k => { X.beginPath(); X.moveTo(L * k, -L * .06); X.lineTo(L * k, L * .06); X.stroke(); });
      X.fillStyle = '#1A1A22'; X.beginPath(); X.arc(L * .18, 0, L * .1, 0, TAU); X.fill();
      X.strokeStyle = '#2A2A33'; X.lineWidth = Math.max(.8, L * .04); X.beginPath(); X.moveTo(L * .26, 0); X.lineTo(L * .55, L * .05); X.stroke();
      X.lineWidth = Math.max(.7, L * .03); for (let i = 0; i < 3; i++) [-1, 1].forEach(sg => { X.beginPath(); X.moveTo(-L * .05 + i * L * .08, 0); X.lineTo(-L * .2 + i * L * .12, sg * L * .42); X.stroke(); });
    });
  }
  function etiqueta(X, x, y, s0, cor, lado, a) {
    if (a <= 0) return; X.save(); X.globalAlpha = cl(a, 0, 1); X.font = `600 12px ${FT}`; X.textBaseline = 'middle';
    const w = X.measureText(s0).width + 18, x0 = lado === 'r' ? x - w : x;
    X.fillStyle = 'rgba(11,15,28,.86)'; X.beginPath(); X.roundRect(x0, y - 11, w, 22, 11); X.fill(); X.strokeStyle = rgba(cor, .9); X.lineWidth = 1.2; X.stroke();
    X.fillStyle = TXT; X.fillText(s0, x0 + 9, y + .5); X.restore();
  }

  // ---------- caminhos (conferidos sobre as figuras) ----------
  const ARA = [.88, .657], ARB = [.88, .657], ARC = [.88, .491];
  const CAM = {
    sobe: trilha([[18.5, 64], [21.5, 60.5], [25, 57], [28.5, 53.5], [31.5, 50.5], [34, 48], [38.5, 45.5], [44, 44.5], [50, 45], [56, 46.5], [61, 47.5], [64, 48]], ARA),
    gland: trilha([[64, 48], [60, 45], [54, 42], [48.5, 40.5], [44.5, 41]], ARA),
    desce: trilha([[44.5, 41], [40, 43.5], [36, 46], [34, 48], [31.5, 50.5], [28.5, 53.5], [25, 57], [21.5, 60.5], [18.5, 64], [16.5, 67]], ARA),
    ciclo: trilha([[28, 28], [30.5, 36], [32.5, 44], [34.5, 52], [36, 62], [37, 72], [39.5, 66], [41.5, 58], [42.5, 53], [48, 50], [56, 47.5], [61.5, 44], [64.5, 39.5]], ARC),
    voo: trilha([[50, 22], [40, 40], [30, 55], [22, 64], [32, 66], [45, 71], [52.5, 73], [62, 62], [70, 50], [78, 43]], ARB)
  };
  const FASES = [0, .26, .44, .58, 1];   // trechos do ciclo: ovo, larva, pupa, adulto
  const PONTA = [18.5, 64], TRIPA = [64, 48], GLAN = [44.5, 41];
  const SIFOES = [[33, 47.3], [52.6, 47.3], [90.6, 48]], PUPAS = [[42.5, 53], [79, 52.5]], OVOS = [28, 27.5], ADUL = [64.5, 39.5], EXU = [61, 47.5];
  const CRIA = [[22, 66], [52.5, 73], [80, 43]];

  // ---------- as duas viagens ----------
  const DZ = [
    { id: 'vir', nome: 'Viagem do vírus', curto: 'Viagem do vírus', rotA: 'Onde está o vírus', rotB: 'O que acontece',
      tit: 'Dias com o vírus no mosquito', seg: [[0, 10, VIR, 'o vírus se multiplica'], [10, 12, NOVO, 'transmite']],
      nota: 'Dengue, zika e chikungunya são arboviroses: vírus de RNA levados pela fêmea do Aedes aegypti. A febre amarela urbana também.',
      prev: ['Acabar com a água parada: tampar caixas-d’água, virar garrafas, pôr areia nos pratinhos de vaso', 'Repelente, telas e roupas compridas, sobretudo de dia', 'Vacina: contra a febre amarela e, para grupos definidos, contra a dengue', 'Procurar o posto de saúde na febre e não tomar AAS na suspeita de dengue'],
      ET: [
        { id: 'doe', nome: 'Pessoa doente', v: 'a', dur: 5, dia: [0, 0], onde: 'No sangue da pessoa doente', obj: 'Viremia: o vírus circula no sangue', cor: VIR,
          cap: 'Nos primeiros dias da doença, o vírus circula no <b>sangue</b> da pessoa doente. É nessa fase que o mosquito pode se infectar.' },
        { id: 'pic', nome: 'Mosquito pica', v: 'a', dur: 6, dia: [0, 0], onde: 'Subindo pela probóscide', obj: 'A fêmea suga o sangue com vírus', cor: VIR,
          cap: 'A <b>fêmea</b> do <i>Aedes aegypti</i> pica a pessoa doente e suga o sangue, que ela usa para amadurecer os ovos. Junto vem o <b>vírus</b>.' },
        { id: 'mul', nome: 'Multiplicação', v: 'a', dur: 9, dia: [0, 10], onde: 'Intestino e glândulas salivares', obj: 'O vírus se multiplica nas células do mosquito', cor: VIR,
          cap: 'O vírus se <b>multiplica</b> no intestino do mosquito e se espalha até as <b>glândulas salivares</b>. Isso leva cerca de 8 a 12 dias.' },
        { id: 'out', nome: 'Pica outra pessoa', v: 'a', dur: 6, dia: [10, 11], onde: 'Na saliva, para outra pessoa', obj: 'Cada picada passa o vírus adiante', cor: NOVO,
          cap: 'Agora, a cada picada, o mosquito injeta <b>saliva com vírus</b> em <b>outra pessoa</b>. Ele continua transmitindo pelo resto da vida.' },
        { id: 'prev', nome: 'Como prevenir', v: 'b', dur: 8, dia: null,
          cap: 'Prevenção: <b>acabar com a água parada</b>, usar repelente e telas e tomar as <b>vacinas</b> disponíveis. Não há antibiótico para vírus.' }
      ] },
    { id: 'aed', nome: 'Ciclo do Aedes', curto: 'Ciclo do Aedes', rotA: 'Fase do mosquito', rotB: 'Onde fica',
      tit: 'Dias desde que a água cobriu os ovos', seg: [[0, 1, OVO, 'ovo'], [1, 6, LARV, 'larva'], [6, 8, PUPA, 'pupa'], [8, 12, ADU, 'adulto']],
      nota: 'Do ovo ao adulto, o Aedes leva cerca de 7 a 10 dias. Os ovos aguentam meses secos e eclodem quando a água volta.',
      prev: ['Escovar a parede de pratinhos e vasilhas: os ovos ficam grudados nela', 'Pôr areia nos pratinhos de vaso e guardar pneus cobertos', 'Tampar caixas-d’água e tonéis', 'Olhar o quintal uma vez por semana: o ciclo leva cerca de 7 a 10 dias'],
      ET: [
        { id: 'ovo', nome: 'Ovo', v: 'c', dur: 6, dia: [0, 1], onde: 'Ovo', obj: 'Na parede, logo acima da água', cor: OVO,
          cap: 'A fêmea põe os <b>ovos</b> na parede do recipiente, logo acima da água. Eles aguentam meses secos e eclodem quando a chuva sobe o nível da água.' },
        { id: 'lar', nome: 'Larva', v: 'c', dur: 7, dia: [1, 6], onde: 'Larva', obj: 'Na água, presa à superfície', cor: LARV,
          cap: 'A <b>larva</b> vive na água e come restos orgânicos. Ela fica pendurada na superfície pelo <b>sifão</b>, o tubo por onde respira o ar.' },
        { id: 'pup', nome: 'Pupa', v: 'c', dur: 6, dia: [6, 8], onde: 'Pupa', obj: 'Na água, em forma de vírgula', cor: PUPA,
          cap: 'A larva vira <b>pupa</b>, em forma de vírgula. A pupa não come e, em cerca de 2 dias, forma o mosquito adulto dentro dela.' },
        { id: 'adu', nome: 'Adulto', v: 'c', dur: 6, dia: [8, 9.5], onde: 'Adulto', obj: 'Sai da pupa na superfície', cor: ADU,
          cap: 'O <b>adulto</b> sai da pupa na superfície da água. Do ovo ao adulto foram cerca de <b>7 a 10 dias</b>.' },
        { id: 'cri', nome: 'Criadouros', v: 'b', dur: 7, dia: [9.5, 9.5], onde: 'Fêmea adulta', obj: 'Água parada e limpa: pneu, pratinho, tonel', cor: NOVO,
          cap: 'A fêmea procura <b>água parada e limpa</b> para pôr os ovos: pneus, pratinhos de vaso, tonéis e caixas-d’água sem tampa.' },
        { id: 'prev', nome: 'Como prevenir', v: 'b', dur: 8, dia: null,
          cap: 'Sem água parada, o mosquito não tem onde pôr ovos. <b>Eliminar os criadouros</b> toda semana é o combate mais eficiente.' }
      ] }
  ];

  // ---------- pontos da figura (função em nível ENEM); tocar leva a viagem até a etapa ----------
  const HS = [
    { id: 'lira', c: '#FFD43B', t: 'Desenho em forma de lira', d: 'Faixas brancas no dorso do tórax identificam o Aedes aegypti.', em: { a: [51, 40] }, z: 2.8 },
    { id: 'pat', c: '#CFE0FF', t: 'Patas listradas', d: 'Anéis brancos nas patas dão ao mosquito o aspecto de listrado. Ele costuma picar de dia, principalmente de manhã e no fim da tarde.', em: { a: [53, 70] }, z: 2.6 },
    { id: 'prob', c: '#F28B8B', t: 'Fêmea que pica', d: 'Só a fêmea suga sangue, que ela precisa para amadurecer os ovos. Ao picar, transmite o vírus.', em: { a: [25, 57] }, z: 2.8 },
    { id: 'asa', c: '#8FD8FF', t: 'Asas', d: 'O Aedes voa pouco, em geral algumas centenas de metros. Por isso o foco costuma estar perto de onde a pessoa mora.', em: { a: [70, 35] }, z: 2.6 },
    { id: 'tri', c: VIR, t: 'Intestino do mosquito', d: 'Dentro do abdome. O vírus que veio no sangue infecta as células do intestino e se multiplica ali primeiro.', em: { a: [66, 49] }, z: 2.6 },
    { id: 'gla', c: NOVO, t: 'Glândulas salivares', d: 'Ficam no tórax. Quando o vírus chega a elas, a saliva passa a levar o vírus a cada picada.', em: { a: [44.5, 41] }, z: 2.8 },
    { id: 'pneu', c: '#FFA94D', t: 'Pneu com água', d: 'A água da chuva fica parada dentro do pneu. Os ovos ficam na parede e eclodem quando a água sobe.', em: { b: [17, 76] }, z: 2.6 },
    { id: 'vaso', c: '#A9C54A', t: 'Prato de vaso', d: 'Basta um pouco de água no pratinho. Encher de areia ou virar o recipiente evita o criadouro.', em: { b: [48, 64] }, z: 2.8 },
    { id: 'cx', c: '#8FD8FF', t: 'Tonel aberto', d: 'Tonel ou caixa sem tampa acumula larvas. Mantê-los vedados e eliminar a água parada interrompe o ciclo do mosquito.', em: { b: [76, 48] }, z: 2.4 },
    { id: 'ovos', c: OVO, t: 'Ovos na parede', d: 'Pretos e alongados, grudados logo acima da água. Resistem secos por meses; por isso é preciso escovar a parede, não só jogar a água fora.', em: { c: [28, 27.5] }, z: 3 },
    { id: 'sif', c: AGUA, t: 'Sifão respiratório', d: 'A larva respira o ar pela ponta do sifão, encostada na superfície. Uma camada de óleo ou areia no pratinho impede isso.', em: { c: [52.6, 47.3] }, z: 3.2 },
    { id: 'larv', c: LARV, t: 'Larva', d: 'Vive cerca de 5 dias na água, comendo restos orgânicos. Passa por quatro estágios larvais antes de virar pupa.', em: { c: [56, 64] }, z: 2.8 },
    { id: 'pupa', c: PUPA, t: 'Pupa', d: 'Em forma de vírgula. Não come e respira por dois tubinhos no alto. Dura cerca de 2 dias.', em: { c: [79, 52.5] }, z: 3 },
    { id: 'adul', c: ADU, t: 'Adulto saindo da pupa', d: 'O mosquito sai da casca da pupa e fica na superfície até as asas secarem. Logo depois já pode voar e acasalar.', em: { c: [68, 36] }, z: 3 }
  ];
  const VAI = { prob: [0, 1], lira: [0, 0], pat: [0, 0], asa: [0, 3], tri: [0, 2], gla: [0, 2], pneu: [1, 4], vaso: [1, 4], cx: [1, 4], ovos: [1, 0], sif: [1, 1], larv: [1, 1], pupa: [1, 2], adul: [1, 3] };

  // ---------- estado da viagem (em S.vg) ----------
  const novo = () => ({ d: 0, e: 0, u: RED ? 1 : 0, hold: 0, pausa: false, ini: true, dia: 0 });
  let FIG = null, Sx = null, ultAb = null, Rfig = null, vivo = 0, NAV = null, sincK = '', navK = '';
  const etapa = v => DZ[v.d].ET[v.e];
  const diaAlvo = v => { const et = etapa(v); return et.dia ? lerp(et.dia[0], et.dia[1], RED ? 1 : sst(0, .9, v.u)) : v.dia; };
  function irPara(S, d, e, troca) {
    const v = S.vg, n = DZ[d].ET.length; v.d = d; v.e = (e + n) % n; v.u = RED ? 1 : 0; v.hold = 0;
    const et = etapa(v);   // o medidor de dias só volta quando a viagem volta ou troca
    if (et.dia && (d !== v.dd || v.dia > et.dia[1] + .01 || v.dia < et.dia[0] - 3)) v.dia = et.dia[0];
    v.dd = d; if (RED) v.dia = diaAlvo(v);
    if (troca && FIG && FIG.vistaAtual !== etapa(v).v) FIG.mostrar(etapa(v).v);
    sinc(S);
  }
  function avancar(S, dt) {
    const v = S.vg, et = etapa(v), n = DZ[v.d].ET.length;
    if (RED || v.pausa || !dt) return;
    const k = dt * (S.v || 1);
    if (v.u < 1) { v.u = Math.min(1, v.u + k / et.dur); return; }
    v.hold += k;
    if (v.e < n - 1) { if (v.hold > 1.4) irPara(S, v.d, v.e + 1, true); }
    else if (v.hold > 4) irPara(S, v.d, 0, true);
  }

  // ---------- botões: seletor da viagem e etapas (HTML sobre o palco) ----------
  const ICO = { ant: '<path d="M14.5 6 8.5 12l6 6"/>', prox: '<path d="m9.5 6 6 6-6 6"/>', pausa: '<path d="M9 6v12M15 6v12"/>', play: '<path d="M8 5.5v13l10-6.5z"/>' };
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;
  function montarNav() {
    if (NAV) return;
    const st = document.createElement('style'); st.id = 'av-css';
    st.textContent = `.av-nav{position:absolute;left:0;top:0;z-index:2;display:flex;flex-direction:column;gap:6px}
.av-nav[hidden]{display:none}
.av-nav .dz{display:flex;gap:4px;padding:3px;border-radius:12px;border:1px solid var(--line-strong,#5B6C99);background:rgba(19,26,43,.92)}
.av-nav .dz button{flex:1;min-width:0;height:40px;padding:0 6px;border-radius:9px;border:1px solid transparent;background:transparent;font:inherit;font-size:14px;font-weight:600;color:var(--dim,#9DA9C4);cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:background-color 120ms,color 120ms,border-color 120ms}
.av-nav .dz button:hover{color:var(--txt,#E8EDF7)}
.av-nav .dz button[aria-pressed="true"]{color:var(--amber,#FFB347);border-color:var(--amber,#FFB347);background:var(--panel,#131A2B)}
.av-nav .row{display:flex;align-items:center;gap:6px}
.av-nav .row button{font:inherit;width:44px;height:44px;flex:none;display:grid;place-items:center;border-radius:10px;border:1px solid var(--line-strong,#5B6C99);background:rgba(19,26,43,.92);color:var(--txt,#E8EDF7);cursor:pointer;transition:background-color 90ms,border-color 90ms}
.av-nav .row button:hover{background:var(--panel-2,#1B2440);border-color:var(--amber,#FFB347)}
.av-nav button:active{transform:scale(.96)}
.av-nav button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
.av-nav .row button svg{width:22px;height:22px}
.av-nav .row button[hidden]{display:none}
.av-nav .et{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;padding:0 6px;line-height:1.2}
.av-nav .et small{font-size:12px;color:var(--dim,#9DA9C4)}
.av-nav .et b{font-size:14px;font-weight:600;color:var(--txt,#E8EDF7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(prefers-reduced-motion:reduce){.av-nav button{transition:none}.av-nav button:active{transform:none}}`;
    document.head.appendChild(st);
    NAV = document.createElement('div'); NAV.className = 'av-nav'; NAV.hidden = true; NAV.setAttribute('role', 'group'); NAV.setAttribute('aria-label', 'Arboviroses: viagem e etapas');
    NAV.innerHTML = `<div class="dz">${DZ.map((d, i) => `<button type="button" data-d="${i}" aria-pressed="${i === 0}" title="${d.nome}">${d.curto}</button>`).join('')}</div>`
      + `<div class="row"><button type="button" data-a="ant" aria-label="Etapa anterior" title="Etapa anterior">${svg('ant')}</button>`
      + `<div class="et" aria-live="polite"><small></small><b></b></div>`
      + `<button type="button" data-a="pausa"${RED ? ' hidden' : ''}></button>`
      + `<button type="button" data-a="prox" aria-label="Próxima etapa" title="Próxima etapa">${svg('prox')}</button></div>`;
    NAV.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || !Sx) return; const v = Sx.vg;
      if (b.dataset.d != null) { if (+b.dataset.d !== v.d) irPara(Sx, +b.dataset.d, 0, true); }
      else if (b.dataset.a === 'ant') irPara(Sx, v.d, v.e - 1, true);
      else if (b.dataset.a === 'prox') irPara(Sx, v.d, v.e + 1, true);
      else { v.pausa = !v.pausa; sinc(Sx); }
    });
    cv.parentNode.appendChild(NAV);
    (function vigia() { if (NAV && !NAV.hidden && performance.now() - vivo > 180) NAV.hidden = true; requestAnimationFrame(vigia); })();
  }
  function sinc(S) {
    if (!NAV) return; const v = S.vg, k = v.d + '|' + v.e + '|' + v.pausa; if (k === sincK) return; sincK = k;
    NAV.querySelectorAll('.dz button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.d === v.d)));
    NAV.querySelector('.et small').textContent = `Etapa ${v.e + 1} de ${DZ[v.d].ET.length}`;
    NAV.querySelector('.et b').textContent = etapa(v).nome;
    const p = NAV.querySelector('[data-a="pausa"]'), tt = v.pausa ? 'Continuar a viagem' : 'Pausar a viagem';
    p.innerHTML = svg(v.pausa ? 'play' : 'pausa'); p.title = tt; p.setAttribute('aria-label', tt);
  }
  function posNav(x, y, w) { const k = [x, y, w].map(Math.round).join(); if (k === navK) return; navK = k; NAV.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`; NAV.style.width = Math.round(w) + 'px'; }
  const NAVH = 96;
  const compacto = () => NAR || W < 1160;
  const capRes = () => NAR ? 116 : 76, faixaH = () => NAVH + 70;
  const reserva = () => compacto() ? capRes() + faixaH() + 8 : 92;

  // ---------- camada sobre a figura ----------
  function sobre(R, X, t, c) {
    const S = c.S; if (!S || !S.vg) return; Sx = S; vivo = performance.now();
    const ab = FIG && FIG.aberto ? FIG.aberto.id : null;
    if (ab !== ultAb) { ultAb = ab; const q = ab && VAI[ab]; if (q && (q[0] !== S.vg.d || q[1] !== S.vg.e)) irPara(S, q[0], q[1], false); }
    avancar(S, S.dt || 0);
    const v = S.vg, et = etapa(v), T = RED ? 2.2 : t, uu = RED ? .7 : eIO(v.u), u = RED ? 1 : v.u, s = R.s, P = (x, y) => R.pt(x, y), L = cl(s * 3.2, 14, 40);
    const da = diaAlvo(v); v.dia = RED ? da : v.dia + (da - v.dia) * Math.min(1, (S.dt || 0) * 5);
    Rfig = R; esfuma(R, X);
    if (et.id === 'prev') { R.veu(.25); return; }
    if (R.vista !== et.v) return;   // o aluno trocou de vista à mão: só a figura
    const rv = Math.max(3.6, s * .75);
    if (R.vista === 'a') {
      const pt = P(PONTA[0], PONTA[1]);
      if (et.id === 'doe') {
        // sangue da pessoa doente, cheio de vírus, logo abaixo da ponta da probóscide
        const sg = P(17, 67); brilho(X, sg[0], sg[1], s * 7, SAN, .55); pulso(X, sg[0], sg[1], s * 3, VIR, T);
        for (let i = 0; i < 9; i++) { const a = i * 2.39 + (RED ? 0 : T * .5), r = s * (1 + (i % 4) * .9); virus(X, sg[0] + Math.cos(a) * r, sg[1] + Math.sin(a) * r * .7, rv, VIR, sst(i * .08, i * .08 + .2, u) + (RED ? 1 : 0), T + i); }
        etiqueta(X, sg[0] + s * 4.5, sg[1] + s * 2.5, 'sangue com vírus', VIR, 'l', sst(.2, .4, u) + (RED ? 1 : 0));
      } else if (et.id === 'pic') {
        const sg = P(17, 67); brilho(X, sg[0], sg[1], s * 6, SAN, .4 * (1 - sst(.6, 1, u)));
        for (let i = 0; i < 10; i++) { const f = RED ? i / 10 * .5 : fr(T * .5 + i / 10) * Math.min(1, uu * 1.4) * .5, p = CAM.sobe.at(f), q = P(p[0], p[1]); dot(X, q[0], q[1], Math.max(1.6, s * .3), SAN, .8 * Math.sin(PI * f / .5)); }
        traco(R, X, CAM.sobe, 0, uu, VIR);
        for (let i = 0; i < 3; i++) { const f = cl(uu - i * .04, 0, 1), p = CAM.sobe.at(f), q = P(p[0], p[1]); virus(X, q[0] + i * s * .4, q[1] - i * s * .3, rv, VIR, 1, T + i); }
        if (uu > .9) { const g = P(TRIPA[0], TRIPA[1]); pulso(X, g[0], g[1], s * 3, VIR, T); }
      } else if (et.id === 'mul') {
        const g = P(TRIPA[0], TRIPA[1]), n = 3 + Math.round(15 * sst(0, .55, u) + (RED ? 15 : 0));
        brilho(X, g[0], g[1], s * 7, VIR, .35);
        for (let i = 0; i < n; i++) { const a = i * 2.39 + (RED ? 0 : T * .3), r = s * (.4 + Math.sqrt(i) * .9); virus(X, g[0] + Math.cos(a) * r, g[1] + Math.sin(a) * r * .55, rv * .8, VIR, 1, T + i); }
        const k = sst(.5, 1, u) + (RED ? 1 : 0);
        traco(R, X, CAM.gland, 0, Math.min(1, k), VIR);
        if (k > 0) for (let i = 0; i < 4; i++) { const f = RED ? (i + .5) / 4 : cl(k - i * .08, 0, 1), p = CAM.gland.at(f), q = P(p[0], p[1]); virus(X, q[0], q[1], rv * .8, VIR, f > 0 ? 1 : 0, T + i); }
        if (k > .8) { const gl = P(GLAN[0], GLAN[1]); brilho(X, gl[0], gl[1], s * 5, NOVO, .45); pulso(X, gl[0], gl[1], s * 2.4, NOVO, T); }
      } else if (et.id === 'out') {
        const gl = P(GLAN[0], GLAN[1]); brilho(X, gl[0], gl[1], s * 4, NOVO, .4);
        traco(R, X, CAM.desce, 0, uu, NOVO);
        for (let i = 0; i < 4; i++) { const f = cl(uu - i * .05, 0, 1), p = CAM.desce.at(f), q = P(p[0], p[1]); virus(X, q[0], q[1], rv, VIR, 1, T + i); }
        const nv = P(16.5, 68.5), k = sst(.8, 1, u) + (RED ? 1 : 0);
        if (k > 0) { brilho(X, nv[0], nv[1], s * 6, NOVO, .4 * Math.min(1, k)); pulso(X, nv[0], nv[1], s * 3, NOVO, T); etiqueta(X, nv[0] + s * 4.5, nv[1] + s * 1.5, 'outra pessoa', NOVO, 'l', Math.min(1, k)); }
        else pulso(X, pt[0], pt[1], s * 2, NOVO, T);
      }
    } else if (R.vista === 'c') {
      // um filhote acompanha o ciclo pelo recipiente: ovo, larva, pupa e adulto
      const fi = { ovo: 0, lar: 1, pup: 2, adu: 3 }[et.id], f = lerp(FASES[fi], FASES[fi + 1], uu), p = CAM.ciclo.at(f), q = P(p[0], p[1]);
      traco(R, X, CAM.ciclo, 0, f, et.cor);
      brilho(X, q[0], q[1], L * 1.3, et.cor, .5); anel(X, q[0], q[1], Math.max(6, s * 1.4), et.cor, .95, 2);
      if (et.id === 'ovo') {
        const o = P(OVOS[0], OVOS[1]); brilho(X, o[0], o[1], s * 6, OVO, .3); pulso(X, o[0], o[1], s * 4, OVO, T);
        // a chuva sobe o nível da água até os ovos
        const k = sst(.2, .8, u) + (RED ? 1 : 0), y0 = P(0, 45)[1], y1 = P(0, lerp(45, 27, Math.min(1, k)))[1], xa = P(21, 0)[0], xb = P(40, 0)[0];
        X.save(); X.fillStyle = rgba(AGUA, .18); X.fillRect(xa, y1, xb - xa, y0 - y1); X.strokeStyle = rgba(AGUA, .7); X.lineWidth = 1.5; X.beginPath();
        for (let x = xa; x <= xb; x += 4) X.lineTo(x, y1 + Math.sin(x * .15 + (RED ? 0 : T * 3)) * 1.5); X.stroke(); X.restore();
        if (!RED) for (let i = 0; i < 6; i++) { const z = fr(T * .9 + i / 6), x = P(24 + i * 2.6, 0)[0], y = lerp(P(0, 2)[1], y1, z); X.strokeStyle = rgba(AGUA, .6 * (1 - z)); X.lineWidth = 1.2; X.beginPath(); X.moveTo(x, y); X.lineTo(x - 1.5, y + s * 1.6); X.stroke(); }
      } else if (et.id === 'lar') {
        SIFOES.forEach(([x, y], i) => { const c = P(x, y); pulso(X, c[0], c[1], s * 1.3, AGUA, T + i * .4, 1.4); if (!RED) for (let j = 0; j < 2; j++) { const z = fr(T * .7 + j / 2 + i * .3); dot(X, c[0] + Math.sin(z * 9 + i) * 2, c[1] - s * z * 2, Math.max(1.2, s * .2), '#E6F6FF', .7 * (1 - z)); } });
      } else if (et.id === 'pup') {
        PUPAS.forEach(([x, y], i) => { const c = P(x, y); brilho(X, c[0], c[1], s * 5, PUPA, .3); pulso(X, c[0], c[1], s * 3.2, PUPA, T + i * .5, 2); });
      } else if (et.id === 'adu') {
        const a = P(ADUL[0], ADUL[1]), ex = P(EXU[0], EXU[1]); brilho(X, a[0], a[1], s * 8 * sst(.3, 1, u + (RED ? 1 : 0)), ADU, .35); pulso(X, ex[0], ex[1], s * 2.5, PUPA, T, 2);
        etiqueta(X, ex[0] - s * 3, ex[1] + s * 4, 'casca da pupa', PUPA, 'r', sst(.4, .7, u) + (RED ? 1 : 0));
      }
    } else if (R.vista === 'b' && et.id === 'cri') {
      const f = uu, p = CAM.voo.at(f), q = P(p[0], p[1]);
      traco(R, X, CAM.voo, 0, f, NOVO);
      CRIA.forEach(([x, y], i) => { const k = sst(.15 + i * .3, .3 + i * .3, u) + (RED ? 1 : 0), c = P(x, y); if (k > 0) { brilho(X, c[0], c[1], s * 6, AGUA, .3 * Math.min(1, k)); pulso(X, c[0], c[1], s * 3.5, NOVO, T + i * .4, 2); } });
      mosquito(X, q[0], q[1], p[2], cl(s * 3.6, 18, 36), T);
    }
  }

  // ---------- painel: medidor de dias, onde está e prevenção ----------
  function medidor(X, x, y, w, v, comp) {
    const dz = DZ[v.d];
    txt(X, comp && W < 520 ? (v.d ? 'Dias desde os ovos' : 'Dias no mosquito') : dz.tit, x, y + 8, { s: comp ? 13 : 14 });
    const dd = v.dia, ia = dz.seg.findIndex(g => dd >= g[0] - .001 && dd < g[1]) ;
    txt(X, `dia ${Math.round(dd)}`, x + w, y + (comp ? 8 : 30), { s: 13, c: (dz.seg[Math.max(0, ia)] || dz.seg[0])[2], a: 'right' });
    const by = y + (comp ? 24 : 44), bh = 10, mx = 12, xx = d => x + w * cl(d / mx, 0, 1);
    dz.seg.forEach(([a, b, c], i) => { X.fillStyle = rgba(c, i === ia ? .95 : .35); X.beginPath(); X.roundRect(xx(a) + (i ? 1 : 0), by, xx(b) - xx(a) - (i < dz.seg.length - 1 ? 2 : 0), bh, 4); X.fill(); });
    const nx = xx(dd); X.beginPath(); X.moveTo(nx, by - 2); X.lineTo(nx - 6, by - 9); X.lineTo(nx + 6, by - 9); X.closePath(); X.fillStyle = TXT; X.fill(); X.fillRect(nx - 1, by - 2, 2, bh + 4);
    if (!comp) {
      dz.seg.forEach(([a, b, c, n], i) => { const cx = (xx(a) + xx(b)) / 2; txt(X, n, Math.max(x + 2, Math.min(x + w - 2, cx)), by + bh + 12 + (v.d && i === 0 ? 0 : 0), { s: 11, c: i === ia ? TXT : DIM, w: i === ia ? 700 : 500, a: i === 0 && v.d ? 'left' : 'center' }); });
      return by + bh + 22 - y;
    }
    return by + bh - y;
  }
  function conteudo(X, x, y, w, v, seco) {
    const dz = DZ[v.d], et = etapa(v); let yy = y;
    if (et.id !== 'prev') {
      yy += (seco ? 76 : medidor(X, x, yy, w, v, false)) + 18;
      [[dz.rotA, et.onde, et.cor], [dz.rotB, et.obj, TXT]].forEach(([r, s0, c]) => {
        if (!seco) txt(X, r, x, yy, { s: 12, c: DIM, w: 500 }); yy += 18;
        yy += bloco(X, s0, x, yy, w, { s: 14, lh: 18, c }, seco) + 8;
      });
      if (!seco) { X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(x, yy, w, 1); } yy += 16;
      yy += bloco(X, dz.nota, x, yy, w, { s: 13, lh: 17, c: DIM, w: 500 }, seco);
    } else {
      if (!seco) txt(X, 'Como prevenir', x, yy + 4, { s: 15, c: OK }); yy += 28;
      dz.prev.forEach(p => { if (!seco) dot(X, x + 4, yy, 3, OK, 1); yy += bloco(X, p, x + 16, yy, w - 16, { s: 13, lh: 17 }, seco) + 8; });
    }
    return yy - y;
  }
  function fora(X, t, c) {
    const S = c.S; if (!S || !S.vg || !Rfig) return; montarNav(); sinc(S); NAV.hidden = false;
    const v = S.vg;
    if (!compacto()) {
      const x0 = 24, w = 320, y0 = 60, px = x0 + 18, pw = w - 36, cy = y0 + 10 + NAVH + 18;
      const h = NAVH + 44 + conteudo(X, px, cy, pw, v, true);
      X.fillStyle = 'rgba(11,15,28,.82)'; X.beginPath(); X.roundRect(x0, y0, w, h, 14); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
      posNav(x0 + 10, y0 + 10, w - 20);
      conteudo(X, px, cy, pw, v, false);
    } else {
      const x0 = NAR ? 6 : 24, w = W - 2 * x0, h = faixaH(), y0 = H - capRes() - h - 4;
      X.fillStyle = 'rgba(11,15,28,.84)'; X.beginPath(); X.roundRect(x0, y0, w, h, 12); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
      posNav(x0 + 6, y0 + 6, w - 12);
      const px = x0 + 12, pw = w - 24;
      if (etapa(v).id !== 'prev') medidor(X, px, y0 + NAVH + 14, pw, v, true);
      else txt(X, 'Como prevenir: veja a legenda abaixo', px, y0 + NAVH + 34, { s: 13, c: OK });
    }
  }

  // ---------- registro: figura padrão com a cena antiga (quintal, mata e fichas) atrás de "Ver esquema" ----------
  const amb = {
    SC, X: () => X, W: () => W, H: () => H, nar: () => NAR, tela: cv.parentNode,
    cap: () => { const S = Sx; cap(S && S.vg ? etapa(S.vg).cap : ''); },
    t: a => a[0], rot3d: 'Ver esquema', dica3d: '',
    esconder: ['.hud.onde'], esconderFig: ['.palco .ctl', '#extra']
  };
  LAB_FIGALT.cena(amb, K, {
    pref: 'virus', nome: 'Arboviroses: a viagem do vírus e o ciclo do Aedes aegypti', mask: false,
    vistas: [
      ['a', 'doencas-arboviroses-a', 'Aedes aegypti', 'Aedes aegypti: o mosquito que transmite dengue, zika e chikungunya'],
      ['b', 'doencas-arboviroses-b', 'Criadouros', 'Água parada em pneu, pratinho de vaso e tonel: lugares onde o mosquito põe ovos'],
      ['c', 'arboviroses-v5c', 'Pratinho em corte', 'Pratinho de vaso com água parada em corte: ovos na parede, larvas presas à superfície, pupas e um adulto saindo da pupa']
    ],
    hs: HS, reserva, sobre, fora
  });
  FIG = c3.figura;
  const dFig = c3.draw, i1 = c3.init;
  c3.init = function (S) { i1.call(this, S); S.vg = novo(); sincK = ''; ultAb = null; };
  c3.draw = function (t, S) {
    if (!S.vg) S.vg = novo();
    if (S.vg.ini && FIG) { S.vg.ini = false; const vv = etapa(S.vg).v; if (FIG.vistaAtual !== vv) FIG.mostrar(vv); }
    return dFig.call(this, t, S);
  };
})();
