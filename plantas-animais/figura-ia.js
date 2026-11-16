/* LAB: figura de IA no palco do canvas, com bordas esfumadas, entrada coreografada, parallax leve e pontos clicáveis (hotspots) em HTML.
   Código do Martin (padrão docs/visual/padrao-motion.md). A mesma cópia vive em anatomia/ e plantas-animais/; sem dependências, abre por file://.
   Uso: const F = LAB_FIGIA({ img: 'nome', hs: [{ id, x, y, t, d, c }] });  (x e y em % da figura)
        no draw da cena: const R = F.desenhar(X, caixa, { cam, escala, brilho, ver: h => bool });  R.pt(x%, y%) devolve o ponto na tela.
   A camada de hotspots some sozinha quando a cena deixa de chamar desenhar (troca de tópico ou de modo). */
'use strict';
(function () {
  const RED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const eOut = t => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 4); // perto de cubic-bezier(.16,1,.3,1)
  let css = false;
  function estilo() {
    if (css) return; css = true;
    const s = document.createElement('style');
    s.textContent = `
.figia{position:absolute;inset:0;pointer-events:none;z-index:1;--m-instant:90ms;--m-fast:160ms;--m-base:280ms;--e-out:cubic-bezier(.16,1,.3,1);--e-in:cubic-bezier(.7,0,.84,0)}
.figia[hidden]{display:none}
.figia .hs{position:absolute;left:0;top:0;width:44px;height:44px;margin:-22px 0 0 -22px;padding:0;border:0;border-radius:50%;background:transparent;cursor:pointer;pointer-events:auto;opacity:0;scale:.6;transition:opacity var(--m-fast) var(--e-out),scale var(--m-fast) var(--e-out);-webkit-tap-highlight-color:transparent}
.figia .hs.in{opacity:1;scale:1}
.figia .hs[hidden]{display:none}
.figia .hs::before{content:"";position:absolute;left:50%;top:50%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:var(--c);box-shadow:0 0 0 1.5px rgba(11,15,28,.9),0 0 0 2.5px rgba(232,237,247,.75);transition:transform var(--m-instant) var(--e-out),box-shadow var(--m-instant)}
.figia .hs::after{content:"";position:absolute;left:50%;top:50%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;border:1px solid var(--c);opacity:0;pointer-events:none}
.figia .hs.pulse::after{animation:figiaPulso 1.2s var(--e-out) 2}
.figia .hs.pulse1::after{animation:figiaPulso 1.2s var(--e-out) 1}
.figia .hs:hover::before,.figia .hs.on::before{transform:scale(1.25);box-shadow:0 0 0 1.5px rgba(11,15,28,.9),0 0 0 3px #FFB347}
.figia .hs:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:-6px}
@keyframes figiaPulso{0%{opacity:.6;transform:scale(1)}100%{opacity:0;transform:scale(2.2)}}
.figia .rot{position:absolute;left:0;top:0;max-width:260px;padding:10px 12px;border-radius:12px;background:rgba(11,15,28,.9);border:1px solid rgba(255,255,255,.12);box-shadow:0 8px 24px rgba(0,0,0,.45);pointer-events:none;opacity:0;transition:opacity var(--m-fast) var(--e-out),translate var(--m-fast) var(--e-out);translate:0 4px;color:var(--txt,#E8EDF7)}
.figia .rot.on{opacity:1;translate:0 0}
.figia .rot b{display:flex;align-items:center;gap:8px;font-family:var(--f-title,'Space Grotesk',sans-serif);font-weight:600;font-size:15px;line-height:1.25}
.figia .rot b i{width:10px;height:10px;border-radius:50%;flex:none;background:var(--c)}
.figia .rot span{display:block;margin-top:4px;font-size:14px;line-height:1.4;color:#D3DAEA}
@media(max-width:699px){.figia .rot{max-width:210px;padding:8px 10px}.figia .rot b{font-size:14px}.figia .rot span{font-size:13px}}
@media(prefers-reduced-motion:reduce){.figia .hs,.figia .rot{transition:none}.figia .hs.pulse::after,.figia .hs.pulse1::after{animation:none}.figia .hs::after{opacity:.5;transform:scale(1.6)}}`;
    document.head.appendChild(s);
  }

  window.LAB_FIGIA = function (cfg) {
    estilo();
    const cv = document.getElementById('cv'), tela = cv.parentNode;
    const img = new Image(); let ok = false; img.onload = () => { ok = true; }; img.src = (window.LAB_IMG || {})[cfg.img] || '';
    const lay = document.createElement('div'); lay.className = 'figia'; lay.hidden = true; cv.after(lay);
    const rot = document.createElement('div'); rot.className = 'rot'; rot.id = 'figia-' + cfg.img; rot.setAttribute('role', 'tooltip'); lay.appendChild(rot);
    const HS = cfg.hs.map((h, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'hs'; b.style.setProperty('--c', h.c); b.setAttribute('aria-label', h.t + ': ' + h.d); b.setAttribute('aria-expanded', 'false');
      b.style.transitionDelay = RED ? '0ms' : (600 + i * 60) + 'ms';
      lay.insertBefore(b, rot); return Object.assign({ b, i, px: -1e4, py: -1e4, vis: true }, h);
    });
    const F = { ativo: false, aberto: null, preso: false, t0: 0, ult: 0, cam: null, off: null, offK: '', par: [0, 0], parA: [0, 0], lin: 0, dim: 0, R: null };
    // ---------- abrir e fechar o rótulo ----------
    function abrir(h, preso) {
      if (F.aberto && F.aberto !== h) F.aberto.b.classList.remove('on'), F.aberto.b.setAttribute('aria-expanded', 'false');
      if (F.aberto !== h) F.lin = performance.now();
      F.aberto = h; F.preso = !!preso; h.b.classList.add('on'); h.b.setAttribute('aria-expanded', 'true'); h.b.setAttribute('aria-describedby', rot.id);
      rot.style.setProperty('--c', h.c); rot.innerHTML = `<b><i></i>${h.t}</b><span>${h.d}</span>`; rot.classList.add('on'); posRot(); mexeu();
      cfg.aoAbrir && cfg.aoAbrir(h.id);
    }
    function fechar() { if (!F.aberto) return; F.aberto.b.classList.remove('on'); F.aberto.b.setAttribute('aria-expanded', 'false'); F.aberto = null; F.preso = false; rot.classList.remove('on'); }
    function posRot() {
      const h = F.aberto; if (!h) return; const tw = tela.clientWidth, th = tela.clientHeight, rw = rot.offsetWidth, rh = rot.offsetHeight;
      const esq = h.px < (F.R ? F.R.cx : tw / 2), dx = tw < 700 ? 34 : 56;
      let x, y;
      if (tw < 700) { // celular: o rótulo vai acima ou abaixo do ponto, para nunca cobri-lo
        x = Math.max(8, Math.min(tw - rw - 8, h.px - rw / 2)); y = h.py < th * .45 ? h.py + 30 : h.py - rh - 30;
      } else {
        x = esq ? h.px - dx - rw : h.px + dx; y = h.py - rh / 2 - 18;
        if (x < 8) x = Math.min(tw - rw - 8, h.px + dx); if (x + rw > tw - 8) x = Math.max(8, h.px - dx - rw);
      }
      y = Math.max(8, Math.min(th - rh - 8, y)); rot.style.transform = `translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`; h.rx = x; h.ry = y; h.rw = rw; h.rh = rh;
    }
    HS.forEach(h => {
      h.b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && !F.preso) abrir(h, false); });
      h.b.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && !F.preso && F.aberto === h) fechar(); });
      h.b.addEventListener('click', () => { if (F.aberto === h && F.preso) fechar(); else abrir(h, true); });
      h.b.addEventListener('focus', () => { if (F.aberto !== h) abrir(h, false); });
      h.b.addEventListener('blur', () => { if (F.aberto === h && !F.preso) fechar(); });
      h.b.addEventListener('keydown', e => { if (e.key === 'Escape' && F.aberto) { e.stopPropagation(); fechar(); } });
    });
    tela.addEventListener('pointerdown', e => { if (F.aberto && !e.target.closest('.figia .hs')) fechar(); });
    // parallax: o ponteiro desloca a figura até 6 px; some no toque e no teclado
    tela.addEventListener('pointermove', e => { if (RED || e.pointerType !== 'mouse') return; const r = tela.getBoundingClientRect(); F.par = [((e.clientX - r.left) / r.width - .5) * -12, ((e.clientY - r.top) / r.height - .5) * -8]; });
    tela.addEventListener('pointerleave', () => { F.par = [0, 0]; });
    // pulso de convite: 2 ciclos ao abrir, mais 1 depois de 8 s sem interação
    let idle = 0;
    function mexeu() { clearTimeout(idle); if (RED || !F.ativo) return; idle = setTimeout(() => { if (!F.ativo || F.aberto) return; HS.forEach(h => { h.b.classList.remove('pulse', 'pulse1'); void h.b.offsetWidth; h.b.classList.add('pulse1'); }); }, 8000); }
    tela.addEventListener('pointermove', () => F.ativo && mexeu());
    function ligar() {
      F.ativo = true; F.t0 = performance.now(); F.cam = null; lay.hidden = false;
      HS.forEach(h => { h.b.classList.remove('in', 'pulse', 'pulse1'); });
      void lay.offsetWidth; HS.forEach(h => { h.b.classList.add('in'); if (!RED) h.b.classList.add('pulse'); });
      mexeu();
    }
    function desligar() { F.ativo = false; fechar(); lay.hidden = true; clearTimeout(idle); }
    (function vigia() { if (F.ativo && performance.now() - F.ult > 160) desligar(); requestAnimationFrame(vigia); })();

    // figura recortada (cam, em 0-1) e com bordas esfumadas, pré-desenhada num canvas de apoio
    function prepara(cam, w, h, d) {
      const k = [cam.x, cam.y, cam.w, cam.h].map(v => v.toFixed(4)).join() + '|' + Math.round(w * d) + 'x' + Math.round(h * d);
      if (k === F.offK) return F.off; F.offK = k;
      const o = F.off || document.createElement('canvas'); o.width = Math.max(1, Math.round(w * d)); o.height = Math.max(1, Math.round(h * d));
      const g = o.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, o.width, o.height); g.globalCompositeOperation = 'source-over';
      g.drawImage(img, cam.x * img.width, cam.y * img.height, cam.w * img.width, cam.h * img.height, 0, 0, o.width, o.height);
      // máscara radial elíptica: o miolo fica inteiro e as bordas somem no azul-noite do palco
      g.globalCompositeOperation = 'destination-in'; g.save(); g.translate(o.width / 2, o.height / 2); g.scale(o.width / 2, o.height / 2);
      const m = cfg.mask || {}, gr = g.createRadialGradient(0, 0, 0, 0, 0, 1); gr.addColorStop(0, '#000'); gr.addColorStop(m.miolo || .62, '#000'); gr.addColorStop(m.borda || .98, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(-1, -1, 2, 2); g.restore(); g.globalCompositeOperation = 'source-over';
      return (F.off = o);
    }

    F.desenhar = function (X, box, o = {}) {
      const agora = performance.now();
      if (!F.ativo) ligar(); F.ult = agora;
      const alvo = o.cam || { x: 0, y: 0, w: 1, h: 1 };
      // câmera: vai de A para B com curva de movimento (cerca de 700 ms); no modo reduzido, corte seco
      if (!F.cam || RED) F.cam = Object.assign({}, alvo);
      else { const k = 1 - Math.exp(-(Math.min(50, agora - (F.tc || agora))) / 140); ['x', 'y', 'w', 'h'].forEach(p => { F.cam[p] += (alvo[p] - F.cam[p]) * k; if (Math.abs(alvo[p] - F.cam[p]) < .0005) F.cam[p] = alvo[p]; }); }
      F.tc = agora;
      const cam = F.cam, ar = (cam.w * (img.width || 4)) / (cam.h * (img.height || 3));
      let w = box.w, h = w / ar; if (h > box.h) { h = box.h; w = h * ar; }
      if (box.w > 700) { const k = Math.min(1.12, box.w / w); w *= k; h *= k; } // desktop: a figura ocupa mais do palco (as bordas esfumadas absorvem o excesso)
      const x0 = box.x + (box.w - w) / 2, y0 = box.y + (box.h - h) / 2;
      // entrada: opacidade 0 para 1 e escala 1,03 para 1 em 900 ms (150 ms de fade no modo reduzido)
      const e = RED ? Math.min(1, (agora - F.t0) / 150) : eOut((agora - F.t0) / 900);
      F.parA = F.parA.map((v, i) => v + (F.par[i] - v) * .08);
      const sc = (RED ? 1 : 1.03 - .03 * e) * (o.escala || 1), ox = o.ox == null ? .5 : o.ox, oy = o.oy == null ? .5 : o.oy;
      const px = x0 + w * ox + F.parA[0], py = y0 + h * oy + F.parA[1];
      const R = F.R = {
        x: x0, y: y0, w, h, cx: x0 + w / 2, cy: y0 + h / 2, e,
        pt: (xp, yp) => { const u = (xp / 100 - cam.x) / cam.w, v = (yp / 100 - cam.y) / cam.h; return [px + (x0 + u * w - (x0 + w * ox)) * sc, py + (y0 + v * h - (y0 + h * oy)) * sc]; },
        sc,
        dentro: (xp, yp) => { const u = (xp / 100 - cam.x) / cam.w, v = (yp / 100 - cam.y) / cam.h; return u > .04 && u < .96 && v > .04 && v < .96; }
      };
      if (ok) {
        const d = Math.min(2, window.devicePixelRatio || 1), off = prepara(cam, w, h, d);
        X.save(); X.globalAlpha *= e; X.translate(px, py); X.scale(sc, sc); X.drawImage(off, -w * ox, -h * oy, w, h);
        // brilho rítmico: uma camada de luz quente por cima, só com opacidade (nunca filter em loop)
        if (o.brilho > 0) { X.globalCompositeOperation = 'lighter'; const g = X.createRadialGradient(0, 0, 0, 0, 0, Math.max(w, h) * .4); g.addColorStop(0, `rgba(229,72,77,${.16 * o.brilho})`); g.addColorStop(1, 'rgba(229,72,77,0)'); X.fillStyle = g; X.fillRect(-w * ox, -h * oy, w, h); }
        X.restore();
      }
      // camada de motion da cena (fluxos, ondas), por baixo do foco e dos rótulos
      if (o.sobre) { X.save(); X.globalAlpha *= e; try { o.sobre(R); } catch (err) { console.error(err); } X.restore(); }
      // hotspots: posição em % da figura, recalculada a cada quadro (só transform)
      const ver = o.ver || (() => true);
      HS.forEach(hh => {
        const v = !!ver(hh) && R.dentro(hh.x, hh.y); if (v !== hh.vis) { hh.vis = v; hh.b.hidden = !v; if (!v && F.aberto === hh) fechar(); }
        if (!v) return; const [sx, sy] = R.pt(hh.x, hh.y); if (Math.abs(sx - hh.px) > .3 || Math.abs(sy - hh.py) > .3) { hh.px = sx; hh.py = sy; hh.b.style.transform = `translate3d(${sx.toFixed(1)}px,${sy.toFixed(1)}px,0)`; }
      });
      // foco: o resto da figura escurece para cerca de 70% e a linha-guia se desenha em 160 ms até o rótulo
      F.dim += ((F.aberto ? 1 : 0) - F.dim) * (RED ? 1 : .2);
      const a = F.aberto;
      if (F.dim > .01 && a) {
        const g = X.createRadialGradient(a.px, a.py, 26, a.px, a.py, Math.max(90, w * .16)); g.addColorStop(0, 'rgba(11,15,28,0)'); g.addColorStop(1, `rgba(11,15,28,${.32 * F.dim})`);
        X.fillStyle = g; X.fillRect(R.x - 40, R.y - 40, R.w + 80, R.h + 80);
        posRot();
        if (a.rx != null) {
          const ex = Math.max(a.rx + 12, Math.min(a.rx + a.rw - 12, a.px)), ey = Math.max(a.ry, Math.min(a.ry + a.rh, a.py)), k = RED ? 1 : eOut((agora - F.lin) / 160);
          X.save(); X.strokeStyle = 'rgba(255,179,71,.9)'; X.lineWidth = 1; X.beginPath(); X.moveTo(a.px, a.py); X.lineTo(a.px + (ex - a.px) * k, a.py + (ey - a.py) * k); X.stroke();
          X.beginPath(); X.arc(a.px, a.py, 10, 0, Math.PI * 2); X.stroke(); X.restore();
        }
      }
      return R;
    };
    F.fechar = fechar;
    return F;
  };
})();
