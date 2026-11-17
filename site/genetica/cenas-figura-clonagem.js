/* LAB Genética: "Clonagem e células-tronco" (biotec/clonagem) como a viagem da Dolly sobre figuras de IA realistas,
   no padrão de anatomia/cenas-figura-digestorio.js (Martin). Substitui o bloco simples desta rota em cenas-figura.js.
   Nenhuma figura nova: vista A (ovelhas Finn Dorset e Scottish Blackface) e vista B (transferência nuclear ao microscópio),
   as duas que a rota já usava; caminhos e pontos conferidos sobre cada imagem.
   Viagem em 7 etapas: célula da glândula mamária da doadora; óvulo de outra ovelha (vista A); núcleo do óvulo retirado;
   fusão por choque elétrico; embrião (vista B); útero da barriga de aluguel; Dolly nasce (vista A).
   O medidor do painel mostra de quem é o DNA do núcleo e o das mitocôndrias em cada etapa.
   Tocar num ponto leva a viagem até a etapa dele; trocar de vista leva à primeira etapa daquela vista.
   O desenho antigo segue atrás de "Ver esquema" (LAB_FIGALT, figura-alterna.js). Enquanto a figura está na tela o palco
   fica mais alto, para caber o painel e a legenda. Com prefers-reduced-motion nada anda sozinho: etapas por botão.
   Carregar depois de cenas-figura.js e antes do script inline do index. Texto na tela: sem "!", sem setas ou pontos como separador. */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const PFX = 'cl-nav';
  let KK = null, altoOn = null;
  const ENV = {
    SC: {}, X: () => KK.X, W: () => KK.W, H: () => KK.H, tela: () => document.getElementById('cv').parentNode, t: () => KK.T,
    S: (a, c3) => c3._S || (c3._S = {}),
    dt: (S, t, peek) => { if (peek) return S._dt || 0; const d = S._t == null ? 0 : Math.max(0, Math.min(.05, t - S._t)); S._t = t; S._dt = d; return d; },
    capCanvas: true, rot: 'Ver esquema', esconder: ['#ui', '#out'],
    alto(on) {   // palco mais alto enquanto a viagem está na tela
      if (on === altoOn) return; altoOn = on;
      if (!document.getElementById(PFX + '-alto')) { const st = document.createElement('style'); st.id = PFX + '-alto'; st.textContent = `#view.${PFX}-alto #cvw{height:clamp(540px,76vh,680px)}@media(max-width:699px){#view.${PFX}-alto #cvw{height:600px}}`; document.head.appendChild(st); }
      const v = document.getElementById('view'); if (v) v.classList.toggle(PFX + '-alto', on);
    }
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
  // CLONAGEM: a viagem da Dolly
  // =====================================================================================
  const COR = '#FFD43B', DOA = '#F3E6C8', OVU = '#FFA94D', ALU = '#8FD8FF', NUC_D = '#7FB4FF', ELE = '#BFE6FF';
  // célula com núcleo
  function celula(X, x, y, r, cito, nuc, a, semNucleo) {
    X.save(); X.globalAlpha *= cl(a == null ? 1 : a, 0, 1);
    const g = X.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.35, cito); g.addColorStop(1, rgba(cito, .75));
    X.beginPath(); X.arc(x, y, r, 0, TAU); X.fillStyle = g; X.fill(); X.strokeStyle = 'rgba(11,15,28,.6)'; X.lineWidth = 1.2; X.stroke();
    if (!semNucleo) { X.beginPath(); X.arc(x + r * .08, y - r * .05, r * .42, 0, TAU); X.fillStyle = nuc; X.fill(); X.strokeStyle = 'rgba(11,15,28,.5)'; X.stroke(); }
    X.restore();
  }
  function nucleo(X, x, y, r, cor, a) {
    X.save(); X.globalAlpha *= cl(a == null ? 1 : a, 0, 1);
    X.beginPath(); X.arc(x, y, r, 0, TAU); X.fillStyle = rgba(cor, .9); X.fill(); X.strokeStyle = 'rgba(11,15,28,.6)'; X.lineWidth = 1.2; X.stroke();
    X.strokeStyle = 'rgba(11,15,28,.55)'; X.lineWidth = Math.max(1, r * .18); X.lineCap = 'round';
    [[-.4, -.2, .1], [.1, -.4, 1.2], [.3, .2, .5], [-.2, .35, 2]].forEach(q => { X.beginPath(); X.moveTo(x + q[0] * r - Math.cos(q[2]) * r * .22, y + q[1] * r - Math.sin(q[2]) * r * .22); X.lineTo(x + q[0] * r + Math.cos(q[2]) * r * .22, y + q[1] * r + Math.sin(q[2]) * r * .22); X.stroke(); });
    X.restore();
  }
  function choque(X, x, y, r, t, a) {   // faíscas em volta do óvulo
    X.save(); X.globalAlpha *= cl(a, 0, 1); X.strokeStyle = ELE; X.lineWidth = 2; X.lineCap = 'round'; X.lineJoin = 'round';
    for (let i = 0; i < 6; i++) {
      const q = i / 6 * TAU + Math.floor(t * 6) * .7, r0 = r * 1.08, r1 = r * 1.35; X.beginPath();
      for (let k = 0; k <= 4; k++) { const rr = lerp(r0, r1, k / 4), dq = (k % 2 ? .06 : -.06); X.lineTo(x + Math.cos(q + dq) * rr, y + Math.sin(q + dq) * rr); }
      X.stroke();
    }
    X.restore();
  }

  const ET = [
    { id: 'doad', nome: 'Doadora', vista: 'a', dur: 6, P: [[24, 50], [27, 56], [29, 62]],
      cap: 'Tudo começa numa <b>célula da glândula mamária</b> de uma ovelha <b>Finn Dorset</b>, de cara branca. O <b>núcleo</b> dessa célula do corpo guarda todo o DNA nuclear dela.' },
    { id: 'ovul', nome: 'Óvulo', vista: 'a', dur: 6, P: [[52, 47], [55, 53], [57, 60]],
      cap: 'De outra ovelha, uma <b>Scottish Blackface</b> de cara preta, tira-se um <b>óvulo</b>. O citoplasma dele tem as <b>mitocôndrias</b>, com um DNA próprio.' },
    { id: 'enuc', nome: 'Núcleo retirado', vista: 'b', dur: 7, P: [[48, 46.5], [52, 48.5], [56, 49], [66, 48.9], [80, 48.8]],
      cap: 'Ao microscópio, a <b>pipeta de fixação</b> segura o óvulo e a <b>micropipeta</b> retira o núcleo dele. Fica um óvulo <b>sem núcleo</b>, só com o citoplasma e as mitocôndrias.' },
    { id: 'fus', nome: 'Fusão elétrica', vista: 'b', dur: 9, P: [[94, 48.8], [80, 48.8], [66, 48.9], [58, 49.2]],
      cap: 'A célula da mama é posta junto ao óvulo sem núcleo. Um <b>choque elétrico</b> funde as duas células e ativa o óvulo: agora ele tem o núcleo da doadora.' },
    { id: 'emb', nome: 'Embrião', vista: 'b', dur: 8,
      cap: 'A célula fundida se divide por mitoses e forma um <b>embrião</b>. Todas as células têm o <b>núcleo da doadora</b>; as <b>mitocôndrias</b> vieram do óvulo.' },
    { id: 'alug', nome: 'Barriga de aluguel', vista: 'a', dur: 7, P: [[72, 30], [68, 40], [62, 50], [58, 57]],
      cap: 'O embrião vai para o <b>útero</b> de uma terceira ovelha, outra Blackface: a <b>barriga de aluguel</b>. Ela gesta o filhote, mas não passa genes a ele.' },
    { id: 'dolly', nome: 'Dolly nasce', vista: 'a', dur: 8, P: [[58, 57], [53, 63], [47, 68]],
      cap: 'Em 1996 nasce <b>Dolly</b>, de cara branca como a doadora do núcleo, e não preta como as outras duas: o DNA do núcleo é da doadora. Só o <b>DNA mitocondrial</b> veio do óvulo.' }
  ];
  // de quem é o DNA em cada etapa: [doadora, óvulo] no núcleo e nas mitocôndrias, e o que está na viagem
  const COMP = (e, u) => {
    if (e === 0) return { n: [1, 0], m: [1, 0], o: 'célula da glândula mamária' };
    if (e === 1) return { n: [0, 1], m: [0, 1], o: 'óvulo da Blackface' };
    if (e === 2) { const k = sst(.35, .8, u); return { n: [0, 1 - k], m: [0, 1], o: k < .5 ? 'óvulo' : 'óvulo sem núcleo' }; }
    if (e === 3) { const k = sst(.7, .95, u); return { n: [k, 0], m: [0, 1], o: k < .5 ? 'célula da mama e óvulo' : 'célula fundida' }; }
    return { n: [1, 0], m: [0, 1], o: e === 4 ? 'embrião' : e === 5 ? 'embrião no útero' : 'Dolly' };
  };
  const HS = [
    { id: 'fin', c: DOA, t: 'Finn Dorset', d: 'Raça de cara branca. Dolly nasceu de um núcleo tirado de uma célula da glândula mamária de uma Finn Dorset.', em: { a: [27, 54] }, z: 2.2 },
    { id: 'cara', c: ALU, t: 'Cara branca', d: 'Dolly era branca como a doadora do núcleo, e não como a ovelha que gestou o embrião. A cor da cara segue o DNA do núcleo.', em: { a: [46, 68] }, z: 2.6 },
    { id: 'blk', c: OVU, t: 'Scottish Blackface', d: 'Raça de cara preta. Uma Blackface forneceu o óvulo, que teve o núcleo retirado, e outra serviu de barriga de aluguel.', em: { a: [60, 50] }, z: 2.4 },
    { id: 'fix', c: ALU, t: 'Pipeta de fixação', d: 'Segura o óvulo parado com leve sucção, para que a outra pipeta possa trabalhar.', em: { b: [20, 49] }, z: 2.6 },
    { id: 'ovu', c: OVU, t: 'Óvulo', d: 'Célula grande, de onde o núcleo próprio foi retirado. O citoplasma fica, com as mitocôndrias, e é ele que reprograma o núcleo doador.', em: { b: [42, 38] }, z: 2.4 },
    { id: 'mic', c: COR, t: 'Micropipeta', d: 'Agulha muito fina que retira o núcleo do óvulo e leva até ele a célula ou o núcleo da doadora.', em: { b: [80, 48.8] }, z: 2.6 },
    { id: 'nuc', c: NUC_D, t: 'Núcleo doador', d: 'Traz o material genético diploide da ovelha a ser clonada. O clone é geneticamente quase idêntico à doadora: só o DNA mitocondrial é diferente.', em: { b: [52.5, 49] }, z: 3.4 }
  ];
  const VAI = { fin: 0, cara: 6, blk: 1, fix: 2, ovu: 2, mic: 3, nuc: 3 };

  const OV = [42.8, 50];   // centro do óvulo na vista B
  function mitos(X, R, t, a) {   // mitocôndrias do óvulo (ficam no citoplasma)
    for (let i = 0; i < 14; i++) {
      const q = i * 2.4 + 1, d = Math.sqrt((i + .5) / 14) * .82, p = R.pt(OV[0] + Math.cos(q) * d * 11, OV[1] + Math.sin(q) * d * 17);
      X.save(); X.globalAlpha *= a; X.translate(p[0], p[1]); X.rotate(q + t * .2); X.beginPath(); X.ellipse(0, 0, R.s * .9, R.s * .45, 0, 0, TAU); X.fillStyle = OVU; X.fill(); X.strokeStyle = 'rgba(11,15,28,.6)'; X.lineWidth = 1; X.stroke(); X.restore();
    }
  }
  function desenha(X, R, cx) {
    const { e, u, uu, tt, et } = cx, P = (x, y) => R.pt(x, y), r0 = cl(R.s * 2, 7, 15);
    if (R.vista === 'a') {
      if (!cx.mesma) return;
      const C = curva(R, et.P), p = naCurva(C, uu); trilha(X, C, uu, COR);
      brilho(X, p[0], p[1], r0 * 2.8, e === 1 ? OVU : COR, .55);
      if (e === 0) { celula(X, p[0], p[1], r0, '#F6C6D6', NUC_D); pastilha(X, p[0] + r0 + 8, p[1] - r0 - 10, 'célula da glândula mamária', DOA); }
      else if (e === 1) { celula(X, p[0], p[1], r0 * 1.2, '#F8D2C2', OVU); pastilha(X, p[0] + r0 + 8, p[1] - r0 - 10, 'óvulo da Blackface', OVU); }
      else if (e === 5) {
        celula(X, p[0], p[1], r0, '#F8D2C2', NUC_D); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(q => dot(X, p[0] + q[0] * r0 * .35, p[1] + q[1] * r0 * .35, r0 * .2, NUC_D));
        pastilha(X, p[0] + r0 + 8, p[1] - r0 - 10, uu > .7 ? 'no útero da barriga de aluguel' : 'embrião', ALU);
      } else if (e === 6) {
        const f = P(46, 68.5), k = sst(.55, .9, u);
        brilho(X, f[0], f[1], R.s * 10, DOA, .5 * k); anel(X, f[0], f[1], R.s * (5 + 2 * Math.sin(tt * 2.4)), DOA, .8 * k, 2);
        if (u < .6) dot(X, p[0], p[1], r0 * .6, DOA);
        pastilha(X, f[0] + R.s * 6, f[1] - R.s * 9, k > .5 ? 'Dolly: cara branca como a doadora' : 'filhote nasce', DOA);
      }
      return;
    }
    // vista B
    if (!cx.mesma) return;
    const c = P(OV[0], OV[1]), rx = R.w * .125, ry = R.h * .195;
    if (e >= 2) mitos(X, R, tt, e === 2 ? .55 : .7);
    if (e === 2) {
      const C = curva(R, et.P), k = sst(.15, .9, u), p = naCurva(C, k); trilha(X, C, k, OVU);
      brilho(X, p[0], p[1], r0 * 2.4, OVU, .55); nucleo(X, p[0], p[1], r0 * .75, OVU, 1 - sst(.85, 1, u) * .6);
      pastilha(X, p[0] + 14, p[1] - 26, k < .4 ? 'núcleo do óvulo' : 'o núcleo é retirado', OVU);
    } else if (e === 3) {
      const C = curva(R, et.P), k = sst(0, .5, u), p = naCurva(C, k); trilha(X, C, k, NUC_D);
      if (u < .82) { brilho(X, p[0], p[1], r0 * 2.4, NUC_D, .5); celula(X, p[0], p[1], r0 * .8, '#F6C6D6', NUC_D, 1 - sst(.68, .82, u)); }
      const ke = sst(.5, .6, u) * (1 - sst(.8, .9, u));
      if (ke > 0) { X.save(); X.globalAlpha = ke * (RED ? .8 : .5 + .5 * Math.abs(Math.sin(tt * 9))); X.beginPath(); X.ellipse(c[0], c[1], rx * 1.12, ry * 1.12, 0, 0, TAU); X.strokeStyle = ELE; X.lineWidth = 3; X.stroke(); X.restore(); choque(X, c[0], c[1], Math.min(rx, ry), tt, ke); }
      const kn = sst(.72, .98, u);
      if (kn > 0) { const q = [lerp(p[0], c[0], kn), lerp(p[1], c[1], kn)]; brilho(X, q[0], q[1], r0 * 2.4, NUC_D, .5); nucleo(X, q[0], q[1], r0 * .8, NUC_D, 1); }
      pastilha(X, c[0] + rx * .6, c[1] - ry - 14, u < .5 ? 'célula da doadora chegando' : u < .82 ? 'choque elétrico' : 'núcleo da doadora no óvulo', u < .82 && u >= .5 ? ELE : NUC_D, { c: 1 });
    } else if (e === 4) {
      const n = u < .25 ? 1 : u < .5 ? 2 : u < .75 ? 4 : 8;
      X.save(); X.beginPath(); X.ellipse(c[0], c[1], rx, ry, 0, 0, TAU); X.clip();
      X.strokeStyle = 'rgba(191,230,255,.8)'; X.lineWidth = 2;
      if (n >= 2) { X.beginPath(); X.moveTo(c[0], c[1] - ry); X.lineTo(c[0], c[1] + ry); X.stroke(); }
      if (n >= 4) { X.beginPath(); X.moveTo(c[0] - rx, c[1]); X.lineTo(c[0] + rx, c[1]); X.stroke(); }
      if (n >= 8) { X.beginPath(); X.moveTo(c[0] - rx, c[1] - ry); X.lineTo(c[0] + rx, c[1] + ry); X.moveTo(c[0] + rx, c[1] - ry); X.lineTo(c[0] - rx, c[1] + ry); X.stroke(); }
      X.restore();
      const pos = n === 1 ? [[0, 0]] : n === 2 ? [[-.5, 0], [.5, 0]] : n === 4 ? [[-.5, -.5], [.5, -.5], [-.5, .5], [.5, .5]] : [[-.25, -.65], [.25, -.65], [.65, -.25], [.65, .25], [.25, .65], [-.25, .65], [-.65, .25], [-.65, -.25]];
      pos.forEach(q => { const x = c[0] + q[0] * rx, y = c[1] + q[1] * ry; brilho(X, x, y, r0 * 1.6, NUC_D, .35); nucleo(X, x, y, r0 * (n >= 8 ? .42 : n >= 4 ? .5 : .65), NUC_D, 1); });
      pastilha(X, c[0] + rx * .6, c[1] - ry - 14, n === 1 ? 'célula fundida' : `embrião: ${n} células`, NUC_D, { c: 1 });
    }
  }

  function barra(X, x, y, w, h, f, rot, comp) {   // f = [doadora, óvulo]
    X.fillStyle = 'rgba(91,108,153,.3)'; X.beginPath(); X.roundRect(x, y, w, h, h / 2); X.fill();
    let xx = x; [[f[0], DOA], [f[1], OVU]].forEach(([k, cor]) => { if (k > .01) { X.fillStyle = cor; X.beginPath(); X.roundRect(xx, y, Math.max(h, w * k), h, h / 2); X.fill(); xx += w * k; } });
    void rot; void comp;
  }
  const quem = f => f[0] > .5 ? ['da doadora', DOA] : f[1] > .5 ? ['do óvulo', OVU] : f[0] + f[1] < .1 ? ['sem núcleo', DIM] : ['mudando', DIM];
  function medidor(X, x, y, w, comp, cx) {
    const q = COMP(cx.e, cx.u), qn = quem(q.n), qm = quem(q.m);
    if (!comp) {
      txt(X, 'De quem é o DNA', x, y + 8, { s: 14 }); y += 14; txt(X, 'agora: ' + q.o, x, y + 14, { s: 12, c: COR, w: 500 }); y += 16;
      txt(X, 'DNA do núcleo', x, y + 36, { s: 12, c: DIM, w: 500 }); txt(X, qn[0], x + w, y + 36, { s: 12, c: qn[1], a: 'right' });
      barra(X, x, y + 48, w, 10, q.n);
      txt(X, 'DNA das mitocôndrias', x, y + 76, { s: 12, c: DIM, w: 500 }); txt(X, qm[0], x + w, y + 76, { s: 12, c: qm[1], a: 'right' });
      barra(X, x, y + 88, w, 10, q.m);
      sep(X, x, y + 112, w);
      [[DOA, 'Doadora do núcleo', 'Finn Dorset, cara branca'], [OVU, 'Doadora do óvulo', 'Blackface, cara preta'], [ALU, 'Barriga de aluguel', 'Blackface: gesta, sem passar genes']].forEach(([cor, a, b], i) => {
        const yy = y + 130 + i * 34; dot(X, x + 6, yy + 2, 5, cor); txt(X, a, x + 18, yy - 4, { s: 13 }); txt(X, b, x + 18, yy + 11, { s: 12, c: DIM, w: 500 });
      });
    } else {
      const lw = 92;
      txt(X, 'núcleo', x, y + 4, { s: 12, c: DIM, w: 500 }); barra(X, x + lw * .62, y, w - lw * .62 - lw - 4, 8, q.n); txt(X, qn[0], x + w, y + 4, { s: 12, c: qn[1], a: 'right' });
      txt(X, 'mitocôndrias', x, y + 26, { s: 12, c: DIM, w: 500 }); barra(X, x + lw * .9, y + 22, w - lw * .9 - lw - 4, 8, q.m); txt(X, qm[0], x + w, y + 26, { s: 12, c: qm[1], a: 'right' });
      txt(X, 'agora: ' + q.o, x, y + 50, { s: 12, c: COR, w: 500 });
    }
  }

  (window.GEN_3D = window.GEN_3D || {})['biotec/clonagem'] = (old, K) => {
    KK = K; ENV.SC = { 'biotec/clonagem': old };
    try {
      viagem({
        K: 'biotec/clonagem', pref: 'genetica', mask: { miolo: .94, borda: 1 }, cor: COR, altMed: 256,
        nome: 'Clonagem da ovelha Dolly', rotNav: 'Viagem da clonagem da Dolly: etapas',
        vistas: [
          ['a', 'biotec-clonagem-a', 'Ovelhas', 'Ovelha Finn Dorset branca, tipo Dolly, com ovelha Scottish Blackface de cara preta'],
          ['b', 'biotec-clonagem-b', 'Transferência nuclear', 'Transferência nuclear ao microscópio, com pipeta de fixação, óvulo e micropipeta']
        ],
        hs: HS, VAI, ET, desenha, medidor, alvo: () => 0
      });
    } catch (e) { console.error(e); }
    return old;
  };
})();
