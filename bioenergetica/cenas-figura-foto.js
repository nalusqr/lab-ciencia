/* LAB Bioenergética: "Visão geral da fotossíntese" como viagem sobre figuras de IA realistas, no padrão de
   anatomia/cenas-figura-digestorio.js (Martin).
   Vista A: planta inteira com a raiz no solo e uma folha em corte (cutícula, paliçádico, lacunoso, nervura com xilema
   e floema, estômatos na face de baixo), Nano Banana 2. Vista B: o cloroplasto em corte que a rota já usava.
   Etapas: a luz chega, a água sobe da raiz pelo xilema, o CO₂ entra pelo estômato, a fase clara quebra a água nos
   tilacoides (O₂, ATP e NADPH), o ciclo de Calvin monta a glicose no estroma e o açúcar sai pelo floema.
   Medidor de O₂ liberado e de ATP; as moléculas (H₂O, CO₂, O₂, glicose) mudam de estado na etapa certa.
   Tocar num ponto leva a viagem até ele; a vista B entra sozinha na fase clara. O controle de luz continua valendo:
   com pouca luz a fase clara rende menos, sem luz ela para. O 3D antigo segue atrás de "Ver em 3D".
   Com prefers-reduced-motion nada anda sozinho: etapas por botão. Usa os globais do motor (SC, X, W, H, NAR, cap, cv).
   Carregar depois de cenas-figura.js e antes de LAB8_iniciar(). Texto: sem "!", sem setas ou pontos como separador. */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const K = 'foto/geral', c3 = SC[K]; if (!c3) return;
  const RED = LAB_FIGALT.RED, PI = Math.PI, TAU = PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
  const sst = (a, b, x) => { const u = cl((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const eIO = u => { u = cl(u, 0, 1); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
  const FT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const TXT = '#E8EDF7', DIM = '#9DA9C4';
  const LUZ = '#FFE58A', AGUA = '#7CC8F2', CO2 = '#C9CFDC', O2 = '#FF8A8A', GLI = '#FFE1A6', ATP = '#FFB870', NADPH = '#9CC8FF', CLORO = '#7FDA9C', OX = '#F0605C', HID = '#F2F5FB', CARB = '#4B5468';

  // ---------- desenho básico ----------
  function dot(X, x, y, r, c, a) { X.globalAlpha = cl(a, 0, 1); X.beginPath(); X.arc(x, y, Math.max(.1, r), 0, TAU); X.fillStyle = c; X.fill(); X.globalAlpha = 1; }
  function brilho(X, x, y, r, c, a) { if (a <= 0) return; const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(c, .55 * cl(a, 0, 1))); g.addColorStop(1, rgba(c, 0)); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); }
  function txt(X, s, x, y, o = {}) { X.font = `${o.w || 600} ${o.s || 13}px ${FT}`; X.fillStyle = o.c || TXT; X.textAlign = o.a || 'left'; X.textBaseline = 'middle'; X.fillText(s, x, y); }
  function anel(X, x, y, t, cor, per, rmax, off, al) {
    if (RED) { X.beginPath(); X.arc(x, y, rmax * .6, 0, TAU); X.strokeStyle = rgba(cor, .55); X.lineWidth = 1.5; X.stroke(); return; }
    const u = (((t + (off || 0)) / per) % 1 + 1) % 1;
    X.beginPath(); X.arc(x, y, 4 + rmax * (1 - Math.pow(1 - u, 3)), 0, TAU); X.strokeStyle = rgba(cor, (al == null ? .85 : al) * (1 - u)); X.lineWidth = 2; X.stroke();
  }
  // átomo com contorno escuro, para ler sobre qualquer fundo
  function atomo(X, x, y, r, c, a) { X.globalAlpha = cl(a, 0, 1); X.beginPath(); X.arc(x, y, r + 1.2, 0, TAU); X.fillStyle = 'rgba(11,15,28,.8)'; X.fill(); X.globalAlpha = 1; dot(X, x, y, r, c, a); dot(X, x - r * .3, y - r * .3, r * .32, '#FFFFFF', a * .6); }
  // moléculas desenhadas como bolinhas (O vermelho, H branco, C cinza-escuro)
  function molAgua(X, x, y, r, a, quebra) {
    const q = quebra || 0, d = r * 1.05 + q * r * 2.2;
    atomo(X, x + Math.cos(-.9) * d, y + Math.sin(-.9) * d * (1 - q) - q * r * 1.2, r * .6, HID, a);
    atomo(X, x + Math.cos(PI + .9) * d, y + Math.sin(PI + .9) * d * (1 - q) - q * r * 1.2, r * .6, HID, a);
    atomo(X, x, y + q * r * .6, r, OX, a);
  }
  function molCO2(X, x, y, r, a) { atomo(X, x - r * 1.55, y, r * .85, OX, a); atomo(X, x + r * 1.55, y, r * .85, OX, a); atomo(X, x, y, r, CARB, a); }
  function molO2(X, x, y, r, a) { atomo(X, x - r * .8, y, r * .9, OX, a); atomo(X, x + r * .8, y, r * .9, OX, a); }
  function molGli(X, x, y, r, a) {
    X.save(); X.globalAlpha = cl(a, 0, 1); X.beginPath();
    for (let i = 0; i < 6; i++) { const ang = PI / 6 + i * PI / 3; X.lineTo(x + Math.cos(ang) * r * 1.4, y + Math.sin(ang) * r * 1.4); }
    X.closePath(); X.fillStyle = 'rgba(11,15,28,.8)'; X.lineWidth = 3.4; X.strokeStyle = 'rgba(11,15,28,.8)'; X.stroke(); X.fillStyle = GLI; X.fill(); X.lineWidth = 1.2; X.strokeStyle = '#B98C4C'; X.stroke(); X.restore();
  }
  function chip(X, x, y, s, cor, a, fs) {
    X.save(); X.globalAlpha = cl(a, 0, 1); X.font = `700 ${fs || 11}px ${FT}`; X.textAlign = 'center'; X.textBaseline = 'middle';
    const w = X.measureText(s).width + 12, h = (fs || 11) + 8;
    X.fillStyle = 'rgba(11,15,28,.88)'; X.strokeStyle = cor; X.lineWidth = 1.5; X.beginPath(); X.roundRect(x - w / 2, y - h / 2, w, h, h / 2); X.fill(); X.stroke();
    X.fillStyle = cor; X.fillText(s, x, y + .5); X.restore();
  }
  // fóton: pacote de onda amarelo que anda de a até b
  function foton(X, ax, ay, bx, by, f, a, s) {
    const L = Math.hypot(bx - ax, by - ay) || 1, ux = (bx - ax) / L, uy = (by - ay) / L, nx = -uy, ny = ux, cx = lerp(ax, bx, f), cy = lerp(ay, by, f), len = Math.max(16, s * 6);
    X.save(); X.globalAlpha = cl(a, 0, 1); X.strokeStyle = LUZ; X.lineWidth = 2; X.lineCap = 'round'; X.beginPath();
    for (let i = 0; i <= 16; i++) { const k = i / 16 - .5, w = Math.sin(i / 16 * TAU * 2) * Math.max(2.5, s * .7) * Math.sin(PI * i / 16); X.lineTo(cx + ux * k * len + nx * w, cy + uy * k * len + ny * w); }
    X.stroke(); X.restore(); brilho(X, cx + ux * len * .5, cy + uy * len * .5, Math.max(6, s * 2), LUZ, a * .8);
  }
  function leg(X, x, y, itens, nar) {
    X.save(); X.font = `600 ${nar ? 12 : 13}px ${FT}`; X.textBaseline = 'middle'; X.textAlign = 'left';
    const w = Math.max(...itens.map(i => X.measureText(i[1]).width)) + 34, h = itens.length * 20 + 10;
    X.fillStyle = 'rgba(11,15,28,.82)'; X.beginPath(); X.roundRect(x, y, w, h, 8); X.fill();
    itens.forEach((it, i) => { dot(X, x + 14, y + 15 + i * 20, 4.5, it[0], 1); X.fillStyle = TXT; X.fillText(it[1], x + 26, y + 15 + i * 20); });
    X.restore();
  }
  let pend = null, FX = 150;
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
    if (compacto()) { const cx = caixa(FX); pend = ['linha', cx.x + cx.w / 2, cx.y + cx.h + LEGH / 2, itens]; return; }
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
      // várias moléculas correndo pelo caminho; paradas no modo reduzido
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
    const st = document.createElement('style'); st.id = 'ft-css';
    st.textContent = `.ft-nav{position:absolute;left:0;top:0;z-index:2;display:flex;align-items:center;gap:6px}
.ft-nav[hidden]{display:none}
.ft-nav button{font:inherit;width:44px;height:44px;flex:none;display:grid;place-items:center;border-radius:10px;border:1px solid var(--line-strong,#5B6C99);background:rgba(19,26,43,.92);color:var(--txt,#E8EDF7);cursor:pointer;transition:background-color 90ms,border-color 90ms,color 90ms}
.ft-nav button:hover{background:var(--panel-2,#1B2440);border-color:var(--amber,#FFB347)}
.ft-nav button:active{transform:scale(.96)}
.ft-nav button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
.ft-nav button svg{width:22px;height:22px}
.ft-nav button[hidden]{display:none}
.ft-nav .et{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;padding:0 6px;line-height:1.2}
.ft-nav .et small{font-size:12px;color:var(--dim,#9DA9C4)}
.ft-nav .et b{font-size:15px;font-weight:600;color:var(--txt,#E8EDF7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(prefers-reduced-motion:reduce){.ft-nav button{transition:none}.ft-nav button:active{transform:none}}`;
    document.head.appendChild(st);
    NAV = document.createElement('div'); NAV.className = 'ft-nav'; NAV.hidden = true; NAV.setAttribute('role', 'group'); NAV.setAttribute('aria-label', 'Viagem da fotossíntese: etapas');
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
  const capRes = () => NAR ? 100 : 84;
  const PW = 312, FAIXA = 150, ALTO = 392;
  function caixa(fh) {
    if (!compacto()) { const x = 28 + PW + 14; return { x, y: 60, w: W - x - 24, h: H - 60 - capRes() }; }
    const x0 = NAR ? 6 : 24, y0 = NAR ? 46 : 60; return { x: x0, y: y0, w: W - 2 * x0, h: H - y0 - (capRes() + fh + 8) - (fh ? LEGH : 0) };
  }
  function painelBox() {
    if (!compacto()) return { x: 28, y: 60, w: PW, h: ALTO, comp: false };
    const x0 = NAR ? 6 : 24; return { x: x0, y: H - capRes() - FAIXA - 4, w: W - 2 * x0, h: FAIXA, comp: true };
  }

  // =====================================================================================================
  // Figura A (planta e folha em corte, 1200 x 896) e figura B (cloroplasto em corte, 1168 x 880)
  // Pontos conferidos sobre as imagens, em % da figura.
  // =====================================================================================================
  const AR = [1.34, 1];
  const cAgua = caminho([[20, 71], [19.9, 63], [19.8, 56], [19.6, 48], [19.4, 42], [20.5, 38.4], [24, 38], [27.5, 39], [30, 40.5], [37, 44], [44, 49], [50, 52.5], [55.5, 53.5], [58, 49], [59.5, 42], [60, 36]], AR);
  const cCO2 = caminho([[46.5, 96], [47.5, 87], [48, 77], [48.6, 71.5], [46.6, 65], [45.4, 57], [46.6, 48], [48.5, 41], [50, 36]], AR);
  const cCO2b = caminho([[67, 96], [67.5, 89], [67.5, 82], [68, 75], [70.5, 68], [72, 60], [71, 50], [69.5, 42]], AR);
  const cAcucar = caminho([[60, 36], [61, 44], [61.5, 52], [59.5, 60], [57.5, 64.5], [52, 60], [45, 53], [38, 46.5], [30, 40.5], [26, 38.6], [21, 38.6], [19.5, 43], [19.7, 52], [19.9, 60], [20, 70]], AR);
  const cO2sai = [caminho([[50, 40], [47, 50], [46.6, 62], [48.4, 71], [48, 77], [47.4, 86], [46.5, 96]], AR), caminho([[69.5, 42], [71.5, 54], [70.5, 68], [68, 75], [67.5, 82], [67.2, 90], [67, 97]], AR)];
  const FOLHAS = [[9.5, 27.4], [17, 23], [27, 29], [31, 41], [13.5, 34], [22.5, 31.5]];
  const TOPO = [[46, 21], [58, 19], [70, 17], [82, 16], [92, 17], [54, 28], [66, 27], [78, 27]];
  const PAL = [[44, 31], [50, 32], [56, 33], [62, 33], [68, 33], [74, 33], [80, 32]];
  const ESTOM = [[48, 77], [67.5, 82]];
  // vista B: grana (topo da pilha) e o lugar do ciclo de Calvin no estroma
  const GRANA = [[52, 42], [25.5, 35], [44, 25], [63, 24], [76, 33], [30, 61], [84, 54]];
  const GC = [52, 52], CALV = [65, 61];
  const cH2Ob = caminho([[2, 47], [8, 49], [14, 52], [24, 56], [34, 54], [44, 53], [51, 52]], AR);
  const cO2b = caminho([[50, 47], [44, 37], [36, 28], [26, 20], [16, 12], [8, 5]], AR);
  const cATP = caminho([[53, 56], [56, 60], [59, 62.5], [62.5, 62]], AR);
  const cATP2 = caminho([[78, 42], [75, 48], [71, 53], [67.5, 57.5]], AR);
  const cADP = caminho([[63, 57], [60, 54.5], [57, 51], [54, 47]], AR);
  const cCO2c = caminho([[99, 66], [94, 66], [86, 67], [77, 65], [70, 63]], AR);
  const cGli = caminho([[64, 66], [62, 72], [60, 78], [58, 84], [56, 92]], AR);

  const ET = [
    { id: 'luz', nome: 'A luz chega', vista: 'a', dur: 5,
      cap: 'A <b>luz</b> do Sol chega às folhas. Logo abaixo da epiderme, o <b>parênquima paliçádico</b> tem células cheias de <b>cloroplastos</b>, que captam a luz com a clorofila.' },
    { id: 'agua', nome: 'Água pela raiz', vista: 'a', dur: 8,
      cap: 'A <b>água</b> entra pelas <b>raízes</b> e sobe pelo <b>xilema</b> do caule até a nervura da folha. Dali passa para as células do mesófilo.' },
    { id: 'co2', nome: 'CO₂ no estômato', vista: 'a', dur: 7,
      cap: 'O <b>CO₂</b> do ar entra pelos <b>estômatos</b>, na face de baixo da folha, e se espalha pelos espaços de ar do parênquima lacunoso até os cloroplastos.' },
    { id: 'clara', nome: 'Fase clara', vista: 'b', dur: 9,
      cap: 'Na <b>fase clara</b>, na membrana dos <b>tilacoides</b>, a luz quebra a <b>água</b> (fotólise). Sai <b>O₂</b>, e a energia fica guardada em <b>ATP</b> e <b>NADPH</b>.' },
    { id: 'calvin', nome: 'Ciclo de Calvin', vista: 'b', dur: 9,
      cap: 'No <b>estroma</b>, o <b>ciclo de Calvin</b> fixa o CO₂ com a enzima rubisco e gasta o ATP e o NADPH da fase clara para montar a <b>glicose</b>.' },
    { id: 'floema', nome: 'Açúcar no floema', vista: 'a', dur: 9,
      cap: 'A glicose vira <b>sacarose</b>, que sai da folha pelo <b>floema</b> e alimenta caule, raízes e frutos. O <b>O₂</b> sai da folha pelos estômatos.' }
  ];
  const NE = ET.length;
  const HS = [
    { id: 'raiz', c: '#E8C48A', t: 'Raiz', d: 'Absorve água e sais minerais do solo, principalmente pelos pelos absorventes perto da ponta.', em: { a: [20, 68] }, z: 2.6 },
    { id: 'caule', c: AGUA, t: 'Caule', d: 'Por dentro dele correm o xilema, que sobe com a água e os sais (seiva bruta), e o floema, que leva o açúcar (seiva elaborada).', em: { a: [19.5, 46] }, z: 2.6 },
    { id: 'folha', c: CLORO, t: 'Folha', d: 'Principal órgão da fotossíntese: larga e fina, recebe muita luz e troca gases pelos estômatos.', em: { a: [30, 40.5] }, z: 2.6 },
    { id: 'epi', c: '#E8F4FF', t: 'Cutícula e epiderme', d: 'Camada transparente que deixa a luz passar. A cutícula de cera reduz a perda de água.', em: { a: [58, 23] }, z: 2.4 },
    { id: 'pal', c: CLORO, t: 'Parênquima paliçádico', d: 'Células alongadas e cheias de cloroplastos, logo abaixo da epiderme de cima. É onde ocorre a maior parte da fotossíntese.', em: { a: [60, 36] }, z: 2.4 },
    { id: 'lac', c: '#A9C54A', t: 'Parênquima lacunoso', d: 'Células soltas, com espaços de ar entre elas, por onde o CO₂ que entrou pelos estômatos chega às células.', em: { a: [71, 58] }, z: 2.4 },
    { id: 'xil', c: AGUA, t: 'Xilema', d: 'Vasos de paredes grossas, formados por células mortas, que trazem a água e os sais minerais da raiz.', em: { a: [57, 53.5] }, z: 3.2 },
    { id: 'flo', c: GLI, t: 'Floema', d: 'Células vivas que levam a seiva elaborada, com a sacarose feita na folha, para o resto da planta.', em: { a: [57.5, 64.5] }, z: 3.2 },
    { id: 'est', c: '#C4E36A', t: 'Estômato', d: 'Poro entre duas células-guarda, na face de baixo da folha. Deixa entrar CO₂ e sair O₂ e vapor de água.', em: { a: ESTOM[0] }, z: 3.2 },
    { id: 'gran', c: CLORO, t: 'Granum', d: 'Pilha de tilacoides. Na membrana deles acontece a fase clara: a luz é captada, a água é quebrada e formam-se ATP e NADPH.', em: { b: [52, 56] }, z: 2.4 },
    { id: 'tila', c: '#B8F0C8', t: 'Tilacoide', d: 'Cada disco da pilha é um tilacoide. Na membrana ficam a clorofila, os fotossistemas e a ATP sintase.', em: { b: [52, 42] }, z: 3 },
    { id: 'estr', c: '#C4E36A', t: 'Estroma', d: 'Líquido em volta dos grana. Aqui o ciclo de Calvin usa ATP, NADPH e CO₂ para fazer glicose. É a fase química, que não depende diretamente da luz.', em: { b: CALV }, z: 2.6 },
    { id: 'lam', c: '#A9C54A', t: 'Lamela do estroma', d: 'Tilacoide longo que liga um granum a outro.', em: { b: [62, 37] }, z: 3 },
    { id: 'env', c: '#8FD8FF', t: 'Envelope', d: 'Duas membranas envolvem o cloroplasto. Ele tem DNA e ribossomos próprios, sinal da origem por endossimbiose.', em: { b: [94, 52] }, z: 2.6 }
  ];
  const VAI = { raiz: 1, caule: 1, folha: 0, epi: 0, pal: 0, lac: 2, xil: 1, flo: 5, est: 2, gran: 3, tila: 3, estr: 4, lam: 3, env: 3 };

  // medidores: O₂ liberado e ATP no cloroplasto (0 a 1), multiplicados pela luz do controle
  function alvos(e, u, k) {
    if (e < 3) return [0, 0];
    if (e === 3) return [.85 * k * sst(.25, .9, u), .9 * k * sst(.1, .7, u)];
    if (e === 4) return [.85 * k, k * lerp(.9, .4, sst(.15, .9, u))];
    return [k * lerp(.85, 1, sst(0, .6, u)), .4 * k];
  }
  // estado de cada molécula na viagem
  const EST = {
    agua: e => ['no solo', 'subindo pelo xilema', 'dentro da folha', 'quebrada pela luz', 'quebrada pela luz', 'quebrada pela luz'][e],
    co2: e => ['no ar', 'no ar', 'entrando pelo estômato', 'no mesófilo', 'fixado no ciclo de Calvin', 'virou açúcar'][e],
    o2: e => ['ainda não existe', 'ainda não existe', 'ainda não existe', 'liberado da água', 'liberado da água', 'saindo pelo estômato'][e],
    gli: e => ['ainda não existe', 'ainda não existe', 'ainda não existe', 'ainda não existe', 'montada no estroma', 'no floema, como sacarose'][e]
  };

  // ---------- estado e avanço ----------
  let FIG = null, ultAb = null, pedida = null, ultVista = null;
  const novo = () => ({ e: 0, u: RED ? 1 : 0, hold: 0, pausa: false, o2: 0, atp: 0 });
  function luzK(S) { return cl((S.v == null ? 80 : S.v) / 100, 0, 1); }
  function ir(S, e, troca) {
    const v = S.vg; v.e = (e + NE) % NE; v.u = RED ? 1 : 0; v.hold = 0;
    if (v.e === 0) { v.o2 = 0; v.atp = 0; }
    if (RED) { const a = alvos(v.e, 1, luzK(S)); v.o2 = a[0]; v.atp = a[1]; }
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
    avancar(S, S.dt || 0); pend = null; FX = FAIXA;
    const v = S.vg, k = luzK(S), a = alvos(v.e, v.u, k), dt = S.dt || 0;
    v.o2 = RED ? a[0] : v.o2 + (a[0] - v.o2) * Math.min(1, dt * 4); v.atp = RED ? a[1] : v.atp + (a[1] - v.atp) * Math.min(1, dt * 4);
    if (R.vista === ET[v.e].vista) desenha(R, X, RED ? 0 : t, S, v, k);
  }
  function desenha(R, X, t, S, v, k) {
    const et = ET[v.e], u = RED ? .7 : eIO(v.u), r = cl(R.s * 1.15, 4.5, 11), P = p => R.pt(p[0], p[1]);
    const nFot = Math.round(3 * k);
    const raios = (alvosL, dx, dy, per, al) => alvosL.forEach((p, i) => {
      for (let j = 0; j < nFot; j++) {
        const f = RED ? .55 : (((t / per + i * .37 + j / Math.max(1, nFot)) % 1) + 1) % 1, b = P(p), q = P([p[0] + dx, p[1] + dy]);
        foton(X, q[0], q[1], b[0], b[1], f, al * Math.sin(PI * f) * 1.4, R.s);
      }
    });
    if (et.id === 'luz') {
      raios(FOLHAS.concat(TOPO), -9, -16, 2.2, 1);
      PAL.forEach((p, i) => { const q = P(p); brilho(X, q[0], q[1], R.s * 6, CLORO, sst(.2 + i * .05, .8, v.u) * k * (RED ? 1 : .8 + .2 * Math.sin(t * 3 + i))); });
      FOLHAS.forEach((p, i) => { const q = P(p); brilho(X, q[0], q[1], R.s * 4, LUZ, .5 * k * sst(.1, .6, v.u)); });
      legR(X, R, [[LUZ, k > 0 ? 'luz do Sol' : 'sem luz: controle em 0 %'], [CLORO, 'cloroplastos captando a luz']], 'baixodir');
    } else if (et.id === 'agua') {
      cAgua.rastro(X, R, u, rgba(AGUA, .6));
      cAgua.fluxo(X, R, t, { n: 7, v: .14, d: (x, y, al) => molAgua(X, x, y, r * .55, al * .75) });
      const p = cAgua.em(u), s = P(p); brilho(X, s[0], s[1], r * 5, AGUA, .9); molAgua(X, s[0], s[1], r, 1);
      const x = P([57, 53.5]); anel(X, x[0], x[1], t, AGUA, 1.6, R.s * 4, 0, .8 * sst(.5, .8, v.u));
      legR(X, R, [[AGUA, 'água subindo pelo xilema']], 'baixodir');
    } else if (et.id === 'co2') {
      ESTOM.forEach((e, i) => { const q = P(e); brilho(X, q[0], q[1], R.s * 5, '#C4E36A', .7); anel(X, q[0], q[1], t, '#C4E36A', 1.5, R.s * 4, i * .6, .9); });
      cCO2.rastro(X, R, u, rgba(CO2, .6));
      cCO2b.fluxo(X, R, t, { n: 4, v: .16, d: (x, y, al) => molCO2(X, x, y, r * .55, al * .8) });
      const p = cCO2.em(u), s = P(p); brilho(X, s[0], s[1], r * 5, CO2, .7); molCO2(X, s[0], s[1], r * .85, 1);
      legR(X, R, [[CO2, 'CO₂ do ar'], ['#C4E36A', 'estômatos abertos']], 'dir');
    } else if (et.id === 'floema') {
      cAcucar.rastro(X, R, u, rgba(GLI, .6));
      const fl = P([57.5, 64.5]); anel(X, fl[0], fl[1], t, GLI, 1.6, R.s * 4, 0, .8);
      const p = cAcucar.em(u), s = P(p); brilho(X, s[0], s[1], r * 5, GLI, .9); molGli(X, s[0], s[1], r, 1);
      cO2sai.forEach((C, i) => C.fluxo(X, R, t, { n: 4, v: .15, off: i * .2, d: (x, y, al) => molO2(X, x, y, r * .6, al * .9 * k) }));
      legR(X, R, [[GLI, 'açúcar pelo floema'], [O2, 'O₂ saindo pelo estômato']], 'dir');
    } else if (et.id === 'clara') {
      raios(GRANA, -10, -18, 2, 1);
      GRANA.forEach((g, i) => { const q = P(g); brilho(X, q[0], q[1], R.s * 7, CLORO, .55 * k * sst(.05, .5, v.u) * (RED ? 1 : .8 + .2 * Math.sin(t * 2.5 + i))); });
      // água chega ao granum e é quebrada; o O₂ sai, ATP e NADPH vão para o estroma
      cH2Ob.fluxo(X, R, t, { n: 4, v: .2, d: (x, y, al) => molAgua(X, x, y, r * .8, al) });
      const g = P(GC), sp = RED ? .5 : ((t * .5) % 1);
      if (k > 0) {
        molAgua(X, g[0], g[1], r * .9, 1, sp); brilho(X, g[0], g[1], r * 4 * (1 - sp), '#FFFFFF', .8 * (1 - sp));
        cO2b.fluxo(X, R, t, { n: 4, v: .18, a: k * sst(.2, .5, v.u) + (RED ? k : 0), d: (x, y, al) => molO2(X, x, y, r * .8, al) });
        cATP.fluxo(X, R, t, { n: 3, v: .3, a: sst(.3, .6, v.u) + (RED ? 1 : 0), d: (x, y, al) => chip(X, x, y, 'ATP', ATP, al, 11) });
        cATP2.fluxo(X, R, t, { n: 2, v: .3, off: .17, a: sst(.35, .65, v.u) + (RED ? 1 : 0), d: (x, y, al) => chip(X, x, y, 'NADPH', NADPH, al, 11) });
      } else molAgua(X, g[0], g[1], r * .9, 1, 0);
      legR(X, R, [[LUZ, 'luz'], [AGUA, 'água quebrada'], [O2, 'O₂ liberado'], [ATP, 'ATP e NADPH para o estroma']], 'baixodir');
    } else if (et.id === 'calvin') {
      const c = P(CALV), rr = cl(R.s * 5.5, 24, 58), rot = RED ? 0 : t * .9;
      X.save(); X.fillStyle = 'rgba(11,15,28,.45)'; X.beginPath(); X.arc(c[0], c[1], rr + 6, 0, TAU); X.fill();
      X.strokeStyle = rgba('#C4E36A', .9); X.lineWidth = 3; X.setLineDash([10, 6]); X.lineDashOffset = -rot * 12; X.beginPath(); X.arc(c[0], c[1], rr, 0, TAU); X.stroke(); X.restore();
      for (let i = 0; i < 6; i++) { const ang = rot + i * TAU / 6; dot(X, c[0] + Math.cos(ang) * rr, c[1] + Math.sin(ang) * rr, Math.max(3, r * .55), '#C4E36A', .95); }
      cCO2c.fluxo(X, R, t, { n: 4, v: .16, d: (x, y, al) => molCO2(X, x, y, r * .7, al) });
      cATP.fluxo(X, R, t, { n: 2, v: .25, a: k, d: (x, y, al) => chip(X, x, y, 'ATP', ATP, al, 11) });
      cATP2.fluxo(X, R, t, { n: 2, v: .25, off: .25, a: k, d: (x, y, al) => chip(X, x, y, 'NADPH', NADPH, al, 11) });
      cADP.fluxo(X, R, t, { n: 2, v: .22, a: .8 * k, d: (x, y, al) => chip(X, x, y, 'ADP', '#C9CFDC', al, 10) });
      if (k > 0) cGli.fluxo(X, R, t, { n: 3, v: .14, a: sst(.25, .55, v.u) + (RED ? 1 : 0), d: (x, y, al) => molGli(X, x, y, r * .9, al) });
      legR(X, R, [[CO2, 'CO₂ fixado'], [ATP, 'ATP e NADPH gastos'], [GLI, 'glicose montada']], 'baixodir');
    }
  }

  // ---------- painel: medidores e as quatro moléculas ----------
  const nivel = q => q < .04 ? 'zero' : q < .35 ? 'pouco' : q < .7 ? 'médio' : 'alto';
  function barra(X, x, y, w, nome, val, cor, comp) {
    txt(X, nome, x, y, { s: comp ? 12 : 14, c: cor });
    txt(X, nivel(val), x + w, y, { s: 12, c: DIM, a: 'right', w: 500 });
    const by = y + (comp ? 11 : 14), bh = comp ? 8 : 10;
    X.fillStyle = 'rgba(255,255,255,.08)'; X.beginPath(); X.roundRect(x, by, w, bh, bh / 2); X.fill();
    if (val > .01) { X.fillStyle = cor; X.beginPath(); X.roundRect(x, by, Math.max(bh, w * cl(val, 0, 1)), bh, bh / 2); X.fill(); }
  }
  function icone(X, id, x, y, r, e, t) {
    const vivoA = id === 'agua' ? 1 : id === 'co2' ? 1 : id === 'o2' ? (e >= 3 ? 1 : .25) : (e >= 4 ? 1 : .25);
    if (id === 'agua') molAgua(X, x, y, r, 1, e >= 3 ? .55 : 0);
    else if (id === 'co2') { if (e >= 5) molGli(X, x, y, r * .9, .45); else molCO2(X, x, y, r * .78, e >= 4 ? .55 : 1); }
    else if (id === 'o2') molO2(X, x, y, r * .95, vivoA);
    else molGli(X, x, y, r, vivoA);
  }
  function painel(X, b, t, S, v) {
    const e = v.e, k = luzK(S);
    const MOL = [['agua', 'Água (H₂O)', AGUA], ['co2', 'Gás carbônico (CO₂)', CO2], ['o2', 'Oxigênio (O₂)', O2], ['gli', 'Glicose', GLI]];
    if (!b.comp) {
      const px = b.x + 18, pw = b.w - 36;
      barra(X, px, b.y + 72, pw, 'O₂ liberado', v.o2, O2, false);
      barra(X, px, b.y + 112, pw, 'ATP no cloroplasto', v.atp, ATP, false);
      if (k === 0) txt(X, 'Sem luz: a fase clara para', px, b.y + 148, { s: 12, c: LUZ, w: 600 });
      else txt(X, `Luz do controle: ${Math.round(k * 100)} %`, px, b.y + 148, { s: 12, c: DIM, w: 500 });
      X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(px, b.y + 166, pw, 1);
      MOL.forEach(([id, nome, cor], i) => {
        const y = b.y + 196 + i * 50;
        icone(X, id, px + 14, y + 6, 6.5, e, t);
        txt(X, nome, px + 38, y - 2, { s: 14, c: cor });
        txt(X, EST[id](e), px + 38, y + 16, { s: 12, c: DIM, w: 500 });
      });
    } else {
      const px = b.x + 12, pw = b.w - 24, hw = (pw - 14) / 2;
      barra(X, px, b.y + 64, hw, 'O₂ liberado', v.o2, O2, true);
      barra(X, px + hw + 14, b.y + 64, hw, 'ATP', v.atp, ATP, true);
      const cw = pw / 4;
      MOL.forEach(([id, nome, cor], i) => {
        const cx = px + cw * i + cw / 2;
        icone(X, id, cx, b.y + 106, 5.5, e, t);
        txt(X, id === 'agua' ? 'H₂O' : id === 'co2' ? 'CO₂' : id === 'o2' ? 'O₂' : 'glicose', cx, b.y + 128, { s: 12, c: cor, a: 'center' });
      });
    }
  }

  function fora(X, t, c) {
    const S = c.S; if (!S || !S.vg) return; montarNav(); sinc(S); NAV.hidden = false;
    const b = painelBox();
    X.fillStyle = 'rgba(11,15,28,.76)'; X.beginPath(); X.roundRect(b.x, b.y, b.w, b.h, b.comp ? 12 : 14); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
    posNav(b.x + (b.comp ? 6 : 10), b.y + (b.comp ? 6 : 10), b.w - (b.comp ? 12 : 20));
    painel(X, b, RED ? 0 : t, S, S.vg);
    if (pend) { if (pend[0] === 'linha') legLinha(X, pend[1], pend[2], pend[3], W - 12); else leg(X, pend[0], pend[1], pend[2], pend[3]); pend = null; }
    const e = S.vg.e, semLuz = luzK(S) === 0 && (e === 0 || e === 3 || e === 4);
    cap(ET[e].cap + (semLuz ? '<br>Sem luz, a fase clara para: não sai O₂ e falta ATP e NADPH para o ciclo de Calvin.' : ''));
  }

  // ---------- registro: figura padrão com o 3D antigo atrás de "Ver em 3D" ----------
  const i0 = c3.init;
  const amb = {
    SC, X: () => X, W: () => W, H: () => H, nar: () => NAR, tela: cv.parentNode, plano() {},
    t: a => a[0], rot3d: 'Ver em 3D', dica3d: 'Arraste para girar o modelo',
    esconder: ['.hud.onde'], esconderFig: []
  };
  LAB_FIGALT.cena(amb, K, {
    pref: 'bioenergetica', nome: 'Viagem da fotossíntese: da raiz ao cloroplasto', mask: { miolo: .9, borda: 1 },
    vistas: [
      ['a', 'foto-geral-v5a', 'Planta e folha em corte', 'Planta com a raiz no solo e uma folha em corte: cutícula e epiderme, parênquima paliçádico, parênquima lacunoso, nervura com xilema e floema e estômatos na face de baixo'],
      ['b', 'foto-geral-a', 'Cloroplasto em corte', 'Cloroplasto em corte: grana de tilacoides empilhados no estroma, dentro das duas membranas do envelope']
    ],
    hs: HS, manter: () => caixa(FAIXA), sobre, fora
  });
  const dFig = c3.draw, i1 = c3.init;
  c3.init = function (S) { i1.call(this, S); if (i0) i0.call(c3, S); S.vg = novo(); sincK = ''; ultAb = null; ultVista = null; pedida = null; };
  c3.draw = function (t, S) { if (!S.vg) S.vg = novo(); return dFig.call(this, t, S); };
})();
