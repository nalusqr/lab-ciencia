/* LAB Ecologia: mais três viagens sobre figuras de IA, no padrão de anatomia/cenas-figura-digestorio.js (Martin).
   Usa o motor de cenas-figura-ciclos.js (window.LAB_ECO_VG): painel com etapas (anterior, pausar, próxima, "Etapa N de M"),
   elemento que anda numa curva suave sobre a figura, forma que troca na etapa certa, pontos tocáveis que levam a viagem
   até a etapa e cena antiga atrás de "Ver em 3D" ou "Ver esquema" (LAB_FIGALT). Com prefers-reduced-motion nada anda sozinho.
   ciclos/agua            a gota: evaporação no mar, nuvem, chuva na serra, escoamento no rio, infiltração, lençol freático,
                          raiz e transpiração da floresta, nova chuva e rio de volta ao mar; medidor de estado físico.
   impactos/magnificacao  o DDT: lavoura, água, plâncton (na lente), lambari, traíra e águia-pescadora; medidor de concentração
                          em ppm, em escala logarítmica, com valores de ordem de grandeza ilustrativa.
   impactos/chuva         o SO₂ (com o NOₓ ao lado): usina, fumaça, nuvem, ácidos, chuva sobre a floresta e o lago; medidor de pH.
                          Substitui o bloco antigo de impactos/chuva em cenas-figura-v2.js.
   Carregar depois de cenas-figura-ciclos.js. Texto na tela: sem "!", sem setas ou pontos como separador. */
