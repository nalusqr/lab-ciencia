/* LAB Histologia: cenas 3D dos tecidos em geral e do epitélio (Martin). Bloco de parede de órgão em corte, corado em HE,
   com aproximação que revela os quatro tecidos; epitélios de revestimento em bloco sobre a membrana basal, com o capilar
   embaixo e a difusão subindo (o epitélio não tem vasos); glândula exócrina com ducto e endócrina junto ao capilar, com a
   secreção andando. Usa o kit histo3d.js; a cena 2D antiga fica como plano B sem WebGL. */
'use strict';
(function () {
  const H3 = window.HIS3D; if (!H3) return;
  const { V, K } = H3, { cl, mix, seg, sst, TAU, hash, add, fr } = V;
  const cam = (g, P, hx, hy, o = {}) => H3.viva({ th: o.th == null ? .3 : o.th, fi: o.fi == null ? .22 : o.fi, d: H3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .6 : o.viva);
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const hexGeo = g => H3.cilindro(g, 6);
  const RED = () => H3.REDUZ();

  // =====================================================================================
  // OS QUATRO TECIDOS: bloco da parede do intestino (ou da pele) em corte, com aproximação no tecido escolhido
  // =====================================================================================
  const TEC = ['epit', 'conj', 'musc', 'nerv'];
  const PV = {
    epit: { nome: 'Tecido epitelial', frase: 'Células coladas umas nas outras, quase sem matriz e sem vasos. Reveste superfícies e forma glândulas.', cor: K.epit },
    conj: { nome: 'Tecido conjuntivo', frase: 'Células afastadas em muita matriz, com fibras e vasos. Sustenta, liga, preenche, defende e transporta.', cor: K.conj },
    musc: { nome: 'Tecido muscular', frase: 'Células alongadas (fibras) que se contraem e movem o órgão.', cor: K.musc },
    nerv: { nome: 'Tecido nervoso', frase: 'Neurônios e glia bem juntos, quase sem matriz. Recebem, conduzem e integram sinais.', cor: K.neur },
    vaso: { nome: 'Vaso sanguíneo em corte', frase: 'Fica no conjuntivo: é de lá que o epitélio, sem vasos, recebe nutrientes por difusão.', cor: K.sangue }
  };
  HIS3D_visao();
  function HIS3D_visao() {
    // camadas (y de cima, y de baixo) em cada órgão
    const CAM = {
      int: { epit: [2.3, 1.55], conj: [1.55, .15], musc: [.15, -1.55], nerv: [-.55, -.55] },
      pele: { epit: [2.3, 1.75], conj: [1.75, -.35], musc: [-.85, -1.75], nerv: [.6, .6] }
    };
    const LX = 4.2, LZ = 1.6;
    H3.cena('tecidos/visao', {
      fit: 18, raio: 8, bolas: 300,
      pecas: PV,
      rotulos: [{ pc: 'epit', t: 'epitelial' }, { pc: 'conj', t: 'conjuntivo' }, { pc: 'musc', t: 'muscular' }, { pc: 'nerv', t: 'nervoso' }],
      montar(g) {
        const T = g.T; g.he = { epit: [], conj: [], musc: [], nerv: [] }; g.dim = [1, 1, 1, 1];
        const reg = (k, gr) => { gr.children.forEach(m => g.he[k].push(m.material)); return gr; };
        g.pl = H3.corte(g, g.raiz, [0, 0, -1], LZ - .07);
        // intestino
        g.int = new T.Group(); g.raiz.add(g.int);
        const lam = H3.bloco(g, H3.caixa(g, LX * 2, 1.4, LZ * 2, 40, 'vL'), K.conjC, { pai: g.int, pc: 'conj', fib: .7, dn: .32, esc: 3.2, dir: [1, .3, 0] }); lam.position.y = .85; reg('conj', lam);
        const circ = H3.bloco(g, H3.caixa(g, LX * 2, .7, LZ * 2, 40, 'vC'), K.muscC, { pai: g.int, pc: 'musc', fib: .9, dn: .5, esc: 4, fq: 10, dir: [1, 0, 0], cf: '#F08FA5' }); circ.position.y = -.2; reg('musc', circ);
        const lon = H3.bloco(g, H3.caixa(g, LX * 2, .7, LZ * 2, 40, 'vO'), K.muscC, { pai: g.int, pc: 'musc', fib: .8, dn: .4, esc: 4, fq: 14, dir: [0, 0, 1], cf: '#F08FA5' }); lon.position.y = -1.2; reg('musc', lon);
        const ser = H3.bloco(g, new T.BoxGeometry(LX * 2, .12, LZ * 2), K.conjC, { pai: g.int, pc: 'conj', dn: .6, esc: 6 }); ser.position.y = -1.61; reg('conj', ser);
        // pele
        g.pele = new T.Group(); g.raiz.add(g.pele);
        const der = H3.bloco(g, H3.caixa(g, LX * 2, 2.1, LZ * 2, 40, 'vD'), K.conjC, { pai: g.pele, pc: 'conj', fib: 1, dn: .2, esc: 2.6, fq: 6, dir: [1, .2, .3] }); der.position.y = .7; reg('conj', der);
        const hip = H3.bloco(g, H3.caixa(g, LX * 2, .5, LZ * 2, 40, 'vH'), '#F4E3C2', { pai: g.pele, pc: 'conj', fib: .3, dn: .08, esc: 1.6, fq: 3, cf: '#F2B3C2' }); hip.position.y = -.6; reg('conj', hip);
        const mus = H3.bloco(g, H3.caixa(g, LX * 2, .9, LZ * 2, 40, 'vM'), K.muscC, { pai: g.pele, pc: 'musc', fib: .9, dn: .35, esc: 4, fq: 12, dir: [1, 0, 0], cf: '#F08FA5' }); mus.position.y = -1.3; reg('musc', mus);
        // células epiteliais (cortadas na frente: núcleos aparecem no corte)
        g.cel = H3.celulas(g, 420, { geo: hexGeo(g), nucleo: true, planos: [g.pl], pc: 'epit' });
        g.cel2 = H3.celulas(g, 420, { nucleo: true, planos: [g.pl], pc: 'epit' });
        // nervos: corpos de neurônios (plexo) e feixes em corte
        g.neu = H3.celulas(g, 40, { nucleo: true, planos: [g.pl], pc: 'nerv', p: { roughness: .45 } });
        g.fibN = [0, 1, 2].map(() => H3.tubo(g, 30, 8, H3.fis(g, '#E8D79A', { p: { roughness: .5 } }), g.raiz, 'nerv'));
        // vasos em corte (anel de endotélio, luz escura e hemácias)
        g.anel = H3.inst(g, H3.toro(g, .22, 20), H3.fis(g, K.endot, { p: { roughness: .5 } }), 12, null, g.pecas.vaso); g.pick.push(g.anel.m);
        g.luz = H3.inst(g, H3.cilindro(g, 20), H3.fis(g, '#3A1420', { p: { roughness: .8, clearcoat: 0 } }), 12);
        g.H = H3.hemacias(g, 40, 'vaso');
      },
      animar(g, P) {
        const S = P.S, t = P.t, pele = !!S.pele, a = Math.round(S.v), q = CAM[pele ? 'pele' : 'int'];
        g.int.visible = !pele; g.pele.visible = pele; g.a = a; g.lay = q;
        // destaque: o tecido escolhido fica aceso, os outros esmaecem
        TEC.forEach((k, i) => { const alvo = a === 4 || a === i ? 1 : .42; g.dim[i] += (alvo - g.dim[i]) * (1 - Math.exp(-(g.dt || .016) * 5)); g.he[k].forEach(m => { m.uniforms.uK.value = g.dim[i]; }); });
        const [dE, dC, dM, dN] = g.dim;
        // epitélio
        const yb = q.epit[1], zc = LZ - .07;
        if (!pele) {
          const nx = 26, nz = 9, dx = LX * 2 / nx, dz = LZ * 2 / nz, h = .72;
          for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
            const x = -LX + dx * (i + .5) + (j & 1 ? dx * .25 : -dx * .25), z = -LZ + dz * (j + .5), cal = (i * 7 + j * 3) % 9 === 4, hh = h * (.95 + .1 * hash(i, j));
            H3.put(g, g.cel, [x, yb + hh / 2, z], null, dx * .55, hh, dz * .62, cal ? '#CFE3F2' : K.epiC, dE, g.pecas.epit);
            H3.put(g, g.cel.nuc, [x, yb + hh * (cal ? .14 : .28), z], null, dx * .2, hh * .16, dx * .2, K.nucleo, dE, g.pecas.epit);
          }
        } else {
          // epiderme: basal, espinhosa, granulosa e queratina (sem núcleo)
          const L = [[.18, .2, .12, 1], [.24, .2, .2, 1], [.28, .17, .26, 1], [.34, .1, .3, 1], [.4, .06, .38, 0], [.44, .05, .4, 0]];
          let y = yb;
          L.forEach(([r, hh, d, nu], k) => {
            const nx = Math.round(LX * 2 / (r * 1.7)), nz = Math.round(LZ * 2 / (r * 1.7)), dx = LX * 2 / nx, dz = LZ * 2 / nz;
            for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
              const x = -LX + dx * (i + .5) + (k & 1 ? dx * .3 : 0), z = -LZ + dz * (j + .5);
              H3.put(g, g.cel2, [x, y + hh * .5, z], null, dx * .55, hh * .6, dz * .55, nu ? K.epiC : '#F1D2A4', dE * (nu ? 1 : .95), g.pecas.epit);
              if (nu) H3.put(g, g.cel2.nuc, [x, y + hh * .5, z], null, dx * .18, hh * .26, dx * .18, K.nucleo, dE, g.pecas.epit);
            }
            y += hh * .92;
          });
        }
        H3.fimCel(g.cel); H3.fimCel(g.cel2);
        // vasos em corte na face da frente do conjuntivo
        const vs = pele ? [[-2.6, 1.1, .2], [.8, .1, .17], [2.9, 1.25, .15], [-.9, -.55, .2]] : [[-2.7, 1.05, .16], [-.2, .55, .2], [2.4, 1.15, .15], [1.2, .5, .13]];
        vs.forEach(([x, y, r], i) => {
          g._q.setFromAxisAngle(g._v1.set(1, 0, 0), 0);
          H3.put(g, g.anel, [x, y, LZ + .005], null, r, r, r * .8, K.endot, dC, g.pecas.vaso);
          H3.put(g, g.luz, [x, y, LZ - .06], g._q2.setFromAxisAngle(g._v2.set(1, 0, 0), Math.PI / 2), r * .95, .14, r * .95, '#3A1420', dC);
          for (let k = 0; k < 2; k++) { const u = k * Math.PI + i + (RED() ? 0 : t * .4); H3.put(g, g.H, [x + Math.cos(u) * r * .4, y + Math.sin(u) * r * .4, LZ + .03], g._q2.setFromAxisAngle(g._v2.set(1, 0, 0), Math.PI / 2 + .3), r * .4, r * .4, r * .4, K.hemacia, dC, g.pecas.vaso); }
        });
        H3.fim(g.anel); H3.fim(g.luz); H3.fim(g.H);
        // tecido nervoso: plexo (intestino) ou feixes da derme (pele)
        const yn = q.nerv[0], gang = pele ? [[-1.9, yn], [2.1, yn - .2]] : [[-2.2, yn], [.4, yn], [2.9, yn]];
        let k = 0;
        gang.forEach(([x, y], i) => { for (let j = 0; j < (pele ? 5 : 6); j++) { const u = j / 6 * TAU + i, rr = .2 * hash(j, i + 3) + .1; H3.celula(g, g.neu, [x + Math.cos(u) * rr * 1.4, y + Math.sin(u) * rr * .7, LZ - .02 - hash(j, i) * .2], pele ? .07 : .11, j % 3 ? K.neurC : '#B58BD0', { n: .45, k: dN * (1 + .25 * Math.max(0, Math.sin(t * 3 - j))), pc: g.pecas.nerv, cn: '#5A3BA8' }); k++; } });
        H3.fimCel(g.neu);
        g.fibN.forEach((tb, i) => {
          if (pele && i === 2) { tb.set([]); return; }
          const P2 = [], y0 = yn + (i - 1) * .05;
          for (let s = 0; s < 30; s++) { const x = -LX + s / 29 * LX * 2; P2.push([x, y0 + Math.sin(x * 1.3 + i * 2) * .1, LZ + .02 - i * .03]); }
          tb.set(P2, .035 + .01 * i);
        });
        g.fibN.forEach(tb => { tb.mesh.material.color.setRGB(.91 * dN, .84 * dN, .6 * dN); });
        // âncoras dos rótulos
        const mid = (k2, f) => (q[k2][0] + q[k2][1]) / 2 + (f || 0);
        ach(g, 'epit', [LX * .55, q.epit[0] + .05, LZ * .2]); ach(g, 'conj', [-LX * .62, mid('conj'), LZ]); ach(g, 'musc', [LX * .5, mid('musc'), LZ]); ach(g, 'nerv', [gang[0][0], yn + .25, LZ]);
        // painel: proporção de células e matriz (ilustrativa)
        g.dens = a < 4 ? [.92, .25, .85, .9][a] : null;
      },
      camera(g, P) {
        const a = g.a == null ? 4 : g.a, q = g.lay || CAM.int, lar = H3.deitado(g);
        if (a === 4) return cam(g, P, LX + .4, 2.5, { th: .38, fi: .24, al: [0, .35, 0], k: lar ? 1.02 : 1.1 });
        const y = (q[TEC[a]][0] + q[TEC[a]][1]) / 2, x = a === 3 ? (g.lay === CAM.pele ? -1.9 : -2.2) : a === 1 ? -1.2 : .6;
        return cam(g, P, lar ? 2.1 : 1.5, 1.2, { th: .22, fi: .16, al: [x * (lar ? .6 : .9), y, LZ * .4], k: 1, viva: .4 });
      },
      sobre(g) {
        if (g.dens == null) return; const x = NAR ? 12 : 24, y = NAR ? 50 : 70, w = NAR ? 150 : 200;
        rr(x, y, w, 10, 5, 'rgba(11,15,28,.7)', 'rgba(255,255,255,.18)', 1); rr(x, y, w * g.dens, 10, 5, K.nucleo);
        tx(`células cerca de ${Math.round(g.dens * 100)}%, matriz o resto`, x, y + 22, { s: 12, w: 600, a: 'left', c: C.txt });
        H3.reserva(g, [x - 4, y - 6, w + 120, 40]);
      }
    });
  }

  // =====================================================================================
  // EPITÉLIOS DE REVESTIMENTO: bloco sobre membrana basal, com o capilar no conjuntivo e a difusão subindo
  // =====================================================================================
  const PR = {
    epi: { nome: 'Epitélio', frase: 'Células coladas por junções, sem vasos: recebe nutrientes e O₂ por difusão a partir do conjuntivo.', cor: K.epit },
    mb: { nome: 'Membrana basal', frase: 'Camada fina de proteínas que prende o epitélio ao conjuntivo e filtra o que passa.', cor: '#F6D3E1' },
    conj: { nome: 'Tecido conjuntivo', frase: 'Fica logo abaixo e tem os vasos que nutrem o epitélio.', cor: K.conj },
    cap: { nome: 'Capilar', frase: 'Os vasos ficam no conjuntivo, nunca entre as células do epitélio.', cor: K.sangue },
    dif: { nome: 'Difusão', frase: 'Nutrientes e O₂ saem do capilar, atravessam a membrana basal e chegam às células do epitélio.', cor: '#FFE7A3' },
    mv: { nome: 'Microvilosidades', frase: 'Dobras da membrana no topo das células: aumentam muito a área de absorção (intestino).', cor: '#9FE6E2' },
    cil: { nome: 'Cílios', frase: 'Batem juntos e empurram o muco, com as partículas presas nele, em direção à garganta.', cor: '#9FE6E2' },
    muco: { nome: 'Muco', frase: 'Feito pelas células caliciformes: prende poeira e microrganismos.', cor: K.muco },
    cal: { nome: 'Célula caliciforme', frase: 'Célula em forma de cálice que produz muco.', cor: K.muco },
    ker: { nome: 'Queratina', frase: 'Camadas de células mortas cheias de queratina: protegem contra atrito e perda de água, e descamam.', cor: '#F1D2A4' },
    gch: { nome: 'Célula guarda-chuva', frase: 'Células grandes e abauladas que se achatam quando a bexiga enche.', cor: K.epit }
  };
  const ESPE = { 0: [], 1: [], 2: ['mv', 'cal'], 3: ['cil', 'muco'], 4: ['ker'], 5: [], 6: ['gch'] };
  H3.cena('epitelial/revestimento', {
    fit: 14, raio: 6, bolas: 260,
    pecas: PR,
    rotulos: [{ pc: 'epi', t: 'epitélio' }, { pc: 'mb', t: 'membrana basal' }, { pc: 'conj', t: 'conjuntivo' }, { pc: 'cap', t: 'capilar' }, { pc: 'dif', t: 'difusão' }, { pc: 'mv', t: 'microvilosidades' }, { pc: 'cil', t: 'cílios' }, { pc: 'muco', t: 'muco' }, { pc: 'cal', t: 'caliciforme' }, { pc: 'ker', t: 'queratina' }, { pc: 'gch', t: 'guarda-chuva' }],
    montar(g) {
      const T = g.T, X0 = 3.2, Z0 = 1.3; g.X0 = X0; g.Z0 = Z0;
      g.pl = H3.corte(g, g.raiz, [0, 0, -1], Z0);
      const cj = H3.bloco(g, H3.caixa(g, X0 * 2, 1.7, Z0 * 2 + .6, 36, 'rC'), K.conjC, { pc: 'conj', fib: .8, dn: .22, esc: 3, fq: 6, dir: [1, .25, .2] }); cj.position.set(0, -.88, -.3);
      const mb = H3.bloco(g, new T.BoxGeometry(X0 * 2, .05, Z0 * 2 + .6), '#F6D3E1', { pc: 'mb', dn: 0, esc: 8, fib: .4, cf: '#FFFFFF' }); mb.position.set(0, -.01, -.3);
      g.vaso = H3.vaso(g, [[-X0 - .3, -1.0, Z0 + .02], [-1, -1.08, Z0 + .02], [1.2, -.95, Z0 + .02], [X0 + .3, -1.02, Z0 + .02]], .2, { pc: 'cap', n: 11, vel: .05, base: .32 });
      g.cel = H3.celulas(g, 900, { geo: hexGeo(g), nucleo: true, planos: [g.pl], pc: 'epi' });
      g.lum = H3.celulas(g, 900, { nucleo: true, planos: [g.pl], pc: 'epi' });
      g.pel = H3.inst(g, H3.cilindro(g, 10), H3.fis(g, '#F1D2A4', { p: { roughness: .55, clearcoat: .2 } }), 600, null, g.pecas.ker); g.pick.push(g.pel.m);
      g.mvs = H3.inst(g, H3.cilindro(g, 6), H3.fis(g, '#BDEDEA', { p: { roughness: .4 } }), 1600, null, g.pecas.mv); g.pick.push(g.mvs.m);
      g.cil = H3.inst(g, H3.cilindro(g, 5), H3.fis(g, '#BDEDEA', { p: { roughness: .4 } }), 1400, null, g.pecas.cil); g.pick.push(g.cil.m);
      g.muco = H3.peca(g, new T.BoxGeometry(X0 * 2, 1, Z0 * 2 + .6), H3.filme(g, K.muco, { cor2: '#FFFFFF', dentro: '#4A5A70', base: .22, fr: .45, esc: 3 }), 'muco'); g.muco.renderOrder = 6;
      g.tc = -9; g.tipo = -1;
    },
    animar(g, P) {
      const S = P.S, t = P.t, tipo = cl(Math.round(S.v), 0, 6), X0 = g.X0, Z0 = g.Z0, esp = S.esp, w = (S.dt || .016);
      if (tipo !== g.tipo) { g.tipo = tipo; g.tc = t; }
      const e = RED() ? 1 : sst(0, .8, t - g.tc), z0 = -Z0 - .6;
      g.tipoV = tipo; let topo = 0;
      const cel = (W, x, z, y, sx, sy, sz, cor, ny, nsy, o = {}) => {
        H3.put(g, W, [x, y + sy * e / 2, z], o.q || null, sx, sy * e, sz, cor, o.k || 1, g.pecas[o.pc || 'epi']);
        if (ny != null) H3.put(g, W.nuc, [x, y + ny * e, z], null, o.nx || sx * .38, nsy * e, o.nx || sz * .38, K.nucleo, 1, g.pecas[o.pc || 'epi']);
      };
      const grade = (r, f) => { const dx = r * 1.73, nx = Math.round(X0 * 2 / dx), dz = r * 1.5, nz = Math.round((Z0 * 2 + .6) / dz); for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) { const x = -X0 + (i + .5 + (j & 1 ? .5 : 0)) * (X0 * 2 / nx), z = z0 + (j + .5) * dz; if (x > X0 - .02) continue; f(x, z, i, j); } };
      const tops = [];
      if (tipo === 0) grade(.34, (x, z) => { cel(g.cel, x, z, 0, .36, .08, .36, K.epiC, .05, .07, { nx: .13 }); }), topo = .09;
      else if (tipo === 1) grade(.2, (x, z) => { cel(g.cel, x, z, 0, .21, .38, .21, K.epiC, .19, .1, { nx: .09 }); }), topo = .38;
      else if (tipo === 2) grade(.14, (x, z, i, j) => { const cal = (i * 5 + j * 3) % 7 === 3; cel(g.cel, x, z, 0, .15, .9, .15, cal ? '#CFE3F2' : K.epiC, cal ? .1 : .22, .14, { nx: .06, pc: cal ? 'cal' : 'epi' }); if (cal) { H3.bola(g, [x, .62 * e, z], .11 * e, K.muco, 1, g.pecas.cal); if (!g.anc.cal || z > Z0 - .3) g.anc.cal = [x, .7, z]; } else tops.push([x, z]); }), topo = .9;
      else if (tipo === 3) {
        grade(.14, (x, z, i, j) => { const cal = (i * 5 + j * 3) % 8 === 3, hn = [.2, .42, .62][(i + j * 2) % 3]; cel(g.cel, x, z, 0, .15, 1, .15, cal ? '#CFE3F2' : K.epiC, cal ? .12 : hn, .12, { nx: .06, pc: cal ? 'cal' : 'epi' }); if (cal) H3.bola(g, [x, .72 * e, z], .11 * e, K.muco, 1, g.pecas.cal); else tops.push([x, z]); if ((i + j) % 2 === 0) cel(g.lum, x + .07, z + .07, 0, .1, .26, .1, K.epiC, .12, .08, { nx: .05 }); });
        topo = 1;
      } else if (tipo === 4 || tipo === 5) {
        const ker = tipo === 4, L = [[.18, .2, 1], [.2, .2, 1], [.23, .17, 1], [.27, .13, 1], [.3, .09, 1]]; let y = 0;
        L.forEach(([r, hh], k) => { grade(r, (x, z) => { cel(g.lum, x + (k & 1) * r * .4, z, y, r * 1.02, hh, r * 1.02, k > 2 ? '#EDB4C8' : K.epiC, hh * .5, hh * .5, { nx: r * .36 }); }); y += hh * .9; });
        topo = y;
        if (ker) {
          // queratina: placas sem núcleo; com o botão, as de cima soltam e sobem
          const sol = esp === 'ker' && !RED();
          for (let k = 0; k < 3; k++) grade(.3, (x, z, i, j) => {
            let yy = y + k * .06, dz = 0, rot = null; const id = i * 31 + j * 7 + k;
            if (sol && k === 2) { const f = fr(t * .18 + hash(id, 2)); yy += f * 1.4; dz = f * .3; g._e.set(f * 1.2 * (hash(id, 3) - .5), 0, f * (hash(id, 4) - .5)); rot = g._q.setFromEuler(g._e); }
            H3.put(g, g.pel, [x, yy * e, z + dz], rot, .29, .05 * e, .29, k === 2 ? '#F4DDB4' : '#EBC795', 1, g.pecas.ker);
          });
          topo = y + .2; ach(g, 'ker', [X0 * .35, topo + .1, Z0 * .2]);
        }
      } else {
        const s = RED() ? .5 : .5 + .5 * Math.sin(t * .6), L = [[.13, .2], [.16, .2]]; let y = 0;
        L.forEach(([r, hh]) => { grade(r, (x, z) => { cel(g.lum, x, z, y, r, hh, r, K.epiC, hh * .5, hh * .5, { nx: r * .36 }); }); y += hh * .92; });
        grade(.3, (x, z, i, j) => { const hh = mix(.34, .16, s), rr = mix(.3, .38, s); cel(g.lum, x, z, y, rr, hh, rr, '#ECA9C3', hh * .45, hh * .35, { nx: .08, pc: 'gch' }); if ((i + j) % 3 === 1) H3.put(g, g.lum.nuc, [x + .1, y + hh * .45 * e, z], null, .08, hh * .35 * e, .08, K.nucleo, 1, g.pecas.gch); });
        topo = y + .3; ach(g, 'gch', [X0 * .3, topo + .02, Z0 * .3]);
      }
      // microvilosidades (prismático) e cílios com muco (pseudoestratificado)
      if (tipo === 2) { const big = esp === 'mv' ? 1.8 : 1; tops.forEach(([x, z], k) => { for (let m = 0; m < 4; m++) { const dx = ((m & 1) - .5) * .09, dz = ((m >> 1) - .5) * .09; H3.put(g, g.mvs, [x + dx, topo * e + .04 * big, z + dz], null, .013 * big, .08 * big * e, .013 * big, '#BDEDEA', 1, g.pecas.mv); } }); ach(g, 'mv', [X0 * .4, topo + .1, Z0 * .4]); ach(g, 'cal', g.anc.cal || [0, .7, Z0]); }
      const fum = esp === 'fum';
      if (tipo === 3) {
        const cL = (fum ? .07 : .17) * e;
        tops.forEach(([x, z], k) => { if (fum && k % 3) return; for (let m = 0; m < 3; m++) { const bx = x + (m - 1) * .05, ang = RED() ? .2 : .55 * Math.sin(t * 7 - bx * 2.4); const a = [bx, topo * e, z], b = [bx + Math.sin(ang) * cL, topo * e + Math.cos(ang) * cL, z]; H3.bastao(g, g.cil, a, b, .01, '#BDEDEA', 1, g.pecas.cil); } });
        const mh = (fum ? .32 : .14) * e; g.muco.visible = e > .3; g.muco.scale.set(1, mh, 1); g.muco.position.set(0, topo + .2 + mh / 2, -.3);
        g.mpos = (g.mpos || 0) + w * (fum ? .01 : .06);
        for (let j = 0; j < 26; j++) H3.bola(g, [-X0 + fr(hash(j, 1) + g.mpos) * X0 * 2, topo + .2 + mh * (.25 + .5 * hash(j, 2)), z0 + .2 + hash(j, 3) * (Z0 * 2 + .4)], .025 + .02 * hash(j, 4), fum ? '#3A3430' : '#5A5048', 1, g.pecas.muco);
        ach(g, 'cil', [X0 * .55, topo + .12, Z0]); ach(g, 'muco', [-X0 * .45, topo + .2 + mh, Z0 * .2]);
      } else g.muco.visible = false;
      H3.fimCel(g.cel); H3.fimCel(g.lum); H3.fim(g.pel); H3.fim(g.mvs); H3.fim(g.cil);
      // capilar e difusão: pontos sobem do capilar até as células
      g.vaso.set(t);
      for (let j = 0; j < 24; j++) {
        const f = RED() ? hash(j, 5) : fr(t * .22 + j / 24), x = -X0 + .4 + hash(j, 1) * (X0 * 2 - .8), y = mix(-.85, Math.min(topo * .5, .3), f);
        const a = Math.sin(f * Math.PI); if (a > .05) H3.brilho(g, [x + Math.sin(f * 6 + j) * .05, y, Z0 + .04], .025 * a + .01, j % 3 ? '#FFE7A3' : '#9FE6FF', 1.3);
      }
      ach(g, 'epi', [-X0 * .62, topo * .55, Z0]); ach(g, 'mb', [X0 * .75, 0, Z0]); ach(g, 'conj', [-X0 * .2, -1.45, Z0]); ach(g, 'cap', [X0 * .45, -1.0, Z0 + .2]); ach(g, 'dif', [-X0 * .15, -.45, Z0 + .05]);
    },
    camera(g, P) { const lar = H3.deitado(g); return cam(g, P, lar ? 3.3 : 2.4, 1.8, { th: .32, fi: .2, al: [0, -.45, .2], k: lar ? 1.05 : 1.12 }); }
  });

  // =====================================================================================
  // EPITÉLIOS GLANDULARES: exócrina com ducto, endócrina junto ao capilar e a mista (pâncreas)
  // =====================================================================================
  const PG = {
    sup: { nome: 'Epitélio de revestimento', frase: 'As glândulas nascem dele: células brotam para dentro do conjuntivo.', cor: K.epit },
    duto: { nome: 'Ducto', frase: 'Tubo que leva a secreção da glândula exócrina até a superfície ou uma cavidade.', cor: K.epit },
    acino: { nome: 'Porção secretora (exócrina)', frase: 'Células que fabricam a secreção e a liberam na luz do ducto.', cor: '#F2B36B' },
    secr: { nome: 'Secreção', frase: 'Sai pelo ducto: suor, saliva, suco digestivo, leite, sebo.', cor: K.secr },
    endo: { nome: 'Glândula endócrina', frase: 'Sem ducto: as células ficam junto aos capilares e lançam hormônios no sangue.', cor: '#C99AE0' },
    cap: { nome: 'Capilar', frase: 'Recebe o hormônio e o leva pelo sangue até as células-alvo.', cor: K.sangue },
    horm: { nome: 'Hormônio', frase: 'Mensageiro químico lançado no sangue (por exemplo, a insulina das ilhotas do pâncreas).', cor: '#B8F07A' },
    conj: { nome: 'Tecido conjuntivo', frase: 'Envolve a glândula e traz os vasos.', cor: K.conj }
  };
  H3.cena('epitelial/glandular', {
    fit: 14, raio: 6, bolas: 260,
    pecas: PG,
    rotulos: [{ pc: 'sup', t: 'epitélio de revestimento' }, { pc: 'duto', t: 'ducto' }, { pc: 'acino', t: 'porção secretora' }, { pc: 'secr', t: 'secreção' }, { pc: 'endo', t: 'células endócrinas' }, { pc: 'cap', t: 'capilar' }, { pc: 'horm', t: 'hormônio' }],
    so2D: S => !!S.modos,
    montar(g) {
      const T = g.T, X0 = 3.4, Z0 = 1.2; g.X0 = X0; g.Z0 = Z0;
      g.pl = H3.corte(g, g.raiz, [0, 0, -1], 0);
      const cj = H3.bloco(g, H3.caixa(g, X0 * 2, 3, Z0 * 2, 36, 'gC'), K.conjC, { pc: 'conj', fib: .7, dn: .2, esc: 2.8, fq: 6, planos: [g.pl] }); cj.position.set(0, -1.5, 0);
      g.sup = H3.celulas(g, 400, { geo: hexGeo(g), nucleo: true, planos: [g.pl], pc: 'sup' });
      g.ac = H3.celulas(g, 120, { nucleo: true, planos: [g.pl], pc: 'acino' });
      g.en = H3.celulas(g, 60, { nucleo: true, planos: [g.pl], pc: 'endo' });
      g.du = H3.celulas(g, 160, { nucleo: true, planos: [g.pl], pc: 'duto', geo: hexGeo(g) });
      g.H = H3.hemacias(g, 30, 'cap');
      g.vA = H3.tubo(g, 40, 16, H3.filme(g, '#F06C82', { cor2: '#FFD0D8', dentro: '#5A1828', base: .25, fr: .55, esc: 2.5 }), g.raiz, 'cap'); g.vA.mesh.renderOrder = 4;
    },
    animar(g, P) {
      const S = P.S, t = P.t, v = cl(S.v, 0, 2), X0 = g.X0, Z0 = g.Z0;
      const wA = 1 - sst(1.25, 1.85, v), wB = sst(.35, .95, v), duto = 1 - sst(1.25, 1.75, v);
      const xA = mix(0, -1.6, wB), xB = mix(1.6, 0, 1 - wA), yA = -1.9, yB = -1.7;
      g.est = { wA, wB, xA, xB };
      // superfície: cuboides, com abertura no ducto
      const dx = .26, nx = Math.round(X0 * 2 / dx), dz = .26, nz = Math.round(Z0 * 2 / dz);
      for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
        const x = -X0 + (i + .5) * X0 * 2 / nx, z = -Z0 + (j + .5) * Z0 * 2 / nz, d = Math.hypot(x - xA, z);
        if (wA > .05 && duto > .2 && d < .2) continue;
        H3.put(g, g.sup, [x, .2, z], null, .15, .4, .15, K.epiC, 1, g.pecas.sup); H3.put(g, g.sup.nuc, [x, .2, z], null, .06, .08, .06, K.nucleo, 1, g.pecas.sup);
      }
      H3.fimCel(g.sup);
      // exócrina: ducto (células em anel) e ácino (células em volta da luz) com grânulos
      if (wA > .02) {
        const top = 0, bot = yA + .55, L = top - bot, nR = 7;
        for (let k = 0; k < 8; k++) { const y = mix(top, bot, k / 7), vis = seg(duto * 8 - (7 - k), 0, 1); if (vis <= 0) continue; for (let r = 0; r < nR; r++) { const u = r / nR * TAU + k * .4, p = [xA + Math.cos(u) * .2, y, Math.sin(u) * .2]; g._v1.set(Math.cos(u), 0, Math.sin(u)); g._q.setFromUnitVectors(g._v2.set(0, 1, 0), g._v1); H3.put(g, g.du, p, g._q, .07 * vis * wA, .09 * wA, .07 * wA, K.epiC, 1, g.pecas.duto); H3.put(g, g.du.nuc, add(p, [Math.cos(u) * .03, 0, Math.sin(u) * .03]), null, .035 * vis * wA, null, null, K.nucleo, 1, g.pecas.duto); } }
        for (let k = 0; k < 22; k++) { const y = 1 - (k + .5) / 22 * 2, r = Math.sqrt(1 - y * y), u = k * 2.4; const n = [Math.cos(u) * r, y, Math.sin(u) * r]; if (n[1] > .75) continue; const p = [xA + n[0] * .5, yA + n[1] * .5, n[2] * .5]; H3.celula(g, g.ac, p, .2 * wA, '#F2B36B', { n: .4, nd: [n[0] * .45, n[1] * .45, n[2] * .45], pc: g.pecas.acino, f: [1, 1, 1] }); for (let m = 0; m < 2; m++) H3.bola(g, [xA + n[0] * .32, yA + n[1] * .32 + (m - .5) * .05, n[2] * .32], .04 * wA, K.secr, 1.1, g.pecas.secr); }
        // secreção: sobe pelo ducto e se espalha na superfície
        for (let j = 0; j < 9; j++) { const f = RED() ? j / 9 : fr(t * .16 + j / 9); let p; if (f < .75) p = [xA + Math.sin(j * 2) * .05, mix(yA, .42, f / .75), Math.cos(j * 2) * .05]; else { const q = (f - .75) / .25, u = j * 2.1; p = [xA + Math.cos(u) * q * .9, .45 + Math.sin(q * Math.PI) * .12, Math.sin(u) * q * .5]; } if (duto > .5) H3.bola(g, p, .07 * wA * (f > .9 ? (1 - f) * 10 : 1), K.secr, 1.2, g.pecas.secr); }
        ach(g, 'duto', [xA + .25, -.6, .2]); ach(g, 'acino', [xA - .45, yA - .1, .3]); if (duto > .5) ach(g, 'secr', [xA + .55, .5, .2]);
      }
      H3.fimCel(g.ac); H3.fimCel(g.du);
      // endócrina: cordões de células sem luz, abraçados por um capilar que leva o hormônio
      const cp = [];
      if (wB > .02) {
        for (let k = 0; k < 16; k++) { const y = 1 - (k + .5) / 16 * 2, r = Math.sqrt(1 - y * y), u = k * 2.4; H3.celula(g, g.en, [xB + Math.cos(u) * r * .38, yB + y * .38, Math.sin(u) * r * .38], .19 * wB, '#D7A8E6', { n: .42, pc: g.pecas.endo }); }
        for (let i = 0; i < 40; i++) { const u = i / 39, a = u * TAU * 1.5 - 1; cp.push([xB + Math.cos(a) * .72 + (u - .5) * .4, yB + (u - .5) * 1.4, Math.sin(a) * .62]); }
        cp.unshift([xB - 2.2, yB + .9, -.4]); cp.push([xB + 2.2, yB - .9, .4]);
        g.vA.set(cp.slice(0, 40), .13 * wB);
        for (let i = 0; i < 12; i++) { const f = RED() ? i / 12 : fr(t * .07 + i / 12), p = V.trilha(cp.slice(0, 40), f); H3.put(g, g.H, p, H3.giro(g, i, t), .09 * wB, .09 * wB, .09 * wB, K.hemacia, 1, g.pecas.cap); }
        // hormônio: sai das células, entra no capilar e vai embora
        for (let j = 0; j < 10; j++) { const f = RED() ? j / 10 : fr(t * .2 + j / 10), u = j * 1.7, a = [xB + Math.cos(u) * .3, yB + (hash(j, 1) - .5) * .5, Math.sin(u) * .3], b = V.trilha(cp.slice(0, 40), .3 + .4 * hash(j, 2)); const p = f < .5 ? V.lerp3(a, b, sst(0, .5, f)) : V.trilha(cp.slice(0, 40), cl(.3 + .4 * hash(j, 2) + (f - .5) * .6, 0, 1)); H3.brilho(g, p, .035 * wB, '#B8F07A', 1.3); }
        ach(g, 'endo', [xB + .3, yB - .45, .35]); ach(g, 'cap', V.trilha(cp.slice(0, 40), .85)); ach(g, 'horm', [xB - .4, yB + .5, .45]);
      } else g.vA.set([]);
      H3.fimCel(g.en); H3.fim(g.H);
      ach(g, 'sup', [-X0 * .72, .42, -Z0 * .3]);
    },
    camera(g, P) { const lar = H3.deitado(g); return cam(g, P, lar ? 3 : 2.3, 1.9, { th: .3, fi: .32, al: [0, -1.0, 0], k: lar ? 1.05 : 1.1 }); }
  });
})();
