/* LAB Anatomia: "Enzimas e pH ao longo do tubo" com figura de IA realista e a viagem do sanduíche por cima (Martin + Íris).
   Vista A: tubo digestório inteiro no tronco translúcido. Vista B: duodeno, pâncreas e vias biliares de perto.
   Um bolo alimentar percorre o caminho real (curva suave pelos órgãos), etapa por etapa, com o medidor de pH e as
   moléculas do sanduíche (amido, proteína, gordura) se quebrando no trecho certo. Tocar num órgão leva a viagem até ele.
   No duodeno a figura troca para a vista B, com bile e suco pancreático chegando em gotas.
   O 3D antigo segue atrás de "Ver em 3D" (LAB_FIGALT, figura-alterna.js). Os modos "Tubo de ensaio" e
   "Onde cada coisa começa" continuam no desenho plano. Com prefers-reduced-motion nada anda sozinho: etapas por botão.
   Carregar depois de cenas-figura.js e antes de LAB_ANATOMIA_iniciar(). Texto na tela: sem "!", sem setas ou pontos como separador. */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const K = 'digestorio/enzimas', c3 = SC[K]; if (!c3) return;
  const RED = LAB_FIGALT.RED, PI = Math.PI, TAU = PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
  const sst = (a, b, x) => { const u = cl((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const eIO = u => { u = cl(u, 0, 1); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
  const FT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const CARB = '#F2D04A', PROT = '#E58AB0', LIP = '#F28C3A', BILE = '#B9D046', SUCO = '#FFB347', AGUA = '#7CC8F2', TXT = '#E8EDF7', DIM = '#9DA9C4';
  const phCor = v => v < 4 ? '#E0605C' : v < 7.6 ? '#5FB36A' : '#4F86D9';
  const phNome = v => v < 4 ? 'ácido' : v < 7.6 ? 'quase neutro' : 'levemente básico';

  // ---------- caminho real do alimento na vista A (x e y em % da figura; conferido sobre a imagem) ----------
  const P = [[50, 9], [49.6, 14], [50, 20], [50, 28], [50.4, 36], [51.5, 41], [53, 43.5],
    [57, 45.5], [62, 47.5], [63.5, 51], [61, 54.5], [54.7, 55.2], [50.8, 55.2], [46.9, 54.6],
    [44.6, 55.7], [44.1, 57.9], [46.3, 59.8], [49.1, 59.3],
    [50.2, 64.2], [44.6, 64.8], [40, 67], [45.8, 68.5], [53.9, 66.1], [58.6, 69], [51.9, 71.9], [44.1, 72.5], [40, 75.4], [35.5, 76.5],
    [33.5, 74], [33, 68], [33.5, 62], [35.5, 58.5], [42, 58.5], [50, 60], [58, 58.3], [66, 56.5], [68, 61], [68.5, 68], [67.5, 75], [63, 79], [56, 80.5], [51.5, 83], [50, 88], [50, 94]];
  const AR = [.896, 1.2];   // proporção da figura A (896 x 1200), para medir o caminho em distância de verdade
  const N = 14, AM = [], LC = [0], IDX = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    IDX[i] = AM.length;
    for (let j = 0; j < N; j++) { const t = j / N, t2 = t * t, t3 = t2 * t; AM.push([0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3))); }
  }
  IDX[P.length - 1] = AM.length; AM.push(P[P.length - 1].slice());
  for (let i = 1; i < AM.length; i++) LC.push(LC[i - 1] + Math.hypot((AM[i][0] - AM[i - 1][0]) * AR[0], (AM[i][1] - AM[i - 1][1]) * AR[1]));
  const LT = LC[LC.length - 1], LF = LC.map(v => v / LT), FI = i => LF[IDX[i]];
  function noCaminho(f) { f = cl(f, 0, 1); let i = 1; while (i < LF.length - 1 && LF[i] < f) i++; const u = (f - LF[i - 1]) / ((LF[i] - LF[i - 1]) || 1), a = AM[i - 1], b = AM[i]; return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), Math.atan2((b[1] - a[1]) * AR[1], (b[0] - a[0]) * AR[0])]; }

  // ---------- caminhos da vista B (duodeno de perto) ----------
  const PB = {
    bile: [[20, 24], [27, 17], [31.5, 14.5], [35.5, 18], [38.5, 22.5], [40.8, 27], [41.2, 34], [41, 45], [39.6, 55.8], [36.7, 61.4], [33.3, 64.2], [30.6, 66.5]],
    panc: [[86, 46], [78, 49], [70, 51.5], [60, 53.5], [50, 56.5], [42, 60.5], [36, 64], [30.6, 66.5]],
    quimo: [[54, 30], [46, 30.5], [38, 30], [30, 34], [26, 42], [24.5, 55], [26, 68], [30, 77], [40, 80], [50, 78], [58, 72], [65, 76], [68, 88], [67, 99]]
  };

  // ---------- etapas da viagem ----------
  const ET = [
    { id: 'boca', nome: 'Boca', i0: 0, i1: 1, dur: 5, ph: 7, enz: 'Amilase salivar', ec: CARB,
      cap: 'Na <b>boca</b>, os dentes trituram o sanduíche e a <b>amilase salivar</b>, em pH cerca de 7, começa a quebrar o amido.' },
    { id: 'esof', nome: 'Esôfago', i0: 1, i1: 6, dur: 4, ph: 7, enz: 'Sem enzima: só peristaltismo', ec: SUCO,
      cap: 'No <b>esôfago</b> não há digestão química: o <b>peristaltismo</b> do músculo liso empurra o bolo até o estômago.' },
    { id: 'estom', nome: 'Estômago', i0: 6, i1: 13, dur: 7, ph: 2, enz: 'Pepsina e HCl', ec: PROT,
      cap: 'No <b>estômago</b>, o HCl baixa o pH para cerca de 2 e a <b>pepsina</b> quebra proteínas. A amilase salivar para de agir.' },
    { id: 'duod', nome: 'Duodeno', i0: 13, i1: 17, dur: 9, ph: 8, enz: 'Bile, tripsina, lipase e amilase', ec: LIP,
      cap: 'No <b>duodeno</b>, o bicarbonato leva o pH a cerca de 8. A <b>bile</b> emulsiona a gordura e as enzimas do pâncreas agem.' },
    { id: 'delg', nome: 'Intestino delgado', i0: 17, i1: 27, dur: 7, ph: 8, enz: 'Enzimas da parede do intestino', ec: '#B8C27A',
      cap: 'No <b>intestino delgado</b>, a digestão termina e as <b>vilosidades</b> absorvem glicose, aminoácidos, ácidos graxos e glicerol.' },
    { id: 'gros', nome: 'Intestino grosso', i0: 27, i1: 43, dur: 8, ph: 7, enz: 'Sem enzimas: água e microbiota', ec: AGUA,
      cap: 'No <b>intestino grosso</b>, água e sais são absorvidos e a <b>microbiota</b> fermenta fibras. O que sobra forma as fezes.' }
  ];
  const NE = ET.length;

  // ---------- pontos da figura ----------
  const HS = [
    { id: 'boca', c: CARB, t: 'Boca', d: 'Mastigação e saliva. A amilase salivar (ptialina), em pH cerca de 7, começa a quebrar o amido em maltose.', em: { a: [50, 8.7] }, z: 2.4 },
    { id: 'esof', c: SUCO, t: 'Esôfago', d: 'Tubo muscular que leva o bolo até o estômago por peristaltismo. Não produz enzimas digestivas.', em: { a: [50.2, 30] }, z: 2.4 },
    { id: 'estom', c: PROT, t: 'Estômago', d: 'O suco gástrico tem HCl, com pH cerca de 2, e pepsina, que começa a digerir proteínas. O muco protege a parede.', em: { a: [57, 50] }, z: 2.4 },
    { id: 'fig', c: '#C9705E', t: 'Fígado', d: 'Produz a bile, que não tem enzimas: seus sais emulsionam a gordura em gotinhas. Também guarda glicogênio e produz ureia.', em: { a: [34, 46] }, z: 2.2 },
    { id: 'ves', c: BILE, t: 'Vesícula biliar', d: 'Guarda a bile e a libera no duodeno quando chega alimento gorduroso.', em: { a: [38.5, 54.6] }, z: 3 },
    { id: 'panc', c: SUCO, t: 'Pâncreas e duodeno', d: 'O pâncreas lança no duodeno o suco pancreático: tripsina, lipase, amilase pancreática e bicarbonato, que leva o pH a cerca de 8.', em: { a: [47, 57.6] }, z: 3 },
    { id: 'delg', c: '#B8C27A', t: 'Intestino delgado', d: 'Cerca de 6 a 7 metros. Termina a digestão com as enzimas da parede e absorve os nutrientes pelas vilosidades.', em: { a: [50, 69] }, z: 2.2 },
    { id: 'gros', c: AGUA, t: 'Intestino grosso', d: 'Absorve água e sais. A microbiota fermenta fibras e produz vitamina K. As bolsas da parede são as haustrações.', em: { a: [68, 66] }, z: 2.2 },
    { id: 'ceco', c: '#CFE0FF', t: 'Ceco e apêndice', d: 'O intestino delgado desemboca no ceco, começo do intestino grosso, no lado direito do corpo. O apêndice sai do ceco.', em: { a: [35, 78.5] }, z: 2.6 },
    { id: 'reto', c: '#C99A6A', t: 'Reto e ânus', d: 'O reto guarda as fezes até a evacuação, controlada pelos esfíncteres do ânus.', em: { a: [50, 90] }, z: 2.4 },
    { id: 'estb', c: PROT, t: 'Estômago', d: 'Mistura o alimento com o suco gástrico e o transforma em quimo, uma pasta ácida.', em: { b: [70, 25] }, z: 1.8 },
    { id: 'pil', c: '#F2A65A', t: 'Piloro', d: 'Anel de músculo na saída do estômago. Solta o quimo ácido aos poucos para o duodeno.', em: { b: [46, 30.5] }, z: 2.2 },
    { id: 'duod', c: LIP, t: 'Duodeno', d: 'Começo do intestino delgado, em forma de C. Aqui o quimo recebe a bile e o suco pancreático, e o pH sobe para cerca de 8.', em: { b: [24, 50] }, z: 2 },
    { id: 'pap', c: TXT, t: 'Papila duodenal', d: 'Ponto onde o ducto colédoco e o ducto pancreático se abrem no duodeno.', em: { b: [30.4, 66.7] }, z: 2.6 },
    { id: 'col', c: BILE, t: 'Ducto colédoco', d: 'Leva a bile do fígado e da vesícula até o duodeno. A bile emulsiona a gordura, mas não é enzima.', em: { b: [41.2, 40] }, z: 2.2 },
    { id: 'vesb', c: BILE, t: 'Vesícula biliar', d: 'Guarda e concentra a bile. Contrai quando chega gordura ao duodeno, sob o comando do hormônio CCK.', em: { b: [19, 23] }, z: 2 },
    { id: 'figb', c: '#C9705E', t: 'Fígado', d: 'Produz a bile o tempo todo. Ela desce pelo ducto hepático e fica guardada na vesícula.', em: { b: [7, 27] }, z: 1.8 },
    { id: 'dpan', c: SUCO, t: 'Ducto pancreático', d: 'Leva o suco pancreático: tripsina para proteínas, lipase para gorduras, amilase para amido e bicarbonato contra o ácido.', em: { b: [64, 52.7] }, z: 2.2 },
    { id: 'panb', c: SUCO, t: 'Pâncreas', d: 'Glândula mista. A parte exócrina faz o suco pancreático, e as ilhotas lançam insulina e glucagon no sangue.', em: { b: [80, 44] }, z: 1.8 },
    { id: 'jej', c: '#B8C27A', t: 'Jejuno', d: 'Depois do duodeno vêm o jejuno e o íleo, onde a digestão termina e quase tudo é absorvido.', em: { b: [65, 84] }, z: 2 }
  ];
  const VAI = { boca: 0, esof: 1, estom: 2, fig: 3, ves: 3, panc: 3, delg: 4, gros: 5, ceco: 5, reto: 5, estb: 2, pil: 2, duod: 3, pap: 3, col: 3, vesb: 3, figb: 3, dpan: 3, panb: 3, jej: 4 };

  // ---------- estado da viagem (em S.vg; S.e, S.s etc. são do modo Tubo de ensaio) ----------
  const novo = () => ({ e: 0, u: RED ? 1 : 0, hold: 0, pausa: false, phv: 7, fim: 0, auto: false });
  // progresso global g (0 a 6) e o que já aconteceu com cada molécula
  function quimica(g) {
    const em = (e, a, b) => sst(e + a, e + b, g);
    return {
      amido: .4 * em(0, .1, .9) + .6 * em(3, .45, .95),          // boca: maltose; duodeno: amilase pancreática termina
      prot: .5 * em(2, .25, .9) + .5 * em(3, .4, .95),           // estômago: pepsina; duodeno: tripsina
      emul: em(3, .1, .45), lipo: em(3, .45, .95),               // duodeno: bile emulsiona, lipase corta
      abs: em(4, .2, .9), agua: em(5, .1, .9)                    // delgado absorve; grosso tira a água
    };
  }
  function phAlvo(e, u) {
    if (e === 2) return lerp(7, 2, sst(0, .3, u));
    if (e === 3) return lerp(2, 8, sst(0, .35, u));
    return ET[e].ph;
  }

  let legB = null, FIG = null, Sx = null, ultAb = null, Rfig = null, vivo = 0;
  function irPara(S, e, troca) {
    const v = S.vg; v.e = (e + NE) % NE; v.u = RED ? 1 : 0; v.hold = 0; v.fim = 0;
    if (RED) v.phv = phAlvo(v.e, 1);
    if (troca && FIG) { if (ET[v.e].id === 'duod') { if (FIG.vistaAtual !== 'b') FIG.mostrar('b'); } else if (FIG.vistaAtual !== 'a') FIG.mostrar('a'); }
    sinc(S);
  }
  function avancar(S, dt) {
    const v = S.vg, et = ET[v.e];
    if (RED || v.pausa || !dt) return;
    const k = dt * (S.v || 1);
    if (v.u < 1) { v.u = Math.min(1, v.u + k / et.dur); return; }
    v.hold += k;
    if (v.e < NE - 1) { if (v.hold > 1.4) irPara(S, v.e + 1, true); }
    else if (v.hold > 3) { irPara(S, 0, true); }
  }

  // ---------- botões da viagem (HTML sobre o palco) ----------
  const ICO = {
    ant: '<path d="M14.5 6 8.5 12l6 6"/>', prox: '<path d="m9.5 6 6 6-6 6"/>',
    pausa: '<path d="M9 6v12M15 6v12"/>', play: '<path d="M8 5.5v13l10-6.5z"/>'
  };
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;
  let NAV = null;
  function montarNav() {
    if (NAV) return;
    const st = document.createElement('style'); st.id = 'dg-css';
    st.textContent = `.dg-nav{position:absolute;left:0;top:0;z-index:2;display:flex;align-items:center;gap:6px}
.dg-nav[hidden]{display:none}
.dg-nav button{font:inherit;width:44px;height:44px;flex:none;display:grid;place-items:center;border-radius:10px;border:1px solid var(--line-strong,#5B6C99);background:rgba(19,26,43,.92);color:var(--txt,#E8EDF7);cursor:pointer;transition:background-color 90ms,border-color 90ms,color 90ms}
.dg-nav button:hover{background:var(--panel-2,#1B2440);border-color:var(--amber,#FFB347)}
.dg-nav button:active{transform:scale(.96)}
.dg-nav button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
.dg-nav button svg{width:22px;height:22px}
.dg-nav button[hidden]{display:none}
.dg-nav .et{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;padding:0 6px;line-height:1.2}
.dg-nav .et small{font-size:12px;color:var(--dim,#9DA9C4)}
.dg-nav .et b{font-size:15px;font-weight:600;color:var(--txt,#E8EDF7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(prefers-reduced-motion:reduce){.dg-nav button{transition:none}.dg-nav button:active{transform:none}}`;
    document.head.appendChild(st);
    NAV = document.createElement('div'); NAV.className = 'dg-nav'; NAV.hidden = true; NAV.setAttribute('role', 'group'); NAV.setAttribute('aria-label', 'Viagem do sanduíche: etapas');
    NAV.innerHTML = `<button type="button" data-a="ant" aria-label="Etapa anterior" title="Etapa anterior">${svg('ant')}</button>`
      + `<div class="et" aria-live="polite"><small></small><b></b></div>`
      + `<button type="button" data-a="pausa"${RED ? ' hidden' : ''}></button>`
      + `<button type="button" data-a="prox" aria-label="Próxima etapa" title="Próxima etapa">${svg('prox')}</button>`;
    NAV.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || !Sx) return; const v = Sx.vg;
      if (b.dataset.a === 'ant') irPara(Sx, v.e - 1, true);
      else if (b.dataset.a === 'prox') irPara(Sx, v.e + 1, true);
      else { v.pausa = !v.pausa; sinc(Sx); }
    });
    cv.parentNode.appendChild(NAV);
    (function vigia() { if (NAV && !NAV.hidden && performance.now() - vivo > 180) NAV.hidden = true; requestAnimationFrame(vigia); })();
  }
  let sincK = '';
  function sinc(S) {
    if (!NAV) return; const v = S.vg, k = v.e + '|' + v.pausa; if (k === sincK) return; sincK = k;
    NAV.querySelector('.et small').textContent = `Etapa ${v.e + 1} de ${NE}`;
    NAV.querySelector('.et b').textContent = ET[v.e].nome;
    const p = NAV.querySelector('[data-a="pausa"]'), tt = v.pausa ? 'Continuar a viagem' : 'Pausar a viagem';
    p.innerHTML = svg(v.pausa ? 'play' : 'pausa'); p.title = tt; p.setAttribute('aria-label', tt);
  }
  let navK = '';
  function posNav(x, y, w) { const k = [x, y, w].map(Math.round).join(); if (k === navK) return; navK = k; NAV.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`; NAV.style.width = Math.round(w) + 'px'; }

  // ---------- layout ----------
  const compacto = () => NAR || W < 1160;
  const capRes = () => NAR ? 116 : 76, faixaH = () => 124;
  const reserva = () => compacto() ? capRes() + faixaH() + 8 : 56;

  // ---------- desenho: pontinho com brilho ----------
  function dot(X, x, y, r, c, a) { X.globalAlpha = cl(a, 0, 1); X.beginPath(); X.arc(x, y, Math.max(.1, r), 0, TAU); X.fillStyle = c; X.fill(); X.globalAlpha = 1; }
  function gota(X, x, y, r, ang, c, a) {
    X.save(); X.globalAlpha = cl(a, 0, 1); X.translate(x, y); X.rotate(ang - PI / 2);
    X.beginPath(); X.moveTo(0, -r * 2.1); X.bezierCurveTo(r * .9, -r * .8, r, r * .1, 0, r); X.bezierCurveTo(-r, r * .1, -r * .9, -r * .8, 0, -r * 2.1);
    X.fillStyle = c; X.fill(); X.strokeStyle = 'rgba(11,15,28,.55)'; X.lineWidth = 1; X.stroke(); X.restore();
  }
  function aoB(R, Pp, f) {
    const Q = Pp.map(p => R.pt(p[0], p[1])); let L = 0; const D = []; for (let i = 1; i < Q.length; i++) { const d = Math.hypot(Q[i][0] - Q[i - 1][0], Q[i][1] - Q[i - 1][1]); D.push(d); L += d; }
    let s = cl(f, 0, 1) * L, i = 0; while (i < D.length - 1 && s > D[i]) { s -= D[i]; i++; }
    const u = D[i] ? s / D[i] : 0, a = Q[i], b = Q[i + 1]; return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), Math.atan2(b[1] - a[1], b[0] - a[0])];
  }
  function bolo(X, x, y, r, cor, t, q) {
    const g = X.createRadialGradient(x, y, 0, x, y, r * 3.2); g.addColorStop(0, 'rgba(255,214,140,.45)'); g.addColorStop(1, 'rgba(255,214,140,0)');
    X.fillStyle = g; X.beginPath(); X.arc(x, y, r * 3.2, 0, TAU); X.fill();
    const g2 = X.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r); g2.addColorStop(0, '#FFF6E0'); g2.addColorStop(.45, cor); g2.addColorStop(1, rgba(cor, .9));
    X.beginPath(); X.arc(x, y, r, 0, TAU); X.fillStyle = g2; X.fill(); X.strokeStyle = 'rgba(11,15,28,.7)'; X.lineWidth = 1.2; X.stroke();
    // três moléculas girando dentro e em volta do bolo (somem quando são absorvidas)
    const tt = RED ? 0 : t;
    [[CARB, 0], [PROT, 2.1], [LIP, 4.2]].forEach(([c, o]) => { const a = tt * 1.6 + o; dot(X, x + Math.cos(a) * r * .95, y + Math.sin(a) * r * .95, Math.max(1.6, r * .28), c, 1 - q.abs); });
  }
  function anelPeri(X, x, y, ang, r, a) {
    X.save(); X.translate(x, y); X.rotate(ang); X.strokeStyle = rgba(SUCO, a); X.lineWidth = 2; X.lineCap = 'round';
    [-1, 1].forEach(s => { X.beginPath(); X.moveTo(-r * 1.9, s * r * .55); X.lineTo(-r * 1.9, s * r * 1.35); X.stroke(); });
    X.restore();
  }

  // ---------- camada sobre a figura ----------
  function sobre(R, X, t, c) {
    const S = c.S; if (!S || !S.vg) return; Sx = S; vivo = performance.now();
    if (!FIG) FIG = c3.figura;
    // tocar num órgão leva a viagem até ele
    const ab = FIG && FIG.aberto ? FIG.aberto.id : null;
    if (ab !== ultAb) { ultAb = ab; if (ab && VAI[ab] != null && VAI[ab] !== S.vg.e) irPara(S, VAI[ab], false); }
    avancar(S, S.dt || 0);
    const v = S.vg, et = ET[v.e], g = v.e + v.u, q = quimica(g), tt = RED ? 0 : t;
    const alvo = phAlvo(v.e, v.u); v.phv = RED ? alvo : v.phv + (alvo - v.phv) * Math.min(1, (S.dt || 0) * 4);
    Rfig = R; legB = null;
    const corBolo = v.e >= 5 ? '#B98C5C' : v.e >= 2 ? '#E2C47E' : '#EBD7AC';
    if (R.vista === 'a') {
      const f0 = FI(et.i0), f1 = FI(et.i1);
      let uu = RED ? .6 : eIO(v.u);
      if (et.id === 'estom' && !RED) uu = cl(uu + .05 * Math.sin(t * 3.1) * Math.sin(PI * v.u), 0, 1);   // mistura no estômago
      const f = lerp(f0, f1, uu), p = noCaminho(f), bp = R.pt(p[0], p[1]), rb = cl(R.s * 1.9, 7, 18);
      // rastro do caminho já feito, fino e tracejado
      X.save(); X.setLineDash([2, 5]); X.lineCap = 'round'; X.strokeStyle = 'rgba(255,214,140,.55)'; X.lineWidth = 1.6; X.beginPath();
      let st = false; for (let i = 0; i < AM.length && LF[i] <= f; i++) { const s = R.pt(AM[i][0], AM[i][1]); if (!st) { X.moveTo(s[0], s[1]); st = true; } else X.lineTo(s[0], s[1]); }
      if (st) { X.lineTo(bp[0], bp[1]); X.stroke(); } X.restore();
      // glândulas no duodeno: bile da vesícula e suco do pâncreas
      if (et.id === 'duod') {
        [[[38.5, 54.6], [44.6, 56.6], BILE], [[47.4, 57.8], [45, 57.4], SUCO]].forEach(([a, b, cor], k) => {
          const A = R.pt(a[0], a[1]), B = R.pt(b[0], b[1]);
          for (let i = 0; i < 3; i++) { const u = RED ? (i + .5) / 3 : ((tt * .5 + i / 3 + k * .17) % 1); gota(X, lerp(A[0], B[0], u), lerp(A[1], B[1], u), Math.max(2.2, R.s * .45), Math.atan2(B[1] - A[1], B[0] - A[0]), cor, Math.sin(PI * u) * .95 + (RED ? .2 : 0)); }
        });
      }
      // peristaltismo: anel de músculo aperta logo atrás do bolo
      if (v.e >= 1 && v.u < 1 && !RED) anelPeri(X, bp[0], bp[1], p[2], rb, .85);
      else if (v.e >= 1 && RED) anelPeri(X, bp[0], bp[1], p[2], rb, .6);
      // absorção no delgado (nutrientes saem para o sangue) e água no grosso
      if (et.id === 'delg' || et.id === 'gros') {
        const cores = et.id === 'delg' ? [CARB, PROT, LIP] : [AGUA, AGUA, '#CFE0FF'];
        for (let i = 0; i < 9; i++) {
          const u = RED ? .5 : ((tt * .7 + i / 9) % 1), a = i * 2.39 + 1, D = rb * (1.4 + u * 3.2);
          dot(X, bp[0] + Math.cos(a) * D, bp[1] + Math.sin(a) * D, Math.max(1.6, rb * .26), cores[i % 3], (1 - u) * .9 * (v.u > .05 || RED ? 1 : 0));
        }
      }
      bolo(X, bp[0], bp[1], rb * (et.id === 'gros' ? 1 - .25 * q.agua : 1), corBolo, t, q);
    } else {
      // vista B: bile pelo colédoco e suco pancreático pelo ducto, chegando à papila
      const noD = et.id === 'duod', forte = noD ? 1 : .4;
      [[PB.bile, BILE, .16, 5], [PB.panc, SUCO, .14, 6]].forEach(([Pp, cor, vel, n], k) => {
        for (let i = 0; i < n; i++) {
          const u = RED ? (i + .5) / n : ((tt * vel * (noD ? 1.6 : 1) + i / n + k * .11) % 1), q2 = aoB(R, Pp, u);
          gota(X, q2[0], q2[1], Math.max(2.6, R.s * .55), q2[2], cor, (RED ? .9 : Math.min(1, Math.sin(PI * u) * 1.6)) * forte);
        }
      });
      const pp = R.pt(30.6, 66.5);
      if (noD) {
        if (!RED) { const u = (t / 1.6) % 1; X.beginPath(); X.arc(pp[0], pp[1], 4 + R.s * 3 * u, 0, TAU); X.strokeStyle = rgba(SUCO, .8 * (1 - u)); X.lineWidth = 2; X.stroke(); }
        // o quimo atravessa o duodeno no ritmo da etapa
        const qb = aoB(R, PB.quimo, RED ? .45 : eIO(v.u));
        bolo(X, qb[0], qb[1], cl(R.s * 1.6, 7, 22), corBolo, t, q);
      }
      const LG = [[BILE, 'bile (não é enzima)'], [SUCO, 'suco pancreático']];
      if (compacto() && R.y + R.h + 30 < H - reserva() + 4) legB = [R.cx, R.y + R.h + 14, LG];
      else { legB = null; leg(X, R.x + 10, R.y + R.h - 58, LG); }
    }
  }
  function legLinha(X, cx, y, itens) {
    X.save(); X.font = `600 12px ${FT}`; X.textBaseline = 'middle';
    const ws = itens.map(i => X.measureText(i[1]).width + 26), tot = ws.reduce((a, b) => a + b, 0) + 8 * (itens.length - 1);
    let x = Math.max(8, cx - tot / 2); X.fillStyle = 'rgba(11,15,28,.82)'; X.beginPath(); X.roundRect(x - 8, y - 12, tot + 16, 24, 12); X.fill();
    itens.forEach((it, i) => { dot(X, x + 6, y, 4.5, it[0], 1); X.fillStyle = TXT; X.fillText(it[1], x + 16, y); x += ws[i] + 8; });
    X.restore();
  }
  function leg(X, x, y, itens) {
    X.save(); X.font = `600 ${NAR ? 12 : 13}px ${FT}`; X.textBaseline = 'middle';
    const w = Math.max(...itens.map(i => X.measureText(i[1]).width)) + 34, h = itens.length * 20 + 10;
    X.fillStyle = 'rgba(11,15,28,.82)'; X.beginPath(); X.roundRect(x, y, w, h, 8); X.fill();
    itens.forEach((it, i) => { dot(X, x + 14, y + 15 + i * 20, 4.5, it[0], 1); X.fillStyle = TXT; X.fillText(it[1], x + 26, y + 15 + i * 20); });
    X.restore();
  }

  // ---------- painel: medidor de pH e moléculas do sanduíche ----------
  function txt(X, s, x, y, o = {}) { X.font = `${o.w || 600} ${o.s || 13}px ${FT}`; X.fillStyle = o.c || TXT; X.textAlign = o.a || 'left'; X.textBaseline = 'middle'; X.fillText(s, x, y); }
  function medidor(X, x, y, w, ph, comp) {
    const c = phCor(ph);
    txt(X, `pH cerca de ${Math.round(ph)}`, x, y + 8, { s: comp ? 13 : 15, c });
    txt(X, phNome(ph), x + w, y + 8, { s: 12, c: DIM, a: 'right', w: 500 });
    const by = y + (comp ? 23 : 24), bh = comp ? 8 : 10;
    const g = X.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, '#D9534F'); g.addColorStop(.5, '#5FB36A'); g.addColorStop(1, '#4F86D9');
    X.fillStyle = g; X.beginPath(); X.roundRect(x, by, w, bh, bh / 2); X.fill();
    const nx = x + w * cl(ph / 14, 0, 1);
    X.beginPath(); X.moveTo(nx, by - 2); X.lineTo(nx - 6, by - 9); X.lineTo(nx + 6, by - 9); X.closePath(); X.fillStyle = TXT; X.fill();
    X.fillStyle = TXT; X.fillRect(nx - 1, by - 2, 2, bh + 4);
    if (!comp) [0, 7, 14].forEach(n => txt(X, String(n), x + w * n / 14, by + bh + 11, { s: 12, c: DIM, w: 500, a: n === 0 ? 'left' : n === 14 ? 'right' : 'center' }));
  }
  // cadeia de contas: q de 0 a 1 quebra as ligações na ordem dada; ab leva os pedaços para o sangue
  function cadeia(X, x, y, n, r, cor, q, ab, ordem, t, wmax) {
    const gap = r * 1.6, d = r * 2.15; let off = 0; const pos = [];
    for (let j = 0; j < n; j++) {
      pos.push(x + j * d + off);
      if (j < n - 1) off += gap * cl(q * (n - 1) - ordem[j], 0, 1);
    }
    const sc = wmax ? Math.min(1, wmax / (pos[n - 1] - x + r * 2)) : 1, tt = RED ? 0 : t;
    for (let j = 0; j < n - 1; j++) { const b = cl(q * (n - 1) - ordem[j], 0, 1); if (b >= .6) continue; X.globalAlpha = (1 - ab) * (1 - b / .6); X.strokeStyle = cor; X.lineWidth = 2; X.beginPath(); X.moveTo(x + (pos[j] - x) * sc, y); X.lineTo(x + (pos[j + 1] - x) * sc, y); X.stroke(); }
    X.globalAlpha = 1;
    pos.forEach((px, j) => { const sx = x + (px - x) * sc, jig = q > 0 ? Math.sin(tt * 2.2 + j * 1.7) * 1.6 * Math.min(1, q * 2) : 0; dot(X, sx, y + jig - ab * 12, r * sc, cor, 1 - ab); });
  }
  function gordura(X, x, y, R0, emul, lipo, ab, t, wmax) {
    const tt = RED ? 0 : t, cor = LIP;
    if (emul < 1) dot(X, x + R0, y, R0 * (1 - emul * .5), cor, 1 - emul);
    if (emul > 0) for (let i = 0; i < 4; i++) {
      const cx = x + R0 * .6 + i * Math.min(R0 * 1.25, (wmax - R0) / 4) * emul, cy = y + (i % 2 ? -1 : 1) * R0 * .25 * emul + Math.sin(tt * 2 + i) * .8;
      const rr = R0 * .48 * (1 - .55 * lipo);
      dot(X, cx, cy - ab * 12, rr, cor, emul * (1 - ab));
      if (lipo > 0) for (let k = 0; k < 3; k++) { const a = k * 2.1 + i + tt * .6, D = rr + 3 + lipo * 3; dot(X, cx + Math.cos(a) * D, cy + Math.sin(a) * D - ab * 12, 2.2, '#FFD9A8', lipo * (1 - ab)); }
    }
  }
  const ESTADO = {
    amido: q => q.abs > .5 ? 'glicose absorvida' : q.amido > .75 ? 'glicose' : q.amido > .2 ? 'maltose e pedaços' : 'amido inteiro',
    prot: q => q.abs > .5 ? 'aminoácidos absorvidos' : q.prot > .75 ? 'aminoácidos' : q.prot > .2 ? 'peptídeos' : 'proteína inteira',
    gord: q => q.abs > .5 ? 'absorvidos pela linfa' : q.lipo > .5 ? 'ácidos graxos e glicerol' : q.emul > .4 ? 'gotinhas (bile)' : 'gota grande'
  };
  function fora(X, t, c) {
    const S = c.S; if (!S || !S.vg || !Rfig) return; montarNav(); sinc(S); NAV.hidden = false;
    const v = S.vg, q = quimica(v.e + v.u), et = ET[v.e];
    if (legB) legLinha(X, legB[0], legB[1], legB[2]);
    if (!compacto()) {
      const x0 = 28, w = 304;
      const y0 = 60, h = 372;
      X.fillStyle = 'rgba(11,15,28,.72)'; X.beginPath(); X.roundRect(x0, y0, w, h, 14); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
      posNav(x0 + 10, y0 + 10, w - 20);
      const px = x0 + 18, pw = w - 36;
      medidor(X, px, y0 + 70, pw, v.phv, false);
      dot(X, px + 5, y0 + 150, 5, et.ec, 1); txt(X, et.enz, px + 16, y0 + 150, { s: 14 });
      X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(px, y0 + 172, pw, 1);
      const linhas = [['Amido', CARB, ESTADO.amido(q)], ['Proteína', PROT, ESTADO.prot(q)], ['Gordura', LIP, ESTADO.gord(q)]];
      linhas.forEach(([n, cor, est], i) => {
        const ly = y0 + 196 + i * 58;
        txt(X, n, px, ly, { s: 14, c: cor }); txt(X, est, px + pw, ly, { s: 13, c: DIM, w: 500, a: 'right' });
        if (i === 0) cadeia(X, px + 6, ly + 26, 6, 6, CARB, q.amido, q.abs, [2, 0, 3, 1, 4], t, pw - 8);
        else if (i === 1) cadeia(X, px + 6, ly + 26, 5, 6, PROT, q.prot, q.abs, [3, 0, 2, 1], t, pw - 8);
        else gordura(X, px + 2, ly + 26, 13, q.emul, q.lipo, q.abs, t, pw - 8);
      });
    } else {
      const x0 = NAR ? 6 : 24, w = W - 2 * x0, h = faixaH(), y0 = H - capRes() - h - 4;
      X.fillStyle = 'rgba(11,15,28,.78)'; X.beginPath(); X.roundRect(x0, y0, w, h, 12); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
      posNav(x0 + 6, y0 + 6, w - 12);
      const px = x0 + 12, pw = w - 24;
      medidor(X, px, y0 + 50, pw, v.phv, true);
      const cw = pw / 3, my = y0 + h - 14;
      [['Amido', CARB], ['Proteína', PROT], ['Gordura', LIP]].forEach(([n, cor], i) => {
        const cx = px + i * cw;
        txt(X, n, cx, my - 16, { s: 12, c: cor });
        if (i === 0) cadeia(X, cx + 4, my + 2, 5, 4, CARB, q.amido, q.abs, [1, 0, 3, 2], t, cw - 14);
        else if (i === 1) cadeia(X, cx + 4, my + 2, 4, 4, PROT, q.prot, q.abs, [2, 0, 1], t, cw - 14);
        else gordura(X, cx, my + 2, 6, q.emul, q.lipo, q.abs, t, cw - 14);
      });
    }
  }

  // ---------- registro: figura padrão com o 3D antigo atrás de "Ver em 3D" ----------
  const plano = c3.plano ? (t, S) => c3.plano(t, S) : null;
  const d3 = c3.draw; let chamou3 = false, em3d = false;
  c3.draw = function (...a) { chamou3 = true; return d3.apply(this, a); };
  const amb = {
    SC, X: () => X, W: () => W, H: () => H, nar: () => NAR, tela: cv.parentNode,
    cap: () => { const S = Sx; cap(S && S.vg ? ET[S.vg.e].cap : ''); },
    t: a => a[0], rot3d: plano ? 'Ver em 3D' : 'Ver esquema', dica3d: plano ? 'Arraste para girar o modelo' : '',
    esconder: ['.hud.onde'], esconderFig: []
  };
  LAB_FIGALT.cena(amb, K, {
    pref: 'anatomia', nome: 'Tubo digestório e a viagem do sanduíche', mask: { miolo: .86, borda: 1 },
    vistas: [
      ['a', 'digestorio-enzimas-a', 'Tubo inteiro', 'Tubo digestório completo no tronco: boca, esôfago, estômago, fígado e vesícula, pâncreas, intestinos e reto'],
      ['b', 'digestorio-enzimas-b', 'Duodeno de perto', 'Estômago, duodeno aberto, pâncreas e vias biliares chegando à papila duodenal']
    ],
    hs: HS, reserva: reserva, sobre, fora
  });
  const dFig = c3.draw, i1 = c3.init;
  c3.init = function (S) { i1.call(this, S); if (!S.modo) S.modo = 'viagem'; S.vg = novo(); sincK = ''; ultAb = null; };
  c3.draw = function (t, S) {
    if (!S.modo) S.modo = 'viagem';
    if (!S.vg) S.vg = novo();
    if (S.modo !== 'viagem' && !em3d) {   // Tubo de ensaio e cartões: desenho plano de sempre
      const pl = plano || d3; X.save(); try { pl.call(c3, t, S); } catch (e) { console.error(e); } X.restore(); return;
    }
    chamou3 = false; const r = dFig.call(this, t, S); em3d = chamou3; return r;
  };
})();
