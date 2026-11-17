/* LAB Anatomia: duas viagens sobre figuras de IA realistas, no padrão de cenas-figura-digestorio.js (Martin + Íris).
   1) endocrino/glandulas: a viagem de um hormônio, com a alça de retroalimentação negativa da tireoide como eixo
      (hipotálamo, TRH, hipófise, TSH, tireoide, T3 e T4 no sangue, células-alvo, freio no hipotálamo e na hipófise),
      e depois paradas nas paratireoides, adrenais, pâncreas e gônadas.
      Vista A: corpo translúcido com as glândulas acesas (a figura que já estava na rota).
      Vista B: tireoide de perto com as quatro paratireoides (vista por trás, com o esôfago retirado) e os vasos do pescoço (Nano Banana 2).
      Medidor: nível do hormônio no sangue com a faixa normal, e o hormônio que comanda (TSH, PTH etc.) logo abaixo.
   2) locomotor/movimento: o comando motor da medula até a contração e a alavanca do cotovelo.
      Vista A: braço com escápula, úmero, rádio, ulna, bíceps e tríceps (a figura que já estava na rota).
      Vista B: neurônio motor com a placa motora, fibra muscular aberta em miofibrilas e um sarcômero de perto (Nano Banana 2).
      Medidor: comprimento do sarcômero do bíceps e ângulo do cotovelo, com a alavanca desenhada.
   Em cada rota: etapas com anterior, pausar e próxima, um ponto que viaja pelo caminho real (curva suave conferida
   sobre a imagem), tocar num ponto leva a viagem até ele e a vista certa entra sozinha na etapa certa.
   O 3D antigo segue atrás de "Ver em 3D" (endócrino) e o desenho antigo atrás de "Ver esquema" (locomotor).
   Os outros modos (Termostato da tireoide, Os três ingredientes) continuam no desenho plano.
   Com prefers-reduced-motion nada anda sozinho: etapas por botão. Usa os globais do motor (SC, X, W, H, NAR, cap, cv).
   Carregar depois de cenas-figura-digestorio.js e antes de LAB_ANATOMIA_iniciar(). Texto: sem "!", sem setas ou pontos como separador. */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const RED = LAB_FIGALT.RED, PI = Math.PI, TAU = PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
  const sst = (a, b, x) => { const u = cl((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const eIO = u => { u = cl(u, 0, 1); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
  const FT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const TXT = '#E8EDF7', DIM = '#9DA9C4', FREIO = '#E0605C';

  // ---------- desenho básico ----------
  function dot(X, x, y, r, c, a) { X.globalAlpha = cl(a, 0, 1); X.beginPath(); X.arc(x, y, Math.max(.1, r), 0, TAU); X.fillStyle = c; X.fill(); X.globalAlpha = 1; }
  function brilho(X, x, y, r, c, a) { if (a <= 0) return; const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(c, .55 * a)); g.addColorStop(1, rgba(c, 0)); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); }
  function txt(X, s, x, y, o = {}) { X.font = `${o.w || 600} ${o.s || 13}px ${FT}`; X.fillStyle = o.c || TXT; X.textAlign = o.a || 'left'; X.textBaseline = 'middle'; X.fillText(s, x, y); }
  function anel(X, x, y, t, cor, per, rmax, off, al) {
    if (RED) { X.beginPath(); X.arc(x, y, rmax * .6, 0, TAU); X.strokeStyle = rgba(cor, .55); X.lineWidth = 1.5; X.stroke(); return; }
    const u = (((t + (off || 0)) / per) % 1 + 1) % 1;
    X.beginPath(); X.arc(x, y, 4 + rmax * (1 - Math.pow(1 - u, 3)), 0, TAU); X.strokeStyle = rgba(cor, (al == null ? .85 : al) * (1 - u)); X.lineWidth = 2; X.stroke();
  }
  function seta(X, x, y, ang, r, c, a) { X.save(); X.globalAlpha = cl(a, 0, 1); X.translate(x, y); X.rotate(ang); X.beginPath(); X.moveTo(r, 0); X.lineTo(-r * .7, r * .75); X.lineTo(-r * .3, 0); X.lineTo(-r * .7, -r * .75); X.closePath(); X.fillStyle = c; X.fill(); X.strokeStyle = 'rgba(11,15,28,.7)'; X.lineWidth = 1; X.stroke(); X.restore(); }
  // sinal de freio (inibição): traço com a ponta chata, como nos esquemas de retroalimentação
  function barraFreio(X, x, y, ang, r, a) { X.save(); X.globalAlpha = cl(a, 0, 1); X.translate(x, y); X.rotate(ang); X.strokeStyle = FREIO; X.lineWidth = 3; X.lineCap = 'round'; X.beginPath(); X.moveTo(0, -r); X.lineTo(0, r); X.stroke(); X.restore(); }
  // hormônio: bolinha com brilho e um contorno escuro, para ler sobre qualquer fundo
  function hormonio(X, x, y, r, c, a) { brilho(X, x, y, r * 3, c, a); X.globalAlpha = cl(a, 0, 1); X.beginPath(); X.arc(x, y, r + 1.5, 0, TAU); X.fillStyle = 'rgba(11,15,28,.8)'; X.fill(); X.globalAlpha = 1; dot(X, x, y, r, c, a); dot(X, x - r * .3, y - r * .3, r * .35, '#FFFFFF', a * .7); }
  function leg(X, x, y, itens, nar) {
    X.save(); X.font = `600 ${nar ? 12 : 13}px ${FT}`; X.textBaseline = 'middle'; X.textAlign = 'left';
    const w = Math.max(...itens.map(i => X.measureText(i[1]).width)) + 34, h = itens.length * 20 + 10;
    X.fillStyle = 'rgba(11,15,28,.82)'; X.beginPath(); X.roundRect(x, y, w, h, 8); X.fill();
    itens.forEach((it, i) => { dot(X, x + 14, y + 15 + i * 20, 4.5, it[0], 1); X.fillStyle = TXT; X.fillText(it[1], x + 26, y + 15 + i * 20); });
    X.restore();
  }
  // legenda da figura: ao lado da imagem quando sobra espaço (computador); senão num canto vazio dela
  let pend = null, FX = 150;
  const LEGH = 46;   // no celular a legenda vai numa linha logo abaixo da figura
  // legenda em linha, centrada; se não couber, a fonte diminui e, no limite, ficam só os primeiros itens
  function legLinha(X, cx, y, itens, wmax, fim) {
    X.save(); X.textBaseline = 'middle'; X.textAlign = 'left';
    let fs = 12, its = itens.slice(), ws, tot;
    const med = () => { X.font = `600 ${fs}px ${FT}`; ws = its.map(i => X.measureText(i[1]).width + 22); tot = ws.reduce((a, b) => a + b, 0) + 8 * (its.length - 1); };
    med(); if (tot > wmax - 16) { fs = 11; med(); }
    while (fim && tot > wmax - 16 && its.length > 1) { its.pop(); med(); }
    if (tot > wmax - 16 && its.length > 1) {   // duas linhas: a primeira com o que couber, o resto embaixo
      let k = its.length - 1; const resto = []; while (k > 0 && tot > wmax - 16) { resto.unshift(its.pop()); med(); k--; }
      X.restore(); legLinha(X, cx, y - 11, its, wmax); legLinha(X, cx, y + 13, resto, wmax, true); return;
    }
    let x = cx - tot / 2; X.fillStyle = 'rgba(11,15,28,.82)'; X.beginPath(); X.roundRect(x - 8, y - 11, tot + 16, 22, 11); X.fill();
    its.forEach((it, i) => { dot(X, x + 6, y, 4.5, it[0], 1); X.fillStyle = TXT; X.fillText(it[1], x + 15, y); x += ws[i] + 8; });
    X.restore();
  }
  function legR(X, R, itens, onde) {
    const nar = R.w < 520; X.save(); X.font = `600 ${nar ? 12 : 13}px ${FT}`;
    const w = Math.max(...itens.map(i => X.measureText(i[1]).width)) + 34, h = itens.length * 20 + 10; X.restore();
    const bx = caixa(0).x;
    if (compacto()) { const cx = caixa(FX); pend = ['linha', cx.x + cx.w / 2, cx.y + cx.h + LEGH / 2, itens]; return; }
    let x = R.x + 10, y = R.y + 10;
    if (!compacto() && R.x - w - 12 >= bx) x = R.x - w - 12;
    else if (onde === 'baixo') y = R.y + R.h - h - 10;
    else if (onde === 'dir') x = R.x + R.w - w - 10;
    else if (onde === 'baixodir') { x = R.x + R.w - w - 10; y = R.y + R.h - h - 10; }
    pend = [x, y, itens, nar];   // desenhada em fora(), depois da figura: a camada sobre a figura é recortada nela
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
      AM, LF,
      em(f) { f = cl(f, 0, 1); let i = 1; while (i < LF.length - 1 && LF[i] < f) i++; const u = (f - LF[i - 1]) / ((LF[i] - LF[i - 1]) || 1), a = AM[i - 1], b = AM[i]; return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), Math.atan2((b[1] - a[1]) * AR[1], (b[0] - a[0]) * AR[0])]; },
      rastro(X, R, f0, f1, cor) {
        X.save(); X.setLineDash([2, 5]); X.lineCap = 'round'; X.strokeStyle = cor; X.lineWidth = 1.6; X.beginPath(); let st = false;
        for (let i = 0; i < AM.length; i++) { if (LF[i] < f0) continue; if (LF[i] > f1) break; const s = R.pt(AM[i][0], AM[i][1]); if (!st) { X.moveTo(s[0], s[1]); st = true; } else X.lineTo(s[0], s[1]); }
        if (st) { const p = this.em(f1), s = R.pt(p[0], p[1]); X.lineTo(s[0], s[1]); X.stroke(); } X.restore();
      },
      // vários hormônios correndo pelo caminho (n, v ciclos por segundo); parados no modo reduzido
      fluxo(X, R, t, o) {
        const n = o.n || 5;
        for (let i = 0; i < n; i++) {
          const f = RED ? (i + .5) / n : (((t * (o.v || .2) + i / n + (o.off || 0)) % 1) + 1) % 1, p = this.em(o.rev ? 1 - f : f), s = R.pt(p[0], p[1]);
          hormonio(X, s[0], s[1], o.r || 3, o.c, (o.a == null ? 1 : o.a) * (RED ? .9 : Math.min(1, Math.sin(PI * f) * 1.8)));
        }
      }
    };
  }

  // ---------- botões da viagem (um só conjunto para as duas rotas) ----------
  const ICO = { ant: '<path d="M14.5 6 8.5 12l6 6"/>', prox: '<path d="m9.5 6 6 6-6 6"/>', pausa: '<path d="M9 6v12M15 6v12"/>', play: '<path d="M8 5.5v13l10-6.5z"/>' };
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;
  let NAV = null, dono = null, vivo = 0, sincK = '', navK = '';
  function montarNav() {
    if (NAV) return;
    const st = document.createElement('style'); st.id = 'el-css';
    st.textContent = `.el-nav{position:absolute;left:0;top:0;z-index:2;display:flex;align-items:center;gap:6px}
.el-nav[hidden]{display:none}
.el-nav button{font:inherit;width:44px;height:44px;flex:none;display:grid;place-items:center;border-radius:10px;border:1px solid var(--line-strong,#5B6C99);background:rgba(19,26,43,.92);color:var(--txt,#E8EDF7);cursor:pointer;transition:background-color 90ms,border-color 90ms,color 90ms}
.el-nav button:hover{background:var(--panel-2,#1B2440);border-color:var(--amber,#FFB347)}
.el-nav button:active{transform:scale(.96)}
.el-nav button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
.el-nav button svg{width:22px;height:22px}
.el-nav button[hidden]{display:none}
.el-nav .et{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;padding:0 6px;line-height:1.2}
.el-nav .et small{font-size:12px;color:var(--dim,#9DA9C4)}
.el-nav .et b{font-size:15px;font-weight:600;color:var(--txt,#E8EDF7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(prefers-reduced-motion:reduce){.el-nav button{transition:none}.el-nav button:active{transform:none}}`;
    document.head.appendChild(st);
    NAV = document.createElement('div'); NAV.className = 'el-nav'; NAV.hidden = true; NAV.setAttribute('role', 'group');
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
    const x0 = NAR ? 6 : 24, y0 = NAR ? 46 : 60; return { x: x0, y: y0, w: W - 2 * x0, h: H - y0 - (capRes() + fh + 8) - (fh ? LEGH : 0) };
  }
  function painelBox(fh, ph) {
    if (!compacto()) return { x: 28, y: 60, w: PW, h: ph, comp: false };
    const x0 = NAR ? 6 : 24; return { x: x0, y: H - capRes() - fh - 4, w: W - 2 * x0, h: fh, comp: true };
  }
  function fundo(X, b) { X.fillStyle = 'rgba(11,15,28,.76)'; X.beginPath(); X.roundRect(b.x, b.y, b.w, b.h, b.comp ? 12 : 14); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke(); }

  // ---------- fábrica da viagem (a mesma de cenas-figura-rim-nervo.js, com a sua própria barra de botões) ----------
  // cfg: K, modo, nome, aria, vistas, hs, ET [{id, nome, vista, dur, cap}], VAI {hs: etapa}, faixa, alto, sobre, painel, novo, aoAbrir
  function viagem(cfg) {
    const c3 = SC[cfg.K]; if (!c3) return;
    const ET = cfg.ET, NE = ET.length;
    let FIG = null, ultAb = null, pedida = null, ultVista = null;
    const novo = () => Object.assign({ e: 0, u: RED ? 1 : 0, hold: 0, pausa: false }, cfg.novo ? cfg.novo() : {});
    const ctl = {
      S: null,
      ir(S, e, troca) {
        const v = S.vg; v.e = (e + NE) % NE; v.u = RED ? 1 : 0; v.hold = 0;
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
      if (RED || v.pausa || !dt) return;
      const k = dt * (S.v || 1);
      if (v.u < 1) { v.u = Math.min(1, v.u + k / et.dur); return; }
      v.hold += k;
      if (v.e < NE - 1) { if (v.hold > (et.hold || 1.6)) ctl.ir(S, v.e + 1, true); }
      else if (v.hold > 4) ctl.ir(S, 0, true);
    }
    function sobre(R, X, t, c) {
      const S = c.S; if (!S || !S.vg) return; ctl.S = S; dono = ctl; vivo = performance.now();
      if (!FIG) FIG = c3.figura;
      const ab = FIG && FIG.aberto ? FIG.aberto.id : null;
      if (ab !== ultAb) { ultAb = ab; if (ab && cfg.VAI[ab] != null && cfg.VAI[ab] !== S.vg.e) ctl.ir(S, cfg.VAI[ab], false); }
      const vz = FIG ? FIG.vistaAtual : R.vista;
      if (vz !== ultVista) { const de = ultVista; ultVista = vz; if (de != null && vz !== pedida && ET[S.vg.e].vista !== vz) { const i = ET.findIndex(e => e.vista === vz); if (i >= 0) ctl.ir(S, i, false); } pedida = null; }
      avancar(S, S.dt || 0); pend = null; FX = cfg.faixa;
      if (R.vista === ET[S.vg.e].vista) cfg.sobre(R, X, RED ? 0 : t, S, S.vg);
    }
    function fora(X, t, c) {
      const S = c.S; if (!S || !S.vg) return; montarNav(); dono = ctl; ctl.sinc(S); NAV.hidden = false;
      const b = painelBox(cfg.faixa, cfg.alto); fundo(X, b);
      posNav(b.x + (b.comp ? 6 : 10), b.y + (b.comp ? 6 : 10), b.w - (b.comp ? 12 : 20));
      cfg.painel(X, b, RED ? 0 : t, S, S.vg);
      if (pend) { if (pend[0] === 'linha') legLinha(X, pend[1], pend[2], pend[3], W - 12); else leg(X, pend[0], pend[1], pend[2], pend[3]); pend = null; }
      cap(ET[S.vg.e].cap);
    }
    const plano = c3.plano ? (t, S) => c3.plano(t, S) : null;
    const d3 = c3.draw, i0 = c3.init; let chamou3 = false, em3d = false;
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
  // 1) ENDÓCRINO: a viagem de um hormônio e a retroalimentação negativa
  // =====================================================================================================
  (function () {
    const TRH = '#F2A65A', TSH = '#8FD8FF', T34 = '#FFD43B', PTH = '#A9C54A', CAL = '#E8EDF7', ADR = '#FF8A6B', COR = '#F2B6C6',
      INS = '#7CC8F2', GLU = '#F28B8B', GLI = '#F2D04A', SEX = '#E58AB0', FSH = '#B79CF2', CEL = '#CFE0FF';
    const AR = [1.34, 1];   // proporção das duas figuras (4 por 3)
    // vista A (corpo translúcido): pontos conferidos sobre a imagem, em % da figura
    const HIPT = [49.7, 13.6], HIPF = [49.7, 17.4], TIR = [49.6, 30], ADRE = [[46.3, 55.6], [53.9, 54.9]], PANC = [51.2, 58.8], OVA = [[45.4, 74.6], [54.6, 74.6]];
    const cTRH = caminho([HIPT, [49.9, 15.4], HIPF], AR);
    const cTSH = caminho([HIPF, [50.6, 20], [50.9, 23.5], [50.2, 27], TIR], AR);
    const cFreio = caminho([TIR, [48.6, 26.5], [48.3, 22.5], [48.7, 18.6], [49.2, 15]], AR);
    const cFSH = caminho([HIPF, [51.4, 24], [52.2, 34], [52.4, 46], [53.4, 62], [54.6, 74.6]], AR);
    // células-alvo na vista A: fígado, coração, músculo do braço e da coxa (T3 e T4 agem em quase todas as células)
    const ALVO = [[40.5, 47], [53.5, 41], [35.2, 62], [44.5, 82]];
    const SEMREC = [57.5, 64];   // célula que não tem receptor para o TSH: o TSH passa e não age
    const cAlvo = ALVO.map(a => caminho([TIR, [lerp(TIR[0], a[0], .35), lerp(TIR[1], a[1], .3) + 2], a], AR));
    const cTSHsem = caminho([[50.9, 23.5], [53, 32], [55.5, 48], SEMREC], AR);
    // vista B (tireoide de perto, vista de trás): artéria tireóidea superior chegando, veias saindo para a jugular
    const B_ART = [[25.4, 100], [25.6, 70], [25.8, 40], [26, 15], [27, 6], [30.5, 9], [34, 17], [38, 27], [40.5, 36], [41, 45]];
    const B_VEI = [[40, 55], [35.5, 57.2], [30.5, 57.6], [25.5, 58.5], [21.3, 60], [21.6, 75], [22.2, 100]];
    const espelho = P => P.map(p => [100 - p[0], p[1]]);
    const cBArt = [caminho(B_ART, AR), caminho(espelho(B_ART), AR)], cBVei = [caminho(B_VEI, AR), caminho(espelho(B_VEI), AR)];
    const PARA = [[37.7, 48.2], [62.3, 48.2], [38.9, 68.3], [61.1, 68.3]];

    // etapas; med: o que o medidor mostra (nome, valor de 0 a 1 em função de u, cor); sub: o hormônio que comanda
    const ET = [
      { id: 'hipt', nome: 'Hipotálamo', vista: 'a', dur: 5, cap: 'O <b>hipotálamo</b> percebe que há pouco <b>T3 e T4</b> no sangue e libera o <b>TRH</b>, que desce até a hipófise logo abaixo.',
        med: ['T3 e T4 no sangue', u => .24, T34], sub: ['TRH', u => lerp(.15, .75, sst(.1, .8, u)), TRH] },
      { id: 'hipf', nome: 'Hipófise', vista: 'a', dur: 5, cap: 'O TRH chega à <b>hipófise</b>, que responde soltando o <b>TSH</b> no sangue. O TSH é um hormônio trópico: comanda outra glândula.',
        med: ['T3 e T4 no sangue', u => .24, T34], sub: ['TSH', u => lerp(.18, .75, sst(.1, .9, u)), TSH] },
      { id: 'tsh', nome: 'TSH no sangue', vista: 'a', dur: 6, cap: 'O TSH passa pelo corpo todo, mas só age na <b>tireoide</b>, a única com <b>receptor</b> para ele. Nas outras células ele não faz nada.',
        med: ['T3 e T4 no sangue', u => .25, T34], sub: ['TSH', u => .75, TSH] },
      { id: 'tire', nome: 'Tireoide', vista: 'b', dur: 7, cap: 'O TSH chega pela artéria e a <b>tireoide</b>, usando <b>iodo</b>, produz <b>T3 e T4</b>, que saem pelas veias para o sangue.',
        med: ['T3 e T4 no sangue', u => lerp(.25, .58, sst(.2, 1, u)), T34], sub: ['TSH', u => .75, TSH] },
      { id: 'alvo', nome: 'Células-alvo', vista: 'a', dur: 7, cap: 'T3 e T4 chegam a quase todas as células, que têm <b>receptor</b> para eles, e <b>aceleram o metabolismo</b>: mais consumo de O₂ e mais calor.',
        med: ['T3 e T4 no sangue', u => lerp(.58, .8, sst(0, .9, u)), T34], sub: ['TSH', u => lerp(.75, .65, u), TSH] },
      { id: 'freio', nome: 'Retroalimentação', vista: 'a', dur: 7, cap: '<b>Retroalimentação negativa</b>: com T3 e T4 altos, o hipotálamo e a hipófise são <b>inibidos</b>. Cai o TSH, a tireoide desacelera e o nível volta à faixa normal.',
        med: ['T3 e T4 no sangue', u => lerp(.8, .56, sst(.25, 1, u)), T34], sub: ['TSH', u => lerp(.65, .3, sst(0, .7, u)), TSH] },
      { id: 'para', nome: 'Paratireoides', vista: 'b', dur: 7, cap: 'As quatro <b>paratireoides</b>, atrás da tireoide, soltam o <b>paratormônio</b> quando o cálcio do sangue cai. Ele tira cálcio dos ossos e o cálcio sobe.',
        med: ['Cálcio no sangue', u => lerp(.28, .56, sst(.25, 1, u)), CAL], sub: ['Paratormônio', u => lerp(.75, .35, sst(.4, 1, u)), PTH] },
      { id: 'adr', nome: 'Adrenais', vista: 'a', dur: 6, cap: 'Num susto, a medula das <b>adrenais</b> solta <b>adrenalina</b>: coração acelera e a glicose sobe. O córtex faz <b>cortisol</b> e aldosterona.',
        med: ['Glicose no sangue', u => lerp(.5, .78, sst(.15, .9, u)), GLI], sub: ['Adrenalina', u => lerp(.1, .9, sst(0, .4, u)), ADR] },
      { id: 'panc', nome: 'Pâncreas', vista: 'a', dur: 8, cap: 'Glicose alta: as ilhotas do <b>pâncreas</b> soltam <b>insulina</b>, que faz as células absorverem glicose. Glicose baixa: soltam <b>glucagon</b> e o fígado devolve glicose.',
        med: ['Glicose no sangue', u => u < .45 ? lerp(.82, .55, sst(.05, .45, u)) : u < .6 ? lerp(.55, .3, sst(.45, .6, u)) : lerp(.3, .52, sst(.65, .95, u)), GLI], sub: [u => u < .55 ? 'Insulina' : 'Glucagon', u => u < .55 ? .8 * (1 - sst(.35, .55, u)) + .1 : .1 + .7 * sst(.55, .7, u) * (1 - sst(.9, 1, u)), u => u < .55 ? INS : GLU] },
      { id: 'gon', nome: 'Gônadas', vista: 'a', dur: 7, cap: 'O <b>FSH</b> e o <b>LH</b> da hipófise comandam ovários e testículos, que fazem <b>estrógeno</b>, progesterona ou <b>testosterona</b>. Hormônio de fora, como anabolizante, freia esse eixo.',
        med: ['Hormônio sexual', u => lerp(.3, .58, sst(.3, 1, u)), SEX], sub: ['FSH e LH', u => lerp(.72, .42, sst(.5, 1, u)), FSH] }
    ];
    // mini esquema do painel em cada etapa: elos [nome, hormônio da seta seguinte], quem está aceso, freio volta a quais elos
    const LOOP = { nos: [['Hipotálamo', 'TRH', TRH], ['Hipófise', 'TSH', TSH], ['Tireoide', 'T3 e T4', T34], ['Células-alvo', '', CEL]], freio: [0, 1] };
    const ESQ = {
      para: { nos: [['Cálcio baixo no sangue', '', CAL], ['Paratireoides', 'paratormônio', PTH], ['Ossos e rins', '', CEL]], freio: [1], fr: 'cálcio normal' },
      adr: { nos: [['Susto ou estresse', '', ADR], ['Adrenais', 'adrenalina e cortisol', ADR], ['Coração, fígado e músculos', '', CEL]], freio: [], fr: '' },
      panc: { nos: [['Glicose alta ou baixa', '', GLI], ['Ilhotas do pâncreas', 'insulina ou glucagon', INS], ['Fígado, músculos e gordura', '', CEL]], freio: [1], fr: 'glicose normal' },
      gon: { nos: [['Hipófise', 'FSH e LH', FSH], ['Ovários ou testículos', 'estrógeno ou testosterona', SEX], ['Corpo todo', '', CEL]], freio: [0], fr: 'nível alto' }
    };
    const LACESO = { hipt: 0, hipf: 1, tsh: 1.5, tire: 2, alvo: 3, freio: 4 };

    const HS = [
      { id: 'hip', c: TRH, t: 'Hipotálamo e hipófise', d: 'O hipotálamo, no encéfalo, liga o sistema nervoso ao endócrino e comanda a hipófise com hormônios como o TRH. A hipófise solta os trópicos (TSH, ACTH, FSH, LH), o GH e a prolactina.', em: { a: [49.7, 15.4] }, z: 3.2 },
      { id: 'tir', c: T34, t: 'Tireoide', d: 'No pescoço, produz T3 e T4 a partir do iodo. Eles aceleram o metabolismo de quase todas as células. Faz também a calcitonina, que baixa o cálcio do sangue.', em: { a: TIR }, z: 3 },
      { id: 'alv', c: CEL, t: 'Célula-alvo', d: 'Só responde ao hormônio a célula que tem o receptor certo, como chave e fechadura. T3 e T4 têm receptor em quase todas as células; o TSH, só na tireoide.', em: { a: ALVO[1] }, z: 2.6 },
      { id: 'adr', c: ADR, t: 'Adrenais (suprarrenais)', d: 'Sobre os rins. A medula solta adrenalina no susto; o córtex solta cortisol, que sobe a glicose no estresse, e aldosterona, que faz o rim poupar sódio e água.', em: { a: ADRE[0] }, z: 3 },
      { id: 'pan', c: INS, t: 'Pâncreas', d: 'Glândula mista. As ilhotas lançam no sangue a insulina, que baixa a glicose, e o glucagon, que a sobe. A parte exócrina faz o suco pancreático.', em: { a: [51.5, 59.6] }, z: 3 },
      { id: 'ova', c: SEX, t: 'Ovários (ou testículos)', d: 'Os ovários fazem estrógeno e progesterona; nos homens, os testículos fazem testosterona. FSH e LH da hipófise comandam as duas.', em: { a: OVA[0] }, z: 3 },
      { id: 'tirb', c: T34, t: 'Tireoide', d: 'Dois lobos ligados pelo istmo, abraçando a traqueia. Seus folículos guardam o hormônio e liberam T3 e T4 no sangue quando o TSH chega. Sem iodo, ela cresce: é o bócio.', em: { b: [43, 57] }, z: 2 },
      { id: 'par', c: PTH, t: 'Paratireoides', d: 'Quatro grãos na face de trás da tireoide. Fazem o paratormônio, que sobe o cálcio do sangue tirando cálcio dos ossos e poupando cálcio nos rins.', em: { b: PARA[0] }, z: 2.8 },
      { id: 'art', c: '#E5484D', t: 'Artéria tireóidea superior', d: 'Sai da carótida e leva sangue à tireoide. É por ela que o TSH chega à glândula.', em: { b: [34, 20.5] }, z: 2.6 },
      { id: 'vei', c: '#7C8CE0', t: 'Veias da tireoide', d: 'Levam o T3 e o T4 recém-feitos para a veia jugular e dali para o resto do corpo.', em: { b: [31, 57.6] }, z: 2.8 },
      { id: 'jug', c: '#7C8CE0', t: 'Veia jugular interna', d: 'Traz o sangue da cabeça e do pescoço de volta ao coração, já com os hormônios da tireoide.', em: { b: [20, 40] }, z: 2.2 },
      { id: 'trq', c: CEL, t: 'Traqueia e laringe', d: 'A tireoide fica logo abaixo da laringe, sobre os primeiros anéis da traqueia. Por isso o bócio aparece como um volume na frente do pescoço.', em: { b: [49.6, 86] }, z: 2.2 }
    ];
    const VAI = { hip: 0, tir: 3, alv: 4, adr: 7, pan: 8, ova: 9, tirb: 3, par: 6, art: 3, vei: 3, jug: 3, trq: 3 };

    function sobre(R, X, t, S, v) {
      const et = ET[v.e], u = RED ? .7 : eIO(v.u), r = cl(R.s * .55, 2.6, 6), P = (p) => R.pt(p[0], p[1]);
      const viajante = (C, f, cor) => { C.rastro(X, R, 0, f, rgba(cor, .55)); const p = C.em(f), s = P(p); hormonio(X, s[0], s[1], r * 1.4, cor, 1); return s; };
      const celula = (p, ok, k) => { const s = P(p), rr = cl(R.s * 1.6, 7, 15); X.beginPath(); X.arc(s[0], s[1], rr, 0, TAU); X.fillStyle = 'rgba(11,15,28,.55)'; X.fill(); X.strokeStyle = rgba(ok ? T34 : DIM, ok ? .9 * k + .3 : .6); X.lineWidth = 2; X.stroke(); if (ok) { brilho(X, s[0], s[1], rr * 2.2, T34, k); dot(X, s[0], s[1], rr * .35, CEL, .9); } };
      if (et.id === 'hipt') {
        const h = P(HIPT); anel(X, h[0], h[1], t, TRH, 1.6, R.s * 4, 0, .8);
        viajante(cTRH, u, TRH);
        legR(X, R, [[TRH, 'TRH'], [T34, 'T3 e T4 baixos no sangue']], 'dir');
      } else if (et.id === 'hipf') {
        const h = P(HIPF); anel(X, h[0], h[1], t, TSH, 1.4, R.s * 4.5, 0, .9);
        cTSH.fluxo(X, R, t, { n: 4, v: .25, c: TSH, r: r, a: sst(.15, .5, v.u) + (RED ? 1 : 0) });
        legR(X, R, [[TSH, 'TSH']], 'dir');
      } else if (et.id === 'tsh') {
        viajante(cTSH, u, TSH);
        // um TSH que vai para outra célula: sem receptor para ele, não acontece nada
        const f = RED ? .85 : ((t * .14) % 1), p = cTSHsem.em(f), s = P(p); hormonio(X, s[0], s[1], r, TSH, Math.sin(PI * f) * .9 + .1);
        celula(SEMREC, false, 0);
        const ti = P(TIR); anel(X, ti[0], ti[1], t, TSH, 1.4, R.s * 4, 0, sst(.7, 1, v.u));
        legR(X, R, [[TSH, 'TSH'], [DIM, 'célula sem receptor de TSH']], 'dir');
      } else if (et.id === 'alvo') {
        ALVO.forEach((a, i) => { cAlvo[i].fluxo(X, R, t, { n: 3, v: .22, off: i * .13, c: T34, r: r * .9 }); celula(a, true, sst(.2 + i * .1, .7 + i * .08, v.u) * (RED ? 1 : .75 + .25 * Math.sin(t * 4 + i))); });
        legR(X, R, [[T34, 'T3 e T4'], [CEL, 'célula com receptor: responde']], 'dir');
      } else if (et.id === 'freio') {
        viajante(cFreio, sst(0, .45, v.u) + (RED ? 1 : 0), T34);
        // o TSH some do caminho conforme o freio age
        cTSH.fluxo(X, R, t, { n: 4, v: .25, c: TSH, r: r * .9, a: 1 - sst(.35, .8, v.u) });
        [HIPF, HIPT].forEach((h, i) => { const q = P(h), k = cl(sst(.3 + i * .1, .55 + i * .1, v.u) + (RED ? 1 : 0), 0, 1), x = q[0] - R.s * 5; brilho(X, q[0], q[1], R.s * 6, FREIO, .8 * k); X.save(); X.globalAlpha = k; X.strokeStyle = FREIO; X.lineWidth = 2.5; X.setLineDash([3, 3]); X.beginPath(); X.moveTo(x - R.s * 4, q[1]); X.lineTo(x, q[1]); X.stroke(); X.restore(); barraFreio(X, x, q[1], 0, Math.max(6, R.s * 1.6), k); });
        legR(X, R, [[T34, 'T3 e T4 altos'], [FREIO, 'freio no hipotálamo e na hipófise'], [TSH, 'TSH caindo']], 'dir');
      } else if (et.id === 'adr') {
        ADRE.forEach((a, i) => { const q = P(a); anel(X, q[0], q[1], t, ADR, 1.1, R.s * 4, i * .5, .9); for (let k = 0; k < 6; k++) { const w = RED ? .5 : ((t * .5 + k / 6 + i * .1) % 1), ang = k * 1.05 + i, D = R.s * (1 + w * 9); hormonio(X, q[0] + Math.cos(ang) * D, q[1] + Math.sin(ang) * D, r * .8, ADR, (1 - w) * .95); } });
        legR(X, R, [[ADR, 'adrenalina']], 'dir');
      } else if (et.id === 'panc') {
        const q = P(PANC), ins = v.u < .55, cor = ins ? INS : GLU; anel(X, q[0], q[1], t, cor, 1.3, R.s * 4.5, 0, .9);
        // insulina vai às células e a glicose entra nelas; o glucagon vai ao fígado, que solta glicose
        const alvos = ins ? [ALVO[0], ALVO[2], ALVO[3]] : [ALVO[0]];
        alvos.forEach((a, i) => { const C = caminho([PANC, [lerp(PANC[0], a[0], .5), lerp(PANC[1], a[1], .5) + 2], a], AR); C.fluxo(X, R, t, { n: 3, v: .22, off: i * .2, c: cor, r: r * .9 }); celula(a, true, .6); const s = P(a); for (let k = 0; k < 4; k++) { const w = RED ? .5 : ((t * .4 + k / 4) % 1), ang = k * 1.57 + i, D = R.s * (ins ? (5 - w * 4) : (1 + w * 4)); dot(X, s[0] + Math.cos(ang) * D, s[1] + Math.sin(ang) * D, r * .7, GLI, ins ? w : 1 - w); } });
        legR(X, R, ins ? [[INS, 'insulina'], [GLI, 'glicose entrando nas células']] : [[GLU, 'glucagon'], [GLI, 'glicose saindo do fígado']], 'dir');
      } else if (et.id === 'gon') {
        cFSH.fluxo(X, R, t, { n: 5, v: .2, c: FSH, r: r });
        OVA.forEach((a, i) => { const q = P(a), k = sst(.35, .8, v.u) + (RED ? 1 : 0); anel(X, q[0], q[1], t, SEX, 1.5, R.s * 3.6, i * .7, .9 * cl(k, 0, 1)); for (let j = 0; j < 4; j++) { const w = RED ? .5 : ((t * .45 + j / 4 + i * .2) % 1), ang = j * 1.57 + i * .8, D = R.s * (1 + w * 7); hormonio(X, q[0] + Math.cos(ang) * D, q[1] + Math.sin(ang) * D, r * .8, SEX, (1 - w) * cl(k, 0, 1)); } });
        legR(X, R, [[FSH, 'FSH e LH'], [SEX, 'estrógeno e progesterona']], 'dir');
      } else if (et.id === 'tire') {
        // vista B: TSH chega pelas artérias; T3 e T4 saem pelas veias
        cBArt.forEach((C, i) => { C.rastro(X, R, 0, 1, rgba(TSH, .3)); C.fluxo(X, R, t, { n: 4, v: .16, off: i * .12, c: TSH, r: r * 1.1, a: 1 - sst(.7, 1, v.u) * .5 }); });
        const k = sst(.2, .6, v.u) + (RED ? 1 : 0);
        [[40, 52], [60, 52]].forEach((p, i) => { const q = P(p); brilho(X, q[0], q[1], R.s * 14, T34, .5 * cl(k, 0, 1) * (RED ? 1 : .8 + .2 * Math.sin(t * 3 + i))); });
        cBVei.forEach((C, i) => C.fluxo(X, R, t, { n: 5, v: .14, off: i * .1, c: T34, r: r * 1.1, a: cl(k, 0, 1) }));
        legR(X, R, [[TSH, 'TSH chegando pela artéria'], [T34, 'T3 e T4 saindo pelas veias']], 'baixodir');
      } else if (et.id === 'para') {
        const k = 1 - sst(.55, 1, v.u) * .6;
        PARA.forEach((p, i) => { const q = P(p); anel(X, q[0], q[1], t, PTH, 1.3, R.s * 4, i * .3, .9 * k); for (let j = 0; j < 4; j++) { const w = RED ? .5 : ((t * .4 + j / 4 + i * .17) % 1), ang = j * 1.57 + i, D = R.s * (1.5 + w * 7); hormonio(X, q[0] + Math.cos(ang) * D, q[1] + Math.sin(ang) * D, r * .8, PTH, (1 - w) * k); } });
        legR(X, R, [[PTH, 'paratormônio']], 'baixodir');
      }
    }

    // ---------- painel: medidor com faixa normal e o mini esquema da alça ----------
    const estado = v => v < .4 ? 'abaixo do normal' : v > .7 ? 'acima do normal' : 'na faixa normal';
    function medidor(X, x, y, w, nome, val, cor, comp) {
      txt(X, nome, x, y + 8, { s: comp ? 13 : 14, c: cor });
      txt(X, estado(val), x + w, y + 8, { s: 12, c: val < .4 || val > .7 ? '#FFB347' : '#7FD48A', a: 'right', w: 600 });
      const by = y + (comp ? 27 : 29), bh = comp ? 9 : 12;
      X.fillStyle = 'rgba(255,255,255,.08)'; X.beginPath(); X.roundRect(x, by, w, bh, bh / 2); X.fill();
      X.fillStyle = 'rgba(127,212,138,.28)'; X.fillRect(x + w * .4, by, w * .3, bh);
      X.strokeStyle = 'rgba(127,212,138,.75)'; X.lineWidth = 1; X.strokeRect(x + w * .4 + .5, by + .5, w * .3 - 1, bh - 1);
      X.fillStyle = rgba(cor, .85); X.beginPath(); X.roundRect(x, by + 2, Math.max(4, w * val), bh - 4, (bh - 4) / 2); X.fill();
      const nx = x + w * cl(val, 0, 1);
      X.beginPath(); X.moveTo(nx, by - 2); X.lineTo(nx - 6, by - 9); X.lineTo(nx + 6, by - 9); X.closePath(); X.fillStyle = TXT; X.fill();
      X.fillStyle = TXT; X.fillRect(nx - 1, by - 2, 2, bh + 4);
      if (!comp) { txt(X, 'baixo', x, by + bh + 11, { s: 11, c: DIM, w: 500 }); txt(X, 'faixa normal', x + w * .55, by + bh + 11, { s: 11, c: '#7FD48A', w: 500, a: 'center' }); txt(X, 'alto', x + w, by + bh + 11, { s: 11, c: DIM, w: 500, a: 'right' }); }
    }
    function subLinha(X, x, y, w, nome, val, cor) {
      txt(X, nome, x, y, { s: 12, c: DIM, w: 500 });
      const bx = x + 108, bw = w - 108; X.fillStyle = 'rgba(255,255,255,.08)'; X.beginPath(); X.roundRect(bx, y - 4, bw, 8, 4); X.fill();
      X.fillStyle = cor; X.beginPath(); X.roundRect(bx, y - 4, Math.max(4, bw * cl(val, 0, 1)), 8, 4); X.fill();
    }
    function esquema(X, x, y, w, h, E, aceso, kfreio, t) {
      const n = E.nos.length, bh = 30, gap = (h - n * bh) / (n - 1), bw = w - 46;
      E.nos.forEach((no, i) => {
        const yy = y + i * (bh + gap), on = Math.abs(aceso - i) < .01 || (aceso >= n && i === n - 1);
        X.fillStyle = on ? rgba(no[2], .22) : 'rgba(255,255,255,.05)'; X.beginPath(); X.roundRect(x, yy, bw, bh, 8); X.fill();
        X.strokeStyle = on ? no[2] : 'rgba(255,255,255,.14)'; X.lineWidth = on ? 2 : 1; X.stroke();
        txt(X, no[0], x + 12, yy + bh / 2, { s: 13, c: on ? TXT : DIM, w: on ? 600 : 500 });
        if (i < n - 1) {
          const ax = x + 22, a0 = yy + bh + 3, a1 = yy + bh + gap - 3, ok = aceso > i && aceso <= i + 1.5;
          X.strokeStyle = ok ? no[2] : 'rgba(255,255,255,.25)'; X.lineWidth = 2; X.beginPath(); X.moveTo(ax, a0); X.lineTo(ax, a1 - 5); X.stroke();
          seta(X, ax, a1 - 4, PI / 2, 6, ok ? no[2] : '#6B7799', 1);
          if (no[1]) txt(X, no[1], ax + 14, (a0 + a1) / 2, { s: 12, c: ok ? no[2] : DIM, w: 600 });
          if (ok && !RED) { const f = (t * .8) % 1; dot(X, ax, lerp(a0, a1 - 6, f), 3.5, no[2], Math.sin(PI * f)); }
        }
      });
      // freio: volta da última caixa até as caixas que ele inibe
      if (E.freio.length) {
        const fx = x + bw + 20, y1 = y + (n - 1) * (bh + gap) + bh / 2, a = .35 + .65 * kfreio;
        X.save(); X.setLineDash([4, 4]); X.strokeStyle = rgba(FREIO, a); X.lineWidth = 2; X.beginPath(); X.moveTo(x + bw, y1); X.lineTo(fx, y1);
        const ytop = y + E.freio[0] * (bh + gap) + bh / 2; X.lineTo(fx, ytop); X.stroke(); X.restore();
        E.freio.forEach(i => { const yy = y + i * (bh + gap) + bh / 2; X.strokeStyle = rgba(FREIO, a); X.lineWidth = 2; X.beginPath(); X.moveTo(fx, yy); X.lineTo(x + bw + 6, yy); X.stroke(); barraFreio(X, x + bw + 5, yy, 0, 6, a); });
        X.save(); X.translate(fx + 12, (ytop + y1) / 2); X.rotate(-PI / 2); txt(X, 'freio' + (E.fr ? ': ' + E.fr : ''), 0, 0, { s: 11, c: rgba(FREIO, .4 + .6 * kfreio), a: 'center' }); X.restore();
      }
    }
    function painel(X, b, t, S, v) {
      const et = ET[v.e], u = v.u, md = et.med, sb = et.sub;
      const val = md[1](u), sv = sb[1](u), sn = typeof sb[0] === 'function' ? sb[0](u) : sb[0], sc = typeof sb[2] === 'function' ? sb[2](u) : sb[2];
      if (!b.comp) {
        const px = b.x + 18, pw = b.w - 36;
        medidor(X, px, b.y + 66, pw, md[0], val, md[2], false);
        subLinha(X, px, b.y + 136, pw, sn, sv, sc);
        X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(px, b.y + 156, pw, 1);
        const E = LACESO[et.id] != null ? LOOP : ESQ[et.id], ac = LACESO[et.id] != null ? LACESO[et.id] : 1;
        txt(X, E === LOOP ? 'Eixo da tireoide' : 'A mesma lógica nesta glândula', px, b.y + 174, { s: 12, c: DIM, w: 500 });
        esquema(X, px, b.y + 190, pw - 14, E === LOOP ? 196 : 150, E, et.id === 'freio' ? 4 : ac, et.id === 'freio' || (E !== LOOP && sst(.5, 1, u) > 0) ? (et.id === 'freio' ? sst(.3, .8, u) : sst(.5, 1, u)) : 0, t);
      } else {
        const px = b.x + 12, pw = b.w - 24;
        medidor(X, px, b.y + 58, pw, md[0], val, md[2], true);
        subLinha(X, px, b.y + 112, pw, sn, sv, sc);
        if (b.h > 140) txt(X, et.id === 'freio' ? 'T3 e T4 altos freiam o hipotálamo e a hipófise' : LACESO[et.id] != null ? 'Eixo hipotálamo, hipófise e tireoide' : 'Mesma lógica: o efeito freia o hormônio', px, b.y + 134, { s: 12, c: et.id === 'freio' ? FREIO : DIM, w: 500 });
      }
    }

    const c3 = SC['endocrino/glandulas'];
    if (c3 && c3.extra && c3.extra[0]) c3.extra[0] = Object.assign({}, c3.extra[0], { t: 'Viagem do hormônio' });
    viagem({
      K: 'endocrino/glandulas', modo: 'gland', nome: 'Viagem de um hormônio e a retroalimentação negativa', aria: 'Viagem do hormônio: etapas',
      vistas: [
        ['a', 'endocrino-glandulas-a', 'Corpo', 'Corpo translúcido com as glândulas endócrinas acesas: hipotálamo e hipófise, tireoide, adrenais, pâncreas e ovários', [.27, .05, .46, .8]],
        ['b', 'endocrino-glandulas-v4b', 'Tireoide por trás', 'Tireoide vista por trás, com o esôfago retirado: a traqueia passa na frente e esconde o istmo, e as quatro paratireoides aparecem na face de trás dos lobos, com as artérias tireóideas, as veias e os grandes vasos do pescoço']
      ],
      hs: HS, ET, VAI, faixa: 150, alto: 400, sobre, painel,
      aoAbrir: S => { S.modo = 'gland'; }
    });
  })();

  // =====================================================================================================
  // 2) LOCOMOTOR: do comando motor à contração e à alavanca do cotovelo
  // =====================================================================================================
  (function () {
    const IMP = '#FFD43B', ACH = '#8FD8FF', CA = '#7FD48A', ATP = '#FFB347', ACT = '#F2B6C6', MIO = '#9C7BEA', BIC = '#FFB347', TRI = '#6EC8E8', OSSO = '#E8DCC0';
    const AR = [1.34, 1];
    // vista A (braço): nervo musculocutâneo chegando ao bíceps; linhas dos dois músculos; cotovelo
    const cNervo = caminho([[19, 3], [22.5, 11], [26.5, 19], [30.5, 27], [34, 34], [37, 40]], AR);
    const BICL = [[30, 29], [39, 46], [48, 65]], TRIL = [[24.5, 37], [33, 57], [43, 76]], COT = [44.5, 73];
    const cBic = caminho(BICL, AR), cTri = caminho(TRIL, AR);
    // vista B (fibra e sarcômero): axônio, placa motora, fibra aberta, sarcômero
    const cAxo = caminho([[9.2, 0], [11.2, 8], [13.8, 17], [16.5, 26], [18.4, 33], [19, 37.5]], AR);
    const TERM = [[12, 41.3], [15.4, 41.5], [19.3, 41.5], [21.8, 41.5]];
    const cFibra = caminho([[19, 44], [26, 46], [33, 49], [40, 50.5], [48, 51], [55, 51]], AR);
    const ZL = [61.5, 92.8], SY = [39.5, 61.5], MC = 77.5;   // linhas Z do sarcômero, faixa vertical e centro (linha M)

    // sarc: comprimento do sarcômero do bíceps (µm); ang: ângulo do cotovelo (graus); ca, atp: 0 a 1; ativo: 'bic' ou 'tri'
    const ET = [
      { id: 'cmd', nome: 'Comando motor', vista: 'a', dur: 5, cap: 'O <b>neurônio motor</b>, que sai da medula espinal, leva o impulso nervoso até o <b>bíceps</b>. É um movimento voluntário, que começa no córtex motor.',
        sarc: u => 2.5, ang: u => 160, ca: u => 0, atp: u => 0 },
      { id: 'placa', nome: 'Placa motora', vista: 'b', dur: 6, cap: 'Na <b>placa motora</b>, a sinapse entre nervo e músculo, o axônio solta <b>acetilcolina</b>. A membrana da fibra despolariza e o impulso corre por ela.',
        sarc: u => 2.5, ang: u => 160, ca: u => 0, atp: u => 0 },
      { id: 'ca', nome: 'Cálcio liberado', vista: 'b', dur: 6, cap: 'O impulso entra na fibra e o <b>retículo sarcoplasmático</b> solta <b>Ca²⁺</b> em volta das miofibrilas. O cálcio destrava a actina para a miosina.',
        sarc: u => 2.5, ang: u => 160, ca: u => sst(.1, .7, u), atp: u => 0 },
      { id: 'desl', nome: 'Actina desliza', vista: 'b', dur: 8, cap: 'As cabeças da <b>miosina</b>, gastando <b>ATP</b>, puxam a <b>actina</b> para o centro. Os filamentos deslizam sem encolher e o <b>sarcômero encurta</b>.',
        sarc: u => lerp(2.5, 2.1, sst(.1, 1, u)), ang: u => lerp(160, 135, sst(.1, 1, u)), ca: u => 1, atp: u => 1 },
      { id: 'flex', nome: 'Alavanca: flexão', vista: 'a', dur: 7, cap: 'Milhares de sarcômeros encurtam juntos e o <b>bíceps</b> (agonista) puxa o rádio. O cotovelo é o apoio da <b>alavanca</b> e o antebraço sobe. O <b>tríceps</b> (antagonista) relaxa.',
        sarc: u => lerp(2.1, 2.0, sst(0, 1, u)), ang: u => lerp(135, 60, sst(0, 1, u)), ca: u => 1, atp: u => 1 },
      { id: 'relax', nome: 'Relaxamento', vista: 'b', dur: 6, cap: 'Sem impulso, o Ca²⁺ é bombeado de volta ao retículo, com gasto de ATP, e o ATP solta a miosina da actina. Sem ATP ela não solta: é a <b>rigidez cadavérica</b>.',
        sarc: u => 2.0, ang: u => 60, ca: u => 1 - sst(.1, .8, u), atp: u => 1 - sst(.6, 1, u) },
      { id: 'ext', nome: 'Extensão: tríceps', vista: 'a', dur: 7, cap: 'O músculo só puxa, nunca empurra. Para esticar, o <b>tríceps</b> contrai e puxa o olécrano da ulna; o bíceps relaxado é esticado e seus sarcômeros voltam a alongar.',
        sarc: u => lerp(2.0, 2.5, sst(0, 1, u)), ang: u => lerp(60, 160, sst(0, 1, u)), ca: u => 0, atp: u => 0 }
    ];
    const HS = [
      { id: 'ner', c: IMP, t: 'Neurônio motor', d: 'O corpo dele fica na medula espinal e o axônio vai pelo nervo até o músculo. Um só neurônio motor comanda várias fibras: é a unidade motora.', em: { a: [30.5, 27] }, z: 2.6 },
      { id: 'bic', c: BIC, t: 'Bíceps braquial (agonista)', d: 'Na frente do braço. Seu tendão prende no rádio. Ao contrair, flexiona o cotovelo.', em: { a: [39, 45] }, z: 2.6 },
      { id: 'tri', c: TRI, t: 'Tríceps braquial (antagonista)', d: 'Atrás do braço, com três cabeças. Seu tendão prende no olécrano da ulna. Ao contrair, estende o cotovelo.', em: { a: [27.5, 47] }, z: 2.6 },
      { id: 'umr', c: OSSO, t: 'Úmero', d: 'Osso do braço. Fica parado enquanto o rádio e a ulna giram em volta do cotovelo.', em: { a: [29.5, 36.6] }, z: 2.6 },
      { id: 'cot', c: '#F28B8B', t: 'Cotovelo: apoio da alavanca', d: 'Articulação sinovial em dobradiça. É o ponto de apoio; o tendão do bíceps puxa perto dele e o peso fica na mão, longe: alavanca que ganha em velocidade e alcance.', em: { a: COT }, z: 3 },
      { id: 'tbi', c: BIC, t: 'Tendão do bíceps', d: 'Liga o bíceps ao rádio. Tendão liga músculo a osso; ligamento liga osso a osso.', em: { a: [48, 66] }, z: 3 },
      { id: 'esc', c: '#CFE0FF', t: 'Escápula', d: 'Osso da cintura escapular. Nela se prendem as cabeças do bíceps e uma cabeça do tríceps.', em: { a: [15, 30] }, z: 2.6 },
      { id: 'axo', c: IMP, t: 'Axônio do neurônio motor', d: 'Leva o impulso nervoso até a fibra muscular. Perto dela, ele se ramifica em terminais.', em: { b: [14.5, 18] }, z: 2.4 },
      { id: 'pla', c: ACH, t: 'Placa motora', d: 'Sinapse entre o neurônio e a fibra muscular. O terminal solta acetilcolina, que despolariza a membrana da fibra. O curare bloqueia esse receptor e paralisa o músculo.', em: { b: [17, 41] }, z: 2.8 },
      { id: 'fib', c: '#E58A7A', t: 'Fibra muscular', d: 'Uma célula longa, com vários núcleos, cheia de miofibrilas. Suas faixas claras e escuras dão o nome de músculo estriado.', em: { b: [12, 53] }, z: 2.2 },
      { id: 'ret', c: CA, t: 'Retículo sarcoplasmático', d: 'Rede de membranas em volta das miofibrilas que guarda o cálcio. Solta Ca²⁺ quando chega o impulso e o recolhe, com ATP, no relaxamento.', em: { b: [44, 41] }, z: 2.6 },
      { id: 'mif', c: '#F2A6A0', t: 'Miofibrila', d: 'Cordão de sarcômeros enfileirados, um atrás do outro. Quando todos encurtam juntos, a fibra encurta.', em: { b: [40, 52] }, z: 2.6 },
      { id: 'zl', c: '#CFE0FF', t: 'Linha Z', d: 'Limite de cada sarcômero. Os filamentos de actina se prendem nela. Na contração, as linhas Z se aproximam.', em: { b: [ZL[0], 50] }, z: 2.6 },
      { id: 'act', c: ACT, t: 'Actina (filamento fino)', d: 'Presa à linha Z. A miosina se agarra a ela e a puxa para o centro quando há cálcio.', em: { b: [68, 40.5] }, z: 2.8 },
      { id: 'mio', c: MIO, t: 'Miosina (filamento grosso)', d: 'Fica no centro do sarcômero. Suas cabeças usam ATP para puxar a actina e para se soltar dela.', em: { b: [MC, 48.5] }, z: 2.8 }
    ];
    const VAI = { ner: 0, bic: 4, tri: 6, umr: 4, cot: 4, tbi: 4, esc: 4, axo: 1, pla: 1, fib: 2, ret: 2, mif: 2, zl: 3, act: 3, mio: 3 };

    function brilhoMusculo(R, X, P, cor, a, lw) {
      if (a <= .01) return; X.save(); X.globalCompositeOperation = 'lighter'; X.lineCap = 'round'; X.lineJoin = 'round'; X.strokeStyle = rgba(cor, a); X.lineWidth = lw;
      X.beginPath(); P.forEach((p, i) => { const s = R.pt(p[0], p[1]); if (i) X.lineTo(s[0], s[1]); else X.moveTo(s[0], s[1]); }); X.stroke(); X.restore();
    }
    function arcoCotovelo(R, X, t, flex, k) {
      const c = R.pt(COT[0], COT[1]), r = R.s * 15, a0 = flex ? .1 : -.95, a1 = flex ? -.95 : .1, ang = lerp(a0, a1, k), cor = flex ? BIC : TRI;
      X.save(); X.strokeStyle = rgba(cor, .9); X.lineWidth = 2.2; X.setLineDash([5, 5]); X.beginPath(); X.arc(c[0], c[1], r, a0, ang, a1 < a0); X.stroke(); X.restore();
      seta(X, c[0] + Math.cos(ang) * r, c[1] + Math.sin(ang) * r, ang + (a1 < a0 ? -PI / 2 : PI / 2), 8, cor, .95);
      dot(X, c[0], c[1], 5, '#F28B8B', .95); anel(X, c[0], c[1], t, '#F28B8B', 1.6, R.s * 3, 0, .6);
    }
    function sobre(R, X, t, S, v) {
      const et = ET[v.e], u = RED ? .7 : eIO(v.u), r = cl(R.s * .5, 2.6, 6), P = p => R.pt(p[0], p[1]);
      if (et.id === 'cmd') {
        cNervo.rastro(X, R, 0, 1, rgba(IMP, .35));
        cNervo.rastro(X, R, 0, u, rgba(IMP, .85));
        const p = cNervo.em(u), s = P(p); hormonio(X, s[0], s[1], r * 1.5, IMP, 1);
        const e = P([37, 40]); anel(X, e[0], e[1], t, IMP, 1.2, R.s * 4, 0, sst(.85, 1, v.u) + (RED ? .5 : 0));
        legR(X, R, [[IMP, 'impulso no neurônio motor']], 'dir');
      } else if (et.id === 'flex' || et.id === 'ext') {
        const flex = et.id === 'flex', k = RED ? .7 : sst(0, 1, v.u), pulso = RED ? 1 : .75 + .25 * Math.sin(t * 6);
        brilhoMusculo(R, X, BICL, BIC, flex ? .5 * pulso : .06, R.s * 5.2);
        brilhoMusculo(R, X, TRIL, TRI, flex ? .05 : .45 * pulso, R.s * 4.6);
        // o músculo ativo puxa o tendão em direção à origem
        const C = flex ? cBic : cTri, cor = flex ? BIC : TRI;
        for (let i = 0; i < 3; i++) { const f = RED ? .35 + i * .2 : 1 - ((t * .35 + i / 3) % 1), p = C.em(f), s = P(p); seta(X, s[0], s[1], p[2] + PI, 7, cor, .9 * Math.sin(PI * f)); }
        arcoCotovelo(R, X, t, flex, k);
        legR(X, R, flex ? [[BIC, 'bíceps contrai (agonista)'], [TRI, 'tríceps relaxa (antagonista)']] : [[TRI, 'tríceps contrai'], [BIC, 'bíceps relaxa e é esticado']], 'dir');
      } else if (et.id === 'placa') {
        cAxo.rastro(X, R, 0, 1, rgba(IMP, .3));
        const f = sst(0, .55, v.u), p = cAxo.em(RED ? 1 : f), s = P(p);
        cAxo.rastro(X, R, 0, RED ? 1 : f, rgba(IMP, .85)); if (v.u < .6 || RED) hormonio(X, s[0], s[1], r * 1.5, IMP, 1);
        const k = sst(.5, .75, v.u) + (RED ? 1 : 0);
        TERM.forEach((q, i) => { const a = P(q); for (let j = 0; j < 4; j++) { const w = RED ? .5 : ((t * .9 + j / 4 + i * .2) % 1); dot(X, a[0] + (j - 1.5) * 2.5, a[1] + w * R.s * 2.5, Math.max(1.6, r * .5), ACH, cl(k, 0, 1) * (1 - w)); } });
        // a membrana da fibra despolariza: anel que corre pela fibra a partir da placa
        if (v.u > .7 || RED) { const w = RED ? .5 : ((t * .6) % 1), c = P([17, 50.5]); X.save(); X.strokeStyle = rgba(IMP, .8 * (1 - w)); X.lineWidth = 2.5; X.beginPath(); X.ellipse(c[0] - w * R.s * 14, c[1], R.s * 1.5, R.s * 12, 0, 0, TAU); X.stroke(); X.beginPath(); X.ellipse(c[0] + w * R.s * 14, c[1], R.s * 1.5, R.s * 12, 0, 0, TAU); X.stroke(); X.restore(); }
        legR(X, R, [[IMP, 'impulso nervoso'], [ACH, 'acetilcolina']], 'baixo');
      } else if (et.id === 'ca' || et.id === 'relax') {
        const sai = et.id === 'ca', k = sai ? sst(.05, .6, v.u) : 1 - sst(.1, .8, v.u);
        if (sai) { cFibra.rastro(X, R, 0, 1, rgba(IMP, .25)); const f = RED ? .7 : (t * .35) % 1, p = cFibra.em(f), s = P(p); hormonio(X, s[0], s[1], r * 1.2, IMP, .9 * Math.sin(PI * f) + .1); }
        // Ca²⁺ saindo do retículo (ou voltando para ele) em volta das miofibrilas
        for (let i = 0; i < 26; i++) {
          const bx = 31 + (i * 37 % 23), by = 39.5 + (i * 53 % 22), q = P([bx, by]), w = RED ? .5 : ((t * .5 + i * .137) % 1), ang = i * 2.39, D = R.s * (sai ? w : 1 - w) * 3;
          dot(X, q[0] + Math.cos(ang) * D, q[1] + Math.sin(ang) * D, Math.max(1.8, r * .55), CA, cl(k, 0, 1) * .95);
        }
        if (!sai) { for (let i = 0; i < 6; i++) { const q = P([lerp(68, 87, i / 5), 44 + (i % 3) * 4]); dot(X, q[0], q[1], Math.max(2, r * .6), ATP, (1 - sst(.6, 1, v.u)) * (RED ? .9 : .6 + .4 * Math.sin(t * 5 + i))); } }
        legR(X, R, sai ? [[IMP, 'impulso entrando na fibra'], [CA, 'Ca²⁺ saindo do retículo']] : [[CA, 'Ca²⁺ voltando ao retículo'], [ATP, 'ATP soltando a miosina']], 'baixo');
      } else if (et.id === 'desl') {
        // as linhas Z se aproximam: traço claro que anda para dentro e setas da actina puxada ao centro
        const enc = sst(.1, 1, v.u) * 3.2;
        [[ZL[0] + enc, 1], [ZL[1] - enc, -1]].forEach(([zx, s]) => {
          const a = P([zx, SY[0]]), b = P([zx, SY[1]]); X.save(); X.strokeStyle = rgba('#CFE0FF', .85); X.lineWidth = 3; X.setLineDash([6, 4]); X.beginPath(); X.moveTo(a[0], a[1]); X.lineTo(b[0], b[1]); X.stroke(); X.restore();
          for (let i = 0; i < 3; i++) { const q = P([lerp(zx, MC, .45), 43 + i * 7]); seta(X, q[0] + (RED ? 0 : s * Math.sin(t * 4 + i) * 2), q[1], s > 0 ? 0 : PI, 7, ACT, .95); }
        });
        // cabeças da miosina gastando ATP e o cálcio por perto
        for (let i = 0; i < 10; i++) { const q = P([lerp(67, 88, (i % 5) / 4), 42.5 + Math.floor(i / 5) * 12]), w = RED ? .3 : ((t * 1.2 + i * .23) % 1); dot(X, q[0], q[1] - w * R.s * 1.5, Math.max(2, r * .6), ATP, 1 - w); }
        legR(X, R, [[ACT, 'actina puxada ao centro'], [ATP, 'ATP na miosina'], ['#CFE0FF', 'linhas Z se aproximam']], 'baixo');
      }
    }

    // ---------- painel: sarcômero desenhado no tamanho atual e alavanca do cotovelo ----------
    function sarcomero(X, x, y, w, h, L, ca, atp, t) {
      const esc = w / 2.7, zw = L * esc, cx = x + w / 2, z0 = cx - zw / 2, z1 = cx + zw / 2, mw = 1.6 * esc, aw = 1.0 * esc;
      X.fillStyle = 'rgba(255,255,255,.04)'; X.fillRect(x, y, w, h);
      // actina presa nas linhas Z
      X.strokeStyle = ACT; X.lineWidth = 2; X.lineCap = 'round';
      for (let i = 0; i < 4; i++) { const yy = y + h * (.14 + i * .24); X.beginPath(); X.moveTo(z0, yy); X.lineTo(z0 + aw, yy); X.moveTo(z1, yy); X.lineTo(z1 - aw, yy); X.stroke(); }
      // miosina no centro, com cabeças
      for (let i = 0; i < 3; i++) {
        const yy = y + h * (.26 + i * .24); X.strokeStyle = MIO; X.lineWidth = 5; X.beginPath(); X.moveTo(cx - mw / 2, yy); X.lineTo(cx + mw / 2, yy); X.stroke();
        X.lineWidth = 1.6; for (let j = 0; j < 7; j++) { const hx = cx - mw / 2 + 6 + j * (mw / 2 - 12) / 6, s = -1; [hx, 2 * cx - hx].forEach((qx, k) => { const bate = atp > .5 && !RED ? Math.sin(t * 8 + j + k) * 2 : 0; X.beginPath(); X.moveTo(qx, yy); X.lineTo(qx + (k ? 3 : -3) + bate, yy + s * 5 * (j % 2 ? 1 : -1)); X.stroke(); }); }
      }
      // linhas Z
      [z0, z1].forEach(zx => { X.strokeStyle = '#CFE0FF'; X.lineWidth = 3; X.beginPath(); X.moveTo(zx, y + 2); X.lineTo(zx, y + h - 2); X.stroke(); });
      for (let i = 0; i < 8; i++) { if (ca < .05) break; const px = x + 6 + ((i * 37) % 100) / 100 * (w - 12), py = y + 4 + ((i * 61) % 100) / 100 * (h - 8); dot(X, px, py, 2.4, CA, ca * .9); }
    }
    function alavanca(X, cx, cy, Lb, ang, ativo) {
      // úmero fixo (vertical), antebraço girando em volta do cotovelo; ângulo entre os dois ossos
      const ombro = [cx, cy - Lb], th = (ang - 90) * PI / 180, mao = [cx + Math.cos(th) * Lb * 1.05, cy + Math.sin(th) * Lb * 1.05];
      const ins = [cx + Math.cos(th) * Lb * .2, cy + Math.sin(th) * Lb * .2], ole = [cx - Math.cos(th) * 9, cy - Math.sin(th) * 9];
      X.lineCap = 'round';
      X.strokeStyle = OSSO; X.lineWidth = 6; X.beginPath(); X.moveTo(ombro[0], ombro[1]); X.lineTo(cx, cy); X.stroke();
      X.beginPath(); X.moveTo(ole[0], ole[1]); X.lineTo(mao[0], mao[1]); X.stroke();
      const mus = (a, b, cor, on, lado) => { const mx = (a[0] + b[0]) / 2 + lado * (on ? 12 : 7), my = (a[1] + b[1]) / 2; X.strokeStyle = rgba(cor, on ? 1 : .45); X.lineWidth = on ? 6 : 3.5; X.beginPath(); X.moveTo(a[0], a[1]); X.quadraticCurveTo(mx, my, b[0], b[1]); X.stroke(); };
      mus([cx + 4, cy - Lb + 6], ins, BIC, ativo === 'bic', 1);
      mus([cx - 5, cy - Lb + 10], ole, TRI, ativo === 'tri', -1);
      dot(X, cx, cy, 5, '#F28B8B', 1); dot(X, mao[0], mao[1], 6, OSSO, 1);
    }
    const fmt = n => n.toFixed(1).replace('.', ',');
    function painel(X, b, t, S, v) {
      const et = ET[v.e], u = v.u, L = et.sarc(u), ang = et.ang(u), ca = et.ca(u), atp = et.atp(u);
      const ativo = et.id === 'ext' ? 'tri' : ['ca', 'desl', 'flex'].includes(et.id) ? 'bic' : '';
      const est = et.id === 'relax' ? 'relaxado, ainda curto' : L >= 2.45 ? 'relaxado' : L <= 2.05 ? 'contraído' : et.id === 'ext' ? 'sendo esticado' : 'encurtando';
      if (!b.comp) {
        const px = b.x + 18, pw = b.w - 36;
        txt(X, 'Sarcômero do bíceps', px, b.y + 72, { s: 12, c: DIM, w: 500 });
        txt(X, fmt(L) + ' µm', px, b.y + 96, { s: 22, w: 700, c: L < 2.45 ? BIC : TXT });
        txt(X, est, px + pw, b.y + 96, { s: 14, a: 'right' });
        sarcomero(X, px, b.y + 114, pw, 64, L, ca, atp, t);
        [[CA, 'Ca²⁺', ca, ' liberado'], [ATP, 'ATP', atp, ' em uso']].forEach(([c, s, k, sf], i) => { const xx = px + i * 132; X.fillStyle = k > .5 ? rgba(c, .25) : 'rgba(255,255,255,.05)'; X.beginPath(); X.roundRect(xx, b.y + 188, 124, 24, 12); X.fill(); dot(X, xx + 14, b.y + 200, 5, c, k > .5 ? 1 : .35); txt(X, s + (k > .5 ? sf : ''), xx + 25, b.y + 200, { s: 12, c: k > .5 ? TXT : DIM, w: 500 }); });
        X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(px, b.y + 226, pw, 1);
        txt(X, 'Ângulo do cotovelo', px, b.y + 246, { s: 12, c: DIM, w: 500 });
        txt(X, Math.round(ang) + '°', px, b.y + 272, { s: 22, w: 700 });
        txt(X, ang < 100 ? 'dobrado' : ang > 150 ? 'esticado' : 'dobrando', px, b.y + 296, { s: 13, c: DIM, w: 500 });
        alavanca(X, px + pw - 70, b.y + 316, 60, ang, ativo);
        [[BIC, 'bíceps'], [TRI, 'tríceps']].forEach(([c, s], i) => { dot(X, px + 5, b.y + 326 + i * 22, 4.5, c, 1); txt(X, s, px + 16, b.y + 326 + i * 22, { s: 13, w: 500 }); });
      } else {
        const px = b.x + 12, pw = b.w - 24, hw = pw / 2;
        txt(X, 'Sarcômero', px, b.y + 64, { s: 12, c: DIM, w: 500 });
        txt(X, fmt(L) + ' µm', px + hw - 10, b.y + 64, { s: 15, w: 700, a: 'right', c: L < 2.3 ? BIC : TXT });
        sarcomero(X, px, b.y + 78, hw - 10, b.h - 86, L, ca, atp, t);
        txt(X, 'Cotovelo', px + hw + 6, b.y + 64, { s: 12, c: DIM, w: 500 });
        txt(X, Math.round(ang) + '°', px + pw, b.y + 64, { s: 15, w: 700, a: 'right' });
        const lh = Math.min(40, (b.h - 86) / 2 - 2); alavanca(X, px + hw + hw * .5, b.y + 78 + (b.h - 86) / 2, lh, ang, ativo);
      }
    }

    const c3 = SC['locomotor/movimento'];
    if (c3 && c3.extra && c3.extra[0]) c3.extra[0] = Object.assign({}, c3.extra[0], { t: 'Do comando à contração' });
    viagem({
      K: 'locomotor/movimento', modo: 'braco', nome: 'Do comando motor à contração do bíceps', aria: 'Viagem do comando motor: etapas',
      vistas: [
        ['a', 'locomotor-movimento-a', 'Braço', 'Braço dobrado com escápula, úmero, rádio, ulna, bíceps e tríceps, visto de lado', [.07, .1, .8, .76]],
        ['b', 'locomotor-movimento-v4b', 'Fibra e sarcômero', 'Neurônio motor terminando na placa motora de uma fibra muscular, a fibra aberta em miofibrilas com o retículo sarcoplasmático e um sarcômero com actina e miosina', [0, .02, 1, .66]]
      ],
      hs: HS, ET, VAI, faixa: 150, alto: 400, sobre, painel,
      aoAbrir: S => { S.modo = 'braco'; }
    });
  })();
})();
