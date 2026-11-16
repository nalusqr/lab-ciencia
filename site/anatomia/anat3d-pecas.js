/* LAB Anatomia e fisiologia: peças 3D próprias deste módulo (Martin), sobre o kit do módulo Vírus (../virus/vir3d.js e
   ../virus/vir3d-pecas.js, reaproveitados sem cópia: tubos dinâmicos, películas translúcidas, hemácias bicôncavas,
   sólidos cortados por plano, bolinhas instanciadas, fichas e câmera viva).
   Aqui ficam: o registro das cenas deste módulo (as faixas que mudam com o modo continuam vivas), mistura de cores para
   o sangue que troca de venoso para arterial, curvas suaves (Catmull-Rom) para vasos e tubos, base de orientação para
   folhetos de valva e botões HTML sobre o palco (o canvas 2D por cima não recebe toque no 3D).
   Desenho próprio, sem modelos de terceiros. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3) return;
  const { V } = V3, { cl, mix, add, sub, mul, nrm, len, cross } = V;

  // ---------- registro: VIR3D.cena congela getters (ctl, auto) do def(); aqui eles seguem o modo ativo ----------
  function cena(chave, o) {
    const old = SC[chave]; if (!old) return;
    V3.cena(chave, o);
    const c3 = SC[chave]; if (c3 === old) return;   // sem WebGL: fica o 2D
    ['ctl', 'auto'].forEach(k => {
      const d = Object.getOwnPropertyDescriptor(old, k);
      if (d && d.get) Object.defineProperty(c3, k, { get: () => old[k], configurable: true, enumerable: true });
    });
  }

  // ---------- cores ----------
  const hx = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const CM = {};
  // mistura quantizada em 12 degraus (o cache de cores do kit não cresce sem fim)
  function corMix(a, b, t) {
    const q = Math.round(cl(t, 0, 1) * 12), k = a + b + q; if (CM[k]) return CM[k];
    const A = hx(a), B = hx(b), f = q / 12, c = A.map((v, i) => Math.round(mix(v, B[i], f)));
    return (CM[k] = '#' + c.map(v => v.toString(16).padStart(2, '0')).join(''));
  }

  // ---------- curvas ----------
  // Catmull-Rom pelos pontos de controle (n pontos por trecho); aceita um quarto valor (raio) que também é suavizado
  function suave(P, n) {
    const out = [], m = P.length, d = P[0].length;
    for (let i = 0; i < m - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(m - 1, i + 2)];
      for (let j = 0; j < n; j++) {
        const t = j / n, t2 = t * t, t3 = t2 * t, q = [];
        for (let k = 0; k < d; k++) q.push(.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3));
        out.push(q);
      }
    }
    out.push(P[m - 1].slice());
    return out;
  }
  // comprimento acumulado (fração 0 a 1 de cada ponto)
  function fracoes(P) { const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + len(sub(P[i], P[i - 1]))); const T = L[L.length - 1] || 1; return L.map(v => v / T); }
  // ponto na fração f de uma curva já amostrada (com o quarto valor, se houver)
  function em(P, F, f) {
    f = cl(f, 0, 1); let i = 1; while (i < F.length - 1 && F[i] < f) i++;
    const a = P[i - 1], b = P[i], u = F[i] > F[i - 1] ? (f - F[i - 1]) / (F[i] - F[i - 1]) : 0;
    return a.map((v, k) => mix(v, b[k], u));
  }
  // vetor perpendicular estável à direção d
  function perp(d) { return nrm(cross(d, Math.abs(d[1]) < .9 ? [0, 1, 0] : [1, 0, 0])); }

  // ---------- orientação por base: eixo x local vira ex, y local vira ey ----------
  function base(g, ex, ey, q) {
    const T = g.T, x = nrm(ex), y0 = nrm(ey), z = nrm(cross(x, y0)), y = cross(z, x);
    g._mb = g._mb || new T.Matrix4(); g._mb.makeBasis(new T.Vector3(...x), new T.Vector3(...y), new T.Vector3(...z));
    return (q || g._q).setFromRotationMatrix(g._mb);
  }

  // ---------- âncora de rótulo ----------
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const cam = (g, P, hx2, hy, o = {}) => V3.viva({ th: o.th == null ? .3 : o.th, fi: o.fi == null ? .18 : o.fi, d: V3.enquadrar(g, hx2, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .5 : o.viva);
  const limpa2D = () => { try { X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.clearRect(0, 0, X.canvas.width, X.canvas.height); X.restore(); } catch (e) { /* sem canvas 2D */ } };

  // ---------- botões HTML sobre o palco ----------
  // its: [{ t, d (rótulo acessível), on(S) (aperta), pr(S) (aceso) }]; um grupo por id
  const GRUPOS = {};
  function botoes(id, its, S, on, rot) {
    let B = GRUPOS[id];
    if (!B) {
      if (!on) return;
      const tl = document.getElementById('cv').parentElement; B = document.createElement('div'); B.className = 'hud an-bt'; B.setAttribute('role', 'group'); B.setAttribute('aria-label', rot || 'Opções da cena');
      B.innerHTML = its.map((x, i) => `<button type="button" data-q="${i}" aria-pressed="false"${x.d ? ` aria-label="${x.d}"` : ''}>${x.t}</button>`).join('');
      if (!document.getElementById('an-bt-css')) {
        const st = document.createElement('style'); st.id = 'an-bt-css';
        st.textContent = `.an-bt{z-index:3;left:16px;top:64px;display:flex;flex-direction:column;gap:6px;max-width:240px}.an-bt[hidden]{display:none}
.an-bt button{font:inherit;font-size:14px;font-weight:600;min-height:44px;padding:4px 12px;border-radius:8px;border:1px solid var(--line-strong,#5B6C99);background:rgba(19,26,43,.9);color:var(--txt,#E8EDF7);cursor:pointer;text-align:left;line-height:1.2;transition:background-color 90ms,border-color 90ms,color 90ms}
.an-bt button:hover{background:var(--panel-2,#1B2440)}.an-bt button[aria-pressed="true"]{color:var(--amber,#FFB347);border-color:var(--amber,#FFB347)}
.an-bt button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
@media (max-width:700px){.an-bt{top:52px;left:8px;right:8px;max-width:none;flex-direction:row;flex-wrap:wrap;gap:4px}.an-bt button{flex:1 1 40%;font-size:13px;min-height:44px;padding:2px 8px;text-align:center}}
@media (prefers-reduced-motion:reduce){.an-bt button{transition:none}}`;
        document.head.appendChild(st);
      }
      B.addEventListener('click', e => { const b = e.target.closest('button'); if (!b || !B.S) return; const x = B.its[+b.dataset.q]; if (x && x.on) x.on(B.S); B.S.touch = performance.now(); });
      tl.appendChild(B); GRUPOS[id] = B;
    }
    B.its = its; B.hidden = !on; if (!on) return; B.S = S;
    [...B.children].forEach((b, i) => { const x = its[i]; b.setAttribute('aria-pressed', x && x.pr && x.pr(S) ? 'true' : 'false'); });
  }
  const esconde = id => { const B = GRUPOS[id]; if (B) B.hidden = true; };

  Object.assign(V3, { anCena: cena, corMix, suave, fracoes, em, perp, base, ach, anCam: cam, limpa2D, anBotoes: botoes, anEsconde: esconde });
})();
