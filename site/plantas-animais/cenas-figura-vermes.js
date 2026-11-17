/* LAB Plantas e animais: "Platelmintos, nematódeos e verminoses" com figuras de IA realistas e a viagem do verme por cima (Martin).
   Duas viagens num seletor: esquistossomose (ovos nas fezes, água doce, miracídio, caramujo Biomphalaria, cercária,
   pele, vermes adultos nas veias do intestino e do fígado) e teníase com cisticercose (proglotes nas fezes, porco come
   os ovos, cisticercos na carne, carne malcozida, tênia no intestino; ovos engolidos pela pessoa dão a cisticercose).
   Vista A (nova): lagoa com caramujos, pessoa com as pernas na água e casa sem saneamento. Vista B (nova): porco,
   carne crua com cisticercos e intestino com a tênia. Vista C: o corpo da rota monera/doencas (cópia em
   plantas-animais-vermes-corpo). Medidor: hospedeiro atual (definitivo, fora do corpo ou intermediário).
   Tocar num ponto leva a viagem até a etapa dele. A roda de bolinhas, o "Corte o ciclo" e o quadro ficam atrás de
   "Ver esquema" (LAB_FIGALT, figura-alterna.js). Com prefers-reduced-motion nada anda sozinho: etapas por botão.
   Carregar depois de cenas-figura.js e antes de LAB_PLANTAS_iniciar(). Texto na tela: sem "!", sem setas ou pontos como separador. */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const K = 'animalia/vermes', c3 = SC[K]; if (!c3) return;
  const RED = LAB_FIGALT.RED, PI = Math.PI, TAU = PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k, fr = v => v - Math.floor(v);
  const sst = (a, b, x) => { const u = cl((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const eIO = u => { u = cl(u, 0, 1); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
  const FT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const OVO = '#F2DC9B', MIR = '#8FD8FF', CER = '#F4EEDC', VER = '#EFE6D2', CIS = '#F5F2EA', DEF = '#F28B8B', FORA = '#8FD8FF', INT = '#A9C54A', OK = '#7FD3A0', TXT = '#E8EDF7', DIM = '#9DA9C4', AMB = '#FFB347';
  const AR = { a: [.88, .657], b: [.88, .491], c: [.88, 1.324] };   // proporção de cada figura, para medir distâncias de verdade

  // ---------- curva suave (Catmull-Rom) por pontos em % da figura ----------
  function trilha(P, vid) {
    const ar = AR[vid], N = 12, AM = [], LC = [0];
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
  function rastro(R, X, tr, f, cor) {
    X.save(); X.setLineDash([2, 5]); X.lineCap = 'round'; X.strokeStyle = rgba(cor, .65); X.lineWidth = 1.6; X.beginPath();
    let st = false; for (let i = 0; i < tr.AM.length && tr.LF[i] <= f; i++) { const s = R.pt(tr.AM[i][0], tr.AM[i][1]); if (!st) { X.moveTo(s[0], s[1]); st = true; } else X.lineTo(s[0], s[1]); }
    const p = tr.at(f), q = R.pt(p[0], p[1]); if (st) { X.lineTo(q[0], q[1]); X.stroke(); } X.restore();
  }

  // ---------- desenhos: pontinho, brilho, anel e as fases dos vermes ----------
  function dot(X, x, y, r, c, a) { X.globalAlpha = cl(a == null ? 1 : a, 0, 1); X.beginPath(); X.arc(x, y, Math.max(.2, r), 0, TAU); X.fillStyle = c; X.fill(); X.globalAlpha = 1; }
  function brilho(X, x, y, r, cor, a) { if (a <= 0) return; const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(cor, a)); g.addColorStop(1, rgba(cor, 0)); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); }
  function anel(X, x, y, r, cor, a, lw) { if (a <= 0) return; X.save(); X.globalAlpha = cl(a, 0, 1); X.strokeStyle = cor; X.lineWidth = lw || 2; X.beginPath(); X.arc(x, y, r, 0, TAU); X.stroke(); X.restore(); }
  function pulso(X, x, y, r, cor, T, per) { if (RED) { anel(X, x, y, r * 1.3, cor, .7, 2); return; } const k = fr(T / (per || 1.6)); anel(X, x, y, r * (.6 + k * 1.4), cor, .85 * (1 - k), 2); }
  const borda = 'rgba(30,24,14,.75)';
  function com(X, x, y, ang, a, fn) { X.save(); X.globalAlpha = cl(a == null ? 1 : a, 0, 1); X.translate(x, y); X.rotate(ang || 0); fn(); X.restore(); }
  // ovo do Schistosoma mansoni: oval com o espinho lateral
  function ovoS(X, x, y, ang, L, a) { com(X, x, y, ang, a, () => { X.beginPath(); X.ellipse(0, 0, L / 2, L * .27, 0, 0, TAU); X.fillStyle = OVO; X.fill(); X.strokeStyle = borda; X.lineWidth = 1; X.stroke(); X.beginPath(); X.moveTo(L * .08, -L * .24); X.lineTo(L * .2, -L * .46); X.lineTo(L * .22, -L * .2); X.fillStyle = OVO; X.fill(); X.stroke(); dot(X, -L * .05, 0, L * .12, 'rgba(120,96,40,.6)', X.globalAlpha); }); }
  // miracídio: larva em forma de pera coberta de cílios
  function miracidio(X, x, y, ang, L, T, a) {
    com(X, x, y, ang, a, () => {
      X.beginPath(); X.ellipse(0, 0, L / 2, L * .26, 0, 0, TAU); X.fillStyle = rgba(MIR, .9); X.fill(); X.strokeStyle = 'rgba(10,40,60,.8)'; X.lineWidth = 1; X.stroke();
      X.strokeStyle = rgba(MIR, .9); X.lineWidth = 1; const ph = RED ? 0 : T * 14;
      for (let i = 0; i < 14; i++) { const t = i / 14 * TAU, cx = Math.cos(t) * L / 2, cy = Math.sin(t) * L * .26, w = Math.sin(ph + i) * .5 + 1; X.beginPath(); X.moveTo(cx, cy); X.lineTo(cx * (1 + .22 * w), cy * (1 + .5 * w)); X.stroke(); }
    });
  }
  // cercária: corpo oval e cauda que termina em forquilha (a frente aponta para ang)
  function cercaria(X, x, y, ang, L, T, a, semCauda) {
    com(X, x, y, ang, a, () => {
      const ph = RED ? 0 : T * 16;
      if (!semCauda) {
        X.strokeStyle = CER; X.lineCap = 'round'; X.lineWidth = Math.max(1.2, L * .1); X.beginPath(); X.moveTo(-L * .2, 0);
        for (let j = 1; j <= 8; j++) { const q = j / 8; X.lineTo(-L * .2 - q * L * .7, Math.sin(q * 5 - ph) * L * .1 * q); } X.stroke();
        const ex = -L * .9, ey = Math.sin(5 - ph) * L * .1; X.lineWidth = Math.max(1, L * .07);
        X.beginPath(); X.moveTo(ex, ey); X.lineTo(ex - L * .22, ey - L * .14); X.moveTo(ex, ey); X.lineTo(ex - L * .22, ey + L * .14); X.stroke();
      }
      X.beginPath(); X.ellipse(0, 0, L * .25, L * .15, 0, 0, TAU); X.fillStyle = CER; X.fill(); X.strokeStyle = borda; X.lineWidth = 1; X.stroke();
    });
  }
  // casal de vermes adultos: o macho, mais grosso, carrega a fêmea fina no sulco do corpo
  function casal(X, x, y, ang, L, T, a) {
    com(X, x, y, ang, a, () => {
      const ph = RED ? 0 : T * 3, onda = (q, k) => Math.sin(q * 5 + ph + k) * L * .08;
      X.lineCap = 'round';
      X.strokeStyle = '#FFFFFF'; X.lineWidth = Math.max(1, L * .05); X.beginPath(); for (let j = 0; j <= 16; j++) { const q = j / 16; X.lineTo(-L * .55 + q * L * 1.1, onda(q, .6) - L * .02); } X.stroke();
      X.strokeStyle = VER; X.lineWidth = Math.max(2, L * .14); X.beginPath(); for (let j = 0; j <= 16; j++) { const q = j / 16; X.lineTo(-L * .4 + q * L * .8, onda(q * .8 + .1, 0) + L * .03); } X.stroke();
      X.strokeStyle = borda; X.lineWidth = 1; X.stroke();
    });
  }
  // proglote: pedaço retangular cheio de ovos
  function proglote(X, x, y, ang, L, a) { com(X, x, y, ang, a, () => { X.beginPath(); X.roundRect(-L / 2, -L * .3, L, L * .6, L * .12); X.fillStyle = VER; X.fill(); X.strokeStyle = borda; X.lineWidth = 1; X.stroke(); for (let i = 0; i < 6; i++) dot(X, -L * .3 + (i % 3) * L * .3, (i < 3 ? -1 : 1) * L * .12, L * .06, 'rgba(150,120,60,.8)', X.globalAlpha); }); }
  // ovo da Taenia: redondo, com casca grossa e listrada
  function ovoT(X, x, y, r, a) { com(X, x, y, 0, a, () => { X.beginPath(); X.arc(0, 0, r, 0, TAU); X.fillStyle = '#C9A46A'; X.fill(); X.strokeStyle = borda; X.lineWidth = 1; X.stroke(); X.beginPath(); X.arc(0, 0, r * .62, 0, TAU); X.fillStyle = '#F3E6C4'; X.fill(); }); }
  // cisticerco: bolinha branca translúcida com a cabeça invaginada
  function cisto(X, x, y, r, a) { com(X, x, y, 0, a, () => { brilho(X, 0, 0, r * 2, '#FFFFFF', .35); X.beginPath(); X.ellipse(0, 0, r, r * .8, 0, 0, TAU); X.fillStyle = 'rgba(245,242,234,.85)'; X.fill(); X.strokeStyle = 'rgba(80,70,60,.6)'; X.lineWidth = 1; X.stroke(); dot(X, r * .2, 0, r * .3, '#FFFFFF', X.globalAlpha); }); }

  // ---------- caminhos (conferidos sobre as figuras) ----------
  const CAM = {
    cano: trilha([[48.5, 22.5], [46.5, 27], [44, 31], [38, 35], [30, 40]], 'a'),
    mira: trilha([[30, 40], [34, 46], [40, 51], [46, 55], [51, 58], [55, 59.5]], 'a'),
    cer: [trilha([[55, 59.5], [57, 55], [59.5, 50], [62, 45]], 'a'), trilha([[55, 59.5], [62, 56], [69, 52], [74.5, 47]], 'a')],
    veia: trilha([[40.5, 55], [42, 51], [45, 47], [47.5, 43], [47, 38], [44.5, 34.5]], 'c'),
    prog: trilha([[81, 89], [80.5, 93], [79, 96.5], [77, 99]], 'b'),
    ovos: trilha([[74, 97], [62, 91], [49, 83], [39, 71], [35, 59], [36, 51]], 'b'),
    musc: trilha([[24, 45], [32, 46.5], [40, 48], [46, 48.5], [50, 48.5]], 'b'),
    come: trilha([[54, 42], [60, 30], [68, 21], [75, 15.5], [81.5, 17.5]], 'b'),
    tenia: trilha([[81.5, 17.5], [81.2, 24], [80.8, 32], [80.5, 38], [84, 40], [89, 41], [88, 46], [82, 48.5], [77.5, 51], [78, 57], [83, 60], [86.5, 55], [89.5, 60], [89, 70], [84, 75], [79, 71], [78, 77], [80, 84], [81, 89]], 'b'),
    boca: trilha([[50, 11.5], [50, 16], [50, 22], [51, 29], [52, 35], [50, 42]], 'c')
  };
  const CISTOS = [[51.5, 38.5], [62, 37.5], [50, 48.5], [59, 46], [47.5, 53], [55.5, 55.5], [51, 60.5], [61, 60.5]];
  const ALVOS = [[49, 5], [39, 51], [29, 37], [60, 52]];                                  // cisticercose: cérebro e músculos

  // ---------- etapas ----------
  const DZ = [
    { id: 'esq', nome: 'Esquistossomose', curto: 'Esquistossomose', cor: MIR,
      nota: 'Schistosoma mansoni, um platelminto. O ser humano é o hospedeiro definitivo e o caramujo Biomphalaria, o intermediário.',
      prev: ['Saneamento básico: esgoto tratado, longe da água', 'Não entrar em lagoas e riachos com caramujos', 'Controle dos caramujos', 'Tratamento dos doentes, que param de soltar ovos'],
      ET: [
        { id: 'ovos', nome: 'Ovos nas fezes', v: 'a', dur: 6, h: ['def', 'fora'], quem: ['Ser humano doente', 'Água doce, sem hospedeiro'], forma: 'Ovo com espinho lateral',
          cap: 'Os ovos do <i>Schistosoma mansoni</i> saem nas <b>fezes</b> de quem tem o verme. Sem esgoto tratado, eles chegam à <b>água doce</b>.' },
        { id: 'mira', nome: 'Miracídio', v: 'a', dur: 6, h: 'fora', quem: 'Água doce, sem hospedeiro', forma: 'Miracídio, larva com cílios',
          cap: 'Na água, o ovo se abre e sai o <b>miracídio</b>, uma larva com cílios que nada à procura do caramujo.' },
        { id: 'cara', nome: 'No caramujo', v: 'a', dur: 6, h: 'int', quem: 'Caramujo Biomphalaria', forma: 'Larvas que se multiplicam',
          cap: 'O miracídio penetra no caramujo <b><i>Biomphalaria</i></b>, o <b>hospedeiro intermediário</b>, e se multiplica muito dentro dele.' },
        { id: 'cer', nome: 'Cercárias', v: 'a', dur: 7, h: 'fora', quem: 'Água doce, sem hospedeiro', forma: 'Cercária, larva de cauda bifurcada',
          cap: 'Semanas depois, saem do caramujo milhares de <b>cercárias</b>, larvas com a cauda em forquilha, sobretudo nas horas de sol.' },
        { id: 'pele', nome: 'Entra pela pele', v: 'a', dur: 6, h: ['fora', 'def'], quem: ['Água doce, sem hospedeiro', 'Ser humano'], forma: 'Cercária que perde a cauda',
          cap: 'As cercárias <b>penetram na pele</b> de quem entra na água e perdem a cauda. O local pode coçar.' },
        { id: 'veia', nome: 'Nas veias', v: 'c', dur: 8, h: 'def', quem: 'Ser humano', forma: 'Vermes adultos, macho e fêmea juntos',
          cap: 'Pelo sangue, viram <b>vermes adultos</b> nas <b>veias do intestino e do fígado</b>. Os ovos inflamam o fígado, a barriga pode inchar (barriga d’água) e outros ovos saem nas fezes.' },
        { id: 'prev', nome: 'Como prevenir', v: 'a', dur: 8, h: null,
          cap: 'Prevenção: <b>saneamento básico</b>, não entrar em lagoas com caramujos, controle dos caramujos e tratamento dos doentes.' }
      ] },
    { id: 'ten', nome: 'Teníase e cisticercose', curto: 'Tênia', cor: AMB,
      nota: 'Taenia solium, do porco, um platelminto. Na teníase o ser humano é o hospedeiro definitivo; na cisticercose, faz o papel do porco.',
      prev: ['Carne de porco e de boi bem cozida e inspecionada', 'Saneamento: fezes humanas longe do porco, da água e da horta', 'Lavar as mãos e as verduras', 'Tratar quem tem a tênia'],
      ET: [
        { id: 'prog', nome: 'Proglotes', v: 'b', dur: 6, h: ['def', 'fora'], quem: ['Ser humano com a tênia', 'Solo e água, sem hospedeiro'], forma: 'Proglote cheia de ovos',
          cap: 'A <b>tênia</b> adulta vive no intestino humano. Os pedaços do fim do corpo, as <b>proglotes</b>, cheias de ovos, saem nas fezes.' },
        { id: 'porco', nome: 'Porco come ovos', v: 'b', dur: 7, h: ['fora', 'int'], quem: ['Solo e água, sem hospedeiro', 'Porco'], forma: 'Ovo',
          cap: 'Onde não há saneamento, o <b>porco</b> come os ovos no solo ou na água. Ele é o <b>hospedeiro intermediário</b>.' },
        { id: 'cist', nome: 'Cisticercos', v: 'b', dur: 6, h: 'int', quem: 'Porco', forma: 'Cisticerco, a larva',
          cap: 'No porco, as larvas vão para os músculos e formam os <b>cisticercos</b>, bolinhas brancas na carne: a canjiquinha.' },
        { id: 'come', nome: 'Carne malcozida', v: 'b', dur: 6, h: ['int', 'def'], quem: ['Carne do porco', 'Ser humano'], forma: 'Cisticerco vivo',
          cap: 'Quem come carne de porco <b>crua ou malcozida</b> engole cisticercos vivos. O cozimento completo mata as larvas.' },
        { id: 'tenia', nome: 'Tênia adulta', v: 'b', dur: 7, h: 'def', quem: 'Ser humano', forma: 'Tênia adulta, a solitária',
          cap: 'No intestino, o cisticerco se prende pela cabeça, o <b>escólex</b>, e cresce até virar a <b>tênia</b>, com metros de comprimento: é a <b>teníase</b>.' },
        { id: 'cisc', nome: 'Cisticercose', v: 'c', dur: 8, h: 'int', quem: 'Ser humano, no lugar do porco', forma: 'Cisticercos no corpo humano',
          cap: 'Se a pessoa <b>engole os ovos</b>, em água, verduras ou mãos sujas, formam-se cisticercos nos músculos e no <b>cérebro</b>: é a <b>cisticercose</b>.' },
        { id: 'prev', nome: 'Como prevenir', v: 'b', dur: 8, h: null,
          cap: 'Prevenção: carne <b>bem cozida</b> e inspecionada, <b>saneamento</b>, lavar as mãos e as verduras e tratar quem tem a tênia.' }
      ] }
  ];

  // ---------- pontos da figura (função em nível ENEM); tocar leva a viagem até a etapa ----------
  const HS = [
    { id: 'cano', c: OVO, t: 'Esgoto na lagoa', d: 'O cano leva fezes humanas direto para a água. Com elas vão os ovos do Schistosoma. Esgoto tratado corta o ciclo aqui.', em: { a: [49, 21.5] }, z: 2.8 },
    { id: 'casa', c: '#C9A46A', t: 'Casa sem saneamento', d: 'Sem rede de esgoto, as fezes chegam à água e ao solo. Levar saneamento a todos é responsabilidade do poder público.', em: { a: [40, 12] }, z: 2.4 },
    { id: 'agua', c: MIR, t: 'Água doce parada', d: 'Na água doce, o ovo libera o miracídio, que nada até o caramujo. Depois, as cercárias nadam aqui até achar uma pessoa.', em: { a: [22, 38] }, z: 2.4 },
    { id: 'cara', c: INT, t: 'Caramujo Biomphalaria', d: 'Hospedeiro intermediário: dentro dele o miracídio se multiplica e vira milhares de cercárias. Vive dentro da água doce, preso a plantas e pedras. A concha é achatada, enrolada num plano só.', em: { a: [29, 68.5] }, z: 3 },
    { id: 'perna', c: DEF, t: 'Pele das pernas', d: 'As cercárias penetram pela pele de quem entra na água, perdem a cauda e caem no sangue. Botas e evitar a lagoa protegem.', em: { a: [62.5, 30] }, z: 2.6 },
    { id: 'porco', c: INT, t: 'Porco: hospedeiro intermediário', d: 'O porco se infecta ao comer ovos da tênia no solo ou na água sujos de fezes humanas. Criar o porco preso e com saneamento evita isso.', em: { b: [18, 45] }, z: 2.4 },
    { id: 'carne', c: CIS, t: 'Cisticercos na carne', d: 'As bolinhas brancas são cisticercos, larvas da tênia. A inspeção da carne e o cozimento completo impedem a teníase.', em: { b: [56, 47] }, z: 2.8 },
    { id: 'esc', c: AMB, t: 'Escólex', d: 'A cabeça da tênia tem ventosas e ganchos que a prendem à parede do intestino. A tênia não tem boca nem tubo digestório: absorve o alimento pela superfície.', em: { b: [84.5, 15.5] }, z: 3.4 },
    { id: 'prog', c: VER, t: 'Proglotes', d: 'O corpo é uma fita de proglotes. As do fim, maduras e cheias de ovos, se soltam e saem nas fezes. Cada proglote é hermafrodita.', em: { b: [89.5, 63] }, z: 2.8 },
    { id: 'int', c: DEF, t: 'Intestino delgado', d: 'É onde vive a tênia adulta: no intestino humano, o hospedeiro definitivo. A teníase costuma dar poucos sintomas.', em: { b: [75, 30] }, z: 2.4 },
    { id: 'fig', c: '#C9705E', t: 'Fígado', d: 'Ovos do Schistosoma levados pelo sangue ficam presos no fígado e causam inflamação. Nos casos graves, o fígado e o baço crescem e a barriga se enche de líquido.', em: { c: [40, 33] }, z: 3 },
    { id: 'veiac', c: DEF, t: 'Veias do intestino', d: 'Os vermes adultos vivem em casal nas veias que levam o sangue do intestino ao fígado. Parte dos ovos atravessa a parede do intestino e sai nas fezes.', em: { c: [55, 45] }, z: 3 },
    { id: 'pelec', c: MIR, t: 'Pele', d: 'Porta de entrada da cercária. Depois de entrar, ela cai no sangue e vai até as veias do fígado.', em: { c: [36, 55] }, z: 3 },
    { id: 'cer', c: AMB, t: 'Cérebro', d: 'Na neurocisticercose, cisticercos se alojam no cérebro e podem causar convulsões. Vem de engolir ovos da Taenia solium, não de comer carne.', em: { c: [55.5, 6] }, z: 3.4 },
    { id: 'mus', c: CIS, t: 'Músculos', d: 'Na cisticercose, as larvas também formam cisticercos nos músculos, como na carne do porco.', em: { c: [34, 48] }, z: 3 }
  ];
  const VAI = { cano: [0, 0], casa: [0, 6], agua: [0, 1], cara: [0, 2], perna: [0, 4], fig: [0, 5], veiac: [0, 5], pelec: [0, 4], porco: [1, 1], carne: [1, 2], esc: [1, 4], prog: [1, 0], int: [1, 4], cer: [1, 5], mus: [1, 5] };

  // ---------- estado da viagem (em S.vg) ----------
  const novo = () => ({ d: 0, e: 0, u: RED ? 1 : 0, hold: 0, pausa: false, hp: 0, ini: true });
  let FIG = null, Sx = null, ultAb = null, Rfig = null, vivo = 0;
  const etapa = v => DZ[v.d].ET[v.e];
  function irPara(S, d, e, troca) {
    const v = S.vg, n = DZ[d].ET.length; v.d = d; v.e = (e + n) % n; v.u = RED ? 1 : 0; v.hold = 0;
    if (troca && FIG && FIG.vistaAtual !== etapa(v).v) FIG.mostrar(etapa(v).v);
    sinc(S);
  }
  function avancar(S, dt) {
    const v = S.vg, et = etapa(v), n = DZ[v.d].ET.length;
    if (RED || v.pausa || !dt) return;
    if (v.u < 1) { v.u = Math.min(1, v.u + dt / et.dur); return; }
    v.hold += dt;
    if (v.e < n - 1) { if (v.hold > 1.4) irPara(S, v.d, v.e + 1, true); }
    else if (v.hold > 4) irPara(S, v.d, 0, true);
  }
  // hospedeiro atual: 0 definitivo, 1 fora do corpo, 2 intermediário; nas etapas de passagem muda no meio
  const IDX = { def: 0, fora: 1, int: 2 };
  function hosp(v) { const h = etapa(v).h; if (h === null) return null; if (Array.isArray(h)) return v.u > .55 || RED ? 1 : 0; return -1; }
  function hAtual(v) { const et = etapa(v), h = et.h; if (h === null) return null; if (Array.isArray(h)) { const k = hosp(v); return { i: IDX[h[k]], quem: et.quem[k] }; } return { i: IDX[h], quem: et.quem }; }

  // ---------- botões: seletor da doença e etapas (HTML sobre o palco) ----------
  const ICO = { ant: '<path d="M14.5 6 8.5 12l6 6"/>', prox: '<path d="m9.5 6 6 6-6 6"/>', pausa: '<path d="M9 6v12M15 6v12"/>', play: '<path d="M8 5.5v13l10-6.5z"/>' };
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;
  let NAV = null;
  function montarNav() {
    if (NAV) return;
    const st = document.createElement('style'); st.id = 'pv-css';
    st.textContent = `.pv-nav{position:absolute;left:0;top:0;z-index:2;display:flex;flex-direction:column;gap:6px}
.pv-nav[hidden]{display:none}
.pv-nav .dz{display:flex;gap:4px;padding:3px;border-radius:12px;border:1px solid var(--line-strong,#5B6C99);background:rgba(19,26,43,.92)}
.pv-nav .dz button{flex:1;min-width:0;height:40px;padding:0 6px;border-radius:9px;border:1px solid transparent;background:transparent;font:inherit;font-size:14px;font-weight:600;color:var(--dim,#9DA9C4);cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:background-color 120ms,color 120ms,border-color 120ms}
.pv-nav .dz button:hover{color:var(--txt,#E8EDF7)}
.pv-nav .dz button[aria-pressed="true"]{color:var(--amber,#FFB347);border-color:var(--amber,#FFB347);background:var(--panel,#131A2B)}
.pv-nav .row{display:flex;align-items:center;gap:6px}
.pv-nav .row button{font:inherit;width:44px;height:44px;flex:none;display:grid;place-items:center;border-radius:10px;border:1px solid var(--line-strong,#5B6C99);background:rgba(19,26,43,.92);color:var(--txt,#E8EDF7);cursor:pointer;transition:background-color 90ms,border-color 90ms}
.pv-nav .row button:hover{background:var(--panel-2,#1B2440);border-color:var(--amber,#FFB347)}
.pv-nav button:active{transform:scale(.96)}
.pv-nav button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
.pv-nav .row button svg{width:22px;height:22px}
.pv-nav .row button[hidden]{display:none}
.pv-nav .et{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;padding:0 6px;line-height:1.2}
.pv-nav .et small{font-size:12px;color:var(--dim,#9DA9C4)}
.pv-nav .et b{font-size:15px;font-weight:600;color:var(--txt,#E8EDF7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(prefers-reduced-motion:reduce){.pv-nav button{transition:none}.pv-nav button:active{transform:none}}`;
    document.head.appendChild(st);
    NAV = document.createElement('div'); NAV.className = 'pv-nav'; NAV.hidden = true; NAV.setAttribute('role', 'group'); NAV.setAttribute('aria-label', 'Viagem do verme: doença e etapas');
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
  let sincK = '';
  function sinc(S) {
    if (!NAV) return; const v = S.vg, k = v.d + '|' + v.e + '|' + v.pausa; if (k === sincK) return; sincK = k;
    NAV.querySelectorAll('.dz button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.d === v.d)));
    NAV.querySelector('.et small').textContent = `Etapa ${v.e + 1} de ${DZ[v.d].ET.length}`;
    NAV.querySelector('.et b').textContent = etapa(v).nome;
    const p = NAV.querySelector('[data-a="pausa"]'), tt = v.pausa ? 'Continuar a viagem' : 'Pausar a viagem';
    p.innerHTML = svg(v.pausa ? 'play' : 'pausa'); p.title = tt; p.setAttribute('aria-label', tt);
  }
  let navK = '';
  function posNav(x, y, w) { const k = [x, y, w].map(Math.round).join(); if (k === navK) return; navK = k; NAV.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`; NAV.style.width = Math.round(w) + 'px'; }
  const NAVH = 96;

  // ---------- layout ----------
  const compacto = () => NAR || W < 1160;
  const capRes = () => NAR ? 116 : 76, faixaH = () => NAVH + 70;
  const reserva = () => compacto() ? capRes() + faixaH() + 8 : 56;

  // bordas esfumadas em retângulo (sem a máscara radial, que cortava o intestino nos cantos)
  function esfuma(R, X) {
    const f = Math.min(R.w, R.h) * .07, C = 'rgba(13,19,34,', x0 = R.x, y0 = R.y, x1 = R.x + R.w, y1 = R.y + R.h;
    [[x0, 0, x0 + f, 0, x0, y0, f, R.h], [x1, 0, x1 - f, 0, x1 - f, y0, f, R.h], [0, y0, 0, y0 + f, x0, y0, R.w, f], [0, y1, 0, y1 - f, x0, y1 - f, R.w, f]].forEach(q => {
      const g = X.createLinearGradient(q[0], q[1], q[2], q[3]); g.addColorStop(0, C + '1)'); g.addColorStop(1, C + '0)'); X.fillStyle = g; X.fillRect(q[4], q[5], q[6], q[7]);
    });
  }

  // ---------- camada sobre a figura ----------
  function sobre(R, X, t, c) {
    const S = c.S; if (!S || !S.vg) return; Sx = S; vivo = performance.now();
    const ab = FIG && FIG.aberto ? FIG.aberto.id : null;
    if (ab !== ultAb) { ultAb = ab; const q = ab && VAI[ab]; if (q && (q[0] !== S.vg.d || q[1] !== S.vg.e)) irPara(S, q[0], q[1], false); }
    avancar(S, S.dt || 0);
    const v = S.vg, et = etapa(v), T = RED ? 2.2 : t, uu = RED ? .7 : eIO(v.u), s = R.s, P = (x, y) => R.pt(x, y);
    const ha = hAtual(v); if (ha) v.hp = RED ? ha.i : v.hp + (ha.i - v.hp) * Math.min(1, (S.dt || 0) * 5);
    Rfig = R; esfuma(R, X);
    if (et.id === 'prev') { R.veu(.22); return; }
    const L = cl(s * 3.2, 14, 40);
    if (R.vista === 'a' && v.d === 0) {
      if (et.id === 'ovos') {
        const c0 = P(48.5, 22.5); pulso(X, c0[0], c0[1], s * 2.5, OVO, T);
        for (let i = 0; i < 5; i++) { const f = RED ? (i + .5) / 5 : cl(fr(T * .18 + i / 5) * (.4 + .6 * uu), 0, 1), p = CAM.cano.at(f), q = P(p[0], p[1]); ovoS(X, q[0], q[1], p[2] + (RED ? 0 : T * .8 + i), L * .7, Math.min(1, Math.sin(PI * f) * 2 + .2)); }
      } else if (et.id === 'mira') {
        const o = P(30, 40), f = uu, p = CAM.mira.at(f), q = P(p[0], p[1]);
        ovoS(X, o[0], o[1], .3, L * .7, 1 - sst(0, .25, v.u) * .6);
        rastro(R, X, CAM.mira, f, MIR); brilho(X, q[0], q[1], L * 1.4, MIR, .45);
        miracidio(X, q[0], q[1], p[2], L, T, sst(0, .15, v.u + (RED ? 1 : 0)));
        const cr = P(55, 59.5); pulso(X, cr[0], cr[1], s * 3, INT, T, 2);
      } else if (et.id === 'cara') {
        const cr = P(55, 59.5), k = sst(0, .9, v.u) + (RED ? 1 : 0);
        brilho(X, cr[0], cr[1], s * 6, INT, .35 + .25 * Math.min(1, k));
        if (v.u < .25 && !RED) { const q = P(lerp(52, 55, v.u * 4), lerp(56, 59.5, v.u * 4)); miracidio(X, q[0], q[1], 1.6, L, T, 1 - v.u * 4); }
        const n = Math.round(Math.min(1, k) * 18);
        for (let i = 0; i < n; i++) { const a = i * 2.39 + (RED ? 0 : T * .4), r = s * (.6 + (i % 5) * .45); dot(X, cr[0] + Math.cos(a) * r, cr[1] + Math.sin(a) * r * .7, Math.max(1.4, s * .3), CER, .9); }
        pulso(X, cr[0], cr[1], s * 4, INT, T);
      } else if (et.id === 'cer' || et.id === 'pele') {
        const cr = P(55, 59.5), pele = et.id === 'pele';
        if (!pele) brilho(X, cr[0], cr[1], s * 5, INT, .35);
        for (let i = 0; i < 8; i++) {
          const tr = CAM.cer[i % 2];
          let f = pele ? lerp(.75, 1, uu) + (i >> 1) * .0 - (i >> 1) * .05 * (1 - uu) : RED ? (i + .5) / 8 * .9 : fr(T * .12 + i / 8) * (.25 + .75 * uu);
          f = cl(f, 0, 1); const p = tr.at(f), q = P(p[0], p[1]), o = (i >> 1) * s * .8;
          if (pele && f > .98) continue;
          cercaria(X, q[0] + (pele ? 0 : Math.sin(i) * o), q[1] + (pele ? -o * .6 : Math.cos(i) * o * .5), p[2], L, T + i, pele ? 1 - sst(.85, 1, v.u) : Math.min(1, Math.sin(PI * f) * 2.5));
        }
        if (pele) {
          [[62, 44], [74.5, 46]].forEach(([x, y], k) => {
            const q = P(x, y); pulso(X, q[0], q[1], s * 2.4, DEF, T + k * .5);
            // a cauda fica para trás e afunda
            for (let i = 0; i < 2; i++) { const d = sst(.5, 1, v.u) + (RED ? .5 : 0); X.save(); X.globalAlpha = .8 * (1 - sst(.8, 1, d)); X.strokeStyle = CER; X.lineWidth = Math.max(1.2, L * .08); X.beginPath(); X.moveTo(q[0] - s * (1 + i), q[1] + s * (1 + d * 3)); X.lineTo(q[0] - s * (2.6 + i), q[1] + s * (1.6 + d * 3)); X.stroke(); X.restore(); }
            for (let i = 0; i < 3; i++) { const d = sst(.4, 1, v.u) + (RED ? 1 : 0); cercaria(X, q[0] + (i - 1) * s * .8, q[1] - s * (.4 + Math.min(1, d) * 4) - i * s, -PI / 2, L * .8, T, Math.min(1, d) * (1 - sst(.85, 1, v.u)) + (RED ? .8 : 0), true); }
          });
        }
      }
    } else if (R.vista === 'b' && v.d === 1) {
      const sc = P(81.5, 17.5);
      if (et.id === 'prog') {
        for (let i = 0; i < 4; i++) { const f = RED ? (i + .5) / 4 : cl(fr(T * .16 + i / 4) * (.3 + .7 * uu), 0, 1), p = CAM.prog.at(f), q = P(p[0], p[1]); proglote(X, q[0], q[1], p[2], L * 1.1, Math.min(1, Math.sin(PI * f) * 2.5)); }
        const tl = P(81, 89); pulso(X, tl[0], tl[1], s * 2.5, VER, T);
      } else if (et.id === 'porco') {
        const f = uu, p = CAM.ovos.at(f), q = P(p[0], p[1]);
        rastro(R, X, CAM.ovos, f, OVO);
        for (let i = 0; i < 3; i++) { const g = cl(f - i * .04, 0, 1), pp = CAM.ovos.at(g), qq = P(pp[0], pp[1]); ovoT(X, qq[0] + i * s * .6, qq[1] - i * s * .4, Math.max(2.5, s * .6), g < .97 ? 1 : 0); }
        brilho(X, q[0], q[1], L * 1.2, OVO, .35);
        const bo = P(36, 51); if (f > .9) pulso(X, bo[0], bo[1], s * 3, INT, T);
      } else if (et.id === 'cist') {
        const f = uu, p = CAM.musc.at(f), q = P(p[0], p[1]);
        rastro(R, X, CAM.musc, f, CIS);
        if (f < .97) { brilho(X, q[0], q[1], L, CIS, .45); cisto(X, q[0], q[1], Math.max(3, s * .7), 1); }
        CISTOS.forEach(([x, y], i) => { const a = sst(.55 + i * .06, .7 + i * .06, v.u) + (RED ? 1 : 0), c = P(x, y); if (a > 0) { brilho(X, c[0], c[1], s * 2.4, '#FFFFFF', .35 * Math.min(1, a)); pulso(X, c[0], c[1], s * 1.6, CIS, T + i * .3, 2); } });
      } else if (et.id === 'come') {
        const f = uu, p = CAM.come.at(f), q = P(p[0], p[1]);
        rastro(R, X, CAM.come, f, CIS);
        brilho(X, q[0], q[1], L * 1.2, CIS, .5); cisto(X, q[0], q[1], Math.max(3.5, s * .8), 1);
        if (f > .9) pulso(X, sc[0], sc[1], s * 3, AMB, T);
      } else if (et.id === 'tenia') {
        // a tênia cresce: as proglotes acendem do escólex para o fim
        const g = uu;
        for (let i = 0; i <= 24; i++) { const f = i / 24; if (f > g) break; const p = CAM.tenia.at(f), q = P(p[0], p[1]); dot(X, q[0], q[1], Math.max(1.6, s * (.35 + f * .35)), AMB, .45 * (1 - f * .4)); }
        brilho(X, sc[0], sc[1], s * 4, AMB, .45); pulso(X, sc[0], sc[1], s * 2.5, AMB, T);
      }
    } else if (R.vista === 'c') {
      if (v.d === 0 && et.id === 'veia') {
        const f = sst(0, .6, v.u) * (RED ? 0 : 1) + (RED ? 1 : 0), p = CAM.veia.at(f), q = P(p[0], p[1]), vc = P(49.5, 41), fg = P(44.5, 34.5);
        rastro(R, X, CAM.veia, f, MIR);
        if (f < .99) { brilho(X, q[0], q[1], L * 1.4, VER, .55); casal(X, q[0], q[1], p[2], L, T, 1); }
        else {
          const k = sst(.6, .8, v.u) + (RED ? 1 : 0);
          brilho(X, vc[0], vc[1], s * 7, DEF, .3 * Math.min(1, k));
          [[48, 40.5, .3], [51.5, 42.5, -.5], [49, 44, 2.6]].forEach(([x, y, a], i) => { const c = P(x, y); casal(X, c[0], c[1], a + (RED ? 0 : Math.sin(T + i) * .15), L * 1.4, T + i, Math.min(1, k)); });
          // ovos: uns vão ao fígado (inflamam), outros atravessam a parede do intestino
          for (let i = 0; i < 6; i++) { const u = RED ? (i + .5) / 6 : fr(T * .25 + i / 6), alvo = i % 2 ? fg : P(52, 47); ovoS(X, lerp(vc[0], alvo[0], u), lerp(vc[1], alvo[1], u), .4, L * .45, Math.sin(PI * u) * Math.min(1, k)); }
          brilho(X, fg[0], fg[1], s * 6, '#E9A27A', .35 * Math.min(1, k));
        }
        const pe = P(40.5, 55); pulso(X, pe[0], pe[1], s * 3, MIR, T, 2);
      } else if (v.d === 1 && et.id === 'cisc') {
        const f = sst(0, .5, v.u) * (RED ? 0 : 1) + (RED ? 1 : 0), p = CAM.boca.at(f), q = P(p[0], p[1]), it = P(50, 42);
        rastro(R, X, CAM.boca, f, OVO);
        if (f < .99) { brilho(X, q[0], q[1], L, OVO, .45); ovoT(X, q[0], q[1], Math.max(3, s * .7), 1); }
        else ALVOS.forEach(([x, y], i) => {
          const a = P(x, y), k = RED ? 1 : sst(.5 + i * .06, .75 + i * .06, v.u);
          if (k < 1) dot(X, lerp(it[0], a[0], k), lerp(it[1], a[1], k), Math.max(2, s * .45), CIS, .9);
          if (k > .9) { cisto(X, a[0], a[1], Math.max(4.5, s * 1.3), 1); pulso(X, a[0], a[1], s * 2.4, i === 0 ? AMB : CIS, T + i * .4); }
        });
      }
    }
  }

  // ---------- painel: medidor de hospedeiro atual, forma do verme e prevenção ----------
  function txt(X, s, x, y, o = {}) { X.font = `${o.w || 600} ${o.s || 13}px ${FT}`; X.fillStyle = o.c || TXT; X.textAlign = o.a || 'left'; X.textBaseline = 'middle'; X.fillText(s, x, y); }
  function quebra(X, s, w, o) { X.font = `${o.w || 500} ${o.s || 13}px ${FT}`; const L = []; let l = ''; s.split(' ').forEach(p => { const n = l ? l + ' ' + p : p; if (X.measureText(n).width > w && l) { L.push(l); l = p; } else l = n; }); if (l) L.push(l); return L; }
  function bloco(X, s, x, y, w, o, seco) { const L = quebra(X, s, w, o), lh = o.lh || 18; if (!seco) L.forEach((l, i) => txt(X, l, x, y + i * lh, o)); return L.length * lh; }
  const HN = [['Definitivo', DEF], ['Fora do corpo', FORA], ['Intermediário', INT]];
  // três casas: o marcador desliza até o hospedeiro em que o verme está agora
  function medidor(X, x, y, w, hp, comp) {
    txt(X, 'Hospedeiro atual', x, y + 8, { s: comp ? 13 : 14 });
    const by = y + (comp ? 22 : 26), bh = comp ? 26 : 30, gap = 4, cw = (w - gap * 2) / 3, ia = Math.round(hp);
    HN.forEach(([n, c], i) => {
      const bx = x + i * (cw + gap), on = i === ia;
      X.fillStyle = on ? rgba(c, .22) : 'rgba(255,255,255,.06)'; X.beginPath(); X.roundRect(bx, by, cw, bh, 8); X.fill();
      if (on) { X.strokeStyle = c; X.lineWidth = 1.5; X.stroke(); }
      txt(X, n, bx + cw / 2, by + bh / 2 + .5, { s: comp ? 12 : 12, c: on ? TXT : DIM, a: 'center', w: on ? 700 : 500 });
    });
    const mx = x + hp * (cw + gap) + cw / 2; X.beginPath(); X.moveTo(mx, by - 2); X.lineTo(mx - 6, by - 9); X.lineTo(mx + 6, by - 9); X.closePath(); X.fillStyle = TXT; X.fill();
    return by + bh - y;
  }
  function conteudo(X, x, y, w, v, seco) {
    const dz = DZ[v.d], et = etapa(v), ha = hAtual(v); let yy = y;
    if (ha) {
      const hm = seco ? 56 : medidor(X, x, yy, w, v.hp, false); yy += hm + 18;
      if (!seco) txt(X, 'Onde está o verme', x, yy, { s: 12, c: DIM, w: 500 }); yy += 18;
      yy += bloco(X, ha.quem, x, yy, w, { s: 14, lh: 18, c: HN[ha.i][1] }, seco) + 8;
      if (!seco) txt(X, 'Forma', x, yy, { s: 12, c: DIM, w: 500 }); yy += 18;
      yy += bloco(X, et.forma, x, yy, w, { s: 14, lh: 18 }, seco) + 8;
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
      const x0 = 24, w = 300, y0 = 60, px = x0 + 18, pw = w - 36, cy = y0 + 10 + NAVH + 18;
      const h = NAVH + 46 + conteudo(X, px, cy, pw, v, true);
      X.fillStyle = 'rgba(11,15,28,.78)'; X.beginPath(); X.roundRect(x0, y0, w, h, 14); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
      posNav(x0 + 10, y0 + 10, w - 20);
      conteudo(X, px, cy, pw, v, false);
    } else {
      const x0 = NAR ? 6 : 24, w = W - 2 * x0, h = faixaH(), y0 = H - capRes() - h - 4;
      X.fillStyle = 'rgba(11,15,28,.82)'; X.beginPath(); X.roundRect(x0, y0, w, h, 12); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
      posNav(x0 + 6, y0 + 6, w - 12);
      const px = x0 + 12, pw = w - 24;
      if (hAtual(v)) medidor(X, px, y0 + NAVH + 14, pw, v.hp, true);
      else txt(X, 'Como prevenir: veja a legenda abaixo', px, y0 + NAVH + 34, { s: 13, c: OK });
    }
  }

  // ---------- registro: figura padrão com a cena antiga (rodas de bolinhas) atrás de "Ver esquema" ----------
  const amb = {
    SC, X: () => X, W: () => W, H: () => H, nar: () => NAR, tela: cv.parentNode,
    cap: () => { const S = Sx; cap(S && S.vg ? etapa(S.vg).cap : ''); },
    t: a => a[0], rot3d: 'Ver esquema', dica3d: '',
    esconder: ['.hud.onde'], esconderFig: ['.palco .ctl', '#extra']
  };
  LAB_FIGALT.cena(amb, K, {
    pref: 'plantas-animais', nome: 'Viagem dos vermes: esquistossomose, teníase e cisticercose', mask: false,
    vistas: [
      ['a', 'vermes-v5a', 'Lagoa', 'Lagoa de água doce com caramujos presos às plantas debaixo da água, pessoa com as pernas na água e casa sem saneamento com esgoto caindo na água'],
      ['b', 'vermes-v5b', 'Porco e tênia', 'Porco, carne de porco crua com cisticercos brancos e intestino delgado aberto com a tênia longa, o escólex preso à mucosa'],
      ['c', 'vermes-corpo', 'Corpo', 'Corpo humano translúcido: pele, veias do intestino, fígado, músculos e cérebro', [.12, 0, .76, .58]]
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
