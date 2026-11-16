/* LAB Vírus: cena 3D da Prevenção (Martin), sobre o kit vir3d.js e as peças de vir3d-pecas.js.
   Vacina, soro e antivirais ganha o modo "Anticorpos em 3D": anticorpos em Y chegam ao vírus, prendem as pontas dos braços
   nas espículas e o vírus coberto não consegue se encaixar nos receptores da célula (neutralização). Os gráficos, os cartões
   e a imunidade coletiva continuam no desenho plano. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.kitV || !V3.modo3D) return;
  const { V, K } = V3, { cl, mix, sst, add, sub, mul, nrm, dot, hash, lerp3, TAU } = V;
  const RED = () => V3.REDUZ();
  const sg = (a, b, x) => cl((x - a) / (b - a), 0, 1);
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  if (!V3.modo3D('prevencao/vacinas', 'ac3d', 'Anticorpos em 3D', 'graf', 'Anticorpos e vírus', 1)) return;
  const PA = {
    ac: { nome: 'Anticorpo', frase: 'Proteína em Y feita pelos linfócitos B (plasmócitos). A ponta de cada braço se encaixa numa parte do vírus, o antígeno.', cor: C.anticorpo },
    esp: { nome: 'Espícula (antígeno)', frase: 'A parte do vírus que muitas vacinas ensinam o corpo a reconhecer.', cor: C.espicula },
    virus: { nome: 'Vírus', frase: 'Coberto de anticorpos, fica neutralizado: não se encaixa no receptor e é removido por células de defesa.', cor: C.envelope },
    rec: { nome: 'Receptor da célula', frase: 'A fechadura que a espícula precisaria encontrar para o vírus entrar.', cor: C.receptor },
    mem: { nome: 'Membrana da célula', frase: 'Sem encaixe no receptor, o vírus não entra.', cor: C.membrana }
  };
  const NA = 10, DE = V3.fibo(18, .2);
  // espículas que recebem anticorpo: as mais de cima e dos lados (as de baixo ficam viradas para a célula)
  const ALVO = DE.map((d, i) => [d[1], i]).sort((a, b) => b[0] - a[0]).slice(0, NA).map(x => x[1]);
  const T0 = 14;
  // ponta do braço do Y (sítio de ligação), no espaço do modelo de vir3d-pecas.js, e a direção do braço
  const PTA = [-Math.sin(.62) * .58, Math.cos(.62) * .58, 0], ARM = [-Math.sin(.62), Math.cos(.62)];
  V3.cena('prevencao/vacinas', {
    fit: 8, raio: 4, bolas: 180, pecas: PA,
    so2D: S => S.modo !== 'ac3d',
    rotulos: [{ pc: 'ac', t: 'anticorpo', pr: 1 }, { pc: 'esp', t: 'espícula', pr: 2 }, { pc: 'virus', t: 'vírus', pr: 3 }, { pc: 'rec', t: 'receptor', pr: 4 }, { pc: 'mem', t: 'membrana da célula', pr: 5 }],
    montar(g) {
      const T = g.T;
      g.W = V3.kitV(g, { y: NA + 6, rods: 200 });
      g.memM = V3.filme(g, '#F06AAE', { cor2: '#FFD0E6', dentro: '#5A1E44', base: .3, fr: .55, esc: 2.2 });
      g.mem = V3.membranaB(g, g.memM, 8, null, 'mem'); g.mem.mesh.position.y = -1.9; g.mem.set(1, 2, 0);
      g.q0 = new T.Quaternion(); g.q1 = new T.Quaternion(); g.v1 = new T.Vector3(); g.v2 = new T.Vector3(); g.q2 = new T.Quaternion();
    },
    animar(g, P) {
      const t = P.t, W = g.W, ph = RED() ? 11 : t % T0;
      const kLiga = sst(1.2, 5, ph), kDesce = sst(5.2, 7.2, ph), kVolta = sst(7.4, 8.6, ph), some = 1 - sst(13.2, 14, ph);
      g.ph = ph;
      const c = [0, .6 - kDesce * 1 + kVolta * .35 + (RED() ? 0 : Math.sin(t * .9) * .04), 0];
      V3.setQ(g, g.q0, 0, RED() ? .3 : t * .2, 0);
      V3.envelope(g, W, DE, c, g.q0, .75, { tipo: () => 'bola', info: g.pecas.virus, infoEsp: () => g.pecas.esp });
      V3.capsideo(g, W, V3.modelo(g, 'ico', 2), c, g.q0, .4, { r: .2, info: g.pecas.virus, casca: '#4E5874' });
      ach(g, 'virus', add(c, [-.7, .55, .3]));
      // anticorpos: chegam de longe e prendem a ponta dos braços na espícula
      // cada anticorpo encaixa a ponta de um braço na bola da espícula; chega em linha reta de fora, sem cruzar o vírus
      ALVO.forEach((ie, j) => {
        const d = V3.giraV(g, g.q0, DE[ie]), bola = add(c, mul(d, .75 * (.97 + .3 * .82))), alvo = add(bola, mul(d, .75 * .085 * .7));
        const kj = sst(j * .05, j * .05 + .55, kLiga) * some;
        // o braço (direção local ARM) aponta para o centro do vírus; o giro em volta dele varia de um anticorpo para outro
        g.v1.set(ARM[0], ARM[1], 0); g.v2.set(-d[0], -d[1], -d[2]); g.q1.setFromUnitVectors(g.v1, g.v2);
        g.q2.setFromAxisAngle(g.v2, hash(j, 5) * TAU); g.q1.premultiply(g.q2);
        const fim = sub(alvo, V3.aplica(g, [0, 0, 0], g.q1, .55, PTA)), p = add(fim, mul(d, (1 - kj) * (2.6 + hash(j, 3))));
        V3.put(g, W.y, p, g.q1, .55, .55, .55, C.anticorpo, .95 + .1 * hash(j, 4), g.pecas.ac);
        if (j === 0) ach(g, 'ac', V3.aplica(g, p, g.q1, .55, [0, -.35, 0]));
        if (j === 1) ach(g, 'esp', add(bola, mul(d, -.12)));
      });
      // receptores na membrana: o vírus coberto chega perto e não encaixa
      for (let i = 0; i < 14; i++) { const a = i * 2.4, r = .3 + Math.sqrt(i / 14) * 2.6, b = [Math.cos(a) * r, -1.9, Math.sin(a) * r], tp = add(b, [0, .3, 0]); V3.bastao(g, W.rod, b, tp, .04, C.receptor, .95, g.pecas.rec); V3.bola(g, tp, .08, C.receptor, 1.05, g.pecas.rec); if (i === 0) ach(g, 'rec', tp); }
      ach(g, 'mem', [2.6, -1.9, .8]);
      if (ph > 8.4 && ph < 13.2) V3.ficha(g, add(c, [0, 1.6, 0]), 'neutralizado', C.vacina, { pr: 1, dy: 0 });
      V3.fimKit(W);
    },
    legenda: g => (!g || g.ph < 1.2 ? 'Um vírus e os <b>anticorpos</b> que a vacina ensinou o corpo a fazer.' : g.ph < 5.2 ? 'Os anticorpos prendem a ponta dos braços nas <b>espículas</b> do vírus, como chave e fechadura.' : g.ph < 8.6 ? 'Coberto de anticorpos, o vírus chega à célula, mas as espículas <b>não alcançam os receptores</b>.' : 'O vírus está <b>neutralizado</b>: não entra na célula e é removido pelas células de defesa.'),
    camera(g, P) { return V3.viva({ th: .35, fi: .18, d: V3.enquadrar(g, 2.6, 2.4) * 1.04, al: [0, -.35, 0] }, P.t, .5); }
  });
})();
