/* LAB, fundo animado da página inicial (dono: Leo). Código e desenho próprios, sem dependências; abre por file://.
   Ideia "campo escuro": como amostras sob a lente do microscópio, luzes azuladas grandes e difusas derivam devagar,
   dois feixes suaves descem do alto e partículas finas sobem, piscando de leve. Tudo com pouco contraste, atrás do texto.
   - prefers-reduced-motion: desenha um quadro só e fica parado.
   - Aba oculta: o laço para (requestAnimationFrame cancelado) e volta quando a aba aparece.
   - Leve: no máximo cerca de 30 quadros por segundo, densidade de pixels até 1,5 e partículas contadas pela área. */
(function () {
  'use strict';
  var doc = document.documentElement, body = document.body;
  if (!body || !window.requestAnimationFrame) return;
  var cv = document.createElement('canvas');
  var x = cv.getContext && cv.getContext('2d');
  if (!x) return;
  cv.className = 'fundo-cv';
  cv.setAttribute('aria-hidden', 'true');
  body.insertBefore(cv, body.firstChild);
  doc.classList.add('fundo-on');

  var reduz = matchMedia('(prefers-reduced-motion: reduce)');
  var W = 0, H = 0, raf = 0, last = 0, t = 0, motes = [];
  var TAU = Math.PI * 2;

  // luzes difusas: posição base (fração da tela), raio (fração do lado maior), cor, alfa, frequências e amplitudes
  var LUZ = [
    { x: .74, y: .18, r: .58, c: '70,104,200', a: .22, fx: .021, fy: .017, ax: .09, ay: .07, p: 0 },
    { x: .16, y: .42, r: .46, c: '42,140,168', a: .10, fx: .016, fy: .024, ax: .08, ay: .10, p: 1.7 },
    { x: .52, y: .86, r: .52, c: '104,84,196', a: .10, fx: .013, fy: .019, ax: .12, ay: .06, p: 3.1 }
  ];

  // gerador simples e fixo, para o quadro parado ser sempre o mesmo
  var semente = 7;
  function rnd() { semente = (semente * 16807) % 2147483647; return (semente - 1) / 2147483646; }

  function mote(novo) {
    var grande = rnd() < .1;
    return {
      x: rnd() * W, y: novo ? H + 10 : rnd() * H,
      r: grande ? 2.2 + rnd() * 2.6 : .5 + rnd() * 1.1,
      v: 3 + rnd() * 9, dr: 6 + rnd() * 14, f: .05 + rnd() * .12, p: rnd() * TAU,
      a: grande ? .06 + rnd() * .06 : .18 + rnd() * .32, tw: .4 + rnd() * 1.2, g: grande
    };
  }

  function medir() {
    var d = Math.min(1.5, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * d); cv.height = Math.round(H * d);
    x.setTransform(d, 0, 0, d, 0, 0);
    var n = Math.max(24, Math.min(90, Math.round(W * H / 15000)));
    semente = 7; motes = [];
    for (var i = 0; i < n; i++) motes.push(mote(false));
  }

  function desenha(dt) {
    x.clearRect(0, 0, W, H);
    var M = Math.max(W, H), i, L, cx, cy, r, g;
    x.globalCompositeOperation = 'lighter';
    // 1. luzes difusas que derivam
    for (i = 0; i < LUZ.length; i++) {
      L = LUZ[i];
      cx = (L.x + Math.sin(t * L.fx * TAU + L.p) * L.ax) * W;
      cy = (L.y + Math.cos(t * L.fy * TAU + L.p) * L.ay) * H;
      r = L.r * M * (1 + .06 * Math.sin(t * .05 * TAU + L.p));
      g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, 'rgba(' + L.c + ',' + L.a + ')');
      g.addColorStop(.45, 'rgba(' + L.c + ',' + (L.a * .4) + ')');
      g.addColorStop(1, 'rgba(' + L.c + ',0)');
      x.fillStyle = g; x.fillRect(0, 0, W, H);
    }
    // 2. dois feixes suaves que descem do alto e balançam devagar
    for (i = 0; i < 2; i++) {
      var ox = W * (i ? .64 : .38), ang = (i ? -.2 : .18) + Math.sin(t * .03 * TAU + i * 2) * .08;
      var len = H * 1.1, wd = Math.max(140, W * .16);
      x.save(); x.translate(ox, -20); x.rotate(ang);
      g = x.createLinearGradient(0, 0, 0, len);
      g.addColorStop(0, 'rgba(150,180,255,' + (i ? .05 : .06) + ')');
      g.addColorStop(1, 'rgba(150,180,255,0)');
      x.fillStyle = g;
      x.beginPath(); x.moveTo(-wd * .12, 0); x.lineTo(wd * .12, 0); x.lineTo(wd * .5, len); x.lineTo(-wd * .5, len); x.closePath(); x.fill();
      x.restore();
    }
    // 3. partículas que sobem e piscam de leve
    for (i = 0; i < motes.length; i++) {
      var m = motes[i];
      m.y -= m.v * dt;
      if (m.y < -10) { motes[i] = m = mote(true); }
      var px = m.x + Math.sin(t * m.f * TAU + m.p) * m.dr;
      var al = m.a * (.55 + .45 * Math.sin(t * m.tw + m.p));
      // some perto do alto e do pé da tela, para não "estourar" na borda
      al *= Math.min(1, m.y / (H * .15), (H - m.y) / (H * .1) + .2);
      if (al <= .005) continue;
      if (m.g) {
        g = x.createRadialGradient(px, m.y, 0, px, m.y, m.r * 3);
        g.addColorStop(0, 'rgba(190,210,255,' + al + ')'); g.addColorStop(1, 'rgba(190,210,255,0)');
        x.fillStyle = g; x.beginPath(); x.arc(px, m.y, m.r * 3, 0, TAU); x.fill();
      } else {
        x.fillStyle = 'rgba(214,226,255,' + al + ')';
        x.beginPath(); x.arc(px, m.y, m.r, 0, TAU); x.fill();
      }
    }
    x.globalCompositeOperation = 'source-over';
  }

  function quadro(now) {
    raf = 0;
    if (document.hidden || reduz.matches) return;
    var dt = last ? (now - last) / 1000 : 0;
    if (dt === 0 || dt >= 1 / 32) {          // até ~30 quadros por segundo
      dt = Math.min(dt, .1); last = now; t += dt; desenha(dt);
    }
    raf = requestAnimationFrame(quadro);
  }
  function liga() {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    last = 0;
    if (reduz.matches) { t = 40; desenha(0); return; }   // quadro parado, com as luzes já espalhadas
    if (!document.hidden) raf = requestAnimationFrame(quadro);
  }

  medir();
  var espera = 0;
  addEventListener('resize', function () {
    clearTimeout(espera);
    espera = setTimeout(function () { medir(); if (reduz.matches || !raf) desenha(0); }, 120);
  });
  document.addEventListener('visibilitychange', liga);
  if (reduz.addEventListener) reduz.addEventListener('change', liga); else if (reduz.addListener) reduz.addListener(liga);
  liga();
})();
