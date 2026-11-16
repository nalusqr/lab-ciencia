/* LAB Taxonomia: kit 3D do módulo (Martin). Adaptado do histo3d.js e do pipeline de imagem do mol3d.js, sem tocar neles.
   Aqui o palco continua sendo o desenho 2D (diagramas, cartões, árvores, toques), e os seres vivos deixam de ser ícones
   chapados: cada um vira uma miniatura esculpida em 3D (superfícies de revolução, tubos de raio variável e elipsoides
   fundidos), com os materiais e a luz do pipeline. A miniatura é renderizada num WebGL fora da tela e entra no canvas 2D
   no mesmo ponto da ordem de pintura em que o ícone entrava: respeita recortes, transparência, zoom e o que vem por cima.
   O mesmo elenco serve a todas as cenas. Sem WebGL, nada muda: os ícones 2D antigos são o plano B.
   API: TAXO3D.ator(id, x, y, s, o) desenha o ser id centrado em (x, y), cabendo num quadrado de lado s, e devolve true;
   devolve false quando não há 3D (aí quem chamou desenha o 2D). TAXO3D.prop(tipo, x, y, w, h, o) desenha peças de cena
   (livro, herbário, mapa) registradas por cenas3d.js. Pipeline: superamostragem 2x em dpr 1 (reduz com a qualidade
   adaptativa: ignora 3 s, baixa acima de 30 ms com piso 0,75, volta abaixo de 20 ms), sem nitidez artificial nem halo,
   clearcoat suave com variação de cor, borda colorida só nos destaques, câmera viva que oscila devagar, cede ao toque
   (arrastar gira o ser) e volta sozinha após 12 s parado, e nada se mexe com prefers-reduced-motion. */
