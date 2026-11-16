/* LAB Ecologia: cenas 3D dos ciclos biogeoquímicos e do efeito estufa (Martin), sobre o kit do módulo Vírus e as peças
   de eco3d-pecas.js. Cada ciclo é uma maquete em corte (terra, subsolo, mar e ar): cada processo é uma trilha de
   bolinhas na cor do processo, com o elemento andando por ela. Os botões de processo e o toque numa trilha escolhem o
   destaque; o resto esmaece. Os nomes e as frases vêm das listas F_C, F_N e F_A do motor 2D, sem repetir texto.
   Efeito estufa: a mesma maquete com uma camada de gases no alto; a faixa de CO₂ enche a camada de moléculas e faz
   mais raios de calor voltarem para a superfície. Sem WebGL, as quatro cenas desenham o 2D antigo (plano B). */
'use strict';
(function () {
  const V3 = window.VIR3D, K3 = window.ECO3D, E = window.LAB_ECO; if (!V3 || !K3 || !E) return;
  const { V } = V3, { cl, add, hash, TAU } = V;
  const RED = () => V3.REDUZ();
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const cam = (g, P, hx, hy, o = {}) => V3.viva({ th: o.th == null ? .2 : o.th, fi: o.fi == null ? .22 : o.fi, d: V3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .4 : o.viva);
  const sem = s => String(s || '').replace(/<[^>]+>/g, '');
  const SOL = '#FFD35A', CALOR = '#FF6B7D', GELO = '#CFE0FF';
  const txt = (g, p, s, o = {}) => V3.texto(g, p, s, Object.assign({ s: g.q.cel ? 12 : 14, w: 600, bg: true, c: '#E8EDF7' }, o));

  // peças a partir da lista de processos do motor 2D: nome, frase (a legenda sem a parte em negrito) e cor
  function pecasDe(F, extra) {
    const P = {}; F.forEach(f => { P[f.id] = { nome: f.t, frase: sem(f.cap).replace(/^[^:]+:\s*/, ''), cor: f.c }; });
    return Object.assign(P, extra || {});
  }
  // desenha os processos: trilha + partículas; o escolhido fica forte e os outros esmaecem
  function processos(g, K, F, CAM, S, t) {
    F.forEach((f, i) => {
      const um = S.o === f.id, on = S.o === 'todos' || um, k = on ? 1 : .25, info = g.pecas[f.id];
      (CAM[f.id] || []).forEach((Pz, j) => {
        K3.trilho(g, K, Pz, f.c, k, { n: um ? 18 : 14, r: um ? .03 : .022, info });
        K3.particulas(g, K, Pz, f.c, t + j * .5 + i * .13, { n: f.n || 3, vel: (f.vel || .28) * 1.1, r: um ? .1 : .075, k });
        K3.cone(g, K, V.bez(Pz[0], Pz[1], Pz[2], .9), Pz[2], um ? .09 : .065, f.c, k, info);
      });
      const m = CAM[f.id] && CAM[f.id][0]; if (m) ach(g, f.id, V.bez(m[0], m[1], m[2], .5));
    });
  }
  // câmera: inteira de lado no computador; no celular, chega perto do processo escolhido
  function camCiclo(g, P, CAM, al) {
    const S = P.S, Pz = S.o && S.o !== 'todos' && CAM[S.o] && CAM[S.o][0];
    if (V3.deitado(g)) return cam(g, P, 4.9, 2.9, { al: al || [0, .9, 0], k: 1.12 });
    if (Pz) { const m = V.bez(Pz[0], Pz[1], Pz[2], .5); return cam(g, P, 2.1, 2.3, { al: [m[0] * .8, m[1] * .6 + .5, 0], viva: .2 }); }
    return cam(g, P, 3.3, 3.1, { al: [(al || [0])[0], 1.2, 0], th: .72, fi: .42, k: 1, viva: .25 });
  }
  const toqueDe = F => { const o = {}; F.forEach(f => { o[f.id] = f.id; }); return o; };
  const rotDe = F => F.map((f, i) => ({ pc: f.id, t: f.t.toLowerCase(), pr: i + 1 }));

  // =====================================================================================
  // CICLO DO CARBONO
  // =====================================================================================
  const CC = {
    foto: [[[-2.1, 3.2, 0], [-2.9, 3.1, -.1], [-3.1, 2.15, -.3]]],
    resp: [[[-1.1, 1.05, 0], [-1.25, 2.3, .1], [-.7, 3.15, 0]]],
    alim: [[[-2.2, .45, .35], [-1.8, 1.2, .3], [-1.35, .85, .05]]],
    decomp: [[[-2.7, .2, .95], [-4.6, 1.2, 1], [-3.7, 3.05, .4]]],
    comb: [[[.75, 1.35, -.4], [.4, 2.3, -.3], [.3, 3.15, 0]]],
    fossil: [[[-1.6, -.05, .95], [-1.4, -.7, 1.15], [-.6, -1.05, 1.1]]],
    oceano: [[[2.4, 3.15, 0], [2.0, 1.4, .3], [2.6, -.15, .2]], [[3.5, -.15, .2], [4.1, 1.4, .3], [3.6, 3.15, 0]]]
  };
  if (E.F_C) K3.cena('ciclos/carbono', {
    fit: 12, raio: 7, bolas: 40, pecas: pecasDe(E.F_C, { ar: { nome: 'CO₂ no ar', frase: 'Cerca de 0,04% do ar. É de onde a fotossíntese tira o carbono e para onde a respiração, a decomposição e a queima o devolvem.', cor: '#9AA3B2' }, fosseis: { nome: 'Combustíveis fósseis', frase: 'Carvão, petróleo e gás natural: carbono de seres soterrados há milhões de anos, fora do ciclo rápido.', cor: '#9AA3B2' } }),
    toque: toqueDe(E.F_C), rotulos: rotDe(E.F_C),
    montar(g) {
      g.K = K3.kit(g, { bolas: 900, bastoes: 200, folhas: 80, caixas: 20 });
      K3.placa(g, 6, .7, 3, [-1.5, -.35, 0], '#6E5236', null);
      K3.placa(g, 6.02, .06, 3.02, [-1.5, .0, 0], '#5F7A36', null, { roughness: .95 });
      K3.placa(g, 6, .5, 3, [-1.5, -.95, 0], '#4A3826', null);
      K3.placa(g, 4.4, .32, 2.6, [-1.2, -1.05, .21], '#3A3A46', 'fosseis', { roughness: .4, clearcoat: .5 });
      K3.placa(g, 3, 1.2, 3, [3, -.6, 0], '#3A4A5E', null);
      K3.agua(g, 3, 1.0, 3, [3, -.5, 0], 'oceano');
    },
    animar(g, P) {
      const S = P.S, t = P.t, K = g.K, pc = g.pecas, kk = id => (S.o === 'todos' || S.o === id ? 1 : .55);
      K3.arvore(g, K, [-3.1, .03, -.3], 2.2, kk('foto'), pc.foto);
      K3.capim(g, K, [-2.2, .03, .35], .6, kk('alim'), pc.alim, t); K3.capim(g, K, [-2.5, .03, .1], .5, kk('alim'), pc.alim, t + 1);
      K3.quad(g, K, [-1.1, .03, 0], 1.1, 2.8, kk('resp'), pc.resp, '#C9A27A', { chifre: true, baixo: true });
      K3.fabrica(g, K, [.5, .03, -.4], 1, kk('comb'), pc.comb, t);
      K3.cogumelo(g, K, [-2.9, .03, .95], .5, kk('decomp'), pc.decomp); K3.cogumelo(g, K, [-2.6, .03, 1.1], .35, kk('decomp'), pc.decomp, '#D9935E');
      K3.bacterias(g, K, [-2.3, .12, 1.0], .25, 10, kk('decomp'), pc.decomp, t);
      K3.alga(g, K, [2.3, -1.0, .4], .9, kk('oceano'), pc.oceano, t); K3.alga(g, K, [3.9, -1.0, -.3], .7, kk('oceano'), pc.oceano, t + 2);
      K3.peixe(g, K, [3.1 + (RED() ? 0 : Math.sin(t * .4) * .5), -.55, .4], .8, RED() ? 0 : (Math.cos(t * .4) > 0 ? 0 : Math.PI), kk('oceano'), pc.oceano, t);
      // CO₂ no ar
      for (let i = 0; i < (g.q.cel ? 6 : 9); i++) { const a = i * 2.3 + (RED() ? 0 : t * .15), p = [-3.8 + i * .95, 3.35 + Math.sin(a) * .15, -.6 + Math.cos(a * 1.3) * .3]; K3.co2(g, K, p, .7, a, .9, pc.ar); }
      txt(g, [0, 3.95, 0], 'CO₂ no ar', { f: E.FD }); ach(g, 'ar', [0, 3.4, 0]);
      txt(g, [-1.2, -1.05, 1.4], 'combustíveis fósseis', { s: 12, c: '#C9D3E6' });
      txt(g, [3, -1.0, 1.55], 'oceano', { s: 12, c: GELO });
      processos(g, K, E.F_C, CC, S, t);
      K3.fimKit(K);
    },
    camera: (g, P) => camCiclo(g, P, CC, [0, 1.1, 0])
  });

  // =====================================================================================
  // CICLO DO NITROGÊNIO (corte do solo na frente, com os nódulos e as bactérias)
  // =====================================================================================
  const CN = {
    fix: [[[-2.3, 3.15, 0], [-4.7, 1.6, .9], [-3.05, -.55, 1.12]]],
    amon: [[[.2, .12, .55], [-.1, -.2, 1.25], [-.85, -.7, 1.15]]],
    nitr: [[[-.6, -.85, 1.15], [.05, -.35, 1.25], [.7, -.85, 1.15]], [[1.2, -.85, 1.15], [1.85, -.35, 1.25], [2.5, -.85, 1.15]]],
    assim: [[[2.8, -.75, 1.15], [3.2, -.4, 1.2], [3.1, .1, .9]]],
    desn: [[[3.3, -.95, 1.15], [4.8, .9, 1.1], [3.9, 3.15, 0]]]
  };
  if (E.F_N) K3.cena('ciclos/nitrogenio', {
    fit: 12, raio: 7, bolas: 40, pecas: pecasDe(E.F_N, {
      ar: { nome: 'N₂ no ar', frase: 'Cerca de 78% do ar. Plantas e animais não conseguem usar o nitrogênio nessa forma.', cor: '#4D7DFF' },
      nodulos: { nome: 'Nódulos da raiz', frase: 'Bolinhas na raiz da leguminosa onde vivem as bactérias fixadoras (Rhizobium): elas recebem açúcar e a planta recebe amônia.', cor: '#F06AAE' },
      raio: { nome: 'Raios', frase: 'A energia dos raios também fixa um pouco de N₂, que chega ao solo com a chuva.', cor: SOL }
    }),
    toque: Object.assign(toqueDe(E.F_N), { nodulos: 'fix' }), rotulos: rotDe(E.F_N).concat([{ pc: 'nodulos', t: 'nódulos', pr: 7 }]),
    montar(g) {
      g.K = K3.kit(g, { bolas: 1000, bastoes: 260, folhas: 120, caixas: 20 });
      K3.placa(g, 9, 1.4, 2.4, [0, -.7, -.2], '#6E5236', null);
      K3.placa(g, 9.02, .06, 2.42, [0, .0, -.2], '#5F7A36', null, { roughness: .95 });
    },
    animar(g, P) {
      const S = P.S, t = P.t, K = g.K, pc = g.pecas, kk = id => (S.o === 'todos' || S.o === id ? 1 : .55);
      // leguminosa com raízes e nódulos à mostra no corte
      K3.arbusto(g, K, [-3, .03, .2], 1.3, kk('fix'), pc.fix, '#4FA85A');
      [[-.45, -.9], [0, -1.1], [.4, -.85]].forEach(([dx, y], i) => {
        const a = [-3, -.02, 1.02], b = [-3 + dx, y, 1.04]; K3.vara(g, K, a, b, .03, '#E8DCC0', 1, pc.fix);
        for (let j = 1; j <= 2; j++) { const q = V.lerp3(a, b, .4 + j * .25); K3.ovo(g, K, [q[0], q[1], 1.1], .07, .07, .05, '#F06AAE', kk('fix'), pc.nodulos); }
      });
      ach(g, 'nodulos', [-3.5, -.7, 1.1]);
      // boi e restos
      K3.quad(g, K, [0, .03, -.3], 1.2, 2.9, kk('amon'), pc.amon, '#C9A27A', { chifre: true, baixo: true });
      K3.ovo(g, K, [.25, .06, .45], .22, .07, .16, '#6B4A2B', kk('amon'), pc.amon);
      // capim com raízes
      K3.capim(g, K, [3, .03, .2], .8, kk('assim'), pc.assim, t); K3.capim(g, K, [2.6, .03, -.2], .6, kk('assim'), pc.assim, t + 1);
      [-.25, 0, .25].forEach(dx => K3.vara(g, K, [3, -.02, 1.02], [3 + dx, -.55, 1.04], .02, '#E8DCC0', 1, pc.assim));
      // bactérias do solo junto de cada forma química
      K3.bacterias(g, K, [-.85, -.55, 1.12], .25, 8, kk('amon'), pc.amon, t, '#2FCFBF');
      K3.bacterias(g, K, [.95, -.55, 1.12], .25, 8, kk('nitr'), pc.nitr, t, '#F7C13B');
      K3.bacterias(g, K, [3.6, -.6, 1.12], .25, 8, kk('desn'), pc.desn, t, '#F06AAE');
      [['NH₃', 'amônia', -.85], ['NO₂⁻', 'nitrito', .95], ['NO₃⁻', 'nitrato', 2.75]].forEach(q => { txt(g, [q[2], -1.0, 1.2], q[0] + (g.q.cel ? '' : ' ' + q[1]), { f: E.FD, s: g.q.cel ? 13 : 14 }); });
      // N₂ no ar e raio que pisca de vez em quando
      for (let i = 0; i < (g.q.cel ? 6 : 9); i++) { const a = i * 2.1 + (RED() ? 0 : t * .15), p = [-3.8 + i * .95, 3.35 + Math.sin(a) * .15, -.6 + Math.cos(a) * .3], d = [Math.cos(a) * .12, 0, Math.sin(a) * .12]; K3.ovo(g, K, add(p, d), .12, .12, .12, '#4D7DFF', .9, pc.ar); K3.ovo(g, K, add(p, [-d[0], 0, -d[2]]), .12, .12, .12, '#4D7DFF', .9, pc.ar); }
      txt(g, [0, 3.95, 0], 'N₂: cerca de 78% do ar', { f: E.FD }); ach(g, 'ar', [0, 3.4, 0]);
      if (RED() ? true : Math.floor(t * 1.2) % 5 === 0) { const z = [[4.2, 3.0], [3.95, 2.4], [4.2, 2.1], [3.9, 1.4]]; for (let i = 0; i < 3; i++) K3.vara(g, K, [z[i][0], z[i][1], -.8], [z[i + 1][0], z[i + 1][1], -.8], .04, SOL, 1, pc.raio); ach(g, 'raio', [4.1, 2.4, -.8]); }
      processos(g, K, E.F_N, CN, S, t);
      K3.fimKit(K);
    },
    camera: (g, P) => camCiclo(g, P, CN, [0, .9, 0])
  });

  // =====================================================================================
  // CICLO DA ÁGUA
  // =====================================================================================
  const CA = {
    evap: [[[-3, .05, 0], [-3.4, 1.5, 0], [-2.3, 2.75, 0]]],
    transp: [[[.6, 1.5, -.3], [.4, 2.3, -.2], [1.1, 3.0, 0]]],
    cond: [[[-1.4, 3.35, 0], [.2, 4.2, 0], [1.7, 3.55, 0]]],
    prec: [[[2.6, 3.0, .2], [2.75, 2.0, .3], [2.6, .95, .3]]],
    infil: [[[1.4, .05, .95], [1.2, -.4, 1.2], [1.5, -.95, 1.15]]],
    esco: [[[2.4, .7, .7], [.6, .05, 1.05], [-1.3, .05, .75]]]
  };
  if (E.F_A) K3.cena('ciclos/agua', {
    fit: 12, raio: 7, bolas: 40, pecas: pecasDe(E.F_A, {
      sol: { nome: 'Sol', frase: 'O motor do ciclo: a energia da luz faz a água evaporar.', cor: SOL },
      lencol: { nome: 'Lençol freático', frase: 'Água guardada no subsolo, que abastece poços e nascentes. A vegetação ajuda a água a infiltrar.', cor: '#2A9FC9' },
      mar: { nome: 'Mar', frase: 'O maior reservatório de água do planeta e a maior fonte de vapor.', cor: '#2A9FC9' }
    }),
    toque: Object.assign(toqueDe(E.F_A), { lencol: 'infil' }), rotulos: rotDe(E.F_A),
    montar(g) {
      const T = g.T;
      g.K = K3.kit(g, { bolas: 900, bastoes: 300, folhas: 40, caixas: 20, cones: 40 });
      K3.placa(g, 3.4, 1.2, 2.6, [-3, -.6, 0], '#3A4A5E', null);
      K3.agua(g, 3.4, 1.0, 2.6, [-3, -.5, 0], 'mar');
      K3.placa(g, 5.6, .7, 2.6, [1.5, -.35, 0], '#6E5236', null);
      K3.placa(g, 5.62, .06, 2.62, [1.5, .0, 0], '#5F7A36', null, { roughness: .95 });
      K3.placa(g, 5.6, .5, 2.6, [1.5, -.95, 0], '#4A3826', null);
      K3.agua(g, 5.62, .3, 2.62, [1.5, -.95, 0], 'lencol');
      const mg = new T.ConeGeometry(1.4, 2.6, g.q.cel ? 7 : 9, 1); g.geos.push(mg);
      const mt = V3.peca(g, mg, K3.material(g, '#7D6A52'), null); mt.position.set(3.3, 1.3, -.5);
      const ng = new T.ConeGeometry(.48, .9, g.q.cel ? 7 : 9, 1); g.geos.push(ng);
      const nv = V3.peca(g, ng, K3.material(g, '#EEF3FF', { roughness: .5 }), null); nv.position.set(3.3, 2.16, -.5);
    },
    animar(g, P) {
      const S = P.S, t = P.t, K = g.K, pc = g.pecas, kk = id => (S.o === 'todos' || S.o === id ? 1 : .55);
      K3.luz(g, K, [-4.4, 3.6, -1], .4, SOL, 1.2); ach(g, 'sol', [-4.4, 4.1, -1]);
      K3.arvore(g, K, [.6, .03, -.3], 1.8, kk('transp'), pc.transp); K3.arvore(g, K, [-.3, .03, .3], 1.2, kk('transp'), pc.transp, '#38985A');
      K3.nuvem(g, K, [-1.8, 3.25, 0], 1.1, kk('cond'), pc.cond); K3.nuvem(g, K, [2.4, 3.45, 0], 1.3, kk('prec'), pc.prec, '#A9B6CF');
      // chuva
      for (let i = 0; i < (g.q.cel ? 8 : 14); i++) { const f = RED() ? hash(i, 5) : (t * .9 + hash(i, 5)) % 1, x = 2.0 + hash(i, 6) * 1.2, z = -.3 + hash(i, 7) * .8, y = 3.0 - f * 2.0; K3.vara(g, K, [x, y, z], [x - .02, y - .16, z], .012, '#7FC4E8', kk('prec'), pc.prec); }
      // rio que desce a encosta até o mar
      const rio = [[2.5, .75, .2], [1.6, .06, .45], [-1.3, .06, .4]];
      for (let i = 0; i < 16; i++) { const a = V.bez(rio[0], rio[1], rio[2], i / 16), b = V.bez(rio[0], rio[1], rio[2], (i + 1) / 16); K3.vara(g, K, a, b, .07, '#2A9FC9', kk('esco'), pc.esco); }
      txt(g, [-3, -.9, 1.5], 'mar', { s: 12, c: GELO }); txt(g, [1.5, -1.0, 1.5], 'lençol freático', { s: 12, c: GELO });
      processos(g, K, E.F_A, CA, S, t);
      K3.fimKit(K);
    },
    camera: (g, P) => camCiclo(g, P, CA, [0, 1.3, 0])
  });

  // =====================================================================================
  // EFEITO ESTUFA (impactos/estufa)
  // =====================================================================================
  const PE = {
    sol: { nome: 'Luz do Sol', frase: 'Atravessa a camada de gases de efeito estufa quase sem ser absorvida e aquece a superfície.', cor: SOL },
    gases: { nome: 'Gases de efeito estufa', frase: 'CO₂, metano (CH₄), óxido nitroso (N₂O) e vapor de água absorvem o calor que a superfície emite e mandam parte dele de volta.', cor: '#9AA3B2' },
    calor: { nome: 'Calor (infravermelho)', frase: 'A superfície aquecida emite infravermelho. Parte escapa para o espaço; parte é devolvida pelos gases.', cor: CALOR },
    fabrica: { nome: 'Queima de combustíveis fósseis', frase: 'Indústrias, usinas e veículos: a maior fonte de CO₂ no mundo.', cor: '#9AA3B2' },
    boi: { nome: 'Pecuária', frase: 'A digestão do gado libera metano (CH₄), um gás que retém mais calor do que o CO₂.', cor: '#F7C13B' },
    arvore: { nome: 'Floresta', frase: 'Guarda carbono na madeira e no solo. O desmatamento e as queimadas devolvem esse carbono ao ar: é a maior fonte brasileira de CO₂.', cor: '#3FBF6A' }
  };
  K3.cena('impactos/estufa', {
    fit: 12, raio: 7, bolas: 40, pecas: PE,
    rotulos: [{ pc: 'sol', t: 'luz do Sol', pr: 1 }, { pc: 'calor', t: 'calor (infravermelho)', pr: 2 }, { pc: 'gases', t: 'gases de efeito estufa', pr: 3 }, { pc: 'fabrica', t: 'combustíveis fósseis', pr: 4 }, { pc: 'boi', t: 'pecuária', pr: 5 }, { pc: 'arvore', t: 'floresta', pr: 6 }],
    montar(g) {
      const T = g.T;
      g.K = K3.kit(g, { bolas: 1100, bastoes: 200, folhas: 40, caixas: 30, brilhos: 300 });
      K3.placa(g, 8.4, .5, 2.6, [0, -.25, 0], '#6E5236', null);
      K3.placa(g, 8.42, .06, 2.62, [0, .0, 0], '#5F7A36', null, { roughness: .95 });
      const m = new T.MeshPhysicalMaterial({ color: '#9AA3B2', transparent: true, opacity: .12, roughness: .4, depthWrite: false, side: T.DoubleSide }); g.mats.push(m); g.camM = m;
      const cg = new T.BoxGeometry(8.4, .9, 2.6); g.geos.push(cg); const cm = V3.peca(g, cg, m, 'gases'); cm.position.set(0, 3.0, 0);
    },
    animar(g, P) {
      const S = P.S, t = P.t, K = g.K, pc = g.pecas, f = cl((S.v - 280) / 280, 0, 1), cel = g.q.cel;
      g.camM.opacity = .08 + .16 * f;
      K3.arvore(g, K, [-3.3, .03, -.2], 1.7, 1, pc.arvore); K3.arvore(g, K, [-2.5, .03, .4], 1.2, 1, pc.arvore, '#38985A');
      K3.fabrica(g, K, [-.9, .03, -.4], 1, 1, pc.fabrica, t);
      K3.quad(g, K, [.9, .03, .1], 1, 2.8, 1, pc.boi, '#C9A27A', { chifre: true, baixo: true });
      K3.carro(g, K, [2.5, .03, .5], 1, .3, 1, pc.fabrica);
      ach(g, 'arvore', [-3.3, 1.9, -.2]); ach(g, 'fabrica', [-.6, 1.9, -.4]); ach(g, 'boi', [1.2, 1.15, .1]);
      // moléculas na camada: quantas, conforme o CO₂ do ar
      const n = Math.round((cel ? 10 : 18) * S.v / 420);
      for (let i = 0; i < n; i++) { const a = hash(i, 9) * TAU + (RED() ? 0 : t * .2), p = [-4 + hash(i, 11) * 8, 2.7 + hash(i, 12) * .6 + Math.sin(a) * .05, -1.1 + hash(i, 13) * 2.2]; K3.co2(g, K, p, .55, a, 1, pc.gases); }
      ach(g, 'gases', [-1.5, 3.55, 0]);
      // luz do Sol: desce em linha reta
      const sp = [-3.9, 4.3, -.8]; K3.luz(g, K, sp, .38, SOL, 1.2); ach(g, 'sol', [-3.3, 4.5, -.8]);
      for (let i = 0; i < 3; i++) { const Pz = [sp, [-3.4 + i * .8, 2.6, -.5], [-2.6 + i * 1.2, .1, 0]]; K3.trilho(g, K, Pz, SOL, .8, { n: 12, r: .02, info: pc.sol }); K3.particulas(g, K, Pz, SOL, t + i * .3, { n: 2, vel: .35, r: .08 }); }
      // calor: pacotes de onda que sobem; com mais CO₂, mais deles batem na camada e voltam para a superfície
      const N = cel ? 6 : 9;
      for (let i = 0; i < N; i++) {
        const x = -2.4 + i / (N - 1) * 5.8, volta = (i * .618) % 1 < .3 + .55 * f, z = .35 - (i % 3) * .35;
        const sobe = [[x, .1, z], [x + .1, 1.3, z], [x, volta ? 2.55 : 5.2, z]], desce = [[x, 2.55, z], [x + .35, 1.3, z], [x + .55, .1, z]];
        K3.trilho(g, K, sobe, CALOR, .3, { n: 10, r: .012, info: pc.calor }); if (volta) K3.trilho(g, K, desce, CALOR, .3, { n: 10, r: .012, info: pc.calor });
        const fa = RED() ? (i * .37) % 1 : (t * .22 + i * .37) % 1;
        for (let k = 0; k < 7; k++) {
          const u = fa - k * .022; if (u < 0) continue;
          let q, al = 1 - k / 8;
          if (volta) q = u < .5 ? V.bez(sobe[0], sobe[1], sobe[2], u * 2) : V.bez(desce[0], desce[1], desce[2], (u - .5) * 2);
          else { q = V.bez(sobe[0], sobe[1], sobe[2], u); al *= 1 - Math.max(0, u - .7) / .3; }
          K3.luz(g, K, [q[0] + Math.sin(u * 60) * .07, q[1], q[2]], .055, CALOR, al);
        }
        if (i === 4) ach(g, 'calor', [x + .3, 1.6, z]);
      }
      K3.fimKit(K);
    },
    // termômetro do 2D, por cima do palco 3D
    sobre(g, S) {
      const X = E.X, W = E.W, H = E.H, cel = W < 560, d = 3 * Math.log2(S.v / 280), x0 = W - (cel ? 24 : 44), th = H * (cel ? .2 : .3), y0 = H * (cel ? .66 : .4);
      const rr = (x, y, w, h, r, f, s) => { X.beginPath(); X.roundRect ? X.roundRect(x, y, w, h, r) : X.rect(x, y, w, h); if (f) { X.fillStyle = f; X.fill(); } if (s) { X.strokeStyle = s; X.lineWidth = 1.5; X.stroke(); } };
      rr(x0 - 5, y0, 10, th, 5, 'rgba(19,26,43,.9)', GELO); const hh = th * cl(.25 + d / 4, 0, 1); rr(x0 - 3, y0 + th - hh, 6, hh, 3, CALOR);
      X.beginPath(); X.arc(x0, y0 + th + 4, 9, 0, TAU); X.fillStyle = CALOR; X.fill(); X.strokeStyle = GELO; X.lineWidth = 1.5; X.stroke();
      E.tx((d > 0 ? '+' : '') + d.toFixed(1).replace('.', ',') + ' °C', x0 + 10, y0 - 14, { a: 'right', f: E.FD, s: cel ? 13 : 15, bg: true, c: CALOR });
    },
    camera(g, P) {
      if (V3.deitado(g)) return cam(g, P, 4.6, 2.8, { al: [0, 2.1, 0], th: .15, fi: .12, k: 1.12 });
      return cam(g, P, 3.4, 2.7, { al: [-.3, 2.5, 0], th: .15, fi: .14, viva: .2 });
    }
  });
})();
