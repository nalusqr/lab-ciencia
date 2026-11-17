/* LAB: figura de IA interativa, versão 2 (Biologia molecular). Código do Martin, a partir de anatomia/figura-ia.js.
   Padrão: docs/visual/padrao-motion.md. Guia de uso: docs/visual/figura-ia-uso.md. Sem dependências; abre por file://.
   Novidades: zoom (roda, pinça, botões + e -), arrastar quando há zoom, Vista inicial, troca de vista A e B com fade e
   leve deslocamento de câmera, lupa de detalhe (tocar num ponto aproxima a região e abre o painel), pontos com
   coordenadas por vista e carga preguiçosa (o <script> ../img/ia/NOME.js só entra quando a cena abre).
   Uso:  const F = LAB_FIGIA({ vistas: [{ id: 'a', img: 'nome-a', nome: 'Cru' }, { id: 'b', img: 'nome-b', nome: 'Frito' }],
                               hs: [{ id, t, d, c, em: { a: [x, y], b: [x, y] }, z: 2.4 }] });   (x e y em % da figura)
         no draw da cena:  const R = F.desenhar(X, caixa, { vista, sobre(R) {}, ver: h => bool });
   A camada some sozinha quando a cena deixa de chamar desenhar (troca de tópico ou de modo). */
