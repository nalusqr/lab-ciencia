/* LAB Ecologia: cenas 3D de cadeias e energia (Martin), sobre o kit do módulo Vírus e as peças de eco3d-pecas.js.
   Cadeia alimentar: um pedaço de campo do Cerrado com capim, gafanhoto, sapo, cobra e gavião em fila; a energia anda
   de um ser ao seguinte em bolinhas de luz que encolhem a cada passo (só cerca de 10% passa adiante), o calor da
   respiração sobe de cada ser e os restos descem para os decompositores. A faixa Destaque e o toque num ser escolhem.
   Fluxo de energia: quatro tanques de vidro, um por nível trófico, com a energia guardada em cada um; a faixa muda a
   eficiência entre níveis e os tanques enchem ou esvaziam.
   Pirâmides ecológicas: degraus quadrados empilhados, com a largura de cada nível (escala logarítmica, como no 2D) e um
   ser de cada nível em cima do degrau; as pirâmides invertidas viram de cabeça para baixo na hora.
   Sem WebGL, as três cenas desenham o 2D antigo (plano B). */
'use strict';
(function () {
  const V3 = window.VIR3D, K3 = window.ECO3D, E = window.LAB_ECO; if (!V3 || !K3 || !E) return;
  const { V } = V3, { cl, mix, add, hash, TAU } = V;
  const RED = () => V3.REDUZ();
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const cam = (g, P, hx, hy, o = {}) => V3.viva({ th: o.th == null ? .25 : o.th, fi: o.fi == null ? .3 : o.fi, d: V3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .5 : o.viva);
  const nb = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const dec = (n, k) => n.toFixed(k).replace('.', ',');
  const kJ = v => (v >= 10 ? nb(v) : dec(v, 1)) + ' kJ';
  const SOL = '#FFD35A', CALOR = '#FF6B7D', DEC = '#2FCFBF';

  // =====================================================================================
  // CADEIA ALIMENTAR
  // =====================================================================================
  const NV = ['capim', 'gafanhoto', 'sapo', 'cobra', 'gaviao'];
  const PC = {
    capim: { nome: 'Capim: produtor', frase: '1º nível trófico. Faz fotossíntese e guarda a energia da luz na matéria orgânica que fabrica.', cor: '#3FBF6A' },
    gafanhoto: { nome: 'Gafanhoto: consumidor primário', frase: 'Herbívoro, no 2º nível trófico. Recebe cerca de 10% da energia guardada no capim.', cor: '#F7C13B' },
    sapo: { nome: 'Sapo: consumidor secundário', frase: 'Carnívoro, no 3º nível trófico. Come o gafanhoto.', cor: '#F25C3B' },
    cobra: { nome: 'Cobra: consumidor terciário', frase: 'No 4º nível trófico. Come o sapo.', cor: '#9A6BFF' },
    gaviao: { nome: 'Gavião: consumidor quaternário', frase: 'No 5º nível trófico, o topo desta cadeia. Recebe uma fração muito pequena da energia que entrou no capim.', cor: '#F06AAE' },
    decomp: { nome: 'Decompositores', frase: 'Fungos e bactérias decompõem restos, fezes e corpos de todos os níveis e devolvem os nutrientes ao solo.', cor: DEC },
    calor: { nome: 'Calor da respiração', frase: 'A maior parte da energia de cada nível é gasta na respiração celular e sai como calor. Ela não volta para a cadeia.', cor: CALOR },
    sol: { nome: 'Luz do Sol', frase: 'A fonte de energia da cadeia. Só os produtores conseguem captá-la.', cor: SOL }
  };
  const XC = [-3.2, -1.6, 0, 1.6, 3.2], YC = [0, 0, 0, 0, 1.55];
  const ENER = [10000, 1000, 100, 10, 1];

  K3.cena('teias/cadeia', {
    fit: 11, raio: 7, bolas: 60, pecas: PC,
    toque: { capim: 0, gafanhoto: 1, sapo: 2, cobra: 3, gaviao: 4, decomp: 5 },
    rotulos: [{ pc: 'capim', t: 'produtor', pr: 1 }, { pc: 'gafanhoto', t: 'consumidor primário', pr: 2 }, { pc: 'sapo', t: 'consumidor secundário', pr: 3 }, { pc: 'cobra', t: 'consumidor terciário', pr: 4 },
      { pc: 'gaviao', t: 'consumidor quaternário', pr: 5 }, { pc: 'decomp', t: 'decompositores', pr: 6 }, { pc: 'calor', t: 'calor', pr: 8 }, { pc: 'sol', t: 'luz', pr: 9 }],
    montar(g) {
      g.K = K3.kit(g, { bolas: 900, bastoes: 300, folhas: 140 });
      K3.placa(g, 8.6, .4, 3.4, [0, -.2, 0], '#6E5236', null);
      K3.placa(g, 8.62, .06, 3.42, [0, .0, 0], '#5F7A36', null, { roughness: .95 });
      K3.placa(g, 2.2, .07, 1, [0, .02, 1.05], '#4A3624', 'decomp');
    },
    animar(g, P) {
      const S = P.S, t = P.t, K = g.K, pc = g.pecas, v = S.v | 0, tudo = v === 5;
      const kk = i => (tudo || i === v ? 1 : .32);
      // sol e luz entrando no capim
      const sp = [-4.4, 3.1, -.6]; K3.luz(g, K, sp, .32, SOL, 1.2); ach(g, 'sol', [-4.4, 3.5, -.6]);
      const Lz = [sp, [-3.8, 2.4, -.3], [XC[0], .55, 0]]; K3.particulas(g, K, Lz, SOL, t, { n: 4, vel: .35, r: .06, k: kk(0) });
      // capim (vários tufos)
      [[-.25, -.2], [.25, .1], [0, .35], [-.3, .4], [.3, -.35]].forEach(([dx, dz], i) => K3.capim(g, K, [XC[0] + dx, .03, dz], .75, kk(0), pc.capim, t + i));
      ach(g, 'capim', [XC[0], .75, 0]);
      K3.gafanhoto(g, K, [XC[1], .03, 0], 1.25, .1, kk(1), pc.gafanhoto, t); ach(g, 'gafanhoto', [XC[1], .55, 0]);
      K3.sapo(g, K, [XC[2], .03, 0], 1.2, -.2, kk(2), pc.sapo, t); ach(g, 'sapo', [XC[2], .65, 0]);
      K3.cobra(g, K, [XC[3], .03, .1], 1.05, -.3, kk(3), pc.cobra, t); ach(g, 'cobra', [XC[3], .35, 0]);
      const gv = [XC[4] + (RED() ? 0 : Math.sin(t * .5) * .25), YC[4] + (RED() ? 0 : Math.sin(t * .9) * .1), RED() ? 0 : Math.cos(t * .5) * .25];
      K3.gaviao(g, K, gv, 1.3, Math.PI + .25, kk(4), pc.gaviao, t); ach(g, 'gaviao', add(gv, [0, .5, 0]));
      // energia: de quem é comido para quem come; cada bolinha encolhe (cerca de 10% passa adiante)
      for (let i = 0; i < 4; i++) {
        const a = [XC[i] + .35, (i ? .5 : .55) + YC[i], 0], b = [XC[i + 1] - .4, .45 + YC[i + 1] * .9, 0], c = [(a[0] + b[0]) / 2, Math.max(a[1], b[1]) + .75, 0];
        const on = tudo || v === i || v === i + 1, k = on ? 1 : .35, Pz = [a, c, b];
        K3.trilho(g, K, Pz, '#E8EDF7', k, { n: 12, r: .018 });
        K3.particulas(g, K, Pz, SOL, t + i * .4, { n: 3, vel: .45, r: .085 * Math.pow(.62, i), enc: .35, k });
        K3.cone(g, K, V.bez(Pz[0], Pz[1], Pz[2], .9), b, .06, '#E8EDF7', k);
        if (on && !tudo) V3.ficha(g, c, 'cerca de 10% passa', SOL, { pr: 2, dy: -1 });
      }
      // calor: sobe de cada ser, em ondinhas
      for (let i = 0; i < 5; i++) {
        const base = [XC[i] - .25, (i === 4 ? YC[4] : .7), -.35], k = kk(i) * .9;
        for (let j = 0; j < 3; j++) { const f = RED() ? (j + .5) / 3 : (t * .5 + j / 3 + i * .17) % 1; K3.luz(g, K, add(base, [Math.sin(f * 9 + i) * .08, f * 1.1, 0]), .05 * (1 - f * .5), CALOR, k * (1 - f * .6)); }
        if (i === (tudo ? 0 : v) && v < 5) ach(g, 'calor', add(base, [0, 1.2, 0]));
      }
      // decompositores: fungos e bactérias num pedaço de solo escuro, com restos que descem de todos os níveis
      const kd = tudo ? 1 : .45, dc = [0, .06, 1.05];
      K3.cogumelo(g, K, [-.7, .06, 1.05], .75, kd, pc.decomp, '#C7744A'); K3.cogumelo(g, K, [-.4, .06, 1.2], .5, kd, pc.decomp, '#D9935E'); K3.cogumelo(g, K, [-.95, .06, .9], .4, kd, pc.decomp, '#B8653E');
      K3.bacterias(g, K, [.5, .14, 1.05], .45, g.q.cel ? 16 : 26, kd, pc.decomp, t);
      ach(g, 'decomp', [0, .6, 1.1]);
      for (let i = 0; i < 5; i++) {
        const a = [XC[i], i === 4 ? YC[4] - .2 : .15, .3], Pz = [a, [mix(a[0], 0, .6), .25, .9], dc];
        K3.trilho(g, K, Pz, DEC, tudo ? .9 : .3, { n: 10, r: .014 });
        if (tudo) K3.particulas(g, K, Pz, DEC, t + i * .3, { n: 2, vel: .25, r: .045 });
      }
      // fichas de energia: a do ser em destaque (ou todas, se o destaque é o dos decompositores)
      for (let i = 0; i < 5; i++) if (i === v || (tudo && !g.q.cel)) V3.ficha(g, add([XC[i], YC[i] + (i === 4 ? .6 : 1.25), 0], [0, 0, 0]), kJ(ENER[i]), PC[NV[i]].cor, { pr: i === v ? 1 : 4, dy: -1 });
      K3.fimKit(K);
    },
    camera(g, P) {
      const v = P.S.v | 0;
      if (V3.deitado(g)) return cam(g, P, 4.7, 1.9, { al: [0, .9, .2], th: .18, fi: .3 });
      if (v === 5) return cam(g, P, 2.2, 1.6, { al: [0, .5, .6], th: .2, fi: .45, viva: .3 });
      return cam(g, P, 1.9, 1.7, { al: [v < 4 ? XC[v] + .7 : XC[v] - .4, .25 + YC[v] * .6, 0], th: .18, fi: .28, viva: .3 });
    }
  });

  // =====================================================================================
  // FLUXO DE ENERGIA: tanques por nível trófico
  // =====================================================================================
  const NIVF = [['Produtores', '#3FBF6A'], ['Consumidores primários', '#F7C13B'], ['Consumidores secundários', '#F25C3B'], ['Consumidores terciários', '#9A6BFF']];
  const PF = {
    t0: { nome: 'Produtores', frase: 'Guardam na matéria orgânica parte da energia da luz. Aqui, 10 000 kJ por m² em um ano.', cor: '#3FBF6A' },
    t1: { nome: 'Consumidores primários', frase: 'Recebem só a fração da energia dos produtores que vira biomassa nova deles.', cor: '#F7C13B' },
    t2: { nome: 'Consumidores secundários', frase: 'Dois passos depois dos produtores: com 10% por passo, 1% da energia inicial.', cor: '#F25C3B' },
    t3: { nome: 'Consumidores terciários', frase: 'Três passos depois: com 10% por passo, 0,1% da energia inicial. Por isso as cadeias são curtas.', cor: '#9A6BFF' },
    calor: { nome: 'Calor da respiração', frase: 'A maior parte da energia de cada nível sai como calor na respiração celular e não volta.', cor: CALOR },
    dec: { nome: 'Decompositores', frase: 'Recebem a energia de restos, fezes e corpos mortos de todos os níveis.', cor: DEC },
    sol: { nome: 'Luz do Sol', frase: 'Entra no ecossistema pelos produtores. O fluxo de energia é de mão única.', cor: SOL }
  };
  const XF = [-3, -1, 1, 3];
  K3.cena('energia/fluxo', {
    fit: 11, raio: 7, bolas: 40, pecas: PF,
    rotulos: [{ pc: 't0', t: 'produtores', pr: 1 }, { pc: 't1', t: 'primários', pr: 2 }, { pc: 't2', t: 'secundários', pr: 3 }, { pc: 't3', t: 'terciários', pr: 4 }, { pc: 'calor', t: 'calor', pr: 5 }, { pc: 'dec', t: 'decompositores', pr: 6 }, { pc: 'sol', t: 'luz', pr: 7 }],
    montar(g) {
      const T = g.T;
      g.K = K3.kit(g, { bolas: 500, bastoes: 60 });
      K3.placa(g, 8.6, .25, 2.2, [0, -.125, 0], '#1E2740', null, { roughness: .6 });
      K3.placa(g, 8.2, .1, .7, [0, .05, 1.25], '#24524E', 'dec');
      g.vidro = new T.MeshPhysicalMaterial({ color: '#CFE0FF', transparent: true, opacity: .16, roughness: .08, clearcoat: 1, depthWrite: false, side: T.DoubleSide }); g.mats.push(g.vidro);
      const cg = new T.CylinderGeometry(.62, .62, 2.6, g.q.cel ? 24 : 40, 1, true); g.geos.push(cg);
      g.liq = []; XF.forEach((x, i) => {
        const tq = V3.peca(g, cg, g.vidro, 't' + i); tq.position.set(x, 1.3, 0);
        const lm = new T.MeshPhysicalMaterial({ color: NIVF[i][1], roughness: .25, clearcoat: .8, transparent: true, opacity: .82, emissive: new T.Color(NIVF[i][1]), emissiveIntensity: .18 }); g.mats.push(lm);
        const lg = new T.CylinderGeometry(.56, .56, 1, g.q.cel ? 24 : 40); g.geos.push(lg);
        const l = V3.peca(g, lg, lm, 't' + i); l.position.set(x, .5, 0); g.liq.push(l);
      });
      g.h = [0, 0, 0, 0];
    },
    animar(g, P) {
      const S = P.S, t = P.t, K = g.K, pc = g.pecas, ef = S.v / 100, dt = RED() ? 1 : Math.min(1, g.dt * 4 + (g.dt ? 0 : 1));
      const sp = [-4.3, 2.3, -.3]; K3.luz(g, K, sp, .28, SOL, 1.2); ach(g, 'sol', [-4.3, 2.7, -.3]);
      K3.particulas(g, K, [sp, [-3.6, 3.1, 0], [XF[0], 2.75, 0]], SOL, t, { n: 4, vel: .4, r: .06 });
      for (let i = 0; i < 4; i++) {
        const En = 10000 * Math.pow(ef, i), alvo = 2.4 * Math.pow(En / 10000, .28);
        g.h[i] += (alvo - g.h[i]) * dt; const h = Math.max(.02, g.h[i]), l = g.liq[i];
        l.scale.y = h; l.position.y = h / 2 + .02;
        // tampa e base do tanque
        K3.caixa(g, K, [XF[i], .01, 0], 1.4, .04, 1.4, '#2C3757', 1);
        V3.texto(g, [XF[i], h + .35, 0], kJ(En), { f: E.FD, s: g.q.cel ? 12 : 14, w: 500, bg: true, c: '#E8EDF7' });
        ach(g, 't' + i, [XF[i], -.15, .7]);
        // calor que sai pelo alto de cada tanque
        for (let j = 0; j < 3; j++) { const f = RED() ? (j + .5) / 3 : (t * .45 + j / 3 + i * .2) % 1; K3.luz(g, K, [XF[i] + .25 + Math.sin(f * 8 + i) * .1, h + .5 + f * 1.2, -.2], .055 * (1 - f * .5), CALOR, 1 - f * .6); }
        if (i === 1) ach(g, 'calor', [XF[1] + .3, h + 1.9, -.2]);
        // passagem para o nível seguinte
        if (i < 3) {
          const a = [XF[i] + .66, Math.min(h, 1.2) * .5 + .15, .2], b = [XF[i + 1] - .66, .3, .2], c = [(a[0] + b[0]) / 2, Math.max(a[1], b[1]) + .5, .4], Pz = [a, c, b];
          K3.trilho(g, K, Pz, '#E8EDF7', 1, { n: 10, r: .016 }); K3.cone(g, K, V.bez(a, c, b, .86), b, .055, '#E8EDF7', 1);
          K3.particulas(g, K, Pz, SOL, t + i * .3, { n: 3, vel: .5, r: .07 * Math.pow(.7, i) });
          V3.ficha(g, c, S.v + '%', '#FFB347', { pr: 2, dy: -1 });
        }
        // restos para os decompositores
        K3.trilho(g, K, [[XF[i] - .2, .1, .6], [XF[i] - .2, .08, 1], [XF[i] - .2, .1, 1.25]], DEC, .7, { n: 4, r: .016 });
      }
      ach(g, 'dec', [0, .2, 1.3]);
      K3.fimKit(K);
    },
    camera(g, P) {
      if (V3.deitado(g)) return cam(g, P, 4.6, 2.1, { al: [0, 1.3, 0], th: .12, fi: .2 });
      return cam(g, P, 4.3, 2.4, { al: [0, 1.3, 0], th: .1, fi: .22, viva: .2, k: .98 });
    }
  });

  // =====================================================================================
  // PIRÂMIDES ECOLÓGICAS: degraus quadrados
  // =====================================================================================
  const COR = ['#3FBF6A', '#F7C13B', '#F25C3B', '#9A6BFF'];
  const PP = { n0: { nome: 'Base', frase: '', cor: COR[0] }, n1: { nome: '', frase: '', cor: COR[1] }, n2: { nome: '', frase: '', cor: COR[2] }, n3: { nome: '', frase: '', cor: COR[3] } };
  const FRASE = {
    energia: ['Produtores: a base sempre recebe a maior quantidade de energia.', 'Herbívoros: cerca de 10% da energia dos produtores.', 'Carnívoros: cerca de 10% da energia dos herbívoros.', 'Carnívoros de topo: o menor degrau. A pirâmide de energia nunca se inverte.'],
    biomassa: ['Plantas: a maior massa de matéria orgânica do campo.', 'Herbívoros: bem menos massa do que as plantas.', 'Carnívoros: menos massa ainda.', 'Carnívoros de topo: o menor degrau.'],
    biomassaInv: ['Fitoplâncton: pouca massa em cada instante, mas se reproduz muito depressa.', 'Zooplâncton: num dado instante, pesa mais do que o fitoplâncton que o sustenta.'],
    numeros: ['Pés de capim: muitos produtores pequenos.', 'Gafanhotos: menos indivíduos.', 'Sapos: menos ainda.', 'Cobras: poucos indivíduos no topo.'],
    numerosInv: ['Uma única árvore grande.', 'Centenas de lagartas comendo as folhas da mesma árvore.', 'Pássaros que comem as lagartas.']
  };
  // um ser em cima de cada degrau (desenho de cada tipo)
  const SERES = {
    energia: ['capim', 'gafanhoto', 'sapo', 'cobra'], numeros: ['capim', 'gafanhoto', 'sapo', 'cobra'],
    biomassa: ['arvore', 'boi', 'sapo', 'gaviao'], biomassaInv: ['alga', 'zoo'], numerosInv: ['arvore', 'lagarta', 'gaviao']
  };
  function ser(g, K, id, p, s, k, info, t) {
    if (id === 'capim') { K3.capim(g, K, add(p, [-.12, 0, 0]), s * .7, k, info, t); K3.capim(g, K, add(p, [.15, 0, .05]), s * .6, k, info, t + 1); }
    else if (id === 'gafanhoto') K3.gafanhoto(g, K, p, s * 1.1, .4, k, info, t);
    else if (id === 'sapo') K3.sapo(g, K, p, s, .3, k, info, t);
    else if (id === 'cobra') K3.cobra(g, K, p, s * .8, .5, k, info, t);
    else if (id === 'arvore') K3.arvore(g, K, p, s * 1.1, k, info);
    else if (id === 'boi') K3.quad(g, K, p, s * .7, .5, k, info, '#C9A27A', { chifre: true, baixo: true });
    else if (id === 'gaviao') K3.gaviao(g, K, add(p, [0, .35 * s, 0]), s * .8, .5, k, info, t);
    else if (id === 'alga') { for (let i = 0; i < 5; i++) K3.ovo(g, K, add(p, [Math.cos(i * 1.3) * .25 * s, .08 * s, Math.sin(i * 1.3) * .2 * s]), .07 * s, .07 * s, .07 * s, '#5FB89A', k, info); }
    else if (id === 'zoo') { for (let i = 0; i < 4; i++) { const q = add(p, [Math.cos(i * 1.6) * .25 * s, .12 * s, Math.sin(i * 1.6) * .22 * s]); K3.ovo(g, K, q, .1 * s, .07 * s, .07 * s, '#E6C15A', k, info, i); K3.vara(g, K, q, add(q, [0, .14 * s, .05 * s]), .01 * s, '#E6C15A', k, info); } }
    else if (id === 'lagarta') { for (let j = 0; j < 3; j++) for (let i = 0; i < 6; i++) K3.ovo(g, K, add(p, [(i * .07 - .2) * s, .05 * s, (j - 1) * .25 * s]), .045 * s, .045 * s, .045 * s, i ? '#7FB83A' : '#4E7A22', k, info); }
  }

  K3.cena('energia/piramides', {
    fit: 10, raio: 6, bolas: 40, pecas: PP,
    rotulos: [],
    montar(g) { g.K = K3.kit(g, { bolas: 700, bastoes: 200, folhas: 60, caixas: 20 }); },
    animar(g, P) {
      const S = P.S, t = P.t, K = g.K, tipo = S.o || 'energia', w = S.w || [0, 0, 0, 0], n = (FRASE[tipo] || []).length;
      const Wm = g.q.cel ? 3.4 : 4.2, bh = .5, cel = g.q.cel;
      K3.caixa(g, K, [0, -.06, 0], Wm + .8, .08, Wm + .8, '#1E2740', 1);
      if (E.PIR && E.PIR[tipo]) V3.texto(g, [0, 4 * bh + .45, 0], E.PIR[tipo].u, { s: cel ? 12 : 13, w: 400, bg: true, c: '#9DA9C4' });
      for (let i = 0; i < 4; i++) {
        if (w[i] < .01) continue;
        const L = Math.max(.25, Wm * w[i]), y = i * bh + bh / 2, id = 'n' + i, pc = g.pecas[id];
        K3.caixa(g, K, [0, y, 0], L, bh * .92, L, COR[i], 1, pc);
        if (i < n && FRASE[tipo]) { pc.frase = FRASE[tipo][i]; pc.cor = COR[i]; }
        // ser em cima do degrau, na faixa da frente que fica à mostra (ou no topo, se é o último)
        const Lc = i + 1 < 4 && w[i + 1] > .01 ? Math.max(.25, Wm * w[i + 1]) : 0, sid = (SERES[tipo] || [])[i];
        if (sid && i < n && (Lc === 0 || L - Lc > .5)) { const zf = Lc ? (L / 2 + Lc / 2) / 2 : 0, s = Lc ? cl((L - Lc) / 2 * 1.1, .35, .8) : cl(L * .5, .35, .8); ser(g, K, sid, [Lc ? -L * .18 : 0, y + bh * .46, zf], s, 1, pc, t); }
        if (i < n) {
          const nm = pc.nome || '', val = pc.val || '';
          V3.texto(g, [L / 2 + .15, y, L / 2], nm, { a: 'left', s: cel ? 12 : 14, w: 600, bg: true, c: '#E8EDF7' });
          V3.texto(g, [-L / 2 - .15, y, L / 2], val, { a: 'right', f: E.FD, s: cel ? 12 : 13, w: 500, bg: true, c: COR[i] });
        }
      }
      K3.fimKit(K);
    },
    camera(g, P) {
      const d = V3.deitado(g);
      return cam(g, P, d ? 3.4 : 2.0, 1.4, { al: [0, d ? .8 : .75, 0], th: .62, fi: .32, viva: .25, k: d ? 1.38 : 1.0 });
    }
  });
  // nomes e valores de cada nível vêm do quadro PIR do motor 2D
  (function () {
    const c = E.SC['energia/piramides']; if (!c || !E.PIR) return;
    const d = c.draw; c.draw = function (t, S) {
      const Q = E.PIR[S.o]; if (Q) for (let i = 0; i < 4; i++) { const p = PP['n' + i], q = Q.l[i]; p.nome = q ? q[0] : ''; p.val = q ? (q[1] >= 10 ? nb(q[1]) : dec(q[1], 1).replace(',0', '')) : ''; }
      return d.call(this, t, S);
    };
  })();
})();
