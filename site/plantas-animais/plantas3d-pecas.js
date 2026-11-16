/* LAB Plantas e animais: peças 3D próprias deste módulo (Martin), sobre o kit do módulo Vírus (../virus/vir3d.js e
   ../virus/vir3d-pecas.js, reaproveitados sem cópia: bastões, bolinhas, sólidos cortados, blocos de tecido, películas).
   Aqui ficam: lâmina de folha e de pétala (malhas instanciadas, dos dois lados), prótalo em forma de coração, fronde de
   samambaia com folíolos e soros, tufo de musgo com esporófitos, pinheiro em andares de cones e uma planta com flor.
   Desenho próprio, sem modelos de terceiros. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.kitV) return;
  const { V } = V3, { cl, mix, add, mul, nrm, hash, TAU } = V;
  const CACHE = {};
  const RED = () => V3.REDUZ();

  // ---------- lâminas (folha e pétala): eixo +x do pecíolo à ponta, largura em z, face para +y ----------
  function lamina(g, key, larg, nx, nz) {
    const k = key + ':' + nx; if (CACHE[k]) return CACHE[k];
    const T = g.T, pos = [], idx = [];
    for (let i = 0; i <= nx; i++) {
      const u = i / nx, w = larg(u);
      for (let j = 0; j <= nz; j++) { const v = j / nz * 2 - 1; pos.push(u, .16 * v * v * w - .06 * u * u, v * w); }
    }
    for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) { const a = i * (nz + 1) + j, b = a + nz + 1; idx.push(a, a + 1, b, b, a + 1, b + 1); }
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
    return (CACHE[k] = geo);
  }
  const folhaGeo = g => lamina(g, 'pa-folha', u => .5 * Math.pow(Math.sin(Math.PI * u), .8), g.q.cel ? 8 : 12, 4);
  const petalaGeo = g => lamina(g, 'pa-petala', u => .5 * Math.pow(Math.sin(Math.PI * (.06 + .86 * u)), .55) * (.3 + .7 * u), g.q.cel ? 8 : 12, 4);
  // conjunto instanciado de lâminas (tocável por instância)
  function laminas(g, geo, max, o = {}) {
    const W = V3.inst(g, geo, V3.fis(g, '#FFFFFF', { p: Object.assign({ roughness: .55, clearcoat: .25, sheen: .4, sheenColor: new g.T.Color('#E8FFD8') }, o.p || {}), rimK: o.rimK == null ? .18 : o.rimK, lados: true, planos: o.planos }), max, o.pai);
    g.pick.push(W.m); W.q = new g.T.Quaternion(); return W;
  }
  // orientação: gira em torno do próprio eixo x (roll), depois inclina (pitch, em torno de z) e vira (yaw, em torno de y)
  function ori(g, q, yaw, pitch, roll) { (g._eF || (g._eF = new g.T.Euler(0, 0, 0, 'YZX'))).set(roll || 0, yaw || 0, pitch || 0, 'YZX'); return q.setFromEuler(g._eF); }
  function folha(g, W, p, yaw, pitch, roll, L, larg, cor, k, info) { V3.put(g, W, p, ori(g, W.q, yaw, pitch, roll), L, L, L * (larg || .4) * 2, cor, k, info); }
  // ponta de uma lâmina orientada (para âncoras e ligações)
  function ponta(yaw, pitch, L) { return [Math.cos(yaw) * Math.cos(pitch) * L, Math.sin(pitch) * L, -Math.sin(yaw) * Math.cos(pitch) * L]; }

  // ---------- prótalo: coração achatado (gametófito da samambaia) ----------
  function coracaoGeo(g) {
    if (CACHE.cor) return CACHE.cor;
    const T = g.T, s = new T.Shape();
    s.moveTo(0, -.55); s.bezierCurveTo(.25, -.32, .62, -.12, .58, .2); s.bezierCurveTo(.55, .5, .2, .55, 0, .32);
    s.bezierCurveTo(-.2, .55, -.55, .5, -.58, .2); s.bezierCurveTo(-.62, -.12, -.25, -.32, 0, -.55);
    const geo = new T.ExtrudeGeometry(s, { depth: .05, bevelEnabled: true, bevelThickness: .025, bevelSize: .03, bevelSegments: 2, curveSegments: g.q.cel ? 10 : 16 });
    geo.translate(0, 0, -.025); geo.rotateX(-Math.PI / 2); geo.computeVertexNormals();
    return (CACHE.cor = geo);
  }

  // ---------- fronde de samambaia: ráquis em arco e folíolos dos dois lados ----------
  // b base, yaw direção no chão, L comprimento, e (0 a 1) quanto já cresceu; devolve pontos úteis
  function fronde(g, W, F, b, yaw, L, e, o = {}) {
    const n = o.n || 9, dh = [Math.cos(yaw), 0, -Math.sin(yaw)], sw = o.sw || 0, cor = o.cor || '#3E8E4A', k = o.k == null ? 1 : o.k;
    const pt = s => add(b, add(mul(dh, L * .78 * s * e), [0, L * (1.15 * s - .72 * s * s) * e + sw * s * s * .06, 0]));
    let prev = pt(0); const out = { sori: [], meio: pt(.5), ponta: pt(1) };
    for (let i = 1; i <= 10; i++) { const p = pt(i / 10); V3.bastao(g, W.rod, prev, p, .016 * L * (1 - i * .05), '#5B7A34', k, o.infoR || o.info); prev = p; }
    for (let i = 0; i < n; i++) {
      const s = .14 + i / n * .82, p = pt(s), Lp = L * .3 * (1 - s * .72) * e;
      if (Lp < .01) continue;
      const tilt = Math.atan2(L * (1.15 - 1.44 * s), L * .78) * .6 - .25;
      [1, -1].forEach(sd => {
        folha(g, F, p, yaw + sd * Math.PI / 2 + sd * .25 * s, tilt * .3 - .18 + sw * .05, sd * .15, Lp, .22, cor, k, o.info);
        if (o.soros && i > 1 && i < n - 1 && sd === 1) out.sori.push(add(p, add(mul([Math.cos(yaw + Math.PI / 2), 0, -Math.sin(yaw + Math.PI / 2)], Lp * .5), [0, -.012, 0])));
      });
    }
    return out;
  }

  // ---------- tufo de musgo (gametófitos) com esporófitos ----------
  function musgo(g, W, c, R, h, e, o = {}) {
    const k = o.k == null ? 1 : o.k, n = o.n || 16, out = { caps: [] };
    for (let i = 0; i < n; i++) {
      const a = hash(i, 41) * TAU, r = Math.sqrt(hash(i, 42)) * R, b = add(c, [Math.cos(a) * r, 0, Math.sin(a) * r]);
      const hh = h * (.7 + .3 * hash(i, 43)) * e, tp = add(b, [Math.cos(a) * hh * .15, hh, Math.sin(a) * hh * .15]);
      V3.bastao(g, W.rod, b, tp, .012, '#4E8A2E', k, o.info);
      for (let j = 1; j <= 4; j++) { const p = V.lerp3(b, tp, j / 4.4); V3.bola(g, p, .035 * (1.1 - j * .12) * Math.min(1, e * 1.5), j % 2 ? '#6DB33F' : '#5AA334', k, o.info); }
      V3.bola(g, tp, .03, '#7FC63B', k, o.info);
    }
    for (let i = 0; i < (o.esp || 0); i++) {
      const a = i * 2.1 + .4, b = add(c, [Math.cos(a) * R * .4, h * .9 * e, Math.sin(a) * R * .4]), tp = add(b, [Math.cos(a) * .06, h * 1.2 * e * (o.ee == null ? 1 : o.ee), Math.sin(a) * .06]);
      V3.bastao(g, W.rod, b, tp, .008, '#A07A3A', k, o.infoE);
      if (tp[1] - b[1] > .02) { V3.put(g, g.mS, tp, null, .028, .05, .028, '#B07A3A', k, o.infoE); out.caps.push(tp); }
    }
    return out;
  }

  // ---------- pinheiro: tronco e andares de cones, com estróbilos ----------
  function pinheiro(g, W, Wc, b, H, e, o = {}) {
    const k = o.k == null ? 1 : o.k, out = { estrobilos: [] };
    V3.bastao(g, W.rod, b, add(b, [0, H * .8 * e, 0]), .028 * H * Math.max(.3, e), '#6B4A2B', k, o.infoT || o.info);
    const N = 4;
    for (let i = 0; i < N; i++) {
      const f = i / N, y = H * (.32 + f * .62) * e, r = H * .32 * (1 - f * .72) * e, hh = H * .26 * e;
      if (r < .01) continue;
      V3.put(g, Wc, add(b, [0, y + hh * .35, 0]), null, r, hh, r, i % 2 ? '#2F6B3A' : '#2A5F35', k, o.info);
      if (e > .8 && i < 3) { const a = i * 2.2 + .5, p = add(b, [Math.cos(a) * r * .65, y + hh * .05, Math.sin(a) * r * .65]); V3.put(g, g.mS, p, null, .05, .07, .05, '#8A5A2B', k, o.infoE); out.estrobilos.push(p); }
    }
    return out;
  }

  // ---------- planta com flor (angiosperma simples): caule, folhas, flores e um fruto ----------
  function plantaFlor(g, W, F, P, b, H, e, t, o = {}) {
    const k = o.k == null ? 1 : o.k, sw = RED() ? 0 : Math.sin(t * 1.3) * .03, out = { flores: [], fruto: null };
    const top = add(b, [sw * H, H * e, 0]);
    V3.bastao(g, W.rod, b, top, .025, '#3E8E4A', k, o.infoC || o.info);
    for (let i = 0; i < 4; i++) { const f = .25 + i * .16, p = V.lerp3(b, top, f), y = i * 2.4 + .3; folha(g, F, p, y, .35, 0, H * .32 * e, .32, '#4FA85A', k, o.info); }
    const fl = [[0, 1], [1.9, .78], [-2.2, .64]];
    fl.forEach(([a, f], i) => {
      const base = V.lerp3(b, top, f), c = i ? add(base, [Math.cos(a) * .18 * H * e, .08 * H * e, -Math.sin(a) * .18 * H * e]) : top;
      if (i) V3.bastao(g, W.rod, base, c, .012, '#3E8E4A', k, o.infoC || o.info);
      if (i === 2 && o.fruto) { V3.bola(g, c, .085 * H * e, '#E8742A', k, o.infoF); out.fruto = c; return; }
      for (let j = 0; j < 5; j++) folha(g, P, c, j / 5 * TAU + i, .45, 0, .14 * H * e, .32, o.corP || '#E58AB0', k, o.infoFl);
      V3.bola(g, add(c, [0, .015, 0]), .03 * H * e, '#F2C14B', k, o.infoFl); out.flores.push(c);
    });
    return out;
  }

  Object.assign(V3, { paFolhaGeo: folhaGeo, paPetalaGeo: petalaGeo, paLaminas: laminas, paOri: ori, paFolha: folha, paPonta: ponta, paCoracao: coracaoGeo, paFronde: fronde, paMusgo: musgo, paPinheiro: pinheiro, paPlantaFlor: plantaFlor });
})();
