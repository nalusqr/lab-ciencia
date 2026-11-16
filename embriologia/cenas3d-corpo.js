/* LAB Embriologia: cenas 3D do corpo que se forma (Martin). Folhetos germinativos num corpo translúcido em que os órgãos
   de cada folheto acendem; neurulação num bloco de tecido em corte (placa, sulco, pregas e tubo neural, notocorda e
   somitos com volume); organogênese do embrião humano da 4ª à 8ª semana com a linha do tempo. Usa o kit embrio3d.js;
   a cena 2D antiga fica como plano B sem WebGL. */
'use strict';
(function () {
  const E3 = window.EMB3D; if (!E3) return;
  const { V, K } = E3, { cl, mix, seg, sst, TAU, hash } = V;
  const cam = (g, P, hx, hy, o = {}) => E3.viva({ th: o.th == null ? .2 : o.th, fi: o.fi == null ? .12 : o.fi, d: E3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .6 : o.viva);
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };

  // =====================================================================================
  // FOLHETOS: corpo translúcido; os órgãos do folheto escolhido acendem
  // =====================================================================================
  const FOL = ['ecto', 'meso', 'endo', 'misto'];
  E3.cena('desenvolvimento/folhetos', {
    fit: 20, raio: 8, bolas: 10,
    pecas: {
      enc: { nome: 'Encéfalo', frase: 'Vem da ectoderme, pelo tubo neural.', cor: K.ecto },
      med: { nome: 'Medula espinal', frase: 'Vem da ectoderme, pelo tubo neural.', cor: K.ecto },
      pele: { nome: 'Epiderme', frase: 'A camada de fora da pele, com pelos e unhas, vem da ectoderme.', cor: K.ecto },
      cri: { nome: 'Cristalino', frase: 'A lente do olho vem da ectoderme da superfície.', cor: K.ecto },
      cor: { nome: 'Coração', frase: 'Vem da mesoderme, como os vasos e o sangue.', cor: K.meso },
      rim: { nome: 'Rins', frase: 'Vêm da mesoderme.', cor: K.meso },
      oss: { nome: 'Ossos', frase: 'Esqueleto e cartilagens vêm da mesoderme (os somitos formam as vértebras).', cor: K.meso },
      mus: { nome: 'Músculos', frase: 'A musculatura vem da mesoderme.', cor: K.meso },
      pul: { nome: 'Pulmões', frase: 'O epitélio que reveste os pulmões vem da endoderme.', cor: K.endo },
      fig: { nome: 'Fígado', frase: 'Vem da endoderme, como o pâncreas.', cor: K.endo },
      int: { nome: 'Intestino', frase: 'O revestimento interno do tubo digestório vem da endoderme; a parede muscular vem da mesoderme.', cor: K.endo },
      tir: { nome: 'Tireoide', frase: 'Vem da endoderme da faringe.', cor: K.endo },
      est: { nome: 'Estômago', frase: 'Órgão misto: revestimento interno da endoderme e parede muscular da mesoderme.', cor: K.meso }
    },
    rotulos: [{ pc: 'enc', t: 'encéfalo' }, { pc: 'med', t: 'medula espinal' }, { pc: 'pele', t: 'epiderme' }, { pc: 'cri', t: 'cristalino' }, { pc: 'cor', t: 'coração' }, { pc: 'rim', t: 'rins' }, { pc: 'oss', t: 'ossos' }, { pc: 'mus', t: 'músculos' }, { pc: 'pul', t: 'pulmões' }, { pc: 'fig', t: 'fígado' }, { pc: 'int', t: 'intestino' }, { pc: 'tir', t: 'tireoide' }, { pc: 'est', t: 'estômago' }],
    montar(g) {
      const T = g.T, sf = E3.esfera(g, 40); g.org = [];
      const pele = E3.filme(g, '#C9D3E8', { cor2: '#FFFFFF', dentro: '#2A3350', base: .03, fr: .42, esc: 1.5 }); g.peleM = pele;
      const corpo = (geo, p, s, r) => { const m = E3.peca(g, geo, pele, 'pele'); m.position.set(...p); m.scale.set(...s); if (r) m.rotation.z = r; m.renderOrder = 6; return m; };
      corpo(sf, [0, 3.25, 0], [.95, 1.08, .98]); corpo(E3.capsula(g, .62, .55, 24), [0, 2.25, 0], [.42, .5, .42]);
      corpo(E3.capsula(g, 1, .9, 28), [0, .55, 0], [1.25, 1.05, .78]);
      [-1, 1].forEach(k => { corpo(E3.capsula(g, .3, 1.35, 16), [k * 1.62, .95, 0], [1, 1, 1], k * .12); corpo(E3.capsula(g, .38, 1.55, 16), [k * .58, -2.55, 0], [1, 1, 1]); });
      // órgão: folheto, peça, malha
      const org = (fol, pc, geo, p, s, rot, cor) => { const m = E3.peca(g, geo, E3.fis(g, '#8A90A0', { p: { transparent: true, opacity: .3, roughness: .45, clearcoat: .6 } }), pc); m.position.set(...p); m.scale.set(...s); if (rot) m.rotation.set(...rot); g.org.push({ fol, pc, m, cor }); return m; };
      const lp = k => E3.lumpy(g, 'org' + k, 90 + k, 3, 4, .08, .4, .8);
      org('ecto', 'enc', lp(1), [0, 3.35, -.05], [.72, .6, .72]);
      org('ecto', 'med', E3.cilindro(g, 12), [0, 1.05, -.48], [.11, 3.1, .11]);
      [-1, 1].forEach(k => org('ecto', 'cri', sf, [k * .33, 3.25, .86], [.09, .09, .06]));
      [-1, 1].forEach(k => org('endo', 'pul', lp(2), [k * .5, 1.35, 0], [.38, .62, .38]));
      org('endo', 'fig', lp(3), [-.35, .5, .15], [.6, .3, .38], [0, 0, .2]);
      org('endo', 'tir', sf, [0, 2.2, .2], [.2, .1, .1]);
      org('endo', 'int', E3.toro(g, .3, 18), [0, -.35, .1], [.45, .38, .5], [Math.PI / 2, 0, 0]);
      org('endo', 'int', E3.toro(g, .22, 18), [0, -.3, .1], [.78, .6, .7], [Math.PI / 2, 0, 0]);
      org('endo', 'fig', E3.capsula(g, .2, .4, 12), [.1, .02, -.05], [.6, .6, .6], [0, 0, Math.PI / 2]);
      org('meso', 'cor', lp(4), [.18, 1.15, .25], [.3, .34, .28]);
      [-1, 1].forEach(k => org('meso', 'rim', lp(5), [k * .52, .05, -.32], [.16, .26, .14]));
      [-1, 1].forEach(k => { org('meso', 'oss', E3.capsula(g, .09, 1.2, 10), [k * 1.62, .95, 0], [1, 1, 1], [0, 0, k * .12]); org('meso', 'oss', E3.capsula(g, .11, 1.4, 10), [k * .58, -2.55, 0], [1, 1, 1]); org('meso', 'mus', E3.capsula(g, .26, .7, 14), [k * .58, -2.1, .08], [1, 1, 1]); });
      org('meso', 'oss', E3.cilindro(g, 10), [0, .95, -.62], [.13, 3.3, .13]);
      g.est = org('misto', 'est', lp(6), [.42, .55, .12], [.38, .3, .3], [0, 0, -.4], K.meso);
      org('misto', 'est', lp(7), [.42, .55, .12], [.24, .18, .2], [0, 0, -.4], K.endo);
      g.anc0 = { enc: [.5, 3.6, 0], med: [0, .2, -.6], pele: [1.25, -.1, .4], cri: [.33, 3.25, .9], cor: [.28, 1.2, .3], rim: [.6, .05, -.3], oss: [1.75, .3, 0], mus: [.62, -2, .2], pul: [-.6, 1.6, 0], fig: [-.5, .45, .2], int: [0, -.4, .4], tir: [0, 2.2, .3], est: [.6, .6, .2] };
    },
    animar(g, P) {
      const S = P.S, f = FOL[cl(Math.round(S.v), 0, 3)], t = P.t; g.f = f;
      g.org.forEach(o => {
        const on = o.fol === f || (f === 'misto' && (o.pc === 'int')), c = o.cor || (o.fol === 'misto' ? K.meso : K[o.fol]), m = o.m.material;
        m.color.set(on ? (f === 'misto' && o.pc === 'int' ? (o.m.geometry.parameters && o.m.geometry.parameters.tube < .25 ? K.meso : K.endo) : c) : '#8A90A0');
        m.opacity = on ? 1 : (o.fol === 'misto' && o.cor === K.endo ? .0 : .22); m.emissive.set(on ? c : '#000000'); m.emissiveIntensity = on ? .18 : 0; m.depthWrite = on;
        if (on) ach(g, o.pc, g.anc0[o.pc]);
      });
      g.peleM.uniforms.uC.value.set(f === 'ecto' ? K.ecto : '#C9D3E8'); g.peleM.uniforms.uFr.value = f === 'ecto' ? .7 : .42;
      if (f === 'ecto') ach(g, 'pele', g.anc0.pele);
      const b = E3.REDUZ() ? 1 : 1 + .06 * Math.max(0, Math.sin(t * 7));
      g.org.forEach(o => { if (o.pc === 'cor') o.m.scale.set(.3 * b, .34 * b, .28 * b); });
    },
    camera(g, P) { return cam(g, P, 2.6, 4.4, { th: .35, fi: .08, al: [0, .2 + (E3.deitado(g) ? 0 : -.5), 0], viva: .9 }); }
  });

  // =====================================================================================
  // NÊURULA: bloco de tecido em corte transversal (frente do bloco = face cortada)
  // =====================================================================================
  const NEURO = '#6FA2FF', CRISTA = '#A9C8FF';
  E3.cena('desenvolvimento/neurula', {
    fit: 16, raio: 7, bolas: 120,
    pecas: {
      pn: { nome: 'Placa, sulco e tubo neural', frase: 'Ectoderme engrossada sobre a notocorda; dobra para dentro e fecha num tubo, que forma encéfalo e medula espinal.', cor: NEURO },
      ect: { nome: 'Ectoderme da superfície', frase: 'Depois que o tubo fecha, ela se separa dele e forma a epiderme.', cor: K.ecto },
      not: { nome: 'Notocorda', frase: 'Bastão de mesoderme que induz a ectoderme acima a formar a placa neural.', cor: K.noto },
      som: { nome: 'Somitos', frase: 'Blocos de mesoderme dos dois lados do tubo; formam vértebras, músculos e derme.', cor: K.meso },
      mes: { nome: 'Mesoderme lateral', frase: 'Forma, entre outras coisas, o revestimento das cavidades do corpo e o sangue.', cor: K.meso },
      end: { nome: 'Endoderme', frase: 'Camada interna, que vai revestir o tubo digestório.', cor: K.endo },
      cri: { nome: 'Crista neural', frase: 'Células das bordas das pregas neurais que migram e formam nervos, gânglios e células de pigmento.', cor: CRISTA }
    },
    rotulos: [{ pc: 'pn', t: 'tubo neural' }, { pc: 'not', t: 'notocorda' }, { pc: 'som', t: 'somitos' }, { pc: 'ect', t: 'ectoderme' }, { pc: 'end', t: 'endoderme' }, { pc: 'cri', t: 'crista neural' }, { pc: 'mes', t: 'mesoderme' }],
    montar(g) {
      const T = g.T; g.LZ = 6;
      const mat = (c, pc) => { const m = new T.Mesh(new T.BufferGeometry(), E3.fis(g, c, { p: { roughness: .5, clearcoat: .35, sheen: .5, sheenColor: new T.Color('#FFFFFF') } })); g.raiz.add(m); m.userData.peca = g.pecas[pc]; g.pick.push(m); return m; };
      g.mNeu = mat(NEURO, 'pn'); g.mEct = mat(K.ecto, 'ect'); g.mEnd = mat(K.endo, 'end'); g.mMes = mat(K.meso, 'mes');
      const no = E3.peca(g, E3.cilindro(g, 32), E3.fis(g, K.noto, { p: { roughness: .35, clearcoat: .8 } }), 'not'); no.rotation.x = Math.PI / 2; no.scale.set(.38, g.LZ, .38); no.position.set(0, -.8, -g.LZ / 2);
      g.som = E3.inst(g, E3.capsula(g, .5, .25, 16), E3.fis(g, K.meso, { p: { roughness: .45, clearcoat: .5 } }), 20, null, g.pecas.som); g.pick.push(g.som.m);
      g.pq = -1;
    },
    animar(g, P) {
      const S = P.S, p = S.v / 100, T = g.T, LZ = g.LZ; g.p = p;
      const q = Math.round(p * 60) / 60;
      if (q !== g.pq) {
        g.pq = q;
        const w = 1.55, f = sst(.18, .95, q), th = mix(.3, .5, seg(q, 0, .2)), k = f * Math.PI / w, sep = sst(.86, 1, q);
        const pt = s => k < 1e-3 ? [s, 0] : [Math.sin(s * k) / k, (1 - Math.cos(s * k)) / k];
        const Pn = []; for (let i = 0; i <= 40; i++) Pn.push(pt(mix(-w, w, i / 40)));
        const topo = k < 1e-3 ? 0 : 2 / k, ed = pt(w), meet = [0, topo + th * .9 + .15];
        const lado = sg => { const a = [ed[0] * sg, ed[1]], b = [sg * 4.4, 0], e = [mix(a[0], meet[0], sep), mix(a[1], meet[1], sep)], P = []; for (let i = 0; i <= 18; i++) { const u = i / 18, c = [sg * mix(2.2, 2.6, sep), mix(Math.max(0, e[1] * .55), e[1] * .9, sep)]; const x = (1 - u) * (1 - u) * b[0] + 2 * u * (1 - u) * c[0] + u * u * e[0], y = (1 - u) * (1 - u) * b[1] + 2 * u * (1 - u) * c[1] + u * u * e[1]; P.push([x, y]); } return P; };
        const fita = (P, e) => { const sh = new T.Shape(), A = [], B = []; P.forEach((p, i) => { const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l; A.push([p[0] + nx * e / 2, p[1] + ny * e / 2]); B.push([p[0] - nx * e / 2, p[1] - ny * e / 2]); }); A.forEach((p, i) => (i ? sh.lineTo(p[0], p[1]) : sh.moveTo(p[0], p[1]))); for (let i = B.length - 1; i >= 0; i--) sh.lineTo(B[i][0], B[i][1]); return sh; };
        const ext = shapes => { const geo = new T.ExtrudeGeometry(shapes, { depth: LZ, bevelEnabled: true, bevelThickness: .05, bevelSize: .04, bevelSegments: 2, curveSegments: 6 }); geo.translate(0, 0, -LZ); return geo; };
        const troca = (m, geo) => { m.geometry.dispose(); m.geometry = geo; };
        troca(g.mNeu, ext([fita(Pn, th)]));
        troca(g.mEct, ext([fita(lado(-1), .26), fita(lado(1), .26)]));
        troca(g.mEnd, ext([fita([[-4.4, -1.85], [-2, -1.8], [0, -1.75], [2, -1.8], [4.4, -1.85]], .28)]));
        const ms = sst(.25, .6, q); troca(g.mMes, ext(ms > .02 ? [-1, 1].map(sg => fita([[sg * 2.7, -1.05], [sg * 3.5, -1.1], [sg * 4.35, -1.15]], .45 * ms)) : [fita([[0, -50], [.01, -50]], .01)]));
        g.geo = { ed, topo, th, sep, ms, f, k };
      }
      const G = g.geo, sm = sst(.3, .65, p);
      // somitos: blocos dos dois lados, segmentados ao longo do eixo
      for (let i = 0; i < 7; i++) for (const sg of [-1, 1]) if (sm > .02) E3.put(g, g.som, [sg * 1.7, -.75, -.45 - i * .85], null, .62 * sm, .9 * sm, .55 * sm, K.meso, .95 + .1 * hash(i, sg + 2), g.pecas.som);
      E3.fim(g.som);
      // crista neural: nas bordas das pregas; depois migra para os lados do tubo
      const cr = sst(.45, .7, p), mg = sst(.88, 1, p);
      if (cr > 0) for (let i = 0; i < 12; i++) for (const sg of [-1, 1]) {
        const z = -.25 - i * .48, a = [G.ed[0] * sg * (1 - G.sep) + sg * .15 * G.sep, G.ed[1] + G.th * .3], b = [sg * 1.15, G.topo * .55];
        E3.bola(g, [mix(a[0], b[0], mg), mix(a[1], b[1], mg), z], .16 * cr, CRISTA, 1, g.pecas.cri);
      }
      ach(g, 'pn', [0, G.k < .1 ? .1 : G.topo * .55, 0]); ach(g, 'not', [0, -.8, .05]); if (sm > .3) ach(g, 'som', [1.7, -.3, -.3]);
      ach(g, 'ect', [3.6, .1, 0]); ach(g, 'end', [-3.2, -1.8, 0]); if (G.ms > .3) ach(g, 'mes', [-3.4, -1.1, 0]); if (cr > .5) ach(g, 'cri', [G.ed[0] * .6 + .3, G.ed[1] + .3, -.25]);
    },
    camera(g, P) { return cam(g, P, E3.deitado(g) ? 4.8 : 6.4, 3.2, { th: .55, fi: .34, al: [0, .2, -1.8], viva: .5 }); }
  });

  // =====================================================================================
  // ORGANOGÊNESE: embrião humano da 4ª à 8ª semana e a linha do tempo
  // =====================================================================================
  const diaDe = v => Math.round(22 + (v - 4) / 4 * 34);
  const MM = [[22, 3], [28, 5], [35, 7], [42, 13], [49, 17], [56, 30]];
  const mmDe = d => { for (let i = 1; i < MM.length; i++) if (d <= MM[i][0]) return mix(MM[i - 1][1], MM[i][1], (d - MM[i - 1][0]) / (MM[i][0] - MM[i - 1][0])); return 30; };
  const MARCOS = [[22, 'coração'], [26, 'braços'], [28, 'pernas'], [30, 'olhos e orelhas'], [42, 'dedos'], [56, 'órgãos esboçados']];
  E3.cena('desenvolvimento/organogenese', {
    fit: 16, raio: 6, bolas: 20,
    pecas: {
      emb: { nome: 'Embrião', frase: 'Entre a 4ª e a 8ª semana após a fecundação todos os órgãos principais se esboçam: é o período mais sensível a teratógenos.', cor: K.pele },
      cor: { nome: 'Coração', frase: 'Começa a bater por volta do dia 22: é o primeiro órgão a funcionar.', cor: K.sangueF },
      bra: { nome: 'Brotos dos braços', frase: 'Aparecem por volta do dia 26 e viram remo, placa da mão e dedos.', cor: K.pele },
      per: { nome: 'Brotos das pernas', frase: 'Aparecem cerca de dois dias depois dos braços.', cor: K.pele },
      olho: { nome: 'Olho', frase: 'Começa a se formar por volta do dia 30; a pálpebra fecha no fim do período embrionário.', cor: '#2A1A26' },
      arc: { nome: 'Arcos faríngeos', frase: 'Saliências do pescoço que formam partes da face, da mandíbula, do ouvido e glândulas do pescoço.', cor: '#C98E80' }
    },
    rotulos: [{ pc: 'cor', t: 'coração' }, { pc: 'bra', t: 'braço' }, { pc: 'per', t: 'perna' }, { pc: 'olho', t: 'olho' }, { pc: 'arc', t: 'arcos faríngeos' }],
    montar(g) { g.c = E3.corpo(g, { pc: 'emb', pcCor: 'cor' }); },
    animar(g, P) {
      const d = diaDe(P.S.v), s = mix(2.6, 4.2, seg(d, 22, 56)), R = g.c.set(d, P.t, s); g.d = d;
      g.c.gr.rotation.y = -.25;
      const w = p => p && E3.mundo(g, g.c.gr, p);
      if (R.coracao && g.c.cor.visible) ach(g, 'cor', w(R.coracao)); if (R.braco) ach(g, 'bra', w(R.braco)); if (R.perna) ach(g, 'per', w(R.perna));
      if (R.olho) ach(g, 'olho', w(R.olho)); if (R.arcos) ach(g, 'arc', w(R.arcos));
    },
    camera(g, P) { return cam(g, P, 3.4, 4.2, { th: .15, fi: .05, al: [0, E3.deitado(g) ? -.9 : -1.6, 0] }); },
    sobre(g) {
      const d = g.d || 22, x0 = NAR ? 16 : 40, x1 = W - x0, y = H - (NAR ? 118 : 104), fx = w => x0 + (w - 1) / 8 * (x1 - x0), sem = dd => 1 + (dd - 1) / 7, wk = sem(d);
      rr(fx(3), y - 5, fx(9) - fx(3), 10, 5, 'rgba(242,85,106,.28)');
      rr(x0, y - 2, x1 - x0, 4, 2, 'rgba(91,108,153,.55)');
      for (let w = 1; w <= 9; w++) { line(fx(w), y - 6, fx(w), y + 6, 'rgba(157,169,196,.7)', 1); if (!NAR || w % 2) tx(`${w}ª`, fx(w), y + 16, { s: 12, c: C.dim, bg: false }); }
      MARCOS.forEach(([dd]) => circ(fx(sem(dd)), y, 3, dd <= d ? '#FFFFFF' : 'rgba(157,169,196,.6)'));
      marker(fx(wk), y, '#FFB347');
      tx('semanas após a fecundação', x0, y - 18, { s: 12, w: 600, a: 'left', c: C.txt, bg: false });
      if (!NAR) tx('período mais sensível a teratógenos', fx(9), y - 18, { s: 12, a: 'right', c: '#FF9AA8', bg: false });
      const mm = Math.round(mmDe(d)), ult = MARCOS.filter(m => m[0] <= d).pop();
      tx(`dia ${d}: cerca de ${mm} mm`, NAR ? 12 : 28, NAR ? 58 : 82, { f: FH, s: NAR ? 16 : 19, w: 600, a: 'left', c: C.txt });
      if (ult) tx(NAR ? 'novidade: ' + ult[1] : 'já tem: ' + MARCOS.filter(m => m[0] <= d).map(m => m[1]).join(', '), NAR ? 12 : 28, NAR ? 80 : 108, { s: 12, a: 'left', c: C.dim });
      E3.reserva(g, [0, y - 30, W, 56]); E3.reserva(g, [8, NAR ? 44 : 66, NAR ? W - 16 : 520, 56]);
    }
  });
})();
