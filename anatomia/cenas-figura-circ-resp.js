/* LAB Anatomia: duas viagens sobre figuras de IA realistas (Martin + Íris), no padrão de cenas-figura-digestorio.js.
   1. circulatorio/coracao: uma hemácia faz a volta completa pelas pequena e grande circulação.
      Vista A: coração em corte frontal (4 câmaras, valvas, grandes vasos, parede do VE mais grossa).
      Vista B: tórax com coração, pulmões e o circuito; entra sozinha nas etapas Pulmões e Corpo.
      Medidor: hemoglobina com O₂ (saturação), com a cor da hemácia indo de venoso a arterial.
   2. respiratorio/hematose: o ar vai do nariz aos alvéolos, avançando só quando o diafragma contrai (inspiração).
      Vista A: vias respiratórias da cabeça ao diafragma. Vista B: alvéolos com capilares (recorte da figura antiga).
      Medidor: pressão parcial de O₂ e de CO₂, e a pressão no pulmão em relação à do ar.
   Tocar num ponto da figura leva a viagem até ele. O 3D e os modos antigos seguem nos botões de sempre.
   Com prefers-reduced-motion nada anda sozinho: etapas por botão. Usa os globais do motor (SC, X, W, H, NAR, cap, cv).
   Carregar depois de cenas-figura.js e antes de LAB_ANATOMIA_iniciar(). Texto na tela: sem "!", sem setas ou pontos como separador. */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const RED = LAB_FIGALT.RED, PI = Math.PI, TAU = PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
  const sst = (a, b, x) => { const u = cl((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const eIO = u => { u = cl(u, 0, 1); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  const fr = v => v - Math.floor(v);
  const hx = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const rgba = (h, a) => { const c = hx(h); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };
  const mix = (a, b, k) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], cl(k, 0, 1))).toString(16).padStart(2, '0')).join(''); };
  const FT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const TXT = '#E8EDF7', DIM = '#9DA9C4', AMB = '#FFB347';
  const ART = '#E5484D', VEN = '#7C6FD6', O2C = '#6EC8E8', CO2C = '#B7C0D3', AR = '#BDE8FF';

  // ---------- curvas suaves (Catmull-Rom) medidas em distância real da figura ----------
  function curva(P, asp) {
    const N = 12, AM = [], IDX = [], LC = [0];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      IDX[i] = AM.length;
      for (let j = 0; j < N; j++) { const t = j / N, t2 = t * t, t3 = t2 * t; AM.push([0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3))); }
    }
    IDX[P.length - 1] = AM.length; AM.push(P[P.length - 1].slice());
    for (let i = 1; i < AM.length; i++) LC.push(LC[i - 1] + Math.hypot((AM[i][0] - AM[i - 1][0]) * asp[0], (AM[i][1] - AM[i - 1][1]) * asp[1]));
    const LT = LC[LC.length - 1] || 1, LF = LC.map(v => v / LT);
    return {
      AM, LF, FI: i => LF[IDX[i]],
      em(f) { f = cl(f, 0, 1); let i = 1; while (i < LF.length - 1 && LF[i] < f) i++; const u = (f - LF[i - 1]) / ((LF[i] - LF[i - 1]) || 1), a = AM[i - 1], b = AM[i]; return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), Math.atan2((b[1] - a[1]) * asp[1], (b[0] - a[0]) * asp[0])]; }
    };
  }
  // rastro tracejado de f0 até f1 sobre a figura
  function rastro(R, X, C, f0, f1, cor) {
    X.save(); X.setLineDash([2, 5]); X.lineCap = 'round'; X.strokeStyle = cor; X.lineWidth = 1.6; X.beginPath();
    let st = false; for (let i = 0; i < C.AM.length; i++) { if (C.LF[i] < f0) continue; if (C.LF[i] > f1) break; const s = R.pt(C.AM[i][0], C.AM[i][1]); if (!st) { X.moveTo(s[0], s[1]); st = true; } else X.lineTo(s[0], s[1]); }
    const e = C.em(f1), s = R.pt(e[0], e[1]); if (st) { X.lineTo(s[0], s[1]); X.stroke(); } X.restore();
  }

  // ---------- desenho miúdo ----------
  function dot(X, x, y, r, c, a) { X.globalAlpha = cl(a, 0, 1); X.beginPath(); X.arc(x, y, Math.max(.1, r), 0, TAU); X.fillStyle = c; X.fill(); X.globalAlpha = 1; }
  function brilho(X, x, y, r, c, a) { if (a <= 0) return; const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(c, a)); g.addColorStop(1, rgba(c, 0)); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); }
  function anel(X, x, y, r, c, a) { X.beginPath(); X.arc(x, y, r, 0, TAU); X.strokeStyle = rgba(c, cl(a, 0, 1)); X.lineWidth = 2; X.stroke(); }
  function txt(X, s, x, y, o = {}) { X.font = `${o.w || 600} ${o.s || 13}px ${FT}`; X.fillStyle = o.c || TXT; X.textAlign = o.a || 'left'; X.textBaseline = 'middle'; X.fillText(s, x, y); }
  function seta(X, x, y, ang, r, c, a) { X.save(); X.globalAlpha = a; X.translate(x, y); X.rotate(ang); X.beginPath(); X.moveTo(r, 0); X.lineTo(-r * .7, r * .75); X.lineTo(-r * .3, 0); X.lineTo(-r * .7, -r * .75); X.closePath(); X.fillStyle = c; X.fill(); X.strokeStyle = 'rgba(11,15,28,.7)'; X.lineWidth = 1; X.stroke(); X.restore(); }
  // hemácia: disco bicôncavo (centro mais claro), cor entre venoso e arterial; as bolinhas em volta são o O₂ da hemoglobina
  function hemacia(X, x, y, r, ang, sat, t, alfa, marca) {
    const k = cl((sat - .75) / .23, 0, 1), cor = mix(VEN, ART, k), a = alfa == null ? 1 : alfa;
    X.save(); X.globalAlpha = a;
    brilho(X, x, y, r * 3, cor, .38);
    if (marca) { X.beginPath(); X.arc(x, y, r * 1.85, 0, TAU); X.strokeStyle = rgba(AMB, .85); X.lineWidth = 1.6; X.setLineDash([3, 3]); X.stroke(); X.setLineDash([]); }
    X.translate(x, y); X.rotate(ang);
    X.beginPath(); X.ellipse(0, 0, r, r * .78, 0, 0, TAU);
    const g = X.createRadialGradient(0, 0, r * .1, 0, 0, r); g.addColorStop(0, mix(cor, '#FFFFFF', .28)); g.addColorStop(.45, mix(cor, '#000000', .18)); g.addColorStop(.8, cor); g.addColorStop(1, mix(cor, '#000000', .3));
    X.fillStyle = g; X.fill(); X.strokeStyle = 'rgba(11,15,28,.75)'; X.lineWidth = 1.2; X.stroke();
    X.restore();
    // quatro lugares de O₂ por hemoglobina: cerca de 3 ocupados no sangue venoso, 4 no arterial
    const tt = RED ? 0 : t, n = sat * 4;
    for (let i = 0; i < 4; i++) { const al = cl(n - i, 0, 1); if (al <= .02) continue; const q = tt * 1.4 + i * PI / 2; dot(X, x + Math.cos(q) * r * 1.45, y + Math.sin(q) * r * 1.2, Math.max(2, r * .26), O2C, al * a); }
  }
  function legLinha(X, cx, y, itens) {
    X.save(); X.font = `600 12px ${FT}`; X.textBaseline = 'middle';
    const ws = itens.map(i => X.measureText(i[1]).width + 26), tot = ws.reduce((a, b) => a + b, 0) + 8 * (itens.length - 1);
    let x = Math.max(8, cx - tot / 2); X.fillStyle = 'rgba(11,15,28,.82)'; X.beginPath(); X.roundRect(x - 8, y - 12, tot + 16, 24, 12); X.fill();
    itens.forEach((it, i) => { dot(X, x + 6, y, 4.5, it[0], 1); X.fillStyle = TXT; X.textAlign = 'left'; X.fillText(it[1], x + 16, y); x += ws[i] + 8; });
    X.restore();
  }
  function leg(X, x, y, itens, dir) {
    X.save(); X.font = `600 ${NAR ? 12 : 13}px ${FT}`; X.textBaseline = 'middle';
    const w = Math.max(...itens.map(i => X.measureText(i[1]).width)) + 34, h = itens.length * 20 + 10; if (dir) { x -= w; y -= h; }
    X.fillStyle = 'rgba(11,15,28,.82)'; X.beginPath(); X.roundRect(x, y, w, h, 8); X.fill();
    itens.forEach((it, i) => { dot(X, x + 14, y + 15 + i * 20, 4.5, it[0], 1); X.fillStyle = TXT; X.textAlign = 'left'; X.fillText(it[1], x + 26, y + 15 + i * 20); });
    X.restore();
  }
  // barra de medidor com agulha
  function barra(X, x, y, w, h, k, cores, agulha) {
    const g = X.createLinearGradient(x, 0, x + w, 0); cores.forEach((c, i) => g.addColorStop(i / (cores.length - 1), c));
    X.fillStyle = g; X.beginPath(); X.roundRect(x, y, w, h, h / 2); X.fill();
    if (agulha === false) return;
    const nx = x + w * cl(k, 0, 1);
    X.beginPath(); X.moveTo(nx, y - 2); X.lineTo(nx - 6, y - 9); X.lineTo(nx + 6, y - 9); X.closePath(); X.fillStyle = TXT; X.fill();
    X.fillStyle = TXT; X.fillRect(nx - 1, y - 2, 2, h + 4);
  }

  // ---------- botões da viagem (um estilo para as duas cenas) ----------
  const ICO = { ant: '<path d="M14.5 6 8.5 12l6 6"/>', prox: '<path d="m9.5 6 6 6-6 6"/>', pausa: '<path d="M9 6v12M15 6v12"/>', play: '<path d="M8 5.5v13l10-6.5z"/>' };
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;
  function estilo() {
    if (document.getElementById('cr-css')) return;
    const st = document.createElement('style'); st.id = 'cr-css';
    st.textContent = `.cr-nav{position:absolute;left:0;top:0;z-index:2;display:flex;align-items:center;gap:6px}
.cr-nav[hidden]{display:none}
.cr-nav button{font:inherit;width:44px;height:44px;flex:none;display:grid;place-items:center;border-radius:10px;border:1px solid var(--line-strong,#5B6C99);background:rgba(19,26,43,.92);color:var(--txt,#E8EDF7);cursor:pointer;transition:background-color 90ms,border-color 90ms,color 90ms}
.cr-nav button:hover{background:var(--panel-2,#1B2440);border-color:var(--amber,#FFB347)}
.cr-nav button:active{transform:scale(.96)}
.cr-nav button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
.cr-nav button svg{width:22px;height:22px}
.cr-nav button[hidden]{display:none}
.cr-nav .et{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;padding:0 6px;line-height:1.2}
.cr-nav .et small{font-size:12px;color:var(--dim,#9DA9C4)}
.cr-nav .et b{font-size:15px;font-weight:600;color:var(--txt,#E8EDF7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(prefers-reduced-motion:reduce){.cr-nav button{transition:none}.cr-nav button:active{transform:none}}`;
    document.head.appendChild(st);
  }

  // ---------- layout (igual ao do digestório) ----------
  const compacto = () => NAR || W < 1160;
  const capRes = () => NAR ? 116 : 76, faixaH = () => 124;
  const reserva = () => compacto() ? capRes() + faixaH() + 8 : 56;

  // ---------- motor de uma viagem sobre a figura ----------
  // C: { K, modo, rotulo, nome, aria, vistas, hs, ET, VAI, vel(S), passo(v, k, dt), sobre(R, X, t, S, v), painel(X, caixa, t, S, v), alturaPainel, extra3d, loc, novo() }
  function viagem(C) {
    const c3 = SC[C.K]; if (!c3) return;
    const ET = C.ET, NE = ET.length;
    const novo = () => Object.assign({ e: 0, u: RED ? 1 : 0, hold: 0, pausa: false }, C.novo ? C.novo() : {});
    let FIG = null, Sx = null, ultAb = null, vivo = 0, NAV = null, sincK = '', navK = '', em3d = false, Rfig = null;
    const api = { legB: null };
    function irPara(S, e, troca) {
      const v = S.vg; v.e = (e + NE) % NE; v.u = RED ? 1 : 0; v.hold = 0;
      if (troca && FIG) { const q = ET[v.e].v || 'a'; if (FIG.vistaAtual !== q) FIG.mostrar(q); }
      sinc(S);
    }
    function avancar(S, dt) {
      const v = S.vg, et = ET[v.e];
      if (RED || v.pausa || !dt) return;
      const k = dt * C.vel(S), ku = C.passo ? C.passo(v, k, et) : k;
      if (v.u < 1) { v.u = Math.min(1, v.u + ku / et.dur); return; }
      v.hold += k;
      if (v.hold > (v.e < NE - 1 ? 1.4 : 3)) irPara(S, v.e + 1, true);
    }
    function montarNav() {
      if (NAV) return; estilo();
      NAV = document.createElement('div'); NAV.className = 'cr-nav'; NAV.hidden = true; NAV.setAttribute('role', 'group'); NAV.setAttribute('aria-label', C.aria);
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
    function sinc(S) {
      if (!NAV) return; const v = S.vg, k = v.e + '|' + v.pausa; if (k === sincK) return; sincK = k;
      NAV.querySelector('.et small').textContent = `Etapa ${v.e + 1} de ${NE}`;
      NAV.querySelector('.et b').textContent = ET[v.e].nome;
      const p = NAV.querySelector('[data-a="pausa"]'), tt = v.pausa ? 'Continuar a viagem' : 'Pausar a viagem';
      p.innerHTML = svg(v.pausa ? 'play' : 'pausa'); p.title = tt; p.setAttribute('aria-label', tt);
    }
    function posNav(x, y, w) { const k = [x, y, w].map(Math.round).join(); if (k === navK) return; navK = k; NAV.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`; NAV.style.width = Math.round(w) + 'px'; }

    function sobre(R, X, t, c) {
      const S = c.S; if (!S || !S.vg) return; Sx = S; vivo = performance.now();
      if (!FIG) FIG = c3.figura;
      const ab = FIG && FIG.aberto ? FIG.aberto.id : null;
      if (ab !== ultAb) { ultAb = ab; if (ab && C.VAI[ab] != null && C.VAI[ab] !== S.vg.e) irPara(S, C.VAI[ab], false); }
      avancar(S, S.dt || 0);
      Rfig = R; api.legB = null;
      C.sobre(R, X, t, S, S.vg, api);
    }
    function fora(X, t, c) {
      const S = c.S; if (!S || !S.vg || !Rfig) return; montarNav(); sinc(S); NAV.hidden = false;
      if (api.legB) { if (compacto()) legLinha(X, W / 2, H - capRes() - faixaH() - 22, api.legB); else leg(X, W - 28, H - reserva() - 8, api.legB, true); }
      let bx;
      if (!compacto()) {
        const x0 = 28, w = 330, y0 = 60, h = C.alturaPainel;
        X.fillStyle = 'rgba(11,15,28,.72)'; X.beginPath(); X.roundRect(x0, y0, w, h, 14); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
        posNav(x0 + 10, y0 + 10, w - 20); bx = { x: x0 + 18, y: y0 + 64, w: w - 36, comp: false };
      } else {
        const x0 = NAR ? 6 : 24, w = W - 2 * x0, h = faixaH(), y0 = H - capRes() - h - 4;
        X.fillStyle = 'rgba(11,15,28,.78)'; X.beginPath(); X.roundRect(x0, y0, w, h, 12); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
        posNav(x0 + 6, y0 + 6, w - 12); bx = { x: x0 + 12, y: y0 + 64, w: w - 24, h: h - 64, comp: true };
      }
      C.painel(X, bx, t, S, S.vg);
    }
    // legenda de cor dentro da figura (vista larga) ou numa linha abaixo dela (telas estreitas)
    // (desenhada em fora(), sem o recorte da figura)
    api.legenda = (R, X, itens) => { api.legB = itens; };

    // ---------- registro: figura padrão; os modos antigos e o 3D seguem nos botões ----------
    const plano = c3.plano ? (t, S) => c3.plano(t, S) : null;
    const d3 = c3.draw; let chamou3 = false;
    c3.draw = function (...a) { chamou3 = true; return d3.apply(this, a); };
    const clicaExtra = rot => { const i = (c3.extra || []).findIndex(x => x.t === rot), b = document.querySelector(`#extra button[data-i="${i}"]`); if (b) b.click(); };
    const amb = {
      SC, X: () => X, W: () => W, H: () => H, nar: () => NAR, tela: cv.parentNode,
      cap: () => { const S = Sx; cap(S && S.vg ? ET[S.vg.e].cap : ''); },
      t: a => a[0], rot3d: C.rot3d || 'Ver em 3D', dica3d: C.dica3d || 'Arraste para girar o modelo',
      esconder: ['.hud.onde'], esconderFig: [],
      // o 3D não tem a viagem: troca para o modo antigo que o 3D mostra
      // (depois do init do 3D, que devolve o tópico ao primeiro modo)
      ao3d: () => { em3d = true; setTimeout(() => { if (Sx && (Sx.modo === C.modo || Sx.modo === C.modo0)) clicaExtra(C.extra3d); }, 0); }
    };
    LAB_FIGALT.cena(amb, C.K, { pref: 'anatomia', nome: C.nome, mask: { miolo: .86, borda: 1 }, vistas: C.vistas, hs: C.hs, reserva, sobre, fora });
    // "Ver figura" volta para a viagem
    document.addEventListener('click', e => {
      const b = e.target.closest && e.target.closest('.fa-barra button[data-m="fig"]');
      if (!b || !Sx || SC[decodeURIComponent(location.hash.slice(1))] !== c3) return;
      if (Sx.modo !== C.modo) clicaExtra(C.rotulo);
    }, true);
    // o botão da viagem: liga o modo e, se o 3D estiver na tela, volta para a figura
    const ex = (c3.extra || []).find(x => x.t === (C.rotuloAntigo || C.rotulo)); if (ex) ex.t = C.rotulo;
    const naViagem = S => { S.modo = C.modo; S.vg = novo(); sincK = ''; ultAb = null; if (em3d) { const b = document.querySelector('.fa-barra button[data-m="fig"]'); if (b) b.click(); } };
    if (ex) { const o0 = ex.on; ex.on = S => { o0(S); naViagem(S); }; }
    else (c3.extra = c3.extra || []).unshift({ t: C.rotulo, on: naViagem, pressed: S => S.modo === C.modo });
    const dFig = c3.draw, i1 = c3.init;
    c3.init = function (S) { i1.call(this, S); if (!S.modo) S.modo = C.modo; S.vg = novo(); sincK = ''; ultAb = null; };
    c3.draw = function (t, S) {
      if (!S.modo) S.modo = C.modo;
      if (!S.vg) S.vg = novo();
      if (S.modo !== C.modo && !em3d) { const pl = plano || d3; X.save(); try { pl.call(c3, t, S); } catch (e) { console.error(e); } X.restore(); return; }
      chamou3 = false; const r = dFig.call(this, t, S); em3d = chamou3; return r;
    };
    if (C.ajustes) C.ajustes(c3);
  }

  // =====================================================================================
  // 1. Circulatório: a viagem da hemácia
  // =====================================================================================
  (function () {
    const AS = [.88, 1.18];   // proporção das duas figuras (880 x 1179)
    // vista A (coração em corte): lado direito (venoso) e lado esquerdo (arterial), conferidos sobre a imagem
    const DIR = curva([[29, 6], [29, 20], [28.5, 33], [26, 44], [27, 52], [31, 59], [34, 67], [40, 75], [43, 63], [44, 54], [45.5, 47], [46, 40], [50, 32], [58, 28.5], [68, 28], [80, 29.5]], AS);
    const ESQ = curva([[87, 35.5], [79, 37], [71, 40], [65, 44], [66, 51], [66, 60], [64, 70], [62, 76], [58, 66], [56, 57], [55.5, 49], [50, 41], [42, 36], [40, 27], [45, 18], [53, 15.5], [62, 18], [66.5, 25]], AS);
    // vista B (tórax): a volta inteira
    const VOLTA = curva([[45, 22], [45, 33], [46, 43], [47, 49], [48, 53], [50.5, 56], [53, 59], [54, 53], [53, 46.5], [56, 42.5], [62, 40], [68, 39],
      [72, 35.5], [76, 40], [74, 46], [69, 46.5], [64, 46], [61, 48], [60, 52], [61, 58], [57, 55], [54, 48], [50, 40], [51, 34.5], [54, 37], [54.5, 46],
      [54.5, 62], [54, 76], [53, 88], [50.5, 93], [48, 88], [47.5, 75], [47.5, 62], [47.5, 55]], AS);
    const ET = [
      { id: 'cavas', nome: 'Veias cavas', a: [DIR, 0, 3], b: [0, 3], dur: 4, circ: 1,
        cap: 'As <b>veias cavas</b> trazem do corpo o <b>sangue venoso</b>, pobre em O₂ e rico em CO₂, até o átrio direito.' },
      { id: 'ad', nome: 'Átrio direito', a: [DIR, 3, 4], b: [3, 4], dur: 2.5, circ: 1,
        cap: 'O <b>átrio direito</b> recebe o sangue venoso. Na parede dele fica o nó sinoatrial, o marca-passo natural do coração.' },
      { id: 'tric', nome: 'Valva tricúspide', a: [DIR, 4, 6], b: [4, 5], dur: 3, circ: 0, valva: [31, 59],
        cap: 'A <b>valva tricúspide</b> abre para o ventrículo direito e fecha logo depois, para o sangue não voltar ao átrio.' },
      { id: 'vd', nome: 'Ventrículo direito', a: [DIR, 6, 10], b: [5, 8], dur: 4, circ: 0, valva: [45.5, 47],
        cap: 'O <b>ventrículo direito</b> se contrai e empurra o sangue para a artéria pulmonar. A parede dele é fina: só precisa levar o sangue aos pulmões.' },
      { id: 'ap', nome: 'Artéria pulmonar', a: [DIR, 10, 15], b: [8, 11], dur: 4, circ: 0,
        cap: 'A <b>artéria pulmonar</b> sai do coração levando <b>sangue venoso</b>. Artéria é o vaso que sai do coração, seja qual for o sangue.' },
      { id: 'pulm', nome: 'Pulmões', b: [11, 15], v: 'b', dur: 6, circ: 0,
        cap: 'Nos capilares dos <b>pulmões</b> acontece a hematose: o CO₂ sai para o ar e o O₂ entra na hemácia. A hemoglobina chega a cerca de 98% de O₂.' },
      { id: 'vp', nome: 'Veias pulmonares', a: [ESQ, 0, 2], b: [15, 16], dur: 3.5, circ: 0,
        cap: 'As <b>veias pulmonares</b> trazem <b>sangue arterial</b> de volta ao coração. Aqui termina a pequena circulação.' },
      { id: 'ae', nome: 'Átrio esquerdo', a: [ESQ, 2, 3], b: [16, 17], dur: 2.5, circ: 0,
        cap: 'O <b>átrio esquerdo</b> recebe o sangue arterial. O septo separa os dois lados: o sangue arterial não se mistura com o venoso.' },
      { id: 'mit', nome: 'Valva mitral', a: [ESQ, 3, 5], b: [17, 18], dur: 3, circ: 1, valva: [66, 51],
        cap: 'A <b>valva mitral</b>, ou bicúspide, abre para o ventrículo esquerdo e fecha quando ele se contrai.' },
      { id: 've', nome: 'Ventrículo esquerdo', a: [ESQ, 5, 10], b: [18, 21], dur: 4.5, circ: 1, valva: [55.5, 49],
        cap: 'O <b>ventrículo esquerdo</b> tem a parede mais grossa do coração: ele bombeia o sangue para o corpo inteiro.' },
      { id: 'aorta', nome: 'Aorta', a: [ESQ, 10, 17], b: [21, 25], dur: 4.5, circ: 1,
        cap: 'A <b>aorta</b>, a maior artéria do corpo, sai do ventrículo esquerdo e leva sangue arterial para todos os órgãos pelos seus ramos.' },
      { id: 'corpo', nome: 'Corpo', b: [25, 33], v: 'b', dur: 7, circ: 1,
        cap: 'Nos capilares do <b>corpo</b>, a hemácia entrega O₂ aos tecidos e recebe CO₂. O sangue volta venoso pelas veias cavas: fecha-se a grande circulação.' }
    ];
    const VAI = { vcs: 0, vci: 0, ad: 1, tric: 2, vd: 3, vpul: 3, ap: 4, vp: 6, ae: 7, mit: 8, ve: 9, pve: 9, septo: 9, vao: 9, aorta: 10,
      vcsb: 0, vcib: 11, apb: 4, pdb: 5, peb: 5, vpb: 6, corb: 9, aob: 10, aodb: 11 };
    const HS = [
      { id: 'vcs', c: VEN, t: 'Veia cava superior', d: 'Traz o sangue venoso da cabeça, do pescoço e dos braços para o átrio direito.', em: { a: [29, 14] }, z: 2.2 },
      { id: 'vci', c: VEN, t: 'Veia cava inferior', d: 'Traz o sangue venoso do tronco e das pernas para o átrio direito.', em: { a: [30.5, 84] }, z: 2.4 },
      { id: 'ad', c: VEN, t: 'Átrio direito', d: 'Recebe o sangue venoso das veias cavas. Na parede dele fica o nó sinoatrial, que dispara cada batimento.', em: { a: [23, 47] }, z: 2.4 },
      { id: 'tric', c: AMB, t: 'Valva tricúspide', d: 'Fica entre o átrio e o ventrículo direitos. Tem três folhetos presos por cordas tendíneas e só deixa o sangue descer.', em: { a: [29.5, 57.5] }, z: 2.8 },
      { id: 'vd', c: VEN, t: 'Ventrículo direito', d: 'Bombeia o sangue venoso para os pulmões pela artéria pulmonar. A parede é mais fina que a do ventrículo esquerdo.', em: { a: [33, 72] }, z: 2.4 },
      { id: 'vpul', c: AMB, t: 'Valva pulmonar', d: 'Na saída do ventrículo direito. Fecha quando o ventrículo relaxa e impede o sangue de voltar.', em: { a: [44, 49.5] }, z: 3 },
      { id: 'ap', c: VEN, t: 'Artéria pulmonar', d: 'Sai do ventrículo direito e leva sangue venoso aos pulmões. É a única artéria do adulto com sangue venoso.', em: { a: [66, 28.5] }, z: 2.4 },
      { id: 'vp', c: ART, t: 'Veias pulmonares', d: 'Trazem dos pulmões o sangue arterial, rico em O₂, até o átrio esquerdo.', em: { a: [84, 41.5] }, z: 2.6 },
      { id: 'ae', c: ART, t: 'Átrio esquerdo', d: 'Recebe o sangue arterial das veias pulmonares e o passa ao ventrículo esquerdo.', em: { a: [67, 40] }, z: 2.4 },
      { id: 'mit', c: AMB, t: 'Valva mitral (bicúspide)', d: 'Entre o átrio e o ventrículo esquerdos. Tem dois folhetos e fecha na contração do ventrículo.', em: { a: [66, 50.5] }, z: 2.8 },
      { id: 've', c: ART, t: 'Ventrículo esquerdo', d: 'Bombeia o sangue arterial para o corpo inteiro pela aorta.', em: { a: [62, 66] }, z: 2.4 },
      { id: 'pve', c: '#F2A6A0', t: 'Parede do ventrículo esquerdo', d: 'O miocárdio aqui é cerca de três vezes mais grosso que no ventrículo direito, porque a força precisa levar o sangue ao corpo todo.', em: { a: [78, 70] }, z: 2.4 },
      { id: 'septo', c: '#F2A6A0', t: 'Septo', d: 'Parede de músculo entre os dois ventrículos. Não deixa o sangue venoso e o arterial se misturarem: a circulação é completa.', em: { a: [52.5, 64] }, z: 2.6 },
      { id: 'vao', c: AMB, t: 'Valva aórtica', d: 'Na saída do ventrículo esquerdo para a aorta. Fecha quando o ventrículo relaxa.', em: { a: [57, 49] }, z: 3 },
      { id: 'aorta', c: ART, t: 'Aorta', d: 'Sai do ventrículo esquerdo, faz um arco e desce pelo tronco. Dos ramos do arco saem as artérias da cabeça e dos braços.', em: { a: [47, 16] }, z: 2.2 },
      { id: 'vcsb', c: VEN, t: 'Veia cava superior', d: 'Traz o sangue venoso da parte de cima do corpo ao átrio direito.', em: { b: [44.5, 30] }, z: 2 },
      { id: 'vcib', c: VEN, t: 'Veia cava inferior', d: 'Sobe pelo abdome, atravessa o diafragma e devolve ao coração o sangue venoso da parte de baixo do corpo.', em: { b: [47.5, 80] }, z: 2 },
      { id: 'aodb', c: ART, t: 'Aorta descendente', d: 'Desce atrás do coração, atravessa o diafragma e manda sangue arterial para o abdome e as pernas.', em: { b: [54.5, 72] }, z: 2 },
      { id: 'aob', c: ART, t: 'Arco da aorta', d: 'Leva o sangue arterial que sai do ventrículo esquerdo. É o começo da grande circulação.', em: { b: [50.5, 35.5] }, z: 2.2 },
      { id: 'apb', c: VEN, t: 'Artéria pulmonar', d: 'Leva sangue venoso do ventrículo direito para os pulmões. É o começo da pequena circulação.', em: { b: [63, 40] }, z: 2.2 },
      { id: 'vpb', c: ART, t: 'Veias pulmonares', d: 'Voltam dos pulmões com sangue arterial e chegam ao átrio esquerdo.', em: { b: [69, 47.5] }, z: 2.2 },
      { id: 'corb', c: '#F2A6A0', t: 'Coração', d: 'Fica entre os pulmões, com a ponta voltada para a esquerda do corpo. Bate cerca de 60 a 100 vezes por minuto em repouso.', em: { b: [57, 57] }, z: 1.8 },
      { id: 'pdb', c: '#F2B6C6', t: 'Pulmão direito', d: 'Tem três lobos. Nos capilares em volta dos alvéolos o sangue venoso vira arterial.', em: { b: [25, 58] }, z: 1.8 },
      { id: 'peb', c: '#F2B6C6', t: 'Pulmão esquerdo', d: 'Tem dois lobos e um recuo onde se encaixa o coração.', em: { b: [80, 62] }, z: 1.8 }
    ];
    // saturação da hemoglobina (fração) ao longo da volta
    function sat(e, u) {
      if (ET[e].id === 'pulm') return lerp(.75, .98, sst(.2, .8, u));
      if (ET[e].id === 'corpo') return lerp(.98, .75, sst(.3, .75, u));
      return e < 5 ? .75 : .98;
    }
    const CIRC = ['Pequena circulação (pulmonar)', 'Grande circulação (sistêmica)'];
    const LADO = { cavas: 'Chegando ao lado direito do coração', pulm: 'Fora do coração', vp: 'Chegando ao lado esquerdo do coração', aorta: 'Saindo do coração', corpo: 'Fora do coração', ap: 'Saindo do coração' };
    const lado = e => LADO[ET[e].id] || (e <= 3 ? 'Lado direito do coração' : 'Lado esquerdo do coração');

    function sobre(R, X, t, S, v, api) {
      const et = ET[v.e], uu = RED ? .6 : eIO(v.u), s = sat(v.e, RED ? 1 : v.u), tt = RED ? 0 : t, rh = cl(R.s * 2.4, 9, 17);
      const bat = RED ? 0 : Math.exp(-Math.pow((fr(t) - .17) / .08, 2));   // sístole dos ventrículos, no ritmo da faixa
      if (R.vista === 'a') {
        // contração: brilho suave nos dois ventrículos a cada batida
        X.save(); X.globalCompositeOperation = 'lighter';
        { const p = R.pt(36, 70); brilho(X, p[0], p[1], R.s * 12, VEN, .16 * bat); }
        { const p = R.pt(63, 67); brilho(X, p[0], p[1], R.s * 14, ART, .16 * bat); }
        X.restore();
        if (et.a) {
          const [Cv, i0, i1] = et.a, f0 = Cv.FI(i0), f1 = Cv.FI(i1), f = lerp(f0, f1, uu), p = Cv.em(f), bp = R.pt(p[0], p[1]);
          rastro(R, X, Cv, 0, f, rgba(s > .9 ? ART : '#A99CF2', .6));
          // valva: anel que se abre quando a hemácia passa
          if (et.valva) { const q = R.pt(et.valva[0], et.valva[1]), k = RED ? .5 : (tt * .9) % 1; anel(X, q[0], q[1], rh * (1.2 + k * 1.6), AMB, .9 * (1 - k)); anel(X, q[0], q[1], rh * 1.1, AMB, .55); }
          // a aorta sobe por trás do tronco pulmonar: a hemácia fica meio apagada nesse trecho
          const atras = Cv === ESQ && f > ESQ.FI(10) + .02 && f < ESQ.FI(13) - .02;
          hemacia(X, bp[0], bp[1], rh, p[2], s, t, atras ? .55 : 1, true);
          if (et.id === 'aorta') for (let i = 0; i < 3; i++) {   // ramos do arco: sangue para cabeça e braços
            const b = [[42, 9], [52, 7.5], [58, 9.5]][i], o = R.pt(b[0], b[1] + 6), d = R.pt(b[0], b[1]), u = RED ? .5 : fr(tt * .6 + i / 3);
            dot(X, lerp(o[0], d[0], u), lerp(o[1], d[1], u), Math.max(2, rh * .35), ART, Math.sin(PI * u));
          }
        } else {
          // etapa fora do coração: a hemácia espera na saída certa
          const Cv = et.id === 'pulm' ? DIR : ESQ, f = 1, p = Cv.em(f), bp = R.pt(p[0], p[1]);
          hemacia(X, bp[0], bp[1], rh, p[2], s, t, .5, true);
        }
        api.legenda(R, X, [[VEN, 'sangue venoso'], [ART, 'sangue arterial']]);
      } else {
        const C = VOLTA, f0 = C.FI(et.b[0]), f1 = C.FI(et.b[1]), f = lerp(f0, f1, uu), p = C.em(f), bp = R.pt(p[0], p[1]);
        // circuito inteiro bem fraco, com o trecho da etapa mais forte
        X.save(); X.setLineDash([2, 6]); X.lineCap = 'round'; X.lineWidth = 1.4;
        X.strokeStyle = 'rgba(232,237,247,.22)'; X.beginPath(); C.AM.forEach((q, i) => { const s2 = R.pt(q[0], q[1]); i ? X.lineTo(s2[0], s2[1]) : X.moveTo(s2[0], s2[1]); }); X.stroke();
        X.strokeStyle = rgba(AMB, .7); X.lineWidth = 2; X.beginPath(); let st = false;
        C.AM.forEach((q, i) => { if (C.LF[i] < f0 || C.LF[i] > f1) return; const s2 = R.pt(q[0], q[1]); st ? X.lineTo(s2[0], s2[1]) : X.moveTo(s2[0], s2[1]); st = true; }); X.stroke(); X.restore();
        // trocas: O₂ entra nos pulmões; nos tecidos sai O₂ e entra CO₂
        if (et.id === 'pulm') {
          X.save(); X.globalCompositeOperation = 'lighter';
          [[25, 55], [78, 55]].forEach(q => { const g = R.pt(q[0], q[1]); brilho(X, g[0], g[1], R.s * 16, O2C, .12 + .08 * Math.sin(tt * 2)); });
          X.restore();
          for (let i = 0; i < 6; i++) { const u = RED ? .5 : fr(tt * .7 + i / 6), a = i * 1.05; dot(X, bp[0] + Math.cos(a) * rh * 4 * (1 - u), bp[1] + Math.sin(a) * rh * 4 * (1 - u), 2.6, O2C, Math.sin(PI * u)); dot(X, bp[0] + Math.cos(a + .5) * rh * 4 * u, bp[1] + Math.sin(a + .5) * rh * 4 * u, 2.4, CO2C, Math.sin(PI * u) * .9); }
        }
        if (et.id === 'corpo') {
          const g = R.pt(51, 92); brilho(X, g[0], g[1], R.s * 9, ART, .25);
          if (v.u > .25 && v.u < .8 || RED) for (let i = 0; i < 6; i++) { const u = RED ? .5 : fr(tt * .7 + i / 6), a = i * 1.05; dot(X, bp[0] + Math.cos(a) * rh * 4 * u, bp[1] + Math.sin(a) * rh * 4 * u, 2.6, O2C, Math.sin(PI * u)); dot(X, bp[0] + Math.cos(a + .5) * rh * 4 * (1 - u), bp[1] + Math.sin(a + .5) * rh * 4 * (1 - u), 2.4, CO2C, Math.sin(PI * u) * .9); }
        }
        hemacia(X, bp[0], bp[1], rh, p[2], s, t, 1, true);
        api.legenda(R, X, [[O2C, 'O₂'], [CO2C, 'CO₂'], [VEN, 'venoso'], [ART, 'arterial']]);
      }
    }
    function painel(X, b, t, S, v) {
      const s = sat(v.e, RED ? 1 : v.u), k = cl((s - .75) / .23, 0, 1), cor = mix(VEN, ART, k), pct = Math.round(s * 100), nome = k > .5 ? 'sangue arterial' : 'sangue venoso';
      const x = b.x, w = b.w;
      if (!b.comp) {
        txt(X, 'Hemoglobina com O₂', x, b.y, { s: 12, c: DIM, w: 500 });
        txt(X, `cerca de ${pct}%`, x, b.y + 22, { s: 16, c: mix(cor, '#FFFFFF', .2) });
        txt(X, nome, x + w, b.y + 22, { s: 12, c: DIM, a: 'right', w: 500 });
        barra(X, x, b.y + 44, w, 10, (s - .5) / .5, [VEN, VEN, ART]);
        [['50%', 0, 'left'], ['75%', .5, 'center'], ['100%', 1, 'right']].forEach(q => txt(X, q[0], x + w * q[1], b.y + 66, { s: 12, c: DIM, w: 500, a: q[2] }));
        const c1 = ET[v.e].circ;
        dot(X, x + 5, b.y + 96, 5, c1 ? ART : O2C, 1); txt(X, CIRC[c1], x + 16, b.y + 96, { s: 14 });
        txt(X, lado(v.e), x + 16, b.y + 116, { s: 12, c: DIM, w: 500 });
        X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(x, b.y + 136, w, 1);
        txt(X, 'Os 4 lugares de O₂ da hemoglobina', x, b.y + 158, { s: 13 });
        for (let i = 0; i < 4; i++) { const cx = x + 18 + i * 42, cy = b.y + 190, al = cl(s * 4 - i, 0, 1); X.beginPath(); X.arc(cx, cy, 13, 0, TAU); X.strokeStyle = 'rgba(232,237,247,.35)'; X.lineWidth = 1.5; X.stroke(); dot(X, cx, cy, 10, O2C, al); if (al > .5) txt(X, 'O₂', cx, cy + 1, { s: 11, c: '#0B0F1C', a: 'center', w: 700 }); }
        txt(X, k > .5 ? 'quase todos ocupados' : 'ainda há O₂ de reserva', x + w, b.y + 190, { s: 12, c: DIM, a: 'right', w: 500 });
        txt(X, 'Cores do sangue como código, não reais', x, b.y + 226, { s: 12, c: DIM, w: 500 });
      } else {
        txt(X, `Hemoglobina com O₂: cerca de ${pct}%`, x, b.y, { s: 13, c: mix(cor, '#FFFFFF', .2) });
        barra(X, x, b.y + 16, w, 8, (s - .5) / .5, [VEN, VEN, ART]);
        const c1 = ET[v.e].circ; dot(X, x + 5, b.y + 46, 4.5, c1 ? ART : O2C, 1); txt(X, CIRC[c1].split(' (')[0], x + 15, b.y + 46, { s: 12 });
        txt(X, nome, x + w, b.y + 46, { s: 12, c: DIM, a: 'right', w: 500 });
      }
    }
    viagem({
      K: 'circulatorio/coracao', modo: 'fig', rotulo: 'Viagem da hemácia', rotuloAntigo: 'Coração', extra3d: 'Coração aberto', nome: 'Coração e a viagem de uma hemácia',
      aria: 'Viagem da hemácia: etapas', rot3d: 'Ver em 3D', alturaPainel: 300,
      vistas: [
        ['a', 'circulatorio-coracao-v4a', 'Coração em corte', 'Coração em corte frontal: átrios, ventrículos, valvas e grandes vasos. A parede do ventrículo esquerdo é a mais grossa'],
        ['b', 'circulatorio-coracao-v4b', 'Tórax', 'Tórax com coração, pulmões e o circuito: pequena circulação até os pulmões e grande circulação pelo corpo']
      ],
      hs: HS, ET, VAI, sobre, painel,
      vel: S => cl((S.v || 70) / 70, .4, 2.4),
      ajustes(c3) {
        const lo = c3.loc; c3.loc = S => S.modo === 'fig' ? 'Viagem de uma hemácia' : (lo ? lo(S) : '');
        if (typeof c3.d === 'string') c3.d = c3.d.replace('Na vista de frente, passe o mouse ou toque nos pontos para ver o nome de cada parte.', 'Na viagem da hemácia, siga as etapas ou toque num ponto da figura para levar a hemácia até ele; a faixa muda a frequência do coração.');
      }
    });
  })();

  // =====================================================================================
  // 2. Respiratório: a viagem do ar e a hematose
  // =====================================================================================
  (function () {
    const AS = [.88, 1.18];
    const AR1 = curva([[67.5, 25.5], [63, 23.5], [57, 22.5], [52, 23.5], [49, 26], [48, 30], [48.5, 33.5], [50, 37], [50, 40.5], [50, 45], [50, 51], [50, 56.5], [46, 59.5], [41, 62.5], [37.5, 66.5], [33.5, 69.5], [29.5, 71]], AS);
    // vista B (recorte da figura antiga: só o cacho de alvéolos), x e y em % do recorte
    const ASB = [.413, .491], RB = p => [53 + .47 * p[0], p[1]];   // a figura usa % da imagem inteira; o recorte começa em 53%
    const CAPB = curva([[42, 13], [32, 19], [20, 30], [12, 48], [17, 65], [32, 79], [50, 84], [63, 76], [72, 60], [79, 42], [81, 24], [79, 8]].map(RB), [.88, .491]);
    const BRQB = curva([[74, 2], [66, 15], [58, 27], [48, 40]].map(RB), [.88, .491]);
    const ALVB = [[43, 30], [30, 45], [56, 45], [45, 60], [62, 62], [28, 64], [40, 77]].map(RB);
    const ET = [
      { id: 'nariz', nome: 'Nariz', a: [0, 3], dur: 2, o2: 159, co2: .3,
        cap: 'O ar entra pelo <b>nariz</b>. Pelos e muco das fossas nasais seguram a poeira, e o ar sai aquecido e umedecido.' },
      { id: 'far', nome: 'Faringe', a: [3, 6], dur: 2, o2: 150, co2: .3,
        cap: 'A <b>faringe</b>, atrás da boca, é o caminho comum do ar e do alimento.' },
      { id: 'lar', nome: 'Laringe', a: [6, 8], dur: 2, o2: 150, co2: .3,
        cap: 'Na <b>laringe</b> ficam as pregas vocais. A epiglote fecha a entrada dela quando engolimos, e o alimento segue para o esôfago.' },
      { id: 'tra', nome: 'Traqueia', a: [8, 11], dur: 2, o2: 150, co2: .3,
        cap: 'A <b>traqueia</b> tem anéis de cartilagem que a mantêm sempre aberta. Cílios e muco levam a sujeira de volta para cima.' },
      { id: 'brq', nome: 'Brônquios', a: [11, 13], dur: 2, o2: 150, co2: .3,
        cap: 'A traqueia se divide em dois <b>brônquios</b>, um para cada pulmão.' },
      { id: 'brl', nome: 'Bronquíolos', a: [13, 15], dur: 2, o2: 150, co2: .3,
        cap: 'Os brônquios se ramificam em <b>bronquíolos</b>, tubos cada vez mais finos e sem cartilagem.' },
      { id: 'alv', nome: 'Alvéolos', a: [15, 16], dur: 2, o2: 104, co2: 40,
        cap: 'O ar chega aos <b>alvéolos</b>, saquinhos de parede finíssima envolvidos por capilares. São cerca de 300 milhões nos dois pulmões.' },
      { id: 'hem', nome: 'Hematose', v: 'b', dur: 9, sangue: true,
        cap: '<b>Hematose</b>: por difusão, o O₂ passa do alvéolo para o sangue e o CO₂ faz o caminho contrário. O sangue chega venoso e sai arterial.' }
    ];
    const VAI = { nar: 0, far: 1, lar: 2, tra: 3, brq: 4, brl: 5, alv: 6, pd: 6, pe: 6, dia: 0, alvb: 7, cvb: 7, cab: 7, brlb: 5 };
    const HS = [
      { id: 'nar', c: AR, t: 'Cavidade nasal', d: 'As conchas, os pelos e o muco filtram, aquecem e umedecem o ar antes de ele descer.', em: { a: [60, 21.5] }, z: 2.6 },
      { id: 'far', c: '#F2B6C6', t: 'Faringe', d: 'Tubo atrás do nariz e da boca. Por ela passam o ar e o alimento.', em: { a: [47.5, 29.5] }, z: 2.8 },
      { id: 'lar', c: '#CFE0FF', t: 'Laringe', d: 'Tem as pregas vocais, que vibram com a passagem do ar e produzem a voz. A epiglote fecha a laringe ao engolir.', em: { a: [50, 38] }, z: 2.8 },
      { id: 'tra', c: '#CFE0FF', t: 'Traqueia', d: 'Tubo com anéis de cartilagem em forma de C. O muco e os cílios do revestimento prendem e expulsam partículas.', em: { a: [50, 48] }, z: 2.6 },
      { id: 'brq', c: '#CFE0FF', t: 'Brônquios', d: 'A traqueia se divide em brônquio direito e esquerdo. Cada um entra num pulmão e se ramifica.', em: { a: [44, 60.5] }, z: 2.8 },
      { id: 'brl', c: '#9FD4EA', t: 'Bronquíolos', d: 'Ramos finos da árvore respiratória, sem cartilagem. Na asma, o músculo da parede deles se contrai e o ar passa com dificuldade.', em: { a: [35, 68] }, z: 3 },
      { id: 'alv', c: '#F2BFCB', t: 'Alvéolos', d: 'Saquinhos de ar no fim dos bronquíolos, com parede de uma só camada de células. Juntos têm uma área enorme para a troca de gases.', em: { a: [71.5, 72] }, z: 3 },
      { id: 'pd', c: '#F2B6C6', t: 'Pulmão direito', d: 'Tem três lobos e é envolvido pela pleura, uma membrana dupla que ajuda o pulmão a acompanhar o movimento do tórax.', em: { a: [26, 61] }, z: 2.2 },
      { id: 'pe', c: '#F2B6C6', t: 'Pulmão esquerdo', d: 'Tem dois lobos e um recuo onde fica o coração.', em: { a: [62, 78] }, z: 2.2 },
      { id: 'dia', c: AMB, t: 'Diafragma', d: 'Músculo sob os pulmões. Ao contrair, desce: o tórax aumenta, a pressão no pulmão cai abaixo da do ar e o ar entra. Ao relaxar, sobe e o ar sai.', em: { a: [38, 84] }, z: 2.2 },
      { id: 'alvb', c: '#F2BFCB', t: 'Alvéolo', d: 'O ar aqui tem mais O₂ e menos CO₂ que o sangue que chega. Cada gás passa por difusão, do lugar de maior para o de menor pressão parcial.', em: { b: [74.2, 48] }, z: 2 },
      { id: 'cvb', c: VEN, t: 'Capilar com sangue venoso', d: 'Vem da artéria pulmonar, pobre em O₂ (cerca de 40 mmHg) e rico em CO₂ (cerca de 46 mmHg).', em: { b: [59.1, 40] }, z: 2.2 },
      { id: 'cab', c: ART, t: 'Capilar com sangue arterial', d: 'Depois da troca, o sangue sai com O₂ perto de 100 mmHg e segue pelas veias pulmonares ao átrio esquerdo.', em: { b: [91.1, 34] }, z: 2.2 },
      { id: 'brlb', c: '#9FD4EA', t: 'Bronquíolo', d: 'Traz o ar renovado a cada inspiração até o cacho de alvéolos.', em: { b: [84, 14] }, z: 2.2 }
    ];
    // ciclo da respiração: 5 s, 2 s de inspiração (diafragma contrai) e 3 s de expiração
    const CIC = 5, INS = 2;
    const insp = v => RED ? true : (v.br % CIC) < INS;
    const contr = v => { if (RED) return 1; const p = v.br % CIC; return p < INS ? sst(0, INS, p) : 1 - sst(INS, CIC, p); };
    const pressao = v => { if (RED) return -1; const p = v.br % CIC; return p < INS ? -Math.sin(PI * p / INS) : Math.sin(PI * (p - INS) / (CIC - INS)); };
    function gases(v) {
      const et = ET[v.e], u = RED ? 1 : v.u;
      if (et.sangue) return { o2: lerp(40, 100, sst(.1, .8, u)), co2: lerp(46, 40, sst(.1, .8, u)), sangue: true };
      if (et.id === 'alv') return { o2: lerp(150, 104, sst(.2, .9, u)), co2: lerp(.3, 40, sst(.2, .9, u)) };
      if (et.id === 'far') return { o2: lerp(159, 150, sst(0, .6, u)), co2: .3 };
      return { o2: et.o2, co2: et.co2 };
    }

    function sobre(R, X, t, S, v, api) {
      const et = ET[v.e], tt = RED ? 0 : t, c = contr(v);
      if (!RED && S.dt) v.br += S.dt;
      if (R.vista === 'a') {
        // pulmões enchem na inspiração
        X.save(); X.globalCompositeOperation = 'lighter';
        [[33, 68], [64, 68]].forEach(q => { const g = R.pt(q[0], q[1]); brilho(X, g[0], g[1], R.s * 17, O2C, .05 + .11 * c); });
        X.restore();
        // diafragma: a cúpula desce quando contrai e sobe quando relaxa
        const ya = 86, yt = 77.5 + 3 * c, L = R.pt(25.5, ya), Rr = R.pt(74.5, ya), Tp = R.pt(50, 2 * yt - ya);
        X.save(); X.lineCap = 'round'; X.strokeStyle = rgba(AMB, .9); X.lineWidth = 3; X.setLineDash([]); X.beginPath(); X.moveTo(L[0], L[1]); X.quadraticCurveTo(Tp[0], Tp[1], Rr[0], Rr[1]); X.stroke(); X.restore();
        const mv = R.pt(50, yt + 4.5), ins = insp(v), mexe = RED ? 1 : (ins ? Math.sin(PI * ((v.br % CIC) / INS)) : Math.sin(PI * ((v.br % CIC) - INS) / (CIC - INS)));
        seta(X, mv[0], mv[1], ins ? PI / 2 : -PI / 2, cl(R.s * 1.6, 7, 13), AMB, .35 + .6 * mexe);
        // o ar: avança só na inspiração
        const C = AR1, f0 = C.FI(et.a ? et.a[0] : 15), f1 = C.FI(et.a ? et.a[1] : 16), f = lerp(f0, f1, RED ? .6 : eIO(v.u)), p = C.em(f), bp = R.pt(p[0], p[1]), r = cl(R.s * 2, 8, 15);
        rastro(R, X, C, 0, f, rgba(AR, .55));
        const g = gases(v);
        brilho(X, bp[0], bp[1], r * 3, AR, .45);
        dot(X, bp[0], bp[1], r, mix(AR, '#FFFFFF', .3), .95);
        for (let i = 0; i < 3; i++) { const a = tt * 1.8 + i * TAU / 3; dot(X, bp[0] + Math.cos(a) * r * 1.5, bp[1] + Math.sin(a) * r * 1.5, Math.max(2, r * .3), O2C, .95); }
        if (g.co2 > 5) for (let i = 0; i < 2; i++) { const a = -tt * 1.4 + i * PI + .6; dot(X, bp[0] + Math.cos(a) * r * 1.9, bp[1] + Math.sin(a) * r * 1.9, Math.max(1.8, r * .26), CO2C, cl(g.co2 / 40, 0, 1)); }
        // nos alvéolos: troca de gases em cada cacho
        if (et.id === 'alv' || et.sangue) [[30, 66], [28, 72], [31, 75], [69.5, 60], [72, 64], [71, 68], [72.5, 71.5], [71, 74.5]].forEach((q, i) => {
          const o = R.pt(q[0], q[1]), u = RED ? .5 : fr(tt * .5 + i * .23), a = i * 2.1;
          dot(X, o[0] + Math.cos(a) * r * 2.4 * u, o[1] + Math.sin(a) * r * 2.4 * u, 2.4, O2C, Math.sin(PI * u) * .9);
          dot(X, o[0] + Math.cos(a + 2.6) * r * 2.4 * (1 - u), o[1] + Math.sin(a + 2.6) * r * 2.4 * (1 - u), 2.2, CO2C, Math.sin(PI * u) * .8);
        });
        api.legenda(R, X, [[AR, 'ar'], [O2C, 'O₂'], [CO2C, 'CO₂'], [AMB, 'diafragma']]);
      } else {
        // vista B: o ar desce pelo bronquíolo a cada inspiração
        for (let i = 0; i < 3; i++) { const u = RED ? (i + .5) / 3 : fr(v.br / CIC * 1.5 + i / 3), q = BRQB.em(u), s = R.pt(q[0], q[1]); dot(X, s[0], s[1], cl(R.s * .9, 3.5, 7), AR, (insp(v) ? .9 : .35) * Math.sin(PI * u)); }
        // sangue nos capilares: entra venoso (à esquerda) e sai arterial (à direita)
        const n = 12;
        for (let i = 0; i < n; i++) { const u = RED ? (i + .5) / n : fr(tt * .08 + i / n), q = CAPB.em(u), s = R.pt(q[0], q[1]); hemacia(X, s[0], s[1], cl(R.s * .75, 4, 8), q[2], lerp(.75, .98, sst(.25, .75, u)), tt + i, .9); }
        // troca de gases entre cada alvéolo e o capilar mais perto
        ALVB.forEach((a, i) => {
          const o = R.pt(a[0], a[1]), ang = i * 1.9 + .6, D = R.s * 7, u = RED ? .5 : fr(tt * .4 + i * .19), u2 = RED ? .5 : fr(tt * .4 + i * .19 + .5);
          dot(X, o[0] + Math.cos(ang) * D * u, o[1] + Math.sin(ang) * D * u, cl(R.s * .55, 3, 6), O2C, .95 * Math.sin(PI * u));
          dot(X, o[0] + Math.cos(ang + 2.4) * D * (1 - u2), o[1] + Math.sin(ang + 2.4) * D * (1 - u2), cl(R.s * .5, 3, 5.5), CO2C, .95 * Math.sin(PI * u2));
        });
        // a hemácia da viagem atravessa o capilar na etapa da hematose
        if (et.sangue) { const q = CAPB.em(RED ? .6 : eIO(v.u)), s = R.pt(q[0], q[1]), g = gases(v); hemacia(X, s[0], s[1], cl(R.s * 1.6, 8, 16), q[2], lerp(.75, .98, (g.o2 - 40) / 60), t, 1, true); }
        api.legenda(R, X, [[O2C, 'O₂ do ar para o sangue'], [CO2C, 'CO₂ do sangue para o ar']]);
      }
    }
    function painel(X, b, t, S, v) {
      const g = gases(v), x = b.x, w = b.w, p = pressao(v), ins = insp(v);
      const o2t = `O₂: cerca de ${Math.round(g.o2)} mmHg`, co2t = g.co2 < 1 ? 'CO₂: quase 0' : `CO₂: cerca de ${Math.round(g.co2)} mmHg`;
      const dia = ins ? 'Diafragma contrai e desce' : 'Diafragma relaxa e sobe', pr = RED ? 'Pressão no pulmão abaixo da do ar: o ar entra' : p < 0 ? 'Pressão no pulmão abaixo da do ar: o ar entra' : 'Pressão no pulmão acima da do ar: o ar sai';
      if (!b.comp) {
        txt(X, g.sangue ? 'Pressão parcial no sangue do capilar' : 'Pressão parcial no ar', x, b.y, { s: 12, c: DIM, w: 500 });
        txt(X, o2t, x, b.y + 22, { s: 15, c: O2C });
        barra(X, x, b.y + 38, w, 8, g.o2 / 160, ['#24324F', O2C]);
        txt(X, co2t, x, b.y + 66, { s: 15, c: CO2C });
        barra(X, x, b.y + 82, w, 8, g.co2 / 160, ['#24324F', CO2C]);
        [['0', 0, 'left'], ['80', .5, 'center'], ['160 mmHg', 1, 'right']].forEach(q => txt(X, q[0], x + w * q[1], b.y + 104, { s: 12, c: DIM, w: 500, a: q[2] }));
        X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(x, b.y + 122, w, 1);
        dot(X, x + 5, b.y + 144, 5, AMB, 1); txt(X, dia, x + 16, b.y + 144, { s: 14 });
        // pressão no pulmão em relação à do ar: barra centrada, agulha à esquerda na inspiração
        const by = b.y + 172; X.fillStyle = 'rgba(232,237,247,.12)'; X.beginPath(); X.roundRect(x, by, w, 8, 4); X.fill();
        X.fillStyle = 'rgba(232,237,247,.5)'; X.fillRect(x + w / 2 - 1, by - 4, 2, 16);
        const nx = x + w / 2 + p * w * .42; X.fillStyle = p < 0 ? O2C : '#F2A6A0'; X.beginPath(); X.roundRect(Math.min(nx, x + w / 2), by, Math.abs(nx - x - w / 2), 8, 4); X.fill();
        dot(X, nx, by + 4, 6, TXT, 1);
        txt(X, 'menor', x, by + 22, { s: 12, c: DIM, w: 500 }); txt(X, 'igual à do ar', x + w / 2, by + 22, { s: 12, c: DIM, w: 500, a: 'center' }); txt(X, 'maior', x + w, by + 22, { s: 12, c: DIM, w: 500, a: 'right' });
        txt(X, pr.split(':')[0], x, by + 48, { s: 12, c: TXT, w: 500 });
        txt(X, pr.split(': ')[1], x, by + 66, { s: 13, c: p < 0 || RED ? O2C : '#F2A6A0' });
      } else {
        txt(X, o2t, x, b.y, { s: 13, c: O2C }); txt(X, co2t, x + w, b.y, { s: 13, c: CO2C, a: 'right' });
        barra(X, x, b.y + 14, w / 2 - 6, 6, g.o2 / 160, ['#24324F', O2C], false); barra(X, x + w / 2 + 6, b.y + 14, w / 2 - 6, 6, g.co2 / 160, ['#24324F', CO2C], false);
        dot(X, x + 5, b.y + 42, 4.5, AMB, 1); txt(X, ins ? 'Diafragma contrai: o ar entra' : 'Diafragma relaxa: o ar sai', x + 15, b.y + 42, { s: 12 });
        txt(X, g.sangue ? 'no sangue' : 'no ar', x + w, b.y + 42, { s: 12, c: DIM, a: 'right', w: 500 });
      }
    }
    viagem({
      K: 'respiratorio/hematose', modo: 'viagem', modo0: 'fole', rotulo: 'Viagem do ar', extra3d: 'Um alvéolo', nome: 'Vias respiratórias e a viagem do ar',
      aria: 'Viagem do ar: etapas', rot3d: 'Ver modelos e 3D', dica3d: 'Troque de modo nos botões do palco', alturaPainel: 334,
      vistas: [
        ['a', 'respiratorio-hematose-v4a', 'Vias respiratórias', 'Vias respiratórias do nariz aos alvéolos, com os pulmões e o diafragma'],
        ['b', 'respiratorio-hematose-a', 'Alvéolos de perto', 'Cacho de alvéolos envolvido por capilares: sangue venoso chega de um lado e sai arterial do outro', [.53, 0, .47, 1]]
      ],
      hs: HS, ET, VAI, sobre, painel,
      novo: () => ({ br: 0 }),
      vel: () => 1,
      // o ar só avança enquanto o diafragma contrai; a hematose corre o tempo todo
      passo: (v, k, et) => et.sangue ? k : (insp(v) ? k : 0),
      ajustes(c3) {
        const lo = c3.loc, ln = c3.locNota; c3.loc = S => S.modo === 'viagem' ? 'Viagem do ar' : (lo ? lo(S) : '');
        c3.locNota = S => S.modo === 'viagem' ? 'Ilustração, fora de escala' : (typeof ln === 'function' ? ln(S) : ln);
        const cv0 = c3.ctlVis; c3.ctlVis = S => S.modo === 'viagem' ? false : (cv0 ? cv0(S) : true);
        const d = Object.getOwnPropertyDescriptor(c3, 'auto'), au = d && d.get ? () => d.get.call(c3) : () => (d ? d.value : 0);
        Object.defineProperty(c3, 'auto', { value: S => S && S.modo === 'viagem' ? 0 : (typeof au() === 'function' ? au()(S) : au()), configurable: true, writable: true, enumerable: true });
        if (typeof c3.d === 'string') c3.d = c3.d.replace('<p>Em "Fole"', '<p>Em "Viagem do ar", o ar avança a cada inspiração, quando o diafragma contrai; toque num ponto da figura para levar a viagem até ele. Em "Fole"');
      }
    });
  })();
})();
