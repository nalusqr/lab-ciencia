/* LAB Evolução: "Como nasce uma espécie" (especiacao/modos) como a viagem da especiação alopátrica sobre a figura de IA
   do Grande Cânion, no padrão de anatomia/cenas-figura-digestorio.js (Martin). Substitui o bloco simples desta rota em cenas-figura.js.
   Nenhuma figura nova: a mesma figura do cânion com os dois esquilos-antílope; caminhos e pontos conferidos sobre ela.
   Viagem em 5 etapas: população única com fluxo gênico; o rio aprofunda o cânion (barreira geográfica); o fluxo gênico para;
   mutação, seleção e deriva diferentes em cada lado; reencontro sem cruzamento fértil (isolamento reprodutivo, nova espécie).
   O medidor do painel mostra a diferença genética entre os dois grupos (escala ilustrativa), o fluxo gênico e se ainda cruzam.
   Tocar num ponto leva a viagem até a etapa dele. A cena 3D e a montagem seguem atrás de "Ver em 3D" (LAB_FIGALT, figura-alterna.js).
   Com prefers-reduced-motion nada anda sozinho: etapas por botão. Usa os globais do motor (SC, X, W, H, cv, cap).
   Carregar depois de cenas-figura.js e antes de LAB_EVOLUCAO_iniciar(). Texto na tela: sem "!", sem setas ou pontos como separador. */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA || !SC['especiacao/modos']) return;
  const PFX = 'es-nav';
  const ENV = {
    SC, X: () => X, W: () => W, H: () => H, tela: () => cv.parentNode, t: a => a[0], S: a => a[1], dt: S => S.dt || 0,
    cap: h => cap(h), rot: 'Ver em 3D', esconder: ['.hud.onde', '.palco .ctl', '#extra']
  };
  const RED = LAB_FIGALT.RED, PI = Math.PI, TAU = PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
  const sst = (a, b, x) => { const u = cl((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const eIO = u => { u = cl(u, 0, 1); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  const fr = v => v - Math.floor(v);
  const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
  const mixC = (h1, h2, k) => { const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16), m = s => Math.round(lerp(a >> s & 255, b >> s & 255, cl(k, 0, 1))); return `rgb(${m(16)},${m(8)},${m(0)})`; };
  const FT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const TXT = '#E8EDF7', DIM = '#9DA9C4', VERM = '#FF7A7A', AMB = '#FFB347';

  // ---------- desenho básico ----------
  function dot(X, x, y, r, c, a) { X.save(); X.globalAlpha *= cl(a == null ? 1 : a, 0, 1); X.beginPath(); X.arc(x, y, Math.max(.1, r), 0, TAU); X.fillStyle = c; X.fill(); X.restore(); }
  function brilho(X, x, y, r, cor, a) { X.save(); X.globalAlpha *= cl(a, 0, 1); const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(cor, .9)); g.addColorStop(1, rgba(cor, 0)); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); X.restore(); }
  function anel(X, x, y, r, cor, a, lw) { X.save(); X.globalAlpha *= cl(a, 0, 1); X.strokeStyle = cor; X.lineWidth = lw || 2; X.beginPath(); X.arc(x, y, Math.max(.1, r), 0, TAU); X.stroke(); X.restore(); }
  function txt(X, s, x, y, o = {}) { X.font = `${o.w || 600} ${o.s || 13}px ${FT}`; X.fillStyle = o.c || TXT; X.textAlign = o.a || 'left'; X.textBaseline = 'middle'; X.fillText(s, x, y); }
  function pastilha(X, x, y, s, cor, o = {}) {
    X.save(); X.globalAlpha *= o.al == null ? 1 : cl(o.al, 0, 1); X.font = `600 ${o.s || 12}px ${FT}`;
    const w = X.measureText(s).width + 26, h = 22; let x0 = o.c ? x - w / 2 : x; x0 = cl(x0, 4, ENV.W() - w - 4); const y0 = cl(y, 14, ENV.H() - 14);
    X.beginPath(); X.roundRect(x0, y0 - h / 2, w, h, 11); X.fillStyle = 'rgba(11,15,28,.86)'; X.fill(); X.strokeStyle = 'rgba(255,255,255,.14)'; X.lineWidth = 1; X.stroke();
    X.beginPath(); X.arc(x0 + 11, y0, 4, 0, TAU); X.fillStyle = cor; X.fill();
    X.fillStyle = TXT; X.textBaseline = 'middle'; X.textAlign = 'left'; X.fillText(s, x0 + 19, y0 + .5); X.restore();
  }
  function quebra(X, s, w, px) {   // até duas linhas
    X.font = `500 ${px || 12}px ${FT}`; if (X.measureText(s).width <= w) return [s];
    const p = s.split(' '); let a = '', i = 0; while (i < p.length && X.measureText((a ? a + ' ' : '') + p[i]).width <= w) { a = (a ? a + ' ' : '') + p[i]; i++; }
    return [a, p.slice(i).join(' ')];
  }
  const sep = (X, x, y, w) => { X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(x, y, w, 1); };

  // ---------- caminho suave (Catmull-Rom) em pixels a partir de pontos em % da figura ----------
  function curva(R, P) {
    const Q = P.map(p => R.pt(p[0], p[1])), A = [];
    if (Q.length === 1) return { A: [Q[0]], L: [0], T: 0 };
    for (let i = 0; i < Q.length - 1; i++) {
      const p0 = Q[Math.max(0, i - 1)], p1 = Q[i], p2 = Q[i + 1], p3 = Q[Math.min(Q.length - 1, i + 2)];
      for (let j = 0; j < 10; j++) { const t = j / 10, t2 = t * t, t3 = t2 * t; A.push([0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3))); }
    }
    A.push(Q[Q.length - 1]);
    const L = [0]; for (let i = 1; i < A.length; i++) L.push(L[i - 1] + Math.hypot(A[i][0] - A[i - 1][0], A[i][1] - A[i - 1][1]));
    return { A, L, T: L[L.length - 1] };
  }
  function naCurva(C, f) {
    if (C.A.length === 1) return [C.A[0][0], C.A[0][1], 0];
    const s = cl(f, 0, 1) * C.T; let i = 1; while (i < C.L.length - 1 && C.L[i] < s) i++;
    const u = (s - C.L[i - 1]) / ((C.L[i] - C.L[i - 1]) || 1), a = C.A[i - 1], b = C.A[i];
    return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), Math.atan2(b[1] - a[1], b[0] - a[0])];
  }
  function trilha(X, C, f, cor) {
    if (C.A.length < 2) return;
    X.save(); X.lineCap = 'round'; X.setLineDash([2, 6]); X.lineWidth = 1.6;
    X.strokeStyle = rgba(cor, .3); X.beginPath(); C.A.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1])); X.stroke();
    const s = f * C.T; X.strokeStyle = rgba(cor, .85); X.lineWidth = 2; X.beginPath(); let st = false;
    for (let i = 0; i < C.A.length && C.L[i] <= s; i++) { st ? X.lineTo(C.A[i][0], C.A[i][1]) : X.moveTo(C.A[i][0], C.A[i][1]); st = true; }
    if (st) { const p = naCurva(C, f); X.lineTo(p[0], p[1]); X.stroke(); } X.restore();
  }
  // borda suave da figura (o fundo do palco engole o retângulo)
  function feather(R, X) {
    const f = Math.min(26, R.w * .05), bg = '15,22,38';
    X.save();
    [[R.x, 0, R.x + f, 0, R.x, R.y, f, R.h], [R.x + R.w, 0, R.x + R.w - f, 0, R.x + R.w - f, R.y, f, R.h], [0, R.y, 0, R.y + f, R.x, R.y, R.w, f], [0, R.y + R.h, 0, R.y + R.h - f, R.x, R.y + R.h - f, R.w, f]].forEach(q => {
      const g = X.createLinearGradient(q[0], q[1], q[2], q[3]); g.addColorStop(0, `rgba(${bg},1)`); g.addColorStop(1, `rgba(${bg},0)`); X.fillStyle = g; X.fillRect(q[4], q[5], q[6], q[7]);
    });
    X.restore();
  }

  // ---------- botões da viagem (HTML sobre o palco) ----------
  const ICO = { ant: '<path d="M14.5 6 8.5 12l6 6"/>', prox: '<path d="m9.5 6 6 6-6 6"/>', pausa: '<path d="M9 6v12M15 6v12"/>', play: '<path d="M8 5.5v13l10-6.5z"/>' };
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;
  let NAV = null, ATUAL = null, vivo = 0, sincK = '', navK = '';
  function montarNav() {
    if (NAV) return;
    const st = document.createElement('style'); st.id = PFX + '-css';
    st.textContent = `.${PFX}{position:absolute;left:0;top:0;z-index:2;display:flex;align-items:center;gap:6px}
.${PFX}[hidden]{display:none}
.${PFX} button{font:inherit;width:44px;height:44px;flex:none;display:grid;place-items:center;border-radius:10px;border:1px solid var(--line-strong,#5B6C99);background:rgba(19,26,43,.92);color:var(--txt,#E8EDF7);cursor:pointer;transition:background-color 90ms,border-color 90ms,color 90ms}
.${PFX} button:hover{background:var(--panel-2,#1B2440);border-color:var(--amber,#FFB347)}
.${PFX} button:active{transform:scale(.96)}
.${PFX} button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
.${PFX} button svg{width:22px;height:22px}
.${PFX} button[hidden]{display:none}
.${PFX} .et{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;padding:0 6px;line-height:1.2}
.${PFX} .et small{font-size:12px;color:var(--dim,#9DA9C4)}
.${PFX} .et b{font-size:15px;font-weight:600;color:var(--txt,#E8EDF7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(prefers-reduced-motion:reduce){.${PFX} button{transition:none}.${PFX} button:active{transform:none}}`;
    document.head.appendChild(st);
    NAV = document.createElement('div'); NAV.className = PFX; NAV.hidden = true; NAV.setAttribute('role', 'group');
    NAV.innerHTML = `<button type="button" data-a="ant" aria-label="Etapa anterior" title="Etapa anterior">${svg('ant')}</button>`
      + `<div class="et" aria-live="polite"><small></small><b></b></div>`
      + `<button type="button" data-a="pausa"${RED ? ' hidden' : ''}></button>`
      + `<button type="button" data-a="prox" aria-label="Próxima etapa" title="Próxima etapa">${svg('prox')}</button>`;
    NAV.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || !ATUAL || !ATUAL.S) return; const v = ATUAL.S.vg;
      if (b.dataset.a === 'ant') ATUAL.ir(v.e - 1, true);
      else if (b.dataset.a === 'prox') ATUAL.ir(v.e + 1, true);
      else { v.pausa = !v.pausa; sinc(); }
    });
    ENV.tela().appendChild(NAV);
    (function vigia() { if (NAV && !NAV.hidden && performance.now() - vivo > 180) { NAV.hidden = true; if (ENV.alto) ENV.alto(false); } requestAnimationFrame(vigia); })();
  }
  function sinc() {
    if (!NAV || !ATUAL || !ATUAL.S) return; const v = ATUAL.S.vg, ET = ATUAL.cfg.ET, k = ATUAL.cfg.K + '|' + v.e + '|' + v.pausa; if (k === sincK) return; sincK = k;
    NAV.setAttribute('aria-label', ATUAL.cfg.rotNav);
    NAV.querySelector('.et small').textContent = `Etapa ${v.e + 1} de ${ET.length}`;
    NAV.querySelector('.et b').textContent = ET[v.e].nome;
    const p = NAV.querySelector('[data-a="pausa"]'), tt = v.pausa ? 'Continuar a viagem' : 'Pausar a viagem';
    p.innerHTML = svg(v.pausa ? 'play' : 'pausa'); p.title = tt; p.setAttribute('aria-label', tt);
  }
  function posNav(x, y, w) { const k = [x, y, w].map(Math.round).join(); if (k === navK) return; navK = k; NAV.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`; NAV.style.width = Math.round(w) + 'px'; }

  // ---------- layout: painel à esquerda no palco largo; faixa embaixo no estreito ----------
  const largo = () => ENV.W() >= 900, estreito = () => ENV.W() < 700;
  const FAIXA = 132;
  const capH = () => ENV.capCanvas ? (estreito() ? 82 : 58) : (estreito() ? 116 : 76);   // legenda no canvas ou caixa de legenda HTML sobre o palco
  function caixa(W, H) {
    const ch = capH();
    if (W >= 900) return { x: 332, y: 14, w: W - 348, h: H - 28 - ch };
    const n = W < 700; return { x: n ? 6 : 24, y: 52, w: W - 2 * (n ? 6 : 24), h: H - 52 - FAIXA - 12 - ch };
  }
  // legenda desenhada no canvas (módulos sem caixa de legenda em HTML): aceita <b>
  function legendaCanvas(X, html) {
    const W = ENV.W(), H = ENV.H(), sz = estreito() ? 13 : 14, mw = Math.min(W - 24, 760), lh = sz * 1.38;
    const pal = []; let colar = false;   // [palavra, negrito, colada na anterior]
    html.replace(/<b>(.*?)<\/b>|([^<]+)|<[^>]+>/g, (m, b, t) => { const s = b != null ? b : t; if (s) s.split(/(\s+)/).forEach(w => { if (!w) return; if (!w.trim()) { colar = false; return; } pal.push([w, b != null, colar && pal.length > 0]); colar = true; }); return ''; });
    const lin = []; let cur = [], cw = 0;
    const larg = (w, b) => { X.font = `${b ? 700 : 500} ${sz}px ${FT}`; return X.measureText(w).width; }, esp = larg(' ', false);
    pal.forEach(p => { const w = larg(p[0], p[1]), g = cur.length && !p[2] ? esp : 0; if (cur.length && !p[2] && cw + g + w > mw) { lin.push([cur, cw]); cur = []; cw = 0; } const g2 = cur.length && !p[2] ? esp : 0; cw += g2 + w; cur.push([p[0], p[1], w, g2]); });
    if (cur.length) lin.push([cur, cw]);
    const bw = Math.max(...lin.map(l => l[1]), 10) + 28, bh = lin.length * lh + 14, y0 = H - capH() + (capH() - bh) / 2;
    X.save(); X.fillStyle = 'rgba(11,15,28,.8)'; X.beginPath(); X.roundRect(W / 2 - bw / 2, y0, bw, bh, 10); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
    X.textBaseline = 'middle'; X.textAlign = 'left';
    lin.forEach((l, i) => { let x = W / 2 - l[1] / 2; const y = y0 + 7 + lh * (i + .5); l[0].forEach(p => { x += p[3]; X.font = `${p[1] ? 700 : 500} ${sz}px ${FT}`; X.fillStyle = p[1] ? AMB : TXT; X.fillText(p[0], x, y); x += p[2]; }); });
    X.restore();
  }

  // =====================================================================================
  // motor de uma viagem
  // cfg: K, pref, nome, mask, vistas, hs, VAI, ET [{ id, nome, vista, dur, cap }], cor, rotNav, altMed,
  //      desenha(X, R, cx) (camada sobre a figura), medidor(X, x, y, w, comp, cx), alvo(e, u), aoAbrir(S)
  // =====================================================================================
  function viagem(cfg) {
    const c3 = ENV.SC[cfg.K]; if (!c3) return;
    const ET = cfg.ET, NE = ET.length;
    const ctl = { cfg, S: null, FIG: null };
    let ultAb = null, ultV = null, Rfig = null;
    const novo = () => ({ e: 0, u: RED ? 1 : 0, hold: 0, pausa: false, mv: cfg.alvo(0, RED ? 1 : 0) });
    ctl.ir = function (e, troca) {
      const v = ctl.S.vg; v.e = (e + NE) % NE; v.u = RED ? 1 : 0; v.hold = 0;
      if (RED) v.mv = cfg.alvo(v.e, 1);
      if (troca && ctl.FIG && ctl.FIG.vistaAtual !== ET[v.e].vista) { ctl.FIG.mostrar(ET[v.e].vista); }
      if (troca && ctl.FIG) ultV = ctl.FIG.vistaAtual;
      sinc();
    };
    function avancar(S, dt) {
      const v = S.vg, et = ET[v.e];
      if (RED || v.pausa || !dt) return;
      if (v.u < 1) { v.u = Math.min(1, v.u + dt / et.dur); return; }
      v.hold += dt;
      if (v.e < NE - 1) { if (v.hold > 1.6) ctl.ir(v.e + 1, true); }
      else if (v.hold > 3.5) ctl.ir(0, true);
    }
    function estado(c) { const S = ENV.S(c.args, c3); if (!S) return null; if (!S.vg) S.vg = novo(); return S; }
    function sobre(R, X, t, c) {
      const S = estado(c); if (!S) return; ctl.S = S; ATUAL = ctl; vivo = performance.now();
      if (!ctl.FIG) ctl.FIG = c3.figura;
      const FIG = ctl.FIG, v = S.vg;
      if (!cfg.mask) feather(R, X);
      if (ultV == null) { ultV = R.vista; if (R.vista !== ET[v.e].vista) { FIG.mostrar(ET[v.e].vista); ultV = ET[v.e].vista; } }
      else if (R.vista !== ultV) {   // o aluno trocou de vista: a viagem pula para a primeira etapa daquela vista
        ultV = R.vista;
        if (R.vista !== ET[v.e].vista) { let k = -1; for (let i = 0; i < NE && k < 0; i++) if (ET[i].vista === R.vista) k = i; if (k >= 0) ctl.ir(k, false); }
      }
      // tocar num ponto leva a viagem até a etapa dele
      const ab = FIG.aberto ? FIG.aberto.id : null;
      if (ab !== ultAb) { ultAb = ab; if (ab && cfg.VAI[ab] != null && cfg.VAI[ab] !== v.e) ctl.ir(cfg.VAI[ab], false); }
      avancar(S, ENV.dt(S, t));
      const alvo = cfg.alvo(v.e, v.u); v.mv = RED ? alvo : v.mv + (alvo - v.mv) * Math.min(1, (ENV.dt(S, t, true) || 0) * 3);
      Rfig = R;
      const et = ET[v.e], u = RED ? 1 : v.u;
      const cx = { v, et, e: v.e, u, uu: RED ? 1 : eIO(v.u), tt: RED ? 0 : t, S, R, mesma: R.vista === et.vista, nar: estreito() };
      X.save(); try { cfg.desenha(X, R, cx); } catch (e) { console.error(e); } X.restore();
    }
    function fora(X, t, c) {
      const S = estado(c); if (!S || !Rfig) return; montarNav(); ATUAL = ctl; ctl.S = S; sinc(); NAV.hidden = false; if (ENV.alto) ENV.alto(true);
      const v = S.vg, et = ET[v.e], W = ENV.W(), H = ENV.H();
      const cx = { v, et, e: v.e, u: RED ? 1 : v.u, tt: RED ? 0 : t, S };
      if (largo()) {
        const x0 = 16, y0 = 60, w = 300, h = 76 + cfg.altMed + 34;
        X.fillStyle = 'rgba(11,15,28,.78)'; X.beginPath(); X.roundRect(x0, y0, w, h, 14); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
        posNav(x0 + 10, y0 + 10, w - 20);
        const px = x0 + 18, pw = w - 36;
        X.save(); try { cfg.medidor(X, px, y0 + 70, pw, false, cx); } catch (e) { console.error(e); } X.restore();
        // etapas como contas de um colar: feitas, atual e por vir
        const dy = y0 + h - 20, gap = pw / (NE - 1);
        X.strokeStyle = 'rgba(255,255,255,.14)'; X.lineWidth = 2; X.beginPath(); X.moveTo(px, dy); X.lineTo(px + pw, dy); X.stroke();
        X.strokeStyle = rgba(cfg.cor, .8); X.beginPath(); X.moveTo(px, dy); X.lineTo(px + Math.min(pw, gap * (v.e + (v.e < NE - 1 ? (RED ? 0 : eIO(v.u)) : 0))), dy); X.stroke();
        for (let i = 0; i < NE; i++) { X.beginPath(); X.arc(px + i * gap, dy, i === v.e ? 6 : 4, 0, TAU); X.fillStyle = i <= v.e ? cfg.cor : '#2A3352'; X.fill(); if (i === v.e) { X.strokeStyle = TXT; X.lineWidth = 1.5; X.stroke(); } }
      } else {
        const x0 = estreito() ? 6 : 24, w = W - 2 * x0, y0 = H - capH() - FAIXA - 4;
        X.fillStyle = 'rgba(11,15,28,.8)'; X.beginPath(); X.roundRect(x0, y0, w, FAIXA, 12); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
        posNav(x0 + 6, y0 + 6, w - 12);
        X.save(); try { cfg.medidor(X, x0 + 12, y0 + 62, w - 24, true, cx); } catch (e) { console.error(e); } X.restore();
      }
      if (ENV.capCanvas) legendaCanvas(X, et.cap); else ENV.cap(et.cap);
    }

    // ---------- registro: figura padrão, cena antiga atrás do botão ----------
    const amb = {
      SC: ENV.SC, X: ENV.X, W: ENV.W, H: ENV.H, nar: estreito, tela: ENV.tela(),
      t: ENV.t, plano: () => {}, rot3d: ENV.rot, dica3d: ENV.rot === 'Ver em 3D' ? 'Arraste para girar o modelo' : '',
      esconder: ENV.esconder, esconderFig: []
    };
    LAB_FIGALT.cena(amb, cfg.K, {
      pref: cfg.pref, nome: cfg.nome, mask: cfg.mask || false, vistas: cfg.vistas, hs: cfg.hs,
      manter: (W, H) => caixa(W, H), sobre, fora
    });
    const i1 = c3.init;
    c3.init = function (S) { if (i1) i1.call(this, S); if (S && typeof S === 'object') { S.vg = novo(); if (cfg.aoAbrir) cfg.aoAbrir(S); } sincK = ''; ultAb = null; ultV = null; };
    return ctl;
  }

  // =====================================================================================
  // ESPECIAÇÃO ALOPÁTRICA no Grande Cânion
  // =====================================================================================
  const COR = '#9FE3F5', TOM0 = '#9FE3F5', AZ = '#5B8CFF', LA = '#FF9A3C', RIO = '#8FD8FF', XV = '#F0605D';
  const ESQ = [[6, 39], [10, 45], [15.5, 48], [22, 52], [28, 47.5], [12, 55], [4, 50], [18, 42.5]];
  const DIR = [[72, 44], [78, 46.5], [86, 45], [92, 41], [95, 48], [84, 52], [90, 56], [75, 51]];
  const PONTE = [[24, 37], [33, 40], [42, 45], [50, 47], [58, 46], [67, 42.5], [78, 38.5]];
  const DIF = [[.03, .05], [.05, .1], [.1, .16], [.16, .74], [.74, .86]];

  const ET = [
    { id: 'pop', nome: 'Uma população', vista: 'a', dur: 7, P: PONTE,
      cap: 'No começo há <b>uma só população</b> de esquilos. O vale ainda é raso: eles atravessam, cruzam entre si e os genes circulam pelo grupo todo (<b>fluxo gênico</b>).' },
    { id: 'rio', nome: 'O rio escava', vista: 'a', dur: 7, P: [[53.5, 50], [51, 56], [48.5, 63], [46.5, 72], [48, 82], [49.5, 93]],
      cap: 'Ao longo de milhões de anos, o <b>rio</b> escava o vale e o <b>cânion</b> fica fundo e largo. Para um esquilo pequeno de solo, ele vira uma <b>barreira geográfica</b>.' },
    { id: 'fluxo', nome: 'Fluxo parado', vista: 'a', dur: 6, P: PONTE.slice(0, 3),
      cap: 'Os dois grupos não se encontram mais: o <b>fluxo gênico para</b>. Cada lado vira uma população isolada, com seu próprio conjunto de genes.' },
    { id: 'muda', nome: 'Cada lado muda', vista: 'a', dur: 10,
      cap: 'Em cada lado surgem <b>mutações</b> diferentes, a <b>seleção natural</b> favorece o que serve naquele ambiente e a <b>deriva genética</b> muda as frequências ao acaso. As diferenças se acumulam.' },
    { id: 'enc', nome: 'Reencontro', vista: 'a', dur: 8,
      cap: 'Se os grupos voltarem a se encontrar, já <b>não cruzam</b> ou não deixam filhotes férteis: há <b>isolamento reprodutivo</b>. São duas espécies, como o esquilo-antílope de Harris e o de cauda branca.' }
  ];
  const HS = [
    { id: 'pla', c: TOM0, t: 'Planalto dos dois lados', d: 'Os dois lados têm ambientes parecidos. Quando o vale era raso, os esquilos iam e vinham e formavam uma população só.', em: { a: [9, 50] }, z: 2.2 },
    { id: 'rio', c: RIO, t: 'Rio no fundo', d: 'O rio cava o vale aos poucos. Esquilos pequenos de solo não atravessam o cânion. A barreira vale para cada espécie: para uma ave, o mesmo cânion não separaria nada.', em: { a: [47, 72] }, z: 2.4 },
    { id: 'can', c: '#F7C13B', t: 'Barreira geográfica', d: 'O cânion separa as populações e o fluxo gênico para. Isolamento geográfico é o primeiro passo da especiação alopátrica.', em: { a: [42, 56] }, z: 2 },
    { id: 'esq', c: AZ, t: 'População de um lado', d: 'No lado sul do Grande Cânion vive o esquilo-antílope de Harris. Isolado do outro grupo, ele acumula mutações e passa por seleção própria.', em: { a: [22, 30] }, z: 2.6 },
    { id: 'dir', c: LA, t: 'População do outro lado', d: 'No lado norte vive o esquilo-antílope de cauda branca. Sem cruzar com o grupo do outro lado, segue mudando por conta própria.', em: { a: [80, 29] }, z: 2.6 },
    { id: 'esp', c: '#A9C54A', t: 'Duas espécies', d: 'Ficar diferente por fora não basta. Se os grupos se encontram e não cruzam, ou geram filhotes estéreis, há isolamento reprodutivo: são espécies diferentes.', em: { a: [50, 24] }, z: 2 }
  ];
  const VAI = { pla: 0, rio: 1, can: 2, esq: 3, dir: 3, esp: 4 };
  const tons = (e, u) => { const k = e < 3 ? 0 : e === 3 ? sst(.05, .95, u) : 1; return [mixC(TOM0, AZ, k), mixC(TOM0, LA, k)]; };

  function bicho(X, x, y, r, cor, a) { X.save(); X.globalAlpha *= cl(a, 0, 1); X.beginPath(); X.arc(x, y, r, 0, TAU); X.fillStyle = cor; X.fill(); X.strokeStyle = 'rgba(11,15,28,.75)'; X.lineWidth = 1.2; X.stroke(); X.restore(); }
  function xis(X, x, y, s, a) { X.save(); X.globalAlpha *= cl(a, 0, 1); X.strokeStyle = XV; X.lineWidth = 3; X.lineCap = 'round'; X.beginPath(); X.moveTo(x - s, y - s); X.lineTo(x + s, y + s); X.moveTo(x + s, y - s); X.lineTo(x - s, y + s); X.stroke(); X.restore(); }

  function desenha(X, R, cx) {
    const { e, u, uu, tt, et } = cx, P = (x, y) => R.pt(x, y), rb = cl(R.s * 1.1, 4, 8);
    const [cE, cD] = tons(e, u);
    // as duas populações, com um leve vaivém
    ESQ.forEach((q, i) => { const p = P(q[0], q[1]); bicho(X, p[0] + Math.sin(tt * .9 + i) * rb * .5, p[1], rb, cE, .95); });
    DIR.forEach((q, i) => { const p = P(q[0], q[1]); bicho(X, p[0] + Math.sin(tt * .8 + i * 1.3) * rb * .5, p[1], rb, cD, .95); });
    if (!cx.mesma) return;
    if (e === 0 || e === 1) {
      // indivíduos que atravessam: cada vez menos enquanto o cânion se aprofunda
      const C = curva(R, PONTE), n = e === 0 ? 6 : Math.round(lerp(6, 0, sst(.1, .9, u)));
      for (let i = 0; i < n; i++) { const k = RED ? (i + .5) / 6 : fr(tt * .09 + i / 6), f = i % 2 ? 1 - k : k, p = naCurva(C, f); bicho(X, p[0], p[1] - Math.sin(f * PI) * R.s * 2, rb * .85, TOM0, Math.min(1, Math.sin(f * PI) * 2.2)); }
    }
    if (e === 0) {
      const C = curva(R, PONTE), p = naCurva(C, uu); trilha(X, C, uu, COR);
      brilho(X, p[0], p[1], rb * 5, COR, .6); bicho(X, p[0], p[1], rb * 1.2, TOM0, 1);
      pastilha(X, p[0] + 14, p[1] - 24, 'fluxo gênico livre', COR);
    } else if (e === 1) {
      const C = curva(R, et.P), p = naCurva(C, uu);
      X.save(); X.lineCap = 'round'; X.strokeStyle = rgba(RIO, .25 + .2 * Math.sin(tt * 2)); X.lineWidth = Math.max(3, R.s * 1.6); X.beginPath(); C.A.forEach((q, i) => i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1])); X.stroke(); X.restore();
      trilha(X, C, uu, RIO); brilho(X, p[0], p[1], rb * 5, RIO, .7); dot(X, p[0], p[1], rb * .8, '#E6F7FF');
      const b = P(42, 56); pastilha(X, b[0] - 20, b[1] - 10, u < .5 ? 'o rio escava o vale' : 'barreira geográfica', RIO, { c: 1 });
    } else if (e === 2) {
      const C = curva(R, et.P), k = sst(0, .55, u), p = naCurva(C, k), volta = sst(.6, 1, u);
      trilha(X, C, k, COR);
      bicho(X, lerp(p[0], P(24, 37)[0], volta), lerp(p[1], P(24, 37)[1], volta), rb * 1.2, cE, 1);
      const m = P(50, 44); X.save(); X.setLineDash([5, 6]); X.strokeStyle = rgba(XV, .8); X.lineWidth = 2.2; const a = P(30, 39), b = P(72, 40); X.beginPath(); X.moveTo(a[0], a[1]); X.quadraticCurveTo(m[0], m[1] - R.s * 14, b[0], b[1]); X.stroke(); X.restore();
      xis(X, m[0], m[1] - R.s * 7, R.s * 2.2, sst(.3, .5, u));
      pastilha(X, m[0], m[1] - R.s * 12.5, 'fluxo gênico parado', XV, { c: 1, al: sst(.3, .5, u) });
    } else if (e === 3) {
      // faíscas de mudança em cada população
      const lad = [[ESQ, cE, AZ], [DIR, cD, LA]], ROT = ['mutação', 'seleção natural', 'deriva genética'], j = RED ? 0 : Math.floor(tt / 1.6) % 3;
      lad.forEach(([L, cor, cf], s) => {
        const q = L[(Math.floor((RED ? 1 : tt) / .8) + s * 3) % L.length], p = P(q[0], q[1]), k = RED ? .4 : fr(tt / .8);
        anel(X, p[0], p[1], rb * (1.4 + 3 * k), cf, (1 - k) * .9, 2); brilho(X, p[0], p[1], rb * 4, cf, .4 * (1 - k));
        const c0 = P(s ? 84 : 15, s ? 61 : 61); pastilha(X, c0[0], c0[1], ROT[(j + s) % 3], cf, { c: 1 });
      });
      const a = P(24, 37), b = P(80, 38); brilho(X, a[0], a[1], R.s * 12, AZ, .25 * sst(0, .6, u)); brilho(X, b[0], b[1], R.s * 12, LA, .25 * sst(0, .6, u));
    } else if (e === 4) {
      const m = P(50, 36), a0 = P(26, 38), b0 = P(76, 39), k = sst(0, .45, u), afasta = sst(.6, .9, u);
      const pa = [lerp(a0[0], m[0] - R.s * 3, k) - afasta * R.s * 6, lerp(a0[1], m[1], k)], pb = [lerp(b0[0], m[0] + R.s * 3, k) + afasta * R.s * 6, lerp(b0[1], m[1], k)];
      X.save(); X.setLineDash([2, 6]); X.strokeStyle = 'rgba(232,237,247,.5)'; X.lineWidth = 1.6; X.beginPath(); X.moveTo(a0[0], a0[1]); X.lineTo(m[0], m[1]); X.lineTo(b0[0], b0[1]); X.stroke(); X.restore();
      brilho(X, pa[0], pa[1], rb * 4, AZ, .6); brilho(X, pb[0], pb[1], rb * 4, LA, .6);
      bicho(X, pa[0], pa[1], rb * 1.3, cE, 1); bicho(X, pb[0], pb[1], rb * 1.3, cD, 1);
      const kx = sst(.42, .55, u); xis(X, m[0], m[1], R.s * 2.2, kx);
      pastilha(X, m[0], m[1] + R.s * 6, u < .5 ? 'reencontro' : 'não cruzam: duas espécies', u < .5 ? TXT : XV, { c: 1 });
    }
  }

  function medidor(X, x, y, w, comp, cx) {
    const d = cx.v.mv, e = cx.e, [cE, cD] = tons(e, cx.u), LIM = .6;
    const nome = d < .12 ? 'quase nenhuma' : d < .35 ? 'pequena' : d < LIM ? 'crescendo' : 'grande';
    const fluxo = ['livre', 'diminuindo', 'parado', 'parado', 'não volta'][e], cruz = e < 2 ? 'sim' : e < 4 ? 'ainda poderiam' : 'não, ou filhote estéril';
    const barra = (yy, ww, rot) => {
      const g = X.createLinearGradient(x, 0, x + ww, 0); g.addColorStop(0, '#3E6F8F'); g.addColorStop(.6, '#B88A3A'); g.addColorStop(1, '#C8503F');
      X.fillStyle = 'rgba(91,108,153,.3)'; X.beginPath(); X.roundRect(x, yy, ww, 10, 5); X.fill();
      X.save(); X.beginPath(); X.roundRect(x, yy, Math.max(10, ww * d), 10, 5); X.clip(); X.fillStyle = g; X.fillRect(x, yy, ww, 10); X.restore();
      const lx = x + ww * LIM; X.fillStyle = 'rgba(232,237,247,.75)'; X.fillRect(lx - .5, yy - 4, 1, 18);
      if (rot) txt(X, 'isolamento reprodutivo', lx, yy + 24, { s: 11, c: DIM, w: 500, a: 'center' });
      const nx = x + ww * d; X.beginPath(); X.moveTo(nx, yy - 1); X.lineTo(nx - 6, yy - 8); X.lineTo(nx + 6, yy - 8); X.closePath(); X.fillStyle = TXT; X.fill();
    };
    if (!comp) {
      txt(X, 'Diferença genética', x, y + 8, { s: 14 }); txt(X, nome, x + w, y + 8, { s: 12, c: d < LIM ? DIM : '#FF9A8A', a: 'right', w: 500 });
      barra(y + 30, w, true);
      txt(X, 'escala ilustrativa', x, y + 68, { s: 11, c: DIM, w: 500 });
      sep(X, x, y + 82, w);
      txt(X, 'Fluxo gênico', x, y + 100, { s: 13 }); txt(X, fluxo, x + w, y + 100, { s: 12, c: e < 1 ? COR : XV, a: 'right', w: 500 });
      txt(X, 'Cruzam entre si', x, y + 124, { s: 13 }); txt(X, cruz, x + w, y + 124, { s: 12, c: e < 4 ? COR : XV, a: 'right', w: 500 });
      sep(X, x, y + 142, w);
      [[cE, 'Lado sul', e < 3 ? 'mesmo conjunto de genes' : 'esquilo de Harris'], [cD, 'Lado norte', e < 3 ? 'mesmo conjunto de genes' : 'esquilo de cauda branca']].forEach(([cor, a, b], i) => {
        const yy = y + 162 + i * 34; for (let k = 0; k < 3; k++) bicho(X, x + 6 + k * 9, yy + 3, 5, cor, 1); txt(X, a, x + 36, yy - 4, { s: 13 }); txt(X, b, x + 36, yy + 11, { s: 12, c: DIM, w: 500 });
      });
    } else {
      txt(X, 'Diferença genética: ' + nome, x, y + 4, { s: 12 });
      barra(y + 18, w, false);
      txt(X, 'fluxo gênico ' + fluxo, x, y + 46, { s: 12, c: e < 1 ? COR : XV, w: 500 });
      for (let k = 0; k < 3; k++) { bicho(X, x + w - 52 + k * 8, y + 46, 4.5, cE, 1); bicho(X, x + w - 20 + k * 8, y + 46, 4.5, cD, 1); }
    }
  }

  viagem({
    K: 'especiacao/modos', pref: 'evolucao', mask: false, cor: COR, altMed: 228,
    nome: 'Especiação alopátrica no Grande Cânion', rotNav: 'Viagem da especiação alopátrica: etapas',
    vistas: [['a', 'especiacao-modos-a', 'Cânion como barreira', 'Dois esquilos-antílope em lados opostos de um cânion com um rio no fundo']],
    hs: HS, VAI, ET, desenha, medidor, alvo: (e, u) => lerp(DIF[e][0], DIF[e][1], e === 3 ? sst(.05, .95, u) : u)
  });
})();
