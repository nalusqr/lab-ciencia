/* LAB Genética: cenas 3D de Mendel (Martin). Gene e alelo (par de homólogos com o loco aceso) e quadro de Punnett
   em 3D, com os gametas de cada um dos pais indo até as casas e se juntando no descendente.
   O quadro em 3D (GEN3D.punnett) também serve à herança ligada ao X (cenas3d-cromossomos.js). */
'use strict';
(function () {
  const G3 = window.GEN3D; if (!G3) return;
  const { C, COR, ease, move, up } = G3, { cl, mix, seg, add } = C.V;

  // ================= conceitos/gene: o mesmo loco em dois homólogos =================
  const PG = {
    crP: { nome: 'Cromossomo que veio do pai', cor: COR.pai, frase: 'Um dos homólogos do par. Azul: veio do pai, pelo gameta masculino, que na ervilha está no grão de pólen.' },
    crM: { nome: 'Cromossomo que veio da mãe', cor: COR.mae, frase: 'O outro homólogo. Violeta: veio da mãe, pelo gameta feminino, dentro do óvulo da flor. Tem os mesmos genes, na mesma ordem.' },
    loco: { nome: 'Loco do gene', cor: COR.amb, frase: 'Lugar fixo do gene no cromossomo. Cada homólogo guarda um alelo nesse loco: um veio do pai e outro da mãe.' },
    alD: { nome: 'Alelo V (dominante)', cor: COR.dom, frase: 'Versão do gene que dá semente amarela. Basta uma dose para a cor aparecer.' },
    alR: { nome: 'Alelo v (recessivo)', cor: COR.rec, frase: 'Versão do gene que dá semente verde. Só aparece em dose dupla, vv.' },
    sem: { nome: 'Semente (fenótipo)', cor: COR.dom, frase: 'A cor que se vê é o fenótipo: resultado dos dois alelos, junto com o ambiente.' }
  };
  G3.registrar('conceitos/gene', G3.cena({
    t: 'Gene e alelo', pecas: PG, caixa: [6.8, 5.4], vista: { th: -.28, fi: .14 }, alvo: () => [1.1, 1.3, 0],
    rotulos: [{ pc: 'crP', t: 'do pai', pr: 2 }, { pc: 'crM', t: 'da mãe', pr: 2 }, { pc: 'loco', t: 'loco do gene', pr: 1 }, { pc: 'sem', t: 'semente', pr: 3 }],
    montar(g) { g.cP = G3.cromossomo(g, PG.crP); g.cM = G3.cromossomo(g, PG.crM); g.ev = G3.bolas(g, 2); g.ev.m.userData.info[0] = PG.sem; },
    animar(g) {
      const A = g.A, gt = g.st.g, L = 9, cen = .36, fl = .7, e = move(0, .9, A), xs = mix(4.2, 1.6, e);
      const lado = [[-xs, gt[0], COR.pai, g.cP, PG.crP], [xs, gt[1], COR.mae, g.cM, PG.crM]];
      g.pos = [];
      lado.forEach(([x, al, cor, cr, pc]) => {
        const b = [x, .4, 0], info = up(al) ? PG.alD : PG.alR;
        cr.set(b, [0, 1, 0], L, { n: 1, r: .55, cor, cen, bandas: [[fl, up(al) ? COR.dom : COR.rec, info]], peca: pc });
        g.pos.push([G3.pontoFaixa(b, [0, 1, 0], L, fl, cen), al]);
      });
      const dom = gt.includes('V'), k = ease(.8, 1.5, A), pe = [5.4, -2.6, .4];
      PG.sem.cor = dom ? COR.dom : COR.rec;
      if (k > .01) C.put(g, g.ev, pe, null, 1.25 * k, null, null, dom ? COR.dom : COR.rec, 1, PG.sem);
      g.anc.crP = [-xs, .4 + L * (1 - cen) * .92, 0]; g.anc.crM = [xs, .4 + L * (1 - cen) * .92, 0];
      g.anc.loco = [0, g.pos[0][0][1] + 1.1, 0]; g.anc.sem = add(pe, [0, 1.3, 0]);
      g.vis = { crP: 1, crM: 1, loco: e > .9, sem: k > .5 };
    },
    sobre(g, X, W, H) {
      const A = g.A, a = ease(.5, 1, A), gt = g.st.g;
      if (a > 0 && g.pos) {
        // anel âmbar no loco: 2 pulsos ao abrir, depois fica parado
        g.pos.forEach(([p, al], i) => {
          const t = C.tela(g, p); X.globalAlpha = a;
          const pul = G3.RED() ? 0 : Math.max(0, Math.sin(cl((A - 1) / 2.4, 0, 1) * Math.PI * 2) * .5);
          X.beginPath(); X.arc(t[0], t[1], 20 + pul * 8, 0, Math.PI * 2); X.strokeStyle = 'rgba(255,179,71,.8)'; X.lineWidth = 2; X.stroke();
          G3.etiqueta(g, X, p, al, { dx: (i ? 1 : -1) * 44, s: 20, c: up(al) ? COR.dom : COR.rec, a });
        });
        X.globalAlpha = 1;
      }
      G3.legenda(X, W, H, gt === 'Vv' ? 'Alelos diferentes no mesmo loco: heterozigoto, semente amarela' : gt === 'VV' ? 'Dois alelos V no mesmo loco: homozigoto, semente amarela' : 'Dois alelos v no mesmo loco: homozigoto, semente verde');
    }
  }));

  // ================= quadro de Punnett em 3D (genérico) =================
  // cfg: ga(st) gametas das colunas; gb(st) gametas das linhas; kid(a, b); gameta(g, W, p, al, col, info); filho(g, k, p, esc, gen);
  //      etiquetaFilho(gen) -> { t, c }; cab(st) -> [colunas, linhas]; resumo(st, gens) -> texto; pecas; rotulos; montar(g)
  const PASSO = .62, JANELA = 1.15, ATE = .55;
  const fimQuadro = n => ATE + (n - 1) * PASSO + JANELA;
  function punnett(cfg) {
    const P = cfg.pecas;
    const geo = () => { const s = 4.3; return { s, cx: j => (j - .5) * s + .8, cy: i => -(i - .5) * s - 1, gy: 5.35, gx: (-.5 * s + .8) - s * .98 }; };
    return G3.cena({
      t: cfg.t, pecas: P, rotulos: cfg.rotulos, caixa: [8.4, 8.4, 1], vista: { th: -.2, fi: .24 }, alvo: () => [-.7, .9, 0],
      montar(g) { g.pl = G3.placas(g, 4); g.gm = G3.bolas(g, 24); if (cfg.montar) cfg.montar(g); },
      animar(g) {
        const A = g.A, st = g.st, ga = cfg.ga(st), gb = cfg.gb(st), Q = geo(), z0 = .4, ap = ease(0, .5, A);
        g.cel = []; g.gam = [];
        for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
          const k = i * 2 + j, u = seg(A, ATE + k * PASSO, ATE + k * PASSO + JANELA), p = [Q.cx(j), Q.cy(i), 0];
          C.put(g, g.pl, [p[0], p[1], -.55], null, Q.s * .47, Q.s * .47, 1, u > .7 ? '#26324F' : '#1B2440', 1, P.casa);
          const ca = [Q.cx(j), Q.gy, z0], li = [Q.gx, Q.cy(i), z0], m = move(0, .62, u), f = ease(.55, .9, u), alvo = [p[0], p[1] + .2, z0];
          if (u > 0 && f < 1) {
            const e = 1 - f;
            cfg.gameta(g, g.gm, [mix(ca[0], alvo[0] - .45 * e, m), mix(ca[1], alvo[1], m), z0 + .3 * Math.sin(m * Math.PI)], ga[j], 1, e);
            cfg.gameta(g, g.gm, [mix(li[0], alvo[0] + .45 * e, m), mix(li[1], alvo[1], m), z0 + .3 * Math.sin(m * Math.PI)], gb[i], 0, e);
          }
          const gen = cfg.kid(ga[j], gb[i]);
          if (f > .01) cfg.filho(g, k, [p[0], p[1] + .25, z0], f, gen);
          g.cel.push({ p, gen, f, u });
        }
        ga.forEach((al, j) => { const p = [Q.cx(j), Q.gy, z0]; cfg.gameta(g, g.gm, p, al, 1, ap); g.gam.push([p, al, 1]); });
        gb.forEach((al, i) => { const p = [Q.gx, Q.cy(i), z0]; cfg.gameta(g, g.gm, p, al, 0, ap); g.gam.push([p, al, 0]); });
        g.anc.gameta = add(g.gam[3][0], [-.2, -1.2, 0]); g.anc.casa = [Q.cx(1) + 1.5, Q.cy(1) - 1.5, 0]; g.anc.filho = add(g.cel[0].p, [0, 1.6, .4]);
        g.vis = { gameta: ap > .5, casa: 1, filho: g.cel[0].f > .8 };
        if (cfg.animar) cfg.animar(g);
      },
      sobre(g, X, W, H) {
        if (!g.cel) return;
        const st = g.st, Q = geo(), [la, lb] = cfg.cab(st), nar = W < 520;
        const t1 = C.tela(g, [Q.cx(.5), Q.gy + 1.35, .4]), t2 = C.tela(g, [Q.gx, Q.cy(0) + 1.5, .4]);
        G3.texto(X, la, t1[0], t1[1], { s: 13, c: COR.dim }); G3.texto(X, lb, t2[0], t2[1] - 2, { s: 13, c: COR.dim, a: t2[0] < 70 ? 'left' : 'center' });
        g.gam.forEach(([p, al]) => G3.etiqueta(g, X, p, al, { s: nar ? 14 : 16, a: ease(0, .5, g.A) }));
        g.cel.forEach(c => { if (c.f < .3) return; const e = cfg.etiquetaFilho(c.gen); G3.etiqueta(g, X, [c.p[0], c.p[1] - 1.45, .4], c.gen, { s: nar ? 14 : 16, a: ease(.3, 1, c.f) }); if (e && !nar) G3.etiqueta(g, X, [c.p[0], c.p[1] - 1.45, .4], e.t, { gen: false, s: 12, dy: 22, c: e.c, w: 600, fundo: 'rgba(11,15,28,.0)', a: ease(.5, 1, c.f) }); });
        const fim = g.A >= fimQuadro(4);
        G3.legenda(X, W, H, fim ? cfg.resumo(st, g.cel.map(c => c.gen)) : 'Cada gameta de um dos pais encontra cada gameta do outro: quatro encontros igualmente prováveis');
      }
    });
  }
  G3.punnett = punnett;
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  G3.razao = ns => { const g0 = ns.reduce((a, b) => gcd(a, b)); return ns.map(n => n / g0); };

  // ================= lei1/punnett: ervilhas, cor da semente =================
  const PP = {
    gameta: { nome: 'Gameta', cor: COR.gelo, frase: 'Cada gameta leva só um alelo do gene: os dois alelos se separaram na meiose. É a 1ª lei de Mendel.' },
    casa: { nome: 'Casa do quadro', cor: '#5B6C99', frase: 'Um encontro possível de um gameta de cada um dos pais. As quatro casas têm a mesma chance, 1/4 cada.' },
    filho: { nome: 'Semente do descendente', cor: COR.dom, frase: 'Amarela se tiver pelo menos um alelo V; verde só se for vv.' },
    alD: { nome: 'Gameta com o alelo V', cor: COR.dom, frase: 'Leva o alelo dominante, da semente amarela.' },
    alR: { nome: 'Gameta com o alelo v', cor: COR.rec, frase: 'Leva o alelo recessivo, da semente verde.' }
  };
  const kid1 = (a, b) => (up(a) || !up(b) ? a + b : b + a);
  G3.registrar('lei1/punnett', punnett({
    t: 'Quadro de Punnett', pecas: PP,
    rotulos: [{ pc: 'gameta', t: 'gameta', pr: 2 }, { pc: 'casa', t: 'encontro de gametas', pr: 3 }, { pc: 'filho', t: 'descendente', pr: 1 }],
    ga: st => [st.a[0], st.a[1]], gb: st => [st.b[0], st.b[1]], kid: kid1,
    cab: st => ['gametas de ' + st.a, 'gametas de ' + st.b],
    gameta(g, W, p, al, col, e) { if (e > .01) C.put(g, W, p, null, .62 * e, null, null, up(al) ? COR.dom : COR.rec, .95, up(al) ? PP.alD : PP.alR); },
    filho(g, k, p, f, gen) { const d = gen.includes('V'); C.put(g, g.gm, p, null, 1.12 * f, null, null, d ? COR.dom : COR.rec, 1, PP.filho); },
    etiquetaFilho: gen => gen.includes('V') ? { t: 'amarela', c: COR.dom } : { t: 'verde', c: '#7FE0A2' },
    resumo(st, gens) {
      const am = gens.filter(x => x.includes('V')).length, vd = 4 - am, tg = {}; gens.forEach(x => { tg[x] = (tg[x] || 0) + 1; });
      const rf = G3.razao([am || 1, vd || 1]), ph = am && vd ? `${rf[0]} ${rf[0] === 1 ? 'amarela' : 'amarelas'} : ${rf[1]} ${rf[1] === 1 ? 'verde' : 'verdes'}` : am ? 'todas amarelas' : 'todas verdes';
      const gs = ['VV', 'Vv', 'vv'].filter(x => tg[x]), rz = G3.razao(gs.map(x => tg[x]));
      return 'Fenótipos: ' + ph + '. Genótipos: ' + gs.map((x, i) => rz[i] + ' ' + x).join(' : ');
    }
  }));
})();
