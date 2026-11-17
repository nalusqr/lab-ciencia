/* LAB Embriologia: cenas 3D do início do desenvolvimento (Martin). Segmentação com as clivagens animadas (holoblástica
   igual e desigual, meroblástica discoidal e superficial), mórula com compactação, blástula em corte com a blastocele à
   vista, gástrula com a invaginação e as três camadas em volume, e o destino do blastóporo em protostômios e
   deuterostômios. Usa o kit embrio3d.js; a cena 2D antiga fica como plano B sem WebGL. */
'use strict';
(function () {
  const E3 = window.EMB3D; if (!E3) return;
  const { V, K } = E3, { cl, mix, seg, sst, TAU, hash, nrm, add, mul, len } = V;
  const cam = (g, P, hx, hy, o = {}) => E3.viva({ th: o.th == null ? .22 : o.th, fi: o.fi == null ? .12 : o.fi, d: E3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .7 : o.viva);
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const PIG = '#6E6A72', CLARO = '#EDE6DA';
  const fib = (i, n) => { const y = 1 - (i + .5) / n * 2, r = Math.sqrt(1 - y * y), a = i * 2.39996; return [Math.cos(a) * r, y, Math.sin(a) * r]; };
  // painel de título no canto (tipo, organismo, etapa)
  function painel(g, l1, l2, l3) {
    const x = NAR ? 12 : 28, y = NAR ? 58 : 82;
    tx(l1, x, y, { f: FH, s: NAR ? 16 : 19, w: 600, a: 'left', c: C.txt });
    if (l2) tx(l2, x, y + (NAR ? 21 : 25), { s: 13, w: 600, a: 'left', c: C.txt });
    if (l3) tx(l3, x, y + (NAR ? 40 : 46), { s: 12, a: 'left', c: C.dim });
    E3.reserva(g, [x - 4, y - 14, Math.max(tw(l1, NAR ? 16 : 19, 600, FH), l2 ? tw(l2, 13, 600) : 0, l3 ? tw(l3, 12) : 0) + 12, l3 ? (NAR ? 66 : 76) : 44]);
  }

  // ---------- árvore de clivagens: posições e raios por nível (0 a 6) ----------
  // eixos: 1ª e 2ª meridionais (x, z), 3ª equatorial (y), e assim por diante
  function arvore(R, desigual) {
    const ax = [[1, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0], [0, 0, 1], [0, 1, 0]], N = [[{ p: [0, 0, 0], r: R * .97, f: 1 }]];
    for (let k = 1; k <= 6; k++) {
      const L = [], rk = R * .97 * Math.pow(2, -k / 3) * .98, a = ax[k - 1];
      N[k - 1].forEach(c => {
        let ka = 1, kb = 1, oa = 1, ob = 1;
        if (desigual && a[1]) { ka = .8; kb = 1.16; oa = .78; ob = 1.15; }        // equatorial deslocada para o polo animal
        L.push({ p: add(c.p, mul(a, rk * .98 * oa * c.f)), r: rk * c.f * ka, f: c.f * ka }, { p: add(c.p, mul(a, -rk * .98 * ob * c.f)), r: rk * c.f * kb, f: c.f * kb });
      });
      // aproxima do contorno esférico (a partir de 16 células o grupo fica redondo, não em caixa)
      if (k >= 4) { const mx = Math.max(...L.map(c => len(c.p))); L.forEach(c => { c.p = mul(nrm(c.p), mix(len(c.p), mx, .75)); }); }
      const m = Math.max(...L.map(c => len(c.p) + c.r)), s = R / m;
      L.forEach(c => { c.p = mul(c.p, s); c.r *= s * .97; });
      N.push(L);
    }
    return N;
  }
  const corDe = (c, desigual, R, i) => desigual ? (c.p[1] > R * .05 ? PIG : c.p[1] > -R * .2 ? '#B9926A' : K.vitelo) : (i % 3 ? K.ovo : '#D4D9E4');

  // =====================================================================================
  // SEGMENTAÇÃO
  // =====================================================================================
  const TIP = [['Holoblástica igual', 'ovo oligolécito', 'ouriço-do-mar, anfioxo, mamíferos'], ['Holoblástica desigual', 'ovo heterolécito', 'anfíbios (rã, sapo)'], ['Meroblástica discoidal', 'ovo telolécito', 'aves, répteis, maioria dos peixes'], ['Meroblástica superficial', 'ovo centrolécito', 'insetos e outros artrópodes']];
  E3.cena('desenvolvimento/segmentacao', {
    fit: 14, raio: 5, bolas: 80,
    pecas: {
      bl: { nome: 'Blastômeros', frase: 'Células formadas pelas clivagens. O embrião não cresce: as células ficam menores a cada divisão.', cor: K.ovo },
      mi: { nome: 'Micrômeros', frase: 'Blastômeros pequenos do polo animal, onde há pouco vitelo e as divisões são mais rápidas.', cor: PIG },
      ma: { nome: 'Macrômeros', frase: 'Blastômeros grandes do polo vegetativo, cheios de vitelo, que se dividem mais devagar.', cor: K.vitelo },
      gema: { nome: 'Vitelo', frase: 'Não se divide: só a cicatrícula (ou a periferia, no inseto) forma células.', cor: K.vitelo },
      disco: { nome: 'Blastodisco', frase: 'Disco de células sobre a gema, formado pela segmentação meroblástica discoidal.', cor: CLARO },
      nuc: { nome: 'Núcleos', frase: 'No ovo de inseto, os núcleos se dividem sem dividir o citoplasma e depois migram para a periferia.', cor: K.nucleo }
    },
    rotulos: [{ pc: 'bl', t: 'blastômero' }, { pc: 'mi', t: 'micrômeros' }, { pc: 'ma', t: 'macrômeros' }, { pc: 'disco', t: 'blastodisco' }, { pc: 'gema', t: 'vitelo' }, { pc: 'nuc', t: 'núcleos' }],
    montar(g) {
      const R = 3; g.R = R; g.N = [arvore(R, false), arvore(R, true)];
      g.W = E3.celulas(g, 140, {});
      g.gema = E3.peca(g, E3.esfera(g, 48), E3.fis(g, K.vitelo, { p: { roughness: .5, clearcoat: .5 } }), 'gema');
      g.pl = E3.corte(g, g.raiz);
      g.ins = E3.peca(g, E3.esfera(g, 48), E3.filme(g, '#E8EEF8', { cor2: '#FFFFFF', dentro: '#3A3528', base: .08, fr: .6, planos: null }), 'gema'); g.ins.renderOrder = 4;
      g.gin = E3.solido(g, E3.esfera(g, 40), K.vitelo, [g.pl], { pc: 'gema', corte: '#E9A64A' });
    },
    animar(g, P) {
      const S = P.S, R = g.R, ti = S.tipo || 0, v = V.degraus(S.v, 5), k = Math.min(5, Math.floor(v)), f = v - k, W = g.W; g.ti = ti;
      g.gema.visible = ti === 2; g.ins.visible = g.gin.visible = ti === 3;
      if (ti < 2) {
        const N = g.N[ti], des = ti === 1;
        if (f < .001 || k >= 5) N[k].forEach((c, i) => E3.celula(g, W, c.p, c.r, corDe(c, des, R, i), { pc: g.pecas[des ? (c.p[1] > 0 ? 'mi' : 'ma') : 'bl'], k: .95 + .1 * hash(i, k) }));
        else N[k].forEach((c, i) => { const a = N[k + 1][2 * i], b = N[k + 1][2 * i + 1]; E3.divide(g, W, c.p, c.r, a.p, a.r, b.p, b.r, f, corDe(c, des, R, i), { pc: g.pecas[des ? (c.p[1] > 0 ? 'mi' : 'ma') : 'bl'], ha: corDe(a, des, R, 2 * i), hb: corDe(b, des, R, 2 * i + 1) }); });
        if (des && k >= 3) { ach(g, 'mi', [R * .3, R * .85, R * .3]); ach(g, 'ma', [R * .5, -R * .7, R * .4]); } else ach(g, 'bl', [R * .55, R * .55, R * .5]);
      } else if (ti === 2) {
        // gema enorme; só a cicatrícula se divide
        g.gema.scale.setScalar(R * 1.05); g.gema.position.set(0, -R * .25, 0);
        const n = 2 ** k, n2 = 2 ** Math.min(5, k + 1), top = R * .8 + .02, rc = mix(.42, .2, k / 5);
        const lugar = (i, n) => { if (n === 1) return [0, 0]; const anel = i < 4 ? 0 : i < 12 ? 1 : 2, j = anel ? (anel === 1 ? i - 4 : i - 12) : i, m = anel ? (anel === 1 ? 8 : 20) : Math.min(4, n), rr = anel * .62 + (n > 1 ? .36 : 0); return [Math.cos(j / m * TAU + anel * .3) * rr, Math.sin(j / m * TAU + anel * .3) * rr]; };
        for (let i = 0; i < n2; i++) {
          const nasc = i >= n, kk = nasc ? f : 1; if (kk <= .01 && nasc) continue;
          const [x, z] = lugar(i, n2), [x0, z0] = lugar(i >> 1, n), xx = nasc ? mix(x0, x, E3.E().move(f)) : mix(lugar(i, n)[0], x, f), zz = nasc ? mix(z0, z, E3.E().move(f)) : mix(lugar(i, n)[1], z, f);
          const y = top + R * .02 - (xx * xx + zz * zz) * .06;
          E3.celula(g, W, [xx, y, zz], rc * (nasc ? mix(.6, 1, kk) : 1), i % 3 ? CLARO : '#E2D6C2', { f: [1, .55, 1], pc: g.pecas.disco });
        }
        ach(g, 'disco', [.6, top + .3, .4]); ach(g, 'gema', [R * .7, -R * .6, R * .5]);
      } else {
        // centrolécito: núcleos se dividem no centro, migram para a periferia e formam uma camada de células
        g.ins.scale.set(R * 1.3, R * .78, R * .95); g.gin.scale.set(R * 1.3 * .72, R * .78 * .62, R * .95 * .7);
        const n = 2 ** Math.min(4, k + (f > .5 ? 1 : 0)), mig = sst(3.5, 4.6, v), cel = sst(4.4, 5, v);
        for (let i = 0; i < 32; i++) {
          const u = fib(i, 32), dentro = mul(u, .7 + .3 * hash(i, 2)), fora = [u[0] * R * 1.22, u[1] * R * .72, u[2] * R * .88], p0 = [dentro[0] * R * .35, dentro[1] * R * .25, dentro[2] * R * .3];
          if (i >= n && mig <= 0) continue;
          const p = V.lerp3(p0, fora, mig);
          if (cel > 0) E3.celula(g, W, p, .42 * cel, i % 2 ? CLARO : '#E2D6C2', { f: [1, 1, .7], pc: g.pecas.bl });
          E3.bola(g, p[2] > -.2 && mig < .5 ? [p[0], p[1], Math.min(p[2], -.15)] : p, .17, K.nucleo, 1.1, g.pecas.nuc);
        }
        ach(g, 'nuc', [R * .3, R * .1, -.15]); ach(g, 'gema', [-R * .5, -R * .1, 0]);
      }
      E3.fimCel(W);
    },
    camera(g, P) { const ti = g.ti || 0; return cam(g, P, ti === 3 ? 4.4 : 3.8, ti === 2 ? 3.9 : 3.6, { fi: ti === 2 ? .45 : .14, al: [0, E3.deitado(g) ? 0 : -.5, 0] }); },
    sobre(g, S) { const T = TIP[g.ti || 0], n = Math.round(S.v); painel(g, T[0], T[1], NAR ? null : T[2]); const s = g.ti === 3 ? (n < 4 ? `${2 ** n} núcleos no centro` : n < 5 ? 'núcleos migram para a periferia' : 'camada de células na periferia') : `${2 ** n} ${n ? 'células' : 'célula'}`; if (!NAR) tx(s, NAR ? 12 : 28, 82 + 66, { s: 13, w: 600, a: 'left', c: C.txt }); }
  });

  // =====================================================================================
  // MÓRULA (até 32 células e compactação)
  // =====================================================================================
  E3.cena('desenvolvimento/morula', {
    fit: 14, raio: 5, bolas: 30,
    pecas: {
      bl: { nome: 'Blastômeros', frase: 'A cada divisão o número dobra e as células ficam menores; o embrião continua do mesmo tamanho.', cor: K.ovo },
      zona: { nome: 'Zona pelúcida', frase: 'Ainda envolve o embrião e impede que ele grude na parede da tuba antes da hora.', cor: '#C9D6FF' }
    },
    rotulos: [{ pc: 'bl', t: 'blastômeros' }, { pc: 'zona', t: 'zona pelúcida' }],
    montar(g) {
      const R = 3; g.R = R; g.N = arvore(R, false); g.W = E3.celulas(g, 70, {});
      g.zona = E3.peca(g, E3.esfera(g, 56), E3.filme(g, '#C9D6FF', { cor2: '#FFFFFF', dentro: '#3B4A7A', base: .05, fr: .5, esc: 3 }), 'zona'); g.zona.scale.setScalar(R * 1.2); g.zona.renderOrder = 4;
    },
    animar(g, P) {
      const S = P.S, v = V.degraus(S.v, 6), k = Math.min(5, Math.floor(v)), f = v - k, N = g.N, W = g.W, R = g.R;
      if (k >= 5) { const c5 = sst(0, 1, v - 5); N[5].forEach((c, i) => E3.celula(g, W, mul(c.p, mix(1, .86, c5)), c.r * mix(1, 1.22, c5), i % 3 ? K.ovo : '#D4D9E4', { pc: g.pecas.bl, k: .95 + .1 * hash(i, 5) })); }
      else if (f < .001) N[k].forEach((c, i) => E3.celula(g, W, c.p, c.r, i % 3 ? K.ovo : '#D4D9E4', { pc: g.pecas.bl }));
      else N[k].forEach((c, i) => { const a = N[k + 1][2 * i], b = N[k + 1][2 * i + 1]; E3.divide(g, W, c.p, c.r, a.p, a.r, b.p, b.r, f, i % 3 ? K.ovo : '#D4D9E4', { pc: g.pecas.bl }); });
      E3.fimCel(W); ach(g, 'bl', [R * .5, R * .5, R * .55]); ach(g, 'zona', [-R * .85, R * .85, 0]);
    },
    camera(g, P) { return cam(g, P, 4, 4, { al: [0, E3.deitado(g) ? 0 : -.6, 0] }); },
    sobre(g, S) { const n = Math.round(S.v); painel(g, n === 6 ? 'Compactação' : n >= 4 ? 'Mórula' : 'Clivagens', n === 6 ? 'as células se achatam e grudam umas nas outras' : `${2 ** n} ${n ? 'células' : 'célula'}`, NAR ? null : n === 6 ? 'nos mamíferos, a compactação começa já com cerca de 8 células' : 'o embrião não cresce: as células ficam menores'); }
  });

  // =====================================================================================
  // BLÁSTULA (em corte: a blastocele aparece)
  // =====================================================================================
  const ORG = [['Anfioxo', 'esfera oca e regular'], ['Anfíbio', 'blastocele deslocada para o polo animal'], ['Ave', 'disco de células sobre a gema'], ['Mamífero', 'blastocisto']];
  E3.cena('desenvolvimento/blastula', {
    fit: 14, raio: 5, bolas: 20,
    pecas: {
      bl: { nome: 'Blastoderme', frase: 'A camada de células (blastômeros) que forma a parede da blástula.', cor: K.ovo },
      bc: { nome: 'Blastocele', frase: 'Cavidade cheia de líquido no meio da blástula. Na gastrulação, ela encolhe.', cor: '#8FD3FF' },
      ma: { nome: 'Macrômeros', frase: 'Células grandes e cheias de vitelo no polo vegetativo; empurram a blastocele para cima.', cor: K.vitelo },
      gema: { nome: 'Gema', frase: 'O vitelo não se divide; as células formam um disco por cima dele.', cor: K.vitelo },
      tro: { nome: 'Trofoblasto', frase: 'Camada externa do blastocisto; vai formar a parte fetal da placenta (córion).', cor: '#E7B4A4' },
      mci: { nome: 'Massa celular interna', frase: 'Grupo de células (embrioblasto) que vai formar o embrião.', cor: '#E8A9A3' }
    },
    rotulos: [{ pc: 'bc', t: 'blastocele' }, { pc: 'bl', t: 'blastoderme' }, { pc: 'ma', t: 'macrômeros' }, { pc: 'gema', t: 'gema' }, { pc: 'tro', t: 'trofoblasto' }, { pc: 'mci', t: 'massa celular interna' }],
    montar(g) {
      const R = 3; g.R = R; g.pl = E3.corte(g, g.raiz);
      g.W = E3.celulas(g, 260, { planos: [g.pl], kc: 1.28 });
      g.liq = E3.peca(g, E3.esfera(g, 40), E3.filme(g, '#8FD3FF', { cor2: '#FFFFFF', dentro: '#2A6A96', base: .32, fr: .35, planos: [g.pl] }), 'bc'); g.liq.renderOrder = 4;
      g.gema = E3.solido(g, E3.esfera(g, 56), K.vitelo, [g.pl], { pc: 'gema', corte: '#EBA94C' });
      // pontos fixos de cada organismo
      g.sh = []; for (let i = 0; i < 110; i++) g.sh.push(fib(i, 110));
      g.bola = []; [[1, 90], [.74, 50], [.48, 24], [.22, 6]].forEach(([r, n]) => { for (let i = 0; i < n; i++) g.bola.push(mul(fib(i, n), r)); });
    },
    animar(g, P) {
      const S = P.S, R = g.R, oi = S.org || 0, q = sst(.08, .92, S.v / 100), W = g.W; g.oi = oi;
      g.gema.visible = oi === 2; g.liq.visible = false;
      if (oi === 0) {
        const Rs = mix(.72, 1, q) * R, rc = mix(.62, .56, q);
        g.sh.forEach((u, i) => E3.celula(g, W, mul(u, Rs), rc, i % 3 ? K.ovo : '#D4D9E4', { pc: g.pecas.bl, f: [1, 1, 1] }));
        g.bola.forEach((u, i) => { if (i < 90 || q > .98) return; E3.celula(g, W, mul(u, R * mix(.9, 1.3, q)), .55 * (1 - q), K.ovo, { pc: g.pecas.bl }); });
        g.liq.visible = q > .05; g.liq.scale.setScalar(Math.max(.01, (Rs - rc) * q)); ach(g, 'bc', [0, -R * .2, -.3]); ach(g, 'bl', [R * .7, R * .55, 0]);
      } else if (oi === 1) {
        const c = [0, R * .36, 0], rcv = R * .5 * q;
        g.bola.forEach((u, i) => {
          const p = mul(u, R * .9), d = len(V.sub(p, c)), y = p[1] / R, r = .36 * (1 + .55 * Math.max(0, -y)) * (i < 90 ? 1 : 1.25);
          const k = rcv > .01 ? sst(rcv * .9, rcv * 1.25, d) : 1; if (k < .02) return;
          E3.celula(g, W, p, r * mix(.4, 1, k), y > .1 ? PIG : y > -.2 ? '#B9926A' : K.vitelo, { pc: g.pecas[y < -.1 ? 'ma' : 'bl'] });
        });
        g.liq.visible = q > .05; g.liq.position.set(c[0], c[1], c[2]); g.liq.scale.setScalar(Math.max(.01, rcv * .95)); ach(g, 'bc', [0, c[1], -.3]); ach(g, 'ma', [R * .55, -R * .6, 0]); ach(g, 'bl', [R * .6, R * .75, 0]);
      } else if (oi === 2) {
        g.gema.scale.setScalar(R * 1.15); g.gema.position.set(0, -R * .55, 0);
        const top = R * .6 + .05, rd = mix(.9, 2.4, q), cav = q;
        for (let j = 0; j < 2; j++) for (let i = 0; i < 70; i++) {
          const a = i * 2.39996, d = Math.sqrt((i + .5) / 70) * rd; const x = Math.cos(a) * d, z = Math.sin(a) * d;
          const y = top - (x * x + z * z) * .1 + j * .34 + (j === 0 ? -cav * .35 * Math.max(0, 1 - d / (rd * .7)) : 0) + .1;
          E3.celula(g, W, [x, j === 0 ? y : y, z], .2 + .05 * hash(i, j), j ? CLARO : '#E2D6C2', { f: [1, .7, 1], pc: g.pecas.bl });
        }
        ach(g, 'bl', [rd * .6, top + .5, 0]); ach(g, 'gema', [R * .8, -R * .9, 0]);
      } else {
        const Rs = mix(.7, 1, q) * R;
        g.sh.forEach((u, i) => { if (u[1] > .72 && q > .2) return; E3.celula(g, W, mul(u, Rs), mix(.48, .36, q), '#E7B4A4', { f: [1, 1, 1], pc: g.pecas.tro }); });
        for (let i = 0; i < 18; i++) { const u = fib(i, 18), p = add([0, Rs * .62, 0], [u[0] * .9, u[1] * .55, u[2] * .9]); E3.celula(g, W, p, .42, '#E8A9A3', { pc: g.pecas.mci }); }
        g.sh.forEach((u, i) => { if (!(u[1] > .72 && q > .2)) return; E3.celula(g, W, mul(u, Rs), .36, '#E7B4A4', { pc: g.pecas.tro }); });
        g.liq.visible = q > .05; g.liq.position.set(0, -R * .1, 0); g.liq.scale.setScalar(Math.max(.01, (Rs - .5) * q * .9));
        ach(g, 'bc', [0, -R * .3, -.3]); ach(g, 'mci', [.6, Rs * .65, 0]); ach(g, 'tro', [Rs * .8, -Rs * .45, 0]);
      }
      E3.fimCel(W);
    },
    camera(g, P) { const oi = g.oi || 0; return cam(g, P, oi === 2 ? 4.2 : 3.8, 3.8, { th: .3, fi: oi === 2 ? .35 : .14, al: [0, (oi === 2 ? .4 : 0) + (E3.deitado(g) ? 0 : -.6), 0] }); },
    sobre(g, S) { const o = ORG[g.oi || 0]; painel(g, 'Blástula: ' + o[0].toLowerCase(), o[1], NAR ? null : 'corte ao meio para ver por dentro'); }
  });

  // =====================================================================================
  // gástrula: perfil de revolução (parede externa, lábio do blastóporo e arquêntero), p de 0 a 1
  // =====================================================================================
  function perfilGastrula(R, p, fura) {
    const lip = Math.PI - .62 * sst(0, .3, p), d = mix(0, 1.72 * R, sst(.06, 1, p)), fim = fura ? sst(.9, 1, p) : 0;
    const th0 = mix(.04, .5, fim), A = [], B = [];
    for (let i = 0; i <= 26; i++) { const a = mix(th0, lip, i / 26); A.push([R * Math.sin(a), R * Math.cos(a), 'w']); }
    const yl = R * Math.cos(lip), rl = R * Math.sin(lip), ra = mix(rl, R * .34, sst(0, .4, p)), ytip = yl + d;
    if (d > .05) {
      for (let i = 1; i <= 6; i++) { const u = i / 6; B.push([mix(rl, ra, u) - .12 * Math.sin(u * Math.PI), yl + .3 * u * Math.min(1, d), 'a']); }
      const ys = yl + .3 * Math.min(1, d), yc = Math.max(ys, ytip - ra * (1 - fim)), n = Math.max(1, Math.round((yc - ys) / .42));
      for (let i = 1; i <= n; i++) B.push([ra, mix(ys, yc, i / n), 'a']);
      if (!fim) for (let i = 1; i <= 6; i++) { const a = i / 6 * Math.PI / 2; B.push([ra * Math.cos(a), yc + ra * Math.sin(a), 'a']); }
    }
    return { A, B, yl, rl, ra, ytip, yc: d, fim };
  }
  // põe as células do perfil em anéis (só a metade de trás, a da frente fica cortada)
  function celulasGastrula(g, W, R, p, o = {}) {
    const P = perfilGastrula(R, p, o.fura), sp = .44, base = o.base || [0, 0, 0], esc = o.esc || 1, rc = sp * .62 * esc, m = sst(.35, .8, p);
    const anel = (r, y, cor, pc, kk, desl) => { const n = Math.max(1, Math.round(Math.PI * r / sp)); for (let j = 0; j <= n; j++) { const a = Math.PI + j / n * Math.PI + (desl || 0); E3.celula(g, W, add(base, [r * Math.cos(a) * esc, y * esc, r * Math.sin(a) * esc]), rc * (kk || 1), cor, { pc: g.pecas[pc], k: .94 + .12 * hash(j, Math.round(y * 10)) }); } };
    P.A.forEach((q, i) => anel(q[0], q[1], p < .05 ? K.ovo : K.ecto, p < .05 ? 'bl' : 'ecto', 1, i * .17));
    P.B.forEach((q, i) => { const topo = q[1] > P.ytip - R * .55 && p > .55; anel(q[0], q[1], K.endo, 'endo', 1, i * .23); });
    // mesoderme entre a ectoderme e a endoderme (sai das bordas do arquêntero) e notocorda no teto
    if (m > .02) P.B.forEach((q, i) => { if (i % 2 || q[1] < P.yl + .6) return; const r = q[0] + sp * .9; if (r > R - sp) return; anel(r, q[1], K.meso, 'meso', m, i * .31 + .1); });
    if (o.noto && m > .3) for (let i = 0; i < 5; i++) { const y = P.ytip - R * .15 - i * .4; if (y < P.yl + .6) break; E3.celula(g, W, add(base, [0, y * esc, -(P.ra + sp * .9) * esc]), rc * 1.05 * m, K.noto, { pc: g.pecas.noto }); }
    return P;
  }

  // =====================================================================================
  // GÁSTRULA
  // =====================================================================================
  E3.cena('desenvolvimento/gastrula', {
    fit: 14, raio: 5, bolas: 20,
    pecas: {
      bl: { nome: 'Blastoderme', frase: 'A parede de uma só camada da blástula, antes da invaginação.', cor: K.ovo },
      ecto: { nome: 'Ectoderme', frase: 'Folheto externo: forma a epiderme e o sistema nervoso.', cor: K.ecto },
      meso: { nome: 'Mesoderme', frase: 'Folheto do meio: músculos, ossos, sangue, coração, rins e gônadas.', cor: K.meso },
      endo: { nome: 'Endoderme', frase: 'Folheto interno: reveste o arquêntero e forma o epitélio do tubo digestório e dos pulmões.', cor: K.endo },
      noto: { nome: 'Notocorda', frase: 'Bastão de mesoderme no dorso, típico dos cordados; induz a formação do tubo neural.', cor: K.noto },
      arq: { nome: 'Arquêntero', frase: 'Intestino primitivo: a cavidade nova, revestida pela endoderme.', cor: '#3A3020' },
      bp: { nome: 'Blastóporo', frase: 'A abertura do arquêntero para fora. Em protostômios vira a boca; em deuterostômios, o ânus.', cor: '#FFFFFF' },
      bc: { nome: 'Blastocele', frase: 'Encolhe enquanto o arquêntero cresce; na gástrula sobram só restos dela.', cor: '#8FD3FF' }
    },
    rotulos: [{ pc: 'ecto', t: 'ectoderme' }, { pc: 'endo', t: 'endoderme' }, { pc: 'meso', t: 'mesoderme' }, { pc: 'bp', t: 'blastóporo' }, { pc: 'arq', t: 'arquêntero' }, { pc: 'bc', t: 'blastocele' }, { pc: 'bl', t: 'blastoderme' }, { pc: 'noto', t: 'notocorda' }],
    montar(g) { const R = 3.2; g.R = R; g.pl = E3.corte(g, g.raiz); g.W = E3.celulas(g, 700, { planos: [g.pl], kc: 1.2 }); },
    animar(g, P) {
      const p = P.S.v / 100, R = g.R, Q = celulasGastrula(g, g.W, R, p, { noto: true }); E3.fimCel(g.W);
      if (p < .05) ach(g, 'bl', [R * .7, R * .6, 0]); else ach(g, 'ecto', [R * .75, R * .6, 0]);
      if (p > .05) { ach(g, 'bp', [0, Q.yl - .3, 0]); ach(g, 'endo', [-Q.ra - .2, Q.yl + Q.yc * .5, 0]); }
      if (p > .3) ach(g, 'arq', [0, Q.yl + Q.yc * .55, -.4]);
      if (p > .5) ach(g, 'meso', [-(Q.ra + .5), Q.yl + Q.yc * .8, 0]);
      if (p > .65) ach(g, 'noto', [0, Q.ytip - R * .2, -(Q.ra + .4)]);
      if (p < .7) ach(g, 'bc', [R * .55 * (1 - p * .4), R * .25, -.4]);
    },
    camera(g, P) { return cam(g, P, 4, 4.3, { th: .32, fi: .2, al: [0, E3.deitado(g) ? -.3 : -.8, 0] }); }
  });

  // =====================================================================================
  // BLASTÓPORO: protostômio e deuterostômio lado a lado
  // =====================================================================================
  const LADO = [{ k: 'Protostômio', sub: 'boca primeiro', gr: 'anelídeos, moluscos, artrópodes', a1: 'boca', a2: 'ânus' }, { k: 'Deuterostômio', sub: 'boca em segundo', gr: 'equinodermos e cordados', a1: 'ânus', a2: 'boca' }];
  E3.cena('desenvolvimento/blastoporo', {
    fit: 20, raio: 8, bolas: 20,
    pecas: {
      ecto: { nome: 'Ectoderme', frase: 'Folheto externo.', cor: K.ecto },
      endo: { nome: 'Endoderme', frase: 'Reveste o arquêntero, o futuro tubo digestório.', cor: K.endo },
      meso: { nome: 'Mesoderme', frase: 'Folheto do meio, entre a ectoderme e a endoderme.', cor: K.meso },
      bp1: { nome: 'Blastóporo vira boca', frase: 'Protostômios (anelídeos, moluscos, artrópodes): a primeira abertura do arquêntero vira a boca; o ânus se abre depois.', cor: '#FFFFFF' },
      bp2: { nome: 'Blastóporo vira ânus', frase: 'Deuterostômios (equinodermos e cordados, como nós): o blastóporo vira o ânus e a boca se abre depois, do outro lado.', cor: '#FFFFFF' }
    },
    rotulos: [{ pc: 'bp1', t: 'blastóporo' }, { pc: 'bp2', t: 'blastóporo' }, { pc: 'endo', t: 'endoderme' }],
    montar(g) { g.R = 2.4; g.pl = E3.corte(g, g.raiz); g.W = E3.celulas(g, 1600, { planos: [g.pl], kc: 1.2 }); },
    animar(g, P) {
      const p = .12 + .88 * (P.S.v / 100), R = g.R, larg = E3.deitado(g), dx = larg ? 3.9 : 0, dy = larg ? 0 : 3.7;
      g.bases = [[-dx, dy, 0], [dx, -dy, 0]];
      g.bases.forEach(b => { g.Q = celulasGastrula(g, g.W, R, p, { base: b, fura: true }); });
      E3.fimCel(g.W);
      const Q = g.Q; g.p = p;
      ach(g, 'bp1', add(g.bases[0], [0, Q.yl - .3, 0])); ach(g, 'bp2', add(g.bases[1], [0, Q.yl - .3, 0]));
      ach(g, 'endo', add(g.bases[1], [-Q.ra - .2, Q.yl + Q.yc * .5, 0]));
    },
    camera(g, P) { return E3.deitado(g) ? cam(g, P, 7, 4.2, { th: 0, fi: .16, al: [0, .2, 0], viva: .3 }) : cam(g, P, 4.2, 8.2, { th: 0, fi: .16, al: [-1.5, 0, 0], viva: .3 }); },
    sobre(g) {
      if (!g.bases) return; const Q = g.Q, larg = E3.deitado(g);
      g.bases.forEach((b, i) => {
        const L = LADO[i], t0 = larg ? E3.tela(g, add(b, [0, g.R + 1.1, 0])) : [12, E3.tela(g, b)[1] - 20]; t0[1] = Math.max(t0[1], NAR ? 60 : 78);
        const al = larg ? 'center' : 'left', x = t0[0];
        tx(L.k, x, t0[1], { f: FH, s: NAR ? 14 : 17, w: 600, a: al, c: C.txt }); tx(L.sub, x, t0[1] + 20, { s: 13, w: 600, a: al, c: C.txt }); if (larg) tx(L.gr, x, t0[1] + 38, { s: 12, a: al, c: C.dim });
        E3.reserva(g, [(al === 'center' ? x - 120 : x - 4), t0[1] - 12, 240, 58]);
        E3.ficha(g, add(b, [0, Q.yl - .2, 0]), L.a1, i ? '#FFD27A' : '#9EE6B8', { dy: 1.6, pr: 1 });
        if (Q.fim > .5) E3.ficha(g, add(b, [0, g.R * .95, 0]), L.a2, i ? '#9EE6B8' : '#FFD27A', { dy: -1.4, pr: 1 });
      });
    }
  });
})();
