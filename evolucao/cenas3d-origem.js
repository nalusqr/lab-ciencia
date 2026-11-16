/* LAB Origem da vida e evolução: cenas 3D da origem da vida (Martin), sobre o kit do módulo Vírus (vir3d.js), as peças da
   Anatomia (anat3d-pecas.js) e as deste módulo (evo3d-pecas.js).
   Aparelho de Miller e Urey: balão de água fervendo, balão de gases com dois eletrodos e faíscas, condensador e coletor em U que
   escurece; as moléculas simples dão a volta no circuito e saem das faíscas como aminoácidos.
   Endossimbiose: célula grande que envolve uma bactéria aeróbia (vira mitocôndria, com DNA circular, ribossomos e divisão própria)
   e depois uma cianobactéria (vira cloroplasto).
   O ar do planeta: a Terra gira enquanto a régua do tempo anda de cerca de 4,6 bilhões de anos até hoje; a superfície esfria, os
   oceanos aparecem, as cianobactérias liberam gás oxigênio e o céu muda de cor. O tempo de cada processo é o mesmo do desenho plano,
   que continua escondido cuidando da legenda e dos botões. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.anCena) return;
  const { cl, seg, sst, add, sub, mul, nrm, lerp3, fr, hash, TAU } = V3.V;
  const RED = () => V3.REDUZ(), ach = V3.ach, cm = V3.corMix;
  const GL = '#CFE0FF';
  const vidro = (g, o) => V3.filme(g, GL, Object.assign({ cor2: '#FFFFFF', dentro: '#0E1A30', base: .04, fr: .5, esc: 2.4 }, o || {}));
  const malha = (g, geo, mat, pc, p, s) => { const m = V3.peca(g, geo, mat, pc); if (p) m.position.set(p[0], p[1], p[2]); if (s) Array.isArray(s) ? m.scale.set(s[0], s[1], s[2]) : m.scale.setScalar(s); return m; };
  const orienta = (g, m, a, b, r) => { const d = sub(b, a), L = Math.hypot(d[0], d[1], d[2]); m.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2); m.quaternion.copy(V3.qy(g, d)); m.scale.set(r, L, r); return m; };

  // ================= Miller e Urey (origem/hipoteses, modo Aparelho de Miller) =================
  const MOLS = [['ch4', '#9AA3B2'], ['nh3', '#7CA6FF'], ['h2', '#E8EDF7'], ['h2o', '#2A9FC9']];
  const PM = {
    agua: { nome: 'Água fervendo', frase: 'Faz o papel do oceano primitivo: o vapor sobe e leva água para a mistura de gases.', cor: '#2A9FC9' },
    gases: { nome: 'Mistura de gases', frase: 'Metano, amônia, hidrogênio e vapor de água, a atmosfera primitiva que Miller e Urey supuseram em 1953, sem gás oxigênio.', cor: GL },
    faisca: { nome: 'Faíscas elétricas', frase: 'Descargas entre os dois eletrodos imitam os raios: a energia que quebra as moléculas simples e permite que se juntem em outras.', cor: '#F7C13B' },
    eletrodo: { nome: 'Eletrodo', frase: 'Ponta de metal por onde passa a descarga elétrica.', cor: '#C9CED8' },
    condensador: { nome: 'Condensador', frase: 'Água fria corre por fora do tubo e resfria o vapor, que volta a ser líquido, como a chuva.', cor: '#2A9FC9' },
    coletor: { nome: 'Coletor', frase: 'Acumula o líquido. Cerca de uma semana depois ele estava escuro, com aminoácidos como a glicina e a alanina.', cor: '#E6C86A' },
    tubo: { nome: 'Tubos de vidro', frase: 'O sistema é fechado: nada entra nem sai, e a mistura dá voltas pelo circuito.', cor: GL },
    ch4: { nome: 'Metano (CH₄)', frase: 'Molécula simples de carbono e hidrogênio, um dos gases da mistura.', cor: '#9AA3B2' },
    nh3: { nome: 'Amônia (NH₃)', frase: 'Fonte de nitrogênio, o átomo que aparece no grupo amina dos aminoácidos.', cor: '#7CA6FF' },
    h2: { nome: 'Hidrogênio (H₂)', frase: 'Gás que deixa a mistura redutora, sem gás oxigênio para degradar as moléculas orgânicas.', cor: '#E8EDF7' },
    h2o: { nome: 'Vapor de água (H₂O)', frase: 'Sai do balão que ferve, passa pelas faíscas e volta como líquido no condensador.', cor: '#2A9FC9' },
    aa: { nome: 'Aminoácido', frase: 'Molécula orgânica formada a partir das simples. É a unidade que forma as proteínas.', cor: '#FFE1A6' }
  };
  const B0 = [-2.4, -1.25, 0], RB = .85, SP = [.7, 1.25, 0], RS = 1.15;
  const T1 = [[-2.4, -.42, 0], [-2.4, .55, 0], [-2.32, 1.02, 0], [-2.0, 1.2, 0], [-1.1, 1.22, 0], [-.44, 1.24, 0]];
  const T2 = [[1.83, 1.12, 0], [2.3, 1.06, 0], [2.58, .8, 0], [2.6, .2, 0], [2.6, -.9, 0], [2.6, -1.55, 0], [2.42, -2.0, 0], [1.98, -2.16, 0], [1.54, -2.02, 0], [1.36, -1.6, 0], [1.3, -1.36, 0], [.8, -1.3, 0], [-.4, -1.29, 0], [-1.57, -1.27, 0]];
  const UB = [[2.6, -1.62, 0], [2.42, -2.0, 0], [1.98, -2.16, 0], [1.54, -2.02, 0], [1.36, -1.62, 0]];

  V3.anCena('origem/hipoteses', {
    fit: 9, raio: 5, bolas: 320, pecas: PM,
    so2D: S => S.modo !== 'miller',
    rotulos: [{ pc: 'agua', t: 'água fervendo', pr: 1 }, { pc: 'faisca', t: 'faíscas', pr: 1 }, { pc: 'gases', t: 'gases sem oxigênio', pr: 2 }, { pc: 'condensador', t: 'condensador', pr: 3 }, { pc: 'coletor', t: 'coletor', pr: 1 }, { pc: 'aa', t: 'aminoácido', pr: 2 },
      { pc: 'ch4', t: 'CH₄', pr: 4 }, { pc: 'nh3', t: 'NH₃', pr: 4 }, { pc: 'h2', t: 'H₂', pr: 5 }, { pc: 'h2o', t: 'H₂O', pr: 5 }],
    montar(g) {
      const T = g.T, rad = g.q.cel ? 12 : 18, n = g.q.cel ? 32 : 44;
      malha(g, V3.esfera(g, n), vidro(g), 'agua', B0, RB).renderOrder = 6;
      const ag = new T.SphereGeometry(1, n, n >> 1, 0, TAU, Math.PI * .52, Math.PI * .48); g.geos.push(ag);
      const ma = V3.filme(g, '#2A9FC9', { cor2: '#9FE3F5', dentro: '#1B5F80', base: .34, fr: .45, esc: 2 });
      malha(g, ag, ma, 'agua', B0, RB * .95).renderOrder = 4;
      const tp = new T.Mesh(new T.CircleGeometry(RB * .94 * Math.sin(Math.PI * .52), n), ma); g.geos.push(tp.geometry); tp.rotation.x = -Math.PI / 2; tp.position.set(B0[0], B0[1] - RB * .95 * Math.cos(Math.PI * .52) + .01, 0); g.raiz.add(tp); tp.renderOrder = 4;
      malha(g, V3.esfera(g, n), vidro(g), 'gases', SP, RS).renderOrder = 7;
      // eletrodos de metal
      const me = V3.fis(g, '#C9CED8', { p: { metalness: .55, roughness: .3, clearcoat: .6 } });
      g.E1 = [SP[0] - .26, SP[1] + .05, 0]; g.E2 = [SP[0] + .26, SP[1] + .05, 0];
      orienta(g, malha(g, V3.cilindro(g, 12), me, 'eletrodo'), [SP[0] - 1.05, SP[1] + 1.05, 0], g.E1, .035);
      orienta(g, malha(g, V3.cilindro(g, 12), me, 'eletrodo'), [SP[0] + 1.05, SP[1] + 1.05, 0], g.E2, .035);
      // tubos de vidro do circuito
      [T1, T2].forEach(P0 => { const P = V3.suave(P0, 4), tb = V3.tubo(g, P.length, rad, vidro(g, { base: .07, fr: .6 }), null, 'tubo'); tb.set(P, .1); tb.mesh.renderOrder = 5; });
      // condensador: camisa de água fria
      orienta(g, malha(g, V3.cilindro(g, 24), V3.filme(g, '#2A9FC9', { cor2: '#BDEBFF', dentro: '#12304A', base: .1, fr: .55, esc: 2 }), 'condensador'), [2.6, .45, 0], [2.6, -.95, 0], .3).renderOrder = 6;
      // líquido no fundo do U (a cor muda com o tempo)
      g.liqMat = V3.fis(g, '#E8F0FF', { p: { roughness: .25, clearcoat: .8, transparent: true, opacity: .85 } });
      const LQ = V3.suave(UB, 6), lq = V3.tubo(g, LQ.length, rad, g.liqMat, null, 'coletor'); lq.set(LQ, .072); g.LQ = LQ; g.LQF = V3.fracoes(LQ);
      // faísca: tubo emissivo que muda de forma
      g.spk = V3.tubo(g, 9, 6, V3.emis(g, '#FFE7A0', 3), null, 'faisca');
      // caminho das moléculas (passa por dentro dos balões)
      g.LP = V3.suave([B0, ...T1, SP, ...T2, B0], 3); g.LPF = V3.fracoes(g.LP);
      const ds = g.LP.map(q => Math.hypot(q[0] - SP[0], q[1] - SP[1])); g.fS = g.LPF[ds.indexOf(Math.min(...ds))];
      g.fU = g.LPF[g.LP.findIndex(q => q[1] < -1.9)];
      g.aa = V3.inst(g, V3.esfera(g, 12), V3.fis(g, '#FFFFFF', { p: { roughness: .35, clearcoat: .7 } }), 120, null, g.pecas.aa); g.pick.push(g.aa.m);
    },
    animar(g, P) {
      const S = P.S, l = lt(S), p = ciclo(l, 10), rv = !RED(), t = P.t, info = g.pecas;
      // fervura: bolhas e calor embaixo do balão
      for (let i = 0; i < 6; i++) { const k = rv ? fr(t * .7 + i / 6) : .5, x = B0[0] + (hash(i, 2) - .5) * RB, z = (hash(i, 3) - .5) * RB * .8; V3.bola(g, [x, B0[1] - RB * .75 + k * RB * .7, z], .035 * (1 - k * .4), '#E8F6FF', 1.1, info.agua); }
      V3.brilho(g, [B0[0], B0[1] - RB - .16, 0], .13 + (rv ? .02 * Math.sin(t * 9) : 0), '#FF8A3C', .9);
      ach(g, 'agua', [B0[0] + .3, B0[1] - .35, .5]);
      // faísca: acende em pulsos (no modo reduzido fica parada, acesa)
      const on = !rv || fr(l * 2.5) < .55;
      if (on) {
        const K = rv ? Math.floor(l * 2.5) : 3, pts = [g.E1];
        for (let i = 1; i < 8; i++) pts.push(add(lerp3(g.E1, g.E2, i / 8), [0, (hash(K, i) - .5) * .22, (hash(K, i + 9) - .5) * .18]));
        pts.push(g.E2); g.spk.set(pts, .02); V3.brilho(g, lerp3(g.E1, g.E2, .5), .07, '#FFF3C4', 1.4);
      } else g.spk.mesh.visible = false;
      ach(g, 'faisca', add(lerp3(g.E1, g.E2, .5), [0, -.08, 0])); ach(g, 'gases', [SP[0] + .55, SP[1] + .65, .4]); ach(g, 'condensador', [2.6, -.25, .3]); ach(g, 'tubo', T1[2]);
      // coletor: de transparente a amarelo e depois marrom-escuro
      const k = seg(p, .15, .95), cor = cm('#E8F0FF', cm('#E6C86A', '#7A4A24', seg(p, .5, 1)), seg(p, .05, .5));
      g.liqMat.color.set(cor); ach(g, 'coletor', g.LQ[g.LQ.length >> 1]);
      // aminoácidos acumulados no fundo do U (glicina simplificada: carbono central, amina e carboxila)
      const nA = Math.round(k * 9);
      for (let i = 0; i < nA; i++) { const c = add(V3.em(g.LQ, g.LQF, .1 + .8 * (i + .5) / 9), [0, .02, (hash(i, 4) - .5) * .06]); V3.put(g, g.aa, c, null, .045, null, null, '#FFE1A6', 1, info.aa); }
      // moléculas dando a volta no circuito
      let vistos = {};
      for (let i = 0; i < 16; i++) {
        const f = fr((rv ? l * .06 : 0) + i / 16), q = V3.em(g.LP, g.LPF, f), m = MOLS[i % 4];
        const virou = f > g.fS && f < .985 && i % 3 === 0 && p > .12;
        if (virou) {
          V3.put(g, g.aa, q, null, .06, null, null, '#FFE1A6', 1, info.aa);
          V3.put(g, g.aa, add(q, [.07, .045, 0]), null, .038, null, null, '#4D7DFF', 1, info.aa);
          V3.put(g, g.aa, add(q, [-.07, .04, .02]), null, .038, null, null, '#FF4D4D', 1, info.aa);
          if (!vistos.aa && f > g.fU - .02) { ach(g, 'aa', q); vistos.aa = 1; }
          continue;
        }
        V3.bola(g, q, .055, m[1], 1, info[m[0]]);
        if (!vistos[m[0]] && f > .02 && f < g.fS) { ach(g, m[0], q); vistos[m[0]] = 1; }
      }
      V3.fim(g.aa);
      if (k > .3) V3.ficha(g, [1.95, -2.35, .2], 'aminoácidos no coletor', '#FFE1A6', { pr: 2, dy: 1 });
      V3.ficha(g, [SP[0], SP[1] + RS + .15, 0], 'sem gás oxigênio', '#E8EDF7', { pr: 3 });
    },
    camera(g, P) { const d = V3.deitado(g); return V3.anCam(g, P, d ? 3.5 : 3.2, d ? 2.9 : 3.1, { al: [.1, -.3, 0], th: .18, fi: .12, viva: .4 }); }
  });

  // ================= Primeiras células: endossimbiose e o ar do planeta (origem/primeiras-celulas) =================
  const VI = '#9A6BFF', MI = '#F25C3B', VE = '#3FBF6A', VEE = '#2A9450', RO = '#F06AAE';
  const PROVAS = [['duas membranas', .34], ['DNA próprio e circular', .46], ['ribossomos de bactéria', .52], ['divisão própria', .6]];
  const PE = {
    host: { nome: 'Célula hospedeira', frase: 'Célula grande, já com núcleo, que engloba outras células por fagocitose.', cor: RO },
    nucleo: { nome: 'Núcleo', frase: 'Guarda o DNA da célula hospedeira, separado do citoplasma por um envelope.', cor: VI },
    bact: { nome: 'Bactéria aeróbia', frase: 'Usa o gás oxigênio para liberar energia. Englobada e não digerida, vira a mitocôndria.', cor: VI },
    mito: { nome: 'Mitocôndria', frase: 'Faz a respiração celular. Tem duas membranas, DNA circular, ribossomos parecidos com os das bactérias e se divide sozinha.', cor: MI },
    ciano: { nome: 'Cianobactéria', frase: 'Bactéria que faz fotossíntese. Englobada depois, numa linhagem que já tinha mitocôndrias, vira o cloroplasto.', cor: VE },
    cloro: { nome: 'Cloroplasto', frase: 'Faz a fotossíntese nas algas e plantas. Também tem duas membranas e DNA próprio e circular.', cor: VE },
    vesic: { nome: 'Membrana de fora', frase: 'Vem da membrana da célula hospedeira, que envolveu a bactéria. A de dentro é a da própria bactéria.', cor: RO },
    dna: { nome: 'DNA circular', frase: 'Igual ao das bactérias e diferente do DNA do núcleo, que fica em cromossomos lineares.', cor: VI },
    ribo: { nome: 'Ribossomos', frase: 'Os da mitocôndria e do cloroplasto são menores, parecidos com os das bactérias.', cor: '#FFE1A6' },
    terra: { nome: 'Terra', frase: 'Formada há cerca de 4,6 bilhões de anos. Os primeiros sinais de vida em rochas têm cerca de 3,8 a 3,5 bilhões de anos.', cor: '#2A9FC9' },
    atm: { nome: 'Atmosfera', frase: 'No começo, sem gás oxigênio. Ele se acumula a partir de cerca de 2,4 bilhões de anos, liberado pela fotossíntese das cianobactérias.', cor: '#7FB8E8' },
    lava: { nome: 'Vulcões e rocha derretida', frase: 'A Terra jovem era muito quente, com impactos e vulcões; a crosta e os oceanos se formam ao esfriar.', cor: '#FF6A2A' },
    estro: { nome: 'Estromatólitos', frase: 'Camadas de rocha feitas por comunidades de bactérias em águas rasas. Os mais antigos têm cerca de 3,5 bilhões de anos.', cor: '#A98B5C' }
  };
  const O2G = ga => ga > 2.4 ? 0 : ga > .8 ? .1 : ga > .6 ? .35 : ga > .4 ? .6 : 1;
  const SEQ = [['heterotrófica', ['fermentação', 'fotossíntese', 'respiração aeróbia']], ['autotrófica', ['quimiossíntese', 'fotossíntese', 'respiração aeróbia']]];
  const M1 = [1.05, -.4, .35], C1 = [-1.05, -.7, -.15], NU = [-.35, .55, -.1];

  // organela com duas membranas: casca translúcida (membrana de fora), corpo de dentro, cristas ou tilacoides, DNA circular e ribossomos
  function organela(g, cor, cor2, pc) {
    const T = g.T, gr = new T.Group(), cap = V3.capsula(g, 1, .9, g.q.cel ? 16 : 22);
    const fora = new T.Mesh(cap, V3.filme(g, RO, { cor2: '#FFD6EA', dentro: '#3A1830', base: .06, fr: .6, esc: 3 })); fora.scale.setScalar(1.22); fora.renderOrder = 8; gr.add(fora);
    const mat = V3.fis(g, cor, { p: { roughness: .45, clearcoat: .4, transparent: true, opacity: .55, depthWrite: false }, rimK: .4 });
    const dentro = new T.Mesh(cap, mat); dentro.renderOrder = 7; gr.add(dentro);
    const plac = []; for (let i = 0; i < 5; i++) { const c = new T.Mesh(V3.cilindro(g, 14), V3.fis(g, cor2, { p: { roughness: .5 } })); c.scale.set(.62, .08, .62); c.position.y = -1.1 + i * .55; gr.add(c); plac.push(c); }
    const dna = new T.Mesh(V3.toro(g, .12, 18), V3.fis(g, VI, { p: { roughness: .4, clearcoat: .6 } })); dna.scale.setScalar(.32); dna.position.set(.25, .9, .2); dna.rotation.x = 1.1; gr.add(dna);
    const ribos = []; for (let i = 0; i < 4; i++) { const r = new T.Mesh(V3.esfera(g, 10), V3.fis(g, '#FFE1A6')); r.scale.setScalar(.09); r.position.set(-.35 + (i % 2) * .5, -.2 + i * .35, .45); gr.add(r); ribos.push(r); }
    [fora, dentro, dna, ...plac, ...ribos].forEach(o => { o.userData.peca = o === fora ? g.pecas.vesic : o === dna ? g.pecas.dna : ribos.includes(o) ? g.pecas.ribo : g.pecas[pc]; g.pick.push(o); });
    g.raiz.add(gr); return { gr, fora, dentro, mat, plac, dna, ribos };
  }
  function planeta(g, ga) {
    const ox = O2G(ga), A = g.terra.geometry, rg = V3.evRgb, mx = V3.evMixRgb;
    const mar = mx(rg('#173A5E'), rg('#1F5E9A'), ox), solo = mx(rg('#5A4632'), rg('#7A4A32'), ga < 2.4 ? 1 : 0), verde = rg('#3E7A3A');
    const derr = ga > 3.9 ? cl((ga - 3.9) / .7, 0, 1) : 0, plantas = ga < .5 ? cl((.5 - ga) / .45, 0, 1) : 0, gelo = rg('#E8EDF7');
    V3.evPinta(A, (x, y, z) => {
      const nn = V3.V.vnoise(x * 1.7 + 3, y * 1.7, z * 1.7) * .7 + V3.V.vnoise(x * 4.1, y * 4.1 + 2, z * 4.1) * .3, terra = nn > .54;
      if (derr > 0) { const lava = V3.V.vnoise(x * 5, y * 5, z * 5) > .62; return mx(mx(rg('#2E1E1A'), rg('#FF6A2A'), lava ? .9 : 0), terra ? solo : mar, 1 - derr); }
      let c = terra ? mx(solo, verde, plantas * cl((nn - .54) * 8, 0, 1)) : mx(mar, rg('#2A9FC9'), cl((nn - .46) * 10, 0, 1) * .5);
      if (Math.abs(y) > .9) c = mx(c, gelo, (Math.abs(y) - .9) * 8);
      return c;
    });
  }

  V3.anCena('origem/primeiras-celulas', {
    fit: 9, raio: 5, bolas: 260, pecas: PE,
    sair() { V3.anEsconde('endo'); V3.limpa2D(); },
    rotulos: [{ pc: 'host', t: 'célula hospedeira', pr: 2, se: g => g.modo === 'endo' }, { pc: 'nucleo', t: 'núcleo', pr: 3, se: g => g.modo === 'endo' }, { pc: 'bact', t: 'bactéria aeróbia', pr: 1, se: g => g.modo === 'endo' },
      { pc: 'mito', t: 'mitocôndria', pr: 1, se: g => g.modo === 'endo' }, { pc: 'ciano', t: 'cianobactéria', pr: 1, se: g => g.modo === 'endo' }, { pc: 'cloro', t: 'cloroplasto', pr: 1, se: g => g.modo === 'endo' },
      { pc: 'terra', t: 'Terra', pr: 3, se: g => g.modo === 'ar' }, { pc: 'atm', t: 'atmosfera', pr: 2, se: g => g.modo === 'ar' }],
    montar(g) {
      const T = g.T, n = g.q.cel ? 36 : 52;
      // ---- endossimbiose ----
      g.Eg = new T.Group(); g.raiz.add(g.Eg);
      const host = new T.Mesh(V3.celGeo(g), V3.filme(g, RO, { cor2: '#FFD6EA', dentro: '#2A1E3D', base: .05, fr: .6, esc: .9 })); host.scale.set(2.5, 1.9, 1.7); host.renderOrder = 3; g.Eg.add(host); host.userData.peca = g.pecas.host; g.pick.push(host);
      const cito = new T.Mesh(V3.esfera(g, n), V3.filme(g, '#6A4C9C', { cor2: '#2C1D44', dentro: '#2A1E3D', base: .12, fr: .05, esc: .6 })); cito.scale.set(2.35, 1.78, 1.58); cito.renderOrder = 1; g.Eg.add(cito);
      const nuc = new T.Mesh(V3.esfera(g, n), V3.fis(g, VI, { p: { roughness: .5, clearcoat: .4 }, rimK: .35 })); nuc.position.set(...NU); nuc.scale.setScalar(.55); g.Eg.add(nuc); nuc.userData.peca = g.pecas.nucleo; g.pick.push(nuc);
      const env = new T.Mesh(V3.esfera(g, n), V3.filme(g, VI, { cor2: '#E6DAFF', dentro: '#2A1E50', base: .05, fr: .55 })); env.position.set(...NU); env.scale.setScalar(.66); env.renderOrder = 4; g.Eg.add(env); env.userData.peca = g.pecas.nucleo; g.pick.push(env);
      g.mA = organela(g, MI, '#FF9A6B', 'mito'); g.mB = organela(g, MI, '#FF9A6B', 'mito'); g.cA = organela(g, VE, VEE, 'cloro');
      [g.mA, g.mB, g.cA].forEach(o => { g.raiz.remove(o.gr); g.Eg.add(o.gr); });
      g.rib = V3.inst(g, V3.esfera(g, 8), V3.fis(g, '#FFE1A6'), 40, g.Eg, g.pecas.ribo);
      // ---- planeta ----
      g.Pl = new T.Group(); g.raiz.add(g.Pl);
      const pm = new T.MeshPhysicalMaterial({ color: '#FFFFFF', roughness: .72, clearcoat: .25, clearcoatRoughness: .5 }); g.mats.push(pm);
      g.terra = V3.evCorVert(g, new T.SphereGeometry(1.25, g.q.cel ? 72 : 112, g.q.cel ? 48 : 72), pm); g.Pl.add(g.terra); g.terra.userData.peca = g.pecas.terra; g.pick.push(g.terra);
      g.atmM = V3.filme(g, '#C9783A', { cor2: '#FFE0C0', dentro: '#0B0F1C', base: 0, fr: .6, esc: 1, frente: true }); g.atm = new T.Mesh(V3.esfera(g, n), g.atmM); g.atm.scale.setScalar(1.36); g.atm.renderOrder = 5; g.Pl.add(g.atm); g.atm.userData.peca = g.pecas.atm; g.pick.push(g.atm);
      g.balde = -1;
    },
    animar(g, P) {
      const S = P.S, rv = !RED(), t = P.t, info = g.pecas; g.modo = S.modo;
      const endo = S.modo === 'endo'; g.Eg.visible = endo; g.Pl.visible = !endo;
      V3.anBotoes('endo', PROVAS.map(([s, k], i) => ({ t: s, d: 'Prova: ' + s, on: () => V3.evAperta(g, 'v' + i), pr: S2 => ciclo(lt(S2), 12) >= k })), S, endo, 'Provas da endossimbiose');
      if (endo) return animarEndo(g, S, rv, t, info);
      // ---- o ar do planeta ----
      const ga = 4.6 - S.v, b = Math.round(ga * 20);
      if (b !== g.balde) { g.balde = b; planeta(g, ga); g.atmM.uniforms.uC.value.set(cm('#C9783A', '#6FB2FF', O2G(ga))); g.atmM.uniforms.uOp.value = ga > 3.9 ? .55 : 1; }
      g.terra.rotation.y = rv ? t * .08 : .6; g.terra.rotation.z = .41;
      ach(g, 'terra', [-.55, -.7, .9]); ach(g, 'atm', [.95, 1.0, .2]);
      if (ga > 3.85) for (let i = 0; i < 7; i++) { const d = nrm([hash(i, 1) - .5, hash(i, 2) - .5, .55 + hash(i, 3) * .4]); V3.brilho(g, mul(d, 1.26), .04 + (rv ? .015 * Math.sin(t * 3 + i) : 0), '#FF7A3A', 1.2); if (!i) ach(g, 'lava', mul(d, 1.3)); }
      if (ga <= 3.5) for (let i = 0; i < 9; i++) { const d = nrm([-.9 + i * .08, -.25 + hash(i, 5) * .2, .55 + hash(i, 6) * .2]); V3.bola(g, mul(d, 1.26), .045, '#A98B5C', 1, info.estro); if (i === 4) ach(g, 'estro', mul(d, 1.3)); }
      if (ga <= 3.0) V3.ficha(g, [-1.3, -.2, .8], 'cianobactérias', VE, { pr: 3, dx: -1, dy: 0 });
      if (ga <= 2.4) V3.ficha(g, [1.4, .6, .3], 'gás oxigênio no ar', '#7FB8E8', { pr: 1, dx: 1, dy: 0 });
      if (ga <= 2.0) V3.ficha(g, [1.3, -.5, .5], 'células eucarióticas', VE, { pr: 4, dx: 1, dy: 0 });
      if (ga <= .6) V3.ficha(g, [-1.25, .55, .6], ga <= .45 ? 'plantas em terra firme' : 'multicelulares no mar', VEE, { pr: 2, dx: -1, dy: 0 });
      if (ga > 3.85) V3.ficha(g, [-1.3, .4, .7], 'vulcões e rocha derretida', '#FF8A5C', { pr: 2, dx: -1, dy: 0 });
      else if (ga > 3.5) V3.ficha(g, [-1.3, .4, .7], 'oceanos e primeiras células', '#2A9FC9', { pr: 2, dx: -1, dy: 0 });
      else if (ga > 3.0) V3.ficha(g, [-1.3, .4, .7], 'estromatólitos', '#C9B48A', { pr: 2, dx: -1, dy: 0 });
    },
    sobre(g, S) {
      if (S.modo !== 'ar') return;
      const A = area(), ga = 4.6 - S.v, wide = !NAR;
      reguaGeo(A.x0, A.y0 + 14, A.w, ga); V3.reserva(g, [A.x0, A.y0 - 6, A.w, 60]);
      // sequência de metabolismos da hipótese escolhida (a mesma do desenho plano)
      const sq = SEQ[S.hip || 0], al = [ga >= 3.0, ga < 3.0 && ga >= 2.4, ga < 2.4], by = A.y1 - 30, bw = wide ? Math.min(170, (A.w - 170) / 3) : (A.w - 16) / 3;
      const x0 = wide ? A.x0 + 150 : A.x0;
      if (wide) tx(`hipótese ${sq[0]}`, A.x0, by + 13, { a: 'left', s: 12, c: C.amber, bg: false });
      sq[1].forEach((s, i) => { const x = x0 + i * (bw + 8); rr(x, by, bw, 26, 8, al[i] ? rgba(C.amber, .22) : 'rgba(19,26,43,.85)', al[i] ? C.amber : C.line, al[i] ? 2 : 1.2); tx(s, x + bw / 2, by + 13, { s: 12, w: 600, c: al[i] ? C.txt : C.dim, bg: false }); });
      V3.reserva(g, [A.x0, by - 4, A.w, 34]);
      // medidor do gás oxigênio
      const o = O2G(ga), mw = wide ? 150 : 110, mx0 = A.x1 - mw, my = A.y0 + 66;
      rr(mx0, my, mw, 38, 8, 'rgba(11,15,28,.82)', C.line, 1); tx('gás oxigênio no ar', mx0 + 8, my + 11, { a: 'left', s: 12, c: C.dim, bg: false });
      rr(mx0 + 8, my + 21, mw - 16, 9, 4, 'rgba(19,26,43,1)', null); if (o > 0) rr(mx0 + 8, my + 21, (mw - 16) * o, 9, 4, '#7FB8E8', null);
      V3.reserva(g, [mx0, my, mw, 38]);
    },
    camera(g, P) {
      const d = V3.deitado(g);
      if (P.S.modo === 'ar') return V3.anCam(g, P, d ? 2.3 : 1.8, d ? 2.2 : 2.6, { al: [0, -.05, 0], th: .2, fi: .1, viva: .3 });
      return V3.anCam(g, P, d ? 3.6 : 2.9, d ? 2.4 : 3.0, { al: [d ? -.5 : 0, -.15, 0], th: .22, fi: .16, viva: .5 });
    }
  });

  function animarEndo(g, S, rv, t, info) {
    const l = lt(S), p = ciclo(l, 12);
    const e1 = seg(p, .08, .3), m1 = seg(p, .4, .55), e2 = seg(p, .68, .86), c2 = seg(p, .86, 1), dv = seg(p, .6, .7);
    // ribossomos da hospedeira
    for (let i = 0; i < 30; i++) { const d = nrm([hash(i, 1) - .5, hash(i, 2) - .5, hash(i, 3) - .5]), r = .5 + hash(i, 4) * .9; V3.put(g, g.rib, [d[0] * r * 1.7, d[1] * r * 1.3, d[2] * r * 1.1], null, .05, null, null, '#FFE1A6', 1, info.ribo); }
    V3.fim(g.rib);
    ach(g, 'host', [-1.7, -1.1, .9]); ach(g, 'nucleo', add(NU, [0, .45, .3]));
    // 1ª rodada: bactéria aeróbia vira mitocôndria
    const far1 = [4.2, -1.4, .9], a = seg(p, 0, .08), bp = p < .08 ? add(far1, [.6 * (1 - a), .3 * (1 - a), 0]) : lerp3(far1, M1, sst(0, 1, e1));
    const o1 = g.mA, cor1 = cm(VI, MI, m1), mito = p >= .4;
    o1.gr.position.set(...(p < .4 ? bp : M1)); o1.gr.rotation.set(.3, .4, 1.25 + (rv ? Math.sin(t * .7) * .05 : 0));
    const sc1 = .26 * (1 + .15 * m1); o1.gr.scale.setScalar(sc1);
    o1.mat.color.set(cor1); o1.mat.opacity = mito ? .5 : .85;
    o1.fora.visible = p >= .2; o1.fora.scale.setScalar(1.22 * (p >= .3 ? 1 : sst(.2, .3, p)));
    o1.plac.forEach(c => { c.visible = m1 > .3; c.scale.set(.62 * m1, .08, .62 * m1); });
    o1.dna.visible = p >= .46 || !mito; o1.ribos.forEach(r => { r.visible = p >= .52 || !mito; });
    [o1.dentro, ...o1.plac].forEach(o => { o.userData.peca = mito ? info.mito : info.bact; });
    const q1 = mito ? M1 : bp; ach(g, mito ? 'mito' : 'bact', add(q1, [.1, .35, .2]));
    // divisão: uma segunda mitocôndria se separa
    const o2 = g.mB; o2.gr.visible = p >= .6;
    if (o2.gr.visible) { const k = sst(0, 1, dv); o2.gr.position.set(...lerp3(M1, add(M1, [-.15, .62, .25]), k)); o2.gr.rotation.set(.3, .4, 1.25 + k * .5); o2.gr.scale.setScalar(sc1 * (.75 + .25 * k)); o2.mat.color.set(MI); o2.mat.opacity = .5; o2.fora.scale.setScalar(1.22); o2.plac.forEach(c => c.scale.set(.62, .08, .62)); }
    // provas acesas, ao lado da mitocôndria
    PROVAS.forEach(([s, k], i) => { if (p >= k) V3.ficha(g, add(M1, [.55, .35 - i * .26, .3]), s, '#3FBF6A', { pr: 3 + i, dx: 1, dy: 0 }); });
    // 2ª rodada: cianobactéria vira cloroplasto
    const o3 = g.cA, far2 = [-4.3, -1.6, -.5], v2 = p >= .6;
    o3.gr.visible = v2;
    if (v2) {
      const kk = seg(p, .6, .68) * .3 + sst(0, 1, e2) * .7, cp = lerp3(add(far2, [-.4, .2, 0]), C1, kk), cloro = p >= .86;
      o3.gr.position.set(...cp); o3.gr.rotation.set(.2, -.3, 1.45);
      o3.gr.scale.set(.27 * (1 + .25 * c2), .27 * (1 + .45 * c2), .27 * (1 + .1 * c2)); o3.mat.color.set(cm(VE, '#7FD99A', c2 * .5)); o3.mat.opacity = cloro ? .45 : .85;
      o3.fora.visible = e2 > .4; o3.fora.scale.setScalar(1.22 * sst(.4, .7, e2) + .001);
      o3.plac.forEach(c => { c.visible = c2 > .2; c.scale.set(.55 * c2, .1, .55 * c2); });
      o3.dna.visible = !cloro || c2 > .5; o3.ribos.forEach(r => { r.visible = !cloro || c2 > .7; });
      [o3.dentro, ...o3.plac].forEach(o => { o.userData.peca = cloro ? info.cloro : info.ciano; });
      ach(g, cloro ? 'cloro' : 'ciano', add(cp, [-.2, .38, .2]));
    }
  }
})();
