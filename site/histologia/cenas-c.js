/* LAB, módulo Histologia. Cenas C (Prometeu): Sangue (elementos figurados e coagulação) e Muscular (os três tipos).
   Fontes científicas: docs/revisao-biologia/histologia-roteiro.md (Taxon, S1 e S2) e histologia-roteiro-b.md (Sapien, tópico 1).
   Usa a API do motor.js (def, tx, circ, ell, rr, line, lab, cap, area, nuc, shape, C...). Código e textos da equipe. */
'use strict';
{
  // cores da paleta do motor, com reserva caso alguma falte
  const RES = { he_nucleo: '#7B5CD6', he_rosa: '#E7A6C4', sangue: '#E0414F', hemacia: '#F0605D', leuco: '#C9D3F0', plaq: '#D9A0E8',
    musc: '#FF8C7A', actina: '#7CC8FF', miosina: '#E5484D', ca: '#FFD84D', colag: '#F28AA8', conj: '#F2A93B' };
  const K = n => (C && C[n]) || RES[n];
  const FIBRINA = '#F3E08A';           // rede de fibrina: amarela (roteiro S2)
  const EOS = '#FF9F5A', BASO = '#3C2A78', PLASMA = '#E9C76A';
  const NUC = (x, y, rx, ry, rot, o) => (typeof nuc === 'function' ? nuc(x, y, rx, ry, rot, o) : ell(x, y, rx, ry, rot, K('he_nucleo'), 'rgba(11,15,28,.45)', 1));

  // a faixa toca sozinha uma vez ao abrir (de min a max em dur segundos); se o aluno mexer, ele manda
  function autoUma(S, t, ctl, dur) {
    if (S.vSet === undefined) { S.vSet = S.v; S.toq = false; }
    if (S.v !== S.vSet) S.toq = true;
    if (!S.toq && !S.paused && t <= dur + .05) {
      const v = cl(Math.round(lerp(ctl.min, ctl.max, ss(t / dur)) / ctl.step) * ctl.step, ctl.min, ctl.max);
      if (v !== S.v) {
        S.v = S.vSet = v;
        const r = $('ctlR'), vv = $('ctlV');
        if (r) { r.value = v; r.setAttribute('aria-valuetext', ctl.f(v)); }
        if (vv) vv.textContent = ctl.f(v);
      }
    }
    return S.v;
  }
  // o motor chama drag() no pointerdown e no pointermove; só o primeiro toque de cada gesto conta
  function toque(S) { const now = performance.now(), ok = now - (S.tapT || 0) > 260; S.tapT = now; return ok; }
  const pressBtn = (i, on) => { const b = document.querySelectorAll('#extra button')[i]; if (b) b.setAttribute('aria-pressed', on ? 'true' : 'false'); };
  const PAINEL = 'rgba(19,26,43,.55)';

  // =====================================================================================
  // S1 PLASMA E CÉLULAS DO SANGUE
  // =====================================================================================
  const TIP = [
    { n: 'Hemácia', l: 'hemácia', f: 'disco sem núcleo, cheio de hemoglobina: transporta O₂ (e parte do CO₂)', q: '4,5 a 5,5 milhões por mm³; vive cerca de 120 dias' },
    { n: 'Neutrófilo', l: 'neutrófilo', f: 'núcleo em gomos; fagocita bactérias (forma o pus)', q: '55 a 65% dos leucócitos; vive de horas a poucos dias' },
    { n: 'Linfócito', l: 'linfócito', f: 'núcleo grande e redondo; imunidade específica: B (anticorpos, via plasmócitos) e T', q: '25 a 35% dos leucócitos; vive de dias a anos' },
    { n: 'Monócito', l: 'monócito', f: 'núcleo em forma de rim; vira macrófago nos tecidos', q: '3 a 8% dos leucócitos' },
    { n: 'Eosinófilo', l: 'eosinófilo', f: 'grânulos alaranjados; atua contra parasitas (vermes) e nas alergias', q: '2 a 4% dos leucócitos' },
    { n: 'Basófilo', l: 'basófilo', f: 'grânulos escuros; libera histamina e heparina', q: '0,5 a 1% dos leucócitos' },
    { n: 'Plaqueta', l: 'plaquetas', f: 'fragmento de megacariócito da medula óssea; atua na coagulação', q: '150.000 a 400.000 por mm³; vive cerca de 10 dias' }
  ];
  // posições no campo do microscópio (raio 1): leucócitos e grupos de plaquetas fixos; hemácias sorteadas sem encostar
  const LEU = [[1, -.42, -.36, .15], [2, .42, -.4, .115], [3, .02, .06, .17], [4, -.5, .36, .145], [5, .46, .4, .135]];
  const PLQ = [[-.05, -.72], [.08, -.68], [-.02, -.62], [.64, -.05], [.7, .03], [-.72, -.02], [-.12, .7], [.0, .76]];
  const HEM = (() => {
    const R = rng(42), out = [];
    for (let k = 0; k < 4000 && out.length < 70; k++) {
      const a = R() * TAU, d = Math.sqrt(R()) * .9, x = Math.cos(a) * d, y = Math.sin(a) * d;
      if (LEU.some(L => Math.hypot(x - L[1], y - L[2]) < L[3] + .1)) continue;
      if (PLQ.some(p => Math.hypot(x - p[0], y - p[1]) < .1)) continue;
      if (out.some(h => Math.hypot(x - h[0], y - h[1]) < .175)) continue;
      out.push([x, y, R() * TAU]);
    }
    return out;
  })();
  function hemacia(x, y, r, a = 1) {
    X.save(); X.globalAlpha *= a;
    circ(x, y, r, K('hemacia'), 'rgba(90,20,30,.55)', 1);
    circ(x, y, r * .45, rgba('#FFD0D0', .32));          // centro mais claro: disco bicôncavo, sem núcleo
    X.restore();
  }
  function leucocito(k, x, y, r, t) {
    const cit = { 1: '#E8C6DA', 2: '#B9C8EE', 3: '#C7C2DE', 4: '#F2B9A0', 5: '#C9B2E0' }[k];
    circ(x, y, r, cit, 'rgba(11,15,28,.5)', 1.2);
    if (k === 1) {        // neutrófilo: núcleo em 3 a 4 gomos ligados por fios
      const P = [[-.42, -.18], [-.05, -.38], [.36, -.12], [.12, .32]];
      for (let i = 1; i < P.length; i++) line(x + P[i - 1][0] * r, y + P[i - 1][1] * r, x + P[i][0] * r, y + P[i][1] * r, K('he_nucleo'), r * .14);
      P.forEach((p, i) => NUC(x + p[0] * r, y + p[1] * r, r * .27, r * .22, i, { seed: 3 + i }));
    } else if (k === 2) { // linfócito: núcleo grande e redondo, borda fina de citoplasma
      NUC(x - r * .06, y, r * .8, r * .78, 0, { seed: 9 });
    } else if (k === 3) { // monócito: núcleo em forma de rim
      NUC(x - r * .08, y, r * .62, r * .5, .3, { seed: 12 });
      ell(x + r * .44, y - r * .12, r * .28, r * .22, .3, cit);
    } else if (k === 4) { // eosinófilo: núcleo de 2 lobos e grânulos alaranjados
      const R = rng(77); for (let i = 0; i < 34; i++) { const a = R() * TAU, d = Math.sqrt(R()) * r * .85; circ(x + Math.cos(a) * d, y + Math.sin(a) * d, r * .09, rgba(EOS, .9)); }
      NUC(x - r * .34, y - r * .05, r * .3, r * .38, .2, { seed: 4 }); NUC(x + r * .34, y + r * .05, r * .3, r * .38, -.2, { seed: 6 });
      line(x - r * .1, y, x + r * .1, y, K('he_nucleo'), r * .12);
    } else if (k === 5) { // basófilo: grânulos escuros que escondem o núcleo
      NUC(x, y, r * .5, r * .42, .5, { seed: 8, a: .8 });
      const R = rng(55); for (let i = 0; i < 30; i++) { const a = R() * TAU, d = Math.sqrt(R()) * r * .85; circ(x + Math.cos(a) * d, y + Math.sin(a) * d, r * .1, rgba(BASO, .92)); }
    }
  }
  function plaqueta(x, y, r, rot) { ngon(x, y, r, 6, rot, K('plaq'), 'rgba(60,20,90,.6)', 1); circ(x, y, r * .45, rgba('#6B3FA0', .8)); }

  // tubo de ensaio com as camadas; f = separação (0 a 1); hct = hematócrito em %
  function tubo(x, y, w, h, f, hct) {
    const fill = h * .9, top = y + h - fill, s = ss(f);
    X.save(); capsulePath(x, y, w, h); X.clip();
    const hRed = fill * (hct / 100 + (1 - hct / 100) * (1 - s));
    X.fillStyle = rgba(PLASMA, .25 + .6 * s); X.fillRect(x, top, w, fill);       // plasma (aparece conforme separa)
    const g = X.createLinearGradient(0, y + h - hRed, 0, y + h); g.addColorStop(0, s > .5 ? '#A8202C' : '#9A2433'); g.addColorStop(1, '#6E1520');
    X.fillStyle = g; X.fillRect(x, y + h - hRed, w, hRed);                          // hemácias, que descem
    if (s > .55) { X.fillStyle = rgba('#F4F1EC', seg(s, .55, .9)); X.fillRect(x, y + h - hRed - 4, w, 4); }   // camada branca fina
    X.restore();
    capsulePath(x, y, w, h); X.strokeStyle = 'rgba(232,237,247,.8)'; X.lineWidth = 2; X.stroke();
    line(x - 4, y, x + w + 4, y, 'rgba(232,237,247,.8)', 2);
    return { top, yBuffy: y + h - hRed - 2, yRed: y + h - hRed / 2, yPl: (top + y + h - hRed) / 2, bot: y + h };
  }
  function capsulePath(x, y, w, h) { const r = w / 2; X.beginPath(); X.moveTo(x, y); X.lineTo(x, y + h - r); X.arc(x + r, y + h - r, r, PI, 0, true); X.lineTo(x + w, y); X.closePath(); }

  // ---------------------------------------------------------------------------------
  // Figura realista (histologia-sangue-elementos) com hotspots acessíveis.
  // Três camadas recortadas da própria figura (fundo, plano médio e primeiro plano) derivam
  // devagar e em velocidades diferentes; ao abrir um ponto, o resto da figura escurece um pouco.
  // ---------------------------------------------------------------------------------
  const CAM = ['far', 'mid', 'near'].map(k => {
    const im = new Image(), src = (window.LAB_IMG || {})['histologia-sangue-' + k];
    if (src) im.src = src;
    return im;
  });
  const up1 = s => s.charAt(0).toUpperCase() + s.slice(1);
  // posições em fração da figura; i é o índice em TIP
  const HS = [
    { i: 0, x: .478, y: .518 }, { i: 1, x: .300, y: .335 }, { i: 2, x: .697, y: .576 }, { i: 6, x: .287, y: .565 }
  ].map(h => ({ ...h, n: TIP[h.i].n, f: up1(TIP[h.i].f) + '.', q: 'Cerca de ' + TIP[h.i].q + '.' }));
  const REDUZ = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HX = { layer: null, btns: [], tip: null, hover: -1, focus: -1, pin: -1, shown: -2, prev: 0, dim: 0, dx: 0, dy: 0, px: 0, py: 0, tpx: 0, tpy: 0, last: 0, idleT: 0, off: null, tw: 0, th: 0 };
  const aberto = () => HX.hover >= 0 ? HX.hover : HX.focus >= 0 ? HX.focus : HX.pin;
  function hsMontar() {
    if (HX.layer) return;
    const tela = cv.parentNode, L = document.createElement('div');
    L.className = 'hs-layer';
    L.innerHTML = HS.map((h, k) => `<button type="button" class="hs" data-k="${k}" aria-label="${h.n}: ver função e quantidade" aria-expanded="false"><span class="ring"></span><span class="ring2"></span><span class="hs-p"></span></button>`).join('')
      + '<div class="hs-tip fl" id="hsTip" role="tooltip"><b></b><p></p><small></small></div>';
    tela.appendChild(L);
    HX.layer = L; HX.btns = [...L.querySelectorAll('.hs')]; HX.tip = L.querySelector('.hs-tip');
    const mark = () => { HX.last = performance.now(); };
    HX.btns.forEach((b, k) => {
      b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { HX.hover = k; mark(); } });
      b.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && HX.hover === k) HX.hover = -1; });
      b.addEventListener('focus', () => { try { if (b.matches(':focus-visible')) { HX.focus = k; mark(); } } catch (err) { HX.focus = k; } });
      b.addEventListener('blur', () => { if (HX.focus === k) HX.focus = -1; });
      b.addEventListener('click', () => { HX.pin = HX.pin === k ? -1 : k; mark(); });
    });
    L.addEventListener('keydown', e => { if (e.key === 'Escape') { HX.hover = HX.focus = HX.pin = -1; } });
    cv.addEventListener('pointerdown', () => { HX.pin = -1; });
    tela.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || REDUZ) return;
      const r = tela.getBoundingClientRect();
      HX.tpx = (e.clientX - r.left) / r.width - .5; HX.tpy = (e.clientY - r.top) / r.height - .5;
    });
    tela.addEventListener('pointerleave', () => { HX.tpx = HX.tpy = 0; });
    HX.off = document.createElement('canvas');
  }
  function hsEntrar() {
    hsMontar();
    HX.layer.hidden = false; HX.hover = HX.focus = HX.pin = -1; HX.shown = -2; HX.dim = 0; HX.last = performance.now();
    HX.btns.forEach(b => { b.classList.remove('in', 'idle'); });
  }
  function hsSair() { if (HX.layer) { HX.layer.hidden = true; HX.hover = HX.focus = HX.pin = -1; } }

  // desenha as três camadas, escurece o entorno do ponto aberto, esfuma as bordas e posiciona os botões
  function hsDesenhar(t, S, fig) {
    hsMontar();
    const now = performance.now(), dt = Math.min(.05, Math.max(0, (now - (HX.prev || now)) / 1000)); HX.prev = now;
    const k = 1 - Math.exp(-dt * 5);
    HX.px += (HX.tpx - HX.px) * k; HX.py += (HX.tpy - HX.py) * k;
    const ab = aberto(), pronto = CAM.every(im => im.complete && im.naturalWidth);
    // entrada: 0 a 900 ms, em --e-out; a figura sobe de opacidade, assenta de 1,03 para 1 e a máscara se abre
    const e = REDUZ ? 1 : 1 - Math.pow(1 - cl(t / .9, 0, 1), 4);
    // deriva lenta, em px do palco: fundo, plano médio e primeiro plano
    const u = fig.s / .6, mv = REDUZ ? 0 : 1;
    const off = [
      [(3 * Math.sin(t * .31) + 4 * HX.px) * u, (2 * Math.sin(t * .23 + 1) + 3 * HX.py) * u],
      [(7 * Math.sin(t * .27 + .8) + 9 * HX.px) * u, (4 * Math.sin(t * .21 + 2.1) + 6 * HX.py) * u],
      [(12 * Math.sin(t * .22 + 2) + 16 * HX.px) * u, (7 * Math.sin(t * .19 + 3.2) + 10 * HX.py) * u]
    ].map(o => [o[0] * mv, o[1] * mv]);
    const rx = fig.cx - fig.w / 2, ry = fig.cy - fig.h / 2;
    const pos = HS.map(h => [rx + h.x * fig.w + off[1][0], ry + h.y * fig.h + off[1][1]]);
    if (pronto) {
      const d = Math.min(2, window.devicePixelRatio || 1), oc = HX.off, w = Math.ceil(fig.w * d), h = Math.ceil(fig.h * d);
      if (oc.width !== w || oc.height !== h) { oc.width = w; oc.height = h; }
      const g = oc.getContext('2d');
      g.setTransform(d, 0, 0, d, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, fig.w, fig.h);
      CAM.forEach((im, n) => {
        const z = 1.035, ww = fig.w * z, hh = fig.h * z;
        g.drawImage(im, (fig.w - ww) / 2 + off[n][0], (fig.h - hh) / 2 + off[n][1], ww, hh);
      });
      // foco suave: o resto escurece, sem desfoque
      HX.dim += ((ab >= 0 ? 1 : 0) - HX.dim) * (1 - Math.exp(-dt * 9));
      if (ab >= 0) { HX.dx += (pos[ab][0] - rx - HX.dx) * (HX.dim < .05 ? 1 : k * 1.6); HX.dy += (pos[ab][1] - ry - HX.dy) * (HX.dim < .05 ? 1 : k * 1.6); }
      if (HX.dim > .003) {
        const R = Math.max(fig.w, fig.h) * .55, gr = g.createRadialGradient(HX.dx, HX.dy, 0, HX.dx, HX.dy, R);
        gr.addColorStop(0, 'rgba(8,11,22,0)'); gr.addColorStop(.2, 'rgba(8,11,22,0)'); gr.addColorStop(.55, `rgba(8,11,22,${.36 * HX.dim})`); gr.addColorStop(1, `rgba(8,11,22,${.42 * HX.dim})`);
        g.globalCompositeOperation = 'source-atop'; g.fillStyle = gr; g.fillRect(0, 0, fig.w, fig.h);
      }
      // bordas esfumadas: máscara radial elíptica que se abre na entrada
      g.globalCompositeOperation = 'destination-in';
      g.save(); g.translate(fig.w / 2, fig.h / 2); g.scale(1, fig.h / fig.w);
      const R0 = fig.w / 2 * lerp(.7, 1, e), mg = g.createRadialGradient(0, 0, 0, 0, 0, R0);
      mg.addColorStop(0, 'rgba(0,0,0,1)'); mg.addColorStop(.5, 'rgba(0,0,0,1)'); mg.addColorStop(.76, 'rgba(0,0,0,.5)'); mg.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = mg; g.fillRect(-fig.w, -fig.w, fig.w * 2, fig.w * 2); g.restore();
      g.globalCompositeOperation = 'source-over';
      X.save(); X.globalAlpha = e; X.translate(fig.cx, fig.cy); X.scale(lerp(1.03, 1, e), lerp(1.03, 1, e)); X.drawImage(oc, -fig.w / 2, -fig.h / 2, fig.w, fig.h); X.restore();
    }
    // botões: posição a partir das camadas, entrada em sequência de 60 ms a partir de 600 ms
    const idle = !REDUZ && now - HX.last > 8000 && ab < 0;
    HX.btns.forEach((b, n) => {
      b.style.transform = `translate3d(${(pos[n][0] - 22).toFixed(1)}px,${(pos[n][1] - 22).toFixed(1)}px,0)`;
      const vis = pronto && (REDUZ || t >= .6 + .06 * n);
      if (b.classList.contains('in') !== vis) b.classList.toggle('in', vis);
      const on = n === ab; if (b.classList.contains('on') !== on) { b.classList.toggle('on', on); b.setAttribute('aria-expanded', on); }
      if (idle && !b.classList.contains('idle')) b.classList.add('idle');
      if (!idle && b.classList.contains('idle') && now - HX.idleT > 1400) b.classList.remove('idle');
    });
    if (idle) { if (now - HX.idleT > 9000) HX.idleT = now; HX.last = now - 1000; }
    // rótulo: título, uma frase e a quantidade
    const T = HX.tip;
    if (ab !== HX.shown) {
      if (ab >= 0) { const h = HS[ab]; T.children[0].textContent = h.n; T.children[1].textContent = h.f; T.children[2].textContent = h.q; HX.tw = T.offsetWidth; HX.th = T.offsetHeight; }
      HX.btns.forEach((b, n) => { if (n === ab) b.setAttribute('aria-describedby', 'hsTip'); else b.removeAttribute('aria-describedby'); });
      T.classList.toggle('on', ab >= 0); HX.shown = ab;
    }
    if (ab >= 0) {
      const p = pos[ab], tw0 = HX.tw || T.offsetWidth, th0 = HX.th || T.offsetHeight; let x, y;
      if (NAR) { x = cl(p[0] - tw0 / 2, 8, W - tw0 - 8); y = p[1] + 26; if (y + th0 > H - 58) y = p[1] - 26 - th0; }
      else { x = p[0] < W * .5 ? p[0] + 28 : p[0] - 28 - tw0; y = cl(p[1] - th0 / 2, 8, H - 64 - th0); }
      T.style.left = x.toFixed(1) + 'px'; T.style.top = Math.max(8, y).toFixed(1) + 'px';
    }
    return ab;
  }

  const ctlS1 = { l: 'Centrifugar', min: 0, max: 100, step: 1, v: 0, f: v => v <= 0 ? 'sangue misturado' : v >= 100 ? 'camadas separadas' : nbr(v) + '%', rate: () => 1 };
  def('sangue', 'elementos', {
    t: 'Plasma e células do sangue', s: 'um conjuntivo de matriz líquida', c: K('sangue'), loc: 'Tubo centrifugado e células ao microscópio', still: 1, stillV: 100,
    ctl: ctlS1,
    alt: 'À esquerda, um tubo de sangue que, com a faixa Centrifugar, se separa em plasma em cima, uma faixa fina branca de leucócitos e plaquetas e hemácias embaixo. À direita, uma ilustração realista de hemácias, um neutrófilo, um linfócito e plaquetas em movimento lento; tocar num dos quatro pontos (hemácia, neutrófilo, linfócito e plaqueta) mostra nome, função e quantidade',
    extra: [
      { t: 'Próxima célula', on: S => { HX.pin = (HX.pin + 1) % HS.length; HX.hover = HX.focus = -1; HX.last = performance.now(); }, pressed: () => false },
      { t: 'Altitude', on: S => { S.alt = !S.alt; }, pressed: S => !!S.alt }
    ],
    d: `<p>O <b>sangue</b> é um tecido conjuntivo especial, cuja matriz é líquida: o <b>plasma</b>. Um adulto tem de 4,5 a 5,5 litros de sangue. Se uma amostra for centrifugada, separa-se em cerca de <b>55% de plasma</b> (amarelado, cerca de 90% de água, com proteínas como albumina, anticorpos e fibrinogênio, além de sais, glicose, hormônios e gás carbônico) e cerca de <b>45% de elementos figurados</b>. A fração das hemácias é o <b>hematócrito</b>. As <b>hemácias</b> (glóbulos vermelhos) são discos achatados, sem núcleo nos mamíferos, cheios de <b>hemoglobina</b>, a proteína com ferro que transporta o O₂; vivem cerca de <b>120 dias</b> e são destruídas no baço e no fígado. Os <b>leucócitos</b> (glóbulos brancos) defendem o corpo. As <b>plaquetas</b> são fragmentos dos <b>megacariócitos</b> da medula óssea e atuam na coagulação (ver <a href="#sangue/coagulacao">Coagulação</a>).</p>
<p>Todas essas células nascem na <b>medula óssea vermelha</b>, a partir de <b>células-tronco</b> (hematopoese), o que explica o transplante de medula em doenças como a leucemia. O rim controla a produção de hemácias com o hormônio <b>eritropoetina</b>: quando falta O₂, como em grandes <b>altitudes</b>, ele libera mais eritropoetina, e o número de hemácias sobe em poucas semanas. A <b>anemia</b> é a falta de hemácias ou de hemoglobina; a mais comum é a por falta de ferro.</p>
<p>Valores de referência aproximados para adultos (Junqueira e Carneiro, cap. 12):</p>
<table><thead><tr><th>Elemento</th><th>Por mm³ (µL)</th><th>Função</th><th>Vida média</th></tr></thead><tbody>
<tr><td>Hemácias</td><td>4,5 a 5,5 milhões (um pouco menos nas mulheres)</td><td>transporte de O₂ (e parte do CO₂)</td><td>cerca de 120 dias</td></tr>
<tr><td>Leucócitos (total)</td><td>5.000 a 10.000</td><td>defesa</td><td>de horas a anos</td></tr>
<tr><td>Neutrófilos</td><td>55 a 65% dos leucócitos</td><td>fagocitose de bactérias (formam o pus)</td><td>horas a poucos dias</td></tr>
<tr><td>Linfócitos</td><td>25 a 35%</td><td>imunidade específica: B (anticorpos, via plasmócitos) e T</td><td>dias a anos</td></tr>
<tr><td>Monócitos</td><td>3 a 8%</td><td>viram macrófagos nos tecidos</td><td></td></tr>
<tr><td>Eosinófilos</td><td>2 a 4%</td><td>parasitas (vermes) e alergias</td><td></td></tr>
<tr><td>Basófilos</td><td>0,5 a 1%</td><td>histamina e heparina</td><td></td></tr>
<tr><td>Plaquetas</td><td>150.000 a 400.000</td><td>coagulação</td><td>cerca de 10 dias</td></tr>
</tbody></table>
<p>Mova a faixa para centrifugar o tubo, toque numa célula do esfregaço para ver o que ela faz e ligue a altitude para ver o hematócrito subir. Os valores são faixas de referência aproximadas, não servem para diagnóstico.</p>`,
    enem: 'As associações que caem: <b>hemácia</b> e hemoglobina com o <b>transporte de O₂</b> (anemia = pouco O₂ chegando aos tecidos, com cansaço); <b>leucócitos</b> com a <b>defesa</b> (o número sobe nas infecções); <b>plaquetas</b> com a <b>coagulação</b> (o número cai na dengue, e muito nos casos graves). Em <b>grandes altitudes</b>, o corpo produz mais hemácias, estimulado pela <b>eritropoetina</b>; por isso os atletas treinam em altitude, e a eritropoetina sintética é doping.',
    links: [['Coagulação', '#sangue/coagulacao'], ['Macrófagos no conjuntivo', '#conjuntivo/propriamente']],
    draw(t, S) {
      const A = area(), f = autoUma(S, t, ctlS1, 5) / 100;
      // altitude: semanas passam depressa (cerca de 1 semana por segundo) e o hematócrito sobe de ~45% para ~50%
      S.wk = cl((S.wk || 0) + (S.alt ? 1 : -2) * S.dt, 0, 6);
      const hct = Math.round(45 + 5 * ss(S.wk / 6));   // arredonda primeiro: plasma + hemácias somam 100%
      // ---- layout: o tubo fica numa coluna e a figura ocupa o resto do palco, sem moldura ----
      let tb, fig;
      if (NAR) {
        const th = Math.min(150, A.h * .34);
        tb = { x: A.x0 + 14, y: A.y0 + 14, w: 30, h: th - 8 };
        const top = A.y0 + th + 4, aH = H - top - 2, s = Math.min(W * 1.2 / 1200, aH / 896);
        fig = { s, w: 1200 * s, h: 896 * s, cx: W / 2, cy: top + aH / 2 };
      } else {
        const colW = Math.min(300, A.w * .3), th = Math.min(A.h - 60, 330);
        tb = { x: A.x0 + 30, y: A.y0 + (A.h - th) / 2 - 10, w: 46, h: th };
        const x0 = A.x0 + colW - 24, aW = W - x0, s = Math.min(aW / 1200, H / 896) * 1.1;
        fig = { s, w: 1200 * s, h: 896 * s, cx: x0 + aW / 2, cy: H / 2 - 4 };
      }
      // ---- tubo ----
      const T = tubo(tb.x, tb.y, tb.w, tb.h, f, hct), lx = tb.x + tb.w + 12, s = ss(f);
      const lab1 = (y, a, b, al) => { X.save(); X.globalAlpha = al; line(tb.x + tb.w + 2, y, lx - 3, y, 'rgba(232,237,247,.5)', 1); tx(a, lx, y - (b ? 8 : 0), { s: 13, w: 700, a: 'left', c: C.txt }); if (b) tx(b, lx, y + 9, { s: 12, a: 'left', c: C.dim, bg: false }); X.restore(); };
      if (s < .3) lab1(tb.y + tb.h * .55, 'sangue', 'misturado', 1 - s / .3);
      if (s > .3) {
        // três rótulos de duas linhas, empilhados sem encostar (36 px entre eles)
        const al = seg(s, .3, .7), gapL = 36;
        let yP = T.yPl, yW = T.yBuffy, yR = T.yRed;
        yW = Math.max(yW, yP + gapL); yR = Math.max(yR, yW + gapL);
        if (yR > T.bot) { yR = T.bot; yW = Math.min(yW, yR - gapL); yP = Math.min(yP, yW - gapL); }
        const lk = (y0, y, a, b, alpha) => { X.save(); X.globalAlpha = alpha; line(tb.x + tb.w + 2, y0, lx - 3, y, 'rgba(232,237,247,.5)', 1); tx(a, lx, y - 8, { s: 13, w: 700, a: 'left', c: C.txt }); tx(b, lx, y + 9, { s: 12, a: 'left', c: C.dim, bg: false }); X.restore(); };
        lk(T.yPl, yP, 'plasma', `cerca de ${nbr(100 - hct)}%`, al);
        if (s > .7) lk(T.yBuffy, yW, 'leucócitos e plaquetas', 'menos de 1%', seg(s, .7, .95));
        lk(T.yRed, yR, 'hemácias', `cerca de ${nbr(hct)}% (hematócrito)`, al);
      }
      // ---- altitude (contador) ----
      if (S.alt || S.wk > 0) {
        const yA = NAR ? tb.y + 12 : tb.y + tb.h + 34, xA = NAR ? A.x1 : tb.x - 6;
        tx(`hematócrito de cerca de ${nbr(hct)}%`, xA, yA, { s: 13, w: 700, a: NAR ? 'right' : 'left', c: K('hemacia'), f: FD });
        tx(S.alt ? `semana ${Math.max(1, Math.ceil(S.wk))} na altitude` : 'de volta ao nível do mar', xA, yA + 17, { s: 12, a: NAR ? 'right' : 'left', c: C.dim, bg: false });
      }
      // ---- figura com hotspots ----
      const aberto = hsDesenhar(t, S, fig);
      const ty = aberto >= 0 ? TIP[HS[aberto].i] : null;
      cap(f < 1 ? 'Mova a faixa <b>Centrifugar</b>: as hemácias, mais densas, descem; o plasma fica em cima.'
        : S.alt ? 'Na altitude falta O₂: o rim libera mais <b>eritropoetina</b> e a medula faz mais hemácias. O hematócrito sobe em poucas semanas.'
        : ty ? `<b>${ty.n}</b>. Toque em outro ponto ou use "Próxima célula".`
        : 'Toque, passe o mouse ou use a tecla Tab nos pontos da figura para ver o que cada célula faz.');
    },
    init(S) { hsEntrar(S); },
    sai() { hsSair(); }
  });

  // =====================================================================================
  // S2 COAGULAÇÃO
  // =====================================================================================
  const MODOS = [
    { t: 'Sem vit. K', k: 'vitk', falha: 1, nota: 'Sem vitamina K, o fígado não consegue completar a protrombina e outros fatores: a cascata para no segundo degrau, sai pouca trombina e o sangramento continua.' },
    { t: 'Hemofilia', k: 'hemo', falha: 0, nota: 'Na hemofilia falta um fator da coagulação (o fator VIII, na forma mais comum): um degrau falha, forma-se pouca fibrina e o sangramento demora muito a parar.' },
    { t: 'AAS', k: 'aas', falha: -1, nota: 'O AAS dificulta a agregação das plaquetas: o tampão fica fraco e o sangramento demora mais a parar. Por isso não se usa AAS em suspeita de dengue.' },
    { t: 'Sem cálcio', k: 'ca', falha: 0, nota: 'Sem Ca²⁺ a cascata não começa. É o que acontece nas bolsas de sangue com citrato, que prende o cálcio: o sangue não coagula.' }
  ];
  const ETAPAS = ['antes da lesão', 'etapa 1: o vaso se contrai', 'etapa 2: tampão de plaquetas', 'etapa 3: a cascata', 'etapa 4: a rede de fibrina'];
  const etapa = v => v < 5 ? 0 : v < 25 ? 1 : v < 50 ? 2 : v < 75 ? 3 : 4;
  const ctlS2 = { l: 'Tempo após a lesão', min: 0, max: 100, step: 1, v: 0, f: v => v >= 100 ? 'alguns minutos' : ['antes da lesão', 'etapa 1', 'etapa 2', 'etapa 3', 'etapa 4'][etapa(v)], rate: () => 1 };
  function estadoCoag(v, m) {
    const k = m ? m.k : '';
    const contr = ss(seg(v, 5, 22));
    let plug = ss(seg(v, 25, 45)); if (k === 'aas') plug *= .35;
    let c1 = seg(v, 50, 58), c2 = seg(v, 58, 66), c3 = seg(v, 66, 75);
    if (k === 'ca') { c1 = 0; c2 = 0; c3 = 0; }
    if (k === 'hemo') { c1 = Math.min(c1, .35); c2 = Math.min(c2, .3); c3 = Math.min(c3, .3); }   // a cascata passa, mas fraca
    if (k === 'vitk') { c2 = Math.min(c2, .25); c3 = 0; }
    let fib = c3 >= 1 ? ss(seg(v, 75, 95)) : 0;
    if (k === 'aas') fib = ss(seg(v, 82, 100));            // com AAS a rede demora mais
    if (k === 'hemo') fib = ss(seg(v, 75, 100)) * .25;     // na hemofilia, rede rala: pouca fibrina
    const leak = v < 5 ? 0 : cl((1 - .3 * contr) * (1 - .5 * ss(seg(v, 25, 45)) * (k === 'aas' ? .35 : 1)) * (1 - fib), 0, 1);
    return { contr, plug, c: [c1, c2, c3], fib, leak };
  }
  def('sangue', 'coagulacao', {
    t: 'Coagulação', s: 'do tampão de plaquetas à rede de fibrina', c: K('sangue'), loc: 'Vaso sanguíneo em corte longitudinal', still: 1, stillV: 100,
    ctl: ctlS2, auto: S => S.user ? 0 : 9,
    alt: 'Um vaso em corte longitudinal com hemácias e plaquetas correndo. A faixa abre uma lesão e avança as etapas: o vaso se contrai, as plaquetas formam um tampão, uma cascata em três degraus transforma protrombina em trombina e fibrinogênio em fibrina, e a rede amarela de fibrina prende as hemácias e fecha o vaso',
    extra: MODOS.map((m, i) => ({ t: m.t, on: S => { S.modo = S.modo === i ? null : i; S.v = 0; }, pressed: S => S.modo === i })),
    d: `<p>Quando um vaso se rompe, três coisas acontecem em sequência. O vaso se contrai e o sangramento diminui. As <b>plaquetas</b> grudam na parede lesada e umas nas outras, formando um <b>tampão</b> provisório. E começa a <b>coagulação</b>: plaquetas e tecido lesado liberam fatores (como a tromboplastina) que, com íons <b>cálcio</b> (Ca²⁺) e várias proteínas do plasma, transformam a <b>protrombina</b> em <b>trombina</b>. A trombina, por sua vez, transforma o <b>fibrinogênio</b>, que é solúvel, em <b>fibrina</b>, que forma fios insolúveis. A rede de fibrina prende hemácias e plaquetas e forma o <b>coágulo</b>, que fecha o vaso até a cicatrização.</p>
<p>Várias proteínas da coagulação são feitas no <b>fígado</b> e dependem da <b>vitamina K</b>, produzida em parte por bactérias do intestino (por isso os recém-nascidos recebem uma dose ao nascer). Na <b>hemofilia</b>, falta um dos fatores da coagulação (o fator VIII, na forma mais comum), e pequenos ferimentos sangram muito; é uma doença genética <b>recessiva ligada ao cromossomo X</b>, muito mais comum em homens. Alguns remédios agem sobre a coagulação: a <b>heparina</b> e os anticoagulantes que bloqueiam a vitamina K evitam tromboses, e o ácido acetilsalicílico (AAS) dificulta a agregação das plaquetas, e por isso <b>não deve ser usado em suspeita de dengue</b>. O líquido que sobra depois que o sangue coagula é o <b>soro</b>: plasma sem o fibrinogênio.</p>
<p>Mova a faixa do tempo para seguir as quatro etapas e use os botões para ver o que acontece quando falta uma peça.</p>`,
    kv: [['Protrombina', 'vira trombina (com Ca²⁺ e tromboplastina)'], ['Fibrinogênio', 'vira fibrina (pela trombina)'], ['Vitamina K', 'fatores feitos no fígado'], ['Hemofilia', 'recessiva ligada ao X'], ['Soro', 'plasma sem fibrinogênio']],
    enem: 'A sequência cobrada: <b>protrombina vira trombina</b> (com cálcio e tromboplastina) e <b>fibrinogênio vira fibrina</b>, que forma a rede do coágulo. Fatores que atrapalham: falta de <b>vitamina K</b> (proteínas da coagulação feitas no fígado), <b>hemofilia</b> (herança ligada ao X) e <b>AAS</b> (por isso é contraindicado na <b>dengue</b>). <b>Soro</b> é o plasma sem fibrinogênio; <b>plasma</b> é a parte líquida do sangue ainda capaz de coagular.',
    links: [['Plasma e células do sangue', '#sangue/elementos'], ['Hemofilia na Genética', '../genetica/index.html#sexo/hemofilia']],
    draw(t, S) {
      const A = area(), m = S.modo == null ? null : MODOS[S.modo];
      if (S.vLast != null && S.v !== S.vLast && S.touch) S.user = true;   // mexeu na faixa: a animação para de andar sozinha
      S.vLast = S.v;
      const v = S.v, E = estadoCoag(v, m), et = etapa(v);
      // ---- layout: vaso em cima, cascata embaixo ----
      const casH = NAR ? 3 * 40 + 8 : 96;
      const vy0 = A.y0 + (NAR ? 4 : 8), vy1 = A.y1 - casH - (NAR ? 34 : 40);
      const wall = Math.max(10, (vy1 - vy0) * .1), tissH = (vy1 - vy0) * .26;
      const yT = vy0 + wall, yB = vy1 - tissH - wall, lh = yB - yT;
      const cx = A.cx, gw = Math.min(lh * .42, A.w * .09);
      const pinch = x => E.contr * lh * .17 * Math.exp(-(((x - cx) / (A.w * .2)) ** 2));
      // tecido em volta (conjuntivo) e luz do vaso
      X.save(); X.beginPath(); X.rect(A.x0, vy0 - 4, A.w, vy1 - vy0 + 4); X.clip();
      rr(A.x0, yB + wall, A.w, tissH + 4, 0, rgba(K('he_rosa'), .14));
      X.fillStyle = rgba(K('sangue'), .16); X.fillRect(A.x0, yT, A.w, lh);
      const N = 48, top = [], bot = [];
      for (let i = 0; i <= N; i++) { const x = A.x0 + A.w * i / N; top.push([x, yT + pinch(x)]); bot.push([x, yB - pinch(x)]); }
      // parede de cima
      shape([[A.x0, vy0], ...top, [A.x1, vy0]], rgba(K('he_rosa'), .75), 'rgba(11,15,28,.5)', 1);
      // parede de baixo com a lesão (abertura no meio)
      const lesion = v >= 5, g = lesion ? gw : 0;
      const L1 = bot.filter(p => p[0] <= cx - g), L2 = bot.filter(p => p[0] >= cx + g);
      if (L1.length) shape([...L1, [L1[L1.length - 1][0], yB + wall], [A.x0, yB + wall]], rgba(K('he_rosa'), .75), 'rgba(11,15,28,.5)', 1);
      if (L2.length) shape([[L2[0][0], yB + wall], ...L2, [A.x1, yB + wall]], rgba(K('he_rosa'), .75), 'rgba(11,15,28,.5)', 1);
      // núcleos do endotélio e da parede
      for (let x = A.x0 + 30; x < A.x1; x += 70) { NUC(x, yT + pinch(x) - wall * .35, wall * .55, wall * .2, 0, { seed: x | 0 }); if (Math.abs(x - cx) > g + 12) NUC(x + 35, yB - pinch(x + 35) + wall * .35, wall * .55, wall * .2, 0, { seed: x + 3 | 0 }); }
      // sangue correndo: hemácias e plaquetas (andam mais devagar se o vaso fecha)
      const R0 = rng(5), sp = .08 * (1 - .4 * E.contr);
      for (let i = 0; i < 46; i++) {
        const ph = R0(), yy = R0(), x = A.x0 - 20 + fr(ph + t * sp * (.8 + .4 * yy)) * (A.w + 40), half = lh / 2 - pinch(x) - 6;
        const y = (yT + yB) / 2 + (yy - .5) * 2 * half * .85;
        ell(x, y, lh * .055, lh * .04, .3 * Math.sin(i), K('hemacia'), 'rgba(90,20,30,.55)', 1);
      }
      for (let i = 0; i < 14; i++) { const ph = R0(), yy = R0(), x = A.x0 + fr(ph + t * sp) * A.w, half = lh / 2 - pinch(x) - 4; plaqueta(x, (yT + yB) / 2 + (yy - .5) * 1.7 * half, lh * .022, i); }
      // vazamento pela lesão
      if (lesion && E.leak > .02) {
        const R1 = rng(9);
        for (let i = 0; i < 26; i++) {
          const ph = R1(), dx = (R1() - .5), q = fr(ph + t * .35), x = cx + dx * g * 1.4 + dx * q * tissH * 1.6, y = yB + q * (tissH + wall);
          X.save(); X.globalAlpha = E.leak * (1 - q * .6); ell(x, y, lh * .05, lh * .036, dx, K('hemacia'), 'rgba(90,20,30,.55)', 1); X.restore();
        }
      }
      // tampão de plaquetas
      if (E.plug > .01) {
        const R2 = rng(13), n = Math.round(E.plug * 30);
        for (let i = 0; i < n; i++) { const x = cx + (R2() - .5) * g * 2.1, y = yB - lh * .1 + R2() * (wall + lh * .14); plaqueta(x, y, lh * .03, i); }
      }
      // rede de fibrina que prende hemácias
      if (E.fib > .01) {   // (na hemofilia a rede fica rala: E.fib ≤ 0,25)
        X.save(); X.globalAlpha = E.fib;
        const R3 = rng(21);
        for (let i = 0; i < 8; i++) { const x = cx + (R3() - .5) * g * 1.8, y = yB - lh * .06 + R3() * (wall + lh * .06); hemacia(x, y, lh * .045); }
        for (let i = 0; i < 16; i++) { const x1 = cx + (R3() - .5) * g * 2.6, y1 = yB - lh * .16 + R3() * (wall + lh * .22), a = R3() * PI, L = g * (.8 + R3()); line(x1 - Math.cos(a) * L / 2, y1 - Math.sin(a) * L / 2, x1 + Math.cos(a) * L / 2, y1 + Math.sin(a) * L / 2, FIBRINA, 1.6); }
        X.restore();
      }
      X.restore();
      // rótulos do vaso
      if (!NAR) lab(A.x0 + A.w * .16, yT - wall * .4, A.x0 + A.w * .1, vy0 - 2, 'parede do vaso');
      if (lesion && et <= 1) lab(cx, yB + wall * .5, cx + A.w * .16, yB + wall + tissH * .5, 'lesão');
      if (E.plug > .4) lab(cx - g * .5, yB, cx - A.w * .2, yB + wall + tissH * .55, 'tampão de plaquetas');
      if (E.fib > .4) lab(cx + g * .3, yB - lh * .05, cx + A.w * .2, yT + lh * .3, 'rede de fibrina');
      // situação do sangramento
      const st = !lesion ? 'vaso íntegro' : E.leak < .05 ? 'o sangramento parou' : v >= 99 ? 'o sangramento continua' : E.leak > .75 ? 'sangramento forte' : 'sangramento diminuindo';
      const yS = vy1 + (NAR ? 16 : 20);
      tx(st, A.x0 + 4, yS, { s: 13, w: 700, a: 'left', c: E.leak < .05 && lesion ? '#8FE3A0' : lesion ? '#FF8A8A' : C.dim, bg: false });
      tx(NAR ? (m ? m.t : et ? 'etapa ' + et : 'antes da lesão') : m ? 'e se: ' + (m.k === 'vitk' ? 'faltar vitamina K' : m.k === 'hemo' ? 'hemofilia' : m.k === 'aas' ? 'tomar AAS' : 'faltar cálcio') : ETAPAS[et], A.x1 - 4, yS, { s: 13, w: 600, a: 'right', c: m ? '#FFB347' : C.dim, bg: false });
      // ---- cascata em três degraus ----
      const D = [
        { a: 'tromboplastina + Ca²⁺', b: 'tromboplastina das plaquetas e do tecido lesado; Ca²⁺ do plasma' },
        { a: 'protrombina vira trombina', b: 'proteína do fígado, depende da vitamina K' },
        { a: 'fibrinogênio vira fibrina', b: 'fios insolúveis formam a rede' }];
      const cy0 = A.y1 - casH;
      const falha = m ? m.falha : -1;
      D.forEach((d, i) => {
        const on = E.c[i], failed = falha === i && v >= 50 + i * 8;
        let x, y, w, h;
        if (NAR) { x = A.x0 + 22; w = A.w - 22; h = 34; y = cy0 + i * 40; }
        else { const gap = 34; w = (A.w - 2 * gap) / 3; h = casH - 8; x = A.x0 + i * (w + gap); y = cy0; }
        const bc = failed ? '#FF6B6B' : on > .99 ? '#FFB347' : C.line;
        rr(x, y, w, h, 10, on > 0 ? `rgba(60,44,20,${.3 + .5 * on})` : PAINEL, bc, failed || on > .99 ? 2 : 1);
        if (NAR) {
          tx(String(i + 1), A.x0 + 8, y + h / 2, { s: 13, w: 700, f: FD, c: C.dim, bg: false });
          tx(d.a, x + 10, y + h / 2, { s: 13, w: 700, a: 'left', c: on > 0 ? C.txt : C.dim, bg: false });
          if (failed) tx('falha', x + w - 10, y + h / 2, { s: 12, w: 700, a: 'right', c: '#FF8A8A', bg: false });
          if (i < 2) arrow(A.x0 + 8, y + h / 2 + 9, A.x0 + 8, y + h + 4, C.dim, 1.2);
        } else {
          tx(`degrau ${i + 1}`, x + 12, y + 16, { s: 12, w: 600, f: FD, a: 'left', c: C.dim, bg: false });
          if (failed) tx('falha', x + w - 12, y + 16, { s: 12, w: 700, a: 'right', c: '#FF8A8A', bg: false });
          tx(d.a, x + 12, y + 40, { s: 14, w: 700, a: 'left', c: on > 0 ? C.txt : C.dim, bg: false });
          wrapTx(d.b, x + 12, y + 62, w - 24, { s: 12, a: 'left', c: C.dim, lh: 15 });
          if (i === 0 && on > 0) tok(x + w - 30, y + 40, 'Ca²⁺', K('ca'), { a: m && m.k === 'ca' ? .25 : 1 });
          if (i < 2) arrow(x + w + 5, y + h / 2, x + w + 29, y + h / 2, E.c[i + 1] > 0 ? '#FFB347' : C.dim, 1.6);
        }
      });
      cap(m && v >= (m.k === 'aas' ? 25 : 50) ? m.nota
        : et === 0 ? 'Sangue correndo num vaso íntegro. Mova a faixa do tempo para abrir uma lesão.'
        : et === 1 ? 'Etapa 1: o vaso lesado se contrai e o sangramento diminui.'
        : et === 2 ? 'Etapa 2: as plaquetas grudam na parede lesada e umas nas outras e formam um <b>tampão</b> provisório.'
        : et === 3 ? 'Etapa 3: com Ca²⁺ e tromboplastina, a <b>protrombina</b> vira <b>trombina</b>; a trombina transforma o <b>fibrinogênio</b> em <b>fibrina</b>.'
        : 'Etapa 4: os fios de <b>fibrina</b> tecem uma rede que prende hemácias e plaquetas. O coágulo fecha o vaso.');
    }
  });

  // =====================================================================================
  // MUSCULAR 1 TRÊS TECIDOS MUSCULARES
  // =====================================================================================
  const MT = [
    { k: 'esq', n: 'Estriado esquelético', o: 'braço', l1: 'muitos núcleos, na periferia', l2: 'com estrias', l3: 'voluntário: rápido, forte, cansa', m: 'muitos núcleos periféricos, estrias, voluntário' },
    { k: 'card', n: 'Estriado cardíaco', o: 'coração', l1: '1 ou 2 núcleos centrais', l2: 'estrias e discos intercalares', l3: 'involuntário: rítmico, não cansa', m: '1 ou 2 núcleos centrais, discos, involuntário' },
    { k: 'liso', n: 'Liso', o: 'intestino', l1: '1 núcleo central, célula fusiforme', l2: 'sem estrias', l3: 'involuntário: lento e duradouro', m: '1 núcleo central, sem estrias, involuntário' }
  ];
  const ctlM1 = { l: 'Zoom', min: 0, max: 2, step: .05, v: 0, f: v => v < .5 ? 'órgão' : v < 1.5 ? 'tecido' : 'célula', rate: () => 1 };
  // contração do esquelético: espasmo curto depois do comando
  const espasmo = d => d < 0 || d > 1 ? 0 : d < .12 ? ss(d / .12) : 1 - ss((d - .12) / .5);
  // ícones dos órgãos
  function iconeBraco(cx, cy, s, c) {
    // úmero e antebraço em ângulo, músculo (bíceps) fusiforme preso por tendões
    const ox = cx - s * .55, oy = cy - s * .35, ex = cx + s * .25, ey = cy + s * .35, hx2 = cx + s * .75, hy2 = cy - s * .25;
    line(ox, oy, ex, ey, '#EDE3D1', s * .12); line(ex, ey, hx2, hy2, '#EDE3D1', s * .1);
    circ(ox, oy, s * .1, '#EDE3D1'); circ(ex, ey, s * .09, '#EDE3D1');
    const mx = (ox + ex) / 2 - s * .02, my = (oy + ey) / 2 - s * .2;
    line(ox + s * .1, oy - s * .02, mx - s * .25, my, '#F4F1EC', 2); line(mx + s * .25, my + s * .05, ex + s * .12, ey - s * .1, '#F4F1EC', 2);
    ell(mx, my, s * .3, s * .14, Math.atan2(ey - oy, ex - ox) - .1, c, 'rgba(11,15,28,.5)', 1.2);
  }
  function iconeCoracao(cx, cy, s, c) {
    X.beginPath(); X.moveTo(cx, cy + s * .55);
    X.bezierCurveTo(cx - s * .9, cy - s * .05, cx - s * .45, cy - s * .7, cx, cy - s * .28);
    X.bezierCurveTo(cx + s * .45, cy - s * .7, cx + s * .9, cy - s * .05, cx, cy + s * .55);
    X.fillStyle = c; X.fill(); X.strokeStyle = 'rgba(11,15,28,.5)'; X.lineWidth = 1.2; X.stroke();
    line(cx - s * .1, cy - s * .32, cx - s * .14, cy - s * .62, '#C7485C', s * .1); line(cx + s * .12, cy - s * .3, cx + s * .2, cy - s * .58, '#6F8CFF', s * .1);
  }
  function iconeIntestino(cx, cy, s, c) {
    X.beginPath();
    for (let i = 0; i <= 60; i++) { const u = i / 60, x = cx - s * .7 + u * s * 1.4, y = cy + Math.sin(u * TAU * 1.5) * s * .28 + (u - .5) * s * .2; i ? X.lineTo(x, y) : X.moveTo(x, y); }
    X.strokeStyle = 'rgba(11,15,28,.55)'; X.lineWidth = s * .26; X.lineCap = 'round'; X.stroke();
    X.strokeStyle = c; X.lineWidth = s * .2; X.stroke(); X.lineCap = 'butt';
  }
  // célula fusiforme (liso): duas curvas entre as pontas
  function fuso(x0, x1, y, h, f, s) { X.beginPath(); X.moveTo(x0, y); X.quadraticCurveTo((x0 + x1) / 2, y - h, x1, y); X.quadraticCurveTo((x0 + x1) / 2, y + h, x0, y); X.closePath(); X.fillStyle = f; X.fill(); if (s) { X.strokeStyle = s; X.lineWidth = 1; X.stroke(); } }
  // estrias transversais dentro de um retângulo já recortado
  function estrias(x0, x1, y0, y1, per, c) { for (let x = x0; x < x1; x += per) { X.fillStyle = c; X.fillRect(x, y0, per * .45, y1 - y0); } }

  function tecidoMusc(T, bx, by, bw, bh, z, t, S) {
    const k = (Math.min(bw, NAR ? 9999 : bw) / 220) * lerp(.42, 1, ss(z - 1)), foco = ss(z - 1), aO = 1 - .78 * foco;   // px por µm
    const salm = K('musc'), escura = dark(salm, .25), clara = light(salm, .2);
    const midY = by + bh / 2;
    const hits = [];
    X.save(); X.beginPath(); X.rect(bx, by, bw, bh); X.clip();
    if (T.k === 'esq') {
      const tw0 = S.twT == null ? -1 : S.clk - S.twT, c = espasmo(tw0);
      const D = 40 * k, gap = 5 * k, step = D + gap;
      const n0 = Math.ceil((bh / 2) / step) + 1;
      for (let j = -n0; j <= n0; j++) {
        const yc = midY + j * step, isF = j === 0, a = isF ? 1 : aO;
        X.save(); X.globalAlpha *= a;
        const xStart = isF ? lerp(bx - 20, bx + 16, foco) + c * bw * .06 : bx - 20, x1 = bx + bw + 20;
        const hh = D * (1 + .12 * c);
        rr(xStart, yc - hh / 2, x1 - xStart, hh, Math.min(hh / 2, 10), clara, 'rgba(11,15,28,.45)', 1);
        X.save(); X.beginPath(); X.rect(xStart, yc - hh / 2, x1 - xStart, hh); X.clip();
        estrias(xStart + 4, x1, yc - hh / 2, yc + hh / 2, Math.max(4, 2.5 * k) * (1 - .2 * c), rgba(escura, .7));
        X.restore();
        for (let q = 0; xStart + 14 + q * 22 * k < x1; q++) {           // núcleos alongados logo abaixo da membrana
          const nx = xStart + 14 * k + q * 22 * k + (j % 2) * 8 * k, top = q % 2 === 0;
          NUC(nx, yc + (top ? -1 : 1) * (hh / 2 - 3.2 * k), 5.5 * k, 2.2 * k, 0, { seed: q + j * 7 + 30 });
        }
        X.restore();
      }
      if (foco > .6) {
        X.save(); X.globalAlpha = seg(foco, .6, 1);
        const ax = bx + bw - 8, ay = midY;
        const yc2 = midY + D * (1 + .12 * c) / 2 + 12;   // embaixo da fibra, longe dos rótulos de cima
        tx('continua', ax - 34, yc2, { s: 12, w: 700, a: 'right', c: C.txt });
        arrow(ax - 30, yc2, ax, yc2, C.txt, 1.5);
        X.restore();
        hits.push(['núcleo na periferia', bx + 16 + c * bw * .06 + 14 * k + 22 * k * 2, midY - D * (1 + .12 * c) / 2 + 3.2 * k, -1]);
        if (!NAR) hits.push(['estrias', bx + bw * .55, midY + D * .25, 1]);
      }
      if (tw0 >= 0 && tw0 < .8) tx('contraiu', bx + bw / 2, by + 12, { s: 12, w: 700, c: '#FFB347' });
    } else if (T.k === 'card') {
      const per = 1, ph = S.clk / per;   // cerca de 60 batidas por minuto, dentro do ritmo de repouso
      const L = 100 * k, D = 15 * k, gapY = 9 * k, stepY = D + gapY;
      const n0 = Math.ceil((bh / 2) / stepY) + 1;
      for (let j = -n0; j <= n0; j++) {
        const yc = midY + j * stepY, off = (j & 1) ? L / 2 : 0, isRow = j === 0;
        for (let x = bx - L - off % L; x < bx + bw + L; x += L) {
          const isF = isRow && x <= bx + bw / 2 && x + L > bx + bw / 2, a = isF ? 1 : aO;
          // onda: a batida atravessa os discos intercalares, da esquerda para a direita
          const w = fr(ph - (x - bx) / (bw * 2.2)), c = w < .25 ? Math.sin(w / .25 * PI) : 0;
          X.save(); X.globalAlpha *= a;
          const hh = D * (1 + .14 * c);
          rr(x + 1, yc - hh / 2, L - 2, hh, Math.min(4, hh / 2), c > .1 ? light(salm, .2 + .25 * c) : clara, 'rgba(11,15,28,.45)', 1);
          X.save(); X.beginPath(); X.rect(x + 1, yc - hh / 2, L - 2, hh); X.clip(); estrias(x + 3, x + L - 2, yc - hh / 2, yc + hh / 2, Math.max(4, 2.5 * k) * (1 - .15 * c), rgba(escura, .6)); X.restore();
          // disco intercalar: traço escuro em degraus na ponta da célula
          poly([[x + L - 1, yc - hh / 2], [x + L - 1, yc - hh * .1], [x + L + 2, yc - hh * .1], [x + L + 2, yc + hh * .2], [x + L - 1, yc + hh * .2], [x + L - 1, yc + hh / 2]], '#3A1630', Math.max(1.5, 1.8 * k));
          // ramificação: algumas células se ligam à fileira de baixo
          // (em Y: sai do corpo da célula, com a mesma cor e estrias, e termina num disco intercalar na fileira de baixo)
          if (((x / L | 0) + j) % 3 === 0) {
            const yb0 = yc + hh / 2 - 2, yb1 = yc + stepY - D / 2 + 1;
            const br = [[x + L * .5, yb0], [x + L * .72, yb0], [x + L * .86, yb1], [x + L * .64, yb1]];
            shape(br, c > .1 ? light(salm, .2 + .25 * c) : clara, 'rgba(11,15,28,.35)', 1);
            X.save(); shape(br); X.clip(); estrias(x + L * .5, x + L * .86, yb0, yb1, Math.max(4, 2.5 * k), rgba(escura, .6)); X.restore();
            line(x + L * .64, yb1, x + L * .86, yb1, '#3A1630', Math.max(1.5, 1.8 * k));                   // disco intercalar com a célula de baixo
          }
          NUC(x + L / 2, yc, 6 * k, 2.8 * k, 0, { seed: (x | 0) + j });
          if (((x / L | 0) + j) % 4 === 1) NUC(x + L / 2 + 13 * k, yc, 5 * k, 2.5 * k, 0, { seed: (x | 0) + j + 1 });
          X.restore();
          if (isF && foco > .6) { hits.push(['disco intercalar', x + L, yc + hh * .05, 1]); hits.push(['núcleo central', x + L / 2, yc, -1]); }
        }
      }
    } else {
      const P = 6;   // onda lenta, como a peristalse
      const L = 200 * k, D = 8 * k, stepY = D * 1.25;
      const n0 = Math.ceil((bh / 2) / stepY) + 1;
      for (let j = -n0; j <= n0; j++) {
        const yc = midY + j * stepY, off = ((j * 37) % 100) / 100 * L, isRow = j === 0;
        for (let x = bx - L - off; x < bx + bw + L; x += L * .92) {
          const mx = x + L / 2, isF = isRow && Math.abs(mx - (bx + bw / 2)) <= L * .46, a = isF ? 1 : aO;
          const c = .5 + .5 * Math.sin(TAU * ((mx - bx) / (bw * 1.6) - S.clk / P));
          X.save(); X.globalAlpha *= a;
          const sh = 1 - .12 * c;   // a célula encurta e engrossa
          fuso(mx - L / 2 * sh, mx + L / 2 * sh, yc, D * (1 + .45 * c), clara, 'rgba(11,15,28,.4)');
          NUC(mx, yc, 9 * k * sh, 1.8 * k * (1 + .3 * c), 0, { seed: (x | 0) + j * 3 });
          X.restore();
          if (isF && foco > .6) { hits.push(['núcleo central', mx, yc, -1]); if (!NAR) hits.push(['célula fusiforme', mx + L * .32 * sh, yc, 1]); }
        }
      }
    }
    X.restore();
    return hits;
  }

  def('muscular', 'tipos', {
    t: 'Três tecidos musculares', s: 'liso, estriado esquelético e estriado cardíaco', c: K('musc'), loc: 'Cortes longitudinais, na mesma escala', still: 1, stillV: 2,
    ctl: ctlM1,
    alt: 'Três painéis em corte longitudinal, na mesma escala: estriado esquelético com fibras longas, muitos núcleos na periferia e estrias; estriado cardíaco com células ramificadas, núcleo central e discos intercalares; liso com células fusiformes de um núcleo central e sem estrias. A faixa vai do órgão à célula; o botão Contrair faz o esquelético se contrair',
    extra: [{ t: 'Contrair', on: S => { S.twT = S.clk || 0; }, pressed: () => false }],
    d: `<p>O tecido muscular é feito de células alongadas, as <b>fibras musculares</b>, especializadas em <b>contração</b>. Elas têm muitas proteínas contráteis (actina e miosina) e muitas mitocôndrias. Os nomes mudam: a membrana é o <b>sarcolema</b>, o citoplasma é o <b>sarcoplasma</b> e o retículo endoplasmático liso é o <b>retículo sarcoplasmático</b>. Os três tipos vêm da <b>mesoderme</b> (ver <a href="#tecidos/visao">Os quatro tecidos</a>).</p>
<p>O <b>estriado esquelético</b> forma os músculos presos aos ossos. Suas fibras são enormes: cada uma vem da fusão de muitas células embrionárias, então tem <b>muitos núcleos</b>, que ficam <b>na periferia</b>, logo abaixo da membrana. Ao microscópio, mostram <b>estrias transversais</b>, faixas claras e escuras. A contração é <b>voluntária</b>, rápida e forte, e cansa. O <b>estriado cardíaco</b> forma o miocárdio. Também tem estrias, mas as células são menores, <b>ramificadas</b>, com <b>1 ou 2 núcleos centrais</b>, e se ligam pelos <b>discos intercalares</b>, que têm junções comunicantes por onde o sinal elétrico passa direto de uma célula para outra. Assim o coração se contrai como um bloco. A contração é <b>involuntária</b>, rítmica e não cansa: o próprio coração gera o ritmo, no nó sinoatrial, cerca de 60 a 100 vezes por minuto em repouso.</p>
<p>O <b>liso</b> fica na parede dos órgãos ocos e dos vasos: estômago, intestino, bexiga, útero, artérias, além da íris e dos músculos que arrepiam os pelos. As células são <b>fusiformes</b>, com <b>1 núcleo central</b>, e <b>não têm estrias</b>, porque a actina e a miosina não estão alinhadas em fileiras. A contração é <b>involuntária</b>, lenta e duradoura, como nos movimentos peristálticos do intestino. A capacidade de se regenerar também é diferente: o liso se regenera bem; o esquelético, de forma limitada, a partir das células-satélite; e o cardíaco praticamente não se regenera, e por isso a área morta num infarto vira uma cicatriz de tecido conjuntivo.</p>
<div class="tab"><table><thead><tr><th></th><th>Estriado esquelético</th><th>Estriado cardíaco</th><th>Liso</th></tr></thead><tbody>
<tr><td>Forma da célula</td><td>cilíndrica, muito longa</td><td>cilíndrica, ramificada</td><td>fusiforme</td></tr>
<tr><td>Tamanho</td><td>10 a 100 µm de diâmetro; até dezenas de cm de comprimento</td><td>cerca de 15 µm × 85 a 100 µm</td><td>5 a 10 µm × 20 a 500 µm</td></tr>
<tr><td>Núcleos</td><td>muitos, periféricos</td><td>1 ou 2, centrais</td><td>1, central</td></tr>
<tr><td>Estrias</td><td>sim</td><td>sim</td><td>não</td></tr>
<tr><td>Junções especiais</td><td>não</td><td>discos intercalares</td><td>junções comunicantes</td></tr>
<tr><td>Controle</td><td>voluntário</td><td>involuntário (ritmo próprio)</td><td>involuntário</td></tr>
<tr><td>Contração</td><td>rápida, forte, cansa</td><td>rítmica, não cansa</td><td>lenta, duradoura</td></tr>
<tr><td>Regeneração</td><td>limitada (células-satélite)</td><td>quase nenhuma</td><td>boa</td></tr>
</tbody></table></div>
<p>Fonte do quadro: Junqueira e Carneiro, cap. 10. Mova a faixa do órgão até a célula e toque em Contrair: só o esquelético obedece ao comando; o cardíaco e o liso se contraem sozinhos.</p>`,
    enem: 'O quadro de comparação é o que mais cai: <b>esquelético</b> = voluntário, multinucleado, núcleos periféricos, com estrias; <b>cardíaco</b> = involuntário, estriado, 1 ou 2 núcleos centrais, <b>discos intercalares</b>; <b>liso</b> = involuntário, sem estrias, 1 núcleo central, fusiforme. E a ligação com saúde: o músculo cardíaco <b>não se regenera</b>, e por isso o infarto deixa cicatriz.',
    links: [['O sarcômero', '#muscular/sarcomero'], ['Tendões no conjuntivo', '#conjuntivo/propriamente']],
    drag(x, y, S) {
      if (!toque(S)) return null;
      const b = S.boxEsq; if (b && x >= b[0] && x <= b[0] + b[2] && y >= b[1] && y <= b[1] + b[3]) S.twT = S.clk || 0;
      return null;
    },
    draw(t, S) {
      S.clk = (S.clk || 0) + S.dt;
      const A = area(), z = autoUma(S, t, ctlM1, 6), gap = NAR ? 10 : 16;
      const all = [];
      MT.forEach((T, i) => {
        let px, py, pw, ph;
        if (NAR) { pw = A.w; ph = (A.h - 2 * gap) / 3; px = A.x0; py = A.y0 + i * (ph + gap); }
        else { pw = (A.w - 2 * gap) / 3; ph = A.h; px = A.x0 + i * (pw + gap); py = A.y0; }
        rr(px, py, pw, ph, 12, PAINEL, C.line, 1);
        const headH = NAR ? 22 : 34, footH = NAR ? 20 : 64;
        // título e ícone do órgão
        if (NAR) {
          tx(T.n, px + 10, py + 12, { f: FH, s: 14, w: 600, a: 'left', c: C.txt, bg: false });
          tx(T.o, px + pw - 10, py + 12, { s: 12, a: 'right', c: C.dim, bg: false });
        } else {
          tx(T.n, px + pw / 2, py + 20, { f: FH, s: 16, w: 600, c: C.txt, bg: false });
        }
        const bx = px + 6, by = py + headH, bw = pw - 12, bh = ph - headH - footH;
        if (i === 0) S.boxEsq = [px, py, pw, ph];
        // órgão (some com o zoom) e tecido (aparece)
        const aOrg = 1 - ss(z / .9), aTec = ss((z - .15) / .7);
        if (aOrg > .01) {
          X.save(); X.globalAlpha = aOrg;
          const s = Math.min(bw, bh) * (NAR ? .42 : .36) * (1 + z * .6), cx = bx + bw / 2, cy = by + bh / 2;
          (i === 0 ? iconeBraco : i === 1 ? iconeCoracao : iconeIntestino)(cx, cy, s, K('musc'));
          if (!NAR) tx(T.o, cx, by + bh - 12, { s: 13, w: 600, c: C.dim, bg: false });
          X.restore();
        }
        if (aTec > .01) {
          X.save(); X.globalAlpha = aTec;
          const h = tecidoMusc(T, bx, by, bw, bh, cl(z, 1, 2), t, S);
          X.restore();
          if (aTec > .9) h.forEach(q => all.push([q, bx, by, bw, bh]));
          // barra de escala (mesma nos três painéis)
          if (z > 1.2 && !NAR) {
            const k = (bw / 220) * lerp(.42, 1, ss(z - 1)), L = 50 * k, sx = bx + 8, sy = by + bh - 8;
            line(sx, sy, sx + L, sy, C.txt, 2); tx('50 µm', sx + L + 6, sy, { s: 12, f: FD, a: 'left', c: C.txt });
          }
        }
        // propriedades
        if (NAR) tx(T.m, px + 10, py + ph - 10, { s: 12, a: 'left', c: C.dim, bg: false });
        else [T.l1, T.l2, T.l3].forEach((l, q) => tx(l, px + 12, py + ph - footH + 14 + q * 18, { s: 13, w: q === 2 ? 600 : 400, a: 'left', c: q === 2 ? C.txt : C.dim, bg: false }));
      });
      // rótulos: um por tipo primeiro, depois os outros (o motor limita a 5 no celular e 8 no computador)
      const ord = all.filter((_, i) => true).sort((a, b) => (a[0][0] === 'estrias' || a[0][0] === 'célula fusiforme') - (b[0][0] === 'estrias' || b[0][0] === 'célula fusiforme'));
      for (const [q, bx, by, bw, bh] of ord) {
        const [s, x, y, dir] = q;
        const ty = dir < 0 ? by + 14 : by + bh - 14;
        lab(x, y, cl(x + (NAR ? 30 : 10), bx + 10, bx + bw - 10), ty, s);
      }
      cap(z < .5 ? 'Os três tecidos musculares e onde estão: músculos do braço, coração e parede do intestino. Mova a faixa para aproximar.'
        : z < 1.5 ? 'Tecido: fibras paralelas no esquelético, células ramificadas no cardíaco, células fusiformes sobrepostas no liso.'
        : 'Toque em <b>Contrair</b>: só o esquelético obedece (voluntário). O cardíaco bate sozinho, com a onda passando pelos discos intercalares, e o liso faz ondas lentas.');
    }
  });
}
