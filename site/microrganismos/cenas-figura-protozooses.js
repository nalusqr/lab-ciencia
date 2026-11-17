/* LAB Microrganismos: "Protozooses" com figuras de IA realistas e a viagem do parasita por cima (Martin).
   Duas viagens num seletor: doença de Chagas (barbeiro pica, defeca, o tripanossomo entra pela ferida ou pelo olho,
   cai no sangue e se aloja no coração) e malária (Anopheles pica, esporozoítos vão ao fígado, merozoítos invadem
   as hemácias, que se rompem em ciclos com febre). Vista A: o corpo da rota monera/doencas (reaproveitado).
   Vista B (nova): sangue de perto, com hemácias com plasmódio, uma rompendo e tripanossomos com flagelo.
   O barbeiro e o Anopheles entram como vistas de apoio na etapa da picada. Medidor: parasitas no sangue.
   Tocar num ponto leva a viagem até a etapa dele. A cena antiga (roda da malária, casos, quadro) fica atrás de
   "Ver esquema" (LAB_FIGALT, figura-alterna.js). Com prefers-reduced-motion nada anda sozinho: etapas por botão.
   Carregar depois de cenas-figura.js e antes de LAB_MICRO_iniciar(). Texto na tela: sem "!", sem setas ou pontos como separador. */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const K = 'protoctista/protozooses', c3 = SC[K]; if (!c3) return;
  const RED = LAB_FIGALT.RED, PI = Math.PI, TAU = PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k, fr = v => v - Math.floor(v);
  const sst = (a, b, x) => { const u = cl((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const eIO = u => { u = cl(u, 0, 1); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
  const FT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const TRI = '#CDB8F7', PLA = '#A483EE', ESP = '#E4D2FF', FEZ = '#9A7448', SANG = '#E0605C', OK = '#7FD3A0', TXT = '#E8EDF7', DIM = '#9DA9C4', AMB = '#FFB347';
  const AR = { a: [.88, 1.324], b: [.88, .657], c: [.88, .657], d: [.88, .657] };   // proporção de cada figura, para medir distâncias de verdade

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
    X.save(); X.setLineDash([2, 5]); X.lineCap = 'round'; X.strokeStyle = rgba(cor, .6); X.lineWidth = 1.6; X.beginPath();
    let st = false; for (let i = 0; i < tr.AM.length && tr.LF[i] <= f; i++) { const s = R.pt(tr.AM[i][0], tr.AM[i][1]); if (!st) { X.moveTo(s[0], s[1]); st = true; } else X.lineTo(s[0], s[1]); }
    const p = tr.at(f), q = R.pt(p[0], p[1]); if (st) { X.lineTo(q[0], q[1]); X.stroke(); } X.restore();
  }

  // ---------- desenhos: pontinho, brilho, anel e os parasitas ----------
  function dot(X, x, y, r, c, a) { X.globalAlpha = cl(a == null ? 1 : a, 0, 1); X.beginPath(); X.arc(x, y, Math.max(.2, r), 0, TAU); X.fillStyle = c; X.fill(); X.globalAlpha = 1; }
  function brilho(X, x, y, r, cor, a) { if (a <= 0) return; const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(cor, a)); g.addColorStop(1, rgba(cor, 0)); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); }
  function anel(X, x, y, r, cor, a, lw) { if (a <= 0) return; X.save(); X.globalAlpha = cl(a, 0, 1); X.strokeStyle = cor; X.lineWidth = lw || 2; X.beginPath(); X.arc(x, y, r, 0, TAU); X.stroke(); X.restore(); }
  function pulso(X, x, y, r, cor, T, per) { if (RED) { anel(X, x, y, r * 1.3, cor, .7, 2); return; } const k = fr(T / (per || 1.6)); anel(X, x, y, r * (.6 + k * 1.4), cor, .85 * (1 - k), 2); }
  // tripanossomo: corpo em fita que ondula, membrana ondulante e o flagelo saindo da frente (a frente aponta para ang)
  function tripa(X, x, y, ang, L, T, a) {
    const n = 14, top = [], bot = [], ph = RED ? 0 : T * 6;
    X.save(); X.globalAlpha = cl(a == null ? 1 : a, 0, 1); X.translate(x, y); X.rotate(ang);
    for (let i = 0; i <= n; i++) { const s = -1 + 2 * i / n, px = s * L / 2, py = Math.sin(s * 2.2 + ph) * L * .1, w = L * .12 * Math.pow(Math.max(0, 1 - s * s), .6) + .4; top.push([px, py - w]); bot.push([px, py + w]); }
    X.beginPath(); top.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1])); for (let i = bot.length - 1; i >= 0; i--) X.lineTo(bot[i][0], bot[i][1]); X.closePath();
    X.fillStyle = rgba(TRI, .9); X.fill(); X.strokeStyle = 'rgba(40,24,80,.7)'; X.lineWidth = 1; X.stroke();
    const fy = Math.sin(2.2 + ph) * L * .1; X.beginPath(); X.moveTo(L / 2, fy);
    for (let j = 1; j <= 12; j++) { const q = j / 12; X.lineTo(L / 2 + q * L * .75, fy + Math.sin(q * 9 - (RED ? 0 : T * 11)) * L * .07 * q); }
    X.strokeStyle = rgba(TRI, .95); X.lineWidth = Math.max(1, L * .045); X.lineCap = 'round'; X.stroke();
    dot(X, -L * .05, Math.sin(-.1 * 2.2 + ph) * L * .1, L * .07, '#6A4FB8', X.globalAlpha);
    X.restore();
  }
  // esporozoíto: foice fina, sem flagelo
  function esporo(X, x, y, ang, L, a) {
    X.save(); X.globalAlpha = cl(a == null ? 1 : a, 0, 1); X.translate(x, y); X.rotate(ang);
    X.beginPath(); X.moveTo(-L / 2, 0); X.quadraticCurveTo(0, -L * .3, L / 2, 0); X.quadraticCurveTo(0, -L * .12, -L / 2, 0);
    X.fillStyle = ESP; X.fill(); X.strokeStyle = 'rgba(60,40,110,.8)'; X.lineWidth = 1; X.stroke(); X.restore();
  }
  function mero(X, x, y, r, a) {
    X.save(); X.globalAlpha = cl(a == null ? 1 : a, 0, 1); X.beginPath(); X.ellipse(x, y, r * 1.25, r, .4, 0, TAU); X.fillStyle = PLA; X.fill();
    X.strokeStyle = 'rgba(40,24,80,.8)'; X.lineWidth = 1; X.stroke(); X.beginPath(); X.arc(x - r * .3, y - r * .3, r * .3, 0, TAU); X.fillStyle = 'rgba(255,255,255,.6)'; X.fill(); X.restore();
  }
  function coracao(X, x, y, r, a) {   // brilho do coração batendo (o órgão fica atrás dos pulmões na figura)
    X.save(); X.globalAlpha = a; X.translate(x, y); X.scale(r, r); X.beginPath();
    X.moveTo(0, .35); X.bezierCurveTo(-.55, -.05, -.45, -.6, 0, -.32); X.bezierCurveTo(.45, -.6, .55, -.05, 0, .35);
    X.fillStyle = 'rgba(224,96,92,.55)'; X.fill(); X.lineWidth = .06; X.strokeStyle = 'rgba(255,200,190,.9)'; X.stroke(); X.restore();
  }

  // ---------- caminhos (conferidos sobre as figuras) ----------
  const CAM = {
    olho: trilha([[43, 11.5], [45.5, 9.4], [47.2, 8]], 'a'),
    cor: trilha([[47.2, 8], [47.8, 11.5], [48.5, 15.5], [49.5, 20], [51.5, 24.5], [53, 28.5]], 'a'),
    figado: trilha([[23.5, 49], [25.5, 45], [28, 40], [31, 32], [34, 24], [42, 21.5], [50, 25], [52.5, 28.5], [48.5, 31.5], [44.5, 33.5]], 'a'),
    tromba: trilha([[43, 55], [37, 61], [31, 68], [26.5, 74], [24.5, 77.5]], 'd'),
    nado: [trilha([[4, 40], [14, 44], [24, 42], [34, 46], [44, 44], [56, 40], [66, 36], [78, 38], [96, 36]], 'b'),
      trilha([[96, 64], [84, 62], [72, 66], [62, 60], [50, 58], [38, 60], [28, 56], [16, 58], [4, 56]], 'b'),
      trilha([[30, 88], [36, 80], [46, 76], [56, 72], [64, 78], [72, 86], [80, 90]], 'b')]
  };
  const INF = [[16.5, 33.5], [18.5, 70], [36.7, 74], [79.5, 26], [58.8, 51]];          // hemácias com plasmódio na vista B
  const ROMPE = [62, 46], NUVEM = [71, 44];                                               // hemácia que se rompe e os merozoítos soltos

  // ---------- etapas ----------
  const DZ = [
    { id: 'chagas', nome: 'Doença de Chagas', curto: 'Chagas', cor: TRI,
      nota: 'Hoje, no Brasil, a maior parte dos casos novos vem da boca: açaí ou caldo de cana com barbeiro moído. Também passa por transfusão e da mãe para o bebê.',
      prev: ['Casa de alvenaria com reboco, sem frestas para o barbeiro', 'Inseticida e aviso ao posto de saúde quando achar o inseto', 'Higiene no preparo do açaí e do caldo de cana', 'Exame do sangue doado e da gestante'],
      ET: [
        { id: 'pica', nome: 'O barbeiro pica', v: 'c', dur: 5, med: 0, onde: 'No intestino do barbeiro', forma: 'Tripanossomo com flagelo',
          cap: 'O <b>barbeiro</b> (<i>Triatoma</i>) suga sangue à noite, muitas vezes no rosto de quem dorme. Ele vive nas frestas da casa de pau a pique.' },
        { id: 'defeca', nome: 'Fezes na picada', v: 'c', dur: 5, med: 0, onde: 'Nas fezes do barbeiro', forma: 'Tripanossomo com flagelo',
          cap: 'Enquanto suga, o barbeiro <b>defeca</b> perto da picada. O <i>Trypanosoma cruzi</i> está nas <b>fezes</b>, não na saliva.' },
        { id: 'entra', nome: 'Entra pela ferida', v: 'a', dur: 5, med: .12, onde: 'Na ferida da picada ou no olho', forma: 'Tripanossomo com flagelo',
          cap: 'Ao coçar, a pessoa leva as fezes para a <b>ferida</b> da picada ou para a <b>mucosa</b> do olho, e o tripanossomo entra no corpo.' },
        { id: 'sangue', nome: 'Cai no sangue', v: 'b', dur: 7, med: .85, onde: 'Nadando no sangue', forma: 'Tripanossomo com flagelo',
          cap: 'O tripanossomo cai no <b>sangue</b> e nada com o <b>flagelo</b> entre as hemácias. É a fase aguda, com febre e muitos parasitas no sangue.' },
        { id: 'coracao', nome: 'No coração', v: 'a', dur: 7, med: .18, onde: 'No músculo do coração', forma: 'Ninhos sem flagelo dentro das células',
          cap: 'Ele invade o <b>músculo do coração</b>, perde o flagelo e se multiplica em ninhos. Anos depois, o coração pode crescer e falhar: é a fase crônica.' },
        { id: 'prev', nome: 'Como prevenir', v: 'c', dur: 8, med: null,
          cap: 'Prevenção: <b>casa de alvenaria</b> com reboco, controle do barbeiro, higiene no preparo do <b>açaí</b> e do caldo de cana e exame do sangue doado.' }
      ] },
    { id: 'malaria', nome: 'Malária', curto: 'Malária', cor: PLA,
      nota: 'O ciclo sexuado acontece no mosquito: ele é o hospedeiro definitivo, e o ser humano, o intermediário.',
      prev: ['Mosquiteiro e telas nas janelas', 'Repelente e roupa comprida ao entardecer', 'Evitar a beira de rios e lagos no fim da tarde', 'Diagnóstico e tratamento rápidos, para o mosquito não se infectar'],
      ET: [
        { id: 'pica', nome: 'O mosquito pica', v: 'd', dur: 6, med: 0, onde: 'Na saliva do mosquito', forma: 'Esporozoíto',
          cap: 'A <b>fêmea</b> do mosquito <i>Anopheles</i> pica ao entardecer e à noite e, com a saliva, injeta os <b>esporozoítos</b> do <i>Plasmodium</i>.' },
        { id: 'figado', nome: 'No fígado', v: 'a', dur: 7, med: 0, onde: 'Nas células do fígado', forma: 'Esporozoíto que se multiplica',
          cap: 'Pelo sangue, os esporozoítos chegam ao <b>fígado</b>, entram nas células e se multiplicam por dias, ainda sem sintomas.' },
        { id: 'hemacias', nome: 'Nas hemácias', v: 'b', dur: 7, med: .45, onde: 'Dentro das hemácias', forma: 'Merozoíto',
          cap: 'As células do fígado se rompem e soltam <b>merozoítos</b>, que invadem as <b>hemácias</b> e se multiplicam dentro delas.' },
        { id: 'febre', nome: 'Febre em ciclos', v: 'b', dur: 10, med: 'ciclo', onde: 'Saindo das hemácias rompidas', forma: 'Merozoíto',
          cap: 'Muitas hemácias se <b>rompem juntas</b>, a cada 48 ou 72 horas, e soltam merozoítos e toxinas: vem o pico de <b>febre</b> com calafrio, em ciclos.' },
        { id: 'prev', nome: 'Como prevenir', v: 'd', dur: 8, med: null,
          cap: 'Prevenção: <b>mosquiteiro</b> e telas, repelente, evitar a beira de rios ao entardecer e diagnóstico e tratamento rápidos dos doentes.' }
      ] }
  ];

  // ---------- pontos da figura (função em nível ENEM); tocar leva a viagem até a etapa ----------
  const HS = [
    { id: 'olho', c: TRI, t: 'Olho e ferida: porta do T. cruzi', d: 'As fezes do barbeiro levadas ao olho ou à ferida da picada deixam o tripanossomo entrar. O olho pode inchar de um lado só.', em: { a: [44, 11.5] }, z: 3.4 },
    { id: 'cor', c: SANG, t: 'Coração', d: 'Na fase crônica, o T. cruzi vive em ninhos no músculo do coração. Anos depois, o coração pode crescer e falhar.', em: { a: [57, 27] }, z: 3 },
    { id: 'fig', c: '#C9705E', t: 'Fígado', d: 'Na malária, os esporozoítos se multiplicam primeiro nas células do fígado, sem sintomas. Depois saem como merozoítos.', em: { a: [41, 35] }, z: 3 },
    { id: 'braco', c: PLA, t: 'Picada do Anopheles', d: 'A fêmea injeta a saliva com esporozoítos ao picar. O macho não pica: suga néctar.', em: { a: [23.5, 49] }, z: 3.2 },
    { id: 'hpl', c: PLA, t: 'Hemácia com plasmódio', d: 'O merozoíto entra na hemácia e se multiplica dentro dela, consumindo a hemoglobina.', em: { b: [16.5, 33.5] }, z: 2.6 },
    { id: 'romp', c: AMB, t: 'Hemácia se rompendo', d: 'Muitas hemácias se rompem ao mesmo tempo e soltam merozoítos e toxinas: é o pico de febre, com calafrio. A perda de hemácias causa anemia.', em: { b: [62, 46] }, z: 2.6 },
    { id: 'mero', c: ESP, t: 'Merozoítos soltos', d: 'Cada merozoíto solto invade uma hemácia nova, e o ciclo recomeça a cada 48 ou 72 horas.', em: { b: [72, 40] }, z: 2.8 },
    { id: 'tri', c: TRI, t: 'Tripanossomo', d: 'O Trypanosoma cruzi nada no sangue com o flagelo, na fase aguda. O exame de sangue no microscópio mostra o parasita.', em: { b: [24, 48] }, z: 2.6 },
    { id: 'cab', c: '#F28B8B', t: 'Cabeça do barbeiro', d: 'O barbeiro é um inseto hematófago. A tromba fina perfura a pele para sugar sangue, em geral à noite.', em: { c: [41, 46] }, z: 2.8 },
    { id: 'con', c: '#FFA94D', t: 'Bordas do abdome listradas', d: 'Faixas alaranjadas e escuras no contorno do abdome ajudam a reconhecer o Triatoma. Ele tem seis patas, como todo inseto.', em: { c: [70, 44] }, z: 2.6 },
    { id: 'fez', c: '#FFD43B', t: 'Fezes com T. cruzi', d: 'O barbeiro costuma defecar logo depois de picar. O protozoário vai nas fezes e entra pela ferida ou pelas mucosas.', em: { c: [79, 60] }, z: 2.6 },
    { id: 'par', c: '#A9C54A', t: 'Casa de pau a pique', d: 'Frestas na parede de barro abrigam o barbeiro durante o dia. Reboco, telhado e casa de alvenaria eliminam o abrigo.', em: { c: [24, 74] }, z: 2.4 },
    { id: 'abd', c: '#F28B8B', t: 'Abdome inclinado', d: 'O Anopheles pousa com o abdome erguido, em ângulo com a superfície. O Aedes e o Culex pousam com o corpo paralelo.', em: { d: [80, 26] }, z: 2.6 },
    { id: 'pal', c: '#8FD8FF', t: 'Cabeça, palpos e tromba', d: 'Os palpos são longos, quase do tamanho da tromba. A fêmea suga sangue ao entardecer e à noite.', em: { d: [40, 56] }, z: 2.8 },
    { id: 'pla', c: '#FFD43B', t: 'Fêmea e o Plasmodium', d: 'Só a fêmea pica e transmite o Plasmodium. A larva do Anopheles se cria em água limpa e quase parada, como a de lagoas e remansos de rios.', em: { d: [54, 38] }, z: 2.6 }
  ];
  const VAI = { olho: [0, 2], cor: [0, 4], tri: [0, 3], cab: [0, 0], fez: [0, 1], con: [0, 0], par: [0, 5], fig: [1, 1], braco: [1, 0], hpl: [1, 2], romp: [1, 3], mero: [1, 3], abd: [1, 0], pal: [1, 0], pla: [1, 0] };

  // ---------- estado da viagem (em S.vg) ----------
  const novo = () => ({ d: 0, e: 0, u: RED ? 1 : 0, hold: 0, pausa: false, mv: 0, ini: true });
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
  function ciclo(T) { return RED ? .82 : fr(T / 4); }          // malária: 4 s na tela valem um ciclo de 48 horas
  function medAlvo(v, T) {
    const m = etapa(v).med;
    if (m === 'ciclo') { const k = ciclo(T); return .5 + .42 * sst(0, .7, k) - .1 * sst(.92, 1, k); }
    if (m === null) return 0;
    if (v.d === 0 && v.e === 4) return lerp(.85, m, sst(.2, .8, v.u));
    if (v.d === 1 && v.e === 2) return m * sst(.1, .9, v.u);
    return m;
  }

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
.pv-nav .dz button{flex:1;min-width:0;height:40px;padding:0 8px;border-radius:9px;border:1px solid transparent;background:transparent;font:inherit;font-size:14px;font-weight:600;color:var(--dim,#9DA9C4);cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:background-color 120ms,color 120ms,border-color 120ms}
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
    NAV = document.createElement('div'); NAV.className = 'pv-nav'; NAV.hidden = true; NAV.setAttribute('role', 'group'); NAV.setAttribute('aria-label', 'Viagem do parasita: doença e etapas');
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
  const capRes = () => NAR ? 116 : 76, faixaH = () => NAVH + 62;
  const reserva = () => compacto() ? capRes() + faixaH() + 8 : 56;

  // ---------- camada sobre a figura ----------
  function sobre(R, X, t, c) {
    const S = c.S; if (!S || !S.vg) return; Sx = S; vivo = performance.now();
    const ab = FIG && FIG.aberto ? FIG.aberto.id : null;
    if (ab !== ultAb) { ultAb = ab; const q = ab && VAI[ab]; if (q && (q[0] !== S.vg.d || q[1] !== S.vg.e)) irPara(S, q[0], q[1], false); }
    avancar(S, S.dt || 0);
    const v = S.vg, et = etapa(v), T = RED ? 2.2 : t, uu = RED ? .7 : eIO(v.u), s = R.s, P = (x, y) => R.pt(x, y);
    v.mv = RED ? medAlvo(v, T) : v.mv + (medAlvo(v, T) - v.mv) * Math.min(1, (S.dt || 0) * 3);
    Rfig = R;
    const L = cl(s * (R.vista === 'a' ? 6.5 : 4.2), 20, 52);
    if (et.id === 'prev') { R.veu(.22); return; }
    if (R.vista === 'a') {
      if (v.d === 0 && et.id === 'entra') {
        const e = P(47.2, 8); brilho(X, e[0], e[1], s * 6, FEZ, .7); X.save(); X.globalAlpha = .8; X.beginPath(); X.ellipse(e[0] - s * 2.4, e[1] + s * 1.6, s * 1.6, s * .9, .5, 0, TAU); X.fillStyle = FEZ; X.fill(); X.restore();
        for (let i = 0; i < 4; i++) { const f = RED ? (i + 1) / 5 : fr(T * .22 + i / 4) * uu + (1 - uu) * 0, p = CAM.olho.at(f), q = P(p[0], p[1]); tripa(X, q[0], q[1], p[2], L * .8, T + i, Math.min(1, Math.sin(PI * cl(f, 0, 1)) * 1.6)); }
        pulso(X, e[0], e[1], s * 3, TRI, T);
      } else if (v.d === 0 && et.id === 'coracao') {
        const f = uu, p = CAM.cor.at(f), q = P(p[0], p[1]), h = P(53, 28.5);
        rastro(R, X, CAM.cor, f, TRI);
        const bate = RED ? 1 : 1 + .08 * Math.pow(Math.sin(T * PI * 1.2), 8);
        coracao(X, h[0], h[1], s * 10 * bate * (1 + .15 * sst(.6, 1, v.u)), .55 + .45 * sst(.6, 1, f));
        // ninhos: grupos de parasitas sem flagelo dentro das células do coração
        const nn = Math.floor(sst(.75, 1, f) * 5 + (RED ? 5 : 0));
        for (let i = 0; i < Math.min(5, nn); i++) { const a = i * 2.4, cx = h[0] + Math.cos(a) * s * 2.2, cy = h[1] + Math.sin(a) * s * 1.6; for (let k = 0; k < 5; k++) dot(X, cx + Math.cos(k * 1.26) * s * .6, cy + Math.sin(k * 1.26) * s * .6, Math.max(1.8, s * .38), TRI, .95); }
        if (f < .98) { brilho(X, q[0], q[1], L * 1.2, TRI, .45); tripa(X, q[0], q[1], p[2], L * .8, T, 1); }
        else pulso(X, h[0], h[1], s * 5, SANG, T, 1);
      } else if (v.d === 1 && et.id === 'figado') {
        const f = uu, p = CAM.figado.at(f), q = P(p[0], p[1]), fg = P(44.5, 33.5), b = P(23.5, 49);
        rastro(R, X, CAM.figado, f, ESP); anel(X, b[0], b[1], s * 1.6, PLA, .7, 1.5);
        brilho(X, fg[0], fg[1], s * 8, '#E9A27A', .3 + .45 * sst(.8, 1, f));
        const nn = Math.floor(sst(.75, 1, v.u) * 14 + (RED ? 14 : 0));
        for (let i = 0; i < Math.min(14, nn); i++) { const a = i * 2.39, r = s * (.8 + (i % 4) * .9); mero(X, fg[0] + Math.cos(a) * r * 1.3, fg[1] + Math.sin(a) * r * .8, Math.max(2.2, s * .5), .95); }
        if (f < .98) { brilho(X, q[0], q[1], L * 1.2, ESP, .7); esporo(X, q[0], q[1], p[2], L * .9, 1); }
      } else if (v.d === 1 && et.id === 'pica') {
        const b = P(23.5, 49); pulso(X, b[0], b[1], s * 3, PLA, T);
      } else if (v.d === 0 && (et.id === 'pica' || et.id === 'defeca')) {
        const e = P(47.2, 8); pulso(X, e[0], e[1], s * 3, TRI, T);
      }
    } else if (R.vista === 'b') {
      if (v.d === 0) {
        // tripanossomos nadando entre as hemácias; mais deles quando a etapa é a do sangue
        const n = et.id === 'sangue' ? 3 : 1, k = et.id === 'sangue' ? sst(0, .3, v.u) + (RED ? 1 : 0) : .5;
        for (let i = 0; i < n; i++) { const f = RED ? [.3, .55, .5][i] : fr(T * .05 + i * .37), p = CAM.nado[i].at(f), q = P(p[0], p[1]); tripa(X, q[0], q[1], p[2], cl(s * 9, 26, 80), T + i * 1.3, cl(k, 0, 1) * Math.min(1, Math.sin(PI * f) * 3)); }
        if (et.id === 'sangue') [[24, 48], [46.7, 32], [45, 62.5], [76.7, 62.5]].forEach(([x, y], i) => { const q = P(x, y); pulso(X, q[0], q[1], s * 6, TRI, T + i * .4, 2); });
      } else {
        const r = Math.max(2, s * .7);
        if (et.id === 'hemacias') {
          // merozoítos chegam do fígado e entram nas hemácias
          INF.forEach(([x, y], i) => {
            const q = P(x, y), o = P(-2, 40 + i * 9), f = RED ? 1 : sst(i * .12, i * .12 + .4, v.u);
            if (f < 1) mero(X, lerp(o[0], q[0], f), lerp(o[1], q[1], f), r, Math.min(1, f * 4));
            pulso(X, q[0], q[1], s * 5, PLA, T + i * .3, 2);
          });
        } else if (et.id === 'febre') {
          // a hemácia incha e se rompe; os merozoítos voam para hemácias novas
          const k = ciclo(T), q = P(ROMPE[0], ROMPE[1]), nv = P(NUVEM[0], NUVEM[1]);
          brilho(X, q[0], q[1], s * (7 + 4 * sst(0, .7, k)), AMB, .12 + .4 * sst(.4, .7, k) * (1 - sst(.75, 1, k)));
          if (k > .7) { const e = (k - .7) / .3; anel(X, q[0], q[1], s * (5 + e * 14), AMB, (1 - e) * .9, 3); }
          const alvos = [[79.5, 26], [88, 40], [83, 58], [70, 70], [53, 66], [40, 32]];
          alvos.forEach(([x, y], i) => {
            const a = P(x, y), e = RED ? .6 : sst(.72, 1, k), b = e * (1 + i * .02);
            mero(X, lerp(nv[0], a[0], cl(b, 0, 1)), lerp(nv[1], a[1], cl(b, 0, 1)), r, k > .7 || RED ? 1 : 0);
          });
        } else INF.forEach(([x, y], i) => { const q = P(x, y); anel(X, q[0], q[1], s * 4, PLA, .35, 1.2); });
      }
    } else if (R.vista === 'c') {
      if (et.id === 'pica') {
        const tp = P(37, 47.5), h = P(42, 46.5);
        for (let i = 0; i < 5; i++) { const f = RED ? (i + .5) / 5 : fr(T * .6 + i / 5); dot(X, lerp(tp[0], h[0], f), lerp(tp[1], h[1], f), Math.max(1.6, s * .35), SANG, Math.sin(PI * f)); }
        pulso(X, tp[0], tp[1], s * 3, SANG, T);
      } else if (et.id === 'defeca') {
        const a = P(79, 60), ch = P(75, 69);
        for (let i = 0; i < 4; i++) { const f = RED ? (i + .5) / 4 : fr(T * .45 + i / 4); X.save(); X.globalAlpha = Math.sin(PI * f); X.beginPath(); X.ellipse(lerp(a[0], ch[0], f * f), lerp(a[1], ch[1], f * f), s * .9, s * 1.3, 0, 0, TAU); X.fillStyle = FEZ; X.fill(); X.restore(); }
        X.save(); X.globalAlpha = .55 + .35 * uu; X.beginPath(); X.ellipse(ch[0], ch[1], s * 4 * (.4 + .6 * uu), s * 2 * (.4 + .6 * uu), .2, 0, TAU); X.fillStyle = 'rgba(96,66,36,.92)'; X.fill(); X.restore();
        for (let i = 0; i < 3; i++) tripa(X, ch[0] + (i - 1) * s * 1.8, ch[1] + Math.sin(i * 2) * s * .4, i * 2.1 + (RED ? 0 : T * .5), cl(s * 3, 12, 26), T + i, .95 * uu);
        pulso(X, a[0], a[1], s * 2.4, '#FFD43B', T);
      }
    } else if (R.vista === 'd') {
      if (et.id === 'pica') {
        const tp = P(24.5, 77.5);
        for (let i = 0; i < 5; i++) { const f = RED ? (i + .5) / 5 : fr(T * .35 + i / 5), p = CAM.tromba.at(f), q = P(p[0], p[1]); esporo(X, q[0], q[1], p[2], cl(s * 2.6, 9, 22), Math.sin(PI * f) * 1.2); }
        pulso(X, tp[0], tp[1], s * 3, ESP, T);
      }
    }
  }

  // ---------- painel: medidor de parasitas no sangue, onde está o parasita e prevenção ----------
  function txt(X, s, x, y, o = {}) { X.font = `${o.w || 600} ${o.s || 13}px ${FT}`; X.fillStyle = o.c || TXT; X.textAlign = o.a || 'left'; X.textBaseline = 'middle'; X.fillText(s, x, y); }
  function quebra(X, s, w, o) { X.font = `${o.w || 500} ${o.s || 13}px ${FT}`; const L = []; let l = ''; s.split(' ').forEach(p => { const n = l ? l + ' ' + p : p; if (X.measureText(n).width > w && l) { L.push(l); l = p; } else l = n; }); if (l) L.push(l); return L; }
  function bloco(X, s, x, y, w, o, seco) { const L = quebra(X, s, w, o), lh = o.lh || 18; if (!seco) L.forEach((l, i) => txt(X, l, x, y + i * lh, o)); return L.length * lh; }
  const nivel = m => m < .05 ? 'nenhum' : m < .3 ? 'poucos' : m < .65 ? 'muitos' : 'muitíssimos';
  function medidor(X, x, y, w, m, cor, comp) {
    txt(X, 'Parasitas no sangue', x, y + 8, { s: comp ? 13 : 14 });
    txt(X, nivel(m), x + w, y + 8, { s: 13, c: m < .05 ? DIM : cor, a: 'right' });
    const by = y + (comp ? 22 : 24), bh = comp ? 8 : 10;
    X.fillStyle = 'rgba(255,255,255,.1)'; X.beginPath(); X.roundRect(x, by, w, bh, bh / 2); X.fill();
    if (m > .005) { const g = X.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, rgba(cor, .55)); g.addColorStop(1, cor); X.fillStyle = g; X.beginPath(); X.roundRect(x, by, Math.max(bh, w * cl(m, 0, 1)), bh, bh / 2); X.fill(); }
    // os parasitas em si, como bolinhas na barra: quantos mais, mais cheia
    const n = Math.round(cl(m, 0, 1) * 12); for (let i = 0; i < n; i++) dot(X, x + 6 + i * (w - 12) / 11, by + bh / 2, 2, '#FFFFFF', .7);
  }
  function conteudo(X, x, y, w, v, T, seco) {
    const dz = DZ[v.d], et = etapa(v); let yy = y;
    if (et.med !== null) {
      if (!seco) medidor(X, x, yy, w, v.mv, dz.cor, false); yy += 52;
      if (!seco) { X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(x, yy, w, 1); } yy += 18;
      if (!seco) txt(X, 'Onde está o parasita', x, yy, { s: 12, c: DIM, w: 500 }); yy += 18;
      yy += bloco(X, et.onde, x, yy, w, { s: 14, lh: 18 }, seco) + 8;
      if (!seco) txt(X, 'Forma', x, yy, { s: 12, c: DIM, w: 500 }); yy += 18;
      yy += bloco(X, et.forma, x, yy, w, { s: 14, lh: 18, c: dz.cor }, seco) + 8;
      if (et.med === 'ciclo') {
        const k = ciclo(T), tc = 37 + 3.2 * sst(.55, .8, k) * (1 - sst(.9, 1, k));
        if (!seco) { txt(X, 'Temperatura do corpo', x, yy, { s: 12, c: DIM, w: 500 }); txt(X, `cerca de ${tc.toFixed(1).replace('.', ',')} °C`, x + w, yy, { s: 14, c: tc > 38 ? SANG : TXT, a: 'right' }); }
        yy += 20;
      }
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
    const v = S.vg, T = RED ? 2.2 : t, dz = DZ[v.d];
    if (!compacto()) {
      const x0 = 24, w = 300, y0 = 60, px = x0 + 18, pw = w - 36, cy = y0 + 10 + NAVH + 18;
      const h = NAVH + 46 + conteudo(X, px, cy, pw, v, T, true);
      X.fillStyle = 'rgba(11,15,28,.78)'; X.beginPath(); X.roundRect(x0, y0, w, h, 14); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
      posNav(x0 + 10, y0 + 10, w - 20);
      conteudo(X, px, cy, pw, v, T, false);
    } else {
      const x0 = NAR ? 6 : 24, w = W - 2 * x0, h = faixaH(), y0 = H - capRes() - h - 4;
      X.fillStyle = 'rgba(11,15,28,.82)'; X.beginPath(); X.roundRect(x0, y0, w, h, 12); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
      posNav(x0 + 6, y0 + 6, w - 12);
      const px = x0 + 12, pw = w - 24;
      if (etapa(v).med !== null) medidor(X, px, y0 + NAVH + 16, pw, v.mv, dz.cor, true);
      else txt(X, 'Como prevenir: veja a legenda abaixo', px, y0 + NAVH + 30, { s: 13, c: OK });
    }
  }

  // ---------- registro: figura padrão com a cena antiga atrás de "Ver esquema" ----------
  const amb = {
    SC, X: () => X, W: () => W, H: () => H, nar: () => NAR, tela: cv.parentNode,
    cap: () => { const S = Sx; cap(S && S.vg ? etapa(S.vg).cap : ''); },
    t: a => a[0], rot3d: 'Ver esquema', dica3d: '',
    esconder: ['.hud.onde'], esconderFig: ['.palco .ctl', '#extra']
  };
  LAB_FIGALT.cena(amb, K, {
    pref: 'microrganismos', nome: 'Viagem dos protozoários: doença de Chagas e malária', mask: { miolo: .9, borda: 1 },
    vistas: [
      ['a', 'monera-doencas-a', 'Corpo', 'Corpo humano translúcido com os órgãos por onde passam o tripanossomo e o plasmódio', [.06, 0, .88, .6]],
      ['b', 'protozooses-v5b', 'Sangue', 'Sangue de perto: hemácias, algumas com plasmódio dentro e uma se rompendo, e tripanossomos com flagelo entre elas'],
      ['c', 'protoctista-protozooses-a', 'Barbeiro', 'Barbeiro (Triatoma) sobre a parede de barro de uma casa de pau a pique: vetor da doença de Chagas'],
      ['d', 'protoctista-protozooses-b', 'Mosquito', 'Mosquito Anopheles pousado com o abdome inclinado para cima: vetor da malária']
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
