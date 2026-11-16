/* LAB Plantas e animais: cenas 3D das plantas (Martin), sobre o kit do módulo Vírus (vir3d.js e vir3d-pecas.js) e as
   peças deste módulo (plantas3d-pecas.js).
   A conquista do ambiente terrestre: musgo, samambaia, pinheiro e planta com flor lado a lado num chão em forma de
   cladograma, com as três novidades (vasos, semente, flor e fruto) em anéis âmbar; a faixa "Grupo" acende um grupo por vez.
   Pteridófitas: a samambaia com soros e, na lente, o esporângio que se abre como catapulta, o esporo no solo úmido, o
   prótalo em coração com anterídios e arquegônio, os anterozoides nadando na água e o esporófito jovem nascendo.
   Angiospermas: a flor que se desmonta com a faixa (cálice, corola, androceu e gineceu em corte, com óvulos) e uma abelha
   que visita a flor inteira. Raiz, caule e folha: planta com o caule aberto ao meio, xilema (azul) subindo e floema
   (laranja) descendo, e o anel de Malpighi que corta só o floema.
   Jogos, rodas de ciclo e quadros continuam no desenho plano, assim como a cena inteira quando não há WebGL. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.paFronde) return;
  const { V } = V3, { cl, mix, seg, sst, add, sub, mul, nrm, hash, lerp3, trilha, fr, TAU } = V;
  const RED = () => V3.REDUZ();
  const limpa2D = () => { try { X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.clearRect(0, 0, X.canvas.width, X.canvas.height); X.restore(); } catch (e) { /* sem canvas 2D */ } };
  let lenteOn = false; // a lente 'esporófito (2n)' só existe na cena das pteridófitas
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const cam = (g, P, hx, hy, o = {}) => V3.viva({ th: o.th == null ? .3 : o.th, fi: o.fi == null ? .22 : o.fi, d: V3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .5 : o.viva);
  const AM = '#FFB347', N2 = '#E58AB0', N1 = '#7FB2E5', XIL = '#5AA9FF', FLO = '#F28C3A', SOLO = '#6E4E30';
  const E = () => V3.E();
  const solo = (g, w, h, d, pai, planos, pc) => { const b = V3.bloco(g, V3.caixa(g, w, h, d, 0, 'pa-solo:' + [w, h, d]), SOLO, { dn: .1, nuc: '#3C2A18', nr: .1, esc: 3, planos, pc, pai }); b.position.y = -h / 2; return b; };

  // =====================================================================================
  // A CONQUISTA DO AMBIENTE TERRESTRE
  // =====================================================================================
  const PE1 = {
    musgo: { nome: 'Briófita (musgo)', frase: 'Pequena e sem vasos condutores: a água passa de célula em célula. A planta verde que vemos é o gametófito (n).', cor: N1 },
    espM: { nome: 'Esporófito do musgo (2n)', frase: 'A haste com a cápsula cresce presa ao gametófito. Na cápsula, a meiose forma os esporos.', cor: N2 },
    samambaia: { nome: 'Pteridófita (samambaia)', frase: 'A primeira com vasos condutores. A planta é o esporófito (2n), mas a fecundação ainda depende de água.', cor: N2 },
    pinheiro: { nome: 'Gimnosperma (pinheiro)', frase: 'Tem semente, mas sem fruto: a semente fica nua nas escamas da pinha. O pólen leva o gameta sem precisar de água.', cor: N2 },
    estrobilo: { nome: 'Estróbilo (pinha)', frase: 'Ramo de escamas onde se formam os grãos de pólen ou os óvulos.', cor: '#8A5A2B' },
    angio: { nome: 'Angiosperma (planta com flor)', frase: 'Tem flor e fruto. O fruto protege a semente e ajuda a espalhá-la.', cor: N2 },
    flores: { nome: 'Flor', frase: 'Ramo modificado para a reprodução. Atrai polinizadores com cor, cheiro e néctar.', cor: '#E58AB0' },
    fruto: { nome: 'Fruto', frase: 'Vem do ovário da flor e guarda as sementes.', cor: '#E8742A' },
    alga: { nome: 'Ancestral: alga verde', frase: 'As plantas vieram de algas verdes de água doce: as duas têm clorofila a e b, guardam amido e têm parede de celulose.', cor: '#5FB89A' },
    vasos: { nome: 'Novidade: vasos condutores', frase: 'Xilema e floema levam água e açúcar pelo corpo, e a planta pode crescer alto.', cor: AM },
    semente: { nome: 'Novidade: semente e pólen', frase: 'A semente guarda o embrião com reserva. O grão de pólen leva o gameta pelo ar: a fecundação dispensa a água.', cor: AM },
    flor: { nome: 'Novidade: flor e fruto', frase: 'A flor atrai polinizadores e o fruto protege e espalha as sementes.', cor: AM }
  };
  const XP = [-3.3, -1.1, 1.1, 3.3], NOV = [['vasos', -2.2], ['semente', 0], ['flor', 2.2]];

  V3.cena('plantae/conquista', { sair: limpa2D,
    fit: 12, raio: 7, bolas: 520, pecas: PE1,
    so2D: S => S.modo !== 'clado',
    rotulos: [{ pc: 'musgo', t: 'briófita', pr: 1 }, { pc: 'samambaia', t: 'pteridófita', pr: 1 }, { pc: 'pinheiro', t: 'gimnosperma', pr: 1 }, { pc: 'angio', t: 'angiosperma', pr: 1 },
      { pc: 'vasos', t: 'vasos condutores', pr: 2 }, { pc: 'semente', t: 'semente', pr: 2 }, { pc: 'flor', t: 'flor e fruto', pr: 2 }, { pc: 'espM', t: 'esporófito (2n)', pr: 4 }, { pc: 'alga', t: 'alga verde', pr: 5 }],
    montar(g) {
      const T = g.T;
      g.chao = solo(g, 9.6, .35, 2.4, null, null, null);
      g.W = V3.kitV(g, { knobs: 1, cascas: 1, envs: 1, rods: 900 });
      g.F = V3.paLaminas(g, V3.paFolhaGeo(g), 520);
      g.Pt = V3.paLaminas(g, V3.paPetalaGeo(g), 40, { p: { sheenColor: new T.Color('#FFE0F0') } });
      g.Cn = V3.inst(g, V3.cone(g, g.q.cel ? 14 : 20), V3.fis(g, '#FFFFFF', { p: { roughness: .7 }, rimK: .12 }), 8); g.pick.push(g.Cn.m);
      g.An = V3.inst(g, V3.toro(g, .16, 16), V3.fis(g, AM, { p: { roughness: .35, clearcoat: .6 }, rim: '#FFE1A6', rimK: .4 }), 4); g.pick.push(g.An.m);
      g.qA = new T.Quaternion().setFromEuler(new T.Euler(0, Math.PI / 2, 0));
      g.vU = null; g.vT = -9;
    },
    animar(g, P) {
      const S = P.S, t = P.t, W = g.W, info = g.pecas, gr = S.v | 0;
      if (g.vU !== gr) { if (g.vU != null && gr > g.vU) g.vT = t; g.vU = gr; }
      const cresce = i => (i === gr && !RED() ? E().out(cl((t - g.vT) / 1.2, 0, 1)) : 1);
      const kk = i => (i <= gr ? 1 : .22), sw = RED() ? 0 : Math.sin(t * 1.1);
      // cladograma no chão: tronco na frente e um ramo para cada grupo
      const zf = .95, y0 = .02;
      V3.bastao(g, W.rod, [-4.6, y0, zf], [XP[3], y0, zf], .03, '#9DA9C4', 1, info.alga);
      V3.bola(g, [-4.6, y0, zf], .1, '#5FB89A', 1, info.alga); ach(g, 'alga', [-4.6, y0 + .1, zf]);
      XP.forEach((x, i) => V3.bastao(g, W.rod, [x, y0, zf], [x, y0, .35], .03, i <= gr ? '#C9D3E6' : '#5B6C99', 1, null));
      NOV.forEach(([id, x], i) => {
        const on = i < gr, p = [x, y0 + .02, zf], s = (on ? 1 + (RED() ? 0 : .06 * Math.sin(t * 3 + i)) : .8) * .2;
        V3.put(g, g.An, p, g.qA, s, s, s, on ? AM : '#5B6C99', on ? 1.1 : .8, info[id]); if (on) ach(g, id, add(p, [0, .2, 0]));
      });
      // musgo
      const m = V3.paMusgo(g, W, [XP[0], 0, 0], .45, .32, cresce(0), { k: kk(0), n: g.q.cel ? 12 : 18, esp: 3, info: info.musgo, infoE: info.espM });
      ach(g, 'musgo', [XP[0] - .3, .35, .2]); if (gr === 0 && m.caps[0]) ach(g, 'espM', m.caps[0]);
      // samambaia
      const e1 = cresce(1);
      for (let i = 0; i < 6; i++) V3.paFronde(g, W, g.F, [XP[1], .02, 0], i / 6 * TAU + .3, 1.25 * (.85 + .15 * hash(i, 5)), e1, { k: kk(1), sw: sw * (1 + i * .1), info: info.samambaia, n: g.q.cel ? 7 : 9 });
      ach(g, 'samambaia', [XP[1], 1.05 * e1, 0]);
      // pinheiro
      const pn = V3.paPinheiro(g, W, g.Cn, [XP[2], 0, 0], 2.7, cresce(2), { k: kk(2), info: info.pinheiro, infoE: info.estrobilo });
      ach(g, 'pinheiro', [XP[2], 2.5 * cresce(2), 0]);
      // planta com flor
      const pf = V3.paPlantaFlor(g, W, g.F, g.Pt, [XP[3], 0, 0], 1.7, cresce(3), t, { k: kk(3), fruto: true, info: info.angio, infoFl: info.flores, infoF: info.fruto });
      ach(g, 'angio', [XP[3] + .2, 1.45 * cresce(3), 0]);
      // fase de cada planta (fichas só no grupo da vez)
      const lb = [['gametófito (n)', N1, [XP[0], .25, .3]], ['esporófito (2n)', N2, [XP[1] + .4, .6, .3]], ['esporófito (2n)', N2, [XP[2] + .5, 1.2, .3]], ['esporófito (2n)', N2, [XP[3] + .35, .7, .3]]][gr];
      V3.ficha(g, lb[2], lb[0], lb[1], { pr: 3, dx: 1, dy: 0 });
      if (gr === 2 && pn.estrobilos[0]) V3.ficha(g, pn.estrobilos[0], 'pinha', '#C08A5A', { pr: 4, dx: -1, dy: 0 });
      if (gr === 3 && pf.fruto) V3.ficha(g, pf.fruto, 'fruto', '#E8742A', { pr: 4, dx: 1, dy: 0 });
      V3.fimKit(W); V3.fim(g.F); V3.fim(g.Pt); V3.fim(g.Cn); V3.fim(g.An);
    },
    camera(g, P) {
      const d = V3.deitado(g), gr = P.S.v | 0;
      if (d) return cam(g, P, 4.9, 1.75, { al: [0, 1.05, 0], th: .05, fi: .26, k: 1.04 });
      return cam(g, P, 1.45, 1.75, { al: [XP[gr] * .92, 1.0, 0], th: .12, fi: .24, viva: .3 });
    }
  });

  // =====================================================================================
  // PTERIDÓFITAS: SOROS E PRÓTALO (mesma linha do tempo da cena plana, 26 s)
  // =====================================================================================
  const PE2 = {
    samambaia: { nome: 'Samambaia: esporófito (2n)', frase: 'A planta grande é o esporófito. Tem raiz, caule (rizoma) e folhas com vasos condutores.', cor: N2 },
    soro: { nome: 'Soro', frase: 'Grupo de esporângios sob o folíolo. Os pontinhos marrons não são doença nem praga.', cor: '#7A4B2A' },
    esporangio: { nome: 'Esporângio', frase: 'Cápsula onde a meiose forma os esporos (n). Abre-se como uma catapulta quando seca.', cor: '#B07A3A' },
    anulo: { nome: 'Ânulo', frase: 'Fileira de células de parede grossa. Ao perder água, ela se curva e lança os esporos longe.', cor: '#5A3A1A' },
    esporo: { nome: 'Esporo (n)', frase: 'Formado por meiose. Em solo úmido, germina e forma o prótalo.', cor: '#E8D5A8' },
    protalo: { nome: 'Prótalo: gametófito (n)', frase: 'Lâmina verde em forma de coração, com menos de 1 cm, presa ao solo por rizoides. Vive pouco.', cor: N1 },
    anteridio: { nome: 'Anterídio', frase: 'Produz os anterozoides, gametas masculinos com flagelos.', cor: '#E8A24A' },
    arquegonio: { nome: 'Arquegônio', frase: 'Guarda a oosfera, o gameta feminino.', cor: '#B7D68A' },
    anterozoide: { nome: 'Anterozoides', frase: 'Nadam na película de água até o arquegônio. Sem água, não há fecundação.', cor: '#BFE0FF' },
    agua: { nome: 'Película de água', frase: 'Água da chuva ou do orvalho sobre o prótalo: é o caminho dos anterozoides.', cor: XIL },
    jovem: { nome: 'Esporófito jovem (2n)', frase: 'Nasce do zigoto, em cima do prótalo, e cresce até virar uma samambaia nova. O prótalo então morre.', cor: N2 },
    solo: { nome: 'Solo úmido', frase: 'O esporo só germina onde há umidade.', cor: SOLO }
  };
  const V3T = 26;
  V3.cena('plantae/pteridofitas', { sair() { lenteOn = false; limpa2D(); requestAnimationFrame(limpa2D); setTimeout(limpa2D, 120); },
    fit: 10, raio: 6, bolas: 300, pecas: PE2,
    so2D: S => S.modo !== 'folha',
    rotulos: [{ pc: 'samambaia', t: 'samambaia (2n)', pr: 1 }, { pc: 'soro', t: 'soros', pr: 2 }, { pc: 'esporangio', t: 'esporângio', pr: 1 }, { pc: 'anulo', t: 'ânulo', pr: 3 }, { pc: 'esporo', t: 'esporos (n)', pr: 2 },
      { pc: 'protalo', t: 'prótalo (n)', pr: 1 }, { pc: 'anteridio', t: 'anterídio', pr: 3 }, { pc: 'arquegonio', t: 'arquegônio', pr: 3 }, { pc: 'anterozoide', t: 'anterozoides', pr: 4 }, { pc: 'jovem', t: 'esporófito jovem (2n)', pr: 2 }],
    montar(g) {
      const T = g.T;
      g.W = V3.kitV(g, { knobs: 1, cascas: 1, envs: 1, rods: 500 });
      g.F = V3.paLaminas(g, V3.paFolhaGeo(g), 320);
      g.gF = new T.Group(); g.raiz.add(g.gF);
      g.monte = V3.peca(g, V3.torno(g, [[.001, 0], [.9, 0], [.75, .12], [.4, .2], [.001, .22]], 24, 'pa-monte'), V3.fis(g, '#5A3F26', { p: { roughness: .9 }, rimK: .05 }), null, g.gF); g.monte.position.y = -.2;
      g.gZ = new T.Group(); g.raiz.add(g.gZ);
      g.zSolo = solo(g, 2.3, .3, 1.3, g.gZ, null, 'solo'); g.zSolo.position.y = -.85 - .15;
      g.cor = V3.fis(g, '#7FC63B', { p: { roughness: .5, sheen: .6, sheenColor: new T.Color('#E8FFB0') }, rim: '#E6FFB0', rimK: .3 });
      g.prot = V3.peca(g, V3.paCoracao(g), g.cor, 'protalo', g.gZ);
      g.agua = V3.peca(g, V3.esfera(g, 24), V3.filme(g, XIL, { cor2: '#FFFFFF', dentro: '#1D3A66', base: .12, fr: .6, esc: 2 }), 'agua', g.gZ); g.agua.renderOrder = 5;
      g.qS = new T.Quaternion();
    },
    animar(g, P) {
      const S = P.S, t = P.t, W = g.W, info = g.pecas, d = V3.deitado(g), T = t % V3T;
      g.d = d; g.tt = T;
      // samambaia inteira
      const fb = d ? [-1.75, -.95, 0] : [0, -2.1, 0]; g.gF.position.set(fb[0], fb[1], fb[2]);
      const sw = RED() ? 0 : Math.sin(t * .9); let alvo = null;
      for (let i = 0; i < 7; i++) {
        const o = V3.paFronde(g, W, g.F, add(fb, [0, .02, 0]), i / 7 * TAU + .5, 1.45 * (.85 + .15 * hash(i, 7)), 1, { sw: sw * (1 + i * .1), soros: true, info: info.samambaia, n: g.q.cel ? 8 : 10 });
        o.sori.forEach((p, j) => { if (j % 2 === 0) V3.put(g, g.mS, p, null, .022, .012, .022, '#7A4B2A', 1, info.soro); });
        if (i === 1) alvo = o.sori[3] || o.meio;
      }
      ach(g, 'samambaia', add(fb, [-.5, 1.1, 0])); g.alvo = alvo;
      // lente
      const zc = d ? [1.95, .15, 0] : [0, 1.25, 0]; g.zc = zc; g.gZ.position.set(zc[0], zc[1], zc[2]);
      const zs = zc[1] - .85; // superfície do solo na lente
      g.zSolo.visible = T >= 9; g.prot.visible = false; g.agua.visible = false;
      if (T < 5) {
        // folíolo visto de baixo com os soros
        const L = 1.7, x0 = zc[0] - L / 2, sz = L * .3 * 2;
        // a lâmina fica inclinada: a câmera vê a face de baixo, onde ficam os soros (para fora da lâmina, no lado oposto ao de cima)
        const rl = -Math.PI / 2 + .5, ny = Math.cos(rl), nz = Math.sin(rl), zy = -Math.sin(rl), zz = Math.cos(rl); // normal de cima e eixo da largura
        V3.paFolha(g, g.F, [x0, zc[1], zc[2]], 0, 0, rl, L, .3, '#5FB36A', 1, info.samambaia);
        [.3, .5, .7].forEach((u, i) => [1, -1].forEach(sd => { const w = .5 * Math.pow(Math.sin(Math.PI * u), .8), o = sd * .42 * w * sz, p = [x0 + u * L, zc[1] + o * zy - ny * .05, zc[2] + o * zz - nz * .05]; V3.put(g, g.mS, p, null, .085, .085, .04, '#7A4B2A', 1, info.soro); if (i === 1 && sd === 1) ach(g, 'soro', p); }));
      } else if (T < 9) {
        // esporângio: haste, cápsula que se abre e o ânulo que se curva
        const op = sst(5.8, 7.2, T), c = add(zc, [0, .05, 0]), r = .38;
        V3.bastao(g, W.rod, add(c, [0, -.95, 0]), add(c, [0, -r * .8, 0]), .04, '#8A6A3A', 1, info.esporangio);
        V3.put(g, g.mS, add(c, [-op * .12, 0, 0]), null, r * .95, r * .9, r * .7, '#9A6A3A', 1, info.esporangio);
        V3.put(g, g.mS, add(c, [op * .14, op * .05, 0]), null, r * .8, r * .85, r * .62, '#B07A3A', 1, info.esporangio);
        for (let i = 0; i < 14; i++) { const a = Math.PI * (.5 + i / 13 * (1.1 + op * .5)) - op * .6, rr = r * (1.02 + op * .25); V3.bola(g, add(c, [Math.cos(a) * rr, Math.sin(a) * rr, .1]), .05, '#5A3A1A', 1, info.anulo); if (i === 6) ach(g, 'anulo', add(c, [Math.cos(a) * rr, Math.sin(a) * rr, .1])); }
        ach(g, 'esporangio', add(c, [-r * .6, -r * .3, .2]));
        if (op > .05) { const f = sst(6.6, 8.8, T); for (let i = 0; i < 12; i++) { const ang = -Math.PI / 2 + (i - 5.5) * .22, p = add(c, [Math.cos(ang) * f * (.6 + i % 3 * .2), -Math.sin(ang) * f * .9 - f * f * .5 + .2, (hash(i, 9) - .5) * .4 * f]); V3.bola(g, p, .045, '#E8D5A8', 1, info.esporo); if (i === 3 && f > .2) ach(g, 'esporo', p); } }
      } else if (T < 12) {
        const f = sst(9, 12, T), p = [zc[0], mix(zc[1] + .7, zs + .04, f), zc[2]];
        V3.bola(g, p, .06, '#E8D5A8', 1, info.esporo); ach(g, 'esporo', p);
      } else {
        // prótalo, gametângios, água e esporófito jovem
        const k = Math.max(.15, sst(12, 17, T)), fade = 1 - .7 * sst(23, 26, T), s = .95 * k;
        g.prot.visible = true; g.prot.scale.set(s, s * 1.6, s); g.prot.position.set(0, -.85 + .02, .1);
        g.cor.color.setRGB(.5 * fade, .78 * fade, .23 * fade);
        const ctr = add(zc, [0, -.85 + .07, .1]);
        for (let i = 0; i < 9; i++) { const a = (hash(i, 3) - .5) * 1.4, b = add(ctr, [Math.sin(a) * .25 * s, -.03, .3 * s + hash(i, 4) * .1 * s]); V3.bastao(g, W.rod, b, add(b, [Math.sin(a) * .1, -.18 * k, .08]), .008, '#C9A27A', fade, info.protalo); }
        ach(g, 'protalo', add(ctr, [-.4 * s, .05, 0]));
        const ant = add(ctr, [.12 * s, .04, .32 * s]), arq = add(ctr, [0, .05, -.36 * s]);
        if (T > 15) {
          [[0, 0], [.1, .08], [-.08, .1]].forEach(([u, v]) => V3.put(g, g.mS, add(ant, [u * s, 0, v * s]), null, .05 * s, .04 * s, .05 * s, '#E8A24A', fade, info.anteridio));
          V3.put(g, g.mS, arq, null, .06 * s, .07 * s, .06 * s, '#B7D68A', fade, info.arquegonio);
          ach(g, 'anteridio', ant); ach(g, 'arquegonio', arq);
        }
        if (T > 17 && T < 23) {
          const w = sst(17, 18, T) * (1 - sst(22, 23, T));
          g.agua.visible = w > .02; g.agua.scale.set(.75 * s, .05 * w + .001, .75 * s); g.agua.position.set(0, -.85 + .09, .1);
          for (let i = 0; i < 4; i++) { const u = cl((T - 17) / 4 * 1.2 - i * .06, 0, 1), p = add(lerp3(ant, arq, u), [Math.sin(T * 8 + i) * .03, .05, Math.cos(T * 7 + i) * .03]); if (u < 1 || i === 0) { V3.bola(g, p, .03, '#BFE0FF', 1, info.anterozoide); if (i === 1) ach(g, 'anterozoide', p); } }
        }
        if (T > 21) {
          const e = sst(21, 26, T), b = arq;
          V3.paFronde(g, W, g.F, b, .4, .9, e, { n: 6, info: info.jovem, cor: '#4FA85A' }); V3.paFronde(g, W, g.F, b, 2.6, .7, e * .8, { n: 5, info: info.jovem, cor: '#4FA85A' });
          if (e > .2) ach(g, 'jovem', add(b, [.3 * e, .6 * e, 0]));
        }
      }
      V3.fimKit(W); V3.fim(g.F);
    },
    sobre(g, S) {
      lenteOn = true;
      if (!g.zc || !g.alvo) return;
      // lente: linha tracejada do soro até a cena ampliada
      const a = V3.tela(g, g.alvo), b = V3.tela(g, g.zc), r = Math.abs(V3.tela(g, add(g.zc, [1.25, 0, 0]))[0] - b[0]);
      if (a[2] > 1 || b[2] > 1) return;
      const ang = Math.atan2(a[1] - b[1], a[0] - b[0]);
      line(a[0], a[1], b[0] + Math.cos(ang) * r, b[1] + Math.sin(ang) * r, 'rgba(255,255,255,.45)', 1, [4, 4]); circ(a[0], a[1], 5, null, '#fff', 1.4);
      circ(b[0], b[1], r, null, 'rgba(255,179,71,.6)', 1.5);
      const fase = g.tt < 12 ? ['esporófito (2n)', N2] : g.tt < 21 ? ['gametófito (n)', N1] : ['esporófito jovem (2n)', N2];
      tx(fase[0], b[0], b[1] - r - 12, { s: 13, w: 600, c: fase[1] }); V3.reserva(g, [b[0] - 80, b[1] - r - 22, 160, 20]);
    },
    camera(g, P) {
      const d = V3.deitado(g);
      return d ? cam(g, P, 3.55, 1.85, { al: [.1, 0, 0], th: .05, fi: .42 }) : cam(g, P, 1.75, 3.3, { al: [0, -.3, 0], th: .05, fi: .38 });
    }
  });

  // =====================================================================================
  // ANGIOSPERMAS: A FLOR POR DENTRO (faixa "Desmontar")
  // =====================================================================================
  const PE3 = {
    sepala: { nome: 'Sépalas (cálice)', frase: 'Folhas verdes modificadas, por fora da flor. Protegem o botão antes de ele abrir.', cor: '#5FA84A' },
    petala: { nome: 'Pétalas (corola)', frase: 'Coloridas e muitas vezes perfumadas: atraem os animais polinizadores.', cor: '#D783B8' },
    antera: { nome: 'Antera', frase: 'Ponta do estame, onde se formam os grãos de pólen. Estames formam o androceu, a parte masculina.', cor: '#E8C23C' },
    filete: { nome: 'Filete', frase: 'Haste fina que sustenta a antera.', cor: '#8AB04A' },
    estigma: { nome: 'Estigma', frase: 'Ponta pegajosa do carpelo, que recebe o pólen na polinização.', cor: '#E8B04A' },
    estilete: { nome: 'Estilete', frase: 'Tubo que liga o estigma ao ovário. Por ele desce o tubo polínico.', cor: '#9CC070' },
    ovario: { nome: 'Ovário (em corte)', frase: 'Base do carpelo, a parte feminina (gineceu). Depois da fecundação, vira o fruto.', cor: '#9CC070' },
    ovulo: { nome: 'Óvulos', frase: 'Dentro do ovário. Cada um guarda o saco embrionário com a oosfera e, depois da fecundação, vira semente.', cor: '#F4E3A1' },
    receptaculo: { nome: 'Receptáculo', frase: 'Ponta do pedúnculo onde as peças da flor se prendem.', cor: '#3E8E4A' },
    abelha: { nome: 'Abelha', frase: 'Busca néctar, se suja de pólen numa flor e o deixa no estigma de outra: é a polinização.', cor: '#F2C14B' },
    polen: { nome: 'Grãos de pólen', frase: 'Cada grão é o gametófito masculino jovem, que forma o tubo polínico. Grudam no corpo da abelha.', cor: '#F2D24B' }
  };
  const NS = 5, NP = 5, NE = 8, OV = [[-.05, .06, -.04], [.05, .1, -.06], [0, .16, -.03], [-.04, .2, -.07], [.04, .24, -.04]];
  V3.cena('plantae/angiospermas', { sair: limpa2D,
    fit: 8, raio: 4, bolas: 160, pecas: PE3,
    so2D: S => S.modo !== 'flor',
    rotulos: [{ pc: 'sepala', t: 'sépalas', pr: 2 }, { pc: 'petala', t: 'pétalas', pr: 1 }, { pc: 'antera', t: 'antera', pr: 2 }, { pc: 'filete', t: 'filete', pr: 4 }, { pc: 'estigma', t: 'estigma', pr: 3 },
      { pc: 'estilete', t: 'estilete', pr: 4 }, { pc: 'ovario', t: 'ovário', pr: 2 }, { pc: 'ovulo', t: 'óvulos', pr: 3 }, { pc: 'abelha', t: 'abelha', pr: 5 }],
    montar(g) {
      const T = g.T;
      g.pl = V3.corte(g, g.raiz, [0, 0, -1], 0);
      g.W = V3.kitV(g, { knobs: 1, cascas: 1, envs: 1, rods: 60 });
      g.F = V3.paLaminas(g, V3.paFolhaGeo(g), 12);
      g.Pt = V3.paLaminas(g, V3.paPetalaGeo(g), 12, { p: { roughness: .5, sheen: .8, sheenColor: new T.Color('#FFE0F0') }, rimK: .3 });
      g.gO = new T.Group(); g.raiz.add(g.gO);
      g.ov = V3.solido(g, V3.torno(g, [[.001, 0], [.14, .02], [.2, .1], [.19, .2], [.12, .29], [.04, .33], [.001, .34]], g.q.cel ? 20 : 28, 'pa-ovario'), '#9CC070', [g.pl], { corte: '#C9DFA0', kc: 1, pai: g.gO, pc: 'ovario', m: { p: { roughness: .45 }, rim: '#E6FFB0', rimK: .25 } });
      g.rec = V3.peca(g, V3.torno(g, [[.001, -.5], [.05, -.5], [.05, -.12], [.16, -.02], [.18, .02], [.001, .03]], 20, 'pa-recep'), V3.fis(g, '#3E8E4A', { p: { roughness: .5 } }), 'receptaculo');
    },
    animar(g, P) {
      const S = P.S, t = P.t, W = g.W, info = g.pecas, v = S.v;
      const dS = sst(0, 1, v), dP = sst(1, 2, v), dE = sst(2, 3, v), sz = sst(3, 4, v), gira = RED() ? 0 : t * .05;
      // sépalas: abrem para fora e descem
      for (let i = 0; i < NS; i++) { const a = i / NS * TAU + gira + .3, r = .12 + dS * 1.05, p = [Math.cos(a) * r, .02 - dS * .45, -Math.sin(a) * r]; V3.paFolha(g, g.F, p, a, .55 - dS * .25, 0, .42, .3, '#5FA84A', 1, info.sepala); if (i === 1) ach(g, 'sepala', add(p, V3.paPonta(a, .55 - dS * .25, .38))); }
      // pétalas
      for (let i = 0; i < NP; i++) { const a = (i + .5) / NP * TAU + gira + .3, r = .12 + dP * 1.25, p = [Math.cos(a) * r, .06 + dP * .1, -Math.sin(a) * r]; V3.paFolha(g, g.Pt, p, a, .62 - dP * .3, 0, .78, .36, '#D783B8', 1, info.petala); if (i === 0) ach(g, 'petala', add(p, V3.paPonta(a, .62, .6))); }
      // estames: filete e antera
      for (let i = 0; i < NE; i++) {
        const a = i / NE * TAU + gira, r0 = .1 + dE * .85, b = [Math.cos(a) * r0, .05 + dE * .5, -Math.sin(a) * r0], tp = add(b, [Math.cos(a) * .12, .42, -Math.sin(a) * .12]);
        V3.bastao(g, W.rod, b, tp, .012, '#8AB04A', 1, info.filete);
        V3.put(g, g.mS, add(tp, [0, .04, 0]), null, .035, .06, .035, '#E8C23C', 1, info.antera);
        if (i === 2) { ach(g, 'antera', add(tp, [0, .06, 0])); ach(g, 'filete', V.lerp3(b, tp, .5)); }
      }
      // carpelo: ovário em corte com óvulos, estilete e estigma
      const k = 1 + sz * 1.1; g.gO.scale.setScalar(k); g.gO.position.y = .02;
      OV.forEach(([x, y, z], i) => { const p = [x * k * 1.6, .02 + y * k, z * k * .9 - .03]; V3.bola(g, p, .028 * k, '#F4E3A1', 1, info.ovulo); if (i === 2) ach(g, 'ovulo', p); });
      ach(g, 'ovario', [.17 * k, .12 * k, 0]);
      const st = .02 + .34 * k, sg = st + .4 + sz * .15;
      V3.bastao(g, W.rod, [0, st - .02, -.01], [0, sg, -.01], .018 * Math.sqrt(k), '#9CC070', 1, info.estilete); ach(g, 'estilete', [0, (st + sg) / 2, 0]);
      V3.put(g, g.mS, [0, sg + .02, -.01], null, .06 * Math.sqrt(k), .03, .06 * Math.sqrt(k), '#E8B04A', 1, info.estigma); ach(g, 'estigma', [0, sg + .04, 0]);
      // abelha (só com a flor inteira): chega, pousa nas anteras, se suja de pólen e vai embora
      if (v < .25) abelha(g, t, info);
      V3.fimKit(W); V3.fim(g.F); V3.fim(g.Pt);
    },
    camera(g, P) {
      const d = V3.deitado(g), v = P.S.v, ab = .9 + .7 * sst(0, 2.5, v);
      return cam(g, P, d ? 1.15 * ab * 1.25 : 1.2 * ab, d ? 1.0 * ab : 1.3 * ab, { al: [0, .2 + .1 * sst(2, 3, v), 0], th: .25, fi: .42 });
    }
  });
  const BEE = 12;
  function abelha(g, t, info) {
    const T = RED() ? 6 : t % BEE, chega = sst(1, 4.5, T), sai = sst(8, 11.5, T), pousada = chega >= 1 && sai <= 0;
    const ent = [-2.2, 1.2, .9], pou = [.02, .7, .3], fora = [2.2, 1.4, -.2];
    let p = sai > 0 ? V.bez(pou, [1, 1.6, .5], fora, sai) : V.bez(ent, [-1, 1.5, 1], pou, chega);
    if (pousada && !RED()) p = add(p, [Math.sin(t * 2) * .03, Math.abs(Math.sin(t * 3)) * .02, 0]);
    if (T < .6 || T > 11.6) return;
    const dir = sai > 0 ? nrm(sub(fora, pou)) : nrm(sub(pou, ent)), yaw = Math.atan2(-dir[2], dir[0]);
    const fx = [Math.cos(yaw), 0, -Math.sin(yaw)], lat = [Math.sin(yaw), 0, Math.cos(yaw)];
    // corpo: tórax, abdome listrado e cabeça
    V3.put(g, g.mS, p, null, .07, .07, .07, '#3A2E14', 1, info.abelha);
    for (let i = 0; i < 4; i++) V3.put(g, g.mS, add(p, mul(fx, -.07 - i * .045)), null, .075 - i * .008, .07 - i * .008, .075 - i * .008, i % 2 ? '#2A2210' : '#F2C14B', 1, info.abelha);
    V3.bola(g, add(p, mul(fx, .08)), .05, '#2A2210', 1, info.abelha);
    const bat = RED() ? .4 : Math.sin(t * 40) * .5;
    [1, -1].forEach(sd => V3.paFolha(g, g.Pt, add(p, [0, .05, 0]), yaw + sd * 1.9, .25 + bat, 0, .2, .3, '#E8F0FF', .9, info.abelha));
    ach(g, 'abelha', add(p, [0, .12, 0]));
    // pólen grudado nas patas depois de pousar
    if (chega >= 1) { const q = sst(5, 7.5, T); for (let i = 0; i < 6; i++) V3.bola(g, add(add(p, mul(lat, (i % 2 ? 1 : -1) * .05)), add([0, -.07, 0], mul(fx, -.02 * (i >> 1)))), .018 * q, '#F2D24B', 1, info.polen); }
  }

  // =====================================================================================
  // RAIZ, CAULE E FOLHA: A PLANTA POR DENTRO
  // =====================================================================================
  const PE4 = {
    raiz: { nome: 'Raiz', frase: 'Fixa a planta e absorve água e sais minerais. Sem o açúcar que vem pelo floema, ela morre de fome.', cor: '#C9A27A' },
    pelos: { nome: 'Pelos absorventes', frase: 'Perto da ponta da raiz: aumentam muito a área que absorve água.', cor: '#E8D5B8' },
    casca: { nome: 'Casca', frase: 'Camada de fora do caule. No anel de Malpighi, ela é retirada junto com o floema.', cor: '#7A5A38' },
    floema: { nome: 'Floema', frase: 'Leva a seiva elaborada (água com açúcar) das folhas para a raiz, os frutos e os brotos. Fica logo por dentro da casca.', cor: FLO },
    xilema: { nome: 'Xilema', frase: 'Leva a seiva bruta (água e sais) da raiz até as folhas. Fica mais por dentro: é a madeira.', cor: XIL },
    medula: { nome: 'Medula', frase: 'Miolo do caule, de células que guardam reserva.', cor: '#E8DCC4' },
    folha: { nome: 'Folha', frase: 'Faz a fotossíntese. Recebe a seiva bruta e manda o açúcar para o resto da planta.', cor: '#4FA85A' },
    fruto: { nome: 'Fruto', frase: 'Recebe açúcar pelo floema e cresce.', cor: '#E8742A' },
    seivaB: { nome: 'Seiva bruta', frase: 'Água e sais minerais, subindo pelo xilema.', cor: XIL },
    seivaE: { nome: 'Seiva elaborada', frase: 'Água com açúcar feito na fotossíntese, descendo pelo floema.', cor: FLO },
    anel: { nome: 'Anel de Malpighi', frase: 'Retirar um anel de casca corta o floema, mas não o xilema: as folhas seguem com água e a raiz fica sem açúcar.', cor: AM },
    solo: { nome: 'Solo', frase: 'Guarda a água e os sais minerais que a raiz absorve.', cor: SOLO }
  };
  const YA = .85, GAP = .2, YT = 2.3;
  const RAMOS = [[2.1, 1.55, .8], [-.5, 1.85, .9], [.9, 2.15, .7], [-2.4, 1.35, .75]];
  const RAIZ = [[-.6, .45, -.35], [.7, .5, -.25], [-.3, 1.0, -.45], [.45, 1.1, -.4], [0, 1.45, -.2]];
  V3.cena('plantae/orgaos', { sair: limpa2D,
    fit: 10, raio: 6, bolas: 260, pecas: PE4,
    so2D: S => S.modo !== 'planta',
    rotulos: [{ pc: 'raiz', t: 'raiz', pr: 1 }, { pc: 'xilema', t: 'xilema', pr: 1 }, { pc: 'floema', t: 'floema', pr: 1 }, { pc: 'folha', t: 'folha', pr: 2 }, { pc: 'casca', t: 'casca', pr: 3 },
      { pc: 'anel', t: 'anel de Malpighi', pr: 1 }, { pc: 'fruto', t: 'fruto', pr: 4 }, { pc: 'pelos', t: 'pelos absorventes', pr: 5 }, { pc: 'medula', t: 'medula', pr: 6 }],
    montar(g) {
      g.pl = V3.corte(g, g.raiz, [0, 0, -1], 0);
      g.solo = solo(g, 4.6, 1.8, 1.8, null, [g.pl], 'solo');
      const cil = V3.cilindro(g, g.q.cel ? 20 : 28), lay = (cor, corte, pc, rimK) => V3.solido(g, cil, cor, [g.pl], { corte, kc: 1, pc, m: { p: { roughness: .6 }, rimK } });
      g.xil = lay('#3F7FC8', XIL, 'xilema', .1); g.med = lay('#D9CBB0', '#E8DCC4', 'medula', .05);
      g.floA = lay('#C8762E', FLO, 'floema', .1); g.floB = lay('#C8762E', FLO, 'floema', .1);
      g.casA = lay('#6B4A2B', '#8A6A3A', 'casca', .12); g.casB = lay('#6B4A2B', '#8A6A3A', 'casca', .12);
      g.W = V3.kitV(g, { knobs: 1, cascas: 1, envs: 1, rods: 220 });
      g.F = V3.paLaminas(g, V3.paFolhaGeo(g), 40);
    },
    animar(g, P) {
      const S = P.S, t = P.t, W = g.W, info = g.pecas, an = S.anel ? 1 : 0, dead = S.an || 0;
      const seg2 = (o, r, y0, y1) => { o.scale.set(r, Math.max(.001, y1 - y0), r); o.position.y = (y0 + y1) / 2; o.visible = y1 - y0 > .002; };
      seg2(g.xil, .085, -.12, YT); seg2(g.med, .03, -.1, YT - .02);
      const yb = an ? YA - GAP / 2 : YA, yc = an ? YA + GAP / 2 : YA;
      seg2(g.floA, .12, -.1, yb); seg2(g.floB, .12, yc, YT - .03); seg2(g.casA, .16, -.08, yb); seg2(g.casB, .16, yc, YT - .05);
      ach(g, 'xilema', [-.03, .45, 0]); ach(g, 'floema', [.1, 1.55, 0]); ach(g, 'casca', [.16, .3, -.05]); ach(g, 'medula', [0, 1.9, 0]);
      if (an) ach(g, 'anel', [.09, YA, 0]);
      // ramos, folhas e fruto
      const sw = RED() ? 0 : Math.sin(t * .8) * .04, top = [0, YT, 0];
      RAMOS.forEach(([a, y, L], i) => {
        const b = [0, y, 0], e = add(b, [Math.cos(a) * L, .35 + sw, -Math.sin(a) * L * .6]);
        V3.bastao(g, W.rod, b, e, .035, '#6B4A2B', 1, info.casca);
        for (let j = 0; j < 3; j++) { const p = lerp3(b, e, .45 + j * .27); V3.paFolha(g, g.F, p, a + (j - 1) * .9, .45 + sw, j % 2 ? .4 : -.4, .5, .3, '#4FA85A', 1, info.folha); }
        if (i === 0) ach(g, 'folha', add(e, [0, .2, 0]));
        if (i === 3) { const fp = add(lerp3(b, e, .6), [0, -.18, 0]); V3.bastao(g, W.rod, lerp3(b, e, .6), fp, .012, '#6B4A2B'); V3.bola(g, fp, .14, '#E8742A', 1, info.fruto); g.fp = fp; ach(g, 'fruto', add(fp, [-.1, -.1, 0])); }
      });
      for (let j = 0; j < 4; j++) V3.paFolha(g, g.F, top, j / 4 * TAU + .4, .9, 0, .45, .3, '#5FB04A', 1, info.folha);
      // raiz: pivotante com ramos e pelos absorventes; escurece quando fica sem açúcar
      const rc = dead > .01 ? lerpHex('#C9A27A', '#3A2A1C', dead) : '#C9A27A', ponta = [0, -1.6, -.1];
      V3.bastao(g, W.rod, [0, -.05, -.02], ponta, .05, rc, 1, info.raiz);
      RAIZ.forEach(([sd, y, z], i) => {
        const b = [0, -y * .9, -.05], e = [sd * 1.25, -y - .35, z];
        V3.bastao(g, W.rod, b, e, .03, rc, 1, info.raiz);
        for (let j = 0; j < 5; j++) { const p = lerp3(b, e, .6 + j * .08), q = add(p, [(hash(i * 7 + j, 2) - .5) * .12, -.08, (hash(i * 7 + j, 3) - .5) * .12]); V3.bastao(g, W.rod, p, q, .006, '#E8D5B8', 1, info.pelos); }
        if (i === 1) { ach(g, 'raiz', lerp3(b, e, .4)); ach(g, 'pelos', lerp3(b, e, .8)); }
      });
      // seiva bruta (azul) sobe pelo xilema; seiva elaborada (laranja) desce pelo floema
      const vel = RED() ? 0 : 1, nB = g.q.cel ? 10 : 16;
      for (let i = 0; i < nB; i++) {
        const f = fr(t * .09 * vel + i / nB), r = RAIZ[i % RAIZ.length], ram = RAMOS[i % 3];
        const path = [[r[0] * 1.1, -r[1] - .3, r[2]], [0, -r[1] * .9, -.03], [(i % 3 - 1) * .035, -.1, -.01], [(i % 3 - 1) * .035, ram[1], -.01], add([0, ram[1], 0], [Math.cos(ram[0]) * ram[2] * .7, .3, -Math.sin(ram[0]) * ram[2] * .4])];
        const p = trilha(path, f); V3.bola(g, p, .028, XIL, 1.1, info.seivaB);
      }
      const nE = g.q.cel ? 9 : 14;
      for (let i = 0; i < nE; i++) {
        const f = fr(t * .07 * vel + i / nE), sd = i % 2 ? 1 : -1, ram = RAMOS[i % 4];
        const alvo = i % 4 === 3 ? g.fp || [0, 0, 0] : [sd * .6, -1.2, -.2];
        const path = i % 4 === 3 ? [add([0, ram[1], 0], [Math.cos(ram[0]) * ram[2] * .8, .3, -Math.sin(ram[0]) * ram[2] * .5]), [sd * .1, ram[1], -.01], alvo]
          : [add([0, ram[1], 0], [Math.cos(ram[0]) * ram[2] * .8, .3, -Math.sin(ram[0]) * ram[2] * .5]), [sd * .1, ram[1], -.01], [sd * .1, -.08, -.01], alvo];
        let p = trilha(path, f);
        // anel: o açúcar para logo acima do corte
        if (an && i % 4 !== 3 && p[1] < yc + .03 && f > .2) p = [sd * .1, yc + .04 + (i % 4) * .045, -.01];
        V3.bola(g, p, .026, FLO, 1.1, info.seivaE);
      }
      ach(g, 'seivaB', [0, 1.2, 0]);
      V3.fimKit(W); V3.fim(g.F);
    },
    camera(g, P) {
      const d = V3.deitado(g);
      return d ? cam(g, P, 3.1, 2.75, { al: [0, .45, 0], th: .35, fi: .14 }) : cam(g, P, 1.9, 3.1, { al: [0, .5, 0], th: .35, fi: .14 });
    }
  });
  function lerpHex(a, b, t) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), c = s => Math.round(mix((A >> s) & 255, (B >> s) & 255, t)); return '#' + ((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1); }
})();
