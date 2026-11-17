/* LAB Plantas e animais: "Briófitas" e "Angiospermas" com figuras de IA realistas e uma viagem por cima de cada uma (Martin).
   Briófitas: vista A, o musgo no barranco (a figura que a rota já usava); vista B (nova), gametófito masculino com a gota de
   água e os anterozoides, gametófito feminino com os arquegônios, esporófito soltando esporos e protonema no solo.
   Viagem do ciclo: esporo, protonema, gametófito, anterozoide nadando até o arquegônio, zigoto, esporófito e cápsula.
   Angiospermas: vista A, a flor em corte (a figura que a rota já usava); vista B (nova), o pistilo em corte com o tubo
   polínico chegando ao óvulo. Viagem do pólen: antera, inseto, estigma, tubo polínico, dupla fecundação, semente e fruto.
   Medidor: conjuntos de cromossomos (n, 2n e, nas angiospermas, 3n). Tocar num ponto leva a viagem até a etapa dele.
   A cena antiga fica atrás de "Ver esquema" (briófitas) ou "Ver em 3D" (angiospermas), pelo LAB_FIGALT (figura-alterna.js).
   Os blocos antigos dessas duas rotas saíram de cenas-figura.js. Com prefers-reduced-motion nada anda sozinho: etapas por botão.
   Carregar depois de cenas-figura.js e antes de LAB_PLANTAS_iniciar(). Texto na tela: sem "!", sem setas ou pontos como separador. */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const RED = LAB_FIGALT.RED, PI = Math.PI, TAU = PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k, fr = v => v - Math.floor(v);
  const sst = (a, b, x) => { const u = cl((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const eIO = u => { u = cl(u, 0, 1); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
  const FT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const TXT = '#E8EDF7', DIM = '#9DA9C4', OK = '#7FD3A0';
  const PN = '#7FD3A0', P2N = '#FFB347', P3N = '#C9AEFF';   // n, 2n e 3n
  const AGUA = '#8FD8FF', POL = '#FFE08A', ESP = '#D9A85B';

  // ---------- curva suave (Catmull-Rom) por pontos em % da figura ----------
  function trilha(P, ar) {
    const N = 12, AM = [], LC = [0];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      for (let j = 0; j < N; j++) { const t = j / N, t2 = t * t, t3 = t2 * t; AM.push([0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3))); }
    }
    AM.push(P[P.length - 1].slice());
    for (let i = 1; i < AM.length; i++) LC.push(LC[i - 1] + Math.hypot((AM[i][0] - AM[i - 1][0]) * ar[0], (AM[i][1] - AM[i - 1][1]) * ar[1]));
    const LT = LC[LC.length - 1] || 1, LF = LC.map(v => v / LT);
    return {
      AM, LF, ar,
      at(f) { f = cl(f, 0, 1); let i = 1; while (i < LF.length - 1 && LF[i] < f) i++; const u = (f - LF[i - 1]) / ((LF[i] - LF[i - 1]) || 1), a = AM[i - 1], b = AM[i]; return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), Math.atan2((b[1] - a[1]) * ar[1], (b[0] - a[0]) * ar[0])]; }
    };
  }
  // traço do caminho já feito: tracejado fino (rastro) ou cheio e brilhante (tubo, haste, filamento)
  function traco(R, X, tr, f0, f1, cor, o) {
    o = o || {}; if (f1 <= f0) return;
    X.save(); X.lineCap = 'round'; X.lineJoin = 'round';
    if (o.cheio) { X.strokeStyle = rgba(cor, o.a == null ? .9 : o.a); X.lineWidth = o.lw || 3; if (o.glow) { X.shadowColor = rgba(cor, .8); X.shadowBlur = o.glow; } }
    else { X.setLineDash([2, 5]); X.strokeStyle = rgba(cor, .65); X.lineWidth = 1.6; }
    X.beginPath(); let st = false;
    const a = tr.at(f0), p0 = R.pt(a[0], a[1]); X.moveTo(p0[0], p0[1]); st = true;
    for (let i = 0; i < tr.AM.length; i++) { if (tr.LF[i] <= f0) continue; if (tr.LF[i] > f1) break; const s = R.pt(tr.AM[i][0], tr.AM[i][1]); X.lineTo(s[0], s[1]); }
    const b = tr.at(f1), q = R.pt(b[0], b[1]); if (st) { X.lineTo(q[0], q[1]); X.stroke(); } X.restore();
  }

  // ---------- desenhos básicos ----------
  function dot(X, x, y, r, c, a) { X.globalAlpha = cl(a == null ? 1 : a, 0, 1); X.beginPath(); X.arc(x, y, Math.max(.2, r), 0, TAU); X.fillStyle = c; X.fill(); X.globalAlpha = 1; }
  function brilho(X, x, y, r, cor, a) { if (a <= 0 || r <= 0) return; const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(cor, cl(a, 0, 1))); g.addColorStop(1, rgba(cor, 0)); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); }
  function anel(X, x, y, r, cor, a, lw) { if (a <= 0) return; X.save(); X.globalAlpha = cl(a, 0, 1); X.strokeStyle = cor; X.lineWidth = lw || 2; X.beginPath(); X.arc(x, y, Math.max(.5, r), 0, TAU); X.stroke(); X.restore(); }
  function pulso(X, x, y, r, cor, T, per) { if (RED) { anel(X, x, y, r * 1.3, cor, .7, 2); return; } const k = fr(T / (per || 1.6)); anel(X, x, y, r * (.6 + k * 1.4), cor, .85 * (1 - k), 2); }
  function com(X, x, y, ang, a, fn) { X.save(); X.globalAlpha = cl(a == null ? 1 : a, 0, 1); X.translate(x, y); X.rotate(ang || 0); fn(); X.restore(); }
  const borda = 'rgba(20,16,8,.75)';
  // bordas esfumadas em retângulo, na cor do palco
  function esfuma(R, X, k) {
    const f = Math.min(R.w, R.h) * (k || .06), C = 'rgba(13,19,34,', x0 = R.x, y0 = R.y, x1 = R.x + R.w, y1 = R.y + R.h;
    [[x0, 0, x0 + f, 0, x0, y0, f, R.h], [x1, 0, x1 - f, 0, x1 - f, y0, f, R.h], [0, y0, 0, y0 + f, x0, y0, R.w, f], [0, y1, 0, y1 - f, x0, y1 - f, R.w, f]].forEach(q => {
      const g = X.createLinearGradient(q[0], q[1], q[2], q[3]); g.addColorStop(0, C + '1)'); g.addColorStop(1, C + '0)'); X.fillStyle = g; X.fillRect(q[4], q[5], q[6], q[7]);
    });
  }
  function txt(X, s, x, y, o = {}) { X.font = `${o.w || 600} ${o.s || 13}px ${FT}`; X.fillStyle = o.c || TXT; X.textAlign = o.a || 'left'; X.textBaseline = 'middle'; X.fillText(s, x, y); }
  function quebra(X, s, w, o) { X.font = `${o.w || 500} ${o.s || 13}px ${FT}`; const L = []; let l = ''; s.split(' ').forEach(p => { const n = l ? l + ' ' + p : p; if (X.measureText(n).width > w && l) { L.push(l); l = p; } else l = n; }); if (l) L.push(l); return L; }
  function bloco(X, s, x, y, w, o, seco) { const L = quebra(X, s, w, o), lh = o.lh || 18; if (!seco) L.forEach((l, i) => txt(X, l, x, y + i * lh, o)); return L.length * lh; }

  // ---------- medidor de cromossomos: casas n, 2n (e 3n); acende a casa de quem a viagem acompanha ----------
  const PLN = [['n', 'haploide', PN], ['2n', 'diploide', P2N], ['3n', 'triploide', P3N]];
  function medPloidia(nc) {
    return (X, x, y, w, v, comp) => {
      const on = v.pl.slice(0, nc), ia = on.indexOf(Math.max(...on));
      const ac = PLN.slice(0, nc).filter((p, i) => on[i] > .5), acesos = ac.length > 1 ? ac.map(p => p[1]) : ac.map(p => `${p[1]} (${p[0]})`);
      txt(X, 'Cromossomos', x, y + 8, { s: comp ? 13 : 14 });
      if (!comp || W > 520) txt(X, acesos.join(' e '), x + w, y + 8, { s: 12, c: PLN[ia][2], a: 'right', w: 600 });
      const by = y + (comp ? 22 : 26), bh = comp ? 28 : 34, gap = 6, cw = (w - gap * (nc - 1)) / nc;
      for (let i = 0; i < nc; i++) {
        const bx = x + i * (cw + gap), k = cl(on[i], 0, 1), c = PLN[i][2];
        X.fillStyle = 'rgba(255,255,255,.06)'; X.beginPath(); X.roundRect(bx, by, cw, bh, 8); X.fill();
        if (k > .01) { X.fillStyle = rgba(c, .24 * k); X.fill(); X.save(); X.globalAlpha = k; X.strokeStyle = c; X.lineWidth = 1.5; X.stroke(); X.restore(); }
        txt(X, PLN[i][0], bx + cw / 2, by + bh / 2 + .5, { s: comp ? 15 : 17, c: k > .5 ? TXT : DIM, a: 'center', w: k > .5 ? 700 : 500 });
      }
      return by + bh - y;
    };
  }

  // ---------- fábrica da viagem: etapas, botões, painel e registro no LAB_FIGALT ----------
  const ICO = { ant: '<path d="M14.5 6 8.5 12l6 6"/>', prox: '<path d="m9.5 6 6 6-6 6"/>', pausa: '<path d="M9 6v12M15 6v12"/>', play: '<path d="M8 5.5v13l10-6.5z"/>' };
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;
  let cssOk = false;
  function css() {
    if (cssOk) return; cssOk = true;
    const st = document.createElement('style'); st.id = 'fp-css';
    st.textContent = `.fp-nav{position:absolute;left:0;top:0;z-index:2;display:flex;flex-direction:column;gap:6px}
.fp-nav[hidden]{display:none}
.fp-nav .row{display:flex;align-items:center;gap:6px}
.fp-nav .row button{font:inherit;width:44px;height:44px;flex:none;display:grid;place-items:center;border-radius:10px;border:1px solid var(--line-strong,#5B6C99);background:rgba(19,26,43,.92);color:var(--txt,#E8EDF7);cursor:pointer;transition:background-color 90ms,border-color 90ms}
.fp-nav .row button:hover{background:var(--panel-2,#1B2440);border-color:var(--amber,#FFB347)}
.fp-nav button:active{transform:scale(.96)}
.fp-nav button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
.fp-nav .row button svg{width:22px;height:22px}
.fp-nav .row button[hidden]{display:none}
.fp-nav .et{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;padding:0 6px;line-height:1.2}
.fp-nav .et small{font-size:12px;color:var(--dim,#9DA9C4)}
.fp-nav .et b{font-size:14px;font-weight:600;color:var(--txt,#E8EDF7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(prefers-reduced-motion:reduce){.fp-nav button{transition:none}.fp-nav button:active{transform:none}}`;
    document.head.appendChild(st);
  }

  function viagem(o) {
    const c3 = SC[o.K]; if (!c3) return;
    const ET = o.ET, NE = ET.length, NC = o.nc;
    const novo = () => ({ e: 0, u: RED ? 1 : 0, hold: 0, pausa: false, ini: true, pl: [1, 0, 0] });
    let FIG = null, Sx = null, ultAb = null, Rfig = null, vivo = 0, NAV = null, sincK = '', navK = '';
    const plAlvo = v => { const L = ET[v.e].pl(RED ? 1 : v.u), r = [0, 0, 0]; L.forEach(i => { r[i] = 1; }); return r; };
    function irPara(S, e, troca) {
      const v = S.vg; v.e = (e + NE) % NE; v.u = RED ? 1 : 0; v.hold = 0;
      if (RED) v.pl = plAlvo(v);
      if (troca && FIG && FIG.vistaAtual !== ET[v.e].v) FIG.mostrar(ET[v.e].v);
      sinc(S);
    }
    function avancar(S, dt) {
      const v = S.vg, et = ET[v.e];
      if (RED || v.pausa || !dt) return;
      const k = dt * (S.v || 1);
      if (v.u < 1) { v.u = Math.min(1, v.u + k / et.dur); return; }
      v.hold += k;
      if (v.e < NE - 1) { if (v.hold > 1.4) irPara(S, v.e + 1, true); }
      else if (v.hold > 3) irPara(S, 0, true);
    }
    function montarNav() {
      if (NAV) return; css();
      NAV = document.createElement('div'); NAV.className = 'fp-nav'; NAV.hidden = true; NAV.setAttribute('role', 'group'); NAV.setAttribute('aria-label', o.aria);
      NAV.innerHTML = `<div class="row"><button type="button" data-a="ant" aria-label="Etapa anterior" title="Etapa anterior">${svg('ant')}</button>`
        + `<div class="et" aria-live="polite"><small></small><b></b></div>`
        + `<button type="button" data-a="pausa"${RED ? ' hidden' : ''}></button>`
        + `<button type="button" data-a="prox" aria-label="Próxima etapa" title="Próxima etapa">${svg('prox')}</button></div>`;
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
    const NAVH = 50, med = medPloidia(NC);
    const compacto = () => NAR || W < 1160;
    const capRes = () => NAR ? 116 : 76, faixaH = () => NAVH + 70;
    const reserva = () => compacto() ? capRes() + faixaH() + 8 : 84;   // no computador, a figura termina acima da legenda

    function sobre(R, X, t, c) {
      const S = c.S; if (!S || !S.vg) return; Sx = S; vivo = performance.now();
      const ab = FIG && FIG.aberto ? FIG.aberto.id : null;
      if (ab !== ultAb) { ultAb = ab; const q = ab != null ? o.VAI[ab] : null; if (q != null && q !== S.vg.e) irPara(S, q, false); }
      avancar(S, S.dt || 0);
      const v = S.vg, et = ET[v.e], al = plAlvo(v), kk = RED ? 1 : Math.min(1, (S.dt || 0) * 6);
      for (let i = 0; i < 3; i++) v.pl[i] += (al[i] - v.pl[i]) * kk;
      Rfig = R; esfuma(R, X, o.esf && o.esf[R.vista]);
      if (R.vista !== et.v) return;   // o aluno trocou de vista à mão: só a figura, sem a viagem
      const s = R.s * ((o.sk && o.sk[R.vista]) || 1);   // com recorte, R.s mede 1% do recorte; aqui volta a medir 1% da imagem
      o.desenha({ R, X, T: RED ? 2.2 : t, v, et, uu: RED ? .7 : eIO(v.u), u: RED ? 1 : v.u, s, P: (x, y) => R.pt(x, y), L: cl(s * 3.2, 14, 40) });
    }
    function conteudo(X, x, y, w, v, seco) {
      const et = ET[v.e]; let yy = y;
      yy += (seco ? 60 : med(X, x, yy, w, v, false)) + 20;
      [['O que a viagem acompanha', et.obj, TXT], [o.rotOnde, et.onde, et.cor || TXT]].forEach(([r, s, c]) => {
        if (!seco) txt(X, r, x, yy, { s: 12, c: DIM, w: 500 }); yy += 18;
        yy += bloco(X, s, x, yy, w, { s: 14, lh: 18, c }, seco) + 8;
      });
      if (!seco) { X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(x, yy, w, 1); } yy += 16;
      yy += bloco(X, o.nota, x, yy, w, { s: 13, lh: 17, c: DIM, w: 500 }, seco);
      return yy - y;
    }
    function fora(X, t, c) {
      const S = c.S; if (!S || !S.vg || !Rfig) return; montarNav(); sinc(S); NAV.hidden = false;
      const v = S.vg;
      if (!compacto()) {
        const x0 = 24, w = 320, y0 = 60, px = x0 + 18, pw = w - 36, cy = y0 + 10 + NAVH + 16;
        const h = NAVH + 40 + conteudo(X, px, cy, pw, v, true);
        X.fillStyle = 'rgba(11,15,28,.8)'; X.beginPath(); X.roundRect(x0, y0, w, h, 14); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
        posNav(x0 + 10, y0 + 10, w - 20);
        conteudo(X, px, cy, pw, v, false);
      } else {
        const x0 = NAR ? 6 : 24, w = W - 2 * x0, h = faixaH(), y0 = H - capRes() - h - 4;
        X.fillStyle = 'rgba(11,15,28,.84)'; X.beginPath(); X.roundRect(x0, y0, w, h, 12); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
        posNav(x0 + 6, y0 + 6, w - 12);
        med(X, x0 + 12, y0 + NAVH + 10, w - 24, v, true);
      }
    }
    const amb = {
      SC, X: () => X, W: () => W, H: () => H, nar: () => NAR, tela: cv.parentNode,
      cap: () => { const S = Sx; cap(S && S.vg ? ET[S.vg.e].cap : ''); },
      t: a => a[0], rot3d: o.rot3d, dica3d: o.dica3d,
      esconder: ['.hud.onde'], esconderFig: ['.palco .ctl', '#extra']
    };
    LAB_FIGALT.cena(amb, o.K, { pref: 'plantas-animais', nome: o.nome, mask: false, vistas: o.vistas, hs: o.HS, reserva, sobre, fora });
    FIG = c3.figura;
    const dFig = c3.draw, i1 = c3.init;
    c3.init = function (S) { i1.call(this, S); S.vg = novo(); if (RED) S.vg.pl = plAlvo(S.vg); sincK = ''; ultAb = null; };
    c3.draw = function (t, S) {
      if (!S.vg) { S.vg = novo(); if (RED) S.vg.pl = plAlvo(S.vg); }
      if (S.vg.ini && FIG) { S.vg.ini = false; const vv = ET[S.vg.e].v; if (FIG.vistaAtual !== vv) FIG.mostrar(vv); }
      return dFig.call(this, t, S);
    };
  }

  // =====================================================================================
  // BRIÓFITAS
  // =====================================================================================
  const ARA = [.88, .657], ARB = [.88, .491];
  // esporo: grão marrom com halo verde (n)
  function esporo(X, x, y, r, a) { if (a <= 0) return; brilho(X, x, y, r * 3, PN, .35 * a); dot(X, x, y, r, ESP, a); dot(X, x - r * .3, y - r * .3, r * .35, '#F6DDAA', a * .9); }
  // anterozoide: corpo curvo e dois flagelos que batem (a frente aponta para ang)
  function anterozoide(X, x, y, ang, L, T, a) {
    com(X, x, y, ang, a, () => {
      const ph = RED ? 0 : T * 18;
      X.strokeStyle = '#E8F4FF'; X.lineCap = 'round'; X.lineWidth = Math.max(1.6, L * .16);
      X.beginPath(); X.moveTo(-L * .35, L * .05); X.quadraticCurveTo(0, -L * .18, L * .35, 0); X.stroke();
      X.lineWidth = Math.max(.8, L * .05); X.strokeStyle = 'rgba(232,244,255,.85)';
      [-1, 1].forEach(sg => { X.beginPath(); X.moveTo(L * .35, 0); for (let j = 1; j <= 8; j++) { const q = j / 8; X.lineTo(L * .35 + q * L * .55, sg * q * L * .25 + Math.sin(q * 6 - ph + sg) * L * .08); } X.stroke(); });
    });
  }
  // célula com núcleo: oosfera (n) ou zigoto (2n)
  function celula(X, x, y, r, cor, a) { brilho(X, x, y, r * 2.6, cor, .45 * a); dot(X, x, y, r, rgba(cor, .55), a); anel(X, x, y, r, cor, a, 1.5); dot(X, x, y, r * .38, cor, a); }

  const BR = {
    esp: trilha([[83, 11], [86.5, 18], [86, 30], [81, 45], [73, 62], [64, 77], [57, 84.5]], ARB),
    fil: [trilha([[57, 84.5], [53, 86.5], [48, 86], [43, 87.5], [38, 86.5], [33, 88]], ARB), trilha([[57, 84.5], [61, 87.5], [66, 87], [71, 89.5]], ARB), trilha([[57, 84.5], [55.5, 89], [52.5, 93]], ARB)],
    tapete: trilha([[8, 52], [20, 44], [33, 48], [46, 55], [60, 60], [73, 56], [86, 62]], ARA),
    ant: trilha([[27.5, 31.5], [32, 23], [40, 17.5], [49, 18], [56, 24], [60.2, 31], [61.5, 35.5], [61.5, 42], [61.5, 48.4]], ARB),
    seta: trilha([[76, 59.5], [75.6, 50], [75.5, 40], [75.6, 30], [76.3, 22], [78, 16.5], [80.2, 13.5]], ARB),
    sai: [[[83, 10.5], [86, 12], [89, 15.5], [92, 21]], [[83, 10.5], [87, 10], [91, 12], [94, 16]], [[83, 10.5], [85, 15], [86.5, 22], [87, 29]]].map(p => trilha(p, ARB))
  };
  const BROT = [[33, 87.5], [71, 89], [52.5, 92.5], [42, 87]];
  const MANCHAS = [[22, 47], [38, 57], [55, 62], [72, 55], [88, 60], [30, 72], [62, 75], [12, 60]];
  const OOS = [61.5, 48.6];

  viagem({
    K: 'plantae/briofitas', nc: 2, nome: 'Ciclo de vida do musgo', aria: 'Ciclo do musgo: etapas', rotOnde: 'Geração',
    rot3d: 'Ver esquema', dica3d: '',
    nota: 'Nas briófitas, o gametófito (n) é a fase duradoura e verde. O esporófito (2n) é temporário e vive preso a ele.',
    vistas: [
      ['a', 'plantae-briofitas-a', 'Musgo no barranco', 'Musgo em barranco úmido: o tapete verde são gametófitos e as hastes com cápsula são esporófitos'],
      ['b', 'briofitas-v5b', 'Ciclo de perto', 'Gametófito masculino com uma gota de água na roseta, gametófito feminino com arquegônios, esporófito soltando esporos e protonema no solo']
    ],
    HS: [
      { id: 'cap', c: '#FFA94D', t: 'Cápsula', d: 'Dentro da cápsula se formam os esporos, por meiose. É a parte reprodutiva do esporófito.', em: { a: [46, 19] }, z: 2.8 },
      { id: 'seta', c: '#F28B8B', t: 'Haste (seta)', d: 'A haste ergue a cápsula acima do musgo, o que ajuda a dispersar os esporos pelo vento.', em: { a: [46, 30] }, z: 2.8 },
      { id: 'gam', c: '#A9C54A', t: 'Gametófito verde', d: 'A parte verde e folhosa é o gametófito (n), a fase duradoura e dominante da briófita. Faz fotossíntese e sustenta o esporófito.', em: { a: [45, 60] }, z: 2.4 },
      { id: 'umi', c: '#8FD8FF', t: 'Ambiente úmido', d: 'As briófitas não têm vasos condutores e o anterozoide precisa de uma película de água para nadar até a oosfera. Por isso vivem em lugares úmidos e são pequenas.', em: { a: [30, 86] }, z: 2.4 },
      { id: 'masc', c: '#A9C54A', t: 'Gametófito masculino', d: 'Na roseta do alto ficam os anterídios, que formam os anterozoides (n) por mitose. Na maioria dos musgos, as plantas masculinas e femininas são separadas.', em: { b: [27, 45] }, z: 2.6 },
      { id: 'gota', c: AGUA, t: 'Gota de água', d: 'Os anterozoides têm flagelos e só se movem na água. Uma gota de chuva que respinga leva os anterozoides até a planta feminina.', em: { b: [27.5, 31.5] }, z: 3.2 },
      { id: 'arq', c: '#F2B6C6', t: 'Arquegônios', d: 'Órgãos em forma de garrafa no alto do gametófito feminino. O anterozoide entra pelo gargalo e nada até a oosfera, que fica na base.', em: { b: [61.5, 38] }, z: 3.2 },
      { id: 'oos', c: PN, t: 'Oosfera', d: 'O gameta feminino (n), parado no fundo do arquegônio. Unida ao anterozoide forma o zigoto (2n), que cresce ali mesmo.', em: { b: [64.6, 50] }, z: 3.6 },
      { id: 'esf', c: P2N, t: 'Esporófito', d: 'Haste com a cápsula, diploide (2n). Cresce em cima do gametófito feminino e depende dele para receber água e alimento.', em: { b: [75.6, 38] }, z: 2.8 },
      { id: 'capb', c: '#FFA94D', t: 'Cápsula aberta', d: 'Na cápsula, a meiose forma os esporos (n). Quando a tampa cai, os esporos saem e o vento os leva.', em: { b: [80.5, 13] }, z: 3 },
      { id: 'espb', c: ESP, t: 'Esporos', d: 'Células haploides (n) que o vento espalha. Num lugar úmido, cada esporo germina e forma o protonema.', em: { b: [89, 22] }, z: 3 },
      { id: 'prot', c: PN, t: 'Protonema', d: 'Filamento verde que nasce do esporo e se espalha pelo solo. Dele brotam os novos gametófitos.', em: { b: [45, 87] }, z: 2.8 },
      { id: 'gfem', c: '#A9C54A', t: 'Gametófito feminino', d: 'A planta que recebeu o anterozoide. O esporófito fica preso nela, no mesmo lugar onde estava o arquegônio.', em: { b: [77, 72] }, z: 2.6 }
    ],
    VAI: { cap: 6, seta: 5, gam: 2, umi: 3, masc: 3, gota: 3, arq: 4, oos: 4, esf: 5, capb: 6, espb: 0, prot: 1, gfem: 5 },
    ET: [
      { id: 'esp', nome: 'Esporo', v: 'b', dur: 6, pl: () => [0], obj: 'Um esporo, levado pelo vento', onde: 'Esporo (n), que dará o gametófito', cor: PN,
        cap: 'Os <b>esporos</b> (n) saem da cápsula e o vento os espalha. Num solo <b>úmido</b>, cada esporo pode dar origem a uma nova planta.' },
      { id: 'pro', nome: 'Protonema', v: 'b', dur: 6, pl: () => [0], obj: 'O esporo germina e vira um filamento', onde: 'Gametófito jovem (n)', cor: PN,
        cap: 'O esporo germina e forma o <b>protonema</b>, um filamento verde que se espalha pelo solo. Dele brotam os novos musgos.' },
      { id: 'gam', nome: 'Gametófito', v: 'a', dur: 6, pl: () => [0], obj: 'O tapete verde de musgo', onde: 'Gametófito (n), a fase duradoura', cor: PN,
        cap: 'Cada broto cresce e vira um <b>gametófito</b> (n): o musgo verde que vemos. É a fase <b>duradoura</b> e faz fotossíntese.' },
      { id: 'ant', nome: 'Anterozoides', v: 'b', dur: 7, pl: () => [0], obj: 'Anterozoides com flagelos', onde: 'Gametas do gametófito (n)', cor: PN,
        cap: 'Na roseta da planta masculina, o anterídio solta os <b>anterozoides</b>. Eles nadam numa <b>gota de água</b> que respinga até a planta feminina e descem pelo gargalo do <b>arquegônio</b>.' },
      { id: 'zig', nome: 'Zigoto', v: 'b', dur: 6, pl: u => u < .5 ? [0] : [1], obj: 'Anterozoide e oosfera se unem', onde: 'Fecundação: de n para 2n', cor: P2N,
        cap: 'No fundo do arquegônio, o anterozoide se une à <b>oosfera</b>: é a <b>fecundação</b>. Forma-se o <b>zigoto</b> (2n), sem sair da planta feminina.' },
      { id: 'esf', nome: 'Esporófito', v: 'b', dur: 7, pl: () => [1], obj: 'O zigoto cresce em haste e cápsula', onde: 'Esporófito (2n), preso ao gametófito', cor: P2N,
        cap: 'O zigoto cresce <b>em cima do gametófito feminino</b> e forma o <b>esporófito</b> (2n): uma haste com uma <b>cápsula</b> na ponta. Ele depende do gametófito para ter água e alimento.' },
      { id: 'cap', nome: 'Cápsula e esporos', v: 'b', dur: 7, pl: u => u < .45 ? [1] : [0], obj: 'Meiose na cápsula forma esporos', onde: 'De 2n para n: o ciclo recomeça', cor: PN,
        cap: 'Na cápsula, a <b>meiose</b> forma os <b>esporos</b> (n). A tampa cai, o vento leva os esporos e o <b>ciclo recomeça</b>.' }
    ],
    desenha({ R, X, T, v, et, uu, u, s, P, L }) {
      const id = et.id, rE = Math.max(2.2, s * .5);
      if (id === 'esp') {
        const cp = P(82.5, 11); brilho(X, cp[0], cp[1], s * 4, P2N, .3); pulso(X, cp[0], cp[1], s * 2, ESP, T);
        // esporos soltos no ar, e um que a viagem segue até o solo
        for (let i = 0; i < 7; i++) { const tr = BR.sai[i % 3], f = RED ? (i + .5) / 7 : fr(T * .14 + i / 7), p = tr.at(f), q = P(p[0], p[1]); esporo(X, q[0] + (i % 2 ? s * .8 : 0), q[1], rE * .8, Math.sin(PI * f)); }
        traco(R, X, BR.esp, 0, uu, PN);
        const p = BR.esp.at(uu), q = P(p[0], p[1]); esporo(X, q[0], q[1], rE * 1.4, 1);
        if (uu > .9) { const c = P(57, 84.5); pulso(X, c[0], c[1], s * 2.2, PN, T); }
      } else if (id === 'pro') {
        const c = P(57, 84.5); esporo(X, c[0], c[1], rE * 1.4, 1 - sst(0, .4, u));
        BR.fil.forEach((tr, i) => { const f = cl(uu * (1.15 - i * .12), 0, 1); traco(R, X, tr, 0, f, PN, { cheio: true, lw: Math.max(2, s * .35), glow: 8 }); const p = tr.at(f), q = P(p[0], p[1]); if (f > .02) dot(X, q[0], q[1], Math.max(2, s * .4), '#D9FFB0', .9); });
        BROT.forEach(([x, y], i) => { const k = sst(.65 + i * .07, .85 + i * .05, u) + (RED ? 1 : 0); if (k > 0) { const b = P(x, y); brilho(X, b[0], b[1], s * 2.5, PN, .5 * Math.min(1, k)); pulso(X, b[0], b[1], s * 1.6, PN, T + i * .4, 2); } });
      } else if (id === 'gam') {
        traco(R, X, BR.tapete, 0, uu, PN);
        const p = BR.tapete.at(uu), q = P(p[0], p[1]); brilho(X, q[0], q[1], L * 2, PN, .7); anel(X, q[0], q[1], Math.max(6, s * 1.2), '#E6FFC8', .9, 2); dot(X, q[0], q[1], Math.max(3, s * .5), '#E6FFC8', 1);
        MANCHAS.forEach(([x, y], i) => { const k = sst(i * .1, i * .1 + .25, u) + (RED ? 1 : 0); if (k > 0) { const m = P(x, y); brilho(X, m[0], m[1], s * 6, PN, .22 * Math.min(1, k)); pulso(X, m[0], m[1], s * 2.4, PN, T + i * .3, 2.2); } });
      } else if (id === 'ant') {
        const g = P(27.5, 31.5); brilho(X, g[0], g[1], s * 4, AGUA, .35); pulso(X, g[0], g[1], s * 3, AGUA, T);
        // a água que respinga faz a ponte; os anterozoides nadam nela
        traco(R, X, BR.ant, 0, Math.min(1, uu + .06), AGUA, { cheio: true, a: .28, lw: Math.max(4, s * 1.1) });
        traco(R, X, BR.ant, 0, uu, AGUA);
        for (let i = 3; i >= 0; i--) { const f = cl(uu - i * .035, 0, 1), p = BR.ant.at(f), q = P(p[0], p[1]); if (i && f <= 0) continue; anterozoide(X, q[0] + (i ? Math.sin(T * 3 + i) * s * .4 : 0), q[1], p[2], L * (i ? .7 : .9), T + i, i ? .75 : 1); }
        const o2 = P(OOS[0], OOS[1]); celula(X, o2[0], o2[1], Math.max(3.5, s * .75), PN, .9);
        if (uu > .55) { const n = P(61.5, 35.5); pulso(X, n[0], n[1], s * 1.8, '#F2B6C6', T); }
      } else if (id === 'zig') {
        const o2 = P(OOS[0], OOS[1]), r = Math.max(3.5, s * .8), k = sst(.4, .55, u) + (RED ? 1 : 0);
        if (k < 1) { const a = P(61.5, lerp(42, OOS[1] - .6, sst(0, .45, u))); anterozoide(X, a[0], a[1], PI / 2, L * .85, T, 1 - k); celula(X, o2[0], o2[1], r, PN, 1 - k); }
        if (k > 0) { celula(X, o2[0], o2[1], r * 1.15, P2N, Math.min(1, k)); if (!RED && u < .7) anel(X, o2[0], o2[1], r * (1.5 + 5 * sst(.45, .7, u)), '#FFFFFF', .8 * (1 - sst(.45, .7, u)), 2); pulso(X, o2[0], o2[1], r * 2, P2N, T); }
      } else if (id === 'esf') {
        const b = P(76, 59.5); brilho(X, b[0], b[1], s * 3, P2N, .45);
        traco(R, X, BR.seta, 0, uu, P2N, { cheio: true, lw: Math.max(2.5, s * .4), glow: 10, a: .85 });
        const p = BR.seta.at(uu), q = P(p[0], p[1]); dot(X, q[0], q[1], Math.max(3, s * .5), '#FFE2B0', 1);
        if (uu > .85) { const c = P(80.6, 13); brilho(X, c[0], c[1], s * 5, P2N, .5 * sst(.85, 1, uu)); }
        const g = P(77, 70); pulso(X, g[0], g[1], s * 3, PN, T, 2.2);
      } else if (id === 'cap') {
        const c = P(80.6, 13), m = sst(.2, .45, u) + (RED ? 1 : 0);
        brilho(X, c[0], c[1], s * 5, P2N, .5 * (1 - Math.min(1, m) * .6));
        if (!RED && u > .2 && u < .5) anel(X, c[0], c[1], s * (2 + 6 * sst(.2, .5, u)), '#FFFFFF', .8 * (1 - sst(.2, .5, u)), 2);
        if (m > .5) for (let i = 0; i < 12; i++) { const tr = BR.sai[i % 3], f = RED ? (i + .5) / 12 : fr(T * .2 + i / 12) * sst(.45, .7, u), p = tr.at(f), q = P(p[0], p[1]); esporo(X, q[0] + ((i >> 2) - 1) * s * .7, q[1], rE, Math.min(1, Math.sin(PI * f) * 2)); }
        pulso(X, c[0], c[1], s * 2.4, m > .5 ? PN : P2N, T);
      }
    }
  });

  // =====================================================================================
  // ANGIOSPERMAS
  // =====================================================================================
  const ARF = [.88, .491];
  // abelha: corpo listrado, asas que batem e grãos de pólen grudados (a frente aponta para ang)
  function abelha(X, x, y, ang, L, T, polen) {
    com(X, x, y, ang, 1, () => {
      const bat = RED ? .4 : Math.sin(T * 40) * .5 + .5;
      X.fillStyle = 'rgba(220,235,255,.55)'; X.strokeStyle = 'rgba(220,235,255,.8)'; X.lineWidth = 1;
      [-1, 1].forEach(sg => { X.beginPath(); X.ellipse(-L * .05, sg * L * (.22 + .12 * bat), L * .3, L * .14, sg * (.5 + .4 * bat), 0, TAU); X.fill(); X.stroke(); });
      X.beginPath(); X.ellipse(-L * .2, 0, L * .34, L * .22, 0, 0, TAU); X.fillStyle = '#E8B23A'; X.fill();
      X.save(); X.clip(); X.fillStyle = '#2A1E10'; [-.38, -.2, -.02].forEach(k => X.fillRect(-L * .2 + k * L, -L * .3, L * .08, L * .6)); X.restore();
      X.strokeStyle = borda; X.lineWidth = 1; X.stroke();
      X.beginPath(); X.ellipse(L * .2, 0, L * .14, L * .14, 0, 0, TAU); X.fillStyle = '#3A2A16'; X.fill();
      X.beginPath(); X.arc(L * .36, 0, L * .1, 0, TAU); X.fillStyle = '#2A1E10'; X.fill();
      if (polen > 0) for (let i = 0; i < 6; i++) dot(X, -L * .25 + (i % 3) * L * .14, (i < 3 ? -1 : 1) * L * .2, Math.max(1.4, L * .06), POL, polen);
    });
  }
  function grao(X, x, y, r, a) { if (a <= 0) return; brilho(X, x, y, r * 2.6, POL, .4 * a); dot(X, x, y, r, '#F4D77A', a); dot(X, x - r * .3, y - r * .3, r * .35, '#FFF6D0', a); }
  // etiqueta curta presa a uma estrutura (lado: 'l' começa no ponto, 'r' termina nele)
  function etiqueta(X, x, y, s0, cor, lado, a) {
    if (a <= 0) return; X.save(); X.globalAlpha = cl(a, 0, 1); X.font = `600 12px ${FT}`; X.textBaseline = 'middle';
    const w = X.measureText(s0).width + 18, x0 = lado === 'r' ? x - w : x;
    X.fillStyle = 'rgba(11,15,28,.86)'; X.beginPath(); X.roundRect(x0, y - 11, w, 22, 11); X.fill(); X.strokeStyle = rgba(cor, .9); X.lineWidth = 1.2; X.stroke();
    X.fillStyle = TXT; X.fillText(s0, x0 + 9, y + .5); X.restore();
  }
  function nucleo(X, x, y, r, cor, a) { brilho(X, x, y, r * 2.6, cor, .5 * a); dot(X, x, y, r, cor, a); anel(X, x, y, r, 'rgba(20,16,8,.7)', a, 1); }

  const AN = {
    ants: [[40.8, 23], [43, 21], [45.5, 19.5], [54, 19.5], [56.5, 21], [59, 23.5]],
    ins: trilha([[22, 30], [28, 26.5], [34, 23.5], [40.5, 21.5], [44, 18.5], [46.5, 12], [48.6, 7], [50, 7.5]], ARF),
    tubo: trilha([[52.3, 6.3], [51.4, 12], [50.6, 20], [50.3, 30], [50.4, 40], [51.4, 48], [52.9, 55], [54.6, 61], [55.6, 68], [55.7, 75], [55.5, 80], [54.4, 85], [52.8, 88], [51, 87.3], [50.2, 85.2], [50, 83.4]], ARF),
    ovs: [[47.9, 59.2], [47.9, 60.9], [47.9, 62.6], [47.9, 64.2], [47.9, 65.9], [47.9, 67.4], [47.9, 69.2], [47.9, 70.7], [52.1, 59.2], [52.1, 60.9], [52.1, 62.6], [52.1, 64.2], [52.1, 65.9], [52.1, 67.4], [52.1, 69.2], [52.1, 70.7]],
    graos: [[44.5, 6.5], [46, 8.2], [47.5, 6], [45, 10.5], [48, 9.6], [49, 7], [53.5, 7.5], [54.6, 8.6]],
    n2: trilha([[50, 83.4], [51.3, 81], [51.4, 78], [50.6, 75.5], [50.2, 74.2]], ARF)
  };
  const MIC = [50, 83.4], OOA = [50, 80.6], POLS = [[49.6, 73.6], [50.4, 74.6]], POLC = [50, 74.1];

  viagem({
    K: 'plantae/angiospermas', nc: 3, nome: 'Flor em corte e a viagem do pólen', aria: 'Viagem do pólen: etapas', rotOnde: 'Onde está',
    rot3d: 'Ver em 3D', dica3d: 'Arraste para girar o modelo', sk: { b: .56 }, esf: { b: .22 },
    nota: 'A dupla fecundação, com zigoto 2n e endosperma 3n, é exclusiva das angiospermas. O tubo polínico dispensa a água para a fecundação.',
    vistas: [
      ['a', 'plantae-angiospermas-a', 'Flor em corte', 'Flor cortada ao meio, com sépalas, pétalas, estames e o carpelo com óvulos'],
      ['b', 'angiospermas-v5b', 'Pistilo de perto', 'Pistilo em corte: grãos de pólen no estigma, tubo polínico descendo pelo estilete e entrando no óvulo pela micrópila', [.22, 0, .56, 1]]
    ],
    HS: [
      { id: 'est', c: '#F28B8B', t: 'Estigma', d: 'Ponta do carpelo, em geral pegajosa, que recebe o grão de pólen. A chegada do pólen ao estigma é a polinização.', em: { a: [50, 9] }, z: 3 },
      { id: 'sty', c: '#FFD43B', t: 'Estilete', d: 'Tubo que liga o estigma ao ovário. O tubo polínico cresce por dentro dele até chegar aos óvulos.', em: { a: [50, 33] }, z: 3 },
      { id: 'ova', c: '#A9C54A', t: 'Ovário com óvulos', d: 'Guarda os óvulos. Depois da fecundação, o óvulo vira semente e o ovário vira fruto. Só as angiospermas têm fruto.', em: { a: [50, 64] }, z: 3 },
      { id: 'ant', c: '#FFA94D', t: 'Antera', d: 'Parte do estame que produz os grãos de pólen. O conjunto dos estames forma o androceu, a parte masculina da flor.', em: { a: [57, 21] }, z: 3 },
      { id: 'fil', c: '#C9AEFF', t: 'Filete', d: 'Haste fina que sustenta a antera.', em: { a: [53, 39] }, z: 3 },
      { id: 'pet', c: '#F2B6C6', t: 'Pétalas', d: 'Formam a corola. Com cores e perfume, atraem polinizadores. Em outras flores, o vento poliniza e as pétalas são pequenas.', em: { a: [69, 39] }, z: 2.4 },
      { id: 'sep', c: '#8FD8FF', t: 'Sépalas', d: 'Folhas verdes e pequenas na base da flor. Formam o cálice e protegem o botão ainda fechado.', em: { a: [36, 66] }, z: 2.8 },
      { id: 'grb', c: POL, t: 'Grãos de pólen no estigma', d: 'Cada grão de pólen é o gametófito masculino, bem pequeno. Grudado no estigma, ele germina e forma o tubo polínico.', em: { b: [46, 9] }, z: 3.4 },
      { id: 'tub', c: '#FFE9A8', t: 'Tubo polínico', d: 'Cresce pelo estilete até o óvulo e leva dois núcleos espermáticos. Assim a fecundação não depende de água.', em: { b: [50.4, 38] }, z: 2.8 },
      { id: 'mic', c: '#F2B6C6', t: 'Micrópila', d: 'Pequena abertura nos tegumentos, embaixo do óvulo. É por ela que o tubo polínico entra.', em: { b: [50, 86.5] }, z: 3.8 },
      { id: 'oos', c: P2N, t: 'Oosfera e sinérgides', d: 'A oosfera (n) é o gameta feminino, ladeada por duas sinérgides, perto da micrópila. Com um núcleo espermático, forma o zigoto (2n), que vira o embrião.', em: { b: [48.3, 81] }, z: 4 },
      { id: 'pol', c: P3N, t: 'Núcleos polares', d: 'Dois núcleos (n) no centro do saco embrionário. Com o outro núcleo espermático formam uma célula 3n, que origina o endosperma, a reserva da semente.', em: { b: [50, 74.1] }, z: 4 },
      { id: 'atp', c: '#CFE0FF', t: 'Antípodas', d: 'Três células no alto do saco embrionário, do lado oposto à micrópila. Não participam da fecundação.', em: { b: [50, 67.4] }, z: 4 },
      { id: 'ovb', c: '#A9C54A', t: 'Parede do ovário', d: 'Depois da fecundação, ela cresce e vira o fruto, que protege a semente e ajuda a espalhá-la.', em: { b: [42.5, 72] }, z: 3 }
    ],
    VAI: { est: 2, sty: 3, ova: 5, ant: 0, fil: 0, pet: 1, sep: 5, grb: 2, tub: 3, mic: 4, oos: 4, pol: 4, atp: 4, ovb: 5 },
    ET: [
      { id: 'ant', nome: 'Antera', v: 'a', dur: 5, pl: () => [0], obj: 'Grãos de pólen', onde: 'Nas anteras dos estames', cor: POL,
        cap: 'Nas <b>anteras</b>, se formam os <b>grãos de pólen</b>. Cada grão é o gametófito masculino, bem pequeno, e vai levar os gametas (n).' },
      { id: 'ins', nome: 'Inseto', v: 'a', dur: 7, pl: () => [0], obj: 'Pólen grudado no inseto', onde: 'Da antera ao estigma', cor: POL,
        cap: 'Atraída pela cor, pelo perfume e pelo néctar, a <b>abelha</b> encosta nas anteras e leva o pólen até o <b>estigma</b>, em geral de outra flor da mesma espécie: é a <b>polinização</b>.' },
      { id: 'est', nome: 'Estigma', v: 'b', dur: 6, pl: () => [0], obj: 'O grão de pólen no estigma', onde: 'No estigma pegajoso', cor: POL,
        cap: 'Grudado no <b>estigma</b>, o grão de pólen <b>germina</b>: começa a crescer o <b>tubo polínico</b>.' },
      { id: 'tub', nome: 'Tubo polínico', v: 'b', dur: 8, pl: () => [0], obj: 'Dois núcleos espermáticos (n)', onde: 'Descendo pelo estilete até o óvulo', cor: '#FFE9A8',
        cap: 'O <b>tubo polínico</b> cresce pelo estilete e leva <b>dois núcleos espermáticos</b> até o óvulo, onde entra pela <b>micrópila</b>. Não precisa de água.' },
      { id: 'dup', nome: 'Dupla fecundação', v: 'b', dur: 8, pl: u => u < .55 ? [0] : [1, 2], obj: 'Zigoto (2n) e célula 3n', onde: 'No saco embrionário do óvulo', cor: P3N,
        cap: '<b>Dupla fecundação</b>: um núcleo espermático se une à <b>oosfera</b> e forma o <b>zigoto</b> (2n). O outro se une aos dois <b>núcleos polares</b> e forma uma célula <b>3n</b>, que origina o <b>endosperma</b>.' },
      { id: 'sem', nome: 'Semente e fruto', v: 'a', dur: 7, pl: () => [1, 2], obj: 'Embrião (2n) e endosperma (3n)', onde: 'Óvulo vira semente; ovário vira fruto', cor: '#A9C54A',
        cap: 'O <b>óvulo vira a semente</b>, com o embrião (2n) e o endosperma (3n) de reserva. O <b>ovário vira o fruto</b>, e as pétalas e os estames murcham e caem.' }
    ],
    desenha({ R, X, T, v, et, uu, u, s, P, L }) {
      const id = et.id, rg = Math.max(2, s * .45);
      if (id === 'ant') {
        AN.ants.forEach(([x, y], i) => {
          const a = P(x, y), k = sst(i * .08, i * .08 + .3, u) + (RED ? 1 : 0);
          brilho(X, a[0], a[1], s * 3.5, POL, .45 * Math.min(1, k)); pulso(X, a[0], a[1], s * 1.8, POL, T + i * .25);
          for (let j = 0; j < 4; j++) { const f = RED ? (j + .5) / 4 : fr(T * .35 + j / 4 + i * .13), ang = j * 1.7 + i, d = s * (.8 + f * 2.2); grao(X, a[0] + Math.cos(ang) * d, a[1] + Math.sin(ang) * d, rg * .7, Math.min(1, k) * (1 - f)); }
        });
      } else if (id === 'ins') {
        const f = uu, p = AN.ins.at(f), q = P(p[0], p[1]);
        traco(R, X, AN.ins, 0, f, POL);
        const passou = sst(.38, .5, f) + (RED ? 1 : 0);
        AN.ants.slice(0, 3).forEach(([x, y]) => { const a = P(x, y); brilho(X, a[0], a[1], s * 3, POL, .35); });
        const e = P(50, 7.5); brilho(X, e[0], e[1], s * 4, '#F28B8B', .2 + .3 * sst(.85, 1, f));
        if (f > .92) for (let i = 0; i < 4; i++) { const g = P(48.5 + i, 7 + (i % 2) * 1.5); grao(X, g[0], g[1], rg * .8, sst(.92, 1, f)); }
        abelha(X, q[0], q[1], p[2], cl(s * 4.5, 22, 46), T, Math.min(1, passou) * (1 - sst(.92, 1, f) * .6));
      } else if (id === 'est') {
        AN.graos.forEach(([x, y], i) => { const g = P(x, y); brilho(X, g[0], g[1], s * 1.8, POL, .3); });
        const alvo = P(52.3, 5.8), k = sst(0, .45, u) + (RED ? 1 : 0), y0 = alvo[1] - s * 10;
        grao(X, alvo[0], lerp(y0, alvo[1], Math.min(1, k)), rg * 1.5, 1);
        const gm = sst(.55, 1, u) + (RED ? .6 : 0);
        if (gm > 0) { traco(R, X, AN.tubo, 0, .05 * Math.min(1, gm), '#FFE9A8', { cheio: true, lw: Math.max(2.5, s * .4), glow: 10 }); pulso(X, alvo[0], alvo[1], s * 2, POL, T); }
      } else if (id === 'tub') {
        traco(R, X, AN.tubo, 0, uu, '#FFE9A8', { cheio: true, lw: Math.max(2.5, s * .45), glow: 12 });
        const p = AN.tubo.at(uu), q = P(p[0], p[1]), b = AN.tubo.at(Math.max(0, uu - .025)), bq = P(b[0], b[1]);
        brilho(X, q[0], q[1], L, '#FFE9A8', .55);
        nucleo(X, bq[0], bq[1], Math.max(2.2, s * .4), PN, 1); nucleo(X, lerp(bq[0], q[0], .5), lerp(bq[1], q[1], .5), Math.max(2.2, s * .4), PN, 1);
        if (uu > .85) { const m = P(MIC[0], MIC[1]); pulso(X, m[0], m[1], s * 1.6, '#F2B6C6', T); }
        const o2 = P(OOA[0], OOA[1]); brilho(X, o2[0], o2[1], s * 1.6, PN, .35);
      } else if (id === 'dup') {
        traco(R, X, AN.tubo, 0, 1, '#FFE9A8', { cheio: true, lw: Math.max(2.5, s * .45), glow: 6, a: .55 });
        const m = P(MIC[0], MIC[1]), o2 = P(OOA[0], OOA[1]), pc = P(POLC[0], POLC[1]), rn = Math.max(2.2, s * .4);
        const k1 = sst(.05, .5, u) + (RED ? 1 : 0), k2 = sst(.1, .55, u) + (RED ? 1 : 0), fu = sst(.5, .62, u) + (RED ? 1 : 0);
        // núcleo 1 até a oosfera; núcleo 2 até os núcleos polares
        if (fu < 1) {
          nucleo(X, lerp(m[0], o2[0], Math.min(1, k1)), lerp(m[1], o2[1], Math.min(1, k1)), rn, PN, 1 - fu);
          const p2 = AN.n2.at(Math.min(1, k2)), q2 = P(p2[0], p2[1]); traco(R, X, AN.n2, 0, Math.min(1, k2), PN);
          nucleo(X, q2[0], q2[1], rn, PN, 1 - fu);
          POLS.forEach(([x, y]) => { const c = P(x, y); brilho(X, c[0], c[1], s * 1.5, PN, .45 * (1 - fu)); });
          brilho(X, o2[0], o2[1], s * 1.8, PN, .45 * (1 - fu));
        }
        if (fu > 0) {
          const f = Math.min(1, fu);
          nucleo(X, o2[0], o2[1], Math.max(3.5, s * .75), P2N, f); pulso(X, o2[0], o2[1], s * 1.8, P2N, T);
          nucleo(X, pc[0], pc[1], Math.max(4, s * .85), P3N, f); pulso(X, pc[0], pc[1], s * 2, P3N, T + .5);
          if (!RED && u < .8) [o2, pc].forEach(c => anel(X, c[0], c[1], s * (1 + 4 * sst(.55, .8, u)), '#FFFFFF', .8 * (1 - sst(.55, .8, u)), 2));
          etiqueta(X, o2[0] + 16, o2[1] + 8, 'zigoto 2n', P2N, 'l', f); etiqueta(X, pc[0] + 16, pc[1] - 6, 'célula 3n', P3N, 'l', f);
        }
      } else if (id === 'sem') {
        // pétalas e estames murcham (véu escuro fora do ovário); o ovário cresce em fruto
        const k = sst(.15, .7, u) + (RED ? 1 : 0), c = P(50, 65), rx = R.w * .052 * (1 + .25 * Math.min(1, k)), ry = R.h * .105 * (1 + .2 * Math.min(1, k));
        X.save(); X.beginPath(); X.rect(R.x, R.y, R.w, R.h); X.ellipse(c[0], c[1], rx * 1.15, ry * 1.1, 0, 0, TAU); X.fillStyle = `rgba(8,12,24,${.55 * Math.min(1, k)})`; X.fill('evenodd'); X.restore();
        brilho(X, c[0], c[1], Math.max(rx, ry) * 1.5, '#A9C54A', .35 * Math.min(1, k));
        X.save(); X.globalAlpha = .8 * Math.min(1, k); X.strokeStyle = '#C8E27A'; X.lineWidth = 2; X.beginPath(); X.ellipse(c[0], c[1], rx, ry, 0, 0, TAU); X.stroke(); X.restore();
        AN.ovs.forEach(([x, y], i) => { const a = sst(.1 + i * .03, .3 + i * .03, u) + (RED ? 1 : 0), q = P(x, y); if (a > 0) { dot(X, q[0], q[1], Math.max(2, s * .55), '#B7834A', .85 * Math.min(1, a)); dot(X, q[0] - s * .1, q[1], Math.max(1, s * .22), P2N, Math.min(1, a)); } });
        pulso(X, c[0], c[1], Math.max(rx, ry) * .9, '#A9C54A', T, 2.4);
      }
    }
  });
})();
