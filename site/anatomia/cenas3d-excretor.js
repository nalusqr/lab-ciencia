/* LAB Anatomia e fisiologia: néfron em 3D (Martin), sobre o kit do módulo Vírus (vir3d.js) e as peças deste módulo
   (anat3d-pecas.js). Arteríola aferente que entra no glomérulo (novelo de capilares) dentro da cápsula de Bowman aberta,
   arteríola eferente e capilares que correm junto do túbulo. Túbulo proximal contorcido, alça néfrica que desce fina e
   sobe grossa, túbulo distal contorcido e ducto coletor, em película translúcida para ver o que corre dentro.
   As partículas seguem a mesma regra do desenho plano: tudo o que é pequeno passa no filtro; proteína e hemácia ficam no
   sangue; glicose e aminoácido voltam no túbulo proximal (com ATP), sódio e água ao longo do túbulo; H⁺ é secretado;
   a ureia fica e desce como urina. O quadro de concentrações e a hemodiálise continuam no desenho plano. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.anCena) return;
  const { V } = V3, { cl, mix, sst, seg, add, sub, mul, lerp3, fr, TAU } = V;
  const RED = () => V3.REDUZ(), ach = V3.ach;
  const ART = '#E5484D', VEN = '#7C6FD6', AM = '#FFB347', TUB = '#E3C25B';
  const PT = [{ id: 'glicose', c: '#F2D04A', re: .27, k: 7 }, { id: 'aminoacido', c: '#E58AB0', re: .27, k: 5 }, { id: 'sodio', c: '#E8EDF7', re: .55, k: 7 }, { id: 'agua', c: '#8FD0F0', re: .62, k: 9 }, { id: 'ureia', c: '#C9A227', re: 2, k: 7 }, { id: 'proteina', c: '#9A6BFF', re: -1, k: 3 }, { id: 'hemacia', c: ART, re: -1, k: 4 }];
  const PE = {
    glom: { nome: 'Glomérulo', frase: 'Novelo de capilares com pressão alta: empurra para a cápsula água e tudo o que é pequeno. É a filtração.', cor: ART },
    capsula: { nome: 'Cápsula de Bowman', frase: 'Taça que abraça o glomérulo e recolhe o filtrado. Por dia, os dois rins filtram cerca de 180 litros.', cor: '#E8EDF7' },
    tcp: { nome: 'Túbulo contorcido proximal', frase: 'Aqui volta para o sangue toda a glicose e todos os aminoácidos, por transporte ativo, com gasto de ATP. Também volta a maior parte do sódio e da água.', cor: TUB },
    alca: { nome: 'Alça néfrica (de Henle)', frase: 'Desce fina e sobe grossa pela parte de dentro do rim. Ajuda a recuperar água e sódio e a deixar a urina concentrada.', cor: TUB },
    tcd: { nome: 'Túbulo contorcido distal', frase: 'Ajuste fino: a aldosterona faz reabsorver sódio. Também secreta H⁺ e potássio, o que ajuda a manter o pH.', cor: TUB },
    ducto: { nome: 'Ducto coletor', frase: 'Recebe vários néfrons. O ADH abre canais de água nele: volta mais água ao sangue e a urina sai pouca e concentrada. O que sai daqui é a urina.', cor: TUB },
    aff: { nome: 'Arteríola aferente', frase: 'Traz o sangue ao glomérulo. É mais larga que a eferente, o que mantém a pressão alta no filtro.', cor: ART },
    eff: { nome: 'Arteríola eferente', frase: 'Leva o sangue que saiu do glomérulo, com as proteínas e as células que não passaram.', cor: ART },
    capil: { nome: 'Capilares peritubulares', frase: 'Correm junto do túbulo e recebem de volta o que é reabsorvido. Daqui o sangue segue para a veia renal.', cor: '#C0507A' },
    glicose: { nome: 'Glicose', frase: 'Passa no filtro e volta toda no túbulo proximal. Só aparece na urina quando sobra demais, como no diabetes sem controle.', cor: '#F2D04A' },
    aminoacido: { nome: 'Aminoácido', frase: 'Passa no filtro e volta todo no túbulo proximal.', cor: '#E58AB0' },
    sodio: { nome: 'Sódio', frase: 'Quase todo reabsorvido ao longo do túbulo; a água segue o sódio por osmose.', cor: '#E8EDF7' },
    agua: { nome: 'Água', frase: 'Quase toda volta para o sangue por osmose. Por isso só cerca de 1,5 litro vira urina por dia.', cor: '#8FD0F0' },
    ureia: { nome: 'Ureia', frase: 'Feita no fígado a partir da amônia. Pouco reabsorvida: como a água volta, ela fica concentrada na urina.', cor: '#C9A227' },
    proteina: { nome: 'Proteína do plasma', frase: 'Grande demais para o filtro: fica no sangue. Proteína na urina indica lesão no glomérulo.', cor: '#9A6BFF' },
    hemacia: { nome: 'Hemácia', frase: 'Célula grande: não passa no filtro.', cor: ART },
    h: { nome: 'H⁺ secretado', frase: 'Os túbulos, sobretudo o distal, jogam íons H⁺ do sangue para a urina: é a secreção, que ajuda a manter o pH do sangue.', cor: AM }
  };
  // túbulo [x, y, z, raio]; marcas dos trechos nos índices de controle
  const TP = [[-1.22, 1.12, 0, .085], [-.98, 1.38, .14, .09], [-.72, .95, -.1, .09], [-.46, 1.38, .12, .09], [-.2, .95, -.12, .09], [.02, 1.32, .1, .09], [.22, 1.0, 0, .08],
    [.26, .35, 0, .055], [.26, -.6, 0, .055], [.27, -1.5, 0, .055], [.43, -1.78, 0, .06], [.6, -1.5, 0, .075], [.6, -.6, 0, .075], [.6, .35, 0, .075], [.62, .95, 0, .08],
    [.86, 1.32, .12, .08], [1.1, .95, -.1, .08], [1.35, 1.32, .12, .08], [1.6, 1.0, 0, .08], [1.86, 1.0, 0, .12], [2.02, .6, 0, .12], [2.04, -.5, 0, .12], [2.04, -1.75, 0, .12]];
  const MARC = [0, 6, 14, 18, TP.length - 1], NS = 6, PCS = ['tcp', 'alca', 'tcd', 'ducto'];
  const BC = [-1.72, 1.12, 0], OFF = [0, -.1, -.3];
  const AFF = [[-3.0, 1.85, 0, .085], [-2.55, 1.6, 0, .08], [-2.2, 1.3, 0, .07]], EFF = [[-2.2, 1.0, 0, .05], [-2.25, .6, -.2, .05], [-1.5, .65, -.3, .05], [-1.2, 1.0, -.3, .05]];

  V3.anCena('excretor/nefron', {
    fit: 9, raio: 4.5, bolas: 360, pecas: PE,
    so2D: S => S.modo !== 'nef',
    rotulos: [{ pc: 'glom', t: 'glomérulo', pr: 1 }, { pc: 'capsula', t: 'cápsula de Bowman', pr: 2 }, { pc: 'tcp', t: 'túbulo proximal', pr: 1 }, { pc: 'alca', t: 'alça néfrica', pr: 1 }, { pc: 'tcd', t: 'túbulo distal', pr: 2 }, { pc: 'ducto', t: 'ducto coletor', pr: 1 },
      { pc: 'aff', t: 'arteríola aferente', pr: 3 }, { pc: 'eff', t: 'eferente', pr: 5 }, { pc: 'capil', t: 'capilares', pr: 4 }],
    montar(g) {
      const T = g.T, rad = g.q.cel ? 12 : 16;
      g.pl = V3.corte(g, g.raiz, [0, 0, -1], 0);
      // túbulo inteiro (para as partículas) e em trechos (para tocar)
      g.TB = V3.suave(TP, NS); g.TBF = V3.fracoes(g.TB);
      const fm = (cor, o) => V3.filme(g, cor, Object.assign({ cor2: '#FFF6D8', dentro: '#3A2E10', base: .22, fr: .6, esc: 3 }, o || {}));
      for (let k = 0; k < 4; k++) {
        const P = g.TB.slice(MARC[k] * NS, MARC[k + 1] * NS + 1), tb = V3.tubo(g, P.length, rad, fm(TUB), null, PCS[k]);
        tb.set(P.map(p => p.slice(0, 3)), i => P[i][3]); tb.mesh.renderOrder = 5;
      }
      // cápsula de Bowman aberta na frente e glomérulo
      const cap = new T.Mesh(V3.esfera(g, g.q.cel ? 26 : 36), V3.filme(g, '#E8EDF7', { cor2: '#FFFFFF', dentro: '#2A3550', base: .14, fr: .7, esc: 2.5, planos: [g.pl] }));
      cap.position.set(...BC); cap.scale.setScalar(.5); g.raiz.add(cap); cap.renderOrder = 6; cap.userData.peca = g.pecas.capsula; g.pick.push(cap);
      const GN = []; for (let k = 0; k <= 90; k++) { const a = k / 90 * TAU * 2; GN.push(add(BC, [.24 * Math.sin(3 * a + .5) * Math.cos(a * .5), .24 * Math.sin(2 * a + 1) * .9, .2 * Math.cos(3 * a) * Math.sin(a * .5 + 1)])); }
      const gP = [AFF[2].slice(0, 3), ...GN, EFF[0].slice(0, 3)];
      const gl = V3.tubo(g, gP.length, g.q.cel ? 8 : 10, V3.fis(g, '#D9505A', { p: { roughness: .4, clearcoat: .6 }, rim: '#FFC0C8', rimK: .3 }), null, 'glom'); gl.set(gP, .042);
      const vaso = (P, pc, cor, base) => { const S = V3.suave(P, 6), t = V3.tubo(g, S.length, rad, V3.filme(g, cor, { cor2: '#FFE2E6', dentro: '#5A1820', base: base || .3, fr: .6, esc: 3 }), null, pc); t.set(S.map(p => p.slice(0, 3)), i => S[i][3]); t.mesh.renderOrder = 4; return S; };
      vaso(AFF, 'aff', ART, .35); vaso(EFF, 'eff', ART, .35);
      // capilares junto do túbulo (de arterial a venoso)
      const K = g.TB.filter((p, i) => i % 2 === 0).map(p => [p[0] + OFF[0], p[1] + OFF[1], p[2] + OFF[2], .045]), n3 = Math.floor(K.length / 3);
      [[0, n3 + 1, ART], [n3, 2 * n3 + 1, V3.corMix(ART, VEN, .5)], [2 * n3, K.length, VEN]].forEach(([a, b, cor]) => { const P = K.slice(a, b); const t = V3.tubo(g, P.length, g.q.cel ? 8 : 10, V3.filme(g, cor, { cor2: '#FFE2E6', dentro: '#3A1830', base: .32, fr: .6, esc: 3 }), null, 'capil'); t.set(P.map(p => p.slice(0, 3)), .045); t.mesh.renderOrder = 4; });
      // caminho do sangue até o glomérulo e a saída pela eferente
      g.G0 = V3.suave([AFF[0], AFF[1], AFF[2], [...BC, .1], EFF[0], [-1.6, .9, -.25, .04], [g.TB[0][0] + OFF[0], g.TB[0][1] + OFF[1], g.TB[0][2] + OFF[2], .03]], 5); g.G0F = V3.fracoes(g.G0);
      g.H = V3.hemacias(g, 10, 'hemacia');
      g.u0 = 0;
    },
    animar(g, P) {
      const t = RED() ? 9 : P.t, info = g.pecas;
      const tub = f => { const p = V3.em(g.TB, g.TBF, f); return [p[0], p[1], p[2]]; };
      const kp = s => { if (s < .1) { const p = V3.em(g.G0, g.G0F, s / .1); return [p[0], p[1], p[2]]; } return add(tub((s - .1) / .9), OFF); };
      PT.forEach((p, ti) => {
        for (let j = 0; j < p.k; j++) {
          const s = fr(t * .045 + (j + ti * .37) / p.k), fil = ti < 5; let pt = kp(s);
          if (fil && s >= .1) {
            const a = sst(0, 1, seg(s, .1, .14)), b = p.re > 0 && p.re < 1.5 ? sst(0, 1, seg(s, p.re, p.re + .05)) : 0, k = kp(s), tp = tub((s - .1) / .9);
            pt = lerp3(lerp3(k, tp, a), k, b);
          }
          const jit = [Math.sin(j * 2.1 + ti) * .025, Math.cos(j * 1.7 + ti) * .025, Math.sin(j * 3.3) * .025];
          if (ti === 6) V3.put(g, g.H, add(pt, jit), V3.giro(g, j + 50, t * 3), .065, .065, .065, ART, 1, info.hemacia);
          else V3.bola(g, add(pt, jit), ti === 5 ? .055 : .035, p.c, 1.05, info[p.id]);
          if (j === 1) { if (p.id === 'glicose' && s > .14 && s < .3) ach(g, 'glicose', pt); if (p.id === 'ureia' && s > .85) ach(g, 'ureia', pt); if (p.id === 'proteina' && s > .2) ach(g, 'proteina', pt); }
        }
      });
      for (let j = 0; j < 4; j++) { const s = fr(t * .045 + j / 4 + .1), k = kp(s), a = sst(0, 1, seg(s, .71, .76)); V3.bola(g, lerp3(k, tub((s - .1) / .9), a), .033, AM, 1.15, info.h); }
      V3.fim(g.H);
      // ATP do transporte ativo no túbulo proximal
      const pa = tub(.12); V3.brilho(g, add(pa, [0, .12, .15]), .03 + (RED() ? 0 : .012 * Math.sin(t * 6)), AM, 1);
      ach(g, 'glom', add(BC, [-.05, .05, .1])); ach(g, 'capsula', add(BC, [0, .45, -.1])); ach(g, 'tcp', tub(.06)); ach(g, 'alca', tub(.38)); ach(g, 'tcd', tub(.66)); ach(g, 'ducto', tub(.93));
      ach(g, 'aff', [-2.7, 1.72, 0]); ach(g, 'eff', [-2.25, .7, -.2]); ach(g, 'capil', add(tub(.3), OFF));
      V3.ficha(g, add(BC, [0, -.65, 0]), '1. filtração', '#E8EDF7', { pr: 1, dy: 1 });
      V3.ficha(g, add(tub(.08), [0, .5, 0]), '2. reabsorção, com ATP', '#F2D04A', { pr: 1, dy: -1 });
      V3.ficha(g, add(tub(.7), [0, .5, 0]), '3. secreção de H⁺', AM, { pr: 2, dy: -1 });
      V3.ficha(g, tub(.97), 'urina', '#C9A227', { pr: 1, dx: 1, dy: 0 });
    },
    camera(g, P) {
      const d = V3.deitado(g);
      return V3.anCam(g, P, d ? 3.2 : 2.7, d ? 2.55 : 2.9, { al: [-.45, -.3, 0], th: .22, fi: .14 });
    }
  });
})();
