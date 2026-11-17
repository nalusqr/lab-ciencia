/* LAB Anatomia e fisiologia: alvéolos e hematose em 3D (Martin), sobre o kit do módulo Vírus (vir3d.js) e as peças deste
   módulo (anat3d-pecas.js). Bronquíolo que termina num cacho de alvéolos (película translúcida que enche e esvazia com a
   respiração) e uma rede de capilares por cima. No capilar da frente as hemácias chegam venosas (azul-arroxeado) pela
   arteríola pulmonar e saem arteriais (vermelho) pela vênula: o O₂ passa do ar do alvéolo para o sangue e o CO₂ faz o
   caminho contrário, por difusão, na mesma regra do desenho plano. O fole e o monóxido continuam no desenho plano. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.anCena) return;
  const { V } = V3, { cl, mix, seg, add, sub, mul, nrm, lerp3, fr, hash, TAU } = V;
  const RED = () => V3.REDUZ(), ach = V3.ach;
  const ART = '#E5484D', VEN = '#7C6FD6', O2C = '#6EC8E8', CO2C = '#A7B0C2', ALV = '#F2BFCB';
  const PE = {
    alv: { nome: 'Alvéolo', frase: 'Saquinho de ar com parede de uma só camada de células. Os dois pulmões têm centenas de milhões deles: uma área enorme para a troca de gases.', cor: ALV },
    bronq: { nome: 'Bronquíolo', frase: 'O tubo mais fino da árvore respiratória. Termina nos alvéolos, como um cacho de uvas.', cor: '#9FD4EA' },
    cap: { nome: 'Capilar', frase: 'Vaso com parede de uma só camada, colado na parede do alvéolo. Aqui acontece a hematose.', cor: '#C0507A' },
    art: { nome: 'Arteríola pulmonar', frase: 'Chega com sangue venoso, que veio do ventrículo direito pela artéria pulmonar.', cor: VEN },
    ven: { nome: 'Vênula pulmonar', frase: 'Sai com sangue arterial, que vai pelas veias pulmonares ao átrio esquerdo.', cor: ART },
    hem: { nome: 'Hemácia', frase: 'Leva o O₂ preso à hemoglobina. Entra venosa e sai arterial do capilar.', cor: ART },
    o2: { nome: 'O₂', frase: 'Passa do ar do alvéolo, onde há mais O₂, para o sangue, onde há menos: difusão.', cor: O2C },
    co2: { nome: 'CO₂', frase: 'Passa do sangue, onde há mais CO₂, para o ar do alvéolo, e sai na expiração.', cor: CO2C },
    ar: { nome: 'Ar', frase: 'Entra quando o diafragma desce e o volume do tórax aumenta; sai quando ele sobe.', cor: '#DDE6F7' }
  };
  const A0 = [.15, -.1, .35], R0 = .8;
  const ALVS = [[A0, R0], [[-.75, .55, -.3], .56], [[.92, .78, -.25], .6], [[1.22, -.32, -.32], .6], [[.32, -1.05, -.4], .6], [[-.62, -.62, -.32], .55], [[.4, .92, -.62], .55], [[-.18, .22, -.75], .62], [[-.95, .05, -.15], .45]];
  const D = [-1.25, .95, -.15];
  // capilar da frente: arteríola, arco por cima do alvéolo, vênula
  const arco = []; for (let k = 0; k <= 16; k++) { const a = Math.PI * (1.02 - k / 16 * 1.04); arco.push(add(A0, mul(nrm([Math.cos(a), -.22 + .12 * Math.sin(a * 2), Math.sin(a)]), R0 + .07))); }
  const CPc = [[-2.6, -1.2, .4], [-1.6, -.6, .4], ...arco, [1.7, -.5, .45], [2.7, -.9, .45]];

  V3.anCena('respiratorio/hematose', {
    fit: 9, raio: 4.5, bolas: 260, pecas: PE,
    so2D: S => S.modo !== 'alv',
    rotulos: [{ pc: 'alv', t: 'alvéolo (ar)', pr: 1 }, { pc: 'cap', t: 'capilar', pr: 1 }, { pc: 'bronq', t: 'bronquíolo', pr: 2 }, { pc: 'art', t: 'chega venoso', pr: 3 }, { pc: 'ven', t: 'sai arterial', pr: 3 }],
    montar(g) {
      const T = g.T, rad = g.q.cel ? 12 : 16;
      g.alv = ALVS.map(([c, r], i) => {
        const m = new T.Mesh(V3.esfera(g, g.q.cel ? 28 : 40), V3.filme(g, ALV, { cor2: '#FFE8EE', dentro: '#3A2030', base: i ? .2 : .1, fr: i ? .6 : .55, esc: 2.4 }));
        m.position.set(...c); m.scale.setScalar(r); m.userData.r = r; m.renderOrder = i ? 3 : 6; g.raiz.add(m); m.userData.peca = g.pecas.alv; g.pick.push(m); return m;
      });
      const br = V3.suave([[-2.8, 2.1, -.2, .3], [-2.0, 1.6, -.18, .26], [-1.25, .95, -.15, .24], [-.8, .55, -.1, .3]], 8);
      const tb = V3.tubo(g, br.length, rad, V3.filme(g, '#9FD4EA', { cor2: '#E8F6FF', dentro: '#1A3040', base: .24, fr: .6, esc: 3 }), null, 'bronq'); tb.set(br.map(p => p.slice(0, 3)), i => br[i][3]); tb.mesh.renderOrder = 4;
      g.BR = br.map(p => p.slice(0, 3)); g.BRF = V3.fracoes(g.BR);
      // capilar principal em três trechos de cor
      g.CP = V3.suave(CPc, 5); g.CPF = V3.fracoes(g.CP);
      const n = g.CP.length, a = 2 * 5, b = n - 2 * 5;
      g.fa = g.CPF[a]; g.fb = g.CPF[b];
      [[0, a + 1, VEN, 'art', .09], [a, b + 1, V3.corMix(VEN, ART, .5), 'cap', .075], [b, n, ART, 'ven', .09]].forEach(([i0, i1, cor, pc, r]) => {
        const P = g.CP.slice(i0, i1), t = V3.tubo(g, P.length, rad, V3.filme(g, cor, { cor2: '#FFE2E6', dentro: '#3A1830', base: .3, fr: .6, esc: 3 }), null, pc); t.set(P, r); t.mesh.renderOrder = 7;
      });
      // rede de capilares nos outros alvéolos (estática)
      const mc = V3.filme(g, '#C0507A', { cor2: '#FFD0DC', dentro: '#3A1830', base: .32, fr: .6, esc: 3 });
      ALVS.slice(1).forEach(([c, r], i) => {
        for (let k = 0; k < 2; k++) { const e1 = nrm([Math.cos(i + k * 1.7), .4 * k - .2, Math.sin(i * 1.3 + k)]), e2 = nrm(V3.perp(e1)), P = []; for (let j = 0; j <= 14; j++) { const a2 = j / 14 * Math.PI * 1.3 - .3; P.push(add(c, mul(nrm(add(mul(e1, Math.cos(a2)), mul(e2, Math.sin(a2)))), r + .04))); } const t = V3.tubo(g, P.length, 8, mc, null, 'cap'); t.set(P, .035); t.mesh.renderOrder = 5; }
      });
      g.H = V3.hemacias(g, 12, 'hem');
    },
    animar(g, P) {
      const t = RED() ? 3 : P.t, info = g.pecas, rv = !RED();
      // respiração: os alvéolos enchem e esvaziam (cerca de 4 s por ciclo no ritmo 1)
      const ph = t * 1.4, br = Math.sin(ph), ins = Math.cos(ph) > 0;
      g.alv.forEach((m, i) => m.scale.setScalar(m.userData.r * (1 + .045 * (rv ? br : 0))));
      // ar no bronquíolo: entra na inspiração e sai na expiração
      for (let i = 0; i < 8; i++) { const u = fr(i / 8 + (rv ? t * .35 : 0)), f = ins ? u : 1 - u; V3.bola(g, V3.em(g.BR, g.BRF, f), .035, '#DDE6F7', .9, info.ar); }
      // hemácias no capilar: venosas na chegada, arteriais na saída
      const cp = f => V3.em(g.CP, g.CPF, f);
      for (let i = 0; i < 9; i++) {
        const u = fr(t * .06 + i / 9), p = cp(u), k = seg(u, g.fa + .05, g.fb - .1);
        V3.put(g, g.H, p, V3.giro(g, i, t * 2), .085, .085, .085, V3.corMix(VEN, ART, k), 1, info.hem);
        if (i === 3) ach(g, 'hem', p);
      }
      V3.fim(g.H);
      const sc = 1 + .045 * (rv ? br : 0), dentro = i => add(A0, mul(nrm([Math.cos(i * 2.3), Math.sin(i * 2.3) * .6, Math.sin(i * 1.1) * .5 - .3]), R0 * .55 * sc));
      // O₂: do ar do alvéolo para o capilar; CO₂: do capilar para o ar
      for (let i = 0; i < 10; i++) { const u = fr(t * .3 + i * .1), alvo = cp(g.fa + (g.fb - g.fa) * (.12 + .76 * hash(i, 3))); const p = lerp3(dentro(i), alvo, u); V3.bola(g, p, .05, O2C, 1.1, info.o2); if (i === 2) ach(g, 'o2', p); }
      for (let i = 0; i < 8; i++) { const u = fr(t * .3 + i * .125 + .3), de = cp(g.fa + (g.fb - g.fa) * (.12 + .76 * hash(i, 5))); const p = lerp3(de, dentro(i + 20), u); V3.bola(g, p, .05, CO2C, 1, info.co2); if (i === 4) ach(g, 'co2', p); }
      ach(g, 'alv', add(A0, [-.25, .2, .2])); ach(g, 'cap', cp((g.fa + g.fb) / 2)); ach(g, 'bronq', [-2.0, 1.6, -.18]); ach(g, 'art', cp(.06)); ach(g, 'ven', cp(.95)); ach(g, 'ar', V3.em(g.BR, g.BRF, .3));
      V3.ficha(g, cp(.02), 'venoso', VEN, { pr: 1, dy: 1 }); V3.ficha(g, cp(.99), 'arterial', ART, { pr: 1, dy: 1 });
      V3.ficha(g, add(A0, [-R0 - .2, .55, .3]), 'parede de uma só camada', '#E8EDF7', { pr: 2, dx: -1, dy: 0 });
      V3.ficha(g, [-2.5, 1.7, -.2], rv ? (ins ? 'inspiração' : 'expiração') : 'ar no alvéolo', '#DDE6F7', { pr: 3, dx: -1, dy: 0 });
    },
    camera(g, P) {
      const d = V3.deitado(g);
      return V3.anCam(g, P, d ? 2.9 : 2.3, d ? 2.1 : 2.6, { al: [0, .2, 0], th: .25, fi: .2 });
    }
  });
})();
