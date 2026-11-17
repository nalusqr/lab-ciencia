/* LAB Embriologia: cenas 3D do desenvolvimento humano (Martin). Fecundação na tuba com espermatozoides que nadam e a
   reação acrossômica; descida pela tuba até a nidação no útero, com o gráfico de hCG; placenta em cinco níveis de zoom;
   gêmeos mono e dizigóticos com a separação animada; semana a semana, com o embrião e o feto em escala e a barra da
   gestação. Usa o kit embrio3d.js; a cena 2D antiga fica como plano B sem WebGL. */
'use strict';
(function () {
  const E3 = window.EMB3D; if (!E3) return;
  const { V, K } = E3, { cl, mix, seg, sst, TAU, hash, add, sub, mul, nrm, lerp3 } = V;
  const cam = (g, P, hx, hy, o = {}) => E3.viva({ th: o.th == null ? .15 : o.th, fi: o.fi == null ? .1 : o.fi, d: E3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .6 : o.viva);
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const RD = () => E3.REDUZ();
  const fib = (i, n) => { const y = 1 - (i + .5) / n * 2, r = Math.sqrt(1 - y * y), a = i * 2.39996; return [Math.cos(a) * r, y, Math.sin(a) * r]; };
  const legenda = (g, l1, l2) => { const x = NAR ? 12 : 28, y = NAR ? 58 : 82; tx(l1, x, y, { f: FH, s: NAR ? 16 : 19, w: 600, a: 'left', c: C.txt }); if (l2) tx(l2, x, y + (NAR ? 21 : 25), { s: 13, w: 600, a: 'left', c: C.dim }); E3.reserva(g, [x - 4, y - 14, Math.max(tw(l1, NAR ? 16 : 19, 600, FH), l2 ? tw(l2, 13, 600) : 0) + 12, 48]); };

  // embrião jovem (zigoto, clivagens, mórula, blastocisto) a partir do dia após a fecundação
  function jovem(g, W, p, r, d, o = {}) {
    const n = d < 1.25 ? 1 : d < 2 ? 2 : d < 2.5 ? 4 : d < 3 ? 8 : d < 4 ? 16 : 0;
    if (n) { for (let i = 0; i < n; i++) { const u = n === 1 ? [0, 0, 0] : fib(i, n), rc = r * (n === 1 ? .9 : n === 2 ? .62 : n === 4 ? .52 : n === 8 ? .44 : .36); E3.celula(g, W, add(p, mul(u, r - rc)), rc, i % 3 ? K.ovo : '#D4D9E4', { pc: o.pc }); } return 'cel'; }
    for (let i = 0; i < 40; i++) { const u = fib(i, 40); E3.celula(g, W, add(p, mul(u, r * .92)), r * .24, '#E7B4A4', { f: [1, 1, .6], pc: o.pc }); }
    for (let i = 0; i < 6; i++) { const u = fib(i, 6); E3.celula(g, W, add(p, add([0, r * .55, 0], mul(u, r * .22))), r * .24, '#E8A9A3', { pc: o.pc }); }
    return 'blasto';
  }

  // =====================================================================================
  // FECUNDAÇÃO (24 horas, na ampola da tuba)
  // =====================================================================================
  const fase = h => h < 6 ? 0 : h < 8 ? 1 : h < 10 ? 2 : h < 14 ? 3 : h < 21 ? 4 : 5;
  const FN = ['subida pela tuba e capacitação', 'reação acrossômica', 'bloqueio da polispermia', 'fim da meiose II', 'pronúcleos se aproximam', 'zigoto'];
  E3.cena('humano/fecundacao', {
    fit: 18, raio: 8, bolas: 60,
    pecas: {
      ovo: { nome: 'Ovócito secundário', frase: 'Liberado na ovulação, parado na metáfase II. Só termina a meiose quando um espermatozoide entra.', cor: K.ovo },
      zona: { nome: 'Zona pelúcida', frase: 'Camada de glicoproteínas. Depois que um espermatozoide entra, ela muda e bloqueia a entrada de outros (bloqueio da polispermia).', cor: '#C9D6FF' },
      cor: { nome: 'Corona radiata', frase: 'Células foliculares que saem do ovário junto com o ovócito.', cor: '#D9B48C' },
      esp: { nome: 'Espermatozoides', frase: 'De cerca de 300 milhões lançados, só cerca de 200 chegam à ampola. A enzima do acrossomo abre caminho pela corona e pela zona.', cor: K.esperma },
      tuba: { nome: 'Tuba uterina (ampola)', frase: 'Local mais comum da fecundação; os cílios e as contrações levam o zigoto ao útero.', cor: K.mae },
      pn: { nome: 'Pronúcleos', frase: 'O núcleo do espermatozoide e o do ovócito (n cada) se aproximam; ao se juntarem, o zigoto fica 2n.', cor: K.nucleo },
      pol: { nome: '2º corpúsculo polar', frase: 'Sai quando o ovócito termina a meiose II, logo depois da entrada do espermatozoide.', cor: K.polar }
    },
    rotulos: [{ pc: 'ovo', t: 'ovócito' }, { pc: 'zona', t: 'zona pelúcida' }, { pc: 'cor', t: 'corona radiata' }, { pc: 'esp', t: 'espermatozoides' }, { pc: 'pn', t: 'pronúcleos' }, { pc: 'pol', t: '2º corpúsculo polar' }, { pc: 'tuba', t: 'tuba uterina' }],
    montar(g) {
      const T = g.T; g.pl = E3.corte(g, g.raiz);
      const tub = E3.solido(g, E3.cilindro(g, 48), '#7A3050', [g.pl], { pc: 'tuba', corte: '#4A1A2E', kc: 1, m: { p: { roughness: .7, sheen: .8, sheenColor: new T.Color('#FFC6D6') } } }); tub.rotation.z = Math.PI / 2; tub.scale.set(4.6, 30, 4.6); tub.userData.bk.material.side = T.DoubleSide; tub.userData.fr.material.side = T.BackSide;
      g.cil = E3.inst(g, E3.capsula(g, .05, .15, 6), E3.fis(g, '#E89AB4', { p: { roughness: .6 } }), 220);
      g.ov = E3.ovocito(g, { pc: 'ovo', pcZ: 'zona', corona: true, pcC: 'cor' }); g.ov.gr.scale.setScalar(1.55);
      g.ov.cel.material.transparent = true; g.ov.cel.material.depthWrite = false; g.ov.cel.renderOrder = 3;
      g.esp = E3.espermas(g, 12, { pc: 'esp' });
      g.W = E3.celulas(g, 4, { nucleo: false });
    },
    animar(g, P) {
      const S = P.S, h = S.v, f = fase(h), t = P.t, R = 1.55; g.f = f;
      // cílios na parede de trás da tuba
      for (let i = 0; i < 200; i++) { const x = -14 + (i % 40) * .7, a = Math.PI + .25 + Math.floor(i / 40) * .6, b = RD() ? 0 : Math.sin(t * 6 + i * .6) * .25; E3.put(g, g.cil, [x, Math.cos(a) * 4.45, Math.sin(a) * 4.45], E3.qy(g, [-Math.cos(a) + b, -Math.cos(a) * .2 - .4, -Math.sin(a)]), 1, 1, 1, '#E89AB4', .9); }
      E3.fim(g.cil);
      const zonaGlow = f >= 2 ? sst(8, 9, h) : 0; g.ov.zona.material.uniforms.uC.value.set(zonaGlow > 0 ? '#9FE3C6' : '#C9D6FF');
      g.ov.set(t, { n: 46, a: 1 - sst(10, 20, h) * .6 });
      g.ov.cel.material.opacity = mix(1, .5, sst(9, 11, h));
      // espermatozoides: chegam, fazem a reação acrossômica; só um entra
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * TAU * .62 + 2.1, alvo = [Math.cos(ang) * R * 1.6, Math.sin(ang) * R * 1.6, (hash(i, 3) - .5) * 1.2];
        const ini = [-12 - hash(i, 1) * 4, (hash(i, 2) - .5) * 5, (hash(i, 4) - .5) * 2], k = sst(0, 6, h + hash(i, 5) * .8);
        let p = lerp3(ini, alvo, k), dir = nrm(sub(mul(alvo, .3), p));
        if (i === 0) { const ent = sst(8, 9.5, h); p = lerp3(p, mul(nrm(alvo), R * .9), ent); if (h > 9.6) { g.esp.pos(i, p, dir, t, 0); continue; } }
        else if (f >= 2) { const bk = sst(8, 12, h); p = add(p, mul(nrm(alvo), bk * .6)); }
        g.esp.pos(i, p, dir, t + i, .9, { acro: f >= 1 ? 1 - sst(6, 8, h) : 1, amp: f >= 2 && i ? .4 : 1 });
        if (f === 1 && !RD()) E3.brilho(g, add(p, mul(dir, .35)), .1 * Math.sin(seg(h, 6, 8) * Math.PI), '#7FD1A8', 1.6);
      }
      // pronúcleos e corpúsculo polar
      const pn = sst(10, 12, h), ap = sst(14, 21, h), fu = sst(21, 23, h);
      if (pn > 0) {
        const a = lerp3([R * -.55, R * .25, .1], [-.12, 0, .1], ap), b = lerp3([R * .45, -R * .2, .1], [.12, 0, .1], ap);
        if (fu < 1) { E3.bola(g, a, .32 * pn * (1 - fu * .4), '#7FA8FF', 1, g.pecas.pn); E3.bola(g, b, .32 * pn * (1 - fu * .4), '#FF9EC4', 1, g.pecas.pn); }
        if (fu > 0) E3.bola(g, [0, 0, .12], .42 * fu, K.nucleo, 1.1, g.pecas.pn);
        ach(g, 'pn', [0, 0, .5]);
      }
      const pol = sst(10, 13, h); if (pol > 0) { E3.celula(g, g.W, [R * .75, R * .8, .3], .32 * pol, K.polar, { pc: g.pecas.pol }); ach(g, 'pol', [R * .9, R * .95, .3]); }
      E3.fimCel(g.W);
      ach(g, 'ovo', [-R * .6, -R * .7, .6]); ach(g, 'zona', [R * .95, -R * .9, 0]); if (h < 18) ach(g, 'cor', [-R * 1.2, R * 1.4, 0]); if (h < 9) ach(g, 'esp', h < 4 ? lerp3([-14, 0, 0], [-4, 0, 0], h / 4) : [-R * 1.8, .4, 0]); ach(g, 'tuba', [8, 3.4, -1.5]);
    },
    camera(g, P) { const h = P.S.v; return cam(g, P, h < 5 ? 7 : 3.6, h < 5 ? 3.6 : 3.4, { th: .2, fi: .12, al: [h < 5 ? -3 : 0, 0, 0] }); },
    sobre(g, S) { legenda(g, FN[g.f || 0], S.cromo ? `espermatozoide sorteado com cromossomo ${S.cromo}: zigoto ${S.cromo === 'X' ? 'XX' : 'XY'}` : null); }
  });

  // =====================================================================================
  // NIDAÇÃO (dias 0 a 28): descida pela tuba, implantação e hCG
  // =====================================================================================
  const hcg = (d, k = 1) => d < 6.5 ? 0 : Math.max(1, 2.4 * k * Math.pow(2, (d - 6.5) / 2.2));
  E3.cena('humano/nidacao', {
    fit: 20, raio: 9, bolas: 80,
    pecas: {
      ute: { nome: 'Útero', frase: 'Parede muscular (miométrio) com o endométrio por dentro, preparado pela progesterona.', cor: K.mae },
      end: { nome: 'Endométrio', frase: 'Camada interna, rica em vasos e glândulas. O blastocisto começa a se implantar nele por volta do 6º ou 7º dia, e a nidação se completa por volta do 10º. Sem gravidez, ele descama: é a menstruação.', cor: K.endom },
      tuba: { nome: 'Tuba uterina', frase: 'A fecundação acontece na ampola; o embrião leva cerca de 4 dias para descer até o útero.', cor: K.mae },
      ova: { nome: 'Ovário', frase: 'Libera o ovócito na ovulação. O corpo-lúteo que fica no lugar produz progesterona.', cor: '#E9B9A8' },
      emb: { nome: 'Embrião', frase: 'Zigoto, clivagens, mórula e blastocisto, que perde a zona pelúcida e se implanta.', cor: K.ovo }
    },
    rotulos: [{ pc: 'tuba', t: 'tuba uterina' }, { pc: 'end', t: 'endométrio' }, { pc: 'ova', t: 'ovário' }, { pc: 'emb', t: 'embrião' }, { pc: 'ute', t: 'útero' }],
    montar(g) {
      const T = g.T; g.ut = E3.utero(g, { s: 1.25, pc: 'ute', pcE: 'end' });
      const mT = E3.fis(g, K.mae, { p: { transparent: true, opacity: .42, depthWrite: false, roughness: .5 } });
      g.tubas = [-1, 1].map(k => { const tb = E3.tubo(g, 24, 12, mT, null, 'tuba'), P = []; for (let i = 0; i < 24; i++) { const u = i / 23; P.push([k * mix(1.95, 4.9, u), 1.55 + Math.sin(u * Math.PI) * .9 - u * 1.2, -.3]); } tb.set(P, (i, n) => mix(.16, .34, i / n)); tb.mesh.renderOrder = 4; return P; });
      g.ovs = [-1, 1].map(k => { const o = E3.peca(g, E3.lumpy(g, 'ova', 44, 3, 6, .08, .4, .8), E3.fis(g, '#E9B9A8', { p: { roughness: .6, sheen: .6 } }), 'ova'); o.position.set(k * 4.4, -.25, -.3); o.scale.set(.75, .5, .45); return o; });
      g.W = E3.celulas(g, 60, {});
      g.zona = E3.peca(g, E3.esfera(g, 32), E3.filme(g, '#C9D6FF', { cor2: '#FFFFFF', dentro: '#3B4A7A', base: .05, fr: .55, esc: 3 }), 'emb'); g.zona.renderOrder = 5;
    },
    animar(g, P) {
      const S = P.S, d = S.v, cen = S.cen || null, Pt = g.tubas[1]; g.d = d; g.cen = cen;
      const fecunda = cen !== 'sem', r = .2;
      // caminho: ampola (dia 0) pela tuba até o útero (dia 4), flutua (dia 4 a 6) e se implanta na parede de trás
      const ampola = Pt[15], corno = Pt[0], sitio = [.45, .75, -.5], ect = Pt[10];
      let p;
      if (d < 4) { const u = 1 - (15 * seg(d, 0, 4)) / 15; p = V.trilha(Pt.slice(0, 16).reverse(), seg(d, 0, 4)); p = [p[0], p[1], p[2]]; }
      else if (cen === 'ect') p = Pt[6];
      else p = lerp3(add(corno, [-.4, -.2, 0]), sitio, sst(4, 6.5, d));
      if (cen === 'ect' && d >= 2.5) p = lerp3(V.trilha(Pt.slice(0, 16).reverse(), seg(2.5, 0, 4)), Pt[6], sst(2.5, 6, d));
      const imp = cen === 'ect' ? 0 : sst(6.5, 10, d), cres = 1 + 1.6 * seg(d, 10, 28);
      const vivo = fecunda && !(cen === 'ect' && d > 14 && false);
      g.zona.visible = fecunda ? d < 5.5 : d < 2;
      if (vivo) {
        const pp = imp > 0 ? add(p, [0, 0, -imp * .38]) : p, rr = r * (d < 5 ? 1 : cres);
        if (d < 10) jovem(g, g.W, pp, rr, d, { pc: g.pecas.emb });
        else { for (let i = 0; i < 36; i++) { const u = fib(i, 36); if (u[2] > .5) continue; E3.celula(g, g.W, add(pp, mul(u, rr * .95)), rr * .3, i % 2 ? '#B79BFF' : '#E7B4A4', { pc: g.pecas.emb }); } }
        g.zona.position.set(...pp); g.zona.scale.setScalar(rr * 1.25); ach(g, 'emb', add(pp, [.25, .25, .2]));
      } else if (d < 3) { E3.celula(g, g.W, p, r * (1 - seg(d, 1, 3) * .5), '#B0B6C4', { pc: g.pecas.emb }); g.zona.position.set(...p); g.zona.scale.setScalar(r * 1.25); }
      E3.fimCel(g.W);
      // sem gravidez: o endométrio descama por volta do 14º dia depois da ovulação
      const desc = cen === 'sem' ? sst(13, 15, d) * (1 - sst(19, 24, d)) : 0;
      g.ut.end.scale.setScalar(1 - desc * .06);
      if (desc > .02 && !RD()) for (let i = 0; i < 26; i++) { const u = V.fr(P.t * .25 + hash(i, 1)); E3.bola(g, [(hash(i, 2) - .5) * .8, mix(0, -3.6, u), -.2], .07 * desc, K.sangue, 1); }
      if (d < 4 || cen === 'ect' || E3.deitado(g)) ach(g, 'tuba', Pt[18]); ach(g, 'ova', [4.4, -.75, 0]); ach(g, 'end', [-1.6, -.4, 0]); ach(g, 'ute', [-2.4, -2.3, 0]);
    },
    camera(g, P) { return E3.deitado(g) ? cam(g, P, 7.4, 3.6, { th: .05, fi: .08, al: [-2.1, -.3, 0], viva: .3 }) : cam(g, P, 5.2, 4.6, { th: .05, fi: .08, al: [0, 1.4, 0], viva: .3 }); },
    sobre(g, S) {
      const d = g.d || 0, cen = g.cen, k = cen === 'sem' ? 0 : cen === 'ect' ? .6 : 1, larg = E3.deitado(g);
      const gw = larg ? 300 : W - 40, gh = larg ? 120 : 92, x0 = larg ? 28 + 34 : 20 + 34, y0 = larg ? 78 : 58, Gr = { x0, y0, w: gw - 34, h: gh, x1: x0 + gw - 34, y1: y0 + gh };
      const ym = 260, G = graph(Gr, { x0: 0, x1: 28, y0: 0, y1: ym, xl: 'dias após a fecundação', yl: 'hCG', xt: [[0, '0'], [7, '7'], [14, '14'], [21, '21'], [28, '28']], curves: k ? [{ f: x => Math.min(ym, hcg(x, k)), c: K.hcg }] : [{ f: () => 0, c: K.hcg }] });
      line(Gr.x0, G.fy(25), Gr.x1, G.fy(25), 'rgba(232,237,247,.5)', 1, [4, 4]); if (larg) tx('limite do teste (25 mUI/mL)', Gr.x1 - 4, G.fy(25) - 9, { s: 12, a: 'right', c: C.dim, bg: false });
      marker(G.fx(d), G.fy(Math.min(ym, k ? hcg(d, k) : 0)), K.hcg);
      const pos = k && hcg(d, k) >= 25, tyy = Gr.y1 + 54; rr(x0, tyy - 11, 120, 22, 6, 'rgba(240,240,240,.92)'); rr(x0 + 70, tyy - 6, 4, 12, 1, '#C2185B'); if (pos) rr(x0 + 86, tyy - 6, 4, 12, 1, '#C2185B');
      tx(pos ? 'teste positivo' : 'teste negativo', x0 + 130, tyy, { s: 13, w: 600, a: 'left', c: pos ? C.txt : C.dim });
      E3.reserva(g, [x0 - 40, y0 - 10, gw + 30, gh + 80]);
    }
  });

  // =====================================================================================
  // PLACENTA (zoom em cinco níveis)
  // =====================================================================================
  const NIV = ['útero', 'placenta', 'vilosidade', 'membrana', 'cordão'];
  const SUB = [['O₂', '#FF6B6B', 1], ['glicose', '#FFE1A6', 1], ['CO₂', '#9AA3B2', -1], ['ureia', '#E9E2B0', -1], ['anticorpos IgG', '#8FD8FF', 1], ['álcool', '#FF8A3D', 1], ['vírus da rubéola', '#FF8A3D', 1], ['hemácia', '#C2283A', 0]];
  const subAt = S => S.pick != null ? S.pick : Math.floor(S.ph / 3.5) % SUB.length;
  E3.cena('humano/placenta', {
    fit: 20, raio: 9, bolas: 200,
    pecas: {
      ute: { nome: 'Útero', frase: 'O feto fica no âmnio, ligado à placenta pelo cordão umbilical.', cor: K.mae },
      plac: { nome: 'Placenta', frase: 'Formada pelo córion (parte fetal) e pelo endométrio (parte materna). Faz trocas, produz hormônios (hCG, progesterona) e protege em parte.', cor: K.placenta },
      cord: { nome: 'Cordão umbilical', frase: 'Duas artérias levam sangue do feto para a placenta; uma veia traz sangue oxigenado e nutrientes.', cor: K.alant },
      amn: { nome: 'Âmnio', frase: 'Bolsa com líquido amniótico em volta do feto.', cor: K.amnio },
      vil: { nome: 'Vilosidades coriônicas', frase: 'Ramos do córion com capilares do feto, mergulhados no sangue da mãe.', cor: K.corion },
      mae: { nome: 'Sangue materno', frase: 'Banha as vilosidades; o sangue da mãe e o do feto nunca se misturam.', cor: K.sangue },
      cap: { nome: 'Capilar do feto', frase: 'Vaso do feto dentro da vilosidade: por ele corre o sangue do feto, separado do sangue da mãe pela membrana placentária.', cor: K.sangueF },
      mem: { nome: 'Membrana placentária', frase: 'Separa os dois sangues. Passam O₂, nutrientes, CO₂, ureia, anticorpos IgG e também álcool, drogas e alguns vírus.', cor: K.corion },
      art: { nome: 'Artérias umbilicais', frase: 'Levam sangue pobre em O₂ do feto para a placenta.', cor: K.artUmb },
      vei: { nome: 'Veia umbilical', frase: 'Leva sangue rico em O₂ e nutrientes da placenta para o feto.', cor: K.veiaUmb },
      feto: { nome: 'Feto', frase: 'Recebe tudo pela placenta e pelo cordão.', cor: K.pele }
    },
    rotulos: [{ pc: 'plac', t: 'placenta' }, { pc: 'cord', t: 'cordão umbilical' }, { pc: 'amn', t: 'âmnio' }, { pc: 'vil', t: 'vilosidade' }, { pc: 'cap', t: 'capilar do feto' }, { pc: 'mae', t: 'sangue materno' }, { pc: 'mem', t: 'membrana placentária' }, { pc: 'art', t: 'artérias umbilicais' }, { pc: 'vei', t: 'veia umbilical' }],
    montar(g) {
      const T = g.T, sf = E3.esfera(g, 40); g.N = [0, 1, 2, 3, 4].map(() => { const gr = new T.Group(); g.raiz.add(gr); return gr; });
      // 0: útero com o feto
      g.ut = E3.utero(g, { pai: g.N[0], s: 1.5, pc: 'ute', fundo: .35 });
      g.amn = E3.peca(g, sf, E3.filme(g, K.amnio, { cor2: '#FFFFFF', dentro: '#1E4E70', base: .1, fr: .55 }), 'amn', g.N[0]); g.amn.scale.set(1.75, 2.1, .72); g.amn.position.set(0, .15, -.35); g.amn.renderOrder = 5;
      g.feto = E3.corpo(g, { pai: g.N[0], pc: 'feto' }); g.feto.gr.position.set(-.1, .1, -.35);
      g.pl0 = E3.peca(g, E3.lumpy(g, 'plp', 83, 3, 7, .08, .4, .8), E3.fis(g, K.placenta, { p: { roughness: .6, sheen: .7 } }), 'plac', g.N[0]); g.pl0.position.set(1.55, 1.3, -.4); g.pl0.scale.set(.45, 1, .55); g.pl0.rotation.z = -.5;
      g.cd0 = E3.tubo(g, 20, 8, E3.fis(g, '#BFE6E0', { p: { roughness: .35 } }), g.N[0], 'cord');
      // 1: placenta de perto (disco com cotilédones, cordão no centro)
      const disco = E3.peca(g, E3.lumpy(g, 'pld', 84, 4, 14, .06, .3, .6), E3.fis(g, K.placenta, { p: { roughness: .55, sheen: .8, sheenColor: new T.Color('#FFB0C0') } }), 'plac', g.N[1]); disco.scale.set(3.2, .9, 3.2);
      g.cd1 = E3.tubo(g, 20, 10, E3.fis(g, '#BFE6E0', { p: { roughness: .35 } }), g.N[1], 'cord');
      g.vasos1 = [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const tb = E3.tubo(g, 10, 6, E3.fis(g, i % 3 ? K.artUmb : K.veiaUmb), g.N[1], i % 3 ? 'art' : 'vei'), P = [], a = i / 8 * TAU; for (let k = 0; k < 10; k++) { const u = k / 9; P.push([Math.cos(a + u * .4) * u * 2.6, .85 - u * u * .2, Math.sin(a + u * .4) * u * 2.6]); } tb.set(P, (k, n) => .09 * (1 - k / n * .6)); return tb; });
      // 2: vilosidade (árvore) no lago de sangue materno
      g.vt = []; const ramo = (a, d, n) => { const b = add(a, d), Pp = [a, lerp3(a, b, .5).map((v, i) => v + (i === 0 ? .1 : 0)), b], tb = E3.tubo(g, 3, 10, E3.fis(g, '#B79BFF', { p: { roughness: .4, clearcoat: .6 }, rimK: .5 }), g.N[2], 'vil'); tb.set(Pp, .22 * n + .08); g.vt.push(tb); if (n > .4) { ramo(b, [d[0] * .6 + .5, d[1] * .7, d[2] * .6 + .2], n * .7); ramo(b, [d[0] * .6 - .5, d[1] * .7, d[2] * .6 - .2], n * .7); } };
      ramo([0, 2.6, 0], [0, -1.2, 0], 1);
      // 3: membrana: capilar do feto dentro da vilosidade, sangue da mãe em volta
      g.vil3 = E3.peca(g, E3.capsula(g, 1.4, 2.6, 32), E3.filme(g, '#B79BFF', { cor2: '#FFFFFF', dentro: '#2A2040', base: .2, fr: .6 }), 'mem', g.N[3]); g.vil3.rotation.z = Math.PI / 2; g.vil3.renderOrder = 5;
      g.cap3 = E3.peca(g, E3.capsula(g, .55, 3.2, 24), E3.filme(g, K.sangueF, { cor2: '#FFC0C0', dentro: '#5A1018', base: .25, fr: .55 }), 'cap', g.N[3]); g.cap3.rotation.z = Math.PI / 2; g.cap3.renderOrder = 6;
      // 4: cordão (duas artérias e uma veia em hélice, geleia em volta)
      g.gel = E3.peca(g, E3.cilindro(g, 40), E3.filme(g, '#DDF3EE', { cor2: '#FFFFFF', dentro: '#3C5E58', base: .12, fr: .6 }), 'cord', g.N[4]); g.gel.rotation.z = Math.PI / 2; g.gel.scale.set(1.25, 9, 1.25); g.gel.renderOrder = 5;
      g.hel = [K.artUmb, K.artUmb, K.veiaUmb].map((c, i) => { const tb = E3.tubo(g, 60, 12, E3.fis(g, c, { p: { roughness: .35, clearcoat: .7 } }), g.N[4], i < 2 ? 'art' : 'vei'), P = []; for (let k = 0; k < 60; k++) { const u = k / 59, x = mix(-4.4, 4.4, u), a = u * TAU * 2.2 + i * TAU / 3; P.push([x, Math.cos(a) * .62, Math.sin(a) * .62]); } tb.set(P, i < 2 ? .3 : .42); return tb; });
    },
    animar(g, P) {
      const S = P.S, n = cl(Math.round(S.v), 0, 4), t = P.t; g.n = n; g.N.forEach((gr, i) => { gr.visible = i === n; });
      const w = p => E3.mundo(g, g.N[n], p);
      if (n === 0) {
        g.feto.set(150, t, 2.2); g.feto.gr.rotation.set(0, 0, Math.PI * .05);
        const a = [-.25, -.1, -.3], b = [1.35, 1.2, -.4], c = [1.1, -.5, -.3], Pp = []; for (let i = 0; i < 20; i++) { const u = i / 19, q = V.bez(a, c, b, u); Pp.push([q[0], q[1] + Math.sin(u * 14) * .05, q[2] + Math.cos(u * 14) * .05]); } g.cd0.set(Pp, .07);
        ach(g, 'plac', w([1.8, 1.6, -.2])); ach(g, 'cord', w([1.1, -.35, -.2])); ach(g, 'amn', w([-1.5, 1.1, -.2])); ach(g, 'feto', w([-.6, -.6, 0]));
      } else if (n === 1) {
        const Pp = []; for (let i = 0; i < 20; i++) { const u = i / 19; Pp.push([Math.sin(u * 9) * .12, .85 + u * 3.2, Math.cos(u * 9) * .12]); } g.cd1.set(Pp, .32);
        ach(g, 'plac', w([2.4, .4, 1])); ach(g, 'cord', w([.3, 3, 0])); ach(g, 'art', w([1.5, .9, 1.2])); ach(g, 'vei', w([-1.2, .95, -1.2]));
      } else if (n === 2) {
        if (!RD()) for (let i = 0; i < 60; i++) { const u = V.fr(t * .08 + hash(i, 1)), x = mix(-3.6, 3.6, u), y = mix(-2.4, 1.6, hash(i, 2)), z = (hash(i, 3) - .5) * 3; E3.bola(g, w([x, y, z]), .12, '#B0263A', 1, g.pecas.mae); }
        ach(g, 'vil', w([.6, .8, 0])); ach(g, 'mae', w([-2.6, -1.6, 0]));
      } else if (n === 3) {
        const si = subAt(S), s = SUB[si]; g.si = si;
        for (let i = 0; i < 14; i++) { const u = V.fr(t * .22 + i / 14), yb = 1.9 + hash(i, 2) * .8, x = mix(-3.2, 3.2, hash(i, 1)), z = (hash(i, 3) - .5) * 1.4;
          let y = s[2] > 0 ? mix(yb, 0, u) : s[2] < 0 ? mix(0, yb, u) : yb + Math.sin(u * TAU) * .25;
          if (s[2] === 0 && i % 2) y = Math.sin(u * TAU + i) * .2;
          E3.bola(g, w([x, i % 2 && s[2] === 0 ? y : (i % 2 ? -y : y), z]), s[0] === 'hemácia' ? .2 : .13, s[1], 1.2, g.pecas.mem); }
        if (!RD()) for (let i = 0; i < 10; i++) { const u = V.fr(t * .15 + hash(i, 4)); E3.bola(g, w([mix(-3.4, 3.4, u), 2.4 + hash(i, 5) * .4, (hash(i, 6) - .5) * 1.2]), .18, '#B0263A', .9, g.pecas.mae); }
        ach(g, 'mem', w([-2.4, 1.35, 0])); ach(g, 'cap', w([1.8, .3, .4])); ach(g, 'mae', w([2.6, 2.6, 0]));
      } else {
        ach(g, 'art', w([-2.5, .6, .5])); ach(g, 'vei', w([2, -.6, .5])); ach(g, 'cord', w([0, 1.3, 0]));
      }
    },
    camera(g, P) { const n = g.n || 0, L = E3.deitado(g); const f = [[3.2, 4.2, -.2], [3.6, 2.6, .8], [3.8, 3, 0], [3.8, 2.8, .8], [4.8, 1.8, 0]][n]; return cam(g, P, f[0], f[1] + (L ? 0 : .8), { th: n === 1 ? .1 : .2, fi: n === 1 ? .55 : .12, al: [0, f[2] + (L ? 0 : -.2), 0], viva: .5 }); },
    sobre(g, S) {
      const n = g.n || 0;
      if (n === 3) { const s = SUB[g.si || 0]; legenda(g, s[0], s[2] > 0 ? 'passa da mãe para o feto' : s[2] < 0 ? 'passa do feto para a mãe' : 'não atravessa a membrana'); if (!NAR) { const q = E3.tela(g, E3.mundo(g, g.N[3], [-3.6, 2.5, 0])); tx('sangue da mãe', q[0], q[1], { s: 12, a: 'left', c: C.dim }); const q2 = E3.tela(g, E3.mundo(g, g.N[3], [-3.6, -.1, 0])); tx('sangue do feto', q2[0], q2[1], { s: 12, a: 'left', c: C.dim }); } }
      else legenda(g, ['Útero', 'Placenta', 'Vilosidade', 'Membrana', 'Cordão umbilical'][n], null);
    }
  });

  // =====================================================================================
  // GÊMEOS: monozigóticos (um zigoto se divide) e dizigóticos (dois zigotos)
  // =====================================================================================
  const TIPOG = d => d <= 3 ? 0 : d <= 8 ? 1 : d <= 12 ? 2 : 3;
  const MONO = [['2 córions e 2 âmnios', 'cerca de 1/3 dos monozigóticos'], ['1 córion e 2 âmnios', 'cerca de 2/3: o caso mais comum'], ['1 córion e 1 âmnio', 'cerca de 1% dos casos'], ['gêmeos unidos', 'separação incompleta (siameses)']];
  const ZA = '#F2C6A0', ZB = '#A8D8A0';
  E3.cena('humano/gemeos', {
    fit: 20, raio: 9, bolas: 20,
    pecas: {
      mz: { nome: 'Gêmeos monozigóticos', frase: 'Um só zigoto que se separa: mesmo material genético e sempre o mesmo sexo. Os anexos dependem de quando a separação acontece.', cor: ZA },
      dz: { nome: 'Gêmeos dizigóticos', frase: 'Dois ovócitos fecundados por dois espermatozoides: genes diferentes, como irmãos comuns; sempre 2 córions e 2 âmnios.', cor: ZB },
      cor: { nome: 'Córion', frase: 'Membrana externa que forma a parte fetal da placenta.', cor: K.corion },
      amn: { nome: 'Âmnio', frase: 'Bolsa com líquido em volta de cada embrião (ou dos dois, se separaram tarde).', cor: K.amnio }
    },
    rotulos: [{ pc: 'mz', t: 'monozigóticos' }, { pc: 'dz', t: 'dizigóticos' }, { pc: 'cor', t: 'córion' }, { pc: 'amn', t: 'âmnio' }],
    montar(g) {
      const T = g.T, sf = E3.esfera(g, 48), fl = (c, d) => E3.filme(g, c, { cor2: '#FFFFFF', dentro: d, base: .08, fr: .6 });
      g.mk = (gr, pc) => ({ cor: [0, 1].map(() => { const m = E3.peca(g, sf, fl(K.corion, '#2A2040'), 'cor', gr); m.renderOrder = 4; return m; }), amn: [0, 1].map(() => { const m = E3.peca(g, sf, fl(K.amnio, '#1E4E70'), 'amn', gr); m.renderOrder = 5; return m; }), emb: [0, 1].map(i => E3.corpo(g, { pai: gr, pc, cor: pc === 'dz' && i ? ZB : ZA })) });
      g.gM = new T.Group(); g.gD = new T.Group(); g.raiz.add(g.gM, g.gD); g.M = g.mk(g.gM, 'mz'); g.D = g.mk(g.gD, 'dz');
    },
    animar(g, P) {
      const S = P.S, d = Math.round(S.v), tp = g.T && P.tp, k = RD() ? 1 : sst(0, 1.6, tp), ti = TIPOG(d), t = P.t, larg = E3.deitado(g); g.ti = ti;
      g.gM.position.set(larg ? -3.4 : 0, larg ? 0 : 2.9, 0); g.gD.position.set(larg ? 3.4 : 0, larg ? 0 : -2.9, 0);
      const arr = (G, sep, uni, cA, cB, umAmn, umCor) => {
        const dx = mix(0, 1.15, sep);
        G.emb.forEach((e, i) => { const sg = i ? 1 : -1; e.gr.position.set(sg * dx * (uni ? .35 : 1), -.1, 0); e.gr.rotation.set(0, 0, sg * (uni ? .25 : .1)); e.gr.scale.set(sg, 1, 1); e.set(42, t, 1.1); });
        G.cor[0].visible = true; G.cor[1].visible = !umCor;
        if (umCor) { G.cor[0].position.set(0, 0, 0); G.cor[0].scale.set(2.25, 1.55, 1.3); } else G.cor.forEach((c, i) => { c.position.set((i ? 1 : -1) * mix(.1, 1.15, sep), 0, 0); c.scale.set(1.08, 1.2, 1.05); });
        G.amn[1].visible = !umAmn;
        if (umAmn) { G.amn[0].position.set(0, -.05, 0); G.amn[0].scale.set(1.5 * (uni ? .8 : 1), 1, .9); } else G.amn.forEach((c, i) => { c.position.set((i ? 1 : -1) * dx, -.05, 0); c.scale.set(.8, .95, .8); });
      };
      // monozigóticos: a separação cai no estágio escolhido; dizigóticos: sempre tudo duplo
      arr(g.M, k, ti === 3, ZA, ZA, ti >= 2, ti >= 1); arr(g.D, 1, false, ZA, ZB, false, false);
      g.M.emb.forEach(e => { e.gr.visible = true; }); g.D.emb.forEach(e => { e.gr.visible = true; });
      g.gM.updateMatrixWorld(true); g.gD.updateMatrixWorld(true);
      ach(g, 'mz', E3.mundo(g, g.gM, [0, 1.75, 0])); ach(g, 'dz', E3.mundo(g, g.gD, [0, 1.75, 0])); ach(g, 'cor', E3.mundo(g, g.gD, [-2.1, -.9, 0])); ach(g, 'amn', E3.mundo(g, g.gM, [ti >= 2 ? -1.1 : -1.9, -.75, .4]));
    },
    camera(g, P) { return E3.deitado(g) ? cam(g, P, 6.6, 3.1, { th: .12, al: [0, .45, 0], viva: .4 }) : cam(g, P, 2.9, 6.4, { th: .12, al: [0, -.2, 0], viva: .4 }); },
    sobre(g, S) { const m = MONO[g.ti || 0]; legenda(g, 'Monozigóticos: ' + m[0], m[1]); }
  });

  // =====================================================================================
  // SEMANA A SEMANA (em escala, com um objeto do dia a dia ao lado)
  // =====================================================================================
  const TAM = [[1, .1], [2, .2], [3, 2], [4, 5], [5, 7], [7, 22], [8, 30], [12, 87], [16, 140], [20, 190], [24, 230], [28, 270], [32, 300], [38, 360]];
  const MAS = [[12, 45], [16, 200], [20, 460], [24, 820], [28, 1300], [32, 2100], [38, 3400]];
  const interp = (T, w) => { if (w <= T[0][0]) return T[0][1]; for (let i = 1; i < T.length; i++) if (w <= T[i][0]) { const [a, va] = T[i - 1], [b, vb] = T[i]; return Math.exp(mix(Math.log(va), Math.log(vb), (w - a) / (b - a))); } return T[T.length - 1][1]; };
  const arred = v => v < 10 ? nbr(v, v < 1 ? 1 : 0) : v < 100 ? nbr(Math.round(v)) : nbr(Math.round(v / 10) * 10);
  const OBJ = [{ ate: 5, n: 'grão de arroz', mm: 6 }, { ate: 9, n: 'uva', mm: 22 }, { ate: 15, n: 'limão', mm: 60 }, { ate: 28, n: 'banana', mm: 190 }, { ate: 99, n: 'melancia pequena', mm: 240 }];
  E3.cena('humano/semanas', {
    fit: 20, raio: 9, bolas: 10,
    pecas: {
      emb: { nome: 'Embrião ou feto', frase: 'Até a 8ª semana após a fecundação é embrião; depois, feto. O tamanho é o comprimento do topo da cabeça às nádegas.', cor: K.pele },
      obj: { nome: 'Para comparar', frase: 'Um objeto do dia a dia na mesma escala.', cor: '#E8D84A' }
    },
    rotulos: [{ pc: 'emb', t: 'embrião' }, { pc: 'obj', t: 'comparação' }],
    montar(g) {
      const T = g.T, sf = E3.esfera(g, 40);
      g.c = E3.corpo(g, { pc: 'emb' }); g.W = E3.celulas(g, 50, {});
      const m = (geo, c, o) => { const x = E3.peca(g, geo, E3.fis(g, c, { p: Object.assign({ roughness: .4, clearcoat: .6 }, o || {}) }), 'obj'); x.visible = false; return x; };
      g.ob = [m(E3.capsula(g, .5, .9, 16), '#F4F1E6'), m(sf, '#7FB25A'), m(E3.lumpy(g, 'lim', 91, 3, 8, .03, .3, .5), '#E8D84A', { roughness: .65 }), null, m(sf, '#3E8E4A', { roughness: .5 })];
      g.ban = E3.tubo(g, 24, 14, E3.fis(g, '#F2D24B', { p: { roughness: .55 } }), null, 'obj');
    },
    animar(g, P) {
      const S = P.S, w = Math.round(S.v), mm = interp(TAM, w), cm = mm / 10, t = P.t, d = w * 7; g.w = w; g.mm = mm;
      const oi = OBJ.findIndex(o => w <= o.ate), O = OBJ[oi], oc = O.mm / 10, L = Math.max(cm, oc), larg = E3.deitado(g);
      g.L = L; g.c.gr.visible = w >= 3;
      if (w >= 3) { g.c.set(Math.min(266, Math.max(20, d)), t, cm * 1.05); g.c.gr.position.set(larg ? -L * .7 : 0, larg ? 0 : L * .7, 0); }
      else jovem(g, g.W, [larg ? -L * .7 : 0, larg ? 0 : L * .7, 0], cm * .5, w === 1 ? 5 : 6, { pc: g.pecas.emb });
      E3.fimCel(g.W);
      const tt = w > 8 ? 'feto' : 'embrião', RM = g.M;
      if (g.tt !== tt && RM.rotEls && RM.rotEls[0]) { const el = RM.rotEls[0].querySelector('.t'); if (el && el.lastChild) el.lastChild.nodeValue = tt; RM.rotEls[0].setAttribute('aria-label', tt + ': ver detalhe'); RM.rotulos[0].texto = tt; g.tt = tt; }
      const op = larg ? [L * .75, 0, 0] : [0, -L * .75, 0];
      g.ob.forEach((o, i) => { if (o) o.visible = i === oi; }); g.ban.mesh.visible = oi === 3;
      if (oi === 0) { const o = g.ob[0]; o.position.set(...op); o.scale.setScalar(oc / 2.8); o.rotation.z = 1.2; }
      if (oi === 1) { const o = g.ob[1]; o.position.set(...op); o.scale.set(oc * .4, oc * .5, oc * .4); }
      if (oi === 2) { const o = g.ob[2]; o.position.set(...op); o.scale.set(oc * .5, oc * .38, oc * .38); }
      if (oi === 4) { const o = g.ob[4]; o.position.set(...op); o.scale.setScalar(oc * .5); }
      if (oi === 3) { const Pp = []; for (let i = 0; i < 24; i++) { const a = mix(-.9, .9, i / 23); Pp.push([op[0] + (1 - Math.cos(a)) * oc * .35 - oc * .12, op[1] + Math.sin(a) / Math.sin(.9) * oc / 2, 0]); } g.ban.set(Pp, (i, n) => oc * .09 * Math.sin(Math.PI * (i + .5) / n) + oc * .01); }
      ach(g, 'emb', larg ? [-L * .7, L * .45, 0] : [L * .15, L * 1.05, 0]); ach(g, 'obj', larg ? [L * .75, oc * .45, 0] : [oc * .45, -L * .75, 0]);
    },
    camera(g, P) { const L = g.L || 1; return E3.deitado(g) ? cam(g, P, L * 1.7, L * 1.6, { th: .1, al: [0, L * .3, 0], viva: .4 }) : cam(g, P, L * .9, L * 2.35, { th: .1, al: [0, L * .14, 0], viva: .4 }); },
    sobre(g, S) {
      const w = g.w || 1, mm = g.mm || .1, oi = OBJ.findIndex(o => w <= o.ate), mr = interp(MAS, w), ms = w >= 12 ? (mr < 100 ? Math.round(mr / 5) * 5 : Math.round(mr / 10) * 10) : 0;
      legenda(g, NAR ? `${w}ª semana (${w + 2}ª pela DUM)` : `${w}ª semana após a fecundação (${w + 2}ª pela DUM)`, NAR ? `cerca de ${arred(mm)} mm (cabeça às nádegas)${ms ? ` e ${nbr(ms)} g` : ''}` : `cerca de ${arred(mm)} mm da cabeça às nádegas${ms ? `; cerca de ${nbr(ms)} g` : ''}; ao lado, ${OBJ[oi].n}`);
      // barra da gestação: semanas pela DUM (0 a 40)
      const x0 = NAR ? 14 : 40, x1 = W - x0, y = NAR ? 104 : 126, fx = m => x0 + m / 40 * (x1 - x0), sh = 16;
      [[0, 13, '1º trimestre', '1º tri.'], [13, 27, '2º trimestre', '2º tri.'], [27, 40, '3º trimestre', '3º tri.']].forEach(([a, b, n, n2], i) => { rr(fx(a) + 1, y, fx(b) - fx(a) - 2, sh, 4, ['#2B3557', '#323E66', '#2B3557'][i]); tx(tw(n, 12, 600) < fx(b) - fx(a) - 6 ? n : n2, (fx(a) + fx(b)) / 2, y + sh / 2 + .5, { s: 12, w: 600, c: C.txt, bg: false }); });
      const y2 = y + sh + 4; rr(fx(2), y2, fx(10) - fx(2), 8, 3, 'rgba(242,85,106,.55)'); rr(fx(10), y2, fx(40) - fx(10), 8, 3, 'rgba(143,211,255,.4)');
      for (let m = 5; m < 10; m++) line(fx(m), y2, fx(m) + 6, y2 + 8, 'rgba(255,255,255,.35)', 1);
      line(fx(22), y - 6, fx(22), y2 + 14, 'rgba(232,237,247,.7)', 1, [3, 3]); line(fx(24), y - 6, fx(24), y2 + 14, 'rgba(232,237,247,.7)', 1, [3, 3]);
      tx(NAR ? 'embrião' : 'período embrionário', (fx(2) + fx(10)) / 2, y2 + 20, { s: 12, c: '#FF9AA8', bg: false }); tx('período fetal', (fx(26) + fx(40)) / 2, y2 + 20, { s: 12, c: '#8FD3FF', bg: false });
      if (!NAR) tx('viabilidade com UTI (22 a 24 semanas pela DUM)', fx(23), y2 + 34, { s: 12, c: C.dim, bg: false });
      marker(fx(w + 2), y2 + 4, '#FFB347');
      E3.reserva(g, [0, y - 8, W, 76]);
    }
  });
})();
