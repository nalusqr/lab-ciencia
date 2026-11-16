/* LAB Anatomia e fisiologia: sinapse química em 3D (Martin), sobre o kit do módulo Vírus (vir3d.js) e as peças deste
   módulo (anat3d-pecas.js). Axônio que chega ao terminal (película translúcida com vesículas e uma mitocôndria), fenda
   sináptica e o dendrito do neurônio seguinte com seis receptores. O impulso desce pelo axônio, o neurotransmissor sai das
   vesículas, atravessa a fenda, encaixa nos receptores (que acendem) e volta pela recaptação. Os disparos do neurônio
   seguinte correm pelo dendrito. As drogas seguem a mesma regra do desenho plano (estimulante que bloqueia a recaptação,
   depressora, curare que tampa os receptores e a tolerância com o uso repetido) e são botões sobre o palco.
   Repouso e susto continua no desenho plano. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.anCena) return;
  const { V } = V3, { cl, mix, sst, add, mul, lerp3, fr, hash, TAU } = V;
  const RED = () => V3.REDUZ(), ach = V3.ach;
  const AZ = '#6FB1E8', NT = '#F2C94C', OK = '#5FD38A', ERR = '#F0605D', REC = '#9DA9C4', AM = '#FFB347';
  const PE = {
    axonio: { nome: 'Axônio do neurônio de origem', frase: 'Traz o impulso nervoso até o terminal. O impulso é elétrico; na sinapse, a mensagem vira química.', cor: AZ },
    terminal: { nome: 'Terminal do axônio', frase: 'Ponta do axônio cheia de vesículas. Quando o impulso chega, as vesículas se fundem com a membrana e soltam o neurotransmissor.', cor: AZ },
    vesic: { nome: 'Vesículas', frase: 'Bolsinhas de membrana com neurotransmissor guardado.', cor: NT },
    mito: { nome: 'Mitocôndria', frase: 'Fornece o ATP que o terminal gasta para encher as vesículas e recaptar o neurotransmissor.', cor: '#F28C3A' },
    nt: { nome: 'Neurotransmissor', frase: 'Molécula mensageira (como dopamina, serotonina ou acetilcolina) que atravessa a fenda e encaixa nos receptores.', cor: NT },
    fenda: { nome: 'Fenda sináptica', frase: 'O espaço estreito entre os dois neurônios. Os neurônios não se tocam.', cor: '#C9D3E6' },
    receptor: { nome: 'Receptores', frase: 'Proteínas do neurônio seguinte. Quando o neurotransmissor encaixa (verde), abrem canais e o neurônio pode disparar.', cor: OK },
    recap: { nome: 'Recaptação', frase: 'Bombas que puxam o neurotransmissor de volta para o terminal e encerram o sinal. Alguns estimulantes bloqueiam essas bombas.', cor: REC },
    dendrito: { nome: 'Dendrito do neurônio seguinte', frase: 'Recebe a mensagem. Os anéis que correm por ele são os disparos (impulsos) que ele gera.', cor: AZ },
    curare: { nome: 'Curare', frase: 'Age na junção entre nervo e músculo: tampa os receptores de acetilcolina, o sinal não passa e o músculo fica paralisado.', cor: ERR }
  };
  const DR = [['', 'Sem droga', 'sem droga'], ['e', 'Estimulante', 'estimulante que bloqueia a recaptação'], ['d', 'Depressora', 'depressora'], ['c', 'Curare', 'curare, que tampa os receptores']];
  const slot = k => -1.1 + k * .44, vx = j => -.62 + j * .62, trx = j => -1.28 + j * 1.28, Y0 = .2, Y1 = -.2;
  const VES = [[-.62, .24, .05], [0, .22, .1], [.62, .24, -.02], [-.35, .55, .25], [.4, .58, .2], [-.8, .7, -.25], [.15, .85, -.2], [.75, .9, .15], [-.2, 1.05, .3], [.55, .5, -.35]];

  V3.anCena('nervoso/autonomo', {
    fit: 9, raio: 4.5, bolas: 280, pecas: PE,
    so2D: S => S.modo !== 'sin',
    sair() { V3.anEsconde('sin'); V3.limpa2D(); },
    rotulos: [{ pc: 'terminal', t: 'terminal do axônio', pr: 1 }, { pc: 'vesic', t: 'vesículas', pr: 2 }, { pc: 'nt', t: 'neurotransmissor', pr: 1 }, { pc: 'fenda', t: 'fenda sináptica', pr: 3 },
      { pc: 'receptor', t: 'receptores', pr: 1 }, { pc: 'recap', t: 'recaptação', pr: 2 }, { pc: 'dendrito', t: 'neurônio seguinte', pr: 3 }, { pc: 'mito', t: 'mitocôndria', pr: 5 }],
    montar(g) {
      const T = g.T, rad = g.q.cel ? 14 : 20, fm = (cor, o) => V3.filme(g, cor, Object.assign({ cor2: '#E6F2FF', dentro: '#18304A', base: .14, fr: .62, esc: 2.2 }, o || {}));
      const ax = V3.tubo(g, 12, rad, fm(AZ), null, 'axonio'); const AP = []; for (let i = 0; i < 12; i++) AP.push([Math.sin(i * .4) * .04, 3.5 - i * .17, 0]); ax.set(AP, i => .3 + (i > 8 ? (i - 8) * .1 : 0)); ax.mesh.renderOrder = 4;
      const bt = new T.Mesh(V3.celGeo(g), fm(AZ)); bt.position.set(0, .95, 0); bt.scale.set(1.45, .88, 1.05); bt.renderOrder = 5; g.raiz.add(bt); bt.userData.peca = g.pecas.terminal; g.pick.push(bt);
      const de = V3.tubo(g, 16, rad, fm('#7FA8E0'), null, 'dendrito'); const DP = []; for (let i = 0; i < 16; i++) DP.push([-3 + i * .4, -.88 - Math.cos(i * .4 - 3) * .03, 0]); de.set(DP, .62); de.mesh.renderOrder = 4;
      const mi = V3.peca(g, V3.capsula(g, 1, 1.6, 18), V3.fis(g, '#F28C3A', { p: { roughness: .5, clearcoat: .4 }, rimK: .3 }), 'mito'); mi.position.set(-.62, 1.3, -.15); mi.scale.setScalar(.13); mi.rotation.z = 1.1;
      g.ves = V3.inst(g, V3.esfera(g, 18), V3.fis(g, '#FFFFFF', { p: { roughness: .3, clearcoat: .7, transmission: 0 }, rim: '#FFF0B0', rimK: .4 }), 12, null, g.pecas.vesic); g.pick.push(g.ves.m);
      g.rod = V3.inst(g, V3.cilindro(g, 10), V3.fis(g, '#FFFFFF', { p: { roughness: .45, clearcoat: .4 } }), 20); g.pick.push(g.rod.m);
      g.tol = 0;
    },
    animar(g, P) {
      const S = P.S, t = P.t, info = g.pecas, rv = !RED(), drug = S.drug || '';
      g.tol += ((S.rep && drug ? 1 : 0) - g.tol) * Math.min(1, (g.dt || 0) * 1.5 + (rv ? 0 : 1));
      const tol = g.tol, nrec = 6 - Math.round(tol * 3);
      V3.anBotoes('sin', [...DR.map(([k, t2, d]) => ({ t: t2, d: 'Droga: ' + d, on: S2 => { S2.drug = k; }, pr: S2 => (S2.drug || '') === k })), { t: 'Uso repetido', d: 'Uso repetido da droga', on: S2 => { S2.rep = !S2.rep; }, pr: S2 => !!S2.rep }], S, S.modo === 'sin', 'Drogas na sinapse');
      // vesículas: as três da frente se fundem com a membrana em ciclo
      VES.forEach((p, i) => {
        let r = .12, q = p;
        if (i < 3 && rv) { const u = fr(t * .22 + i / 3 + .5); r = .12 * (1 - sst(.0, .12, u) * (1 - sst(.55, .95, u))); q = add(p, [0, -.06 * sst(0, .1, u), 0]); }
        V3.put(g, g.ves, q, null, r, r, r, '#F7E3A0', 1, info.vesic);
      });
      ach(g, 'vesic', VES[4]);
      // receptores e bombas de recaptação
      for (let k = 0; k < 6; k++) {
        const x = slot(k), a = [x, -.24, 0], b = [x, -.12, 0];
        if (k < nrec) { V3.bastao(g, g.rod, a, b, .07, drug === 'c' ? '#B0545A' : REC, 1, info.receptor); if (drug === 'c') V3.bola(g, [x, -.06, 0], .075, ERR, 1.05, info.curare); }
        else V3.bastao(g, g.rod, [x, -.25, 0], [x, -.22, 0], .05, '#4A5370', 1, info.receptor);
      }
      ach(g, 'receptor', [slot(4), -.12, 0]); if (drug === 'c') ach(g, 'curare', [slot(1), -.06, 0]);
      for (let j = 0; j < 3; j++) V3.put(g, g.mS, [trx(j), .16, 0], null, .1, .07, .1, REC, 1, info.recap);
      ach(g, 'recap', [trx(2), .16, 0]);
      // neurotransmissor (mesma regra do desenho plano)
      const rel = drug === 'd' ? .4 : 1, N = Math.round(14 * rel), extra = drug === 'e' ? Math.round(6 + 4 * (1 - tol)) : 0, bound = new Set();
      for (let i = 0; i < N + extra; i++) {
        const lin = i >= N, p = lin ? .75 : fr(t * .22 + i / N), k = (i * 5 + 1) % 6, rx = slot(k), j = i % 3, z = (hash(i, 3) - .5) * .4; let pos;
        if (lin) pos = [-1.1 + 2.2 * hash(i, 1) + Math.sin(t * 2 + i) * .05, mix(Y0, Y1, .2 + .6 * hash(i, 2)) + Math.cos(t * 1.7 + i) * .03, z];
        else if (p < .35) { const q = sst(0, 1, p / .35); pos = [mix(vx(j), rx, q) + Math.sin(p * 20 + i) * .03, mix(Y0, Y1, q), z * q]; }
        else if (p < .65) { pos = [rx, Y1 + .1, 0]; if (k < nrec && drug !== 'c') bound.add(k); }
        else if (drug === 'e') pos = [rx + Math.sin(t * 3 + i) * .08, Y1 + .12 + (i % 3) * .07, z];
        else { const q = sst(0, 1, (p - .65) / .35); pos = [mix(rx, trx(j), q), mix(Y1 + .1, .1, q), z * (1 - q)]; }
        if (k >= nrec && p >= .35 && p < .65) pos = [rx + Math.sin(t * 2.5 + i) * .07, Y1 + .1 + (i % 3) * .07, z];
        V3.bola(g, pos, .045, NT, 1.1, info.nt); if (i === 2) ach(g, 'nt', pos);
      }
      bound.forEach(k => V3.brilho(g, [slot(k), -.1, 0], .06, OK, 1.2));
      // impulso que chega pelo axônio e disparos no dendrito
      if (rv) { const u = fr(t * .22 * 3); for (let a = 0; a < 8; a++) { const an = a / 8 * TAU; V3.brilho(g, [Math.cos(an) * .31, 3.4 - u * 1.6, Math.sin(an) * .31], .025, AM, 1); } }
      const f = drug === 'c' ? 0 : drug === 'd' ? .15 : drug === 'e' ? .5 + .45 * (1 - .6 * tol) : .5;
      if (rv) for (let n = 0; n < 16; n++) { const k = Math.floor(t * 5) - n; if (hash(k, 7) >= f) continue; const x = -.2 + (t - k / 5) * 1.4; if (x > 2.9) continue; for (let a = 0; a < 10; a++) { const an = a / 10 * TAU; V3.brilho(g, [x, -.88 + Math.cos(an) * .63, Math.sin(an) * .63], .022, AZ, 1.3); } }
      V3.fim(g.ves); V3.fim(g.rod);
      ach(g, 'terminal', [1.2, 1.05, .3]); ach(g, 'axonio', [0, 2.8, .3]); ach(g, 'dendrito', [-2.2, -.9, .62]); ach(g, 'fenda', [-1.6, .0, 0]); ach(g, 'mito', [-.62, 1.3, -.15]);
      V3.ficha(g, [2.7, -.6, .65], ['disparos normais', 'disparos de sobra', 'poucos disparos', 'sem disparos'][Math.max(0, DR.findIndex(d => d[0] === drug))], f > .55 ? AM : f < .1 ? ERR : '#C9D3E6', { pr: 1, dx: 1, dy: -1 });
      if (tol > .3) V3.ficha(g, [-2.7, -.6, .65], 'menos receptores: tolerância', AM, { pr: 1, dx: -1, dy: -1 });
    },
    legenda(g, S) {
      const drug = S.drug || '';
      return (drug === 'e' ? 'Sem a recaptação, o neurotransmissor se acumula na fenda e o neurônio seguinte dispara sem parar.' : drug === 'd' ? 'Menos neurotransmissor liberado: menos disparos.' : drug === 'c' ? 'Os receptores tampados não recebem o sinal: o neurônio seguinte não dispara.' : 'O neurotransmissor atravessa a fenda, encaixa nos receptores e volta pela recaptação. Escolha uma droga nos botões.')
        + (S.rep && drug ? ' Com o uso repetido, os receptores diminuem (tolerância): é preciso mais droga para o mesmo efeito.' : '') + '<br>Conteúdo educativo, não substitui orientação médica.';
    },
    camera(g, P) {
      const d = V3.deitado(g);
      return V3.anCam(g, P, d ? 3.6 : 2.3, d ? 2.7 : 3.2, { al: [.2, .45, 0], th: .35, fi: .16 });
    }
  });
})();
