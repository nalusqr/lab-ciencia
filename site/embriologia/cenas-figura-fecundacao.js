/* LAB Embriologia: "Fecundação" (humano/fecundacao) como viagem sobre figuras de IA realistas, no padrão de
   anatomia/cenas-figura-digestorio.js (Martin). Substitui o bloco simples desta rota em cenas-figura.js.
   Nenhuma figura nova: usa as duas figuras desta rota, a vista de perto da nidação (humano/nidacao) e a tuba aberta da
   Anatomia (anatomia-reprodutor-ciclo-v4b, por apelido em LAB_IMG). Caminhos e pontos conferidos sobre cada imagem.
   Viagem em 9 etapas: espermatozoides da vagina ao útero; capacitação na tuba até a ampola (vista Útero);
   reação acrossômica; fecundação com bloqueio da polispermia, fim da meiose II e pronúcleos (vista Ovócito);
   clivagem descendo a tuba, mórula e blastocisto (vista Tuba aberta); nidação e hCG (vista Endométrio).
   O medidor do painel conta o tempo (da relação ao dia 14 após a fecundação) e desenha a curva da hCG.
   Tocar num ponto leva a viagem até a etapa dele; trocar de vista leva à primeira etapa daquela vista.
   O 3D antigo segue atrás de "Ver em 3D" (LAB_FIGALT, figura-alterna.js). O botão "Sortear espermatozoide" troca X ou Y no zigoto.
   Com prefers-reduced-motion nada anda sozinho: etapas por botão. Usa os globais do motor (SC, X, W, H, cv, cap).
   Carregar depois de cenas-figura.js e antes de LAB_EMBRIO_iniciar(). Texto na tela: sem "!", sem setas ou pontos como separador. */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA || !SC['humano/fecundacao']) return;
  const PFX = 'fc-nav';
  const ENV = {
    SC, X: () => X, W: () => W, H: () => H, tela: () => cv.parentNode, t: a => a[0], S: a => a[1], dt: S => S.dt || 0,
    cap: h => cap(h), rot: 'Ver em 3D', esconder: ['.hud.onde', '.palco .ctl']
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
  // FECUNDAÇÃO E NIDAÇÃO: a viagem dos espermatozoides e do embrião
  // =====================================================================================
  const COR = '#FFD08A', ESP = '#EEF2FB', OVO = '#F2B6C6', PRO_M = '#8FD8FF', PRO_F = '#F2A3C0', ENZ = '#7FD1A8', HCG = '#F5D547', TRO = '#C9AEFF';

  // apelido: a figura da tuba aberta é da Anatomia (anatomia-reprodutor-ciclo-v4b); o alternador monta o nome como pref + '-' + vista,
  // e o nome com "tuba/../" faz o <script> cair no arquivo certo, enquanto o apelido abaixo devolve a mesma imagem.
  const LIMG = window.LAB_IMG = window.LAB_IMG || {};
  const TUBA = 'tuba/../anatomia-reprodutor-ciclo-v4b';
  if (!Object.getOwnPropertyDescriptor(LIMG, 'embriologia-' + TUBA)) Object.defineProperty(LIMG, 'embriologia-' + TUBA, { configurable: true, get: () => LIMG['anatomia-reprodutor-ciclo-v4b'] });

  // espermatozoide: cabeça oval e cauda ondulante, apontando para ang
  function esperm(X, x, y, ang, s, t, a) {
    X.save(); X.globalAlpha *= cl(a, 0, 1); X.translate(x, y); X.rotate(ang); X.lineCap = 'round';
    X.strokeStyle = rgba(ESP, .8); X.lineWidth = Math.max(1, s * .22); X.beginPath();
    for (let k = 0; k <= 12; k++) { const q = k / 12, w = Math.sin(q * 7 - t * 10) * s * .55 * q; k ? X.lineTo(-s * .8 - q * s * 6, w) : X.moveTo(-s * .8, 0); }
    X.stroke();
    X.beginPath(); X.ellipse(0, 0, s * 1.05, s * .62, 0, 0, TAU); X.fillStyle = ESP; X.fill(); X.strokeStyle = 'rgba(11,15,28,.55)'; X.lineWidth = 1; X.stroke();
    X.restore();
  }
  // embrião jovem: n = 1, 2, 4, 8, 16 (mórula) ou 'b' (blastocisto); zona de 0 a 1
  function embriao(X, x, y, r, n, zona, a) {
    X.save(); X.globalAlpha *= cl(a == null ? 1 : a, 0, 1);
    const cel = (cx, cy, rr) => { const g = X.createRadialGradient(cx - rr * .35, cy - rr * .35, rr * .1, cx, cy, rr); g.addColorStop(0, '#FFE6EE'); g.addColorStop(1, '#E59AB2'); X.beginPath(); X.arc(cx, cy, rr, 0, TAU); X.fillStyle = g; X.fill(); X.strokeStyle = 'rgba(120,50,80,.6)'; X.lineWidth = 1; X.stroke(); };
    if (n === 'b') {
      X.beginPath(); X.arc(x, y, r * .95, 0, TAU); X.fillStyle = 'rgba(207,224,255,.35)'; X.fill();
      for (let i = 0; i < 14; i++) { const q = i / 14 * TAU; cel(x + Math.cos(q) * r * .82, y + Math.sin(q) * r * .82, r * .2); }
      for (let i = 0; i < 5; i++) cel(x - r * .3 + (i % 3) * r * .3, y + r * .38 + Math.floor(i / 3) * r * .2 - r * .1, r * .2);
    } else if (n === 1) { cel(x, y, r * .8); dot(X, x, y, r * .22, 'rgba(150,60,110,.75)'); }
    else if (n === 2) { cel(x - r * .38, y, r * .44); cel(x + r * .38, y, r * .44); }
    else if (n === 4) { [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(p => cel(x + p[0] * r * .34, y + p[1] * r * .34, r * .38)); }
    else { for (let i = 0; i < 16; i++) { const q = i * 2.4, d = Math.sqrt((i + .5) / 16) * r * .6; cel(x + Math.cos(q) * d, y + Math.sin(q) * d, r * .25); } }
    if (zona > 0) { X.globalAlpha *= zona; X.beginPath(); X.arc(x, y, r * 1.08, 0, TAU); X.strokeStyle = 'rgba(232,240,255,.85)'; X.lineWidth = Math.max(1.5, r * .12); X.stroke(); }
    X.restore();
  }
  // hCG: dobra a cada cerca de 2,2 dias depois da nidação (escala ilustrativa)
  const hcg = d => d < 6.5 ? 0 : Math.pow(2, (d - 6.5) / 2.2) - 1, HMAX = hcg(16);
  const DIAS = [[-1, -.8], [-.8, -.12], [-.12, 0], [0, 1], [1, 3], [3, 4], [4, 6], [6, 10], [10, 14]];

  const ET = [
    { id: 'vag', nome: 'Vagina e útero', vista: 'a', dur: 6, quando: 'minutos após a relação',
      P: [[53.5, 90], [53.5, 82], [53.5, 74], [53.3, 66], [53, 57], [52.5, 48]],
      cap: 'Na relação, cerca de <b>200 a 600 milhões</b> de espermatozoides chegam à <b>vagina</b>. Eles nadam pelo colo e sobem pelo <b>útero</b>; a maioria fica pelo caminho.' },
    { id: 'tuba', nome: 'Capacitação', vista: 'a', dur: 8, quando: 'horas após a relação',
      P: [[52.5, 48], [50, 40], [45, 35], [39.5, 32.5], [35.5, 31], [32.5, 29.5], [30, 27], [28, 23.5]],
      cap: 'Na tuba uterina os espermatozoides passam pela <b>capacitação</b>, que leva cerca de 7 horas e os deixa aptos a fecundar. Só cerca de <b>200</b> chegam à <b>ampola</b>, onde está o ovócito liberado na ovulação.' },
    { id: 'acro', nome: 'Acrossomo', vista: 'b', dur: 6, quando: 'na ampola da tuba',
      cap: 'Ao tocar o ovócito, o <b>acrossomo</b> da cabeça do espermatozoide libera <b>enzimas</b> (reação acrossômica) que abrem caminho pela <b>corona radiata</b> e pela <b>zona pelúcida</b>.' },
    { id: 'fec', nome: 'Fecundação', vista: 'b', dur: 10, quando: 'dia 0, a fecundação',
      cap: 'Só um espermatozoide entra. A <b>zona pelúcida</b> muda e barra os outros (bloqueio da polispermia), o ovócito <b>termina a meiose II</b> e os dois núcleos se unem: surge o <b>zigoto</b>, com 46 cromossomos.' },
    { id: 'cliv', nome: 'Clivagem', vista: 'c', dur: 9, quando: 'dia 1 a 3',
      P: [[86, 27], [81, 23.5], [74, 23], [68, 27.5], [63.5, 32], [58.5, 35.5], [54, 38]],
      cap: 'O zigoto desce pela tuba, levado por cílios e contrações, e se divide por mitoses (<b>clivagem</b>): <b>2 células</b> por volta de 30 horas, depois 4 e 8. O embrião não cresce: as células ficam menores.' },
    { id: 'mor', nome: 'Mórula', vista: 'c', dur: 6, quando: 'dia 3',
      P: [[54, 38], [48, 40], [42.5, 40.5], [36.5, 40.2]],
      cap: 'Por volta do <b>3º dia</b> o embrião é uma <b>mórula</b>, uma bolinha de 12 a 32 células, e chega ao útero.' },
    { id: 'bla', nome: 'Blastocisto', vista: 'c', dur: 7, quando: 'dia 4 e 5',
      P: [[36.5, 40.2], [29, 40.8], [23, 43.5], [18.5, 48], [16, 52.5], [15.3, 55.5]],
      cap: 'No <b>4º e 5º dia</b> a mórula vira <b>blastocisto</b>: uma cavidade com líquido, o <b>trofoblasto</b> por fora e a <b>massa celular interna</b>, que formará o embrião. No 5º dia ele sai da zona pelúcida.' },
    { id: 'nid', nome: 'Nidação', vista: 'd', dur: 8, quando: 'dia 6 a 10',
      P: [[50, 22], [49.5, 40], [48, 54], [46.5, 66]],
      cap: 'Por volta do <b>6º ao 7º dia</b> o blastocisto gruda no <b>endométrio</b> e afunda nele: é a <b>nidação</b>. O <b>trofoblasto</b> invade o tecido da mãe; a implantação se completa por volta do 10º dia.' },
    { id: 'hcg', nome: 'hCG e teste', vista: 'd', dur: 9, quando: 'dia 10 em diante',
      cap: 'O trofoblasto produz <b>hCG</b>, que cai no sangue da mãe e mantém o <b>corpo-lúteo</b> fazendo progesterona: o endométrio fica e a <b>menstruação não vem</b>. É a hCG que o <b>teste de gravidez</b> detecta.' }
  ];
  const AGORA = (e, u, S) => [
    ['espermatozoides', 'centenas de milhões sobem pelo útero', 'esp'],
    ['espermatozoides', u < .55 ? 'capacitação: ficam aptos a fecundar' : 'só cerca de 200 chegam à ampola', 'esp'],
    ['ovócito secundário', 'parado na meiose II, com a corona', 1],
    u < .85 ? ['ovócito sendo fecundado', 'um espermatozoide entrou', 1] : ['zigoto', `2n = 46; o espermatozoide trouxe ${S.cromo || 'X'}: 46,X${S.cromo || 'X'}`, 1],
    [u < .45 ? 'zigoto' : u < .75 ? '2 células' : '4 células', 'mitoses sem crescer', u < .45 ? 1 : u < .75 ? 2 : 4],
    ['mórula', '12 a 32 células, chega ao útero', 16],
    ['blastocisto', 'trofoblasto e massa celular interna', 'b'],
    ['embrião implantando', 'o trofoblasto afunda no endométrio', 'b'],
    ['hCG no sangue da mãe', 'mantém o corpo-lúteo e a progesterona', 'h']
  ][e];

  const HS = [
    { id: 'vag', c: '#F28B8B', t: 'Vagina', d: 'Recebe o sêmen na relação. O meio ácido e o muco do colo eliminam muitos espermatozoides logo no começo.', em: { a: [53.5, 83] }, z: 2.4 },
    { id: 'colo', c: '#F2A3A3', t: 'Colo do útero', d: 'Passagem estreita entre a vagina e o útero. Perto da ovulação, o muco fica mais fino e deixa os espermatozoides passarem.', em: { a: [53.5, 71] }, z: 2.6 },
    { id: 'ute', c: '#F28B8B', t: 'Útero', d: 'Os espermatozoides sobem por ele até as tubas. É no endométrio, a camada interna, que o embrião vai se implantar.', em: { a: [53, 46] }, z: 2.2 },
    { id: 'tub', c: '#F2A3A3', t: 'Tuba uterina', d: 'Canal entre o útero e o ovário. É onde ocorre a fecundação e por onde o embrião desce até o útero. A laqueadura corta as tubas.', em: { a: [34, 30] }, z: 2.6 },
    { id: 'amp', c: OVO, t: 'Ampola com o ovócito', d: 'Parte mais larga da tuba, perto do ovário. A fecundação ocorre em geral aqui, e não no útero. O ovócito resiste cerca de 24 horas depois da ovulação.', em: { a: [23, 21] }, z: 3 },
    { id: 'ova', c: '#FFD9A0', t: 'Ovário', d: 'Libera o ovócito secundário na ovulação. O folículo que sobra vira o corpo-lúteo, que produz progesterona.', em: { a: [21, 45.5] }, z: 2.6 },
    { id: 'fim', c: '#F28B8B', t: 'Fímbrias', d: 'Franjas da tuba que recolhem o ovócito liberado pelo ovário.', em: { a: [8, 42] }, z: 2.8 },
    { id: 'cor', c: TRO, t: 'Corona radiata', d: 'Camada de células que envolve o ovócito. As enzimas do acrossomo abrem caminho entre elas.', em: { b: [12, 30] }, z: 2.6 },
    { id: 'acr', c: ENZ, t: 'Espermatozoide entrando', d: 'O acrossomo, na ponta da cabeça, libera enzimas que digerem a zona pelúcida: é a reação acrossômica. Só um espermatozoide entra no ovócito.', em: { b: [62, 36] }, z: 3 },
    { id: 'zp', c: PRO_M, t: 'Zona pelúcida', d: 'Envoltório de glicoproteínas. Quando um espermatozoide entra, ela muda e bloqueia a entrada de outros (bloqueio da polispermia).', em: { b: [73.5, 58] }, z: 2.6 },
    { id: 'nu', c: '#B08CFF', t: 'Núcleo do ovócito', d: 'Guarda os 23 cromossomos da mãe. A meiose II só termina depois que o espermatozoide entra; os dois pronúcleos então se unem no zigoto.', em: { b: [41, 58] }, z: 2.8 },
    { id: 'zig', c: OVO, t: 'Fecundação na ampola', d: 'O ovócito, cercado de espermatozoides, é fecundado na parte mais larga da tuba. Daqui o zigoto começa a descer.', em: { c: [86, 27] }, z: 3 },
    { id: 'c2', c: OVO, t: 'Duas células', d: 'Primeira divisão do zigoto, por mitose, por volta de 30 horas depois da fecundação. A zona pelúcida ainda envolve o embrião.', em: { c: [63.5, 32] }, z: 3 },
    { id: 'c4', c: OVO, t: 'Quatro células', d: 'As divisões seguem sem o embrião crescer: cada célula fica menor. Essas células são os blastômeros.', em: { c: [54, 38] }, z: 3 },
    { id: 'mor', c: OVO, t: 'Mórula', d: 'Bolinha maciça de 12 a 32 células, por volta do 3º dia. É mais ou menos quando o embrião chega ao útero.', em: { c: [42.5, 40.5] }, z: 3 },
    { id: 'bla', c: TRO, t: 'Blastocisto implantado', d: 'O blastocisto se prende à parede do útero e afunda no endométrio, por volta do 6º ao 7º dia.', em: { c: [15.3, 55.5] }, z: 3 },
    { id: 'cl', c: HCG, t: 'Corpo-lúteo', d: 'Restos do folículo que liberou o ovócito. Produz progesterona. Na gravidez, a hCG do embrião o mantém vivo; sem gravidez, ele degenera em cerca de 14 dias.', em: { c: [68, 77] }, z: 2.6 },
    { id: 'mci', c: OVO, t: 'Massa celular interna', d: 'Grupo de células que formará o embrião. É também chamada de embrioblasto.', em: { d: [49, 44] }, z: 3 },
    { id: 'tro', c: TRO, t: 'Trofoblasto', d: 'Camada externa do blastocisto. Invade o endométrio, forma a parte fetal da placenta e produz a hCG.', em: { d: [66, 18] }, z: 2.8 },
    { id: 'inv', c: TRO, t: 'Trofoblasto invadindo', d: 'Projeções do trofoblasto penetram o tecido da mãe e alcançam os vasos. A implantação se completa por volta do 10º dia.', em: { d: [47, 66] }, z: 3 },
    { id: 'end', c: '#F28B8B', t: 'Endométrio', d: 'Camada interna do útero, preparada pela progesterona. Recebe o embrião na nidação.', em: { d: [12, 40] }, z: 2.4 },
    { id: 'vas', c: '#FF6B6B', t: 'Vasos da mãe', d: 'A hCG do trofoblasto chega ao sangue por esses vasos, vai ao ovário e mantém o corpo-lúteo. Também passa para a urina.', em: { d: [31, 80] }, z: 2.6 }
  ];
  const VAI = { vag: 0, colo: 0, ute: 0, tub: 1, amp: 1, ova: 1, fim: 1, cor: 2, acr: 2, zp: 3, nu: 3, zig: 4, c2: 4, c4: 4, mor: 5, bla: 6, cl: 8, mci: 7, tro: 7, inv: 7, end: 7, vas: 8 };

  // caminhos fixos (em % da figura)
  const PRONUC = [[61.5, 37.5], [57, 43], [51, 50], [45, 56]];
  const HC1 = [[46.5, 64], [42, 71], [36, 77], [30, 81]], HC2 = [[49.5, 64.5], [56, 70], [63, 75], [69.5, 73]];

  function desenha(X, R, cx) {
    const { e, u, uu, tt, et, S } = cx, P = (x, y) => R.pt(x, y), s0 = cl(R.s * .8, 3, 7);
    if (R.vista === 'a') {
      if (!cx.mesma || e > 1) return;
      const C = curva(R, et.P); trilha(X, C, uu, COR);
      const n = e === 0 ? 22 : Math.round(lerp(18, 6, sst(.3, 1, u)));
      for (let i = n - 1; i >= 0; i--) {
        const f = uu - i * (e === 0 ? .028 : .022) * (1 + (i % 3) * .35); if (f < 0) continue;
        const p = naCurva(C, f), off = Math.sin(i * 2.3 + 1) * R.s * 1.7, nx = -Math.sin(p[2]), ny = Math.cos(p[2]);
        esperm(X, p[0] + nx * off, p[1] + ny * off, p[2] + Math.sin(tt * 3 + i) * .25, s0, tt + i * .7, i ? .85 : 1);
      }
      const p = naCurva(C, uu); brilho(X, p[0], p[1], s0 * 6, COR, .5);
      if (e === 1 && u > .55) { const o = P(23, 21), k = sst(.55, .8, u); brilho(X, o[0], o[1], R.s * 7, OVO, .45 * k); anel(X, o[0], o[1], R.s * (4 + 2 * fr(tt * .6)), OVO, k * (RED ? .6 : .8 * (1 - fr(tt * .6))), 2); }
      pastilha(X, p[0] + 16, p[1] - 18, e === 0 ? 'cerca de 300 milhões' : u < .55 ? 'capacitação' : 'cerca de 200 chegam', COR);
    } else if (R.vista === 'b') {
      if (!cx.mesma) return;
      const h = P(62.3, 35.8), cz = P(43.5, 67.5), rz = R.w * .33;
      if (e === 2) {
        // enzimas do acrossomo saindo da cabeça e abrindo a zona pelúcida
        brilho(X, h[0], h[1], R.s * 9, ENZ, .55 + .2 * Math.sin(tt * 4));
        const ang = Math.atan2(cz[1] - h[1], cz[0] - h[0]);
        for (let i = 0; i < 14; i++) {
          const k = RED ? (i + .5) / 14 : fr(tt * .45 + i / 14), a2 = ang + (i % 7 - 3) * .28, d = R.s * (1 + 7 * k) * sst(0, .25, u + .25);
          dot(X, h[0] + Math.cos(a2) * d, h[1] + Math.sin(a2) * d, Math.max(1.6, R.s * .45), ENZ, (1 - k) * .95);
        }
        pastilha(X, h[0] + 22, h[1] - 26, 'enzimas do acrossomo', ENZ);
        return;
      }
      if (e !== 3) return;
      const a0 = Math.atan2(h[1] - cz[1], h[0] - cz[0]), k1 = sst(0, .22, u);
      // a zona pelúcida muda a partir do ponto de entrada e barra os outros
      X.save(); X.lineCap = 'round'; X.strokeStyle = rgba(PRO_M, .75); X.lineWidth = Math.max(3, R.s * 1.3);
      X.beginPath(); X.arc(cz[0], cz[1], rz, a0 - PI * k1, a0 + PI * k1); X.stroke(); X.restore();
      if (u < .3) pastilha(X, h[0] + 22, h[1] - 26, 'a zona pelúcida muda', PRO_M, { al: 1 - sst(.24, .3, u) });
      // 2º corpúsculo polar: a meiose II termina
      const kp = sst(.22, .36, u), pc = [cz[0] + Math.cos(-2.35) * rz * .86, cz[1] + Math.sin(-2.35) * rz * .86];
      if (kp > 0) { dot(X, pc[0], pc[1], R.s * 1.6 * kp, '#FCE3EC', .95); anel(X, pc[0], pc[1], R.s * 1.6 * kp, 'rgba(120,50,80,.8)', kp, 1); }
      if (u > .22 && u < .48) pastilha(X, pc[0] + 14, pc[1] - 18, 'meiose II termina', OVO, { al: sst(.22, .28, u) * (1 - sst(.42, .48, u)) });
      // pronúcleos se aproximam e se unem
      const fem = P(41, 58), C = curva(R, PRONUC), kq = sst(.42, .85, u), pm = naCurva(C, kq), rp = cl(R.s * 2.2, 6, 16);
      if (u > .38) {
        trilha(X, C, kq, PRO_M);
        brilho(X, pm[0], pm[1], rp * 2.4, PRO_M, .55); dot(X, pm[0], pm[1], rp * .8, rgba(PRO_M, .85));
        anel(X, fem[0], fem[1], rp * (1.4 + .15 * Math.sin(tt * 3)), PRO_F, .9, 2);
        if (u < .85) pastilha(X, pm[0] + 18, pm[1] - 22, 'pronúcleos com n = 23 cada', PRO_M, { al: sst(.4, .46, u) });
      }
      if (u >= .85) {
        const k = sst(.85, .95, u); brilho(X, fem[0], fem[1], rp * 4, '#FFFFFF', .5 * k);
        pastilha(X, fem[0] + 26, fem[1] - 28, `zigoto 46,X${S.cromo || 'X'}`, OVO, { al: k });
      }
    } else if (R.vista === 'c') {
      if (e === 8) {   // a hCG chega ao ovário pelo sangue e mantém o corpo-lúteo
        const o = P(68, 77); brilho(X, o[0], o[1], R.s * 10, HCG, .45 + .15 * Math.sin(tt * 2.5));
        pastilha(X, o[0] + 20, o[1] - 34, 'corpo-lúteo mantido pela hCG', HCG);
      }
      if (!cx.mesma) return;
      const C = curva(R, et.P), p = naCurva(C, uu), r = cl(R.s * 2.4, 8, 18);
      trilha(X, C, uu, COR);
      let n, nome, zona = 1;
      if (e === 4) { n = u < .45 ? 1 : u < .75 ? 2 : 4; nome = n === 1 ? 'zigoto' : n + ' células'; }
      else if (e === 5) { n = 16; nome = 'mórula'; }
      else { n = 'b'; nome = u > .55 ? 'blastocisto sem a zona' : 'blastocisto'; zona = 1 - sst(.45, .6, u); }
      brilho(X, p[0], p[1], r * 2.6, COR, .55);
      embriao(X, p[0], p[1], r, n, zona);
      pastilha(X, p[0] + r + 8, p[1] - r - 12, nome, COR);
    } else if (R.vista === 'd') {
      if (!cx.mesma) return;
      if (e === 7) {
        const C = curva(R, et.P), p = naCurva(C, uu); trilha(X, C, uu, TRO);
        // pontas do trofoblasto entrando no tecido
        [[38, 58], [43, 62], [47, 66], [52, 63], [57, 61], [62, 57]].forEach((q, i) => { const w = P(q[0], q[1]), k = RED ? .6 : fr(tt * .5 + i * .17); anel(X, w[0], w[1], R.s * (1 + 3 * k), TRO, (1 - k) * .8 * sst(0, .3, u + .1), 2); });
        brilho(X, p[0], p[1], R.s * 7, TRO, .6); dot(X, p[0], p[1], R.s * .9, '#F4EEFF');
        pastilha(X, p[0] + 18, p[1] - 22, u < .5 ? 'o trofoblasto invade' : 'nidação', TRO);
      } else if (e === 8) {
        const src = P(48, 63); brilho(X, src[0], src[1], R.s * 8, HCG, .35 + .15 * Math.sin(tt * 2));
        [HC1, HC2].forEach((L, j) => {
          const C = curva(R, L); trilha(X, C, 1, HCG);
          for (let i = 0; i < 6; i++) { const k = RED ? (i + .5) / 6 : fr(tt * .3 + i / 6 + j * .08), q = naCurva(C, k); dot(X, q[0], q[1], Math.max(2.4, R.s * .6), HCG, Math.min(1, Math.sin(k * PI) * 1.6) * sst(0, .15, u + .05)); }
        });
        const q = P(30, 81); pastilha(X, q[0] + 14, q[1] - 26, 'hCG vai para o sangue', HCG);
      }
    }
  }

  function medidor(X, x, y, w, comp, cx) {
    const d = cx.v.mv, et = cx.et, ag = AGORA(cx.e, cx.u, cx.S);
    const xd = (x0, ww, dd) => x0 + ww * (dd < 0 ? .2 * (cl(dd, -1, 0) + 1) : .2 + .8 * cl(dd / 16, 0, 1));   // antes da fecundação a escala abre mais
    const linha = (x0, yy, ww, marcas) => {
      X.fillStyle = 'rgba(91,108,153,.35)'; X.beginPath(); X.roundRect(x0, yy, ww, 8, 4); X.fill();
      X.fillStyle = COR; X.beginPath(); X.roundRect(x0, yy, Math.max(8, xd(x0, ww, d) - x0), 8, 4); X.fill();
      if (marcas) [[-1, '', 'left'], [0, 'fecundação', 'left'], [7, 'nidação', 'center'], [14, 'dia 14', 'center']].forEach(([m, r, al]) => { const mx = xd(x0, ww, m); X.fillStyle = 'rgba(232,237,247,.6)'; X.fillRect(mx - .5, yy - 3, 1, 14); if (r) txt(X, r, m === 0 ? mx - 3 : mx, yy + 22, { s: 11, c: DIM, w: 500, a: al }); });
      const nx = xd(x0, ww, d); X.beginPath(); X.moveTo(nx, yy - 1); X.lineTo(nx - 6, yy - 8); X.lineTo(nx + 6, yy - 8); X.closePath(); X.fillStyle = TXT; X.fill();
    };
    const grafico = (x0, y0, ww, hh, rot) => {
      X.fillStyle = 'rgba(255,255,255,.04)'; X.beginPath(); X.roundRect(x0, y0, ww, hh, 8); X.fill();
      const gx = dd => x0 + 6 + (ww - 12) * cl(dd / 16, 0, 1), gy = v => y0 + hh - 6 - (hh - 14) * v / HMAX;
      X.save(); X.beginPath(); X.moveTo(gx(0), gy(0)); for (let dd = 0; dd <= 16.01; dd += .25) X.lineTo(gx(dd), gy(hcg(dd))); X.strokeStyle = rgba(HCG, .35); X.lineWidth = 1.5; X.stroke();
      if (d > 0) { X.beginPath(); X.moveTo(gx(0), gy(0)); for (let dd = 0; dd <= Math.min(d, 16); dd += .25) X.lineTo(gx(dd), gy(hcg(dd))); X.lineTo(gx(Math.min(d, 16)), gy(hcg(Math.min(d, 16)))); X.strokeStyle = HCG; X.lineWidth = 2.4; X.stroke(); dot(X, gx(Math.min(d, 16)), gy(hcg(Math.min(d, 16))), 4, HCG); }
      if (rot) { const m = gx(14); X.setLineDash([3, 4]); X.strokeStyle = 'rgba(232,237,247,.4)'; X.lineWidth = 1; X.beginPath(); X.moveTo(m, y0 + 6); X.lineTo(m, y0 + hh - 4); X.stroke(); X.setLineDash([]); txt(X, 'menstruação esperada', m - 4, y0 + 12, { s: 11, c: DIM, w: 500, a: 'right' }); }
      X.restore();
    };
    const hst = d < 6.5 ? 'ainda não há' : d < 9 ? 'começa a ser feita' : 'dobra a cada 2 a 3 dias';
    if (!comp) {
      txt(X, 'Tempo', x, y + 8, { s: 12, c: DIM, w: 500 }); txt(X, et.quando, x + w, y + 8, { s: 13, c: COR, a: 'right' });
      linha(x, y + 30, w, true);
      sep(X, x, y + 72, w);
      txt(X, 'hCG no sangue', x, y + 90, { s: 14 }); txt(X, hst, x + w, y + 90, { s: 12, c: d < 6.5 ? DIM : HCG, a: 'right', w: 500 });
      grafico(x, y + 104, w, 62, true);
      sep(X, x, y + 178, w);
      X.fillStyle = 'rgba(255,255,255,.04)'; X.beginPath(); X.roundRect(x, y + 190, 56, 56, 10); X.fill();
      glifo(X, x + 28, y + 218, 15, ag[2], cx.tt);
      txt(X, ag[0], x + 68, y + 206, { s: 15 });
      quebra(X, ag[1], w - 68).forEach((l, i) => txt(X, l, x + 68, y + 226 + i * 15, { s: 12, c: DIM, w: 500 }));
    } else {
      const gw = Math.min(118, w * .34), lw = w - gw - 12;
      txt(X, et.quando, x, y + 6, { s: 13, c: COR });
      linha(x, y + 26, lw, false);
      txt(X, ag[0], x, y + 52, { s: 12, w: 500, c: TXT });
      txt(X, 'hCG', x + lw + 12, y + 6, { s: 12, c: HCG });
      grafico(x + lw + 12, y + 16, gw, 46, false);
    }
  }
  function glifo(X, x, y, r, k, t) {
    if (k === 'esp') { esperm(X, x + r * .5, y, PI * 1.08, r * .38, t, 1); esperm(X, x + r * .2, y + r * .55, PI, r * .3, t + 1, .8); }
    else if (k === 'h') { for (let i = 0; i < 5; i++) dot(X, x + Math.cos(i * 1.26) * r * .6, y + Math.sin(i * 1.26) * r * .6, r * .2, HCG); }
    else embriao(X, x, y, r, k, k === 'b' ? 0 : 1);
  }

  viagem({
    K: 'humano/fecundacao', pref: 'embriologia', mask: { miolo: .86, borda: 1 }, cor: COR, altMed: 250,
    nome: 'Fecundação e nidação: a viagem até o útero', rotNav: 'Viagem da fecundação à nidação: etapas',
    vistas: [
      ['a', 'humano-fecundacao-a', 'Útero', 'Útero, tubas, ovários e vagina'],
      ['b', 'humano-fecundacao-b', 'Ovócito', 'Ovócito na ampola com corona radiata, zona pelúcida e espermatozoides'],
      ['c', TUBA, 'Tuba aberta', 'Tuba aberta com zigoto, 2 e 4 células, mórula e blastocisto; ovário com corpo-lúteo'],
      ['d', 'humano-nidacao-b', 'Endométrio', 'Blastocisto afundando no endométrio, com vasos da mãe']
    ],
    hs: HS, VAI, ET, desenha, medidor, alvo: (e, u) => lerp(DIAS[e][0], DIAS[e][1], u),
    aoAbrir: S => { if (!S.cromo) S.cromo = Math.random() < .5 ? 'X' : 'Y'; }
  });
})();