'use strict';
(function () {
  if (typeof X === 'undefined' || typeof SC === 'undefined') return;
  const TAU = Math.PI * 2;
  const REDUZ = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const SRC = (document.currentScript && document.currentScript.src) || '';
  const cl = (v, a, b) => (v < a ? a : v > b ? b : v), mix = (a, b, t) => a + (b - a) * t;
  const sst = (a, b, x) => { const t = cl((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const eOut = x => 1 - Math.pow(1 - cl(x, 0, 1), 3);
  const hs = (i, k) => { let h = Math.imul(i | 0, 374761393) ^ Math.imul((k | 0) + 7, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const K3 = { ok: false, falhou: false, ATOR: {}, PROP: {}, NOMES: {} };
  window.TAXO3D = K3;
  let T = null, ren = null, glc = null, cena = null, cam = null, cw = 0, ch = 0;
  const U = { uRim: { value: null }, uRimK: { value: 0 }, uVar: { value: 0 } };
  const POOL = {}, uso = {}, desenhados = [];
  let quadro = 0, tUlt = 0;
  const t0 = performance.now(), agora = () => (performance.now() - t0) / 1000;
  const Q = { esc: 1, ema: 16, idade: 0, lento: 0, rapido: 0 };
  // câmera viva: oscila devagar; o toque assume e ela volta sozinha 12 s depois
  const VIVA = { yaw: 0, pitch: 0, tMexeu: -1e9 };

  // ---------- carga do THREE (mesmo bundle do mol3d, por <script>, funciona por file://) ----------
  function temWebGL() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
  function carregar() {
    if (window.R3F && window.R3F.THREE) return Promise.resolve(window.R3F.THREE);
    return new Promise((ok, falha) => {
      const s = document.createElement('script'); s.src = new URL('../celula/vendor/r3f.js', SRC || location.href).href;
      s.onload = () => (window.R3F && window.R3F.THREE ? ok(window.R3F.THREE) : falha(new Error('r3f.js sem THREE')));
      s.onerror = () => falha(new Error('não carregou ' + s.src)); document.head.appendChild(s);
    });
  }
  function iniciar(THREE) {
    T = THREE; glc = document.createElement('canvas'); glc.width = glc.height = cw = ch = 512;
    ren = new T.WebGLRenderer({ canvas: glc, antialias: true, alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    ren.setPixelRatio(1); ren.setSize(cw, ch, false); ren.setClearColor(0x000000, 0);
    ren.toneMapping = T.NeutralToneMapping || T.ACESFilmicToneMapping; ren.toneMappingExposure = .95;
    if ('outputColorSpace' in ren) ren.outputColorSpace = T.SRGBColorSpace;
    cena = new T.Scene(); cam = new T.PerspectiveCamera(18, 1, .2, 80); cam.position.set(0, 0, 6); cena.add(cam);
    // luz de estúdio do Lab: chave morna de cima e da esquerda, preenchimento frio da direita, recorte frio por trás
    const L = (c, i, p) => { const l = new T.DirectionalLight(c, i); l.position.set(p[0], p[1], p[2]); cam.add(l); const a = new T.Object3D(); a.position.set(0, 0, -6); cam.add(a); l.target = a; return l; };
    L('#FFF1E0', 2.1, [-5, 7, 6]); L('#CFE0FF', .65, [7, 1, 3]); L('#BFD8FF', 1.9, [4, 5, -9]);
    cena.add(new T.HemisphereLight('#E8EEFF', '#2A2036', .55));
    try { const pm = new T.PMREMGenerator(ren); const RE = window.R3F.RoomEnvironment; if (RE) cena.environment = pm.fromScene(new RE(ren), .04).texture; } catch (e) { /* só as luzes */ }
    U.uRim.value = new T.Color('#9FB4E0');
    K3.T = T; K3.ok = true;
  }

  // ---------- materiais: clearcoat suave, variação de cor pela posição, ventre mais claro, listras, borda de destaque ----------
  const MATS = {};
  function mat(cor, o = {}) {
    const key = cor + JSON.stringify(o); if (MATS[key]) return MATS[key];
    const m = new T.MeshPhysicalMaterial({ color: new T.Color(cor), roughness: o.r == null ? .55 : o.r, metalness: 0, clearcoat: o.cc == null ? .32 : o.cc, clearcoatRoughness: .42,
      sheen: o.sh || 0, sheenColor: new T.Color(o.shc || '#FFF3E6'), sheenRoughness: .55, envMapIntensity: o.env == null ? .6 : o.env,
      transparent: o.op != null, opacity: o.op == null ? 1 : o.op, depthWrite: o.op == null, side: o.lados ? T.DoubleSide : T.FrontSide });
    if (o.emis) { m.emissive = new T.Color(o.emis); m.emissiveIntensity = o.ek || 1; }
    const v = o.ventre ? new T.Color(o.ventre) : null, li = o.listras ? new T.Color(o.listras.cor) : null;
    m.onBeforeCompile = sh => {
      sh.uniforms.uRim = U.uRim; sh.uniforms.uRimK = U.uRimK; sh.uniforms.uVar = U.uVar;
      if (v) sh.uniforms.uVen = { value: v }; if (li) sh.uniforms.uLis = { value: li };
      sh.vertexShader = 'varying vec3 vObjP;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjP = position;');
      let cf = `#include <color_fragment>
        float nz = fract(sin(dot(floor(vObjP * 9.0), vec3(12.9898, 78.233, 37.719))) * 43758.5453);
        float nz2 = fract(sin(dot(floor(vObjP * 23.0), vec3(39.34, 11.13, 83.17))) * 24634.6345);
        diffuseColor.rgb *= (0.94 + 0.05 * nz + 0.03 * nz2) * (1.0 + uVar);`;
      if (v) cf += `\n diffuseColor.rgb = mix(diffuseColor.rgb, uVen, smoothstep(${(o.vy == null ? -.25 : o.vy).toFixed(3)} + 0.18, ${(o.vy == null ? -.25 : o.vy).toFixed(3)} - 0.12, ${(o.veixo || 'y')[0] === '-' ? '-vObjP.' + o.veixo.slice(1) : 'vObjP.' + (o.veixo || 'y')}));`;
      if (li) cf += `\n { float s = sin(vObjP.${o.listras.eixo || 'x'} * ${(o.listras.n || 10).toFixed(2)} + sin(vObjP.y * 7.0) * ${(o.listras.onda || .6).toFixed(2)}); diffuseColor.rgb = mix(diffuseColor.rgb, uLis, smoothstep(${(o.listras.lim || .35).toFixed(2)}, ${((o.listras.lim || .35) + .2).toFixed(2)}, s) * ${(o.listras.k || .8).toFixed(2)}); }`;
      sh.fragmentShader = 'varying vec3 vObjP; uniform vec3 uRim; uniform float uRimK, uVar;' + (v ? ' uniform vec3 uVen;' : '') + (li ? ' uniform vec3 uLis;' : '') + '\n' +
        sh.fragmentShader.replace('#include <color_fragment>', cf).replace('#include <opaque_fragment>',
          'outgoingLight += uRim * uRimK * pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 2.4);\n#include <opaque_fragment>');
    };
    m.customProgramCacheKey = () => 'tx3-' + (v ? 'v' + (o.veixo || 'y').replace('-', 'n') + (o.vy == null ? '' : o.vy) : '') + (li ? 'l' + JSON.stringify(o.listras) : '');
    MATS[key] = m; return m;
  }
  const OLHO = () => mat('#120E10', { r: .12, cc: 1, env: 1 });
  const BRILHO = () => mat('#FFFFFF', { emis: '#FFFFFF', ek: 1.6, r: .2 });

  // ---------- geometrias ----------
  const GC = {};
  const SPH = () => GC.sph || (GC.sph = new T.SphereGeometry(1, 30, 22));
  const SPHb = () => GC.sphb || (GC.sphb = new T.SphereGeometry(1, 14, 10));
  const CIL = () => GC.cil || (GC.cil = new T.CylinderGeometry(1, 1, 1, 20, 1));
  const CONE = () => GC.cone || (GC.cone = new T.ConeGeometry(1, 1, 22, 1));
  function geoTubo(pts, rf, nSeg, nRad) {
    const V = p => new T.Vector3(p[0], p[1], p[2]);
    const cur = new T.CatmullRomCurve3(pts.map(V), false, 'centripetal'), fr = cur.computeFrenetFrames(nSeg, false);
    const pos = [], nor = [], idx = [], P = new T.Vector3();
    for (let i = 0; i <= nSeg; i++) {
      const f = i / nSeg; cur.getPointAt(f, P); const r = typeof rf === 'function' ? rf(f) : rf, N = fr.normals[i], B = fr.binormals[i];
      for (let j = 0; j <= nRad; j++) { const a = j / nRad * TAU, c = Math.cos(a), s = Math.sin(a), nx = N.x * c + B.x * s, ny = N.y * c + B.y * s, nz = N.z * c + B.z * s; pos.push(P.x + nx * r, P.y + ny * r, P.z + nz * r); nor.push(nx, ny, nz); }
    }
    for (let i = 0; i < nSeg; i++) for (let j = 0; j < nRad; j++) { const a = i * (nRad + 1) + j, b = a + nRad + 1; idx.push(a, a + 1, b, b, a + 1, b + 1); }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new T.Float32BufferAttribute(nor, 3)); g.setIndex(idx);
    g.userData.ini = cur.getPointAt(0); g.userData.fim = cur.getPointAt(1); return g;
  }
  // folha: fita ao longo de +x, largura em perfil de folha, curvada para baixo e dobrada na nervura
  function geoFolha(comp, larg, curv, dobra, o = {}) {
    const n = o.n || 14, m = 6, pos = [], idx = [], pw = o.forma === 'oval' ? .55 : o.forma === 'fita' ? .25 : .85;
    for (let i = 0; i <= n; i++) {
      const f = i / n, w = larg * Math.pow(Math.max(0, Math.sin(Math.PI * Math.min(1, f * (o.base ? 1 : .98) + .02))), pw) * (o.forma === 'fita' ? (1 - f * .6) : 1);
      const x = f * comp, y = -curv * f * f * comp;
      for (let j = 0; j <= m; j++) { const v = j / m * 2 - 1; pos.push(x, y - Math.abs(v) * w * dobra, v * w); }
    }
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const a = i * (m + 1) + j, b = a + m + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
  }
  // forma plana com espessura (barbatanas, asas, orelhas)
  function geoForma(pts, esp, bisel) {
    const s = new T.Shape(); pts.forEach((p, i) => (i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1])));
    const g = new T.ExtrudeGeometry(s, { depth: esp, bevelEnabled: true, bevelThickness: bisel == null ? esp * .8 : bisel, bevelSize: bisel == null ? esp * .8 : bisel, bevelSegments: 2, curveSegments: 10 });
    g.translate(0, 0, -esp / 2); g.computeVertexNormals(); return g;
  }
  function geoCurva(pts, n) { const s = new T.Shape(), c = new T.SplineCurve(pts.map(p => new T.Vector2(p[0], p[1]))); s.setFromPoints(c.getPoints(n || 40)); return s; }

  // ---------- construtor: ajudantes de modelagem num grupo ----------
  function oficina(raiz) {
    const b = { raiz, p: {} };
    const pai = q => q || raiz, put = (m, p, r, rot, q) => { if (p) m.position.set(p[0], p[1], p[2]); if (r != null) { if (Array.isArray(r)) m.scale.set(r[0], r[1], r[2]); else m.scale.setScalar(r); } if (rot) m.rotation.set(rot[0], rot[1], rot[2]); pai(q).add(m); return m; };
    b.m = mat;
    b.grupo = (p, q, rot) => { const g = new T.Group(); if (p) g.position.set(p[0], p[1], p[2]); if (rot) g.rotation.set(rot[0], rot[1], rot[2]); pai(q).add(g); return g; };
    b.sph = (M, p, r, rot, q) => put(new T.Mesh(SPH(), M), p, r, rot, q);
    b.bol = (M, p, r, q) => put(new T.Mesh(SPHb(), M), p, r, null, q);
    b.cil = (M, p, r, h, rot, q) => put(new T.Mesh(CIL(), M), p, [r, h, r], rot, q);
    b.cone = (M, p, r, h, rot, q) => put(new T.Mesh(CONE(), M), p, [r, h, r], rot, q);
    b.tubo = (M, pts, rf, q, o = {}) => {
      const g = geoTubo(pts, rf, o.seg || 20, o.rad || 12), m = put(new T.Mesh(g, M), null, null, null, q);
      const r0 = typeof rf === 'function' ? rf(0) : rf, r1 = typeof rf === 'function' ? rf(1) : rf;
      if (o.tampa !== false) { if (r0 > .004) b.bol(M, [g.userData.ini.x, g.userData.ini.y, g.userData.ini.z], r0, q); if (r1 > .004) b.bol(M, [g.userData.fim.x, g.userData.fim.y, g.userData.fim.z], r1, q); }
      return m;
    };
    b.torno = (M, perfil, p, rot, q, n) => put(new T.Mesh(new T.LatheGeometry(perfil.map(v => new T.Vector2(Math.max(1e-4, v[0]), v[1])), n || 28), M), p, null, rot, q);
    b.folha = (M, comp, larg, curv, dobra, p, rot, q, o) => put(new T.Mesh(geoFolha(comp, larg, curv, dobra, o), M), p, null, rot, q);
    b.forma = (M, pts, esp, p, rot, q, bisel) => put(new T.Mesh(geoForma(pts, esp, bisel), M), p, null, rot, q);
    // olho: esfera escura brilhante com o reflexo da luz chave
    b.olho = (p, r, q) => { b.sph(OLHO(), p, r, null, q); b.bol(BRILHO(), [p[0] - r * .25, p[1] + r * .38, p[2] + r * .72], r * .26, q); };
    b.par = (fn) => { fn(1); fn(-1); };
    return b;
  }

  // ---------- quadrúpede genérico (felinos, canídeos, equinos) ----------
  // p: cor, ventre, L (meio corpo), R (raio), y (altura do corpo), chao, pr (raio da perna), cab ([x,y]), cr (raio da cabeça),
  //    foc (focinho: [comprimento, raio]), orelha ('tri'|'redonda'|'caida'|'ponta'|'equino', tamanho), cauda (pontos), cr2 etc.
  function quad(b, p) {
    const M = mat(p.cor, { ventre: p.ventre, vy: -.45, sh: p.pelo == null ? .55 : p.pelo, shc: p.shc, listras: p.listras }), Mc = p.corCab ? mat(p.corCab, { sh: .5 }) : mat(p.cor, { sh: p.pelo == null ? .55 : p.pelo, ventre: p.ventre, vy: -.6 });
    const y0 = p.y, L = p.L, R = p.R, Rz = p.Rz || R * .86, chao = p.chao == null ? -.66 : p.chao, pr = p.pr || .075;
    const tor = b.tubo(M, [[-L * .78, y0 + R * .06, 0], [-L * .3, y0 - R * .02, 0], [L * .3, y0, 0], [L * .8, y0 + R * .1, 0]], f => R * (.84 + .16 * Math.sin(Math.PI * f) + .1 * Math.exp(-(((f - .85) / .14) ** 2)) + .06 * Math.exp(-(((f - .1) / .12) ** 2))), null, { seg: 24, rad: 22 });
    tor.scale.z = Rz / R; b.p.tronco = tor;
    const Mp = p.corPerna ? mat(p.corPerna, { sh: .4 }) : M, Mpata = mat(p.pata || p.corPerna || p.cor, { sh: .3, r: p.casco ? .35 : .55, cc: p.casco ? .6 : .3 });
    b.p.pernas = [];
    [[L * .66, 1], [L * .6, -1], [-L * .62, 1], [-L * .56, -1]].forEach(([lx, sz], i) => {
      const yq = y0 - R * .3, pv = b.grupo([lx, yq, sz * Rz * .52]), h = yq - chao, tras = lx < 0;
      const curva = tras ? [[0, 0, 0], [-.05 * h, -h * .45, 0], [.02 * h, -h * .78, 0], [0, -h + pr * .8, 0]] : [[0, 0, 0], [.02 * h, -h * .5, 0], [0, -h + pr * .8, 0]];
      b.tubo(Mp, curva, f => pr * (1.35 - f * .55) * (tras && f < .4 ? 1.25 : 1), pv, { seg: 14, rad: 10 });
      if (p.casco) b.cil(Mpata, [0, -h + pr * .5, 0], pr * .95, pr * 1.1, null, pv);
      else b.sph(Mpata, [pr * .45, -h + pr * .55, 0], [pr * 1.45, pr * .75, pr * 1.15], null, pv);
      b.p.pernas.push(pv);
    });
    // pescoço e cabeça
    const cx = p.cab[0], cy = p.cab[1], cr = p.cr;
    b.tubo(p.crina ? M : Mc, [[L * .7, y0 + R * .35, 0], [mix(L * .7, cx, .55), mix(y0 + R * .5, cy, .55), 0], [cx - cr * .3, cy - cr * .2, 0]], f => mix(p.pesc || R * .62, cr * .78, f), null, { seg: 12, rad: 14 });
    const cab = b.grupo([cx, cy, 0]); b.p.cab = cab;
    b.sph(Mc, [0, 0, 0], [cr * (p.cabAlong || 1.05), cr, cr * .92], [0, 0, p.cabRot || 0], cab);
    if (p.foc) {
      const [fl, fr] = p.foc, ang = p.focAng || -.25, fx = Math.cos(ang) * cr * .75, fy = Math.sin(ang) * cr * .75;
      b.sph(p.corFoc ? mat(p.corFoc, { sh: .4 }) : Mc, [fx + fl * .5, fy - fr * .1, 0], [fl * .7 + fr * .25, fr, fr * .95], [0, 0, ang * .6], cab);
      b.sph(mat(p.nariz || '#2A1C1C', { r: .3, cc: .8 }), [fx + fl * 1.05 + fr * .1, fy + fr * .15, 0], [fr * .32, fr * .26, fr * .4], null, cab);
    }
    b.par(s => b.olho([cr * (p.olhoX || .55), cr * (p.olhoY || .32), s * cr * .55], cr * (p.olho || .17), cab));
    const Mo = mat(p.corOrelha || p.cor, { sh: .5 }), Mi = mat(p.orelhaIn || '#E8A9A0', { sh: .3 });
    const [ot, os] = p.orelha || ['tri', 1];
    b.par(s => {
      const og = b.grupo([-cr * .15, cr * .78, s * cr * .5], cab, [s * .25, 0, ot === 'caida' ? .5 : -.08]);
      if (ot === 'tri' || ot === 'ponta') { b.cone(Mo, [0, cr * .3 * os, 0], cr * .38 * (ot === 'ponta' ? .9 : 1), cr * .7 * os * (ot === 'ponta' ? 1.3 : 1), [0, 0, 0], og); b.cone(Mi, [cr * .06, cr * .26 * os, s * cr * .05], cr * .22, cr * .48 * os, [0, 0, 0], og); }
      else if (ot === 'redonda') { b.sph(Mo, [0, cr * .1, 0], [cr * .3, cr * .3, cr * .14], null, og); b.sph(Mi, [cr * .05, cr * .1, s * cr * .05], [cr * .18, cr * .18, cr * .08], null, og); }
      else if (ot === 'caida') { b.sph(Mo, [cr * .1, -cr * .35, s * cr * .08], [cr * .22, cr * .5, cr * .12], [0, 0, .2], og); }
      else if (ot === 'equino') { b.sph(Mo, [0, cr * .45 * os, 0], [cr * .2, cr * .55 * os, cr * .12], [0, 0, -.1], og); b.sph(Mi, [cr * .04, cr * .45 * os, s * cr * .05], [cr * .1, cr * .42 * os, cr * .07], [0, 0, -.1], og); }
    });
    // cauda (grupo com pivô na base)
    if (p.cauda) {
      const cg = b.grupo([-L * .95, y0 + R * .35, 0]); b.p.cauda = cg;
      b.tubo(mat(p.corCauda || p.cor, { sh: .5 }), p.cauda, p.caudaR || (f => .055 * (1 - f * .5)), cg, { seg: 18, rad: 10 });
      if (p.tufo) { const e = p.cauda[p.cauda.length - 1]; b.sph(mat(p.tufo, { sh: .6 }), e, [.07, .1, .07], null, cg); }
    }
    if (p.crina) b.tubo(mat(p.crina, { sh: .7, r: .7 }), [[L * .62, y0 + R * .9, 0], [mix(L * .7, cx, .5), mix(y0 + R * 1.1, cy, .5) + .08, 0], [cx - cr * .2, cy + cr * .75, 0]], f => .05 * (1 - .4 * f) + .02, null, { seg: 12 });
    return M;
  }
  // animação de quadrúpede: respiração, cauda, cabeça, passo opcional
  function animaQuad(b, sp) {
    return (t, A, o) => {
      const P = b.p, k = REDUZ ? 0 : 1;
      if (P.cauda) P.cauda.rotation.set(Math.sin(t * 1.7 + A.fase) * .18 * k, 0, Math.sin(t * 1.1 + A.fase) * .12 * k);
      if (P.cab) { P.cab.rotation.z = Math.sin(t * .6 + A.fase) * .05 * k; P.cab.rotation.y = Math.sin(t * .45 + A.fase * 2) * .14 * k; }
      const andar = o.andar || 0;
      P.pernas.forEach((pv, i) => { pv.rotation.z = Math.sin(t * 7 + (i === 0 || i === 3 ? 0 : Math.PI)) * .38 * andar * k; });
      if (P.tronco) P.tronco.scale.y = 1 + Math.sin(t * 2.2 + A.fase) * .015 * k;
      if (sp) sp(t, A, o, k);
    };
  }

  // ---------- o elenco ----------
  const ELENCO = {};
  function def(id, nome, sci, fn, o = {}) { ELENCO[id] = { fn, marg: o.marg || 1.3, chao: o.chao == null ? -.68 : o.chao, sombra: o.sombra !== false, yaw: o.yaw == null ? -.5 : o.yaw, pitch: o.pitch || 0 }; K3.NOMES[id] = [nome, sci]; }
  const pts = a => a;

  // felinos
  const felino = (cor, ventre, extra) => b => {
    quad(b, Object.assign({ cor, ventre, L: .42, R: .2, Rz: .17, y: -.05, chao: -.62, pr: .062, cab: [.66, .2], cr: .19, foc: [.05, .075], focAng: -.35, orelha: ['tri', .75], nariz: '#C46A6A', olhoX: .62, olhoY: .25, olho: .16, pesc: .13,
      cauda: [[0, 0, 0], [-.2, .02, 0], [-.34, .2, .02], [-.36, .42, .04]], caudaR: f => .05 * (1 - f * .35) }, extra));
    return animaQuad(b);
  };
  def('gato', 'gato doméstico', 'Felis catus', felino('#D98C45', '#F4D9B5', { listras: { cor: '#A4561F', n: 22, k: .5, lim: .5, onda: 1.2 } }));
  def('onca', 'onça-pintada', 'Panthera onca', b => {
    const a = felino('#DDA445', '#F4E6C6', { L: .46, R: .22, orelha: ['redonda', 1], cr: .2, cauda: [[0, 0, 0], [-.22, -.06, 0], [-.36, -.22, .02], [-.38, -.4, .04]] })(b);
    const Mm = mat('#2E1E14', { r: .6, sh: .3 });
    for (let i = 0; i < 26; i++) {
      const u = hs(i, 1) * 2 - 1, v = hs(i, 2) * TAU, th = Math.acos(cl(u, -.95, .95));
      const d = [Math.sin(th) * Math.cos(v), Math.cos(th), Math.sin(th) * Math.sin(v)]; if (d[1] < -.4) continue;
      const p = [d[0] * .44, -.05 + d[1] * .21, d[2] * .18]; b.sph(Mm, p, [.028, .028, .012], [0, Math.atan2(d[0], d[2]), 0]);
    }
    return a;
  });
  def('leao', 'leão', 'Panthera leo', b => {
    const a = felino('#C99A5B', '#EED8B0', { L: .46, R: .22, orelha: ['redonda', 1], cr: .2, tufo: '#6A3E1E' })(b);
    b.sph(mat('#7A4A22', { sh: .8, r: .75 }), [-.1, -.02, 0], [.16, .3, .3], null, b.p.cab); return a;
  });
  // canídeos
  def('cao', 'cão', 'Canis familiaris', b => {
    quad(b, { cor: '#C99560', ventre: '#F0DDBF', L: .42, R: .2, y: -.02, chao: -.62, pr: .065, cab: [.66, .26], cr: .17, foc: [.14, .085], focAng: -.2, orelha: ['caida', 1], nariz: '#1E1414', pesc: .13, corOrelha: '#8C5C34',
      cauda: [[0, 0, 0], [-.12, .12, 0], [-.18, .3, 0]], caudaR: f => .045 * (1 - f * .4) });
    return animaQuad(b, (t, A, o, k) => { if (b.p.cauda) b.p.cauda.rotation.y = Math.sin(t * 9) * .35 * k; });
  });
  def('lobo', 'lobo', 'Canis lupus', b => {
    quad(b, { cor: '#6E717C', ventre: '#C9C6BE', L: .44, R: .2, y: 0, chao: -.64, pr: .062, cab: [.7, .24], cr: .17, foc: [.17, .075], focAng: -.15, orelha: ['ponta', 1], nariz: '#1A1414', pesc: .15,
      cauda: [[0, 0, 0], [-.16, -.1, 0], [-.26, -.32, 0]], caudaR: f => .07 * Math.sin(Math.PI * (.25 + f * .7)) + .02 });
    return animaQuad(b);
  });
  // equinos: corpo maior, pescoço forte, cabeça longa
  const equino = (cor, crina, foc, orelha, cauda) => b => {
    quad(b, { cor, ventre: null, L: .5, R: .24, y: .02, chao: -.78, pr: .055, casco: 1, pata: '#2A2220', cab: [.7, .5], cr: .14, cabAlong: 1.15, cabRot: -.9, foc: [.2, .085], focAng: -1.05, corFoc: foc, nariz: '#2A1A14', orelha: ['equino', orelha], pesc: .15, olhoX: .2, olhoY: .5, olho: .2, crina, pelo: .45,
      cauda: cauda === 'tufo' ? [[0, 0, 0], [-.08, -.14, 0], [-.1, -.4, 0]] : [[0, 0, 0], [-.12, -.08, 0], [-.16, -.3, 0], [-.14, -.52, 0]], corCauda: crina,
      caudaR: cauda === 'tufo' ? (f => .022) : (f => .06 * (1 - f * .2) * cauda), tufo: cauda === 'tufo' ? crina : null });
    return animaQuad(b);
  };
  def('cavalo', 'cavalo', 'Equus caballus', equino('#A8683A', '#3E2618', '#7A4A2A', 1, 1));
  def('egua', 'égua', 'Equus caballus', equino('#B9784A', '#4A2E1C', '#80502E', 1, 1));
  def('jumento', 'jumento', 'Equus asinus', equino('#8F8D95', '#4C4A52', '#E2DDD3', 2.1, 'tufo'));
  def('mula', 'mula', 'híbrido de égua e jumento', equino('#8E6A4E', '#3A2A20', '#C9B49E', 1.6, .7));

  // ser humano e chimpanzé
  def('humano', 'ser humano', 'Homo sapiens', b => {
    const pele = mat('#C68C66', { sh: .25 }), cam_ = mat('#3FA8A0', { sh: .5, r: .7 }), cal = mat('#34407A', { sh: .4, r: .75 }), cab = mat('#2A1C14', { r: .7, sh: .4 });
    const tronco = b.grupo([0, 0, 0]);
    b.torno(cam_, [[0, -.02], [.17, 0], [.19, .14], [.21, .3], [.17, .38], [.08, .42], [0, .42]], [0, -.05, 0], null, tronco);
    b.par(s => { const pv = b.grupo([0, .32, s * .2], tronco, [s * .12, 0, 0]); b.tubo(cam_, [[0, 0, 0], [0, -.16, 0]], .055, pv); b.tubo(pele, [[0, -.18, 0], [.02, -.42, s * .02]], f => .045 - .008 * f, pv); b.p['braco' + s] = pv; });
    b.par(s => { b.tubo(cal, [[0, 0, s * .08], [0, -.32, s * .085], [.0, -.6, s * .085]], .068, null); b.sph(mat('#2A2230', { r: .5 }), [.05, -.64, s * .085], [.1, .045, .06]); });
    b.cil(pele, [0, .45, 0], .05, .08);
    const cg = b.grupo([0, .6, 0]); b.p.cab = cg;
    b.sph(pele, [0, 0, 0], [.14, .16, .14], null, cg); b.sph(cab, [-.02, .05, 0], [.145, .135, .145], null, cg);
    b.par(s => b.olho([.12, .01, s * .05], .022, cg)); b.sph(pele, [.14, -.03, 0], .03, null, cg);
    return (t, A, o) => { const k = REDUZ ? 0 : 1; cg.rotation.y = Math.sin(t * .5 + A.fase) * .25 * k; b.p['braco1'].rotation.z = Math.sin(t * 1.1) * .06 * k; b.p['braco-1'].rotation.z = -Math.sin(t * 1.1) * .06 * k; tronco.scale.y = 1 + Math.sin(t * 2) * .01 * k; };
  });
  def('chimpanze', 'chimpanzé', 'Pan troglodytes', b => {
    const pe = mat('#3A2E28', { sh: .8, r: .7 }), ro = mat('#C9A78A', { sh: .3 });
    b.sph(pe, [0, 0, 0], [.32, .3, .24], [0, 0, .5]);
    b.par(s => { b.tubo(pe, [[.22, .12, s * .15], [.4, -.2, s * .2], [.45, -.6, s * .2]], .06); b.tubo(pe, [[-.18, -.15, s * .12], [-.1, -.4, s * .15], [-.2, -.6, s * .15]], .07); });
    const cg = b.grupo([.42, .34, 0]); b.p.cab = cg; b.sph(pe, [0, 0, 0], .17, null, cg); b.sph(ro, [.1, -.04, 0], [.1, .09, .12], null, cg);
    b.par(s => { b.olho([.1, .05, s * .05], .022, cg); b.sph(ro, [-.02, .02, s * .16], [.05, .06, .03], null, cg); });
    return (t, A) => { cg.rotation.y = REDUZ ? 0 : Math.sin(t * .5 + A.fase) * .3; };
  });

  // morcego: corpo pequeno e asas de pele entre os dedos
  def('morcego', 'morcego', 'ordem Chiroptera', b => {
    const pe = mat('#5A4636', { sh: .8, r: .7 }), mem = mat('#3E2C24', { lados: 1, r: .6, sh: .3 });
    b.sph(pe, [0, 0, 0], [.13, .24, .12]); const cg = b.grupo([0, .28, 0]); b.sph(pe, [0, 0, 0], .11, null, cg);
    b.par(s => { b.cone(pe, [s * .06, .12, 0], .045, .16, [0, 0, -s * .3], cg); b.olho([.05, .02, s * .05], .02, cg); });
    b.par(s => {
      const ag = b.grupo([s * .1, .12, 0]); b.p['asa' + s] = ag;
      b.forma(mem, [[0, 0], [s * .45, .25], [s * .9, .32], [s * .78, .02], [s * .95, -.12], [s * .6, -.14], [s * .45, -.3], [s * .2, -.18], [0, -.3]], .012, [0, 0, 0], null, ag, .006);
      [[.45, .25], [.9, .32], [.95, -.12], [.45, -.3]].forEach(q => b.tubo(pe, [[0, 0, .01], [s * q[0] * .5, q[1] * .6 + .05, .01], [s * q[0], q[1], .01]], .012, ag, { seg: 8, rad: 6 }));
    });
    return (t, A) => { const k = REDUZ ? 0 : 1, a = Math.sin(t * 5 + A.fase) * .35 * k; b.p.asa1.rotation.y = a; b.p['asa-1'].rotation.y = -a; };
  });

  // corpos alongados de água: perfil de revolução no eixo x
  function corpoX(b, M, perfil, n) { return b.torno(M, perfil.map(([x, r]) => [r, x]), [0, 0, 0], [0, 0, -Math.PI / 2], null, n || 30); }
  def('baleia', 'baleia-jubarte', 'Megaptera novaeangliae', b => {
    const M = mat('#4B5E7A', { ventre: '#D9DEE6', vy: -.08, veixo: '-x', r: .4, cc: .55 });
    const g = b.grupo([0, 0, 0]); b.p.c = g;
    const corpo = b.torno(M, [[0, .95], [.13, .88], [.24, .62], [.3, .3], [.3, 0], [.25, -.35], [.15, -.65], [.06, -.85], [.03, -.92]], [0, 0, 0], [0, 0, -Math.PI / 2], g, 30);
    corpo.scale.set(1, 1, .9);
    const Mf = mat('#43546E', { ventre: '#E6E9EE', vy: -.02, veixo: 'y', r: .4, cc: .5 });
    b.par(s => b.forma(Mf, [[0, 0], [.08, -.06], [.05, -.5], [-.04, -.62], [-.06, -.3]], .025, [.42, -.17, s * .22], [s * .5, s * .3, -.5], g));
    const cg = b.grupo([-.9, 0, 0], g); b.p.cauda = cg;
    b.forma(Mf, [[0, 0], [-.12, .1], [-.28, .24], [-.22, .02], [-.28, -.22], [-.12, -.1]], .03, [0, 0, 0], [Math.PI / 2, 0, 0], cg);
    b.sph(M, [-.25, .27, 0], [.06, .04, .02], [0, 0, -.6], g);
    b.par(s => b.olho([.62, -.02, s * .22], .025, g));
    for (let i = 0; i < 4; i++) b.sph(mat('#3B4A60', { r: .5 }), [.7 - i * .04, -.18 + i * .02, .05 - i * .02], [.015, .015, .015], null, g);
    return (t, A) => { const k = REDUZ ? 0 : 1; cg.rotation.z = Math.sin(t * 1.4 + A.fase) * .22 * k; g.rotation.z = Math.sin(t * 1.4 + A.fase - 1) * .04 * k; g.position.y = Math.sin(t * .9) * .03 * k; };
  }, { sombra: false });
  def('golfinho', 'golfinho', 'Tursiops truncatus', b => {
    const M = mat('#7C8DA6', { ventre: '#E4E8EE', vy: -.04, veixo: '-x', r: .35, cc: .7 });
    const g = b.grupo([0, 0, 0]);
    corpoX(b, M, [[1, .015], [.95, .045], [.82, .06], [.72, .14], [.5, .2], [.15, .21], [-.3, .15], [-.65, .07], [-.85, .035]], 30);
    const Mf = mat('#6F7F98', { r: .35, cc: .6 });
    b.forma(Mf, [[0, 0], [-.08, .2], [-.22, .26], [-.2, .06]], .03, [.02, .18, 0], null, g);
    b.par(s => b.forma(Mf, [[0, 0], [-.05, -.22], [-.12, -.25], [-.08, -.02]], .025, [.4, -.1, s * .16], [s * .4, 0, .3], g));
    const cg = b.grupo([-.85, 0, 0]); b.p.cauda = cg;
    b.forma(Mf, [[0, 0], [-.1, .08], [-.2, .2], [-.16, 0], [-.2, -.2], [-.1, -.08]], .025, [0, 0, 0], [Math.PI / 2, 0, 0], cg);
    b.par(s => b.olho([.66, .04, s * .12], .022));
    return (t, A) => { cg.rotation.z = REDUZ ? 0 : Math.sin(t * 2 + A.fase) * .3; };
  }, { sombra: false });
  def('peixe', 'peixe', 'classe Actinopterygii', b => {
    const M = mat('#3FA7C9', { ventre: '#F2E7B0', vy: -.06, veixo: '-x', r: .3, cc: .8, listras: { cor: '#2A6F8F', n: 22, eixo: 'y', k: .25, onda: .2 } });
    const g = b.grupo([0, 0, 0]); b.p.c = g;
    const c = b.torno(M, [[0, .72], [.12, .66], [.22, .48], [.28, .2], [.27, -.1], [.18, -.38], [.08, -.55], [.05, -.6]], [-.1, 0, 0], [0, 0, -Math.PI / 2], g, 28); c.scale.set(1.15, 1, .55);
    const Mf = mat('#F0A23C', { r: .35, cc: .6, op: .92, lados: 1 });
    const cg = b.grupo([-.68, 0, 0], g); b.p.cauda = cg;
    b.forma(Mf, [[0, 0], [-.28, .3], [-.22, 0], [-.28, -.3]], .015, [0, 0, 0], null, cg);
    b.forma(Mf, [[0, 0], [.12, .02], [-.12, .2], [-.3, .02]], .012, [.05, .28, 0], null, g);
    b.forma(Mf, [[0, 0], [-.2, -.14], [-.16, .0]], .012, [.18, -.06, .14], [0, -.4, 0], g);
    b.par(s => b.olho([.45, .07, s * .09], .05, g));
    b.tubo(mat('#1E5A74', { r: .5 }), [[.28, .18, .14], [.24, 0, .16], [.28, -.16, .14]], .008, g, { seg: 8, rad: 6 });
    return (t, A) => { const k = REDUZ ? 0 : 1; cg.rotation.y = Math.sin(t * 4 + A.fase) * .4 * k; g.rotation.y = Math.sin(t * 4 + A.fase + 1) * .06 * k; };
  }, { sombra: false });
  def('tubarao', 'tubarão', 'classe Chondrichthyes', b => {
    const M = mat('#6F829B', { ventre: '#EEF1F4', vy: -.04, veixo: '-x', r: .38, cc: .55 });
    const g = b.grupo([0, 0, 0]);
    const c = b.torno(M, [[0, 1], [.1, .9], [.17, .65], [.2, .3], [.19, -.1], [.13, -.45], [.06, -.7], [.04, -.78]], [0, 0, 0], [0, 0, -Math.PI / 2], g, 28); c.scale.set(1, .95, .85);
    const Mf = mat('#62758E', { r: .38, cc: .5 });
    b.forma(Mf, [[0, 0], [-.1, .36], [-.2, .34], [-.22, 0]], .03, [.12, .14, 0], null, g);
    b.par(s => b.forma(Mf, [[0, 0], [-.12, -.3], [-.2, -.3], [-.16, -.02]], .025, [.3, -.12, s * .1], [s * .5, 0, .2], g));
    const cg = b.grupo([-.76, 0, 0], g); b.p.cauda = cg;
    b.forma(Mf, [[0, 0], [-.2, .42], [-.24, .38], [-.14, .02], [-.18, -.2], [-.08, -.04]], .03, [0, 0, 0], null, cg);
    b.par(s => { b.olho([.78, .06, s * .09], .022, g); for (let i = 0; i < 4; i++) b.cil(mat('#3E4A5C', { r: .6 }), [.55 - i * .05, -.02, s * .155], .006, .12, [0, 0, .1], g); });
    return (t, A) => { const k = REDUZ ? 0 : 1; cg.rotation.y = Math.sin(t * 3 + A.fase) * .35 * k; g.rotation.y = Math.sin(t * 3 + A.fase + 1.2) * .05 * k; };
  }, { sombra: false });
  def('lampreia', 'lampreia', 'classe Petromyzontida', b => {
    const M = mat('#7A6450', { ventre: '#C8B89A', vy: -.02, r: .4, cc: .5 }), g = b.grupo([0, 0, 0]);
    b.p.g = g; b.p.M = M; b.p.mesh = null;
    b.p.forma = ph => { const P = []; for (let i = 0; i <= 10; i++) { const f = i / 10, x = .85 - f * 1.75; P.push([x, Math.sin(f * 5.5 - ph) * .14 * (.3 + f), 0]); } return P; };
    b.p.mesh = b.tubo(M, b.p.forma(0), f => .085 * (1 - f * .55), g, { seg: 30, rad: 14 });
    b.cil(mat('#3A2A20', { r: .4 }), [.86, b.p.forma(0)[0][1], 0], .07, .03, [0, 0, Math.PI / 2], g);
    b.par(s => { b.olho([.72, .05, s * .06], .022, g); for (let i = 0; i < 7; i++) b.bol(mat('#2A1E16', {}), [.6 - i * .05, b.p.forma(0)[1][1] * .6 + .01, s * .075], .012, g); });
    return (t, A) => { const k = REDUZ ? 0 : 1; g.rotation.y = Math.sin(t * 2.4 + A.fase) * .08 * k; g.position.y = Math.sin(t * 1.2) * .02 * k; };
  }, { sombra: false });
  // anfíbio e répteis
  def('sapo', 'sapo-cururu', 'Rhinella sp.', b => {
    const M = mat('#8A7A4A', { ventre: '#E2D3A6', vy: -.3, r: .62, sh: .2 }), Mv = mat('#6F6238', { r: .6 });
    const g = b.grupo([0, -.15, 0]); b.p.c = g;
    b.sph(M, [0, 0, 0], [.48, .3, .36], [0, 0, .12], g);
    for (let i = 0; i < 22; i++) { const a = hs(i, 3) * TAU, e = hs(i, 4) * .9 + .1; b.bol(Mv, [Math.cos(a) * .4 * e, .12 + hs(i, 5) * .14, Math.sin(a) * .3 * e], .03 + hs(i, 6) * .02, g); }
    b.par(s => {
      b.sph(M, [.28, .22, s * .18], [.1, .1, .1], null, g); b.olho([.32, .26, s * .2], .065, g);
      b.sph(M, [-.12, .02, s * .13], [.12, .08, .06], null, g);
      b.tubo(M, [[-.3, -.1, s * .25], [-.42, -.3, s * .42], [-.15, -.35, s * .45]], .07, g);
      b.tubo(M, [[.3, -.12, s * .22], [.42, -.33, s * .3]], .05, g); b.sph(Mv, [.46, -.37, s * .32], [.08, .02, .06], null, g);
    });
    b.tubo(mat('#3A2E1E', { r: .6 }), [[.42, .02, .22], [.5, -.02, 0], [.42, .02, -.22]], .01, g, { seg: 10, rad: 6 });
    return (t, A) => { const k = REDUZ ? 0 : 1; g.scale.y = 1 + Math.sin(t * 3.4 + A.fase) * .03 * k; };
  });
  def('lagarto', 'lagarto', 'ordem Squamata', b => {
    const M = mat('#6BAA4F', { ventre: '#D7E5A0', vy: -.04, r: .5, sh: .2 }), g = b.grupo([0, -.1, 0]);
    b.tubo(M, [[.75, .05, 0], [.55, .04, 0], [.2, .04, 0], [-.15, .03, 0], [-.45, 0, .05], [-.75, -.04, -.04], [-.95, -.06, 0]], f => (f < .12 ? mix(.06, .1, f / .12) : .11 * (1 - (f - .12) * .95) + .012), g, { seg: 34 });
    b.sph(M, [.7, .05, 0], [.14, .08, .09], null, g);
    b.par(s => {
      b.olho([.73, .1, s * .065], .022, g);
      [[.32, 1], [-.22, -1]].forEach(([x, d]) => b.tubo(M, [[x, 0, s * .06], [x + .06 * d, -.02, s * .22], [x + .14 * d, -.16, s * .26]], .028, g, { seg: 8 }));
    });
    return (t, A) => { const k = REDUZ ? 0 : 1; g.rotation.y = Math.sin(t * .8 + A.fase) * .12 * k; };
  });
  def('cobra', 'cobra', 'subordem Serpentes', b => {
    const M = mat('#8BAA3C', { ventre: '#E8E2A0', vy: -.04, r: .45, cc: .5, listras: { cor: '#3E5A1E', n: 30, k: .5, lim: .55, onda: .8 } }), g = b.grupo([0, 0, 0]);
    b.tubo(M, [[-.9, -.45, 0], [-.55, -.6, .1], [-.2, -.35, -.05], [-.05, 0, .05], [.25, .1, -.05], [.4, -.15, 0], [.62, -.28, .02]].map(p => [p[0], p[1] + .1, p[2]]), f => .07 * Math.min(1, (1 - f) * 6 + .1) * (f < .9 ? 1 : 1.25), g, { seg: 44 });
    const cg = b.grupo([.66, -.16, 0], g); b.sph(M, [.06, 0, 0], [.12, .07, .085], null, cg);
    b.par(s => b.olho([.12, .035, s * .05], .02, cg));
    const lin = b.grupo([.17, -.02, 0], cg); b.tubo(mat('#C9343E', { r: .4 }), [[0, 0, 0], [.08, 0, 0], [.12, .02, .015]], .007, lin, { seg: 6, rad: 5 });
    return (t, A) => { const k = REDUZ ? 0 : 1; lin.scale.x = .3 + .7 * Math.max(0, Math.sin(t * 4 + A.fase)) * k; cg.rotation.z = Math.sin(t * .8) * .1 * k; };
  });
  const croco = (cor, papo) => b => {
    const M = mat(cor, { ventre: papo, vy: -.03, r: .65, sh: .2 }), Mc = mat('#3E4A24', { r: .7 }), g = b.grupo([0, -.15, 0]);
    b.tubo(M, [[.98, .02, 0], [.6, .03, 0], [.3, .06, 0], [-.1, .07, 0], [-.5, .04, 0], [-.95, 0, 0]], f => (f < .3 ? mix(.045, .1, f / .3) : .11 * (1 - (f - .3) * 1.2) + .02), g, { seg: 30 });
    const s0 = b.sph(M, [.75, .03, 0], [.24, .045, .06], null, g);
    for (let i = 0; i < 12; i++) b.cone(Mc, [.25 - i * .1, .14 - i * .005, (i % 2 ? .03 : -.03)], .025, .06, null, g);
    b.par(s => { b.sph(M, [.42, .1, s * .055], .04, null, g); b.olho([.43, .12, s * .065], .022, g);
      [[.2, 1], [-.35, -1]].forEach(([x, d]) => b.tubo(M, [[x, 0, s * .08], [x + .04 * d, -.05, s * .2], [x + .08 * d, -.12, s * .22]], .035, g, { seg: 8 })); });
    void s0;
    return (t, A) => { const k = REDUZ ? 0 : 1; g.rotation.y = Math.sin(t * .5 + A.fase) * .08 * k; };
  };
  def('crocodilo', 'crocodilo', 'ordem Crocodylia', croco('#5E6E3A', '#B9B47A'));
  def('jacare', 'jacaré-de-papo-amarelo', 'Caiman latirostris', croco('#4E5A34', '#E3C34A'));
  def('tartaruga', 'tartaruga', 'ordem Testudines', b => {
    const Mc = mat('#6B7F3A', { r: .45, cc: .6, listras: { cor: '#3E4A1E', n: 18, eixo: 'x', k: .45, lim: .75, onda: 2 } }), Mp = mat('#8FA05A', { r: .6, sh: .2 }), g = b.grupo([0, -.2, 0]);
    b.torno(Mc, [[0, .42], [.2, .38], [.38, .26], [.5, .1], [.55, 0], [.5, -.02], [0, -.02]], [0, 0, 0], null, g).scale.set(1.15, 1, .95);
    b.torno(mat('#C9B880', { r: .6 }), [[0, -.06], [.5, -.06], [.55, 0], [0, 0]], [0, 0, 0], null, g).scale.set(1.15, 1, .95);
    const cg = b.grupo([.64, .08, 0], g); b.p.cab = cg; b.tubo(Mp, [[-.1, -.04, 0], [0, 0, 0]], .07, cg); b.sph(Mp, [.06, .02, 0], [.11, .08, .08], null, cg); b.par(s => b.olho([.12, .05, s * .05], .018, cg));
    b.par(s => [[.38, 1], [-.38, -1]].forEach(([x]) => b.sph(Mp, [x, -.08, s * .4], [.1, .06, .08], null, g)));
    b.cone(Mp, [-.68, -.02, 0], .04, .14, [0, 0, Math.PI / 2], g);
    return (t, A) => { cg.position.x = .64 + (REDUZ ? 0 : Math.sin(t * .7 + A.fase) * .04); };
  });
  // aves
  const passaro = (cor, peito, bico, extra) => b => {
    const M = mat(cor, { ventre: peito, vy: -.05, sh: .7, r: .65 }), g = b.grupo([0, 0, 0]);
    b.sph(M, [0, 0, 0], [.4, .27, .25], [0, 0, .15], g);
    const cg = b.grupo([.36, .26, 0], g); b.p.cab = cg; b.sph(M, [0, 0, 0], .19, null, cg);
    b.cone(mat(bico, { r: .35, cc: .7 }), [.22, -.02, 0], .055, .17, [0, 0, -Math.PI / 2], cg);
    b.par(s => b.olho([.1, .05, s * .13], .035, cg));
    b.par(s => { const ag = b.grupo([-.02, .08, s * .2], g); b.p['asa' + s] = ag; b.sph(mat(cor, { sh: .7, r: .7 }), [-.12, 0, 0], [.32, .16, .05], [0, 0, .25], ag); });
    b.forma(mat(cor, { sh: .5 }), [[0, 0], [-.35, .08], [-.38, -.08], [0, -.06]], .02, [-.32, .02, 0], [0, 0, .2], g);
    b.par(s => b.tubo(mat('#C98A3A', { r: .5 }), [[0, -.2, s * .07], [.02, -.42, s * .07], [.08, -.5, s * .07]], .018, g, { seg: 8 }));
    if (extra) extra(b, g, cg, M);
    return (t, A) => { const k = REDUZ ? 0 : 1; cg.rotation.z = Math.sin(t * 1.3 + A.fase) * .1 * k; cg.rotation.y = Math.sin(t * .9 + A.fase) * .2 * k; const a = Math.max(0, Math.sin(t * 2.2 + A.fase)) * .25 * k; b.p.asa1.rotation.x = -a; b.p['asa-1'].rotation.x = a; };
  };
  def('ave', 'sabiá-laranjeira', 'Turdus rufiventris', passaro('#8C7356', '#E08A3A', '#E3B04A'));
  def('galinha', 'galinha', 'Gallus gallus', passaro('#E9E2D6', '#F2EDE4', '#E3B04A', (b, g, cg) => { b.sph(mat('#D93A3A', { r: .4 }), [0, .2, 0], [.08, .07, .02], null, cg); b.sph(mat('#D93A3A', { r: .4 }), [.12, -.14, 0], [.03, .05, .015], null, cg); g.scale.set(1, 1.15, 1); }));
  def('tucano', 'tucano-toco', 'Ramphastos toco', passaro('#16161C', '#F4F1EA', '#F08A24', (b, g, cg) => {
    cg.children.filter(m => m.geometry && m.geometry.type === 'ConeGeometry').forEach(m => { m.visible = false; });
    const bico = b.sph(mat('#F08A24', { r: .3, cc: .8 }), [.32, -.03, 0], [.3, .09, .07], [0, 0, -.12], cg); void bico;
    b.sph(mat('#141418', { r: .3 }), [.6, -.07, 0], [.04, .04, .04], null, cg);
    b.par(s => b.torno(mat('#3D8BFF', { r: .4 }), [[.04, -.01], [.05, 0], [.04, .01]], [.1, .05, s * .13], [Math.PI / 2, 0, 0], cg));
  }));
  // invertebrados
  def('polvo', 'polvo', 'classe Cephalopoda', b => {
    const M = mat('#C8607A', { ventre: '#F2B8C2', vy: -.5, r: .4, cc: .6 }), g = b.grupo([0, 0, 0]);
    b.sph(M, [0, .22, 0], [.3, .36, .3], [0, 0, -.25], g);
    b.par(s => b.olho([.17, .05, s * .2], .05, g));
    b.p.bracos = []; b.p.g = g;
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, br = b.grupo([Math.cos(a) * .14, -.06, Math.sin(a) * .14], g, [0, -a, 0]); b.p.bracos.push(br); }
    b.p.M = M;
    const forma = (i, ph) => { const P = []; for (let j = 0; j <= 7; j++) { const f = j / 7; P.push([f * .62, -f * .5 + Math.sin(f * 4 + ph + i) * .08 * f, Math.sin(f * 3 + ph * .7 + i * 1.3) * .06 * f]); } return P; };
    b.p.bracos.forEach((br, i) => b.tubo(M, forma(i, 0), f => .06 * (1 - f * .85), br, { seg: 18, rad: 9 }));
    b.p.forma = forma;
    return (t, A) => { const k = REDUZ ? 0 : 1; b.p.bracos.forEach((br, i) => { br.rotation.z = Math.sin(t * 1.6 + i) * .18 * k; }); g.position.y = Math.sin(t * 1.2 + A.fase) * .03 * k; };
  });
  def('caramujo', 'caramujo', 'classe Gastropoda', b => {
    const Mc = mat('#C99A5B', { r: .35, cc: .8, listras: { cor: '#7A4A22', n: 40, eixo: 'y', k: .5, lim: .6, onda: 3 } }), Mp = mat('#B8A58A', { r: .5, cc: .5 }), g = b.grupo([0, -.1, 0]);
    const P = []; for (let i = 0; i <= 40; i++) { const f = i / 40, a = f * TAU * 2.6, r = .38 * Math.pow(1 - f, 1.25) + .02; P.push([-.08 + Math.cos(a) * r, .12 + Math.sin(a) * r, .04 * f]); }
    b.tubo(Mc, P, f => .17 * Math.pow(1 - f, 1.1) + .015, g, { seg: 70, rad: 14 });
    b.tubo(Mp, [[-.62, -.3, 0], [-.2, -.33, 0], [.3, -.32, 0], [.62, -.25, 0]], f => .08 * Math.sin(Math.PI * (.12 + f * .76)) + .02, g, { seg: 20 });
    const cg = b.grupo([.55, -.2, 0], g); b.p.cab = cg;
    b.par(s => { b.tubo(Mp, [[0, 0, s * .03], [.06, .14, s * .06], [.1, .24, s * .07]], .014, cg, { seg: 8 }); b.olho([.1, .25, s * .07], .022, cg); });
    return (t, A) => { const k = REDUZ ? 0 : 1; cg.rotation.z = Math.sin(t * 1.1 + A.fase) * .12 * k; };
  });
  def('abelha', 'abelha', 'Apis mellifera', b => {
    const M = mat('#F2B624', { r: .45, cc: .6, sh: .6, listras: { cor: '#1E1612', n: 15, k: .95, lim: .1, onda: .05 } }), Mp = mat('#2A1E16', { sh: .6, r: .6 }), Ma = mat('#DDEBFF', { op: .45, lados: 1, r: .1, cc: 1, env: 1 }), g = b.grupo([0, -.05, 0]);
    b.sph(M, [-.22, -.02, 0], [.36, .25, .24], [0, 0, .12], g);
    b.sph(mat('#7A5A2A', { sh: .9, r: .8 }), [.18, .04, 0], [.17, .16, .15], null, g);
    const cg = b.grupo([.4, .02, 0], g); b.sph(Mp, [0, 0, 0], [.12, .13, .12], null, cg); b.par(s => { b.olho([.05, .03, s * .09], .05, cg); b.tubo(Mp, [[.06, .1, s * .04], [.12, .26, s * .08], [.22, .3, s * .1]], .012, cg, { seg: 8, rad: 6 }); });
    b.par(s => { const ag = b.grupo([.15, .17, s * .04], g); b.p['asa' + s] = ag; b.sph(Ma, [-.18, .14, s * .08], [.3, .015, .12], [0, s * -.35, .35], ag); b.sph(Ma, [-.12, .08, s * .1], [.18, .012, .08], [0, s * -.15, .2], ag); });
    b.par(s => [.08, .18, .28].forEach((x, i) => b.tubo(Mp, [[x, -.08, s * .08], [x - .02 + i * .03, -.22, s * .16], [x - .06 + i * .06, -.4, s * .2]], .014, g, { seg: 8, rad: 6 })));
    b.cone(Mp, [-.6, -.06, 0], .025, .08, [0, 0, Math.PI / 2], g);
    return (t, A) => { const k = REDUZ ? 0 : 1, a = Math.sin(t * 38) * .5 * k; b.p.asa1.rotation.x = -.2 - a; b.p['asa-1'].rotation.x = .2 + a; g.position.y = -.05 + Math.sin(t * 2.4 + A.fase) * .03 * k; };
  });
  def('borboleta', 'borboleta', 'ordem Lepidoptera', b => {
    const g = b.grupo([0, 0, 0]), Mc = mat('#1E1A20', { sh: .7 }), Ma = mat('#3D7BFF', { lados: 1, r: .3, cc: .9, env: .9, ventre: '#14264F', vy: -.05, veixo: 'x' }), Mb = mat('#1A2A55', { lados: 1, r: .5 });
    b.sph(Mc, [0, 0, 0], [.06, .42, .06], null, g); b.sph(Mc, [0, .45, 0], .07, null, g);
    b.par(s => b.tubo(Mc, [[0, .5, 0], [s * .08, .7, 0], [s * .16, .82, 0]], .008, g, { seg: 8, rad: 5 }));
    b.par(s => {
      const ag = b.grupo([s * .04, .1, 0], g); b.p['asa' + s] = ag;
      b.forma(Ma, [[0, 0], [s * .35, .5], [s * .82, .58], [s * .9, .22], [s * .55, -.02]], .01, [0, 0, 0], null, ag, .004);
      b.forma(Ma, [[0, -.05], [s * .6, -.08], [s * .66, -.42], [s * .35, -.62], [s * .1, -.4]], .01, [0, 0, 0], null, ag, .004);
      b.forma(Mb, [[s * .6, .35], [s * .78, .5], [s * .86, .3], [s * .7, .22]], .012, [0, 0, .006], null, ag, .003);
    });
    return (t, A) => { const k = REDUZ ? .15 : 1, a = (.35 + Math.sin(t * 6 + A.fase) * .55) * k; b.p.asa1.rotation.y = -a; b.p['asa-1'].rotation.y = a; g.position.y = REDUZ ? 0 : Math.sin(t * 3) * .03; };
  }, { sombra: false });
  def('caranguejo', 'caranguejo', 'subfilo Crustacea', b => {
    const M = mat('#E0603A', { ventre: '#F2C29A', vy: -.4, r: .4, cc: .7 }), g = b.grupo([0, -.05, 0]);
    b.sph(M, [0, 0, 0], [.42, .2, .32], null, g);
    b.par(s => {
      for (let i = 0; i < 4; i++) { const x = .18 - i * .14; b.tubo(M, [[x, -.05, s * .28], [x - .06, .05, s * .52], [x - .12, -.35, s * .62]], .03, g, { seg: 10, rad: 8 }); }
      const pg = b.grupo([.3, .02, s * .26], g); b.p['pinca' + s] = pg;
      b.tubo(M, [[0, 0, 0], [.18, .12, s * .1], [.32, .18, s * .1]], .045, pg, { seg: 10 }); b.sph(M, [.42, .2, s * .1], [.14, .09, .08], [0, 0, .3], pg); b.sph(M, [.5, .12, s * .1], [.09, .035, .04], [0, 0, -.2], pg);
      b.tubo(M, [[.25, .15, s * .08], [.28, .28, s * .1]], .015, g, { seg: 6 }); b.olho([.28, .3, s * .1], .035, g);
    });
    return (t, A) => { const k = REDUZ ? 0 : 1; b.p.pinca1.rotation.z = Math.sin(t * 1.8 + A.fase) * .15 * k; b.p['pinca-1'].rotation.z = Math.sin(t * 1.8 + A.fase + 1) * .15 * k; };
  });
  def('aranha', 'aranha-caranguejeira', 'família Theraphosidae', b => {
    const M = mat('#4A3426', { sh: 1, shc: '#C9A07A', r: .8, cc: .1 }), g = b.grupo([0, -.1, 0]);
    b.sph(M, [-.3, .08, 0], [.32, .26, .28], null, g); b.sph(M, [.12, .04, 0], [.2, .13, .18], null, g);
    b.par(s => { b.olho([.3, .12, s * .04], .025, g); b.sph(M, [.34, -.02, s * .05], [.06, .05, .04], null, g); });
    b.par(s => [.24, .14, .04, -.06].forEach((x, i) => b.tubo(M, [[x, 0, s * .12], [x + (i < 2 ? .15 : -.12), .25, s * .42], [x + (i < 2 ? .3 : -.28), -.4, s * .6]], f => .035 * (1 - f * .4), g, { seg: 12, rad: 8 })));
    return (t, A) => { g.position.y = -.1 + (REDUZ ? 0 : Math.sin(t * 1.5 + A.fase) * .015); };
  });
  def('minhoca', 'minhoca', 'filo Annelida', b => {
    const M = mat('#D98A8A', { r: .3, cc: .8, ventre: '#E8AFAF', vy: -.05 }), g = b.grupo([0, 0, 0]);
    const P = []; for (let i = 0; i <= 12; i++) { const f = i / 12; P.push([-.9 + f * 1.8, Math.sin(f * 6.3) * .18, Math.cos(f * 4) * .08]); }
    b.tubo(M, P, f => (.075 + .012 * Math.sin(f * 140)) * Math.min(1, f * 8, (1 - f) * 8 + .2) * (f > .25 && f < .35 ? 1.25 : 1), g, { seg: 120, rad: 12 });
    return (t, A) => { const k = REDUZ ? 0 : 1; g.scale.x = 1 + Math.sin(t * 2 + A.fase) * .05 * k; g.rotation.y = Math.sin(t * .7) * .1 * k; };
  });
  def('estrela', 'estrela-do-mar', 'classe Asteroidea', b => {
    const M = mat('#E8753A', { r: .55, cc: .4, ventre: '#F2B080', vy: -.02 }), Mb = mat('#F4C08A', { r: .5 }), g = b.grupo([0, 0, 0], null, [.0, 0, 0]);
    b.sph(M, [0, 0, 0], [.26, .26, .1], null, g);
    for (let i = 0; i < 5; i++) { const a = Math.PI / 2 + i * TAU / 5, d = [Math.cos(a), Math.sin(a)]; b.tubo(M, [[d[0] * .1, d[1] * .1, 0], [d[0] * .5, d[1] * .5, .02], [d[0] * .88, d[1] * .88, -.02]], f => .17 * (1 - f * .8), g, { seg: 14, rad: 12 }).scale.z = .55; for (let j = 1; j < 5; j++) b.bol(Mb, [d[0] * j * .18, d[1] * j * .18, .07 - j * .008], .022, g); }
    return (t, A) => { g.rotation.z = REDUZ ? 0 : Math.sin(t * .4 + A.fase) * .08; };
  }, { sombra: false });
  def('mosquito', 'mosquito-da-dengue', 'Aedes aegypti', b => {
    const M = mat('#2A2A30', { r: .4, cc: .6, listras: { cor: '#F2F4F8', n: 26, k: .7, lim: .75, onda: .05 } }), Ma = mat('#DDE6F5', { op: .4, lados: 1, r: .1, cc: 1 }), g = b.grupo([0, .05, 0]);
    b.sph(M, [-.35, -.02, 0], [.35, .07, .07], [0, 0, -.1], g); b.sph(mat('#2A2A30', { r: .4 }), [.06, .02, 0], [.12, .1, .1], null, g); b.sph(mat('#2A2A30', {}), [.22, 0, 0], .07, null, g);
    b.tubo(mat('#2A2A30', {}), [[.27, -.01, 0], [.45, -.08, 0], [.6, -.16, 0]], .01, g, { seg: 6, rad: 5 }); b.par(s => b.olho([.25, .03, s * .045], .03, g));
    b.par(s => { const ag = b.grupo([.02, .1, s * .03], g); b.p['asa' + s] = ag; b.sph(Ma, [-.25, .02, s * .06], [.3, .01, .07], [0, s * -.3, .15], ag); });
    b.par(s => [-.04, .05, .14].forEach((x, i) => b.tubo(M, [[x, -.05, s * .05], [x - .1 + i * .1, .1, s * .3], [x - .25 + i * .25, -.5, s * .4]], .009, g, { seg: 10, rad: 5 })));
    return (t, A) => { const k = REDUZ ? 0 : 1, a = Math.sin(t * 40) * .4 * k; b.p.asa1.rotation.x = -a; b.p['asa-1'].rotation.x = a; };
  });
  // plantas
  def('milho', 'milho', 'Zea mays', b => {
    const Mv = mat('#6FAE5A', { lados: 1, r: .5, cc: .3 }), Mh = mat('#7DBE66', { r: .5 }), g = b.grupo([0, 0, 0]);
    b.tubo(Mh, [[0, -.85, 0], [.02, 0, 0], [0, .82, 0]], f => .05 * (1 - f * .5), g);
    [[-.55, .9, 0], [-.2, 2.3, .4], [.15, -.6, -.3], [.4, 1.7, .5], [.0, -2.2, .2]].forEach(([y, a, z], i) => b.folha(Mv, .62 - i * .04, .07, .9, .25, [0, y, 0], [z, a, .35], g));
    const eg = b.grupo([.08, .02, .04], g, [0, 0, -.25]);
    b.sph(mat('#F2CF5B', { r: .4, cc: .5 }), [0, .02, 0], [.11, .28, .11], null, eg);
    for (let i = 0; i < 40; i++) { const a = (i % 8) / 8 * TAU, y = -.2 + Math.floor(i / 8) * .1; b.bol(mat('#F6D96B', { r: .35, cc: .7 }), [Math.cos(a) * .1 * Math.sqrt(1 - (y / .3) ** 2), y + .02, Math.sin(a) * .1 * Math.sqrt(1 - (y / .3) ** 2)], .03, eg); }
    b.folha(mat('#9BCB6E', { lados: 1, r: .5 }), .36, .09, .2, .4, [0, -.26, .05], [0, 0, 1.45], eg);
    b.tubo(mat('#C9A26A', { r: .7 }), [[0, .28, 0], [-.04, .42, 0], [-.1, .5, 0]], .012, eg, { seg: 6 });
    return (t, A) => { g.rotation.z = REDUZ ? 0 : Math.sin(t * .8 + A.fase) * .03; };
  });
  def('tomate', 'tomate', 'Solanum lycopersicum', b => {
    const M = mat('#E0402E', { r: .25, cc: .9, env: .8 }), g = b.grupo([0, -.1, 0]);
    b.torno(M, [[0, -.5], [.3, -.47], [.52, -.3], [.6, -.02], [.55, .26], [.36, .44], [.12, .48], [0, .44]], [0, 0, 0], null, g, 36);
    const Mv = mat('#4E9A3A', { lados: 1, r: .5 });
    for (let i = 0; i < 5; i++) b.folha(Mv, .32, .07, -.6, .1, [0, .46, 0], [0, i * TAU / 5, .15], g, { forma: 'fita' });
    b.tubo(Mv, [[0, .44, 0], [.02, .62, 0], [.08, .72, 0]], .03, g);
    return (t, A) => { g.rotation.y = REDUZ ? 0 : Math.sin(t * .4 + A.fase) * .25; };
  });
  def('samambaia', 'samambaia', 'classe Polypodiopsida', b => {
    const Mv = mat('#4FA05A', { lados: 1, r: .5, cc: .2 }), Mh = mat('#5E8A3A', { r: .6 }), g = b.grupo([0, -.85, 0]); b.p.f = [];
    for (let k = 0; k < 4; k++) {
      const fg = b.grupo([0, 0, 0], g, [k * .4 - .5, k * 1.6, (k - 1.5) * .35]); b.p.f.push(fg);
      const P = []; for (let i = 0; i <= 8; i++) { const f = i / 8; P.push([Math.sin(f * 1.4) * .4 * f, f * 1.45, 0]); }
      b.tubo(Mh, P, .016, fg, { seg: 16, rad: 6 });
      for (let i = 1; i < 9; i++) { const f = i / 9, q = [Math.sin(f * 1.4) * .4 * f, f * 1.45, 0], L = .38 * (1 - f * .75); b.par(s => b.folha(Mv, L, .045, .4, .15, q, [0, s > 0 ? 0 : Math.PI, s * .25 + .3], fg)); }
    }
    const P2 = []; for (let i = 0; i <= 12; i++) { const a = i / 12 * TAU * 1.1, r = .12 * (1 - i / 14); P2.push([.18 + Math.cos(a) * r, .55 + Math.sin(a) * r, .1]); }
    b.tubo(Mh, [[.05, 0, .1], [.14, .3, .1], ...P2], f => .022 * (1 - f * .6), g, { seg: 26 });
    return (t, A) => { const k = REDUZ ? 0 : 1; b.p.f.forEach((fg, i) => { fg.rotation.x = Math.sin(t * .9 + i) * .04 * k; }); };
  });
  def('arvore', 'árvore', 'reino Plantae', b => {
    const Mt = mat('#7A5234', { r: .8 }), Mv = mat('#4FA05A', { r: .6, sh: .4, ventre: '#2E6A3A', vy: -.1 }), g = b.grupo([0, 0, 0]);
    b.tubo(Mt, [[0, -.9, 0], [.02, -.3, 0], [-.02, .1, 0]], f => .11 * (1 - f * .5), g);
    [[0, .3, 0, .5], [-.3, .15, .1, .33], [.32, .18, -.05, .33], [.05, .6, .05, .32], [-.15, .45, -.2, .28], [.2, .45, .2, .28]].forEach(c => b.sph(Mv, [c[0], c[1], c[2]], c[3], null, g));
    return (t, A) => { g.rotation.z = REDUZ ? 0 : Math.sin(t * .7 + A.fase) * .02; };
  });
  def('cogumelo', 'cogumelo', 'reino Fungi', b => {
    const Mc = mat('#B5754A', { r: .5, cc: .5, ventre: '#E8C9A0', vy: .1 }), Ms = mat('#F0E2C8', { r: .6, sh: .4 }), g = b.grupo([0, -.05, 0]);
    b.torno(Ms, [[0, -.85], [.18, -.84], [.15, -.4], [.13, 0], [.12, .12], [0, .14]], [0, 0, 0], null, g);
    b.torno(Mc, [[0, .78], [.25, .75], [.52, .58], [.7, .32], [.74, .14], [.6, .12], [.3, .1], [0, .1]], [0, -.02, 0], null, g, 40);
    b.torno(mat('#D9BF98', { r: .8 }), [[.06, .1], [.66, .13], [.06, .12]], [0, -.02, 0], null, g, 40);
    for (let i = 0; i < 7; i++) { const a = hs(i, 8) * TAU, r = .2 + hs(i, 9) * .4; b.sph(mat('#F4E8D2', { r: .5 }), [Math.cos(a) * r, .74 - r * r * .95, Math.sin(a) * r], [.05, .02, .05], [Math.sin(a) * r * 1.2, 0, -Math.cos(a) * r * 1.2], g); }
    return (t, A) => { g.rotation.y = REDUZ ? 0 : Math.sin(t * .3 + A.fase) * .3; };
  });
  // seres de uma célula: um pouco translúcidos, com organelas aparecendo
  def('levedura', 'levedura', 'Saccharomyces cerevisiae', b => {
    const M = mat('#E8D9A8', { r: .25, cc: .9, op: .82, sh: .3 }), Mn = mat('#B98A5A', { r: .4 }), g = b.grupo([0, 0, 0]);
    b.sph(M, [-.12, -.08, 0], [.52, .46, .45], null, g); b.sph(M, [.42, .38, .05], [.26, .24, .24], null, g);
    b.sph(Mn, [-.15, -.05, 0], .15, null, g); b.sph(mat('#CFE0FF', { op: .55, r: .2 }), [.05, -.22, .1], .12, null, g);
    return (t, A) => { g.rotation.y = REDUZ ? 0 : Math.sin(t * .5 + A.fase) * .4; };
  }, { sombra: false });
  def('bacteria', 'bactéria', 'domínio Bacteria', b => {
    const M = mat('#5FB8A0', { r: .3, cc: .9, op: .9 }), g = b.grupo([0, 0, 0]);
    const c = b.tubo(M, [[-.48, 0, 0], [.48, 0, 0]], .22, g, { seg: 6, rad: 20 }); void c;
    b.tubo(mat('#2E7A68', { r: .5 }), [[-.3, .02, .05], [-.1, -.06, .08], [.1, .06, .08], [.3, -.02, .05]], .03, g, { seg: 16 });
    b.p.fl = b.grupo([.68, 0, 0], g);
    const P = []; for (let i = 0; i <= 14; i++) { const f = i / 14; P.push([f * .35, Math.sin(f * 9) * .06, Math.cos(f * 9) * .03]); }
    b.tubo(mat('#8FD4C0', { r: .5 }), P, .012, b.p.fl, { seg: 30, rad: 6 });
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU, x = -.4 + (i % 5) * .2; b.tubo(mat('#8FD4C0', { r: .5 }), [[x, Math.cos(a) * .2, Math.sin(a) * .2], [x, Math.cos(a) * .3, Math.sin(a) * .3]], .006, g, { seg: 2, rad: 5 }); }
    return (t, A) => { const k = REDUZ ? 0 : 1; b.p.fl.rotation.x = t * 6 * k; g.rotation.z = Math.sin(t * .8 + A.fase) * .08 * k; };
  }, { sombra: false });
  def('arquea', 'arquea', 'domínio Archaea', b => {
    const M = mat('#E89A4A', { r: .3, cc: .9, op: .92 }), g = b.grupo([0, 0, 0]);
    [[-.2, -.15, 0, .34], [.28, .1, .05, .3], [-.1, .38, -.05, .26]].forEach(q => b.sph(M, [q[0], q[1], q[2]], q[3], null, g));
    b.p.fl = b.grupo([.55, .1, 0], g); const P = []; for (let i = 0; i <= 12; i++) { const f = i / 12; P.push([f * .35, Math.sin(f * 8) * .05, 0]); } b.tubo(mat('#F4C08A', { r: .5 }), P, .012, b.p.fl, { seg: 24, rad: 6 });
    return (t, A) => { const k = REDUZ ? 0 : 1; b.p.fl.rotation.x = t * 5 * k; g.rotation.y = Math.sin(t * .5 + A.fase) * .3 * k; };
  }, { sombra: false });
  def('ameba', 'ameba', 'Amoeba proteus', b => {
    const M = mat('#9FC8E8', { r: .2, cc: .9, op: .78, env: .9 }), g = b.grupo([0, 0, 0]);
    const geo = new T.IcosahedronGeometry(1, 5), p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); let r = 1; [[1, .2, 0, .7], [-.6, .8, .1, .5], [-.4, -.85, 0, .6], [.3, -.3, .9, .35]].forEach(q => { const d = x * q[0] + y * q[1] + z * q[2]; if (d > 0) r += q[3] * Math.pow(d, 6); }); p.setXYZ(i, x * r * .55, y * r * .45, z * r * .3); }
    geo.computeVertexNormals(); const blob = new T.Mesh(geo, M); g.add(blob); b.p.blob = blob;
    b.sph(mat('#5A6FB0', { r: .4 }), [.05, 0, 0], .13, null, g); b.sph(mat('#CFE0FF', { op: .6 }), [-.25, .12, .05], .07, null, g); b.sph(mat('#E8D9A8', { r: .5 }), [.25, -.18, 0], .05, null, g);
    return (t, A) => { const k = REDUZ ? 0 : 1; blob.scale.set(1 + Math.sin(t * 1.3 + A.fase) * .05 * k, 1 + Math.cos(t * 1.1) * .05 * k, 1); };
  }, { sombra: false });
  const alga = b => {
    const M = mat('#7CC86A', { r: .2, cc: .9, op: .82 }), g = b.grupo([0, -.1, 0]);
    b.sph(M, [0, 0, 0], [.32, .45, .32], null, g);
    b.torno(mat('#3E9A3A', { r: .4, lados: 1 }), [[0, -.38], [.24, -.3], [.3, -.05], [.27, .18], [.2, .2], [.2, -.05], [.12, -.24], [0, -.28]], [0, 0, 0], null, g);
    b.sph(mat('#D93A3A', { r: .3 }), [.2, .22, .18], .045, null, g); b.sph(mat('#5A6FB0', { r: .4 }), [0, .1, 0], .09, null, g);
    b.p.fl = [];
    b.par(s => { const fg = b.grupo([0, .44, 0], g); b.p.fl.push(fg); const P = []; for (let i = 0; i <= 10; i++) { const f = i / 10; P.push([s * (Math.sin(f * 2.4) * .3), .1 + f * .45, Math.sin(f * 5) * .04]); } b.tubo(mat('#B8E6A8', { r: .5 }), P, .012, fg, { seg: 20, rad: 6 }); });
    return (t, A) => { const k = REDUZ ? 0 : 1; b.p.fl[0].rotation.z = -Math.sin(t * 5) * .3 * k; b.p.fl[1].rotation.z = Math.sin(t * 5) * .3 * k; g.position.y = -.1 + Math.sin(t * 2.5) * .02 * k; };
  };
  def('alga', 'alga verde', 'Chlamydomonas', alga, { sombra: false });
  def('algaUni', 'alga verde unicelular', 'Chlamydomonas', alga, { sombra: false });
  def('esponja', 'esponja', 'filo Porifera', b => {
    const M = mat('#E3B04B', { r: .75, sh: .4, ventre: '#C98A2E', vy: -.4 }), g = b.grupo([0, -.05, 0]);
    b.torno(M, [[.32, -.78], [.38, -.6], [.44, -.2], [.42, .3], [.34, .62], [.22, .66], [.24, .3], [.26, -.3], [.12, -.55], [0, -.6]], [0, 0, 0], null, g, 34);
    for (let i = 0; i < 26; i++) { const a = hs(i, 11) * TAU, y = -.6 + hs(i, 12) * 1.15, r = .42 - Math.abs(y - .05) * .1; if (Math.cos(a) < -.2) continue; b.sph(mat('#7A4A1A', { r: .9 }), [Math.cos(a) * r, y, Math.sin(a) * r], [.035, .035, .015], [0, -a + Math.PI / 2, 0], g); }
    return (t, A) => { g.rotation.y = REDUZ ? 0 : Math.sin(t * .3 + A.fase) * .4; };
  });
  // mandioca: arbusto de caule lenhoso, folhas palmadas em pecíolos vermelhos e raízes tuberosas
  def('mandioca', 'mandioca', 'Manihot esculenta', b => {
    const Mt = mat('#9C7A5A', { r: .8 }), Mp = mat('#B5444A', { r: .5 }), Mv = mat('#4FA65A', { lados: 1, r: .5, cc: .35 }), Mr = mat('#8A5A36', { r: .85, ventre: '#6E4428', vy: -.1 }), g = b.grupo([0, 0, 0]);
    b.tubo(Mt, [[0, -.45, 0], [.02, 0, 0], [-.02, .35, 0], [.0, .55, 0]], f => .045 * (1 - f * .45), g, { seg: 18 });
    for (let i = 0; i < 6; i++) b.torno(Mt, [[.0, -.015], [.06 - i * .003, 0], [0, .015]], [0, -.35 + i * .14, 0], null, g, 16);
    b.p.f = [];
    [[.55, .4, 0], [.4, 2.2, .3], [.3, 4.3, -.2], [.18, 1.2, .5], [.05, 3.4, .4]].forEach(([y, a, inc], k) => {
      const fg = b.grupo([0, y, 0], g, [0, a, 0]); b.p.f.push(fg);
      b.tubo(Mp, [[0, 0, 0], [.22, .1 + inc * .1, 0], [.38, .02 + inc * .1, 0]], .01, fg, { seg: 8, rad: 6 });
      const lg = b.grupo([.38, .02 + inc * .1, 0], fg, [0, 0, -.3]);
      for (let j = 0; j < 7; j++) b.folha(Mv, .46 - Math.abs(j - 3) * .065, .075, .5, .2, [0, 0, 0], [Math.PI / 2, 0, (j - 3) * .38 - .1], lg, { forma: 'lanceolada' });
    });
    [[.0, -.5, .1, -1.9], [.2, -.48, -.1, -1.3], [-.2, -.5, -.05, -2.4]].forEach(r => { const rg = b.grupo([r[0] * .2, r[1], r[2]], g, [0, 0, r[3]]); b.sph(Mr, [.24, 0, 0], [.28, .07, .07], null, rg); });
    return (t, A) => { const k = REDUZ ? 0 : 1; b.p.f.forEach((fg, i) => { fg.rotation.z = Math.sin(t * .9 + i * 1.3 + A.fase) * .05 * k; }); };
  }, { chao: -.5 });

  // vistas: quem foi modelado de frente (no plano xy) ou fica melhor quase de frente
  [['humano', -1.05], ['chimpanze', -.8], ['morcego', 0], ['borboleta', 0], ['estrela', 0], ['polvo', -.3], ['aranha', -.7], ['caranguejo', -1.2], ['abelha', -.4], ['tomate', 0], ['cogumelo', 0], ['arvore', 0], ['esponja', 0], ['levedura', -.2], ['ameba', 0], ['alga', 0], ['algaUni', 0], ['samambaia', -.3], ['milho', -.3], ['mandioca', -.3]].forEach(([k, y]) => { if (ELENCO[k]) ELENCO[k].yaw = y; });
  ['morcego', 'borboleta', 'estrela'].forEach(k => { ELENCO[k].pitch = -.12; });

  // ---------- sombra de contato (um disco macio sob o ser) ----------
  let TEXS = null;
  function texSombra() {
    if (TEXS) return TEXS; const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(.6, 'rgba(0,0,0,.18)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    TEXS = new T.CanvasTexture(c); return TEXS;
  }
  function construir(id) {
    const E = ELENCO[id], raiz = new T.Group(), corpo = new T.Group(); raiz.add(corpo);
    const b = oficina(corpo); let anima = null;
    try { anima = E.fn(b); } catch (e) { console.error('[taxo3d] ' + id, e); }
    if (E.sombra) { const m = new T.Mesh(new T.PlaneGeometry(1.7, 1.1), new T.MeshBasicMaterial({ map: texSombra(), transparent: true, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.y = E.chao; raiz.add(m); }
    return { id, raiz, anima, marg: E.marg, yaw: E.yaw, pitch: E.pitch, fase: hs(id.length * 31 + id.charCodeAt(0), 3) * TAU, ult: -9, tIn: 0, yawU: 0, tMexeu: -1e9 };
  }

  // ---------- render de um quadro do ser no WebGL fora da tela e cópia para o 2D ----------
  function garantir(w, h) {
    if (w <= cw && h <= ch) return; cw = Math.max(cw, Math.min(2048, Math.ceil(w / 128) * 128)); ch = Math.max(ch, Math.min(2048, Math.ceil(h / 128) * 128)); ren.setSize(cw, ch, false);
  }
  function fator() { const d = window.devicePixelRatio || 1; return (d < 1.5 ? 2 : 1) * Q.esc; }
  // desenha o grupo g no retângulo (x, y, w, h) do 2D; a câmera enquadra a meia-altura mh (unidades do modelo)
  function render(g, x, y, w, h, mh, o) {
    const m = X.getTransform(), sx = Math.hypot(m.a, m.b), sy = Math.hypot(m.c, m.d), f = fator();
    let pw = Math.round(w * sx * f), ph = Math.round(h * sy * f); if (pw < 4 || ph < 4) return false;
    const mx = Math.max(pw, ph); if (mx > 2048) { pw = Math.round(pw * 2048 / mx); ph = Math.round(ph * 2048 / mx); }
    garantir(pw, ph);
    cam.aspect = w / h; cam.fov = 18; cam.position.set(0, 0, mh / Math.tan(9 * Math.PI / 180)); cam.near = cam.position.z - 6; cam.far = cam.position.z + 6; cam.updateProjectionMatrix();
    cena.add(g);
    U.uRimK.value = o && o.rim ? o.rimK || .9 : .18; U.uRim.value.set(o && o.rim ? o.rim : '#9FB4E0'); U.uVar.value = o && o.var ? o.var : 0;
    ren.setScissorTest(true); ren.setScissor(0, Math.max(0, ch - ph - 4), Math.min(cw, pw + 4), ph + 4); ren.clear(); ren.setViewport(0, ch - ph, pw, ph); ren.setScissor(0, ch - ph, pw, ph); ren.render(cena, cam); ren.setScissorTest(false);
    cena.remove(g);
    const q0 = X.imageSmoothingQuality; X.imageSmoothingEnabled = true; X.imageSmoothingQuality = 'high';
    X.drawImage(glc, 0, 0, pw, ph, x, y, w, h); X.imageSmoothingQuality = q0;
    return true;
  }
  // cor do traço que a cena pede: a cor padrão (texto) não acende borda; uma cor de destaque acende
  const corTxt = () => (typeof C !== 'undefined' && C.txt) || '#E8EDF7';
  function rimDe(o) { const c = o && o.c; if (!c || c === corTxt() || /^rgba?\(/.test(c)) return null; return c; }

  K3.ator = function (id, x, y, s, o) {
    if (!K3.ok || !ELENCO[id] || !(s > 6)) return false;
    o = o || {};
    try {
      const k = (uso[id] = (uso[id] || 0) + 1) - 1, pool = POOL[id] || (POOL[id] = []);
      const A = pool[k] || (pool[k] = construir(id)), t = agora();
      if (A.ult < quadro - 2) A.tIn = t; A.ult = quadro;
      const e = REDUZ || o.semEntrada ? 1 : eOut((t - A.tIn) / .55);
      const viva = REDUZ ? 0 : 1, livre = t - A.tMexeu > 12;
      if (livre) A.yawU *= Math.exp(-(1 / 60) * 2.2);
      A.raiz.rotation.set(.2 + VIVA.pitch * viva + A.pitch + (o.pitch || 0), (o.yaw == null ? A.yaw : o.yaw) + VIVA.yaw * viva + A.yawU + (1 - e) * 1.1, 0);
      const ks = mix(.6, 1, e); A.raiz.scale.set(o.flip ? -ks : ks, ks, ks);
      if (A.anima) A.anima(REDUZ ? 0 : t, A, o);
      const S = s * A.marg, rim = rimDe(o);
      const a0 = X.globalAlpha; X.globalAlpha = a0 * (o.a == null ? 1 : o.a) * (REDUZ ? 1 : cl(e * 1.6, 0, 1));
      const ok = render(A.raiz, x - S / 2, y - S / 2, S, S, A.marg, { rim, var: (hs(k, 5) - .5) * .08 });
      X.globalAlpha = a0;
      if (ok) { const m = X.getTransform(), d = window.devicePixelRatio || 1; desenhados.push({ A, id, x: (m.a * x + m.c * y + m.e) / d, y: (m.b * x + m.d * y + m.f) / d, r: s * Math.hypot(m.a, m.b) / d * .5 }); }
      return ok;
    } catch (err) { console.error(err); return false; }
  };
  // peças de cena registradas por cenas3d.js: PROP[tipo] = { montar(T, b, o) -> { g, mh, anima, chave } }
  const PROPS = {};
  K3.prop = function (tipo, x, y, w, h, o) {
    const P = K3.PROP[tipo]; if (!K3.ok || !P || !(w > 6 && h > 6)) return false;
    o = o || {};
    try {
      const ch_ = tipo + ':' + (P.chave ? P.chave(o) : ''), A = PROPS[ch_] || (PROPS[ch_] = (() => { const raiz = new T.Group(), corpo = new T.Group(); raiz.add(corpo); const b = oficina(corpo); const r = P.montar(b, o, T, mat) || {}; return { raiz, corpo, b, anima: r.anima, yawU: 0, tMexeu: -1e9, ult: -9, tIn: 0 }; })());
      const t = agora(); if (A.ult < quadro - 2) A.tIn = t; A.ult = quadro;
      const viva = REDUZ ? 0 : 1, livre = t - A.tMexeu > 12; if (livre) A.yawU *= Math.exp(-(1 / 60) * 2.2);
      const pose = P.pose ? P.pose(t, o) : { yaw: 0, pitch: 0 };
      A.raiz.rotation.set((pose.pitch || 0) + VIVA.pitch * viva * (P.viva == null ? 1 : P.viva), (pose.yaw || 0) + (VIVA.yaw * viva + A.yawU) * (P.viva == null ? 1 : P.viva), 0);
      if (A.anima) A.anima(REDUZ ? 0 : t, A, o);
      const mg = o.marg || P.marg || 1, W2 = w * mg, H2 = h * mg;
      const ok = render(A.raiz, x + w / 2 - W2 / 2, y + h / 2 - H2 / 2, W2, H2, mg, { rim: o.rim });
      if (ok && P.toque !== false) { const m = X.getTransform(), d = window.devicePixelRatio || 1; desenhados.push({ A, id: o.nome ? null : tipo, prop: o.nome || P.nome, x: (m.a * (x + w / 2) + m.c * (y + h / 2) + m.e) / d, y: (m.b * (x + w / 2) + m.d * (y + h / 2) + m.f) / d, r: Math.min(w, h) * Math.hypot(m.a, m.b) / d * .5 }); }
      return ok;
    } catch (err) { console.error(err); return false; }
  };
  K3.mat = (c, o) => mat(c, o); K3.oficina = r => oficina(r); K3.geoTubo = geoTubo; K3.geoFolha = geoFolha; K3.geoForma = geoForma; K3.geoCurva = geoCurva; K3.ELENCO = ELENCO; K3.reduz = REDUZ;
  K3.construirAtor = id => (ELENCO[id] ? construir(id) : null);
  K3._dbg = () => ({ ren, glc, cena, cam, cw, ch });

  // ---------- quadro: zera os contadores antes do desenho da cena, mede o tempo para a qualidade adaptativa ----------
  function inicioQuadro() {
    quadro++; for (const k in uso) uso[k] = 0; desenhados.length = 0;
    const now = performance.now(), dt = tUlt ? Math.min(.1, (now - tUlt) / 1000) : .016; tUlt = now;
    Q.ema = mix(Q.ema, dt * 1000, .05); Q.idade += dt;
    if (Q.idade < 3) { Q.lento = 0; Q.rapido = 0; }
    else if (Q.ema > 30) { Q.lento += dt; Q.rapido = 0; if (Q.lento > 2) { Q.esc = Math.max(.75, Q.esc * .9); Q.lento = 0; } }
    else if (Q.ema < 20) { Q.rapido += dt; Q.lento = 0; if (Q.rapido > 1.5 && Q.esc < 1) { Q.esc = Math.min(1, Q.esc * 1.12); Q.rapido = 0; } }
    const t = agora(); VIVA.yaw = Math.sin(t * .23) * .16 + Math.sin(t * .071) * .06; VIVA.pitch = Math.sin(t * .17 + 1) * .05;
  }
  function embrulhar() { Object.keys(SC).forEach(k => { const o = SC[k]; if (!o || o._t3 || typeof o.draw !== 'function') return; const d = o.draw; o._t3 = 1; o.draw = function (t, S) { inicioQuadro(); return d.call(this, t, S); }; }); }
  K3.qualidade = () => ({ esc: Q.esc, ema: Q.ema }); K3.inicioQuadro = inicioQuadro;

  // ---------- toque: arrastar um ser gira só ele; um toque curto mostra o nome; a câmera volta sozinha após 12 s ----------
  function ficha() {
    let el = document.getElementById('t3-ficha'); if (el) return el;
    const tela = document.getElementById('cv').parentElement; el = document.createElement('div'); el.id = 't3-ficha'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite');
    tela.appendChild(el); return el;
  }
  function mostrarFicha(d) {
    const el = ficha(), nm = d.prop ? [d.prop, ''] : K3.NOMES[d.id]; if (!nm) return;
    el.innerHTML = `<b>${nm[0]}</b>${nm[1] ? `<span>${/^(classe|ordem|filo|família|subfilo|subordem|reino|domínio|híbrido)/.test(nm[1]) ? nm[1].replace(/^(\S+) (.+)$/, '$1 <i>$2</i>') : `<i>${nm[1]}</i>`}</span>` : ''}`;
    const cv = document.getElementById('cv'), w = 220; el.style.left = cl(d.x - w / 2, 8, cv.clientWidth - w - 8) + 'px'; el.style.top = cl(d.y - d.r - 56, 8, cv.clientHeight - 60) + 'px';
    el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 3200);
  }
  function achar(x, y) { for (let i = desenhados.length - 1; i >= 0; i--) { const d = desenhados[i]; if (Math.hypot(x - d.x, y - d.y) <= Math.max(14, d.r)) return d; } return null; }
  function ligarToque() {
    const cv = document.getElementById('cv'); let ini = null;
    const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const livre = (x, y) => { try { return typeof hitAt !== 'function' || hitAt(x, y) == null; } catch (e) { return true; } };
    cv.addEventListener('pointerdown', e => { const [x, y] = pos(e); if (!livre(x, y)) return; const d = achar(x, y); if (d) ini = { d, x, y, x0: x, mov: 0, t: performance.now() }; });
    cv.addEventListener('pointermove', e => { if (!ini) return; const [x] = pos(e), dx = x - ini.x; ini.x = x; ini.mov += Math.abs(dx); ini.d.A.yawU = cl(ini.d.A.yawU + dx * .02, -2.4, 2.4); ini.d.A.tMexeu = agora(); });
    const fimT = () => { if (ini && ini.mov < 8 && performance.now() - ini.t < 600) mostrarFicha(ini.d); ini = null; };
    addEventListener('pointerup', fimT); addEventListener('pointercancel', () => { ini = null; });
    const st = document.createElement('style');
    st.textContent = `#t3-ficha{position:absolute;z-index:4;width:220px;padding:8px 12px;border-radius:10px;background:var(--float,rgba(19,26,43,.94));border:1px solid var(--float-line,rgba(255,255,255,.16));color:var(--txt,#E8EDF7);font:500 13px/1.35 var(--f-txt,system-ui);pointer-events:none;opacity:0;transform:translateY(4px);transition:opacity 180ms ease,transform 180ms ease;text-align:center}
#t3-ficha.on{opacity:1;transform:none}#t3-ficha b{display:block;font-weight:700}#t3-ficha span{display:block;color:var(--dim,#9DA9C4)}
@media (prefers-reduced-motion: reduce){#t3-ficha{transition:none}}`;
    document.head.appendChild(st);
  }

  // ---------- partida ----------
  function partir() {
    embrulhar();
    if (!temWebGL()) { K3.falhou = true; return; }
    carregar().then(TH => { try { iniciar(TH); ligarToque(); } catch (e) { K3.falhou = true; K3.ok = false; console.warn('[taxo3d] sem 3D, fica o desenho 2D:', e.message); } })
      .catch(e => { K3.falhou = true; console.warn('[taxo3d] sem 3D, fica o desenho 2D:', e.message); });
  }
  // os ícones do motor (bicho) passam a chamar o elenco 3D; sem 3D, o desenho antigo continua
  if (typeof bicho === 'function') { const b0 = bicho; window.bicho = function (id, x, y, s, o) { if (K3.ator(id, x, y, s, o)) return; return b0(id, x, y, s, o); }; }
  K3.partir = partir;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', partir); else partir();
})();
