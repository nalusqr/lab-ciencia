/* LAB Ecologia: figura de IA por padrão em 9 rotas que tinham desenho 2D ou 3D de primitivas fraco (Íris e Dry).
   Mesmo padrão de cenas-figura.js (figura-ia v2: figura como visão padrão, pontos tocáveis, botão para a cena antiga).
   Diferenças: aqui a cena antiga roda escondida por baixo (cfg.oculto) para manter o estado (faixas, simulação, legenda),
   e uma animação leve é desenhada por cima da figura, ligada à faixa da própria cena quando ela existe.
   Quem pede movimento reduzido vê um quadro parado. Carregar depois de cenas-figura.js. Sem LAB_ECO fica o desenho antigo. */
'use strict';
(function () {
  const E = window.LAB_ECO;
  if (!E || !window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const RED = window.LAB_FIGALT.RED;
  const TAU = Math.PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, u) => a + (b - a) * u;
  const hash = (i, k) => { const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s); };
  const ease = u => { u = cl(u, 0, 1); return u * u * (3 - 2 * u); };
  const T0 = 3.7;                                   // quadro parado quando o aluno pede menos movimento
  const tempo = t => RED ? T0 : t;

  // a cena antiga de cada rota (2D: o draw original; 3D: o plano), guardada antes de o alternador trocar o draw
  const ANTIGA = new WeakMap();
  const amb = {
    SC: E.SC, X: () => E.X, W: () => E.W, H: () => E.H, nar: () => E.W < 700, tela: document.querySelector('.palco .tela'),
    cap: () => {}, t: a => a[0], baixo: nar => nar ? 100 : 20,
    plano: (o3, args) => { const f = ANTIGA.get(o3); if (f) f.call(o3, args[0], args[1]); },
    rot3d: 'Ver esquema', dica3d: '',
    esconder: ['.hud.onde'], esconderFig: ['#ctl', '#opts']
  };
  const amb3d = Object.assign({}, amb, { rot3d: 'Ver em 3D', dica3d: undefined });

  // ---------- ferramentas de desenho (coordenadas em % da figura) ----------
  const px = R => [R.s, R.s * R.h / R.w];            // pixels por 1% em x e em y
  const P = (R, x, y) => R.pt(x, y);
  const brilho = (X, x, y, r, cor, a) => {
    const g = X.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, cor); g.addColorStop(.35, cor); g.addColorStop(1, 'rgba(0,0,0,0)');
    X.save(); X.globalAlpha *= a == null ? 1 : a; X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); X.restore();
  };
  const miolo = (X, x, y, r, cor) => { X.fillStyle = cor; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); };
  const elipse = (X, R, cx, cy, rx, ry, cor, a, tracejado, t) => {
    const [ux, uy] = px(R), p = P(R, cx, cy);
    X.save(); X.globalAlpha *= a; X.beginPath(); X.ellipse(p[0], p[1], rx * ux, ry * uy, 0, 0, TAU);
    X.lineWidth = 2.5; X.strokeStyle = cor; X.setLineDash(tracejado ? [8, 7] : []); X.lineDashOffset = -(t || 0) * 14;
    X.fillStyle = cor; X.globalAlpha *= .12; X.fill(); X.globalAlpha = a; X.stroke(); X.restore();
  };
  const pastilha = (X, x, y, txt, cor, o = {}) => {
    X.save(); X.font = `600 ${o.s || 14}px ${E.FT}`;
    const w = X.measureText(txt).width + 30, h = 28, x0 = o.dir === 'l' ? x - w : o.dir === 'c' ? x - w / 2 : x, y0 = y - h / 2;
    X.globalAlpha *= o.a == null ? 1 : o.a;
    X.beginPath(); X.roundRect ? X.roundRect(x0, y0, w, h, 14) : X.rect(x0, y0, w, h); X.fillStyle = 'rgba(11,15,28,.86)'; X.fill();
    X.strokeStyle = 'rgba(255,255,255,.14)'; X.lineWidth = 1; X.stroke();
    X.fillStyle = cor; X.beginPath(); X.arc(x0 + 14, y, 4.5, 0, TAU); X.fill();
    X.fillStyle = '#E8EDF7'; X.textBaseline = 'middle'; X.textAlign = 'left'; X.fillText(txt, x0 + 25, y + .5); X.restore();
  };
  const sinal = (X, x, y, mais, a) => {
    X.save(); X.globalAlpha *= a == null ? 1 : a;
    miolo(X, x, y, 15, 'rgba(11,15,28,.88)'); X.lineWidth = 2; X.strokeStyle = mais ? '#7BE0A0' : '#FF7A7A'; X.beginPath(); X.arc(x, y, 15, 0, TAU); X.stroke();
    X.lineCap = 'round'; X.lineWidth = 3; X.beginPath(); X.moveTo(x - 6, y); X.lineTo(x + 6, y); if (mais) { X.moveTo(x, y - 6); X.lineTo(x, y + 6); } X.stroke(); X.restore();
  };
  const onda = (X, x0, y0, x1, y1, amp, fase, cor, larg) => {   // raio ondulado (ultravioleta)
    const n = 18, dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    X.beginPath();
    for (let k = 0; k <= n; k++) { const u = k / n, w = Math.sin(u * 16 + fase) * amp; const x = x0 + dx * u + nx * w, y = y0 + dy * u + ny * w; k ? X.lineTo(x, y) : X.moveTo(x, y); }
    X.strokeStyle = cor; X.lineWidth = larg; X.lineCap = 'round'; X.lineJoin = 'round'; X.stroke();
  };

  // ---------- 1. niveis/escada: Pantanal, os níveis de organização acendem na ordem da faixa ----------
  const NIV = ['Organismo', 'População', 'Comunidade', 'Ecossistema', 'Bioma', 'Biosfera'];
  const NIVC = ['#FFB347', '#F7C13B', '#A9C54A', '#8FD8FF', '#F28B8B', '#CFE0FF'];
  const NIVFORMAS = [
    [[79, 71, 13, 22]],
    [[57, 54, 10, 11], [79, 71, 13, 22]],
    [[15, 54, 11, 12], [29, 58, 4.5, 12], [40, 46, 3.5, 13], [57, 54, 10, 11], [79, 71, 13, 22], [24, 91, 12, 6], [5, 69, 7, 12], [74, 48, 5, 6]],
    [[50, 35, 7, 12], [38, 77, 26, 17], [78, 92, 20, 7]],
    [], []
  ];
  let escV = -1, escT = 0;
  function sobreEscada(R, X, t, c) {
    const S = c.S || {}, v = cl(S.v | 0, 0, 5), tt = tempo(t);
    if (v !== escV) { escV = v; escT = tt; }
    const a = RED ? 1 : ease((tt - escT) / .6), pul = RED ? 1 : .75 + .25 * Math.sin(tt * 3);
    NIVFORMAS[v].forEach(f => elipse(X, R, f[0], f[1], f[2], f[3], NIVC[v], a * pul, v === 2, tt));
    if (v >= 4) {
      X.save(); X.globalAlpha = a; X.lineWidth = 3; X.strokeStyle = NIVC[v]; X.setLineDash([12, 9]); X.lineDashOffset = -tt * 16;
      X.strokeRect(R.x + 8, R.y + 8, R.w - 16, R.h - 16); X.restore();
    }
    pastilha(X, R.x + 14, R.y + 26, NIV[v], NIVC[v], { s: c.nar ? 13 : 15 });
  }

  // ---------- 2. energia/produtividade: luz, PPB, respiração e PPL ----------
  function sobreProd(R, X, t) {
    const tt = tempo(t), [ux, uy] = px(R);
    const alvos = [[22, 29], [30, 18], [40, 13], [49, 25], [35, 38], [45, 34], [26, 37]];
    alvos.forEach((a, i) => {                                   // fótons do Sol até as folhas
      const u = (tt * .3 + i / alvos.length) % 1, x = lerp(3, a[0], u), y = lerp(6, a[1], u), p = P(R, x, y);
      brilho(X, p[0], p[1], 11, 'rgba(255,212,59,.9)', Math.sin(u * Math.PI));
    });
    for (let i = 0; i < 8; i++) {                               // calor da respiração sobe da copa
      const u = (tt * .22 + i / 8) % 1, x0 = 26 + hash(i, 3) * 28, x = x0 + Math.sin(tt * 1.6 + i * 2) * 1.2, y = lerp(15, 1.5, u), p = P(R, x, y);
      brilho(X, p[0], p[1], 9, 'rgba(255,107,107,.85)', Math.sin(u * Math.PI) * .85);
    }
    for (let i = 0; i < 6; i++) {                               // açúcar que sobra (PPL) segue da copa para o herbívoro, cada vez menor
      const u = (tt * .17 + i / 6) % 1, x = lerp(46, 76, u), y = lerp(44, 66, u) - Math.sin(u * Math.PI) * 14, p = P(R, x, y), r = lerp(7, 3.5, u) * Math.min(1.3, R.w / 700 + .45);
      brilho(X, p[0], p[1], r * 2.2, 'rgba(169,197,74,.9)', Math.sin(u * Math.PI) * .95 + .05);
    }
  }

  // ---------- 3. impactos/ozonio: UV, camada e buraco que cresce com os CFCs ----------
  const arcoY = x => 44.5 + 20.8 * Math.pow((x - 50) / 50, 2);   // faixa de ozônio na figura
  function sobreOzonio(R, X, t, c) {
    const S = c.S || {}, v = cl((S.v == null ? 6 : S.v) / 10, 0, 1), tt = tempo(t), [ux, uy] = px(R), meio = v * 30;
    if (v > 0) {                                                // o buraco apaga um trecho da faixa
      X.save(); X.beginPath();
      const pts = []; for (let x = 50 - meio; x <= 50 + meio + .01; x += 1.5) pts.push(x);
      pts.forEach((x, i) => { const p = P(R, x, arcoY(x) - 2.8); i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1]); });
      pts.slice().reverse().forEach(x => { const p = P(R, x, arcoY(x) + 2.8); X.lineTo(p[0], p[1]); });
      X.closePath(); const a0 = P(R, 50 - meio, 0)[0], a1 = P(R, 50 + meio, 0)[0], gg = X.createLinearGradient(a0, 0, a1, 0);
      gg.addColorStop(0, 'rgba(15,22,38,0)'); gg.addColorStop(.18, 'rgba(15,22,38,.92)'); gg.addColorStop(.82, 'rgba(15,22,38,.92)'); gg.addColorStop(1, 'rgba(15,22,38,0)'); X.fillStyle = gg; X.fill(); X.restore();
    }
    const N = c.nar ? 6 : 9;
    for (let i = 0; i < N; i++) {                               // raios UV vindos do Sol, em cima à direita
      const xs = 14 + i / (N - 1) * 74, passa = Math.abs(xs - 50) < meio, yb = arcoY(xs), yfim = passa ? Math.min(90, yb + 24) : yb;
      const u = (tt * .22 + i * .19) % 1, y = lerp(-2, yfim, u), x = xs + (y + 2) * .12;
      const a = u > .85 && !passa ? 1 - (u - .85) / .15 : 1, p0 = P(R, x, y), p1 = P(R, x + 1.1, y - 7);
      X.save(); X.globalAlpha = a * .95; onda(X, p1[0], p1[1], p0[0], p0[1], 3.2, tt * 7 + i, '#B58CFF', 2.6); brilho(X, p0[0], p0[1], 9, 'rgba(201,165,255,.9)', a); X.restore();
      if (!passa && u > .88) { const q = P(R, x, yb); brilho(X, q[0], q[1], 14, 'rgba(255,255,255,.7)', (1 - u) * 6 * .5); }
    }
    if (v > 0) {                                                // CFCs sobem; o cloro solto destrói o ozônio no buraco
      const m = Math.round(v * 8);
      for (let i = 0; i < m; i++) {
        const u = (tt * .09 + i / m) % 1, x = 50 + Math.sin(i * 2.3) * meio * .9, y = lerp(70, arcoY(x) + 1, u), p = P(R, x + Math.sin(tt + i) * .8, y);
        brilho(X, p[0], p[1], 8, 'rgba(110,235,150,.95)', .35 + .6 * Math.sin(u * Math.PI));
      }
      const q = P(R, 50, arcoY(50) + 9); pastilha(X, q[0], q[1], 'Cl + O₃ → ClO + O₂', '#6EEB96', { dir: 'c', s: c.nar ? 12 : 14 });
    }
  }

  // ---------- 4. impactos/estufa: luz entra, calor tenta sair e a camada devolve uma parte ----------
  const hazeY = x => 22 + Math.pow(x - 50, 2) * .004;
  const GCH = [[20, 66], [32, 70], [44, 62], [56, 74], [66, 66], [78, 72], [88, 68], [26, 78], [72, 80], [50, 84]];
  function sobreEstufa(R, X, t, c) {
    const S = c.S || {}, ppm = S.v || 420, f = cl(.3 + .5 * (ppm - 280) / 280, 0, 1), tt = tempo(t), [ux, uy] = px(R);
    X.save();                                                   // camada de gases mais densa com mais CO₂
    X.beginPath(); for (let x = 0; x <= 100; x += 4) { const p = P(R, x, hazeY(x) + 1); x ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1]); }
    X.strokeStyle = `rgba(255,170,90,${.07 + .3 * f})`; X.lineWidth = 5.5 * uy; X.lineCap = 'round'; X.stroke(); X.restore();
    GCH.forEach((g, i) => {                                     // luz do Sol atravessa e aquece o chão
      const u = (tt * .2 + i / GCH.length) % 1, p = P(R, lerp(21.3, g[0], u), lerp(25.4, g[1], u));
      brilho(X, p[0], p[1], 11, 'rgba(255,214,90,.95)', Math.sin(u * Math.PI) * .9 + .1);
    });
    const n = 14;
    for (let i = 0; i < n; i++) {                               // calor (infravermelho) sobe; uma fração volta
      const g = GCH[i % GCH.length], x = g[0] + (i > 9 ? 4 : 0), volta = hash(i, 9) < f, u = (tt * .16 + i / n) % 1;
      const yh = hazeY(x) + 2; let y, xx = x, a;
      if (volta) { if (u < .5) { y = lerp(g[1] - 6, yh, u / .5); a = 1; } else { y = lerp(yh, g[1] - 2, (u - .5) / .5); xx = x + (u - .5) * 10; a = 1; } }
      else { y = lerp(g[1] - 6, 3, u); a = u > .75 ? 1 - (u - .75) / .25 : 1; }
      const p = P(R, xx + Math.sin(tt * 2 + i) * .6, y);
      brilho(X, p[0], p[1], 10, volta && u > .5 ? 'rgba(255,90,70,.95)' : 'rgba(255,120,110,.9)', a * .85);
    }
    // termômetro
    const d = ppm <= 280 ? 0 : 3 * Math.log2(ppm / 280), x0 = R.x + R.w - 100, h = Math.min(120, R.h * .3), y1 = R.y + R.h - 26, y0 = y1 - h;
    X.save(); X.fillStyle = 'rgba(11,15,28,.82)'; X.beginPath(); X.roundRect ? X.roundRect(x0 - 12, y0 - 26, 48, h + 56, 12) : X.rect(x0 - 12, y0 - 26, 48, h + 56); X.fill();
    X.fillStyle = 'rgba(255,255,255,.14)'; X.fillRect(x0 + 6, y0, 8, h);
    const k = cl(d / 3.2, .03, 1); X.fillStyle = '#FF6B6B'; X.fillRect(x0 + 6, y1 - h * k, 8, h * k); miolo(X, x0 + 10, y1 + 4, 8, '#FF6B6B');
    X.fillStyle = '#FF9B9B'; X.font = `600 12px ${E.FD}`; X.textAlign = 'center'; X.fillText('+' + d.toFixed(1).replace('.', ',') + ' °C', x0 + 12, y0 - 10); X.restore();
  }

  // ---------- 5. populacoes/predador: as duas curvas do modelo por cima da várzea ----------
  let rPred = null;
  function graficoPredador(X, S, x0, y0, w, hh) {
    const h = S.h || [];
    X.save(); X.fillStyle = 'rgba(11,15,28,.8)'; X.beginPath(); X.roundRect ? X.roundRect(x0, y0, w, hh, 12) : X.rect(x0, y0, w, hh); X.fill();
    const gx0 = x0 + 12, gx1 = x0 + w - 12, gy0 = y0 + hh - 20, gy1 = y0 + 30;
    let ym = 120; h.forEach(q => { ym = Math.max(ym, q[0] * 1.1, q[1] * 1.1); });
    X.strokeStyle = '#5B6C99'; X.lineWidth = 1.5; X.beginPath(); X.moveTo(gx0, gy1); X.lineTo(gx0, gy0); X.lineTo(gx1, gy0); X.stroke();
    [[0, '#F7C13B'], [1, '#9A6BFF']].forEach(([j, cor]) => {
      X.beginPath(); h.forEach((q, i) => { const x = gx0 + i / 420 * (gx1 - gx0), y = gy0 - q[j] / ym * (gy0 - gy1); i ? X.lineTo(x, y) : X.moveTo(x, y); });
      X.strokeStyle = cor; X.lineWidth = 2.5; X.lineJoin = 'round'; X.stroke();
    });
    X.font = `600 12px ${E.FD}`; X.textBaseline = 'middle'; X.textAlign = 'left'; X.fillStyle = '#F7C13B'; X.fillText('presas: ' + Math.round(S.N || 0), gx0 + 4, y0 + 14);
    X.textAlign = 'right'; X.fillStyle = '#B79BFF'; X.fillText('predadores: ' + Math.round(S.P || 0), gx1, y0 + 14); X.restore();
  }
  function sobrePredador(R, X, t, c) {
    rPred = R;
    if (c.nar) return;                                          // no celular o gráfico fica embaixo da figura (ver foraPredador)
    const w = Math.min(R.w * .36, 300), hh = Math.min(R.h * .24, 116);
    graficoPredador(X, c.S || {}, R.x + 12, R.y + R.h - 12 - hh, w, hh);
  }
  function foraPredador(X, t, c) {
    if (!c.nar || !rPred) return;
    graficoPredador(X, c.S || {}, rPred.x, rPred.y + rPred.h + 10, rPred.w, 96);
  }

  // ---------- 6. teias/cadeia: energia que anda de nível em nível e encolhe a cada passo ----------
  const NOS = [[10, 36], [22.5, 43], [36, 71], [65, 66], [86, 31]];
  const NOSC = ['#3FBF6A', '#F7C13B', '#8FD8FF', '#FFA94D', '#F28B8B'];
  function sobreCadeia(R, X, t, c) {
    const S = c.S || {}, v = S.v == null ? 0 : S.v, tt = tempo(t);
    for (let i = 0; i < 4; i++) {                               // 10% passa: a bolinha encolhe ao longo do elo
      const a = NOS[i], b = NOS[i + 1], r0 = 9 * Math.pow(.5, i), r1 = r0 * .5;
      for (let k = 0; k < 2; k++) {
        const u = (tt * .22 + i * .17 + k * .5) % 1, x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u) - Math.sin(u * Math.PI) * 8, p = P(R, x, y);
        brilho(X, p[0], p[1], lerp(r0, r1, u) * 2.6 + 10, 'rgba(255,212,59,1)', Math.sin(u * Math.PI) * .95 + .05);
      }
    }
    NOS.forEach((n, i) => {                                     // calor da respiração sobe de cada ser
      for (let k = 0; k < 3; k++) {
        const u = (tt * .2 + k / 3 + i * .13) % 1, p = P(R, n[0] + Math.sin(tt * 1.5 + k * 2 + i) * 1.4, n[1] - 4 - u * 12);
        brilho(X, p[0], p[1], 8 - i * .8, 'rgba(255,107,107,.9)', Math.sin(u * Math.PI) * .8);
      }
    });
    const dec = P(R, 68, 85), forte = v === 5;                  // restos de todos os níveis descem para os decompositores
    NOS.forEach((n, i) => {
      const u = (tt * .12 + i * .21) % 1, p = P(R, lerp(n[0], 68, u), lerp(n[1] + 6, 82, u));
      brilho(X, p[0], p[1], 7, 'rgba(176,132,88,.9)', Math.sin(u * Math.PI) * (forte ? .9 : .4));
    });
    const [ux, uy] = px(R);
    if (v >= 0 && v <= 4) { const n = P(R, NOS[v][0], NOS[v][1]); X.save(); X.lineWidth = 3.5; X.strokeStyle = NOSC[v]; X.globalAlpha = RED ? 1 : .75 + .25 * Math.sin(tt * 3); X.beginPath(); X.arc(n[0], n[1], 5 * ux + 6 * (RED ? 0 : Math.sin(tt * 3) * .3), 0, TAU); X.stroke(); X.restore(); }
    else { X.save(); X.lineWidth = 3; X.strokeStyle = '#B08458'; X.globalAlpha = .7 + .3 * Math.sin(tt * 3); X.beginPath(); X.ellipse(dec[0], dec[1], 11 * ux, 9 * uy, 0, 0, TAU); X.stroke(); X.restore(); }
  }

  // ---------- 7. relacoes/desarmonicas: quem ganha e quem perde (+ e −) ----------
  function sobreDesarm(R, X, t, c) {
    const tt = tempo(t);
    for (let i = 0; i < 5; i++) {                               // energia da capivara para a onça
      const u = (tt * .2 + i / 5) % 1, p = P(R, lerp(52, 38, u), lerp(71, 64, u) - Math.sin(u * Math.PI) * 6);
      brilho(X, p[0], p[1], 9, 'rgba(255,179,71,.95)', Math.sin(u * Math.PI));
    }
    for (let i = 0; i < 5; i++) {                               // seiva do hospedeiro para a erva-de-passarinho
      const u = (tt * .16 + i / 5) % 1, p = P(R, lerp(80, 71, u), lerp(43, 32, u));
      brilho(X, p[0], p[1], 8, 'rgba(169,197,74,.95)', Math.sin(u * Math.PI));
    }
    const s = (RED ? 1 : 1 + .06 * Math.sin(tt * 3));
    [[36, 56, 1], [55, 60, 0], [68, 22, 1], [80, 47, 0]].forEach(q => { const p = P(R, q[0], q[1]); sinal(X, p[0], p[1], !!q[2]); });
  }

  // ---------- 8. impactos/chuva: gases sobem, viram ácido na nuvem e caem ----------
  function sobreChuva(R, X, t, c) {
    const S = c.S || {}, v = cl((S.v == null ? 6 : S.v) / 10, 0, 1), tt = tempo(t), n = 5 + Math.round(v * 14);
    for (let i = 0; i < n; i++) {                               // SO₂ e NOₓ das chaminés até a nuvem
      const u = (tt * .1 + i / n) % 1, o = hash(i, 4), x = lerp(12 + o * 6, 46 + o * 10, u), y = lerp(46, 20, u) - Math.sin(u * Math.PI) * 6 + Math.sin(tt * 1.2 + i) * 1.2, p = P(R, x, y);
      brilho(X, p[0], p[1], 8, i % 2 ? 'rgba(255,169,77,.95)' : 'rgba(247,193,59,.95)', Math.sin(u * Math.PI) * .9);
    }
    const nd = 8 + Math.round(v * 34), [ux, uy] = px(R);
    for (let i = 0; i < nd; i++) {                              // gotas ácidas
      const u = (tt * .55 + hash(i, 7)) % 1, x = 47 + hash(i, 8) * 36 + u * -4, y = lerp(30, 80, u), p = P(R, x, y);
      X.save(); X.globalAlpha = (1 - u * .3) * .8; X.strokeStyle = '#E6F08A'; X.lineWidth = 2; X.lineCap = 'round'; X.beginPath(); X.moveTo(p[0], p[1]); X.lineTo(p[0] - 2, p[1] + 10); X.stroke(); X.restore();
      if (u > .96 && x > 55 && x < 84) { const q = P(R, x, 81); X.save(); X.globalAlpha = .5; X.strokeStyle = '#E6F08A'; X.lineWidth = 1.5; X.beginPath(); X.ellipse(q[0], q[1], 7, 3, 0, 0, TAU); X.stroke(); X.restore(); }
    }
  }

  // ---------- 9. relacoes/polinizacao: pólen brilha nas flores e a cutia leva a semente ----------
  function sobrePolin(R, X, t, c) {
    const tt = tempo(t);
    [[13, 74], [29, 46], [55, 45]].forEach((f, k) => {
      for (let i = 0; i < 5; i++) {
        const u = (tt * .2 + i / 5 + k * .3) % 1, a = hash(i, k) * TAU, p = P(R, f[0] + Math.cos(a) * u * 4 + Math.sin(tt + i) * .5, f[1] - u * 7);
        brilho(X, p[0], p[1], 6, 'rgba(255,224,102,.95)', Math.sin(u * Math.PI) * .9);
      }
    });
    const u = (tt * .16) % 1, sx = lerp(79, 64.5, u), sy = lerp(76, 86.6, u) - Math.sin(u * Math.PI) * 14, p = P(R, sx, sy);
    miolo(X, p[0], p[1], 6, '#8B5A2B'); X.strokeStyle = 'rgba(255,230,160,.9)'; X.lineWidth = 1.5; X.beginPath(); X.arc(p[0], p[1], 6, 0, TAU); X.stroke();
    if (u > .8) { const q = P(R, 64.5, 85); brilho(X, q[0], q[1], 22, 'rgba(120,255,140,.8)', (u - .8) / .2 * .8); }
  }

  // ---------- as nove cenas ----------
  const cenas = [
    ['niveis/escada', { pref: 'ecologia', nome: 'Pantanal', mask: false, ctl: true, oculto: true, sobre: sobreEscada,
      vistas: [['a', 'niveis-escada-a', 'Pantanal', 'Várzea do Pantanal ao entardecer, com capivaras, onça-pintada, aves, peixes, plantas e fungos']],
      hs: [
        { id: 'ecp', c: '#FFB347', t: 'Capivara: um organismo', d: 'Um único indivíduo é o nível de organismo. A capivara é um roedor herbívoro, semiaquático, sem cauda aparente.', em: { a: [79, 68] }, z: 2.4 },
        { id: 'ecg', c: '#F7C13B', t: 'Grupo de capivaras: uma população', d: 'Indivíduos da mesma espécie, no mesmo lugar e ao mesmo tempo formam uma população.', em: { a: [57, 55] }, z: 2.8 },
        { id: 'eco', c: '#A9C54A', t: 'Onça-pintada', d: 'Onças, capivaras, garças, peixes, plantas e fungos juntos formam a comunidade, que reúne só os seres vivos (fatores bióticos).', em: { a: [15, 53] }, z: 2.6 },
        { id: 'ega', c: '#CFE0FF', t: 'Garça e jabiru', d: 'Cada espécie de ave é outra população. Todas as populações do lugar, juntas, são a comunidade.', em: { a: [29, 57] }, z: 2.8 },
        { id: 'epe', c: '#8FD8FF', t: 'Peixes e água', d: 'A água é fator abiótico. Comunidade mais ambiente físico (luz, água, solo, temperatura) é o ecossistema.', em: { a: [24, 91] }, z: 2.8 },
        { id: 'eso', c: '#FFD43B', t: 'Luz do Sol', d: 'A luz é a fonte de energia do ecossistema. Matéria e energia circulam entre os seres vivos e o ambiente.', em: { a: [50, 35] }, z: 2.6 },
        { id: 'efu', c: '#F28B8B', t: 'Fungos no tronco', d: 'Fungos e bactérias decompõem restos e devolvem nutrientes ao solo. Também fazem parte da comunidade.', em: { a: [74, 48] }, z: 3 },
        { id: 'ebi', c: '#9A6BFF', t: 'Pantanal: um bioma', d: 'O Pantanal é um dos seis biomas do Brasil, uma grande região com clima e vegetação parecidos. Todos os ecossistemas da Terra formam a biosfera.', em: { a: [38, 37] }, z: 2.2 }
      ] }],
    ['energia/produtividade', { pref: 'ecologia', nome: 'Do Sol ao herbívoro', mask: false, oculto: true, sobre: sobreProd, estatico: 'Do Sol ao herbívoro: a árvore usa a luz para fabricar matéria orgânica (PPB), gasta parte na respiração e guarda o resto (PPL), que alimenta o herbívoro. Use Ver esquema para comparar a PPL dos ecossistemas.',
      vistas: [['a', 'energia-produtividade-a', 'Cerrado', 'Árvore do Cerrado sob a luz do Sol e veado-campeiro comendo capim']],
      hs: [
        { id: 'psol', c: '#FFD43B', t: 'Luz do Sol', d: 'É a fonte de toda a energia do ecossistema. As folhas captam uma parte pequena dela na fotossíntese.', em: { a: [5, 10] }, z: 2.4 },
        { id: 'pfol', c: '#A9C54A', t: 'Folhas: a PPB', d: 'Produtividade primária bruta (PPB) é toda a matéria orgânica que o produtor fabrica na fotossíntese.', em: { a: [40, 30] }, z: 2.6 },
        { id: 'prsp', c: '#F28B8B', t: 'Respiração', d: 'A planta gasta parte do que produz na respiração e libera calor. A PPL é a PPB menos a respiração (R).', em: { a: [44, 62] }, z: 2.6 },
        { id: 'pfru', c: '#FFA94D', t: 'Frutos e brotos: a PPL', d: 'O que sobra, a produtividade primária líquida (PPL), vira crescimento, frutos e sementes. É o alimento disponível aos consumidores.', em: { a: [48, 39] }, z: 3 },
        { id: 'pvea', c: '#F7C13B', t: 'Veado: o herbívoro', d: 'O consumidor primário come só uma parte da PPL. Só essa parte passa ao nível seguinte da cadeia.', em: { a: [87, 63] }, z: 2.6 },
        { id: 'pnut', c: '#8FD8FF', t: 'Solo, água e nutrientes', d: 'Luz, água e nutrientes limitam a PPL. Onde há tudo em abundância, como manguezal e floresta tropical, ela é maior.', em: { a: [60, 89] }, z: 2.4 }
      ] }],
    ['impactos/ozonio', { pref: 'ecologia', nome: 'Camada de ozônio', mask: false, ctl: true, oculto: true, sobre: sobreOzonio,
      vistas: [['a', 'impactos-ozonio-a', 'Atmosfera', 'A Terra vista do espaço, com a camada de ozônio na estratosfera acima das nuvens (espessura exagerada)']],
      hs: [
        { id: 'zoz', c: '#B58CFF', t: 'Camada de ozônio', d: 'Fica na estratosfera, entre 20 e 30 km de altitude. Absorve a maior parte do ultravioleta do Sol. Na figura, a espessura foi exagerada.', em: { a: [25, 50] }, z: 2.4 },
        { id: 'zbu', c: '#6EEB96', t: 'Cloro dos CFCs', d: 'Os CFCs sobem intactos até a estratosfera. Lá, o UV solta átomos de cloro, e cada átomo destrói milhares de moléculas de ozônio. O maior buraco se abre sobre a Antártida.', em: { a: [50, 44.5] }, z: 2.6 },
        { id: 'zsol', c: '#FFD43B', t: 'Radiação do Sol', d: 'Parte dela é ultravioleta (UV). O UV danifica o DNA e causa câncer de pele, catarata e danos ao fitoplâncton.', em: { a: [92, 12] }, z: 2.4 },
        { id: 'ztro', c: '#8FD8FF', t: 'Troposfera e nuvens', d: 'É a camada de baixo, onde vivemos e onde se formam as nuvens. O ozônio perto do solo é poluente e não protege.', em: { a: [45, 70] }, z: 2.2 }
      ] }],
    ['impactos/estufa', { pref: 'ecologia', nome: 'Efeito estufa', mask: false, ctl: true, oculto: true, sobre: sobreEstufa, amb: amb3d,
      vistas: [['a', 'impactos-estufa-a', 'Paisagem', 'Paisagem com floresta, fábrica, gado e estrada sob uma camada de gases de efeito estufa']],
      hs: [
        { id: 'esol', c: '#FFD43B', t: 'Luz do Sol', d: 'A luz atravessa os gases sem dificuldade e aquece o chão e a água.', em: { a: [21, 25] }, z: 2.4 },
        { id: 'egz', c: '#FFA94D', t: 'Gases de efeito estufa', d: 'CO₂, CH₄ e vapor de água deixam passar a luz, mas retêm parte do calor que a Terra devolve. Mais gases, mais calor retido. O termômetro mostra o aquecimento no equilíbrio; hoje a Terra já está cerca de 1,2 °C mais quente.', em: { a: [62, 24] }, z: 2.6 },
        { id: 'efa', c: '#F28B8B', t: 'Fábrica', d: 'A queima de combustíveis fósseis libera CO₂ que estava guardado há milhões de anos.', em: { a: [50, 58] }, z: 2.8 },
        { id: 'efl', c: '#A9C54A', t: 'Floresta', d: 'As plantas absorvem CO₂ na fotossíntese e guardam carbono. O desmatamento e as queimadas devolvem esse carbono ao ar.', em: { a: [14, 52] }, z: 2.4 },
        { id: 'egd', c: '#F7C13B', t: 'Gado', d: 'Os bois liberam metano (CH₄) na digestão. Por molécula, o CH₄ retém muito mais calor que o CO₂.', em: { a: [84, 70] }, z: 2.8 },
        { id: 'eca', c: '#8FD8FF', t: 'Estrada', d: 'Carros e caminhões movidos a combustível emitem CO₂ em cada trajeto.', em: { a: [50, 80] }, z: 2.6 }
      ] }],
    ['populacoes/predador', { pref: 'ecologia', nome: 'Predador e presa', mask: false, ctl: true, oculto: true, sobre: sobrePredador, fora: foraPredador, amb: amb3d,
      vistas: [['a', 'populacoes-predador-a', 'Várzea', 'Onça-pintada à espreita de capivaras na várzea do Pantanal ao entardecer']],
      hs: [
        { id: 'qon', c: '#9A6BFF', t: 'Onça-pintada: predador', d: 'Carnívora. Com muitas presas, sobra alimento e a população cresce, sempre depois do pico das presas.', em: { a: [30, 55] }, z: 2.4 },
        { id: 'qca', c: '#F7C13B', t: 'Capivaras: presas', d: 'Herbívoras. Com pouco predador e muito capim, a população cresce depressa.', em: { a: [63, 61] }, z: 2.6 },
        { id: 'qpe', c: '#FFA94D', t: 'Filhote perto da água', d: 'Filhotes e animais isolados são mais vulneráveis. Ficar em grupo e perto da água ajuda na defesa.', em: { a: [82, 74] }, z: 3 },
        { id: 'qcp', c: '#3FBF6A', t: 'Capim', d: 'É o alimento das capivaras. Quando ele é limitado, segura o crescimento das presas.', em: { a: [66, 78] }, z: 2.6 },
        { id: 'qag', c: '#8FD8FF', t: 'Várzea', d: 'Área que alaga na cheia, típica do Pantanal. Água e capim sustentam as capivaras, e as capivaras sustentam as onças.', em: { a: [88, 42] }, z: 2.2 }
      ] }],
    ['teias/cadeia', { pref: 'ecologia', nome: 'Cadeia alimentar', mask: false, ctl: true, oculto: true, sobre: sobreCadeia, amb: amb3d,
      vistas: [['a', 'teias-cadeia-a', 'Cerrado', 'Cadeia do Cerrado: capim, gafanhoto, sapo, cobra e gavião, com fungos nos restos']],
      hs: [
        { id: 'tca', c: '#3FBF6A', t: 'Capim: produtor', d: 'Faz fotossíntese e ocupa o 1º nível trófico. É a base da cadeia.', em: { a: [9, 40] }, z: 2.4 },
        { id: 'tga', c: '#F7C13B', t: 'Gafanhoto: consumidor primário', d: 'Herbívoro. Está no 2º nível trófico e come o capim.', em: { a: [22, 44] }, z: 3 },
        { id: 'tsa', c: '#8FD8FF', t: 'Sapo: consumidor secundário', d: 'Carnívoro que come insetos. Está no 3º nível trófico.', em: { a: [36, 72] }, z: 2.8 },
        { id: 'tco', c: '#FFA94D', t: 'Cobra: consumidor terciário', d: 'Come anfíbios como o sapo. Está no 4º nível trófico.', em: { a: [65, 66] }, z: 2.6 },
        { id: 'tgv', c: '#F28B8B', t: 'Gavião: consumidor quaternário', d: 'Topo desta cadeia. Em cada passo só cerca de 10% da energia passa ao nível seguinte, e o resto vira calor.', em: { a: [86, 30] }, z: 2.6 },
        { id: 'tfu', c: '#B08458', t: 'Fungos: decompositores', d: 'Fungos e bactérias decompõem restos de todos os níveis e devolvem nutrientes ao solo.', em: { a: [68, 85] }, z: 3 }
      ] }],
    ['relacoes/desarmonicas', { pref: 'ecologia', nome: 'Relações desarmônicas', mask: false, oculto: true, sobre: sobreDesarm, estatico: 'Predação (onça e capivara), herbivoria (capivara e capim) e parasitismo (erva-de-passarinho e árvore). Em todas, um ganha (+) e o outro perde (−). Use Ver esquema para ver também competição, amensalismo e canibalismo.',
      vistas: [['a', 'relacoes-desarmonicas-a', 'Pantanal', 'Onça-pintada à espreita de uma capivara e erva-de-passarinho parasitando uma árvore']],
      hs: [
        { id: 'don', c: '#9A6BFF', t: 'Predação', d: 'A onça-pintada mata a capivara para comer. O predador ganha (+) e a presa perde (−).', em: { a: [28, 62] }, z: 2.4 },
        { id: 'dca', c: '#F7C13B', t: 'Herbivoria', d: 'A capivara come o capim. O herbívoro ganha (+) e a planta perde parte do corpo (−).', em: { a: [60, 70] }, z: 2.6 },
        { id: 'der', c: '#A9C54A', t: 'Parasitismo', d: 'A erva-de-passarinho faz fotossíntese, mas retira água e sais minerais da seiva da árvore. Ela ganha (+) e o hospedeiro perde (−).', em: { a: [68, 29] }, z: 2.8 },
        { id: 'dar', c: '#F28B8B', t: 'Árvore hospedeira', d: 'O hospedeiro enfraquece, mas em geral não morre logo. Parasitas costumam depender dele vivo.', em: { a: [94.5, 54.7] }, z: 2.6 },
        { id: 'dag', c: '#8FD8FF', t: 'Rio', d: 'Onças caçam junto à água. Esta cena mostra relações entre espécies diferentes. Competição na mesma espécie e canibalismo estão no esquema.', em: { a: [76, 82] }, z: 2.2 }
      ] }],
    ['impactos/chuva', { pref: 'ecologia', nome: 'Chuva ácida', mask: false, ctl: true, oculto: true, sobre: sobreChuva,
      vistas: [['a', 'impactos-chuva-a', 'Região industrial', 'Fábricas, nuvem de tempestade e floresta danificada pela chuva ácida, com lago ao lado']],
      hs: [
        { id: 'cch', c: '#FFA94D', t: 'Chaminés', d: 'A queima de carvão e de derivados de petróleo libera SO₂ e NOₓ na atmosfera.', em: { a: [11, 54] }, z: 2.6 },
        { id: 'cnu', c: '#CFE0FF', t: 'Nuvem', d: 'Os gases reagem com a água e formam ácido sulfúrico (H₂SO₄) e ácido nítrico (HNO₃). A chuva fica com pH menor que 5,6.', em: { a: [59, 15] }, z: 2.4 },
        { id: 'cfl', c: '#F28B8B', t: 'Floresta danificada', d: 'A chuva ácida queima folhas e acidifica o solo, que perde nutrientes. As árvores enfraquecem e morrem.', em: { a: [89, 42] }, z: 2.6 },
        { id: 'cla', c: '#8FD8FF', t: 'Lago', d: 'Com pH baixo, peixes e outros seres aquáticos morrem. Rochas calcárias no fundo ajudam a neutralizar a acidez.', em: { a: [67, 82] }, z: 2.4 },
        { id: 'cvi', c: '#A9C54A', t: 'Árvores que resistem', d: 'Algumas árvores aguentam mais a acidez. Em áreas muito afetadas, a comunidade inteira muda.', em: { a: [63, 56] }, z: 2.8 }
      ] }],
    ['relacoes/polinizacao', { pref: 'ecologia', nome: 'Polinização e dispersão', mask: false, oculto: true, sobre: sobrePolin, estatico: 'Abelha, beija-flor e morcego levam o pólen de flor em flor. A cutia enterra castanhas e esquece parte delas, que germinam. Use Ver esquema para testar o que acontece sem cada animal.',
      vistas: [['a', 'relacoes-polinizacao-a', 'Floresta', 'Abelha, beija-flor e morcego polinizando flores, e cutia enterrando castanhas ao pé de uma castanheira']],
      hs: [
        { id: 'oab', c: '#F28B8B', t: 'Abelha', d: 'Poliniza flores de cores vivas, abertas de dia. Atraída por néctar e pólen, leva o pólen de uma flor à outra.', em: { a: [13, 76] }, z: 2.8 },
        { id: 'obe', c: '#F28B8B', t: 'Beija-flor', d: 'Poliniza flores tubulares e vermelhas, quase sem cheiro e ricas em néctar.', em: { a: [36, 47] }, z: 3 },
        { id: 'omo', c: '#CFE0FF', t: 'Morcego', d: 'Poliniza flores claras, de cheiro forte, que abrem à noite.', em: { a: [62, 36] }, z: 3 },
        { id: 'ocu', c: '#FFA94D', t: 'Cutia', d: 'Dispersa sementes. Enterra castanhas e esquece parte delas, que germinam longe da árvore-mãe.', em: { a: [84, 74] }, z: 2.8 },
        { id: 'oou', c: '#F7C13B', t: 'Ouriço da castanheira', d: 'O fruto tem casca muito dura. A cutia consegue abri-lo com os dentes, e a castanheira depende dela.', em: { a: [75, 81] }, z: 3 },
        { id: 'obr', c: '#A9C54A', t: 'Muda nova', d: 'Uma semente esquecida pela cutia germina. É assim que a floresta se renova e se espalha.', em: { a: [64.5, 87] }, z: 3 }
      ] }]
  ];

  // borda suave: o retângulo da figura some no fundo do palco (a máscara oval do visor cortaria os cantos)
  const feather = (R, X) => {
    const f = Math.min(26, R.w * .05), bg = '15,22,38';
    X.save();
    let g = X.createLinearGradient(R.x, 0, R.x + f, 0); g.addColorStop(0, `rgba(${bg},1)`); g.addColorStop(1, `rgba(${bg},0)`); X.fillStyle = g; X.fillRect(R.x, R.y, f, R.h);
    g = X.createLinearGradient(R.x + R.w, 0, R.x + R.w - f, 0); g.addColorStop(0, `rgba(${bg},1)`); g.addColorStop(1, `rgba(${bg},0)`); X.fillStyle = g; X.fillRect(R.x + R.w - f, R.y, f, R.h);
    g = X.createLinearGradient(0, R.y, 0, R.y + f); g.addColorStop(0, `rgba(${bg},1)`); g.addColorStop(1, `rgba(${bg},0)`); X.fillStyle = g; X.fillRect(R.x, R.y, R.w, f);
    g = X.createLinearGradient(0, R.y + R.h, 0, R.y + R.h - f); g.addColorStop(0, `rgba(${bg},1)`); g.addColorStop(1, `rgba(${bg},0)`); X.fillStyle = g; X.fillRect(R.x, R.y + R.h - f, R.w, f);
    X.restore();
  };

  const INIT3 = { 'populacoes/predador': S => { S.o = S.o || 'lv'; S.k = null; } };

  // ---------- encaixe ----------
  const emFigura = () => { const b = document.querySelector('.fa-barra'); const f = b && b.querySelector('button[data-m="fig"]'); return !!(b && !b.hidden && f && f.getAttribute('aria-pressed') === 'true'); };
  cenas.forEach(([k, cfg]) => {
    const o = E.SC[k]; if (!o) return;
    const a = cfg.amb || amb; delete cfg.amb;
    const e3 = !!o.plano;                                        // cena 3D: o plano é o 2D antigo
    ANTIGA.set(o, e3 ? o.plano : o.draw);
    const init00 = e3 ? INIT3[k] : o.init;                       // o init antigo (o das cenas 3D abriria o visor, então esse é refeito à mão)
    const estatico = cfg.estatico; delete cfg.estatico;
    const sob0 = cfg.sobre; cfg.sobre = (R, X, t, c) => { sob0(R, X, t, c); feather(R, X); };
    window.LAB_FIGALT.cena(a, k, cfg);
    // o rótulo do botão da cena antiga depende da rota (a barra é uma só)
    const draw1 = o.draw, rotulo = e3 ? 'Ver em 3D' : 'Ver esquema';
    o.draw = function (...args) {
      const r = draw1.apply(this, args);
      const sp = document.querySelector('.fa-barra button[data-m="d3"] span'); if (sp && sp.textContent !== rotulo) sp.textContent = rotulo;
      return r;
    };
    const init1 = o.init;
    o.init = function (S) { if (init1) init1.call(this, S); if (init00) init00.call(this, S); };   // com a figura na tela o init antigo não rodaria: a cena escondida precisa do estado
    const cap0 = o.cap, hit0 = o.hit;
    if (estatico) o.cap = function (S) { return emFigura() ? estatico : (cap0 ? cap0.call(this, S) : ''); };
    if (hit0) o.hit = function (...a2) { return emFigura() ? null : hit0.apply(this, a2); };
  });
})();
