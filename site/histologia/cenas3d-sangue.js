/* LAB Histologia: cenas 3D do sangue (Martin). Tubo de ensaio que se separa em plasma, camada branca e hemácias, ao lado
   de um vaso aberto com hemácias, leucócitos e plaquetas que se podem tocar; coagulação num vaso em corte, com a lesão,
   a contração, o tampão de plaquetas, a cascata e a rede de fibrina. Usa o kit histo3d.js; a cena 2D antiga é o plano B. */
'use strict';
(function () {
  const H3 = window.HIS3D; if (!H3) return;
  const { V, K } = H3, { cl, mix, seg, sst, TAU, hash, add, fr, lerp3 } = V;
  const cam = (g, P, hx, hy, o = {}) => H3.viva({ th: o.th == null ? .3 : o.th, fi: o.fi == null ? .2 : o.fi, d: H3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .6 : o.viva);
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const RED = () => H3.REDUZ();

  // =====================================================================================
  // PLASMA E CÉLULAS DO SANGUE
  // =====================================================================================
  const PE = {
    hem: { nome: 'Hemácia', frase: 'Disco sem núcleo, cheio de hemoglobina: transporta O₂ (e parte do CO₂). Cerca de 4,5 a 5,5 milhões por mm³; vive cerca de 120 dias.', cor: K.hemacia },
    neutro: { nome: 'Neutrófilo', frase: 'Núcleo em gomos; fagocita bactérias (forma o pus). De 55 a 65% dos leucócitos.', cor: '#E2D3EE' },
    linfo: { nome: 'Linfócito', frase: 'Núcleo grande e redondo; imunidade específica: B (anticorpos, via plasmócitos) e T. De 25 a 35% dos leucócitos.', cor: '#B9A8F0' },
    mono: { nome: 'Monócito', frase: 'O maior leucócito, com núcleo em forma de rim; nos tecidos vira macrófago. De 3 a 8% dos leucócitos.', cor: '#C9B8E8' },
    eosi: { nome: 'Eosinófilo', frase: 'Grânulos alaranjados; atua contra parasitas (vermes) e nas alergias. De 2 a 4% dos leucócitos.', cor: '#F2A36B' },
    baso: { nome: 'Basófilo', frase: 'Grânulos escuros que quase escondem o núcleo; libera histamina e heparina. De 0,5 a 1% dos leucócitos.', cor: '#9C8AD0' },
    plaq: { nome: 'Plaqueta', frase: 'Fragmento de megacariócito da medula óssea; atua na coagulação. De 150 mil a 400 mil por mm³.', cor: K.plaq },
    plasma: { nome: 'Plasma', frase: 'A matriz líquida do sangue: cerca de 90% de água, com proteínas (albumina, anticorpos, fibrinogênio), sais, glicose e hormônios.', cor: '#F2D27A' },
    tubo: { nome: 'Tubo centrifugado', frase: 'Girando, as hemácias, mais densas, descem; o plasma fica em cima e os leucócitos e plaquetas formam uma faixa branca fina no meio.', cor: '#DDE6F5' }
  };
  const ORDEM = ['hem', 'neutro', 'linfo', 'mono', 'eosi', 'baso', 'plaq'];
  const LEU = [['neutro', .3, 0], ['neutro', .3, .5], ['linfo', .2, .25], ['mono', .34, .72], ['eosi', .28, .9], ['baso', .27, .12]];
  const ctlS1 = SC['sangue/elementos'] && SC['sangue/elementos'].ctl;
  // "Próxima célula" também passa o foco pelas células do vaso 3D
  if (SC['sangue/elementos'] && SC['sangue/elementos'].extra) { const ex = SC['sangue/elementos'].extra[0], on0 = ex.on; ex.on = S => { on0(S); S.prox = (S.prox | 0) + 1; S.proxT = performance.now(); }; }
  H3.cena('sangue/elementos', {
    fit: 14, raio: 6, bolas: 120, sombra: false, initAntigo: false,
    pecas: PE,
    rotulos: [{ pc: 'plasma', t: 'plasma', pr: 5, se: g => g.lar }, { pc: 'hem', t: 'hemácia', pr: 1 }, { pc: 'neutro', t: 'neutrófilo', pr: 2 }, { pc: 'linfo', t: 'linfócito', pr: 3, se: g => g.lar }, { pc: 'plaq', t: 'plaquetas', pr: 4, se: g => g.lar }, { pc: 'mono', t: 'monócito', pr: 6, se: g => g.lar }, { pc: 'eosi', t: 'eosinófilo', pr: 7, se: g => g.lar }, { pc: 'baso', t: 'basófilo', pr: 8, se: g => g.lar }],
    montar(g) {
      const T = g.T, L = 5.6; g.L = L; g.R = .95;
      g.pl = H3.corte(g, g.raiz, [0, 0, -1], 0);
      // vaso: parede em volta (anel por torno), aberta na frente pelo plano de corte
      g.vg = new T.Group(); g.raiz.add(g.vg);
      const R = g.R, th = .09, n = 4, perfil = [];
      for (let i = 0; i <= n; i++) perfil.push([R - th, -L / 2 + L * i / n]);
      for (let i = n; i >= 0; i--) perfil.push([R, -L / 2 + L * i / n]);
      perfil.push([R - th, -L / 2]);
      g.wall = H3.solido(g, H3.torno(g, perfil.reverse(), g.q.cel ? 40 : 64, 'vasoE'), '#E58FA5', [g.pl], { corte: '#C25A72', pai: g.vg, m: { p: { roughness: .5, sheen: .6, sheenColor: new T.Color('#FFE0E8') }, rim: '#FFC4D2' } });
      g.endo = H3.inst(g, H3.esfera(g, 12), H3.fis(g, K.nucleo, { p: { roughness: .4 }, planos: [g.pl] }), 40, g.vg);
      g.plas = H3.peca(g, H3.cilindro(g, g.q.cel ? 28 : 40), H3.filme(g, '#F2D27A', { cor2: '#FFF6D8', dentro: '#4A1A2A', base: .04, fr: .22, esc: 1.4, planos: [g.pl] }), 'plasma', g.vg); g.plas.renderOrder = 6;
      g.H = H3.hemacias(g, 70, 'hem');
      g.leu = H3.inst(g, H3.celGeo(g), H3.fis(g, '#FFFFFF', { p: { transparent: true, opacity: .55, depthWrite: false, roughness: .3, clearcoat: .7, sheen: .6 }, rimK: .45 }), 6, null, null); g.pick.push(g.leu.m); g.leu.m.renderOrder = 5;
      g.nuc = H3.inst(g, H3.lumpy(g, 'nucL', 41, 3, 3, .12, .5, .9), H3.fis(g, '#6A3FA8', { p: { roughness: .45, clearcoat: .5 } }), 30, null, null);
      g.gra = H3.inst(g, H3.esfera(g, 8), H3.fis(g, '#F28A4A', { p: { roughness: .35, clearcoat: .6 } }), 40, null, null);
      g.pq = H3.inst(g, H3.lumpy(g, 'plq', 23, 2, 6, .25, .3, .7), H3.fis(g, '#C9A6EE', { p: { roughness: .45, sheen: .5 } }), 30, null, g.pecas.plaq); g.pick.push(g.pq.m);
      // tubo de ensaio com as três camadas
      g.tg = new T.Group(); g.raiz.add(g.tg);
      g.vidM = H3.filme(g, '#DDE6F5', { cor2: '#FFFFFF', dentro: '#1A2030', base: .03, fr: .6, esc: 1.6 }); g.vid = {};
      const camada = (cor, pc) => { const m = H3.fis(g, cor, { p: { roughness: .25, clearcoat: .8, clearcoatRoughness: .15, transmission: 0 } }); const ob = H3.peca(g, H3.cilindro(g, 28), m, pc, g.tg); ob.userData.mat = m; return ob; };
      g.cR = camada('#9A1F2C', 'hem'); g.cB = camada('#F1EEE8', 'tubo'); g.cP = camada('#E9C35A', 'plasma');
      g.cTop = H3.peca(g, H3.esfera(g, 24), g.cR.userData.mat, 'hem', g.tg);
      g.wk = 0;
    },
    init(S) { if (S.v == null) S.v = 0; },
    animar(g, P) {
      const S = P.S, t = P.t, dt = g.dt || .016, lar = H3.deitado(g), L = g.L, R = g.R;
      const f = ctlS1 ? H3.umaVez(S, t, ctlS1, 5) / 100 : cl(S.v / 100, 0, 1), s = sst(0, 1, f);
      S.wk = cl((S.wk || 0) + (S.alt ? 1 : -2) * dt, 0, 6);
      const hct = Math.round(45 + 5 * sst(0, 1, S.wk / 6)); g.hct = hct; g.f = f;
      // disposição: deitado, o tubo à esquerda e o vaso na horizontal; em pé, os dois na vertical
      const vc = lar ? [1.5, 0, 0] : [0, -1.35, 0], tc = lar ? [-3.3, 0, 0] : [-1.25, 1.35, 0];
      g.lar = lar; g.vc = vc; g.tc = tc;
      g.vg.position.set(vc[0], vc[1], vc[2]); g.vg.rotation.set(0, 0, -Math.PI / 2); g.vg.scale.setScalar(lar ? 1 : .8);
      const k = lar ? 1 : .8, Lk = L * k, Rk = R * k;
      // eixo do vaso: u ao longo, a e b na seção
      const mapa = (u, y, z) => [vc[0] + u, vc[1] + y, z];
      g.plas.scale.set(Rk / k - .1, L - .02, Rk / k - .1); g.plas.position.set(0, 0, 0);
      // núcleos do endotélio, achatados, na metade de trás da parede
      for (let i = 0; i < 18; i++) { const u = (i / 18 - .5) * L * .95 + hash(i, 1) * .2, a = Math.PI + .25 + hash(i, 2) * (Math.PI - .5); H3.put(g, g.endo, [Math.cos(a) * (R - .1), u, Math.sin(a) * (R - .1)], null, .03, .12, .07, K.nucleo, 1); }
      H3.fim(g.endo);
      // hemácias correndo (mais hemácias com hematócrito alto)
      const nH = Math.round(44 * hct / 45), vel = RED() ? 0 : .045;
      for (let i = 0; i < nH; i++) {
        const u = (fr(t * vel * (.8 + .4 * hash(i, 1)) + hash(i, 2)) - .5) * Lk, a = Math.PI * (.95 + 1.1 * hash(i, 3)), r = Rk * .78 * Math.sqrt(hash(i, 4));
        H3.put(g, g.H, mapa(u, Math.cos(a) * r, Math.sin(a) * r), H3.giro(g, i, RED() ? 0 : t), .17 * k, .17 * k, .17 * k, K.hemacia, .92 + .14 * hash(i, 7), g.pecas.hem);
      }
      H3.fim(g.H);
      // leucócitos rolando devagar junto da parede, cada um com o seu núcleo
      const pos = {};
      LEU.forEach(([id, r0, ph], i) => {
        const u = (fr(ph + (RED() ? 0 : t * .012)) - .5) * Lk * .92, a = Math.PI * (1.25 + .5 * hash(i, 5)), rr = Rk * .55, r = r0 * k;
        const p = mapa(u, Math.cos(a) * rr, Math.sin(a) * rr * .6 - .1); pos[id] = pos[id] || p;
        H3.put(g, g.leu, p, H3.giro(g, i + 40, RED() ? 0 : t * .3), r, r * .96, r, PE[id].cor, 1, g.pecas[id]);
        const nk = (o, s, hx) => H3.put(g, g.nuc, add(p, o.map(x => x * r)), null, s[0] * r, s[1] * r, s[2] * r, hx || '#6A3FA8', 1, g.pecas[id]);
        if (id === 'neutro') { nk([-.35, .1, 0], [.3, .26, .26]); nk([0, -.15, .08], [.3, .26, .26]); nk([.35, .12, 0], [.28, .25, .25]); nk([.05, .32, -.05], [.22, .2, .2]); }
        else if (id === 'linfo') nk([0, 0, .05], [.8, .78, .78], '#4E2E8E');
        else if (id === 'mono') { nk([-.1, 0, .05], [.55, .4, .45], '#7350B0'); nk([.28, .18, 0], [.3, .28, .3], '#7350B0'); }
        else if (id === 'eosi') { nk([-.3, 0, .05], [.32, .3, .3], '#6A3FA8'); nk([.3, 0, .05], [.32, .3, .3], '#6A3FA8'); for (let j = 0; j < 14; j++) { const u2 = j * 2.4, y2 = 1 - (j + .5) / 7; H3.put(g, g.gra, add(p, [Math.cos(u2) * .7 * r * Math.sqrt(Math.max(0, 1 - y2 * y2 * .25)), y2 * .5 * r, Math.sin(u2) * .7 * r]), null, .1 * r, null, null, '#F28A4A', 1, g.pecas.eosi); } }
        else { nk([0, 0, .05], [.5, .45, .45], '#3A2470'); for (let j = 0; j < 16; j++) { const u2 = j * 2.4, y2 = 1 - (j + .5) / 8; H3.put(g, g.gra, add(p, [Math.cos(u2) * .6 * r, y2 * .5 * r, Math.sin(u2) * .7 * r]), null, .12 * r, null, null, '#2E1A5A', 1, g.pecas.baso); } }
      });
      H3.fim(g.leu); H3.fim(g.nuc); H3.fim(g.gra);
      // plaquetas: pequenas e irregulares
      for (let i = 0; i < 22; i++) {
        const u = (fr(t * vel * .9 + hash(i, 11)) - .5) * Lk, a = Math.PI * (.95 + 1.1 * hash(i, 12)), r = Rk * .8 * Math.sqrt(hash(i, 13)), p = mapa(u, Math.cos(a) * r, Math.sin(a) * r);
        H3.put(g, g.pq, p, H3.giro(g, i + 80, RED() ? 0 : t), .07 * k, .035 * k, .06 * k, '#C9A6EE', 1, g.pecas.plaq); if (i === 3) pos.plaq = p;
      }
      H3.fim(g.pq);
      // tubo: as hemácias descem; o plasma fica em cima; a faixa branca aparece no fim
      const kt = lar ? 1 : .62, Ht = 2.2 * kt, rt = .25 * kt, y0 = -Ht / 2;
      g.tg.position.set(tc[0], tc[1], tc[2]); g.tg.rotation.set(.12, 0, RED() ? 0 : Math.sin(t * .4) * .02);
      const sv = rt + .035, ky = lar ? 'a' : 'b';
      if (!g.vid[ky]) { const pf = []; for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i / 10 * Math.PI / 2; pf.push([Math.cos(a), Math.sin(a)]); } pf.push([1, (Ht + .4) / sv], [1.12, (Ht + .4) / sv + .04]); const ob = H3.peca(g, H3.torno(g, pf, 28, 'tuboE' + ky), g.vidM, 'tubo', g.tg); ob.renderOrder = 8; g.vid[ky] = ob; }
      for (const kk in g.vid) g.vid[kk].visible = kk === ky; g.vid[ky].scale.setScalar(sv); g.vid[ky].position.set(0, y0, 0);
      const hR = mix(Ht, Ht * hct / 100, s), hB = .05 * kt * sst(.55, .9, s), hP = Math.max(.001, Ht - hR - hB);
      g.cR.scale.set(rt, hR, rt); g.cR.position.set(0, y0 + hR / 2, 0);
      g.cTop.scale.set(rt, rt, rt); g.cTop.position.set(0, y0, 0);
      g.cB.visible = hB > .004; g.cB.scale.set(rt * .99, Math.max(.001, hB), rt * .99); g.cB.position.set(0, y0 + hR + hB / 2, 0);
      g.cP.visible = s > .02; g.cP.scale.set(rt * .99, hP, rt * .99); g.cP.position.set(0, y0 + hR + hB + hP / 2, 0);
      g.cP.userData.mat.color.set('#9A1F2C').lerp(g._c.set('#E9C35A'), sst(.05, .7, s));
      const tw = p => H3.mundo(g, g.tg, p), xL = rt + .18;
      g.tub = { top: tw([0, Ht / 2, 0]), pl: tw([xL, y0 + hR + hB + hP / 2, 0]), bf: tw([xL, y0 + hR + hB / 2, 0]), rd: tw([xL, y0 + hR / 2, 0]), x: tw([xL, 0, 0]), bot: tw([0, y0 - .2, 0]), s };
      // foco: "Próxima célula" ou toque numa célula
      const fo = S.prox ? ORDEM[(S.prox - 1) % ORDEM.length] : null; g.foco = g.sel && PE[g.sel] ? g.sel : fo;
      g.fp = g.foco === 'hem' ? mapa(.2 * Lk, -.15, -.15) : g.foco === 'plasma' ? mapa(-.35 * Lk, .3, -.4) : pos[g.foco] || null;
      // âncoras dos rótulos
      ach(g, 'hem', mapa(.18 * Lk, Rk * .35, -.2)); ach(g, 'plasma', mapa(-.42 * Lk, Rk * .55, -.5));
      ['neutro', 'linfo', 'mono', 'eosi', 'baso'].forEach(id => { if (pos[id]) ach(g, id, pos[id]); });
      if (pos.plaq) ach(g, 'plaq', pos.plaq);
    },
    sobre(g, S) {
      const T = g.tub; if (!T) return; const s = T.s, al = seg(s, .3, .7), q = p => H3.tela(g, p);
      const lb = (p, a, b, o) => { const r = q(p); if (r[2] > 1) return; X.save(); X.globalAlpha = o; line(r[0] - 12, r[1], r[0] - 2, r[1], 'rgba(232,237,247,.5)', 1); tx(a, r[0] + 2, r[1] - (b ? 8 : 0), { s: 13, w: 700, a: 'left', c: C.txt }); if (b) tx(b, r[0] + 2, r[1] + 9, { s: 12, a: 'left', c: C.dim }); X.restore(); };
      // rótulos do tubo, sem encostar (no mínimo 36 px entre eles)
      const pP = q(T.pl), pB = q(T.bf), pR = q(T.rd); let yP = pP[1], yW = pB[1], yR = pR[1];
      if (s < .3) { const r = q(T.x); X.save(); X.globalAlpha = 1 - s / .3; tx('sangue', r[0] + 2, r[1] - 8, { s: 13, w: 700, a: 'left', c: C.txt }); tx('misturado', r[0] + 2, r[1] + 9, { s: 12, a: 'left', c: C.dim }); X.restore(); }
      else {
        yW = Math.max(yW, yP + 36); yR = Math.max(yR, yW + 36);
        const lk = (p0, y, a, b, o) => { X.save(); X.globalAlpha = o; line(p0[0] - 10, p0[1], p0[0] + 4, y, 'rgba(232,237,247,.5)', 1); tx(a, p0[0] + 8, y - 8, { s: 13, w: 700, a: 'left', c: C.txt }); tx(b, p0[0] + 8, y + 9, { s: 12, a: 'left', c: C.dim }); X.restore(); };
        lk(pP, yP, 'plasma', `cerca de ${nbr(100 - g.hct)}%`, al);
        if (s > .7) lk(pB, yW, 'leucócitos e', 'plaquetas, menos de 1%', seg(s, .7, .95));
        lk(pR, yR, 'hemácias', `cerca de ${nbr(g.hct)}%`, al);
        H3.reserva(g, [pP[0] - 12, yP - 20, NAR ? 150 : 170, yR - yP + 40]);
      }
      if (S.alt || S.wk > 0) {
        const b = q(T.bot), x = Math.max(NAR ? 12 : 24, b[0] - 40), y = Math.min(b[1] + 16, H - (NAR ? 110 : 100));
        tx(`hematócrito de cerca de ${nbr(g.hct)}%`, x, y, { s: 13, w: 700, a: 'left', c: K.hemacia });
        tx(S.alt ? `semana ${Math.max(1, Math.ceil(S.wk))} na altitude` : 'de volta ao nível do mar', x, y + 17, { s: 12, a: 'left', c: C.dim });
        H3.reserva(g, [x - 4, y - 10, 210, 38]);
      }
      // célula em foco: halo e ficha com a função
      if (g.fp && g.foco) {
        const r = q(g.fp); if (r[2] < 1) { X.save(); X.strokeStyle = 'rgba(255,214,120,.85)'; X.lineWidth = 2; X.setLineDash([4, 4]); X.beginPath(); X.arc(r[0], r[1], NAR ? 22 : 30, 0, TAU); X.stroke(); X.restore(); }
      }
    },
    legenda(g, S) {
      const id = g.foco, p = id && PE[id];
      if (g.f < 1) return 'Mova a faixa <b>Centrifugar</b>: as hemácias, mais densas, descem; o plasma fica em cima.';
      if (S.alt) return 'Na altitude falta O₂: o rim libera mais <b>eritropoetina</b> e a medula faz mais hemácias. O hematócrito sobe em poucas semanas.';
      if (p) return `<b>${p.nome}</b>. ${p.frase}`;
      return 'Toque numa célula do vaso, ou use "Próxima célula", para ver o que ela faz e quantas existem.';
    },
    camera(g, P) {
      const lar = H3.deitado(g), fo = g.fp && g.foco && !g.sel ? g.fp : null;
      if (lar) return cam(g, P, fo ? 3.2 : 4.5, fo ? 1.6 : 1.9, { th: .16, fi: .14, al: fo ? [mix(.3, fo[0], .5), fo[1] * .5, 0] : [.35, -.05, 0], k: 1.04 });
      return cam(g, P, 2.05, fo ? 2.2 : 2.5, { th: .12, fi: .12, al: fo ? [mix(0, fo[0], .4), mix(0, fo[1], .4), 0] : [0, 0, 0], k: 1.04 });
    }
  });

  // =====================================================================================
  // COAGULAÇÃO
  // =====================================================================================
  const MODOS = [{ k: 'vitk', falha: 1, t: 'faltar vitamina K' }, { k: 'hemo', falha: 0, t: 'hemofilia' }, { k: 'aas', falha: -1, t: 'tomar AAS' }, { k: 'ca', falha: 0, t: 'faltar cálcio' }];
  const etapa = v => v < 5 ? 0 : v < 25 ? 1 : v < 50 ? 2 : v < 75 ? 3 : 4;
  const ETAPAS = ['antes da lesão', 'etapa 1: o vaso se contrai', 'etapa 2: tampão de plaquetas', 'etapa 3: a cascata', 'etapa 4: a rede de fibrina'];
  function estado(v, m) {
    const k = m ? m.k : '', contr = sst(0, 1, seg(v, 5, 22));
    let plug = sst(0, 1, seg(v, 25, 45)); if (k === 'aas') plug *= .35;
    let c1 = seg(v, 50, 58), c2 = seg(v, 58, 66), c3 = seg(v, 66, 75);
    if (k === 'ca') { c1 = 0; c2 = 0; c3 = 0; }
    if (k === 'hemo') { c1 = Math.min(c1, .35); c2 = Math.min(c2, .3); c3 = Math.min(c3, .3); }
    if (k === 'vitk') { c2 = Math.min(c2, .25); c3 = 0; }
    let fib = c3 >= 1 ? sst(0, 1, seg(v, 75, 95)) : 0;
    if (k === 'aas') fib = sst(0, 1, seg(v, 82, 100));
    if (k === 'hemo') fib = sst(0, 1, seg(v, 75, 100)) * .25;
    const leak = v < 5 ? 0 : cl((1 - .3 * contr) * (1 - .5 * sst(0, 1, seg(v, 25, 45)) * (k === 'aas' ? .35 : 1)) * (1 - fib), 0, 1);
    return { contr, plug, c: [c1, c2, c3], fib, leak };
  }
  const PCg = {
    parede: { nome: 'Parede do vaso', frase: 'Endotélio por dentro e músculo liso: ao ser lesado, o vaso se contrai e o sangramento diminui.', cor: '#E58FA5' },
    lesao: { nome: 'Lesão', frase: 'Por onde o sangue escapa para o tecido em volta.', cor: '#FF8A8A' },
    plaq: { nome: 'Plaquetas', frase: 'Grudam na parede lesada e umas nas outras: formam o tampão provisório e liberam fatores da coagulação.', cor: K.plaq },
    hem: { nome: 'Hemácias', frase: 'Ficam presas na rede de fibrina e dão a cor vermelha ao coágulo.', cor: K.hemacia },
    fib: { nome: 'Rede de fibrina', frase: 'Fios insolúveis feitos a partir do fibrinogênio pela trombina; prendem hemácias e plaquetas e fecham o vaso.', cor: K.fibrina },
    trom: { nome: 'Trombina', frase: 'Enzima que vem da protrombina (feita no fígado, depende da vitamina K) e transforma fibrinogênio em fibrina.', cor: '#FFB347' },
    conj: { nome: 'Tecido conjuntivo', frase: 'Tecido em volta do vaso, que recebe o sangue que vaza.', cor: K.conj }
  };
  H3.cena('sangue/coagulacao', {
    fit: 14, raio: 6, bolas: 200,
    pecas: PCg,
    rotulos: [{ pc: 'parede', t: 'parede do vaso', pr: 1 }, { pc: 'lesao', t: 'lesão', pr: 2, se: g => g.et <= 1 }, { pc: 'plaq', t: 'tampão de plaquetas', pr: 3, se: g => g.E && g.E.plug > .4 }, { pc: 'fib', t: 'rede de fibrina', pr: 4, se: g => g.E && g.E.fib > .4 }],
    montar(g) {
      const T = g.T, nx = g.q.cel ? 56 : 80, na = g.q.cel ? 14 : 20; g.nx = nx; g.na = na; g.Lx = 8; g.R0 = 1;
      // parede: meia casca (só a metade de trás), com espessura; refeita a cada quadro para a contração
      const nv = (nx + 1) * (na + 1) * 2, geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(new Float32Array(nv * 3), 3).setUsage(T.DynamicDrawUsage)); g.geos.push(geo);
      g.wGeo = geo; g.idx = [false, true].map(les => { const I = []; for (let s = 0; s < 2; s++) { const o = s * (nx + 1) * (na + 1); for (let i = 0; i < nx; i++) for (let j = 0; j < na; j++) { if (les && buraco(g, i + .5, j + .5)) continue; const a = o + i * (na + 1) + j, b = a + na + 1; if (s) I.push(a, b, a + 1, b, b + 1, a + 1); else I.push(a, a + 1, b, b, a + 1, b + 1); } } return I; });
      geo.setIndex(g.idx[0]); g.lesOn = false;
      g.wall = H3.peca(g, geo, H3.fis(g, '#E58FA5', { p: { side: T.DoubleSide, roughness: .5, sheen: .6, sheenColor: new T.Color('#FFE0E8') }, rim: '#FFC4D2', rimK: .3 }), 'parede');
      const mR = H3.fis(g, '#D7768F', { p: { roughness: .45, clearcoat: .5 } });
      g.rimT = H3.tubo(g, nx + 1, 10, mR, g.raiz, 'parede'); g.rimB1 = H3.tubo(g, nx + 1, 10, mR, g.raiz, 'parede'); g.rimB2 = H3.tubo(g, nx + 1, 10, mR, g.raiz, 'parede');
      g.endo = H3.inst(g, H3.esfera(g, 12), H3.fis(g, K.nucleo, { p: { roughness: .4 } }), 60);
      const cj = H3.bloco(g, H3.caixa(g, 9, 1.5, 2.6, 36, 'cgC'), K.conjC, { pc: 'conj', fib: .7, dn: .18, esc: 2.6, fq: 6 }); cj.position.set(0, -1.85, -1.3);
      g.H = H3.hemacias(g, 90, 'hem');
      g.pq = H3.inst(g, H3.lumpy(g, 'plq', 23, 2, 6, .25, .3, .7), H3.fis(g, '#C9A6EE', { p: { roughness: .45, sheen: .5 } }), 70, null, g.pecas.plaq); g.pick.push(g.pq.m);
      const mF = H3.fis(g, '#FFD84A', { p: { roughness: .3, clearcoat: .7, emissive: new T.Color('#5A4300') }, rim: '#FFF0B0', rimK: .5 });
      g.fios = []; for (let i = 0; i < 30; i++) g.fios.push(H3.tubo(g, 14, 5, mF, g.raiz, 'fib'));
    },
    animar(g, P) {
      const S = P.S, t = P.t, v = cl(S.v, 0, 100), m = S.modo == null ? null : MODOS[S.modo], E = estado(v, m), et = etapa(v);
      g.E = E; g.et = et; g.m = m; g.vt = v;
      const nx = g.nx, na = g.na, Lx = g.Lx, R0 = g.R0, th = .12, gw = .55, les = v >= 5;
      const Rx = x => R0 * (1 - .22 * E.contr * Math.exp(-((x / 2.2) ** 2)));
      if (les !== g.lesOn) { g.wGeo.setIndex(g.idx[les ? 1 : 0]); g.lesOn = les; }
      const p = g.wGeo.attributes.position.array; let o = 0;
      for (let s = 0; s < 2; s++) for (let i = 0; i <= nx; i++) { const x = -Lx / 2 + Lx * i / nx, r = Rx(x) - s * th; for (let j = 0; j <= na; j++) { const a = Math.PI + Math.PI * j / na; p[o++] = x; p[o++] = Math.cos(a) * r; p[o++] = Math.sin(a) * r; } }
      g.wGeo.attributes.position.needsUpdate = true; g.wGeo.computeVertexNormals(); g.wGeo.computeBoundingSphere();
      // bordas do corte (em cima e embaixo), a de baixo aberta na lesão
      const top = [], b1 = [], b2 = [];
      for (let i = 0; i <= nx; i++) { const x = -Lx / 2 + Lx * i / nx, r = Rx(x) - th / 2; top.push([x, r, 0]); if (!les || x < -gw) b1.push([x, -r, 0]); if (les && x > gw) b2.push([x, -r, 0]); }
      g.rimT.set(top, th * .55); g.rimB1.set(b1, th * .55); g.rimB2.set(b2, th * .55);
      // núcleos do endotélio por dentro
      for (let i = 0; i < 30; i++) { const x = -Lx / 2 + .3 + (i / 30) * (Lx - .6) + hash(i, 1) * .1, a = Math.PI + .3 + hash(i, 2) * (Math.PI - .6); if (les && Math.abs(x) < gw + .1 && a < Math.PI + 1) continue; const r = Rx(x) - th - .015; H3.put(g, g.endo, [x, Math.cos(a) * r, Math.sin(a) * r], null, .14, .03, .07, K.nucleo, 1); }
      H3.fim(g.endo);
      // sangue correndo: mais devagar quando o vaso se contrai
      const sp = RED() ? 0 : .07 * (1 - .4 * E.contr);
      for (let i = 0; i < 52; i++) {
        const x = (fr(hash(i, 1) + t * sp * (.8 + .4 * hash(i, 2))) - .5) * Lx, r = Rx(x) * .8 * Math.sqrt(hash(i, 3)), a = Math.PI * (.95 + 1.1 * hash(i, 4));
        H3.put(g, g.H, [x, Math.cos(a) * r, Math.min(.15, Math.sin(a) * r)], H3.giro(g, i, RED() ? 0 : t), .2, .2, .2, K.hemacia, .92 + .14 * hash(i, 7), g.pecas.hem);
      }
      // vazamento pela lesão: hemácias descem para o tecido
      const nl = Math.round(22 * E.leak);
      for (let i = 0; i < nl; i++) { const q = fr(hash(i, 21) + (RED() ? .5 : t * .3)), dx = hash(i, 22) - .5; H3.put(g, g.H, [dx * gw * 1.4 + dx * q * 1.6, -R0 + .2 - q * 1.5, -.15 - hash(i, 23) * .6], H3.giro(g, i + 9, t), .19, .19, .19, K.hemacia, .9, g.pecas.hem); }
      // presas na rede de fibrina
      const nt = Math.round(10 * E.fib);
      for (let i = 0; i < nt; i++) H3.put(g, g.H, [(hash(i, 31) - .5) * gw * 1.8, -R0 + (hash(i, 32) - .3) * .45, -.15 - hash(i, 33) * .5], H3.giro(g, i + 50, 0), .19, .19, .19, '#C8323F', 1, g.pecas.hem);
      H3.fim(g.H);
      // plaquetas: correm no sangue e se juntam na lesão (tampão)
      for (let i = 0; i < 18; i++) { const x = (fr(hash(i, 41) + t * sp) - .5) * Lx, r = Rx(x) * .85 * Math.sqrt(hash(i, 42)), a = Math.PI * (.95 + 1.1 * hash(i, 43)); H3.put(g, g.pq, [x, Math.cos(a) * r, Math.min(.15, Math.sin(a) * r)], H3.giro(g, i + 80, RED() ? 0 : t), .08, .04, .07, '#C9A6EE', 1, g.pecas.plaq); }
      const np = Math.round(E.plug * 44);
      for (let i = 0; i < np; i++) { const k = sst(0, 1, cl(E.plug * 44 - i, 0, 1)), dst = [(hash(i, 51) - .5) * gw * 2.1, -R0 + .05 + hash(i, 52) * .32, -.08 - hash(i, 53) * .75], ori = [dst[0] - 1.6, -R0 + .5, dst[2]]; H3.put(g, g.pq, lerp3(ori, dst, k), H3.giro(g, i + 120, 0), .11, .07, .1, '#E0B6FF', 1.05, g.pecas.plaq); }
      H3.fim(g.pq);
      // rede de fibrina: fios amarelos que crescem atravessando a lesão
      g.fios.forEach((F, i) => {
        const k = cl(E.fib * 1.4 - i / g.fios.length * .4, 0, 1); if (k <= .02) { F.set([]); return; }
        const c = [(hash(i, 61) - .5) * gw * 2.6, -R0 + (hash(i, 62) - .4) * .7, -.05 - hash(i, 63) * .6], a = hash(i, 64) * TAU, Lf = (.6 + .6 * hash(i, 65)) * k, d = [Math.cos(a) * Lf, Math.sin(a) * Lf * .6, (hash(i, 66) - .5) * Lf * .5];
        F.set(H3.onda(V.sub(c, d), add(c, d), .03, i, 14), .034);
      });
      // trombina (cascata) e cálcio: brilhos perto da lesão
      const nT = Math.round(16 * E.c[1]);
      for (let i = 0; i < nT; i++) { const f = fr(hash(i, 71) + (RED() ? 0 : t * .25)); H3.brilho(g, [(hash(i, 72) - .5) * 2, -R0 + .2 + f * .7, -.2 - hash(i, 73) * .6], .03 * Math.sin(f * Math.PI) + .008, '#FFB347', 1.3); }
      const nC = m && m.k === 'ca' ? 0 : Math.round(12 * cl(E.c[0] * 2, 0, 1) * (1 - E.c[2] * .5));
      for (let i = 0; i < nC; i++) { const f = fr(hash(i, 81) + (RED() ? 0 : t * .1)); H3.brilho(g, [(f - .5) * 4, (hash(i, 82) - .5) * 1.1, -.1 - hash(i, 83) * .6], .022, '#7FD8FF', 1.2); }
      if (nC) H3.ficha(g, [1.3, .2, -.3], 'Ca²⁺', '#7FD8FF', { pr: 2 });
      if (nT && E.c[1] > .5) H3.ficha(g, [-1.2, -.15, -.3], 'trombina', '#FFB347', { pr: 3 });
      ach(g, 'parede', [-2.6, Rx(-2.6), 0]);
      if (les) ach(g, 'lesao', [0, -R0 - .05, 0]);
      if (E.plug > .4) ach(g, 'plaq', [-gw * .6, -R0 + .2, -.2]);
      if (E.fib > .4) ach(g, 'fib', [gw * .5, -R0 + .3, -.3]);
    },
    sobre(g, S) {
      const E = g.E; if (!E) return; const A = area(), m = g.m, v = g.vt, et = g.et, lesion = v >= 5;
      const casH = NAR ? 3 * 40 + 8 : 96, cy0 = A.y1 - casH, yS = cy0 - (NAR ? 16 : 20);
      // situação do sangramento e etapa
      const st = !lesion ? 'vaso íntegro' : E.leak < .05 ? 'o sangramento parou' : v >= 99 ? 'o sangramento continua' : E.leak > .75 ? 'sangramento forte' : 'sangramento diminuindo';
      tx(st, A.x0 + 4, yS, { s: 13, w: 700, a: 'left', c: E.leak < .05 && lesion ? '#8FE3A0' : lesion ? '#FF8A8A' : C.dim });
      tx(NAR ? (m ? m.t : et ? 'etapa ' + et : 'antes da lesão') : m ? 'e se: ' + m.t : ETAPAS[et], A.x1 - 4, yS, { s: 13, w: 600, a: 'right', c: m ? '#FFB347' : C.dim });
      // cascata em três degraus
      const D = [{ a: 'tromboplastina e Ca²⁺', b: 'tromboplastina das plaquetas e do tecido lesado; Ca²⁺ do plasma' }, { a: 'protrombina vira trombina', b: 'proteína do fígado, depende da vitamina K' }, { a: 'fibrinogênio vira fibrina', b: 'fios insolúveis formam a rede' }];
      const falha = m ? m.falha : -1;
      D.forEach((d, i) => {
        const on = E.c[i], failed = falha === i && v >= 50 + i * 8; let x, y, w, h;
        if (NAR) { x = A.x0 + 22; w = A.w - 22; h = 34; y = cy0 + i * 40; } else { const gap = 34; w = (A.w - 2 * gap) / 3; h = casH - 8; x = A.x0 + i * (w + gap); y = cy0; }
        const bc = failed ? '#FF6B6B' : on > .99 ? '#FFB347' : 'rgba(255,255,255,.16)';
        rr(x, y, w, h, 10, on > 0 ? `rgba(60,44,20,${.55 + .35 * on})` : 'rgba(17,23,40,.86)', bc, failed || on > .99 ? 2 : 1);
        if (NAR) {
          tx(String(i + 1), A.x0 + 8, y + h / 2, { s: 13, w: 700, f: FD, c: C.dim, bg: false });
          tx(d.a, x + 10, y + h / 2, { s: 13, w: 700, a: 'left', c: on > 0 ? C.txt : C.dim, bg: false });
          if (failed) tx('falha', x + w - 10, y + h / 2, { s: 12, w: 700, a: 'right', c: '#FF8A8A', bg: false });
          if (i < 2) line(A.x0 + 8, y + h / 2 + 10, A.x0 + 8, y + h + 4, E.c[i + 1] > 0 ? '#FFB347' : C.dim, 1.5);
        } else {
          tx(`degrau ${i + 1}`, x + 12, y + 16, { s: 12, w: 600, f: FD, a: 'left', c: C.dim, bg: false });
          if (failed) tx('falha', x + w - 12, y + 16, { s: 12, w: 700, a: 'right', c: '#FF8A8A', bg: false });
          tx(d.a, x + 12, y + 40, { s: 14, w: 700, a: 'left', c: on > 0 ? C.txt : C.dim, bg: false });
          wrapTx(d.b, x + 12, y + 62, w - 24, { s: 12, a: 'left', c: C.dim, lh: 15 });
          if (i < 2) { const c = E.c[i + 1] > 0 ? '#FFB347' : C.dim; line(x + w + 6, y + h / 2, x + w + 28, y + h / 2, c, 1.6); circ(x + w + 28, y + h / 2, 3, c); }
        }
      });
      H3.reserva(g, [A.x0 - 6, yS - 12, A.w + 12, A.y1 - yS + 16]);
    },
    camera(g, P) {
      const lar = H3.deitado(g);
      if (lar) return cam(g, P, 4.3, 2.6, { th: .1, fi: .22, al: [0, -1.05, -.4], k: 1.02, viva: .4 });
      return cam(g, P, 2.4, 1, { th: .1, fi: .2, al: [0, -2.2, -.4], k: 1.02, viva: .4 });
    }
  });
  // quadrado da malha da parede que fica aberto na lesão (embaixo, no meio)
  function buraco(g, i, j) { const x = -g.Lx / 2 + g.Lx * i / g.nx, a = Math.PI * j / g.na; return Math.abs(x) < .55 && a < .75; }
})();