'use strict';
(function () {
  const RED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const eOut = t => 1 - Math.pow(1 - cl(t, 0, 1), 4);                                   // perto de cubic-bezier(.16,1,.3,1)
  const eMove = t => { t = cl(t, 0, 1); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }; // perto de (.65,0,.35,1)
  const ICO = {
    mais: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M7.5 10.5h6M10.5 7.5v6"/>',
    menos: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M7.5 10.5h6"/>',
    inicio: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    vista: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M3.5 15l4.5-4 3.5 3 3-2.5 6 4.5"/>',
    fechar: '<path d="M6 6l12 12M18 6 6 18"/>'
  };
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</g></svg>`;
  function estilo() {
    if (document.getElementById('fi2-css')) return;
    const s = document.createElement('style'); s.id = 'fi2-css';
    s.textContent = `
.fi2{position:absolute;inset:0;pointer-events:none;z-index:1;overflow:hidden}
.fi2[hidden],.fi2 [hidden]{display:none}
.fi2:focus{outline:none}.fi2:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:-2px}
.fi2 .sup{position:absolute;left:0;top:0;pointer-events:auto;touch-action:pan-y;outline:none}
.fi2 .sup.zoom{touch-action:none;cursor:grab}.fi2 .sup.arr{cursor:grabbing}
.fi2 .hs{position:absolute;left:0;top:0;width:44px;height:44px;margin:-22px 0 0 -22px;padding:0;border:0;border-radius:50%;background:transparent;cursor:pointer;pointer-events:auto;opacity:0;scale:.6;transition:opacity 160ms cubic-bezier(.16,1,.3,1),scale 160ms cubic-bezier(.16,1,.3,1);-webkit-tap-highlight-color:transparent}
.fi2 .hs.in{opacity:1;scale:1}
.fi2 .hs::before{content:"";position:absolute;left:50%;top:50%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:var(--c);box-shadow:0 0 0 1.5px rgba(11,15,28,.9),0 0 0 2.5px rgba(232,237,247,.75);transition:transform 90ms cubic-bezier(.16,1,.3,1),box-shadow 90ms}
.fi2 .hs::after{content:"";position:absolute;left:50%;top:50%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;border:1px solid var(--c);opacity:0;pointer-events:none}
.fi2 .hs.pulse::after{animation:fi2Pulso 1.2s cubic-bezier(.16,1,.3,1) 2}
.fi2 .hs.pulse1::after{animation:fi2Pulso 1.2s cubic-bezier(.16,1,.3,1) 1}
.fi2 .hs:hover::before,.fi2 .hs.on::before{transform:scale(1.25);box-shadow:0 0 0 1.5px rgba(11,15,28,.9),0 0 0 3px #FFB347}
.fi2 .hs:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:-6px}
@keyframes fi2Pulso{0%{opacity:.6;transform:scale(1)}100%{opacity:0;transform:scale(2.2)}}
.fi2 .rot{position:absolute;left:0;top:0;display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:999px;background:rgba(11,15,28,.88);border:1px solid rgba(255,255,255,.12);font:600 14px/1.2 var(--f-title,'Space Grotesk',sans-serif);color:var(--txt,#E8EDF7);white-space:nowrap;pointer-events:none;opacity:0;transition:opacity 160ms cubic-bezier(.16,1,.3,1)}
.fi2 .rot.on{opacity:1}.fi2 .rot i{width:9px;height:9px;border-radius:50%;flex:none;background:var(--c)}
.fi2 .info{position:absolute;right:16px;top:76px;width:min(340px,calc(100% - 32px));padding:12px 14px;border-radius:12px;background:var(--float,rgba(19,26,43,.94));border:1px solid var(--float-line,rgba(255,255,255,.08));box-shadow:var(--float-shadow,0 8px 24px rgba(0,0,0,.45));color:var(--txt,#E8EDF7);opacity:0;transform:translateY(8px);pointer-events:none;transition:opacity 200ms cubic-bezier(.7,0,.84,0),transform 200ms cubic-bezier(.7,0,.84,0)}
.fi2 .info.on{opacity:1;transform:none;pointer-events:auto;transition-duration:280ms;transition-timing-function:cubic-bezier(.16,1,.3,1)}
.fi2 .info .h{display:flex;align-items:center;gap:8px;padding-right:40px;font:600 16px/1.25 var(--f-title,'Space Grotesk',sans-serif)}
.fi2 .info .h i{width:10px;height:10px;border-radius:50%;flex:none;background:var(--c)}
.fi2 .info p{font-size:14px;line-height:1.45;margin:8px 0 0;color:#D3DAEA}
.fi2 .info .x{position:absolute;top:4px;right:4px;width:44px;height:44px;display:grid;place-items:center;border:0;border-radius:8px;background:none;color:var(--dim,#9DA9C4);cursor:pointer}
.fi2 .info .x:hover{color:var(--txt,#E8EDF7);background:var(--panel-2,#1B2440)}
.fi2 .info .x svg{width:20px;height:20px}
.fi2 .info .x:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
.fi2 .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.fi2-barra[hidden]{display:none}
.fi2-barra .grp{display:flex;gap:4px;flex:none}
.fi2-barra .dica{font-size:13px;color:var(--dim,#9DA9C4);margin-left:8px}
.fi2-barra button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
.fi2.esq .info{right:auto;left:16px}
@media(max-width:699px){.fi2 .info,.fi2.esq .info{left:8px;right:8px;width:auto;top:48px}.fi2-barra .dica{display:none}.fi2 .rot{font-size:13px}.fi2-barra .vis .tx{display:inline}.fi2-barra .vis button{width:auto;padding:0 10px}.fi2-barra .vis svg{display:none}}
@media(prefers-reduced-motion:reduce){.fi2 .hs,.fi2 .rot,.fi2 .info{transition-duration:150ms!important;transition-delay:0ms!important}.fi2 .hs.pulse::after,.fi2 .hs.pulse1::after{animation:none}.fi2 .hs::after{opacity:.5;transform:scale(1.6)}}`;
    document.head.appendChild(s);
  }

  // ---------- carga preguiçosa: o .js da figura (data URI) só entra no DOM quando alguém pede ----------
  const IMGS = {};
  function carregar(nome, base) {
    let r = IMGS[nome]; if (r) return r;
    r = IMGS[nome] = { img: new Image(), ok: false, falhou: false };
    const usa = () => { r.img.onload = () => { r.ok = true; }; r.img.onerror = () => { r.falhou = true; }; r.img.src = window.LAB_IMG[nome]; };
    if (window.LAB_IMG && window.LAB_IMG[nome]) usa();
    else {
      const s = document.createElement('script'); s.src = base + nome + '.js'; s.async = true;
      s.onload = () => { if (window.LAB_IMG && window.LAB_IMG[nome]) usa(); else r.falhou = true; };
      s.onerror = () => { r.falhou = true; };
      document.head.appendChild(s);
    }
    return r;
  }

  // ---------- vigia: a camada some quando a cena para de chamar desenhar por 3 quadros ----------
  const TODAS = [];
  let vigiaOn = false;
  function vigia() { for (const F of TODAS) { if (!F.ativo) continue; if (F.marca) { F.marca = false; F.falta = 0; } else if (++F.falta >= 3) F.desligar(); } requestAnimationFrame(vigia); }

  window.LAB_FIGIA = function (cfg) {
    const base = cfg.base || '../img/ia/', ZMAX = cfg.zmax || 4, ZLUPA = cfg.zlupa || 2.4;
    const VS = cfg.vistas || [{ id: 'a', img: cfg.img, nome: 'Figura' }];
    const vis = id => VS.find(v => v.id === id) || VS[0];
    const rc = id => vis(id).recorte || [0, 0, 1, 1];          // parte da imagem que vale como figura inteira, [x, y, w, h] em 0-1
    const ini = () => ({ z: 1, u: .5, v: .5 });
    const F = { ativo: false, marca: false, falta: 0, vista: VS[0].id, ovista: undefined, cam: ini(), alvo: ini(), pre: null, tr: null, t0: 0, okOnce: false, aberto: null, hov: null, R: null, dim: 0, par: [0, 0], parA: [0, 0], offK: '', tc: 0 };
    TODAS.push(F); if (!vigiaOn) { vigiaOn = true; requestAnimationFrame(vigia); }
    const txt = (h, k) => { const v = h[k]; return v && typeof v === 'object' ? (v[F.vista] || v[VS[0].id] || '') : (v || ''); };
    const onde = (h, vid) => (h.em && h.em[vid]) || (h.x != null ? [h.x, h.y] : null);
    let D = null; // DOM, montado na primeira vez que a cena abre

    function montar() {
      estilo();
      const cv = document.getElementById('cv'), tela = cv.parentNode, palco = tela.parentNode;
      const lay = document.createElement('div'); lay.className = 'fi2' + (cfg.painel === 'esq' ? ' esq' : ''); lay.hidden = true; lay.setAttribute('role', 'group'); lay.setAttribute('aria-label', (cfg.nome || 'Figura interativa') + '. Teclas: + e - para o zoom, setas para mover, 0 para a vista inicial'); lay.tabIndex = -1;
      const sup = document.createElement('div'); sup.className = 'sup'; sup.setAttribute('aria-hidden', 'true'); lay.appendChild(sup);
      const rot = document.createElement('div'); rot.className = 'rot'; rot.setAttribute('aria-hidden', 'true'); rot.innerHTML = '<i></i><span></span>';
      const info = document.createElement('div'); info.className = 'info'; info.setAttribute('role', 'region'); info.setAttribute('aria-label', 'Detalhe da figura'); info.tabIndex = -1;
      info.innerHTML = `<div class="h"><i></i><span></span></div><p></p><button type="button" class="x" aria-label="Fechar o detalhe e voltar" title="Fechar">${svg('fechar')}</button>`;
      const sr = document.createElement('div'); sr.className = 'sr'; sr.setAttribute('aria-live', 'polite');
      const HS = cfg.hs.map((h, i) => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'hs'; b.style.setProperty('--c', h.c || '#E8EDF7'); b.setAttribute('aria-expanded', 'false');
        lay.appendChild(b); return Object.assign({ b, i, px: -1e4, py: -1e4, vis: true }, h);
      });
      lay.append(rot, info, sr); cv.after(lay);
      const barra = document.createElement('div'); barra.className = 'barra fi2-barra'; barra.setAttribute('role', 'toolbar'); barra.setAttribute('aria-label', 'Controles da figura'); barra.hidden = true;
      const bt = (a, k, tx, tit, sq) => `<button type="button" data-a="${a}"${sq ? ' class="sq"' : ''} title="${tit}" aria-label="${tit}">${svg(k)}${sq ? '' : `<span class="tx">${tx}</span>`}</button>`;
      const troca = VS.length > 1 && cfg.trocar !== false;
      barra.innerHTML = (troca ? `<div class="grp vis">${VS.map(v => bt('v:' + v.id, 'vista', v.nome, 'Ver ' + v.nome.toLowerCase())).join('')}</div>` : '')
        + `<div class="grp">${bt('menos', 'menos', '', 'Afastar', 1)}${bt('mais', 'mais', '', 'Aproximar', 1)}${bt('inicio', 'inicio', 'Vista inicial', 'Voltar à vista inicial')}</div>`
        + `<span class="dica">Arraste para mover, use a roda ou a pinça para o zoom e toque num ponto</span>`;
      palco.insertBefore(barra, tela.nextSibling);
      D = { tela, lay, sup, rot, info, sr, HS, barra };
      // ---- botões ----
      barra.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return; const a = b.dataset.a;
        if (a.startsWith('v:')) trocar(a.slice(2)); else if (a === 'mais') zoomBotao(1.5); else if (a === 'menos') zoomBotao(1 / 1.5); else if (a === 'inicio') inicio(true);
      });
      // ---- pontos: passar o mouse ou focar mostra o nome; tocar ou Enter abre a lupa ----
      HS.forEach(h => {
        h.b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { F.hov = h; mexeu(); } });
        h.b.addEventListener('pointerleave', () => { if (F.hov === h) F.hov = null; });
        h.b.addEventListener('focus', () => { F.hov = h; mexeu(); });
        h.b.addEventListener('blur', () => { if (F.hov === h) F.hov = null; });
        h.b.addEventListener('click', e => { e.stopPropagation(); if (F.aberto === h) fechar(true); else lupa(h); });
      });
      info.querySelector('.x').addEventListener('click', () => fechar(true));
      // ---- teclado em qualquer peça da figura: + e - aproximam, 0 volta, setas movem com zoom, Esc fecha ----
      const tecla = e => {
        const k = e.key; let ok = true;
        if (k === '+' || k === '=') zoomBotao(1.5); else if (k === '-' || k === '_') zoomBotao(1 / 1.5); else if (k === '0') inicio(true);
        else if (k === 'Escape') { if (F.aberto) fechar(true); else if (F.alvo.z > 1.01) inicio(true); else ok = false; }
        else if (/^Arrow/.test(k) && F.alvo.z > 1.01) { const d = .08 / F.alvo.z; F.alvo.u += k === 'ArrowLeft' ? -d : k === 'ArrowRight' ? d : 0; F.alvo.v += k === 'ArrowUp' ? -d : k === 'ArrowDown' ? d : 0; limita(F.alvo); }
        else ok = false;
        if (ok) { e.preventDefault(); e.stopPropagation(); mexeu(); }
      };
      lay.addEventListener('keydown', tecla); barra.addEventListener('keydown', e => { if (!/^Arrow/.test(e.key)) tecla(e); });
      // ---- gestos na superfície da figura: arrastar move (com zoom), pinça e roda aproximam, duplo toque alterna ----
      const pts = new Map(); let ini0 = null, pin = 0;
      const rel = (x, y) => { const r = tela.getBoundingClientRect(); return [x - r.left, y - r.top]; };
      sup.addEventListener('pointerdown', e => {
        pts.set(e.pointerId, [e.clientX, e.clientY]); mexeu();
        if (pts.size === 1) ini0 = { t: performance.now(), mov: 0 };
        if (pts.size === 2) { const [a, b] = [...pts.values()]; pin = Math.hypot(a[0] - b[0], a[1] - b[1]); ini0 = null; }
        if (F.alvo.z > 1.01 || pts.size === 2) try { sup.setPointerCapture(e.pointerId); } catch (er) { /* sem captura */ }
      });
      sup.addEventListener('pointermove', e => {
        if (!pts.has(e.pointerId) || !F.R) return;
        const p = pts.get(e.pointerId), dx = e.clientX - p[0], dy = e.clientY - p[1]; pts.set(e.pointerId, [e.clientX, e.clientY]);
        if (pts.size === 2) { const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]), m = rel((a[0] + b[0]) / 2, (a[1] + b[1]) / 2); if (pin > 0 && d > 0) zoomEm(d / pin, m[0], m[1], true); pin = d; return; }
        if (ini0) ini0.mov += Math.abs(dx) + Math.abs(dy);
        if (F.alvo.z > 1.01 && (!ini0 || ini0.mov > 6)) { sup.classList.add('arr'); F.alvo.u -= dx / (F.R.w * F.alvo.z); F.alvo.v -= dy / (F.R.h * F.alvo.z); limita(F.alvo); Object.assign(F.cam, F.alvo); }
      });
      const solta = e => {
        if (!pts.has(e.pointerId)) return; pts.delete(e.pointerId); sup.classList.remove('arr'); if (pts.size < 2) pin = 0;
        if (e.type === 'pointerup' && ini0 && ini0.mov <= 6 && performance.now() - ini0.t < 500 && F.aberto) fechar(false);
        ini0 = null;
      };
      sup.addEventListener('pointerup', solta); sup.addEventListener('pointercancel', solta);
      sup.addEventListener('dblclick', e => { const [x, y] = rel(e.clientX, e.clientY); if (F.alvo.z > 1.5) inicio(false); else zoomEm(2.2 / F.alvo.z, x, y); });
      sup.addEventListener('wheel', e => {
        const f = Math.exp(-e.deltaY * (e.deltaMode ? .05 : .0015)); if (f < 1 && F.alvo.z <= 1.001) return; // sem zoom, a roda volta a rolar a página
        e.preventDefault(); const [x, y] = rel(e.clientX, e.clientY); zoomEm(f, x, y); mexeu();
      }, { passive: false });
    }

    // ---------- câmera ----------
    function limita(c) { c.z = cl(c.z, 1, ZMAX); const h = .5 / c.z; c.u = cl(c.u, h, 1 - h); c.v = cl(c.v, h, 1 - h); return c; }
    function zoomEm(f, sx, sy, direto) {
      const r = F.R; if (!r) return; const a = F.alvo, fx = (sx - r.x) / r.w - .5, fy = (sy - r.y) / r.h - .5;
      const p = a.u + fx / a.z, q = a.v + fy / a.z, z = cl(a.z * f, 1, ZMAX);
      F.alvo = limita({ z, u: p - fx / z, v: q - fy / z }); if (direto || RED) Object.assign(F.cam, F.alvo);
    }
    function zoomBotao(f) { if (!F.R) return; const fh = D.HS.find(h => h.b === document.activeElement && h.vis); zoomEm(f, fh ? fh.px : F.R.x + F.R.w / 2, fh ? fh.py : F.R.y + F.R.h / 2); avisa(F.alvo.z > 1.01 ? `Zoom de ${F.alvo.z.toFixed(1).replace('.', ',')} vezes` : 'Figura inteira'); }
    function inicio(fala) { fechar(false); F.pre = null; F.alvo = ini(); if (fala) avisa('Vista inicial'); }
    function avisa(s) { if (D) { D.sr.textContent = ''; setTimeout(() => { if (D) D.sr.textContent = s; }, 30); } }
    // ---------- lupa de detalhe ----------
    function lupa(h) {
      const p = onde(h, F.vista); if (!p) return;
      if (F.aberto && F.aberto !== h) F.aberto.b.classList.remove('on'), F.aberto.b.setAttribute('aria-expanded', 'false');
      if (!F.pre) F.pre = Object.assign({}, F.alvo);
      F.aberto = h; h.b.classList.add('on'); h.b.setAttribute('aria-expanded', 'true');
      const q = rc(F.vista); F.alvo = limita({ z: Math.max(F.alvo.z, h.z || ZLUPA), u: (p[0] / 100 - q[0]) / q[2], v: (p[1] / 100 - q[1]) / q[3] });
      const I = D.info; I.style.setProperty('--c', h.c || '#E8EDF7'); I.querySelector('.h span').textContent = txt(h, 't'); I.querySelector('p').textContent = txt(h, 'd'); I.classList.add('on');
      avisa(txt(h, 't') + '. ' + txt(h, 'd')); mexeu(); cfg.aoAbrir && cfg.aoAbrir(h.id);
    }
    function fechar(volta) {
      const h = F.aberto; if (!h) return; F.aberto = null; h.b.classList.remove('on'); h.b.setAttribute('aria-expanded', 'false'); D.info.classList.remove('on');
      if (F.pre) { F.alvo = F.pre; F.pre = null; }
      if (volta && D.lay.contains(document.activeElement) && !h.b.hidden) h.b.focus({ preventScroll: true });
    }
    // ---------- troca de vista: fade com leve deslocamento de câmera (700 ms; 150 ms no modo reduzido) ----------
    function trocar(id, auto) {
      if (!VS.some(v => v.id === id)) return;
      // a cena pode assumir a troca pedida pelo aluno (por exemplo, subir a temperatura até o ovo fritar); false cancela a troca direta
      if (!auto && cfg.aoTrocar && cfg.aoTrocar(id) === false) { if (D) D.barra.querySelectorAll('[data-a^="v:"]').forEach(b => b.setAttribute('aria-pressed', b.dataset.a === 'v:' + F.vista)); return; }
      if (D) fechar(false);
      F.pre = null; F.alvo = ini();
      if (id !== F.vista) {
        const de = F.vista; F.vista = id;
        const pronto = F.ativo && F.okOnce && IMGS[vis(de).img] && IMGS[vis(de).img].ok;
        if (pronto && !auto0) F.tr = { de, t0: 0, dir: VS.findIndex(v => v.id === id) > VS.findIndex(v => v.id === de) ? 1 : -1 };
        else { F.tr = null; Object.assign(F.cam, F.alvo); }
        if (D) { D.HS.forEach(h => h.b.classList.remove('in', 'pulse', 'pulse1')); if (!F.tr) entraHS(0); }
        if (!auto) avisa('Vista: ' + vis(id).nome);
      }
      if (D) D.barra.querySelectorAll('[data-a^="v:"]').forEach(b => b.setAttribute('aria-pressed', b.dataset.a === 'v:' + id));
    }
    let auto0 = false;
    function entraHS(atraso) {
      D.HS.forEach(h => { h.b.classList.remove('in', 'pulse', 'pulse1'); h.b.style.transitionDelay = RED ? '0ms' : (atraso + h.i * 60) + 'ms'; });
      void D.lay.offsetWidth; D.HS.forEach(h => { h.b.classList.add('in'); if (!RED) h.b.classList.add('pulse'); });
    }
    // pulso de convite: 2 ciclos ao abrir, mais 1 depois de 8 s sem interação
    let idle = 0;
    function mexeu() { clearTimeout(idle); if (RED || !F.ativo) return; idle = setTimeout(() => { if (!F.ativo || F.aberto) return; D.HS.forEach(h => { h.b.classList.remove('pulse', 'pulse1'); void h.b.offsetWidth; h.b.classList.add('pulse1'); }); }, 8000); }
    function ligar() {
      if (!D) montar();
      F.ativo = true; F.falta = 0; F.t0 = performance.now(); F.cam = ini(); F.alvo = ini(); F.pre = null; F.tr = null; F.okOnce = false;
      D.lay.hidden = false; D.barra.hidden = false; D.HS.forEach(h => h.b.classList.remove('in', 'pulse', 'pulse1'));
      D.barra.querySelectorAll('[data-a^="v:"]').forEach(b => b.setAttribute('aria-pressed', b.dataset.a === 'v:' + F.vista));
      D.tela.addEventListener('pointermove', parMove); D.tela.addEventListener('pointerleave', parSai);
    }
    F.desligar = function () {
      F.ativo = false; clearTimeout(idle); if (!D) return; fechar(false); F.hov = null; D.lay.hidden = true; D.barra.hidden = true; F.ovista = undefined;
      D.tela.removeEventListener('pointermove', parMove); D.tela.removeEventListener('pointerleave', parSai);
    };
    // parallax leve (até 6 px) só com mouse e sem zoom
    function parMove(e) { if (RED || e.pointerType !== 'mouse') return; const r = D.tela.getBoundingClientRect(); F.par = [((e.clientX - r.left) / r.width - .5) * -12, ((e.clientY - r.top) / r.height - .5) * -8]; }
    function parSai() { F.par = [0, 0]; }

    // ---------- pintura: recorte da câmera, troca de vista e máscara radial (bordas esfumadas) ----------
    let off = null;
    function pinta(w, h, d, e, vu) {
      const W2 = Math.max(1, Math.round(w * d)), H2 = Math.max(1, Math.round(h * d)), c = F.cam;
      const k = [F.vista, F.tr ? e.toFixed(3) + F.tr.de : '', c.z.toFixed(4), c.u.toFixed(4), c.v.toFixed(4), W2, H2, vu ? vu.map(n => n.toFixed(2)).join() : ''].join('|');
      if (k === F.offK) return off; F.offK = k;
      off = off || document.createElement('canvas'); if (off.width !== W2) off.width = W2; if (off.height !== H2) off.height = H2;
      const g = off.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, W2, H2);
      const um = (vv, a, dx, sc) => {
        const r = IMGS[vv.img]; if (!r || !r.ok) return; const iw = r.img.width, ih = r.img.height, q = vv.recorte || [0, 0, 1, 1];
        let sw = q[2] * iw / c.z, sh = q[3] * ih / c.z; const mx = (q[0] + q[2] * c.u) * iw, my = (q[1] + q[3] * c.v) * ih;
        if (sw / sh > W2 / H2) sw = sh * W2 / H2; else sh = sw * H2 / W2;      // a vista que sai pode ter outro formato: recorta para cobrir
        g.save(); g.globalAlpha = a; g.translate(W2 / 2 + dx, H2 / 2); g.scale(sc, sc);
        g.drawImage(r.img, mx - sw / 2, my - sh / 2, sw, sh, -W2 / 2, -H2 / 2, W2, H2); g.restore();
      };
      if (F.tr) {
        const s = RED ? 0 : W2 * .04 * F.tr.dir;
        um(vis(F.tr.de), 1, -s * e, RED ? 1 : 1 + .03 * e);                  // a vista que sai recua e desliza para o lado
        um(vis(F.vista), e, s * (1 - e), RED ? 1 : 1.04 - .04 * e);          // a que entra chega do outro lado, com fade
      } else um(vis(F.vista), 1, 0, 1);
      if (vu) { const gv = g.createRadialGradient(vu[0] * d, vu[1] * d, 30 * d, vu[0] * d, vu[1] * d, Math.max(140, w * .32) * d); gv.addColorStop(0, 'rgba(11,15,28,0)'); gv.addColorStop(1, `rgba(11,15,28,${.34 * vu[2]})`); g.fillStyle = gv; g.fillRect(0, 0, W2, H2); }
      if (cfg.mask !== false) { g.globalCompositeOperation = 'destination-in'; g.save(); g.translate(W2 / 2, H2 / 2); g.scale(W2 / 2, H2 / 2);
      const m = cfg.mask || {}, gr = g.createRadialGradient(0, 0, 0, 0, 0, 1); gr.addColorStop(0, '#000'); gr.addColorStop(m.miolo || .62, '#000'); gr.addColorStop(m.borda || .98, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(-1, -1, 2, 2); g.restore(); g.globalCompositeOperation = 'source-over'; }
      return off;
    }

    F.desenhar = function (X, box, o = {}) {
      const ag = performance.now();
      if (!F.ativo) ligar(); F.marca = true;
      if (o.vista != null && o.vista !== F.ovista) { auto0 = F.ovista === undefined; F.ovista = o.vista; trocar(o.vista, true); auto0 = false; }
      const cur = carregar(vis(F.vista).img, base);
      if (cur.ok) VS.forEach(v => carregar(v.img, base));               // a outra vista vem logo depois, ainda com a cena aberta
      if (cur.ok && !F.okOnce) { F.okOnce = true; F.t0 = ag; entraHS(600); mexeu(); }
      // caixa: a figura cabe inteira (contain) na área pedida
      const im = cur.ok ? cur.img : null, Q = rc(F.vista), ar = im ? (im.width * Q[2]) / (im.height * Q[3]) : (cfg.ar || 4 / 3);
      let w = box.w, h = w / ar; if (h > box.h) { h = box.h; w = h * ar; }
      const x0 = box.x + (box.w - w) / 2, y0 = box.y + (box.h - h) / 2;
      // câmera: segue o alvo com curva suave (cerca de 700 ms); no modo reduzido, corte
      const dt = Math.min(50, ag - (F.tc || ag)); F.tc = ag;
      if (RED) Object.assign(F.cam, F.alvo);
      else { const k = 1 - Math.exp(-dt / 120); ['z', 'u', 'v'].forEach(p => { F.cam[p] += (F.alvo[p] - F.cam[p]) * k; if (Math.abs(F.alvo[p] - F.cam[p]) < .0004) F.cam[p] = F.alvo[p]; }); }
      // troca de vista
      let e = 1;
      if (F.tr) { const nv = IMGS[vis(F.vista).img]; if (!nv || !nv.ok) e = 0; else { if (!F.tr.t0) F.tr.t0 = ag; e = RED ? cl((ag - F.tr.t0) / 150, 0, 1) : eMove((ag - F.tr.t0) / 700); } if (e >= 1) { F.tr = null; e = 1; entraHS(0); } }
      // entrada: opacidade 0 para 1 e escala 1,03 para 1 em 900 ms (150 ms de fade no modo reduzido)
      const ent = !F.okOnce ? 0 : RED ? cl((ag - F.t0) / 150, 0, 1) : eOut((ag - F.t0) / 900);
      const zoom = F.cam.z > 1.01;
      F.parA = F.parA.map((v, i) => v + ((zoom ? 0 : F.par[i]) - v) * .08);
      const sc = RED ? 1 : 1.03 - .03 * ent, ox = x0 + w / 2 + F.parA[0], oy = y0 + h / 2 + F.parA[1];
      const c = F.cam, pt = (xp, yp) => [ox + (w * ((xp / 100 - Q[0]) / Q[2] - c.u) * c.z) * sc, oy + (h * ((yp / 100 - Q[1]) / Q[3] - c.v) * c.z) * sc];
      const M = cfg.mask || {}, MI = M.miolo || .62, MB = M.borda || .98, LIM = cfg.mask === false ? 9 : Math.min(.95, (MI + MB) / 2 + .08);
      const R = F.R = { x: x0, y: y0, w, h, cx: x0 + w / 2, cy: y0 + h / 2, pt, s: w * c.z * sc / 100, k: e, ent, vista: F.vista, z: c.z, pronto: cur.ok,
        dentro: (xp, yp) => { const [sx, sy] = pt(xp, yp), a = (sx - ox) / (w * sc / 2), b = (sy - oy) / (h * sc / 2); return a * a + b * b < LIM * LIM; },
        // véu com o formato da máscara: escurece a figura sem marcar um retângulo no palco
        veu: (al, cor) => { if (al <= .005) return; X.save(); X.translate(ox, oy); X.scale(w * sc / 2, h * sc / 2); const g = X.createRadialGradient(0, 0, 0, 0, 0, 1), k = cor || '6,9,18'; g.addColorStop(0, `rgba(${k},${al})`); g.addColorStop(MI, `rgba(${k},${al})`); g.addColorStop(MB, `rgba(${k},0)`); X.fillStyle = g; X.fillRect(-1, -1, 2, 2); X.restore(); } };
      if (D.sup._k !== [x0, y0, w, h].map(Math.round).join()) { D.sup._k = [x0, y0, w, h].map(Math.round).join(); Object.assign(D.sup.style, { left: x0 + 'px', top: y0 + 'px', width: w + 'px', height: h + 'px' }); }
      D.sup.classList.toggle('zoom', zoom);
      if (cur.ok) {
        F.dim += ((F.aberto && F.aberto.vis ? 1 : 0) - F.dim) * (RED ? 1 : .2); if (F.dim < .01) F.dim = 0;
        let vu = null; if (F.dim > 0 && F.aberto) { const p = onde(F.aberto, F.vista); if (p) { const [sx, sy] = pt(p[0], p[1]); vu = [(sx - ox) / sc + w / 2, (sy - oy) / sc + h / 2, F.dim]; } }
        const d = Math.min(2, window.devicePixelRatio || 1), img = pinta(w, h, d, e, vu);
        X.save(); X.globalAlpha *= ent; X.translate(ox, oy); X.scale(sc, sc); X.drawImage(img, -w / 2, -h / 2, w, h); X.restore();
      } else {
        // enquanto a figura carrega: um pôster chapado (halo azul-noite), nunca uma tela vazia
        const p = RED ? .5 : .5 + .5 * Math.sin(ag / 400), g = X.createRadialGradient(R.cx, R.cy, 0, R.cx, R.cy, Math.max(w, h) * .45);
        g.addColorStop(0, `rgba(79,120,200,${.16 + .06 * p})`); g.addColorStop(1, 'rgba(79,120,200,0)'); X.fillStyle = g; X.fillRect(x0, y0, w, h);
        X.font = "600 13px 'Atkinson Hyperlegible Next', system-ui, sans-serif"; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = 'rgba(157,169,196,.9)'; X.fillText(cur.falhou ? 'A figura não carregou' : 'Carregando a figura', R.cx, R.cy);
      }
      // camada de motion da cena, recortada na moldura da figura
      if (o.sobre && cur.ok) { X.save(); X.beginPath(); X.rect(x0, y0, w, h); X.clip(); X.globalAlpha *= ent; try { o.sobre(R); } catch (err) { console.error(err); } X.restore(); }
      // pontos: posição em % da figura, por vista; somem durante a troca de vista
      const ver = o.ver || (() => true);
      D.HS.forEach(hh => {
        const p = onde(hh, F.vista), v = !!p && cur.ok && !F.tr && !!ver(hh) && R.dentro(p[0], p[1]);
        if (v !== hh.vis) { hh.vis = v; if (!v && document.activeElement === hh.b) D.lay.focus({ preventScroll: true }); hh.b.hidden = !v; if (!v && F.aberto === hh) fechar(false); if (!v && F.hov === hh) F.hov = null; }
        if (!v) return; const [sx, sy] = pt(p[0], p[1]);
        if (Math.abs(sx - hh.px) > .3 || Math.abs(sy - hh.py) > .3) { hh.px = sx; hh.py = sy; hh.b.style.transform = `translate3d(${sx.toFixed(1)}px,${sy.toFixed(1)}px,0)`; }
        const lab = txt(hh, 't') + ': ' + txt(hh, 'd') + ' Enter aproxima a região.'; if (hh._l !== lab) { hh._l = lab; hh.b.setAttribute('aria-label', lab); }
      });
      // foco da lupa: anel âmbar no ponto e o resto escurece um pouco (sem desfoque)
      const a = F.aberto;
      if (a && a.vis) {
        X.save(); X.strokeStyle = 'rgba(255,179,71,.95)'; X.lineWidth = 1.5; X.beginPath(); X.arc(a.px, a.py, 16, 0, Math.PI * 2); X.stroke(); X.restore();
      }
      // nome do ponto em foco (mouse ou teclado)
      const hv = F.hov && F.hov.vis && F.hov !== a ? F.hov : null, rt = D.rot;
      if (hv) {
        if (rt._id !== hv.id + F.vista) { rt._id = hv.id + F.vista; rt.style.setProperty('--c', hv.c || '#E8EDF7'); rt.querySelector('span').textContent = txt(hv, 't'); }
        const tw = D.tela.clientWidth, rw = rt.offsetWidth || 120, esq = hv.px + 22 + rw > tw - 8, x = esq ? hv.px - 22 - rw : hv.px + 22;
        rt.style.transform = `translate3d(${Math.round(x)}px,${Math.round(hv.py - 14)}px,0)`; rt.classList.add('on');
      } else rt.classList.remove('on');
      return R;
    };
    F.mostrar = id => trocar(id);
    F.fechar = () => D && fechar(false);
    F.inicio = () => D && inicio(false);
    F.lupa = id => { const h = D && D.HS.find(q => q.id === id); if (h && h.vis) lupa(h); };
    Object.defineProperty(F, 'vistaAtual', { get: () => F.vista });
    return F;
  };
})();
