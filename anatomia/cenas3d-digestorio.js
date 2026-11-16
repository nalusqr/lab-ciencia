/* LAB Anatomia e fisiologia: o tubo digestório em 3D com peristaltismo (Martin), sobre o kit do módulo Vírus (vir3d.js) e
   as peças deste módulo (anat3d-pecas.js). Esôfago, estômago em J com o fundo, duodeno em C, intestino delgado em alças e o
   grosso emoldurando, em película translúcida; fígado, vesícula biliar e pâncreas atrás. O bolo alimentar desce no mesmo
   tempo da viagem do desenho plano (boca, estômago, duodeno, delgado): um anel de músculo liso aperta logo atrás dele e
   empurra; no estômago, ondas de mistura. Dentro do bolo, amido, proteína e gordura viram cadeias de contas que se
   desmancham no trecho certo, e uma ficha mostra o pH de cada parte. O tubo de ensaio e os cartões continuam no plano. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.anCena) return;
  const { V } = V3, { cl, mix, sst, seg, add, sub, mul, nrm, cross, lerp3, fr, hash, TAU } = V;
  const RED = () => V3.REDUZ(), ach = V3.ach;
  const CARB = '#F2D04A', PROT = '#E58AB0', LIP = '#F28C3A', AM = '#FFB347', TUBO = '#E9A6A0';
  const PE = {
    esof: { nome: 'Esôfago', frase: 'Tubo que leva o alimento da faringe ao estômago só por peristaltismo: funciona até de cabeça para baixo.', cor: TUBO },
    estom: { nome: 'Estômago', frase: 'Bolsa de músculo que mistura o alimento com o suco gástrico: ácido clorídrico (pH cerca de 2) e pepsina, que começa a quebrar proteínas.', cor: TUBO },
    duod: { nome: 'Duodeno', frase: 'Começo do intestino delgado. Recebe a bile do fígado e o suco do pâncreas, com bicarbonato que leva o pH a cerca de 8.', cor: TUBO },
    delg: { nome: 'Intestino delgado', frase: 'Cerca de 6 a 7 metros. Termina a digestão e absorve quase todos os nutrientes pelas vilosidades.', cor: TUBO },
    gross: { nome: 'Intestino grosso', frase: 'Absorve água e sais e forma as fezes. Abriga bactérias que fazem vitaminas, como a K.', cor: '#C99A6A' },
    figado: { nome: 'Fígado', frase: 'Faz a bile, que não tem enzima: emulsiona a gordura em gotinhas. Também guarda glicogênio e faz ureia.', cor: '#9A4236' },
    vesic: { nome: 'Vesícula biliar', frase: 'Guarda a bile e a solta no duodeno quando chega comida gordurosa.', cor: '#6BA35A' },
    panc: { nome: 'Pâncreas', frase: 'Solta no duodeno o suco pancreático: lipase, amilase, proteases e bicarbonato.', cor: '#E3A869' },
    bolo: { nome: 'Bolo alimentar', frase: 'O alimento mastigado e misturado com saliva. No estômago vira quimo.', cor: '#D9C7A0' },
    carb: { nome: 'Amido', frase: 'A amilase salivar começa a quebrar na boca; a amilase do pâncreas continua no duodeno e as enzimas do intestino terminam. Vira glicose.', cor: CARB },
    prot: { nome: 'Proteína', frase: 'A pepsina começa no estômago, em pH ácido; as enzimas do pâncreas e do intestino terminam. Vira aminoácidos.', cor: PROT },
    lip: { nome: 'Gordura', frase: 'A bile emulsiona e a lipase do pâncreas corta, no duodeno. Vira ácidos graxos e glicerol.', cor: LIP },
    musc: { nome: 'Peristaltismo', frase: 'Anel de músculo liso que contrai logo atrás do bolo e empurra para a frente, em ondas, sem a nossa vontade.', cor: AM }
  };
  // trechos [x, y, z, raio]
  const ES = [[0, 3.35, .15, .1], [0, 2.9, 0, .1], [.02, 2.2, -.1, .1], [.06, 1.4, -.12, .1], [.15, .8, -.08, .1], [.3, .5, 0, .12]];
  const ST = [[.3, .5, 0, .14], [.55, .4, .02, .36], [.78, .1, .05, .46], [.8, -.3, .06, .44], [.55, -.62, .08, .38], [.15, -.64, .08, .28], [-.2, -.46, .06, .17], [-.38, -.36, .04, .09]];
  const DU = [[-.38, -.36, .04, .1], [-.68, -.45, .02, .12], [-.82, -.85, 0, .12], [-.62, -1.2, 0, .12], [-.15, -1.2, -.05, .115], [.3, -1.02, -.08, .11]];
  const IN = (() => { const P = [[.3, -1.02, -.08, .11], [.66, -1.3, .05, .11]]; for (let r = 0; r < 4; r++) { const y = -1.45 - r * .26, dir = r % 2 ? 1 : -1; for (let k = 0; k <= 4; k++) { const x = dir * (-.7 + k * .35); P.push([x, y - (k % 2) * .05, .12 * Math.sin(k * 1.7 + r), .105]); } } P.push([-.72, -2.42, 0, .1], [-.86, -2.48, 0, .1]); return P; })();
  const GR = [[-.86, -2.48, 0, .2], [-.98, -2.2, .02, .21], [-1.02, -1.4, .05, .21], [-.98, -.98, .1, .2], [-.6, -.84, .3, .19], [0, -.9, .36, .19], [.6, -.84, .3, .19], [1.0, -.98, .1, .19], [1.05, -1.6, .05, .18], [1.02, -2.3, .02, .18], [.7, -2.66, .05, .16], [.25, -2.62, .1, .15], [0, -2.88, 0, .14], [0, -3.18, 0, .13]];
  const TRE = [['esof', ES], ['estom', ST], ['duod', DU], ['delg', IN]];
  const PH = [7, 2, 8, 8], ENZ = ['amilase salivar', 'pepsina e HCl', 'bile e lipase', 'suco entérico'], PHC = v => v < 4 ? '#E0605C' : v < 7.5 ? '#5FB36A' : '#4F86D9';
  const CAD = [[CARB, 5, .05, 'carb'], [PROT, 4, .05, 'prot'], [LIP, 3, .068, 'lip']];

  V3.anCena('digestorio/enzimas', {
    fit: 10, raio: 5, bolas: 160, pecas: PE,
    so2D: S => S.modo !== 'viagem',
    rotulos: [{ pc: 'esof', t: 'esôfago', pr: 1 }, { pc: 'estom', t: 'estômago', pr: 1 }, { pc: 'duod', t: 'duodeno', pr: 2 }, { pc: 'delg', t: 'intestino delgado', pr: 1 }, { pc: 'gross', t: 'intestino grosso', pr: 3 },
      { pc: 'figado', t: 'fígado', pr: 2 }, { pc: 'panc', t: 'pâncreas', pr: 4 }, { pc: 'vesic', t: 'vesícula', pr: 5 }, { pc: 'musc', t: 'peristaltismo', pr: 2 }],
    montar(g) {
      const T = g.T, rad = g.q.cel ? 12 : 16, fm = (cor, d) => V3.filme(g, cor, { cor2: '#FFE6E2', dentro: d || '#6A3A3C', base: .32, fr: .62, esc: 3 });
      g.tre = TRE.map(([pc, P0], k) => {
        const P = V3.suave(P0, k === 3 ? 4 : 7), F = V3.fracoes(P); let L = 0; for (let i = 1; i < P.length; i++) L += V.len(sub(P[i], P[i - 1]));
        const tb = V3.tubo(g, P.length, rad, fm(TUBO), null, pc); tb.mesh.renderOrder = 5;
        return { pc, P, F, L, tb, xyz: P.map(p => p.slice(0, 3)) };
      });
      const gr = V3.suave(GR, 6), tg = V3.tubo(g, gr.length, rad, fm('#C99A6A', '#2E2214'), null, 'gross'); tg.set(gr.map(p => p.slice(0, 3)), i => gr[i][3] * (1 + .08 * Math.sin(i * .9))); tg.mesh.renderOrder = 4;
      // fundo do estômago
      const fu = new T.Mesh(V3.esfera(g, 28), fm(TUBO)); fu.position.set(.62, .5, -.02); fu.scale.set(.3, .26, .28); fu.renderOrder = 5; g.raiz.add(fu); fu.userData.peca = g.pecas.estom; g.pick.push(fu);
      // órgãos anexos
      const org = (c, s, cor, pc, rz) => { const m = V3.peca(g, V3.celGeo(g), V3.fis(g, cor, { p: { roughness: .55, clearcoat: .35 }, rimK: .25 }), pc); m.position.set(...c); m.scale.set(...s); m.rotation.z = rz || 0; return m; };
      org([-.6, .88, .02], [1.0, .42, .55], '#7E2F27', 'figado', -.12); org([-.42, .42, .28], [.1, .17, .1], '#6BA35A', 'vesic', .4); org([.2, -.82, -.38], [.78, .12, .15], '#E3A869', 'panc', .22);
      g.rod = V3.inst(g, V3.cilindro(g, 6), V3.fis(g, '#FFFFFF', { p: { roughness: .5 } }), 40);
    },
    animar(g, P) {
      const S = P.S, t = P.t, info = g.pecas, rv = !RED();
      const p = rv ? cl((t * .04) % 1.15, 0, 1) : .35, st = p < .2 ? 0 : p < .5 ? 1 : p < .7 ? 2 : 3;
      // onde está o bolo: trecho e fração dentro dele
      const lf = st === 0 ? sst(.04, .2, p) : st === 1 ? seg(p, .2, .5) : st === 2 ? seg(p, .5, .7) : seg(p, .7, 1);
      const fb = st === 1 ? (lf < .25 ? lf / .25 * .5 : lf < .8 ? .5 + .1 * Math.sin((lf - .25) / .55 * TAU * 1.5) : .5 + (lf - .8) / .2 * .5) : lf;
      const tr0 = g.tre[st], pb = V3.em(tr0.P, tr0.F, fb), bc = [pb[0], pb[1], pb[2]];
      g.tre.forEach((tr, k) => {
        const n = tr.P.length, aqui = k === st;
        tr.tb.set(tr.xyz, i => {
          const r0 = tr.P[i][3], f = tr.F[i]; let r = r0;
          if (aqui && p < 1) { const d = (f - fb) * tr.L; r *= 1 + .35 * Math.exp(-((d / .14) ** 2)) - .5 * Math.exp(-(((d + .28) / .09) ** 2)); }
          if (k === 1 && rv) r *= 1 - .1 * Math.max(0, Math.sin(f * TAU * 2.2 - t * 2.4)) * sst(.15, .3, f);
          if (k === 3 && rv) r *= 1 - .07 * Math.max(0, Math.sin(f * 60 - t * 3));
          return r;
        });
      });
      // anel do peristaltismo (marca) e o bolo com as três cadeias
      const tp = V3.em(tr0.P, tr0.F, Math.max(0, fb - .28 / tr0.L)); ach(g, 'musc', [tp[0], tp[1], tp[2]]);
      const pa = V3.em(tr0.P, tr0.F, Math.max(0, fb - .02)), pn = V3.em(tr0.P, tr0.F, Math.min(1, fb + .02)), dir = nrm(sub([pn[0], pn[1], pn[2]], [pa[0], pa[1], pa[2]])), e1 = V3.perp(dir), e2 = cross(dir, e1);
      const q = [seg(p, .04, .17), seg(p, .26, .44), seg(p, .58, .68)], dig = st === 3 ? seg(p, .7, .95) : 0;
      V3.bola(g, bc, .15 * (1 - .6 * dig) * (p < 1 ? 1 : 0), '#D9C7A0', .75, info.bolo);
      CAD.forEach(([cor, n, r0, pc], k) => {
        const qq = q[k], rr = k === 2 ? mix(r0, r0 * .55, seg(p, .52, .6)) : r0, pts = [];
        for (let j = 0; j < n; j++) {
          const a0 = (j - (n - 1) / 2) * rr * 2.1 * (1 - qq * .5), an = hash(j + k * 9, 2) * TAU + (rv ? t * .8 * qq : 0), dd = qq * (.08 + hash(j + k * 9, 4) * .1);
          const pt = add(add(bc, mul(e1, a0 + Math.cos(an) * dd)), add(mul(e2, (k - 1) * .075 + Math.sin(an) * dd), mul(dir, Math.sin(an * 1.3) * dd * .6)));
          pts.push(pt); V3.bola(g, pt, rr * (1 - .25 * dig), cor, 1.05, info[pc]);
        }
        if (qq < .5) for (let j = 1; j < n; j++) V3.bastao(g, g.rod, pts[j - 1], pts[j], .012, cor, .9, info[pc]);
        if (k === 0) ach(g, 'bolo', pts[0]);
      });
      V3.fim(g.rod);
      const phv = p < .2 ? 7 : p < .25 ? mix(7, 2, (p - .2) / .05) : p < .5 ? 2 : p < .55 ? mix(2, 8, (p - .5) / .05) : 8;
      V3.ficha(g, [1.75, bc[1] + .14, 0], `pH cerca de ${Math.round(phv)}`, PHC(phv), { pr: 1, dx: 1, dy: 0 });
      V3.ficha(g, [1.75, bc[1] - .16, 0], ENZ[st], [CARB, PROT, LIP, '#B8C27A'][st], { pr: 1, dx: 1, dy: 0 });
      if (p < .06) V3.ficha(g, [0, 3.35, .15], 'boca: mastigação e saliva', '#E8EDF7', { pr: 1, dy: -1 });
      ach(g, 'esof', [.03, 2.0, -.1]); ach(g, 'estom', [.82, -.2, .3]); ach(g, 'duod', [-.82, -.85, .1]); ach(g, 'delg', [.35, -1.95, .15]); ach(g, 'gross', [1.05, -1.7, .1]);
      ach(g, 'figado', [-.9, 1.0, .3]); ach(g, 'vesic', [-.42, .3, .38]); ach(g, 'panc', [.75, -.68, -.3]);
    },
    camera(g, P) {
      const d = V3.deitado(g);
      return V3.anCam(g, P, d ? 2.4 : 1.5, d ? 3.45 : 3.6, { al: [.15, .08, 0], th: .2, fi: .1 });
    }
  });
})();
