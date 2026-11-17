/* LAB Genética: cenas 3D com cromossomos (Martin). Segregação independente na meiose (dois pares de homólogos,
   alinhamento ao acaso, quatro gametas), ligação gênica com crossing-over (quatro cromátides, quiasma e gametas
   parentais e recombinantes) e herança ligada ao X (espermatozoide com X ou Y encontrando o óvulo, zigoto com XX ou XY).
   Cromátides em tubo, película de membrana e quadro em 3D vêm de gen3d-pecas.js e cenas3d-mendel.js. */
'use strict';
(function () {
  const G3 = window.GEN3D; if (!G3) return;
  const { C, COR, ease, move, up } = G3, { cl, mix, seg, add, lerp3, nrm } = C.V;

  // ================= lei2/gametas: dois pares de homólogos na meiose =================
  const PM = {
    mae: { nome: 'Cromossomo de origem materna', cor: COR.mae, frase: 'Violeta: veio da mãe. Já está duplicado, com duas cromátides-irmãs unidas pelo centrômero.' },
    pai: { nome: 'Cromossomo de origem paterna', cor: COR.pai, frase: 'Azul: veio do pai. É o homólogo do violeta: mesmo gene, alelo que pode ser diferente.' },
    cel: { nome: 'Membrana plasmática', cor: COR.mem, frase: 'Na meiose I a célula se divide em duas; na meiose II, cada uma se divide de novo.' },
    eq: { nome: 'Placa equatorial', cor: COR.amb, frase: 'Na metáfase I, os pares de homólogos se alinham aqui. O lado de cada homólogo é sorteado em cada par.' },
    R: { nome: 'Alelo R (semente lisa)', cor: COR.dom, frase: 'Dominante. Fica no par de cromossomos maior.' }, r: { nome: 'Alelo r (semente rugosa)', cor: COR.rec, frase: 'Recessivo. Fica no homólogo do R.' },
    V: { nome: 'Alelo V (semente amarela)', cor: COR.dom, frase: 'Dominante. Fica no par menor, outro cromossomo: por isso se separa do R de forma independente.' }, v: { nome: 'Alelo v (semente verde)', cor: COR.rec, frase: 'Recessivo. Fica no homólogo do V.' },
    cen: { nome: 'Centrômero', cor: '#E6EEFF', frase: 'Une as cromátides-irmãs até a anáfase II, quando elas se separam.' }
  };
  // tempos (s): metáfase I, anáfase I, telófase I, meiose II e gametas
  const TM = { ana1: [1.4, 2.8], tel1: [2.8, 3.9], gira: [4.1, 4.9], ana2: [5.0, 6.2], tel2: [6.0, 7.1] };
  G3.registrar('lei2/gametas', G3.cena({
    t: 'Segregação independente na meiose', pecas: PM, caixa: [8.4, 5.8, 1], vista: { th: -.18, fi: .24 }, alvo: () => [0, -.2, 0],
    rotulos: [{ pc: 'mae', t: 'origem materna', pr: 2 }, { pc: 'pai', t: 'origem paterna', pr: 2 }, { pc: 'eq', t: 'placa equatorial', pr: 1 }, { pc: 'cel', t: 'membrana', pr: 4 }],
    montar(g) {
      g.cr = []; for (let i = 0; i < 8; i++) g.cr.push(G3.cromossomo(g, PM.mae));
      g.cels = [0, 1, 2, 3].map(() => G3.celula(g, COR.mem, PM.cel));
      g.cn = C.inst(g, C.esfera(g, 14), C.fis(g, '#ffffff', { p: { roughness: .35, clearcoat: .7 }, rimK: .3 }), 4); g.pick.push(g.cn.m);
      g.eqp = C.inst(g, C.cilindro(g, 32), C.fis(g, COR.amb, { p: { roughness: .5, transparent: true, opacity: .16, depthWrite: false }, rimK: .1 }), 1); g.pick.push(g.eqp.m);
    },
    animar(g) {
      const A = g.A, al = g.st.al, a1 = move(...TM.ana1, A), t1 = move(...TM.tel1, A), gi = move(...TM.gira, A), a2 = move(...TM.ana2, A), t2 = move(...TM.tel2, A);
      // pares: [alelo materno, alelo paterno, comprimento, y na metáfase I]
      const PR = [['R', 'r', 4.4, 1.55], ['V', 'v', 2.7, -1.75]];
      const lados = [[0, 1], al ? [1, 0] : [0, 1]];   // quem fica à esquerda em cada par (0 = materno)
      g.gm = [[], []]; g.let = [];
      PR.forEach(([am, ap, L, y0], p) => {
        [0, 1].forEach(h => {
          const lado = lados[p][0] === h ? -1 : 1, al0 = h ? ap : am, cor = h ? COR.pai : COR.mae, pc = h ? PM.pai : PM.mae;
          const cx = lado * mix(.72, 3.7, a1), base = [cx, mix(y0, 0, gi), mix(0, p ? -.95 : .95, gi)];
          const u = nrm(lerp3([0, 1, 0], [1, 0, 0], gi)), w = nrm(lerp3([1, 0, 0], [0, 1, 0], gi));
          [0, 1].forEach(s => {
            const sg = s ? 1 : -1, off = .33 + a2 * 1.85, b = add(base, [w[0] * sg * off, w[1] * sg * off, 0]);
            g.cr[(p * 2 + h) * 2 + s].set(b, u, L, { n: 1, r: .32, cor, cen: .5, bandas: [[.78, up(al0) ? COR.dom : COR.rec, PM[al0]]], peca: pc });
            if (s === 0) g.let.push([G3.pontoFaixa(add(base, [0, 0, .5]), u, L, .78, .5), al0, 1 - a2]);
            const gi2 = (lado < 0 ? 0 : 2) + (gi > .5 ? (s ? 0 : 1) : 0); if (a2 > .6) g.gm[0][gi2] = (g.gm[0][gi2] || '') + al0;
          });
          if (a2 < .5) C.put(g, g.cn, base, null, .3, null, null, '#E6EEFF', 1, PM.cen);
        });
      });
      // membranas: 1 célula, depois 2 (telófase I) e 4 (meiose II); a película se estrangula onde as esferas se encontram
      const cs = g.cels, R0 = 5.3;
      const pos = [[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sy]) => [sx * mix(.05, 3.75, t1), sy * mix(.04, 1.95, t2), 0]);
      cs.forEach((m, i) => { m.visible = true; m.position.set(...pos[i]); m.scale.setScalar(mix(R0, mix(3.55, 2.35, t2), t1)); m.material.uniforms.uSel.value = g.sel === 'cel' ? .6 : 0; m.material.uniforms.uT.value = g.clk; });
      G3.unir(cs);
      const eq = 1 - ease(...TM.ana1, A); if (eq > .02) C.put(g, g.eqp, [0, 0, 0], C.qy(g, [1, 0, 0]), 4.2, .03, 4.2, COR.amb, eq, PM.eq);
      // gametas: o nome junta os alelos (R ou r antes de V ou v)
      g.gam = []; if (t2 > .5) [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([sx, sy]) => {
        const lado = sx; const nomes = PR.map(([am, ap], p) => { const h = lados[p][0] === 0 ? (lado < 0 ? 0 : 1) : (lado < 0 ? 1 : 0); return h ? ap : am; });
        g.gam.push([[sx * 3.75, sy * 1.95 - 2.1, 0], nomes.join('')]);
      });
      g.anc.mae = add(g.cr[0].tubs[0].t.mesh.visible ? [lados[0][0] === 0 ? -mix(.72, 3.7, a1) : mix(.72, 3.7, a1), mix(1.55, 0, gi) + 2.5, 0] : [0, 0, 0], [0, 0, 0]);
      g.anc.pai = [lados[0][0] === 1 ? -mix(.72, 3.7, a1) : mix(.72, 3.7, a1), -3.3, 0];
      g.anc.eq = [0, -4.6, 0]; g.anc.cel = [pos[3][0] + 2, pos[3][1] + 2.6, 0];
      g.vis = { mae: gi < .1, pai: gi < .1, eq: eq > .5, cel: 1 };
    },
    sobre(g, X, W, H) {
      const A = g.A, nar = W < 520;
      g.let.forEach(([p, al, a]) => { if (a > .05) G3.etiqueta(g, X, p, al, { s: nar ? 13 : 15, c: up(al) ? COR.dom : '#7FE0A2', a }); });
      g.gam.forEach(([p, nm]) => G3.etiqueta(g, X, p, nm, { s: nar ? 15 : 18, c: COR.amb, a: ease(TM.tel2[0] + .6, TM.tel2[1], A), borda: 'rgba(255,179,71,.6)' }));
      const al = g.st.al, gs = al ? 'Rv e rV' : 'RV e rv';
      const L = A < TM.ana1[0] ? 'Metáfase I: cada par de homólogos no meio da célula, com os lados sorteados'
        : A < TM.tel1[0] ? 'Anáfase I: os homólogos se separam, levando os alelos para lados opostos'
        : A < TM.ana2[0] ? 'Telófase I: duas células, cada uma com um cromossomo de cada par'
        : A < TM.tel2[1] ? 'Meiose II: as cromátides-irmãs se separam'
        : 'Este alinhamento dá gametas ' + gs + '. Com os dois alinhamentos, saem RV, Rv, rV e rv, 1/4 de cada';
      G3.legenda(X, W, H, L);
    }
  }));

  // ================= extras/ligacao: crossing-over entre genes ligados =================
  const PL = {
    pai: { nome: 'Cromátide com A e B', cor: COR.pai, frase: 'Azul: os alelos A e B vieram juntos, no mesmo cromossomo do pai.' },
    mae: { nome: 'Cromátide com a e b', cor: COR.mae, frase: 'Violeta: os alelos a e b vieram juntos, no homólogo da mãe.' },
    qui: { nome: 'Quiasma (permutação)', cor: COR.amb, frase: 'Ponto em que duas cromátides não irmãs se cruzam e trocam pedaços, na prófase I.' },
    rec: { nome: 'Cromátide recombinante', cor: COR.amb, frase: 'Saiu com uma combinação nova de alelos, Ab ou aB, por causa da permutação.' },
    A: { nome: 'Alelo A', cor: COR.dom, frase: 'Gene A, no mesmo cromossomo que o gene B.' }, a: { nome: 'Alelo a', cor: COR.rec, frase: 'Alelo recessivo do gene A.' },
    B: { nome: 'Alelo B', cor: COR.dom, frase: 'Gene B. Quanto mais longe do A, mais permutações entre os dois.' }, b: { nome: 'Alelo b', cor: COR.rec, frase: 'Alelo recessivo do gene B.' }
  };
  const TL = { junta: [0, 1], cruza: [1.2, 2.5], troca: [2.3, 2.9], solta: [3.4, 4.8] };
  G3.registrar('extras/ligacao', G3.cena({
    t: 'Ligação gênica e crossing-over', pecas: PL, caixa: [7.6, 5.4, 1], vista: { th: -.25, fi: .14 }, alvo: () => [0, .3, 0],
    rotulos: [{ pc: 'pai', t: 'do pai', pr: 3 }, { pc: 'mae', t: 'da mãe', pr: 3 }, { pc: 'qui', t: 'quiasma', pr: 1 }, { pc: 'rec', t: 'recombinante', pr: 2 }],
    camera(g, c) { if (g.v.w < 520) { c.d *= 1.1; c.al[1] -= 1.1; } },   // celular: sobe a cena para os gametas AB/ab ficarem acima da legenda
    montar(g) {
      const q = g.q; g.tr = [];
      for (let i = 0; i < 8; i++) { const m = C.fis(g, COR.mae, { p: { roughness: .46, clearcoat: .55, sheen: .55, sheenColor: new g.T.Color('#E6DCFF') }, rim: '#D2C2FF', rimK: .34 }); const t = C.tubo(g, 22, q.cel ? 10 : 14, m, g.raiz, PL.mae); g.pick.push(t.mesh); g.tr.push({ t, m }); }
      g.qx = C.inst(g, C.esfera(g, 16), C.emis(g, COR.amb, 1.4), 2); g.pick.push(g.qx.m);
      g.cn = C.inst(g, C.esfera(g, 14), C.fis(g, '#ffffff', { p: { roughness: .35, clearcoat: .7 }, rimK: .3 }), 2);
    },
    animar(g) {
      const A = g.A, r = g.st.r, L = 8.4, y0 = -3.6, fA = .2, fB = mix(.32, .9, r / 50), fx = (fA + fB) / 2, cru = r > 0;
      const ju = move(...TL.junta, A), cz = cru ? move(...TL.cruza, A) : 0, tr = cru ? ease(...TL.troca, A) : 0, so = move(...TL.solta, A);
      const X0 = [-1.08, -.36, .36, 1.08].map(x => x * mix(2.3, 1, ju)), XF = [-4.5, -1.5, 1.5, 4.5];
      const cor = [COR.pai, COR.pai, COR.mae, COR.mae], alA = ['A', 'A', 'a', 'a'], alB = ['B', 'B', 'b', 'b'];
      const dono = k => (tr > .5 && (k === 1 || k === 2) ? 3 - k : k);   // de quem é o pedaço de cima depois da troca
      const col = c => new g.T.Color(c);
      g.let = []; g.gam = [];
      for (let k = 0; k < 4; k++) {
        const xb = mix(X0[k], XF[k], so), yb = y0 - so * .4, yf = y0 + fx * L - so * .4;
        // pedaço de baixo (com o gene A): do pé ao quiasma, entortando para o lado da outra cromátide durante o cruzamento
        const inner = k === 1 || k === 2, dx = inner ? (k === 1 ? 1 : -1) * .72 * cz * (1 - so) * Math.sin(Math.PI * Math.min(1, tr * 1 + .5 * (1 - tr))) : 0;
        const ptsL = [], ptsU = [], dk = dono(k), xu = mix(X0[k], XF[k], so);
        for (let j = 0; j < 12; j++) { const f = j / 11, y = mix(yb, yf + .12, f), bend = dx * f * f; ptsL.push([xb + bend, y, 0]); }
        for (let j = 0; j < 12; j++) { const f = j / 11, y = mix(yf - .12, y0 + L - so * .4, f), bend = dx * (1 - f) * (1 - f); ptsU.push([xu + bend, y, 0]); }
        const rr = (i, n) => .34 * Math.sqrt(Math.max(.05, Math.min(1, i / 2, (n - 1 - i) / 2)));
        const lo = g.tr[k], hi = g.tr[4 + k];
        lo.t.set(ptsL, (i, n) => (i === n - 1 ? .3 : rr(i, n))); hi.t.set(ptsU, (i, n) => (i === 0 ? .3 : rr(i, n)));
        lo.m.color.copy(col(cor[k])); hi.m.color.copy(col(cor[dk]));
        lo.t.mesh.userData.peca = k < 2 ? PL.pai : PL.mae; hi.t.mesh.userData.peca = dk !== k ? PL.rec : dk < 2 ? PL.pai : PL.mae;
        const pA = [xb, yb + fA * L, 0], pB = [xu, y0 + fB * L - so * .4, 0];
        C.put(g, g.bandas, pA, null, .4, .55, .4, up(alA[k]) ? COR.dom : COR.rec, 1, PL[alA[k]]);
        C.put(g, g.bandas, pB, null, .4, .55, .4, up(alB[dk]) ? COR.dom : COR.rec, 1, PL[alB[dk]]);
        if (k === 0 || k === 3) g.let.push([add(pA, [k < 2 ? -.9 : .9, 0, .3]), alA[k], 1 - so], [add(pB, [k < 2 ? -.9 : .9, 0, .3]), alB[dk], 1 - so]);
        g.gam.push([[XF[k], y0 - 1.5, 0], alA[k] + alB[dk], dk !== k]);
      }
      if (cru && cz > .05 && so < .95) { const p = [0, y0 + fx * L, .2]; C.put(g, g.qx, p, null, .32 * cz * (1 - so) + .01, null, null, COR.amb, 1, PL.qui); g.anc.qui = add(p, [0, .2, 0]); }
      if (so < .3) [-1, 1].forEach(s => C.put(g, g.cn, [s * .72 * mix(2.3, 1, ju), y0 + .5 * L, 0], null, .001, null, null, '#fff', 1, null));
      g.anc.pai = [X0[0], y0 + L + .3, 0]; g.anc.mae = [X0[3], y0 + L + .3, 0]; g.anc.rec = [XF[1] + .2, y0 + L * .55, 0];
      g.vis = { pai: so < .2, mae: so < .2, qui: cru && cz > .5 && so < .5, rec: cru && so > .9 };
    },
    sobre(g, X, W, H) {
      const A = g.A, r = g.st.r, nar = W < 520, so = ease(...TL.solta, A);
      g.let.forEach(([p, al, a]) => { if (a > .05) G3.etiqueta(g, X, p, al, { s: nar ? 13 : 15, c: up(al) ? COR.dom : '#7FE0A2', a }); });
      const pc = v => String(v).replace('.', ',') + '%';
      if (so > .3) g.gam.forEach(([p, nm, rc]) => { const q = G3.etiqueta(g, X, p, nm, { s: nar ? 15 : 18, c: rc ? COR.amb : '#7FE6DA', a: so, borda: rc ? 'rgba(255,179,71,.6)' : 'rgba(47,207,191,.5)' }); if (q) G3.texto(X, nar ? pc(rc ? r / 2 : (100 - r) / 2) : (rc ? 'recombinante ' : 'parental ') + pc(rc ? r / 2 : (100 - r) / 2), q[0], q[1] - 24, { s: 12, c: rc ? COR.amb : '#7FE6DA', w: 600 }); });
      const L = r === 0 ? 'Ligação completa: sem permutação entre eles, só saem gametas parentais, AB e ab, 50% cada'
        : A < TL.cruza[0] ? 'Prófase I: os homólogos se pareiam, quatro cromátides lado a lado'
        : A < TL.solta[0] ? 'Crossing-over: duas cromátides não irmãs trocam pedaços entre os genes A e B'
        : `Nesta meiose, 2 das 4 cromátides são recombinantes. Com ${r}% de recombinação, cada recombinante sai em ${pc(r / 2)} dos gametas`;
      G3.legenda(X, W, H, L);
    }
  }));

  // ================= sexo/daltonismo e sexo/hemofilia: gametas com X ou Y e o zigoto =================
  const stX = g => { const m = g.endsWith('Y'), n = (g.match(/\^[a-z]/g) || []).length; return m ? (n ? 'af' : 'no') : (n === 2 ? 'af' : n === 1 ? 'pt' : 'no'); };
  const kidX = (a, b) => (a === 'Y' ? b + 'Y' : (a[2] <= b[2] ? a + b : b + a));
  function ligadoX(D, d, doenca, art) {
    const PX = {
      esp: { nome: 'Espermatozoide', cor: COR.pai, frase: 'Gameta do pai. Metade leva um X e metade leva o Y: é ele quem define o sexo do filho.' },
      ovu: { nome: 'Óvulo', cor: '#F3C9DA', frase: 'Gameta da mãe. Sempre leva um X, com um dos dois alelos dela.' },
      cX: { nome: 'Cromossomo X', cor: COR.mae, frase: `Tem o gene ligado ${art} ${doenca}. O alelo ${d} é recessivo: a mulher só é afetada com dois alelos ${d}, e o homem, com um X só, basta ter um.` },
      cY: { nome: 'Cromossomo Y', cor: COR.pai, frase: 'Menor, não tem esse gene. Por isso o homem tem só um alelo dele.' },
      zig: { nome: 'Zigoto', cor: COR.mem, frase: 'O ovo: um X da mãe e um X ou Y do pai. XX vira menina; XY, menino.' },
      casa: { nome: 'Casa do quadro', cor: '#5B6C99', frase: 'Um encontro possível de gametas, com 1/4 de chance.' }
    };
    return G3.punnett({
      t: 'Herança ligada ao X', pecas: PX,
      rotulos: [{ pc: 'esp', t: 'espermatozoide', pr: 2 }, { pc: 'ovu', t: 'óvulo', pr: 2 }, { pc: 'zig', t: 'zigoto', pr: 1 }],
      ga: st => [st.f.slice(0, 3), 'Y'], gb: st => [st.m.slice(0, 3), st.m.slice(3)], kid: kidX,
      cab: () => ['gametas do pai', 'gametas da mãe'],
      montar(g) {
        g.cau = C.inst(g, C.cilindro(g, 6), C.fis(g, COR.gelo, { p: { roughness: .4 }, rimK: .2 }), 220); g.pick.push(g.cau.m);
        g.zg = [0, 1, 2, 3].map(() => G3.celula(g, COR.mem, PX.zig, { dentro: '#3A2350' }));
        g.xc = []; for (let i = 0; i < 8; i++) g.xc.push(G3.cromossomo(g, PX.cX));
        g.usados = 0;
      },
      gameta(g, W, p, al, col, e) {
        if (e < .01) return;
        if (col) {   // espermatozoide: cabeça e cauda ondulando
          C.put(g, W, p, null, .42 * e, .52 * e, .42 * e, al === 'Y' ? '#8FD8FF' : '#B9A0FF', 1, PX.esp);
          let prev = add(p, [0, .5 * e, 0]); const red = G3.RED();
          for (let s = 1; s <= 8; s++) { const f = s / 8, pt = add(p, [Math.sin(f * 5 - (red ? 0 : g.clk * 9)) * .22 * f * e, (.5 + f * 1.9) * e, 0]); C.bastao(g, g.cau, prev, pt, .06 * e * (1 - f * .6), COR.gelo, 1, PX.esp); prev = pt; }
        } else C.put(g, W, p, null, .82 * e, null, null, '#F3C9DA', .95, PX.ovu);
      },
      filho(g, k, p, f, gen) {
        const z = g.zg[k]; z.visible = true; z.position.set(p[0], p[1], p[2]); z.scale.setScalar(1.1 * f); z.material.uniforms.uT.value = g.clk; z.material.uniforms.uSel.value = g.sel === 'zig' ? .6 : 0;
        const al = gen.match(/X\^.|Y/g);
        al.forEach((a, i) => {
          const cr = g.xc[k * 2 + i], Y = a === 'Y', L = (Y ? .72 : 1.25) * f, b = add(p, [(i ? .26 : -.26), Y ? -.2 : 0, .1]);
          cr.set(b, [0, 1, 0], L, { n: 1, r: .15 * f + .01, cor: i ? COR.pai : COR.mae, cen: Y ? .3 : .38, bandas: Y ? [] : [[.72, up(a[2]) ? COR.dom : COR.rec, PX.cX]], peca: Y ? PX.cY : PX.cX });
        });
        g.usados = Math.max(g.usados, k + 1);
      },
      animar(g) {
        // zigotos e cromossomos que ainda não nasceram ficam escondidos
        g.zg.forEach((z, k) => { if (!(g.cel[k] && g.cel[k].f > .01)) { z.visible = false; g.xc[k * 2].esconder(); g.xc[k * 2 + 1].esconder(); } });
        G3.unir([g.zg[0]]); g.anc.esp = add(g.gam[1][0], [.9, 0, 0]); g.anc.ovu = add(g.gam[2][0], [0, 1, 0]); g.anc.zig = add(g.cel[0].p, [1.5, 1.4, .4]);
        g.vis.esp = g.vis.ovu = g.vis.gameta; g.vis.zig = g.cel[0].f > .8;
      },
      etiquetaFilho: gen => { const s = stX(gen), m = gen.endsWith('Y'); return s === 'af' ? { t: m ? 'menino afetado' : 'menina afetada', c: '#FF9FAE' } : s === 'pt' ? { t: 'menina portadora', c: COR.amb } : { t: m ? 'menino normal' : 'menina normal', c: '#7FE6DA' }; },
      resumo(st, gens) {
        const f = gens.filter(x => !x.endsWith('Y')), h = gens.filter(x => x.endsWith('Y')), af = gens.filter(x => stX(x) === 'af').length;
        const cnt = (a, t) => a.filter(x => stX(x) === t).length;
        return `Filhas: ${cnt(f, 'af')} de 2 afetadas, ${cnt(f, 'pt')} de 2 portadoras. Filhos: ${cnt(h, 'af')} de 2 afetados. Chance de uma criança qualquer ser afetada: ${af}/4`.replace(' 0/4', ' 0').replace(' 2/4', ' 1/2').replace(' 4/4', ' 1');
      }
    });
  }
  G3.registrar('sexo/daltonismo', ligadoX('D', 'd', 'daltonismo', 'ao'));
  G3.registrar('sexo/hemofilia', ligadoX('H', 'h', 'hemofilia', 'à'));
})();
