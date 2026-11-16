/* LAB Morfofisiologia: cenas 3D das membranas (Martin). Fluidez, difusão simples, difusão facilitada, bomba de Na⁺/K⁺,
   endocitose e exocitose. Unidade: 1 = cerca de 1 nm. Tudo é função do passo e do tempo (P.passo, P.tp, P.t): pausar congela,
   e com movimento reduzido cada passo abre já no estado final. */
'use strict';
(function () {
  if (!window.MORFO3D) return;
  const K = MORFO3D, { cl, mix, seg, sst, add, sub, mul, nrm, len, lerp3, rng, hash, TAU } = K.V;
  const RED = () => window.MOL3D && MOL3D.reduz;
  const out = x => (window.MOL3D ? MOL3D.E.out(cl(x, 0, 1)) : x), mv = x => (window.MOL3D ? MOL3D.E.move(cl(x, 0, 1)) : x);
  const pc = (nome, cor, frase) => ({ nome, cor, frase });

  // ================= FLUIDEZ =================
  K.cena('membranas/fluidez', {
    alt: 'Modelo 3D de duas bicamadas lado a lado: à esquerda DPPC, de caudas retas; à direita DOPC, com uma dobra em cada cauda. Ao mudar a temperatura, as caudas passam de empacotadas e paradas (gel) para soltas e agitadas (fluida). Dá para girar, aproximar e tocar nas peças',
    fit: 34, raio: 16, nevoa: .01,
    pecas: {
      dppc: pc('DPPC', '#C98FB0', 'Fosfolipídio de caudas saturadas (16 carbonos, sem dupla ligação). As caudas retas se encaixam bem, por isso a bicamada só fica fluida acima de cerca de 41 °C.'),
      dopc: pc('DOPC', '#F06AAE', 'Fosfolipídio com uma dupla ligação cis em cada cauda (18 carbonos). A dobra atrapalha o empacotamento, e a bicamada continua fluida até cerca de −17 °C.'),
      cabeca: pc('Cabeça polar', '#F06AAE', 'Fosfato e colina: a parte hidrofílica, voltada para a água dos dois lados da membrana.'),
      cauda: pc('Caudas apolares', '#F4C9DC', 'Cadeias de ácido graxo, hidrofóbicas, escondidas no meio da bicamada.'),
      dobra: pc('Dobra cis', '#FFE1A6', 'A dupla ligação cis entorta a cauda em cerca de 30°. Menos encaixe entre vizinhos, mais fluidez.')
    },
    rotulos: [{ pc: 'dppc', t: 'DPPC, caudas saturadas', pr: 1 }, { pc: 'dopc', t: 'DOPC, caudas insaturadas', pr: 1 }, { pc: 'cabeca', t: 'Cabeça polar', pr: 2 }, { pc: 'cauda', t: 'Caudas apolares', pr: 2 }, { pc: 'dobra', t: 'Dobra cis', pr: 3 }],
    montar(g) {
      const q = g.q, f = q.cel ? [4.6, 4.6] : [6.4, 5.2];
      g.A = K.bicamada(g, { faixa: f, peca: g.pecas.dppc });
      g.B = K.bicamada(g, { faixa: f, peca: g.pecas.dopc, dobra: true });
      g.pick.push(g.A.H.m, g.A.Tl.m, g.B.H.m, g.B.Tl.m);
      g.dx = q.cel ? 6 : 8.4; g.f = f;
    },
    animar(g, P) {
      const T = P.S.v, t = P.t;
      const st = (Tm) => { const fl = T > Tm, k = fl ? cl((T - Tm) / 45, .25, 1) : .04; return { fl, k }; };
      const a = st(41), b = st(-17), cel = g.q.cel;
      const lado = (B, s, x) => B.atualizar({
        t, centro: cel ? [0, x * .62 * 1.6, 0] : [x, 0, 0], agita: s.k, difunde: s.fl ? .22 * s.k : 0, aperto: s.fl ? 1 : .94, inclina: s.fl ? 0 : .32,
        meia: s.fl ? 2.0 : 2.2, Lk: s.fl ? .92 : 1.02, corH: s.fl ? '#F06AAE' : '#B98AB0', corT: s.fl ? '#F4C9DC' : '#CFDDF7'
      });
      lado(g.A, a, -g.dx); lado(g.B, b, g.dx);
      const cA = cel ? [0, -g.dx * .62 * 1.6, 0] : [-g.dx, 0, 0], cB = cel ? [0, g.dx * .62 * 1.6, 0] : [g.dx, 0, 0];
      g.anc.dppc = add(cA, [-g.f[0] * .55, 3, -g.f[1] * .7]); g.anc.dopc = add(cB, [g.f[0] * .55, 3, -g.f[1] * .7]);
      g.anc.cabeca = add(cB, [-g.f[0] * .3, 2.2, g.f[1] * .8]); g.anc.cauda = add(cA, [g.f[0] * .6, 0, g.f[1] * .85]); g.anc.dobra = add(cB, [g.f[0] * .1, -.8, g.f[1] * .9]);
      ['dppc', 'dopc', 'cabeca', 'cauda', 'dobra'].forEach(k => { g.vis[k] = 1; g.raioPc[k] = 6; });
      g.est = [a, b];
    },
    camera(g, P) { const c = g.q.cel ? { th: -.32, fi: .22, d: 40, al: [0, 0, 0] } : { th: -.38, fi: .3, d: 36, al: [0, -.5, 0] }; return K.viva(c, P.t, .6); },
    legenda(P, g) {
      const T = P.S.v, [a, b] = g.est || [{}, {}], e = s => (s.fl ? 'fluida' : 'gel, rígida');
      return `<b>${T} °C</b>: DPPC ${e(a)}, DOPC ${e(b)}${T === 37 ? '<small>temperatura do corpo humano</small>' : ''}`;
    }
  });

  // ================= DIFUSÃO SIMPLES =================
  const TIPOS = [['O2', 24, 1, .5], ['CO2', 18, 0, .5], ['H2O', 14, 1, .03], ['H2O', 14, 0, .03], ['glicose', 12, 1, 0], ['Na', 14, 1, 0]];
  const NOME = { O2: 'O₂', CO2: 'CO₂', H2O: 'H₂O', glicose: 'glicose', Na: 'Na⁺' };
  const BX = 15, BZ = 7, BY = 12, BAND = 2.7;
  K.cena('membranas/difusao', {
    alt: 'Modelo 3D de uma bicamada com moléculas dos dois lados: O₂ e CO₂ atravessam sozinhos do lado mais concentrado para o menos concentrado; a água passa devagar; glicose e Na⁺ não passam. Os contadores mostram quantas moléculas estão acima e abaixo',
    fit: 44, raio: 20, nevoa: .009,
    pecas: {
      O2: pc('O₂ (oxigênio)', '#FF6B6B', 'Pequeno e apolar: atravessa a bicamada sozinho, por difusão simples, a favor do gradiente.'),
      CO2: pc('CO₂ (gás carbônico)', '#CED4DA', 'Pequeno e apolar: atravessa a bicamada sozinho, do lado mais concentrado para o menos concentrado.'),
      H2O: pc('H₂O (água)', '#FF8080', 'Pequena, mas polar: passa devagar pela bicamada. A maior parte da água usa canais, as aquaporinas.'),
      glicose: pc('Glicose', '#C8E07A', 'Grande e polar: praticamente não atravessa a bicamada. Entra por transportadores (GLUT).'),
      Na: pc('Íon Na⁺', '#AB7CF2', 'Íons têm carga e ficam presos numa capa de água: a bicamada os barra quase por completo.'),
      bic: pc('Bicamada lipídica', '#F06AAE', 'O miolo hidrofóbico deixa passar o que é pequeno e apolar, e barra íons e moléculas grandes e polares.'),
      fora: pc('Meio extracelular', '#9DA9C4', 'Lado de fora da célula: aqui começam mais concentrados o O₂, a glicose e o Na⁺.'),
      dentro: pc('Citoplasma', '#9DA9C4', 'Lado de dentro: aqui o CO₂ começa mais concentrado.')
    },
    rotulos: [{ pc: 'bic', t: 'Bicamada', pr: 2 }, { pc: 'O2', t: 'O₂', pr: 1 }, { pc: 'CO2', t: 'CO₂', pr: 1 }, { pc: 'H2O', t: 'Água', pr: 3 }, { pc: 'glicose', t: 'Glicose', pr: 2 }, { pc: 'Na', t: 'Na⁺', pr: 2 }, { pc: 'fora', t: 'Meio extracelular', pr: 4 }, { pc: 'dentro', t: 'Citoplasma', pr: 4 }],
    init(S) {
      const R = rng(11); S.p3 = [];
      TIPOS.forEach(([ty, n, top, perm]) => { for (let i = 0; i < n; i++) S.p3.push({ ty, perm, x: (R() * 2 - 1) * BX * .92, z: (R() * 2 - 1) * BZ * .9, y: top ? 3.5 + R() * (BY - 4) : -3.5 - R() * (BY - 4), f: R() * TAU, w: .4 + R() }); });
    },
    montar(g) {
      g.B = K.bicamada(g, { faixa: [BX + 2, BZ + 1.5], peca: g.pecas.bic });
      g.mol = K.moleculas(g, 110);
      g.pick.push(g.mol.b.m, g.mol.s.m, g.B.H.m, g.B.Tl.m);
      g.qq = new g.T.Quaternion(); g.eu = new g.T.Euler();
    },
    animar(g, P) {
      const S = P.S, t = P.t, dt = Math.min(.05, g.dt);
      if (!S.p3) this.init ? this.init(S) : 0;
      g.B.atualizar({ t, agita: .45, difunde: .12 });
      const sp = 7.5 * Math.sqrt(dt), cnt = {};
      const first = {};
      for (const p of S.p3) {
        for (let k = 0; k < 2 && dt > 0; k++) {
          const nx = p.x + (Math.random() - .5) * sp, ny = p.y + (Math.random() - .5) * sp * 1.25, nz = p.z + (Math.random() - .5) * sp;
          let ok = Math.abs(nx) < BX && Math.abs(nz) < BZ && Math.abs(ny) < BY;
          if (ok && ((p.y > BAND && ny <= BAND) || (p.y < -BAND && ny >= -BAND))) ok = Math.random() < p.perm;
          if (ok) { p.x = nx; p.y = ny; p.z = nz; }
        }
        g.eu.set(p.f + t * .7 * p.w, p.f * 2 + t * .5, p.f * .5 + t * .3 * p.w); g.qq.setFromEuler(g.eu);
        const pos = [p.x, p.y, p.z];
        g.mol.desenhar(p.ty, pos, g.qq, p.ty === 'glicose' ? .55 : .66, g.pecas[p.ty]);
        const c = cnt[p.ty] = cnt[p.ty] || [0, 0]; c[p.y > 0 ? 0 : 1]++;
        if (!first[p.ty] || (Math.abs(p.x) < Math.abs(first[p.ty][0]) && p.z > 0)) first[p.ty] = pos;
      }
      g.mol.fim();
      Object.keys(first).forEach(k => { g.anc[k] = first[k]; g.vis[k] = 1; g.raioPc[k] = 3; });
      g.anc.bic = [-BX * .7, 2.4, BZ * .9]; g.anc.fora = [-BX * .8, BY * .85, -BZ]; g.anc.dentro = [-BX * .8, -BY * .8, -BZ];
      ['bic', 'fora', 'dentro'].forEach(k => { g.vis[k] = 1; g.raioPc[k] = 8; });
      g.cnt = cnt;
    },
    camera(g, P) { return K.viva(g.q.cel ? { th: -.18, fi: .1, d: 58, al: [0, 0, 0] } : { th: -.28, fi: .14, d: 46, al: [0, 0, 0] }, P.t, .7); },
    legenda(P, g) {
      if (!g.cnt) return '';
      const ord = ['O2', 'CO2', 'H2O', 'glicose', 'Na'];
      return '<b>acima / abaixo</b> ' + ord.filter(k => g.cnt[k]).map(k => `${NOME[k]} ${g.cnt[k][0]} / ${g.cnt[k][1]}`).join(', ');
    }
  });

  // ================= DIFUSÃO FACILITADA =================
  const CA = -6.5, CB = 6.5;
  K.cena('membranas/facilitada', {
    alt: 'Modelo 3D de uma bicamada com duas proteínas: à esquerda um canal iônico, um túnel por onde os íons descem do lado mais concentrado para o menos concentrado; à direita o transportador GLUT, que prende uma glicose, muda de forma e a solta do outro lado',
    fit: 40, raio: 18, nevoa: .009,
    pecas: {
      canal: pc('Canal iônico', '#FFE1A6', 'Túnel cheio de água que deixa passar um tipo de íon. Quando aberto, passam até cerca de 100 milhões de íons por segundo, sempre a favor do gradiente.'),
      glut: pc('Transportador GLUT', '#E9C88A', 'Prende a glicose de um lado, muda de forma e a solta do outro, como uma porta giratória. Satura quando todos os transportadores estão ocupados.'),
      ion: pc('Íons', '#AB7CF2', 'Com carga elétrica, não atravessam a bicamada: só passam pelo canal.'),
      glicose: pc('Glicose', '#C8E07A', 'Grande e polar: só entra pelo transportador, do lado mais concentrado para o menos concentrado.'),
      bic: pc('Bicamada lipídica', '#F06AAE', 'Barreira para íons e moléculas polares grandes.'),
      mais: pc('Lado mais concentrado', '#9DA9C4', 'Aqui há mais íons e mais glicose: o fluxo vai daqui para o outro lado, sem gasto de ATP.'),
      menos: pc('Lado menos concentrado', '#9DA9C4', 'Para onde vão as moléculas que atravessam.')
    },
    rotulos: [{ pc: 'canal', t: 'Canal iônico', pr: 1 }, { pc: 'glut', t: 'Transportador (GLUT)', pr: 1 }, { pc: 'ion', t: 'Íon', pr: 2 }, { pc: 'glicose', t: 'Glicose', pr: 2 }, { pc: 'bic', t: 'Bicamada', pr: 3 }, { pc: 'mais', t: 'Mais concentrado', pr: 4 }, { pc: 'menos', t: 'Menos concentrado', pr: 4 }],
    montar(g) {
      const T = g.T, q = g.q;
      g.B = K.bicamada(g, { faixa: [16, 7.5], peca: g.pecas.bic, buracos: [[CA, 0, 2.7], [CB, 0, 3.4]] });
      const mC = K.fis(g, '#FFD995', { p: { roughness: .5, clearcoat: .35, sheen: .6, sheenColor: new T.Color('#FFF0C8') }, rim: '#FFE6B0', rimK: .3 });
      const mG = K.fis(g, '#E3B877', { p: { roughness: .5, clearcoat: .35, sheen: .6, sheenColor: new T.Color('#FFE3B8') }, rim: '#FFD8A0', rimK: .3 });
      g.canal = new T.Group(); g.canal.position.set(CA, 0, 0); g.raiz.add(g.canal);
      for (let i = 0; i < 5; i++) {
        const a = i / 5 * TAU, m = new T.Mesh(K.lumpy(g, 'sub' + i, 31 + i, q.det, 14, .22, .35, .6), mC);
        m.position.set(Math.cos(a) * 1.75, 0, Math.sin(a) * 1.75); m.scale.set(1.05, 4.5, 1.05); m.rotation.set(0, -a, .08); m.userData.peca = g.pecas.canal; g.canal.add(m); g.pick.push(m);
      }
      g.gl = []; for (let i = 0; i < 2; i++) {
        const m = new T.Mesh(K.lumpy(g, 'glut' + i, 51 + i, q.det, 18, .2, .3, .55), mG); m.scale.set(1.5, 4.7, 2.0); m.userData.peca = g.pecas.glut;
        const piv = new T.Group(); piv.position.set(CB + (i ? 1.35 : -1.35), 0, 0); piv.add(m); g.raiz.add(piv); g.gl.push(piv); g.pick.push(m);
      }
      g.mol = K.moleculas(g, 80);
      g.mT = K.inst(g, K.esfera(g, q.seg), K.emis(g, '#C9A4FF', 1.6), 12, null, g.pecas.ion);
      g.pick.push(g.mol.b.m, g.mT.m, g.B.H.m);
      const R = rng(5); g.ions = []; g.gls = [];
      for (let i = 0; i < 30; i++) { const cima = i < 24; g.ions.push([(R() * 2 - 1) * 15, cima ? 4 + R() * 7 : -4 - R() * 6, (R() * 2 - 1) * 7, R() * TAU]); }
      for (let i = 0; i < 16; i++) { const cima = i < 13; g.gls.push([(R() * 2 - 1) * 15, cima ? 4.5 + R() * 6.5 : -4.5 - R() * 6, (R() * 2 - 1) * 7, R() * TAU]); }
      g.qq = new T.Quaternion(); g.eu = new T.Euler();
    },
    animar(g, P) {
      const t = P.t, red = RED();
      g.B.atualizar({ t, agita: .45, difunde: .1 });
      g.ions.forEach(([x, y, z, f]) => { if (Math.abs(x - CA) < 3.5 || Math.abs(x - CB) < 4) return; g.mol.desenhar('Na', [x + Math.sin(t * .7 + f) * .5, y + Math.sin(t + f) * .4, z + Math.cos(t * .6 + f) * .5], g.qI, .7, g.pecas.ion); });
      g.gls.forEach(([x, y, z, f]) => { if (Math.abs(x - CB) < 4) return; g.eu.set(f + t * .4, f, t * .3); g.qq.setFromEuler(g.eu); g.mol.desenhar('glicose', [x + Math.sin(t * .5 + f) * .5, y + Math.cos(t * .8 + f) * .4, z], g.qq, .5, g.pecas.glicose); });
      // íons descendo pelo canal (os que estão no túnel brilham: são a carga em trânsito)
      for (let i = 0; i < 6; i++) {
        const f = red ? (i + .5) / 6 : (t * .32 + i / 6) % 1, R = rng(17 + i * 13 + Math.floor(t * .32 + i / 6) * 7);
        const ini = [CA + (R() - .5) * 9, 9, (R() - .5) * 6], fim = [CA + (R() - .5) * 9, -9, (R() - .5) * 6];
        let p; if (f < .4) p = lerp3(ini, [CA, 4.2, 0], mv(f / .4)); else if (f < .6) p = [CA, mix(4.2, -4.2, (f - .4) / .2), 0]; else p = lerp3([CA, -4.2, 0], fim, out((f - .6) / .4));
        if (f >= .36 && f <= .64) K.put(g, g.mT, p, null, .7, .7, .7, '#ffffff', 1, g.pecas.ion); else g.mol.desenhar('Na', p, g.qI, .7, g.pecas.ion);
        if (i === 0) g.anc.ion = p;
      }
      // GLUT: aberto para fora (o = -1) e aberto para dentro (o = 1), com a glicose passando
      const ph = red ? .62 : (t * .2) % 1, o = ph < .25 ? -1 : ph < .5 ? mix(-1, 1, sst(.25, .5, ph)) : ph < .75 ? 1 : mix(1, -1, sst(.75, 1, ph)), th = .2;
      g.gl[0].rotation.z = -th * o; g.gl[1].rotation.z = th * o;
      let gy = null; if (ph < .2) gy = mix(9, 1.6, out(ph / .2)); else if (ph < .5) gy = mix(1.6, 0, (ph - .2) / .3); else if (ph < .6) gy = mix(0, -1.6, (ph - .5) / .1); else if (ph < .78) gy = mix(-1.6, -9, out((ph - .6) / .18));
      if (gy != null) { g.eu.set(t * .6, t * .3, 0); g.qq.setFromEuler(g.eu); g.mol.desenhar('glicose', [CB, gy, 0], g.qq, .55, g.pecas.glicose); g.anc.glicose = [CB + .8, gy + .6, 0]; } else g.anc.glicose = [CB + 5, 7, 2];
      g.mol.fim(); K.fim(g.mT);
      g.B.atualizar({ t, agita: .45, difunde: .1 });
      g.anc.canal = [CA - 1.4, 5, 1.2]; g.anc.glut = [CB + 1.8, 4.8, 1.4]; g.anc.bic = [-13, 2.3, 6]; g.anc.mais = [-12, 9.5, -6]; g.anc.menos = [-12, -7.2, -6];
      ['canal', 'glut', 'ion', 'glicose', 'bic', 'mais', 'menos'].forEach(k => { g.vis[k] = 1; g.raioPc[k] = 5; });
      g.ph = ph;
    },
    camera(g, P) { return K.viva(g.q.cel ? { th: -.12, fi: .14, d: 54, al: [0, 0, 0] } : { th: -.22, fi: .18, d: 42, al: [0, 0, 0] }, P.t, .6); },
    legenda(P, g) { const ph = g.ph || 0, s = ph < .25 ? 'GLUT aberto para fora: a glicose se encaixa' : ph < .5 ? 'GLUT muda de forma' : ph < .75 ? 'GLUT aberto para dentro: a glicose é solta' : 'GLUT volta à forma inicial'; return `a favor do gradiente, sem gasto de ATP<small>${s}</small>`; }
  });

  // ================= BOMBA DE SÓDIO E POTÁSSIO =================
  const PASSOS_B = ['3 Na⁺ do citoplasma se ligam à bomba', 'o ATP vira ADP: o fosfato se liga à proteína', 'a bomba muda de forma e libera 3 Na⁺ fora', '2 K⁺ de fora se ligam', 'o fosfato sai e a bomba volta à forma inicial', '2 K⁺ são liberados dentro da célula'];
  K.cena('membranas/bomba', {
    ctl: { l: 'passo', min: 0, max: 5, step: 1, v: 0, f: v => `${v + 1} de 6`, auto: 3.4 },
    tip: 'Os passos do ciclo passam sozinhos até você mexer no controle.',
    alt: 'Modelo 3D da bomba de sódio e potássio na bicamada: ela prende 3 Na⁺ do citoplasma, recebe o fosfato de um ATP, muda de forma e solta os Na⁺ fora; depois prende 2 K⁺ de fora, perde o fosfato e solta os K⁺ dentro',
    fit: 36, raio: 16, nevoa: .01,
    pecas: {
      bomba: pc('Na⁺/K⁺-ATPase', '#F2CF8C', 'Proteína de transporte ativo: a cada ATP gasto, leva 3 Na⁺ para fora e 2 K⁺ para dentro, contra os gradientes.'),
      na: pc('Na⁺', '#AB7CF2', 'Sódio: cerca de 12 vezes mais concentrado fora da célula do que dentro.'),
      k: pc('K⁺', '#7FDA9C', 'Potássio: cerca de 35 vezes mais concentrado dentro da célula do que fora.'),
      atp: pc('ATP', '#FF9A3C', 'Ao perder um fosfato, vira ADP. O fosfato fica preso à bomba e muda a forma dela.'),
      fosf: pc('Fosfato', '#FFE066', 'Preso à bomba, muda a forma da proteína: ela passa a abrir para fora. Quando sai, a bomba volta a abrir para dentro.'),
      fora: pc('Meio extracelular', '#9DA9C4', 'Muito Na⁺, pouco K⁺.'),
      dentro: pc('Citoplasma', '#9DA9C4', 'Muito K⁺, pouco Na⁺.')
    },
    rotulos: [{ pc: 'bomba', t: 'Na⁺/K⁺-ATPase', pr: 1 }, { pc: 'na', t: 'Na⁺', pr: 1 }, { pc: 'k', t: 'K⁺', pr: 1 }, { pc: 'atp', t: 'ATP', pr: 2 }, { pc: 'fosf', t: 'Fosfato', pr: 2 }, { pc: 'fora', t: 'Meio extracelular', pr: 4 }, { pc: 'dentro', t: 'Citoplasma', pr: 4 }],
    montar(g) {
      const T = g.T, q = g.q;
      g.B = K.bicamada(g, { faixa: [15, 7], peca: g.pecas.bomba && null, buracos: [[0, 0, 3.9], [0, 4.2, 3.6], [0, 6.4, 3.2]] });
      const mP = K.fis(g, '#F2CF8C', { p: { roughness: .5, clearcoat: .35, sheen: .6, sheenColor: new T.Color('#FFF0C8') }, rim: '#FFE6B0', rimK: .3 });
      const mBeta = K.fis(g, '#D9B3E6', { p: { roughness: .55, sheen: .7, sheenColor: new T.Color('#F3E0FF') }, rim: '#E8D0FF', rimK: .25 });
      g.meias = []; for (let i = 0; i < 2; i++) {
        const m = new T.Mesh(K.lumpy(g, 'nak' + i, 71 + i, q.det, 22, .2, .3, .55), mP); m.scale.set(1.8, 4.9, 2.4); m.userData.peca = g.pecas.bomba;
        const piv = new T.Group(); piv.position.set(i ? 1.55 : -1.55, 0, 0); piv.add(m); g.raiz.add(piv); g.meias.push(piv); g.pick.push(m);
      }
      const be = new T.Mesh(K.lumpy(g, 'beta', 91, q.det, 12, .2, .35, .6), mBeta); be.position.set(.4, 5.4, -1.3); be.scale.set(1.6, 1.1, 1.4); be.userData.peca = g.pecas.bomba; g.raiz.add(be); g.pick.push(be);
      g.mol = K.moleculas(g, 70);
      g.mNa = K.inst(g, K.esfera(g, q.seg), K.emis(g, '#B48CFF', 1.15), 3, null, g.pecas.na); g.mK = K.inst(g, K.esfera(g, q.seg), K.emis(g, '#8CF0AE', 1.15), 2, null, g.pecas.k);
      g.mA = K.inst(g, K.esfera(g, q.seg), K.emis(g, '#FF9A3C', 1.4), 4, null, g.pecas.atp); g.mF = K.inst(g, K.esfera(g, q.seg), K.emis(g, '#FFE066', 2.6), 1, null, g.pecas.fosf);
      g.pick.push(g.mol.b.m, g.mNa.m, g.mK.m, g.mA.m, g.mF.m);
      const R = rng(21); g.bg = [];
      const pon = (n, cima, ty) => { for (let i = 0; i < n; i++) { let x; do { x = (R() * 2 - 1) * 14; } while (Math.abs(x) < 5); g.bg.push([ty, x, cima ? 5 + R() * 6 : -5 - R() * 6, (R() * 2 - 1) * 5.5 - 2.5, R() * TAU]); } };
      pon(16, 1, 'Na'); pon(3, 0, 'Na'); pon(3, 1, 'K'); pon(14, 0, 'K');
    },
    animar(g, P) {
      const t = P.t, st = P.passo, tp = P.tp, red = RED(), D = 2.4, q = red ? 1 : cl(tp / D, 0, 1), e = out(q), em = mv(q);
      g.B.atualizar({ t, agita: .45, difunde: .1 });
      g.bg.forEach(([ty, x, y, z, f]) => g.mol.desenhar(ty, [x + Math.sin(t * .6 + f) * .4, y + Math.sin(t * .9 + f) * .35, z], g.qI, .62, ty === 'Na' ? g.pecas.na : g.pecas.k));
      // forma: 1 = aberta para dentro (embaixo afastada), -1 = aberta para fora
      const o = st < 2 ? 1 : st === 2 ? mix(1, -1, em) : st === 3 ? -1 : st === 4 ? mix(-1, 1, em) : 1, th = .2;
      g.meias[0].rotation.z = th * o; g.meias[1].rotation.z = -th * o;
      const site = i => [(i - 1) * .95, -.4 + (i % 2) * .7, 2.1], inP = i => [-4.5 + i * 4.5, -9, 1.5], outP = i => [-4.5 + i * 4.5, 9.5, 1.5];
      const sk = i => [(i - .5) * 1.3, .5, 2.1], kin = i => [-3 + i * 6, -9, 1.5], kout = i => [-3 + i * 6, 9.5, 1.5];
      for (let i = 0; i < 3; i++) { let p = null; if (st === 0) p = lerp3(inP(i), site(i), e); else if (st === 1) p = site(i); else if (st === 2) p = q < .4 ? site(i) : lerp3(site(i), outP(i), out((q - .4) / .6)); if (p) { K.put(g, g.mNa, p, null, .82, .82, .82, '#ffffff', 1, g.pecas.na); if (i === 1) g.anc.na = p; } else if (i === 1) g.anc.na = outP(1); }
      for (let i = 0; i < 2; i++) { let p = null; if (st === 3) p = lerp3(kout(i), sk(i), e); else if (st === 4) p = sk(i); else if (st === 5) p = lerp3(sk(i), kin(i), e); if (p) { K.put(g, g.mK, p, null, .95, .95, .95, '#ffffff', 1, g.pecas.k); if (i === 0) g.anc.k = p; } else if (i === 0) g.anc.k = kin(0); }
      // ATP chega por baixo, perde o fosfato (que fica preso e brilha) e sai como ADP
      const pp = [2.1, -3.1, 2.4], atpIn = [8, -6, 4];
      let atp = null, nF = 3, fos = null;
      if (st === 1) { if (q < .5) atp = lerp3(atpIn, add(pp, [1.6, -1, 0]), out(q / .5)); else { atp = lerp3(add(pp, [1.6, -1, 0]), atpIn, out((q - .5) / .5)); nF = 2; fos = pp; } }
      else if (st >= 2 && st <= 3) fos = pp; else if (st === 4) fos = lerp3(pp, [5, -7, 2], e);
      if (atp) { for (let k = 0; k < nF; k++) K.put(g, g.mA, add(atp, [k * .75, -k * .2, 0]), null, k ? .42 : .6, null, null, k ? '#FFC07A' : '#ffffff', 1, g.pecas.atp); g.anc.atp = atp; g.vis.atp = 1; } else g.vis.atp = 0;
      if (fos) { K.put(g, g.mF, fos, null, st === 4 ? mix(.5, .2, e) : .5, null, null, '#ffffff', 1, g.pecas.fosf); g.anc.fosf = fos; g.vis.fosf = 1; } else g.vis.fosf = 0;
      g.mol.fim(); K.fim(g.mNa); K.fim(g.mK); K.fim(g.mA); K.fim(g.mF);
      g.anc.bomba = [-2.2, 5, 1.6]; g.anc.fora = [11, 10, -5]; g.anc.dentro = [11, -10, -5];
      ['bomba', 'na', 'k', 'fora', 'dentro'].forEach(k => { g.vis[k] = 1; g.raioPc[k] = 5; });
    },
    camera(g, P) { const st = P.passo, al = st < 2 || st === 5 ? [0, -1.2, 0] : [0, 1.2, 0]; return K.viva(g.q.cel ? { th: -.15, fi: .12, d: 46, al } : { th: -.3, fi: .14, d: 34, al }, P.t, .5); },
    legenda(P) { return `<b>${P.passo + 1}.</b> ${PASSOS_B[P.passo] || ''}`; }
  });

  // ================= ENDOCITOSE E EXOCITOSE =================
  const TIPOS_E = ['Fagocitose', 'Pinocitose', 'Endocitose mediada por receptor', 'Exocitose'];
  const COR_E = ['#2FCFBF', '#2A9FC9', '#FFE1A6', '#F7C13B'];
  K.cena('membranas/endo', {
    ctl: { l: 'tipo', min: 0, max: 3, step: 1, v: 0, f: v => ['fagocitose', 'pinocitose', 'receptor', 'exocitose'][v], auto: 8 },
    tip: 'Os quatro tipos passam sozinhos até você mexer no controle.',
    alt: 'Modelo 3D em corte de um pedaço de membrana: ela se dobra para dentro, envolve a carga e fecha uma vesícula (fagocitose de uma bactéria, pinocitose de gotas de líquido e endocitose mediada por receptor, com a capa de clatrina); na exocitose, uma vesícula se funde à membrana e solta o conteúdo fora',
    fit: 40, raio: 18, nevoa: .008,
    pecas: {
      mem: pc('Membrana plasmática', '#F06AAE', 'Bicamada que se dobra e se fecha em vesículas. O que entra por endocitose volta por exocitose, e a área da membrana se mantém.'),
      bac: pc('Bactéria', '#A9C54A', 'Partícula grande: entra por fagocitose, como fazem os macrófagos e os neutrófilos.'),
      ves: pc('Vesícula', '#F06AAE', 'Bolsa de membrana. O lado de dentro dela equivale ao lado de fora da célula.'),
      lis: pc('Lisossomo', '#2FCFBF', 'Vesícula cheia de enzimas digestivas. Ao se fundir ao fagossomo, forma o fagolisossomo e digere a bactéria.'),
      gota: pc('Gotas de líquido', '#7FD1FF', 'Na pinocitose, a célula "bebe" um pouco do líquido de fora, com o que estiver dissolvido nele.'),
      rec: pc('Receptores', '#FFE1A6', 'Proteínas que reconhecem um ligante específico, como o LDL, que leva colesterol.'),
      ldl: pc('LDL', '#FF922B', 'Partícula que transporta colesterol no sangue. Entra na célula presa ao receptor.'),
      cla: pc('Capa de clatrina', '#CFE0FF', 'Rede de proteínas em forma de cesto que curva a membrana e ajuda a fechar a vesícula.'),
      sec: pc('Conteúdo secretado', '#C8E07A', 'Hormônios, enzimas ou neurotransmissores que a vesícula leva para fora.'),
      fora: pc('Meio extracelular', '#9DA9C4', 'Lado de fora da célula.'),
      dentro: pc('Citoplasma', '#9DA9C4', 'Lado de dentro da célula.')
    },
    rotulos: [{ pc: 'mem', t: 'Membrana plasmática', pr: 2 }, { pc: 'bac', t: 'Bactéria', pr: 1 }, { pc: 'ves', t: 'Vesícula', pr: 1 }, { pc: 'lis', t: 'Lisossomo', pr: 1 }, { pc: 'gota', t: 'Gotas de líquido', pr: 1 }, { pc: 'rec', t: 'Receptores', pr: 1 }, { pc: 'ldl', t: 'LDL', pr: 2 }, { pc: 'cla', t: 'Capa de clatrina', pr: 2 }, { pc: 'sec', t: 'Conteúdo secretado', pr: 1 }, { pc: 'fora', t: 'Meio extracelular', pr: 4 }, { pc: 'dentro', t: 'Citoplasma', pr: 4 }],
    montar(g) {
      const T = g.T, q = g.q, R = q.cel ? 19 : 27;
      g.Rm = R;
      g.M = K.bicamada(g, { R, peca: g.pecas.mem });
      g.V = K.bicamada(g, { R: Math.PI * 6.2, peca: g.pecas.ves });
      const mB = K.fis(g, '#7FA83A', { p: { roughness: .45, clearcoat: .6, sheen: .5, sheenColor: new T.Color('#D8F0A0') }, rim: '#D8FFA0', rimK: .3 });
      g.bac = new T.Mesh(K.capsula(g, 1.9, 1.7, 28), mB); g.bac.rotation.z = Math.PI / 2 + .3; g.bac.userData.peca = g.pecas.bac; g.raiz.add(g.bac); g.pick.push(g.bac);
      g.lis = new T.Mesh(K.esfera(g, 32), K.pelicula(g, '#2FCFBF', { base: .16, fr: .7, cor2: '#B8FFF4' })); g.lis.userData.peca = g.pecas.lis; g.raiz.add(g.lis); g.pick.push(g.lis);
      g.lisI = new T.Mesh(K.esfera(g, 20), K.emis(g, '#2FCFBF', .35, { transparent: true, opacity: .5 })); g.lis.add(g.lisI); g.lisI.scale.setScalar(.7);
      g.got = K.inst(g, K.esfera(g, q.seg), K.fis(g, '#7FD1FF', { p: { roughness: .1, clearcoat: 1, transmission: 0, sheen: 0 }, rim: '#E0F6FF', rimK: .5 }), 40, null, g.pecas.gota);
      g.sec = K.inst(g, K.esfera(g, q.seg), K.emis(g, '#C8E07A', 1.1), 30, null, g.pecas.sec);
      g.ldl = K.inst(g, K.esfera(g, q.seg), K.fis(g, '#FF922B', { p: { roughness: .35, clearcoat: .7, sheen: .3 }, rim: '#FFD0A0', rimK: .3 }), 8, null, g.pecas.ldl);
      g.rec = K.inst(g, K.capsula(g, .3, .9, 8), K.fis(g, '#FFE1A6', { rim: '#FFF0C8', rimK: .3 }), 8 * 3, null, g.pecas.rec);
      g.cla = K.inst(g, K.capsula(g, .22, .5, 6), K.fis(g, '#B9CBEF', { p: { roughness: .5, sheen: .4 }, rimK: .25 }), 260, null, g.pecas.cla);
      // rede de clatrina: arestas de uma icosfera, usadas só na metade de baixo
      const ico = new T.IcosahedronGeometry(1, 2), pa = ico.attributes.position, ar = new Set(), vs = [];
      for (let i = 0; i < pa.count; i++) vs.push([pa.getX(i), pa.getY(i), pa.getZ(i)]);
      for (let i = 0; i < pa.count; i += 3) for (let k = 0; k < 3; k++) { const a = vs[i + k], b = vs[i + (k + 1) % 3], ka = a.map(x => x.toFixed(3)).join(), kb = b.map(x => x.toFixed(3)).join(); const key = ka < kb ? ka + '|' + kb : kb + '|' + ka; if (!ar.has(key)) { ar.add(key); } }
      g.arestas = [...ar].map(s => s.split('|').map(p => p.split(',').map(Number))); ico.dispose();
      g.pick.push(g.M.H.m, g.V.H.m, g.got.m, g.sec.m, g.ldl.m, g.rec.m, g.cla.m);
      g.qq = new T.Quaternion();
      // Golgi ao fundo (na exocitose)
      g.golgi = new T.Group(); const mGo = K.fis(g, '#F7C13B', { p: { roughness: .5, sheen: .4 }, rim: '#FFE0A0', rimK: .25 });
      for (let i = 0; i < 4; i++) { const c = new T.Mesh(new T.TorusGeometry(5 + i * .9, .45, 10, 40, 1.6), mGo); c.rotation.set(Math.PI / 2, 0, Math.PI * 1.25); c.position.y = i * 1.1; g.golgi.add(c); g.geos.push(c.geometry); }
      g.golgi.position.set(-15, -14, -9); g.raiz.add(g.golgi);
    },
    animar(g, P) {
      const t = P.t, k = P.passo, red = RED(), p = red ? 1 : cl(P.tp / 7, 0, 1), a = k === 0 ? 6.2 : k === 1 ? 4.2 : k === 2 ? 4.8 : 4.8, b = 1.7;
      const corte = (x, z) => z > .4;   // corte: a metade da frente some, para ver o interior
      ['bac', 'ves', 'lis', 'gota', 'rec', 'ldl', 'cla', 'sec'].forEach(id => { g.vis[id] = 0; });
      g.bac.visible = k === 0; g.lis.visible = false; g.golgi.visible = k === 3;
      let phi = 0, vy = null, vesOn = false;
      const PHIMAX = Math.PI * .86, ycDe = ph => a * Math.cos(ph) + b * (Math.cos(ph) - 1);
      if (k < 3) {
        const sink = sst(.1, .55, p);
        if (p < .58) phi = sink * PHIMAX; else { phi = PHIMAX * (1 - sst(.58, .66, p)); vesOn = true; vy = ycDe(PHIMAX) - 3.5 * out(seg(p, .6, 1)); }
      } else {
        // exocitose: a vesícula sobe, encosta, funde e se abre
        if (p < .4) { vesOn = true; vy = mix(-16, ycDe(PHIMAX), mv(p / .4)); phi = 0; }
        else phi = PHIMAX * (1 - out(seg(p, .4, .85)));
      }
      const per = K.perfil(a, b, Math.max(0, phi), -1);
      g.M.atualizar({ t, agita: .45, difunde: .08, perfil: per, esconde: corte });
      const ycNow = ycDe(Math.max(1e-3, phi));
      if (vesOn) { g.V.atualizar({ t, agita: .4, perfil: K.perfilEsfera(a), centro: [0, vy, 0], esconde: corte, corH: k === 0 && p > .86 ? '#2FCFBF' : '#F06AAE' }); g.vis.ves = 1; g.anc.ves = [a * .8, vy - a * .6, -1]; }
      else { K.fim(g.V.H); K.fim(g.V.Tl); }
      // centro da carga: no fundo da dobra, ou dentro da vesícula
      const cc = vesOn ? [0, vy, 0] : [0, phi > .05 ? ycNow : 4, 0];
      if (k === 0) {
        const desce = p < .1 ? mix(12, 4, out(p / .1)) : null;
        const c = desce != null ? [0, desce, 0] : (p < .58 ? [0, Math.max(ycNow, mix(4, ycNow, sst(.1, .55, p)) ), 0] : cc);
        const dig = sst(.88, 1, p); g.bac.position.set(c[0], c[1], c[2] - .2); g.bac.scale.setScalar(mix(1, .55, dig)); g.bac.material.opacity = 1;
        g.vis.bac = 1; g.anc.bac = add(c, [1.5, 1.6, 1]);
        if (p > .62) { const la = out(seg(p, .64, .86)); g.lis.visible = la < 1; g.lis.position.set(mix(10, 0, la), mix(vy - 6, vy, la), 0); g.lis.scale.setScalar(2.2); if (la < 1) { g.vis.lis = 1; g.anc.lis = [g.lis.position.x + 1.5, g.lis.position.y + 1.5, 0]; } }
      }
      if (k === 1) {
        const R = rng(4);
        for (let i = 0; i < 26; i++) { const x = (R() * 2 - 1) * 12, y = 3.5 + R() * 9, z = (R() * 2 - 1) * 10; if (z > .4 && Math.hypot(x, z) < 12) continue; K.put(g, g.got, [x + Math.sin(t + i) * .3, y + Math.sin(t * 1.3 + i) * .3, z], null, .45, null, null, '#ffffff', 1, g.pecas.gota); }
        const R2 = rng(8); for (let i = 0; i < 7; i++) { const d = [(R2() - .5) * 2, (R2() - .5) * 2, -R2()], c = phi > .4 || vesOn ? add(cc, mul(nrm(d), a * .55 * R2())) : [d[0] * 2, 4.5 + d[1], d[2] * 2]; K.put(g, g.got, c, null, .45, null, null, '#ffffff', 1, g.pecas.gota); if (!i) { g.anc.gota = c; g.vis.gota = 1; } }
      }
      if (k === 2) {
        // receptores na face de fora da dobra (ou dentro da vesícula), com LDL presos
        const lig = out(seg(p, 0, .15)), pv = vesOn ? K.perfilEsfera(a) : per, ce = vesOn ? [0, vy, 0] : [0, 0, 0];
        for (let i = 0; i < 7; i++) {
          const th = Math.PI * (.95 + i * .18), u = (vesOn ? 2.2 : 1.6) + (i % 3) * 1.3, pr = pv.em(u), base = add(ce, [Math.cos(th) * pr[0], pr[1], Math.sin(th) * pr[0]]), nn = [Math.cos(th) * pr[2], pr[3], Math.sin(th) * pr[2]];
          const ponta = add(base, mul(nn, 3.4)); K.put(g, g.rec, add(base, mul(nn, 2.6)), K.qy(g, nn), 1, null, null, '#ffffff', 1, g.pecas.rec);
          const L = add(ponta, mul(nn, .4 + (1 - lig) * 9)); K.put(g, g.ldl, L, null, .75, null, null, '#ffffff', 1, g.pecas.ldl);
          if (i === 3) { g.anc.rec = add(base, mul(nn, 2.8)); g.anc.ldl = L; }
        }
        g.vis.rec = g.vis.ldl = 1;
        // clatrina na face do citoplasma da parte curva (some depois que a vesícula se solta)
        const cla = vesOn ? 1 - sst(.75, .95, p) : sst(.15, .45, p);
        if (cla > .02) {
          const rr = a + 2.15 + 1.1, cy = vesOn ? vy : ycNow, lim = vesOn ? Math.PI : Math.max(0, phi - .15);
          for (const [A, B] of g.arestas) {
            const ang = v => Math.acos(cl(-v[1], -1, 1)); if (ang(A) > lim || ang(B) > lim || A[2] > .1 && B[2] > .1) continue;
            const pa = [A[0] * rr, cy + A[1] * rr, A[2] * rr], pb = [B[0] * rr, cy + B[1] * rr, B[2] * rr], d = sub(pb, pa);
            K.put(g, g.cla, lerp3(pa, pb, .5), K.qy(g, d), cla, len(d) / 1.44, cla, '#ffffff', 1, g.pecas.cla);
          }
          g.vis.cla = 1; g.anc.cla = [-rr * .7, cy - rr * .6, -1];
        }
      }
      if (k === 3) {
        const sai = out(seg(p, .45, 1)), R = rng(6);
        for (let i = 0; i < 18; i++) { const d = nrm([R() - .5, R() - .5, -R() * .6]), r0 = a * .6 * R(), base = vesOn ? add([0, vy, 0], mul(d, r0)) : add([0, ycNow * (1 - sai), 0], mul(d, r0 * (1 + sai * 3))); base[1] += sai * (4 + 6 * R()); K.put(g, g.sec, base, null, .55, null, null, '#ffffff', 1, g.pecas.sec); if (!i) g.anc.sec = base; }
        g.vis.sec = 1;
      }
      K.fim(g.got); K.fim(g.sec); K.fim(g.ldl); K.fim(g.rec); K.fim(g.cla);
      g.anc.mem = [-14, 2.3, -2]; g.anc.fora = [12, 9, -6]; g.anc.dentro = [13, -9, -6];
      ['mem', 'fora', 'dentro'].forEach(id => { g.vis[id] = 1; }); Object.keys(g.pecas).forEach(id => { g.raioPc[id] = 6; });
    },
    camera(g, P) { const k = P.passo, al = k === 3 ? [0, -7, 0] : [0, -9, 0]; return K.viva(g.q.cel ? { th: .12, fi: .2, d: 72, al } : { th: .08, fi: .2, d: 56, al }, P.t, .5); },
    legenda(P) { return `<b>${TIPOS_E[P.passo]}</b>${['<small>a membrana envolve a partícula, e o fagossomo se funde a um lisossomo</small>', '<small>uma dobra pequena captura gotas do líquido de fora</small>', '<small>receptores prendem o LDL, e a capa de clatrina curva a membrana</small>', '<small>a vesícula vinda do Golgi se funde à membrana e solta o conteúdo</small>'][P.passo]}`; }
  });
})();
