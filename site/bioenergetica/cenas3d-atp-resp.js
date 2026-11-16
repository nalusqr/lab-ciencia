/* LAB Bioenergética: cenas 3D de ATP e respiração celular (Martin). Cada cena troca o desenho 2D por um modelo 3D;
   o desenho 2D antigo continua como plano B quando o WebGL não abre. Kit: bio3d.js. */
'use strict';
(function () {
  if (!window.BIO3D) return;
  const B = BIO3D, { cl, mix, seg, add, sub, mul, lerp3, fr, hash, trilha, surge, TAU } = B.V;
  const E = () => B.E(), RED = () => B.REDUZ();
  const pc = (nome, cor, frase) => ({ nome, cor, frase });
  const q = s => `<span class="q">${s}</span>`;

  // =====================================================================================
  // ATP e ADP: o último fosfato sai (hidrólise) e volta (recarga), em ciclo
  // =====================================================================================
  B.cena('atp/ciclo', {
    fit: 12, raio: 6,
    pecas: {
      aden: pc('Adenina', '#8C7CF0', 'Base nitrogenada de dois anéis. Com a ribose, forma a adenosina.'),
      rib: pc('Ribose', '#F3D49B', 'Açúcar de 5 carbonos que liga a adenina aos fosfatos.'),
      fos: pc('Fosfatos', '#FF9A3C', 'Três grupos fosfato em fila. As cargas negativas se repelem, e o último sai com facilidade.'),
      pi: pc('Fosfato solto (Pᵢ)', '#FF9A3C', 'O fosfato que saiu na hidrólise. Volta a ser preso ao ADP quando a célula refaz o ATP.'),
      agua: pc('Água', '#FF4D4D', 'Entra na hidrólise do ATP e sai quando o ATP é refeito.')
    },
    rotulos: [{ pc: 'aden', t: 'adenina' }, { pc: 'rib', t: 'ribose' }, { pc: 'fos', t: 'fosfatos' }],
    montar() {},
    animar(g) {
      const t = g.t, p = fr(t / 10), s = 1.95, O = [-.75, -.15, 0], Pk = g.pecas;
      const sep = p < .12 ? 0 : p < .3 ? E().out(seg(p, .12, .3)) : p < .58 ? 1 : p < .8 ? 1 - E().move(seg(p, .58, .8)) : 0;
      g.gasta = p >= .1 && p < .58; g.sep = sep;
      const W = B.mol(g, 'adp', O, s, [0, 0, 0], 1, i => (i < 2 ? Pk.aden : i === 2 ? Pk.rib : Pk.fos));
      const p2 = W[8], at = add(O, mul([1.62, -.06, 0], s)), spin = sep * (RED() ? 0 : t * .9);
      const pp = add(at, mul(B.deitado(g) ? [sep * 1.5, sep * 1.15, sep * .8] : [sep * .3, sep * 1.7, sep * .8], s));
      B.mol(g, 'pi', pp, s, [spin * .7, spin, 0], 1, sep > .3 ? Pk.pi : Pk.fos);
      const mid = lerp3(p2, pp, .5), d = sub(pp, p2);
      if (sep < .04) {
        B.bastao(g, g.mB, p2, pp, .07 * s, '#D9DFEA', 1);
        const k = .55 + .45 * Math.sin(t * 3.2); B.put(g, g.mE, mid, B.qy(g, d), .1 * s, B.V.len(d) * .42, .1 * s, '#FFE9A8', k);
      }
      // água: entra na hidrólise e sai na recarga
      const fa = seg(p, .03, .14), fb = seg(p, .6, .8);
      if (fa > 0 && fa < 1) B.mol(g, 'h2o', add(mid, [0, -2.8 * (1 - E().out(fa)), 1.2 * (1 - fa)]), s * .95 * (1 - seg(fa, .85, 1)), [0, t, 0], 1, Pk.agua);
      if (fb > 0 && fb < 1) { const w = add(mid, [.4 * fb, -2.8 * E().out(fb), 1.4 * fb]); B.mol(g, 'h2o', w, s * .95 * Math.min(1, fb * 5) * (1 - seg(fb, .85, 1)), [0, -t, 0], 1, Pk.agua); B.ficha(g, w, 'H₂O', '#FF8A8A', { dy: 1.2, pr: 2 }); }
      if (fa > .1 && fa < .9) B.ficha(g, add(mid, [0, -2.8 * (1 - E().out(fa)), 1.2 * (1 - fa)]), 'H₂O', '#FF8A8A', { dy: 1.2, pr: 2 });
      // energia: sobe para o trabalho da célula; desce da respiração ou da luz
      const k1 = seg(p, .14, .52), k2 = seg(p, .56, .8);
      for (let i = 0; i < 10; i++) {
        if (k1 > 0 && k1 < 1) { const f = cl(k1 * 1.6 - i * .065, 0, 1); if (f > 0 && f < 1) B.brilho(g, [mid[0] + Math.sin(i * 2.4) * 1.8 * f, mix(mid[1], 3.0, E().out(f)), mid[2] + Math.cos(i * 1.7) * .9 * f], .11 * surge(f), '#FFE9A8'); }
        if (k2 > 0 && k2 < 1) { const f = cl(k2 * 1.6 - i * .065, 0, 1); if (f > 0 && f < 1) B.brilho(g, [mid[0] + Math.sin(i * 2.4) * 1.8 * (1 - f), mix(-2.9, mid[1], E().out(f)), mid[2] + Math.cos(i * 1.7) * .9 * (1 - f)], .11 * surge(f), '#FFE9A8'); }
      }
      if (sep > .35) B.ficha(g, pp, 'Pᵢ', '#FFB870', { dy: -1.3, pr: 1 });
      g.vis.aden = g.vis.rib = g.vis.fos = 1; g.anc.aden = add(W[0], [0, .95, 0]); g.anc.rib = add(W[2], [0, -.85, 0]); g.anc.fos = add(W[3], [0, .85, 0]);
    },
    camera(g) { return B.viva({ th: .05, fi: .12, d: B.enquadrar(g, 5.4, 3.3), al: [.4, .1, 0] }, g.t, 2); },
    sobre(g) {
      const top = NAR ? 'trabalho da célula: transporte, movimento, síntese' : 'trabalho da célula: transporte ativo, movimento, síntese de moléculas';
      const bot = NAR ? 'energia dos alimentos ou da luz' : 'energia dos alimentos (respiração e fermentação) ou da luz (fotossíntese)';
      B.texto(g, [.4, NAR ? 4.7 : 3.25, 0], top, { c: g.gasta ? C.txt : C.dim, s: 13 });
      B.texto(g, [.4, NAR ? -3.4 : -3.05, 0], bot, { c: !g.gasta && g.sep > .02 ? C.txt : C.dim, s: 13 });
      B.texto(g, [.4, NAR ? 3.9 : 2.15, 0], g.sep > .5 ? 'ADP + Pᵢ' : 'ATP', { f: FH, s: NAR ? 17 : 20, w: 700, c: g.sep > .5 ? C.txt : '#FFB870' });
    },
    legenda: g => (g.gasta ? `Gasto: ${q('ATP + H₂O')} formam ${q('ADP + Pᵢ')} e liberam energia para o trabalho da célula` : `Recarga: ${q('ADP + Pᵢ')}, com energia dos alimentos ou da luz, refazem o ${q('ATP')} e liberam água`)
  });

  // =====================================================================================
  // Acoplamento energético: duas rampas e a carga do ATP fluindo entre elas
  // =====================================================================================
  B.cena('atp/acoplamento', {
    fit: 20, raio: 9,
    pecas: {
      rL: pc('Reação que libera energia', '#E8603F', 'A respiração quebra a glicose, rica em energia, em CO₂ e água, pobres em energia. Parte dessa energia carrega o ATP.'),
      rR: pc('Reação que consome energia', '#BFD3FF', 'Unir aminoácidos numa proteína exige energia. Ela vem da quebra do ATP.'),
      atp: pc('ATP', '#FF9A3C', 'Carregado pela reação que libera energia, leva essa energia até a reação que consome.'),
      adp: pc('ADP + Pᵢ', '#C9CFDC', 'O ATP descarregado. Volta para ser recarregado: o ciclo não para.'),
      prot: pc('Proteína', '#BFD3FF', 'Cadeia de aminoácidos montada com a energia do ATP.')
    },
    rotulos: [{ pc: 'rL', t: 'libera energia' }, { pc: 'rR', t: 'consome energia' }],
    montar(g) {
      const T = g.T;
      g.rL = B.peca(g, B.caixaR(g, 2.8, .22, 1.05, .16, 3), B.fis(g, '#D9573A', { p: { roughness: .5, clearcoat: .6 }, rim: '#FFC2A8', rimK: .35 }), 'rL');
      g.rR = B.peca(g, B.caixaR(g, 2.8, .22, 1.05, .16, 3), B.fis(g, '#9FB8E8', { p: { roughness: .5, clearcoat: .6 }, rim: '#E0ECFF', rimK: .35 }), 'rR');
      g.trilho = new T.Mesh(B.toro(g, .03, 48), B.fis(g, '#FF9A3C', { p: { roughness: .4, transparent: true, opacity: .55 } })); g.raiz.add(g.trilho);
    },
    animar(g) {
      const t = g.t, dep = B.deitado(g), Pk = g.pecas, ang = .42;
      const L = dep ? { l: [-6.3, 0, 0], r: [6.3, 0, 0], c: [0, 0, 0], rx: 2.4, ry: 1.5, ia: Math.PI } : { l: [0, 5.3, 0], r: [0, -5.3, 0], c: [0, 0, 0], rx: 1.9, ry: 1.25, ia: Math.PI / 2 };
      g.L = L;
      g.rL.position.set(...L.l); g.rL.rotation.z = -ang; g.rR.position.set(...L.r); g.rR.rotation.z = ang;
      g.trilho.position.set(...L.c); g.trilho.scale.set(L.rx, L.ry, 1);
      const sup = (c, a, f, h) => { const x = -2.5 + 5 * f, y = .22 + h; return [c[0] + x * Math.cos(a) - y * Math.sin(a), c[1] + x * Math.sin(a) + y * Math.cos(a), c[2]]; };
      // rampa que libera: glicose rola e vira CO₂ e água
      for (let i = 0; i < 3; i++) {
        const f = fr(t * .085 + i / 3), dn = seg(f, .86, 1);
        if (dn < .5) B.mol(g, 'glic', sup(L.l, -ang, f * .9, .5), .7 * (1 - seg(dn, .2, .5)), [Math.PI / 2 * .3, 0, -f * 7], 1, Pk.rL);
        if (dn > .2) { const k = seg(dn, .2, 1), b = sup(L.l, -ang, .93, .5); B.mol(g, 'co2', add(b, [.5 * k, 1.1 * k, .5]), .8 * surge(k), [0, t, .5], 1, Pk.rL); B.mol(g, 'h2o', add(b, [.9 * k, .2 * k, -.4]), .8 * surge(k), [0, -t, 0], 1, Pk.rL); }
      }
      // rampa que consome: aminoácidos sobem e se juntam à proteína
      const cores = ['#BFD3FF', '#9FE0C9', '#F2B8D8'];
      for (let i = 0; i < 3; i++) { const f = fr(t * .085 + i / 3 + .15); B.put(g, g.mS, sup(L.r, ang, f * .88, .32), null, .3 * Math.min(1, f * 8) * (1 - seg(f, .9, 1)), null, null, cores[i], 1, Pk.rR); }
      const topo = sup(L.r, ang, 1, .5), prot = [];
      for (let i = 0; i < 9; i++) { const a = i * .9; prot.push(add(topo, [Math.cos(a) * .55 - .2, .35 + i * .16, Math.sin(a) * .55])); }
      prot.forEach((p, i) => { B.put(g, g.mS, p, null, .26, null, null, cores[i % 3], 1, Pk.prot); if (i) B.bastao(g, g.mB, prot[i - 1], p, .07, '#D9DFEA', .9, Pk.prot); });
      // ciclo do ATP: carregado em cima (ou à direita), descarregado embaixo (ou à esquerda)
      const pt = a => [L.c[0] + Math.cos(a) * L.rx, L.c[1] + Math.sin(a) * L.ry, L.c[2]];
      const ent = pt(L.ia), sai = pt(L.ia - Math.PI);
      for (let i = 0; i < 2; i++) {
        const u = fr(t * .16 + i / 2), a1 = L.ia - u * Math.PI, a2 = L.ia - Math.PI - u * Math.PI;
        const pA = pt(a1), pD = pt(a2);
        B.mol(g, 'atp', pA, .5, [0, 0, a1 - Math.PI / 2], 1, Pk.atp);
        B.mol(g, 'adp', pD, .5, [0, 0, a2 - Math.PI / 2], .8, Pk.adp); B.mol(g, 'pi', add(pD, [0, 0, .6]), .5, [t, 0, 0], .8, Pk.adp);
        if (i === 0) { B.ficha(g, pA, 'ATP', '#FFB870', { dy: -1.3, pr: 1 }); B.ficha(g, pD, 'ADP + Pᵢ', '#C9CFDC', { dy: 1.3, pr: 2 }); }
      }
      // energia em trânsito e calor
      const mL = sup(L.l, -ang, .5, .8), mR = sup(L.r, ang, .5, .8);
      for (let i = 0; i < 5; i++) {
        const f = fr(t * .45 + i / 5); B.brilho(g, lerp3(mL, ent, f), .1 * surge(f), '#FFE9A8'); B.brilho(g, lerp3(sai, mR, f), .1 * surge(f), '#FFE9A8');
        const h = fr(t * .3 + i / 5); [sup(L.l, -ang, .8, .9), sup(L.r, ang, .25, .9), add(L.c, dep ? [0, L.ry + .5, 0] : [L.rx + .5, 0, 0])].forEach((b, j) => B.brilho(g, add(b, [Math.sin(i * 2 + j) * .4, h * 1.6, .3]), .075 * surge(h), '#FF8A7A', 2.6));
      }
      B.ficha(g, sup(L.l, -ang, 0, 1.1), 'glicose + O₂', '#FFE1A6', { dy: -1, pr: 3 }); B.ficha(g, sup(L.l, -ang, 1, .2), 'CO₂ + H₂O', '#C9CFDC', { dy: 1.4, pr: 3 });
      B.ficha(g, sup(L.r, ang, 0, .2), 'aminoácidos', '#BFD3FF', { dy: 1.4, pr: 3 }); B.ficha(g, add(topo, [0, 1.9, 0]), 'proteína', '#BFD3FF', { dy: -1, pr: 3 });
      g.vis.rL = g.vis.rR = 1; g.anc.rL = add(sup(L.l, -ang, .55, -.45), [0, 0, 1.05]); g.anc.rR = add(sup(L.r, ang, .45, -.45), [0, 0, 1.05]);
    },
    camera(g) { const dep = B.deitado(g); return B.viva({ th: .1, fi: .2, d: dep ? B.enquadrar(g, 11, 3.9) : B.enquadrar(g, 4.1, 8.4), al: [0, dep ? .5 : 0, 0] }, g.t, 1.2); },
    sobre(g) { B.texto(g, g.L.c, 'ciclo do ATP', { c: C.dim, s: 13 }); const dep = B.deitado(g); B.texto(g, add(g.L.c, dep ? [0, g.L.ry + 2.1, 0] : [g.L.rx + 1.1, .9, 0]), 'calor', { c: '#FF8A7A', s: 13 }); },
    legenda: () => 'A energia da reação que libera carrega o ATP; o ATP descarrega na reação que consome; parte sempre vira calor'
  });

  // =====================================================================================
  // Visão geral da respiração: mitocôndria em corte e as três etapas como pontos tocáveis
  // =====================================================================================
  B.cena('resp/geral', {
    fit: 20, raio: 9, raioPc: { glic: 2, krebs: 2.2, cadeia: 2.2 },
    pecas: {
      glic: pc('1. Glicólise', '#FFE1A6', 'No citosol, a glicose (6 C) é partida em dois piruvatos (3 C). Rende 2 ATP e 2 NADH e não precisa de O₂.'),
      krebs: pc('2. Ciclo de Krebs', '#F2875F', 'Na matriz, os carbonos do piruvato saem como CO₂. Forma NADH, FADH₂ e 2 ATP por glicose.'),
      cadeia: pc('3. Cadeia transportadora', '#FFE066', 'Nas cristas, os elétrons do NADH e do FADH₂ passam até o O₂, que forma água. É a etapa que mais rende ATP.'),
      ext: pc('Membrana externa', '#E8603F', 'Lisa e permeável a moléculas pequenas. Envolve toda a mitocôndria.'),
      int: pc('Membrana interna', '#F28C66', 'Dobrada em cristas. Nela ficam a cadeia transportadora e a ATP sintase.'),
      crista: pc('Crista', '#F59A76', 'Dobra da membrana interna. Aumenta a área para a cadeia transportadora.'),
      matriz: pc('Matriz', '#8E4A3C', 'Interior da mitocôndria, onde ocorre o ciclo de Krebs. Tem DNA e ribossomos próprios.')
    },
    rotulos: [{ pc: 'glic', t: '1. Glicólise' }, { pc: 'krebs', t: '2. Ciclo de Krebs' }, { pc: 'cadeia', t: '3. Cadeia transportadora' }, { pc: 'crista', t: 'crista' }, { pc: 'ext', t: 'membrana externa' }, { pc: 'matriz', t: 'matriz' }],
    montar(g) {
      const T = g.T;
      g.mi = B.mitoCorte(g, { r: 2.15, h: 3.3, n: 7, pc: { ext: 'ext', int: 'int', crista: 'crista', matriz: 'matriz' } }); g.raiz.add(g.mi.grupo);
      g.enz = [0, 1, 2].map(i => { const m = B.peca(g, B.lumpy(g, 'enz' + i, 11 + i * 7, 2, 6, .3, .4, .8), B.fis(g, ['#E9C77B', '#D9B26A', '#F1D79A'][i], { p: { roughness: .45, clearcoat: .6 }, rim: '#FFF0C8', rimK: .3 }), 'glic'); return m; });
      g.kr = B.peca(g, B.toro(g, .16, 32), B.fis(g, '#FF9E7A', { p: { roughness: .35, clearcoat: .8 }, rim: '#FFD9C8', rimK: .4 }), 'krebs', g.mi.grupo);
      g.cx = B.inst(g, B.lumpy(g, 'cxs', 5, 2, 5, .3, .4, .8), B.fis(g, '#E39A6E', { p: { roughness: .45 } }), 4, g.mi.grupo, g.pecas.cadeia); g.pick.push(g.cx.m);
    },
    animar(g) {
      const t = g.t, dep = B.deitado(g), Pk = g.pecas, mi = g.mi, gr = mi.grupo, u = t * .1;
      gr.rotation.z = dep ? Math.PI / 2 : 0; gr.position.set(dep ? 2.7 : 0, dep ? -.2 : -2.7, 0);
      const G = dep ? [-6.4, .2, 0] : [0, 5.8, 0];
      g.enz.forEach((m, i) => { m.position.set(G[0] + [-.45, .5, .1][i], G[1] + [.2, .05, -.5][i], [-.3, .1, .3][i]); m.scale.setScalar(.5); m.rotation.set(t * .1 + i, i, 0); });
      // ciclo de Krebs na matriz e proteínas da cadeia numa crista
      const kL = [0, 1.45, -.75], cr = mi.cr[1], cy = cr.y, xm = cr.lado * mi.ri * .2;
      g.kr.position.set(...kL); g.kr.scale.setScalar(.62); g.kr.rotation.set(.2, 0, RED() ? 0 : -t * .6);
      for (let i = 0; i < 4; i++) B.put(g, g.cx, [cr.lado * (mi.ri * (.85 - i * .26)), cy + .22 * (i % 2 ? 1 : -1), -.15 - .35 * (i % 2)], null, .26, .3, .26, '#E39A6E', 1, Pk.cadeia);
      B.fim(g.cx);
      const K = B.mundo(g, gr, kL), C3 = B.mundo(g, gr, [xm, cy, .05]);
      g.vis.glic = g.vis.krebs = g.vis.cadeia = g.vis.crista = g.vis.ext = g.vis.matriz = 1;
      g.anc.glic = add(G, [0, .55, .3]); g.anc.krebs = B.mundo(g, gr, [.6, 1.45, -.4]); g.anc.cadeia = B.mundo(g, gr, [cr.lado * mi.ri * .55, cy, .1]);
      g.anc.crista = B.mundo(g, gr, [mi.cr[4].lado * mi.ri * .5, mi.cr[4].y, .05]); g.anc.ext = B.mundo(g, gr, [mi.r * .7, -1.2, -mi.r * .55]); g.anc.matriz = B.mundo(g, gr, [0, -2.6, -.9]);
      // caminhos das moléculas
      const ent = dep ? [-10.2, 1.6, 0] : [-3.2, 8.4, 0], atpG = add(G, dep ? [0, -3, .5] : [3, -.4, .5]);
      const fora = (p, d) => add(p, d), up = dep ? [0, 3.9, .6] : [-3.6, .2, .6], o2in = add(C3, dep ? [1.6, -3.7, 1.2] : [3.6, -.9, 1.2]), h2o = add(C3, dep ? [-1.4, -3.6, 1.4] : [3.4, 1.4, 1.4]), atpO = dep ? [9.6, -1.6, .5] : [3.1, -8.4, .5];
      const voo = (P, f, tipo, s, fi, cor, rot, pr, n) => { if (f <= 0 || f >= 1) return; const p = B.V.trilha(P, E().move(f)); for (let i = 0; i < (n || 1); i++) B.mol(g, tipo, add(p, [i * .35, i * .5, -i * .3]), s * surge(f), rot || [0, t * .8, 0], 1); if (fi) B.ficha(g, p, fi, cor, { dy: -1.2, pr: pr || 4 }); };
      voo([ent, G], fr(u), 'glic', .7, 'glicose', '#FFE1A6', null, 3);
      voo([G, K], fr(u + .5), B.MOL.cad(3), .7, '2 piruvatos', '#FFE1A6', [0, 0, t * .5], 3, 2);
      voo([G, atpG], fr(u + .2), 'atp', .42, '2 ATP', '#FFB870', null, 5);
      voo([K, fora(K, up)], fr(u + .1), 'co2', .7, 'CO₂', '#C9CFDC', null, 4);
      voo([K, fora(K, [0, -1.6, .4])], fr(u + .6), 'atp', .42, '2 ATP', '#FFB870', null, 6);
      voo([K, C3], fr(u + .35), 'nadh', .65, 'NADH', '#9CC8FF', null, 5); voo([K, C3], fr(u + .85), 'fadh2', .65, 'FADH₂', '#9CC8FF', null, 6);
      voo([o2in, C3], fr(u + .45), 'o2', .75, 'O₂', '#FF8A8A', null, 3); voo([C3, h2o], fr(u + .95), 'h2o', .75, 'H₂O', '#FF8A8A', null, 5);
      voo([C3, atpO], fr(u + .7), 'atp', .45, 'cerca de 26 a 28 ATP', '#FFB870', null, 2, 3);
      for (let i = 0; i < 8; i++) { const f = fr(t * .5 + i / 8), a = f * TAU; B.brilho(g, B.mundo(g, gr, [cr.lado * mi.ri * (.9 - .7 * f), cy + Math.sin(a) * .08, .25]), .07, '#FFE066'); }
      g.dep = dep; g.G = G;
    },
    camera(g) { const dep = B.deitado(g); return B.viva({ th: .22, fi: .16, d: dep ? B.enquadrar(g, 10.6, 4.4) : B.enquadrar(g, 4.4, 9.2), al: dep ? [-.4, .1, 0] : [0, -.1, 0] }, g.t, 1); },
    sobre(g) { B.texto(g, add(g.G, g.dep ? [0, -1.6, 0] : [-2.2, -.9, 0]), 'citosol', { c: C.dim, s: 13 }); },
    legenda: () => '1. Glicólise no citosol, 2. ciclo de Krebs na matriz e 3. cadeia transportadora nas cristas, onde o O₂ é usado. Toque nos pontos para ver cada etapa'
  });

  // =====================================================================================
  // Glicólise: a glicose parte em dois piruvatos; ATP e NADH saem em sequência
  // =====================================================================================
  B.cena('resp/glicolise', {
    fit: 14, raio: 7,
    pecas: {
      glic: pc('Glicose', '#FFE1A6', 'Açúcar de 6 carbonos. Na glicólise, é partida em duas moléculas de 3 carbonos.'),
      pir: pc('Piruvato', '#FFE1A6', 'Molécula de 3 carbonos. Com O₂, entra na mitocôndria; sem O₂, segue para a fermentação.'),
      atp: pc('ATP', '#FF9A3C', 'No começo, 2 ATP são gastos para ativar a glicose; depois, formam-se 4. Saldo: 2 ATP.'),
      nad: pc('NAD⁺ e NADH', '#7FB2FF', 'O NAD⁺ recebe elétrons e hidrogênio e vira NADH, que leva esses elétrons para a cadeia transportadora.'),
      pi: pc('Fosfato', '#FF9A3C', 'Grupo fosfato que passa de uma molécula para outra.')
    },
    rotulos: [],
    montar() {},
    animar(g) {
      const t = g.t, f = fr(t / 15), dep = B.deitado(g), Pk = g.pecas, D = dep ? [1, 0, 0] : [0, 1, 0], N = dep ? [0, 1, 0] : [1, 0, 0];
      const vx = (a, b) => [D[0] * a + N[0] * b, D[1] * a + N[1] * b, 0];
      const sp = E().move(seg(f, .3, .44)), R = .95;
      const ringP = i => { const aa = i < 3 ? (i - 1) * Math.PI / 3 : Math.PI + (i - 4) * Math.PI / 3; return vx(Math.cos(aa) * R, Math.sin(aa) * R); };
      const sg = j => (j ? -1 : 1);
      const chainP = i => { const j = i < 3 ? 0 : 1, k = j ? i - 3 : i; return vx(sg(j) * (2.7 + (k % 2) * .22), (j ? -1 : 1) * (1 - k) * .62); };
      const C6 = [0, 1, 2, 3, 4, 5].map(i => lerp3(ringP(i), chainP(i), sp)), rot = RED() ? 0 : Math.sin(t * .5) * .25;
      const pcC = f > .86 ? Pk.pir : Pk.glic;
      C6.forEach(p => B.put(g, g.mS, p, null, .32, null, null, '#FFE1A6', 1, pcC));
      for (let i = 0; i < 6; i++) { const j = (i + 1) % 6; if (sp > .5 && (i === 2 || i === 5)) continue; B.bastao(g, g.mB, C6[i], C6[j], .08, '#D9DFEA', .9, pcC); }
      // fosfatos presos: [cadeia][vaga]; vaga 0 vem do ATP gasto, vaga 1 do Pᵢ que entra com o NADH
      const ev = (t0, d) => seg(f, t0, t0 + (d || .08));
      const temP = [[ev(.06) > .45 && ev(.74) < .45, ev(.46) > .45 && ev(.62) < .45], [ev(.16) > .45 && ev(.8) < .45, ev(.53) > .45 && ev(.68) < .45]];
      const vaga = (j, v) => { const a = j ? 3 : 0, c = C6[a + (v ? 2 : 0)], o = sp < .5 ? mul(sub(c, [0, 0, 0]), .75) : vx(sg(j) * .78, 0); return add(c, add(o, [0, 0, v ? .4 : -.2])); };
      for (let j = 0; j < 2; j++) for (let v = 0; v < 2; v++) if (temP[j][v]) B.mol(g, 'pi', vaga(j, v), .85, [t * .3, j, 0], 1, Pk.pi);
      // eventos: uma molécula chega, troca um fosfato (ou ganha H) e vai embora
      g.cont = { gasto: 0, feito: 0, nadh: 0 };
      const evento = (t0, j, v, tipo) => {
        const k = ev(t0); if (k <= 0) return;
        const a = seg(k, 0, .32), b = seg(k, .32, .56), c = seg(k, .56, 1), nome = tipo === 'gasto' ? 'gasto' : tipo === 'nad' ? 'nadh' : 'feito';
        if (b >= 1) g.cont[nome]++;
        if (k >= 1) return;
        const alvo = vaga(j, v), s1 = sg(j), perto = add(alvo, vx(s1 * 1.5, s1 * 1.6)), F1 = add(alvo, vx(s1 * -.6, s1 * 4.2)), F2 = add(alvo, vx(s1 * 2.2, s1 * 4));
        const p = c > 0 ? lerp3(perto, F2, E().in(c)) : lerp3(F1, perto, E().out(a)), al = c > 0 ? 1 - seg(c, .7, 1) : Math.min(1, a * 4), dv = B.V.nrm(sub(alvo, p)), rz = [0, 0, Math.atan2(dv[1], dv[0])], ponta = add(p, mul(dv, 1.0));
        if (tipo === 'gasto') {
          B.mol(g, b < 1 ? 'atp' : 'adp', p, .62 * al, rz, 1, Pk.atp);
          if (b > 0 && b < 1) B.mol(g, 'pi', lerp3(ponta, alvo, E().move(b)), .85, [0, 0, 0], 1, Pk.pi);
          B.ficha(g, p, b < 1 ? 'ATP' : 'ADP', b < 1 ? '#FFB870' : '#C9CFDC', { dy: -1.4, pr: 1 });
        } else if (tipo === 'nad') {
          B.mol(g, b < .5 ? 'nad' : 'nadh', p, .8 * al, [0, t * .5, 0], 1, Pk.nad);
          if (b > 0 && b < 1) { B.hmais(g, lerp3(vaga(j, 0), p, E().move(b)), 1.1, 1, Pk.nad); B.mol(g, 'pi', lerp3(add(alvo, vx(s1 * 1.4, -s1 * 2.4)), alvo, E().move(b)), .85, [0, 0, 0], 1, Pk.pi); }
          B.ficha(g, p, b < .5 ? 'NAD⁺' : 'NADH', '#9CC8FF', { dy: -1.4, pr: 1 });
        } else {
          B.mol(g, b < 1 ? 'adp' : 'atp', p, .62 * al, rz, 1, Pk.atp);
          if (b > 0 && b < 1) B.mol(g, 'pi', lerp3(alvo, ponta, E().move(b)), .85, [0, 0, 0], 1, Pk.pi);
          if (b >= 1) B.brilho(g, p, .14 * (1 - c), '#FFE9A8');
          B.ficha(g, p, b < 1 ? 'ADP' : 'ATP', b < 1 ? '#C9CFDC' : '#FFB870', { dy: -1.4, pr: 1 });
        }
      };
      evento(.06, 0, 0, 'gasto'); evento(.16, 1, 0, 'gasto'); evento(.46, 0, 1, 'nad'); evento(.53, 1, 1, 'nad');
      evento(.62, 0, 1, 'atp'); evento(.68, 1, 1, 'atp'); evento(.74, 0, 0, 'atp'); evento(.8, 1, 0, 'atp');
      g.f = f;
      if (f < .3) B.ficha(g, [0, 0, 0], 'glicose (6 C)', '#FFE1A6', { dy: 0, pr: 3 });
      else if (f > .88) { B.ficha(g, C6[1], 'piruvato (3 C)', '#FFE1A6', { dy: 0, dx: dep ? 0 : 1.3, pr: 3 }); B.ficha(g, C6[4], 'piruvato (3 C)', '#FFE1A6', { dy: 0, dx: dep ? 0 : 1.3, pr: 3 }); }
      else if (f > .44) { B.ficha(g, C6[1], '3 C', '#FFE1A6', { dy: 0, pr: 6 }); B.ficha(g, C6[4], '3 C', '#FFE1A6', { dy: 0, pr: 6 }); }
    },
    camera(g) { const dep = B.deitado(g); return B.viva({ th: .12, fi: .14, d: dep ? B.enquadrar(g, 5.6, 3.7) : B.enquadrar(g, 4.3, 5.8), al: [0, 0, 0] }, g.t, 1.4); },
    sobre(g) {
      const c = g.cont, x = NAR ? 14 : 22, y = NAR ? 62 : 80, lh = NAR ? 18 : 20, fim = g.f > .88;
      const L = [['ATP gastos', c.gasto + ' de 2', c.gasto > 0], ['ATP formados', c.feito + ' de 4', c.feito > 0], ['NADH formados', c.nadh + ' de 2', c.nadh > 0]];
      X.save(); rr(x - 6, y - 12, NAR ? 168 : 196, lh * 3 + (fim ? lh : 0) + 6, 10, 'rgba(11,15,28,.62)', 'rgba(255,255,255,.1)', 1);
      L.forEach((l, i) => { tx(l[0], x + 4, y + i * lh, { a: 'left', s: 13, w: 600, c: l[2] ? C.txt : C.dim, bg: false }); tx(l[1], x + (NAR ? 156 : 184), y + i * lh, { a: 'right', s: 12, f: FD, w: 500, c: l[2] ? '#FFB870' : C.dim, bg: false }); });
      if (fim) tx('saldo: 2 ATP e 2 NADH', x + 4, y + 3 * lh, { a: 'left', s: 13, w: 700, c: '#FFB870', bg: false });
      X.restore();
    },
    legenda: g => (g.f < .3 ? 'Investimento: a célula gasta 2 ATP para ativar a glicose, que recebe 2 fosfatos' : g.f < .45 ? 'A molécula de 6 carbonos é partida em duas de 3 carbonos' : g.f < .6 ? 'Cada metade entrega elétrons ao NAD⁺, que vira NADH, e ganha mais um fosfato' : g.f < .88 ? 'Rendimento: os fosfatos passam para o ADP e formam-se 4 ATP' : 'Saldo da glicólise: 2 ATP, 2 NADH e 2 piruvatos, sem usar O₂')
  });

  // =====================================================================================
  // Ciclo de Krebs: roda legível, CO₂ saindo a cada volta (2 voltas por glicose)
  // =====================================================================================
  B.cena('resp/krebs', {
    fit: 14, raio: 7,
    pecas: {
      anel: pc('Ciclo de Krebs', '#F2875F', 'Sequência de reações na matriz mitocondrial que volta ao começo: o oxaloacetato é refeito a cada volta.'),
      acetil: pc('Acetil-CoA', '#9BD9C3', 'Grupo de 2 carbonos que vem do piruvato. Entra no ciclo e se une ao oxaloacetato.'),
      mol: pc('Composto do ciclo', '#9AA3B2', 'Oxaloacetato (4 C) mais acetil (2 C) formam citrato (6 C). Depois saem 2 CO₂, e o 4 C é refeito.'),
      co2: pc('CO₂', '#9AA3B2', 'Os carbonos da glicose saem do corpo como CO₂, aqui e na entrada do piruvato.'),
      nadh: pc('NADH e FADH₂', '#7FB2FF', 'Levam elétrons para a cadeia transportadora, onde rendem a maior parte do ATP.'),
      atp: pc('ATP', '#FF9A3C', 'Forma-se 1 ATP por volta (na célula, às vezes como GTP).')
    },
    rotulos: [],
    montar(g) {
      const T = g.T;
      g.anel = B.peca(g, B.toro(g, .022, 64), B.fis(g, '#F2875F', { p: { roughness: .35, clearcoat: .8 }, rim: '#FFD9C8', rimK: .4 }), 'anel');
      g.chev = B.inst(g, B.esfera(g, 12), B.fis(g, '#FFB49A', { p: { roughness: .4 } }), 24);
      g.coa = B.peca(g, B.lumpy(g, 'coa', 21, 2, 5, .3, .4, .8), B.fis(g, '#9BD9C3', { p: { roughness: .45, clearcoat: .6 } }), 'acetil');
    },
    animar(g) {
      const t = g.t, tt = t / 10, q = fr(tt), volta = Math.floor(tt) % 2, Pk = g.pecas, R = B.deitado(g) ? 3.1 : 2.6;
      g.R = R; g.q = q; g.volta = volta;
      g.anel.scale.setScalar(R);
      const pa = a => [R * Math.sin(a), R * Math.cos(a), 0];
      for (let i = 0; i < 24; i++) { const a = (i / 24 + (RED() ? 0 : t * .015)) * TAU, p = pa(a); B.put(g, g.chev, p, B.qy(g, [Math.cos(a), -Math.sin(a), 0]), .09, .26, .09, '#FFB49A', 1.1); }
      B.fim(g.chev);
      const n = q < .1 ? 4 : q < .3 ? 6 : q < .45 ? 5 : 4, a = q * TAU, p = pa(a);
      B.mol(g, B.MOL.cad(n), add(p, [0, 0, .45]), 1.05, [0, .3, -a], 1, Pk.mol);
      // entrada: piruvato vira acetil-CoA (sai 1 CO₂ e 1 NADH), que se junta ao oxaloacetato no topo
      const e = seg(q, 0, .1), far = [-R * 1.75, R * 1.3, .6], top = pa(0);
      const pe = q < .1 ? lerp3(far, add(top, [-.6, .25, .2]), E().out(e)) : add(top, [-.6, .25, .2]);
      if (q < .1) { B.mol(g, B.MOL.cad(e < .45 ? 3 : 2), pe, .78, [0, 0, .3], 1, Pk.acetil); g.coa.visible = true; g.coa.position.set(pe[0] - .65, pe[1] + .25, pe[2]); g.coa.scale.setScalar(.38); }
      else { const k = seg(q, .1, .2); g.coa.visible = k < 1; g.coa.position.set(...lerp3(add(pe, [-.65, .25, 0]), add(far, [0, .8, 0]), E().in(k))); g.coa.scale.setScalar(.38 * (1 - k)); }
      g.coa.rotation.set(t * .4, t * .3, 0);
      // produtos: saem da roda para fora
      const sai = (q0, tipo, fi, cor, s, dir) => { const k = seg(q, q0, q0 + .14); if (k <= 0 || k >= 1) return; const p0 = pa(q0 * TAU), d = B.V.nrm(p0), o = add(p0, mul(d, 2.0 * E().out(k))), pp = add(o, mul(dir || [0, 0, 0], k)); B.mol(g, tipo, pp, s * surge(k), [0, t, 0], 1, tipo === 'co2' ? Pk.co2 : tipo === 'atp' ? Pk.atp : Pk.nadh); B.ficha(g, pp, fi, cor, { dy: d[1] > .3 ? -1.2 : 1.2, pr: tipo === 'co2' ? 1 : 2 }); };
      sai(.3, 'co2', 'CO₂', '#C9CFDC', .85, [.3, .4, .3]); sai(.31, 'nadh', 'NADH', '#9CC8FF', .75, [-.4, -.5, -.3]);
      sai(.45, 'co2', 'CO₂', '#C9CFDC', .85, [.3, .4, .3]); sai(.46, 'nadh', 'NADH', '#9CC8FF', .75, [-.4, -.5, -.3]);
      sai(.6, 'atp', 'ATP', '#FFB870', .5); sai(.74, 'fadh2', 'FADH₂', '#9CC8FF', .75); sai(.88, 'nadh', 'NADH', '#9CC8FF', .75);
      { const k = seg(q, .03, .14); if (k > 0 && k < 1) { const o = add(lerp3(far, top, .45), [0, 1.6 * E().out(k), .3]); B.mol(g, 'co2', o, .8 * surge(k), [0, t, 0], 1, Pk.co2); B.ficha(g, o, 'CO₂', '#C9CFDC', { dy: -1.2, pr: 1 }); } }
      // contas da glicose inteira: 2 voltas
      const c = (q0) => (q >= q0 + .07 ? 1 : 0), vt = volta;
      g.cont = { co2: vt * 2 + c(.3) + c(.45), nadh: vt * 3 + c(.31) + c(.46) + c(.88), fadh: vt + c(.74), atp: vt + c(.6) };
      B.ficha(g, add(p, [0, 0, .5]), n === 6 ? 'citrato (6 C)' : n === 5 ? '5 C' : q > .5 ? (q > .9 ? 'oxaloacetato (4 C)' : '4 C') : 'oxaloacetato (4 C)', '#C9CFDC', { dy: 0, pr: 3 });
      if (q < .1) B.ficha(g, pe, e < .45 ? 'piruvato (3 C)' : 'acetil-CoA (2 C)', '#9BD9C3', { dy: -1.3, pr: 2 });
    },
    camera(g) { return B.viva({ th: .1, fi: .1, d: B.enquadrar(g, g.R + 2.6 + (NAR ? .4 : 0), g.R + 2.3 + (NAR ? .4 : 0)), al: [0, -.1, 0] }, g.t, 1.2); },
    sobre(g) {
      B.texto(g, [0, .35, 0], 'Ciclo de Krebs', { f: FH, s: NAR ? 15 : 17, w: 600, c: C.txt });
      B.texto(g, [0, -.35, 0], `volta ${g.volta + 1} de 2`, { s: 13, w: 600, c: '#FFB49A' });
      const R = g.R, est = [[0, 'entra o acetil-CoA'], [.3, 'CO₂ e NADH'], [.45, 'CO₂ e NADH'], [.6, 'ATP'], [.74, 'FADH₂'], [.88, 'NADH']];
      est.forEach(([q0, s]) => { const a = q0 * TAU, on = g.q >= q0 - .02 && g.q < q0 + .16, r = R + (NAR ? 1.3 : 1.1); B.texto(g, [Math.sin(a) * r, Math.cos(a) * r + (q0 === 0 ? .2 : 0), 0], s, { s: 12, w: on ? 700 : 500, c: on ? C.txt : C.dim }); });
      const c = g.cont, x = NAR ? 14 : 22, y = NAR ? 62 : 80, lh = NAR ? 18 : 20, L = [['CO₂', c.co2, 4], ['NADH', c.nadh, 6], ['FADH₂', c.fadh, 2], ['ATP', c.atp, 2]];
      X.save(); rr(x - 6, y - 12, NAR ? 136 : 160, lh * 5 + 4, 10, 'rgba(11,15,28,.62)', 'rgba(255,255,255,.1)', 1);
      tx('no ciclo, por glicose', x + 4, y, { a: 'left', s: 12, w: 600, c: C.dim, bg: false });
      L.forEach((l, i) => { tx(l[0], x + 4, y + (i + 1) * lh, { a: 'left', s: 13, w: 600, c: C.txt, bg: false }); tx(l[1] + ' de ' + l[2], x + (NAR ? 124 : 148), y + (i + 1) * lh, { a: 'right', s: 12, f: FD, w: 500, c: '#FFB870', bg: false }); });
      X.restore();
    },
    legenda: g => { const q = g.q; return q < .1 ? 'O piruvato perde um CO₂ e vira acetil-CoA (2 C), que se une ao oxaloacetato (4 C) e forma citrato (6 C)' : q < .3 ? 'Citrato (6 C): cada glicose rende 2 acetil-CoA, por isso o ciclo dá 2 voltas' : q < .55 ? 'Saem 2 CO₂ por volta: os carbonos da glicose terminam aqui' : q < .7 ? 'Forma-se 1 ATP por volta' : 'FADH₂ e NADH levam elétrons para a cadeia; o oxaloacetato (4 C) é refeito'; }
  });

  // =====================================================================================
  // Cadeia transportadora e quimiosmose: complexos com volume, elétrons, prótons e ATP sintase girando
  // =====================================================================================
  const DICA = (typeof CAD !== 'undefined' && CAD.DICA) || [];
  const fraseCad = id => { const d = DICA.find(x => x.id === id); return d ? d.t : ''; };
  B.cena('resp/cadeia', {
    fit: 22, raio: 10, moleculas: 700,
    pecas: {
      I: pc('Complexo I', '#E6A07E', fraseCad('I')), II: pc('Complexo II', '#D9B574', fraseCad('II')), III: pc('Complexo III', '#CB7F94', fraseCad('III')), IV: pc('Complexo IV', '#DD6F55', fraseCad('IV')),
      S: pc('ATP sintase', '#E9A24E', fraseCad('S')), Q: pc('Ubiquinona', '#F2D24B', fraseCad('Q')), c: pc('Citocromo c', '#E05A6A', fraseCad('c')), O: pc('Oxigênio (O₂)', '#FF4D4D', fraseCad('O')),
      G: pc('Gradiente de H⁺', '#F2F4F8', fraseCad('G')), mem: pc('Membrana interna', '#F0A08A', 'Bicamada de fosfolipídios das cristas. Os H⁺ não a atravessam sozinhos: só pela ATP sintase.')
    },
    rotulos: [{ pc: 'S', t: 'ATP sintase' }, { pc: 'I', t: 'complexo I' }, { pc: 'IV', t: 'complexo IV' }, { pc: 'III', t: 'complexo III' }, { pc: 'O', t: 'O₂' }, { pc: 'II', t: 'complexo II' }, { pc: 'Q', t: 'ubiquinona' }, { pc: 'c', t: 'citocromo c' }],
    montar(g) {
      const T = g.T, dep = B.deitado(g), K = dep ? 1 : .92; g.K = K; g.raizGira = true;
      const X0 = { I: -7.2 * K, II: -4.3 * K, III: -1.3 * K, IV: 1.9 * K, S: 6.1 * K };
      g.X0 = X0;
      B.membrana(g, { x0: -9.6 * K, x1: 8.8 * K, zd: 2.4, esp: 1.4, pc: 'mem', furos: [[X0.I, 1.7, 1.5], [X0.III, 1.6, 1.4], [X0.IV, 1.45, 1.3], [X0.S, 1.15, 1.15]] });
      const lp = (k, s) => B.lumpy(g, k, s, 3, 7, .3, .35, .75), mt = c => B.fis(g, c, { p: { roughness: .42, clearcoat: .55 }, rim: '#FFE6D8', rimK: .3 });
      const corpo = (id, k, s, c, pos, sc) => { const m = B.peca(g, lp(k, s), mt(c), id); m.position.set(...pos); m.scale.set(...sc); m.userData.cor = c; return m; };
      g.cx = [corpo('I', 'cI', 3, '#E6A07E', [X0.I, .15, 0], [1.25, 1.55, 1.05]), corpo('I', 'cIb', 4, '#E6A07E', [X0.I + .45, -1.45, .2], [.65, .95, .7]),
        corpo('II', 'cII', 5, '#D9B574', [X0.II, -1.05, .3], [.8, .75, .75]), corpo('III', 'cIII', 6, '#CB7F94', [X0.III, .2, 0], [1.15, 1.6, .95]),
        corpo('IV', 'cIV', 7, '#DD6F55', [X0.IV, .15, 0], [1.0, 1.5, .9])];
      // ATP sintase: anel c (gira) na membrana, haste central (gira), cabeça F1 na matriz, estator lateral
      g.rot = new T.Group(); g.rot.position.set(X0.S, 0, 0); g.raiz.add(g.rot);
      const mFo = B.fis(g, '#F2D2A0', { p: { roughness: .4, clearcoat: .6 }, rim: '#FFF0D8', rimK: .35 });
      for (let i = 0; i < 10; i++) { const a = i / 10 * TAU, m = B.peca(g, B.capsula(g, .17, .38, 12), mFo, 'S', g.rot); m.position.set(Math.cos(a) * .62, 0, Math.sin(a) * .62); }
      const haste = B.peca(g, B.cilindro(g, 14), B.fis(g, '#E9A24E', { p: { roughness: .4 } }), 'S', g.rot); haste.scale.set(.17, 2.1, .17); haste.position.y = -1.35;
      const cam = B.peca(g, B.esfera(g, 16), B.fis(g, '#E9A24E', { p: { roughness: .4 } }), 'S', g.rot); cam.scale.set(.3, .45, .2); cam.position.set(.16, -2.35, 0);
      g.f1 = new T.Group(); g.f1.position.set(X0.S, -2.75, 0); g.raiz.add(g.f1);
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU, m = B.peca(g, lp('f1' + (i % 2), 9 + i % 2), mt(i % 2 ? '#F2C27A' : '#E9A24E'), 'S', g.f1); m.position.set(Math.cos(a) * .6, 0, Math.sin(a) * .6); m.scale.set(.48, .62, .48); }
      const est = corpo('S', 'est', 12, '#D8925A', [X0.S + 1.05, .05, .1], [.45, .8, .45]);
      const est2 = B.peca(g, B.cilindro(g, 10), mt('#D8925A'), 'S'); est2.position.set(X0.S + 1.15, -1.55, .1); est2.scale.set(.1, 2.6, .1);
      g.Q = B.peca(g, B.cilindro(g, 18), B.fis(g, '#F2D24B', { p: { roughness: .35, clearcoat: .8 } }), 'Q'); g.Q.scale.set(.32, .14, .32);
      g.c = B.peca(g, B.lumpy(g, 'cytc', 15, 2, 4, .2, .4, .8), B.fis(g, '#E05A6A', { p: { roughness: .35, clearcoat: .8 } }), 'c'); g.c.scale.setScalar(.36);
      g.trilho = B.tubo(g, 90, 6, B.emis(g, '#FFE066', .55, { transparent: true, opacity: .45 }));
      g.fe = g.fp = g.fs = 0;
    },
    animar(g, P) {
      const t = g.t, S = P.S, K = g.K, X0 = g.X0, Pk = g.pecas, tr = RED(); g.dep = B.deitado(g); g.M.nos.raiz.rot = [0, 0, g.dep ? 0 : -Math.PI / 2];
      const st = S.man != null ? S.man : Math.floor(S.ph / 6) % 3, kk = 1 - Math.exp(-(g.dt || .016) * 4.5);
      g.fe += ((st === 0) - g.fe) * kk; g.fp += ((st === 1) - g.fp) * kk; g.fs += ((st === 2) - g.fs) * kk; g.st = st;
      const v = S.v / 100; g.g = g.g == null ? v : g.g + (v - g.g) * Math.min(1, (g.dt || .016) * 1.1); const gr = g.g;
      const aE = .45 + .55 * g.fe, aP = .45 + .55 * g.fp, aS = .45 + .55 * g.fs;
      g.cx.forEach((m, i) => { if (!m.userData.s0) m.userData.s0 = m.scale.clone(); const pulse = tr ? 0 : .015 * Math.sin(t * 2.6 + i) * gr; m.rotation.y = Math.sin(t * .2 + i) * .05; m.scale.copy(m.userData.s0).multiplyScalar(1 + pulse); });
      // elétrons: NADH entrega no complexo I, FADH₂ no II; passam por Q, III, citocromo c, IV e chegam ao O₂
      const zf = 1.25, caminho = [[X0.I + .45, -2.1, zf], [X0.I + .2, -.7, zf], [X0.I, .1, zf], [X0.III, .1, zf], [X0.III, 1.25, zf], [X0.IV, 1.35, zf], [X0.IV, .1, zf], [X0.IV + .25, -1.4, zf]];
      g.trilho.set(Array.from({ length: 90 }, (_, i) => trilha(caminho, i / 89)), .03 + .02 * g.fe);
      g.trilho.mesh.material.opacity = .25 + .4 * g.fe;
      const ne = 6; for (let i = 0; i < ne; i++) { const f = fr(t * .09 + i / ne); B.brilho(g, trilha(caminho, f), .12 * Math.min(1, gr * 3), '#FFE066', 2 + 1.6 * g.fe); }
      const cII = [[X0.II, -.9, 1.1], [X0.II + .2, -.1, 1.2], [X0.III, .1, 1.25]]; { const f = fr(t * .09 + .3); B.brilho(g, trilha(cII, f), .1 * Math.min(1, gr * 3), '#FFE066', 2 + 1.4 * g.fe); }
      const fq = .5 + .5 * Math.sin(t * .55); g.Q.position.set(mix(X0.II + .4, X0.III - 1.2, fq), 0, 1.5); g.Q.rotation.set(1.2, t * .5, 0);
      const fc = .5 + .5 * Math.sin(t * .6 + 1); g.c.position.set(mix(X0.III + .9, X0.IV - .8, fc), 1.55, 1.0); g.c.rotation.set(t * .3, t * .4, 0);
      // NADH e FADH₂ chegando; O₂ virando água
      const fn = fr(t * .09); B.mol(g, fn < .5 ? 'nadh' : 'nad', lerp3([X0.I - .8, -3.6, .9], [X0.I + .3, -2.3, .6], E().out(seg(fn, 0, .3))), .75 * Math.min(1, (1 - fn) * 4), [0, t * .3, 0], aE);
      if (fn < .35) B.ficha(g, lerp3([X0.I - .8, -3.6, .9], [X0.I + .3, -2.3, .6], E().out(seg(fn, 0, .3))), 'NADH', '#9CC8FF', { dy: 1.2, pr: 2 });
      const ff = fr(t * .09 + .3); B.mol(g, 'fadh2', lerp3([X0.II - 1.2, -3.2, .9], [X0.II - .4, -1.7, .6], E().out(seg(ff, 0, .3))), .7 * Math.min(1, (1 - ff) * 4), [0, t * .3, 0], aE);
      const fo = fr(t * .09 + .55), o2p = lerp3([X0.IV + 2.4, -3.4, 1.1], [X0.IV + .35, -1.8, .7], E().out(seg(fo, 0, .45)));
      if (fo < .5) { B.mol(g, 'o2', o2p, .85, [0, t, 0], aE, Pk.O); B.ficha(g, o2p, 'O₂', '#FF8A8A', { dy: 1.2, pr: 2 }); }
      else { const k = seg(fo, .5, 1), w = lerp3([X0.IV + .35, -1.8, .7], [X0.IV - 1.6, -3.6, 1.2], E().out(k)); B.mol(g, 'h2o', w, .8 * (1 - seg(k, .8, 1)), [0, t, 0], aE, Pk.O); B.mol(g, 'h2o', add(w, [.6, -.3, -.4]), .8 * (1 - seg(k, .8, 1)), [0, -t, 0], aE, Pk.O); B.ficha(g, w, 'H₂O', '#FF8A8A', { dy: 1.2, pr: 3 }); }
      g.anc.O = [X0.IV + .4, -1.8, .7]; g.vis.O = 1;
      // H⁺ bombeados pelos complexos I, III e IV
      [X0.I, X0.III, X0.IV].forEach((x, j) => { for (let i = 0; i < 2; i++) { const f = fr(t * .22 + i / 2 + j * .27); B.hmais(g, [x + (i - .5) * .5, mix(-2.4, 2.5, E().move(f)), 1.35], .9 * surge(f), aP); } });
      // gradiente: muitos H⁺ no espaço intermembranas, poucos na matriz
      const nI = Math.round(30 * gr);
      for (let i = 0; i < 30; i++) { if (i >= nI) break; const x = mix(-9 * K, 8.2 * K, hash(i, 1)), y = 1.7 + 1.5 * hash(i, 2), z = mix(-2, 1.6, hash(i, 3)); B.hmais(g, [x + Math.sin(t * .9 + i) * .15, y + Math.cos(t * .8 + i * 1.3) * .15, z], .8, .7 + .3 * aP, Pk.G); }
      for (let i = 0; i < 7; i++) B.hmais(g, [mix(-9 * K, 8.2 * K, hash(i, 7)) + Math.sin(t + i) * .2, -1.9 - 1.2 * hash(i, 8), mix(-2, 1.6, hash(i, 9))], .8, .6);
      g.vis.G = 1; g.anc.G = [X0.III - .4, 2.6, .6];
      // ATP sintase: H⁺ descem pelo estator e pelo anel; o rotor gira e forma ATP na cabeça F1
      const vel = .9 * gr; g.ang = (g.ang || 0) + (tr ? 0 : g.dt * 2.2 * vel); g.rot.rotation.y = g.ang;
      for (let i = 0; i < 3; i++) { const f = fr(t * .3 + i / 3), p = trilha([[X0.S + .95, 2.1, .4], [X0.S + .75, .7, .5], [X0.S + .6 * Math.cos(g.ang + i), 0, .6 * Math.sin(g.ang + i) + .2], [X0.S + .3, -1.0, .5], [X0.S - .2, -1.7, .7]], f); B.hmais(g, p, 1.2 * surge(f) * Math.min(1, gr * 3), aS); }
      const fa = fr(t * .2), cab = [X0.S, -2.75, 0];
      B.mol(g, 'adp', lerp3([X0.S - 2.4, -3.9, 1.1], add(cab, [-.6, -.3, .8]), E().out(seg(fa, 0, .4))), .45 * (fa < .5 ? 1 : 0) * Math.min(1, gr * 3), [0, 0, .4], aS);
      if (fa >= .5) { const k = seg(fa, .5, 1), p = lerp3(add(cab, [.3, -.5, .9]), [X0.S + 2.3, -4, 1.2], E().out(k)); B.mol(g, 'atp', p, .45 * (1 - seg(k, .85, 1)) * Math.min(1, gr * 3), [0, 0, -.3], aS); if (gr > .05) B.ficha(g, p, 'ATP', '#FFB870', { dy: 1.2, pr: 1 }); }
      else if (gr > .05) B.ficha(g, lerp3([X0.S - 2.4, -3.9, 1.1], add(cab, [-.6, -.3, .8]), E().out(seg(fa, 0, .4))), 'ADP + Pᵢ', '#C9CFDC', { dy: 1.2, pr: 3 });
      ['I', 'II', 'III', 'IV', 'S', 'Q', 'c'].forEach(id => { g.vis[id] = 1; });
      g.anc.I = [X0.I, .9, .6]; g.anc.II = [X0.II, -1.3, .6]; g.anc.III = [X0.III, 1, .5]; g.anc.IV = [X0.IV, .95, .5]; g.anc.S = [X0.S, -3.1, .4];
      g.anc.Q = g.Q.position.toArray(); g.anc.c = g.c.position.toArray();
    },
    camera(g) { const dep = B.deitado(g); return B.viva(dep ? { th: .06, fi: .3, d: B.enquadrar(g, 9.9, 4.6), al: [-.2, -.5, 0] } : { th: .3, fi: .06, d: B.enquadrar(g, 4.6, 9), al: [-.5, .3, 0] }, g.t, .8); },
    sobre(g) {
      const host = document.getElementById('cadHs'); if (host && !host.hidden) host.hidden = true;
      const S = g.S, st = g.st, et = document.getElementById('etapas');
      if (et) { if (et.hidden) et.hidden = false; const k = st + (S.man == null ? 10 : 0); if (g.chip !== k) { g.chip = k; et.querySelectorAll('button').forEach(b => { const e = b.dataset.e, on = e === 'auto' ? S.man == null : S.man === +e; b.setAttribute('aria-pressed', on); b.classList.toggle('cur', e !== 'auto' && +e === st); }); } }
      B.texto(g, [-8.9 * g.K, 3.3, 0], 'espaço intermembranas', { a: 'left', c: '#CFC9E8', s: 13 });
      B.texto(g, [-8.9 * g.K, -3.5, 0], 'matriz', { a: 'left', c: '#E3C9C0', s: 13 });
      if (g.g > .05) B.ficha(g, [g.X0.III + 1.6, 2.2, .8], 'H⁺', '#F2F4F8', { dy: 0, pr: 4 });
    },
    legenda: g => (g.S.v === 0 ? 'Sem O₂ para receber os elétrons, a cadeia para: o bombeamento de H⁺ e a produção de ATP cessam' : ['1. Os elétrons do NADH e do FADH₂ passam de proteína em proteína até o O₂, que forma água', '2. A energia liberada bombeia H⁺ da matriz para o espaço intermembranas', '3. Os H⁺ voltam pela ATP sintase, que gira e forma ATP: é a quimiosmose'][g.st])
  });
})();
