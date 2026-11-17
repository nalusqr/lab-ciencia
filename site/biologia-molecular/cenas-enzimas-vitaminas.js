/* LAB · Módulo Biologia Molecular. Cenas das seções ENZIMAS ('enz') e VITAMINAS ('vit'). Dono: Prometeu; cenas de enzimas refeitas pelo Dry.
   Usa a API do motor.js (Apolo): def(seção, id, {t, s, c, loc, alt, d, kv, enem, links, ctl, still, drag, draw(t, S)}),
   escolha(), area(), graph(), cap() e as primitivas de desenho; enz/encaixe usa o MOL3D do Martin (mol3d.js).
   Tudo o que é meu fica dentro do IIFE abaixo; no nível de topo só há chamadas a def(). Sem dependências; abre por file://.
   Nunca escrever "<" seguido de "/script" neste arquivo (pode ser embutido inline numa prévia). */
'use strict';
(() => {
  // ---------- cores próprias (as de classe vêm do motor: C.enz, C.vit) ----------
  const SUB = '#F7C13B', PRO = '#F06AAE', INI = '#FF6B7D', ALO = '#4FB8E6', OK = '#7FE0A2', AMB = '#FFB347';
  const ENZ = C.enz, VITC = C.vit;
  const pct = v => Math.round(v) + '%';
  const h01 = n => fr(Math.sin(n * 127.1 + 311.7) * 43758.5453);
  const eo = x => 1 - Math.pow(1 - cl(x, 0, 1), 4);              // saída suave, como o --e-out do padrão de motion
  const ent = (t, a, b) => eo(seg(t, a, b));
  const mixc = (c1, c2, k) => { const a = hx(c1), b = hx(c2); return '#' + [0, 1, 2].map(i => Math.round(lerp(a[i], b[i], k)).toString(16).padStart(2, '0')).join(''); };
  // entrada coreografada de todo gráfico: quadro, depois curvas, depois textos (ph só avança fora do Pausar)
  const entrada = t => ({ a: ent(t, 0, .45), sc: 1.03 - .03 * ent(t, 0, .9), cur: ent(t, .12, 1.05), med: ent(t, 1, 1.6), txt: ent(t, .8, 1.35) });

  // ---------- hotspots em HTML sobre o #cv (mesmo padrão da cadeia respiratória) ----------
  const HOT = (() => {
    let host = null, tip = null, key = null, born = 0, pin = null, hov = null, foc = null, items = [], btns = {}, lastUse = 0, idleT = 0, tipId = null;
    const reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const CSS = `.ev-host{position:absolute;inset:0;pointer-events:none;z-index:2}.ev-host[hidden]{display:none}
.ev-hs{position:absolute;width:44px;height:44px;padding:0;margin:0;border:0;background:transparent;border-radius:50%;cursor:pointer;pointer-events:auto;opacity:0;transform:scale(.6);transition:opacity .16s cubic-bezier(.16,1,.3,1),transform .16s cubic-bezier(.16,1,.3,1)}
.ev-host.on .ev-hs{opacity:1;transform:scale(1)}
.ev-hs i{position:absolute;left:50%;top:50%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:rgba(255,255,255,.92);border:1.5px solid rgba(11,15,28,.65);transition:background .09s,transform .09s}
.ev-hs i::before{content:"";position:absolute;inset:-1.5px;border-radius:50%;border:1px solid rgba(255,255,255,.75);opacity:0}
.ev-host.on .ev-hs i::before{animation:evp 1.2s cubic-bezier(.16,1,.3,1) 2 .6s}
.ev-host.conv .ev-hs i::before{animation:evp 1.2s cubic-bezier(.16,1,.3,1) 1}
@keyframes evp{0%{opacity:.6;transform:scale(1)}100%{opacity:0;transform:scale(2.6)}}
.ev-hs:hover i,.ev-hs.ativo i{background:#FFB347;transform:scale(1.25)}
.ev-hs:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:-4px}
.ev-tip{position:absolute;padding:8px 12px;border-radius:12px;background:var(--pill,rgba(11,15,28,.92));border:1px solid var(--float-line,rgba(255,255,255,.16));color:var(--txt,#E8EDF7);font-size:14px;line-height:1.4;pointer-events:none;opacity:0;transform:translateY(4px);transition:opacity .16s cubic-bezier(.16,1,.3,1),transform .16s cubic-bezier(.16,1,.3,1)}
.ev-tip[hidden]{display:none}.ev-tip.on{opacity:1;transform:none}
.ev-tip b{display:block;font-size:15px;margin-bottom:2px;color:#fff}.ev-tip span{display:block;color:#D3DAEA;font-size:13px}
@media(max-width:699px){.ev-tip{font-size:13px;padding:6px 10px}.ev-tip b{font-size:14px}.ev-hs{width:40px;height:40px}}
@media (prefers-reduced-motion:reduce){.ev-hs,.ev-tip{transition:opacity .15s linear;transform:none}.ev-host.on .ev-hs i::before,.ev-host.conv .ev-hs i::before{animation:none}.ev-hs i::before{opacity:.7;inset:-2px}}`;
    function ensure() {
      if (host) return;
      const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
      host = document.createElement('div'); host.className = 'ev-host'; host.hidden = true; cv.parentElement.appendChild(host);
      tip = document.createElement('div'); tip.className = 'ev-tip'; tip.hidden = true; tip.setAttribute('aria-hidden', 'true'); tip.innerHTML = '<b></b><span></span>'; host.appendChild(tip);
      host.addEventListener('keydown', e => { if (e.key === 'Escape') { pin = hov = foc = null; e.stopPropagation(); } });
      document.addEventListener('click', e => { if (pin && !e.target.closest('.ev-hs')) pin = null; });
    }
    const use = () => { lastUse = performance.now(); };
    function mk(d, i) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'ev-hs'; b.dataset.id = d.id; b.innerHTML = '<i></i>'; b.style.transitionDelay = (i * 60) + 'ms';
      b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hov = d.id; use(); } });
      b.addEventListener('pointerleave', () => { if (hov === d.id) hov = null; });
      b.addEventListener('focus', () => { foc = d.id; use(); }); b.addEventListener('blur', () => { if (foc === d.id) foc = null; });
      b.addEventListener('click', e => { e.stopPropagation(); use(); pin = pin === d.id ? null : d.id; const q = b._d; if (q && q.go) q.go(); });
      host.appendChild(b); return b;
    }
    const act = () => pin || hov || foc;
    function clear() { if (host) { host.hidden = true; host.classList.remove('on'); } key = null; pin = hov = foc = null; items = []; }
    function set(k, list) {
      ensure(); host.hidden = false; const now = performance.now();
      if (k !== key) { key = k; born = now; pin = hov = foc = null; tipId = null; host.classList.remove('on', 'conv'); for (const id in btns) { btns[id].remove(); delete btns[id]; } }
      items = list; const ids = {};
      list.forEach((d, i) => {
        ids[d.id] = 1; const b = btns[d.id] || (btns[d.id] = mk(d, i)); b._d = d;
        const l = (d.x - (b.offsetWidth || 44) / 2).toFixed(1) + 'px', tp = (d.y - (b.offsetHeight || 44) / 2).toFixed(1) + 'px';
        if (b._l !== l) { b._l = l; b.style.left = l; } if (b._t !== tp) { b._t = tp; b.style.top = tp; }
        if (b._n !== d.n) { b._n = d.n; b.setAttribute('aria-label', d.n + ': ' + d.t); }
        const on = d.id === act(); if (b._on !== on) { b._on = on; b.classList.toggle('ativo', on); b.setAttribute('aria-pressed', d.id === pin); }
      });
      for (const id in btns) if (!ids[id]) { btns[id].remove(); delete btns[id]; if (pin === id) pin = null; }
      if ((reduz || now - born > 600) && !host.classList.contains('on')) { host.classList.add('on'); }
      if (!reduz && host.classList.contains('on') && now - Math.max(lastUse, born + 600) > 8000 && now - idleT > 8000) { idleT = now; host.classList.remove('conv'); void host.offsetWidth; host.classList.add('conv'); }
      const id = act(), d = list.find(q => q.id === id);
      if (!d) { if (!tip.hidden) { tip.hidden = true; tip.classList.remove('on'); } tipId = null; return; }
      if (tipId !== d.id + d.t) { tipId = d.id + d.t; tip.querySelector('b').textContent = d.n; tip.querySelector('span').textContent = d.t; }
      tip.hidden = false;
      const w = Math.min(NAR ? 220 : 280, W - 16); tip.style.width = w + 'px';
      const h = tip.offsetHeight || 70, abaixo = d.y - h - 30 < (NAR ? 44 : 56);
      const x = cl(d.x - w / 2, 8, W - w - 8); let y = abaixo ? d.y + 24 : d.y - h - 24; y = cl(y, NAR ? 44 : 56, H - h - 96);
      tip.style.left = x + 'px'; tip.style.top = y + 'px'; tip.style.setProperty('--ax', (d.x - x) + 'px'); tip.classList.add('on');
    }
    // foco: o resto da figura escurece sem desfoque e o ponto escolhido ganha um anel âmbar
    function veil() {
      const d = items.find(q => q.id === act()); if (!d) return;
      const g = X.createRadialGradient(d.x, d.y, 34, d.x, d.y, Math.max(W, H) * .6); g.addColorStop(0, 'rgba(11,15,28,0)'); g.addColorStop(1, 'rgba(11,15,28,.34)');
      X.fillStyle = g; X.fillRect(0, 0, W, H); circ(d.x, d.y, 15, null, AMB, 2.5);
    }
    return { set, clear, veil, restart() { key = null; } };
  })();
  const setCtl = v => { const r = $('ctlR'); if (!r) return; r.value = v; r.dispatchEvent(new Event('input', { bubbles: true })); };
  const aoSair = { init() { HOT.restart(); }, sair() { HOT.clear(); } };

  // ---------- desenhos próprios ----------
  // enzima: corpo arredondado com o sítio ativo em cima (centro do sítio em (cx, cy - s*.95)), agora com volume:
  // luz de cima à esquerda, sombra projetada, borda clara e fenda sombreada.
  // o.shape: 'tri' (fenda em V), 'u' (fenda arredondada que fecha com o.k), 'sq'; o.den: desnatura (0..1);
  // o.alo: inibidor no sítio alostérico deforma o sítio ativo (0..1); o.aloSite: desenha o sítio alostérico; o.trem: vibração (px)
  function enz_corpo(cx, cy, s, o = {}) {
    const k = o.k || 0, den = o.den || 0, alo = o.alo || 0, sh = o.shape || 'tri', t = o.t || 0, trem = o.trem || 0;
    const R = s, sw = R * .42, sd = R * .5, n = 72;
    const site = x0 => {
      const x = x0 - sw * .3 * alo, u = Math.abs(x) / (sw * (1 - .5 * alo)); if (u >= 1) return 0;
      if (sh === 'tri') return sd * (1 - u);
      if (sh === 'sq') return sd * (u < .75 ? 1 : (1 - u) / .25);
      return sd * Math.pow(1 - u * u, .6) * ((1 - k) * .5 + .5);
    };
    X.save(); X.translate(cx + (trem ? Math.sin(t * 31) * trem : 0), cy + (trem ? Math.cos(t * 27) * trem * .6 : 0)); const cleft = [], pts = [];
    for (let i = 0; i <= n * 2; i++) {
      const a = PI + i / n * PI; let x = Math.cos(a) * R * 1.15, y = Math.sin(a) * R * .95;
      if (y < 0) { const sv = site(x); y += sv * (Math.abs(y) / (R * .95)) ** 3; if (sv > .5) cleft.push([x, y]); }
      if (den) { y += Math.sin(x * .15 + t * 3 + i * .7) * R * .12 * den; x += Math.cos(y * .13 + i) * R * .1 * den; }
      pts.push([x, y]);
    }
    const body = () => { X.beginPath(); pts.forEach((q, i) => i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1])); X.closePath(); };
    body();
    const base = den ? mixc(ENZ, '#6E6A80', den * .7) : ENZ;
    X.shadowColor = 'rgba(0,0,0,.5)'; X.shadowBlur = R * .3; X.shadowOffsetY = R * .14; X.fillStyle = dark(base, .35); X.fill(); X.shadowColor = 'transparent'; X.shadowBlur = 0; X.shadowOffsetY = 0;
    const g = X.createRadialGradient(-R * .45, -R * .55, R * .1, -R * .1, -R * .1, R * 1.6);
    g.addColorStop(0, light(base, .5)); g.addColorStop(.35, base); g.addColorStop(1, dark(base, .5)); X.fillStyle = g; X.fill();
    X.save(); body(); X.clip(); // dobras da superfície e luz de recorte embaixo
    for (let j = 0; j < 4; j++) { X.beginPath(); X.ellipse(R * (-.7 + j * .5), R * (.2 + (j % 2) * .22), R * .5, R * .16, -.5 + j * .35, 0, TAU); X.strokeStyle = 'rgba(11,15,28,.16)'; X.lineWidth = R * .07; X.stroke(); }
    const rg = X.createLinearGradient(0, R * .3, 0, R); rg.addColorStop(0, 'rgba(120,200,255,0)'); rg.addColorStop(1, 'rgba(120,200,255,.2)'); X.fillStyle = rg; X.fillRect(-R * 1.3, R * .3, R * 2.6, R);
    X.restore();
    body(); X.strokeStyle = light(base, .55); X.lineWidth = 1.5; X.lineJoin = 'round'; X.stroke();
    if (cleft.length > 2) { X.beginPath(); cleft.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1])); X.strokeStyle = 'rgba(11,15,28,.55)'; X.lineWidth = R * .09; X.lineCap = 'round'; X.stroke(); X.beginPath(); cleft.forEach((p, i) => i ? X.lineTo(p[0], p[1] + R * .06) : X.moveTo(p[0], p[1] + R * .06)); X.strokeStyle = 'rgba(255,255,255,.18)'; X.lineWidth = 1.2; X.stroke(); }
    if (o.aloSite) { circ(R * .62, R * .55, R * .2, 'rgba(11,15,28,.55)', 'rgba(255,255,255,.35)', 1); }
    X.restore();
  }
  // substrato (ou inibidor) com a forma do sítio; desenhado com o topo em (x, y), com luz e sombra
  function enz_peca(x, y, s, sh, c, rot, a) {
    X.save(); if (a != null) X.globalAlpha *= a; X.translate(x, y); X.rotate(rot || 0); const sw = s * .42, sd = s * .5; X.beginPath();
    if (sh === 'tri') { X.moveTo(-sw, -sd * .2); X.lineTo(sw, -sd * .2); X.lineTo(0, sd * .8); X.closePath(); }
    else if (sh === 'sq') X.rect(-sw * .75, -sd * .2, sw * 1.5, sd);
    else if (sh === 'ini') { X.moveTo(-sw, -sd * .2); X.lineTo(-sw * .3, -sd * .2); X.arc(0, -sd * .2, sw * .3, PI, 0); X.lineTo(sw, -sd * .2); X.lineTo(0, sd * .8); X.closePath(); }
    else X.ellipse(0, sd * .3, sw * .92, sd * .62, 0, 0, TAU);
    X.shadowColor = 'rgba(0,0,0,.45)'; X.shadowBlur = s * .12; X.shadowOffsetY = s * .05;
    const g = X.createLinearGradient(-sw, -sd * .2, sw * .6, sd * .8); g.addColorStop(0, light(c, .4)); g.addColorStop(.5, c); g.addColorStop(1, dark(c, .35));
    X.fillStyle = g; X.fill(); X.shadowColor = 'transparent'; X.shadowBlur = 0; X.shadowOffsetY = 0; X.strokeStyle = 'rgba(11,15,28,.6)'; X.lineWidth = 1.2; X.stroke(); X.restore();
  }
  // pastilha de texto (com fundo escuro), alinhável
  function enz_pill(s, x, y, c, a) {
    const w = tw(s, 13, 600) + 16, x0 = a === 'left' ? x : a === 'right' ? x - w : x - w / 2;
    rr(x0, y - 12, w, 24, 999, 'rgba(11,15,28,.86)', rgba(c || C.txt, .55), 1); tx(s, x0 + w / 2, y + .5, { s: 13, w: 600, c: c || C.txt, bg: false });
  }
  // seta de medida com duas pontas (vertical); k de 0 a 1 faz a medida crescer a partir da base
  function enz_medida(x, y1, y2, c, k = 1) {
    const ye = lerp(y1, y2, k); line(x, y1, x, ye, c, 1.5); if (k < .02) return;
    for (const [y, d] of [[y1, y2 > y1 ? 1 : -1], [ye, y2 > y1 ? -1 : 1]]) { X.beginPath(); X.moveTo(x, y); X.lineTo(x - 5, y + d * 8); X.lineTo(x + 5, y + d * 8); X.closePath(); X.fillStyle = c; X.fill(); }
  }
  // caixa de gráfico dentro da área útil, com margem para os eixos; fr = fração da largura usada
  function enz_caixa(fr, dy) { const A = area(), x0 = A.x0 + (NAR ? 34 : 44), y0 = A.y0 + (dy || 8), x1 = A.x0 + (A.w) * (fr || 1) - 8, y1 = A.y1 - 40; return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 }; }
  // área sob a curva, com degradê vertical (volume) e revelação da esquerda para a direita (prog de 0 a 1)
  function enz_area(g, f, a, b, y0, c, prog = 1, al = 1) {
    if (prog <= .01 || al <= .01) return; const bb = lerp(a, b, prog), top = g.fy(95);
    X.beginPath(); X.moveTo(g.fx(a), g.fy(y0)); for (let i = 0; i <= 100; i++) { const v = lerp(a, bb, i / 100); X.lineTo(g.fx(v), g.fy(f(v))); } X.lineTo(g.fx(bb), g.fy(y0)); X.closePath();
    const gr = X.createLinearGradient(0, g.fy(Math.max(...[0, .25, .5, .75, 1].map(q => f(lerp(a, b, q))))) - 4, 0, g.fy(y0)); gr.addColorStop(0, rgba(c, .34 * al)); gr.addColorStop(1, rgba(c, .02));
    X.fillStyle = gr; X.fill();
  }
  // curva em fita: sombra projetada, corpo com degradê, brilho fino. prog revela a curva; G limita o recorte
  function fita(g, G, f, a, b, c, lw, prog = 1, o = {}) {
    if (prog <= .005) return; const bb = lerp(a, b, prog), al = o.al == null ? 1 : o.al;
    X.save(); X.beginPath(); X.rect(G.x0, G.y0 - 6, G.w, G.h + 8); X.clip(); X.globalAlpha *= al; X.lineJoin = 'round'; X.lineCap = 'round'; if (o.dash) X.setLineDash(o.dash);
    const trace = dy => { X.beginPath(); for (let i = 0; i <= 140; i++) { const v = lerp(a, bb, i / 140), px = g.fx(v), py = g.fy(f(v)) + dy; i ? X.lineTo(px, py) : X.moveTo(px, py); } };
    trace(4); X.strokeStyle = 'rgba(0,0,0,.4)'; X.lineWidth = lw + 2.5; X.stroke();
    const gr = X.createLinearGradient(0, G.y0, 0, G.y1); gr.addColorStop(0, light(c, .3)); gr.addColorStop(.5, c); gr.addColorStop(1, dark(c, .2));
    trace(0); X.strokeStyle = gr; X.lineWidth = lw; X.stroke();
    if (!o.dash) { trace(-lw * .22); X.strokeStyle = 'rgba(255,255,255,.4)'; X.lineWidth = Math.max(1, lw * .22); X.stroke(); }
    X.restore();
  }
  // marcador que percorre a curva: cabeça com brilho e rastro que esmaece
  function tracer(g, f, a, b, c, t, per, al = 1, r = 5) {
    const u = fr(t / per), fade = Math.sin(u * PI) ** .6 * al; if (fade <= .02) return;
    for (let j = 10; j >= 1; j--) { const v = lerp(a, b, Math.max(0, u - j * .012)); circ(g.fx(v), g.fy(f(v)), r * (1 - j * .07), rgba(c, .2 * fade * (1 - j / 11))); }
    const v = lerp(a, b, u), x = g.fx(v), y = g.fy(f(v)); circ(x, y, r * 2.2, rgba(c, .22 * fade)); circ(x, y, r, rgba('#FFFFFF', .95 * fade), rgba(c, fade), 2);
  }
  // bola com volume (luz, sombra, borda)
  function bola(x, y, r, c, a = 1) {
    X.save(); X.globalAlpha *= a; ell(x, y + r * 1.05, r * .9, r * .28, 0, 'rgba(0,0,0,.28)');
    const g = X.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r * 1.1); g.addColorStop(0, light(c, .6)); g.addColorStop(.45, c); g.addColorStop(1, dark(c, .45));
    circ(x, y, r, g, 'rgba(11,15,28,.65)', 1.3); X.restore();
  }
  const hsPos = (d, x, y) => Object.assign(d, { x, y });

  // ================= ENZIMAS =================
  const L_PROT = ['Desnaturação (Proteínas)', '#prot/desnaturacao'], L_ENZ = ['Encaixe enzima-substrato', '#enz/encaixe'];

  // ---- enz/encaixe em 3D ----
  // A enzima é uma superfície molecular de verdade (malha com relevo de resíduos, sulco do sítio ativo e dois domínios que se fecham),
  // desenhada com o THREE do visor do Martin. Por dentro dela ficam esferas escondidas do MOL3D, que só servem para o toque, os rótulos e o painel.
  // Substrato, água e produtos são átomos do MOL3D (bola e bastão ou volume). O encaixe induzido é um morph da malha (aberta e fechada).
  const ENC = {}, SC = [0, 7.1, 0];
  const vk = (a, k) => [a[0] * k, a[1] * k, a[2] * k], vs = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const nrm3 = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const sst = (a, b, x) => ss((x - a) / (b - a));
  const bez2 = (a, c, b, e) => [0, 1, 2].map(i => (1 - e) * (1 - e) * a[i] + 2 * (1 - e) * e * c[i] + e * e * b[i]);
  // forma da enzima numa direção d: elipsoide, dois domínios em volta do sulco, o sulco do sítio ativo e o relevo dos resíduos
  function encForma(d, rel) {
    const ell = 1 / Math.sqrt((d[0] / 11.4) ** 2 + (d[1] / 9.6) ** 2 + (d[2] / 9.8) ** 2);
    const G = Math.exp(-((d[0] / .31) ** 2)) * Math.exp(-((d[2] / .74) ** 2)) * sst(.12, .7, d[1]);
    const lob = q => 2.3 * Math.exp(-((d[0] - q) ** 2 + (d[1] - .58) ** 2 + d[2] * d[2] * .6) / .16);
    return { r: ell + lob(-.52) + lob(.52) - 5.6 * G + rel * (1 - .85 * G), G };
  }
  // encaixe induzido: os dois domínios giram em torno de uma dobradiça abaixo do sulco (k = 1 aberto, 0 fechado)
  function encAbrir(p, k) {
    const a = -.3 * k * Math.tanh(p[0] / 1.6) * sst(-4, 8, p[1]), x = p[0], y = p[1] + 4, c = Math.cos(a), s = Math.sin(a);
    return [x * c - y * s, x * s + y * c - 4, p[2]];
  }
  function icosfera(n) {
    const t = (1 + Math.sqrt(5)) / 2, v = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map(nrm3);
    let f = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
    for (let i = 0; i < n; i++) {
      const cache = new Map(), mid = (a, b) => { const k = a < b ? a * 1e6 + b : b * 1e6 + a; let m = cache.get(k); if (m == null) { m = v.length; v.push(nrm3(vs(v[a], v[b]))); cache.set(k, m); } return m; };
      const g = []; for (const [a, b, c] of f) { const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a); g.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]); } f = g;
    }
    return { v, f };
  }
  function normais(pos, idx) {
    const n = new Float32Array(pos.length);
    for (let i = 0; i < idx.length; i += 3) {
      const a = idx[i] * 3, b = idx[i + 1] * 3, c = idx[i + 2] * 3;
      const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2], wx = pos[c] - pos[a], wy = pos[c + 1] - pos[a + 1], wz = pos[c + 2] - pos[a + 2];
      const nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
      for (const j of [a, b, c]) { n[j] += nx; n[j + 1] += ny; n[j + 2] += nz; }
    }
    for (let i = 0; i < n.length; i += 3) { const l = Math.hypot(n[i], n[i + 1], n[i + 2]) || 1; n[i] /= l; n[i + 1] /= l; n[i + 2] /= l; }
    return n;
  }
  // textura macia (para o brilho do sítio e as partículas), feita num canvas
  function encMancha(T) {
    const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.35, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    const tx = new T.CanvasTexture(c); if ('colorSpace' in tx) tx.colorSpace = T.SRGBColorSpace; return tx;
  }
  function encMontar(M) {
    const T = MOL3D.visor && MOL3D.visor.THREE, R = rng(4242), ga = PI * (3 - Math.sqrt(5)), reduz = MOL3D.reduz;
    Object.keys(ENC).forEach(k => delete ENC[k]);
    Object.assign(ENC, { T, sub: [], prod: [], pa: [], pb: [], sub2: [], agua: [], prx: [], selK: '', k: -1, cor: -1 });
    M.no('enz', { origem: [0, 0, 0] });
    M.no('sub', { origem: SC }); M.no('pA', { origem: SC }); M.no('pB', { origem: SC }); M.no('agua', { origem: SC }); M.no('sub2', { origem: SC });
    M.grupo('enz', { nome: 'Enzima', cor: ENZ, frase: 'Uma proteína dobrada em três dimensões. A forma da superfície, vinda da sequência de aminoácidos, é o que a torna específica.' });
    M.grupo('sitio', { nome: 'Sítio ativo', cor: '#F2C6FF', frase: 'A fenda onde o substrato se encaixa e a reação acontece. Os aminoácidos que a revestem prendem o substrato e facilitam a reação.' });
    M.grupo('sub', { nome: 'Substrato', cor: SUB, frase: 'A molécula que vai reagir. Na enzima certa, ela tem a forma que o sítio ativo reconhece.' });
    M.grupo('agua', { nome: 'Água', cor: '#8FD8FF', frase: 'Em muitas reações de quebra, uma molécula de água entra no sítio ativo e se divide entre os dois produtos. É a hidrólise.' });
    M.grupo('prod', { nome: 'Produtos', cor: PRO, frase: 'As duas moléculas que sobram quando o substrato se parte. Saem do sítio ativo e a enzima fica livre para outra reação.' });

    // relevo: cerca de 650 resíduos espalhados pela superfície (esferas fundidas)
    const nb = 1100, bumps = [];
    for (let i = 0; i < nb; i++) {
      const y = 1 - 2 * (i + .5) / nb, r = Math.sqrt(1 - y * y), th = ga * i + (R() - .5) * .3;
      bumps.push([Math.cos(th) * r, y, Math.sin(th) * r, .6 + R() * .5, 1 / ((.05 + R() * .03) ** 2)]);
    }
    // grade espacial para só somar os resíduos vizinhos (a malha tem cerca de 41 mil vértices)
    const cel = q => Math.floor((q + 1) / .25), grade = new Map();
    bumps.forEach(b => { const k = cel(b[0]) * 100 + cel(b[1]) * 10 + cel(b[2]); (grade.get(k) || grade.set(k, []).get(k)).push(b); });
    const relevo = d => {
      let s = 0; const cx = cel(d[0]), cy = cel(d[1]), cz = cel(d[2]);
      for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let l = -1; l <= 1; l++) {
        const bs = grade.get((cx + i) * 100 + (cy + j) * 10 + cz + l); if (!bs) continue;
        for (const b of bs) { const dt = d[0] * b[0] + d[1] * b[1] + d[2] * b[2]; if (dt < .975) continue; s += b[3] * Math.exp(-2 * (1 - dt) * b[4]); }
      }
      return 1.5 * (1 - Math.exp(-s / 1.5));
    };
    ENC.relevo = relevo;

    // malha da enzima
    if (T) {
      const { v, f } = icosfera(6), nv = v.length, pos = new Float32Array(nv * 3), abe = new Float32Array(nv * 3), col = new Float32Array(nv * 3), sitW = new Float32Array(nv);
      const idx = new (nv > 65535 ? Uint32Array : Uint16Array)(f.length * 3); f.forEach((t, i) => { idx[i * 3] = t[0]; idx[i * 3 + 1] = t[1]; idx[i * 3 + 2] = t[2]; });
      const cA = new T.Color(), cB = new T.Color(), cC = new T.Color();
      const cat = [nrm3([.07, .99, -.16]), nrm3([-.07, .99, .18])];
      for (let i = 0; i < nv; i++) {
        const d = v[i], rel = relevo(d), F = encForma(d, rel), p = vk(d, F.r), q = encAbrir(p, 1);
        pos.set(p, i * 3); abe.set(q, i * 3);
        const sw = sst(.28, .7, F.G); sitW[i] = sw;
        // cor com profundidade: fundo das reentrâncias escuro, topo dos resíduos claro; os dois domínios com tons um pouco diferentes
        const h = cl((rel - .25) / 1.05, 0, 1), dom = Math.tanh(d[0] * 3) * .5 + .5;
        cA.set(mixc('#170F3D', '#22103F', dom)); cB.set(mixc('#4E35A8', '#6A3399', dom)); cC.set(mixc('#A992F2', '#C08BE6', dom));
        const base = h < .55 ? cA.clone().lerp(cB, h / .55) : cB.clone().lerp(cC, (h - .55) / .45);
        // sítio ativo: revestimento lilás claro, mais escuro no fundo da fenda; dois resíduos catalíticos âmbar
        const fundo = sst(.55, .95, F.G);
        cA.set('#E99BD8'); cB.set('#5E2470'); const sit = cA.clone().lerp(cB, fundo * .7);
        base.lerp(sit, sw * .9);
        for (const c of cat) { const dt = d[0] * c[0] + d[1] * c[1] + d[2] * c[2]; const w = Math.exp(-2 * (1 - dt) / .0022); if (w > .02) { cA.set('#FFB45E'); base.lerp(cA, w * .85); } }
        // oclusão aproximada pela curvatura grande: perto da dobradiça e dentro da fenda escurece um pouco
        base.multiplyScalar(1 - .28 * sst(.4, 1, F.G));
        col[i * 3] = base.r; col[i * 3 + 1] = base.g; col[i * 3 + 2] = base.b;
      }
      const g = new T.BufferGeometry();
      g.setIndex(new T.BufferAttribute(idx, 1));
      g.setAttribute('position', new T.BufferAttribute(pos, 3));
      const n0 = normais(pos, idx), n1 = normais(abe, idx);
      g.setAttribute('normal', new T.BufferAttribute(n0, 3));
      g.setAttribute('color', new T.BufferAttribute(col.slice(), 3));
      const dp = new Float32Array(nv * 3), dn = new Float32Array(nv * 3);
      for (let i = 0; i < nv * 3; i++) { dp[i] = abe[i] - pos[i]; dn[i] = n1[i] - n0[i]; }
      g.morphAttributes.position = [new T.BufferAttribute(dp, 3)]; g.morphAttributes.normal = [new T.BufferAttribute(dn, 3)]; g.morphTargetsRelative = true;
      g.computeBoundingSphere();
      const mat = new T.MeshPhysicalMaterial({ vertexColors: true, roughness: .5, metalness: 0, clearcoat: .45, clearcoatRoughness: .55, sheen: .35, sheenRoughness: .5, sheenColor: new T.Color('#B9A4FF'), envMapIntensity: .45 });
      const mesh = new T.Mesh(g, mat); mesh.morphTargetInfluences = [0]; mesh.frustumCulled = false;
      M.nos.enz.obj.add(mesh);
      Object.assign(ENC, { mesh, geo: g, mat, col, sitW });
      // brilho discreto no sítio ativo
      const tx = encMancha(T); ENC.tx = tx;
      const glow = new T.Sprite(new T.SpriteMaterial({ map: tx, color: '#FFB46E', transparent: true, opacity: .2, depthWrite: false, blending: T.AdditiveBlending }));
      glow.position.set(SC[0], SC[1] - 1.2, SC[2]); glow.scale.set(11, 11, 1); M.nos.enz.obj.add(glow); ENC.glow = glow;
      // partículas leves: solvente em volta (pontos frios) e uma lufada âmbar quando a ligação se parte
      const np = 110, pp = new Float32Array(np * 3), base = [];
      for (let i = 0; i < np; i++) {
        const y = 1 - 2 * (i + .5) / np, r = Math.sqrt(1 - y * y), th = ga * i * 1.7 + R(), rr = 14 + R() * 10;
        base.push([Math.cos(th) * r * rr, y * rr * .8 + 2, Math.sin(th) * r * rr, R() * 6.28, .5 + R()]);
      }
      const gp = new T.BufferGeometry(); gp.setAttribute('position', new T.BufferAttribute(pp, 3));
      const solv = new T.Points(gp, new T.PointsMaterial({ map: tx, color: '#9DB6F2', size: .55, transparent: true, opacity: .38, depthWrite: false, blending: T.AdditiveBlending, sizeAttenuation: true }));
      solv.frustumCulled = false; M._nos.raiz.add(solv); Object.assign(ENC, { solv, solvBase: base });
      const nq = 26, qp = new Float32Array(nq * 3), dirs = [];
      for (let i = 0; i < nq; i++) { const y = 1 - 2 * (i + .5) / nq, r = Math.sqrt(1 - y * y), th = ga * i; dirs.push([Math.cos(th) * r, Math.abs(y) * .9 + .2, Math.sin(th) * r, .6 + R() * .8]); }
      const gq = new T.BufferGeometry(); gq.setAttribute('position', new T.BufferAttribute(qp, 3));
      const jato = new T.Points(gq, new T.PointsMaterial({ map: tx, color: '#FFD08A', size: .7, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending, sizeAttenuation: true }));
      jato.frustumCulled = false; M.nos.enz.obj.add(jato); Object.assign(ENC, { jato, jatoDir: dirs });
      if (reduz) solv.material.opacity = .28;
    }

    // esferas escondidas sob a superfície: recebem o toque e seguem a forma (o MOL3D as usa para o painel e os rótulos)
    let rotEnz = -1, rotSit = -1, fundoMax = -1, melhor = -2;
    const nE = 90;
    for (let i = 0; i < nE; i++) {
      const y = 1 - 2 * (i + .5) / nE, r = Math.sqrt(1 - y * y), th = ga * i, d = [Math.cos(th) * r, y, Math.sin(th) * r], F = encForma(d, 0);
      if (F.G > .06) continue;
      const p = vk(d, F.r - 3), id = M.atomo('X', p, { no: 'enz', grupo: 'enz', cor: '#6B47B3', r: [1.6, 1.6] }); ENC.prx.push([id, p]);
      const fr = -.72 * d[0] + .1 * d[1] + .52 * d[2]; if (fr > melhor) { melhor = fr; rotEnz = id; }
    }
    const nS = 900;
    for (let i = 0; i < nS; i++) {
      const y = 1 - 2 * (i + .5) / nS, r = Math.sqrt(1 - y * y), th = ga * i, d = [Math.cos(th) * r, y, Math.sin(th) * r], F = encForma(d, 0);
      if (F.G < .5) continue;
      const p = vk(d, F.r - 2.6), id = M.atomo('X', p, { no: 'enz', grupo: 'sitio', cor: '#F2C6FF', r: [.7, .7] }); ENC.prx.push([id, p]);
      if (Math.abs(d[2]) > .2 && Math.abs(d[2]) < .3 && F.G > fundoMax) { fundoMax = F.G; rotSit = id; }
    }
    if (!T) ENC.prx.forEach(([i]) => { M.atomos[i].r = M.atomos[i].grupo === 'enz' ? [1.9, 2.4] : [1, 1.3]; });

    // substrato: dois anéis de seis átomos (como um dissacarídeo) unidos por um oxigênio; os produtos são os anéis já separados
    const AN = (zc, sgn) => { const out = []; for (let j = 0; j < 6; j++) { const a = j * PI / 3; out.push([(j % 2 ? .22 : -.22), 1.42 * Math.cos(a), zc + sgn * 1.42 * Math.sin(a)]); } return out; };
    const molecula = (no, noB, grupo, corA, corB, lista, listaB) => {
      const A = AN(-2.5, 1), B = AN(2.5, -1), ids = [];
      const at = (el, q, n, c, li) => { const i = M.atomo(el, vs(SC, q), { no: n, grupo, cor: c, r: el === 'O' ? [.4, 1] : [.44, 1.06] }); li.push(i); return i; };
      const mk = (pts, n, c, li) => pts.map((q, j) => at(j === 3 ? 'O' : 'C', q, n, j === 3 ? mixc(c, '#FF6B4A', .45) : c, li));
      const ra = mk(A, no, corA, lista), rb = mk(B, noB, corB, listaB || lista);
      for (const [r, n, c, li, n0] of [[ra, no, corA, lista, 1], [rb, noB, corB, listaB || lista, -1]]) {
        for (let j = 0; j < 6; j++) M.ligacao(r[j], r[(j + 1) % 6], { raio: .15 });
        const q0 = vs(M.atomos[r[0]].p, [0, 0, 0]), top = at('O', [q0[0], q0[1] + 1.35, q0[2]], n, mixc(c, '#FF6B4A', .45), li); M.ligacao(r[0], top, { raio: .15 });
        const q4 = M.atomos[r[4]].p, sd = at('C', [q4[0], q4[1] - 1.05, q4[2] - n0 * .75], n, c, li); M.ligacao(r[4], sd, { raio: .15 });
        ids.push(r);
      }
      return ids;
    };
    // substrato inteiro (some na reação)
    const [sa, sb] = molecula('sub', 'sub', 'sub', SUB, SUB, ENC.sub);
    const ponte = M.atomo('O', vs(SC, [0, 1.95, 0]), { no: 'sub', grupo: 'sub', cor: '#FF9A3C', r: [.42, 1.02] }); ENC.sub.push(ponte); ENC.ponte = ponte;
    M.ligacao(sa[1], ponte, { raio: .15 }); M.ligacao(ponte, sb[1], { raio: .15 });
    // produtos (entram na reação, nascem com a cor do substrato e ganham a sua)
    const [qa, qb] = molecula('pA', 'pB', 'prod', SUB, SUB, ENC.pa, ENC.pb);
    const oa = M.atomo('O', vs(SC, [-.15, 1.95, -.55]), { no: 'pA', grupo: 'prod', cor: '#FF9A3C', r: [.4, 1] }); ENC.pa.push(oa); M.ligacao(qa[1], oa, { raio: .15 });
    const ob = M.atomo('O', vs(SC, [.15, 1.95, .55]), { no: 'pB', grupo: 'prod', cor: '#FF9A3C', r: [.4, 1] }); ENC.pb.push(ob); M.ligacao(qb[1], ob, { raio: .15 });
    ENC.prod = ENC.pa.concat(ENC.pb);
    ENC.corProd = ENC.prod.map(i => [M.atomos[i].cor, ENC.pa.includes(i)]);
    // água que entra para a hidrólise
    const ow = M.atomo('O', vs(SC, [-.2, 2.4, 0]), { no: 'agua', grupo: 'agua', cor: '#FF5A4E', r: [.4, 1.0] });
    const h1 = M.atomo('H', vs(SC, [.55, 2.95, .3]), { no: 'agua', grupo: 'agua', cor: '#EEF3FF', r: [.24, .7] });
    const h2 = M.atomo('H', vs(SC, [-.95, 2.95, -.3]), { no: 'agua', grupo: 'agua', cor: '#EEF3FF', r: [.24, .7] });
    M.ligacao(ow, h1, { raio: .12 }); M.ligacao(ow, h2, { raio: .12 }); ENC.agua = [ow, h1, h2];
    // o próximo substrato, que chega quando a enzima fica livre
    const [ta, tb] = molecula('sub2', 'sub2', 'sub', SUB, SUB, ENC.sub2);
    const p2 = M.atomo('O', vs(SC, [0, 1.95, 0]), { no: 'sub2', grupo: 'sub', cor: '#FF9A3C', r: [.42, 1.02] }); ENC.sub2.push(p2);
    M.ligacao(ta[1], p2, { raio: .15 }); M.ligacao(p2, tb[1], { raio: .15 });

    // o rótulo do substrato fica na ponta do anel de baixo e à direita, longe do caminho da água (o da água fica no O dela)
    M.rotulo(rotSit, 'sítio ativo', 0); M.rotulo(sb[5], 'substrato', 1); M.rotulo(rotEnz, 'enzima', 2); M.rotulo(qa[4], 'produto', 3); M.rotulo(qb[4], 'produto', 4); M.rotulo(ow, 'água', 5);
    M.vista = { th: -.95, fi: .6, zoom: 1, alvo: [0, 2.6, 0] };
  }
  // cor da malha conforme o que o aluno tocou (o MOL3D apaga o resto; aqui fazemos o mesmo na superfície)
  function encCorMalha(M) {
    const v = MOL3D.visor; if (!ENC.geo || !v) return;
    const s = v.sel; let g = '';
    if (s) g = s.grupo || (s.atomo != null && M.atomos[s.atomo] ? M.atomos[s.atomo].grupo || 'x' : 'x');
    if (g === ENC.selK) return; ENC.selK = g;
    const at = ENC.geo.getAttribute('color'), a = at.array, c = ENC.col;
    for (let i = 0; i < ENC.sitW.length; i++) {
      const on = !g || g === 'enz' || (g === 'sitio' && ENC.sitW[i] > .35), j = i * 3;
      if (on) { a[j] = c[j]; a[j + 1] = c[j + 1]; a[j + 2] = c[j + 2]; continue; }
      const l = c[j] * .3 + c[j + 1] * .59 + c[j + 2] * .11;
      a[j] = (c[j] + l) * .5 * .45; a[j + 1] = (c[j + 1] + l) * .5 * .45; a[j + 2] = (c[j + 2] + l) * .5 * .45;
    }
    at.needsUpdate = true;
  }
  function encAnimar(M, P) {
    const p = P.passo, N = M.nos, reduz = MOL3D.reduz, A = M.atomos;
    const longe = [-15, 9, 9], curva = [-9, 12, -2], boca = [0, 4.2, 0];
    // no encaixe induzido o substrato desce mais fundo na fenda (FUNDO) e os domínios fecham um pouco além da forma de repouso (KF < 0), cobrindo os anéis
    const FUNDO = [0, -1.5, 0], KF = -.2;
    let k = 0, sp = [0, 0, 0], rot = [0, 0, 0], sub = 1, prod = 0, pA = [0, 0, 0], pB = [0, 0, 0], rA = [0, 0, 0], rB = [0, 0, 0], escP = 1, cor = 0;
    let agua = 0, aw = [0, 0, 0], s2 = 0, s2p = [0, 0, 0], brilho = .16, jato = -1;
    M.enquadrar([1.12, 1.12, 1.0, .9, 1.18][p]);
    if (p === 0) {
      // chave-fechadura: o sítio já tem a forma do substrato; nada muda na enzima
      const e = P.entre(0, 2.6); sp = bez2(longe, curva, [0, 0, 0], e); rot = [(1 - e) * 1.4, (1 - e) * 2.2, (1 - e) * .8];
      brilho = .14 + .22 * P.entre(2.2, 3.2);
    } else if (p === 1) {
      const e = P.entre(0, 2.4); k = 1; sp = bez2(longe, curva, boca, e); rot = [(1 - e) * 1.4, (1 - e) * 2.2 + .35, (1 - e) * .8];
      brilho = .14 + .06 * P.entre(1.8, 2.6);
    } else if (p === 2) {
      // encaixe induzido: o substrato desce e os domínios fecham sobre ele, com uma pequena acomodação no fim
      const d = P.entre(0, 1.3), f = P.entre(.45, 2.2); sp = vs(vk(boca, 1 - d), vk(FUNDO, d)); rot = [0, .35 * (1 - d), 0];
      k = (1 - f) + KF * f + .05 * Math.sin(f * PI) * (1 - f);
      brilho = .18 + .14 * f;
    } else if (p === 3) {
      // reação: a água entra, o brilho cresce, a ligação se parte e os dois anéis se afastam um pouco
      const w = P.entre(0, 1.2); agua = 1; aw = bez2([6, 9, 7], [3, 7, 4], FUNDO, w); sp = FUNDO; k = KF;
      const quebra = 1.5, pos = P.tp >= quebra || (reduz && P.tp > 1e8);
      const fl = Math.exp(-((P.tp - quebra) ** 2) / .12);
      brilho = .3 + .08 * w + (reduz ? 0 : .2 * fl);
      if (pos) { sub = 0; prod = 1; agua = 0; const s = P.entre(quebra, quebra + 1.3); pA = vs(FUNDO, [0, .25 * s, -.55 * s]); pB = vs(FUNDO, [0, .25 * s, .55 * s]); cor = P.entre(quebra, quebra + .9); jato = P.tp - quebra; }
    } else {
      // produtos saem e a enzima volta a abrir, intacta; depois um novo substrato se aproxima
      k = KF + (1 - KF) * P.entre(0, 1.7); sub = 0; prod = 1; cor = 1; brilho = .24 * (1 - P.entre(0, 1.6)) + .14;
      const lv = P.entre(.25, 3.2), out = ss(seg(lv, 0, 1));
      pA = vs(vs(FUNDO, [0, .25, -.55]), [-6 * out, 8 * out, -9 * out]); pB = vs(vs(FUNDO, [0, .25, .55]), [6 * out, 7 * out, 9 * out]);
      rA = [out * 1.6, out * .9, 0]; rB = [-out * 1.3, out * 1.1, 0]; escP = 1 - P.entre(1.9, 3);
      const e2 = P.entre(2.9, 5.2); s2 = e2 > 0 ? 1 : 0; s2p = bez2(longe, curva, [-5, 9, 4], e2);
    }
    N.sub.pos = sp; N.sub.rot = rot; N.pA.pos = pA; N.pB.pos = pB; N.pA.rot = rA; N.pB.rot = rB; N.agua.pos = aw; N.sub2.pos = s2p; N.sub2.rot = [.4, 1.2, .3];
    ENC.sub.forEach(i => { A[i].esc = sub; });
    ENC.prod.forEach(i => { A[i].esc = prod * escP; });
    ENC.agua.forEach(i => { A[i].esc = agua; });
    ENC.sub2.forEach(i => { A[i].esc = s2 * P.entre(2.9, 3.6); });
    // produtos: nascem dourados e ganham a cor de cada um
    if (cor !== ENC.cor) { ENC.cor = cor; ENC.prod.forEach((i, j) => { const [c0, ehA] = ENC.corProd[j], alvo = ehA ? PRO : ALO; A[i].cor = mixc(c0, c0 === SUB ? alvo : (ehA ? '#FFB3D6' : '#B5ECFF'), cor); }); M.corSuja = true; }
    // esferas de toque acompanham a forma da malha
    if (k !== ENC.k) { ENC.k = k; ENC.prx.forEach(([i, q]) => { A[i].p = encAbrir(q, k); }); if (ENC.mesh) ENC.mesh.morphTargetInfluences[0] = k; }
    encCorMalha(M);
    if (ENC.glow) { ENC.glow.material.opacity = brilho; const s = 10 + 3 * brilho; ENC.glow.scale.set(s, s, 1); }
    if (ENC.solv) {
      const a = ENC.solv.geometry.getAttribute('position'), t = reduz ? 0 : P.t;
      ENC.solvBase.forEach((b, i) => { a.array[i * 3] = b[0] + Math.sin(t * .23 * b[4] + b[3]) * 1.2; a.array[i * 3 + 1] = b[1] + Math.sin(t * .17 * b[4] + b[3] * 1.7) * 1.0; a.array[i * 3 + 2] = b[2] + Math.cos(t * .2 * b[4] + b[3]) * 1.2; });
      a.needsUpdate = true;
    }
    if (ENC.jato) {
      const vis = !reduz && jato >= 0 && jato < 1.6, a = ENC.jato.geometry.getAttribute('position'), o = vs(vs(SC, [0, 1.95, 0]), FUNDO);
      ENC.jato.material.opacity = vis ? .75 * (1 - jato / 1.6) : 0;
      if (vis) { const dd = 1 - Math.exp(-jato * 2.6); ENC.jatoDir.forEach((d, i) => { const r = d[3] * 4.2 * dd; a.array[i * 3] = o[0] + d[0] * r; a.array[i * 3 + 1] = o[1] + d[1] * r; a.array[i * 3 + 2] = o[2] + d[2] * r; }); a.needsUpdate = true; }
    }
  }
  function encSair() {
    ['geo', 'tx'].forEach(k => { if (ENC[k]) ENC[k].dispose(); });
    ['mat'].forEach(k => { if (ENC[k]) ENC[k].dispose(); });
    for (const k of ['glow', 'solv', 'jato']) if (ENC[k]) { ENC[k].material.dispose(); ENC[k].geometry && ENC[k].geometry.dispose && ENC[k].geometry.dispose(); }
    Object.keys(ENC).forEach(k => delete ENC[k]);
  }
  def('enz', 'encaixe', MOL3D.cena({
    t: 'Chave-fechadura e encaixe induzido', s: 'como a enzima reconhece o substrato', c: ENZ, loc: 'enzima e substrato, cerca de 5 nm', still: 3,
    alt: 'Um substrato entra no sítio ativo da enzima, é transformado e sai como dois produtos; a enzima termina igual',
    d: `<p><b>Enzimas</b> são catalisadores biológicos: aceleram reações químicas sem serem consumidas. Quase todas são <b>proteínas</b>. A reação acontece no <b>sítio ativo</b>, uma região da enzima onde a molécula que vai reagir, o <b>substrato</b>, se encaixa.</p><p>No modelo <b>chave-fechadura</b> (Emil Fischer, 1894), o sítio ativo já tem a forma exata do substrato. No modelo do <b>encaixe induzido</b> (Daniel Koshland, 1958), mais aceito hoje, o sítio é parecido com o substrato e <b>muda de forma</b> ao recebê-lo, envolvendo-o. Nos dois casos a enzima é <b>específica</b> e sai da reação intacta, pronta para outra.</p>`,
    kv: [['Natureza', 'quase sempre proteína'], ['Onde age', 'sítio ativo'], ['Ao fim da reação', 'enzima intacta'], ['Nome', 'costuma terminar em -ase']],
    enem: `A banca cobra três ideias: a enzima é <b>específica</b> (por causa da forma do sítio ativo), <b>não é consumida</b> (pode ser reutilizada muitas vezes) e depende da sua <b>forma tridimensional</b>, que vem da sequência de aminoácidos. Se a forma muda (calor, pH), a enzima para de funcionar.`,
    links: [L_PROT, LK.amino, LK.helice],
    ctl: escolha('Passo', ['chave-fechadura', 'substrato chega', 'encaixe induzido', 'reação', 'produtos saem'], 6),
    montar: encMontar, animar: encAnimar, sair: encSair,
    legenda: P => [
      '<b>Chave-fechadura.</b> O sítio ativo já tem a forma exata do substrato, que se encaixa sem mudar a enzima.',
      '<b>Encaixe induzido, 1.</b> O substrato chega, mas o sítio ativo ainda está aberto e não o abraça por completo.',
      '<b>Encaixe induzido, 2.</b> O sítio ativo <b>muda de forma</b> e envolve o substrato.',
      '<b>Reação.</b> No sítio ativo o substrato se parte em dois <b>produtos</b>.',
      '<b>Fim.</b> Os produtos saem e a enzima volta à forma inicial, intacta e pronta para outra reação.'][P.passo],
    plano(t, S0) { return encaixe2d(t, Object.assign({}, S0, { v: Math.round(S0.v) === 0 ? 0 : 1 })); }
  }));
  // desenho plano do encaixe: só aparece se o WebGL não abrir neste navegador
  function encaixe2d(t, S) {
    const A = area(), ind = Math.round(S.v) === 1, s = Math.min(A.w * .16, A.h * .26, 80), cx = A.cx, cy = A.y0 + A.h * .66;
    const cyc = 6, u = (t % cyc) / cyc, inn = ss(seg(u, .05, .35)), re = seg(u, .4, .55), out = ss(seg(u, .62, .92));
    const sh = ind ? 'u' : 'tri', top = cy - s * .95;
    enz_corpo(cx, cy, s, { shape: sh, k: ind ? ss(seg(u, .28, .4)) * (1 - ss(seg(u, .62, .75))) : 0 });
    if (u < .55) { const x = lerp(cx - A.w * .36, cx, inn), y = lerp(top - s * .9, top + s * .06, inn); enz_peca(x, y, s, sh, re < .5 ? SUB : PRO); }
    else for (const d of [-1, 1]) { X.save(); X.translate(cx + d * out * A.w * .3, top - out * s * .9); X.scale(.55, .55); enz_peca(0, 0, s, sh, PRO, d * .4); X.restore(); }
    enz_pill('enzima', cx + s * 1.25, cy + s * .45, light(ENZ, .3), 'left');
    if (u < .3) enz_pill('substrato', lerp(cx - A.w * .36, cx, inn), lerp(top - s * .9, top, inn) - s * .7, SUB);
    if (u >= .3 && u < .6) enz_pill('sítio ativo', cx - s * 1.3, top + s * .15, C.txt, 'right');
    if (u >= .62) enz_pill('produtos', cx, top - s * 1.25 - out * s * .3, PRO);
    cap(u < .3 ? '<b>1.</b> O substrato se aproxima do sítio ativo.' : u < .6 ? (ind ? '<b>2.</b> O sítio ativo <b>muda de forma</b> e envolve o substrato (encaixe induzido).' : '<b>2.</b> O substrato se encaixa no sítio ativo, que já tinha a forma certa (chave-fechadura).') : '<b>3.</b> Os produtos saem e a enzima volta à forma inicial, pronta para outra reação.');
  }

  // ---- enz/ativacao ----
  def('enz', 'ativacao', Object.assign({
    t: 'Energia de ativação', s: 'o "morro" que a enzima rebaixa', c: ENZ, loc: 'gráfico de energia',
    alt: 'Gráfico de energia ao longo da reação: a curva com enzima tem um pico mais baixo; reagentes e produtos ficam no mesmo nível nas duas curvas',
    d: `<p>Mesmo uma reação que libera energia precisa de um empurrão para começar: a <b>energia de ativação</b>. É como empurrar uma pedra morro acima antes que ela role para baixo.</p><p>A enzima oferece um <b>caminho diferente</b> para a reação, com um morro mais baixo. Assim, muito mais moléculas conseguem reagir a 37 °C, e a reação fica milhões de vezes mais rápida, ou mais. A enzima <b>não muda</b> a energia dos reagentes nem a dos produtos: a energia liberada pela reação (<span class="q">ΔG</span>) continua a mesma.</p>`,
    kv: [['Energia de ativação', 'diminui'], ['Energia de reagentes e produtos', 'não muda'], ['ΔG da reação', 'não muda'], ['Velocidade', 'aumenta muito']],
    enem: `Em gráficos de energia × caminho da reação, a curva <b>com enzima</b> é a de pico mais <b>baixo</b>; o começo e o fim das duas curvas são <b>iguais</b>. Pegadinhas comuns: "a enzima fornece energia à reação" (errado) e "a enzima torna a reação mais exotérmica" (errado). Ela só <b>diminui a energia de ativação</b>.`,
    links: [LK.bioen, L_ENZ],
    ctl: Object.assign(escolha('Mostrar', ['sem enzima', 'com enzima', 'as duas']), { v: 2 }),
    draw(t, S) {
      const m = Math.round(S.v), G = enz_caixa(1, 18), Er = 3.6, Ep = 1.6, en = entrada(t);
      const pico = h => v => lerp(Er, Ep, ss(seg(v, 3.6, 6.4))) + h * Math.exp(-(((v - 5) / 1.25) ** 2));
      const sem = pico(5.4), com = pico(2.2), show = k => m === k || m === 2;
      X.save(); X.globalAlpha = en.a; X.translate(G.x0 + G.w / 2, G.y0 + G.h / 2); X.scale(en.sc, en.sc); X.translate(-(G.x0 + G.w / 2), -(G.y0 + G.h / 2));
      const g = graph(G, { x0: 0, x1: 10, y0: 0, y1: 10, xl: 'caminho da reação', yl: 'energia', xt: [], curves: [] });
      if (show(0)) enz_area(g, sem, 0, 10, 0, '#C9D2E6', en.cur, .75); if (show(1)) enz_area(g, com, 0, 10, 0, ENZ, en.cur, 1);
      if (show(0)) fita(g, G, sem, 0, 10, '#C9D2E6', 2.8, en.cur); if (show(1)) fita(g, G, com, 0, 10, ENZ, 3.4, en.cur);
      X.save(); X.globalAlpha *= en.txt;
      line(g.fx(.2), g.fy(Er), g.fx(2.8), g.fy(Er), 'rgba(232,237,247,.4)', 1, [4, 4]); line(g.fx(7.2), g.fy(Ep), g.fx(9.8), g.fy(Ep), 'rgba(232,237,247,.4)', 1, [4, 4]);
      tx('reagentes', g.fx(1.4), g.fy(Er) + 15, { s: 12, c: C.dim }); tx('produtos', g.fx(8.4), g.fy(Ep) + 15, { s: 12, c: C.dim });
      X.restore();
      const xm = g.fx(5), sp = m === 2 ? 14 : 0;
      X.save(); X.globalAlpha *= en.med;
      if (show(0)) { enz_medida(xm - sp, g.fy(Er), g.fy(sem(5)), '#C9D2E6', en.med); tx('Ea sem enzima', xm - sp - 10, g.fy(sem(5)) + 4, { s: 13, w: 600, c: '#C9D2E6', a: 'right' }); }
      if (show(1)) { enz_medida(xm + sp, g.fy(Er), g.fy(com(5)), ENZ, en.med); tx('Ea com enzima', xm + sp + 10, g.fy(com(5)) + (m === 2 ? -2 : 4), { s: 13, w: 600, c: light(ENZ, .4), a: 'left' }); }
      const xd = g.fx(9.3); enz_medida(xd, g.fy(Er), g.fy(Ep), AMB, en.med); tx('ΔG', xd - 8, g.fy((Er + Ep) / 2), { s: 13, w: 700, c: AMB, a: 'right' });
      X.restore();
      // bolas: a molécula tenta subir o morro. Com enzima o morro é baixo e ela passa sempre; sem enzima falha duas vezes e passa na terceira
      const PC = 3.4, PS = 13.6, trav = [0, 0];
      const xCom = tt => { const u = (tt % PC) / PC; return [.3 + 9.4 * ss(seg(u, .1, .86)), ss(seg(u, 0, .08)) * (1 - ss(seg(u, .93, 1))), 0]; };
      const xSem = tt => {
        const u = tt % PS; let x = .3, ef = 0;
        if (u < 1) x = .3; else if (u < 3.4) { const k = ss(seg(u, 1, 3)); x = lerp(.3, 3.95, k); ef = k > .8 ? 1 : 0; } else if (u < 4.6) x = lerp(3.95, .3, seg(u, 3.4, 4.6) ** 2);
        else if (u < 5.4) x = .3; else if (u < 7.8) { const k = ss(seg(u, 5.4, 7.6)); x = lerp(.3, 4.55, k); ef = k > .8 ? 1 : 0; } else if (u < 9.2) x = lerp(4.55, .3, seg(u, 7.8, 9.2) ** 2);
        else if (u < 9.8) x = .3; else x = lerp(.3, 9.7, ss(seg(u, 9.8, 12.9)));
        return [x, ss(seg(u, 0, .4)) * (1 - ss(seg(u, 13.2, 13.6))), ef];
      };
      const tb = Math.max(0, t - 1.2); trav[0] = Math.floor((tb + PS - 12.9) / PS); trav[1] = Math.floor((tb + PC - PC * .86) / PC);
      if (show(0) && t > 1.2) { const [v, a, ef] = xSem(tb); bola(g.fx(v) + (ef ? Math.sin(t * 38) * 1.4 : 0), g.fy(sem(v)) - 9, 7, '#DDE3F2', a * en.txt); }
      if (show(1) && t > 1.2) { const [v, a] = xCom(tb); bola(g.fx(v), g.fy(com(v)) - 9, 7, SUB, a * en.txt); if (v > 4.6 && v < 5.4) { const k = (v - 4.6) / .8; X.save(); X.globalAlpha = Math.sin(k * PI) * .8 * a; circ(g.fx(5), g.fy(com(5)) - 9, 10 + 16 * k, null, SUB, 2); X.restore(); } }
      if (t > 1.2) { X.save(); X.globalAlpha *= en.txt; let yy = G.y0 + 20; if (show(0)) { tx('sem enzima: ' + trav[0] + (trav[0] === 1 ? ' travessia' : ' travessias'), G.x0 + 12, yy, { s: 13, w: 600, c: '#C9D2E6', a: 'left' }); yy += 20; } if (show(1)) tx('com enzima: ' + trav[1] + (trav[1] === 1 ? ' travessia' : ' travessias'), G.x0 + 12, yy, { s: 13, w: 600, c: light(ENZ, .4), a: 'left' }); X.restore(); }
      X.restore();
      const hs = [];
      hs.push({ id: 'reag', n: 'Reagentes', t: 'Começam neste nível de energia, com ou sem enzima.', x: g.fx(1.4), y: g.fy(Er), go: null });
      if (show(0)) hs.push({ id: 'psem', n: 'Pico sem enzima', t: 'Para reagir, a molécula precisa chegar até aqui. É a energia de ativação: poucas conseguem na temperatura do corpo.', x: g.fx(5), y: g.fy(sem(5)), go: m === 2 ? () => setCtl(0) : null });
      if (show(1)) hs.push({ id: 'pcom', n: 'Pico com enzima', t: 'A enzima abre um caminho com o morro mais baixo. Bem mais moléculas passam e a reação fica muito mais rápida.', x: g.fx(5), y: g.fy(com(5)), go: m !== 1 ? () => setCtl(1) : null });
      hs.push({ id: 'prod', n: 'Produtos', t: 'Terminam num nível mais baixo, e é o mesmo nas duas curvas: a enzima não muda reagentes nem produtos.', x: g.fx(8.4), y: g.fy(Ep), go: null });
      hs.push({ id: 'dg', n: 'Energia liberada (ΔG)', t: 'A diferença entre reagentes e produtos não muda com a enzima. Ela só acelera o caminho.', x: xd, y: g.fy((Er + Ep) / 2), go: null });
      HOT.set('ativacao' + (NAR ? 'n' : ''), hs); HOT.veil();
      cap(m === 0 ? 'Sem enzima, poucas moléculas têm energia para vencer o morro: a reação é <b>lenta</b>.' : m === 1 ? 'Com enzima, o morro é mais baixo e a reação fica <b>muito mais rápida</b>, na mesma temperatura.' : 'O pico com enzima é <b>mais baixo</b>, mas reagentes e produtos ficam <b>no mesmo nível</b>: o ΔG não muda.');
    }
  }, aoSair));

  // ---- enz/temperatura: duas enzimas (humana e de bactéria de fonte termal) no mesmo gráfico ----
  const TEMP = [{ n: 'enzima humana', o: 37, w: 19, d: 8.5, c: ENZ }, { n: 'enzima de bactéria termófila', o: 72, w: 20, d: 7, c: AMB }];
  const tAct = (e, x) => 100 * Math.exp(-(((x - e.o) / (x <= e.o ? e.w : e.d)) ** 2) * (x <= e.o ? 1.2 : 1.3));
  def('enz', 'temperatura', Object.assign({
    t: 'Temperatura', s: 'temperatura ótima e desnaturação', c: ENZ, loc: 'atividade × temperatura',
    alt: 'Gráfico da atividade de duas enzimas conforme a temperatura: cada curva sobe até um pico e depois cai de repente',
    d: `<p>Aquecer acelera as reações: as moléculas se movem mais e se encontram mais vezes. Por isso a atividade da enzima <b>sobe</b> com a temperatura até um ponto, a <b>temperatura ótima</b> (perto de <span class="q">37 °C</span> para a maioria das enzimas humanas).</p><p>Acima dela a atividade <b>despenca</b>: o calor rompe as ligações fracas que mantêm a forma da proteína, e o sítio ativo se deforma. É a <b>desnaturação</b>, em geral <b>irreversível</b>, como a clara do ovo que endurece. No frio é diferente: a enzima fica <b>lenta</b>, mas não se desfaz, e volta a funcionar quando a temperatura sobe.</p>`,
    kv: [['Ótima (humanas)', 'cerca de 37 °C'], ['Ótima (Taq polimerase)', 'cerca de 72 °C'], ['Frio', 'reação lenta, reversível'], ['Calor excessivo', 'desnaturação']],
    enem: `Leia o gráfico em forma de "morro assimétrico": sobe devagar e cai de repente. Frio <b>inibe</b> (reversível; por isso a geladeira conserva alimentos); calor excessivo <b>desnatura</b> (irreversível; por isso febre muito alta é perigosa). Bactérias de fontes termais, como <i>Thermus aquaticus</i>, têm enzimas que funcionam perto de 70 °C: uma delas, a Taq polimerase, é usada no PCR.`,
    links: [L_PROT, LK.dna],
    ctl: { l: 'Temperatura', min: 0, max: 100, step: 1, v: 37, f: v => v + ' °C', rate: () => 1 },
    still: 3,
    drag(x, y, S) { return S.inv ? S.inv(x) : null; },
    draw(t, S) {
      const T0 = S.v, side = !NAR, G = enz_caixa(side ? .7 : 1, 8), en = entrada(t);
      X.save(); X.globalAlpha = en.a; X.translate(G.x0 + G.w / 2, G.y0 + G.h / 2); X.scale(en.sc, en.sc); X.translate(-(G.x0 + G.w / 2), -(G.y0 + G.h / 2));
      const g = graph(G, { x0: 0, x1: 100, y0: 0, y1: 115, xl: 'temperatura (°C)', yl: 'atividade', xt: [[0, '0'], [20, '20'], [40, '40'], [60, '60'], [80, '80'], [100, '100']], curves: [] });
      S.inv = g.inv;
      TEMP.forEach(e => { enz_area(g, x => tAct(e, x), 0, 100, 0, e.c, en.cur, .8); });
      TEMP.forEach(e => fita(g, G, x => tAct(e, x), 0, 100, e.c, 3.4, en.cur));
      X.save(); X.globalAlpha *= en.txt; TEMP.forEach((e, i) => tx(i ? 'termófila' : 'humana', g.fx(e.o), g.fy(100) - 12, { s: 13, w: 600, c: e.c })); X.restore();
      TEMP.forEach((e, i) => { if (en.txt > .5) tracer(g, x => tAct(e, x), 0, 100, e.c, t + i * 2.3, 9, .8 * en.txt, 4); });
      X.save(); X.globalAlpha *= en.txt; line(g.fx(T0), g.fy(0), g.fx(T0), g.fy(112), C.txt, 1.5, [5, 4]); TEMP.forEach(e => marker(g.fx(T0), g.fy(tAct(e, T0)), e.c)); X.restore();
      X.restore();
      // a enzima humana na temperatura escolhida: vibra mais com o calor e desmancha acima do ótimo
      const e = TEMP[0], den = T0 > e.o + 4 ? ss((T0 - e.o - 4) / 14) : 0, a = tAct(e, T0) / 100;
      if (side) {
        const A = area(), ex = A.x0 + A.w * .86, ey = A.cy + 20, s = Math.min(A.w * .07, 54), vib = lerp(.4, 3.2, T0 / 100) * (1 - den * .6);
        X.save(); X.globalAlpha = en.txt;
        enz_corpo(ex, ey, s, { shape: 'tri', den, t, trem: vib });
        if (den < .6) { const j = .5 + 2.5 * a; enz_peca(ex + Math.sin(t * j * 2) * s * .9 * (1 - den), ey - s * 2 + Math.cos(t * j * 1.6) * s * .2, s * .9, 'tri', SUB); }
        tx('enzima humana', ex, ey - s * 2.8, { s: 13, w: 600, c: ENZ });
        tx(den > .5 ? 'desnaturada' : T0 < e.o - 15 ? 'lenta (frio)' : Math.abs(T0 - e.o) <= 4 ? 'no ótimo' : 'ativa', ex, ey + s * 1.4, { s: 14, w: 700, f: FH, c: den > .5 ? INI : C.txt });
        X.restore();
      }
      const hs = [
        { id: 'frio', n: 'Frio', t: 'A enzima fica lenta, mas continua inteira. Volta a funcionar quando esquenta.', x: g.fx(8), y: g.fy(tAct(TEMP[0], 8)), go: () => setCtl(8) },
        { id: 'otimo', n: 'Ótimo da enzima humana', t: 'Perto de 37 °C o sítio ativo tem a forma certa e as moléculas se encontram bastante: atividade máxima.', x: g.fx(37), y: g.fy(100), go: () => setCtl(37) },
        { id: 'den', n: 'Desnaturação', t: 'O calor rompe as ligações fracas que seguram a forma da proteína. O sítio ativo se deforma e, em geral, não volta.', x: g.fx(54), y: g.fy(tAct(TEMP[0], 54)), go: () => setCtl(58) },
        { id: 'termo', n: 'Ótimo da termófila', t: 'Enzimas de bactérias de fontes termais, como a Taq polimerase do PCR, funcionam perto de 72 °C.', x: g.fx(72), y: g.fy(100), go: () => setCtl(72) }];
      HOT.set('temp' + (NAR ? 'n' : ''), hs); HOT.veil();
      const h = Math.round(tAct(TEMP[0], T0)), b = Math.round(tAct(TEMP[1], T0));
      cap(`<b>${T0} °C</b>: enzima humana com <b>${h}%</b> da atividade máxima; termófila com <b>${b}%</b>. ${T0 >= 80 ? 'As duas estão desnaturando.' : T0 > 45 ? (b >= 80 ? 'A humana já <b>desnaturou</b>; a termófila está perto do seu ótimo.' : 'A humana já <b>desnaturou</b>; a termófila ainda está abaixo do seu ótimo.') : T0 < 25 ? 'Frio: as reações ficam <b>lentas</b>, mas as enzimas continuam inteiras.' : ''} Arraste no gráfico.`);
    }
  }, aoSair));

  // ---- enz/ph ----
  const PH = [{ n: 'pepsina', o: 2, w: 1.1, c: '#FF8A5C', l: 'estômago' }, { n: 'amilase salivar', o: 6.8, w: 1.1, c: SUB, l: 'boca' }, { n: 'tripsina', o: 8, w: 1.15, c: ALO, l: 'intestino delgado' }];
  const pAct = (e, p) => 100 * Math.exp(-(((p - e.o) / e.w) ** 2));
  def('enz', 'ph', Object.assign({
    t: 'pH', s: 'cada enzima tem o seu pH ótimo', c: ENZ, loc: 'atividade × pH',
    alt: 'Gráfico da atividade de três enzimas digestivas conforme o pH: pepsina com pico em pH 2, amilase salivar perto de 7 e tripsina perto de 8',
    d: `<p>O <b>pH</b> (acidez do meio) também mexe com a forma da enzima: muda as cargas elétricas dos aminoácidos do sítio ativo e das ligações que mantêm a proteína dobrada. Cada enzima tem um <b>pH ótimo</b>, que combina com o lugar onde ela trabalha.</p><p>A <b>pepsina</b> digere proteínas no estômago, muito ácido (pH perto de <span class="q">2</span>). A <b>amilase salivar</b> começa a digestão do amido na boca (pH perto de <span class="q">7</span>). A <b>tripsina</b> age no intestino delgado, levemente básico (pH perto de <span class="q">8</span>).</p>`,
    kv: [['Pepsina', 'pH cerca de 2, estômago'], ['Amilase salivar', 'pH cerca de 6,8, boca'], ['Tripsina', 'pH cerca de 8, intestino'], ['Fora do ótimo', 'atividade cai']],
    enem: `A amilase salivar quase para de agir quando chega ao estômago, por causa da acidez; a pepsina, por sua vez, não funciona no intestino. Gráficos com três "sinos" em posições diferentes do eixo do pH costumam pedir para associar cada curva ao órgão do sistema digestório.`,
    links: [L_PROT, LK.biom],
    ctl: { l: 'pH do meio', min: 0, max: 14, step: .1, v: 2, f: v => nbr(v, 1), rate: () => 1 },
    still: 3,
    drag(x, y, S) { return S.inv ? S.inv(x) : null; },
    draw(t, S) {
      const p = S.v, G = enz_caixa(1, 22), en = entrada(t);
      X.save(); X.globalAlpha = en.a; X.translate(G.x0 + G.w / 2, G.y0 + G.h / 2); X.scale(en.sc, en.sc); X.translate(-(G.x0 + G.w / 2), -(G.y0 + G.h / 2));
      const g = graph(G, { x0: 0, x1: 14, y0: 0, y1: 118, xl: 'pH', yl: 'atividade', xt: [0, 2, 4, 6, 8, 10, 12, 14].map(v => [v, String(v)]), curves: [] });
      S.inv = g.inv;
      const gr = X.createLinearGradient(G.x0, 0, G.x1, 0); gr.addColorStop(0, 'rgba(255,107,125,.45)'); gr.addColorStop(.5, 'rgba(127,224,162,.3)'); gr.addColorStop(1, 'rgba(154,107,255,.45)');
      X.fillStyle = gr; X.fillRect(G.x0 + 1, G.y1 - 6, G.w - 2, 5);
      X.save(); X.globalAlpha *= en.txt; tx('ácido', G.x0 + 8, G.y1 - 16, { s: 12, c: C.dim, a: 'left' }); tx('básico', G.x1 - 8, G.y1 - 16, { s: 12, c: C.dim, a: 'right' }); X.restore();
      PH.forEach(e => enz_area(g, x => pAct(e, x), 0, 14, 0, e.c, en.cur, .8)); PH.forEach(e => fita(g, G, x => pAct(e, x), 0, 14, e.c, 3.4, en.cur));
      X.save(); X.globalAlpha *= en.txt;
      PH.forEach((e, i) => tx(e.n, g.fx(e.o) + (i === 1 ? -14 : i === 2 ? 22 : 0), g.fy(100) - 12 - (i === 2 ? 14 : i === 1 && NAR ? 30 : 0), { s: NAR ? 12 : 13, w: 600, c: e.c, a: i === 1 ? 'right' : i === 2 ? 'left' : 'center' }));
      X.restore();
      PH.forEach((e, i) => { if (en.txt > .5) tracer(g, x => pAct(e, x), 0, 14, e.c, t + i * 2.1, 10, .75 * en.txt, 4); });
      X.save(); X.globalAlpha *= en.txt; line(g.fx(p), g.fy(0), g.fx(p), g.fy(115), C.txt, 1.5, [5, 4]); PH.forEach(e => marker(g.fx(p), g.fy(pAct(e, p)), e.c)); X.restore();
      X.restore();
      const flanco = [2, 6.1, 8.7];
      const hs = PH.map((e, i) => ({ id: 'ph' + i, n: 'Pepsina no estômago,Amilase salivar na boca,Tripsina no intestino delgado'.split(',')[i], t: ['pH perto de 2: o ácido do estômago é o meio dela. A pepsina digere proteínas.', 'pH perto de 7: o meio da boca. A amilase começa a quebrar o amido, mas quase para no estômago ácido.', 'pH perto de 8: o intestino delgado é levemente básico. A tripsina quebra proteínas ali.'][i], x: g.fx(flanco[i]), y: g.fy(pAct(e, flanco[i])), go: () => setCtl(e.o) }));
      HOT.set('ph' + (NAR ? 'n' : ''), hs); HOT.veil();
      const r = PH.map(e => [e, Math.round(pAct(e, p))]), b = r.reduce((a, x) => x[1] > a[1] ? x : a);
      cap(`<b>pH ${nbr(p, 1)}</b>: ${r.map(([e, a]) => `${e.n} <b>${a}%</b>`).join(', ')}. ${b[1] > 50 ? 'Quem mais trabalha aqui é a <b>' + b[0].n + '</b> (' + b[0].l + ').' : 'Nenhuma das três funciona bem nesse pH.'}`);
    }
  }, aoSair));

  // ---- enz/inibicao: o inibidor disputa o sítio ativo (competitivo) ou deforma a enzima por outro ponto (não competitivo) ----
  def('enz', 'inibicao', Object.assign({
    t: 'Inibição competitiva e não competitiva', s: 'quando outra molécula atrapalha', c: ENZ, loc: 'velocidade × substrato',
    alt: 'Gráfico da velocidade da reação conforme a quantidade de substrato, sem inibidor, com inibidor competitivo e com inibidor não competitivo, ao lado da enzima com o inibidor ligado',
    d: `<p><b>Inibidores</b> são moléculas que diminuem a atividade de uma enzima. O <b>inibidor competitivo</b> se parece com o substrato e ocupa o <b>sítio ativo</b>: os dois disputam o mesmo lugar. Aumentando a quantidade de substrato, ele ganha a disputa, e a reação volta a atingir a velocidade máxima.</p><p>O <b>inibidor não competitivo</b> se liga a <b>outro ponto</b> da enzima e altera a forma do sítio ativo. Aí não adianta pôr mais substrato: a velocidade máxima fica <b>menor</b>. Muitos remédios e venenos agem como inibidores de enzimas.</p>`,
    kv: [['Competitivo', 'disputa o sítio ativo'], ['Mais substrato', 'vence o competitivo'], ['Não competitivo', 'liga-se a outro sítio'], ['Velocidade máxima', 'cai só no não competitivo']],
    enem: `Exemplo clássico: as <b>sulfas</b> (sulfonamidas) se parecem com o PABA, que as bactérias usam para fazer ácido fólico, e competem pelo sítio ativo da enzima bacteriana: <b>inibição competitiva</b>. Nós não fabricamos ácido fólico (ele vem da dieta), por isso a sulfa atinge a bactéria e não as nossas células. Metais pesados, como mercúrio e chumbo, se ligam a grupos –SH (enxofre) fora do sítio ativo e mudam a forma da enzima: agem como inibidores <b>não competitivos</b> e, muitas vezes, <b>irreversíveis</b>. Pista no gráfico: se a curva com inibidor <b>alcança</b> a mesma velocidade máxima com muito substrato, é competitivo.`,
    links: [L_ENZ, LK.amino],
    ctl: escolha('Inibidor', ['nenhum', 'competitivo', 'não competitivo'], 7),
    draw(t, S) {
      const m = Math.round(S.v), V = 100, K = 1.2, en = entrada(t);
      const vel = (i, s) => i === 0 ? V * s / (K + s) : i === 1 ? V * s / (K * 5 + s) : V * .45 * s / (K + s);
      const side = !NAR, A = area();
      const G = side ? enz_caixa(.62, 8) : { x0: A.x0 + 34, y0: A.y0 + A.h * .42, x1: A.x1 - 8, y1: A.y1 - 40 }; G.w = G.x1 - G.x0; G.h = G.y1 - G.y0;
      const cor = m === 1 ? INI : ALO;
      X.save(); X.globalAlpha = en.a; X.translate(G.x0 + G.w / 2, G.y0 + G.h / 2); X.scale(en.sc, en.sc); X.translate(-(G.x0 + G.w / 2), -(G.y0 + G.h / 2));
      const g = graph(G, { x0: 0, x1: 20, y0: 0, y1: 112, xl: 'quantidade de substrato', yl: 'velocidade', xt: [[0, '0'], [10, '10'], [20, '20']], curves: [] });
      if (m) enz_area(g, s => vel(m, s), 0, 20, 0, cor, en.cur, .9); enz_area(g, s => vel(0, s), 0, 20, 0, '#C9D2E6', en.cur, m ? .35 : .9);
      fita(g, G, s => vel(0, s), 0, 20, '#C9D2E6', m ? 2.2 : 3.2, en.cur, { dash: m ? [6, 4] : null }); if (m) fita(g, G, s => vel(m, s), 0, 20, cor, 3.4, en.cur);
      X.save(); X.globalAlpha *= en.txt;
      line(G.x0, g.fy(V), G.x1, g.fy(V), 'rgba(232,237,247,.35)', 1, [3, 4]); tx('velocidade máxima', G.x1 - 6, g.fy(V) - 11, { s: 12, c: C.dim, a: 'right' });
      if (m) tx('tracejada: sem inibidor', G.x1 - 6, g.fy(V * (m === 1 ? .55 : .68)) + (m === 1 ? 26 : 0), { s: 12, c: C.dim, a: 'right' });
      X.restore();
      // o ponto percorre a curva: cada vez mais substrato; a mesma quantidade comanda quantas moléculas de substrato boiam perto da enzima
      const per = 14.3, sv = 20 * (fr(t / per)), mc = m === 0 ? '#C9D2E6' : cor;
      if (en.txt > .5) { const hb = Math.sin(fr(t / per) * PI) ** .5; X.save(); X.globalAlpha *= hb * en.txt; marker(g.fx(sv), g.fy(vel(m, sv)), mc); X.restore(); }
      X.restore();
      // a enzima e a disputa
      const s = side ? Math.min(A.w * .07, 56) : Math.min(A.h * .15, 34), ex = side ? A.x0 + A.w * .84 : A.cx, ey = side ? A.cy + 10 : A.y0 + s * 2.4, top = ey - s * .95;
      const SL = 2.4, k = Math.floor(t / SL), u = fr(t / SL), pSub = vel(1, sv) / V;
      let occ = 'sub', alo = 0;
      if (m === 1) occ = h01(k + 3) < pSub ? 'sub' : 'ini'; else if (m === 2) { occ = h01(k + 9) < .55 ? 'sub' : 'alo'; alo = occ === 'alo' ? ss(seg(u, .12, .32)) * (1 - ss(seg(u, .86, 1))) : 0; }
      X.save(); X.globalAlpha = en.txt;
      // moléculas que boiam: mais substrato à medida que o ponto avança
      const nS = 1 + Math.round(sv / 20 * 4), nI = m === 1 ? 3 : 0, W2 = side ? s * 3.6 : s * 4.2, cxm = ex, cym = ey - s * 2.9;
      const flut = (i, ty) => { const a = h01(i * 7 + ty) * TAU, w = .25 + h01(i + ty) * .25; return [cxm + Math.cos(a + t * w) * W2 * (.55 + h01(i * 3 + ty) * .45) * (side ? 1.1 : 1.5), Math.max(A.y0 + 14, cym + Math.sin(a * 1.3 + t * w * 1.2) * s * .75 - (side ? 0 : s * .15))]; };
      for (let i = 0; i < nS; i++) { const [fx0, fy0] = flut(i, 1), a = ent(sv > 0 ? 1 : 0, 0, 1); enz_peca(fx0, fy0, s * .5, 'tri', SUB, Math.sin(t * .6 + i) * .6, a); }
      for (let i = 0; i < nI; i++) { const [fx0, fy0] = flut(i + 20, 2); enz_peca(fx0, fy0, s * .5, 'ini', INI, Math.sin(t * .5 + i * 2) * .6); }
      enz_corpo(ex, ey, s, { shape: 'tri', alo, aloSite: true, t });
      const home = [ex, top + s * .06], aloP = [ex + s * .62, ey + s * .55], start = [ex - s * 1.9, top - s * 1.6];
      const glide = (a, b, f) => [lerp(a[0], b[0], ss(f)), lerp(a[1], b[1], ss(f)) - Math.sin(ss(f) * PI) * s * .35];
      if (occ === 'sub') {
        const f1 = seg(u, 0, .32), react = ss(seg(u, .38, .5)), out = ss(seg(u, .62, .98)), p = glide(start, home, f1);
        if (u < .5) enz_peca(p[0], p[1], s, 'tri', react < .5 ? SUB : mixc(SUB, PRO, react), 0);
        else for (const d of [-1, 1]) { const q = [home[0] + d * out * s * 1.4, home[1] - out * s * 1.9]; X.save(); X.globalAlpha *= 1 - ss(seg(out, .8, 1)); X.translate(q[0], q[1]); X.scale(.6, .6); enz_peca(0, 0, s, 'tri', PRO, d * .4); X.restore(); }
        if (m === 2 && alo === 0 && u > .5) { }
      } else if (occ === 'ini') {
        const f1 = seg(u, 0, .3), out = ss(seg(u, .78, 1)), p = glide([ex + s * 2, top - s * 1.5], home, f1), q = [lerp(p[0], ex + s * 2, out), lerp(p[1], top - s * 1.5, out)];
        enz_peca(q[0], q[1], s, 'ini', INI, 0);
        // um substrato tenta entrar e é rebatido
        const b = seg(u, .45, .75), bb = Math.sin(b * PI); if (b > 0 && b < 1) { enz_peca(ex - s * 1.9 + bb * s * .9, top - s * 1.1 - bb * .1 * s + (1 - bb) * -s * .2, s * .8, 'tri', SUB, -.4 * bb); }
      } else {
        const f1 = seg(u, 0, .28), out = ss(seg(u, .86, 1)), p = glide([ex + s * 2.4, ey + s * 1.9], aloP, f1), q = [lerp(p[0], ex + s * 2.4, out), lerp(p[1], ey + s * 1.9, out)];
        circ(q[0], q[1], s * .19, ALO, 'rgba(11,15,28,.6)', 1.2); ell(q[0] - s * .06, q[1] - s * .07, s * .06, s * .045, 0, 'rgba(255,255,255,.6)');
        const b = seg(u, .42, .8), bb = Math.sin(b * PI); if (b > 0 && b < 1) { enz_peca(ex - s * 1.5 + bb * s * .7, top - s * 1.1 + (1 - bb) * -s * .1, s * .85, 'tri', SUB, -.5 * bb); }
      }
      // legendas curtas junto da enzima
      if (m === 1) enz_pill(side ? (occ === 'ini' ? 'inibidor no sítio ativo' : 'substrato no sítio ativo') : (occ === 'ini' ? 'inibidor competitivo' : 'substrato no sítio'), ex, ey + s * 1.45, occ === 'ini' ? INI : SUB);
      if (m === 2) enz_pill(occ === 'alo' ? 'inibidor em outro sítio' : 'enzima livre', ex, ey + s * 1.45, occ === 'alo' ? ALO : C.txt);
      if (m === 0) enz_pill('sem inibidor', ex, ey + s * 1.45, C.txt);
      X.restore();
      const hs = [
        { id: 'sitio', n: 'Sítio ativo', t: m === 1 ? 'Substrato e inibidor competitivo se parecem e disputam este lugar. Com mais substrato, ele ganha a disputa com mais frequência.' : m === 2 ? 'Com o inibidor em outro ponto, a forma deste sítio muda e o substrato não se encaixa direito.' : 'Onde o substrato se encaixa e a reação acontece.', x: ex, y: top + s * .35, go: null },
        { id: 'aloste', n: 'Outro ponto da enzima', t: 'O inibidor não competitivo se liga aqui, longe do sítio ativo, e muda a forma da enzima. Mais substrato não resolve.', x: aloP[0], y: aloP[1], go: m !== 2 ? () => setCtl(2) : null },
        { id: 'vmax', n: 'Velocidade máxima', t: m === 2 ? 'Com o inibidor não competitivo a curva para num patamar mais baixo: parte das enzimas fica inativa.' : 'A enzima trabalha no máximo quando todas estão ocupadas por substrato.', x: g.fx(15.5), y: g.fy(V), go: null },
        { id: 'curva', n: m === 0 ? 'Sem inibidor' : m === 1 ? 'Curva com inibidor competitivo' : 'Curva com inibidor não competitivo', t: m === 0 ? 'A velocidade sobe com o substrato e chega ao máximo.' : m === 1 ? 'Sobe mais devagar, mas com muito substrato alcança a mesma velocidade máxima.' : 'Sobe e para em cerca de metade da velocidade máxima, mesmo com muito substrato.', x: g.fx(m === 1 ? 7 : 5), y: g.fy(vel(m, m === 1 ? 7 : 5)), go: m === 0 ? () => setCtl(1) : null }];
      HOT.set('inib' + m + (NAR ? 'n' : ''), hs); HOT.veil();
      cap(m === 0 ? 'Sem inibidor: mais substrato, mais velocidade, até a enzima trabalhar no máximo.' : m === 1 ? '<b>Competitivo</b> (vermelho): com muito substrato a curva <b>alcança</b> a velocidade máxima, porque o substrato vence a disputa pelo sítio ativo.' : '<b>Não competitivo</b> (azul): o inibidor deforma o sítio ativo a partir de outro ponto; mesmo com muito substrato a curva <b>não alcança</b> a máxima.');
    }
  }, aoSair));

  // ================= VITAMINAS =================
  const VIT = {
    A: { n: 'A', q: 'retinol', sol: 'lipo', f: 'visão com pouca luz (forma o pigmento da retina), pele e mucosas, defesa do corpo', fa: 'cegueira noturna e olho seco (xeroftalmia)', fo: 'fígado, gema de ovo, leite; betacaroteno (que o corpo transforma em vitamina A) na cenoura, abóbora, manga e folhas verde-escuras', c: '#FF9A3C' },
    D: { n: 'D', q: 'calciferol', sol: 'lipo', f: 'absorção de cálcio e fósforo no intestino: ossos e dentes', fa: 'raquitismo em crianças; osteomalácia em adultos', fo: 'produzida na própria pele exposta ao sol; peixes gordurosos (sardinha, salmão), gema de ovo, fígado', c: '#F7C13B' },
    E: { n: 'E', q: 'tocoferol', sol: 'lipo', f: 'antioxidante: protege as membranas das células', fa: 'rara; problemas nos nervos e músculos', fo: 'óleos vegetais, castanhas, sementes', c: '#C8E07A' },
    K: { n: 'K', q: 'filoquinona', sol: 'lipo', f: 'coagulação do sangue', fa: 'sangramentos e manchas roxas com facilidade', fo: 'folhas verde-escuras (couve, espinafre, brócolis); bactérias do intestino também produzem', c: '#3FBF6A' },
    C: { n: 'C', q: 'ácido ascórbico', sol: 'hidro', f: 'formação do colágeno (pele, gengiva, vasos, cicatrização); antioxidante; ajuda a absorver ferro', fa: 'escorbuto', fo: 'acerola, goiaba, caju, laranja, limão, pimentão, couve', c: '#FF6B7D' },
    B1: { n: 'B1', q: 'tiamina', sol: 'hidro', f: 'aproveitamento da energia dos carboidratos; nervos e coração', fa: 'beribéri', fo: 'cereais integrais (a película do arroz), feijão e outras leguminosas, carne de porco', c: '#9DB8FF' },
    B9: { n: 'B9', q: 'ácido fólico', sol: 'hidro', f: 'divisão celular e formação do DNA; muito importante no início da gestação', fa: 'anemia; na gestação, falhas no fechamento do tubo neural do bebê', fo: 'folhas verde-escuras, feijão, lentilha, fígado', c: '#4FB8E6' },
    B12: { n: 'B12', q: 'cobalamina', sol: 'hidro', f: 'formação das hemácias e do DNA; sistema nervoso', fa: 'anemia perniciosa', fo: 'só alimentos de origem animal: carnes, fígado, peixes, ovos, leite', c: '#C77DFF' }
  };
  const VK = ['A', 'D', 'E', 'K', 'C', 'B1', 'B9', 'B12'];
  // ícones de alimentos desenhados aqui (sem imagens externas)
  function vit_alimento(k, x, y, r, t) {
    X.save(); X.translate(x, y); const L = c => { X.fillStyle = c; X.fill(); X.strokeStyle = 'rgba(11,15,28,.55)'; X.lineWidth = 1; X.stroke(); };
    switch (k) {
      case 'laranja': X.beginPath(); X.arc(0, 0, r, 0, TAU); L('#FF9A3C'); circ(r * .1, -r, r * .16, '#3FBF6A'); break;
      case 'acerola': for (const [a, b] of [[-.45, .15], [.42, .22], [0, -.35]]) { X.beginPath(); X.arc(a * r, b * r, r * .5, 0, TAU); L('#E0364A'); } break;
      case 'peixe': X.beginPath(); X.ellipse(-r * .15, 0, r * .85, r * .45, 0, 0, TAU); L('#9DB8FF'); X.beginPath(); X.moveTo(r * .55, 0); X.lineTo(r * 1.05, -r * .42); X.lineTo(r * 1.05, r * .42); X.closePath(); L('#9DB8FF'); circ(-r * .62, -r * .08, r * .08, '#0B0F1C'); break;
      case 'ovo': X.beginPath(); X.ellipse(0, 0, r, r * .8, 0, 0, TAU); L('#F3EFE6'); X.beginPath(); X.arc(r * .05, 0, r * .4, 0, TAU); L('#F7C13B'); break;
      case 'sol': circ(0, 0, r * .5, '#FFC53D'); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * .3; line(Math.cos(a) * r * .66, Math.sin(a) * r * .66, Math.cos(a) * r, Math.sin(a) * r, '#FFC53D', 2.5); } break;
      case 'cenoura': X.beginPath(); X.moveTo(-r * .38, -r * .55); X.lineTo(r * .38, -r * .55); X.lineTo(0, r); X.closePath(); L('#FF8A2A'); for (const a of [-.45, 0, .45]) line(0, -r * .55, Math.sin(a) * r * .5, -r * 1.05, '#3FBF6A', 3); break;
      case 'figado': X.beginPath(); X.ellipse(0, 0, r, r * .6, -.2, 0, TAU); L('#8E2F3B'); break;
      case 'folha': X.beginPath(); X.ellipse(0, 0, r * .5, r, .5, 0, TAU); L('#2A9450'); line(-r * .4, r * .7, r * .4, -r * .7, '#7FE0A2', 1.2); break;
      case 'arroz': X.beginPath(); X.arc(0, r * .05, r * .95, 0, PI); X.closePath(); L('#5B6C99'); for (let i = 0; i < 9; i++) { X.beginPath(); X.ellipse(-r * .55 + (i % 5) * r * .27, -r * .05 - (i > 4 ? r * .2 : 0), r * .1, r * .2, .6, 0, TAU); L('#C9A86A'); } break;
      case 'feijao': for (let i = 0; i < 5; i++) { X.beginPath(); X.ellipse((i - 2) * r * .38, Math.sin(i * 2) * r * .22, r * .22, r * .32, .3 * i, 0, TAU); L('#7A3424'); } break;
      case 'carne': X.beginPath(); X.ellipse(0, 0, r, r * .68, .2, 0, TAU); L('#D7303B'); X.beginPath(); X.ellipse(r * .35, -r * .1, r * .26, r * .18, 0, 0, TAU); L('#F3EFE6'); break;
      case 'leite': rr(-r * .5, -r * .85, r, r * 1.7, 4, '#F3EFE6', 'rgba(11,15,28,.55)', 1); rr(-r * .5, -r * .2, r, r * .5, 0, '#4B7BFF'); break;
    }
    X.restore();
  }
  const FOOD = { A: ['figado', 'cenoura', 'ovo'], D: ['sol', 'peixe', 'ovo'], C: ['acerola', 'laranja', 'folha'], B1: ['arroz', 'feijao', 'carne'], B12: ['carne', 'peixe', 'leite'] };
  const FN = { laranja: 'laranja', acerola: 'acerola', peixe: 'peixe', ovo: 'ovo', sol: 'sol na pele', cenoura: 'cenoura', figado: 'fígado', folha: 'couve', arroz: 'arroz integral', feijao: 'feijão', carne: 'carne', leite: 'leite' };

  // figuras de IA (figura-ia.js): copos com água e óleo (A) e alimentos (B); os scripts das imagens só carregam quando a cena abre
  const COMIDA = [
    { id: 'laranja', n: 'laranja', em: [9, 51], r: 7.5, v: ['C'], d: 'Rica em vitamina C, hidrossolúvel. Como o corpo não a guarda, ela precisa vir da comida quase todo dia.' },
    { id: 'cenoura', n: 'cenoura', em: [23, 52], r: 7, v: ['A'], d: 'Tem betacaroteno, que o corpo transforma em vitamina A. Um pouco de gordura no prato ajuda a absorvê-lo.' },
    { id: 'salmao', n: 'salmão', em: [36, 52], r: 6.8, v: ['D', 'B12'], d: 'Peixe gorduroso, fonte de vitamina D e de B12. A vitamina D também é produzida na pele com a luz do sol.' },
    { id: 'ovo', n: 'ovo', em: [49.5, 55], r: 4.8, v: ['A', 'D', 'B12'], d: 'A gema tem vitaminas A e D, e o ovo tem B12, que só vem de alimentos de origem animal.' },
    { id: 'brocolis', n: 'brócolis', em: [62, 49], r: 8, v: ['K', 'B9', 'C'], d: 'Verdura verde-escura com vitamina K (coagulação), ácido fólico (B9) e vitamina C.' },
    { id: 'graos', n: 'grãos integrais', em: [78, 53], r: 7, v: ['B1'], d: 'A película e o gérmen dos grãos guardam a vitamina B1 (tiamina), que o polimento retira.' },
    { id: 'abacate', n: 'abacate', em: [91.5, 52], r: 7, v: ['E'], d: 'Fruta gordurosa com vitamina E, um antioxidante que protege as membranas das células.' }
  ];
  const TIP_FIG = window.LAB_FIGIA ? LAB_FIGIA({
    nome: 'Vitaminas na água e no óleo e alimentos ricos em vitaminas', mask: { miolo: .7, borda: 1 },
    vistas: [{ id: 'a', img: 'biologia-molecular-vit-tipos-a', nome: 'Água e óleo' }, { id: 'b', img: 'biologia-molecular-vit-tipos-b', nome: 'Alimentos', recorte: [0, .2, 1, .6] }],
    hs: [
      { id: 'agua', c: '#7FD4F0', em: { a: [29.5, 28] }, t: 'Copo com água', d: 'As vitaminas C e do complexo B são polares e se dissolvem na água. O excesso sai na urina.' },
      { id: 'oleo', c: '#F2D24B', em: { a: [70.5, 28] }, t: 'Copo com óleo', d: 'As vitaminas A, D, E e K são apolares e se dissolvem na gordura. Ficam guardadas no fígado e no tecido adiposo.' }
    ].concat(COMIDA.map(f => ({ id: f.id, c: VIT[f.v[0]].c, em: { b: f.em }, t: f.n[0].toUpperCase() + f.n.slice(1), d: f.d, z: 2.6 })))
  }) : null;
  def('vit', 'tipos', {
    t: 'Hidrossolúveis e lipossolúveis', s: 'onde cada vitamina se dissolve', c: VITC, loc: 'vitaminas na água e no óleo',
    alt: 'Dois recipientes, um com água e outro com óleo; as vitaminas C e do complexo B ficam na água e as vitaminas A, D, E e K ficam no óleo',
    d: `<p><b>Vitaminas</b> são substâncias orgânicas de que o corpo precisa em <b>quantidades pequenas</b> e que, em geral, não consegue fabricar: vêm da alimentação. Elas não fornecem energia nem constroem tecidos; muitas funcionam como <b>coenzimas</b>, ajudantes das enzimas.</p><p>As <b>lipossolúveis</b> (A, D, E e K) se dissolvem em gordura: são absorvidas junto com ela e ficam <b>armazenadas</b> no fígado e no tecido adiposo, por isso o excesso pode se acumular e intoxicar (hipervitaminose). As <b>hidrossolúveis</b> (C e as do complexo B) se dissolvem em água: o excesso sai pela <b>urina</b> e é preciso consumi-las com frequência. A B12 é a exceção: o fígado guarda reserva para anos.</p>`,
    kv: [['Lipossolúveis', 'A, D, E, K'], ['Hidrossolúveis', 'C e complexo B'], ['Excesso de lipossolúvel', 'acumula'], ['Excesso de hidrossolúvel', 'sai na urina']],
    enem: `Decore o "<b>ADEK</b>": as quatro lipossolúveis. Questões ligam isso a dietas sem gordura nenhuma (atrapalham a absorção de A, D, E e K) e ao risco de tomar vitamina A ou D por conta própria. Lembre também que a vitamina D é a única que o corpo produz em boa quantidade, na pele, com a luz do sol.`,
    links: [['Enzimas', '#enz/encaixe'], LK.tri],
    ctl: escolha('Vitamina', VK.map(k => 'vitamina ' + VIT[k].n), 4),
    draw(t, S) {
      const A = area(), vi = Math.max(0, Math.min(VK.length - 1, Math.round(S.v) || 0)), key = VK[vi], v = VIT[key];
      if (S.vSel !== key) { S.vSel = key; S.t0 = t; }                      // cada vitamina escolhida cai no seu copo
      const dp = S.paused ? 1 : seg(t - S.t0, 0, 1.2);
      if (TIP_FIG) TIP_FIG.desenhar(X, { x: A.x0, y: A.y0, w: A.w, h: A.h - (NAR ? 0 : 8) }, {
        sobre(R) {
          const r = Math.max(NAR ? 10 : 12, R.s * 2.5);
          if (R.vista === 'a') {
            // vista A: cada vitamina na fileira do seu copo; a escolhida cai, atravessa a superfície e se dissolve
            [['hidro', 29.5, 'hidrossolúveis', '#7FD4F0', 'água'], ['lipo', 70.5, 'lipossolúveis', '#F2D24B', 'óleo']].forEach(([sol, gx, cat, cc, nome]) => {
              const [lx, ly] = R.pt(gx, 89), [nx, ny] = R.pt(gx, 12); tx(cat, lx, ly, { s: 13, w: 700, c: cc }); tx(nome, nx, ny, { s: 13, c: C.dim });
              const ks = VK.filter(q => VIT[q].sol === sol);
              ks.forEach((q, j) => {
                const sx0 = gx + (j - (ks.length - 1) / 2) * 7.2, on = q === key; let [px, py] = R.pt(sx0, 63);
                if (on) {
                  const yy = lerp(6, 63, dp * dp), [qx, qy] = R.pt(sx0, yy), [, sy] = R.pt(sx0, 33); px = qx; py = qy;
                  if (yy > 33 && dp < 1) { const kk = seg(yy, 33, 55); X.save(); X.globalAlpha *= 1 - kk; ell(px, sy, r * (1 + kk * 2.2), r * .35 * (1 + kk * 2.2), 0, null, 'rgba(232,237,247,.8)', 1.2); X.restore(); }
                  if (dp >= 1) for (let n = 0; n < 2; n++) { const f = fr((t - S.t0) * .45 + n / 2), g = X.createRadialGradient(px, py, r * .6, px, py, r * (1.2 + f * 2.6)); g.addColorStop(0, rgba(VIT[q].c, .38 * (1 - f))); g.addColorStop(1, rgba(VIT[q].c, 0)); X.fillStyle = g; X.beginPath(); X.arc(px, py, r * (1.2 + f * 2.6), 0, TAU); X.fill(); }
                }
                circ(px, py, r + (on ? 3 : 0), on ? VIT[q].c : rgba(VIT[q].c, .5), on ? '#fff' : 'rgba(11,15,28,.55)', on ? 2.5 : 1);
                tx(VIT[q].n, px, py + .5, { s: Math.max(12, Math.min(16, r * .78)), w: 700, c: '#0B0F1C', bg: false });
              });
            });
          } else {
            // vista B: os alimentos ricos na vitamina escolhida ganham um anel que se fecha e a ficha da vitamina
            COMIDA.forEach(f => {
              if (!f.v.includes(key)) return; const [px, py] = R.pt(f.em[0], f.em[1]), rr2 = R.s * f.r;
              X.beginPath(); X.ellipse(px, py, rr2, rr2 * .9, 0, -PI / 2, -PI / 2 + TAU * ss(dp)); X.strokeStyle = v.c; X.lineWidth = 2.5; X.stroke();
              tok(px, py - rr2 * .9 - 14, 'vitamina ' + v.n, v.c, { a: ss(seg(dp, .4, 1)) });
              const [, ny] = R.pt(f.em[0], 72); tx(f.n, px, ny, { s: 13, w: 600, c: v.c });
            });
          }
        }
      });
      cap(`<b>Vitamina ${v.n}</b> (${v.q}), <b>${v.sol === 'lipo' ? 'lipossolúvel' : 'hidrossolúvel'}</b>: ${v.f}. ${v.sol === 'lipo' ? 'Fica guardada no fígado e na gordura.' : key === 'B12' ? 'O excesso sai na urina, mas o fígado guarda reserva.' : 'O excesso sai na urina.'}`);
    }
  });

  // avitaminoses: sintoma desenhado → vitamina que falta → fontes. A resposta aparece depois de uma pausa,
  // para o aluno tentar lembrar antes (prática de recuperação).
  const DOE = [['Escorbuto', 'C', 'gengivas que sangram, dentes moles, feridas que demoram a fechar'], ['Raquitismo', 'D', 'ossos fracos e deformados; nas crianças, pernas arqueadas'], ['Cegueira noturna', 'A', 'dificuldade de enxergar com pouca luz'], ['Beribéri', 'B1', 'fraqueza, formigamento, problemas nos nervos e no coração'], ['Anemia perniciosa', 'B12', 'poucas hemácias, grandes e imaturas; cansaço e formigamento']];
  function vit_sintoma(i, x, y, s, t) {
    X.save(); X.translate(x, y);
    if (i === 0) { X.beginPath(); X.arc(0, -s * .1, s * .8, PI * .05, PI * .95); X.lineTo(-s * .8, -s * .1); X.closePath(); X.fillStyle = '#F58FB0'; X.fill(); for (let j = 0; j < 6; j++) rr(-s * .66 + j * s * .22, -s * .14, s * .18, s * .44, 4, '#F3EFE6', 'rgba(11,15,28,.5)', 1); for (let j = 0; j < 5; j++) circ(-s * .45 + j * s * .22, s * .32 + fr(t * .4 + j * .21) * s * .45, s * .05, '#D7303B'); }
    else if (i === 1) { const b = .25 + Math.sin(t) * .04; for (const d of [-1, 1]) { X.beginPath(); X.moveTo(d * s * .2, -s * .8); X.quadraticCurveTo(d * s * (.2 + b * 2.2), 0, d * s * .2, s * .8); X.strokeStyle = '#F3EFE6'; X.lineWidth = s * .16; X.lineCap = 'round'; X.stroke(); circ(d * s * .2, -s * .8, s * .12, '#F3EFE6'); circ(d * s * .2, s * .8, s * .12, '#F3EFE6'); } }
    else if (i === 2) { ell(0, 0, s * .9, s * .5, 0, '#F3EFE6'); circ(0, 0, s * .35, '#4B7BFF'); circ(0, 0, s * .17, '#0B0F1C'); X.fillStyle = 'rgba(11,15,28,.6)'; X.fillRect(-s, -s, s * 2, s * 2); X.beginPath(); X.arc(s * .7, -s * .7, s * .28, PI * .55, PI * 1.6); X.arc(s * .8, -s * .78, s * .22, PI * 1.5, PI * .6, true); X.fillStyle = '#FFE1A6'; X.fill(); }
    else if (i === 3) { circ(0, -s * .55, s * .22, '#C9D2E6'); X.strokeStyle = '#C9D2E6'; X.lineWidth = s * .12; X.lineCap = 'round'; X.beginPath(); X.moveTo(0, -s * .3); X.lineTo(0, s * .3); X.moveTo(0, -s * .15); X.lineTo(-s * .4, s * .15); X.moveTo(0, -s * .15); X.lineTo(s * .42, s * .1 + Math.sin(t * 8) * s * .05); X.moveTo(0, s * .3); X.lineTo(-s * .25, s * .85); X.moveTo(0, s * .3); X.lineTo(s * .25, s * .85); X.stroke(); for (let j = 0; j < 4; j++) circ(s * .55 + Math.sin(t * 9 + j) * s * .06, s * .02 + j * s * .09, s * .035, AMB); }
    else { for (let j = 0; j < 7; j++) { const a = j / 7 * TAU + t * .2, d = s * (.25 + .45 * ((j * 37) % 7) / 7), big = j % 2 === 0; circ(Math.cos(a) * d, Math.sin(a) * d, s * (big ? .25 : .16), big ? '#B02A3A' : '#D7303B', 'rgba(11,15,28,.5)', 1); circ(Math.cos(a) * d, Math.sin(a) * d, s * (big ? .09 : .06), 'rgba(11,15,28,.25)'); } }
    X.restore();
  }
  // figuras de IA: olho em corte (A, vitamina A) e pernas normais e com raquitismo (B, vitamina D).
  // Os pontos só aparecem depois da resposta, para não entregar a vitamina antes de o aluno tentar lembrar.
  const AVI_FIG = window.LAB_FIGIA ? LAB_FIGIA({
    nome: 'Olho em corte e pernas com raquitismo', trocar: false, mask: { miolo: .66, borda: .99 },
    vistas: [{ id: 'a', img: 'biologia-molecular-vit-avitaminoses-a', nome: 'Olho' }, { id: 'b', img: 'biologia-molecular-vit-avitaminoses-b', nome: 'Pernas' }],
    hs: [
      { id: 'retina', c: VIT.A.c, em: { a: [71, 33] }, t: 'Retina', d: 'Os bastonetes enxergam com pouca luz usando a rodopsina, um pigmento feito a partir da vitamina A. Sem ela, a visão no escuro falha.' },
      { id: 'cornea', c: '#8FD8FF', em: { a: [13, 40] }, t: 'Córnea', d: 'Na falta grave de vitamina A, a córnea e a conjuntiva ressecam (xeroftalmia) e podem até ulcerar.' },
      { id: 'nervo', c: '#F2C14E', em: { a: [88, 54] }, t: 'Nervo óptico', d: 'Leva ao cérebro os sinais que os bastonetes e os cones produzem.' },
      { id: 'normal', c: '#7FE0A2', em: { b: [24, 34] }, t: 'Ossos normais', d: 'Com vitamina D, o intestino absorve cálcio e fósforo, e o osso em crescimento se mineraliza e fica rígido.' },
      { id: 'arco', c: VIT.D.c, em: { b: [53.5, 36] }, t: 'Fêmur arqueado', d: 'Sem vitamina D falta cálcio no osso em crescimento: ele fica mole e entorta com o peso do corpo.' },
      { id: 'joelho', c: VIT.D.c, em: { b: [72, 49] }, t: 'Joelhos afastados', d: 'As pernas em arco são o sinal típico do raquitismo em crianças que começam a andar.' }
    ]
  }) : null;
  // olho: a luz diminui e aumenta devagar; o raio chega à retina, onde a rodopsina (vitamina A) capta a pouca luz
  function avi_olho(R, tl, parado) {
    const dk = parado ? .6 : .5 - .5 * Math.cos(tl * .8);
    R.veu(.55 * dk);
    const [x1, y1] = R.pt(3, 49), [x2, y2] = R.pt(67, 50); photon(x1, y1, x2, y2, tl, .35 + .55 * (1 - dk));
    const g = X.createRadialGradient(x2, y2, 0, x2, y2, R.s * 6), a = .25 + .35 * (1 - dk); g.addColorStop(0, rgba(VIT.A.c, a)); g.addColorStop(1, rgba(VIT.A.c, 0)); X.fillStyle = g; X.beginPath(); X.arc(x2, y2, R.s * 6, 0, TAU); X.fill();
    const [lx, ly] = R.pt(50, 7); tx(dk > .5 ? 'pouca luz' : 'luz do dia', lx, ly, { s: 13, w: 600, c: dk > .5 ? C.dim : C.txt });
  }
  // pernas: o eixo de cada perna se desenha de cima para baixo; reto na perna normal, curvo na perna com raquitismo
  function avi_pernas(R, tl, parado) {
    const k = parado ? 1 : ss(seg(tl, .2, 1.8)), seq = (p, c, dash) => { const P = p.map(q => R.pt(q[0], q[1])), n = 24, pts = []; for (let j = 0; j <= n * k; j++) pts.push(pth(P, j / n)); if (pts.length > 1) poly(pts, c, 2.5, dash); };
    seq([[23.6, 21], [24.6, 35], [25.6, 48], [26.3, 62], [27, 80]], '#7FE0A2', [6, 5]);
    const [a1, a2] = [R.pt(58.5, 21), R.pt(60.5, 80)]; line(a1[0], a1[1], a2[0], a2[1], 'rgba(232,237,247,.3)', 1, [3, 5]);
    seq([[59, 21], [56, 30], [55, 40], [56.5, 49], [57.2, 60], [59, 70], [61, 80]], AMB, [6, 5]);
  }
  def('vit', 'avitaminoses', {
    t: 'Avitaminoses', s: 'a doença, a vitamina que falta e onde encontrá-la', c: VITC, loc: 'carência de vitaminas',
    alt: 'Desenho do sinal de cada doença por falta de vitamina, a vitamina que falta e três alimentos que a contêm',
    d: `<p><b>Avitaminose</b> é a doença causada pela falta de uma vitamina. Várias foram descobertas por observação: marinheiros em longas viagens tinham <b>escorbuto</b> até levarem frutas cítricas a bordo; o <b>beribéri</b> se espalhou na Ásia quando o arroz passou a ser comido polido, sem a película rica em vitamina B1.</p><p>Na <b>anemia perniciosa</b>, a B12 até chega pela comida, mas não é absorvida: o estômago deixa de produzir o <b>fator intrínseco</b>, proteína necessária para absorver a vitamina B12 no intestino (em geral por uma doença autoimune). A falta de B12 na dieta causa uma anemia parecida. Por isso, quem não come nenhum alimento de origem animal precisa de B12 suplementada: as plantas não a fornecem.</p>`,
    kv: [['Escorbuto', 'vitamina C'], ['Raquitismo', 'vitamina D'], ['Cegueira noturna', 'vitamina A'], ['Beribéri', 'vitamina B1'], ['Anemia perniciosa', 'vitamina B12']],
    enem: `A associação que mais cai: <b>escorbuto, falta de C</b>; <b>raquitismo, falta de D</b>; <b>cegueira noturna, falta de A</b>; <b>beribéri, falta de B1</b>; <b>anemia perniciosa, falta de B12</b>. O raquitismo aparece ligado à falta de <b>sol</b> (crianças sem exposição à luz solar) e o escorbuto, à falta de alimentos frescos. Antes de a resposta aparecer, tente lembrar qual vitamina falta.`,
    links: [['Hidro e lipossolúveis', '#vit/tipos'], LK.biom],
    ctl: escolha('Doença', DOE.map(d => d[0]), 8),
    still: 4,
    init(S) { S.vEnt = null; },
    draw(t, S) {
      const i = Math.round(S.v), d = DOE[i], v = VIT[d[1]], A = area();
      if (S.vEnt !== i) { S.vEnt = i; S.t0 = t; }   // a resposta aparece 2,5 s depois de trocar de doença
      const rev = ss(seg(t - S.t0, 2.5, 3.2)) || (S.paused ? 1 : 0);
      const s = NAR ? Math.min(34, A.h * .13) : Math.min(A.h * .18, 66), cx = NAR ? A.cx : A.x0 + A.w * .26, cy = NAR ? A.y0 + s * 1.55 : A.cy - 10;
      // cegueira noturna e raquitismo têm figura de IA (olho em corte e pernas); as outras carências seguem com o desenho animado
      const fv = i === 2 ? 'a' : i === 1 ? 'b' : null;
      let ny = cy + s * 1.35 + 18, ax = cx + s * 1.55, ay = cy;
      if (fv && AVI_FIG) {
        const box = NAR ? { x: A.x0, y: A.y0, w: A.w, h: A.h * .4 } : { x: A.x0, y: A.y0, w: A.w * .5, h: A.h - 34 };
        const R = AVI_FIG.desenhar(X, box, { vista: fv, ver: () => rev > .5, sobre: R => (fv === 'a' ? avi_olho : avi_pernas)(R, t - S.t0, S.paused) });
        ny = box.y + box.h + 14; ax = R.x + R.w * .97; ay = R.cy; tx(d[0], R.cx, ny, { s: NAR ? 15 : 17, w: 700, f: FH, c: C.txt });
      } else { circ(cx, cy, s * 1.35, 'rgba(255,255,255,.04)', 'rgba(232,237,247,.2)', 1); vit_sintoma(i, cx, cy, s, t); tx(d[0], cx, ny, { s: NAR ? 15 : 17, w: 700, f: FH, c: C.txt }); }
      const bx = NAR ? A.cx : A.x0 + A.w * .68, by = NAR ? ny + 48 : A.cy - 60, br = NAR ? 22 : 28;
      if (!NAR) arrow(ax, ay, bx - br - 12, by + 4, 'rgba(232,237,247,.4)', 1.5);
      if (rev < .02) { circ(bx, by, br, 'rgba(255,255,255,.06)', 'rgba(232,237,247,.45)', 2); tx('?', bx, by + 1, { s: NAR ? 18 : 22, w: 700, c: AMB, bg: false }); tx('qual vitamina falta?', bx, by + br + 16, { s: 13, c: C.dim }); }
      else {
        X.save(); X.globalAlpha = rev; circ(bx, by, br, v.c, '#fff', 2); tx(v.n, bx, by + .5, { s: NAR ? 15 : 19, w: 700, c: '#0B0F1C', bg: false });
        tx('falta de vitamina ' + v.n, bx, by + br + 16, { s: NAR ? 13 : 14, w: 600, c: v.c });
        const fs = FOOD[d[1]], fr0 = NAR ? 15 : 20, fy = by + br + (NAR ? 58 : 72), gap = NAR ? Math.min(92, A.w / 3) : 100;
        fs.forEach((f, j) => { const fx = bx + (j - 1) * gap; vit_alimento(f, fx, fy, fr0, t); tx(FN[f], fx, fy + fr0 + 15, { s: 12, c: C.dim }); });
        X.restore();
      }
      cap(rev < .02 ? `<b>${d[0]}</b>: ${d[2]}. Qual vitamina está faltando? Pense antes de a resposta aparecer.` : `<b>${d[0]}</b> (${d[2]}): falta de <b>vitamina ${v.n}</b> (${v.q}). Fontes: ${v.fo}.`);
    }
  });

  // ---------- prot/desnaturacao (cena de cenas-b.js): só o visual muda, com a figura de IA e a proteína numa lupa ----------
  // Feito aqui para não disputar cenas-b.js; rota, textos, controle e cards continuam os de lá.
  {
    const des = new Function('return SC')()['prot/desnaturacao'];   // o SC do motor (este arquivo tem um SC próprio nas enzimas)
    const NB = 40, R0 = rng(21), fold = [], open = [];   // a mesma cadeia da cena original (mesma semente)
    for (let i = 0; i < NB; i++) { const a = i / NB * TAU * 2.4, r = .35 + .55 * Math.abs(Math.sin(i * .9)); fold.push([Math.cos(a) * r * .8, Math.sin(a) * r * .7]); open.push([-1.6 + i / (NB - 1) * 3.2, Math.sin(i * .7) * .35 + (R0() - .5) * .3]); }
    // figura de IA (figura-ia.js): ovo cru (A) e frito (B); o script da imagem só carrega quando a cena abre
    const DES_FIG = window.LAB_FIGIA ? LAB_FIGIA({
      nome: 'Ovo na frigideira, cru e frito', mask: { miolo: .66, borda: .99 },
      // os botões de vista seguem a lição: Ovo frito sobe a temperatura e a cena corta sozinha; Ovo cru recomeça (o cozimento não se desfaz)
      aoTrocar(id) { if (id === 'b') setCtl(90); else document.getElementById('reset').click(); return false; },
      vistas: [{ id: 'a', img: 'biologia-molecular-prot-desnaturacao-a', nome: 'Ovo cru' }, { id: 'b', img: 'biologia-molecular-prot-desnaturacao-b', nome: 'Ovo frito' }],
      hs: [
        { id: 'clara', c: C.prot, em: { a: [28, 66], b: [27, 64] }, t: { a: 'Clara crua (albumina)', b: 'Clara cozida' },
          d: { a: 'A albumina está dobrada e dissolvida na água, por isso a clara é transparente.', b: 'As cadeias desenroladas se emaranham umas nas outras e espalham a luz: a clara fica branca e firme.' } },
        { id: 'gema', c: '#F2B33D', em: { a: [46, 57], b: [47, 57] }, t: 'Gema',
          d: 'Rica em lipídios e proteínas. Suas proteínas firmam numa temperatura um pouco maior, por isso a gema pode ficar mole com a clara já cozida.' },
        { id: 'calor', c: '#FF8A7A', em: { a: [13, 58], b: [22, 78] }, t: { a: 'Frigideira quente', b: 'Borda dourada' },
          d: { a: 'O calor chega por baixo e pelas bordas, por isso a clara começa a ficar branca de fora para dentro.', b: 'Onde passa de cerca de 140 °C, a água evapora e açúcares e aminoácidos reagem e escurecem.' } }
      ]
    }) : null;
    if (des && DES_FIG) {
      des.init = S => { S.k = 0; };
      des.draw = function (t, S) {
        // a desnaturação pelo calor não se desfaz: ao esfriar, a cadeia continua aberta e a clara continua branca
        const A = area(), T = S.v, alvo = Math.max(ss((T - 52) / 22), S.k); S.k += (alvo - S.k) * Math.min(1, (S.dt || 0) * 1.5 + (S.paused ? 1 : 0)); const k = S.k;
        // lupa da proteína (à esquerda no computador, embaixo no celular) e a figura do ovo na frigideira
        const rP = NAR ? Math.min(A.w * .2, A.h * .16) : Math.min(A.w * .15, A.h * .3), cx = NAR ? A.x0 + rP + 8 : A.x0 + A.w * .17, cy = NAR ? A.y0 + A.h * .6 + rP + 14 : A.cy - 14;
        const box = NAR ? { x: A.x0, y: A.y0, w: A.w, h: A.h * .58 } : { x: A.x0 + A.w * .34, y: A.y0, w: A.w * .66, h: A.h };
        const R = DES_FIG.desenhar(X, box, {
          vista: k > .5 ? 'b' : 'a',
          sobre(R) {
            // corte de transição: na vista crua, a clara fica branca da borda quente para o centro; no corte para B, o branco se funde com o ovo frito
            const kw = R.vista === 'a' ? ss(k / .5) : 1 - R.k;
            if (kw > .01) {
              const [ex, ey] = R.pt(42, 60), [gx, gy] = R.pt(46, 57), rx = R.s * 27, ry = R.s * 22 * R.h / R.w, f = Math.min(.84, 1 - kw), s1 = Math.max(0, f - .28), s2 = Math.max(s1 + .001, f);
              X.save(); X.beginPath(); X.rect(R.x - 50, R.y - 50, R.w + 100, R.h + 100); X.ellipse(gx, gy, R.s * 11.5, R.s * 11.5 * .82, 0, 0, TAU); X.clip('evenodd');
              X.translate(ex, ey); X.scale(rx, ry); const g = X.createRadialGradient(0, 0, 0, 0, 0, 1);
              g.addColorStop(s1, 'rgba(246,244,236,0)'); g.addColorStop(s2, `rgba(246,244,236,${.82 * kw})`); g.addColorStop(.86, `rgba(246,244,236,${.82 * kw})`); g.addColorStop(1, 'rgba(246,244,236,0)');
              X.fillStyle = g; X.beginPath(); X.arc(0, 0, 1, 0, TAU); X.fill(); X.restore();
            }
            const q = ss((T - 45) / 30); if (q > .02) { const [h1x, h1y] = R.pt(36, 34), [h2x, h2y] = R.pt(56, 33); heat(h1x, h1y, t, q * .8); heat(h2x, h2y, t, q * .8, .4); }
          }
        });
        // a proteína em detalhe: a mesma cadeia de antes, dentro de uma lupa ligada à clara
        X.save(); circ(cx, cy, rP, 'rgba(19,26,43,.78)', 'rgba(232,237,247,.32)', 1.5); X.beginPath(); X.arc(cx, cy, rP - 2, 0, TAU); X.clip();
        const sc = rP * .56, jj = (T / 60) * rP / 160;
        const P = fold.map((f, i) => { const o = open[i]; return [cx + lerp(f[0], o[0], k) * sc + Math.sin(t * 2 + i) * (1 + k * 4) * jj, cy + lerp(f[1], o[1], k) * sc + Math.cos(t * 1.7 + i) * (1 + k * 3) * jj]; });
        poly(P, 'rgba(232,237,247,.6)', 2); P.forEach((p, i) => circ(p[0], p[1], NAR ? 4 : 6, i % 5 === 0 ? '#B66FD9' : C.prot, 'rgba(11,15,28,.5)', 1));
        if (k < .4) for (let q = 0; q < 6; q++) { const a = P[q * 6], b = P[(q * 6 + 13) % NB]; if (Math.hypot(a[0] - b[0], a[1] - b[1]) < sc * .5) line(a[0], a[1], b[0], b[1], `rgba(143,216,255,${.6 * (1 - k * 2.5)})`, 1.5, [2, 3]); }
        X.restore();
        if (R.pronto && !NAR && R.z < 1.05) { const [hx2, hy2] = R.pt(28, 66), ang = Math.atan2(hy2 - cy, hx2 - cx); line(cx + Math.cos(ang) * rP, cy + Math.sin(ang) * rP, hx2, hy2, 'rgba(232,237,247,.28)', 1, [3, 4]); }
        tx(k < .5 ? 'forma ativa (dobrada)' : 'desnaturada (desenrolada)', NAR ? A.x0 + 6 : cx, cy - rP - 14, { w: 600, c: k < .5 ? C.prot : C.txt, a: NAR ? 'left' : 'center' });
        if (NAR) { const bx = cx + rP + 16; hbar(bx, cy + 4, A.x1 - bx - 4, 12, 1 - k, C.prot, 'função', Math.round((1 - k) * 100) + ' %'); }
        else hbar(cx - rP, cy + rP + 34, rP * 2, 12, 1 - k, C.prot, 'função', Math.round((1 - k) * 100) + ' %');
        cap(T < 45 && k > .5 ? 'Esfriou, mas a clara continua branca: a desnaturação pelo calor não se desfaz' : T < 45 ? 'Temperatura do corpo: a proteína mantém a forma e funciona' : k < .5 ? 'O calor agita a cadeia; as ligações fracas começam a se romper' : 'Desnaturada: perdeu a forma e a função, mas a sequência de aminoácidos é a mesma');
      };
    }
  }
})();
