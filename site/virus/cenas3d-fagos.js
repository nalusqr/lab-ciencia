/* LAB Vírus: cenas 3D dos Fagos (Martin), sobre o kit vir3d.js e as peças de vir3d-pecas.js.
   Ciclo lítico: o fago T4 desce sobre a Escherichia coli em corte, abre as fibras, contrai a bainha e injeta só o DNA; o
   cromossomo da bactéria é picotado, aparecem cópias do DNA do fago e peças soltas que se montam em fagos novos; a parede
   se rompe e os fagos se espalham. Ciclo lisogênico: o fago λ injeta o DNA, que se fecha em círculo e entra no cromossomo
   (prófago); a bactéria se divide três vezes e as oito filhas levam o prófago; a luz UV induz uma delas, que monta fagos e
   arrebenta. Os modos de cartões, a placa de cultura e as condições continuam no desenho plano. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.kitV) return;
  const { V, K } = V3, { cl, mix, sst, add, sub, mul, nrm, hash, lerp3, TAU } = V;
  const RED = () => V3.REDUZ();
  const sg = (a, b, x) => cl((x - a) / (b - a), 0, 1);
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const cam = (g, P, hx, hy, o = {}) => V3.viva({ th: o.th == null ? .3 : o.th, fi: o.fi == null ? .22 : o.fi, d: V3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .5 : o.viva);
  const CIT = '#33244A', PAREDE = C.parede;

  // bactéria em corte: parede (anel verde na face cortada) e citoplasma escuro; o plano de corte abre a metade da frente
  function bacteria(g, pl, pc) {
    const T = g.T, geo = V3.capsula(g, 1, 1.2, g.q.cel ? 28 : 40), gr = new T.Group(); g.raiz.add(gr);
    const a = V3.solido(g, geo, PAREDE, [pl], { corte: '#5E7A2A', kc: 1, pai: gr, pc, m: { p: { roughness: .55, sheen: .6, sheenColor: new T.Color('#E8FFB0') }, rim: '#E6FFB0', rimK: .3 } });
    const b = V3.solido(g, geo, '#C25A8E', [pl], { corte: CIT, kc: 1, pai: gr, pc, m: { p: { roughness: .5 } } }); b.scale.setScalar(.93);
    gr.rotation.z = Math.PI / 2; return gr;
  }
  // pontos de um ribossomo dentro da metade de trás de uma cápsula de meio comprimento h e raio r
  const RIBO = Array.from({ length: 34 }, (_, i) => [(hash(i, 1) - .5) * 2, (hash(i, 2) - .5) * 1.4, -.1 - hash(i, 3) * .7]);
  const dentro = (q, h, r) => { const x = Math.max(0, Math.abs(q[0] * h) - h * .55); return x * x / (r * r) + q[1] * q[1] * .25 + q[2] * q[2] < .7; };

  // =====================================================================================
  // CICLO LÍTICO (tm de 0 a 30, em minutos de animação)
  // =====================================================================================
  const F1N = ['Adsorção', 'Penetração', 'Síntese', 'Montagem', 'Liberação'];
  const f1Etapa = tm => tm < 3 ? 0 : tm < 6 ? 1 : tm < 15 ? 2 : tm < 24 ? 3 : 4;
  const tReal = tm => tm < 6 ? tm / 3 : 2 + (tm - 6) * 28 / 24;
  const PE1 = {
    cab: { nome: 'Cabeça do fago T4', frase: 'Capsídeo icosaédrico alongado, com o DNA do fago dentro. Depois da injeção, fica vazio do lado de fora.', cor: C.capsideo },
    cauda: { nome: 'Cauda (bainha e tubo)', frase: 'A bainha se contrai como uma seringa e empurra o tubo interno pela parede da bactéria.', cor: '#A7B1C6' },
    fibra: { nome: 'Fibras da cauda', frase: 'Prendem o fago a receptores da parede da bactéria: é a adsorção.', cor: '#D3DAE8' },
    dnaF: { nome: 'DNA do fago', frase: 'Só o DNA entra na bactéria. Ele passa a comandar os ribossomos e as enzimas dela.', cor: C.dnaClaro },
    dnaB: { nome: 'Cromossomo da bactéria', frase: 'DNA circular da bactéria. Uma das primeiras proteínas do fago o picota.', cor: C.dnaEscuro },
    ribo: { nome: 'Ribossomos da bactéria', frase: 'Fazem as proteínas do fago: o vírus usa a maquinaria da célula.', cor: C.ribo },
    bact: { nome: 'Escherichia coli', frase: 'Bactéria em corte: parede (verde), membrana e citoplasma.', cor: C.bacteria },
    novos: { nome: 'Fagos novos', frase: 'Cabeças, caudas e fibras se juntam sozinhas; cada cabeça recebe uma cópia do DNA. Saem de 100 a 200 por bactéria.', cor: C.capsideo }
  };
  const NF = 10;
  const SLOT = Array.from({ length: NF }, (_, j) => { const c = j % 5, r = (j / 5) | 0; return { p: [-1.5 + c * .75, r ? -.35 : .2, -.42], cab: [-1.5 + c * .75 + (hash(j, 4) - .5) * .9, (hash(j, 5) - .5) * 1.1, -.5], cau: [-1.5 + c * .75 + (hash(j, 6) - .5) * .9, (hash(j, 7) - .5) * 1.1, -.45], gir: (hash(j, 8) - .5) * 1.2 }; });
  const COP = Array.from({ length: 6 }, (_, i) => [-1.4 + i * .56, (hash(i, 9) - .5) * .6, -.5]);
  V3.cena('fagos/litico', {
    fit: 8, raio: 4, bolas: 200, pecas: PE1,
    so2D: S => !!S.modo,
    rotulos: [{ pc: 'cab', t: 'cabeça', pr: 1 }, { pc: 'fibra', t: 'fibras', pr: 3 }, { pc: 'cauda', t: 'cauda', pr: 2 }, { pc: 'dnaF', t: 'DNA do fago', pr: 4 }, { pc: 'dnaB', t: 'DNA da bactéria', pr: 5 }, { pc: 'ribo', t: 'ribossomos', pr: 7 }, { pc: 'novos', t: 'fagos novos', pr: 6 }, { pc: 'bact', t: 'bactéria', pr: 8 }],
    montar(g) {
      const T = g.T;
      g.pl = V3.corte(g, g.raiz, [0, 0, -1], 0);
      g.W = V3.kitV(g, { knobs: g.q.cel ? 1400 : 2400, rods: 900 });
      g.bac = bacteria(g, g.pl, 'bact');
      g.dnaM = V3.fis(g, C.dnaClaro, { p: { roughness: .4, clearcoat: .5 }, rimK: .3 });
      g.inj = V3.tubo(g, 90, g.q.cel ? 6 : 8, g.dnaM, null, 'dnaF');
      g.cop = COP.map(() => V3.tubo(g, 50, 6, g.dnaM, null, 'dnaF'));
      g.cromo = V3.laco(64, 1.45, .42, .18, 1.3, [0, 0, -.38]);
      g.q0 = new T.Quaternion(); g.q1 = new T.Quaternion();
    },
    animar(g, P) {
      const S = P.S, tm = S.v || 0, W = g.W, t = P.t;
      const kDesce = sst(0, 2, tm), kFix = sst(1.6, 3, tm), kContr = sst(3, 4, tm), kInj = sg(4, 6, tm);
      const kFrag = sst(6, 9, tm), kCop = sg(8, 15, tm), kPart = sg(10, 15, tm), kMont = sg(15, 23, tm), kLis = sg(24, 26, tm), kBur = sg(26, 30, tm);
      g.tm = tm;
      // bactéria (balança na lise e some na explosão)
      const tre = kLis > 0 && kBur <= 0 && !RED() ? Math.sin(t * 40) * .012 * kLis : 0;
      g.bac.visible = kBur < .04; g.bac.scale.set(1 + tre + kLis * .04, 1 - tre + kLis * .04, 1);
      if (kBur < .04) ach(g, 'bact', [1.9, -.55, 0]);
      // cromossomo (picotado na síntese) e ribossomos
      if (kFrag < 1) { V3.cadeia(g, W, g.cromo, .032, { pic: kFrag, fechado: true, info: g.pecas.dnaB }); if (kFrag < .5) ach(g, 'dnaB', g.cromo[10]); }
      if (kBur < .5) RIBO.forEach((q, i) => { if (!dentro(q, 1.2, 1)) return; const p = [q[0] * 1.9, q[1] * .62, q[2]]; V3.bola(g, p, .055, C.ribo, .9 + .2 * hash(i, 4), g.pecas.ribo); if (i === 2) ach(g, 'ribo', p); });
      // fago: desce, abre as fibras, contrai e injeta
      V3.setQ(g, g.q0, 0, RED() ? .6 : .6 + (1 - kDesce) * Math.sin(t * .7) * .4, (1 - kDesce) * .12);
      const base = [0, 1 + (1 - kDesce) * 3, 0], vazio = kBur > 0 ? 1 - sst(0, .3, kBur) : 1;
      if (vazio > .02) {
        const f = V3.fago(g, W, base, g.q0, .78 * vazio, { pernas: .2 + .8 * kFix, contr: kContr, info: { cab: g.pecas.cab, cauda: g.pecas.cauda, fibra: g.pecas.fibra, base: g.pecas.cauda } });
        ach(g, 'cab', add(f.cabeca, [0, .4, 0])); ach(g, 'cauda', add(f.topoCauda, [.25, -.2, 0])); if (kFix > .5) ach(g, 'fibra', f.fibra);
        g.ponta = f.ponta;
      }
      // DNA injetado: desce pelo tubo e se enrola no citoplasma
      if (kInj > 0 && kCop < .5) {
        const P0 = []; for (let i = 0; i < 14; i++) P0.push([0, .66 - i * .05, -.05 - i * .02]);
        const Pn = V3.novelo(76, [.45, -.15, -.35], .32, .7).map(p => p);
        const all = P0.concat(Pn), n = Math.max(2, Math.round(all.length * kInj));
        g.inj.set(all.slice(0, n), .026); g.inj.mesh.visible = true; ach(g, 'dnaF', all[Math.min(n - 1, 30)]);
      } else g.inj.mesh.visible = false;
      // cópias do DNA do fago (somem dentro das cabeças na montagem)
      g.cop.forEach((tb, i) => { const k = cl(kCop * 7 - i, 0, 1), sai = sst(i / 8, i / 8 + .4, kMont); if (k <= .02 || sai >= .98) { tb.mesh.visible = false; return; } tb.mesh.visible = true; const c = lerp3(COP[i], SLOT[i].p, sai); tb.set(V3.novelo(50, c, .17 * (1 - sai * .8), i * 1.7, k), .02); if (i === 2 && kMont < .5) ach(g, 'dnaF', c); });
      // peças soltas e montagem dos fagos novos; na explosão, eles voam para fora
      if (kPart > 0) for (let j = 0; j < NF; j++) {
        const sl = SLOT[j], f = sst(j / 20, j / 20 + .5, kMont), kp = cl(kPart * 1.6 - j * .05, 0, 1);
        if (kp <= .01) continue;
        if (f >= .999) {
          const d = nrm([sl.p[0] * .6, sl.p[1] + .2 * (j % 2 ? -1 : 1), .4]), fl = sst(0, 1, kBur), p = add(sl.p, mul(d, fl * 4.2));
          V3.setQ(g, g.q1, fl * 3 * hash(j, 1), sl.gir + fl * 2, .1 + fl * 2.5 * (hash(j, 2) - .5));
          V3.fago(g, W, add(p, [0, -.28, 0]), g.q1, .24, { pernas: .1, info: { cab: g.pecas.novos, cauda: g.pecas.novos, fibra: g.pecas.novos, base: g.pecas.novos } });
          if (j === 3) ach(g, 'novos', add(p, [0, .4, 0]));
        } else {
          V3.setQ(g, g.q1, hash(j, 3) * 2 * (1 - f), sl.gir, (hash(j, 4) - .5) * 2 * (1 - f));
          const ch = lerp3(sl.cab, add(sl.p, [0, .55 * .24 + .2, 0]), f), cu = lerp3(sl.cau, add(sl.p, [0, -.05, 0]), f);
          V3.capsideo(g, W, V3.modelo(g, 'ico', 2), ch, g.q1, .12, { ey: 1.32, k: kp, r: .2, info: g.pecas.novos, seed: 11 + j, casca: '#5A6480' });
          for (let i = 0; i < 6; i++) V3.put(g, W.rod, add(cu, V3.giraV(g, g.q1, [0, (i - 2.5) * .045 * kp, 0])), g.q1, .045, .035, .045, '#A7B1C6', 1, g.pecas.novos);
          if (j === 3 && kp > .5) ach(g, 'novos', ch);
        }
      }
      // parede em pedaços na lise
      if (kBur > 0) for (let i = 0; i < 46; i++) {
        const a = hash(i, 51) * TAU, u = (hash(i, 52) - .5) * 2, p0 = [u * 1.9, Math.sin(a) * .95, -Math.abs(Math.cos(a)) * .95], d = nrm([u, Math.sin(a), -.3]), fl = sst(0, 1, kBur), sz = .22 * (1 - fl * .7);
        V3.setQ(g, g.q1, fl * 4 * hash(i, 53), fl * 3, a); V3.put(g, W.knob, add(p0, mul(d, fl * 2.6)), g.q1, sz, sz * .25, sz * .8, PAREDE, .9, g.pecas.bact);
      }
      // lisozima: pontos laranja na parede antes de romper
      if (kLis > 0 && kBur < .2) for (let i = 0; i < 10; i++) V3.brilho(g, [(hash(i, 41) - .5) * 3.2, (hash(i, 42) > .5 ? 1 : -1) * .9, -.2], .05 * kLis, '#FF9A3C', 2);
      V3.fimKit(W);
    },
    sobre(g, S) { etapaHud(g, F1N[f1Etapa(g.tm)], f1Etapa(g.tm), 5, g.tm < .5 ? '0 min' : 'cerca de ' + Math.round(tReal(g.tm)) + ' min'); },
    camera(g, P) { const d = sst(0, 2, g.tm || 0), b = sst(26, 29, g.tm || 0); return cam(g, P, 2.6 + b * 1.6, 2.55 + (1 - d) * .9 + b * 1.0, { al: [0, .85 + (1 - d) * .6 - b * .6, 0], th: .28, fi: .2, k: 1.02 }); }
  });

  // pastilha de etapa e tempo no canto do palco (a lista de etapas do desenho plano fica escondida no 3D)
  function etapaHud(g, nome, i, n, extra) {
    const x = NAR ? 10 : 18, y = NAR ? 50 : 74, s1 = `${i + 1} de ${n}: ${nome}`, w = Math.max(tw(s1, 14, 700), extra ? tw(extra, 12, 400) : 0) + 24, h = extra ? 44 : 28;
    rr(x, y, w, h, 8, 'rgba(19,26,43,.86)', 'rgba(255,179,71,.55)', 1);
    tx(s1, x + 12, y + 14, { s: 14, w: 700, a: 'left', c: C.txt, bg: false });
    if (extra) tx(extra, x + 12, y + 32, { s: 12, a: 'left', c: C.dim, bg: false });
    V3.reserva(g, [x, y, w, h]);
  }

  // =====================================================================================
  // CICLO LISOGÊNICO (v de 0 a 40)
  // =====================================================================================
  const PE2 = {
    fago: { nome: 'Fago λ (lambda)', frase: 'Cabeça icosaédrica e cauda fina e flexível. Injeta o DNA e deixa o capsídeo vazio do lado de fora.', cor: C.capsideo },
    dnaF: { nome: 'DNA do fago', frase: 'Entra na bactéria e se fecha em círculo. Daqui pode seguir o ciclo lítico ou entrar no cromossomo.', cor: C.dnaClaro },
    crom: { nome: 'Cromossomo da bactéria', frase: 'DNA circular da bactéria, copiado a cada divisão.', cor: C.dnaEscuro },
    prof: { nome: 'Prófago', frase: 'O DNA do fago encaixado no cromossomo. Fica quieto e é copiado junto em todas as filhas, até a indução.', cor: C.dnaClaro },
    uv: { nome: 'Luz ultravioleta', frase: 'Danifica o DNA da bactéria. Esse estresse faz o prófago se soltar do cromossomo: é a indução.', cor: '#8FD8FF' },
    bact: { nome: 'Bactéria lisogênica', frase: 'Carrega o prófago e vive normalmente. Cada divisão passa o prófago para as duas filhas.', cor: C.bacteria },
    novos: { nome: 'Fagos novos', frase: 'Induzido, o fago entra no ciclo lítico: monta fagos novos e a bactéria arrebenta.', cor: C.capsideo }
  };
  const HB = .95, RB = .55, IND = 6, PROF = [26, 33];
  function layColonia(lar) {
    const F = [];
    for (let i = 0; i < 8; i++) { const c = lar ? i % 4 : i % 2, r = lar ? (i / 4) | 0 : (i / 2) | 0; F.push(lar ? [(c - 1.5) * 3.3, (r - .5) * 1.5, 0] : [(c - .5) * 3.2, (1.5 - r) * 1.45, 0]); }
    const L = [F]; for (let k = 2; k >= 0; k--) { const a = L[0], b = []; for (let i = 0; i < a.length / 2; i++) b.push(lerp3(a[2 * i], a[2 * i + 1], .5)); L.unshift(b); }
    return L; // L[0]: 1 célula; L[3]: 8 células
  }
  V3.cena('fagos/lisogenico', {
    fit: 10, raio: 5, bolas: 160, pecas: PE2,
    so2D: S => !!S.modo,
    rotulos: [{ pc: 'fago', t: 'fago λ', pr: 1 }, { pc: 'dnaF', t: 'DNA do fago', pr: 2 }, { pc: 'crom', t: 'cromossomo', pr: 4 }, { pc: 'prof', t: 'prófago', pr: 3 }, { pc: 'uv', t: 'luz UV', pr: 5 }, { pc: 'novos', t: 'fagos novos', pr: 6 }, { pc: 'bact', t: 'bactéria', pr: 2 }],
    montar(g) {
      const T = g.T;
      g.pl = V3.corte(g, g.raiz, [0, 0, -1], 0);
      g.W = V3.kitV(g, { knobs: 1600, rods: 900 });
      g.cel = Array.from({ length: 8 }, () => bacteria(g, g.pl, 'bact'));
      g.dnaM = V3.fis(g, C.dnaClaro, { p: { roughness: .4, clearcoat: .5 }, rimK: .3 });
      g.inj = V3.tubo(g, 50, 6, g.dnaM, null, 'dnaF');
      g.uv = new T.Mesh(V3.cilindro(g, 20), new T.MeshBasicMaterial({ color: '#8FD8FF', transparent: true, opacity: .28, depthWrite: false })); g.raiz.add(g.uv); g.mats.push(g.uv.material);
      g.uv.userData.peca = g.pecas.uv; g.pick.push(g.uv);
      g.cromo = V3.laco(48, .62, .26, .1, .7, [0, 0, -.24]);
      g.circ = V3.laco(14, .16, .16, .02, 0, [0, 0, 0]);
      g.q0 = new T.Quaternion(); g.q1 = new T.Quaternion();
    },
    animar(g, P) {
      const S = P.S, v = S.v || 0, W = g.W, t = P.t, lar = V3.deitado(g); g.v0 = v; g.lar = lar;
      const L = layColonia(lar), kD = sst(0, 1.5, v), kI = sg(2.5, 4.5, v), kC = sg(4.2, 5, v), integ = sg(8, 12, v), gd = cl((v - 12) / 3.5, 0, 3);
      const uv = sg(23.5, 25, v) * (1 - sg(31, 33, v)), exc = sg(26, 29, v), p = sg(29, 36, v);
      const lev = Math.min(3, Math.floor(gd)), e = gd - lev, nC = 1 << Math.min(3, lev + (e > 0 ? 1 : 0));
      // posições e escala de cada célula
      const cel = [];
      for (let i = 0; i < 8; i++) {
        if (gd >= 3) { cel.push({ p: L[3][i], sx: 1 }); continue; }
        if (e <= 0 || lev >= 3) { const k = i >> (3 - lev); if ((i & ((1 << (3 - lev)) - 1)) !== 0) { cel.push(null); continue; } cel.push({ p: L[lev][k], sx: 1 }); continue; }
        const sh = 3 - (lev + 1); if ((i & ((1 << sh) - 1)) !== 0) { cel.push(null); continue; }
        const ch = i >> sh, pa = ch >> 1, lado = ch & 1 ? 1 : -1, sp = sst(0, .45, e), mv = sst(.45, 1, e);
        const p0 = add(L[lev][pa], [lado * (HB + RB) * .5 * sp, 0, 0]);
        cel.push({ p: lerp3(p0, L[lev + 1][ch], mv), sx: mix(.55, 1, sp) });
      }
      const bur = sst(.75, 1, p);
      g.cel.forEach((c, i) => {
        const q = cel[i], fora = i === IND && bur > .05;
        c.visible = !!q && !fora; if (!q) return;
        c.position.set(q.p[0], q.p[1], 0); c.scale.set(RB * (1 + (i === IND ? Math.sin(t * 40) * .01 * sst(.6, .75, p) : 0)), (HB + RB) / 2.2 * q.sx * 2.2 / 2.2 * 1, RB);
        c.scale.set(RB, ((HB + RB) / 2.2) * q.sx, RB);
      });
      // DNA de cada célula: cromossomo com o prófago (depois da integração)
      cel.forEach((q, i) => {
        if (!q || (i === IND && bur > .05)) return;
        const local = pt => add(q.p, [pt[0] * q.sx, pt[1], pt[2]]), P0 = g.cromo.map(local);
        const tem = integ > .85 && !(i === IND && exc > .1);
        V3.cadeia(g, W, P0, .028, { fechado: true, info: g.pecas.crom, faixa: tem ? [PROF[0], PROF[1], '#E4D6FF'] : null, infoF: g.pecas.prof, pic: i === IND ? sst(.2, .6, p) : 0 });
        if (i === 0) { ach(g, 'crom', P0[40]); if (tem && v < 24) ach(g, 'prof', P0[29]); }
        if (i === IND && tem && v >= 22) ach(g, 'prof', P0[29]);
        // ribossomos
        for (let k = 0; k < 10; k++) { const r = RIBO[k]; V3.bola(g, add(q.p, [r[0] * .9 * q.sx, r[1] * .3, r[2] * .5]), .035, C.ribo, .95, g.pecas.bact); }
      });
      // com várias bactérias, o rótulo "bactéria" vai para outra célula, longe do "cromossomo" da primeira (no celular os dois se cobriam)
      { let ib = -1; cel.forEach((q, i) => { if (q && i > 0 && i !== IND) ib = i; }); const qb = cel[ib > 0 ? ib : 0]; if (qb) ach(g, 'bact', add(qb.p, [-.9, -.5, 0])); }
      // fago λ, injeção e círculo
      const c0 = cel[0] ? cel[0].p : [0, 0, 0], some = 1 - sst(11, 12.5, v);
      if (some > .02) {
        V3.setQ(g, g.q0, 0, RED() ? .4 : .4 + t * .2 * (1 - kD), 0);
        const f = V3.lambda(g, W, add(c0, [0, RB + .12 + (1 - kD) * 2.5, 0]), g.q0, .42 * some, { info: { cab: g.pecas.fago, cauda: g.pecas.fago } });
        ach(g, 'fago', add(f.cabeca, [0, .3, 0]));
      }
      const lx = add(c0, [HB * .55, .02, -.15]);
      if (kI > 0 && kC < 1) { const P0 = [], top = add(c0, [0, RB, -.05]); for (let i = 0; i <= 30; i++) { const u = i / 30, q = lerp3(top, lx, u); P0.push(add(q, [0, Math.sin(u * Math.PI) * .25, Math.sin(u * 9) * .05])); } g.inj.set(P0.slice(0, Math.max(2, Math.round(31 * kI))), .022); g.inj.mesh.visible = true; ach(g, 'dnaF', P0[20]); }
      else g.inj.mesh.visible = false;
      // círculo do DNA do fago: forma, vai até o cromossomo e some dentro dele (integração); volta na indução
      if (kC > 0 && integ < .9) { const alvo = add(c0, g.cromo[29]), cc = lerp3(lx, alvo, sst(0, .85, integ)), sc = kC * (1 - sst(.6, .9, integ)); V3.cadeia(g, W, g.circ.map(q => add(cc, mul(q, sc))), .026, { fechado: true, cor: C.dnaClaro, info: g.pecas.dnaF }); if (v >= 5) ach(g, 'dnaF', add(cc, [0, .2, 0])); }
      const ci = cel[IND];
      if (ci && exc > 0 && bur < .05) { const cc = lerp3(add(ci.p, g.cromo[29]), add(ci.p, [.3, .15, -.2]), sst(0, 1, exc)); V3.cadeia(g, W, g.circ.map(q => add(cc, mul(q, sst(0, .6, exc)))), .026, { fechado: true, cor: C.dnaClaro, info: g.pecas.prof }); }
      // luz UV numa célula
      if (ci && uv > .01) { const top = add(ci.p, [0, 4, 0]); g.uv.visible = true; g.uv.position.set(ci.p[0], ci.p[1] + 2.3, 0); g.uv.scale.set(.42, 4.2, .42); g.uv.material.opacity = .3 * uv * (.85 + (RED() ? 0 : .15 * Math.sin(t * 9))); ach(g, 'uv', add(top, [0, -1.4, 0])); }
      else g.uv.visible = false;
      // indução: fagos montados dentro da célula induzida e lise
      if (ci && p > 0) {
        for (let j = 0; j < 6; j++) {
          const sl = [ci.p[0] + (j % 3 - 1) * .55, ci.p[1] + (j < 3 ? .12 : -.18), -.2], k = cl(p * 2.2 - j * .12, 0, 1); if (k <= .02) continue;
          const d = nrm([(j % 3 - 1) * .8, j < 3 ? .8 : -.8, .5]), fl = bur, pp = add(sl, mul(d, fl * 2.6));
          V3.setQ(g, g.q1, fl * 2.5 * hash(j, 1), j + fl * 2, (j % 3 - 1) * .3 + fl * 2 * (hash(j, 2) - .5));
          V3.lambda(g, W, pp, g.q1, .13 * k, { info: { cab: g.pecas.novos, cauda: g.pecas.novos } });
          if (j === 1) ach(g, 'novos', add(pp, [0, .35, 0]));
        }
        if (bur > 0) for (let i = 0; i < 30; i++) { const a = hash(i, 51) * TAU, u = (hash(i, 52) - .5) * 2, p0 = add(ci.p, [u * HB, Math.sin(a) * RB, -Math.abs(Math.cos(a)) * RB]), d = nrm([u, Math.sin(a), -.3]), sz = .14 * (1 - bur * .7); V3.setQ(g, g.q1, bur * 4 * hash(i, 53), bur * 3, a); V3.put(g, W.knob, add(p0, mul(d, bur * 1.8)), g.q1, sz, sz * .25, sz * .8, PAREDE, .9, g.pecas.bact); }
      }
      V3.fimKit(W);
    },
    sobre(g) {
      const v = g.v0 || 0, n = v < 5 ? 'Injeção' : v < 8 ? 'Dois caminhos' : v < 12 ? 'Prófago' : v < 23 ? 'Divisões' : v < 26 ? 'Luz UV' : v < 33 ? 'Indução' : 'Lise';
      const i = v < 5 ? 0 : v < 8 ? 1 : v < 12 ? 2 : v < 23 ? 3 : v < 26 ? 4 : v < 33 ? 5 : 6;
      const gd = cl((v - 12) / 3.5, 0, 3), nb = v < 12 ? 1 : 1 << Math.min(3, Math.floor(gd + .55));
      etapaHud(g, n, i, 7, v >= 12 ? `${nb} ${nb > 1 ? 'bactérias' : 'bactéria'} com o prófago` : 'uma bactéria');
    },
    camera(g, P) {
      const v = g.v0 || 0, z = sst(11.5, 15, v), lar = g.lar, hx = mix(1.9, lar ? 7.1 : 3.4, z), hy = mix(1.8, lar ? 1.9 : 3.4, z);
      return cam(g, P, hx, hy, { al: [0, mix(.6, 0, z), 0], th: .18, fi: .16, k: 1.05 });
    }
  });
})();
