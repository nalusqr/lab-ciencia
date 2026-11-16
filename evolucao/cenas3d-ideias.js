/* LAB Origem da vida e evolução: Darwin em 3D (Martin), sobre o kit do módulo Vírus (vir3d.js), as peças da Anatomia
   (anat3d-pecas.js) e as deste módulo (evo3d-pecas.js).
   Árvore da vida navegável: os galhos crescem do passado para hoje, abrem em profundidade (gire para ver os ramos de trás),
   duas linhagens terminam em extinção e os botões A a E escolhem duas espécies atuais para acender o ancestral comum.
   Seleção natural ao vivo: besouros de cores variadas sobre um chão claro ou escuro; a ave come os que mais contrastam com o fundo
   e os sobreviventes deixam filhotes parecidos. O estado (população, geração, fundo) é o mesmo do desenho plano, que continua
   escondido; os botões sobre o palco apertam os botões dele. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.anCena) return;
  const { cl, seg, add, lerp3, hash } = V3.V;
  const RED = () => V3.REDUZ(), ach = V3.ach, cm = V3.corMix;
  const LIMA = '#A9C54A', OURO = '#F7C13B', CINZA = '#9AA3B2', AMB = '#FFB347';
  const ARV = [
    { id: 0, p: -1, x: .5, t: 0 }, { id: 1, p: 0, x: .3, t: .34 }, { id: 2, p: 0, x: .72, t: .34 },
    { id: 3, p: 1, x: .14, t: 1, tip: 1, n: 1 }, { id: 4, p: 1, x: .4, t: .62 }, { id: 5, p: 4, x: .3, t: 1, tip: 1, n: 2 }, { id: 6, p: 4, x: .52, t: .76, ext: 1 },
    { id: 7, p: 2, x: .62, t: .55 }, { id: 8, p: 2, x: .86, t: .6 }, { id: 9, p: 7, x: .56, t: 1, tip: 1, n: 3 }, { id: 10, p: 7, x: .7, t: .84, ext: 1 }, { id: 11, p: 8, x: .78, t: 1, tip: 1, n: 4 }, { id: 12, p: 8, x: .95, t: 1, tip: 1, n: 5 }
  ];
  const ZN = [0, -.55, .5, -.9, -.2, -.5, .35, .2, .9, -.15, .55, 1.25, .6];
  const pos = n => [(n.x - .5) * 5.4, n.t * 3.6 - 1.8, ZN[n.id]];
  const anc = id => { const L = []; for (let n = ARV[id]; n; n = ARV[n.p]) L.push(n.id); return L; };
  const TIPS = ARV.filter(n => n.tip);
  const PA = {
    ramo: { nome: 'Linhagem', frase: 'Cada galho é uma linhagem de populações que muda com o tempo e se divide quando surge uma espécie nova.', cor: LIMA },
    ponta: { nome: 'Espécie atual', frase: 'As pontas de cima são espécies que vivem hoje. Nenhuma é ancestral da outra: são primas.', cor: LIMA },
    ext: { nome: 'Linhagem extinta', frase: 'Galho que parou antes de hoje: a linhagem não deixou descendentes vivos.', cor: CINZA },
    anc: { nome: 'Ancestral comum', frase: 'Ponto onde duas linhagens se separaram. Quanto mais recente, mais aparentadas são as espécies.', cor: AMB },
    raiz: { nome: 'Ancestral de todas', frase: 'A base da árvore: todas as espécies do desenho descendem dele.', cor: OURO },
    eixo: { nome: 'Tempo', frase: 'De baixo, o passado, para cima, hoje.', cor: '#9DA9C4' }
  };

  V3.anCena('ideias/darwin', {
    fit: 9, raio: 5, bolas: 160, pecas: Object.assign({}, PA, {
      besouro: { nome: 'Besouro', frase: 'A cor passa de pais para filhos. Num chão claro, os escuros aparecem mais para a ave, e o contrário no escuro.', cor: '#E8D9B5' },
      ave: { nome: 'Ave predadora', frase: 'Come os besouros que mais contrastam com o fundo: é ela que faz a seleção, sem criar cor nova.', cor: '#CFE0FF' },
      chao: { nome: 'Ambiente', frase: 'O fundo não muda a cor de nenhum besouro; ele só decide quais cores ficam mais escondidas.', cor: '#BFA97E' }
    }),
    sair() { V3.anEsconde('arv'); V3.anEsconde('sel'); V3.limpa2D(); },
    rotulos: [{ pc: 'raiz', t: 'ancestral de todas', pr: 3, se: g => g.modo === 'arv' }, { pc: 'anc', t: 'ancestral comum', pr: 1, se: g => g.modo === 'arv' }, { pc: 'ext', t: 'extinta', pr: 2, se: g => g.modo === 'arv' },
      { pc: 'ave', t: 'ave', pr: 1, se: g => g.modo === 'sel' }, { pc: 'besouro', t: 'besouros variados', pr: 2, se: g => g.modo === 'sel' }],
    montar(g) {
      const T = g.T, rad = g.q.cel ? 8 : 12;
      // ---- árvore ----
      g.Ag = new T.Group(); g.raiz.add(g.Ag);
      g.br = ARV.slice(1).map(n => {
        const q = ARV[n.p], a = pos(q), b = pos(n), m = [b[0], a[1] + Math.min(.4, (b[1] - a[1]) * .45), b[2]];
        const P = V3.suave([a, lerp3(a, m, .55), m, b], 5), mat = V3.fis(g, LIMA, { p: { roughness: .5, clearcoat: .45 }, rimK: .3 });
        const tb = V3.tubo(g, P.length, rad, mat, g.Ag, n.ext ? 'ext' : 'ramo'); return { n, q, P, F: V3.fracoes(P), tb, mat };
      });
      const ex = V3.fis(g, CINZA, { p: { roughness: .5 } });
      g.cruz = ARV.filter(n => n.ext).map(n => { const gr = new T.Group(), b = pos(n); [-1, 1].forEach(k => { const c = new T.Mesh(V3.cilindro(g, 8), ex); c.scale.set(.035, .34, .035); c.rotation.z = k * .785; gr.add(c); c.userData.peca = g.pecas.ext; g.pick.push(c); }); gr.position.set(b[0], b[1] + .02, b[2]); g.Ag.add(gr); return gr; });
      const ei = new T.Mesh(V3.cilindro(g, 10), V3.fis(g, '#5B6C99', { p: { roughness: .6 } })); ei.scale.set(.025, 3.8, .025); ei.position.set(-3.3, 0, 0); g.Ag.add(ei); ei.userData.peca = g.pecas.eixo; g.pick.push(ei);
      const pt = new T.Mesh(V3.cone(g, 12), ei.material); pt.scale.set(.08, .2, .08); pt.position.set(-3.3, 2.0, 0); g.Ag.add(pt);
      g.nos = V3.inst(g, V3.esfera(g, 16), V3.fis(g, '#FFFFFF', { p: { roughness: .3, clearcoat: .8 }, rimK: .3 }), 20, g.Ag); g.pick.push(g.nos.m);
      // ---- seleção ----
      g.Sg = new T.Group(); g.raiz.add(g.Sg);
      g.chaoM = V3.fis(g, '#BFA97E', { p: { roughness: .85, clearcoat: .1 } });
      const ch = new T.Mesh(new T.BoxGeometry(6.6, .2, 4.2, 1, 1, 1), g.chaoM); g.geos.push(ch.geometry); ch.position.y = -.1; g.Sg.add(ch); ch.userData.peca = g.pecas.chao; g.pick.push(ch);
      g.bs = V3.evBichos(g, 50, 'besouro'); [g.bs.corpo.m, g.bs.olho.m].forEach(m => { g.raiz.remove(m); g.Sg.add(m); });
      g.ave = V3.evAve(g, '#CFE0FF', 'ave'); g.raiz.remove(g.ave); g.Sg.add(g.ave);
      g.bgk = null;
    },
    animar(g, P) {
      const S = P.S, rv = !RED(), info = g.pecas; g.modo = S.modo;
      const arv = S.modo !== 'sel'; g.Ag.visible = arv; g.Sg.visible = !arv;
      V3.anBotoes('arv', TIPS.map(n => ({ t: String.fromCharCode(64 + n.n), d: 'Escolher a espécie ' + String.fromCharCode(64 + n.n), on: S2 => { const pk = S2.pick || []; S2.pick = pk.includes(n.id) ? pk.filter(q => q !== n.id) : pk.length >= 2 ? [n.id] : pk.concat(n.id); }, pr: S2 => (S2.pick || []).includes(n.id) })), S, arv, 'Escolha duas espécies atuais');
      V3.anBotoes('sel', [
        { t: 'Chão claro', d: 'Fundo de areia clara', on: () => V3.evAperta(g, 'b0'), pr: S2 => !S2.bg },
        { t: 'Chão escuro', d: 'Fundo de tronco escuro', on: () => V3.evAperta(g, 'b1'), pr: S2 => !!S2.bg },
        { t: 'Sem variação', d: 'E se não houver variação de cor', on: () => V3.evAperta(g, 'nov'), pr: S2 => !!S2.nov },
        { t: 'Próxima geração', d: 'Passar para a próxima geração', on: () => V3.evAperta(g, 'ger'), pr: () => false }
      ], S, !arv, 'Seleção natural');
      // celular: as bolhas desfocadas do fundo (kit compartilhado) competem com a árvore; esconde na árvore, volta na seleção
      try { const K = window.MOL3D && window.MOL3D.visor && window.MOL3D.visor.pos;
        if (K && K.ok && K.part && K.bolas) { if (K.nBo == null) { K.nBo = K.bolas.count; K.nPa = K.part.geometry.attributes.position.count; }
          const esc = arv && Math.min(innerWidth, innerHeight) < 600; K.bolas.count = esc ? 0 : K.nBo; K.part.geometry.setDrawRange(0, esc ? Math.round(K.nPa * .25) : K.nPa); } } catch (e) { /* sem o fundo, nada a esconder */ }
      if (arv) arvore(g, S, rv, info); else selecao(g, S, rv, P.t, info);
    },
    sobre(g, S) {
      if (S.modo !== 'sel' || !S.pop) return;
      // histograma das cores: geração atual (colorida) sobre a anterior (cinza)
      const A = area(), w = Math.min(NAR ? A.w : 340, A.w), h = 64, x = A.x1 - w, y = A.y1 - h + 6, n = new Array(10).fill(0), mxv = 22, bw = (w - 20) / 10;
      S.pop.forEach(b => n[Math.min(9, Math.floor(b.v * 10))]++);
      rr(x, y, w, h, 10, 'rgba(11,15,28,.84)', C.line, 1);
      n.forEach((v, j) => { const ph = S.prevH ? S.prevH[j] : 0, hh = h - 24; if (ph) rr(x + 10 + j * bw + 1, y + h - 6 - ph / mxv * hh, bw - 2, ph / mxv * hh, 2, rgba(CINZA, .45), null); if (v) rr(x + 10 + j * bw + 4, y + h - 6 - v / mxv * hh, bw - 8, v / mxv * hh, 2, mix('#E8D9B5', '#4A4A4A', (j + .5) / 10), '#CFE0FF', 1); });
      tx('claro', x + 10, y + 11, { a: 'left', s: 12, c: C.dim, bg: false }); tx('escuro', x + w - 10, y + 11, { a: 'right', s: 12, c: C.dim, bg: false }); tx('cinza: geração anterior', x + w / 2, y + 11, { s: 12, c: CINZA, bg: false });
      V3.reserva(g, [x, y, w, h]);
    },
    camera(g, P) {
      const d = V3.deitado(g);
      if (P.S.modo === 'sel') return V3.anCam(g, P, d ? 3.5 : 3.4, d ? 2.2 : 3.2, { al: [0, -.2, .1], th: .12, fi: .78, viva: .25 });
      return V3.anCam(g, P, d ? 3.6 : 3.1, d ? 2.9 : 3.2, { al: [0, -.12, 0], th: .38, fi: .1, viva: .6 });
    }
  });

  function arvore(g, S, rv, info) {
    const p = Math.min(1, ciclo(lt(S), 12) * 1.3 + .08), pk = S.pick || [];
    const lca = pk.length === 2 ? anc(pk[0]).find(id => anc(pk[1]).includes(id)) : null;
    const hot = lca != null ? new Set([...anc(pk[0]).slice(0, anc(pk[0]).indexOf(lca) + 1), ...anc(pk[1]).slice(0, anc(pk[1]).indexOf(lca) + 1)]) : new Set();
    g.br.forEach(B => {
      const f = seg(p, B.q.t, B.n.t), k = Math.max(2, Math.round(f * (B.P.length - 1)) + 1), pts = B.P.slice(0, k);
      if (f < 1 && f > 0) pts[pts.length - 1] = V3.em(B.P, B.F, f);
      if (f <= 0) B.tb.mesh.visible = false; else B.tb.set(pts, B.n.ext ? .045 : .06);
      const on = hot.has(B.n.id); B.mat.color.set(on ? AMB : B.n.ext ? CINZA : cm(LIMA, OURO, B.q.t)); B.mat.emissive && B.mat.emissive.set(on ? '#3A2400' : '#000000');
    });
    g.cruz.forEach((c, i) => { const n = ARV.filter(m => m.ext)[i]; c.visible = seg(p, ARV[n.p].t, n.t) >= 1; if (c.visible && i === 0) ach(g, 'ext', add(pos(n), [.12, .1, 0])); });
    V3.put(g, g.nos, pos(ARV[0]), null, .12, null, null, OURO, 1, info.raiz); ach(g, 'raiz', pos(ARV[0]));
    TIPS.forEach(n => {
      if (seg(p, ARV[n.p].t, n.t) < 1) return; const on = pk.includes(n.id), b = pos(n);
      V3.put(g, g.nos, b, null, on ? .16 : .12, null, null, on ? AMB : LIMA, 1, info.ponta);
      V3.ficha(g, add(b, [0, .3, 0]), String.fromCharCode(64 + n.n), on ? AMB : '#E8EDF7', { pr: 1 });
    });
    if (lca != null) { const b = pos(ARV[lca]); V3.put(g, g.nos, b, null, .15, null, null, AMB, 1.2, info.anc); ach(g, 'anc', b); if (rv) V3.brilho(g, b, .05, '#FFE2B0', 1); }
    V3.fim(g.nos);
    V3.ficha(g, [-3.3, 2.3, 0], 'hoje', '#9DA9C4', { pr: 2 }); V3.ficha(g, [-3.3, -2.05, 0], 'passado', '#9DA9C4', { pr: 2, dy: 1 });
  }

  function selecao(g, S, rv, t, info) {
    if (!S.pop) return;
    const alvo = S.bg ? 1 : 0; g.bgk = g.bgk == null || !rv ? alvo : g.bgk + (alvo - g.bgk) * Math.min(1, (g.dt || 0) * 4);
    g.chaoM.color.set(cm('#BFA97E', '#2A211A', g.bgk));
    const k = S.ev ? cl((S.ph - S.ev.t0) / 1.3, 0, 1) : 0, bx = -4 + 8 * k;
    let marca = false;
    S.pop.forEach((b, i) => {
      const x = -2.8 + .7 * ((i % 8) + .5) + Math.sin(i * 7.1) * .12, z = -1.6 + .64 * (Math.floor(i / 8) + .5) + Math.cos(i * 3.7) * .1;
      if (S.ev && S.ev.c.has(i) && x < bx) return;
      const nasce = cl((S.ph - b.nasc) / .6, 0, 1), pula = rv && nasce < 1 ? Math.sin(nasce * Math.PI) * .12 : 0;
      V3.evBicho(g, g.bs, [x, 0, z], .17 * (.3 + .7 * nasce), Math.sin(i) * .9 + (rv ? Math.sin(t * .6 + i) * .08 : 0), cm('#E8D9B5', '#4A4A4A', b.v), info.besouro, pula);
      if (!marca && i >= 17) { ach(g, 'besouro', [x, .35, z]); marca = true; }
    });
    V3.evFimBichos(g.bs);
    g.ave.visible = !!S.ev;
    if (S.ev) { const y = 1.5 - Math.sin(k * Math.PI) * 1.05; g.ave.position.set(bx, y, .2); g.ave.rotation.set(0, 0, -Math.cos(k * Math.PI) * .35); V3.evBate(g.ave, t, rv); ach(g, 'ave', [bx, y + .3, .2]); }
    V3.ficha(g, [-3.0, .25, -2.0], `geração ${S.gen}`, '#E8EDF7', { pr: 1 });
  }
})();
