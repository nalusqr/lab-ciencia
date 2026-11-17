/* LAB Genética: kit das cenas 3D (Martin). Sobre o visor do mol3d.js (../biologia-molecular/mol3d.js) e as peças do
   kit da Citogenética (../divisao-celular/cito3d.js: materiais, tubos, instâncias, película de membrana), reaproveitados sem cópia.
   Aqui ficam: o adaptador para os tópicos desta página (mk() devolve {ui, draw(P), res}), cromossomos com alelos em faixas,
   gametas, ervilhas, quadro de Punnett em 3D e a camada 2D por cima com letras dos alelos e legendas.
   Cada cena entra com GEN3D.registrar('sec/id', GEN3D.cena({...})); o desenho 2D antigo vira o plano B sem WebGL.
   O index.html aplica window.GEN_3D aos tópicos e chama inst.sair() ao trocar de tópico (gancho de saída). */
'use strict';
(function () {
  const C = window.CITO3D; if (!C || !window.MOL3D) return;
  const { cl, mix, seg, add, sub, mul, nrm, len, cross, lerp3, TAU } = C.V;
  const RED = () => MOL3D.reduz;
  const ease = (a, b, x) => MOL3D.E.out(seg(x, a, b)), move = (a, b, x) => MOL3D.E.move(seg(x, a, b));
  const FT = "'Atkinson Hyperlegible Next',system-ui,sans-serif", FD = "'JetBrains Mono',ui-monospace,monospace", FH = "'Space Grotesk',sans-serif";
  // cores: convenção dos modelos 3D do LAB (violeta da mãe, azul do pai) e dos alelos desta página (maiúscula amarela, minúscula verde)
  const COR = { mae: '#9A6BFF', pai: '#5CC8F0', dom: '#F7C13B', rec: '#3FBF6A', amb: '#FFB347', txt: '#E8EDF7', dim: '#9DA9C4', mem: '#F06AAE', gelo: '#CFE0FF' };
  const up = c => c >= 'A' && c <= 'Z';

  // ---------- adaptador: embrulha o tópico 2D da página ----------
  function cena(o) {
    return (old, K) => {
      if (!window.MOL3D || !old) return old;
      let G = null; const pecas = o.pecas || {}, view = document.getElementById('view');
      Object.keys(pecas).forEach(id => { const p = pecas[id]; p.id = id; p.cor = p.cor || COR.gelo; p.centro = () => { const a = G && G.anc[id]; return a ? [a[0], a[1], a[2], (G.raioPc[id] || 3) * 1.4] : null; }; });
      const S = { v: 0, paused: false, P2: 0 };
      function montar(M) {
        const v = MOL3D.visor, T = v.THREE, q = C.qualidade();
        const g = G = { T, v, M, q, mats: [], geos: [], insts: [], pick: [], anc: {}, vis: {}, raioPc: {}, t: 0, dt: 0, clk: 0, old, K, st: old.st, pecas, o };
        g._m = new T.Matrix4(); g._p = new T.Vector3(); g._s = new T.Vector3(); g._c = new T.Color(); g._q = new T.Quaternion(); g._v1 = new T.Vector3(); g._v2 = new T.Vector3(); g.qI = new T.Quaternion(); g._e = new T.Euler();
        g.raiz = M._nos.raiz;
        M.semVolume = true; M.fitFixo = o.fit || 30; M.raioFixo = o.raio || 12; M.vista = Object.assign({ th: -.32, fi: .2, zoom: 1, alvo: [0, 0, 0] }, o.vista || {});
        g.luz0 = []; v.cam.children.forEach(l => { if (l.isLight) g.luz0.push([l, l.intensity]); });
        if (g.luz0[0]) g.luz0[0][0].intensity = 1.55; if (g.luz0[1]) g.luz0[1][0].intensity = .5; if (g.luz0[2]) g.luz0[2][0].intensity = 2.2;
        g.hemi = new T.HemisphereLight('#C6D6FF', '#2A1E3D', .34); g.raiz.add(g.hemi);
        g.rots = (o.rotulos || []).map((r, i) => {
          const id = 'L' + i, pc = pecas[r.pc] || { cor: COR.gelo }; M.no(id);
          const a = M.atomo('X', [0, 0, 0], { no: id, nome: pc.nome || r.t, frase: pc.frase, cor: pc.cor, r: [.001, .001] });
          M.atomos[a].pc = r.pc; M.rotulo(a, r.t, r.pr || 3); return { r, id, a };
        });
        g.bandas = C.inst(g, C.cilindro(g, q.cel ? 14 : 20), C.fis(g, '#ffffff', { p: { roughness: .32, clearcoat: .8, clearcoatRoughness: .2 }, rimK: .3 }), 64);
        g.pick.push(g.bandas.m);
        o.montar(g, M);
        M.pegar = ray => {
          const vivo = ob => { for (let x = ob; x; x = x.parent) if (!x.visible) return false; return !(ob.isInstancedMesh && !ob.count); };
          const hs = ray.intersectObjects(g.pick.filter(vivo), false);
          for (const h of hs) { const pc = h.object.userData.info && h.instanceId != null ? h.object.userData.info[h.instanceId] : h.object.userData.peca; if (pc) return pc; }
          return null;
        };
        M.pecas = () => { const ids = []; g.rots.forEach(x => { if (G.vis[x.r.pc] && ids.indexOf(x.r.pc) < 0 && pecas[x.r.pc]) ids.push(x.r.pc); }); return ids.map(id => pecas[id]); };
        M.limpar = () => limpar(g);
      }
      function limpar(g) {
        if (o.limpar) try { o.limpar(g); } catch (e) { console.error(e); }
        g.luz0.forEach(([l, i]) => { l.intensity = i; }); if (g.hemi.parent) g.hemi.parent.remove(g.hemi);
        g.insts.forEach(W => W.m.dispose()); g.mats.forEach(m => m.dispose()); g.geos.forEach(x => x.dispose());
        G = null;
      }
      function animar(M, P) {
        const g = G; if (!g) return;
        g.dt = g.t ? cl(P.t - g.t, 0, .05) : 0; g.t = P.t; g.P = P; if (!K.paused) g.clk += g.dt;
        g.A = RED() ? 99 : K.A; g.st = old.st;
        const s = g.v.sel; let sid = null;
        if (s) { if (s.custom) sid = s.custom.id; else if (s.atomo != null && M.atomos[s.atomo]) sid = M.atomos[s.atomo].pc; }
        g.sel = sid; g.vis = {};
        o.animar(g, P);
        g.insts.forEach(C.fim);
        g.rots.forEach(x => { const a = g.anc[x.r.pc], on = a && g.vis[x.r.pc]; const n = M.nos[x.id]; if (a) n.pos = [a[0], a[1], a[2]]; n.esc = on ? 1 : 1e-4; });
        const c = camera(g); if (c) M.cam = c;
      }
      function camera(g) {
        const vi = M0(g), hx = o.caixa ? o.caixa[0] : 8, hy = o.caixa ? o.caixa[1] : 7;
        let d = C.enquadrar(g, hx, hy, o.caixa ? o.caixa[2] || 2 : 2);
        const al = o.alvo ? o.alvo(g) : [0, 0, 0], c = { th: vi.th, fi: vi.fi, d, al };
        if (g.v.w < 520) { c.d *= 1.1; c.al = [c.al[0], c.al[1] - hy * .16, c.al[2]]; }   // celular: sobra espaço embaixo para a legenda
        if (o.camera) o.camera(g, c);
        C.viva(c, g.clk, .6);
        return { th: c.th, fi: c.fi, d: c.d, tx: c.al[0], ty: c.al[1], tz: c.al[2] };
      }
      const M0 = g => g.M.vista;
      const spec = { t: o.t || '', girar: false, montar, animar, plano() { if (!o.chama2D) return old.draw(S.P2); } };
      const c3 = MOL3D.cena(spec);
      return Object.assign({}, old, {
        draw(P) {
          S.P2 = P; S.paused = K.paused;
          if (o.chama2D) { K.X.save(); try { old.draw(P); } finally { K.X.restore(); } }
          c3.draw(performance.now() / 1000, S);
          const v = MOL3D.visor, on = !!(v && v.spec === c3 && v.M && G);
          view.classList.toggle('g3', on);
          if (on) { const X = K.X; X.clearRect(0, 0, K.W, K.H); if (o.sobre) { X.save(); try { o.sobre(G, X, K.W, K.H); } catch (e) { console.error(e); } X.restore(); } }
        },
        sair() { view.classList.remove('g3'); c3.sair(); if (old.sair) old.sair(); }
      });
    };
  }
  function registrar(chave, w) { (window.GEN_3D = window.GEN_3D || {})[chave] = w; }

  // ---------- peças ----------
  // cromátide(s): tubo de cromatina com centrômero estreito e faixas dos alelos. set(base, eixo u, comprimento L, s)
  // s = { n: 1 ou 2 cromátides, cor, bandas: [[fração 0 a 1, cor, info]], cen: fração do centrômero, r, abre (0 a 1, separa as cromátides), w (lado) }
  function cromossomo(g, peca) {
    const q = g.q, tubs = [0, 1].map(() => { const m = C.fis(g, COR.mae, { p: { roughness: .46, clearcoat: .55, clearcoatRoughness: .3, sheen: .55, sheenColor: new g.T.Color('#E6DCFF') }, rim: '#D2C2FF', rimK: .34 }); const t = C.tubo(g, 30, q.cel ? 10 : 14, m, g.raiz, peca); g.pick.push(t.mesh); return { t, m }; });
    const cor = new g.T.Color();
    return {
      tubs,
      esconder() { tubs.forEach(x => { x.t.mesh.visible = false; }); },
      set(b, u, L, s) {
        u = nrm(u); const w = s.w || nrm(cross(u, Math.abs(u[2]) < .9 ? [0, 0, 1] : [1, 0, 0])), n = s.n || 1, r = s.r || .42, cen = s.cen == null ? .5 : s.cen;
        const ab = s.abre || 0, N = 26;
        for (let k = 0; k < 2; k++) {
          const T0 = tubs[k]; if (k >= n) { T0.t.mesh.visible = false; continue; }
          const sg = n === 2 ? (k ? 1 : -1) : 0, pts = [];
          for (let j = 0; j < N; j++) {
            const f = j / (N - 1), y = (f - cen) * L, junto = n === 2 ? Math.min(1, Math.abs(f - cen) * 5) * (1 - ab) + ab : 0;
            pts.push(add(add(b, mul(u, y)), mul(w, sg * r * (.95 * junto + .12) + sg * ab * 1.4)));
          }
          T0.t.set(pts, (i, nn) => { const f = i / (nn - 1), pin = n === 2 && ab < .5 ? 1 - .38 * Math.exp(-Math.pow((f - cen) * L / (r * 1.3), 2)) : 1; return r * pin * Math.sqrt(Math.max(.05, Math.min(1, i / 2, (nn - 1 - i) / 2))); });
          T0.m.color.copy(cor.set(s.cor || COR.mae)); if (s.peca) T0.t.mesh.userData.peca = s.peca;
          (s.bandas || []).forEach(([f, c, info]) => {
            const p = add(add(b, mul(u, (f - cen) * L)), mul(w, sg * r * (.95 * (n === 2 ? Math.min(1, Math.abs(f - cen) * 5) * (1 - ab) + ab : 0) + .12) + sg * ab * 1.4));
            C.put(g, g.bandas, p, C.qy(g, u), r * 1.16, L * .075, r * 1.16, c, 1, info || null);
          });
        }
      }
    };
  }
  // ponto do centro de uma faixa (para as letras na camada 2D)
  function pontoFaixa(b, u, L, f, cen) { return add(b, mul(nrm(u), (f - (cen == null ? .5 : cen)) * L)); }

  // película de célula (membrana translúcida) e núcleo
  function celula(g, cor, peca, o = {}) {
    const m = C.filme(g, cor || COR.mem, Object.assign({ cor2: '#FFD6EC', dentro: '#2A1E44', base: .03, fr: .5, esc: .35 }, o)), me = new g.T.Mesh(C.esfera(g, g.q.cel ? 36 : 52), m);
    me.renderOrder = 3; if (peca) { me.userData.peca = peca; g.pick.push(me); } g.raiz.add(me); return me;
  }
  // une duas ou mais películas numa superfície só (a parte de uma que fica dentro da outra some)
  function unir(cels) {
    cels.forEach(a => { const u = a.material.uniforms; let n = 0; if (a.visible) cels.forEach(b => { if (b === a || !b.visible || n > 3) return; u.uO.value[n++].set(b.position.x, b.position.y, b.position.z, b.scale.x * .998); }); u.uN.value = n; });
  }
  // esferas instanciadas e lisas (ervilhas, gametas, partículas)
  function bolas(g, max, o = {}) { const W = C.inst(g, C.esfera(g, g.q.cel ? 24 : 32), C.fis(g, '#ffffff', { p: Object.assign({ roughness: .38, clearcoat: .7, clearcoatRoughness: .2, sheen: .3 }, o.p || {}), rimK: o.rimK == null ? .25 : o.rimK }), max); g.pick.push(W.m); return W; }
  // placas do quadro de Punnett (caixa de cantos arredondados)
  function placas(g, max) { const W = C.inst(g, C.caixaR(g, 1, 1, .12, .1, 3), C.fis(g, '#ffffff', { p: { roughness: .7, clearcoat: .2, transparent: true, opacity: .9 }, rimK: .12 }), max); g.pick.push(W.m); return W; }

  // ---------- camada 2D: letras e legendas ----------
  function gparts(s) { const o = []; for (let i = 0; i < s.length; i++) { if (s[i] === '^') o.push([s[++i], 1]); else o.push([s[i], 0]); } return o; }
  function gtx(X, s, x, y, sz, col) {
    sz = Math.max(12, sz); const ps = gparts(s); let w = 0;
    const ws = ps.map(([c, u]) => { X.font = `600 ${u ? sz * .7 : sz}px ${FD}`; const m = X.measureText(c).width; w += m; return m; });
    let cx = x - w / 2; X.fillStyle = col || COR.txt; X.textAlign = 'left'; X.textBaseline = 'middle';
    ps.forEach(([c, u], i) => { X.font = `600 ${u ? sz * .7 : sz}px ${FD}`; X.fillText(c, cx, u ? y - sz * .36 : y); cx += ws[i]; }); return w;
  }
  // pastilha com genótipo ou texto curto sobre um ponto do mundo
  function etiqueta(g, X, p, s, o = {}) {
    const t = C.tela(g, p); if (t[2] > 1) return null; const x = t[0] + (o.dx || 0), y = t[1] + (o.dy || 0), sz = o.s || 15, gen = o.gen !== false;
    X.save(); X.globalAlpha = o.a == null ? 1 : o.a;
    let w; if (gen) { X.font = `600 ${sz}px ${FD}`; w = gparts(s).reduce((a, [c, u]) => { X.font = `600 ${u ? sz * .7 : sz}px ${FD}`; return a + X.measureText(c).width; }, 0); }
    else { X.font = `${o.w || 600} ${sz}px ${FT}`; w = X.measureText(s).width; }
    const ph = sz + 10, pw = w + 14;
    X.beginPath(); X.roundRect(x - pw / 2, y - ph / 2, pw, ph, ph / 2); X.fillStyle = o.fundo || 'rgba(11,15,28,.78)'; X.fill();
    if (o.borda) { X.strokeStyle = o.borda; X.lineWidth = 1.5; X.stroke(); }
    if (gen) gtx(X, s, x, y + .5, sz, o.c || COR.txt); else { X.fillStyle = o.c || COR.txt; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(s, x, y + .5); }
    X.restore(); return [x, y];
  }
  // legenda do passo, embaixo do palco, quebrando linhas
  function legenda(X, W, H, s, o = {}) {
    const sz = o.s || (W < 520 ? 13 : 15); X.font = `600 ${sz}px ${FH}`; const mw = Math.min(W - 28, 640), ws = s.split(' ');
    let ln = '', ls = []; for (const w of ws) { const t = ln ? ln + ' ' + w : w; if (X.measureText(t).width > mw && ln) { ls.push(ln); ln = w; } else ln = t; } ls.push(ln);
    const lh = sz * 1.35, y0 = H - 14 - (ls.length - 1) * lh - lh / 2, bw = Math.max(...ls.map(l => X.measureText(l).width)) + 24;
    X.beginPath(); X.roundRect(W / 2 - bw / 2, y0 - lh / 2 - 6, bw, ls.length * lh + 12, 10); X.fillStyle = 'rgba(11,15,28,.74)'; X.fill();
    X.fillStyle = o.c || COR.txt; X.textAlign = 'center'; X.textBaseline = 'middle'; ls.forEach((l, i) => X.fillText(l, W / 2, y0 + i * lh));
  }
  // texto solto (cabeçalhos do quadro)
  function texto(X, s, x, y, o = {}) { X.font = `${o.w || 400} ${Math.max(12, o.s || 13)}px ${o.f || FT}`; X.textAlign = o.a || 'center'; X.textBaseline = 'middle'; X.fillStyle = o.c || COR.dim; X.fillText(s, x, y); }

  window.GEN3D = { cena, registrar, cromossomo, pontoFaixa, celula, unir, bolas, placas, etiqueta, legenda, texto, gtx, COR, up, ease, move, RED, FT, FD, FH, C };
})();
