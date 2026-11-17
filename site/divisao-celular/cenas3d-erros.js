/* LAB Citogenética: cenas 3D das alterações cromossômicas (Martin). Aneuploidias: gametas e fecundação em volume e um
   cariótipo humano desenhado em código (cromossomos metafásicos com bandas, tamanhos e centrômeros aproximados dos reais),
   com o cromossomo a mais ou a menos tocável. Euploidias: células com 2, 3, 4 e 6 conjuntos que crescem, e o painel ao lado. */
'use strict';
(function () {
  if (!window.CITO3D) return;
  const C3 = CITO3D, { cl, mix, add, sub, mul, nrm, len, lerp3, hash, rng, vnoise, TAU } = C3.V;
  const RED = () => window.MOL3D && MOL3D.reduz;
  const sst = x => { x = cl(x, 0, 1); return x * x * (3 - 2 * x); };
  const pc = (nome, cor, frase) => ({ nome, cor, frase });

  // ---------- cromátide metafásica com bandas (geometria com cores por vértice; braço p para cima) ----------
  const GC = {};
  function cromatide(g, L, p, w, sem) {
    const key = [L.toFixed(2), p, w, sem, g.q.cel].join(':'); if (GC[key] && GC[key].g === g) return GC[key].geo;
    const T = g.T, top = p * L, bot = -(1 - p) * L, Ns = g.q.cel ? 26 : 40, Na = g.q.cel ? 10 : 14;
    const R = rng(sem), bandas = []; let y = top; while (y > bot) { const h = w * (.45 + R() * .9); bandas.push([y, y - h, R() < .45 ? 1 : 0]); y -= h; }
    const banda = yy => { for (const b of bandas) if (yy <= b[0] && yy >= b[1]) return b[2]; return 0; };
    const pos = [], col = [], idx = [];
    for (let i = 0; i <= Ns; i++) {
      const yy = mix(top, bot, i / Ns), e = Math.min(top - yy, yy - bot), ee = cl(e / w, 0, 1); let r = w * Math.sqrt(ee * (2 - ee));
      if (p > .03) r *= 1 - .38 * Math.exp(-((yy / (w * .5)) ** 2));
      const x0 = w * .95 * (1 - .3 * Math.exp(-((yy / w) ** 2)));
      for (let j = 0; j <= Na; j++) {
        const a = j / Na * TAU, rr = r * (1 + .08 * (vnoise(Math.cos(a) + sem, yy * 1.5, Math.sin(a)) - .5) * 2);
        pos.push(x0 + Math.cos(a) * rr, yy, Math.sin(a) * rr * .9);
        const k = banda(yy) ? .42 : 1, tl = cl(1 - e / (w * .6), 0, 1); col.push(mix(k, 1, tl * .5), mix(k, 1, tl * .5), mix(k, 1, tl * .5));
      }
    }
    for (let i = 0; i < Ns; i++) for (let j = 0; j < Na; j++) { const a = i * (Na + 1) + j, b = a + Na + 1; idx.push(a, a + 1, b, b, a + 1, b + 1); }
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.setAttribute('color', new T.Float32BufferAttribute(col, 3)); geo.setIndex(idx); geo.computeVertexNormals(); g.geos.push(geo);
    GC[key] = { g, geo }; return geo;
  }
  // cromossomo duplicado (duas cromátides espelhadas) num grupo
  function cromossomo(g, L, p, w, sem, mat, peca, pai) {
    const T = g.T, gr = new T.Group(), geo = cromatide(g, L, p, w, sem);
    for (const sd of [1, -1]) { const m = new T.Mesh(geo, mat); m.scale.x = sd; m.userData.peca = peca; gr.add(m); g.pick.push(m); }
    (pai || g.raiz).add(gr); return gr;
  }
  const matC = (g, cor) => C3.fis(g, cor, { vc: 1, p: { roughness: .5, clearcoat: .45, clearcoatRoughness: .35, sheen: .5, sheenColor: new g.T.Color('#E6DCFF') }, rim: '#D2C2FF', rimK: .3 });

  // ---------- aneuploidias ----------
  // comprimentos aproximados (Mb) e fração do braço p, do 1 ao 22, X e Y
  const MB = [249, 242, 198, 190, 181, 171, 159, 145, 138, 134, 135, 133, 114, 107, 102, 90, 83, 80, 59, 64, 47, 51, 156, 57];
  const PB = [.49, .39, .46, .27, .27, .35, .36, .31, .33, .3, .38, .27, .14, .15, .16, .41, .3, .22, .45, .45, .25, .27, .39, .3];
  C3.cena('erros/aneuploidias', K => {
    const MAT = K.C.mat, PAT = K.C.pat, VERM = K.C.red;
    return {
      fit: 60, vista: { th: 0, fi: .08 },
      pecas: {
        ovulo: pc('Óvulo com 24 cromossomos', '#F06AAE', 'Por uma não disjunção na meiose, este óvulo recebeu duas cópias do cromossomo 21 (n + 1).'),
        esp: pc('Espermatozoide normal', '#5CC8F0', 'Gameta n: 23 cromossomos, com uma cópia do 21.'),
        tri: pc('Três cópias do 21', '#FF6B7D', 'Zigoto com 47 cromossomos. Todas as células do corpo terão o 21 extra.'),
        x21: pc('Cromossomo 21 extra', '#FF6B7D', 'Trissomia do 21 (47,XX,+21 ou 47,XY,+21): síndrome de Down. Causa mais comum: não disjunção na formação do óvulo.'),
        semX: pc('Falta um cromossomo X', '#FF6B7D', 'Monossomia do X (45,X): síndrome de Turner. Sexo feminino, baixa estatura e ovários pouco desenvolvidos.'),
        xx: pc('X a mais', '#FF6B7D', 'Cariótipo 47,XXY: síndrome de Klinefelter. Sexo masculino, testículos pequenos e infertilidade.'),
        cario: pc('Cariótipo', '#CFE0FF', 'Cromossomos em metáfase organizados em pares, do maior para o menor: 22 pares de autossomos e o par sexual.')
      },
      rotulos: [{ pc: 'ovulo', t: 'Gameta feminino (n + 1)', passo: P => P.i === 0 }, { pc: 'esp', t: 'Espermatozoide: 23', passo: P => P.i === 0 }, { pc: 'tri', t: 'Três cópias do 21' },
        { pc: 'x21', t: 'Cópia extra do 21' }, { pc: 'semX', t: 'Falta um X' }, { pc: 'xx', t: 'X a mais' }],
      montar(g) {
        const T = g.T, q = g.q;
        // gametas
        g.gam = new T.Group(); g.raiz.add(g.gam);
        g.ov = new T.Mesh(C3.esfera(g, 56), C3.filme(g, '#F06AAE', { cor2: '#FFD6EC', dentro: '#2A1E44', base: .04, fr: .5, esc: .35 })); g.ov.renderOrder = 3; g.ov.userData.peca = g.pecas.ovulo; g.gam.add(g.ov); g.pick.push(g.ov);
        g.zona = new T.Mesh(C3.esfera(g, 56), C3.filme(g, '#E8E2FF', { cor2: '#FFFFFF', dentro: '#1A1A30', base: .02, fr: .35, esc: 1.5 })); g.zona.renderOrder = 4; g.gam.add(g.zona);
        g.ovN = new T.Mesh(C3.esfera(g, 40), C3.filme(g, '#9A6BFF', { cor2: '#D9C9FF', dentro: '#2A1E4D', base: .1, fr: .5, esc: .9 })); g.ovN.renderOrder = 2; g.gam.add(g.ovN);
        g.cr = C3.inst(g, C3.capsula(g, 1, 1, 10), C3.fis(g, '#ffffff', { p: { roughness: .45, clearcoat: .6, sheen: .5 }, rim: '#D2C2FF', rimK: .3 }), 40, g.gam, g.pecas.ovulo); g.pick.push(g.cr.m);
        g.cab = new T.Mesh(C3.esfera(g, 24), C3.fis(g, '#C9D6F0', { p: { roughness: .35, clearcoat: .8 }, rim: '#E0ECFF', rimK: .4 })); g.cab.userData.peca = g.pecas.esp; g.gam.add(g.cab); g.pick.push(g.cab);
        g.cauda = C3.tubo(g, 40, 8, C3.fis(g, '#CFE0FF', { p: { roughness: .4 } }), g.gam, g.pecas.esp);
        // cariótipo
        g.car = new T.Group(); g.raiz.add(g.car);
        g.mM = matC(g, MAT); g.mP = matC(g, PAT); g.mR = matC(g, '#FF7E8E');
        const W = .23, Ls = MB.map(m => .7 + 3.1 * m / 249);
        g.grp = []; for (let k = 0; k < 23; k++) {
          const gr = new T.Group(); g.car.add(gr); const sex = k === 22;
          const a = cromossomo(g, Ls[sex ? 22 : k], PB[sex ? 22 : k], W, 11 + k * 3, g.mM, g.pecas.cario, gr);
          const b = cromossomo(g, Ls[sex ? 22 : k], PB[sex ? 22 : k], W, 12 + k * 3, sex ? g.mM : g.mP, g.pecas.cario, gr);
          g.grp.push({ gr, a, b, L: Ls[sex ? 22 : k] });
        }
        g.extra21 = cromossomo(g, Ls[20], PB[20], W, 99, g.mR, g.pecas.x21, g.grp[20].gr);
        g.Y = cromossomo(g, Ls[23], PB[23], W, 77, g.mP, g.pecas.cario, g.grp[22].gr);
        g.extraX = cromossomo(g, Ls[22], PB[22], W, 78, g.mR, g.pecas.xx, g.grp[22].gr);
        g.fant = new T.Mesh(C3.capsula(g, 1, 1, 14), C3.filme(g, '#FF6B7D', { cor2: '#FFC0C8', dentro: '#3A0E18', base: .06, fr: .8, esc: 2 })); g.fant.userData.peca = g.pecas.semX; g.grp[22].gr.add(g.fant); g.pick.push(g.fant);
        g.real = C3.inst(g, C3.caixaR(g, 1, 1, .08, .07, 4), C3.fis(g, '#FF6B7D', { p: { transparent: true, opacity: .14, depthWrite: false, emissive: new T.Color('#FF6B7D'), emissiveIntensity: .08 } }), 2, g.car);
      },
      animar(g, P) {
        const i = P.i, e = P.e, t = g.t, red = RED(), larg = g.v.w >= 640;
        const a1 = i < 2 ? 1 : i === 2 ? 1 - sst(e * 2) : 0, a2 = i < 2 ? 0 : i === 2 ? sst(e * 2 - 1) : 1;
        // gametas e fecundação
        g.gam.visible = a1 > .01;
        if (g.gam.visible) {
          const q = i === 0 ? 0 : i === 1 ? e : 1, s = a1, Re = 5;
          g.gam.scale.setScalar(s); g.gam.position.set(larg ? -3 : 0, 0, 0);
          g.ov.scale.setScalar(Re); g.zona.scale.setScalar(Re * 1.12); g.ovN.scale.setScalar(Re * .42);
          [g.ov, g.zona, g.ovN].forEach(m => { m.material.uniforms.uT.value = t; });
          // cromossomos no núcleo: dois 21 (violeta) e 22 outros (cinza, pequenos)
          const nb = [0, 0, 0];
          for (let k = 0; k < 22; k++) { const z0 = hash(k, 1) * 2 - 1, an = hash(k, 2) * TAU, sq = Math.sqrt(1 - z0 * z0), rr = Re * .3 * Math.sqrt(hash(k, 3)); g._e.set(an, k, z0); g._q.setFromEuler(g._e); C3.put(g, g.cr, [sq * Math.cos(an) * rr + .4, sq * Math.sin(an) * rr - .3, z0 * rr], g._q, .1, .18 + .2 * hash(k, 4), .1, '#8F86A8', .8, g.pecas.ovulo); }
          C3.put(g, g.cr, [-.55, .35, .6], null, .16, .42, .16, MAT, 1, g.pecas.ovulo); C3.put(g, g.cr, [-.15, .35, .6], null, .16, .42, .16, MAT, 1, g.pecas.ovulo);
          // espermatozoide: chega nadando e o seu núcleo (com o 21 azul) entra
          const sx0 = larg ? 13 : 8.5, sp = lerp3([sx0, 2.2, 1], [Re * .35, .2, .8], sst(q * 1.15)), tail = [];
          g.cab.position.set(sp[0], sp[1], sp[2]); g.cab.scale.set(.75, .5, .5).multiplyScalar(1 - sst((q - .75) / .25) * .9);
          for (let j = 0; j < 40; j++) { const f = j / 39, ph = red ? 0 : t * 6; tail.push([sp[0] + .6 + f * 6.5, sp[1] + Math.sin(f * 8 - ph) * .45 * f, sp[2] + Math.cos(f * 6 - ph) * .2 * f]); }
          g.cauda.set(tail, (ii, nn) => .07 * (1 - ii / nn * .6)); g.cauda.mesh.visible = q < .85;
          const r21 = lerp3(sp, [.25, .35, .6], sst((q - .6) / .4));
          C3.put(g, g.cr, r21, null, .16, .42, .16, PAT, 1, g.pecas.esp);
          C3.fim(g.cr);
          g.vis.ovulo = 1; g.anc.ovulo = add(g.gam.position.toArray(), [0, Re * 1.15, 0]); g.vis.esp = 1; g.anc.esp = add(g.gam.position.toArray(), add(sp, [0, .6, 0]));
          if (q > .9) { g.vis.tri = 1; g.anc.tri = add(g.gam.position.toArray(), [-.2, .9, .8]); }
          g.zig = q;
        }
        // cariótipo
        g.car.visible = a2 > .01;
        if (g.car.visible) {
          const cols = larg ? 8 : 6, gw = 2.7, gh = 5.4, rows = Math.ceil(23 / cols), id = Math.max(0, i - 2), cur = [[1, 0, 0], [0, 1, 0], [0, 0, 1]][id], prv = i > 2 ? [[1, 0, 0], [0, 1, 0], [0, 0, 1]][id - 1] : cur, v = cur.map((c, j) => mix(prv[j], c, i >= 2 ? e : 1));
          g.car.scale.setScalar(.85 + .15 * a2); g.car.position.set(0, 0, -(1 - a2) * 6);
          g.car.children.forEach(ch => { ch.visible = true; });
          g.cel = []; let nr = 0;
          g.grp.forEach((G, k) => {
            const cx = (k % cols - (cols - 1) / 2) * gw, cy = ((rows - 1) / 2 - Math.floor(k / cols)) * gh - .3, sex = k === 22, base = cy - 1.9;
            G.gr.position.set(cx, 0, 0); const y = base + G.L * .5;
            const tres = (k === 20 && v[0] > .01) || (sex && v[2] > .01), d = .5;
            G.a.position.set(-d - (tres ? d * .7 : 0), y - G.L * (.5 - PB[sex ? 22 : k]) * 0, 0);
            G.a.position.y = base + G.L * (1 - PB[sex ? 22 : k]); G.b.position.y = G.a.position.y;
            G.b.position.x = d - (tres ? d * .7 : 0);
            const rot = red ? 0 : Math.sin(t * .4 + k) * .12; G.a.rotation.y = rot; G.b.rotation.y = -rot;
            if (sex) {
              G.b.visible = v[1] < .99 && v[2] < .01; G.b.scale.setScalar(Math.max(.001, 1 - v[1]));
              g.fant.visible = v[1] > .01; g.fant.position.set(d, base + G.L * .5, 0); g.fant.scale.set(.32, G.L * .5 - .2, .32); g.fant.material.uniforms.uOp.value = v[1]; g.fant.material.uniforms.uT.value = t;
              g.Y.visible = v[2] > .01; g.Y.scale.setScalar(Math.max(.001, v[2])); g.Y.position.set(G.b.position.x, base + MB[23] / 249 * 3.1 * .7 + .5, 0);
              g.Y.position.y = base + (.7 + 3.1 * MB[23] / 249) * (1 - PB[23]);
              g.extraX.visible = v[2] > .01; g.extraX.scale.setScalar(Math.max(.001, v[2])); g.extraX.position.set(d * 2.3, G.a.position.y, 0);
              if (v[1] > .5) { g.vis.semX = 1; g.anc.semX = add(g.car.position.toArray(), [cx + d, base + G.L + .4, .5]); }
              if (v[2] > .5) { g.vis.xx = 1; g.anc.xx = add(g.car.position.toArray(), [cx + d * 2.3, G.a.position.y + .8, .5]); }
            }
            if (k === 20) { g.extra21.visible = v[0] > .01; g.extra21.scale.setScalar(Math.max(.001, v[0])); g.extra21.position.set(d * 2.3, G.a.position.y, 0); if (v[0] > .5) { g.vis.x21 = 1; g.anc.x21 = add(g.car.position.toArray(), [cx + d * 2.3, G.a.position.y + 1.1, .5]); } }
            const hot = (k === 20 ? v[0] : 0) + (sex ? Math.max(v[1], v[2]) : 0);
            if (hot > .01) { const hh = (G.L + 1.5) / 2; C3.put(g, g.real, [cx + .3, base - .75 + hh, -.7], null, gw * .5 - .1, hh, 1, '#FF6B7D', hot); }
            g.cel.push([cx, base - .55, sex ? ['XX', 'X', 'XXY'][id] : String(k + 1), hot]);
          });
          C3.fim(g.real);
          g.cols = cols; g.rows = rows; g.gw = gw; g.gh = gh;
        }
        g.a2 = a2;
      },
      camera(g, P) {
        const larg = g.v.w >= 640;
        if (P.i < 2 || (P.i === 2 && P.e < .5)) return C3.viva({ th: -.2 + .1 * P.u, fi: .14, d: C3.enquadrar(g, larg ? 13 : 7, 7.5, 6), al: [larg ? 2 : 0, 0, 0] }, g.t, .8);
        const cols = larg ? 8 : 6, rows = Math.ceil(23 / cols);
        return C3.viva({ th: -.06, fi: .06, d: C3.enquadrar(g, cols * 2.7 / 2 + .4, rows * 5.4 / 2 + .5, 1), al: [0, -.2, 0] }, g.t, .5);
      },
      sobre(g, S, K) {
        const X = K.X;
        if (g.a2 > .01 && g.cel) {
          X.globalAlpha = g.a2;
          g.cel.forEach(([x, y, s, hot]) => { const p = C3.tela(g, add(g.car.position.toArray(), [x, y, .3])); K.tx(s, p[0], p[1], { f: K.FD, s: 12, w: hot > .5 ? 600 : 400, c: hot > .5 ? '#FFD0D6' : K.C.dim }); });
          X.globalAlpha = 1;
        }
        if (g.gam.visible && S.i <= 1) {
          const b = C3.tela(g, add(g.gam.position.toArray(), [0, -5.9, 0]));
          X.globalAlpha = g.gam.scale.x; K.tx(g.zig > .9 ? 'Zigoto: 47 cromossomos' : 'Óvulo: 24 cromossomos', b[0], b[1], { s: 13, w: 600, c: K.C.txt });
          const n = C3.tela(g, add(g.gam.position.toArray(), [.3, -2.6, 1])); K.tx(g.zig > .9 ? '+ 44 outros' : '+ 22 outros', n[0], n[1], { s: 12.5, c: K.C.dim }); X.globalAlpha = 1;
        }
      }
    };
  });

  // ---------- euploidias ----------
  const PLOI = [{ k: 2, n: '2n', nm: 'Diploide', ex: [['Milho', '20 cromossomos'], ['Ser humano', '46 cromossomos']], nt: 'O normal na maioria dos animais e das plantas: um conjunto de cada genitor.' },
    { k: 3, n: '3n', nm: 'Triploide', ex: [['Banana-nanica', '3 conjuntos, 33'], ['Melancia sem sementes', '3 conjuntos, 33']], nt: 'Quase estéril: sem sementes viáveis. No ser humano (69 cromossomos) é letal.' },
    { k: 4, n: '4n', nm: 'Tetraploide', ex: [['Batata', '4 conjuntos, 48'], ['Algodão cultivado', '4 conjuntos, 52']], nt: 'Células e órgãos maiores; muitas plantas cultivadas são assim.' },
    { k: 6, n: '6n', nm: 'Hexaploide', ex: [['Trigo-comum', '6 conjuntos de 7, 42'], ['Aveia', '6 conjuntos, 42']], nt: 'E o morango cultivado tem 8 conjuntos de 7: 56 cromossomos.' },
    { k: 1, n: 'n', nm: 'Haploide', ex: [['Zangão das abelhas', 'n = 16'], ['Rainha e operárias', '2n = 32']], nt: 'O zangão nasce de óvulo não fecundado: na abelha, isso é normal.' }];
  const SETC = ['#9A6BFF', '#5CC8F0', '#C3A6FF', '#A8E6FA', '#7A4FE0', '#2FA8D8'];
  C3.cena('erros/euploidias', K => {
    function wrap(X, s, x, y, maxW, lh, o) { X.font = `${o.w || 400} ${Math.max(12, o.s || 13)}px ${o.f || K.FT}`; const ws = s.split(' '); let ln = '', yy = y; for (const w of ws) { const t = ln ? ln + ' ' + w : w; if (ln && X.measureText(t).width > maxW) { K.tx(ln, x, yy, o); ln = w; yy += lh; } else ln = t; } if (ln) K.tx(ln, x, yy, o); return yy; }
    const area = (W, H) => { const y0 = 56, wide = W >= 640; return wide ? { A: { x: 8, y: y0, w: W * .54 - 12, h: H - y0 - 8 }, B: { x: W * .54 + 4, y: y0, w: W * .46 - 12, h: H - y0 - 8 }, wide } : { A: { x: 8, y: y0, w: W - 16, h: (H - y0 - 8) * .56 }, B: { x: 8, y: y0 + (H - y0 - 8) * .56 + 6, w: W - 16, h: (H - y0 - 8) * .44 - 6 }, wide }; };
    return {
      fit: 40, vista: { th: 0, fi: .1 },
      pecas: {
        conj: pc('Conjunto de cromossomos (n)', '#9A6BFF', 'Cada tom é um conjunto completo: um cromossomo longo (A) e um curto (B). Na euploidia, os conjuntos inteiros mudam.'),
        extra: pc('Cromossomo a mais', '#FF6B7D', 'Na aneuploidia muda só um tipo: aqui, o B ganhou uma cópia (2n + 1, trissomia).'),
        cel: C3.PECAS_BASE.membrana
      },
      rotulos: [{ pc: 'extra', t: 'Cromossomo B a mais' }],
      montar(g) {
        const T = g.T;
        g.cels = [0, 1].map(() => {
          const gr = new T.Group(); g.raiz.add(gr);
          const m = new T.Mesh(C3.esfera(g, 56), C3.filme(g, '#F06AAE', { cor2: '#FFD6EC', dentro: '#2A1E44', base: .03, fr: .5, esc: .35 })); m.renderOrder = 3; m.userData.peca = g.pecas.cel; gr.add(m); g.pick.push(m);
          const n = new T.Mesh(C3.esfera(g, 44), C3.filme(g, '#9A6BFF', { cor2: '#D9C9FF', dentro: '#2A1E4D', base: .08, fr: .5, esc: .9 })); n.renderOrder = 2; gr.add(n);
          const cr = C3.inst(g, C3.capsula(g, 1, 1, 12), C3.fis(g, '#ffffff', { p: { roughness: .45, clearcoat: .6, clearcoatRoughness: .3, sheen: .5, sheenColor: new T.Color('#E6DCFF') }, rim: '#D2C2FF', rimK: .32 }), 30, gr, g.pecas.conj); g.pick.push(cr.m);
          const ce = C3.inst(g, C3.esfera(g, 12), C3.fis(g, '#1E1838', { p: { roughness: .6 } }), 30, gr);
          return { gr, m, n, cr, ce };
        });
      },
      animar(g, P) {
        const i = P.i, e = P.e, t = g.t, red = RED(), W = g.v.w, H = g.v.h, ar = area(W, H);
        const a1 = i < 5 ? 1 : i === 5 ? 1 - e : 0, a2 = i === 5 ? e : i === 6 ? 1 - e : 0;
        g.a1 = a1; g.a2 = a2; g.a3 = i === 6 ? e : 0;
        // uma célula: conjuntos que crescem; com dois quadros (passo 6), duas células: 3n e 2n + 1
        const ip = Math.min(4, i), pv = i > 0 && i < 5 ? i - 1 : ip, kc = PLOI[ip].k, kp = PLOI[pv].k, ee = i < 5 ? e : 1;
        const cel = (C, kk, kprev, ext, al, R) => {
          C.gr.visible = al > .01; if (!C.gr.visible) return;
          C.m.scale.setScalar(R); C.n.scale.setScalar(R * .78); C.m.material.uniforms.uOp.value = al; C.n.material.uniforms.uOp.value = al; C.m.material.uniforms.uT.value = t;
          const km = Math.max(kk, kprev);
          for (let tp = 0; tp < 2; tp++) {
            const n = tp ? kk + (ext || 0) : kk, nP = tp ? kprev + (ext || 0) : kprev, L = tp ? R * .3 : R * .52, cxg = (tp ? .5 : -.42) * R, rr = R * (.1 + .045 * Math.max(n, 2));
            for (let j = 0; j < Math.max(n, nP); j++) {
              const inC = j < n, inP = j < nP, al2 = inC && inP ? 1 : inC ? ee : 1 - ee; if (al2 < .01) continue;
              const nn = mix(nP, n, ee), an = j / Math.max(1, nn) * TAU + (red ? 0 : t * .08) + tp, x = cxg + Math.cos(an) * rr * .55, z = Math.sin(an) * rr;
              const isR = tp === 1 && ext && j === n - 1, col = isR ? '#FF6B7D' : SETC[j % 6];
              g._e.set(Math.sin(an) * .25, 0, Math.cos(an) * .18 + (tp ? .3 : -.2)); g._q.setFromEuler(g._e);
              const s = al2 * al;
              C3.put(g, C.cr, [x, 0, z], g._q, R * .055 * s, L * .5 * s, R * .055 * s, col, 1, isR ? g.pecas.extra : g.pecas.conj);
              C3.put(g, C.ce, [x, L * (tp ? .12 : .18) * s, z], null, R * .06 * s, null, null, '#1E1838', 1);
              if (isR && al > .5) { g.vis.extra = 1; g.anc.extra = add(C.gr.position.toArray(), [x, L * .5 + .3, z]); }
            }
          }
          C3.fim(C.cr); C3.fim(C.ce);
        };
        const kR = k => 3.2 * Math.pow(k / 2, .28);
        if (a1 > .01) { const R = mix(kR(kp), kR(kc), ee); g.cels[0].gr.position.set(0, 0, 0); cel(g.cels[0], kc, kp, 0, a1, R); g.R1 = R; g.cels[1].gr.visible = false; }
        if (a2 > .01) { const sx = ar.wide ? 6.2 : 0, sy = ar.wide ? 0 : 5.2; g.cels[0].gr.position.set(-sx, sy, 0); g.cels[1].gr.position.set(sx, -sy, 0); cel(g.cels[0], 3, 3, 0, a2, kR(3) * .9); cel(g.cels[1], 2, 2, 1, a2 * (i === 5 ? 1 : 1), kR(2.5) * .9); }
        if (a1 <= .01 && a2 <= .01) g.cels.forEach(C => { C.gr.visible = false; });
        g.kc = kc; g.ip = ip; g.pv = pv; g.ee = ee;
      },
      camera(g, P) {
        const W = g.v.w, H = g.v.h, ar = area(W, H), i = P.i;
        if (i >= 5) { const wide = ar.wide; return C3.viva({ th: -.12, fi: .16, d: C3.enquadrar(g, wide ? 11 : 5.2, wide ? 5.6 : 10.6, 3), al: [0, -.6, 0] }, g.t, .6); }
        const A = ar.A, R = g.R1 || 3.2, rpx = Math.min(A.w / 2 - 10, (A.h - 22) / 2 - 4) * .86, tg = Math.tan(g.v.cam.fov * Math.PI / 360), d = R * (H / 2) / (Math.max(30, rpx) * tg), pu = (H / 2) / (d * tg);
        const sx = A.x + A.w / 2, sy = A.y + (A.h - 22) / 2;
        return C3.viva({ th: -.15 + .06 * P.u, fi: .32, d, al: [-(sx - W / 2) / pu, (sy - H / 2) / pu, 0] }, g.t, .4);
      },
      sobre(g, S, K) {
        const X = K.X, W = K.W, H = K.H, ar = area(W, H), i = S.i, e = S.e;
        if (g.a1 > .01) {
          X.globalAlpha = g.a1; const A = ar.A, B = ar.B, wide = ar.wide;
          const pl = PLOI[g.ip]; K.tx(`${pl.n}: ${pl.k === 1 ? '1 conjunto' : pl.k + ' conjuntos'}, ${2 * pl.k} cromossomos`, A.x + A.w / 2, A.y + A.h - 10, { s: 13, w: 600, c: K.C.txt });
          const pan = (pl, al) => { if (al < .01) return; X.save(); X.globalAlpha *= al; const x = B.x + B.w / 2, mw = B.w - 28, cmp = !wide && B.h < 210; let y = B.y + (cmp ? 18 : Math.max(26, B.h * .14));
            K.tx(pl.n, x, y, { f: K.FTT, s: cmp ? 24 : 34, w: 700, c: '#F7C13B' }); y += cmp ? 24 : 38; K.tx(pl.nm, x, y, { f: K.FTT, s: cmp ? 15 : 18, w: 600, c: K.C.txt }); y += cmp ? 22 : 34;
            for (const [a, b] of pl.ex) { if (cmp || mw < 260) { K.tx(`${a}: ${b}`, x, y, { s: 13, c: K.C.txt }); y += cmp ? 18 : 22; } else { K.tx(a, x, y, { s: 14, w: 600, c: K.C.txt }); K.tx(b, x, y + 18, { f: K.FD, s: 12.5, c: K.C.dim }); y += 42; } }
            y += cmp ? 2 : 6; wrap(X, pl.nt, x, y, mw, 17, { s: 12.5, c: K.C.dim, bg: false }); X.restore(); };
          K.rr(B.x + 4, B.y, B.w - 8, B.h, 12); X.fillStyle = 'rgba(19,26,43,.72)'; X.fill(); X.strokeStyle = 'rgba(91,108,153,.35)'; X.lineWidth = 1; X.stroke();
          if (i > 0 && i < 5) { pan(PLOI[g.pv], 1 - K.ss(e * 2)); pan(PLOI[g.ip], K.ss(e * 2 - 1)); } else pan(PLOI[g.ip], 1);
          X.globalAlpha = 1;
        }
        if (g.a2 > .01) {
          X.globalAlpha = g.a2;
          g.cels.forEach((C, k) => { const R = C.m.scale.x, top = C3.tela(g, add(C.gr.position.toArray(), [0, R + .9, 0])), bot = C3.tela(g, add(C.gr.position.toArray(), [0, -R - .7, 0]));
            K.tx(k ? 'Aneuploidia: 2n + 1' : 'Euploidia: 3n', top[0], top[1], { f: K.FTT, s: W < 640 ? 14 : 15, w: 600, c: K.C.txt }); K.tx(k ? 'só o tipo B muda: 5 cromossomos' : 'todos os tipos mudam: 6 cromossomos', bot[0], bot[1], { s: 12.5, c: K.C.txt }); });
          X.globalAlpha = 1;
        }
        if (g.a3 > .01) {
          X.globalAlpha = g.a3; X.fillStyle = 'rgba(11,15,28,.9)'; X.fillRect(0, 0, W, H);
          const y0 = W < 640 ? 80 : 56, rows = [['Nulissomia', '2n − 2', 0], ['Monossomia', '2n − 1', 1], ['Normal', '2n', 2], ['Trissomia', '2n + 1', 3], ['Tetrassomia', '2n + 2', 4]];
          const rh = (H - y0 - 8) / 5, bw = Math.min(W - 16, 560), bx = (W - bw) / 2, lw = Math.min(150, bw * .42), s = Math.min(26, (bw - lw - 8) / 7.6), w = Math.max(3, Math.min(8, s * .5)), L = Math.min(rh * .78, 72);
          const rod = (x, y, Lr, col) => { X.lineCap = 'round'; K.line(x, y - Lr / 2, x, y + Lr / 2, col, w); K.circ(x, y - Lr * .12, w * .62, 'rgba(11,15,28,.75)'); };
          const ghost = (x, y, Lr) => { X.save(); X.setLineDash([3, 4]); X.lineCap = 'round'; X.beginPath(); X.moveTo(x, y - Lr / 2); X.lineTo(x, y + Lr / 2); X.strokeStyle = K.rgba(K.C.red, .85); X.lineWidth = 1.5; X.stroke(); X.restore(); };
          rows.forEach(([nm, fm, c], r) => {
            const y = y0 + rh * r + rh / 2; if (r) K.line(bx, y0 + rh * r, bx + bw, y0 + rh * r, 'rgba(91,108,153,.3)', 1);
            K.tx(nm, bx + 4, y - 9, { a: 'left', s: 14, w: 600, c: c === 2 ? K.C.txt : '#FFB3BD' }); K.tx(fm, bx + 4, y + 10, { a: 'left', f: K.FD, s: 12.5, c: K.C.dim });
            let x = bx + lw + s / 2; for (let j = 0; j < 2; j++) { rod(x, y, L, SETC[j]); x += s; } x += s * .6;
            for (let j = 0; j < 4; j++) { const yy = y - .45 * L * .18; if (j < c) rod(x, yy, L * .55, j < 2 ? SETC[j] : K.C.red); else if (j < 2) ghost(x, yy, L * .55); x += s; }
          });
          X.globalAlpha = 1;
        }
      }
    };
  });
})();
