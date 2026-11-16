/* LAB Histologia: cenas 3D do tecido nervoso (Martin). Neurônio com volume, mielina e o sinal correndo dos dendritos aos
   terminais; as formas de neurônio; a glia em volta de um capilar e a célula de Schwann enrolando a mielina; o impulso
   correndo no axônio em sincronia com o gráfico da voltagem, saltando de nodo em nodo na fibra com mielina; e a sinapse
   em corte, com vesículas que se fundem e soltam o neurotransmissor. Usa o kit histo3d.js; a cena 2D antiga é o plano B. */
'use strict';
(function () {
  const H3 = window.HIS3D; if (!H3) return;
  const { V, K } = H3, { cl, mix, seg, sst, TAU, hash, add, sub, mul, nrm, fr, lerp3, trilha } = V;
  const cam = (g, P, hx, hy, o = {}) => H3.viva({ th: o.th == null ? .3 : o.th, fi: o.fi == null ? .2 : o.fi, d: H3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .6 : o.viva);
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const RED = () => H3.REDUZ();
  const NEU = '#B48CF0', NEUc = '#D9C2FF', MIEL = '#F2F5FA', NA = '#FF9A3C', KK = '#B9A3FF', NT = '#5CE6A0', CA = '#7FD8FF', GLIA = '#8FCB8A';

  // árvore de dendritos: ramos (polilinhas) a partir de uma direção
  function arvore(org, dir, comp, nivel, sem, out) {
    const P = [org]; let p = org, d = nrm(dir);
    for (let i = 1; i <= 8; i++) { const w = [hash(sem, i) - .5, hash(sem, i + 9) - .5, (hash(sem, i + 17) - .5) * .7]; d = nrm(add(d, mul(w, .5))); p = add(p, mul(d, comp / 8)); P.push(p); }
    out.push({ P, r: .07 * Math.pow(.62, 3 - nivel), n: nivel });
    if (nivel > 1) { const a = P[4], b = P[8]; arvore(a, add(d, [hash(sem, 41) - .5, hash(sem, 42) - .5, 0]), comp * .6, nivel - 1, sem * 3 + 1, out); arvore(b, add(d, [hash(sem, 43) - .5, hash(sem, 44) - .5, 0]), comp * .55, nivel - 1, sem * 3 + 2, out); }
    return out;
  }
  // neurônio multipolar montado em grupo: corpo, núcleo, dendritos, axônio com mielina e terminais
  function neuronio(g, pai, o = {}) {
    const T = g.T, gr = new T.Group(); pai.add(gr);
    const mN = H3.fis(g, o.cor || NEU, { p: { roughness: .42, sheen: .7, sheenColor: new T.Color('#F0E0FF'), clearcoat: .4 }, rim: '#E6D2FF', rimK: .4 });
    const soma = H3.peca(g, H3.lumpy(g, 'soma', 51, 4, 5, .14, .4, .8), mN, o.pc ? 'corpo' : null, gr); soma.scale.setScalar(.42);
    const ram = []; const dirs = o.dirs || [[-1, .6, 0], [-1, -.5, .3], [-.3, 1, -.2], [-.2, -1, .2], [-.8, .1, -.8]];
    dirs.forEach((d, i) => arvore(mul(nrm(d), .3), d, o.comp || 1.4, o.niv || 3, 7 + i * 13, ram));
    const dend = ram.map(r => { const tb = H3.tubo(g, r.P.length, 8, mN, gr, o.pc ? 'dend' : null); tb.set(r.P, (i, n) => r.r * (1.25 - .55 * i / (n - 1))); return tb; });
    return { gr, soma, ram, dend, mN };
  }

  // =====================================================================================
  // O NEURÔNIO
  // =====================================================================================
  const PN = {
    dend: { nome: 'Dendritos', frase: 'Ramos curtos que recebem os sinais de outras células e os levam ao corpo celular.', cor: NEU },
    corpo: { nome: 'Corpo celular', frase: 'Tem o núcleo e a maior parte das organelas; junta os sinais que chegam.', cor: NEU },
    nuc: { nome: 'Núcleo', frase: 'Guarda o DNA; o neurônio maduro quase não se divide.', cor: K.nucleo },
    axo: { nome: 'Axônio', frase: 'Prolongamento único e longo que leva o impulso para longe do corpo celular.', cor: NEUc },
    miel: { nome: 'Bainha de mielina', frase: 'Camadas de membrana enroladas (Schwann no SNP, oligodendrócito no SNC): isolam e aceleram o impulso.', cor: MIEL },
    nodo: { nome: 'Nodo de Ranvier', frase: 'Intervalo sem mielina: o impulso salta de um nodo ao outro (condução saltatória).', cor: '#FFD27A' },
    term: { nome: 'Terminais do axônio', frase: 'Botões que liberam neurotransmissores na sinapse.', cor: NT },
    imp: { nome: 'Impulso nervoso', frase: 'Corre dos dendritos ao corpo celular, e daí pelo axônio até os terminais.', cor: '#FFE7A3' }
  };
  H3.cena('nervoso/neuronio', {
    fit: 16, raio: 7, bolas: 120,
    pecas: PN,
    rotulos: [{ pc: 'dend', t: 'dendritos', pr: 1 }, { pc: 'corpo', t: 'corpo celular', pr: 2 }, { pc: 'nuc', t: 'núcleo', pr: 6 }, { pc: 'axo', t: 'axônio', pr: 3 }, { pc: 'miel', t: 'bainha de mielina', pr: 4 }, { pc: 'nodo', t: 'nodo de Ranvier', pr: 7 }, { pc: 'term', t: 'terminais do axônio', pr: 5 }],
    so2D: S => S.view === 2,
    montar(g) {
      const T = g.T;
      g.G = new T.Group(); g.raiz.add(g.G);
      g.n = neuronio(g, g.G, { pc: 1 });
      g.nuc = H3.peca(g, H3.esfera(g, 24), H3.fis(g, K.nucleo, { p: { roughness: .35, clearcoat: .7 } }), 'nuc', g.G); g.nuc.scale.setScalar(.17); g.nuc.position.set(.08, .05, .26);
      g.nucl = H3.peca(g, H3.esfera(g, 12), H3.fis(g, '#3A2470', { p: { roughness: .4 } }), 'nuc', g.G); g.nucl.scale.setScalar(.05); g.nucl.position.set(.12, .09, .41);
      // axônio
      g.AX = []; for (let i = 0; i < 40; i++) { const u = i / 39; g.AX.push([.35 + u * 5.2, Math.sin(u * 3.2) * .25 - u * .2, Math.sin(u * 2.1) * .15]); }
      g.ax = H3.tubo(g, 40, 10, g.n.mN, g.G, 'axo'); g.ax.set(g.AX, (i, n) => i < 3 ? .12 - i * .02 : .06);
      g.mie = H3.inst(g, H3.capsula(g, .5, .8, 18), H3.fis(g, MIEL, { p: { roughness: .3, clearcoat: .8, clearcoatRoughness: .2, sheen: .5 }, rim: '#FFFFFF', rimK: .3 }), 10, g.G, g.pecas.miel); g.pick.push(g.mie.m);
      g.nod = H3.inst(g, H3.toro(g, .3, 16), H3.fis(g, '#FFD27A', { p: { roughness: .4 } }), 10, g.G, g.pecas.nodo); g.pick.push(g.nod.m);
      // terminais
      const fim = g.AX[39]; g.ter = [];
      for (let k = 0; k < 5; k++) { const d = [1, (k - 2) * .45, (hash(k, 3) - .5) * .5], P = []; for (let i = 0; i < 8; i++) { const u = i / 7; P.push(add(fim, [d[0] * u * .7, d[1] * u * .7 + Math.sin(u * 3 + k) * .05, d[2] * u * .7])); } const tb = H3.tubo(g, 8, 6, g.n.mN, g.G, 'term'); tb.set(P, .035); g.ter.push(P); }
      g.bot = H3.inst(g, H3.esfera(g, 16), H3.fis(g, NT, { p: { roughness: .35, clearcoat: .6 } }), 5, g.G, g.pecas.term); g.pick.push(g.bot.m);
      // formas: bipolar e pseudounipolar (o multipolar é o próprio neurônio, menor)
      g.F = new T.Group(); g.raiz.add(g.F);
      const mF = H3.fis(g, NEU, { p: { roughness: .42, sheen: .7 }, rim: '#E6D2FF', rimK: .4 });
      g.fb = new T.Group(); g.F.add(g.fb); g.fp = new T.Group(); g.F.add(g.fp);
      const so = (pai) => { const s = H3.peca(g, H3.lumpy(g, 'somaB', 53, 3, 3, .1, .5, .9), mF, 'corpo', pai); s.scale.set(.3, .22, .22); const n = H3.peca(g, H3.esfera(g, 16), H3.fis(g, K.nucleo, { p: { roughness: .4 } }), 'nuc', pai); n.scale.setScalar(.11); n.position.z = .14; return s; };
      so(g.fb); [[-1, 0], [1, 0]].forEach(([s]) => { const P = []; for (let i = 0; i < 12; i++) { const u = i / 11; P.push([s * (.25 + u * 1.5), Math.sin(u * 4) * .08 * s, 0]); } H3.tubo(g, 12, 8, mF, g.fb, s < 0 ? 'dend' : 'axo').set(P, (i, n) => .06 - .03 * i / n); });
      so(g.fp); { const P = [[0, -.2, 0], [0, -.45, 0], [0, -.7, 0]]; H3.tubo(g, 3, 8, mF, g.fp, 'axo').set(P, .05); [[-1], [1]].forEach(([s]) => { const Q = []; for (let i = 0; i < 12; i++) { const u = i / 11; Q.push([s * u * 1.7, -.7 - Math.sin(u * 3) * .05, 0]); } H3.tubo(g, 12, 8, mF, g.fp, s < 0 ? 'dend' : 'axo').set(Q, .05); }); }
      g.fm = new T.Group(); g.F.add(g.fm); g.nm = neuronio(g, g.fm, { comp: .9, niv: 2 });
      { const P = []; for (let i = 0; i < 12; i++) { const u = i / 11; P.push([.3 + u * 1.6, -u * .1, 0]); } H3.tubo(g, 12, 8, g.nm.mN, g.fm, 'axo').set(P, .05); }
    },
    animar(g, P) {
      const S = P.S, t = P.t, lar = H3.deitado(g), formas = S.view === 1;
      g.G.visible = !formas; g.F.visible = formas; g.formas = formas;
      if (formas) {
        g.fm.position.set(lar ? -3.2 : 0, lar ? 0 : 2.1, 0); g.fb.position.set(lar ? .3 : 0, lar ? 0 : 0, 0); g.fp.position.set(lar ? 3.5 : 0, lar ? .3 : -1.9, 0);
        [g.fm, g.fb, g.fp].forEach((o, i) => { o.scale.setScalar(lar ? 1 : .8); o.rotation.y = RED() ? 0 : Math.sin(t * .3 + i) * .25; });
        const L = ['multipolar: muitos dendritos e um axônio', 'bipolar: um dendrito e um axônio', 'pseudounipolar: um prolongamento que se divide em T'];
        [g.fm, g.fb, g.fp].forEach((o, i) => { const p = H3.mundo(g, o, [i === 0 ? -.5 : 0, i === 2 ? -1.05 : -.95, 0]); H3.texto(g, p, NAR ? L[i].split(':')[0] : L[i], { s: 13, w: 700, c: C.txt, dy: 6 }); });
        H3.texto(g, H3.mundo(g, g.fp, [0, .5, 0]), 'neurônio sensitivo', { s: 12, w: 600, c: C.dim, dy: -4 });
        return;
      }
      g.G.position.set(lar ? -1.6 : -1.15, lar ? 0 : .1, 0); g.G.scale.setScalar(lar ? 1 : .62); g.G.rotation.set(0, RED() ? -.25 : -.25 + Math.sin(t * .15) * .2, lar ? 0 : -1.05);
      // mielina em segmentos, com nodos entre eles
      const seg0 = .1, segL = .145;
      for (let k = 0; k < 6; k++) { const u0 = seg0 + k * segL, u1 = u0 + segL * .86, a = trilha(g.AX, u0), b = trilha(g.AX, u1); H3.put(g, g.mie, mul(add(a, b), .5), H3.qy(g, sub(b, a)), .14, V.len(sub(b, a)) * .34, .14, MIEL, 1, g.pecas.miel); if (k) H3.put(g, g.nod, trilha(g.AX, u0 - segL * .07), H3.qy(g, sub(b, a)), .075, .075, .075, '#FFD27A', 1, g.pecas.nodo); }
      H3.fim(g.mie); H3.fim(g.nod);
      g.ter.forEach((P0, k) => H3.put(g, g.bot, P0[7], null, .08, .08, .08, NT, 1, g.pecas.term)); H3.fim(g.bot);
      // impulso: pontos de luz dos dendritos ao corpo, depois saltos de nodo em nodo até os terminais
      const ciclo = 3.2, f = RED() ? .55 : fr(t / ciclo);
      if (f < .3) { g.n.ram.filter(r => r.n === 3).forEach(r => { const q = 1 - f / .3; H3.brilho(g, H3.mundo(g, g.G, trilha(r.P, q)), .07, '#FFE7A3', 1.6); }); }
      else if (f < .4) H3.brilho(g, H3.mundo(g, g.G, [0, 0, 0]), .3 * Math.sin((f - .3) / .1 * Math.PI), '#FFE7A3', 1.2);
      else if (f < .9) { const q = (f - .4) / .5, k = Math.min(5, Math.floor(q * 6)), u = seg0 + k * segL - segL * .07; H3.brilho(g, H3.mundo(g, g.G, trilha(g.AX, cl(u, 0, 1))), .12, '#FFE7A3', 1.7); }
      else g.ter.forEach(P0 => H3.brilho(g, H3.mundo(g, g.G, P0[7]), .1 * Math.sin((f - .9) / .1 * Math.PI), NT, 1.6));
      const w = p => H3.mundo(g, g.G, p);
      ach(g, 'dend', w(trilha(g.n.ram[0].P, .7))); ach(g, 'corpo', w([-.05, .38, 0])); ach(g, 'nuc', w([.1, .05, .4])); ach(g, 'axo', w(trilha(g.AX, .05)));
      ach(g, 'miel', w(add(trilha(g.AX, seg0 + segL * 2.5), [0, .15, 0]))); ach(g, 'nodo', w(trilha(g.AX, seg0 + segL * 4 - segL * .07))); ach(g, 'term', w(g.ter[3][7]));
    },
    camera(g, P) {
      const lar = H3.deitado(g);
      if (g.formas) return lar ? cam(g, P, 5.4, 1.8, { th: 0, fi: .1, al: [0, -.1, 0], viva: .3 }) : cam(g, P, 2.2, 3.4, { th: 0, fi: .1, al: [0, .1, 0], viva: .3 });
      return lar ? cam(g, P, 5.5, 2.3, { th: .2, fi: .2, al: [.8, -.05, 0], k: 1.02 }) : cam(g, P, 2.3, 3.5, { th: .2, fi: .2, al: [0, -.3, 0], k: 1.04 });
    }
  });

  // =====================================================================================
  // GLIA E MIELINA
  // =====================================================================================
  const PG = {
    cap: { nome: 'Capilar', frase: 'Os pés dos astrócitos o envolvem e ajudam a formar a barreira hematoencefálica.', cor: K.sangue },
    astro: { nome: 'Astrócito', frase: 'Célula em estrela: sustenta os neurônios, leva nutrientes do sangue até eles e ajuda a formar a barreira hematoencefálica.', cor: GLIA },
    oligo: { nome: 'Oligodendrócito', frase: 'Forma a mielina no SNC; um só oligodendrócito envolve trechos de vários axônios.', cor: '#7FC6E8' },
    micro: { nome: 'Micróglia', frase: 'Defesa do SNC: engloba restos de células e microrganismos (fagocitose).', cor: '#F2C46B' },
    epen: { nome: 'Células ependimárias', frase: 'Revestem os ventrículos e o canal da medula; com cílios, ajudam a mover o líquor.', cor: '#E9A7C0' },
    neu: { nome: 'Neurônio', frase: 'Recebe dos astrócitos nutrientes vindos do sangue.', cor: NEU },
    miel: { nome: 'Bainha de mielina', frase: 'Camadas de membrana enroladas em volta do axônio.', cor: MIEL },
    schw: { nome: 'Célula de Schwann', frase: 'Forma a mielina no SNP; cada uma envolve um trecho de um só axônio, enrolando a própria membrana.', cor: '#7FC6E8' },
    axo: { nome: 'Axônio', frase: 'Prolongamento do neurônio que a mielina envolve.', cor: NEUc }
  };
  H3.cena('nervoso/glia', {
    fit: 16, raio: 7, bolas: 160,
    pecas: PG,
    rotulos: [{ pc: 'cap', t: 'capilar', pr: 5 }, { pc: 'astro', t: 'astrócito', pr: 1 }, { pc: 'oligo', t: 'oligodendrócito', pr: 2 }, { pc: 'micro', t: 'micróglia', pr: 3 }, { pc: 'epen', t: 'células ependimárias', pr: 4 }, { pc: 'neu', t: 'neurônio', pr: 6 }, { pc: 'schw', t: 'célula de Schwann', pr: 1 }, { pc: 'axo', t: 'axônio', pr: 2 }, { pc: 'miel', t: 'bainha de mielina', pr: 3 }],
    so2D: S => S.view === 2,
    montar(g) {
      const T = g.T;
      g.B = new T.Group(); g.raiz.add(g.B);
      g.vaso = H3.vaso(g, [[-3.6, .2, -.6], [-1.5, .35, -.5], [.5, .2, -.4], [2.4, .35, -.5], [3.8, .25, -.6]], .26, { pai: g.B, pc: 'cap', n: 14, vel: .05, base: .3 });
      const mA = H3.fis(g, GLIA, { p: { roughness: .45, sheen: .6, sheenColor: new T.Color('#E8FFE0') }, rim: '#D8FFD0', rimK: .35 });
      g.as = H3.peca(g, H3.lumpy(g, 'astro', 61, 3, 6, .2, .3, .6), mA, 'astro', g.B); g.as.scale.setScalar(.3); g.as.position.set(-1.2, -.75, -.1);
      g.asP = []; for (let i = 0; i < 9; i++) g.asP.push(H3.tubo(g, 10, 6, mA, g.B, 'astro'));
      g.pes = H3.inst(g, H3.esfera(g, 14), mA, 9, g.B, g.pecas.astro); g.pick.push(g.pes.m);
      g.neu = [neuronio(g, g.B, { comp: .8, niv: 2, dirs: [[-1, .5, 0], [-.4, 1, .2], [-.6, -1, 0], [1, .8, 0]] }), neuronio(g, g.B, { comp: .7, niv: 2, dirs: [[1, .6, 0], [.4, -1, .2], [-1, -.2, 0]] })];
      g.neu.forEach(n => { n.soma.userData.peca = g.pecas.neu; g.pick.push(n.soma); n.gr.scale.setScalar(.55); });
      g.neu[0].gr.position.set(.6, -1.3, -.3); g.neu[1].gr.position.set(-2.9, -1.5, -.6);
      // oligodendrócito com três axônios mielinizados
      const mO = H3.fis(g, '#7FC6E8', { p: { roughness: .45, sheen: .6 }, rim: '#D0F0FF', rimK: .35 });
      g.ol = H3.peca(g, H3.lumpy(g, 'olig', 63, 3, 3, .1, .4, .8), mO, 'oligo', g.B); g.ol.scale.setScalar(.24); g.ol.position.set(2.4, -.9, 0);
      g.axs = [-1.75, -1.15, -.55].map((y, i) => { const P = [[1.2, y - .1, -.6 + i * .5], [4.2, y + .1, -.6 + i * .5]]; H3.tubo(g, 2, 8, H3.fis(g, NEUc, { p: { roughness: .4 } }), g.B, 'neu').set(P, .045); return P; });
      g.olP = []; for (let i = 0; i < 3; i++) g.olP.push(H3.tubo(g, 10, 6, mO, g.B, 'oligo'));
      g.mie = H3.inst(g, H3.capsula(g, .5, .8, 16), H3.fis(g, MIEL, { p: { roughness: .3, clearcoat: .8 } }), 9, g.B, g.pecas.miel); g.pick.push(g.mie.m);
      // micróglia com resto de célula
      g.mi = H3.peca(g, H3.lumpy(g, 'micro', 65, 3, 7, .25, .2, .5), H3.fis(g, '#F2C46B', { p: { roughness: .5, sheen: .5 } }), 'micro', g.B); g.mi.scale.setScalar(.2);
      g.miP = []; for (let i = 0; i < 6; i++) g.miP.push(H3.tubo(g, 8, 5, g.mi.material, g.B, 'micro'));
      // ependimárias com cílios (parede do ventrículo, embaixo)
      g.ep = H3.celulas(g, 24, { nucleo: true, pai: g.B, pc: 'epen' });
      g.cil = H3.inst(g, H3.cilindro(g, 6), H3.fis(g, '#F4D0DE', { p: { roughness: .4 } }), 120, g.B, g.pecas.epen);
      // Schwann: axônio com a célula enrolando a membrana
      g.Sw = new T.Group(); g.raiz.add(g.Sw);
      g.swA = H3.peca(g, H3.cilindro(g, 24), H3.fis(g, NEUc, { p: { roughness: .4, clearcoat: .5 } }), 'axo', g.Sw); g.swA.rotation.z = Math.PI / 2; g.swA.scale.set(.3, 7, .3);
      g.swPl = H3.corte(g, g.Sw, [0, 0, -1], 0);
      g.swL = []; for (let i = 0; i < 6; i++) g.swL.push(H3.solido(g, H3.cilindro(g, 40), i % 2 ? '#EEF4FA' : '#DCE8F5', [g.swPl], { pai: g.Sw, pc: 'miel', corte: i % 2 ? '#F7FAFF' : '#C9D8EC', m: { p: { roughness: .35, clearcoat: .6 } } }));
      g.swC = H3.solido(g, H3.cilindro(g, 40), '#7FC6E8', [g.swPl], { pai: g.Sw, pc: 'schw', corte: '#A8DCF2', m: { p: { roughness: .45, sheen: .6 } } });
      g.swN = H3.peca(g, H3.esfera(g, 20), H3.fis(g, K.nucleo, { p: { roughness: .4 } }), 'schw', g.Sw); g.swN.scale.set(.5, .16, .22);
      g.swL.concat([g.swC]).forEach(s => s.rotation.z = Math.PI / 2);
      g.swNx = H3.inst(g, H3.toro(g, .25, 16), H3.fis(g, '#FFD27A', { p: { roughness: .4 } }), 2, g.Sw);
    },
    animar(g, P) {
      const S = P.S, t = P.t, lar = H3.deitado(g), sw = S.view === 1;
      g.B.visible = !sw; g.Sw.visible = sw; g.sw = sw;
      if (sw) {
        g.Sw.position.set(0, lar ? 0 : 0, 0); g.Sw.scale.setScalar(lar ? 1 : .62); g.Sw.rotation.set(.15, RED() ? -.5 : -.5 + Math.sin(t * .2) * .2, lar ? 0 : 0);
        // enrola: as camadas crescem uma a uma em volta do axônio
        const f = RED() ? 1 : sst(0, 1, fr(t / 9) * 1.25), nL = f * 6;
        g.swL.forEach((s, i) => { const k = cl(nL - i, 0, 1), r = .32 + (i + 1) * .085; s.visible = k > .02; s.scale.set(r, 2.6 * (.4 + .6 * k), r); });
        const rc = .32 + (Math.ceil(nL) + 1) * .085 + .06; g.swC.scale.set(rc, 2.7, rc); g.swN.position.set(0, rc + .05, 0);
        [-1.48, 1.48].forEach(x => H3.put(g, g.swNx, [x, 0, 0], H3.qy(g, [1, 0, 0]), .33, .33, .33, '#FFD27A', 1)); H3.fim(g.swNx);
        ach(g, 'schw', H3.mundo(g, g.Sw, [-.4, rc, 0])); ach(g, 'axo', H3.mundo(g, g.Sw, [-2.6, .3, 0])); if (nL > 1) ach(g, 'miel', H3.mundo(g, g.Sw, [.9, .32 + .085 * Math.min(nL, 6), 0]));
        H3.texto(g, H3.mundo(g, g.Sw, [-1.48, -.9, 0]), 'nodo de Ranvier', { s: 12, w: 600, c: C.dim });
        return;
      }
      g.B.position.set(0, lar ? .55 : .5, 0); g.B.scale.setScalar(lar ? 1 : .8); g.B.rotation.set(0, RED() ? 0 : Math.sin(t * .12) * .12, lar ? 0 : 0);
      g.vaso.set(t);
      // astrócito: processos até o capilar (pés) e até os neurônios
      const as = g.as.position.toArray(), alvos = [];
      for (let i = 0; i < 5; i++) { const x = -2.4 + i * .55; alvos.push([trilha(g.vaso.P, (x + 3.6) / 7.4), true]); }
      alvos.push([[.55, -1.25, -.3], false], [[-2.85, -1.45, -.6], false], [[-1.8, -1.6, .2], false], [[-.5, -1.7, .3], false]);
      alvos.forEach(([a, pe], i) => { const b = pe ? add(a, [0, -.22, .05]) : a, m = add(lerp3(as, b, .5), [0, .15 * (hash(i, 1) - .5), .2 * (hash(i, 2) - .5)]); g.asP[i].set([as, lerp3(as, m, .5), m, lerp3(m, b, .5), b], (j, n) => .05 - .025 * j / (n - 1)); H3.put(g, g.pes, b, null, pe ? .1 : .06, pe ? .05 : .06, pe ? .1 : .06, GLIA, 1, g.pecas.astro); });
      H3.fim(g.pes);
      // nutrientes: do capilar, pelos pés, até os neurônios
      for (let j = 0; j < 8; j++) { const f = RED() ? j / 8 : fr(t * .18 + j / 8), i = j % 5, a = add(trilha(g.vaso.P, (-2.4 + i * .55 + 3.6) / 7.4), [0, -.22, .05]), b = alvos[5 + (j % 2)][0]; const p = f < .5 ? lerp3(a, as, f * 2) : lerp3(as, b, (f - .5) * 2); H3.brilho(g, H3.mundo(g, g.B, p), .03, '#FFE7A3', 1.3); }
      // oligodendrócito: um processo para cada axônio, mielina em dois trechos
      const ol = g.ol.position.toArray();
      g.axs.forEach((A, i) => { const x = 2.5 + (i - 1) * .35, alvo = [x, mix(A[0][1], A[1][1], (x - 1.2) / 3), A[0][2]]; g.olP[i].set([ol, lerp3(ol, alvo, .5), alvo], .03);
        [x - .45, x + .45, x + 1.35].forEach((cx, k) => { if (k === 2 && i === 1) return; const y = mix(A[0][1], A[1][1], (cx - 1.2) / 3); H3.put(g, g.mie, [cx, y, A[0][2]], H3.qy(g, [1, .066, 0]), .1, .19, .1, MIEL, 1, g.pecas.miel); }); });
      H3.fim(g.mie);
      // micróglia: patrulha e engloba um resto de célula
      const mp = [-.25 + (RED() ? 0 : Math.sin(t * .4) * .1), .95, .3]; g.mi.position.set(...mp);
      g.miP.forEach((tb, i) => { const a = i / 6 * TAU + (RED() ? 0 : Math.sin(t * .8 + i) * .2), b = add(mp, [Math.cos(a) * .55, Math.sin(a) * .45, (hash(i, 3) - .5) * .4]); tb.set([mp, lerp3(mp, b, .4), add(lerp3(mp, b, .7), [0, .05, 0]), b], .02); });
      const eng = RED() ? .6 : fr(t / 6); H3.bola(g, H3.mundo(g, g.B, add(mp, [mix(.42, .05, sst(0, .6, eng)), .1, .12])), .07 * (1 - sst(.7, 1, eng)), '#8A6A5A', 1, g.pecas.micro);
      // ependimárias com cílios batendo
      for (let i = 0; i < 14; i++) { const x = -3.4 + i * .5, y = -2.15; H3.celula(g, g.ep, [x, y, .1], .25, '#E9A7C0', { f: [1, 1.2, 1], n: .38, pc: g.pecas.epen }); for (let m = 0; m < 4; m++) { const bx = x + (m - 1.5) * .09, an = RED() ? .2 : .5 * Math.sin(t * 6 - bx * 2), a = [bx, y - .27, .1 + (m % 2) * .08], b = [bx + Math.sin(an) * .2, y - .27 - Math.cos(an) * .2, a[2]]; H3.bastao(g, g.cil, a, b, .012, '#F4D0DE', 1, g.pecas.epen); } }
      H3.fimCel(g.ep); H3.fim(g.cil);
      const w = p => H3.mundo(g, g.B, p);
      ach(g, 'cap', w(trilha(g.vaso.P, .85))); ach(g, 'astro', w(add(as, [0, .25, .1]))); ach(g, 'oligo', w(add(ol, [0, .22, .1]))); ach(g, 'micro', w(add(mp, [0, .25, .1]))); ach(g, 'epen', w([2.4, -1.95, .3])); ach(g, 'neu', w([.6, -1.15, -.1]));
    },
    camera(g, P) {
      const lar = H3.deitado(g);
      if (g.sw) return lar ? cam(g, P, 3.6, 1.6, { th: .4, fi: .22, al: [0, .1, 0], k: 1.02 }) : cam(g, P, 2.3, 2.6, { th: .4, fi: .22, al: [0, .1, 0], k: 1.05 });
      return lar ? cam(g, P, 4.3, 2.55, { th: .1, fi: .14, al: [0, -.3, 0], k: 1.02 }) : cam(g, P, 2.75, 3.0, { th: .1, fi: .14, al: [0, .1, 0], k: 1.0 });
    }
  });

  // =====================================================================================
  // O IMPULSO NERVOSO: onda no axônio em sincronia com o gráfico; saltatória com mielina
  // =====================================================================================
  const LOOP = 6.6;
  function tsim(ph) { const r = ph % LOOP; if (r < .8) return r / .8; if (r < 4.8) return 1 + (r - .8) / 2; if (r < 6) return 3 + (r - 4.8) / .4; return 6; }
  function Vm(ts, v, block) {
    const x = ts - 1; if (x < 0) return -70;
    if (v < 30 || block) { const vp = -70 + Math.min(13.5, 14 * v / 30); const k = x < 1 ? 1 - Math.exp(-x / .35) : (1 - Math.exp(-1 / .35)) * Math.exp(-(x - 1) / .8); return -70 + (vp + 70) * k; }
    if (x < .35) return -70 + 15 * sst(0, 1, x / .35);
    if (x < .7) return mix(-55, 30, sst(0, 1, (x - .35) / .35));
    if (x < 1.5) return mix(30, -77, sst(0, 1, (x - .7) / .8));
    if (x < 3.5) return mix(-77, -70, sst(0, 1, (x - 1.5) / 2));
    return -70;
  }
  const PI_ = {
    axo: { nome: 'Axônio', frase: 'Por dentro, negativo em repouso (cerca de −70 mV); a onda de despolarização corre por ele.', cor: NEUc },
    na: { nome: 'Na⁺ (sódio)', frase: 'Mais concentrado fora; entra quando os canais de Na⁺ se abrem (despolarização).', cor: NA },
    k: { nome: 'K⁺ (potássio)', frase: 'Mais concentrado dentro; sai logo depois, e a membrana volta a ficar negativa (repolarização).', cor: KK },
    ele: { nome: 'Eletrodo', frase: 'Mede a voltagem da membrana neste ponto: é o gráfico ao lado.', cor: '#DDE6F5' },
    miel: { nome: 'Bainha de mielina', frase: 'Isola o axônio: o impulso só acontece nos nodos e salta de um ao outro (condução saltatória).', cor: MIEL },
    nodo: { nome: 'Nodo de Ranvier', frase: 'Trecho sem mielina, cheio de canais de Na⁺.', cor: '#FFD27A' }
  };
  H3.cena('nervoso/impulso', {
    fit: 14, raio: 6, bolas: 220,
    pecas: PI_,
    rotulos: [{ pc: 'axo', t: 'axônio', pr: 2 }, { pc: 'ele', t: 'eletrodo', pr: 1 }, { pc: 'na', t: 'Na⁺', pr: 3 }, { pc: 'k', t: 'K⁺', pr: 4 }, { pc: 'miel', t: 'mielina', pr: 5 }, { pc: 'nodo', t: 'nodo de Ranvier', pr: 6 }],
    montar(g) {
      const T = g.T; g.pl = H3.corte(g, g.raiz, [0, 0, -1], 0);
      g.ax = H3.peca(g, H3.cilindro(g, 40), H3.filme(g, '#C9A3D8', { cor2: '#FFFFFF', dentro: '#2A1838', base: .14, fr: .6, esc: 2.2 }), 'axo'); g.ax.rotation.z = Math.PI / 2; g.ax.scale.set(.45, 7.8, .45); g.ax.renderOrder = 6;
      g.anel = H3.inst(g, H3.toro(g, .12, 40), H3.emis(g, NA, 2.4), 12, null);
      g.mie = H3.inst(g, H3.capsula(g, .5, .8, 24), H3.fis(g, MIEL, { p: { roughness: .3, clearcoat: .8 }, rim: '#FFFFFF', rimK: .3 }), 8, null, g.pecas.miel); g.pick.push(g.mie.m);
      g.nod = H3.inst(g, H3.toro(g, .2, 24), H3.fis(g, '#FFD27A', { p: { roughness: .4 } }), 8, null, g.pecas.nodo); g.pick.push(g.nod.m);
      g.el = H3.tubo(g, 2, 8, H3.fis(g, '#DDE6F5', { p: { roughness: .2, metalness: .6, clearcoat: 1 } }), g.raiz, 'ele'); g.el.set([[0, .43, .1], [.7, 2.2, .5]], .035);
      g.canal = H3.inst(g, H3.cilindro(g, 10), H3.fis(g, '#7A8CB8', { p: { roughness: .4 } }), 40, null);
    },
    animar(g, P) {
      const S = P.S, t = P.t, v = S.v, blk = !!S.blk, ts = tsim(RED() ? 1.6 : t), x = ts - 1, supra = v >= 30 && !blk, my = !!S.ax, lar = H3.deitado(g);
      g.ts = ts; g.supra = supra; g.blk = blk; g.my = my; g.vstim = v;
      // a onda passa pelo eletrodo (x = 0) no pico; antes e depois ela está em outros trechos do axônio
      const vel = my ? 3.2 : 1.3, xw = -3.5 + (x + .25) * vel * (my ? 1 : 1);
      const nodos = [-3.6, -2.4, -1.2, 0, 1.2, 2.4, 3.6];
      if (my) { for (let k = 0; k < nodos.length - 1; k++) { const a = nodos[k] + .13, b = nodos[k + 1] - .13; H3.put(g, g.mie, [(a + b) / 2, 0, 0], H3.qy(g, [1, 0, 0]), .62, (b - a) / 2.6, .62, MIEL, 1, g.pecas.miel); } nodos.forEach(n => H3.put(g, g.nod, [n, 0, 0], H3.qy(g, [1, 0, 0]), .47, .47, .47, '#FFD27A', 1, g.pecas.nodo)); }
      H3.fim(g.mie); H3.fim(g.nod);
      // canais de Na⁺ na membrana (nos nodos, se houver mielina)
      const posC = my ? nodos.flatMap(n => [n - .05, n + .05]) : Array.from({ length: 16 }, (_, i) => -3.75 + i * .5);
      posC.forEach((cx, i) => { const a = Math.PI * (.62 + .76 * (i % 2)); H3.put(g, g.canal, [cx, Math.cos(a) * .45, Math.sin(a) * .45 - .02], H3.qy(g, [0, Math.cos(a), Math.sin(a)]), .04, .1, .04, '#7A8CB8', 1); });
      H3.fim(g.canal);
      // anel de despolarização e íons: Na⁺ entra na frente da onda, K⁺ sai logo atrás
      const ativo = supra && x > .3 && x < 4.2;
      let xa = xw; if (my) { const k = Math.round((xw + 3.6) / 1.2); xa = nodos[cl(k, 0, nodos.length - 1)]; }
      if (ativo && xa > -4 && xa < 4) { H3.put(g, g.anel, [xa, 0, 0], H3.qy(g, [1, 0, 0]), .5, .5, .5, NA, 1); if (!my) H3.put(g, g.anel, [xa - .35, 0, 0], H3.qy(g, [1, 0, 0]), .49, .49, .49, KK, .6); }
      if (!supra && x > 0 && x < 2.5) { const k = Math.exp(-Math.max(0, x - .4) * 1.2) * Math.min(1, v / 30); H3.put(g, g.anel, [-3.5, 0, 0], H3.qy(g, [1, 0, 0]), .48, .48, .48, NA, .3 + k * .6); }
      H3.fim(g.anel);
      for (let i = 0; i < 46; i++) {
        const xi = -3.9 + hash(i, 1) * 7.8, a = Math.PI * (.55 + .9 * hash(i, 2)), near = ativo ? Math.exp(-((xi - xa) ** 2) / .08) : 0, f = RED() ? .5 : fr(t * .6 + hash(i, 3));
        const r = mix(.75, .3, near * f); H3.bola(g, [xi, Math.cos(a) * r, Math.min(.05, Math.sin(a) * r)], .045, NA, 1, g.pecas.na);
      }
      for (let i = 0; i < 30; i++) {
        const xi = -3.9 + hash(i, 11) * 7.8, a = Math.PI * (.55 + .9 * hash(i, 12)), back = ativo && !my ? Math.exp(-((xi - (xa - .45)) ** 2) / .1) : ativo && my ? Math.exp(-((xi - xa) ** 2) / .05) * .7 : 0, f = RED() ? .5 : fr(t * .5 + hash(i, 13));
        const r = mix(.28, .7, back * f); H3.put(g, g.mS, [xi, Math.cos(a) * r, Math.min(.03, Math.sin(a) * r)], g.qI, .04, .04, .04, KK, 1, g.pecas.k);
      }
      if (blk) for (let i = 0; i < 8; i++) H3.bola(g, [-3.2 + i * .9, .58, -.05], .06, '#9AA3B2', 1);
      ach(g, 'axo', [-2.6, -.45, 0]); ach(g, 'ele', [.35, 1.3, .3]); ach(g, 'na', [2.4, .72, 0]); ach(g, 'k', [-1.4, -.3, -.1]);
      if (my) { ach(g, 'miel', [1.8, .63, 0]); ach(g, 'nodo', [-1.2, -.48, 0]); }
      g.lar = lar;
    },
    sobre(g, S) {
      const A = area(), v = g.vstim, blk = g.blk, ts = g.ts;
      let G0; if (NAR) { const y0 = A.y0 + A.h * .5; G0 = { x0: A.x0 + 30, x1: A.x1 - 6, y0: y0 + 14, y1: A.y1 - 10 }; } else { const xm = A.x0 + A.w * .54; G0 = { x0: xm + 40, x1: A.x1, y0: A.y0 + 24, y1: A.y0 + A.h * .78 }; }
      const w = G0.x1 - G0.x0, h = G0.y1 - G0.y0, ym = mv => G0.y0 + h * (1 - (mv + 90) / 130), xt = s => G0.x0 + w * s / 6;
      rr(G0.x0 - 36, G0.y0 - 22, w + 44, h + 44, 12, 'rgba(11,15,28,.72)', 'rgba(255,255,255,.12)', 1);
      tx('voltagem no eletrodo', G0.x0 - 24, G0.y0 - 8, { s: 13, w: 600, a: 'left', c: C.txt, bg: false });
      [[-70, 'repouso −70', C.dim], [-55, 'limiar −55', '#FFB347'], [30, 'pico +30', NA]].forEach(([mv, s, c]) => { line(G0.x0, ym(mv), G0.x1, ym(mv), 'rgba(255,255,255,.14)', 1, [4, 4]); tx(s, G0.x1 - 4, ym(mv) - 9, { s: 12, a: 'right', c, bg: false }); });
      X.beginPath(); for (let i = 0; i <= 120; i++) { const s = ts * i / 120, y = ym(Vm(s, v, blk)); if (i) X.lineTo(xt(s), y); else X.moveTo(xt(s), y); } X.strokeStyle = blk || v < 30 ? '#9DB0D8' : NA; X.lineWidth = 2.4; X.stroke();
      circ(xt(ts), ym(Vm(ts, v, blk)), 4.5, '#FFE7A3');
      tx(`${Math.round(Vm(ts, v, blk))} mV`, Math.min(xt(ts) + 10, G0.x1 - 50), ym(Vm(ts, v, blk)) - 12, { s: 12, w: 700, f: FD, a: 'left', c: C.txt });
      tx('tempo (câmera lenta)', G0.x1, G0.y1 + 12, { s: 12, a: 'right', c: C.dim, bg: false });
      H3.reserva(g, [G0.x0 - 40, G0.y0 - 26, w + 52, h + 52]);
    },
    camera(g, P) {
      const lar = H3.deitado(g);
      return lar ? cam(g, P, 8.4, 1.4, { th: .12, fi: .16, al: [4.0, .2, 0], k: 1.0, viva: .3 }) : cam(g, P, 4.1, 1, { th: .12, fi: .16, al: [0, -2.3, 0], k: 1.0, viva: .3 });
    }
  });

  // =====================================================================================
  // A SINAPSE QUÍMICA EM CORTE
  // =====================================================================================
  const SUBS = [{ enz: 1, tr: 1, rec: 1 }, { enz: 0, tr: -1, rec: 1 }, { enz: 0, tr: -1, rec: 1 }, { enz: -1, tr: 0, rec: 1 }, { enz: 1, tr: 0, rec: -1 }];
  const SUBN = ['nenhuma', 'fluoxetina', 'cocaína', 'organofosforado', 'curare'], SUBNT = ['neurotransmissor', 'serotonina', 'dopamina', 'acetilcolina', 'acetilcolina'];
  const PSn = {
    term: { nome: 'Terminal do axônio', frase: 'Ponta do neurônio, cheia de vesículas com neurotransmissor.', cor: NEU },
    ves: { nome: 'Vesículas', frase: 'Bolsinhas de membrana com neurotransmissor; com o Ca²⁺, fundem-se à membrana (exocitose).', cor: NT },
    ca: { nome: 'Ca²⁺', frase: 'Entra no terminal quando o impulso chega e dispara a liberação.', cor: CA },
    nt: { nome: 'Neurotransmissor', frase: 'Atravessa a fenda e se liga aos receptores da célula seguinte.', cor: NT },
    fenda: { nome: 'Fenda sináptica', frase: 'Espaço de cerca de 20 nm entre as duas células.', cor: '#5B6C99' },
    rec: { nome: 'Receptores', frase: 'Proteínas da célula seguinte; abrem canais quando o neurotransmissor se encaixa.', cor: '#7CC8FF' },
    enz: { nome: 'Enzima', frase: 'Corta o neurotransmissor na fenda (como a acetilcolinesterase).', cor: '#E86A4A' },
    tr: { nome: 'Transportador de recaptação', frase: 'Devolve o neurotransmissor ao terminal.', cor: '#E9A7D9' },
    pos: { nome: 'Célula seguinte', frase: 'Outro neurônio, uma fibra muscular ou uma glândula.', cor: NEUc }
  };
  H3.cena('nervoso/sinapse', {
    fit: 14, raio: 6, bolas: 380,
    pecas: PSn,
    rotulos: [{ pc: 'term', t: 'terminal do axônio', pr: 1 }, { pc: 'ves', t: 'vesículas', pr: 2 }, { pc: 'fenda', t: 'fenda sináptica', pr: 3 }, { pc: 'rec', t: 'receptores', pr: 4 }, { pc: 'pos', t: 'célula seguinte', pr: 5 }, { pc: 'tr', t: 'recaptação', pr: 6, se: g => g.sub && g.sub.tr !== 0 }, { pc: 'enz', t: 'enzima', pr: 7, se: g => g.sub && g.sub.enz !== 0 }],
    so2D: S => !!S.ele,
    montar(g) {
      const T = g.T; g.pl = H3.corte(g, g.raiz, [0, 0, -1], 0);
      const pre = H3.solido(g, H3.lumpy(g, 'pre', 71, 4, 3, .06, .5, .9), '#B48CF0', [g.pl], { corte: '#6A4A9A', kc: 1, m: { p: { roughness: .45, sheen: .6 } } }); pre.scale.set(2.1, 1.25, 1.2); pre.position.set(0, 1.42, 0);
      pre.traverse(o => { if (o.isMesh) { o.userData.peca = g.pecas.term; g.pick.push(o); } });
      const ax = H3.tubo(g, 6, 12, H3.fis(g, '#B48CF0', { p: { roughness: .45, sheen: .6 } }), g.raiz, 'term'); ax.set([[-.3, 2.4, -.2], [-.5, 3.0, -.3], [-.9, 3.6, -.4], [-1.4, 4.2, -.5]], .32);
      const pos = H3.solido(g, H3.caixa(g, 5, 1.4, 2.6, 30, 'snP'), '#D9C2FF', [g.pl], { corte: '#5E4C86', kc: 1, m: { p: { roughness: .5, sheen: .5 } } }); pos.position.set(0, -.92, 0);
      pos.traverse(o => { if (o.isMesh) { o.userData.peca = g.pecas.pos; g.pick.push(o); } });
      g.ves = H3.inst(g, H3.esfera(g, 18), H3.fis(g, '#C8F5DE', { p: { roughness: .25, clearcoat: .8, transparent: true, opacity: .8 } }), 40, null, g.pecas.ves); g.pick.push(g.ves.m);
      g.rec = H3.inst(g, H3.lumpy(g, 'rec', 73, 2, 2, .2, .4, .8), H3.fis(g, '#7CC8FF', { p: { roughness: .4 } }), 14, null, g.pecas.rec); g.pick.push(g.rec.m);
      g.enz = H3.inst(g, H3.lumpy(g, 'enz', 75, 2, 4, .25, .3, .7), H3.fis(g, '#E86A4A', { p: { roughness: .4 } }), 6, null, g.pecas.enz); g.pick.push(g.enz.m);
      g.trn = H3.inst(g, H3.cilindro(g, 12), H3.fis(g, '#E9A7D9', { p: { roughness: .4 } }), 4, null, g.pecas.tr); g.pick.push(g.trn.m);
      g.cac = H3.inst(g, H3.cilindro(g, 12), H3.fis(g, '#C9A13A', { p: { roughness: .4 } }), 4, null, g.pecas.ca);
      g.nt = []; g.ca = []; g.fus = []; g.bound = new Array(10).fill(0); g.simt = .6; g.next = 1.2; g.wave = 0; g.waveCa = 0;
      for (let k = 0; k < 24; k++) g.nt.push({ p: [(hash(k, 1) - .5) * 3, (hash(k, 2) - .5) * .3, -hash(k, 3) * 1.05], v: [0, 0, 0], st: 0, t: 0 }); g.dock = [-.9, -.3, .3, .9].map((x, i) => [x, .42, -.25 - (i % 2) * .3]); g.dockT = [0, 0, 0, 0];
      g.RX = Array.from({ length: 10 }, (_, i) => [-1.7 + (i % 5) * .85, -.2, -.25 - Math.floor(i / 5) * .55]);
      g.EZ = [[-1.2, -.08, -.5], [.4, -.08, -.3], [1.4, -.08, -.7]]; g.TR = [[-1.75, .27, -.4], [1.75, .27, -.4]];
    },
    animar(g, P) {
      const S = P.S, t = P.t, sb = SUBS[S.sub || 0], inib = !!S.inib && !S.sub, dt = Math.min(.05, g.dt || .016);
      g.sub = sb;
      // simulação simples em 3D: impulsos, Ca²⁺, fusão das vesículas, difusão, ligação e remoção
      if (!S.paused && !RED()) {
        g.simt += dt; const rate = .25 + (S.v / 100) * 2.25;
        if (g.simt >= g.next) { g.next = g.simt + 1 / rate; g.wave = g.simt; }
        if (g.wave >= 0 && g.simt - g.wave > .35 && !g.waveCa) { g.waveCa = 1; for (const s of [-1, 1]) for (let i = 0; i < 4; i++) g.ca.push({ s, i, t: 0 }); }
        if (g.wave >= 0 && g.simt - g.wave > .65) { const nf = 1 + (S.v > 40 ? 1 : 0) + (S.v > 75 ? 1 : 0); [0, 1, 2, 3].filter(i => g.dockT[i] <= g.simt).sort(() => Math.random() - .5).slice(0, nf).forEach(i => { g.dockT[i] = g.simt + 1.4; g.fus.push({ i, t: 0 }); }); g.wave = -1; g.waveCa = 0; }
        g.ca.forEach(c => { c.t += dt; }); g.ca = g.ca.filter(c => c.t < .5);
        g.fus.forEach(f => { f.t += dt; if (f.t >= .25 && !f.rel) { f.rel = 1; const d = g.dock[f.i]; for (let k = 0; k < 10; k++) g.nt.push({ p: [d[0] + (Math.random() - .5) * .1, .17, d[2] + (Math.random() - .5) * .1], v: [(Math.random() - .5) * .8, -.6 - Math.random() * .4, (Math.random() - .5) * .8], st: 0, t: 0 }); } });
        g.fus = g.fus.filter(f => f.t < .5);
        for (let i = 0; i < g.bound.length; i++) if (g.bound[i] > 0) { g.bound[i] -= dt; if (g.bound[i] <= 0) { g.bound[i] = 0; const r = g.RX[i]; g.nt.push({ p: [r[0], -.12, r[2]], v: [(Math.random() - .5) * .6, .5, (Math.random() - .5) * .6], st: 0, t: 0 }); } }
        for (const n of g.nt) {
          n.t += dt;
          if (n.st === 0) {
            for (let k = 0; k < 3; k++) { n.v[k] += (Math.random() - .5) * 7 * dt; n.v[k] *= .97; n.p[k] += n.v[k] * dt; }
            if (n.p[1] > .17) { n.p[1] = .17; n.v[1] = -Math.abs(n.v[1]); }
            if (n.p[1] < -.15) { n.p[1] = -.15; n.v[1] = Math.abs(n.v[1]); if (sb.rec > 0) { const i = g.RX.findIndex((r, j) => g.bound[j] === 0 && Math.hypot(r[0] - n.p[0], r[2] - n.p[2]) < .2); if (i >= 0) { g.bound[i] = .6; n.st = 9; } } }
            if (n.p[2] > 0) { n.p[2] = 0; n.v[2] = -Math.abs(n.v[2]); } if (n.p[2] < -1.1) { n.p[2] = -1.1; n.v[2] = Math.abs(n.v[2]); }
            if (Math.abs(n.p[0]) > 1.95) { if (Math.random() < .25) n.st = 9; else { n.p[0] = cl(n.p[0], -1.95, 1.95); n.v[0] = -n.v[0]; } }
            if (sb.enz > 0) for (const e of g.EZ) if (V.len(sub(n.p, e)) < .22 && Math.random() < 2.2 * dt) { n.st = 2; n.t = 0; n.c = e; }
            if (sb.tr > 0) for (const q of g.TR) if (V.len(sub(n.p, q)) < .3 && Math.random() < 4 * dt) { n.st = 3; n.t = 0; n.p = q.slice(); }
            if (sb.enz <= 0 && sb.tr <= 0 && Math.random() < .12 * dt) n.st = 9;
            if ((sb.enz > 0) !== (sb.tr > 0) && Math.random() < .05 * dt) n.st = 9;
          } else if (n.st === 3) { n.p[1] += .6 * dt; if (n.t > .5) n.st = 9; }
          else if (n.st === 2) { if (n.t > .5) n.st = 9; }
        }
        g.nt = g.nt.filter(n => n.st !== 9); if (g.nt.length > 170) g.nt.splice(0, g.nt.length - 170);
      }
      // vesículas guardadas e as que se fundem
      for (let i = 0; i < 16; i++) { const p = [(hash(i, 1) - .5) * 2.4, .8 + hash(i, 2) * .9, -.15 - hash(i, 3) * .8]; H3.put(g, g.ves, p, null, .13, .13, .13, '#C8F5DE', 1, g.pecas.ves); }
      g.dock.forEach((d, i) => { const fu = g.fus.find(f => f.i === i), ready = g.dockT[i] <= g.simt || RED(); let p = d, r = .13; if (fu) { const f = fu.t / .25; p = [d[0], mix(d[1], .25, cl(f, 0, 1)), d[2]]; r = .13 * (1 - cl(f - 1, 0, 1)); } else if (!ready) r = 0; if (r > .01) H3.put(g, g.ves, p, null, r, r, r, '#C8F5DE', 1, g.pecas.ves); });
      H3.fim(g.ves);
      // neurotransmissor e Ca²⁺
      for (const n of g.nt) { const r = n.st === 2 ? .045 * (1 - n.t * 2) : .045; if (r > .005) H3.brilho(g, n.p, r, NT, n.st === 3 ? .8 : 1.3); }
      for (const c of g.ca) { const f = cl(c.t / .45, 0, 1); H3.brilho(g, [c.s * mix(2.25, 1.45, f), .45 + c.i * .08, -.2 - c.i * .15], .035, CA, 1.4); }
      [-1, 1].forEach(s => H3.put(g, g.cac, [s * 1.85, .5, -.35], H3.qy(g, [1, 0, 0]), .07, .22, .07, '#C9A13A', 1, g.pecas.ca)); H3.fim(g.cac);
      // receptores (bloqueados pelo curare), enzimas e transportadores
      g.RX.forEach((r, i) => { const on = g.bound[i] > 0, c = sb.rec < 0 ? '#FF8A8A' : on ? (inib ? '#C8D0E0' : '#FFE7A3') : '#7CC8FF'; H3.put(g, g.rec, [r[0], -.26, r[2]], null, .11, .1, .11, c, on ? 1.4 : 1, g.pecas.rec); if (sb.rec < 0) H3.bola(g, [r[0], -.13, r[2]], .06, '#E0414F', 1); });
      H3.fim(g.rec);
      if (sb.enz !== 0) g.EZ.forEach(e => { H3.put(g, g.enz, e, null, .1, .07, .1, sb.enz > 0 ? '#E86A4A' : '#6A6F80', 1, g.pecas.enz); if (sb.enz < 0) H3.bola(g, add(e, [0, .1, 0]), .05, '#E0414F', 1); });
      H3.fim(g.enz);
      if (sb.tr !== 0) g.TR.forEach(q => { H3.put(g, g.trn, q, null, .09, .2, .09, sb.tr > 0 ? '#E9A7D9' : '#5A6077', 1, g.pecas.tr); if (sb.tr < 0) H3.bola(g, add(q, [0, -.14, .05]), .06, '#E0414F', 1); });
      H3.fim(g.trn);
      g.inib = inib; g.S = S;
      ach(g, 'term', [-1.3, 2.1, -.1]); ach(g, 'ves', [-.7, 1.3, -.05]); ach(g, 'fenda', [1.6, 0, 0]); ach(g, 'rec', [-.85, -.25, -.25]); ach(g, 'pos', [1.2, -.7, .02]);
      if (sb.tr !== 0) ach(g, 'tr', g.TR[1]); if (sb.enz !== 0) ach(g, 'enz', g.EZ[1]);
      if (g.ca.length) H3.ficha(g, [-2.1, .65, -.2], 'Ca²⁺', CA, { pr: 2 });
    },
    sobre(g, S) {
      const A = area(), i = S.sub || 0, inib = g.inib, resp = inib ? 'célula seguinte inibida' : SUBS[i].rec < 0 ? 'resposta: bloqueada' : 'resposta da ' + (i >= 3 ? 'fibra muscular' : 'célula seguinte');
      const bar = (x, y, w, f, c, nm) => { tx(nm, x, y - 11, { s: 13, w: 600, a: 'left', c: C.txt }); rr(x, y, w, 10, 5, 'rgba(91,108,153,.45)'); if (f > .01) rr(x, y, Math.max(6, w * cl(f, 0, 1)), 10, 5, c); };
      if (NAR) { const y = A.y1 - 30, w = (A.w - 16) / 2; bar(A.x0, y, w, S.lvl || 0, NT, 'na fenda'); bar(A.x0 + w + 16, y, w, S.resp || 0, inib ? '#9AA3B2' : NA, inib ? 'inibição' : 'resposta'); H3.reserva(g, [A.x0 - 4, y - 24, A.w + 8, 40]); if (i) tx('substância: ' + SUBN[i], A.x0, A.y0 + 4, { s: 13, w: 700, a: 'left', c: C.txt }); }
      else {
        const x0 = A.x0 + A.w * .7, w = A.x1 - x0 - 4;
        tx('substância: ' + SUBN[i], x0, A.y0 + 16, { s: 13, w: 700, a: 'left', c: i ? C.txt : C.dim });
        if (i) tx('neurotransmissor: ' + SUBNT[i], x0, A.y0 + 40, { s: 13, w: 600, a: 'left', c: NT });
        bar(x0, A.y0 + A.h * .4, w, S.lvl || 0, NT, SUBNT[i] + ' na fenda'); bar(x0, A.y0 + A.h * .4 + 56, w, S.resp || 0, inib ? '#9AA3B2' : NA, resp);
        H3.reserva(g, [x0 - 8, A.y0, w + 12, A.h * .4 + 80]);
      }
    },
    camera(g, P) { const lar = H3.deitado(g); return lar ? cam(g, P, 4.1, 2.55, { th: .22, fi: .18, al: [1.25, .6, -.2], k: 1.0, viva: .4 }) : cam(g, P, 2.35, 2.4, { th: .22, fi: .18, al: [0, .6, -.2], k: 1.05, viva: .4 }); }
  });
})();
