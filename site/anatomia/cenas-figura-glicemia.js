/* LAB Anatomia: "Insulina, glucagon e diabetes" como a viagem da glicose depois da refeição, sobre figuras de IA
   realistas, no padrão de cenas-figura-digestorio.js (Martin).
   Vista A: corpo translúcido com as glândulas acesas (a figura de endocrino/glandulas).
   Vista B: fígado e vesícula, duodeno, pâncreas e vasos, com uma ilhota de Langerhans aberta (células beta no meio,
   alfa na borda e capilares), Nano Banana 2.
   Etapas: refeição, absorção no intestino, glicemia sobe, células beta soltam insulina, glicose entra no músculo e no
   fígado (glicogênio), glicemia volta ao normal, jejum, células alfa soltam glucagon, fígado quebra glicogênio e,
   no fim, diabetes tipo 1 e tipo 2. Medidor de glicemia em mg/dL (faixa normal em jejum de cerca de 70 a 99),
   com insulina, glucagon e o glicogênio do fígado no painel.
   Tocar num ponto leva a viagem até ele; a vista B entra sozinha nas etapas do pâncreas e do fígado.
   O gráfico antigo do dia segue atrás de "Ver esquema"; "Três pessoas, uma refeição" continua no desenho plano.
   Com prefers-reduced-motion nada anda sozinho: etapas por botão. Usa os globais do motor (SC, X, W, H, NAR, cap, cv).
   Carregar depois de cenas-figura-esqueleto.js e antes de LAB_ANATOMIA_iniciar(). Texto: sem "!", sem setas ou pontos como separador. */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const K = 'endocrino/glicemia', MODO = 'dia', c3 = SC[K]; if (!c3) return;
  const RED = LAB_FIGALT.RED, PI = Math.PI, TAU = PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
  const sst = (a, b, x) => { const u = cl((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const eIO = u => { u = cl(u, 0, 1); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
  const FT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const TXT = '#E8EDF7', DIM = '#9DA9C4', OK = '#7FD48A', ALTO = '#FFB347', BAIXO = '#8FD8FF', ERRO = '#E0605C';
  // cores iguais às da cena antiga e às da figura: insulina âmbar (células beta), glucagon lilás (células alfa)
  const GLI = '#7FD3FF', INS = '#F2C94C', GLU = '#C58BE8', GLIC = '#E8DCC0', COMIDA = '#E2C47E', CEL = '#CFE0FF';

  // ---------- desenho básico ----------
  function dot(X, x, y, r, c, a) { X.globalAlpha = cl(a, 0, 1); X.beginPath(); X.arc(x, y, Math.max(.1, r), 0, TAU); X.fillStyle = c; X.fill(); X.globalAlpha = 1; }
  function brilho(X, x, y, r, c, a) { if (a <= 0) return; const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(c, .55 * cl(a, 0, 1))); g.addColorStop(1, rgba(c, 0)); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); }
  function txt(X, s, x, y, o = {}) { X.font = `${o.w || 600} ${o.s || 13}px ${FT}`; X.fillStyle = o.c || TXT; X.textAlign = o.a || 'left'; X.textBaseline = 'middle'; X.fillText(s, x, y); }
  function anel(X, x, y, t, cor, per, rmax, off, al) {
    if (RED) { X.beginPath(); X.arc(x, y, rmax * .6, 0, TAU); X.strokeStyle = rgba(cor, .55 * (al == null ? 1 : al)); X.lineWidth = 1.5; X.stroke(); return; }
    const u = (((t + (off || 0)) / per) % 1 + 1) % 1;
    X.beginPath(); X.arc(x, y, 4 + rmax * (1 - Math.pow(1 - u, 3)), 0, TAU); X.strokeStyle = rgba(cor, (al == null ? .85 : al) * (1 - u)); X.lineWidth = 2; X.stroke();
  }
  // glicose: hexágono pequeno; hormônio: bolinha com brilho; os dois com contorno escuro para ler sobre a figura
  function glicose(X, x, y, r, a, cor) {
    if (a <= 0) return; X.save(); X.globalAlpha = cl(a, 0, 1); X.beginPath();
    for (let i = 0; i < 6; i++) { const ang = PI / 6 + i * PI / 3; X.lineTo(x + Math.cos(ang) * r, y + Math.sin(ang) * r); }
    X.closePath(); X.lineWidth = 3; X.strokeStyle = 'rgba(11,15,28,.8)'; X.stroke(); X.fillStyle = cor || GLI; X.fill(); X.restore();
  }
  function hormonio(X, x, y, r, c, a) { if (a <= 0) return; brilho(X, x, y, r * 3, c, a); X.globalAlpha = cl(a, 0, 1); X.beginPath(); X.arc(x, y, r + 1.5, 0, TAU); X.fillStyle = 'rgba(11,15,28,.8)'; X.fill(); X.globalAlpha = 1; dot(X, x, y, r, c, a); dot(X, x - r * .3, y - r * .3, r * .35, '#FFFFFF', a * .7); }
  function leg(X, x, y, itens, nar) {
    X.save(); X.font = `600 ${nar ? 12 : 13}px ${FT}`; X.textBaseline = 'middle'; X.textAlign = 'left';
    const w = Math.max(...itens.map(i => X.measureText(i[1]).width)) + 34, h = itens.length * 20 + 10;
    X.fillStyle = 'rgba(11,15,28,.82)'; X.beginPath(); X.roundRect(x, y, w, h, 8); X.fill();
    itens.forEach((it, i) => { dot(X, x + 14, y + 15 + i * 20, 4.5, it[0], 1); X.fillStyle = TXT; X.fillText(it[1], x + 26, y + 15 + i * 20); });
    X.restore();
  }
  let pend = null;
  const LEGH = 46;
  function legLinha(X, cx, y, itens, wmax) {
    X.save(); X.textBaseline = 'middle'; X.textAlign = 'left';
    let fs = 12, its = itens.slice(), ws, tot;
    const med = () => { X.font = `600 ${fs}px ${FT}`; ws = its.map(i => X.measureText(i[1]).width + 22); tot = ws.reduce((a, b) => a + b, 0) + 8 * (its.length - 1); };
    med(); if (tot > wmax - 16) { fs = 11; med(); }
    if (tot > wmax - 16 && its.length > 1) { const resto = []; while (its.length > 1 && tot > wmax - 16) { resto.unshift(its.pop()); med(); } X.restore(); legLinha(X, cx, y - 11, its, wmax); legLinha(X, cx, y + 13, resto, wmax); return; }
    let x = cx - tot / 2; X.fillStyle = 'rgba(11,15,28,.82)'; X.beginPath(); X.roundRect(x - 8, y - 11, tot + 16, 22, 11); X.fill();
    its.forEach((it, i) => { dot(X, x + 6, y, 4.5, it[0], 1); X.fillStyle = TXT; X.fillText(it[1], x + 15, y); x += ws[i] + 8; });
    X.restore();
  }
  function legR(X, R, itens, onde) {
    const nar = R.w < 520; X.save(); X.font = `600 ${nar ? 12 : 13}px ${FT}`;
    const w = Math.max(...itens.map(i => X.measureText(i[1]).width)) + 34, h = itens.length * 20 + 10; X.restore();
    if (compacto()) { const cx = caixa(FAIXA); pend = ['linha', cx.x + cx.w / 2, cx.y + cx.h + LEGH / 2, itens]; return; }
    let x = R.x + 10, y = R.y + 10;
    const bx = caixa(FAIXA); if (R.x + R.w + w + 16 <= bx.x + bx.w) { pend = [R.x + R.w + 12, R.y + R.h - h - 10, itens, nar]; return; }
    if (onde === 'baixo') y = R.y + R.h - h - 10;
    else if (onde === 'dir') x = R.x + R.w - w - 10;
    else if (onde === 'baixodir') { x = R.x + R.w - w - 10; y = R.y + R.h - h - 10; }
    pend = [x, y, itens, nar];
  }

  // ---------- caminho suave (Catmull-Rom) medido em distância real da figura ----------
  function caminho(P, AR) {
    const N = 12, AM = [];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      for (let j = 0; j < N; j++) { const t = j / N, t2 = t * t, t3 = t2 * t; AM.push([0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3))); }
    }
    AM.push(P[P.length - 1].slice());
    const LC = [0]; for (let i = 1; i < AM.length; i++) LC.push(LC[i - 1] + Math.hypot((AM[i][0] - AM[i - 1][0]) * AR[0], (AM[i][1] - AM[i - 1][1]) * AR[1]));
    const LT = LC[LC.length - 1] || 1, LF = LC.map(v => v / LT);
    return {
      em(f) { f = cl(f, 0, 1); let i = 1; while (i < LF.length - 1 && LF[i] < f) i++; const u = (f - LF[i - 1]) / ((LF[i] - LF[i - 1]) || 1), a = AM[i - 1], b = AM[i]; return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]; },
      rastro(X, R, f1, cor) {
        X.save(); X.setLineDash([2, 5]); X.lineCap = 'round'; X.strokeStyle = cor; X.lineWidth = 1.6; X.beginPath(); let st = false;
        for (let i = 0; i < AM.length; i++) { if (LF[i] > f1) break; const s = R.pt(AM[i][0], AM[i][1]); if (!st) { X.moveTo(s[0], s[1]); st = true; } else X.lineTo(s[0], s[1]); }
        if (st) { const p = this.em(f1), s = R.pt(p[0], p[1]); X.lineTo(s[0], s[1]); X.stroke(); } X.restore();
      },
      fluxo(X, R, t, o) {
        const n = o.n || 5;
        for (let i = 0; i < n; i++) {
          const f = RED ? (i + .5) / n : (((t * (o.v || .2) + i / n + (o.off || 0)) % 1) + 1) % 1, p = this.em(f), s = R.pt(p[0], p[1]);
          o.d(s[0], s[1], (o.a == null ? 1 : o.a) * (RED ? .9 : Math.min(1, Math.sin(PI * f) * 1.8)));
        }
      }
    };
  }

  // ---------- botões da viagem ----------
  const ICO = { ant: '<path d="M14.5 6 8.5 12l6 6"/>', prox: '<path d="m9.5 6 6 6-6 6"/>', pausa: '<path d="M9 6v12M15 6v12"/>', play: '<path d="M8 5.5v13l10-6.5z"/>' };
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;
  let NAV = null, vivo = 0, sincK = '', navK = '', Sx = null;
  function montarNav() {
    if (NAV) return;
    const st = document.createElement('style'); st.id = 'gl-css';
    st.textContent = `.gl-nav{position:absolute;left:0;top:0;z-index:2;display:flex;align-items:center;gap:6px}
.gl-nav[hidden]{display:none}
.gl-nav button{font:inherit;width:44px;height:44px;flex:none;display:grid;place-items:center;border-radius:10px;border:1px solid var(--line-strong,#5B6C99);background:rgba(19,26,43,.92);color:var(--txt,#E8EDF7);cursor:pointer;transition:background-color 90ms,border-color 90ms,color 90ms}
.gl-nav button:hover{background:var(--panel-2,#1B2440);border-color:var(--amber,#FFB347)}
.gl-nav button:active{transform:scale(.96)}
.gl-nav button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
.gl-nav button svg{width:22px;height:22px}
.gl-nav button[hidden]{display:none}
.gl-nav .et{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;padding:0 6px;line-height:1.2}
.gl-nav .et small{font-size:12px;color:var(--dim,#9DA9C4)}
.gl-nav .et b{font-size:15px;font-weight:600;color:var(--txt,#E8EDF7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(prefers-reduced-motion:reduce){.gl-nav button{transition:none}.gl-nav button:active{transform:none}}`;
    document.head.appendChild(st);
    NAV = document.createElement('div'); NAV.className = 'gl-nav'; NAV.hidden = true; NAV.setAttribute('role', 'group'); NAV.setAttribute('aria-label', 'Viagem da glicose: etapas');
    NAV.innerHTML = `<button type="button" data-a="ant" aria-label="Etapa anterior" title="Etapa anterior">${svg('ant')}</button>`
      + `<div class="et" aria-live="polite"><small></small><b></b></div>`
      + `<button type="button" data-a="pausa"${RED ? ' hidden' : ''}></button>`
      + `<button type="button" data-a="prox" aria-label="Próxima etapa" title="Próxima etapa">${svg('prox')}</button>`;
    NAV.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || !Sx) return; const v = Sx.vg;
      if (b.dataset.a === 'ant') ir(Sx, v.e - 1, true);
      else if (b.dataset.a === 'prox') ir(Sx, v.e + 1, true);
      else { v.pausa = !v.pausa; sinc(Sx); }
    });
    cv.parentNode.appendChild(NAV);
    (function vigia() { if (NAV && !NAV.hidden && performance.now() - vivo > 180) NAV.hidden = true; requestAnimationFrame(vigia); })();
  }
  function posNav(x, y, w) { const k = [x, y, w].map(Math.round).join(); if (k === navK) return; navK = k; NAV.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`; NAV.style.width = Math.round(w) + 'px'; }

  // ---------- layout: painel à esquerda no computador; faixa embaixo no celular ----------
  const compacto = () => NAR || W < 1160;
  const capRes = () => NAR ? 116 : 76;
  const PW = 312, FAIXA = 150, ALTOP = 420;
  function caixa(fh) {
    if (!compacto()) { const x = 28 + PW + 14; return { x, y: 60, w: W - x - 24, h: H - 60 - 56 }; }
    const x0 = NAR ? 6 : 24, y0 = NAR ? 46 : 60; return { x: x0, y: y0, w: W - 2 * x0, h: H - y0 - (capRes() + fh + 8) - (fh ? LEGH : 0) };
  }
  function painelBox() {
    if (!compacto()) return { x: 28, y: 60, w: PW, h: ALTOP, comp: false };
    const x0 = NAR ? 6 : 24; return { x: x0, y: H - capRes() - FAIXA - 4, w: W - 2 * x0, h: FAIXA, comp: true };
  }

  // =====================================================================================================
  // Pontos conferidos sobre as imagens, em % da figura (as duas são 4 por 3)
  // =====================================================================================================
  const AR = [1.34, 1];
  // vista A (corpo translúcido)
  const BOCA = [50, 21.5], ESTOM = [53.5, 53], PANC = [51.2, 58.8], FIGA = [44.5, 48.5], CORA = [51.5, 41];
  const BRACO = [35.2, 62], BRACO2 = [64.8, 62], COXA = [44.5, 82], COXA2 = [55.5, 82], CABECA = [50, 11];
  const cComida = caminho([BOCA, [49.9, 26], [49.8, 32], [50, 40], [50.8, 46], [52.3, 50], ESTOM], AR);
  const cIntest = caminho([ESTOM, [52, 57], [49, 62], [51.5, 66], [48.5, 69], [46, 63], FIGA], AR);
  const cSangue = [[FIGA, [48, 45], CORA, [50, 30], [50, 20], CABECA], [CORA, [44, 44], [40, 50], [37, 56], BRACO], [CORA, [57, 44], [60, 50], [63, 56], BRACO2], [CORA, [50, 55], [47, 66], [45.5, 74], COXA], [CORA, [52, 55], [53, 66], [54.5, 74], COXA2]].map(P => caminho(P, AR));
  const cInsA = [BRACO, COXA, FIGA].map(a => caminho([PANC, [lerp(PANC[0], a[0], .45), lerp(PANC[1], a[1], .45) + 2], a], AR));
  const ALVOS = [BRACO, COXA, FIGA, BRACO2, COXA2];
  // vista B (pâncreas, duodeno e fígado): duodeno até a veia mesentérica e a veia porta, que entra no fígado
  const cAbs = caminho([[17, 70], [21, 80], [27, 86], [32, 87], [33.4, 80], [33.6, 72], [34, 60], [34, 48], [34, 38], [34, 30], [33.5, 23], [29, 17], [22, 15]], AR);
  // da ilhota do pâncreas pela veia esplênica até a porta e o fígado
  const cIlhota = caminho([[54.2, 64.5], [53.5, 57], [52, 50.5], [47, 47.5], [42, 45.5], [37.5, 42.5], [34.5, 38], [34, 30], [33.5, 23], [29, 17], [22, 15]], AR);
  const ILH = [73.6, 30.8], ILHP = [54.2, 64.7], FIGB = [24, 12];
  const FIGPTS = [[12, 20], [19, 14], [26, 9], [33, 6], [22, 22], [8, 12], [15, 6]];
  // células da ilhota aberta: beta no miolo, alfa no anel de fora
  const BETA = [], ALFA = [];
  for (let i = 0; i < 16; i++) { const a = i * 2.399, rr = Math.sqrt((i + .5) / 16); BETA.push([ILH[0] + Math.cos(a) * 8 * rr, ILH[1] + Math.sin(a) * 10.5 * rr]); }
  for (let i = 0; i < 14; i++) { const a = i * TAU / 14 + .2; ALFA.push([ILH[0] + Math.cos(a) * 11.6, ILH[1] + Math.sin(a) * 15]); }

  // ---------- etapas: g(u) é a glicemia em mg/dL; ins, glu e gli de 0 a 1 ----------
  const ET = [
    { id: 'ref', nome: 'Refeição', vista: 'a', dur: 6, g: u => lerp(88, 92, u), ins: u => .15, glu: u => .15, gli: u => .35,
      cap: 'Depois de uma <b>refeição</b> com pão ou arroz, o alimento desce pelo esôfago até o estômago. O <b>amido</b> vai ser quebrado em <b>glicose</b>.' },
    { id: 'abs', nome: 'Absorção', vista: 'b', dur: 8, g: u => lerp(92, 132, sst(.1, 1, u)), ins: u => lerp(.15, .3, u), glu: u => .15, gli: u => .35,
      cap: 'No <b>intestino delgado</b>, a glicose é <b>absorvida</b> e cai no sangue. A <b>veia porta</b> leva esse sangue primeiro ao <b>fígado</b>.' },
    { id: 'sobe', nome: 'A glicemia sobe', vista: 'a', dur: 6, g: u => lerp(132, 145, sst(0, .8, u)), ins: u => lerp(.3, .45, u), glu: u => lerp(.15, .08, u), gli: u => .35,
      cap: 'A <b>glicemia sobe</b> e chega a cerca de 140 mg/dL. O sangue leva a glicose para o corpo todo, mas ela ainda não entra bem nas células.' },
    { id: 'beta', nome: 'Células beta', vista: 'b', dur: 8, g: u => lerp(145, 142, u), ins: u => lerp(.45, .9, sst(.1, .8, u)), glu: u => .08, gli: u => .35,
      cap: 'As <b>células beta</b> das <b>ilhotas de Langerhans</b> percebem a glicose alta e soltam <b>insulina</b>, que vai para o sangue pela veia do pâncreas.' },
    { id: 'entra', nome: 'Glicose entra', vista: 'a', dur: 8, g: u => lerp(142, 108, sst(.1, 1, u)), ins: u => lerp(.9, .7, u), glu: u => .08, gli: u => lerp(.35, .85, sst(.1, 1, u)),
      cap: 'A insulina faz a glicose <b>entrar nas células</b> do músculo e da gordura. No <b>fígado</b> e no músculo, a glicose que sobra é guardada como <b>glicogênio</b>.' },
    { id: 'normal', nome: 'Glicemia normal', vista: 'a', dur: 6, g: u => lerp(108, 88, sst(0, .9, u)), ins: u => lerp(.7, .22, sst(0, .9, u)), glu: u => .12, gli: u => .85,
      cap: 'A <b>glicemia volta ao normal</b> e a insulina cai. A queda da glicose desliga o sinal para soltar insulina: é <b>retroalimentação negativa</b>.' },
    { id: 'jejum', nome: 'Jejum', vista: 'a', dur: 7, g: u => lerp(88, 71, sst(.1, 1, u)), ins: u => lerp(.22, .1, u), glu: u => lerp(.12, .35, u), gli: u => lerp(.85, .78, u),
      cap: 'Horas depois, em <b>jejum</b> ou durante o exercício, as células continuam gastando glicose e a glicemia <b>desce</b> para perto de 70 mg/dL.' },
    { id: 'alfa', nome: 'Células alfa', vista: 'b', dur: 8, g: u => lerp(71, 69, u), ins: u => .1, glu: u => lerp(.35, .9, sst(.1, .8, u)), gli: u => .78,
      cap: 'As <b>células alfa</b>, na borda da ilhota, percebem a glicose baixa e soltam <b>glucagon</b>, que segue pela veia porta até o <b>fígado</b>.' },
    { id: 'glicog', nome: 'Glicogenólise', vista: 'b', dur: 8, g: u => lerp(69, 86, sst(.15, 1, u)), ins: u => .12, glu: u => lerp(.9, .4, sst(.3, 1, u)), gli: u => lerp(.78, .4, sst(.1, 1, u)),
      cap: 'No fígado, o glucagon faz o <b>glicogênio</b> ser quebrado em glicose (<b>glicogenólise</b>), que volta ao sangue. A glicemia sobe de novo para a faixa normal.' },
    { id: 'diab', nome: 'Diabetes', vista: 'a', dur: 12, g: u => u < .5 ? lerp(100, 235, sst(.05, .4, u)) : lerp(235, 190, sst(.5, .7, u)), ins: u => u < .5 ? .03 : .85, glu: u => .2, gli: u => .4,
      cap: 'No <b>diabetes tipo 1</b>, o sistema imune destrói as células beta e falta insulina. No <b>tipo 2</b>, há insulina, mas as células respondem mal. Nos dois, a glicemia fica alta.' }
  ];
  const NE = ET.length;

  const HS = [
    { id: 'estA', c: COMIDA, t: 'Estômago', d: 'Recebe a refeição. A digestão do amido começa na boca, com a amilase da saliva, e termina no intestino delgado.', em: { a: ESTOM }, z: 3 },
    { id: 'panA', c: INS, t: 'Pâncreas', d: 'Glândula mista. As ilhotas lançam no sangue a insulina, que baixa a glicemia, e o glucagon, que a sobe. A parte exócrina faz o suco pancreático.', em: { a: [51.5, 59.6] }, z: 3 },
    { id: 'figA', c: GLIC, t: 'Fígado', d: 'Fica sob as costelas do lado direito. Guarda glicose como glicogênio quando há insulina e a devolve ao sangue quando chega glucagon.', em: { a: FIGA }, z: 2.6 },
    { id: 'musc', c: '#E5646B', t: 'Músculo', d: 'Com a insulina, as células do músculo abrem a entrada para a glicose. Usam parte dela no esforço e guardam o resto como glicogênio.', em: { a: BRACO }, z: 2.8 },
    { id: 'coxa', c: '#E5646B', t: 'Músculos da coxa', d: 'Os músculos são o maior destino da glicose depois da refeição. No exercício, eles gastam glicose e a glicemia cai.', em: { a: COXA }, z: 2.6 },
    { id: 'cor', c: GLI, t: 'Sangue', d: 'A glicemia é a quantidade de glicose no sangue. Em jejum fica entre cerca de 70 e 99 mg/dL. A partir de 126 mg/dL em jejum, o exame indica diabetes.', em: { a: CORA }, z: 2.6 },
    { id: 'figB', c: GLIC, t: 'Fígado', d: 'Recebe primeiro o sangue do intestino pela veia porta. Faz glicogênio com a insulina e o quebra em glicose com o glucagon.', em: { b: FIGB }, z: 1.8 },
    { id: 'ves', c: '#A9C54A', t: 'Vesícula biliar', d: 'Guarda a bile, que ajuda a digerir a gordura. Não participa do controle da glicemia.', em: { b: [15, 32] }, z: 2.4 },
    { id: 'duo', c: COMIDA, t: 'Duodeno', d: 'Começo do intestino delgado. Aqui e no resto do delgado, a glicose do amido é absorvida para o sangue.', em: { b: [16, 69] }, z: 2 },
    { id: 'panB', c: '#E8A07A', t: 'Pâncreas', d: 'A maior parte é exócrina e faz suco digestivo. Espalhadas nela ficam cerca de um milhão de ilhotas, a parte endócrina.', em: { b: [40, 62] }, z: 1.8 },
    { id: 'ilh', c: INS, t: 'Ilhota de Langerhans', d: 'Grupo pequeno de células endócrinas, espalhado entre os ácinos do pâncreas e cheio de capilares. É ela que aparece aberta e ampliada ao lado.', em: { b: ILHP }, z: 3 },
    { id: 'bet', c: INS, t: 'Células beta', d: 'Ficam no miolo da ilhota e são a maioria. Soltam insulina quando a glicose do sangue sobe. No diabetes tipo 1 são destruídas pelo sistema imune.', em: { b: [73, 29] }, z: 2.4 },
    { id: 'alf', c: GLU, t: 'Células alfa', d: 'Ficam na borda da ilhota. Soltam glucagon quando a glicose do sangue cai, como no jejum.', em: { b: [62, 33.5] }, z: 2.6 },
    { id: 'exo', c: '#F2E6C8', t: 'Tecido exócrino', d: 'Os ácinos em volta da ilhota fazem o suco pancreático, lançado no duodeno pelo ducto, e não no sangue.', em: { b: [90, 47] }, z: 2.6 },
    { id: 'porta', c: '#7C8CE0', t: 'Veia porta', d: 'Leva ao fígado o sangue do intestino, rico em glicose depois da refeição, e o do pâncreas, com a insulina e o glucagon.', em: { b: [34, 33] }, z: 2.4 },
    { id: 'esp', c: '#7C8CE0', t: 'Veia esplênica', d: 'Corre ao longo do pâncreas e recebe o sangue dele, com os hormônios das ilhotas. Desemboca na veia porta.', em: { b: [47, 47.5] }, z: 2.8 }
  ];
  const VAI = { estA: 0, panA: 3, figA: 4, musc: 4, coxa: 4, cor: 2, figB: 8, ves: 1, duo: 1, panB: 3, ilh: 3, bet: 3, alf: 7, exo: 3, porta: 1, esp: 3 };

  // ---------- estado e avanço ----------
  let FIG = null, ultAb = null, pedida = null, ultVista = null;
  const novo = () => ({ e: 0, u: RED ? 1 : 0, hold: 0, pausa: false });
  function ir(S, e, troca) {
    const v = S.vg; v.e = (e + NE) % NE; v.u = RED ? 1 : 0; v.hold = 0;
    if (troca && FIG && FIG.vistaAtual !== ET[v.e].vista) { pedida = ET[v.e].vista; FIG.mostrar(ET[v.e].vista); }
    sinc(S);
  }
  function sinc(S) {
    if (!NAV) return; const v = S.vg, k = v.e + '|' + v.pausa; if (k === sincK) return; sincK = k;
    NAV.querySelector('.et small').textContent = `Etapa ${v.e + 1} de ${NE}`;
    NAV.querySelector('.et b').textContent = ET[v.e].nome;
    const p = NAV.querySelector('[data-a="pausa"]'), tt = v.pausa ? 'Continuar a viagem' : 'Pausar a viagem';
    p.innerHTML = svg(v.pausa ? 'play' : 'pausa'); p.title = tt; p.setAttribute('aria-label', tt);
  }
  function avancar(S, dt) {
    const v = S.vg, et = ET[v.e];
    if (RED || v.pausa || !dt) return;
    if (v.u < 1) { v.u = Math.min(1, v.u + dt / et.dur); return; }
    v.hold += dt;
    if (v.e < NE - 1) { if (v.hold > 1.6) ir(S, v.e + 1, true); }
    else if (v.hold > 4) ir(S, 0, true);
  }

  // ---------- camada sobre a figura ----------
  function sobre(R, X, t, c) {
    const S = c.S; if (!S || !S.vg) return; Sx = S; vivo = performance.now();
    if (!FIG) FIG = c3.figura;
    const ab = FIG && FIG.aberto ? FIG.aberto.id : null;
    if (ab !== ultAb) { ultAb = ab; if (ab && VAI[ab] != null && VAI[ab] !== S.vg.e) ir(S, VAI[ab], false); }
    const vz = FIG ? FIG.vistaAtual : R.vista;
    if (vz !== ultVista) { const de = ultVista; ultVista = vz; if (de != null && vz !== pedida && ET[S.vg.e].vista !== vz) { const i = ET.findIndex(e => e.vista === vz); if (i >= 0) ir(S, i, false); } pedida = null; }
    avancar(S, S.dt || 0); pend = null;
    if (R.vista === ET[S.vg.e].vista) desenha(R, X, RED ? 0 : t, S.vg);
  }
  // célula-alvo: círculo com "portas"; abre = 0 fechada, 1 aberta; a glicose em volta entra quando abre
  function celula(X, R, p, abre, t, dentro, i) {
    const s = R.pt(p[0], p[1]), rr = cl(R.s * 1.9, 8, 18);
    X.beginPath(); X.arc(s[0], s[1], rr, 0, TAU); X.fillStyle = 'rgba(11,15,28,.6)'; X.fill();
    X.strokeStyle = rgba(abre > .5 ? OK : CEL, .9); X.lineWidth = 2; X.setLineDash(abre > .5 ? [] : [3, 3]); X.stroke(); X.setLineDash([]);
    for (let k = 0; k < 4; k++) {
      const a0 = k * PI / 2 + .3, ab = .12 + .35 * abre;   // portas (transportadores) que se abrem
      X.beginPath(); X.arc(s[0], s[1], rr, a0 - ab, a0 + ab); X.strokeStyle = rgba(abre > .5 ? OK : '#6B7799', 1); X.lineWidth = 4; X.stroke();
    }
    const gr = Math.max(3, rr * .28);
    for (let k = 0; k < 4; k++) {
      const w = RED ? .5 : ((t * .45 + k / 4 + i * .17) % 1), a = k * PI / 2 + .3 + i;
      if (abre > .5) { const D = rr * (2.3 - w * 2.1); glicose(X, s[0] + Math.cos(a) * D, s[1] + Math.sin(a) * D, gr, Math.min(1, (1 - w) * 2) * .95); }
      else { const D = rr * 1.6 + Math.sin(w * TAU) * 2; glicose(X, s[0] + Math.cos(a + w * .8) * D, s[1] + Math.sin(a + w * .8) * D, gr, .9); }
    }
    if (dentro > 0) dot(X, s[0], s[1], rr * .42 * dentro, GLIC, .9);
  }
  function desenha(R, X, t, v) {
    const et = ET[v.e], u = RED ? .7 : eIO(v.u), r = cl(R.s * .75, 3.2, 8), P = p => R.pt(p[0], p[1]);
    const sangue = (n, al) => cSangue.forEach((C, i) => C.fluxo(X, R, t, { n, v: .12, off: i * .13, a: al, d: (x, y, a) => glicose(X, x, y, r * .9, a) }));
    if (et.id === 'ref') {
      cComida.rastro(X, R, u, rgba(COMIDA, .55));
      const p = cComida.em(u), s = P(p), rb = cl(R.s * 1.6, 7, 16);
      brilho(X, s[0], s[1], rb * 3, COMIDA, .8); dot(X, s[0], s[1], rb, COMIDA, 1); X.strokeStyle = 'rgba(11,15,28,.7)'; X.lineWidth = 1.2; X.beginPath(); X.arc(s[0], s[1], rb, 0, TAU); X.stroke();
      for (let k = 0; k < 3; k++) { const a = (RED ? 0 : t * 1.6) + k * 2.1; glicose(X, s[0] + Math.cos(a) * rb * .55, s[1] + Math.sin(a) * rb * .55, rb * .32, .4 + .6 * sst(.5, 1, v.u)); }
      sangue(2, .5);
      legR(X, R, [[COMIDA, 'refeição com amido'], [GLI, 'glicose no sangue']], 'dir');
    } else if (et.id === 'sobe') {
      sangue(Math.round(lerp(3, 6, v.u)), 1);
      const c = P(CORA); anel(X, c[0], c[1], t, GLI, 1.4, R.s * 5, 0, .8);
      ALVOS.forEach((a, i) => celula(X, R, a, 0, t, 0, i));
      legR(X, R, [[GLI, 'glicose no sangue'], [CEL, 'células ainda fechadas']], 'dir');
    } else if (et.id === 'entra') {
      const pa = P(PANC); anel(X, pa[0], pa[1], t, INS, 1.4, R.s * 4.5, 0, .9);
      cInsA.forEach((C, i) => C.fluxo(X, R, t, { n: 3, v: .22, off: i * .15, d: (x, y, a) => hormonio(X, x, y, r * .8, INS, a) }));
      sangue(3, 1 - sst(.4, 1, v.u) * .5);
      ALVOS.forEach((a, i) => celula(X, R, a, sst(.1 + i * .05, .35 + i * .05, v.u) + (RED ? 1 : 0), t, i === 2 ? sst(.3, 1, v.u) + (RED ? 1 : 0) : 0, i));
      legR(X, R, [[INS, 'insulina'], [GLI, 'glicose entrando nas células'], [GLIC, 'glicogênio no fígado']], 'dir');
    } else if (et.id === 'normal') {
      sangue(2, 1);
      ALVOS.forEach((a, i) => celula(X, R, a, 1 - sst(.4, 1, v.u) * .6, t, i === 2 ? 1 : 0, i));
      legR(X, R, [[GLI, 'glicose na faixa normal'], [GLIC, 'glicogênio guardado']], 'dir');
    } else if (et.id === 'jejum') {
      sangue(Math.round(lerp(2, 1, v.u)) + 1, lerp(1, .6, v.u));
      ALVOS.forEach((a, i) => { const s = P(a), rr = cl(R.s * 1.9, 8, 18); anel(X, s[0], s[1], t, ALTO, 1.8, rr * 1.2, i * .3, .6); celula(X, R, a, .3, t, i === 2 ? 1 : 0, i); });
      legR(X, R, [[GLI, 'menos glicose no sangue'], [ALTO, 'células gastando glicose']], 'dir');
    } else if (et.id === 'diab') {
      const pa = P(PANC);
      if (v.u < .5) {
        // tipo 1: as ilhotas não soltam insulina
        brilho(X, pa[0], pa[1], R.s * 6, ERRO, .7); X.save(); X.strokeStyle = ERRO; X.lineWidth = 3; X.lineCap = 'round'; const d = R.s * 1.8;
        X.beginPath(); X.moveTo(pa[0] - d, pa[1] - d); X.lineTo(pa[0] + d, pa[1] + d); X.moveTo(pa[0] + d, pa[1] - d); X.lineTo(pa[0] - d, pa[1] + d); X.stroke(); X.restore();
        sangue(6, 1); ALVOS.forEach((a, i) => celula(X, R, a, 0, t, 0, i));
        legR(X, R, [[ERRO, 'tipo 1: células beta destruídas'], [GLI, 'glicose sobrando no sangue']], 'dir');
      } else {
        // tipo 2: a insulina chega, mas as portas quase não abrem (resistência)
        anel(X, pa[0], pa[1], t, INS, 1.2, R.s * 4.5, 0, .9);
        cInsA.forEach((C, i) => C.fluxo(X, R, t, { n: 3, v: .22, off: i * .15, d: (x, y, a) => hormonio(X, x, y, r * .8, INS, a) }));
        sangue(5, 1); ALVOS.forEach((a, i) => celula(X, R, a, .2, t, 0, i));
        legR(X, R, [[INS, 'tipo 2: há insulina'], [CEL, 'células resistentes, portas quase fechadas']], 'dir');
      }
    } else if (et.id === 'abs') {
      const d = P([18, 72]); anel(X, d[0], d[1], t, COMIDA, 1.6, R.s * 4, 0, .8);
      cAbs.rastro(X, R, u, rgba(GLI, .55));
      cAbs.fluxo(X, R, t, { n: 8, v: .12, a: sst(0, .4, v.u) + (RED ? 1 : 0), d: (x, y, a) => glicose(X, x, y, r, a) });
      const p = cAbs.em(u), s = P(p); brilho(X, s[0], s[1], r * 5, GLI, .9); glicose(X, s[0], s[1], r * 1.5, 1);
      legR(X, R, [[GLI, 'glicose absorvida pela veia porta']], 'baixodir');
    } else if (et.id === 'beta' || et.id === 'alfa') {
      const beta = et.id === 'beta', cor = beta ? INS : GLU, CEL2 = beta ? BETA : ALFA, k = sst(.05, .4, v.u) + (RED ? 1 : 0);
      CEL2.forEach((p, i) => { const q = P(p); brilho(X, q[0], q[1], R.s * 2.6, cor, k * (RED ? .8 : .6 + .4 * Math.sin(t * 3 + i))); });
      // grãos do hormônio saindo das células para os capilares da borda
      CEL2.forEach((p, i) => {
        if (i % 2) return; const q = P(p), ang = Math.atan2((p[1] - ILH[1]) / 1.3, p[0] - ILH[0]) + (beta ? .3 : 0), w = RED ? .5 : ((t * .45 + i * .13) % 1), D = R.s * (beta ? 1 + w * 8 : 1 + w * 4.5);
        hormonio(X, q[0] + Math.cos(ang) * D, q[1] + Math.sin(ang) * D, r * .7, cor, (1 - w) * k);
      });
      const ip = P(ILHP); anel(X, ip[0], ip[1], t, cor, 1.3, R.s * 3.5, 0, .9 * k);
      cIlhota.rastro(X, R, u, rgba(cor, .5));
      cIlhota.fluxo(X, R, t, { n: 6, v: .14, a: sst(.3, .6, v.u) + (RED ? 1 : 0), d: (x, y, a) => hormonio(X, x, y, r * .8, cor, a) });
      const s = P(cIlhota.em(u)); hormonio(X, s[0], s[1], r * 1.3, cor, 1);
      if (!beta) { const f = P(FIGB); anel(X, f[0], f[1], t, GLU, 1.6, R.s * 6, 0, .8 * sst(.6, 1, v.u)); }
      legR(X, R, beta ? [[INS, 'insulina das células beta'], [GLI, 'glicose alta no sangue']] : [[GLU, 'glucagon das células alfa'], [GLI, 'glicose baixa no sangue']], 'baixodir');
    } else if (et.id === 'glicog') {
      // grânulos de glicogênio no fígado se desfazem e a glicose sai para o sangue
      FIGPTS.forEach((p, i) => {
        const q = P(p), sobra = 1 - sst(.1 + i * .06, .55 + i * .06, v.u) * (RED ? 0 : 1) - (RED ? .5 : 0);
        for (let j = 0; j < 5; j++) { const a = j * 1.26 + i, D = R.s * (.9 + j * .15); dot(X, q[0] + Math.cos(a) * D, q[1] + Math.sin(a) * D, Math.max(2, r * .5), GLIC, cl(sobra, 0, 1) * .9); }
        const w = RED ? .5 : ((t * .3 + i / FIGPTS.length) % 1), ang = -.6 + i * .25;
        glicose(X, q[0] + Math.cos(ang) * R.s * (1 + w * 9), q[1] + Math.sin(ang) * R.s * (1 + w * 9) - w * R.s * 4, r * .9, (1 - w) * sst(.15, .5, v.u) + (RED ? .6 : 0));
      });
      cIlhota.fluxo(X, R, t, { n: 3, v: .12, a: 1 - sst(.3, 1, v.u), d: (x, y, a) => hormonio(X, x, y, r * .7, GLU, a) });
      legR(X, R, [[GLIC, 'glicogênio sendo quebrado'], [GLI, 'glicose voltando ao sangue'], [GLU, 'glucagon']], 'baixodir');
    }
  }

  // ---------- painel: medidor de glicemia, hormônios e glicogênio ----------
  const G0 = 40, G1 = 250;
  const estado = (g, e) => e === NE - 1 && g >= 126 ? ['alta: diabetes', ERRO] : g < 70 ? ['baixa', BAIXO] : g < 100 ? ['normal em jejum', OK] : g <= 140 ? ['alta depois da refeição', ALTO] : ['alta', ERRO];
  function medidor(X, x, y, w, g, e, comp) {
    const [st, c] = estado(g, e), gx = v => x + w * cl((v - G0) / (G1 - G0), 0, 1);
    txt(X, `${Math.round(g)} mg/dL`, x, y + 8, { s: comp ? 14 : 16, c: GLI, w: 700 });
    txt(X, st, x + w, y + 8, { s: 12, c, a: 'right', w: 600 });
    const by = y + (comp ? 27 : 30), bh = comp ? 9 : 12;
    X.fillStyle = 'rgba(255,255,255,.08)'; X.beginPath(); X.roundRect(x, by, w, bh, bh / 2); X.fill();
    X.fillStyle = 'rgba(127,212,138,.3)'; X.fillRect(gx(70), by, gx(99) - gx(70), bh);
    X.strokeStyle = 'rgba(127,212,138,.8)'; X.lineWidth = 1; X.strokeRect(gx(70) + .5, by + .5, gx(99) - gx(70) - 1, bh - 1);
    X.save(); X.setLineDash([3, 3]); X.strokeStyle = rgba(ERRO, .8); X.beginPath(); X.moveTo(gx(126), by - 3); X.lineTo(gx(126), by + bh + 3); X.stroke(); X.restore();
    X.fillStyle = rgba(GLI, .85); X.beginPath(); X.roundRect(x, by + 2, Math.max(4, gx(g) - x), bh - 4, (bh - 4) / 2); X.fill();
    const nx = gx(g); X.beginPath(); X.moveTo(nx, by - 2); X.lineTo(nx - 6, by - 9); X.lineTo(nx + 6, by - 9); X.closePath(); X.fillStyle = TXT; X.fill(); X.fillRect(nx - 1, by - 2, 2, bh + 4);
    if (!comp) {
      txt(X, '70', gx(70), by + bh + 11, { s: 11, c: OK, w: 500, a: 'center' }); txt(X, '99', gx(99), by + bh + 11, { s: 11, c: OK, w: 500, a: 'center' });
      txt(X, '126', gx(126), by + bh + 11, { s: 11, c: ERRO, w: 500, a: 'center' }); txt(X, '200', gx(200), by + bh + 11, { s: 11, c: DIM, w: 500, a: 'center' });
      txt(X, 'faixa normal em jejum: cerca de 70 a 99', x, by + bh + 29, { s: 11, c: DIM, w: 500 });
    }
  }
  function linha(X, x, y, w, nome, val, cor, lw) {
    txt(X, nome, x, y, { s: 12, c: cor, w: 600 });
    const bx = x + (lw || 96), bw = w - (lw || 96); X.fillStyle = 'rgba(255,255,255,.08)'; X.beginPath(); X.roundRect(bx, y - 4, bw, 8, 4); X.fill();
    X.fillStyle = cor; X.beginPath(); X.roundRect(bx, y - 4, Math.max(4, bw * cl(val, 0, 1)), 8, 4); X.fill();
  }
  // glicogênio: cadeia ramificada de glicoses, mais longa quanto mais estoque
  function glicogenio(X, x, y, w, val) {
    const n = Math.round(4 + val * 18), d = 9;
    for (let i = 0; i < n; i++) {
      const ramo = Math.floor(i / 6), j = i % 6, px = x + 8 + j * d * 1.25 + ramo * 6, py = y + ramo * 10 - (ramo % 2) * 2;
      if (px > x + w - 6) continue;
      glicose(X, px, py, 4, .95, GLIC);
    }
  }
  function painel(X, b, t, S, v) {
    const et = ET[v.e], u = v.u, g = et.g(u), ins = et.ins(u), glu = et.glu(u), gl = et.gli(u);
    if (!b.comp) {
      const px = b.x + 18, pw = b.w - 36;
      medidor(X, px, b.y + 64, pw, g, v.e, false);
      X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(px, b.y + 158, pw, 1);
      linha(X, px, b.y + 180, pw, 'Insulina', ins, INS);
      linha(X, px, b.y + 206, pw, 'Glucagon', glu, GLU);
      txt(X, 'Glicogênio no fígado e no músculo', px, b.y + 236, { s: 12, c: GLIC, w: 600 });
      glicogenio(X, px, b.y + 258, pw, gl);
      X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(px, b.y + 300, pw, 1);
      if (et.id === 'diab') {
        const t1 = u < .5;
        [['Tipo 1', 'falta insulina; tratamento com insulina', t1], ['Tipo 2', 'resistência à insulina; dieta, exercício e remédios', !t1]].forEach(([n, d, on], i) => {
          const y = b.y + 312 + i * 50; X.fillStyle = on ? 'rgba(224,96,92,.16)' : 'rgba(255,255,255,.04)'; X.beginPath(); X.roundRect(px, y, pw, 44, 8); X.fill();
          X.strokeStyle = on ? ERRO : 'rgba(255,255,255,.12)'; X.lineWidth = on ? 2 : 1; X.stroke();
          txt(X, n, px + 10, y + 14, { s: 13, c: on ? TXT : DIM }); txt(X, d, px + 10, y + 31, { s: 11, c: DIM, w: 500 });
        });
      } else {
        const msg = ins > .5 ? ['Insulina alta: a glicose entra nas células', INS] : glu > .5 ? ['Glucagon alto: o fígado solta glicose', GLU] : ['Os dois hormônios em equilíbrio', DIM];
        txt(X, 'Quem manda agora', px, b.y + 322, { s: 12, c: DIM, w: 500 });
        txt(X, msg[0], px, b.y + 344, { s: 13, c: msg[1] });
        txt(X, 'Hormônios opostos: um baixa, o outro sobe.', px, b.y + 370, { s: 12, c: DIM, w: 500 });
      }
    } else {
      const px = b.x + 12, pw = b.w - 24, hw = (pw - 14) / 2;
      medidor(X, px, b.y + 56, pw, g, v.e, true);
      linha(X, px, b.y + 112, hw, 'Insulina', ins, INS, 62);
      linha(X, px + hw + 14, b.y + 112, hw, 'Glucagon', glu, GLU, 68);
      txt(X, et.id === 'diab' ? (u < .5 ? 'Tipo 1: falta insulina' : 'Tipo 2: células resistentes') : 'Faixa normal em jejum: cerca de 70 a 99 mg/dL', px, b.y + 134, { s: 12, c: et.id === 'diab' ? ERRO : DIM, w: 500 });
    }
  }

  function fora(X, t, c) {
    const S = c.S; if (!S || !S.vg) return; montarNav(); sinc(S); NAV.hidden = false;
    const b = painelBox();
    X.fillStyle = 'rgba(11,15,28,.76)'; X.beginPath(); X.roundRect(b.x, b.y, b.w, b.h, b.comp ? 12 : 14); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
    posNav(b.x + (b.comp ? 6 : 10), b.y + (b.comp ? 6 : 10), b.w - (b.comp ? 12 : 20));
    painel(X, b, RED ? 0 : t, S, S.vg);
    if (pend) { if (pend[0] === 'linha') legLinha(X, pend[1], pend[2], pend[3], W - 12); else leg(X, pend[0], pend[1], pend[2], pend[3]); pend = null; }
    cap(ET[S.vg.e].cap);
  }

  // ---------- registro: figura padrão; o gráfico antigo do dia fica atrás de "Ver esquema" ----------
  if (c3.extra && c3.extra[0]) c3.extra[0] = Object.assign({}, c3.extra[0], { t: 'Viagem da glicose' });
  const d3 = c3.draw, i0 = c3.init; let chamou3 = false, em3d = false;
  c3.draw = function (...a) { chamou3 = true; return d3.apply(this, a); };
  const amb = {
    SC, X: () => X, W: () => W, H: () => H, nar: () => NAR, tela: cv.parentNode, plano() {},
    t: a => a[0], rot3d: 'Ver esquema', dica3d: '',
    esconder: ['.hud.onde'], esconderFig: []
  };
  LAB_FIGALT.cena(amb, K, {
    pref: 'anatomia', nome: 'Viagem da glicose depois da refeição', mask: { miolo: .86, borda: 1 },
    vistas: [
      ['a', 'endocrino-glandulas-a', 'Corpo', 'Corpo translúcido com as glândulas endócrinas acesas: o pâncreas fica atrás do estômago', [.27, .05, .46, .8]],
      ['b', 'endocrino-glicemia-v5b', 'Pâncreas e ilhota', 'Fígado e vesícula, duodeno, pâncreas e a veia porta, com uma ilhota de Langerhans aberta: células beta no miolo, células alfa na borda e capilares entre elas']
    ],
    hs: HS, manter: () => caixa(FAIXA), sobre, fora
  });
  const dFig = c3.draw, i1 = c3.init;
  c3.init = function (S) { i1.call(this, S); if (i0) i0.call(c3, S); S.vg = novo(); sincK = ''; ultAb = null; ultVista = null; pedida = null; };
  c3.draw = function (t, S) {
    if (!S.vg) S.vg = novo();
    if (S.modo !== MODO && !em3d) { X.save(); try { d3.call(c3, t, S); } catch (e) { console.error(e); } X.restore(); return; }
    chamou3 = false; const r = dFig.call(this, t, S); em3d = chamou3; return r;
  };
})();
