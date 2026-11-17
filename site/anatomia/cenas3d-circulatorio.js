/* LAB Anatomia e fisiologia: coração aberto em 3D (Martin), sobre o kit do módulo Vírus (vir3d.js) e as peças deste módulo
   (anat3d-pecas.js). Corte de quatro câmaras: átrios abertos mais atrás, ventrículos abertos na frente, com a parede do
   ventrículo esquerdo cerca de três vezes mais grossa que a do direito. Valvas com folhetos que abrem e fecham no ciclo
   (tricúspide e mitral com cordas tendíneas; pulmonar e aórtica com três válvulas), hemácias que enchem as cavidades na
   diástole e saem na sístole, veias cavas, artéria pulmonar, veias pulmonares e aorta com o arco e três ramos.
   Pulso elétrico do nó sinoatrial ao nó atrioventricular, feixe no septo e ramos nas paredes. Furo no septo com mistura.
   Sangue venoso em azul-arroxeado e arterial em vermelho, o mesmo código de cores do desenho plano.
   A vista de frente (figura) e o caminho de uma hemácia continuam no desenho plano. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.anCena) return;
  const { V } = V3, { cl, mix, sst, add, sub, mul, nrm, cross, hash, lerp3, fr, TAU } = V;
  const RED = () => V3.REDUZ(), ach = V3.ach;
  const ART = '#E5484D', VEN = '#7C6FD6', AM = '#FFB347';
  const MIO = '#B9505B', MIOc = '#8A2E3A', CAVD = '#2C2550', CAVE = '#4A1720', VAL = '#EAD9C6';

  const PE = {
    ad: { nome: 'Átrio direito', frase: 'Recebe o sangue venoso das veias cavas. Parede fina: só empurra o sangue até o ventrículo logo abaixo.', cor: VEN },
    ae: { nome: 'Átrio esquerdo', frase: 'Recebe das veias pulmonares o sangue arterial, rico em O₂, que volta dos pulmões.', cor: ART },
    vd: { nome: 'Ventrículo direito', frase: 'Bombeia o sangue venoso para os pulmões pela artéria pulmonar. A parede é mais fina porque a circulação pulmonar exige pressão bem menor que a do corpo.', cor: VEN },
    ve: { nome: 'Ventrículo esquerdo', frase: 'A parede mais grossa do coração, cerca de três vezes a do direito: empurra o sangue arterial para o corpo inteiro pela aorta.', cor: ART },
    septo: { nome: 'Septo', frase: 'Parede de músculo que separa o lado direito do esquerdo. Fechado, os dois sangues não se misturam: circulação completa.', cor: '#E8EDF7' },
    mio: { nome: 'Miocárdio', frase: 'O músculo do coração (músculo estriado cardíaco), que contrai sozinho, de forma rítmica e involuntária.', cor: MIO },
    tric: { nome: 'Valva tricúspide', frase: 'Três folhetos entre o átrio e o ventrículo direitos. Fecha na sístole (o "tum") e não deixa o sangue voltar para o átrio.', cor: VAL },
    mitral: { nome: 'Valva mitral (bicúspide)', frase: 'Dois folhetos entre o átrio e o ventrículo esquerdos. Presa por cordas tendíneas, que não deixam o folheto virar para trás.', cor: VAL },
    pulmv: { nome: 'Valva pulmonar', frase: 'Na saída do ventrículo direito. Abre na sístole e fecha no fim dela (o "tá").', cor: VAL },
    aortv: { nome: 'Valva aórtica', frase: 'Na saída do ventrículo esquerdo. Abre na sístole e fecha no fim dela (o "tá").', cor: VAL },
    cordas: { nome: 'Cordas tendíneas', frase: 'Fios que prendem os folhetos da tricúspide e da mitral aos músculos papilares, como cordas de paraquedas.', cor: VAL },
    cavas: { nome: 'Veias cavas', frase: 'A superior e a inferior trazem ao átrio direito o sangue venoso do corpo.', cor: VEN },
    ap: { nome: 'Artéria pulmonar', frase: 'Sai do ventrículo direito e leva sangue venoso aos pulmões. É artéria porque sai do coração.', cor: VEN },
    vp: { nome: 'Veias pulmonares', frase: 'Quatro veias que trazem dos pulmões ao átrio esquerdo o sangue arterial. São veias porque chegam ao coração.', cor: ART },
    aorta: { nome: 'Aorta', frase: 'A maior artéria: sai do ventrículo esquerdo, faz um arco com ramos para a cabeça e os braços e desce para o corpo.', cor: ART },
    hv: { nome: 'Sangue venoso', frase: 'Pobre em O₂. No coração humano fica só do lado direito. Azul-arroxeado aqui é só um código de cores.', cor: VEN },
    ha: { nome: 'Sangue arterial', frase: 'Rico em O₂. Fica só do lado esquerdo. Vermelho aqui é só um código de cores.', cor: ART },
    sa: { nome: 'Nó sinoatrial', frase: 'O marca-passo natural, no átrio direito. Dispara o impulso que contrai os átrios; o nó atrioventricular segura um instante e passa aos ventrículos pelo septo.', cor: AM },
    furo: { nome: 'Furo no septo', frase: 'Por ele os dois sangues se misturam, e o sangue que vai para o corpo leva menos O₂.', cor: '#9B6BC8' }
  };

  // ---------- geometria em coordenadas do mundo: x para a esquerda da pessoa (direita de quem olha), y para cima, z para a frente ----------
  const RZ = .3, OFF = [.05, -.2, 0], cR = Math.cos(RZ), sR = Math.sin(RZ);
  const vw = p => [p[0] * cR - p[1] * sR + OFF[0], p[0] * sR + p[1] * cR + OFF[1], p[2]];   // ventrículos: eixo inclinado, ponta para a esquerda da pessoa
  const RA = [-.8, 1.08, -.48], LA = [.48, 1.1, -.55];
  const LVc = vw([.38, -.25, -.02]), RVc = vw([-.58, 0, .05]);
  const TV = [-.76, .42, -.22], MV = [.3, .58, -.24], PV = [.12, .86, .2], AV = [-.05, .62, -.12];
  const PAP = { tric: [vw([-.5, -.45, .05]), vw([-.75, -.2, -.05])], mitral: [vw([.25, -.75, -.05]), vw([.55, -.7, -.05])] };
  // trilhas do sangue [x, y, z, espalhamento]; marcas: AV = valva de entrada, AP = ponta, SL = valva de saída
  const AORTA = [[-.05, .62, -.12, .07], [-.2, 1.2, -.08, .08], [-.2, 1.9, -.12, .08], [.05, 2.35, -.3, .08], [.5, 2.38, -.6, .08], [.78, 1.9, -.85, .07], [.82, 1.0, -.95, .07], [.82, -.6, -1.0, .06]];
  const TRONCO = [[.12, .86, .2, .07], [.2, 1.3, .2, .07], [.35, 1.65, .05, .07]];
  const TR = {
    v1: { cor: VEN, pc: 'hv', P: [[-.85, 2.55, -.5, .07], [-.84, 1.75, -.5, .07], [-.8, 1.12, -.58, .28], [-.76, .42, -.22, .09], [-.6, -.05, -.02, .24], [-.45, -.62, -.04, .14], [-.18, .3, .08, .12], [.12, .86, .2, .07], [.2, 1.3, .2, .07], [.35, 1.65, .05, .06], [.95, 1.86, -.22, .05], [1.5, 1.9, -.45, .04]], m: [3, 5, 7] },
    v2: { cor: VEN, pc: 'hv', P: [[-.8, -.55, -.65, .07], [-.8, .3, -.58, .07], [-.78, .95, -.55, .28], [-.76, .42, -.22, .09], [-.55, -.1, .02, .24], [-.42, -.55, -.03, .14], [-.2, .28, .1, .12], [.12, .86, .2, .07], [.2, 1.3, .2, .07], [.35, 1.65, .05, .06], [-.1, 1.75, -.45, .05], [-.9, 1.75, -.6, .05], [-1.5, 1.75, -.7, .04]], m: [3, 5, 7] },
    a1: { cor: ART, pc: 'ha', P: [[1.7, 1.35, -.55, .04], [.98, 1.2, -.55, .05], [.5, 1.12, -.62, .26], [.3, .58, -.24, .09], [.38, -.2, -.05, .2], [.62, -.95, -.05, .11], [.18, .12, -.08, .11], ...AORTA.slice(0)], m: [3, 5, 7] },
    a2: { cor: ART, pc: 'ha', P: [[-1.6, 1.3, -.95, .04], [-.4, 1.15, -.85, .05], [.42, 1.05, -.66, .26], [.3, .58, -.24, .09], [.32, -.3, -.04, .2], [.55, -1.0, -.04, .11], [.14, .18, -.08, .11], ...AORTA.slice(0)], m: [3, 5, 7] }
  };
  const VASOS = [
    ['cavas', VEN, [[-.85, 2.6, -.5, .17], [-.85, 1.95, -.5, .17], [-.82, 1.45, -.48, .16]]],
    ['cavas', VEN, [[-.8, -.65, -.65, .18], [-.8, .1, -.6, .18], [-.8, .62, -.52, .16]]],
    ['ap', VEN, [[.12, .8, .2, .16], [.2, 1.3, .2, .18], [.35, 1.65, .05, .17]]],
    ['ap', VEN, [[.35, 1.65, .05, .13], [.95, 1.86, -.22, .12], [1.55, 1.9, -.45, .11]]],
    ['ap', VEN, [[.35, 1.65, .05, .13], [-.1, 1.75, -.45, .12], [-.9, 1.75, -.6, .11], [-1.55, 1.75, -.7, .1]]],
    ['aorta', ART, AORTA.map((p, i) => [p[0], p[1], p[2], i === 0 ? .17 : i < 4 ? .2 : .18])],
    ['aorta', ART, [[-.08, 2.3, -.25, .08], [-.2, 2.65, -.25, .07], [-.28, 3.05, -.25, .07]]],
    ['aorta', ART, [[.18, 2.42, -.4, .07], [.2, 2.75, -.4, .065], [.22, 3.05, -.4, .06]]],
    ['aorta', ART, [[.42, 2.42, -.55, .07], [.55, 2.7, -.55, .065], [.72, 3.0, -.55, .06]]],
    ['vp', ART, [[1.7, 1.35, -.55, .09], [1.3, 1.28, -.55, .09], [.95, 1.2, -.55, .09]]],
    ['vp', ART, [[1.7, .85, -.62, .09], [1.3, .9, -.62, .09], [.95, .97, -.62, .09]]],
    ['vp', ART, [[-1.6, 1.3, -.95, .085], [-.4, 1.15, -.85, .085], [.08, 1.1, -.72, .085]]],
    ['vp', ART, [[-1.6, .88, -1.0, .085], [-.4, .95, -.92, .085], [.08, 1.0, -.74, .085]]]
  ];
  const VALVAS = [
    { pc: 'tric', c: TV, de: RA, para: RVc, r: .2, k: 3, av: 1, pap: PAP.tric },
    { pc: 'mitral', c: MV, de: LA, para: LVc, r: .18, k: 2, av: 1, pap: PAP.mitral },
    { pc: 'pulmv', c: PV, de: [-.18, .3, .08], para: [.2, 1.3, .2], r: .15, k: 3 },
    { pc: 'aortv', c: AV, de: [.18, .12, -.08], para: [-.2, 1.2, -.08], r: .16, k: 3 }
  ];
  // condução elétrica: átrios, nó AV, feixe no septo, ramos subindo pelas paredes
  const ELE = [[[-.95, 1.48, -.42], [-.55, 1.1, -.45], [-.42, .52, -.3]], [[-.42, .52, -.3], vw([-.08, .45, 0]), vw([-.08, -.9, 0]), vw([0, -1.32, 0]), vw([.82, -.5, 0]), vw([.95, .2, 0])], [vw([0, -1.32, 0]), vw([-.95, -.3, 0]), vw([-1.05, .3, 0])]];

  // ciclo: 0 a .12 sístole atrial; .15 a .47 sístole ventricular (tum no começo, tá no fim); depois diástole
  const ab = (u, a, b, r) => sst(a - r, a, u) * (1 - sst(b, b + r, u));
  function ciclo(u) {
    const sA = 1 - .09 * Math.sin(Math.PI * cl(u / .12, 0, 1)), vs = ab(u, .16, .46, .025), sV = 1 - .14 * Math.sin(Math.PI * cl((u - .15) / .32, 0, 1));
    return { sA, sV, avAb: 1 - ab(u, .15, .47, .02), slAb: ab(u, .18, .45, .025), sis: u > .15 && u < .47, vs };
  }

  function cavidade(g, c, r, cor, pc, pl, pai) {
    const m = new g.T.Mesh(V3.esfera(g, g.q.cel ? 24 : 34), V3.fis(g, cor, { p: { roughness: .92, clearcoat: 0, sheen: 0, envMapIntensity: .18 }, rimK: .05, planos: [pl], lados: true }));
    m.position.set(c[0], c[1], c[2]); m.scale.set(r[0], r[1], r[2]); m.userData.r = r.slice(); (pai || g.raiz).add(m);
    if (pc) { m.userData.peca = g.pecas[pc]; g.pick.push(m); } return m;
  }

  V3.anCena('circulatorio/coracao', {
    fit: 9, raio: 4.2, bolas: 260, pecas: PE,
    so2D: S => S.modo === 'fig' || S.modo === 'hem',
    rotulos: [{ pc: 've', t: 'ventrículo esquerdo', pr: 1 }, { pc: 'vd', t: 'ventrículo direito', pr: 1 }, { pc: 'ad', t: 'átrio direito', pr: 2 }, { pc: 'ae', t: 'átrio esquerdo', pr: 2 },
      { pc: 'aorta', t: 'aorta', pr: 3 }, { pc: 'ap', t: 'artéria pulmonar', pr: 3 }, { pc: 'cavas', t: 'veia cava', pr: 4 }, { pc: 'vp', t: 'veias pulmonares', pr: 4 },
      { pc: 'tric', t: 'tricúspide', pr: 5 }, { pc: 'mitral', t: 'mitral', pr: 5 }, { pc: 'septo', t: 'septo', pr: 6 }, { pc: 'sa', t: 'nó sinoatrial', pr: 2 }, { pc: 'furo', t: 'furo no septo', pr: 1 }],
    montar(g) {
      const T = g.T, nq = g.q.cel ? 28 : 40;
      g.pV = V3.corte(g, g.raiz, [0, 0, -1], .05); g.pA = V3.corte(g, g.raiz, [0, 0, -1], -.36);
      // ventrículos: sólido de revolução, achatado na frente e atrás, aberto pelo plano
      g.gV = new T.Group(); g.gV.rotation.z = RZ; g.gV.position.set(OFF[0], OFF[1], OFF[2]); g.raiz.add(g.gV);
      const perf = [[.001, -1.6], [.3, -1.5], [.66, -1.18], [.95, -.7], [1.13, -.18], [1.2, .25], [1.12, .55], [.86, .74], [.001, .8]];
      const mm = { p: { roughness: .58, sheen: .45, sheenColor: new T.Color('#FFD8DC') }, rim: '#FFB8C0', rimK: .28 };
      g.oV = V3.solido(g, V3.torno(g, perf, nq, 'an-vent'), MIO, [g.pV], { corte: MIOc, kc: 1, pai: g.gV, pc: 'mio', m: mm }); g.oV.scale.set(1, 1, .86);
      g.cLV = cavidade(g, [.38, -.25, -.02], [.33, .95, .34], CAVE, 've', g.pV, g.gV);
      g.cRV = cavidade(g, [-.6, 0, .05], [.37, .74, .42], CAVD, 'vd', g.pV, g.gV);
      g.cRO = cavidade(g, [-.3, .5, .12], [.24, .34, .26], CAVD, 'vd', g.pV, g.gV);   // via de saída do ventrículo direito
      g.cLO = cavidade(g, [0, .5, -.06], [.2, .32, .22], CAVE, 've', g.pV, g.gV);     // via de saída do ventrículo esquerdo
      g.cFuro = cavidade(g, [-.1, -.4, 0], [.24, .1, .3], '#5A3268', 'furo', g.pV, g.gV);
      // septo tocável: placa fina invisível no meio
      const sp = new T.Mesh(V3.esfera(g, 12), new T.MeshBasicMaterial({ visible: false })); sp.position.set(-.1, -.1, 0); sp.scale.set(.12, .9, .5); g.gV.add(sp); sp.userData.peca = g.pecas.septo; g.pick.push(sp); g.mats.push(sp.material);
      // átrios (mais atrás, abertos por outro plano)
      const oa = (c, r, pc) => { const s = V3.solido(g, V3.esfera(g, nq), MIO, [g.pA], { corte: MIOc, kc: 1, pc, m: mm }); s.position.set(c[0], c[1], c[2]); s.scale.set(r[0], r[1], r[2]); return s; };
      g.oRA = oa(RA, [.68, .6, .55], 'ad'); g.oLA = oa(LA, [.64, .52, .55], 'ae');
      g.cRA = cavidade(g, RA, [.55, .48, .44], CAVD, 'ad', g.pA); g.cLA = cavidade(g, LA, [.52, .4, .44], CAVE, 'ae', g.pA);
      // orifícios entre átrio e ventrículo
      g.oTV = cavidade(g, TV, [.26, .2, .22], CAVD, 'tric', g.pV); g.oMV = cavidade(g, MV, [.24, .2, .22], CAVE, 'mitral', g.pV);
      // vasos: películas translúcidas por onde se vê o sangue
      g.vasos = VASOS.map(([pc, cor, P]) => {
        const S = V3.suave(P, 8), t = V3.tubo(g, S.length, g.q.cel ? 12 : 16, V3.filme(g, cor, { cor2: '#FFE2E6', dentro: cor === ART ? '#5A1820' : '#2A2458', base: .26, fr: .62, esc: 3 }), null, pc);
        t.set(S.map(p => p.slice(0, 3)), (i, n) => S[Math.min(i, S.length - 1)][3]); t.mesh.renderOrder = 4; return t;
      });
      // valvas: anel (toro) e folhetos (elipsoides achatados)
      g.aneis = VALVAS.map(v => { const n = nrm(sub(v.para, v.de)), m = new T.Mesh(V3.toro(g, .1, 18), V3.fis(g, VAL, { p: { roughness: .5 }, rimK: .2 })); m.position.set(...v.c); m.scale.setScalar(v.r); m.quaternion.setFromUnitVectors(new T.Vector3(0, 0, 1), new T.Vector3(...n)); g.raiz.add(m); m.userData.peca = g.pecas[v.pc]; g.pick.push(m); v.n = n; v.e1 = V3.perp(n); v.e2 = cross(n, v.e1); return m; });
      g.rod = V3.inst(g, V3.cilindro(g, 6), V3.fis(g, VAL, { p: { roughness: .5 }, rimK: .15 }), 80); g.pick.push(g.rod.m);
      g.H = V3.hemacias(g, 84, 'hv');
      // estado das hemácias: fração ao longo da trilha
      g.tr = Object.keys(TR).map(k => { const o = TR[k], S = V3.suave(o.P, 7), F = V3.fracoes(S), f = i => F[o.m[i] * 7]; return { o, S, F, fAV: f(0), fAP: f(1), fSL: f(2), n: g.q.cel ? 12 : 17, f: null }; });
      g.tr.forEach(t => { t.f = []; for (let i = 0; i < t.n; i++) t.f.push(fr(i / t.n + hash(i, 11) * .03)); });
      g.eleS = ELE.map(P => { const S = V3.suave(P, 8); return { S, F: V3.fracoes(S) }; });
      g.ph0 = null;
    },
    animar(g, P) {
      const S = P.S, t = P.t, info = g.pecas, rv = !RED(), furo = S.modo === 'furo' ? S.v : 0;
      const u = rv ? fr(t) : .62, c = ciclo(u);
      // batimento: cavidades encolhem na sístole (átrios primeiro, depois ventrículos)
      const esc = (m, k) => { const r = m.userData.r; m.scale.set(r[0] * k, r[1] * k, r[2] * k); };
      esc(g.cLV, c.sV); esc(g.cRV, c.sV); esc(g.cRO, mix(1, c.sV, .6)); esc(g.cLO, mix(1, c.sV, .6)); esc(g.cRA, c.sA); esc(g.cLA, c.sA);
      g.oV.scale.set(1 - (1 - c.sV) * .12, 1 - (1 - c.sV) * .06, .86 * (1 - (1 - c.sV) * .12));
      g.cFuro.visible = furo > 0; if (furo) { const k = .35 + .25 * furo; g.cFuro.scale.set(.24 * k * 1.6, .1 * k * 1.8, .3); }
      // valvas
      VALVAS.forEach(v => {
        const ab2 = v.av ? c.avAb : c.slAb, L = v.r * 1.02, w = v.r * Math.sin(Math.PI / v.k) * 1.15, pc = info[v.pc];
        for (let i = 0; i < v.k; i++) {
          const a = i / v.k * TAU + .4, rad = add(mul(v.e1, Math.cos(a)), mul(v.e2, Math.sin(a))), h = add(v.c, mul(rad, v.r));
          const fechado = nrm(add(mul(rad, -1), mul(v.n, v.av ? -.18 : .22))), aberto = nrm(add(v.n, mul(rad, .3))), d = nrm(lerp3(fechado, aberto, ab2));
          const ponta = add(h, mul(d, L)), q = V3.base(g, cross(v.n, rad), d);
          V3.put(g, g.mS, add(h, mul(d, L / 2)), q, w, L / 2, .028, VAL, 1, pc);
          if (v.pap) { const pp = v.pap[i % v.pap.length]; V3.bastao(g, g.rod, ponta, pp, .009, VAL, .95, info.cordas); V3.bola(g, pp, .07, MIO, .9, info.ve.nome && v.pc === 'tric' ? info.vd : info.ve); }
        }
      });
      ach(g, 'tric', add(TV, [-.15, -.05, .1])); ach(g, 'mitral', add(MV, [.15, -.05, .1]));
      ach(g, 've', vw([.55, -.55, .05])); ach(g, 'vd', vw([-.62, -.2, .1])); ach(g, 'ad', add(RA, [-.2, .1, .2])); ach(g, 'ae', add(LA, [.25, .1, .2]));
      ach(g, 'aorta', [-.2, 1.6, -.08]); ach(g, 'ap', [.25, 1.4, .25]); ach(g, 'cavas', [-.85, 2.2, -.5]); ach(g, 'vp', [1.45, 1.32, -.55]); ach(g, 'septo', vw([-.1, -.75, .06]));
      // sangue: avança só quando a valva da frente está aberta
      let dph = 0; if (g.ph0 == null) g.ph0 = t; else { dph = cl(t - g.ph0, 0, .2); g.ph0 = t; } if (!rv || S.paused) dph = 0;
      let hi = 0;
      g.tr.forEach((tr, ti) => {
        const art = tr.o.cor === ART;
        for (let i = 0; i < tr.n; i++) {
          let f = tr.f[i], v;
          if (f < tr.fAV) { v = c.avAb > .5 ? .9 : .1; f = Math.min(f + v * dph, c.avAb > .5 ? 1 : tr.fAV - .004 - hash(i, 5) * .07); }
          else if (f < tr.fSL) { if (c.slAb > .5) v = 1.7; else v = f < tr.fAP ? .75 : 0; const lim = tr.fAP - hash(i, 6) * (tr.fAP - tr.fAV) * .8; f += v * dph; if (c.slAb <= .5 && f > lim && f - v * dph <= lim) f = lim; }
          else { v = c.slAb > .5 ? 1.25 : .22; f += v * dph; }
          if (f >= 1) f -= 1; tr.f[i] = f;
          const p = V3.em(tr.S, tr.F, f), sp = p[3], a = hash(i + ti * 31, 1) * TAU, b = hash(i + ti * 31, 2) * 2 - 1;
          const pos = add([p[0], p[1], p[2]], [Math.cos(a) * sp * Math.sqrt(1 - b * b), b * sp * .8, Math.sin(a) * sp * .7]);
          let cor = tr.o.cor; if (art && furo && f > tr.fAV - .05) cor = V3.corMix(ART, VEN, furo * .17);
          V3.put(g, g.H, pos, V3.giro(g, i + ti * 40, t * 2), .085, .085, .085, cor, 1, info[art ? 'ha' : 'hv']);
          if (!hi && f > tr.fAV + .02 && f < tr.fAP) { hi = 1; ach(g, art ? 'ha' : 'hv', pos); }
        }
      });
      // furo: sangue venoso passando para o lado esquerdo e se misturando
      if (furo) {
        const A = vw([-.42, -.4, .02]), B = vw([.22, -.4, .02]);
        for (let i = 0; i < 2 + furo * 2; i++) { const f = fr((rv ? t * .6 : 0) + i / (2 + furo * 2)); V3.put(g, g.H, lerp3(A, B, f), V3.giro(g, i + 300, t * 2), .08, .08, .08, V3.corMix(VEN, ART, f * .6), 1, info.furo); }
        ach(g, 'furo', vw([-.1, -.4, .06]));
        V3.ficha(g, [.9, 1.0, -.9], `O₂ para o corpo: cerca de ${Math.round(100 - 17 * furo)}%`, furo > 1 ? AM : ART, { pr: 1, dx: 1, dy: 0 });
      }
      V3.fim(g.H); V3.fim(g.rod);
      // pulso elétrico
      if (S.ele) {
        const pe = rv ? u : .2; V3.brilho(g, ELE[0][0], .07 + .04 * Math.max(0, 1 - pe * 8), AM, 1.2); ach(g, 'sa', ELE[0][0]);
        const tram = [[0, .12], [.13, .3], [.22, .3]];
        g.eleS.forEach((e, k) => { const [a, b] = tram[k], q = cl((pe - a) / (b - a), 0, 1); if (q <= 0 || pe > b + .12) return; for (let j = 0; j < 7; j++) { const f = q - j * .035; if (f < 0) break; const p = V3.em(e.S, e.F, f); V3.brilho(g, p, .045 * (1 - j / 8), AM, 1.3 - j * .12); } });
      }
      if (rv && Math.abs(u - .17) < .05) V3.ficha(g, add(TV, [-.5, -.1, 0]), 'tum', AM, { pr: 1, dy: 0, dx: -1 });
      if (rv && Math.abs(u - .48) < .05) V3.ficha(g, add(PV, [.3, .2, 0]), 'tá', AM, { pr: 1, dy: 0, dx: 1 });
      V3.ficha(g, vw([-1.0, -1.3, 0]), c.sis ? 'sístole' : 'diástole', c.sis ? AM : '#C9D3E6', { pr: 2, dy: 0, dx: -1 });
    },
    camera(g, P) {
      const d = V3.deitado(g);
      return V3.anCam(g, P, d ? 2.1 : 1.75, d ? 2.15 : 2.6, { al: [0, .5, -.2], th: .32, fi: .1 });
    }
  });
})();
