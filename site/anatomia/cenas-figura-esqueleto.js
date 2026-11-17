/* LAB Anatomia: "O cálcio e a vida do osso" (locomotor/esqueleto) sobre figuras de IA realistas, no padrão de
   cenas-figura-digestorio.js (Martin + Íris). Substitui a figura simples que esta rota tinha em cenas-figura.js.
   Vista A: esqueleto adulto inteiro, de frente. Vista B: osso longo (fêmur) cortado no comprimento.
   As duas figuras já estavam na rota (nenhuma imagem nova): todos os caminhos e pontos foram conferidos sobre elas.
   Viagem em 9 etapas: esqueleto axial, apendicular, proteção e sustentação, articulações e alavanca (vista A);
   osso por dentro, medula vermelha fazendo células do sangue, medula amarela, banco de cálcio com paratormônio,
   calcitonina e vitamina D, e crescimento pelo disco epifisário (vista B, que entra sozinha na etapa 5).
   Um íon de cálcio percorre o caminho real (curva suave sobre os ossos); o medidor do painel muda a cada etapa
   (ossos contados, órgãos protegidos, ângulo do cotovelo, composição do osso, hemácias, cálcio no sangue, comprimento do fêmur).
   Tocar num ponto leva a viagem até a etapa dele. O desenho antigo segue atrás de "Ver esquema" (não há 3D nesta rota);
   os modos Osso por dentro, Banco de cálcio e Três articulações continuam no desenho plano.
   Com prefers-reduced-motion nada anda sozinho: etapas por botão. Usa os globais do motor (SC, X, W, H, NAR, cap, cv).
   Carregar depois de cenas-figura-repro.js e antes de LAB_ANATOMIA_iniciar(). Texto: sem "!", sem setas ou pontos como separador. */
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

  // ---------- botões da viagem (só desta rota) ----------
  const ICO = { ant: '<path d="M14.5 6 8.5 12l6 6"/>', prox: '<path d="m9.5 6 6 6-6 6"/>', pausa: '<path d="M9 6v12M15 6v12"/>', play: '<path d="M8 5.5v13l10-6.5z"/>' };
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;
  let NAV = null, dono = null, vivo = 0, sincK = '', navK = '';
  function montarNav() {
    if (NAV) return;
    const st = document.createElement('style'); st.id = 'es-css';
    st.textContent = `.es-nav{position:absolute;left:0;top:0;z-index:2;display:flex;align-items:center;gap:6px}
.es-nav[hidden]{display:none}
.es-nav button{font:inherit;width:44px;height:44px;flex:none;display:grid;place-items:center;border-radius:10px;border:1px solid var(--line-strong,#5B6C99);background:rgba(19,26,43,.92);color:var(--txt,#E8EDF7);cursor:pointer;transition:background-color 90ms,border-color 90ms,color 90ms}
.es-nav button:hover{background:var(--panel-2,#1B2440);border-color:var(--amber,#FFB347)}
.es-nav button:active{transform:scale(.96)}
.es-nav button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
.es-nav button svg{width:22px;height:22px}
.es-nav button[hidden]{display:none}
.es-nav .et{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;padding:0 6px;line-height:1.2}
.es-nav .et small{font-size:12px;color:var(--dim,#9DA9C4)}
.es-nav .et b{font-size:15px;font-weight:600;color:var(--txt,#E8EDF7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(prefers-reduced-motion:reduce){.es-nav button{transition:none}.es-nav button:active{transform:none}}`;
    document.head.appendChild(st);
    NAV = document.createElement('div'); NAV.className = 'es-nav'; NAV.hidden = true; NAV.setAttribute('role', 'group');
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
    if (!compacto()) { const x = 28 + PW + 14; return { x, y: 60, w: W - x - 24, h: H - 60 - 92 }; }   // a legenda de baixo tem duas linhas nesta rota
    const x0 = NAR ? 6 : 24, y0 = NAR ? 46 : 60; return { x: x0, y: y0, w: W - 2 * x0, h: H - y0 - (capRes() + fh + 8) - (fh ? LEGH : 0) };
  }
  function painelBox(fh, ph) {
    if (!compacto()) return { x: 28, y: 60, w: PW, h: Math.min(ph, H - 60 - 92), comp: false };
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
  // ESQUELETO: o cálcio e a vida do osso
  // =====================================================================================================
  (function () {
    const AX = '#8FD8FF', AP = '#F2A65A', CA = '#FFD43B', FOR = '#FF8A6B', SIN = '#F2A65A', CRT = '#A9C54A', FIB = '#8FD8FF',
      PER = '#F28BB0', CMP = '#FFB347', ESP = '#FF8A6B', CAR = '#CFE0FF', MVE = '#E5484D', MAM = '#F2D04A', HEM = '#E5484D', LEU = '#E8EDF7', PLA = '#B79CF2',
      MIN = '#EADFC2', ORG = '#8FD8FF', PTH = '#A9C54A', CTN = '#7CC8F2', DIS = '#8FD8FF';
    const AR = [1.34, 1];   // as duas figuras têm 1200 x 896
    const esp = P => P.map(p => [100 - p[0], p[1]]);
    const lin = (P, x) => { if (x <= P[0][0]) return P[0][1]; for (let i = 1; i < P.length; i++) if (x <= P[i][0]) return lerp(P[i - 1][1], P[i][1], (x - P[i - 1][0]) / (P[i][0] - P[i - 1][0])); return P[P.length - 1][1]; };

    // ---------- vista A (esqueleto de frente), em % da imagem inteira; conferido sobre a figura ----------
    const A_EIXO = [[50, 4.5], [50, 9], [50, 14.5], [50, 17.5], [50, 21.5], [50, 26], [50, 31], [50, 36], [50, 41], [50, 45], [50, 48]];
    const A_PERNA = [[50, 48], [48.2, 50], [46.4, 51.6], [45, 54.5], [45.2, 60], [45.7, 66], [46.2, 71.5], [46.05, 77], [46, 84], [46.1, 90], [46.1, 92.5], [46, 95]];
    const A_BRACO = [[42.3, 22.6], [41.6, 26], [41.1, 30], [40.7, 34], [40.4, 38.2], [39.5, 41.5], [38.7, 44.5], [37.9, 47.5], [37.3, 49.8]];
    const A_CLAV = [[48.6, 21.2], [46.5, 20.6], [44, 20.4], [42.3, 22.6]];
    const cEixo = caminho(A_EIXO, AR), cPerna = caminho(A_PERNA, AR), cPernaD = caminho(esp(A_PERNA), AR);
    const cBraco = caminho(A_BRACO, AR), cBracoD = caminho(esp(A_BRACO), AR), cClav = caminho(A_CLAV, AR), cClavD = caminho(esp(A_CLAV), AR);
    const cPeso = caminho(A_EIXO.slice(1).concat(A_PERNA.slice(1)), AR), cPesoD = caminho(A_EIXO.slice(1).concat(esp(A_PERNA).slice(1)), AR);
    const cOmbCot = caminho(A_BRACO.slice(0, 5), AR);
    const CRANIO = [50, 9], TORAX = [50, 27], CANAL = [50, 39], ILIO = [[45.5, 45], [54.5, 45]], SACRO = [50, 47.5];
    const OMB = [[42.3, 22.6], [57.7, 22.6]], COT = [[40.4, 38.2], [59.6, 38.2]], QUAD = [[46.4, 51.6], [53.6, 51.6]], JOE = [[46.2, 71.5], [53.8, 71.5]];
    const SUTURA = [50, 5.2], DISCO = [50, 40];

    // ---------- vista B (fêmur em corte) ----------
    const B_ENTRA = [[47, 34], [47, 38.5], [47, 42.2], [47, 43.6], [46, 46.5], [42, 48.2], [36, 47.9], [30, 47.3], [25, 46.5], [20, 46.2], [16, 47]];
    const PERI_C = [[30, 40.1], [35, 41.2], [40, 41.7], [45, 42.1], [50, 42.4], [55, 42.7], [60, 43], [65, 43], [70, 42.7], [75, 42.2], [78, 41.4]];
    const PERI_B = [[30, 54.2], [35, 54.4], [40, 54.5], [45, 54.8], [50, 55], [55, 55.1], [60, 55.4], [65, 55.8], [70, 56.6], [75, 57.8]];
    const CMP_C = [[32, 42.4], [40, 43], [50, 43.7], [60, 44.2], [70, 44.5], [74, 44.2]];       // meio da parede compacta de cima
    const CMP_B = [[32, 53], [40, 53.4], [50, 54], [60, 54.3], [70, 55.1], [74, 56]];          // e da de baixo
    const CAV = [[29.5, 44.6, 51.4], [40, 44.4, 52.2], [50, 45, 53], [60, 45.5, 53.3], [70, 46.3, 53.6], [79, 46.8, 54]];   // x, topo e fundo do canal medular
    const cavY = (x, k) => lin(CAV.map(c => [c[0], c[k]]), x);
    const B_CAV = [[30.5, 48], [40, 48.3], [50, 49], [60, 49.4], [70, 50], [78, 50.3]];
    const MV = [[18.5, 46], [12, 58.5], [85, 50], [84.8, 59.5]];   // medula vermelha mais densa nas duas epífises
    const SAI = [[[18.5, 46], [19.5, 40], [20.5, 32]], [[12, 58.5], [12.5, 64], [13.5, 71]], [[85, 50], [84.5, 43], [84, 34]], [[84.8, 59.5], [84.3, 66], [83.8, 72]]];
    const cSai = SAI.map(P => caminho(P, AR));
    const DISCO_L = [[10.6, 50.2], [11, 52.8], [11.9, 54.9], [13.1, 56.4], [14.2, 57.3]];   // linha epifisária clara na cabeça do fêmur
    const cEntra = caminho(B_ENTRA, AR), cPeri = caminho(PERI_C, AR), cPeriB = caminho(PERI_B, AR), cCav = caminho(B_CAV, AR), cDisco = caminho(DISCO_L, AR);
    const cCmpC = caminho(CMP_C, AR), cCmpB = caminho(CMP_B, AR);

    // ---------- etapas ----------
    // med: medidor (nome, val ou seg, txt, rot, faixa); sub: barra menor; lista: o que olhar nesta etapa (painel do computador)
    const k9 = u => sst(.05, .9, u);
    const angCot = u => Math.round(150 - 75 * Math.sin(PI * (RED ? .5 : u)));
    const nProt = u => RED ? 3 : (u > .12) + (u > .3) + (u > .48);
    const calc = u => u < .12 ? .28 : u < .45 ? lerp(.28, .56, sst(.12, .45, u)) : u < .56 ? lerp(.56, .84, sst(.45, .56, u)) : lerp(.84, .58, sst(.56, .95, u));
    const idade = u => sst(.05, .95, u);
    const ET = [
      { id: 'axial', nome: 'Esqueleto axial', vista: 'a', dur: 7,
        cap: 'O <b>esqueleto axial</b> é o eixo do corpo: <b>crânio</b>, <b>coluna vertebral</b> e <b>caixa torácica</b> (costelas e esterno). São 80 dos cerca de 206 ossos do adulto.',
        med: { nome: 'Ossos do esqueleto axial', cor: AX, seg: u => [[80 / 206 * k9(u), AX]], txt: u => `${Math.round(80 * k9(u))} de 206`, rot: ['0', '206 ossos'] },
        lista: [[AX, 'Crânio', 'Caixa de ossos soldados que guarda o encéfalo.'], [AX, 'Coluna vertebral', 'Vértebras empilhadas: sustentam o tronco e protegem a medula espinal.'], [AX, 'Caixa torácica', '12 pares de costelas e o esterno.']] },
      { id: 'apend', nome: 'Apendicular', vista: 'a', dur: 8,
        cap: 'O <b>esqueleto apendicular</b> são os <b>membros</b> e as <b>cinturas</b> que os prendem ao eixo: a <b>escapular</b> (clavícula e escápula) e a <b>pélvica</b> (ossos do quadril). São 126 ossos.',
        med: { nome: 'Axial e apendicular', cor: AP, seg: u => [[80 / 206, AX], [126 / 206 * k9(u), AP]], txt: u => `${80 + Math.round(126 * k9(u))} de 206`, rot: ['axial', 'apendicular'] },
        lista: [[AP, 'Cintura escapular', 'Clavículas e escápulas prendem os braços ao tronco.'], [AP, 'Cintura pélvica', 'Os ossos do quadril ligam as pernas à coluna.'], [AP, 'Membros', 'Úmero, rádio e ulna no braço; fêmur, tíbia e fíbula na perna; e os ossos de mãos e pés.']] },
      { id: 'prot', nome: 'Proteção e peso', vista: 'a', dur: 8,
        cap: 'Os ossos <b>protegem</b>: o crânio guarda o <b>encéfalo</b>, as costelas, <b>coração e pulmões</b>, e as vértebras, a <b>medula espinal</b>. E <b>sustentam</b>: o peso desce pela coluna e pela pelve até os pés.',
        med: { nome: 'Órgãos protegidos', cor: AX, val: u => nProt(u) / 3, txt: u => `${nProt(u)} de 3` },
        sub: { nome: 'Peso até os pés', val: u => RED ? 1 : sst(.5, 1, u), cor: FOR },
        lista: [[AX, 'Encéfalo', 'Dentro do crânio.'], [AX, 'Coração e pulmões', 'Dentro da caixa torácica, que ainda sobe e desce na respiração.'], [AX, 'Medula espinal', 'Dentro do canal das vértebras.'], [FOR, 'Sustentação', 'O fêmur, o maior osso do corpo, aguenta várias vezes o peso do corpo.']] },
      { id: 'art', nome: 'Articulações', vista: 'a', dur: 9,
        cap: 'Onde dois ossos se encontram há uma <b>articulação</b>. O osso é uma <b>alavanca</b>: no cotovelo, o apoio fica na articulação e o bíceps puxa entre o apoio e o peso da mão.',
        med: { nome: 'Ângulo do cotovelo', cor: SIN, val: u => angCot(u) / 180, txt: u => `${angCot(u)}°`, rot: ['dobrado', 'esticado'] },
        alav: true },
      { id: 'dentro', nome: 'Osso por dentro', vista: 'b', dur: 8,
        cap: 'Por fora, o <b>periósteo</b> cobre o osso. A parede da <b>diáfise</b> é de <b>osso compacto</b>; as <b>epífises</b> são de <b>osso esponjoso</b>. O osso é vivo: tem células, vasos e nervos.',
        med: { nome: 'Composição do osso', cor: MIN, seg: u => [[.65 * k9(u), MIN], [.35 * k9(u), ORG]], txt: u => 'cerca de 65% mineral', rot: ['mineral: dureza', 'colágeno e água: flexibilidade'] },
        lista: [[PER, 'Periósteo', 'Capa de fora, com vasos e nervos. Faz osso novo no conserto de uma fratura.'], [CMP, 'Osso compacto', 'Denso e duro: forma a parede da diáfise.'], [ESP, 'Osso esponjoso', 'Trabéculas leves nas epífises, com medula vermelha nos espaços.'], [CAR, 'Cartilagem articular', 'Capa lisa nas pontas: reduz o atrito na articulação.']] },
      { id: 'verm', nome: 'Medula vermelha', vista: 'b', dur: 8,
        cap: 'Nos espaços do osso esponjoso, a <b>medula óssea vermelha</b> faz as células do sangue: <b>hemácias</b>, <b>leucócitos</b> e <b>plaquetas</b>. Cerca de 2 milhões de hemácias novas por segundo.',
        med: { nome: 'Hemácias novas', cor: HEM, val: u => RED ? 1 : u, txt: u => `cerca de ${Math.round(16 * (RED ? 1 : u))} milhões`, rot: ['cerca de 2 milhões por segundo', ''] },
        lista: [[HEM, 'Hemácias', 'Levam oxigênio. Vivem cerca de 120 dias.'], [LEU, 'Leucócitos', 'Defendem o corpo.'], [PLA, 'Plaquetas', 'Ajudam na coagulação.'], [MVE, 'Onde fica', 'Nas epífises e nos ossos chatos, como esterno, costelas e pelve.']] },
      { id: 'amar', nome: 'Medula amarela', vista: 'b', dur: 8,
        cap: 'No canal da diáfise fica a <b>medula amarela</b>, rica em <b>gordura</b>: é reserva de energia e não faz sangue. Ao nascer quase toda a medula é vermelha; no adulto, cerca de metade virou amarela.',
        med: { nome: 'Medula vermelha', cor: MVE, val: u => lerp(1, .5, idade(u)), txt: u => idade(u) < .3 ? 'recém-nascido' : idade(u) < .75 ? 'criança' : 'adulto', rot: ['nenhuma', 'toda'] },
        lista: [[MAM, 'Medula amarela', 'Gordura guardada no canal medular.'], [MVE, 'Troca com a idade', 'A medula vermelha dos ossos longos vira amarela com o tempo.'], [HEM, 'Em emergência', 'Numa perda grande de sangue, parte da amarela pode voltar a fazer sangue.']] },
      { id: 'calcio', nome: 'Banco de cálcio', vista: 'b', dur: 10,
        cap: 'Cerca de 99% do <b>cálcio</b> está nos ossos. Cálcio baixo: o <b>paratormônio</b> tira cálcio do osso. Cálcio alto: a <b>calcitonina</b> freia a retirada e o osso guarda. A <b>vitamina D</b> ajuda o intestino a absorvê-lo.',
        med: { nome: 'Cálcio no sangue', cor: '#E8EDF7', val: calc, faixa: [.4, .7] },
        sub: { nome: u => u < .5 ? 'Paratormônio' : 'Calcitonina', val: u => u < .5 ? .8 * (1 - sst(.32, .5, u)) + .1 : .1 + .7 * sst(.5, .6, u) * (1 - sst(.85, 1, u)), cor: u => u < .5 ? PTH : CTN },
        lista: [[PTH, 'Cálcio baixo', 'As paratireoides soltam paratormônio: os osteoclastos desmancham osso e o cálcio vai ao sangue.'], [CTN, 'Cálcio alto', 'A tireoide solta calcitonina: ela freia os osteoclastos, e mais cálcio fica guardado no osso.'], [CA, 'Vitamina D', 'Feita na pele com o sol. Sem ela, pouco cálcio é absorvido e o osso enfraquece.']] },
      { id: 'cresc', nome: 'Crescimento', vista: 'b', dur: 9,
        cap: 'Na criança, as células do <b>disco epifisário</b>, de cartilagem, se dividem e o osso <b>cresce em comprimento</b>, estimulado pelo <b>GH</b>. Depois da puberdade o disco vira osso e o crescimento para.',
        med: { nome: 'Comprimento do fêmur', cor: DIS, val: u => lerp(8, 45, idade(u)) / 45, txt: u => `cerca de ${Math.round(lerp(8, 45, idade(u)))} cm`, rot: ['0 cm', 'adulto'] },
        sub: { nome: u => { const n = Math.round(20 * idade(u)); return n < 1 ? 'Idade: ao nascer' : `Idade: ${n} ${n === 1 ? 'ano' : 'anos'}`; }, val: idade, cor: DIS },
        lista: [[DIS, 'Disco epifisário', 'Cartilagem de crescimento. A faixa clara na cabeça do fêmur é o que sobra dele no adulto: a linha epifisária.'], [CA, 'Hormônio do crescimento', 'O GH, da hipófise, estimula o disco. Hormônios sexuais da puberdade fecham o disco.'], [PER, 'Em espessura', 'O periósteo põe camadas novas por fora e o osso engrossa.']] }
    ];

    const HS = [
      { id: 'cra', c: AX, t: 'Crânio', d: 'Ossos chatos unidos por suturas, articulações fibrosas que não se mexem. Protege o encéfalo. Faz parte do esqueleto axial.', em: { a: [50, 7.5] }, z: 2.6 },
      { id: 'est', c: AX, t: 'Esterno', d: 'Osso chato no meio do peito, onde se prendem as costelas verdadeiras. Tem medula vermelha e faz células do sangue.', em: { a: [50, 25.5] }, z: 2.8 },
      { id: 'cos', c: AX, t: 'Costelas', d: 'O adulto tem 12 pares: 7 verdadeiras, presas ao esterno, 3 falsas e 2 flutuantes. Com o esterno formam a caixa torácica, que protege coração e pulmões.', em: { a: [55.5, 28] }, z: 2.6 },
      { id: 'col', c: AX, t: 'Coluna vertebral', d: 'Vértebras empilhadas com discos de cartilagem entre elas. Sustenta o tronco, protege a medula espinal e tem curvaturas que amortecem o peso.', em: { a: [50, 40] }, z: 2.6 },
      { id: 'cla', c: AP, t: 'Clavícula (cintura escapular)', d: 'Com a escápula, forma a cintura escapular, que prende o braço ao tronco. É um dos ossos que mais se quebram em quedas.', em: { a: [46, 20.7] }, z: 3 },
      { id: 'ume', c: AP, t: 'Úmero', d: 'Osso longo do braço. Articula com a escápula no ombro e com o rádio e a ulna no cotovelo.', em: { a: [41.1, 30] }, z: 2.8 },
      { id: 'cot', c: SIN, t: 'Cotovelo', d: 'Articulação sinovial em dobradiça. É o apoio da alavanca do antebraço: o bíceps puxa o rádio e o antebraço sobe.', em: { a: COT[0] }, z: 3 },
      { id: 'pel', c: AP, t: 'Pelve (cintura pélvica)', d: 'Os ossos do quadril e o sacro formam a pelve. Ela liga a coluna às pernas, apoia o tronco e protege bexiga e órgãos reprodutores.', em: { a: [45.5, 45] }, z: 2.8 },
      { id: 'fem', c: AP, t: 'Fêmur', d: 'Osso da coxa, o maior e o mais resistente do corpo. É o osso longo que aparece cortado na outra vista.', em: { a: [45.2, 60] }, z: 2.6 },
      { id: 'joe', c: SIN, t: 'Joelho', d: 'Maior articulação sinovial do corpo, com a patela na frente. Cartilagem e líquido sinovial deixam o movimento liso.', em: { a: JOE[0] }, z: 3 },
      { id: 'tib', c: AP, t: 'Tíbia e fíbula', d: 'Os dois ossos da perna. A tíbia, na frente e por dentro, leva quase todo o peso até o pé.', em: { a: [46, 82] }, z: 2.6 },
      { id: 'per', c: PER, t: 'Periósteo', d: 'Membrana que cobre o osso por fora, com vasos e nervos. Por isso fratura dói e sangra. Suas células fazem osso novo para engrossar o osso e consertar fraturas.', em: { b: [62, 43] }, z: 2.4 },
      { id: 'cmp', c: CMP, t: 'Osso compacto', d: 'Tecido ósseo denso, feito de colágeno e fosfato de cálcio. Forma a parede da diáfise e dá rigidez. Guarda a maior parte do cálcio do corpo.', em: { b: [45, 53.7] }, z: 2.6 },
      { id: 'esp', c: ESP, t: 'Osso esponjoso', d: 'Nas epífises, trabéculas finas em rede deixam o osso leve e forte. Os espaços entre elas guardam a medula vermelha.', em: { b: [21, 43.5] }, z: 2.4 },
      { id: 'mve', c: MVE, t: 'Medula óssea vermelha', d: 'Tecido que faz hemácias, leucócitos e plaquetas a partir de células-tronco. É dela que vem o transplante de medula.', em: { b: MV[2] }, z: 2.4 },
      { id: 'mam', c: MAM, t: 'Medula amarela', d: 'No canal medular da diáfise. Rica em gordura, é reserva de energia e não produz sangue no adulto.', em: { b: [55, 49] }, z: 2 },
      { id: 'dis', c: DIS, t: 'Disco epifisário', d: 'Cartilagem entre a epífise e a diáfise que faz o osso crescer em comprimento na infância. No adulto vira osso e deixa a linha epifisária, a faixa clara na cabeça do fêmur.', em: { b: [11.9, 54.9] }, z: 3 },
      { id: 'car', c: CAR, t: 'Cartilagem articular', d: 'Cartilagem lisa que cobre as pontas do osso. Diminui o atrito e amortece o choque na articulação. Não tem vasos e se regenera pouco.', em: { b: [5.6, 58] }, z: 2.6 }
    ];
    const VAI = { cra: 0, est: 0, col: 0, cla: 1, ume: 1, pel: 1, fem: 1, tib: 1, cos: 2, cot: 3, joe: 3, per: 4, cmp: 4, esp: 4, car: 4, mve: 5, mam: 6, dis: 8 };

    // ---------- desenho sobre a figura ----------
    function ion(X, x, y, r, a) { hormonio(X, x, y, r, CA, a); }
    function hemacia(X, x, y, r, a) {
      X.save(); X.globalAlpha = cl(a, 0, 1); X.beginPath(); X.ellipse(x, y, r * 1.3, r, 0, 0, TAU); X.fillStyle = 'rgba(11,15,28,.8)'; X.fill();
      X.beginPath(); X.ellipse(x, y, r * 1.1, r * .82, 0, 0, TAU); X.fillStyle = HEM; X.fill();
      X.beginPath(); X.ellipse(x, y, r * .45, r * .32, 0, 0, TAU); X.fillStyle = '#9E2A2E'; X.fill(); X.restore();
    }
    function escudo(X, x, y, rx, ry, cor, a) {
      if (a <= 0) return; X.save(); X.globalAlpha = cl(a, 0, 1); X.strokeStyle = cor; X.lineWidth = 2.2; X.setLineDash([5, 4]);
      X.beginPath(); X.ellipse(x, y, rx, ry, 0, 0, TAU); X.stroke(); X.restore(); brilho(X, x, y, Math.max(rx, ry), cor, a * .5);
    }
    function trilha(X, R, C, cor, larg, a) {
      if (a <= 0) return; X.save(); X.globalAlpha = cl(a, 0, 1); X.strokeStyle = cor; X.lineWidth = larg; X.lineCap = 'round'; X.lineJoin = 'round'; X.beginPath();
      C.AM.forEach((p, i) => { const s = R.pt(p[0], p[1]); if (i) X.lineTo(s[0], s[1]); else X.moveTo(s[0], s[1]); }); X.stroke(); X.restore();
    }

    function sobre(R, X, t, S, v) {
      const et = ET[v.e], u = RED ? 1 : v.u, ue = RED ? 1 : eIO(v.u), r = cl(R.s * .55, 2.6, 6), P = p => R.pt(p[0], p[1]);
      const viajante = (C, f) => { C.rastro(X, R, 0, f, rgba(CA, .6)); const p = C.em(f), s = P(p); ion(X, s[0], s[1], r * 1.5, 1); return s; };
      if (et.id === 'axial') {
        // brilho azul no eixo conforme o cálcio desce do crânio ao sacro
        [[CRANIO, 0, R.s * 9], [TORAX, .35, R.s * 11], [CANAL, .7, R.s * 7]].forEach(([p, f0, rr]) => { const s = P(p); brilho(X, s[0], s[1], rr, AX, sst(f0, f0 + .2, ue) * .8); });
        trilha(X, R, cEixo, rgba(AX, .5), Math.max(3, R.s * 1.2), sst(0, .3, u));
        viajante(cEixo, ue);
        legR(X, R, [[AX, 'esqueleto axial'], [CA, 'íon de cálcio']], 'dir');
      } else if (et.id === 'apend') {
        trilha(X, R, cEixo, rgba(AX, .35), Math.max(3, R.s * 1.2), 1);
        // cinturas: clavículas e pelve acendem; membros recebem o fluxo
        [cClav, cClavD].forEach(C => trilha(X, R, C, rgba(AP, .65), Math.max(3, R.s * 1), sst(0, .3, u)));
        ILIO.forEach((p, i) => { const s = P(p); brilho(X, s[0], s[1], R.s * 7, AP, sst(.15, .4, u) * .9); anel(X, s[0], s[1], t, AP, 1.6, R.s * 4, i * .5, .7 * sst(.1, .3, u)); });
        [cBraco, cBracoD].forEach((C, i) => C.fluxo(X, R, t, { n: 3, v: .2, off: i * .15, c: AP, r: r * .8, a: sst(.2, .5, u) + (RED ? 1 : 0) }));
        cPernaD.fluxo(X, R, t, { n: 3, v: .18, off: .3, c: AP, r: r * .8, a: sst(.3, .6, u) + (RED ? 1 : 0) });
        viajante(cPerna, ue);
        legR(X, R, [[AX, 'axial'], [AP, 'apendicular: cinturas e membros']], 'dir');
      } else if (et.id === 'prot') {
        [[CRANIO, 'cr', .12, R.s * 8, R.s * 7.5], [TORAX, 'tx', .3, R.s * 9.5, R.s * 9], [CANAL, 'cn', .48, R.s * 2.6, R.s * 7]].forEach(([p, k, f0, rx, ry]) => { const s = P(p); escudo(X, s[0], s[1], rx, ry, AX, RED ? 1 : sst(f0, f0 + .1, u)); });
        // o peso desce pela coluna, pela pelve e pelas duas pernas
        const kp = RED ? 1 : sst(.45, .6, u);
        [cPeso, cPesoD].forEach((C, i) => C.fluxo(X, R, t, { n: 7, v: .14, off: i * .07, c: FOR, r: r * .85, a: kp }));
        legR(X, R, [[AX, 'órgãos protegidos'], [FOR, 'peso descendo até os pés']], 'dir');
      } else if (et.id === 'art') {
        // três tipos de articulação, cada um com a sua cor
        const ka = sst(0, .25, u) + (RED ? 1 : 0);
        [OMB, COT, QUAD, JOE].forEach((par, j) => par.forEach((p, i) => { const s = P(p); anel(X, s[0], s[1], t, SIN, 1.8, R.s * 3.2, j * .3 + i * .5, .85 * cl(ka, 0, 1)); }));
        { const s = P(SUTURA); anel(X, s[0], s[1], t, FIB, 2.2, R.s * 3, .4, .8 * cl(ka, 0, 1)); dot(X, s[0], s[1], r * .8, FIB, cl(ka, 0, 1)); }
        { const s = P(DISCO); anel(X, s[0], s[1], t, CRT, 2, R.s * 3, .9, .85 * cl(ka, 0, 1)); dot(X, s[0], s[1], r * .8, CRT, cl(ka, 0, 1)); }
        // o cálcio vai do ombro ao cotovelo, o apoio da alavanca
        const f = sst(0, .45, ue) + (RED ? 1 : 0), q = viajante(cOmbCot, cl(f, 0, 1));
        if (f >= 1) anel(X, q[0], q[1], t, CA, 1.2, R.s * 3.5, 0, .9);
        legR(X, R, [[SIN, 'sinovial: move muito'], [CRT, 'cartilagínea: move pouco'], [FIB, 'fibrosa: não move']], 'dir');
      } else if (et.id === 'dentro') {
        // periósteo, parede compacta e esponjoso acendem na ordem em que o cálcio passa
        trilha(X, R, cPeri, rgba(PER, .9), Math.max(2, R.s * .35), sst(.15, .3, ue)); trilha(X, R, cPeriB, rgba(PER, .9), Math.max(2, R.s * .35), sst(.15, .3, ue));
        trilha(X, R, cCmpC, rgba(CMP, .45), Math.max(3, R.s * 1.1), sst(.3, .45, ue)); trilha(X, R, cCmpB, rgba(CMP, .45), Math.max(3, R.s * 1.1), sst(.3, .45, ue));
        [MV[0], MV[1]].forEach((p, i) => { const s = P(p); brilho(X, s[0], s[1], R.s * 7, ESP, sst(.7, .9, ue) * .7); });
        viajante(cEntra, ue);
        legR(X, R, [[PER, 'periósteo'], [CMP, 'osso compacto'], [ESP, 'osso esponjoso']], 'baixo');
      } else if (et.id === 'verm') {
        MV.forEach((p, i) => { const s = P(p); anel(X, s[0], s[1], t, MVE, 1.6, R.s * 3, i * .4, .8); });
        // células novas saem da medula vermelha para o sangue; a maioria é hemácia
        cSai.forEach((C, i) => { for (let k = 0; k < 5; k++) { const f = RED ? (k + .5) / 5 : ((t * .2 + k / 5 + i * .13) % 1), p = C.em(f), s = P(p), a = RED ? .95 : Math.min(1, Math.sin(PI * f) * 1.8), tipo = (k + i) % 5; if (tipo === 3) hormonio(X, s[0], s[1], r * .95, LEU, a); else if (tipo === 4) dot(X, s[0], s[1], r * .5, PLA, a); else hemacia(X, s[0], s[1], r * 1.1, a); } });
        { const q = cSai[2].em(RED ? .6 : sst(0, 1, (u * 2) % 1)), s = P(q); hemacia(X, s[0], s[1], r * 1.6, 1); }
        legR(X, R, [[HEM, 'hemácia'], [LEU, 'leucócito'], [PLA, 'plaqueta']], 'baixo');
      } else if (et.id === 'amar') {
        // gotas de gordura na medula amarela do canal
        for (let k = 0; k < 16; k++) {
          const x = 31 + (k * 7.3 % 46), y0 = cavY(x, 1) + 1.2, y1 = cavY(x, 2) - 1.2, y = lerp(y0, y1, ((k * .618) % 1)), s = P([x, y]), w = RED ? 1 : .6 + .4 * Math.sin(t * 1.5 + k);
          X.save(); X.globalAlpha = .75 * w; X.beginPath(); X.arc(s[0], s[1], Math.max(2.2, R.s * (.5 + (k % 3) * .2)), 0, TAU); X.strokeStyle = '#FFF2B0'; X.lineWidth = 1.4; X.stroke(); X.restore();
        }
        trilha(X, R, cCav, rgba(MAM, .5), Math.max(3, R.s * 1.6), .6);
        // a medula vermelha das epífises encolhe (fica mais fraca) com a idade
        MV.forEach((p, i) => { const s = P(p); brilho(X, s[0], s[1], R.s * 6, MVE, lerp(.9, .45, idade(u))); });
        const q = cCav.em(RED ? .5 : (t * .06) % 1), s = P(q); ion(X, s[0], s[1], r * 1.4, 1);
        legR(X, R, [[MAM, 'medula amarela: gordura'], [MVE, 'medula vermelha']], 'baixo');
      } else if (et.id === 'calcio') {
        const sai = u < .5, cor = sai ? PTH : CTN;
        // íons de cálcio atravessam a superfície do osso compacto: saem (paratormônio) ou entram (calcitonina)
        [[PERI_C, CMP_C, -1], [PERI_B, CMP_B, 1]].forEach(([Pe, Cm, sg], j) => {
          for (let k = 0; k < 9; k++) {
            const x = 34 + k * 4.8 + j * 2.2, ys = lin(Pe, x), ym = lin(Cm, x), w = RED ? .5 : ((t * .32 + k / 9 + j * .27) % 1), f = sai ? w : 1 - w;
            const y = f < .35 ? lerp(ym, ys, f / .35) : ys + sg * (f - .35) / .65 * 9, s = P([x, y]);
            ion(X, s[0], s[1], r * .9, (RED ? .9 : Math.min(1, Math.sin(PI * w) * 1.8)) * (sai ? 1 - sst(.4, .5, u) : sst(.5, .6, u)) + (RED ? 0 : 0));
          }
        });
        trilha(X, R, cPeri, rgba(cor, .7), Math.max(2, R.s * .35), 1); trilha(X, R, cPeriB, rgba(cor, .7), Math.max(2, R.s * .35), 1);
        legR(X, R, sai ? [[CA, 'cálcio saindo do osso para o sangue'], [PTH, 'efeito do paratormônio']] : [[CA, 'cálcio entrando no osso'], [CTN, 'efeito da calcitonina']], 'baixo');
      } else if (et.id === 'cresc') {
        const kd = RED ? .8 : 1 - .65 * sst(.8, 1, u);
        trilha(X, R, cDisco, rgba(DIS, .35 * kd), Math.max(6, R.s * 2), 1); trilha(X, R, cDisco, rgba(DIS, .95 * kd), Math.max(2, R.s * .5), 1);
        // células do disco se dividem e empurram a epífise para longe da diáfise
        const A = P(DISCO_L[0]), B = P(DISCO_L[DISCO_L.length - 1]), nx = -(B[1] - A[1]), ny = B[0] - A[0], nl = Math.hypot(nx, ny) || 1, n = [nx / nl, ny / nl];   // normal para o lado da cabeça
        for (let k = 0; k < 4; k++) {
          const q = cDisco.em((k + .5) / 4), s = P(q), w = RED ? .5 : ((t * .45 + k * .25) % 1), D = R.s * (1.5 + w * 4), a = (RED ? .9 : Math.sin(PI * w)) * kd;
          seta(X, s[0] + n[0] * D, s[1] + n[1] * D, Math.atan2(n[1], n[0]), Math.max(4, R.s * 1.1), DIS, a);
          seta(X, s[0] - n[0] * D, s[1] - n[1] * D, Math.atan2(-n[1], -n[0]), Math.max(4, R.s * 1.1), DIS, a);
        }
        const q = cDisco.em(RED ? .5 : (Math.sin(t * .9) * .5 + .5)), s = P(q); ion(X, s[0], s[1], r * 1.3, 1);
        legR(X, R, [[DIS, kd > .6 ? 'disco epifisário: cresce' : 'linha epifisária: parou'], [CA, 'GH estimulando']], 'baixo');
      }
    }

    // ---------- painel ----------
    function quebra(X, s, w) { const ps = s.split(' '), L = []; let l = ''; ps.forEach(p => { const n = l ? l + ' ' + p : p; if (X.measureText(n).width > w && l) { L.push(l); l = p; } else l = n; }); if (l) L.push(l); return L; }
    function medidor(X, x, y, w, m, u, comp) {
      const fx = m.faixa, val = m.val ? m.val(u) : 0, st = fx ? (val < fx[0] ? 'abaixo do normal' : val > fx[1] ? 'acima do normal' : 'na faixa normal') : m.txt(u);
      txt(X, m.nome, x, y + 8, { s: comp ? 13 : 14, c: m.cor });
      txt(X, st, x + w, y + 8, { s: comp ? 12 : 13, c: fx ? (val < fx[0] || val > fx[1] ? '#FFB347' : '#7FD48A') : TXT, a: 'right', w: 600 });
      const by = y + (comp ? 27 : 29), bh = comp ? 9 : 12;
      X.fillStyle = 'rgba(255,255,255,.08)'; X.beginPath(); X.roundRect(x, by, w, bh, bh / 2); X.fill();
      if (fx) { X.fillStyle = 'rgba(127,212,138,.28)'; X.fillRect(x + w * fx[0], by, w * (fx[1] - fx[0]), bh); X.strokeStyle = 'rgba(127,212,138,.75)'; X.lineWidth = 1; X.strokeRect(x + w * fx[0] + .5, by + .5, w * (fx[1] - fx[0]) - 1, bh - 1); }
      if (m.seg) { let xx = x; X.save(); X.beginPath(); X.roundRect(x, by, w, bh, bh / 2); X.clip(); m.seg(u).forEach(([f, c]) => { X.fillStyle = c; X.fillRect(xx, by, w * f, bh); xx += w * f; }); X.restore(); }
      else { X.fillStyle = rgba(m.cor, .85); X.beginPath(); X.roundRect(x, by + 2, Math.max(4, w * cl(val, 0, 1)), bh - 4, (bh - 4) / 2); X.fill();
        const nx = x + w * cl(val, 0, 1); X.beginPath(); X.moveTo(nx, by - 2); X.lineTo(nx - 6, by - 9); X.lineTo(nx + 6, by - 9); X.closePath(); X.fillStyle = TXT; X.fill(); X.fillStyle = TXT; X.fillRect(nx - 1, by - 2, 2, bh + 4); }
      if (!comp) {
        if (fx) { txt(X, 'baixo', x, by + bh + 11, { s: 11, c: DIM, w: 500 }); txt(X, 'faixa normal', x + w * (fx[0] + fx[1]) / 2, by + bh + 11, { s: 11, c: '#7FD48A', w: 500, a: 'center' }); txt(X, 'alto', x + w, by + bh + 11, { s: 11, c: DIM, w: 500, a: 'right' }); }
        else if (m.rot) { txt(X, m.rot[0], x, by + bh + 11, { s: 11, c: DIM, w: 500 }); if (m.rot[1]) txt(X, m.rot[1], x + w, by + bh + 11, { s: 11, c: DIM, w: 500, a: 'right' }); }
      }
    }
    function subLinha(X, x, y, w, sb, u) {
      const nome = typeof sb.nome === 'function' ? sb.nome(u) : sb.nome, cor = typeof sb.cor === 'function' ? sb.cor(u) : sb.cor;
      txt(X, nome, x, y, { s: 12, c: DIM, w: 500 });
      const bx = x + 124, bw = w - 124; X.fillStyle = 'rgba(255,255,255,.08)'; X.beginPath(); X.roundRect(bx, y - 4, bw, 8, 4); X.fill();
      X.fillStyle = cor; X.beginPath(); X.roundRect(bx, y - 4, Math.max(4, bw * cl(sb.val(u), 0, 1)), 8, 4); X.fill();
    }
    function lista(X, x, y, w, ymax, itens) {
      let yy = y;
      for (const [c, tit, d] of itens) {
        X.font = `500 12px ${FT}`; const L = quebra(X, d, w - 16);
        if (yy + 16 + L.length * 15 > ymax) break;
        dot(X, x + 4, yy + 7, 4.5, c, 1); txt(X, tit, x + 16, yy + 7, { s: 13 });
        L.forEach((l, i) => txt(X, l, x + 16, yy + 24 + i * 15, { s: 12, c: DIM, w: 500 }));
        yy += 24 + L.length * 15 + 8;
      }
    }
    // alavanca do cotovelo: apoio na articulação, força do bíceps perto dele, resistência na mão
    function alavanca(X, x, y, w, h, ang, t) {
      X.font = `500 12px ${FT}`; const frase = quebra(X, 'Alavanca interpotente: a força do bíceps fica entre o apoio (cotovelo) e a resistência (mão).', w);
      const dh = h - 30 - frase.length * 15, L = Math.min(w * .6, (dh - 16) / 1.42), px = x + 30, py = y + 6 + L * .55, a = ang * PI / 180, d = [Math.sin(a), -Math.cos(a)];
      const om = [px, py - L * .55], fim = [px + d[0] * L, py + d[1] * L], ins = [px + d[0] * L * .22, py + d[1] * L * .22];
      X.lineCap = 'round';
      X.strokeStyle = '#D9CDAF'; X.lineWidth = 7; X.beginPath(); X.moveTo(om[0], om[1]); X.lineTo(px, py); X.lineTo(fim[0], fim[1]); X.stroke();
      const c = cl((150 - ang) / 75, 0, 1);   // mais grosso quanto mais contraído
      const ctl = [px + 16 + 10 * c, (om[1] + ins[1]) / 2 - 4];
      X.strokeStyle = rgba(FOR, .95); X.lineWidth = 4 + 5 * c; X.beginPath(); X.moveTo(om[0] + 4, om[1] + 4); X.quadraticCurveTo(ctl[0], ctl[1], ins[0], ins[1]); X.stroke();
      const ma = [(ins[0] + ctl[0]) / 2 + 8, (ins[1] + ctl[1]) / 2]; seta(X, ma[0], ma[1], Math.atan2(ctl[1] - ins[1], ctl[0] - ins[0]), 8, FOR, 1);
      X.beginPath(); X.moveTo(px, py + 5); X.lineTo(px - 9, py + 19); X.lineTo(px + 9, py + 19); X.closePath(); X.fillStyle = CA; X.fill();
      dot(X, px, py, 5, '#0B0F1C', 1); dot(X, px, py, 3.5, CA, 1);
      dot(X, fim[0], fim[1], 9, '#9DA9C4', 1); seta(X, fim[0], fim[1] + 22, PI / 2, 7, '#9DA9C4', 1);
      // legenda da alavanca numa linha, e a frase embaixo
      let lx = x; const ly = y + dh + 4;
      [[CA, 'apoio'], [FOR, 'força'], ['#9DA9C4', 'resistência']].forEach(([cc, s]) => { dot(X, lx + 5, ly, 4.5, cc, 1); txt(X, s, lx + 14, ly, { s: 12, c: TXT }); X.font = `600 12px ${FT}`; lx += X.measureText(s).width + 30; });
      frase.forEach((l, i) => txt(X, l, x, ly + 22 + i * 15, { s: 12, c: DIM, w: 500 }));
    }
    function painel(X, b, t, S, v) {
      const et = ET[v.e], u = v.u;
      if (!b.comp) {
        const px = b.x + 18, pw = b.w - 36;
        medidor(X, px, b.y + 66, pw, et.med, u, false);
        let y = b.y + 128;
        if (et.sub) { subLinha(X, px, y + 6, pw, et.sub, u); y += 24; }
        X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(px, y, pw, 1); y += 14;
        if (et.alav) alavanca(X, px, y + 4, pw, b.y + b.h - y - 12, angCot(u), t);
        else lista(X, px, y, pw, b.y + b.h - 8, et.lista);
      } else {
        const px = b.x + 12, pw = b.w - 24;
        medidor(X, px, b.y + 58, pw, et.med, u, true);
        if (et.sub) subLinha(X, px, b.y + 112, pw, et.sub, u);
        else if (et.lista && b.h > 120) { X.font = `500 12px ${FT}`; const d = et.lista[0][2]; quebra(X, et.lista[0][1] + ': ' + d[0].toLowerCase() + d.slice(1), pw).slice(0, 2).forEach((l, i) => txt(X, l, px, b.y + 110 + i * 16, { s: 12, c: DIM, w: 500 })); }
        else if (et.alav) txt(X, 'Apoio no cotovelo, força do bíceps, peso na mão', px, b.y + 112, { s: 12, c: DIM, w: 500 });
      }
    }

    const c3 = SC['locomotor/esqueleto'];
    if (c3 && c3.extra && c3.extra[0]) c3.extra[0] = Object.assign({}, c3.extra[0], { t: 'O cálcio e a vida do osso' });
    viagem({
      K: 'locomotor/esqueleto', modo: 'esq', nome: 'Esqueleto humano e osso longo', aria: 'Viagem do cálcio pelo esqueleto: etapas',
      mask: { miolo: .94, borda: 1 },
      vistas: [
        ['a', 'locomotor-esqueleto-a', 'Esqueleto adulto', 'Esqueleto humano adulto completo, visto de frente', [.2, 0, .6, 1]],
        ['b', 'locomotor-esqueleto-b', 'Osso longo em corte', 'Fêmur cortado no comprimento, com periósteo, osso compacto, osso esponjoso, medula vermelha e medula amarela', [0, .15, 1, .7]]
      ],
      hs: HS, ET, VAI, faixa: 150, alto: 440, sobre, painel,
      aoAbrir: S => { S.modo = 'esq'; }
    });
  })();
})();
