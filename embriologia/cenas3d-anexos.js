/* LAB Embriologia: cenas 3D dos anexos embrionários (Martin). Ovo de galinha com a casca aberta em corte, onde a vesícula
   vitelínica, o âmnio, o córion e a alantoide crescem dia a dia (e o mesmo para o embrião humano); ovos de peixe,
   anfíbio, réptil e ave e mamífero lado a lado, com a linha do tempo da saída da água. Usa o kit embrio3d.js; a cena 2D
   antiga fica como plano B sem WebGL. */
'use strict';
(function () {
  const E3 = window.EMB3D; if (!E3) return;
  const { V, K } = E3, { cl, mix, seg, sst, TAU, hash, add } = V;
  const cam = (g, P, hx, hy, o = {}) => E3.viva({ th: o.th == null ? .2 : o.th, fi: o.fi == null ? .12 : o.fi, d: E3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .6 : o.viva);
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const PEC = {
    vit: { nome: 'Vesícula vitelínica', frase: 'Nutrição: envolve o vitelo e leva o alimento ao embrião por vasos sanguíneos. No ser humano é pequena, sem vitelo, e forma as primeiras células do sangue.', cor: K.vitelo },
    amn: { nome: 'Âmnio', frase: 'Proteção: bolsa com líquido amniótico, que evita a desidratação e amortece choques. No ser humano é a bolsa d\'água.', cor: K.amnio },
    cor: { nome: 'Córion', frase: 'Envolve todos os outros anexos e faz trocas gasosas junto com a alantoide. No ser humano forma as vilosidades, a parte fetal da placenta, e produz hCG.', cor: K.corion },
    ala: { nome: 'Alantoide', frase: 'Guarda as excretas (ácido úrico) e faz trocas gasosas. No ser humano é reduzida; seus vasos formam os vasos umbilicais.', cor: K.alant },
    emb: { nome: 'Embrião', frase: 'Cresce sobre a gema, ligado aos anexos por vasos.', cor: K.pele },
    casca: { nome: 'Casca porosa', frase: 'Protege e deixa passar O₂ e CO₂ pelos poros.', cor: K.casca },
    clara: { nome: 'Clara', frase: 'Reserva de água e proteínas, consumida durante a incubação.', cor: K.clara },
    plac: { nome: 'Placenta', frase: 'Órgão de trocas entre mãe e feto, formado pelo córion e pela parede do útero.', cor: K.placenta }
  };

  // =====================================================================================
  // OS QUATRO ANEXOS (ave e humano)
  // =====================================================================================
  E3.cena('anexos/funcoes', {
    fit: 16, raio: 7, bolas: 60,
    pecas: PEC,
    rotulos: [{ pc: 'vit', t: 'vesícula vitelínica' }, { pc: 'amn', t: 'âmnio' }, { pc: 'cor', t: 'córion' }, { pc: 'ala', t: 'alantoide' }, { pc: 'emb', t: 'embrião' }, { pc: 'clara', t: 'clara' }],
    montar(g) {
      const T = g.T, sf = E3.esfera(g, 56); g.pl = E3.corte(g, g.raiz);
      // ave
      g.ave = new T.Group(); g.raiz.add(g.ave);
      g.casca = E3.solido(g, sf, K.casca, [g.pl], { pai: g.ave, pc: 'casca', corte: '#F6EFE2', m: { p: { roughness: .8, clearcoat: .1 } } }); g.casca.scale.set(2.7, 3.4, 2.7);
      g.clara = E3.solido(g, sf, '#C8D6E8', [g.pl], { pai: g.ave, pc: 'clara', corte: '#B9C9DE', kc: 1 }); g.clara.scale.set(2.55, 3.25, 2.55);
      g.corA = E3.peca(g, sf, E3.filme(g, K.corion, { cor2: '#FFFFFF', dentro: '#2A2040', base: .1, fr: .55, planos: [g.pl] }), 'cor', g.ave); g.corA.scale.set(2.58, 3.28, 2.58); g.corA.renderOrder = 3;
      g.gema = E3.peca(g, sf, E3.fis(g, K.vitelo, { p: { roughness: .35, clearcoat: .8 } }), 'vit', g.ave);
      g.pV = E3.corte(g, g.ave, [0, 1, 0], 0);
      g.vas = E3.peca(g, sf, E3.filme(g, '#E0484E', { cor2: '#FFB0A0', dentro: '#B02A30', base: .25, fr: .5, esc: 4, planos: [g.pV] }), 'vit', g.ave); g.vas.renderOrder = 4;
      g.vv = [0, 1, 2, 3, 4, 5].map(() => E3.tubo(g, 14, 6, E3.fis(g, '#C2283A', { p: { roughness: .4 } }), g.ave, 'vit'));
      g.embA = E3.corpo(g, { pai: g.ave, pc: 'emb' });
      g.amnA = E3.peca(g, sf, E3.filme(g, K.amnio, { cor2: '#FFFFFF', dentro: '#1E4E70', base: .1, fr: .6 }), 'amn', g.ave); g.amnA.renderOrder = 5;
      g.alaA = E3.peca(g, E3.lumpy(g, 'ala', 33, 3, 5, .08, .5, .9), E3.filme(g, K.alant, { cor2: '#FFFFFF', dentro: '#0E4A44', base: .14, fr: .6 }), 'ala', g.ave); g.alaA.renderOrder = 5;
      // humano
      g.hum = new T.Group(); g.raiz.add(g.hum);
      g.corH = E3.peca(g, sf, E3.filme(g, K.corion, { cor2: '#FFFFFF', dentro: '#2A2040', base: .12, fr: .6, planos: [g.pl] }), 'cor', g.hum); g.corH.renderOrder = 3;
      g.vil = E3.inst(g, E3.capsula(g, .12, .2, 8), E3.fis(g, '#9C7FE0', { p: { roughness: .5 } }), 160, g.hum, g.pecas.cor); g.pick.push(g.vil.m);
      g.amnH = E3.peca(g, sf, E3.filme(g, K.amnio, { cor2: '#FFFFFF', dentro: '#1E4E70', base: .1, fr: .6 }), 'amn', g.hum); g.amnH.renderOrder = 5;
      g.vitH = E3.peca(g, sf, E3.fis(g, K.vitelo, { p: { roughness: .4, clearcoat: .6 } }), 'vit', g.hum);
      g.ped = E3.tubo(g, 12, 8, E3.fis(g, '#C9A0B8', { p: { roughness: .5 } }), g.hum, 'ala');
      g.alaH = E3.tubo(g, 10, 6, E3.fis(g, K.alant, { p: { roughness: .4 } }), g.hum, 'ala');
      g.embH = E3.corpo(g, { pai: g.hum, pc: 'emb' });
    },
    animar(g, P) {
      const S = P.S, ave = S.modo !== 'hum', t = P.t; g.ave.visible = ave; g.hum.visible = !ave; g.modo = ave;
      const w = (o, p) => E3.mundo(g, o, p);
      if (ave) {
        const d = S.v / 100 * 21, ry = mix(1.55, .75, seg(d, 6, 21)), yc = -.45, top = yc + ry;
        g.clara.scale.set(2.55 * mix(1, .7, seg(d, 8, 20)), 3.25 * mix(1, .75, seg(d, 8, 20)), 2.55);
        g.gema.scale.setScalar(ry); g.gema.position.set(0, yc, 0);
        // vesícula vitelínica: membrana com vasos que cobre a gema aos poucos
        const cob = sst(1.5, 9, d); g.vas.visible = cob > .02; g.vas.position.set(0, yc, 0); g.vas.scale.setScalar(ry * 1.015); g.pV.reg.c = -(ry - 2 * ry * cob) * 1 - yc * 0; g.pV.reg.n = [0, 1, 0]; g.pV.reg.c = -(yc + ry - 2 * ry * cob);
        g.vv.forEach((tb, i) => {
          if (cob < .05) { tb.set([]); return; } const a0 = i / 6 * TAU + .3, Pp = [];
          for (let k = 0; k < 14; k++) { const u = k / 13 * cob * 2.2, th = Math.min(Math.PI * .95, u), ph = a0 + Math.sin(u * 3 + i) * .25; Pp.push([Math.sin(th) * Math.cos(ph) * ry * 1.03, yc + Math.cos(th) * ry * 1.03, Math.sin(th) * Math.sin(ph) * ry * 1.03]); }
          tb.set(Pp, (k, n) => .05 * (1 - k / n * .6));
        });
        // embrião sobre a gema, no âmnio
        const es = mix(.35, 1.9, seg(d, 1, 19)); g.embA.gr.position.set(0, top + es * .35, .25); g.embA.gr.rotation.set(0, -.3, 0); g.embA.set(mix(20, 60, d / 21), t, es);
        const am = sst(2.5, 5.5, d); g.amnA.visible = am > .02; g.amnA.position.set(0, top + es * .35, .25); g.amnA.scale.set(es * .62 * mix(.5, 1, am) + .1, es * .55 * mix(.5, 1, am) + .1, es * .5 + .1);
        // alantoide cresce como um balão até encostar no córion, sob a casca
        const al = sst(3.5, 10, d); g.alaA.visible = al > .02; const ac = [mix(.5, .75, al), mix(top, 1.25, al), mix(.2, -.3, al)];
        g.alaA.position.set(...ac); g.alaA.scale.set(mix(.15, 1.15, al), mix(.15, 1.55, al), mix(.15, 1.1, al));
        g.corA.visible = d > 3.5; g.corA.material.uniforms.uOp.value = sst(3.5, 8, d);
        if (d > 11) for (let i = 0; i < 14; i++) { const u = hash(i, 1) * TAU, v = hash(i, 2) * 2 - 1; E3.bola(g, w(g.ave, [ac[0] + Math.cos(u) * .8 * Math.sqrt(1 - v * v), ac[1] + v * 1.1, ac[2] + Math.sin(u) * .6]), .06 * sst(11, 16, d), '#F4F2EA', 1.2, g.pecas.ala); }
        ach(g, 'emb', w(g.ave, [es * .3, top + es * .75, .3])); if (cob > .1) ach(g, 'vit', w(g.ave, [ry * .8, yc - ry * .45, ry * .4]));
        if (am > .3) ach(g, 'amn', w(g.ave, [-es * .62, top + es * .4, .3])); if (al > .2) ach(g, 'ala', w(g.ave, [ac[0] + .8, ac[1] + .5, 0])); if (d > 4) ach(g, 'cor', w(g.ave, [-2.3, -1.4, -.2])); ach(g, 'clara', w(g.ave, [-1.4, -2.4, -.4]));
      } else {
        const sw = 2 + S.v / 100 * 10, R = mix(1.1, 3, seg(sw, 2, 12));
        g.corH.scale.setScalar(R);
        // vilosidades: no começo em toda a volta; depois concentradas de um lado (futura placenta)
        const lado = seg(sw, 7, 12);
        for (let i = 0; i < 150; i++) { const u = (() => { const y = 1 - (i + .5) / 150 * 2, r = Math.sqrt(1 - y * y), a = i * 2.39996; return [Math.cos(a) * r, y, Math.sin(a) * r]; })(); if (u[2] > .25) continue; const k = 1 - lado * sst(-.1, -.6, u[0]); if (k < .05) continue; E3.put(g, g.vil, V.mul(u, R * 1.04), E3.qy(g, u), k * R * .22, k * R * .45, k * R * .22, '#9C7FE0', 1, g.pecas.cor); }
        E3.fim(g.vil);
        const ar = mix(.45, .97, seg(sw, 2, 12)) * R, ac = [mix(.25, 0, seg(sw, 2, 12)) * R, mix(.25, 0, seg(sw, 2, 12)) * R, 0];
        g.amnH.position.set(...ac); g.amnH.scale.setScalar(ar);
        const es = mix(.5, 2.4, seg(sw, 2, 12)) * (sw < 3 ? .6 : 1); g.embH.gr.position.set(ac[0], ac[1], 0); g.embH.set(cl(sw * 7, 20, 84), t, es);
        const vr = mix(.45, .3, seg(sw, 3, 12)) * (R > 2 ? 1 : .9), vp = [ac[0] - ar * .3, ac[1] - ar - vr * 1.3, -.2];
        g.vitH.position.set(...vp); g.vitH.scale.setScalar(vr);
        const pa = [R * .95, -R * .05, -.2], pb = [ac[0] + ar * .1, ac[1] - ar * .25, 0], pc = add(V.mul(add(pa, pb), .5), [0, -R * .25, 0]), Pp = [], Pa = [];
        for (let i = 0; i < 12; i++) Pp.push(V.bez(pa, pc, pb, i / 11)); g.ped.set(Pp, mix(.12, .2, seg(sw, 2, 12)));
        if (sw > 2.6) { for (let i = 0; i < 10; i++) Pa.push(add(V.bez(pa, pc, pb, .3 + i / 9 * .6), [0, .04, .05])); g.alaH.set(Pa, .05); } else g.alaH.set([]);
        ach(g, 'emb', w(g.hum, [ac[0] + es * .3, ac[1] + es * .5, .3])); ach(g, 'amn', w(g.hum, [ac[0] - ar * .75, ac[1] + ar * .5, 0])); ach(g, 'cor', w(g.hum, [-R * .85, R * .6, -.2])); ach(g, 'vit', w(g.hum, vp)); if (sw > 2.6) ach(g, 'ala', w(g.hum, V.bez(pa, pc, pb, .6)));
      }
    },
    camera(g, P) { return g.modo === false ? cam(g, P, 3.6, 3.6, { th: .15, al: [0, E3.deitado(g) ? 0 : -.7, 0] }) : cam(g, P, 3.2, 3.8, { th: .25, fi: .1, al: [0, E3.deitado(g) ? 0 : -.8, 0] }); }
  });

  // =====================================================================================
  // O OVO AMNIÓTICO: peixe, anfíbio, réptil e ave, mamífero
  // =====================================================================================
  const GR = [{ l: 'Peixes', tem: [1, 0, 0, 0, 0], agua: true }, { l: 'Anfíbios', tem: [0, 0, 0, 0, 0], agua: true }, { l: 'Répteis e aves', tem: [1, 1, 1, 1, 0], agua: false }, { l: 'Mamíferos placentários', tem: [1, 1, 1, 1, 1], agua: false }];
  const NOMES = ['vesícula vitelínica', 'âmnio', 'córion', 'alantoide', 'placenta'], CORES = [K.vitelo, K.amnio, K.corion, K.alant, K.placenta];
  E3.cena('anexos/amniotico', {
    fit: 24, raio: 10, bolas: 60,
    pecas: Object.assign({ agua: { nome: 'Água', frase: 'Peixes e anfíbios põem ovos na água: sem casca e sem âmnio, o ovo seca em terra firme.', cor: K.agua } }, PEC),
    rotulos: [{ pc: 'amn', t: 'âmnio' }, { pc: 'casca', t: 'casca' }, { pc: 'plac', t: 'placenta' }, { pc: 'agua', t: 'água' }],
    montar(g) {
      const T = g.T, sf = E3.esfera(g, 40); g.pl = E3.corte(g, g.raiz); g.ovos = [];
      const filme = (c, d, o = {}) => E3.filme(g, c, Object.assign({ cor2: '#FFFFFF', dentro: d, base: .1, fr: .6 }, o));
      for (let i = 0; i < 4; i++) {
        const gr = new T.Group(); g.raiz.add(gr); const o = { gr, i };
        if (i < 2) { o.agua = E3.peca(g, E3.capsula(g, 1.75, .1, 24), filme('#4FB4E8', '#0E3550', { base: .14, fr: .4, esc: 2 }), 'agua', gr); o.agua.scale.set(1, 1, .5); o.agua.renderOrder = 6; }
        if (i === 0) { o.casc = E3.peca(g, sf, filme('#D8F0FF', '#20404F'), 'emb', gr); o.casc.scale.setScalar(1.1); o.casc.renderOrder = 5; o.vit = E3.peca(g, sf, E3.fis(g, K.vitelo, { p: { clearcoat: .8, roughness: .35 } }), 'vit', gr); o.vit.scale.setScalar(.62); o.vit.position.y = -.25; }
        if (i === 1) { o.casc = E3.peca(g, sf, filme('#9EDCFF', '#123A50', { base: .08 }), 'agua', gr); o.casc.scale.setScalar(1.15); o.casc.renderOrder = 5; o.vit = E3.peca(g, sf, E3.fis(g, '#6E6A72', { p: { roughness: .5 } }), 'emb', gr); o.vit.scale.setScalar(.6); }
        if (i === 2) {
          o.casc = E3.solido(g, sf, K.casca, [g.pl], { pai: gr, pc: 'casca', corte: '#F6EFE2' }); o.casc.scale.set(1.25, 1.55, 1.25);
          o.cor = E3.peca(g, sf, filme(K.corion, '#2A2040', { planos: [g.pl] }), 'cor', gr); o.cor.scale.set(1.15, 1.45, 1.15); o.cor.renderOrder = 3;
          o.vit = E3.peca(g, sf, E3.fis(g, K.vitelo, { p: { clearcoat: .8, roughness: .35 } }), 'vit', gr); o.vit.scale.setScalar(.62); o.vit.position.set(0, -.45, 0);
          o.amn = E3.peca(g, sf, filme(K.amnio, '#1E4E70'), 'amn', gr); o.amn.scale.set(.5, .38, .4); o.amn.position.set(0, .45, .2); o.amn.renderOrder = 5;
          o.ala = E3.peca(g, sf, filme(K.alant, '#0E4A44'), 'ala', gr); o.ala.scale.set(.42, .5, .35); o.ala.position.set(.6, .55, -.1); o.ala.renderOrder = 5;
        }
        if (i === 3) {
          o.ut = E3.utero(g, { pai: gr, s: .5, pc: 'plac' });
          o.cor = E3.peca(g, sf, filme(K.corion, '#2A2040', { planos: [g.pl] }), 'cor', gr); o.cor.scale.setScalar(.72); o.cor.position.set(0, .1, -.1); o.cor.renderOrder = 3;
          o.amn = E3.peca(g, sf, filme(K.amnio, '#1E4E70'), 'amn', gr); o.amn.scale.setScalar(.5); o.amn.position.set(-.05, .12, -.1); o.amn.renderOrder = 5;
          o.vit = E3.peca(g, sf, E3.fis(g, K.vitelo), 'vit', gr); o.vit.scale.setScalar(.12); o.vit.position.set(-.35, -.45, -.1);
          o.plac = E3.peca(g, E3.lumpy(g, 'plc2', 82, 3, 6, .1, .4, .8), E3.fis(g, K.placenta, { p: { roughness: .6, sheen: .7 } }), 'plac', gr); o.plac.scale.set(.2, .38, .3); o.plac.position.set(.68, .25, -.15);
          o.ala = E3.tubo(g, 10, 6, E3.fis(g, K.alant), gr, 'ala');
        }
        o.emb = E3.corpo(g, { pai: gr, pc: 'emb' });
        g.ovos.push(o);
      }
    },
    animar(g, P) {
      const S = P.S, gi = cl(Math.floor(S.v + 1e-6), 0, 3), larg = E3.deitado(g), t = P.t; g.gi = gi;
      const pos = larg ? [[-6.6, 0], [-2.2, 0], [2.2, 0], [6.6, 0]] : [[-2.1, 2.3], [2.1, 2.3], [-2.1, -2.3], [2.1, -2.3]]; g.pos = pos;
      g.ovos.forEach((o, i) => {
        const on = i === gi, s = (on ? 1.12 : .9) * (larg ? 1 : .92); o.gr.position.set(pos[i][0], pos[i][1], on ? .4 : 0); o.gr.scale.setScalar(s);
        const ep = i === 0 ? [0, .35, .1] : i === 1 ? [0, 0, .62] : i === 2 ? [0, .45, .2] : [-.05, .12, -.1], es = i === 1 ? .45 : i === 3 ? .55 : .5;
        o.emb.gr.position.set(...ep); o.emb.set(i === 1 ? 24 : 34, t, es);
        if (i === 1) { const sol = gi === 2 ? 0 : 0; o.vit.scale.setScalar(.6 - sol); }
        if (i === 3) { const a = [-.05, .05, -.1], b = [.6, .25, -.15], c = [.3, -.15, -.1], Pp = []; for (let k = 0; k < 10; k++) Pp.push(V.bez(a, c, b, k / 9)); o.ala.set(Pp, .035); }
        o.gr.updateMatrixWorld(true);
      });
      const w = (i, p) => E3.mundo(g, g.ovos[i].gr, p);
      if (gi < 2) ach(g, 'agua', w(gi, [1.3, -1.1, .4]));
      if (gi === 2) { ach(g, 'casca', w(2, [1.1, -.9, 0])); ach(g, 'amn', w(2, [-.45, .7, .3])); }
      if (gi === 3) { ach(g, 'plac', w(3, [.75, .45, 0])); ach(g, 'amn', w(3, [-.45, .45, 0])); }
    },
    camera(g, P) { return E3.deitado(g) ? cam(g, P, 8.6, 3.6, { th: .1, fi: .1, al: [0, -.6, 0], viva: .3 }) : cam(g, P, 4.2, 5.6, { th: .1, fi: .1, al: [0, -1.6, 0], viva: .3 }); },
    sobre(g, S) {
      if (!g.pos) return; const gi = g.gi, larg = E3.deitado(g);
      g.pos.forEach((p, i) => { const q = E3.tela(g, [p[0], p[1] - (larg ? 1.8 : 1.75), 0]); tx(GR[i].l, q[0], q[1], { s: NAR ? 12 : 13, w: i === gi ? 700 : 500, c: i === gi ? '#FFB347' : C.dim }); E3.reserva(g, [q[0] - 85, q[1] - 10, 170, 20]); });
      // anexos presentes no grupo escolhido
      const tem = GR[gi].tem, y0 = NAR ? 54 : 74; let x = NAR ? 12 : 28, y = y0;
      NOMES.forEach((s, i) => { X.font = `600 12px ${FT}`; const wd = X.measureText(s).width + 32; if (x + wd > W - 10) { x = NAR ? 12 : 28; y += 30; } rr(x, y, wd, 24, 999, tem[i] ? 'rgba(27,36,64,.92)' : 'rgba(11,15,28,.55)', tem[i] ? CORES[i] : 'rgba(91,108,153,.4)', tem[i] ? 2 : 1); if (tem[i]) circ(x + 12, y + 12, 5, CORES[i]); else line(x + 8, y + 12, x + 16, y + 12, C.dim, 2); X.fillStyle = tem[i] ? C.txt : C.dim; X.textAlign = 'left'; X.textBaseline = 'middle'; X.fillText(s, x + 22, y + 12.5); E3.reserva(g, [x, y, wd, 24]); x += wd + 8; });
      // linha do tempo de 400 a 300 milhões de anos
      const x0 = NAR ? 20 : 60, x1 = W - x0, ty = H - (NAR ? 118 : 106), fx = m => mix(x0, x1, (400 - m) / 100);
      line(x0, ty, x1, ty, C.line, 2);
      for (const m of [400, 375, 350, 325, 300]) { line(fx(m), ty - 4, fx(m), ty + 4, C.line, 1.5); if (m % 50 === 0) tx(String(m), fx(m), ty + 15, { s: 12, c: C.dim, bg: false }); }
      marker(fx(370), ty, K.agua); marker(fx(312), ty, K.casca);
      tx(NAR ? 'saída da água (cerca de 370)' : 'vertebrados saem da água (cerca de 370 milhões de anos)', NAR ? x0 - 8 : fx(370) - 8, ty - 16, { s: 12, c: C.txt, a: 'left' });
      tx(NAR ? '1º ovo amniótico (cerca de 312)' : 'primeiro ovo amniótico (cerca de 312 milhões de anos)', x1 + 8, ty - (NAR ? 34 : 16), { s: 12, c: C.txt, a: 'right' });
      E3.reserva(g, [0, ty - 44, W, 70]);
    }
  });
})();
