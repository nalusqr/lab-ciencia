/* LAB, módulo Taxonomia. Cenas B (Apolo): espécie (conceito biológico e seus limites) e nomes (binomial e regras de escrita).
   Texto: roteiro do Taxon e do Sapien (docs/revisao-biologia/taxonomia-roteiro.md, E1, N1 e N2). Código e desenhos da equipe.

   Direção de arte destas cenas:
   - nome científico SEMPRE em itálico, inclusive no canvas: o ajudante rich() lê *asteriscos* como itálico; "sp." fica reto;
   - cores das categorias seguem a escada do roteiro: gênero em laranja, espécie (e o epíteto) em vermelho;
   - cartões em painel azul-noite com borda fina; âmbar só para o que está escolhido;
   - toques no canvas têm alternativa nos botões da barra (acessível por teclado). */
'use strict';
{
  const RES = { txt: '#E8EDF7', dim: '#9DA9C4', line: '#5B6C99', genero: '#FF9A3C', epiteto: '#F0605D', amber: '#FFB347', ok: '#6BCB77', erro: '#F0605D' };
  const K = n => (typeof C !== 'undefined' && C[n]) || RES[n];
  const GEN = K('genero'), ESP = K('epiteto'), AMB = K('amber');
  const PAN = 'rgba(19,26,43,.86)', PAN2 = 'rgba(28,37,60,.92)', BRD = 'rgba(143,160,200,.38)';
  const SIM = K('ok'), NAO = K('erro'), NAP = '#AEB8D2';
  const ITF = (it, w, sz, f) => `${it ? 'italic ' : ''}${w} ${Math.max(12, sz)}px ${f || FT}`;

  // ---------- texto com itálico: "*Homo sapiens* Linnaeus, 1758" ----------
  function toks(s) {
    const out = []; let it = false;
    String(s).split(/(\*)/).forEach(p => {
      if (p === '*') { it = !it; return; }
      p.split(/(\s+)/).forEach(q => { if (!q) return; if (/^\s+$/.test(q)) { if (out.length) out[out.length - 1].sp = true; } else out.push({ w: q, i: it, sp: false }); });
    });
    return out;
  }
  function lay(s, o = {}) {
    const sz = o.s || 13, w = o.w || 400, T = toks(s); let x = 0;
    X.font = ITF(false, w, sz, o.f); const spc = X.measureText(' ').width;
    T.forEach((k, j) => { X.font = ITF(k.i, w, sz, o.f); k.x = x; k.wd = X.measureText(k.w).width; x += k.wd + (k.sp && j < T.length - 1 ? spc : 0); });
    return { T, wd: x, sz, w };
  }
  const richW = (s, o) => lay(s, o).wd;
  // desenha; devolve o layout com as posições absolutas (x0 de cada palavra)
  function rich(s, x, y, o = {}) {
    const L = lay(s, o), a = o.a || 'center', x0 = a === 'center' ? x - L.wd / 2 : a === 'right' ? x - L.wd : x;
    X.textAlign = 'left'; X.textBaseline = 'middle';
    L.T.forEach(k => {
      X.font = ITF(k.i, L.w, L.sz, o.f);
      if (o.bg !== false) { X.lineWidth = 4; X.lineJoin = 'round'; X.strokeStyle = 'rgba(11,15,28,.9)'; X.strokeText(k.w, x0 + k.x, y); }
      X.fillStyle = o.c || K('txt'); X.fillText(k.w, x0 + k.x, y);
      k.ax = x0 + k.x;
    });
    L.x0 = x0; return L;
  }
  // quebra em linhas respeitando o itálico; devolve a altura usada (o.dry: só mede)
  function wrapR(s, x, y, maxw, o = {}) {
    const sz = o.s || 13, lh = o.lh || sz + 5, T = toks(s), lines = []; let cur = [];
    const str = arr => arr.map((k, j) => (k.i ? '*' + k.w + '*' : k.w) + (j < arr.length - 1 ? ' ' : '')).join('');
    for (const k of T) { const tryA = cur.concat([k]); if (cur.length && richW(str(tryA), o) > maxw) { lines.push(cur); cur = [k]; } else cur = tryA; }
    if (cur.length) lines.push(cur);
    if (!o.dry) lines.forEach((ln, i) => rich(str(ln), x, y + i * lh, Object.assign({ bg: false }, o)));
    return lines.length * lh;
  }
  function capsule(cx, cy, L, Wd) { const r = Wd / 2; X.beginPath(); X.moveTo(cx - L / 2 + r, cy - r); X.lineTo(cx + L / 2 - r, cy - r); X.arc(cx + L / 2 - r, cy, r, -PI / 2, PI / 2); X.lineTo(cx - L / 2 + r, cy + r); X.arc(cx - L / 2 + r, cy, r, PI / 2, PI * 1.5); X.closePath(); }
  function card(x, y, w, h, o = {}) { rr(x, y, w, h, o.r || 12, o.f || PAN, o.s || BRD, o.lw || 1); }
  function pilula(x, y, s, c, o = {}) {
    const sz = o.s || 14, w = richW(s, { s: sz, w: 700 }) + 24, h = o.h || 34;
    rr(x - w / 2, y - h / 2, w, h, 999, o.fill || rgba(c, .16), c, o.lw || 1.5);
    rich(s, x, y + .5, { s: sz, w: 700, c: o.tc || K('txt'), bg: false });
    return { x: x - w / 2, y: y - h / 2, w, h };
  }
  // marca de certo e de X desenhadas (sem depender de fonte)
  function check(x, y, s, c) { X.save(); X.lineCap = 'round'; X.lineJoin = 'round'; poly([[x - s, y], [x - s * .3, y + s * .7], [x + s, y - s * .7]], c, Math.max(2, s * .35)); X.restore(); }
  function xis(x, y, s, c, lw) { X.save(); X.lineCap = 'round'; line(x - s, y - s, x + s, y + s, c, lw || Math.max(2, s * .3)); line(x + s, y - s, x - s, y + s, c, lw || Math.max(2, s * .3)); X.restore(); }

  // ---------- toques no canvas: o motor chama o.tap(x, y, S); cada área guarda a sua ação ----------
  const hits = S => { const arr = []; S.H = arr; return { push(h) { hitR(h.x, h.y, h.w, h.h, arr.length); arr.push(h); } }; };
  const tapH = (x, y, S) => { const id = hitAt(x, y); if (id != null && S.H && S.H[id]) S.H[id].on(); };
  // muda a faixa "Cena" pelo código (o motor ressincroniza o controle depois do toque ou do botão)
  function setV(S, ctl, v) {
    S.v = v; S.touch = performance.now();
    const r = $('ctlR'), vv = $('ctlV'); if (r) { r.value = v; r.setAttribute('aria-valuetext', ctl.f(v)); } if (vv) vv.textContent = ctl.f(v);
  }
  const pressBtn = (i, on) => { const b = document.querySelectorAll('#extra button')[i]; if (b) b.setAttribute('aria-pressed', on ? 'true' : 'false'); };
  // tempo local de cada cena: recomeça quando a faixa troca de cena
  function local(S, t) { const sc = Math.round(S.v); if (S.sc !== sc) { S.sc = sc; S.t0 = t; } return t - S.t0; }

  // ---------- desenhos ----------
  // equino de perfil; x, y = centro do corpo; u = comprimento do corpo
  const EQ = {
    cavalo: { c: '#A8683A', m: '#3E2618', ear: .11, foc: '#7A4A2A', rabo: 1 },
    egua: { c: '#B9784A', m: '#4A2E1C', ear: .11, foc: '#80502E', rabo: 1 },
    jumento: { c: '#8F8D95', m: '#4C4A52', ear: .27, foc: '#E2DDD3', rabo: 0 },
    mula: { c: '#8E6A4E', m: '#3A2A20', ear: .21, foc: '#C9B49E', rabo: .6 }
  };
  function equino(x, y, u, k) {
    const P = EQ[k], st = 'rgba(11,15,28,.65)';
    X.save(); X.translate(x, y); X.lineCap = 'round';
    // pernas (as de trás mais escuras)
    [[-.33, 1], [-.2, 0], [.24, 1], [.36, 0]].forEach(([lx, b]) => { const c = b ? dark(P.c, .22) : P.c; line(lx * u, .05 * u, lx * u, .56 * u, st, .095 * u); line(lx * u, .05 * u, lx * u, .55 * u, c, .07 * u); rr(lx * u - .045 * u, .53 * u, .09 * u, .05 * u, 2, '#2A2220'); });
    // cauda
    X.beginPath(); X.moveTo(-.43 * u, -.08 * u); X.quadraticCurveTo(-.62 * u, .05 * u, -.56 * u, .38 * u);
    X.strokeStyle = P.m; X.lineWidth = (P.rabo ? .07 : .025) * u * (P.rabo || 1); X.stroke();
    if (!P.rabo) ell(-.56 * u, .38 * u, .03 * u, .07 * u, .2, P.m);
    // corpo
    ell(0, 0, .46 * u, .2 * u, 0, P.c, st, 1.2);
    // pescoço
    shape([[.26 * u, -.1 * u], [.46 * u, -.46 * u], [.62 * u, -.42 * u], [.44 * u, .06 * u]], P.c, st, 1.2);
    ell(.33 * u, -.03 * u, .14 * u, .15 * u, 0, P.c);
    // crina
    X.beginPath(); X.moveTo(.27 * u, -.13 * u); X.lineTo(.47 * u, -.5 * u); X.strokeStyle = P.m; X.lineWidth = (k === 'jumento' ? .035 : .06) * u; X.stroke();
    // orelhas
    [[.52, -.52, -.25], [.56, -.5, .05]].forEach(([ex, ey, r]) => { X.save(); X.translate(ex * u, ey * u); X.rotate(r); shape([[-.025 * u, 0], [0, -P.ear * u], [.025 * u, 0]], P.c, st, 1); X.restore(); });
    // cabeça
    ell(.66 * u, -.37 * u, .16 * u, .075 * u, .55, P.c, st, 1.2);
    ell(.75 * u, -.29 * u, .06 * u, .05 * u, .55, P.foc);
    circ(.6 * u, -.44 * u, Math.max(1.2, .018 * u), '#151010');
    X.restore();
  }
  function cao(x, y, u, grande) {
    const c = grande ? '#9A8C80' : '#D9B58A', st = 'rgba(11,15,28,.6)'; X.save(); X.translate(x, y); X.lineCap = 'round';
    const lg = grande ? .55 : .3;
    [-.3, -.18, .22, .32].forEach(lx => line(lx * u, .05 * u, lx * u, lg * u, c, .07 * u));
    ell(0, 0, .42 * u, (grande ? .17 : .2) * u, 0, c, st, 1);
    line(-.4 * u, -.05 * u, -.55 * u, -.25 * u, c, .05 * u);
    ell(.45 * u, -.2 * u, .15 * u, .12 * u, 0, c, st, 1); ell(.58 * u, -.17 * u, .08 * u, .05 * u, 0, c, st, 1);
    shape([[.38 * u, -.28 * u], [.36 * u, -.45 * u], [.46 * u, -.3 * u]], dark(c, .15), st, 1);
    circ(.5 * u, -.23 * u, Math.max(1, .02 * u), '#151010');
    X.restore();
  }
  function felino(x, y, u, leo) {
    const c = leo ? '#C99A5B' : '#D9A441', st = 'rgba(11,15,28,.6)'; X.save(); X.translate(x, y); X.lineCap = 'round';
    [-.32, -.2, .22, .34].forEach(lx => line(lx * u, .05 * u, lx * u, .4 * u, c, .08 * u));
    X.beginPath(); X.moveTo(-.42 * u, -.02 * u); X.quadraticCurveTo(-.7 * u, -.05 * u, -.68 * u, -.32 * u); X.strokeStyle = c; X.lineWidth = .05 * u; X.stroke();
    if (leo) circ(-.68 * u, -.33 * u, .04 * u, '#5A3A1E');
    ell(0, 0, .45 * u, .17 * u, 0, c, st, 1);
    if (!leo) { const R = rng(7); for (let i = 0; i < 14; i++) { const px = (R() - .5) * .78 * u, py = (R() - .5) * .22 * u; circ(px, py, .035 * u, null, '#3A2614', Math.max(1.2, .015 * u)); circ(px, py, .012 * u, '#3A2614'); } }
    if (leo) circ(.44 * u, -.16 * u, .2 * u, '#7A4A22', st, 1);
    circ(.46 * u, -.16 * u, .12 * u, c, st, 1);
    circ(.38 * u, -.27 * u, .035 * u, c, st, 1); circ(.52 * u, -.27 * u, .035 * u, c, st, 1);
    ell(.55 * u, -.13 * u, .05 * u, .035 * u, 0, light(c, .35));
    circ(.5 * u, -.18 * u, Math.max(1, .018 * u), '#151010');
    if (!leo) for (let i = 0; i < 4; i++) circ(.4 * u + (i % 2) * .08 * u, -.12 * u - (i > 1 ? .06 * u : 0), .012 * u, '#3A2614');
    X.restore();
  }
  function humano(x, y, u) {
    const sk = '#D9A882', st = 'rgba(11,15,28,.6)'; X.save(); X.translate(x, y); X.lineCap = 'round';
    line(-.08 * u, .15 * u, -.12 * u, .55 * u, '#5B6C99', .09 * u); line(.08 * u, .15 * u, .12 * u, .55 * u, '#5B6C99', .09 * u);
    line(-.15 * u, -.25 * u, -.25 * u, .1 * u, sk, .07 * u); line(.15 * u, -.25 * u, .25 * u, .1 * u, sk, .07 * u);
    rr(-.16 * u, -.3 * u, .32 * u, .48 * u, .1 * u, '#4FA3A0', st, 1);
    circ(0, -.45 * u, .12 * u, sk, st, 1);
    X.restore();
  }
  function milho(x, y, u) {
    X.save(); X.translate(x, y); X.rotate(-.35);
    shape([[0, .5 * u], [-.2 * u, .1 * u], [-.16 * u, -.3 * u], [-.05 * u, .1 * u]], '#6FAE5A', 'rgba(11,15,28,.5)', 1);
    ell(0, -.05 * u, .13 * u, .42 * u, 0, '#F2CF5B', 'rgba(11,15,28,.5)', 1);
    for (let r = -5; r <= 5; r++) for (let q = -1; q <= 1; q++) circ(q * .07 * u, r * .07 * u - .05 * u, .028 * u, 'rgba(180,130,30,.6)');
    shape([[0, .5 * u], [.2 * u, .1 * u], [.18 * u, -.25 * u], [.05 * u, .1 * u]], '#7DBE66', 'rgba(11,15,28,.5)', 1);
    line(0, -.47 * u, -.05 * u, -.6 * u, '#C9A26A', 2); line(0, -.47 * u, .05 * u, -.62 * u, '#C9A26A', 2);
    X.restore();
  }
  function mosquito(x, y, u) {
    X.save(); X.translate(x, y); X.lineCap = 'round';
    ell(-.05 * u, -.2 * u, .3 * u, .1 * u, -.5, 'rgba(200,215,240,.25)', 'rgba(200,215,240,.6)', 1);
    ell(.05 * u, -.22 * u, .3 * u, .1 * u, -.9, 'rgba(200,215,240,.25)', 'rgba(200,215,240,.6)', 1);
    for (let i = 0; i < 3; i++) {
      const bx = (-.05 + i * .08) * u, P = [[bx, 0], [bx - .12 * u + i * .06 * u, .22 * u], [bx - .2 * u + i * .14 * u, .45 * u]];
      poly(P, '#2A2A30', .03 * u);
      for (let k = 1; k < 4; k++) { const q = pth(P, k / 4); circ(q[0], q[1], .02 * u, '#F2F4F8'); }
    }
    ell(-.22 * u, .02 * u, .25 * u, .06 * u, -.15, '#2A2A30', 'rgba(232,237,247,.4)', 1);
    for (let k = 0; k < 4; k++) line(-.36 * u + k * .08 * u, -.02 * u, -.34 * u + k * .08 * u, .07 * u, '#F2F4F8', 1.5);
    ell(.08 * u, -.02 * u, .09 * u, .07 * u, 0, '#2A2A30', 'rgba(232,237,247,.4)', 1);
    line(.1 * u, -.06 * u, .14 * u, 0, '#F2F4F8', 1.5);
    circ(.2 * u, 0, .05 * u, '#2A2A30'); line(.24 * u, .01 * u, .4 * u, .08 * u, '#2A2A30', .02 * u);
    X.restore();
  }

  // =====================================================================================
  // E1 O QUE É UMA ESPÉCIE
  // =====================================================================================
  const CAV = '#E0A867', JUM = '#8FB0E0';                // cromossomos vindos do cavalo e do jumento
  const CEN_E = ['cruzamento', 'meiose', 'é a mesma espécie?'];
  const ctlE = { l: 'Cena', min: 0, max: 2, step: 1, v: 0, f: v => CEN_E[Math.round(v)] || '', rate: () => 1 };
  const PARES = [
    { q: 'Chihuahua e dogue alemão', r: 'sim', c: SIM, why: 'Cruzam e têm filhotes férteis: mesma espécie, apesar do tamanho.' },
    { q: 'Égua e jumento', r: 'não', c: NAO, why: 'O filhote é a mula, forte, mas estéril.' },
    { q: 'Leão e tigresa', r: 'não', c: NAO, why: 'O ligre só nasce em cativeiro, e os machos são estéreis.' },
    { q: 'Duas bactérias *E. coli*', r: 'não se aplica', c: NAP, why: 'Reprodução assexuada: não há cruzamento para testar.' },
    { q: 'Um fóssil de dinossauro', r: 'não se aplica', c: NAP, why: 'Fóssil não cruza: as espécies são separadas pela forma.' }
  ];
  // cromossomos do esquema: 6 pares do cavalo; na mula, 6 do cavalo e 5 do jumento (formas diferentes)
  const CH_L = [1, .86, .74, .64, .54, .44];
  const JU = [{ l: 1, m: 0 }, { l: .58, m: -1 }, { l: .7, m: -1 }, { l: .66, m: 3 }, { l: .38, m: -1 }];   // m = par do cavalo que ele consegue parear
  const SPOS = (() => { const R = rng(91), A = []; for (let i = 0; i < 14; i++) A.push({ a: R() * TAU, r: .2 + R() * .45, rot: R() * PI, ph: R() * TAU }); return A; })();

  function crom(x, y, L, wd, rot, c, o = {}) {
    X.save(); X.translate(x, y); X.rotate(rot); capsule(0, 0, L, wd); X.fillStyle = c; X.fill(); X.strokeStyle = o.s || 'rgba(11,15,28,.6)'; X.lineWidth = o.lw || 1; X.stroke();
    line(-wd * .15 + L * (o.cen || .1), -wd / 2, -wd * .15 + L * (o.cen || .1), wd / 2, 'rgba(11,15,28,.55)', 1.2); X.restore();
  }

  // painel da meiose: tipo 'cav' ou 'mula'; lt = tempo local
  function meiose(px, py, pw, ph, tipo, lt) {
    const mula = tipo === 'mula', cx = px + pw / 2;
    card(px, py, pw, ph);
    const tt = mula ? (NAR ? 'Mula: 2n = 63' : 'Mula: 2n = 63 (32 do cavalo e 31 do jumento)') : (NAR ? 'Cavalo: 2n = 64' : 'Cavalo: 2n = 64 (32 pares)');
    tx(tt, cx, py + 18, { s: NAR ? 13 : 15, w: 700, c: K('txt'), bg: false });
    const top = py + 34, bot = py + ph - 24, cy = (top + bot) / 2, R = Math.min(pw * .36, (bot - top) * .5);
    const p1 = ss(seg(lt, 1.5, 4.5)), p2 = ss(seg(lt, 5, 7.5)), p3 = ss(seg(lt, 8, 9.5));
    const Lu = R * .34, wd = Math.max(4, R * .085), gap = R * 1.5 / 6;
    // lista de cromossomos com posição inicial e de metáfase
    const list = [], hy = l => l * Lu / 2 + 3;
    CH_L.forEach((l, i) => {
      const xa = cx + (i - 2.5) * gap;
      list.push({ c: mula ? CAV : light(CAV, .25), l, s: SPOS[i * 2], mx: xa, my: cy - hy(l), side: -1, ok: true });
      if (!mula) list.push({ c: dark(CAV, .12), l, s: SPOS[i * 2 + 1], mx: xa, my: cy + hy(l), side: 1, ok: true });
    });
    if (mula) {
      let rk = 0; list.forEach((q, i) => { q.ok = JU.some(j => j.m === i); if (!q.ok) { q.my = cy - R * .6; q.mx = cx + (rk++ - 1.5) * gap * 1.45; } });
      let rj = 0;
      JU.forEach((j, k) => { const s = SPOS[13 - k * 2]; if (j.m >= 0) { const l = j.l * CH_L[j.m]; list.push({ c: JUM, l, s, mx: cx + (j.m - 2.5) * gap, my: cy + hy(l), side: 1, ok: true }); } else list.push({ c: JUM, l: j.l, s, mx: cx + (rj++ - 1) * gap * 1.45, my: cy + R * .6, side: 1, ok: false }); });
    }
    // fase 4: gametas
    if (p3 > 0) {
      X.save(); X.globalAlpha = 1 - p3;
    }
    if (p3 < 1) {
      // célula: no cavalo ela se estrangula e divide; na mula, só treme
      const sep = mula ? 0 : p2;
      const pinch = mula ? 0 : ss(seg(lt, 6.5, 7.8));
      if (pinch < .02) circ(cx, cy, R, 'rgba(240,210,170,.08)', 'rgba(232,237,247,.55)', 1.5);
      else { const dy = R * .55 * pinch; ell(cx, cy - dy, R * (1 - .1 * pinch), R * (1 - .35 * pinch), 0, 'rgba(240,210,170,.08)', 'rgba(232,237,247,.55)', 1.5); ell(cx, cy + dy, R * (1 - .1 * pinch), R * (1 - .35 * pinch), 0, 'rgba(240,210,170,.08)', 'rgba(232,237,247,.55)', 1.5); }
      // fuso
      if (p1 > .6) { const a = (p1 - .6) / .4 * (mula ? .5 + .2 * Math.sin(lt * 6) : 1) * (1 - p3); for (let k = -2; k <= 2; k++) { X.save(); X.globalAlpha *= a * .5; X.beginPath(); X.moveTo(cx, cy - R * .85); X.quadraticCurveTo(cx + k * gap * 1.4, cy, cx, cy + R * .85); X.strokeStyle = 'rgba(200,215,240,.7)'; X.lineWidth = 1; X.stroke(); X.restore(); } }
      list.forEach(q => {
        const sx = cx + Math.cos(q.s.a) * q.s.r * R, sy = cy + Math.sin(q.s.a) * q.s.r * R;
        let x = lerp(sx, q.mx, p1), y = lerp(sy, q.my, p1), rot = lerp(q.s.rot, 0, p1);
        x += Math.sin(lt * 1.3 + q.s.ph) * 1.5 * (1 - p1);
        if (!mula) y += q.side * sep * R * .5;
        else { x += Math.sin(lt * 9 + q.s.ph) * 1.6 * p2; }
        crom(x, y, q.l * Lu, wd, rot + PI / 2 * p1, q.c);
        if (mula && !q.ok && p1 > .9) circ(x, y, Math.min(gap * .68, q.l * Lu * .5 + wd), null, rgba(NAO, .85), 1.6);
      });
    }
    if (p3 > 0) X.restore();
    // gametas
    if (p3 > 0) {
      X.save(); X.globalAlpha = p3;
      const gr = Math.min(R * .42, pw * .1), gy = cy;
      for (let k = 0; k < 4; k++) {
        const gx = cx + (k - 1.5) * gr * 2.5;
        circ(gx, gy, gr, mula ? 'rgba(160,160,170,.08)' : 'rgba(240,210,170,.1)', mula ? 'rgba(160,170,190,.5)' : 'rgba(232,237,247,.65)', 1.4);
        if (!mula) for (let m = 0; m < 6; m++) crom(gx - gr * .5 + m * gr * .2, gy, CH_L[m] * gr * .7, Math.max(3, gr * .12), PI / 2, m % 2 ? light(CAV, .25) : dark(CAV, .12));
        else { const R2 = rng(5 + k); for (let m = 0; m < 3; m++) crom(gx + (R2() - .5) * gr, gy + (R2() - .5) * gr * .8, gr * .5, Math.max(3, gr * .1), R2() * PI, R2() > .5 ? CAV : JUM, { s: 'rgba(11,15,28,.4)' }); xis(gx, gy, gr * .55, NAO); }
        if (!mula) check(gx, gy + gr + 12, 6, SIM);
      }
      tx(mula ? 'quase nenhum gameta viável' : 'gametas normais (n = 32)', cx, gy + gr + (mula ? 18 : 30), { s: 13, w: 600, c: mula ? NAO : SIM, bg: false });
      X.restore();
    }
    // situação embaixo
    const st = lt < 1.5 ? 'cromossomos espalhados no núcleo' : lt < 5 ? (mula ? 'muitos ficam sem par ou pareiam mal' : 'cada cromossomo encontra o seu par') : lt < 8 ? (mula ? 'a divisão trava' : 'os pares se separam') : '';
    if (st) tx(st, cx, py + ph - 12, { s: 13, w: 600, c: mula && lt >= 1.5 ? NAO : K('dim'), bg: false });
  }

  function cenaCruz(S, A, lt, H_) {
    const appear = i => S.paused ? 1 : ss(seg(lt, .3 + i * .7, .9 + i * .7));
    let cw, ch, P;
    if (NAR) {
      cw = (A.w - 34) / 2; ch = Math.min(170, (A.h - 70) / 2);
      P = [[A.x0, A.y0 + 6], [A.x1 - cw, A.y0 + 6], [A.cx - cw / 2, A.y0 + 6 + ch + 46]];
    } else {
      cw = Math.min(230, (A.w - 150) / 3); ch = Math.min(270, A.h - 70);
      const tot = cw * 3 + 150, x0 = A.cx - tot / 2, y = A.y0 + (A.h - ch) / 2 - 10;
      P = [[x0, y], [x0 + cw + 60, y], [x0 + 2 * cw + 150, y]];
    }
    const D = [
      { k: 'egua', n: 'égua', s: '*Equus caballus*', cr: '2n = 64' },
      { k: 'jumento', n: 'jumento', s: '*Equus asinus*', cr: '2n = 62' },
      { k: 'mula', n: 'mula ou burro', s: 'híbrido', cr: '2n = 63' }
    ];
    D.forEach((d, i) => {
      const a = appear(i); if (a <= .01) return; const [x, y] = P[i];
      X.save(); X.globalAlpha = a;
      const isM = i === 2, pulse = isM && !S.paused ? .5 + .5 * Math.sin(lt * 3) : .5;
      card(x, y, cw, ch, { f: isM ? PAN2 : PAN, s: isM ? rgba(AMB, .45 + .4 * pulse) : BRD, lw: isM ? 2 : 1 });
      const u = Math.min(cw * .5, ch * .42), ay = y + ch * .36;
      equino(x + cw / 2 - u * .1, ay, u, d.k);
      const ty = y + ch * .68, sm = NAR ? 13 : 15;
      tx(d.n, x + cw / 2, ty, { s: sm + 1, w: 700, c: K('txt'), bg: false });
      rich(d.s, x + cw / 2, ty + sm + 6, { s: sm - 1, c: K('dim'), bg: false });
      tx(d.cr, x + cw / 2, ty + 2 * sm + 14, { s: sm - 1, f: FD, w: 500, c: isM ? AMB : K('txt'), bg: false });
      if (isM && a > .9) tok(x + cw - 34, y + 18, 'estéril', NAO);
      X.restore();
      if (isM) H_.push({ x, y, w: cw, h: ch, on: () => setV(S, ctlE, 1) });
    });
    // sinais de + e a seta (desenhados, não escritos)
    const aP = appear(1), aR = appear(2);
    if (NAR) {
      const yy = P[0][1] + ch / 2; X.save(); X.globalAlpha = aP; line(A.cx - 7, yy, A.cx + 7, yy, K('txt'), 2.5); line(A.cx, yy - 7, A.cx, yy + 7, K('txt'), 2.5); X.restore();
      X.save(); X.globalAlpha = aR; arrow(A.cx, P[0][1] + ch + 6, A.cx, P[2][1] - 6, AMB, 2.5); X.restore();
    } else {
      const yy = P[0][1] + ch / 2, xp = P[0][0] + cw + 30; X.save(); X.globalAlpha = aP; line(xp - 9, yy, xp + 9, yy, K('txt'), 3); line(xp, yy - 9, xp, yy + 9, K('txt'), 3); X.restore();
      X.save(); X.globalAlpha = aR; arrow(P[1][0] + cw + 14, yy, P[2][0] - 14, yy, AMB, 3); X.restore();
    }
    if (aR > .9) {
      const yb = NAR ? P[2][1] + ch + 22 : P[0][1] + ch + 28;
      tx(NAR ? 'Toque na mula para ver a meiose' : 'Toque na mula para entrar numa célula da gônada e ver a meiose', A.cx, yb, { s: 13, w: 600, c: AMB, bg: false });
    }
    cap('Égua (2n = 64) com jumento (2n = 62) gera a <b>mula</b> (2n = 63): forte, mas <b>estéril</b>. Cavalo e jumento são espécies diferentes.');
  }

  function cenaMei(S, A, lt) {
    let r1, r2;
    if (NAR) { const h = (A.h - 44) / 2; r1 = [A.x0, A.y0 + 4, A.w, h]; r2 = [A.x0, A.y0 + h + 12, A.w, h]; }
    else { const w = Math.min(520, (A.w - 24) / 2), h = Math.min(A.h - 40, 420), y = A.y0 + (A.h - 40 - h) / 2 + 4; r1 = [A.cx - w - 12, y, w, h]; r2 = [A.cx + 12, y, w, h]; }
    meiose(r1[0], r1[1], r1[2], r1[3], 'cav', lt);
    meiose(r2[0], r2[1], r2[2], r2[3], 'mula', lt);
    // legenda das cores
    const ly = NAR ? A.y1 - 8 : A.y1 - 12;
    const t1 = 'do cavalo', t2 = 'do jumento', t3 = NAR ? 'esquema: poucos cromossomos' : 'esquema: só alguns dos cromossomos';
    const w1 = tw(t1, 13, 600) + 40, w2 = tw(t2, 13, 600) + 40, w3 = tw(t3, 12, 400);
    const tot = NAR ? w1 + w2 : w1 + w2 + w3 + 24; let x = A.cx - tot / 2;
    rr(x, ly - 5, 14, 10, 4, CAV); tx(t1, x + 20, ly, { s: 13, w: 600, a: 'left', c: K('txt'), bg: false }); x += w1;
    rr(x, ly - 5, 14, 10, 4, JUM); tx(t2, x + 20, ly, { s: 13, w: 600, a: 'left', c: K('txt'), bg: false }); x += w2 + 24;
    if (!NAR) tx(t3, x, ly, { s: 12, a: 'left', c: K('dim'), bg: false });
    cap(lt < 5 ? 'Na meiose, cada cromossomo precisa de um par. No cavalo os 32 pares se formam; na mula, os 32 cromossomos do cavalo e os 31 do jumento são diferentes e muitos ficam sem par.'
      : lt < 8 ? 'No cavalo, os pares se separam e a célula se divide. Na mula, sem pares certos, <b>a divisão trava</b>.'
        : 'Resultado: o cavalo forma <b>gametas normais</b>; a mula quase não forma gametas viáveis e por isso é <b>estéril</b> (há raríssimas exceções).');
  }

  function cenaCartoes(S, A, H_) {
    const n = PARES.length; S.flip = S.flip || new Array(n).fill(0);
    let boxes = [];
    if (NAR) { const gap = 8, h = (A.h - gap * (n - 1) - 4) / n; for (let i = 0; i < n; i++) boxes.push([A.x0, A.y0 + 2 + i * (h + gap), A.w, h]); }
    else {
      const gap = 16, w = Math.min(250, (A.w - gap * (n - 1)) / n), h = Math.min(250, A.h - 60), x0 = A.cx - (w * n + gap * (n - 1)) / 2, y = A.y0 + (A.h - h) / 2 - 8;
      for (let i = 0; i < n; i++) boxes.push([x0 + i * (w + gap), y, w, h]);
    }
    tx(NAR ? '' : 'É a mesma espécie? Toque nos cartões.', A.cx, boxes[0][1] - 16, { s: 15, w: 700, c: K('txt'), bg: false });
    PARES.forEach((p, i) => {
      const [x, y, w, h] = boxes[i], tgt = S.open && S.open[i] ? 1 : 0;
      S.flip[i] = S.paused ? tgt : lerp(S.flip[i], tgt, cl(S.dt * 9, 0, 1));
      const f = S.flip[i], sc = Math.abs(Math.cos(f * PI)), back = f > .5;
      X.save(); X.translate(x + w / 2, y + h / 2); X.scale(Math.max(.02, sc), 1); X.translate(-(x + w / 2), -(y + h / 2));
      card(x, y, w, h, { f: back ? PAN2 : PAN, s: back ? rgba(p.c, .8) : BRD, lw: back ? 1.6 : 1 });
      const pad = NAR ? 12 : 16;
      if (!back) {
        if (NAR) {
          rich(p.q, x + pad, y + h / 2 - 9, { s: 15, w: 700, a: 'left', bg: false });
          tx('toque para ver a resposta', x + pad, y + h / 2 + 12, { s: 12, a: 'left', c: K('dim'), bg: false });
          tx('?', x + w - 26, y + h / 2, { s: 22, w: 700, f: FH, c: AMB, bg: false });
        } else {
          tx('?', x + w / 2, y + h * .3, { s: 44, w: 700, f: FH, c: AMB, bg: false });
          wrapR(p.q, x + w / 2, y + h * .56, w - 2 * pad, { s: 16, w: 700, lh: 21 });
          tx('toque para ver', x + w / 2, y + h - 22, { s: 12, c: K('dim'), bg: false });
        }
      } else {
        if (NAR) {
          rich(p.q, x + pad, y + 14, { s: 13, w: 700, a: 'left', c: K('dim'), bg: false });
          const tw_ = tok(x + w - pad - tw(p.r, 12, 700) / 2 - 6, y + 14, p.r, p.c);
          void tw_;
          wrapR(p.why, x + pad, y + 34, w - 2 * pad, { s: 13, a: 'left', lh: 17 });
        } else {
          wrapR(p.q, x + w / 2, y + 26, w - 2 * pad, { s: 14, w: 700, c: K('dim'), lh: 18 });
          X.font = `700 18px ${FT}`; const bw = X.measureText(p.r).width + 26;
          rr(x + w / 2 - bw / 2, y + h * .38 - 17, bw, 34, 999, p.c); tx(p.r, x + w / 2, y + h * .38, { s: 18, w: 700, c: '#0B0F1C', bg: false });
          wrapR(p.why, x + w / 2, y + h * .58, w - 2 * pad, { s: 14, lh: 19 });
        }
      }
      X.restore();
      H_.push({ x, y, w, h, on: () => { S.open = S.open || []; S.open[i] = !S.open[i]; pressBtn(0, (S.open || []).every(Boolean)); } });
    });
    const k = (S.open || []).filter(Boolean).length;
    cap(k === 0 ? 'Toque em cada cartão: é a mesma espécie? Lembre que o conceito biológico pede cruzamento <b>na natureza</b> e <b>filhos férteis</b>.'
      : k < n ? `${k} de ${n} respostas abertas. O conceito biológico não se aplica a seres assexuados nem a fósseis.`
        : 'Todas abertas: o conceito biológico funciona para animais com reprodução sexuada, mas não para bactérias nem para fósseis.');
  }

  def('especie', 'conceito', {
    t: 'O que é uma espécie', s: 'cruzar e ter filhos férteis, e onde a regra falha', c: ESP,
    loc: 'Populações na natureza; o caso clássico é o cavalo, o jumento e a mula',
    still: 30, stillV: 0, ctl: ctlE,
    init(S) { if (!S.open) S.open = []; },
    tap: tapH,
    extra: [{ t: 'Revelar todas', on: S => { const all = (S.open || []).length === PARES.length && S.open.every(Boolean); S.open = PARES.map(() => !all); if (Math.round(S.v) !== 2) setV(S, ctlE, 2); }, pressed: S => (S.open || []).length === PARES.length && S.open.every(Boolean) }],
    alt: 'Três cartões: égua (Equus caballus, 2n = 64) mais jumento (Equus asinus, 2n = 62) geram a mula (2n = 63), marcada como estéril. Na cena da meiose, lado a lado, uma célula de cavalo forma 32 pares de cromossomos, divide-se e gera gametas normais; na célula da mula, os cromossomos do cavalo e do jumento não formam pares, a divisão trava e os gametas aparecem riscados com um X. Na terceira cena, cinco cartões perguntam se o par é da mesma espécie: chihuahua e dogue alemão, égua e jumento, leão e tigresa, duas bactérias E. coli e um fóssil de dinossauro',
    d: `<p>Pelo <b>conceito biológico de espécie</b>, proposto por Ernst <b>Mayr</b> (1942), espécie é um grupo de populações cujos indivíduos <b>se cruzam na natureza</b> e geram <b>descendentes férteis</b>, e que estão <b>isoladas reprodutivamente</b> de outros grupos. Por isso um chihuahua e um dogue alemão, apesar de tão diferentes, são da mesma espécie: podem cruzar e ter filhotes férteis. Já o cavalo e o jumento são de espécies diferentes. O cruzamento de uma <b>égua</b> (<i>Equus caballus</i>, 2n = 64 cromossomos) com um <b>jumento</b> (<i>Equus asinus</i>, 2n = 62) gera a <b>mula</b> (fêmea) ou o <b>burro</b> (macho), com 2n = <b>63</b>. Esse híbrido é forte e muito usado no campo, mas é <b>estéril</b>: como os cromossomos vindos do pai e da mãe são diferentes, eles não formam pares na <b>meiose</b>, e quase não se formam gametas viáveis (há raríssimos registros de mulas que tiveram filhotes). O <b>bardoto</b> (cavalo com jumenta) também é estéril. O <b>ligre</b> (leão com tigresa) só nasce em cativeiro, onde as duas espécies são forçadas a se encontrar; os machos são estéreis, mas algumas fêmeas já tiveram filhotes, um sinal de que a fronteira entre espécies nem sempre é absoluta.</p>
<p>O conceito biológico é o mais usado no ensino médio, mas tem <b>limites</b>. Ele não serve para seres que se reproduzem <b>sem sexo</b>, como as bactérias, porque não há cruzamento para testar. Não serve para <b>fósseis</b>, que não podem ser cruzados: neles, as espécies são separadas pela forma (<b>conceito morfológico</b>). E há espécies diferentes que geram <b>híbridos férteis</b>, sobretudo entre plantas, e também entre alguns animais, como o lobo e o coiote. Por isso os biólogos usam outros conceitos junto, como o <b>filogenético</b> (o menor grupo com um ancestral comum exclusivo, identificado hoje sobretudo por DNA). Espécie é uma categoria real na natureza, mas as fronteiras entre elas nem sempre são nítidas, porque elas se formam aos poucos.</p>
<p>A faixa troca a cena: o cruzamento, a meiose na mula comparada com a do cavalo (toque na mula para chegar lá) e o jogo "É a mesma espécie?". O desenho da meiose é um esquema com poucos cromossomos.</p>`,
    kv: [['Égua (<i>Equus caballus</i>)', '2n = 64'], ['Jumento (<i>Equus asinus</i>)', '2n = 62'], ['Mula ou burro', '2n = 63; estéril'], ['Conceito biológico', 'Mayr, 1942']],
    enem: 'Espécie = cruzam <b>na natureza</b> e têm <b>filhos férteis</b>. A <b>mula</b> é o exemplo clássico: nasce, cresce e trabalha, mas é <b>estéril</b>, prova de que cavalo e jumento são espécies diferentes. O motivo é cromossômico: 63 cromossomos, que não formam pares na meiose. Saiba também os limites: o conceito <b>não se aplica</b> a seres <b>assexuados</b> nem a <b>fósseis</b>.',
    links: [['Meiose I e II', '../divisao-celular/index.html#meiose/fases'], ['Nomenclatura binomial', '#nomes/binomial']],
    draw(t, S) {
      const A = area(), sc = Math.round(S.v), H_ = hits(S); let lt = local(S, t);
      if (sc === 1) { lt = S.paused ? 10.5 : lt % 12.5; cenaMei(S, A, lt); }
      else if (sc === 2) cenaCartoes(S, A, H_);
      else cenaCruz(S, A, lt, H_);
    }
  });

  // =====================================================================================
  // N1 NOMENCLATURA BINOMIAL
  // =====================================================================================
  const CEN_N = ['mapa dos nomes', 'monte o nome'];
  const ctlN = { l: 'Cena', min: 0, max: 1, step: 1, v: 0, f: v => CEN_N[Math.round(v)] || '', rate: () => 1 };
  // contorno esquemático do Brasil (longitude, latitude), desenho da equipe
  const BR = [[-60, 5.2], [-56, 2], [-51.6, 4.2], [-50, 1.8], [-48.5, -1.2], [-44.5, -2.4], [-41, -2.9], [-37.5, -4.7], [-35.2, -5.6], [-34.9, -8], [-35.8, -9.8], [-38.4, -12.9], [-39, -15.5], [-39.4, -17.9], [-40.8, -21.2], [-42, -22.9], [-44.6, -23.3], [-47.8, -25.2], [-48.6, -26.9], [-48.8, -28.6], [-50.6, -31], [-52.2, -32.4], [-53.4, -33.7], [-53.6, -32.4], [-55.8, -30.9], [-57.6, -30.2], [-55.7, -27.9], [-54.6, -25.6], [-54.4, -24], [-55.7, -22.4], [-57.8, -22], [-57.9, -19.4], [-58.3, -16.3], [-60.2, -15.6], [-60.4, -13.7], [-63.5, -12.2], [-65.3, -10.9], [-67.8, -10.6], [-70.5, -11], [-70.6, -9.5], [-73.2, -9.2], [-74, -7.4], [-73, -5.2], [-70, -4.2], [-69.5, -1.2], [-67, 2], [-64.2, 3.9], [-62, 4.1]];
  // zonas aproximadas, sem fronteira: [lon, lat, raio em graus, cor]
  const ZON = [
    { lo: -60, la: -4, r: 13, c: '#3FB8AF' }, { lo: -40.5, la: -7.5, r: 7.5, c: '#3FB8AF' },
    { lo: -48, la: -17, r: 9, c: '#E8A33D' },
    { lo: -51.5, la: -28, r: 6, c: '#A983E8' }, { lo: -43, la: -22.6, r: 2.2, c: '#A983E8' }
  ];
  const BAL = [
    { t: 'macaxeira', lo: -60, la: -4, c: '#3FB8AF', d: 0 },
    { t: 'macaxeira', lo: -40, la: -7, c: '#3FB8AF', d: .5 },
    { t: 'mandioca', lo: -48, la: -17, c: '#E8A33D', d: 1 },
    { t: 'aipim', lo: -51.5, la: -28, c: '#A983E8', d: 1.5 },
    { t: 'aipim', lo: -43, la: -22.6, c: '#A983E8', d: 2 },
    { t: 'cassava (inglês)', lo: -38, la: 4, c: '#9DA9C4', d: 2.6, mar: 1 }
  ];
  function balao(x, y, s, c, a, sz) {
    if (a <= .01) return; X.save(); X.globalAlpha *= a; X.font = `700 ${sz}px ${FT}`;
    const w = X.measureText(s).width + 18, h = sz + 12, by = y - h - 8;
    X.beginPath(); X.roundRect(x - w / 2, by, w, h, 10); X.moveTo(x - 6, by + h); X.lineTo(x, y - 1); X.lineTo(x + 6, by + h);
    X.fillStyle = rgba(c, .92); X.fill(); X.strokeStyle = 'rgba(11,15,28,.6)'; X.lineWidth = 1; X.stroke();
    X.fillStyle = '#0B0F1C'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(s, x, by + h / 2 + .5);
    circ(x, y, 2.5, '#fff'); X.restore();
  }
  function cenaMapa(S, A, lt) {
    const T = S.paused ? 12 : lt % 15;
    // mapa
    let mx, my, ms, lx, ly;
    if (NAR) { ms = Math.min(A.w * .92, A.h * .62); mx = A.cx - ms / 2; my = A.y0 + 4; lx = A.cx; ly = my + ms + (A.y1 - my - ms) / 2 - 6; }
    else { ms = Math.min(A.h * .98, A.w * .5); mx = A.x0 + A.w * .28 - ms / 2; my = A.y0 + (A.h - ms) / 2; lx = A.x0 + A.w * .74; ly = A.cy - 10; mx = Math.max(A.x0, mx); }
    const pj = (lo, la) => [mx + (lo + 75) / 42 * ms, my + (6 - la) / 42 * ms];
    const mapA = 1 - .55 * ss(seg(T, 4.5, 6.5));
    X.save(); X.globalAlpha = mapA;
    X.beginPath(); BR.forEach((p, i) => { const q = pj(p[0], p[1]); i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1]); }); X.closePath();
    X.fillStyle = 'rgba(40,52,82,.9)'; X.fill(); X.save(); X.clip();
    ZON.forEach(z => { const q = pj(z.lo, z.la), r = z.r / 42 * ms * 1.3, g = X.createRadialGradient(q[0], q[1], 0, q[0], q[1], r); g.addColorStop(0, rgba(z.c, .5)); g.addColorStop(1, rgba(z.c, 0)); X.fillStyle = g; X.fillRect(q[0] - r, q[1] - r, 2 * r, 2 * r); });
    X.restore();
    X.beginPath(); BR.forEach((p, i) => { const q = pj(p[0], p[1]); i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1]); }); X.closePath();
    X.strokeStyle = 'rgba(200,215,240,.55)'; X.lineWidth = 1.5; X.stroke();
    X.restore();
    // nota do mapa
    const nota = 'regiões aproximadas; os nomes variam também dentro de cada região';
    if (NAR) tx('regiões aproximadas; os nomes variam', A.cx, my + ms + 4, { s: 12, c: K('dim'), bg: false });
    else wrapR(nota, mx + ms * .02, my + ms * .9, ms * .34, { s: 12, a: 'left', c: K('dim'), lh: 15 });
    // balões aparecem, depois voam e se fundem
    const fly = ss(seg(T, 4.5, 6.5)), sz = NAR ? 12 : 14;
    BAL.forEach(b => {
      if (NAR && b.mar) return;
      const a = ss(seg(T, .3 + b.d, .8 + b.d)), q = pj(b.lo, b.la), x = lerp(q[0], lx, fly), y = lerp(q[1], ly, fly);
      balao(x, y, b.t, b.c, a * (1 - ss(seg(T, 5.6, 6.5))), sz);
    });
    // rótulo único e a divisão em gênero + epíteto
    const ap = ss(seg(T, 5.8, 6.8)), sp = ss(seg(T, 7.5, 9));
    if (ap > .01) {
      X.save(); X.globalAlpha = ap;
      const big = NAR ? 24 : 34, gap = lerp(0, NAR ? 34 : 48, sp);
      const w1 = richW('*Manihot*', { s: big, w: 700 }), w2 = richW('*esculenta*', { s: big, w: 700 }), sw = richW(' ', { s: big, w: 700 });
      const tot = w1 + w2 + sw + gap, x1 = lx - tot / 2 + w1 / 2, x2 = lx + tot / 2 - w2 / 2;
      if (sp > .01) {
        X.save(); X.globalAlpha *= sp;
        rr(x1 - w1 / 2 - 12, ly - big * .75, w1 + 24, big * 1.5, 12, rgba(GEN, .18), GEN, 2);
        rr(x2 - w2 / 2 - 12, ly - big * .75, w2 + 24, big * 1.5, 12, rgba(ESP, .18), ESP, 2);
        const yb = ly + big * .75 + 12;
        tx('gênero', x1, yb + 6, { s: NAR ? 13 : 15, w: 700, c: GEN, bg: false });
        tx(NAR ? 'epíteto' : 'epíteto específico', x2, yb + 6, { s: NAR ? 13 : 15, w: 700, c: ESP, bg: false });
        if (NAR) tx('específico', x2, yb + 22, { s: 13, w: 700, c: ESP, bg: false });
        const yt = ly - big * .75 - 18;
        tx('nome da espécie: as duas palavras juntas', lx, yt, { s: NAR ? 12 : 14, c: K('dim'), bg: false });
        X.restore();
      }
      rich('*Manihot*', x1, ly, { s: big, w: 700, c: sp > .5 ? light(GEN, .55) : K('txt'), bg: false });
      rich('*esculenta*', x2, ly, { s: big, w: 700, c: sp > .5 ? light(ESP, .55) : K('txt'), bg: false });
      if (sp < .5 && !NAR) tx('um nome só, no mundo todo', lx, ly + big + 4, { s: 14, c: K('dim'), bg: false });
      X.restore();
    }
    cap(T < 4.5 ? 'A mesma planta tem nomes populares diferentes: <b>macaxeira</b>, <b>mandioca</b>, <b>aipim</b>, e <i>cassava</i> em inglês.'
      : T < 7.5 ? 'O nome científico é um só e vale no mundo todo: <i>Manihot esculenta</i>.'
        : 'Duas palavras: o <b>gênero</b> (<i>Manihot</i>) e o <b>epíteto específico</b> (<i>esculenta</i>, "comestível"). A espécie é o binômio inteiro.');
  }

  const GENS = ['Homo', 'Zea', 'Aedes', 'Panthera'];
  const EPIS = ['onca', 'mays', 'sapiens', 'leo', 'aegypti'];
  const SERES = {
    'Homo sapiens': { p: 'ser humano', f: humano, m: '"homem sábio"' },
    'Zea mays': { p: 'milho', f: milho, m: 'planta da família do capim' },
    'Aedes aegypti': { p: 'mosquito-da-dengue', f: mosquito, m: 'transmite dengue, zika e chikungunya' },
    'Panthera onca': { p: 'onça-pintada', f: (x, y, u) => felino(x, y, u, false), m: 'maior felino das Américas' },
    'Panthera leo': { p: 'leão', f: (x, y, u) => felino(x, y, u, true), m: 'felino da África' }
  };
  function chip(x, y, w, h, s, c, on, done) {
    rr(x, y, w, h, 10, on ? rgba(c, .32) : done ? 'rgba(19,26,43,.6)' : PAN, on ? AMB : rgba(c, done ? .4 : .85), on ? 2.5 : 1.5);
    rich('*' + s + '*', x + w / 2, y + h / 2 + .5, { s: NAR ? 15 : 17, w: 700, c: done && !on ? K('dim') : K('txt'), bg: false });
    if (done) check(x + w - 14, y + 12, 4, SIM);
  }
  function cenaMonte(S, A, H_) {
    S.found = S.found || {};
    const nG = GENS.length, nE = EPIS.length;
    let gb = [], eb = [], rp;
    if (NAR) {
      const cw = (A.w - 3 * 8) / 4, ch = 38, y1 = A.y0 + 22;
      GENS.forEach((g, i) => gb.push([A.x0 + i * (cw + 8), y1, cw, ch]));
      const ew = (A.w - 2 * 8) / 3, y2 = y1 + ch + 30;
      EPIS.forEach((e, i) => { const r = i < 3 ? 0 : 1, c = i < 3 ? i : i - 3, off = r ? (A.w - 2 * ew - 8) / 2 : 0; eb.push([A.x0 + off + c * (ew + 8), y2 + r * (ch + 8), ew, ch]); });
      const ry = y2 + 2 * ch + 20; rp = [A.x0, ry, A.w, A.y1 - ry];
      tx('gêneros', A.x0, y1 - 11, { s: 12, w: 700, a: 'left', c: GEN, bg: false });
      tx('epítetos', A.x0, y2 - 11, { s: 12, w: 700, a: 'left', c: ESP, bg: false });
    } else {
      const cw = Math.min(170, A.w * .14), ch = 44, gap = 10, colH = nE * ch + (nE - 1) * gap, y0 = A.y0 + (A.h - colH) / 2 + 10;
      const xg = A.x0 + Math.max(0, A.w * .05), xe = xg + cw + 40;
      const yg0 = y0 + (colH - (nG * ch + (nG - 1) * gap)) / 2;
      GENS.forEach((g, i) => gb.push([xg, yg0 + i * (ch + gap), cw, ch]));
      EPIS.forEach((e, i) => eb.push([xe, y0 + i * (ch + gap), cw, ch]));
      tx('gêneros', xg + cw / 2, y0 - 18, { s: 14, w: 700, c: GEN, bg: false });
      tx('epítetos', xe + cw / 2, y0 - 18, { s: 14, w: 700, c: ESP, bg: false });
      const rx = xe + cw + 40; rp = [rx, A.y0 + 36, A.x1 - rx, A.h - 46];
    }
    const doneG = g => EPIS.every(e => !SERES[g + ' ' + e] || S.found[g + ' ' + e]);
    GENS.forEach((g, i) => { const [x, y, w, h] = gb[i]; chip(x, y, w, h, g, GEN, S.g === i, doneG(g)); H_.push({ x, y, w, h, on: () => { S.g = S.g === i ? null : i; S.res = null; if (S.e != null) avaliar(S); } }); });
    EPIS.forEach((e, i) => { const [x, y, w, h] = eb[i]; const dn = GENS.some(g => S.found[g + ' ' + e]); chip(x, y, w, h, e, ESP, S.e === i, dn); H_.push({ x, y, w, h, on: () => { S.e = S.e === i ? null : i; S.res = null; if (S.g != null) avaliar(S); } }); });
    // painel do resultado
    const [rx, ry, rw, rh] = rp; card(rx, ry, rw, rh);
    const nf = Object.keys(S.found).length;
    if (!S.res) {
      const sel = S.g != null ? `*${GENS[S.g]}* + ...` : S.e != null ? `... + *${EPIS[S.e]}*` : '';
      wrapR(S.g == null && S.e == null ? 'Toque num gênero e depois num epíteto para montar um nome científico.' : 'Agora escolha a outra peça.', rx + rw / 2, ry + rh / 2 - 20, rw - 40, { s: NAR ? 14 : 16, w: 600, lh: 22 });
      if (sel) rich(sel, rx + rw / 2, ry + rh / 2 + 30, { s: NAR ? 18 : 22, w: 700, bg: false });
    } else if (S.res.ok) {
      const nm = S.res.n, d = SERES[nm], u = Math.min(rw * .42, rh * .42);
      d.f(rx + rw / 2, ry + rh * .36, u);
      const ty = ry + rh * .36 + u * .62 + 10, big = NAR ? 20 : 26;
      rich('*' + nm + '*', rx + rw / 2, cl(ty, ry + 20, ry + rh - 60), { s: big, w: 700, bg: false });
      tx(d.p, rx + rw / 2, cl(ty, ry + 20, ry + rh - 60) + big * .5 + 14, { s: NAR ? 14 : 16, w: 600, c: K('dim'), bg: false });
      if (nm.startsWith('Panthera') && rh > 160) pilula(rx + rw / 2, ry + rh - 24, NAR ? 'mesmo gênero: espécies próximas' : 'mesmo gênero = espécies próximas', AMB, { s: 13, h: 28 });
    } else {
      xis(rx + rw / 2, ry + rh * .3, 16, NAO);
      rich(`*${S.res.n}*`, rx + rw / 2, ry + rh * .3 + 40, { s: NAR ? 18 : 22, w: 700, c: K('dim'), bg: false });
      wrapR('Esse par não forma o nome de nenhum ser vivo da lista. Tente outra combinação.', rx + rw / 2, ry + rh * .3 + 76, rw - 40, { s: 14, lh: 19 });
    }
    tx(`${nf} de 5 nomes montados`, rx + 12, ry + 14, { s: 12, w: 600, a: 'left', c: K('dim'), bg: false });
    const r = S.res;
    cap(!r ? 'Junte um <b>gênero</b> e um <b>epíteto</b>. O epíteto sozinho não identifica nenhum ser vivo.'
      : r.ok && r.n.startsWith('Panthera') ? `<i>${r.n}</i>: ${SERES[r.n].p}. <i>Panthera onca</i> e <i>Panthera leo</i> são do mesmo gênero, por isso também da mesma família, ordem e classe.`
        : r.ok ? `<i>${r.n}</i>: ${SERES[r.n].p} (${SERES[r.n].m}).`
          : 'Esse binômio não existe na lista. Cada epíteto só tem sentido junto do seu gênero.');
  }
  function avaliar(S) {
    const n = GENS[S.g] + ' ' + EPIS[S.e], ok = !!SERES[n]; S.res = { n, ok };
    if (ok) S.found[n] = true;
    S.g0 = S.g; S.e0 = S.e; S.g = null; S.e = null;
  }

  def('nomes', 'binomial', {
    t: 'Nomenclatura binomial', s: 'gênero + epíteto, o mesmo nome no mundo todo', c: GEN,
    loc: 'Nomes populares mudam de região para região; o científico vale no mundo todo',
    still: 12, stillV: 0, ctl: ctlN,
    tap: tapH,
    extra: [{ t: 'Recomeçar o jogo', on: S => { S.found = {}; S.res = null; S.g = null; S.e = null; if (Math.round(S.v) !== 1) setV(S, ctlN, 1); }, pressed: () => false }],
    alt: 'Um mapa esquemático do Brasil com balões: macaxeira no Norte e no Nordeste, mandioca no Sudeste e no Centro-Oeste, aipim no Sul e no Rio de Janeiro, e cassava em inglês. Os balões se fundem no rótulo único Manihot esculenta, em itálico, que se divide em duas peças: gênero (Manihot, em laranja) e epíteto específico (esculenta, em vermelho). Na cena "Monte o nome", o aluno junta um gênero (Homo, Zea, Aedes, Panthera) e um epíteto (sapiens, mays, aegypti, onca, leo) e a tela mostra o ser vivo: ser humano, milho, mosquito-da-dengue, onça-pintada ou leão',
    d: `<p>O nome popular muda de lugar para lugar: a mesma planta é <b>mandioca</b>, <b>aipim</b> ou <b>macaxeira</b>, conforme a região do Brasil, e <i>cassava</i> em inglês. E um nome popular pode servir para seres bem diferentes: "peixe-boi" é um mamífero, e "estrela-do-mar" não é peixe nem estrela. O <b>nome científico</b> resolve isso: é um só, vale no mundo todo e não se repete. Para a mandioca, é <b><i>Manihot esculenta</i></b>.</p>
<p>O nome da espécie tem <b>duas palavras</b>. A primeira é o <b>gênero</b> (<i>Manihot</i>); a segunda é o <b>epíteto específico</b> (<i>esculenta</i>, "comestível"). O epíteto sozinho não identifica nada: <i>esculenta</i> aparece em várias plantas de gêneros diferentes. As palavras são em <b>latim</b> ou latinizadas, e muitas descrevem o ser vivo (<i>Homo sapiens</i>, "homem sábio") ou homenageiam alguém: <i>Trypanosoma cruzi</i>, o protozoário da doença de Chagas, foi batizado por Carlos <b>Chagas</b> em 1909 em homenagem a Oswaldo <b>Cruz</b>. As regras são fixadas por <b>códigos internacionais</b>: um para animais (ICZN), um para plantas, algas e fungos (ICN) e um para procariontes. Pela <b>lei da prioridade</b>, quando a mesma espécie recebe dois nomes, vale o mais antigo, contando a partir de 1758 para animais e 1753 para plantas.</p>
<p>A faixa troca a cena: o mapa dos nomes populares (regiões aproximadas, sem fronteiras exatas) e o jogo "Monte o nome", em que você junta um gênero e um epíteto.</p>`,
    kv: [['Gênero', 'primeira palavra, com maiúscula (<i>Manihot</i>)'], ['Epíteto específico', 'segunda palavra, com minúscula (<i>esculenta</i>)'], ['Espécie', 'o binômio inteiro (<i>Manihot esculenta</i>)'], ['Lei da prioridade', 'vale o nome mais antigo (desde 1758 para animais, 1753 para plantas)']],
    enem: 'O nome científico é <b>universal</b> e <b>único</b>, e evita a confusão dos nomes populares. A questão costuma dar nomes como <i>Panthera onca</i> e <i>Panthera leo</i> e perguntar o parentesco: <b>mesmo gênero</b>, portanto também mesma família, ordem e classe. Lembre que o nome da <b>espécie</b> é o binômio inteiro; a segunda palavra sozinha é só o <b>epíteto</b>.',
    links: [['Como escrever um nome científico', '#nomes/regras'], ['As categorias taxonômicas', '#categorias/hierarquia']],
    draw(t, S) {
      const A = area(), sc = Math.round(S.v), H_ = hits(S), lt = local(S, t);
      if (sc === 1) cenaMonte(S, A, H_); else cenaMapa(S, A, lt);
    }
  });

  // =====================================================================================
  // N2 COMO ESCREVER UM NOME CIENTÍFICO
  // =====================================================================================
  const CEN_R = ['lupa do revisor', 'corretor de nomes'];
  const ctlR = { l: 'Cena', min: 0, max: 1, step: 1, v: 0, f: v => CEN_R[Math.round(v)] || '', rate: () => 1 };
  const PAG = ['*Trypanosoma cruzi* Chagas, 1909', 'depois, abreviado: *T. cruzi*', 'espécie não identificada: *Rhinella* sp.', 'subespécie: *Crotalus durissus terrificus*', 'família: Felidae'];
  // paradas da lupa: linha, palavra (índice no layout), parte ('i' = só a inicial, 'a' = palavras de a até b)
  const PAR_R = [
    { l: 0, a: 0, b: 0, ini: 1, t: 'Gênero com letra maiúscula: <i><b>T</b>rypanosoma</i>.' },
    { l: 0, a: 1, b: 1, ini: 1, t: 'Epíteto sempre com minúscula, mesmo homenageando Oswaldo Cruz: <i>cruzi</i>.' },
    { l: 0, a: 0, b: 1, t: 'Nome científico em itálico no texto digitado; escrito à mão, sublinhado (cada palavra).' },
    { l: 0, a: 2, b: 3, t: 'Autor e ano podem vir depois do nome, sem itálico.' },
    { l: 1, a: 2, b: 2, t: 'Depois da primeira vez, o gênero pode ser abreviado pela inicial: <i>T. cruzi</i>. O epíteto nunca aparece sozinho.' },
    { l: 2, a: 4, b: 4, t: 'Espécie não identificada: gênero seguido de "sp." (ou "spp.", várias), e o "sp." fica reto.' },
    { l: 3, a: 3, b: 3, t: 'Uma terceira palavra, em itálico e minúscula, indica a subespécie: nome trinomial.' },
    { l: 4, a: 1, b: 1, t: 'Família para cima: maiúscula e, no padrão escolar, sem itálico. Família de animal termina em -idae.' }
  ];
  function pagina(px, py, pw, lh, sz, sel) {
    const out = [];
    PAG.forEach((s, i) => {
      const y = py + (i + .5) * lh, L = rich(s, px, y, { s: sz, a: 'left', c: sel && sel.l !== i ? 'rgba(232,237,247,.55)' : K('txt'), bg: false });
      // rótulos de contexto ("depois, abreviado:") em cinza: tudo antes da primeira palavra em itálico, exceto a linha 0
      out.push({ L, y });
    });
    return out;
  }
  function cenaLupa(S, A) {
    if (S.k == null) { S.k = 0; S.kt = 0; }
    S.kt += S.dt; if (S.kt > 3.4) { S.kt = 0; S.k = (S.k + 1) % PAR_R.length; }
    const P = PAR_R[S.k], sz = NAR ? 16 : 24, lh = NAR ? 36 : 50;
    const maxW = Math.max(...PAG.map(s => richW(s, { s: sz }))), pw = Math.min(A.w, maxW + (NAR ? 28 : 80)), ph = lh * PAG.length + 24;
    const ruleH = NAR ? 92 : 80, totH = ph + 18 + ruleH, px = A.cx - pw / 2, py = A.y0 + Math.max(4, (A.h - totH) / 2);
    card(px, py, pw, ph, { f: 'rgba(236,232,222,.06)' });
    const tx0 = px + (pw - maxW) / 2, ty0 = py + 12;
    const lines = pagina(tx0, ty0, pw, lh, sz, P);
    // alvo da parada
    const ln = lines[P.l], T = ln.L.T, k0 = T[P.a], k1 = T[P.b];
    let x0 = k0.ax, x1 = k1.ax + k1.wd;
    if (P.ini) { X.font = ITF(k0.i, 400, sz); x1 = x0 + X.measureText(k0.w[0]).width; }
    const tcx = (x0 + x1) / 2, tcy = ln.y;
    // destaque na página
    rr(x0 - 4, tcy - sz * .72, x1 - x0 + 8, sz * 1.44, 6, null, AMB, 2);
    if (S.k === 2) { line(x0, tcy + sz * .62, k0.ax + k0.wd, tcy + sz * .62, AMB, 1.5); line(k1.ax, tcy + sz * .62, x1, tcy + sz * .62, AMB, 1.5); }
    // a lupa desliza até o alvo
    S.lx = S.lx == null ? tcx : lerp(S.lx, tcx, cl((S.paused ? 1 : S.dt * 6), 0, 1)); S.ly = S.ly == null ? tcy : lerp(S.ly, tcy, cl((S.paused ? 1 : S.dt * 6), 0, 1));
    const R = NAR ? 34 : 50, zoom = 1.8, lcx = cl(S.lx, px + R, px + pw - R), lcy = S.ly - (NAR ? 0 : 0);
    X.save(); X.beginPath(); X.arc(lcx, lcy, R, 0, TAU); X.clip(); X.fillStyle = '#18213a'; X.fillRect(lcx - R, lcy - R, 2 * R, 2 * R);
    X.translate(lcx, lcy); X.scale(zoom, zoom); X.translate(-S.lx, -S.ly);
    pagina(tx0, ty0, pw, lh, sz, null);
    rr(x0 - 4, tcy - sz * .72, x1 - x0 + 8, sz * 1.44, 6, null, AMB, 1.5);
    X.restore();
    circ(lcx, lcy, R, null, 'rgba(232,237,247,.9)', 3);
    X.save(); X.lineCap = 'round'; line(lcx + R * .72, lcy + R * .72, lcx + R * 1.25, lcy + R * 1.25, '#C9B79A', 7); X.restore();
    // cartão da regra
    const ry = py + ph + 18; card(px, ry, pw, ruleH, { f: PAN2 });
    tx(`regra ${S.k + 1} de ${PAR_R.length}`, px + 14, ry + 16, { s: 12, w: 700, a: 'left', c: AMB, bg: false });
    const plain = P.t.replace(/<i>(.*?)<\/i>/g, '*$1*').replace(/<\/?b>/g, '');
    wrapR(plain, px + 14, ry + 38, pw - 28, { s: NAR ? 13 : 15, a: 'left', lh: NAR ? 17 : 20 });
    cap(P.t);
  }

  const CORR = [
    { s: '*Homo sapiens*', ok: 1, why: 'Gênero com maiúscula, epíteto com minúscula, tudo em itálico.' },
    { s: '*homo sapiens*', ok: 0, why: 'O gênero começa com letra maiúscula.', fix: '*Homo sapiens*' },
    { s: '*Trypanosoma Cruzi*', ok: 0, why: 'O epíteto vai sempre com minúscula, mesmo homenageando Oswaldo Cruz.', fix: '*Trypanosoma cruzi*' },
    { s: 'Aedes aegypti', ctx: 'digitado num texto', ok: 0, why: 'Digitado, o nome científico vai em itálico.', fix: '*Aedes aegypti*' },
    { s: '*Rhinella sp.*', ctx: 'o "sp." também em itálico', ok: 0, why: 'O "sp." fica reto, sem itálico.', fix: '*Rhinella* sp.' },
    { s: '*Rhinella* sp.', ok: 1, why: 'Espécie não identificada: gênero em itálico e "sp." reto.' },
    { s: '*E. coli*', ctx: 'depois de *Escherichia coli* já ter aparecido', ok: 1, why: 'Depois da primeira vez, o gênero pode ser abreviado pela inicial.' },
    { s: '*coli*', ctx: 'sozinho, para falar da bactéria', ok: 0, why: 'O epíteto nunca aparece sozinho.', fix: '*Escherichia coli* ou *E. coli*' },
    { s: '*Crotalus durissus terrificus*', ctx: 'a cascavel brasileira', ok: 1, why: 'Três palavras em itálico, a terceira em minúscula: subespécie (nome trinomial).' },
    { s: '*Felidae*', ctx: 'nome de família, em itálico', ok: 0, why: 'No padrão escolar, família tem maiúscula e fica sem itálico.', fix: 'Felidae' }
  ];
  function responder(S, r) { if (S.ans != null || S.ci >= CORR.length) return; S.ans = r; if (!!r === !!CORR[S.ci].ok) S.pts = (S.pts || 0) + 1; }
  function proximo(S) { if (S.ci >= CORR.length) { S.ci = 0; S.pts = 0; S.ans = null; return; } if (S.ans == null) return; S.ci++; S.ans = null; }
  function cenaCorretor(S, A, H_) {
    if (S.ci == null) { S.ci = 0; S.pts = 0; S.ans = null; }
    const pw = Math.min(A.w, 680), px = A.cx - pw / 2, py = A.y0 + (NAR ? 4 : 14), ph = A.h - (NAR ? 8 : 18);
    card(px, py, pw, ph);
    // pontinhos de progresso
    const n = CORR.length, dg = NAR ? 16 : 22, dx0 = A.cx - (n - 1) * dg / 2;
    for (let i = 0; i < n; i++) circ(dx0 + i * dg, py + 18, i === S.ci ? 6 : 4.5, i < S.ci ? rgba(AMB, .8) : i === S.ci ? AMB : 'rgba(143,160,200,.35)');
    if (S.ci >= n) {
      tx(`Você acertou ${S.pts} de ${n}`, A.cx, py + ph * .38, { s: NAR ? 22 : 28, w: 700, f: FH, c: K('txt'), bg: false });
      wrapR(S.pts >= 8 ? 'Muito bem: as regras de escrita estão firmes.' : 'Reveja as regras na lupa do revisor e tente de novo.', A.cx, py + ph * .38 + 36, pw - 40, { s: 15, c: K('dim'), lh: 20 });
      const b = pilula(A.cx, py + ph * .7, 'Recomeçar', AMB, { s: 15, h: 44 }); H_.push(Object.assign(b, { on: () => proximo(S) }));
      cap(`Corretor concluído: ${S.pts} de ${n} acertos.`); return;
    }
    const it = CORR[S.ci], big = NAR ? 24 : 34;
    tx(`nome ${S.ci + 1} de ${n}`, A.cx, py + 42, { s: 13, w: 600, c: K('dim'), bg: false });
    const ny = py + ph * (NAR ? .26 : .28);
    if (it.ctx) rich('(' + it.ctx + ')', A.cx, ny + big * .9 + 8, { s: NAR ? 13 : 14, c: K('dim'), bg: false });
    rich(it.s, A.cx, ny, { s: big, w: 600, c: K('txt'), bg: false });
    const by = py + ph * (NAR ? .5 : .52), bw = NAR ? (pw - 48) / 2 : 160, bh = 44;
    const btn = (x, lbl, c, r) => {
      const sel = S.ans === r, right = S.ans != null && !!r === !!it.ok;
      rr(x, by - bh / 2, bw, bh, 10, sel ? rgba(c, .3) : PAN2, S.ans != null && right ? c : rgba(c, .7), sel || (S.ans != null && right) ? 2.5 : 1.5);
      tx(lbl, x + bw / 2, by, { s: 16, w: 700, c: K('txt'), bg: false });
      if (S.ans == null) H_.push({ x, y: by - bh / 2, w: bw, h: bh, on: () => responder(S, r) });
    };
    btn(A.cx - bw - 8, 'certo', SIM, 1); btn(A.cx + 8, 'errado', NAO, 0);
    if (S.ans != null) {
      const ac = !!S.ans === !!it.ok, fy = by + bh / 2 + 26;
      tok(A.cx, fy, ac ? 'você acertou' : 'não foi dessa vez', ac ? SIM : NAO);
      const h1 = wrapR((it.ok ? 'Está certo. ' : 'Está errado. ') + it.why, A.cx, fy + 28, pw - 40, { s: NAR ? 14 : 15, lh: NAR ? 18 : 20 });
      let yy = fy + 28 + h1;
      if (it.fix) { yy += wrapR('forma correta: ' + it.fix, A.cx, yy + 8, pw - 40, { s: NAR ? 16 : 18, w: 600, c: SIM, lh: NAR ? 20 : 24 }) + 6; }
      const b = pilula(A.cx, Math.min(py + ph - 28, yy + 28), S.ci === n - 1 ? 'Ver resultado' : 'Próximo nome', AMB, { s: 14, h: 40 });
      H_.push(Object.assign(b, { on: () => proximo(S) }));
    }
    tx(`acertos: ${S.pts}`, px + pw - 14, py + 42, { s: 12, w: 600, a: 'right', c: K('dim'), bg: false });
    const txt = it.s.replace(/\*(.*?)\*/g, '<i>$1</i>');
    cap(S.ans == null ? `Esta forma está certa ou errada? ${txt}${it.ctx ? ' (' + it.ctx.replace(/\*(.*?)\*/g, '<i>$1</i>') + ')' : ''}` : (it.ok ? 'Certo. ' : 'Errado. ') + it.why);
  }

  def('nomes', 'regras', {
    t: 'Como escrever um nome científico', s: 'itálico, maiúscula, sp. e subespécie', c: ESP,
    loc: 'Em livros, artigos, provas e na redação do ENEM',
    still: 0, stillV: 0, ctl: ctlR,
    tap: tapH,
    extra: [
      { t: 'Certo', on: S => { if (Math.round(S.v) !== 1) { setV(S, ctlR, 1); return; } responder(S, 1); }, pressed: () => false },
      { t: 'Errado', on: S => { if (Math.round(S.v) !== 1) { setV(S, ctlR, 1); return; } responder(S, 0); }, pressed: () => false },
      { t: 'Avançar', on: S => { if (Math.round(S.v) === 0) { S.k = ((S.k || 0) + 1) % PAR_R.length; S.kt = 0; } else proximo(S); }, pressed: () => false }
    ],
    alt: 'Uma folha com cinco linhas: Trypanosoma cruzi Chagas, 1909; T. cruzi; Rhinella sp.; Crotalus durissus terrificus; Felidae. Uma lupa de revisor passa por cada uma e destaca uma regra por vez: a maiúscula do gênero, a minúscula do epíteto, o itálico, o autor sem itálico, o gênero abreviado, o sp. reto, a terceira palavra da subespécie e a família sem itálico. Na cena do corretor, dez nomes escritos de jeitos diferentes aparecem um por vez; o aluno marca certo ou errado e a tela aponta a regra e a forma correta',
    d: `<p>As regras são poucas e caem muito em prova:</p>
<ol>
<li>O nome científico vai em <b>itálico</b> no texto digitado; escrito à mão, <b>sublinhado</b> (cada palavra separadamente).</li>
<li>O <b>gênero</b> começa com letra <b>maiúscula</b>; o <b>epíteto</b>, sempre com <b>minúscula</b>, mesmo quando homenageia uma pessoa ou um lugar: <i>Trypanosoma cruzi</i>, <i>Aedes aegypti</i>.</li>
<li>Depois da primeira vez no texto, o gênero pode ser <b>abreviado</b> pela inicial: <i>T. cruzi</i>, <i>E. coli</i> (<i>Escherichia coli</i>). O epíteto nunca aparece sozinho.</li>
<li>Quando não se sabe (ou não importa) a espécie, escreve-se o gênero seguido de <b>sp.</b> (uma espécie) ou <b>spp.</b> (várias): <i>Rhinella</i> sp., <i>Plasmodium</i> spp. O "sp." <b>não</b> vai em itálico.</li>
<li>A <b>subespécie</b> ganha uma terceira palavra, também em itálico e minúscula: é o <b>nome trinomial</b>. A cascavel brasileira é <i>Crotalus durissus terrificus</i>; quem considera o cão uma subespécie do lobo escreve <i>Canis lupus familiaris</i>.</li>
<li>O nome do <b>autor</b> e o ano podem vir depois, sem itálico: <i>Homo sapiens</i> Linnaeus, 1758.</li>
<li>Nomes de categorias <b>acima do gênero</b> (família, ordem, classe...) começam com maiúscula e, no uso escolar, <b>não</b> vão em itálico: Hominidae, Felidae, Mammalia. Nos animais, o nome de família termina em <b>-idae</b>; nas plantas, em <b>-aceae</b> (Poaceae, a família do milho e da cana).</li>
</ol>
<p>A faixa troca a cena: a lupa do revisor, que mostra uma regra por vez, e o corretor de nomes, com dez formas para você marcar como certas ou erradas. Os botões da barra fazem o mesmo que os toques na tela: "Avançar" passa para a próxima regra na lupa e para o próximo nome no corretor. Em botânica, o código recomenda itálico em todos os níveis; por isso o exemplo de família do corretor é zoológico.</p>`,
    enem: 'Regras que a prova cobra: <b>itálico</b> (ou sublinhado à mão); <b>gênero com maiúscula</b>, <b>epíteto com minúscula</b>; o binômio inteiro é a espécie; <b>sp.</b> quando a espécie não é identificada; <b>três nomes</b> indicam <b>subespécie</b>. Pegadinha clássica: em <i>Trypanosoma cruzi</i>, o "c" é minúsculo, mesmo homenageando Oswaldo Cruz.',
    links: [['Nomenclatura binomial', '#nomes/binomial'], ['As categorias taxonômicas', '#categorias/hierarquia']],
    draw(t, S) {
      const A = area(), sc = Math.round(S.v), H_ = hits(S);
      if (sc === 1) cenaCorretor(S, A, H_); else cenaLupa(S, A);
    }
  });
}
