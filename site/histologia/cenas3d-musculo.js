/* LAB Histologia: cenas 3D do tecido muscular (Martin). Os três tecidos em corte com volume, na mesma escala (estrias,
   núcleos, discos intercalares, células fusiformes), com contração; o sarcômero com actina, miosina, linhas Z e zona H
   deslizando; e do nervo à ponte cruzada, com acetilcolina, Ca²⁺ e ATP. Usa o kit histo3d.js; a cena 2D antiga é o plano B. */
'use strict';
(function () {
  const H3 = window.HIS3D; if (!H3) return;
  const { V, K } = H3, { cl, mix, seg, sst, TAU, hash, add, sub, mul, fr, lerp3 } = V;
  const cam = (g, P, hx, hy, o = {}) => H3.viva({ th: o.th == null ? .3 : o.th, fi: o.fi == null ? .2 : o.fi, d: H3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .6 : o.viva);
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const RED = () => H3.REDUZ();
  const ACT = K.actina, MIO = K.miosina;
  const um = (v, d = 2) => nbr(Math.max(0, v), d) + ' µm';

  // =====================================================================================
  // OS TRÊS TECIDOS MUSCULARES
  // =====================================================================================
  const MT = [
    { k: 'esq', n: 'Estriado esquelético', l: 'muitos núcleos na periferia, estrias, voluntário' },
    { k: 'card', n: 'Estriado cardíaco', l: '1 ou 2 núcleos centrais, discos intercalares, involuntário' },
    { k: 'liso', n: 'Liso', l: '1 núcleo central, sem estrias, involuntário' }
  ];
  const PT = {
    esq: { nome: 'Estriado esquelético', frase: 'Fibras longas e cilíndricas, com muitos núcleos na periferia e estrias. Contração voluntária, rápida e forte.', cor: K.musc },
    card: { nome: 'Estriado cardíaco', frase: 'Células ramificadas com 1 ou 2 núcleos centrais, estrias e discos intercalares. Involuntário e rítmico.', cor: '#F07A8A' },
    liso: { nome: 'Músculo liso', frase: 'Células fusiformes com 1 núcleo central e sem estrias. Involuntário, lento e duradouro.', cor: '#F2A0B4' },
    nucP: { nome: 'Núcleos periféricos', frase: 'A fibra esquelética nasce da fusão de muitas células: tem muitos núcleos, logo abaixo da membrana.', cor: K.nucleo },
    disco: { nome: 'Disco intercalar', frase: 'Junção entre as células cardíacas: prende uma célula à outra e deixa a onda elétrica passar.', cor: '#5A2A6A' },
    nucC: { nome: 'Núcleo central', frase: 'No liso e no cardíaco, o núcleo fica no meio da célula.', cor: K.nucleo },
    estria: { nome: 'Estrias', frase: 'Faixas claras e escuras: a actina e a miosina alinhadas em sarcômeros.', cor: '#8E3A4E' }
  };
  const espasmo = d => d < 0 || d > 1 ? 0 : d < .12 ? sst(0, 1, d / .12) : 1 - sst(0, 1, (d - .12) / .5);
  const BX = 1.45, BY = .95;
  H3.cena('muscular/tipos', {
    fit: 14, raio: 6, bolas: 40,
    pecas: PT,
    rotulos: [{ pc: 'nucP', t: 'núcleos na periferia', pr: 1 }, { pc: 'estria', t: 'estrias', pr: 3 }, { pc: 'disco', t: 'disco intercalar', pr: 2 }, { pc: 'nucC', t: 'núcleo central', pr: 4 }],
    montar(g) {
      const T = g.T;
      g.pn = MT.map((m, i) => {
        const gr = new T.Group(); g.raiz.add(gr);
        const pl = [H3.corte(g, gr, [-1, 0, 0], BX), H3.corte(g, gr, [1, 0, 0], BX), H3.corte(g, gr, [0, -1, 0], BY), H3.corte(g, gr, [0, 1, 0], BY)];
        const fundo = H3.bloco(g, H3.caixa(g, BX * 2, BY * 2, .3, 12, 'mtF'), '#F2C3D2', { pai: gr, pc: m.k, dn: .05, fib: .5, esc: 3, fq: 5, luz: .4 }); fundo.position.z = -.5;
        const lis = i < 2 ? { n: i ? 9 : 12, s: 1 } : null;
        const cel = H3.inst(g, i === 2 ? H3.esfera(g, 24) : H3.cilindro(g, 24), H3.fis(g, '#FFFFFF', { p: { roughness: .5, sheen: .5, sheenColor: new T.Color('#FFE0E8') }, rimK: .3, planos: pl, listras: lis }), 160, gr, g.pecas[m.k]);
        const nuc = H3.inst(g, H3.esfera(g, 14), H3.fis(g, K.nucleo, { p: { roughness: .4, clearcoat: .6 }, planos: pl }), 220, gr, g.pecas[i ? 'nucC' : 'nucP']);
        const dis = i === 1 ? H3.inst(g, H3.cilindro(g, 18), H3.fis(g, '#5A2A6A', { p: { roughness: .5 }, planos: pl }), 120, gr, g.pecas.disco) : null;
        g.pick.push(cel.m, nuc.m); if (dis) g.pick.push(dis.m);
        return { gr, cel, nuc, dis, pl };
      });
      g.qX = H3.qy(g, [1, 0, 0], new T.Quaternion());
    },
    animar(g, P) {
      const S = P.S, t = P.t, z = cl(S.v, 0, 2), lar = H3.deitado(g), sc = mix(.42, 1.55, sst(0, 2, z) * .5 + z / 4);
      g.lar = lar;
      const cE = espasmo((S.clk || 0) - (S.twT == null ? -9 : S.twT)), cC = RED() ? 0 : Math.pow(Math.max(0, Math.sin(t * TAU * 1.1)), 3), cL = RED() ? 0 : .5 + .5 * Math.sin(t * .7);
      const cs = [cE, cC * .8, cL * .8];
      g.pn.forEach((p, i) => {
        p.gr.position.set(lar ? (i - 1) * 3.25 : 0, lar ? 0 : (1 - i) * 2.4, 0); p.gr.scale.setScalar(lar ? 1 : .8);
        const c = cs[i], kx = sc * (1 - .14 * c), ky = sc * (1 + .07 * c);
        if (i === 0) {
          // fibras longas e retas, núcleos achatados na periferia
          for (let r = -7; r <= 7; r++) {
            const y = r * .52 * ky, rad = .23 * ky * (.92 + .12 * hash(r + 9, 1)); if (Math.abs(y) - rad > BY + .1) continue;
            H3.put(g, p.cel, [0, y, -.12], g.qX, rad, 8 * kx, rad, '#E5728C', 1, g.pecas.esq);
            for (let n = -9; n <= 9; n++) { const x = (n * .55 + hash(r + 20, n + 20) * .3) * kx, side = hash(r, n) > .5 ? 1 : -1, a = side * (.7 + hash(n, r) * .9); if (Math.abs(x) > BX + .2) continue; H3.put(g, p.nuc, [x, y + Math.sin(a) * rad * .96, -.12 + Math.cos(a) * rad * .96], g.qX, .03 * ky, .14 * kx, .055 * ky, '#6A4AC8', 1, g.pecas.nucP); }
          }
          ach(g, 'nucP', H3.mundo(g, p.gr, [-.35 * kx, .52 * ky + .2 * ky, .1])); ach(g, 'estria', H3.mundo(g, p.gr, [.6 * kx, -.52 * ky, .1]));
        } else if (i === 1) {
          // células em tijolo, ramificadas, com núcleo central e discos nas pontas
          for (let r = -6; r <= 6; r++) for (let j = -4; j <= 4; j++) {
            const off = (r & 1) * .6, x = (j * 1.2 + off) * kx, y = r * .5 * ky, rad = .2 * ky, Lc = 1.12 * kx; if (Math.abs(x) - Lc / 2 > BX + .1 || Math.abs(y) - rad > BY + .1) continue;
            H3.put(g, p.cel, [x, y, -.12], g.qX, rad, Lc, rad, '#EE7F93', 1, g.pecas.card);
            H3.put(g, p.dis, [x + Lc / 2 + .02 * kx, y, -.12], g.qX, rad * 1.04, .035 * kx, rad * 1.04, '#5A2A6A', 1, g.pecas.disco);
            H3.put(g, p.nuc, [x + (hash(r, j) - .5) * .1 * kx, y, -.12 + .15 * ky], g.qX, .075 * ky, .22 * kx, .05 * ky, '#6A4AC8', 1, g.pecas.nucC);
            if (hash(r + 3, j) > .55 && r < 6) { const a = [x + .25 * kx, y, -.12], b = [x + .55 * kx, y + .5 * ky, -.12]; H3.put(g, p.cel, mul(add(a, b), .5), H3.qy(g, sub(b, a)), rad * .75, V.len(sub(b, a)) + .1, rad * .75, '#EE7F93', 1, g.pecas.card); }
          }
          ach(g, 'disco', H3.mundo(g, p.gr, [.6 * kx + .56 * kx, 0, .1]));
          H3.fim(p.dis);
        } else {
          // células fusiformes desencontradas, núcleo alongado no meio
          for (let r = -10; r <= 10; r++) for (let j = -3; j <= 3; j++) {
            const x = (j * 1.5 + (r & 1) * .75 + (hash(r, j) - .5) * .2) * kx, y = r * .26 * ky, Lc = .82 * kx; if (Math.abs(x) - Lc > BX + .1 || Math.abs(y) > BY + .2) continue;
            H3.put(g, p.cel, [x, y, -.12], null, Lc, .15 * ky, .15 * ky, '#F2A0B4', 1, g.pecas.liso);
            H3.put(g, p.nuc, [x, y, -.12 + .12 * ky], null, .2 * kx, .045 * ky, .04 * ky, '#6A4AC8', 1, g.pecas.nucC);
          }
          ach(g, 'nucC', H3.mundo(g, p.gr, [.75 * kx * (lar ? 0 : 1) + (lar ? .0 : 0), .26 * ky, .1]));
        }
        H3.fim(p.cel); H3.fim(p.nuc);
        const top = H3.mundo(g, p.gr, [-BX, BY, 0]), bot = H3.mundo(g, p.gr, [-BX, -BY, 0]);
        H3.texto(g, top, MT[i].n, { a: 'left', s: 14, w: 700, dy: -14, c: C.txt });
        H3.texto(g, bot, NAR ? MT[i].l.split(',')[0] : MT[i].l, { a: 'left', s: 12, w: 600, dy: 14, c: C.dim });
      });
    },
    camera(g, P) { const lar = H3.deitado(g); return lar ? cam(g, P, 4.95, 1.5, { th: 0, fi: .05, al: [0, 0, 0], k: 1.04, viva: .25 }) : cam(g, P, 1.3, 4.6, { th: 0, fi: .04, al: [0, -.3, 0], k: 1.0, viva: .25 }); }
  });

  // =====================================================================================
  // O SARCÔMERO: filamentos com volume, em rede hexagonal, entre duas linhas Z
  // =====================================================================================
  const Lof = v => 2.5 - .5 * v / 100, KU = 1.55;   // 1 µm = 1,55 unidades
  const PS = {
    act: { nome: 'Actina (filamento fino)', frase: 'Presa às linhas Z; desliza para o centro do sarcômero na contração. Não encurta.', cor: ACT },
    mio: { nome: 'Miosina (filamento grosso)', frase: 'No meio do sarcômero, com cabeças que puxam a actina. Não encurta.', cor: MIO },
    z: { nome: 'Linha Z', frase: 'Limite do sarcômero, onde a actina se prende. As linhas Z se aproximam na contração.', cor: '#F2F4F8' },
    m: { nome: 'Linha M', frase: 'Centro do sarcômero, onde as miosinas se prendem umas às outras.', cor: '#C9B6F0' },
    cab: { nome: 'Cabeças da miosina', frase: 'Prendem-se à actina e a puxam, gastando ATP (ponte cruzada).', cor: '#FF8A7A' }
  };
  H3.cena('muscular/sarcomero', {
    fit: 14, raio: 6, bolas: 40,
    pecas: PS,
    rotulos: [{ pc: 'act', t: 'actina', pr: 1 }, { pc: 'mio', t: 'miosina', pr: 2 }, { pc: 'z', t: 'linha Z', pr: 3 }, { pc: 'm', t: 'linha M', pr: 5 }, { pc: 'cab', t: 'cabeças da miosina', pr: 4 }],
    montar(g) {
      const T = g.T, a = .3; g.pl = H3.corte(g, g.raiz, [0, 0, -1], .05);
      // rede triangular: 1 sítio de miosina para 2 de actina
      g.my = []; g.ac = [];
      for (let i = -5; i <= 5; i++) for (let j = -5; j <= 5; j++) { const y = (i + j * .5) * a, z = j * a * .866; if (y * y + z * z > .78 * .78) continue; (((i - j) % 3 + 3) % 3 === 0 ? g.my : g.ac).push([y, z]); }
      g.mA = H3.inst(g, H3.cilindro(g, 10), H3.fis(g, ACT, { p: { roughness: .35, clearcoat: .6 }, rim: '#BFE0FF', rimK: .35 }), 200, null, g.pecas.act);
      g.mM = H3.inst(g, H3.cilindro(g, 14), H3.fis(g, MIO, { p: { roughness: .4, clearcoat: .5 }, rim: '#FFC8BE', rimK: .35 }), 60, null, g.pecas.mio);
      g.mH = H3.inst(g, H3.capsula(g, .5, .6, 8), H3.fis(g, '#FF8A7A', { p: { roughness: .4, clearcoat: .6 } }), 900, null, g.pecas.cab);
      g.mZ = H3.inst(g, H3.cilindro(g, 40), H3.fis(g, '#E8ECF6', { p: { roughness: .3, clearcoat: .7 }, planos: [g.pl] }), 6, null, g.pecas.z);
      g.mML = H3.inst(g, H3.cilindro(g, 40), H3.fis(g, '#C9B6F0', { p: { roughness: .4, transparent: true, opacity: .6 }, planos: [g.pl] }), 2, null, g.pecas.m);
      g.env = H3.peca(g, H3.cilindro(g, 48), H3.filme(g, '#F0B3C6', { cor2: '#FFFFFF', dentro: '#2A1424', base: .03, fr: .35, esc: 1.5, planos: [g.pl] }), null); g.env.renderOrder = 6;
      g.pick.push(g.mA.m, g.mM.m, g.mH.m, g.mZ.m, g.mML.m);
      g.qX = H3.qy(g, [1, 0, 0], new T.Quaternion()); g.pv = null; g.mov = 0;
    },
    animar(g, P) {
      const S = P.S, t = P.t, v = cl(S.v, 0, 100), L = Lof(v), Lu = L * KU, Au = 1.0 * KU, Mu = 1.6 * KU, dt = g.dt || .016;
      const dv = g.pv == null ? 0 : Math.abs(v - g.pv) / Math.max(dt, .001); g.pv = v; g.mov += ((dv > 2 ? 1 : 0) - g.mov) * Math.min(1, dt * 4);
      g.L = L; g.Lu = Lu;
      const zs = [-Lu / 2, Lu / 2], zv = [-Lu * 1.5, Lu * 1.5], R = .95;
      g.env.scale.set(R, Lu * 2 + .6, R); g.env.quaternion.copy(g.qX);
      // linhas Z (e as vizinhas) e linha M
      [...zs, ...zv].forEach(x => H3.put(g, g.mZ, [x, 0, 0], g.qX, R * .98, .05, R * .98, '#E8ECF6', 1, g.pecas.z));
      H3.fim(g.mZ); H3.put(g, g.mML, [0, 0, 0], g.qX, .8, .025, .8, '#C9B6F0', 1, g.pecas.m); H3.fim(g.mML);
      // actina: sai de cada linha Z para os dois lados
      const zA = [...zs, ...zv];
      g.ac.forEach(([y, z], k) => zA.forEach(x0 => [-1, 1].forEach(sd => {
        const x1 = x0 + sd * Au; if (Math.abs(x1) > Lu * 1.5 + .01 && Math.abs(x0) > Lu) return;
        H3.put(g, g.mA, [(x0 + x1) / 2, y, z], g.qX, .028, Au, .028, ACT, .95 + .1 * hash(k, 1), g.pecas.act);
      })));
      H3.fim(g.mA);
      // miosina com cabeças (fora da zona nua do meio); as cabeças batem quando o sarcômero se move
      const cent = [0, -Lu, Lu];
      g.my.forEach(([y, z], k) => cent.forEach(cx => {
        H3.put(g, g.mM, [cx, y, z], g.qX, .06, Mu, .06, MIO, 1, g.pecas.mio);
        if (cx !== 0) return;
        for (let n = 0; n < 14; n++) {
          const sd = n < 7 ? -1 : 1, m = n % 7, x = cx + sd * (.26 + m * (Mu / 2 - .3) / 6.5), a = (n * 2.4 + k * 1.3) % TAU, bat = RED() ? 0 : g.mov * Math.sin(t * 9 + n + k * 2) * .35;
          const d = [Math.cos(a), Math.sin(a)], base = [x, y + d[0] * .06, z + d[1] * .06], tip = [x - sd * (.07 + bat * .05), y + d[0] * .15, z + d[1] * .15];
          H3.put(g, g.mH, mul(add(base, tip), .5), H3.qy(g, sub(tip, base)), .035, .08, .035, '#FF8A7A', 1, g.pecas.cab);
        }
      }));
      H3.fim(g.mM); H3.fim(g.mH);
      ach(g, 'z', [Lu / 2, .82, .1]); ach(g, 'm', [0, -.8, .1]); ach(g, 'act', [-Lu / 2 + Au * .55, g.ac[0][0], .2]); ach(g, 'mio', [Mu * .3, -.3, .25]); ach(g, 'cab', [-Mu * .38, .25, .3]);
      const top = .95, bot = -.95; g.p = { zl: [-Lu / 2, top, 0], zr: [Lu / 2, top, 0], al: [-Mu / 2, top, 0], ar: [Mu / 2, top, 0], il: [-Lu / 2 - (L - 1.6) * KU / 2, bot, 0], ir: [-Lu / 2 + (L - 1.6) * KU / 2, bot, 0], hl: [-(L - 2) * KU / 2, bot, 0], hr: [(L - 2) * KU / 2, bot, 0], zb: [Lu / 2, bot, 0] };
    },
    sobre(g, S) {
      const p = g.p; if (!p) return; const L = g.L, q = a => H3.tela(g, a), Ib = L - 1.6, Hz = Math.max(0, L - 2);
      const chave = (a, b, y, dir, c, lw) => { X.save(); X.strokeStyle = c; X.lineWidth = lw || 1.5; X.beginPath(); X.moveTo(a, y - dir * 7); X.lineTo(a, y); X.lineTo(b, y); X.lineTo(b, y - dir * 7); X.stroke(); X.restore(); };
      const zl = q(p.zl), zr = q(p.zr), al = q(p.al), ar = q(p.ar), il = q(p.il), ir = q(p.ir), hl = q(p.hl), hr = q(p.hr);
      const yS = Math.min(zl[1], zr[1]) - (NAR ? 56 : 60), yA = Math.min(al[1], ar[1]) - 16;
      chave(zl[0], zr[0], yS, -1, C.txt); tx(`sarcômero: ${um(L)}`, (zl[0] + zr[0]) / 2, yS - 14, { s: 13, w: 700, c: C.txt });
      chave(al[0], ar[0], yA, -1, '#FFB347', 2); tx(`banda A: ${um(1.6)}`, (al[0] + ar[0]) / 2 - 4, yA - 14, { s: 13, w: 700, c: C.txt, a: 'right' });
      X.save(); X.globalAlpha = g.mov > .2 ? .55 + .45 * Math.sin(g.t * 6) : 1; tx('não muda', (al[0] + ar[0]) / 2 + 4, yA - 14, { s: 13, w: 700, c: '#FFB347', a: 'left' }); X.restore();
      const yB = Math.max(il[1], hl[1]) + 16;
      chave(il[0], ir[0], yB, 1, ACT, 2); tx('banda I', (il[0] + ir[0]) / 2, yB + 18, { s: 13, w: 700, c: C.txt }); tx(um(Ib), (il[0] + ir[0]) / 2, yB + 34, { s: 12, f: FD, c: C.dim });
      if (Hz > .005) chave(hl[0], hr[0], yB, 1, '#FFB0A6', 2);
      tx('zona H', (hl[0] + hr[0]) / 2, yB + 18, { s: 13, w: 700, c: C.txt }); tx(um(Hz), (hl[0] + hr[0]) / 2, yB + 34, { s: 12, f: FD, c: C.dim });
      H3.reserva(g, [Math.min(zl[0], il[0]) - 40, yS - 26, Math.abs(zr[0] - zl[0]) + 80, 34]); H3.reserva(g, [il[0] - 50, yB - 4, Math.abs(hr[0] - il[0]) + 100, 46]);
    },
    camera(g, P) { const lar = H3.deitado(g); return lar ? cam(g, P, 3.9, 1.9, { th: .32, fi: .16, al: [0, 0, 0], k: 1.02, viva: .4 }) : cam(g, P, 2.6, 2.6, { th: .3, fi: .14, al: [0, 0, 0], k: 1.05, viva: .4 }); }
  });

  // =====================================================================================
  // DO NERVO À CONTRAÇÃO: junção neuromuscular, retículo e Ca²⁺; ao lado, a ponte cruzada com ATP
  // =====================================================================================
  function estado(v, cen) {
    const libera = cen !== 'botu', liga = libera && cen !== 'curare', e = { cen, liga, libera };
    e.imp = seg(v, 0, 1); e.rel = libera ? seg(v, 1, 1.5) : 0; e.achX = libera ? seg(v, 1.2, 1.9) : 0;
    e.achOff = cen === 'organo' || !liga ? 0 : seg(v, 2.4, 3.2);
    e.onda = liga ? (cen === 'organo' && v > 3 ? fr((v - 2) * .9) : seg(v, 2, 3)) : 0;
    e.ondaOn = liga && v >= 2 && (v < 3 || cen === 'organo');
    const solta = liga ? seg(v, 3, 3.8) : 0, volta = cen === 'normal' ? seg(v, 5, 5.9) : 0;
    e.ca = solta * (1 - volta);
    e.tm = liga ? seg(v, 3.7, 4) * (cen === 'normal' ? 1 - seg(v, 5.1, 5.5) : 1) : 0;
    if (!liga) { e.cyc = 0; e.cont = 0; }
    else if (cen === 'sematp') { e.cyc = Math.min(.5, Math.max(0, (v - 4) * 4)); e.cont = .25 * seg(v, 4, 4.125); }
    else if (cen === 'organo') { e.cyc = Math.max(0, (v - 4) * 4); e.cont = seg(v, 4, 5); }
    else { e.cyc = cl((v - 4) * 4, 0, 4); e.cont = seg(v, 4, 5) * (1 - seg(v, 5.3, 6)); }
    e.atp = cen !== 'sematp' && liga;
    return e;
  }
  const PC = {
    neur: { nome: 'Neurônio motor', frase: 'Leva o impulso nervoso até a fibra muscular.', cor: K.neur },
    term: { nome: 'Terminal do axônio', frase: 'Guarda vesículas cheias de acetilcolina.', cor: '#C9A3D8' },
    ach: { nome: 'Acetilcolina', frase: 'Neurotransmissor: atravessa a fenda e se liga aos receptores da fibra.', cor: '#8FE07A' },
    rec: { nome: 'Receptores', frase: 'Na membrana da fibra (sarcolema); o curare se encaixa neles e bloqueia a acetilcolina.', cor: '#7FD8FF' },
    fibra: { nome: 'Fibra muscular', frase: 'Célula longa, cheia de miofibrilas com estrias.', cor: K.musc },
    tt: { nome: 'Túbulo T', frase: 'Dobra da membrana que leva a onda elétrica para dentro da fibra.', cor: '#FFD27A' },
    rs: { nome: 'Retículo sarcoplasmático', frase: 'Guarda o Ca²⁺ e o libera quando a onda elétrica chega.', cor: '#B98AD6' },
    ca: { nome: 'Ca²⁺', frase: 'Liga-se à troponina e libera a actina para a miosina.', cor: '#7FD8FF' },
    act: { nome: 'Actina', frase: 'Filamento fino, puxado pelas cabeças da miosina.', cor: ACT },
    tm: { nome: 'Tropomiosina', frase: 'Cobre os pontos de ligação da actina; o Ca²⁺ na troponina a tira da frente.', cor: '#F3E08A' },
    trop: { nome: 'Troponina', frase: 'Proteína que recebe o Ca²⁺ e move a tropomiosina.', cor: '#9FE6FF' },
    mio: { nome: 'Miosina', frase: 'A cabeça se prende à actina, puxa e se solta com ATP.', cor: MIO }
  };
  H3.cena('muscular/contracao', {
    fit: 16, raio: 7, bolas: 260,
    pecas: PC,
    rotulos: [{ pc: 'neur', t: 'neurônio motor', pr: 1, se: g => g.lar || g.vv < 3.3 }, { pc: 'ach', t: 'acetilcolina', pr: 2, se: g => g.e && g.e.rel > .2 && g.vv < 3.2 }, { pc: 'tt', t: 'túbulo T', pr: 6, se: g => g.lar || g.vv < 3.3 }, { pc: 'rs', t: 'retículo sarcoplasmático', pr: 3, se: g => g.vv >= 3 && (g.lar || g.vv < 3.6) }, { pc: 'act', t: 'actina', pr: 4, se: g => g.lar || g.vv >= 3.3 }, { pc: 'tm', t: 'tropomiosina', pr: 7, se: g => g.lar || g.vv >= 3.3 }, { pc: 'mio', t: 'miosina', pr: 5, se: g => g.lar || g.vv >= 3.3 }],
    montar(g) {
      const T = g.T;
      // junção neuromuscular
      g.J = new T.Group(); g.raiz.add(g.J);
      g.pl = H3.corte(g, g.J, [0, 0, -1], 0);
      const fib = H3.solido(g, H3.cilindro(g, 48), '#E5728C', [g.pl], { pai: g.J, corte: '#F2A7B8', m: { listras: { n: 26, s: .7 }, p: { roughness: .5, sheen: .5 } } }); fib.scale.set(1, 5, 1); fib.rotation.z = Math.PI / 2; fib.traverse(o => { if (o.isMesh) { o.userData.peca = g.pecas.fibra; g.pick.push(o); } });
      g.mf = H3.inst(g, H3.cilindro(g, 16), H3.fis(g, '#D9607A', { p: { roughness: .5 }, planos: [g.pl], listras: { n: 26, s: 1 } }), 12, g.J, g.pecas.fibra);
      g.rs = []; for (let i = 0; i < 10; i++) g.rs.push(H3.tubo(g, 30, 6, H3.fis(g, '#B98AD6', { p: { roughness: .4, transparent: true, opacity: .85 }, planos: [g.pl] }), g.J, 'rs'));
      g.tt = H3.inst(g, H3.cilindro(g, 10), H3.fis(g, '#FFD27A', { p: { roughness: .4 }, planos: [g.pl] }), 12, g.J, g.pecas.tt); g.pick.push(g.tt.m);
      g.ax = H3.tubo(g, 30, 10, H3.fis(g, '#C9A3D8', { p: { roughness: .45, sheen: .5 } }), g.J, 'neur');
      g.mie = H3.inst(g, H3.capsula(g, .5, .9, 16), H3.fis(g, '#F4F1EC', { p: { roughness: .35, clearcoat: .7 } }), 8, g.J, g.pecas.neur); g.pick.push(g.mie.m);
      g.bot = H3.peca(g, H3.lumpy(g, 'bot', 31, 3, 4, .1, .4, .8), H3.filme(g, '#C9A3D8', { cor2: '#FFFFFF', dentro: '#3A2A48', base: .25, fr: .5, esc: 2 }), 'term', g.J); g.bot.renderOrder = 5;
      g.rc = H3.inst(g, H3.cone(g, 8), H3.fis(g, '#7FD8FF', { p: { roughness: .4 } }), 20, g.J, g.pecas.rec); g.pick.push(g.rc.m);
      g.onda = H3.inst(g, H3.toro(g, .06, 40), H3.emis(g, '#FFD27A', 2.4), 2, g.J); g.qX = H3.qy(g, [1, 0, 0], new T.Quaternion());
      // ponte cruzada
      g.Z = new T.Group(); g.raiz.add(g.Z);
      g.bead = H3.inst(g, H3.esfera(g, 16), H3.fis(g, ACT, { p: { roughness: .35, clearcoat: .6 }, rim: '#BFE0FF', rimK: .35 }), 90, g.Z, g.pecas.act); g.pick.push(g.bead.m);
      g.tmT = H3.tubo(g, 60, 8, H3.fis(g, '#F3E08A', { p: { roughness: .35, clearcoat: .6 } }), g.Z, 'tm');
      g.trp = H3.inst(g, H3.lumpy(g, 'trp', 13, 2, 3, .2, .4, .8), H3.fis(g, '#9FE6FF', { p: { roughness: .4 } }), 8, g.Z, g.pecas.trop); g.pick.push(g.trp.m);
      g.thk = H3.peca(g, H3.cilindro(g, 32), H3.fis(g, MIO, { p: { roughness: .4, clearcoat: .5 }, rim: '#FFC8BE', rimK: .35 }), 'mio', g.Z); g.thk.rotation.z = Math.PI / 2; g.thk.scale.set(.2, 5.4, .2); g.thk.position.set(0, -.95, 0);
      g.neck = H3.inst(g, H3.cilindro(g, 10), H3.fis(g, '#E8695A', { p: { roughness: .4 } }), 6, g.Z, g.pecas.mio);
      g.head = H3.inst(g, H3.lumpy(g, 'mhd', 57, 3, 3, .15, .4, .8), H3.fis(g, '#FF8A7A', { p: { roughness: .4, clearcoat: .5 }, rimK: .35 }), 6, g.Z, g.pecas.mio); g.pick.push(g.neck.m, g.head.m);
    },
    animar(g, P) {
      const S = P.S, t = P.t, v = cl(S.v, 0, 6), e = estado(v, S.cen || 'normal'), lar = H3.deitado(g);
      g.e = e; g.vv = v; g.lar = lar;
      g.J.position.set(lar ? -2.7 : 0, lar ? -.1 : 1.95, 0); g.J.scale.setScalar(lar ? .82 : .62); g.J.visible = lar || v < 3.3; g.Z.visible = lar || v >= 2.8;
      g.Z.position.set(lar ? 2.75 : 0, lar ? .05 : -1.75, 0); g.Z.scale.setScalar(lar ? .82 : .6);
      // fibra: miofibrilas por dentro, retículo em volta delas, túbulos T descendo da membrana
      const enc = 1 - .06 * e.cont;
      for (let i = 0; i < 7; i++) { const a = i / 7 * TAU, r = i ? .55 : 0, y = Math.cos(a) * r, z = -Math.abs(Math.sin(a)) * r - .05; H3.put(g, g.mf, [0, y, z], g.qX, .22, 4.9 * enc, .22, '#D9607A', 1, g.pecas.fibra); }
      H3.fim(g.mf);
      const tX = [-1.8, -.9, .9, 1.8];
      tX.forEach((x, i) => { H3.put(g, g.tt, [x * enc, .2, -.02], null, .035, 1.6, .035, '#FFD27A', 1 + .8 * e.onda * (1 - Math.abs(x) / 3), g.pecas.tt); });
      H3.fim(g.tt);
      g.rs.forEach((R, i) => { const x0 = -2.25 + i * .5, P0 = []; for (let k = 0; k < 30; k++) { const u = k / 29, a = Math.PI + u * Math.PI; P0.push([x0 * enc + Math.sin(u * 20 + i) * .04, Math.cos(a) * .85, Math.sin(a) * .85 * .9]); } R.set(P0, .035); });
      // axônio com mielina e o impulso descendo
      const AX = []; for (let k = 0; k < 30; k++) { const u = k / 29; AX.push([-1.9 + u * 1.9 + Math.sin(u * 3) * .15, 2.3 - u * .95 - u * u * .2, .35 * (1 - u)]); }
      g.ax.set(AX, .11);
      for (let k = 0; k < 4; k++) { const a = V.trilha(AX, .08 + k * .2), b = V.trilha(AX, .2 + k * .2); H3.put(g, g.mie, mul(add(a, b), .5), H3.qy(g, sub(b, a)), .2, V.len(sub(b, a)) * .5, .2, '#F4F1EC', 1, g.pecas.neur); }
      H3.fim(g.mie);
      if (e.imp > 0 && e.imp < 1) H3.brilho(g, H3.mundo(g, g.J, V.trilha(AX, e.imp)), .1, '#FFE7A3', 1.6);
      g.bot.position.set(0, 1.18, .1); g.bot.scale.set(.55, .28, .45);
      // vesículas e acetilcolina na fenda
      for (let i = 0; i < 9; i++) { const d = [Math.cos(i * 2.4) * .3, .05 + hash(i, 1) * .1, Math.sin(i * 2.4) * .2], fu = e.libera ? seg(e.rel * 9 - i * .6, 0, 1) : 0; H3.bola(g, H3.mundo(g, g.J, add([0, 1.15 - fu * .12, .1], mul(d, 1 - fu * .4))), .055 * (1 - fu * .8), '#E7D2F5', 1, g.pecas.term); }
      const nAch = Math.round(16 * e.achX * (1 - e.achOff));
      for (let i = 0; i < nAch; i++) { const f = cl(e.achX * 1.4 - i / 16 * .4, 0, 1), x = (hash(i, 2) - .5) * .7, ok = e.liga || f < .7; const y = mix(1.05, ok ? 1.0 : 1.03, f); H3.brilho(g, H3.mundo(g, g.J, [x, y - f * .03, .1 + (hash(i, 3) - .5) * .4]), .03, '#8FE07A', 1.4); }
      for (let i = 0; i < 9; i++) { const x = (i - 4) * .09; H3.put(g, g.rc, [x, 1.0, .1 + (hash(i, 7) - .5) * .3], null, .025, .06, .025, e.cen === 'curare' ? '#FF8A8A' : '#7FD8FF', 1, g.pecas.rec); }
      H3.fim(g.rc);
      // onda elétrica no sarcolema: dois anéis saindo do meio
      if (e.ondaOn) { [-1, 1].forEach(s => H3.put(g, g.onda, [s * e.onda * 2.4, 0, 0], g.qX, 1.03, 1.03, 1.03, '#FFD27A', 1)); }
      H3.fim(g.onda);
      // Ca²⁺ saindo do retículo
      const nCa = Math.round(40 * e.ca);
      for (let i = 0; i < nCa; i++) { const x = -2.2 + hash(i, 11) * 4.4, a = Math.PI + hash(i, 12) * Math.PI, r = .85 - fr(hash(i, 13) + (RED() ? 0 : t * .2)) * .5; H3.brilho(g, H3.mundo(g, g.J, [x * enc, Math.cos(a) * r, Math.sin(a) * r * .8]), .028, '#7FD8FF', 1.3); }
      // ponte cruzada: actina em dupla hélice, tropomiosina no sulco, troponina e cabeças da miosina
      const sl = -e.cont * .9, nB = 40;
      for (let i = 0; i < nB; i++) for (let s = 0; s < 2; s++) { const x = -2.6 + i * .135 + s * .067 + sl, a = i * .45 + s * Math.PI; H3.put(g, g.bead, [x, .32 + Math.cos(a) * .1, Math.sin(a) * .1], null, .085, .085, .085, ACT, .92 + .12 * hash(i, s), g.pecas.act); }
      H3.fim(g.bead);
      const tmOff = mix(.07, -.04, e.tm), TM = []; for (let i = 0; i < 60; i++) { const x = -2.6 + i * .09 + sl, a = (x - sl + 2.6) / .135 * .45 + 1.3; TM.push([x, .32 + Math.cos(a) * .17 + tmOff, Math.sin(a) * .17 + .02]); }
      g.tmT.set(TM, .028);
      for (let i = 0; i < 6; i++) { const x = -2.2 + i * .9 + sl, a = (x - sl + 2.6) / .135 * .45 + 1.3, p = [x, .32 + Math.cos(a) * .2 + .05, Math.sin(a) * .2 + .05]; H3.put(g, g.trp, p, null, .07, .06, .06, '#9FE6FF', 1, g.pecas.trop); if (e.ca > .3) H3.brilho(g, H3.mundo(g, g.Z, add(p, [0, .09, .05])), .03, '#7FD8FF', 1.3); }
      H3.fim(g.trp);
      // três cabeças em ciclo: sobe, prende, puxa (golpe), ATP solta, rearma
      const hx = [-1.2, 0, 1.2]; g.hp = [];
      hx.forEach((x0, i) => {
        const u = e.cyc > 0 ? fr(e.cyc + i * .31) : 0, liga = e.cyc > 0 && (e.cen !== 'sematp' ? true : u > 0);
        let ang = -.55, alt = 0;
        if (liga && e.cyc > 0) { if (u < .2) { alt = sst(0, .2, u); } else if (u < .6) { alt = 1; ang = mix(-.55, .55, sst(.2, .6, u)); } else if (u < .72) { alt = 1 - sst(.6, .72, u); ang = .55; } else { ang = mix(.55, -.55, sst(.72, 1, u)); } }
        if (e.cen === 'sematp' && e.cyc >= .5) { alt = 1; ang = .55; }
        const base = [x0, -.8, 0], len = mix(.62, .9, alt), dir = [Math.sin(ang) * .8, 1, 0], tip = add(base, mul(V.nrm(dir), len));
        H3.put(g, g.neck, mul(add(base, tip), .5), H3.qy(g, sub(tip, base)), .04, len, .04, '#E8695A', 1, g.pecas.mio);
        H3.put(g, g.head, tip, H3.qy(g, dir), .13, .16, .11, alt > .9 ? '#FFA090' : '#FF8A7A', 1, g.pecas.mio);
        g.hp.push({ tip, u, alt });
        if (e.atp && e.cyc > 0 && u > .6 && u < .8) H3.ficha(g, H3.mundo(g, g.Z, add(tip, [0, -.25, .2])), 'ATP', '#FFD27A', { pr: 3 });
      });
      H3.fim(g.neck); H3.fim(g.head);
      ach(g, 'neur', H3.mundo(g, g.J, V.trilha(AX, .45))); if (e.rel > .2) ach(g, 'ach', H3.mundo(g, g.J, [.3, 1.03, .3]));
      ach(g, 'tt', H3.mundo(g, g.J, [.9 * enc, -.3, 0])); ach(g, 'rs', H3.mundo(g, g.J, [-1.25 * enc, -.8, -.3]));
      ach(g, 'act', H3.mundo(g, g.Z, [-1.9 + sl, .45, .1])); ach(g, 'tm', H3.mundo(g, g.Z, [.6 + sl, .52, .15])); ach(g, 'mio', H3.mundo(g, g.Z, [2, -.95, .2]));
      if (e.ca > .3) H3.ficha(g, H3.mundo(g, g.J, [1.7, -.5, .2]), 'Ca²⁺', '#7FD8FF', { pr: 2 });
    },
    camera(g, P) {
      const lar = H3.deitado(g), v = g.vv || 0, f = sst(2.8, 3.8, v);
      if (lar) return cam(g, P, 4.9, 2.1, { th: .18, fi: .14, al: [mix(-.6, .6, f), 0, 0], k: mix(1.02, .98, f), viva: .4 });
      return cam(g, P, 1.9, mix(2.0, 2.0, f), { th: .16, fi: .12, al: [0, mix(1.55, -1.6, f), 0], k: 1.05, viva: .4 });
    }
  });
})();
