/* LAB Vírus: cenas 3D da Replicação (Martin), sobre o kit vir3d.js e as peças de vir3d-pecas.js.
   Vírus em células animais: a célula em corte (membrana, citoplasma e núcleo), o vírus com envelope que se prende ao receptor,
   entra por fusão ou por endocitose, se desmonta, copia o RNA no citoplasma, monta capsídeos sob as espículas e sai por
   brotamento; o adenovírus, sem envelope, entra por endocitose, copia o DNA no núcleo e sai rompendo a célula.
   Retrovírus: um modo novo, "HIV em 3D", com a partícula aberta (envelope com gp120, matriz, capsídeo em cone, dois RNAs,
   transcriptase reversa, integrase e protease) e a transcriptase reversa montando DNA a partir do RNA. O ciclo com os
   remédios e a latência continuam no desenho plano. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.kitV) return;
  const { V, K } = V3, { cl, mix, sst, add, sub, mul, nrm, dot, hash, lerp3, TAU } = V;
  const RED = () => V3.REDUZ();
  const sg = (a, b, x) => cl((x - a) / (b - a), 0, 1);
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const cam = (g, P, hx, hy, o = {}) => V3.viva({ th: o.th == null ? .3 : o.th, fi: o.fi == null ? .2 : o.fi, d: V3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .5 : o.viva);
  const temGL = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } })();
  // modo novo num tópico 2D: botão extra, pastilha de lugar e desenho plano de reserva (o modo 3D usa o desenho do modo base)
  function modo3D(chave, id, rotulo, base, loc, pos) {
    const o = SC[chave]; if (!o || !temGL || !window.MOL3D) return false;
    const b = { t: rotulo, on: S => { S.modo = S.modo === id ? base : id; }, pressed: S => S.modo === id };
    if (pos == null) o.extra.push(b); else o.extra.splice(pos, 0, b);
    const d0 = o.draw; o.draw = function (t, S) { if (S.modo !== id) return d0.call(this, t, S); S.modo = base; try { return d0.call(this, t, S); } finally { S.modo = id; } };
    const l0 = o.loc; o.loc = S => (S.modo === id ? loc : typeof l0 === 'function' ? l0(S) : l0);
    return true;
  }
  V3.modo3D = modo3D;

  // =====================================================================================
  // VÍRUS EM CÉLULAS ANIMAIS (v de 0 a 16, seis etapas)
  // =====================================================================================
  const R1N = ['Ligação ao receptor', 'Entrada', 'Desnudamento', 'Cópia e proteínas', 'Montagem', 'Saída'];
  const r1Etapa = v => v < 2.5 ? 0 : v < 5 ? 1 : v < 7 ? 2 : v < 10.5 ? 3 : v < 12.5 ? 4 : 5;
  const PE = {
    virus: { nome: 'Vírus com envelope', frase: 'Esquema de vírus de RNA: envelope de lipídios com espículas, capsídeo e RNA.', cor: C.envelope },
    adeno: { nome: 'Adenovírus', frase: 'Vírus de DNA sem envelope: capsídeo icosaédrico com uma fibra em cada vértice.', cor: C.capsideo },
    esp: { nome: 'Espícula', frase: 'Glicoproteína do vírus que se encaixa no receptor da célula, como chave e fechadura.', cor: C.espicula },
    rec: { nome: 'Receptor', frase: 'Proteína da membrana da célula. Sem o receptor certo, o vírus não se prende.', cor: C.receptor },
    mem: { nome: 'Membrana da célula', frase: 'Bicamada de lipídios. No brotamento, um pedaço dela vira o envelope do vírus novo.', cor: C.membrana },
    cap: { nome: 'Capsídeo', frase: 'Capa de proteína. Dentro da célula, se desmonta e libera o ácido nucleico: é o desnudamento.', cor: C.capsideo },
    rna: { nome: 'RNA do vírus', frase: 'Copiado no citoplasma por uma enzima do vírus; os ribossomos da célula leem esse RNA e fazem as proteínas virais.', cor: C.rna },
    dna: { nome: 'DNA do adenovírus', frase: 'Vai ao núcleo e é copiado lá, com as enzimas da célula.', cor: C.dna },
    nuc: { nome: 'Núcleo', frase: 'Guarda o DNA da célula. Vírus de DNA, como o adenovírus, costumam se copiar aqui.', cor: C.nucleo },
    ribo: { nome: 'Ribossomos da célula', frase: 'Fazem as proteínas do vírus: capsômeros e espículas.', cor: C.ribo },
    ves: { nome: 'Vesícula de endocitose', frase: 'A célula engole o vírus inteiro num pedaço da própria membrana.', cor: '#F49AC8' },
    novos: { nome: 'Vírus novos', frase: 'Com envelope, saem por brotamento e levam um pedaço da membrana; sem envelope, saem rompendo a célula.', cor: C.capsideo }
  };
  const RC = 6, CC = [0, -RC - .15, 0], NC = [1.55, -2.7, -.75], RN = 1.2, CY = [-1.25, -1.55, -.45];
  const sph = (pol, az) => [Math.sin(pol) * Math.cos(az), Math.cos(pol), Math.sin(pol) * Math.sin(az)];
  const BUD = [sph(.33, 3.5), sph(.3, 4.71), sph(.36, 5.9)];
  const RECS = [sph(0, 0), sph(.18, 3.3), sph(.2, 4.4), sph(.22, 5.5), sph(.28, 3.9), sph(.27, 5.05), sph(.42, 4.4), sph(.45, 3.4), sph(.45, 5.8), sph(.12, 4.9)];
  const sup = (d, h) => add(CC, mul(d, RC + (h || 0)));
  V3.cena('replicacao/animal', {
    fit: 9, raio: 5, bolas: 300, pecas: PE,
    so2D: S => !!S.lat,
    rotulos: [{ pc: 'virus', t: 'vírus', pr: 1 }, { pc: 'adeno', t: 'adenovírus', pr: 1 }, { pc: 'rec', t: 'receptor', pr: 3 }, { pc: 'mem', t: 'membrana', pr: 6 }, { pc: 'nuc', t: 'núcleo', pr: 5 }, { pc: 'cap', t: 'capsídeo', pr: 2 }, { pc: 'rna', t: 'RNA', pr: 2 }, { pc: 'dna', t: 'DNA', pr: 2 }, { pc: 'ribo', t: 'ribossomos', pr: 4 }, { pc: 'ves', t: 'vesícula', pr: 3 }, { pc: 'novos', t: 'vírus novos', pr: 1 }],
    montar(g) {
      const T = g.T;
      g.pl = V3.corte(g, g.raiz, [0, 0, -1], 0);
      g.W = V3.kitV(g, { knobs: 1300, rods: 500 });
      const esf = V3.esfera(g, g.q.cel ? 48 : 72);
      g.cel = V3.solido(g, esf, C.membrana, [g.pl], { corte: '#35244E', kc: 1, pc: 'mem', m: { p: { roughness: .55, sheen: .7, sheenColor: new T.Color('#FFD6EA') }, rim: '#FFC4E0', rimK: .3 } });
      g.cel.scale.setScalar(RC); g.cel.position.set(CC[0], CC[1], CC[2]);
      g.nuc = V3.solido(g, V3.esfera(g, 40), '#8D62E8', [g.pl], { corte: '#4A2F8E', kc: 1, pc: 'nuc', m: { p: { roughness: .5, sheen: .5 } } });
      g.nuc.scale.setScalar(RN); g.nuc.position.set(NC[0], NC[1], NC[2]);
      g.ves = new T.Mesh(V3.esfera(g, 32), V3.filme(g, '#F49AC8', { cor2: '#FFE0F0', dentro: '#3A1530', base: .1, fr: .7, esc: 2 })); g.raiz.add(g.ves); g.ves.renderOrder = 7; g.ves.userData.peca = g.pecas.ves; g.pick.push(g.ves);
      g.rnaM = V3.fis(g, C.rna, { p: { roughness: .4, clearcoat: .5 }, rimK: .3 }); g.dnaM = V3.fis(g, C.dna, { p: { roughness: .4, clearcoat: .5 }, rimK: .3 });
      g.gen = V3.tubo(g, 70, 6, g.rnaM, null, 'rna'); g.genD = V3.tubo(g, 70, 6, g.dnaM, null, 'dna');
      g.cop = [0, 1, 2, 3].map(i => V3.tubo(g, 50, 6, i % 2 ? g.rnaM : g.rnaM, null, 'rna'));
      g.copD = [0, 1, 2, 3].map(() => V3.tubo(g, 50, 6, g.dnaM, null, 'dna'));
      g.mI = V3.modelo(g, 'ico', 2); g.dEsp = V3.fibo(14, .4);
      g.q0 = new T.Quaternion(); g.q1 = new T.Quaternion();
    },
    animar(g, P) {
      const S = P.S, v = S.v || 0, W = g.W, t = P.t, adeno = S.vir === 'adeno', endo = adeno || !!S.endo, e = r1Etapa(v); g.v0 = v; g.e = e; g.adeno = adeno;
      const kB = sst(0, 2.2, v), kE = sst(2.5, 4.8, v), kU = sst(5, 6.8, v), kC = sg(7, 10.5, v), kM = sg(10.5, 12.5, v), kS = sg(12.5, 16, v);
      const top = sup([0, 1, 0]), rot = RED() ? 0 : t * .25; V3.setQ(g, g.q0, .2, rot, .1);
      const rv = .5, cB = add(top, [0, .25 + rv + .12 + (1 - kB) * 2.4, 0]);
      // receptores na membrana
      RECS.forEach((d, i) => { const a = sup(d), b = sup(d, .26); V3.bastao(g, W.rod, a, b, .035, C.receptor, .95, g.pecas.rec); V3.bola(g, b, .07, C.receptor, 1.05, g.pecas.rec); if (i === 2) ach(g, 'rec', b); });
      ach(g, 'mem', sup(sph(.62, 4.2)));
      ach(g, 'nuc', add(NC, [.2, RN * .9, -.2]));
      // posição do vírus que entra
      let cV = cB, dentroV = false;
      if (kE > 0) { const fim = endo ? add(top, [-.2, -1.35, -.3]) : add(top, [-.1, -.95, -.25]); cV = lerp3(cB, fim, kE); dentroV = kE > .5; }
      const cVu = lerp3(cV, CY, sst(0, 1, kU) * .5);
      // vesícula de endocitose
      const kv = endo ? sst(.15, .6, kE) * (1 - sst(.85, 1, kE) * (adeno ? 1 : 1)) * (1 - kU) : 0;
      g.ves.visible = kv > .02; if (g.ves.visible) { g.ves.position.set(cV[0], cV[1], cV[2]); g.ves.scale.setScalar(.82 * kv + .3); ach(g, 'ves', add(cV, [.75, .3, 0])); }
      // vírus: envelope (some na fusão), capsídeo (se desmonta) e ácido nucleico
      const envK = adeno ? 0 : endo ? 1 - sst(.82, 1, kE) : 1 - sst(.2, .8, kE);
      if (kU < 1) {
        if (!adeno && envK > .02) V3.envelope(g, W, g.dEsp, cV, g.q0, rv * (endo ? 1 : mix(1, 1.25, sst(.2, .8, kE))), { env: envK, esp: envK, esc: 1, tipo: () => 'bola', info: g.pecas.virus, infoEsp: () => g.pecas.esp });
        V3.capsideo(g, W, g.mI, cVu, g.q0, rv * .62, { sep: kU, r: .2, info: g.pecas.cap, seed: 4, casca: '#4E5874' });
        if (adeno) g.mI.pts.forEach((pt, i) => { if (!g.mI.pen[i] || kU > .2) return; const d = V3.giraV(g, g.q0, nrm(pt)), a = add(cVu, mul(d, rv * .6)), b = add(cVu, mul(d, rv * .98)); V3.bastao(g, W.rod, a, b, .02, '#C9D1E2', 1, g.pecas.adeno); V3.bola(g, b, .045, '#E6EBF5', 1, g.pecas.adeno); });
        if (kE < .5) ach(g, adeno ? 'adeno' : 'virus', add(cV, [0, rv + .35, 0])); else if (kU < .5) ach(g, 'cap', add(cVu, [.45, .2, 0]));
        if (!adeno && kB > .9 && kE < .3) ach(g, 'rec', add(top, [0, .2, 0]));
      }
      // ácido nucleico liberado e cópias
      const gTub = adeno ? g.genD : g.gen, oTub = adeno ? g.gen : g.genD; oTub.mesh.visible = false;
      if (kU > .05) {
        const alvo = adeno ? lerp3(CY, NC, sst(0, .6, kC)) : CY, cc = lerp3(cVu, alvo, sst(0, 1, kU) * (adeno ? 1 : 1)), rr = mix(.16, .42, kU);
        gTub.set(V3.novelo(70, cc, rr, 1.1, 1), .026); gTub.mesh.visible = kS < .3 || !adeno; ach(g, adeno ? 'dna' : 'rna', add(cc, [0, rr + .1, 0]));
      } else gTub.mesh.visible = false;
      const copT = adeno ? g.copD : g.cop; (adeno ? g.cop : g.copD).forEach(tb => { tb.mesh.visible = false; });
      copT.forEach((tb, i) => {
        const k = cl(kC * 5 - i - .5, 0, 1), vai = adeno ? sst(i / 6, i / 6 + .5, kM) : sst(i / 6, i / 6 + .5, kM); if (k <= .02 || vai >= .98 || i > 2) { tb.mesh.visible = false; return; }
        const base = adeno ? add(NC, [(i - 1) * .55, -.25 + (i % 2) * .4, .1]) : add(CY, [(i - 1) * .62, (i % 2 ? .45 : -.45), .15]);
        const alvo = adeno ? add(NC, [(i - 1) * .6, .45, .15]) : add(sup(BUD[i], -.75), [0, 0, 0]);
        tb.mesh.visible = true; tb.set(V3.novelo(50, lerp3(base, alvo, vai), .2 * (1 - .6 * vai), i * 2.1 + 1, k), .022);
      });
      // ribossomos fazendo proteínas do vírus
      if (kC > 0 && kS < .5) for (let i = 0; i < 22; i++) { const a = i / 22 * TAU * 2, p = add(adeno ? add(CY, [.2, -.3, 0]) : CY, [Math.cos(a) * (.55 + .25 * hash(i, 1)), Math.sin(a * .5) * .6, -.2 - .2 * hash(i, 2)]); V3.bola(g, p, .07 * sst(0, .3, kC), C.ribo, .95, g.pecas.ribo); if (i === 4) ach(g, 'ribo', p); }
      // espículas já na membrana (vírus com envelope)
      if (!adeno && kC > .3) BUD.forEach((d, j) => { for (let k = 0; k < 7; k++) { const a = k / 7 * TAU, u = nrm(V.cross(d, [0, 0, 1])), w = V.cross(d, u), dd = nrm(add(d, add(mul(u, Math.cos(a) * .07), mul(w, Math.sin(a) * .07)))); const kb = sst(j * .15, j * .15 + .6, kS); if (kb > .6) continue; V3.espicula(g, W, sup(dd), dd, .5 * .3 * sst(.3, .8, kC), .5, 'bola', K.espicula, g.pecas.esp); } });
      // montagem: capsídeos novos sob as espículas (ou no núcleo) e saída
      for (let j = 0; j < (adeno ? 4 : 3); j++) {
        const km = cl(kM * 1.5 - j * .2, 0, 1); if (km <= .01) continue;
        let p0 = adeno ? add(NC, [(j - 1.5) * .5, .3 * (j % 2 ? -1 : 1), .25]) : sup(BUD[j], -.62), p = p0, envJ = 0;
        if (kS > 0) {
          if (adeno) { const fl = sst(.25, 1, kS), d = nrm(sub(p0, CC)); p = add(p0, mul(add(d, [((j % 2) - .5) * .6, .3, .3]), fl * 4.2)); }
          else { const kb = sst(j * .15, j * .15 + .6, kS); p = add(sup(BUD[j], -.62), mul(BUD[j], kb * 1.55)); envJ = sst(.25, .7, kb); if (kb > .15 && kb < .85) { const a = sup(BUD[j], .02), b2 = add(p, mul(BUD[j], -.35)); V3.bastao(g, W.rod, a, b2, mix(.32, .05, sst(.4, .85, kb)), C.envelope, 1, g.pecas.mem); } }
        }
        V3.setQ(g, g.q1, j, rot + j * 1.7, 0);
        V3.capsideo(g, W, g.mI, p, g.q1, rv * .62, { k: km, r: .2, info: g.pecas.novos, seed: 20 + j, casca: '#4E5874' });
        if (envJ > .02) V3.envelope(g, W, g.dEsp, p, g.q1, rv, { env: envJ, esp: envJ, tipo: () => 'bola', info: g.pecas.novos, infoEsp: () => g.pecas.esp });
        if (j === 1 && km > .5) ach(g, 'novos', add(p, [0, .7, 0]));
      }
      // adenovírus: a célula se rompe
      const lis = adeno ? sst(.1, .45, kS) : 0;
      g.cel.visible = lis < .5; g.cel.scale.setScalar(RC * (1 + lis * .03));
      if (adeno && kS > .1) for (let i = 0; i < 50; i++) { const d = sph(.85 * hash(i, 31), 3.1 + 3.2 * hash(i, 32)), fl = sst(.4, 1, kS), sz = .32 * (1 - fl * .6), p = add(sup(d), mul(d, fl * 2.2)); V3.setQ(g, g.q1, fl * 3 * hash(i, 33), fl * 2, hash(i, 34) * TAU); if (lis > .45) V3.put(g, W.knob, p, g.q1, sz, sz * .2, sz * .8, C.membrana, .9, g.pecas.mem); }
      V3.fimKit(W);
    },
    sobre(g, S) {
      const e = g.e || 0, n = e === 1 ? (g.adeno || S.endo ? 'Entrada (endocitose)' : 'Entrada (fusão)') : e === 5 ? (g.adeno ? 'Lise da célula' : 'Brotamento') : R1N[e];
      const x = NAR ? 10 : 18, y = NAR ? 50 : 74, s1 = `${e + 1} de 6: ${n}`, w = tw(s1, 14, 700) + 24;
      rr(x, y, w, 28, 8, 'rgba(19,26,43,.86)', 'rgba(255,179,71,.55)', 1); tx(s1, x + 12, y + 14, { s: 14, w: 700, a: 'left', c: C.txt, bg: false }); V3.reserva(g, [x, y, w, 28]);
    },
    camera(g, P) { const sai = sst(12.5, 15, g.v0 || 0) * (g.adeno ? 1 : .5); return cam(g, P, 3.1 + sai * 1.2, 2.85 + sai * .8, { al: [0, -.95 + sai * .4, 0], th: .38, fi: .32, k: 1.02 }); }
  });

  // =====================================================================================
  // RETROVÍRUS: modo "HIV em 3D"
  // =====================================================================================
  if (modo3D('replicacao/retrovirus', 'hiv3d', 'HIV em 3D', 'ciclo', 'HIV, a partícula por dentro')) {
    const PH = {
      env: { nome: 'Envelope', frase: 'Lipídios da membrana do linfócito onde o HIV foi montado.', cor: C.envelope },
      gp: { nome: 'gp120 sobre a gp41', frase: 'Espícula do HIV: a gp120 se encaixa na proteína CD4 do linfócito T auxiliar; a gp41 ajuda na fusão com a membrana.', cor: C.espicula },
      mat: { nome: 'Matriz', frase: 'Camada de proteína logo abaixo do envelope.', cor: '#9AA6C0' },
      cap: { nome: 'Capsídeo em cone', frase: 'Capsídeo do HIV, em forma de cone. Guarda as duas cópias do RNA e as enzimas.', cor: C.capsideo },
      rna: { nome: 'RNA do HIV (duas cópias)', frase: 'O material genético do retrovírus. Na célula, vira DNA pela transcriptase reversa.', cor: C.rna },
      tr: { nome: 'Transcriptase reversa', frase: 'Enzima que lê RNA e monta DNA: o caminho ao contrário do dogma central. É alvo de remédios antirretrovirais.', cor: K.enzima },
      int: { nome: 'Integrase', frase: 'Costura o DNA do vírus no cromossomo do linfócito. Integrado, esse DNA passa a se chamar provírus.', cor: K.integrase },
      pro: { nome: 'Protease', frase: 'Corta as proteínas longas do vírus em pedaços que funcionam. Também é alvo de remédios.', cor: K.protease },
      dna: { nome: 'DNA feito pela transcriptase reversa', frase: 'Cópia em DNA do RNA do vírus. Depois entra no núcleo e é integrada ao cromossomo.', cor: C.dna }
    };
    const DG = V3.fibo(12, .9);
    V3.cena('replicacao/retrovirus', {
      fit: 8, raio: 4, bolas: 220, pecas: PH,
      so2D: S => S.modo !== 'hiv3d',
      rotulos: [{ pc: 'gp', t: 'gp120', pr: 1 }, { pc: 'env', t: 'envelope', pr: 2 }, { pc: 'cap', t: 'capsídeo', pr: 3 }, { pc: 'rna', t: 'RNA', pr: 4 }, { pc: 'tr', t: 'transcriptase reversa', pr: 5 }, { pc: 'dna', t: 'DNA', pr: 6 }, { pc: 'int', t: 'integrase', pr: 7 }, { pc: 'pro', t: 'protease', pr: 8 }, { pc: 'mat', t: 'matriz', pr: 9 }],
      montar(g) {
        const T = g.T;
        g.gv = new T.Group(); g.raiz.add(g.gv); g.pl = V3.corte(g, g.gv, [0, 0, -1], 0);
        g.W = V3.kitV(g, { planos: [g.pl], knobs: 900, rods: 200 });
        g.rnaM = V3.fis(g, C.rna, { p: { roughness: .4, clearcoat: .5 }, rimK: .3 }); g.dnaM = V3.fis(g, C.dna, { p: { roughness: .4, clearcoat: .5 }, rimK: .3 });
        g.r1 = V3.tubo(g, 60, 6, g.rnaM, null, 'rna'); g.r2 = V3.tubo(g, 60, 6, g.rnaM, null, 'rna');
        g.zR = V3.tubo(g, 90, 8, g.rnaM, null, 'rna'); g.zD = V3.tubo(g, 90, 8, g.dnaM, null, 'dna');
        g.mM = V3.modelo(g, 'esf', g.q.cel ? 110 : 150); g.mC = V3.modelo(g, 'cone', g.q.cel ? 9 : 12);
        g.q0 = new T.Quaternion(); g.qc = new T.Quaternion(); g.qq = new T.Quaternion();
      },
      animar(g, P) {
        const t = P.t, W = g.W, lar = V3.deitado(g), v = g.v, c = lar ? [-1.5, 0, 0] : [0, 1.35, 0]; g.lar = lar;
        g.gv.position.set(c[0], c[1], c[2]);
        const cp = v.cam.position; g.pl.reg.n = nrm(sub(c, [cp.x, cp.y, cp.z])); g.pl.reg.c = 0;
        const rot = RED() ? .4 : t * .15; V3.setQ(g, g.q0, 0, rot, 0); V3.setQ(g, g.qc, .3, rot, .55);
        const tc = nrm(sub([cp.x, cp.y, cp.z], c));
        V3.envelope(g, W, DG, c, g.q0, 1, { tipo: () => 'gp', info: g.pecas.env, infoEsp: () => g.pecas.gp, pula: (i, d) => dot(d, tc) > .2 });
        V3.capsideo(g, W, g.mM, c, g.q0, .9, { r: .12, cor: '#9AA6C0', info: g.pecas.mat, casca: false, seed: 9 });
        V3.capsideo(g, W, g.mC, c, g.qc, .55, { r: .2, info: g.pecas.cap, casca: false, seed: 3 });
        // dois RNAs dentro do cone e as enzimas
        [g.r1, g.r2].forEach((tb, k) => { const P0 = []; for (let i = 0; i < 60; i++) { const u = i / 59, y = -.45 + u * .85, r = mix(.2, .08, u) * .7; P0.push(V3.aplica(g, c, g.qc, 1, [Math.cos(u * 22 + k * 3) * r, y, Math.sin(u * 22 + k * 3) * r])); } tb.set(P0, .022); });
        const enz = [['tr', K.enzima, [.08, -.2, .05]], ['tr', K.enzima, [-.1, .05, -.06]], ['int', K.integrase, [.05, .2, -.04]], ['int', K.integrase, [-.06, -.35, .02]], ['pro', K.protease, [.55, .45, -.3]], ['pro', K.protease, [-.6, -.3, -.45]]];
        enz.forEach(([id, cor, l], i) => { const p = V3.aplica(g, c, i < 4 ? g.qc : g.q0, 1, l); V3.bola(g, p, .075, cor, 1, g.pecas[id]); V3.bola(g, add(p, [.05, .04, .02]), .055, cor, .9, g.pecas[id]); if (i === 0 || i === 2 || i === 4) ach(g, id, p); });
        ach(g, 'gp', add(c, mul(V3.giraV(g, g.q0, DG[2]), 1.3))); ach(g, 'env', add(c, mul(nrm([-.6, -.6, -.4]), 1.02))); ach(g, 'cap', V3.aplica(g, c, g.qc, 1, [.3, .1, 0])); ach(g, 'rna', V3.aplica(g, c, g.qc, 1, [0, .35, 0])); ach(g, 'mat', add(c, mul(nrm([.5, .75, -.3]), .9)));
        // ao lado, ampliada: a transcriptase reversa anda pelo RNA e deixa DNA atrás
        const z0 = lar ? [2.2, 0, 0] : [0, -1.75, 0], Lz = lar ? 2.6 : 2.4, ph = RED() ? .62 : (t % 9) / 9, kz = sst(.05, .8, ph), sai = sst(.88, 1, ph);
        const PR = [], PD = [], nP = 90, pos = u => add(z0, [(u - .5) * Lz, Math.sin(u * 9) * .12, 0]);
        for (let i = 0; i < nP; i++) { const u = i / (nP - 1), p = pos(u); PR.push(add(p, [0, .14, 0])); if (u <= kz) PD.push(add(p, [0, -.14 - sai * .6, 0])); }
        g.zR.set(PR, .045); g.zD.set(PD.length > 1 ? PD : [PR[0], PR[0]], .045); g.zD.mesh.visible = PD.length > 1;
        for (let i = 0; i < nP; i += 4) { const u = i / (nP - 1); if (u > kz) break; const p = pos(u); V3.bastao(g, W.rod, add(p, [0, .12, 0]), add(p, [0, -.12 - sai * .6, 0]), .016, '#E9E2F7', .8, g.pecas.dna); }
        const pt = pos(kz); V3.bola(g, add(pt, [0, 0, .05]), .2, K.enzima, 1, g.pecas.tr); V3.bola(g, add(pt, [-.15, .12, -.04]), .14, K.enzima, .9, g.pecas.tr); V3.bola(g, add(pt, [.14, -.1, .02]), .13, K.enzima, .85, g.pecas.tr);
        ach(g, 'dna', pos(Math.max(.05, kz * .5)).map((x, i) => i === 1 ? x - .32 : x));
        if (!lar || g.v.w > 520) { V3.texto(g, add(z0, [-Lz / 2, .55, 0]), 'RNA do vírus', { s: 12, c: C.rna, a: 'left' }); }
        V3.fimKit(W);
        g.ph = ph;
      },
      legenda: (g, S) => (g && g.ph > .85 ? 'O DNA pronto se solta: depois ele entra no núcleo e a <b>integrase</b> o costura no cromossomo do linfócito.' : 'Por dentro do HIV: o capsídeo em cone leva <b>dois RNAs</b> e as enzimas. A <b>transcriptase reversa</b> lê o RNA e monta DNA, o caminho ao contrário.'),
      camera(g, P) { return g.lar ? cam(g, P, 3.9, 1.7, { th: .15, fi: .12, k: 1.02 }) : cam(g, P, 1.8, 3.3, { th: .15, fi: .1, k: 1.02 }); }
    });
  }
})();
