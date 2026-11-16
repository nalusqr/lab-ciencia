/* LAB Anatomia e fisiologia: glândulas endócrinas em 3D (Martin), sobre o kit do módulo Vírus (vir3d.js) e as peças deste
   módulo (anat3d-pecas.js). Silhueta neutra translúcida com o encéfalo, os rins e as glândulas no lugar: hipotálamo,
   hipófise, tireoide, paratireoides, adrenais sobre os rins, pâncreas e ovários ou testículos (o botão de sempre troca).
   A glândula da vez acende e solta hormônios (cubo, pirâmide ou losango) no sangue; eles viajam até quatro células-alvo e
   só encaixam nas que têm o receptor da mesma forma, que respondem. Toque numa glândula para escolher.
   O termostato da tireoide continua no desenho plano. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.anCena) return;
  const { V } = V3, { cl, mix, sst, add, sub, mul, nrm, lerp3, fr, hash, TAU } = V;
  const RED = () => V3.REDUZ(), ach = V3.ach;
  const GLC = '#F2A65A', AM = '#FFB347', SANG = '#E5484D', CEL = '#5E86C2';
  // mesmas glândulas do desenho plano (posição em unidades do corpo: y para baixo no plano vira y para cima aqui)
  const GL = [
    { n: 'Hipotálamo', h: 'controla a hipófise; faz ocitocina e ADH', d: 'Parte do sistema nervoso que comanda a hipófise: é ele que liga os dois sistemas.', f: 0, p: [[0, 4.22, .05]], s: [.16, .1, .14] },
    { n: 'Hipófise', h: 'TSH, ACTH, FSH, LH, GH e prolactina', d: 'Solta hormônios que comandam outras glândulas e o GH, do crescimento. Guarda e solta a ocitocina e o ADH.', f: 1, p: [[0, 3.85, .12]], s: [.1, .09, .1] },
    { n: 'Tireoide', h: 'T3, T4 e calcitonina', d: 'T3 e T4 aceleram o metabolismo e precisam de iodo. A calcitonina baixa o cálcio do sangue.', f: 2, p: [[-.15, 3.08, .3], [.15, 3.08, .3]], s: [.11, .19, .09] },
    { n: 'Paratireoides', h: 'paratormônio', d: 'Quatro grãos atrás da tireoide. O paratormônio sobe o cálcio do sangue, tirando cálcio dos ossos.', f: 0, p: [[-.17, 3.18, .18], [.17, 3.18, .18], [-.17, 2.96, .18], [.17, 2.96, .18]], s: [.045, .045, .045] },
    { n: 'Adrenais', h: 'adrenalina, cortisol e aldosterona', d: 'Sobre os rins. A medula solta adrenalina no susto; o córtex solta cortisol (estresse, glicose) e aldosterona (sal e água).', f: 1, p: [[-.62, .98, -.3], [.62, .98, -.3]], s: [.17, .13, .12] },
    { n: 'Pâncreas', h: 'insulina e glucagon', d: 'Glândula mista: a parte exócrina faz suco digestivo; a endócrina (ilhotas) faz os hormônios que seguram a glicemia.', f: 2, p: [[.08, .42, -.05]], s: [.55, .1, .13] },
    { n: 'Ovários', h: 'estrógeno e progesterona', d: 'As glândulas sexuais fazem os hormônios sexuais; FSH e LH da hipófise as comandam.', f: 0, p: [[-.55, -.75, 0], [.55, -.75, 0]], s: [.13, .09, .1] },
    { n: 'Testículos', h: 'testosterona', d: 'As glândulas sexuais fazem os hormônios sexuais; FSH e LH da hipófise as comandam.', f: 0, p: [[-.17, -1.72, .3], [.17, -1.72, .3]], s: [.13, .17, .13] }
  ];
  const PE = { corpo: { nome: 'Corpo (silhueta)', frase: 'Contorno neutro, só para localizar as glândulas.', cor: '#9DA9C4' }, sangue: { nome: 'Sangue', frase: 'Os hormônios viajam pelo sangue e chegam ao corpo todo, mas só agem nas células com o receptor certo.', cor: SANG },
    alvo: { nome: 'Célula-alvo', frase: 'Responde ao hormônio quando tem o receptor da mesma forma, como chave e fechadura.', cor: CEL }, encefalo: { nome: 'Encéfalo', frase: 'O hipotálamo fica na base do encéfalo, logo acima da hipófise.', cor: '#E3A5B5' }, rins: { nome: 'Rins', frase: 'As adrenais ficam sobre eles, como chapéus.', cor: '#C46B6B' } };
  GL.forEach((x, i) => { PE['g' + i] = { nome: x.n, frase: 'Hormônios: ' + x.h + '. ' + x.d, cor: GLC }; });
  const CELS = [[2.75, 3.1, 0], [2.75, 2.15, 0], [2.75, 1.2, 0], [2.75, .25, 0]], VASO = [[.32, 3.0, -.25], [.32, 1.6, -.25], [.32, -.2, -.25], [.32, -1.0, -.25]];

  V3.anCena('endocrino/glandulas', {
    fit: 11, raio: 6, bolas: 200, pecas: PE,
    so2D: S => S.modo === 'termo',
    rotulos: GL.map((x, i) => ({ pc: 'g' + i, t: x.n.toLowerCase(), pr: i < 3 ? 1 : 2 })).concat([{ pc: 'alvo', t: 'células-alvo', pr: 3 }]),
    montar(g) {
      const T = g.T, fm = (cor, o) => V3.filme(g, cor, Object.assign({ cor2: '#E8EDF7', dentro: '#141B2E', base: .05, fr: .42, esc: 1.6 }, o || {}));
      const parte = (geo, c, s, rz, pc, mat) => { const m = new T.Mesh(geo, mat || fm('#9DA9C4')); m.position.set(...c); m.scale.set(...s); m.rotation.z = rz || 0; m.renderOrder = 2; g.raiz.add(m); if (pc) { m.userData.peca = g.pecas[pc]; g.pick.push(m); } return m; };
      const n = g.q.cel ? 22 : 32;
      parte(V3.esfera(g, n), [0, 4.1, 0], [.82, .95, .85]); parte(V3.cilindro(g, n), [0, 3.15, 0], [.3, .55, .3]);
      parte(V3.capsula(g, 1, .8, n), [0, .9, 0], [1.22, 1.12, .62]);
      [-1, 1].forEach(sd => { parte(V3.capsula(g, 1, 1.5, n), [sd * 1.75, 1.2, 0], [.36, .72, .36], sd * .1); parte(V3.capsula(g, 1, 1.0, n), [sd * .55, -2.15, 0], [.48, .55, .48]); });
      parte(V3.celGeo(g), [0, 4.32, 0], [.66, .5, .72], 0, 'encefalo', fm('#E3A5B5', { base: .12, fr: .5 }));
      [-1, 1].forEach(sd => parte(V3.celGeo(g), [sd * .62, .5, -.32], [.18, .32, .13], sd * .2, 'rins', fm('#C46B6B', { base: .25, fr: .5 })));
      const vs = V3.suave(VASO, 5), tv = V3.tubo(g, vs.length, 12, fm(SANG, { base: .3, fr: .6, dentro: '#4A1820', esc: 3 }), null, 'sangue'); tv.set(vs, .09); tv.mesh.renderOrder = 4;
      g.glm = GL.map((x, i) => x.p.map(p => { const m = new T.Mesh(i === 4 ? V3.cone(g, 16) : V3.celGeo(g), V3.fis(g, GLC, { p: { roughness: .4, clearcoat: .6 }, rim: '#FFE0B0', rimK: .35 })); m.position.set(...p); m.scale.set(...x.s); g.raiz.add(m); m.userData.peca = g.pecas['g' + i]; g.pick.push(m); m.userData.mat = m.material; return m; }));
      // haste da hipófise e istmo da tireoide
      g.rod = V3.inst(g, V3.cilindro(g, 8), V3.fis(g, GLC, { p: { roughness: .45 } }), 8);
      // células-alvo e formas (cubo, pirâmide, losango)
      g.cel = g.cel || null; CELS.forEach(c => { const m = new T.Mesh(V3.celGeo(g), V3.fis(g, CEL, { p: { roughness: .5, sheen: .5, sheenColor: new T.Color('#CFE4FF') }, rimK: .3 })); m.position.set(...c); m.scale.setScalar(.34); g.raiz.add(m); m.userData.peca = g.pecas.alvo; g.pick.push(m); });
      const geos = [new T.BoxGeometry(1, 1, 1), new T.ConeGeometry(1, 1.5, 3), new T.OctahedronGeometry(1)]; geos.forEach(x => g.geos.push(x));
      g.forma = geos.map(geo => V3.inst(g, geo, V3.fis(g, '#FFFFFF', { p: { roughness: .35, clearcoat: .6 }, rimK: .3 }), 40));
      g.sel0 = -1; g.t0 = 0;
    },
    animar(g, P) {
      const S = P.S, t = P.t, info = g.pecas, rv = !RED(), lista = GL.map((x, i) => i).filter(i => i !== (S.sx ? 6 : 7));
      let sel = g.sel && /^g\d$/.test(g.sel) ? +g.sel.slice(1) : null;
      if (sel == null || lista.indexOf(sel) < 0) sel = lista[rv ? Math.floor(t / 3.2) % lista.length : 2];
      if (sel !== g.sel0) { g.sel0 = sel; g.t0 = t; }
      g.selG = sel;
      GL.forEach((x, i) => {
        const vis = lista.indexOf(i) >= 0, on = i === sel, k = on ? 1 + (rv ? .1 * Math.sin(t * 5) : .08) : 1;
        g.glm[i].forEach(m => { m.visible = vis; m.scale.set(x.s[0] * k, x.s[1] * k, x.s[2] * k); m.material.emissive && m.material.emissive.set(on ? '#7A4A10' : '#000000'); });
        if (vis) ach(g, 'g' + i, x.p[x.p.length - 1]);
      });
      V3.bastao(g, g.rod, [0, 4.15, .06], [0, 3.9, .1], .02, GLC, 1, info.g1); V3.bastao(g, g.rod, [-.1, 3.0, .32], [.1, 3.0, .32], .04, GLC, 1, info.g2); V3.fim(g.rod);
      // hormônios: da glândula ao vaso, pelo vaso até a altura das células, e para cada célula
      const x = GL[sel], f = x.f, src = x.p[0], via = [.32, src[1], -.25], yv = cl(src[1], -.6, 2.8);
      for (let i = 0; i < 16; i++) {
        const k = i % 4, c = CELS[k], rf = k % 2 ? (f + 1 + (k >> 1)) % 3 : f, ok = rf === f, u = rv ? fr(t * .12 + i / 16) : .5 + i / 40;
        const rec = add(c, [-.36, 0, 0]), Pt = [src, via, [.32, mix(yv, 1.7, .5), -.25], [1.2, mix(yv, c[1], .6), -.1], add(rec, [-.25, 0, 0])];
        let p;
        if (u < .85) p = V3.em(Pt, V3.fracoes(Pt), u / .85);
        else p = ok ? add(rec, [-.1, 0, 0]) : add(add(rec, [-.25, 0, 0]), [-(u - .85) * 3, Math.sin(i) * (u - .85) * 2, 0]);
        const a = u > .85 && !ok ? 1 - (u - .85) / .15 : 1;
        if (a > .05) V3.put(g, g.forma[f], p, V3.giro(g, i, t), .07 * a, .07 * a, .07 * a, AM, 1.1, info['g' + sel]);
      }
      CELS.forEach((c, k) => {
        const rf = k % 2 ? (f + 1 + (k >> 1)) % 3 : f, ok = rf === f, rec = add(c, [-.36, 0, 0]);
        V3.put(g, g.forma[rf], rec, null, .085, .085, .085, ok ? '#FFE0A0' : '#7D88A6', 1, info.alvo);
        if (ok && rv) { const pu = .5 + .5 * Math.sin(t * 4 + k); for (let a = 0; a < 10; a++) { const an = a / 10 * TAU; V3.brilho(g, add(c, [Math.cos(an) * (.42 + .04 * pu), Math.sin(an) * (.42 + .04 * pu), 0]), .02, AM, .9); } }
        V3.ficha(g, add(c, [.42, 0, 0]), ok ? 'responde' : 'não responde', ok ? AM : '#9DA9C4', { pr: 2, dx: 1, dy: 0 });
      });
      g.forma.forEach(W => V3.fim(W));
      ach(g, 'alvo', add(CELS[0], [0, .35, 0])); ach(g, 'sangue', [.32, 1.0, -.25]);
    },
    legenda(g) { const x = GL[g.selG == null ? 2 : g.selG]; return `<b>${x.n}</b>: ${x.h}. ${x.d} O hormônio viaja pelo sangue e só age na célula com o receptor da mesma forma. Toque numa glândula para escolher.`; },
    camera(g, P) {
      const d = V3.deitado(g);
      return V3.anCam(g, P, d ? 3.9 : 3.3, d ? 3.75 : 4.3, { al: [.45, 1.25, 0], th: .18, fi: .08 });
    }
  });
})();
