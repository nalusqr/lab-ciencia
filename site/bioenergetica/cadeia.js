/* LAB - Bioenergética · rota resp/cadeia. Ilustração animada da cadeia transportadora e da quimiosmose.
   Canvas 2D com camadas em cache (membrana e proteínas), partículas desenhadas por cima e hotspots em HTML.
   Usa o motor (motor.js): X, W, H, NAR, area, C, rng, ss, cl, lerp, fr, pth, light, dark, cap, $. */
'use strict';
const CAD = (() => {
  const DUR = 6;                                   // segundos por etapa, no ritmo 1×
  const reduzir = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = () => Math.min(2, window.devicePixelRatio || 1);
  const COR = { I: '#E6A07E', II: '#D9B574', III: '#CB7F94', IV: '#DD6F55', Fo: '#F2D2A0', F1: '#E9A24E', cab: '#E8876A' };
  const DICA = [
    { id: 'I', n: 'Complexo I', t: 'Recebe os elétrons do NADH e bombeia H⁺ para o espaço intermembranas.' },
    { id: 'III', n: 'Complexo III', t: 'Passa os elétrons da ubiquinona ao citocromo c e bombeia H⁺.' },
    { id: 'IV', n: 'Complexo IV', t: 'Entrega os elétrons ao O₂ e bombeia H⁺. O cianeto bloqueia este complexo.' },
    { id: 'S', n: 'ATP sintase', t: 'Os H⁺ voltam à matriz por ela. A passagem gira o rotor e une ADP e fosfato em ATP.' },
    { id: 'II', n: 'Complexo II', t: 'Recebe os elétrons do FADH₂ e não bombeia H⁺. Também atua no ciclo de Krebs.' },
    { id: 'Q', n: 'Ubiquinona', t: 'Carregador móvel na membrana: leva elétrons dos complexos I e II até o III.' },
    { id: 'c', n: 'Citocromo c', t: 'Carregador móvel no espaço intermembranas: leva elétrons do complexo III ao IV.' },
    { id: 'O', n: 'Oxigênio (O₂)', t: 'Aceptor final dos elétrons. Com H⁺, forma água. Sem ele a cadeia para.' },
    { id: 'G', n: 'Gradiente de H⁺', t: 'Os H⁺ se acumulam no espaço intermembranas. Essa diferença guarda a energia que move a ATP sintase.' }
  ];
  let L = null, LK = '', cur = null, act = null, pin = null, hov = null, foc = null, ui = null, lastUse = 0, idleT = 0;
  const pt = { x: 0, y: 0, tx: 0, ty: 0 };
  const SPH = {};

  // ---------- ferramentas de camada ----------
  function mk(w, h, fn) {
    const d = dpr(), c = document.createElement('canvas'); c.width = Math.ceil(w * d); c.height = Math.ceil(h * d);
    const g = c.getContext('2d'); g.scale(d, d); const keep = X; X = g;
    try { fn(g); } finally { X = keep; }
    return { c, w, h };
  }
  function esfera(cor) {
    if (SPH[cor]) return SPH[cor];
    const r = 20; return SPH[cor] = mk(r * 2 + 6, r * 2 + 6, g => {
      g.translate(r + 3, r + 3);
      const sh = g.createRadialGradient(0, r * .75, 1, 0, r * .75, r); sh.addColorStop(0, 'rgba(0,0,0,.28)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = sh; g.fillRect(-r - 3, -r - 3, r * 2 + 6, r * 2 + 6);
      const q = g.createRadialGradient(-r * .35, -r * .4, 1, -r * .1, -r * .1, r * 1.1);
      q.addColorStop(0, light(cor, .8)); q.addColorStop(.3, light(cor, .3)); q.addColorStop(.72, cor); q.addColorStop(1, dark(cor, .5));
      g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fillStyle = q; g.fill();
    });
  }
  function bola(x, y, r, cor, a = 1) {
    if (a <= .01) return; const s = esfera(cor), k = r / 20;
    X.save(); X.globalAlpha *= a; X.drawImage(s.c, x - 23 * k, y - 23 * k, 46 * k, 46 * k); X.restore();
  }
  function protonSpr() {
    return SPH.hp || (SPH.hp = mk(26, 26, g => {
      g.translate(13, 13); const q = g.createRadialGradient(-3, -4, .5, 0, 0, 11);
      q.addColorStop(0, '#FFFFFF'); q.addColorStop(.55, '#DCE8FF'); q.addColorStop(1, '#7E9BDB');
      g.beginPath(); g.arc(0, 0, 10, 0, TAU); g.fillStyle = q; g.fill();
      g.strokeStyle = '#2C4A94'; g.lineWidth = 2; g.lineCap = 'round'; g.beginPath(); g.moveTo(-4.2, 0); g.lineTo(4.2, 0); g.moveTo(0, -4.2); g.lineTo(0, 4.2); g.stroke();
    }));
  }
  function hp(x, y, r, a = 1) { if (a <= .01) return; const s = protonSpr(); X.save(); X.globalAlpha *= a; X.drawImage(s.c, x - r, y - r, r * 2, r * 2); X.restore(); }
  function elSpr() {
    return SPH.el || (SPH.el = mk(40, 40, g => {
      g.translate(20, 20); const q = g.createRadialGradient(0, 0, 0, 0, 0, 20);
      q.addColorStop(0, 'rgba(255,252,230,1)'); q.addColorStop(.18, 'rgba(255,240,170,.95)'); q.addColorStop(.45, 'rgba(255,214,96,.38)'); q.addColorStop(1, 'rgba(255,200,80,0)');
      g.fillStyle = q; g.fillRect(-20, -20, 40, 40);
    }));
  }
  function el(x, y, r, a = 1) { if (a <= .01) return; const s = elSpr(); X.save(); X.globalAlpha *= a; X.drawImage(s.c, x - r * 2.6, y - r * 2.6, r * 5.2, r * 5.2); X.restore(); }
  const suave = (p, n = 2) => { for (let k = 0; k < n; k++) { const q = [p[0]]; for (let i = 0; i < p.length - 1; i++) { const a = p[i], b = p[i + 1]; q.push([a[0] * .75 + b[0] * .25, a[1] * .75 + b[1] * .25], [a[0] * .25 + b[0] * .75, a[1] * .25 + b[1] * .75]); } q.push(p[p.length - 1]); p = q; } return p; };

  // ---------- formas orgânicas ----------
  function prep(lobes, seed) {
    lobes.forEach((l, k) => {
      const R = rng(seed * 131 + k * 17 + 5), n = 14, p = [], c = Math.cos(l.rot || 0), s = Math.sin(l.rot || 0);
      for (let i = 0; i < n; i++) { const a = i / n * TAU, kk = 1 + (R() - .5) * .17, x = Math.cos(a) * l.rx * kk, y = Math.sin(a) * l.ry * kk; p.push([l.x + x * c - y * s, l.y + x * s + y * c]); }
      l.p = p;
    });
    return lobes;
  }
  function trace(l) {
    const p = l.p, n = p.length, m = i => [(p[i][0] + p[(i + 1) % n][0]) / 2, (p[i][1] + p[(i + 1) % n][1]) / 2];
    const a = m(n - 1); X.moveTo(a[0], a[1]);
    for (let i = 0; i < n; i++) { const b = m(i); X.quadraticCurveTo(p[i][0], p[i][1], b[0], b[1]); }
    X.closePath();
  }
  function proteina(lobes, cor, o = {}) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; const pad = 22;
    for (const l of lobes) for (const q of l.p) { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); }
    const w = x1 - x0 + pad * 2, h = y1 - y0 + pad * 2, ox = pad - x0, oy = pad - y0;
    const U = () => { X.beginPath(); lobes.forEach(trace); };
    const corpo = mk(w, h, g => {
      g.translate(ox, oy);
      U(); g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 12; g.shadowOffsetX = 3; g.shadowOffsetY = 6; g.fillStyle = dark(cor, .5); g.fill();
      g.shadowColor = 'transparent'; g.shadowBlur = 0; g.shadowOffsetX = 0; g.shadowOffsetY = 0;
      U(); g.lineJoin = 'round'; g.lineWidth = 2.2; g.strokeStyle = dark(cor, .5); g.stroke();
      const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, light(cor, .3)); gr.addColorStop(.5, cor); gr.addColorStop(1, dark(cor, .4));
      U(); g.fillStyle = gr; g.fill();
      g.globalCompositeOperation = 'source-atop';
      for (const l of lobes) {
        const m = Math.max(l.rx, l.ry);
        let q = g.createRadialGradient(l.x - l.rx * .35, l.y - l.ry * .42, 0, l.x - l.rx * .2, l.y - l.ry * .2, m * 1.05);
        q.addColorStop(0, 'rgba(255,255,255,.26)'); q.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = q; g.fillRect(l.x - m * 1.3, l.y - m * 1.3, m * 2.6, m * 2.6);
        q = g.createRadialGradient(l.x + l.rx * .5, l.y + l.ry * .6, 0, l.x + l.rx * .4, l.y + l.ry * .5, m * 1.0);
        q.addColorStop(0, 'rgba(24,6,4,.32)'); q.addColorStop(1, 'rgba(24,6,4,0)'); g.fillStyle = q; g.fillRect(l.x - m * 1.3, l.y - m * 1.3, m * 2.6, m * 2.6);
        if (l.hx) { g.lineCap = 'round'; const nh = Math.max(2, Math.round(l.rx * 2 / 9)); for (let i = 0; i < nh; i++) { const hx = l.x + (i - (nh - 1) / 2) * 8.5, sw = Math.sin(i * 2.3 + (l.rot || 0)) * 1.8; g.lineWidth = 3.4; g.strokeStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.moveTo(hx - sw, l.y - l.ry * .5); g.lineTo(hx + sw, l.y + l.ry * .5); g.stroke(); g.lineWidth = 1.2; g.strokeStyle = 'rgba(30,8,4,.14)'; g.beginPath(); g.moveTo(hx + 3 - sw, l.y - l.ry * .5); g.lineTo(hx + 3 + sw, l.y + l.ry * .5); g.stroke(); } }
      }
      g.globalCompositeOperation = 'source-over';
    });
    const halo = (cc, b) => mk(w, h, g => { g.translate(ox, oy); U(); g.shadowColor = cc; g.shadowBlur = b; g.fillStyle = cc; g.fill(); });
    return { corpo, ouro: halo('#FFD27A', 14), azul: halo('#9DC0FF', 14), ox, oy };
  }
  function pôr(s, x, y, a = 1, k = 1, kind = 'corpo') {
    if (a <= .01) return; const sp = s[kind]; X.save(); X.globalAlpha *= a; X.translate(x, y); X.scale(k, k); X.drawImage(sp.c, -s.ox, -s.oy, sp.w, sp.h); X.restore();
  }

  // ---------- layout e camadas em cache ----------
  function layout() {
    const A = area(), key = `${W}|${H}|${NAR}|${dpr()}`; if (key === LK && L) return L; LK = key;
    const mh = NAR ? 46 : Math.min(62, A.h * .17), s = NAR ? A.w * .135 : Math.min(A.w * .082, 96);
    const ym0 = A.y0 + A.h * (NAR ? .38 : .41), amp = NAR ? 4 : 8;
    const my = x => ym0 + Math.sin(x / W * TAU * .8 + .7) * amp + Math.sin(x / W * TAU * 2.3 + 1.4) * amp * .35;
    const px = f => A.x0 + A.w * f;
    const x = { I: px(.11), II: px(.285), III: px(.455), IV: px(.65), S: px(.875) };
    const armH = Math.min(NAR ? 84 : 66, (A.y1 - ym0 - mh / 2) * .42), arm2 = armH * .58;
    const hr = s * (NAR ? .36 : .3), stalk = NAR ? 10 : 14, R = s * .3;
    const l = { A, mh, s, ym0, my, x, armH, arm2, hr, stalk, R, bracketY: A.y0 + (NAR ? 54 : 40) };
    const mt = xx => my(xx) - mh / 2, mb = xx => my(xx) + mh / 2; l.mt = mt; l.mb = mb;
    // proteínas (sprites)
    const hI = armH / 2;
    l.sp = {
      I: proteina(prep([{ x: 0, y: 0, rx: .62 * s, ry: .56 * mh, hx: 1 }, { x: .3 * s, y: -.55 * mh, rx: .22 * s, ry: .2 * mh }, { x: -.2 * s, y: .45 * mh + hI, rx: .26 * s, ry: hI + .1 * mh, rot: .05 }, { x: -.2 * s, y: .5 * mh + armH, rx: .31 * s, ry: .12 * armH }], 1), COR.I),
      II: proteina(prep([{ x: 0, y: 0, rx: .4 * s, ry: .54 * mh, hx: 1 }, { x: 0, y: .48 * mh + arm2 / 2, rx: .3 * s, ry: arm2 / 2 + .08 * mh }], 2), COR.II),
      III: proteina(prep([{ x: -.27 * s, y: 0, rx: .3 * s, ry: .6 * mh, hx: 1 }, { x: .27 * s, y: 0, rx: .3 * s, ry: .6 * mh, hx: 1 }, { x: -.27 * s, y: -.62 * mh, rx: .24 * s, ry: .22 * mh }, { x: .27 * s, y: -.62 * mh, rx: .24 * s, ry: .22 * mh }, { x: -.27 * s, y: .62 * mh, rx: .2 * s, ry: .17 * mh }, { x: .27 * s, y: .62 * mh, rx: .2 * s, ry: .17 * mh }], 3), COR.III),
      IV: proteina(prep([{ x: 0, y: 0, rx: .42 * s, ry: .56 * mh, hx: 1 }, { x: .05 * s, y: -.6 * mh, rx: .3 * s, ry: .2 * mh }, { x: -.05 * s, y: .56 * mh, rx: .28 * s, ry: .16 * mh }], 4), COR.IV),
      Fo: proteina(prep([{ x: R + .14 * s, y: 0, rx: .17 * s, ry: .56 * mh, hx: 1 }, { x: hr * 1.02, y: .5 * mh + (stalk + hr) * .62, rx: .06 * s, ry: (stalk + hr) * .5, rot: -.12 }], 5), COR.Fo),
      F1: proteina(prep([{ x: -.52 * hr, y: .5 * mh + stalk + hr, rx: .62 * hr, ry: .9 * hr }, { x: .52 * hr, y: .5 * mh + stalk + hr, rx: .62 * hr, ry: .9 * hr }, { x: 0, y: .5 * mh + stalk + hr - .1 * hr, rx: .56 * hr, ry: .94 * hr }], 6), COR.F1)
    };
    l.bg = mk(W, H, g => cavidades(g, l));
    l.mem = mk(W, H, g => membrana(g, l));
    // caminhos
    const sI = x.I - .2 * s;
    const E = [[sI, mb(x.I) + armH + 12], [sI, my(x.I) + 4], [x.I + .25 * s, my(x.I) + 2], [x.III - .45 * s, my(x.III) + 2], [x.III - .27 * s, my(x.III) - 3], [x.III - .2 * s, mt(x.III) - 6], [x.III + .2 * s, mt(x.III) - 22], [x.IV - .1 * s, mt(x.IV) - 22], [x.IV, my(x.IV) - 4], [x.IV, mb(x.IV) + 16]];
    l.E = suave(E, 3);
    l.E2 = suave([[x.II, mb(x.II) + arm2 + 10], [x.II, my(x.II) + 4], [x.II + .3 * s, my(x.II) + 3], [x.III - .45 * s, my(x.III) + 2]], 3);
    const cen = (px0, py0) => { let b = 0, bd = 1e9; for (let i = 0; i <= 160; i++) { const q = pth(l.E, i / 160), d = Math.hypot(q[0] - px0, q[1] - py0); if (d < bd) { bd = d; b = i / 160; } } return b; };
    l.fc = { I: cen(x.I + .2 * s, my(x.I)), III: cen(x.III - .27 * s, my(x.III)), IV: cen(x.IV, my(x.IV)) };
    const sy = mb(x.S) + stalk + hr + 0; l.hy = sy;
    l.HP = suave([[x.S + R * .55, mt(x.S) - 36], [x.S + R * .55, mt(x.S) - 6], [x.S + R * .32, my(x.S) - mh * .25], [x.S - R * .32, my(x.S) + mh * .25], [x.S - R * .55, mb(x.S) + 8], [x.S - R * .75, mb(x.S) + 34]], 3);
    const q0 = x.I + .62 * s, q1 = x.III - .4 * s; l.q = [q0, q1]; const c0 = x.III + .25 * s, c1 = x.IV - .12 * s; l.c = [c0, c1];
    // nuvem de H⁺ no espaço intermembranas e na matriz
    const Rn = rng(11), n1 = NAR ? 34 : 72, top = l.bracketY + 16; l.ims = [];
    for (let i = 0; i < n1; i++) { const u = Rn(), xx = A.x0 + 12 + Rn() * (A.w - 24), yy = lerp(top, mt(xx) - 10, Math.pow(Rn(), .75)); l.ims.push({ x: xx, y: yy, thr: u, a: Rn() * 6.3, b: Rn() * 6.3 }); }
    l.mat = []; for (let i = 0; i < (NAR ? 5 : 10); i++) { const xx = A.x0 + 20 + Rn() * (A.w - 40), yy = mb(xx) + 30 + Rn() * (A.y1 - mb(xx) - 44); l.mat.push({ x: xx, y: yy, a: Rn() * 6.3, b: Rn() * 6.3 }); }
    // âncoras dos hotspots (px no palco)
    const hs = NAR ? 36 : 44; l.hs = hs;
    const cm = (q0 + q1) / 2, cc = (c0 + c1) / 2;
    l.ancora = {
      I: [x.I + .36 * s, my(x.I) - .15 * mh], II: [x.II, mb(x.II) + arm2 * .55], III: [x.III + .27 * s, my(x.III) - .1 * mh], IV: [x.IV + .22 * s, my(x.IV) - .1 * mh],
      S: [x.S + .3 * hr, sy - .1 * hr], Q: [cm, my(cm) + .02 * mh], c: [cc, mt(cc) - 22], O: [x.IV - .45 * s, mb(x.IV) + 30], G: [px(.37), (l.bracketY + mt(px(.37))) / 2 + 12]
    };
    L = l; if (ui) colocarHs();
    return l;
  }
  function cavidades(g, l) {
    const A = l.A, ym = l.ym0;
    // espaço intermembranas: azul-noite arroxeado, mais claro junto da membrana
    let q = g.createLinearGradient(0, 0, 0, ym); q.addColorStop(0, 'rgba(58,60,120,.10)'); q.addColorStop(1, 'rgba(108,92,170,.26)'); g.fillStyle = q; g.fillRect(0, 0, W, ym);
    q = g.createRadialGradient(W * .5, ym * .55, 10, W * .5, ym * .55, W * .55); q.addColorStop(0, 'rgba(180,190,255,.08)'); q.addColorStop(1, 'rgba(180,190,255,0)'); g.fillStyle = q; g.fillRect(0, 0, W, ym);
    // matriz: marrom-avermelhado, mais escura no fundo
    q = g.createLinearGradient(0, ym, 0, H); q.addColorStop(0, 'rgba(142,58,40,.42)'); q.addColorStop(.7, 'rgba(84,32,26,.26)'); q.addColorStop(1, 'rgba(70,26,22,.12)'); g.fillStyle = q; g.fillRect(0, ym, W, H - ym);
    q = g.createRadialGradient(W * .5, ym + (H - ym) * .5, 10, W * .5, ym + (H - ym) * .5, W * .5); q.addColorStop(0, 'rgba(255,150,110,.07)'); q.addColorStop(1, 'rgba(255,150,110,0)'); g.fillStyle = q; g.fillRect(0, ym, W, H - ym);
    desvanecer(g);
  }
  function desvanecer(g) { // bordas laterais esfumadas, para a cena se fundir ao palco
    g.globalCompositeOperation = 'destination-in'; const q = g.createLinearGradient(0, 0, W, 0); q.addColorStop(0, 'rgba(0,0,0,0)'); q.addColorStop(.05, 'rgba(0,0,0,1)'); q.addColorStop(.95, 'rgba(0,0,0,1)'); q.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = q; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over';
  }
  function membrana(g, l) {
    const { mh, my } = l, r = NAR ? 3.4 : 4.3, sp = r * 2.05, x0 = -6, x1 = W + 6, R = rng(7);
    const topo = xx => my(xx) - mh / 2, base = xx => my(xx) + mh / 2;
    // sombra projetada para a matriz e halo de luz sobre o topo
    g.beginPath(); for (let xx = x0; xx <= x1; xx += 8) { xx === x0 ? g.moveTo(xx, base(xx)) : g.lineTo(xx, base(xx)); } for (let xx = x1; xx >= x0; xx -= 8) g.lineTo(xx, base(xx) + 20); g.closePath();
    let q = g.createLinearGradient(0, l.ym0 + mh / 2, 0, l.ym0 + mh / 2 + 22); q.addColorStop(0, 'rgba(0,0,0,.34)'); q.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = q; g.fill();
    // faixa hidrofóbica
    g.beginPath(); for (let xx = x0; xx <= x1; xx += 8) { xx === x0 ? g.moveTo(xx, topo(xx)) : g.lineTo(xx, topo(xx)); } for (let xx = x1; xx >= x0; xx -= 8) g.lineTo(xx, base(xx)); g.closePath();
    q = g.createLinearGradient(0, l.ym0 - mh / 2 - 8, 0, l.ym0 + mh / 2 + 8); q.addColorStop(0, 'rgba(255,205,180,.16)'); q.addColorStop(.5, 'rgba(240,150,110,.10)'); q.addColorStop(1, 'rgba(120,40,30,.22)'); g.fillStyle = q; g.fill();
    // caudas (duas por fosfolipídio), depois as cabeças com brilho
    const hd = esfera(COR.cab);
    for (let side = 0; side < 2; side++) {
      for (let xx = x0 + r; xx < x1; xx += sp) {
        const j = (R() - .5) * 1.6, yy = side ? base(xx) - r + j * .5 : topo(xx) + r + j * .5, dir = side ? -1 : 1, len = mh / 2 - r * 2 - 2 + (R() - .5) * 3;
        for (const dx of [-r * .42, r * .42]) { g.beginPath(); g.moveTo(xx + dx, yy + dir * r * .8); g.bezierCurveTo(xx + dx + (R() - .5) * 3, yy + dir * len * .35, xx + dx + (R() - .5) * 3, yy + dir * len * .7, xx + dx * .8, yy + dir * len); g.lineWidth = 1; g.strokeStyle = 'rgba(255,196,160,.36)'; g.stroke(); }
      }
    }
    for (let side = 0; side < 2; side++) for (let xx = x0 + r; xx < x1; xx += sp) {
      const j = (R() - .5) * 1.6, yy = side ? base(xx) - r + j * .5 : topo(xx) + r + j * .5, rr2 = r * (.94 + R() * .14);
      g.save(); g.globalAlpha = side ? .86 : 1; g.drawImage(hd.c, xx - rr2 * 1.15, yy - rr2 * 1.15, rr2 * 2.3, rr2 * 2.3); g.restore();
    }
    // luz suave na borda superior
    g.beginPath(); for (let xx = x0; xx <= x1; xx += 8) { xx === x0 ? g.moveTo(xx, topo(xx) - 2) : g.lineTo(xx, topo(xx) - 2); }
    g.lineWidth = 7; g.strokeStyle = 'rgba(255,225,205,.07)'; g.stroke(); g.lineWidth = 1.4; g.strokeStyle = 'rgba(255,235,220,.2)'; g.stroke();
    desvanecer(g);
  }

  // ---------- hotspots (HTML) ----------
  function montarUi() {
    if (ui) return ui; const host = $('cadHs'), et = $('etapas'); if (!host) return null;
    ui = { host, et, btn: {}, tip: null, chips: [...et.querySelectorAll('button')], stepShown: -2 };
    const tip = document.createElement('div'); tip.className = 'cad-tip'; tip.id = 'cadTip'; tip.setAttribute('aria-hidden', 'true'); tip.hidden = true; tip.innerHTML = '<b></b><span></span>'; host.appendChild(tip); ui.tip = tip;
    DICA.forEach((d, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'cad-hs'; b.dataset.id = d.id; b.setAttribute('aria-label', `${d.n}: ${d.t}`); b.innerHTML = '<i></i>';
      b.style.transitionDelay = (i * 60) + 'ms';
      b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hov = d.id; usar(); mostrar(); } });
      b.addEventListener('pointerleave', () => { hov = null; mostrar(); });
      b.addEventListener('focus', () => { foc = d.id; usar(); mostrar(); }); b.addEventListener('blur', () => { foc = null; mostrar(); });
      b.addEventListener('click', e => { e.stopPropagation(); pin = pin === d.id ? null : d.id; usar(); mostrar(); });
      host.appendChild(b); ui.btn[d.id] = b;
    });
    host.addEventListener('keydown', e => { if (e.key === 'Escape') { pin = null; hov = null; foc = null; mostrar(); e.stopPropagation(); } });
    document.addEventListener('click', e => { if (pin && !e.target.closest('.cad-hs')) { pin = null; mostrar(); } });
    ui.chips.forEach(b => b.addEventListener('click', () => {
      if (!cur) return; const k = b.dataset.e; cur.man = k === 'auto' ? null : (cur.man === +k ? null : +k);
      if (cur.man != null) { cur.ph = cur.man * DUR + 1; }
      usar();
    }));
    cv.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse' || reduzir()) return; const r = cv.getBoundingClientRect(); pt.tx = ((e.clientX - r.left) / r.width - .5) * 2; pt.ty = ((e.clientY - r.top) / r.height - .5) * 2; });
    cv.addEventListener('pointerleave', () => { pt.tx = 0; pt.ty = 0; });
    return ui;
  }
  function usar() { lastUse = performance.now(); }
  function colocarHs() {
    if (!ui || !L) return; const hs = L.hs;
    for (const d of DICA) { const b = ui.btn[d.id], a = L.ancora[d.id]; b.style.width = b.style.height = hs + 'px'; b.style.left = (a[0] - hs / 2) + 'px'; b.style.top = (a[1] - hs / 2) + 'px'; }
    mostrar();
  }
  function mostrar() {
    if (!ui) return; const id = pin || hov || foc; act = id; const tip = ui.tip;
    for (const d of DICA) { ui.btn[d.id].classList.toggle('ativo', d.id === id); ui.btn[d.id].setAttribute('aria-pressed', d.id === pin); }
    if (!id) { tip.hidden = true; tip.classList.remove('on'); return; }
    const d = DICA.find(q => q.id === id), a = L.ancora[id]; tip.querySelector('b').textContent = d.n; tip.querySelector('span').textContent = d.t; tip.hidden = false;
    const w = Math.min(NAR ? 220 : 280, W - 16); tip.style.width = w + 'px';
    const h = tip.offsetHeight || 70, abaixo = a[1] < (NAR ? 190 : 170) + 20 || a[1] - h - 30 < 52;
    let x = cl(a[0] - w / 2, 8, W - w - 8), y = abaixo ? a[1] + 22 : a[1] - h - 22;
    y = cl(y, NAR ? 44 : 56, H - h - 96);
    tip.style.left = x + 'px'; tip.style.top = y + 'px'; tip.classList.toggle('abaixo', abaixo);
    tip.style.setProperty('--ax', (a[0] - x) + 'px'); tip.classList.add('on');
  }
  function atualizarUi(S, st, te) {
    const u = ui; if (!u) return;
    if (u.stepShown !== st + (S.man == null ? 10 : 0)) {
      u.stepShown = st + (S.man == null ? 10 : 0);
      u.chips.forEach(b => { const k = b.dataset.e, on = k === 'auto' ? S.man == null : S.man === +k; b.setAttribute('aria-pressed', on); b.classList.toggle('cur', k !== 'auto' && +k === st); });
    }
    if (te >= .6 && !u.shown) { u.shown = true; u.host.classList.add('on'); u.t0 = performance.now(); }
    // convite: pulso de novo depois de 8 s sem interação
    const now = performance.now();
    if (u.shown && !reduzir() && now - Math.max(lastUse, u.t0) > 8000 && now - idleT > 8000) { idleT = now; u.host.classList.remove('conv'); void u.host.offsetWidth; u.host.classList.add('conv'); }
  }

  // ---------- rótulos discretos ----------
  function nome(ax, ay, bx, by, s, a = 1) {
    if (!LB || a <= .02) return; X.save(); X.globalAlpha *= a;
    X.strokeStyle = 'rgba(232,237,247,.5)'; X.lineWidth = 1; X.beginPath(); X.moveTo(ax, ay); X.lineTo(bx, by); X.stroke();
    X.beginPath(); X.arc(ax, ay, 2.6, 0, TAU); X.fillStyle = 'rgba(11,15,28,.7)'; X.fill(); X.strokeStyle = '#E8EDF7'; X.stroke();
    tx(s, bx + (bx >= ax ? 5 : -5), by, { a: bx >= ax ? 'left' : 'right', w: 600, s: 13, c: C.txt }); X.restore();
  }

  // ---------- cena ----------
  function init(S) {
    S.g = S.v / 100; S.r2 = S.ph; S.man = null; S.te = S.ph > 0 || reduzir() ? 9 : 0; S.fE = S.fP = S.fS = 0;
    const st = Math.floor(S.ph / DUR) % 3; S[['fE', 'fP', 'fS'][st]] = 1; cur = S; pin = hov = foc = null; mostrar();
    if (ui) { ui.shown = false; ui.host.classList.remove('on', 'conv'); ui.stepShown = -2; if (S.te >= 9) { ui.host.classList.add('on'); ui.shown = true; ui.t0 = performance.now(); } }
  }
  function rota(key) {
    const on = key === 'resp/cadeia'; const u = montarUi(); if (!u) return;
    u.host.hidden = !on; u.et.hidden = !on; if (!on) { pin = hov = foc = null; act = null; if (u.tip) u.tip.hidden = true; u.shown = false; u.host.classList.remove('on'); }
  }
  function draw(t, S) {
    cur = S; const l = layout(); if (ui && !ui.placed) { ui.placed = true; colocarHs(); } const A = l.A, { mh, s, my, x, mt, mb } = l, rd = reduzir();
    const v = S.v / 100; S.g += (v - S.g) * Math.min(1, S.dt * 1.1); S.r2 += S.dt * S.g; S.te += S.dt; const g = S.g, te = S.te, on = cl(g * 4, 0, 1);
    pt.x += (pt.tx - pt.x) * .08; pt.y += (pt.ty - pt.y) * .08;
    // etapa atual e foco suave de cada etapa
    const st = S.man != null ? S.man : Math.floor(S.ph / DUR) % 3, k = S.dt > 0 ? 1 - Math.exp(-S.dt * 4.5) : 1;
    S.fE += ((st === 0 ? 1 : 0) - S.fE) * k; S.fP += ((st === 1 ? 1 : 0) - S.fP) * k; S.fS += ((st === 2 ? 1 : 0) - S.fS) * k;
    const fE = S.fE, fP = S.fP, fS = S.fS, aE = .4 + .6 * fE, aP = .4 + .6 * fP, aS = .4 + .6 * fS;
    const e0 = ss(te / .9), ph = S.r2, T = S.ph;
    const fx = rd ? 0 : pt.x * 3.5, fy = rd ? 0 : pt.y * 2.5;
    X.save();
    X.save(); X.translate(fx * .3, fy * .3); X.drawImage(l.bg.c, 0, 0, W, H); X.restore();
    if (act === 'G') { const q = X.createLinearGradient(0, 0, 0, l.ym0); q.addColorStop(0, 'rgba(255,179,71,.0)'); q.addColorStop(1, 'rgba(255,179,71,.14)'); X.fillStyle = q; X.fillRect(0, l.bracketY + 8, W, mt(W / 2) - l.bracketY - 8); }
    // carga do espaço intermembranas: o tom clareia com o gradiente
    { const q = X.createLinearGradient(0, l.bracketY, 0, l.ym0 - mh / 2); q.addColorStop(0, 'rgba(150,175,255,0)'); q.addColorStop(1, `rgba(150,175,255,${.13 * g})`); X.fillStyle = q; X.fillRect(0, l.bracketY, W, l.ym0 - l.bracketY - mh / 2); }
    X.translate(W / 2, l.ym0); const sc = 1.03 - .03 * e0; X.scale(sc, sc); X.translate(-W / 2 + fx, -l.ym0 + fy);
    X.drawImage(l.mem.c, 0, 0, W, H);
    // H⁺ acumulados no espaço intermembranas (muitos) e na matriz (poucos)
    const nI = l.ims.length; for (const p of l.ims) { const al = cl((g * 1.05 - p.thr * .95) * 7 + .15, 0, 1) * (act === 'G' ? 1 : .92); hp(p.x + Math.sin(T * 1.1 + p.a) * 3, p.y + Math.cos(T * .9 + p.b) * 3, NAR ? 5 : 6.2, al * (.55 + .45 * (.35 + .65 * aP * .5 + .0))); }
    for (const p of l.mat) hp(p.x + Math.sin(T * .8 + p.a) * 4, p.y + Math.cos(T * .7 + p.b) * 4, NAR ? 4.6 : 5.6, .5 * (1 - g * .6));
    // proteínas: halos (elétrons em ouro, bombeamento em azul, escolha do aluno em âmbar) e corpos
    const dimm = act ? .7 : 1, wob = 1 + (rd ? 0 : .008 * Math.sin(T * 2.6)) * on;
    const exc = id => { let e = 0; const f0 = l.fc[id]; for (let i = 0; i < 6; i++) { const f = fr(ph * .16 + i / 6), d = (f - f0) / .06; e += Math.exp(-d * d); } return Math.min(1, e) * on; };
    const pump = { I: 1, III: 1, IV: 1 };
    const P = (id, sp, xx, yy) => {
      const eg = (id in l.fc ? exc(id) : 0) * (.25 + .75 * fE), pb = (id in pump ? .5 + .5 * Math.sin(ph * 4.2 + xx) : 0) * fP * on, sel = act === id ? 1 : 0;
      pôr(sp, xx, yy, Math.max(sel, eg * .42), wob, 'ouro'); pôr(sp, xx, yy, pb * .3, wob, 'azul');
      pôr(sp, xx, yy, act && !sel ? dimm : 1, wob, 'corpo');
    };
    P('I', l.sp.I, x.I, my(x.I)); P('II', l.sp.II, x.II, my(x.II)); P('III', l.sp.III, x.III, my(x.III)); P('IV', l.sp.IV, x.IV, my(x.IV));
    // ATP sintase: estator, pé, anel c que gira, haste e cabeça F1
    const rot = ph * 2.4, ys = my(x.S), hy = mb(x.S) + l.stalk + l.hr, selS = act === 'S' ? 1 : 0;
    pôr(l.sp.F1, x.S, ys, Math.max(selS, fS * .55 * on), 1, 'ouro'); pôr(l.sp.Fo, x.S, ys, selS, 1, 'ouro');
    const dS = act && !selS ? dimm : 1;
    pôr(l.sp.F1, x.S, ys, dS, 1, 'corpo');
    X.save(); X.globalAlpha *= dS;
    // haste gama (gira com o rotor)
    const gx0 = x.S - 3.5, gy0 = ys + mh * .4, gh = hy - gy0 - l.hr * .2; const gg = X.createLinearGradient(gx0, 0, gx0 + 7, 0); gg.addColorStop(0, '#FFE6B8'); gg.addColorStop(.5, '#D9A964'); gg.addColorStop(1, '#8E6633');
    rrp(gx0, gy0, 7, gh, 3, gg);
    for (let i = 0; i < 3; i++) { const yy = gy0 + (i + .5) / 3 * gh; X.strokeStyle = 'rgba(255,255,255,.35)'; X.lineWidth = 1.2; X.beginPath(); X.moveTo(gx0 + 3.5 + Math.sin(rot + i * 1.6) * 2.4, yy - 2); X.lineTo(gx0 + 3.5 - Math.sin(rot + i * 1.6) * 2.4, yy + 2); X.stroke(); }
    pôr(l.sp.Fo, x.S, ys, 1, 1, 'corpo');
    anel(x.S, ys, l.R, mh * .9, rot);
    // marca que gira dentro da cabeça F1
    X.beginPath(); X.ellipse(x.S + Math.cos(rot) * l.hr * .34, hy - l.hr * .1, 3.6, 5.5, 0, 0, TAU); X.fillStyle = Math.sin(rot) > 0 ? 'rgba(255,240,205,.8)' : 'rgba(120,80,30,.45)'; X.fill();
    X.restore();
    // numerais dos complexos
    const num = (s2, xx, yy) => tx(s2, xx, yy + .5, { s: NAR ? 12 : 15, w: 700, c: 'rgba(40,12,8,.78)', bg: false });
    num('I', x.I - .12 * s, my(x.I)); num('II', x.II - .1 * s, my(x.II)); num('III', x.III, my(x.III) + .02 * mh); num('IV', x.IV - .12 * s, my(x.IV));
    // trilha dos elétrons (guia suave) e fluxo
    if (fE > .02 || on < 1) { X.save(); X.lineCap = 'round'; X.lineJoin = 'round'; for (const path of [l.E, l.E2]) { X.beginPath(); path.forEach((q, i) => i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1])); X.strokeStyle = `rgba(255,224,130,${.05 + .12 * fE})`; X.lineWidth = 6; X.stroke(); X.strokeStyle = `rgba(255,236,170,${.18 + .3 * fE})`; X.lineWidth = 1.2; X.setLineDash([2, 6]); X.stroke(); X.setLineDash([]); } X.restore(); }
    // carregadores móveis
    const qf = .5 - .5 * Math.cos(ph * 1.5), cf = .5 - .5 * Math.cos(ph * 1.5 + 1.6);
    const qx = lerp(l.q[0], l.q[1], qf), cx2 = lerp(l.c[0], l.c[1], cf), qy = my(qx), cy2 = mt(cx2) - 22;
    const ringHl = (xx, yy, id) => { if (act === id) { X.save(); X.strokeStyle = '#FFB347'; X.lineWidth = 2; X.beginPath(); X.arc(xx, yy, 14, 0, TAU); X.stroke(); X.globalAlpha = .25; X.fillStyle = '#FFB347'; X.fill(); X.restore(); } };
    ringHl(qx, qy, 'Q'); ringHl(cx2, cy2, 'c');
    bola(qx, qy, 8.5, '#C9A8F0', act && act !== 'Q' ? dimm : 1); bola(cx2, cy2, 8.5, '#F2A5BE', act && act !== 'c' ? dimm : 1);
    // elétrons
    if (on > 0) {
      for (let i = 0; i < 6; i++) { const f = fr(ph * .16 + i / 6), env = on * Math.min(1, Math.sin(f * PI) * 4) * aE; for (let tr = 4; tr >= 0; tr--) { const q = pth(l.E, f - tr * .006); el(q[0], q[1], 3.8 * (1 - tr * .12), env * (tr ? .16 : 1) * (1 - tr * .15)); } }
      for (let i = 0; i < 3; i++) { const f = fr(ph * .2 + i / 3), q = pth(l.E2, f); el(q[0], q[1], 3.4, on * Math.min(1, Math.sin(f * PI) * 4) * aE); }
    } else { // sem O₂: elétrons parados na fila
      for (let i = 0; i < 6; i++) { const q = pth(l.E, .08 + i * .15); el(q[0], q[1], 3.4, .45 * (1 - g * 4)); }
    }
    // bombeamento: H⁺ sobem pelos complexos I, III e IV
    const bombas = [[x.I + .3 * s, 3], [x.III - .27 * s, 1], [x.III + .27 * s, 1], [x.IV + .1 * s, 2]];
    if (on > 0) bombas.forEach(([bx, n], bi) => { for (let j = 0; j < n; j++) { const f = fr(ph * .5 + j / n + bi * .21), yy = lerp(mb(bx) + 20, mt(bx) - 26, f), al = on * Math.min(1, Math.sin(f * PI) * 2.6) * aP; hp(bx + Math.sin(f * 7 + bi) * 3.5 + f * 6, yy, NAR ? 5 : 6.2, al); } });
    if (fP > .05 && on > 0) for (const bx of [x.I + .3 * s, x.III - .27 * s, x.III + .27 * s, x.IV + .1 * s]) { X.save(); X.globalAlpha = .55 * fP * on; arrowUp(bx - 9, mb(bx) + 4, mt(bx) - 10); X.restore(); }
    // NADH, FADH₂, O₂, água
    const rotulo = (s2, xx, yy, a, al = 'center') => tx(s2, xx, yy, { s: 13, w: 600, c: C.txt, a: al });
    const sI = x.I - .2 * s; bola(sI - 11, mb(x.I) + l.armH + 28, 6.5, '#7FB2FF', .5 + .5 * on); bola(sI + 3, mb(x.I) + l.armH + 30, 5.2, '#A9CAFF', .5 + .5 * on); rotulo('NADH', sI + (NAR ? 20 : 34), mb(x.I) + l.armH + 32, 1, 'left');
    bola(x.II - 8, mb(x.II) + l.arm2 + 26, 6, '#7FB2FF', .5 + .5 * on); rotulo(NAR ? 'FADH₂' : 'FADH₂', x.II + 4, mb(x.II) + l.arm2 + 28, 1, 'left');
    const sitio = [x.IV - .02 * s, mb(x.IV) + 17];
    const pO = fr(ph * .2), nO = Math.round(g * (NAR ? 3 : 4));
    for (let i = 1; i <= nO; i++) { const bx = x.IV - (NAR ? .34 : .72) * s - (i % 2) * 20 - i * 5, by = mb(x.IV) + 46 + i * 12 + Math.sin(T * .8 + i * 2) * 3; if (i === 1 && pO < .3) continue; o2(bx, by, .5 + Math.sin(T + i) * .2, .9); }
    if (g > .04) {
      if (pO < .3) { const f = ss(pO / .3); o2(lerp(x.IV - (NAR ? .5 : .8) * s, sitio[0], f), lerp(mb(x.IV) + 56, sitio[1], f), 0, 1); }
      else if (pO < .5) { const f = (pO - .3) / .2; o2(sitio[0], sitio[1], 0, 1 - ss(cl((f - .6) * 2.5, 0, 1))); agua(sitio[0], sitio[1], ss(cl((f - .6) * 2.5, 0, 1)), 0); if (f > .15) { el(sitio[0] - 5, sitio[1] - 6, 3.2, Math.sin(cl((f - .15) / .85, 0, 1) * PI) * .9); } }
      else { const f = ss((pO - .5) / .5); agua(lerp(sitio[0], x.IV + .1 * s, f), lerp(sitio[1], mb(x.IV) + 92, f), 1 - cl((f - .7) / .3, 0, 1), f); }
    } else o2(sitio[0] + 4, sitio[1] + 14, 0, .8);
    rotulo('O₂', x.IV - (NAR ? .34 : .72) * s - (NAR ? 40 : 34), mb(x.IV) + 46 + 2 * 12, 1, 'right'); if (g > .04 && pO >= .8) rotulo('H₂O', x.IV + .1 * s + 14, mb(x.IV) + 92, 1, 'left');
    if (act === 'O') { X.save(); X.strokeStyle = '#FFB347'; X.lineWidth = 2; X.beginPath(); X.arc(x.IV - .7 * s, mb(x.IV) + 60, 26, 0, TAU); X.stroke(); X.restore(); }
    // retorno dos H⁺ pela ATP sintase e produção de ATP
    if (g > .03) {
      for (let j = 0; j < 4; j++) { const f = fr(ph * .55 + j / 4), q = pth(l.HP, f); hp(q[0], q[1], NAR ? 5 : 6.2, Math.min(1, Math.sin(f * PI) * 3) * aS * Math.min(1, g * 3)); }
    }
    const passos = rot / (TAU / 3);
    if (g > .03) for (let n = Math.floor(passos) - 3; n <= Math.floor(passos); n++) {
      const f = (passos - n) / 3; if (f < 0 || f > 1) continue; const a0 = [x.S - l.hr * .75, hy + l.hr * .55], a1 = [x.S - l.R - .35 * s, hy + l.hr + 22], a2 = [x.S - .8 * s, A.y1 - 4 + (NAR ? 4 : 10)];
      const q = f < .35 ? [lerp(a0[0], a1[0], ss(f / .35)), lerp(a0[1], a1[1], ss(f / .35))] : [lerp(a1[0], a2[0], (f - .35) / .65), lerp(a1[1], a2[1], (f - .35) / .65)], al = Math.min(1, f * 6) * (1 - cl((f - .75) / .25, 0, 1)) * (.45 + .55 * aS);
      bola(q[0], q[1], 7, '#FFB347', al); tx('ATP', q[0] + 12, q[1], { s: 13, w: 700, c: C.txt, a: 'left', bg: true }); X.globalAlpha = 1;
    }
    const entra = .55 + .45 * (1 - fr(passos)), aa = g > .03 ? 1 : .8;
    bola(x.S - l.hr - (NAR ? 14 : 24), hy - l.hr * .2, 5.2, '#B7C3DD', entra * aa); bola(x.S - l.hr - (NAR ? 8 : 15), hy + l.hr * .3, 4.4, '#FF9A3C', entra * aa);
    rotulo(NAR ? 'ADP' : 'ADP + Pᵢ', x.S - l.hr - (NAR ? 20 : 32), hy - l.hr * .2 + (NAR ? -16 : 0), 1, 'right');
    // destaques de hotspot sobre elementos livres (O₂, gradiente) já feitos acima; rótulos nomeados
    const ea = e0;
    X.save(); X.strokeStyle = 'rgba(232,237,247,.38)'; X.lineWidth = 1; const bx0 = x.I - .5 * s, bx1 = x.IV + .45 * s, by = l.bracketY;
    X.globalAlpha = ea; X.beginPath(); X.moveTo(bx0, by + 5); X.lineTo(bx0, by); X.lineTo(bx1, by); X.lineTo(bx1, by + 5); X.stroke(); X.restore();
    if (LB) { X.save(); X.globalAlpha = ea; tx(NAR ? 'cadeia transportadora' : 'cadeia transportadora de elétrons', (bx0 + bx1) / 2, by - 12, { w: 600, s: 13, c: C.txt }); X.restore(); }
    tx('espaço intermembranas', A.x0 + 12, A.y0 + 14, { a: 'left', w: 600, c: '#CFC9E8', s: 13 }); tx('matriz', A.x0 + 12, A.y1 - 14, { a: 'left', w: 600, c: '#E3C9C0', s: 13 });
    nome(x.S + .2 * l.hr, hy - l.hr * .9, x.S - (NAR ? 12 : 26), A.y0 + (NAR ? 84 : 76), 'ATP sintase', ea);
    if (!NAR) { nome(qx, qy + 4, qx + 12, mb(qx) + l.arm2 + 66, 'ubiquinona', ea); nome(cx2, cy2 - 6, cx2 + 14, A.y0 + 78, 'citocromo c', ea); }
    X.restore();
    // máscara de revelação da entrada
    if (te < .9 && !rd) { const r = Math.max(1, e0 * Math.hypot(W, H) * .55), q = X.createRadialGradient(W / 2, l.ym0, r * .55, W / 2, l.ym0, r * 1.1); q.addColorStop(0, `rgba(0,0,0,${e0})`); q.addColorStop(1, 'rgba(0,0,0,0)'); X.save(); X.globalCompositeOperation = 'destination-in'; X.fillStyle = q; X.fillRect(0, 0, W, H); X.restore(); }
    else if (te < .9) { X.save(); X.globalCompositeOperation = 'destination-in'; X.fillStyle = `rgba(0,0,0,${e0})`; X.fillRect(0, 0, W, H); X.restore(); }
    // hotspots seguem o paralaxe do primeiro plano
    if (ui) { ui.host.style.transform = `translate3d(${fx}px,${fy}px,0)`; atualizarUi(S, st, te); }
    cap(v === 0 ? 'Sem O₂ para receber os elétrons, a cadeia para: o bombeamento de H⁺ e a produção de ATP cessam' : ['1. Os elétrons do NADH e do FADH₂ passam de proteína em proteína até o O₂, que forma água', '2. A energia liberada bombeia H⁺ da matriz para o espaço intermembranas', '3. Os H⁺ voltam pela ATP sintase, que gira e forma ATP: é a quimiosmose'][st]);
  }

  // ---------- peças dinâmicas ----------
  function rrp(x, y, w, h, r, f) { X.beginPath(); X.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2)); X.fillStyle = f; X.fill(); }
  function arrowUp(x, y0, y1) { X.strokeStyle = 'rgba(190,215,255,.8)'; X.lineWidth = 1.4; X.beginPath(); X.moveTo(x, y0); X.lineTo(x, y1 + 3); X.stroke(); X.beginPath(); X.moveTo(x - 3.5, y1 + 7); X.lineTo(x, y1); X.lineTo(x + 3.5, y1 + 7); X.stroke(); }
  // anel c visto de lado: subunidades que deslizam e mudam de largura conforme o ângulo
  function anel(cx, cy, R, h, rot) {
    const n = 10, it = []; for (let i = 0; i < n; i++) { const a = rot + i / n * TAU; it.push({ x: Math.cos(a) * R, z: Math.sin(a) }); }
    it.sort((a, b) => a.z - b.z);
    for (const q of it) {
      const w = (TAU * R / n) * (.5 + .62 * Math.abs(q.z)), xx = cx + q.x, front = q.z > 0, kk = front ? .15 + .3 * q.z : -.05 - .2 * (-q.z);
      const gr = X.createLinearGradient(xx - w / 2, 0, xx + w / 2, 0); gr.addColorStop(0, dark(COR.Fo, .35 - kk * .3)); gr.addColorStop(.35, front ? light(COR.Fo, .35 * q.z + .1) : COR.Fo); gr.addColorStop(1, dark(COR.Fo, .45 - kk * .3));
      X.save(); X.globalAlpha *= front ? 1 : .78; X.beginPath(); X.roundRect(xx - w / 2, cy - h / 2, w, h, w / 2.4); X.fillStyle = gr; X.fill(); X.lineWidth = 1; X.strokeStyle = 'rgba(60,24,10,.45)'; X.stroke(); X.restore();
    }
  }
  function o2(x, y, a, al) { if (al <= .02) return; const r = NAR ? 5.4 : 6.6; X.save(); X.translate(x, y); X.rotate(a); bola(-r * .85, 0, r, '#FF5A5A', al); bola(r * .85, 0, r, '#FF5A5A', al); X.restore(); }
  function agua(x, y, al, f) { if (al <= .02) return; const r = NAR ? 5.4 : 6.6, ang = 52 * PI / 180; bola(x, y, r, '#FF5A5A', al); bola(x - Math.sin(ang) * r * 1.35, y - Math.cos(ang) * r * 1.35 + 2, r * .62, '#F4F7FF', al); bola(x + Math.sin(ang) * r * 1.35, y - Math.cos(ang) * r * 1.35 + 2, r * .62, '#F4F7FF', al); }

  return { init, draw, rota, DICA };
})();
