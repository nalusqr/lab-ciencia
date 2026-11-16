/* LAB Anatomia: duas viagens sobre figuras de IA realistas, no padrão do digestório (Martin + Íris).
   1) excretor/nefron: o sangue chega pela artéria renal, vira filtrado no glomérulo e segue pelo néfron até a bexiga.
      Vista A: sistema urinário inteiro com aorta e veia cava. Vista B: um néfron com capilares (Nano Banana 2).
      Medidor: concentração do líquido (mOsm/L) e volume por dia; o painel mostra o que fica e o que volta ao sangue.
   2) nervoso/autonomo: o impulso nervoso do estímulo na mão até o músculo, passando pela medula e pela sinapse,
      e depois subindo ao encéfalo. Vistas: corpo inteiro, arco reflexo, sinapse química e o autônomo (simpático e
      parassimpático, a figura que já estava na rota, agora também a última etapa). As figuras do corpo, do arco reflexo
      e do autônomo são as do módulo (o arco reflexo é a -b2, refeita com o Nano Banana 2 para o músculo ficar do mesmo lado); a da sinapse é a mesma da Histologia, copiada com outro nome.
      Medidor: potencial de membrana com o traçado do potencial de ação (repouso cerca de −70 mV).
   Em cada rota: etapas com anterior, pausar e próxima, um ponto que viaja pelo caminho real (curva suave conferida
   sobre a imagem), tocar num ponto leva a viagem até ele e a vista certa entra sozinha na etapa certa.
   O 3D antigo segue atrás de "Ver em 3D" (LAB_FIGALT). Os outros modos (Quadro, Hemodiálise, Repouso e susto) continuam
   no desenho plano. Com prefers-reduced-motion nada anda sozinho: etapas por botão.
   Carregar depois de cenas-figura-digestorio.js e antes de LAB_ANATOMIA_iniciar(). Texto: sem "!", sem setas ou pontos como separador. */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const RED = LAB_FIGALT.RED, PI = Math.PI, TAU = PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
  const sst = (a, b, x) => { const u = cl((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const eIO = u => { u = cl(u, 0, 1); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
  const mixc = (a, b, k) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), m = s => Math.round(((A >> s) & 255) * (1 - k) + ((B >> s) & 255) * k); return `rgb(${m(16)},${m(8)},${m(0)})`; };
  const FT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const TXT = '#E8EDF7', DIM = '#9DA9C4';

  // ---------- desenho básico ----------
  function dot(X, x, y, r, c, a) { X.globalAlpha = cl(a, 0, 1); X.beginPath(); X.arc(x, y, Math.max(.1, r), 0, TAU); X.fillStyle = c; X.fill(); X.globalAlpha = 1; }
  function brilho(X, x, y, r, c, a) { const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(c, .55 * a)); g.addColorStop(1, rgba(c, 0)); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); }
  function txt(X, s, x, y, o = {}) { X.font = `${o.w || 600} ${o.s || 13}px ${FT}`; X.fillStyle = o.c || TXT; X.textAlign = o.a || 'left'; X.textBaseline = 'middle'; X.fillText(s, x, y); }
  function anel(X, x, y, t, cor, per, rmax, off, al) {
    if (RED) { X.beginPath(); X.arc(x, y, rmax * .6, 0, TAU); X.strokeStyle = rgba(cor, .55); X.lineWidth = 1.5; X.stroke(); return; }
    const u = (((t + (off || 0)) / per) % 1 + 1) % 1;
    X.beginPath(); X.arc(x, y, 4 + rmax * (1 - Math.pow(1 - u, 3)), 0, TAU); X.strokeStyle = rgba(cor, (al == null ? .85 : al) * (1 - u)); X.lineWidth = 2; X.stroke();
  }
  function leg(X, x, y, itens, nar) {
    X.save(); X.font = `600 ${nar ? 12 : 13}px ${FT}`; X.textBaseline = 'middle'; X.textAlign = 'left';
    const w = Math.max(...itens.map(i => X.measureText(i[1]).width)) + 34, h = itens.length * 20 + 10;
    X.fillStyle = 'rgba(11,15,28,.82)'; X.beginPath(); X.roundRect(x, y, w, h, 8); X.fill();
    itens.forEach((it, i) => { dot(X, x + 14, y + 15 + i * 20, 4.5, it[0], 1); X.fillStyle = TXT; X.fillText(it[1], x + 26, y + 15 + i * 20); });
    X.restore();
  }
  // legenda da figura: ao lado da imagem quando sobra espaço (computador); senão num canto vazio dela (onde: cima, baixo, dir)
  function legR(X, R, itens, onde) {
    const nar = R.w < 520; X.save(); X.font = `600 ${nar ? 12 : 13}px ${FT}`;
    const w = Math.max(...itens.map(i => X.measureText(i[1]).width)) + 34, h = itens.length * 20 + 10; X.restore();
    const bx = caixa(0).x;
    let x = R.x + 10, y = R.y + 10;
    if (!compacto() && R.x - w - 12 >= bx) x = R.x - w - 12;
    else if (onde === 'baixo') y = R.y + R.h - h - 10;
    else if (onde === 'dir') x = R.x + R.w - w - 10;
    pend = [x, y, itens, nar];   // desenhada em fora(), depois da figura: a camada sobre a figura é recortada nela
  }
  let pend = null;
  function gota(X, x, y, r, ang, c, a) {
    X.save(); X.globalAlpha = cl(a, 0, 1); X.translate(x, y); X.rotate(ang - PI / 2);
    X.beginPath(); X.moveTo(0, -r * 2.1); X.bezierCurveTo(r * .9, -r * .8, r, r * .1, 0, r); X.bezierCurveTo(-r, r * .1, -r * .9, -r * .8, 0, -r * 2.1);
    X.fillStyle = c; X.fill(); X.strokeStyle = 'rgba(11,15,28,.55)'; X.lineWidth = 1; X.stroke(); X.restore();
  }

  // ---------- caminho suave (Catmull-Rom) medido em distância real da figura ----------
  function caminho(P, AR) {
    const N = 12, AM = [], IDX = [];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      IDX[i] = AM.length;
      for (let j = 0; j < N; j++) { const t = j / N, t2 = t * t, t3 = t2 * t; AM.push([0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3))); }
    }
    IDX[P.length - 1] = AM.length; AM.push(P[P.length - 1].slice());
    const LC = [0]; for (let i = 1; i < AM.length; i++) LC.push(LC[i - 1] + Math.hypot((AM[i][0] - AM[i - 1][0]) * AR[0], (AM[i][1] - AM[i - 1][1]) * AR[1]));
    const LT = LC[LC.length - 1] || 1, LF = LC.map(v => v / LT);
    return {
      AM, LF, FI: i => LF[IDX[Math.min(i, P.length - 1)]],
      em(f) { f = cl(f, 0, 1); let i = 1; while (i < LF.length - 1 && LF[i] < f) i++; const u = (f - LF[i - 1]) / ((LF[i] - LF[i - 1]) || 1), a = AM[i - 1], b = AM[i]; return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), Math.atan2((b[1] - a[1]) * AR[1], (b[0] - a[0]) * AR[0])]; },
      // rastro tracejado do começo até f (em pixels da tela)
      rastro(X, R, f0, f1, cor) {
        X.save(); X.setLineDash([2, 5]); X.lineCap = 'round'; X.strokeStyle = cor; X.lineWidth = 1.6; X.beginPath(); let st = false;
        for (let i = 0; i < AM.length; i++) { if (LF[i] < f0) continue; if (LF[i] > f1) break; const s = R.pt(AM[i][0], AM[i][1]); if (!st) { X.moveTo(s[0], s[1]); st = true; } else X.lineTo(s[0], s[1]); }
        if (st) { const p = this.em(f1), s = R.pt(p[0], p[1]); X.lineTo(s[0], s[1]); X.stroke(); } X.restore();
      }
    };
  }

  // ---------- botões da viagem (um só conjunto para as duas rotas) ----------
  const ICO = { ant: '<path d="M14.5 6 8.5 12l6 6"/>', prox: '<path d="m9.5 6 6 6-6 6"/>', pausa: '<path d="M9 6v12M15 6v12"/>', play: '<path d="M8 5.5v13l10-6.5z"/>' };
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;
  let NAV = null, dono = null, vivo = 0, sincK = '', navK = '';
  function montarNav() {
    if (NAV) return;
    const st = document.createElement('style'); st.id = 'rn-css';
    st.textContent = `.rn-nav{position:absolute;left:0;top:0;z-index:2;display:flex;align-items:center;gap:6px}
.rn-nav[hidden]{display:none}
.rn-nav button{font:inherit;width:44px;height:44px;flex:none;display:grid;place-items:center;border-radius:10px;border:1px solid var(--line-strong,#5B6C99);background:rgba(19,26,43,.92);color:var(--txt,#E8EDF7);cursor:pointer;transition:background-color 90ms,border-color 90ms,color 90ms}
.rn-nav button:hover{background:var(--panel-2,#1B2440);border-color:var(--amber,#FFB347)}
.rn-nav button:active{transform:scale(.96)}
.rn-nav button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
.rn-nav button svg{width:22px;height:22px}
.rn-nav button[hidden]{display:none}
.rn-nav .et{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;padding:0 6px;line-height:1.2}
.rn-nav .et small{font-size:12px;color:var(--dim,#9DA9C4)}
.rn-nav .et b{font-size:15px;font-weight:600;color:var(--txt,#E8EDF7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(prefers-reduced-motion:reduce){.rn-nav button{transition:none}.rn-nav button:active{transform:none}}`;
    document.head.appendChild(st);
    NAV = document.createElement('div'); NAV.className = 'rn-nav'; NAV.hidden = true; NAV.setAttribute('role', 'group');
    NAV.innerHTML = `<button type="button" data-a="ant" aria-label="Etapa anterior" title="Etapa anterior">${svg('ant')}</button>`
      + `<div class="et" aria-live="polite"><small></small><b></b></div>`
      + `<button type="button" data-a="pausa"${RED ? ' hidden' : ''}></button>`
      + `<button type="button" data-a="prox" aria-label="Próxima etapa" title="Próxima etapa">${svg('prox')}</button>`;
    NAV.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || !dono || !dono.S) return; const S = dono.S, v = S.vg;
      if (b.dataset.a === 'ant') dono.ir(S, v.e - 1, true);
      else if (b.dataset.a === 'prox') dono.ir(S, v.e + 1, true);
      else { v.pausa = !v.pausa; dono.sinc(S); }
    });
    cv.parentNode.appendChild(NAV);
    (function vigia() { if (NAV && !NAV.hidden && performance.now() - vivo > 180) NAV.hidden = true; requestAnimationFrame(vigia); })();
  }
  function posNav(x, y, w) { const k = [x, y, w].map(Math.round).join(); if (k === navK) return; navK = k; NAV.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`; NAV.style.width = Math.round(w) + 'px'; }

  // ---------- layout comum: painel à esquerda no computador; faixa embaixo no celular ----------
  const compacto = () => NAR || W < 1160;
  const capRes = () => NAR ? 116 : 76;
  const PW = 312;
  function caixa(fh) {
    if (!compacto()) { const x = 28 + PW + 14; return { x, y: 60, w: W - x - 24, h: H - 60 - 56 }; }
    const x0 = NAR ? 6 : 24, y0 = NAR ? 46 : 60; return { x: x0, y: y0, w: W - 2 * x0, h: H - y0 - (capRes() + fh + 8) };
  }
  function painelBox(fh, ph) {
    if (!compacto()) return { x: 28, y: 60, w: PW, h: ph, comp: false };
    const x0 = NAR ? 6 : 24; return { x: x0, y: H - capRes() - fh - 4, w: W - 2 * x0, h: fh, comp: true };
  }
  function fundo(X, b) { X.fillStyle = 'rgba(11,15,28,.76)'; X.beginPath(); X.roundRect(b.x, b.y, b.w, b.h, b.comp ? 12 : 14); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke(); }

  // ---------- fábrica da viagem ----------
  // cfg: K, modo (o modo da cena em que a viagem roda), nome, aria, vistas, hs, ET [{id, nome, vista, dur, cap}], VAI {hs: etapa},
  //      faixa (altura da faixa no celular), alto (altura do painel no computador), sobre(R, X, t, S, v), painel(X, b, t, S, v), tick(S, v, dt), vel(S)
  function viagem(cfg) {
    const c3 = SC[cfg.K]; if (!c3) return;
    const ET = cfg.ET, NE = ET.length;
    let FIG = null, ultAb = null, pedida = null, ultVista = null;
    const novo = () => Object.assign({ e: 0, u: RED ? 1 : 0, hold: 0, pausa: false, auto: false }, cfg.novo ? cfg.novo() : {});
    const ctl = {
      S: null,
      ir(S, e, troca) {
        const v = S.vg; v.e = (e + NE) % NE; v.u = RED ? 1 : 0; v.hold = 0;
        if (cfg.aoIr) cfg.aoIr(S, v);
        if (troca && FIG && FIG.vistaAtual !== ET[v.e].vista) { pedida = ET[v.e].vista; FIG.mostrar(ET[v.e].vista); }
        ctl.sinc(S);
      },
      sinc(S) {
        if (!NAV || dono !== ctl) return; const v = S.vg, k = cfg.K + v.e + '|' + v.pausa; if (k === sincK) return; sincK = k;
        NAV.setAttribute('aria-label', cfg.aria);
        NAV.querySelector('.et small').textContent = `Etapa ${v.e + 1} de ${NE}`;
        NAV.querySelector('.et b').textContent = ET[v.e].nome;
        const p = NAV.querySelector('[data-a="pausa"]'), tt = v.pausa ? 'Continuar a viagem' : 'Pausar a viagem';
        p.innerHTML = svg(v.pausa ? 'play' : 'pausa'); p.title = tt; p.setAttribute('aria-label', tt);
      }
    };
    function avancar(S, dt) {
      const v = S.vg, et = ET[v.e];
      if (cfg.tick) cfg.tick(S, v, RED || v.pausa ? 0 : dt);
      if (RED || v.pausa || !dt) return;
      const k = dt * (cfg.vel ? cfg.vel(S) : 1);
      if (v.u < 1) { v.u = Math.min(1, v.u + k / et.dur); return; }
      v.hold += k;
      if (v.e < NE - 1) { if (v.hold > (et.hold || 1.4)) ctl.ir(S, v.e + 1, true); }
      else if (v.hold > 4) ctl.ir(S, 0, true);
    }
    function sobre(R, X, t, c) {
      const S = c.S; if (!S || !S.vg) return; ctl.S = S; dono = ctl; vivo = performance.now();
      if (!FIG) FIG = c3.figura;
      // tocar num ponto leva a viagem até a etapa dele
      const ab = FIG && FIG.aberto ? FIG.aberto.id : null;
      if (ab !== ultAb) { ultAb = ab; if (ab && cfg.VAI[ab] != null && cfg.VAI[ab] !== S.vg.e) ctl.ir(S, cfg.VAI[ab], false); }
      // o aluno trocou de vista na barra: a viagem vai para a primeira etapa daquela vista
      const vz = FIG ? FIG.vistaAtual : R.vista;
      if (vz !== ultVista) { const de = ultVista; ultVista = vz; if (de != null && vz !== pedida && ET[S.vg.e].vista !== vz) { const i = ET.findIndex(e => e.vista === vz); if (i >= 0) ctl.ir(S, i, false); } pedida = null; }
      avancar(S, S.dt || 0); pend = null;
      if (R.vista === ET[S.vg.e].vista) cfg.sobre(R, X, RED ? 0 : t, S, S.vg);
    }
    function fora(X, t, c) {
      const S = c.S; if (!S || !S.vg) return; montarNav(); dono = ctl; ctl.sinc(S); NAV.hidden = false;
      const b = painelBox(cfg.faixa, cfg.alto); fundo(X, b);
      posNav(b.x + (b.comp ? 6 : 10), b.y + (b.comp ? 6 : 10), b.w - (b.comp ? 12 : 20));
      cfg.painel(X, b, RED ? 0 : t, S, S.vg);
      if (pend) { leg(X, pend[0], pend[1], pend[2], pend[3]); pend = null; }
      cap(ET[S.vg.e].cap);
    }
    // registro: figura padrão com o 3D antigo atrás de "Ver em 3D" (ou o esquema, sem WebGL)
    const plano = c3.plano ? (t, S) => c3.plano(t, S) : null;
    const d3 = c3.draw, i0 = c3.init; let chamou3 = false, em3d = false;   // i0: o init de antes (o do 2D, com o do 3D por cima quando há WebGL)
    // ao abrir o 3D, a figura-alterna chama o init antigo de novo: ele não pode tirar a cena do modo da viagem
    c3.init = function (S) { const m = S.vg ? S.modo : null; i0.call(this, S); if (m) S.modo = m; };
    c3.draw = function (...a) { chamou3 = true; return d3.apply(this, a); };
    const amb = {
      SC, X: () => X, W: () => W, H: () => H, nar: () => NAR, tela: cv.parentNode, plano() {},
      t: a => a[0], rot3d: plano ? 'Ver em 3D' : 'Ver esquema', dica3d: plano ? 'Arraste para girar o modelo' : '',
      esconder: ['.hud.onde'], esconderFig: []
    };
    LAB_FIGALT.cena(amb, cfg.K, {
      pref: 'anatomia', nome: cfg.nome, mask: cfg.mask || { miolo: .86, borda: 1 }, vistas: cfg.vistas, hs: cfg.hs,
      manter: () => caixa(cfg.faixa), sobre, fora
    });
    const dFig = c3.draw, i1 = c3.init;
    c3.init = function (S) { i1.call(this, S); if (i0) i0.call(c3, S); if (cfg.aoAbrir) cfg.aoAbrir(S); S.vg = novo(); sincK = ''; ultAb = null; ultVista = null; pedida = null; };
    c3.draw = function (t, S) {
      if (!S.vg) S.vg = novo();
      if (S.modo !== cfg.modo && !em3d) { const pl = plano || d3; X.save(); try { pl.call(c3, t, S); } catch (e) { console.error(e); } X.restore(); return; }
      chamou3 = false; const r = dFig.call(this, t, S); em3d = chamou3; return r;
    };
    return ctl;
  }

  // =====================================================================================================
  // 1) EXCRETOR: néfron
  // =====================================================================================================
  (function () {
    const ART = '#E5484D', VEN = '#6F7FE0', FIL = '#F3E9A0', URI = '#E0A93B', GLI = '#F2D04A', AMI = '#E58AB0', SAL = '#E8EDF7', AGU = '#7CC8F2', URE = '#F2A65A', HMAIS = '#FF8A5C', PROT = '#9A6BFF';
    const AR = [.746, 1];
    // vista A (sistema urinário): sangue da aorta ao rim, veia de volta à cava, urina do rim à uretra
    const cArt = caminho([[52.3, 6], [52.3, 16], [52.5, 25], [53.6, 28.8], [57, 29.2], [60.5, 29.4], [63.6, 31]], AR);
    const cVei = caminho([[63.6, 31.6], [58, 30.6], [52, 30.2], [47.5, 30.6], [45.3, 28], [45.3, 18], [45.3, 6]], AR);
    const cUri = caminho([[63.6, 31.8], [62.2, 34], [61.6, 40], [61.8, 48], [62.4, 57], [62.3, 66], [61.4, 72], [59.6, 75.4], [57, 77.6], [53.5, 79.5], [50.2, 81.5], [50, 85.5], [50, 89.5], [50, 94]], AR);
    const U_BEX = cUri.FI(8);   // fração do caminho da urina em que ela entra na bexiga
    // vista B (néfron): o filtrado da cápsula ao ducto coletor; o sangue pela aferente, glomérulo e eferente
    const cTub = caminho([[27, 22], [33, 22.4], [40.5, 21.6],
      [43.5, 17.5], [46.5, 15.5], [49, 18.5], [47, 24], [44.5, 28.5], [40, 30.5], [36, 32], [35, 35], [38, 36.6], [42, 35.6], [45.5, 38.5],
      [45.8, 50], [45.9, 70], [46.3, 86], [48.5, 90.4], [53, 90], [56.4, 86], [56.4, 70], [56.4, 50], [56.4, 37],
      [57.5, 29.5], [61, 26.6], [65, 27], [68, 25], [66, 21.5], [61.5, 22], [58.5, 19], [61, 16.5], [66, 18], [70, 18], [73, 16], [77, 18], [81, 20.4],
      [83, 26], [83, 45], [83, 65], [83, 85], [83, 92]], AR);
    const cSan = caminho([[16.9, 8.6], [16, 13], [17.4, 18], [22, 20], [27, 21.5], [24, 23.5], [19, 23], [16.4, 25.5], [16.9, 30], [17, 34.5], [19, 36.4], [23, 36.3]], AR);
    const TB = { glom: [0, 2], prox: [2, 13], alca: [13, 22], dist: [22, 35], duto: [35, 40] };
    const FUNDO = cTub.FI(17);   // fundo da alça

    // etapas: conc em mOsm/L; vol em litros por dia; nivel: quanto de cada coisa sobra no túbulo ao fim da etapa
    const ET = [
      { id: 'art', nome: 'Artéria renal', vista: 'a', dur: 5, conc: 300, vol: 900, volN: 'plasma que passa pelos rins', volC: 'plasma por dia',
        cap: 'O sangue sai da <b>aorta</b> pela <b>artéria renal</b> e entra no rim. Cerca de um quinto do sangue bombeado pelo coração passa pelos rins.' },
      { id: 'glom', nome: 'Glomérulo', vista: 'b', dur: 6, conc: 300, vol: 180, volN: 'filtrado por dia', volC: 'filtrado por dia',
        cap: '<b>Filtração</b>: a pressão empurra água, glicose, aminoácidos, sais e ureia do <b>glomérulo</b> para a <b>cápsula de Bowman</b>. Células e proteínas ficam no sangue.' },
      { id: 'prox', nome: 'Túbulo proximal', vista: 'b', dur: 7, conc: 300, vol: 60, volN: 'filtrado que segue', volC: 'segue por dia',
        cap: '<b>Reabsorção</b> no <b>túbulo proximal</b>: toda a glicose e os aminoácidos voltam ao sangue, com boa parte dos sais e da água.' },
      { id: 'alca', nome: 'Alça de Henle', vista: 'b', dur: 8, conc: 100, vol: 35, volN: 'filtrado que segue', volC: 'segue por dia',
        cap: 'Na <b>alça de Henle</b>, o ramo que desce perde água e o líquido fica concentrado. O ramo que sobe tira sais e o líquido sai diluído.' },
      { id: 'dist', nome: 'Túbulo distal', vista: 'b', dur: 7, conc: 120, vol: 20, volN: 'filtrado que segue', volC: 'segue por dia',
        cap: 'No <b>túbulo distal</b> há <b>secreção</b> de H⁺, K⁺ e de alguns remédios para a urina. A <b>aldosterona</b> faz o túbulo reabsorver mais sódio e, com ele, água.' },
      { id: 'duto', nome: 'Ducto coletor', vista: 'b', dur: 7, conc: 1200, vol: 1.5, volN: 'urina por dia', volC: 'urina por dia',
        cap: 'No <b>ducto coletor</b>, o <b>ADH</b> abre canais de água: a água volta ao sangue e a urina sai concentrada. Sem ADH, sai muita urina diluída.' },
      { id: 'uret', nome: 'Pelve e ureter', vista: 'a', dur: 6, conc: 1200, vol: 1.5, volN: 'urina por dia', volC: 'urina por dia',
        cap: 'Os ductos coletores esvaziam na <b>pelve renal</b>. Dela, o <b>ureter</b> leva a urina até a bexiga com ondas de <b>peristaltismo</b>.' },
      { id: 'bex', nome: 'Bexiga e uretra', vista: 'a', dur: 6, conc: 1200, vol: 1.5, volN: 'urina por dia', volC: 'urina por dia',
        cap: 'A <b>bexiga</b> guarda a urina. Cheia, ela contrai e a urina sai pela <b>uretra</b> na micção.' }
    ];
    const NIV = { // fração que sobra no túbulo ao fim de cada etapa (0 antes da filtração)
      gli: [0, 1, 0, 0, 0, 0, 0, 0], sal: [0, 1, .35, .12, .06, .05, .05, .05], agu: [0, 1, .35, .2, .11, .01, .01, .01], ure: [0, 1, 1, 1, 1, 1, 1, 1]
    };
    const nivel = (k, e, u) => e === 0 ? 0 : lerp(NIV[k][e - 1], NIV[k][e], sst(.1, .9, u));
    function concAgora(e, u) {
      if (e === 3) return u < .5 ? lerp(300, 1200, sst(.05, .5, u)) : lerp(1200, 100, sst(.5, .95, u));
      const a = e ? ET[e - 1].conc : 300; return lerp(a, ET[e].conc, sst(.1, .9, u));
    }
    const volAgora = (e, u) => { const a = e ? ET[e - 1].vol : 900, b = ET[e].vol; return Math.exp(lerp(Math.log(a), Math.log(b), sst(.15, .85, u))); };
    const corLiq = c => mixc(FIL, URI, cl((c - 100) / 1000, 0, 1));

    const HS = [
      { id: 'art', c: ART, t: 'Aorta e artéria renal', d: 'A aorta leva sangue arterial pelo abdome. Cada artéria renal sai dela e leva ao rim o sangue que vai ser filtrado.', em: { a: [52.3, 19] }, z: 2.4 },
      { id: 'vei', c: VEN, t: 'Veia renal e veia cava', d: 'O sangue já filtrado, com menos ureia, sai do rim pela veia renal e volta ao coração pela veia cava inferior.', em: { a: [45.3, 19] }, z: 2.4 },
      { id: 'rim', c: '#C9705E', t: 'Rim', d: 'Cada rim tem cerca de 1 milhão de néfrons, as unidades que filtram o sangue e formam a urina.', em: { a: [67, 38] }, z: 2.2 },
      { id: 'adr', c: '#E3C25B', t: 'Adrenal', d: 'Glândula sobre o rim. Seu córtex produz a aldosterona, que faz o rim reabsorver mais sódio e água.', em: { a: [65, 21.5] }, z: 2.6 },
      { id: 'ure', c: URI, t: 'Pelve renal e ureter', d: 'A pelve recolhe a urina dos ductos coletores. O ureter, um tubo de músculo liso, a leva até a bexiga por peristaltismo.', em: { a: [62, 50] }, z: 2.4 },
      { id: 'bex', c: '#E08B8B', t: 'Bexiga', d: 'Bolsa de músculo liso que guarda a urina. Quando enche, a parede estica e surge a vontade de urinar.', em: { a: [50, 80] }, z: 2.4 },
      { id: 'uta', c: '#F2B6C6', t: 'Uretra', d: 'Canal que leva a urina da bexiga para fora. No homem, também conduz o sêmen.', em: { a: [50, 91] }, z: 2.6 },
      { id: 'aff', c: ART, t: 'Arteríola aferente', d: 'Traz o sangue ao glomérulo. É mais larga que a eferente, o que mantém a pressão alta que empurra a filtração.', em: { b: [16.6, 12] }, z: 2.6 },
      { id: 'glo', c: '#F28B8B', t: 'Glomérulo', d: 'Novelo de capilares com parede porosa. Por ele passam água e moléculas pequenas; hemácias e proteínas ficam no sangue.', em: { b: [27, 21] }, z: 3 },
      { id: 'cap', c: '#EFE3C2', t: 'Cápsula de Bowman', d: 'Taça que envolve o glomérulo e recebe o filtrado, cerca de 180 litros por dia.', em: { b: [36, 26.5] }, z: 2.8 },
      { id: 'eff', c: '#E58AB0', t: 'Arteríola eferente', d: 'Leva o sangue que sobrou do glomérulo para os capilares em volta dos túbulos, onde ele recebe o que é reabsorvido.', em: { b: [16.8, 31] }, z: 2.6 },
      { id: 'pro', c: GLI, t: 'Túbulo proximal', d: 'Reabsorve toda a glicose e os aminoácidos e cerca de dois terços dos sais e da água. Glicose na urina indica que o limite do transporte foi passado, como no diabetes.', em: { b: [44, 27] }, z: 2.6 },
      { id: 'alc', c: AGU, t: 'Alça de Henle', d: 'O ramo que desce deixa sair água; o que sobe bombeia sais para fora. Assim o fundo do rim fica salgado, o que permite fazer urina concentrada.', em: { b: [46, 66] }, z: 2.2 },
      { id: 'per', c: '#C55A6A', t: 'Capilares em volta do túbulo', d: 'Recebem tudo o que é reabsorvido e levam de volta à circulação. Também entregam ao túbulo o que vai ser secretado.', em: { b: [39, 50] }, z: 2.6 },
      { id: 'dis', c: HMAIS, t: 'Túbulo distal', d: 'Faz secreção de H⁺ e K⁺, o que ajuda a controlar o pH e o potássio do sangue. Sob a aldosterona, reabsorve mais sódio.', em: { b: [63, 21.5] }, z: 2.8 },
      { id: 'col', c: URI, t: 'Ducto coletor', d: 'Recebe o líquido de vários néfrons. O ADH, feito no hipotálamo e liberado pela neuro-hipófise, abre canais de água (aquaporinas) na parede e a urina fica concentrada.', em: { b: [83, 62] }, z: 2.2 }
    ];
    const VAI = { art: 0, vei: 0, rim: 1, adr: 4, ure: 6, bex: 7, uta: 7, aff: 1, glo: 1, cap: 1, eff: 1, pro: 2, alc: 3, per: 2, dis: 4, col: 5 };

    // gotinha do filtrado ou da urina, com moléculas girando em volta
    function bolha(X, x, y, r, cor, t, v) {
      brilho(X, x, y, r * 3, '#FFE8A0', .9);
      X.beginPath(); X.arc(x, y, r + 3, 0, TAU); X.fillStyle = 'rgba(11,15,28,.85)'; X.fill();
      const g = X.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r); g.addColorStop(0, '#FFFBEA'); g.addColorStop(.5, cor); g.addColorStop(1, cor);
      X.beginPath(); X.arc(x, y, r, 0, TAU); X.fillStyle = g; X.fill(); X.strokeStyle = 'rgba(11,15,28,.7)'; X.lineWidth = 1.2; X.stroke();
      const n = [[GLI, nivel('gli', v.e, v.u)], [SAL, nivel('sal', v.e, v.u)], [AGU, nivel('agu', v.e, v.u)], [URE, nivel('ure', v.e, v.u)]];
      n.forEach(([c, a], i) => { const ang = t * 1.5 + i * TAU / 4; dot(X, x + Math.cos(ang) * r * 1.05, y + Math.sin(ang) * r * 1.05, Math.max(1.6, r * .26), c, a > .02 ? .4 + .6 * Math.min(1, a * 2) : 0); });
    }
    // pontinhos que saem do túbulo para o sangue (reabsorção) ou entram nele (secreção)
    function troca(X, x, y, rb, t, cores, entra, al) {
      for (let i = 0; i < 9; i++) {
        const u = RED ? .5 : ((t * .7 + i / 9) % 1), a = i * 2.39 + 1, D = rb * (1.3 + (entra ? 1 - u : u) * 3.2);
        dot(X, x + Math.cos(a) * D, y + Math.sin(a) * D, Math.max(1.6, rb * .24), cores[i % cores.length], (entra ? u : 1 - u) * .9 * al);
      }
    }
    function sobre(R, X, t, S, v) {
      const et = ET[v.e], u = RED ? .6 : eIO(v.u), rb = cl(R.s * 2, 8, 18), conc = concAgora(v.e, v.u);
      if (et.vista === 'a') {
        if (et.id === 'art') {
          // hemácias descendo pela aorta e entrando no rim; sangue filtrado voltando pela veia
          for (let i = 0; i < 7; i++) { const f = RED ? (i + .5) / 7 : ((t * .16 + i / 7) % 1), p = cArt.em(f), s = R.pt(p[0], p[1]); dot(X, s[0], s[1], Math.max(2.4, R.s * .5), ART, .95); }
          for (let i = 0; i < 6; i++) { const f = RED ? (i + .5) / 6 : ((t * .13 + i / 6) % 1), p = cVei.em(f), s = R.pt(p[0], p[1]); dot(X, s[0], s[1], Math.max(2.2, R.s * .45), '#A8B4FF', .9); }
          const k = R.pt(66, 36); anel(X, k[0], k[1], t, ART, 1.6, R.s * 5, 0, .7);
          legR(X, R, [[ART, 'sangue que chega ao rim'], ['#A8B4FF', 'sangue filtrado que volta']], 'baixo');
        } else {
          const f0 = et.id === 'uret' ? 0 : U_BEX, f1 = et.id === 'uret' ? U_BEX : 1, f = lerp(f0, f1, u), p = cUri.em(f), s = R.pt(p[0], p[1]);
          cUri.rastro(X, R, 0, f, 'rgba(255,214,140,.55)');
          if (et.id === 'bex') { const b = R.pt(50, 80.5), ch = RED ? .7 : sst(0, .55, v.u) * (1 - sst(.75, 1, v.u) * .6); brilho(X, b[0], b[1], R.s * 9, URI, .5 + .5 * ch); anel(X, b[0], b[1], t, URI, 2, R.s * 8, 0, .5); }
          // anel de músculo liso logo atrás da gota (peristaltismo do ureter)
          if (et.id === 'uret') { X.save(); X.translate(s[0], s[1]); X.rotate(p[2]); X.strokeStyle = rgba(URI, .85); X.lineWidth = 2; X.lineCap = 'round'; [-1, 1].forEach(q => { X.beginPath(); X.moveTo(-rb * 1.9, q * rb * .55); X.lineTo(-rb * 1.9, q * rb * 1.35); X.stroke(); }); X.restore(); }
          gota(X, s[0], s[1], rb * .75, p[2] + PI / 2, corLiq(conc), 1);
        }
        return;
      }
      // vista B: o néfron
      const [i0, i1] = TB[et.id], f = lerp(cTub.FI(i0), cTub.FI(i1), u), p = cTub.em(f), s = R.pt(p[0], p[1]);
      cTub.rastro(X, R, 0, f, 'rgba(255,214,140,.5)');
      if (et.id === 'glom') {
        // sangue entrando pela aferente e saindo pela eferente; o filtrado escapa para a cápsula
        for (let i = 0; i < 10; i++) { const q = RED ? (i + .5) / 10 : ((t * .14 + i / 10) % 1), a = cSan.em(q), b = R.pt(a[0], a[1]); dot(X, b[0], b[1], Math.max(2.2, R.s * .55), ART, .95); }
        const g = R.pt(27, 21.5);
        for (let i = 0; i < 3; i++) { const a = R.pt(25 + i * 2.5, 19.5 + i * 1.5); dot(X, a[0], a[1], Math.max(3.2, R.s * .9), PROT, .9); }
        for (let i = 0; i < 12; i++) { const q = RED ? .5 : ((t * .5 + i / 12) % 1), a = i * 2.39, D = R.s * (1 + q * 6); dot(X, g[0] + Math.cos(a) * D, g[1] + Math.sin(a) * D, Math.max(1.4, R.s * .3), [GLI, SAL, AGU, URE][i % 4], (1 - q) * .9); }
        anel(X, g[0], g[1], t, FIL, 1.4, R.s * 6, 0, .7);
        legR(X, R, [[ART, 'hemácias: ficam no sangue'], [PROT, 'proteínas: ficam no sangue'], [FIL, 'filtrado: água e moléculas pequenas']], 'baixo');
      }
      if (et.id === 'prox') troca(X, s[0], s[1], rb, t, [GLI, AMI, SAL, AGU], false, 1);
      if (et.id === 'alca') troca(X, s[0], s[1], rb, t, f < FUNDO ? [AGU] : [SAL], false, 1);
      if (et.id === 'dist') { troca(X, s[0], s[1], rb, t, [HMAIS], true, 1); troca(X, s[0], s[1], rb * .8, t + .4, [SAL], false, .7); }
      if (et.id === 'duto') troca(X, s[0], s[1], rb, t, [AGU], false, 1);
      bolha(X, s[0], s[1], rb, corLiq(conc), t, v);
      const lg = { prox: [[GLI, 'glicose e aminoácidos voltam'], [SAL, 'sais voltam'], [AGU, 'água volta']], alca: [[AGU, 'desce: sai água'], [SAL, 'sobe: saem sais']],
        dist: [[HMAIS, 'secreção de H⁺ e K⁺'], [SAL, 'sódio volta (aldosterona)']], duto: [[AGU, 'água volta (ADH)']] }[et.id];
      if (lg) legR(X, R, lg, 'baixo');
    }

    // ---------- painel: concentração, volume e o que há no túbulo ----------
    function medidor(X, x, y, w, c, comp) {
      const nome = c < 250 ? 'diluído' : c < 400 ? 'igual ao sangue' : 'concentrado';
      txt(X, `cerca de ${Math.round(c / 50) * 50} mOsm/L`, x, y + 8, { s: comp ? 13 : 15, c: corLiq(Math.max(c, 300)) });
      if (!comp) txt(X, nome, x + w, y + 8, { s: 12, c: DIM, a: 'right', w: 500 });
      const by = y + (comp ? 22 : 24), bh = comp ? 8 : 10;
      const g = X.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, '#FBF6DA'); g.addColorStop(.25, FIL); g.addColorStop(1, '#B9780C');
      X.fillStyle = g; X.beginPath(); X.roundRect(x, by, w, bh, bh / 2); X.fill();
      const sx = x + w * 300 / 1200; X.fillStyle = 'rgba(11,15,28,.8)'; X.fillRect(sx - 1, by - 1, 2, bh + 2);
      const nx = x + w * cl(c / 1200, 0, 1);
      X.beginPath(); X.moveTo(nx, by - 2); X.lineTo(nx - 6, by - 9); X.lineTo(nx + 6, by - 9); X.closePath(); X.fillStyle = TXT; X.fill();
      X.fillStyle = TXT; X.fillRect(nx - 1, by - 2, 2, bh + 4);
      if (!comp) [[0, '0'], [300, 'sangue'], [1200, '1200']].forEach(([n, s]) => txt(X, s, x + w * n / 1200, by + bh + 11, { s: 12, c: DIM, w: 500, a: n === 0 ? 'left' : n === 1200 ? 'right' : 'center' }));
    }
    const fmtVol = v => v < 10 ? v.toFixed(1).replace('.', ',') : String(v < 100 ? Math.round(v / 5) * 5 : Math.round(v / 10) * 10);
    const ESTADO = {
      gli: (e, u) => e === 0 ? 'no sangue' : e === 1 ? 'filtrados' : e === 2 && u < .7 ? 'voltando ao sangue' : 'todos reabsorvidos',
      sal: (e, u) => e === 0 ? 'no sangue' : e === 1 ? 'filtrados' : e === 4 ? 'aldosterona: mais sódio volta' : e === 5 && u > .3 ? 'água volta (ADH)' : e >= 6 ? 'pouca água, muito soluto' : 'boa parte volta',
      ure: (e, u) => e === 0 ? 'no sangue' : e === 1 ? 'filtrada' : e >= 5 ? 'concentrada na urina' : 'fica no túbulo'
    };
    function linha(X, x, y, w, n, cor, niv, t) {
      const d = Math.min(14, w / n);
      for (let j = 0; j < n; j++) { const vivo = j < Math.round(niv * n) || (niv > 0 && j === 0 && niv > .02); const sobe = vivo ? 0 : 1; dot(X, x + j * d, y - sobe * 4, 4, cor, vivo ? 1 : .18); }
    }
    function painel(X, b, t, S, v) {
      const et = ET[v.e], c = concAgora(v.e, v.u), vol = volAgora(v.e, v.u);
      const L = [['Glicose e aminoácidos', GLI, nivel('gli', v.e, v.u), ESTADO.gli(v.e, v.u)], ['Sais e água', AGU, (nivel('sal', v.e, v.u) + nivel('agu', v.e, v.u)) / 2, ESTADO.sal(v.e, v.u)], ['Ureia', URE, nivel('ure', v.e, v.u), ESTADO.ure(v.e, v.u)]];
      if (!b.comp) {
        const px = b.x + 18, pw = b.w - 36;
        txt(X, 'Concentração do líquido', px, b.y + 72, { s: 12, c: DIM, w: 500 });
        medidor(X, px, b.y + 84, pw, c, false);
        txt(X, `cerca de ${fmtVol(vol)} L`, px, b.y + 152, { s: 20, w: 700 });
        txt(X, et.volN, px, b.y + 174, { s: 12, c: DIM, w: 500 });
        X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(px, b.y + 192, pw, 1);
        L.forEach(([n, cor, niv, est], i) => {
          const ly = b.y + 212 + i * 50;
          txt(X, n, px, ly, { s: 14, c: cor }); txt(X, est, px + pw, ly + 22, { s: 12, c: DIM, w: 500, a: 'right' });
          linha(X, px + 4, ly + 22, pw * .45, 6, cor, niv, t);
        });
      } else {
        const px = b.x + 12, pw = b.w - 24;
        medidor(X, px, b.y + 56, pw * .58, c, true);
        txt(X, `cerca de ${fmtVol(vol)} L`, px + pw, b.y + 62, { s: 15, w: 700, a: 'right' });
        txt(X, et.volC, px + pw, b.y + 79, { s: 11, c: DIM, w: 500, a: 'right' });
        const cw = pw / 3, my = b.y + b.h - 11;
        [['Glicose', GLI, L[0][2]], ['Sais e água', AGU, L[1][2]], ['Ureia', URE, L[2][2]]].forEach(([n, cor, niv], i) => {
          const cx = px + i * cw; txt(X, n, cx, my - 16, { s: 12, c: cor }); linha(X, cx + 4, my + 2, cw - 14, 5, cor, niv, t);
        });
      }
    }
    viagem({
      K: 'excretor/nefron', modo: 'nef', nome: 'Rim, néfron e a viagem do sangue até a urina', aria: 'Viagem do sangue até a urina: etapas',
      vistas: [
        ['a', 'excretor-nefron-v4a', 'Sistema urinário', 'Sistema urinário de frente: rins, ureteres, bexiga e uretra, com a aorta e a veia cava'],
        ['b', 'excretor-nefron-v4b', 'Néfron', 'Um néfron com o glomérulo na cápsula de Bowman, os túbulos, a alça de Henle, o ducto coletor e os capilares em volta']
      ],
      hs: HS, ET, VAI, faixa: 124, alto: 372, vel: S => S.v || 1, sobre, painel
    });
  })();

  // =====================================================================================================
  // 2) NERVOSO: impulso nervoso, arco reflexo, sinapse e autônomo
  // =====================================================================================================
  (function () {
    const IMP = '#FFE16B', SEN = '#F2C94C', MOT = '#5FD3E8', NT = '#F2B84C', OK = '#5FD38A', NA = '#8FD8FF', K = '#E58AB0';
    const ARa = [1.2, .896], ARr = [1.2, .896], ARb = [1.168, .88];
    // vista A (corpo): mão até a medula pelo nervo do braço; medula até o encéfalo
    const cBraco = caminho([[36.9, 58.4], [37.5, 50.2], [39, 42.4], [40.4, 36.3], [41.9, 29], [43.3, 24], [45.8, 21.8], [48.4, 20.4], [50.2, 21]], ARa);
    const cSobe = caminho([[50.2, 21], [50.2, 16.5], [50.1, 12.5], [50, 8.5]], ARa);
    // vista R (arco reflexo): da pele ao gânglio, ao interneurônio e ao neurônio motor; nervo motor até o músculo
    const cArco = caminho([[13, 74], [14.5, 68], [15, 62], [17, 56], [20.5, 51], [25, 46.5], [29, 42], [32.5, 36], [33.5, 33.5], [37, 30], [41, 27], [45, 24.5], [49, 25], [51.5, 27.5], [53.5, 30.5], [54, 33], [54.5, 36.5], [52.5, 42.5], [49, 47], [44, 50], [38, 47.5], [32, 46.5], [27, 47.5]], ARr);
    const cMusc = caminho([[27, 47.5], [24.6, 50], [24.6, 55], [27, 60], [31, 64], [34, 67], [37, 69.5], [39.5, 72.5], [40, 74]], ARr);
    // vista B (sinapse): impulso descendo pelo axônio até o terminal
    const cAx = caminho([[6, 0], [12, 8], [20, 17], [30, 27], [40, 36], [47, 47]], ARb);
    const REC = [[21.5, 66], [27.5, 66.5], [38, 69.5], [52.5, 69.5], [66, 66.5], [74, 65]];

    // potencial de ação: tau em segundos desde o disparo (forma didática, mais lenta que a real, que dura cerca de 2 ms)
    function pa(tau) {
      if (tau < 0) return -70;
      if (tau < .14) return lerp(-70, -55, sst(0, .14, tau));
      if (tau < .28) return lerp(-55, 35, sst(.14, .28, tau));
      if (tau < .5) return lerp(35, -80, sst(.28, .5, tau));
      if (tau < .8) return lerp(-80, -70, sst(.5, .8, tau));
      return -70;
    }
    function fase(tau) {
      if (tau < 0 || tau >= .8) return ['repouso', 'bomba de sódio e potássio mantém a carga'];
      if (tau < .14) return ['estímulo', 'a membrana se aproxima do limiar'];
      if (tau < .28) return ['despolarização', 'canais de Na⁺ abrem e o Na⁺ entra'];
      if (tau < .44) return ['repolarização', 'canais de K⁺ abrem e o K⁺ sai'];
      if (tau < .6) return ['hiperpolarização', 'passa um pouco do repouso'];
      return ['volta ao repouso', 'a bomba de sódio e potássio repõe as cargas'];
    }
    const ET = [
      { id: 'est', nome: 'Estímulo na pele', vista: 'a', dur: 4, per: 2.2, cap: 'A mão encosta numa panela quente. <b>Receptores</b> da pele transformam o calor em <b>impulso nervoso</b>.' },
      { id: 'sen', nome: 'Neurônio sensitivo', vista: 'a', dur: 6, per: 1.3, cap: 'O impulso sobe pelo <b>neurônio sensitivo</b>, no nervo do braço, até a <b>medula espinal</b>. Ele é elétrico e se propaga ao longo do axônio.' },
      { id: 'med', nome: 'Arco reflexo', vista: 'r', dur: 9, per: 1.3, cap: 'Na <b>medula</b>, o neurônio sensitivo passa o sinal a um <b>interneurônio</b>, que ativa o <b>neurônio motor</b>. O axônio motor sai pela raiz ventral do mesmo lado. É o <b>arco reflexo</b>: a resposta sai sem passar pelo encéfalo.' },
      { id: 'sin', nome: 'Sinapse química', vista: 'b', dur: 7, per: 2.2, cap: 'Entre dois neurônios há uma <b>sinapse</b>. O impulso faz as <b>vesículas</b> soltarem <b>neurotransmissor</b> na fenda, que encaixa nos <b>receptores</b> do neurônio seguinte.' },
      { id: 'mot', nome: 'Neurônio motor', vista: 'a', dur: 6, per: 1.3, cap: 'O <b>neurônio motor</b> leva a ordem da medula de volta ao braço. Neurônios com <b>bainha de mielina</b> conduzem mais rápido.' },
      { id: 'efe', nome: 'Efetor: o músculo', vista: 'r', dur: 6, per: 1.6, cap: 'Na <b>placa motora</b>, a acetilcolina faz o <b>músculo</b>, o efetor, contrair. A mão se afasta da panela.' },
      { id: 'enc', nome: 'Encéfalo: a dor', vista: 'a', dur: 5, per: 1.3, cap: 'Ao mesmo tempo, outro neurônio leva o sinal pela medula até o <b>encéfalo</b>. A dor é sentida quando a mão já se afastou.' },
      { id: 'aut', nome: 'Sistema autônomo', vista: 'c', dur: 12, per: 0, hold: 2, cap: 'O <b>sistema nervoso autônomo</b> age sem a vontade. O <b>simpático</b> prepara para luta ou fuga; o <b>parassimpático</b>, para repouso e digestão.' }
    ];
    const HS = [
      { id: 'enc', c: '#FFD43B', t: 'Encéfalo', d: 'Cérebro, cerebelo e tronco encefálico. Com a medula, forma o sistema nervoso central. É no cérebro que a dor e o calor são percebidos.', em: { a: [50, 8.5], c: [50, 14] }, z: 2.6 },
      { id: 'med', c: '#FFA94D', t: 'Medula espinal', d: 'Cordão dentro da coluna. Leva sinais entre o corpo e o encéfalo e coordena os reflexos, como o de tirar a mão do quente.', em: { a: [50.2, 33], c: [49.7, 29.3] }, z: 2.6 },
      { id: 'ner', c: SEN, t: 'Nervo do braço', d: 'Feixe de axônios de neurônios sensitivos e motores. Os nervos e gânglios formam o sistema nervoso periférico.', em: { a: [40.2, 37] }, z: 2.8 },
      { id: 'mao', c: '#F28B8B', t: 'Receptores da pele', d: 'Terminações que captam calor, dor, pressão e tato, e transformam o estímulo em impulso nervoso.', em: { a: [37, 56] }, z: 3 },
      { id: 'pel', c: '#F28B8B', t: 'Pele e receptor', d: 'O estímulo começa aqui. O receptor faz a membrana do neurônio sensitivo chegar ao limiar e disparar.', em: { r: [12, 78] }, z: 2.6 },
      { id: 'gan', c: SEN, t: 'Gânglio da raiz dorsal', d: 'Guarda o corpo celular do neurônio sensitivo, fora da medula. O sinal entra na medula pela raiz dorsal (posterior).', em: { r: [33, 34] }, z: 2.8 },
      { id: 'int', c: SEN, t: 'Interneurônio', d: 'Neurônio dentro da medula, na substância cinzenta. Liga o neurônio sensitivo ao motor e também manda o sinal ao encéfalo.', em: { r: [54.5, 32.5] }, z: 3.2 },
      { id: 'mot', c: MOT, t: 'Neurônio motor', d: 'Seu corpo fica no corno anterior da medula. O axônio sai pela raiz ventral (anterior), do mesmo lado por onde o sinal entrou, e vai até o músculo.', em: { r: [52.5, 42.5] }, z: 3.2 },
      { id: 'sub', c: '#E8EDF7', t: 'Substância cinzenta e branca', d: 'Na medula, a cinzenta (corpos dos neurônios, em forma de H ou borboleta) fica no meio, e a branca (axônios com mielina) por fora. No cérebro é o contrário.', em: { r: [68, 38] }, z: 2.4 },
      { id: 'mus', c: '#E5484D', t: 'Músculo (efetor)', d: 'Recebe a ordem do neurônio motor na placa motora e contrai. Efetor é o órgão que responde: um músculo ou uma glândula.', em: { r: [48, 78] }, z: 2.6 },
      { id: 'ter', c: '#F2A65A', t: 'Terminal do axônio', d: 'Ponta do neurônio que envia a mensagem. Quando o impulso chega, entra cálcio e as vesículas se fundem com a membrana.', em: { b: [62, 47] }, z: 2 },
      { id: 'ves', c: NT, t: 'Vesículas', d: 'Bolsinhas de membrana cheias de neurotransmissor, como acetilcolina, dopamina ou serotonina.', em: { b: [37, 39] }, z: 2.4 },
      { id: 'mit', c: '#F28C3A', t: 'Mitocôndria', d: 'Fornece o ATP que o terminal gasta para encher as vesículas e recolher o neurotransmissor depois.', em: { b: [36.5, 24] }, z: 2.4 },
      { id: 'fen', c: '#C9D3E6', t: 'Fenda sináptica', d: 'Espaço estreito entre os neurônios: eles não se tocam. O sinal atravessa a fenda na forma química e só vai num sentido.', em: { b: [44, 62] }, z: 2.6 },
      { id: 'rec', c: '#B79CF2', t: 'Receptores', d: 'Proteínas da membrana do neurônio seguinte. O neurotransmissor encaixa, os canais abrem, entra Na⁺ e o neurônio seguinte pode disparar. Muitas drogas agem aqui.', em: { b: [52.5, 72] }, z: 2.4 },
      { id: 'cor', c: '#F28B8B', t: 'Coração', d: 'O simpático acelera os batimentos e aumenta a força da contração. O parassimpático, pelo nervo vago, desacelera o coração.', em: { c: [50, 52.6] }, z: 3 },
      { id: 'pul', c: '#8FD8FF', t: 'Pulmões e brônquios', d: 'O simpático dilata os brônquios e facilita a entrada de ar. O parassimpático os estreita.', em: { c: [42.5, 49.2] }, z: 2.8 },
      { id: 'adr', c: '#FFD43B', t: 'Adrenais', d: 'Estimuladas pelo simpático, liberam adrenalina e noradrenalina no sangue, que prolongam a resposta de luta ou fuga.', em: { c: [45.6, 68.8] }, z: 3.2 },
      { id: 'est', c: '#A9C54A', t: 'Estômago', d: 'O parassimpático aumenta o movimento e a secreção de suco gástrico. O simpático reduz a digestão.', em: { c: [51, 70.2] }, z: 3 },
      { id: 'ins', c: '#A9C54A', t: 'Intestinos', d: 'O parassimpático estimula o peristaltismo. No estresse, o simpático o diminui e desvia o sangue para os músculos.', em: { c: [51.8, 84] }, z: 3 },
      { id: 'bex', c: '#CFE0FF', t: 'Bexiga', d: 'O parassimpático contrai a bexiga e promove o esvaziamento. O simpático relaxa a bexiga e ajuda a reter a urina.', em: { c: [49.2, 94.5] }, z: 3 }
    ];
    const ONDE = { a: 'baixo', r: 'cima', b: 'dir', c: 'cima' };
    const VAI = { mao: 0, ner: 1, pel: 2, gan: 2, int: 2, sub: 2, ter: 3, ves: 3, mit: 3, fen: 3, rec: 3, mot: 4, mus: 5, enc: 6, med: 2, cor: 7, pul: 7, adr: 7, est: 7, ins: 7, bex: 7 };

    // relógio do potencial de ação e o traçado guardado (cerca de 4 s)
    const NH = 160, DTH = .025;
    function aoIr(S, v) { v.tau = ET[v.e].per ? (ET[v.e].id === 'est' ? -1.2 : 0) : 99; }
    function tick(S, v, dt) {
      if (!v.hist) { v.hist = []; v.acc = 0; v.tau = -1.2; }
      if (RED) return;
      const per = ET[v.e].per; v.tau += dt; if (per && v.tau > per) v.tau -= per;
      v.acc += dt; while (v.acc >= DTH) { v.acc -= DTH; v.hist.push(pa(v.tau)); if (v.hist.length > NH) v.hist.shift(); }
    }
    // impulso: ponto brilhante com cauda
    function impulso(X, R, cam, f, cor, comp) {
      const rr = cl(R.s * 1.1, 4, 10);
      for (let k = 6; k >= 0; k--) { const p = cam.em(f - k * .012), s = R.pt(p[0], p[1]); dot(X, s[0], s[1], rr * (1 - k * .11), cor, k ? .5 * (1 - k / 7) : 1); }
      const p = cam.em(f), s = R.pt(p[0], p[1]); brilho(X, s[0], s[1], rr * 4, cor, 1);
      return s;
    }
    function sobre(R, X, t, S, v) {
      const et = ET[v.e], u = RED ? .6 : eIO(v.u), nar = R.w < 520;
      if (et.id === 'est') {
        const m = R.pt(36.9, 58.4); brilho(X, m[0], m[1], R.s * 8, '#FF6B4A', .9); anel(X, m[0], m[1], t, '#FF8A5C', 1.1, R.s * 6, 0, .9);
        if (v.tau > 0 && v.tau < .5) impulso(X, R, cBraco, .02, IMP);
        legR(X, R, [['#FF8A5C', 'calor na ponta dos dedos']], ONDE[et.vista]);
      } else if (et.id === 'sen' || et.id === 'mot') {
        const f = et.id === 'sen' ? u : 1 - u; cBraco.rastro(X, R, et.id === 'sen' ? 0 : f, et.id === 'sen' ? f : 1, rgba(et.id === 'sen' ? SEN : MOT, .7));
        impulso(X, R, cBraco, f, et.id === 'sen' ? IMP : MOT);
        if (et.id === 'mot' && v.u > .85) { const b = R.pt(39.5, 41); anel(X, b[0], b[1], t, MOT, 1, R.s * 5); }
        legR(X, R, [[et.id === 'sen' ? IMP : MOT, et.id === 'sen' ? 'impulso sensitivo: da mão à medula' : 'impulso motor: da medula ao músculo']], ONDE[et.vista]);
      } else if (et.id === 'enc') {
        cSobe.rastro(X, R, 0, u, rgba(IMP, .7)); impulso(X, R, cSobe, u, IMP);
        if (v.u > .8 || RED) { const b = R.pt(50, 8); brilho(X, b[0], b[1], R.s * 9, '#FF8A5C', 1); anel(X, b[0], b[1], t, '#FF8A5C', 1.4, R.s * 7); }
        legR(X, R, [[IMP, 'sinal que sobe ao encéfalo: a dor']], ONDE[et.vista]);
      } else if (et.id === 'med') {
        cArco.rastro(X, R, 0, u, rgba(IMP, .75)); const s = impulso(X, R, cArco, u, u > cArco.FI(17) ? MOT : IMP);
        [[33.5, 33.5, cArco.FI(8), SEN], [54, 33, cArco.FI(15), SEN], [52.5, 42.5, cArco.FI(17), MOT]].forEach(([x, y, fr, cr]) => { if (u >= fr - .02 || RED) { const p = R.pt(x, y); anel(X, p[0], p[1], t, cr, 1.2, R.s * 4); } });
        void s;
        legR(X, R, [[IMP, 'neurônio sensitivo e interneurônio'], [MOT, 'neurônio motor']], ONDE[et.vista]);
      } else if (et.id === 'efe') {
        const fm = lerp(0, 1, u); cMusc.rastro(X, R, 0, fm, rgba(MOT, .8)); impulso(X, R, cMusc, fm, MOT);
        const ct = RED ? 1 : sst(.75, 1, v.u) * (.6 + .4 * Math.sin(t * 6) ** 2), m = R.pt(44, 75);
        if (ct > 0) { brilho(X, m[0], m[1], R.s * 12, '#FF6B6B', ct); [[36.5, 75], [33, 74], [40, 71.5]].forEach(([x, y], i) => { const p = R.pt(x, y); dot(X, p[0], p[1], Math.max(2, R.s * .5), MOT, ct); anel(X, p[0], p[1], t, MOT, 1.1, R.s * 2.5, i * .2, ct); }); }
        legR(X, R, [['#FF6B6B', 'o músculo contrai e a mão se afasta']], ONDE[et.vista]);
      } else if (et.id === 'sin') {
        // um ciclo por disparo: impulso chega, vesícula solta, neurotransmissor cai e encaixa, entra Na⁺, recaptação
        const ta = RED ? .9 : ((v.tau % et.per) + et.per) % et.per, ch = ta / 1;
        if (ch < .45 || RED) { const q = RED ? 1 : ch / .45; cAx.rastro(X, R, 0, q, rgba(IMP, .6)); if (!RED) impulso(X, R, cAx, q, IMP); }
        const fus = RED ? 1 : sst(.4, .55, ch) * (1 - sst(1.6, 2.1, ta)), vs = R.pt(47.5, 51);
        if (fus > 0) brilho(X, vs[0], vs[1], R.s * 7, NT, fus);
        for (let i = 0; i < 18; i++) {
          const k = i % REC.length, h = ((i * 7919) % 100) / 100, q = RED ? .5 + .5 * h : (ta - .5 - h * .35) / .6; if (q <= 0) continue;
          const a0 = [47.5 + (h - .5) * 4, 56], a1 = [REC[k][0] + (h - .5) * 2, REC[k][1] - 2.5];
          let x, y, al = 1;
          if (q < 1) { const w = sst(0, 1, q); x = lerp(a0[0], a1[0], w) + Math.sin(i + q * 9) * .6; y = lerp(a0[1], a1[1], w); }
          else { const w = sst(1, 1.6, q); x = lerp(a1[0], 47 + (h - .5) * 20, w); y = lerp(a1[1], 57, w); al = 1 - sst(1.3, 1.6, q); }
          const p = R.pt(x, y); dot(X, p[0], p[1], Math.max(1.8, R.s * .45), NT, al * .95);
        }
        const lig = RED ? 1 : sst(1, 1.25, ta) * (1 - sst(1.8, 2.15, ta));
        REC.forEach((r, k) => { const p = R.pt(r[0], r[1]); if (lig > 0) brilho(X, p[0], p[1], R.s * 5, OK, lig); if (lig > .3) for (let j = 0; j < 2; j++) { const q = RED ? .5 : ((t * 1.2 + j * .5 + k * .17) % 1), s2 = R.pt(r[0] + (j - .5), r[1] + 3 + q * 12); dot(X, s2[0], s2[1], Math.max(1.6, R.s * .35), NA, lig * (1 - q)); } });
        legR(X, R, [[IMP, 'impulso elétrico chega'], [NT, 'neurotransmissor na fenda'], [OK, 'receptor ativado'], [NA, 'Na⁺ entra no neurônio seguinte']], ONDE[et.vista]);
      } else if (et.id === 'aut') {
        // simpático (luta ou fuga) e parassimpático (repouso e digestão) se alternam a cada 6 s
        const simp = RED ? true : (v.u * et.dur % 12) < 6, cor = simp ? '#FFB347' : '#6EC8E8', s = R.s;
        const co = R.pt(50, 52.6), est = R.pt(51, 70.2), int = R.pt(51.8, 84), ad1 = R.pt(45.6, 68.8), ad2 = R.pt(54.4, 68.8), pul = R.pt(42.5, 49.2), pul2 = R.pt(58, 49.2);
        anel(X, co[0], co[1], t, cor, simp ? .55 : 1.1, s * 4, 0, .9);
        if (simp) { [ad1, ad2].forEach((p, i) => anel(X, p[0], p[1], t, '#FFD43B', 1.6, s * 3, i * .4)); [pul, pul2].forEach((p, i) => anel(X, p[0], p[1], t, '#FFB347', 1.5, s * 4.5, i * .3, .5)); }
        else { [est, int].forEach((p, i) => anel(X, p[0], p[1], t, '#6EC8E8', 2.2, s * 4.5, i * .7, .8)); }
        legR(X, R, [[cor, simp ? 'Simpático: luta ou fuga' : 'Parassimpático: repouso e digestão']], ONDE[et.vista]);
      }
    }
    // ---------- painel: potencial de membrana ----------
    function traco(X, x, y, w, h, hist, mv) {
      X.fillStyle = 'rgba(255,255,255,.04)'; X.fillRect(x, y, w, h);
      const ym = m => y + h * (1 - (m + 90) / 130);
      [[-70, 'repouso'], [-55, h < 100 ? '' : 'limiar'], [0, '0 mV']].forEach(([m, s]) => { const dy = m === -70 ? 9 : -7; X.strokeStyle = m === -70 ? 'rgba(143,216,255,.35)' : 'rgba(255,255,255,.12)'; X.setLineDash(m === -55 ? [3, 4] : []); X.lineWidth = 1; X.beginPath(); X.moveTo(x, ym(m)); X.lineTo(x + w, ym(m)); X.stroke(); txt(X, s, x + w - 4, ym(m) + dy, { s: 11, c: DIM, w: 500, a: 'right' }); });
      X.setLineDash([]);
      const pts = RED ? Array.from({ length: NH }, (_, i) => pa((i - 40) * DTH)) : hist;
      if (pts.length > 1) {
        X.strokeStyle = IMP; X.lineWidth = 2; X.lineJoin = 'round'; X.beginPath();
        const off = NH - pts.length; pts.forEach((m, i) => { const px = x + (off + i) / (NH - 1) * w, py = ym(m); if (i) X.lineTo(px, py); else X.moveTo(px, py); }); X.stroke();
        if (!RED) dot(X, x + w, ym(mv), 4, IMP, 1);
      }
    }
    const fmtMv = m => (m < -.5 ? '−' : m > .5 ? '+' : '') + Math.abs(Math.round(m)) + ' mV';
    function painel(X, b, t, S, v) {
      const et = ET[v.e], semPA = !et.per, mv = RED || semPA ? -70 : pa(v.tau), fz = RED ? ['um potencial de ação', 'repouso, despolarização e repolarização'] : semPA ? ['repouso', 'o autônomo usa os mesmos impulsos'] : fase(v.tau);
      const hist = v.hist || [];
      const cor = mv > -50 ? '#FFB347' : mv < -72 ? '#B79CF2' : NA;
      if (!b.comp) {
        const px = b.x + 18, pw = b.w - 36;
        txt(X, 'Potencial de membrana', px, b.y + 72, { s: 12, c: DIM, w: 500 });
        txt(X, fmtMv(mv), px, b.y + 98, { s: 22, w: 700, c: cor });
        txt(X, fz[0], px + pw, b.y + 98, { s: 14, c: TXT, a: 'right' });
        txt(X, fz[1], px, b.y + 124, { s: 12, c: DIM, w: 500 });
        traco(X, px, b.y + 142, pw, 128, hist, mv);
        X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(px, b.y + 286, pw, 1);
        [[NA, 'Na⁺ entra: despolariza'], [K, 'K⁺ sai: repolariza'], [OK, 'tudo ou nada: só passa do limiar']].forEach(([c, s], i) => { dot(X, px + 5, b.y + 306 + i * 22, 4.5, c, 1); txt(X, s, px + 16, b.y + 306 + i * 22, { s: 13, w: 500 }); });
      } else {
        const px = b.x + 12, pw = b.w - 24;
        txt(X, fmtMv(mv), px, b.y + 66, { s: 17, w: 700, c: cor });
        txt(X, fz[0], px + pw, b.y + 66, { s: 13, a: 'right' });
        traco(X, px, b.y + 80, pw, b.h - 86, hist, mv);
      }
    }
    // o modo da viagem é o "sin" da cena (o mesmo em que o 3D mostra a sinapse); "Repouso e susto" segue no desenho plano
    const c3 = SC['nervoso/autonomo'];
    if (c3) {
      const md = (id, tt) => ({ t: tt, on: S => { S.modo = id; S.msg = null; S.fl = null; }, pressed: S => S.modo === id });
      c3.extra = [md('sin', 'Impulso e sinapse'), md('aut', 'Repouso e susto')];
    }
    viagem({
      K: 'nervoso/autonomo', modo: 'sin', nome: 'Impulso nervoso, arco reflexo, sinapse e autônomo', aria: 'Viagem do impulso nervoso: etapas',
      vistas: [
        ['a', 'nervoso-organizacao-a', 'Corpo', 'Sistema nervoso no corpo translúcido: encéfalo, medula espinal e nervos'],
        ['r', 'nervoso-organizacao-b2', 'Arco reflexo', 'Corte da medula espinal com o arco reflexo: pele, neurônio sensitivo, interneurônio, neurônio motor e músculo'],
        ['b', 'nervoso-autonomo-v4b', 'Sinapse', 'Sinapse química de perto: terminal do axônio com vesículas, fenda sináptica e receptores do neurônio seguinte'],
        ['c', 'nervoso-autonomo-a', 'Autônomo', 'Corpo translúcido com os órgãos controlados pelo simpático e pelo parassimpático']
      ],
      hs: HS, ET, VAI, faixa: 150, alto: 386, sobre, painel, tick, aoIr,
      novo: () => ({ tau: -1.2, hist: [], acc: 0 }),
      aoAbrir: S => { S.modo = 'sin'; }
    });
  })();
})();
