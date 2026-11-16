/* LAB Origem da vida e evolução: peças 3D próprias deste módulo (Martin), sobre o kit do módulo Vírus (../virus/vir3d.js e
   ../virus/vir3d-pecas.js) e as peças da Anatomia (../anatomia/anat3d-pecas.js: registro das cenas, curvas suaves, mistura de
   cores e botões HTML sobre o palco), reaproveitados sem cópia.
   Aqui ficam: o "aperto" de um botão do desenho plano a partir de um botão HTML (a cena 2D antiga continua dona do estado),
   a malha com cor por vértice (planeta e terreno), o bichinho das populações (corpo, cabeça e olhos) e a ave.
   Desenho próprio, sem modelos de terceiros. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.anCena) return;
  const { cl } = V3.V;

  // aperta no desenho plano o botão de id dado (o quadro escondido registra os alvos de toque em HITS a cada quadro)
  function aperta(g, id) {
    if (!g || !g.old || !g.old.tap || typeof HITS === 'undefined') return false;
    const h = HITS.find(x => x.id === id); if (!h) return false;
    g.old.tap.call(g.old, h.cx != null ? h.cx : h.x + h.w / 2, h.cy != null ? h.cy : h.y + h.h / 2, g.S);
    return true;
  }

  // malha com cor por vértice; pinta(x, y, z, i) devolve [r, g, b] de 0 a 1
  function corVert(g, geo, mat) {
    const T = g.T, n = geo.attributes.position.count; geo.setAttribute('color', new T.BufferAttribute(new Float32Array(n * 3), 3));
    g.geos.push(geo); mat.vertexColors = true; mat.needsUpdate = true; return new T.Mesh(geo, mat);
  }
  function pinta(geo, f) {
    const p = geo.attributes.position, c = geo.attributes.color;
    for (let i = 0; i < p.count; i++) { const v = f(p.getX(i), p.getY(i), p.getZ(i), i); c.setXYZ(i, Math.pow(v[0], 2.2), Math.pow(v[1], 2.2), Math.pow(v[2], 2.2)); }   // sRGB para linear
    c.needsUpdate = true;
  }
  const rgb = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; };
  const mixRgb = (a, b, t) => { t = cl(t, 0, 1); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; };

  // bichinho das populações: corpo ovalado, cabeça e olhos (instâncias; o corpo leva a cor do alelo)
  function bichos(g, max, pc) {
    const T = g.T, mat = V3.fis(g, '#FFFFFF', { p: { roughness: .55, clearcoat: .35 }, rimK: .3 });
    const W = { corpo: V3.inst(g, V3.esfera(g, g.q.cel ? 14 : 20), mat, max * 2, null, g.pecas[pc]), olho: V3.inst(g, V3.esfera(g, 8), V3.fis(g, '#FFFFFF', { p: { roughness: .2, clearcoat: .9 } }), max * 2) };
    g.pick.push(W.corpo.m); W.q = new T.Quaternion(); W.e = new T.Euler(); return W;
  }
  // p = pé; s = tamanho; yaw = direção; cor; k = brilho; pula = altura do pulo
  function bicho(g, W, p, s, yaw, cor, info, pula) {
    if (s < .004) return; W.e.set(0, yaw, 0); W.q.setFromEuler(W.e);
    const y = p[1] + s * .55 + (pula || 0), fx = Math.cos(yaw), fz = -Math.sin(yaw), sx = -fz, sz = fx;
    V3.put(g, W.corpo, [p[0], y, p[2]], W.q, s, s * .62, s * .72, cor, 1, info);
    V3.put(g, W.corpo, [p[0] + fx * s * .95, y + s * .18, p[2] + fz * s * .95], W.q, s * .42, s * .4, s * .42, cor, .82, info);
    [-1, 1].forEach(k => V3.put(g, W.olho, [p[0] + fx * s * 1.25 + sx * k * s * .17, y + s * .32, p[2] + fz * s * 1.25 + sz * k * s * .17], null, s * .09, null, null, '#0B0F1C', 1));
  }
  const fimBichos = W => { V3.fim(W.corpo); V3.fim(W.olho); };

  // ave: corpo, cabeça, bico e duas asas que batem
  function ave(g, cor, pc) {
    const T = g.T, gr = new T.Group(), m = V3.fis(g, cor, { p: { roughness: .5, clearcoat: .3 }, rimK: .35 }), es = V3.esfera(g, 18);
    const corpo = new T.Mesh(es, m); corpo.scale.set(.42, .2, .2); gr.add(corpo);
    const cab = new T.Mesh(es, m); cab.scale.setScalar(.14); cab.position.set(.42, .08, 0); gr.add(cab);
    const bico = new T.Mesh(V3.cone(g, 10), V3.fis(g, '#F7C13B', { p: { roughness: .4 } })); bico.scale.set(.05, .16, .05); bico.rotation.z = -Math.PI / 2; bico.position.set(.6, .06, 0); gr.add(bico);
    const asas = [-1, 1].map(k => { const a = new T.Group(), w = new T.Mesh(es, m); w.scale.set(.2, .03, .36); w.position.set(0, 0, k * .34); a.add(w); a.position.set(-.02, .08, 0); gr.add(a); return a; });
    const cauda = new T.Mesh(es, m); cauda.scale.set(.2, .03, .12); cauda.position.set(-.48, .02, 0); gr.add(cauda);
    gr.traverse(o => { if (o.isMesh) { o.userData.peca = g.pecas[pc]; g.pick.push(o); } });
    g.raiz.add(gr); gr.userData.asas = asas; return gr;
  }
  function bate(av, t, rv) { const k = rv ? Math.sin(t * 14) * .7 : .3; av.userData.asas[0].rotation.x = k; av.userData.asas[1].rotation.x = -k; }

  // no celular, os cinco botões das espécies cabem numa linha só
  if (!document.getElementById('ev-bt-css')) { const st = document.createElement('style'); st.id = 'ev-bt-css'; st.textContent = '@media (max-width:700px){.an-bt[aria-label="Escolha duas espécies atuais"] button{flex:1 1 15%;min-width:44px}}'; document.head.appendChild(st); }

  Object.assign(V3, { evAperta: aperta, evCorVert: corVert, evPinta: pinta, evRgb: rgb, evMixRgb: mixRgb, evBichos: bichos, evBicho: bicho, evFimBichos: fimBichos, evAve: ave, evBate: bate });
})();
