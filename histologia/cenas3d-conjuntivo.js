/* LAB Histologia: cenas 3D do tecido conjuntivo (Martin). Conjuntivo frouxo em volume, com fibras colágenas e elásticas,
   fibroblastos, macrófago engolindo bactérias e mastócito soltando grânulos; corte da hipoderme com adipócitos que enchem e
   esvaziam e o adiposo pardo que esquenta no frio; cartilagem hialina com condrócitos em lacunas e os anéis da traqueia;
   osso longo em corte e um ósteon aberto em cunha, com remodelação; ossificação do crânio e do osso longo, em etapas.
   Usa o kit histo3d.js; a cena 2D antiga fica como plano B sem WebGL. */
'use strict';
(function () {
  const H3 = window.HIS3D; if (!H3) return;
  const { V, K } = H3, { cl, mix, seg, sst, TAU, hash, add, sub, mul, nrm, fr, lerp3 } = V;
  const cam = (g, P, hx, hy, o = {}) => H3.viva({ th: o.th == null ? .3 : o.th, fi: o.fi == null ? .2 : o.fi, d: H3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .6 : o.viva);
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const RED = () => H3.REDUZ();
  const OSSO = '#EFE4CF', OSSOc = '#F6EEDD';

  // =====================================================================================
  // CONJUNTIVO PROPRIAMENTE DITO
  // =====================================================================================
  const PC = {
    colag: { nome: 'Fibras colágenas', frase: 'Grossas, rosadas e muito resistentes à tração: são as mais comuns (tendões e derme).', cor: K.colag },
    elast: { nome: 'Fibras elásticas', frase: 'Finas e amareladas: esticam e voltam ao tamanho (pele, artérias, pulmões).', cor: K.elast },
    fibro: { nome: 'Fibroblasto', frase: 'Célula alongada que fabrica as fibras e a substância fundamental.', cor: '#F2A93B' },
    macro: { nome: 'Macrófago', frase: 'Célula de defesa que engole bactérias e restos (fagocitose). Vem do monócito do sangue.', cor: '#E9C46A' },
    masto: { nome: 'Mastócito', frase: 'Cheio de grânulos com histamina (dilata os vasos, na inflamação e na alergia) e heparina.', cor: '#B07CE0' },
    plasm: { nome: 'Plasmócito', frase: 'Vem do linfócito B e produz anticorpos. O núcleo fica de lado, com a cromatina em roda de carroça.', cor: '#7FA4E8' },
    vaso: { nome: 'Vaso sanguíneo', frase: 'O conjuntivo é bem irrigado; com histamina, o vaso se dilata e o local fica vermelho e inchado.', cor: K.sangue },
    subst: { nome: 'Substância fundamental', frase: 'Gel de água, proteínas e açúcares que preenche os espaços entre fibras e células.', cor: '#E7D6F0' },
    bact: { nome: 'Bactéria', frase: 'Invasor que o macrófago captura e digere.', cor: '#8FE07A' }
  };
  const NCOL = 46, NEL = 12;
  H3.cena('conjuntivo/propriamente', {
    fit: 14, raio: 6, bolas: 260,
    pecas: PC,
    rotulos: [{ pc: 'colag', t: 'fibra colágena' }, { pc: 'elast', t: 'fibra elástica' }, { pc: 'fibro', t: 'fibroblasto' }, { pc: 'macro', t: 'macrófago' }, { pc: 'masto', t: 'mastócito' }, { pc: 'plasm', t: 'plasmócito' }, { pc: 'vaso', t: 'vaso' }],
    montar(g) {
      const T = g.T;
      g.gel = H3.peca(g, new T.BoxGeometry(5.6, 3.2, 3), H3.filme(g, '#E7D6F0', { cor2: '#FFFFFF', dentro: '#3A2A48', base: .035, fr: .07, esc: 1.5 }), 'subst'); g.gel.renderOrder = 7;
      const mC = H3.fis(g, K.colag, { p: { roughness: .5, clearcoat: .35, sheen: .6, sheenColor: new T.Color('#FFD6E2') }, rim: '#FFC0D2', rimK: .3 }), mE = H3.fis(g, '#F4D35E', { p: { roughness: .35, clearcoat: .6 }, rim: '#FFF3B0', rimK: .4 });
      g.col = []; for (let i = 0; i < NCOL; i++) g.col.push(H3.tubo(g, 24, g.q.cel ? 6 : 8, mC, g.raiz, 'colag'));
      g.ela = []; for (let i = 0; i < NEL; i++) g.ela.push(H3.tubo(g, 20, 5, mE, g.raiz, 'elast'));
      g.cel = H3.celulas(g, 30, { nucleo: true });
      g.fib = H3.inst(g, H3.lumpy(g, 'fbl', 61, g.q.cel ? 2 : 3, 4, .12, .4, .8), H3.fis(g, '#F4B887', { p: { roughness: .5, sheen: .6 } }), 12, null, g.pecas.fibro); g.pick.push(g.fib.m);
      g.fibN = H3.inst(g, H3.esfera(g, 14), H3.fis(g, K.nucleo, { p: { roughness: .4 } }), 12, null, g.pecas.fibro);
      g.mac = H3.peca(g, H3.lumpy(g, 'mac', 77, g.q.cel ? 3 : 4, 9, .22, .25, .55), H3.fis(g, '#EBCB7E', { p: { roughness: .5, sheen: .7, sheenColor: new T.Color('#FFF0C8') }, rimK: .35 }), 'macro');
      g.macN = H3.peca(g, H3.lumpy(g, 'macn', 79, 3, 2, .3, .5, .9), H3.fis(g, K.nucleo, { p: { roughness: .4 } }), 'macro', g.mac);
      g.mas = H3.peca(g, H3.lumpy(g, 'mas', 83, g.q.cel ? 3 : 4, 4, .06, .5, .9), H3.fis(g, '#C9A6E8', { p: { roughness: .5, sheen: .6 } }), 'masto');
      g.pla = H3.peca(g, H3.lumpy(g, 'pla', 87, g.q.cel ? 3 : 4, 3, .05, .5, .9), H3.fis(g, '#9DB8EE', { p: { roughness: .5, sheen: .6 } }), 'plasm');
      g.bac = H3.inst(g, H3.capsula(g, .5, .9, 10), H3.fis(g, '#8FE07A', { p: { roughness: .4, clearcoat: .6 } }), 8, null, g.pecas.bact); g.pick.push(g.bac.m);
      g.vaso = H3.vaso(g, [[-3.3, -1.2, -.6], [-1.5, -1.05, -.3], [.8, -1.25, .1], [3.3, -1.0, .4]], .26, { pc: 'vaso', n: 12, vel: .06 });
      g.k = null; g.puxa = 0; g.pv = 0;
    },
    animar(g, P) {
      const S = P.S, t = P.t, v = cl(S.v, 0, 2), dt = g.dt || .016;
      // puxar: estica rápido; ao soltar, as elásticas trazem de volta com um pequeno balanço
      const alvo = S.pull ? 1 : 0, kk = 7, damp = 4.5; g.pv += ((alvo - g.puxa) * kk * kk - g.pv * 2 * damp) * dt; g.puxa += g.pv * dt; if (RED()) { g.puxa = alvo; g.pv = 0; }
      const pu = cl(g.puxa, -.15, 1.15), ali = sst(1.3, 1.9, v), n = Math.round(mix(14, NCOL, sst(.2, 1.1, v))), sx = 1 + .22 * pu;
      g.gel.scale.set(sx, 1 - .06 * pu, 1);
      // fibras colágenas
      for (let i = 0; i < NCOL; i++) {
        if (i >= n) { g.col[i].set([]); continue; }
        const r = j => hash(i, j), y = (r(1) - .5) * 2.8, z = (r(2) - .5) * 2.6;
        const aR = [(r(3) - .5) * 5, (r(4) - .5) * 2.8, (r(5) - .5) * 2.6], bR = [(r(6) - .5) * 5, (r(7) - .5) * 2.8, (r(8) - .5) * 2.6];
        const aA = [-2.7, y, z], bA = [2.7, y + (r(9) - .5) * .2, z + (r(10) - .5) * .2];
        let a = lerp3(aR, aA, ali), b = lerp3(bR, bA, ali); a = [a[0] * sx, a[1], a[2]]; b = [b[0] * sx, b[1], b[2]];
        const amp = (.12 + .08 * r(11)) * (1 - .85 * cl(pu, 0, 1)) * mix(1, .7, ali);
        g.col[i].set(H3.onda(a, b, amp, r(12) * 6 + (RED() ? 0 : t * .15), 24), mix(.06, .045, sst(.3, 1.2, v)) * (.8 + .5 * r(13)));
      }
      // fibras elásticas: finas, quase retas, ramificadas; esticam junto
      for (let i = 0; i < NEL; i++) {
        const r = j => hash(i + 70, j); let a = [(r(1) - .5) * 5, (r(2) - .5) * 2.8, (r(3) - .5) * 2.6], b = [(r(4) - .5) * 5, (r(5) - .5) * 2.8, (r(6) - .5) * 2.6];
        a = [a[0] * sx, a[1], a[2]]; b = [b[0] * sx, b[1], b[2]];
        g.ela[i].set(H3.onda(a, b, .03 * (1 - pu), r(7) * 6, 20), .026);
      }
      // células: menos células quando o tecido fica denso
      const nf = Math.round(mix(8, 4, sst(.5, 1.6, v)));
      for (let i = 0; i < nf; i++) {
        const p = [((hash(i, 21) - .5) * 4.6) * sx, (hash(i, 22) - .5) * 2.4, (hash(i, 23) - .5) * 2.2], ang = mix(hash(i, 24) * TAU, 0, ali), d = [Math.cos(ang), Math.sin(ang) * .3, Math.sin(ang)];
        const q = H3.qx(g, d); H3.put(g, g.fib, p, q, .42, .1, .13, '#F4B887', 1, g.pecas.fibro); H3.put(g, g.fibN, p, q, .2, .055, .07, K.nucleo, 1, g.pecas.fibro);
      }
      H3.fim(g.fib); H3.fim(g.fibN);
      // macrófago engolindo bactérias
      const mp = [-1.1 * sx, .55, .6]; g.mac.position.set(...mp); g.mac.scale.setScalar(.36); g.mac.rotation.y = RED() ? 0 : t * .1; g.macN.scale.set(.42, .5, .4); g.macN.position.set(-.15, 0, .1);
      for (let i = 0; i < 4; i++) {
        const f = RED() ? .3 : fr(t * .09 + i / 4), u = i * 1.9, a = [mp[0] + Math.cos(u) * 1.3, mp[1] + Math.sin(u) * .7, mp[2] + Math.sin(u * 1.3) * .5], p = lerp3(a, mp, sst(0, .75, f) * .85), s = .06 * (1 - sst(.75, 1, f));
        if (s > .005) H3.put(g, g.bac, p, H3.giro(g, i, t), s, s * .9, s, '#8FE07A', 1, g.pecas.bact);
      }
      H3.fim(g.bac);
      // mastócito soltando grânulos (histamina); o vaso se dilata um pouco depois
      const sp = [1.4 * sx, .35, .5], ciclo = RED() ? .5 : fr(t / 7), sol = sst(.15, .45, ciclo) * (1 - sst(.85, 1, ciclo));
      g.mas.position.set(...sp); g.mas.scale.setScalar(.3);
      for (let i = 0; i < 26; i++) {
        const y = 1 - (i + .5) / 26 * 2, rr = Math.sqrt(1 - y * y), u = i * 2.4, dir = [Math.cos(u) * rr, y, Math.sin(u) * rr], out = i % 3 === 0 ? sol * (1.2 + hash(i, 3)) : 0;
        H3.bola(g, add(sp, mul(dir, .24 + out * .7)), .045 * (1 - out * .25), '#5B2E9C', 1, g.pecas.masto);
      }
      H3.bola(g, sp, .1, K.nucleo, .9, g.pecas.masto);
      // plasmócito: núcleo excêntrico com cromatina em roda de carroça; solta anticorpos
      const pp = [.15 * sx, -.45, .75]; g.pla.position.set(...pp); g.pla.scale.set(.34, .28, .3); g.pla.rotation.y = 0;
      const pn = add(pp, [-.1, .03, .18]); H3.bola(g, pn, .12, '#3F4C9A', 1, g.pecas.plasm);
      for (let j = 0; j < 8; j++) { const a = j / 8 * TAU; H3.bola(g, add(pn, [Math.cos(a) * .085, Math.sin(a) * .085, .07]), .024, '#14194F', 1, g.pecas.plasm); }
      for (let j = 0; j < 7; j++) { const f = RED() ? hash(j, 31) : fr(t * .1 + j / 7), a = -.9 + j * .55, d = .3 + f * 1.1; H3.brilho(g, add(pp, [Math.cos(a) * d, Math.sin(a) * d * .8, .1]), .035 * Math.sin(f * Math.PI), '#BFD6FF', 1.3); }
      const dil = 1 + .35 * sst(.3, .6, ciclo) * (1 - sst(.8, 1, ciclo));
      g.vaso.parede.set(g.vaso.P, .26 * dil); g.vaso.set(t, { r: .26 * dil });
      ach(g, 'colag', g.col[1] && n > 1 ? [hash(1, 4) * 0 + 2.0 * sx, 1.2, 1.2] : [0, 0, 0]); ach(g, 'elast', [-2.1 * sx, -.4, 1.2]); ach(g, 'fibro', [((hash(0, 21) - .5) * 4.6) * sx, (hash(0, 22) - .5) * 2.4 + .15, (hash(0, 23) - .5) * 2.2]);
      ach(g, 'macro', add(mp, [0, .4, 0])); ach(g, 'masto', add(sp, [.1, .38, 0])); ach(g, 'plasm', add(pp, [0, -.42, .1])); ach(g, 'vaso', [2.6, -1.05, .4]);
    },
    camera(g, P) { const lar = H3.deitado(g); return cam(g, P, lar ? 3.3 : 2.9, 1.9, { th: .4, fi: .2, k: lar ? 1.0 : 1.08 }); }
  });

  // =====================================================================================
  // TECIDO ADIPOSO: corte da hipoderme (pele por cima) e o adiposo pardo ao lado
  // =====================================================================================
  const PA = {
    adip: { nome: 'Adipócito branco (unilocular)', frase: 'Uma gota grande de gordura ocupa quase toda a célula: reserva de energia, isolamento térmico e amortecimento.', cor: K.adip },
    gota: { nome: 'Gota de gordura', frase: 'Triglicerídeos guardados. Enche quando se come mais do que se gasta e esvazia no jejum.', cor: '#F8E3A0' },
    nuc: { nome: 'Núcleo achatado', frase: 'Empurrado para a borda pela gota de gordura.', cor: K.nucleo },
    pardo: { nome: 'Adiposo pardo (multilocular)', frase: 'Muitas gotinhas e muitas mitocôndrias: produz calor. Abundante no recém-nascido.', cor: '#C77B4A' },
    pele: { nome: 'Pele (epiderme e derme)', frase: 'A hipoderme, rica em adipócitos, fica logo abaixo da derme.', cor: K.epiC },
    vaso: { nome: 'Capilar', frase: 'Leva os ácidos graxos liberados no jejum para o resto do corpo.', cor: K.sangue },
    ag: { nome: 'Ácidos graxos', frase: 'No jejum ou no exercício, a gordura sai da gota e vai para o sangue.', cor: '#FFE7A3' }
  };
  H3.cena('conjuntivo/adiposo', {
    fit: 14, raio: 6, bolas: 300,
    pecas: PA,
    rotulos: [{ pc: 'pele', t: 'pele' }, { pc: 'adip', t: 'adipócito branco' }, { pc: 'gota', t: 'gota de gordura' }, { pc: 'nuc', t: 'núcleo' }, { pc: 'pardo', t: 'adiposo pardo' }, { pc: 'ag', t: 'ácidos graxos' }],
    montar(g) {
      const T = g.T; g.pl = H3.corte(g, g.raiz, [0, 0, -1], 0);
      g.der = H3.bloco(g, H3.caixa(g, 5.4, 1, 2.4, 30, 'aD'), K.conjC, { pc: 'pele', fib: .6, dn: .14, esc: 1.6, fq: 4, nr: .16, al: 1.6, planos: [g.pl] }); g.der.position.set(-.6, 1.25, -1.0);
      g.epi = H3.bloco(g, H3.caixa(g, 5.4, .28, 2.4, 30, 'aE'), K.epiC, { pc: 'pele', dn: .55, esc: 3.2, nr: .17, al: .7, dir: [1, 0, 0], planos: [g.pl] }); g.epi.position.set(-.6, 1.9, -1.0);
      g.cel = H3.celulas(g, 60, { planos: [g.pl], pc: 'adip', p: { roughness: .42, clearcoat: .5, sheen: .5, sheenColor: new T.Color('#FFE9D0') } });
      g.got = H3.inst(g, H3.esfera(g, 28), H3.fis(g, '#F8E3A0', { p: { roughness: .2, clearcoat: .9, clearcoatRoughness: .1, transmission: 0 }, planos: [g.pl], rim: '#FFF6D0', rimK: .4 }), 60, null, g.pecas.gota, H3.faceCorte(g, '#FFFFFF', [g.pl], { inst: 1, k: 1 })); g.got.kc = 1.1; g.pick.push(g.got.m, g.got.m2);
      g.nuc = H3.inst(g, H3.esfera(g, 16), H3.fis(g, K.nucleo, { p: { roughness: .4 } }), 60, null, g.pecas.nuc); g.pick.push(g.nuc.m);
      g.par = H3.celulas(g, 30, { nucleo: true, planos: [g.pl], pc: 'pardo', p: { roughness: .5, sheen: .5 } });
      g.mit = H3.inst(g, H3.capsula(g, .45, .8, 8), H3.fis(g, '#8A4A2A', { p: { roughness: .5 } }), 300, null, g.pecas.pardo); g.pick.push(g.mit.m);
      g.vaso = H3.vaso(g, [[-3.6, -.15, .32], [-2, -.3, .36], [0, -.05, .32], [1.6, -.25, .36]], .12, { pc: 'vaso', n: 10, vel: .05, base: .3 });
      // adipócitos empacotados (posições fixas, com variação)
      g.pos = []; for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 2; k++) g.pos.push([-3 + i * .82 + (j & 1) * .4 + (hash(i, j) - .5) * .12, .4 - j * .7 + (hash(j, i) - .5) * .1, -.25 - k * .7 + (hash(i + j, k) - .5) * .1, .44 + .08 * hash(i * 7 + j, k)]);
    },
    animar(g, P) {
      const S = P.S, t = P.t, fl = S.fill == null ? .6 : S.fill, cg = sst(0, 1, S.frio || 0), lar = H3.deitado(g), v = S.v;
      g.pos.forEach((q, i) => {
        const r = q[3] * mix(.72, 1, fl), p = [q[0], q[1], q[2]];
        H3.celula(g, g.cel, p, r, '#F3D9C2', { pc: g.pecas.adip, f: [1, .95, 1] });
        H3.put(g, g.got, p, null, r * mix(.62, .9, fl), r * mix(.62, .9, fl) * .95, r * mix(.62, .9, fl), '#F8E3A0', 1, g.pecas.gota);
        const u = hash(i, 5) * TAU; g._v1.set(Math.cos(u), Math.sin(u), 0);
        H3.put(g, g.nuc, add(p, [Math.cos(u) * r * .93, Math.sin(u) * r * .93, 0]), g._q.setFromUnitVectors(g._v2.set(0, 1, 0), g._v1), r * .2, r * .06, r * .2, K.nucleo, 1, g.pecas.nuc);
      });
      H3.fimCel(g.cel); H3.fim(g.got); H3.fim(g.nuc);
      // adiposo pardo: ao lado (computador) ou embaixo (celular); esquenta no frio
      const bp = lar ? [3.4, -.1, -.4] : [-.6, -2.5, -.4];
      for (let i = 0; i < 9; i++) {
        const y = 1 - (i + .5) / 9 * 2, rr = Math.sqrt(1 - y * y), u = i * 2.4, p = add(bp, [Math.cos(u) * rr * .5, y * .5, Math.sin(u) * rr * .5]);
        H3.celula(g, g.par, p, .3, '#D9A07C', { n: .3, k: 1 + .35 * cg, pc: g.pecas.pardo });
        for (let m = 0; m < 5; m++) { const d = [hash(i, m) - .5, hash(m, i) - .5, hash(i + m, 3) - .5]; H3.bola(g, add(p, mul(d, .42)), .05 + .02 * hash(i, m + 9), '#F8E3A0', 1, g.pecas.pardo); }
        for (let m = 0; m < 8; m++) { const d = [hash(i, m + 20) - .5, hash(m + 20, i) - .5, hash(i + m, 23) - .5]; H3.put(g, g.mit, add(p, mul(d, .44)), H3.giro(g, i * 9 + m, 0), .035, .04, .035, cg > .2 ? '#C0562A' : '#8A4A2A', 1 + 1.4 * cg, g.pecas.pardo); }
      }
      H3.fimCel(g.par); H3.fim(g.mit);
      // calor do pardo no frio
      if (cg > .05) for (let j = 0; j < 14; j++) { const f = RED() ? hash(j, 1) : fr(t * .3 + j / 14), p = add(bp, [(hash(j, 2) - .5) * 1.2, .5 + f * 1.4, (hash(j, 3) - .5) * .8]); H3.brilho(g, p, .04 * cg * Math.sin(f * Math.PI), '#FF9A5A', 1.4); }
      // ácidos graxos saindo no jejum
      const sai = sst(10, 60, -v);
      if (sai > .02) for (let j = 0; j < 16; j++) { const q = g.pos[(j * 5) % g.pos.length], f = RED() ? hash(j, 4) : fr(t * .25 + j / 16), alvo = V.trilha(g.vaso.P, (j % 8) / 8 + .06), p = lerp3([q[0], q[1], q[2] + .1], alvo, sst(0, 1, f)); H3.brilho(g, add(p, [0, 0, .05]), .03 * sai, '#FFE7A3', 1.3); }
      g.vaso.set(t);
      const c0 = g.pos[9];
      ach(g, 'adip', [c0[0] - .3, c0[1] + .3, .05]); ach(g, 'gota', [g.pos[13][0], g.pos[13][1], .05]); ach(g, 'nuc', [g.pos[2][0] + .4, g.pos[2][1] - .2, .05]); ach(g, 'pele', [-2.4, 1.95, -.2]); ach(g, 'pardo', add(bp, [.3, .6, .3]));
      if (sai > .2) ach(g, 'ag', [0, -.05, .25]);
    },
    camera(g, P) { const lar = H3.deitado(g); return lar ? cam(g, P, 4.2, 2.3, { th: .22, fi: .14, al: [.2, -.1, 0], k: 1.0 }) : cam(g, P, 3.2, 2.9, { th: .2, fi: .14, al: [-.6, -.5, 0], k: 1.05 }); }
  });

  // =====================================================================================
  // CARTILAGEM: bloco com condrócitos em lacunas; ao lado, os anéis da traqueia (hialina), a orelha (elástica) e o disco entre vértebras (fibrosa)
  // =====================================================================================
  const PK = {
    matriz: { nome: 'Matriz cartilaginosa', frase: 'Firme e flexível, rica em colágeno e água, sem vasos sanguíneos: a nutrição chega por difusão.', cor: K.cart },
    cond: { nome: 'Condrócito na lacuna', frase: 'Célula da cartilagem presa num espaço da matriz (lacuna).', cor: '#C99AD8' },
    grupo: { nome: 'Grupo isógeno', frase: 'De 2 a 4 condrócitos vindos da divisão de uma só célula, na mesma lacuna ou em lacunas vizinhas.', cor: '#C99AD8' },
    peric: { nome: 'Pericôndrio', frase: 'Capa de conjuntivo denso, com vasos, em volta da cartilagem: nutre e forma novas células.', cor: K.conjC },
    vaso: { nome: 'Vaso do pericôndrio', frase: 'Os nutrientes saem daqui e atravessam a matriz devagar: por isso a cartilagem se regenera mal.', cor: K.sangue },
    trq: { nome: 'Anéis da traqueia', frase: 'Cartilagem hialina em forma de C: mantém a traqueia sempre aberta, com a parte de trás livre para o esôfago.', cor: K.cart },
    musc: { nome: 'Músculo liso da traqueia', frase: 'Fecha a abertura do C, por trás, junto ao esôfago.', cor: K.muscC },
    ore: { nome: 'Orelha (pavilhão)', frase: 'Cartilagem elástica: dobra e volta à forma.', cor: K.cart },
    disco: { nome: 'Disco entre vértebras', frase: 'Cartilagem fibrosa: aguenta compressão e tração.', cor: K.cart },
    ela: { nome: 'Fibras elásticas', frase: 'Rede escura na matriz da cartilagem elástica.', cor: '#5A3A6E' },
    colf: { nome: 'Feixes de colágeno', frase: 'Na cartilagem fibrosa, fileiras de condrócitos entre feixes grossos de colágeno.', cor: K.colag }
  };
  H3.cena('conjuntivo/cartilagem', {
    fit: 14, raio: 6, bolas: 300,
    pecas: PK,
    rotulos: [{ pc: 'matriz', t: 'matriz' }, { pc: 'cond', t: 'condrócito na lacuna' }, { pc: 'grupo', t: 'grupo isógeno' }, { pc: 'peric', t: 'pericôndrio' }, { pc: 'vaso', t: 'vaso' }, { pc: 'trq', t: 'anéis da traqueia' }, { pc: 'ore', t: 'orelha' }, { pc: 'disco', t: 'disco entre vértebras' }, { pc: 'ela', t: 'fibras elásticas' }, { pc: 'colf', t: 'feixes de colágeno' }],
    montar(g) {
      const T = g.T;
      g.blk = new T.Group(); g.raiz.add(g.blk);
      g.mats = ['#BFCDEB', '#C3B9E2', '#E7C6D2'].map((c, i) => H3.he(g, c, { dn: 0, esc: 2.4, fib: i === 0 ? 0 : 1, cf: i === 1 ? '#3E2752' : '#F09AB4', fq: i === 1 ? 5 : 9, dir: [1, 0, 0], luz: .6 }));
      g.mat = new T.Mesh(H3.caixa(g, 4, 2.6, 1.6, 30, 'kM'), g.mats[0]); g.blk.add(g.mat); g.mat.userData.peca = g.pecas.matriz; g.pick.push(g.mat);
      const per = H3.bloco(g, H3.caixa(g, .32, 2.6, 1.6, 4, 'kP'), K.conjC, { pai: g.blk, pc: 'peric', fib: 1, dir: [0, 1, 0], fq: 10, dn: .5, al: .45, esc: 4 }); per.position.x = -2.16; g.per = per;
      g.vaso = H3.vaso(g, [[-2.55, 1.6, .45], [-2.5, 0, .5], [-2.55, -1.6, .45]], .16, { pai: g.blk, pc: 'vaso', n: 8, vel: .05, base: .3 });
      const disco = (geo, cor, pc) => H3.inst(g, geo, H3.fis(g, cor, { p: { roughness: .5, clearcoat: .4 } }), 90, g.blk, g.pecas[pc]);
      g.lac = disco(H3.esfera(g, 20), '#EEF2FA', 'cond'); g.cnd = disco(H3.lumpy(g, 'cnd', 91, 3, 3, .08, .5, .9), '#C99AD8', 'cond'); g.cnn = disco(H3.esfera(g, 14), K.nucleo, 'cond'); g.pick.push(g.lac.m, g.cnd.m, g.cnn.m);
      // traqueia: tubo da mucosa com anéis em C e o músculo liso atrás
      g.trq = new T.Group(); g.raiz.add(g.trq);
      const mR = H3.fis(g, '#C6D6F0', { p: { roughness: .3, clearcoat: .8, clearcoatRoughness: .2, sheen: .4 }, rim: '#E6F0FF', rimK: .45 });
      for (let i = 0; i < 7; i++) { const r = H3.peca(g, H3.toro(g, .16, 28, TAU * .82), mR, 'trq', g.trq); r.rotation.set(Math.PI / 2, 0, Math.PI / 2 + TAU * .09); r.position.y = 1.5 - i * .5; r.scale.set(.82, .82, 1.25); }
      const muc = H3.peca(g, H3.cilindro(g, 32), H3.fis(g, '#E9A0B6', { p: { roughness: .6, sheen: .6 }, lados: 1 }), 'trq', g.trq); muc.scale.set(.66, 3.5, .66); muc.position.y = -.0;
      const lum = H3.peca(g, H3.cilindro(g, 32), H3.fis(g, '#2A1424', { p: { roughness: .9 } }), null, g.trq); lum.scale.set(.56, 3.52, .56);
      const ml = H3.peca(g, H3.caixa(g, .5, 3.4, .1, 6, 'kML'), H3.fis(g, K.muscC, { p: { roughness: .6 } }), 'musc', g.trq); ml.position.set(0, 0, -.7);
      // orelha (elástica) e disco entre vértebras (fibrosa)
      g.ore = new T.Group(); g.raiz.add(g.ore);
      const mO = H3.fis(g, '#F2C2B0', { p: { roughness: .45, sheen: .8, sheenColor: new T.Color('#FFE0D6') }, rim: '#FFC9B8', rimK: .45 });
      const hel = H3.peca(g, H3.toro(g, .2, 30, TAU * .75), mO, 'ore', g.ore); hel.scale.set(1, 1.45, .8); hel.rotation.z = -.6;
      const con = H3.peca(g, H3.lumpy(g, 'ore', 95, 3, 4, .12, .4, .8), mO, 'ore', g.ore); con.scale.set(.55, .85, .25); con.position.set(.1, -.1, -.05);
      const lob = H3.peca(g, H3.esfera(g, 24), mO, 'ore', g.ore); lob.scale.set(.32, .38, .18); lob.position.set(.25, -1.55, 0);
      g.dis = new T.Group(); g.raiz.add(g.dis);
      const mV = H3.fis(g, OSSO, { p: { roughness: .7 } });
      for (const s of [-1, 1]) { const vb = H3.peca(g, H3.cilindro(g, 32), mV, 'disco', g.dis); vb.scale.set(.95, .9, .95); vb.position.y = s * .75; }
      g.dsk = H3.peca(g, H3.cilindro(g, 32), H3.fis(g, '#DCE4F2', { p: { roughness: .4, clearcoat: .5 } }), 'disco', g.dis); g.dsk.scale.set(1.0, .55, 1.0);
      g.anel = H3.inst(g, H3.toro(g, .04, 32), H3.fis(g, '#F09AB4', { p: { roughness: .5 } }), 6, g.dis, g.pecas.disco);
      g.tip = -1;
    },
    animar(g, P) {
      const S = P.S, t = P.t, k = cl(Math.round(S.v), 0, 2), lar = H3.deitado(g);
      g.k = k; g.mat.material = g.mats[k]; g.per.visible = k < 2;
      g.blk.position.set(lar ? 1.5 : 0, lar ? 0 : -1.55, 0); g.blk.scale.setScalar(lar ? 1 : .82);
      const op = lar ? [-2.75, 0, 0] : [0, 2.15, 0], esc = lar ? .78 : .55;
      [g.trq, g.ore, g.dis].forEach((o, i) => { o.visible = i === k; o.position.set(...op); o.scale.setScalar(esc); const r0 = i === 0 ? -.95 : .5; o.rotation.y = RED() ? r0 : r0 + Math.sin(t * .3) * .35; o.rotation.x = i === 0 ? .28 : 0; });
      // condrócitos na face da frente e no topo do bloco (relevo baixo, como no corte)
      const zf = .8, grupos = [];
      const lac = (x, y, n, rot) => { grupos.push([x, y]); for (let i = 0; i < n; i++) { const a = rot + i / n * TAU, d = n > 1 ? .12 : 0, p = [x + Math.cos(a) * d, y + Math.sin(a) * d, zf]; H3.put(g, g.lac, [p[0], p[1], zf - .01], null, .14, .12, .04, '#EEF2FA', 1, g.pecas.cond); H3.put(g, g.cnd, [p[0], p[1], zf + .005], g.qI, .1, .085, .03, '#C99AD8', 1, g.pecas.cond); H3.put(g, g.cnn, [p[0], p[1], zf + .03], null, .045, .04, .015, K.nucleo, 1, g.pecas.cond); } };
      if (k === 2) { for (let r = 0; r < 4; r++) for (let i = 0; i < 9; i++) lac(-1.55 + i * .38 + (r & 1) * .1, .95 - r * .62, 1, 0); }
      else for (let i = 0; i < 16; i++) { const x = -1.5 + (i % 4) * .95 + (hash(i, 1) - .5) * .3, y = .9 - Math.floor(i / 4) * .6 + (hash(i, 2) - .5) * .15; lac(x, y, 1 + Math.floor(hash(i, 3) * 3.2), hash(i, 4) * TAU); }
      H3.fim(g.lac); H3.fim(g.cnd); H3.fim(g.cnn);
      // nutrientes saindo do vaso e atravessando a matriz devagar
      for (let j = 0; j < 18; j++) { const f = RED() ? hash(j, 3) : fr(t * .07 + j / 18), x = mix(-2.5, 1.8, f), y = 1.1 - hash(j, 1) * 2.2 + Math.sin(f * 9 + j) * .08, a = Math.sin(f * Math.PI) * (1 - f * .6); if (a > .05) H3.brilho(g, H3.mundo(g, g.blk, [x, y, zf + .06]), .03 * a, '#FFE7A3', 1.2); }
      g.vaso.set(t);
      // disco fibroso: anéis de colágeno
      if (k === 2) { for (let i = 0; i < 5; i++) H3.put(g, g.anel, [0, (i - 2) * .08, 0], g._q.setFromAxisAngle(g._v1.set(1, 0, 0), Math.PI / 2), .5 + i * .1, .5 + i * .1, .5 + i * .1, '#F09AB4', 1, g.pecas.disco); }
      H3.fim(g.anel);
      const w = p => H3.mundo(g, g.blk, p), wo = (o, p) => H3.mundo(g, o, p);
      ach(g, 'matriz', w([1.6, -1.05, zf])); if (k < 2) ach(g, 'peric', w([-2.16, .35, .8])); ach(g, 'vaso', w([-2.5, -.8, .6]));
      const gi = grupos.find(q => true) || [0, 0]; ach(g, 'cond', w([gi[0], gi[1] + .1, zf + .05]));
      if (k === 0) { const g2 = grupos[5] || gi; ach(g, 'grupo', w([g2[0], g2[1] - .12, zf + .05])); ach(g, 'trq', wo(g.trq, [0, 1.75, 0])); }
      if (k === 1) { ach(g, 'ela', w([.4, -.75, zf])); ach(g, 'ore', wo(g.ore, [.8, .8, 0])); }
      if (k === 2) { ach(g, 'colf', w([.2, -.95, zf])); ach(g, 'disco', wo(g.dis, [1, .3, 0])); }
    },
    camera(g, P) { const lar = H3.deitado(g); return lar ? cam(g, P, 4.6, 1.9, { th: .25, fi: .12, al: [-.3, 0, 0] }) : cam(g, P, 2.2, 3.6, { th: .2, fi: .1, al: [0, .1, 0] }); }
  });

  // =====================================================================================
  // TECIDO ÓSSEO: osso longo em corte e um ósteon aberto em cunha, com remodelação
  // =====================================================================================
  const PO = {
    comp: { nome: 'Osso compacto', frase: 'Parede maciça do osso, feita de ósteons (sistemas de Havers).', cor: OSSO },
    esp: { nome: 'Osso esponjoso', frase: 'Traves finas nas pontas do osso, com medula vermelha entre elas.', cor: OSSO },
    mver: { nome: 'Medula vermelha', frase: 'Produz as células do sangue (hematopoese).', cor: '#B8424E' },
    mama: { nome: 'Medula amarela', frase: 'Gordura no canal do meio do osso do adulto.', cor: '#E9C46A' },
    lam: { nome: 'Lamelas', frase: 'Camadas de matriz em anéis concêntricos: colágeno (flexibilidade) e fosfato de cálcio (dureza).', cor: OSSO },
    hav: { nome: 'Canal de Havers', frase: 'Canal no centro do ósteon, com vasos e nervos.', cor: K.sangue },
    vol: { nome: 'Canal de Volkmann', frase: 'Canal transversal que liga os canais de Havers entre si e à superfície.', cor: '#C04A5A' },
    oc: { nome: 'Osteócito', frase: 'Célula presa na lacuna; troca substâncias com as vizinhas por canalículos.', cor: '#B98AD6' },
    clas: { nome: 'Osteoclasto', frase: 'Célula gigante, com vários núcleos, que dissolve a matriz (reabsorção) e libera cálcio.', cor: '#D46A8C' },
    blas: { nome: 'Osteoblastos', frase: 'Fabricam matriz nova, que depois se mineraliza; os que ficam presos viram osteócitos.', cor: '#7FA4E8' }
  };
  H3.cena('conjuntivo/osso', {
    fit: 16, raio: 7, bolas: 300,
    pecas: PO,
    rotulos: [{ pc: 'comp', t: 'osso compacto' }, { pc: 'esp', t: 'osso esponjoso' }, { pc: 'mver', t: 'medula vermelha' }, { pc: 'mama', t: 'medula amarela' }, { pc: 'lam', t: 'lamelas' }, { pc: 'hav', t: 'canal de Havers' }, { pc: 'oc', t: 'osteócito' }, { pc: 'clas', t: 'osteoclasto' }, { pc: 'blas', t: 'osteoblastos' }, { pc: 'vol', t: 'canal de Volkmann' }],
    so2D: S => !!S.exp,
    montar(g) {
      const T = g.T;
      // osso longo (eixo y), cortado ao meio
      g.ol = new T.Group(); g.raiz.add(g.ol);
      const pl = H3.corte(g, g.ol, [0, 0, -1], 0);
      const per = (k, e) => { const P = []; for (let i = 0; i <= 30; i++) { const u = i / 30, y = mix(-2, 2, u), d = Math.abs(y), w = (d > 1.35 ? mix(.55, .72, Math.sin(seg(d, 1.35, 2) * Math.PI * .85)) : mix(.32, .55, sst(.7, 1.35, d))) * k + e; P.push([Math.max(.01, d > 1.95 ? w * (1 - (d - 1.95) * 18) : w), y]); } return P; };
      const fora = H3.solido(g, H3.torno(g, per(1, 0), 40, 'oF'), OSSO, [pl], { pai: g.ol, pc: 'comp', corte: OSSOc, m: { p: { roughness: .65, clearcoat: .2 } } });
      const can = H3.solido(g, H3.torno(g, [[.01, -1.25], [.2, -1.2], [.21, 0], [.2, 1.2], [.01, 1.25]], 30, 'oC'), '#E9C46A', [pl], { pai: g.ol, pc: 'mama', corte: '#EDCB76' });
      for (const s of [-1, 1]) { const ep = H3.solido(g, H3.esfera(g, 28), '#B8424E', [pl], { pai: g.ol, pc: 'mver', corte: '#B8424E', kc: 1 }); ep.scale.set(.6, .55, .6); ep.position.y = s * 1.55; }
      g.tra = H3.inst(g, H3.cilindro(g, 6), H3.fis(g, OSSOc, { p: { roughness: .6 } }), 90, g.ol, g.pecas.esp); g.pick.push(g.tra.m);
      // ósteon: lamelas em cilindros encaixados, abertos em cunha (falta um quarto)
      g.ost = new T.Group(); g.raiz.add(g.ost);
      const pA = H3.corte(g, g.ost, [-1, 0, 0], 0), pB = H3.corte(g, g.ost, [0, 0, -1], 0);
      g.lams = [];
      for (let i = 0; i < 6; i++) {
        const r = 1.5 - i * .2, c = i & 1 ? '#EADDC4' : '#F3EAD8', h = 2.6 + i * .025;
        const s = H3.solido(g, H3.cilindro(g, 48), c, [pA, pB], { pai: g.ost, pc: 'lam', corte: i & 1 ? '#E6D6B8' : '#F5EDDC', kc: 1, m: { p: { roughness: .7, clearcoat: .15 } } });
        s.scale.set(r, h, r); s.userData.fr.material.clipIntersection = true; s.userData.bk.material.clipIntersection = true; g.lams.push(s);
      }
      const hv = H3.solido(g, H3.cilindro(g, 32), '#3A1A24', [pA, pB], { pai: g.ost, pc: 'hav', corte: '#3A1A24', kc: 1 }); hv.scale.set(.32, 2.8, .32); hv.userData.fr.material.clipIntersection = true; hv.userData.bk.material.clipIntersection = true;
      g.vA = H3.tubo(g, 2, 10, H3.fis(g, '#D4344A', { p: { roughness: .4 } }), g.ost, 'hav'); g.vA.set([[-.1, -1.45, .05], [-.1, 1.45, .05]], .09);
      g.vV = H3.tubo(g, 2, 10, H3.fis(g, '#5A6FD8', { p: { roughness: .4 } }), g.ost, 'hav'); g.vV.set([[.1, -1.45, -.08], [.1, 1.45, -.08]], .08);
      g.vN = H3.tubo(g, 2, 8, H3.fis(g, '#F0D98A', { p: { roughness: .4 } }), g.ost, 'hav'); g.vN.set([[-.02, -1.45, -.15], [-.02, 1.45, -.15]], .04);
      g.vol = H3.tubo(g, 2, 10, H3.fis(g, '#C04A5A', { p: { roughness: .4 } }), g.ost, 'vol'); g.vol.set([[0, -.6, 0], [-1.9, -.75, -1.0]], .1);
      g.ocy = H3.inst(g, H3.lumpy(g, 'ocy', 97, 2, 6, .25, .3, .6), H3.fis(g, '#B98AD6', { p: { roughness: .5 } }), 80, g.ost, g.pecas.oc); g.pick.push(g.ocy.m);
      g.cnl = H3.inst(g, H3.cilindro(g, 4), H3.fis(g, '#8E6AA8', { p: { roughness: .6 } }), 300, g.ost, g.pecas.oc);
      g.cla = H3.peca(g, H3.lumpy(g, 'cla', 99, 3, 7, .18, .3, .6), H3.fis(g, '#D46A8C', { p: { roughness: .5, sheen: .6 }, rimK: .35 }), 'clas', g.ost);
      g.claN = H3.inst(g, H3.esfera(g, 12), H3.fis(g, K.nucleo, { p: { roughness: .4 } }), 6, g.cla, g.pecas.clas);
      g.bla = H3.celulas(g, 20, { nucleo: true, pai: g.ost, pc: 'blas' });
      g.nova = H3.peca(g, H3.cilindro(g, 48, true), H3.fis(g, '#F7F0E2', { p: { roughness: .6, transparent: true, opacity: .85 }, lados: 1 }), 'blas', g.ost);
      g.cova = H3.peca(g, H3.esfera(g, 24), H3.fis(g, '#7A3A4A', { p: { roughness: .8 } }), 'clas', g.ost);
    },
    animar(g, P) {
      const S = P.S, t = P.t, lar = H3.deitado(g), b = cl((S.v + 100) / 200, 0, 1);
      g.ol.position.set(lar ? -3.2 : -1.45, lar ? 0 : 1.75, 0); g.ol.scale.setScalar(lar ? 1.05 : .72); g.ol.rotation.set(0, lar ? .25 : .2, lar ? 0 : 0);
      g.ost.position.set(lar ? 1.6 : .9, lar ? -.1 : -1.25, 0); g.ost.scale.setScalar(lar ? 1 : .78); g.ost.rotation.set(.22, RED() ? -.95 : -.95 + Math.sin(t * .2) * .2, 0);
      // traves do esponjoso, na face cortada das pontas
      for (const s of [-1, 1]) for (let i = 0; i < 40; i++) { const a = [(hash(i, s + 3) - .5) * .95, s * (1.25 + hash(i, s + 5) * .6), -.05 - hash(i, 7) * .3], d = [hash(i, 8) - .5, hash(i, 9) - .5, (hash(i, 10) - .5) * .3]; H3.bastao(g, g.tra, a, add(a, mul(nrm(d), .28)), .03, OSSOc, 1, g.pecas.esp); }
      H3.fim(g.tra);
      // osteócitos nas faces da cunha e no topo, com canalículos
      let n = 0; const top = 1.3;
      const ocy = (p, nr) => { H3.put(g, g.ocy, p, g._q.setFromUnitVectors(g._v2.set(0, 1, 0), g._v1.set(nr[0], nr[1], nr[2])), .09, .045, .05, '#B98AD6', 1, g.pecas.oc); for (let k = 0; k < 4; k++) { const a = k / 4 * TAU + n; const dd = [Math.cos(a) * .14, Math.sin(a) * .14, 0]; H3.bastao(g, g.cnl, p, add(p, nr[0] ? [0, dd[1], dd[0]] : [dd[0], dd[1], 0]), .008, '#8E6AA8', 1, g.pecas.oc); } n++; };
      for (let i = 0; i < 5; i++) { const r = 1.4 - i * .2 - .1; for (let j = 0; j < 3; j++) { const y = -.9 + j * .9 + (hash(i, j) - .5) * .2; ocy([.004, y, r], [1, 0, 0]); ocy([r, y + .3, .004], [0, 0, 1]); } for (let j = 0; j < 4; j++) { const a = Math.PI * .5 + (j + .5) / 4 * Math.PI * 1.5 + i * .3; ocy([Math.cos(a) * r, top + i * .025 + .02, Math.sin(a) * r], [0, 1, 0]); } }
      H3.fim(g.ocy); H3.fim(g.cnl);
      // remodelação: o osteoclasto cava uma cova na superfície; os osteoblastos depositam uma lamela nova
      const ang = RED() ? -2.2 : -2.2 + Math.sin(t * .25) * .5, rc = 1.5, cpos = [Math.cos(ang) * rc, .2, Math.sin(ang) * rc], kc = 1 - b;
      g.cla.position.set(...cpos.map((x, i) => i === 1 ? x : x * 1.12)); g.cla.scale.setScalar(.22 + .14 * kc); g.cla.visible = kc > .08;
      for (let i = 0; i < 4; i++) H3.put(g, g.claN, [(i - 1.5) * .35, .15, .3], null, .22, .2, .2, K.nucleo, 1, g.pecas.clas); H3.fim(g.claN);
      g.cova.position.set(...cpos); g.cova.scale.set(.32 * kc + .01, .5 * kc + .01, .32 * kc + .01); g.cova.visible = kc > .08;
      const nv = sst(.15, 1, b) * (RED() ? 1 : .7 + .3 * fr(t / 9)); g.nova.visible = b > .1; g.nova.scale.set(1.5 + .07 * nv, 2.62 * (.3 + .7 * nv), 1.5 + .07 * nv);
      for (let i = 0; i < 9; i++) { const a = 1.0 + i * .26, p = [Math.cos(a) * (1.62 + .07 * nv), -.9 + (i % 3) * .55, Math.sin(a) * (1.62 + .07 * nv)]; g._v1.set(Math.cos(a), 0, Math.sin(a)); H3.celula(g, g.bla, p, .13 * sst(0, .25, b), '#7FA4E8', { n: .45, nd: [Math.cos(a) * .3, 0, Math.sin(a) * .3], pc: g.pecas.blas, q: g._q.setFromUnitVectors(g._v2.set(0, 1, 0), g._v1), f: [1, .8, 1.1] }); }
      H3.fimCel(g.bla);
      const wl = p => H3.mundo(g, g.ol, p), wo = p => H3.mundo(g, g.ost, p);
      ach(g, 'comp', wl([-.38, -.2, 0])); ach(g, 'esp', wl([.3, 1.5, -.1])); ach(g, 'mver', wl([-.25, -1.6, -.1])); ach(g, 'mama', wl([.08, .5, -.1]));
      ach(g, 'lam', wo([.004, -.2, 1.25])); ach(g, 'hav', wo([0, 1.45, 0])); ach(g, 'oc', wo([.004, .45, 1.1])); ach(g, 'vol', wo([-1.2, -.7, -.65]));
      if (kc > .15) ach(g, 'clas', g.cla.getWorldPosition(new g.T.Vector3()).toArray()); if (b > .15) ach(g, 'blas', wo([Math.cos(1.6) * 1.75, -.4, Math.sin(1.6) * 1.75]));
    },
    camera(g, P) { const lar = H3.deitado(g); return lar ? cam(g, P, 5, 2.5, { th: .1, fi: .2, al: [-.6, 0, 0] }) : cam(g, P, 2.5, 3.5, { th: .1, fi: .18, al: [0, .1, 0] }); }
  });

  // =====================================================================================
  // OSSIFICAÇÃO: crânio visto de cima (intramembranosa) e osso longo em corte (endocondral)
  // =====================================================================================
  const CRN = [[-.4, -.58], [.4, -.58], [-.5, .15], [.5, .15], [0, .86]];
  const PF = {
    mes: { nome: 'Mesênquima', frase: 'Tecido do embrião de onde sai o osso do crânio, sem passar por cartilagem.', cor: '#E9B9C8' },
    cen: { nome: 'Centro de ossificação', frase: 'Células viram osteoblastos e depositam osso direto no mesênquima (ossificação intramembranosa).', cor: OSSO },
    fa: { nome: 'Fontanela anterior (moleira)', frase: 'Membrana entre os ossos do crânio do bebê; fecha até cerca de 2 anos.', cor: '#E9B9C8' },
    fp: { nome: 'Fontanela posterior', frase: 'Fecha nos primeiros meses de vida.', cor: '#E9B9C8' },
    sut: { nome: 'Sutura', frase: 'Junta firme entre os ossos do crânio.', cor: '#B98A70' },
    mol: { nome: 'Molde de cartilagem hialina', frase: 'O osso longo começa como cartilagem, que depois é trocada por osso (ossificação endocondral).', cor: K.cart },
    pri: { nome: 'Centro primário', frase: 'No meio do molde: a cartilagem morre, vasos entram e osteoblastos fazem osso.', cor: OSSO },
    can: { nome: 'Canal medular', frase: 'Com medula vermelha no bebê e, no adulto, amarela (gordura).', cor: '#C04A5A' },
    sec: { nome: 'Centro secundário', frase: 'Nas pontas (epífises), depois do nascimento.', cor: OSSO },
    disc: { nome: 'Disco epifisário', frase: 'Faixa de cartilagem entre a ponta e o corpo do osso: é onde o osso cresce em comprimento. Fecha no fim da adolescência.', cor: K.cart },
    vas: { nome: 'Vaso sanguíneo', frase: 'Entra no molde e traz as células que formam osso.', cor: K.sangue }
  };
  H3.cena('conjuntivo/ossificacao', {
    fit: 16, raio: 7, bolas: 120,
    pecas: PF,
    rotulos: [{ pc: 'mes', t: 'mesênquima' }, { pc: 'cen', t: 'centro de ossificação' }, { pc: 'fa', t: 'fontanela anterior' }, { pc: 'fp', t: 'fontanela posterior' }, { pc: 'sut', t: 'sutura' }, { pc: 'mol', t: 'molde de cartilagem' }, { pc: 'pri', t: 'centro primário' }, { pc: 'can', t: 'canal medular' }, { pc: 'sec', t: 'centro secundário' }, { pc: 'disc', t: 'disco epifisário' }],
    montar(g) {
      const T = g.T;
      g.cr = new T.Group(); g.raiz.add(g.cr);
      g.dome = H3.peca(g, H3.esfera(g, 40), H3.filme(g, '#E9B9C8', { cor2: '#FFFFFF', dentro: '#5A2A3A', base: .3, fr: .5, esc: 3 }), 'mes', g.cr); g.dome.scale.set(1.25, .8, 1.6); g.dome.renderOrder = 3;
      g.pl0 = []; const N = g.q.cel ? 420 : 640;
      for (let i = 0; i < N; i++) { const y = 1 - (i + .5) / N, r = Math.sqrt(1 - y * y), a = i * 2.39996, x = Math.cos(a) * r, z = Math.sin(a) * r; if (y < .12) continue; let b = 0, bd = 9, sd = 9; CRN.forEach((c, k) => { const d = Math.hypot(x * 1.0 - c[0], z - c[1]); if (d < bd) { sd = bd; bd = d; b = k; } else if (d < sd) sd = d; }); g.pl0.push({ p: [x, y, z], b, d: bd, borda: sd - bd }); }
      g.plc = H3.inst(g, H3.cilindro(g, 6), H3.fis(g, OSSO, { p: { roughness: .6, clearcoat: .2 } }), g.pl0.length, g.cr, g.pecas.cen); g.pick.push(g.plc.m);
      // osso longo endocondral (eixo x), cortado ao meio
      g.ob = new T.Group(); g.raiz.add(g.ob);
      g.bi = new T.Group(); g.ob.add(g.bi);
      const pl = H3.corte(g, g.bi, [0, 0, -1], 0);
      const prof = []; for (let i = 0; i <= 30; i++) { const u = i / 30, y = mix(-.5, .5, u), d = Math.abs(y) / .5, w = d > .7 ? mix(.064, .11, Math.sin(seg(d, .7, 1) * Math.PI * .8)) * (d > .97 ? 1 - (d - .97) * 25 : 1) : mix(.0616, .064, d); prof.push([Math.max(.003, w), y]); }
      g.mol = H3.solido(g, H3.torno(g, prof, 40, 'fM'), '#C6D4EE', [pl], { pai: g.bi, pc: 'mol', corte: '#D3DEF2', m: { p: { roughness: .35, clearcoat: .6 } } });
      g.col = H3.solido(g, H3.cilindro(g, 40), OSSO, [pl], { pai: g.bi, pc: 'pri', corte: OSSOc });
      g.med = H3.solido(g, H3.cilindro(g, 32), '#B8424E', [pl], { pai: g.bi, pc: 'can', corte: '#B8424E', kc: 1 });
      g.sec = [-1, 1].map(() => { const a = H3.solido(g, H3.esfera(g, 28), OSSO, [pl], { pai: g.bi, pc: 'sec', corte: OSSOc }); const b = H3.solido(g, H3.esfera(g, 24), '#B8424E', [pl], { pai: a, pc: 'sec', corte: '#B8424E', kc: 1 }); b.scale.setScalar(.55); return a; });
      g.vas = [0, 1, 2].map(() => H3.tubo(g, 8, 8, H3.fis(g, '#D4344A', { p: { roughness: .4 } }), g.bi, 'vas'));
    },
    animar(g, P) {
      const S = P.S, t = P.t, v = cl(S.v, 0, 100), lar = H3.deitado(g);
      g.cr.position.set(lar ? -2.5 : 0, lar ? -.1 : 1.7, 0); g.cr.scale.setScalar(lar ? 1.12 : 1.05); g.cr.rotation.set(.34, RED() ? 0 : Math.sin(t * .2) * .15, 0);
      g.ob.position.set(lar ? 2.3 : 0, lar ? 0 : -1.55, 0); g.ob.scale.setScalar(lar ? 1.3 : 1);
      // crânio: placas crescem a partir dos centros; as fontanelas fecham por último
      const gr = 1.1 * sst(4, 24, v) + .45 * sst(24, 40, v), sut = mix(.05, .02, sst(40, 90, v));
      g.pl0.forEach((q, i) => { const on = q.d < gr && q.borda > sut; if (!on) return; const s = .075 * sst(0, .12, gr - q.d); g._v1.set(q.p[0], q.p[1], q.p[2]); H3.put(g, g.plc, [q.p[0] * 1.27, q.p[1] * .82, q.p[2] * 1.62], g._q.setFromUnitVectors(g._v2.set(0, 1, 0), g._v1), s * 1.2, .03, s * 1.2, i % 4 ? OSSO : '#E8DAC0', 1, g.pecas.cen); });
      H3.fim(g.plc);
      const wc = p => H3.mundo(g, g.cr, p), fa = [0, .8, -.25], fpp = [0, .67, .55];
      const ka = 1 - sst(26, 40, v), kp = 1 - sst(25, 28.5, v);
      if (v < 4) ach(g, 'mes', wc([-.6, .6, .3])); else if (v < 24) ach(g, 'cen', wc([CRN[2][0] * 1.27, .7, CRN[2][1] * 1.6]));
      if (v > 18 && ka > .1) ach(g, 'fa', wc([fa[0] * 1.27, fa[1], fa[2] * 1.6])); if (v > 18 && kp > .1) ach(g, 'fp', wc([fpp[0], fpp[1], fpp[2] * 1.6])); if (v >= 40) ach(g, 'sut', wc([0, .82, .15]));
      // osso longo
      const len = v < 25 ? mix(.32, .5, v / 25) : v < 40 ? mix(.5, .6, (v - 25) / 15) : v < 70 ? mix(.6, .84, (v - 40) / 30) : v < 90 ? mix(.84, 1, (v - 70) / 20) : 1;
      const Lmax = lar ? 5.4 : 4.6, L = Lmax * len, re = L * .11, hs = L * .062, ex = L / 2 - re, sh = sst(0, 4, v);
      g.bi.scale.setScalar(1); g.mol.scale.set(L, L, L * .999); g.ob.visible = true; g.mol.visible = sh > .01;
      const pc = sst(11, 17, v), mc = sst(12, 22, v), sc = sst(25, 38, v), cc = sst(88, 96, v), dEnd = ex - re * .62;
      const xb = mix(re * .25, dEnd + re * .27 * cc, pc);
      g.col.visible = pc > .01; g.col.scale.set(hs * 1.06, xb * 2, hs * 1.06);
      g.med.visible = mc > .01; const amarela = sst(70, 90, v); g.med.userData.fr.material.color.set(amarela > .5 ? '#E9C46A' : '#B8424E'); g.med.userData.bk.material.color.set(amarela > .5 ? '#EDCB76' : '#B8424E');
      g.med.scale.set(hs * .55, mix(0, dEnd - re * .1, mc) * 2, hs * .55);
      g.sec.forEach((s, i) => { const sg = i ? 1 : -1; s.visible = sc > .01; s.position.set(0, sg * (ex + re * .1), 0); s.scale.setScalar(re * mix(.45, .62, cc) * sc + .001); });
      // vasos entrando
      const vv = (tb, a, b, k) => { if (k <= .01) { tb.set([]); return; } const P2 = []; for (let i = 0; i < 8; i++) P2.push(lerp3(a, b, i / 7 * k)); tb.set(P2, .035); };
      vv(g.vas[0], [hs * 2.4, 0, .1], [0, 0, .05], sst(8, 11, v)); vv(g.vas[1], [re * 1.7, ex, .1], [re * .3, ex, .05], sst(27, 32, v)); vv(g.vas[2], [re * 1.7, -ex, .1], [re * .3, -ex, .05], sst(27, 32, v));
      const wb = p => H3.mundo(g, g.bi, p);
      if (pc < .5) ach(g, 'mol', wb([re * .5, ex * .5, 0])); else if (sc < .3) ach(g, 'pri', wb([0, 0, 0]));
      if (mc > .5) ach(g, 'can', wb([0, -ex * .3, 0])); if (sc > .5 && cc < .5) ach(g, 'disc', wb([0, dEnd + re * .13, 0])); if (sc > .3 && v < 50) ach(g, 'sec', wb([0, -(ex + re * .1), 0]));
    },
    camera(g, P) { const lar = H3.deitado(g); return lar ? cam(g, P, 5.2, 2.3, { th: 0, fi: .2, al: [-.4, 0, 0], viva: .3 }) : cam(g, P, 2.4, 3.6, { th: 0, fi: .18, al: [0, .05, 0], viva: .3 }); }
  });
})();
