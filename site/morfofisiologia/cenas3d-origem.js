/* LAB Morfofisiologia: cenas 3D da origem das organelas (Martin). Invaginação da membrana, endossimbiose da mitocôndria e do
   cloroplasto e as evidências (fissão binária sincronizada). Escala de célula: 1 = cerca de 0,1 µm na hospedeira. */
'use strict';
(function () {
  if (!window.MORFO3D) return;
  const K = MORFO3D, { cl, mix, seg, sst, add, sub, mul, nrm, len, dot, lerp3, rng, hash, vnoise, TAU } = K.V;
  const RED = () => window.MOL3D && MOL3D.reduz;
  const out = x => (window.MOL3D ? MOL3D.E.out(cl(x, 0, 1)) : x), mv = x => (window.MOL3D ? MOL3D.E.move(cl(x, 0, 1)) : x);
  const pc = (nome, cor, frase) => ({ nome, cor, frase });

  // ---------- célula hospedeira: esfera translúcida que se deforma (dobras, bolsos, pseudópodes) ----------
  function hospedeira(g, R, o = {}) {
    const T = g.T, n = g.q.cel ? 72 : 112, geo = new T.SphereGeometry(R, n, n * .66 | 0); g.geos.push(geo);
    const base = Float32Array.from(geo.attributes.position.array);
    const mat = K.pelicula(g, o.cor || '#F06AAE', { base: .045, fr: .62, cor2: o.cor2 || '#FFD6EA', esc: .35 });
    const m = new T.Mesh(geo, mat); m.renderOrder = 3; g.raiz.add(m); m.userData.peca = o.peca;
    // citosol: um volume leve por dentro, para a célula não parecer oca
    const ci = new T.Mesh(K.esfera(g, 48), K.pelicula(g, o.corC || '#6A4C9C', { base: .1, fr: .05, cor2: '#2C1D44', esc: .5 })); ci.scale.setScalar(R * .97); ci.renderOrder = 1; g.raiz.add(ci);
    const H = { m, geo, base, R, ci, sujo: true };
    H.deformar = dents => {
      const p = geo.attributes.position, A = p.array;
      for (let i = 0; i < p.count; i++) {
        const x = base[i * 3], y = base[i * 3 + 1], z = base[i * 3 + 2], l = Math.hypot(x, y, z) || 1, d = [x / l, y / l, z / l];
        let r = R * (1 + .012 * Math.sin(d[0] * 5 + g.t * .7) * Math.cos(d[1] * 4 - g.t * .5));
        for (const D of dents) {
          const a = Math.acos(cl(dot(d, D.dir), -1, 1)), w = D.w;
          r -= D.prof * Math.exp(-((a / w) ** 2)) * (D.estreito ? Math.exp(-((a / (w * .5)) ** 2)) * .4 + .6 : 1);
          if (D.borda) r += D.borda * Math.exp(-(((a - w * 1.2) / (w * .32)) ** 2));
        }
        A[i * 3] = d[0] * r; A[i * 3 + 1] = d[1] * r; A[i * 3 + 2] = d[2] * r;
      }
      p.needsUpdate = true; geo.computeVertexNormals(); geo.boundingSphere = null;
    };
    return H;
  }
  // grãos do citoplasma (ribossomos e proteínas ao longe)
  function graos(g, R, n, cor) {
    const W = K.inst(g, K.esfera(g, 8), K.fis(g, cor || '#C9B8F0', { p: { roughness: .6, sheen: .3 }, rimK: .1 }), n), r = rng(77), P = [];
    for (let i = 0; i < n; i++) { const d = nrm([r() - .5, r() - .5, r() - .5]); P.push([mul(d, R * Math.cbrt(r()) * .9), .05 + r() * .09]); }
    W.desenhar = (fora) => { P.forEach(([p, s], i) => { if (fora && fora(p)) return; K.put(g, W, [p[0] + Math.sin(g.t * .4 + i) * .06, p[1] + Math.cos(g.t * .3 + i) * .06, p[2]], null, s, null, null, '#ffffff', .8 + .4 * hash(i, 3)); }); K.fim(W); };
    return W;
  }
  // núcleo da hospedeira: envoltório translúcido, cromatina e nucléolo
  function nucleo(g, r, pai) {
    const T = g.T, gr = new T.Group(); (pai || g.raiz).add(gr);
    const env = new T.Mesh(K.esfera(g, 48), K.pelicula(g, '#7C8BFF', { base: .08, fr: .75, cor2: '#C8D2FF', esc: 2 })); env.scale.setScalar(r); env.renderOrder = 2; gr.add(env);
    const nl = new T.Mesh(K.lumpy(g, 'nucl', 19, 3, 40, .25, .3, .5), K.fis(g, '#6A50A8', { p: { roughness: .6, sheen: .4, sheenColor: new T.Color('#B49AF0') }, rimK: .2 })); nl.scale.setScalar(r * .32); nl.position.set(r * .25, r * .15, -r * .1); gr.add(nl);
    const mc = K.fis(g, '#9A7BE0', { p: { roughness: .55, sheen: .4 }, rimK: .15 }), R2 = rng(5);
    for (let i = 0; i < 9; i++) { const b = new T.Mesh(K.lumpy(g, 'cr' + (i % 3), 40 + i % 3, 2, 10, .3, .3, .6), mc); const d = nrm([R2() - .5, R2() - .5, R2() - .5]); b.position.set(...mul(d, r * (.35 + .4 * R2()))); b.scale.setScalar(r * (.12 + .08 * R2())); gr.add(b); }
    env.userData.pc = 'nuc'; return { gr, env };
  }

  // ---------- bactéria, mitocôndria e cloroplasto (escala própria: comprimento cerca de 4 unidades) ----------
  function bacteria(g, o = {}) {
    const T = g.T, gr = new T.Group(), cor = o.cor || '#A9C54A';
    const mo = new T.Mesh(K.capsula(g, 1.18, 1.55, 32), K.pelicula(g, o.corM || '#C8F080', { base: .1, fr: .8, cor2: '#F0FFD0', esc: 2.5 })); mo.renderOrder = 4; gr.add(mo);
    const mi = new T.Mesh(K.capsula(g, 1.0, 1.45, 32), K.fis(g, cor, { p: { roughness: .45, clearcoat: .6, transparent: true, opacity: .62, depthWrite: false, sheen: .5, sheenColor: new T.Color('#E8FFC0') }, rim: '#E0FFB0', rimK: .35 })); mi.renderOrder = 3; gr.add(mi);
    // DNA circular (nucleoide): laço com voltas
    const P = []; for (let i = 0; i <= 90; i++) { const a = i / 90 * TAU, rr = .55 + .16 * Math.sin(a * 5) + .08 * Math.sin(a * 9); P.push([Math.cos(a) * rr * .55, Math.sin(a) * rr * 1.6, .12 * Math.sin(a * 7)]); }
    const dna = K.tubo(g, 92, 6, K.emis(g, '#B48CFF', .5), gr); dna.set(P, .06); dna.mesh.renderOrder = 5;
    const rb = K.inst(g, K.esfera(g, 8), K.fis(g, '#FFF2D0', { p: { roughness: .4 }, rimK: .1 }), 40, gr), r = rng(o.sem || 3);
    for (let i = 0; i < 40; i++) { const y = (r() * 2 - 1) * 2, a = r() * TAU, rr = .35 + r() * .5; K.put(g, rb, [Math.cos(a) * rr, y, Math.sin(a) * rr], null, .075); } K.fim(rb); rb.m.renderOrder = 5;
    let fl = null; if (o.flagelo !== false) { fl = K.tubo(g, 50, 6, K.fis(g, '#DDE8FF', { rimK: .3 }), gr); }
    let til = null; if (o.tilacoides) { const mt = K.fis(g, '#2FA35A', { p: { roughness: .4, clearcoat: .6, transparent: true, opacity: .8 }, rimK: .25 }); til = new T.Group(); for (let i = 0; i < 4; i++) { const c = new T.Mesh(K.capsula(g, .78 - i * .14, 1.35 - i * .08, 24), mt); c.scale.set(1, 1, .18); c.rotation.y = i * .7; til.add(c); } gr.add(til); }
    const B = { gr, mo, mi, dna, fl, til, pecas: [mo, mi, dna.mesh, rb.m] };
    B.anim = t => { if (fl) { const Q = []; for (let i = 0; i <= 49; i++) { const f = i / 49; Q.push([Math.sin(f * 10 - t * 9) * .32 * Math.min(1, f * 4), -2.6 - f * 3.4, Math.cos(f * 10 - t * 9) * .2 * Math.min(1, f * 4)]); } fl.set(Q, (i, n) => .07 * (1 - i / n * .5)); } };
    return B;
  }
  function mitocondria(g) {
    const T = g.T, gr = new T.Group();
    const mo = new T.Mesh(K.capsula(g, 1.15, 1.6, 32), K.pelicula(g, '#FF8A6B', { base: .12, fr: .8, cor2: '#FFD0C0', esc: 2 })); mo.renderOrder = 4; gr.add(mo);
    const mi = new T.Mesh(K.capsula(g, 1.0, 1.5, 32), K.fis(g, '#8A2F2A', { p: { roughness: .5, transparent: true, opacity: .55, depthWrite: false }, rim: '#FF9A80', rimK: .3 })); mi.renderOrder = 3; gr.add(mi);
    const mc = K.fis(g, '#FF9070', { p: { roughness: .42, clearcoat: .5, sheen: .5, sheenColor: new T.Color('#FFD8C8') }, rim: '#FFC0A8', rimK: .3 });
    for (let i = 0; i < 7; i++) { const c = new T.Mesh(K.esfera(g, 20), mc); const y = -1.85 + i * .62; c.position.set((i % 2 ? .22 : -.22), y, 0); c.scale.set(.82, .07, .66); c.rotation.z = (i % 2 ? .12 : -.12); gr.add(c); }
    return { gr, mo, mi, pecas: [mo, mi] };
  }
  function cloroplasto(g) {
    const T = g.T, gr = new T.Group();
    const mo = new T.Mesh(K.capsula(g, 1.2, 1.45, 32), K.pelicula(g, '#3FBF6A', { base: .12, fr: .8, cor2: '#C8FFD8', esc: 2 })); mo.scale.set(1, 1, .8); mo.renderOrder = 4; gr.add(mo);
    const mi = new T.Mesh(K.capsula(g, 1.05, 1.35, 32), K.fis(g, '#1E5A2E', { p: { roughness: .5, transparent: true, opacity: .5, depthWrite: false }, rim: '#7FE0A0', rimK: .3 })); mi.scale.set(1, 1, .8); mi.renderOrder = 3; gr.add(mi);
    const gn = K.inst(g, new T.CylinderGeometry(.34, .34, .07, 18), K.fis(g, '#3FCF6A', { p: { roughness: .35, clearcoat: .7 }, rim: '#B0FFC8', rimK: .3 }), 60, gr);
    const pos = [[0, -1.6, 0], [.4, -.8, .1], [-.4, -.2, -.05], [.35, .45, 0], [-.35, 1.05, .1], [.1, 1.75, 0]];
    pos.forEach(([x, y, z]) => { for (let k = 0; k < 6; k++) K.put(g, gn, [x, y, z - .2 + k * .085], g._q.setFromAxisAngle(g._v1.set(1, 0, 0), Math.PI / 2).clone(), 1, 1, 1, '#ffffff', .85 + k * .04); }); K.fim(gn);
    const la = K.inst(g, K.capsula(g, .05, .9, 6), K.fis(g, '#2FA35A', { rimK: .2 }), 6, gr); for (let i = 0; i < 5; i++) { const a = pos[i], b = pos[i + 1], d = sub(b, a); K.put(g, la, lerp3(a, b, .5), K.qy(g, d).clone(), 1, len(d) / 1.9, 1, '#ffffff', 1); } K.fim(la);
    return { gr, mo, mi, pecas: [mo, mi, gn.m] };
  }

  // ---------- partículas que brilham (ATP, açúcar): a carga útil em trânsito ----------
  function fluxo(g, cor, n) { return K.inst(g, K.esfera(g, 12), K.emis(g, cor, 2.2), n); }

  // ================= INVAGINAÇÃO =================
  // dobras da membrana plasmática crescem para dentro, envolvem o DNA (carioteca dupla com poros) e formam o retículo
  const PASSOS_I = ['célula ancestral: o DNA fica preso à membrana', 'a membrana plasmática se dobra para dentro', 'as dobras envolvem o DNA: carioteca dupla com poros', 'as dobras restantes formam o retículo endoplasmático'];
  const DIRS = [[.35, .9, .25], [-.85, .3, .4], [.2, -.75, .6], [.7, -.2, -.65], [-.4, -.5, -.75]].map(nrm);
  function envoltorio(g, r, cor) {
    // película com poros e revelação a partir das dobras (uAng: raio angular revelado em torno de cada direção)
    const T = g.T, u = { uC: { value: new T.Color(cor) }, uAng: { value: 0 }, uOp: { value: 1 }, uD: { value: DIRS.map(d => new T.Vector3(...d)) } };
    const m = new T.ShaderMaterial({
      uniforms: u, transparent: true, depthWrite: false, side: T.DoubleSide,
      vertexShader: 'varying vec3 vN; varying vec3 vV; varying vec3 vP; void main(){ vP = normalize(position); vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.0); vV = -mv.xyz; gl_Position = projectionMatrix*mv; }',
      fragmentShader: `uniform vec3 uC; uniform float uAng, uOp; uniform vec3 uD[5]; varying vec3 vN; varying vec3 vV; varying vec3 vP;
        void main(){
          float m = 9.0; for (int i = 0; i < 5; i++) m = min(m, acos(clamp(dot(vP, uD[i]), -1.0, 1.0)));
          if (m > uAng) discard;
          float th = acos(clamp(vP.y, -1.0, 1.0)), ph = atan(vP.z, vP.x);
          vec2 q = vec2(ph * 4.2, th * 5.0); vec2 c = fract(q) - 0.5; float d = length(c * vec2(1.0, 1.0));
          if (d < 0.16) discard;
          float lip = smoothstep(0.24, 0.16, d) + smoothstep(uAng - 0.12, uAng, m);
          float fr = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
          vec3 col = uC * (0.8 + fr * 0.8) + vec3(0.7, 0.75, 1.0) * lip * 0.6;
          gl_FragColor = vec4(col, (0.1 + fr * 0.55 + lip * 0.35) * uOp); }`
    });
    g.mats.push(m); const me = new T.Mesh(K.esfera(g, 64), m); me.scale.setScalar(r); me.renderOrder = 2; g.raiz.add(me); return { me, u };
  }
  K.cena('origem/invag', {
    ctl: { l: 'passo', min: 0, max: 3, step: 1, v: 0, f: v => `${v + 1} de 4`, auto: 5 },
    tip: 'Os passos passam sozinhos até você mexer no controle.',
    alt: 'Modelo 3D de uma célula ancestral translúcida: a membrana plasmática se dobra para dentro em vários pontos, as dobras envolvem o DNA e formam a carioteca, com duas membranas e poros, e as dobras que sobram viram o retículo endoplasmático',
    fit: 36, raio: 14, nevoa: .006,
    pecas: {
      mem: pc('Membrana plasmática', '#F06AAE', 'Na célula ancestral, a única membrana. As dobras dela para dentro teriam formado o sistema de endomembranas.'),
      dna: pc('DNA', '#B48CFF', 'Nas bactérias, o DNA fica preso à membrana. As dobras que o cercaram formaram o núcleo.'),
      dobra: pc('Dobra da membrana', '#F06AAE', 'Invaginação: a membrana cresce para dentro. O que fica dentro da dobra é, na origem, o lado de fora da célula.'),
      car: pc('Carioteca', '#7C8BFF', 'Envoltório nuclear de duas membranas, com poros. Surgiu das dobras que envolveram o DNA.'),
      poro: pc('Poro', '#C8D2FF', 'Abertura onde as dobras não se fecharam: por ela o núcleo troca moléculas com o citoplasma.'),
      re: pc('Retículo endoplasmático', '#4B7BFF', 'Dobras que ficaram no citoplasma. Até hoje o retículo é contínuo com a membrana externa da carioteca.')
    },
    rotulos: [{ pc: 'mem', t: 'Membrana plasmática', pr: 2 }, { pc: 'dna', t: 'DNA', pr: 1 }, { pc: 'dobra', t: 'Dobra da membrana', pr: 1 }, { pc: 'car', t: 'Carioteca', pr: 1 }, { pc: 'poro', t: 'Poro', pr: 2 }, { pc: 're', t: 'Retículo endoplasmático', pr: 1 }],
    montar(g) {
      const T = g.T, R = 10; g.R = R;
      g.H = hospedeira(g, R, { peca: g.pecas.mem }); g.pick.push(g.H.m);
      g.gr = graos(g, R, g.q.cel ? 120 : 260);
      // DNA: um novelo de fita no meio, com um fio preso à membrana
      g.dna = K.tubo(g, 400, 7, K.fis(g, '#B48CFF', { p: { roughness: .35, clearcoat: .7, emissive: new T.Color('#5A3AA0'), emissiveIntensity: .4 }, rim: '#E0D0FF', rimK: .35 }), null, g.pecas.dna); g.pick.push(g.dna.mesh);
      const r = rng(9), P = []; let p = [0, 0, 0], d = [1, 0, 0];
      for (let i = 0; i < 70; i++) { d = nrm(add(d, [r() - .5, r() - .5, r() - .5].map(x => x * 1.4))); p = add(p, mul(d, .55)); if (len(p) > 2.3) p = mul(nrm(p), 2.3); P.push(p); }
      g.dnaP = K.denso(P, 5);
      g.fio = K.tubo(g, 40, 6, g.dna.mesh.material); g.env = [envoltorio(g, 3.4, '#7C8BFF'), envoltorio(g, 3.95, '#9AA8FF')];
      g.env.forEach(e => { e.me.userData.peca = g.pecas.car; g.pick.push(e.me); });
      // retículo: lâminas curvas em volta da carioteca
      g.re = new T.Group(); g.raiz.add(g.re);
      const mR = K.pelicula(g, '#4B7BFF', { base: .14, fr: .7, cor2: '#B8C8FF', esc: 2 });
      for (let i = 0; i < 7; i++) { const s = new T.Mesh(new T.SphereGeometry(4.8 + (i % 3) * .75, 40, 14, i * .9, 1.4 + (i % 2) * .5, .9 + (i % 3) * .35, .6), mR); s.userData.peca = g.pecas.re; g.geos.push(s.geometry); g.re.add(s); g.pick.push(s); }
    },
    animar(g, P) {
      const st = P.passo, red = RED(), q = red ? 1 : cl(P.tp / 4.2, 0, 1), t = P.t, R = g.R;
      const s1 = st >= 1 ? (st === 1 ? out(q) : 1) : 0, s2 = st >= 2 ? (st === 2 ? out(q) : 1) : 0, s3 = st >= 3 ? out(q) : 0;
      const prof = R * .55 * s1 * (1 - .75 * s2);
      g.H.deformar(DIRS.map((d, i) => ({ dir: d, prof: prof * (i < 4 ? 1 : .7), w: .2 + .08 * s2, estreito: true })));
      g.gr.desenhar(p => len(p) < 4.4 && s2 > .3);
      // DNA
      const Q = g.dnaP.map((p, i) => add(p, [Math.sin(t * .5 + i * .2) * .05, Math.cos(t * .4 + i * .3) * .05, 0]));
      g.dna.set(Q, K.pontas(.13, 4));
      const ponta = Q[Q.length - 1], al = mul(DIRS[0], R * (1 - .02));
      if (s2 < 1) { const F = []; for (let i = 0; i <= 39; i++) { const f = i / 39; F.push(add(lerp3(ponta, mix(1, .45, s2) ? lerp3(ponta, al, 1 - s2 * .6) : al, f), [0, Math.sin(f * Math.PI) * .6, 0])); } g.fio.set(F, .09); g.fio.mesh.visible = true; } else g.fio.mesh.visible = false;
      // carioteca: revela a partir das dobras
      const ang = s2 * 1.75; g.env.forEach((e, i) => { e.u.uAng.value = ang * (i ? .97 : 1); e.me.visible = ang > .01; });
      g.re.visible = s3 > .01; g.re.children.forEach((c, i) => { c.scale.setScalar(mix(.75, 1, s3)); c.material.uniforms.uOp.value = s3; });
      g.anc.mem = [-R * .72, R * .62, R * .2]; g.anc.dna = add(Q[20], [0, .3, .3]); g.anc.dobra = mul(DIRS[1], R * .78); g.anc.car = [2.5, 2.4, 1.6]; g.anc.poro = mul(nrm([.2, .3, 1]), 3.9); g.anc.re = [-3.8, -3.4, 2.6];
      Object.assign(g.vis, { mem: 1, dna: 1, dobra: st === 1 ? 1 : 0, car: st >= 2 ? 1 : 0, poro: st >= 2 && s2 > .8 ? 1 : 0, re: st >= 3 ? 1 : 0 });
      Object.keys(g.pecas).forEach(k => { g.raioPc[k] = 5; });
    },
    camera(g, P) { const st = P.passo, c = st < 2 ? { th: -.45, fi: .28, d: 40, al: [0, 0, 0] } : { th: -.2, fi: .2, d: 33, al: [0, 0, 0] }; if (g.q.cel) c.d *= 1.3; return K.viva(c, P.t, .7); },
    legenda(P) { return `<b>${P.passo + 1}.</b> ${PASSOS_I[P.passo]}`; }
  });

  // ================= ENDOSSIMBIOSE (mitocôndria e cloroplasto) =================
  function endossimbiose(chave, tipo) {
    const mito = tipo === 'mito', COR = mito ? '#FF8A6B' : '#7FDA9C';
    const nm = mito ? 'bactéria aeróbia (α-proteobactéria)' : 'cianobactéria fotossintetizante';
    const PASSOS = [`${nm} vive livre`, 'é englobada por fagocitose, mas não é digerida', mito ? 'simbiose: ela faz respiração aeróbia e fornece ATP' : 'simbiose: ela faz fotossíntese e fornece açúcar', 'divide-se dentro da hospedeira, perde genes e vira organela'];
    const PEC = {
      cel: pc(mito ? 'Célula hospedeira' : 'Eucarionte com mitocôndrias', '#F06AAE', mito ? 'No modelo dos livros, uma célula com núcleo que engloba a bactéria. Os estudos atuais indicam uma hospedeira aparentada às arqueias Asgard.' : 'Uma célula eucariótica que já tinha mitocôndrias englobou a cianobactéria.'),
      nuc: pc('Núcleo', '#7C8BFF', 'Com o tempo, muitos genes da bactéria passaram para o núcleo da hospedeira.'),
      bac: pc(mito ? 'α-proteobactéria' : 'Cianobactéria', mito ? '#C9E27A' : '#3FBF6A', mito ? 'Bactéria aeróbia: usa O₂ para extrair muito mais energia dos alimentos.' : 'Bactéria fotossintetizante: usa a luz para fabricar açúcar. Os tilacoides lembram os do cloroplasto.'),
      mem2: pc('Duas membranas', '#FFE1A6', 'A organela fica com duas membranas, como as bactérias gram-negativas de que descende.'),
      vac: pc('Vesícula de fagocitose', '#F06AAE', 'A membrana da hospedeira envolve a bactéria, mas ela não é digerida.'),
      atp: pc(mito ? 'ATP' : 'Açúcar', mito ? '#FFB347' : '#E8F07A', mito ? 'A bactéria passa a fornecer ATP à hospedeira, que dá abrigo e nutrientes.' : 'A cianobactéria fornece açúcar feito com a luz do Sol.'),
      org: pc(mito ? 'Mitocôndria' : 'Cloroplasto', COR, mito ? 'A bactéria virou organela: tem DNA próprio, circular, com apenas 37 genes no ser humano.' : 'A cianobactéria virou organela: guarda DNA circular próprio, ribossomos 70S e tilacoides.'),
      mit: pc('Mitocôndria', '#FF8A6B', 'A hospedeira do cloroplasto já tinha mitocôndrias.'),
      luz: pc('Luz', '#FFE9A0', 'A energia da luz é usada na fotossíntese.')
    };
    K.cena(chave, {
      ctl: { l: 'passo', min: 0, max: 3, step: 1, v: 0, f: v => `${v + 1} de 4`, auto: 5.5 },
      tip: 'Os passos passam sozinhos até você mexer no controle.',
      alt: mito ? 'Modelo 3D: uma bactéria aeróbia nada perto de uma célula hospedeira, é englobada sem ser digerida, passa a fornecer ATP e, ao se dividir dentro da hospedeira, vira a mitocôndria' : 'Modelo 3D: uma cianobactéria é englobada por uma célula que já tem mitocôndrias, passa a fornecer açúcar feito com luz e, ao se dividir, vira o cloroplasto',
      fit: 40, raio: 16, nevoa: .005,
      pecas: PEC,
      rotulos: [{ pc: 'cel', t: mito ? 'Hospedeira' : 'Eucarionte com mitocôndrias', pr: 2 }, { pc: 'nuc', t: 'Núcleo', pr: 3 }, { pc: 'bac', t: mito ? 'α-proteobactéria' : 'Cianobactéria', pr: 1 }, { pc: 'vac', t: 'Vesícula de fagocitose', pr: 2 }, { pc: 'mem2', t: 'Duas membranas', pr: 1 }, { pc: 'atp', t: mito ? 'ATP' : 'Açúcar', pr: 1 }, { pc: 'org', t: mito ? 'Mitocôndria' : 'Cloroplasto', pr: 1 }, { pc: 'mit', t: 'Mitocôndria', pr: 3 }],
      montar(g) {
        const T = g.T, R = 9; g.R = R;
        g.H = hospedeira(g, R, { peca: PEC.cel }); g.pick.push(g.H.m);
        g.gr = graos(g, R, g.q.cel ? 90 : 200);
        g.N = nucleo(g, 2.9); g.N.gr.position.set(-3.2, -.6, -1.2); g.N.env.userData.peca = PEC.nuc; g.pick.push(g.N.env);
        g.mits = []; if (!mito) for (let i = 0; i < 2; i++) { const m = mitocondria(g); m.gr.scale.setScalar(.55); m.gr.position.set(i ? 1.5 : -2.5, i ? -4.6 : 4.2, i ? 2 : 1); m.gr.rotation.set(.3, 0, i ? 1.1 : -.6); g.raiz.add(m.gr); m.pecas.forEach(x => { x.userData.peca = PEC.mit; g.pick.push(x); }); g.mits.push(m); }
        g.bac = []; g.org = [];
        for (let i = 0; i < 2; i++) {
          const b = bacteria(g, mito ? { cor: '#8DB04A', corM: '#D8F09A', sem: 3 + i } : { cor: '#2E8A4A', corM: '#9CF0B8', tilacoides: true, sem: 5 + i }); g.raiz.add(b.gr); b.pecas.forEach(x => { x.userData.peca = PEC.bac; g.pick.push(x); }); g.bac.push(b);
          const o = mito ? mitocondria(g) : cloroplasto(g); g.raiz.add(o.gr); o.pecas.forEach(x => { x.userData.peca = PEC.org; g.pick.push(x); }); g.org.push(o);
        }
        g.vac = new T.Mesh(K.capsula(g, 1.45, 1.75, 32), K.pelicula(g, '#F06AAE', { base: .06, fr: .7, cor2: '#FFD6EA', esc: 2 })); g.vac.renderOrder = 5; g.vac.userData.peca = PEC.vac; g.raiz.add(g.vac); g.pick.push(g.vac);
        g.fx = fluxo(g, mito ? '#FFB347' : '#E8F07A', 30);
        if (!mito) { g.luz = new T.Mesh(new T.CylinderGeometry(.0, 4, 18, 32, 1, true), new T.ShaderMaterial({ uniforms: { opacity: { value: 0 }, uC: { value: new T.Color('#FFE9A0') } }, transparent: true, depthWrite: false, side: T.DoubleSide, blending: T.AdditiveBlending, vertexShader: 'varying vec2 vU; varying vec3 vN; varying vec3 vV; void main(){ vU = uv; vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.0); vV = -mv.xyz; gl_Position = projectionMatrix*mv; }', fragmentShader: 'uniform float opacity; uniform vec3 uC; varying vec2 vU; varying vec3 vN; varying vec3 vV; void main(){ float e = pow(abs(dot(normalize(vN), normalize(vV))), 2.5); float l = smoothstep(0.0, 0.45, vU.y) * smoothstep(1.0, 0.7, vU.y); gl_FragColor = vec4(uC * e * l * opacity * 9.0, 1.0); }' })); g.geos.push(g.luz.geometry); g.mats.push(g.luz.material); g.luz.position.set(9, 12, 0); g.luz.rotation.z = .55; g.raiz.add(g.luz); }
      },
      animar(g, P) {
        const st = P.passo, red = RED(), q = red ? 1 : cl(P.tp / 4.6, 0, 1), t = P.t, R = g.R;
        const dentro = [3.2, 1.4, .8], fora = [R + 4.8, 2.2, 1.5], ent = [R + .2, 1.8, 1.2], cdir = nrm(ent);
        // bactéria: posição e rotação por passo
        let bp, en = 0, viv = 1, div = 0, morph = 0;
        if (st === 0) { bp = add(fora, [Math.sin(t * .6) * .8 + (1 - out(q)) * 6, Math.sin(t * .9) * .5, Math.cos(t * .5) * .6]); }
        else if (st === 1) { en = q; bp = q < .35 ? lerp3(fora, add(ent, mul(cdir, 1.6)), out(q / .35)) : lerp3(add(ent, mul(cdir, 1.6)), dentro, mv((q - .35) / .55)); }
        else if (st === 2) { bp = add(dentro, [Math.sin(t * .4) * .2, Math.cos(t * .3) * .2, 0]); }
        else { bp = dentro; div = out(q); morph = sst(.35, .95, q); }
        // membrana da hospedeira: bolso e pseudópodes que se fecham em volta
        const bolso = st === 1 ? Math.sin(Math.min(1, en / .8) * Math.PI) : 0;
        g.H.deformar([{ dir: cdir, prof: 3.2 * bolso, w: .34, borda: 1.5 * bolso * (1 - sst(.55, .8, en)) }]);
        g.gr.desenhar(p => len(sub(p, g.N.gr.position)) < 3.2 || len(sub(p, bp)) < 2.6);
        const sc = .82, ang = st === 0 ? -1.2 + Math.sin(t * .5) * .2 : -1.2 + (st === 1 ? q * .6 : .6);
        for (let i = 0; i < 2; i++) {
          const b = g.bac[i], o = g.org[i], off = div * 1.7 * (i ? 1 : -1), pos = add(bp, [off * Math.cos(ang + 1.57) * .0 + off * .45, off * .55, i ? .4 * div : 0]);
          const vis = i === 0 || div > .02;
          b.gr.visible = vis && morph < .99; o.gr.visible = vis && morph > .01;
          b.gr.position.set(...pos); o.gr.position.set(...pos); b.gr.rotation.set(.2, .3, ang); o.gr.rotation.set(.2, .3, ang);
          const sb = sc * (1 - .25 * div) * (i ? Math.min(1, div * 1.6) : 1);
          b.gr.scale.setScalar(sb * (1 - morph * .3)); o.gr.scale.setScalar(sb * mix(.7, 1, morph));
          b.pecas.forEach(m => { if (m.material.uniforms) m.material.uniforms.uOp.value = 1 - morph; else m.material.opacity = (m.material.userData.op0 || (m.material.userData.op0 = m.material.opacity)) * (1 - morph); });
          o.pecas.forEach(m => { if (m.material.uniforms) m.material.uniforms.uOp.value = morph; });
          if (b.fl) b.fl.mesh.visible = st === 0 || (st === 1 && q < .4);
          b.anim(t);
        }
        // vesícula da fagocitose: aparece ao entrar e vira a membrana externa
        const vo = st === 1 ? sst(.45, .8, q) : st === 2 ? 1 : st === 3 ? 1 - morph : 0;
        g.vac.visible = vo > .01; g.vac.position.set(...bp); g.vac.rotation.set(.2, .3, ang); g.vac.scale.setScalar(sc); g.vac.material.uniforms.uOp.value = vo;
        // fluxo de ATP ou açúcar para a hospedeira
        const fo = st === 2 ? sst(0, .2, q) : st === 3 ? .6 * (1 - morph * .3) : 0;
        if (fo > .01) for (let i = 0; i < 14; i++) {
          const f = red ? (i + .5) / 14 : (t * .25 + i / 14) % 1, alvo = i % 2 ? add(g.N.gr.position.toArray(), [1.5, 1, 1]) : [-1 + (i % 5), -3 + (i % 3) * 2.5, 2.5];
          const p = add(lerp3(bp, alvo, f), [0, Math.sin(f * Math.PI) * 1.4, Math.sin(f * 7 + i) * .3]);
          K.put(g, g.fx, p, null, .16 * fo * Math.sin(Math.min(1, f * 1.2) * Math.PI) + .02, null, null, '#ffffff', 1, PEC.atp);
          if (i === 2) g.anc.atp = p;
        }
        K.fim(g.fx);
        if (g.luz) { const lo = st === 2 ? .06 * sst(0, .3, q) : st === 3 ? .04 : 0; g.luz.material.uniforms.opacity.value = lo; g.luz.visible = lo > .001; g.luz.lookAt(...bp); g.luz.rotateX(Math.PI / 2); g.luz.position.set(bp[0] + 6, bp[1] + 8, bp[2] + 2); }
        g.mits.forEach((m, i) => { m.gr.rotation.y = t * .1 + i; });
        g.anc.cel = [-R * .55, R * .78, R * .2]; g.anc.nuc = add(g.N.gr.position.toArray(), [-1.2, 2.4, 1]); g.anc.bac = add(bp, [.8, 1.6, .8]); g.anc.vac = add(bp, [-1.2, -1.5, .6]); g.anc.mem2 = add(bp, [1.1, -1.2, .8]); g.anc.org = add(bp, [.9, 1.6, .9]);
        if (g.mits[0]) g.anc.mit = g.mits[0].gr.position.toArray();
        Object.assign(g.vis, { cel: 1, nuc: 1, bac: morph < .5 ? 1 : 0, vac: st === 1 && q > .6 ? 1 : 0, mem2: st === 2 ? 1 : 0, atp: fo > .2 ? 1 : 0, org: morph > .6 ? 1 : 0, mit: mito ? 0 : 1 });
        Object.keys(PEC).forEach(k => { g.raioPc[k] = 4; }); g.raioPc.cel = 9;
      },
      camera(g, P) { const st = P.passo, c = st === 0 ? { th: .35, fi: .2, d: 40, al: [3, .5, 0] } : st === 1 ? { th: .25, fi: .18, d: 36, al: [2.5, 1, 0] } : { th: -.1, fi: .16, d: 34, al: [1.2, .6, 0] }; if (g.q.cel) c.d *= 1.35; return K.viva(c, P.t, .6); },
      legenda(P) { return `<b>${P.passo + 1}.</b> ${PASSOS[P.passo]}`; }
    });
  }
  endossimbiose('origem/mito', 'mito');
  endossimbiose('origem/cloro', 'cloro');

  // ================= EVIDÊNCIAS: fissão binária sincronizada =================
  K.cena('origem/evid', {
    alt: 'Modelo 3D com uma bactéria, uma mitocôndria e um cloroplasto lado a lado, que se dividem ao mesmo tempo por fissão binária: cada um duplica o DNA circular, se alonga, estrangula no meio e vira dois',
    fit: 34, raio: 14, nevoa: .006,
    pecas: {
      bac: pc('Bactéria', '#A9C54A', 'Procarionte: DNA circular, ribossomos 70S, divisão por fissão binária.'),
      mit: pc('Mitocôndria', '#FF8A6B', 'Tem DNA circular próprio, ribossomos do tipo bacteriano e se divide por fissão, como as bactérias.'),
      clo: pc('Cloroplasto', '#3FBF6A', 'Tem DNA circular próprio, ribossomos 70S e se divide por fissão, como as cianobactérias.'),
      dna: pc('DNA circular', '#B48CFF', 'Sem histonas, como o das bactérias. É copiado antes da divisão.'),
      rib: pc('Ribossomos bacterianos', '#FFF2D0', 'Do tipo 70S (55S na mitocôndria humana), sensíveis aos mesmos antibióticos que atacam bactérias.'),
      mem: pc('Duas membranas', '#FFE1A6', 'Mitocôndria e cloroplasto têm duas membranas; a interna tem cardiolipina, um lipídio típico de bactérias.')
    },
    rotulos: [{ pc: 'bac', t: 'Bactéria', pr: 1 }, { pc: 'mit', t: 'Mitocôndria', pr: 1 }, { pc: 'clo', t: 'Cloroplasto', pr: 1 }, { pc: 'dna', t: 'DNA circular', pr: 2 }, { pc: 'rib', t: 'Ribossomos bacterianos', pr: 2 }, { pc: 'mem', t: 'Duas membranas', pr: 3 }],
    montar(g) {
      const T = g.T; g.it = [];
      const mk = (f, id, x) => { const a = f(), b = f(); [a, b].forEach(o => { g.raiz.add(o.gr); (o.pecas || []).forEach(m => { m.userData.peca = g.pecas[id]; g.pick.push(m); }); }); return { a, b, x, id }; };
      const dx = g.q.cel ? 0 : 8.5;
      g.it.push(mk(() => bacteria(g, { cor: '#8DB04A', corM: '#D8F09A', flagelo: false }), 'bac', -dx));
      g.it.push(mk(() => mitocondria(g), 'mit', 0));
      g.it.push(mk(() => cloroplasto(g), 'clo', dx));
      // DNA circular de cada um (aneis que se duplicam e se separam)
      g.an = K.inst(g, new T.TorusGeometry(.55, .07, 8, 40), K.emis(g, '#B48CFF', .9), 6, null, g.pecas.dna); g.geos.push(g.an.m.geometry); g.pick.push(g.an.m);
      g.rb = K.inst(g, K.esfera(g, 8), K.fis(g, '#FFF2D0', { rimK: .1 }), 120, null, g.pecas.rib); g.pick.push(g.rb.m);
    },
    animar(g, P) {
      const t = P.t, red = RED(), f = red ? .3 : (t / 9) % 1, cel = g.q.cel;
      const e = sst(0, .35, f), c2 = sst(.35, .7, f), d = sst(.7, .92, f), al = f > .95 ? 1 - seg(f, .95, 1) : f < .04 ? seg(f, 0, .04) : 1;
      const qx = g._q.setFromAxisAngle(g._v1.set(0, 0, 1), Math.PI / 2).clone();
      g.it.forEach((o, k) => {
        const y = cel ? (1 - k) * 8.5 : 0, x = cel ? 0 : o.x, sep = (1.0 + 1.6 * c2 + 1.4 * d) * (1 - (f > .95 ? seg(f, .95, 1) : 0));
        const L = .78 * (1 - .12 * c2);
        [o.a, o.b].forEach((m, i) => { m.gr.position.set(x + (i ? 1 : -1) * sep * .5 * (e > 0 ? 1 : 0) * Math.min(1, e * 3 + c2), y, 0); m.gr.quaternion.copy(qx); m.gr.scale.set(L, L * mix(1, .62, Math.max(e * .4, c2)), L); m.gr.visible = i === 0 || f > .02; m.gr.rotateY(t * .15); });
        // dois anéis de DNA: um vira dois durante o alongamento
        for (let i = 0; i < 2; i++) { const s = (i ? 1 : -1) * sep * .5 * Math.min(1, e * 3 + c2) + (i ? 1 : -1) * .5 * e; K.put(g, g.an, [x + s * .6, y, .3], g._q.setFromEuler(new g.T.Euler(1.2, t * .3 + i, 0)).clone(), .9 * L, null, null, '#ffffff', 1, g.pecas.dna); }
        const r = rng(9 + k); for (let i = 0; i < 26; i++) { const side = i % 2 ? 1 : -1, px = x + side * sep * .5 * Math.min(1, e * 3 + c2) + (r() - .5) * 2.2 * L, pz = (r() - .5) * 1.2; K.put(g, g.rb, [px, y + (r() - .5) * 1.3 * L, pz], null, .09, null, null, '#ffffff', 1, g.pecas.rib); }
        g.anc[o.id] = [x - 1.2, y + 2.4, .5];
        void al;
      });
      K.fim(g.an); K.fim(g.rb);
      g.anc.dna = [g.it[0].x + .4, 0, .4]; g.anc.rib = [g.it[1].x + .8, -.6, .5]; g.anc.mem = [g.it[2].x + 1.4, -1.1, .9];
      if (cel) { g.anc.dna = [0, 8.5, .4]; g.anc.rib = [.8, -.6, .5]; g.anc.mem = [1.4, -9.6, .9]; }
      Object.keys(g.pecas).forEach(k => { g.vis[k] = 1; g.raioPc[k] = 5; });
      g.f = f;
    },
    camera(g, P) { return K.viva(g.q.cel ? { th: -.2, fi: .15, d: 44, al: [0, 0, 0] } : { th: -.15, fi: .25, d: 24, al: [0, 0, 0] }, P.t, .6); },
    legenda(P, g) { const f = g.f || 0; return `as três se dividem por fissão binária<small>${f < .35 ? 'o DNA circular é copiado' : f < .7 ? 'a célula se alonga e estrangula no meio' : 'surgem duas, iguais à original'}</small>`; }
  });
})();