'use strict';
(function () {
  const E = window.LAB_ECO, VG = window.LAB_ECO_VG;
  if (!E || !VG || !window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const { viagem, FORMA, bola, mol, brilho, txt, pastilha } = VG;
  const RED = LAB_FIGALT.RED, PI = Math.PI, TAU = PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
  const sst = (a, b, x) => { const u = cl((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
  const hash = (i, k) => { const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s); };
  const TXT = '#E8EDF7', DIM = '#9DA9C4', VERDE = '#7BE0A0', VERM = '#FF7A7A', AMB = '#FFB347';
  const AC = '#8A93A6', AO = '#E0605C', AN = '#5B8CFF', AH = '#E8EDF7', AS = '#F2D04A', ACL = '#7BD87B';   // C, O, N, H, S, Cl
  const fmt = (v, d) => v.toFixed(d).replace('.', ',');
  const ciclo = (t, vel, i, n) => RED ? (i + .5) / n : (t * vel + i / n) % 1;

  // ---------- formas novas ----------
  function gota(X, x, y, s, cor, a, dentro) {   // gota em pé: ponta em cima, bojo embaixo
    X.save(); X.globalAlpha *= a == null ? 1 : a;
    X.beginPath(); X.moveTo(x, y - s * 1.55);
    X.bezierCurveTo(x + s * .35, y - s * .9, x + s, y - s * .35, x + s, y + s * .2);
    X.arc(x, y + s * .2, s, 0, PI);
    X.bezierCurveTo(x - s, y - s * .35, x - s * .35, y - s * .9, x, y - s * 1.55); X.closePath();
    const g = X.createRadialGradient(x - s * .35, y - s * .1, s * .1, x, y + s * .2, s * 1.3); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.35, cor); g.addColorStop(1, rgba(cor, .75));
    X.fillStyle = g; X.fill(); X.strokeStyle = 'rgba(11,15,28,.7)'; X.lineWidth = 1; X.stroke();
    if (dentro) dentro(X, x, y + s * .25, s);
    X.restore();
  }
  const h2o = (X, x, y, s, rot, a) => mol(X, x, y, s, [[0, -.25, .7, AO], [-.95, .45, .42, AH], [.95, .45, .42, AH]], [[0, 1], [0, 2]], rot, a);
  function gordura(X, x, y, s, n, t, a) {   // gota de gordura com moléculas de DDT (pontos magenta): mais pontos, mais concentração
    X.save(); X.globalAlpha *= a == null ? 1 : a;
    X.beginPath(); X.ellipse(x, y, s * 1.7, s * 1.3, 0, 0, TAU);
    const g = X.createRadialGradient(x - s * .5, y - s * .5, s * .2, x, y, s * 1.8); g.addColorStop(0, '#FFF6CC'); g.addColorStop(.5, '#F2D27A'); g.addColorStop(1, 'rgba(214,170,70,.85)');
    X.fillStyle = g; X.fill(); X.strokeStyle = 'rgba(11,15,28,.7)'; X.lineWidth = 1; X.stroke();
    for (let i = 0; i < n; i++) { const an = i * 2.39 + t * .4, d = Math.sqrt((i + .5) / n) * s * 1.05; X.beginPath(); X.arc(x + Math.cos(an) * d * 1.25, y + Math.sin(an) * d * .95, Math.max(1.3, s * .2), 0, TAU); X.fillStyle = '#D946EF'; X.fill(); }
    X.restore();
  }
  const DDTC = '#E879F9';
  function ddt(X, x, y, s, t, a) {   // dois anéis com cloro e o grupo CCl₃ no meio
    const r = .75;
    [[-1.15, .35], [1.15, .35]].forEach(([dx, dy], k) => {
      const cx = x + dx * s, cy = y + dy * s;
      X.save(); X.globalAlpha *= a == null ? 1 : a; X.beginPath();
      for (let i = 0; i < 6; i++) { const an = -PI / 2 + i * TAU / 6, px = cx + Math.cos(an) * r * s, py = cy + Math.sin(an) * r * s; i ? X.lineTo(px, py) : X.moveTo(px, py); }
      X.closePath(); X.strokeStyle = 'rgba(232,237,247,.85)'; X.lineWidth = Math.max(1, s * .16); X.stroke();
      X.beginPath(); X.moveTo(cx + (k ? .9 : -.9) * s * .7, cy + s * .45); X.lineTo(cx + (k ? 1.5 : -1.5) * s, cy + s * .95); X.stroke(); X.restore();
      bola(X, cx + (k ? 1.5 : -1.5) * s, cy + s * .95, s * .36, ACL, a);
    });
    X.save(); X.globalAlpha *= a == null ? 1 : a; X.strokeStyle = 'rgba(232,237,247,.85)'; X.lineWidth = Math.max(1, s * .16);
    X.beginPath(); X.moveTo(x - .5 * s, y + .05 * s); X.lineTo(x, y - .45 * s); X.lineTo(x + .5 * s, y + .05 * s); X.moveTo(x, y - .45 * s); X.lineTo(x, y - 1.15 * s); X.stroke(); X.restore();
    bola(X, x, y - .45 * s, s * .34, AC, a);
    [[-.7, -1.5], [0, -1.75], [.7, -1.5]].forEach(q => bola(X, x + q[0] * s, y + q[1] * s, s * .34, ACL, a));
  }
  Object.assign(FORMA, {
    // água
    vapor: { n: 'vapor de água', d: 'moléculas soltas no ar, invisíveis', g: (X, x, y, s, t, a) => { brilho(X, x, y, s * 2.4, '#CFE6FF', (a == null ? 1 : a) * .45); h2o(X, x - s * .9, y + s * .5, s * .6, Math.sin(t) * .5, a); h2o(X, x + s * .9, y - s * .5, s * .6, Math.cos(t * .8) * .5 + 1, a); } },
    gotic: { n: 'gotículas', d: 'vapor condensado: a nuvem', g: (X, x, y, s, t, a) => { [[-.9, .2], [.1, -.5], [.9, .3], [0, .7]].forEach((q, i) => bola(X, x + q[0] * s * 1.1 + Math.sin(t * 2 + i) * s * .08, y + q[1] * s * 1.1, s * .45, '#9FD4FF', a)); } },
    gota: { n: 'água líquida', d: 'gota de chuva, de rio ou do mar', g: (X, x, y, s, t, a) => gota(X, x, y, s * .95, '#5BB8F5', a) },
    subt: { n: 'água no solo', d: 'enche os poros entre os grãos', g: (X, x, y, s, t, a) => { [[-1, .6], [1, .6], [0, -.9]].forEach(q => bola(X, x + q[0] * s * 1.15, y + q[1] * s, s * .5, '#A27B52', a)); gota(X, x, y + s * .2, s * .62, '#4FA6E8', a); } },
    seiva: { n: 'água na planta', d: 'sobe da raiz às folhas pelo xilema', g: (X, x, y, s, t, a) => gota(X, x, y, s * .95, '#6FD3B0', a) },
    // magnificação
    ddt: { n: 'DDT', d: 'inseticida que quase não se degrada', g: (X, x, y, s, t, a) => ddt(X, x, y, s * .8, t, a) },
    ddta: { n: 'DDT na água', d: 'muito diluído, quase não se mede', g: (X, x, y, s, t, a) => { gota(X, x, y, s * 1.1, '#5BB8F5', (a == null ? 1 : a) * .9); X.save(); X.globalAlpha *= a == null ? 1 : a; X.beginPath(); X.arc(x, y + s * .3, s * .3, 0, TAU); X.fillStyle = '#D946EF'; X.fill(); X.restore(); } },
    g1: { n: 'DDT no plâncton', d: 'guardado na gordura, não sai do corpo', g: (X, x, y, s, t, a) => gordura(X, x, y, s, 3, t, a) },
    g2: { n: 'DDT no lambari', d: 'cada lambari comeu muito plâncton', g: (X, x, y, s, t, a) => gordura(X, x, y, s, 7, t, a) },
    g3: { n: 'DDT na traíra', d: 'cada traíra comeu muitos lambaris', g: (X, x, y, s, t, a) => gordura(X, x, y, s, 13, t, a) },
    g4: { n: 'DDT na águia', d: 'topo da cadeia: a maior concentração', g: (X, x, y, s, t, a) => gordura(X, x, y, s, 22, t, a) },
    // chuva ácida
    comb: { n: 'carvão e óleo', d: 'combustível fóssil com um pouco de enxofre', g: (X, x, y, s, t, a) => { const P = [-1.9, -1, 0, 1, 1.9].map((dx, i) => [x + dx * s, y + (i % 2 ? -.45 : .45) * s]); X.save(); X.globalAlpha *= a == null ? 1 : a; X.strokeStyle = 'rgba(232,237,247,.7)'; X.lineWidth = Math.max(1, s * .14); X.beginPath(); P.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1])); X.stroke(); X.restore(); P.forEach((p, i) => bola(X, p[0], p[1], s * .4, i === 2 ? AS : '#3A3F4C', a)); } },
    so2: { n: 'SO₂', d: 'dióxido de enxofre, gás da queima', g: (X, x, y, s, t, a) => mol(X, x, y, s, [[0, -.25, .78, AS], [-1.1, .5, .6, AO], [1.1, .5, .6, AO]], [[0, 1, 2], [0, 2, 2]], Math.sin(t * .8) * .25, a) },
    nox: { n: 'NO₂', d: 'dióxido de nitrogênio, um dos NOₓ', g: (X, x, y, s, t, a) => mol(X, x, y, s, [[0, -.25, .72, AN], [-1.05, .5, .6, AO], [1.05, .5, .6, AO]], [[0, 1, 2], [0, 2]], Math.sin(t * .7) * .25, a) },
    so3: { n: 'SO₃', d: 'trióxido de enxofre: o SO₂ ganhou um oxigênio', g: (X, x, y, s, t, a) => mol(X, x, y, s, [[0, 0, .78, AS], [0, -1.2, .6, AO], [1.05, .6, .6, AO], [-1.05, .6, .6, AO]], [[0, 1, 2], [0, 2, 2], [0, 3, 2]], t * .25, a) },
    h2so4: { n: 'H₂SO₄', d: 'ácido sulfúrico, dissolvido na gota', g: (X, x, y, s, t, a) => { brilho(X, x, y, s * 2.6, '#9FD4FF', (a == null ? 1 : a) * .35); mol(X, x, y, s * .85, [[0, 0, .78, AS], [0, -1.2, .58, AO], [0, 1.2, .58, AO], [1.2, 0, .58, AO], [-1.2, 0, .58, AO], [2, -.5, .38, AH], [-2, .5, .38, AH]], [[0, 1, 2], [0, 2, 2], [0, 3], [0, 4], [3, 5], [4, 6]], t * .2, a); } },
    hno3: { n: 'HNO₃', d: 'ácido nítrico', g: (X, x, y, s, t, a) => mol(X, x, y, s, [[0, 0, .72, AN], [0, -1.15, .58, AO], [1.05, .6, .58, AO], [-1.05, .6, .58, AO], [-1.9, .2, .36, AH]], [[0, 1, 2], [0, 2], [0, 3], [3, 4]], t * .2, a) },
    acida: { n: 'gota ácida', d: 'chuva com pH abaixo de 5,6', g: (X, x, y, s, t, a) => gota(X, x, y, s * 1.05, '#C9E46A', a, (X2, gx, gy, gs) => { X2.font = `700 ${Math.max(8, gs * .9)}px system-ui, sans-serif`; X2.fillStyle = '#2A3A10'; X2.textAlign = 'center'; X2.textBaseline = 'middle'; X2.fillText('H⁺', gx, gy); }) },
    ions: { n: 'íons H⁺', d: 'deixam o lago e o solo ácidos', g: (X, x, y, s, t, a) => { [[-1, -.6], [1, -.5], [0, .8]].forEach((q, i) => { const px = x + q[0] * s * 1.1 + Math.sin(t * 2 + i) * s * .1, py = y + q[1] * s * 1.1; bola(X, px, py, s * .5, '#FF9A9A', a); X.save(); X.globalAlpha *= a == null ? 1 : a; X.font = `700 ${Math.max(8, s * .7)}px system-ui, sans-serif`; X.fillStyle = '#3A0E0E'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText('+', px, py + .5); X.restore(); }); } }
  });
  const forma = (et, u) => { let f = et.f[0][1]; et.f.forEach(q => { if (u >= q[0]) f = q[1]; }); return f; };

  // =====================================================================================
  // CICLO DA ÁGUA
  // =====================================================================================
  const ESTADO = { vapor: 2, gotic: 1, gota: 1, subt: 1, seiva: 1 };
  const NOME_E = [['sólido', '#CFE6FF'], ['líquido', '#5BB8F5'], ['gasoso', '#E8EDF7']];
  viagem({
    K: 'ciclos/agua', pref: 'ecologia', nome: 'Ciclo da água: a viagem da gota', cor: '#5BB8F5', rotForma: 'A gota agora',
    rotNav: 'Viagem da gota de água: etapas',
    vistas: [['a', 'ciclos-agua-v5a', 'Paisagem', 'Mar com vapor subindo, nuvens, floresta, rio e serra com chuva, e o solo em corte com raízes e lençol freático']],
    hs: [
      { id: 'amr', c: '#5BB8F5', t: 'Mar', d: 'Cerca de 97% da água da Terra está nos oceanos. O Sol aquece a superfície e a água evapora; o sal fica no mar, e por isso a chuva é doce.', em: { a: [14, 66] }, z: 2.2 },
      { id: 'avp', c: '#CFE6FF', t: 'Vapor subindo', d: 'A energia do Sol é o motor do ciclo: faz a água evaporar. O vapor é invisível; a névoa que se vê já é água condensada em gotinhas.', em: { a: [11, 40] }, z: 2.4 },
      { id: 'anu', c: '#E8EDF7', t: 'Nuvem', d: 'O vapor sobe, esfria e se condensa em gotículas em volta de grãos de poeira. Bilhões de gotículas formam a nuvem.', em: { a: [27, 21] }, z: 2.6 },
      { id: 'anc', c: '#9FD4FF', t: 'Nuvem de chuva', d: 'As gotículas se juntam e ficam pesadas demais para flutuar: caem como chuva, neve ou granizo. É a precipitação.', em: { a: [82, 8] }, z: 2.4 },
      { id: 'ase', c: '#C9B59A', t: 'Serra', d: 'O vento empurra o ar úmido encosta acima; o ar esfria e chove mais do lado da serra voltado para o mar. É a chuva de relevo, ou orográfica.', em: { a: [72, 33] }, z: 2.4 },
      { id: 'ane', c: '#FFFFFF', t: 'Neve nos picos', d: 'No alto faz frio, e a água fica sólida, como neve e gelo. Ao derreter (fusão), alimenta nascentes e rios.', em: { a: [85.5, 19] }, z: 2.8 },
      { id: 'ari', c: '#5BB8F5', t: 'Rio', d: 'Parte da chuva escorre pela superfície até os rios: é o escoamento superficial. Sem vegetação, ele aumenta e traz erosão, assoreamento e enchentes.', em: { a: [68, 48] }, z: 2.8 },
      { id: 'afl', c: '#7BE0A0', t: 'Floresta', d: 'As árvores devolvem ao ar, pela transpiração, a água que tiram do solo. Na Amazônia, essa umidade forma os rios voadores, que levam chuva para o Centro-Oeste, o Sudeste e o Sul.', em: { a: [50, 42] }, z: 2.4 },
      { id: 'ain', c: '#A27B52', t: 'Infiltração', d: 'Parte da chuva penetra no solo pelos poros. Folhas caídas e raízes deixam o solo mais permeável; asfalto e solo compactado impedem a infiltração.', em: { a: [88, 73] }, z: 2.8 },
      { id: 'ara', c: '#C99A6A', t: 'Raízes', d: 'As raízes absorvem a água do solo. Ela sobe pelo xilema até as folhas e sai pelos estômatos como vapor: é a transpiração.', em: { a: [73, 75] }, z: 3 },
      { id: 'alf', c: '#4FA6E8', t: 'Lençol freático', d: 'Água que se acumula no subsolo, entre grãos de areia e fendas das rochas. Brota em nascentes, abastece rios e poços. Desmatar e impermeabilizar diminuem a recarga.', em: { a: [52, 89] }, z: 2.6 }
    ],
    VAI: { amr: 0, avp: 0, anu: 1, anc: 2, ase: 2, ane: 2, ari: 3, ain: 4, alf: 5, ara: 6, afl: 6 },
    ET: [
      { id: 'evap', nome: 'Evaporação no mar', vista: 'a', P: [[19, 62], [20, 55], [21.5, 48], [23, 41], [24.5, 34], [26, 28]], dur: 6, f: [[0, 'gota'], [.28, 'vapor']], proc: 'Evaporação', pc: '#CFE6FF',
        cap: 'A gota começa no <b>mar</b>. A energia do <b>Sol</b> aquece a água, e as moléculas da superfície escapam para o ar como <b>vapor</b>: é a <b>evaporação</b>, a passagem do estado líquido para o gasoso. O sal fica no mar.' },
      { id: 'nuvem', nome: 'Nuvem', vista: 'a', P: [[26, 28], [27, 23], [33, 18], [43, 14], [55, 11], [66, 9.5], [76, 9.5], [83, 12]], dur: 8, f: [[0, 'vapor'], [.14, 'gotic']], proc: 'Condensação', pc: '#E8EDF7',
        cap: 'O vapor sobe, <b>esfria</b> e volta ao estado líquido em gotículas: é a <b>condensação</b>, que forma as <b>nuvens</b>. O vento leva a nuvem do mar para o continente.' },
      { id: 'chuva', nome: 'Chuva na serra', vista: 'a', P: [[83, 12], [83.6, 18], [84.2, 24], [84.6, 30], [84.4, 35.5]], dur: 5, f: [[0, 'gotic'], [.2, 'gota']], proc: 'Precipitação', pc: '#9FD4FF',
        cap: 'Na <b>serra</b>, o ar úmido sobe a encosta e esfria ainda mais. As gotículas se juntam, ficam pesadas e caem: é a <b>precipitação</b>. Nos picos frios, a água cai e fica como neve, no estado sólido.' },
      { id: 'escoa', nome: 'Escoamento no rio', vista: 'a', P: [[84.4, 35.5], [81, 37.5], [78, 39.5], [75, 42], [71.5, 44.5], [68.5, 47], [68, 50], [69.5, 53]], dur: 6, f: [[0, 'gota']], proc: 'Escoamento superficial', pc: '#5BB8F5',
        cap: 'Parte da chuva <b>escorre</b> pela encosta e entra no <b>rio</b>: é o <b>escoamento superficial</b>. Onde a encosta perdeu a mata, a água desce mais rápido e leva terra, causando erosão e assoreamento.' },
      { id: 'infil', nome: 'Infiltração', vista: 'a', P: [[69.5, 53], [74, 57], [79, 61], [84, 65], [87, 68.5], [87.6, 73], [87.8, 77], [87.6, 80.6]], dur: 7, f: [[0, 'gota'], [.55, 'subt']], proc: 'Infiltração', pc: '#A27B52',
        cap: 'Outra parte da água <b>infiltra</b>: penetra no solo da floresta pelos poros entre os grãos. As folhas caídas e as raízes seguram a água e ajudam a infiltração.' },
      { id: 'lencol', nome: 'Lençol freático', vista: 'a', P: [[87.6, 80.6], [84, 81.2], [80, 81.8], [76.5, 82.3], [74.5, 81.6]], dur: 6, f: [[0, 'subt']], proc: 'Água subterrânea', pc: '#4FA6E8',
        cap: 'A água chega ao <b>lençol freático</b>, a camada do subsolo encharcada de água. Ela anda devagar entre os grãos e as fendas das rochas e brota nas <b>nascentes</b>, que abastecem os rios e os poços.' },
      { id: 'transp', nome: 'Raiz e transpiração', vista: 'a', P: [[74.5, 81.6], [74.6, 77], [74.6, 72], [74.6, 66], [74.4, 60], [74.2, 54], [73.6, 48], [72.6, 42], [71.4, 35], [70, 28]], dur: 8, f: [[0, 'subt'], [.12, 'seiva'], [.72, 'vapor']], proc: 'Transpiração', pc: '#7BE0A0',
        cap: 'A <b>raiz</b> da árvore absorve a água, que sobe pelo <b>xilema</b> até as folhas. Pelos <b>estômatos</b>, ela sai como vapor: é a <b>transpiração</b>. Evaporação mais transpiração formam a <b>evapotranspiração</b>.' },
      { id: 'volta', nome: 'Rio de volta ao mar', vista: 'a', P: [[70, 28], [69, 36], [68.5, 44], [69.2, 51], [68.5, 56], [65.5, 59], [61, 61.5], [56, 64.5], [50, 66.5], [43, 67.8], [37, 67.6], [31.5, 66.2], [25, 63.5]], dur: 10, f: [[0, 'vapor'], [.1, 'gotic'], [.2, 'gota']], proc: 'Volta ao mar', pc: '#5BB8F5',
        cap: 'O vapor da floresta forma novas nuvens e volta a chover. A gota cai no <b>rio</b>, que também recebe a água das nascentes, e corre até o <b>mar</b>. O ciclo se fecha, sempre movido pela energia do Sol.' }
    ],
    alvo(e, u) { return ESTADO[forma(this.ET[e], u)]; },
    medidor(X, x, y, w, comp, c) {
      const f = forma(c.et, RED ? 1 : c.u), mv = c.v.mv, n = NOME_E.length, gap = w / (n - 1);
      txt(X, 'Estado físico', x, y + 6, { s: comp ? 13 : 15 });
      const k = Math.round(cl(mv, 0, 2)); txt(X, NOME_E[ESTADO[f]][0], x + w, y + 6, { s: 12, c: NOME_E[ESTADO[f]][1], a: 'right', w: 700 });
      const ty = y + (comp ? 30 : 36);
      const g = X.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, 'rgba(207,230,255,.5)'); g.addColorStop(.5, 'rgba(91,184,245,.6)'); g.addColorStop(1, 'rgba(232,237,247,.35)');
      X.strokeStyle = g; X.lineWidth = 4; X.lineCap = 'round'; X.beginPath(); X.moveTo(x, ty); X.lineTo(x + w, ty); X.stroke();
      NOME_E.forEach(([rot, cor], i) => {
        const on = i === k, cx = x + i * gap;
        X.beginPath(); X.arc(cx, ty, on ? 7 : 4.5, 0, TAU); X.fillStyle = on ? cor : '#2A3352'; X.fill(); if (on) { X.strokeStyle = TXT; X.lineWidth = 1.5; X.stroke(); }
        txt(X, rot, cx, ty + (comp ? 16 : 18), { s: comp ? 11 : 12, c: on ? TXT : DIM, a: i === 0 ? 'left' : i === n - 1 ? 'right' : 'center', w: on ? 700 : 500 });
      });
      const mx = x + cl(mv, 0, 2) * gap; X.beginPath(); X.moveTo(mx, ty - 9); X.lineTo(mx - 5, ty - 15); X.lineTo(mx + 5, ty - 15); X.closePath(); X.fillStyle = TXT; X.fill();
      if (!comp) txt(X, c.et.id === 'chuva' ? 'Nos picos, a neve é água no estado sólido' : 'A agulha mostra o estado da água na gota', x, y + 74, { s: 11, c: DIM, w: 500 });
    },
    fundo(X, R, t, c) {
      const e = c.v.e, s = cl(R.s * .55, 3, 5.6);
      // vapor saindo do mar o tempo todo; mais forte na evaporação
      for (let i = 0; i < 9; i++) { const u = ciclo(t, .12, i, 9), x0 = 6 + hash(i, 3) * 26, p = R.pt(x0 + Math.sin(u * 5 + i) * 1.2, lerp(52, 30, u)); h2o(X, p[0], p[1], s * .55, t + i, Math.sin(PI * u) * (e === 0 ? .85 : .35)); }
      // chuva caindo da nuvem da serra (forte na precipitação)
      const nch = e === 2 ? 16 : 7;
      for (let i = 0; i < nch; i++) { const u = ciclo(t, .7, i, nch) , x = 80 + hash(i, 5) * 19, a = R.pt(x - u * 1.2, lerp(14, 36, u)); X.save(); X.globalAlpha = (e === 2 ? .8 : .35) * (1 - u * .4); X.strokeStyle = '#BFE2FF'; X.lineWidth = 1.6; X.lineCap = 'round'; X.beginPath(); X.moveTo(a[0], a[1]); X.lineTo(a[0] - 1.5, a[1] + R.s * 1.6); X.stroke(); X.restore(); }
      // infiltração: gotas descendo no solo
      if (e === 4 || e === 5) for (let i = 0; i < 6; i++) { const u = ciclo(t, .22, i, 6), x = [44, 70, 87, 91, 95, 80][i], p = R.pt(x, lerp(i < 2 ? 76 : 68, i < 2 ? 85 : 79, u)); gota(X, p[0], p[1], s * .55, '#4FA6E8', Math.sin(PI * u) * .85); }
      // lençol freático: correnteza lenta para a esquerda
      if (e === 5) for (let i = 0; i < 10; i++) { const u = ciclo(t, .06, i, 10), x = lerp(98, 22, u), y = lerp(81, 97, u * u * .9) + (hash(i, 7) - .5) * 2.4, p = R.pt(x, y); X.beginPath(); X.arc(p[0], p[1], s * .45, 0, TAU); X.fillStyle = 'rgba(160,215,255,.75)'; X.fill(); }
      // transpiração: vapor saindo das copas
      if (e === 6 || e === 7) [[74, 46], [62, 38], [52, 34], [44, 40], [82, 46], [90, 42]].forEach((q, i) => { for (let k = 0; k < 2; k++) { const u = ciclo(t, .2, k + i * .37, 2), p = R.pt(q[0] + Math.sin(u * 6 + i) * 1, q[1] - u * 12); h2o(X, p[0], p[1], s * .5, t + i, Math.sin(PI * u) * (e === 6 ? .85 : .4)); } });
      // água do rio correndo para o mar
      if (e === 3 || e === 7) { const RIO = [[80, 38], [75, 42], [69, 47], [69.5, 53], [65.5, 59], [58, 63.5], [48, 67], [38, 67.8], [30, 66]]; for (let i = 0; i < 10; i++) { const u = ciclo(t, .1, i, 10), k = u * (RIO.length - 1), j = Math.min(RIO.length - 2, Math.floor(k)), f = k - j, p = R.pt(lerp(RIO[j][0], RIO[j + 1][0], f), lerp(RIO[j][1], RIO[j + 1][1], f)); brilho(X, p[0], p[1], s * 1.6, '#9FD4FF', .55 * Math.sin(PI * u)); } }
      if (e === 5) { const p = R.pt(40, 93); pastilha(X, p[0], p[1], 'lençol freático', '#4FA6E8', { c: 1 }); }
    }
  });

  // =====================================================================================
  // MAGNIFICAÇÃO TRÓFICA
  // =====================================================================================
  const AGUA_PPM = .000003;
  const VEZES = { 2: 'cerca de 13 mil vezes a da água', 3: 'cerca de 170 mil vezes a da água', 4: 'cerca de 670 mil vezes a da água', 5: 'cerca de 8 milhões de vezes a da água' };
  const NIV = [['água', AGUA_PPM], ['plâncton', .04], ['lambari', .5], ['traíra', 2], ['águia', 25]];
  const LAMB = [[35.5, 51.5], [42.5, 51], [44.5, 54.5], [38.5, 57.5], [40, 61.5], [45, 60.5], [50.5, 57.5], [52, 65.5], [44.5, 68], [39.5, 66]];
  const PLANC = [[14, 61], [19, 60], [19.5, 67], [12, 71], [10.5, 79], [17.5, 77], [21, 84], [24, 73], [26, 64], [25.5, 79]];
  const lppm = v => Math.log10(v);
  viagem({
    K: 'impactos/magnificacao', pref: 'ecologia', nome: 'Magnificação trófica: a viagem do DDT', cor: DDTC, rotForma: 'O DDT agora',
    rotNav: 'Viagem do DDT pela cadeia alimentar: etapas',
    vistas: [['a', 'magnificacao-v5a', 'Lago', 'Lavoura com cano que escoa para um lago; lente com plâncton, lambaris, traíra comendo um lambari e águia-pescadora mergulhando']],
    hs: [
      { id: 'mla', c: '#A9C54A', t: 'Lavoura', d: 'O DDT foi muito usado contra insetos de lavouras e contra o mosquito da malária. Hoje é proibido no Brasil e na maior parte do mundo, mas ainda persiste no ambiente.', em: { a: [14, 22] }, z: 2.2 },
      { id: 'mca', c: '#9AA3B2', t: 'Cano de escoamento', d: 'A chuva lava o solo da lavoura e leva os resíduos de agrotóxico para rios e lagos. Mata ciliar na margem ajuda a reter parte deles.', em: { a: [28.5, 34] }, z: 3 },
      { id: 'mag', c: '#5BB8F5', t: 'Água do lago', d: 'Na água, o DDT fica muito diluído: cerca de 0,000003 ppm. Por isso o perigo não está na água, e sim no acúmulo nos seres vivos.', em: { a: [60, 40] }, z: 2.2 },
      { id: 'mpl', c: '#7BE0A0', t: 'Plâncton', d: 'Algas microscópicas e pequenos animais, como os copépodes. O DDT é lipossolúvel: entra nas células e fica guardado na gordura, sem ser eliminado. É a bioacumulação.', em: { a: [18, 70] }, z: 2.4 },
      { id: 'mlb', c: '#E8EDF7', t: 'Lambaris', d: 'Consumidores primários e secundários: comem plâncton. Cada lambari come uma enorme quantidade dele ao longo da vida e acumula o DDT de todos.', em: { a: [45, 60] }, z: 2.6 },
      { id: 'mtr', c: '#C9A27A', t: 'Traíra', d: 'Peixe carnívoro que come lambaris. Recebe o DDT acumulado em cada lambari que come, e a concentração no seu corpo fica ainda maior.', em: { a: [72, 60] }, z: 2.6 },
      { id: 'mav', c: '#F28B8B', t: 'Águia-pescadora', d: 'Predador de topo: come peixes grandes. Tem a maior concentração de DDT. Nessas aves, o DDT deixa a casca do ovo fina, e os ovos quebram no ninho.', em: { a: [78, 27] }, z: 2.4 }
    ],
    VAI: { mla: 0, mca: 1, mag: 1, mpl: 2, mlb: 3, mtr: 4, mav: 5 },
    ET: [
      { id: 'lav', nome: 'Lavoura', vista: 'a', P: [[8, 18], [13, 22], [18, 26], [23, 30], [27.5, 33.6]], dur: 5, f: [[0, 'ddt']], ppm: null, proc: 'Pulverização', pc: '#A9C54A',
        cap: 'A viagem começa na <b>lavoura</b>, onde o inseticida <b>DDT</b> é pulverizado. Ele é <b>pouco biodegradável</b>: pode durar anos no solo e na água sem se decompor.' },
      { id: 'agua', nome: 'Água', vista: 'a', P: [[27.5, 33.6], [30, 35], [31.5, 38], [33, 42], [35.5, 46.5], [38, 51]], dur: 6, f: [[0, 'ddt'], [.55, 'ddta']], ppm: AGUA_PPM, proc: 'Escoamento', pc: '#5BB8F5',
        cap: 'A chuva lava o solo e o cano leva o DDT para o <b>lago</b>. Na água ele fica muito diluído, em cerca de <b>0,000003 ppm</b> (partes por milhão). Os valores desta viagem são uma ordem de grandeza ilustrativa.' },
      { id: 'planc', nome: 'Plâncton', vista: 'a', P: [[38, 51], [36, 55], [32, 59], [27, 63], [22.5, 65.5], [19.5, 66.5]], dur: 6, f: [[0, 'ddta'], [.7, 'g1']], ppm: .04, proc: 'Bioacumulação', pc: '#7BE0A0',
        cap: 'O <b>plâncton</b> absorve o DDT. Como ele é <b>lipossolúvel</b>, fica guardado na gordura e não é eliminado: é a <b>bioacumulação</b>. A concentração já é milhares de vezes a da água.' },
      { id: 'lamb', nome: 'Peixe pequeno', vista: 'a', P: [[19.5, 66.5], [25, 64], [31, 61.5], [37, 59.5], [42, 59.5], [45, 60.5]], dur: 6, f: [[0, 'g1'], [.75, 'g2']], ppm: .5, proc: 'Magnificação', pc: '#E8EDF7',
        cap: 'O <b>lambari</b> come plâncton o tempo todo. O DDT de cada organismo comido se soma no corpo do peixe: a concentração sobe de um nível trófico para o seguinte. É a <b>magnificação trófica</b>.' },
      { id: 'trai', nome: 'Peixe grande', vista: 'a', P: [[45, 60.5], [50, 62], [55, 63.5], [59, 64.5], [62.5, 64.5], [67, 62], [71, 60]], dur: 6, f: [[0, 'g2'], [.6, 'g3']], ppm: 2, proc: 'Magnificação', pc: '#C9A27A',
        cap: 'A <b>traíra</b> come muitos lambaris e acumula o DDT de todos eles. A energia diminui a cada nível da cadeia, mas a concentração do veneno <b>aumenta</b>.' },
      { id: 'ave', nome: 'Ave pescadora', vista: 'a', P: [[71, 60], [73.5, 55], [75.5, 49], [76.5, 44], [77, 39], [77.5, 33]], dur: 6, f: [[0, 'g3'], [.6, 'g4']], ppm: 25, proc: 'Topo da cadeia', pc: '#F28B8B',
        cap: 'A <b>águia-pescadora</b>, no <b>topo da cadeia</b>, tem a maior concentração: milhões de vezes a da água. O DDT afina a casca dos ovos, e a população dessas aves despencou até ele ser proibido.' }
    ],
    alvo(e) { const p = this.ET[e].ppm; return p == null ? -6.5 : lppm(p); },
    medidor(X, x, y, w, comp, c) {
      const et = c.et, lo = -6, hi = 2;
      txt(X, comp ? 'DDT no corpo' : 'Concentração de DDT', x, y + 6, { s: comp ? 13 : 15 });
      txt(X, et.ppm == null ? 'ainda na lavoura' : 'cerca de ' + (et.ppm < .001 ? '0,000003' : fmt(et.ppm, et.ppm < .1 ? 2 : et.ppm < 1 ? 1 : 0)) + ' ppm', x + w, y + 6, { s: 12, c: et.ppm == null ? DIM : et.ppm > 1 ? VERM : et.ppm > .01 ? AMB : DIM, a: 'right', w: 600 });
      // colunas por nível, com altura em escala logarítmica: cada nível acende quando o DDT chega nele
      const n = NIV.length, gap = w / n, cw = Math.min(30, gap - 12), b0 = y + (comp ? 36 : 40), hmax = comp ? 20 : 26;
      X.fillStyle = 'rgba(255,255,255,.12)'; X.fillRect(x, b0, w, 1);
      NIV.forEach(([rot, v], i) => {
        const cx = x + gap * (i + .5), hh = Math.max(3, hmax * (lppm(v) - lo) / (hi - lo)), on = c.v.e - 1 >= i, cur = c.v.e - 1 === i;
        const k = cur && !RED ? sst(0, .5, c.u) : 1;
        X.fillStyle = on ? rgba(i >= 3 ? '#E0405C' : i >= 1 ? '#C25AC0' : '#5B8CC8', .35 + .6 * k) : 'rgba(255,255,255,.08)';
        X.beginPath(); X.roundRect(cx - cw / 2, b0 - hh * (on ? k : 1), cw, hh * (on ? k : 1), [3, 3, 0, 0]); X.fill();
        if (cur) { X.strokeStyle = TXT; X.lineWidth = 1.5; X.stroke(); }
        if (cur || !comp || (i === 0 && c.v.e < 2)) txt(X, rot, cx, b0 + 9, { s: 11, c: cur ? TXT : on ? DIM : 'rgba(157,169,196,.55)', w: cur ? 700 : 500, a: 'center' });
      });
      const vz = VEZES[c.v.e] || (c.v.e === 1 ? 'a referência: o DDT diluído na água' : 'aplicado na plantação');
      txt(X, vz, x, b0 + (comp ? 22 : 24), { s: comp ? 11 : 12, c: c.v.e >= 2 ? AMB : DIM, w: 600 });
      if (!comp) txt(X, 'valores de ordem de grandeza ilustrativa', x, b0 + 39, { s: 10.5, c: DIM, w: 500 });
    },
    fundo(X, R, t, c) {
      const e = c.v.e, s = cl(R.s * .5, 2.6, 5);
      const ponto = (p, r, a) => { X.beginPath(); X.arc(p[0], p[1], r, 0, TAU); X.fillStyle = rgba('#D946EF', a); X.fill(); X.strokeStyle = rgba('#FFFFFF', a * .6); X.lineWidth = .8; X.stroke(); };
      // pulverização sobre a lavoura
      if (e === 0) for (let i = 0; i < 12; i++) { const u = ciclo(t, .3, i, 12), p = R.pt(3 + hash(i, 1) * 24, lerp(8, 24, u) + hash(i, 2) * 6); ponto(p, s * .45, Math.sin(PI * u) * .8); }
      // DDT diluído na água: poucos pontos e sempre fracos
      if (e >= 1) for (let i = 0; i < 9; i++) { const p = R.pt(34 + hash(i, 3) * 58 + Math.sin(t * .3 + i) * 1.2, 34 + hash(i, 4) * 12); ponto(p, s * .3, .45); }
      if (e === 1) for (let i = 0; i < 6; i++) { const u = ciclo(t, .25, i, 6), p = R.pt(lerp(30, 34 + i * 2, u), lerp(36, 42 + i, u)); ponto(p, s * .4, Math.sin(PI * u) * .8); }
      // dentro dos seres: mais pontos em cada nível, e cada nível acende na etapa dele
      const nivel = (L, n, k, desde) => { if (e < desde) return; const a = e === desde ? sst(.3, .9, c.u) : 1; L.forEach((q, j) => { for (let i = 0; i < n; i++) { const an = i * 2.39 + j + (RED ? 0 : t * .5), d = (.3 + .7 * hash(i + j * 7, k)) * R.s * (n > 6 ? 2.2 : 1.2), p = R.pt(q[0], q[1]); ponto([p[0] + Math.cos(an) * d, p[1] + Math.sin(an) * d * .6], s * (n > 6 ? .36 : .3), .9 * a); } }); };
      nivel(PLANC, 1, 5, 2);
      nivel(LAMB, 2, 6, 3);
      nivel([[68, 59], [74, 58]], 6, 7, 4);
      nivel([[76, 28], [80, 31]], 12, 8, 5);
      // a traíra comendo lambaris; a águia mergulhando
      if (e === 4) { const p = R.pt(62, 64); for (let i = 0; i < 2; i++) { const u = ciclo(t, .5, i, 2); X.beginPath(); X.arc(p[0], p[1], R.s * (1.5 + 3 * u), 0, TAU); X.strokeStyle = `rgba(232,121,249,${.7 * (1 - u)})`; X.lineWidth = 2; X.stroke(); } }
      if (e === 3 && !c.nar) { const p = R.pt(44, 72); pastilha(X, p[0], p[1], 'cada lambari come muito plâncton', '#E8EDF7', { c: 1 }); }
      if (e === 4 && !c.nar) { const p = R.pt(66, 72); pastilha(X, p[0], p[1], 'a traíra come muitos lambaris', '#C9A27A', { c: 1 }); }
    }
  });

  // =====================================================================================
  // CHUVA ÁCIDA
  // =====================================================================================
  const CHAM = [[11.3, 45], [9, 53], [14.8, 52.5], [17.4, 53], [23.5, 56]];
  viagem({
    K: 'impactos/chuva', pref: 'ecologia', nome: 'Chuva ácida: a viagem do SO₂', cor: '#F2D04A', rotForma: 'O que viaja agora',
    rotNav: 'Viagem do dióxido de enxofre até a chuva ácida: etapas',
    vistas: [['a', 'impactos-chuva-a', 'Região industrial', 'Fábricas, nuvem de tempestade e floresta danificada pela chuva ácida, com lago ao lado']],
    hs: [
      { id: 'cch', c: '#FFA94D', t: 'Chaminés', d: 'A queima de carvão e de derivados de petróleo libera SO₂ e NOₓ na atmosfera. Filtros nas chaminés e combustíveis com menos enxofre reduzem a emissão.', em: { a: [11, 54] }, z: 2.6 },
      { id: 'cfu', c: '#9AA3B2', t: 'Fumaça', d: 'O vento leva os gases por centenas de quilômetros. Por isso a chuva ácida pode cair longe de onde a poluição foi produzida, até em outro país.', em: { a: [24, 31] }, z: 2.4 },
      { id: 'cnu', c: '#CFE0FF', t: 'Nuvem', d: 'Os gases reagem com o oxigênio e com a água e formam ácido sulfúrico (H₂SO₄) e ácido nítrico (HNO₃). A chuva fica com pH menor que 5,6.', em: { a: [59, 15] }, z: 2.4 },
      { id: 'cbu', c: '#C9E46A', t: 'Chuva ácida', d: 'A chuva normal já é levemente ácida, com pH perto de 5,6, por causa do CO₂ dissolvido. Chama-se chuva ácida a que fica abaixo disso.', em: { a: [54, 47] }, z: 2.6 },
      { id: 'cfl', c: '#F28B8B', t: 'Floresta danificada', d: 'A chuva ácida queima folhas e acidifica o solo, que perde cálcio, magnésio e potássio e libera alumínio tóxico. As árvores enfraquecem e morrem.', em: { a: [89, 42] }, z: 2.6 },
      { id: 'cvi', c: '#A9C54A', t: 'Árvores que resistem', d: 'Algumas árvores aguentam mais a acidez. Em áreas muito afetadas, a comunidade inteira muda.', em: { a: [63, 56] }, z: 2.8 },
      { id: 'cla', c: '#8FD8FF', t: 'Lago', d: 'Com pH baixo, peixes, anfíbios e outros seres aquáticos morrem. Rochas calcárias no fundo ajudam a neutralizar a acidez.', em: { a: [67, 84] }, z: 2.4 }
    ],
    VAI: { cch: 0, cfu: 1, cnu: 2, cbu: 4, cfl: 5, cvi: 5, cla: 6 },
    ET: [
      { id: 'usina', nome: 'Usina', vista: 'a', P: [[11, 68], [11.1, 62], [11.2, 56], [11.3, 50], [11.3, 45]], dur: 5, f: [[0, 'comb'], [.5, 'so2']], ph: 5.6, proc: 'Combustão', pc: '#FFA94D',
        cap: 'Carvão e derivados de petróleo têm um pouco de <b>enxofre</b>. Na <b>queima</b>, ele se une ao oxigênio e forma <b>SO₂</b>. O calor da combustão também junta o nitrogênio e o oxigênio do ar em <b>NOₓ</b>.' },
      { id: 'sobe', nome: 'Fumaça no vento', vista: 'a', P: [[11.3, 45], [13, 39], [17, 33], [23, 27], [30, 22], [38, 18]], dur: 6, f: [[0, 'so2']], ph: 5.6, proc: 'Transporte pelo vento', pc: '#9AA3B2',
        cap: 'Os gases saem pela <b>chaminé</b> e o <b>vento</b> os leva para longe, às vezes por centenas de quilômetros. Até aqui, a chuva continua normal, com pH perto de <b>5,6</b>.' },
      { id: 'nuvem', nome: 'Na nuvem', vista: 'a', P: [[38, 18], [43, 15.5], [49, 14], [55, 15]], dur: 6, f: [[0, 'so2'], [.5, 'so3']], ph: 5.4, proc: 'Oxidação', pc: '#CFE0FF',
        cap: 'Na <b>nuvem</b>, o SO₂ reage com o oxigênio e forma <b>SO₃</b> (2 SO₂ + O₂ formam 2 SO₃). O NO₂ também reage, com a água e o oxigênio.' },
      { id: 'acido', nome: 'Formação dos ácidos', vista: 'a', P: [[55, 15], [58, 18.5], [60, 22.5], [61, 27]], dur: 6, f: [[0, 'so3'], [.45, 'h2so4']], ph: 4.4, proc: 'Formação dos ácidos', pc: '#C9E46A',
        cap: 'O SO₃ se dissolve nas gotas da nuvem e forma <b>ácido sulfúrico</b> (SO₃ + H₂O formam H₂SO₄). O NO₂ forma <b>ácido nítrico</b> (HNO₃). O pH da água da nuvem cai.' },
      { id: 'chuva', nome: 'Chuva ácida', vista: 'a', P: [[61, 27], [64, 35], [67, 44], [70.5, 53], [74, 62], [77, 70]], dur: 6, f: [[0, 'acida']], ph: 4.3, proc: 'Precipitação ácida', pc: '#C9E46A',
        cap: 'As gotas caem como <b>chuva ácida</b>, com pH abaixo de 5,6. Aqui, cerca de <b>4,3</b>: mais de 10 vezes mais ácida que a chuva normal, porque cada ponto a menos de pH é 10 vezes mais ácido.' },
      { id: 'flor', nome: 'Floresta', vista: 'a', P: [[77, 70], [79, 72.5], [81.5, 74.5]], dur: 5, f: [[0, 'acida'], [.5, 'ions']], ph: 4.3, proc: 'Dano à floresta', pc: '#F28B8B', parado: 1,
        cap: 'Na <b>floresta</b>, a chuva ácida queima as folhas e <b>acidifica o solo</b>: os íons H⁺ tiram do solo cálcio, magnésio e potássio e liberam alumínio, tóxico para as raízes. As árvores secam.' },
      { id: 'lago', nome: 'Lago', vista: 'a', P: [[81.5, 74.5], [78, 77.5], [74, 80], [70, 82], [66, 84]], dur: 6, f: [[0, 'ions']], ph: 4.8, proc: 'Acidificação do lago', pc: '#8FD8FF',
        cap: 'A água escorre para o <b>lago</b> e o acidifica. Com pH abaixo de cerca de 5, muitos peixes e anfíbios não se reproduzem e morrem. A mesma chuva <b>corrói</b> metais e o mármore de monumentos.' }
    ],
    alvo(e) { return this.ET[e].ph; },
    medidor(X, x, y, w, comp, c) {
      const ph = c.v.mv, lo = 3, hi = 8, px = v => x + w * cl((v - lo) / (hi - lo), 0, 1), lago = c.et.id === 'lago';
      txt(X, comp ? 'pH' : lago ? 'pH do lago' : c.v.e <= 3 ? 'pH na nuvem' : 'pH da chuva', x, y + 6, { s: comp ? 13 : 15 });
      const st = ph > 5.5 ? ['normal', VERDE] : ph > 4.9 ? ['ácido', AMB] : ['muito ácido', VERM];
      txt(X, 'cerca de ' + fmt(c.et.ph, 1) + ', ' + st[0], x + w, y + 6, { s: 12, c: st[1], a: 'right', w: 600 });
      const by = y + (comp ? 22 : 26), bh = comp ? 8 : 10;
      const g = X.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, '#E0503C'); g.addColorStop(.32, '#E0A040'); g.addColorStop(.52, '#C9E46A'); g.addColorStop(.8, '#5FC46A'); g.addColorStop(1, '#4F8FD8');
      X.fillStyle = g; X.beginPath(); X.roundRect(x, by, w, bh, bh / 2); X.fill();
      [[3, '3'], [5.6, comp ? '5,6' : '5,6 chuva normal'], [7, '7 neutro']].forEach(([m, rot], i) => { const mx = px(m); X.fillStyle = 'rgba(232,237,247,.75)'; X.fillRect(mx - .5, by - 3, 1, bh + 6); txt(X, rot, mx, by + bh + 12, { s: 11, c: DIM, w: 500, a: i === 0 ? 'left' : 'center' }); });
      const nx = px(ph); X.beginPath(); X.moveTo(nx, by - 2); X.lineTo(nx - 6, by - 9); X.lineTo(nx + 6, by - 9); X.closePath(); X.fillStyle = TXT; X.fill(); X.fillRect(nx - 1, by - 2, 2, bh + 4);
      if (!comp) txt(X, 'quanto menor o pH, mais ácida a água', x, by + bh + 32, { s: 11, c: DIM, w: 500 });
    },
    fundo(X, R, t, c) {
      const e = c.v.e, s = cl(R.s * .55, 3, 5.6);
      // SO₂ e NO₂ saindo de todas as chaminés até a nuvem
      const nG = e <= 1 ? 14 : 8;
      for (let i = 0; i < nG; i++) {
        const u = ciclo(t, .07, i, nG), q = CHAM[i % CHAM.length], x = lerp(q[0], 34 + hash(i, 2) * 20, u), y = lerp(q[1], 14 + hash(i, 3) * 6, u) - Math.sin(u * PI) * 5, p = R.pt(x, y);
        (i % 2 ? FORMA.nox : FORMA.so2).g(X, p[0], p[1], s * .7, t + i, Math.sin(PI * u) * (e <= 1 ? .85 : .4));
      }
      // na nuvem: os ácidos se formam nas gotas
      if (e >= 2) { const a = e === 2 ? sst(.2, .9, c.u) * .5 : .85; for (let i = 0; i < 7; i++) { const p = R.pt(42 + hash(i, 6) * 40 + Math.sin(t * .3 + i) * 1, 8 + hash(i, 7) * 16); (i % 2 ? FORMA.hno3 : (e >= 3 ? FORMA.h2so4 : FORMA.so3)).g(X, p[0], p[1], s * .6, t + i, a); } }
      // chuva: normal (azulada) até a formação dos ácidos; depois, ácida (amarelo-esverdeada)
      const acida = e >= 3, nd = acida ? 22 : 10;
      for (let i = 0; i < nd; i++) {
        const u = ciclo(t, .55, i, nd), x = 42 + hash(i, 8) * 34 - u * 4, p = R.pt(x, lerp(32, 74, u));
        X.save(); X.globalAlpha = (1 - u * .3) * (acida ? .85 : .45); X.strokeStyle = acida ? '#D8EC7A' : '#BFE2FF'; X.lineWidth = 2; X.lineCap = 'round'; X.beginPath(); X.moveTo(p[0], p[1]); X.lineTo(p[0] - 2, p[1] + R.s * 1.8); X.stroke(); X.restore();
      }
      // floresta: folhas e solo atingidos
      if (e >= 5) { [[78, 40], [86, 30], [92, 50], [80, 60], [96, 35], [72, 52]].forEach((q, i) => { const p = R.pt(q[0], q[1]), u = ciclo(t, .35, i * .3, 1); X.beginPath(); X.arc(p[0], p[1], R.s * (1.2 + 2.2 * u), 0, TAU); X.strokeStyle = `rgba(242,139,139,${.7 * (1 - u) * (e === 5 ? 1 : .5)})`; X.lineWidth = 2; X.stroke(); }); }
      if (e === 5) { for (let i = 0; i < 6; i++) { const u = ciclo(t, .25, i, 6), p = R.pt(76 + hash(i, 9) * 14, lerp(72, 80, u)); FORMA.ions.g(X, p[0], p[1], s * .45, t + i, Math.sin(PI * u) * .9); } const p = R.pt(86, 88); pastilha(X, p[0], p[1], 'solo perde nutrientes', '#F28B8B', { c: 1 }); }
      // lago: íons H⁺ se espalham
      if (e === 6) { const k = sst(0, .8, c.u); for (let i = 0; i < 14; i++) { if (hash(i, 10) > k) continue; const p = R.pt(50 + hash(i, 11) * 40 + Math.sin(t * .4 + i) * 1, 78 + hash(i, 12) * 14); FORMA.ions.g(X, p[0], p[1], s * .4, t + i, .85); } }
    }
  });
})();
