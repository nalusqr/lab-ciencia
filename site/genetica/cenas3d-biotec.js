/* LAB Genética: cena 3D de biotecnologia (Martin). DNA recombinante: o gene da insulina humana sai do DNA humano,
   a enzima de restrição corta o plasmídeo, o gene entra na abertura (só se as pontas combinarem) e a bactéria
   transgênica se divide e passa a fabricar insulina. O passo e a enzima vêm do tópico 2D (novos-b.js), que continua
   desenhando por baixo para manter o painel em dia e serve de plano B sem WebGL. */
'use strict';
(function () {
  const G3 = window.GEN3D; if (!G3) return;
  const { C, COR, ease, move } = G3, { cl, mix, seg, add } = C.V;
  const AZ = '#4B7BFF', TEAL = '#2FCFBF';
  const PB = {
    dna: { nome: 'DNA humano', cor: AZ, frase: 'Trecho de um cromossomo humano. Dentro dele está o gene da insulina.' },
    gene: { nome: 'Gene da insulina', cor: COR.amb, frase: 'Trecho de DNA com a receita da insulina humana, o hormônio que falta em quem tem diabetes tipo 1. Na prática, usa-se uma cópia sem íntrons (DNA complementar), porque a bactéria não remove íntrons.' },
    pla: { nome: 'Plasmídeo', cor: AZ, frase: 'Pequeno DNA circular de bactéria, que se copia sozinho. Serve de vetor para levar o gene.' },
    enz: { nome: 'Enzima de restrição', cor: COR.mae, frase: 'Corta o DNA numa sequência específica, como GAATTC, e deixa pontas em degrau, as pontas coesivas.' },
    lig: { nome: 'Junção colada pela DNA ligase', cor: '#FFE7BD', frase: 'A ligase fecha as ligações entre o gene e o plasmídeo: nasce o DNA recombinante.' },
    bac: { nome: 'Bactéria transgênica', cor: TEAL, frase: 'Recebeu o plasmídeo com o gene humano. Ao se dividir, passa o plasmídeo para as filhas.' },
    ins: { nome: 'Insulina', cor: '#FFE1A6', frase: 'Proteína fabricada pela bactéria a partir do gene humano.' }
  };
  const RP = 3.1, CY = -1.6, YD = 4.4, GW = 1.6;   // raio e centro do plasmídeo, altura do DNA humano, meia largura do gene
  const arco = (a0, a1, n, r, c) => { const o = []; for (let i = 0; i < n; i++) { const a = mix(a0, a1, i / (n - 1)); o.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r, c[2] || 0]); } return o; };
  const reta = (x0, x1, y, n) => { const o = []; for (let i = 0; i < n; i++) o.push([mix(x0, x1, i / (n - 1)), y, 0]); return o; };
  const rr = r => (i, n) => r * Math.sqrt(Math.max(.15, Math.min(1, i / 1.5, (n - 1 - i) / 1.5)));
  G3.registrar('biotec/recombinante', G3.cena({
    t: 'DNA recombinante', pecas: PB, chama2D: true, caixa: [8.6, 6.4, 1], vista: { th: -.2, fi: .2 }, alvo: () => [0, .4, 0],
    rotulos: [{ pc: 'dna', t: 'DNA humano', pr: 2 }, { pc: 'gene', t: 'gene da insulina', pr: 1 }, { pc: 'pla', t: 'plasmídeo', pr: 1 }, { pc: 'enz', t: 'enzima de restrição', pr: 2 }, { pc: 'bac', t: 'bactéria', pr: 1 }, { pc: 'ins', t: 'insulina', pr: 3 }],
    montar(g) {
      const mat = c => C.fis(g, c, { p: { roughness: .4, clearcoat: .6, sheen: .4 }, rimK: .3 }), tb = (c, pc, n) => { const t = C.tubo(g, n || 40, g.q.cel ? 10 : 14, mat(c), g.raiz, pc); g.pick.push(t.mesh); return t; };
      g.dL = tb(AZ, PB.dna); g.dR = tb(AZ, PB.dna); g.gn = tb(COR.amb, PB.gene); g.pl = tb(AZ, PB.pla, 60);
      g.enz = C.inst(g, C.lumpy(g, 'gen-enz', 7, 2, 5, .3, .5, .9), C.fis(g, COR.mae, { p: { roughness: .5, sheen: .5, sheenColor: new g.T.Color('#D9C9FF') }, rimK: .3 }), 3); g.pick.push(g.enz.m);
      g.lig = C.inst(g, C.esfera(g, 16), C.emis(g, '#FFE7BD', 1.6), 2); g.pick.push(g.lig.m);
      g.bac = []; for (let i = 0; i < 8; i++) { const m = C.filme(g, TEAL, { cor2: '#C8FFF6', dentro: '#12302E', base: .05, fr: .55, esc: .6 }), me = new g.T.Mesh(C.capsula(g, .62, .55, g.q.cel ? 18 : 26), m); me.rotation.z = Math.PI / 2; me.userData.peca = PB.bac; g.raiz.add(me); g.pick.push(me); g.bac.push(me); }
      g.mini = C.inst(g, new g.T.TorusGeometry(.32, .07, 8, 24), C.fis(g, AZ, { p: { roughness: .4 }, rimK: .2 }), 8); g.geos.push(g.mini.m.geometry);
      g.miniG = C.inst(g, C.esfera(g, 10), C.fis(g, COR.amb, { p: { roughness: .4 } }), 8);
      g.ins = C.inst(g, C.esfera(g, 10), C.fis(g, '#FFE1A6', { p: { roughness: .35, clearcoat: .6 }, rimK: .2 }), 40); g.pick.push(g.ins.m);
      g.chave = null; g.t0 = 0;
    },
    animar(g) {
      const st = g.st, e = st.step, same = st.enz === 'same', ch = e + st.enz;
      if (ch !== g.chave) { g.chave = ch; g.t0 = g.clk; }
      const p = G3.RED() ? 99 : g.clk - g.t0, cort = e === 0 ? 0 : e === 1 ? ease(.5, 1.3, p) : 1;
      const vis = { dna: 0, gene: 0, pla: 0, enz: 0, bac: 0, ins: 0 }; g.marca = null;
      const bacOn = e === 3;
      [g.dL, g.dR, g.gn, g.pl].forEach(t => { t.mesh.visible = !bacOn; });
      if (!bacOn) {
        // DNA humano: dois braços azuis e o gene, que se afasta depois do corte
        const ab = .22 * cort;
        g.dL.set(reta(-8.2, -GW - ab, YD, 20), rr(.3)); g.dR.set(reta(GW + ab, 8.2, YD, 20), rr(.3));
        const ida = e < 2 ? 0 : same ? move(0, 1.6, p) : move(0, 1.1, p) * .55, yg = mix(YD, CY + RP, ida);
        const junto = e === 2 && same && p > 1.6;
        // plasmídeo: abre um vão no alto do tamanho do gene; com o gene dentro, fecha
        const a = GW / RP, vao = e >= 1 && !junto ? a * cort : 0, top = Math.PI / 2;
        g.pl.set(arco(top + vao, top - vao + Math.PI * 2, 56, RP, [0, CY, 0]), vao > .01 ? rr(.3) : () => .3);
        if (junto) g.gn.set(arco(top + a, top - a, 16, RP, [0, CY, 0]), () => .32);
        else g.gn.set(reta(-GW + .05, GW - .05, yg, 14).map(q => [q[0], q[1] + (1 - Math.abs(q[0]) / GW) * .25 * Math.sin(ida * Math.PI), q[2]]), rr(.32));
        // enzimas no passo de corte
        if (e === 1) { const k = ease(0, .5, p) * (1 - ease(1.6, 2.2, p)); if (k > .02) [[-GW, YD + 1], [GW, YD + 1], [0, CY + RP + 1]].forEach(([x, y], i) => C.put(g, g.enz, [x * (1 + .1 * cort), y - .3 * Math.sin(cl(p * 3, 0, Math.PI)), .2], null, .55 * k, null, null, COR.mae, 1, PB.enz)); vis.enz = k > .5; g.anc.enz = [0, CY + RP + 1.8, 0]; }
        // DNA ligase: brilho nas duas junções
        if (junto) { const k = ease(1.6, 2, p) * (1 - ease(2.6, 3.4, p)); if (k > .02) [-1, 1].forEach(s => C.put(g, g.lig, [Math.cos(top + s * a) * RP, CY + Math.sin(top + s * a) * RP, .3], null, .42 * k, null, null, '#FFE7BD', 1, PB.lig)); }
        if (e === 2 && !same && p > 1.1) g.marca = [0, (yg + CY + RP) / 2, .5];
        g.anc.dna = [-6, YD + .7, 0]; g.anc.gene = [0, yg + .8, 0]; g.anc.pla = [-RP - .4, CY - 1.6, 0];
        Object.assign(vis, { dna: 1, gene: 1, pla: 1 });
        g.bac.forEach(b => { b.visible = false; });
      } else {
        // bactérias: 1, 2, 4 e 8 em cerca de 3 s; cada uma com o plasmídeo e soltando insulina
        const k = Math.min(3, Math.floor(cl(p / 3.4, 0, .999) * 4)), n = 2 ** k, fr = p >= 3.4 ? 1 : cl(p / 3.4 * 4 - k, 0, 1), tt = k === 0 ? 1 : move(0, .6, fr);
        const pos = (i, m) => { const cols = Math.min(m, 4), rows = Math.ceil(m / 4), c = i % 4, r = Math.floor(i / 4); return [(c - (cols - 1) / 2) * 3.4, (r - (rows - 1) / 2) * 2.6 + .2, 0]; };
        g.bac.forEach((b, i) => {
          b.visible = i < n; if (!b.visible) return;
          let q = pos(i, n), es = 1; if (k > 0) { const src = i < n / 2 ? pos(i, n / 2) : pos(i - n / 2, n / 2); q = [mix(src[0], q[0], tt), mix(src[1], q[1], tt), 0]; if (i >= n / 2) es = tt; }
          b.position.set(q[0], q[1], q[2]); b.scale.setScalar(1.55 * (.4 + .6 * es)); b.material.uniforms.uT.value = g.clk; b.material.uniforms.uSel.value = g.sel === 'bac' ? .6 : 0;
          C.put(g, g.mini, add(q, [-.5, 0, .1]), null, es, null, null, AZ, 1, PB.pla); C.put(g, g.miniG, add(q, [-.5, .32, .1]), null, .12 * es, null, null, COR.amb, 1, PB.gene);
          if (p > 1) for (let j = 0; j < 3; j++) { const ph = G3.RED() ? .3 + j * .25 : ((g.clk * .45 + j * .33 + i * .17) % 1); C.put(g, g.ins, add(q, [.4 + j * .35, .9 + ph * 1.4, .1]), null, .14 * (1 - ph * .5) * es, null, null, '#FFE1A6', 1, PB.ins); }
        });
        g.anc.bac = add(pos(0, n), [0, 1.2, 0]); g.anc.ins = add(pos(n - 1, n), [1.2, 2.2, 0]); vis.bac = 1; vis.ins = p > 1.5;
        g.nb = p >= 3.4 ? 8 : n;
      }
      g.vis = vis;
    },
    sobre(g, X, W, H) {
      const st = g.st, e = st.step, same = st.enz === 'same', nar = W < 520;
      if (e === 0) { G3.etiqueta(g, X, [-GW, YD - .9, .3], 'GAATTC', { s: nar ? 12 : 13, c: TEAL }); G3.etiqueta(g, X, [GW, YD - .9, .3], 'GAATTC', { s: nar ? 12 : 13, c: TEAL }); G3.etiqueta(g, X, [0, CY + RP - .95, .3], same ? 'GAATTC' : 'GGATCC', { s: nar ? 12 : 13, c: same ? TEAL : '#C8B6FF' }); }
      if (g.marca) { const t = C.tela(g, g.marca); X.strokeStyle = '#FF6B7D'; X.lineWidth = 3; X.lineCap = 'round'; X.beginPath(); X.moveTo(t[0] - 10, t[1] - 10); X.lineTo(t[0] + 10, t[1] + 10); X.moveTo(t[0] + 10, t[1] - 10); X.lineTo(t[0] - 10, t[1] + 10); X.stroke(); }
      if (e === 3) G3.texto(X, 'bactérias com o gene: ' + (g.nb || 1), W / 2, 58, { s: 17, w: 700, c: COR.amb, f: G3.FH });
      const L = [same ? 'O DNA humano e o plasmídeo têm o mesmo ponto de corte, GAATTC' : 'Cada DNA tem um ponto de corte diferente: GAATTC no humano e GGATCC no plasmídeo',
        same ? 'A enzima de restrição corta nas marcas e deixa pontas em degrau' : 'Duas enzimas cortam em marcas diferentes, e as pontas ficam diferentes',
        same ? 'O gene entra na abertura e a DNA ligase cola as junções' : 'As pontas não combinam: é preciso cortar os dois DNAs com a mesma enzima',
        'Cada bactéria vira uma pequena fábrica de insulina humana'][e];
      G3.legenda(X, W, H, L);
    }
  }));
})();
